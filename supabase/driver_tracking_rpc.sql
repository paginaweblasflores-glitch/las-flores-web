-- ============================================================================
-- RASTREO DE MOTORIZADO: platos + actualización de estado por enlace público
-- ============================================================================
-- Aplicar DESPUÉS de `hardening_rls.sql`.
--
-- `get_order_tracking` ya exponía los campos mínimos para el enlace de
-- rastreo (id, order_number, address, reference, status, total), pero la
-- página del motorizado (src/routes/d/$orderId.tsx) también necesita los
-- platos de la comanda, el método de pago (para saber si cobra en efectivo)
-- y las coordenadas (para los botones de Google Maps / Waze). Se agregan
-- aquí sin tocar nombre, correo ni teléfono del cliente — eso sigue oculto,
-- tal como lo dejó `hardening_rls.sql`.
--
-- Tampoco existía ninguna forma segura de que el motorizado (sin sesión)
-- actualizara el estado del pedido: la única política de UPDATE sobre
-- `orders` exige `is_staff()`. Se agrega `update_order_status_driver`, que
-- vuelve a verificar el PIN en el servidor antes de mover el pedido — igual
-- que ya hace `verify_driver_pin` — en vez de abrir el UPDATE a cualquiera.
-- ============================================================================

BEGIN;

-- CREATE OR REPLACE no permite cambiar las columnas de retorno de una
-- función existente; hay que soltarla primero.
DROP FUNCTION IF EXISTS public.get_order_tracking(UUID);

CREATE OR REPLACE FUNCTION public.get_order_tracking(p_order_id UUID)
RETURNS TABLE (
    id UUID, order_number TEXT, address TEXT, reference TEXT,
    status TEXT, total NUMERIC, payment_method TEXT,
    latitude NUMERIC, longitude NUMERIC, items JSONB
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
           ), '[]'::jsonb) AS items
    FROM public.orders o WHERE o.id = p_order_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(UUID) TO anon, authenticated;

-- Actualiza el estado del pedido solo si el PIN corresponde a ese pedido,
-- y solo hacia uno de los 3 estados que el motorizado puede disparar desde
-- la página de rastreo (nunca "entregado" -> "pendiente", ni tocar otras
-- columnas).
CREATE OR REPLACE FUNCTION public.update_order_status_driver(
    p_order_id UUID, p_pin TEXT, p_new_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_valid BOOLEAN;
BEGIN
    IF p_new_status NOT IN ('en_preparacion', 'en_camino', 'entregado') THEN
        RETURN FALSE;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.driver_pins
        WHERE order_id = p_order_id AND pin_code = TRIM(p_pin)
    ) INTO v_valid;

    IF NOT v_valid THEN
        RETURN FALSE;
    END IF;

    UPDATE public.orders SET status = p_new_status WHERE id = p_order_id;
    RETURN TRUE;
END;
$$;
GRANT EXECUTE ON FUNCTION public.update_order_status_driver(UUID, TEXT, TEXT) TO anon, authenticated;

COMMIT;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- SELECT * FROM public.get_order_tracking('<uuid-de-un-pedido>');
-- SELECT public.update_order_status_driver('<uuid>', '<pin-de-driver_pins>', 'en_camino');
