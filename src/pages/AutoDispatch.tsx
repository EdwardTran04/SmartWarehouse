import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import { PageTitle, Btn, Modal, Field, Select, MultiSelectDropdown, SingleSelectDropdown } from "@/components/ui-bits";
import { RefreshCw, Pause, Play, Zap, X, CheckCircle2, Clock, AlertTriangle, User as UserIcon, ArrowRight, Info } from "lucide-react";

/* ============ Types ============ */
type EmpStatus = "Đang xử lý" | "Nhàn rỗi" | "Tạm nghỉ" | "Quá tải" | "Không khả dụng";
type TaskDispatchStatus = "Chờ tiền đề" | "Sẵn sàng giao" | "Đã giao" | "Đang thực hiện" | "Hoàn thành" | "Lỗi giao việc";

interface Emp {
  id: string; name: string; role: string; status: EmpStatus;
  currentTask?: string; lastDoneAt?: string; doneCount: number; idleFor?: string; fitScore?: number;
  warehouse: string;
}
interface Task {
  id: string; name: string; orderId: string; type: string; requireRole: string;
  prereqTask?: string; prereqStatus: "Chưa hoàn thành" | "Đã hoàn thành" | "—";
  status: TaskDispatchStatus; estMin: number; priority: "Cao" | "Trung bình" | "Thấp";
  slaLeftMin: number; suggestEmp?: string; reason: string; assignedTo?: string;
}

/* ============ Mock data ============ */
const EMPS: Emp[] = [
  { id: "E01", name: "Nguyễn Văn A", role: "Nhân viên dỡ hàng", status: "Đang xử lý", currentTask: "TSK-9923", doneCount: 5, warehouse: "Kho Sóng Thần", fitScore: 92 },
  { id: "E02", name: "Trần Văn B", role: "Nhân viên kiểm hàng", status: "Nhàn rỗi", lastDoneAt: "01/07/2026 09:42:11", doneCount: 4, idleFor: "3 phút", warehouse: "Kho Sóng Thần", fitScore: 88 },
  { id: "E03", name: "Lê Thị C", role: "Thủ kho", status: "Nhàn rỗi", lastDoneAt: "01/07/2026 09:45:03", doneCount: 6, idleFor: "1 phút", warehouse: "Kho Sóng Thần", fitScore: 95 },
  { id: "E04", name: "Phạm Văn D", role: "Nhân viên putaway", status: "Đang xử lý", currentTask: "TSK-9929", doneCount: 3, warehouse: "Kho Sóng Thần", fitScore: 80 },
  { id: "E05", name: "Hoàng Văn E", role: "Nhân viên kho", status: "Tạm nghỉ", doneCount: 2, warehouse: "Kho Sóng Thần" },
  { id: "E06", name: "Vũ Thị F", role: "Nhân viên dỡ hàng", status: "Quá tải", currentTask: "TSK-9930", doneCount: 9, warehouse: "Kho Sóng Thần", fitScore: 40 },
];

const TASKS: Task[] = [
  { id: "TSK-9923", name: "Dỡ hàng", orderId: "INB-2026-00118", type: "Dỡ hàng", requireRole: "Nhân viên dỡ hàng", prereqStatus: "—", status: "Đang thực hiện", estMin: 30, priority: "Cao", slaLeftMin: 45, assignedTo: "Nguyễn Văn A", reason: "Đang thực hiện bởi Nguyễn Văn A" },
  { id: "TSK-9922", name: "Kiểm hàng & ký BBBG", orderId: "INB-2026-00119", type: "Kiểm hàng", requireRole: "Nhân viên kiểm hàng", prereqTask: "TSK-9921 (Dỡ hàng)", prereqStatus: "Chưa hoàn thành", status: "Chờ tiền đề", estMin: 20, priority: "Trung bình", slaLeftMin: 120, reason: "Chưa giao — bước tiền đề Dỡ hàng chưa hoàn thành" },
  { id: "TSK-9925", name: "Thực nhập / Đối soát GR", orderId: "INB-2026-00120", type: "GR", requireRole: "Thủ kho", prereqTask: "TSK-9924 (KCS)", prereqStatus: "Đã hoàn thành", status: "Sẵn sàng giao", estMin: 25, priority: "Cao", slaLeftMin: 60, suggestEmp: "Lê Thị C", reason: "Lê Thị C đang nhàn rỗi, đúng chức danh, đủ thời gian trong ca" },
  { id: "TSK-9929", name: "Putaway", orderId: "INB-2026-00121", type: "Lưu trữ", requireRole: "Nhân viên putaway", prereqTask: "TSK-9925 (GR)", prereqStatus: "Đã hoàn thành", status: "Đang thực hiện", estMin: 40, priority: "Trung bình", slaLeftMin: 30, assignedTo: "Phạm Văn D", reason: "Đang thực hiện bởi Phạm Văn D" },
  { id: "TSK-9945", name: "Giám sát an ninh / Xe – Cổng kho", orderId: "INB-2026-00122", type: "Bảo vệ", requireRole: "Bảo vệ kho", prereqStatus: "—", status: "Đã giao", estMin: 15, priority: "Cao", slaLeftMin: 90, assignedTo: "Nguyễn Văn A", reason: "Hệ thống tự động giao lúc 09:30:12" },
  { id: "TSK-9946", name: "Kiểm hàng & ký BBBG", orderId: "INB-2026-00123", type: "Kiểm hàng", requireRole: "Nhân viên kiểm hàng", prereqTask: "TSK-9940 (Dỡ hàng)", prereqStatus: "Đã hoàn thành", status: "Sẵn sàng giao", estMin: 20, priority: "Trung bình", slaLeftMin: 75, suggestEmp: "Trần Văn B", reason: "Trần Văn B đang nhàn rỗi 3 phút, đúng chức danh" },
  { id: "TSK-9950", name: "Đóng gói & in tem", orderId: "OUT-2026-00051", type: "Đóng gói", requireRole: "Nhân viên đóng gói", prereqTask: "TSK-9949 (Picking)", prereqStatus: "Chưa hoàn thành", status: "Chờ tiền đề", estMin: 35, priority: "Cao", slaLeftMin: 50, reason: "Chưa giao — bước tiền đề Picking chưa hoàn thành" },
  { id: "TSK-9955", name: "Ký VOffice", orderId: "INB-2026-00117", type: "Ký số", requireRole: "Thủ kho", prereqTask: "TSK-9954 (GR)", prereqStatus: "Đã hoàn thành", status: "Lỗi giao việc", estMin: 10, priority: "Cao", slaLeftMin: 20, reason: "Không có nhân viên đúng chức danh khả dụng" },
];

/* ============ Tone maps ============ */
const EMP_TONE: Record<EmpStatus, string> = {
  "Đang xử lý": "bg-info/10 text-info border-info/20",
  "Nhàn rỗi": "bg-success/10 text-success border-success/20",
  "Tạm nghỉ": "bg-muted text-muted-foreground border-border",
  "Quá tải": "bg-destructive/10 text-destructive border-destructive/20",
  "Không khả dụng": "bg-muted text-muted-foreground border-border",
};
const TASK_TONE: Record<TaskDispatchStatus, string> = {
  "Chờ tiền đề": "bg-warning/10 text-warning border-warning/20",
  "Sẵn sàng giao": "bg-success/10 text-success border-success/20",
  "Đã giao": "bg-info/10 text-info border-info/20",
  "Đang thực hiện": "bg-brand/10 text-brand border-brand/20",
  "Hoàn thành": "bg-muted text-muted-foreground border-border",
  "Lỗi giao việc": "bg-destructive/10 text-destructive border-destructive/20",
};

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium ${tone}`}>{children}</span>;
}

/* ============ Component ============ */
export default function AutoDispatch() {
  const [paused, setPaused] = useState(false);
  const [fWh, setFWh] = useState<string[]>([]);
  const [fShift, setFShift] = useState("Ca sáng");
  const [fRole, setFRole] = useState<string[]>([]);
  const [fType, setFType] = useState<string[]>([]);
  const [fStatus, setFStatus] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<{ task?: Task; emp?: Emp } | null>(null);
  const [flowOpen, setFlowOpen] = useState(false);

  const kpi = useMemo(() => ({
    working: EMPS.filter(e => e.status === "Đang xử lý").length,
    idle: EMPS.filter(e => e.status === "Nhàn rỗi").length,
    ready: TASKS.filter(t => t.status === "Sẵn sàng giao").length,
    waitPrereq: TASKS.filter(t => t.status === "Chờ tiền đề").length,
    assigned: TASKS.filter(t => t.status === "Đã giao" || t.status === "Đang thực hiện").length,
    error: TASKS.filter(t => t.status === "Lỗi giao việc").length,
  }), []);

  const filteredTasks = TASKS.filter(t =>
    (fType.length === 0 || fType.includes(t.type)) &&
    (fStatus.length === 0 || fStatus.includes(t.status))
  );

  return (
    <AppShell breadcrumb={[{ label: "Điều phối giao việc tự động" }]}>
      <PageTitle
        title="Điều phối giao việc tự động"
        subtitle="Hệ thống tự động giao task tiếp theo cho nhân viên nhàn rỗi theo vai trò, điều kiện tiền đề và khối lượng phù hợp."
        actions={
          <>
            <Btn variant="outline" icon={Info} onClick={() => setFlowOpen(true)}>Luồng giao việc</Btn>
            <Btn variant="outline" icon={RefreshCw}>Làm mới</Btn>
            <Btn variant={paused ? "success" : "outline"} icon={paused ? Play : Pause} onClick={() => setPaused(!paused)}>
              {paused ? "Bật tự động giao việc" : "Tạm dừng tự động giao việc"}
            </Btn>
            <Btn variant="primary" icon={Zap}>Chạy lại thuật toán</Btn>
          </>
        }
      />

      {paused && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 text-warning px-4 py-2.5 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Tự động giao việc đang <b>tạm dừng</b>. Các task mới sẽ không được giao cho đến khi bật lại.
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4 grid grid-cols-6 gap-3">
        <Field label="Kho"><MultiSelectDropdown options={["Kho Sóng Thần", "Kho Bình Dương", "Kho Long An"]} value={fWh} onChange={setFWh} placeholder="Tất cả kho" /></Field>
        <Field label="Ca làm việc"><Select value={fShift} onChange={(e) => setFShift(e.target.value)}><option>Ca sáng</option><option>Ca chiều</option><option>Ca tối</option></Select></Field>
        <Field label="Ngày làm việc"><input type="date" defaultValue="2026-07-01" className="h-9 w-full px-3 rounded-md border border-input bg-card text-sm" /></Field>
        <Field label="Nhóm chức danh"><MultiSelectDropdown options={["Nhân viên dỡ hàng", "Nhân viên kiểm hàng", "Thủ kho", "Nhân viên putaway", "Nhân viên đóng gói", "Bảo vệ kho"]} value={fRole} onChange={setFRole} placeholder="Tất cả chức danh" /></Field>
        <Field label="Loại task"><MultiSelectDropdown options={["Dỡ hàng", "Kiểm hàng", "GR", "Lưu trữ", "Đóng gói", "Ký số", "Bảo vệ"]} value={fType} onChange={setFType} placeholder="Tất cả loại" /></Field>
        <Field label="Trạng thái task"><MultiSelectDropdown options={["Chờ tiền đề", "Sẵn sàng giao", "Đã giao", "Đang thực hiện", "Lỗi giao việc"]} value={fStatus} onChange={setFStatus} placeholder="Tất cả trạng thái" /></Field>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {[
          { label: "Đang làm", value: kpi.working, tone: "text-info", bg: "bg-info/5 border-info/20" },
          { label: "Nhàn rỗi", value: kpi.idle, tone: "text-success", bg: "bg-success/5 border-success/20" },
          { label: "Sẵn sàng giao", value: kpi.ready, tone: "text-success", bg: "bg-success/5 border-success/20" },
          { label: "Chờ tiền đề", value: kpi.waitPrereq, tone: "text-warning", bg: "bg-warning/5 border-warning/20" },
          { label: "Đã giao hôm nay", value: 56, tone: "text-brand", bg: "bg-brand/5 border-brand/20" },
          { label: "Lỗi giao việc", value: kpi.error, tone: "text-destructive", bg: "bg-destructive/5 border-destructive/20" },
        ].map((k) => (
          <div key={k.label} className={`rounded-lg border p-4 ${k.bg}`}>
            <div className="text-xs text-muted-foreground mb-1">{k.label}</div>
            <div className={`text-2xl font-bold ${k.tone}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Auto-dispatch flow stepper */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-navy text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-brand" /> Luồng giao việc tự động (real-time / cuốn chiếu)</h3>
          <span className="text-xs text-muted-foreground">Không lập lịch cố định — task tiếp theo chỉ giao khi task hiện tại hoàn thành.</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {[
            "Nhân viên hoàn thành task",
            "Vào danh sách nhàn rỗi",
            "Tìm task đã xong tiền đề",
            "Lọc theo chức danh",
            "Tính khối lượng & thời gian",
            "Giao task tiếp theo",
            "Nhân viên nhận & xử lý",
          ].map((s, i, arr) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 text-xs">
                <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                <span>{s}</span>
              </div>
              {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      {/* Two columns: employees + tasks */}
      <div className="grid grid-cols-2 gap-4">
        {/* Employees */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-navy text-sm">Trạng thái nhân viên</h3>
            <span className="text-xs text-muted-foreground">{EMPS.length} nhân sự</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Nhân viên</th>
                  <th className="text-left px-3 py-2">Chức danh</th>
                  <th className="text-left px-3 py-2">Trạng thái</th>
                  <th className="text-left px-3 py-2">Task hiện tại</th>
                  <th className="text-right px-3 py-2">SL task</th>
                  <th className="text-left px-3 py-2">Nhàn rỗi</th>
                  <th className="text-right px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {EMPS.map((e) => (
                  <tr key={e.id} className={`border-t border-border hover:bg-muted/30 ${e.status === "Nhàn rỗi" ? "bg-success/5" : ""}`}>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center"><UserIcon className="w-3.5 h-3.5 text-navy" /></div>
                        <div>
                          <div className="font-medium">{e.name}</div>
                          <div className="text-[11px] text-muted-foreground">{e.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs">{e.role}</td>
                    <td className="px-3 py-2"><Badge tone={EMP_TONE[e.status]}>{e.status}</Badge></td>
                    <td className="px-3 py-2 text-xs font-mono">{e.currentTask || "—"}</td>
                    <td className="px-3 py-2 text-right">{e.doneCount}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{e.idleFor || "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => setDrawer({ emp: e })} className="text-xs text-primary hover:underline">Chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-navy text-sm">Danh sách task theo trạng thái giao việc</h3>
            <span className="text-xs text-muted-foreground">{filteredTasks.length} task</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Task</th>
                  <th className="text-left px-3 py-2">Order</th>
                  <th className="text-left px-3 py-2">Chức danh</th>
                  <th className="text-left px-3 py-2">Tiền đề</th>
                  <th className="text-left px-3 py-2">Trạng thái</th>
                  <th className="text-right px-3 py-2">SLA (p)</th>
                  <th className="text-left px-3 py-2">Đề xuất</th>
                  <th className="text-right px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-3 py-2">
                      <div className="font-mono text-xs">{t.id}</div>
                      <div className="text-[11px] text-muted-foreground">{t.name}</div>
                    </td>
                    <td className="px-3 py-2 text-xs font-mono">{t.orderId}</td>
                    <td className="px-3 py-2 text-xs">{t.requireRole}</td>
                    <td className="px-3 py-2 text-xs">
                      {t.prereqTask ? (
                        <>
                          <div className="text-[11px]">{t.prereqTask}</div>
                          <span className={`text-[10px] ${t.prereqStatus === "Đã hoàn thành" ? "text-success" : "text-warning"}`}>{t.prereqStatus}</span>
                        </>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-2"><Badge tone={TASK_TONE[t.status]}>{t.status}</Badge></td>
                    <td className={`px-3 py-2 text-right text-xs ${t.slaLeftMin <= 30 ? "text-destructive font-semibold" : ""}`}>{t.slaLeftMin}</td>
                    <td className="px-3 py-2 text-xs">{t.suggestEmp || t.assignedTo || "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => setDrawer({ task: t })} className="text-xs text-primary hover:underline">Lý do</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-sm" onClick={() => setDrawer(null)}>
          <div className="w-[480px] bg-card h-full shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card">
              <h3 className="font-semibold text-navy">Chi tiết quyết định giao việc</h3>
              <button onClick={() => setDrawer(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              {drawer.task && <TaskDecision task={drawer.task} />}
              {drawer.emp && <EmpDecision emp={drawer.emp} />}
            </div>
          </div>
        </div>
      )}

      {/* Flow modal */}
      <Modal open={flowOpen} onClose={() => setFlowOpen(false)} title="Nguyên tắc giao việc tự động — Real-time / Cuốn chiếu" wide>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">Hệ thống không lập lịch cố định toàn ngày cho từng nhân viên. Task tiếp theo <b>chỉ được giao</b> khi nhân viên hoàn thành task hiện tại và các điều kiện bên dưới thoả mãn.</p>
          <ol className="space-y-2 list-decimal pl-5">
            <li>Nhân viên hoàn thành task hiện tại → hệ thống đưa vào <b>danh sách nhàn rỗi</b>.</li>
            <li>Hệ thống tìm các task đã hoàn thành <b>bước tiền đề</b>.</li>
            <li>Lọc task theo <b>chức danh / vai trò</b> nhân viên được phép thực hiện.</li>
            <li>Tính <b>khối lượng</b> và <b>thời gian còn lại</b> trong ca của nhân viên.</li>
            <li>Chọn task có <b>SLA / độ ưu tiên</b> cao nhất phù hợp.</li>
            <li>Giao task cho nhân viên và ghi log lý do lựa chọn.</li>
            <li>Nhân viên nhận task và bắt đầu xử lý.</li>
          </ol>
          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
            <b>Điều kiện AI gọi giao việc:</b> nhân viên nhàn rỗi + task đã xong tiền đề + đúng chức danh + đủ thời gian trong ca + chưa quá tải.
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}

function TaskDecision({ task }: { task: Task }) {
  const ok = task.status === "Sẵn sàng giao" || task.status === "Đã giao" || task.status === "Đang thực hiện";
  return (
    <>
      <div>
        <div className="text-xs text-muted-foreground">Task được xét giao</div>
        <div className="font-semibold text-navy">{task.id} — {task.name}</div>
        <div className="text-xs text-muted-foreground">Order {task.orderId} · {task.requireRole}</div>
      </div>
      <div className={`rounded-md border p-3 ${ok ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"}`}>
        <div className="flex items-center gap-2 font-semibold">
          {ok ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
          Kết quả thuật toán: {ok ? "Được giao" : "Chưa giao"}
        </div>
        <div className="text-xs mt-1">{task.reason}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <Info2 label="Task tiền đề" value={task.prereqTask || "—"} />
        <Info2 label="Trạng thái tiền đề" value={task.prereqStatus} />
        <Info2 label="Thời lượng ước tính" value={`${task.estMin} phút`} />
        <Info2 label="SLA còn lại" value={`${task.slaLeftMin} phút`} />
        <Info2 label="Độ ưu tiên" value={task.priority} />
        <Info2 label="Nhân viên đề xuất" value={task.suggestEmp || task.assignedTo || "—"} />
      </div>
      <div className="rounded-md border border-border p-3">
        <div className="text-xs font-semibold mb-2">Điều kiện đánh giá</div>
        <ul className="space-y-1 text-xs">
          <Cond ok={task.prereqStatus !== "Chưa hoàn thành"}>Task tiền đề đã hoàn thành</Cond>
          <Cond ok={!!task.suggestEmp || !!task.assignedTo}>Có nhân viên đúng chức danh & đang nhàn rỗi</Cond>
          <Cond ok={task.slaLeftMin > task.estMin}>Thời lượng task phù hợp với thời gian còn lại</Cond>
          <Cond ok={task.priority === "Cao"} warn>Ưu tiên cao trong hàng đợi SLA</Cond>
          <Cond ok={task.status !== "Lỗi giao việc"}>Không có lỗi giao việc</Cond>
        </ul>
      </div>
      <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
        Thời gian chạy thuật toán: 01/07/2026 09:46:22.145 · Request ID: DSP-{task.id}-A1
      </div>
    </>
  );
}

function EmpDecision({ emp }: { emp: Emp }) {
  const ok = emp.status === "Nhàn rỗi";
  return (
    <>
      <div>
        <div className="text-xs text-muted-foreground">Nhân viên được xét giao</div>
        <div className="font-semibold text-navy">{emp.name} — {emp.role}</div>
        <div className="text-xs text-muted-foreground">{emp.id} · {emp.warehouse}</div>
      </div>
      <div className={`rounded-md border p-3 ${ok ? "bg-success/10 border-success/30" : "bg-muted/40 border-border"}`}>
        <div className="flex items-center gap-2 font-semibold">
          {ok ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
          {ok ? "Đủ điều kiện nhận task tiếp theo" : `Trạng thái: ${emp.status}`}
        </div>
        <div className="text-xs mt-1">
          {ok ? "Nhân viên đang trong danh sách nhàn rỗi — hệ thống sẽ tìm task phù hợp." : "Nhân viên không nằm trong hàng đợi giao việc tự động."}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <Info2 label="Task đang thực hiện" value={emp.currentTask || "—"} />
        <Info2 label="Hoàn thành gần nhất" value={emp.lastDoneAt || "—"} />
        <Info2 label="Khối lượng đã xử lý" value={`${emp.doneCount} task`} />
        <Info2 label="Nhàn rỗi trong" value={emp.idleFor || "—"} />
        <Info2 label="Điểm phù hợp" value={emp.fitScore ? `${emp.fitScore}/100` : "—"} />
        <Info2 label="Thời gian còn lại ca" value="2h 15p" />
      </div>
    </>
  );
}

function Info2({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-2">
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
function Cond({ ok, warn, children }: { ok: boolean; warn?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      {ok ? <CheckCircle2 className={`w-3.5 h-3.5 ${warn ? "text-warning" : "text-success"}`} /> : <X className="w-3.5 h-3.5 text-destructive" />}
      <span>{children}</span>
    </li>
  );
}
