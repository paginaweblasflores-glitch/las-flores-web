import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const galleryRoutePath = resolve(process.cwd(), "src/routes/galeria.tsx");
const source = readFileSync(galleryRoutePath, "utf8");

describe("etiquetas de las tarjetas de galería", () => {
  it("muestra el título actualizado en el encabezado", () => {
    expect(source).toContain("Nuestras costumbres para el mundo");
  });

  it("muestra el título en las tarjetas y lo conserva para accesibilidad y el visor", () => {
    const galleryGrid =
      source.match(/\{\/\* Gallery Grid \*\/\}([\s\S]*?)\{\/\* Lightbox Modal \*\/\}/)?.[1] ?? "";
    const lightbox =
      source.match(/\{\/\* Lightbox Modal \*\/\}([\s\S]*?)\{\/\* Footer \*\/\}/)?.[1] ?? "";

    expect(galleryGrid).toContain("absolute right-6 top-6");
    expect(galleryGrid).toContain("{img.titulo}");
    expect(galleryGrid).toContain("alt={img.titulo}");
    expect(lightbox).toContain("<figcaption");
    expect(lightbox).toContain("{images[selectedIndex].titulo}");
  });

  it("reemplaza los títulos genéricos por descripciones de las imágenes de experiencia", () => {
    const experienceCategory =
      source.match(/id: "experiencia",[\s\S]*?images: \[([\s\S]*?)\n\s*\],\s*\n\s*\},/)?.[1] ?? "";

    expect(experienceCategory).not.toContain("Galería de experiencias — foto");
    expect(experienceCategory).not.toContain('foto("eventos", "evento-20"');
    expect(experienceCategory).toContain('"IMG_0231.jpg", "Chef Gastón Acurio en Las Flores"');
    expect(experienceCategory).toContain('"IMG_1346.jpg", "Miss Perú Internacional en Las Flores"');
    expect(experienceCategory).toContain('"IMG_0664.jpg", "Segunda generación de Las Flores"');
    expect(experienceCategory).toContain('"DSC00119.jpg", "Un compartir en Las Flores"');
    expect(experienceCategory).toContain('"DSC00131.jpg", "Un compartir en Las Flores"');
    expect(experienceCategory).toContain('"DSC00140.jpg", "Un compartir en Las Flores"');
    expect(experienceCategory).toContain('"DSC00141.jpg", "Un compartir en Las Flores"');
    expect(experienceCategory).toContain('"DSC09286.jpg", "Una experiencia en la naturaleza"');
  });
});
