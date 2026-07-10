import { AlertTriangle, Send, ShieldCheck } from "lucide-react";
import { Badge, Btn, Card, Row, SectionTitle } from "../../components/ui";
import { BottomActionBar, ExtendTimerBar } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 10. REJECT - Hàng không đạt
============================================================ */
export function ScreenReject({ back }: { back: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <ExtendTimerBar />
      <TopBar brand title="Xử lý hàng không đạt" sub="2 dòng · 14 cái" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {[
          { sku: "SP-A002", name: "Galaxy A25 256GB", qty: 12, reason: "Móp hộp, bể màn", ncc: "Ericsson Vietnam" },
          { sku: "SP-A003", name: "Tai nghe Buds Pro", qty: 2, reason: "Sai mã, không khớp PO", ncc: "Ericsson Vietnam" },
        ].map((r) => (
          <Card key={r.sku} className="p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[14px]">{r.sku}</div>
                <div className="text-[12px] text-slate-500">{r.name}</div>
              </div>
              <Badge tone="err">{r.qty} cái không đạt</Badge>
            </div>
            <div className="mt-2 text-[12.5px] space-y-1">
              <Row k="Lý do lỗi" v={<span className="text-rose-700">{r.reason}</span>} />
              <Row k="NCC" v={r.ncc} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["Trả hàng", "Cách ly", "Chờ quyết định", "Nhập ngoại lệ"].map((x, i) => (
                <button key={x} className={`h-10 rounded-lg text-[12.5px] font-semibold border ${i === 0 ? "border-brand bg-brand-soft text-brand" : "border-slate-200 bg-white text-slate-700"}`}>{x}</button>
              ))}
            </div>
          </Card>
        ))}

        <Card className="p-3 bg-rose-50 border-rose-200 text-[12px] text-rose-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> Hàng không đạt sẽ KHÔNG chuyển sang thực nhập. Nhập ngoại lệ cần phê duyệt cấp trên.
        </Card>
      </div>
      <BottomActionBar
        primary={{ label: "Tạo task trả hàng", icon: Send, onClick: back }}
      />
    </div>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}