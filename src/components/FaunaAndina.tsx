import { useEffect, useRef, useState } from "react";

interface EspecieFauna {
  nombre: string;
  /** Nombre en quechua, si lo tiene; se muestra bajo el nombre. */
  quechua?: string;
  imagen: string;
  descripcion: string;
}

const ESPECIES: EspecieFauna[] = [
  {
    nombre: "Colibrí",
    quechua: "qinti",
    imagen: "/imagenes-reales/fauna/colibri.webp",
    descripcion:
      "Es tan pequeño que se oye antes de verse. En los valles y campiñas de Ayacucho se queda suspendido frente a las flores silvestres para beber su néctar y puede incluso volar hacia atrás.",
  },
  {
    nombre: "Cernícalo",
    quechua: "killinchu",
    imagen: "/imagenes-reales/fauna/cernicalo.webp",
    descripcion:
      "Es una de las rapaces más pequeñas del Perú y se queda quieto en el aire sobre los campos de cultivo. Desde allí vigila el suelo y cuida las chacras de plagas y pequeños roedores.",
  },
  {
    nombre: "Cóndor andino",
    imagen: "/imagenes-reales/fauna/condor.webp",
    descripcion:
      "Para la cosmovisión andina es el mensajero de los Apus. Con casi tres metros de punta a punta, recorre las alturas de Lucanas (sobre todo el Valle de Sondondo) y de Sucre casi sin aletear, y al alimentarse de animales muertos mantiene sano el ecosistema.",
  },
  {
    nombre: "Halcón peregrino",
    quechua: "waman",
    imagen: "/imagenes-reales/fauna/halcon.webp",
    descripcion:
      "Su caída en picada llega a los 320 kilómetros por hora y es la más veloz que se conoce en el mundo animal. Desde los altos riscos y cañones de Ayacucho caza otras aves en pleno vuelo, y así mantiene el equilibrio del ecosistema andino.",
  },
  {
    nombre: "Vicuña",
    imagen: "/imagenes-reales/fauna/vicuna.webp",
    descripcion:
      "Ayacucho es la región del Perú que más fibra de vicuña produce, y el Perú es el primer productor del mundo. Esa fibra sale de los chaccus, la esquila que se hace varias veces al año en la Reserva Nacional Pampa Galeras.",
  },
];

const INTERVALO_MS = 5000;
const TRANSICION_MS = 800;

type Direccion = "adelante" | "atras";

export function FaunaAndina() {
  const [activo, setActivo] = useState(0);
  // Imagen que está saliendo mientras entra la nueva (deslizamiento lateral).
  const [saliente, setSaliente] = useState<number | null>(null);
  const [direccion, setDireccion] = useState<Direccion>("adelante");
  // Mientras el cursor (o el foco del teclado) está sobre el panel de texto, el avance automático se detiene para poder leer.
  const [leyendo, setLeyendo] = useState(false);
  // El carrusel y la entrada del texto esperan a que la sección llegue a la pantalla (no arrancan al cargar la página).
  const [visible, setVisible] = useState(false);
  const [visto, setVisto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const limpiarSaliente = useRef<number | undefined>(undefined);
  const especie = ESPECIES[activo];

  const irA = (nuevo: number, dir: Direccion) => {
    if (nuevo === activo) return;
    window.clearTimeout(limpiarSaliente.current);
    setSaliente(activo);
    setDireccion(dir);
    setActivo(nuevo);
    limpiarSaliente.current = window.setTimeout(() => setSaliente(null), TRANSICION_MS);
  };

  useEffect(() => () => window.clearTimeout(limpiarSaliente.current), []);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setVisto(true);
      return;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        setVisible(entrada.isIntersecting);
        if (entrada.isIntersecting) setVisto(true);
      },
      { threshold: 0.4 },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (leyendo || !visible) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      irA((activo + 1) % ESPECIES.length, "adelante");
    }, INTERVALO_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo, leyendo, visible]);

  // Precarga la siguiente imagen para que el cambio sea instantáneo.
  useEffect(() => {
    const img = new Image();
    img.src = ESPECIES[(activo + 1) % ESPECIES.length].imagen;
  }, [activo]);

  const claseImagen = (i: number) => {
    if (i === saliente) return direccion === "adelante" ? "fauna-sale-izq" : "fauna-sale-der";
    if (saliente !== null) return direccion === "adelante" ? "fauna-entra-der" : "fauna-entra-izq";
    return "";
  };

  return (
    <div ref={raiz} className="relative md:h-[46.875rem]">
      <div className="relative h-96 overflow-hidden md:absolute md:inset-0 md:h-full">
        {[saliente, activo].map((i) =>
          i === null ? null : (
            <img
              key={ESPECIES[i].imagen}
              src={ESPECIES[i].imagen}
              alt={ESPECIES[i].nombre}
              decoding="async"
              style={{ animationDuration: `${TRANSICION_MS}ms` }}
              className={`absolute inset-0 w-full h-full object-cover ${claseImagen(i)}`}
            />
          ),
        )}
      </div>
      <div
        onMouseEnter={() => setLeyendo(true)}
        onMouseLeave={() => setLeyendo(false)}
        onFocus={() => setLeyendo(true)}
        onBlur={() => setLeyendo(false)}
        className="md:absolute md:bottom-0 md:left-4 md:w-full md:max-w-[22rem] min-h-[25rem] md:min-h-0 md:h-[28.125rem] bg-eucalipto text-piedra px-8 py-10 md:px-5 md:py-10 flex flex-col justify-between"
      >
        <div key={especie.nombre} className={visto ? "fauna-texto" : "opacity-0"}>
          <h3 className={`font-serif text-3xl md:text-4xl ${especie.quechua ? "mb-1" : "mb-5"}`}>
            {especie.nombre}
          </h3>
          {especie.quechua && (
            <p className="mb-5 text-sm italic text-piedra/70">{especie.quechua} en quechua</p>
          )}
          <p className="text-piedra/80 text-sm md:text-base leading-relaxed">
            {especie.descripcion}
          </p>
        </div>
        <div className="flex gap-2 mt-10">
          {ESPECIES.map((e, i) => (
            <button
              key={e.nombre}
              type="button"
              onClick={() => irA(i, i > activo ? "adelante" : "atras")}
              aria-label={`Ver ${e.nombre}`}
              className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                i === activo
                  ? "border-piedra text-piedra"
                  : "border-transparent text-piedra/40 hover:text-piedra/70"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
