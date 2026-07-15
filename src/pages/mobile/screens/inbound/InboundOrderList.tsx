import { useState } from "react";
import { ArrowRight, Scale, Box, Truck } from "lucide-react";
import { Badge, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   INBOUND ORDER LIST SCREEN: Danh sách lệnh nhập
   Lũy kế tháng/năm trên 1 dòng + Số lượng trong ngày ở filter buttons
================================================================ */
type InboundOrder = {
  id: string;
  orderCode: string;
  supplier: string;
  warehouse: string;
  status: "chờ_duyệt" | "đang_xử_lý" | "hoàn_tất";
  eta: string;
  weight: string;
  volume: string;
};

const ORDERS: InboundOrder[] = [
  { id: "INB-2026-00231", orderCode: "INB-2026-00231", supplier: "Ericsson Vietnam", warehouse: "HN01", status: "chờ_duyệt", eta: "09:30", weight: "1,240 kg", volume: "4.8 m³" },
  { id: "INB-2026-00228", orderCode: "INB-2026-00228", supplier: "Samsung Electronics", warehouse: "HN01", status: "đang_xử_lý", eta: "08:00", weight: "960 kg", volume: "3.2 m³" },
  { id: "INB-2026-00225", orderCode: "INB-2026-00225", supplier: "Apple Vietnam", warehouse: "HN01", status: "hoàn_tất", eta: "07:30", weight: "720 kg", volume: "2.4 m³" },
  { id: "INB-2026-00220", orderCode: "INB-2026-00220", supplier: "Xiaomi Vietnam", warehouse: "HN01", status: "đang_xử_lý", eta: "10:00", weight: "1,850 kg", volume: "6.2 m³" },
];

const statusConfig = {
  chờ_duyệt: { label: "Chờ duyệt", tone: "warn" as const },
  đang_xử_lý: { label: "Đang xử lý", tone: "info" as const },
  hoàn_tất: { label: "Hoàn tất", tone: "done" as const },
};

const TABS = ["all", "chờ_duyệt", "đang_xử_lý", "hoàn_tất"] as const;
type TabType = typeof TABS[number];

const LABELS: Record<TabType, string> = {
  all: "Tất cả",
  chờ_duyệt: "Chờ duyệt",
  đang_xử_lý: "Đang xử lý",
  hoàn_tất: "Hoàn tất",
};

export function ScreenInboundOrderList({ back, goReceive }: { back: () => void; goReceive: () => void }) {
  const [tab, setTab] = useState<TabType>("all");
  const filtered = tab === "all" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  const doneMonth = 138;
  const doneMonthWeight = 165.6;
  const doneMonthVolume = 662.4;
  const doneYear = 1802;
  const doneYearWeight = 2162.4;
  const doneYearVolume = 8649.6;

  const countOf = (status: TabType) =>
    status === "all" ? ORDERS.length : ORDERS.filter((o) => o.status === status).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title="Danh sách lệnh nhập" sub="Kho HN01" onBack={back} />

      <div className="px-4 mt-3 space-y-2">
        <Card className="p-3">
          <div className="grid grid-cols-2 gap-4 text-[12px] text-slate-600">
            <div>
              <div className="text-slate-500 font-semibold mb-1 text-[11px] uppercase tracking-wider">Lũy kế tháng</div>
              <div className="space-y-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Số lệnh:</span>
                  <span className="font-bold text-slate-800 text-[13px]">{doneMonth}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Khối lượng:</span>
                  <span className="font-bold text-slate-800 text-[13px]">{doneMonthWeight.toLocaleString()} tấn</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Thể tích:</span>
                  <span className="font-bold text-slate-800 text-[13px]">{doneMonthVolume} m³</span>
                </div>
              </div>
            </div>
            <div className="border-l border-slate-100 pl-4">
              <div className="text-slate-500 font-semibold mb-1 text-[11px] uppercase tracking-wider">Lũy kế năm</div>
              <div className="space-y-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Số lệnh:</span>
                  <span className="font-bold text-slate-800 text-[13px]">{doneYear.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Khối lượng:</span>
                  <span className="font-bold text-slate-800 text-[13px]">{doneYearWeight.toLocaleString()} tấn</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Thể tích:</span>
                  <span className="font-bold text-slate-800 text-[13px]">{doneYearVolume.toLocaleString()} m³</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="px-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-1.5 w-max">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`h-9 px-3 rounded-full text-[12px] font-semibold border whitespace-nowrap ${
                  tab === t ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {LABELS[t]} ({countOf(t)})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filtered.length === 0 && (
          <div className="text-center text-slate-500 text-[13px] mt-10">Không có lệnh nào</div>
        )}
        {filtered.map((order) => {
          const cfg = statusConfig[order.status];
          return (
            <Card
              key={order.id}
              className="p-4 cursor-pointer active:bg-slate-100 transition-colors"
              onClick={() => goReceive()}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-[15px]">{order.orderCode}</span>
                    <Badge tone={cfg.tone}>{cfg.label}</Badge>
                  </div>
                  <div className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> {order.supplier}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-3 text-[12px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.weight}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.volume}</span>
                </div>
                <div>
                  Giờ giao: <span className="font-semibold text-slate-800">{order.eta}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}