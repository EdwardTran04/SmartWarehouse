import { Btn, Card, Row, SectionTitle } from "../../components/ui";
import { BottomActionBar, ExtendTimerBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";
import { FileCheck2, PenLine, XCircle } from "lucide-react";

/* =============================================================
   SCREEN: 12. VOFFICE - Ký VOffice
============================================================ */
export function ScreenVOffice({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <ExtendTimerBar />
      <TopBar brand title="Ký VOffice" sub="Phiếu nhập GR-2026/05/14-018" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4">
          <div className="aspect-[3/4] rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <FileCheck2 className="w-10 h-10 mb-2" />
            <div className="text-[12px] font-semibold">Preview Phiếu nhập kho</div>
            <div className="text-[11px] mt-1">GR-2026/05/14-018 · 2 trang</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="h-10 rounded-lg border border-slate-200 text-[12.5px] font-semibold">Xem phiếu nhập</button>
            <button className="h-10 rounded-lg border border-slate-200 text-[12.5px] font-semibold">Xem BBBG</button>
          </div>
        </Card>

        <Card className="p-4 space-y-1.5 text-[13px]">
          <Row k="Số phiếu nhập" v="GR-2026/05/14-018" />
          <Row k="Người trình" v="Trần Văn Kho" />
          <Row k="Người ký" v="Nguyễn T. Giám đốc kho" />
          <Row k="Trạng thái" v={<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold bg-orange-100 text-orange-700 border-orange-200">Chờ ký</span>} />
        </Card>
      </div>
      <BottomActionBar
        primary={{ label: "Ký xác nhận VOffice", icon: PenLine, onClick: back }}
      />
    </div>
  );
}

function Send({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
}