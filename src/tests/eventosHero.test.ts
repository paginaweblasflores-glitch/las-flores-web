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

  it("muestra solo el título, sin descripción en el hero", () => {
    expect(source).not.toContain("Comparte momentos inolvidables");
  });
});
