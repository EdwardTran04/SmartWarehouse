import { useState } from "react";
import { CheckCircle2, Package, Truck, XCircle } from "lucide-react";
import { Badge, Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   APPROVE SCREEN: Phê duyệt phân công
   - Stats: inline on 1 row
   - 2 tabs: Nhân sự / Lệnh
============================================================ */
type Staff = {
  id: string;
  name: string;
  morningShift: boolean;
  afternoonShift: boolean;
};

type Order = {
  id: string;
  orderType: string;
  orderTypeVi: string;
  kg: number;
  m3: number;
};

const STATS = {
  inboundCount: 12,
  outboundCount: 8,
  inboundKg: 4500,
  inboundM3: 28.5,
  outboundKg: 3200,
  outboundM3: 22.3,
  staffNeeded: 15,
  staffPlanned: 12,
};

const STAFF_LIST: Staff[] = [
  { id: "NV-001", name: "Nguyễn Văn An", morningShift: true, afternoonShift: true },
  { id: "NV-002", name: "Trần Văn Bình", morningShift: true, afternoonShift: false },
  { id: "NV-003", name: "Lê Thị Chi", morningShift: true, afternoonShift: true },
  { id: "NV-004", name: "Phạm Văn Đức", morningShift: false, afternoonShift: true },
  { id: "NV-005", name: "Hoàng Văn Em", morningShift: true, afternoonShift: false },
  { id: "NV-006", name: "Ngô Thị Fo", morningShift: false, afternoonShift: false },
  { id: "NV-007", name: "Đặng Văn Gh", morningShift: true, afternoonShift: true },
  { id: "NV-008", name: "Bùi Thị Hương", morningShift: true, afternoonShift: true },
];

const ORDER_LIST: Order[] = [
  { id: "INB-2026-00231", orderType: "Nhập kho NCC", orderTypeVi: "Nhập kho NCC", kg: 1200, m3: 8.5 },
  { id: "INB-2026-00232", orderType: "Nhập chuyển kho", orderTypeVi: "Nhập chuyển kho", kg: 850, m3: 6.2 },
  { id: "INB-2026-00233", orderType: "Nhập hàng về", orderTypeVi: "Nhập hàng về", kg: 560, m3: 4.8 },
  { id: "OUT-2026-00451", orderType: "Xuất vận chuyển", orderTypeVi: "Xuất vận chuyển", kg: 980, m3: 7.2 },
  { id: "OUT-2026-00452", orderType: "Xuất cho đại lý", orderTypeVi: "Xuất cho đại lý", kg: 720, m3: 5.5 },
];

export function ScreenApprove({ back }: { back: () => void }) {
  const [tab, setTab] = useState<"staff" | "orders">("staff");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar brand title="Phê duyệt phân công" sub="Giám đốc kho · HN01" onBack={back} />

      {/* Stats Row */}
      <div className="px-4 mt-3">
        <Card className="p-2.5">
          <div className="flex items-center justify-between text-center">
            <div className="flex-1">
              <div className="flex items-center justify-center gap-1">
                <Package className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[16px] font-bold text-slate-900">{STATS.inboundCount}</span>
              </div>
              <div className="text-[9px] text-slate-500">Phiếu NK</div>
              <div className="text-[10px] text-slate-600">{STATS.inboundKg.toLocaleString()} kg · {STATS.inboundM3}m³</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex-1">
              <div className="flex items-center justify-center gap-1">
                <Truck className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[16px] font-bold text-slate-900">{STATS.outboundCount}</span>
              </div>
              <div className="text-[9px] text-slate-500">Phiếu XK</div>
              <div className="text-[10px] text-slate-600">{STATS.outboundKg.toLocaleString()} kg · {STATS.outboundM3}m³</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex-1">
              <div className="flex items-center justify-center gap-1">
                <span className="text-[16px] font-bold text-red-600">{STATS.staffNeeded}</span>
                <span className="text-slate-400">/</span>
                <span className="text-[16px] font-bold text-emerald-600">{STATS.staffPlanned}</span>
              </div>
              <div className="text-[9px] text-slate-500">Cần / Dự kiến</div>
              <div className="text-[10px] text-slate-600">Nhân sự</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-3">
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setTab("staff")}
            className={`flex-1 h-8 rounded-md text-[12px] font-semibold transition-colors ${tab === "staff" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            Danh sách nhân sự
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`flex-1 h-8 rounded-md text-[12px] font-semibold transition-colors ${tab === "orders" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            Danh sách lệnh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tab === "staff" && STAFF_LIST.map((s) => (
          <Card key={s.id} className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-900 text-[14px]">{s.id}</div>
                <div className="text-[12px] text-slate-600">{s.name}</div>
              </div>
              <div className="flex gap-2">
                <div className={`px-2 py-1 rounded text-[10px] font-medium ${s.morningShift ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                  <div>Sáng</div>
                  <div>{s.morningShift ? "Đi làm" : "Nghỉ"}</div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-medium ${s.afternoonShift ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                  <div>Chiều</div>
                  <div>{s.afternoonShift ? "Đi làm" : "Nghỉ"}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {tab === "orders" && ORDER_LIST.map((o) => (
          <Card key={o.id} className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-bold text-slate-900 text-[14px]">{o.id}</div>
                <Badge tone="default">{o.orderTypeVi}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11.5px] text-slate-600">
              <div>Số kg: <span className="font-medium text-slate-800">{o.kg.toLocaleString()}</span></div>
              <div>Số m³: <span className="font-medium text-slate-800">{o.m3}</span></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="outline" icon={XCircle}>
            Từ chối
          </Btn>
          <Btn icon={CheckCircle2}>
            Phê duyệt
          </Btn>
        </div>
      </div>
    </div>
  );
}