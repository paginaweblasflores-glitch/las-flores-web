import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const routePath = resolve(process.cwd(), "src/routes/tesoros-ayacucho.tsx");
const publicPath = resolve(process.cwd(), "public");

describe("imágenes de Tesoros de Ayacucho", () => {
  it("usa únicamente imágenes existentes en public", () => {
    const routeSource = readFileSync(routePath, "utf8");
    const imagePaths = [...routeSource.matchAll(/imagen:\s*"([^"]+)"/g)].map(
      (match) => match[1],
    );

    expect(imagePaths.length).toBeGreaterThan(0);
    expect(imagePaths.every((imagePath) => existsSync(resolve(publicPath, imagePath.slice(1))))).toBe(
      true,
    );
  });

  it("muestra una sola tarjeta por imagen y usa su nombre", () => {
    const routeSource = readFileSync(routePath, "utf8");
    const activeCatalog = routeSource.match(
      /const productosPorTemporada: Record<string, Producto\[]> = \{([\s\S]*?)\r?\n\};\r?\n\r?\nfunction/,
    )?.[1] ?? "";
    const products = [...
      activeCatalog.matchAll(/\{\s*nombre:\s*"([^"]+)"[\s\S]*?imagen:\s*"([^"]+)"/g),
    ].map((match) => ({ name: match[1], imagePath: match[2] }));
    const normalize = (value: string) =>
      value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

    expect(products).toHaveLength(20);
    expect(new Set(products.map((product) => product.imagePath)).size).toBe(products.length);
    expect(
      products.every((product) => {
        const fileName = product.imagePath.split("/").pop()?.replace(/\.webp$/, "") ?? "";
        return normalize(product.name) === normalize(fileName);
      }),
    ).toBe(true);
  });

  it("usa la imagen riti de productosAyacucho en el encabezado", () => {
    const routeSource = readFileSync(routePath, "utf8");
    const heroImage = "/imagenes-reales/productosAyacucho/riti.png";

    expect(existsSync(resolve(publicPath, heroImage.slice(1)))).toBe(true);
    expect(routeSource).toContain(`src="${heroImage}"`);
  });

  it("encuadra la imagen del encabezado hacia los cerros", () => {
    const routeSource = readFileSync(routePath, "utf8");

    expect(routeSource).toContain("object-[center_35%]");
  });

  it("muestra solo la altitud máxima sobre el nivel del mar en los 20 productos", () => {
    const routeSource = readFileSync(routePath, "utf8");
    const activeCatalog = routeSource.match(
      /const productosPorTemporada: Record<string, Producto\[]> = \{([\s\S]*?)\r?\n\};\r?\n\r?\nfunction/,
    )?.[1] ?? "";
    const products = [
      ...activeCatalog.matchAll(
        /\{\s*nombre:\s*"([^"]+)"[\s\S]*?rangoAltitud:\s*"([^"]+)"/g,
      ),
    ];

    expect(products).toHaveLength(20);
    expect(
      products.every((product) =>
        /^[\d.]+\s*m s\. n\. m\.$/.test(product[2]),
      ),
    ).toBe(true);
  });

  it("muestra la altitud debajo de la temporada con el mismo efecto de aparición", () => {
    const routeSource = readFileSync(routePath, "utf8");
    const title =
      routeSource.match(
        /<h3 className="font-serif text-3xl text-white font-bold mb-1 drop-shadow-md">([\s\S]*?)<\/h3>/,
      )?.[1] ?? "";
    const detailsContainer = routeSource.match(
      /<div className="(transform translate-y-0 opacity-100 md:translate-y-8 md:opacity-0 group-hover:!translate-y-0 group-hover:!opacity-100[^"]*)">([\s\S]*?)<\/div>/,
    );
    const details = detailsContainer?.[2] ?? "";
    const seasonIndex = details.indexOf("Temporada: {producto.meses}");
    const altitudeIndex = details.indexOf("{producto.rangoAltitud}");

    expect(title).toContain("{producto.nombre}");
    expect(title).not.toContain("producto.rangoAltitud");
    expect(seasonIndex).toBeGreaterThanOrEqual(0);
    expect(altitudeIndex).toBeGreaterThan(seasonIndex);
    expect(detailsContainer?.[1]).toContain("group-hover:!opacity-100");
    expect(details).toMatch(
      /<span className="inline-block text-\[11px\] font-bold uppercase tracking-wider text-chilca bg-black\/40 backdrop-blur-sm px-3 py-1\.5 rounded-full border border-white\/10">\s*\{producto\.rangoAltitud\}\s*<\/span>/,
    );
    expect(routeSource).not.toContain("producto.usos.map");
  });
});
