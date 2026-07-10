import { useState } from "react";
import { CheckCircle2, Filter, Package, XCircle } from "lucide-react";
import { Badge, Btn, Card, Field, Row, SectionTitle } from "../../components/ui";
import { BottomActionBar, Modal } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   OUTBOUND SCREEN: O1. OutConfirm - Xác nhận lệnh xuất
============================================================ */
export function ScreenOutConfirm({ back }: { back: () => void }) {
  const [showReject, setShowReject] = useState(false);
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="Xác nhận lệnh xuất" sub="OUT-2026-00452 · 14/05/2026" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 space-y-2 text-[13px]">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[15px] font-bold text-slate-900">OUT-2026-00452</div>
            <Badge tone="info">Chờ xác nhận</Badge>
          </div>
          <Row k="Loại xuất" v="Xuất bán / Giao khách" />
          <Row k="Đơn vị nhận" v="CH Viettel Hà Đông · KH-1042" />
          <Row k="Kho xuất" v="HN01 · Kho HN" />
          <Row k="Tuyến đường" v="HN → Hà Đông" />
          <Row k="Ngày giao" v="14/05/2026 · 15:00" />
          <Row k="SLA" v="3 giờ" />
          <Row k="Số dòng" v="8 dòng · 240 cái" />
          <Row k="Tổng KL / Thể tích" v="184 kg · 1.2 m³" />
        </Card>

        <SectionTitle title="Hàng cần xuất" icon={Package} />
        <Card>
          {[["SP-A001", "Galaxy A15 128GB", 80], ["SP-A002", "Galaxy A25 256GB", 60], ["SP-A003", "Tai nghe Buds Pro", 100]].map(([sku, name, qty]: any) => (
            <div key={sku} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 text-[13px]">
              <div>
                <div className="font-semibold text-slate-900">{sku}</div>
                <div className="text-slate-500 text-[12px]">{name}</div>
              </div>
              <div className="font-bold tabular-nums">{qty}</div>
            </div>
          ))}
        </Card>
      </div>

      <BottomActionBar
        primary={{ label: "Đồng ý lệnh xuất", icon: CheckCircle2, onClick: back }}
        secondary={[{ label: "Từ chối", icon: XCircle, onClick: () => setShowReject(true) }]}
      />

      {showReject && (
        <Modal title="Từ chối lệnh xuất" onClose={() => setShowReject(false)}
          primary={{ label: "Gửi từ chối", variant: "danger", onClick: () => setShowReject(false) }}>
          <Field required label="Lý do từ chối">
            <select className="h-11 w-full px-3 rounded-lg border border-slate-200 text-[14px]">
              <option>Thiếu tồn kho</option>
              <option>Sai địa chỉ giao</option>
              <option>Ngoài giờ làm việc</option>
              <option>Khác</option>
            </select>
          </Field>
          <Field label="Mô tả"><textarea rows={3} className="w-full p-3 rounded-lg border border-slate-200 text-[14px]" /></Field>
        </Modal>
      )}
    </div>
  );
}