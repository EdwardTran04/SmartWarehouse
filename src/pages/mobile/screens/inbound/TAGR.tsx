import { CheckCircle2, Package, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge, Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 10. T-AGR - Thực nhập T-AGR
   Data from SAP auto-returned with stats cards
============================================================ */
type TagrItem = {
  sku: string;
  name: string;
  rfid: string;
  productType: string;
  productTypeVi: string;
  hasSerial: boolean;
  serial?: string;
  qtyPassed: number;
  kgPassed: number;
  m3Passed: number;
  qtyFailed: number;
  kgFailed: number;
  m3Failed: number;
  isPassed: boolean;
};

const TAGR_ITEMS: TagrItem[] = [
  { sku: "SP-A001", name: "Galaxy A15 128GB", rfid: "RFID-0001-A1", productType: "Điện thoại", productTypeVi: "Điện thoại", hasSerial: true, serial: "SN-2026-0012345", qtyPassed: 800, kgPassed: 240, m3Passed: 0.48, qtyFailed: 0, kgFailed: 0, m3Failed: 0, isPassed: true },
  { sku: "SP-A002", name: "Galaxy A25 256GB", rfid: "RFID-0002-A1", productType: "Điện thoại", productTypeVi: "Điện thoại", hasSerial: true, serial: "SN-2026-0012346", qtyPassed: 598, kgPassed: 180, m3Passed: 0.36, qtyFailed: 2, kgFailed: 0.6, m3Failed: 0.001, isPassed: false },
  { sku: "SP-A003", name: "Tai nghe Buds Pro", rfid: "RFID-0003-B2", productType: "Phụ kiện", productTypeVi: "Phụ kiện", hasSerial: true, serial: "SN-2026-0012347", qtyPassed: 1195, kgPassed: 48, m3Passed: 0.24, qtyFailed: 5, kgFailed: 0.2, m3Failed: 0.001, isPassed: false },
  { sku: "SP-A004", name: "Cáp sạc USB-C 1m", rfid: "RFID-0004-C3", productType: "Vật tư", productTypeVi: "Vật tư", hasSerial: false, qtyPassed: 50, kgPassed: 5, m3Passed: 0.1, qtyFailed: 0, kgFailed: 0, m3Failed: 0, isPassed: true },
  { sku: "SP-A005", name: "Ống lót máy", rfid: "RFID-0005-D4", productType: "Vật tư", productTypeVi: "Vật tư", hasSerial: false, qtyPassed: 118, kgPassed: 12, m3Passed: 0.18, qtyFailed: 2, kgFailed: 0.2, m3Failed: 0.003, isPassed: false },
  { sku: "SP-A006", name: "Keo dán chuyên dụng", rfid: "RFID-0006-E5", productType: "Vật tư", productTypeVi: "Vật tư", hasSerial: false, qtyPassed: 35, kgPassed: 3.5, m3Passed: 0.07, qtyFailed: 0, kgFailed: 0, m3Failed: 0, isPassed: true },
];

const STATS = {
  totalPassed: TAGR_ITEMS.filter((i) => i.isPassed).length,
  qtyPassed: TAGR_ITEMS.reduce((s, i) => s + i.qtyPassed, 0),
  kgPassed: TAGR_ITEMS.reduce((s, i) => s + i.kgPassed, 0),
  m3Passed: TAGR_ITEMS.reduce((s, i) => s + i.m3Passed, 0),
  totalFailed: TAGR_ITEMS.filter((i) => !i.isPassed).length,
  qtyFailed: TAGR_ITEMS.reduce((s, i) => s + i.qtyFailed, 0),
  kgFailed: TAGR_ITEMS.reduce((s, i) => s + i.kgFailed, 0),
  m3Failed: TAGR_ITEMS.reduce((s, i) => s + i.m3Failed, 0),
};

export function ScreenTAGR({ back, goVOffice }: { back: () => void; goVOffice: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar brand title="Thực nhập" sub="INB-2026-00118 · Gửi SAP" onBack={back} />

      {/* Stats Cards */}
      <div className="px-4 mt-3">
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-emerald-600">{STATS.totalPassed}</div>
                <div className="text-[10px] text-slate-500">Hàng đạt</div>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-600">
              <span className="font-medium">{STATS.qtyPassed.toLocaleString()} cái</span>
              <span className="text-slate-400 mx-1">·</span>
              <span className="font-medium">{STATS.kgPassed.toLocaleString()} kg</span>
              <span className="text-slate-400 mx-1">·</span>
              <span className="font-medium">{STATS.m3Passed.toFixed(2)} m³</span>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-rose-600">{STATS.totalFailed}</div>
                <div className="text-[10px] text-slate-500">Hàng không đạt</div>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-600">
              <span className="font-medium">{STATS.qtyFailed} cái</span>
              <span className="text-slate-400 mx-1">·</span>
              <span className="font-medium">{STATS.kgFailed} kg</span>
              <span className="text-slate-400 mx-1">·</span>
              <span className="font-medium">{STATS.m3Failed.toFixed(3)} m³</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TAGR_ITEMS.map((it) => (
          <Card key={it.sku} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-slate-900 text-[15px]">{it.name}</div>
                  <Badge tone={it.isPassed ? "done" : "err"}>{it.isPassed ? "Đạt" : "Không đạt"}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge tone="default">{it.productTypeVi}</Badge>
                </div>
              </div>
              <div className="text-right">
                {it.hasSerial ? (
                  <div className="text-[11px] text-slate-600">Serial: <span className="font-bold text-slate-900">{it.serial?.slice(-6)}</span></div>
                ) : (
                  <div className="text-[22px] font-bold text-slate-900">{it.qtyPassed + it.qtyFailed}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11.5px] text-slate-600">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">SKU:</span>
                <span className="font-medium text-slate-800">{it.sku}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">RFID:</span>
                <span className="font-medium text-slate-800">{it.rfid}</span>
              </div>
            </div>

            {!it.isPassed && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-rose-600">
                <div>Đạt: {it.qtyPassed} cái · {it.kgPassed} kg</div>
                <div>Không đạt: {it.qtyFailed} cái · {it.kgFailed} kg</div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <Btn full icon={CheckCircle2} onClick={() => setShowConfirm(true)}>
          Hoàn thành
        </Btn>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowConfirm(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="text-[16px] font-bold text-slate-900 text-center">Xác nhận hoàn thành</div>
            <div className="text-[13px] text-slate-600 text-center">Bạn xác nhận đã hoàn thành thực nhập hàng cho lô <b>INB-2026-00118</b>?</div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Btn variant="outline" full onClick={() => setShowConfirm(false)}>Hủy</Btn>
              <Btn full onClick={() => { setShowConfirm(false); goVOffice(); }}>Xác nhận</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}