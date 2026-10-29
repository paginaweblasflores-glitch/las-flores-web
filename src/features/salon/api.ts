import { supabase } from "../../lib/supabase";
import { resolveProductCustomOptions } from "../../lib/liveProducts";
import type { Category, Dish } from "../../components/MenuModal";
import type { RestaurantZone } from "../zones/types";
import type { SalonOrderItem } from "./operations";

export type SalonRole = "staff" | "cashier" | "admin";

export interface SalonStaff {
  id: string;
  name: string;
  role: SalonRole;
}

export interface SalonAccount {
  id: string;
  zone_id: string;
  table_number: string;
  status: "open" | "closed";
  subtotal: number;
  receipt_status: "pending" | "issued" | "failed";
  receipt_type: "boleta" | "factura" | null;
  payment_method: "cash" | "pos" | null;
  salon_tickets: Array<{
    id: string;
    station: "kitchen" | "bar";
    waiter_id: string;
    waiter_name: string;
    print_status: "pending" | "printed" | "failed";
    print_error: string | null;
    created_at: string;
    salon_ticket_items: Array<{
      id: string;
      product_name: string;
      category_name: string;
      unit_price: number;
      quantity: number;
      customizations: Record<string, string>;
      notes: string | null;
    }>;
  }>;
}

export async function getSalonMenu(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const categories = new Map<string, Category>();
  for (const product of data || []) {
    const categoryName = product.categories?.name?.trim() || "Carta";
    if (!categories.has(categoryName)) {
      categories.set(categoryName, {
        id: product.categories?.slug || categoryName,
        label: categoryName,
        dishes: [],
      });
    }

    const basePrice = Number(product.price);
    const customOptions =
      resolveProductCustomOptions(product.name, basePrice) || product.custom_options || undefined;
    const dish: Dish = {
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: `S/ ${basePrice.toFixed(2)}`,
      image: product.image_url || undefined,
      is_customizable: Boolean(customOptions?.length),
      custom_options: customOptions,
    };

    categories.get(categoryName)?.dishes.push(dish);
  }

  return [...categories.values()];
}

export async function getSalonStaff(): Promise<SalonStaff> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Inicia sesión con tu cuenta del personal.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userData.user.id)
    .single();

  if (profileError) throw profileError;

  const role = String(profile.role || "").toLowerCase();
  if (role !== "admin" && role !== "staff" && role !== "cashier") {
    throw new Error("Tu cuenta no tiene acceso al módulo de salón.");
  }

  return {
    id: profile.id,
    name: profile.full_name?.trim() || userData.user.email || "Personal",
    role,
  };
}

export async function getSalonZones(): Promise<RestaurantZone[]> {
  const { data, error } = await supabase
    .from("restaurant_zones")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data || [];
}

export async function getOpenSalonAccounts(): Promise<SalonAccount[]> {
  const { data, error } = await supabase
    .from("salon_accounts")
    .select(
      "id, zone_id, table_number, status, subtotal, receipt_status, receipt_type, payment_method, salon_tickets(id, station, waiter_id, waiter_name, print_status, print_error, created_at, salon_ticket_items(id, product_name, category_name, unit_price, quantity, customizations, notes))",
    )
    .eq("status", "open")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map((account) => ({
    ...account,
    salon_tickets: account.salon_tickets.map((ticket) => ({
      ...ticket,
      salon_ticket_items: ticket.salon_ticket_items.map((item) => ({
        ...item,
        unit_price: Number(item.unit_price),
      })),
    })),
  })) as SalonAccount[];
}

export async function sendSalonTicket(
  zoneId: string,
  tableNumber: string,
  items: SalonOrderItem[],
  requestId: string,
): Promise<void> {
  const { error } = await supabase.rpc("submit_salon_ticket", {
    p_zone_id: zoneId,
    p_table_number: tableNumber,
    p_request_id: requestId,
    p_items: items.map((item) => ({
      product_id: item.productId || item.id,
      product_name: item.name,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      customizations: item.selectedOptions || {},
      notes: item.notes || null,
    })),
  });

  if (error) throw error;
}

export async function closeSalonAccount(
  accountId: string,
  paymentMethod: "cash" | "pos",
  receiptType: "boleta" | "factura",
  customerName: string,
  documentNumber: string,
): Promise<void> {
  const { error } = await supabase.rpc("close_salon_account", {
    p_account_id: accountId,
    p_payment_method: paymentMethod,
    p_receipt_type: receiptType,
    p_receipt_customer_name: customerName || null,
    p_receipt_document_number: documentNumber || null,
  });

  if (error) throw error;
}
