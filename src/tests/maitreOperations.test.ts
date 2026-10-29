import { describe, expect, it } from "vitest";
import { getStaffLoginDestination, isValidMaitreAccessCode } from "../features/maitre/operations";

describe("MAITRE waiter credentials", () => {
  it("accepts unique mozo login codes containing four to six digits", () => {
    expect(isValidMaitreAccessCode("0042")).toBe(true);
    expect(isValidMaitreAccessCode("12345")).toBe(true);
    expect(isValidMaitreAccessCode("000042")).toBe(true);
    expect(isValidMaitreAccessCode("123")).toBe(false);
    expect(isValidMaitreAccessCode("1234567")).toBe(false);
    expect(isValidMaitreAccessCode("12a4")).toBe(false);
  });

  it("sends authenticated mozos straight to the salon order screen", () => {
    expect(getStaffLoginDestination("staff")).toBe("/salon");
    expect(getStaffLoginDestination("cashier")).toBe("/caja");
    expect(getStaffLoginDestination("admin")).toBe("/admin");
    expect(getStaffLoginDestination("unknown")).toBeNull();
  });
});
