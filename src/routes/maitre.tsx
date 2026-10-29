import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle, Pencil, Plus, Save, ShieldAlert, UserPlus } from "lucide-react";
import {
  createMaitreWaiter,
  listMaitreWaiters,
  updateMaitreWaiter,
  type MaitreWaiter,
} from "../features/maitre/api";
import { isValidMaitreAccessCode } from "../features/maitre/operations";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/maitre")({
  component: MaitreRoute,
});

interface WaiterForm {
  name: string;
  accessCode: string;
}

const emptyForm: WaiterForm = { name: "", accessCode: "" };

function MaitreRoute() {
  const navigate = useNavigate();
  const [waiters, setWaiters] = useState<MaitreWaiter[]>([]);
  const [createForm, setCreateForm] = useState<WaiterForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<WaiterForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadWaiters = useCallback(async () => {
    const data = await listMaitreWaiters();
    setWaiters(data);
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          navigate({ to: "/staff-login" });
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
          .single();
        if (profileError) throw profileError;

        const role = profile.role?.toLowerCase();
        if (role !== "admin" && role !== "cashier") {
          navigate({ to: "/salon" });
          return;
        }

        await loadWaiters();
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "No se pudo cargar el panel MAITRE.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [loadWaiters, navigate]);

  const saveCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!isValidMaitreAccessCode(createForm.accessCode)) {
      setErrorMessage("El código del mozo debe tener entre 4 y 6 números.");
      return;
    }

    setSaving(true);
    try {
      await createMaitreWaiter(createForm.name.trim(), createForm.accessCode);
      setCreateForm(emptyForm);
      await loadWaiters();
      setSuccessMessage("Cuenta del mozo creada.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo crear la cuenta del mozo.",
      );
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (waiter: MaitreWaiter) => {
    setEditingId(waiter.userId);
    setEditForm({
      name: waiter.name,
      accessCode: "",
    });
    setErrorMessage("");
  };

  const saveEdit = async (waiter: MaitreWaiter) => {
    setErrorMessage("");
    setSuccessMessage("");
    if (editForm.accessCode && !isValidMaitreAccessCode(editForm.accessCode)) {
      setErrorMessage("El código del mozo debe tener entre 4 y 6 números.");
      return;
    }

    setSaving(true);
    try {
      await updateMaitreWaiter({
        userId: waiter.userId,
        name: editForm.name.trim(),
        ...(editForm.accessCode ? { accessCode: editForm.accessCode } : {}),
        isActive: waiter.isActive,
      });
      setEditingId(null);
      await loadWaiters();
      setSuccessMessage("Datos del mozo actualizados.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudieron guardar los cambios.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleWaiter = async (waiter: MaitreWaiter) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSaving(true);
    try {
      await updateMaitreWaiter({ ...waiter, isActive: !waiter.isActive });
      await loadWaiters();
      setSuccessMessage(
        waiter.isActive ? "Acceso del mozo desactivado." : "Acceso del mozo reactivado.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo actualizar el acceso del mozo.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f6f1] text-[#21372b]">
      <header className="border-b border-[#dfe5dc] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#738477]">
              Panel de Caja
            </p>
            <h1 className="font-serif text-2xl font-black">MAITRE · Gestión de mozos</h1>
          </div>
          <Link
            to="/caja"
            className="flex items-center gap-2 rounded-xl border border-[#dfe5dc] px-3 py-2 text-sm font-bold hover:bg-[#f4f6f0]"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Volver a Caja</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-7">
        {(errorMessage || successMessage) && (
          <div
            role={errorMessage ? "alert" : "status"}
            className={`rounded-xl border p-3 text-sm font-semibold ${
              errorMessage
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
          >
            {errorMessage || successMessage}
          </div>
        )}

        <section className="rounded-2xl border border-[#dfe5dc] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-xl bg-[#edf3e9] p-2.5 text-[#315d45]">
              <UserPlus size={21} />
            </span>
            <div>
              <h2 className="font-serif text-xl font-black">Crear acceso para un mozo</h2>
              <p className="text-sm text-[#6e7c70]">
                Asigna un código numérico único de 4 a 6 dígitos para el mozo.
              </p>
            </div>
          </div>
          <form onSubmit={(event) => void saveCreate(event)} className="grid gap-3 md:grid-cols-3">
            <input
              required
              minLength={2}
              maxLength={120}
              value={createForm.name}
              onChange={(event) => setCreateForm((form) => ({ ...form, name: event.target.value }))}
              placeholder="Nombre del mozo"
              autoComplete="off"
              className="rounded-xl border border-[#dce3da] px-3 py-2.5 text-sm outline-none focus:border-[#315d45]"
            />
            <input
              required
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4,6}"
              maxLength={6}
              value={createForm.accessCode}
              onChange={(event) =>
                setCreateForm((form) => ({
                  ...form,
                  accessCode: event.target.value.replace(/\D/g, "").slice(0, 6),
                }))
              }
              placeholder="Código (4–6 números)"
              autoComplete="off"
              className="rounded-xl border border-[#dce3da] px-3 py-2.5 text-sm outline-none focus:border-[#315d45]"
            />
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#315d45] px-4 py-2.5 text-sm font-black text-white hover:bg-[#244b35] disabled:opacity-60"
            >
              {saving ? <LoaderCircle size={17} className="animate-spin" /> : <Plus size={17} />}
              Crear cuenta
            </button>
          </form>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[#6f7d71]">
            <ShieldAlert size={15} className="mt-0.5 shrink-0" />
            El código no se muestra en la lista. Si necesitas cambiarlo, ingresa uno nuevo al
            editar.
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#dfe5dc] bg-white shadow-sm">
          <div className="border-b border-[#edf0eb] px-5 py-4">
            <h2 className="font-serif text-xl font-black">Cuentas de mozos</h2>
            <p className="text-sm text-[#6e7c70]">
              Cambia códigos y habilita o deshabilita accesos.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-[#718074]">
              <LoaderCircle size={18} className="animate-spin" />
              Cargando mozos...
            </div>
          ) : waiters.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#718074]">
              Todavía no hay cuentas de mozos.
            </p>
          ) : (
            <div className="divide-y divide-[#edf0eb]">
              {waiters.map((waiter) => (
                <article key={waiter.userId} className="space-y-3 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(160px,1fr)_180px_auto]">
                      {editingId === waiter.userId ? (
                        <>
                          <input
                            value={editForm.name}
                            onChange={(event) =>
                              setEditForm((form) => ({ ...form, name: event.target.value }))
                            }
                            minLength={2}
                            maxLength={120}
                            aria-label="Nombre del mozo"
                            className="rounded-lg border border-[#dce3da] px-3 py-2 text-sm"
                          />
                          <input
                            value={editForm.accessCode}
                            onChange={(event) =>
                              setEditForm((form) => ({
                                ...form,
                                accessCode: event.target.value.replace(/\D/g, "").slice(0, 6),
                              }))
                            }
                            inputMode="numeric"
                            pattern="[0-9]{4,6}"
                            maxLength={6}
                            placeholder="Nuevo código (opcional)"
                            aria-label="Código numérico"
                            className="rounded-lg border border-[#dce3da] px-3 py-2 text-sm"
                          />
                        </>
                      ) : (
                        <>
                          <div className="min-w-0">
                            <h3 className="truncate font-bold">{waiter.name}</h3>
                            <p className="text-xs text-[#758174]">
                              Código {waiter.hasAccessCode ? "asignado" : "pendiente"}
                            </p>
                          </div>
                          <span
                            className={`w-fit self-center rounded-full px-3 py-1 text-xs font-bold ${
                              waiter.isActive
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {waiter.isActive ? "Activo" : "Desactivado"}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editingId === waiter.userId ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void saveEdit(waiter)}
                            disabled={saving}
                            className="flex items-center gap-1.5 rounded-lg bg-[#315d45] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                          >
                            <Save size={14} /> Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-[#dce3da] px-3 py-2 text-xs font-bold"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => beginEdit(waiter)}
                            className="flex items-center gap-1.5 rounded-lg border border-[#dce3da] px-3 py-2 text-xs font-bold hover:bg-[#f7f8f5]"
                          >
                            <Pencil size={14} /> Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void toggleWaiter(waiter)}
                            disabled={saving}
                            className={`rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-60 ${
                              waiter.isActive
                                ? "border border-red-200 text-red-700 hover:bg-red-50"
                                : "border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                            }`}
                          >
                            {waiter.isActive ? "Desactivar" : "Reactivar"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
