import { Camera, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { Badge, Btn, Card, Row, SectionTitle } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";
import { ClipboardCheck } from "lucide-react";

/* =============================================================
   OUTBOUND SCREEN: O3. OutKcs - KCS xuất
============================================================ */
export function ScreenOutKcs({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="KCS xuất" sub="OUT-2026-00452" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 space-y-2 text-[13px]">
          <Row k="Số kiện cần kiểm" v="10% × 24 kiện = 3 kiện" />
          <Row k="Loại kiểm" v="Ngoại quan + niêm phong" />
          <Row k="Nhân viên KCS" v="Trần Thị Hà" />
        </Card>

        <SectionTitle title="Danh sách mẫu kiểm" icon={ShieldCheck} />
        {[
          ["HU-88101", "SP-A001 × 40", "pass"],
          ["HU-88104", "SP-A002 × 30", "pass"],
          ["HU-88109", "SP-A003 × 50", "fail"],
        ].map(([hu, ct, st]: any) => (
          <Card key={hu} className="p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${st === "pass" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
              {st === "pass" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[14px]">{hu}</div>
              <div className="text-[12px] text-slate-500">{ct}</div>
            </div>
            <Badge tone={st === "pass" ? "done" : "err"}>{st === "pass" ? "Đạt" : "Không đạt"}</Badge>
          </Card>
        ))}

        <Card className="p-4 space-y-2">
          <div className="text-[13px] font-semibold">Ghi chú KCS</div>
          <textarea rows={3} className="w-full p-3 rounded-lg border border-slate-200 text-[14px]" placeholder="Ghi nhận bất thường..." />
          <button className="w-full h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 text-slate-500 text-[13px]">
            <Camera className="w-5 h-5" /> Chụp ảnh chứng cứ
          </button>
        </Card>
      </div>
      <BottomActionBar primary={{ label: "Xác nhận KCS", icon: CheckCircle2, onClick: back }} />
    </div>
  );
}