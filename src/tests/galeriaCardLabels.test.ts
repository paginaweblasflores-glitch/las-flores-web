import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const galleryRoutePath = resolve(process.cwd(), "src/routes/galeria.tsx");
const source = readFileSync(galleryRoutePath, "utf8");

describe("etiquetas de las tarjetas de galería", () => {
  it("omite la etiqueta Nuestra Galería del encabezado", () => {
    const galleryHero = source.match(/\{\/\* Header Banner \*\/\}([\s\S]*?)<\/section>/)?.[1] ?? "";

    expect(galleryHero).not.toContain("Nuestra Galería");
    expect(galleryHero).toContain("Ayacucho, ciudad de las costumbres");
  });

  it("muestra el título actualizado en el encabezado", () => {
    expect(source).toContain("Ayacucho, ciudad de las costumbres");
  });

  it("oculta las etiquetas en Gastronomía y Experiencias y conserva los textos accesibles", () => {
    const galleryGrid =
      source.match(/\{\/\* Gallery Grid \*\/\}([\s\S]*?)\{\/\* Lightbox Modal \*\/\}/)?.[1] ?? "";
    const lightbox =
      source.match(/\{\/\* Lightbox Modal \*\/\}([\s\S]*?)\{\/\* Footer \*\/\}/)?.[1] ?? "";

    expect(galleryGrid).toContain(
      'activeCategory !== "postres-bebidas" && activeCategory !== "experiencia"',
    );
    expect(galleryGrid).toContain("absolute right-6 top-6");
    expect(galleryGrid).toContain("alt={img.titulo}");
    expect(lightbox).toContain("<figcaption");
    expect(lightbox).toContain("{images[selectedIndex].titulo}");
  });

  it("nombra la categoría como Gastronomía", () => {
    expect(source).toContain('label: "Gastronomía"');
    expect(source).not.toContain('label: "Gastronomías"');
  });

  it("reemplaza los títulos genéricos por descripciones de las imágenes de experiencia", () => {
    const experienceCategory =
      source.match(/id: "experiencia",[\s\S]*?images: \[([\s\S]*?)\n\s*\],\s*\n\s*\},/)?.[1] ?? "";

    expect(experienceCategory).not.toContain("Galería de experiencias — foto");
    expect(experienceCategory).not.toContain('foto("eventos", "evento-20"');
    expect(experienceCategory).toContain('"IMG_0231.jpg", "Chef Gastón Acurio en Las Flores"');
    expect(experienceCategory).toContain('"IMG_1346.jpg", "Miss Perú Internacional en Las Flores"');
    expect(experienceCategory).toContain('"IMG_0664.jpg", "Señora Gloria"');
    expect(experienceCategory).toContain('"DSC00119.jpg", "Un compartir en Las Flores"');
    expect(experienceCategory).toContain('"DSC00131.jpg", "Un compartir en Las Flores"');
    expect(experienceCategory).toContain('"DSC00140.jpg", "Un compartir en Las Flores"');
    expect(experienceCategory).toContain('"DSC00141.jpg", "Un compartir en Las Flores"');
    expect(experienceCategory).toContain('"DSC09286.jpg", "Una experiencia en la naturaleza"');
  });
});
