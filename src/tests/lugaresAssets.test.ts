import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { lugares } from "@/data/lugares";

function rutas(valor: unknown, acumulado: string[] = []): string[] {
  if (typeof valor === "string") {
    if (valor.startsWith("/imagenes-reales/") || valor.startsWith("/videos/")) acumulado.push(valor);
  } else if (Array.isArray(valor)) {
    valor.forEach((v) => rutas(v, acumulado));
  } else if (valor && typeof valor === "object") {
    Object.values(valor).forEach((v) => rutas(v, acumulado));
  }
  return acumulado;
}

describe("lugares para visitar", () => {
  it("cada lugar tiene un slug, un id y un numeral únicos", () => {
    expect(new Set(lugares.map((l) => l.slug)).size).toBe(lugares.length);
    expect(new Set(lugares.map((l) => l.id)).size).toBe(lugares.length);
    expect(new Set(lugares.map((l) => l.numeral)).size).toBe(lugares.length);
  });

  it("las imágenes y videos de los lugares nuevos existen en public", () => {
    const faltantes = ["canones-de-qorihuillca", "volcan-pachapupum"].flatMap((slug) =>
      rutas(lugares.find((l) => l.slug === slug)).filter(
        (r) => !existsSync(resolve(process.cwd(), "public", r.slice(1))),
      ),
    );
    expect(faltantes).toEqual([]);
  });

  it("los cañones de Qorihuillca tienen su propia página con mapa y cuatro escenas", () => {
    const lugar = lugares.find((l) => l.slug === "canones-de-qorihuillca");
    expect(lugar).toBeDefined();
    expect(lugar?.mapLat).toBeDefined();
    expect(lugar?.mapLng).toBeDefined();
    expect(lugar?.escenasCards).toHaveLength(4);
    expect(lugar?.galeria).toHaveLength(2);
  });

  it("el volcán Pachapupum tiene su propia página y ya no está en la de Puncupata", () => {
    const volcan = lugares.find((l) => l.slug === "volcan-pachapupum");
    expect(volcan?.video?.hero).toContain("pachapupum");
    expect(volcan?.escenasCards).toHaveLength(4);
    expect(volcan?.galeria).toHaveLength(2);
    const puncupata = lugares.find((l) => l.slug === "abismo-puncupata");
    expect(puncupata?.videoSeccion).toBeUndefined();
  });
});
