
-- 1) Reset RLS policies on shipments
DROP POLICY IF EXISTS shipments_all_delete ON public.shipments;
DROP POLICY IF EXISTS shipments_all_insert ON public.shipments;
DROP POLICY IF EXISTS shipments_all_read ON public.shipments;
DROP POLICY IF EXISTS shipments_all_update ON public.shipments;

CREATE POLICY shipments_auth_select ON public.shipments FOR SELECT TO authenticated USING (true);
CREATE POLICY shipments_auth_insert ON public.shipments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY shipments_auth_update ON public.shipments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY shipments_auth_delete ON public.shipments FOR DELETE TO authenticated USING (true);

-- 2) Reset RLS policies on shipment_orders
DROP POLICY IF EXISTS shipment_orders_all_delete ON public.shipment_orders;
DROP POLICY IF EXISTS shipment_orders_all_insert ON public.shipment_orders;
DROP POLICY IF EXISTS shipment_orders_all_read ON public.shipment_orders;
DROP POLICY IF EXISTS shipment_orders_all_update ON public.shipment_orders;

CREATE POLICY shipment_orders_auth_select ON public.shipment_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY shipment_orders_auth_insert ON public.shipment_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY shipment_orders_auth_update ON public.shipment_orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY shipment_orders_auth_delete ON public.shipment_orders FOR DELETE TO authenticated USING (true);

-- 3) Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Partner-token RPCs: only the public partner link needs them (anon). Signed-in
-- app code queries the tables directly, so revoke from authenticated.
REVOKE ALL ON FUNCTION public.get_shipment_by_token(text) FROM PUBLIC, authenticated;
REVOKE ALL ON FUNCTION public.confirm_shipment_by_token(text, text) FROM PUBLIC, authenticated;
GRANT EXECUTE ON FUNCTION public.get_shipment_by_token(text) TO anon;
GRANT EXECUTE ON FUNCTION public.confirm_shipment_by_token(text, text) TO anon;
