import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Camera } from "lucide-react";
import { Btn } from "./ui";

/* =============================================================
   BOTTOM ACTION BAR & MODAL
   - Nút "Gia hạn thời gian" nằm trên header (dùng ExtendTimerBar riêng)
   - Bottom bar: 1 button full-width nếu đứng một mình
   - Nếu có thêm reject → chia đôi hàng
   ============================================================= */

/**
 * ExtendTimerBar - Thanh gia hạn thời gian, đặt TRÊN TopBar header
 * Dùng trong các screen có KPI timer (Task, Unload, Check, Putaway, etc.)
 */
export function ExtendTimerBar() {
  const [sheet, setSheet] = useState(false);
  const [mins, setMins] = useState(30);
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const close = () => { setSheet(false); setMins(30); setReason(""); setFiles([]); };
  const submit = () => { close(); };

  return (
    <>
      <button
        onClick={() => setSheet(true)}
        className="shrink-0 relative z-10 flex items-center justify-center gap-2 h-9 px-4 bg-amber-50 border-b border-amber-200 text-amber-800 text-[12.5px] font-semibold w-full active:bg-amber-100 transition-colors"
      >
        <Clock className="w-3.5 h-3.5" /> Gia hạn thời gian
      </button>

      {sheet && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={close}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">Gia hạn thời gian</div>
              <button onClick={close} className="text-slate-400"><XCircle className="w-5 h-5" /></button>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Thời gian gia hạn (phút)</div>
              <input type="number" min={5} step={5} value={mins} onChange={(e) => setMins(+e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Lý do (bắt buộc)</div>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-20 p-2 rounded-lg border border-slate-300 text-sm" placeholder="Nhập lý do gia hạn..." />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Bằng chứng đính kèm (tuỳ chọn)</div>
              <label className="flex items-center gap-2 h-10 px-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm cursor-pointer">
                <Camera className="w-4 h-4 text-slate-500" />
                <span className="text-slate-500">Chụp ảnh / chọn file</span>
                <input type="file" multiple capture="environment" className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []).map(f => f.name))} />
              </label>
              {files.length > 0 && (
                <ul className="text-xs text-slate-500 mt-2 space-y-1">
                  {files.map((f, i) => <li key={i}>• {f}</li>)}
                </ul>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Btn variant="outline" size="sm" full onClick={close}>Huỷ</Btn>
              <Btn size="sm" full icon={CheckCircle2} onClick={submit}>Ghi nhận</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * BottomActionBar - Thanh hành động cuối màn hình
 * @param primary - { label, icon, onClick } - Button chính (Xác nhận / Hoàn thành)
 * @param reject  - { label, icon, onClick } - Button từ chối (nếu có → chia đôi hàng)
 */
export function BottomActionBar({ primary, reject }: {
  primary?: { label?: string; icon?: any; onClick?: () => void };
  reject?: { label?: string; icon?: any; onClick?: () => void };
}) {
  const onPrimary = primary?.onClick;
  const PrimaryIcon = primary?.icon || CheckCircle2;
  const primaryLabel = primary?.label || "Hoàn thành";
  const [sheet, setSheet] = useState<null | "done">(null);

  const close = () => { setSheet(null); };
  const submit = () => { close(); onPrimary?.(); };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.1)]">
        {reject ? (
          /* Có reject → chia đôi */
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="outline" icon={reject.icon || XCircle} full onClick={reject.onClick}>
              {reject.label || "Từ chối"}
            </Btn>
            <Btn icon={PrimaryIcon} full onClick={() => setSheet("done")}>
              {primaryLabel}
            </Btn>
          </div>
        ) : (
          /* Đứng 1 mình → full width 1 hàng */
          <Btn icon={PrimaryIcon} full onClick={() => setSheet("done")}>
            {primaryLabel}
          </Btn>
        )}
      </div>

      {sheet && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={close}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">{primaryLabel}</div>
              <button onClick={close} className="text-slate-400"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="text-sm text-slate-600">Task sẽ chuyển trạng thái <b>{primaryLabel}</b> và gửi tiến độ về WMS.</div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Bằng chứng đính kèm (tuỳ chọn)</div>
              <label className="flex items-center gap-2 h-10 px-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm cursor-pointer">
                <Camera className="w-4 h-4 text-slate-500" />
                <span className="text-slate-500">Chụp ảnh / chọn file</span>
                <input type="file" multiple capture="environment" className="hidden" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Btn variant="outline" size="sm" full onClick={close}>Huỷ</Btn>
              <Btn size="sm" full icon={CheckCircle2} onClick={submit}>{primaryLabel}</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Modal({ title, children, onClose, primary }: any) {
  return (
    <div className="absolute inset-0 z-30 bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-3xl p-5 pb-7 space-y-3 max-h-[80%] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
        <div className="text-[16px] font-bold text-slate-900">{title}</div>
        <div className="space-y-3">{children}</div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Btn variant="outline" full onClick={onClose}>Hủy</Btn>
          <Btn variant={primary.variant === "danger" ? "danger" : "primary"} full onClick={primary.onClick}>{primary.label}</Btn>
        </div>
      </div>
    </div>
  );
}