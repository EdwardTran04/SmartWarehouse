import { Camera, PenLine, ScanLine } from "lucide-react";
import { Btn } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SYSTEM SCREEN: Scan
============================================================ */
export function ScreenScan({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 text-white">
      <TopBar title="Scan mã" sub="Barcode · QR · RFID" onBack={back} />
      <div className="flex-1 relative overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-brand rounded-2xl relative">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-brand animate-pulse" />
            {["tl", "tr", "bl", "br"].map((p) => (
              <div key={p} className={`absolute w-6 h-6 border-brand ${p[0] === "t" ? "top-0 border-t-4" : "bottom-0 border-b-4"} ${p[1] === "l" ? "left-0 border-l-4" : "right-0 border-r-4"}`} />
            ))}
          </div>
        </div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-[12px]">
          Đưa mã vào khung để quét
        </div>
        <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2">
          {["HU", "Bin", "SKU", "Serial"].map((t, i) => (
            <button key={t} className={`h-9 px-4 rounded-full text-[12.5px] font-semibold ${i === 0 ? "bg-brand text-white" : "bg-white/15 backdrop-blur text-white"}`}>{t}</button>
          ))}
        </div>
        <div className="absolute bottom-6 left-4 right-4 flex items-center gap-2">
          <Btn variant="outline" icon={PenLine} full>Nhập tay</Btn>
          <button className="w-14 h-14 rounded-full bg-brand flex items-center justify-center"><ScanLine className="w-7 h-7" /></button>
          <Btn variant="outline" icon={Camera} full>Đèn flash</Btn>
        </div>
      </div>
    </div>
  );
}