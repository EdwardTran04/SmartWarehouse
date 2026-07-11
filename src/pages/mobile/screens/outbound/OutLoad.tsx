import { useState } from "react";
import { Camera, CheckCircle2, Truck, Package, Minus, Plus } from "lucide-react";
import { Btn, Card, Row } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   OUTBOUND SCREEN: O5. OutLoad - Load hàng lên xe
   - Thiết kế giống màn putaway (cất hàng)
   - Thông tin xe: Tải trọng & Số pallet gộp trên 1 hàng
   - Block sản phẩm: Loại thùng & mã RFID, bỏ vị trí lưu trữ
   - Modal chụp ảnh hoàn thành
================================================================ */
type LoadItem = {
  hu: string;
  sku: string;
  name: string;
  boxType: string;
  rfid: string;
  status: "pending" | "loaded";
};

const INITIAL_ITEMS: LoadItem[] = [
  { hu: "HU-88121", sku: "SP-A001", name: "Galaxy A15 128GB", boxType: "Thùng 30", rfid: "RFID-LOAD-01", status: "loaded" },
  { hu: "HU-88122", sku: "SP-A001", name: "Galaxy A15 128GB", boxType: "Thùng 30", rfid: "RFID-LOAD-02", status: "loaded" },
  { hu: "HU-88123", sku: "SP-A002", name: "Galaxy A25 256GB", boxType: "Thùng 20", rfid: "RFID-LOAD-03", status: "loaded" },
  { hu: "HU-88124", sku: "SP-A003", name: "Tai nghe Buds Pro", boxType: "Thùng 20", rfid: "RFID-LOAD-04", status: "pending" },
  { hu: "HU-88125", sku: "SP-A004", name: "Cáp sạc USB-C 1m", boxType: "Thùng 10", rfid: "RFID-LOAD-05", status: "pending" },
];

export function ScreenOutLoad({ back }: { back: () => void }) {
  const [items, setItems] = useState<LoadItem[]>(INITIAL_ITEMS);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const toggleLoad = (index: number) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, status: it.status === "loaded" ? "pending" : "loaded" } : it
      )
    );
  };

  const handleComplete = () => {
    setShowPhotoModal(true);
  };

  const handleConfirmPhoto = () => {
    setShowPhotoModal(false);
    back();
  };

  const loadedCount = items.filter((it) => it.status === "loaded").length;
  const totalCount = items.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar
        brand
        title="Load hàng lên xe"
        sub="Chuyến TR-0091 · Dock 3"
        onBack={back}
      />

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-3.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Vehicle Info Card */}
        <Card className="p-4 space-y-2.5 text-[13px]">
          <div className="flex items-center gap-2 mb-1 border-b border-slate-100 pb-2">
            <Truck className="w-5 h-5 text-brand" />
            <span className="text-[14px] font-bold text-slate-900">Thông tin xe vận chuyển</span>
          </div>
          <Row k="Biển số xe" v="30H-129.45" />
          <Row k="Tài xế" v="Lê Văn Sơn · 0912.345.678" />
          {/* Combined vehicle weight capacity and pallet count on a single row */}
          <Row k="Tải trọng / Số pallet" v={`2.5 tấn / ${totalCount} pallet`} />
        </Card>

        {/* Product Items Title */}
        <div className="flex items-center gap-2 mt-4 mb-2 px-1 shrink-0">
          <Package className="w-4 h-4 text-brand" />
          <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
            Danh sách thùng hàng (HU)
          </h3>
        </div>

        {/* Product Cards (similar to Putaway layout but without location) */}
        <div className="space-y-3">
          {items.map((it, idx) => (
            <Card key={it.hu} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-[15px]">{it.hu}</div>
                  <div className="text-[12px] text-slate-600 mt-0.5">{it.name}</div>
                </div>
              </div>

              {/* Grid with Box Type and RFID (no location field) */}
              <div className="grid grid-cols-2 gap-2 text-[11.5px] text-slate-600 mt-3 border-t border-slate-100 pt-2.5">
                <div>
                  <div className="text-slate-500 mb-1 font-semibold">Loại thùng</div>
                  <div className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50 flex items-center text-slate-700 font-semibold">
                    {it.boxType}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1 font-semibold">Mã RFID</div>
                  <div className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50 flex items-center text-slate-700 font-mono font-semibold">
                    {it.rfid}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Complete button under footer */}
      <div className="shrink-0 bg-white border-t border-slate-200 p-3 pb-4">
        <Btn full icon={CheckCircle2} onClick={handleComplete}>
          Hoàn thành
        </Btn>
      </div>

      {/* Photo Confirmation Modal */}
      {showPhotoModal && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end justify-center rounded-[36px]" onClick={() => setShowPhotoModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="text-[16px] font-bold text-slate-900 text-center">Chụp ảnh xác nhận</div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                <Camera className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-[13px] text-slate-500 text-center">
                Vui lòng chụp ảnh xe và niêm phong sau khi load hàng để xác nhận hoàn thành
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Btn variant="outline" full onClick={() => setShowPhotoModal(false)}>Hủy</Btn>
              <Btn full onClick={handleConfirmPhoto}>Xác nhận</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}