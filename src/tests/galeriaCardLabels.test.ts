import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const galleryRoutePath = resolve(process.cwd(), "src/routes/galeria.tsx");
const source = readFileSync(galleryRoutePath, "utf8");

describe("etiquetas de las tarjetas de galería", () => {
  it("omite la etiqueta Nuestra Galería del encabezado", () => {
    const galleryHero = source.match(/\{\/\* Header Banner \*\/\}([\s\S]*?)<\/section>/)?.[1] ?? "";

    expect(galleryHero).not.toContain("Nuestra Galería");
    expect(galleryHero).toContain("Nuestras costumbres para el mundo");
  });

  it("muestra el título actualizado en el encabezado", () => {
    expect(source).toContain("Nuestras costumbres para el mundo");
  });

  it("oculta las etiquetas solo en Experiencias y conserva los textos accesibles", () => {
    const galleryGrid =
      source.match(/\{\/\* Gallery Grid \*\/\}([\s\S]*?)\{\/\* Lightbox Modal \*\/\}/)?.[1] ?? "";
    const lightbox =
      source.match(/\{\/\* Lightbox Modal \*\/\}([\s\S]*?)\{\/\* Footer \*\/\}/)?.[1] ?? "";

    expect(galleryGrid).toMatch(/\{activeCategory !== "experiencia" && \(/);
    expect(galleryGrid).toContain("absolute right-6 top-6");
    expect(galleryGrid).toContain("alt={img.titulo}");
    expect(lightbox).toContain("<figcaption");
    expect(lightbox).toContain("{images[selectedIndex].titulo}");
  });

  it("nombra la categoría como Gastronomía", () => {
    expect(source).toContain('label: "Gastronomía"');
    expect(source).not.toContain('label: "Gastronomías"');
  });

  it("muestra únicamente los cinco platos solicitados en Gastronomía", () => {
    const gastronomyCategory =
      source.match(/id: "postres-bebidas",[\s\S]*?images: \[([\s\S]*?)\n\s*\],\s*\n\s*\},/)?.[1] ??
      "";

    expect(gastronomyCategory).toContain(
      'src: "/imagenes-reales/seccion-gastronomia/cuy-frito-ayacuchano.webp"',
    );
    expect(gastronomyCategory).toContain(
      'src: "/imagenes-reales/seccion-gastronomia/puca-picante.webp"',
    );
    expect(gastronomyCategory).toContain(
      'src: "/imagenes-reales/seccion-gastronomia/chorizo-ayacuchano.webp"',
    );
    expect(gastronomyCategory).toContain(
      'src: "/imagenes-reales/seccion-gastronomia/mondongo ayacuchano.webp"',
    );
    expect(gastronomyCategory).toContain(
      'src: "/imagenes-reales/recomendaciones-chef/chicharon.webp"',
    );
    expect(gastronomyCategory).toContain('titulo: "Cuy frito"');
    expect(gastronomyCategory).toContain('titulo: "Puca con chicharrón"');
    expect(gastronomyCategory).toContain('titulo: "Chorizo"');
    expect(gastronomyCategory).toContain('titulo: "Mondongo"');
    expect(gastronomyCategory).toContain('titulo: "Chicharrón"');
    expect(gastronomyCategory.match(/\bsrc:/g)).toHaveLength(5);
    expect(gastronomyCategory).not.toContain('titulo: "Cuy frito ayacuchano"');
    expect(gastronomyCategory).not.toContain('titulo: "Chorizo ayacuchano"');
    expect(gastronomyCategory).not.toContain('titulo: "Mondongo ayacuchano"');
    expect(gastronomyCategory).not.toContain('titulo: "Chicharrón ayacuchano"');
    expect(gastronomyCategory).not.toContain("chicha-");
    expect(gastronomyCategory).not.toContain("panes-");
  });

  it("mantiene las tarjetas verticales y adapta las imágenes al marco", () => {
    const galleryGrid =
      source.match(/\{\/\* Gallery Grid \*\/\}([\s\S]*?)\{\/\* Lightbox Modal \*\/\}/)?.[1] ?? "";

    expect(galleryGrid).toContain(
      'className="relative aspect-[3/4] overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"',
    );
    expect(galleryGrid).toContain(
      '"w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"',
    );
    expect(galleryGrid).not.toContain("object-contain p-3");
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
