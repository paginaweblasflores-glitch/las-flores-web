import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const codePepper = Deno.env.get("MAITRE_CODE_PEPPER") || "";
const invalidCredentialsMessage = "El código del mozo no es válido.";

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  return (
    /^https:\/\/(www\.)?restaurantelasflores\.com$/i.test(origin) ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin) ||
    /^http:\/\/localhost:\d+$/i.test(origin)
  );
}

function headers(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    Vary: "Origin",
    ...(origin && isAllowedOrigin(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
  };
}

function response(
  origin: string | null,
  status: number,
  payload: Record<string, unknown>,
): Response {
  return new Response(JSON.stringify(payload), { status, headers: headers(origin) });
}

function isAccessCode(value: unknown): value is string {
  return typeof value === "string" && /^[0-9]{4,6}$/.test(value);
}

function isValidName(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 120;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashMaitreValue(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(codePepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(signature));
}

function randomAuthPassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "x");
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function createServiceClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function loginWithAccessCode(
  body: Record<string, unknown>,
  origin: string | null,
  request: Request,
): Promise<Response> {
  if (!isAccessCode(body.accessCode)) {
    return response(origin, 401, { error: invalidCredentialsMessage });
  }

  const service = createServiceClient();
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";
  const attemptKeyHash = await hashMaitreValue(clientIp);
  const { data: attemptAllowed, error: attemptError } = await service.rpc(
    "consume_maitre_login_attempt",
    { p_attempt_key_hash: attemptKeyHash },
  );
  if (attemptError) throw attemptError;
  if (!attemptAllowed) return response(origin, 429, { error: invalidCredentialsMessage });

  const accessCodeHash = await hashMaitreValue(body.accessCode);
  const { data: waiter, error: waiterError } = await service
    .from("maitre_waiters")
    .select("user_id, is_active")
    .eq("access_code_hash", accessCodeHash)
    .maybeSingle();

  if (waiterError) throw waiterError;

  const { data: profile, error: profileError } = await service
    .from("profiles")
    .select("email, role")
    .eq("id", waiter?.user_id || "00000000-0000-0000-0000-000000000000")
    .maybeSingle();

  if (profileError) throw profileError;

  if (waiter?.is_active !== true || profile?.role?.toLowerCase() !== "staff" || !profile.email) {
    return response(origin, 401, { error: invalidCredentialsMessage });
  }

  const { data: link, error: linkError } = await service.auth.admin.generateLink({
    type: "magiclink",
    email: profile.email,
  });
  if (linkError || !link.properties?.hashed_token) {
    throw linkError || new Error("No se pudo crear una sesión para el mozo.");
  }

  const auth = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await auth.auth.verifyOtp({
    email: profile.email,
    token_hash: link.properties.hashed_token,
    type: "magiclink",
  });
  if (error || !data.session) return response(origin, 401, { error: invalidCredentialsMessage });

  const { error: clearAttemptError } = await service.rpc("clear_maitre_login_attempt", {
    p_attempt_key_hash: attemptKeyHash,
  });
  if (clearAttemptError) throw clearAttemptError;

  return response(origin, 200, {
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
  });
}

async function authorizeManager(
  authorization: string | null,
): Promise<{ service: ReturnType<typeof createServiceClient>; userId: string } | null> {
  if (!authorization?.startsWith("Bearer ")) return null;

  const auth = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: userError } = await auth.auth.getUser();
  if (userError || !userData.user) return null;

  const service = createServiceClient();
  const { data: profile, error: profileError } = await service
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();
  const role = profile?.role?.toLowerCase();

  if (profileError || (role !== "cashier" && role !== "admin")) return null;
  return { service, userId: userData.user.id };
}

async function handleManagement(
  body: Record<string, unknown>,
  authorization: string | null,
  origin: string | null,
): Promise<Response> {
  const manager = await authorizeManager(authorization);
  if (!manager)
    return response(origin, 403, { error: "Solo Caja o Administración puede gestionar mozos." });

  const { service, userId: managerId } = manager;

  if (body.action === "list") {
    const { data, error } = await service
      .from("maitre_waiters")
      .select("user_id, access_code_hash, is_active, profiles!inner(full_name)")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const waiters = (data || []).map((waiter: Record<string, unknown>) => {
      const profile = waiter.profiles as { full_name?: string } | null;
      return {
        userId: waiter.user_id,
        isActive: waiter.is_active,
        hasAccessCode: Boolean(waiter.access_code_hash),
        name: profile?.full_name || "Mozo",
      };
    });
    return response(origin, 200, { waiters });
  }

  if (body.action === "create") {
    if (!isValidName(body.name) || !isAccessCode(body.accessCode)) {
      return response(origin, 400, {
        error: "Revisa el nombre y el código de 4 a 6 números.",
      });
    }

    const email = `maitre-${crypto.randomUUID()}@staff.restaurantelasflores.com`;
    const { data: created, error: createError } = await service.auth.admin.createUser({
      email,
      password: randomAuthPassword(),
      email_confirm: true,
      user_metadata: { full_name: body.name.trim() },
    });
    if (createError || !created.user) {
      if (createError?.message.toLowerCase().includes("already")) {
        return response(origin, 409, { error: "No se pudo crear la cuenta. Intenta nuevamente." });
      }
      throw createError || new Error("No se pudo crear el usuario de autenticación.");
    }

    const { error: registerError } = await service.rpc("register_maitre_waiter", {
      p_user_id: created.user.id,
      p_email: email,
      p_name: body.name.trim(),
      p_access_code_hash: await hashMaitreValue(body.accessCode),
      p_created_by: managerId,
    });

    if (registerError) {
      const { error: rollbackError } = await service.auth.admin.deleteUser(created.user.id);
      if (rollbackError) console.error("No se pudo eliminar una cuenta MAITRE incompleta.");
      if (registerError.code === "23505") {
        return response(origin, 409, { error: "Ese código ya está asignado a otro mozo." });
      }
      throw registerError;
    }

    return response(origin, 201, { success: true });
  }

  if (body.action === "update") {
    if (
      !isUuid(body.userId) ||
      !isValidName(body.name) ||
      (body.accessCode !== undefined && !isAccessCode(body.accessCode)) ||
      typeof body.isActive !== "boolean"
    ) {
      return response(origin, 400, { error: "Los datos del mozo no son válidos." });
    }

    const { error } = await service.rpc("update_maitre_waiter", {
      p_user_id: body.userId,
      p_name: body.name.trim(),
      p_access_code_hash:
        typeof body.accessCode === "string" ? await hashMaitreValue(body.accessCode) : null,
      p_is_active: body.isActive,
    });

    if (error?.code === "23505") {
      return response(origin, 409, { error: "Ese código ya está asignado a otro mozo." });
    }
    if (error) throw error;

    return response(origin, 200, { success: true });
  }

  return response(origin, 400, { error: "La acción solicitada no es válida." });
}

serve(async (request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    return new Response("ok", { status: 204, headers: headers(origin) });
  }

  if (!isAllowedOrigin(origin)) return response(origin, 403, { error: "Origen no autorizado." });
  if (request.method !== "POST") return response(origin, 405, { error: "Método no permitido." });

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey || !codePepper) {
    console.error("Faltan variables de entorno para la función MAITRE.");
    return response(origin, 500, { error: "El servicio de cuentas no está configurado." });
  }

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 20_000) {
      return response(origin, 413, { error: "La solicitud es demasiado grande." });
    }

    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return response(origin, 400, { error: "La solicitud no es válida." });
    }

    const payload = body as Record<string, unknown>;
    if (payload.action === "login") return await loginWithAccessCode(payload, origin, request);
    return await handleManagement(payload, request.headers.get("authorization"), origin);
  } catch (error) {
    console.error("Error en el servicio de cuentas MAITRE:", error);
    return response(origin, 500, { error: "No se pudo completar la operación." });
  }
});
