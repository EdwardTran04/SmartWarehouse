import { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, AlertCircle, X, ListChecks, MapPin, User, FileText, Hash, Package, Building2, Calendar, UserPlus, Search, CheckCircle2, Clock, Users, Award } from "lucide-react";
import { toast } from "sonner";
import { employees, tasks, getTask } from "@/data/inbound";

// ====== Inbound shared UI bits, brand Viettel ======

const statusMap: Record<string, string> = {
  // Order statuses
  "New": "bg-muted text-muted-foreground border-border",
  "API Error": "bg-destructive/10 text-destructive border-destructive/20",
  "Waiting Confirm": "bg-warning/10 text-warning border-warning/20",
  "Rejected": "bg-destructive/10 text-destructive border-destructive/20",
  "Waiting Assign": "bg-warning/10 text-warning border-warning/20",
  "AI Planning": "bg-info/10 text-info border-info/20",
  "Waiting Approval": "bg-warning/10 text-warning border-warning/20",
  "Assigned": "bg-info/10 text-info border-info/20",
  "In Progress": "bg-info/10 text-info border-info/20",
  "Pending": "bg-warning/10 text-warning border-warning/20",
  "Exception": "bg-destructive/10 text-destructive border-destructive/20",
  "Waiting KCS": "bg-warning/10 text-warning border-warning/20",
  "KCS Failed": "bg-destructive/10 text-destructive border-destructive/20",
  "Ready for GR": "bg-info/10 text-info border-info/20",
  "GR Posted": "bg-success/10 text-success border-success/20",
  "Waiting VOffice": "bg-warning/10 text-warning border-warning/20",
  "Signed": "bg-success/10 text-success border-success/20",
  "Packing": "bg-info/10 text-info border-info/20",
  "Putaway": "bg-info/10 text-info border-info/20",
  "Completed": "bg-success/10 text-success border-success/20",
  "Cancelled": "bg-muted text-muted-foreground border-border",
  // Task statuses
  "Chưa bắt đầu": "bg-muted text-muted-foreground border-border",
  "Đang xử lý": "bg-info/10 text-info border-info/20",
  "Quá hạn": "bg-destructive/10 text-destructive border-destructive/20",
  "Hoàn thành": "bg-success/10 text-success border-success/20",
  "Phát sinh": "bg-destructive/10 text-destructive border-destructive/20",
  // Vehicle
  "Chưa đến": "bg-muted text-muted-foreground border-border",
  "Đã đến": "bg-success/10 text-success border-success/20",
  "Quá ETA": "bg-destructive/10 text-destructive border-destructive/20",
  "Reschedule": "bg-warning/10 text-warning border-warning/20",
  "Đã rời cổng": "bg-info/10 text-info border-info/20",
  // Order type
  "INB-NCC": "bg-brand/10 text-brand border-brand/20",
  "INB-TRF": "bg-info/10 text-info border-info/20",
  "INB-OTH": "bg-warning/10 text-warning border-warning/20",
  // API
  "OK": "bg-success/10 text-success border-success/20",
  "Error": "bg-destructive/10 text-destructive border-destructive/20",
  // Outbound statuses
  "Validated": "bg-info/10 text-info border-info/20",
  "Accepted": "bg-info/10 text-info border-info/20",
  "Task Planning": "bg-info/10 text-info border-info/20",
  "Waiting Assignment Approval": "bg-warning/10 text-warning border-warning/20",
  "Task Assigned": "bg-info/10 text-info border-info/20",
  "Transport Required": "bg-warning/10 text-warning border-warning/20",
  "Transport Planning": "bg-info/10 text-info border-info/20",
  "Transport Approved": "bg-success/10 text-success border-success/20",
  "Vehicle Confirmed": "bg-info/10 text-info border-info/20",
  "Vehicle Arrived": "bg-success/10 text-success border-success/20",
  "Picking Assigned": "bg-info/10 text-info border-info/20",
  "Picking In Progress": "bg-info/10 text-info border-info/20",
  "Picked": "bg-success/10 text-success border-success/20",
  "Packing Required": "bg-warning/10 text-warning border-warning/20",
  "Packing In Progress": "bg-info/10 text-info border-info/20",
  "Packed": "bg-success/10 text-success border-success/20",
  "Checking": "bg-info/10 text-info border-info/20",
  "Checked": "bg-success/10 text-success border-success/20",
  "Handover Signed": "bg-success/10 text-success border-success/20",
  "Ready for GI": "bg-info/10 text-info border-info/20",
  "GI Posting": "bg-info/10 text-info border-info/20",
  "GI Posted": "bg-success/10 text-success border-success/20",
  "GI API Error": "bg-destructive/10 text-destructive border-destructive/20",
  "Sign Rejected": "bg-destructive/10 text-destructive border-destructive/20",
  "Loading": "bg-info/10 text-info border-info/20",
  "Loaded": "bg-success/10 text-success border-success/20",
  "Handed Over": "bg-success/10 text-success border-success/20",
  "Restorage Required": "bg-warning/10 text-warning border-warning/20",
  "Closed With Exception": "bg-destructive/10 text-destructive border-destructive/20",
  "Chờ phân công": "bg-warning/10 text-warning border-warning/20",
  // Out types
  "OUT-VC": "bg-brand/10 text-brand border-brand/20",
  "OUT-OTH": "bg-warning/10 text-warning border-warning/20",
};

export function IBadge({ s, children }: { s?: string; children?: ReactNode }) {
  const v = (children as string) || s || "";
  const cls = statusMap[v] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium whitespace-nowrap ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {v}
    </span>
  );
}

export function KCard({ label, value, tone = "default", hint, icon: Icon }: { label: string; value: ReactNode; tone?: "default" | "brand" | "success" | "warning" | "destructive" | "info"; hint?: string; icon?: any }) {
  const tones: Record<string, string> = {
    default: "bg-card border-border",
    brand: "bg-brand/5 border-brand/20",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20",
    destructive: "bg-destructive/5 border-destructive/20",
    info: "bg-info/5 border-info/20",
  };
  const itone: Record<string, string> = {
    default: "text-muted-foreground",
    brand: "text-brand",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    info: "text-info",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
        {Icon && <Icon className={`w-4 h-4 ${itone[tone]}`} />}
      </div>
      <div className={`text-2xl font-bold ${itone[tone] !== "text-muted-foreground" ? itone[tone] : "text-navy"}`}>{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

export function SLAPill({ pct, label, status }: { pct: number; label: string; status?: string }) {
  // Hoàn thành → luôn xanh
  if (status === "Hoàn thành" || label === "Hoàn thành") {
    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium bg-success/10 text-success border-success/30"><span className="w-1.5 h-1.5 rounded-full bg-success" /><span>Hoàn thành</span></span>;
  }

  const category = pct >= 100 ? "Quá hạn" : pct >= 80 ? "Sắp quá hạn" : "Trong hạn";
  const tone =
    pct >= 100 ? "bg-destructive/10 text-destructive border-destructive/30"
    : pct >= 80 ? "bg-warning/10 text-warning border-warning/30"
    : "bg-success/10 text-success border-success/30";
  const dot =
    pct >= 100 ? "bg-destructive"
    : pct >= 80 ? "bg-warning"
    : "bg-success";

  // Chuẩn hóa label: bỏ prefix "Quá hạn " nếu có; nếu label rỗng / là placeholder trạng thái → "—"
  const stripped = (label || "").replace(/^Quá hạn\s+/i, "").trim();
  const isPlaceholder = !stripped || stripped === "—" || stripped === "Chưa bắt đầu" || stripped === "Chờ phân công" || stripped === "Liên tục";
  const timeText = isPlaceholder ? "—" : stripped;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium ${tone}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{category}</span>
      <span className="text-muted-foreground font-normal">· {timeText}</span>
    </span>
  );
}

export function Section({ title, actions, children, className = "" }: { title: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`bg-card border border-border rounded-xl ${className}`}>
      <header className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h3 className="font-semibold text-navy text-sm">{title}</h3>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function IButton({ children, variant = "default", size = "md", onClick, className = "", icon: Icon, type, disabled }: any) {
  const v: Record<string, string> = {
    default: "border border-border bg-card hover:bg-muted text-foreground",
    brand: "bg-brand text-brand-foreground hover:bg-brand-dark shadow-sm",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-muted text-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    success: "bg-success text-success-foreground hover:bg-success/90",
    outline: "border border-brand text-brand hover:bg-brand/5",
  };
  const s: Record<string, string> = { sm: "h-7 px-2.5 text-xs", md: "h-8 px-3 text-sm", lg: "h-10 px-5 text-sm" };
  // Fallback: nếu chưa wire handler, vẫn cho user feedback bằng toast thay vì im lặng.
  const handleClick = (e: any) => {
    if (onClick) return onClick(e);
    if (type === "submit") return;
    const label = typeof children === "string" ? children : (Array.isArray(children) ? children.find((c) => typeof c === "string") : "") || "";
    toast.success(label ? `Đã ghi nhận: ${label}` : "Đã ghi nhận thao tác");
  };
  return (
    <button type={type} disabled={disabled} onClick={handleClick} className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${v[variant]} ${s[size]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}

export function IBreadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <div className="flex items-center gap-1.5 text-sm mb-1">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
          {it.to && i < items.length - 1
            ? <Link to={it.to} className="text-muted-foreground hover:text-brand">{it.label}</Link>
            : <span className={i === items.length - 1 ? "font-medium text-navy" : "text-muted-foreground"}>{it.label}</span>}
        </span>
      ))}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: { title: string; subtitle?: string; actions?: ReactNode; breadcrumb?: { label: string; to?: string }[] }) {
  return (
    <div className="mb-6">
      {breadcrumb && <IBreadcrumb items={breadcrumb} />}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, danger, confirmLabel = "Xác nhận" }: { open: boolean; onClose: () => void; onConfirm?: () => void; title: string; message: ReactNode; danger?: boolean; confirmLabel?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 p-5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${danger ? "bg-destructive/10 text-destructive" : "bg-brand/10 text-brand"}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-navy mb-1">{title}</h3>
            <div className="text-sm text-muted-foreground">{message}</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-3 bg-muted/30 rounded-b-xl flex justify-end gap-2">
          <IButton onClick={onClose}>Hủy</IButton>
          <IButton variant={danger ? "danger" : "brand"} onClick={() => { onConfirm?.(); onClose(); }}>{confirmLabel}</IButton>
        </div>
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children, width = "max-w-2xl" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40" onClick={onClose}>
      <div className={`bg-card h-full w-full ${width} shadow-2xl flex flex-col border-l border-border`} onClick={(e) => e.stopPropagation()}>
        <div className="h-14 px-5 flex items-center justify-between border-b border-border">
          <h3 className="font-semibold text-navy">{title}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function RuleNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg bg-warning/5 border border-warning/30 p-3 text-xs text-warning-foreground">
      <div className="flex items-center gap-1.5 font-semibold text-warning mb-1.5"><AlertCircle className="w-3.5 h-3.5" /> Rule nghiệp vụ</div>
      <ul className="space-y-1 text-foreground/80 list-disc pl-5">{children}</ul>
    </div>
  );
}

/* ────────── Task Info Header (đồng nhất Inbound / Outbound) ────────── */
function initialsOf(name?: string) {
  if (!name || name === "—") return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}

export function TaskInfoHeader({
  status, slaPct, slaLabel, orderId, orderHref, orderSub, type, zone, position, owner, unassigned,
}: {
  status: string; slaPct: number; slaLabel: string;
  orderId: string; orderHref: string; orderSub?: string;
  type: string; zone: string; position?: string;
  owner?: string; unassigned?: boolean;
}) {
  const slaTone =
    slaPct >= 100 ? "bg-destructive" : slaPct >= 80 ? "bg-warning" : "bg-success";
  const cells: { label: string; icon: any; node: ReactNode }[] = [
    { label: "Trạng thái", icon: AlertCircle, node: <IBadge>{status}</IBadge> },
    { label: "SLA / KPI", icon: Calendar, node: (
        <div>
          <SLAPill pct={slaPct} label={slaLabel} />
          <div className="mt-1.5 h-1 rounded bg-muted overflow-hidden">
            <div className={`h-full ${slaTone}`} style={{ width: `${Math.min(slaPct, 100)}%` }} />
          </div>
        </div>
      ) },
    { label: "Order", icon: FileText, node: (
        <div>
          <Link to={orderHref} className="text-sm font-semibold text-brand hover:underline">{orderId}</Link>
          {orderSub && <div className="text-[11px] text-muted-foreground truncate">{orderSub}</div>}
        </div>
      ) },
    { label: "Loại task", icon: ListChecks, node: <div className="text-sm font-medium text-navy">{type}</div> },
    { label: "Khu vực", icon: MapPin, node: (
        <div>
          <div className="text-sm font-medium text-navy">{zone}</div>
          {position && <div className="text-[11px] text-muted-foreground truncate">{position}</div>}
        </div>
      ) },
    { label: "Phụ trách", icon: User, node: unassigned || !owner || owner === "—" ? (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-warning/15 text-warning flex items-center justify-center"><UserPlus className="w-3.5 h-3.5" /></div>
          <span className="text-sm font-medium text-warning">Chưa phân công</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-brand/10 text-brand text-[11px] font-bold flex items-center justify-center shrink-0">{initialsOf(owner)}</div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-navy truncate">{owner}</div>
            {position && <div className="text-[11px] text-muted-foreground truncate">{position}</div>}
          </div>
        </div>
      ) },
  ];
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-border">
        {cells.map((c) => (
          <div key={c.label} className="p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              <c.icon className="w-3 h-3" />{c.label}
            </div>
            {c.node}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderSummaryCard({ order, type, hideItems }: { order: any; type: "inbound" | "outbound"; hideItems?: boolean }) {
  const isOut = type === "outbound";
  const items: { label: string; value: ReactNode; icon?: any }[] = [
    { label: "Mã Order", value: <span className="font-semibold text-navy">{order.id}</span>, icon: Hash },
    { label: "Loại", value: <IBadge>{order.type}</IBadge> },
    { label: "Chứng từ gốc", value: order.sourceDoc || "—", icon: FileText },
    { label: isOut ? "Đơn vị nhận" : "Nguồn hàng", value: isOut ? order.receiver : order.source, icon: Building2 },
    { label: "Kho", value: order.warehouse, icon: Building2 },
    { label: "Ngày kế hoạch", value: order.plannedDate, icon: Calendar },
    { label: "Số dòng", value: order.lines, icon: ListChecks },
    { label: "Tổng SL", value: <span className="font-semibold text-navy">{order.qty}</span>, icon: Package },
  ];
  return (
    <Section title="Chi tiết Order" actions={<Link to={`/${type}/orders/${order.id}`} className="text-xs text-brand hover:underline">Mở chi tiết Order →</Link>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 text-sm">
        {items.map((it) => (
          <div key={it.label}>
            <div className="text-[11px] text-muted-foreground mb-0.5">{it.label}</div>
            <div className="text-sm">{it.value}</div>
          </div>
        ))}
      </div>
      {!hideItems && order.items && order.items.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] text-muted-foreground font-semibold mb-1.5 uppercase tracking-wider">Hàng hóa ({order.items.length})</div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted/40 text-muted-foreground">
                <th className="px-3 py-2 text-left font-medium">Mã hàng</th>
                <th className="px-3 py-2 text-left font-medium">Tên hàng</th>
                <th className="px-3 py-2 text-left font-medium">ĐVT</th>
                <th className="px-3 py-2 text-right font-medium">SL chứng từ</th>
              </tr></thead>
              <tbody>
                {order.items.slice(0, 6).map((i: any) => (
                  <tr key={i.sku} className="border-t border-border/60">
                    <td className="px-3 py-2 font-medium text-navy">{i.sku}</td>
                    <td className="px-3 py-2">{i.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{i.uom}</td>
                    <td className="px-3 py-2 text-right">{i.docQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Section>
  );
}

export function AssignTaskModal({ open, onClose, taskId }: { open: boolean; onClose: () => void; taskId?: string }) {
  const task = taskId ? tasks.find((t) => t.id === taskId) : undefined;
  const [q, setQ] = useState("");
  const [shift, setShift] = useState("");
  const [onlyFree, setOnlyFree] = useState(true);
  const [picked, setPicked] = useState<string | undefined>();

  const requiredSkill = useMemo(() => {
    const t = task?.type || "";
    if (t.includes("Kiểm")) return "Kiểm hàng";
    if (t.includes("Dỡ") || t.includes("Putaway")) return "Xe nâng";
    if (t.includes("KCS")) return "KCS";
    if (t.includes("Đóng gói")) return "Đóng gói";
    if (t.includes("VOffice") || t.includes("NCC") || t.includes("chứng từ")) return "Chứng từ";
    return "";
  }, [task]);

  const candidates = useMemo(() => {
    return employees
      .filter((e) => e.active)
      .filter((e) => onlyFree ? e.current !== "Nghỉ" : true)
      .filter((e) => !shift || e.shift === shift)
      .filter((e) => !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.code.toLowerCase().includes(q.toLowerCase()) || e.titleSap.toLowerCase().includes(q.toLowerCase()))
      .map((e) => {
        const skillMatch = requiredSkill ? e.certs.some((c) => c.toLowerCase().includes(requiredSkill.toLowerCase())) : false;
        const score = (skillMatch ? 60 : 20) + (e.current === "Rảnh" ? 30 : e.current === "Bận" ? 10 : 0) - e.load * 4;
        return { ...e, skillMatch, score: Math.max(20, Math.min(99, score)) };
      })
      .sort((a, b) => b.score - a.score);
  }, [q, shift, onlyFree, requiredSkill]);

  if (!open) return null;
  const sel = candidates.find((c) => c.code === picked);

  const confirm = () => {
    if (!sel) return;
    toast.success(`Đã phân công ${sel.name} (${sel.code}) cho task ${taskId}`);
    onClose();
    setPicked(undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-4xl border border-border max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
            <div>
              <h3 className="font-semibold text-navy">Phân công thủ công {taskId ? `– ${taskId}` : ""}</h3>
              <p className="text-xs text-muted-foreground">Chọn nhân sự phù hợp dựa trên vị trí · vai trò · kỹ năng · ca làm việc</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Task summary */}
          {task && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 grid grid-cols-4 gap-3 text-xs">
              <div><div className="text-muted-foreground mb-0.5">Task</div><div className="font-semibold text-navy">{task.id}</div></div>
              <div><div className="text-muted-foreground mb-0.5">Order</div><div className="font-semibold text-navy">{task.orderId}</div></div>
              <div><div className="text-muted-foreground mb-0.5">Loại bước</div><div className="font-semibold text-navy truncate" title={task.type}>{task.type}</div></div>
              <div><div className="text-muted-foreground mb-0.5">Khu/Vị trí</div><div className="font-semibold text-navy">{task.zone}</div></div>
              {requiredSkill && <div className="col-span-4"><div className="text-muted-foreground mb-0.5">Kỹ năng yêu cầu</div><span className="inline-flex px-2 py-0.5 rounded bg-brand/10 text-brand text-[11px] font-medium">{requiredSkill}</span></div>}
            </div>
          )}

          {/* Data sources */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-border p-2.5">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5"><Users className="w-3.5 h-3.5" />Nhân sự khả dụng</div>
              <div className="font-semibold text-navy">{candidates.length} / {employees.length}</div>
            </div>
            <div className="rounded-lg border border-border p-2.5">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5"><Clock className="w-3.5 h-3.5" />Lịch ca làm việc</div>
              <div className="font-semibold text-navy">S1 · S2 · S3</div>
            </div>
            <div className="rounded-lg border border-border p-2.5">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5"><Award className="w-3.5 h-3.5" />Lệnh đã duyệt</div>
              <div className="font-semibold text-navy">→ task chi tiết theo template</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên / mã NV / chức danh..." className="h-9 w-full pl-9 pr-3 rounded-md border border-input bg-card text-sm" />
            </div>
            <select value={shift} onChange={(e) => setShift(e.target.value)} className="h-9 px-3 rounded-md border border-input bg-card text-sm">
              <option value="">Tất cả ca</option><option value="S1">Ca S1</option><option value="S2">Ca S2</option><option value="S3">Ca S3</option>
            </select>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} />
              Loại nghỉ phép
            </label>
          </div>

          {/* Candidates table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>{["", "Nhân sự", "Vai trò / Vị trí", "Ca", "Trạng thái", "Tải", "Kỹ năng", "Match"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {candidates.map((e) => (
                  <tr key={e.code} className={`border-t border-border cursor-pointer hover:bg-brand/5 ${picked === e.code ? "bg-brand/10" : ""}`} onClick={() => setPicked(e.code)}>
                    <td className="px-3 py-2"><input type="radio" checked={picked === e.code} onChange={() => setPicked(e.code)} /></td>
                    <td className="px-3 py-2"><div className="font-medium text-navy">{e.name}</div><div className="text-[10px] text-muted-foreground">{e.code}</div></td>
                    <td className="px-3 py-2"><div>{e.titleSap}</div><div className="text-[10px] text-muted-foreground">{e.dept} · {e.defaultWh}</div></td>
                    <td className="px-3 py-2">{e.shift}</td>
                    <td className="px-3 py-2"><span className={`inline-flex px-1.5 py-0.5 rounded text-[11px] ${e.current === "Rảnh" ? "bg-success/10 text-success" : e.current === "Bận" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{e.current}</span></td>
                    <td className="px-3 py-2 text-muted-foreground">{e.load} task</td>
                    <td className="px-3 py-2 max-w-[180px]"><div className="flex flex-wrap gap-1">{e.certs.slice(0, 3).map((c) => <span key={c} className={`text-[10px] px-1.5 py-0.5 rounded ${requiredSkill && c.toLowerCase().includes(requiredSkill.toLowerCase()) ? "bg-brand/15 text-brand font-medium" : "bg-muted text-muted-foreground"}`}>{c}</span>)}</div></td>
                    <td className="px-3 py-2"><span className={`inline-flex px-1.5 py-0.5 rounded text-[11px] font-semibold ${e.score >= 70 ? "bg-success/10 text-success" : e.score >= 50 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{e.score}%</span></td>
                  </tr>
                ))}
                {candidates.length === 0 && <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">Không có nhân sự phù hợp bộ lọc</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/30 rounded-b-xl flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">{sel ? <>Đã chọn: <span className="font-semibold text-navy">{sel.name}</span> ({sel.code}) · Match {sel.score}%</> : "Chọn 1 nhân sự để phân công"}</div>
          <div className="flex gap-2">
            <IButton onClick={onClose}>Hủy</IButton>
            <IButton variant="brand" icon={CheckCircle2} disabled={!sel} onClick={confirm}>Xác nhận phân công</IButton>
          </div>
        </div>
      </div>
    </div>
  );
}

