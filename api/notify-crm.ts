export const config = {
  runtime: "nodejs",
};

const ALLOWED_ORIGINS = [
  "https://restaurantelasflores.com",
  "https://www.restaurantelasflores.com",
  "https://las-flores-elevated-main.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
];

const CRM_WEBHOOK_URL = "https://crm-grupo-las-flores.vercel.app/api/clientes/webhook";
const PHONE_REGEX = /^9\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BIRTHDATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // Same origin o llamada servidor-a-servidor
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

export default async function handler(req: any, res: any) {
  const origin = req.headers?.origin || req.headers?.Origin || null;

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ error: "Origen no autorizado" });
  }

  try {
    const webhookSecret = process.env.CRM_WEBHOOK_SECRET || "";
    if (!webhookSecret) {
      console.warn("CRM_WEBHOOK_SECRET no configurada en las variables de entorno de Vercel.");
      return res.status(500).json({ error: "Integración con CRM no configurada" });
    }

    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { nombre_completo, celular, correo, fecha_de_nacimiento } = payload || {};

    const cleanPhone = typeof celular === "string" ? celular.replace(/\D/g, "") : "";
    if (!PHONE_REGEX.test(cleanPhone)) {
      return res.status(400).json({ error: "Celular inválido" });
    }
    if (typeof correo !== "string" || !EMAIL_REGEX.test(correo.trim())) {
      return res.status(400).json({ error: "Correo inválido" });
    }
    if (typeof fecha_de_nacimiento !== "string" || !BIRTHDATE_REGEX.test(fecha_de_nacimiento)) {
      return res.status(400).json({ error: "Fecha de nacimiento inválida" });
    }
    if (typeof nombre_completo !== "string" || !nombre_completo.trim()) {
      return res.status(400).json({ error: "Nombre inválido" });
    }

    const crmResponse = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${webhookSecret}`,
      },
      body: JSON.stringify({
        nombre_completo: nombre_completo.trim(),
        celular: cleanPhone,
        correo: correo.trim(),
        fecha_de_nacimiento,
        fuente: "registro_web",
      }),
    });

    if (!crmResponse.ok) {
      const errorText = await crmResponse.text();
      console.error("Error del CRM al notificar cliente nuevo:", errorText);
      return res.status(502).json({ error: "El CRM rechazó el registro" });
    }

    const data = await crmResponse.json().catch(() => ({}));
    return res.status(200).json({ success: true, crm: data });
  } catch (err: any) {
    console.error("Error en endpoint notify-crm:", err);
    return res.status(500).json({ error: "Error interno al notificar al CRM" });
  }
}
