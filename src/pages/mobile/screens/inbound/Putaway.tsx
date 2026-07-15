import { useState } from "react";
import { Camera, CheckCircle2, Clock, Scan, XCircle } from "lucide-react";
import { Badge, Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 13. PUTAWAY - Cất hàng
============================================================ */
type PutawayItem = {
  hu: string;
  sku: string;
  name: string;
  boxType: string;
  rfid: string;
  location: string;
  locationList: string[];
};

const PUTAWAY_ITEMS: PutawayItem[] = [
  { hu: "HU-2026-9921-01", sku: "SP-A001", name: "Galaxy A15 128GB", boxType: "Carton 50", rfid: "RFID-0001-A1", location: "G04-B02-T03", locationList: ["G04-B02-T03", "G04-B02-T04", "G04-B03-T01", "G05-A01-T01"] },
  { hu: "HU-2026-9921-02", sku: "SP-A002", name: "Galaxy A25 256GB", boxType: "Carton 50", rfid: "RFID-0002-A1", location: "G04-B02-T04", locationList: ["G04-B02-T03", "G04-B02-T04", "G04-B03-T01", "G05-A01-T01"] },
  { hu: "HU-2026-9921-03", sku: "SP-A003", name: "Tai nghe Buds Pro", boxType: "Carton 25", rfid: "RFID-0003-B2", location: "G04-B03-T01", locationList: ["G04-B02-T03", "G04-B02-T04", "G04-B03-T01", "G05-A01-T01"] },
  { hu: "HU-2026-9921-04", sku: "SP-A004", name: "Cáp sạc USB-C 1m", boxType: "Carton 100", rfid: "RFID-0004-C3", location: "G05-A01-T01", locationList: ["G04-B02-T03", "G04-B02-T04", "G04-B03-T01", "G05-A01-T01"] },
];

export function ScreenPutaway({ back, goHome }: { back: () => void; goHome: () => void }) {
  const [items, setItems] = useState(PUTAWAY_ITEMS);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");

  const handleExtend = () => {
    setShowExtendModal(false);
  };

  const handleComplete = () => {
    setShowPhotoModal(true);
  };

  const handleConfirmPhoto = () => {
    setShowPhotoModal(false);
    goHome();
  };

  const [showScanModal, setShowScanModal] = useState(false);
  const [showScanSuccessToast, setShowScanSuccessToast] = useState(false);

  const handleScanLocation = (index: number) => {
    setShowScanModal(true);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((it, i) => {
          if (i === index) {
            const currentIdx = it.locationList.indexOf(it.location);
            const nextIdx = (currentIdx + 1) % it.locationList.length;
            return { ...it, location: it.locationList[nextIdx] };
          }
          return it;
        })
      );
      setShowScanModal(false);
      setShowScanSuccessToast(true);
      setTimeout(() => setShowScanSuccessToast(false), 2000);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar
        brand
        title="Putaway · Cất hàng"
        sub="16 HU · Khu G"
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

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((it, idx) => (
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
                <div className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50 flex items-center text-slate-700">
                  {it.rfid}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-slate-500 mb-1">Vị trí lưu trữ</div>
                <div className="flex items-center gap-1">
                  <select
                    value={it.location}
                    className="flex-1 h-9 px-2 rounded-lg border border-slate-200 text-[12px]"
                  >
                    {it.locationList.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleScanLocation(idx)}
                    className="h-9 w-9 rounded-lg border border-brand bg-brand/5 flex items-center justify-center active:scale-95 transition-all animate-pulse"
                    title="Quét vị trí"
                  >
                    <Scan className="w-4 h-4 text-brand" />
                  </button>
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
              <p className="text-[13px] text-slate-500 text-center">Vui lòng chụp ảnh hàng hóa đã cất để xác nhận hoàn thành</p>
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

      {/* Scan Modal */}
      {showScanModal && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col justify-between p-6 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between text-white mt-8">
            <div className="text-[16px] font-bold">Quét mã vị trí lưu trữ</div>
            <button onClick={() => setShowScanModal(false)} className="text-white bg-white/20 p-2 rounded-full">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative w-64 h-64 mx-auto rounded-3xl border-2 border-brand/80 overflow-hidden flex items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-brand rounded-tl-md" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-brand rounded-tr-md" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-brand rounded-bl-md" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-brand rounded-tr-md" />
            
            {/* Animated Laser line */}
            <div className="w-full h-1 bg-brand absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_8px_#ea580c]" />
            
            <div className="text-white/60 text-[12px] text-center px-4 mt-20">
              Di chuyển camera đến mã vạch vị trí (Rack G04...) để quét
            </div>
          </div>
          
          <div className="text-center text-white/80 text-[13px] mb-8">
            Đang tìm kiếm mã vạch vị trí lưu trữ...
          </div>
        </div>
      )}

      {showScanSuccessToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[12px] font-semibold flex items-center gap-2 shadow-lg z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã quét vị trí thành công!
        </div>
      )}
    </div>
  );
}