import { Badge, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SYSTEM SCREEN: Profile
============================================================ */
type Screen = "login" | "home" | "task" | "receive" | "vehicle" | "unload" | "check"
  | "kcs" | "reject" | "tagr" | "voffice" | "pack" | "putaway"
  | "outConfirm" | "outPick" | "outPack" | "outKcs" | "outLoad" | "outHandover"
  | "approve" | "approveDetail"
  | "worker" | "notify" | "scan" | "profile";

export function ScreenProfile({ back, go }: { back: () => void; go: (s: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title="Cá nhân" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[18px]">LK</div>
          <div className="flex-1">
            <div className="font-bold text-[15px]">Trần Văn Kho</div>
            <div className="text-[12px] text-slate-500">nv.kho.hn01 · Thủ kho HN01</div>
          </div>
          <Badge tone="done">Online</Badge>
        </Card>
        <Card className="grid grid-cols-3 divide-x divide-slate-100">
          {[["27", "Hôm nay"], ["142", "Tuần"], ["98%", "SLA"]].map(([v, l]) => (
            <div key={l} className="p-3 text-center">
              <div className="text-[18px] font-extrabold text-brand">{v}</div>
              <div className="text-[11px] text-slate-500">{l}</div>
            </div>
          ))}
        </Card>
        <Card className="divide-y divide-slate-100">
          {[
            { label: "Ca làm việc", value: "Ca sáng · 06:00 – 14:00", icon: Clock },
            { label: "Kho phụ trách", value: "HN01 · Kho Hà Nội", icon: MapPin },
            { label: "Nhóm / Role", value: "Thủ kho", icon: User },
            { label: "Số điện thoại", value: "0987 654 321", icon: Phone },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 p-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-slate-500">{label}</div>
                <div className="text-[13.5px] font-semibold text-slate-900">{value}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

function MapPin({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}

function User({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

function Phone({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}