import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const authFunctionPath = resolve(process.cwd(), "supabase/functions/maitre-auth/index.ts");
const authFunction = existsSync(authFunctionPath) ? readFileSync(authFunctionPath, "utf8") : "";
const maitreRoute = readFileSync(resolve(process.cwd(), "src/routes/maitre.tsx"), "utf8");
const loginRoute = readFileSync(resolve(process.cwd(), "src/routes/staff-login.tsx"), "utf8");
const migration = readFileSync(resolve(process.cwd(), "supabase/maitre_waiters.sql"), "utf8");

describe("MAITRE authentication security", () => {
  it("limits mozo account management to authenticated caja and admin profiles", () => {
    expect(authFunction).toMatch(/auth\.getUser\(\)/);
    expect(authFunction).toMatch(/from\(["']profiles["']\)/);
    expect(authFunction).toMatch(/role.*cashier|cashier.*role/i);
    expect(authFunction).toMatch(/role.*admin|admin.*role/i);
    expect(authFunction).toMatch(/auth\.admin\.createUser/);
    expect(authFunction).not.toMatch(/auth\.admin\.updateUserById/);
  });

  it("exchanges a valid code for a Supabase session without asking for a password", () => {
    expect(authFunction).toMatch(/generateLink/);
    expect(authFunction).toMatch(/verifyOtp/);
    expect(authFunction).not.toMatch(/signInWithPassword/);
    expect(authFunction).toMatch(/maitre_waiters/);
    expect(authFunction).toMatch(/código del mozo no es válido/i);
    expect(authFunction).toMatch(/access_code_hash/);
    expect(authFunction).toMatch(/MAITRE_CODE_PEPPER/);
    expect(authFunction).toMatch(/consume_maitre_login_attempt/);
    expect(migration).toMatch(/access_code_hash/);
    expect(migration).not.toMatch(/access_code TEXT/);
  });

  it("keeps the existing staff selector and opens a code-only mozo form for MAITRE", () => {
    expect(loginRoute).toMatch(/<select/);
    expect(loginRoute).toMatch(/username:\s*"MAITRE"/);
    expect(loginRoute).toMatch(/username\s*===\s*"MAITRE"/);
    expect(loginRoute).toMatch(/type="text"[\s\S]*inputMode="numeric"/);
    expect(loginRoute).toMatch(/loginMaitreWaiter\(accessCode\)/);
  });

  it("does not ask Caja to assign or reset a mozo password", () => {
    expect(maitreRoute).not.toMatch(/Contraseña \(mín\./);
    expect(maitreRoute).not.toMatch(/savePassword/);
  });

  it("redirects users without an authenticated session to the staff login", () => {
    expect(maitreRoute).toMatch(/if\s*\(userError\s*\|\|\s*!userData\.user\)/);
    expect(maitreRoute).toMatch(/navigate\(\{\s*to:\s*"\/staff-login"\s*\}\)/);
  });
});
