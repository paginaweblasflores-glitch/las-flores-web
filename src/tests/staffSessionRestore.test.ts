import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { registerPageRestoreAuthCheck } from "../lib/staffSessionRestore";

const staffRoutes = [
  "src/routes/admin.tsx",
  "src/routes/caja.tsx",
  "src/routes/panel-reservas.tsx",
].map((path) => readFileSync(resolve(process.cwd(), path), "utf8"));

describe("staff session restore behavior", () => {
  it("revalidates only when the browser restores a page from its back-forward cache", () => {
    const target = new EventTarget();
    const onRestore = vi.fn();
    const unregister = registerPageRestoreAuthCheck(onRestore, target);
    const initialShow = new Event("pageshow");
    Object.defineProperty(initialShow, "persisted", { value: false });
    target.dispatchEvent(initialShow);
    expect(onRestore).not.toHaveBeenCalled();

    const restoredShow = new Event("pageshow");
    Object.defineProperty(restoredShow, "persisted", { value: true });
    target.dispatchEvent(restoredShow);
    expect(onRestore).toHaveBeenCalledOnce();

    unregister();
    target.dispatchEvent(restoredShow);
    expect(onRestore).toHaveBeenCalledOnce();
  });

  it("revalidates staff access when a protected page is restored from browser history", () => {
    for (const route of staffRoutes) {
      expect(route).toMatch(/registerPageRestoreAuthCheck/);
    }
  });

  it("replaces the protected page in history after sign-out", () => {
    for (const route of staffRoutes) {
      expect(route).toMatch(/window\.location\.replace\(["']\/staff-login["']\)/);
    }
  });
});
