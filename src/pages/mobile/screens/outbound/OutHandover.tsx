import { Camera, FileCheck2, PenLine } from "lucide-react";
import { Badge, Btn, Card, Row } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";
import { CheckCircle2 } from "lucide-react";

/* =============================================================
   OUTBOUND SCREEN: O6. OutHandover - Bàn giao vận chuyển
============================================================ */
export function ScreenOutHandover({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="Bàn giao vận chuyển" sub="Chuyến TR-0091" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 space-y-2 text-[13px]">
          <Row k="Chuyến" v="TR-0091 · HN → Hà Đông" />
          <Row k="Tài xế" v="Lê Văn Sơn" />
          <Row k="SĐT" v="0912.345.678" />
          <Row k="Xuất phát" v="14/05/2026 · 15:20" />
        </Card>

        <div className="flex items-center gap-2 mt-4 mb-2 px-1">
          <FileCheck2 className="w-4 h-4 text-brand" />
          <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Chứng từ đi kèm</h3>
        </div>
        <Card>
          {["Phiếu xuất kho", "Biên bản bàn giao", "Bảng kê hàng hoá"].map((s) => (
            <div key={s} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 text-[13px]">
              <span>{s}</span>
              <Badge tone="done">Đã in</Badge>
            </div>
          ))}
        </Card>

        <Card className="p-4 space-y-3">
          <div className="text-[13px] font-semibold">Ký nhận điện tử</div>
          <div className="h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-[12px]">
            <PenLine className="w-5 h-5 mr-2" /> Chữ ký tài xế
          </div>
          <button className="w-full h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 text-slate-500 text-[13px]">
            <Camera className="w-5 h-5" /> Chụp ảnh xác nhận
          </button>
        </Card>
      </div>
      <BottomActionBar primary={{ label: "Hoàn tất bàn giao", icon: CheckCircle2, onClick: back }} />
    </div>
  );
}