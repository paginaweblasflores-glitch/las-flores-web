import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeRoutePath = resolve(process.cwd(), "src/routes/index.tsx");

describe("sección de premios de la página de inicio", () => {
  it("reduce el espacio vertical y la altura de la imagen", () => {
    const routeSource = readFileSync(homeRoutePath, "utf8");
    const awardsSection =
      routeSource.match(/\{\/\* PREMIOS \*\/\}([\s\S]*?)\{\/\* CTA FINAL \*\/\}/)?.[1] ?? "";

    expect(awardsSection).toContain('className="py-12 md:py-20 px-6"');
    expect(awardsSection).toContain('className="space-y-6 max-w-md mt-8"');
    expect(awardsSection).toContain("aspect-square");
    expect(awardsSection).not.toContain("min-h-[500px] md:min-h-[600px]");
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
      "Distinciones",
    );
    expect(
      awardsSection.slice(headingStart, headingEnd),
    ).not.toContain("nuestro compromiso");
    expect(awardPosition).toBeGreaterThan(headingEnd);
    expect(listStart).toBeGreaterThan(headingEnd);
    expect(awardsSection).not.toContain("Ser el mejor restaurante de Ayacucho");
  });

  it("llena un card cuadrado con la foto WebP completa y optimizada", () => {
    const routeSource = readFileSync(homeRoutePath, "utf8");
    const awardsSection =
      routeSource.match(/\{\/\* PREMIOS \*\/\}([\s\S]*?)\{\/\* CTA FINAL \*\/\}/)?.[1] ?? "";
    const imagePath = resolve(
      process.cwd(),
      "public/imagenes-reales/premios-restaurante/premios-las-flores.webp",
    );

    expect(awardsSection).toContain(
      'src="/imagenes-reales/premios-restaurante/premios-las-flores.webp"',
    );
    expect(awardsSection).toContain(
      'className="w-full aspect-square object-cover shadow-2xl"',
    );
    expect(awardsSection).not.toContain("h-[360px] md:h-[460px]");
    expect(existsSync(imagePath)).toBe(true);
    expect(statSync(imagePath).size).toBeLessThan(500_000);
  });
});
