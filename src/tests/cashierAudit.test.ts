import { describe, expect, it } from "vitest";
import { calculateCashierAudit } from "../lib/cashierAudit";

describe("cashier audit separation", () => {
  it("separates discounted dish sales from delivery fees and excludes cancelled orders", () => {
    const result = calculateCashierAudit([
      {
        status: "delivered",
        order_type: "delivery",
        payment_method: "efectivo",
        subtotal: 50,
        discount_amount: 5,
        delivery_fee: 8,
        total: 53,
      },
      {
        status: "received",
        order_type: "pickup",
        payment_method: "yape",
        subtotal: 30,
        discount_amount: 0,
        delivery_fee: 0,
        total: 30,
      },
      {
        status: "cancelled",
        order_type: "delivery",
        payment_method: "efectivo",
        subtotal: 100,
        discount_amount: 10,
        delivery_fee: 12,
        total: 102,
      },
    ]);

    expect(result.dishSales).toBe(75);
    expect(result.deliveryFees).toBe(8);
    expect(result.totalCash).toBe(53);
    expect(result.totalOnline).toBe(30);
    expect(result.totalNet).toBe(83);
  });
});
