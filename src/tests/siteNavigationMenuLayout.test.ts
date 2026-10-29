import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const menuSource = readFileSync(
  resolve(process.cwd(), "src/components/SiteNavigationMenu.tsx"),
  "utf8",
);

describe("site navigation menu layout", () => {
  it("keeps navigation options close together while allowing overflow scrolling", () => {
    const nav = menuSource.match(/<nav className="([^"]+)">/)?.[1] ?? "";
    const links = menuSource.match(/className="block w-full shrink-0 ([^"]+)"/)?.[1] ?? "";

    expect(nav).toContain("justify-start");
    expect(nav).toContain("gap-1");
    expect(nav).toContain("overflow-y-auto");
    expect(nav).not.toContain("justify-evenly");
    expect(links).toContain("py-1.5");
    expect(links).not.toContain("py-2.5");
  });
});
