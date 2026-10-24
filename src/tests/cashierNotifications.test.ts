import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { shouldNotifyCashierOrder } from "../lib/cashierNotifications";

const cashierSource = readFileSync(resolve(process.cwd(), "src/routes/caja.tsx"), "utf8");

describe("cashier order notifications", () => {
  it("handles the pending-card to paid transition without unrelated update notifications", () => {
    expect(cashierSource).toMatch(/shouldNotifyCashierOrder\(payload as/);
    expect(
      shouldNotifyCashierOrder({
        eventType: "UPDATE",
        old: { payment_method: "card", payment_status: "pending" },
        new: { payment_method: "card", payment_status: "paid" },
      }),
    ).toBe(true);
    expect(
      shouldNotifyCashierOrder({
        eventType: "UPDATE",
        old: { payment_method: "card", payment_status: "paid" },
        new: { payment_method: "card", payment_status: "paid", status: "preparing" },
      }),
    ).toBe(false);
    expect(
      shouldNotifyCashierOrder({
        eventType: "INSERT",
        new: { payment_method: "cash", payment_status: null },
      }),
    ).toBe(true);
  });
});
