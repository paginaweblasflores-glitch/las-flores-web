import { supabase } from "./supabase";

export const OFFICIAL_EMAIL = "contacto@restaurantelasflores.com";

type EmailTemplate =
  | "order"
  | "reservation"
  | "contact"
  | "eventQuote"
  | "complaint"
  | "complaintResponse"
  | "reviewRequest";

interface TemplateEmail {
  template: EmailTemplate;
  data: Record<string, unknown>;
}

interface OrderEmailInput {
  id?: string;
  customer_email?: string;
  email?: string;
  customer_name?: string;
  full_name?: string;
  order_type?: "delivery" | "pickup";
  subtotal?: number | string;
  total_amount?: number | string;
  delivery_fee?: number | string;
  payment_method?: string;
  address?: string;
}

interface OrderEmailItem {
  name?: string;
  product_name?: string;
  quantity?: number;
  price?: number;
  unit_price?: number;
  notes?: string;
  customizations?: Record<string, string | undefined>;
  customizationSelections?: Record<string, string>;
}

function hasCustomerAddress(value: unknown): value is string {
  return typeof value === "string" && value.includes("@");
}

async function sendEmail(payload: TemplateEmail): Promise<boolean> {
  const body = { template: payload.template, data: payload.data };

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      console.info(`[Email Service]: ${payload.template} email sent.`);
      return true;
    }
  } catch {
    // Local development may not have the Vercel API route available.
  }

  try {
    const { data, error } = await supabase.functions.invoke("send-email", { body });
    if (!error && data) {
      console.info(`[Email Service]: ${payload.template} email sent.`);
      return true;
    }
  } catch (error) {
    console.warn(`[Email Service]: Error sending ${payload.template} email:`, error);
  }

  console.info(`[Email Service Log]: ${payload.template} notification recorded.`);
  return false;
}

export async function sendOrderEmails(
  orderData: OrderEmailInput,
  items: OrderEmailItem[] = [],
): Promise<void> {
  const customerEmail = orderData.customer_email || orderData.email;
  const data = {
    customerEmail,
    orderId: orderData.id || "LF-ORDER",
    customerName: orderData.customer_name || orderData.full_name || "Cliente",
    orderType: orderData.order_type || "pickup",
    items: items.map((item) => {
      const customizations = {
        ...(item.customizations || {}),
        ...(item.customizationSelections || {}),
      };
      return {
        name: item.name || item.product_name || "Producto",
        quantity: item.quantity || 1,
        price: Number(item.price ?? item.unit_price ?? 0),
        notes: item.notes,
        customizations: Object.fromEntries(
          Object.entries(customizations).filter(([, value]) => value !== undefined),
        ),
      };
    }),
    subtotal: Number(orderData.subtotal || orderData.total_amount || 0),
    deliveryFee: Number(orderData.delivery_fee || 0),
    totalAmount: Number(orderData.total_amount || 0),
    paymentMethod: orderData.payment_method,
    address: orderData.address,
  };

  if (hasCustomerAddress(customerEmail)) {
    await sendEmail({ template: "order", data: { ...data, audience: "customer" } });
  }
  await sendEmail({ template: "order", data: { ...data, audience: "internal" } });
}

export async function sendReservationEmail(reservationData: {
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  client_phone?: string;
  reservation_date?: string;
  reservation_time?: string;
  guests?: number | string;
  party_size?: number | string;
  guest_count?: number | string;
  zone?: string;
  table_number?: string;
}): Promise<void> {
  const data = {
    customerEmail: reservationData.email,
    name: reservationData.name || reservationData.full_name || "Estimado/a cliente",
    reservationDate: reservationData.reservation_date || "Fecha por confirmar",
    reservationTime: reservationData.reservation_time || "Por confirmar",
    guests: Number(
      reservationData.guests || reservationData.party_size || reservationData.guest_count || 2,
    ),
    phone: reservationData.phone || reservationData.client_phone || "Registrado",
    zone: reservationData.zone || reservationData.table_number,
  };

  if (hasCustomerAddress(reservationData.email)) {
    await sendEmail({ template: "reservation", data: { ...data, audience: "customer" } });
  }
  await sendEmail({ template: "reservation", data: { ...data, audience: "internal" } });
}

export async function sendContactEmail(contactData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<void> {
  await sendEmail({
    template: "contact",
    data: {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      message: contactData.message,
    },
  });
}

export async function sendEventQuoteEmail(quoteData: {
  name: string;
  email: string;
  phone: string;
  guests: number | null;
  event_type: string;
  event_date: string | null;
  message: string;
}): Promise<void> {
  await sendEmail({
    template: "eventQuote",
    data: {
      name: quoteData.name,
      email: quoteData.email,
      phone: quoteData.phone,
      guests: quoteData.guests,
      eventType: quoteData.event_type,
      eventDate: quoteData.event_date,
      message: quoteData.message,
    },
  });
}

export async function sendReviewRequestEmail(customerData: {
  name: string;
  email: string;
}): Promise<void> {
  if (!hasCustomerAddress(customerData.email)) return;
  await sendEmail({
    template: "reviewRequest",
    data: { name: customerData.name || "Estimado/a cliente", email: customerData.email },
  });
}

export async function sendComplaintEmail(complaintData: {
  code: string;
  fullName: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
  address: string;
  isMinor: boolean;
  parentName?: string;
  claimedType: string;
  claimedAmount?: string | number;
  claimedDescription: string;
  claimType: string;
  detail: string;
  consumerRequest: string;
}): Promise<void> {
  const data = {
    code: complaintData.code,
    fullName: complaintData.fullName,
    docType: complaintData.docType,
    docNumber: complaintData.docNumber,
    phone: complaintData.phone,
    email: complaintData.email,
    address: complaintData.address,
    isMinor: complaintData.isMinor,
    parentName: complaintData.parentName,
    claimedType: complaintData.claimedType,
    claimedAmount: complaintData.claimedAmount,
    claimedDescription: complaintData.claimedDescription,
    claimType: complaintData.claimType,
    detail: complaintData.detail,
    consumerRequest: complaintData.consumerRequest,
  };

  if (hasCustomerAddress(complaintData.email)) {
    await sendEmail({ template: "complaint", data: { ...data, audience: "customer" } });
  }
  await sendEmail({ template: "complaint", data: { ...data, audience: "internal" } });
}

export async function sendComplaintResponseEmail(data: {
  code: string;
  fullName: string;
  email: string;
  claimType: string;
  statusLabel: string;
  adminResponse: string;
}): Promise<boolean> {
  if (!hasCustomerAddress(data.email)) return false;
  return sendEmail({ template: "complaintResponse", data });
}
