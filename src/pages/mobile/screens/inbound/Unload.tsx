import { ShieldCheck, Package, Clock, XCircle } from "lucide-react";
import { Badge, Btn, Card, Row, SectionTitle } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";
import { useState } from "react";

/* =============================================================
   SCREEN: 6. UNLOAD - Dỡ hàng (Block format)
   - Có serial → qty = 1, không hiển thị số lượng
   - Vật tư → qty > 1 được, không có serial
============================================================ */
type UnloadItem = {
  serial?: string;
  sku: string;
  name: string;
  rfid: string;
  productType: string;
  productTypeVi: string;
  qty: number;
  hasSerial: boolean;
};

const ITEMS: UnloadItem[] = [
  { serial: "SN-2026-0012345", sku: "SP-A001", name: "Galaxy A15 128GB", rfid: "RFID-0001-A1", productType: "Điện thoại", productTypeVi: "Điện thoại", qty: 1, hasSerial: true },
  { serial: "SN-2026-0012346", sku: "SP-A002", name: "Galaxy A25 256GB", rfid: "RFID-0002-A1", productType: "Điện thoại", productTypeVi: "Điện thoại", qty: 1, hasSerial: true },
  { serial: "SN-2026-0012347", sku: "SP-A003", name: "Tai nghe Buds Pro", rfid: "RFID-0003-B2", productType: "Phụ kiện", productTypeVi: "Phụ kiện", qty: 1, hasSerial: true },
  { sku: "SP-A004", name: "Cáp sạc USB-C 1m", rfid: "RFID-0004-C3", productType: "Vật tư", productTypeVi: "Vật tư", qty: 50, hasSerial: false },
  { sku: "SP-A005", name: "Ống lót máy", rfid: "RFID-0005-D4", productType: "Vật tư", productTypeVi: "Vật tư", qty: 120, hasSerial: false },
  { sku: "SP-A006", name: "Keo dán chuyên dụng", rfid: "RFID-0006-E5", productType: "Vật tư", productTypeVi: "Vật tư", qty: 35, hasSerial: false },
];

export function ScreenUnload({ back }: { back: () => void }) {
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");
  const totalQty = ITEMS.reduce((s, i) => s + i.qty, 0);
  const serialCount = ITEMS.filter((i) => i.hasSerial).length;
  const materialCount = ITEMS.filter((i) => i.productTypeVi === "Vật tư").length;

  const handleExtend = () => {
    setShowExtendModal(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar
        brand
        title="Dỡ hàng"
        sub="Dock A2 · TSK-9921 · INB-2026-00118"
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
          <Row k="Order" v="INB-2026-00118" />
          <Row k="Dock" v="Dock A2 · Khu nhận" />
          <Row k="NCC" v="Ericsson Vietnam · NCC-0991" />
          <Row k="Tổng dòng hàng" v={`${ITEMS.length} dòng · ${totalQty.toLocaleString()} cái`} />
          <div className="mt-3 flex gap-2">
            <Badge tone="info">{serialCount} Serial</Badge>
            <Badge tone="default">{materialCount} Vật tư</Badge>
          </div>
        </Card>

        <SectionTitle title="Danh sách hàng hóa cần dỡ" icon={Package} />
        <div className="space-y-2.5">
          {ITEMS.map((it, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-[15px]">{it.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge tone="default">{it.productTypeVi}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  {it.hasSerial ? (
                    <div className="bg-brand/10 text-brand px-2 py-1 rounded-lg">
                      <div className="text-[10px] font-medium">Serial</div>
                      <div className="text-[11px] font-bold">{it.serial?.slice(-6)}</div>
                    </div>
                  ) : (
                    <div className="text-[22px] font-bold text-slate-900">{it.qty}</div>
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
            </Card>
          ))}
        </div>
      </div>
      <BottomActionBar />

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