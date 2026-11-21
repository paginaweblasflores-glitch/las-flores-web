BEGIN;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('client', 'staff', 'cashier', 'admin', 'ventas', 'delivery', 'marketing'));

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(email) = 'marketing@gmail.com'
  ) THEN
    UPDATE public.profiles
    SET role = 'marketing'
    WHERE lower(email) = 'marketing@gmail.com';
  ELSE
    RAISE NOTICE 'Crea primero marketing@gmail.com en Supabase Auth y luego asigna role=marketing en public.profiles.';
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.marketing_flyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  width_cm NUMERIC,
  height_cm NUMERIC
);

ALTER TABLE public.marketing_flyers
  ADD COLUMN IF NOT EXISTS width_cm NUMERIC;
ALTER TABLE public.marketing_flyers
  ADD COLUMN IF NOT EXISTS height_cm NUMERIC;

UPDATE public.marketing_flyers
SET width_cm = 15
WHERE width_cm IS NULL;

UPDATE public.marketing_flyers
SET height_cm = 15
WHERE height_cm IS NULL;

ALTER TABLE public.marketing_flyers
  ALTER COLUMN width_cm SET DEFAULT 15,
  ALTER COLUMN width_cm SET NOT NULL;
ALTER TABLE public.marketing_flyers
  ALTER COLUMN height_cm SET DEFAULT 15,
  ALTER COLUMN height_cm SET NOT NULL;

ALTER TABLE public.marketing_flyers
  DROP CONSTRAINT IF EXISTS marketing_flyers_width_cm_check;
ALTER TABLE public.marketing_flyers
  ADD CONSTRAINT marketing_flyers_width_cm_check
  CHECK (width_cm >= 1 AND width_cm <= 200);

ALTER TABLE public.marketing_flyers
  DROP CONSTRAINT IF EXISTS marketing_flyers_height_cm_check;
ALTER TABLE public.marketing_flyers
  ADD CONSTRAINT marketing_flyers_height_cm_check
  CHECK (height_cm >= 1 AND height_cm <= 200);

CREATE INDEX IF NOT EXISTS marketing_flyers_created_at_idx
  ON public.marketing_flyers (created_at DESC);

ALTER TABLE public.marketing_flyers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS marketing_flyers_public_read ON public.marketing_flyers;
CREATE POLICY marketing_flyers_public_read
  ON public.marketing_flyers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS marketing_flyers_staff_insert ON public.marketing_flyers;
CREATE POLICY marketing_flyers_staff_insert
  ON public.marketing_flyers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('marketing', 'admin')
    )
  );

DROP POLICY IF EXISTS marketing_flyers_staff_update ON public.marketing_flyers;
CREATE POLICY marketing_flyers_staff_update
  ON public.marketing_flyers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('marketing', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('marketing', 'admin')
    )
  );

DROP POLICY IF EXISTS marketing_flyers_staff_delete ON public.marketing_flyers;
CREATE POLICY marketing_flyers_staff_delete
  ON public.marketing_flyers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('marketing', 'admin')
    )
  );

REVOKE INSERT, UPDATE, DELETE ON public.marketing_flyers FROM anon, authenticated;
GRANT SELECT ON public.marketing_flyers TO anon, authenticated;
GRANT INSERT ON public.marketing_flyers TO authenticated;
GRANT UPDATE ON public.marketing_flyers TO authenticated;
GRANT DELETE ON public.marketing_flyers TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketing-flyers',
  'marketing-flyers',
  true,
  NULL,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS marketing_flyers_public_storage_read ON storage.objects;
CREATE POLICY marketing_flyers_public_storage_read
  ON storage.objects FOR SELECT
  USING (bucket_id = 'marketing-flyers');

DROP POLICY IF EXISTS marketing_flyers_staff_storage_insert ON storage.objects;
CREATE POLICY marketing_flyers_staff_storage_insert
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'marketing-flyers'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('marketing', 'admin')
    )
  );

DROP POLICY IF EXISTS marketing_flyers_staff_storage_delete ON storage.objects;
CREATE POLICY marketing_flyers_staff_storage_delete
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'marketing-flyers'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('marketing', 'admin')
    )
  );

COMMIT;
