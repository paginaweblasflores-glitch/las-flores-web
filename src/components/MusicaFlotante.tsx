import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";
import { alternarMusica, permitirMusicaEnRuta, sincronizarMusica, useMusica } from "@/lib/musicaFondo";

// Paneles de uso interno: ahí la música se pausa y no se muestra el botón.
const RUTAS_INTERNAS = ["/admin", "/caja", "/panel-reservas", "/staff-login"];

/**
 * Montado una sola vez en el layout raíz (no se destruye al navegar). Mantiene la música sincronizada con la
 * pestaña/ruta y muestra un parlante flotante para silenciarla desde cualquier página.
 */
export function MusicaFlotante() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { sonando, heroVisible } = useMusica();
  const rutaInterna = RUTAS_INTERNAS.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  useEffect(() => {
    permitirMusicaEnRuta(!rutaInterna);
  }, [rutaInterna]);

  useEffect(() => {
    document.addEventListener("visibilitychange", sincronizarMusica);
    window.addEventListener("pageshow", sincronizarMusica);
    window.addEventListener("focus", sincronizarMusica);
    const vigilante = window.setInterval(sincronizarMusica, 500);
    return () => {
      document.removeEventListener("visibilitychange", sincronizarMusica);
      window.removeEventListener("pageshow", sincronizarMusica);
      window.removeEventListener("focus", sincronizarMusica);
      window.clearInterval(vigilante);
    };
  }, []);

  // En la página principal, mientras se ve el hero, el parlante ya está en el propio hero.
  if (!sonando || heroVisible || rutaInterna) return null;

  return (
    <button
      type="button"
      onClick={() => alternarMusica()}
      aria-label="Silenciar la música"
      className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-piedra/30 bg-ink/85 text-piedra shadow-lg backdrop-blur-sm transition-colors hover:bg-ink"
    >
      <Volume2 size={20} />
    </button>
  );
}
