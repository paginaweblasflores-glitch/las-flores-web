import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const privacyPolicyPath = resolve(
  process.cwd(),
  "src/routes/politica-de-privacidad.tsx",
);

describe("dirección de la política de privacidad", () => {
  it("muestra la dirección actual del Restaurante Las Flores", () => {
    const privacyPolicy = readFileSync(privacyPolicyPath, "utf8");

    expect(privacyPolicy).toContain(
      "Dirección: Jr. José Olaya 106, Huamanga, Ayacucho, Perú.",
    );
  });
});
