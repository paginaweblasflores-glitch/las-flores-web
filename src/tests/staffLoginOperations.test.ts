import { describe, expect, it } from "vitest";
import { getStaffLoginDestination } from "../features/staff/operations";

describe("staff login destinations", () => {
  it("routes each staff role to its panel", () => {
    expect(getStaffLoginDestination("staff")).toBe("/caja");
    expect(getStaffLoginDestination("cashier")).toBe("/caja");
    expect(getStaffLoginDestination("admin")).toBe("/admin");
    expect(getStaffLoginDestination("ventas")).toBe("/panel-reservas");
    expect(getStaffLoginDestination("marketing")).toBe("/marketing");
    expect(getStaffLoginDestination("unknown")).toBeNull();
  });
});
