// Mock store for Staff mobile app (localStorage persistence)
// Aligned with web task catalog (src/data/inbound.ts → taskCatalog & FLOW_TASK_ORDER)
export type TaskFlow = "inbound" | "outbound";
export type FlowCode = "INB-NCC" | "INB-TRF" | "OUT-VC" | "OUT-OTH";
export type TaskStatus = "assigned" | "in_progress" | "paused" | "done" | "cancelled";
export type StepStatus = "pending" | "done";
export type TaskKind = "Human" | "System" | "API" | "AI" | "Approval";

export interface TaskStep {
  id: string;
  title: string;
  detail?: string;
  status: StepStatus;
  qtyRequired?: number;
  qtyDone?: number;
  location?: string;
  sku?: string;
}

export interface StaffTask {
  code: string;
  flow: TaskFlow;
  flowCode: FlowCode;             // luồng nghiệp vụ (giống web)
  templateCode: string;           // T-NCC, T-APR, T-HO, ...
  templateName: string;           // Tên hiển thị theo catalog
  kind: TaskKind;
  title: string;                  // = templateName cho gọn
  orderCode: string;
  priority: "high" | "normal" | "low";
  status: TaskStatus;
  assignedAt: string;
  dueAt?: string;
  location?: string;
  steps: TaskStep[];
  evidenceRequired?: string[];    // Ảnh, Chữ ký, Ảnh BBBG, Tem, Scan vị trí, Phiếu nhập, Phiếu xuất, File ký
  note?: string;
}

export type LeaveStatus = "pending" | "approved" | "rejected";
export interface LeaveRequest {
  id: string;
  from: string;
  to: string;
  reason: string;
  type: "annual" | "sick" | "unpaid" | "other";
  status: LeaveStatus;
  createdAt: string;
}

export const MOCK_USER = {
  id: "EMP-0142",
  name: "Nguyễn Văn Kho",
  role: "Nhân viên kho",
  team: "Ca sáng · Zone A",
  avatar: "NK",
};

const KEY_TASKS = "staff.tasks.v3";
const KEY_LEAVES = "staff.leaves.v1";

// ────────────────────────────────────────────────────────────
// Helper: khai báo template map → sinh steps mặc định
// ────────────────────────────────────────────────────────────
type TplMeta = { name: string; kind: TaskKind; evidence: string[]; buildSteps: () => TaskStep[] };
const p = (id: string, title: string, extra: Partial<TaskStep> = {}): TaskStep =>
  ({ id, title, status: "pending", ...extra });

const TEMPLATES: Record<string, TplMeta> = {
  // ───── Nhập kho ─────
  "T-NCC": {
    name: "Check lệnh NCC", kind: "Approval", evidence: [],
    buildSteps: () => [
      p("s1", "Đối chiếu lệnh SAP/VERP", { detail: "Kiểm tra header, NCC, số PO" }),
      p("s2", "Kiểm tra danh mục hàng & số lượng"),
      p("s3", "Chấp thuận / trả lại lệnh"),
    ],
  },
  "T-APR": {
    name: "Duyệt lịch giao việc", kind: "Approval", evidence: [],
    buildSteps: () => [
      p("s1", "Xem đề xuất giao việc từ AI"),
      p("s2", "Kiểm tra tải người & thiết bị"),
      p("s3", "Duyệt / điều chỉnh & phát hành"),
    ],
  },
  "T-HO": {
    name: "Kiểm hàng - ký bàn giao", kind: "Human", evidence: ["Ảnh", "Chữ ký", "Ảnh BBBG"],
    buildSteps: () => [
      p("s1", "Kiểm niêm phong xe / container", { detail: "Chụp ảnh niêm phong trước khi mở" }),
      p("s2", "Đếm số lượng thùng theo BBBG", { qtyRequired: 40, qtyDone: 0 }),
      p("s3", "Đánh giá tình trạng ngoại quan"),
      p("s4", "Ký BBBG điện tử"),
    ],
  },
  "T-UNL": {
    name: "Dỡ hàng", kind: "Human", evidence: ["Ảnh"],
    buildSteps: () => [
      p("s1", "Bố trí dock & thiết bị dỡ"),
      p("s2", "Dỡ hàng xuống dock", { qtyRequired: 40, qtyDone: 0 }),
      p("s3", "Chụp ảnh hàng đã dỡ"),
    ],
  },
  "T-MV1": {
    name: "Đưa vào khu chờ nhập", kind: "Human", evidence: [],
    buildSteps: () => [
      p("s1", "Di chuyển hàng từ dock → khu chờ nhập", { location: "STG-IN-01" }),
      p("s2", "Xác nhận đã đưa vào vị trí chờ"),
    ],
  },
  "T-AGR": {
    name: "Thực nhập kho", kind: "Human", evidence: ["Phiếu nhập"],
    buildSteps: () => [
      p("s1", "Đối chiếu số lượng thực nhận vs BBBG"),
      p("s2", "Sinh phiếu nhập trên ERP (GR)"),
      p("s3", "In phiếu nhập"),
    ],
  },
  "T-SIG": {
    name: "Ký voffice", kind: "Human", evidence: ["File ký"],
    buildSteps: () => [
      p("s1", "Trình ký phiếu trên VOffice"),
      p("s2", "Đính kèm file scan"),
      p("s3", "Theo dõi trạng thái ký"),
    ],
  },
  "T-MV2": {
    name: "Đưa sang khu đóng gói", kind: "Human", evidence: [],
    buildSteps: () => [
      p("s1", "Chuyển hàng sang khu đóng gói", { location: "PACK-IN-01" }),
      p("s2", "Xác nhận bàn giao khu đóng gói"),
    ],
  },
  "T-PAC": {
    name: "Đóng gói hàng", kind: "Human", evidence: ["Tem"],
    buildSteps: () => [
      p("s1", "Chuẩn bị vật tư đóng gói"),
      p("s2", "Đóng gói & tạo HU", { qtyRequired: 8, qtyDone: 0 }),
      p("s3", "Dán tem RFID / Barcode"),
      p("s4", "In phiếu HU"),
    ],
  },
  "T-MV3": {
    name: "Đưa vào lưu trữ (Putaway)", kind: "Human", evidence: ["Scan vị trí"],
    buildSteps: () => [
      p("s1", "Nhận HU từ khu đóng gói"),
      p("s2", "Đưa vào vị trí đề xuất", { location: "G01-T02-B05" }),
      p("s3", "Quét xác nhận vị trí"),
    ],
  },

  // ───── Xuất kho ─────
  "T-GI": {
    name: "Check lệnh xuất kho", kind: "Approval", evidence: [],
    buildSteps: () => [
      p("s1", "Đối chiếu lệnh xuất SAP/VERP"),
      p("s2", "Kiểm tra tồn kho khả dụng"),
      p("s3", "Chấp thuận / trả lại lệnh"),
    ],
  },
  "T-MV4": {
    name: "Lấy hàng ra khu đóng gói (Picking)", kind: "Human", evidence: ["Scan vị trí"],
    buildSteps: () => [
      p("s1", "Nhận danh sách picking"),
      p("s2", "Pick SKU-A-102", { sku: "SKU-A-102", location: "A-03-02", qtyRequired: 24, qtyDone: 10 }),
      p("s3", "Pick SKU-B-880", { sku: "SKU-B-880", location: "B-11-05", qtyRequired: 12, qtyDone: 0 }),
      p("s4", "Đưa hàng ra khu đóng gói"),
    ],
  },
  "T-MV5": {
    name: "Đưa sang khu chờ xuất", kind: "Human", evidence: [],
    buildSteps: () => [
      p("s1", "Nhận hàng từ khu đóng gói"),
      p("s2", "Đưa sang khu staging xuất", { location: "STG-OUT-03" }),
    ],
  },
  "T-LDG": {
    name: "Tải hàng lên xe", kind: "Human", evidence: ["Ảnh xe"],
    buildSteps: () => [
      p("s1", "Kiểm tra xe & niêm phong trước load"),
      p("s2", "Load pallet lên xe", { qtyRequired: 12, qtyDone: 0 }),
      p("s3", "Chụp ảnh niêm phong sau load"),
      p("s4", "Xác nhận đủ hàng"),
    ],
  },
  "T-AGI": {
    name: "Thực xuất kho", kind: "Human", evidence: ["Phiếu xuất"],
    buildSteps: () => [
      p("s1", "Đối chiếu số lượng thực xuất"),
      p("s2", "Sinh phiếu xuất trên ERP (GI)"),
      p("s3", "In phiếu xuất"),
    ],
  },
};

// Order thứ tự task theo luồng (giống FLOW_TASK_ORDER trên web, bỏ T-KPI/T-WH/T-SCR)
const FLOW: Record<FlowCode, string[]> = {
  "INB-NCC": ["T-NCC","T-APR","T-HO","T-UNL","T-MV1","T-AGR","T-SIG","T-MV2","T-PAC","T-MV3"],
  "INB-TRF": ["T-NCC","T-APR","T-HO","T-UNL","T-MV1","T-AGR","T-SIG","T-MV2","T-PAC","T-MV3"],
  "OUT-VC":  ["T-GI","T-APR","T-MV4","T-MV5","T-HO","T-LDG","T-AGI","T-SIG"],
  "OUT-OTH": ["T-GI","T-APR","T-MV4","T-PAC","T-MV5","T-HO","T-LDG","T-AGI","T-SIG"],
};

const seedTasks = (): StaffTask[] => {
  const now = Date.now();
  const ago = (min: number) => new Date(now - min * 60e3).toISOString();
  const inMin = (min: number) => new Date(now + min * 60e3).toISOString();

  type Row = {
    code: string; flowCode: FlowCode; tpl: string; order: string;
    priority: StaffTask["priority"]; status: TaskStatus;
    assignedAt: string; dueAt?: string; location?: string; note?: string;
  };

  const rows: Row[] = [
    // ========== Order IN-2026-01128 (INB-NCC) ==========
    { code: "ITSK-2210", flowCode: "INB-NCC", tpl: "T-NCC", order: "IN-2026-01128", priority: "normal", status: "done",        assignedAt: ago(180), location: "V-Office" },
    { code: "ITSK-2211", flowCode: "INB-NCC", tpl: "T-APR", order: "IN-2026-01128", priority: "normal", status: "done",        assignedAt: ago(170), location: "V-Office" },
    { code: "ITSK-2212", flowCode: "INB-NCC", tpl: "T-HO",  order: "IN-2026-01128", priority: "high",   status: "in_progress", assignedAt: ago(60),  dueAt: inMin(30),  location: "Dock 1" },
    { code: "ITSK-2213", flowCode: "INB-NCC", tpl: "T-UNL", order: "IN-2026-01128", priority: "high",   status: "assigned",    assignedAt: ago(45),  dueAt: inMin(60),  location: "Dock 1" },
    { code: "ITSK-2214", flowCode: "INB-NCC", tpl: "T-MV1", order: "IN-2026-01128", priority: "normal", status: "assigned",    assignedAt: ago(30),  location: "STG-IN-01" },
    { code: "ITSK-2215", flowCode: "INB-NCC", tpl: "T-AGR", order: "IN-2026-01128", priority: "normal", status: "assigned",    assignedAt: ago(20),  location: "V-Office" },

    // ========== Order IN-2026-01120 (INB-TRF – chuyển kho, đang gần cuối) ==========
    { code: "ITSK-2205", flowCode: "INB-TRF", tpl: "T-SIG", order: "IN-2026-01120", priority: "high",   status: "paused",      assignedAt: ago(120), location: "V-Office", note: "Chờ GĐ kho phê duyệt trên VOffice" },
    { code: "ITSK-2206", flowCode: "INB-TRF", tpl: "T-PAC", order: "IN-2026-01120", priority: "normal", status: "assigned",    assignedAt: ago(90),  location: "Khu Packing 1" },
    { code: "ITSK-2207", flowCode: "INB-TRF", tpl: "T-MV3", order: "IN-2026-01120", priority: "low",    status: "assigned",    assignedAt: ago(60),  location: "Zone C" },

    // ========== Order IN-2026-01100 (INB-NCC – đã xong) ==========
    { code: "ITSK-2180", flowCode: "INB-NCC", tpl: "T-HO",  order: "IN-2026-01100", priority: "normal", status: "done", assignedAt: ago(60 * 20) },
    { code: "ITSK-2181", flowCode: "INB-NCC", tpl: "T-PAC", order: "IN-2026-01100", priority: "normal", status: "done", assignedAt: ago(60 * 19) },
    { code: "ITSK-2182", flowCode: "INB-NCC", tpl: "T-MV3", order: "IN-2026-01100", priority: "normal", status: "done", assignedAt: ago(60 * 18) },

    // ========== Order OUT-2026-00452 (OUT-VC) ==========
    { code: "OTSK-5530", flowCode: "OUT-VC", tpl: "T-GI",  order: "OUT-2026-00452", priority: "high",   status: "done",        assignedAt: ago(200), location: "V-Office" },
    { code: "OTSK-5531", flowCode: "OUT-VC", tpl: "T-APR", order: "OUT-2026-00452", priority: "high",   status: "done",        assignedAt: ago(190), location: "V-Office" },
    { code: "OTSK-5535", flowCode: "OUT-VC", tpl: "T-MV4", order: "OUT-2026-00452", priority: "high",   status: "in_progress", assignedAt: ago(60),  dueAt: inMin(180), location: "Zone A" },
    { code: "OTSK-5536", flowCode: "OUT-VC", tpl: "T-MV5", order: "OUT-2026-00452", priority: "high",   status: "assigned",    assignedAt: ago(30),  location: "STG-OUT-03" },
    { code: "OTSK-5537", flowCode: "OUT-VC", tpl: "T-HO",  order: "OUT-2026-00452", priority: "normal", status: "assigned",    assignedAt: ago(20),  location: "Dock 3" },
    { code: "OTSK-5538", flowCode: "OUT-VC", tpl: "T-LDG", order: "OUT-2026-00452", priority: "high",   status: "assigned",    assignedAt: ago(15),  dueAt: inMin(120), location: "Dock 3" },
    { code: "OTSK-5539", flowCode: "OUT-VC", tpl: "T-AGI", order: "OUT-2026-00452", priority: "normal", status: "assigned",    assignedAt: ago(10),  location: "V-Office" },

    // ========== Order OUT-2026-00458 (OUT-OTH – xuất khác, có T-PAC) ==========
    { code: "OTSK-5540", flowCode: "OUT-OTH", tpl: "T-MV4", order: "OUT-2026-00458", priority: "high",   status: "assigned", assignedAt: ago(15), dueAt: inMin(120), location: "Zone B" },
    { code: "OTSK-5541", flowCode: "OUT-OTH", tpl: "T-PAC", order: "OUT-2026-00458", priority: "normal", status: "assigned", assignedAt: ago(10), location: "Khu Packing 2" },
    { code: "OTSK-5542", flowCode: "OUT-OTH", tpl: "T-LDG", order: "OUT-2026-00458", priority: "normal", status: "assigned", assignedAt: ago(8),  location: "Dock 5" },

    // ========== Order OUT-2026-00450 (OUT-VC – đang paused ở load) ==========
    { code: "OTSK-5543", flowCode: "OUT-VC", tpl: "T-LDG", order: "OUT-2026-00450", priority: "high", status: "paused", assignedAt: ago(45), dueAt: inMin(90), location: "Dock 5", note: "Xe đến chậm 15 phút, đang chờ vận chuyển xác nhận" },

    // ========== Order OUT-2026-00441 / 00435 (đã xong) ==========
    { code: "OTSK-5510", flowCode: "OUT-VC",  tpl: "T-AGI", order: "OUT-2026-00441", priority: "normal", status: "done", assignedAt: ago(60 * 26) },
    { code: "OTSK-5501", flowCode: "OUT-OTH", tpl: "T-PAC", order: "OUT-2026-00435", priority: "low",    status: "done", assignedAt: ago(60 * 30) },
  ];

  return rows.map((r) => {
    const meta = TEMPLATES[r.tpl];
    // Nếu task đã done → set toàn bộ steps done
    const steps = meta.buildSteps().map((s) =>
      r.status === "done" ? { ...s, status: "done" as StepStatus, qtyDone: s.qtyRequired ?? s.qtyDone } : s
    );
    return {
      code: r.code,
      flow: r.flowCode.startsWith("INB") ? "inbound" : "outbound",
      flowCode: r.flowCode,
      templateCode: r.tpl,
      templateName: meta.name,
      kind: meta.kind,
      title: meta.name,
      orderCode: r.order,
      priority: r.priority,
      status: r.status,
      assignedAt: r.assignedAt,
      dueAt: r.dueAt,
      location: r.location,
      steps,
      evidenceRequired: meta.evidence,
      note: r.note,
    } as StaffTask;
  });
};

export function loadTasks(): StaffTask[] {
  try {
    const raw = localStorage.getItem(KEY_TASKS);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seed = seedTasks();
  localStorage.setItem(KEY_TASKS, JSON.stringify(seed));
  return seed;
}

export function saveTasks(t: StaffTask[]) {
  localStorage.setItem(KEY_TASKS, JSON.stringify(t));
}

export function loadLeaves(): LeaveRequest[] {
  try {
    const raw = localStorage.getItem(KEY_LEAVES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
export function saveLeaves(l: LeaveRequest[]) {
  localStorage.setItem(KEY_LEAVES, JSON.stringify(l));
}

export function taskProgress(t: StaffTask): number {
  if (!t.steps.length) return 0;
  const done = t.steps.filter((s) => s.status === "done").length;
  return Math.round((done / t.steps.length) * 100);
}

export function hasActiveTask(tasks: StaffTask[]): boolean {
  return tasks.some((t) => t.status === "in_progress" || t.status === "paused");
}

export const FLOW_LABEL: Record<FlowCode, string> = {
  "INB-NCC": "Nhập từ NCC",
  "INB-TRF": "Chuyển kho nội bộ",
  "OUT-VC":  "Xuất vận chuyển",
  "OUT-OTH": "Xuất khác",
};

// Thứ tự template trong luồng (1-based) – phục vụ hiển thị "Bước x/y của luồng"
export function flowStepOf(t: StaffTask): { index: number; total: number } {
  const seq = FLOW[t.flowCode] ?? [];
  const i = seq.indexOf(t.templateCode);
  return { index: i < 0 ? 0 : i + 1, total: seq.length };
}
