/**
 * Converts browser-decodable images into optimized WebP blobs in-browser.
 */
export async function compressImageToWebP(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.72,
): Promise<{ blob: Blob; originalSizeKb: number; compressedSizeKb: number }> {
  return new Promise((resolve, reject) => {
    const originalSizeKb = Math.round(file.size / 1024);
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    const releaseImageUrl = () => URL.revokeObjectURL(imageUrl);

    image.onload = () => {
      releaseImageUrl();
      try {
        const canvas = document.createElement("canvas");
        const sourceWidth = image.naturalWidth || image.width;
        const sourceHeight = image.naturalHeight || image.height;
        if (sourceWidth <= 0 || sourceHeight <= 0) {
          reject(new Error("La imagen no tiene dimensiones válidas."));
          return;
        }

        const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
        const width = Math.max(1, Math.round(sourceWidth * scale));
        const height = Math.max(1, Math.round(sourceHeight * scale));
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo preparar la imagen para comprimirla."));
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.type !== "image/webp" || blob.size === 0) {
              reject(new Error("El navegador no pudo convertir la imagen a WebP."));
              return;
            }

            resolve({
              blob,
              originalSizeKb,
              compressedSizeKb: Math.round(blob.size / 1024),
            });
          },
          "image/webp",
          quality,
        );
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => {
      releaseImageUrl();
      reject(new Error("No se pudo abrir la imagen seleccionada."));
    };

    image.src = imageUrl;
  });
}

/**
 * Convierte una imagen ya comprimida en una URL de datos. Solo se usa como respaldo cuando no se puede
 * subir el archivo a Supabase Storage, para que la pantalla siga funcionando como antes.
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(blob);
  });
}
