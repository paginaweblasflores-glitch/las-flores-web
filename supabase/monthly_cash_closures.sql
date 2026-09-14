-- ============================================================================
-- CIERRE MENSUAL DE CAJA — registro inmutable
-- ============================================================================
-- Aplicar en cualquier momento (no depende de los otros scripts de supabase/).
--
-- Guarda, una sola vez por mes, el total cobrado online, los fletes de
-- delivery y la venta neta de ese mes. Se usa desde el botón "Cierre
-- Mensual" del modal de Arqueo de Caja (CashierAuditModal.tsx).
--
-- A propósito NO hay política de UPDATE ni DELETE, y "month" es UNIQUE:
-- una vez creado un cierre no se puede editar ni recalcular desde la app,
-- solo insertar uno nuevo para un mes distinto. La única forma de "reiniciar"
-- un cierre es borrar la fila (o la tabla completa) directamente desde el
-- panel de Supabase.
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.monthly_cash_closures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month TEXT UNIQUE NOT NULL,           -- formato 'YYYY-MM', ej. '2026-08'
    total_online NUMERIC NOT NULL,
    total_delivery_fees NUMERIC NOT NULL,
    total_net NUMERIC NOT NULL,
    order_count INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.monthly_cash_closures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff puede ver cierres mensuales" ON public.monthly_cash_closures;
CREATE POLICY "Staff puede ver cierres mensuales"
ON public.monthly_cash_closures FOR SELECT
TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "Staff puede crear cierres mensuales" ON public.monthly_cash_closures;
CREATE POLICY "Staff puede crear cierres mensuales"
ON public.monthly_cash_closures FOR INSERT
TO authenticated
WITH CHECK (public.is_staff());

COMMIT;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- SELECT * FROM public.monthly_cash_closures ORDER BY month DESC;
