/**
 * Mapa referencial de cada destino de "Lugares para Visitar": el mismo mapa de Ayacucho de todas las
 * páginas, con un punto, una línea guía y el nombre en serif (mismo estilo y tamaño siempre).
 * La ubicación es aproximada: lo importante es ver hacia dónde queda respecto a Huamanga.
 */

const ANCHO = 1000;
const ALTO = 860;

const TINTA = "#4A2E1F";
const SUAVE = "#8A7260";
const ORO = "#B9873A";
const PAPEL = "#F1E9DA";

const FUENTE_TITULO = "'Playfair Display', Georgia, serif";
const FUENTE_TEXTO = "Spectral, Georgia, serif";

// Mapa de Ayacucho (900 × 1288 px de origen), colocado a la derecha para dejar sitio a la etiqueta
const MAPA = { x: 400, y: 20, w: 580, h: 830 };

// Calibración aproximada del mapa: Huamanga y escala en píxeles del mapa original por km
const HUAMANGA = { lat: -13.1628, lng: -74.2179, ox: 437, oy: 453 };
const KM_POR_GRADO_LNG = 108.4;
const KM_POR_GRADO_LAT = 110.6;
const PX_POR_KM_X = 4.0;
const PX_POR_KM_Y = 4.6;
// Recorte aplicado al mapa original (1055 × 1491) para obtener la imagen base
const RECORTE = { x: 18, y: 9, w: 1035, h: 1481 };

function enMapa(lat: number, lng: number) {
  const ox = HUAMANGA.ox + (lng - HUAMANGA.lng) * KM_POR_GRADO_LNG * PX_POR_KM_X;
  const oy = HUAMANGA.oy + (HUAMANGA.lat - lat) * KM_POR_GRADO_LAT * PX_POR_KM_Y;
  return {
    x: MAPA.x + ((ox - RECORTE.x) / RECORTE.w) * MAPA.w,
    y: MAPA.y + ((oy - RECORTE.y) / RECORTE.h) * MAPA.h,
  };
}

/** Parte un nombre largo en dos líneas por el espacio más cercano a la mitad. */
function enLineas(nombre: string, maximo = 19) {
  if (nombre.length <= maximo) return [nombre];
  const medio = nombre.length / 2;
  let corte = -1;
  nombre.split("").forEach((c, i) => {
    if (c === " " && (corte === -1 || Math.abs(i - medio) < Math.abs(corte - medio))) corte = i;
  });
  return corte === -1 ? [nombre] : [nombre.slice(0, corte), nombre.slice(corte + 1)];
}

interface MapaDestinoProps {
  nombre: string;
  detalle: string;
  lat: number;
  lng: number;
}

export function MapaDestino({ nombre, detalle, lat, lng }: MapaDestinoProps) {
  const huamanga = enMapa(HUAMANGA.lat, HUAMANGA.lng);
  const destino = enMapa(lat, lng);
  const esHuamanga = Math.hypot(destino.x - huamanga.x, destino.y - huamanga.y) < 14;

  const lineas = enLineas(nombre);
  const yEtiqueta = Math.min(Math.max(destino.y, 140), ALTO - 150);
  const arranque = yEtiqueta - ((lineas.length - 1) * 38) / 2;
  const xEtiqueta = 350;

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className="block w-full max-w-[680px] h-auto"
      role="img"
      aria-labelledby="mapa-destino-titulo"
    >
      <title id="mapa-destino-titulo">
        Mapa referencial de Ayacucho con la ubicación aproximada de {nombre}
      </title>

      <image
        href="/imagenes-reales/mapas/ayacucho-base.webp"
        x={MAPA.x}
        y={MAPA.y}
        width={MAPA.w}
        height={MAPA.h}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Huamanga como referencia */}
      {!esHuamanga && (
        <g>
          <line
            x1={huamanga.x}
            y1={huamanga.y}
            x2={destino.x}
            y2={destino.y}
            stroke={TINTA}
            strokeWidth={1.1}
            strokeDasharray="2 6"
            strokeLinecap="round"
            opacity={0.65}
          />
          <circle
            cx={huamanga.x}
            cy={huamanga.y}
            r={5.5}
            fill={PAPEL}
            stroke={TINTA}
            strokeWidth={1.4}
          />
          <text
            x={huamanga.x + 14}
            y={huamanga.y - 8}
            fontFamily={FUENTE_TEXTO}
            fontSize={15}
            letterSpacing={2.4}
            fill={SUAVE}
            stroke={PAPEL}
            strokeWidth={5}
            paintOrder="stroke"
          >
            HUAMANGA
          </text>
        </g>
      )}

      {/* Línea guía, punto y nombre del destino */}
      <line
        x1={xEtiqueta + 14}
        y1={yEtiqueta - 8}
        x2={destino.x - 9}
        y2={destino.y}
        stroke={TINTA}
        strokeWidth={1}
      />
      <circle
        cx={destino.x}
        cy={destino.y}
        r={19}
        fill="none"
        stroke={ORO}
        strokeWidth={1.6}
        className="mapa-pulso"
      />
      <circle cx={destino.x} cy={destino.y} r={12} fill={PAPEL} stroke={ORO} strokeWidth={1.9} />
      <circle cx={destino.x} cy={destino.y} r={6} fill={ORO} />

      {lineas.map((linea, i) => (
        <text
          key={linea}
          x={xEtiqueta}
          y={arranque + i * 38}
          textAnchor="end"
          fontFamily={FUENTE_TITULO}
          fontSize={36}
          fill={TINTA}
        >
          {linea}
        </text>
      ))}
      <text
        x={xEtiqueta}
        y={arranque + (lineas.length - 1) * 38 + 30}
        textAnchor="end"
        fontFamily={FUENTE_TEXTO}
        fontSize={15}
        letterSpacing={2.6}
        fill={SUAVE}
      >
        {detalle.toUpperCase()}
      </text>
    </svg>
  );
}
