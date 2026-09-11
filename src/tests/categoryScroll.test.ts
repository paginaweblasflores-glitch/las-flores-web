import { describe, expect, it } from "vitest";
import { shouldRevealNextCategory } from "../utils/categoryScroll";

describe("desplazamiento progresivo de categorías", () => {
  it("revela la siguiente categoría cuando la activa queda al borde visible", () => {
    expect(shouldRevealNextCategory(2, 8, 398, 400)).toBe(true);
  });

  it("no desplaza si la categoría activa aún está visible con margen", () => {
    expect(shouldRevealNextCategory(2, 8, 360, 400)).toBe(false);
  });

  it("no desplaza después de la última categoría de la lista", () => {
    expect(shouldRevealNextCategory(7, 8, 398, 400)).toBe(false);
  });
});