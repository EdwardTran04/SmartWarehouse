import { useState } from "react";
import { Camera, CheckCircle2, Clock, RefreshCw, XCircle } from "lucide-react";
import { Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   OUTBOUND SCREEN: X3. OutPick - Lấy hàng ra khu đóng gói
   Block design giống Putaway + RFID/Vị trí cùng hàng + Serial góc phải
================================================================ */
type PickItem = {
  hu: string;
  sku: string;
  name: string;
  rfid: string;
  boxType: string;
  location: string;
  locationList: string[];
  qtyAtLocation: number;
  done: number;
  hasSerial: boolean;
  serial?: string;
};

const PICK_ITEMS: PickItem[] = [
  { hu: "HU-88121", sku: "SP-A001", name: "Galaxy A15 128GB", rfid: "RFID-88121-A1", boxType: "Carton 50", location: "A-03-02", locationList: ["A-03-02", "A-03-03", "A-04-01", "B-01-01"], qtyAtLocation: 40, done: 40, hasSerial: false },
  { hu: "HU-88122", sku: "SP-A002", name: "Galaxy A25 256GB", rfid: "RFID-88122-A1", boxType: "Carton 50", location: "A-05-11", locationList: ["A-05-11", "A-05-12", "A-06-01"], qtyAtLocation: 30, done: 30, hasSerial: false },
  { hu: "HU-88123", sku: "SP-A003", name: "Tai nghe Buds Pro", rfid: "RFID-88123-B2", boxType: "Carton 25", location: "B-11-05", locationList: ["B-11-05", "B-11-06", "B-12-01"], qtyAtLocation: 50, done: 50, hasSerial: true, serial: "SN-2026-0012345" },
  { hu: "HU-88124", sku: "SP-A004", name: "Ốp lưng Clear Cover", rfid: "RFID-88124-C3", boxType: "Carton 100", location: "C-02-08", locationList: ["C-02-08", "C-02-09", "C-03-01"], qtyAtLocation: 25, done: 25, hasSerial: false },
];

export function ScreenOutPick({ back }: { back: () => void }) {
  const [items, setItems] = useState<PickItem[]>(PICK_ITEMS);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");

  const refreshLocation = (i: number) => {
    const item = items[i];
    const currentIdx = item.locationList.indexOf(item.location);
    const nextIdx = (currentIdx + 1) % item.locationList.length;
    setItems((prev) => prev.map((x, idx) => idx === i ? { ...x, location: x.locationList[nextIdx] } : x));
  };

  const handleExtend = () => setShowExtendModal(false);
  const handleComplete = () => setShowPhotoModal(true);
  const handleConfirmPhoto = () => {
    setShowPhotoModal(false);
    back();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar
        brand
        title="Lấy hàng ra khu đóng gói"
        sub={`OUT-2026-00452 · ${items.length} HU`}
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

      {/* Items List - Block design giống Putaway */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((it, idx) => {
          const displayQty = it.hasSerial ? 1 : it.qtyAtLocation;
          return (
          <Card key={it.hu} className="p-4">
            {/* Header: HU + name | Serial (nếu có) | Qty */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 text-[15px]">{it.sku}</div>
                <div className="text-[12px] text-slate-600 mt-0.5">{it.name}</div>
              </div>
              {/* Serial (góc phải trên, nếu có) */}
              {it.hasSerial && (
                <div className="bg-brand/10 text-brand px-2 py-1 rounded-lg">
                  <div className="text-[10px] font-medium">Serial</div>
                  <div className="text-[11px] font-bold font-mono">{it.serial?.slice(-8)}</div>
                </div>
              )}
              {/* Số lượng (góc phải trên, nếu không có serial) */}
              {!it.hasSerial && (
                <div className="text-[26px] font-bold text-slate-900 leading-none">{it.qtyAtLocation}</div>
              )}
            </div>

            {/* Row 1: RFID | Loại thùng - cùng 1 hàng */}
            <div className="flex items-start gap-2 text-[11.5px] text-slate-600 mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-slate-500 mb-1">Mã khác</div>
                <div className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50 flex items-center text-slate-700 font-mono truncate">
                  {it.rfid}
                </div>
              </div>
              <div className="w-28 shrink-0">
                <div className="text-slate-500 mb-1">Loại thùng</div>
                <div className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50 flex items-center text-slate-700">
                  {it.boxType}
                </div>
              </div>
            </div>

            {/* Row 2: Số lượng | Vị trí lấy + Refresh - cùng 1 hàng */}
            <div className="flex items-start gap-2 text-[11.5px] text-slate-600">
              <div className="w-20 shrink-0">
                <div className="text-slate-500 mb-1">Số lượng</div>
                <div className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50 flex items-center text-slate-700 font-semibold">
                  {displayQty}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-500 mb-1">Vị trí lấy</div>
                <div className="flex items-center gap-1">
                  <select
                    value={it.location}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, location: e.target.value } : x))
                      )
                    }
                    className="flex-1 h-9 px-1 rounded-lg border border-slate-200 text-[12px] min-w-0"
                  >
                    {it.locationList.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => refreshLocation(idx)}
                    className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center shrink-0"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
          );
        })}

        </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <Btn full icon={CheckCircle2} onClick={handleComplete}>
          Hoàn tất lấy hàng
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
              <p className="text-[13px] text-slate-500 text-center">Vui lòng chụp ảnh hàng hóa đã lấy để xác nhận hoàn thành</p>
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
              <input
                type="number"
                min={5}
                step={5}
                value={extendMins}
                onChange={(e) => setExtendMins(+e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Lý do (bắt buộc)</div>
              <textarea
                value={extendReason}
                onChange={(e) => setExtendReason(e.target.value)}
                className="w-full h-20 p-2 rounded-lg border border-slate-300 text-sm"
                placeholder="Nhập lý do gia hạn..."
              />
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