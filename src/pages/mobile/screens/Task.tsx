import { Camera, CheckCircle2, ChevronRight, Clock, ListChecks, MapPin, Package, PenLine, PlayCircle, Plus } from "lucide-react";
import { Badge, Btn, Card, KpiTimer, Row, SectionTitle } from "../components/ui";
import { BottomActionBar, ExtendTimerBar } from "../components/BottomActionBar";
import { TopBar } from "../components/layout";

/* =============================================================
   SCREEN: 3. TASK DETAIL chung
============================================================ */
type Screen = "login" | "home" | "task" | "receive" | "vehicle" | "unload" | "check"
  | "kcs" | "reject" | "tagr" | "voffice" | "pack" | "putaway"
  | "outConfirm" | "outPick" | "outPack" | "outKcs" | "outLoad" | "outHandover"
  | "approve" | "approveDetail"
  | "worker" | "notify" | "scan" | "profile";

export function ScreenTask({ back, go }: { back: () => void; go: (s: Screen) => void }) {
  const checklist = [
    { ok: true, label: "Xác nhận tiếp nhận lệnh nhập", to: "receive" as Screen },
    { ok: true, label: "Xác nhận xe vào cổng", to: "vehicle" as Screen },
    { ok: false, label: "Dỡ hàng tại Dock A2", to: "unload" as Screen, required: true },
    { ok: false, label: "Kiểm hàng & Ký BBBG (1 người thực hiện)", to: "check" as Screen, required: true },
    { ok: false, label: "KCS (do SAP thực hiện · xem trạng thái)", to: "kcs" as Screen },
    { ok: false, label: "Thực nhập T-AGR · gửi SAP", to: "tagr" as Screen, required: true },
    { ok: false, label: "Ký VOffice", to: "voffice" as Screen, required: true },
    { ok: false, label: "Đóng gói & in tem HU", to: "pack" as Screen },
    { ok: false, label: "Putaway lên vị trí", to: "putaway" as Screen, required: true },
  ];
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <ExtendTimerBar />
      <TopBar brand title="TSK-9921 · Dỡ hàng" sub="INB-2026-00118 · Task tự sinh từ Order" onBack={back}
        right={<button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white"><MoreHorizontal className="w-5 h-5" /></button>} />
      <div className="px-4 mt-3">
        <Card className="p-3 grid grid-cols-3 gap-2">
          <KpiTimer label="Còn lại" value="00:42" tone="doing" />
          <KpiTimer label="SLA" value="2h" tone="info" />
          <KpiTimer label="Tiến độ" value="30%" tone="warn" />
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SectionTitle icon={Package} title="Thông tin lệnh nhập" />
        <Card className="p-4 space-y-2 text-[13px]">
          <Row k="Mã order" v="INB-2026-00118" />
          <Row k="Loại nhập" v="Nhập NCC" />
          <Row k="NCC" v="Ericsson Vietnam (NCC-0991)" />
          <Row k="Kho nhận" v="HN01 · Kho HN" />
          <Row k="Nguồn task" v="Task Template · INB" />
          <Row k="SLA" v={<span className="text-orange-600 font-semibold">Còn 42 phút</span>} />
        </Card>

        <SectionTitle icon={ListChecks} title="Checklist thao tác" />
        <Card className="divide-y divide-slate-100">
          {checklist.map((c, i) => (
            <button key={i} onClick={() => go(c.to)} className="w-full flex items-center gap-3 p-3.5 text-left active:bg-slate-50">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${c.ok ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
                {c.ok ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[12px] font-bold">{i + 1}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-slate-900">{c.label}</div>
                {c.required && !c.ok && <div className="text-[11px] text-rose-600 font-semibold mt-0.5">Bắt buộc</div>}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </Card>

        <SectionTitle icon={PenLine} title="Ghi chú" />
        <Card className="p-3">
          <textarea rows={3} placeholder="Ghi chú cho task..." className="w-full text-[13px] border-0 resize-none focus:outline-none" />
        </Card>

        <SectionTitle icon={Camera} title="Bằng chứng (4)" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500">
              <Camera className="w-5 h-5" />
            </div>
          ))}
          <button className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <BottomActionBar
        primary={{ label: "Hoàn thành task", icon: CheckCircle2, onClick: () => go("home") }}
      />
    </div>
  );
}

function MoreHorizontal({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
}

function Pause({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
}

function AlertTriangle({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}