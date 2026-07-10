import { useState } from "react";
import { ArrowRight, Scale, Box, Truck } from "lucide-react";
import { Badge, Card, Stat } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   INBOUND ORDER LIST SCREEN: Danh sách lệnh nhập
   Click order → order detail → "Duyệt" → Receive screen
============================================================ */
type InboundOrder = {
  id: string;
  orderCode: string;
  supplier: string;
  warehouse: string;
  status: "chờ_duyệt" | "đang_xử_lý" | "hoàn_tất";
  eta: string;
  weight: string;   // Khối lượng (kg)
  volume: string;   // Thể tích (m³)
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

export function ScreenInboundOrderList({ back, goReceive }: { back: () => void; goReceive: () => void }) {
  const [tab, setTab] = useState<"all" | "chờ_duyệt" | "đang_xử_lý" | "hoàn_tất">("all");
  const filtered = tab === "all" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title="Danh sách lệnh nhập" sub="Kho HN01" onBack={back} />

      <div className="px-4 mt-3">
        <Card className="p-3 grid grid-cols-4 gap-2">
          <Stat k="Tổng lệnh" v={String(ORDERS.length)} />
          <Stat k="Chờ duyệt" v={String(ORDERS.filter((o) => o.status === "chờ_duyệt").length)} />
          <Stat k="Đang xử lý" v={String(ORDERS.filter((o) => o.status === "đang_xử_lý").length)} />
          <Stat k="Hoàn tất" v={String(ORDERS.filter((o) => o.status === "hoàn_tất").length)} />
        </Card>
      </div>

      <div className="px-3 mt-3 flex gap-1.5">
        {(["all", "chờ_duyệt", "đang_xử_lý", "hoàn_tất"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`h-9 px-3 rounded-full text-[12px] font-semibold border ${
              tab === t ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            {t === "all" ? "Tất cả" : t === "chờ_duyệt" ? "Chờ duyệt" : t === "đang_xử_lý" ? "Đang xử lý" : "Hoàn tất"}
          </button>
        ))}
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
                  ETA: <span className="font-semibold text-slate-800">{order.eta}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}