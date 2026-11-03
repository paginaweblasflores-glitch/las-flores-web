import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "src/components/SiteHeader.tsx"), "utf8");

describe("logo del encabezado global", () => {
  it("centra el enlace del logo respecto al viewport", () => {
    const logoLink =
      source.match(
        /<Link\s+to="\/"([\s\S]*?)aria-label="Ir al inicio de Restaurante Las Flores"/,
      )?.[1] ?? "";

    expect(logoLink).toContain("absolute");
    expect(logoLink).toContain("left-1/2");
    expect(logoLink).toContain("-translate-x-1/2");
  });
});
