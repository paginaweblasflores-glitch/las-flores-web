import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cashierRoute = readFileSync(resolve(process.cwd(), "src/routes/caja.tsx"), "utf8");

describe("acceso al control de stock en caja", () => {
  it("no limita el botón de stock al rol administrador", () => {
    expect(cashierRoute).not.toMatch(/\{isAdmin\s*&&\s*\(\s*\n\s*<button[\s\S]*?Control de Stock/);
  });
});

describe("actualización inmediata del control de stock", () => {
  it("aplica el estado confirmado del producto sin reemplazar la lista por loading", () => {
    const stockSource = readFileSync(
      resolve(process.cwd(), "src/components/CashierStockModal.tsx"),
      "utf8",
    );

    expect(stockSource).toContain("const updated = await toggleProductAvailability");
    expect(stockSource).toContain("p.id === productId ? { ...p, is_available: updated.is_available");
  });
});