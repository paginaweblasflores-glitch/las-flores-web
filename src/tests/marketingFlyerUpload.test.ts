import { afterEach, describe, expect, it, vi } from "vitest";
import { getMarketingFlyerValidationError } from "../features/marketing/api";
import { compressImageToWebP } from "../lib/webp-compressor";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const marketingMigration = readFileSync(
  resolve(process.cwd(), "supabase/marketing_flyers.sql"),
  "utf8",
);

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("validación de flyers de Marketing", () => {
  it("acepta imágenes JPG, PNG y WebP dentro del límite", () => {
    expect(getMarketingFlyerValidationError({ type: "image/jpeg", size: 1024 })).toBeNull();
    expect(getMarketingFlyerValidationError({ type: "image/png", size: 1024 })).toBeNull();
    expect(getMarketingFlyerValidationError({ type: "image/webp", size: 1024 })).toBeNull();
  });

  it("rechaza archivos que no sean imágenes admitidas", () => {
    expect(getMarketingFlyerValidationError({ type: "application/pdf", size: 1024 })).toMatch(
      /JPG, PNG o WebP/,
    );
  });

  it("acepta imágenes grandes para comprimirlas antes de subirlas", () => {
    expect(
      getMarketingFlyerValidationError({ type: "image/png", size: 500 * 1024 * 1024 }),
    ).toBeNull();
  });

  it("configura el bucket de flyers sin límite propio de tamaño", () => {
    expect(marketingMigration).toMatch(/'marketing-flyers'[\s\S]*?NULL\s*,/i);
    expect(marketingMigration).toMatch(/file_size_limit\s*=\s*EXCLUDED\.file_size_limit/i);
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
