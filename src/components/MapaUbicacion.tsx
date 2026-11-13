/**
 * Mapa referencial de ubicación del restaurante: el mapa de Ayacucho con sus provincias de fondo y, al centro, el
 * restaurante con la Plaza Mayor y el aeropuerto a su alrededor (Plaza Mayor a 7 min, aeropuerto a 6 min, en auto).
 * Con puntos dorados se marcan los lugares para visitar de la región, en su ubicación aproximada: lo importante es
 * ver hacia dónde queda cada uno respecto a Huamanga.
 */

import { lugares } from "@/data/lugares";

const ANCHO = 1000;
const ALTO = 680;

const FONDO = "#F1E9DA";
const TINTA = "#4A2E1F";
const SUAVE = "#8A7260";
const ORO = "#B9873A";
const ROJO = "#A32638"; // rojo cochinilla: el restaurante

const FUENTE_TITULO = "'Playfair Display', Georgia, serif";
const FUENTE_TEXTO = "Spectral, Georgia, serif";

// Contorno de Ayacucho (900 × 1288 px de origen), completo y centrado
const MAPA = { x: 285, y: 14, w: 433, h: 620 };
// Punto de la ciudad de Huamanga sobre el contorno (fracción del ancho y del alto). Es el ancla de la calibración
// geográfica: desde aquí se ubican los demás lugares según su latitud y longitud.
const HUAMANGA_EN_MAPA = { x: 0.404, y: 0.3 };
const ANCLA = { x: MAPA.x + HUAMANGA_EN_MAPA.x * MAPA.w, y: MAPA.y + HUAMANGA_EN_MAPA.y * MAPA.h };

// Marcador del restaurante: en el centro de la provincia de Huamanga (centroide de su capa de sombreado, 900 × 1288)
const CENTRO_PROVINCIA = { x: 0.394, y: 0.337 };
const CENTRO = { x: MAPA.x + CENTRO_PROVINCIA.x * MAPA.w, y: MAPA.y + CENTRO_PROVINCIA.y * MAPA.h };

// Calibración del mapa (misma que la de cada destino): Huamanga y escala en unidades del dibujo por grado
const HUAMANGA = { lat: -13.1628, lng: -74.2179 };
const UNIDADES_POR_GRADO_LNG = 181.4;
const UNIDADES_POR_GRADO_LAT = 213;

function enMapa(lat: number, lng: number) {
  return {
    x: ANCLA.x + (lng - HUAMANGA.lng) * UNIDADES_POR_GRADO_LNG,
    y: ANCLA.y + (HUAMANGA.lat - lat) * UNIDADES_POR_GRADO_LAT,
  };
}

// Los lugares muy cerca de Huamanga (como Qorihuillca) caerían debajo del punto del restaurante: se alejan lo justo
// para que se vean. La ubicación en el mapa es referencial.
const DISTANCIA_MINIMA = 38;

function separarDelRestaurante(punto: { x: number; y: number }) {
  if (Math.hypot(punto.x - CENTRO.x, punto.y - CENTRO.y) >= DISTANCIA_MINIMA) return punto;
  // Se aleja en la dirección en que queda del centro de Huamanga, a la distancia mínima del marcador
  const dx = punto.x - ANCLA.x;
  const dy = punto.y - ANCLA.y;
  const distancia = Math.hypot(dx, dy);
  if (distancia < 1) return { x: CENTRO.x - DISTANCIA_MINIMA, y: CENTRO.y };
  return { x: CENTRO.x + (dx / distancia) * DISTANCIA_MINIMA, y: CENTRO.y + (dy / distancia) * DISTANCIA_MINIMA };
}

// Columnas de nombres a los lados del mapa
const X_DERECHA = 730;
const X_IZQUIERDA = 236;
const TAMANO_NOMBRE = 21;
const TAMANO_DETALLE = 12;

/**
 * Lugares para visitar sobre el mapa. `lado` fija la columna del nombre (derecha o izquierda) y `lineas` parte los
 * nombres largos. La altura de cada bloque de texto se apila sola, con la misma separación entre todos. La Basílica
 * Catedral queda en la Plaza Mayor de Huamanga.
 */
type Destino = {
  slug: string;
  lado: "der" | "izq";
  tiempo: string;
  altitud?: string;
  lineas?: readonly string[];
};

const DESTINOS: readonly Destino[] = [
  { slug: "canones-de-qorihuillca", lado: "izq", lineas: ["Cañones de", "Qorihuillca"], tiempo: "A 40 min" },
  { slug: "pampa-de-quinua", lado: "der", tiempo: "A 45 min", altitud: "3400 m s. n. m." },
  { slug: "abismo-puncupata", lado: "der", tiempo: "A 1 hora y media", altitud: "4200 m s. n. m." },
  { slug: "vilcas-huaman", lado: "der", tiempo: "A 2 horas y media", altitud: "3490 m s. n. m." },
  {
    slug: "millpu",
    lado: "der",
    lineas: ["Aguas turquesas", "de Millpu"],
    tiempo: "A 3 horas y media",
    altitud: "3600 m s. n. m.",
  },
  { slug: "ritipata", lado: "izq", tiempo: "A 3 horas", altitud: "5000 m s. n. m." },
  {
    slug: "volcan-pachapupum",
    lado: "izq",
    lineas: ["Volcán inactivo", "de Pachapupum"],
    tiempo: "A 5 horas",
    altitud: "4022 m s. n. m.",
  },
];

const LUGARES_SIN_Y = DESTINOS.flatMap((d) => {
  const lugar = lugares.find((l) => l.slug === d.slug);
  if (!lugar || lugar.mapLat === undefined || lugar.mapLng === undefined) return [];
  const lineas: readonly string[] = d.lineas ?? [lugar.nombre];
  return [{ ...d, lineas, punto: separarDelRestaurante(enMapa(lugar.mapLat, lugar.mapLng)) }];
});

// Separación igual entre todos los bloques de texto de una misma columna. Cada bloque mide lo que ocupan su nombre
// (una o dos líneas), su tiempo y, si la tiene, su altura; la Plaza Mayor y el aeropuerto ocupan un bloque fijo.
const ESPACIO_ENTRE_TEXTOS = 31;
const ARRIBA_NOMBRE = 16; // del borde de arriba del bloque a la línea de base del nombre (tamaño 21)
const ARRIBA_REFERENCIA = 20; // lo mismo para la Plaza Mayor y el aeropuerto (tamaño 25)
const ALTO_REFERENCIA = 66;
const REFERENCIAS = ["aeropuerto", "plaza"];

function altoDestino(lineas: number, conAltitud: boolean) {
  return 39 + (lineas - 1) * (TAMANO_NOMBRE + 4) + (conAltitud ? 20 : 0);
}

function apilar(orden: readonly string[], tope: number) {
  const y: Record<string, number> = {};
  let cursor = tope;
  for (const clave of orden) {
    const destino = LUGARES_SIN_Y.find((l) => l.slug === clave);
    if (destino) {
      y[clave] = cursor + ARRIBA_NOMBRE;
      cursor += altoDestino(destino.lineas.length, Boolean(destino.altitud)) + ESPACIO_ENTRE_TEXTOS;
    } else if (REFERENCIAS.includes(clave)) {
      y[clave] = cursor + ARRIBA_REFERENCIA;
      cursor += ALTO_REFERENCIA + ESPACIO_ENTRE_TEXTOS;
    }
  }
  return y;
}

const Y_IZQUIERDA = apilar(["canones-de-qorihuillca", "aeropuerto", "plaza", "ritipata", "volcan-pachapupum"], 50);
const Y_DERECHA = apilar(["pampa-de-quinua", "abismo-puncupata", "vilcas-huaman", "millpu"], 188);

const LUGARES_VISITA = LUGARES_SIN_Y.map((l) => ({
  ...l,
  y: (l.lado === "izq" ? Y_IZQUIERDA : Y_DERECHA)[l.slug],
}));

// Puntos de referencia junto al restaurante: siguen a su texto en la columna izquierda
const AEROPUERTO = { x: CENTRO.x - 206, y: Y_IZQUIERDA.aeropuerto + 6 };
const PLAZA = { x: CENTRO.x - 206, y: Y_IZQUIERDA.plaza + 6 };

const LUGARES_LISTA = [
  ["Las Flores", ""],
  ["Plaza Mayor de Huamanga", "A 7 min"],
  ["Aeropuerto Alfredo Mendívil Duarte", "A 6 min"],
  ...LUGARES_VISITA.map((l) => [l.lineas.join(" "), l.altitud ? `${l.tiempo} · ${l.altitud}` : l.tiempo]),
];

function Punto({
  x,
  y,
  grande = false,
  referencia = false,
}: {
  x: number;
  y: number;
  grande?: boolean;
  referencia?: boolean;
}) {
  return (
    <g>
      {grande && (
        <circle
          cx={x}
          cy={y}
          r={20}
          fill="none"
          stroke={ROJO}
          strokeWidth={1.7}
          className="mapa-pulso"
        />
      )}
      {grande && <circle cx={x} cy={y} r={13} fill={FONDO} stroke={ROJO} strokeWidth={2} />}
      {referencia && <circle cx={x} cy={y} r={10} fill={FONDO} stroke={ORO} strokeWidth={2} />}
      <circle cx={x} cy={y} r={grande ? 6.5 : 5.5} fill={grande ? ROJO : referencia ? ORO : TINTA} />
    </g>
  );
}

function Etiqueta({
  x,
  y,
  nombre,
  detalle,
  detalle2,
  ancla,
  principal = false,
}: {
  x: number;
  y: number;
  nombre: string;
  detalle?: string;
  detalle2?: string;
  ancla: "start" | "middle" | "end";
  principal?: boolean;
}) {
  const halo = { stroke: FONDO, strokeWidth: 7, paintOrder: "stroke" as const };
  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor={ancla}
        fontFamily={FUENTE_TITULO}
        fontSize={principal ? 30 : 25}
        fontWeight={principal ? 600 : 400}
        fill={principal ? ROJO : ORO}
        {...halo}
      >
        {nombre}
      </text>
      {detalle && (
        <text
          x={x}
          y={y + 23}
          textAnchor={ancla}
          fontFamily={FUENTE_TEXTO}
          fontSize={12}
          letterSpacing={2.2}
          fill={SUAVE}
          {...{ ...halo, strokeWidth: 5 }}
        >
          {detalle}
        </text>
      )}
      {detalle2 && (
        <text
          x={x}
          y={y + 42}
          textAnchor={ancla}
          fontFamily={FUENTE_TEXTO}
          fontSize={12}
          letterSpacing={2.2}
          fill={SUAVE}
          {...{ ...halo, strokeWidth: 5 }}
        >
          {detalle2}
        </text>
      )}
    </g>
  );
}

export function MapaUbicacion() {
  return (
    <div>
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="block w-full h-auto"
        role="img"
        aria-labelledby="mapa-ubicacion-titulo"
      >
        <title id="mapa-ubicacion-titulo">
          Mapa referencial de Ayacucho con Las Flores al centro, la Plaza Mayor de
          Huamanga a siete minutos, el aeropuerto a seis minutos y la ubicación aproximada de los lugares
          para visitar: Cañones de Qorihuillca, Pampa de Ayacucho, Abismo de Puncupata, Vilcas Huamán,
          Aguas turquesas de Millpu, Nevado de Ritipata y Volcán inactivo de Pachapupum
        </title>

        <image
          href="/imagenes-reales/mapas/ayacucho-base.webp"
          x={MAPA.x}
          y={MAPA.y}
          width={MAPA.w}
          height={MAPA.h}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Conexiones desde el restaurante */}
        <g
          stroke={TINTA}
          strokeWidth={1.2}
          strokeDasharray="2 7"
          strokeLinecap="round"
          opacity={0.7}
        >
          <line x1={CENTRO.x} y1={CENTRO.y} x2={PLAZA.x} y2={PLAZA.y} />
          <line x1={CENTRO.x} y1={CENTRO.y} x2={AEROPUERTO.x} y2={AEROPUERTO.y} />
        </g>

        {/* Líneas guía de los lugares para visitar hacia su nombre */}
        <g stroke={TINTA} strokeWidth={0.9} opacity={0.55}>
          {LUGARES_VISITA.map((l) => {
            const derecha = l.lado === "der";
            return (
              <line
                key={l.slug}
                x1={l.punto.x}
                y1={l.punto.y}
                x2={derecha ? X_DERECHA - 8 : X_IZQUIERDA + 8}
                y2={l.y - 8}
              />
            );
          })}
        </g>

        <Punto x={PLAZA.x} y={PLAZA.y} referencia />
        <Punto x={AEROPUERTO.x} y={AEROPUERTO.y} referencia />
        {LUGARES_VISITA.map((l) => (
          <circle
            key={l.slug}
            cx={l.punto.x}
            cy={l.punto.y}
            r={5}
            fill={ORO}
            stroke={FONDO}
            strokeWidth={2.5}
          />
        ))}
        <Punto x={CENTRO.x} y={CENTRO.y} grande />

        {LUGARES_VISITA.map((l) => {
          const derecha = l.lado === "der";
          const x = derecha ? X_DERECHA : X_IZQUIERDA;
          const ancla = derecha ? "start" : "end";
          const halo = { stroke: FONDO, strokeWidth: 7, paintOrder: "stroke" as const };
          const yDetalle = l.y + (l.lineas.length - 1) * (TAMANO_NOMBRE + 4) + 19;
          return (
            <g key={l.slug}>
              {l.lineas.map((linea, i) => (
                <text
                  key={linea}
                  x={x}
                  y={l.y + i * (TAMANO_NOMBRE + 4)}
                  textAnchor={ancla}
                  fontFamily={FUENTE_TITULO}
                  fontSize={TAMANO_NOMBRE}
                  fill={TINTA}
                  {...halo}
                >
                  {linea}
                </text>
              ))}
              <text
                x={x}
                y={yDetalle}
                textAnchor={ancla}
                fontFamily={FUENTE_TEXTO}
                fontSize={TAMANO_DETALLE}
                letterSpacing={2}
                fill={SUAVE}
                {...{ ...halo, strokeWidth: 5 }}
              >
                {l.tiempo.toUpperCase()}
              </text>
              {l.altitud && (
                <text
                  x={x}
                  y={yDetalle + 20}
                  textAnchor={ancla}
                  fontFamily={FUENTE_TEXTO}
                  fontSize={TAMANO_DETALLE}
                  letterSpacing={2}
                  fill={SUAVE}
                  {...{ ...halo, strokeWidth: 5 }}
                >
                  {l.altitud.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}

        <Etiqueta
          x={PLAZA.x - 18}
          y={PLAZA.y - 6}
          ancla="end"
          nombre="Plaza Mayor"
          detalle="DE HUAMANGA"
          detalle2="A 7 MIN"
        />
        <Etiqueta
          x={AEROPUERTO.x - 18}
          y={AEROPUERTO.y - 6}
          ancla="end"
          nombre="Aeropuerto"
          detalle="ALFREDO MENDÍVIL"
          detalle2="A 6 MIN"
        />
        <Etiqueta
          x={CENTRO.x}
          y={CENTRO.y - 80}
          ancla="middle"
          nombre="Las Flores"
          principal
        />
      </svg>

      {/* En pantallas pequeñas las etiquetas del mapa quedan diminutas: se repite el tiempo en texto legible. */}
      <ul
        className="grid gap-x-6 gap-y-3 px-5 pb-6 pt-2 sm:grid-cols-2 md:sr-only"
        style={{ color: TINTA }}
      >
        {LUGARES_LISTA.map(([nombre, detalle]) => (
          <li key={nombre}>
            <span className="block font-serif text-lg leading-snug">{nombre}</span>
            {detalle && (
              <span className="block text-sm" style={{ color: ORO }}>
                {detalle}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
