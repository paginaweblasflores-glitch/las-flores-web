import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "src/routes/index.tsx"), "utf8");
const carouselStart = source.indexOf("function LugaresCarousel()");
const carouselEnd = source.indexOf("// ─── PÁGINA PRINCIPAL", carouselStart);
const carousel = source.slice(carouselStart, carouselEnd);

describe("carrusel de lugares para visitar", () => {
  it("muestra dos tarjetas abiertas en escritorio y una en móvil", () => {
    expect(carousel).toContain("[container-type:inline-size]");
    expect(carousel).toContain("w-[100cqw]");
    expect(carousel).toContain("md:w-[calc(50cqw-0.625rem)]");
  });

  it("se desplaza continuamente sin intervalos ni pausas por interacción", () => {
    expect(carousel).toContain("window.requestAnimationFrame(animate)");
    expect(carousel).toContain("viewport.scrollLeft");
    expect(carousel).not.toContain("window.setInterval");
    expect(carousel).not.toContain("setIsPaused");
  });

  it("se detiene mientras el cursor está encima de las imágenes y reanuda al salir", () => {
    expect(carousel).toContain("onMouseEnter={() => (isHovered.current = true)}");
    expect(carousel).toContain("onMouseLeave={() => (isHovered.current = false)}");
    expect(carousel).toContain("if (!isHovered.current && elapsed > 0)");
  });

  it("duplica la secuencia y reinicia el desplazamiento al terminar el ciclo", () => {
    expect(carousel).toContain("[...lugares, ...lugares]");
    expect(carousel).toContain("track.scrollWidth / 2");
    expect(carousel).toContain("% cycleWidth");
  });

  it("mantiene navegables los enlaces de Descubrir en las tarjetas duplicadas", () => {
    expect(carousel).toContain('to="/destinos/$slug"');
    expect(carousel).toContain("params={{ slug: lugar.slug }}");
    expect(carousel).toContain("Descubrir <ArrowRight size={14} />");
    expect(carousel).not.toContain("aria-hidden={isClone}");
    expect(carousel).not.toContain("inert={isClone}");
  });

  it("permite recorrer los destinos con controles accesibles", () => {
    expect(carousel).toContain('aria-label="Destino anterior"');
    expect(carousel).toContain('aria-label="Siguiente destino"');
  });
});
