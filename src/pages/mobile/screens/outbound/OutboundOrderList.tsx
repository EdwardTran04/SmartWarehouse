import { useState } from "react";
import { ArrowRight, Scale, Box, Truck } from "lucide-react";
import { Badge, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   OUTBOUND ORDER LIST SCREEN: Danh sách lệnh xuất
   Lũy kế tháng/năm trên 1 dòng + Số lượng trong ngày ở filter buttons
================================================================ */
type OutboundOrder = {
  id: string;
  orderCode: string;
  customer: string;
  warehouse: string;
  status: "chờ_xác_nhận" | "đang_xử_lý" | "hoàn_tất" | "đã_hủy";
  eta: string;
  weight: string;
  volume: string;
  route: string;
};

const ORDERS: OutboundOrder[] = [
  { id: "OUT-2026-00452", orderCode: "OUT-2026-00452", customer: "CH Viettel Hà Đông", warehouse: "HN01", status: "chờ_xác_nhận", eta: "15:00", weight: "184 kg", volume: "1.2 m³", route: "HN → Hà Đông" },
  { id: "OUT-2026-00449", orderCode: "OUT-2026-00449", customer: "CH Viettel Cầu Giấy", warehouse: "HN01", status: "đang_xử_lý", eta: "14:00", weight: "220 kg", volume: "1.5 m³", route: "HN → Cầu Giấy" },
  { id: "OUT-2026-00445", orderCode: "OUT-2026-00445", customer: "CH Viettel Thanh Xuân", warehouse: "HN01", status: "hoàn_tất", eta: "10:00", weight: "150 kg", volume: "1.0 m³", route: "HN → Thanh Xuân" },
  { id: "OUT-2026-00440", orderCode: "OUT-2026-00440", customer: "CH Viettel Long Biên", warehouse: "HN01", status: "đang_xử_lý", eta: "16:30", weight: "310 kg", volume: "2.0 m³", route: "HN → Long Biên" },
];

const statusConfig = {
  chờ_xác_nhận: { label: "Chờ xác nhận", tone: "warn" as const },
  đang_xử_lý: { label: "Đang xử lý", tone: "info" as const },
  hoàn_tất: { label: "Hoàn tất", tone: "done" as const },
  đã_hủy: { label: "Đã hủy", tone: "err" as const },
};

const TABS = ["all", "chờ_xác_nhận", "đang_xử_lý", "hoàn_tất"] as const;
type TabType = typeof TABS[number];

const LABELS: Record<TabType, string> = {
  all: "Tất cả",
  chờ_xác_nhận: "Chờ xác nhận",
  đang_xử_lý: "Đang xử lý",
  hoàn_tất: "Hoàn tất",
};

export function ScreenOutboundOrderList({ back, goOutConfirm }: { back: () => void; goOutConfirm: () => void }) {
  const [tab, setTab] = useState<TabType>("all");
  const filtered = tab === "all" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  const doneMonth = 95;
  const totalMonth = 98;
  const doneYear = 1168;
  const totalYear = 1205;

  const countOf = (status: TabType) =>
    status === "all" ? ORDERS.length : ORDERS.filter((o) => o.status === status).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title="Danh sách lệnh xuất" sub="Kho HN01" onBack={back} />

      <div className="px-4 mt-3 space-y-2">
        <Card className="p-3">
          <div className="grid grid-cols-2 gap-4 text-[12px] text-slate-600">
            <div>
              <div className="text-slate-500 mb-0.5">Lũy kế tháng</div>
              <div className="text-[14px] font-bold text-slate-900">
                {doneMonth} <span className="text-slate-400 font-normal">/</span> {totalMonth}
              </div>
            </div>
            <div>
              <div className="text-slate-500 mb-0.5">Lũy kế năm</div>
              <div className="text-[14px] font-bold text-slate-900">
                {doneYear} <span className="text-slate-400 font-normal">/</span> {totalYear}
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
              onClick={() => goOutConfirm()}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-[15px]">{order.orderCode}</span>
                    <Badge tone={cfg.tone}>{cfg.label}</Badge>
                  </div>
                  <div className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> {order.customer}
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