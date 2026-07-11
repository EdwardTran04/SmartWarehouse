import { useState } from "react";
import { AlertTriangle, CheckCircle2, Package, XCircle } from "lucide-react";
import { Badge, Btn, Card, Field, Row, SectionTitle } from "../../components/ui";
import { Modal } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   OUTBOUND SCREEN: X2. OutConfirm - Xác nhận lệnh xuất
   Block design - Tồn kho + SL order có thể sửa trực tiếp
   Đỏ + cảnh báo khi order > tồn
================================================================ */
type OrderItem = {
  sku: string;
  name: string;
  stock: number;
  orderQty: number;
};

const INITIAL_ITEMS: OrderItem[] = [
  { sku: "SP-A001", name: "Galaxy A15 128GB", stock: 50, orderQty: 80 },
  { sku: "SP-A002", name: "Galaxy A25 256GB", stock: 60, orderQty: 60 },
  { sku: "SP-A003", name: "Tai nghe Buds Pro", stock: 30, orderQty: 100 },
];

export function ScreenOutConfirm({ back }: { back: () => void }) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [items, setItems] = useState(INITIAL_ITEMS);

  const updateOrderQty = (sku: string, newQty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, orderQty: Math.max(0, newQty) } : item
      )
    );
  };

  const hasStockIssue = items.some((i) => i.orderQty > i.stock);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="Xác nhận lệnh xuất" sub="OUT-2026-00452 · 14/05/2026" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 space-y-2 text-[13px]">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[15px] font-bold text-slate-900">OUT-2026-00452</div>
            <Badge tone="warn">Chờ xác nhận</Badge>
          </div>
          <Row k="Loại xuất" v="Xuất bán / Giao khách" />
          <Row k="Đơn vị nhận" v="CH Viettel Hà Đông · KH-1042" />
          <Row k="Kho xuất" v="HN01 · Kho HN" />
          <Row k="Ngày giao dự kiến" v="14/05/2026 · 15:00" />
          <Row k="SLA" v="3 giờ" />
          <Row k="Số dòng" v={`${items.length} dòng · ${items.reduce((s, i) => s + i.orderQty, 0)} cái`} />
          <Row k="Tổng KL / Thể tích" v="184 kg · 1.2 m³" />
        </Card>

        <SectionTitle title="Hàng cần xuất" icon={Package} />
        {items.map((item) => {
          const hasIssue = item.orderQty > item.stock;
          return (
            <Card key={item.sku} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[14px] text-slate-900">{item.sku}</div>
                  <div className="text-[12px] text-slate-500">{item.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">Tồn</div>
                    <div className={`text-[14px] font-semibold ${hasIssue ? "text-rose-600" : "text-slate-700"}`}>
                      {item.stock}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={item.orderQty}
                      onChange={(e) => updateOrderQty(item.sku, parseInt(e.target.value) || 0)}
                      className={`w-20 h-10 px-2 rounded-lg border text-center text-[14px] font-semibold ${
                        hasIssue
                          ? "border-rose-300 bg-rose-50 text-rose-600"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    />
                    {hasIssue && (
                      <AlertTriangle className="absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="outline" icon={XCircle} onClick={() => setShowRejectModal(true)}>
            Từ chối
          </Btn>
          <Btn icon={CheckCircle2} onClick={back}>
            Đồng ý lệnh xuất
          </Btn>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <Modal
          title="Từ chối lệnh xuất"
          onClose={() => setShowRejectModal(false)}
          primary={{
            label: "Gửi từ chối về SAP",
            variant: "danger",
            onClick: () => setShowRejectModal(false),
          }}
        >
          <Field required label="Lý do từ chối">
            <select className="h-11 w-full px-3 rounded-lg border border-slate-200 text-[14px]">
              <option>Thiếu tồn kho</option>
              <option>Sai địa chỉ giao</option>
              <option>Ngoài giờ làm việc</option>
              <option>Khác</option>
            </select>
          </Field>
          <Field label="Mô tả chi tiết">
            <textarea
              rows={3}
              className="w-full p-3 rounded-lg border border-slate-200 text-[14px]"
              placeholder="Nhập mô tả..."
            />
          </Field>
        </Modal>
      )}
    </div>
  );
}