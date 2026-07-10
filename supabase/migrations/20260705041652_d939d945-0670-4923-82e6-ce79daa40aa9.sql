
-- Replace permissive (true) policies with auth.uid() IS NOT NULL checks
DROP POLICY IF EXISTS shipments_auth_select ON public.shipments;
DROP POLICY IF EXISTS shipments_auth_insert ON public.shipments;
DROP POLICY IF EXISTS shipments_auth_update ON public.shipments;
DROP POLICY IF EXISTS shipments_auth_delete ON public.shipments;

CREATE POLICY shipments_auth_select ON public.shipments FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY shipments_auth_insert ON public.shipments FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY shipments_auth_update ON public.shipments FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY shipments_auth_delete ON public.shipments FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS shipment_orders_auth_select ON public.shipment_orders;
DROP POLICY IF EXISTS shipment_orders_auth_insert ON public.shipment_orders;
DROP POLICY IF EXISTS shipment_orders_auth_update ON public.shipment_orders;
DROP POLICY IF EXISTS shipment_orders_auth_delete ON public.shipment_orders;

CREATE POLICY shipment_orders_auth_select ON public.shipment_orders FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY shipment_orders_auth_insert ON public.shipment_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY shipment_orders_auth_update ON public.shipment_orders FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY shipment_orders_auth_delete ON public.shipment_orders FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
