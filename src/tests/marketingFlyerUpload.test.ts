import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteMarketingFlyers,
  getMarketingFlyerSizeValidationError,
  getMarketingFlyerValidationError,
  updateMarketingFlyerSize,
} from "../features/marketing/api";
import { compressImageToWebP } from "../lib/webp-compressor";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const supabaseMocks = vi.hoisted(() => ({
  databaseDeleteFilter: vi.fn(),
  databaseUpdateEq: vi.fn(),
  databaseUpdateSelect: vi.fn(),
  databaseUpdateSingle: vi.fn(),
  from: vi.fn(),
  listStorageObjects: vi.fn(),
  removeStorageObjects: vi.fn(),
  storageFrom: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    from: supabaseMocks.from,
    storage: { from: supabaseMocks.storageFrom },
  },
}));

const marketingMigration = readFileSync(
  resolve(process.cwd(), "supabase/marketing_flyers.sql"),
  "utf8",
);

beforeEach(() => {
  supabaseMocks.databaseDeleteFilter.mockResolvedValue({ error: null });
  supabaseMocks.databaseUpdateSingle.mockResolvedValue({
    data: {
      id: "flyer-id",
      storage_path: "flyer.webp",
      created_at: "2026-11-20T00:00:00.000Z",
      width_cm: 20,
      height_cm: 15,
    },
    error: null,
  });
  supabaseMocks.databaseUpdateSelect.mockReturnValue({
    single: supabaseMocks.databaseUpdateSingle,
  });
  supabaseMocks.databaseUpdateEq.mockReturnValue({
    select: supabaseMocks.databaseUpdateSelect,
  });
  supabaseMocks.from.mockReturnValue({
    delete: () => ({ not: supabaseMocks.databaseDeleteFilter }),
    update: () => ({ eq: supabaseMocks.databaseUpdateEq }),
  });
  supabaseMocks.listStorageObjects.mockResolvedValue({
    data: [{ id: "stored-flyer", name: "flyer.webp" }],
    error: null,
  });
  supabaseMocks.removeStorageObjects.mockResolvedValue({ error: null });
  supabaseMocks.storageFrom.mockReturnValue({
    list: supabaseMocks.listStorageObjects,
    remove: supabaseMocks.removeStorageObjects,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("validación de flyers de Marketing", () => {
  it("actualiza las medidas de un flyer existente", async () => {
    const flyer = await updateMarketingFlyerSize("flyer-id", 20, 15);

    expect(flyer).toMatchObject({
      id: "flyer-id",
      width_cm: 20,
      height_cm: 15,
    });
    expect(supabaseMocks.from).toHaveBeenCalledWith("marketing_flyers");
  });

  it("exige ancho y alto válidos en centímetros", () => {
    expect(getMarketingFlyerSizeValidationError(15, 15)).toBeNull();
    expect(getMarketingFlyerSizeValidationError(20, 15)).toBeNull();
    expect(getMarketingFlyerSizeValidationError(0, 15)).toMatch(/ancho y alto/i);
    expect(getMarketingFlyerSizeValidationError(15, Number.NaN)).toMatch(/ancho y alto/i);
  });

  it("acepta imágenes JPG, PNG y WebP dentro del límite", () => {
    expect(getMarketingFlyerValidationError({ type: "image/jpeg", size: 1024 } as File)).toBeNull();
    expect(getMarketingFlyerValidationError({ type: "image/png", size: 1024 } as File)).toBeNull();
    expect(getMarketingFlyerValidationError({ type: "image/webp", size: 1024 } as File)).toBeNull();
  });

  it("rechaza archivos que no sean imágenes admitidas", () => {
    expect(getMarketingFlyerValidationError({ type: "application/pdf", size: 1024 } as File)).toMatch(
      /JPG, PNG o WebP/,
    );
  });

  it("acepta imágenes grandes para comprimirlas antes de subirlas", () => {
    expect(
      getMarketingFlyerValidationError({ type: "image/png", size: 500 * 1024 * 1024 } as File),
    ).toBeNull();
  });

  it("configura el bucket de flyers sin límite propio de tamaño", () => {
    expect(marketingMigration).toMatch(/'marketing-flyers'[\s\S]*?NULL\s*,/i);
    expect(marketingMigration).toMatch(/file_size_limit\s*=\s*EXCLUDED\.file_size_limit/i);
  });

  it("migra y restringe las medidas del flyer en centímetros", () => {
    expect(marketingMigration).toMatch(/ADD COLUMN IF NOT EXISTS width_cm NUMERIC/i);
    expect(marketingMigration).toMatch(/ADD COLUMN IF NOT EXISTS height_cm NUMERIC/i);
    expect(marketingMigration).toMatch(/width_cm\s*>=\s*1\s+AND\s+width_cm\s*<=\s*200/i);
    expect(marketingMigration).toMatch(/height_cm\s*>=\s*1\s+AND\s+height_cm\s*<=\s*200/i);
  });

  it("permite actualizar las medidas solo a marketing y administradores", () => {
    expect(marketingMigration).toMatch(/marketing_flyers_staff_update/i);
    expect(marketingMigration).toMatch(/FOR UPDATE[\s\S]*?profiles\.role IN \('marketing', 'admin'\)/i);
    expect(marketingMigration).toMatch(/GRANT UPDATE ON public\.marketing_flyers TO authenticated/i);
  });

  it("elimina todos los flyers publicados y sus archivos almacenados", async () => {
    await expect(deleteMarketingFlyers()).resolves.toEqual({ cleanupError: null });

    expect(supabaseMocks.from).toHaveBeenCalledWith("marketing_flyers");
    expect(supabaseMocks.databaseDeleteFilter).toHaveBeenCalledWith("id", "is", null);
    expect(supabaseMocks.storageFrom).toHaveBeenCalledWith("marketing-flyers");
    expect(supabaseMocks.removeStorageObjects).toHaveBeenCalledWith(["flyer.webp"]);
  });

  it("informa si falla la limpieza del archivo tras borrar los registros", async () => {
    const cleanupError = new Error("No se pudo borrar el archivo");
    supabaseMocks.removeStorageObjects.mockResolvedValue({ error: cleanupError });

    await expect(deleteMarketingFlyers()).resolves.toEqual({ cleanupError });
    expect(supabaseMocks.databaseDeleteFilter).toHaveBeenCalled();
  });

  it("falla explícitamente si el navegador no genera una imagen WebP", async () => {
    class MockImage {
      width = 64;
      height = 64;
      onload: (() => void) | null = null;
      onerror: ((event: string | Event) => void) | null = null;

      set src(_value: string) {
        this.onload?.();
      }
    }

    vi.stubGlobal("Image", MockImage);
    vi.stubGlobal("document", {
      createElement: () => ({
        width: 0,
        height: 0,
        getContext: () => ({ drawImage: () => {} }),
        toBlob: (callback: BlobCallback) => callback(new Blob(["not-webp"], { type: "image/png" })),
      }),
    });
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:marketing-flyer");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    await expect(compressImageToWebP({ size: 1, type: "image/png" } as File)).rejects.toThrow(
      /WebP/,
    );
  });
});
