import { renderTransactionalEmail } from "./_lib/emailTemplates.ts";

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
const MAX_BODY_BYTES = 200_000;

type ApiRequest = {
  method?: string;
  headers?: Record<string, unknown>;
  body?: unknown;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (value: unknown) => ApiResponse;
  end: () => ApiResponse;
};

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const originHeader = req.headers?.origin ?? req.headers?.Origin;
  const origin = typeof originHeader === "string" ? originHeader : null;

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "authorization, x-client-info, apikey, content-type",
    );
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

  let payload: unknown;
  try {
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return res.status(413).json({ error: "El contenido de la solicitud es demasiado grande" });
    }
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Solicitud inválida" });
  }

  if (
    payload === null ||
    typeof payload !== "object" ||
    Array.isArray(payload) ||
    Object.keys(payload).some((key) => key !== "template" && key !== "data")
  ) {
    return res.status(400).json({ error: "Solicitud inválida" });
  }

  const { template, data } = payload as Record<string, unknown>;
  if (typeof template !== "string" || !("data" in payload)) {
    return res.status(400).json({ error: "Solicitud inválida" });
  }

  let rendered: ReturnType<typeof renderTransactionalEmail>;
  try {
    rendered = renderTransactionalEmail(template, data);
  } catch {
    return res.status(400).json({ error: "Plantilla o datos inválidos" });
  }

  const resendApiKey = process.env.RESEND_API_KEY || "";
  if (!resendApiKey) {
    return res.status(500).json({ error: "Servicio de correo no configurado" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: rendered.from,
        to: rendered.to,
        reply_to: rendered.replyTo,
        subject: rendered.subject,
        html: rendered.html,
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: "No se pudo enviar el correo" });
    }

    const result = await response.json();
    return res.status(200).json({ success: true, id: result?.id });
  } catch {
    return res.status(502).json({ error: "No se pudo enviar el correo" });
  }
}
