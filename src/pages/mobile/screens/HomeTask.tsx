import { useState } from "react";
import { Bell, Clock, MapPin, Package, PlayCircle, MoreHorizontal, ClipboardList } from "lucide-react";
import { Badge, Btn, Card } from "../components/ui";

/* =============================================================
   SCREEN: 2. HOME TASK (Danh sách Task)
============================================================ */
type Screen =
  | "login" | "home" | "task" | "receive" | "vehicle" | "unload" | "check" | "bbbg"
  | "tagr" | "voffice" | "pack" | "putaway"
  | "outboundOrderList" | "outConfirm" | "outPick" | "outPack" | "outWaitArea" | "outKcs" | "outBBBG" | "outLoad" | "outVOffice"
  | "approve"
  | "inboundOrderList"
  | "worker" | "notify" | "scan" | "profile" | "staffProfile";

const TASKS = [
  { id: "T-APR0000000001", type: "Phê duyệt phân công", order: "INB-2026-00117", loc: "Văn phòng", deadline: "09:30", left: "00:15:00", status: "doing" as const, statusLabel: "Đang xử lý", route: "approve" as const },
  { id: "T-SCR0000000001", type: "Xác nhận xe / cổng", order: "INB-2026-00118", loc: "Cổng bảo vệ", deadline: "09:45", left: "00:30:00", status: "doing" as const, statusLabel: "Đang xử lý", route: "vehicle" as const },
  { id: "T-Unl0000000001", type: "Dỡ hàng tại Dock A2", order: "INB-2026-00118", loc: "Dock A2", deadline: "10:30", left: "00:42:10", status: "doing" as const, statusLabel: "Đang xử lý", route: "unload" as const },
  { id: "T-Ho", type: "Kiểm hàng theo PO", order: "INB-2026-00118", loc: "Khu kiểm B1", deadline: "11:15", left: "01:27:00", status: "idle" as const, statusLabel: "Chưa bắt đầu", route: "check" as const },
  { id: "T-SigBBBG00001", type: "Ký Biên bản bàn giao", order: "INB-2026-00118", loc: "Văn phòng", deadline: "11:45", left: "01:57:00", status: "idle" as const, statusLabel: "Chưa bắt đầu", route: "bbbg" as const },
  { id: "T-Wait000000001", type: "Đưa hàng vào khu chờ nhập", order: "INB-2026-00118", loc: "Khu chờ nhập B", deadline: "12:00", left: "02:12:00", status: "idle" as const, statusLabel: "Chưa bắt đầu", route: "inboundWaitArea" as const },
  { id: "T-AGR0000000001", type: "Thực nhập T-AGR", order: "INB-2026-00118", loc: "Khu kiểm B1", deadline: "12:15", left: "02:27:00", status: "idle" as const, statusLabel: "Chưa bắt đầu", route: "tagr" as const },
  { id: "T-Sig0000000001", type: "Ký VOffice", order: "INB-2026-00118", loc: "Văn phòng", deadline: "12:45", left: "02:57:00", status: "idle" as const, statusLabel: "Chưa bắt đầu", route: "voffice" as const },
  { id: "T-Pac0000000001", type: "Đóng gói & In tem", order: "INB-2026-00118", loc: "Khu đóng gói", deadline: "13:15", left: "03:27:00", status: "idle" as const, statusLabel: "Chưa bắt đầu", route: "pack" as const },
  { id: "T-Mv30000000001", type: "Putaway lên vị trí", order: "INB-2026-00118", loc: "Khu G · Rack G04", deadline: "14:00", left: "04:12:00", status: "idle" as const, statusLabel: "Chưa bắt đầu", route: "putaway" as const },
];

export function ScreenHomeTask({ go }: { go: (s: Screen) => void }) {
  const [filter, setFilter] = useState("Tất cả");
  const filters = ["Tất cả", "Chưa bắt đầu", "Đang xử lý", "Pending", "Quá hạn", "Hoàn thành"];

  const getCount = (f: string) => {
    if (f === "Tất cả") return TASKS.length;
    if (f === "Chưa bắt đầu") return TASKS.filter(t => t.status === "idle").length;
    if (f === "Đang xử lý") return TASKS.filter(t => t.status === "doing").length;
    if (f === "Pending") return TASKS.filter(t => t.status === "warn").length;
    if (f === "Quá hạn") return TASKS.filter(t => t.status === "err").length;
    if (f === "Hoàn thành") return TASKS.filter(t => t.status === "done").length;
    return 0;
  };

  const doneMonth = 154;
  const totalMonth = 160;
  const doneYear = 1920;
  const totalYear = 2000;

  const filteredTasks = TASKS.filter((t) => {
    if (filter === "Tất cả") return true;
    if (filter === "Chưa bắt đầu") return t.status === "idle";
    if (filter === "Đang xử lý") return t.status === "doing";
    if (filter === "Pending") return t.status === "warn";
    if (filter === "Quá hạn") return t.status === "err";
    if (filter === "Hoàn thành") return t.status === "done";
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="px-4 pt-4 pb-5 text-white shrink-0" style={{ background: "var(--gradient-brand)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] opacity-90">Xin chào,</div>
            <div className="text-[20px] font-extrabold leading-tight">Trần Minh Quân</div>
            <div className="text-[11px] mt-0.5 opacity-90">Thủ kho · HN01 · Ca sáng 06:00–14:00</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-white/15 rounded-lg p-2.5">
            <div className="text-[10px] opacity-80 mb-0.5">Lũy kế tháng</div>
            <div className="text-[18px] font-bold text-white">
              {doneMonth}
            </div>
          </div>
          <div className="bg-white/15 rounded-lg p-2.5">
            <div className="text-[10px] opacity-80 mb-0.5">Lũy kế năm</div>
            <div className="text-[18px] font-bold text-white">
              {doneYear.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto bg-white border-b border-slate-200 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filters.map((f) => {
          const count = getCount(f);
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-semibold border whitespace-nowrap ${filter === f ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}>
              {f} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filteredTasks.map((t) => (
          <Card key={t.id} className="p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-[15px]">{t.id}</span>
                  <Badge tone={t.status}>{t.statusLabel}</Badge>
                </div>
                <div className="text-[13px] font-semibold text-slate-800 mt-0.5">{t.type}</div>
              </div>
              <button className="text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-y-1 text-[12px] text-slate-600">
              <div className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {t.order}</div>
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {t.loc}</div>
              <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Deadline: {t.deadline}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className={`text-[13px] font-bold tabular-nums ${t.status === "err" ? "text-rose-600" : t.status === "warn" ? "text-orange-600" : "text-sky-700"}`}>
                ⏱ {t.left}
              </div>
              <div className="flex gap-2">
                <Btn size="sm" variant="outline" onClick={() => go(t.route)}>Mở</Btn>
                {t.status !== "done" && <Btn size="sm" icon={PlayCircle} onClick={() => go(t.route)}>Bắt đầu</Btn>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
