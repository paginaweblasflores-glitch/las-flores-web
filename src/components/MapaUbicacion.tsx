/**
 * Mapa referencial de ubicación del restaurante: el mapa de Ayacucho con sus provincias de fondo y, al centro, el
 * restaurante con la Plaza Mayor y el aeropuerto a su alrededor. No está a escala: solo da una idea
 * de lo cerca que está todo (Plaza Mayor a 7 min, aeropuerto a 6 min, en auto).
 */

const ANCHO = 1000;
const ALTO = 680;

const FONDO = "#F1E9DA";
const TINTA = "#4A2E1F";
const SUAVE = "#8A7260";
const ORO = "#B9873A";

const FUENTE_TITULO = "'Playfair Display', Georgia, serif";
const FUENTE_TEXTO = "Spectral, Georgia, serif";

// Contorno de Ayacucho (900 × 1288 px de origen), completo y centrado
const MAPA = { x: 285, y: 14, w: 433, h: 620 };
const HUAMANGA_EN_MAPA = { x: 0.404, y: 0.3 }; // fracción del ancho y del alto del contorno
const CENTRO = { x: MAPA.x + HUAMANGA_EN_MAPA.x * MAPA.w, y: MAPA.y + HUAMANGA_EN_MAPA.y * MAPA.h };

// Posiciones referenciales alrededor del restaurante (separadas para que no se amontonen)
const PLAZA = { x: CENTRO.x - 206, y: CENTRO.y + 40 };
const AEROPUERTO = { x: CENTRO.x + 214, y: CENTRO.y + 104 };

const LUGARES_LISTA = [
  ["Restaurante Las Flores", "Jr. José Olaya 106, Huamanga"],
  ["Plaza Mayor de Huamanga", "A 7 min (1 km) aprox."],
  ["Aeropuerto Alfredo Mendívil Duarte", "A 6 min (1 km)"],
];

function Punto({ x, y, grande = false }: { x: number; y: number; grande?: boolean }) {
  return (
    <g>
      {grande && (
        <circle
          cx={x}
          cy={y}
          r={20}
          fill="none"
          stroke={ORO}
          strokeWidth={1.7}
          className="mapa-pulso"
        />
      )}
      {grande && <circle cx={x} cy={y} r={13} fill={FONDO} stroke={ORO} strokeWidth={2} />}
      <circle cx={x} cy={y} r={grande ? 6.5 : 5.5} fill={grande ? ORO : TINTA} />
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
        fontSize={principal ? 40 : 34}
        fontWeight={principal ? 600 : 400}
        fill={principal ? ORO : TINTA}
        {...halo}
      >
        {nombre}
      </text>
      <text
        x={x}
        y={y + 27}
        textAnchor={ancla}
        fontFamily={FUENTE_TEXTO}
        fontSize={15}
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
          fontSize={15}
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
          Huamanga a 7 minutos y el aeropuerto a 6 minutos
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

        <Punto x={PLAZA.x} y={PLAZA.y} />
        <Punto x={AEROPUERTO.x} y={AEROPUERTO.y} />
        <Punto x={CENTRO.x} y={CENTRO.y} grande />

        <Etiqueta
          x={PLAZA.x - 18}
          y={PLAZA.y - 6}
          ancla="end"
          nombre="Plaza Mayor"
          detalle="DE HUAMANGA"
          detalle2="A 7 MIN · 1 KM APROX."
        />
        <Etiqueta
          x={AEROPUERTO.x + 18}
          y={AEROPUERTO.y + 2}
          ancla="start"
          nombre="Aeropuerto"
          detalle="ALFREDO MENDÍVIL"
          detalle2="A 6 MIN · 1 KM"
        />
        <Etiqueta
          x={CENTRO.x}
          y={CENTRO.y - 64}
          ancla="middle"
          nombre="Restaurante Las Flores"
          detalle="JR. JOSÉ OLAYA 106"
          principal
        />

        <text
          x={ANCHO / 2}
          y={ALTO - 16}
          textAnchor="middle"
          fontFamily={FUENTE_TEXTO}
          fontSize={13}
          letterSpacing={2.4}
          fill={SUAVE}
        >
          MAPA REFERENCIAL · TIEMPOS APROXIMADOS EN AUTO
        </text>
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
