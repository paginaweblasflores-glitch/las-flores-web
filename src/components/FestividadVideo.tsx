import { useEffect, useRef, useState } from "react";

interface FestividadVideoProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  /** Hero: el video se pide de inmediato. Si es false (tarjetas), se pide al acercarse a la sección (~1.5 pantallas). */
  priority?: boolean;
}

function evitarVideo(): boolean {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(reduceMotion || conn?.saveData);
}

export function FestividadVideo({ src, poster, alt, className = "", priority = false }: FestividadVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sinVideo, setSinVideo] = useState(false);

  useEffect(() => {
    if (evitarVideo()) {
      setSinVideo(true);
      return;
    }
    const el = videoRef.current;
    if (!el) return;

    // React no refleja `muted` como atributo; sin esto algunos navegadores bloquean el autoplay.
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.playsInline = true;

    let activo = true;

    const cargarSiFalta = () => {
      if (!el.getAttribute("src")) {
        el.preload = "auto";
        el.src = src;
        el.load();
      }
    };

    // El video está "a la vista" si su caja toca la pantalla (con un margen para que ya esté corriendo al llegar).
    // Se mide la posición directamente en cada scroll: no depende de IntersectionObserver.
    const MARGEN = 150;
    const aLaVista = () => {
      const r = el.getBoundingClientRect();
      return r.bottom > -MARGEN && r.top < window.innerHeight + MARGEN;
    };

    // Tarjetas: la descarga empieza cuando el usuario está a ~1.5 pantallas de distancia (no antes), para no
    // competir con el resto de la página ni gastar datos de quien nunca llega a esa sección.
    const cercaParaCargar = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      return r.top < h * 2.5 && r.bottom > -h * 1.5;
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

    // Vigilante: si el navegador lo pausó con la pestaña visible (ahorro de energía, etc.), lo retoma.
    const vigilante = window.setInterval(sincronizar, 1000);

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
  }, [src, priority]);

  if (sinVideo) {
    return <img src={poster} alt={alt} decoding="async" className={className} />;
  }

  return (
    <video
      ref={videoRef}
      src={priority ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload={priority ? "auto" : "none"}
      aria-label={alt}
      className={className}
    />
  );
}
