import { Fragment, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { IBadge, KCard, SLAPill, Section, IButton, PageHeader, ConfirmModal, Drawer, RuleNote, TaskInfoHeader, OrderSummaryCard, AssignTaskModal } from "@/components/inbound/bits";
import { MultiSelectDropdown, SingleSelectDropdown } from "@/components/ui-bits";
import {
  orders, inboundKPI2, leadTime, orderTypeMix, alerts, supplierIssues, staffPerformance,
  tasks, apiLogs, txns, exceptions, getOrder, getTask, Order, Task, ApiLog,
  employees, positions, taskCatalog, mappings, orderTasks, getEmployee, getPosition,
} from "@/data/inbound";
import { getTripForInbound, getTripsForInbound, getSecurityDemoTrips, VEHICLE_STATUS_TONE, VEHICLE_EXCEPTION_LABEL } from "@/data/vehicles";
import { VehicleGatePanel } from "@/components/VehicleGatePanel";
import HistoryTab from "@/components/HistoryTab";
import { inboundStatusVi } from "@/lib/statusLabels";
import { formatDateTime } from "@/lib/utils";
import {
  Search, Filter, Download, Plus, RefreshCw, Eye, CheckCircle2, XCircle, Truck, Package,
  ClipboardList, ShieldCheck, FileSignature, Boxes, MapPin, AlertTriangle, Settings,
  Activity, Zap, Bot, ArrowRight, Camera, ScanLine, Printer, Layers, Clock, Bell, Edit3, Play, Pause, Brain,
  Users, UserCheck, Briefcase, Network, ListChecks, GitBranch, Send, PenLine, ChevronRight, ChevronLeft,
} from "lucide-react";

/* ─────────────────────────────────── 1. DASHBOARD ─────────────────────────────────── */
export function InboundDashboard() {
  const k = inboundKPI2;
  const kpis = [
    { label: "Lệnh nhập hôm nay", value: k.todayTotal, tone: "brand" as const, icon: Package },
    { label: "Chờ xác nhận", value: k.waitingConfirm, tone: "warning" as const, icon: ClipboardList },
    { label: "Đã từ chối", value: k.rejected, tone: "destructive" as const, icon: XCircle },
    { label: "AI chưa tìm được NS", value: k.waitingAssign, tone: "warning" as const, icon: Users },
    { label: "AI đang plan", value: k.planning, tone: "info" as const, icon: Bot },
    { label: "Đang nhận hàng", value: k.receiving, tone: "info" as const, icon: Truck },
    { label: "Đang kiểm hàng", value: k.checking, tone: "info" as const, icon: ScanLine },
    { label: "Chờ KCS", value: k.waitingKCS, tone: "warning" as const, icon: ShieldCheck },
    { label: "KCS không đạt", value: k.kcsFailed, tone: "destructive" as const, icon: AlertTriangle },
    { label: "Chờ thực nhập", value: k.waitingGR, tone: "info" as const, icon: CheckCircle2 },
    { label: "Lỗi API GR", value: k.grApiError, tone: "destructive" as const, icon: Zap },
    { label: "Chờ ký VOffice", value: k.waitingVOffice, tone: "warning" as const, icon: FileSignature },
    { label: "Đang đóng gói", value: k.packing, tone: "info" as const, icon: Boxes },
    { label: "Chờ lưu trữ", value: k.waitingPutaway, tone: "info" as const, icon: MapPin },
    { label: "Hoàn thành", value: k.completed, tone: "success" as const, icon: CheckCircle2 },
    { label: "Task quá hạn", value: k.overdue, tone: "destructive" as const, icon: Clock },
  ];
  const maxLT = Math.max(...leadTime.flatMap((l) => [l.target, l.actual]));
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Dashboard" }]}>
      <PageHeader title="Dashboard Nhập kho" subtitle="Tổng quan realtime toàn bộ hoạt động nhập kho – Kho HN01 · Ca S1 · 2026-05-18"
        actions={<><IButton icon={RefreshCw}>Làm mới</IButton><IButton variant="brand" icon={Download}>Xuất báo cáo</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpis.map((k) => <KCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-12 gap-4 mb-6">
        <Section title="Lệnh nhập theo loại" className="col-span-12 lg:col-span-4">
          <div className="flex items-center gap-6">
            <DonutMulti data={orderTypeMix} />
            <div className="space-y-2 text-sm">
              {orderTypeMix.map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded" style={{ background: d.color }} />
                  <span className="text-muted-foreground w-20">{d.label}</span>
                  <span className="font-semibold text-navy">{d.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-border text-xs text-muted-foreground">Tổng: {orderTypeMix.reduce((a, b) => a + b.value, 0)} lệnh</div>
            </div>
          </div>
        </Section>

        <Section title="Lead time từng công đoạn (phút)" className="col-span-12 lg:col-span-8">
          <div className="space-y-2.5">
            {leadTime.map((l) => {
              const over = l.actual > l.target;
              return (
                <div key={l.stage} className="flex items-center gap-3 text-xs">
                  <div className="w-24 text-muted-foreground">{l.stage}</div>
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
        <Section title="Cảnh báo realtime" className="col-span-12 lg:col-span-5" actions={<Link to="/inbound/exceptions" className="text-xs text-brand hover:underline">Xem tất cả →</Link>}>
          <div className="space-y-2">
            {alerts.map((a) => (
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

        <Section title="Lệnh cần xử lý ngay" className="col-span-12 lg:col-span-7" actions={<Link to="/inbound/orders" className="text-xs text-brand hover:underline">Đi tới DO Pool →</Link>}>
          <table className="w-full text-xs">
            <thead><tr className="text-left text-muted-foreground border-b border-border">
              <th className="pb-2 font-medium">Mã lệnh</th><th className="pb-2 font-medium">Loại</th><th className="pb-2 font-medium">Trạng thái</th><th className="pb-2 font-medium">SLA</th><th className="pb-2 font-medium">Phụ trách</th>
            </tr></thead>
            <tbody>
              {orders.filter((o) => ["API Error", "Waiting Confirm", "Pending", "KCS Failed", "Waiting VOffice"].includes(o.status)).slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-border/60">
                  <td className="py-2"><Link to={`/inbound/orders/${o.id}/confirm`} className="text-brand font-medium hover:underline">{o.id}</Link></td>
                  <td className="py-2"><IBadge>{o.type}</IBadge></td>
                  <td className="py-2"><IBadge>{inboundStatusVi(o.status)}</IBadge></td>
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
              {staffPerformance.map((s) => (
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

        <Section title="NCC / Kho xuất nhiều sai lệch" className="col-span-12 lg:col-span-5">
          <table className="w-full text-xs">
            <thead><tr className="text-left text-muted-foreground border-b border-border">
              <th className="pb-2 font-medium">Nguồn hàng</th><th className="pb-2 font-medium text-right">Lệnh</th><th className="pb-2 font-medium text-right">Sai lệch</th><th className="pb-2 font-medium text-right">Trễ</th><th className="pb-2 font-medium text-right">KCS fail</th>
            </tr></thead>
            <tbody>
              {supplierIssues.map((s) => (
                <tr key={s.name} className="border-b border-border/60">
                  <td className="py-2 font-medium text-navy">{s.name}</td>
                  <td className="py-2 text-right">{s.orders}</td>
                  <td className="py-2 text-right text-warning font-semibold">{s.diff}</td>
                  <td className="py-2 text-right">{s.late}</td>
                  <td className="py-2 text-right text-destructive font-semibold">{s.kcsFail}</td>
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

/* ─────────────────────────────────── 2. DO POOL ─────────────────────────────────── */
const ORDER_TYPE_LABEL: Record<string, string> = {
  "INB-NCC": "Nhập kho NCC",
  "INB-TRF": "NCK",
  "INB-OTH": "Nhập kho khác",
};
export function InboundOrders() {
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
    const dates = orders.map((o) => o.plannedDate?.split(" ")[0]).filter((d): d is string => !!d);
    const counts: Record<string, number> = {};
    dates.forEach((d) => { counts[d] = (counts[d] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || new Date().toISOString().slice(0, 10);
  }, []);

  const totalVolume = orders.reduce((sum, o) => sum + o.qty * 0.05, 0);
  const waitingConfirmToday = orders.filter((o) => o.status === "Waiting Confirm" && o.plannedDate.startsWith(today)).length;
  const inProgressToday = orders.filter((o) => ["In Progress", "Waiting KCS", "Ready for GR", "Packing", "Putaway"].includes(o.status) && o.plannedDate.startsWith(today)).length;
  const completedAll = orders.filter((o) => o.status === "Completed").length;

  const filtered = useMemo(() => orders.filter((o) => {
    if (tab === "waiting" && (o.status !== "Waiting Confirm" || !o.plannedDate.startsWith(today))) return false;
    if (tab === "progress" && (!["In Progress", "Waiting KCS", "Ready for GR", "Packing", "Putaway"].includes(o.status) || !o.plannedDate.startsWith(today))) return false;
    if (tab === "done" && o.status !== "Completed") return false;
    if (q && !o.id.toLowerCase().includes(q.toLowerCase()) && !o.source.toLowerCase().includes(q.toLowerCase())) return false;
    const od = o.plannedDate.slice(0, 10);
    if (dateFrom && od < dateFrom) return false;
    if (dateTo && od > dateTo) return false;
    return true;
  }), [tab, q, today, dateFrom, dateTo]);

  const toggle = (id: string) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const tabs = [
    { id: "all", label: "Tổng order", n: orders.length },
    { id: "waiting", label: "Chờ xác nhận", n: waitingConfirmToday },
    { id: "progress", label: "Đang xử lý", n: inProgressToday },
    { id: "done", label: "Hoàn tất", n: `${completedAll}/${orders.length}` },
  ];

  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "DO Pool" }]}>
      <PageHeader title="Danh sách Order Nhập kho – DO Pool" subtitle="Quản lý lệnh nhập đã đồng bộ từ SAP/VERP – task tự sinh từ Order qua Task Template"
        actions={<IButton icon={Download}>Export Excel</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KCard label="Tổng order" value={orders.length} tone="brand" hint={`${totalVolume.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} m³ hàng hóa`} />
        <KCard label="Chờ xác nhận" value={waitingConfirmToday} tone="warning" />
        <KCard label="Đang xử lý" value={inProgressToday} tone="info" />
        <KCard label="Hoàn tất" value={`${completedAll}/${orders.length}`} tone="success" hint="của cả hệ thống / trong năm" />
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
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã lệnh, NCC..." className="h-8 w-64 pl-8 pr-3 rounded-md border border-input bg-card text-sm" />
            </div>
            <IButton icon={Filter} onClick={() => setFilterDrawer(true)}>Filter</IButton>
          </div>
        </div>

        {sel.length > 0 && (() => {
          const ncc = tasks.find((t) => sel.includes(t.orderId) && t.code === "T-NCC") || tasks.find((t) => t.code === "T-NCC");
          const bulkHref = ncc ? `/inbound/tasks/${ncc.id}?orders=${sel.join(",")}` : `/inbound/orders/${sel[0]}/confirm?orders=${sel.join(",")}`;
          return (
          <div className="flex items-center gap-2 p-2.5 bg-brand/5 border border-brand/20 rounded-lg mb-3">
            <span className="text-sm font-medium text-brand">Đã chọn {sel.length} order</span>
            <span className="flex-1" />
            <Link to={bulkHref}><IButton size="sm" variant="brand" icon={CheckCircle2}>Xác nhận lệnh nhập ({sel.length})</IButton></Link>
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
                    <input
                      type="checkbox"
                      disabled={selectable.length === 0}
                      checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = someChecked; }}
                      onChange={(e) => setSel(e.target.checked ? selectable.map((o) => o.id) : [])}
                      className="disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  );
                })()}
              </th>
              <th className="px-3 py-2.5 text-left font-medium">Mã Order</th>
              <th className="px-3 py-2.5 text-left font-medium">Loại</th>
              <th className="px-3 py-2.5 text-left font-medium">Nguồn hàng</th>
              <th className="px-3 py-2.5 text-left font-medium">Kho</th>
              <th className="px-3 py-2.5 text-center font-medium">Task cần xử lý</th>
              <th className="px-3 py-2.5 text-left font-medium">Trạng thái</th>
              <th className="px-3 py-2.5 text-left font-medium">SLA</th>
              <th className="px-3 py-2.5 text-left font-medium">Ngày nhập</th>
              <th className="px-3 py-2.5 text-left font-medium">Phụ trách</th>
              <th className="px-3 py-2.5 text-right font-medium">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-3 py-2.5"><input type="checkbox" disabled={o.status !== "Waiting Confirm"} checked={sel.includes(o.id)} onChange={() => toggle(o.id)} className="disabled:opacity-40 disabled:cursor-not-allowed" /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Link to={`/inbound/orders/${o.id}/confirm`} className="text-brand font-semibold hover:underline">{o.id}</Link>
                      {(() => {
                        const trip = getTripForInbound(o.id);
                        if (!trip && !o.hasTransport) return null;
                        const status = trip?.status;
                        const tone = status ? VEHICLE_STATUS_TONE[status] : "bg-warning/10 text-warning";
                        return <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${tone}`} title={status ? `Xe ${trip?.tripCode} · ${status}` : "Có xe"}>XE</span>;
                      })()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{o.sourceDoc}</div>
                  </td>
                  <td className="px-3 py-2.5"><IBadge>{o.type}{ORDER_TYPE_LABEL[o.type] ? ` - ${ORDER_TYPE_LABEL[o.type]}` : ""}</IBadge></td>
                  <td className="px-3 py-2.5 max-w-[180px] truncate" title={o.source}>{o.source}</td>
                  <td className="px-3 py-2.5">{o.warehouse}</td>
                  <td className="px-3 py-2.5 text-center">
                    {(() => {
                      const pending = tasks.filter((t) => t.orderId === o.id && t.status !== "Hoàn thành").length;
                      const total = tasks.filter((t) => t.orderId === o.id).length;
                      if (!total) return <span className="text-muted-foreground">—</span>;
                      return (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${pending > 0 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                          {pending}/{total}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-2.5"><IBadge>{inboundStatusVi(o.status)}</IBadge></td>
                  <td className="px-3 py-2.5"><SLAPill pct={o.slaPct} label={o.sla} status={o.status} /></td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{formatDateTime(o.plannedDate)}</td>
                  <td className="px-3 py-2.5">{o.owner}</td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="inline-flex gap-1">
                      {o.status === "Waiting Confirm" && (() => {
                        const ncc = tasks.find((t) => t.orderId === o.id && t.code === "T-NCC") || tasks.find((t) => t.code === "T-NCC");
                        const href = ncc ? `/inbound/tasks/${ncc.id}` : `/inbound/orders/${o.id}/confirm`;
                        return (
                          <Link to={href}>
                            <IButton size="sm" variant="brand" icon={CheckCircle2}>Xác nhận</IButton>
                          </Link>
                        );
                      })()}
                      <Link to={`/inbound/orders/${o.id}`}><IButton size="sm" icon={Eye}>Xem</IButton></Link>
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
          <span>Hiển thị {filtered.length} / {orders.length} order</span>
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
            <div className="font-medium text-navy mb-1.5">Ngày nhập từ - đến</div>
            <div className="flex items-center gap-2">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 flex-1 px-2 rounded-md border border-input bg-card text-xs" />
              <span className="text-xs text-muted-foreground">→</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 flex-1 px-2 rounded-md border border-input bg-card text-xs" />
            </div>
          </div>
          {([
            ["Loại nhập", ["INB-NCC", "INB-TRF", "INB-OTH"], fType, setFType],
            ["Kho nhận", ["HN01", "HCM01", "DN01", "CT01"], fWh, setFWh],
            ["Trạng thái nghiệp vụ", ["Waiting Confirm", "In Progress", "Waiting KCS", "Completed"], fStatus, setFStatus],
            ["Trạng thái API", ["OK", "Pending", "Error"], fApi, setFApi],
            ["Cờ luồng", ["Có vận chuyển", "Có KCS", "Có đóng gói", "Có VOffice"], fFlag, setFFlag],
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

/* ─────────────────────────────────── 3. CONFIRM ORDER ─────────────────────────────────── */
export function InboundConfirm() {
  const { id = "INB-2026-00120" } = useParams();
  const [sp] = useSearchParams();
  const taskId = sp.get("taskId") || undefined;
  const task = taskId ? getTask(taskId) : undefined;
  const o = getOrder(id);
  const nav = useNavigate();
  const [reject, setReject] = useState(false);
  const [reason, setReason] = useState("");
  const [accept, setAccept] = useState(false);
  const [extend, setExtend] = useState(false);

  const plannedParts = (o.plannedDate || "").split(" ");
  const [etaDate, setEtaDate] = useState(plannedParts[0] || "2026-05-18");
  const [etaTime, setEtaTime] = useState(plannedParts[1] || "09:00");
  const [extendMin, setExtendMin] = useState(30);

  const validations = [
    { label: "Dữ liệu lệnh hợp lệ", ok: true },
    { label: "Kho nhận tồn tại", ok: true },
    { label: "Mã hàng hợp lệ", ok: true },
    { label: "Không trùng lệnh", ok: true },
    { label: "Đủ thông tin vận chuyển", ok: !!o.vehicle },
  ];

  const breadcrumb = task
    ? [{ label: "Nhập kho", to: "/inbound" }, { label: "Danh sách task", to: "/inbound/tasks" }, { label: task.id }, { label: "Xác nhận tiếp nhận" }]
    : [{ label: "Nhập kho", to: "/inbound" }, { label: "DO Pool", to: "/inbound/orders" }, { label: o.id }, { label: "Xác nhận tiếp nhận" }];

  const handleAccept = () => {
    toast.success(`Đã xác nhận tiếp nhận ${o.id} · Dự kiến ${etaDate} ${etaTime}`);
    setAccept(false);
    nav(task ? "/inbound/tasks" : `/inbound/orders/${o.id}`);
  };

  return (
    <AppShell breadcrumb={breadcrumb}>
      <PageHeader title="Xác nhận tiếp nhận lệnh nhập"
        subtitle={task ? `${task.id} · Order ${o.id} · ${o.source}` : `${o.id} · ${o.source}`}
        actions={<><IButton variant="outline" icon={Clock} onClick={() => setExtend(true)}>Gia hạn thời gian</IButton><IButton variant="danger" icon={XCircle} onClick={() => setReject(true)}>Từ chối</IButton><IButton variant="brand" icon={CheckCircle2} onClick={() => setAccept(true)}>Đồng ý nhận hàng</IButton></>} />

      {task ? (
        <div className="space-y-4">
          <TaskInfoHeader
            status={task.status} slaPct={task.slaPct} slaLabel={task.sla}
            orderId={o.id} orderHref={`/inbound/orders/${o.id}`} orderSub={`${o.source} · ${o.sourceDoc}`}
            type={task.type} zone={task.zone} owner={task.owner}
            unassigned={!task.owner || task.owner === "—" || task.status === "Chờ phân công"}
          />
          <Section title="Thông tin task">
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              {[
                ["Mã task", task.id], ["Mã catalog", task.code], ["Bước / Loại", task.type],
                ["Order liên quan", o.id], ["Nguồn hàng", o.source], ["Kho nhận", o.warehouse],
                ["Ngày dự kiến", formatDateTime(o.plannedDate)], ["Khu vực", task.zone], ["Người phụ trách", task.owner || "—"],
                ["SLA", <SLAPill pct={task.slaPct} label={task.sla} />], ["Trạng thái", <IBadge>{task.status}</IBadge>], ["Phát sinh", task.exception || "—"],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-xs text-muted-foreground mb-0.5">{k as string}</dt>
                  <dd className="font-medium text-navy">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>
          <RuleNote>
            <li>Đồng ý nhận hàng yêu cầu xác nhận lại ngày & giờ dự kiến tiếp nhận.</li>
            <li>Có thể gia hạn thời gian nếu xe đến trễ so với ETA ban đầu.</li>
          </RuleNote>
        </div>
      ) : (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Section title="Thông tin lệnh">
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              {[
                ["Mã lệnh", o.id], ["Loại nhập", <IBadge>{o.type}</IBadge>], ["Chứng từ gốc", o.sourceDoc],
                ["Nguồn hàng", o.source], ["Kho nhận", o.warehouse], ["Ngày dự kiến", formatDateTime(o.plannedDate)],
                ["SLA", <SLAPill pct={o.slaPct} label={o.sla} />], ["Số dòng hàng", `${o.lines} dòng`], ["Tổng số lượng", `${o.qty} đơn vị`],
                ["Có vận chuyển", o.hasTransport ? "Có" : "Không"], ["Có KCS", o.hasKCS ? "Có" : "Không"], ["Có đóng gói", o.hasPacking ? "Có" : "Không"],
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
                <th className="pb-2 font-medium">Lô/Serial</th><th className="pb-2 font-medium">Yêu cầu bảo quản</th>
              </tr></thead>
              <tbody>
                {(o.items.length ? o.items : [
                  { sku: "STO-LINE-01", name: "Vật tư chuyển kho HCM→HN", uom: "Cái", docQty: 60, serial: false },
                  { sku: "STO-LINE-02", name: "Cuộn cáp dự phòng", uom: "Cuộn", docQty: 30, serial: false },
                  { sku: "STO-LINE-03", name: "Pin lưu trữ", uom: "Cái", docQty: 30, serial: true },
                ] as any).map((it: any) => (
                  <tr key={it.sku} className="border-b border-border/60">
                    <td className="py-2 font-medium text-navy">{it.sku}</td>
                    <td className="py-2">{it.name}</td>
                    <td className="py-2">{it.uom}</td>
                    <td className="py-2 text-right">{it.docQty}</td>
                    <td className="py-2 text-muted-foreground">{it.serial ? "Quản lý serial" : "—"}</td>
                    <td className="py-2 text-muted-foreground">Nhiệt độ phòng</td>
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
            <li>Từ chối bắt buộc nhập lý do và sẽ gửi reject về SAP/VERP.</li>
            <li>Sau khi đồng ý, hệ thống tự sinh task theo Task Template gắn với Order.</li>
            <li>Lệnh có vận chuyển bắt buộc có biển số/tài xế/ETA.</li>
          </RuleNote>
        </div>
      </div>
      )}

      <ConfirmModal open={reject} onClose={() => setReject(false)} onConfirm={() => nav("/inbound/orders")} title="Từ chối tiếp nhận lệnh" confirmLabel="Gửi từ chối về SAP/VERP" danger
        message={
          <div className="space-y-2">
            <p>Vui lòng nhập lý do từ chối lệnh <b>{o.id}</b>. Hành động này sẽ gửi reject sang SAP/VERP.</p>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-24 p-2 rounded border border-input text-sm" placeholder="Nhập lý do từ chối..." />
            <div className="text-xs text-muted-foreground">Đính kèm ảnh/file (tùy chọn): <button className="text-brand hover:underline">+ Tải lên</button></div>
          </div>
        } />

      <ConfirmModal open={accept} onClose={() => setAccept(false)} onConfirm={handleAccept}
        title="Đồng ý nhận hàng" confirmLabel="Xác nhận tiếp nhận"
        message={
          <div className="space-y-3">
            <p>Xác nhận tiếp nhận lệnh <b>{o.id}</b>. Vui lòng nhập ngày & giờ dự kiến nhận hàng.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Ngày dự kiến nhận</label>
                <input type="date" value={etaDate} onChange={(e) => setEtaDate(e.target.value)}
                  className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Giờ dự kiến nhận</label>
                <input type="time" value={etaTime} onChange={(e) => setEtaTime(e.target.value)}
                  className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" />
              </div>
            </div>
          </div>
        } />

      <ConfirmModal open={extend} onClose={() => setExtend(false)} title="Gia hạn thời gian tiếp nhận"
        confirmLabel="Ghi nhận gia hạn"
        onConfirm={() => {
          const [hh, mm] = etaTime.split(":").map(Number);
          const d = new Date(`${etaDate}T${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:00`);
          d.setMinutes(d.getMinutes() + extendMin);
          const nd = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
          const nt = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
          setEtaDate(nd); setEtaTime(nt);
          toast.success(`Đã gia hạn thêm ${extendMin} phút → ${nd} ${nt}`);
        }}
        message={
          <div className="space-y-3">
            <p>Gia hạn thời gian tiếp nhận cho lệnh <b>{o.id}</b>. ETA hiện tại: <b>{etaDate} {etaTime}</b>.</p>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Gia hạn thêm</label>
              <select value={extendMin} onChange={(e) => setExtendMin(Number(e.target.value))}
                className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm">
                {[15, 30, 60, 120, 240].map((m) => <option key={m} value={m}>{m} phút</option>)}
              </select>
            </div>
          </div>
        } />
    </AppShell>
  );
}

/* ─────────────────────────────────── 4. ORDER DETAIL ─────────────────────────────────── */
export function InboundOrderDetail() {
  const { id = "INB-2026-00118" } = useParams();
  const o = getOrder(id);
  const [tab, setTab] = useState("info");
  const trips = getTripsForInbound(o.id);
  
  const tabs = [
    { id: "info", label: "Thông tin hàng hóa" },
    { id: "vehicle", label: "Vận chuyển" + (trips.length > 1 ? ` (${trips.length})` : "") },
    
    { id: "tasks", label: "Task" },
    { id: "kcs", label: "Kết quả KCS" },
    { id: "docs", label: "Chứng từ" },
    { id: "history", label: "Lịch sử" },
  ];

  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "DO Pool", to: "/inbound/orders" }, { label: o.id }]}>
      <PageHeader title={o.id} subtitle={`${o.source} · ${o.sourceDoc} · Kho_Plant ${o.warehouse}`}
        actions={<><IButton icon={Download}>Tải chứng từ</IButton><Link to={`/inbound/tasks?order=${o.id}`}><IButton variant="brand" icon={ArrowRight}>Xem danh sách task</IButton></Link></>} />

      <div className="grid grid-cols-12 gap-3 mb-5">
        <KCard label="Trạng thái" value={<IBadge>{inboundStatusVi(o.status)}</IBadge>} tone="default" />
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
            ["Loại nhập", <IBadge>{o.type}</IBadge>],
            ["Chứng từ gốc", o.sourceDoc],
            ["Mã hợp đồng", `HĐ-${o.sourceDoc.replace(/^[A-Z]+-/, "")}`],
            ["Mã lô ngày", `LOT-${(o.plannedDate || "").slice(0, 10).replace(/-/g, "")}-${o.id.slice(-3)}`],
            ["Mã / Tên dự án", `DA-${o.id.slice(-4)} · Triển khai hạ tầng 5G ${o.warehouse}`],
            ["Mã / Tên kho nhập", `${o.warehouse} · Kho ${o.warehouse === "HN01" ? "Hà Nội 01" : o.warehouse === "HCM01" ? "Hồ Chí Minh 01" : o.warehouse}`],
            ["Đơn vị quản lý kho", "Ban Vật tư – Chi nhánh " + (o.warehouse.startsWith("HN") ? "Hà Nội" : o.warehouse.startsWith("HCM") ? "Hồ Chí Minh" : "Miền Trung")],
            ["Ngày ký hợp đồng", formatDateTime(new Date(new Date(o.plannedDate).getTime() - 15 * 86400000))],
            ["Ngày giao dự kiến", formatDateTime(o.plannedDate)],
            ["Lý do nhập", o.type === "INB-NCC" ? "Nhập hàng theo PO với nhà cung cấp" : o.type === "INB-TRF" ? "Điều chuyển nội bộ giữa các kho" : "Nhập khác / thu hồi CCDC"],
            ["Diễn giải", `${o.receiptMode === "decompose" ? "Nhập phân rã hàng" : "Nhập đích danh"} · ${o.lines} dòng · ${o.qty} đơn vị · Phụ trách: ${o.owner}`],
          ].map(([k, v]) => (
            <div key={k as string}>
              <div className="text-xs text-muted-foreground">{k as string}</div>
              <div className="font-medium text-navy">{v as any}</div>
            </div>
          ))}
        </div>
      </div>

      <Section title="">
        <div className="flex gap-1 border-b border-border -mt-3 -mx-5 px-5 mb-4">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === t.id ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
          ))}
        </div>

        {tab === "info" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-navy">Danh sách hàng hóa {o.receiptMode === "decompose" && <span className="ml-2 text-[11px] font-normal text-muted-foreground">(cha – con theo cấu trúc phân rã)</span>}</div>
            </div>
            <GoodsListTable items={o.items} decompose={o.receiptMode === "decompose"} />
          </div>
        )}


        {tab === "vehicle" && (
          <VehicleGatePanel trips={trips} requireGateBefore={o.hasTransport ? "unload" : undefined} warehouseCode={o.warehouse} />
        )}


        {tab === "tasks" && (
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2 text-left font-medium">Task</th><th className="px-3 py-2 text-left font-medium">Loại</th>
              <th className="px-3 py-2 text-left font-medium">Phụ trách</th><th className="px-3 py-2 text-left font-medium">Thời gian bắt đầu</th><th className="px-3 py-2 text-left font-medium">Thời gian kết thúc</th><th className="px-3 py-2 text-left font-medium">SLA</th><th className="px-3 py-2 text-left font-medium">Trạng thái</th>
            </tr></thead>
            <tbody>
              {tasks.filter((t) => t.orderId === o.id).map((t) => (
                <tr key={t.id} className="border-b border-border/60">
                  <td className="px-3 py-2"><Link to={`/inbound/tasks`} className="text-brand font-medium">{t.id}</Link></td>
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

        {tab === "kcs" && <KCSResultTab order={o} />}

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
                { type: "Phiếu nhập", name: "GR-2026-008812", status: "GR Posted", time: "18/05/2026 11:02:00", action: "Tải xuống" },
                { type: "BBBG bàn giao hàng", name: "BBBG-INB-008812", status: "Đã ký", time: "18/05/2026 10:48:00", action: "Xem" },
                { type: "Kết quả KCS", name: "KCS-INB-008812", status: "Pending", time: "—", action: "Xem" },
                { type: "Phiếu trình ký VOffice", name: "VOffice-INB-008812", status: "Waiting VOffice", time: "—", action: "Xem" },
              ].map((d) => (
                <tr key={d.name} className="border-b border-border/60">
                  <td className="px-3 py-2 font-medium text-navy">{d.type}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d.name}</td>
                  <td className="px-3 py-2"><IBadge>{d.status}</IBadge></td>
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">{d.time}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="text-[11px] text-brand hover:underline font-medium">{d.action} →</button>
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

/* ─── Bảng danh sách hàng hóa – hỗ trợ trải phẳng (đích danh) & cha-con (phân rã) ─── */
function GoodsListTable({ items, decompose }: { items: import("@/data/inbound").OrderItem[]; decompose: boolean }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => Object.fromEntries(items.map((i) => [i.sku, true])));
  const toggle = (sku: string) => setExpanded((s) => ({ ...s, [sku]: !s[sku] }));

  const renderRow = (it: import("@/data/inbound").OrderItem, level: number, isParent: boolean, key: string) => (
    <tr key={key} className={`border-b border-border/60 ${level === 0 && isParent ? "bg-muted/30" : ""}`}>
      <td className="px-3 py-2 font-medium text-navy">
        <div className="flex items-center gap-1" style={{ paddingLeft: level * 18 }}>
          {isParent ? (
            <button onClick={() => toggle(it.sku)} className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-navy">{expanded[it.sku] ? "▾" : "▸"}</button>
          ) : (
            <span className="w-4 inline-block text-muted-foreground/50">└</span>
          )}
          <span>{it.sku}</span>
          {isParent && <span className="ml-1 text-[10px] font-normal px-1 rounded bg-brand/10 text-brand">Cha</span>}
        </div>
      </td>
      <td className="px-3 py-2">{it.name}</td>
      <td className="px-3 py-2">{isParent ? "—" : it.uom}</td>
      <td className="px-3 py-2 text-right">{isParent ? "—" : it.docQty}</td>
      <td className="px-3 py-2 text-right font-semibold">{isParent ? "—" : it.recvQty}</td>
      <td className={`px-3 py-2 text-right font-semibold ${it.diff === 0 ? "text-muted-foreground" : "text-destructive"}`}>{isParent ? "—" : (it.diff > 0 ? `+${it.diff}` : it.diff)}</td>
      <td className="px-3 py-2">{isParent ? <span className="text-muted-foreground">—</span> : <IBadge>{it.kcs}</IBadge>}</td>
      <td className="px-3 py-2 text-muted-foreground">{it.hu || "—"}</td>
      <td className="px-3 py-2 text-muted-foreground">{it.putaway || "—"}</td>
    </tr>
  );


  return (
    <table className="w-full text-xs">
      <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
        <th className="px-3 py-2 text-left font-medium">Mã hàng</th><th className="px-3 py-2 text-left font-medium">Tên</th><th className="px-3 py-2 text-left font-medium">ĐVT</th>
        <th className="px-3 py-2 text-right font-medium">Chứng từ</th><th className="px-3 py-2 text-right font-medium">Thực nhận</th><th className="px-3 py-2 text-right font-medium">Chênh lệch</th>
        <th className="px-3 py-2 text-left font-medium">KCS</th><th className="px-3 py-2 text-left font-medium">HU</th><th className="px-3 py-2 text-left font-medium">Vị trí</th>
      </tr></thead>
      <tbody>
        {items.map((it) => {
          const hasChildren = decompose && it.children && it.children.length > 0;
          const rows = [renderRow(it, 0, !!hasChildren, it.sku)];
          if (hasChildren && expanded[it.sku]) {
            it.children!.forEach((c, ci) => rows.push(renderRow(c, 1, false, `${it.sku}-${c.sku}-${ci}`)));
          }
          return rows;
        })}
      </tbody>
    </table>
  );
}

/* ─── Tab KCS – kết quả KCS đồng bộ từ SAP/hệ thống KCS (read-only) ─── */

type KCSStatus = "Đạt" | "Không đạt" | "Đạt một phần" | "Pending" | "Không áp dụng";
type KCSRow = {
  sku: string; name: string; qty: number; uom: string;
  status: KCSStatus; passQty: number | null; failQty: number | null;
  reason: string; updatedAt: string; inspector: string; file: string | null; syncError?: boolean;
};

const KCS_SAMPLE: KCSRow[] = [
  { sku: "MAT-001", name: "Router 5G Ericsson", qty: 24, uom: "Bộ", status: "Đạt", passQty: 24, failQty: 0, reason: "—", updatedAt: "18/05/2026 10:42", inspector: "Trung tâm KCS Miền Bắc", file: "BB-KCS-001.pdf" },
  { sku: "MAT-002", name: "Antenna Outdoor Huawei", qty: 198, uom: "Cuộn", status: "Pending", passQty: null, failQty: null, reason: "—", updatedAt: "—", inspector: "—", file: null },
  { sku: "MAT-003", name: "Module RF Samsung", qty: 50, uom: "Bộ", status: "Không đạt", passQty: 45, failQty: 5, reason: "Không đạt tiêu chuẩn ngoại quan – vỏ thiết bị bị xước, móp tại vị trí cổng kết nối; nghi ngờ ảnh hưởng kết cấu.", updatedAt: "18/05/2026 11:05", inspector: "Phòng KCS – Phạm Quốc Hùng", file: "BB-KCS-003.pdf" },
  { sku: "MAT-004", name: "Cable Feeder 1/2", qty: 120, uom: "Mét", status: "Đạt một phần", passQty: 100, failQty: 20, reason: "20m bị nứt vỏ cách điện ở giữa cuộn.", updatedAt: "18/05/2026 11:12", inspector: "Phòng KCS – Lê Thị Hà", file: "BB-KCS-004.pdf" },
  { sku: "MAT-005", name: "Cabinet Outdoor", qty: 8, uom: "Bộ", status: "Đạt", passQty: 8, failQty: 0, reason: "—", updatedAt: "18/05/2026 09:30", inspector: "Trung tâm KCS Miền Bắc", file: "BB-KCS-005.pdf" },
  { sku: "MAT-006", name: "Battery Backup Unit", qty: 16, uom: "Bộ", status: "Không áp dụng", passQty: null, failQty: null, reason: "—", updatedAt: "—", inspector: "—", file: null },
  { sku: "MAT-007", name: "Connector Kit", qty: 300, uom: "Bộ", status: "Pending", passQty: null, failQty: null, reason: "—", updatedAt: "—", inspector: "—", file: null, syncError: true },
  { sku: "MAT-008", name: "Power Supply Unit", qty: 30, uom: "Bộ", status: "Đạt", passQty: 30, failQty: 0, reason: "—", updatedAt: "18/05/2026 10:05", inspector: "Trung tâm KCS Miền Bắc", file: "BB-KCS-008.pdf" },
];

const KCS_TONE: Record<KCSStatus, string> = {
  "Đạt": "bg-success/10 text-success border-success/30",
  "Không đạt": "bg-destructive/10 text-destructive border-destructive/30",
  "Đạt một phần": "bg-warning/10 text-warning border-warning/30",
  "Pending": "bg-info/10 text-info border-info/30",
  "Không áp dụng": "bg-muted text-muted-foreground border-border",
};

function KCSBadge({ s }: { s: KCSStatus }) {
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${KCS_TONE[s]}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{s}</span>;
}

function KCSResultTab({ order }: { order: Order }) {
  const rows = KCS_SAMPLE;
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState<"all" | KCSStatus>("all");
  const [sort, setSort] = useState<"updated" | "status">("updated");
  

  const stats = useMemo(() => ({
    total: rows.length,
    pass: rows.filter((r) => r.status === "Đạt").length,
    fail: rows.filter((r) => r.status === "Không đạt").length,
    partial: rows.filter((r) => r.status === "Đạt một phần").length,
    pending: rows.filter((r) => r.status === "Pending").length,
    syncErr: rows.filter((r) => r.syncError).length,
  }), [rows]);

  const overall: KCSStatus | "Lỗi đồng bộ" =
    stats.syncErr > 0 ? "Lỗi đồng bộ" :
    stats.fail > 0 ? "Không đạt" :
    stats.partial > 0 ? "Đạt một phần" :
    stats.pending > 0 ? "Pending" :
    stats.total === 0 ? "Không áp dụng" : "Đạt";

  const filtered = useMemo(() => {
    let r = rows.filter((x) =>
      (fStatus === "all" || x.status === fStatus) &&
      (q === "" || x.sku.toLowerCase().includes(q.toLowerCase()) || x.name.toLowerCase().includes(q.toLowerCase()) || x.status.toLowerCase().includes(q.toLowerCase()))
    );
    r = [...r].sort((a, b) => sort === "status" ? a.status.localeCompare(b.status) : b.updatedAt.localeCompare(a.updatedAt));
    return r;
  }, [rows, q, fStatus, sort]);

  const blockComplete = order.hasKCS && (stats.fail > 0 || stats.partial > 0 || stats.pending > 0);

  const statCards = [
    { label: "Tổng dòng KCS", value: stats.total, tone: "bg-muted text-foreground" },
    { label: "Đạt", value: stats.pass, tone: "bg-success/10 text-success" },
    { label: "Không đạt", value: stats.fail, tone: "bg-destructive/10 text-destructive" },
    { label: "Đạt một phần", value: stats.partial, tone: "bg-warning/10 text-warning" },
    { label: "Chờ kết quả", value: stats.pending, tone: "bg-info/10 text-info" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand" />
            <h3 className="font-semibold text-navy text-base">Kết quả KCS</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Thông tin KCS được đồng bộ từ <b>SAP / Hệ thống KCS</b>. Người dùng chỉ được xem, không được chỉnh sửa kết quả KCS tại AIWS.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Trạng thái KCS tổng thể</div>
            <div className="mt-0.5">
              {overall === "Lỗi đồng bộ"
                ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border bg-destructive/10 text-destructive border-destructive/30"><AlertTriangle className="w-3 h-3" />Lỗi đồng bộ</span>
                : <KCSBadge s={overall as KCSStatus} />}
            </div>
          </div>
          <div className="text-right border-l border-border pl-3">
            <div className="text-[11px] text-muted-foreground">Cập nhật gần nhất</div>
            <div className="text-xs font-medium text-navy">18/05/2026 11:12</div>
          </div>
          <div className="text-right border-l border-border pl-3">
            <div className="text-[11px] text-muted-foreground">Nguồn</div>
            <div className="text-xs font-medium text-navy">SAP · QM</div>
          </div>
          <IButton variant="outline" icon={RefreshCw} onClick={() => toast.success("Đã gửi yêu cầu làm mới dữ liệu KCS")}>Làm mới</IButton>
          <IButton variant="outline" icon={Activity} onClick={() => toast.info("Mở API Log đồng bộ KCS")}>Xem API Log</IButton>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-card p-3">
            <div className="text-[11px] text-muted-foreground">{c.label}</div>
            <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-md text-lg font-bold ${c.tone}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {blockComplete && (
          <div className="flex items-start gap-2 p-3 rounded-lg border border-warning/30 bg-warning/10 text-warning">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <div className="text-xs">
              <b>Order có yêu cầu KCS bắt buộc chưa đạt</b> – hệ thống chưa cho phép hoàn tất order. Còn {stats.pending} dòng chờ kết quả, {stats.fail} dòng không đạt, {stats.partial} dòng đạt một phần.
            </div>
          </div>
        )}
        {stats.syncErr > 0 && (
          <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
            <XCircle className="w-4 h-4 mt-0.5" />
            <div className="text-xs flex-1">
              <b>Không thể tải dữ liệu KCS</b> cho {stats.syncErr} dòng. Vui lòng thử lại hoặc xem chi tiết log đồng bộ.
            </div>
            <button className="text-xs underline" onClick={() => toast.info("Xem API Log")}>Xem API Log</button>
          </div>
        )}
        {stats.pending > 0 && !blockComplete && (
          <div className="flex items-start gap-2 p-3 rounded-lg border border-info/30 bg-info/10 text-info">
            <Clock className="w-4 h-4 mt-0.5" />
            <div className="text-xs"><b>Kết quả KCS đang chờ xử lý</b> – {stats.pending} dòng chưa có kết quả từ hệ thống KCS.</div>
          </div>
        )}
      </div>

      {/* Toolbar + table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between gap-2 p-3 border-b border-border flex-wrap">
          <div>
            <div className="text-sm font-semibold text-navy">Danh sách hàng hóa KCS</div>
            <div className="text-[11px] text-muted-foreground">Hiển thị danh sách hàng hóa của order cần theo dõi kết quả KCS.</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã / tên / trạng thái…" className="pl-7 pr-2 h-8 text-xs rounded-md border border-input bg-card w-56 focus:outline-none focus:ring-2 focus:ring-ring/40" />
            </div>
            <select value={fStatus} onChange={(e) => setFStatus(e.target.value as any)} className="h-8 px-2 text-xs rounded-md border border-input bg-card">
              <option value="all">Tất cả trạng thái</option>
              <option>Đạt</option><option>Không đạt</option><option>Đạt một phần</option><option>Pending</option><option>Không áp dụng</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="h-8 px-2 text-xs rounded-md border border-input bg-card">
              <option value="updated">Sắp xếp: Thời gian cập nhật</option>
              <option value="status">Sắp xếp: Trạng thái</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[1100px]">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b border-border">
                <th className="px-3 py-2 text-left font-medium w-10">STT</th>
                <th className="px-3 py-2 text-center font-medium w-8"></th>
                <th className="px-3 py-2 text-left font-medium">Mã hàng</th>
                <th className="px-3 py-2 text-left font-medium">Tên hàng</th>
                <th className="px-3 py-2 text-right font-medium">SL</th>
                <th className="px-3 py-2 text-left font-medium">ĐVT</th>
                <th className="px-3 py-2 text-left font-medium">Trạng thái KCS</th>
                <th className="px-3 py-2 text-right font-medium">SL đạt</th>
                <th className="px-3 py-2 text-right font-medium">SL không đạt</th>
                <th className="px-3 py-2 text-left font-medium">Lý do không đạt</th>
                <th className="px-3 py-2 text-left font-medium">Cập nhật</th>
                <th className="px-3 py-2 text-left font-medium">Người/Đơn vị KCS</th>
                <th className="px-3 py-2 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={13} className="px-3 py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-8 h-8 opacity-40" />
                    <div className="text-sm font-medium">Chưa có dữ liệu KCS.</div>
                    <div className="text-xs">Kết quả KCS sẽ được hiển thị sau khi AIWS nhận dữ liệu từ SAP / hệ thống KCS.</div>
                    <IButton variant="outline" icon={RefreshCw} onClick={() => toast.success("Đã làm mới")}>Làm mới dữ liệu</IButton>
                  </div>
                </td></tr>
              ) : filtered.map((r, idx) => {
                const highlight = (r.failQty ?? 0) > 0;
                const reasonShort = r.reason.length > 38 ? r.reason.slice(0, 38) + "…" : r.reason;
                const nameShort = r.name.length > 32 ? r.name.slice(0, 32) + "…" : r.name;
                return (
                  <tr key={r.sku} className={`border-b border-border/60 hover:bg-muted/30 ${highlight ? "bg-destructive/5" : ""}`}>
                    <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                    <td className="px-3 py-2 text-center"><ShieldCheck className="w-4 h-4 text-brand inline" /></td>
                    <td className="px-3 py-2 font-medium text-navy">{r.sku || "—"}</td>
                    <td className="px-3 py-2" title={r.name}>{nameShort || "—"}</td>
                    <td className="px-3 py-2 text-right font-medium">{r.qty?.toLocaleString() ?? "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.uom || "—"}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <KCSBadge s={r.status} />
                        {r.syncError && <span title="Lỗi đồng bộ" className="text-destructive"><AlertTriangle className="w-3.5 h-3.5" /></span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-success">{r.passQty ?? "—"}</td>
                    <td className={`px-3 py-2 text-right font-medium ${highlight ? "text-destructive" : ""}`}>{r.failQty ?? "—"}</td>
                    <td className="px-3 py-2" title={r.reason}>{r.reason === "—" ? <span className="text-muted-foreground">—</span> : reasonShort}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.updatedAt}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.inspector}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {r.syncError && (
                          <button className="text-destructive hover:underline inline-flex items-center gap-1 ml-2" onClick={() => toast.info("Xem log đồng bộ")}><Activity className="w-3 h-3" />Xem log</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


function ApiTable({ rows }: { rows: ApiLog[] }) {
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
          <td className="px-3 py-2">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${["200","201"].includes(l.status) ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{l.status} {l.errorCode || ""}</span>
          </td>
          <td className="px-3 py-2 text-right">{l.retry}</td>
          <td className="px-3 py-2">{l.note}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

/* ─────────────────────────────────── 5. AI AUTO-DISPATCH LOG (per Order) ─────────────────────────────────── */
export function InboundAssignQueue() {
  // Render list of orders auto-processed by AI engine. No human in the loop.
  const queue = orders.filter((o) => ["Waiting Confirm", "Waiting Assign", "In Progress", "Pending"].includes(o.status));
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "AI Auto-Dispatch" }]}>
      <PageHeader title="AI Auto-Dispatch – Order-centric" subtitle="Mỗi Order khi lên hệ thống sẽ được AI tự sinh task và tự giao việc cho nhân sự phù hợp. Con người không can thiệp."
        actions={<><IBadge>AI Engine: ONLINE</IBadge><IButton icon={Activity}>Xem log AI</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <KCard label="Order AI đã xử lý" value={queue.length} tone="brand" icon={Bot} />
        <KCard label="Task tự sinh hôm nay" value={64} tone="info" icon={ListChecks} />
        <KCard label="Task tự giao thành công" value={61} tone="success" icon={UserCheck} />
        <KCard label="Auto-dispatch hôm nay" value={9} tone="success" icon={Send} />
        <KCard label="Không có NS phù hợp" value={1} tone="destructive" icon={AlertTriangle} hint="AI cảnh báo Thủ kho" />
        <KCard label="Độ chính xác AI (7d)" value="96.4%" tone="brand" icon={Brain} />
      </div>

      <Section title="Order đã được AI sinh task & giao việc tự động" actions={<IBadge>Read-only</IBadge>}>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Mã Order</th>
            <th className="px-3 py-2 text-left font-medium">Loại</th>
            <th className="px-3 py-2 text-left font-medium">Nguồn</th>
            <th className="px-3 py-2 text-left font-medium">Kho</th>
            <th className="px-3 py-2 text-right font-medium">Task AI sinh</th>
            <th className="px-3 py-2 text-right font-medium">Đã tự giao</th>
            <th className="px-3 py-2 text-left font-medium">Trạng thái AI</th>
            <th className="px-3 py-2 text-left font-medium">SLA</th>
            <th className="px-3 py-2 text-right font-medium">Chi tiết</th>
          </tr></thead>
          <tbody>
            {queue.map((o) => {
              const gen = o.id.endsWith("18") ? 11 : 6 + (o.lines % 5);
              const dispatched = Math.max(gen - (o.id.endsWith("12") ? 1 : 0), 0);
              return (
                <tr key={o.id} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-3 py-2"><Link to={`/inbound/orders/${o.id}/assign`} className="text-brand font-semibold hover:underline">{o.id}</Link></td>
                  <td className="px-3 py-2"><IBadge>{o.type}</IBadge></td>
                  <td className="px-3 py-2 max-w-[200px] truncate">{o.source}</td>
                  <td className="px-3 py-2">{o.warehouse}</td>
                  <td className="px-3 py-2 text-right font-semibold">{gen}</td>
                  <td className="px-3 py-2 text-right font-semibold text-success">{dispatched}/{gen}</td>
                  <td className="px-3 py-2"><IBadge>{dispatched === gen ? "AI Hoàn tất" : "AI Đang xử lý"}</IBadge></td>
                  <td className="px-3 py-2"><SLAPill pct={o.slaPct || 30} label={o.sla || "—"} /></td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/inbound/orders/${o.id}/assign`}><IButton size="sm" variant="outline" icon={Bot}>Xem AI Plan</IButton></Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <RuleNote>
        <li><b>AI tự động hoàn toàn</b>: Khi Order vào hệ thống, AI Engine tự sinh task theo Task Catalog & tự giao việc. Con người không bấm "phân công".</li>
        <li>AI lựa chọn nhân sự dựa trên: kho được phép, vị trí, chứng chỉ, ca làm, tải task hiện tại, hiệu suất 7 ngày.</li>
        <li>Task hệ thống/API → AI tự kích hoạt. Task nhân sự → AI tự dispatch xuống Mobile/Web cho NS.</li>
        <li>Nếu AI không tìm được NS phù hợp → đẩy cảnh báo cho Thủ kho (chỉ cảnh báo, không cần duyệt).</li>
        <li>Mọi quyết định AI đều được ghi log đầy đủ (model, version, score, lý do) phục vụ audit.</li>
      </RuleNote>
    </AppShell>
  );
}

/* ─────────────────────────────────── 6. AI PLAN DETAIL (per Order) – READ ONLY ─────────────────────────────────── */
export function InboundAssign() {
  const { id = "INB-2026-00118" } = useParams();
  const o = getOrder(id);
  const otasks = orderTasks.filter((t) => t.orderId === id);
  const [logOpen, setLogOpen] = useState(false);

  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "AI Auto-Dispatch", to: "/inbound/assign" }, { label: o.id }]}>
      <PageHeader title={`AI Plan – ${o.id}`} subtitle={`${o.source} · Kho ${o.warehouse} · ${o.lines} dòng / ${o.qty} SL · AI tự sinh task & tự giao việc`}
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
            <li>Khi AI không tìm được NS phù hợp → cảnh báo Thủ kho (không cần duyệt thủ công).</li>
            <li>Mọi quyết định AI đều lưu log: model, version, score, lý do, timestamp.</li>
          </RuleNote>
        </div>
      </div>

      <Drawer open={logOpen} onClose={() => setLogOpen(false)} title="Log quyết định AI – Auto Dispatch">
        <div className="text-sm space-y-3">
          <div className="rounded-lg border border-brand/30 bg-brand/5 p-3"><Bot className="w-5 h-5 text-brand mb-1" /> AI Engine v3.2 đã xử lý Order {o.id}: phân tích {employees.length} nhân sự kho {o.warehouse} (chứng chỉ, ca, tải, hiệu suất 7 ngày). Tự sinh {otasks.length} task và tự dispatch {otasks.filter((t) => t.assignee).length} task cho NS.</div>
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

/* ─────────────────────────────────── 7. TASK LIST ─────────────────────────────────── */
const INB_FLOW_STEPS = taskCatalog.filter((t) => t.module === "Nhập kho").map((t) => t.name);

// AI Scheduler: phân tích nhân sự + lịch + lệnh -> đề xuất phân công
const SKILL_MAP: Record<string, string[]> = {
  "Kiểm tra lệnh NCC": ["Chứng từ", "VOffice", "Ký chứng từ"],
  "Dỡ hàng": ["Xe nâng", "Xe cẩu"],
  "Kiểm hàng & Ký BBBG": ["Kiểm hàng", "Scan RFID", "Ký chứng từ"],
  "KCS": ["KCS thiết bị", "KCS điện tử"],
  "Đóng gói": ["Đóng gói", "In tem"],
  "Putaway": ["Xe nâng"],
  "Thực nhập": ["Ký chứng từ", "Chứng từ"],
  "Ký VOffice": ["VOffice", "Ký chứng từ"],
};

function matchScore(emp: typeof employees[number], required: string[]) {
  if (!required.length) return 60;
  const hit = required.filter((r) => emp.certs.some((c) => c.toLowerCase().includes(r.toLowerCase()))).length;
  return Math.round((hit / required.length) * 100);
}

// Eligible employees cho 1 task code tại 1 kho theo mapping vị trí – task.
function eligibleEmployees(taskCode: string, warehouse?: string) {
  const cat = taskCatalog.find((c) => c.code === taskCode);
  const allowedPos = cat?.allowedPositions || [];
  const empCodes = new Set(
    mappings
      .filter((m) => m.active && allowedPos.includes(m.positionCode) && (!warehouse || m.warehouse === warehouse))
      .map((m) => m.empCode)
  );
  return employees.filter((e) => e.active && empCodes.has(e.code));
}

function buildAIPlan(rows: Task[]) {
  let cursor = 8 * 60; // 08:00 in minutes
  const load: Record<string, number> = Object.fromEntries(employees.map((e) => [e.code, e.load]));
  return rows.slice(0, 12).map((t) => {
    const o = getOrder(t.orderId);
    const elig = eligibleEmployees(t.code, o?.warehouse);
    const stepName = Object.keys(SKILL_MAP).find((k) => t.type.includes(k)) || t.type;
    const required = SKILL_MAP[stepName] || [];
    const pool = (elig.length ? elig : employees).filter((e) => e.current !== "Nghỉ");
    const ranked = pool
      .map((e) => ({ e, score: matchScore(e, required) - (load[e.code] || 0) * 8 }))
      .sort((a, b) => b.score - a.score);
    const pick = ranked[0]?.e || pool[0] || employees[0];
    load[pick.code] = (load[pick.code] || 0) + 1;
    const dur = stepName.includes("Kiểm") ? 45 : stepName.includes("Putaway") ? 60 : stepName.includes("Đóng gói") ? 40 : stepName.includes("KCS") ? 50 : 30;
    const start = cursor;
    const end = cursor + dur;
    cursor += Math.max(15, Math.round(dur * 0.6));
    const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    return {
      taskId: t.id, taskCode: t.code, orderId: t.orderId, warehouse: o?.warehouse || "", type: t.type, zone: t.zone,
      empCode: pick.code, empName: pick.name, empTitle: pick.titleSap,
      score: Math.max(40, Math.min(99, ranked[0]?.score ?? 60)),
      start: fmt(start), end: fmt(end), dur,
      kpi: dur <= 30 ? "Hoàn tất ≤ 30'" : dur <= 45 ? `Hoàn tất ≤ ${dur}'` : `Hoàn tất ≤ ${dur}', QC ≥ 98%`,
      startMin: start, endMin: end,
    };
  });
}

function AISchedulerModal({ open, onClose, rows }: { open: boolean; onClose: () => void; rows: Task[] }) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const plan = useMemo(() => buildAIPlan(rows), [rows]);
  const availableEmp = employees.filter((e) => e.active && e.current !== "Nghỉ").length;
  const approvedOrders = orders.filter((o) => o.status !== "Waiting Confirm").length;

  if (!open) return null;

  const run = () => {
    setPhase("running");
    setTimeout(() => setPhase("done"), 1400);
  };

  const apply = () => {
    toast.success(`Đã áp dụng phân công AI cho ${plan.length} task`);
    onClose();
    setPhase("idle");
  };

  // timeline scale 08:00 -> 18:00 = 600 minutes
  const T0 = 8 * 60, T1 = 18 * 60;
  const empGroups = Array.from(new Set(plan.map((p) => p.empCode))).map((code) => ({
    code, name: plan.find((p) => p.empCode === code)!.empName,
    items: plan.filter((p) => p.empCode === code),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-6xl border border-border max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center"><Brain className="w-5 h-5" /></div>
            <div>
              <h3 className="font-semibold text-navy">AI phân công tự động</h3>
              <p className="text-xs text-muted-foreground">Phân tích nhân sự · lịch làm việc · lệnh nhập đã duyệt → đề xuất kế hoạch tối ưu</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><XCircle className="w-5 h-5" /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Nguồn dữ liệu */}
          <div>
            <div className="text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Nguồn dữ liệu đầu vào</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3 bg-gradient-to-br from-brand/5 to-transparent">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Users className="w-3.5 h-3.5" />Nhân sự khả dụng</div>
                <div className="text-2xl font-bold text-navy">{availableEmp}<span className="text-sm text-muted-foreground font-normal">/{employees.length}</span></div>
                <div className="text-[11px] text-muted-foreground">Đã loại nghỉ phép · ngoài ca</div>
              </div>
              <div className="rounded-lg border border-border p-3 bg-gradient-to-br from-success/5 to-transparent">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Clock className="w-3.5 h-3.5" />Lịch làm việc</div>
                <div className="text-2xl font-bold text-navy">3 ca <span className="text-sm font-normal text-muted-foreground">/ ngày</span></div>
                <div className="text-[11px] text-muted-foreground">S1 06–14h · S2 14–22h · S3 22–06h</div>
              </div>
              <div className="rounded-lg border border-border p-3 bg-gradient-to-br from-warning/5 to-transparent">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><ClipboardList className="w-3.5 h-3.5" />Lệnh nhập đã duyệt</div>
                <div className="text-2xl font-bold text-navy">{approvedOrders}<span className="text-sm text-muted-foreground font-normal"> lệnh</span></div>
                <div className="text-[11px] text-muted-foreground">→ {rows.length} task đang chờ phân công</div>
              </div>
            </div>
          </div>

          {/* CTA Run */}
          {phase === "idle" && (
            <div className="rounded-lg border border-dashed border-brand/30 bg-brand/5 p-6 text-center">
              <Brain className="w-8 h-8 mx-auto text-brand mb-2" />
              <div className="font-semibold text-navy mb-1">Sẵn sàng phân tích {rows.length} task</div>
              <div className="text-xs text-muted-foreground mb-3">AI sẽ chấm điểm match (kỹ năng · vị trí · tải hiện tại) và xếp lịch tối ưu thời gian.</div>
              <IButton variant="brand" icon={Zap} onClick={run}>Chạy phân tích AI</IButton>
            </div>
          )}

          {phase === "running" && (
            <div className="rounded-lg border border-border p-6 text-center bg-muted/30">
              <div className="inline-flex items-center gap-2 text-brand font-medium">
                <div className="w-3 h-3 rounded-full bg-brand animate-pulse" />
                AI đang phân tích kỹ năng · ca làm việc · tải task...
              </div>
              <div className="mt-3 max-w-md mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-brand animate-[pulse_1.4s_ease-in-out_infinite]" style={{ width: "75%" }} />
              </div>
            </div>
          )}

          {phase === "done" && (
            <>
              {/* Kết quả phân công */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-navy uppercase tracking-wide">Kết quả đề xuất ({plan.length} task)</div>
                  <div className="text-[11px] text-muted-foreground">Match trung bình <span className="font-semibold text-success">{Math.round(plan.reduce((s, p) => s + p.score, 0) / plan.length)}%</span></div>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        {["Task", "Order", "Loại bước", "Nhân sự đề xuất", "Match", "Bắt đầu", "Kết thúc", "KPI dự kiến"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {plan.map((p) => (
                        <tr key={p.taskId} className="border-t border-border hover:bg-muted/30">
                          <td className="px-3 py-2 font-medium text-brand">{p.taskId}</td>
                          <td className="px-3 py-2">{p.orderId}</td>
                          <td className="px-3 py-2 max-w-[160px] truncate" title={p.type}>{p.type}</td>
                          <td className="px-3 py-2">
                            <div className="font-medium text-navy">{p.empName}</div>
                            <div className="text-[10px] text-muted-foreground">{p.empCode} · {p.empTitle}</div>
                          </td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold ${p.score >= 80 ? "bg-success/10 text-success" : p.score >= 60 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{p.score}%</span>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{p.start}</td>
                          <td className="px-3 py-2 text-muted-foreground">{p.end}</td>
                          <td className="px-3 py-2 text-[11px] text-muted-foreground">{p.kpi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline theo nhân sự */}
              <div>
                <div className="text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Timeline theo nhân sự</div>
                <div className="rounded-lg border border-border p-3 bg-card">
                  <div className="grid grid-cols-[160px_1fr] gap-y-1.5 text-[11px]">
                    <div></div>
                    <div className="relative h-4 border-b border-border">
                      {Array.from({ length: 11 }).map((_, i) => {
                        const m = T0 + i * 60;
                        return <div key={i} className="absolute top-0 text-[10px] text-muted-foreground" style={{ left: `${((m - T0) / (T1 - T0)) * 100}%` }}>{String(m / 60).padStart(2, "0")}:00</div>;
                      })}
                    </div>
                    {empGroups.map((g) => (
                      <Fragment key={g.code}>
                        <div className="text-muted-foreground truncate pr-2">{g.name}</div>
                        <div className="relative h-6 bg-muted/30 rounded">
                          {g.items.map((it) => {
                            const left = ((it.startMin - T0) / (T1 - T0)) * 100;
                            const width = ((it.endMin - it.startMin) / (T1 - T0)) * 100;
                            return (
                              <div key={it.taskId} className="absolute top-0.5 bottom-0.5 rounded bg-brand/80 hover:bg-brand text-white text-[10px] px-1.5 flex items-center overflow-hidden cursor-pointer" style={{ left: `${left}%`, width: `${width}%` }} title={`${it.taskId} · ${it.type} · ${it.start}-${it.end}`}>
                                {it.taskId}
                              </div>
                            );
                          })}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/30 rounded-b-xl flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">AI tối ưu theo: kỹ năng phù hợp · ca làm việc · tải task hiện tại · khoảng cách khu vực.</div>
          <div className="flex gap-2">
            <IButton onClick={onClose}>Đóng</IButton>
            {phase === "done" && <IButton onClick={run} icon={RefreshCw}>Chạy lại</IButton>}
            {phase === "done" && <IButton variant="brand" icon={CheckCircle2} onClick={apply}>Áp dụng phân công</IButton>}
          </div>
        </div>
      </div>
    </div>
  );
}



export function InboundTasks() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string[]>([]);
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const [slaGroup, setSlaGroup] = useState("");
  const [assignId, setAssignId] = useState<string | undefined>();
  const [aiOpen, setAiOpen] = useState(false);

  const orderById = useMemo(() => Object.fromEntries(orders.map((o) => [o.id, o])), []);
  const whOptions = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
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

  const rows = useMemo(() => tasks.filter((t) => {
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
  const isUnassigned = (t: Task) => !t.owner || t.owner === "—" || t.status === "Chờ phân công";

  const isOverdue = (t: Task) => t.status !== "Hoàn thành" && (t.status === "Quá hạn" || (typeof t.slaPct === "number" && t.slaPct >= 100));
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
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Danh sách task" }]}>
      <PageHeader title="Danh sách task nhập kho" subtitle="Task tổng hợp – sinh trực tiếp từ Order qua Task Template"
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
          <MultiSelectDropdown options={INB_FLOW_STEPS} value={type} onChange={setType} placeholder="Loại task" />
          <MultiSelectDropdown options={["Chưa bắt đầu", "Đang xử lý", "Pending", "Quá hạn", "Hoàn thành", "Phát sinh", "Chờ phân công"]} value={status} onChange={setStatus} placeholder="Trạng thái task" />
          <MultiSelectDropdown options={Array.from(new Set(tasks.map((t) => t.orderId)))} value={orderId} onChange={setOrderId} placeholder="Order" />
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
              const step = INB_FLOW_STEPS.indexOf(t.type) + 1;
              const unassigned = isUnassigned(t);
              return (
                <tr key={t.id} className={`border-t border-border hover:bg-muted/30 ${isOverdue(t) ? "bg-destructive/10" : ""}`}>
                  <td className="px-3 py-2"><Link to={`/inbound/tasks/${t.id}`} className="text-brand font-medium">{t.id}</Link></td>
                  <td className="px-3 py-2"><Link to={`/inbound/orders/${t.orderId}`} className="text-brand">{t.orderId}</Link></td>
                  <td className="px-3 py-2">{step > 0 && <span className="text-muted-foreground mr-1">B{step}.</span>}{t.type}</td>
                  <td className="px-3 py-2">{unassigned ? <span className="text-warning italic">Chưa phân công</span> : t.owner}</td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground">{t.zone}</td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground tabular-nums">{t.startAt || "—"}</td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground tabular-nums">{t.endAt || "—"}</td>
                  <td className="px-3 py-2"><SLAPill pct={t.slaPct} label={t.sla} status={t.status} /></td>
                  <td className="px-3 py-2"><IBadge>{t.status}</IBadge></td>
                  
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-1 justify-end">
                      {unassigned && <IButton size="sm" icon={UserCheck} onClick={() => setAssignId(t.id)}>Phân công</IButton>}
                      <Link to={`/inbound/tasks/${t.id}`}><IButton size="sm" icon={CheckCircle2}>Cập nhật tiến độ</IButton></Link>
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
        <li>Task nhập kho sinh từ Order theo Task Template (INB-NCC / INB-TRF / INB-OTH).</li>
        <li>Bước "Chưa bắt đầu" sẽ kích hoạt khi bước trước đó hoàn thành (theo dependsOn).</li>
        <li>Task "Chờ phân công" = hệ thống chưa tìm được nhân sự phù hợp – dùng nút Phân công để giao việc thủ công.</li>
        <li>Quản lý có thể override người thực hiện nhưng bắt buộc nhập lý do.</li>
      </RuleNote></div>

      <AssignTaskModal open={!!assignId} onClose={() => setAssignId(undefined)} taskId={assignId} />
      <AISchedulerModal open={aiOpen} onClose={() => setAiOpen(false)} rows={rows} />
    </AppShell>
  );
}

/* ─────────────────────────────────── 8-15. TASK DETAIL ROUTER ─────────────────────────────────── */
export function InboundTaskDetail() {
  const { id = "TSK-9921" } = useParams();
  const t = getTask(id);
  // Dispatch by catalog code
  switch (t.code) {
    case "T-NCC": return <TaskConfirmOrder task={t} />;
    case "T-UNL": return <TaskUnload task={t} />;
    case "T-HO":  return <TaskCheck task={t} />;
    case "T-AGR": return <TaskTAGR task={t} />;
    case "T-SIG": return <TaskVOffice task={t} />;
    case "T-PAC": return <TaskPacking task={t} />;
    case "T-MV1": return <TaskMoveStaging task={t} />;
    case "T-MV2": return <TaskMovePacking task={t} />;
    case "T-MV3": return <TaskPutaway task={t} />;
    case "T-APR": return <TaskApproveSchedule task={t} />;
    case "T-SCR": return <TaskSecurity task={t} />;
    case "T-WH":  return <TaskOrderMonitor task={t} />;
    default: return <TaskGeneric task={t} />;
  }
}

function EvidenceField() {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <Field label="Bằng chứng đính kèm (tuỳ chọn)">
      <div className="space-y-2">
        <label className="flex items-center gap-2 h-9 px-3 rounded border border-dashed border-input bg-card text-sm cursor-pointer hover:bg-muted/40">
          <Camera className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Chọn ảnh / file để đính kèm</span>
          <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []).map(f => f.name))} />
        </label>
        {files.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-1">
            {files.map((f, i) => <li key={i}>• {f}</li>)}
          </ul>
        )}
      </div>
    </Field>
  );
}

function TaskShell({ task, title, subtitle, children, actions, rules, showOrderSummary, hideOrderItems, hideTaskHeader, completeDisabled, hideSidebarExtras, completeLabel, fullWidth }: { task: Task; title: string; subtitle?: string; children: React.ReactNode; actions?: React.ReactNode; rules?: React.ReactNode; showOrderSummary?: boolean; hideOrderItems?: boolean; hideTaskHeader?: boolean; completeDisabled?: boolean; hideSidebarExtras?: boolean; completeLabel?: string; fullWidth?: boolean }) {
  const [extend, setExtend] = useState(false);
  const [done, setDone] = useState(false);
  const [extMin, setExtMin] = useState(30);
  const [reason, setReason] = useState("");
  const [claimed, setClaimed] = useState(task.status !== "Chưa bắt đầu" && task.status !== "Chờ phân công");
  const [claimedAt, setClaimedAt] = useState<string | null>(task.startAt || null);
  const isKCS = task.type === "KCS";
  const order = getOrder(task.orderId);
  const unassigned = !task.owner || task.owner === "—" || task.status === "Chờ phân công";
  const canClaim = !isKCS && !claimed && !unassigned;
  const handleClaim = () => {
    const now = formatDateTime(new Date());
    setClaimed(true);
    setClaimedAt(now);
    toast.success(`Đã nhận việc ${task.id} · Bắt đầu tính KPI lúc ${now}`);
  };
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Task", to: "/inbound/tasks" }, { label: task.id }]}>
      <PageHeader title={`${title} – ${task.id}`} subtitle={subtitle || `${task.orderId} · ${task.zone}`}
        actions={isKCS
          ? <IBadge>Do SAP thực hiện · chờ kết quả</IBadge>
          : <>
              {canClaim && <IButton variant="brand" icon={Play} onClick={handleClaim}>Nhận việc</IButton>}
              {claimed && claimedAt && <span className="inline-flex items-center gap-1 text-[11px] px-2 h-6 rounded-full bg-success/10 text-success font-medium">Đã nhận · {claimedAt}</span>}
              <IButton icon={Clock} onClick={() => setExtend(true)}>Gia hạn KPI</IButton>
              {actions || <IButton variant="brand" icon={CheckCircle2} disabled={completeDisabled || !claimed} onClick={() => setDone(true)}>{completeLabel || "Hoàn thành"}</IButton>}
            </>} />


      {!hideTaskHeader && (
        <TaskInfoHeader
          status={task.status}
          slaPct={task.slaPct}
          slaLabel={task.sla}
          orderId={task.orderId}
          orderHref={`/inbound/orders/${task.orderId}`}
          orderSub={order?.sourceDoc}
          type={task.type}
          zone={task.zone}
          owner={isKCS ? "SAP (tự động)" : task.owner}
          unassigned={unassigned && !isKCS}
        />
      )}
      {showOrderSummary && order && <div className="mb-4"><OrderSummaryCard order={order} type="inbound" hideItems={hideOrderItems} /></div>}

      <div className="space-y-4">
        {children}
      </div>
      {rules && !fullWidth && rules}

      <ConfirmModal open={done} onClose={() => setDone(false)} title="Hoàn thành task"
        message={
          <div className="space-y-2 text-sm">
            <p>Task <b>{task.id}</b> ({task.type}) sẽ chuyển trạng thái <b>Hoàn thành</b> và ghi transaction.</p>
            <EvidenceField />
          </div>
        }
        confirmLabel="Hoàn thành" onConfirm={() => { toast.success(`Task ${task.id} đã hoàn thành`); setDone(false); }} />
      <ConfirmModal open={extend} onClose={() => setExtend(false)} title="Gia hạn thời gian thực hiện"
        message={
          <div className="space-y-2 text-sm">
            <p>Gia hạn KPI cho task <b>{task.id}</b>. Hệ thống sẽ ghi transaction và thông báo cho quản lý.</p>
            <Field label="Thời gian gia hạn (phút)">
              <input type="number" min={5} step={5} value={extMin} onChange={(e) => setExtMin(+e.target.value)} className="h-9 w-full px-3 rounded border border-input bg-card text-sm" />
            </Field>
            <Field label="Lý do gia hạn" required>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-20 p-2 rounded border border-input text-sm" placeholder="Nhập lý do..." />
            </Field>
            <EvidenceField />
          </div>
        }
        confirmLabel="Ghi nhận gia hạn" onConfirm={() => { toast.success(`Đã gia hạn ${extMin}p cho task ${task.id}`); setExtend(false); }} />
    </AppShell>
  );
}

/* ─── 8. Dỡ hàng (chỉ view – không nhập liệu) ─── */
function TaskUnload({ task }: { task: Task }) {
  const o = getOrder(task.orderId);
  const [confirmDone, setConfirmDone] = useState(false);
  return (
    <TaskShell task={task} title="Dỡ hàng" actions={<IButton variant="brand" icon={CheckCircle2} onClick={() => setConfirmDone(true)}>Hoàn thành dỡ hàng</IButton>}
      rules={<RuleNote><li>Bước dỡ hàng <b>chỉ xem thông tin</b> – không nhập số kiện thực dỡ / tình trạng tại bước này.</li><li>1 đơn có nhiều hàng hóa → thông tin dỡ hàng hiển thị dạng bảng theo dòng.</li><li>Mọi ghi nhận sai lệch số lượng / tình trạng sẽ thực hiện ở bước <b>Kiểm hàng</b>.</li><li>Realtime gửi tiến độ về WMS.</li></RuleNote>}>
      <Section title="Thông tin chung">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <Field label="Đơn nhập"><input value={o.id} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm font-medium" /></Field>
          <Field label="Dock / Khu nhận"><input value="DK-03 – Cửa Bắc" readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Số dòng"><input value={o.items.length || o.lines} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Tổng SL"><input value={o.qty} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
        </div>
      </Section>
      <Section title="Danh sách hàng dỡ" actions={<IBadge>Chỉ xem</IBadge>}>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Mã hàng</th>
            <th className="px-3 py-2 text-left font-medium">Tên hàng</th>
            <th className="px-3 py-2 text-left font-medium">Loại hàng</th>
            <th className="px-3 py-2 text-left font-medium">ĐVT</th>
            <th className="px-3 py-2 text-right font-medium">Số kiện dự kiến</th>
          </tr></thead>
          <tbody>{o.items.map((i) => (
            <tr key={i.sku} className="border-b border-border/60">
              <td className="px-3 py-2 font-medium text-navy">{i.sku}</td>
              <td className="px-3 py-2">{i.name}</td>
              <td className="px-3 py-2 text-muted-foreground">Thiết bị viễn thông</td>
              <td className="px-3 py-2">{i.uom}</td>
              <td className="px-3 py-2 text-right">{i.docQty}</td>
            </tr>
          ))}</tbody>
        </table>
        <div className="mt-3 text-[11px] text-muted-foreground italic">* Số kiện thực dỡ và tình trạng hàng sẽ được ghi nhận tại bước Kiểm hàng (T-Ho).</div>
      </Section>
      <ConfirmModal open={confirmDone} onClose={() => setConfirmDone(false)} title="Hoàn thành dỡ hàng" message={`Xác nhận đã dỡ xong ${o.items.length || o.lines} dòng cho đơn ${task.orderId} và gửi tiến độ về WMS.`} confirmLabel="Hoàn thành" onConfirm={() => toast.success(`Đã hoàn thành dỡ hàng cho ${task.orderId}`)} />
    </TaskShell>
  );
}
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return <label className="block"><span className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}{required && <span className="text-destructive ml-0.5">*</span>}</span>{children}</label>;
}

/* ─── 9. Kiểm hàng & Ký BBBG (1 task, 1 người thực hiện) ─── */
function TaskCheck({ task }: { task: Task }) {
  const o = getOrder(task.orderId);
  const [done, setDone] = useState(false);
  const [reject, setReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [mode, setMode] = useState<"accept" | "reject" | null>(null);
  return (
    <TaskShell task={task} title="Kiểm hàng & Ký BBBG"
      actions={<>
        <IButton icon={ScanLine}>Scan barcode/RFID</IButton>
        <IButton variant="brand" icon={CheckCircle2} onClick={() => setDone(true)}>Hoàn thành</IButton>
      </>}
      rules={<RuleNote>
        <li>Người thực hiện <b>không cần cập nhật số lượng & tình trạng hàng hóa thực tế</b> ở task này — hệ thống lấy theo chứng từ.</li>
        <li>Đối chiếu trực tiếp với hàng hóa: nếu <b>số liệu sai / tình trạng không đảm bảo</b> → chọn <b>Từ chối nhận hàng</b> (bắt buộc nhập lý do).</li>
        <li>Kiểm hàng và ký BBBG do <b>cùng 1 người</b> thực hiện trong cùng một task — không tách thành 2 bước riêng.</li>
        <li>Hàng quản lý serial → SL serial scan phải khớp SL chứng từ.</li>
        <li>Còn dòng chưa kiểm → không cho ký BBBG (trừ override có quyền).</li>
      </RuleNote>}>
      <Section title="Quyết định xử lý">
        <div className="text-xs text-muted-foreground mb-2">Quyết định *</div>
        <div className="flex gap-2">
          <button onClick={() => setMode("accept")} className={`flex-1 p-4 rounded-lg border text-left transition-colors ${mode === "accept" ? "border-success bg-success/5" : "border-border hover:bg-muted/40"}`}>
            <CheckCircle2 className="w-5 h-5 text-success mb-2" />
            <div className="font-semibold text-navy">Hoàn thành kiểm hàng & Ký BBBG</div>
            <div className="text-xs text-muted-foreground mt-1">Số liệu khớp chứng từ, tình trạng hàng đảm bảo. Tiến hành ký BBBG hoàn tất tiếp nhận.</div>
          </button>
          <button onClick={() => { setMode("reject"); setReject(true); }} className={`flex-1 p-4 rounded-lg border text-left transition-colors ${mode === "reject" ? "border-destructive bg-destructive/5" : "border-border hover:bg-muted/40"}`}>
            <XCircle className="w-5 h-5 text-destructive mb-2" />
            <div className="font-semibold text-navy">Từ chối nhận hàng</div>
            <div className="text-xs text-muted-foreground mt-1">Bắt buộc nhập lý do. Hệ thống gọi API-REJECT đồng bộ SAP/VERP.</div>
          </button>
        </div>
        {mode === "reject" && (
          <div className="mt-4">
            <Field label="Lý do từ chối" required>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="w-full p-2 rounded border border-input text-sm" placeholder="VD: Hàng móp méo, ướt; SL sai so với chứng từ; sai mã hàng..." />
            </Field>
          </div>
        )}
      </Section>
      <Section title="Quét mã đối chiếu chứng từ" actions={<IBadge>Đã quét 3/5 dòng</IBadge>}>
        <div className="relative">
          <ScanLine className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand" />
          <input placeholder="Đặt con trỏ ở đây và quét mã barcode / RFID..." className="h-12 w-full pl-11 pr-4 rounded-lg border-2 border-dashed border-brand/40 bg-brand/5 text-sm font-mono" />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">Quét để xác nhận hàng đúng chứng từ — không nhập tay SL/tình trạng.</div>
      </Section>
      <Section title="Danh sách hàng kiểm (theo chứng từ – chỉ xem)" actions={<IBadge>Read-only</IBadge>}>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Mã hàng</th><th className="px-3 py-2 text-left font-medium">Tên</th>
            <th className="px-3 py-2 text-right font-medium">SL chứng từ</th><th className="px-3 py-2 text-left font-medium">ĐVT</th>
            <th className="px-3 py-2 text-left font-medium">Serial</th><th className="px-3 py-2 text-left font-medium">Kết quả đối chiếu</th>
          </tr></thead>
          <tbody>{o.items.map((i) => (
            <tr key={i.sku} className="border-b border-border/60">
              <td className="px-3 py-2 font-medium text-navy">{i.sku}</td>
              <td className="px-3 py-2">{i.name}</td>
              <td className="px-3 py-2 text-right font-semibold">{i.docQty}</td>
              <td className="px-3 py-2 text-muted-foreground">{i.uom}</td>
              <td className="px-3 py-2">{i.serial ? <button className="text-brand text-[11px] underline">Quét {i.docQty}</button> : "—"}</td>
              <td className="px-3 py-2"><IBadge>Khớp chứng từ</IBadge></td>
            </tr>
          ))}</tbody>
        </table>
        <div className="mt-3 text-[11px] text-muted-foreground italic">* Sai lệch SL/tình trạng → bấm <b>Từ chối nhận hàng</b> và nhập lý do, hệ thống không cho ký BBBG.</div>
      </Section>

      <Section title="Biên bản bàn giao (BBBG)" actions={<IBadge>Tự sinh từ chứng từ</IBadge>}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="aspect-[1/1.2] bg-muted/40 border border-border rounded p-6 text-sm">
            <div className="text-center font-bold text-navy mb-3">BIÊN BẢN BÀN GIAO HÀNG HÓA</div>
            <div className="text-xs text-muted-foreground text-center mb-4">Số: BBBG-2026-{task.id.slice(-4)} · Ngày: 18/05/2026</div>
            <div className="space-y-1 text-xs">
              <div>Bên giao: {o.source}</div>
              <div>Bên nhận: Kho HN01 – Viettel</div>
              <div>Số dòng: {o.lines} · Tổng SL: {o.qty}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">Người ký (nhân sự kiểm hàng ký luôn — không cần thủ kho ký riêng)</div>
            {["NV kiểm hàng (người đang thao tác)", "Đại diện bên giao (NCC)"].map((r) => (
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
            <p>Task <b>{task.id}</b> – đơn <b>{task.orderId}</b> sẽ chuyển sang trạng thái <b>Từ chối nhận hàng</b> và gửi API-REJECT về SAP/VERP.</p>
            <Field label="Lý do từ chối" required>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full p-2 rounded border border-input text-sm" placeholder="VD: Hàng móp méo, ướt; SL sai so với chứng từ; sai mã hàng..." />
            </Field>
            <EvidenceField />
          </div>
        }
        confirmLabel="Gửi từ chối (API-REJECT)"
        onConfirm={() => {
          if (!rejectReason.trim()) { toast.error("Vui lòng nhập lý do từ chối"); return; }
          toast.success(`Đã từ chối nhận hàng cho ${task.orderId}`); setReject(false);
        }} />
      <ConfirmModal open={done} onClose={() => setDone(false)} title="Hoàn thành kiểm hàng & Ký BBBG"
        message={`Xác nhận hoàn thành kiểm hàng và ký BBBG cho đơn ${task.orderId}.`}
        confirmLabel="Hoàn thành"
        onConfirm={() => { toast.success(`Đã hoàn thành kiểm hàng & ký BBBG cho ${task.orderId}`); setDone(false); }} />
    </TaskShell>
  );
}
function TaskKCS({ task }: { task: Task }) {
  return (
    <TaskShell task={task} title="KCS – Kiểm tra chất lượng (SAP)"
      rules={<RuleNote>
        <li>KCS do <b>SAP</b> thực hiện. Kho thông minh chỉ tiếp nhận kết quả qua API.</li>
        <li>Khi nhận kết quả: Đạt → tự chuyển bước Thực nhập T-AGR; Không đạt → tự sinh task <i>Xử lý không đạt</i>.</li>
        <li>Nhân sự kho <b>không</b> nhập kết quả KCS thủ công tại task này.</li>
        <li>Quá SLA chờ kết quả → cảnh báo và escalate sang điều phối SAP.</li>
      </RuleNote>}>
      <Section title="Trạng thái yêu cầu KCS (SAP)">
        <div className="grid grid-cols-4 gap-3 text-sm">
          <div className="p-3 rounded border border-border bg-muted/30"><div className="text-xs text-muted-foreground">Gửi yêu cầu KCS</div><div className="font-semibold text-success mt-0.5">✓ 09:00 · API-KCS-REQ</div></div>
          <div className="p-3 rounded border border-border bg-muted/30"><div className="text-xs text-muted-foreground">SAP xác nhận tiếp nhận</div><div className="font-semibold text-success mt-0.5">✓ 09:00:12</div></div>
          <div className="p-3 rounded border border-border bg-muted/30"><div className="text-xs text-muted-foreground">Kết quả KCS (API-KCS-RES)</div><div className="font-semibold text-warning mt-0.5">Chờ SAP đẩy về</div></div>
          <div className="p-3 rounded border border-border bg-muted/30"><div className="text-xs text-muted-foreground">SLA chờ kết quả</div><div className="font-semibold text-destructive mt-0.5">Quá 2h15</div></div>
        </div>
      </Section>
      <Section title="Payload gửi sang SAP">
        <pre className="text-[11px] bg-muted/40 p-3 rounded border border-border overflow-x-auto">{`POST /api/kcs-request
{
  "orderId": "${task.orderId}",
  "lines": [
    { "sku": "RRU-4408", "qty": 16, "serial": true },
    { "sku": "PWR-48V-30A", "qty": 60 }
  ],
  "requestedAt": "2026-05-18T09:00:00+07:00"
}`}</pre>
      </Section>
      <Section title="Kết quả KCS gần nhất nhận từ SAP">
        <div className="text-xs text-muted-foreground mb-2">Hệ thống chỉ hiển thị (read-only). Mọi cập nhật đến từ <b>API-KCS-RES</b>.</div>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border"><th className="px-3 py-2 text-left">Mã hàng</th><th className="px-3 py-2 text-left">Kết quả</th><th className="px-3 py-2 text-left">Lỗi</th><th className="px-3 py-2 text-left">Mức độ</th><th className="px-3 py-2 text-right">SL không đạt</th></tr></thead>
          <tbody>
            <tr className="border-b border-border/60"><td className="px-3 py-2 font-medium">ANT-5G-32T</td><td className="px-3 py-2"><IBadge>Đạt</IBadge></td><td className="px-3 py-2">—</td><td className="px-3 py-2">—</td><td className="px-3 py-2 text-right">0</td></tr>
            <tr className="border-b border-border/60"><td className="px-3 py-2 font-medium">RRU-4408</td><td className="px-3 py-2"><IBadge>KCS Failed</IBadge></td><td className="px-3 py-2">Sai số seri</td><td className="px-3 py-2"><IBadge>Major</IBadge></td><td className="px-3 py-2 text-right">4</td></tr>
            <tr className="border-b border-border/60"><td className="px-3 py-2 font-medium">PWR-48V-30A</td><td className="px-3 py-2"><IBadge>Pending</IBadge></td><td className="px-3 py-2">—</td><td className="px-3 py-2">—</td><td className="px-3 py-2 text-right">—</td></tr>
          </tbody>
        </table>
      </Section>
    </TaskShell>
  );
}
/* ─── 11. Xử lý hàng không đạt ─── */
function TaskReject({ task }: { task: Task }) {
  return (
    <TaskShell task={task} title="Xử lý hàng không đạt KCS" actions={<><IButton variant="outline">Cách ly</IButton><IButton variant="outline">Gửi xử lý ngoại lệ</IButton><IButton variant="brand" icon={ArrowRight}>Tạo task trả hàng</IButton></>}
      rules={<RuleNote><li>Hàng không đạt KHÔNG được thực nhập chính thức.</li><li>Ngoại lệ bắt buộc có người có thẩm quyền phê duyệt.</li><li>Trả hàng phải có biên bản và cập nhật transaction.</li></RuleNote>}>
      <Section title="Hàng không đạt cần xử lý">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border"><th className="px-3 py-2 text-left">Mã hàng</th><th className="px-3 py-2 text-left">Lỗi</th><th className="px-3 py-2 text-left">Mức</th><th className="px-3 py-2 text-right">SL</th><th className="px-3 py-2 text-left">NCC</th><th className="px-3 py-2 text-left">Phương án</th></tr></thead>
          <tbody>
            {[["RRU-4408","Sai serial","Major",4,"CommScope"],["PWR-48V-30A","Vỏ móp","Minor",2,"CommScope"]].map(([sku,err,lvl,qty,sup]) => (
              <tr key={sku as string} className="border-b border-border/60">
                <td className="px-3 py-2 font-medium">{sku}</td><td className="px-3 py-2">{err}</td>
                <td className="px-3 py-2"><IBadge>{lvl as string}</IBadge></td><td className="px-3 py-2 text-right font-semibold text-destructive">{qty as number}</td>
                <td className="px-3 py-2">{sup}</td>
                <td className="px-3 py-2"><select className="h-7 px-1.5 rounded border border-input text-xs"><option>Trả hàng</option><option>Cách ly</option><option>Chờ quyết định</option><option>Nhập ngoại lệ</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </TaskShell>
  );
}

/* ─── 12. Thực nhập T-AGR ─── */
function TaskTAGR({ task }: { task: Task }) {
  const [confirm, setConfirm] = useState(false);
  const order = orders.find((o) => o.id === task.orderId);
  const items = order?.items?.length ? order.items : (orders.find((o) => o.items.length > 0)?.items ?? []);
  const totalDoc = items.reduce((s, it) => s + it.docQty, 0);
  const totalRecv = items.reduce((s, it) => s + it.recvQty, 0);
  const totalPass = items.filter((it) => it.kcs === "Đạt").reduce((s, it) => s + it.recvQty, 0);
  const totalFail = items.filter((it) => it.kcs === "Không đạt").reduce((s, it) => s + it.recvQty, 0);
  const kcsTone = (k: string) => k === "Đạt" ? "bg-success/10 text-success" : k === "Không đạt" ? "bg-destructive/10 text-destructive" : k === "Một phần" ? "bg-warning/10 text-warning" : k === "Pending" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground";
  return (
    <TaskShell task={task} title="Thực nhập T-AGR" actions={<><IButton variant="outline" icon={RefreshCw}>Retry SAP</IButton><IButton variant="brand" icon={CheckCircle2} onClick={() => setConfirm(true)}>Xác nhận thực nhập & gửi SAP</IButton></>}
      rules={<RuleNote><li>Chỉ thực nhập khi kiểm hàng và KCS (nếu luồng yêu cầu) đã hoàn tất.</li><li>Luồng có KCS → chỉ thực nhập phần đạt KCS; phần Không đạt / Pending không được ghi nhận thực nhập.</li><li>API6 lỗi → cho retry và ghi log.</li><li>Sau khi SAP trả số phiếu, không cho sửa SL (trừ quy trình điều chỉnh).</li></RuleNote>}>
      <Section title="Tổng hợp số liệu thực nhập">
        <div className="grid grid-cols-3 gap-3">
          <KCard label="Tổng chứng từ" value={totalDoc || 480} tone="default" />
          <KCard label="Tổng thực nhận" value={totalRecv || 478} tone="info" hint={`Thiếu ${Math.max(0, (totalDoc || 480) - (totalRecv || 478))}`} />
          <KCard label="Đạt KCS" value={totalPass || 472} tone="success" />
          <KCard label="Không đạt KCS" value={totalFail || 6} tone="destructive" />
          <KCard label="Được thực nhập" value={totalPass || 472} tone="brand" />
          <KCard label="Trạng thái SAP" value={<IBadge>Pending</IBadge>} />
        </div>
      </Section>

      <Section title={`Danh sách hàng hóa theo kết quả KCS (${items.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2 text-left font-medium">Mã hàng</th>
              <th className="px-3 py-2 text-left font-medium">Tên</th>
              <th className="px-3 py-2 text-left font-medium">ĐVT</th>
              <th className="px-3 py-2 text-right font-medium">Chứng từ</th>
              <th className="px-3 py-2 text-right font-medium">Thực nhập</th>
              <th className="px-3 py-2 text-right font-medium">Chênh lệch</th>
              <th className="px-3 py-2 text-center font-medium">KCS</th>
              <th className="px-3 py-2 text-left font-medium">HU</th>
              <th className="px-3 py-2 text-left font-medium">Vị trí</th>
            </tr></thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={9} className="py-6 text-center text-muted-foreground">Chưa có dữ liệu hàng hóa</td></tr>
              )}
              {items.map((it) => {
                const grQty = it.kcs === "Đạt" ? it.recvQty : it.kcs === "Một phần" ? Math.floor(it.recvQty * 0.8) : 0;
                const diff = grQty - it.docQty;
                return (
                  <tr key={it.sku} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="px-3 py-2 font-semibold text-brand">{it.sku}</td>
                    <td className="px-3 py-2 font-medium text-navy">{it.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{it.uom}</td>
                    <td className="px-3 py-2 text-right">{it.docQty}</td>
                    <td className="px-3 py-2 text-right font-semibold">{grQty}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${diff === 0 ? "text-muted-foreground" : "text-destructive"}`}>{diff > 0 ? `+${diff}` : diff}</td>
                    <td className="px-3 py-2 text-center"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${kcsTone(it.kcs)}`}>{it.kcs}</span></td>
                    <td className="px-3 py-2 text-muted-foreground">{it.hu || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{it.putaway || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Lịch sử gửi SAP/VERP">
        <ApiTable rows={apiLogs.filter((l) => l.code === "API6")} />
      </Section>
      <ConfirmModal open={confirm} onClose={() => setConfirm(false)} title="Xác nhận thực nhập" confirmLabel="Gửi T-AGR sang SAP" danger
        message={`Sẽ ghi nhận thực nhập ${totalPass || 472} đơn vị cho ${task.orderId} và gửi T-AGR sang SAP/VERP. Sau khi nhận số phiếu, dữ liệu không thể chỉnh sửa.`}
        onConfirm={() => toast.success(`Đã gửi T-AGR sang SAP cho ${task.orderId}`)} />
    </TaskShell>
  );
}

/* ─── 13. Ký VOffice ─── */
function TaskVOffice({ task }: { task: Task }) {
  const [preview, setPreview] = useState(false);
  const flowFiles = [
    { stt: 1, name: "Phiếu nhập kho", type: "PDF", source: "Hệ thống", required: true, status: "Đã đính kèm" },
    { stt: 2, name: "Biên bản bàn giao", type: "PDF", source: "Hệ thống", required: true, status: "Đã đính kèm" },
    { stt: 3, name: "Kết quả KCS", type: "PDF", source: "Hệ thống", required: true, status: "Đã đính kèm" },
  ];
  const extraFiles = [
    { stt: 1, name: "Bảng kê chi tiết hàng hóa.xlsx", type: "XLSX", source: "Người dùng", required: false, status: "Đã đính kèm" },
  ];
  const signers = [
    { stt: 1, order: 1, role: "Thủ trưởng đơn vị", name: "Nguyễn Văn A", unit: "Tổng công ty Giải pháp Doanh nghiệp", contact: "nguyenvana@viettel.com.vn", parallel: "--", showSig: "Có", status: "Chưa gửi", time: "--", note: "Ký, đóng dấu" },
    { stt: 2, order: 2, role: "Phụ trách kho",    name: "Trần Văn B",    unit: "Kho HN01", contact: "tranvanb@viettel.com.vn",   parallel: "--", showSig: "Có", status: "Chưa gửi", time: "--", note: "Ký, họ tên" },
    { stt: 3, order: 3, role: "Thủ kho",          name: "Lê Thị C",      unit: "Kho HN01", contact: "lethic@viettel.com.vn",     parallel: "--", showSig: "Có", status: "Chưa gửi", time: "--", note: "Ký, họ tên" },
  ];
  return (
    <TaskShell task={task} title="Ký VOffice"
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
            <input className="w-full h-9 px-2 rounded border border-input text-sm" defaultValue={`Trình ký BBBG nhập kho ${task.orderId}`} />
          </Field>
          <Field label="Ngành" required>
            <select className="w-full h-9 px-2 rounded border border-input text-sm"><option>--- Chọn ---</option><option>Logistics</option><option>Kho vận</option></select>
          </Field>
          <Field label="Hình thức văn bản" required>
            <select className="w-full h-9 px-2 rounded border border-input text-sm"><option>--- Chọn ---</option><option>Biên bản</option><option>Phiếu nhập</option></select>
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
            <select className="w-full h-9 px-2 rounded border border-input text-sm"><option>LN-PNK-01 - Luồng ký phiếu nhập kho</option></select>
          </Field>
          <Field label="Mã luồng"><input className="w-full h-9 px-2 rounded border border-input text-sm bg-muted/40" readOnly defaultValue="LN-PNK-01" /></Field>
          <Field label="Tên luồng"><input className="w-full h-9 px-2 rounded border border-input text-sm bg-muted/40" readOnly defaultValue="Luồng ký phiếu nhập kho" /></Field>
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
    </TaskShell>
  );
}


/* ─── 14. Đóng gói / In tem ─── */
type InbPackRow = {
  id: string; sku: string; name: string; serial: string; qty: number;
  huType: string; huQty: number; rfid: string; useHU: boolean;
};
const INB_HU_TYPES = ["Carton C1 (40×30×25)", "Carton C2 (60×40×30)", "Pallet PL1 (120×100)", "Pallet PL2 (120×80)", "Thùng gỗ G1"];
const genInbRFID = () => `RFID-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

function TaskPacking({ task }: { task: Task }) {
  const [singleBox, setSingleBox] = useState(false);
  const [rows, setRows] = useState<InbPackRow[]>([
    { id: "r1", sku: "ANT-5G-32T", name: "Anten 5G 32T32R", serial: "SN-A2001..A2024", qty: 24, huType: "Pallet PL1 (120×100)", huQty: 1, rfid: genInbRFID(), useHU: true },
    { id: "r2", sku: "BBU-6648", name: "Baseband Unit BBU 6648", serial: "SN-B6001..B6040", qty: 40, huType: "Carton C2 (60×40×30)", huQty: 2, rfid: genInbRFID(), useHU: true },
    { id: "r3", sku: "CAB-FO-LC", name: "Cáp quang FO-LC", serial: "—", qty: 198, huType: "Carton C1 (40×30×25)", huQty: 4, rfid: genInbRFID(), useHU: true },
    { id: "r4", sku: "PWR-48V-30A", name: "Nguồn DC 48V/30A", serial: "SN-P3001..P3060", qty: 60, huType: "Carton C2 (60×40×30)", huQty: 2, rfid: genInbRFID(), useHU: false },
  ]);
  const update = (id: string, patch: Partial<InbPackRow>) => setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));

  const display = singleBox && rows.length > 0
    ? (() => { const first = rows[0]; return rows.map(r => ({ ...r, huType: first.huType, huQty: 1, rfid: first.rfid, useHU: first.useHU })); })()
    : rows;

  return (
    <TaskShell task={task} title="Đóng gói & In tem" actions={<><IButton icon={Printer}>In tất cả tem</IButton><IButton variant="brand" icon={CheckCircle2}>Hoàn thành</IButton></>}
      rules={<RuleNote>
        <li>Loại HU do <b>hệ thống tự đề xuất</b> theo kích thước & tải trọng — người dùng được sửa nếu cần.</li>
        <li>Mã tem RFID do hệ thống tự sinh; có thể <b>tự nhập/scan</b> tem thùng cũ khi không dùng HU mới.</li>
        <li><b>Có dùng HU</b> → trừ tồn loại HU đề xuất. <b>Không dùng HU</b> → không trừ tồn.</li>
        <li>Trường hợp tất cả hàng đóng chung 1 thùng → SL HU = 1, loại HU & RFID giống nhau.</li>
      </RuleNote>}>
      <Section title="AI đề xuất quy cách đóng gói" actions={<IBadge>Bot</IBadge>}>
        <div className="rounded-lg bg-brand/5 border border-brand/20 p-3 text-sm">
          <Bot className="w-5 h-5 text-brand mb-1" /> AI đề xuất: <b>1 pallet PL1 + 2 carton C2 + 4 carton C1</b>. Tối ưu thể tích & phù hợp khu G01-T02.
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
                        {INB_HU_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
                          <button className="text-xs text-brand hover:underline" onClick={() => update(r.id, { rfid: genInbRFID() })}>↻</button>
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
    </TaskShell>
  );
}

/* ─── 15. Putaway ─── */
function TaskPutaway({ task }: { task: Task }) {
  const [override, setOverride] = useState(false);
  return (
    <TaskShell task={task} title="Putaway" actions={<><IButton icon={ScanLine}>Scan HU</IButton><IButton variant="outline">Báo lỗi vị trí</IButton><IButton variant="brand" icon={CheckCircle2}>Hoàn thành putaway</IButton></>}
      rules={<><RuleNote><li>Bin phải tồn tại, đúng kho/khu, đủ sức chứa.</li><li>Loại hàng phù hợp điều kiện lưu trữ.</li><li>Vị trí thực tế khác AI → bắt buộc nhập lý do override.</li><li>Chưa scan đủ HU và vị trí → không cho xác nhận.</li><li>Hoàn thành sẽ cập nhật tồn kho theo vị trí.</li></RuleNote><Section title="Rule tính toán & đề xuất vị trí lưu trữ (AI)">
        <div className="text-xs space-y-3">
          <div className="rounded-lg border border-info/30 bg-info/5 p-3">
            <div className="font-semibold text-info mb-1">Nguyên tắc chung</div>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li><b>Đúng kho – đúng khu – đúng loại HU:</b> Vị trí đề xuất phải cùng kho với lệnh nhập, thuộc khu lưu trữ phù hợp loại hàng (Rack nặng/trung/nhẹ, Pallet, Thùng gỗ, Hàng quá khổ) và tương thích kích thước/tải trọng HU.</li>
              <li><b>Điều kiện bảo quản:</b> Hàng yêu cầu nhiệt độ / chống ẩm / phòng cháy nổ chỉ đề xuất vào khu có điều kiện tương ứng (VD: phòng lạnh 20–30°C).</li>
              <li><b>Sức chứa còn lại:</b> Bin phải có trạng thái <i>EMPTY</i> hoặc <i>OCCUPIED</i> cùng SKU và còn dư tải trọng, thể tích, số lượng stack.</li>
              <li><b>Không xét bin BLOCKED / INACTIVE / RESERVED cho lệnh khác.</b></li>
            </ul>
          </div>
          <div className="rounded-lg border border-brand/30 bg-brand/5 p-3">
            <div className="font-semibold text-brand mb-1">Thứ tự ưu tiên khi chọn bin (cao → thấp)</div>
            <ol className="list-decimal pl-5 space-y-1.5 text-foreground/90">
              <li>
                <b>Gộp cùng SKU / cùng lô:</b> Ưu tiên bin đang chứa cùng SKU – cùng lô để dễ FIFO/FEFO và tối ưu picking.
              </li>
              <li>
                <b>Hàng ra ngoài trước, hàng ở lâu trong sau:</b>
                <span className="block text-muted-foreground mt-0.5">
                  Hàng có ngày xuất / hết hạn sớm (FEFO) hoặc tồn kho động nhanh (FIFO) → cất ở <b>vị trí ngoài</b> (gần lối đi, cửa xuất, tầng thấp) để lấy nhanh.<br />
                  Hàng tồn lâu, ít xuất → cất <b>vào trong</b> (khu sâu, tầng cao), không chiếm vị trí trung tâm.
                </span>
              </li>
              <li>
                <b>ABC velocity:</b> SKU class A → khu gần cửa xuất & tầng thấp (1–2); class B → tầng giữa; class C → tầng cao / khu xa.
              </li>
              <li>
                <b>Khoảng cách di chuyển ngắn nhất:</b> Tính từ khu staging hiện tại đến bin (đường đi thực tế, tránh PCCC).
              </li>
              <li>
                <b>Cân bằng tải khu:</b> Tránh dồn một dãy rack; ưu tiên khu có utilization thấp hơn ngưỡng 85%.
              </li>
              <li>
                <b>Tầng thấp trước tầng cao</b> khi các tiêu chí trên tương đương (giảm rủi ro & thời gian nâng hạ).
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
            <div className="font-semibold text-warning mb-1">Ràng buộc & fallback</div>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li>Kiểm tra <b>Rule layout</b> (RULE-RACK/PALLET/BOX/OVERSIZE) – vi phạm → loại bin khỏi danh sách đề xuất.</li>
              <li>Nếu <b>không tìm được bin</b> phù hợp trong khu chuẩn → fallback sang <i>Khu dự phòng (D)</i> và cảnh báo.</li>
              <li>Người dùng cất khác vị trí AI đề xuất → <b>bắt buộc nhập lý do override</b>; hệ thống ghi log để AI học lại (feedback loop).</li>
              <li>AI tự re-rank mỗi khi tồn kho / trạng thái bin thay đổi (real-time).</li>
            </ul>
          </div>
        </div>
      </Section></>}>
      <Section title="HU cần cất">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border"><th className="px-3 py-2 text-left">HU</th><th className="px-3 py-2 text-left">SKU</th><th className="px-3 py-2 text-right">SL</th><th className="px-3 py-2 text-left">AI đề xuất</th><th className="px-3 py-2 text-left">Thực tế</th><th className="px-3 py-2 text-left">Trạng thái</th></tr></thead>
          <tbody>
            {[["HU-001","ANT-5G-32T",24,"G01-T02-B05","G01-T02-B05","Hoàn thành"],["HU-002","BBU-6648",40,"G01-T02-B06","G01-T02-B06","Hoàn thành"],["HU-003","CAB-FO-LC",198,"I02-T01-B04","I01-T01-B12","Đang xử lý"],["HU-004","PWR-48V-30A",60,"H01-T01-B03","—","Chưa bắt đầu"]].map(([hu,sku,qty,ai,act,st]) => (
              <tr key={hu as string} className="border-b border-border/60">
                <td className="px-3 py-2 font-medium text-brand">{hu}</td><td className="px-3 py-2">{sku}</td>
                <td className="px-3 py-2 text-right">{qty as number}</td><td className="px-3 py-2 text-info">{ai}</td>
                <td className={`px-3 py-2 ${ai !== act && act !== "—" ? "text-warning font-semibold" : ""}`}>{act}</td>
                <td className="px-3 py-2"><IBadge>{st}</IBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setOverride(true)} className="text-xs text-warning underline mt-2">⚠ HU-003 khác vị trí đề xuất – nhập lý do override</button>
      </Section>
      <Section title="Mini map khu G01 – Tầng 02">
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 96 }).map((_, i) => {
            const used = [4,5,17,18,30,55,72].includes(i);
            const ai = [29, 55].includes(i);
            return <div key={i} title={`Bin B${i+1}`} className={`aspect-square rounded ${used ? "bg-success/70" : ai ? "bg-brand/60 ring-2 ring-brand" : i % 11 === 0 ? "bg-destructive/30" : "bg-muted"}`} />;
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-success/70 rounded" /> Đã chứa</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-brand/60 rounded ring-2 ring-brand" /> AI đề xuất</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-destructive/30 rounded" /> Block</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-muted rounded" /> Trống</span>
        </div>
      </Section>
      <ConfirmModal open={override} onClose={() => setOverride(false)} danger title="Override vị trí AI đề xuất" confirmLabel="Xác nhận override"
        onConfirm={() => toast.success("Đã ghi nhận override vị trí HU-003")}
        message={<><p className="mb-2 text-sm">HU-003 sẽ được cất tại <b>I01-T01-B12</b> thay vì đề xuất <b>I02-T01-B04</b>. Nhập lý do:</p><textarea className="w-full h-20 p-2 rounded border border-input text-sm" defaultValue="Bin đề xuất hết sức chứa, chuyển sang bin cùng nhóm cáp." /></>} />
    </TaskShell>
  );
}

/* ─── Generic ─── */
/* ─── Duyệt lịch giao việc (T-APR): GĐ kho xem & duyệt danh sách phân công AI đề xuất ─── */
const WORK_CONTENT_OPTIONS = [
  "Kiểm tra lệnh NCC",
  "Dỡ hàng",
  "Kiểm hàng & Ký BBBG",
  "KCS",
  "Đóng gói",
  "Putaway",
  "Thực nhập",
  "Ký VOffice",
];

function TaskApproveSchedule({ task }: { task: Task }) {
  const orderTasks = useMemo(() => tasks.filter((x) => x.orderId === task.orderId && x.code !== "T-APR"), [task.orderId]);
  const initialPlan = useMemo(() => buildAIPlan(orderTasks), [orderTasks]);
  const today = new Date().toISOString().slice(0, 10);
  const toDT = (t: string) => `${today}T${t}`;
  const fromDT = (v: string) => (v.includes("T") ? v.slice(11, 16) : v);
  const order = useMemo(() => getOrder(task.orderId), [task.orderId]);
  const whEmployees = useMemo(() => employees.filter((e) => e.defaultWh === order.warehouse || e.allowedWhs.includes(order.warehouse)), [order.warehouse]);
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

  const [rows, setRows] = useState(() => initialPlan);
  const [approved, setApproved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Pending transfer requests (chuyển task – chờ nhân sự mới đồng ý)
  type Transfer = { taskId: string; fromCode: string; fromName: string; toCode: string; toName: string; reason: string; status: "pending" | "accepted" | "declined" };
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [transferOpen, setTransferOpen] = useState<string | null>(null);
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferReason, setTransferReason] = useState<string>("");

  // Mock realtime: chỉ còn 'delayed' (NS không có quyền từ chối nhận task)
  type RtEvent = { taskId: string; kind: "delayed" | "adjusted"; msg: string; at: string };
  const [rtEvents, setRtEvents] = useState<RtEvent[]>(() => {
    const e: RtEvent[] = [];
    if (initialPlan[1]) e.push({ taskId: initialPlan[1].taskId, kind: "delayed", msg: `${initialPlan[1].taskId} (${initialPlan[1].empName}) đang chậm deadline ~12 phút`, at: "2 phút trước" });
    return e;
  });
  const [autoAdjustedAt, setAutoAdjustedAt] = useState<string | null>(null);

  // Audit log: lịch sử mọi thay đổi NS (đổi NS rảnh, chuyển task, auto-resolve…)
  type AuditEntry = { id: string; at: string; taskId: string; action: "swap-free" | "auto-resolve" | "transfer-accepted" | "transfer-declined" | "manual-change"; fromName: string; toName: string; reason: string; actor: string };
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const nowTs = () => formatDateTime(new Date());
  const logAudit = (entry: Omit<AuditEntry, "id" | "at" | "actor">) => {
    setAudit((prev) => [{ id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: nowTs(), actor: "Trần Đăng Khoa (GĐ kho)", ...entry }, ...prev]);
  };

  const matchAvg = rows.length ? Math.round(rows.reduce((s, p) => s + p.score, 0) / rows.length) : 0;
  const totalMin = rows.reduce((s, p) => s + p.dur, 0);
  const empCount = new Set(rows.map((p) => p.empCode)).size;

  const updateRow = (taskId: string, patch: Partial<typeof rows[number]>) => {
    setRows((prev) => prev.map((r) => r.taskId === taskId ? { ...r, ...patch } : r));
    if (approved) setDirty(true);
  };

  const toMin = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const onChangeEmp = (taskId: string, code: string) => {
    const row = rows.find((x) => x.taskId === taskId);
    const elig = row ? eligibleEmployees(row.taskCode, row.warehouse) : [];
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

  // Mock: NS đang có task ở Order khác (kế hoạch trước đó) → busy windows
  const EXTERNAL_BUSY: Record<string, { start: number; end: number; orderId: string; taskId: string }[]> = {
    "VTH-00455": [{ start: 9 * 60 + 30, end: 10 * 60 + 15, orderId: "ORD-2026-0188", taskId: "TSK-9805" }],
    "VTH-00612": [{ start: 10 * 60, end: 10 * 60 + 45, orderId: "ORD-2026-0190", taskId: "TSK-9812" }],
    "VTH-00891": [{ start: 11 * 60, end: 11 * 60 + 40, orderId: "ORD-2026-0191", taskId: "TSK-9820" }],
  };

  const overlap = (a1: number, a2: number, b1: number, b2: number) => a1 < b2 && b1 < a2;

  // Kiểm tra NS có rảnh trong [s, e] không (xét cả task cùng Order trong `rows` và external busy)
  const isEmpFree = (empCode: string, s: number, e: number, excludeTaskId: string, list: typeof rows) => {
    for (const r of list) {
      if (r.taskId === excludeTaskId) continue;
      if (r.empCode === empCode && overlap(s, e, r.startMin, r.endMin)) return false;
    }
    for (const b of EXTERNAL_BUSY[empCode] || []) {
      if (overlap(s, e, b.start, b.end)) return false;
    }
    return true;
  };

  // Trả về conflict info cho 1 row (nếu có)
  const getConflict = (r: typeof rows[number], list: typeof rows) => {
    const inRow = list.find((x) => x.taskId !== r.taskId && x.empCode === r.empCode && overlap(r.startMin, r.endMin, x.startMin, x.endMin));
    if (inRow) return { kind: "same-plan" as const, label: `Trùng với ${inRow.taskId} (cùng kế hoạch)` };
    const ext = (EXTERNAL_BUSY[r.empCode] || []).find((b) => overlap(r.startMin, r.endMin, b.start, b.end));
    if (ext) return { kind: "external" as const, label: `Trùng task ${ext.taskId} – Order ${ext.orderId} (${fmt(ext.start)}–${fmt(ext.end)})` };
    return null;
  };

  // Tìm NS hợp lệ & rảnh để thay cho 1 row
  const findFreeReplacement = (r: typeof rows[number], list: typeof rows) => {
    const elig = eligibleEmployees(r.taskCode, r.warehouse).filter((e) => e.code !== r.empCode);
    return elig
      .filter((e) => isEmpFree(e.code, r.startMin, r.endMin, r.taskId, list))
      .sort((a, b) => a.load - b.load)[0] || null;
  };




  const autoAdjustDelay = () => {
    const delays = rtEvents.filter((e) => e.kind === "delayed");
    if (!delays.length) return;
    let shiftedNames: string[] = [];
    let swaps: { taskId: string; from: string; to: string }[] = [];
    setRows((prev) => {
      let pushed = 0;
      const shifted = prev.map((r) => {
        const d = delays.find((x) => x.taskId === r.taskId);
        if (d) {
          pushed = 12;
          const newEnd = r.endMin + pushed;
          return { ...r, endMin: newEnd, end: fmt(newEnd), dur: newEnd - r.startMin };
        }
        if (pushed) {
          const ns = r.startMin + pushed;
          const ne = r.endMin + pushed;
          return { ...r, startMin: ns, endMin: ne, start: fmt(ns), end: fmt(ne) };
        }
        return r;
      });
      shiftedNames = shifted.filter((_, i) => i > 0).map((r) => r.empName);
      // Tự đổi NS cho row nào bị chồng lịch (cùng kế hoạch HOẶC task Order khác)
      const resolved = [...shifted];
      for (let i = 0; i < resolved.length; i++) {
        const r = resolved[i];
        if (getConflict(r, resolved)) {
          const cand = findFreeReplacement(r, resolved);
          if (cand) {
            swaps.push({ taskId: r.taskId, from: r.empName, to: cand.name });
            resolved[i] = { ...r, empCode: cand.code, empName: cand.name, empTitle: cand.titleSap };
          }
        }
      }
      return resolved;
    });
    setRtEvents((prev) => [
      ...prev,
      { taskId: delays[0].taskId, kind: "adjusted", msg: `Đã dời ${Math.max(0, rows.length - 1)} task kế tiếp +12'. Push mobile: ${shiftedNames.slice(0, 3).join(", ")}${shiftedNames.length > 3 ? `…(+${shiftedNames.length - 3})` : ""}.`, at: "vừa xong" },
      ...swaps.map((s) => ({ taskId: s.taskId, kind: "adjusted" as const, msg: `Đổi NS ${s.taskId}: ${s.from} → ${s.to} (NS cũ trùng lịch Order khác). Push mobile cho cả hai.`, at: "vừa xong" })),
    ]);
    setAutoAdjustedAt(formatDateTime(new Date()));
    if (approved) setDirty(true);
    swaps.forEach((s) => logAudit({ taskId: s.taskId, action: "auto-resolve", fromName: s.from, toName: s.to, reason: "Auto-resolve: NS cũ trùng lịch sau khi dời deadline" }));
    if (swaps.length) {
      toast.success(`Đã dời lịch & tự đổi ${swaps.length} NS bị trùng task Order khác. Đã push notification.`);
    } else {
      toast.success("Đã tự động điều chỉnh lịch & gửi push notification cho nhân sự liên quan");
    }
  };


  // Khung giờ ca làm (đi làm) – để loại NS không trong ca khi task chạy
  const SHIFT_WINDOWS: Record<string, [number, number]> = {
    S1: [6 * 60, 14 * 60],
    S2: [14 * 60, 22 * 60],
    S3: [22 * 60, 24 * 60 + 6 * 60], // qua đêm: 22:00 - 06:00 hôm sau
  };
  const empOnShift = (emp: typeof employees[number], startMin: number, endMin: number) => {
    const w = SHIFT_WINDOWS[emp.shift];
    if (!w) return true;
    // Task phải nằm hoàn toàn trong khung ca làm
    return startMin >= w[0] && endMin <= w[1];
  };

  // Chuyển task → đầy đủ điều kiện:
  //  (1) hợp lệ theo mapping vị trí – task tại đúng kho
  //  (2) đang đi làm: active=true, current ∈ {Rảnh, Hỗ trợ kho khác} (không "Nghỉ", không "Bận")
  //  (3) trong ca làm bao phủ khung giờ của task
  //  (4) rảnh trong khung [start, end] (không trùng task cùng kế hoạch / Order khác)
  const eligibleFreeForTransfer = (row: typeof rows[number]) =>
    eligibleEmployees(row.taskCode, row.warehouse)
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
    if (!target) { toast.error("Vui lòng chọn nhân sự nhận task (đã lọc theo NS rảnh & hợp lệ)"); return; }
    if (!transferReason.trim()) { toast.error("Vui lòng nhập lý do chuyển task"); return; }
    const tf: Transfer = {
      taskId: row.taskId, fromCode: row.empCode, fromName: row.empName,
      toCode: target.code, toName: target.name, reason: transferReason.trim(), status: "pending",
    };
    setTransfers((p) => [...p.filter((x) => x.taskId !== row.taskId), tf]);
    setTransferOpen(null);
    toast.success(`Đã gửi yêu cầu chuyển task tới ${target.name} – chờ đồng ý`);
    // Mô phỏng: nhân sự mới phản hồi sau 2.5s
    setTimeout(() => {
      const accepted = Math.random() > 0.2;
      setTransfers((p) => p.map((x) => x.taskId === row.taskId ? { ...x, status: accepted ? "accepted" : "declined" } : x));
      if (accepted) {
        setRows((prev) => prev.map((r) => r.taskId === row.taskId ? { ...r, empCode: target.code, empName: target.name, empTitle: target.titleSap } : r));
        if (approved) setDirty(true);
        logAudit({ taskId: row.taskId, action: "transfer-accepted", fromName: row.empName, toName: target.name, reason: tf.reason });
        toast.success(`${target.name} đã đồng ý nhận task ${row.taskId}. Đã thông báo cho ${row.empName} (NS cũ).`);
      } else {
        logAudit({ taskId: row.taskId, action: "transfer-declined", fromName: row.empName, toName: target.name, reason: `${tf.reason} (NS mới từ chối)` });
        toast.warning(`${target.name} từ chối yêu cầu chuyển task ${row.taskId}. Cần chọn nhân sự khác.`);
      }
    }, 2500);
  };

  return (
    <TaskShell task={task} title="Duyệt lịch giao việc" subtitle={`${task.orderId} · GĐ kho duyệt danh sách giao việc do AI đề xuất`} showOrderSummary hideOrderItems hideSidebarExtras fullWidth completeLabel="Xác nhận duyệt lịch">
      {rtEvents.length > 0 && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-warning">Sự kiện realtime ảnh hưởng lịch giao việc</div>
            <ul className="mt-1 space-y-0.5 text-xs text-foreground/80">
              {rtEvents.map((e, i) => (
                <li key={i}>• <span className={`font-medium ${e.kind === "adjusted" ? "text-success" : "text-warning"}`}>{e.kind === "adjusted" ? "Đã tự điều chỉnh" : "Chậm deadline"}:</span> {e.msg} <span className="text-muted-foreground">({e.at})</span></li>
              ))}
            </ul>
            {autoAdjustedAt && <div className="text-[11px] text-muted-foreground mt-1">Lần điều chỉnh gần nhất: {autoAdjustedAt}</div>}
          </div>
          {rtEvents.some((e) => e.kind === "delayed") && (
            <button onClick={autoAdjustDelay} className="h-8 px-3 rounded-md bg-warning text-warning-foreground text-xs font-semibold hover:bg-warning/90 whitespace-nowrap">Tự điều chỉnh & push mobile</button>
          )}
        </div>
      )}

      <Section title="Tóm tắt đề xuất" actions={approved ? <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${dirty ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}><CheckCircle2 className="w-3.5 h-3.5" />{dirty ? "Đã chỉnh sửa – cần duyệt lại" : "Đã phê duyệt"}</span> : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-info/10 text-info"><Clock className="w-3.5 h-3.5" />Chờ duyệt</span>}>
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

        <Section title={`Danh sách task đề xuất phân công (${rows.length})`} actions={<span className="text-[11px] text-muted-foreground"><Edit3 className="w-3 h-3 inline mr-1" />NS lọc theo mapping vị trí – task</span>}>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-xs min-w-[700px]">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                {["Task", "Nội dung công việc", "KPI", "Match"].map((h, i) => <th key={i} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const ev = rtEvents.find((x) => x.taskId === p.taskId && x.kind === "delayed");
                  const typeOptions = WORK_CONTENT_OPTIONS.includes(p.type) ? WORK_CONTENT_OPTIONS : [p.type, ...WORK_CONTENT_OPTIONS];
                  const elig = eligibleEmployees(p.taskCode, p.warehouse);
                  const empOptions = elig.length ? elig : employees.filter((e) => e.code === p.empCode);
                  const conflict = getConflict(p, rows);
                  const rowBg = conflict ? "bg-destructive/5" : ev ? "bg-warning/5" : "";
                  return (
                    <tr key={p.taskId} className={`border-t border-border hover:bg-muted/30 ${rowBg}`}>
                      <td className="px-3 py-2 whitespace-nowrap align-top">
                        <Link to={`/inbound/tasks/${p.taskId}`} className="text-brand font-medium">{p.taskId}</Link>
                        <div className="text-[10px] text-muted-foreground">{p.zone} · {p.taskCode}</div>
                        {ev && <div className="text-[10px] mt-0.5 font-medium text-warning">Chậm deadline</div>}
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

      <Section title={`Lịch sử thay đổi nhân sự (${audit.length})`} actions={<span className="text-[11px] text-muted-foreground">Audit log – mọi thao tác đổi NS đều được ghi nhận realtime</span>}>
        {audit.length === 0 ? (
          <div className="text-xs text-muted-foreground p-4 text-center border border-dashed border-border rounded-lg">Chưa có thay đổi nhân sự nào được ghi nhận cho lệnh này.</div>
        ) : (
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  {["Thời gian", "Mã audit", "Task", "Hành động", "Từ NS", "→ Đến NS", "Lý do", "Người thực hiện"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {audit.map((a) => {
                  const aLabel = a.action === "swap-free" ? "Đổi NS rảnh (thủ công)"
                    : a.action === "auto-resolve" ? "Auto-resolve trùng lịch"
                    : a.action === "transfer-accepted" ? "Chuyển task – đồng ý"
                    : a.action === "transfer-declined" ? "Chuyển task – từ chối"
                    : "Thay đổi thủ công";
                  const aTone = a.action === "transfer-declined" ? "bg-destructive/10 text-destructive"
                    : a.action === "auto-resolve" ? "bg-info/10 text-info"
                    : a.action === "swap-free" ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success";
                  return (
                    <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{a.at}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-[10px] text-muted-foreground">{a.id}</td>
                      <td className="px-3 py-2 whitespace-nowrap"><Link to={`/inbound/tasks/${a.taskId}`} className="text-brand font-medium">{a.taskId}</Link></td>
                      <td className="px-3 py-2 whitespace-nowrap"><span className={`inline-flex px-1.5 py-0.5 rounded text-[11px] font-medium ${aTone}`}>{aLabel}</span></td>
                      <td className="px-3 py-2 whitespace-nowrap">{a.fromName}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-navy">{a.toName}</td>
                      <td className="px-3 py-2 text-foreground/80">{a.reason}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{a.actor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {approved && dirty && (
        <div className="flex items-center justify-end mt-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
          <div className="text-xs text-warning font-medium">Đã chỉnh sửa sau khi duyệt – cần xác nhận phê duyệt lại</div>
        </div>
      )}

      {transferOpen && (() => {
        const row = rows.find((r) => r.taskId === transferOpen)!;
        const elig = eligibleFreeForTransfer(row);
        const baseMap = eligibleEmployees(row.taskCode, row.warehouse).filter((e) => e.code !== row.empCode);
        const offDuty = baseMap.filter((e) => !e.active || e.current === "Nghỉ").length;
        const busyStatus = baseMap.filter((e) => e.active && e.current === "Bận").length;
        const offShift = baseMap.filter((e) => e.active && e.current !== "Nghỉ" && e.current !== "Bận" && !empOnShift(e, row.startMin, row.endMin)).length;
        const conflictBusy = baseMap.filter((e) => e.active && e.current !== "Nghỉ" && e.current !== "Bận" && empOnShift(e, row.startMin, row.endMin) && !isEmpFree(e.code, row.startMin, row.endMin, row.taskId, rows)).length;
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setTransferOpen(null)}>
            <div className="bg-card rounded-xl border border-border max-w-lg w-full p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className="text-base font-semibold text-navy">Chuyển task {row.taskId}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  NS hiện tại: <b>{row.empName}</b> · Khung giờ: <b>{row.start}–{row.end}</b> · Kho <b>{row.warehouse || "—"}</b>.
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Danh sách bên dưới đã lọc theo đầy đủ điều kiện:
                  <span className="block mt-0.5">① Hợp lệ theo <b>mapping vị trí – task</b> tại đúng kho</span>
                  <span className="block">② <b>Đang đi làm</b> (active, không "Nghỉ", không "Bận")</span>
                  <span className="block">③ Trong <b>ca làm</b> bao phủ khung giờ task (S1/S2/S3)</span>
                  <span className="block">④ <b>Rảnh trong khung giờ</b> (không trùng task cùng kế hoạch hoặc Order khác)</span>
                  <span className="block mt-1">Yêu cầu chỉ áp dụng khi NS mới <b>đồng ý</b>; push notification gửi đến mobile cả NS cũ & NS mới.</span>
                </div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-2 grid grid-cols-5 gap-1 text-[10px] text-center">
                <div><div className="font-bold text-navy text-sm">{baseMap.length}</div><div className="text-muted-foreground">Hợp lệ mapping</div></div>
                <div><div className="font-bold text-warning text-sm">{offDuty}</div><div className="text-muted-foreground">Nghỉ / off</div></div>
                <div><div className="font-bold text-warning text-sm">{busyStatus}</div><div className="text-muted-foreground">Đang "Bận"</div></div>
                <div><div className="font-bold text-warning text-sm">{offShift}</div><div className="text-muted-foreground">Ngoài ca</div></div>
                <div><div className="font-bold text-destructive text-sm">{conflictBusy}</div><div className="text-muted-foreground">Trùng lịch</div></div>
              </div>
              <div>
                <div className="text-xs font-medium text-foreground mb-1 flex items-center justify-between">
                  <span>Chuyển sang nhân sự * <span className="text-success font-semibold">({elig.length} NS đủ điều kiện)</span></span>
                </div>
                <select value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="w-full h-9 px-2 rounded border border-input bg-card text-sm" disabled={!elig.length}>
                  {elig.length === 0 && <option value="">Không có NS đủ điều kiện trong khung {row.start}–{row.end}</option>}
                  {elig.map((e) => <option key={e.code} value={e.code}>{e.name} – {e.titleSap} ({e.code}) · ca {e.shift} · {e.current} · tải {e.load}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs font-medium text-foreground mb-1">Lý do chuyển *</div>
                <textarea value={transferReason} onChange={(e) => setTransferReason(e.target.value)} rows={3} placeholder="VD: Có việc đột xuất, đang xử lý sự cố ở dock khác…" className="w-full px-2 py-1.5 rounded border border-input bg-card text-sm" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setTransferOpen(null)} className="h-9 px-3 rounded-md border border-border bg-card text-sm">Huỷ</button>
                <button onClick={submitTransfer} disabled={!elig.length} className="h-9 px-3 rounded-md bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 disabled:opacity-50">Gửi yêu cầu chuyển</button>
              </div>
            </div>
          </div>
        );
      })()}
    </TaskShell>
  );
}

function TaskGeneric({ task }: { task: Task }) {
  return (
    <TaskShell task={task} title={task.type} showOrderSummary>
      <Section title="Thông tin task"><div className="text-sm text-muted-foreground">Chi tiết task {task.type} cho {task.orderId}.</div></Section>
    </TaskShell>
  );
}

/* ─── T-WH: Giám sát lệnh (Thủ kho / Trưởng ca điều phối) ─── */
function TaskOrderMonitor({ task }: { task: Task }) {
  const o = getOrder(task.orderId);
  const sub = useMemo(
    () => tasks.filter((x) => x.orderId === task.orderId && x.code !== "T-WH"),
    [task.orderId],
  );

  const done = sub.filter((x) => x.status === "Hoàn thành").length;
  const doing = sub.filter((x) => x.status === "Đang xử lý").length;
  const overdue = sub.filter((x) => x.status === "Quá hạn" || (x.slaPct >= 100 && x.status !== "Hoàn thành")).length;
  const hasIssue = sub.filter((x) => x.status === "Phát sinh" || x.exception).length;
  const pct = sub.length ? Math.round((done / sub.length) * 100) : 0;

  // Các hệ thống ngoài / chứng từ liên quan
  const docs = [
    { name: "BBBG (Biên bản bàn giao)", status: "Chờ ký VOffice",  tone: "warning"     as const, time: "11:30", actor: "VOffice", url: "#" },
    { name: "Phiếu nhập GR (SAP)",      status: "Đã đồng bộ",      tone: "success"     as const, time: "11:02", actor: "API6",    url: "#" },
    { name: "Kết quả KCS (SAP)",        status: "Chờ SAP trả",     tone: "info"        as const, time: "11:12", actor: "API-KCS", url: "#" },
    { name: "VOffice trình ký",         status: "Đã ký",           tone: "success"     as const, time: "11:35", actor: "GĐ kho",  url: "#" },
    { name: "File bằng chứng",          status: "Đã đồng bộ",      tone: "success"     as const, time: "10:55", actor: "WMS",     url: "#" },
    { name: "API đồng bộ SAP GR",       status: "Lỗi đồng bộ",     tone: "destructive" as const, time: "10:58", actor: "API6",    url: "#" },
  ];

  // Diễn biến gần nhất (timeline)
  const events = [
    { time: "08:01", who: "SAP",                what: "Đồng bộ Order về AIWS",                kind: "API",     tone: "info" },
    { time: "08:42", who: "Trần Văn Kho",       what: "Thủ kho xác nhận lệnh nhập",           kind: "Người",   tone: "success" },
    { time: "09:15", who: "Phạm Thị Hằng",      what: "Bắt đầu dỡ hàng tại Dock DK-03",       kind: "Người",   tone: "info" },
    { time: "10:48", who: "Phạm Thị Hằng",      what: "Hoàn thành dỡ hàng",                   kind: "Người",   tone: "success" },
    { time: "10:55", who: "Nguyễn Hữu An",      what: "Tạo BBBG, ghi nhận thiếu 2 cuộn cáp",  kind: "Phát sinh", tone: "warning" },
    { time: "11:12", who: "API-KCS",            what: "Gửi yêu cầu KCS 6 dòng (chờ SAP trả)", kind: "API",     tone: "info" },
    { time: "10:58", who: "API6",               what: "Gọi GR Posted lỗi 502 (đã retry 2)",   kind: "API lỗi", tone: "destructive" },
    { time: "11:30", who: "Trần Văn Kho",       what: "Ghi nhận phát sinh: VOffice chưa ký",  kind: "Giám sát",tone: "warning" },
  ];

  // Điểm cần chú ý
  const attentions = [
    { level: "Cao",        type: "Task quá hạn",        msg: "Task “Kiểm hàng & ký BBBG” quá hạn 30 phút",      at: "10:25", tone: "destructive" as const, action: "Nhắc việc" },
    { level: "Cao",        type: "Lỗi API",             msg: "API6 GR Posted lỗi 502, đã retry 2 lần",          at: "10:58", tone: "destructive" as const, action: "Retry API" },
    { level: "Trung bình", type: "Chờ hệ thống ngoài",  msg: "SAP chưa trả kết quả KCS sau 12 phút",            at: "11:12", tone: "warning"     as const, action: "Xem chi tiết" },
    { level: "Trung bình", type: "Chứng từ",            msg: "VOffice đang chờ ký BBBG",                        at: "11:30", tone: "warning"     as const, action: "Xem chi tiết" },
    { level: "Trung bình", type: "Phát sinh",           msg: "Số lượng thực nhận thiếu 2 cuộn so chứng từ",     at: "10:55", tone: "warning"     as const, action: "Xem chi tiết" },
  ];

  // Mốc quy trình (stepper) – sinh từ danh sách task con của order (trừ T-WH)
  const taskStateMap = (st: string, slaPct: number, exception?: string) => {
    if (st === "Hoàn thành") return "done";
    if (st === "Phát sinh" || exception) return "issue";
    if (st === "Quá hạn" || slaPct >= 100) return "issue";
    if (st === "Đang xử lý") return "doing";
    if (st === "Chờ hệ thống" || st === "Chờ KCS" || st === "Chờ SAP") return "waiting-ext";
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
    { ok: false, label: "KCS đã có kết quả hợp lệ" },
    { ok: false, label: "Chứng từ bắt buộc đã hoàn tất / ký (BBBG chờ ký)" },
    { ok: false, label: "Đồng bộ SAP/VERP không còn lỗi chặn luồng (API6 lỗi)" },
    { ok: true,  label: "Order đạt điều kiện hoàn tất theo process profile SAP_INBOUND" },
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
    <TaskShell
      task={task}
      title="Giám sát lệnh nhập kho"
      subtitle={`Order ${task.orderId} · Process profile: ${o?.sourceDoc?.startsWith("V") ? "VERP_INBOUND" : "SAP_INBOUND"} · Nguồn: ${o?.sourceDoc?.startsWith("V") ? "VERP" : "SAP"}`}
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
        <li>Màn giám sát lệnh chỉ <b>theo dõi & điều phối</b> – không nhập số lượng thực nhận, kết quả KCS, vị trí putaway hay chứng từ chính thức tại đây.</li>
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
              ["Loại order", "Nhập kho"],
              ["Kho tiếp nhận", o?.warehouse || "HN01"],
              ["Nhà cung cấp / Nguồn", o?.source || "—"],
              ["Ngày kế hoạch nhập", formatDateTime(o?.plannedDate) || "—"],
              ["Tổng số dòng", o?.lines ?? "—"],
              ["Tổng số lượng", o?.qty ?? "—"],
              ["Tổng CBM", "—"],
              ["Hệ thống nguồn", o?.sourceDoc?.startsWith("V") ? "VERP" : "SAP"],
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
                      <td className="px-3 py-2"><Link to={`/inbound/tasks/${t.id}`} className="text-brand font-medium">{t.id}</Link></td>
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
                          <Link to={`/inbound/tasks/${t.id}`}><IButton size="sm" icon={Eye}>Xem</IButton></Link>
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
                  {["Task chậm tiến độ","Lỗi hệ thống tích hợp","Thiếu/sai chứng từ","Phát sinh số lượng","Hàng không đạt KCS","Khác"].map((x) => <option key={x}>{x}</option>)}
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
                  {["AIWS","SAP","VERP","VOffice","KCS","Khác"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Nội dung phát sinh *</div>
              <textarea value={iNote} onChange={(e) => setINote(e.target.value)} rows={3}
                className="w-full p-3 rounded-md border border-input text-sm" placeholder="Mô tả ngắn gọn nội dung phát sinh..." />
            </div>
            <EvidenceField />
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
              Bắt đầu giám sát: <b className="text-foreground">08:00</b>
              <span>·</span>
              Cập nhật cuối: <b className="text-foreground">{events[events.length - 1]?.time}</b>
              <button className="ml-auto text-brand hover:underline">Xuất CSV</button>
            </div>
          </div>
        }
      />
    </TaskShell>
  );
}


/* ─── T-SCR: Giám sát an ninh (Bảo vệ cổng) ─── */
function TaskSecurity({ task }: { task: Task }) {
  const o = getOrder(task.orderId);
  const realTrips = getTripsForInbound(task.orderId);
  const demoTrips = getSecurityDemoTrips("IN");
  const trips = [...realTrips, ...demoTrips];
  return (
    <TaskShell task={task} title="Giám sát an ninh cổng" hideSidebarExtras fullWidth
      completeLabel="Đóng phiên giám sát"
      rules={<RuleNote>
        <li>Bảo vệ chỉ thao tác <b>Vào cổng / Ra cổng / Phát sinh</b> – các mốc Vào dock / Ra dock do Thủ kho phụ trách.</li>
        <li>Bắt buộc có ảnh xe & biển số khi xe vào cổng và khi xe rời kho.</li>
        <li>Phát hiện bất thường → tạo exception và báo Thủ kho ngay.</li>
      </RuleNote>}>
      <Section title="Vận chuyển">
        <VehicleGatePanel
          trips={trips}
          requireGateBefore={o?.hasTransport ? "unload" : undefined}
          warehouseCode={o?.warehouse}
          interactive
        />
      </Section>
    </TaskShell>
  );
}

/* ─── Đưa vào khu chờ nhập (T-MV1) ─── */
function TaskMoveStaging({ task }: { task: Task }) {
  const o = fillOrderItems(getOrder(task.orderId));
  const [confirmDone, setConfirmDone] = useState(false);
  const stagingZone = task.zone || "Khu B01 – Chờ nhập";
  return (
    <TaskShell task={task} title="Đưa vào khu chờ nhập"
      actions={<>
        <IButton icon={ScanLine}>Scan vị trí</IButton>
        <IButton variant="brand" icon={CheckCircle2} onClick={() => setConfirmDone(true)}>Hoàn thành</IButton>
      </>}
      rules={<RuleNote>
        <li>Chuyển hàng <b>đã kiểm đạt</b> từ Dock dỡ hàng sang <b>khu chờ thực nhập</b> trước khi thủ kho ghi nhận GR.</li>
        <li>Bắt buộc <b>scan vị trí đích</b> trên mỗi HU để hệ thống cập nhật tồn động (transient stock).</li>
        <li>Hoàn tất task này sẽ kích hoạt task <b>Thực nhập (T-AGR)</b> cho thủ kho.</li>
      </RuleNote>}>
      <Section title="Thông tin task">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <Field label="Đơn nhập"><input value={o.id} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm font-medium" /></Field>
          <Field label="Nguồn (Dock)"><input value="DK-03 – Cửa Bắc" readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Khu chờ nhập (đích)"><input value={stagingZone} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Phương tiện"><input value="Xe nâng XN-02" readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Số HU"><input value={Math.max(o.items.length, 3)} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Tổng SL kiện"><input value={o.qty} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Trọng lượng (kg)"><input value={(o.qty * 12).toLocaleString()} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Thể tích (m³)"><input value={(o.qty * 0.08).toFixed(2)} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
        </div>
      </Section>
      <Section title="Danh sách HU chuyển sang khu chờ nhập" actions={<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-info/10 text-info">Đã kiểm Đạt</span>}>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">HU</th>
            <th className="px-3 py-2 text-left font-medium">Mã hàng</th>
            <th className="px-3 py-2 text-left font-medium">Tên hàng</th>
            <th className="px-3 py-2 text-left font-medium">ĐVT</th>
            <th className="px-3 py-2 text-right font-medium">SL</th>
            <th className="px-3 py-2 text-left font-medium">Từ</th>
            <th className="px-3 py-2 text-left font-medium">Đến</th>
            <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
          </tr></thead>
          <tbody>{o.items.map((i, idx) => {
            const hu = `HU-${String(idx + 1).padStart(3, "0")}`;
            const dest = `B01-T${String(idx + 1).padStart(2, "0")}`;
            const moved = idx < Math.ceil(o.items.length / 2);
            return (
              <tr key={hu} className="border-b border-border/60">
                <td className="px-3 py-2 font-medium text-navy">{hu}</td>
                <td className="px-3 py-2">{i.sku}</td>
                <td className="px-3 py-2">{i.name}</td>
                <td className="px-3 py-2">{i.uom}</td>
                <td className="px-3 py-2 text-right">{i.docQty}</td>
                <td className="px-3 py-2 text-muted-foreground">DK-03</td>
                <td className="px-3 py-2 text-muted-foreground">{dest}</td>
                <td className="px-3 py-2"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${moved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{moved ? "Đã chuyển" : "Chờ chuyển"}</span></td>
              </tr>
            );
          })}</tbody>
        </table>
      </Section>
      <Section title="Tiến độ thực hiện">
        <ul className="text-xs space-y-2">
          {[
            { t: task.startAt || "10:05", title: "Bắt đầu nhận bàn giao tại DK-03", ok: true },
            { t: "10:12", title: `Scan vị trí đích ${stagingZone}`, ok: true },
            { t: "10:22", title: `Đã chuyển ${Math.ceil(o.items.length / 2)}/${o.items.length} HU`, ok: true },
            { t: "—", title: "Hoàn tất chuyển toàn bộ HU & ký bàn giao", ok: false },
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`mt-1 w-2 h-2 rounded-full ${s.ok ? "bg-success" : "bg-muted-foreground/40"}`} />
              <span className="text-muted-foreground w-16">{s.t}</span>
              <span className={s.ok ? "text-navy" : "text-muted-foreground"}>{s.title}</span>
            </li>
          ))}
        </ul>
      </Section>
      <ConfirmModal open={confirmDone} onClose={() => setConfirmDone(false)} title="Hoàn thành đưa vào khu chờ nhập"
        message={`Xác nhận đã chuyển ${o.items.length} HU của đơn ${task.orderId} sang ${stagingZone}. Hệ thống sẽ kích hoạt task Thực nhập (T-AGR).`}
        confirmLabel="Hoàn thành" onConfirm={() => toast.success(`Đã đưa ${task.orderId} vào ${stagingZone}`)} />
    </TaskShell>
  );
}

/* ─── Đưa sang khu đóng gói (T-MV2) ─── */
function TaskMovePacking({ task }: { task: Task }) {
  const o = fillOrderItems(getOrder(task.orderId));
  const [confirmDone, setConfirmDone] = useState(false);
  const packZone = task.zone || "Khu C01 – Đóng gói";
  return (
    <TaskShell task={task} title="Đưa sang khu đóng gói"
      actions={<>
        <IButton icon={ScanLine}>Scan vị trí</IButton>
        <IButton variant="brand" icon={CheckCircle2} onClick={() => setConfirmDone(true)}>Hoàn thành</IButton>
      </>}
      rules={<RuleNote>
        <li>Chuyển hàng <b>đã ký BBBG</b> sang khu đóng gói để gắn tem RFID/barcode và tạo HU.</li>
        <li>Bắt buộc scan vị trí đích trước khi đặt hàng.</li>
      </RuleNote>}>
      <Section title="Thông tin task">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <Field label="Đơn nhập"><input value={o.id} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm font-medium" /></Field>
          <Field label="Nguồn"><input value="Khu chờ nhập B01" readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Khu đóng gói (đích)"><input value={packZone} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Phương tiện"><input value="Xe nâng XN-04" readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Số HU"><input value={o.items.length} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
          <Field label="Tổng SL kiện"><input value={o.qty} readOnly className="h-9 w-full px-3 rounded border border-input bg-muted text-sm" /></Field>
        </div>
      </Section>
      <Section title="Danh sách HU chuyển sang khu đóng gói">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">HU</th>
            <th className="px-3 py-2 text-left font-medium">Mã hàng</th>
            <th className="px-3 py-2 text-left font-medium">Tên hàng</th>
            <th className="px-3 py-2 text-right font-medium">SL</th>
            <th className="px-3 py-2 text-left font-medium">Đến</th>
          </tr></thead>
          <tbody>{o.items.map((i, idx) => (
            <tr key={idx} className="border-b border-border/60">
              <td className="px-3 py-2 font-medium text-navy">{`HU-${String(idx + 1).padStart(3, "0")}`}</td>
              <td className="px-3 py-2">{i.sku}</td>
              <td className="px-3 py-2">{i.name}</td>
              <td className="px-3 py-2 text-right">{i.docQty}</td>
              <td className="px-3 py-2 text-muted-foreground">{`C01-T${String(idx + 1).padStart(2, "0")}`}</td>
            </tr>
          ))}</tbody>
        </table>
      </Section>
      <ConfirmModal open={confirmDone} onClose={() => setConfirmDone(false)} title="Hoàn thành chuyển sang đóng gói"
        message={`Xác nhận đã chuyển ${o.items.length} HU sang ${packZone}.`}
        confirmLabel="Hoàn thành" onConfirm={() => toast.success(`Đã chuyển ${task.orderId} sang ${packZone}`)} />
    </TaskShell>
  );
}

/* Sinh danh sách hàng hóa giả lập khi order chưa có items để vẫn hiển thị bảng "Hàng hóa" */
function fillOrderItems(o: Order) {
  if (o.items && o.items.length > 0) return o;
  const lines = Math.max(1, Math.min(o.lines || 3, 8));
  const baseQty = Math.max(1, Math.floor((o.qty || lines * 10) / lines));
  const remainder = (o.qty || lines * baseQty) - baseQty * lines;
  const SAMPLE = [
    { sku: "ANT-5G-32T", name: "Anten 5G Massive MIMO 32T32R", uom: "Bộ" },
    { sku: "BBU-6648", name: "Baseband Unit BBU 6648", uom: "Bộ" },
    { sku: "CAB-FO-LC", name: "Cáp quang LC-LC 10m", uom: "Cuộn" },
    { sku: "PWR-48V-30A", name: "Nguồn DC 48V 30A", uom: "Cái" },
    { sku: "RRU-4408", name: "Remote Radio Unit 4408", uom: "Bộ" },
    { sku: "SWT-24P-POE", name: "Switch 24 port PoE+", uom: "Cái" },
    { sku: "MOD-SFP-10G", name: "Module SFP+ 10G LR", uom: "Cái" },
    { sku: "RCK-42U-800", name: "Tủ rack 42U sâu 800", uom: "Tủ" },
  ];
  const items = Array.from({ length: lines }).map((_, i) => {
    const s = SAMPLE[i % SAMPLE.length];
    const docQty = baseQty + (i === 0 ? remainder : 0);
    return { sku: s.sku, name: s.name, uom: s.uom, docQty, recvQty: docQty, diff: 0 } as any;
  });
  return { ...o, items };
}

/* ─── Xác nhận lệnh nhập (kiểm thông tin order trước khi tiếp nhận) ─── */
function TaskConfirmOrder({ task }: { task: Task }) {
  const [sp] = useSearchParams();
  const bulkParam = sp.get("orders");
  const orderIds = useMemo(() => {
    const ids = bulkParam ? bulkParam.split(",").map((s) => s.trim()).filter(Boolean) : [];
    if (!ids.includes(task.orderId)) ids.unshift(task.orderId);
    return Array.from(new Set(ids));
  }, [bulkParam, task.orderId]);
  const isBulk = orderIds.length > 1;
  const [activeOrderId, setActiveOrderId] = useState(orderIds[0]);
  const o = getOrder(activeOrderId);
  const [mode, setMode] = useState<"accept" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const plannedParts = (o?.plannedDate || "").split(" ");
  const [etaDate, setEtaDate] = useState(plannedParts[0] || "2026-05-18");
  const [etaTime, setEtaTime] = useState(plannedParts[1] || "09:00");
  const decided =
    (mode === "accept" && !!etaDate && !!etaTime) ||
    (mode === "reject" && reason.trim().length > 0);

  const subtitle = isBulk
    ? `Xác nhận ${orderIds.length} order cùng lúc · ${orderIds.join(", ")}`
    : `Order ${task.orderId} · ${o?.sourceDoc || ""}`;

  return (
    <TaskShell task={task} title="Xác nhận lệnh nhập" subtitle={subtitle}
      completeDisabled={!decided}
      rules={<RuleNote>
        <li>Thủ kho kiểm tra thông tin Order (nguồn hàng, dòng, số lượng, chứng từ) trước khi tiếp nhận.</li>
        <li>Đồng ý → nhập ngày & giờ dự kiến nhận hàng. Hệ thống sinh task theo template INB-* và đề xuất nhân sự.</li>
        <li>Từ chối → bắt buộc nhập lý do, gọi API-REJECT đồng bộ lại SAP/VERP.</li>
        <li><b>Xác nhận nhiều order:</b> Quyết định (đồng ý/từ chối, ETA, lý do) sẽ áp dụng cho toàn bộ <b>{orderIds.length}</b> order đã chọn.</li>
        <li><b>Hết ngày làm việc</b> mà hàng <b>chưa giao tới</b> → hệ thống tự động chuyển Order về trạng thái <b>Chờ xác nhận</b>.</li>
        <li>Nút "Hoàn thành" chỉ kích hoạt sau khi đã chọn quyết định và nhập đầy đủ thông tin.</li>
      </RuleNote>}>
      <Section title="Quyết định xử lý">
        {isBulk && (
          <div className="mb-3 px-3 py-2 rounded-md bg-info/5 border border-info/20 text-xs text-info-foreground">
            Quyết định bên dưới sẽ áp dụng cho toàn bộ <b>{orderIds.length}</b> order: {orderIds.join(", ")}
          </div>
        )}
        <div className="text-xs text-muted-foreground mb-2">Quyết định *</div>
        <div className="flex gap-2">
          <button onClick={() => setMode("accept")} className={`flex-1 p-4 rounded-lg border text-left transition-colors ${mode === "accept" ? "border-success bg-success/5" : "border-border hover:bg-muted/40"}`}>
            <CheckCircle2 className="w-5 h-5 text-success mb-2" />
            <div className="font-semibold text-navy">Đồng ý lệnh{isBulk ? ` (${orderIds.length} order)` : ""}</div>
            <div className="text-xs text-muted-foreground mt-1">Tiếp nhận lệnh và xác nhận thời gian dự kiến nhận hàng.</div>
          </button>
          <button onClick={() => setMode("reject")} className={`flex-1 p-4 rounded-lg border text-left transition-colors ${mode === "reject" ? "border-destructive bg-destructive/5" : "border-border hover:bg-muted/40"}`}>
            <XCircle className="w-5 h-5 text-destructive mb-2" />
            <div className="font-semibold text-navy">Từ chối lệnh{isBulk ? ` (${orderIds.length} order)` : ""}</div>
            <div className="text-xs text-muted-foreground mt-1">Bắt buộc nhập lý do. Hệ thống gọi API-REJECT đồng bộ SAP/VERP.</div>
          </button>
        </div>

        {mode === "accept" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Ngày dự kiến nhận hàng *</div>
              <input type="date" value={etaDate} onChange={(e) => setEtaDate(e.target.value)}
                className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Giờ dự kiến nhận hàng *</div>
              <input type="time" value={etaTime} onChange={(e) => setEtaTime(e.target.value)}
                className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" />
            </div>
          </div>
        )}

        {mode === "reject" && (
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-1">Lý do từ chối *</div>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full p-3 rounded-md border border-input text-sm" placeholder="Ví dụ: sai NCC, sai chứng từ, trùng lệnh..." />
            <div className="text-[11px] text-muted-foreground mt-1">Thông tin từ chối sẽ được đồng bộ ngược về SAP/VERP qua API-REJECT.</div>
          </div>
        )}
      </Section>

      {o && (() => {
        const idx = orderIds.indexOf(activeOrderId);
        const goPrev = () => setActiveOrderId(orderIds[(idx - 1 + orderIds.length) % orderIds.length]);
        const goNext = () => setActiveOrderId(orderIds[(idx + 1) % orderIds.length]);
        return (
          <Section
            title={isBulk ? `Chi tiết lệnh · ${activeOrderId} (${idx + 1}/${orderIds.length})` : "Chi tiết lệnh"}
            actions={isBulk ? (
              <div className="flex items-center gap-2">
                <IButton size="sm" variant="outline" icon={ChevronLeft} onClick={goPrev}>Order trước</IButton>
                <IButton size="sm" variant="outline" onClick={goNext}>Order sau<ChevronRight className="w-4 h-4 ml-1" /></IButton>
              </div>
            ) : undefined}
          >
            <OrderSummaryCard order={fillOrderItems(o)} type="inbound" />
          </Section>
        );
      })()}
    </TaskShell>
  );
}

/* ─────────────────────────────────── 16. API MONITOR ─────────────────────────────────── */
export function InboundApiMonitor() {
  const [tab, setTab] = useState("all");
  const filtered = apiLogs.filter((l) => tab === "all" || (tab === "error" && !["200","201"].includes(l.status)));
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "API Monitor" }]}>
      <PageHeader title="API Monitor" subtitle="Theo dõi đồng bộ SAP/VERP, KCS, VOffice realtime"
        actions={<IButton variant="brand" icon={RefreshCw}>Retry tất cả lỗi</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
        {["T-API1","API-ACCEPT","API-KCS-REQ","API-KCS-RES","API6","API-VOFFICE","API-REJECT"].map((c) => {
          const rows = apiLogs.filter((l) => l.code === c);
          const err = rows.filter((l) => !["200","201"].includes(l.status)).length;
          return <KCard key={c} label={c} value={rows.length} hint={err > 0 ? `${err} lỗi` : "OK"} tone={err > 0 ? "destructive" : "success"} />;
        })}
      </div>

      <Section title="">
        <div className="flex gap-1 border-b border-border -mt-3 -mx-5 px-5 mb-3">
          {[["all","Tất cả",apiLogs.length],["error","Lỗi",apiLogs.filter(l=>!["200","201"].includes(l.status)).length]].map(([id,l,n]) => (
            <button key={id as string} onClick={() => setTab(id as string)} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab===id?"border-brand text-brand":"border-transparent text-muted-foreground"}`}>{l as string} ({n as number})</button>
          ))}
        </div>
        <ApiTable rows={filtered} />
        <RuleNote>
          <li>Retry phải ghi log – không retry nếu input chưa được sửa.</li>
          <li>API lỗi hiển thị rõ ảnh hưởng order/task để team xử lý.</li>
        </RuleNote>
      </Section>
    </AppShell>
  );
}

/* ─────────────────────────────────── 17. EXCEPTION MANAGEMENT ─────────────────────────────────── */
export function InboundExceptions() {
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Xử lý phát sinh" }]}>
      <PageHeader title="Quản lý phát sinh" subtitle="Theo dõi và xử lý mọi exception phát sinh trong luồng nhập kho"
        actions={<IButton variant="brand" icon={Download}>Export</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-5">
        <KCard label="Tổng phát sinh" value={exceptions.length} tone="brand" />
        <KCard label="Cao" value={exceptions.filter((e) => e.severity === "high").length} tone="destructive" />
        <KCard label="Trung bình" value={exceptions.filter((e) => e.severity === "med").length} tone="warning" />
        <KCard label="Thấp" value={exceptions.filter((e) => e.severity === "low").length} />
        <KCard label="Đang xử lý" value={exceptions.filter((e) => e.status === "Đang xử lý").length} tone="info" />
        <KCard label="Đã xử lý" value={exceptions.filter((e) => e.status === "Đã xử lý").length} tone="success" />
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
          <tbody>{exceptions.map((e) => (
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

/* ─────────────────────────────────── 18. CONFIGURATION ─────────────────────────────────── */
export function InboundConfig() {
  const [mod, setMod] = useState<"in" | "out">("in");
  const flows = mod === "in" ? [
    { code: "INB-NCC", name: "Nhập kho từ Nhà cung cấp", steps: ["Vận chuyển","KCS","Đóng gói","VOffice","AI Storage"], on: [true,true,true,true,true] },
    { code: "INB-TRF", name: "Nhập kho từ phiếu xuất chuyển kho", steps: ["Vận chuyển","KCS","Đóng gói","VOffice","AI Storage"], on: [true,false,false,false,true] },
    { code: "INB-OTH", name: "Nhập kho khác (thu hồi/vay mượn/tài sản)", steps: ["Vận chuyển","KCS","Đóng gói","VOffice","AI Storage"], on: [false,true,false,true,true] },
  ] : [
    { code: "OUT-VC", name: "Xuất kho có vận chuyển", steps: ["Lên lịch xe","Đóng gói","Kiểm hàng / Ký BBBG","VOffice","Tải xe / Bàn giao"], on: [true,true,true,true,true] },
    { code: "OUT-OTH", name: "Xuất kho khác (nội bộ / cấp phát / điều chuyển)", steps: ["Lên lịch xe","Đóng gói","Kiểm hàng / Ký BBBG","VOffice","Tải xe / Bàn giao"], on: [false,true,true,true,false] },
  ];

  return (
    <AppShell breadcrumb={[{ label: "Cấu hình module Nhập / Xuất kho" }]}>
      <PageHeader title="Cấu hình module Nhập kho & Xuất kho" subtitle="Cấu hình luồng, KPI, task template, phân quyền, API mapping cho cả hai module" />

      <div className="flex gap-1 border-b border-border mb-4">
        {[{ k: "in", l: "Nhập kho" }, { k: "out", l: "Xuất kho" }].map((t) => (
          <button key={t.k} onClick={() => setMod(t.k as any)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${mod === t.k ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t.l}</button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Section title={`Luồng ${mod === "in" ? "nhập" : "xuất"} đang dùng`} className="col-span-12">
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
      </div>
    </AppShell>
  );
}
