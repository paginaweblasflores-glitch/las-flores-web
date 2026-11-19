import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const userAuthButton = readFileSync(
  resolve(process.cwd(), "src/components/UserAuthButton.tsx"),
  "utf8",
);

describe("formulario de perfil en el acceso del cliente", () => {
  it("no abre un formulario emergente al cargar el perfil", () => {
    expect(userAuthButton).not.toContain("CompleteProfileModal");
    expect(userAuthButton).not.toContain("setShowCompleteModal");
  });
});
