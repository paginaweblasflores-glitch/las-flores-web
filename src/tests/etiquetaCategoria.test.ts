import { describe, expect, it } from "vitest";
import { etiquetaCategoria } from "@/lib/liveProducts";
import { nombreEnCarta } from "@/lib/menuLabels";

describe("etiquetaCategoria", () => {
  it("muestra Arma tu desayuno con minúscula en desayuno", () => {
    expect(etiquetaCategoria("Arma tu Desayuno")).toBe("Arma tu desayuno");
  });

  it("cambia el & por una y", () => {
    expect(etiquetaCategoria("Bebidas & Refrescos")).toBe("Bebidas y refrescos");
    expect(etiquetaCategoria("Bebidas&Refrescos")).toBe("Bebidas y refrescos");
  });

  it("respeta los nombres propios y las tildes en la carta", () => {
    expect(etiquetaCategoria("Postres Tradicionales")).toBe("Postres tradicionales");
    expect(etiquetaCategoria("Calderia las Flores")).toBe("Caldería Las Flores");
    expect(nombreEnCarta("CUY LAS FLORES (DESHUESADO)")).toBe("Cuy Las Flores (deshuesado)");
    expect(nombreEnCarta("CRÊPE SUZETTE")).toBe("Crêpe Suzette");
    expect(nombreEnCarta("Especial de Doña Rosa")).toBe("Especial de Doña Rosa");
  });
});
