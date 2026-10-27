const INTERNAL_RECIPIENT = "contacto@restaurantelasflores.com";
const GENERAL_FROM = `Restaurante Las Flores <${INTERNAL_RECIPIENT}>`;
const ORDERS_FROM = "Pedidos — Las Flores <pedidos@restaurantelasflores.com>";
const RESERVATIONS_FROM = "Reservas — Las Flores <reservas@restaurantelasflores.com>";
const NOTIFICATIONS_FROM = "Las Flores <no-reply@restaurantelasflores.com>";
const EMAIL_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{0,62}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

type Audience = "customer" | "internal";
type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  customizations?: Record<string, string | number | boolean>;
};

type OrderData = {
  audience: Audience;
  customerEmail?: string;
  orderId: string;
  customerName: string;
  orderType: "delivery" | "pickup";
  items: OrderItem[];
  subtotal: number;
  deliveryFee?: number;
  totalAmount: number;
  paymentMethod?: string;
  address?: string;
};

type ReservationData = {
  audience: Audience;
  customerEmail?: string;
  name: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  phone: string;
  zone?: string;
};

type ContactData = { name: string; email: string; phone?: string; message: string };
type EventQuoteData = {
  name: string;
  email: string;
  phone?: string;
  guests?: number | null;
  eventType: string;
  eventDate?: string | null;
  message: string;
};
type ComplaintData = {
  audience: Audience;
  code: string;
  fullName: string;
  docType: string;
  docNumber: string;
  phone: string;
  email?: string;
  address: string;
  isMinor: boolean;
  parentName?: string;
  claimedType: "producto" | "servicio";
  claimedAmount?: string | number;
  claimedDescription: string;
  claimType: "reclamo" | "queja";
  detail: string;
  consumerRequest: string;
};
type ComplaintResponseData = {
  code: string;
  fullName: string;
  email: string;
  claimType: string;
  statusLabel: string;
  adminResponse: string;
};
type ReviewRequestData = { name: string; email: string };

type RenderedEmail = {
  to: string | string[];
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
};

function invalid(message: string): never {
  throw new Error(`Invalid transactional email data: ${message}`);
}

function getObject(data: unknown, allowed: string[], required: string[]): Record<string, unknown> {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return invalid("data must be an object");
  }
  const object = data as Record<string, unknown>;
  const unexpected = Object.keys(object).find((key) => !allowed.includes(key));
  if (unexpected) return invalid(`unexpected field "${unexpected}"`);
  const missing = required.find((key) => !(key in object));
  if (missing) return invalid(`missing required field "${missing}"`);
  return object;
}

function text(value: unknown, field: string, maxLength = 4000): string {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    return invalid(`${field} must be a non-empty string of at most ${maxLength} characters`);
  }
  return value;
}

function optionalText(value: unknown, field: string, fallback = "", maxLength = 4000): string {
  if (value === undefined || value === null || value === "") return fallback;
  return text(value, field, maxLength);
}

function email(value: unknown, field: string, optional = false): string | undefined {
  if (optional && (value === undefined || value === null || value === "")) return undefined;
  const address = text(value, field, 254).trim();
  if (!EMAIL_PATTERN.test(address)) return invalid(`${field} must be a valid email address`);
  return address;
}

function numberValue(value: unknown, field: string, optional = false): number | undefined {
  if (optional && (value === undefined || value === null || value === "")) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return invalid(`${field} must be a non-negative number`);
  }
  return value;
}

function booleanValue(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") return invalid(`${field} must be a boolean`);
  return value;
}

function audienceValue(value: unknown): Audience {
  if (value !== "customer" && value !== "internal") {
    return invalid('audience must be "customer" or "internal"');
  }
  return value;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const escapes: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return escapes[character];
  });
}

function safeSubject(value: string): string {
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127 ? " " : character;
  })
    .join("")
    .slice(0, 200);
}

function document(title: string, content: string): string {
  return `<!doctype html><html><body style="margin:0;background:#F6F1E7;padding:24px;font-family:Arial,sans-serif;color:#1B2A24">
    <main style="max-width:620px;margin:0 auto;background:#fff;border:4px solid #2C4A3E;border-top:6px solid #D4AF37;border-radius:16px;padding:28px">
      <div style="text-align:center;border-bottom:1px solid #EAE3D2;padding-bottom:18px">
        <img src="https://www.restaurantelasflores.com/images.png" alt="Restaurante Las Flores" style="max-width:220px;width:75%;height:auto">
        <p style="font-size:11px;color:#D4AF37;text-transform:uppercase;letter-spacing:2px">Tradición &amp; Alta Gastronomía — Ayacucho</p>
      </div>
      <h2 style="font-family:Georgia,serif;color:#2C4A3E;text-align:center">${escapeHtml(title)}</h2>
      ${content}
      <footer style="border-top:1px solid #EAE3D2;margin-top:24px;padding-top:14px;text-align:center;font-size:11px;color:#777">
        Restaurante Las Flores — Jr. José Olaya 106, Huamanga, Ayacucho
      </footer>
    </main>
  </body></html>`;
}

function row(label: string, value: string): string {
  return `<p style="margin:7px 0"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function parseOrder(data: unknown): OrderData {
  const object = getObject(
    data,
    [
      "audience",
      "customerEmail",
      "orderId",
      "customerName",
      "orderType",
      "items",
      "subtotal",
      "deliveryFee",
      "totalAmount",
      "paymentMethod",
      "address",
    ],
    ["audience", "orderId", "customerName", "orderType", "items", "subtotal", "totalAmount"],
  );
  const audience = audienceValue(object.audience);
  const orderId = text(object.orderId, "orderId", 64);
  if (!/^[a-zA-Z0-9-]+$/.test(orderId)) return invalid("orderId contains unsupported characters");
  const customerEmail = email(object.customerEmail, "customerEmail", audience !== "customer");
  if (object.orderType !== "delivery" && object.orderType !== "pickup") {
    return invalid('orderType must be "delivery" or "pickup"');
  }
  if (!Array.isArray(object.items)) return invalid("items must be an array");
  if (object.items.length > 50) return invalid("items must contain at most 50 entries");
  const items = object.items.map((entry, index) => {
    const item = getObject(
      entry,
      ["name", "quantity", "price", "notes", "customizations"],
      ["name", "quantity", "price"],
    );
    const quantity = numberValue(item.quantity, `items[${index}].quantity`)!;
    if (quantity < 1) return invalid(`items[${index}].quantity must be at least 1`);
    let customizations: OrderItem["customizations"];
    if (item.customizations !== undefined && item.customizations !== null) {
      if (typeof item.customizations !== "object" || Array.isArray(item.customizations)) {
        return invalid(`items[${index}].customizations must be an object`);
      }
      customizations = {};
      if (Object.keys(item.customizations).length > 30) {
        return invalid(`items[${index}].customizations must contain at most 30 entries`);
      }
      for (const [key, value] of Object.entries(item.customizations)) {
        if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
          return invalid(`items[${index}].customizations values must be text or numbers`);
        }
        customizations[text(key, `items[${index}].customizations key`, 200)] = String(value);
      }
    }
    return {
      name: text(item.name, `items[${index}].name`, 200),
      quantity,
      price: numberValue(item.price, `items[${index}].price`)!,
      notes: optionalText(item.notes, `items[${index}].notes`, "", 1000),
      customizations,
    };
  });
  return {
    audience,
    customerEmail,
    orderId,
    customerName: text(object.customerName, "customerName", 200),
    orderType: object.orderType,
    items,
    subtotal: numberValue(object.subtotal, "subtotal")!,
    deliveryFee: numberValue(object.deliveryFee, "deliveryFee", true),
    totalAmount: numberValue(object.totalAmount, "totalAmount")!,
    paymentMethod: optionalText(object.paymentMethod, "paymentMethod", "", 100),
    address: optionalText(object.address, "address", "", 500),
  };
}

function parseReservation(data: unknown): ReservationData {
  const object = getObject(
    data,
    [
      "audience",
      "customerEmail",
      "name",
      "reservationDate",
      "reservationTime",
      "guests",
      "phone",
      "zone",
    ],
    ["audience", "name", "reservationDate", "reservationTime", "guests", "phone"],
  );
  const audience = audienceValue(object.audience);
  return {
    audience,
    customerEmail: email(object.customerEmail, "customerEmail", audience !== "customer"),
    name: text(object.name, "name", 200),
    reservationDate: text(object.reservationDate, "reservationDate", 50),
    reservationTime: text(object.reservationTime, "reservationTime", 50),
    guests: numberValue(object.guests, "guests")!,
    phone: text(object.phone, "phone", 50),
    zone: optionalText(object.zone, "zone", "", 100),
  };
}

function parseContact(data: unknown): ContactData {
  const object = getObject(
    data,
    ["name", "email", "phone", "message"],
    ["name", "email", "message"],
  );
  return {
    name: text(object.name, "name", 200),
    email: email(object.email, "email")!,
    phone: optionalText(object.phone, "phone", "", 50),
    message: text(object.message, "message"),
  };
}

function parseEventQuote(data: unknown): EventQuoteData {
  const object = getObject(
    data,
    ["name", "email", "phone", "guests", "eventType", "eventDate", "message"],
    ["name", "email", "eventType", "message"],
  );
  return {
    name: text(object.name, "name", 200),
    email: email(object.email, "email")!,
    phone: optionalText(object.phone, "phone", "", 50),
    guests: numberValue(object.guests, "guests", true),
    eventType: text(object.eventType, "eventType", 200),
    eventDate: optionalText(object.eventDate, "eventDate", "", 50),
    message: optionalText(object.message, "message"),
  };
}

function parseComplaint(data: unknown): ComplaintData {
  const object = getObject(
    data,
    [
      "audience",
      "code",
      "fullName",
      "docType",
      "docNumber",
      "phone",
      "email",
      "address",
      "isMinor",
      "parentName",
      "claimedType",
      "claimedAmount",
      "claimedDescription",
      "claimType",
      "detail",
      "consumerRequest",
    ],
    [
      "audience",
      "code",
      "fullName",
      "docType",
      "docNumber",
      "phone",
      "address",
      "isMinor",
      "claimedType",
      "claimedDescription",
      "claimType",
      "detail",
      "consumerRequest",
    ],
  );
  const audience = audienceValue(object.audience);
  if (object.claimedType !== "producto" && object.claimedType !== "servicio") {
    return invalid('claimedType must be "producto" or "servicio"');
  }
  if (object.claimType !== "reclamo" && object.claimType !== "queja") {
    return invalid('claimType must be "reclamo" or "queja"');
  }
  let claimedAmount: string | number | undefined;
  if (typeof object.claimedAmount === "number") {
    claimedAmount = numberValue(object.claimedAmount, "claimedAmount");
  } else if (object.claimedAmount !== undefined && object.claimedAmount !== null) {
    claimedAmount = text(object.claimedAmount, "claimedAmount", 50);
  }
  return {
    audience,
    code: text(object.code, "code", 100),
    fullName: text(object.fullName, "fullName", 200),
    docType: text(object.docType, "docType", 50),
    docNumber: text(object.docNumber, "docNumber", 100),
    phone: text(object.phone, "phone", 50),
    email: email(object.email, "email", audience !== "customer"),
    address: text(object.address, "address", 500),
    isMinor: booleanValue(object.isMinor, "isMinor"),
    parentName: optionalText(object.parentName, "parentName", "", 200),
    claimedType: object.claimedType,
    claimedAmount,
    claimedDescription: text(object.claimedDescription, "claimedDescription", 1000),
    claimType: object.claimType,
    detail: text(object.detail, "detail"),
    consumerRequest: text(object.consumerRequest, "consumerRequest"),
  };
}

function parseComplaintResponse(data: unknown): ComplaintResponseData {
  const object = getObject(
    data,
    ["code", "fullName", "email", "claimType", "statusLabel", "adminResponse"],
    ["code", "fullName", "email", "claimType", "statusLabel", "adminResponse"],
  );
  return {
    code: text(object.code, "code", 100),
    fullName: text(object.fullName, "fullName", 200),
    email: email(object.email, "email")!,
    claimType: text(object.claimType, "claimType", 100),
    statusLabel: text(object.statusLabel, "statusLabel", 100),
    adminResponse: text(object.adminResponse, "adminResponse"),
  };
}

function parseReviewRequest(data: unknown): ReviewRequestData {
  const object = getObject(data, ["name", "email"], ["name", "email"]);
  return {
    name: text(object.name, "name", 200),
    email: email(object.email, "email")!,
  };
}

function renderOrder(data: OrderData): RenderedEmail {
  const shortId = data.orderId.slice(0, 8).toUpperCase();
  const isDelivery = data.orderType === "delivery";
  const items = data.items
    .map((item) => {
      const customizations = Object.entries(item.customizations ?? {})
        .filter(([, value]) => value !== "" && value !== "false")
        .map(([key, value]) => `${escapeHtml(key)}: ${escapeHtml(String(value))}`)
        .join("; ");
      return `<tr><td style="padding:10px;border-bottom:1px solid #EAE3D2"><strong>${item.quantity}x</strong> ${escapeHtml(item.name)}
        ${customizations ? `<div style="font-size:12px;color:#6B7280">Personalización: ${customizations}</div>` : item.notes ? `<div style="font-size:12px;color:#6B7280">${escapeHtml(item.notes)}</div>` : ""}
        </td><td style="padding:10px;text-align:right">S/ ${(item.price * item.quantity).toFixed(2)}</td></tr>`;
    })
    .join("");
  const recipient = data.audience === "internal" ? INTERNAL_RECIPIENT : data.customerEmail!;
  const greeting = `<p>Estimado/a <strong>${escapeHtml(data.customerName)}</strong>, hemos recibido su pedido correctamente.</p>`;
  const content = `${data.audience === "customer" ? greeting : ""}<p><strong>Pedido N° #${escapeHtml(shortId)}</strong></p>
    <table style="width:100%;border-collapse:collapse"><tbody>${items}</tbody></table>
    ${row("Modalidad", isDelivery ? "Delivery a Domicilio" : "Recojo en Establecimiento")}
    ${isDelivery && data.address ? row("Dirección", data.address) : ""}
    ${row("Método de Pago", data.paymentMethod || "Confirmado")}
    ${row("Subtotal", `S/ ${data.subtotal.toFixed(2)}`)}
    ${isDelivery ? row("Servicio de Delivery", `S/ ${(data.deliveryFee ?? 0).toFixed(2)}`) : ""}
    <p style="text-align:right;font-size:16px"><strong>Total abonado: S/ ${data.totalAmount.toFixed(2)}</strong></p>
    <p><a href="https://www.restaurantelasflores.com/rastreo/${encodeURIComponent(data.orderId)}">Seguimiento de Pedido en Vivo</a></p>`;
  const customer = data.audience === "customer";
  const subject = customer
    ? `Comprobante de Pedido #${shortId} — Restaurante Las Flores`
    : `[Administración] Nuevo Pedido #${shortId} — S/ ${data.totalAmount.toFixed(2)}`;
  return {
    to: recipient,
    from: customer ? ORDERS_FROM : NOTIFICATIONS_FROM,
    subject: safeSubject(subject),
    html: document("Comprobante Digital de Pedido", content),
  };
}

function renderReservation(data: ReservationData): RenderedEmail {
  const [year, month, day] = data.reservationDate.split("-");
  const date = year && month && day ? `${day}/${month}/${year}` : data.reservationDate;
  const customer = data.audience === "customer";
  const recipient = customer ? data.customerEmail! : INTERNAL_RECIPIENT;
  const content = `${customer ? `<p>Estimado/a <strong>${escapeHtml(data.name)}</strong>, su mesa ha sido reservada con éxito.</p>` : ""}
    ${row("Titular de Reserva", data.name)}
    ${row("Fecha Programada", date)}
    ${row("Hora Reservada", `${data.reservationTime} hrs`)}
    ${row("Comensales", `${data.guests} personas`)}
    ${data.zone ? row("Zona Asignada", data.zone) : ""}
    ${row("Teléfono registrado", data.phone)}
    <p>Le sugerimos ingresar 10 minutos antes de su horario reservado.</p>`;
  return {
    to: recipient,
    from: customer ? RESERVATIONS_FROM : NOTIFICATIONS_FROM,
    subject: safeSubject(
      customer
        ? "Confirmación de Reserva — Restaurante Las Flores Huamanga"
        : `[Administración] Nueva Reserva — ${date} ${data.reservationTime} (${data.name})`,
    ),
    html: document("Confirmación Oficial de Reserva", content),
  };
}

function renderContact(data: ContactData): RenderedEmail {
  const content = `${row("Remitente", data.name)}
    ${row("Correo Electrónico", data.email)}
    ${row("Teléfono", data.phone || "No especificado")}
    <div style="background:#FAF6ED;padding:16px;border-left:4px solid #2C4A3E">${escapeHtml(data.message)}</div>`;
  return {
    to: INTERNAL_RECIPIENT,
    from: GENERAL_FROM,
    replyTo: data.email,
    subject: safeSubject(`Mensaje de Contacto — ${data.name}`),
    html: document("Mensaje de Contacto desde la Web", content),
  };
}

function renderEventQuote(data: EventQuoteData): RenderedEmail {
  const content = `${row("Nombre", data.name)}
    ${row("Correo Electrónico", data.email)}
    ${row("Teléfono", data.phone || "No especificado")}
    ${row("Tipo de Evento", data.eventType || "No especificado")}
    ${row("N° de Invitados", data.guests === undefined ? "No especificado" : String(data.guests))}
    ${row("Fecha Solicitada", data.eventDate || "No especificada")}
    <div style="background:#FAF6ED;padding:16px;border-left:4px solid #2C4A3E">${escapeHtml(data.message || "Sin mensaje adicional.")}</div>`;
  return {
    to: INTERNAL_RECIPIENT,
    from: GENERAL_FROM,
    replyTo: data.email,
    subject: safeSubject(`Cotización de Evento — ${data.name}`),
    html: document("Nueva Cotización de Evento desde la Web", content),
  };
}

function renderComplaint(data: ComplaintData): RenderedEmail {
  const customer = data.audience === "customer";
  const recipient = customer ? data.email! : INTERNAL_RECIPIENT;
  const content = `<p style="text-align:center;font-size:20px"><strong>Código de Hoja de Reclamación: ${escapeHtml(data.code)}</strong></p>
    ${row("Tipo", data.claimType.toUpperCase())}
    ${row("Consumidor", data.fullName)}
    ${row("Documento", `${data.docType} ${data.docNumber}`)}
    ${row("Teléfono", data.phone)}
    ${row("Correo", data.email ?? "")}
    ${row("Dirección", data.address)}
    ${data.isMinor ? row("Apoderado", data.parentName || "No especificado") : ""}
    ${row("Bien Contratado", `${data.claimedType} — ${data.claimedDescription}`)}
    ${data.claimedAmount ? row("Monto Reclamado", `S/ ${String(data.claimedAmount)}`) : ""}
    <p><strong>Detalle de los Hechos:</strong></p><div style="background:#F8F9FA;padding:12px;white-space:pre-wrap">${escapeHtml(data.detail)}</div>
    <p><strong>Pedido del Consumidor:</strong></p><div style="background:#F8F9FA;padding:12px;white-space:pre-wrap">${escapeHtml(data.consumerRequest)}</div>
    <p>Restaurante Las Flores dará respuesta formal en un plazo máximo de <strong>15 días hábiles</strong>.</p>`;
  return {
    to: recipient,
    from: NOTIFICATIONS_FROM,
    replyTo: customer ? INTERNAL_RECIPIENT : data.email,
    subject: safeSubject(
      customer
        ? `Constancia de Libro de Reclamaciones — ${data.code}`
        : `🚨 [Libro de Reclamaciones] Nuevo ${data.claimType.toUpperCase()} Registrado: ${data.code}`,
    ),
    html: document("Libro de Reclamaciones Virtual — Indecopi", content),
  };
}

function renderComplaintResponse(data: ComplaintResponseData): RenderedEmail {
  const content = `<p style="text-align:center"><strong>Código de Hoja de Reclamación: ${escapeHtml(data.code)}</strong></p>
    ${row("Estado actual", data.statusLabel)}
    <p>Estimado(a) <strong>${escapeHtml(data.fullName)}</strong>,</p>
    <p>Le hacemos llegar la respuesta formal a su ${escapeHtml(data.claimType)} registrado:</p>
    <div style="background:#F8F9FA;padding:12px;white-space:pre-wrap">${escapeHtml(data.adminResponse)}</div>`;
  return {
    to: data.email,
    from: NOTIFICATIONS_FROM,
    replyTo: INTERNAL_RECIPIENT,
    subject: safeSubject(`Respuesta a su reclamación — ${data.code}`),
    html: document("Respuesta a su Hoja de Reclamación", content),
  };
}

function renderReviewRequest(data: ReviewRequestData): RenderedEmail {
  const content = `<p>Estimado/a <strong>${escapeHtml(data.name)}</strong>, ha sido un honor recibirle en Restaurante Las Flores.</p>
    <p>Su opinión es fundamental para seguir preservando la mejor gastronomía tradicional de Huamanga.</p>
    <p style="text-align:center"><a href="https://www.google.com/maps/place/Restaurante+Las+Flores/@-13.1629067,-74.222784,17z/data=!4m8!3m7!1s0x911287600027a52b:0x1c3e775f879b7bbe!8m2!3d-13.1629067!4d-74.2179131!9m1!1b1!16s%2Fg%2F11bw_7shlg">Compartir Reseña en Google Maps</a></p>`;
  return {
    to: data.email,
    from: GENERAL_FROM,
    subject: "¿Cómo fue su experiencia en Las Flores? — Tu Opinión en Google Maps",
    html: document("¿Cómo fue su experiencia en Las Flores?", content),
  };
}

export function renderTransactionalEmail(template: string, data: unknown): RenderedEmail {
  switch (template) {
    case "order":
      return renderOrder(parseOrder(data));
    case "reservation":
      return renderReservation(parseReservation(data));
    case "contact":
      return renderContact(parseContact(data));
    case "eventQuote":
      return renderEventQuote(parseEventQuote(data));
    case "complaint":
      return renderComplaint(parseComplaint(data));
    case "complaintResponse":
      return renderComplaintResponse(parseComplaintResponse(data));
    case "reviewRequest":
      return renderReviewRequest(parseReviewRequest(data));
    default:
      return invalid("unknown template");
  }
}
