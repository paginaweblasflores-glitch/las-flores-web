import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("navegación directa y acciones de carta", () => {
  it("no renderiza el botón Delivery en el encabezado", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/SiteHeader.tsx"),
      "utf8",
    );

    expect(source).not.toContain('to="/carta"');
    expect(source).not.toContain("onDeliveryClick");
    expect(source).not.toContain(">Delivery<");
  });

  it("muestra acciones de agregar sobre las cards de la carta", () => {
    const source = readFileSync(resolve(process.cwd(), "src/routes/carta.tsx"), "utf8");

    expect(source).toContain("Personalizar y agregar");
    expect(source).toContain("Agregar");
    expect(source).toContain("group-hover");
  });
});
