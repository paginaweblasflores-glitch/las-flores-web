import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { afterEach, describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/salon_orders.sql"), "utf8");
const WAITER_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const OTHER_WAITER_ID = "cccccccc-dddd-4eee-8fff-aaaaaaaaaaaa";
const CASHIER_ID = "bbbbbbbb-cccc-4ddd-8eee-ffffffffffff";
const ZONE_ID = "salon-principal";
const FOOD_ID = "99999999-8888-4777-8666-555555555555";
const DRINK_ID = "99999999-8888-4777-8666-555555555556";
const REQUEST_ID = "11111111-2222-4333-8444-555555555555";

const schema = `
  CREATE ROLE authenticated;
  CREATE ROLE anon;
  CREATE TABLE public.profiles (id UUID PRIMARY KEY, full_name TEXT, role TEXT, email TEXT);
  CREATE TABLE public.restaurant_zones (
    id TEXT PRIMARY KEY, is_active BOOLEAN, max_tables_count INTEGER, sort_order INTEGER
  );
  CREATE TABLE public.categories (
    id UUID PRIMARY KEY, name TEXT, slug TEXT
  );
  CREATE TABLE public.products (
    id UUID PRIMARY KEY, category_id UUID, name TEXT, price NUMERIC,
    is_available BOOLEAN, custom_options JSONB
  );
  CREATE SCHEMA auth;
  CREATE FUNCTION auth.uid() RETURNS UUID LANGUAGE SQL STABLE
    AS 'SELECT NULLIF(current_setting(''test.user_id'', TRUE), '''')::UUID';
`;

const items = [
  { product_id: FOOD_ID, unit_price: 32, quantity: 2, customizations: { size: "large" } },
  { product_id: DRINK_ID, unit_price: 8, quantity: 1, customizations: {} },
];

let databases: PGlite[] = [];

afterEach(async () => {
  await Promise.all(databases.map((database) => database.close()));
  databases = [];
});

async function createDatabase() {
  const database = new PGlite();
  databases.push(database);
  await database.exec(schema);
  await database.exec(migration);
  await database.query(
    `INSERT INTO public.profiles VALUES
      ($1, 'Marta Mozo', 'staff', 'marta@example.com'),
      ($2, 'Lucía Caja', 'cashier', 'lucia@example.com')`,
    [WAITER_ID, CASHIER_ID],
  );
  await database.query(
    `INSERT INTO public.profiles VALUES ($1, 'José Mozo', 'staff', 'jose@example.com')`,
    [OTHER_WAITER_ID],
  );
  await database.query(`INSERT INTO public.restaurant_zones VALUES ($1, TRUE, 8, 1)`, [ZONE_ID]);
  await database.query(
    `INSERT INTO public.categories VALUES
      ('aaaaaaaa-0000-4000-8000-000000000001', 'Platos típicos', 'tipicos'),
      ('aaaaaaaa-0000-4000-8000-000000000002', 'Bebidas', 'bebidas')`,
  );
  await database.query(
    `INSERT INTO public.products VALUES
      ($1, 'aaaaaaaa-0000-4000-8000-000000000001', 'Puca picante', 25, TRUE,
       '[{"id":"size","title":"Tamaño","options":[{"id":"large","name":"Grande","price":32}]}]'),
      ($2, 'aaaaaaaa-0000-4000-8000-000000000002', 'Chicha', 8, TRUE, '[]')`,
    [FOOD_ID, DRINK_ID],
  );
  return database;
}

async function setUser(database: PGlite, userId: string) {
  await database.query(`SELECT set_config('test.user_id', $1, FALSE)`, [userId]);
}

describe("salon database workflow", () => {
  it("creates one table account and separate bar/kitchen tickets atomically", async () => {
    const database = await createDatabase();
    await setUser(database, WAITER_ID);

    await database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
      ZONE_ID,
      JSON.stringify(items),
      REQUEST_ID,
    ]);

    const rows = await database.query(
      `SELECT a.subtotal, t.station, t.waiter_name, i.product_name, i.quantity
       FROM public.salon_accounts a
       JOIN public.salon_tickets t ON t.account_id = a.id
       JOIN public.salon_ticket_items i ON i.ticket_id = t.id
       WHERE a.zone_id = $1 AND a.table_number = '1'
       ORDER BY t.station`,
      [ZONE_ID],
    );

    expect(rows.rows).toEqual([
      {
        subtotal: "72.00",
        station: "bar",
        waiter_name: "Marta Mozo",
        product_name: "Chicha",
        quantity: 1,
      },
      {
        subtotal: "72.00",
        station: "kitchen",
        waiter_name: "Marta Mozo",
        product_name: "Puca picante",
        quantity: 2,
      },
    ]);

    await database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
      ZONE_ID,
      JSON.stringify(items),
      REQUEST_ID,
    ]);
    const replay = await database.query(
      `SELECT count(*)::INTEGER AS count FROM public.salon_tickets`,
    );
    expect(replay.rows[0]).toEqual({ count: 2 });

    await setUser(database, OTHER_WAITER_ID);
    await database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
      ZONE_ID,
      JSON.stringify([{ ...items[0], quantity: 1 }]),
      "21111111-2222-4333-8444-555555555555",
    ]);

    const sharedAccount = await database.query(
      `SELECT count(*)::INTEGER AS accounts, min(subtotal) AS subtotal
       FROM public.salon_accounts WHERE status = 'open'`,
    );
    expect(sharedAccount.rows[0]).toEqual({ accounts: 1, subtotal: "104.00" });

    const waiterNames = await database.query(
      `SELECT DISTINCT waiter_name FROM public.salon_tickets ORDER BY waiter_name`,
    );
    expect(waiterNames.rows).toEqual([{ waiter_name: "José Mozo" }, { waiter_name: "Marta Mozo" }]);
  }, 30_000);

  it("rejects unauthorized users and prices below the catalog price", async () => {
    const database = await createDatabase();
    await setUser(database, CASHIER_ID);
    await expect(
      database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
        ZONE_ID,
        JSON.stringify(items),
        REQUEST_ID,
      ]),
    ).rejects.toThrow(/solo los mozos autorizados/i);

    await setUser(database, WAITER_ID);
    await expect(
      database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
        ZONE_ID,
        JSON.stringify([{ ...items[0], unit_price: 1 }]),
        REQUEST_ID,
      ]),
    ).rejects.toThrow(/precio enviado/i);
  }, 30_000);

  it("rejects forged prices and derives customizable prices from the catalog", async () => {
    const database = await createDatabase();
    await setUser(database, WAITER_ID);

    await expect(
      database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
        ZONE_ID,
        JSON.stringify([{ ...items[0], unit_price: 999 }]),
        REQUEST_ID,
      ]),
    ).rejects.toThrow(/no coincide/i);

    await expect(
      database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
        ZONE_ID,
        JSON.stringify([{ ...items[0], unit_price: 25, customizations: {} }]),
        REQUEST_ID,
      ]),
    ).rejects.toThrow(/faltan opciones/i);

    await database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
      ZONE_ID,
      JSON.stringify([
        {
          product_id: FOOD_ID,
          unit_price: 32,
          quantity: 1,
          customizations: { size: "large" },
          display_customizations: { Tamaño: "Grande" },
        },
      ]),
      REQUEST_ID,
    ]);

    const savedItem = await database.query(
      `SELECT unit_price, customizations
       FROM public.salon_ticket_items`,
    );
    expect(savedItem.rows).toEqual([{ unit_price: "32.00", customizations: { Tamaño: "Grande" } }]);
  }, 30_000);

  it("allows only cashiers to close an account and leaves receipt emission pending", async () => {
    const database = await createDatabase();
    await setUser(database, WAITER_ID);
    await database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
      ZONE_ID,
      JSON.stringify(items),
      REQUEST_ID,
    ]);
    const { rows } = await database.query(
      `SELECT id FROM public.salon_accounts WHERE status = 'open'`,
    );
    const accountId = (rows[0] as { id: string }).id;

    await expect(
      database.query(`SELECT public.close_salon_account($1, 'cash', 'boleta')`, [accountId]),
    ).rejects.toThrow(/solo caja/i);

    await setUser(database, CASHIER_ID);
    await database.query(
      `SELECT public.close_salon_account($1, 'pos', 'factura', 'Restaurante', '20123456789')`,
      [accountId],
    );

    const closedAccount = await database.query(
      `SELECT status, payment_method, receipt_type, receipt_status
       FROM public.salon_accounts WHERE id = $1`,
      [accountId],
    );
    expect(closedAccount.rows[0]).toEqual({
      status: "closed",
      payment_method: "pos",
      receipt_type: "factura",
      receipt_status: "pending",
    });
  }, 30_000);

  it("requires a physical payment method and a valid RUC for invoices", async () => {
    const database = await createDatabase();
    await setUser(database, WAITER_ID);
    await database.query(`SELECT public.submit_salon_ticket($1, '1', $2::jsonb, $3)`, [
      ZONE_ID,
      JSON.stringify(items),
      REQUEST_ID,
    ]);
    const { rows } = await database.query(
      `SELECT id FROM public.salon_accounts WHERE status = 'open'`,
    );
    const accountId = (rows[0] as { id: string }).id;
    await setUser(database, CASHIER_ID);

    await expect(
      database.query(`SELECT public.close_salon_account($1, NULL, 'boleta')`, [accountId]),
    ).rejects.toThrow(/efectivo o pos/i);

    await expect(
      database.query(
        `SELECT public.close_salon_account($1, 'cash', 'factura', 'Restaurante', '1234')`,
        [accountId],
      ),
    ).rejects.toThrow(/ruc/i);
  }, 30_000);
});
