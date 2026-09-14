-- ============================================================================
-- RASTREO DE MOTORIZADO v2: agregar nombre y teléfono del cliente
-- ============================================================================
-- Aplicar DESPUÉS de `driver_tracking_rpc.sql`.
--
-- El motorizado necesita poder llamar al cliente (si hay un problema en el
-- camino, o al llegar al domicilio), así que `get_order_tracking` ahora
-- también entrega client_name y client_phone. El correo del cliente sigue
-- fuera: el motorizado no lo necesita para nada.
-- ============================================================================

BEGIN;

DROP FUNCTION IF EXISTS public.get_order_tracking(UUID);

CREATE OR REPLACE FUNCTION public.get_order_tracking(p_order_id UUID)
RETURNS TABLE (
    id UUID, order_number TEXT, address TEXT, reference TEXT,
    status TEXT, total NUMERIC, payment_method TEXT,
    latitude NUMERIC, longitude NUMERIC, items JSONB,
    client_name TEXT, client_phone TEXT
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    RETURN QUERY
    SELECT o.id, o.order_number, o.address, o.reference, o.status, o.total,
           o.payment_method, o.latitude, o.longitude,
           COALESCE((
             SELECT jsonb_agg(jsonb_build_object(
               'quantity', oi.quantity,
               'product_name', oi.product_name,
               'subtotal', oi.subtotal
             ))
             FROM public.order_items oi WHERE oi.order_id = o.id
           ), '[]'::jsonb) AS items,
           o.client_name, o.client_phone
    FROM public.orders o WHERE o.id = p_order_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(UUID) TO anon, authenticated;

COMMIT;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- SELECT * FROM public.get_order_tracking('<uuid-de-un-pedido>');
