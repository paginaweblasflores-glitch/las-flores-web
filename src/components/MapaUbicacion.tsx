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
const HUAMANGA_EN_MAPA = { x: 0.404, y: 0.3 }; // fracción del ancho y del alto del contorno
const CENTRO = { x: MAPA.x + HUAMANGA_EN_MAPA.x * MAPA.w, y: MAPA.y + HUAMANGA_EN_MAPA.y * MAPA.h };

// Posiciones referenciales alrededor del restaurante (separadas para que no se amontonen)
const PLAZA = { x: CENTRO.x - 206, y: CENTRO.y + 88 };
const AEROPUERTO = { x: CENTRO.x - 206, y: CENTRO.y - 40 };

// Calibración del mapa (misma que la de cada destino): Huamanga y escala en unidades del dibujo por grado
const HUAMANGA = { lat: -13.1628, lng: -74.2179 };
const UNIDADES_POR_GRADO_LNG = 181.4;
const UNIDADES_POR_GRADO_LAT = 213;

function enMapa(lat: number, lng: number) {
  return {
    x: CENTRO.x + (lng - HUAMANGA.lng) * UNIDADES_POR_GRADO_LNG,
    y: CENTRO.y + (HUAMANGA.lat - lat) * UNIDADES_POR_GRADO_LAT,
  };
}

/**
 * Lugares para visitar sobre el mapa. `lado` y `y` fijan dónde va el nombre (columna derecha o izquierda, línea de
 * base del nombre); `lineas` parte los nombres largos. La Basílica Catedral queda en la Plaza Mayor de Huamanga.
 */
const DESTINOS = [
  { slug: "pampa-de-quinua", lado: "der", y: 184 },
  { slug: "abismo-puncupata", lado: "der", y: 274 },
  { slug: "vilcas-huaman", lado: "der", y: 364 },
  { slug: "millpu", lado: "der", y: 454, lineas: ["Aguas Turquesas", "de Millpu"] },
  { slug: "ritipata", lado: "izq", y: 403 },
] as const;

const LUGARES_VISITA = DESTINOS.flatMap((d) => {
  const lugar = lugares.find((l) => l.slug === d.slug);
  if (!lugar || lugar.mapLat === undefined || lugar.mapLng === undefined) return [];
  const lineas: readonly string[] = "lineas" in d ? d.lineas : [lugar.nombre];
  return [{ ...d, lineas, detalle: lugar.categoria, punto: enMapa(lugar.mapLat, lugar.mapLng) }];
});

const LUGARES_LISTA = [
  ["Restaurante Las Flores", "Jr. José Olaya 106, Huamanga"],
  ["Plaza Mayor de Huamanga", "A 7 min"],
  ["Aeropuerto Alfredo Mendívil Duarte", "A 6 min"],
  ...LUGARES_VISITA.map((l) => [l.lineas.join(" "), l.detalle]),
];

// Columnas de nombres a los lados del mapa
const X_DERECHA = 730;
const X_IZQUIERDA = 236;
const TAMANO_NOMBRE = 24;
const TAMANO_DETALLE = 13;

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
  detalle: string;
  detalle2?: string;
  ancla: "start" | "middle" | "end";
  principal?: boolean;
}) {
  const halo = { stroke: FONDO, strokeWidth: 8, paintOrder: "stroke" as const };
  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor={ancla}
        fontFamily={FUENTE_TITULO}
        fontSize={principal ? 36 : 30}
        fontWeight={principal ? 600 : 400}
        fill={principal ? ROJO : ORO}
        {...halo}
      >
        {nombre}
      </text>
      <text
        x={x}
        y={y + 27}
        textAnchor={ancla}
        fontFamily={FUENTE_TEXTO}
        fontSize={14}
        letterSpacing={2.6}
        fill={SUAVE}
        {...{ ...halo, strokeWidth: 6 }}
      >
        {detalle}
      </text>
      {detalle2 && (
        <text
          x={x}
          y={y + 49}
          textAnchor={ancla}
          fontFamily={FUENTE_TEXTO}
          fontSize={14}
          letterSpacing={2.6}
          fill={SUAVE}
          {...{ ...halo, strokeWidth: 6 }}
        >
          {detalle2}
        </text>
      )}
    </g>
  );
}

export function MapaUbicacion() {
  return (
    <div style={{ backgroundColor: FONDO }}>
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="block w-full h-auto"
        role="img"
        aria-labelledby="mapa-ubicacion-titulo"
      >
        <title id="mapa-ubicacion-titulo">
          Mapa referencial de Ayacucho con el Restaurante Las Flores al centro, la Plaza Mayor de
          Huamanga a 7 minutos, el aeropuerto a 6 minutos y la ubicación aproximada de los lugares
          para visitar: Pampa de Ayacucho, Abismo de Puncupata, Vilcas Huamán, Aguas Turquesas de
          Millpu y Nevado Ritipata
        </title>

        <rect width={ANCHO} height={ALTO} fill={FONDO} />
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
                letterSpacing={2.4}
                fill={SUAVE}
                {...{ ...halo, strokeWidth: 5 }}
              >
                {l.detalle.toUpperCase()}
              </text>
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
          y={CENTRO.y - 64}
          ancla="middle"
          nombre="Restaurante Las Flores"
          detalle="JR. JOSÉ OLAYA 106"
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
            <span className="block text-sm" style={{ color: ORO }}>
              {detalle}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
