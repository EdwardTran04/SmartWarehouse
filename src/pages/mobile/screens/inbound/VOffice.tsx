import { useState } from "react";
import { Clock, FileCheck2, PenLine, XCircle } from "lucide-react";
import { Btn, Card, Row } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 11. VOFFICE - Ký VOffice
============================================================ */
export function ScreenVOffice({ back, goHome }: { back: () => void; goHome: () => void }) {
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");

  const handleExtend = () => {
    setShowExtendModal(false);
  };

  const handleSign = () => {
    goHome();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar
        brand
        title="Ký VOffice"
        sub="Phiếu nhập GR-2026/05/14-018"
        onBack={back}
        right={
          <button
            onClick={() => setShowExtendModal(true)}
            className="flex items-center gap-1 px-3 h-8 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium hover:bg-slate-200"
          >
            <Clock className="w-3.5 h-3.5" />
            Gia hạn KPI
          </button>
        }
      />
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
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <Btn full icon={PenLine} onClick={handleSign}>
          Ký xác nhận VOffice
        </Btn>
      </div>

      {showExtendModal && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowExtendModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">Gia hạn KPI</div>
              <button onClick={() => setShowExtendModal(false)} className="text-slate-400"><XCircle className="w-5 h-5" /></button>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Thời gian gia hạn (phút)</div>
              <input type="number" min={5} step={5} value={extendMins} onChange={(e) => setExtendMins(+e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Lý do (bắt buộc)</div>
              <textarea value={extendReason} onChange={(e) => setExtendReason(e.target.value)} className="w-full h-20 p-2 rounded-lg border border-slate-300 text-sm" placeholder="Nhập lý do gia hạn..." />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Btn variant="outline" size="sm" full onClick={() => setShowExtendModal(false)}>Hủy</Btn>
              <Btn size="sm" full icon={Clock} onClick={handleExtend}>Gia hạn</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}