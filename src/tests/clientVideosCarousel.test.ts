import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const restaurantSource = readFileSync(resolve(process.cwd(), "src/routes/restaurante.tsx"), "utf8");
const clientVideosSection =
  restaurantSource.match(/function ClientVideosSection\(\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
const chefVideosSection =
  restaurantSource.match(/function ChefVideosSection\(\) \{([\s\S]*?)\n\}/)?.[1] ?? "";

describe("client testimonial video carousel", () => {
  it("shows each video individually on mobile and keeps the desktop grid", () => {
    expect(clientVideosSection).toContain("aspect-[9/16] w-full shrink-0 snap-start");
    expect(clientVideosSection).toContain("md:grid-cols-2");
    expect(clientVideosSection).toContain("lg:grid-cols-4");
  });

  it("shows one swipe hint that disappears after horizontal scrolling", () => {
    expect(clientVideosSection).toContain("Desliza para ver más");
    expect(clientVideosSection).toContain("onScroll");
    expect(clientVideosSection).toContain("setMostrarIndicacion(false)");
    expect(clientVideosSection).toContain("md:hidden");
  });
});

describe("chef recommendation video carousel", () => {
  it("shows each chef video individually on mobile and keeps the desktop grid", () => {
    expect(chefVideosSection).toContain('className="w-full shrink-0 snap-start md:w-auto"');
    expect(chefVideosSection).toContain("relative aspect-[9/16] overflow-hidden bg-black");
    expect(chefVideosSection).toContain("md:grid-cols-2");
    expect(chefVideosSection).toContain("lg:grid-cols-4");
  });

  it("shows one swipe hint that disappears after horizontal scrolling", () => {
    expect(chefVideosSection).toContain("Desliza para ver más");
    expect(chefVideosSection).toContain("onScroll");
    expect(chefVideosSection).toContain("setMostrarIndicacion(false)");
    expect(chefVideosSection).toContain("md:hidden");
  });
});
