import { describe, expect, it } from "vitest";
import { etiquetaCategoria } from "@/lib/liveProducts";

describe("etiquetaCategoria", () => {
  it("cambia el & por una y", () => {
    expect(etiquetaCategoria("Bebidas & Refrescos")).toBe("Bebidas y Refrescos");
    expect(etiquetaCategoria("Bebidas&Refrescos")).toBe("Bebidas y Refrescos");
  });

  it("deja igual los nombres sin &", () => {
    expect(etiquetaCategoria("Postres Tradicionales")).toBe("Postres Tradicionales");
  });
});
