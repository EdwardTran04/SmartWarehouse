import { useState } from "react";
import { CheckCircle2, Clock, Package, Printer, ScanLine, XCircle } from "lucide-react";
import { Badge, Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 10. PACK - Đóng gói & In tem
============================================================ */
type PackItem = {
  sku: string;
  name: string;
  serial: string;
  rfid: string;
  boxType: string;
  boxTypeList: string[];
};

const PACK_ITEMS: PackItem[] = [
  { sku: "SP-A001", name: "Galaxy A15 128GB", serial: "SN-2026-0012345", rfid: "RFID-0001-A1", boxType: "Carton 50", boxTypeList: ["Carton 25", "Carton 50", "Carton 100", "Pallet"] },
  { sku: "SP-A002", name: "Galaxy A25 256GB", serial: "SN-2026-0012346", rfid: "RFID-0002-A1", boxType: "Carton 50", boxTypeList: ["Carton 25", "Carton 50", "Carton 100", "Pallet"] },
  { sku: "SP-A003", name: "Tai nghe Buds Pro", serial: "SN-2026-0012347", rfid: "RFID-0003-B2", boxType: "Carton 25", boxTypeList: ["Carton 25", "Carton 50", "Carton 100", "Pallet"] },
  { sku: "SP-A004", name: "Cáp sạc USB-C 1m", serial: "", rfid: "RFID-0004-C3", boxType: "Carton 100", boxTypeList: ["Carton 25", "Carton 50", "Carton 100", "Pallet"] },
];

const BOX_STATS = {
  totalKg: 2450,
  totalM3: 18.5,
  cartonCount: 16,
  cartonTypes: [
    { type: "Carton loại 1", count: 8 },
    { type: "Carton loại 2", count: 5 },
    { type: "Carton loại 3", count: 3 },
  ],
  palletCount: 2,
  palletTypes: [
    { type: "Pallet loại 1", count: 1 },
    { type: "Pallet loại 2", count: 1 },
  ],
  woodBoxCount: 4,
  woodBoxTypes: [
    { type: "Thùng gỗ loại 1", count: 2 },
    { type: "Thùng gỗ loại 2", count: 2 },
  ],
};

export function ScreenPack({ back, goHome }: { back: () => void; goHome: () => void }) {
  const [items, setItems] = useState(PACK_ITEMS);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");

  const handleExtend = () => {
    setShowExtendModal(false);
  };

  const updateBoxType = (index: number, newBoxType: string) => {
    setItems((prev) => prev.map((it, i) => i === index ? { ...it, boxType: newBoxType } : it));
  };

  const updateRfid = (index: number) => {
    const newRfid = prompt("Nhập mã RFID mới:");
    if (newRfid) {
      setItems((prev) => prev.map((it, i) => i === index ? { ...it, rfid: newRfid } : it));
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar
        brand
        title="Đóng gói & In tem"
        sub="SP-A001 · 800 cái"
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

      {/* Box Stats */}
      <div className="px-4 mt-3">
        <Card className="p-2.5">
          <div className="flex items-center justify-between text-center">
            <div className="flex-1">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Tổng kg / m³</div>
              <div className="text-[14px] font-bold text-slate-900 mt-0.5">{BOX_STATS.totalKg.toLocaleString()} kg</div>
              <div className="text-[10px] text-slate-600">{BOX_STATS.totalM3} m³</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex-1">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Thùng Carton</div>
              <div className="text-[14px] font-bold text-slate-900 mt-0.5">{BOX_STATS.cartonCount}</div>
              <div className="flex items-center justify-center gap-1 flex-wrap mt-0.5">
                {BOX_STATS.cartonTypes.map((bt) => (
                  <span key={bt.type} className="text-[9px] text-slate-500">{bt.count}{bt.type.replace("Carton ", "")}</span>
                ))}
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex-1">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Pallet</div>
              <div className="text-[14px] font-bold text-slate-900 mt-0.5">{BOX_STATS.palletCount}</div>
              <div className="flex items-center justify-center gap-1 flex-wrap mt-0.5">
                {BOX_STATS.palletTypes.map((bt) => (
                  <span key={bt.type} className="text-[9px] text-slate-500">{bt.count}{bt.type.replace("Pallet ", "")}</span>
                ))}
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex-1">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Thùng gỗ</div>
              <div className="text-[14px] font-bold text-slate-900 mt-0.5">{BOX_STATS.woodBoxCount}</div>
              <div className="flex items-center justify-center gap-1 flex-wrap mt-0.5">
                {BOX_STATS.woodBoxTypes.map((bt) => (
                  <span key={bt.type} className="text-[9px] text-slate-500">{bt.count}{bt.type.replace("Thùng gỗ ", "")}</span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((it, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 text-[15px]">{it.name}</div>
                <div className="text-[12px] text-slate-600 mt-0.5">SKU: {it.sku}</div>
                {it.serial && <div className="text-[11px] text-slate-500 mt-0.5">Serial: {it.serial}</div>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11.5px] text-slate-600">
              <div>
                <div className="text-slate-500 mb-1">Loại thùng</div>
                <select
                  value={it.boxType}
                  onChange={(e) => updateBoxType(idx, e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-slate-200 text-[12px]"
                >
                  {it.boxTypeList.map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Mã RFID</div>
                <div className="relative">
                  <input
                    value={it.rfid}
                    readOnly
                    className="w-full h-9 pl-2 pr-8 rounded-lg border border-slate-200 text-[12px] bg-slate-50"
                  />
                  <button
                    onClick={() => updateRfid(idx)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded"
                  >
                    <ScanLine className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Printer Selection */}
        <Card className="p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Máy in</div>
          <select className="h-11 w-full px-3 rounded-lg border border-slate-200 text-[13.5px]">
            <option>PRT-PACK-01 · Zebra ZT411</option>
            <option>PRT-PACK-02 · Zebra ZT230</option>
          </select>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="outline" size="sm" icon={Printer}>
            In tem
          </Btn>
          <Btn size="sm" icon={CheckCircle2} onClick={goHome}>
            Hoàn thành
          </Btn>
        </div>
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