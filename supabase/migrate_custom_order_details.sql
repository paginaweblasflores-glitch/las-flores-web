-- Ejecutar una vez en el proyecto Supabase existente.
-- Luego ejecutar la definición actualizada de create_order_secure en hardening_rls.sql.

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS notes TEXT;
