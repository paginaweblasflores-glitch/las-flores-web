CREATE TABLE IF NOT EXISTS public.salon_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id TEXT NOT NULL REFERENCES public.restaurant_zones(id),
  table_number TEXT NOT NULL CHECK (table_number ~ '^[1-9][0-9]*$'),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  opened_by UUID NOT NULL REFERENCES public.profiles(id),
  closed_by UUID REFERENCES public.profiles(id),
  payment_method TEXT CHECK (payment_method IN ('cash', 'pos')),
  paid_at TIMESTAMPTZ,
  receipt_type TEXT CHECK (receipt_type IN ('boleta', 'factura')),
  receipt_customer_name TEXT,
  receipt_document_number TEXT,
  receipt_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (receipt_status IN ('pending', 'issued', 'failed')),
  receipt_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  CONSTRAINT salon_accounts_close_fields CHECK (
    (status = 'open' AND closed_by IS NULL AND paid_at IS NULL)
    OR (status = 'closed' AND closed_by IS NOT NULL AND paid_at IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS salon_accounts_one_open_per_table
  ON public.salon_accounts(zone_id, table_number)
  WHERE status = 'open';

CREATE TABLE IF NOT EXISTS public.salon_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.salon_accounts(id) ON DELETE CASCADE,
  station TEXT NOT NULL CHECK (station IN ('kitchen', 'bar')),
  waiter_id UUID NOT NULL REFERENCES public.profiles(id),
  waiter_name TEXT NOT NULL,
  request_id UUID NOT NULL,
  print_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (print_status IN ('pending', 'printed', 'failed')),
  print_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (waiter_id, request_id, station)
);

CREATE INDEX IF NOT EXISTS salon_tickets_account_created
  ON public.salon_tickets(account_id, created_at);

CREATE TABLE IF NOT EXISTS public.salon_ticket_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.salon_tickets(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  category_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  customizations JSONB NOT NULL DEFAULT '{}'::JSONB,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS salon_ticket_items_ticket
  ON public.salon_ticket_items(ticket_id);

ALTER TABLE public.salon_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_ticket_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS salon_accounts_staff_read ON public.salon_accounts;
CREATE POLICY salon_accounts_staff_read
  ON public.salon_accounts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND LOWER(p.role) IN ('admin', 'cashier', 'staff')
    )
  );

DROP POLICY IF EXISTS salon_tickets_staff_read ON public.salon_tickets;
CREATE POLICY salon_tickets_staff_read
  ON public.salon_tickets FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND LOWER(p.role) IN ('admin', 'cashier', 'staff')
    )
  );

DROP POLICY IF EXISTS salon_ticket_items_staff_read ON public.salon_ticket_items;
CREATE POLICY salon_ticket_items_staff_read
  ON public.salon_ticket_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND LOWER(p.role) IN ('admin', 'cashier', 'staff')
    )
  );

CREATE OR REPLACE FUNCTION public.submit_salon_ticket(
  p_zone_id TEXT,
  p_table_number TEXT,
  p_items JSONB,
  p_request_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_role TEXT;
  v_zone public.restaurant_zones%ROWTYPE;
  v_account_id UUID;
  v_waiter_name TEXT;
  v_kitchen_ticket_id UUID;
  v_bar_ticket_id UUID;
  v_item JSONB;
  v_product RECORD;
  v_quantity INTEGER;
  v_unit_price NUMERIC(10, 2);
  v_client_price NUMERIC(10, 2);
  v_option_price NUMERIC(10, 2);
  v_section_title TEXT;
  v_option_name TEXT;
  v_customization RECORD;
  v_display_customizations JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión para enviar una comanda.';
  END IF;

  SELECT LOWER(role), COALESCE(NULLIF(TRIM(full_name), ''), NULLIF(TRIM(email), ''), 'Personal')
  INTO v_role, v_waiter_name
  FROM public.profiles
  WHERE id = v_user_id;
  IF v_role IS NULL OR v_role NOT IN ('admin', 'staff') THEN
    RAISE EXCEPTION 'Solo los mozos autorizados pueden enviar comandas.';
  END IF;

  IF p_request_id IS NULL THEN
    RAISE EXCEPTION 'No se pudo identificar la comanda. Intenta nuevamente.';
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Agrega al menos un producto a la comanda.';
  END IF;
  IF jsonb_array_length(p_items) > 100 THEN
    RAISE EXCEPTION 'La comanda contiene demasiados productos.';
  END IF;

  SELECT * INTO v_zone
  FROM public.restaurant_zones
  WHERE id = p_zone_id AND is_active = TRUE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'El salón seleccionado no está disponible.';
  END IF;

  IF p_table_number !~ '^[1-9][0-9]*$'
    OR p_table_number::INTEGER > v_zone.max_tables_count THEN
    RAISE EXCEPTION 'La mesa seleccionada no existe en este salón.';
  END IF;

  INSERT INTO public.salon_accounts (zone_id, table_number, opened_by)
  VALUES (p_zone_id, p_table_number, v_user_id)
  ON CONFLICT (zone_id, table_number) WHERE status = 'open' DO NOTHING
  RETURNING id INTO v_account_id;

  IF v_account_id IS NULL THEN
    SELECT id INTO v_account_id
    FROM public.salon_accounts
    WHERE zone_id = p_zone_id AND table_number = p_table_number AND status = 'open'
    FOR UPDATE;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.salon_tickets
    WHERE waiter_id = v_user_id AND request_id = p_request_id
  ) THEN
    RETURN v_account_id;
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    IF (v_item->>'product_id') IS NULL OR (v_item->>'quantity') !~ '^[1-9][0-9]*$' THEN
      RAISE EXCEPTION 'La comanda contiene un producto o una cantidad inválidos.';
    END IF;

    v_quantity := (v_item->>'quantity')::INTEGER;
    IF v_quantity > 99 THEN
      RAISE EXCEPTION 'La cantidad máxima por producto es 99.';
    END IF;

    SELECT p.id, p.name, p.price, p.custom_options,
      c.name AS category_name, c.slug AS category_slug
    INTO v_product
    FROM public.products p
    LEFT JOIN public.categories c ON c.id = p.category_id
    WHERE p.id = (v_item->>'product_id')::UUID AND p.is_available = TRUE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'El producto "%" ya no está disponible.', COALESCE(v_item->>'product_name', '');
    END IF;

    IF v_item ? 'customizations'
      AND jsonb_typeof(v_item->'customizations') <> 'object' THEN
      RAISE EXCEPTION 'Las opciones seleccionadas para "%" no son válidas.', v_product.name;
    END IF;

    IF jsonb_typeof(v_product.custom_options) = 'array'
      AND jsonb_array_length(v_product.custom_options) > 0
      AND EXISTS (
        SELECT 1
        FROM jsonb_array_elements(v_product.custom_options) AS section(section_data)
        WHERE NOT (
          COALESCE(v_item->'customizations', '{}'::JSONB) ? (section.section_data->>'id')
        )
      ) THEN
      RAISE EXCEPTION 'Faltan opciones obligatorias para "%".', v_product.name;
    END IF;

    v_unit_price := v_product.price;
    v_display_customizations := '{}'::JSONB;
    FOR v_customization IN
      SELECT key, value
      FROM jsonb_each_text(COALESCE(v_item->'customizations', '{}'::JSONB))
    LOOP
      SELECT
        (custom_option.option_data->>'price')::NUMERIC,
        section.section_data->>'title',
        custom_option.option_data->>'name'
      INTO v_option_price, v_section_title, v_option_name
      FROM jsonb_array_elements(COALESCE(v_product.custom_options, '[]'::JSONB))
        AS section(section_data)
      CROSS JOIN LATERAL jsonb_array_elements(section.section_data->'options')
        AS custom_option(option_data)
      WHERE section.section_data->>'id' = v_customization.key
        AND custom_option.option_data->>'id' = v_customization.value;

      IF NOT FOUND OR v_option_price IS NULL OR v_option_price < 0 THEN
        RAISE EXCEPTION 'La opción seleccionada para "%" no es válida.', v_product.name;
      END IF;

      IF v_option_price > 0 THEN
        v_unit_price := v_option_price;
      END IF;

      v_display_customizations := v_display_customizations || jsonb_build_object(
        REGEXP_REPLACE(COALESCE(v_section_title, v_customization.key), '^[0-9]+[.] *', ''),
        v_option_name
      );
    END LOOP;

    v_client_price := NULLIF(v_item->>'unit_price', '')::NUMERIC;
    IF v_client_price IS NULL OR v_client_price <> v_unit_price THEN
      RAISE EXCEPTION 'El precio enviado no coincide con las opciones del catálogo para "%".', v_product.name;
    END IF;

    IF LOWER(COALESCE(v_product.category_slug, '') || ' ' || COALESCE(v_product.category_name, ''))
      LIKE '%bebida%' THEN
      IF v_bar_ticket_id IS NULL THEN
        INSERT INTO public.salon_tickets (account_id, station, waiter_id, waiter_name, request_id)
        VALUES (v_account_id, 'bar', v_user_id, v_waiter_name, p_request_id)
        RETURNING id INTO v_bar_ticket_id;
      END IF;
      INSERT INTO public.salon_ticket_items (
        ticket_id, product_id, product_name, category_name, unit_price, quantity, customizations, notes
      ) VALUES (
        v_bar_ticket_id, v_product.id, v_product.name, COALESCE(v_product.category_name, ''),
        v_unit_price, v_quantity, v_display_customizations,
        NULLIF(v_item->>'notes', '')
      );
    ELSE
      IF v_kitchen_ticket_id IS NULL THEN
        INSERT INTO public.salon_tickets (account_id, station, waiter_id, waiter_name, request_id)
        VALUES (v_account_id, 'kitchen', v_user_id, v_waiter_name, p_request_id)
        RETURNING id INTO v_kitchen_ticket_id;
      END IF;
      INSERT INTO public.salon_ticket_items (
        ticket_id, product_id, product_name, category_name, unit_price, quantity, customizations, notes
      ) VALUES (
        v_kitchen_ticket_id, v_product.id, v_product.name, COALESCE(v_product.category_name, ''),
        v_unit_price, v_quantity, v_display_customizations,
        NULLIF(v_item->>'notes', '')
      );
    END IF;
  END LOOP;

  UPDATE public.salon_accounts a
  SET subtotal = COALESCE((
    SELECT SUM(i.unit_price * i.quantity)
    FROM public.salon_tickets t
    JOIN public.salon_ticket_items i ON i.ticket_id = t.id
    WHERE t.account_id = a.id
  ), 0)
  WHERE a.id = v_account_id;

  RETURN v_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.close_salon_account(
  p_account_id UUID,
  p_payment_method TEXT,
  p_receipt_type TEXT,
  p_receipt_customer_name TEXT DEFAULT NULL,
  p_receipt_document_number TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_role TEXT;
  v_account public.salon_accounts%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión para cerrar una mesa.';
  END IF;

  SELECT LOWER(role) INTO v_role FROM public.profiles WHERE id = v_user_id;
  IF v_role IS NULL OR v_role NOT IN ('admin', 'cashier') THEN
    RAISE EXCEPTION 'Solo caja puede cobrar y cerrar una mesa.';
  END IF;

  IF p_payment_method IS NULL OR p_payment_method NOT IN ('cash', 'pos') THEN
    RAISE EXCEPTION 'Selecciona pago en efectivo o POS físico.';
  END IF;

  IF p_receipt_type IS NULL OR p_receipt_type NOT IN ('boleta', 'factura') THEN
    RAISE EXCEPTION 'Selecciona boleta o factura.';
  END IF;

  SELECT * INTO v_account
  FROM public.salon_accounts
  WHERE id = p_account_id AND status = 'open'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'La cuenta ya fue cerrada o no existe.';
  END IF;

  IF p_receipt_type = 'factura'
    AND COALESCE(NULLIF(TRIM(p_receipt_document_number), ''), '') = '' THEN
    RAISE EXCEPTION 'Ingresa el RUC requerido para la factura.';
  END IF;

  IF p_receipt_type = 'factura'
    AND TRIM(p_receipt_document_number) !~ '^[0-9]{11}$' THEN
    RAISE EXCEPTION 'Ingresa un RUC válido de 11 dígitos.';
  END IF;

  IF p_receipt_type = 'factura'
    AND COALESCE(NULLIF(TRIM(p_receipt_customer_name), ''), '') = '' THEN
    RAISE EXCEPTION 'Ingresa la razón social para la factura.';
  END IF;

  UPDATE public.salon_accounts
  SET status = 'closed',
      closed_by = v_user_id,
      payment_method = p_payment_method,
      paid_at = NOW(),
      receipt_type = p_receipt_type,
      receipt_customer_name = NULLIF(TRIM(p_receipt_customer_name), ''),
      receipt_document_number = NULLIF(TRIM(p_receipt_document_number), ''),
      receipt_status = 'pending',
      closed_at = NOW()
  WHERE id = p_account_id;

  RETURN p_account_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_salon_ticket(TEXT, TEXT, JSONB, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.close_salon_account(UUID, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_salon_ticket(TEXT, TEXT, JSONB, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_salon_account(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;

REVOKE INSERT, UPDATE, DELETE ON public.salon_accounts FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.salon_tickets FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.salon_ticket_items FROM anon, authenticated;
GRANT SELECT ON public.salon_accounts, public.salon_tickets, public.salon_ticket_items TO authenticated;
