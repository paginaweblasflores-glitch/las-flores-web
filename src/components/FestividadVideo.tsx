import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface FestividadVideoProps {
  src: string;
  /** Versión liviana (720p) para pantallas pequeñas; si se omite se usa `src` en todas. */
  srcMobile?: string;
  poster: string;
  alt: string;
  className?: string;
  /** Hero: el video se pide de inmediato. Si es false (tarjetas), se pide al acercarse a la sección (~1.5 pantallas). */
  priority?: boolean;
  /** El video corre en silencio; muestra un botón para que el visitante active el audio (solo uno suena a la vez). */
  conSonido?: boolean;
  /** Clases de posición del botón de sonido; por defecto, esquina inferior derecha. */
  posicionSonido?: string;
  /** Botón de sonido grande, con el mismo aspecto que el del hero del inicio (para videos que ocupan toda la sección). */
  sonidoGrande?: boolean;
}

const EVENTO_SONIDO = "festividad-video-sonido";

function evitarVideo(): boolean {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(reduceMotion || conn?.saveData);
}

export function FestividadVideo({ src, srcMobile, poster, alt, className = "", priority = false, conSonido = false, posicionSonido = "bottom-3 right-3", sonidoGrande = false }: FestividadVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sinVideo, setSinVideo] = useState(false);
  const [sonando, setSonando] = useState(false);

  // El audio se activa solo con el botón; al activar uno se silencian los demás.
  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = !sonando;
  }, [sonando]);

  useEffect(() => {
    const alActivarOtro = (e: Event) => {
      if ((e as CustomEvent).detail !== videoRef.current) setSonando(false);
    };
    window.addEventListener(EVENTO_SONIDO, alActivarOtro);
    return () => window.removeEventListener(EVENTO_SONIDO, alActivarOtro);
  }, []);

  const alternarSonido = () => {
    if (!sonando) window.dispatchEvent(new CustomEvent(EVENTO_SONIDO, { detail: videoRef.current }));
    setSonando(!sonando);
  };

  useEffect(() => {
    if (evitarVideo()) {
      setSinVideo(true);
      return;
    }
    const el = videoRef.current;
    if (!el) return;

    // React no refleja `muted` como atributo; sin esto algunos navegadores bloquean el autoplay.
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    if (!conSonido) el.muted = true;
    el.playsInline = true;

    let activo = true;

    const cargarSiFalta = () => {
      if (!el.getAttribute("src")) {
        el.preload = "auto";
        el.src = srcMobile && window.matchMedia("(max-width: 767px)").matches ? srcMobile : src;
        el.load();
      }
    };

    // El video está "a la vista" si su caja toca la pantalla (con un margen para que ya esté corriendo al llegar).
    // Se mide la posición directamente en cada scroll: no depende de IntersectionObserver.
    // Hero: sin margen, se pausa justo al salir de pantalla y reanuda apenas asoma. Tarjetas: 150 px de anticipación.
    const MARGEN = priority ? 0 : 150;
    const aLaVista = () => {
      const r = el.getBoundingClientRect();
      return (
        r.bottom > -MARGEN &&
        r.top < window.innerHeight + MARGEN &&
        r.right > -MARGEN &&
        r.left < window.innerWidth + MARGEN
      );
    };

    // Tarjetas: la descarga empieza cuando el usuario está a ~1.5 pantallas de distancia (no antes), para no
    // competir con el resto de la página ni gastar datos de quien nunca llega a esa sección.
    const cercaParaCargar = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      const w = window.innerWidth;
      return r.top < h * 2.5 && r.bottom > -h * 1.5 && r.left < w * 1.5 && r.right > -w * 0.5;
    };

    // Un solo punto decide si debe cargar, correr (a la vista y pestaña visible) o estar en pausa, y lo corrige.
    // Una vez cargado, al volver a la sección continúa donde quedó, sin recargar.
    const sincronizar = () => {
      if (!activo) return;
      if (document.visibilityState === "hidden") return;
      if (!el.getAttribute("src")) {
        if (priority || cercaParaCargar()) cargarSiFalta();
        else return;
      }
      if (aLaVista()) {
        if (el.paused) el.play().catch(() => {});
      } else if (!el.paused) {
        el.pause();
        // Al salir de pantalla vuelve en silencio.
        setSonando(false);
      }
    };

    sincronizar();

    let reintentosError = 0;
    const alError = () => {
      if (reintentosError >= 3) return;
      reintentosError += 1;
      window.setTimeout(() => {
        if (!activo) return;
        el.load();
        sincronizar();
      }, 800 * reintentosError);
    };

    const eventosMedia = ["loadeddata", "canplay", "pause", "stalled", "suspend"] as const;
    eventosMedia.forEach((ev) => el.addEventListener(ev, sincronizar));
    el.addEventListener("error", alError);
    document.addEventListener("visibilitychange", sincronizar);
    window.addEventListener("pageshow", sincronizar);
    window.addEventListener("focus", sincronizar);
    const gestos = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"] as const;
    gestos.forEach((g) => window.addEventListener(g, sincronizar, { passive: true }));
    window.addEventListener("resize", sincronizar);

    // Vigilante (cada 250 ms): garantiza pausa/reanudación aunque no llegue un evento de scroll, y retoma si el navegador lo pausó.
    const vigilante = window.setInterval(sincronizar, 250);

    return () => {
      activo = false;
      window.clearInterval(vigilante);
      eventosMedia.forEach((ev) => el.removeEventListener(ev, sincronizar));
      el.removeEventListener("error", alError);
      document.removeEventListener("visibilitychange", sincronizar);
      window.removeEventListener("pageshow", sincronizar);
      window.removeEventListener("focus", sincronizar);
      gestos.forEach((g) => window.removeEventListener(g, sincronizar));
      window.removeEventListener("resize", sincronizar);
    };
  }, [src, srcMobile, priority]);

  if (sinVideo) {
    return <img src={poster} alt={alt} decoding="async" className={className} />;
  }

  return (
    <>
      <video
        ref={videoRef}
        src={priority && !srcMobile ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload={priority ? "auto" : "none"}
        aria-label={alt}
        className={className}
      />
      {conSonido && (
        <button
          type="button"
          onClick={alternarSonido}
          aria-pressed={sonando}
          aria-label={sonando ? "Silenciar el video" : "Activar el sonido del video"}
          className={`absolute ${posicionSonido} z-10 flex items-center justify-center rounded-full text-piedra backdrop-blur-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-chilca ${
            sonidoGrande
              ? "h-11 w-11 border border-piedra/60 bg-black/30 hover:bg-black/50"
              : "h-10 w-10 bg-ink/70 hover:bg-ink/90"
          }`}
        >
          {sonando ? <Volume2 size={sonidoGrande ? 20 : 18} aria-hidden="true" /> : <VolumeX size={sonidoGrande ? 20 : 18} aria-hidden="true" />}
        </button>
      )}
    </>
  );
}
