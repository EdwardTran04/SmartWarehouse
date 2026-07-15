import { Fragment, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { IBadge, KCard, SLAPill, Section, IButton, PageHeader, ConfirmModal, Drawer, RuleNote, TaskInfoHeader, OrderSummaryCard, AssignTaskModal } from "@/components/inbound/bits";
import { MultiSelectDropdown, SingleSelectDropdown } from "@/components/ui-bits";
import {
  outOrders, outboundKPI, outOrderTypeMix, outLeadTime, outAlerts,
  outTasks, outApiLogs, outTxns, outExceptions, outCustomerIssues, outStaffPerformance,
  outOrderTasks, getOutOrder, getOutTask,
  OutOrder, OutTask, OutApiLog,
} from "@/data/outbound";
import { taskCatalog, employees, mappings } from "@/data/inbound";
import { getTripForOutbound, getTripsForOutbound, getSecurityDemoTrips, VEHICLE_STATUS_TONE } from "@/data/vehicles";
import { VehicleGatePanel } from "@/components/VehicleGatePanel";
import HistoryTab from "@/components/HistoryTab";
import { outboundStatusVi, OUTBOUND_TYPE_LABEL, getOutVehicleDisplay, OUT_VEHICLE_TONE } from "@/lib/statusLabels";
import { formatDateTime } from "@/lib/utils";
import ConsolidateWizard from "@/components/outbound/ConsolidateWizard";
import {
  Search, Filter, Download, Plus, RefreshCw, Eye, CheckCircle2, XCircle, Truck, Package,
  ClipboardList, ShieldCheck, FileSignature, Boxes, MapPin, AlertTriangle, Settings,
  Activity, Zap, Bot, ArrowRight, Camera, ScanLine, Printer, Clock, Bell, Edit3, Brain, Play, Pause,
  Users, UserCheck, Briefcase, Network, ListChecks, Send, PenLine, ChevronRight,
} from "lucide-react";

/* ─────────────── 1. DASHBOARD XUẤT KHO ─────────────── */
export function OutboundDashboard() {
  const k = outboundKPI;
  const kpis = [
    { label: "Lệnh xuất hôm nay", value: k.todayTotal, tone: "brand" as const, icon: Package },
    { label: "Chờ xác nhận", value: k.waitingConfirm, tone: "warning" as const, icon: ClipboardList },
    { label: "Đã từ chối", value: k.rejected, tone: "destructive" as const, icon: XCircle },
    { label: "AI chưa tìm được NS", value: k.waitingAssign, tone: "warning" as const, icon: Users },
    { label: "AI đang plan", value: k.planning, tone: "info" as const, icon: Bot },
    { label: "Đang lên lịch xe", value: k.transportPlanning, tone: "info" as const, icon: Truck },
    { label: "Đang lấy hàng", value: k.picking, tone: "info" as const, icon: ScanLine },
    { label: "Đang đóng gói", value: k.packing, tone: "info" as const, icon: Boxes },
    { label: "Đang kiểm hàng", value: k.checking, tone: "info" as const, icon: CheckCircle2 },
    { label: "Chờ thực xuất", value: k.waitingGI, tone: "info" as const, icon: Activity },
    { label: "Lỗi API GI", value: k.giApiError, tone: "destructive" as const, icon: Zap },
    { label: "Chờ ký VOffice", value: k.waitingVOffice, tone: "warning" as const, icon: FileSignature },
    { label: "Từ chối ký", value: k.signRejected, tone: "destructive" as const, icon: XCircle },
    { label: "Đang tải xe", value: k.loading, tone: "info" as const, icon: Truck },
    { label: "Cần lưu trữ lại", value: k.restorage, tone: "warning" as const, icon: MapPin },
    { label: "Hoàn thành", value: k.completed, tone: "success" as const, icon: CheckCircle2 },
    { label: "Task quá hạn", value: k.overdue, tone: "destructive" as const, icon: Clock },
  ];
  const maxLT = Math.max(...outLeadTime.flatMap((l) => [l.target, l.actual]));
  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "Dashboard" }]}>
      <PageHeader title="Dashboard Xuất kho" subtitle="Tổng quan realtime toàn bộ hoạt động xuất kho – Kho HN01 · Ca S1 · 2026-05-18"
        actions={<><IButton icon={RefreshCw}>Làm mới</IButton><IButton variant="brand" icon={Download}>Xuất báo cáo</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpis.map((k) => <KCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-12 gap-4 mb-6">
        <Section title="Lệnh xuất theo loại" className="col-span-12 lg:col-span-4">
          <div className="flex items-center gap-6">
            <DonutMulti data={outOrderTypeMix} />
            <div className="space-y-2 text-sm">
              {outOrderTypeMix.map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded" style={{ background: d.color }} />
                  <span className="text-muted-foreground w-20">{d.label}</span>
                  <span className="font-semibold text-navy">{d.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-border text-xs text-muted-foreground">Tổng: {outOrderTypeMix.reduce((a, b) => a + b.value, 0)} lệnh</div>
            </div>
          </div>
        </Section>

        <Section title="Lead time công đoạn xuất (phút)" className="col-span-12 lg:col-span-8">
          <div className="space-y-2.5">
            {outLeadTime.map((l) => {
              const over = l.actual > l.target;
              return (
                <div key={l.stage} className="flex items-center gap-3 text-xs">
                  <div className="w-28 text-muted-foreground">{l.stage}</div>
                  <div className="flex-1 h-6 bg-muted rounded relative overflow-hidden">
                    <div className="absolute inset-y-0 bg-info/30" style={{ width: `${(l.target / maxLT) * 100}%` }} />
                    <div className={`absolute inset-y-0 ${over ? "bg-destructive/70" : "bg-success/70"}`} style={{ width: `${(l.actual / maxLT) * 100}%` }} />
                    <div className="absolute inset-0 flex items-center px-2 text-[11px] font-medium text-foreground">{l.actual}p <span className="text-muted-foreground ml-1">/ KPI {l.target}p</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-6">
        <Section title="Cảnh báo realtime" className="col-span-12 lg:col-span-5" actions={<Link to="/outbound/exceptions" className="text-xs text-brand hover:underline">Xem tất cả →</Link>}>
          <div className="space-y-2">
            {outAlerts.map((a) => (
              <div key={a.id} className={`flex items-start gap-3 p-2.5 rounded-lg border ${a.severity === "high" ? "bg-destructive/5 border-destructive/20" : a.severity === "med" ? "bg-warning/5 border-warning/20" : "bg-muted/40 border-border"}`}>
                <Bell className={`w-4 h-4 mt-0.5 ${a.severity === "high" ? "text-destructive" : a.severity === "med" ? "text-warning" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-navy">{a.kind} · <span className="text-muted-foreground font-normal">{a.ref}</span></div>
                  <div className="text-xs text-foreground/80 mt-0.5">{a.msg}</div>
                </div>
                <div className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Lệnh xuất cần xử lý ngay" className="col-span-12 lg:col-span-7" actions={<Link to="/outbound/orders" className="text-xs text-brand hover:underline">Đi tới DO Pool →</Link>}>
          <table className="w-full text-xs">
            <thead><tr className="text-left text-muted-foreground border-b border-border">
              <th className="pb-2 font-medium">Mã lệnh</th><th className="pb-2 font-medium">Loại</th><th className="pb-2 font-medium">Trạng thái</th><th className="pb-2 font-medium">SLA</th><th className="pb-2 font-medium">Phụ trách</th>
            </tr></thead>
            <tbody>
              {outOrders.filter((o) => ["API Error", "Waiting Confirm", "GI API Error", "Sign Rejected", "Restorage Required", "Waiting VOffice"].includes(o.status)).slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-border/60">
                  <td className="py-2"><Link to={`/outbound/orders/${o.id}/confirm`} className="text-brand font-medium hover:underline">{o.id}</Link></td>
                  <td className="py-2"><IBadge>{o.type}</IBadge></td>
                  <td className="py-2"><IBadge>{outboundStatusVi(o.status)}</IBadge></td>
                  <td className="py-2"><SLAPill pct={o.slaPct} label={o.sla} /></td>
                  <td className="py-2 text-muted-foreground">{o.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Section title="Hiệu suất nhân sự / ca làm việc" className="col-span-12 lg:col-span-7">
          <table className="w-full text-xs">
            <thead><tr className="text-left text-muted-foreground border-b border-border">
              <th className="pb-2 font-medium">Nhân sự</th><th className="pb-2 font-medium">Vai trò</th><th className="pb-2 font-medium">Ca</th>
              <th className="pb-2 font-medium text-right">Giao</th><th className="pb-2 font-medium text-right">Xong</th>
              <th className="pb-2 font-medium text-right">Đúng KPI</th><th className="pb-2 font-medium text-right">Quá hạn</th>
            </tr></thead>
            <tbody>
              {outStaffPerformance.map((s) => (
                <tr key={s.name} className="border-b border-border/60">
                  <td className="py-2 font-medium text-navy">{s.name}</td>
                  <td className="py-2 text-muted-foreground">{s.role}</td>
                  <td className="py-2"><IBadge>{s.shift}</IBadge></td>
                  <td className="py-2 text-right">{s.tasks}</td>
                  <td className="py-2 text-right text-success font-semibold">{s.done}</td>
                  <td className="py-2 text-right">{s.onTime}</td>
                  <td className="py-2 text-right text-destructive font-semibold">{s.overdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Đơn vị nhận / đối tác nhiều sai lệch" className="col-span-12 lg:col-span-5">
          <table className="w-full text-xs">
            <thead><tr className="text-left text-muted-foreground border-b border-border">
              <th className="pb-2 font-medium">Đơn vị nhận</th><th className="pb-2 font-medium text-right">Lệnh</th><th className="pb-2 font-medium text-right">Sai lệch</th><th className="pb-2 font-medium text-right">Trễ</th><th className="pb-2 font-medium text-right">Từ chối ký</th>
            </tr></thead>
            <tbody>
              {outCustomerIssues.map((s) => (
                <tr key={s.name} className="border-b border-border/60">
                  <td className="py-2 font-medium text-navy">{s.name}</td>
                  <td className="py-2 text-right">{s.orders}</td>
                  <td className="py-2 text-right text-warning font-semibold">{s.diff}</td>
                  <td className="py-2 text-right">{s.late}</td>
                  <td className="py-2 text-right text-destructive font-semibold">{s.signRejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </AppShell>
  );
}

function DonutMulti({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = 52, c = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
      <circle cx="75" cy="75" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="18" />
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const el = <circle key={i} cx="75" cy="75" r={r} fill="none" stroke={d.color} strokeWidth="18" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} />;
        off += len;
        return el;
      })}
      <text x="75" y="78" textAnchor="middle" className="rotate-90" transform="rotate(90 75 75)" style={{ fontSize: 18, fontWeight: 700, fill: "hsl(var(--navy))" }}>{total}</text>
    </svg>
  );
}

/* ─────────────── 2. DO POOL ─────────────── */
export function OutboundOrders() {
  const [tab, setTab] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [fType, setFType] = useState<string[]>([]);
  const [fWh, setFWh] = useState<string[]>([]);
  const [fStatus, setFStatus] = useState<string[]>([]);
  const [fApi, setFApi] = useState<string[]>([]);
  const [fFlag, setFFlag] = useState<string[]>([]);
  const [fSla, setFSla] = useState<string>("");
  const today = useMemo(() => {
    const dates = outOrders.map((o) => o.plannedDate?.split(" ")[0]).filter((d): d is string => !!d);
    const counts: Record<string, number> = {};
    dates.forEach((d) => { counts[d] = (counts[d] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || new Date().toISOString().slice(0, 10);
  }, []);

  const totalVolume = outOrders.reduce((sum, o) => sum + o.qty * 0.05, 0);
  const waitingConfirmToday = outOrders.filter((o) => o.status === "Waiting Confirm" && o.plannedDate.startsWith(today)).length;
  const inProgressToday = outOrders.filter((o) => ["Picking In Progress", "Packing In Progress", "Checking", "Loading", "Waiting VOffice", "Packed"].includes(o.status) && o.plannedDate.startsWith(today)).length;
  const completedAll = outOrders.filter((o) => o.status === "Completed").length;

  const filtered = useMemo(() => outOrders.filter((o) => {
    if (tab === "waiting" && (o.status !== "Waiting Confirm" || !o.plannedDate.startsWith(today))) return false;
    if (tab === "progress" && (!["Picking In Progress", "Packing In Progress", "Checking", "Loading", "Waiting VOffice", "Packed"].includes(o.status) || !o.plannedDate.startsWith(today))) return false;
    if (tab === "done" && o.status !== "Completed") return false;
    if (q && !o.id.toLowerCase().includes(q.toLowerCase()) && !o.receiver.toLowerCase().includes(q.toLowerCase()) && !o.sourceDoc.toLowerCase().includes(q.toLowerCase())) return false;
    const od = o.plannedDate.slice(0, 10);
    if (dateFrom && od < dateFrom) return false;
    if (dateTo && od > dateTo) return false;
    return true;
  }), [tab, q, today, dateFrom, dateTo]);

  const toggle = (id: string) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const tabs = [
    { id: "all", label: "Tổng order", n: outOrders.length },
    { id: "waiting", label: "Chờ xác nhận", n: waitingConfirmToday },
    { id: "progress", label: "Đang xử lý", n: inProgressToday },
    { id: "done", label: "Hoàn tất", n: `${completedAll}/${outOrders.length}` },
  ];

  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "DO Pool" }]}>
      <PageHeader title="Danh sách Order Xuất kho – DO Pool" subtitle="Quản lý lệnh xuất đã đồng bộ từ SAP/VERP – task tự sinh từ Order qua Task Template"
        actions={<IButton icon={Download}>Export Excel</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KCard label="Tổng order" value={outOrders.length} tone="brand" hint={`${totalVolume.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} m³ hàng hóa`} />
        <KCard label="Chờ xác nhận" value={waitingConfirmToday} tone="warning" />
        <KCard label="Đang xử lý" value={inProgressToday} tone="info" />
        <KCard label="Hoàn tất" value={`${completedAll}/${outOrders.length}`} tone="success" hint="của cả hệ thống / trong năm" />
      </div>

      <Section title="" className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 -mt-3 mb-3">
          <div className="flex gap-1 border-b border-border -mb-px">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === t.id ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t.label} <span className="text-xs text-muted-foreground">({t.n})</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã lệnh, đơn vị nhận..." className="h-8 w-64 pl-8 pr-3 rounded-md border border-input bg-card text-sm" />
            </div>
            <IButton icon={Filter} onClick={() => setFilterDrawer(true)}>Filter</IButton>
          </div>
        </div>

        {sel.length > 0 && (() => {
          const bulkHref = `/outbound/tasks/OTSK-5535?orders=${sel.join(",")}`;
          return (
            <div className="flex items-center gap-2 p-2.5 bg-brand/5 border border-brand/20 rounded-lg mb-3">
              <span className="text-sm font-medium text-brand">Đã chọn {sel.length} order</span>
              <span className="flex-1" />
              <Link to={bulkHref}><IButton size="sm" variant="brand" icon={CheckCircle2}>Xác nhận lệnh xuất ({sel.length})</IButton></Link>
              <IButton size="sm" icon={UserCheck}>Phân công task</IButton>
              <IButton size="sm" icon={RefreshCw}>Retry API</IButton>
              <IButton size="sm" variant="ghost" onClick={() => setSel([])}>Bỏ chọn</IButton>
            </div>
          );
        })()}



        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2.5 text-left">
                {(() => {
                  const selectable = filtered.filter((o) => o.status === "Waiting Confirm");
                  const allChecked = selectable.length > 0 && selectable.every((o) => sel.includes(o.id));
                  const someChecked = selectable.some((o) => sel.includes(o.id)) && !allChecked;
                  return (
                    <input type="checkbox" disabled={selectable.length === 0} checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = someChecked; }}
                      onChange={(e) => setSel(e.target.checked ? selectable.map((o) => o.id) : [])}
                      className="disabled:opacity-40 disabled:cursor-not-allowed" />
                  );
                })()}
              </th>
              <th className="px-3 py-2.5 text-left font-medium">Mã Order</th>
              <th className="px-3 py-2.5 text-left font-medium">Loại</th>
              <th className="px-3 py-2.5 text-left font-medium">Đơn vị nhận</th>
              <th className="px-3 py-2.5 text-left font-medium">Kho</th>
              <th className="px-3 py-2.5 text-center font-medium">Task cần xử lý</th>
              <th className="px-3 py-2.5 text-left font-medium">Trạng thái</th>
              <th className="px-3 py-2.5 text-left font-medium">SLA</th>
              <th className="px-3 py-2.5 text-left font-medium">Ngày xuất</th>
              <th className="px-3 py-2.5 text-left font-medium">Phụ trách</th>
              <th className="px-3 py-2.5 text-right font-medium">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-3 py-2.5"><input type="checkbox" disabled={o.status !== "Waiting Confirm"} checked={sel.includes(o.id)} onChange={() => toggle(o.id)} className="disabled:opacity-40 disabled:cursor-not-allowed" /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Link to={`/outbound/orders/${o.id}/confirm`} className="text-brand font-semibold hover:underline">{o.id}</Link>
                      {(() => {
                        const trip = getTripForOutbound(o.id);
                        if (!trip && !o.hasTransport) return null;
                        const status = trip?.status;
                        const tone = status ? VEHICLE_STATUS_TONE[status] : "bg-warning/10 text-warning";
                        return <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${tone}`} title={status ? `Xe ${trip?.tripCode} · ${status}` : "Có xe"}>XE</span>;
                      })()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{o.sourceDoc}</div>
                  </td>
                  <td className="px-3 py-2.5"><IBadge>{o.type}{OUTBOUND_TYPE_LABEL[o.type] ? ` - ${OUTBOUND_TYPE_LABEL[o.type]}` : ""}</IBadge></td>
                  <td className="px-3 py-2.5 max-w-[180px] truncate" title={o.receiver}>{o.receiver}</td>
                  <td className="px-3 py-2.5">{o.warehouse}</td>
                  <td className="px-3 py-2.5 text-center">
                    {(() => {
                      const pending = outTasks.filter((t) => t.orderId === o.id && t.status !== "Hoàn thành").length;
                      const total = outTasks.filter((t) => t.orderId === o.id).length;
                      if (!total) return <span className="text-muted-foreground">—</span>;
                      return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${pending > 0 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{pending}/{total}</span>;
                    })()}
                  </td>
                  <td className="px-3 py-2.5"><IBadge>{outboundStatusVi(o.status)}</IBadge></td>
                  <td className="px-3 py-2.5"><SLAPill pct={o.slaPct} label={o.sla} status={o.status} /></td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{formatDateTime(o.plannedDate)}</td>
                  <td className="px-3 py-2.5">{o.owner}</td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="inline-flex gap-1">
                      {o.status === "Waiting Confirm" && (
                        <Link to={`/outbound/tasks/OTSK-5535?orders=${o.id}`}><IButton size="sm" variant="brand" icon={CheckCircle2}>Xác nhận</IButton></Link>
                      )}


                      <Link to={`/outbound/orders/${o.id}`}><IButton size="sm" icon={Eye}>Xem</IButton></Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="py-12 text-center text-muted-foreground">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-40" /><div>Không có order phù hợp bộ lọc</div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>Hiển thị {filtered.length} / {outOrders.length} order</span>
          <div className="flex gap-1">
            <IButton size="sm">‹ Trước</IButton>
            <IButton size="sm" variant="brand">1</IButton><IButton size="sm">2</IButton><IButton size="sm">3</IButton>
            <IButton size="sm">Sau ›</IButton>
          </div>
        </div>
      </Section>

      <Drawer open={filterDrawer} onClose={() => setFilterDrawer(false)} title="Bộ lọc nâng cao" width="max-w-md">
        <div className="space-y-4 text-sm">
          <div>
            <div className="font-medium text-navy mb-1.5">Ngày xuất từ - đến</div>
            <div className="flex items-center gap-2">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 flex-1 px-2 rounded-md border border-input bg-card text-xs" />
              <span className="text-xs text-muted-foreground">→</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 flex-1 px-2 rounded-md border border-input bg-card text-xs" />
            </div>
          </div>
          {([
            ["Loại xuất", ["OUT-VC", "OUT-OTH"], fType, setFType],
            ["Kho xuất", ["HN01", "HCM01", "DN01"], fWh, setFWh],
            ["Trạng thái nghiệp vụ", ["Waiting Confirm", "Picking In Progress", "Packed", "Loading", "Completed"], fStatus, setFStatus],
            ["Trạng thái API", ["OK", "Pending", "Error"], fApi, setFApi],
            ["Cờ luồng", ["Có vận chuyển", "Có đóng gói", "Có VOffice"], fFlag, setFFlag],
          ] as [string, string[], string[], (v: string[]) => void][]).map(([label, opts, val, setter]) => (
            <div key={label}>
              <div className="font-medium text-navy mb-1.5">{label}</div>
              <MultiSelectDropdown options={opts} value={val} onChange={setter} placeholder="Chọn..." />
            </div>
          ))}
          <div>
            <div className="font-medium text-navy mb-1.5">SLA</div>
            <select value={fSla} onChange={(e) => setFSla(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm">
              <option value="">Tất cả</option>
              {["Còn hạn", "Sắp quá hạn", "Quá hạn"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <IButton onClick={() => { setDateFrom(""); setDateTo(""); setFType([]); setFWh([]); setFStatus([]); setFApi([]); setFFlag([]); setFSla(""); setFilterDrawer(false); }}>Đặt lại</IButton>
            <IButton variant="brand" onClick={() => setFilterDrawer(false)}>Áp dụng</IButton>
          </div>
        </div>
      </Drawer>
    </AppShell>
  );
}

/* ─────────────── 3. CONFIRM ORDER ─────────────── */
export function OutboundConfirm() {
  const { id = "OUT-2026-00452" } = useParams();
  const o = getOutOrder(id);
  const nav = useNavigate();
  const [reject, setReject] = useState(false);
  const [reason, setReason] = useState("");
  const [accept, setAccept] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardIds, setWizardIds] = useState<string[]>([]);
  const [sp] = useSearchParams();
  if (!o) return null;
  const plannedParts = (o.plannedDate || "").split(" ");
  const [etaDate, setEtaDate] = useState(plannedParts[0] || "2026-05-18");
  const [etaTime, setEtaTime] = useState(plannedParts[1] || "10:00");

  const validations = [
    { label: "Dữ liệu lệnh hợp lệ", ok: true },
    { label: "Kho xuất tồn tại", ok: true },
    { label: "Đơn vị nhận hợp lệ", ok: true },
    { label: "Tồn kho đủ cho lệnh", ok: o.id !== "OUT-2026-00453" },
    { label: "Đủ thông tin vận chuyển", ok: !o.hasTransport || !!o.vehicle },
  ];

  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "DO Pool", to: "/outbound/orders" }, { label: o.id }, { label: "Xác nhận tiếp nhận" }]}>
      <PageHeader title="Xác nhận tiếp nhận lệnh xuất" subtitle={`${o.id} · ${o.receiver}`}
        actions={<><IButton variant="danger" icon={XCircle} onClick={() => setReject(true)}>Từ chối</IButton><IButton variant="brand" icon={CheckCircle2} onClick={() => setAccept(true)}>Đồng ý xử lý</IButton></>} />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Section title="Thông tin lệnh">
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              {[
                ["Mã lệnh", o.id], ["Loại xuất", <IBadge>{o.type}</IBadge>], ["Chứng từ gốc", o.sourceDoc],
                ["Đơn vị nhận", o.receiver], ["Kho xuất", o.warehouse], ["Ngày dự kiến", formatDateTime(o.plannedDate)],
                ["SLA", <SLAPill pct={o.slaPct} label={o.sla} />], ["Số dòng hàng", `${o.lines} dòng`], ["Tổng số lượng", `${o.qty} đơn vị`],
                ["Có vận chuyển", o.hasTransport ? "Có" : "Không"], ["Có đóng gói", o.hasPacking ? "Có" : "Không"], ["Trình ký VOffice", o.hasVOffice ? "Có" : "Không"],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-xs text-muted-foreground mb-0.5">{k as string}</dt>
                  <dd className="font-medium text-navy">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Danh sách vật tư (tóm tắt)">
            <table className="w-full text-xs">
              <thead><tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">Mã hàng</th><th className="pb-2 font-medium">Tên hàng</th>
                <th className="pb-2 font-medium">ĐVT</th><th className="pb-2 font-medium text-right">SL chứng từ</th>
                <th className="pb-2 font-medium">Vị trí lấy</th><th className="pb-2 font-medium">Lô/Serial</th>
              </tr></thead>
              <tbody>
                {(o.items.length ? o.items : [
                  { sku: "OUT-LINE-01", name: "Vật tư xuất cho đối tác", uom: "Cái", docQty: 60, from: "G02-T01-B03", serial: false },
                  { sku: "OUT-LINE-02", name: "Cáp viễn thông", uom: "Cuộn", docQty: 30, from: "I02-T02-B05", serial: false },
                ] as any).map((it: any) => (
                  <tr key={it.sku} className="border-b border-border/60">
                    <td className="py-2 font-medium text-navy">{it.sku}</td>
                    <td className="py-2">{it.name}</td>
                    <td className="py-2">{it.uom}</td>
                    <td className="py-2 text-right">{it.docQty}</td>
                    <td className="py-2 text-muted-foreground">{it.from || "—"}</td>
                    <td className="py-2 text-muted-foreground">{it.serial ? "Quản lý serial" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Section title="Kiểm tra tự động">
            <div className="space-y-2">
              {validations.map((v) => (
                <div key={v.label} className="flex items-center gap-2 text-sm">
                  {v.ok ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                  <span className={v.ok ? "" : "text-destructive font-medium"}>{v.label}</span>
                </div>
              ))}
            </div>
          </Section>
          <RuleNote>
            <li>Từ chối bắt buộc nhập lý do, hệ thống gọi OUT-API2 và đóng luồng.</li>
            <li>Đồng ý → sinh task theo template OUT-VC / OUT-OTH và đề xuất giao việc.</li>
            <li>OUT-VC bắt buộc có biển số/tài xế/ETA trước khi tải hàng.</li>
          </RuleNote>
        </div>
      </div>

      <ConfirmModal open={reject} onClose={() => setReject(false)} onConfirm={() => nav("/outbound/orders")} title="Từ chối lệnh xuất" confirmLabel="Gửi từ chối (OUT-API2)" danger
        message={<div className="space-y-2">
          <p>Vui lòng nhập lý do từ chối lệnh <b>{o.id}</b>.</p>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-24 p-2 rounded border border-input text-sm" placeholder="Nhập lý do từ chối..." />
        </div>} />

      <ConfirmModal open={accept} onClose={() => setAccept(false)}
        onConfirm={() => {
          setAccept(false);
          toast.success(`Đã xác nhận xử lý ${o.id}. Tiếp tục gom order & sắp lịch vận chuyển.`);
          const bulk = (sp.get("orders") || o.id).split(",").filter(Boolean);
          setWizardIds(bulk);
          setWizardOpen(true);
        }}
        title="Đồng ý xử lý lệnh xuất" confirmLabel="Xác nhận & gom order"
        message={<div className="space-y-3">
          <p>Xác nhận xử lý lệnh <b>{o.id}</b>. Sau khi xác nhận, hệ thống sẽ mở bước <b>gom order & sắp lịch vận chuyển</b>.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ngày dự kiến xuất</label>
              <input type="date" value={etaDate} onChange={(e) => setEtaDate(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Giờ dự kiến xuất</label>
              <input type="time" value={etaTime} onChange={(e) => setEtaTime(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" />
            </div>
          </div>
        </div>} />

      <ConsolidateWizard open={wizardOpen} onClose={() => setWizardOpen(false)} orderIds={wizardIds} />
    </AppShell>
  );
}

/* ─────────────── 4. ORDER DETAIL ─────────────── */
export function OutboundOrderDetail() {
  const { id = "OUT-2026-00451" } = useParams();
  const o = getOutOrder(id);
  const [tab, setTab] = useState("info");
  const navigate = useNavigate();
  if (!o) return null;
  const tabs = [
    { id: "info", label: "Thông tin hàng hóa" },
    
    { id: "tasks", label: "Task" },
    { id: "transport", label: "Vận chuyển" + ((() => { const n = getTripsForOutbound(o.id).length; return n > 1 ? ` (${n})` : ""; })()) },
    { id: "docs", label: "Chứng từ" },
    { id: "history", label: "Lịch sử" },
  ];

  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "DO Pool", to: "/outbound/orders" }, { label: o.id }]}>
      <PageHeader title={o.id} subtitle={`${o.receiver} · ${o.sourceDoc} · Kho_Plant ${o.warehouse}`}
        actions={<>
          {o.status === "Waiting Confirm" && <IButton variant="brand" icon={CheckCircle2} onClick={() => navigate(`/outbound/orders/${o.id}/confirm`)}>Xác nhận lệnh</IButton>}
          <IButton icon={Download}>Tải chứng từ</IButton>
          <Link to={`/outbound/tasks?order=${o.id}`}><IButton variant="brand" icon={ArrowRight}>Xem danh sách task</IButton></Link>
        </>} />

      <div className="grid grid-cols-12 gap-3 mb-5">
        <KCard label="Trạng thái" value={<IBadge>{outboundStatusVi(o.status)}</IBadge>} tone="default" />
        <KCard label="SLA" value={<SLAPill pct={o.slaPct} label={o.sla} />} />
        <KCard label="Số dòng" value={o.lines} />
        <KCard label="Tổng SL" value={o.qty} tone="brand" />
        <KCard label="Phụ trách" value={<span className="text-sm">{o.owner}</span>} />
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-navy">Thông tin chung</div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-info/10 text-info border border-info/20">Đồng bộ từ SAP</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          {[
            ["Người nhận hàng", o.receiver],
            ["Đơn vị", o.receiver],
            ["Số sứ QĐ/KH/TT", `QĐ-${o.sourceDoc.replace(/^[A-Z]+-/, "")}`],
            ["Mã hợp đồng", `HĐ-${o.sourceDoc.replace(/^[A-Z]+-/, "")}`],
            ["Mã / Tên kho xuất", `${o.warehouse} · Kho ${o.warehouse === "HN01" ? "Hà Nội 01" : o.warehouse === "HCM01" ? "Hồ Chí Minh 01" : o.warehouse}`],
            ["Lý do xuất", o.type === "OUT-VC" ? "Xuất vận chuyển đến đơn vị / chi nhánh" : "Xuất nội bộ / trả NCC / thu hồi CCDC"],
            ["Diễn giải", `${o.type === "OUT-VC" ? "Xuất vận chuyển" : "Xuất khác"} · ${o.lines} dòng · ${o.qty} đơn vị · Phụ trách: ${o.owner}`],
          ].map(([k, v]) => (
            <div key={k as string}>
              <div className="text-xs text-muted-foreground">{k as string}</div>
              <div className="font-medium text-navy">{v as any}</div>
            </div>
          ))}
        </div>
      </div>

      <Section title="">
        <div className="flex gap-1 border-b border-border -mt-3 -mx-5 px-5 mb-4 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${tab === t.id ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
          ))}
        </div>

        {tab === "info" && (
          <div>
            <div className="text-sm font-semibold text-navy mb-2">Danh sách hàng hóa</div>
            {o.items.length === 0 ? <div className="text-sm text-muted-foreground py-4">Chưa có chi tiết hàng hóa.</div> : (
              <table className="w-full text-xs">
                <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
                  <th className="px-3 py-2 text-left font-medium">Mã hàng</th><th className="px-3 py-2 text-left font-medium">Tên</th><th className="px-3 py-2 text-left font-medium">ĐVT</th>
                  <th className="px-3 py-2 text-right font-medium">Chứng từ</th><th className="px-3 py-2 text-right font-medium">Đã pick</th><th className="px-3 py-2 text-right font-medium">Chênh lệch</th>
                  <th className="px-3 py-2 text-left font-medium">Vị trí lấy</th><th className="px-3 py-2 text-left font-medium">HU</th>
                </tr></thead>
                <tbody>
                  {o.items.map((it) => (
                    <tr key={it.sku} className="border-b border-border/60">
                      <td className="px-3 py-2 font-medium text-navy">{it.sku}</td>
                      <td className="px-3 py-2">{it.name}</td>
                      <td className="px-3 py-2">{it.uom}</td>
                      <td className="px-3 py-2 text-right">{it.docQty}</td>
                      <td className="px-3 py-2 text-right font-semibold">{it.pickedQty}</td>
                      <td className={`px-3 py-2 text-right font-semibold ${it.diff === 0 ? "text-muted-foreground" : "text-destructive"}`}>{it.diff > 0 ? `+${it.diff}` : it.diff}</td>
                      <td className="px-3 py-2 text-muted-foreground">{it.from || "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{it.hu || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}


        {tab === "tasks" && (
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2 text-left font-medium">Task</th><th className="px-3 py-2 text-left font-medium">Loại</th>
              <th className="px-3 py-2 text-left font-medium">Phụ trách</th><th className="px-3 py-2 text-left font-medium">Thời gian bắt đầu</th><th className="px-3 py-2 text-left font-medium">Thời gian kết thúc</th><th className="px-3 py-2 text-left font-medium">SLA</th><th className="px-3 py-2 text-left font-medium">Trạng thái</th>
            </tr></thead>
            <tbody>
              {outTasks.filter((t) => t.orderId === o.id).map((t) => (
                <tr key={t.id} className="border-b border-border/60">
                  <td className="px-3 py-2"><Link to={`/outbound/tasks/${t.id}`} className="text-brand font-medium">{t.id}</Link></td>
                  <td className="px-3 py-2">{t.type}</td>
                  <td className="px-3 py-2">{t.owner}</td>
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">{t.startAt || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">{t.endAt || "—"}</td>
                  <td className="px-3 py-2"><SLAPill pct={t.slaPct} label={t.sla} /></td>
                  <td className="px-3 py-2"><IBadge>{t.status}</IBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "transport" && (() => {
          const trips = getTripsForOutbound(o.id);
          if (!o.hasTransport && trips.length === 0) return <div className="text-sm text-muted-foreground py-6 text-center">Lệnh này không có vận chuyển (OUT-OTH).</div>;
          return <VehicleGatePanel trips={trips} requireGateBefore={o.hasTransport ? "load" : undefined} warehouseCode={o.warehouse} />;
        })()}

        {tab === "docs" && (
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2 text-left font-medium">Loại chứng từ</th>
              <th className="px-3 py-2 text-left font-medium">Mã / Thông tin</th>
              <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
              <th className="px-3 py-2 text-left font-medium">Thời gian cập nhật</th>
              <th className="px-3 py-2 text-right font-medium">Hành động</th>
            </tr></thead>
            <tbody>
              {[
                { type: "Phiếu xuất T-AGI", code: o.giDoc || "—", status: o.giDoc ? "Đã có" : "Chờ API3", time: "—", action: o.giDoc ? "Tải xuống" : "—" },
                { type: "BBBG bàn giao", code: o.bbbg || "—", status: o.bbbg ? "Đã ký" : "Chưa ký", time: "—", action: o.bbbg ? "Xem" : "—" },
                { type: "VOffice", code: o.voffice || "—", status: o.voffice ? "Đã ký" : o.hasVOffice ? "Chờ ký" : "Không yêu cầu", time: "—", action: o.voffice ? "Xem" : "—" },
                { type: "Đơn xuất gốc", code: o.sourceDoc, status: "Đã có", time: "—", action: "Xem" },
              ].map((d) => (
                <tr key={d.type} className="border-b border-border/60">
                  <td className="px-3 py-2 font-medium text-navy">{d.type}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d.code}</td>
                  <td className="px-3 py-2"><IBadge>{d.status}</IBadge></td>
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">{d.time}</td>
                  <td className="px-3 py-2 text-right">
                    {d.action !== "—" ? (
                      <button className="text-[11px] text-brand hover:underline font-medium">{d.action} →</button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}


        {tab === "history" && <HistoryTab orderId={o.id} />}
      </Section>
    </AppShell>
  );
}

function OutApiTable({ rows }: { rows: OutApiLog[] }) {
  return (
    <table className="w-full text-xs">
      <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
        <th className="px-3 py-2 text-left font-medium">Log ID</th><th className="px-3 py-2 text-left font-medium">API</th>
        <th className="px-3 py-2 text-left font-medium">Request</th><th className="px-3 py-2 text-left font-medium">Response</th>
        <th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-right font-medium">Retry</th>
        <th className="px-3 py-2 text-left font-medium">Ghi chú</th>
      </tr></thead>
      <tbody>{rows.map((l) => (
        <tr key={l.id} className="border-b border-border/60">
          <td className="px-3 py-2 font-medium">{l.id}</td>
          <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-semibold">{l.code}</span></td>
          <td className="px-3 py-2 text-muted-foreground">{formatDateTime(l.reqTime)}</td>
          <td className="px-3 py-2 text-muted-foreground">{formatDateTime(l.resTime) || "—"}</td>
          <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${["200","201"].includes(l.status) ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{l.status} {l.errorCode || ""}</span></td>
          <td className="px-3 py-2 text-right">{l.retry}</td>
          <td className="px-3 py-2">{l.note}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

/* ─────────────── 5. AI AUTO-DISPATCH LOG ─────────────── */
export function OutboundAssignQueue() {
  const queue = outOrders.filter((o) => ["Waiting Confirm", "Waiting Assignment Approval", "Picking In Progress", "Packing In Progress", "Loading"].includes(o.status));
  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "AI Auto-Dispatch" }]}>
      <PageHeader title="AI Auto-Dispatch – Order-centric (Xuất kho)" subtitle="Mỗi Order xuất khi lên hệ thống sẽ được AI tự sinh task và tự giao việc cho nhân sự phù hợp."
        actions={<><IBadge>AI Engine: ONLINE</IBadge><IButton icon={Activity}>Xem log AI</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <KCard label="Order AI đã xử lý" value={queue.length} tone="brand" icon={Bot} />
        <KCard label="Task tự sinh hôm nay" value={48} tone="info" icon={ListChecks} />
        <KCard label="Task tự giao thành công" value={45} tone="success" icon={UserCheck} />
        <KCard label="Auto-dispatch hôm nay" value={7} tone="success" icon={Send} />
        <KCard label="Không có NS phù hợp" value={1} tone="destructive" icon={AlertTriangle} hint="AI cảnh báo Thủ kho" />
        <KCard label="Độ chính xác AI (7d)" value="95.8%" tone="brand" icon={Brain} />
      </div>

      <Section title="Order đã được AI sinh task & giao việc tự động" actions={<IBadge>Read-only</IBadge>}>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Mã Order</th>
            <th className="px-3 py-2 text-left font-medium">Loại</th>
            <th className="px-3 py-2 text-left font-medium">Đơn vị nhận</th>
            <th className="px-3 py-2 text-left font-medium">Kho</th>
            <th className="px-3 py-2 text-right font-medium">Task AI sinh</th>
            <th className="px-3 py-2 text-right font-medium">Đã tự giao</th>
            <th className="px-3 py-2 text-left font-medium">Trạng thái AI</th>
            <th className="px-3 py-2 text-left font-medium">SLA</th>
            <th className="px-3 py-2 text-right font-medium">Chi tiết</th>
          </tr></thead>
          <tbody>
            {queue.map((o) => {
              const gen = 6 + (o.lines % 4);
              const dispatched = Math.max(gen - (o.id.endsWith("60") ? 1 : 0), 0);
              return (
                <tr key={o.id} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-3 py-2"><Link to={`/outbound/orders/${o.id}/assign`} className="text-brand font-semibold hover:underline">{o.id}</Link></td>
                  <td className="px-3 py-2"><IBadge>{o.type}</IBadge></td>
                  <td className="px-3 py-2 max-w-[200px] truncate">{o.receiver}</td>
                  <td className="px-3 py-2">{o.warehouse}</td>
                  <td className="px-3 py-2 text-right font-semibold">{gen}</td>
                  <td className="px-3 py-2 text-right font-semibold text-success">{dispatched}/{gen}</td>
                  <td className="px-3 py-2"><IBadge>{dispatched === gen ? "AI Hoàn tất" : "AI Đang xử lý"}</IBadge></td>
                  <td className="px-3 py-2"><SLAPill pct={o.slaPct || 30} label={o.sla || "—"} /></td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/outbound/orders/${o.id}/assign`}><IButton size="sm" variant="outline" icon={Bot}>Xem AI Plan</IButton></Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <RuleNote>
        <li><b>AI tự động hoàn toàn</b>: Khi Order xuất vào hệ thống, AI Engine tự sinh task theo Task Catalog & tự giao việc.</li>
        <li>AI lựa chọn NS dựa trên: kho được phép, vị trí, chứng chỉ, ca làm, tải task hiện tại, hiệu suất 7 ngày.</li>
        <li>Task hệ thống/API → AI tự kích hoạt. Task nhân sự → AI tự dispatch xuống Mobile/Web cho NS.</li>
        <li>Nếu AI không tìm được NS phù hợp → đẩy cảnh báo cho Thủ kho (chỉ cảnh báo).</li>
        <li>Mọi quyết định AI đều được ghi log đầy đủ (model, version, score, lý do) phục vụ audit.</li>
      </RuleNote>
    </AppShell>
  );
}

/* ─────────────── 6. AI PLAN DETAIL ─────────────── */
export function OutboundAssign() {
  const { id = "OUT-2026-00451" } = useParams();
  const o = getOutOrder(id);
  const otasks = outOrderTasks.filter((t) => t.orderId === id);
  const [logOpen, setLogOpen] = useState(false);
  if (!o) return null;

  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "AI Auto-Dispatch", to: "/outbound/assign" }, { label: o.id }]}>
      <PageHeader title={`AI Plan – ${o.id}`} subtitle={`${o.receiver} · Kho ${o.warehouse} · ${o.lines} dòng / ${o.qty} SL · AI tự sinh task & tự giao việc`}
        actions={<>
          <IBadge>AI Engine v3.2</IBadge>
          <IButton icon={Activity} onClick={() => setLogOpen(true)}>Xem log quyết định AI</IButton>
          <IButton icon={RefreshCw}>AI chạy lại</IButton>
        </>} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <KCard label="Task AI đã sinh" value={otasks.length} tone="brand" icon={ListChecks} />
        <KCard label="AI đã tự giao" value={otasks.filter((t) => t.assignee).length} tone="success" icon={UserCheck} />
        <KCard label="AI chưa tìm được NS" value={otasks.filter((t) => !t.assignee && t.kind === "Human").length} tone="destructive" icon={AlertTriangle} />
        <KCard label="Task hệ thống/API" value={otasks.filter((t) => t.kind !== "Human").length} tone="info" />
        <KCard label="KPI tổng (phút)" value={otasks.reduce((s, t) => s + t.kpiMin, 0)} />
        <KCard label="Phụ trách Order" value={<span className="text-sm">{o.owner}</span>} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Section title={`Task AI sinh từ Order (${otasks.length})`} className="col-span-12 lg:col-span-8"
          actions={<><IBadge>Template: {o.type}</IBadge><IBadge>Read-only</IBadge></>}>
          <div className="space-y-2">
            {otasks.map((t) => (
              <div key={t.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg border border-border bg-card text-xs">
                <div className="col-span-2">
                  <div className="font-semibold text-navy text-sm">{t.id}</div>
                  <div className="text-[10px] text-muted-foreground">{t.code}</div>
                </div>
                <div className="col-span-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t.kind} · KPI {t.kpiMin}p · Hạn {t.deadline}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] text-muted-foreground">Vị trí yêu cầu</div>
                  <span className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-medium">{t.positionRequired}</span>
                </div>
                <div className="col-span-4">
                  {t.assignee ? (
                    <div>
                      <div className="text-[10px] text-success font-semibold flex items-center gap-1"><Bot className="w-3 h-3" /> AI đã tự giao</div>
                      <div className="font-medium text-navy">{t.assigneeName}</div>
                      {t.suggestedEmps[0] && <div className="text-[10px] text-muted-foreground italic">Score {t.suggestedEmps[0].score}đ · {t.suggestedEmps[0].reason}</div>}
                    </div>
                  ) : t.kind !== "Human" ? (
                    <span className="text-[11px] text-info italic flex items-center gap-1"><Bot className="w-3 h-3" /> Hệ thống tự xử lý</span>
                  ) : (
                    <span className="text-[11px] text-destructive font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> AI không tìm được NS – đã cảnh báo Thủ kho</span>
                  )}
                </div>
                <div className="col-span-1 text-right"><IBadge>{t.status}</IBadge></div>
              </div>
            ))}
          </div>
        </Section>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Section title="Nhân sự AI đang sử dụng tại kho" actions={<IBadge>{employees.filter((e) => e.allowedWhs.includes(o.warehouse) && e.active).length} NS</IBadge>}>
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {employees.filter((e) => e.allowedWhs.includes(o.warehouse) && e.active).map((e) => (
                <div key={e.code} className="p-2.5 rounded-lg border border-border bg-card text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-navy text-sm">{e.name}</div>
                      <div className="text-[10px] text-muted-foreground">{e.code} · {e.titleSap}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${e.current === "Rảnh" ? "bg-success/10 text-success" : e.current === "Bận" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{e.current}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {e.certs.map((c) => <span key={c} className="px-1.5 py-0.5 rounded bg-brand/10 text-brand text-[10px]">{c}</span>)}
                    {e.certs.length === 0 && <span className="text-[10px] text-muted-foreground italic">Chưa có chứng chỉ</span>}
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground">Ca {e.shift} · AI đã giao {e.load} task</div>
                </div>
              ))}
            </div>
          </Section>

          <RuleNote>
            <li><b>Toàn bộ giao việc do AI tự động</b>, người dùng không bấm nút phân công.</li>
            <li>AI chỉ chọn NS Active, thuộc kho xử lý, đúng vị trí, đủ chứng chỉ, mapping còn hiệu lực.</li>
            <li>Task API/hệ thống → AI tự kích hoạt khi điều kiện đủ.</li>
            <li>Khi AI không tìm được NS phù hợp → cảnh báo Thủ kho.</li>
            <li>Mọi quyết định AI đều lưu log: model, version, score, lý do, timestamp.</li>
          </RuleNote>
        </div>
      </div>

      <Drawer open={logOpen} onClose={() => setLogOpen(false)} title="Log quyết định AI – Auto Dispatch">
        <div className="text-sm space-y-3">
          <div className="rounded-lg border border-brand/30 bg-brand/5 p-3"><Bot className="w-5 h-5 text-brand mb-1" /> AI Engine v3.2 đã xử lý Order {o.id}: phân tích {employees.length} NS kho {o.warehouse}. Tự sinh {otasks.length} task và tự dispatch {otasks.filter((t) => t.assignee).length} task cho NS.</div>
          <div className="space-y-2">
            {otasks.filter((t) => t.assignee).slice(0, 6).map((t) => (
              <div key={t.id} className="text-xs border border-border rounded-lg p-2.5">
                <div className="font-semibold text-navy">{t.id} · {t.name}</div>
                <div className="text-[11px] text-muted-foreground">→ Auto-assigned: <b className="text-foreground">{t.assigneeName}</b> {t.suggestedEmps[0] && <>· score {t.suggestedEmps[0].score} · {t.suggestedEmps[0].reason}</>}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">model=task-dispatch-v3.2 · latency=120ms · confidence=0.94</div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </AppShell>
  );
}

/* ─────────────── 7. TASK LIST ─────────────── */
const OUT_FLOW_STEPS = Array.from(new Set(taskCatalog.filter((t) => t.flows.some((f) => f === "OUT-VC" || f === "OUT-OTH")).map((t) => t.name)));

// AI Scheduler helpers (mirror Inbound)
const OUT_SKILL_MAP: Record<string, string[]> = {
  "Check lệnh xuất kho": ["Chứng từ", "Ký chứng từ"],
  "Lấy hàng ra khu đóng gói": ["Xe nâng"],
  "Đưa sang khu chờ xuất": ["Xe nâng"],
  "Tải hàng lên xe": ["Xe nâng", "Xe cẩu"],
  "Thực xuất kho": ["Ký chứng từ", "Chứng từ"],
  "Kiểm hàng - ký bàn giao": ["Kiểm hàng", "Scan RFID", "Ký chứng từ"],
  "Đóng gói hàng": ["Đóng gói", "In tem"],
  "Ký voffice": ["VOffice", "Ký chứng từ"],
};

function outMatchScore(emp: typeof employees[number], required: string[]) {
  if (!required.length) return 60;
  const hit = required.filter((r) => emp.certs.some((c) => c.toLowerCase().includes(r.toLowerCase()))).length;
  return Math.round((hit / required.length) * 100);
}

function outEligibleEmployees(taskCode: string, warehouse?: string) {
  const cat = taskCatalog.find((c) => c.code === taskCode);
  const allowedPos = cat?.allowedPositions || [];
  const empCodes = new Set(
    mappings.filter((m) => m.active && allowedPos.includes(m.positionCode) && (!warehouse || m.warehouse === warehouse)).map((m) => m.empCode)
  );
  return employees.filter((e) => e.active && empCodes.has(e.code));
}

function buildOutAIPlan(rows: OutTask[]) {
  let cursor = 8 * 60;
  const load: Record<string, number> = Object.fromEntries(employees.map((e) => [e.code, e.load]));
  return rows.slice(0, 12).map((t) => {
    const o = getOutOrder(t.orderId);
    const elig = outEligibleEmployees(t.code, o?.warehouse);
    const stepName = Object.keys(OUT_SKILL_MAP).find((k) => t.type.includes(k)) || t.type;
    const required = OUT_SKILL_MAP[stepName] || [];
    const pool = (elig.length ? elig : employees).filter((e) => e.current !== "Nghỉ");
    const ranked = pool.map((e) => ({ e, score: outMatchScore(e, required) - (load[e.code] || 0) * 8 })).sort((a, b) => b.score - a.score);
    const pick = ranked[0]?.e || pool[0] || employees[0];
    load[pick.code] = (load[pick.code] || 0) + 1;
    const dur = stepName.includes("Kiểm") ? 35 : stepName.includes("Tải") ? 30 : stepName.includes("Đóng gói") ? 40 : stepName.includes("Lấy hàng") ? 45 : 25;
    const start = cursor;
    const end = cursor + dur;
    cursor += Math.max(15, Math.round(dur * 0.6));
    const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    return {
      taskId: t.id, taskCode: t.code, orderId: t.orderId, warehouse: o?.warehouse || "", type: t.type, zone: t.zone,
      empCode: pick.code, empName: pick.name, empTitle: pick.titleSap,
      score: Math.max(40, Math.min(99, ranked[0]?.score ?? 60)),
      start: fmt(start), end: fmt(end), dur, startMin: start, endMin: end,
      kpi: dur <= 30 ? "Hoàn tất ≤ 30'" : `Hoàn tất ≤ ${dur}'`,
    };
  });
}

function OutAISchedulerModal({ open, onClose, rows }: { open: boolean; onClose: () => void; rows: OutTask[] }) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const plan = useMemo(() => buildOutAIPlan(rows), [rows]);
  if (!open) return null;
  const run = () => { setPhase("running"); setTimeout(() => setPhase("done"), 1400); };
  const apply = () => { toast.success(`Đã áp dụng phân công AI cho ${plan.length} task`); onClose(); setPhase("idle"); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-5xl border border-border max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center"><Brain className="w-5 h-5" /></div>
            <div>
              <h3 className="font-semibold text-navy">AI phân công tự động – Xuất kho</h3>
              <p className="text-xs text-muted-foreground">Phân tích NS · lịch · lệnh xuất đã duyệt → đề xuất kế hoạch tối ưu</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border p-3 bg-gradient-to-br from-brand/5 to-transparent">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Users className="w-3.5 h-3.5" />Nhân sự khả dụng</div>
              <div className="text-2xl font-bold text-navy">{employees.filter((e) => e.active && e.current !== "Nghỉ").length}</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-gradient-to-br from-info/5 to-transparent">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><ClipboardList className="w-3.5 h-3.5" />Task cần phân công</div>
              <div className="text-2xl font-bold text-navy">{rows.length}</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-gradient-to-br from-success/5 to-transparent">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><CheckCircle2 className="w-3.5 h-3.5" />Lệnh đã duyệt</div>
              <div className="text-2xl font-bold text-navy">{outOrders.filter((o) => o.status !== "Waiting Confirm").length}</div>
            </div>
          </div>
          {phase === "idle" && <div className="text-center py-10"><Brain className="w-12 h-12 mx-auto mb-3 text-brand" /><div className="text-sm text-muted-foreground mb-3">Bấm "Chạy AI" để nhận đề xuất phân công.</div><IButton variant="brand" icon={Brain} onClick={run}>Chạy AI</IButton></div>}
          {phase === "running" && <div className="text-center py-10"><RefreshCw className="w-12 h-12 mx-auto mb-3 text-brand animate-spin" /><div className="text-sm">AI đang phân tích…</div></div>}
          {phase === "done" && (
            <div className="space-y-3">
              <table className="w-full text-xs">
                <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
                  {["Task","Loại","Nhân sự","Bắt đầu","Kết thúc","KPI","Match"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {plan.map((p) => (
                    <tr key={p.taskId} className="border-b border-border/60">
                      <td className="px-3 py-2 font-medium text-brand">{p.taskId}</td>
                      <td className="px-3 py-2">{p.type}</td>
                      <td className="px-3 py-2">{p.empName} <span className="text-muted-foreground text-[10px]">({p.empTitle})</span></td>
                      <td className="px-3 py-2">{p.start}</td>
                      <td className="px-3 py-2">{p.end}</td>
                      <td className="px-3 py-2 text-muted-foreground">{p.dur}p</td>
                      <td className="px-3 py-2"><span className={`inline-flex px-1.5 py-0.5 rounded text-[11px] font-semibold ${p.score >= 80 ? "bg-success/10 text-success" : p.score >= 60 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{p.score}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <IButton onClick={onClose}>Đóng</IButton>
          {phase === "done" && <IButton variant="brand" icon={CheckCircle2} onClick={apply}>Áp dụng phân công</IButton>}
        </div>
      </div>
    </div>
  );
}

export function OutboundTasks() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string[]>([]);
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const [slaGroup, setSlaGroup] = useState("");
  const [assignId, setAssignId] = useState<string | undefined>();
  const [aiOpen, setAiOpen] = useState(false);

  const orderById = useMemo(() => Object.fromEntries(outOrders.map((o) => [o.id, o])), []);
  const whOptions = useMemo(() => {
    const set = new Set<string>();
    outTasks.forEach((t) => {
      const wh = orderById[t.orderId]?.warehouse;
      if (wh) set.add(wh);
      if (t.zone && t.zone !== "—") set.add(t.zone);
    });
    return Array.from(set).sort();
  }, [orderById]);

  const slaGroupOf = (pct: number, st: string) => {
    if (st === "Quá hạn" || pct >= 100) return "Quá hạn";
    if (pct >= 80) return "Sắp quá hạn";
    return "Trong hạn";
  };

  const rows = useMemo(() => outTasks.filter((t) => {
    if (q && !(t.id.toLowerCase().includes(q.toLowerCase()) || t.orderId.toLowerCase().includes(q.toLowerCase()) || t.owner.toLowerCase().includes(q.toLowerCase()))) return false;
    if (type.length > 0 && !type.includes(t.type)) return false;
    if (status.length > 0 && !status.includes(t.status)) return false;
    if (orderId.length > 0 && !orderId.includes(t.orderId)) return false;
    if (warehouses.length > 0) {
      const wh = orderById[t.orderId]?.warehouse;
      if (!warehouses.includes(wh || "") && !warehouses.includes(t.zone)) return false;
    }
    if (slaGroup && slaGroupOf(t.slaPct, t.status) !== slaGroup) return false;
    return true;
  }), [q, type, status, orderId, warehouses, slaGroup, orderById]);
  const isUnassigned = (t: OutTask) => !t.owner || t.owner === "—" || t.status === "Chờ phân công";

  const isOverdue = (t: OutTask) => t.status !== "Hoàn thành" && (t.status === "Quá hạn" || (typeof t.slaPct === "number" && t.slaPct >= 100));
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return counts;
  }, [rows]);
  const overdueCount = useMemo(() => rows.filter(isOverdue).length, [rows]);
  const totalTasks = rows.length;

  const STATUS_TONE: Record<string, string> = {
    "Chưa bắt đầu": "warning",
    "Chờ phân công": "warning",
    "Đang xử lý": "info",
    "Pending": "info",
    "Quá hạn": "destructive",
    "Hoàn thành": "success",
    "Phát sinh": "destructive",
  };

  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "Danh sách task" }]}>
      <PageHeader title="Danh sách task xuất kho" subtitle="Task tổng hợp – sinh trực tiếp từ Order qua Task Template"
        actions={<><IButton variant="brand" icon={Brain} onClick={() => setAiOpen(true)}>AI phân công tự động</IButton><IButton icon={Download}>Export</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-5">
        <KCard label="Tổng task" value={totalTasks} tone="brand" />
        <div className={overdueCount > 0 ? "animate-pulse" : ""}>
          <KCard label="Quá hạn SLA/KPI" value={overdueCount} tone="destructive" hint={overdueCount > 0 ? "Chưa hoàn tất – vượt SLA" : "An toàn"} />
        </div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <KCard key={status} label={status} value={count} tone={STATUS_TONE[status] as any || "muted"} />
        ))}
      </div>


      <Section title="Bộ lọc">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <div className="relative col-span-2"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mã task / Order / người phụ trách..." className="h-9 w-full pl-9 pr-3 rounded-md bg-muted/60 text-sm" />
          </div>
          <MultiSelectDropdown options={OUT_FLOW_STEPS} value={type} onChange={setType} placeholder="Loại task" />
          <MultiSelectDropdown options={["Chưa bắt đầu", "Đang xử lý", "Pending", "Quá hạn", "Hoàn thành", "Phát sinh", "Chờ phân công"]} value={status} onChange={setStatus} placeholder="Trạng thái task" />
          <MultiSelectDropdown options={Array.from(new Set(outTasks.map((t) => t.orderId)))} value={orderId} onChange={setOrderId} placeholder="Order" />
          <MultiSelectDropdown options={whOptions} value={warehouses} onChange={setWarehouses} placeholder="Kho / Khu vực" />
          <SingleSelectDropdown options={["Trong hạn", "Sắp quá hạn", "Quá hạn"]} value={slaGroup} onChange={setSlaGroup} placeholder="SLA (tất cả)" />
        </div>
      </Section>

      <div className="mt-4 bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted/50"><tr className="text-left text-muted-foreground">
            {["Mã task", "Mã order", "Loại task", "Người phụ trách", "Khu/Vị trí", "Bắt đầu", "Hoàn thành", "SLA", "Trạng thái", "Thao tác"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((t) => {
              const step = OUT_FLOW_STEPS.indexOf(t.type) + 1;
              const unassigned = isUnassigned(t);
              return (
                <tr key={t.id} className={`border-t border-border hover:bg-muted/30 ${isOverdue(t) ? "bg-destructive/10" : ""}`}>
                  <td className="px-3 py-2"><Link to={`/outbound/tasks/${t.id}`} className="text-brand font-medium">{t.id}</Link></td>
                  <td className="px-3 py-2"><Link to={`/outbound/orders/${t.orderId}`} className="text-brand">{t.orderId}</Link></td>
                  <td className="px-3 py-2">{step > 0 && <span className="text-muted-foreground mr-1">B{step}.</span>}{t.type}</td>
                  <td className="px-3 py-2">{unassigned ? <span className="text-warning italic">Chưa phân công</span> : t.owner}</td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground">{t.zone}{t.position ? ` · ${t.position}` : ""}</td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground tabular-nums">{t.startAt || "—"}</td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground tabular-nums">{t.endAt || "—"}</td>
                  <td className="px-3 py-2"><SLAPill pct={t.slaPct} label={t.sla} status={t.status} /></td>
                  <td className="px-3 py-2"><IBadge>{t.status}</IBadge></td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-1 justify-end">
                      {unassigned && <IButton size="sm" icon={UserCheck} onClick={() => setAssignId(t.id)}>Phân công</IButton>}
                      <Link to={`/outbound/tasks/${t.id}`}><IButton size="sm" icon={CheckCircle2}>Cập nhật tiến độ</IButton></Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">Không có task phù hợp bộ lọc</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="mt-4"><RuleNote>
        <li>Task xuất kho sinh từ Order theo Task Template (OUT-VC / OUT-OTH).</li>
        <li>Bước "Chưa bắt đầu" sẽ kích hoạt khi bước trước đó hoàn thành (theo dependsOn).</li>
        <li>Task "Chờ phân công" = hệ thống chưa tìm được nhân sự phù hợp – dùng nút Phân công để giao việc thủ công.</li>
        <li>Quản lý có thể override người thực hiện nhưng bắt buộc nhập lý do.</li>
      </RuleNote></div>

      <AssignTaskModal open={!!assignId} onClose={() => setAssignId(undefined)} taskId={assignId} />
      <OutAISchedulerModal open={aiOpen} onClose={() => setAiOpen(false)} rows={rows} />
    </AppShell>
  );
}

/* ─────────────── 8. TASK DETAIL ROUTER ─────────────── */
export function OutboundTaskDetail() {
  const { id } = useParams();
  const t = getOutTask(id || "");
  if (!t) return <AppShell breadcrumb={[{ label: "Xuất kho" }]}><div className="p-8 text-muted-foreground">Không tìm thấy task.</div></AppShell>;
  switch (t.code) {
    case "T-GI":  return <OutTaskConfirmOrder task={t} />;
    case "T-APR": return <OutTaskApproveSchedule task={t} />;
    case "T-MV4": return <OutTaskPicking task={t} />;
    case "T-PAC": return <OutTaskPacking task={t} />;
    case "T-HO":  return <OutTaskCheckHO task={t} />;
    case "T-MV5": return <OutTaskMove task={t} />;
    case "T-LDG": return <OutTaskLoading task={t} />;
    case "T-AGI": return <OutTaskAGI task={t} />;
    case "T-SIG": return <OutTaskVOffice task={t} />;
    case "T-WH":  return <OutTaskMonitor task={t} />;
    case "T-SCR": return <OutTaskSecurity task={t} />;
    default:      return <OutTaskGeneric task={t} />;
  }
}

/* TaskShell for outbound */
function OutEvidenceField() {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <OutField label="Bằng chứng đính kèm (tuỳ chọn)">
      <label className="flex items-center gap-2 h-9 px-3 rounded border border-dashed border-input bg-card text-sm cursor-pointer hover:bg-muted/40">
        <Camera className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Chọn ảnh / file để đính kèm</span>
        <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []).map(f => f.name))} />
      </label>
      {files.length > 0 && <ul className="text-xs text-muted-foreground space-y-1 mt-2">{files.map((f, i) => <li key={i}>• {f}</li>)}</ul>}
    </OutField>
  );
}

function OutField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return <label className="block"><span className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}{required && <span className="text-destructive ml-0.5">*</span>}</span>{children}</label>;
}

function OutTaskShell({ task, title, subtitle, children, actions, rules, showOrderSummary, hideOrderItems, hideTaskHeader, completeDisabled, hideSidebarExtras, completeLabel, fullWidth, onComplete }: { task: OutTask; title: string; subtitle?: string; children: React.ReactNode; actions?: React.ReactNode; rules?: React.ReactNode; showOrderSummary?: boolean; hideOrderItems?: boolean; hideTaskHeader?: boolean; completeDisabled?: boolean; hideSidebarExtras?: boolean; completeLabel?: string; fullWidth?: boolean; onComplete?: () => void }) {
  const [extend, setExtend] = useState(false);
  const [done, setDone] = useState(false);
  const [extMin, setExtMin] = useState(30);
  const [reason, setReason] = useState("");
  const [claimed, setClaimed] = useState(task.status !== "Chưa bắt đầu" && task.status !== "Chờ phân công");
  const [claimedAt, setClaimedAt] = useState<string | null>(task.startAt || null);
  const order = getOutOrder(task.orderId);
  const unassigned = !task.owner || task.owner === "—" || task.status === "Chờ phân công";
  const canClaim = !claimed && !unassigned;
  const handleClaim = () => {
    const now = formatDateTime(new Date());
    setClaimed(true);
    setClaimedAt(now);
    toast.success(`Đã nhận việc ${task.id} · Bắt đầu tính KPI lúc ${now}`);
  };
  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "Task", to: "/outbound/tasks" }, { label: task.id }]}>
      <PageHeader title={`${title} – ${task.id}`} subtitle={subtitle || `${task.orderId} · ${task.zone}`}
        actions={<>
          {canClaim && <IButton variant="brand" icon={Play} onClick={handleClaim}>Nhận việc</IButton>}
          {claimed && claimedAt && <span className="inline-flex items-center gap-1 text-[11px] px-2 h-6 rounded-full bg-success/10 text-success font-medium">Đã nhận · {claimedAt}</span>}
          <IButton icon={Clock} onClick={() => setExtend(true)}>Gia hạn KPI</IButton>
          {actions || <IButton variant="brand" icon={CheckCircle2} disabled={completeDisabled || !claimed} onClick={() => setDone(true)}>{completeLabel || "Hoàn thành"}</IButton>}
        </>} />

      {!hideTaskHeader && (
        <TaskInfoHeader status={task.status} slaPct={task.slaPct} slaLabel={task.sla}
          orderId={task.orderId} orderHref={`/outbound/orders/${task.orderId}`} orderSub={order?.sourceDoc}
          type={task.type} zone={task.zone} position={task.position} owner={task.owner} unassigned={unassigned} />
      )}
      {showOrderSummary && order && <div className="mb-4"><OrderSummaryCard order={order} type="outbound" hideItems={hideOrderItems} /></div>}

      <div className="space-y-4">
        {children}
        {rules && !fullWidth && rules}
      </div>

      <ConfirmModal open={done} onClose={() => setDone(false)} title="Hoàn thành task"
        message={<div className="space-y-2 text-sm"><p>Task <b>{task.id}</b> ({task.type}) sẽ chuyển trạng thái <b>Hoàn thành</b> và ghi transaction.</p><OutEvidenceField /></div>}
        confirmLabel="Hoàn thành" onConfirm={() => { toast.success(`Task ${task.id} đã hoàn thành`); setDone(false); onComplete?.(); }} />
      <ConfirmModal open={extend} onClose={() => setExtend(false)} title="Gia hạn thời gian thực hiện"
        message={<div className="space-y-2 text-sm">
          <p>Gia hạn KPI cho task <b>{task.id}</b>.</p>
          <OutField label="Thời gian gia hạn (phút)"><input type="number" min={5} step={5} value={extMin} onChange={(e) => setExtMin(+e.target.value)} className="h-9 w-full px-3 rounded border border-input bg-card text-sm" /></OutField>
          <OutField label="Lý do gia hạn" required><textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-20 p-2 rounded border border-input text-sm" placeholder="Nhập lý do..." /></OutField>
          <OutEvidenceField />
        </div>}
        confirmLabel="Ghi nhận gia hạn" onConfirm={() => { toast.success(`Đã gia hạn ${extMin}p cho task ${task.id}`); setExtend(false); }} />
    </AppShell>
  );
}

/* ─── T-GI: Xác nhận lệnh xuất ─── */
function OutTaskConfirmOrder({ task }: { task: OutTask }) {
  const o = getOutOrder(task.orderId);
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [mode, setMode] = useState<"accept" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const plannedParts = (o?.plannedDate || "").split(" ");
  const [etaDate, setEtaDate] = useState(plannedParts[0] || "2026-05-18");
  const [etaTime, setEtaTime] = useState(plannedParts[1] || "10:00");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardIds, setWizardIds] = useState<string[]>([]);
  const decided = (mode === "accept" && !!etaDate && !!etaTime) || (mode === "reject" && reason.trim().length > 0);

  const handleComplete = () => {
    if (mode === "accept") {
      const bulk = (sp.get("orders") || task.orderId).split(",").filter(Boolean);
      setWizardIds(bulk);
      setWizardOpen(true);
      return;
    }
    nav("/outbound/tasks");
  };

  return (
    <OutTaskShell task={task} title="Xác nhận lệnh xuất" subtitle={`Order ${task.orderId} · ${o?.sourceDoc || ""}`} completeDisabled={!decided} onComplete={handleComplete}
      rules={<RuleNote>
        <li>Thủ kho kiểm tra Order (đơn vị nhận, dòng, số lượng, tồn) trước khi xử lý.</li>
        <li>Đồng ý → nhập ngày & giờ dự kiến xuất. Hệ thống sinh task theo template OUT-* và đề xuất NS.</li>
        <li>Từ chối → bắt buộc nhập lý do, gọi OUT-API2 đồng bộ lại SAP/VERP.</li>
        <li><b>Hết ngày làm việc</b> mà xe/đơn vị nhận <b>chưa tới</b> → hệ thống tự động chuyển Order về trạng thái <b>Chờ xác nhận</b> để thủ kho xử lý tiếp ngày hôm sau.</li>
        <li>Nút "Hoàn thành" chỉ kích hoạt sau khi đã chọn quyết định. Sau khi Đồng ý → hệ thống tự động mở bước <b>Gom order & sắp lịch vận chuyển</b>.</li>
      </RuleNote>}>
      <Section title="Quyết định xử lý">
        <div className="flex gap-2">
          <button onClick={() => setMode("accept")} className={`flex-1 p-4 rounded-lg border text-left ${mode === "accept" ? "border-success bg-success/5" : "border-border hover:bg-muted/40"}`}>
            <CheckCircle2 className="w-5 h-5 text-success mb-2" />
            <div className="font-semibold text-navy">Đồng ý lệnh</div>
            <div className="text-xs text-muted-foreground mt-1">Tiếp nhận lệnh và xác nhận thời gian dự kiến xuất.</div>
          </button>
          <button onClick={() => setMode("reject")} className={`flex-1 p-4 rounded-lg border text-left ${mode === "reject" ? "border-destructive bg-destructive/5" : "border-border hover:bg-muted/40"}`}>
            <XCircle className="w-5 h-5 text-destructive mb-2" />
            <div className="font-semibold text-navy">Từ chối lệnh</div>
            <div className="text-xs text-muted-foreground mt-1">Bắt buộc nhập lý do. Hệ thống gọi OUT-API2 đồng bộ SAP/VERP.</div>
          </button>
        </div>
        {mode === "accept" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><div className="text-xs text-muted-foreground mb-1">Ngày dự kiến xuất *</div><input type="date" value={etaDate} onChange={(e) => setEtaDate(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" /></div>
            <div><div className="text-xs text-muted-foreground mb-1">Giờ dự kiến xuất *</div><input type="time" value={etaTime} onChange={(e) => setEtaTime(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" /></div>
          </div>
        )}
        {mode === "reject" && (
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-1">Lý do từ chối *</div>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full p-3 rounded-md border border-input text-sm" placeholder="Ví dụ: không đủ tồn, sai đơn vị nhận, trùng lệnh..." />
          </div>
        )}
      </Section>
      {o && <Section title="Chi tiết lệnh"><OrderSummaryCard order={o} type="outbound" /></Section>}
      <ConsolidateWizard open={wizardOpen} onClose={() => { setWizardOpen(false); nav("/outbound/tasks"); }} orderIds={wizardIds} />
    </OutTaskShell>
  );
}


/* ─── T-APR: Duyệt lịch giao việc xuất kho ─── */
const OUT_WORK_OPTIONS = [
  "Check lệnh xuất kho", "Lấy hàng ra khu đóng gói", "Đóng gói hàng",
  "Kiểm hàng - ký bàn giao", "Đưa sang khu chờ xuất", "Tải hàng lên xe",
  "Thực xuất kho", "Ký voffice",
];

function OutTaskApproveSchedule({ task }: { task: OutTask }) {
  const orderTasksList = useMemo(() => outTasks.filter((x) => x.orderId === task.orderId && x.code !== "T-APR"), [task.orderId]);
  const initialPlan = useMemo(() => buildOutAIPlan(orderTasksList), [orderTasksList]);
  const today = new Date().toISOString().slice(0, 10);
  const toDT = (t: string) => `${today}T${t}`;
  const fromDT = (v: string) => (v.includes("T") ? v.slice(11, 16) : v);
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const order = useMemo(() => getOutOrder(task.orderId), [task.orderId]);
  const whEmployees = useMemo(() => employees.filter((e) => e.defaultWh === order.warehouse || e.allowedWhs.includes(order.warehouse)), [order.warehouse]);
  const [rows, setRows] = useState(() => initialPlan);
  const [transferOpen, setTransferOpen] = useState<string | null>(null);
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferReason, setTransferReason] = useState<string>("");
  type Transfer = { taskId: string; fromCode: string; fromName: string; toCode: string; toName: string; reason: string; status: "pending" | "accepted" | "declined" };
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  type AuditEntry = { id: string; at: string; taskId: string; action: "transfer-accepted" | "transfer-declined" | "manual-change"; fromName: string; toName: string; reason: string; actor: string };
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const nowTs = () => formatDateTime(new Date());
  const logAudit = (entry: Omit<AuditEntry, "id" | "at" | "actor">) =>
    setAudit((prev) => [{ id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: nowTs(), actor: "Trần Đăng Khoa (GĐ kho)", ...entry }, ...prev]);

  const matchAvg = rows.length ? Math.round(rows.reduce((s, p) => s + p.score, 0) / rows.length) : 0;
  const totalMin = rows.reduce((s, p) => s + p.dur, 0);
  const empCount = new Set(rows.map((p) => p.empCode)).size;
  const updateRow = (taskId: string, patch: Partial<typeof rows[number]>) => setRows((prev) => prev.map((r) => r.taskId === taskId ? { ...r, ...patch } : r));
  const toMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return (h || 0) * 60 + (m || 0); };
  const onChangeEmp = (taskId: string, code: string) => {
    const row = rows.find((x) => x.taskId === taskId);
    const elig = row ? outEligibleEmployees(row.taskCode, row.warehouse) : [];
    const emp = elig.find((e) => e.code === code);
    if (!emp) return;
    updateRow(taskId, { empCode: emp.code, empName: emp.name, empTitle: emp.titleSap });
  };
  const onChangeTime = (taskId: string, field: "start" | "end", v: string) => {
    const hhmm = fromDT(v);
    const r = rows.find((x) => x.taskId === taskId)!;
    const next = { ...r, [field]: hhmm };
    next.startMin = toMin(next.start);
    next.endMin = toMin(next.end);
    next.dur = Math.max(0, next.endMin - next.startMin);
    updateRow(taskId, next);
  };

  const overlap = (a1: number, a2: number, b1: number, b2: number) => a1 < b2 && b1 < a2;
  const isEmpFree = (empCode: string, s: number, e: number, exclude: string, list: typeof rows) => {
    for (const r of list) if (r.taskId !== exclude && r.empCode === empCode && overlap(s, e, r.startMin, r.endMin)) return false;
    return true;
  };
  const SHIFT_WINDOWS: Record<string, [number, number]> = { S1: [6*60, 14*60], S2: [14*60, 22*60], S3: [22*60, 30*60] };
  const empOnShift = (emp: typeof employees[number], s: number, e: number) => { const w = SHIFT_WINDOWS[emp.shift]; return !w ? true : s >= w[0] && e <= w[1]; };

  const eligibleFreeForTransfer = (row: typeof rows[number]) =>
    outEligibleEmployees(row.taskCode, row.warehouse)
      .filter((e) => e.code !== row.empCode)
      .filter((e) => e.active && e.current !== "Nghỉ" && e.current !== "Bận")
      .filter((e) => empOnShift(e, row.startMin, row.endMin))
      .filter((e) => isEmpFree(e.code, row.startMin, row.endMin, row.taskId, rows));

  const openTransfer = (taskId: string) => {
    const row = rows.find((r) => r.taskId === taskId);
    if (!row) return;
    const elig = eligibleFreeForTransfer(row);
    setTransferTo(elig[0]?.code || "");
    setTransferReason("");
    setTransferOpen(taskId);
  };
  const submitTransfer = () => {
    if (!transferOpen) return;
    const row = rows.find((r) => r.taskId === transferOpen);
    if (!row) return;
    const elig = eligibleFreeForTransfer(row);
    const target = elig.find((e) => e.code === transferTo);
    if (!target) { toast.error("Chọn nhân sự nhận task"); return; }
    if (!transferReason.trim()) { toast.error("Nhập lý do"); return; }
    const tf: Transfer = { taskId: row.taskId, fromCode: row.empCode, fromName: row.empName, toCode: target.code, toName: target.name, reason: transferReason.trim(), status: "pending" };
    setTransfers((p) => [...p.filter((x) => x.taskId !== row.taskId), tf]);
    setTransferOpen(null);
    toast.success(`Đã gửi yêu cầu chuyển task tới ${target.name}`);
    setTimeout(() => {
      const accepted = Math.random() > 0.2;
      setTransfers((p) => p.map((x) => x.taskId === row.taskId ? { ...x, status: accepted ? "accepted" : "declined" } : x));
      if (accepted) {
        setRows((prev) => prev.map((r) => r.taskId === row.taskId ? { ...r, empCode: target.code, empName: target.name, empTitle: target.titleSap } : r));
        logAudit({ taskId: row.taskId, action: "transfer-accepted", fromName: row.empName, toName: target.name, reason: tf.reason });
        toast.success(`${target.name} đã đồng ý nhận task ${row.taskId}`);
      } else {
        logAudit({ taskId: row.taskId, action: "transfer-declined", fromName: row.empName, toName: target.name, reason: `${tf.reason} (NS mới từ chối)` });
        toast.warning(`${target.name} từ chối – cần chọn nhân sự khác`);
      }
    }, 2500);
  };

  return (
    <OutTaskShell task={task} title="Duyệt lịch giao việc" subtitle={`${task.orderId} · GĐ kho duyệt danh sách giao việc do AI đề xuất`}
      showOrderSummary hideOrderItems hideSidebarExtras fullWidth completeLabel="Xác nhận duyệt lịch">
      <Section title="Tóm tắt đề xuất">
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Tổng số task</div><div className="text-2xl font-bold text-navy">{rows.length}</div></div>
          <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Nhân sự dự kiến</div><div className="text-2xl font-bold text-navy">{empCount}</div></div>
          <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Tổng KPI dự kiến</div><div className="text-2xl font-bold text-navy">{totalMin}<span className="text-sm font-normal text-muted-foreground"> phút</span></div></div>
          <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Match trung bình</div><div className={`text-2xl font-bold ${matchAvg >= 80 ? "text-success" : matchAvg >= 60 ? "text-warning" : "text-destructive"}`}>{matchAvg}%</div></div>
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title={`Danh sách nhân sự thuộc kho (${whEmployees.length})`}>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-xs min-w-[300px]">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  {["Mã nhân viên", "Họ tên", "Trạng thái đi làm"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {whEmployees.map((e) => {
                  const statusTone = !e.active
                    ? "bg-destructive/10 text-destructive"
                    : e.current === "Rảnh"
                    ? "bg-success/10 text-success"
                    : e.current === "Bận"
                    ? "bg-warning/10 text-warning"
                    : "bg-info/10 text-info";
                  const statusLabel = !e.active ? "Nghỉ" : `Đang làm – ${e.current}`;
                  return (
                    <tr key={e.code} className="border-t border-border hover:bg-muted/30">
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-[11px] text-muted-foreground">{e.code}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-navy">{e.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[11px] font-semibold ${statusTone}`}>{statusLabel}</span>
                      </td>
                    </tr>
                  );
                })}
                {whEmployees.length === 0 && (
                  <tr><td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">Không có nhân sự thuộc kho này</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title={`Danh sách task đề xuất phân công (${rows.length})`}>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-xs min-w-[700px]">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>{["Task", "Nội dung công việc", "KPI", "Match"].map((h, i) => <th key={i} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const typeOptions = OUT_WORK_OPTIONS.includes(p.type) ? OUT_WORK_OPTIONS : [p.type, ...OUT_WORK_OPTIONS];
                  const elig = outEligibleEmployees(p.taskCode, p.warehouse);
                  const empOptions = elig.length ? elig : employees.filter((e) => e.code === p.empCode);
                  return (
                    <tr key={p.taskId} className="border-t border-border hover:bg-muted/30">
                      <td className="px-3 py-2 whitespace-nowrap align-top">
                        <Link to={`/outbound/tasks/${p.taskId}`} className="text-brand font-medium">{p.taskId}</Link>
                        <div className="text-[10px] text-muted-foreground">{p.zone} · {p.taskCode}</div>
                      </td>
                      <td className="px-3 py-2 min-w-[220px] align-top">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium bg-info/10 text-info border-info/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {p.type}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap align-top">{p.dur} phút</td>
                      <td className="px-3 py-2 align-top"><span className={`inline-flex px-1.5 py-0.5 rounded text-[11px] font-semibold ${p.score >= 80 ? "bg-success/10 text-success" : p.score >= 60 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{p.score}%</span></td>
                    </tr>
                  );
                })}
                {rows.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">Chưa có đề xuất phân công cho lệnh này</td></tr>}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      <Section title={`Lịch sử thay đổi nhân sự (${audit.length})`}>
        {audit.length === 0 ? (
          <div className="text-xs text-muted-foreground p-4 text-center border border-dashed border-border rounded-lg">Chưa có thay đổi nhân sự nào được ghi nhận.</div>
        ) : (
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground"><tr>{["Thời gian", "Mã audit", "Task", "Hành động", "Từ NS", "→ Đến NS", "Lý do", "Người thực hiện"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr></thead>
              <tbody>{audit.map((a) => {
                const aLabel = a.action === "transfer-accepted" ? "Chuyển task – đồng ý" : a.action === "transfer-declined" ? "Chuyển task – từ chối" : "Thay đổi thủ công";
                const aTone = a.action === "transfer-declined" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success";
                return (
                  <tr key={a.id} className="border-t border-border">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{a.at}</td>
                    <td className="px-3 py-2 whitespace-nowrap font-mono text-[10px] text-muted-foreground">{a.id}</td>
                    <td className="px-3 py-2 whitespace-nowrap"><Link to={`/outbound/tasks/${a.taskId}`} className="text-brand font-medium">{a.taskId}</Link></td>
                    <td className="px-3 py-2 whitespace-nowrap"><span className={`inline-flex px-1.5 py-0.5 rounded text-[11px] font-medium ${aTone}`}>{aLabel}</span></td>
                    <td className="px-3 py-2 whitespace-nowrap">{a.fromName}</td>
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-navy">{a.toName}</td>
                    <td className="px-3 py-2 text-foreground/80">{a.reason}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{a.actor}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}
      </Section>

      {transferOpen && (() => {
        const row = rows.find((r) => r.taskId === transferOpen)!;
        const elig = eligibleFreeForTransfer(row);
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setTransferOpen(null)}>
            <div className="bg-card rounded-xl border border-border max-w-lg w-full p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className="text-base font-semibold text-navy">Chuyển task {row.taskId}</div>
                <div className="text-xs text-muted-foreground mt-0.5">NS hiện tại: <b>{row.empName}</b> · Khung giờ: <b>{row.start}–{row.end}</b> · Kho <b>{row.warehouse || "—"}</b>.</div>
              </div>
              <div>
                <div className="text-xs font-medium text-foreground mb-1">Chuyển sang nhân sự * <span className="text-success font-semibold">({elig.length} NS đủ điều kiện)</span></div>
                <select value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="w-full h-9 px-2 rounded border border-input bg-card text-sm" disabled={!elig.length}>
                  {elig.length === 0 && <option value="">Không có NS đủ điều kiện</option>}
                  {elig.map((e) => <option key={e.code} value={e.code}>{e.name} – {e.titleSap} ({e.code}) · ca {e.shift} · {e.current}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs font-medium text-foreground mb-1">Lý do chuyển *</div>
                <textarea value={transferReason} onChange={(e) => setTransferReason(e.target.value)} rows={3} className="w-full px-2 py-1.5 rounded border border-input bg-card text-sm" placeholder="VD: Có việc đột xuất..." />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setTransferOpen(null)} className="h-9 px-3 rounded-md border border-border bg-card text-sm">Huỷ</button>
                <button onClick={submitTransfer} disabled={!elig.length} className="h-9 px-3 rounded-md bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 disabled:opacity-50">Gửi yêu cầu chuyển</button>
              </div>
            </div>
          </div>
        );
      })()}
    </OutTaskShell>
  );
}

/* ─── T-MV4: Picking ─── */
type SerialPair = { plan: string; actual: string };
type PickRow = {
  sku: string; name: string; planLoc: string; docQty: number; pickedQty: number;
  hu?: string; serial: boolean; planSerial?: string;
  actualLoc?: string; newSerial?: string; mode: "ok" | "relocate" | "serial";
  suggested?: string[];
  serials?: SerialPair[];
};
function OutTaskPicking({ task }: { task: OutTask }) {
  const o = getOutOrder(task.orderId);
  const assignedPickLocs = useMemo(() => {
    const set = new Set<string>();
    outOrders.filter((x) => x.id !== task.orderId && ["Picking Assigned", "Picking In Progress"].includes(x.status))
      .forEach((x) => x.items.forEach((i) => i.from && set.add(i.from)));
    return set;
  }, [task.orderId]);

  const [rows, setRows] = useState<PickRow[]>(() =>
    (o?.items || []).map((i) => ({
      sku: i.sku, name: i.name, planLoc: i.from || "—", docQty: i.docQty, pickedQty: i.pickedQty,
      hu: i.hu, serial: !!i.serial, planSerial: i.serial ? `SN-${i.sku}-001` : undefined,
      mode: i.diff === 0 ? "ok" : "relocate",
      suggested: i.diff !== 0 ? [`H03-T02-B01`, `H05-T01-B07`] : undefined,
      serials: i.serial
        ? Array.from({ length: Math.max(1, i.pickedQty) }, (_, k) => ({
            plan: `SN-${i.sku}-${String(k + 1).padStart(3, "0")}`,
            actual: "",
          }))
        : undefined,
    }))
  );
  const [scanIdx, setScanIdx] = useState<number | null>(null);
  const [scanVal, setScanVal] = useState("");
  const [scanErr, setScanErr] = useState("");
  const [serialIdx, setSerialIdx] = useState<number | null>(null);

  const update = (idx: number, patch: Partial<PickRow>) =>
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const setPickedQty = (idx: number, qty: number) => {
    setRows((rs) => rs.map((r, i) => {
      if (i !== idx) return r;
      let serials = r.serials;
      if (r.serial) {
        const cur = r.serials || [];
        if (qty > cur.length) {
          serials = [...cur, ...Array.from({ length: qty - cur.length }, (_, k) => ({
            plan: `SN-${r.sku}-${String(cur.length + k + 1).padStart(3, "0")}`, actual: "",
          }))];
        } else {
          serials = cur.slice(0, qty);
        }
      }
      return { ...r, pickedQty: qty, serials };
    }));
  };

  const submitScan = () => {
    if (scanIdx === null) return;
    const v = scanVal.trim().toUpperCase();
    if (!v) { setScanErr("Vui lòng nhập/scan vị trí"); return; }
    const r = rows[scanIdx];
    if (v === r.planLoc.toUpperCase()) { setScanErr("Vị trí trùng vị trí kế hoạch – không cần update"); return; }
    if (assignedPickLocs.has(v)) { setScanErr(`Vị trí ${v} đã thuộc phiếu picking khác – không được phép`); return; }
    update(scanIdx, { actualLoc: v });
    setScanIdx(null); setScanVal(""); setScanErr("");
    toast.success(`Đã cập nhật vị trí lấy hàng thực tế: ${v}`);
  };

  const serialProgress = (r: PickRow) => {
    const total = r.serials?.length || 0;
    const done = r.serials?.filter((s) => s.actual.trim()).length || 0;
    return { done, total };
  };

  const allReady = rows.every((r) => {
    const locOk = r.mode !== "relocate" || !!r.actualLoc;
    const { done, total } = serialProgress(r);
    const serialOk = !r.serial || done === total;
    return locOk && serialOk;
  });

  const finish = () => {
    if (!allReady) { toast.error("Còn dòng chưa cập nhật vị trí / chưa scan đủ Serial"); return; }
    toast.success("Hoàn thành task lấy hàng – chuyển sang khu đóng gói");
  };


  return (
    <OutTaskShell task={task} title="Lấy hàng ra khu đóng gói"
      actions={<><IButton variant="outline" icon={AlertTriangle}>Báo phát sinh</IButton><IButton variant="brand" icon={CheckCircle2} onClick={finish}>Hoàn thành</IButton></>}
      rules={<RuleNote>
        <li><b>TH1 – Đủ hàng, đúng vị trí:</b> Không cần scan, nhấn <b>Hoàn thành</b> để xác nhận task.</li>
        <li><b>TH2 – Thiếu hàng / sai vị trí:</b> Hệ thống gợi ý vị trí mới hoặc người dùng chủ động đến vị trí khác → <b>scan vị trí thực tế</b> để cập nhật. Vị trí scan <u>không được</u> nằm trong danh sách vị trí lấy hàng của phiếu khác đã giao.</li>
        <li><b>TH3 – Đổi Serial:</b> Khi đổi sang hàng có mã Serial khác, bắt buộc <b>scan / nhập tay Serial mới</b> để hệ thống ghi đè dữ liệu.</li>
      </RuleNote>}>
      <Section title="Thông tin chung order" actions={<IBadge s="ok">HU đích áp dụng cho toàn bộ order</IBadge>}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <OutField label="Order"><div className="h-9 px-3 rounded border border-input bg-muted/40 flex items-center font-semibold text-navy">{o?.id}</div></OutField>
          <OutField label="Kho nguồn"><div className="h-9 px-3 rounded border border-input bg-muted/40 flex items-center">{o?.warehouse}</div></OutField>
          <OutField label="Khu vực đích"><div className="h-9 px-3 rounded border border-input bg-muted/40 flex items-center">Khu C02 – Đóng gói</div></OutField>
          <OutField label="HU đích (cho cả order)" required>
            <div className="h-9 px-3 rounded border border-brand/40 bg-brand/5 flex items-center font-mono font-semibold text-brand">
              HU-PACK-{(o?.id || "").slice(-5)}
            </div>
          </OutField>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground italic">
          Toàn bộ hàng pick của order sẽ được gom về HU đích nêu trên trước khi chuyển sang task đóng gói. Người dùng không cần chọn HU đích cho từng dòng hàng.
        </div>
      </Section>
      <Section title="Danh sách hàng cần lấy" actions={<IBadge>{rows.filter(r => r.mode === "ok").length}/{rows.length} dòng OK</IBadge>}>

        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Mã hàng</th>
            <th className="px-3 py-2 text-left font-medium">Tên</th>
            <th className="px-3 py-2 text-left font-medium">Vị trí kế hoạch</th>
            <th className="px-3 py-2 text-left font-medium">Vị trí thực tế</th>
            <th className="px-3 py-2 text-right font-medium">Số lượng chứng từ</th>
            <th className="px-3 py-2 text-right font-medium">Số lượng đã lấy</th>
            <th className="px-3 py-2 text-left font-medium">Serial thực tế</th>
            <th className="px-3 py-2 text-left font-medium">Trường hợp</th>
          </tr></thead>
          <tbody>{rows.map((r, idx) => {
            const toneOk = r.mode === "ok";
            const needAct = (r.mode === "relocate" && !r.actualLoc) || (r.mode === "serial" && !r.newSerial);
            const pickedDiff = r.pickedQty - r.docQty;
            return (
              <Fragment key={r.sku}>
                <tr className={`border-b border-border/60 ${needAct ? "bg-warning/5" : ""}`}>
                  <td className="px-3 py-2 font-medium text-navy">{r.sku}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2 text-info font-mono">{r.planLoc}</td>
                  <td className="px-3 py-2 font-mono">
                    {r.actualLoc ? (
                      <span className="text-success font-semibold">{r.actualLoc}</span>
                    ) : (
                      <button onClick={() => { setScanIdx(idx); setScanVal(""); setScanErr(""); update(idx, { mode: "relocate" }); }}
                        className="px-2 py-1 rounded border border-input text-[11px] hover:bg-muted inline-flex items-center gap-1 text-muted-foreground">
                        <ScanLine className="w-3 h-3" />Scan vị trí
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">{r.docQty}</td>
                  <td className="px-3 py-2 text-right">
                    <input type="number" min={0} value={r.pickedQty}
                      onChange={(e) => setPickedQty(idx, Math.max(0, +e.target.value || 0))}
                      className={`w-20 h-7 px-2 rounded border text-right text-xs font-semibold ${pickedDiff === 0 ? "border-input" : "border-warning bg-warning/5 text-warning"}`} />
                    {pickedDiff !== 0 && (
                      <div className="text-[10px] text-warning mt-0.5">{pickedDiff > 0 ? `+${pickedDiff}` : pickedDiff} vs CT</div>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    {r.serial ? (() => {
                      const { done, total } = serialProgress(r);
                      const full = done === total;
                      return (
                        <button onClick={() => setSerialIdx(idx)}
                          className={`px-2 py-1 rounded border text-[11px] font-medium inline-flex items-center gap-1 ${full ? "border-success text-success bg-success/5" : "border-warning text-warning bg-warning/5"}`}>
                          <ScanLine className="w-3 h-3" />Quét Serial ({done}/{total})
                        </button>
                      );
                    })() : <span className="text-muted-foreground">—</span>}
                  </td>

                  <td className="px-3 py-2">
                    {toneOk && <IBadge s="ok">TH1 – Đủ hàng</IBadge>}
                    {r.mode === "relocate" && <IBadge s="warn">TH2 – Sai/thiếu vị trí</IBadge>}
                    {r.mode === "serial" && <IBadge>TH3 – Đổi Serial</IBadge>}
                  </td>
                </tr>
                {scanIdx === idx && (
                <tr className="bg-brand/5 border-b border-border/60">
                    <td colSpan={8} className="px-3 py-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-2 text-brand" />
                        <div className="flex-1 space-y-2">
                          <div className="text-[11px] text-muted-foreground">
                            <b>AI gợi ý vị trí mới:</b>{" "}
                            {(r.suggested || ["H03-T02-B01", "H05-T01-B07"]).map((s) => (
                              <button key={s} onClick={() => { setScanVal(s); setScanErr(""); }}
                                className="ml-1 px-1.5 py-0.5 rounded bg-info/10 text-info font-mono text-[11px] hover:bg-info/20">{s}</button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input autoFocus value={scanVal} onChange={(e) => { setScanVal(e.target.value); setScanErr(""); }}
                              onKeyDown={(e) => e.key === "Enter" && submitScan()}
                              placeholder="Scan / nhập vị trí thực tế (VD: H03-T02-B01)"
                              className="flex-1 h-9 px-3 rounded border border-input font-mono text-xs" />
                            <IButton variant="brand" icon={CheckCircle2} onClick={submitScan}>Xác nhận</IButton>
                            <IButton variant="outline" onClick={() => { setScanIdx(null); setScanErr(""); }}>Huỷ</IButton>
                          </div>
                          {scanErr && <div className="text-[11px] text-destructive flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{scanErr}</div>}
                          <div className="text-[10px] text-muted-foreground italic">
                            Điều kiện: Vị trí scan không nằm trong danh sách vị trí lấy hàng của các phiếu đã giao việc khác.
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}</tbody>
        </table>
      </Section>

      {serialIdx !== null && (() => {
        const r = rows[serialIdx];
        if (!r) return null;
        const updateSerial = (k: number, val: string) => {
          setRows((rs) => rs.map((row, i) => {
            if (i !== serialIdx) return row;
            const next = (row.serials || []).map((s, j) => j === k ? { ...s, actual: val } : s);
            return { ...row, serials: next };
          }));
        };
        const actuals = (r.serials || []).map(s => s.actual.trim().toUpperCase()).filter(Boolean);
        const dupSet = new Set<string>();
        const dups = new Set<string>();
        actuals.forEach(v => { if (dupSet.has(v)) dups.add(v); else dupSet.add(v); });
        const { done, total } = serialProgress(r);
        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSerialIdx(null)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-navy">Quét Serial – {r.sku} · {r.name}</div>
                  <div className="text-[11px] text-muted-foreground">Mỗi thiết bị 1 Serial riêng · Tiến độ <b className={done === total ? "text-success" : "text-warning"}>{done}/{total}</b></div>
                </div>
                <button onClick={() => setSerialIdx(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
              </div>
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex gap-2 items-center">
                <IButton variant="outline" icon={ScanLine} onClick={() => {
                  setRows((rs) => rs.map((row, i) => i === serialIdx
                    ? { ...row, serials: (row.serials || []).map((s) => ({ ...s, actual: s.actual || s.plan })) }
                    : row));
                  toast.success("Đã auto-fill Serial theo kế hoạch");
                }}>Auto-fill theo kế hoạch</IButton>
                <IButton variant="outline" onClick={() => {
                  setRows((rs) => rs.map((row, i) => i === serialIdx
                    ? { ...row, serials: (row.serials || []).map((s) => ({ ...s, actual: "" })) }
                    : row));
                }}>Xoá tất cả</IButton>
                <div className="ml-auto text-[11px] text-muted-foreground italic">Enter để chuyển ô tiếp theo</div>
              </div>
              <div className="flex-1 overflow-auto px-5 py-3">
                <table className="w-full text-xs">
                  <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
                    <th className="px-2 py-2 text-left font-medium w-12">#</th>
                    <th className="px-2 py-2 text-left font-medium">Serial thực tế (scan/nhập)</th>
                    <th className="px-2 py-2 text-left font-medium w-32">Trạng thái</th>
                  </tr></thead>
                  <tbody>{(r.serials || []).map((s, k) => {
                    const actUp = s.actual.trim().toUpperCase();
                    const isDup = actUp && dups.has(actUp);
                    const changed = actUp && actUp !== s.plan.toUpperCase();
                    return (
                      <tr key={k} className={`border-b border-border/60 ${isDup ? "bg-destructive/5" : ""}`}>
                        <td className="px-2 py-1.5 text-muted-foreground">{k + 1}</td>
                        <td className="px-2 py-1.5">
                          <input value={s.actual} onChange={(e) => updateSerial(k, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const nx = document.querySelectorAll<HTMLInputElement>(`[data-serial-input]`);
                                nx[k + 1]?.focus();
                              }
                            }}
                            data-serial-input
                            placeholder="Scan/nhập Serial"
                            className={`w-full h-8 px-2 rounded border font-mono text-[11px] ${isDup ? "border-destructive bg-destructive/5" : changed ? "border-warning bg-warning/5" : s.actual ? "border-success" : "border-input"}`} />
                        </td>
                        <td className="px-2 py-1.5">
                          {!s.actual && <span className="text-[10px] text-muted-foreground">⏳ Chờ scan</span>}
                          {s.actual && isDup && <span className="text-[10px] text-destructive font-semibold">⚠ Trùng</span>}
                          {s.actual && !isDup && changed && <span className="text-[10px] text-warning font-semibold">⚠ Khác kế hoạch (ghi đè)</span>}
                          {s.actual && !isDup && !changed && <span className="text-[10px] text-success font-semibold">✓ Khớp</span>}
                        </td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-muted/20">
                <div className="text-[11px] text-muted-foreground">
                  {dups.size > 0 && <span className="text-destructive font-semibold">Có {dups.size} Serial trùng – không thể đóng.</span>}
                </div>
                <div className="flex gap-2">
                  <IButton variant="outline" onClick={() => setSerialIdx(null)}>Huỷ</IButton>
                  <IButton variant="brand" icon={CheckCircle2} onClick={() => {
                    if (dups.size > 0) { toast.error("Còn Serial trùng"); return; }
                    setSerialIdx(null);
                    toast.success(`Đã lưu ${done}/${total} Serial cho ${r.sku}`);
                  }}>Lưu</IButton>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </OutTaskShell>
  );
}


/* ─── T-PAC: Packing ─── */
type PackRow = {
  id: string;
  sku: string;
  name: string;
  serial: string;
  qty: number;
  huType: string;
  huQty: number;
  rfid: string;
  useHU: boolean;
};
const HU_TYPES = ["Carton C1 (40×30×25)", "Carton C2 (60×40×30)", "Pallet PL1 (120×100)", "Pallet PL2 (120×80)", "Thùng gỗ G1"];
const genRFID = () => `RFID-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

function OutTaskPacking({ task }: { task: OutTask }) {
  const [singleBox, setSingleBox] = useState(false);
  const [rows, setRows] = useState<PackRow[]>([
    { id: "r1", sku: "ANT-4G-2T", name: "Anten 4G 2T", serial: "SN-A001..A012", qty: 12, huType: "Carton C1 (40×30×25)", huQty: 2, rfid: genRFID(), useHU: true },
    { id: "r2", sku: "BBU-3900", name: "BBU 3900", serial: "SN-B100..B105", qty: 6, huType: "Carton C2 (60×40×30)", huQty: 1, rfid: genRFID(), useHU: true },
    { id: "r3", sku: "CAB-PWR-10", name: "Cáp nguồn 10m", serial: "—", qty: 80, huType: "Pallet PL1 (120×100)", huQty: 1, rfid: genRFID(), useHU: false },
  ]);
  const update = (id: string, patch: Partial<PackRow>) => setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));

  const display = singleBox && rows.length > 0
    ? (() => {
        const first = rows[0];
        return rows.map(r => ({ ...r, huType: first.huType, huQty: 1, rfid: first.rfid, useHU: first.useHU }));
      })()
    : rows;

  return (
    <OutTaskShell task={task} title="Đóng gói & In tem" actions={<><IButton icon={Printer}>In tất cả tem</IButton><IButton variant="brand" icon={CheckCircle2}>Hoàn thành</IButton></>}
      rules={<RuleNote>
        <li>Loại HU do <b>hệ thống tự đề xuất</b> theo kích thước & tải trọng — người dùng được sửa nếu cần.</li>
        <li>Mã tem RFID do hệ thống tự sinh; có thể <b>tự nhập/scan</b> tem thùng cũ khi không dùng HU mới.</li>
        <li><b>Có dùng HU</b> → trừ tồn loại HU đề xuất. <b>Không dùng HU</b> → không trừ tồn.</li>
        <li>Trường hợp tất cả hàng đóng chung 1 thùng → SL HU = 1, loại HU & RFID giống nhau.</li>
      </RuleNote>}>
      <Section title="AI đề xuất quy cách đóng gói" actions={<IBadge>Bot</IBadge>}>
        <div className="rounded-lg bg-brand/5 border border-brand/20 p-3 text-sm">
          <Bot className="w-5 h-5 text-brand mb-1" /> AI đề xuất: <b>2 carton C1 + 1 carton C2 + 1 pallet PL1</b>. Phù hợp khoang xe VT-3019.
        </div>
      </Section>
      <Section title="Mapping hàng vào HU" actions={
        <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={singleBox} onChange={e => setSingleBox(e.target.checked)} className="w-4 h-4" />
          <span>Tất cả hàng đóng chung <b>1 thùng</b></span>
        </label>
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[1100px]">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-y border-border">
                <th className="px-2 py-2 text-center w-10">Dùng HU</th>
                <th className="px-3 py-2 text-left">Mã hàng</th>
                <th className="px-3 py-2 text-left">Tên hàng hóa</th>
                <th className="px-3 py-2 text-left">Serial</th>
                <th className="px-3 py-2 text-right">SL hàng</th>
                <th className="px-3 py-2 text-left">Loại HU (đề xuất)</th>
                <th className="px-3 py-2 text-right">SL HU</th>
                <th className="px-3 py-2 text-left">Mã tem RFID</th>
              </tr>
            </thead>
            <tbody>
              {display.map((r, idx) => {
                const isFirst = idx === 0;
                const disabledBySingle = singleBox && !isFirst;
                return (
                  <tr key={r.id} className="border-b border-border/60 align-middle">
                    <td className="px-2 py-2 text-center">
                      <input type="checkbox" className="w-4 h-4" checked={r.useHU}
                        disabled={disabledBySingle}
                        onChange={e => update(singleBox ? rows[0].id : r.id, { useHU: e.target.checked })} />
                    </td>
                    <td className="px-3 py-2 font-medium text-brand">{r.sku}</td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.serial}</td>
                    <td className="px-3 py-2 text-right">{r.qty}</td>
                    <td className="px-3 py-2">
                      <select className="h-8 px-2 rounded border border-input bg-card text-xs w-full"
                        value={r.huType} disabled={disabledBySingle}
                        onChange={e => update(singleBox ? rows[0].id : r.id, { huType: e.target.value })}>
                        {HU_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input type="number" min={1} className="h-8 px-2 rounded border border-input bg-card text-xs w-16 text-right"
                        value={r.huQty} disabled={disabledBySingle || singleBox}
                        onChange={e => update(r.id, { huQty: Number(e.target.value) || 1 })} />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <input className={`h-8 px-2 rounded border border-input text-xs flex-1 min-w-[160px] ${r.useHU ? "bg-muted/40" : "bg-card"}`}
                          value={r.rfid} readOnly={r.useHU || disabledBySingle}
                          placeholder={r.useHU ? "" : "Scan/Nhập tem thùng cũ"}
                          onChange={e => update(singleBox ? rows[0].id : r.id, { rfid: e.target.value })} />
                        {!r.useHU && !disabledBySingle && (
                          <IButton size="sm" variant="outline" icon={ScanLine}>Scan</IButton>
                        )}
                        {r.useHU && !disabledBySingle && (
                          <button className="text-xs text-brand hover:underline" onClick={() => update(r.id, { rfid: genRFID() })}>↻</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-muted/20 font-medium">
                <td colSpan={4} className="px-3 py-2 text-right">Tổng</td>
                <td className="px-3 py-2 text-right">{display.reduce((s, r) => s + r.qty, 0)}</td>
                <td className="px-3 py-2 text-muted-foreground">Trừ tồn HU: {display.filter(r => r.useHU).length} loại</td>
                <td className="px-3 py-2 text-right">{singleBox ? 1 : display.reduce((s, r) => s + r.huQty, 0)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <IButton size="sm" icon={Printer}>In tem RFID</IButton>
          <IButton size="sm" variant="outline" icon={Plus}>Thêm dòng</IButton>
          <span className="text-xs text-muted-foreground ml-auto">Máy in: <b>PRT-HN01-03</b></span>
        </div>
      </Section>
    </OutTaskShell>
  );
}

/* ─── T-HO: Kiểm hàng & Ký BBBG (xuất) ─── */
function OutTaskCheckHO({ task }: { task: OutTask }) {
  const o = getOutOrder(task.orderId);
  const [done, setDone] = useState(false);
  const [reject, setReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [mode, setMode] = useState<"accept" | "reject" | null>(null);
  return (
    <OutTaskShell task={task} title="Kiểm hàng & Ký BBBG (xuất)"
      actions={<>
        <IButton icon={ScanLine}>Scan barcode/RFID</IButton>
        <IButton variant="brand" icon={CheckCircle2} onClick={() => setDone(true)}>Hoàn thành</IButton>
      </>}
      rules={<RuleNote>
        <li>Người thực hiện <b>không cần cập nhật SL & tình trạng hàng hóa thực tế</b> — số liệu lấy theo chứng từ.</li>
        <li>Trường hợp <b>số liệu sai / tình trạng không đảm bảo</b> → chọn <b>Từ chối nhận hàng</b> (bắt buộc nhập lý do).</li>
        <li>Kiểm hàng và ký BBBG do <b>cùng 1 người</b> thực hiện trong cùng task.</li>
        <li>Đối tác nhận hàng ký lên BBBG xác nhận đủ số lượng/tình trạng.</li>
        <li>Còn dòng chưa kiểm → không cho ký BBBG.</li>
      </RuleNote>}>
      <Section title="Quyết định xử lý">
        <div className="text-xs text-muted-foreground mb-2">Quyết định *</div>
        <div className="flex gap-2">
          <button onClick={() => setMode("accept")} className={`flex-1 p-4 rounded-lg border text-left transition-colors ${mode === "accept" ? "border-success bg-success/5" : "border-border hover:bg-muted/40"}`}>
            <CheckCircle2 className="w-5 h-5 text-success mb-2" />
            <div className="font-semibold text-navy">Hoàn thành kiểm hàng & Ký BBBG</div>
            <div className="text-xs text-muted-foreground mt-1">Số liệu khớp chứng từ, tình trạng đảm bảo. Tiến hành ký BBBG bàn giao cho bên nhận.</div>
          </button>
          <button onClick={() => { setMode("reject"); setReject(true); }} className={`flex-1 p-4 rounded-lg border text-left transition-colors ${mode === "reject" ? "border-destructive bg-destructive/5" : "border-border hover:bg-muted/40"}`}>
            <XCircle className="w-5 h-5 text-destructive mb-2" />
            <div className="font-semibold text-navy">Từ chối nhận hàng</div>
            <div className="text-xs text-muted-foreground mt-1">Bắt buộc nhập lý do. Hệ thống gọi OUT-API2 đồng bộ SAP/VERP.</div>
          </button>
        </div>
        {mode === "reject" && (
          <div className="mt-4">
            <OutField label="Lý do từ chối" required>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="w-full p-2 rounded border border-input text-sm" placeholder="VD: Hàng móp méo, ướt; SL sai so với chứng từ; sai mã hàng..." />
            </OutField>
          </div>
        )}
      </Section>
      <Section title="Danh sách hàng kiểm trước khi giao (chỉ xem)" actions={<IBadge>Read-only</IBadge>}>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Mã hàng</th><th className="px-3 py-2 text-left font-medium">Tên</th>
            <th className="px-3 py-2 text-right font-medium">SL chứng từ</th>
            <th className="px-3 py-2 text-left font-medium">Serial</th><th className="px-3 py-2 text-left font-medium">Kết quả đối chiếu</th>
          </tr></thead>
          <tbody>{(o?.items || []).map((i) => (
            <tr key={i.sku} className="border-b border-border/60">
              <td className="px-3 py-2 font-medium text-navy">{i.sku}</td>
              <td className="px-3 py-2">{i.name}</td>
              <td className="px-3 py-2 text-right font-semibold">{i.docQty}</td>
              <td className="px-3 py-2">{i.serial ? <button className="text-brand text-[11px] underline">Quét {i.docQty}</button> : "—"}</td>
              <td className="px-3 py-2"><IBadge>Khớp chứng từ</IBadge></td>
            </tr>
          ))}</tbody>
        </table>
        <div className="mt-3 text-[11px] text-muted-foreground italic">* Sai lệch SL/tình trạng → bấm <b>Từ chối nhận hàng</b> và nhập lý do.</div>
      </Section>
      <Section title="Biên bản bàn giao (BBBG)" actions={<IBadge>Tự sinh từ chứng từ</IBadge>}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="aspect-[1/1.2] bg-muted/40 border border-border rounded p-6 text-sm">
            <div className="text-center font-bold text-navy mb-3">BIÊN BẢN BÀN GIAO HÀNG HÓA</div>
            <div className="text-xs text-muted-foreground text-center mb-4">Số: BBBG-OUT-{task.id.slice(-4)} · Ngày: 18/05/2026</div>
            <div className="space-y-1 text-xs">
              <div>Bên giao: Kho HN01 – Viettel</div>
              <div>Bên nhận: {o?.receiver}</div>
              <div>Số dòng: {o?.lines} · Tổng SL: {o?.qty}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">Người ký (NS kiểm hàng ký luôn — không cần thủ kho ký riêng)</div>
            {["NV kiểm hàng (người đang thao tác)", "Đại diện bên nhận"].map((r) => (
              <div key={r} className="p-3 border border-border rounded">
                <div className="text-xs text-muted-foreground mb-2">{r}</div>
                <div className="h-20 bg-muted/40 border-dashed border-2 border-border rounded flex items-center justify-center text-xs text-muted-foreground italic">Chưa ký</div>
                <div className="flex gap-2 mt-2">
                  <IButton size="sm" variant="brand" className="flex-1" icon={PenLine}>Ký số</IButton>
                  <IButton size="sm" variant="outline" className="flex-1" icon={Camera}>Upload ảnh ký</IButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <ConfirmModal open={reject} onClose={() => setReject(false)} title="Từ chối nhận hàng" danger
        message={
          <div className="space-y-2 text-sm">
            <p>Task <b>{task.id}</b> – đơn <b>{task.orderId}</b> sẽ chuyển sang trạng thái <b>Từ chối nhận hàng</b> và gửi OUT-API2 về SAP/VERP.</p>
            <OutField label="Lý do từ chối" required>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full p-2 rounded border border-input text-sm" placeholder="VD: Hàng móp méo, ướt; SL sai so với chứng từ; sai mã hàng..." />
            </OutField>
            <OutEvidenceField />
          </div>
        }
        confirmLabel="Gửi từ chối (OUT-API2)"
        onConfirm={() => {
          if (!rejectReason.trim()) { toast.error("Vui lòng nhập lý do từ chối"); return; }
          toast.success(`Đã từ chối nhận hàng cho ${task.orderId}`); setReject(false);
        }} />
      <ConfirmModal open={done} onClose={() => setDone(false)} title="Hoàn thành kiểm hàng & Ký BBBG (xuất)"
        message={`Xác nhận hoàn thành kiểm hàng và ký BBBG cho đơn ${task.orderId}.`}
        confirmLabel="Hoàn thành"
        onConfirm={() => { toast.success(`Đã hoàn thành kiểm hàng & ký BBBG cho ${task.orderId}`); setDone(false); }} />
    </OutTaskShell>
  );
}

/* ─── T-MV5: Move to wait-out zone ─── */
function OutTaskMove({ task }: { task: OutTask }) {
  return (
    <OutTaskShell task={task} title="Đưa sang khu chờ xuất" actions={<><IButton icon={ScanLine}>Scan HU</IButton><IButton variant="brand" icon={CheckCircle2}>Hoàn thành di chuyển</IButton></>}
      rules={<RuleNote><li>Chỉ di chuyển HU đã đóng gói và đã kiểm.</li><li>Scan HU + vị trí đích để xác nhận.</li><li>Khu chờ xuất phải đủ sức chứa.</li></RuleNote>}>
      <Section title="HU cần đưa sang khu chờ xuất">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border"><th className="px-3 py-2 text-left">HU</th><th className="px-3 py-2 text-left">SKU</th><th className="px-3 py-2 text-right">SL</th><th className="px-3 py-2 text-left">Khu đích</th><th className="px-3 py-2 text-left">Trạng thái</th></tr></thead>
          <tbody>
            {[["HU-OUT-201","ANT-4G-2T",12,"C02-Wait","Đang xử lý"],["HU-OUT-202","BBU-3900",6,"C02-Wait","Chưa bắt đầu"],["HU-OUT-203","CAB-PWR-10",80,"C02-Wait","Chưa bắt đầu"]].map(([hu,sku,qty,dest,st]) => (
              <tr key={hu as string} className="border-b border-border/60">
                <td className="px-3 py-2 font-medium text-brand">{hu}</td><td className="px-3 py-2">{sku}</td>
                <td className="px-3 py-2 text-right">{qty as number}</td><td className="px-3 py-2 text-info">{dest}</td>
                <td className="px-3 py-2"><IBadge>{st}</IBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </OutTaskShell>
  );
}

/* ─── T-LDG: Tải hàng lên xe ─── */
function OutTaskLoading({ task }: { task: OutTask }) {
  const o = getOutOrder(task.orderId);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setPhoto(r.result as string); r.readAsDataURL(f);
  };
  const submit = () => {
    if (!photo) { toast.error("Vui lòng chụp ảnh xe trước khi hoàn thành"); return; }
    setPhotoOpen(false); setPhoto(null);
    toast.success("Đã hoàn thành tải hàng lên xe");
  };
  return (
    <OutTaskShell task={task} title="Tải hàng lên xe" actions={<IButton variant="brand" icon={CheckCircle2} onClick={() => setPhotoOpen(true)}>Hoàn thành</IButton>}
      rules={<RuleNote><li>Xe phải đã đến và kiểm xong trước khi tải.</li><li>Scan từng HU lên xe để xác nhận.</li><li>Số HU tải phải khớp số HU đã đóng gói.</li><li>Bắt buộc chụp ảnh xe đã đóng chốt niêm phong khi hoàn thành.</li></RuleNote>}>
      <Section title="Thông tin xe vận chuyển">
        <div className="grid grid-cols-4 gap-3 text-sm">
          {o?.vehicle ? [
            ["Biển số", o.vehicle.plate], ["Tài xế", o.vehicle.driver], ["SĐT", o.vehicle.phone],
            ["ATA", formatDateTime(o.vehicle.ata) || "—"], ["Dock", o.vehicle.dock || "—"], ["Trạng thái", o.vehicle.vehicleStatus],
          ].map(([k, v]) => (
            <div key={k as string}><div className="text-xs text-muted-foreground">{k as string}</div><div className="font-medium text-navy">{v}</div></div>
          )) : <div className="text-muted-foreground text-sm">Chưa có thông tin xe</div>}
        </div>
      </Section>
      <Section title="Danh sách HU cần tải">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border"><th className="px-3 py-2 text-left">Mã order</th><th className="px-3 py-2 text-left">Đơn vị nhận hàng</th><th className="px-3 py-2 text-left">HU</th><th className="px-3 py-2 text-left">SKU</th><th className="px-3 py-2 text-right">SL</th><th className="px-3 py-2 text-left">Vị trí trên xe</th><th className="px-3 py-2 text-left">Trạng thái</th></tr></thead>
          <tbody>
            {[["HU-OUT-201","ANT-4G-2T",12,"Khoang 1","Đã tải"],["HU-OUT-202","BBU-3900",6,"Khoang 1","Đang tải"],["HU-OUT-203","CAB-PWR-10",80,"Khoang 2","Chưa bắt đầu"]].map(([hu,sku,qty,pos,st]) => (
              <tr key={hu as string} className="border-b border-border/60">
                <td className="px-3 py-2 font-medium text-navy">{o?.id}</td>
                <td className="px-3 py-2 text-muted-foreground">{o?.receiver}</td>
                <td className="px-3 py-2 font-medium text-brand">{hu}</td><td className="px-3 py-2">{sku}</td>
                <td className="px-3 py-2 text-right">{qty as number}</td><td className="px-3 py-2 text-info">{pos}</td>
                <td className="px-3 py-2"><IBadge>{st}</IBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      {photoOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPhotoOpen(false)}>
          <div className="bg-card rounded-lg border border-border w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <div className="font-semibold text-navy flex items-center gap-2"><Camera className="w-4 h-4 text-brand" /> Chụp ảnh xe <span className="text-destructive">*</span></div>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-muted-foreground">Vui lòng chụp ảnh xe đã đóng chốt niêm phong để hoàn thành task.</p>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand transition">
                  {photo ? <img src={photo} alt="Xe" className="max-h-56 mx-auto rounded" /> : <div className="text-sm text-muted-foreground flex flex-col items-center gap-2"><Camera className="w-8 h-8 text-brand" />Bấm để chụp / tải ảnh xe</div>}
                </div>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick} />
              </label>
            </div>
            <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
              <IButton variant="outline" onClick={() => { setPhotoOpen(false); setPhoto(null); }}>Huỷ</IButton>
              <IButton variant="brand" icon={CheckCircle2} onClick={submit}>Hoàn thành</IButton>
            </div>
          </div>
        </div>
      )}
    </OutTaskShell>
  );
}

/* ─── T-AGI: Thực xuất ─── */
type AgiOrderRow = { id: string; status: "Chờ thực xuất" | "Đang gọi SAP" | "Đã thực xuất" | "Lỗi SAP"; giDoc: string; lines: number; qty: number };
function OutTaskAGI({ task }: { task: OutTask }) {
  const seedIds = useMemo(() => {
    const ids = [task.orderId, ...outOrders.filter((o) => o.id !== task.orderId && o.type === "OUT-VC").slice(0, 2).map((o) => o.id)];
    return Array.from(new Set(ids));
  }, [task.orderId]);
  const [rows, setRows] = useState<AgiOrderRow[]>(() =>
    seedIds.map((id) => {
      const o = outOrders.find((x) => x.id === id);
      return { id, status: o?.giDoc ? "Đã thực xuất" : "Chờ thực xuất", giDoc: o?.giDoc || "", lines: o?.lines || 0, qty: o?.qty || 0 } as AgiOrderRow;
    }),
  );
  const [selected, setSelected] = useState<string>(seedIds[0]);
  const [confirm, setConfirm] = useState<string | null>(null);

  const callSAP = (id: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: "Đang gọi SAP" } : r)));
    setTimeout(() => {
      const gi = `GI-2026-${String(Math.floor(100000 + Math.random() * 899999))}`;
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: "Đã thực xuất", giDoc: gi } : r)));
      toast.success(`SAP trả phiếu xuất ${gi} cho ${id}`);
    }, 900);
  };

  const statusTone: Record<AgiOrderRow["status"], any> = {
    "Chờ thực xuất": "warning", "Đang gọi SAP": "info", "Đã thực xuất": "success", "Lỗi SAP": "destructive",
  };

  const detailRows = useMemo(() => {
    const o = outOrders.find((x) => x.id === selected);
    const base = o?.items?.length
      ? o.items.map((it, i) => ({
          sku: it.sku, name: it.name, serial: it.serial ? `SN-${it.sku}-${String(1000 + i).padStart(4, "0")}` : "—",
          qty: it.pickedQty || it.docQty, huType: i % 2 === 0 ? "Pallet PL1 (120×100)" : "Carton C2 (60×40×30)",
          huQty: Math.max(1, Math.ceil((it.pickedQty || it.docQty) / 20)), rfid: `RFID-${o!.id.slice(-4)}${i}-2692`,
        }))
      : [
          { sku: "ANT-5G-32T", name: "Anten 5G 32T32R", serial: "SN-A2001..A2024", qty: 24, huType: "Pallet PL1 (120×100)", huQty: 1, rfid: "RFID-CUG466-2692" },
          { sku: "BBU-6648", name: "Baseband Unit BBU 6648", serial: "SN-B6001..B6040", qty: 40, huType: "Carton C2 (60×40×30)", huQty: 2, rfid: "RFID-Z6UDKW-2692" },
          { sku: "CAB-FO-LC", name: "Cáp quang FO-LC", serial: "—", qty: 198, huType: "Carton C1 (40×30×25)", huQty: 4, rfid: "RFID-NLPZUX-2692" },
          { sku: "PWR-48V-30A", name: "Nguồn DC 48V/30A", serial: "SN-P3001..P3060", qty: 60, huType: "Carton C2 (60×40×30)", huQty: 2, rfid: "RFID-2LVCBL-2692" },
        ];
    return base;
  }, [selected]);

  const pending = rows.filter((r) => r.status !== "Đã thực xuất").map((r) => r.id);

  return (
    <OutTaskShell task={task} title="Thực xuất kho T-AGI" actions={
      <>
        <IButton variant="outline" icon={RefreshCw}>Retry SAP</IButton>
        <IButton variant="brand" icon={CheckCircle2} disabled={pending.length === 0} onClick={() => setConfirm("__all__")}>Xác nhận thực xuất tất cả</IButton>
      </>}
      rules={<RuleNote><li>Chỉ thực xuất khi đã tải hàng lên xe & kiểm/BBBG hoàn tất.</li><li>Click "Xác nhận thực xuất" theo từng order → hệ thống gọi SAP sinh số phiếu xuất và trả về.</li><li>OUT-API3 lỗi → cho retry và ghi log.</li><li>Sau khi SAP trả số phiếu, không cho sửa SL (trừ quy trình điều chỉnh).</li></RuleNote>}>

      <Section title={`Danh sách order thực xuất (${rows.length})`}>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Mã order</th>
                <th className="px-3 py-2 text-left">Số dòng</th>
                <th className="px-3 py-2 text-left">SL</th>
                <th className="px-3 py-2 text-left">Trạng thái</th>
                <th className="px-3 py-2 text-left">Phiếu xuất kho</th>
                <th className="px-3 py-2 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={`border-t border-border cursor-pointer ${selected === r.id ? "bg-accent/40" : "hover:bg-muted/30"}`} onClick={() => setSelected(r.id)}>
                  <td className="px-3 py-2 font-mono text-brand">{r.id}</td>
                  <td className="px-3 py-2">{r.lines}</td>
                  <td className="px-3 py-2">{r.qty}</td>
                  <td className="px-3 py-2"><IBadge s={statusTone[r.status]}>{r.status}</IBadge></td>
                  <td className="px-3 py-2 font-mono">{r.giDoc || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-3 py-2 text-right">
                    {r.status === "Đã thực xuất" ? (
                      <span className="text-xs text-success">✓ Đã có phiếu</span>
                    ) : (
                      <IButton size="sm" variant="brand" icon={Send} disabled={r.status === "Đang gọi SAP"} onClick={(e: any) => { e.stopPropagation(); setConfirm(r.id); }}>
                        {r.status === "Đang gọi SAP" ? "Đang gọi SAP…" : "Xác nhận thực xuất"}
                      </IButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={`Chi tiết hàng hóa thực xuất – ${selected}`}>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Mã hàng</th>
                <th className="px-3 py-2 text-left">Tên hàng hóa</th>
                <th className="px-3 py-2 text-left">Serial</th>
                <th className="px-3 py-2 text-right">SL hàng</th>
                <th className="px-3 py-2 text-left">Loại HU</th>
                <th className="px-3 py-2 text-right">SL HU</th>
                <th className="px-3 py-2 text-left">Mã tem RFID</th>
              </tr>
            </thead>
            <tbody>
              {detailRows.map((d) => (
                <tr key={d.sku} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-brand">{d.sku}</td>
                  <td className="px-3 py-2">{d.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d.serial}</td>
                  <td className="px-3 py-2 text-right">{d.qty}</td>
                  <td className="px-3 py-2">{d.huType}</td>
                  <td className="px-3 py-2 text-right">{d.huQty}</td>
                  <td className="px-3 py-2 font-mono text-xs">{d.rfid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Lịch sử gửi SAP/VERP">
        <OutApiTable rows={outApiLogs.filter((l) => l.code === "OUT-API3")} />
      </Section>

      <ConfirmModal open={!!confirm} onClose={() => setConfirm(null)} title="Xác nhận thực xuất" confirmLabel="Gửi T-AGI sang SAP" danger
        message={confirm === "__all__"
          ? `Sẽ gửi T-AGI sang SAP cho ${pending.length} order: ${pending.join(", ")}.`
          : `Sẽ gọi SAP sinh số phiếu xuất cho ${confirm}.`}
        onConfirm={() => { if (confirm === "__all__") pending.forEach(callSAP); else if (confirm) callSAP(confirm); setConfirm(null); }} />
    </OutTaskShell>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return <label className="block"><span className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}{required && <span className="text-destructive ml-0.5">*</span>}</span>{children}</label>;
}

/* ─── T-SIG: Ký VOffice (Xuất kho) ─── */
function OutTaskVOffice({ task }: { task: OutTask }) {
  const [preview, setPreview] = useState(false);
  const flowFiles = [
    { stt: 1, name: "Phiếu xuất kho (GI)", type: "PDF", source: "Hệ thống", required: true, status: "Đã đính kèm" },
    { stt: 2, name: "Biên bản bàn giao", type: "PDF", source: "Hệ thống", required: true, status: "Đã đính kèm" },
    { stt: 3, name: "Phiếu đóng gói (Packing list)", type: "PDF", source: "Hệ thống", required: true, status: "Đã đính kèm" },
  ];
  const extraFiles = [
    { stt: 1, name: "Bảng kê chi tiết hàng xuất.xlsx", type: "XLSX", source: "Người dùng", required: false, status: "Đã đính kèm" },
  ];
  const signers = [
    { stt: 1, order: 1, role: "Thủ trưởng đơn vị", name: "Nguyễn Văn A", unit: "Tổng công ty Giải pháp Doanh nghiệp", contact: "nguyenvana@viettel.com.vn", parallel: "--", showSig: "Có", status: "Chưa gửi", time: "--", note: "Ký, đóng dấu" },
    { stt: 2, order: 2, role: "Phụ trách kho",    name: "Trần Văn B",    unit: "Kho HN01", contact: "tranvanb@viettel.com.vn",   parallel: "--", showSig: "Có", status: "Chưa gửi", time: "--", note: "Ký, họ tên" },
    { stt: 3, order: 3, role: "Thủ kho",          name: "Lê Thị C",      unit: "Kho HN01", contact: "lethic@viettel.com.vn",     parallel: "--", showSig: "Có", status: "Chưa gửi", time: "--", note: "Ký, họ tên" },
  ];
  return (
    <OutTaskShell task={task} title="Ký VOffice (Xuất kho)"
      actions={<>
        <IButton onClick={() => toast.success("Đã lưu nháp phiếu trình ký")}>Lưu nháp</IButton>
        <IButton onClick={() => setPreview(true)}>Xem trước</IButton>
        <IButton variant="brand" icon={FileSignature} onClick={() => toast.success("Đã gửi trình ký VOffice")}>Gửi trình ký</IButton>
        <IButton variant="success" icon={CheckCircle2} onClick={() => toast.success("Task đã hoàn thành")}>Hoàn thành</IButton>
      </>}>

      {/* 1. Thông tin trình ký */}
      <Section title="Thông tin trình ký" actions={<a className="text-xs text-primary underline" href="#">(Xem các loại biểu mẫu văn bản)</a>}>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <Field label="Trích yếu nội dung văn bản (250)" required>
            <input className="w-full h-9 px-2 rounded border border-input text-sm" defaultValue={`Trình ký BBBG xuất kho ${task.orderId}`} />
          </Field>
          <Field label="Ngành" required>
            <select className="w-full h-9 px-2 rounded border border-input text-sm"><option>--- Chọn ---</option><option>Logistics</option><option>Kho vận</option></select>
          </Field>
          <Field label="Hình thức văn bản" required>
            <select className="w-full h-9 px-2 rounded border border-input text-sm"><option>--- Chọn ---</option><option>Biên bản</option><option>Phiếu xuất</option></select>
          </Field>
          <Field label="Ký hiệu văn bản" required>
            <input className="w-full h-9 px-2 rounded border border-input text-sm" defaultValue={`BBBG-${task.orderId}`} />
          </Field>
          <Field label="Nơi nhận" required>
            <input className="w-full h-9 px-2 rounded border border-input text-sm" placeholder="Nhập nơi nhận" />
          </Field>
          <Field label="Độ mật" required>
            <select className="w-full h-9 px-2 rounded border border-input text-sm"><option>Bình thường</option><option>Mật</option><option>Tối mật</option></select>
            <div className="text-[11px] text-destructive mt-1">Lưu ý: Chọn đúng độ mật trước khi trình</div>
          </Field>
          <Field label="Độ khẩn" required>
            <select className="w-full h-9 px-2 rounded border border-input text-sm"><option>Bình thường</option><option>Khẩn</option><option>Hỏa tốc</option></select>
          </Field>
          <div className="flex items-end gap-4 pb-1">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Ban hành tự động</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Văn bản Đảng</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Trả lời văn bản</label>
          </div>
        </div>
        <div className="mt-3">
          <Field label="Nội dung (500)" required>
            <textarea className="w-full h-20 p-2 rounded border border-input text-sm" placeholder="Nhập nội dung văn bản" />
          </Field>
        </div>
      </Section>

      {/* 2. Luồng trình ký */}
      <Section title="Luồng trình ký">
        <div className="grid grid-cols-4 gap-3 text-sm">
          <Field label="Luồng trình ký" required>
            <select className="w-full h-9 px-2 rounded border border-input text-sm"><option>LX-PXK-01 - Luồng ký phiếu xuất kho</option></select>
          </Field>
          <Field label="Mã luồng"><input className="w-full h-9 px-2 rounded border border-input text-sm bg-muted/40" readOnly defaultValue="LX-PXK-01" /></Field>
          <Field label="Tên luồng"><input className="w-full h-9 px-2 rounded border border-input text-sm bg-muted/40" readOnly defaultValue="Luồng ký phiếu xuất kho" /></Field>
          <Field label="Hình thức ký"><input className="w-full h-9 px-2 rounded border border-input text-sm bg-muted/40" readOnly defaultValue="Ký tuần tự" /></Field>
        </div>
      </Section>

      {/* 3. Danh sách file đính kèm */}
      <Section title="Danh sách file đính kèm">
        <div className="border border-primary/30 rounded-lg p-3 mb-4 bg-primary/5">
          <div className="text-sm font-semibold text-primary mb-2">📎 File bắt buộc – Hệ thống tự động đính kèm</div>
          <table className="w-full text-xs">
            <thead className="bg-muted/40"><tr>{["STT","Tên file","Loại file","Nguồn","Bắt buộc","Trạng thái","Thao tác"].map(h => <th key={h} className="p-2 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {flowFiles.map(f => (
                <tr key={f.stt} className="border-t border-border">
                  <td className="p-2">{f.stt}</td><td className="p-2">📄 {f.name}</td><td className="p-2">{f.type}</td>
                  <td className="p-2">{f.source}</td><td className="p-2"><IBadge s="success">Có</IBadge></td>
                  <td className="p-2"><IBadge s="success">✓ {f.status}</IBadge></td>
                  <td className="p-2"><span className="text-primary cursor-pointer mr-3">👁 Xem</span><span className="text-primary cursor-pointer">⬇ Tải</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-emerald-300 rounded-lg p-3 bg-emerald-50/40">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-emerald-700">➕ File bổ sung – Người dùng tải lên thêm nếu cần</div>
            <IButton variant="brand">⬆ Tải lên file bổ sung</IButton>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-muted/40"><tr>{["STT","Tên file","Loại file","Nguồn","Bắt buộc","Trạng thái","Thao tác"].map(h => <th key={h} className="p-2 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {extraFiles.map(f => (
                <tr key={f.stt} className="border-t border-border">
                  <td className="p-2">{f.stt}</td><td className="p-2">📊 {f.name}</td><td className="p-2">{f.type}</td>
                  <td className="p-2">{f.source}</td><td className="p-2"><IBadge>Không</IBadge></td>
                  <td className="p-2"><IBadge s="success">✓ {f.status}</IBadge></td>
                  <td className="p-2"><span className="text-primary cursor-pointer mr-3">👁 Xem</span><span className="text-primary cursor-pointer mr-3">⬇ Tải</span><span className="text-destructive cursor-pointer">🗑 Xóa</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 4. Danh sách cá nhân ký duyệt */}
      <Section title="Danh sách cá nhân ký duyệt" actions={<span className="text-xs text-muted-foreground">(Hiển thị theo luồng trình ký đã chọn - Không cho phép sửa, xóa)</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40"><tr>{["STT","Thứ tự ký","Vai trò ký","Người ký","Đơn vị","Email / SĐT","Hiển thị chữ ký","Trạng thái ký","Thời gian ký","Ghi chú"].map(h => <th key={h} className="p-2 text-left whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {signers.map(s => (
                <tr key={s.stt} className="border-t border-border">
                  <td className="p-2">{s.stt}</td><td className="p-2">{s.order}</td><td className="p-2">{s.role}</td>
                  <td className="p-2 font-medium">{s.name}</td><td className="p-2">{s.unit}</td><td className="p-2">{s.contact}</td>
                  <td className="p-2">{s.showSig}</td>
                  <td className="p-2"><IBadge>{s.status}</IBadge></td><td className="p-2">{s.time}</td><td className="p-2">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[11px] text-destructive mt-2">* Là trường thông tin bắt buộc nhập</div>
      </Section>

      <ConfirmModal open={preview} onClose={() => setPreview(false)} title="Xem trước phiếu trình ký" confirmLabel="Đóng"
        message={<div className="space-y-2 text-sm"><div className="aspect-[1/1.3] bg-muted/40 border border-border rounded p-4 text-xs">Preview phiếu trình ký với đầy đủ file đính kèm và luồng ký...</div></div>}
        onConfirm={() => setPreview(false)} />
    </OutTaskShell>
  );
}

/* ─── T-WH: Giám sát lệnh xuất (Thủ kho / Trưởng ca điều phối) ─── */
function OutTaskMonitor({ task }: { task: OutTask }) {
  const o = getOutOrder(task.orderId);
  const sub = useMemo(
    () => outTasks.filter((x) => x.orderId === task.orderId && x.code !== "T-WH"),
    [task.orderId],
  );

  const done = sub.filter((x) => x.status === "Hoàn thành").length;
  const doing = sub.filter((x) => x.status === "Đang xử lý").length;
  const overdue = sub.filter((x) => x.status === "Quá hạn" || (x.slaPct >= 100 && x.status !== "Hoàn thành")).length;
  const hasIssue = sub.filter((x) => x.status === "Phát sinh" || x.exception).length;
  const pct = sub.length ? Math.round((done / sub.length) * 100) : 0;

  // Hệ thống ngoài / chứng từ liên quan (Xuất)
  const docs = [
    { name: "BBBG (Biên bản bàn giao)", status: "Chờ ký VOffice", tone: "warning"     as const, time: "11:30", actor: "VOffice",      url: "#" },
    { name: "Phiếu xuất GI (SAP)",      status: o?.giDoc ? "Đã đồng bộ" : "Chờ tạo",  tone: o?.giDoc ? ("success" as const) : ("info" as const), time: "11:02", actor: "OUT-API3",   url: "#" },
    { name: "VOffice trình ký",         status: "Đã ký",        tone: "success"     as const, time: "11:35", actor: "GĐ kho",       url: "#" },
    { name: "Lệnh vận chuyển",          status: o?.hasTransport ? "Đã có" : "Không áp dụng", tone: o?.hasTransport ? ("success" as const) : ("info" as const), time: "10:50", actor: "Điều phối VT", url: "#" },
    { name: "File bằng chứng",          status: "Đã đồng bộ",   tone: "success"     as const, time: "10:55", actor: "WMS",          url: "#" },
    { name: "API đồng bộ SAP T-AGI",    status: "Lỗi đồng bộ",  tone: "destructive" as const, time: "10:58", actor: "OUT-API3",     url: "#" },
  ];

  // Diễn biến gần nhất (timeline)
  const events = [
    { time: "07:30", who: "SAP",                what: "Đồng bộ Order xuất về AIWS",                kind: "API",      tone: "info" },
    { time: "08:08", who: "Trần Văn Kho",       what: "Thủ kho xác nhận lệnh xuất",                kind: "Người",    tone: "success" },
    { time: "08:22", who: "Trần Đăng Khoa",     what: "Duyệt lịch giao việc T-APR",                kind: "Người",    tone: "success" },
    { time: "09:05", who: "Đỗ Minh Khôi",       what: "Bắt đầu picking tại khu G02",               kind: "Người",    tone: "info" },
    { time: "09:42", who: "Phạm Thị Hằng",      what: "Đóng kiện HU-OUT-201",                      kind: "Người",    tone: "success" },
    { time: "10:25", who: "Nguyễn Hữu An",      what: "Ghi nhận thiếu 2 BBU khi pick",             kind: "Phát sinh",tone: "warning" },
    { time: "10:58", who: "OUT-API3",           what: "Gọi T-AGI lỗi 500 (đã retry 2)",            kind: "API lỗi",  tone: "destructive" },
    { time: "11:30", who: "Trần Văn Kho",       what: "Ghi nhận phát sinh: VOffice chưa ký",       kind: "Giám sát", tone: "warning" },
  ];

  // Điểm cần chú ý
  const attentions = [
    { level: "Cao",        type: "Task quá hạn",       msg: "Task “Tải hàng lên xe” quá hạn 20 phút",        at: "10:25", tone: "destructive" as const, action: "Nhắc việc" },
    { level: "Cao",        type: "Lỗi API",            msg: "OUT-API3 T-AGI lỗi 500, đã retry 2 lần",        at: "10:58", tone: "destructive" as const, action: "Retry API" },
    { level: "Trung bình", type: "Chứng từ",           msg: "VOffice đang chờ ký BBBG",                       at: "11:30", tone: "warning"     as const, action: "Xem chi tiết" },
    { level: "Trung bình", type: "Phát sinh",          msg: "Thiếu 2 BBU so chứng từ pick",                   at: "10:25", tone: "warning"     as const, action: "Xem chi tiết" },
    { level: "Trung bình", type: "Vận chuyển",         msg: o?.vehicle?.vehicleStatus === "Quá ETA" ? "Xe quá ETA – chưa đến cổng" : "Xe đang trên đường tới dock", at: "11:10", tone: "warning" as const, action: "Xem chi tiết" },
  ];

  // Mốc quy trình (stepper)
  const taskStateMap = (st: string, slaPct: number, exception?: string) => {
    if (st === "Hoàn thành") return "done";
    if (st === "Phát sinh" || exception) return "issue";
    if (st === "Quá hạn" || slaPct >= 100) return "issue";
    if (st === "Đang xử lý") return "doing";
    if (st === "Pending" || st === "Chờ phân công") return "waiting-ext";
    return "todo";
  };
  const steps = sub.map((t) => ({
    label: t.type,
    state: taskStateMap(t.status, t.slaPct, t.exception) as "done" | "doing" | "waiting-ext" | "issue" | "todo",
  }));
  const stepTone: Record<string, string> = {
    done:          "bg-success text-success-foreground border-success",
    doing:         "bg-info text-info-foreground border-info",
    "waiting-ext": "bg-accent text-accent-foreground border-accent",
    issue:         "bg-destructive text-destructive-foreground border-destructive",
    todo:          "bg-muted text-muted-foreground border-border",
  };
  const stepLabel: Record<string, string> = {
    done: "Hoàn thành", doing: "Đang xử lý", "waiting-ext": "Chờ hệ thống ngoài",
    issue: "Có phát sinh", todo: "Chưa bắt đầu",
  };

  // Điều kiện hoàn tất giám sát
  const checks = [
    { ok: true,  label: "Tất cả task bắt buộc đã hoàn thành" },
    { ok: false, label: "Không còn task blocking (1 task quá hạn)" },
    { ok: false, label: "Không còn phát sinh nghiêm trọng chưa xử lý (2 phát sinh)" },
    { ok: false, label: "Phiếu xuất GI đã đồng bộ SAP hợp lệ" },
    { ok: false, label: "Chứng từ bắt buộc đã hoàn tất / ký (BBBG chờ ký)" },
    { ok: false, label: "Đồng bộ SAP/VOffice không còn lỗi chặn luồng (OUT-API3 lỗi)" },
    { ok: true,  label: "Order đạt điều kiện hoàn tất theo process profile SAP_OUTBOUND" },
  ];
  const allOk = checks.every((c) => c.ok);

  const [openIssue, setOpenIssue] = useState(false);
  const [openRemind, setOpenRemind] = useState(false);
  const [openCheck, setOpenCheck] = useState(false);
  const [monTab, setMonTab] = useState<"overview" | "subtasks" | "docs">("overview");
  const [openTimeline, setOpenTimeline] = useState(false);
  const [tlFilter, setTlFilter] = useState<string>("Tất cả");

  // Issue form state
  const [iType, setIType] = useState("Task chậm tiến độ");
  const [iLevel, setILevel] = useState<"Cao" | "Trung bình" | "Thấp">("Trung bình");
  const [iTask, setITask] = useState(sub[0]?.id || "");
  const [iSys, setISys] = useState("AIWS");
  const [iNote, setINote] = useState("");

  // Remind form state
  const [rTask, setRTask] = useState(sub.find((x) => x.status !== "Hoàn thành")?.id || sub[0]?.id || "");
  const [pausedTasks, setPausedTasks] = useState<Record<string, boolean>>({});
  const [pauseModal, setPauseModal] = useState<{ id: string; reason: string } | null>(null);
  const togglePause = (id: string) => {
    if (pausedTasks[id]) {
      setPausedTasks((p) => ({ ...p, [id]: false }));
      toast.success(`Đã tiếp tục task ${id} · KPI tiếp tục tính`);
    } else {
      setPauseModal({ id, reason: "" });
    }
  };
  const [rNote, setRNote] = useState("Vui lòng cập nhật tiến độ task.");
  const [rChannel, setRChannel] = useState<"Web" | "Mobile" | "Email">("Mobile");

  return (
    <OutTaskShell
      task={task}
      title="Giám sát lệnh xuất kho"
      subtitle={`Order ${task.orderId} · Process profile: ${o?.sourceDoc?.startsWith("ISS") ? "INTERNAL_OUTBOUND" : "SAP_OUTBOUND"} · Nguồn: ${o?.sourceDoc?.startsWith("ISS") ? "WMS" : "SAP"}`}
      hideSidebarExtras
      fullWidth
      completeDisabled={!allOk}
      completeLabel="Hoàn tất giám sát"
      actions={
        <>
          <IButton icon={AlertTriangle} onClick={() => setOpenIssue(true)}>Ghi nhận phát sinh</IButton>
          <IButton icon={Bell} onClick={() => setOpenRemind(true)}>Nhắc việc</IButton>
          <IButton icon={UserCheck}>Phân công lại</IButton>
          <IButton variant="brand" icon={CheckCircle2} onClick={() => setOpenCheck(true)}>Kiểm tra điều kiện hoàn tất</IButton>
        </>
      }
      rules={<RuleNote>
        <li>Màn giám sát lệnh chỉ <b>theo dõi & điều phối</b> – không nhập số lượng pick, đóng gói, ký BBBG hay thực xuất tại đây.</li>
        <li>Mọi cập nhật nghiệp vụ chi tiết phải thực hiện ở <b>task con tương ứng</b>.</li>
        <li>Nút <b>Hoàn tất giám sát</b> chỉ kích hoạt khi đủ điều kiện hoàn tất Order.</li>
      </RuleNote>}
    >
      {/* KPI tiến độ task */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KCard label="Tổng task"     value={String(sub.length).padStart(2, "0")} tone="brand"       icon={ListChecks} />
        <KCard label="Đã hoàn thành" value={String(done).padStart(2, "0")}       tone="success"     icon={CheckCircle2} />
        <KCard label="Đang xử lý"    value={String(doing).padStart(2, "0")}      tone="info"        icon={Activity} />
        <KCard label="Quá hạn"       value={String(Math.max(1, overdue)).padStart(2, "0")} tone="destructive" icon={Clock} />
        <KCard label="Có phát sinh"  value={String(Math.max(2, hasIssue)).padStart(2, "0")} tone="warning"   icon={AlertTriangle} />
      </div>

      {/* Tiến độ tổng thể + Stepper – full width */}
      <Section title={`Tiến độ xử lý Order (${sub.length} task)`}>
        <div className="flex items-center justify-between mb-1.5 text-[12px]">
          <div className="text-muted-foreground">
            <span className="font-semibold text-navy">{done}/{sub.length}</span> task hoàn thành
          </div>
          <div className="font-semibold text-brand tabular-nums text-sm">{pct}%</div>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand to-info transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-3 flex items-center gap-0.5 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <Fragment key={`${s.label}-${i}`}>
              <div className="flex flex-col items-center min-w-[72px] shrink-0">
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-semibold shadow-sm ${stepTone[s.state]}`}>
                  {s.state === "done" ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   s.state === "issue" ? <AlertTriangle className="w-3.5 h-3.5" /> :
                   s.state === "waiting-ext" ? <Clock className="w-3.5 h-3.5" /> :
                   s.state === "doing" ? <Activity className="w-3.5 h-3.5 animate-pulse" /> :
                   <span>{i + 1}</span>}
                </div>
                <div className="text-[10px] mt-1 font-medium text-foreground text-center leading-tight line-clamp-2 max-w-[80px]">{s.label}</div>
                <div className="text-[9px] text-muted-foreground">{stepLabel[s.state]}</div>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 min-w-[8px] ${s.state === "done" ? "bg-success" : "bg-border"}`} />}
            </Fragment>
          ))}
        </div>
      </Section>

      {/* Diễn biến gần nhất + Điểm cần chú ý – 70:30 */}
      <div className="grid grid-cols-[7fr_3fr] gap-4">
        <Section title="Diễn biến gần nhất"
          actions={<button onClick={() => setOpenTimeline(true)} className="text-xs text-brand hover:underline">Xem đầy đủ timeline →</button>}>
          <div className="relative pl-5 max-h-[360px] overflow-y-auto">
            <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
            {events.map((e, i) => {
              const dot =
                e.tone === "success"     ? "bg-success" :
                e.tone === "warning"     ? "bg-warning" :
                e.tone === "destructive" ? "bg-destructive" : "bg-info";
              return (
                <div key={i} className="relative mb-3 last:mb-0">
                  <span className={`absolute -left-3.5 top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-card ${dot}`} />
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="tabular-nums font-medium text-foreground">{e.time}</span>
                    <span>·</span>
                    <span>{e.who}</span>
                    <span className="ml-auto inline-block px-1.5 py-0.5 rounded bg-muted/60 text-[10px]">{e.kind}</span>
                  </div>
                  <div className="text-sm text-foreground mt-0.5">{e.what}</div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title={`Điểm cần chú ý (${attentions.length})`}>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {attentions.map((a, i) => {
              const toneCls =
                a.tone === "destructive" ? "border-destructive/30 bg-destructive/5" :
                a.tone === "warning"     ? "border-warning/30 bg-warning/5" :
                                            "border-info/30 bg-info/5";
              const dot =
                a.tone === "destructive" ? "bg-destructive" :
                a.tone === "warning"     ? "bg-warning" : "bg-info";
              return (
                <div key={i} className={`p-2.5 rounded-md border ${toneCls}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      <span className="font-semibold text-foreground">{a.level}</span>
                      <span className="text-muted-foreground">· {a.type}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground tabular-nums">{a.at}</span>
                  </div>
                  <div className="text-sm text-foreground">{a.msg}</div>
                  <div className="mt-1.5 text-right">
                    <button className="text-[11px] text-brand hover:underline font-medium">{a.action} →</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Tabs: Tổng quan / Task con / Chứng từ & tích hợp */}
      <Section title="Chi tiết giám sát Order">
        <div className="flex items-center gap-1 border-b border-border mb-4 -mt-1">
          {[
            { id: "overview", label: "Tổng quan Order" },
            { id: "subtasks", label: `Task con (${sub.length})` },
            { id: "docs",     label: "Chứng từ & tích hợp" },
          ].map((t) => (
            <button key={t.id} onClick={() => setMonTab(t.id as any)}
              className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
                monTab === t.id
                  ? "border-brand text-brand"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {monTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              ["Mã order", o?.id],
              ["Loại order", "Xuất kho"],
              ["Kho xuất", o?.warehouse || "HN01"],
              ["Đơn vị nhận", o?.receiver || "—"],
              ["Ngày kế hoạch xuất", formatDateTime(o?.plannedDate) || "—"],
              ["Tổng số dòng", o?.lines ?? "—"],
              ["Tổng số lượng", o?.qty ?? "—"],
              ["Phiếu xuất GI", o?.giDoc || "—"],
              ["Hệ thống nguồn", o?.sourceDoc?.startsWith("ISS") ? "WMS" : "SAP"],
              ["Chứng từ nguồn", o?.sourceDoc || "—"],
              ["Đồng bộ hệ thống", <IBadge key="s">Đã đồng bộ</IBadge>],
              ["Ghi chú điều phối", "Ưu tiên trước 14:00"],
            ].map(([k, v], i) => (
              <div key={i} className="p-2.5 rounded-md bg-muted/30 border border-border">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{k}</div>
                <div className="font-medium text-foreground mt-0.5 break-words">{v as any}</div>
              </div>
            ))}
          </div>
        )}

        {monTab === "subtasks" && (
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground border-b border-border">
                  <th className="text-left px-3 py-2">Mã task</th>
                  <th className="text-left px-3 py-2">Tên task</th>
                  <th className="text-left px-3 py-2">Người thực hiện</th>
                  <th className="text-left px-3 py-2">Trạng thái</th>
                  <th className="text-left px-3 py-2">SLA</th>
                  <th className="text-left px-3 py-2">Bắt đầu</th>
                  <th className="text-left px-3 py-2">Hoàn thành</th>
                  <th className="text-left px-3 py-2">Blocking</th>
                  <th className="text-right px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sub.map((t) => {
                  const isBlock = t.status === "Quá hạn" || t.slaPct >= 100 || t.exception;
                  const rowCls = isBlock ? "bg-destructive/5" : t.status === "Đang xử lý" ? "bg-info/5" : "";
                  return (
                    <tr key={t.id} className={`border-b border-border/60 hover:bg-muted/30 ${rowCls}`}>
                      <td className="px-3 py-2"><Link to={`/outbound/tasks/${t.id}`} className="text-brand font-medium">{t.id}</Link></td>
                      <td className="px-3 py-2">{t.type}</td>
                      <td className="px-3 py-2">{t.owner === "—" ? <span className="text-warning italic">Chưa phân công</span> : t.owner}</td>
                      <td className="px-3 py-2">{pausedTasks[t.id] ? <span className="inline-flex items-center gap-1 text-[11px] px-2 h-6 rounded-full bg-warning/10 text-warning font-medium"><Pause className="w-3 h-3" />Tạm dừng</span> : <IBadge>{t.status}</IBadge>}</td>
                      <td className="px-3 py-2"><SLAPill pct={t.slaPct} label={t.sla} /></td>
                      <td className="px-3 py-2 text-[12px] tabular-nums text-muted-foreground">{t.startAt || "—"}</td>
                      <td className="px-3 py-2 text-[12px] tabular-nums text-muted-foreground">{t.endAt || "—"}</td>
                      <td className="px-3 py-2">
                        {isBlock
                          ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive"><AlertTriangle className="w-3 h-3" /> Blocking</span>
                          : <span className="text-[11px] text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex gap-1 flex-wrap justify-end">
                          <Link to={`/outbound/tasks/${t.id}`}><IButton size="sm" icon={Eye}>Xem</IButton></Link>
                          {t.status !== "Hoàn thành" && t.status !== "Chưa bắt đầu" && t.status !== "Chờ phân công" && (
                            pausedTasks[t.id]
                              ? <IButton size="sm" icon={Play} variant="brand" onClick={() => togglePause(t.id)}>Tiếp tục</IButton>
                              : <IButton size="sm" icon={Pause} variant="outline" onClick={() => togglePause(t.id)}>Dừng việc</IButton>
                          )}
                          <IButton size="sm" icon={Bell} onClick={() => { setRTask(t.id); setOpenRemind(true); }}>Nhắc</IButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {monTab === "docs" && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase text-muted-foreground border-b border-border">
                <th className="text-left px-3 py-2">Tên / Hệ thống</th>
                <th className="text-left px-3 py-2">Trạng thái</th>
                <th className="text-left px-3 py-2">Cập nhật cuối</th>
                <th className="text-left px-3 py-2">Người / Hệ thống</th>
                <th className="text-right px-3 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => {
                const tone =
                  d.tone === "success"     ? "bg-success/10 text-success" :
                  d.tone === "warning"     ? "bg-warning/10 text-warning" :
                  d.tone === "destructive" ? "bg-destructive/10 text-destructive" :
                                              "bg-info/10 text-info";
                return (
                  <tr key={i} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium text-foreground">{d.name}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${tone}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" /> {d.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[12px] tabular-nums text-muted-foreground">{d.time}</td>
                    <td className="px-3 py-2 text-[12px] text-muted-foreground">{d.actor}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex gap-1">
                        <a href={d.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-brand/10 text-brand hover:bg-brand/20 transition-colors"><Eye className="w-3 h-3" />Xem</a>
                        <a href={d.url} download className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"><Download className="w-3 h-3" />Tải về</a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Section>

      {/* Điều kiện hoàn tất */}
      <Section title="Điều kiện hoàn tất Order">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {checks.map((c, i) => (
            <div key={i} className={`flex items-center gap-2 p-2.5 rounded-md border ${c.ok ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"}`}>
              {c.ok
                ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                : <XCircle className="w-4 h-4 text-warning shrink-0" />}
              <span className={`text-sm ${c.ok ? "text-foreground" : "text-foreground font-medium"}`}>{c.label}</span>
              <span className={`ml-auto text-[10px] uppercase font-semibold ${c.ok ? "text-success" : "text-warning"}`}>{c.ok ? "Đạt" : "Chưa đạt"}</span>
            </div>
          ))}
        </div>
        {!allOk && (
          <div className="mt-3 p-2.5 rounded-md bg-destructive/5 border border-destructive/20 text-[12px] text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Còn {checks.filter((c) => !c.ok).length} điều kiện chưa đạt – nút <b className="mx-1">Hoàn tất giám sát</b> tạm thời bị khoá.
          </div>
        )}
      </Section>

      {/* Modal: Ghi nhận phát sinh */}
      <ConfirmModal open={openIssue} onClose={() => setOpenIssue(false)} title="Ghi nhận phát sinh cấp Order"
        message={
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Loại phát sinh *</div>
                <select value={iType} onChange={(e) => setIType(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm">
                  {["Task chậm tiến độ","Lỗi hệ thống tích hợp","Thiếu/sai chứng từ","Phát sinh số lượng","Từ chối ký VOffice","Xe quá ETA","Khác"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Mức độ *</div>
                <select value={iLevel} onChange={(e) => setILevel(e.target.value as any)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm">
                  <option>Cao</option><option>Trung bình</option><option>Thấp</option>
                </select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Task liên quan</div>
                <select value={iTask} onChange={(e) => setITask(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm">
                  {sub.map((s) => <option key={s.id} value={s.id}>{s.id} – {s.type}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Hệ thống liên quan</div>
                <select value={iSys} onChange={(e) => setISys(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm">
                  {["AIWS","SAP","VOffice","TMS","Khác"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Nội dung phát sinh *</div>
              <textarea value={iNote} onChange={(e) => setINote(e.target.value)} rows={3}
                className="w-full p-3 rounded-md border border-input text-sm" placeholder="Mô tả ngắn gọn nội dung phát sinh..." />
            </div>
            <OutEvidenceField />
            <div className="text-[11px] text-muted-foreground">
              Người ghi nhận: <b>{task.owner}</b> · Thời gian: <b>tự động</b>
            </div>
          </div>
        }
        confirmLabel="Ghi nhận phát sinh"
        onConfirm={() => { toast.success(`Đã ghi nhận phát sinh cho ${task.orderId}`); setOpenIssue(false); }}
      />

      {/* Modal: Nhắc việc */}
      <ConfirmModal open={openRemind} onClose={() => setOpenRemind(false)} title="Gửi nhắc việc"
        message={
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Task cần nhắc *</div>
              <select value={rTask} onChange={(e) => setRTask(e.target.value)} className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm">
                {sub.map((s) => <option key={s.id} value={s.id}>{s.id} – {s.type} ({s.owner})</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Kênh thông báo</div>
              <div className="flex gap-2">
                {(["Web","Mobile","Email"] as const).map((c) => (
                  <button key={c} onClick={() => setRChannel(c)}
                    className={`flex-1 h-9 rounded-md border text-sm font-medium ${rChannel === c ? "border-brand bg-brand/5 text-brand" : "border-border bg-card text-foreground hover:bg-muted"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Nội dung nhắc việc *</div>
              <textarea value={rNote} onChange={(e) => setRNote(e.target.value)} rows={3} className="w-full p-3 rounded-md border border-input text-sm" />
            </div>
          </div>
        }
        confirmLabel="Gửi nhắc việc"
        onConfirm={() => { toast.success(`Đã gửi nhắc việc tới ${rTask} (${rChannel})`); setOpenRemind(false); }}
      />

      {/* Modal: Dừng việc – bắt buộc nhập lý do */}
      <ConfirmModal open={!!pauseModal} onClose={() => setPauseModal(null)} title="Dừng thực hiện task"
        message={
          <div className="space-y-3 text-sm">
            <p>Task <b>{pauseModal?.id}</b> sẽ tạm dừng, KPI ngừng đếm cho đến khi bấm "Tiếp tục".</p>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Lý do dừng việc *</div>
              <textarea value={pauseModal?.reason || ""} onChange={(e) => setPauseModal((p) => p ? { ...p, reason: e.target.value } : p)} rows={3} className="w-full p-3 rounded-md border border-input text-sm" placeholder="Ví dụ: chờ thiết bị, đổi ca..." />
            </div>
          </div>
        }
        confirmLabel="Dừng việc"
        onConfirm={() => {
          if (!pauseModal) return;
          if (!pauseModal.reason.trim()) { toast.error("Vui lòng nhập lý do dừng việc"); return; }
          setPausedTasks((p) => ({ ...p, [pauseModal.id]: true }));
          toast.success(`Đã dừng task ${pauseModal.id} · KPI tạm dừng đếm`);
          setPauseModal(null);
        }}
      />

      {/* Modal: Kiểm tra điều kiện hoàn tất */}
      <ConfirmModal open={openCheck} onClose={() => setOpenCheck(false)} title="Kiểm tra điều kiện hoàn tất Order"
        message={
          <div className="space-y-2 text-sm">
            {checks.map((c, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-md border border-border">
                {c.ok ? <CheckCircle2 className="w-4 h-4 text-success mt-0.5" /> : <XCircle className="w-4 h-4 text-warning mt-0.5" />}
                <div className="flex-1">
                  <div className={c.ok ? "text-foreground" : "text-foreground font-medium"}>{c.label}</div>
                  {!c.ok && <button className="text-[11px] text-brand hover:underline mt-0.5">Đi tới mục liên quan →</button>}
                </div>
                <span className={`text-[10px] uppercase font-semibold ${c.ok ? "text-success" : "text-warning"}`}>{c.ok ? "Đạt" : "Chưa đạt"}</span>
              </div>
            ))}
            {!allOk && (
              <div className="text-[12px] text-warning bg-warning/5 border border-warning/20 rounded p-2">
                Order chưa đủ điều kiện hoàn tất. Xử lý các mục “Chưa đạt” trước khi đóng giám sát.
              </div>
            )}
          </div>
        }
        confirmLabel={allOk ? "Hoàn tất giám sát" : "Đóng"}
        onConfirm={() => { if (allOk) toast.success(`Đã hoàn tất giám sát ${task.orderId}`); setOpenCheck(false); }}
      />

      {/* Modal: Xem đầy đủ timeline */}
      <ConfirmModal open={openTimeline} onClose={() => setOpenTimeline(false)}
        title={`Timeline đầy đủ – ${task.orderId}`}
        confirmLabel="Đóng"
        onConfirm={() => setOpenTimeline(false)}
        message={
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Lọc theo loại:</span>
              {["Tất cả", "API", "Người", "Phát sinh", "Giám sát", "API lỗi"].map((f) => (
                <button key={f} onClick={() => setTlFilter(f)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                    tlFilter === f
                      ? "bg-brand text-brand-foreground border-brand"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                  }`}>{f}</button>
              ))}
              <span className="ml-auto text-[11px] text-muted-foreground">
                {events.filter((e) => tlFilter === "Tất cả" || e.kind === tlFilter).length} / {events.length} sự kiện
              </span>
            </div>

            <div className="relative pl-5 max-h-[480px] overflow-y-auto pr-1">
              <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
              {[...events]
                .filter((e) => tlFilter === "Tất cả" || e.kind === tlFilter)
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((e, i) => {
                  const dot =
                    e.tone === "success"     ? "bg-success" :
                    e.tone === "warning"     ? "bg-warning" :
                    e.tone === "destructive" ? "bg-destructive" : "bg-info";
                  return (
                    <div key={i} className="relative mb-3 last:mb-0">
                      <span className={`absolute -left-3.5 top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-card ${dot}`} />
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="tabular-nums font-medium text-foreground">{e.time}</span>
                        <span>·</span>
                        <span>{e.who}</span>
                        <span className="ml-auto inline-block px-1.5 py-0.5 rounded bg-muted/60 text-[10px]">{e.kind}</span>
                      </div>
                      <div className="text-sm text-foreground mt-0.5">{e.what}</div>
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Bắt đầu giám sát: <b className="text-foreground">07:00</b>
              <span>·</span>
              Cập nhật cuối: <b className="text-foreground">{events[events.length - 1]?.time}</b>
              <button className="ml-auto text-brand hover:underline">Xuất CSV</button>
            </div>
          </div>
        }
      />
    </OutTaskShell>
  );
}

/* ─── T-SCR: Giám sát an ninh (Bảo vệ cổng) ─── */
function OutTaskSecurity({ task }: { task: OutTask }) {
  const o = getOutOrder(task.orderId);
  const realTrips = getTripsForOutbound(task.orderId);
  const demoTrips = getSecurityDemoTrips("OUT");
  const trips = [...realTrips, ...demoTrips];
  return (
    <OutTaskShell task={task} title="Giám sát an ninh cổng" hideSidebarExtras fullWidth
      completeLabel="Đóng phiên giám sát"
      rules={<RuleNote>
        <li>Bảo vệ chỉ thao tác <b>Vào cổng / Ra cổng / Phát sinh</b> – các mốc Vào dock / Ra dock do Thủ kho phụ trách.</li>
        <li>Bắt buộc có ảnh xe & biển số khi xe vào cổng và ảnh niêm phong khi xe rời kho.</li>
        <li>Phát hiện bất thường → tạo exception và báo Thủ kho ngay.</li>
      </RuleNote>}>
      <Section title="Vận chuyển">
        <VehicleGatePanel
          trips={trips}
          requireGateBefore={o?.hasTransport ? "load" : undefined}
          warehouseCode={o?.warehouse}
          interactive
        />
      </Section>
    </OutTaskShell>
  );
}

function OutTaskGeneric({ task }: { task: OutTask }) {
  return (
    <OutTaskShell task={task} title={task.type} showOrderSummary>
      <Section title="Thông tin task"><div className="text-sm text-muted-foreground">Chi tiết task {task.type} cho {task.orderId}. Evidence được thao tác trên Mobile App.</div></Section>
    </OutTaskShell>
  );
}

/* ─────────────── 9. API MONITOR ─────────────── */
export function OutboundApiMonitor() {
  const [tab, setTab] = useState("all");
  const filtered = outApiLogs.filter((l) => tab === "all" || (tab === "error" && !["200","201"].includes(l.status)));
  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "API Monitor" }]}>
      <PageHeader title="API Monitor (Xuất kho)" subtitle="Theo dõi đồng bộ SAP/VERP, VOffice realtime cho luồng xuất"
        actions={<IButton variant="brand" icon={RefreshCw}>Retry tất cả lỗi</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {["OUT-API1","OUT-API2","OUT-API3","API-VOFFICE"].map((c) => {
          const rows = outApiLogs.filter((l) => l.code === c);
          const err = rows.filter((l) => !["200","201"].includes(l.status)).length;
          return <KCard key={c} label={c} value={rows.length} hint={err > 0 ? `${err} lỗi` : "OK"} tone={err > 0 ? "destructive" : "success"} />;
        })}
      </div>

      <Section title="">
        <div className="flex gap-1 border-b border-border -mt-3 -mx-5 px-5 mb-3">
          {[["all","Tất cả",outApiLogs.length],["error","Lỗi",outApiLogs.filter(l=>!["200","201"].includes(l.status)).length]].map(([id,l,n]) => (
            <button key={id as string} onClick={() => setTab(id as string)} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab===id?"border-brand text-brand":"border-transparent text-muted-foreground"}`}>{l as string} ({n as number})</button>
          ))}
        </div>
        <OutApiTable rows={filtered} />
        <RuleNote>
          <li>Retry phải ghi log – không retry nếu input chưa được sửa.</li>
          <li>API lỗi hiển thị rõ ảnh hưởng order/task để team xử lý.</li>
        </RuleNote>
      </Section>
    </AppShell>
  );
}

/* ─────────────── 10. EXCEPTION MANAGEMENT ─────────────── */
export function OutboundExceptions() {
  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "Xử lý phát sinh" }]}>
      <PageHeader title="Quản lý phát sinh (Xuất kho)" subtitle="Theo dõi và xử lý mọi exception phát sinh trong luồng xuất kho"
        actions={<IButton variant="brand" icon={Download}>Export</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-5">
        <KCard label="Tổng phát sinh" value={outExceptions.length} tone="brand" />
        <KCard label="Cao" value={outExceptions.filter((e) => e.severity === "high").length} tone="destructive" />
        <KCard label="Trung bình" value={outExceptions.filter((e) => e.severity === "med").length} tone="warning" />
        <KCard label="Thấp" value={outExceptions.filter((e) => e.severity === "low").length} />
        <KCard label="Đang xử lý" value={outExceptions.filter((e) => e.status === "Đang xử lý").length} tone="info" />
        <KCard label="Đã xử lý" value={outExceptions.filter((e) => e.status === "Đã xử lý").length} tone="success" />
      </div>

      <Section title="Danh sách phát sinh">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Mã EX</th><th className="px-3 py-2 text-left font-medium">Nhóm</th>
            <th className="px-3 py-2 text-left font-medium">Tham chiếu</th><th className="px-3 py-2 text-left font-medium">Mức độ</th>
            <th className="px-3 py-2 text-left font-medium">Phụ trách</th><th className="px-3 py-2 text-left font-medium">Trạng thái</th>
            <th className="px-3 py-2 text-left font-medium">Deadline</th><th className="px-3 py-2 text-left font-medium">Ghi chú</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr></thead>
          <tbody>{outExceptions.map((e) => (
            <tr key={e.id} className="border-b border-border/60 hover:bg-muted/30">
              <td className="px-3 py-2 font-medium text-navy">{e.id}</td>
              <td className="px-3 py-2">{e.group}</td>
              <td className="px-3 py-2 text-muted-foreground">{e.ref}</td>
              <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${e.severity === "high" ? "bg-destructive/10 text-destructive" : e.severity === "med" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{e.severity.toUpperCase()}</span></td>
              <td className="px-3 py-2">{e.owner}</td>
              <td className="px-3 py-2"><IBadge>{e.status}</IBadge></td>
              <td className="px-3 py-2 text-muted-foreground">{formatDateTime(e.deadline) || e.deadline}</td>
              <td className="px-3 py-2 max-w-[260px] truncate" title={e.note}>{e.note}</td>
              <td className="px-3 py-2 text-right"><IButton size="sm">Xử lý</IButton></td>
            </tr>
          ))}</tbody>
        </table>
      </Section>
    </AppShell>
  );
}

/* ─────────────── 11. CONFIGURATION ─────────────── */
export function OutboundConfig() {
  const flows = [
    { code: "OUT-VC", name: "Xuất kho có vận chuyển", steps: ["Lên lịch xe","Đóng gói","Kiểm hàng / Ký BBBG","VOffice","Tải xe / Bàn giao"], on: [true,true,true,true,true] },
    { code: "OUT-OTH", name: "Xuất kho khác (nội bộ / cấp phát / điều chuyển)", steps: ["Lên lịch xe","Đóng gói","Kiểm hàng / Ký BBBG","VOffice","Tải xe / Bàn giao"], on: [false,true,true,true,false] },
  ];

  return (
    <AppShell breadcrumb={[{ label: "Xuất kho", to: "/outbound" }, { label: "Cấu hình module Xuất kho" }]}>
      <PageHeader title="Cấu hình module Xuất kho" subtitle="Cấu hình luồng, KPI, task template, phân quyền, API mapping cho module Xuất kho" />
      <div className="grid grid-cols-12 gap-4">
        <Section title="Luồng xuất đang dùng" className="col-span-12">
          <div className="space-y-3">
            {flows.map((l) => (
              <div key={l.code} className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-3"><IBadge>{l.code}</IBadge><span className="font-semibold text-navy">{l.name}</span></div>
                <div className="flex flex-wrap gap-2">
                  {l.steps.map((s, i) => (
                    <label key={s} className={`px-3 py-1.5 rounded-md border text-xs font-medium cursor-pointer ${l.on[i] ? "border-success bg-success/5 text-success" : "border-border text-muted-foreground"}`}>
                      <input type="checkbox" defaultChecked={l.on[i]} className="mr-1.5" />{s}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Task template áp dụng cho luồng xuất" className="col-span-12">
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2 text-left font-medium">Mã task</th><th className="px-3 py-2 text-left font-medium">Tên task</th>
              <th className="px-3 py-2 text-left font-medium">Loại</th><th className="px-3 py-2 text-left font-medium">Luồng áp dụng</th>
              <th className="px-3 py-2 text-left font-medium">Vị trí cho phép</th><th className="px-3 py-2 text-right font-medium">KPI (p)</th><th className="px-3 py-2 text-left font-medium">Phụ thuộc</th>
            </tr></thead>
            <tbody>{taskCatalog.filter((t) => t.flows.some((f) => f === "OUT-VC" || f === "OUT-OTH")).map((t) => (
              <tr key={t.code} className="border-b border-border/60">
                <td className="px-3 py-2 font-medium text-navy">{t.code}</td>
                <td className="px-3 py-2">{t.name}</td>
                <td className="px-3 py-2"><IBadge>{t.kind}</IBadge></td>
                <td className="px-3 py-2 text-[11px]">{t.flows.filter((f) => f === "OUT-VC" || f === "OUT-OTH").map((f) => f === "OUT-VC" ? "Xuất kho vận chuyển" : "Xuất kho khác").join(", ")}</td>
                <td className="px-3 py-2 text-[11px]">{t.allowedPositions.join(", ")}</td>
                <td className="px-3 py-2 text-right">{t.kpiMin}</td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">{t.dependsOn.join(", ") || "—"}</td>
              </tr>
            ))}</tbody>
          </table>
        </Section>
      </div>
    </AppShell>
  );
}

/* ─────────────── 12. DASHBOARD CHUNG ─────────────── */
export function CombinedDashboard() {
  return (
    <AppShell breadcrumb={[{ label: "Dashboard chung" }]}>
      <PageHeader title="Dashboard vận hành kho" subtitle="Tổng quan nhập + xuất kho realtime"
        actions={<IButton variant="brand" icon={RefreshCw}>Làm mới</IButton>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KCard label="Lệnh nhập hôm nay" value={47} tone="brand" icon={Package} />
        <KCard label="Lệnh xuất hôm nay" value={28} tone="brand" icon={Truck} />
        <KCard label="Chờ xác nhận (N+X)" value={10} tone="warning" icon={ClipboardList} />
        <KCard label="Chờ phân công" value={5} tone="warning" icon={Users} />
        <KCard label="Task quá hạn" value={7} tone="destructive" icon={Clock} />
        <KCard label="Lỗi API SAP" value={3} tone="destructive" icon={Zap} />
        <KCard label="Chờ KCS" value={5} tone="warning" icon={CheckCircle2} />
        <KCard label="KCS không đạt" value={1} tone="destructive" icon={AlertTriangle} />
        <KCard label="Chờ ký VOffice" value={7} tone="warning" icon={FileSignature} />
        <KCard label="Từ chối ký" value={1} tone="destructive" icon={XCircle} />
        <KCard label="Chờ lưu trữ" value={3} tone="info" icon={MapPin} />
        <KCard label="Chờ tải xe" value={2} tone="info" icon={Truck} />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-6">
        <Section title="Nhập kho – Cần xử lý ngay" className="col-span-12 lg:col-span-6"
          actions={<Link to="/inbound" className="text-xs text-brand">Mở Nhập kho →</Link>}>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between p-2 rounded bg-muted/40"><span>INB-2026-00119 · API6 lỗi 502</span><IBadge>API Error</IBadge></li>
            <li className="flex justify-between p-2 rounded bg-muted/40"><span>INB-2026-00122 · KCS quá hạn</span><IBadge>Waiting KCS</IBadge></li>
            <li className="flex justify-between p-2 rounded bg-muted/40"><span>INB-2026-00128 · KCS Major</span><IBadge>KCS Failed</IBadge></li>
            <li className="flex justify-between p-2 rounded bg-muted/40"><span>INB-2026-00129 · VOffice từ chối</span><IBadge>Waiting VOffice</IBadge></li>
          </ul>
        </Section>
        <Section title="Xuất kho – Cần xử lý ngay" className="col-span-12 lg:col-span-6"
          actions={<Link to="/outbound" className="text-xs text-brand">Mở Xuất kho →</Link>}>
          <ul className="space-y-2 text-xs">
            {outAlerts.slice(0, 5).map((a) => <li key={a.id} className="flex justify-between p-2 rounded bg-muted/40">
              <span>{a.ref} · {a.msg}</span><IBadge>{a.kind}</IBadge>
            </li>)}
          </ul>
        </Section>
      </div>
      <RuleNote>
        <li>Dashboard chung tổng hợp KPI 2 module. Drill-down vào lệnh để xem chứng từ, API log, transaction theo Order.</li>
        <li>Mọi trạng thái đều truy vết theo Order – không tách menu riêng cho chứng từ/log/transaction.</li>
      </RuleNote>
    </AppShell>
  );
}
