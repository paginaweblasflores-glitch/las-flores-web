import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MapaUbicacion } from "../components/MapaUbicacion";

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

  it("omite la dirección de la etiqueta de Las Flores en el mapa", () => {
    const markup = renderToStaticMarkup(React.createElement(MapaUbicacion));

    expect(markup).toContain("Las Flores");
    expect(markup).not.toContain("JOSÉ OLAYA 106");
    expect(markup).not.toContain("Jr. José Olaya 106");
  });
});
