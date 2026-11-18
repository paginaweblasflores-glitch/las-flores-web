import { supabase } from "../../lib/supabase";
import { compressImageToWebP } from "../../lib/webp-compressor";

const MARKETING_FLYERS_BUCKET = "marketing-flyers";
const ALLOWED_FLYER_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export interface MarketingFlyer {
  id: string;
  storage_path: string;
  created_at: string;
}

function isMarketingFlyer(value: unknown): value is MarketingFlyer {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.storage_path === "string" &&
    typeof record.created_at === "string"
  );
}

export function getMarketingFlyerValidationError(file: Pick<File, "type">): string | null {
  if (!ALLOWED_FLYER_TYPES.has(file.type)) {
    return "El flyer debe ser una imagen JPG, PNG o WebP.";
  }
  return null;
}

export function getMarketingFlyerPublicUrl(storagePath: string): string {
  return supabase.storage.from(MARKETING_FLYERS_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

export async function getLatestMarketingFlyer(): Promise<MarketingFlyer | null> {
  const { data, error } = await supabase
    .from("marketing_flyers")
    .select("id, storage_path, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (data === null) return null;
  if (!isMarketingFlyer(data)) {
    throw new Error("La respuesta del flyer no tiene el formato esperado.");
  }
  return data;
}

export async function uploadMarketingFlyer(file: File): Promise<MarketingFlyer> {
  const validationError = getMarketingFlyerValidationError(file);
  if (validationError) throw new Error(validationError);

  const compressed = await compressImageToWebP(file, 1440, 1800, 0.72);
  const storagePath = `${crypto.randomUUID()}.webp`;
  const storage = supabase.storage.from(MARKETING_FLYERS_BUCKET);
  const { data: uploadedFile, error: uploadError } = await storage.upload(
    storagePath,
    compressed.blob,
    { contentType: "image/webp", upsert: false },
  );

  if (uploadError) throw uploadError;

  try {
    const { data, error } = await supabase
      .from("marketing_flyers")
      .insert({ storage_path: uploadedFile.path })
      .select("id, storage_path, created_at")
      .single();

    if (error) throw error;
    if (!isMarketingFlyer(data)) {
      throw new Error("No se pudo confirmar el registro del flyer.");
    }
    return data;
  } catch (error) {
    const { error: cleanupError } = await storage.remove([uploadedFile.path]);
    if (cleanupError) {
      console.error(
        "No se pudo limpiar el archivo tras fallar el registro del flyer.",
        cleanupError,
      );
    }
    throw error;
  }
}
