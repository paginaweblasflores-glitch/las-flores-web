import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import cardCheckoutHandler from "../../api/culqi-charge";
import { createClient } from "@supabase/supabase-js";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient,
}));

const orderSqlFiles = [
  "supabase/hardening_rls.sql",
  "supabase/migrate_new_db.sql",
  "supabase/migrate_custom_order_details.sql",
  "supabase/full_schema_v2.sql",
];

const sqlByFile = orderSqlFiles.map((file) => ({
  file,
  sql: readFileSync(resolve(process.cwd(), file), "utf8"),
}));
const liveProductsSource = readFileSync(resolve(process.cwd(), "src/lib/liveProducts.ts"), "utf8");
const cartSidebarSource = readFileSync(
  resolve(process.cwd(), "src/components/CartSidebar.tsx"),
  "utf8",
);
const supabaseClientSource = readFileSync(resolve(process.cwd(), "src/lib/supabase.ts"), "utf8");
const cashierRouteSource = readFileSync(resolve(process.cwd(), "src/routes/caja.tsx"), "utf8");

function getCreateOrderSecure(sql: string) {
  return (
    sql.match(
      /CREATE OR REPLACE FUNCTION public\.create_order_secure[\s\S]*?GRANT EXECUTE ON FUNCTION public\.create_order_secure/i,
    )?.[0] ?? ""
  );
}

function expectMatch(source: string, pattern: RegExp) {
  expect(pattern.test(source)).toBe(true);
}

const USER_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const ATTEMPT_ID = "11111111-2222-4333-8444-555555555555";
const ORDER_ID = "66666666-7777-4888-8999-aaaaaaaaaaaa";
const PRODUCT_ID = "99999999-8888-4777-8666-555555555555";
const SERVICE_ROLE_KEY = "test-service-role-key";
const VERIFIED_CHARGE = {
  object: "charge",
  id: "chr_verified",
  paid: true,
  capture: true,
  amount: 4000,
  currency_code: "PEN",
  metadata: {
    checkout_attempt_id: "11111111-2222-4333-8444-555555555555",
    order_id: "66666666-7777-4888-8999-aaaaaaaaaaaa",
  },
  outcome: { type: "venta_exitosa" },
};

const mockState = vi.hoisted(() => ({
  user: {
    id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
    email: "authenticated@example.com",
    user_metadata: { full_name: "Authenticated Customer" },
  },
  products: [
    {
      id: "99999999-8888-4777-8666-555555555555",
      name: "Pasta",
      price: 30,
      is_available: true,
      custom_options: [
        {
          id: "proteina",
          title: "1. Proteína",
          options: [{ id: "pollo_grill", name: "Pollo al grill", price: 40 }],
        },
      ],
    },
  ],
  pendingAttempt: {
    created: true,
    payment_status: "pending",
    order_id: "66666666-7777-4888-8999-aaaaaaaaaaaa",
    order_number: "LF-1234",
    total: 40,
  },
  rpcCalls: [] as Array<{ name: string; args: Record<string, unknown> }>,
}));

vi.mocked(createClient).mockImplementation((_url: string, key: string) => {
  if (key === "anon-key") {
    return {
      auth: {
        getUser: vi.fn(async (token?: string) => ({
          data: { user: token === "access-token" ? mockState.user : null },
          error: token === "access-token" ? null : new Error("Invalid token"),
        })),
      },
    } as never;
  }

  return {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      in: vi.fn(async () => ({ data: mockState.products, error: null })),
    })),
    rpc: vi.fn(async (name: string, args: Record<string, unknown>) => {
      mockState.rpcCalls.push({ name, args });
      if (name === "create_pending_card_order") {
        return { data: mockState.pendingAttempt, error: null };
      }
      if (name === "complete_card_order_payment") {
        return {
          data: {
            payment_status: "paid",
            order_id: mockState.pendingAttempt.order_id,
            order_number: mockState.pendingAttempt.order_number,
            subtotal: 40,
            discount_amount: 0,
            delivery_fee: 0,
            total: 40,
          },
          error: null,
        };
      }
      return { data: { success: true, payment_status: "failed" }, error: null };
    }),
  } as never;
});

function createResponse() {
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
    end() {
      return this;
    },
    setHeader() {},
  };
  return response;
}

function createRequest(
  overrides: Record<string, unknown> = {},
  authorization: string | undefined = "Bearer access-token",
) {
  return {
    method: "POST",
    headers: {
      authorization,
      origin: "https://restaurantelasflores.com",
    } as Record<string, string | undefined>,
    body: {
      tokenId: "tok_test",
      checkoutAttemptId: ATTEMPT_ID,
      orderType: "pickup",
      amount: 4000,
      items: [
        {
          productId: PRODUCT_ID,
          quantity: 1,
          customizations: { Proteína: "Pollo al grill" },
        },
      ],
      ...overrides,
    },
  };
}

function mockProviderFetch(charge = VERIFIED_CHARGE) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, init });
      if (url.endsWith("/v2/charges")) {
        return new Response(JSON.stringify({ id: charge.id }), { status: 201 });
      }
      return new Response(JSON.stringify(charge), { status: 200 });
    }),
  );
  return calls;
}

beforeEach(() => {
  vi.stubEnv("CULQI_SECRET_KEY", "sk_test_payment");
  vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-key");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", SERVICE_ROLE_KEY);
  mockState.rpcCalls = [];
  mockState.pendingAttempt = {
    created: true,
    payment_status: "pending",
    order_id: ORDER_ID,
    order_number: "LF-1234",
    total: 40,
  };
});

describe("secure order pricing SQL", () => {
  it.each(sqlByFile)("uses the UI spaghetti-pesto section ID in $file", ({ sql }) => {
    const spaghettiPestoSeed =
      sql.match(
        /WHEN name ILIKE '%espagueti%pesto%' THEN \$options\$([\s\S]*?)\$options\$::jsonb/i,
      )?.[1] ?? "";

    expectMatch(liveProductsSource, /id:\s*"proteina"/);
    expectMatch(spaghettiPestoSeed, /"id"\s*:\s*"proteina"/);
    expect(spaghettiPestoSeed).not.toMatch(/"id"\s*:\s*"1\._proteína"/i);
  });

  it("prevents staff product updates from changing trusted customization options", () => {
    const hardeningSql =
      sqlByFile.find(({ file }) => file === "supabase/hardening_rls.sql")?.sql ?? "";
    const staffUpdatePolicy =
      hardeningSql.match(/CREATE POLICY "products_availability_staff_update"[\s\S]*?;/i)?.[0] ?? "";
    const staffEditGuard =
      hardeningSql.match(
        /CREATE OR REPLACE FUNCTION public\.prevent_staff_product_edits\(\)[\s\S]*?\$\$;/i,
      )?.[0] ?? "";

    expectMatch(staffUpdatePolicy, /FOR UPDATE[\s\S]*?public\.is_staff\(\)/i);
    expectMatch(
      staffEditGuard,
      /IF NOT public\.is_admin\(\)\s+AND\s*\([\s\S]*NEW\.custom_options\s+IS DISTINCT FROM OLD\.custom_options[\s\S]*\)\s+THEN/i,
    );
    expectMatch(
      hardeningSql,
      /CREATE TRIGGER products_availability_staff_only\s+BEFORE UPDATE ON public\.products[\s\S]*?EXECUTE FUNCTION public\.prevent_staff_product_edits\(\)/i,
    );
  });

  it("protects trusted customization options in the existing-database migration", () => {
    const migrationSql =
      sqlByFile.find(({ file }) => file === "supabase/migrate_custom_order_details.sql")?.sql ?? "";
    const customOptionsGuard =
      migrationSql.match(
        /CREATE OR REPLACE FUNCTION public\.prevent_staff_custom_options_edits\(\)[\s\S]*?\$\$;/i,
      )?.[0] ?? "";

    expectMatch(
      customOptionsGuard,
      /IF NOT public\.is_admin\(\)\s+AND\s+NEW\.custom_options\s+IS DISTINCT FROM OLD\.custom_options\s+THEN/i,
    );
    expectMatch(
      migrationSql,
      /CREATE TRIGGER products_custom_options_admin_only\s+BEFORE UPDATE ON public\.products[\s\S]*?EXECUTE FUNCTION public\.prevent_staff_custom_options_edits\(\)/i,
    );
  });

  it.each(["supabase/migrate_new_db.sql", "supabase/full_schema_v2.sql"])(
    "restricts product update policies to admins in %s",
    (file) => {
      const sql = sqlByFile.find((entry) => entry.file === file)?.sql ?? "";
      const productPolicies = sql
        .split(";")
        .filter(
          (statement) => /CREATE POLICY/i.test(statement) && /ON public\.products/i.test(statement),
        );
      const productUpdatePolicies = productPolicies.filter((policy) =>
        /\bFOR\s+(?:ALL|UPDATE)\b/i.test(policy),
      );

      expect(productUpdatePolicies.length).toBeGreaterThan(0);
      expect(productUpdatePolicies.every((policy) => /public\.is_admin\(\)/i.test(policy))).toBe(
        true,
      );
      expectMatch(
        sql,
        /DROP POLICY IF EXISTS "Modificación de productos solo autenticados" ON public\.products/i,
      );
      expectMatch(
        sql,
        /DROP POLICY IF EXISTS "products_availability_staff_update" ON public\.products/i,
      );
      expectMatch(
        sql,
        /DROP POLICY IF EXISTS "Enable update for authenticated users" ON public\.products/i,
      );
    },
  );

  it.each(sqlByFile)(
    "ignores caller prices and validates server-owned options in $file",
    ({ sql }) => {
      const definition = getCreateOrderSecure(sql);

      expect(
        /v_(?:product_)?price\s*:=\s*COALESCE\(\(v_item->>'unit_price'\)/i.test(definition),
      ).toBe(false);
      expect(/v_item\s*->>\s*'unit_price'/i.test(definition)).toBe(false);
      expectMatch(definition, /SELECT\s+name,\s*price,\s*custom_options,\s*is_available/i);
      expect(
        definition.match(/jsonb_each_text\s*\(\s*COALESCE\(v_item->'customizations'/gi)?.length,
      ).toBe(1);
      expectMatch(definition, /jsonb_array_elements\s*\(\s*COALESCE\(v_custom_options/i);
      expectMatch(
        definition,
        /RAISE EXCEPTION[^;]*(?:opci[oó]n|personalizaci[oó]n)[^;]*inv[aá]lid/i,
      );
      expectMatch(definition, /v_priced_items\s*:=\s*v_priced_items\s*\|\|/i);
      expectMatch(definition, /jsonb_array_elements\s*\(\s*v_priced_items\s*\)/i);
    },
  );

  it.each(sqlByFile)(
    "stores the approved server-owned customization catalog in $file",
    ({ sql }) => {
      expectMatch(sql, /custom_options\s+JSONB/i);
      expectMatch(sql, /UPDATE public\.products[\s\S]*?custom_options\s*=\s*CASE/i);
      const approvedOptions = [
        ["papas_fritas_francesas", 0],
        ["papas_salteadas_mantequilla", 0],
        ["ensalada_organica", 0],
        ["ensalada_sancochada", 0],
        ["milanesa", 42],
        ["pollo_grill", 40],
        ["filet_mignon", 46],
        ["lomo_saltado", 44],
        ["medio_cuy", 38],
        ["cuy_entero", 68],
        ["medio_cuy", 42],
        ["cuy_entero", 72],
        ["mixto_clasico", 52],
        ["mixto_deshuesado", 58],
      ] as const;

      for (const [id, price] of approvedOptions) {
        expectMatch(
          sql,
          new RegExp(
            `"id"\\s*:\\s*"${id}"\\s*,\\s*"name"\\s*:\\s*"[^"]+"\\s*,\\s*"price"\\s*:\\s*${price}`,
          ),
        );
      }
    },
  );

  it.each(sqlByFile)("bounds and validates order inputs in $file", ({ sql }) => {
    const definition = getCreateOrderSecure(sql);

    expectMatch(definition, /jsonb_typeof\(p_items\)\s*<>\s*'array'/i);
    expectMatch(definition, /v_item_count\s*>\s*100/i);
    expectMatch(definition, /v_quantity\s*<=\s*0[\s\S]*?v_quantity\s*>\s*99/i);
    expectMatch(definition, /p_order_type\s+NOT IN\s*\(\s*'delivery'\s*,\s*'pickup'\s*\)/i);
    expectMatch(
      definition,
      /p_payment_method\s+NOT IN\s*\(\s*'yape'\s*,\s*'cash'\s*,\s*'efectivo'\s*\)/i,
    );
  });

  it.each(sqlByFile)("limits public orders to unpaid payment methods in $file", ({ sql }) => {
    const definition = getCreateOrderSecure(sql);

    expectMatch(
      definition,
      /p_payment_method\s+NOT IN\s*\(\s*'yape'\s*,\s*'cash'\s*,\s*'efectivo'\s*\)/i,
    );
    expect(definition).not.toMatch(
      /GRANT EXECUTE ON FUNCTION public\.create_order_secure TO anon/i,
    );
    expectMatch(sql, /GRANT EXECUTE ON FUNCTION public\.create_order_secure TO authenticated/i);
  });

  it.each(sqlByFile)("keeps paid-order RPCs service-role only in $file", ({ sql }) => {
    expectMatch(
      sql,
      /CREATE OR REPLACE FUNCTION public\.create_pending_card_order\([\s\S]*?REVOKE ALL ON FUNCTION public\.create_pending_card_order\([\s\S]*?FROM PUBLIC, anon, authenticated[\s\S]*?GRANT EXECUTE ON FUNCTION public\.create_pending_card_order\([\s\S]*?TO service_role/i,
    );
    expectMatch(
      sql,
      /CREATE OR REPLACE FUNCTION public\.complete_card_order_payment\([\s\S]*?REVOKE ALL ON FUNCTION public\.complete_card_order_payment\([\s\S]*?FROM PUBLIC, anon, authenticated[\s\S]*?GRANT EXECUTE ON FUNCTION public\.complete_card_order_payment\([\s\S]*?TO service_role/i,
    );
    expectMatch(
      sql,
      /CREATE OR REPLACE FUNCTION public\.fail_card_order_attempt\([\s\S]*?REVOKE ALL ON FUNCTION public\.fail_card_order_attempt\([\s\S]*?FROM PUBLIC, anon, authenticated[\s\S]*?GRANT EXECUTE ON FUNCTION public\.fail_card_order_attempt\([\s\S]*?TO service_role/i,
    );
  });

  it.each(sqlByFile)(
    "persists separate card payment state and attempt fields in $file",
    ({ sql }) => {
      expectMatch(
        sql,
        /CHECK\s*\(\s*payment_status IS NULL OR payment_status IN \('pending', 'paid', 'failed'\)\s*\)/i,
      );
      expectMatch(sql, /culqi_charge_id\s+TEXT/i);
      expectMatch(sql, /checkout_attempt_id\s+UUID/i);
      expectMatch(
        sql,
        /CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_attempt_id_idx[\s\S]*?ON public\.orders\(checkout_attempt_id\)/i,
      );
      expectMatch(sql, /payment_method\s+IN\s*\([^)]*'card'[^)]*\)/i);
    },
  );

  it.each(sqlByFile)(
    "prices pending card customizations from the trusted catalog in $file",
    ({ sql }) => {
      const pendingOrder =
        sql.match(
          /CREATE OR REPLACE FUNCTION public\.create_pending_card_order\([\s\S]*?\$\$;/i,
        )?.[0] ?? "";

      expectMatch(pendingOrder, /SELECT\s+name,\s*price,\s*custom_options,\s*is_available/i);
      expectMatch(pendingOrder, /jsonb_each_text\s*\(\s*COALESCE\(v_item->'customizations'/i);
      expectMatch(pendingOrder, /jsonb_array_elements\s*\(\s*COALESCE\(v_custom_options/i);
      expectMatch(
        pendingOrder,
        /v_total\s*:=\s*GREATEST\(0,\s*v_subtotal\s*-\s*v_discount\s*\+\s*v_fee\s*\)/i,
      );
    },
  );

  it.each(sqlByFile)(
    "serializes coupon reservations and releases only a failed pending reservation in $file",
    ({ sql }) => {
      const pendingOrder =
        sql.match(
          /CREATE OR REPLACE FUNCTION public\.create_pending_card_order\([\s\S]*?\$\$\s*;/i,
        )?.[0] ?? "";
      const publicOrder = getCreateOrderSecure(sql);
      const failAttempt =
        sql.match(
          /CREATE OR REPLACE FUNCTION public\.fail_card_order_attempt\([\s\S]*?\$\$\s*;/i,
        )?.[0] ?? "";

      expectMatch(
        publicOrder,
        /PERFORM 1 FROM public\.coupons[\s\S]*?FOR UPDATE[\s\S]*?apply_coupon_secure/i,
      );
      expectMatch(
        pendingOrder,
        /PERFORM 1 FROM public\.coupons[\s\S]*?FOR UPDATE[\s\S]*?apply_coupon_secure/i,
      );
      expectMatch(
        failAttempt,
        /UPDATE public\.orders SET payment_status = 'failed'[\s\S]*?payment_status = 'pending'[\s\S]*?RETURNING[\s\S]*?coupon_code[\s\S]*?IF FOUND THEN[\s\S]*?UPDATE public\.coupons SET current_uses = GREATEST\(current_uses - 1, 0\)/i,
      );
    },
  );

  it.each(sqlByFile)(
    "blocks direct order inserts and unverified payment-state edits in $file",
    ({ sql }) => {
      expectMatch(
        sql,
        /CREATE POLICY "orders_insert_via_rpc_only" ON public\.orders FOR INSERT\s+WITH CHECK \(false\)/i,
      );
      expectMatch(
        sql,
        /CREATE OR REPLACE FUNCTION public\.prevent_unverified_card_payment_edits\(\)[\s\S]*?NEW\.payment_status IS DISTINCT FROM OLD\.payment_status[\s\S]*?NEW\.culqi_charge_id IS DISTINCT FROM OLD\.culqi_charge_id[\s\S]*?auth\.role\(\)[\s\S]*?RAISE EXCEPTION/i,
      );
      expectMatch(
        sql,
        /CREATE TRIGGER orders_payment_fields_service_only\s+BEFORE UPDATE ON public\.orders[\s\S]*?EXECUTE FUNCTION public\.prevent_unverified_card_payment_edits\(\)/i,
      );
    },
  );

  it("routes card checkout only through the authenticated API, never a browser-side charge fallback", () => {
    expect(cartSidebarSource).not.toMatch(/processCulqiCharge/);
    expectMatch(cartSidebarSource, /Authorization:\s*`Bearer \$\{session\.access_token\}`/);
    expectMatch(
      cartSidebarSource,
      /paymentMethod\s*===\s*"culqi"[\s\S]*?:\s*await createOrder\(orderData\)/,
    );
    expectMatch(supabaseClientSource, /payment_method\.toLowerCase\(\)[\s\S]*?servicio de pagos/i);
    expectMatch(
      cashierRouteSource,
      /\.or\("payment_status\.eq\.paid,and\(payment_status\.is\.null,payment_method\.not\.in\.\(card,culqi\)\)"\)/,
    );
  });
});

describe("verified card checkout endpoint", () => {
  it("requires a valid bearer token and never accepts a caller-supplied user identity", async () => {
    mockProviderFetch();
    const response = createResponse();
    await cardCheckoutHandler(
      createRequest({
        user_id: "ffffffff-eeee-4ddd-8ccc-bbbbbbbbbbbb",
        client_email: "spoofed@example.com",
        payment_method: "cash",
        status: "paid",
        amount: 1,
      }),
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(mockState.rpcCalls[0]?.args.p_user_id).toBe(USER_ID);
    expect(mockState.rpcCalls[0]?.args.p_client_email).toBe("authenticated@example.com");
    expect(mockState.rpcCalls[0]?.args.p_payment_method).toBeUndefined();
    expect(mockState.rpcCalls[0]?.args.p_status).toBeUndefined();
    const chargeBody = JSON.parse((fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]?.body);
    expect(chargeBody).toMatchObject({ email: "authenticated@example.com", amount: 4000 });
  });

  it.each([
    ["missing bearer token", undefined],
    ["invalid bearer token", "Bearer invalid-token"],
  ])("rejects %s before creating or charging an order", async (_label, authorization) => {
    const calls = mockProviderFetch();
    const response = createResponse();
    await cardCheckoutHandler(createRequest({}, authorization || ""), response);

    expect(response.statusCode).toBe(401);
    expect(mockState.rpcCalls).toHaveLength(0);
    expect(calls).toHaveLength(0);
  });

  it("persists a pending order before charging and only marks it paid after provider verification", async () => {
    const calls = mockProviderFetch();
    const response = createResponse();
    await cardCheckoutHandler(createRequest(), response);

    expect(response.statusCode).toBe(200);
    expect(calls.map(({ url }) => url)).toEqual([
      "https://api.culqi.com/v2/charges",
      "https://api.culqi.com/v2/charges/chr_verified",
    ]);
    expect(mockState.rpcCalls.map(({ name }) => name)).toEqual([
      "create_pending_card_order",
      "complete_card_order_payment",
    ]);
    expect(calls[0].init?.body).toContain(`"checkout_attempt_id":"${ATTEMPT_ID}"`);
    expect(mockState.rpcCalls[0].args.p_items).toEqual([
      {
        id: PRODUCT_ID,
        quantity: 1,
        product_name: "Pasta",
        notes: "Proteína: Pollo al grill",
        customizations: { proteina: "pollo_grill" },
      },
    ]);
    expect(mockState.rpcCalls[1].args).toMatchObject({
      p_order_id: ORDER_ID,
      p_checkout_attempt_id: ATTEMPT_ID,
      p_charge_id: "chr_verified",
      p_amount: 4000,
      p_currency_code: "PEN",
    });
  });

  it.each([
    ["unpaid", { ...VERIFIED_CHARGE, paid: false }],
    ["wrong currency", { ...VERIFIED_CHARGE, currency_code: "USD" }],
    ["wrong amount", { ...VERIFIED_CHARGE, amount: 4001 }],
    [
      "wrong attempt association",
      {
        ...VERIFIED_CHARGE,
        metadata: { ...VERIFIED_CHARGE.metadata, checkout_attempt_id: "other" },
      },
    ],
  ])("does not complete an order when Culqi reports %s", async (_label, charge) => {
    mockProviderFetch(charge);
    const response = createResponse();
    await cardCheckoutHandler(createRequest(), response);

    expect(response.statusCode).toBe(202);
    expect(mockState.rpcCalls.map(({ name }) => name)).toEqual(["create_pending_card_order"]);
    expect(response.body).toMatchObject({ paymentStatus: "pending", reconciliationRequired: true });
  });

  it.each(["pending", "paid", "failed"])(
    "returns the persisted %s state of an existing attempt without charging again",
    async (paymentStatus) => {
      mockState.pendingAttempt = {
        created: false,
        payment_status: paymentStatus,
        order_id: ORDER_ID,
        order_number: "LF-1234",
        total: 40,
      };
      const calls = mockProviderFetch();
      const response = createResponse();
      await cardCheckoutHandler(createRequest(), response);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({ paymentStatus, orderId: ORDER_ID });
      expect(mockState.rpcCalls.map(({ name }) => name)).toEqual(["create_pending_card_order"]);
      expect(calls).toHaveLength(0);
    },
  );

  it("fails closed when the service-role key is missing", async () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    const calls = mockProviderFetch();
    const response = createResponse();
    await cardCheckoutHandler(createRequest(), response);

    expect(response.statusCode).toBe(500);
    expect(mockState.rpcCalls).toHaveLength(0);
    expect(calls).toHaveLength(0);
  });
});
