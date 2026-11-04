import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const contactoSource = readFileSync(resolve(process.cwd(), "src/routes/contacto.tsx"), "utf8");

describe("contenido de contacto", () => {
  it("omite la sección de preguntas frecuentes y sus datos estructurados", () => {
    expect(contactoSource).not.toContain("Preguntas Frecuentes");
    expect(contactoSource).not.toContain('"@type": "FAQPage"');
  });
});
