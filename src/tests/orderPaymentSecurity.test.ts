import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
      /p_payment_method\s+NOT IN\s*\(\s*'yape'\s*,\s*'card'\s*,\s*'cash'\s*,\s*'culqi'\s*,\s*'efectivo'\s*\)/i,
    );
  });
});
