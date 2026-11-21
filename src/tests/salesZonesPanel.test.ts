import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeRestaurantZone } from "../features/zones/api";

const reservasPanel = readFileSync(
  resolve(process.cwd(), "src/routes/panel-reservas.tsx"),
  "utf8",
);
const zonesSql = readFileSync(
  resolve(process.cwd(), "supabase/zones_and_blackouts.sql"),
  "utf8",
);

describe("salones en el panel de ventas", () => {
  it("recupera la imagen oficial cuando una fila de Supabase no tiene URL válida", () => {
    const zone = normalizeRestaurantZone({
      id: "salon-principal",
      name: "Salón Principal",
      short_name: "S. Principal",
      description: "",
      image_url: "",
      color: "#5F8575",
      color_light: "#B0CBBD",
      max_capacity_persons: 13,
      max_tables_count: 8,
      is_active: true,
      sort_order: 1,
    });

    expect(zone.image_url).toBe("/imagenes-reales/Salones/salon-principal.webp");
  });

  it("expone una pestaña Salones que reutiliza la sección del administrador", () => {
    expect(reservasPanel).toMatch(/setActiveTab\("salones"\)/);
    expect(reservasPanel).toMatch(/activeTab === "salones"/);
    expect(reservasPanel).toMatch(/<AdminZonesSection\s*\/>/);
  });

  it("autoriza a ventas a gestionar zonas y apagados", () => {
    expect(zonesSql).toMatch(/role IN \('admin', 'ventas'\)/);
  });

  it("usa nombres de archivos existentes en la migración de zonas", () => {
    expect(zonesSql).toContain("/imagenes-reales/Salones/salon-principal.webp");
    expect(zonesSql).toContain("/imagenes-reales/Salones/estrado-principal.webp");
    expect(zonesSql).not.toContain("/imagenes-reales/Salones/Salonprincipal.webp");
  });
});
