import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(process.cwd(), "supabase/cashier_orders_access.sql");
const migration = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

describe("cashier order access", () => {
  it("includes cashiers in the staff access check", () => {
    expect(migration).toMatch(
      /CREATE OR REPLACE FUNCTION public\.is_staff\(\)[\s\S]*?role IN \('admin', 'staff', 'cashier'\)/,
    );
    expect(migration).toMatch(
      /GRANT EXECUTE ON FUNCTION public\.is_staff\(\) TO anon, authenticated/,
    );
  });

  it("lets authorized cashiers read orders and their items through RLS", () => {
    expect(migration).toMatch(
      /CREATE POLICY "orders_select_own_or_staff"[\s\S]*?USING \(user_id = auth\.uid\(\) OR public\.is_staff\(\)\)/,
    );
    expect(migration).toMatch(
      /CREATE POLICY "order_items_select_authorized"[\s\S]*?orders\.user_id = auth\.uid\(\) OR public\.is_staff\(\)/,
    );
  });
});

describe("cashier pending order cancellation", () => {
  it("shows cancellation only for pending cards and updates cancelled status after confirmation", () => {
    const cardPath = resolve(process.cwd(), "src/components/CashierOrderCard.tsx");
    const card = readFileSync(cardPath, "utf8");

    expect(card).toContain('normalizedStatus === "pendiente"');
    expect(card).toContain("window.confirm");
    expect(card).toContain('onStatusChange(order.id, "cancelled")');
  });
});
