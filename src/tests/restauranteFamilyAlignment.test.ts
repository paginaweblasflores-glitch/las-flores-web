import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/restaurante.tsx"), "utf8");

describe("sección de familia en restaurante", () => {
  it("coloca las recomendaciones del chef antes de los testimonios y la familia después de ellos", () => {
    const generationsPosition = routeSource.indexOf("<GenerationsSection />");
    const chefPosition = routeSource.indexOf("<ChefVideosSection />");
    const clientPosition = routeSource.indexOf("<ClientVideosSection />");
    const familyPosition = routeSource.indexOf('{/* Familia Las Flores */}');
    const reservationsPosition = routeSource.indexOf('{/* CTA Reservas y Delivery */}');

    expect(generationsPosition).toBeGreaterThan(-1);
    expect(chefPosition).toBeGreaterThan(generationsPosition);
    expect(clientPosition).toBeGreaterThan(chefPosition);
    expect(familyPosition).toBeGreaterThan(clientPosition);
    expect(reservationsPosition).toBeGreaterThan(familyPosition);
  });

  it("conserva el diseño y el enlace originales de la familia", () => {
    expect(routeSource).toContain('id="familia"');
    expect(routeSource).toContain("md:grid-cols-12");
    expect(routeSource).toContain('className="md:col-span-8"');
    expect(routeSource).toContain('className="md:col-span-4"');
    expect(routeSource).toContain('to="/familia-las-flores"');
    expect(routeSource).toContain("CONOCE A LA FAMILIA");
  });
});
