import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, PenLine, User, XCircle } from "lucide-react";
import { Btn, Card, Field, Input, KpiTimer } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   APPROVE DETAIL SCREEN: Chi tiết lô phê duyệt
============================================================ */
type ApprBatch = {
  id: string; orderId: string; orderType: string; warehouse: string;
  createdAt: string; planFor: string; taskCount: number;
  conflicts: number; status: "pending" | "approved";
};

type ApprTask = {
  id: string; code: string; name: string;
  owner: string; position: string;
  start: string; end: string;
  kpi: string;
  conflict?: string;
};

const ASSIGNEES = ["Trần Văn Kho", "Nguyễn Hữu An", "Mai Thị Lan", "Đỗ Minh Khôi", "Phạm Thị Hằng", "Bùi Quốc Việt", "Lê Hoàng Nam", "Vũ Anh Tuấn"];

export function ScreenApproveDetail({ back, batchId, done }: { back: () => void; batchId: string; done: () => void }) {
  const batch = APPR_BATCHES.find((b) => b.id === batchId) || APPR_BATCHES[0];
  const [tasks, setTasks] = useState<ApprTask[]>([
    { id: "t1", code: "T-CHK", name: "Check lệnh NCC", owner: "Trần Văn Kho", position: "Thủ kho", start: "09:30", end: "09:40", kpi: "≤ 10 phút" },
    { id: "t2", code: "T-APR", name: "Duyệt lịch", owner: "Trần Đăng Khoa", position: "Giám đốc kho", start: "09:40", end: "09:50", kpi: "≤ 10 phút" },
    { id: "t3", code: "T-HO", name: "Kiểm hàng - Ký bàn giao", owner: "Nguyễn Hữu An", position: "NV kiểm hàng", start: "10:00", end: "10:40", kpi: "≤ 40 phút", conflict: "Trùng lịch với TSK-9922 (Kiểm hàng PO-9921) cùng khung giờ." },
    { id: "t4", code: "T-UNL", name: "Dỡ hàng", owner: "Bùi Quốc Việt", position: "Lái xe nâng", start: "10:40", end: "11:10", kpi: "≤ 30 phút" },
    { id: "t5", code: "T-MV1", name: "Đưa vào khu chờ nhập", owner: "Đỗ Minh Khôi", position: "NV kho", start: "11:10", end: "11:25", kpi: "≤ 15 phút" },
    { id: "t6", code: "T-AGR", name: "Thực nhập kho (T-AGR)", owner: "Trần Văn Kho", position: "Thủ kho", start: "11:25", end: "11:40", kpi: "≤ 15 phút" },
    { id: "t7", code: "T-PAC", name: "Đóng gói hàng", owner: "Mai Thị Lan", position: "NV đóng gói", start: "11:40", end: "12:00", kpi: "≤ 20 phút" },
  ]);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const conflictCount = tasks.filter((t) => t.conflict).length;
  const editTask = (id: string, patch: Partial<ApprTask>) => {
    setTasks((arr) => arr.map((t) => {
      if (t.id !== id) return t;
      const next = { ...t, ...patch };
      if (patch.owner || patch.start || patch.end) {
        const overlap = arr.some((o) => o.id !== id && o.owner === (next.owner) && o.start < next.end && o.end > next.start);
        next.conflict = overlap ? `Trùng lịch với ${arr.find((o) => o.id !== id && o.owner === next.owner)?.code || "task"} (cùng nhân sự ${next.owner})` : undefined;
      }
      return next;
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title={batch.id} sub={`${batch.orderId} · ${batch.orderType}`} onBack={back} />
      <div className="px-4 mt-3">
        <Card className="p-3 grid grid-cols-3 gap-2">
          <KpiTimer label="Tổng task" value={String(tasks.length)} tone="info" />
          <KpiTimer label="Cảnh báo" value={String(conflictCount)} tone={conflictCount ? "err" : "done"} />
          <KpiTimer label="Khung giờ" value={batch.planFor.split("·")[1]?.trim() || "—"} tone="doing" />
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 pb-28 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {conflictCount > 0 && (
          <Card className="p-3 border-rose-200 bg-rose-50">
            <div className="flex items-start gap-2 text-[12.5px] text-rose-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div><b>Phát hiện {conflictCount} cảnh báo.</b> Hệ thống đã kiểm tra trùng lịch / chồng chéo. Vui lòng chỉnh sửa trước khi phê duyệt.</div>
            </div>
          </Card>
        )}

        {tasks.map((t) => (
          <Card key={t.id} className={`p-3.5 ${t.conflict ? "border-rose-200" : ""}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-[14px]">{t.code}</span>
                  <span className="text-[12px] text-slate-500">· {t.name}</span>
                </div>
                <div className="text-[12px] text-slate-600 mt-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {t.owner} · <span className="text-slate-500">{t.position}</span></div>
                <div className="text-[12px] text-slate-600 mt-0.5 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t.start} – {t.end} · KPI {t.kpi}</div>
              </div>
              <button onClick={() => setEditing(editing === t.id ? null : t.id)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <PenLine className="w-4 h-4" />
              </button>
            </div>
            {t.conflict && (
              <div className="mt-2 text-[11.5px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> <span>{t.conflict}</span>
              </div>
            )}
            {editing === t.id && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                <Field label="Nội dung task">
                  <Input value={t.name} onChange={(e: any) => editTask(t.id, { name: e.target.value })} />
                </Field>
                <Field label="Nhân sự thực hiện">
                  <select value={t.owner} onChange={(e) => editTask(t.id, { owner: e.target.value })}
                    className="h-11 w-full px-3 rounded-lg border border-slate-200 bg-white text-[14px]">
                    {ASSIGNEES.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Bắt đầu">
                    <Input type="time" value={t.start} onChange={(e: any) => editTask(t.id, { start: e.target.value })} />
                  </Field>
                  <Field label="Kết thúc">
                    <Input type="time" value={t.end} onChange={(e: any) => editTask(t.id, { end: e.target.value })} />
                  </Field>
                </div>
                <div className="flex justify-end">
                  <Btn size="sm" variant="outline" onClick={() => setEditing(null)}>Đóng</Btn>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="outline" icon={XCircle} size="sm" full onClick={back}>Trả lại</Btn>
          <Btn icon={CheckCircle2} size="sm" full
            variant={conflictCount > 0 ? "outline" : "primary"}
            onClick={() => conflictCount === 0 && setConfirm(true)}>
            {conflictCount > 0 ? `Còn ${conflictCount} cảnh báo` : "Phê duyệt"}
          </Btn>
        </div>
      </div>

      {confirm && (
        <div className="absolute inset-0 z-40 bg-black/40 flex items-end" onClick={() => setConfirm(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5 pb-7 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
            <div className="text-[16px] font-bold text-slate-900">Xác nhận phê duyệt</div>
            <div className="text-[13px] text-slate-600">
              Lô <b>{batch.id}</b> sẽ được ghi nhận: {tasks.length} task, nhân sự & thời gian sau điều chỉnh.
              Danh sách giao việc chuyển sang trạng thái <b className="text-emerald-700">Sẵn sàng triển khai</b>.
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Btn variant="outline" full onClick={() => setConfirm(false)}>Hủy</Btn>
              <Btn full icon={CheckCircle2} onClick={() => { setConfirm(false); done(); }}>Phê duyệt</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const APPR_BATCHES: ApprBatch[] = [
  { id: "APR-2026-0142", orderId: "INB-2026-00231", orderType: "INB-NCC · Nhập kho NCC", warehouse: "HN01", createdAt: "08:12", planFor: "Hôm nay · 09:30 – 12:00", taskCount: 9, conflicts: 1, status: "pending" },
  { id: "APR-2026-0143", orderId: "OUT-2026-00451", orderType: "OUT-VC · Xuất kho vận chuyển", warehouse: "HN01", createdAt: "08:25", planFor: "Hôm nay · 10:00 – 13:30", taskCount: 8, conflicts: 1, status: "pending" },
  { id: "APR-2026-0144", orderId: "INB-2026-00233", orderType: "INB-NCK · Nhập chuyển kho", warehouse: "HN01", createdAt: "08:30", planFor: "Hôm nay · 11:00 – 14:00", taskCount: 7, conflicts: 0, status: "pending" },
];