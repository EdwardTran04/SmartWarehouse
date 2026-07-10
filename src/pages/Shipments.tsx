import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { PageHeader, Section, IBadge, IButton } from "@/components/inbound/bits";
import { supabase } from "@/integrations/supabase/client";

type Shipment = {
  id: string;
  code: string;
  status: string;
  receiver_name: string;
  route_code: string | null;
  vehicle_type: string | null;
  plate_no: string | null;
  planned_at: string | null;
  total_weight: number;
  total_volume: number;
  partner_name: string | null;
  partner_email: string | null;
  partner_token: string | null;
  partner_confirmed_at: string | null;
  created_at: string;
};

const statusLabel: Record<string, { label: string; tone: string }> = {
  draft: { label: "Chờ duyệt", tone: "default" },
  approved: { label: "Đã duyệt", tone: "info" },
  notified: { label: "Đã gửi đối tác", tone: "warning" },
  partner_confirmed: { label: "Đối tác đã xác nhận", tone: "success" },
  in_transit: { label: "Đang vận chuyển", tone: "info" },
  delivered: { label: "Đã giao", tone: "success" },
  cancelled: { label: "Đã huỷ", tone: "destructive" },
};

export default function Shipments() {
  const [rows, setRows] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("shipments").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const copyLink = (token: string | null) => {
    if (!token) return;
    const url = `${window.location.origin}/partner-confirm/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Đã copy link xác nhận đối tác");
  };

  const removeShipment = async (id: string) => {
    if (!confirm("Xoá chuyến này?")) return;
    const { error } = await supabase.from("shipments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Đã xoá");
    load();
  };

  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "Chuyến vận chuyển" }]}>
      <PageHeader title="Chuyến vận chuyển" subtitle="Danh sách các chuyến gom order & trạng thái xác nhận từ đối tác"
        actions={<IButton icon={RefreshCw} onClick={load}>Làm mới</IButton>} />

      <Section title={`Tổng: ${rows.length} chuyến`}>
        {loading ? <div className="text-sm text-muted-foreground py-6 text-center">Đang tải...</div> :
          rows.length === 0 ? <div className="text-sm text-muted-foreground py-6 text-center">Chưa có chuyến nào. Xác nhận lệnh xuất để tạo chuyến gom order.</div> :
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">Mã chuyến</th>
                <th className="pb-2 font-medium">Trạng thái</th>
                <th className="pb-2 font-medium">Đơn vị nhận</th>
                <th className="pb-2 font-medium">Tuyến</th>
                <th className="pb-2 font-medium">Loại xe / biển số</th>
                <th className="pb-2 font-medium">Kế hoạch</th>
                <th className="pb-2 font-medium text-right">Tải (kg / m³)</th>
                <th className="pb-2 font-medium">Đối tác</th>
                <th className="pb-2 font-medium">Xác nhận</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const st = statusLabel[s.status] || { label: s.status, tone: "default" };
                return (
                  <tr key={s.id} className="border-b border-border/60">
                    <td className="py-2 font-medium text-navy">{s.code}</td>
                    <td className="py-2"><IBadge s={st.tone}>{st.label}</IBadge></td>
                    <td className="py-2">{s.receiver_name}</td>
                    <td className="py-2">{s.route_code || "—"}</td>
                    <td className="py-2">{s.vehicle_type || "—"}<div className="text-muted-foreground">{s.plate_no || ""}</div></td>
                    <td className="py-2">{s.planned_at ? new Date(s.planned_at).toLocaleString("vi-VN") : "—"}</td>
                    <td className="py-2 text-right">{Number(s.total_weight).toFixed(0)} / {Number(s.total_volume).toFixed(2)}</td>
                    <td className="py-2">{s.partner_name}<div className="text-muted-foreground">{s.partner_email}</div></td>
                    <td className="py-2">{s.partner_confirmed_at ? new Date(s.partner_confirmed_at).toLocaleString("vi-VN") : "—"}</td>
                    <td className="py-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => copyLink(s.partner_token)} className="text-brand hover:opacity-80" title="Copy link đối tác"><Copy className="w-4 h-4" /></button>
                        <Link to={`/partner-confirm/${s.partner_token}`} target="_blank" className="text-brand hover:opacity-80 text-xs underline">Mở</Link>
                        <button onClick={() => removeShipment(s.id)} className="text-destructive hover:opacity-80" title="Xoá"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        }
      </Section>
    </AppShell>
  );
}
