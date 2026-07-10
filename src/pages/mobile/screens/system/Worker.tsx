import { CheckCircle2, User } from "lucide-react";
import { Badge, Btn, Card, Dot, Stat } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   SYSTEM SCREEN: Worker Status
============================================================ */
export function ScreenWorker({ back }: { back: () => void }) {
  const states = [
    ["Có mặt", "done"], ["Đang bận", "doing"], ["Nghỉ phép", "warn"],
    ["Nghỉ ốm", "err"], ["Hỗ trợ kho khác", "info"],
  ];
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title="Trạng thái làm việc" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-brand-soft text-brand flex items-center justify-center font-bold text-[18px]">LK</div>
            <div className="flex-1">
              <div className="font-bold text-[15px]">Trần Văn Kho</div>
              <div className="text-[12px] text-slate-500">Thủ kho · HN01</div>
            </div>
            <Badge tone="done">Có mặt</Badge>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
            <Stat k="Ca làm việc" v="06:00 – 14:00" />
            <Stat k="Khu phụ trách" v="Khu G + Dock A" />
          </div>
        </Card>

        <div className="flex items-center gap-2 mt-4 mb-2 px-1">
          <User className="w-4 h-4 text-brand" />
          <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Cập nhật trạng thái</h3>
        </div>
        <Card className="divide-y divide-slate-100">
          {states.map(([l, t]: any, i) => (
            <button key={l} className="w-full flex items-center gap-3 p-3.5">
              <Dot tone={t} />
              <span className="flex-1 text-left text-[14px] font-medium">{l}</span>
              {i === 0 && <CheckCircle2 className="w-5 h-5 text-brand" />}
            </button>
          ))}
        </Card>

        <Card className="p-3 bg-orange-50 border-orange-200 text-[12px] text-orange-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> Bạn đang có 3 task chưa hoàn thành. Đổi sang "Nghỉ" sẽ yêu cầu bàn giao task.
        </Card>
      </div>
      <BottomActionBar primary={{ label: "Cập nhật trạng thái", icon: CheckCircle2, onClick: back }} />
    </div>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}