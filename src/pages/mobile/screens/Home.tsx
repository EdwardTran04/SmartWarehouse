import { useState } from "react";
import { Bell, Clock, MapPin, Package, PlayCircle, MoreHorizontal, ClipboardList } from "lucide-react";
import { Badge, Btn, Card, SectionTitle } from "../components/ui";

/* =============================================================
   SCREEN: 2. HOME TASK
============================================================ */
type Screen = "login" | "home" | "task" | "receive" | "vehicle" | "unload" | "check"
  | "kcs" | "reject" | "tagr" | "voffice" | "pack" | "putaway"
  | "outConfirm" | "outPick" | "outPack" | "outKcs" | "outLoad" | "outHandover"
  | "approve" | "approveDetail"
  | "inboundOrderList"
  | "worker" | "notify" | "scan" | "profile";

const TASKS = [
  { id: "TSK-9921", type: "Dỡ hàng", order: "INB-2026-00118", loc: "Dock A2", deadline: "10:30", left: "00:42:10", status: "doing" as const, statusLabel: "Đang xử lý" },
  { id: "TSK-9922", type: "Kiểm hàng", order: "INB-2026-00118", loc: "Khu kiểm B1", deadline: "11:15", left: "01:27:00", status: "idle" as const, statusLabel: "Chưa bắt đầu" },
  { id: "TSK-9925", type: "KCS", order: "INB-2026-00119", loc: "KCS-01", deadline: "09:45", left: "00:08:22", status: "warn" as const, statusLabel: "Sắp quá hạn" },
  { id: "TSK-9930", type: "Putaway", order: "INB-2026-00120", loc: "Khu G·Rack G04", deadline: "08:00", left: "Quá 01:12:00", status: "err" as const, statusLabel: "Quá hạn" },
  { id: "TSK-9928", type: "Đóng gói", order: "INB-2026-00121", loc: "Pack-02", deadline: "Hôm qua", left: "—", status: "done" as const, statusLabel: "Hoàn thành" },
  { id: "TSK-9935", type: "Xác nhận lệnh", order: "INB-2026-00122", loc: "—", deadline: "Hôm nay", left: "Phát sinh", status: "warn" as const, statusLabel: "Có phát sinh" },
];

export function ScreenHome({ go, openTask }: { go: (s: Screen) => void; openTask: (id: string) => void }) {
  const [filter, setFilter] = useState("Tất cả");
  const filters = ["Tất cả", "Chưa bắt đầu", "Đang xử lý", "Pending", "Quá hạn", "Hoàn thành"];
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-5 text-white" style={{ background: "var(--gradient-brand)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] opacity-90">Xin chào,</div>
            <div className="text-[20px] font-extrabold leading-tight">Trần Văn Kho</div>
            <div className="text-[11px] mt-0.5 opacity-90">Thủ kho · HN01 · Ca sáng 06:00–14:00</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Bell className="w-5 h-5" /></div>
        </div>
        <div className="grid grid-cols-5 gap-1 mt-3">
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <div className="text-[16px] font-bold">14</div>
            <div className="text-[9px] opacity-80">Hôm nay</div>
          </div>
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <div className="text-[16px] font-bold">3</div>
            <div className="text-[9px] opacity-80">Đang làm</div>
          </div>
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <div className="text-[16px] font-bold">2</div>
            <div className="text-[9px] opacity-80">Sắp hạn</div>
          </div>
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <div className="text-[16px] font-bold">1</div>
            <div className="text-[9px] opacity-80">Quá hạn</div>
          </div>
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <div className="text-[16px] font-bold">2</div>
            <div className="text-[9px] opacity-80">Phát sinh</div>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto bg-white border-b border-slate-200 mt-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-semibold border ${filter === f ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Quick action: Danh sách lệnh nhập */}
      <div className="px-3 py-2 bg-white border-b border-slate-200">
        <Btn variant="outline" full icon={ClipboardList} onClick={() => go("inboundOrderList")}>
          Danh sách lệnh nhập
        </Btn>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 px-3 py-3 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TASKS.map((t) => (
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
              <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t.deadline}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className={`text-[13px] font-bold tabular-nums ${t.status === "err" ? "text-rose-600" : t.status === "warn" ? "text-orange-600" : "text-sky-700"}`}>
                ⏱ {t.left}
              </div>
              <div className="flex gap-2">
                <Btn size="sm" variant="outline" onClick={() => openTask(t.id)}>Mở</Btn>
                {t.status !== "done" && <Btn size="sm" icon={PlayCircle} onClick={() => openTask(t.id)}>Bắt đầu</Btn>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}