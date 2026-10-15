import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("dirección del Restaurante Las Flores", () => {
  it("usa la dirección correcta en el libro de reclamaciones", () => {
    const route = readFileSync(
      resolve(root, "src/routes/libro-de-reclamaciones.tsx"),
      "utf8",
    );

    expect(route).toContain(
      "Domicilio: Jr. José Olaya 106, Huamanga, Ayacucho, Perú.",
    );
  });

  it("usa la dirección correcta para el recojo en local", () => {
    const modal = readFileSync(
      resolve(root, "src/components/AdminOrderDetailModal.tsx"),
      "utf8",
    );

    expect(modal).toContain("Recojo en local - Jr. José Olaya 106");
  });
});
