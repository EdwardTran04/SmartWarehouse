import { Badge, Btn, Card, Dot, Row, SectionTitle } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";
import { ShieldCheck, ClipboardCheck } from "lucide-react";

/* =============================================================
   SCREEN: 9. KCS
============================================================ */
export function ScreenKCS({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar brand title="KCS · do SAP thực hiện" sub="INB-2026-00118 · Chờ kết quả từ SAP" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-6 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 bg-sky-50 border border-sky-200">
          <div className="flex items-start gap-2 text-[13px] text-sky-800">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-0.5">Task KCS do SAP thực hiện</div>
              <div className="text-[12px] leading-relaxed">Nhân sự kho <b>không</b> thao tác KCS thủ công. Hệ thống chỉ tiếp nhận kết quả qua API <b>API-KCS-RES</b> từ SAP.</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-1.5 text-[13px]">
          <Row k="Mã hàng" v="SP-A001 · Galaxy A15 128GB" />
          <Row k="Lô / Batch" v="L-2026-005" />
          <Row k="Số lượng KCS" v="50 mẫu / 800 cái" />
        </Card>

        <SectionTitle title="Trạng thái phía SAP" icon={ClipboardCheck} />
        <Card className="divide-y divide-slate-100">
          {[
            ["Gửi yêu cầu KCS (API-KCS-REQ)", "done", "09:00"],
            ["SAP tiếp nhận", "done", "09:00:12"],
            ["SAP xử lý KCS", "doing", "đang chạy"],
            ["Kết quả KCS (API-KCS-RES)", "idle", "chờ SAP đẩy về"],
          ].map(([l, t, time]: any) => (
            <div key={l} className="flex items-center gap-3 p-3">
              <Dot tone={t} />
              <span className="flex-1 text-[13.5px]">{l}</span>
              <span className="text-[11px] text-slate-500">{time}</span>
            </div>
          ))}
        </Card>

        <SectionTitle title="Kết quả gần nhất (read-only)" icon={ShieldCheck} />
        <Card className="divide-y divide-slate-100 text-[13px]">
          <div className="p-3 flex items-center justify-between"><span>ANT-5G-32T</span><Badge tone="done">Đạt</Badge></div>
          <div className="p-3 flex items-center justify-between"><span>RRU-4408</span><Badge tone="err">Không đạt · Major</Badge></div>
          <div className="p-3 flex items-center justify-between"><span>PWR-48V-30A</span><Badge tone="warn">Pending</Badge></div>
        </Card>

        <div className="pt-2">
          <Btn full variant="outline" onClick={back}>Quay lại</Btn>
        </div>
      </div>
    </div>
  );
}