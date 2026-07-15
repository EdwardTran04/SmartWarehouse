import { AlertTriangle, Bell, CheckCircle2, Clock, ListChecks, MapPin, RefreshCw, Send, Truck } from "lucide-react";
import { Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SYSTEM SCREEN: Notify - Notification Center
============================================================ */
const notes = [
  { t: "Task mới được giao", m: "TSK-2095 · Putaway 8 HU tại Khu G", time: "1 phút", tone: "info" as const, icon: ListChecks, plantCode: "PL-HN01", staffId: "NV-2024-0088", staffName: "Trần Minh Quân", phone: "0987 654 321" },
  { t: "Sắp quá hạn", m: "TSK-9925 KCS còn 8 phút", time: "8 phút", tone: "warn" as const, icon: Clock, plantCode: "PL-HN01", staffId: "NV-2024-0102", staffName: "Nguyễn Văn Nam", phone: "0912 345 678" },
  { t: "Quá hạn", m: "TSK-9930 Putaway đã quá 1h12", time: "1 giờ", tone: "err" as const, icon: AlertTriangle, plantCode: "PL-HN01", staffId: "NV-2024-0088", staffName: "Trần Minh Quân", phone: "0987 654 321" },
  { t: "Xe quá ETA", m: "Xe 29C-184.55 quá ETA 12 phút", time: "12 phút", tone: "err" as const, icon: Truck, plantCode: "PL-HN01", staffId: "NV-2024-0099", staffName: "Lê Văn Thắng", phone: "0904 888 999" },
  { t: "KCS có kết quả", m: "Lô L-2026-005 đạt 100%", time: "30 phút", tone: "done" as const, icon: CheckCircle2, plantCode: "PL-HN01", staffId: "NV-2024-0035", staffName: "Đỗ Thu Trang", phone: "0963 111 222" },
  { t: "API SAP lỗi", m: "Gửi T-AGR INB-2026-00118 timeout 504", time: "45 phút", tone: "err" as const, icon: Send, plantCode: "PL-HN01", staffId: "NV-2024-0001", staffName: "Admin Hệ thống", phone: "0966 777 888" },
  { t: "Chứng từ bị từ chối ký", m: "GR-2026/05/13-101 từ chối VOffice", time: "2 giờ", tone: "err" as const, icon: XCircle, plantCode: "PL-HN01", staffId: "NV-2024-0044", staffName: "Phạm Hùng Sơn", phone: "0945 999 111" },
  { t: "Vị trí putaway sai", m: "HU-...-04 cất sai khu G→H", time: "3 giờ", tone: "warn" as const, icon: MapPin, plantCode: "PL-HN01", staffId: "NV-2024-0088", staffName: "Trần Minh Quân", phone: "0987 654 321" },
  { t: "Task bị reassign", m: "TSK-9915 chuyển sang Trần Nam", time: "Hôm qua", tone: "info" as const, icon: RefreshCw, plantCode: "PL-HN01", staffId: "NV-2024-0210", staffName: "Trần Hải Nam", phone: "0977 444 555" },
];

const toneMap = { done: "bg-emerald-100 text-emerald-700", doing: "bg-sky-100 text-sky-700", warn: "bg-orange-100 text-orange-700", err: "bg-rose-100 text-rose-700", idle: "bg-slate-100 text-slate-600", info: "bg-indigo-100 text-indigo-700" };

export function ScreenNotify({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title="Thông báo" sub="9 thông báo mới" onBack={back}
        right={<button className="text-[12px] text-white/90 px-2">Đánh dấu đọc</button>} />
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {notes.map((n, i) => (
          <Card key={i} className="p-3 flex gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${toneMap[n.tone]}`}>
              <n.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-[13.5px] text-slate-900 truncate">{n.t}</div>
                <span className="text-[11px] text-slate-500 shrink-0">{n.time}</span>
              </div>
              <div className="text-[12.5px] text-slate-600 mt-0.5">{n.m}</div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <div>Plant: <span className="font-semibold text-slate-700">{n.plantCode}</span></div>
                <div>Nhân viên: <span className="font-semibold text-slate-700">{n.staffName} ({n.staffId})</span></div>
                <div>SĐT: <span className="font-semibold text-brand">{n.phone}</span></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function XCircle({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
}