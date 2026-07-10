import { Plus, Printer, QrCode } from "lucide-react";
import { Btn, Card, Row, SectionTitle } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";
import { CheckCircle2 } from "lucide-react";

/* =============================================================
   OUTBOUND SCREEN: O4. OutPack - Đóng gói xuất
============================================================ */
export function ScreenOutPack({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="Đóng gói xuất" sub="OUT-2026-00452" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 space-y-2 text-[13px]">
          <Row k="Loại đóng gói" v="Thùng carton + màng co" />
          <Row k="Số kiện dự kiến" v="24 thùng" />
          <Row k="Đã đóng" v="17 / 24" />
        </Card>

        <SectionTitle title="Sinh HU và in tem" icon={Printer} />
        <Card>
          {["HU-88121 · Thùng 30", "HU-88122 · Thùng 30", "HU-88123 · Thùng 20"].map((s) => (
            <div key={s} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 text-[13px]">
              <span className="font-mono">{s}</span>
              <button className="inline-flex items-center gap-1 text-brand font-semibold"><Printer className="w-4 h-4" /> In lại</button>
            </div>
          ))}
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Btn variant="outline" icon={Plus} full>Thêm HU</Btn>
          <Btn variant="outline" icon={QrCode} full>Quét tem</Btn>
        </div>
      </div>
      <BottomActionBar primary={{ label: "Hoàn tất đóng gói", icon: CheckCircle2, onClick: back }} />
    </div>
  );
}