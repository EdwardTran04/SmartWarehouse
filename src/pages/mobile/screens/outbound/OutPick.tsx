import { useState } from "react";
import { MapPin, Minus, Plus, QrCode } from "lucide-react";
import { Badge, Btn, Card, SectionTitle } from "../../components/ui";
import { BottomActionBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";
import { CheckCircle2 } from "lucide-react";

/* =============================================================
   OUTBOUND SCREEN: O2. OutPick - Picking hàng
============================================================ */
export function ScreenOutPick({ back }: { back: () => void }) {
  const [items, setItems] = useState([
    { sku: "SP-A001", name: "Galaxy A15 128GB", loc: "A-03-02", req: 80, done: 45 },
    { sku: "SP-A002", name: "Galaxy A25 256GB", loc: "A-05-11", req: 60, done: 60 },
    { sku: "SP-A003", name: "Tai nghe Buds Pro", loc: "B-11-05", req: 100, done: 0 },
  ]);
  const change = (i: number, d: number) => setItems((xs) => xs.map((x, idx) => idx === i ? { ...x, done: Math.max(0, Math.min(x.req, x.done + d)) } : x));
  const totalDone = items.reduce((s, x) => s + x.done, 0);
  const totalReq = items.reduce((s, x) => s + x.req, 0);
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="Picking hàng" sub="OUT-2026-00452 · Task OTSK-5535" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[13px] text-slate-500">Tiến độ picking</div>
            <div className="text-[15px] font-bold text-slate-900 tabular-nums">{totalDone}/{totalReq}</div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand" style={{ width: `${Math.round(totalDone / totalReq * 100)}%` }} />
          </div>
        </Card>

        <SectionTitle title="Danh sách picking" icon={ListChecks} />
        {items.map((it, i) => {
          const full = it.done >= it.req;
          return (
            <Card key={it.sku} className={`p-3 ${full ? "border-emerald-200 bg-emerald-50/40" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-900 text-[14px]">{it.sku}</div>
                  <div className="text-[12px] text-slate-500">{it.name}</div>
                </div>
                {full ? <Badge tone="done">Đủ</Badge> : <Badge tone="doing">Đang lấy</Badge>}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-600 mb-2">
                <MapPin className="w-3.5 h-3.5" /> <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{it.loc}</span>
                <button className="ml-auto inline-flex items-center gap-1 text-brand font-semibold"><QrCode className="w-3.5 h-3.5" /> Quét</button>
              </div>
              <div className="flex items-center gap-2">
                <Btn variant="outline" size="sm" icon={Minus} onClick={() => change(i, -1)}>{null as any}</Btn>
                <div className="flex-1 text-center font-bold text-[15px] tabular-nums">{it.done} / {it.req}</div>
                <Btn variant="outline" size="sm" icon={Plus} onClick={() => change(i, 1)}>{null as any}</Btn>
              </div>
            </Card>
          );
        })}
      </div>
      <BottomActionBar primary={{ label: "Hoàn tất picking", icon: CheckCircle2, onClick: back }} />
    </div>
  );
}

function ListChecks({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>;
}