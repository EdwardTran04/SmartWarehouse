import { useState } from "react";
import { Camera, CheckCircle2, Clock, ScanLine, XCircle } from "lucide-react";
import { Badge, Btn, Card, Field, Row } from "../../components/ui";
import { Modal } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 7. CHECK - Kiểm hàng theo PO
   Block design similar to Unload screen
============================================================ */
type LineItem = {
  id: string;
  sku: string;
  name: string;
  rfid: string;
  productType: string;
  productTypeVi: string;
  hasSerial: boolean;
  serial?: string;
  docQty: number;
  realQty: number;
};

const MOCK_ITEMS: LineItem[] = [
  { id: "L1", sku: "SP-A001", name: "Galaxy A15 128GB", rfid: "RFID-0001-A1", productType: "Điện thoại", productTypeVi: "Điện thoại", hasSerial: true, serial: "SN-2026-0012345", docQty: 1, realQty: 1 },
  { id: "L2", sku: "SP-A002", name: "Galaxy A25 256GB", rfid: "RFID-0002-A1", productType: "Điện thoại", productTypeVi: "Điện thoại", hasSerial: true, serial: "SN-2026-0012346", docQty: 1, realQty: 1 },
  { id: "L3", sku: "SP-A003", name: "Tai nghe Buds Pro", rfid: "RFID-0003-B2", productType: "Phụ kiện", productTypeVi: "Phụ kiện", hasSerial: true, serial: "SN-2026-0012347", docQty: 1, realQty: 1 },
  { id: "L4", sku: "SP-A004", name: "Cáp sạc USB-C 1m", rfid: "RFID-0004-C3", productType: "Vật tư", productTypeVi: "Vật tư", hasSerial: false, docQty: 50, realQty: 50 },
  { id: "L5", sku: "SP-A005", name: "Ống lót máy", rfid: "RFID-0005-D4", productType: "Vật tư", productTypeVi: "Vật tư", hasSerial: false, docQty: 120, realQty: 120 },
  { id: "L6", sku: "SP-A006", name: "Keo dán chuyên dụng", rfid: "RFID-0006-E5", productType: "Vật tư", productTypeVi: "Vật tư", hasSerial: false, docQty: 35, realQty: 35 },
];

export function ScreenCheck({ back, goHome }: { back: () => void; goHome: () => void }) {
  const [items] = useState<LineItem[]>(MOCK_ITEMS);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"accept" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [scanInput, setScanInput] = useState("");
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");

  const totalItems = items.length;
  const isAllMatched = items.every((it) => it.realQty === it.docQty);

  const handleConfirm = () => {
    if (confirmAction === "reject" && !rejectReason.trim()) return;
    setShowConfirmModal(false);
    if (confirmAction === "accept") {
      goHome();
    } else {
      setConfirmAction(null);
      setRejectReason("");
      back();
    }
  };

  const handleExtend = () => {
    setShowExtendModal(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar
        brand
        title="Kiểm hàng theo PO"
        sub="PO-2026-00118 · 6 dòng"
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

      <div className="px-4 mt-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-12 rounded-xl bg-slate-900 text-white flex items-center px-3 gap-2">
              <ScanLine className="w-5 h-5 text-emerald-400" />
              <input
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setScanInput("")}
                placeholder="Quét serial/IMEI..."
                className="flex-1 bg-transparent text-[14px] focus:outline-none placeholder:text-slate-400 uppercase"
              />
            </div>
            <button className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Quét barcode/RFID hoặc nhập serial thủ công.
          </div>
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((it) => (
          <Card key={it.id} className="p-4">
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
                  <div className="text-[22px] font-bold text-slate-900">{it.docQty}</div>
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

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="outline" icon={XCircle} onClick={() => { setConfirmAction("reject"); setShowConfirmModal(true); }}>
            Từ chối
          </Btn>
          <Btn icon={CheckCircle2} onClick={() => { setConfirmAction("accept"); setShowConfirmModal(true); }}>
            Nhận hàng
          </Btn>
        </div>
      </div>

      {showConfirmModal && (
        <Modal
          title={confirmAction === "accept" ? "Xác nhận nhận hàng" : "Xác nhận từ chối"}
          onClose={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
            setRejectReason("");
          }}
          primary={{
            label: confirmAction === "accept" ? "Xác nhận nhận hàng" : "Xác nhận từ chối",
            variant: confirmAction === "reject" ? "danger" : "primary",
            onClick: handleConfirm,
            disabled: confirmAction === "reject" && !rejectReason.trim(),
          }}
        >
          <div className="space-y-4">
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isAllMatched ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}>
              {isAllMatched ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-[14px] font-semibold text-emerald-700">Đủ hàng theo chứng từ</span>
                </>
              ) : (
                <>
                  <span className="text-[14px] font-semibold text-rose-700">Thiếu hàng so với chứng từ</span>
                </>
              )}
            </div>

            {confirmAction === "reject" && (
              <Field required label="Lý do từ chối">
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="h-11 w-full px-3 rounded-lg border border-slate-200 text-[14px]"
                >
                  <option value="">-- Chọn lý do --</option>
                  <option value="Hàng lỗi">Hàng lỗi, không sử dụng được</option>
                  <option value="Sai hàng">Sai hàng so với đơn đặt</option>
                  <option value="Không đủ số lượng">Không đủ số lượng theo chứng từ</option>
                  <option value="Khác">Lý do khác</option>
                </select>
              </Field>
            )}

            {!isAllMatched && confirmAction === "accept" && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-[12px] text-orange-700">
                <b>Cảnh báo:</b> Lô hàng còn thiếu. Bạn đang xác nhận nhận thiếu.
              </div>
            )}
          </div>
        </Modal>
      )}

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