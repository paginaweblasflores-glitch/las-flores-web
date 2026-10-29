import { useEffect, useRef, useState } from "react";

interface EspecieFauna {
  nombre: string;
  imagen: string;
  descripcion: string;
}

const ESPECIES: EspecieFauna[] = [
  {
    nombre: "Colibrí",
    imagen: "/imagenes-reales/fauna/colibri.webp",
    descripcion:
      "Presente en los valles y campiñas de la región, el colibrí es una diminuta y fascinante ave, fundamental como polinizador natural para la preservación de la variada flora andina. Observar su ágil y veloz vuelo estacionario entre las flores silvestres brinda una excelente oportunidad para conectar con la delicada belleza de la naturaleza local.",
  },
  {
    nombre: "Cernícalo",
    imagen: "/imagenes-reales/fauna/cernicalo.webp",
    descripcion:
      "Presente en los cielos y valles de la región, el cernícalo es una pequeña y veloz ave rapaz andina, fundamental para el equilibrio ecológico por su rol en el control natural de plagas agrícolas.",
  },
  {
    nombre: "Cóndor Andino",
    imagen: "/imagenes-reales/fauna/condor.webp",
    descripcion:
      "Presente en las alturas de Lucanas (destacando el Valle de Sondondo) y Sucre, el cóndor andino es un ave sagrada mensajera de los Apus y vital para el ecosistema. Visitar estos miradores naturales ofrece una inigualable oportunidad para admirar el majestuoso vuelo de este símbolo milenario en su hábitat.",
  },
  {
    nombre: "Halcón Peregrino",
    imagen: "/imagenes-reales/fauna/halcon.webp",
    descripcion:
      "Presente en los altos riscos y cañones de la región, el halcón peregrino es una imponente ave rapaz y el animal más veloz del planeta, crucial como depredador tope para el equilibrio del ecosistema andino. Avistar su espectacular vuelo en picada durante sus cacerías brinda una excelente oportunidad para maravillarse con la imponente vida silvestre local.",
  },
  {
    nombre: "Vicuña",
    imagen: "/imagenes-reales/fauna/vicuna.webp",
    descripcion:
      "Presente en las planicies altoandinas, especialmente en la Reserva Nacional Pampa Galeras, la vicuña es un grácil camélido silvestre, símbolo patrio y poseedor de la fibra más fina del mundo. Recorrer esta reserva protegida brinda una excelente oportunidad para admirar a esta invaluable especie en total libertad.",
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
    <div ref={raiz} className="relative md:h-[750px]">
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
        className="md:absolute md:bottom-0 md:left-4 md:w-full md:max-w-[22rem] min-h-[400px] md:min-h-0 md:h-[450px] bg-eucalipto text-piedra px-8 py-10 md:px-5 md:py-10 flex flex-col justify-between"
      >
        <div key={especie.nombre} className={visto ? "fauna-texto" : "opacity-0"}>
          <h3 className="font-serif text-3xl md:text-4xl mb-5">{especie.nombre}</h3>
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
