import { AlertTriangle, CheckCircle2, MapPin, Navigation2, QrCode, ScanLine } from "lucide-react";
import { Badge, Btn, Card, SectionTitle } from "../../components/ui";
import { BottomActionBar, ExtendTimerBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 14. PUTAWAY - Cất hàng
============================================================ */
export function ScreenPutaway({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <ExtendTimerBar />
      <TopBar brand title="Putaway · Cất hàng" sub="16 HU · Khu G" onBack={back} />
      <div className="px-4 mt-3">
        <Card className="p-3 flex items-center gap-2">
          <div className="flex-1 h-12 rounded-xl bg-slate-900 text-white flex items-center px-3 gap-2">
            <ScanLine className="w-5 h-5 text-emerald-400" />
            <input placeholder="Scan mã HU hoặc Bin..." className="flex-1 bg-transparent text-[14px] focus:outline-none placeholder:text-slate-400" />
          </div>
          <button className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center"><QrCode className="w-5 h-5" /></button>
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SectionTitle title="Mini map · Khu G" icon={MapPin} />
        <Card className="p-3">
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 32 }).map((_, i) => {
              const t = i === 12 ? "ai" : i === 18 ? "real" : i % 7 === 0 ? "full" : i % 5 === 0 ? "doing" : "free";
              const c = { ai: "bg-indigo-400 text-white", real: "bg-brand text-white ring-2 ring-brand-dark", full: "bg-rose-300", doing: "bg-orange-300", free: "bg-emerald-100 border border-emerald-200" }[t];
              return <div key={i} className={`aspect-square rounded text-[8px] font-bold flex items-center justify-center ${c}`}>{t === "ai" ? "AI" : t === "real" ? "✓" : ""}</div>;
            })}
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-600 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-200 rounded" /> Trống</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-400 rounded" /> AI gợi ý</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand rounded" /> Thực tế</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-300 rounded" /> Đầy</span>
          </div>
        </Card>

        <SectionTitle title="HU cần cất (16)" icon={QrCode} />
        <Card className="divide-y divide-slate-100">
          {[
            { hu: "HU-2026-9921-01", sku: "SP-A001", qty: 50, ai: "G04-B02-T03", real: "G04-B02-T03", st: "done" as const },
            { hu: "HU-2026-9921-02", sku: "SP-A001", qty: 50, ai: "G04-B02-T04", real: "G04-B02-T04", st: "done" as const },
            { hu: "HU-2026-9921-03", sku: "SP-A001", qty: 50, ai: "G04-B03-T01", real: "G04-B05-T02", st: "warn" as const, override: true },
            { hu: "HU-2026-9921-04", sku: "SP-A001", qty: 50, ai: "G04-B03-T02", real: "—", st: "idle" as const },
          ].map((h) => (
            <div key={h.hu} className="p-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-[13.5px]">{h.hu}</div>
                <Badge tone={h.st}>{h.st === "done" ? "Đã cất" : h.st === "warn" ? "Override" : "Chờ"}</Badge>
              </div>
              <div className="text-[12px] text-slate-500">{h.sku} · {h.qty} cái</div>
              <div className="mt-1.5 grid grid-cols-2 gap-2 text-[12px]">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1.5">
                  <div className="text-[10px] text-indigo-600 font-semibold">AI gợi ý</div>
                  <div className="font-bold text-indigo-900">{h.ai}</div>
                </div>
                <div className={`rounded-lg px-2 py-1.5 border ${h.override ? "bg-orange-50 border-orange-200" : "bg-emerald-50 border-emerald-200"}`}>
                  <div className={`text-[10px] font-semibold ${h.override ? "text-orange-700" : "text-emerald-700"}`}>Thực tế</div>
                  <div className={`font-bold ${h.override ? "text-orange-800" : "text-emerald-800"}`}>{h.real}</div>
                </div>
              </div>
              {h.override && <div className="mt-1.5 text-[11px] text-orange-700 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Override · lý do: bin G04-B03 đầy</div>}
            </div>
          ))}
        </Card>
      </div>
      <BottomActionBar
        primary={{ label: "Hoàn thành Putaway", icon: CheckCircle2, onClick: back }}
      />
    </div>
  );
}