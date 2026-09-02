import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// En Windows (con este build de sharp/libvips), dejar que sharp abra el archivo
// por ruta falla con "UNKNOWN: unknown error, open ..." en cuanto el mismo
// proceso también escribe con fs.writeFileSync más adelante. Leyendo el archivo
// a un Buffer primero y pasándoselo a sharp() se evita el problema por completo.
async function optimizeImage(fullPath) {
  const inputBuffer = fs.readFileSync(fullPath);
  return sharp(inputBuffer)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

async function optimizeDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await optimizeDirectory(fullPath);
    } else if (entry.isFile() && /\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
      const stats = fs.statSync(fullPath);
      if (stats.size > 400 * 1024) { // mayor a 400 KB
        console.log(`Optimizing: ${fullPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

        try {
          const buffer = await optimizeImage(fullPath);
          const savings = 1 - buffer.length / stats.size;
          // Si la ganancia es marginal (<15%), la imagen ya pasó por este mismo
          // proceso antes: reescribirla solo perdería calidad por re-codificación
          // sin bajar peso de verdad, así que la dejamos como está.
          if (savings < 0.15) {
            console.log(`  -> Ya está optimizada (solo ${(savings * 100).toFixed(1)}% de ganancia), se omite.`);
          } else {
            fs.writeFileSync(fullPath, buffer);
            console.log(`  -> New size: ${(buffer.length / 1024).toFixed(1)} KB (Saved ${(savings * 100).toFixed(1)}%)`);
          }
        } catch (err) {
          console.error(`  -> Failed to optimize ${fullPath}:`, err.message);
        }
      }
    }
  }
}

console.log('Starting image batch optimization in memory...');
optimizeDirectory(path.resolve('public')).then(() => console.log('Image batch optimization complete!'));
