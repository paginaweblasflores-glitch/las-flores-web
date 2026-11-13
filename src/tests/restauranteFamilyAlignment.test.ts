import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/restaurante.tsx"), "utf8");

describe("sección de familia en restaurante", () => {
  const familySection =
    routeSource.match(/\{\/\* Familia Las Flores \*\/\}([\s\S]*?)<ChefVideosSection/)?.[1] ?? "";

  it("usa el mismo contenedor que las tarjetas de generaciones para alinear sus bordes", () => {
    expect(familySection).toContain('className="container-flores mx-auto grid');
    expect(familySection).not.toContain("max-w-[33.5rem]");
  });

  it("pone la foto grande a la izquierda y el texto a la derecha, con la foto completa del equipo", () => {
    expect(familySection).toContain("md:grid-cols-12");
    expect(familySection).toContain('className="md:col-span-8"');
    expect(familySection).toContain('className="md:col-span-4"');
    expect(familySection).toContain("aspect-[2/1]");
    expect(familySection).not.toContain("shadow-2xl");
    expect(familySection.indexOf("Equipolasflores.webp")).toBeLessThan(
      familySection.indexOf("Familia Las Flores"),
    );
  });

  it("conserva el antetítulo, el texto y el botón original", () => {
    expect(familySection).toContain("Nuestra gente");
    expect(familySection).toContain("btn-yellow-hover");
    expect(familySection).toContain("CONOCE A LA FAMILIA");
  });
});
