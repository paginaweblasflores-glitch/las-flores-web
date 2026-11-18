import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const staffLogin = readFileSync(resolve(process.cwd(), "src/routes/staff-login.tsx"), "utf8");
const hardeningRls = readFileSync(resolve(process.cwd(), "supabase/hardening_rls.sql"), "utf8");
const marketingMigration = readFileSync(
  resolve(process.cwd(), "supabase/marketing_flyers.sql"),
  "utf8",
);
const homePage = readFileSync(resolve(process.cwd(), "src/routes/index.tsx"), "utf8");
const marketingRoutePath = resolve(process.cwd(), "src/routes/marketing.tsx");
const marketingRoute = existsSync(marketingRoutePath)
  ? readFileSync(marketingRoutePath, "utf8")
  : "";
const flyerPopupPath = resolve(process.cwd(), "src/components/MarketingFlyerPopup.tsx");
const flyerPopup = existsSync(flyerPopupPath) ? readFileSync(flyerPopupPath, "utf8") : "";

describe("acceso de Marketing", () => {
  it("ofrece Marketing con el correo de Supabase acordado", () => {
    expect(staffLogin).toMatch(
      /\{\s*username:\s*"Marketing",\s*email:\s*"marketing@gmail\.com"\s*\}/,
    );
  });

  it("permite el rol marketing sin incluirlo en los permisos generales del personal", () => {
    const roleConstraint = hardeningRls.match(/CHECK \(role IN \(([^)]*)\)\)/)?.[1] ?? "";
    const isStaffFunction =
      hardeningRls.match(/CREATE OR REPLACE FUNCTION public\.is_staff\(\)[\s\S]*?\$\$;/)?.[0] ?? "";

    expect(roleConstraint).toContain("'marketing'");
    expect(isStaffFunction).not.toContain("'marketing'");
  });

  it("limita la carga de flyers al rol Marketing y permite lectura pública", () => {
    expect(marketingMigration).toContain("CREATE TABLE IF NOT EXISTS public.marketing_flyers");
    expect(marketingMigration).toContain("profiles.role IN ('marketing', 'admin')");
    expect(marketingMigration).toContain("marketing_flyers_public_read");
    expect(marketingMigration).toContain("marketing_flyers_staff_storage_insert");
    expect(marketingMigration).toContain("'marketing@gmail.com'");
  });

  it("monta el popup de flyers en la portada", () => {
    expect(homePage).toContain("<MarketingFlyerPopup />");
  });

  it("protege el panel Marketing con sesión y rol", () => {
    expect(marketingRoute).toContain('createFileRoute("/marketing")');
    expect(marketingRoute).toContain("supabase.auth.getUser()");
    expect(marketingRoute).toContain('userError?.name === "AuthSessionMissingError"');
    expect(marketingRoute).toContain('profile.role !== "marketing"');
  });

  it("cierra el popup y lo recuerda durante la visita", () => {
    expect(flyerPopup).toContain('role="dialog"');
    expect(flyerPopup).toContain('aria-label="Cerrar flyer"');
    expect(flyerPopup).toContain('sessionStorage.setItem("marketing-flyer-dismissed", "true")');
  });
});
