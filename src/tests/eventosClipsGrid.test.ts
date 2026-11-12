import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "src/routes/eventos.tsx"), "utf8");

describe("clips de eventos", () => {
  it("muestra los clips en cuadrícula de 4 por fila, sin carrusel", () => {
    expect(source).toContain("lg:grid-cols-4");
    expect(source).not.toContain("handleNextSlide");
    expect(source).not.toContain("carouselIndices");
  });

  it("en celular se desliza con la misma indicación que Restaurante", () => {
    expect(source).toContain("Desliza para ver más");
    expect(source).toContain("snap-x");
  });

  it("cada categoría usa solo clips en video con su portada", () => {
    const clips = [...source.matchAll(/clip\("([a-z0-9-]+)"/g)].map((m) => m[1]);
    expect(clips.length).toBeGreaterThanOrEqual(12);
    const prefijos = new Set(clips.map((c) => c.split("-")[0]));
    expect(prefijos).toEqual(new Set(["familiares", "corporativas", "bodas"]));
  });
});
