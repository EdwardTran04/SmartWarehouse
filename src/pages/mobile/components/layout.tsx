import { ReactNode } from "react";
import { Home, ListChecks, ScanLine, Bell, User, ChevronLeft, Wifi, WifiOff, Battery, Signal, Boxes } from "lucide-react";

/* =============================================================
   LAYOUT COMPONENTS
   ============================================================= */

type Screen =
  | "login" | "home" | "task" | "receive" | "vehicle" | "unload" | "check"
  | "kcs" | "reject" | "tagr" | "voffice" | "pack" | "putaway"
  | "outConfirm" | "outPick" | "outPack" | "outKcs" | "outLoad" | "outHandover"
  | "approve" | "approveDetail"
  | "worker" | "notify" | "scan" | "profile";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[390px] h-[844px] rounded-[44px] bg-slate-900 p-[8px] shadow-2xl mx-auto">
      <div className="relative w-full h-full rounded-[36px] overflow-hidden bg-slate-100 flex flex-col">
        {/* Status bar */}
        <div className="h-9 bg-white flex items-center justify-between px-6 text-[12px] font-semibold text-slate-900 shrink-0">
          <span>9:41</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-24 h-5 bg-slate-900 rounded-full" />
          <div className="flex items-center gap-1">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function TopBar({ title, sub, onBack, right, brand }: { title: string; sub?: string; onBack?: () => void; right?: ReactNode; brand?: boolean }) {
  return (
    <div className={`shrink-0 relative z-10 ${brand ? "bg-[var(--gradient-brand)] text-white" : "bg-white text-slate-900 border-b border-slate-200"}`} style={brand ? { background: "var(--gradient-brand)" } : {}}>
      <div className="h-14 px-3 flex items-center gap-2">
        {onBack ? (
          <button onClick={onBack} className={`w-9 h-9 rounded-full flex items-center justify-center ${brand ? "bg-white/15" : "hover:bg-slate-100"}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : <div className="w-9" />}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[15px] truncate">{title}</div>
          {sub && <div className={`text-[11px] truncate ${brand ? "text-white/80" : "text-slate-500"}`}>{sub}</div>}
        </div>
        {right}
      </div>
    </div>
  );
}

export function BottomNav({ active, onChange }: { active: string; onChange: (v: Screen) => void }) {
  const items = [
    { id: "home" as Screen, icon: Home, label: "Trang chủ" },
    { id: "task" as Screen, icon: ListChecks, label: "Task" },
    { id: "scan" as Screen, icon: ScanLine, label: "Scan", main: true },
    { id: "notify" as Screen, icon: Bell, label: "Thông báo" },
    { id: "profile" as Screen, icon: User, label: "Cá nhân" },
  ];
  return (
    <div className="shrink-0 bg-white border-t border-slate-200 pb-safe relative">
      <div className="grid grid-cols-5 h-16">
        {items.map((it) => {
          if (it.main) {
            return (
              <div key={it.id} className="relative flex items-center justify-center">
                <button onClick={() => onChange(it.id)}
                  className="absolute -top-6 w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center shadow-[var(--shadow-brand)] border-4 border-white">
                  <ScanLine className="w-7 h-7" />
                </button>
                <span className="text-[10px] font-medium text-slate-500 mt-8">{it.label}</span>
              </div>
            );
          }
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} className="flex flex-col items-center justify-center gap-0.5">
              <it.icon className={`w-[22px] h-[22px] ${on ? "text-brand" : "text-slate-500"}`} />
              <span className={`text-[10px] ${on ? "text-brand font-semibold" : "text-slate-500"}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function OfflineBanner({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <div className="bg-orange-500 text-white px-4 py-1.5 text-[12px] font-semibold flex items-center gap-2">
      <WifiOff className="w-3.5 h-3.5" /> Đang offline · 3 thao tác chờ đồng bộ
    </div>
  );
}