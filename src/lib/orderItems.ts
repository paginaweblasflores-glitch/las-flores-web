import type { CartItem } from "../context/CartContext";

export interface OrderItemPayload {
  product_id?: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

const customizationLabels: Record<string, string> = {
  bebidafria: "Fría",
  bebidacaliente: "Caliente",
  sandwich: "Sándwich",
  acompanamiento: "Acompañante",
};

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

export function formatCustomizations(customizations?: Record<string, string | undefined>) {
  if (!customizations) return "";

  return Object.entries(customizations)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${customizationLabels[normalizeKey(key)] || key.replace(/^\d+\.\s*/, "")}: ${value}`)
    .join("; ");
}

export function buildOrderItem(item: CartItem): OrderItemPayload {
  const notes = formatCustomizations(item.customizations);
  return {
    product_id: item.productId || item.id,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
    ...(notes ? { notes } : {}),
  };
}
