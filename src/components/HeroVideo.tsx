import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  alternarMusica,
  getAudioMusica,
  iniciarMusicaDesdeHero,
  marcarHeroVisible,
  useMusica,
} from "@/lib/musicaFondo";

interface HeroVideoProps {
  srcDesktop: string;
  srcMobile: string;
  poster: string;
  alt: string;
  className?: string;
}

function evitarVideo(): boolean {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(reduceMotion || conn?.saveData);
}

// Diferencia entre dos tiempos de un video en bucle (al dar la vuelta, 0.1 s y 26.0 s están casi a la par).
function diferenciaCircular(a: number, b: number, duracion: number): number {
  const d = Math.abs(a - b);
  return duracion > 0 ? Math.min(d, duracion - d) : d;
}

/**
 * Hero con música (ver `lib/musicaFondo`).
 * - El video va siempre silenciado y solo corre mientras se ve (no gasta CPU/batería fuera de pantalla).
 * - El sonido es una pista de audio aparte, global: sigue sonando al bajar del hero y también al navegar a otras
 *   páginas, hasta que el visitante la silencie. Al volver al hero, el video se alinea con el audio.
 * - Se intenta sonar de inmediato al cargar. Si el navegador lo bloquea (sin interacción previa del visitante),
 *   queda silenciado y el parlante lo activa, igual que en otros sitios con video de portada.
 */
export function HeroVideo({ srcDesktop, srcMobile, poster, alt, className = "" }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sinVideo, setSinVideo] = useState(false);
  const { sonando } = useMusica();

  useEffect(() => {
    if (evitarVideo()) {
      setSinVideo(true);
      return;
    }
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.playsInline = true;

    // Versión liviana (720p) en pantallas pequeñas; 1080p en el resto.
    el.src = window.matchMedia("(max-width: 767px)").matches ? srcMobile : srcDesktop;
    el.load();

    let activo = true;
    let visibleAntes: boolean | null = null;
    const aLaVista = () => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const sincronizar = () => {
      if (!activo || document.visibilityState === "hidden") return;

      const visible = aLaVista();
      if (visible !== visibleAntes) {
        visibleAntes = visible;
        marcarHeroVisible(visible);
      }

      if (visible) {
        // Solo se salta cuando hay desfase real (>0.35 s); saltar a cada pausa provocaba un ciclo infinito de pausa/salto.
        const audio = getAudioMusica();
        const desfasado =
          !!audio &&
          !audio.paused &&
          el.readyState >= 2 &&
          diferenciaCircular(el.currentTime, audio.currentTime, el.duration) > 0.35;
        if (el.paused) {
          // Al volver (de otra sección o de otra página) el video se alinea con el audio, que nunca se detuvo.
          if (desfasado && audio) el.currentTime = audio.currentTime;
          el.play().catch(() => {});
        } else if (desfasado && audio && !el.seeking) {
          el.currentTime = audio.currentTime;
        }
      } else if (!el.paused) {
        el.pause();
      }
    };

    // Intenta sonar de inmediato (funciona si el navegador ya lo permite); si lo bloquea, queda en silencio.
    iniciarMusicaDesdeHero(el.currentTime);
    sincronizar();

    const eventosMedia = ["loadeddata", "canplay", "pause", "stalled", "suspend"] as const;
    eventosMedia.forEach((ev) => el.addEventListener(ev, sincronizar));
    document.addEventListener("visibilitychange", sincronizar);
    window.addEventListener("pageshow", sincronizar);
    window.addEventListener("focus", sincronizar);
    window.addEventListener("scroll", sincronizar, { passive: true });
    window.addEventListener("resize", sincronizar);
    const vigilante = window.setInterval(sincronizar, 250);

    return () => {
      activo = false;
      window.clearInterval(vigilante);
      eventosMedia.forEach((ev) => el.removeEventListener(ev, sincronizar));
      document.removeEventListener("visibilitychange", sincronizar);
      window.removeEventListener("pageshow", sincronizar);
      window.removeEventListener("focus", sincronizar);
      window.removeEventListener("scroll", sincronizar);
      window.removeEventListener("resize", sincronizar);
      // El audio NO se detiene: sigue sonando en otras páginas. Solo se avisa que el hero ya no está.
      marcarHeroVisible(false);
    };
  }, [srcDesktop, srcMobile]);

  if (sinVideo) {
    return <img src={poster} alt={alt} decoding="async" className={className} />;
  }

  return (
    <>
      <video ref={videoRef} poster={poster} muted loop playsInline preload="auto" aria-label={alt} className={className} />
      <button
        type="button"
        onClick={() => alternarMusica(videoRef.current?.currentTime)}
        aria-label={sonando ? "Silenciar la música" : "Activar el sonido del video"}
        aria-pressed={sonando}
        className="absolute bottom-8 right-6 md:bottom-10 md:right-16 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-piedra/60 bg-black/30 text-piedra backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        {sonando ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
