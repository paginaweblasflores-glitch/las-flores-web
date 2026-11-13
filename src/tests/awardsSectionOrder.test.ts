import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeRoutePath = resolve(process.cwd(), "src/routes/index.tsx");

describe("sección de premios de la página de inicio", () => {
  it("pone el texto a la izquierda y una foto grande a la derecha, como en Productos de temporada", () => {
    const routeSource = readFileSync(homeRoutePath, "utf8");
    const awardsSection =
      routeSource.match(/\{\/\* PREMIOS \*\/\}([\s\S]*?)\{\/\* CTA FINAL \*\/\}/)?.[1] ?? "";

    expect(awardsSection).toContain('className="py-16 md:py-28 px-6"');
    expect(awardsSection).toContain("md:grid-cols-12");
    expect(awardsSection).toContain('className="md:col-span-5"');
    expect(awardsSection).toContain("md:col-span-7");
    expect(awardsSection).toContain('className="space-y-6 max-w-md mt-8"');
    expect(awardsSection).not.toContain("shadow-2xl");
    expect(awardsSection.indexOf("<h2")).toBeLessThan(awardsSection.indexOf("<img"));
  });

  it("muestra el título con su descripción breve y separa los premios", () => {
    const routeSource = readFileSync(homeRoutePath, "utf8");
    const awardsSection =
      routeSource.match(/\{\/\* PREMIOS \*\/\}([\s\S]*?)\{\/\* CTA FINAL \*\/\}/)?.[1] ?? "";
    const headingStart = awardsSection.indexOf("<h2");
    const headingEnd = awardsSection.indexOf("</h2>", headingStart);
    const awardPosition = awardsSection.indexOf("Mejor Restaurante Regional", headingEnd);
    const listStart = awardsSection.indexOf("<ul", headingEnd);

    expect(awardsSection.slice(headingStart, headingEnd)).toContain(
      "Reconocimientos",
    );
    expect(
      awardsSection.slice(headingStart, headingEnd),
    ).not.toContain("nuestro compromiso");
    expect(awardPosition).toBeGreaterThan(headingEnd);
    expect(listStart).toBeGreaterThan(headingEnd);
    expect(awardsSection).not.toContain("Ser el mejor restaurante de Ayacucho");
  });

  it("muestra la foto de la entrega del premio en WebP optimizado", () => {
    const routeSource = readFileSync(homeRoutePath, "utf8");
    const awardsSection =
      routeSource.match(/\{\/\* PREMIOS \*\/\}([\s\S]*?)\{\/\* CTA FINAL \*\/\}/)?.[1] ?? "";
    const imagePath = resolve(
      process.cwd(),
      "public/imagenes-reales/premios-restaurante/premios.webp",
    );

    expect(awardsSection).toContain('src="/imagenes-reales/premios-restaurante/premios.webp"');
    expect(awardsSection).toContain('className="w-full aspect-[3/2] object-cover"');
    expect(existsSync(imagePath)).toBe(true);
    expect(statSync(imagePath).size).toBeLessThan(500_000);
    expect(
      existsSync(resolve(process.cwd(), "public/imagenes-reales/premios-restaurante/premius.jpeg")),
    ).toBe(false);
  });
});
