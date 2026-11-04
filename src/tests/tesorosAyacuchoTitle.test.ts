import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "src/routes/tesoros-ayacucho.tsx"), "utf8");
const hero = source.match(/\{\/\* Hero \*\/\}([\s\S]*?)<\/header>/)?.[1] ?? "";

describe("título de productos de temporada", () => {
  it("muestra solo el título, sin descripción ni texto superior", () => {
    expect(hero).toContain("Productos de temporada");
    expect(hero).not.toContain("Productos de Temporada · Ayacucho");
    expect(hero).not.toContain("Tesoros de Ayacucho");
    expect(hero).not.toContain("Ingredientes autóctonos que dan vida a nuestra cocina.");
    expect(hero).not.toContain("<p");
    expect(hero).not.toContain("<span");
  });
});
