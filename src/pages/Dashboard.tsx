import AppShell from "@/components/AppShell";
import { StatusBadge, PageTitle, Progress } from "@/components/ui-bits";
import { dashboardStats, warehouses, locationByType } from "@/data/mock";
import { Warehouse as WIcon, CheckCircle2, AlertTriangle, MapPin, PackageCheck, PackageX, Lock, ShieldAlert, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Tổng số kho", value: dashboardStats.totalWarehouses, icon: WIcon, tone: "bg-primary/10 text-primary" },
  { label: "Kho đã cấu hình", value: dashboardStats.configured, icon: CheckCircle2, tone: "bg-success/10 text-success" },
  { label: "Kho chưa cấu hình", value: dashboardStats.unconfigured, icon: AlertTriangle, tone: "bg-warning/10 text-warning" },
  { label: "Tổng phân khu", value: dashboardStats.totalZones, icon: MapPin, tone: "bg-info/10 text-info" },
  { label: "Tổng hạ tầng lưu trữ", value: dashboardStats.totalInfrastructure, icon: PackageCheck, tone: "bg-primary/10 text-primary" },
  { label: "Tổng location", value: dashboardStats.totalLocations.toLocaleString("vi-VN"), icon: MapPin, tone: "bg-navy/10 text-navy" },
];
const sub = [
  { label: "Location trống", value: dashboardStats.empty, icon: PackageX, tone: "text-success" },
  { label: "Đang chứa hàng", value: dashboardStats.occupied, icon: PackageCheck, tone: "text-info" },
  { label: "Location bị khóa", value: dashboardStats.blocked, icon: Lock, tone: "text-destructive" },
  { label: "Rule vi phạm", value: dashboardStats.ruleViolations, icon: ShieldAlert, tone: "text-warning" },
];

function Donut({ a, b, labelA, labelB }: { a: number; b: number; labelA: string; labelB: string }) {
  const total = a + b;
  const pa = (a / total) * 100;
  const r = 60, c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-5">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="20" />
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="20"
          strokeDasharray={`${(c * pa) / 100} ${c}`} strokeLinecap="butt" />
      </svg>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary" /> {labelA} <b className="ml-2">{a}</b></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-muted-foreground/40" /> {labelB} <b className="ml-2">{b}</b></div>
        <div className="text-xs text-muted-foreground pt-1 border-t border-border">Tỷ lệ: <b className="text-navy">{pa.toFixed(0)}%</b></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const maxLoc = Math.max(...locationByType.map(l => l.count));
  const colorCls: Record<string, string> = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" };

  return (
    <AppShell breadcrumb={[{ label: "Dashboard" }]}>
      <PageTitle title="Tổng quan kho" subtitle="Hiệu suất và trạng thái cấu hình toàn hệ thống" />

      <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 mb-4 text-xs flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-primary">Cấu trúc dữ liệu:</span>
        <span className="font-mono text-navy">Kho</span><ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono text-navy">Phân khu</span><ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono text-navy">Hạ tầng lưu trữ</span><ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono text-navy">Location</span>
        <span className="text-muted-foreground ml-2">· Kho đồng bộ từ SAP, location sinh tự động từ hạ tầng lưu trữ</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground truncate">{s.label}</div>
                <div className="text-2xl font-bold text-navy mt-2">{s.value}</div>
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.tone}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {sub.map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <s.icon className={`w-8 h-8 ${s.tone}`} />
            <div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-xl font-bold text-navy">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-semibold text-navy mb-4">Tỷ lệ kho đã cấu hình</h3>
          <Donut a={dashboardStats.configured} b={dashboardStats.unconfigured} labelA="Đã cấu hình" labelB="Chưa cấu hình" />
        </div>

        <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-semibold text-navy mb-4">Tỷ lệ sử dụng vị trí</h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-navy">
                {Math.round((dashboardStats.occupied / dashboardStats.totalLocations) * 100)}%
              </span>
              <span className="text-xs text-muted-foreground">{dashboardStats.occupied}/{dashboardStats.totalLocations}</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
              <div className="bg-info h-full" style={{ width: `${(dashboardStats.occupied / dashboardStats.totalLocations) * 100}%` }} />
              <div className="bg-warning h-full" style={{ width: `${(dashboardStats.blocked / dashboardStats.totalLocations) * 100}%` }} />
              <div className="bg-success h-full flex-1" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 text-xs">
              <div><div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-info" />Đang chứa</div><div className="font-bold text-navy mt-0.5">{dashboardStats.occupied}</div></div>
              <div><div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-warning" />Đã khóa</div><div className="font-bold text-navy mt-0.5">{dashboardStats.blocked}</div></div>
              <div><div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-success" />Trống</div><div className="font-bold text-navy mt-0.5">{dashboardStats.empty}</div></div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-semibold text-navy mb-4">Location theo loại</h3>
          <div className="space-y-3">
            {locationByType.map((l) => (
              <div key={l.type}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{l.type}</span><span className="font-semibold text-navy">{l.count}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${colorCls[l.color]}`} style={{ width: `${(l.count / maxLoc) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">Tỷ lệ sử dụng theo kho</h3>
            <Link to="/warehouses" className="text-sm text-primary inline-flex items-center gap-1 hover:underline">Xem tất cả <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="space-y-4">
            {warehouses.map((w) => (
              <div key={w.code}>
                <div className="flex justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{w.code}</span>
                    <span className="text-muted-foreground">— {w.name}</span>
                    <StatusBadge status={w.configured ? "Đã cấu hình" : "Chưa cấu hình"} />
                  </div>
                  <span className="font-semibold text-navy">{w.utilization}%</span>
                </div>
                <Progress value={w.utilization} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-semibold text-navy mb-4">Cảnh báo gần đây</h3>
          <div className="space-y-3">
            {[
              { t: "PCCC02 chiều rộng 650mm < 700mm", level: "Chặn lưu", time: "5 phút trước" },
              { t: "PCCC03 tuyến không liên tục", level: "Chặn lưu", time: "10 phút trước" },
              { t: "Kho HCM01 chưa cấu hình", level: "Cảnh báo", time: "2 giờ trước" },
              { t: "Kho CT01 chưa cấu hình", level: "Cảnh báo", time: "2 giờ trước" },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/40">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${a.level === "Chặn lưu" ? "text-destructive" : "text-warning"}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">{a.time} <StatusBadge status={a.level} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
