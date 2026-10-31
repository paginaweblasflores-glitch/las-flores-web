import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/restaurante.tsx"), "utf8");

describe("alineación de la sección de familia en restaurante", () => {
  it("comparte el ancho de las tarjetas de generaciones para alinear sus bordes", () => {
    const familySection =
      routeSource.match(/\{\/\* Familia Las Flores \*\/\}([\s\S]*?)<ChefAccordionSection/)?.[1] ??
      "";

    expect(familySection).toContain(
      'className="container-flores mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-20"',
    );
    expect(familySection).toContain('className="flex-1 max-w-none"');
    expect(familySection).toContain('className="flex-1 w-full flex justify-end"');
    expect(familySection).toContain("max-w-[33.5rem]");
  });
});
