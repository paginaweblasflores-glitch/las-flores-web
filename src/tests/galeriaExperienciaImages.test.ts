import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const galleryRoutePath = resolve(process.cwd(), "src/routes/galeria.tsx");
const uploadedImages = [
  "ceramica.jpg.webp",
  "ceramista.jpg.webp",
  "DSC00119.jpg.webp",
  "DSC00131.jpg.webp",
  "DSC00140.jpg.webp",
  "DSC00141.jpg.webp",
  "DSC00680.jpg.webp",
  "DSC09286.jpg.webp",
  "DSC09546.jpg.webp",
  "DSC09552.jpg.webp",
  "DSC09612.jpg.webp",
  "DSC09621.jpg.webp",
  "DSC09672.jpg.webp",
  "DSC09760.jpg.webp",
  "DSC09786.jpg.webp",
  "DSC09791 - copia.jpg.webp",
  "DSC09911.jpg.webp",
  "DSC09935.jpg.webp",
  "IMG_0231.jpg.webp",
  "IMG_0664.jpg.webp",
  "IMG_1346.jpg.webp",
  "quinua.jpg.webp",
  "quinuaa.jpg.webp",
] as const;

describe("imágenes de la categoría Experiencia", () => {
  it("omite la foto solicitada y conserva las demás imágenes recientes", () => {
    const source = readFileSync(galleryRoutePath, "utf8");
    const category =
      source.match(/\{\s*id: "experiencia",[\s\S]*?\n  \},/)?.[0] ?? "";

    expect(category).not.toBe("");

    for (const filename of uploadedImages) {
      const basename = filename.slice(0, -".webp".length);
      const diskPath = resolve(
        process.cwd(),
        "public/imagenes-reales/galeria/eventos",
        filename,
      );

      expect(category).toContain(`foto("eventos", "${basename}",`);
      expect(existsSync(diskPath)).toBe(true);
    }

    expect(category).not.toContain('foto("eventos", "DSC00123-2.jpg",');
    expect(
      existsSync(resolve(process.cwd(), "public/imagenes-reales/galeria/eventos/DSC00123-2.jpg.webp")),
    ).toBe(true);

    for (const existingImage of ["evento-09", "evento-08", "evento-16", "evento-20"]) {
      expect(category).toContain(`foto("eventos", "${existingImage}",`);
    }

    expect(category.match(/foto\("eventos",/g)).toHaveLength(27);
  });
});
