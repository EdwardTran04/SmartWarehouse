import { useMemo } from "react";

export type HistorySource = "AIWS" | "SAP" | "VERP" | "VOffice" | "KCS" | "System";
export type HistorySeverity = "Thông tin" | "Cảnh báo" | "Lỗi";
export type HistoryActorKind = "user" | "system";

export interface HistoryEntry {
  id: string;
  time: string;
  actor: string;
  actorKind?: HistoryActorKind;
  actorRole?: string;
  source?: HistorySource;
  action: string;
  target?: string;
  targetType?: string;
  content?: string;
  before?: string;
  after?: string;
  severity?: HistorySeverity;
  refId?: string;
  ip?: string;
  device?: string;
  apiLog?: string;
  file?: string;
  relatedTask?: string;
  note?: string;
  change?: string;
}

export function buildSampleHistory(orderId: string): HistoryEntry[] {
  return [
    { id: "H001", time: "08:15", actor: "Nguyễn Văn A", actorKind: "user", action: "Xác nhận tiếp nhận lệnh", change: "Trạng thái: WAIT_CONFIRM → ACCEPTED" },
    { id: "H002", time: "08:31", actor: "AIWS", actorKind: "system", action: "Sinh task tự động", change: "Tạo task TSK-001, TSK-002" },
    { id: "H003", time: "09:05", actor: "Trần Văn B", actorKind: "user", action: "Cập nhật task dỡ hàng", change: "Trạng thái: IN_PROGRESS → COMPLETED" },
    { id: "H004", time: "09:10", actor: "Trần Văn B", actorKind: "user", action: "Upload ảnh bằng chứng", change: "Thêm 2 file ảnh" },
  ];
}

interface Props {
  entries?: HistoryEntry[];
  orderId?: string;
  canView?: boolean;
}

export default function HistoryTab({ entries, orderId = "INB-2026-00118", canView = true }: Props) {
  const data = useMemo(() => entries ?? buildSampleHistory(orderId), [entries, orderId]);

  if (!canView) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
        Bạn không có quyền xem lịch sử thao tác của order/task này.
      </div>
    );
  }

  const formatChange = (e: HistoryEntry) => {
    if (e.change) return e.change;
    if (e.before || e.after) return `${e.before || "--"} → ${e.after || "--"}`;
    return "--";
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 text-muted-foreground border-b border-border">
            <th className="px-4 py-3 text-left font-medium w-32">Thời gian</th>
            <th className="px-4 py-3 text-left font-medium w-56">Người/Hệ thống</th>
            <th className="px-4 py-3 text-left font-medium">Hành động</th>
            <th className="px-4 py-3 text-left font-medium">Dữ liệu thay đổi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e) => (
            <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 text-navy whitespace-nowrap">{e.time}</td>
              <td className="px-4 py-3 text-navy">{e.actor}</td>
              <td className="px-4 py-3 text-navy">{e.action}</td>
              <td className="px-4 py-3 text-navy">{formatChange(e)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
