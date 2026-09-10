-- Ejecutar una vez en el proyecto Supabase existente.
-- Conserva el precio seleccionado y la descripción de personalizaciones.

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS notes TEXT;

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
  v_prod_name TEXT;
  v_custom_name TEXT;
  v_custom_notes TEXT;
  v_available BOOLEAN;
  v_pin TEXT;
  v_coupon_res RECORD;
BEGIN
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'El pedido no contiene ítems.';
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

    SELECT name, price, is_available
      INTO v_prod_name, v_price, v_available
      FROM public.products WHERE id = v_product_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Producto % no encontrado.', v_product_id; END IF;
    IF NOT v_available THEN RAISE EXCEPTION 'El producto "%" no está disponible.', v_prod_name; END IF;

    v_price := COALESCE((v_item->>'unit_price')::NUMERIC, v_price);
    IF v_price < 0 THEN RAISE EXCEPTION 'Precio inválido para el producto "%".', v_prod_name; END IF;
    v_subtotal := v_subtotal + (v_price * v_quantity);
  END LOOP;

  IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) <> '' THEN
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

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'id')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    SELECT name, price INTO v_prod_name, v_price
      FROM public.products WHERE id = v_product_id;
    v_price := COALESCE((v_item->>'unit_price')::NUMERIC, v_price);
    v_custom_name := NULLIF(TRIM(v_item->>'product_name'), '');
    v_custom_notes := NULLIF(TRIM(v_item->>'notes'), '');

    INSERT INTO public.order_items
      (order_id, product_id, product_name, unit_price, quantity, subtotal, notes)
    VALUES
      (v_order_id, v_product_id, COALESCE(v_custom_name, v_prod_name), v_price,
       v_quantity, v_price * v_quantity, v_custom_notes);
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

GRANT EXECUTE ON FUNCTION public.create_order_secure TO anon, authenticated;
