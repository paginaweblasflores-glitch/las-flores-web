import { createClient } from "@supabase/supabase-js";

export async function authorizeCulqiRefund(accessToken: string): Promise<void> {
  const token = accessToken.trim();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!token || !supabaseUrl || !supabaseAnonKey) {
    throw new Error("No autorizado");
  }

  const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await authenticatedSupabase.auth.getUser(token);

  if (authError || !user) {
    throw new Error("No autorizado");
  }

  const { data: profile, error: profileError } = await authenticatedSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || (profile?.role !== "admin" && profile?.role !== "staff")) {
    throw new Error("No autorizado");
  }
}
