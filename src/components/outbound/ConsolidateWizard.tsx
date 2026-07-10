import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, Truck, Users, Mail, Bell, MessageSquare, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { IButton, IBadge, RuleNote, Section } from "@/components/inbound/bits";
import { consolidateOrders, ConsolidatedGroup, ConsolidateInput } from "@/lib/consolidate";
import { VEHICLES, PARTNERS, pickVehicle } from "@/data/fleet";
import { getOutOrder } from "@/data/outbound";

type Props = {
  open: boolean;
  onClose: () => void;
  orderIds: string[];
};

// Ước lượng khối lượng/thể tích từ mock order (theo qty)
function toInput(o: any): ConsolidateInput {
  const weight = Math.max(50, (o.qty || 10) * 5); // 5kg/đơn vị
  const volume = Math.max(0.1, (o.qty || 10) * 0.02);
  return {
    id: o.id,
    receiver: o.receiver,
    weight,
    volume,
    lines: o.lines || 1,
    qty: o.qty || 0,
    hasTransport: !!o.hasTransport,
  };
}

const STEPS = [
  { id: 1, label: "Xác nhận order", icon: CheckCircle2 },
  { id: 2, label: "Gom order", icon: Users },
  { id: 3, label: "Order xe & sắp lịch", icon: Truck },
  { id: 4, label: "Gửi đối tác", icon: Bell },
];

export default function ConsolidateWizard({ open, onClose, orderIds }: Props) {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const orders = useMemo(() => orderIds.map((id) => getOutOrder(id)).filter(Boolean), [orderIds]);
  const inputs = useMemo(() => orders.map(toInput), [orders]);
  const [groups, setGroups] = useState<ConsolidatedGroup[]>([]);
  const [schedules, setSchedules] = useState<Record<string, { date: string; time: string; plate: string; driver: string; phone: string; vehicleCode: string }>>({});
  const [partners, setPartners] = useState<Record<string, string>>({});
  const [channels, setChannels] = useState({ email: true, sms: false, notif: true });
  const [saving, setSaving] = useState(false);
  // Pool các order đã bị gỡ khỏi chuyến (có thể thêm lại vào chuyến khác khi duyệt lịch)
  const [pool, setPool] = useState<ConsolidateInput[]>([]);

  if (!open) return null;

  const runConsolidation = () => {
    const g = consolidateOrders(inputs);
    setGroups(g);
    const initSched: typeof schedules = {};
    const initPart: typeof partners = {};
    const today = new Date();
    const dstr = today.toISOString().slice(0, 10);
    g.forEach((grp) => {
      initSched[grp.key] = {
        date: dstr, time: "08:00",
        plate: "", driver: "", phone: "",
        vehicleCode: grp.vehicle.code,
      };
      initPart[grp.key] = PARTNERS[0].code;
    });
    setSchedules(initSched);
    setPartners(initPart);
    setStep(2);
  };

  const removeOrderFromGroup = (gKey: string, orderId: string) => {
    let removed: ConsolidateInput | null = null;
    setGroups((gs) =>
      gs
        .map((g) => {
          if (g.key !== gKey) return g;
          const found = g.orders.find((o) => o.id === orderId);
          if (found) removed = found;
          const remain = g.orders.filter((o) => o.id !== orderId);
          if (remain.length === 0) return null as any;
          const tw = remain.reduce((s, o) => s + o.weight, 0);
          const tv = remain.reduce((s, o) => s + o.volume, 0);
          return { ...g, orders: remain, totalWeight: tw, totalVolume: tv, vehicle: pickVehicle(tw, tv) };
        })
        .filter(Boolean)
    );
    if (removed) setPool((p) => [...p, removed!]);
  };

  const addOrderToGroup = (gKey: string, orderId: string) => {
    const o = pool.find((x) => x.id === orderId);
    if (!o) return;
    setPool((p) => p.filter((x) => x.id !== orderId));
    setGroups((gs) =>
      gs.map((g) => {
        if (g.key !== gKey) return g;
        const orders = [...g.orders, o];
        const tw = orders.reduce((s, x) => s + x.weight, 0);
        const tv = orders.reduce((s, x) => s + x.volume, 0);
        return { ...g, orders, totalWeight: tw, totalVolume: tv, vehicle: pickVehicle(tw, tv) };
      })
    );
  };


  const submitAll = async () => {
    setSaving(true);
    try {
      for (const g of groups) {
        const sched = schedules[g.key];
        const partnerCode = partners[g.key];
        const partner = PARTNERS.find((p) => p.code === partnerCode)!;
        const vehicle = VEHICLES.find((v) => v.code === sched.vehicleCode) || g.vehicle;
        const token = crypto.randomUUID();
        const code = `SHIP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
        const plannedAt = sched.date && sched.time ? `${sched.date}T${sched.time}:00` : null;

        const { data: shipment, error } = await supabase
          .from("shipments")
          .insert({
            code,
            status: "notified",
            receiver_name: g.receiver,
            route_code: g.route === "—" ? null : g.route,
            vehicle_type: vehicle.name,
            vehicle_capacity_kg: vehicle.capacityKg,
            plate_no: sched.plate || null,
            driver_name: sched.driver || null,
            driver_phone: sched.phone || null,
            planned_at: plannedAt,
            total_weight: g.totalWeight,
            total_volume: g.totalVolume,
            has_transport: g.hasTransport,
            partner_name: partner.name,
            partner_email: partner.email,
            partner_phone: partner.phone,
            partner_token: token,
            notified_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;

        const orderRows = g.orders.map((o) => ({
          shipment_id: shipment.id,
          order_code: o.id,
          receiver_name: o.receiver,
          route_code: g.route === "—" ? null : g.route,
          weight: o.weight,
          volume: o.volume,
          lines_count: o.lines,
          qty: o.qty,
        }));
        if (orderRows.length) {
          const { error: e2 } = await supabase.from("shipment_orders").insert(orderRows);
          if (e2) throw e2;
        }

        // Mock gửi thông báo
        const chs: string[] = [];
        if (channels.email) chs.push("Email");
        if (channels.sms) chs.push("SMS");
        if (channels.notif) chs.push("Notification");
        console.log(`[Notify ${partner.name}] via ${chs.join(", ")} → ${window.location.origin}/partner-confirm/${token}`);
      }
      toast.success(`Đã tạo ${groups.length} chuyến & gửi thông báo cho đối tác`);
      onClose();
      nav("/outbound/shipments");
    } catch (e: any) {
      toast.error(e.message || "Lỗi khi tạo chuyến vận chuyển");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-navy">Gom order & sắp lịch vận chuyển</div>
            <div className="text-xs text-muted-foreground mt-0.5">{orderIds.length} lệnh xuất được chọn</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">×</button>
        </div>

        <div className="px-5 py-3 border-b border-border flex items-center gap-1 bg-muted/30">
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-1 flex-1">
                <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${active ? "bg-brand/10 text-brand font-medium" : done ? "text-success" : "text-muted-foreground"}`}>
                  <Icon className="w-4 h-4" />
                  <span>B{s.id}. {s.label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          {step === 1 && (
            <>
              <Section title="Danh sách order được chọn">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border">
                      <th className="pb-2 font-medium">Mã lệnh</th>
                      <th className="pb-2 font-medium">Đơn vị nhận</th>
                      <th className="pb-2 font-medium">Có vận chuyển</th>
                      <th className="pb-2 font-medium text-right">Khối lượng (kg)</th>
                      <th className="pb-2 font-medium text-right">Thể tích (m³)</th>
                      <th className="pb-2 font-medium text-right">SL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputs.map((o) => (
                      <tr key={o.id} className="border-b border-border/60">
                        <td className="py-2 font-medium text-navy">{o.id}</td>
                        <td className="py-2">{o.receiver}</td>
                        <td className="py-2">{o.hasTransport ? <IBadge s="success">Có</IBadge> : <IBadge>Không</IBadge>}</td>
                        <td className="py-2 text-right">{o.weight.toFixed(0)}</td>
                        <td className="py-2 text-right">{o.volume.toFixed(2)}</td>
                        <td className="py-2 text-right">{o.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
              <RuleNote>
                <li>Có vận chuyển → gom theo ưu tiên: Đơn vị nhận → Đủ tải trọng xe → Tuyến đường.</li>
                <li>Không vận chuyển → gom theo Đơn vị nhận hàng.</li>
              </RuleNote>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-sm text-muted-foreground">
                Hệ thống đã tự động gom thành <b className="text-navy">{groups.length} nhóm</b> theo điều kiện ưu tiên.
              </div>
              {groups.map((g) => (
                <Section key={g.key}
                  title={`${g.receiver} · ${g.route === "—" ? "Không vận chuyển" : g.route}`}
                  actions={<div className="text-xs text-muted-foreground">Đề xuất: <b className="text-brand">{g.vehicle.name}</b> ({g.vehicle.capacityKg}kg / {g.vehicle.volumeM3}m³)</div>}>
                  <div className="text-xs text-muted-foreground mb-2">
                    Tổng: {g.totalWeight.toFixed(0)} kg · {g.totalVolume.toFixed(2)} m³ · {g.orders.length} order
                  </div>
                  <table className="w-full text-xs">
                    <thead><tr className="text-left text-muted-foreground border-b border-border">
                      <th className="pb-2 font-medium">Mã lệnh</th>
                      <th className="pb-2 font-medium">Đơn vị nhận</th>
                      <th className="pb-2 font-medium text-right">KL</th>
                      <th className="pb-2 font-medium text-right">TT</th>
                      <th className="pb-2 font-medium"></th>
                    </tr></thead>
                    <tbody>
                      {g.orders.map((o) => (
                        <tr key={o.id} className="border-b border-border/60">
                          <td className="py-2 font-medium">{o.id}</td>
                          <td className="py-2">{o.receiver}</td>
                          <td className="py-2 text-right">{o.weight.toFixed(0)}</td>
                          <td className="py-2 text-right">{o.volume.toFixed(2)}</td>
                          <td className="py-2 text-right">
                            <button onClick={() => removeOrderFromGroup(g.key, o.id)} className="text-destructive hover:opacity-80" title="Bỏ khỏi chuyến">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Section>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-sm text-muted-foreground">
                Chọn xe và thời gian cho từng chuyến. Có thể chỉnh loại xe / thêm biển số trước khi duyệt lịch.
              </div>
              {groups.map((g) => {
                const s = schedules[g.key];
                return (
                  <Section key={g.key}
                    title={`Chuyến: ${g.receiver}`}
                    actions={<IBadge s={g.hasTransport ? "info" : "default"}>{g.hasTransport ? g.route : "Không VC"}</IBadge>}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Loại xe</label>
                        <select value={s.vehicleCode} onChange={(e) => setSchedules({ ...schedules, [g.key]: { ...s, vehicleCode: e.target.value } })}
                          className="h-9 w-full px-2 rounded border border-input bg-card text-sm">
                          {VEHICLES.map((v) => <option key={v.code} value={v.code}>{v.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Biển số</label>
                        <input value={s.plate} onChange={(e) => setSchedules({ ...schedules, [g.key]: { ...s, plate: e.target.value } })}
                          placeholder="29A-123.45" className="h-9 w-full px-2 rounded border border-input bg-card text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Ngày</label>
                        <input type="date" value={s.date} onChange={(e) => setSchedules({ ...schedules, [g.key]: { ...s, date: e.target.value } })}
                          className="h-9 w-full px-2 rounded border border-input bg-card text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Giờ</label>
                        <input type="time" value={s.time} onChange={(e) => setSchedules({ ...schedules, [g.key]: { ...s, time: e.target.value } })}
                          className="h-9 w-full px-2 rounded border border-input bg-card text-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-muted-foreground mb-1 block">Tài xế</label>
                        <input value={s.driver} onChange={(e) => setSchedules({ ...schedules, [g.key]: { ...s, driver: e.target.value } })}
                          placeholder="Họ tên tài xế" className="h-9 w-full px-2 rounded border border-input bg-card text-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-muted-foreground mb-1 block">SĐT tài xế</label>
                        <input value={s.phone} onChange={(e) => setSchedules({ ...schedules, [g.key]: { ...s, phone: e.target.value } })}
                          placeholder="09xx xxx xxx" className="h-9 w-full px-2 rounded border border-input bg-card text-sm" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                      <span>Tổng tải: {g.totalWeight.toFixed(0)} kg · {g.totalVolume.toFixed(2)} m³ · {g.orders.length} order</span>
                      {pool.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span>+ Thêm order:</span>
                          <select defaultValue="" onChange={(e) => { if (e.target.value) { addOrderToGroup(g.key, e.target.value); e.currentTarget.value = ""; } }}
                            className="h-7 px-2 rounded border border-input bg-card text-xs">
                            <option value="">— chọn phiếu —</option>
                            {pool.map((p) => <option key={p.id} value={p.id}>{p.id} · {p.receiver} · {p.weight.toFixed(0)}kg</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                    <table className="w-full text-xs mt-2">
                      <thead><tr className="text-left text-muted-foreground border-b border-border">
                        <th className="pb-1 font-medium">Mã lệnh</th>
                        <th className="pb-1 font-medium">Đơn vị nhận</th>
                        <th className="pb-1 font-medium text-right">KL/TT</th>
                        <th className="pb-1"></th>
                      </tr></thead>
                      <tbody>
                        {g.orders.map((o) => (
                          <tr key={o.id} className="border-b border-border/40">
                            <td className="py-1 font-medium">{o.id}</td>
                            <td className="py-1">{o.receiver}</td>
                            <td className="py-1 text-right">{o.weight.toFixed(0)}kg / {o.volume.toFixed(2)}m³</td>
                            <td className="py-1 text-right">
                              <button onClick={() => removeOrderFromGroup(g.key, o.id)} className="text-destructive hover:opacity-80" title="Bỏ khỏi chuyến">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Section>
                );
              })}
              {pool.length > 0 && (
                <Section title={`Pool order chưa xếp chuyến (${pool.length})`}>
                  <div className="text-xs text-muted-foreground">Các phiếu này đã bị gỡ khỏi chuyến — dùng dropdown "+ Thêm order" ở mỗi chuyến để đưa vào lại.</div>
                  <ul className="mt-2 space-y-1 text-xs">
                    {pool.map((p) => <li key={p.id}>• <b>{p.id}</b> · {p.receiver} · {p.weight.toFixed(0)}kg / {p.volume.toFixed(2)}m³</li>)}
                  </ul>
                </Section>
              )}
            </>
          )}


          {step === 4 && (
            <>
              <Section title="Kênh gửi thông báo">
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={channels.email} onChange={(e) => setChannels({ ...channels, email: e.target.checked })} /><Mail className="w-4 h-4" /> Email</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={channels.sms} onChange={(e) => setChannels({ ...channels, sms: e.target.checked })} /><MessageSquare className="w-4 h-4" /> SMS</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={channels.notif} onChange={(e) => setChannels({ ...channels, notif: e.target.checked })} /><Bell className="w-4 h-4" /> Notification</label>
                </div>
              </Section>
              {groups.map((g) => {
                const pcode = partners[g.key];
                const p = PARTNERS.find((pp) => pp.code === pcode)!;
                return (
                  <Section key={g.key} title={`Chuyến ${g.receiver}`}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Đối tác vận chuyển</label>
                        <select value={pcode} onChange={(e) => setPartners({ ...partners, [g.key]: e.target.value })}
                          className="h-9 w-full px-2 rounded border border-input bg-card text-sm">
                          {PARTNERS.map((pp) => <option key={pp.code} value={pp.code}>{pp.name}</option>)}
                        </select>
                      </div>
                      <div className="text-xs text-muted-foreground pt-5">
                        {p.email} · {p.phone}
                      </div>
                    </div>
                    <div className="mt-3 p-3 rounded bg-muted/40 text-xs">
                      <div className="font-medium mb-1">Xem trước nội dung:</div>
                      <div>Kính gửi <b>{p.name}</b>,</div>
                      <div>Đề nghị vận chuyển {g.orders.length} order đến <b>{g.receiver}</b> ({g.route}).</div>
                      <div>Xe: {VEHICLES.find(v => v.code === schedules[g.key]?.vehicleCode)?.name} · Biển số: {schedules[g.key]?.plate || "(chưa nhập)"}.</div>
                      <div>Thời gian: {schedules[g.key]?.date} {schedules[g.key]?.time}.</div>
                      <div className="mt-1">Vui lòng xác nhận qua đường link được gửi kèm.</div>
                    </div>
                  </Section>
                );
              })}
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-muted/30">
          <div className="text-xs text-muted-foreground">Bước {step}/4</div>
          <div className="flex gap-2">
            {step > 1 && <IButton onClick={() => setStep(step - 1)}>Quay lại</IButton>}
            {step === 1 && <IButton variant="brand" icon={ChevronRight} onClick={runConsolidation}>Gom order tự động</IButton>}
            {step === 2 && <IButton variant="brand" icon={ChevronRight} onClick={() => setStep(3)}>Order xe & sắp lịch</IButton>}
            {step === 3 && <IButton variant="brand" icon={ChevronRight} onClick={() => setStep(4)}>Duyệt lịch & gửi thông báo</IButton>}
            {step === 4 && <IButton variant="brand" icon={Bell} onClick={submitAll} disabled={saving}>{saving ? "Đang gửi..." : "Gửi cho đối tác"}</IButton>}
          </div>
        </div>
      </div>
    </div>
  );
}
