
CREATE TYPE public.shipment_status AS ENUM ('draft','approved','notified','partner_confirmed','in_transit','delivered','cancelled');

CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  status public.shipment_status NOT NULL DEFAULT 'draft',
  receiver_name TEXT NOT NULL,
  route_code TEXT,
  vehicle_type TEXT,
  vehicle_capacity_kg NUMERIC,
  plate_no TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  planned_at TIMESTAMPTZ,
  total_weight NUMERIC NOT NULL DEFAULT 0,
  total_volume NUMERIC NOT NULL DEFAULT 0,
  has_transport BOOLEAN NOT NULL DEFAULT true,
  partner_name TEXT,
  partner_email TEXT,
  partner_phone TEXT,
  partner_token TEXT UNIQUE,
  notified_at TIMESTAMPTZ,
  partner_confirmed_at TIMESTAMPTZ,
  partner_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated, anon;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shipments_all_read" ON public.shipments FOR SELECT USING (true);
CREATE POLICY "shipments_all_insert" ON public.shipments FOR INSERT WITH CHECK (true);
CREATE POLICY "shipments_all_update" ON public.shipments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "shipments_all_delete" ON public.shipments FOR DELETE USING (true);

CREATE TABLE public.shipment_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  order_code TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  route_code TEXT,
  weight NUMERIC NOT NULL DEFAULT 0,
  volume NUMERIC NOT NULL DEFAULT 0,
  lines_count INTEGER NOT NULL DEFAULT 0,
  qty INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipment_orders TO authenticated, anon;
GRANT ALL ON public.shipment_orders TO service_role;
ALTER TABLE public.shipment_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shipment_orders_all_read" ON public.shipment_orders FOR SELECT USING (true);
CREATE POLICY "shipment_orders_all_insert" ON public.shipment_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "shipment_orders_all_update" ON public.shipment_orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "shipment_orders_all_delete" ON public.shipment_orders FOR DELETE USING (true);

CREATE INDEX shipment_orders_shipment_idx ON public.shipment_orders(shipment_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER shipments_updated_at BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public RPC for partner to fetch by token
CREATE OR REPLACE FUNCTION public.get_shipment_by_token(_token TEXT)
RETURNS TABLE (
  id UUID, code TEXT, status public.shipment_status, receiver_name TEXT,
  route_code TEXT, vehicle_type TEXT, plate_no TEXT, driver_name TEXT, driver_phone TEXT,
  planned_at TIMESTAMPTZ, total_weight NUMERIC, total_volume NUMERIC,
  partner_name TEXT, partner_confirmed_at TIMESTAMPTZ, partner_note TEXT,
  orders JSONB
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.code, s.status, s.receiver_name, s.route_code, s.vehicle_type,
         s.plate_no, s.driver_name, s.driver_phone, s.planned_at, s.total_weight, s.total_volume,
         s.partner_name, s.partner_confirmed_at, s.partner_note,
         COALESCE((SELECT jsonb_agg(jsonb_build_object(
           'order_code', o.order_code, 'receiver_name', o.receiver_name,
           'route_code', o.route_code, 'weight', o.weight, 'volume', o.volume,
           'lines_count', o.lines_count, 'qty', o.qty
         )) FROM public.shipment_orders o WHERE o.shipment_id = s.id), '[]'::jsonb)
  FROM public.shipments s WHERE s.partner_token = _token;
END; $$;

GRANT EXECUTE ON FUNCTION public.get_shipment_by_token(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.confirm_shipment_by_token(_token TEXT, _note TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _found BOOLEAN;
BEGIN
  UPDATE public.shipments
     SET status = 'partner_confirmed', partner_confirmed_at = now(), partner_note = _note
   WHERE partner_token = _token AND status IN ('notified','approved')
   RETURNING true INTO _found;
  RETURN COALESCE(_found, false);
END; $$;

GRANT EXECUTE ON FUNCTION public.confirm_shipment_by_token(TEXT, TEXT) TO anon, authenticated;
