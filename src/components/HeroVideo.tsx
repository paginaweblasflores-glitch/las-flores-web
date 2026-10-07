import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface HeroVideoProps {
  srcDesktop: string;
  srcMobile: string;
  srcAudio: string;
  poster: string;
  alt: string;
  className?: string;
}

// Si el visitante silencia la música, se respeta mientras navega en esta visita (al volver al inicio no se
// reactiva sola). Vive solo en memoria: en cada visita nueva a la web, la música vuelve a empezar activada.
let silenciadoEnEstaVisita = false;

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
 * Hero con música, activada por defecto.
 * - El video va siempre silenciado y solo corre mientras se ve (no gasta CPU/batería fuera de pantalla).
 * - El sonido viene de una pista de audio aparte (0.4 MB) que sigue sonando en toda la página principal,
 *   aunque bajes del hero. Al volver, el video se alinea con el audio.
 * - Los navegadores no permiten sonido hasta el primer clic/toque/tecla del visitante: se intenta sonar al
 *   cargar y, si lo bloquean, empieza en el primer gesto en cualquier parte de la página.
 * - El parlante silencia/activa (la elección se respeta solo durante la visita). Al salir de la página o ocultar la pestaña, se detiene.
 */
export function HeroVideo({ srcDesktop, srcMobile, srcAudio, poster, alt, className = "" }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Intención del visitante (por defecto, con sonido). Puede estar activada sin que suene aún (bloqueo del navegador).
  const quiereSonidoRef = useRef(true);
  const bloqueadoRef = useRef(false);
  const [sinVideo, setSinVideo] = useState(false);
  const [sonando, setSonando] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);

  // Arranca el audio alineado con el video. Si el navegador lo bloquea, queda a la espera del primer gesto.
  const iniciarAudio = () => {
    const audio = audioRef.current;
    const el = videoRef.current;
    if (!audio || !el || !audio.paused) return;
    if (audio.preload !== "auto") {
      audio.preload = "auto";
      audio.load();
    }
    if (el.readyState >= 1 && Math.abs(audio.currentTime - el.currentTime) > 0.5) {
      audio.currentTime = el.currentTime;
    }
    audio.play().then(
      () => {
        bloqueadoRef.current = false;
      },
      () => {
        bloqueadoRef.current = true;
      },
    );
  };

  useEffect(() => {
    if (evitarVideo()) {
      setSinVideo(true);
      return;
    }
    const el = videoRef.current;
    const audio = audioRef.current;
    if (!el || !audio) return;

    quiereSonidoRef.current = !silenciadoEnEstaVisita;
    if (quiereSonidoRef.current) audio.preload = "auto";

    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.playsInline = true;

    // Versión liviana (720p) en pantallas pequeñas; 1080p en el resto.
    el.src = window.matchMedia("(max-width: 767px)").matches ? srcMobile : srcDesktop;
    el.load();

    let activo = true;
    let visibleAntes = true;
    const aLaVista = () => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const sincronizar = () => {
      if (!activo) return;

      // Pestaña oculta: el audio se detiene (se retoma al volver).
      if (document.visibilityState === "hidden") {
        if (!audio.paused) audio.pause();
        return;
      }

      // Audio: si el visitante lo quiere y el navegador no lo está bloqueando, debe estar sonando.
      if (quiereSonidoRef.current && audio.paused && !bloqueadoRef.current) iniciarAudio();

      // Video: solo corre mientras se ve.
      const visible = aLaVista();
      if (visible !== visibleAntes) {
        visibleAntes = visible;
        setHeroVisible(visible);
      }
      if (visible) {
        // Solo se salta cuando hay desfase real (>0.35 s); saltar a cada pausa provocaba un ciclo infinito de pausa/salto.
        const desfasado =
          quiereSonidoRef.current &&
          !audio.paused &&
          el.readyState >= 2 &&
          diferenciaCircular(el.currentTime, audio.currentTime, el.duration) > 0.35;
        if (el.paused) {
          // Al volver con sonido activo, el video se alinea con el audio (que nunca se detuvo).
          if (desfasado) el.currentTime = audio.currentTime;
          el.play().catch(() => {});
        } else if (desfasado && !el.seeking) {
          el.currentTime = audio.currentTime;
        }
      } else if (!el.paused) {
        el.pause();
      }
    };

    // Primer gesto del visitante (clic, toque o tecla): el navegador ya permite sonido, así que arranca la música.
    const gestos = ["pointerdown", "pointerup", "touchend", "keydown"] as const;
    const alGesto = (e: Event) => {
      if (!quiereSonidoRef.current || !audio.paused) return;
      // Si el gesto es sobre el propio parlante, el botón decide.
      if ((e.target as Element | null)?.closest?.("[data-hero-sonido]")) return;
      bloqueadoRef.current = false;
      iniciarAudio();
    };
    gestos.forEach((g) => window.addEventListener(g, alGesto, { capture: true, passive: true }));

    const alSonar = () => setSonando(true);
    const alPausar = () => setSonando(false);
    audio.addEventListener("playing", alSonar);
    audio.addEventListener("pause", alPausar);

    sincronizar(); // intenta sonar de inmediato (funciona si el navegador ya lo permite)

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
      gestos.forEach((g) => window.removeEventListener(g, alGesto, { capture: true }));
      audio.removeEventListener("playing", alSonar);
      audio.removeEventListener("pause", alPausar);
      eventosMedia.forEach((ev) => el.removeEventListener(ev, sincronizar));
      document.removeEventListener("visibilitychange", sincronizar);
      window.removeEventListener("pageshow", sincronizar);
      window.removeEventListener("focus", sincronizar);
      window.removeEventListener("scroll", sincronizar);
      window.removeEventListener("resize", sincronizar);
      // Al salir de la página principal, la música se detiene.
      quiereSonidoRef.current = false;
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcDesktop, srcMobile]);

  const alternarSonido = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      quiereSonidoRef.current = false;
      silenciadoEnEstaVisita = true;
      audio.pause();
      return;
    }
    quiereSonidoRef.current = true;
    silenciadoEnEstaVisita = false;
    bloqueadoRef.current = false;
    iniciarAudio();
  };

  if (sinVideo) {
    return <img src={poster} alt={alt} decoding="async" className={className} />;
  }

  const textoBoton = sonando ? "Silenciar la música" : "Activar el sonido del video";

  return (
    <>
      <video ref={videoRef} poster={poster} muted loop playsInline preload="auto" aria-label={alt} className={className} />
      <audio ref={audioRef} src={srcAudio} loop preload="none" />

      <button
        type="button"
        data-hero-sonido
        onClick={alternarSonido}
        aria-label={textoBoton}
        aria-pressed={sonando}
        className="absolute bottom-8 right-6 md:bottom-10 md:right-16 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-piedra/60 bg-black/30 text-piedra backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        {sonando ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Mientras suena y el hero ya no se ve, este botón flotante permite silenciar desde cualquier parte de la página. */}
      {sonando && !heroVisible && (
        <button
          type="button"
          data-hero-sonido
          onClick={alternarSonido}
          aria-label="Silenciar la música"
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-piedra/30 bg-ink/85 text-piedra shadow-lg backdrop-blur-sm transition-colors hover:bg-ink"
        >
          <Volume2 size={20} />
        </button>
      )}
    </>
  );
}
