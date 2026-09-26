// Silueta del departamento de Ayacucho, trazada a partir de un mapa de referencia
// (IGN Perú) y simplificada para un uso puramente decorativo/ilustrativo.
const OUTLINE_PATH =
  "M 237.2 755.3 L 227.7 752.1 L 238.3 722.3 L 233.0 706.4 L 209.6 725.5 L 181.9 723.4 L 178.7 696.8 L 157.4 684.0 L 156.4 655.3 L 83.0 643.6 L 106.4 613.8 L 100.0 588.3 L 83.0 584.0 L 87.2 560.6 L 73.4 566.0 L 66.0 558.5 L 61.7 545.7 L 72.3 537.2 L 54.3 521.3 L 18.1 538.3 L 8.5 513.8 L 14.9 496.8 L 0.0 490.4 L 21.3 458.5 L 8.5 447.9 L 24.5 414.9 L 80.9 416.0 L 78.7 311.7 L 51.1 284.0 L 51.1 269.1 L 62.8 257.4 L 103.2 257.4 L 97.9 243.6 L 124.5 221.3 L 160.6 217.0 L 164.9 187.2 L 187.2 194.7 L 174.5 167.0 L 174.5 147.9 L 185.1 137.2 L 170.2 122.3 L 174.5 98.9 L 159.6 67.0 L 137.2 63.8 L 119.1 37.2 L 143.6 23.4 L 158.5 27.7 L 171.3 0.0 L 216.0 34.0 L 255.3 20.2 L 280.9 79.8 L 331.9 130.9 L 359.6 169.1 L 353.2 181.9 L 363.8 184.0 L 391.5 247.9 L 421.3 273.4 L 416.0 287.2 L 360.6 278.7 L 307.4 242.6 L 301.1 221.3 L 287.2 239.4 L 283.0 269.1 L 293.6 320.2 L 321.3 341.5 L 306.4 354.3 L 355.3 452.1 L 342.6 496.8 L 357.4 518.1 L 357.4 541.5 L 342.6 552.1 L 344.7 569.1 L 362.8 580.9 L 386.2 546.8 L 405.3 557.4 L 454.3 542.6 L 456.4 534.0 L 500.0 560.6 L 466.0 579.8 L 461.7 596.8 L 472.3 613.8 L 463.8 643.6 L 428.7 685.1 L 406.4 684.0 L 405.3 704.3 L 367.0 697.9 L 316.0 714.9 L 288.3 689.4 L 277.7 691.5 L 278.7 711.7 L 237.2 755.3 Z";

const VIEWBOX_W = 500;
const VIEWBOX_H = 755.3;

// Extremos geográficos aproximados usados para ubicar el punto (uso ilustrativo, no de navegación).
const LNG_MIN = -75.58;
const LNG_MAX = -73.35;
const LAT_TOP = -12.65;
const LAT_BOTTOM = -15.42;

function proyectar(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * VIEWBOX_W;
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * VIEWBOX_H;
  return { x, y };
}

interface AyacuchoMiniMapProps {
  lat: number;
  lng: number;
  nombre: string;
}

export function AyacuchoMiniMap({ lat, lng, nombre }: AyacuchoMiniMapProps) {
  const { x, y } = proyectar(lat, lng);
  const labelX = x + 22;
  const labelY = y + 8;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      className="w-full h-full max-h-[520px]"
      role="img"
      aria-label={`Ubicación de ${nombre} en el departamento de Ayacucho`}
    >
      <path d={OUTLINE_PATH} fill="#E4DCC8" stroke="#5A3D2B" strokeWidth={2.5} strokeLinejoin="round" />

      <line x1={x} y1={y} x2={labelX} y2={labelY} stroke="#5A3D2B" strokeWidth={1.5} />
      <circle cx={x} cy={y} r={7} fill="#A32638" stroke="#F1E9DA" strokeWidth={2} />

      <text
        x={labelX + 6}
        y={labelY}
        fontFamily="'Playfair Display', serif"
        fontStyle="italic"
        fontSize={22}
        fill="#5A3D2B"
      >
        {nombre}
      </text>
      <text
        x={labelX + 6}
        y={labelY + 20}
        fontFamily="sans-serif"
        fontSize={11}
        letterSpacing={2}
        fill="#5A3D2B"
        opacity={0.7}
      >
        AYACUCHO, PERÚ
      </text>
    </svg>
  );
}
