import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2, LogOut, Trash2, Upload } from "lucide-react";
import {
  deleteMarketingFlyers,
  getLatestMarketingFlyer,
  getMarketingFlyerPublicUrl,
  getMarketingFlyerValidationError,
  uploadMarketingFlyer,
  type MarketingFlyer,
} from "../features/marketing/api";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "Marketing | Restaurante Las Flores" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MarketingPage,
});

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string") return message;
  }
  return fallback;
}

function MarketingPage() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [flyer, setFlyer] = useState<MarketingFlyer | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError?.name === "AuthSessionMissingError" || (!user && !userError)) {
          await navigate({ to: "/staff-login" });
          return;
        }
        if (userError) throw userError;
        if (!user) {
          await navigate({ to: "/staff-login" });
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profileError) throw profileError;

        if (profile.role !== "marketing" && profile.role !== "admin") {
          await supabase.auth.signOut();
          await navigate({ to: "/staff-login" });
          return;
        }

        const latestFlyer = await getLatestMarketingFlyer();
        if (active) {
          setFlyer(latestFlyer);
          setAuthorized(true);
        }
      } catch (accessError) {
        if (active) {
          setError(errorMessage(accessError, "No se pudo verificar el acceso de Marketing."));
        }
      } finally {
        if (active) setCheckingAccess(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    const validationError = getMarketingFlyerValidationError(file);
    if (validationError) {
      setError(validationError);
      input.value = "";
      return;
    }

    setUploading(true);
    try {
      const newFlyer = await uploadMarketingFlyer(file);
      setFlyer(newFlyer);
      setSuccess("El flyer quedó publicado en la portada.");
    } catch (uploadError) {
      setError(errorMessage(uploadError, "No se pudo subir el flyer."));
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(errorMessage(signOutError, "No se pudo cerrar la sesión."));
      return;
    }
    await navigate({ to: "/staff-login" });
  };

  const handleDeleteFlyer = async () => {
    if (
      !flyer ||
      !window.confirm("¿Eliminar el flyer y dejar de mostrar promociones en la portada?")
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setDeleting(true);
    try {
      const { cleanupError } = await deleteMarketingFlyers();
      setFlyer(null);
      if (cleanupError) {
        setError(
          `El flyer ya no se mostrará, pero no se pudo eliminar su archivo: ${errorMessage(cleanupError, "Error de almacenamiento.")}`,
        );
        return;
      }
      setSuccess("El flyer fue eliminado y ya no se mostrará en la portada.");
    } catch (deleteError) {
      setError(errorMessage(deleteError, "No se pudo eliminar el flyer."));
    } finally {
      setDeleting(false);
    }
  };

  if (checkingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1b2a24]">
        <Loader2 size={28} className="animate-spin text-[#FAF6ED]/70" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1b2a24] p-6">
        <p role="alert" className="max-w-md rounded-xl bg-[#FAF6ED] p-6 text-center text-red-800">
          {error || "No tienes acceso al panel de Marketing."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF6ED] text-[#1b2a24]">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#2C4A3E] px-6 py-5 text-white sm:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            Restaurante Las Flores
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold">Panel de Marketing</h1>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2C4A3E] hover:underline"
        >
          <ArrowLeft size={16} /> Volver al sitio
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
          <section className="rounded-2xl border border-[#2C4A3E]/15 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-xl bg-[#2C4A3E]/10 p-3 text-[#2C4A3E]">
                <ImagePlus size={22} />
              </span>
              <div>
                <h2 className="font-serif text-xl font-bold">Flyer de portada</h2>
                <p className="mt-1 text-sm text-[#1b2a24]/65">
                  El nuevo flyer reemplaza al actual y se muestra en un popup al entrar a la
                  portada.
                </p>
              </div>
            </div>

            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2C4A3E]/30 bg-[#FAF6ED] px-5 py-8 text-center transition-colors hover:border-[#2C4A3E] hover:bg-[#2C4A3E]/5">
              {uploading ? (
                <Loader2 size={28} className="mb-3 animate-spin text-[#2C4A3E]" />
              ) : (
                <Upload size={28} className="mb-3 text-[#2C4A3E]" />
              )}
              <span className="font-semibold">
                {uploading ? "Subiendo flyer..." : "Seleccionar flyer para publicar"}
              </span>
              <span className="mt-2 text-xs text-[#1b2a24]/60">
                JPG, PNG o WebP · compresión automática a WebP
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading || deleting}
                onChange={(event) => void handleUpload(event)}
                className="sr-only"
              />
            </label>

            {flyer && (
              <button
                type="button"
                onClick={() => void handleDeleteFlyer()}
                disabled={uploading || deleting}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {deleting ? "Eliminando flyer..." : "Eliminar flyer"}
              </button>
            )}

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
              >
                {error}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
              >
                {success}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-[#2C4A3E]/15 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-xl font-bold">Vista previa actual</h2>
            {flyer ? (
              <img
                src={getMarketingFlyerPublicUrl(flyer.storage_path)}
                alt="Flyer actualmente publicado"
                className="mt-5 max-h-[32rem] w-full rounded-xl bg-[#FAF6ED] object-contain"
              />
            ) : (
              <p className="mt-5 rounded-xl bg-[#FAF6ED] p-6 text-sm text-[#1b2a24]/70">
                Todavía no hay un flyer publicado en la portada.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
