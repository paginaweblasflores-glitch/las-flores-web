/**
 * Endpoint de cobro con Culqi.
 *
 * El cliente nunca determina los precios ni el estado del pedido. La ruta
 * valida la sesión, crea un intento pendiente mediante RPC con service role,
 * cobra el total calculado por SQL y confirma el pedido solo tras verificar
 * el cargo leído nuevamente desde Culqi.
 *
 * IMPORTANTE — por qué este archivo se repite a sí mismo:
 * Este módulo debe ser AUTOCONTENIDO, sin imports relativos a `src/`. El
 * proyecto declara `"type": "module"`, de modo que en tiempo de ejecución Node
 * exige extensión en los imports relativos y la función falla al cargarse
 * (FUNCTION_INVOCATION_FAILED en toda petición, incluido OPTIONS). Solo se
 * admiten especificadores de paquete como `@supabase/supabase-js`, que se
 * resuelven desde node_modules.
 *
 * Las funciones puras de precios que siguen en este módulo se exportan para
 * las pruebas de paridad con `src/lib/pricing.ts` y `src/utils/deliveryUtils.ts`.
 * El checkout real calcula sus precios, cupones y delivery dentro del RPC.
 */

import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "nodejs",
};

// ─────────────────────────────────────────────────────────────────────────────
// Lógica de precios (duplicada de src/lib/pricing.ts — ver nota de cabecera)
// ─────────────────────────────────────────────────────────────────────────────

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Coordenadas del restaurante: Jr. José Olaya 106, Conchopata, Ayacucho. */
const RESTAURANT_LOCATION = { lat: -13.1628496, lng: -74.2178801 };

const DELIVERY_CONFIG = {
  baseCost: 5,
  costPerKm: 1.5,
  maxRadiusKm: 8,
};

interface PricedItem {
  productId: string;
  quantity: number;
  customizations?: Record<string, string>;
}

interface CustomOption {
  id?: string;
  name?: string;
  price?: number;
}

interface CustomOptionSection {
  id?: string;
  title?: string;
  options?: CustomOption[];
}

interface TrustedProduct {
  id: string;
  name: string;
  is_available: boolean;
  custom_options?: CustomOptionSection[] | null;
}

interface ProviderCharge {
  object?: string;
  id?: string;
  paid?: boolean;
  amount?: number;
  currency_code?: string;
  reference_code?: string;
  metadata?: Record<string, unknown>;
  user_message?: string;
  merchant_message?: string;
  code?: string;
  type?: string;
}

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, unknown>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): ApiResponse;
  end(): ApiResponse;
}

interface CouponRule {
  discount_type: string;
  discount_value: number;
  min_order_total?: number | null;
}

export function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

export function formatAmountToCents(amount: number): number {
  return Math.round(amount * 100);
}

/** Distancia en kilómetros entre dos puntos (fórmula de Haversine). */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function calculateDeliveryCost(distanceKm: number): number {
  if (distanceKm === 0) return 0;
  const total = DELIVERY_CONFIG.baseCost + distanceKm * DELIVERY_CONFIG.costPerKm;
  return Math.round(total * 10) / 10;
}

export function calculateCouponDiscount(
  coupon: CouponRule | null | undefined,
  subtotal: number,
): number {
  if (!coupon) return 0;
  if (subtotal < Number(coupon.min_order_total || 0)) return 0;

  const type = String(coupon.discount_type || "").toLowerCase();
  const value = Number(coupon.discount_value || 0);
  if (!Number.isFinite(value) || value <= 0) return 0;

  if (type === "percentage" || type === "percent") {
    return Math.round(subtotal * (value / 100) * 100) / 100;
  }
  return Math.min(value, subtotal);
}

export function computeOrderTotal(params: {
  items: PricedItem[];
  unitPrices: Map<string, number>;
  deliveryFee: number;
  coupon?: CouponRule | null;
}): { subtotal: number; discount: number; deliveryFee: number; total: number } {
  const round2 = (n: number) => Math.round(n * 100) / 100;

  let subtotal = 0;
  for (const item of params.items) {
    const price = params.unitPrices.get(item.productId);
    if (price === undefined) {
      throw new Error(`Precio no encontrado para el producto ${item.productId}`);
    }
    subtotal += price * item.quantity;
  }
  subtotal = round2(subtotal);

  const discount = round2(calculateCouponDiscount(params.coupon, subtotal));
  const deliveryFee = round2(Math.max(0, params.deliveryFee));
  const total = round2(Math.max(0, subtotal - discount + deliveryFee));

  return { subtotal, discount, deliveryFee, total };
}

export function parseIncomingItems(raw: unknown): PricedItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("El pedido no contiene ítems.");
  }
  if (raw.length > 100) {
    throw new Error("El pedido contiene demasiados ítems.");
  }

  return raw.map((entry) => {
    const item = entry as Record<string, unknown>;
    const productId = item.productId ?? item.product_id ?? item.id;
    const quantity = Number(item.quantity);

    if (!isValidUuid(productId)) {
      throw new Error("Los productos del pedido no tienen identificadores válidos.");
    }
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 99) {
      throw new Error("Cantidad de producto inválida.");
    }

    const rawCustomizations = item.customizations;
    let customizations: Record<string, string> | undefined;
    if (rawCustomizations !== undefined) {
      if (
        !rawCustomizations ||
        typeof rawCustomizations !== "object" ||
        Array.isArray(rawCustomizations)
      ) {
        throw new Error("Las personalizaciones del pedido no son válidas.");
      }
      customizations = {};
      for (const [section, option] of Object.entries(rawCustomizations)) {
        if (!section.trim() || typeof option !== "string" || !option.trim()) {
          throw new Error("Las personalizaciones del pedido no son válidas.");
        }
        customizations[section] = option;
      }
    }

    return { productId, quantity, ...(customizations ? { customizations } : {}) };
  });
}

function normalizeOptionLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\s*\d+\.\s*/, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

export function resolveTrustedCustomizations(
  selections: Record<string, string> | undefined,
  customOptions: unknown,
): Record<string, string> {
  if (!selections || Object.keys(selections).length === 0) return {};
  if (!Array.isArray(customOptions)) {
    throw new Error("Las personalizaciones no están disponibles para este producto.");
  }

  const resolved: Record<string, string> = {};
  for (const [sectionLabel, optionLabel] of Object.entries(selections)) {
    const sections = customOptions as CustomOptionSection[];
    const section = sections.find((entry) => {
      const sectionId = typeof entry?.id === "string" ? entry.id : "";
      const sectionTitle = typeof entry?.title === "string" ? entry.title : "";
      return (
        sectionId === sectionLabel ||
        normalizeOptionLabel(sectionId) === normalizeOptionLabel(sectionLabel) ||
        normalizeOptionLabel(sectionTitle) === normalizeOptionLabel(sectionLabel)
      );
    }) as { id?: string; options?: Array<{ id?: string; name?: string }> } | undefined;
    const option = section?.options?.find((entry) => {
      const optionId = typeof entry.id === "string" ? entry.id : "";
      const optionName = typeof entry.name === "string" ? entry.name : "";
      return (
        optionId === optionLabel ||
        normalizeOptionLabel(optionId) === normalizeOptionLabel(optionLabel) ||
        normalizeOptionLabel(optionName) === normalizeOptionLabel(optionLabel)
      );
    });

    if (!section?.id || !option?.id || resolved[section.id]) {
      throw new Error("La opción de personalización seleccionada no es válida.");
    }
    resolved[section.id] = option.id;
  }

  return resolved;
}

// ─────────────────────────────────────────────────────────────────────────────
// Control de acceso
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Orígenes autorizados a invocar el cobro. Se evita `*` porque la respuesta
 * viaja con credenciales y el endpoint mueve dinero.
 */
const ALLOWED_ORIGINS = [
  "https://restaurantelasflores.com",
  "https://www.restaurantelasflores.com",
  "https://las-flores-elevated-main.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
];

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Previews de Vercel del propio proyecto.
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function applyCors(req: ApiRequest, res: ApiResponse): void {
  const origin = req.headers?.origin as string | undefined;
  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin as string);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req: ApiRequest, res: ApiResponse) {
  applyCors(req, res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const origin = req.headers?.origin as string | undefined;
  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ success: false, error: "Origen no autorizado" });
  }

  let persistedAttempt: Record<string, unknown> | null = null;
  try {
    const payload = (
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}
    ) as Record<string, unknown>;
    const secretKey = process.env.CULQI_SECRET_KEY;
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secretKey) {
      return res.status(500).json({
        success: false,
        error: "La pasarela de pagos no está configurada. Contacta al restaurante.",
      });
    }
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error("[culqi-charge] Credenciales de Supabase no configuradas");
      return res.status(500).json({
        success: false,
        error: "El servicio seguro de pagos no está configurado. Contacta al restaurante.",
      });
    }

    const tokenId = typeof payload.tokenId === "string" ? payload.tokenId.trim() : "";
    const attemptId = payload.checkoutAttemptId;
    const orderType = payload.orderType;
    const authorization = req.headers?.authorization || req.headers?.Authorization || "";
    const bearer =
      typeof authorization === "string" ? authorization.match(/^Bearer\s+(.+)$/i) : null;

    if (!bearer) {
      return res.status(401).json({ success: false, error: "Debes iniciar sesión para pagar." });
    }
    if (!tokenId) {
      return res.status(400).json({ success: false, error: "Falta el token de la tarjeta." });
    }
    if (!isValidUuid(attemptId)) {
      return res.status(400).json({ success: false, error: "El intento de pago no es válido." });
    }
    if (orderType !== "delivery" && orderType !== "pickup") {
      return res.status(400).json({ success: false, error: "Tipo de pedido inválido." });
    }

    let items: PricedItem[];
    try {
      items = parseIncomingItems(payload.items);
    } catch (error: unknown) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "El pedido no es válido.",
      });
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(bearer[1]);
    const user = authData?.user;
    if (authError || !user?.id || !user.email || !EMAIL_REGEX.test(user.email)) {
      return res.status(401).json({ success: false, error: "La sesión no es válida." });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const productIds = [...new Set(items.map((item) => item.productId))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, custom_options, is_available")
      .in("id", productIds);

    if (productsError) {
      console.error("[culqi-charge] Error consultando productos:", productsError.message);
      return res.status(502).json({ success: false, error: "No se pudo validar el pedido." });
    }
    if (!products || products.length !== productIds.length) {
      return res
        .status(400)
        .json({ success: false, error: "Algunos productos ya no existen en la carta." });
    }

    const productRows = products as TrustedProduct[];
    const productById = new Map<string, TrustedProduct>(
      productRows.map((product) => [product.id, product]),
    );
    const unavailable = productRows.filter((product) => product.is_available === false);
    if (unavailable.length) {
      return res.status(409).json({
        success: false,
        error: `Estos platos se agotaron: ${unavailable.map((product) => product.name).join(", ")}.`,
      });
    }

    let serverItems: Array<Record<string, unknown>>;
    try {
      serverItems = items.map((item) => {
        const product = productById.get(item.productId);
        if (!product) throw new Error("Producto no encontrado.");
        const customizations = resolveTrustedCustomizations(
          item.customizations,
          product.custom_options,
        );
        const notes = Object.entries(customizations)
          .map(([sectionId, optionId]) => {
            const section = product.custom_options?.find((entry) => entry.id === sectionId);
            const option = section?.options?.find((entry) => entry.id === optionId);
            if (!section || !option) {
              throw new Error("La opción de personalización no es válida.");
            }
            return `${String(section.title).replace(/^\s*\d+\.\s*/, "")}: ${option.name}`;
          })
          .join("; ");
        return {
          id: item.productId,
          quantity: item.quantity,
          product_name: product.name,
          ...(notes ? { notes } : {}),
          ...(Object.keys(customizations).length ? { customizations } : {}),
        };
      });
    } catch (error: unknown) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "La personalización no es válida.",
      });
    }

    let latitude: number | null = null;
    let longitude: number | null = null;
    let distanceKm = 0;
    if (orderType === "delivery") {
      latitude = Number(String(payload.latitude));
      longitude = Number(String(payload.longitude));
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return res.status(400).json({ success: false, error: "Falta la ubicación de entrega." });
      }
      distanceKm = calculateDistanceKm(
        RESTAURANT_LOCATION.lat,
        RESTAURANT_LOCATION.lng,
        latitude,
        longitude,
      );
      if (distanceKm > DELIVERY_CONFIG.maxRadiusKm) {
        return res
          .status(400)
          .json({ success: false, error: "La dirección está fuera de cobertura." });
      }
    }

    const userName =
      typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
        ? user.user_metadata.full_name.trim().slice(0, 100)
        : user.email;
    const phone =
      typeof payload.customerPhone === "string"
        ? payload.customerPhone.replace(/\D/g, "").slice(-9)
        : "";
    const address = typeof payload.address === "string" ? payload.address.trim().slice(0, 200) : "";
    const notes = typeof payload.notes === "string" ? payload.notes.trim().slice(0, 500) : "";
    const couponCode =
      typeof payload.couponCode === "string" ? payload.couponCode.trim().toUpperCase() : "";
    const pendingResult = await supabase.rpc("create_pending_card_order", {
      p_checkout_attempt_id: attemptId,
      p_user_id: user.id,
      p_client_name: userName,
      p_client_email: user.email,
      p_client_phone: phone || "000000000",
      p_order_type: orderType,
      p_items: serverItems,
      p_address: orderType === "delivery" ? address || null : null,
      p_reference:
        orderType === "delivery" && typeof payload.reference === "string"
          ? payload.reference.trim().slice(0, 200) || null
          : null,
      p_latitude: latitude,
      p_longitude: longitude,
      p_coupon_code: couponCode || null,
      p_notes: notes || null,
    });
    if (pendingResult.error) {
      console.error("[culqi-charge] Error creando intento de pago:", pendingResult.error.message);
      return res
        .status(409)
        .json({ success: false, error: "No se pudo preparar el pedido para el pago." });
    }

    const pending = Array.isArray(pendingResult.data) ? pendingResult.data[0] : pendingResult.data;
    if (!pending || typeof pending !== "object") {
      return res
        .status(502)
        .json({ success: false, error: "No se pudo confirmar el intento de pago." });
    }
    if (pending.created !== true) {
      return res.status(200).json({
        success: pending.payment_status === "paid",
        paymentStatus: pending.payment_status,
        orderId: pending.order_id,
        orderNumber: pending.order_number,
        total: pending.total,
        order:
          pending.payment_status === "paid"
            ? {
                id: pending.order_id,
                order_number: pending.order_number,
                payment_status: pending.payment_status,
                subtotal: pending.subtotal,
                discount_amount: pending.discount_amount,
                delivery_fee: pending.delivery_fee,
                total: pending.total,
              }
            : undefined,
        verifiedTotals:
          pending.payment_status === "paid"
            ? {
                subtotal: pending.subtotal,
                discount: pending.discount_amount,
                deliveryFee: pending.delivery_fee,
                total: pending.total,
              }
            : undefined,
      });
    }

    persistedAttempt = pending;
    if (pending.payment_status !== "pending" || !pending.order_id) {
      return res.status(202).json({
        success: false,
        paymentStatus: pending.payment_status || "pending",
        orderId: pending.order_id,
        reconciliationRequired: true,
      });
    }

    const amountCents = formatAmountToCents(Number(pending.total));
    if (!Number.isInteger(amountCents) || amountCents < 100) {
      const failed = await supabase.rpc("fail_card_order_attempt", {
        p_checkout_attempt_id: attemptId,
        p_failure_reason: "invalid_server_total",
      });
      if (failed.error) {
        return res.status(202).json({
          success: false,
          paymentStatus: "pending",
          orderId: pending.order_id,
          reconciliationRequired: true,
        });
      }
      persistedAttempt = null;
      return res
        .status(400)
        .json({ success: false, paymentStatus: "failed", error: "Importe mínimo inválido." });
    }

    const customerName = userName || user.email;
    const chargePayload = {
      amount: amountCents,
      currency_code: "PEN",
      email: user.email,
      source_id: tokenId,
      description: "Pedido en Restaurante Las Flores",
      metadata: {
        checkout_attempt_id: attemptId,
        order_id: pending.order_id,
        customer_name: customerName,
        ...(phone ? { customer_phone: phone } : {}),
        ...(address ? { delivery_address: address } : {}),
      },
      antifraud_details: {
        first_name: customerName.split(" ")[0] || "Cliente",
        last_name: customerName.split(" ").slice(1).join(" ") || "Las Flores",
        address: address || "Ayacucho",
        address_city: "Ayacucho",
        phone_number: phone || "000000000",
        country_code: "PE",
      },
    };

    const chargeResponse = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(chargePayload),
    });
    const createdCharge = (await chargeResponse.json()) as ProviderCharge;
    if (!chargeResponse.ok || createdCharge.object === "error") {
      console.error("[culqi-charge] Culqi respondió con error:", JSON.stringify(createdCharge));
      if (chargeResponse.status >= 400 && chargeResponse.status < 500) {
        const failed = await supabase.rpc("fail_card_order_attempt", {
          p_checkout_attempt_id: attemptId,
          p_failure_reason: String(
            createdCharge.code || createdCharge.type || "culqi_declined",
          ).slice(0, 200),
        });
        if (!failed.error) {
          persistedAttempt = null;
          return res.status(402).json({
            success: false,
            paymentStatus: "failed",
            error:
              createdCharge.user_message ||
              createdCharge.merchant_message ||
              "El pago fue rechazado.",
          });
        }
      }
      return res.status(202).json({
        success: false,
        paymentStatus: "pending",
        orderId: pending.order_id,
        reconciliationRequired: true,
        error: "El pago requiere revisión. No vuelvas a intentarlo todavía.",
      });
    }

    const chargeId = typeof createdCharge.id === "string" ? createdCharge.id : "";
    if (!chargeId) {
      return res.status(202).json({
        success: false,
        paymentStatus: "pending",
        orderId: pending.order_id,
        reconciliationRequired: true,
        error: "El pago requiere revisión. No vuelvas a intentarlo todavía.",
      });
    }

    const verificationResponse = await fetch(
      `https://api.culqi.com/v2/charges/${encodeURIComponent(chargeId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      },
    );
    const charge = (await verificationResponse.json()) as ProviderCharge;
    if (
      !verificationResponse.ok ||
      charge.object === "error" ||
      charge.id !== chargeId ||
      charge.paid !== true ||
      typeof charge.amount !== "number" ||
      charge.currency_code !== "PEN" ||
      charge.amount !== amountCents ||
      charge.metadata?.checkout_attempt_id !== attemptId ||
      charge.metadata?.order_id !== String(pending.order_id)
    ) {
      return res.status(202).json({
        success: false,
        paymentStatus: "pending",
        orderId: pending.order_id,
        reconciliationRequired: true,
        error: "El pago requiere revisión. No vuelvas a intentarlo todavía.",
      });
    }

    const completion = await supabase.rpc("complete_card_order_payment", {
      p_order_id: pending.order_id,
      p_checkout_attempt_id: attemptId,
      p_charge_id: charge.id,
      p_amount: charge.amount,
      p_currency_code: charge.currency_code,
    });
    const completed = Array.isArray(completion.data) ? completion.data[0] : completion.data;
    if (
      completion.error ||
      !completed ||
      completed.payment_status !== "paid" ||
      completed.order_id !== pending.order_id
    ) {
      return res.status(202).json({
        success: false,
        paymentStatus: "pending",
        orderId: pending.order_id,
        reconciliationRequired: true,
        error: "El pago fue recibido y requiere conciliación antes de confirmar el pedido.",
      });
    }

    persistedAttempt = null;
    return res.status(200).json({
      success: true,
      paymentStatus: "paid",
      chargeId: charge.id,
      amount: charge.amount,
      currency: charge.currency_code,
      referenceCode: charge.reference_code,
      order: { ...completed, id: completed.order_id },
      verifiedTotals: {
        subtotal: completed.subtotal,
        discount: completed.discount_amount,
        deliveryFee: completed.delivery_fee,
        total: completed.total,
        distanceKm: Math.round(distanceKm * 100) / 100,
      },
    });
  } catch (error: unknown) {
    console.error("[culqi-charge] Error inesperado:", error);
    if (persistedAttempt) {
      return res.status(202).json({
        success: false,
        paymentStatus: "pending",
        orderId: persistedAttempt.order_id,
        reconciliationRequired: true,
        error: "El pago requiere revisión. No vuelvas a intentarlo todavía.",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Error interno al preparar el pago. No se confirmó ningún cargo.",
    });
  }
}
