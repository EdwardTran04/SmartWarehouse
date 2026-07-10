import { useState } from "react";
import { CheckCircle2, Clock, RefreshCw, XCircle } from "lucide-react";
import { Badge, Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 11. PUTAWAY - Cất hàng
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

export function ScreenPutaway({ back }: { back: () => void }) {
  const [items, setItems] = useState(PUTAWAY_ITEMS);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");

  const handleExtend = () => {
    setShowExtendModal(false);
  };

  const refreshLocation = (index: number) => {
    const item = items[index];
    const currentIdx = item.locationList.indexOf(item.location);
    const nextIdx = (currentIdx + 1) % item.locationList.length;
    setItems((prev) => prev.map((it, i) => i === index ? { ...it, location: it.locationList[nextIdx] } : it));
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
                    onClick={() => refreshLocation(idx)}
                    className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <Btn full icon={CheckCircle2}>
          Hoàn thành
        </Btn>
      </div>

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