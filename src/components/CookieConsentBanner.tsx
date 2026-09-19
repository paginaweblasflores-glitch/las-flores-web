import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "lf_cookie_consent";

/**
 * Aviso de cookies. El sitio carga Google Analytics en cada visita
 * (ver __root.tsx), así que este aviso informa de eso y enlaza a la
 * política de privacidad. Se muestra una sola vez por navegador.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage bloqueado (modo privado, etc.) — no mostramos el aviso.
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Si no se puede guardar, igual cerramos el aviso para esta sesión.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:left-6 md:right-auto md:max-w-sm z-[9998] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-piedra border border-nogal/15 rounded-2xl shadow-xl p-5">
        <p className="font-serif text-sm text-nogal font-semibold mb-1.5">
          Usamos cookies
        </p>
        <p className="text-xs text-nogal/70 leading-relaxed mb-3">
          Esta web usa cookies para analizar el tráfico y mejorar tu experiencia.
          {" "}
          <Link
            to="/politica-de-privacidad"
            hash="cookies"
            className="text-eucalipto font-semibold hover:underline"
          >
            Consulta nuestra Política de Privacidad
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="w-full bg-eucalipto hover:bg-eucalipto-dark text-piedra font-bold uppercase tracking-widest text-xs py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.99]"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
