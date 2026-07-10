import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Truck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Detail = {
  id: string;
  code: string;
  status: string;
  receiver_name: string;
  route_code: string | null;
  vehicle_type: string | null;
  plate_no: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  planned_at: string | null;
  total_weight: number;
  total_volume: number;
  partner_name: string | null;
  partner_confirmed_at: string | null;
  partner_note: string | null;
  orders: Array<{ order_code: string; receiver_name: string; route_code: string | null; weight: number; volume: number; lines_count: number; qty: number }>;
};

export default function PartnerConfirm() {
  const { token = "" } = useParams();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: rows, error } = await supabase.rpc("get_shipment_by_token", { _token: token });
    if (error || !rows || (rows as any).length === 0) {
      setInvalid(true);
    } else {
      setData((rows as any)[0]);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, [token]);

  const confirm = async () => {
    setSubmitting(true);
    const { data: ok, error } = await supabase.rpc("confirm_shipment_by_token", { _token: token, _note: note || null });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    if (!ok) return toast.error("Không xác nhận được (có thể đã xác nhận trước đó).");
    toast.success("Cảm ơn bạn đã xác nhận!");
    load();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Đang tải...</div>;
  if (invalid || !data) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-2 p-4">
      <XCircle className="w-10 h-10 text-destructive" />
      <div className="text-navy font-medium">Liên kết không hợp lệ</div>
      <div className="text-sm text-muted-foreground">Vui lòng liên hệ điều phối để nhận link mới.</div>
    </div>
  );

  const confirmed = !!data.partner_confirmed_at;

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 bg-brand text-white flex items-center gap-3">
          <Truck className="w-6 h-6" />
          <div>
            <div className="font-semibold">Xác nhận thông tin vận chuyển</div>
            <div className="text-xs opacity-90">Chuyến {data.code}</div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Đối tác" value={data.partner_name || "—"} />
            <Info label="Đơn vị nhận" value={data.receiver_name} />
            <Info label="Tuyến" value={data.route_code || "—"} />
            <Info label="Loại xe" value={data.vehicle_type || "—"} />
            <Info label="Biển số" value={data.plate_no || "—"} />
            <Info label="Tài xế" value={data.driver_name ? `${data.driver_name} · ${data.driver_phone || ""}` : "—"} />
            <Info label="Thời gian dự kiến" value={data.planned_at ? new Date(data.planned_at).toLocaleString("vi-VN") : "—"} />
            <Info label="Tổng tải" value={`${Number(data.total_weight).toFixed(0)} kg / ${Number(data.total_volume).toFixed(2)} m³`} />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Danh sách order trong chuyến ({data.orders.length})</div>
            <table className="w-full text-xs">
              <thead><tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-1.5">Mã order</th><th className="pb-1.5">Đơn vị nhận</th>
                <th className="pb-1.5 text-right">KL (kg)</th><th className="pb-1.5 text-right">TT (m³)</th>
              </tr></thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.order_code} className="border-b border-border/60">
                    <td className="py-1.5 font-medium">{o.order_code}</td>
                    <td className="py-1.5">{o.receiver_name}</td>
                    <td className="py-1.5 text-right">{Number(o.weight).toFixed(0)}</td>
                    <td className="py-1.5 text-right">{Number(o.volume).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {confirmed ? (
            <div className="p-4 rounded bg-success/10 text-success flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <div className="font-medium">Đã xác nhận lúc {new Date(data.partner_confirmed_at!).toLocaleString("vi-VN")}</div>
                {data.partner_note && <div className="text-xs mt-1 opacity-80">Ghi chú: {data.partner_note}</div>}
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Ghi chú (tuỳ chọn)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                  className="w-full h-20 p-2 rounded border border-input text-sm bg-card"
                  placeholder="Ghi chú thêm cho bên gửi..." />
              </div>
              <button onClick={confirm} disabled={submitting}
                className="w-full h-11 bg-brand text-white rounded-md font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {submitting ? "Đang xác nhận..." : "Xác nhận thông tin vận chuyển"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium text-navy">{value}</div>
    </div>
  );
}
