import AppShell from "@/components/AppShell";
import { Btn, PageTitle } from "@/components/ui-bits";
import { Download, Printer, Flame, AlertTriangle, DoorOpen } from "lucide-react";

function QRBlock({ code }: { code: string }) {
  return (
    <div className="w-32 h-32 bg-white p-2 rounded-md border-2 border-navy grid grid-cols-10 grid-rows-10 gap-px">
      {Array.from({ length: 100 }).map((_, i) => {
        const seed = (i * 9301 + code.charCodeAt(i % code.length) * 49297) % 233280;
        return <div key={i} className={seed / 233280 > 0.45 ? "bg-navy" : "bg-white"} />;
      })}
    </div>
  );
}

export default function Visualization() {
  return (
    <AppShell breadcrumb={[{ label: "Tiện ích" }, { label: "Biển bảng & Sơ đồ" }]}>
      <PageTitle title="Preview biển bảng & QR" subtitle="Xem trước biển dán, QR location và sơ đồ kho 1200×800mm"
        actions={<><Btn variant="outline" icon={Download}>Tải PDF</Btn><Btn icon={Printer}>In hàng loạt</Btn></>} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Biển QR location */}
        <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">QR Code Location</div>
          <div className="bg-white border-2 border-navy rounded-lg p-4 flex flex-col items-center" style={{ fontFamily: "Arial, sans-serif" }}>
            <QRBlock code="G01-T01-K01" />
            <div className="mt-3 text-2xl font-bold" style={{ color: "hsl(var(--destructive))" }}>G01-T01-K01</div>
            <div className="text-xs text-foreground">Kho HN01 · Rack hạng nặng</div>
            <div className="text-[10px] mt-1 text-muted-foreground">RFID: TAG-G01T01K01</div>
          </div>
        </div>

        {/* Biển đầu dãy giá kệ */}
        <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Biển đầu dãy giá kệ</div>
          <div className="bg-white border-4 border-navy rounded-lg p-5 text-center" style={{ fontFamily: "Arial, sans-serif" }}>
            <div className="text-[10px] tracking-widest text-foreground">DÃY GIÁ KỆ HẠNG NẶNG</div>
            <div className="text-6xl font-black my-2" style={{ color: "hsl(var(--destructive))" }}>G01</div>
            <div className="text-sm text-foreground">5 tầng · 20 khoang/tầng</div>
            <div className="mt-3 inline-block px-3 py-1 bg-navy text-white text-xs font-bold rounded">Tải trọng tối đa: 3000kg/tầng</div>
            <div className="mt-2 flex justify-center"><QRBlock code="G01" /></div>
          </div>
        </div>

        {/* Biển dãy pallet */}
        <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Biển dãy Pallet / Thùng gỗ</div>
          <div className="bg-white border-4 border-navy rounded-lg p-5 text-center" style={{ fontFamily: "Arial, sans-serif" }}>
            <div className="text-[10px] tracking-widest text-foreground">KHU PALLET PL1</div>
            <div className="text-6xl font-black my-2" style={{ color: "hsl(var(--destructive))" }}>J01</div>
            <div className="text-sm text-foreground">800×1200mm · 3 tầng</div>
            <div className="mt-3 inline-block px-3 py-1 bg-warning text-warning-foreground text-xs font-bold rounded">⚠ Tối đa 1000kg/pallet</div>
            <div className="mt-2 flex justify-center"><QRBlock code="J01" /></div>
          </div>
        </div>
      </div>

      {/* Sơ đồ kho 1200x800 */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-navy">Sơ đồ kho HN01 — Tỷ lệ 1200×800mm</h3>
          <span className="text-xs text-muted-foreground">Vạch vàng phản quang · Biển PCCC bắt buộc</span>
        </div>
        <div className="relative rounded-lg p-4 border-2 border-navy" style={{ background: "repeating-linear-gradient(45deg, hsl(var(--muted)), hsl(var(--muted)) 8px, hsl(var(--background)) 8px, hsl(var(--background)) 16px)" }}>
          <div className="grid grid-cols-12 gap-1.5 h-80">
            <div className="col-span-2 row-span-2 bg-info/20 border-2 border-info rounded flex flex-col items-center justify-center text-xs font-bold text-info">
              <DoorOpen className="w-5 h-5" />A01<br/>Cửa N/X
            </div>
            <div className="col-span-2 row-span-2 bg-warning/20 border-2 border-warning rounded flex items-center justify-center text-xs font-bold text-warning">B01 — Khu chờ</div>
            <div className="col-span-5 row-span-2 bg-primary/15 border-2 border-primary rounded flex items-center justify-center text-sm font-bold text-primary">G01 — Giá kệ hạng nặng (5 tầng × 20 khoang)</div>
            <div className="col-span-3 row-span-2 bg-success/15 border-2 border-success rounded flex items-center justify-center text-xs font-bold text-success">J01 — Pallet PL1</div>

            {/* Đường giao thông with yellow dashes */}
            <div className="col-span-12 h-3 rounded text-[9px] text-navy text-center font-bold flex items-center justify-center"
              style={{ background: "repeating-linear-gradient(90deg, hsl(45 100% 51%), hsl(45 100% 51%) 14px, hsl(var(--navy)) 14px, hsl(var(--navy)) 22px)" }}>
              <span className="bg-white/90 px-2 rounded">N01 → Đường giao thông 2 chiều 2500mm</span>
            </div>

            <div className="col-span-7 row-span-2 bg-destructive/10 border-2 border-destructive rounded flex items-center justify-center text-xs font-bold text-destructive">
              M01 — Hàng quá khổ (xe cẩu, an toàn 500mm)
            </div>
            <div className="col-span-3 row-span-2 bg-muted border-2 border-border rounded flex items-center justify-center text-xs font-bold text-muted-foreground">K01 — Thùng gỗ TN1</div>
            <div className="col-span-2 row-span-2 bg-secondary border-2 border-border rounded flex items-center justify-center text-xs font-bold">D01 — Dự phòng</div>

            {/* PCCC stripe */}
            <div className="col-span-12 h-4 rounded flex items-center justify-center gap-2 text-[10px] text-white font-bold"
              style={{ background: "repeating-linear-gradient(135deg, hsl(var(--destructive)), hsl(var(--destructive)) 8px, hsl(0 0% 100%) 8px, hsl(0 0% 100%) 16px)" }}>
              <span className="bg-destructive px-2 py-0.5 rounded inline-flex items-center gap-1"><Flame className="w-3 h-3" />PCCC01 — 700mm — Cấm lửa, lối thoát hiểm</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs">
          {[
            { c: "bg-info", l: "Cửa N/X" }, { c: "bg-warning", l: "Khu chờ" },
            { c: "bg-primary", l: "Giá kệ" }, { c: "bg-success", l: "Pallet" },
            { c: "bg-muted-foreground", l: "Thùng gỗ" }, { c: "bg-destructive", l: "Hàng quá khổ / PCCC" },
            { c: "bg-yellow-400", l: "Vạch vàng phản quang" }, { c: "bg-secondary border", l: "Dự phòng" },
          ].map(x => (
            <div key={x.l} className="flex items-center gap-2"><span className={`w-4 h-4 rounded ${x.c}`} /><span className="text-muted-foreground">{x.l}</span></div>
          ))}
        </div>
      </div>

      {/* Icon set */}
      <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="font-semibold text-navy mb-3">Bộ icon cảnh báo & PCCC</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { I: Flame, l: "PCCC", cls: "bg-destructive/10 border-destructive/20 text-destructive" },
            { I: AlertTriangle, l: "Cảnh báo", cls: "bg-warning/10 border-warning/20 text-warning" },
            { I: DoorOpen, l: "Lối thoát hiểm", cls: "bg-success/10 border-success/20 text-success" },
            { I: Flame, l: "Cấm lửa", cls: "bg-destructive/10 border-destructive/20 text-destructive" },
            { I: AlertTriangle, l: "Hàng dễ vỡ", cls: "bg-warning/10 border-warning/20 text-warning" },
            { I: AlertTriangle, l: "Quá khổ", cls: "bg-info/10 border-info/20 text-info" },
          ].map((x, i) => (
            <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-lg border ${x.cls}`}>
              <x.I className="w-8 h-8" />
              <div className="text-xs mt-2 font-medium text-foreground">{x.l}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
