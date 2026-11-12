import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const eventsRoutePath = resolve(process.cwd(), "src/routes/eventos.tsx");
const source = readFileSync(eventsRoutePath, "utf8");

describe("encabezado de eventos", () => {
  it("omite el rótulo Celebre con nosotros y conserva el título", () => {
    expect(source).not.toContain("Celebre con nosotros");
    expect(source).toContain("Celebra en Las Flores");
  });

  it("complementa el título con una descripción corta que no repite sus palabras", () => {
    expect(source).not.toContain("Comparte momentos inolvidables");
    expect(source).toContain("Todo momento importante merece una buena mesa.");
  });
});
