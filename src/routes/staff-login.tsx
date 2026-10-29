import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { UserCircle2, Lock, Loader2, LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import { loginMaitreWaiter } from "../features/maitre/api";
import { getStaffLoginDestination, isValidMaitreAccessCode } from "../features/maitre/operations";

// Mapa interno usuario → correo real de Supabase Auth. El personal solo ve y
// elige su "Usuario"; el correo nunca se muestra ni se escribe (es la
// credencial de doble validación puertas adentro).
const STAFF_USERS = [
  { username: "Administrador Las Flores", email: "restaurantelasfloresperu@gmail.com" },
  { username: "Caja Las Flores", email: "paginaweblasflores@gmail.com" },
  { username: "Ventas Las Flores", email: "convencioneslyfayacucho@gamil.com" },
  { username: "MAITRE", email: "" },
];

export const Route = createFileRoute("/staff-login")({
  head: () => ({
    meta: [
      { title: "Acceso Administrativo | Restaurante Las Flores" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const [username, setUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirige según el rol del perfil ya autenticado
  const redirectByRole = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const destination = getStaffLoginDestination(profile?.role || "");
    if (destination) {
      window.location.href = destination;
    } else {
      setErrorMsg("Tu cuenta no tiene acceso a ningún panel administrativo.");
      await supabase.auth.signOut();
      setLoading(false);
      setCheckingSession(false);
    }
  };

  // Si ya hay una sesión activa (p. ej. volvió a esta página), redirige directo
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await redirectByRole(session.user.id);
      } else {
        setCheckingSession(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (username === "MAITRE") {
      if (!isValidMaitreAccessCode(accessCode)) {
        setErrorMsg("El código del mozo debe tener entre 4 y 6 números.");
        return;
      }

      setLoading(true);
      try {
        await loginMaitreWaiter(accessCode);
        window.location.href = "/salon";
      } catch (error) {
        setErrorMsg(
          error instanceof Error ? error.message : "No se pudo iniciar sesión como mozo.",
        );
        setLoading(false);
      }
      return;
    }

    const staffUser = STAFF_USERS.find((u) => u.username === username);
    if (!staffUser) {
      setErrorMsg("Selecciona un usuario válido.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: staffUser.email,
      password,
    });

    if (error || !data.user) {
      setErrorMsg("Usuario o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    await redirectByRole(data.user.id);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1b2a24]">
        <Loader2 size={28} className="animate-spin text-[#FAF6ED]/70" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b2a24] p-4">
      <div className="bg-[#FAF6ED] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#2C4A3E]/15">
        {/* Header */}
        <div className="bg-[#2C4A3E] text-[#FAF6ED] p-7 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center mx-auto mb-3 border border-[#D4AF37]/30 shadow-inner overflow-hidden">
            <img
              src="/logo/logo-trasparente.webp"
              alt="Las Flores"
              className="w-11 h-11 object-contain"
            />
          </div>
          <h1 className="font-serif font-bold text-2xl text-white">Ingreso del personal</h1>
          <p className="text-sm text-[#FAF6ED]/75 mt-1.5">
            Ingresa con tus credenciales de Caja o MAITRE.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-[0.14em] mb-1.5 flex items-center gap-1.5">
              <UserCircle2 size={13} className="text-[#2C4A3E]/70" />
              Usuario
            </label>
            <select
              required
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setAccessCode("");
                setErrorMsg("");
              }}
              className="w-full px-4 py-3 rounded-xl border border-[#2C4A3E]/20 bg-white text-base md:text-sm font-medium text-[#1b2a24] focus:outline-none focus:ring-2 focus:ring-[#2C4A3E] transition-all shadow-xs cursor-pointer"
            >
              <option value="">Selecciona tu usuario...</option>
              {STAFF_USERS.map((u) => (
                <option key={u.username} value={u.username}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          {username === "MAITRE" ? (
            <div>
              <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-[0.14em] mb-1.5 flex items-center gap-1.5">
                <UserCircle2 size={13} className="text-[#2C4A3E]/70" /> Código numérico del mozo
              </label>
              <input
                required
                autoComplete="one-time-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4,6}"
                maxLength={6}
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Ej. 0042"
                className="w-full rounded-xl border border-[#2C4A3E]/20 bg-white px-4 py-3 text-base font-medium text-[#1b2a24] shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#2C4A3E] md:text-sm"
              />
              <p className="mt-1.5 text-xs text-[#2C4A3E]/65">
                Ingresa el código asignado por Caja.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-[0.14em] mb-1.5 flex items-center gap-1.5">
                <Lock size={13} className="text-[#2C4A3E]/70" /> Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#2C4A3E]/20 bg-white text-base md:text-sm font-medium text-[#1b2a24] focus:outline-none focus:ring-2 focus:ring-[#2C4A3E] transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C4A3E]/50 hover:text-[#2C4A3E] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 text-center">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-serif font-bold text-base tracking-wide bg-[#2C4A3E] text-[#FAF6ED] hover:bg-[#233b31] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Ingresando...
              </>
            ) : (
              <>
                <LogIn size={18} /> Iniciar Sesión
              </>
            )}
          </button>

          <Link
            to="/restaurante"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2C4A3E]/70 hover:text-[#2C4A3E] transition-colors pt-1"
          >
            <ArrowLeft size={13} /> Volver al sitio
          </Link>
        </form>
      </div>
    </div>
  );
}
