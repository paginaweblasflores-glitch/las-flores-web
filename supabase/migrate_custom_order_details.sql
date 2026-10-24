-- Ejecutar una vez en el proyecto Supabase existente.
-- Conserva el precio seleccionado y la descripción de personalizaciones.

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS custom_options JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.products
SET custom_options = CASE
  WHEN name ILIKE '%filet%mignon%' THEN $options$[
    {"id": "carbohidrato", "title": "1. Carbohidrato", "options": [
      {"id": "papas_fritas_francesas", "name": "Papas fritas francesas", "price": 0},
      {"id": "papas_salteadas_mantequilla", "name": "Papas salteadas en mantequilla", "price": 0}
    ]},
    {"id": "ensalada", "title": "2. Ensalada", "options": [
      {"id": "ensalada_organica", "name": "Ensalada orgánica", "price": 0},
      {"id": "ensalada_sancochada", "name": "Ensalada sancochada", "price": 0}
    ]}
  ]$options$::jsonb
  WHEN name ILIKE '%espagueti%pesto%' THEN $options$[
    {"id": "proteina", "title": "1. Proteína", "options": [
      {"id": "milanesa", "name": "Milanesa", "price": 42},
      {"id": "pollo_grill", "name": "Pollo al grill", "price": 40},
      {"id": "filet_mignon", "name": "Filet mignon", "price": 46}
    ]}
  ]$options$::jsonb
  WHEN (name ILIKE '%fetuchini%' OR name ILIKE '%fetuccini%' OR name ILIKE '%fettuccini%')
    AND (name ILIKE '%huancaina%' OR name ILIKE '%huancaína%') THEN $options$[
    {"id": "1._proteína", "title": "1. Proteína", "options": [
      {"id": "pollo_grill", "name": "Pollo al grill", "price": 40},
      {"id": "lomo_saltado", "name": "Lomo saltado", "price": 44}
    ]}
  ]$options$::jsonb
  WHEN name ILIKE '%cuy las flores%deshuesado%' THEN $options$[
    {"id": "tamano", "title": "1. Tamaño", "options": [
      {"id": "medio_cuy", "name": "Medio cuy", "price": 42},
      {"id": "cuy_entero", "name": "Cuy entero", "price": 72}
    ]}
  ]$options$::jsonb
  WHEN name ILIKE '%cuy las flores%' THEN $options$[
    {"id": "tamano", "title": "1. Tamaño", "options": [
      {"id": "medio_cuy", "name": "Medio cuy", "price": 38},
      {"id": "cuy_entero", "name": "Cuy entero", "price": 68}
    ]}
  ]$options$::jsonb
  WHEN name ILIKE '%mixto%' THEN $options$[
    {"id": "1._tipo", "title": "1. Tipo", "options": [
      {"id": "mixto_clasico", "name": "Clásico", "price": 52},
      {"id": "mixto_deshuesado", "name": "Deshuesado", "price": 58}
    ]}
  ]$options$::jsonb
  ELSE custom_options
END
WHERE custom_options IS NULL OR custom_options = '[]'::jsonb;

CREATE OR REPLACE FUNCTION public.prevent_staff_custom_options_edits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin()
     AND NEW.custom_options IS DISTINCT FROM OLD.custom_options THEN
    RAISE EXCEPTION 'Solo los administradores pueden cambiar las opciones de personalización';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_custom_options_admin_only ON public.products;
CREATE TRIGGER products_custom_options_admin_only
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_staff_custom_options_edits();

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT,
  ADD COLUMN IF NOT EXISTS culqi_charge_id TEXT,
  ADD COLUMN IF NOT EXISTS checkout_attempt_id UUID;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('yape', 'card', 'cash', 'culqi', 'efectivo'));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orders_payment_status_check'
      AND conrelid = 'public.orders'::regclass
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_payment_status_check
      CHECK (payment_status IS NULL OR payment_status IN ('pending', 'paid', 'failed'));
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_attempt_id_idx
  ON public.orders(checkout_attempt_id) WHERE checkout_attempt_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS orders_culqi_charge_id_idx
  ON public.orders(culqi_charge_id) WHERE culqi_charge_id IS NOT NULL;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_insert_any" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_authenticated_or_rpc" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_via_rpc_only" ON public.orders;
CREATE POLICY "orders_insert_via_rpc_only" ON public.orders FOR INSERT
  WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.prevent_unverified_card_payment_edits()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF (
        NEW.payment_method IS DISTINCT FROM OLD.payment_method OR
        NEW.payment_status IS DISTINCT FROM OLD.payment_status OR
        NEW.culqi_charge_id IS DISTINCT FROM OLD.culqi_charge_id OR
        NEW.checkout_attempt_id IS DISTINCT FROM OLD.checkout_attempt_id
    ) AND COALESCE(auth.role(), '') <> 'service_role' THEN
        RAISE EXCEPTION 'Solo el servicio de pagos puede modificar el estado de pago.';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_payment_fields_service_only ON public.orders;
CREATE TRIGGER orders_payment_fields_service_only
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_unverified_card_payment_edits();

CREATE OR REPLACE FUNCTION public.create_order_secure(
  p_client_name TEXT, p_client_email TEXT, p_client_phone TEXT,
  p_order_type TEXT, p_payment_method TEXT,
  p_items JSONB,
  p_address TEXT DEFAULT NULL, p_reference TEXT DEFAULT NULL,
  p_latitude NUMERIC DEFAULT NULL, p_longitude NUMERIC DEFAULT NULL,
  p_distance_km NUMERIC DEFAULT 0, p_delivery_fee NUMERIC DEFAULT 0,
  p_coupon_code TEXT DEFAULT NULL, p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_order_id UUID := gen_random_uuid();
  v_tracking UUID := gen_random_uuid();
  v_order_number TEXT;
  v_user_id UUID := auth.uid();
  v_subtotal NUMERIC(10,2) := 0;
  v_discount NUMERIC(10,2) := 0;
  v_fee NUMERIC(10,2) := 0;
  v_total NUMERIC(10,2) := 0;
  v_item JSONB;
  v_product_id UUID;
  v_quantity INT;
  v_price NUMERIC(10,2);
  v_custom_options JSONB;
  v_option_price NUMERIC(10,2);
  v_prod_name TEXT;
  v_custom_name TEXT;
  v_custom_notes TEXT;
  v_available BOOLEAN;
  v_customization RECORD;
  v_priced_items JSONB := '[]'::jsonb;
  v_item_count INT;
  v_pin TEXT;
  v_coupon_res RECORD;
BEGIN
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'El pedido no contiene ítems válidos.';
  END IF;

  IF p_order_type IS NULL OR p_order_type NOT IN ('delivery', 'pickup') THEN
    RAISE EXCEPTION 'Tipo de pedido inválido.';
  END IF;
  IF p_payment_method IS NULL OR p_payment_method NOT IN ('yape', 'cash', 'efectivo') THEN
    RAISE EXCEPTION 'Método de pago inválido.';
  END IF;

  v_item_count := jsonb_array_length(p_items);
  IF v_item_count > 100 THEN
    RAISE EXCEPTION 'El pedido contiene demasiados ítems.';
  END IF;

  v_order_number := 'LF-' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0');
  v_fee := CASE
    WHEN p_order_type = 'delivery' THEN public.calculate_delivery_fee(p_latitude, p_longitude)
    ELSE 0
  END;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'id')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    IF v_quantity IS NULL OR v_quantity <= 0 OR v_quantity > 99 THEN
      RAISE EXCEPTION 'Cantidad inválida.';
    END IF;

    SELECT name, price, custom_options, is_available
      INTO v_prod_name, v_price, v_custom_options, v_available
      FROM public.products WHERE id = v_product_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Producto % no encontrado.', v_product_id; END IF;
    IF NOT v_available THEN RAISE EXCEPTION 'El producto "%" no está disponible.', v_prod_name; END IF;

    IF v_item ? 'customizations' AND jsonb_typeof(v_item->'customizations') <> 'object' THEN
      RAISE EXCEPTION 'Personalización inválida para el producto "%".', v_prod_name;
    END IF;
    FOR v_customization IN
      SELECT key, value
      FROM jsonb_each_text(COALESCE(v_item->'customizations', '{}'::jsonb))
    LOOP
      SELECT (custom_option.option_data->>'price')::NUMERIC
        INTO v_option_price
        FROM jsonb_array_elements(COALESCE(v_custom_options, '[]'::jsonb)) AS section(section_data)
        CROSS JOIN LATERAL jsonb_array_elements(section.section_data->'options') AS custom_option(option_data)
       WHERE section.section_data->>'id' = v_customization.key
         AND custom_option.option_data->>'id' = v_customization.value;
      IF NOT FOUND OR v_option_price IS NULL OR v_option_price < 0 THEN
        RAISE EXCEPTION 'Opción de personalización inválida para el producto "%".', v_prod_name;
      END IF;
      IF v_option_price > 0 THEN
        v_price := v_option_price;
      END IF;
    END LOOP;
    v_custom_name := NULLIF(TRIM(v_item->>'product_name'), '');
    v_custom_notes := NULLIF(TRIM(v_item->>'notes'), '');
    IF v_price < 0 THEN RAISE EXCEPTION 'Precio inválido para el producto "%".', v_prod_name; END IF;
    v_subtotal := v_subtotal + (v_price * v_quantity);
    v_priced_items := v_priced_items || jsonb_build_array(jsonb_build_object(
      'id', v_product_id,
      'quantity', v_quantity,
      'product_name', COALESCE(v_custom_name, v_prod_name),
      'notes', v_custom_notes,
      'price', v_price
    ));
  END LOOP;

  IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) <> '' THEN
    PERFORM 1 FROM public.coupons
     WHERE UPPER(code) = UPPER(TRIM(p_coupon_code))
     FOR UPDATE;
    SELECT * INTO v_coupon_res FROM public.apply_coupon_secure(p_coupon_code, v_subtotal);
    IF v_coupon_res.valid THEN
      v_discount := v_coupon_res.discount_amount;
      UPDATE public.coupons SET current_uses = current_uses + 1
        WHERE UPPER(code) = UPPER(TRIM(p_coupon_code));
    END IF;
  END IF;

  v_total := GREATEST(0, v_subtotal - v_discount + v_fee);

  INSERT INTO public.orders (
    id, order_number, tracking_token, user_id, order_type,
    client_name, client_email, client_phone, address, reference,
    latitude, longitude, distance_km, subtotal, discount_amount,
    coupon_code, delivery_fee, total, payment_method, status, notes
  ) VALUES (
    v_order_id, v_order_number, v_tracking, v_user_id, p_order_type,
    p_client_name, p_client_email, p_client_phone, p_address, p_reference,
    p_latitude, p_longitude, p_distance_km, v_subtotal, v_discount,
    p_coupon_code, v_fee, v_total, p_payment_method, 'received', p_notes
  );

  FOR v_item IN SELECT * FROM jsonb_array_elements(v_priced_items) LOOP
    v_product_id := (v_item->>'id')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    v_price := (v_item->>'price')::NUMERIC;

    INSERT INTO public.order_items
      (order_id, product_id, product_name, unit_price, quantity, subtotal, notes)
    VALUES
      (v_order_id, v_product_id, v_item->>'product_name', v_price,
       v_quantity, v_price * v_quantity, v_item->>'notes');
  END LOOP;

  v_pin := LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0');
  INSERT INTO public.driver_pins (order_id, pin_code) VALUES (v_order_id, v_pin);

  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'tracking_token', v_tracking,
    'subtotal', v_subtotal,
    'discount_amount', v_discount,
    'delivery_fee', v_fee,
    'total', v_total,
    'status', 'received'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_secure FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_order_secure TO authenticated;

CREATE OR REPLACE FUNCTION public.create_pending_card_order(
    p_checkout_attempt_id UUID, p_user_id UUID,
    p_client_name TEXT, p_client_email TEXT, p_client_phone TEXT,
    p_order_type TEXT, p_items JSONB,
    p_address TEXT DEFAULT NULL, p_reference TEXT DEFAULT NULL,
    p_latitude NUMERIC DEFAULT NULL, p_longitude NUMERIC DEFAULT NULL,
    p_coupon_code TEXT DEFAULT NULL, p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_existing RECORD;
    v_order_id UUID := gen_random_uuid();
    v_tracking UUID := gen_random_uuid();
    v_order_number TEXT;
    v_subtotal NUMERIC(10,2) := 0;
    v_discount NUMERIC(10,2) := 0;
    v_fee NUMERIC(10,2) := 0;
    v_total NUMERIC(10,2) := 0;
    v_distance NUMERIC(5,2) := 0;
    v_item JSONB;
    v_priced_items JSONB := '[]'::jsonb;
    v_product_id UUID;
    v_quantity INT;
    v_price NUMERIC(10,2);
    v_custom_options JSONB;
    v_option_price NUMERIC(10,2);
    v_product_name TEXT;
    v_available BOOLEAN;
    v_custom_name TEXT;
    v_custom_notes TEXT;
    v_customization RECORD;
    v_coupon RECORD;
    v_coupon_code TEXT;
    v_pin TEXT;
BEGIN
    IF p_checkout_attempt_id IS NULL OR p_user_id IS NULL THEN
        RAISE EXCEPTION 'El intento de pago y el usuario son obligatorios.';
    END IF;

    PERFORM pg_advisory_xact_lock(hashtext(p_checkout_attempt_id::TEXT)::BIGINT);
    SELECT id, user_id, order_number, payment_status, subtotal, discount_amount,
           delivery_fee, total
      INTO v_existing
      FROM public.orders
     WHERE checkout_attempt_id = p_checkout_attempt_id
     FOR UPDATE;
    IF FOUND THEN
        IF v_existing.user_id IS DISTINCT FROM p_user_id THEN
            RAISE EXCEPTION 'El intento de pago no pertenece a este usuario.';
        END IF;
        RETURN jsonb_build_object(
            'created', FALSE, 'order_id', v_existing.id,
            'order_number', v_existing.order_number,
            'payment_status', v_existing.payment_status,
            'subtotal', v_existing.subtotal, 'discount_amount', v_existing.discount_amount,
            'delivery_fee', v_existing.delivery_fee, 'total', v_existing.total
        );
    END IF;

    IF p_order_type IS NULL OR p_order_type NOT IN ('delivery', 'pickup') THEN
        RAISE EXCEPTION 'Tipo de pedido inválido.';
    END IF;
    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array'
       OR jsonb_array_length(p_items) = 0 OR jsonb_array_length(p_items) > 100 THEN
        RAISE EXCEPTION 'El pedido no contiene ítems válidos.';
    END IF;

    IF p_order_type = 'delivery' THEN
        IF p_latitude IS NULL OR p_longitude IS NULL THEN
            RAISE EXCEPTION 'Falta la ubicación de entrega.';
        END IF;
        v_distance := ROUND((
            2 * 6371 * ASIN(SQRT(
                POWER(SIN(RADIANS(p_latitude - (-13.1628496)) / 2), 2) +
                COS(RADIANS(-13.1628496)) * COS(RADIANS(p_latitude)) *
                POWER(SIN(RADIANS(p_longitude - (-74.2178801)) / 2), 2)
            ))
        )::NUMERIC, 2);
        v_fee := public.calculate_delivery_fee(p_latitude, p_longitude);
    END IF;

    FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
        v_product_id := (v_item->>'id')::UUID;
        v_quantity := (v_item->>'quantity')::INT;
        IF v_quantity IS NULL OR v_quantity <= 0 OR v_quantity > 99 THEN
            RAISE EXCEPTION 'Cantidad inválida.';
        END IF;
        SELECT name, price, custom_options, is_available
          INTO v_product_name, v_price, v_custom_options, v_available
          FROM public.products WHERE id = v_product_id;
        IF NOT FOUND THEN RAISE EXCEPTION 'Producto % no encontrado.', v_product_id; END IF;
        IF NOT v_available THEN RAISE EXCEPTION 'El producto "%" no está disponible.', v_product_name; END IF;
        IF v_item ? 'customizations' AND jsonb_typeof(v_item->'customizations') <> 'object' THEN
            RAISE EXCEPTION 'Personalización inválida para el producto "%".', v_product_name;
        END IF;
        FOR v_customization IN
            SELECT key, value FROM jsonb_each_text(COALESCE(v_item->'customizations', '{}'::jsonb))
        LOOP
            SELECT (option_data->>'price')::NUMERIC
              INTO v_option_price
              FROM jsonb_array_elements(COALESCE(v_custom_options, '[]'::jsonb)) AS section(section_data)
              CROSS JOIN LATERAL jsonb_array_elements(section.section_data->'options') AS custom_option(option_data)
             WHERE section.section_data->>'id' = v_customization.key
               AND custom_option.option_data->>'id' = v_customization.value;
            IF NOT FOUND OR v_option_price IS NULL OR v_option_price < 0 THEN
                RAISE EXCEPTION 'Opción de personalización inválida para el producto "%".', v_product_name;
            END IF;
            IF v_option_price > 0 THEN v_price := v_option_price; END IF;
        END LOOP;

        v_custom_name := NULLIF(TRIM(v_item->>'product_name'), '');
        v_custom_notes := NULLIF(TRIM(v_item->>'notes'), '');
        IF v_price < 0 THEN RAISE EXCEPTION 'Precio inválido para el producto "%".', v_product_name; END IF;
        v_subtotal := v_subtotal + v_price * v_quantity;
        v_priced_items := v_priced_items || jsonb_build_array(jsonb_build_object(
            'id', v_product_id, 'quantity', v_quantity,
            'product_name', COALESCE(v_custom_name, v_product_name),
            'notes', v_custom_notes, 'price', v_price
        ));
    END LOOP;

    IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) <> '' THEN
        PERFORM 1 FROM public.coupons
         WHERE UPPER(code) = UPPER(TRIM(p_coupon_code))
         FOR UPDATE;
        SELECT * INTO v_coupon FROM public.apply_coupon_secure(p_coupon_code, v_subtotal);
        IF v_coupon.valid THEN
            v_discount := v_coupon.discount_amount;
            v_coupon_code := p_coupon_code;
            UPDATE public.coupons SET current_uses = current_uses + 1
             WHERE UPPER(code) = UPPER(TRIM(p_coupon_code));
        END IF;
    END IF;
    v_total := GREATEST(0, v_subtotal - v_discount + v_fee);
    v_order_number := 'LF-' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0');

    INSERT INTO public.orders (
        id, order_number, tracking_token, user_id, order_type,
        client_name, client_email, client_phone, address, reference,
        latitude, longitude, distance_km, subtotal, discount_amount, coupon_code,
        delivery_fee, total, payment_method, payment_status, checkout_attempt_id,
        status, notes
    ) VALUES (
        v_order_id, v_order_number, v_tracking, p_user_id, p_order_type,
        p_client_name, p_client_email, p_client_phone, p_address, p_reference,
        p_latitude, p_longitude, v_distance, v_subtotal, v_discount, v_coupon_code,
        v_fee, v_total, 'card', 'pending', p_checkout_attempt_id, 'received', p_notes
    );

    FOR v_item IN SELECT value FROM jsonb_array_elements(v_priced_items) LOOP
        INSERT INTO public.order_items
          (order_id, product_id, product_name, unit_price, quantity, subtotal, notes)
        VALUES (
          v_order_id, (v_item->>'id')::UUID, v_item->>'product_name',
          (v_item->>'price')::NUMERIC, (v_item->>'quantity')::INT,
          (v_item->>'price')::NUMERIC * (v_item->>'quantity')::INT, v_item->>'notes'
        );
    END LOOP;

    v_pin := LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0');
    INSERT INTO public.driver_pins (order_id, pin_code) VALUES (v_order_id, v_pin);
    RETURN jsonb_build_object(
        'created', TRUE, 'order_id', v_order_id, 'order_number', v_order_number,
        'payment_status', 'pending', 'subtotal', v_subtotal,
        'discount_amount', v_discount, 'delivery_fee', v_fee, 'total', v_total
    );
END;
$$;
REVOKE ALL ON FUNCTION public.create_pending_card_order(UUID, UUID, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, NUMERIC, NUMERIC, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_pending_card_order(UUID, UUID, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, NUMERIC, NUMERIC, TEXT, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.complete_card_order_payment(
    p_order_id UUID, p_checkout_attempt_id UUID, p_charge_id TEXT,
    p_amount INTEGER, p_currency_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_order RECORD;
BEGIN
    SELECT id, order_number, payment_status, culqi_charge_id, total,
           subtotal, discount_amount, delivery_fee
      INTO v_order
      FROM public.orders
     WHERE id = p_order_id AND checkout_attempt_id = p_checkout_attempt_id
     FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'No se encontró el intento de pago.'; END IF;
    IF p_charge_id IS NULL OR p_currency_code IS DISTINCT FROM 'PEN'
       OR p_amount IS DISTINCT FROM ROUND(v_order.total * 100)::INTEGER THEN
        RAISE EXCEPTION 'El cargo verificado no coincide con el pedido.';
    END IF;
    IF v_order.payment_status = 'paid' AND v_order.culqi_charge_id = p_charge_id THEN
        RETURN jsonb_build_object(
            'order_id', v_order.id, 'order_number', v_order.order_number,
            'payment_status', 'paid', 'subtotal', v_order.subtotal,
            'discount_amount', v_order.discount_amount, 'delivery_fee', v_order.delivery_fee,
            'total', v_order.total
        );
    END IF;
    IF v_order.payment_status IS DISTINCT FROM 'pending' THEN
        RAISE EXCEPTION 'El intento de pago ya no está pendiente.';
    END IF;
    UPDATE public.orders
       SET payment_status = 'paid', culqi_charge_id = p_charge_id
     WHERE id = p_order_id AND checkout_attempt_id = p_checkout_attempt_id;
    RETURN jsonb_build_object(
        'order_id', v_order.id, 'order_number', v_order.order_number,
        'payment_status', 'paid', 'subtotal', v_order.subtotal,
        'discount_amount', v_order.discount_amount, 'delivery_fee', v_order.delivery_fee,
        'total', v_order.total
    );
END;
$$;
REVOKE ALL ON FUNCTION public.complete_card_order_payment(UUID, UUID, TEXT, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_card_order_payment(UUID, UUID, TEXT, INTEGER, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.fail_card_order_attempt(
    p_checkout_attempt_id UUID, p_failure_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_order RECORD;
BEGIN
    UPDATE public.orders SET payment_status = 'failed'
     WHERE checkout_attempt_id = p_checkout_attempt_id AND payment_status = 'pending'
     RETURNING id, order_number, payment_status, coupon_code INTO v_order;
    IF FOUND THEN
        IF v_order.coupon_code IS NOT NULL AND TRIM(v_order.coupon_code) <> '' THEN
            UPDATE public.coupons SET current_uses = GREATEST(current_uses - 1, 0)
             WHERE UPPER(code) = UPPER(TRIM(v_order.coupon_code));
        END IF;
    ELSE
        SELECT id, order_number, payment_status INTO v_order
          FROM public.orders WHERE checkout_attempt_id = p_checkout_attempt_id;
        IF NOT FOUND THEN RAISE EXCEPTION 'No se encontró el intento de pago.'; END IF;
    END IF;
    RETURN jsonb_build_object(
        'order_id', v_order.id, 'order_number', v_order.order_number,
        'payment_status', v_order.payment_status
    );
END;
$$;
REVOKE ALL ON FUNCTION public.fail_card_order_attempt(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fail_card_order_attempt(UUID, TEXT) TO service_role;

-- ----------------------------------------------------------------------------
