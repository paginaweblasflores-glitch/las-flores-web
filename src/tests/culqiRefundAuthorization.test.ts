import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const refundApiPath = resolve(process.cwd(), "src/lib/culqiApi.ts");
const refundAuthPath = resolve(process.cwd(), "src/lib/culqiRefundAuth.ts");
const refundApiSource = readFileSync(refundApiPath, "utf8");
const refundAuthSource = existsSync(refundAuthPath) ? readFileSync(refundAuthPath, "utf8") : "";
const refundHandler =
  refundApiSource.match(/export const refundCulqiCharge = createServerFn\(\)([\s\S]*)/)?.[1] ?? "";

describe("autorización de reembolsos Culqi", () => {
  it("valida una identidad Supabase con rol autorizado antes de llamar a Culqi", () => {
    expect(refundHandler).toMatch(/typeof raw\.accessToken === "string"/);
    expect(refundHandler).toMatch(/await authorizeCulqiRefund\(payload\.accessToken\)/);
    expect(refundHandler.indexOf("await authorizeCulqiRefund")).toBeLessThan(
      refundHandler.indexOf("await refundCharge("),
    );
    expect(refundHandler).not.toMatch(/refundCharge\([^)]*accessToken/);
    expect(refundAuthSource).toMatch(/auth\.getUser\(token\)/);
    expect(refundAuthSource).toMatch(/from\(["']profiles["']\)/);
    expect(refundAuthSource).toMatch(/profile\?\.role !== "admin" && profile\?\.role !== "staff"/);
  });
});
