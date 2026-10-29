import { supabase } from "../../lib/supabase";

export interface MaitreWaiter {
  userId: string;
  name: string;
  isActive: boolean;
  hasAccessCode: boolean;
}

interface MaitreLoginResponse {
  session: {
    access_token: string;
    refresh_token: string;
  };
}

async function invokeMaitre<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>("maitre-auth", { body });
  if (error) {
    if (error.context instanceof Response) {
      const payload: unknown = await error.context.clone().json();
      if (
        payload &&
        typeof payload === "object" &&
        "error" in payload &&
        typeof payload.error === "string"
      ) {
        throw new Error(payload.error);
      }
    }
    throw error;
  }
  if (!data) throw new Error("El servicio MAITRE no devolvió una respuesta.");
  return data;
}

export async function listMaitreWaiters(): Promise<MaitreWaiter[]> {
  const { waiters } = await invokeMaitre<{ waiters: MaitreWaiter[] }>({ action: "list" });
  return waiters;
}

export async function createMaitreWaiter(name: string, accessCode: string): Promise<void> {
  await invokeMaitre({
    action: "create",
    name,
    accessCode,
  });
}

export async function updateMaitreWaiter(
  waiter: Pick<MaitreWaiter, "userId" | "name" | "isActive"> & { accessCode?: string },
): Promise<void> {
  await invokeMaitre({
    action: "update",
    ...waiter,
  });
}

export async function loginMaitreWaiter(accessCode: string): Promise<void> {
  const { session } = await invokeMaitre<MaitreLoginResponse>({
    action: "login",
    accessCode,
  });

  const { error } = await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  if (error) throw error;
}
