import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { afterEach, describe, expect, it } from "vitest";

const sqlFiles = [
  "supabase/hardening_rls.sql",
  "supabase/migrate_new_db.sql",
  "supabase/migrate_custom_order_details.sql",
  "supabase/full_schema_v2.sql",
];

const sqlByFile = sqlFiles.map((file) => ({
  file,
  sql: readFileSync(resolve(process.cwd(), file), "utf8"),
}));

const USER_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const ATTEMPT_ID = "11111111-2222-4333-8444-555555555555";
const NEXT_ATTEMPT_ID = "21111111-2222-4333-8444-555555555555";
const RETRY_ATTEMPT_ID = "31111111-2222-4333-8444-555555555555";
const PRODUCT_ID = "99999999-8888-4777-8666-555555555555";
const ITEMS = [
  {
    id: PRODUCT_ID,
    quantity: 2,
    product_name: "Client supplied name",
    price: 0.01,
    customizations: { protein: "chicken" },
  },
];

function getFunction(sql: string, name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    sql.match(
      new RegExp(
        `CREATE OR REPLACE FUNCTION public\\.${escapedName}\\([\\s\\S]*?\\$\\$\\s*(?:LANGUAGE[^;]*;|;)`,
        "i",
      ),
    )?.[0] ?? ""
  );
}

const schema = `
  CREATE TABLE public.products (
    id UUID PRIMARY KEY, name TEXT, price NUMERIC, custom_options JSONB,
    is_available BOOLEAN
  );
  CREATE TABLE public.coupons (
    code TEXT PRIMARY KEY, is_active BOOLEAN, valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ, max_uses INTEGER, current_uses INTEGER,
    min_order_total NUMERIC, discount_type TEXT, discount_value NUMERIC
  );
  CREATE TABLE public.orders (
    id UUID PRIMARY KEY, order_number TEXT, tracking_token UUID, user_id UUID,
    order_type TEXT, client_name TEXT, client_email TEXT, client_phone TEXT,
    address TEXT, reference TEXT, latitude NUMERIC, longitude NUMERIC,
    distance_km NUMERIC, subtotal NUMERIC, discount_amount NUMERIC,
    coupon_code TEXT, delivery_fee NUMERIC, total NUMERIC, payment_method TEXT,
    payment_status TEXT, checkout_attempt_id UUID UNIQUE, status TEXT,
    notes TEXT, culqi_charge_id TEXT
  );
  CREATE TABLE public.order_items (
    order_id UUID, product_id UUID, product_name TEXT, unit_price NUMERIC,
    quantity INTEGER, subtotal NUMERIC, notes TEXT
  );
  CREATE TABLE public.driver_pins (order_id UUID, pin_code TEXT);
  CREATE FUNCTION public.calculate_delivery_fee(NUMERIC, NUMERIC)
  RETURNS NUMERIC LANGUAGE SQL AS 'SELECT 0::NUMERIC';
  CREATE SCHEMA auth;
  CREATE FUNCTION auth.uid() RETURNS UUID LANGUAGE SQL STABLE AS 'SELECT NULL::UUID';
`;

let databases: PGlite[] = [];

afterEach(async () => {
  await Promise.all(databases.map((database) => database.close()));
  databases = [];
});

describe.each(sqlByFile)("billing SQL runtime: $file", ({ sql }) => {
  it("ignores forged delivery values and prices structured options from the trusted catalog", async () => {
    const database = new PGlite();
    databases.push(database);
    await database.exec(schema);

    const distanceFunction = getFunction(sql, "calculate_delivery_distance_km");
    const deliveryFeeFunction = getFunction(sql, "calculate_delivery_fee");
    const createOrderFunction = getFunction(sql, "create_order_secure");
    const couponFunction =
      getFunction(sql, "apply_coupon_secure") ||
      getFunction(
        sqlByFile.find(({ file }) => file.endsWith("full_schema_v2.sql"))!.sql,
        "apply_coupon_secure",
      );
    const replicaIdentity = sql.match(
      /ALTER TABLE public\.orders REPLICA IDENTITY FULL;/i,
    )?.[0];
    expect(distanceFunction).not.toBe("");
    expect(deliveryFeeFunction).not.toBe("");
    expect(createOrderFunction).not.toBe("");
    expect(couponFunction).not.toBe("");
    expect(replicaIdentity).toBeDefined();
    await database.exec(
      [
        distanceFunction,
        deliveryFeeFunction,
        couponFunction,
        replicaIdentity,
        createOrderFunction,
      ].join("\n"),
    );
    expect(
      (
        await database.query(
          `SELECT relreplident FROM pg_class WHERE oid = 'public.orders'::regclass`,
        )
      ).rows[0],
    ).toEqual({ relreplident: "f" });

    await database.query(
      `INSERT INTO public.products VALUES ($1, 'Catalog pasta', 30, $2::jsonb, TRUE)`,
      [
        PRODUCT_ID,
        JSON.stringify([
          {
            id: "proteina",
            options: [{ id: "pollo_grill", name: "Pollo al grill", price: 40 }],
          },
        ]),
      ],
    );

    const result = await database.query(
      `SELECT public.create_order_secure(
        'Buyer', 'buyer@example.com', '555', 'delivery', 'cash',
        $1::jsonb, 'Address', NULL, -13.1628496, -74.2178801, 8, 0, NULL, NULL
      ) AS result`,
      [
        JSON.stringify([
          {
            id: PRODUCT_ID,
            quantity: 1,
            product_name: "Pasta",
            unit_price: 0.01,
            customizations: { proteina: "pollo_grill" },
          },
        ]),
      ],
    );
    const order = (result.rows[0] as { result: { id: string; subtotal: number; delivery_fee: number; total: number } }).result;
    expect(order).toMatchObject({ subtotal: 40, delivery_fee: 5, total: 45 });
    const stored = await database.query(
      `SELECT distance_km, delivery_fee, total FROM public.orders WHERE id = $1`,
      [order.id],
    );
    expect(
      Object.fromEntries(
        Object.entries(stored.rows[0] as Record<string, unknown>).map(([key, value]) => [
          key,
          Number(value),
        ]),
      ),
    ).toMatchObject({ distance_km: 0, delivery_fee: 5, total: 45 });
    const storedItem = await database.query(
      `SELECT unit_price, subtotal FROM public.order_items WHERE order_id = $1`,
      [order.id],
    );
    expect(
      Object.fromEntries(
        Object.entries(storedItem.rows[0] as Record<string, unknown>).map(([key, value]) => [
          key,
          Number(value),
        ]),
      ),
    ).toMatchObject({ unit_price: 40, subtotal: 40 });
    await expect(
      database.query(
        `SELECT public.create_order_secure(
          'Buyer', 'buyer@example.com', '555', 'delivery', 'cash',
          $1::jsonb, 'Address', NULL, -13.1628496, -74.2178801, 0, 100, NULL, NULL
        )`,
        [
          JSON.stringify([
            {
              id: PRODUCT_ID,
              quantity: 1,
              customizations: { proteina: "missing-option" },
            },
          ]),
        ],
      ),
    ).rejects.toThrow(/personalización inválida/i);
    await expect(
      database.query(
        `SELECT public.create_order_secure(
          'Buyer', 'buyer@example.com', '555', 'delivery', 'cash',
          $1::jsonb, 'Address', NULL, 10, 10, 0, 0, NULL, NULL
        )`,
        [
          JSON.stringify([
            {
              id: PRODUCT_ID,
              quantity: 1,
              customizations: { proteina: "pollo_grill" },
            },
          ]),
        ],
      ),
    ).rejects.toThrow(/fuera de la zona/i);
  }, 30_000);

  it("calculates trusted totals, validates completion, replays, and releases failed reservations once", async () => {
    const database = new PGlite();
    databases.push(database);
    await database.exec(schema);

    const couponFunction =
      getFunction(sql, "apply_coupon_secure") ||
      getFunction(
        sqlByFile.find(({ file }) => file.endsWith("full_schema_v2.sql"))!.sql,
        "apply_coupon_secure",
      );
    const pendingFunction = getFunction(sql, "create_pending_card_order");
    const completeFunction = getFunction(sql, "complete_card_order_payment");
    const failFunction = getFunction(sql, "fail_card_order_attempt");
    expect(couponFunction).not.toBe("");
    expect(pendingFunction).not.toBe("");
    expect(completeFunction).not.toBe("");
    expect(failFunction).not.toBe("");
    await database.exec(
      [couponFunction, pendingFunction, completeFunction, failFunction].join("\n"),
    );

    await database.query(
      `INSERT INTO public.products VALUES ($1, 'Catalog pasta', 30, $2::jsonb, TRUE)`,
      [
        PRODUCT_ID,
        JSON.stringify([
          {
            id: "protein",
            options: [{ id: "chicken", name: "Chicken", price: 40 }],
          },
        ]),
      ],
    );
    await database.query(
      `INSERT INTO public.coupons VALUES ('SAVE10', TRUE, NULL, NULL, 1, 0, 0, 'percentage', 10)`,
    );

    const callPending = async (attemptId: string) => {
      const result = await database.query(
        `SELECT public.create_pending_card_order(
          '${attemptId}'::uuid, '${USER_ID}'::uuid, 'Buyer', 'buyer@example.com',
          '555', 'pickup', '${JSON.stringify(ITEMS)}'::jsonb, NULL, NULL,
          NULL, NULL, 'SAVE10', NULL
        ) AS result`,
      );
      return (
        result.rows[0] as {
          result: {
            created: boolean;
            order_id: string;
            payment_status: string;
            subtotal: number;
            discount_amount: number;
            total: number;
          };
        }
      ).result;
    };

    const pending = await callPending(ATTEMPT_ID);
    expect(pending).toMatchObject({
      created: true,
      payment_status: "pending",
      subtotal: 80,
      discount_amount: 8,
      total: 72,
    });
    const savedItem = await database.query(
      `SELECT product_name, unit_price, quantity, subtotal
       FROM public.order_items WHERE order_id = $1`,
      [pending.order_id],
    );
    const savedItemRow = savedItem.rows[0] as Record<string, unknown>;
    expect(savedItemRow).toMatchObject({
      product_name: "Client supplied name",
      quantity: 2,
    });
    expect(Number(savedItemRow.unit_price)).toBe(40);
    expect(Number(savedItemRow.subtotal)).toBe(80);

    const atCouponLimit = await callPending(NEXT_ATTEMPT_ID);
    expect(atCouponLimit.discount_amount).toBe(0);
    expect(
      (await database.query(`SELECT current_uses FROM public.coupons WHERE code = 'SAVE10'`))
        .rows[0],
    ).toEqual({ current_uses: 1 });
    await database.query(
      `SELECT public.fail_card_order_attempt('${NEXT_ATTEMPT_ID}'::uuid, 'no reservation')`,
    );
    expect(
      (await database.query(`SELECT current_uses FROM public.coupons WHERE code = 'SAVE10'`))
        .rows[0],
    ).toEqual({ current_uses: 1 });

    await expect(
      database.query(
        `SELECT public.complete_card_order_payment(
          '${pending.order_id}'::uuid, '${ATTEMPT_ID}'::uuid, 'chr_test', 7100, 'PEN'
        )`,
      ),
    ).rejects.toThrow();
    await expect(
      database.query(
        `SELECT public.complete_card_order_payment(
          '${pending.order_id}'::uuid, '${ATTEMPT_ID}'::uuid, 'chr_test', 7200, 'USD'
        )`,
      ),
    ).rejects.toThrow();
    expect(
      (
        await database.query(`SELECT payment_status FROM public.orders WHERE id = $1`, [
          pending.order_id,
        ])
      ).rows[0],
    ).toEqual({ payment_status: "pending" });

    await database.query(
      `SELECT public.fail_card_order_attempt('${ATTEMPT_ID}'::uuid, 'declined')`,
    );
    expect(
      (await database.query(`SELECT current_uses FROM public.coupons WHERE code = 'SAVE10'`))
        .rows[0],
    ).toEqual({ current_uses: 0 });
    await database.query(
      `SELECT public.fail_card_order_attempt('${ATTEMPT_ID}'::uuid, 'declined again')`,
    );
    expect(
      (await database.query(`SELECT current_uses FROM public.coupons WHERE code = 'SAVE10'`))
        .rows[0],
    ).toEqual({ current_uses: 0 });

    const retried = await callPending(RETRY_ATTEMPT_ID);
    expect(retried.discount_amount).toBe(8);
    const replay = await callPending(RETRY_ATTEMPT_ID);
    expect(replay.created).toBe(false);
    expect(
      (await database.query(`SELECT current_uses FROM public.coupons WHERE code = 'SAVE10'`))
        .rows[0],
    ).toEqual({ current_uses: 1 });

    const paid = await database.query(
      `SELECT public.complete_card_order_payment(
        '${retried.order_id}'::uuid, '${RETRY_ATTEMPT_ID}'::uuid, 'chr_test', 7200, 'PEN'
      ) AS result`,
    );
    expect((paid.rows[0] as { result: unknown }).result).toMatchObject({
      payment_status: "paid",
    });
    const paidReplay = await database.query(
      `SELECT public.complete_card_order_payment(
        '${retried.order_id}'::uuid, '${RETRY_ATTEMPT_ID}'::uuid, 'chr_test', 7200, 'PEN'
      ) AS result`,
    );
    expect((paidReplay.rows[0] as { result: unknown }).result).toMatchObject({
      payment_status: "paid",
    });
    expect(
      (await database.query(`SELECT current_uses FROM public.coupons WHERE code = 'SAVE10'`))
        .rows[0],
    ).toEqual({ current_uses: 1 });
  }, 30_000);
});
