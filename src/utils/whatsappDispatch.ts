import { supabase } from "../lib/supabase";

/**
 * Helper de Despacho de Delivery por WhatsApp & CallMeBot
 * Restaurante Las Flores — Ayacucho
 */

export function generateDeliveryGoogleMapsUrl(
  latitude?: number | null,
  longitude?: number | null,
  address?: string | null
): string {
  if (latitude && longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }
  if (address && address.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address.trim() + ", Huamanga, Ayacucho"
    )}`;
  }
  return `https://www.google.com/maps?q=-13.1588,-74.2239`;
}

export function generateDeliveryDirectionsUrl(
  latitude?: number | null,
  longitude?: number | null,
  address?: string | null
): string | null {
  const hasCoordinates =
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);
  const trimmedAddress = address?.trim();
  const destination = hasCoordinates
    ? `${latitude},${longitude}`
    : trimmedAddress
      ? `${trimmedAddress}, Huamanga, Ayacucho`
      : null;

  if (!destination) return null;

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

export function buildDeliveryWhatsAppMessage(order: any, items: any[] = []): string {
  const orderNum = order.order_number || order.id?.slice(0, 8) || "S/N";
  const clientName = order.client_name || order.customer_name || "Cliente General";
  const total = Number(order.total || 0).toFixed(2);
  const paymentMethod = (order.payment_method || "YAPE").toUpperCase().trim();

  const isCash = paymentMethod.includes("EFECTIVO") || paymentMethod.includes("CASH");

  const paymentLabel = isCash
    ? `💵 *COBRAR EN EFECTIVO:* S/ ${total} (PAGO CONTRA ENTREGA)`
    : `✅ *MONTO YA PAGADO (NO COBRAR):* S/ ${total} (PAGADO CON ${paymentMethod})`;

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const isLocalOrigin = /^https?:\/\/(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?$/i.test(
    currentOrigin
  );
  const baseUrl =
    currentOrigin && !isLocalOrigin
      ? currentOrigin
      : "https://www.restaurantelasflores.com";

  const driverPin = order.driver_pin || "----";
  const orderId = order.id || order.order_id;

  return `🛵 *DESPACHO DE DELIVERY — LAS FLORES*
==============================
*Orden:* #${orderNum}
🔑 *PIN MOTORIZADO:* ${driverPin}
*Cliente:* ${clientName}
${paymentLabel}

👉 *INICIA EL DESPACHO AQUÍ (Ver Dirección y Navegar):*
${baseUrl}/d/${orderId}
==============================
*Instrucción:* Abre el enlace e ingresa el PIN *${driverPin}*. En la página, completa los pasos existentes: "Voy a recoger el pedido", "Pedido recogido (en camino al cliente)" y "Confirmar entrega al cliente". Estos pasos actualizan el seguimiento del pedido. ¡Gracias!`;
}

/**
 * Abre la ventana de WhatsApp con el mensaje de despacho formateado.
 * Si el PIN de motorizado no está en el objeto de la orden, lo consulta automáticamente de la base de datos.
 */
export async function openWhatsAppDispatch(
  order: any,
  items: any[] = [],
  targetDriverPhone?: string
) {
  let pin = order.driver_pin;

  if (!pin && order?.id) {
    try {
      const { data } = await supabase
        .from("driver_pins")
        .select("pin_code")
        .eq("order_id", order.id)
        .maybeSingle();

      if (data?.pin_code) {
        pin = data.pin_code;
        order.driver_pin = pin;
      }
    } catch (err) {
      console.warn("No se pudo obtener el driver_pin de la base de datos:", err);
    }
  }

  const message = buildDeliveryWhatsAppMessage({ ...order, driver_pin: pin }, items);
  const encodedText = encodeURIComponent(message);

  let targetUrl = `https://wa.me/?text=${encodedText}`;
  if (targetDriverPhone && targetDriverPhone.trim()) {
    const cleanPhone = targetDriverPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("51") ? cleanPhone : `51${cleanPhone}`;
    targetUrl = `https://wa.me/${formattedPhone}?text=${encodedText}`;
  }

  window.open(targetUrl, "_blank", "noopener,noreferrer");
}

export async function sendCallMeBotNotification(
  order: any,
  items: any[] = [],
  phone: string,
  apiKey: string
): Promise<boolean> {
  try {
    let pin = order.driver_pin;
    if (!pin && order?.id) {
      const { data } = await supabase
        .from("driver_pins")
        .select("pin_code")
        .eq("order_id", order.id)
        .maybeSingle();

      if (data?.pin_code) {
        pin = data.pin_code;
      }
    }

    const message = buildDeliveryWhatsAppMessage({ ...order, driver_pin: pin }, items);
    const encodedText = encodeURIComponent(message);
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("51") ? cleanPhone : `51${cleanPhone}`;

    const url = `https://api.callmebot.com/whatsapp.php?phone=${formattedPhone}&text=${encodedText}&apikey=${apiKey}`;

    // CallMeBot request
    const response = await fetch(url, { method: "GET", mode: "no-cors" });
    console.info("CallMeBot notification triggered:", response.status || "no-cors");
    return true;
  } catch (err) {
    console.error("Error triggering CallMeBot notification:", err);
    return false;
  }
}
