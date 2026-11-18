import { describe, expect, it } from "vitest";
import { getStaffLoginDestination } from "../features/staff/operations";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const staffLoginSource = readFileSync(resolve(process.cwd(), "src/routes/staff-login.tsx"), "utf8");

describe("staff login destinations", () => {
  it("maps Administrator, Caja, and Ventas to their current Supabase Auth emails", () => {
    expect(staffLoginSource).toMatch(
      /\{\s*username:\s*"Administrador Las Flores",\s*email:\s*"ADMINISTRADOR1980@gmail\.com"\s*\}/,
    );
    expect(staffLoginSource).toMatch(
      /\{\s*username:\s*"Caja Las Flores",\s*email:\s*"CAJA1980@gmail\.com"\s*\}/,
    );
    expect(staffLoginSource).toMatch(
      /\{\s*username:\s*"Ventas Las Flores",\s*email:\s*"VENTAS1980@gmail\.com"\s*\}/,
    );
  });

  it("routes each staff role to its panel", () => {
    expect(getStaffLoginDestination("staff")).toBe("/caja");
    expect(getStaffLoginDestination("cashier")).toBe("/caja");
    expect(getStaffLoginDestination("admin")).toBe("/admin");
    expect(getStaffLoginDestination("ventas")).toBe("/panel-reservas");
    expect(getStaffLoginDestination("marketing")).toBe("/marketing");
    expect(getStaffLoginDestination("unknown")).toBeNull();
  });
});
