import { NavLink, useLocation } from "react-router-dom";
import {
  Warehouse, Settings2, MapPin, Package, Boxes,
  Layers, Tag, CircleDot, ShieldCheck, Bell, Search, ChevronRight, User, QrCode,
  ClipboardList, Activity, AlertTriangle, FileSignature, Smartphone, Truck,
  Users, Briefcase, ListChecks, Network, Send, Printer, CheckCircle2, XCircle, Bot,
} from "lucide-react";
import { ReactNode, useState } from "react";

const nav = [
  { group: "Nhập kho", items: [
    { to: "/inbound/orders", label: "Danh sách lệnh nhập", icon: ClipboardList },
    { to: "/inbound/tasks", label: "Danh sách task", icon: Activity },
  ]},
  { group: "Xuất kho", items: [
    { to: "/outbound/orders", label: "Danh sách lệnh xuất", icon: Send },
    { to: "/outbound/tasks", label: "Danh sách task", icon: Activity },
  ]},
  { group: "Điều phối giao việc", items: [
    { to: "/auto-dispatch", label: "Điều phối giao việc tự động", icon: Bot },
  ]},
  { group: "Cấu hình nghiệp vụ kho", items: [
    { to: "/master/task-catalog", label: "Cấu hình task - quy trình", icon: ListChecks },
    { to: "/master/mapping", label: "Cấu hình Vị trí – Task", icon: Network },
  ]},
  { group: "Cấu hình hệ thống", items: [
    { to: "/master/employees", label: "Nhân sự kho", icon: Users },
    { to: "/master/positions", label: "Chức danh / Nhiệm vụ", icon: Briefcase },
  ]},
  { group: "Mobile WMS", items: [
    { to: "/mobile", label: "Mobile App nhân sự", icon: Smartphone },
  ]},
];

export default function AppShell({ children, breadcrumb }: { children: ReactNode; breadcrumb: { label: string; to?: string }[] }) {
  const { pathname } = useLocation();
  const [q, setQ] = useState("");
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Warehouse className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">Kho Thông Minh</div>
            <div className="text-[10px] text-sidebar-foreground/70 uppercase tracking-wider">WMS Platform</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {nav.map((g) => (
            <div key={g.group}>
              <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold">{g.group}</div>
              <div className="space-y-0.5">
                {g.items.map((it) => {
                  const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
                  return (
                    <NavLink key={it.to} to={it.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        active ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm" : "hover:bg-sidebar-accent hover:text-white"
                      }`}>
                      <it.icon className="w-4 h-4" />
                      {it.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border text-xs text-sidebar-foreground/60">v1.0 · © 2026</div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-navy">Kho Thông Minh</span>
            <span className="text-muted-foreground">/</span>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className={i === breadcrumb.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"}>{b.label}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kho, vị trí, SKU..."
                className="h-9 w-72 pl-9 pr-3 rounded-md bg-muted/60 border border-transparent focus:bg-card focus:border-ring focus:outline-none text-sm" />
            </div>
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-navy text-navy-foreground flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-medium">Nguyễn Quản Trị</div>
                <div className="text-muted-foreground">Admin WMS</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
