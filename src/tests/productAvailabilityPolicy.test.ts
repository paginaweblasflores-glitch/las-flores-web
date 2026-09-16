import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { removeDishFromCategories } from "../lib/liveProducts";
import { removeUnavailableCartItems } from "../context/CartContext";

const hardeningRls = readFileSync(resolve(process.cwd(), "supabase/hardening_rls.sql"), "utf8");

describe("política de disponibilidad de productos", () => {
  it("elimina la función de rastreo anterior antes de cambiar su retorno", () => {
    expect(hardeningRls).toMatch(
      /DROP FUNCTION IF EXISTS public\.get_order_tracking\(UUID\);[\s\S]*?CREATE OR REPLACE FUNCTION public\.get_order_tracking/i,
    );
  });

  it("autoriza al personal de caja a cambiar solo is_available", () => {
    expect(hardeningRls).toMatch(/role\s+IN\s*\([^)]*'cashier'[^)]*\)/i);
    expect(hardeningRls).toMatch(
      /CHECK \(role IN \('client', 'staff', 'cashier', 'admin', 'ventas', 'delivery'\)\)/i,
    );
    expect(hardeningRls).toMatch(
      /CREATE POLICY "products_availability_staff_update"[\s\S]*?FOR UPDATE[\s\S]*?public\.is_staff\(\)/i,
    );
    expect(hardeningRls).toMatch(/products_availability_staff_only/i);
  });

  it("incluye products en la publicacion de Realtime", () => {
    expect(hardeningRls).toMatch(
      /pg_publication_tables[\s\S]*supabase_realtime[\s\S]*public[\s\S]*products/i,
    );
    expect(hardeningRls).toMatch(/ALTER PUBLICATION supabase_realtime ADD TABLE public\.products/i);
  });

  it("puede retirar inmediatamente un plato deshabilitado del menu visible", () => {
    const categories = [
      {
        id: "entradas",
        label: "Entradas",
        dishes: [{ id: "product-1", name: "Plato oculto", description: "", price: "S/ 10.00" }],
      },
    ];

    expect(removeDishFromCategories(categories, "product-1")).toEqual([
      { id: "entradas", label: "Entradas", dishes: [] },
    ]);
  });

  it("no repone platos estaticos cuando Supabase devuelve una categoria vacia", () => {
    const liveProductsSource = readFileSync(
      resolve(process.cwd(), "src/lib/liveProducts.ts"),
      "utf8",
    );

    expect(liveProductsSource).toMatch(/result\.push\(\{ \.\.\.cat, dishes: \[\] \}\)/);
    expect(liveProductsSource).not.toMatch(/const defaultCat = staticCategories\.find/);
  });

  it("retira del carrito los productos deshabilitados por su id real", () => {
    const items = [
      { id: "product-1__opcion", productId: "product-1", name: "Plato oculto", price: 10, quantity: 1 },
      { id: "product-2", name: "Plato disponible", price: 12, quantity: 1 },
    ];

    expect(removeUnavailableCartItems(items, new Set(["product-1"]))).toEqual([items[1]]);
  });
});
