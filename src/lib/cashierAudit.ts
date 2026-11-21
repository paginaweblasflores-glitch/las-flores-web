import { isCancelledStatus } from "./orderStatus";

export interface CashierAuditTotals {
  dishSales: number;
  deliveryFees: number;
  totalCash: number;
  totalOnline: number;
  totalNet: number;
  discounts: number;
  countDelivery: number;
  countPickup: number;
  orderCount: number;
}

export function calculateCashierAudit(orders: any[]): CashierAuditTotals {
  let dishSales = 0;
  let deliveryFees = 0;
  let totalCash = 0;
  let totalOnline = 0;
  let discounts = 0;
  let countDelivery = 0;
  let countPickup = 0;
  let orderCount = 0;

  for (const order of orders) {
    if (isCancelledStatus(order.status)) continue;

    const subtotal = Number(order.subtotal || 0);
    const discount = Number(order.discount_amount || order.discount || 0);
    const deliveryFee = Number(order.delivery_fee || 0);
    const total = Number(order.total || 0);
    const paymentMethod = (order.payment_method || "").toLowerCase().trim();
    const isCash = paymentMethod.includes("efectivo") || paymentMethod.includes("cash");

    dishSales += Math.max(0, subtotal - discount);
    deliveryFees += deliveryFee;
    discounts += discount;
    orderCount++;

    if (isCash) totalCash += total;
    else totalOnline += total;

    const isDelivery = (order.order_type || "delivery").toLowerCase().includes("delivery");
    if (isDelivery) countDelivery++;
    else countPickup++;
  }

  return {
    dishSales,
    deliveryFees,
    totalCash,
    totalOnline,
    totalNet: totalCash + totalOnline,
    discounts,
    countDelivery,
    countPickup,
    orderCount,
  };
}
