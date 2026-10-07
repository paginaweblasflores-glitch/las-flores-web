import { useSyncExternalStore } from "react";

/**
 * Música de fondo del sitio. El audio vive en este módulo (no dentro de una página), así que sigue sonando
 * al navegar entre páginas hasta que el visitante la silencie. Se intenta iniciar desde el hero de la
 * página principal; en cada visita nueva vuelve a empezar activada.
 */

const SRC_AUDIO = "/videos/hero/inicio-hero-audio.m4a";

interface Estado {
  sonando: boolean;
  heroVisible: boolean;
}

const ESTADO_SERVIDOR: Estado = { sonando: false, heroVisible: false };
let estado: Estado = ESTADO_SERVIDOR;
const oyentes = new Set<() => void>();

let audio: HTMLAudioElement | null = null;
// Intención: la música debe sonar (aunque esté en pausa temporal por pestaña oculta o ruta interna).
let deseada = false;
// El navegador rechazó reproducir (sin interacción previa del visitante): espera a que use el parlante.
let bloqueada = false;
// El visitante la silenció en esta visita: no se reactiva sola al volver al inicio. Se reinicia al recargar/visita nueva.
let silenciadaEnEstaVisita = false;
// Paneles internos (admin, caja…): la música se pausa ahí.
let rutaPermitida = true;

function actualizar(parcial: Partial<Estado>) {
  const nuevo = { ...estado, ...parcial };
  if (nuevo.sonando === estado.sonando && nuevo.heroVisible === estado.heroVisible) return;
  estado = nuevo;
  oyentes.forEach((f) => f());
}

function obtenerAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio();
    audio.src = SRC_AUDIO;
    audio.loop = true;
    audio.preload = "none";
    audio.addEventListener("playing", () => actualizar({ sonando: true }));
    audio.addEventListener("pause", () => actualizar({ sonando: false }));
  }
  return audio;
}

function reproducir(desdeSegundos?: number) {
  const a = obtenerAudio();
  if (!a || !a.paused) return;
  if (a.preload !== "auto") {
    a.preload = "auto";
    a.load();
  }
  if (desdeSegundos !== undefined && Math.abs(a.currentTime - desdeSegundos) > 0.5) {
    a.currentTime = desdeSegundos;
  }
  a.play().then(
    () => {
      bloqueada = false;
    },
    () => {
      bloqueada = true;
    },
  );
}

export function useMusica(): Estado {
  return useSyncExternalStore(
    (cb) => {
      oyentes.add(cb);
      return () => {
        oyentes.delete(cb);
      };
    },
    () => estado,
    () => ESTADO_SERVIDOR,
  );
}

/** Audio actual (null si aún no se creó). El hero lo usa para alinear su video con el sonido. */
export function getAudioMusica(): HTMLAudioElement | null {
  return audio;
}

/** Lo llama el hero al montarse: intenta sonar de inmediato, salvo que el visitante la haya silenciado. */
export function iniciarMusicaDesdeHero(tiempoVideo: number) {
  if (silenciadaEnEstaVisita) return;
  deseada = true;
  // Se crea el audio siempre, para que el vigilante pueda iniciarlo cuando la pestaña pase a estar visible.
  obtenerAudio();
  if (rutaPermitida && document.visibilityState !== "hidden") reproducir(tiempoVideo);
}

/** Parlante: si suena la silencia; si no, la activa. */
export function alternarMusica(tiempoVideo?: number) {
  const a = obtenerAudio();
  if (!a) return;
  if (!a.paused) {
    deseada = false;
    silenciadaEnEstaVisita = true;
    a.pause();
    return;
  }
  deseada = true;
  silenciadaEnEstaVisita = false;
  bloqueada = false;
  reproducir(tiempoVideo);
}

export function marcarHeroVisible(visible: boolean) {
  actualizar({ heroVisible: visible });
}

export function permitirMusicaEnRuta(permitida: boolean) {
  rutaPermitida = permitida;
  sincronizarMusica();
}

/** Pausa temporal con la pestaña oculta o en rutas internas; la retoma al volver. Se llama desde un vigilante global. */
export function sincronizarMusica() {
  const a = audio;
  if (!a) return;
  const visible = document.visibilityState !== "hidden";
  if (!rutaPermitida || !visible) {
    if (!a.paused) a.pause();
    return;
  }
  if (deseada && a.paused && !bloqueada) reproducir();
}
