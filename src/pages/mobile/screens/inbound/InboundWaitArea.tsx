import { useState } from "react";
import { Camera, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   INBOUND SCREEN: N8.5. InboundWaitArea - Đưa hàng vào khu chờ nhập
   Design giống OutWaitArea - chỉ HU, name, Loại thùng, Mã RFID
 ================================================================ */
type WaitItem = {
  hu: string;
  sku: string;
  name: string;
  boxType: string;
  rfid: string;
  qty: number;
};

const WAIT_ITEMS: WaitItem[] = [
  { hu: "HU-10211", sku: "SP-A001", name: "Galaxy A15 128GB", boxType: "Carton 50", rfid: "RFID-10211-A1", qty: 40 },
  { hu: "HU-10212", sku: "SP-A002", name: "Galaxy A25 256GB", boxType: "Carton 50", rfid: "RFID-10212-A1", qty: 40 },
  { hu: "HU-10213", sku: "SP-A003", name: "Tai nghe Buds Pro", boxType: "Carton 25", rfid: "RFID-10213-B2", qty: 30 },
  { hu: "HU-10214", sku: "SP-A004", name: "Cáp sạc USB-C 1m", boxType: "Carton 100", rfid: "RFID-10214-C3", qty: 25 },
  { hu: "HU-10215", sku: "SP-A005", name: "Keo dán chuyên dụng", boxType: "Carton 100", rfid: "RFID-10215-E5", qty: 25 },
];

export function ScreenInboundWaitArea({ back, goHome }: { back: () => void; goHome: () => void }) {
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");

  const handleExtend = () => setShowExtendModal(false);
  const handleComplete = () => setShowPhotoModal(true);
  const handleConfirmPhoto = () => {
    setShowPhotoModal(false);
    goHome();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar
        brand
        title="Khu chờ nhập"
        sub={`INB-2026-00118 · ${WAIT_ITEMS.length} HU`}
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

      {/* Items List - giống Putaway, không có Vị trí lưu trữ */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {WAIT_ITEMS.map((it) => (
          <Card key={it.hu} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 text-[15px]">{it.hu}</div>
                <div className="text-[12px] text-slate-600 mt-0.5">{it.name}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11.5px] text-slate-600">
              <div>
                <div className="text-slate-500 mb-1">Loại thùng</div>
                <div className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50 flex items-center text-slate-700">
                  {it.boxType}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Mã RFID</div>
                <div className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50 flex items-center text-slate-700 font-mono">
                  {it.rfid}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <Btn full icon={CheckCircle2} onClick={handleComplete}>
          Hoàn thành
        </Btn>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowPhotoModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="text-[16px] font-bold text-slate-900 text-center">Chụp ảnh xác nhận</div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                <Camera className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-[13px] text-slate-500 text-center">Vui lòng chụp ảnh hàng hóa tại khu chờ nhập</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Btn variant="outline" full onClick={() => setShowPhotoModal(false)}>Hủy</Btn>
              <Btn full onClick={handleConfirmPhoto}>Xác nhận</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
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
