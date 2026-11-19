import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { blobToDataUrl } from "../lib/webp-compressor";

const leer = (ruta: string) => readFileSync(resolve(process.cwd(), ruta), "utf8");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("respaldo de las imágenes comprimidas cuando falla la subida a Storage", () => {
  it("convierte la imagen comprimida en una URL de datos", async () => {
    class FakeFileReader {
      result: string | null = null;
      error: Error | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      readAsDataURL(_blob: Blob) {
        this.result = "data:image/webp;base64,AAAA";
        this.onload?.();
      }
    }

    vi.stubGlobal("FileReader", FakeFileReader);

    await expect(blobToDataUrl(new Blob(["x"], { type: "image/webp" }))).resolves.toBe(
      "data:image/webp;base64,AAAA",
    );
  });

  it("informa el error si no se puede leer la imagen", async () => {
    class FailingFileReader {
      result: string | null = null;
      error: Error | null = new Error("sin acceso");
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      readAsDataURL(_blob: Blob) {
        this.onerror?.();
      }
    }

    vi.stubGlobal("FileReader", FailingFileReader);

    await expect(blobToDataUrl(new Blob(["x"]))).rejects.toThrow("sin acceso");
  });

  it("el producto de la carta y el QR de Yape ya no piden un dataUrl que el compresor no devuelve", () => {
    for (const ruta of [
      "src/components/AdminProductModal.tsx",
      "src/components/YapeConfigModal.tsx",
    ]) {
      const fuente = leer(ruta);

      expect(fuente, ruta).not.toContain("compressed.dataUrl");
      expect(fuente, ruta).toContain("blobToDataUrl(compressed.blob)");
    }
  });

  it("el QR de Yape solo genera la URL de datos si no se pudo subir el archivo", () => {
    const fuente = leer("src/components/YapeConfigModal.tsx");

    expect(fuente).toContain("let finalUrl: string | null = null;");
    expect(fuente).toContain("if (!finalUrl) finalUrl = await blobToDataUrl(compressed.blob);");
  });
});
