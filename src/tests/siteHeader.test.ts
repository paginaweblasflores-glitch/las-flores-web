import { describe, expect, it } from "vitest";
import { getDeliveryButtonVisibilityClass } from "../utils/siteHeader";

describe("visibilidad del botón Delivery en el encabezado", () => {
  it("muestra Delivery en móvil cuando la página lo solicita", () => {
    expect(getDeliveryButtonVisibilityClass(true)).toBe("inline-block");
  });

  it("mantiene Delivery oculto en móvil por defecto", () => {
    expect(getDeliveryButtonVisibilityClass(false)).toBe("hidden sm:inline-block");
  });
});