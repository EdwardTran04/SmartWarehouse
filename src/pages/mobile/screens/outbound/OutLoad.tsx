import { useState } from "react";
import { Minus, Plus, ClipboardCheck, CheckCircle2, Truck, Package } from "lucide-react";
import { Btn, Card, Row } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   OUTBOUND SCREEN: O5. OutLoad - Load hàng lên xe
   Đưa hàng đã đóng gói từ khu chờ xuất lên xe vận chuyển
================================================================ */
export function ScreenOutLoad({ back }: { back: () => void }) {
  const [loaded, setLoaded] = useState(0);
  const total = 5;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar
        brand
        title="Load hàng lên xe"
        sub="Chuyến TR-0091 · Dock 3"
        onBack={back}
      />

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Vehicle info */}
        <Card className="p-4 space-y-2 text-[13px]">
          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-5 h-5 text-brand" />
            <span className="text-[14px] font-bold text-slate-900">Thông tin xe</span>
          </div>
          <Row k="Biển số xe" v="30H-129.45" />
          <Row k="Tài xế" v="Lê Văn Sơn · 0912.345.678" />
          <Row k="Tải trọng xe" v="2.5 tấn" />
          <Row k="Số pallet" v={`${total} pallet`} />
        </Card>

        {/* Loading progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[13px] text-slate-500">Đã load lên xe</div>
            <div className="text-[15px] font-bold text-slate-900 tabular-nums">
              {loaded}/{total} pallet
            </div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${loaded >= total ? "bg-emerald-500" : "bg-brand"}`}
              style={{ width: `${(loaded / total) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => setLoaded(Math.max(0, loaded - 1))}
              className="h-11 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold flex items-center justify-center gap-2 active:bg-slate-50"
            >
              <Minus className="w-4 h-4" /> Bớt 1
            </button>
            <button
              onClick={() => setLoaded(Math.min(total, loaded + 1))}
              disabled={loaded >= total}
              className={`h-11 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                loaded < total
                  ? "bg-brand text-white shadow-[var(--shadow-brand)] active:scale-[.98]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Plus className="w-4 h-4" /> Load thêm
            </button>
          </div>
        </Card>

        {/* Loaded HU list */}
        <div className="flex items-center gap-2 mt-4 mb-2 px-1">
          <Package className="w-4 h-4 text-brand" />
          <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
            Hàng đã load lên xe
          </h3>
        </div>
        <Card>
          {[
            ["HU-88121", "Thùng 30 · SP-A001 × 40"],
            ["HU-88122", "Thùng 30 · SP-A001 × 40"],
            ["HU-88123", "Thùng 20 · SP-A002 × 30"],
            ["HU-88124", "Thùng 20 · SP-A003 × 50 (chưa load)"],
            ["HU-88125", "Thùng 10 · SP-A004 × 10 (chưa load)"],
          ].map(([hu, desc]: any, i: number) => (
            <div
              key={hu}
              className={`flex items-center gap-3 p-3 border-b border-slate-100 last:border-0 text-[13px] ${
                i < loaded ? "text-slate-900" : "text-slate-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  i < loaded
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <div>
                <span className="font-mono font-semibold">{hu}</span>
                <span className="text-[12px] ml-2">{desc}</span>
              </div>
            </div>
          ))}
        </Card>

        {/* Checklist before leaving */}
        <div className="flex items-center gap-2 mt-4 mb-2 px-1">
          <ClipboardCheck className="w-4 h-4 text-brand" />
          <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
            Kiểm tra trước khi rời kho
          </h3>
        </div>
        <Card>
          {[
            "Đủ số pallet đã ghi trên phiếu",
            "Kẹp chì niêm phong container",
            "Chụp ảnh xe & niêm phong",
            "Ký nhận với tài xế",
          ].map((s, i) => (
            <label
              key={s}
              className="flex items-center gap-3 p-3 border-b border-slate-100 last:border-0 text-[13px]"
            >
              <input
                type="checkbox"
                defaultChecked={i < 2}
                className="w-5 h-5 accent-red-600"
              />
              <span>{s}</span>
            </label>
          ))}
        </Card>
      </div>

      <BottomActionBar
        primary={{ label: "Xác nhận load xong", icon: CheckCircle2, onClick: back }}
      />
    </div>
  );
}