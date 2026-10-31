import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const galleryRoutePath = resolve(process.cwd(), "src/routes/galeria.tsx");
const source = readFileSync(galleryRoutePath, "utf8");

describe("etiquetas de las tarjetas de galería", () => {
  it("oculta el título en las tarjetas y lo conserva para accesibilidad y el visor", () => {
    const galleryGrid =
      source.match(/\{\/\* Gallery Grid \*\/\}([\s\S]*?)\{\/\* Lightbox Modal \*\/\}/)?.[1] ?? "";
    const lightbox =
      source.match(/\{\/\* Lightbox Modal \*\/\}([\s\S]*?)\{\/\* Footer \*\/\}/)?.[1] ?? "";

    expect(galleryGrid).not.toContain("absolute right-6 top-6");
    expect(galleryGrid).toContain("alt={img.titulo}");
    expect(lightbox).toContain("<figcaption");
    expect(lightbox).toContain("{images[selectedIndex].titulo}");
  });
});
