type OrderRecord = Record<string, unknown>;

type OrderPayload = {
  eventType: string;
  new: OrderRecord;
  old?: OrderRecord;
};

function isCashierOrderReady(order: OrderRecord) {
  const paymentMethod = String(order.payment_method || "").toLowerCase();
  if (paymentMethod === "card" || paymentMethod === "culqi") {
    return order.payment_status === "paid";
  }
  return (
    order.payment_status === null ||
    order.payment_status === undefined ||
    order.payment_status === "paid"
  );
}

export function shouldNotifyCashierOrder(payload: OrderPayload) {
  if (payload.eventType === "INSERT") {
    return isCashierOrderReady(payload.new);
  }
  if (payload.eventType !== "UPDATE" || !payload.old) {
    return false;
  }

  const paymentMethod = String(payload.new.payment_method || "").toLowerCase();
  return (
    (paymentMethod === "card" || paymentMethod === "culqi") &&
    payload.old.payment_status === "pending" &&
    payload.new.payment_status === "paid" &&
    !isCashierOrderReady(payload.old)
  );
}
