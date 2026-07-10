import { useState } from "react";
import { CheckCircle2, XCircle, Camera, Package, Calendar, Clock } from "lucide-react";
import { Badge, Btn, Card, Field, Row, SectionTitle } from "../../components/ui";
import { Modal } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 4. RECEIVE - Xác nhận lệnh nhập
   Hai button: Xác nhận lệnh / Từ chối
============================================================ */
export function ScreenReceive({ back }: { back: () => void }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [receiveDate, setReceiveDate] = useState("2026-05-14");
  const [receiveTime, setReceiveTime] = useState("09:00");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="Tiếp nhận lệnh nhập" sub="INB-2026-00122 · 14/05/2026" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4 space-y-2 text-[13px]">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[15px] font-bold text-slate-900">INB-2026-00122</div>
            <Badge tone="info">Chờ tiếp nhận</Badge>
          </div>
          <Row k="Loại nhập" v="Nhập từ NCC" />
          <Row k="NCC / Đơn vị giao" v="Ericsson Vietnam · NCC-0991" />
          <Row k="Kho nhận" v="HN01 · Kho HN" />
          <Row k="Ngày dự kiến" v="14/05/2026 · 09:00" />
          <Row k="SLA" v="2 giờ" />
          <Row k="Số dòng hàng" v="12 dòng" />
          <Row k="Tổng SL" v="3.840 cái" />
        </Card>

        <SectionTitle title="Hàng tóm tắt" icon={Package} />
        <Card>
          {[
            ["SP-A001", "Galaxy A15 128GB", 800],
            ["SP-A002", "Galaxy A25 256GB", 600],
            ["SP-A003", "Tai nghe Buds Pro", 1200],
            ["SP-A004", "Củ sạc 25W", 1240],
          ].map(([sku, name, qty]: any) => (
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

      {/* Bottom Action Bar - 2 buttons side by side */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="outline" icon={XCircle} onClick={() => setShowRejectModal(true)}>
            Từ chối
          </Btn>
          <Btn icon={CheckCircle2} onClick={() => setShowConfirmModal(true)}>
            Xác nhận lệnh
          </Btn>
        </div>
      </div>

      {/* Confirm Modal - Ngày giờ nhận hàng */}
      {showConfirmModal && (
        <Modal
          title="Xác nhận ngày giờ nhận hàng"
          onClose={() => setShowConfirmModal(false)}
          primary={{
            label: "Xác nhận",
            variant: "primary",
            onClick: () => {
              setShowConfirmModal(false);
              back();
            },
          }}
        >
          <div className="space-y-4">
            <div className="text-[13px] text-slate-600">
              Vui lòng xác nhận hoặc chỉnh sửa <b>ngày giờ dự kiến nhận hàng</b> cho lệnh <b>INB-2026-00122</b>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field required label="Ngày nhận hàng">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={receiveDate}
                    onChange={(e) => setReceiveDate(e.target.value)}
                    className="h-11 w-full pl-10 pr-3 rounded-lg border border-slate-200 text-[14px]"
                  />
                </div>
              </Field>
              <Field required label="Giờ nhận hàng">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={receiveTime}
                    onChange={(e) => setReceiveTime(e.target.value)}
                    className="h-11 w-full pl-10 pr-3 rounded-lg border border-slate-200 text-[14px]"
                  />
                </div>
              </Field>
            </div>
            <Card className="p-3 bg-slate-50">
              <div className="text-[12px] text-slate-500">Ngày giờ hiện tại</div>
              <div className="text-[14px] font-semibold text-slate-800">14/05/2026 · 09:00</div>
            </Card>
          </div>
        </Modal>
      )}

      {/* Reject Modal - Lý do từ chối */}
      {showRejectModal && (
        <Modal
          title="Từ chối lệnh nhập"
          onClose={() => setShowRejectModal(false)}
          primary={{
            label: "Gửi từ chối về SAP",
            variant: "danger",
            onClick: () => setShowRejectModal(false),
          }}
        >
          <Field required label="Lý do từ chối">
            <select className="h-11 w-full px-3 rounded-lg border border-slate-200 text-[14px]">
              <option>Sai NCC / sai kho nhận</option>
              <option>Trùng lệnh</option>
              <option>Quá tải kho</option>
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
          <Field label="Ảnh / file đính kèm">
            <button className="w-full h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 text-[12px]">
              <Camera className="w-5 h-5 mb-1" /> Thêm ảnh
            </button>
          </Field>
        </Modal>
      )}
    </div>
  );
}