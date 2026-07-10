import { useState } from "react";
import { Minus, Plus, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { Btn, Card, Row } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   OUTBOUND SCREEN: O5. OutLoad - Load hàng lên xe
============================================================ */
export function ScreenOutLoad({ back }: { back: () => void }) {
  const [loaded, setLoaded] = useState(7);
  const total = 12;
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="Load hàng lên xe" sub="Chuyến TR-0091 · Dock 3" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 space-y-2 text-[13px]">
          <Row k="Biển số xe" v="30H-129.45" />
          <Row k="Tài xế" v="Lê Văn Sơn · 0912.345.678" />
          <Row k="Tải trọng" v="2.5 tấn · Còn 1.6 tấn" />
          <Row k="Đơn ghép chuyến" v="3 đơn · OUT-452, OUT-455, OUT-458" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[13px] text-slate-500">Đã load</div>
            <div className="text-[15px] font-bold tabular-nums">{loaded}/{total} pallet</div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand" style={{ width: `${loaded / total * 100}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Btn variant="outline" icon={Minus} onClick={() => setLoaded(Math.max(0, loaded - 1))} full>Bớt 1</Btn>
            <Btn icon={Plus} onClick={() => setLoaded(Math.min(total, loaded + 1))} full>Load thêm</Btn>
          </div>
        </Card>

        <div className="flex items-center gap-2 mt-4 mb-2 px-1">
          <ClipboardCheck className="w-4 h-4 text-brand" />
          <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Kiểm tra trước khi rời kho</h3>
        </div>
        <Card>
          {["Đủ số pallet đã ghi trên phiếu", "Kẹp chì niêm phong container", "Chụp ảnh xe & niêm phong", "Ký nhận với tài xế"].map((s, i) => (
            <label key={s} className="flex items-center gap-3 p-3 border-b border-slate-100 last:border-0 text-[13px]">
              <input type="checkbox" defaultChecked={i < 2} className="w-5 h-5 accent-red-600" />
              <span>{s}</span>
            </label>
          ))}
        </Card>
      </div>
      <BottomActionBar primary={{ label: "Xác nhận load xong", icon: CheckCircle2, onClick: back }} />
    </div>
  );
}