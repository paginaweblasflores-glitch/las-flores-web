BEGIN;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'staff', 'cashier')
  );
$$;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff() TO anon, authenticated;

DROP POLICY IF EXISTS "orders_select_own_or_staff" ON public.orders;
CREATE POLICY "orders_select_own_or_staff" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS "order_items_select_authorized" ON public.order_items;
CREATE POLICY "order_items_select_authorized" ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_staff())
    )
  );

COMMIT;
