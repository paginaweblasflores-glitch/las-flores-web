import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { lugares } from "@/data/lugares";

const source = readFileSync(resolve(process.cwd(), "src/routes/index.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
const inicio = source.indexOf("function LugaresSlider()");
const fin = source.indexOf("// ─── PÁGINA PRINCIPAL", inicio);
const slider = source.slice(inicio, fin);

describe("lista de lugares para visitar", () => {
  it("son tarjetas grandes que no caben juntas en pantalla y se mueven solo con las flechas o con el dedo", () => {
    expect(slider).toContain("overflow-x-auto");
    expect(slider).toContain("lg:w-[25.8rem]");
    expect(slider).not.toContain("grid-cols");
    expect(slider).not.toContain("requestAnimationFrame");
    expect(slider).not.toContain("setInterval");
    expect(source).not.toContain("<LugaresGrid");
  });

  it("las flechas avanzan una tarjeta y se desactivan en los extremos", () => {
    expect(slider).toContain("scrollBy");
    expect(slider).toContain('aria-label="Siguiente destino"');
    expect(slider).toContain('aria-label="Destino anterior"');
    expect(slider).toContain("disabled={alInicio}");
    expect(slider).toContain("disabled={alFinal}");
  });

  it("las tarjetas llegan hasta los bordes de la pantalla y la primera alinea con el título", () => {
    const seccion = source.slice(source.indexOf('id="lugares-para-visitar"'));
    expect(seccion.slice(0, seccion.indexOf("</section>"))).toContain("<LugaresSlider />");
    expect(css).toContain(".lugares-slider__lista");
    expect(css).toContain("padding-inline: var(--margen)");
  });

  it("al volver atrás desde un lugar, la lista regresa a la tarjeta donde estaba", () => {
    expect(source).toContain("let posicionGuardadaLugares = 0;");
    expect(slider).toContain("posicionGuardadaLugares = lista.scrollLeft");
    expect(slider).toContain("lista.scrollLeft = posicionGuardadaLugares");
    expect(slider).toContain("useLayoutEffect");
  });

  it("en celular se desliza con la indicación Desliza para ver más", () => {
    expect(slider).toContain("Desliza para ver más");
    expect(slider).toContain("snap-x");
  });

  it("cada tarjeta lleva foto, título, categoría, descripción corta y el enlace Descubrir más", () => {
    expect(slider).toContain("aspect-[413/502]");
    expect(slider).toContain("{lugar.categoria}");
    expect(slider).toContain("lugar.nombreLista ?? lugar.nombre");
    expect(slider).toContain("lugar.resumen ?? lugar.metaDescripcion");
    expect(slider).toContain("Descubrir más");
    expect(slider).toContain('to="/destinos/$slug"');
    expect(slider).toContain("params={{ slug: lugar.slug }}");
  });

  it("cada lugar tiene una descripción corta propia para su tarjeta", () => {
    for (const lugar of lugares) {
      expect(lugar.resumen, lugar.slug).toBeTruthy();
      expect(lugar.resumen!.length, lugar.slug).toBeLessThan(160);
      expect(lugar.resumen, lugar.slug).not.toContain(":");
    }
  });
});
