import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
});
