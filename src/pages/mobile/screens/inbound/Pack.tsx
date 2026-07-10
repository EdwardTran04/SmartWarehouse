import { Btn, Card, Row, SectionTitle, Stat } from "../../components/ui";
import { BottomActionBar, ExtendTimerBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";
import { CheckCircle2, Package, Printer, QrCode } from "lucide-react";

/* =============================================================
   SCREEN: 13. PACK - Đóng gói & In tem
============================================================ */
export function ScreenPack({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <ExtendTimerBar />
      <TopBar brand title="Đóng gói & In tem" sub="SP-A001 · 800 cái" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 space-y-1.5 text-[13px]">
          <Row k="Mã hàng" v="SP-A001 · Galaxy A15 128GB" />
          <Row k="SL cần đóng" v="800 cái" />
        </Card>

        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-sky-50 border-indigo-200">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[11px] font-bold">AI</div>
            <div className="flex-1">
              <div className="text-[12.5px] font-bold text-indigo-900">AI gợi ý quy cách đóng gói</div>
              <div className="text-[12px] text-indigo-700 mt-0.5">50/cuộn/thùng · 16 thùng · 1 pallet · Tối ưu thể tích 92%</div>
            </div>
          </div>
        </Card>

        <SectionTitle title="Quy cách đóng" icon={Package} />
        <div className="grid grid-cols-2 gap-2">
          {["50/cuộn/thùng", "25/cuộn/thùng", "100/cuộn/thùng", "Tùy chỉnh"].map((q, i) => (
            <button key={q} className={`h-12 rounded-xl border text-[13px] font-semibold ${i === 0 ? "border-brand bg-brand-soft text-brand" : "border-slate-200 bg-white"}`}>{q}</button>
          ))}
        </div>

        <Card className="p-4 grid grid-cols-3 gap-2">
          <Stat k="Số thùng" v="16" />
          <Stat k="Số pallet" v="1" />
          <Stat k="HU đã tạo" v="0/16" />
        </Card>

        <SectionTitle title="Danh sách HU" icon={QrCode} />
        <Card className="divide-y divide-slate-100">
          {[
            ["HU-2026-9921-01", "Đã in", "done"],
            ["HU-2026-9921-02", "Đã in", "done"],
            ["HU-2026-9921-03", "Đang in", "doing"],
            ["HU-2026-9921-04", "Lỗi máy in", "err"],
          ].map(([id, st, t]: any) => (
            <div key={id} className="flex items-center gap-3 p-3">
              <QrCode className="w-9 h-9 text-slate-700" />
              <div className="flex-1">
                <div className="font-bold text-[13.5px]">{id}</div>
                <div className="text-[11px] text-slate-500">50 cái · Carton</div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${t === "done" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : t === "doing" ? "bg-sky-100 text-sky-700 border-sky-200" : "bg-rose-100 text-rose-700 border-rose-200"}`}>{st}</span>
            </div>
          ))}
        </Card>

        <Card className="p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Máy in</div>
          <select className="h-11 w-full px-3 rounded-lg border border-slate-200 text-[13.5px]">
            <option>PRT-PACK-01 · Zebra ZT411</option>
            <option>PRT-PACK-02 · Zebra ZT230</option>
          </select>
        </Card>
      </div>
      <BottomActionBar
        primary={{ label: "Hoàn thành đóng gói", icon: CheckCircle2, onClick: back }}
      />
    </div>
  );
}