// ====== Inbound module: types & rich mock data ======

export type OrderType = "INB-NCC" | "INB-TRF" | "INB-OTH";
export type OrderStatus =
  | "New" | "API Error" | "Waiting Confirm" | "Rejected" | "Waiting Assign"
  | "AI Planning" | "Waiting Approval" | "Assigned" | "In Progress"
  | "Pending" | "Exception" | "Waiting KCS" | "KCS Failed" | "Ready for GR"
  | "GR Posted" | "Waiting VOffice" | "Signed" | "Packing" | "Putaway"
  | "Completed" | "Cancelled";

export type ReceiptMode = "identity" | "decompose";

export type Order = {
  id: string;
  type: OrderType;
  receiptMode?: ReceiptMode; // "identity" = đích danh (phẳng), "decompose" = phân rã hàng (cha-con)
  sourceDoc: string;          // PO/STO/Other
  source: string;             // NCC / kho xuất
  warehouse: string;
  hasTransport: boolean;
  hasKCS: boolean;
  hasPacking: boolean;
  hasVOffice: boolean;
  apiStatus: "OK" | "Pending" | "Error";
  status: OrderStatus;
  sla: string;                // e.g. "8h còn" / "Quá hạn 2h"
  slaPct: number;             // 0-100, >100 over
  plannedDate: string;
  owner: string;
  lines: number;
  qty: number;
  vehicle?: { code: string; plate: string; driver: string; phone: string; eta: string; ata?: string; dock?: string; vehicleStatus: "Chưa đến" | "Đã đến" | "Quá ETA" | "Reschedule" | "Đã rời cổng" };
  items: OrderItem[];
};

export type OrderItem = {
  sku: string; name: string; uom: string; docQty: number; recvQty: number;
  diff: number; kcs: "—" | "Đạt" | "Không đạt" | "Một phần" | "Pending";
  hu?: string; putaway?: string; serial?: boolean;
  children?: OrderItem[]; // Nhập phân rã: cấu thành con của SKU cha
};


export const orders: Order[] = [
  {
    id: "INB-2026-00118", type: "INB-NCC", receiptMode: "decompose", sourceDoc: "PO-2026-0991", source: "Ericsson Vietnam",
    warehouse: "HN01", hasTransport: true, hasKCS: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "In Progress", sla: "6h12 còn", slaPct: 62,
    plannedDate: "2026-05-18 09:00", owner: "Trần Văn Kho", lines: 12, qty: 480,
    vehicle: { code: "VT-2418", plate: "30H-784.21", driver: "Lê Quang Hùng", phone: "0912 884 221", eta: "2026-05-18 09:00", ata: "2026-05-18 09:14", dock: "DK-03", vehicleStatus: "Đã đến" },
    items: [
      { sku: "KIT-5G-SITE-A", name: "Trọn bộ trạm 5G Site A (phân rã)", uom: "Bộ", docQty: 4, recvQty: 4, diff: 0, kcs: "Đạt", hu: "HU-001", putaway: "G01-T02-B05", children: [
        { sku: "ANT-5G-32T", name: "Anten 5G Massive MIMO 32T32R", uom: "Bộ", docQty: 24, recvQty: 24, diff: 0, kcs: "Đạt", hu: "HU-001", putaway: "G01-T02-B05", serial: true },
        { sku: "BBU-6648", name: "Baseband Unit BBU 6648", uom: "Bộ", docQty: 40, recvQty: 40, diff: 0, kcs: "Đạt", hu: "HU-002", putaway: "G01-T02-B06", serial: true },
        { sku: "RRU-4408", name: "Remote Radio Unit 4408", uom: "Bộ", docQty: 16, recvQty: 16, diff: 0, kcs: "Pending", serial: true },
      ] },
      { sku: "KIT-PWR-DC", name: "Bộ nguồn DC + phụ kiện (phân rã)", uom: "Bộ", docQty: 2, recvQty: 2, diff: 0, kcs: "Một phần", hu: "HU-004", putaway: "H01-T01-B03", children: [
        { sku: "PWR-48V-30A", name: "Nguồn DC 48V 30A", uom: "Cái", docQty: 60, recvQty: 60, diff: 0, kcs: "Một phần", hu: "HU-004", putaway: "H01-T01-B03" },
        { sku: "CAB-FO-LC", name: "Cáp quang LC-LC 10m", uom: "Cuộn", docQty: 200, recvQty: 198, diff: -2, kcs: "Đạt", hu: "HU-003", putaway: "I01-T01-B12" },
      ] },
    ],
  },

  {
    id: "INB-2026-00119", type: "INB-NCC", sourceDoc: "PO-2026-1002", source: "Huawei Tech",
    warehouse: "HN01", hasTransport: true, hasKCS: true, hasPacking: false, hasVOffice: true,
    apiStatus: "Error", status: "API Error", sla: "—", slaPct: 0,
    plannedDate: "2026-05-18 10:30", owner: "—", lines: 8, qty: 320,
    items: [],
  },
  {
    id: "INB-2026-00120", type: "INB-TRF", sourceDoc: "STO-N-S-118", source: "Kho HCM01",
    warehouse: "HN01", hasTransport: true, hasKCS: false, hasPacking: false, hasVOffice: false,
    apiStatus: "OK", status: "Waiting Confirm", sla: "12h còn", slaPct: 18,
    plannedDate: "2026-05-18 14:00", owner: "Phạm Thị Hằng", lines: 5, qty: 120,
    vehicle: { code: "VT-2421", plate: "29C-119.04", driver: "Vũ Đức Long", phone: "0976 312 008", eta: "2026-05-18 14:00", vehicleStatus: "Chưa đến" },
    items: [],
  },
  {
    id: "INB-2026-00121", type: "INB-OTH", sourceDoc: "ASS-RC-0042", source: "Thu hồi CCDC – Chi nhánh Hải Phòng",
    warehouse: "HN01", hasTransport: false, hasKCS: false, hasPacking: false, hasVOffice: true,
    apiStatus: "OK", status: "Waiting Assign", sla: "1d8h còn", slaPct: 12,
    plannedDate: "2026-05-19 08:00", owner: "Nguyễn Hữu An", lines: 22, qty: 78, items: [],
  },
  {
    id: "INB-2026-00122", type: "INB-NCC", sourceDoc: "PO-2026-0987", source: "Nokia Solutions",
    warehouse: "HN01", hasTransport: true, hasKCS: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Waiting KCS", sla: "Quá hạn 2h15", slaPct: 118,
    plannedDate: "2026-05-17 16:00", owner: "Trần Văn Kho", lines: 6, qty: 96, items: [],
  },
  {
    id: "INB-2026-00123", type: "INB-NCC", sourceDoc: "PO-2026-1014", source: "Samsung Networks",
    warehouse: "HCM01", hasTransport: true, hasKCS: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Ready for GR", sla: "3h44 còn", slaPct: 78,
    plannedDate: "2026-05-18 11:00", owner: "Đỗ Minh Khôi", lines: 18, qty: 540, items: [],
  },
  {
    id: "INB-2026-00124", type: "INB-NCC", sourceDoc: "PO-2026-1015", source: "ZTE Corp",
    warehouse: "DN01", hasTransport: true, hasKCS: false, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "GR Posted", sla: "—", slaPct: 100,
    plannedDate: "2026-05-17 10:00", owner: "Lê Hoàng Nam", lines: 10, qty: 200, items: [],
  },
  {
    id: "INB-2026-00125", type: "INB-TRF", sourceDoc: "STO-N-N-077", source: "Kho DN01",
    warehouse: "HN01", hasTransport: true, hasKCS: false, hasPacking: false, hasVOffice: false,
    apiStatus: "OK", status: "Putaway", sla: "1h20 còn", slaPct: 86,
    plannedDate: "2026-05-18 08:00", owner: "Bùi Quốc Việt", lines: 14, qty: 420, items: [],
  },
  {
    id: "INB-2026-00126", type: "INB-NCC", sourceDoc: "PO-2026-1017", source: "Viettel Hi-Tech",
    warehouse: "HN01", hasTransport: true, hasKCS: true, hasPacking: false, hasVOffice: true,
    apiStatus: "OK", status: "Waiting Confirm", sla: "10h còn", slaPct: 22,
    plannedDate: "2026-05-18 15:30", owner: "Phạm Thị Hằng", lines: 9, qty: 264,
    vehicle: { code: "VT-2433", plate: "30H-902.55", driver: "Nguyễn Văn Sơn", phone: "0988 221 144", eta: "2026-05-18 15:30", vehicleStatus: "Chưa đến" },
    items: [
      { sku: "SWT-CORE-48", name: "Switch Core 48 port 10G", uom: "Cái", docQty: 8, recvQty: 0, diff: 0, kcs: "Pending", serial: true },
      { sku: "PWR-RECT-100A", name: "Bộ chỉnh lưu Rectifier 100A", uom: "Bộ", docQty: 16, recvQty: 0, diff: 0, kcs: "Pending" },
      { sku: "CAB-CAT6A", name: "Cáp CAT6A 305m", uom: "Cuộn", docQty: 40, recvQty: 0, diff: 0, kcs: "Pending" },
    ],
  },
  {
    id: "INB-2026-00127", type: "INB-NCC", sourceDoc: "PO-2026-1018", source: "Ericsson Vietnam",
    warehouse: "HN01", hasTransport: true, hasKCS: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Completed", sla: "—", slaPct: 100,
    plannedDate: "2026-05-16 09:00", owner: "Trần Văn Kho", lines: 11, qty: 286, items: [],
  },
  {
    id: "INB-2026-00128", type: "INB-NCC", sourceDoc: "PO-2026-1020", source: "CommScope",
    warehouse: "HN01", hasTransport: true, hasKCS: true, hasPacking: false, hasVOffice: true,
    apiStatus: "OK", status: "KCS Failed", sla: "Quá hạn 45p", slaPct: 110,
    plannedDate: "2026-05-17 14:00", owner: "Đỗ Minh Khôi", lines: 4, qty: 60, items: [],
  },
  {
    id: "INB-2026-00129", type: "INB-NCC", sourceDoc: "PO-2026-1021", source: "Fiberhome",
    warehouse: "HCM01", hasTransport: true, hasKCS: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Waiting VOffice", sla: "2h còn", slaPct: 70,
    plannedDate: "2026-05-18 12:00", owner: "Đỗ Minh Khôi", lines: 7, qty: 140, items: [],
  },
  {
    id: "INB-2026-00130", type: "INB-TRF", sourceDoc: "STO-S-N-201", source: "Kho HCM01",
    warehouse: "HN01", hasTransport: true, hasKCS: false, hasPacking: false, hasVOffice: false,
    apiStatus: "OK", status: "Rejected", sla: "—", slaPct: 0,
    plannedDate: "2026-05-17 10:00", owner: "Trần Văn Kho", lines: 3, qty: 36, items: [],
  },
];

export const inboundKPI = {
  todayTotal: 47, waitingConfirm: 6, waitingAssign: 4, inProgress: 18, waitingKCS: 5,
  waitingGR: 3, waitingSign: 4, packing: 2, putaway: 3, completed: 21,
  overdue: 4, apiErrors: 2,
};

export const leadTime = [
  { stage: "API sync", target: 5, actual: 4 },
  { stage: "Xác nhận", target: 15, actual: 12 },
  { stage: "Sinh task", target: 5, actual: 4 },
  { stage: "Dỡ hàng", target: 45, actual: 38 },
  { stage: "Kiểm hàng", target: 60, actual: 71 },
  { stage: "KCS", target: 120, actual: 145 },
  { stage: "Thực nhập", target: 10, actual: 8 },
  { stage: "Đóng gói", target: 35, actual: 30 },
  { stage: "Putaway", target: 25, actual: 28 },
];

export const orderTypeMix = [
  { label: "INB-NCC", value: 28, color: "hsl(var(--brand))" },
  { label: "INB-TRF", value: 12, color: "hsl(var(--info))" },
  { label: "INB-OTH", value: 7, color: "hsl(var(--warning))" },
];

export type Alert = { id: string; kind: string; severity: "high" | "med" | "low"; msg: string; ref: string; time: string };
export const alerts: Alert[] = [
  { id: "A-001", kind: "Task trễ KPI", severity: "high", msg: "Task TSK-9921 kiểm hàng quá hạn 2h15", ref: "INB-2026-00122", time: "2 phút trước" },
  { id: "A-002", kind: "Xe quá ETA", severity: "high", msg: "Xe VT-2418 trễ 14 phút so với ETA", ref: "INB-2026-00118", time: "10 phút trước" },
  { id: "A-003", kind: "Lỗi SAP", severity: "high", msg: "API6 lỗi 502 khi gửi T-AGR", ref: "INB-2026-00119", time: "15 phút trước" },
  { id: "A-004", kind: "KCS không đạt", severity: "med", msg: "4 RRU không đạt KCS – mức Major", ref: "INB-2026-00128", time: "30 phút trước" },
  { id: "A-005", kind: "Từ chối ký", severity: "med", msg: "VOffice trả từ chối – sai mã NCC", ref: "INB-2026-00129", time: "1 giờ trước" },
  { id: "A-006", kind: "Vị trí sai AI", severity: "low", msg: "Putaway override 3 HU – khác đề xuất AI", ref: "INB-2026-00125", time: "1 giờ trước" },
];

export const supplierIssues = [
  { name: "Ericsson Vietnam", orders: 18, diff: 4, late: 1, kcsFail: 0 },
  { name: "Huawei Tech", orders: 12, diff: 6, late: 3, kcsFail: 2 },
  { name: "Nokia Solutions", orders: 9, diff: 2, late: 2, kcsFail: 1 },
  { name: "CommScope", orders: 6, diff: 3, late: 1, kcsFail: 3 },
  { name: "Kho HCM01", orders: 14, diff: 1, late: 0, kcsFail: 0 },
];

export const staffPerformance = [
  { name: "Trần Văn Kho", role: "Thủ kho", shift: "S1", tasks: 14, done: 12, onTime: 11, overdue: 1 },
  { name: "Phạm Thị Hằng", role: "NV kho", shift: "S1", tasks: 10, done: 9, onTime: 9, overdue: 0 },
  { name: "Đỗ Minh Khôi", role: "NV kho", shift: "S1", tasks: 12, done: 10, onTime: 8, overdue: 2 },
  { name: "Bùi Quốc Việt", role: "NV putaway", shift: "S2", tasks: 9, done: 8, onTime: 8, overdue: 0 },
  { name: "Nguyễn Hữu An", role: "NV kiểm hàng", shift: "S2", tasks: 7, done: 5, onTime: 4, overdue: 1 },
  { name: "Lê Hoàng Nam", role: "NV KCS", shift: "S1", tasks: 6, done: 4, onTime: 3, overdue: 1 },
];

// (Wave model removed — Order-centric: task sinh trực tiếp từ Order qua Task Template)

// ============== Tasks ==============
// Loại task là tên (string) – nguồn duy nhất từ Danh mục task template.
export type TaskType = string;
export type TaskStatus = "Chưa bắt đầu" | "Đang xử lý" | "Pending" | "Quá hạn" | "Hoàn thành" | "Phát sinh" | "Chờ phân công";
export type Task = {
  id: string; code: string; type: TaskType; orderId: string; owner: string;
  zone: string; sla: string; slaPct: number; status: TaskStatus; exception?: string;
  startAt?: string; endAt?: string;
};

// Runtime defaults theo mã task của catalog (owner, zone, SLA, trạng thái mẫu).
export type RuntimeDefaults = { owner: string; zone: string; sla: string; slaPct: number; status: TaskStatus; cond?: (o: Order) => boolean; exception?: string; startAt?: string; endAt?: string };
export const INB_RUNTIME: Record<string, RuntimeDefaults> = {
  "T-NCC": { owner: "Trần Văn Kho",   zone: "VP Kho",     sla: "Hoàn thành",   slaPct: 100, status: "Hoàn thành", startAt: "08:30", endAt: "08:42" },
  "T-APR": { owner: "Trần Đăng Khoa", zone: "VP Kho",     sla: "Hoàn thành",   slaPct: 100, status: "Hoàn thành", startAt: "08:45", endAt: "08:52" },
  "T-UNL": { owner: "Phạm Thị Hằng",  zone: "Dock DK-03", sla: "12 phút còn",  slaPct: 78,  status: "Đang xử lý",   startAt: "09:15" },
  "T-HO":  { owner: "Nguyễn Hữu An",  zone: "Khu B01",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-MV1": { owner: "Phạm Thị Hằng",  zone: "Khu B01",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-AGR": { owner: "Trần Văn Kho",   zone: "VP Kho",     sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-SIG": { owner: "Giám đốc kho",   zone: "VOffice",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu", cond: (o) => o.hasVOffice },
  "T-MV2": { owner: "Phạm Thị Hằng",  zone: "Khu C01",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-PAC": { owner: "Mai Thị Lan",    zone: "Khu C01",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-MV3": { owner: "Bùi Quốc Việt",  zone: "Khu G01",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-KPI": { owner: "Trần Đăng Khoa", zone: "VP Kho",     sla: "Định kỳ tháng",slaPct: 0,   status: "Chưa bắt đầu" },
  "T-WH":  { owner: "Trần Văn Kho",   zone: "VP Kho",     sla: "Liên tục",     slaPct: 30,  status: "Đang xử lý",   startAt: "07:00" },
  "T-SCR": { owner: "Vũ Anh Tuấn",    zone: "Cổng A",     sla: "Liên tục",     slaPct: 30,  status: "Đang xử lý",   startAt: "07:00" },
};

// `tasks` được khởi tạo sau khi `taskCatalog` được khai báo (xem cuối file).
export const tasks: Task[] = [];


// ============== API Logs ==============
export type ApiLog = {
  id: string; code: "T-API1" | "API-ACCEPT" | "API-REJECT" | "API-KCS-REQ" | "API-KCS-RES" | "API6" | "API-VOFFICE";
  order: string; reqTime: string; resTime?: string; status: "200" | "201" | "400" | "401" | "404" | "500" | "502";
  errorCode?: string; retry: number; lastRetry?: string; note: string;
};
export const apiLogs: ApiLog[] = [
  { id: "LOG-44021", code: "T-API1", order: "INB-2026-00118", reqTime: "2026-05-18 08:01:12", resTime: "2026-05-18 08:01:13", status: "200", retry: 0, note: "Nhận lệnh từ SAP OK" },
  { id: "LOG-44022", code: "API-ACCEPT", order: "INB-2026-00118", reqTime: "2026-05-18 08:12:30", resTime: "2026-05-18 08:12:31", status: "200", retry: 0, note: "Thủ kho đồng ý nhận" },
  { id: "LOG-44023", code: "T-API1", order: "INB-2026-00119", reqTime: "2026-05-18 08:15:02", resTime: "2026-05-18 08:15:04", status: "400", errorCode: "INVALID_SKU", retry: 2, lastRetry: "08:30", note: "Mã hàng BBU-XXX không tồn tại" },
  { id: "LOG-44024", code: "API-KCS-REQ", order: "INB-2026-00122", reqTime: "2026-05-18 09:00", resTime: "2026-05-18 09:00:01", status: "200", retry: 0, note: "Gửi yêu cầu KCS 6 dòng" },
  { id: "LOG-44025", code: "API-KCS-RES", order: "INB-2026-00128", reqTime: "2026-05-18 10:22:18", resTime: "2026-05-18 10:22:19", status: "200", retry: 0, note: "KCS trả: 4 không đạt – Major" },
  { id: "LOG-44026", code: "API6", order: "INB-2026-00119", reqTime: "2026-05-18 10:45", resTime: "2026-05-18 10:45:08", status: "502", errorCode: "BAD_GATEWAY", retry: 3, lastRetry: "10:55", note: "SAP T-AGR timeout" },
  { id: "LOG-44027", code: "API6", order: "INB-2026-00123", reqTime: "2026-05-18 11:02", resTime: "2026-05-18 11:02:04", status: "200", retry: 0, note: "Trả số phiếu GR-2026-008812" },
  { id: "LOG-44028", code: "API-VOFFICE", order: "INB-2026-00129", reqTime: "2026-05-18 11:30:11", resTime: "2026-05-18 11:30:12", status: "200", retry: 0, note: "Trình ký VOffice OK" },
  { id: "LOG-44029", code: "API-REJECT", order: "INB-2026-00130", reqTime: "2026-05-17 10:40", resTime: "2026-05-17 10:40:01", status: "200", retry: 0, note: "Từ chối – sai số lượng chứng từ" },
];

// ============== Transactions ==============
export type Txn = {
  id: string; kind: string; target: string; before: string; after: string;
  beforeLoc?: string; afterLoc?: string; user: string; task?: string; time: string; note?: string;
};
export const txns: Txn[] = [
  { id: "TX-880021", kind: "GR Posted", target: "Order INB-2026-00118", before: "Ready for GR", after: "GR Posted", user: "API6", task: "TSK-9926", time: "2026-05-18 11:02", note: "Số phiếu GR-2026-008812" },
  { id: "TX-880022", kind: "Putaway", target: "HU-001", before: "B01", after: "G01-T02-B05", beforeLoc: "B01", afterLoc: "G01-T02-B05", user: "Bùi Quốc Việt", task: "TSK-9929", time: "2026-05-18 11:18" },
  { id: "TX-880023", kind: "Override vị trí", target: "HU-003", before: "Đề xuất I02-T01-B04", after: "I01-T01-B12", user: "Bùi Quốc Việt", task: "TSK-9929", time: "2026-05-18 11:22", note: "Bin đề xuất bị block" },
  { id: "TX-880024", kind: "Chênh lệch", target: "Line CAB-FO-LC", before: "200", after: "198", user: "Nguyễn Hữu An", task: "TSK-9922", time: "2026-05-18 10:55", note: "Thiếu 2 cuộn" },
];

// ============== Exceptions ==============
export type Exception = {
  id: string; group: string; ref: string; severity: "low" | "med" | "high"; owner: string;
  status: "Mới" | "Đang xử lý" | "Đã xử lý" | "Treo"; deadline: string; createdAt: string; note: string;
};
export const exceptions: Exception[] = [
  { id: "EX-2201", group: "Lỗi API", ref: "INB-2026-00119", severity: "high", owner: "IT WMS", status: "Đang xử lý", deadline: "2026-05-18 14:00", createdAt: "08:15", note: "API6 502 – đã retry 3 lần" },
  { id: "EX-2202", group: "Xe quá ETA", ref: "INB-2026-00118", severity: "med", owner: "Điều phối", status: "Đã xử lý", deadline: "—", createdAt: "09:14", note: "Xe đã đến, trễ 14 phút" },
  { id: "EX-2203", group: "Thiếu hàng", ref: "INB-2026-00118 / CAB-FO-LC", severity: "med", owner: "Trần Văn Kho", status: "Đang xử lý", deadline: "2026-05-18 16:00", createdAt: "10:55", note: "Thiếu 2 cuộn so chứng từ" },
  { id: "EX-2204", group: "KCS không đạt", ref: "INB-2026-00128", severity: "high", owner: "Lê Hoàng Nam", status: "Đang xử lý", deadline: "2026-05-18 18:00", createdAt: "10:22", note: "4 RRU – Major, dự kiến trả hàng" },
  { id: "EX-2205", group: "Từ chối ký", ref: "INB-2026-00129", severity: "med", owner: "Thủ kho", status: "Mới", deadline: "2026-05-18 17:00", createdAt: "11:35", note: "VOffice trả: sai mã NCC trên phiếu" },
  { id: "EX-2206", group: "Putaway sai bin", ref: "HU-003", severity: "low", owner: "Bùi Quốc Việt", status: "Đã xử lý", deadline: "—", createdAt: "11:22", note: "Đã override với lý do hợp lệ" },
  { id: "EX-2207", group: "Task quá hạn", ref: "TSK-9924", severity: "high", owner: "Lê Hoàng Nam", status: "Treo", deadline: "2026-05-18 13:00", createdAt: "09:00", note: "KCS chậm do chờ thiết bị đo" },
];

// ============== Lookup helpers ==============
export const getOrder = (id: string) => orders.find((o) => o.id === id) || orders[0];

export const getTask = (id: string) => tasks.find((t) => t.id === id) || tasks[0];

/* ═══════════════════════════════════════════════════════════════════
   ORDER-CENTRIC MODEL (no Wave) — Master Data & Configuration
   ═══════════════════════════════════════════════════════════════════ */

// === Employees synced from SAP/HR ===
export type Employee = {
  code: string; name: string; dept: string; titleSap: string;
  phone: string; email: string; active: boolean;
  defaultWh: string; allowedWhs: string[];
  shift: "S1" | "S2" | "S3";
  current: "Rảnh" | "Bận" | "Nghỉ" | "Hỗ trợ kho khác";
  certs: string[]; lastSync: string; load: number; // số task đang nhận
};
export const employees: Employee[] = [
  { code: "VTH-00231", name: "Trần Văn Kho", dept: "Vận hành kho HN", titleSap: "Thủ kho", phone: "0912 884 100", email: "kho.tv@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01","BN01"], shift: "S1", current: "Bận", certs: ["Ký chứng từ","Xe nâng"], lastSync: "2026-05-18 06:00", load: 4 },
  { code: "VTH-00455", name: "Phạm Thị Hằng", dept: "Vận hành kho HN", titleSap: "NV kho", phone: "0936 112 884", email: "hang.pt@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01"], shift: "S1", current: "Rảnh", certs: ["Kiểm hàng","Đóng gói"], lastSync: "2026-05-18 06:00", load: 2 },
  { code: "VTH-00612", name: "Nguyễn Hữu An", dept: "Vận hành kho HN", titleSap: "NV kiểm hàng", phone: "0976 220 411", email: "an.nh@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01","HP01"], shift: "S2", current: "Rảnh", certs: ["Kiểm hàng","Scan RFID"], lastSync: "2026-05-18 06:00", load: 1 },
  { code: "VTH-00713", name: "Lê Hoàng Nam", dept: "KCS Trung tâm", titleSap: "NV KCS", phone: "0987 401 220", email: "nam.lh@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01","HCM01"], shift: "S1", current: "Bận", certs: ["KCS thiết bị","KCS điện tử"], lastSync: "2026-05-18 06:00", load: 3 },
  { code: "VTH-00891", name: "Bùi Quốc Việt", dept: "Vận hành kho HN", titleSap: "NV putaway", phone: "0902 776 119", email: "viet.bq@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01"], shift: "S2", current: "Rảnh", certs: ["Xe nâng","Xe cẩu"], lastSync: "2026-05-18 06:00", load: 1 },
  { code: "VTH-00902", name: "Đỗ Minh Khôi", dept: "Vận hành kho HCM", titleSap: "NV kho", phone: "0918 552 008", email: "khoi.dm@viettel.com.vn", active: true, defaultWh: "HCM01", allowedWhs: ["HCM01"], shift: "S1", current: "Bận", certs: ["Kiểm hàng","Ký chứng từ"], lastSync: "2026-05-18 06:00", load: 3 },
  { code: "VTH-00978", name: "Nguyễn Hữu An (Phụ)", dept: "Chứng từ kho HN", titleSap: "NS chứng từ", phone: "0915 442 003", email: "an.nh2@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01"], shift: "S1", current: "Rảnh", certs: ["Chứng từ","VOffice"], lastSync: "2026-05-18 06:00", load: 0 },
  { code: "VTH-01122", name: "Vũ Anh Tuấn", dept: "Bảo vệ HN", titleSap: "Bảo vệ", phone: "0938 110 207", email: "tuan.va@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01"], shift: "S1", current: "Rảnh", certs: ["Cổng kho"], lastSync: "2026-05-18 06:00", load: 0 },
  { code: "VTH-01158", name: "Mai Thị Lan", dept: "Đóng gói HN", titleSap: "NV đóng gói", phone: "0961 887 003", email: "lan.mt@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01"], shift: "S1", current: "Rảnh", certs: ["Đóng gói","In tem"], lastSync: "2026-05-18 06:00", load: 1 },
  { code: "VTH-01199", name: "Hoàng Văn Tùng", dept: "Vận hành kho HN", titleSap: "NV kho", phone: "0904 220 559", email: "tung.hv@viettel.com.vn", active: false, defaultWh: "HN01", allowedWhs: ["HN01"], shift: "S2", current: "Nghỉ", certs: [], lastSync: "2026-05-17 06:00", load: 0 },
  { code: "VTH-01205", name: "Trần Đăng Khoa", dept: "Ban GĐ kho HN",  titleSap: "Giám đốc kho", phone: "0913 552 110", email: "khoa.td@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01"], shift: "S1", current: "Bận", certs: ["Ký chứng từ","Phê duyệt cấp cao"], lastSync: "2026-05-18 06:00", load: 2 },
  { code: "VTH-01310", name: "Lê Quang Huy",   dept: "Ban GĐ kho tỉnh", titleSap: "QL kho tỉnh", phone: "0944 882 011", email: "huy.lq@viettel.com.vn", active: true, defaultWh: "HCM01", allowedWhs: ["HCM01","DN01"], shift: "S1", current: "Rảnh", certs: ["Ký chứng từ"], lastSync: "2026-05-18 06:00", load: 1 },
  { code: "VTH-01411", name: "Phạm Văn Đạt",   dept: "Đội xe vận chuyển", titleSap: "Lái xe vận chuyển", phone: "0987 221 008", email: "dat.pv@viettel.com.vn", active: true, defaultWh: "HN01", allowedWhs: ["HN01","HCM01"], shift: "S1", current: "Bận", certs: ["GPLX C","An toàn vận tải"], lastSync: "2026-05-18 06:00", load: 1 },
];

// === Operational positions (chức danh vận hành) ===
export type Position = {
  code: string; name: string; desc: string; warehouses: string[]; active: boolean;
  certsRequired: string[]; effective: string;
};
export const positions: Position[] = [
  { code: "POS-GDK", name: "Giám đốc kho", desc: "Phụ trách toàn bộ kho, phê duyệt cấp cao", warehouses: ["HN01","HCM01","DN01"], active: true, certsRequired: ["Ký chứng từ"], effective: "01/01/2024 –" },
  { code: "POS-TK",  name: "Thủ kho", desc: "Quản lý vận hành nhập/xuất, ký BBBG, ký chứng từ", warehouses: ["HN01","HCM01","DN01"], active: true, certsRequired: ["Ký chứng từ"], effective: "01/01/2024 –" },
  { code: "POS-NVK", name: "Nhân viên kho", desc: "Dỡ hàng, kiểm hàng, putaway", warehouses: ["HN01","HCM01"], active: true, certsRequired: [], effective: "01/01/2024 –" },
  { code: "POS-KH",  name: "Nhân viên kiểm hàng", desc: "Chuyên kiểm hàng theo BBBG", warehouses: ["HN01","HCM01"], active: true, certsRequired: ["Kiểm hàng"], effective: "01/01/2024 –" },
  { code: "POS-KCS", name: "Nhân viên KCS", desc: "Kiểm tra chất lượng", warehouses: ["HN01","HCM01"], active: true, certsRequired: ["KCS thiết bị"], effective: "01/01/2024 –" },
  { code: "POS-PKG", name: "Nhân viên đóng gói", desc: "Đóng gói, in tem, tạo HU/Pallet/Thùng", warehouses: ["HN01"], active: true, certsRequired: ["Đóng gói"], effective: "01/01/2024 –" },
  { code: "POS-FL",  name: "Lái xe nâng", desc: "Vận chuyển hàng nội bộ, putaway", warehouses: ["HN01","HCM01"], active: true, certsRequired: ["Xe nâng"], effective: "01/01/2024 –" },
  { code: "POS-CR",  name: "Lái xe cẩu", desc: "Cẩu hàng nặng", warehouses: ["HN01"], active: true, certsRequired: ["Xe cẩu"], effective: "01/01/2024 –" },
  { code: "POS-GATE",name: "Bảo vệ / Cổng kho (BVAN)", desc: "Ghi nhận xe vào/ra, giám sát an ninh", warehouses: ["HN01","HCM01","DN01"], active: true, certsRequired: ["Cổng kho"], effective: "01/01/2024 –" },
  { code: "POS-DOC", name: "Nhân sự chứng từ", desc: "Theo dõi ký VOffice, xử lý chứng từ từ chối", warehouses: ["HN01","HCM01"], active: true, certsRequired: ["VOffice"], effective: "01/01/2024 –" },
  { code: "POS-QLT", name: "QL kho tỉnh", desc: "Quản lý kho tỉnh, duyệt giao việc & KPI cấp tỉnh", warehouses: ["HCM01","DN01"], active: true, certsRequired: ["Ký chứng từ"], effective: "01/01/2024 –" },
  { code: "POS-DRV", name: "Lái xe vận chuyển", desc: "Lái xe vận chuyển giữa các kho / khách hàng", warehouses: ["HN01","HCM01","DN01"], active: true, certsRequired: ["GPLX C"], effective: "01/01/2024 –" },
  { code: "POS-GSDRV", name: "Giám sát lái xe", desc: "Giám sát đội xe vận chuyển", warehouses: ["HN01","HCM01"], active: true, certsRequired: [], effective: "01/01/2024 –" },
];

// === Task catalog (configurable templates) ===
export type TaskKind = "Human" | "System" | "API" | "AI" | "Approval";
export type TaskModule = "Nhập kho" | "Xuất kho";
export type TaskFlow = OrderType | "OUT-VC" | "OUT-OTH";
export type TaskCatalog = {
  code: string; name: string; module: TaskModule; flows: TaskFlow[]; kind: TaskKind;
  desc: string; trigger: string; allowedPositions: string[];
  kpiMin: number;        // Thời gian chuẩn (KPI) – cấu hình thủ công ban đầu
  leadTimeMin: number;   // Lead time tham chiếu – AI tự tính từ dữ liệu thực tế (khối lượng/trọng lượng đơn hàng)
  leadTimeMode?: "Manual" | "AI";  // Cách xác định Lead time
  dependsOn: string[]; evidence: string[]; active: boolean;
};
export const taskCatalog: TaskCatalog[] = [
  // ───────── Nhập kho – NCC & NCK (theo spec nghiệp vụ 2026) ─────────
  { code: "T-NCC",  name: "Check lệnh NCC",                        module: "Nhập kho", flows: ["INB-NCC","INB-TRF"],                            kind: "Approval", desc: "Thủ kho kiểm tra lệnh nhập từ SAP/VERP",                  trigger: "API1 trả lệnh",                allowedPositions: ["POS-TK"],                    kpiMin: 15, leadTimeMin: 18, leadTimeMode: "Manual", dependsOn: [],          evidence: [], active: true },
  { code: "T-APR",  name: "Duyệt lịch giao việc",                  module: "Nhập kho", flows: ["INB-NCC","INB-TRF","OUT-VC","OUT-OTH"],         kind: "Approval", desc: "GĐ kho duyệt danh sách giao việc đã đề xuất",            trigger: "Sau khi AI đề xuất",           allowedPositions: ["POS-GDK","POS-QLT"],         kpiMin: 10, leadTimeMin: 12, leadTimeMode: "Manual", dependsOn: ["T-NCC"],   evidence: [], active: true },
  { code: "T-HO",   name: "Kiểm hàng - ký bàn giao",               module: "Nhập kho", flows: ["INB-NCC","INB-TRF","OUT-VC","OUT-OTH"],         kind: "Human",    desc: "Kiểm SL/tình trạng theo niêm phong và ký BBBG (1 người)", trigger: "Sau dỡ hàng",                  allowedPositions: ["POS-NVK","POS-TK","POS-KH"], kpiMin: 70, leadTimeMin: 85, leadTimeMode: "AI",     dependsOn: ["T-UNL"],   evidence: ["Ảnh","Chữ ký","Ảnh BBBG"], active: true },
  { code: "T-UNL",  name: "Dỡ hàng",                                module: "Nhập kho", flows: ["INB-NCC","INB-TRF"],                            kind: "Human",    desc: "Dỡ hàng từ xe xuống dock (chỉ view dữ liệu)",             trigger: "Xe đã đến",                    allowedPositions: ["POS-NVK","POS-FL"],          kpiMin: 45, leadTimeMin: 52, leadTimeMode: "AI",     dependsOn: ["T-APR"],   evidence: ["Ảnh"], active: true },
  { code: "T-MV1",  name: "Đưa vào khu chờ nhập",                   module: "Nhập kho", flows: ["INB-NCC","INB-TRF"],                            kind: "Human",    desc: "Chuyển hàng đã kiểm sang khu chờ thực nhập",              trigger: "Sau T-HO",                     allowedPositions: ["POS-NVK","POS-FL"],          kpiMin: 15, leadTimeMin: 18, leadTimeMode: "AI",     dependsOn: ["T-HO"],    evidence: [], active: true },
  { code: "T-AGR",  name: "Thực nhập kho",                          module: "Nhập kho", flows: ["INB-NCC","INB-TRF"],                            kind: "Human",    desc: "Thủ kho xác nhận thực nhập – sinh phiếu nhập",            trigger: "Sau khi vào khu chờ nhập",     allowedPositions: ["POS-TK"],                    kpiMin: 10, leadTimeMin: 12, leadTimeMode: "Manual", dependsOn: ["T-MV1"],   evidence: ["Phiếu nhập"], active: true },
  { code: "T-SIG",  name: "Ký voffice",                             module: "Nhập kho", flows: ["INB-NCC","INB-TRF","OUT-VC","OUT-OTH"],         kind: "Human",    desc: "Trình ký phiếu nhập / xuất trên VOffice",                 trigger: "Có phiếu nhập/xuất",           allowedPositions: ["POS-TK","POS-GDK"],          kpiMin: 30, leadTimeMin: 35, leadTimeMode: "Manual", dependsOn: ["T-AGR"],   evidence: ["File ký"], active: true },
  { code: "T-MV2",  name: "Đưa sang khu đóng gói",                  module: "Nhập kho", flows: ["INB-NCC","INB-TRF"],                            kind: "Human",    desc: "Vận chuyển hàng sang khu đóng gói",                       trigger: "Sau T-SIG",                    allowedPositions: ["POS-NVK","POS-FL"],          kpiMin: 15, leadTimeMin: 18, leadTimeMode: "AI",     dependsOn: ["T-SIG"],   evidence: [], active: true },
  { code: "T-PAC",  name: "Đóng gói hàng",                          module: "Nhập kho", flows: ["INB-NCC","INB-TRF","OUT-OTH"],                  kind: "Human",    desc: "Đóng gói, gắn tem RFID/barcode, tạo HU",                  trigger: "Sau khi đưa sang khu đóng gói", allowedPositions: ["POS-NVK","POS-PKG"],        kpiMin: 30, leadTimeMin: 38, leadTimeMode: "AI",     dependsOn: ["T-MV2"],   evidence: ["Tem"], active: true },
  { code: "T-MV3",  name: "Đưa vào lưu trữ",                        module: "Nhập kho", flows: ["INB-NCC","INB-TRF"],                            kind: "Human",    desc: "Putaway vào vị trí lưu trữ đã đề xuất",                   trigger: "Sau T-PAC",                    allowedPositions: ["POS-NVK","POS-FL"],          kpiMin: 25, leadTimeMin: 30, leadTimeMode: "AI",     dependsOn: ["T-PAC"],   evidence: ["Scan vị trí"], active: true },
  { code: "T-KPI",  name: "Tự đánh giá KPI tháng",                  module: "Nhập kho", flows: ["INB-NCC","INB-TRF"],                            kind: "Approval", desc: "GĐ kho / QL kho tỉnh tự đánh giá KPI vận hành tháng",     trigger: "Định kỳ cuối tháng",           allowedPositions: ["POS-GDK","POS-QLT"],         kpiMin: 60, leadTimeMin: 60, leadTimeMode: "Manual", dependsOn: [],          evidence: ["Báo cáo KPI"], active: true },
  { code: "T-WH",   name: "Giám sát lệnh",                          module: "Nhập kho", flows: ["INB-NCC","INB-TRF","OUT-VC","OUT-OTH"],         kind: "Human",    desc: "Thủ kho giám sát toàn bộ vòng đời lệnh",                  trigger: "Khi có lệnh chạy",             allowedPositions: ["POS-TK"],                    kpiMin: 5,  leadTimeMin: 5,  leadTimeMode: "Manual", dependsOn: [],          evidence: [], active: true },
  { code: "T-SCR",  name: "Giám sát an ninh",                       module: "Nhập kho", flows: ["INB-NCC","INB-TRF","OUT-VC","OUT-OTH"],         kind: "Human",    desc: "Bảo vệ giám sát cổng / camera",                           trigger: "Liên tục",                     allowedPositions: ["POS-GATE"],                  kpiMin: 5,  leadTimeMin: 5,  leadTimeMode: "Manual", dependsOn: [],          evidence: ["Ảnh"], active: true },

  // ───────── Xuất kho – Vận chuyển & Xuất khác (theo spec nghiệp vụ 2026) ─────────
  { code: "T-GI",   name: "Check lệnh xuất kho",                    module: "Xuất kho", flows: ["OUT-VC","OUT-OTH"],                             kind: "Approval", desc: "Thủ kho kiểm tra lệnh xuất từ SAP/VERP",                  trigger: "API1 trả lệnh xuất",           allowedPositions: ["POS-TK"],                    kpiMin: 15, leadTimeMin: 18, leadTimeMode: "Manual", dependsOn: [],          evidence: [], active: true },
  { code: "T-MV4",  name: "Lấy hàng ra khu đóng gói",               module: "Xuất kho", flows: ["OUT-VC","OUT-OTH"],                             kind: "Human",    desc: "Pick hàng từ vị trí lưu trữ đưa ra khu đóng gói",         trigger: "Sau T-APR",                    allowedPositions: ["POS-NVK","POS-FL","POS-TK"], kpiMin: 45, leadTimeMin: 55, leadTimeMode: "AI",     dependsOn: ["T-APR"],   evidence: ["Scan vị trí"], active: true },
  { code: "T-MV5",  name: "Đưa sang khu chờ xuất",                  module: "Xuất kho", flows: ["OUT-VC","OUT-OTH"],                             kind: "Human",    desc: "Chuyển hàng sang khu chờ xuất (sau đóng gói nếu có)",     trigger: "Sau T-PAC/T-MV4",              allowedPositions: ["POS-NVK","POS-FL"],          kpiMin: 15, leadTimeMin: 18, leadTimeMode: "AI",     dependsOn: ["T-PAC"],   evidence: [], active: true },
  { code: "T-LDG",  name: "Tải hàng lên xe",                        module: "Xuất kho", flows: ["OUT-VC","OUT-OTH"],                             kind: "Human",    desc: "Bốc xếp hàng lên xe vận chuyển / xe nhận hàng",           trigger: "Xe đã đến và kiểm xong",       allowedPositions: ["POS-FL"],                    kpiMin: 30, leadTimeMin: 38, leadTimeMode: "AI",     dependsOn: ["T-HO"],    evidence: ["Ảnh xe"], active: true },
  { code: "T-AGI",  name: "Thực xuất kho",                          module: "Xuất kho", flows: ["OUT-VC","OUT-OTH"],                             kind: "Human",    desc: "Thủ kho xác nhận thực xuất – sinh phiếu xuất T-AGI",      trigger: "Sau khi tải hàng lên xe",      allowedPositions: ["POS-TK"],                    kpiMin: 10, leadTimeMin: 12, leadTimeMode: "Manual", dependsOn: ["T-LDG"],   evidence: ["Phiếu xuất"], active: true },


  // Ghi chú: nghiệp vụ Xe / Cổng kho được xử lý qua panel "Xe / Cổng kho" trong Order detail,
  // không sinh task riêng trong catalog các luồng nhập/xuất.
];

// === Thứ tự thực hiện task theo từng luồng nghiệp vụ (BPMN 2026) ===
export const FLOW_TASK_ORDER: Record<string, string[]> = {
  "INB-NCC": ["T-NCC","T-APR","T-HO","T-UNL","T-MV1","T-AGR","T-SIG","T-MV2","T-PAC","T-MV3","T-KPI","T-WH","T-SCR"],
  "INB-TRF": ["T-NCC","T-APR","T-HO","T-UNL","T-MV1","T-AGR","T-SIG","T-MV2","T-PAC","T-MV3","T-KPI","T-WH","T-SCR"],
  "OUT-OTH": ["T-GI","T-APR","T-MV4","T-PAC","T-MV5","T-HO","T-LDG","T-AGI","T-SIG","T-WH","T-SCR"],
  "OUT-VC":  ["T-GI","T-APR","T-MV4","T-MV5","T-HO","T-LDG","T-AGI","T-SIG","T-WH","T-SCR"],
};

// Lấy thứ tự (1-based) của task trong 1 luồng. Trả 999 nếu không thuộc luồng.
export const getTaskOrderInFlow = (taskCode: string, flow: string): number => {
  const seq = FLOW_TASK_ORDER[flow];
  if (!seq) return 999;
  const i = seq.indexOf(taskCode);
  return i < 0 ? 999 : i + 1;
};

// === Employee × Warehouse × Position mapping (BPMN role table) ===
export type Mapping = {
  id: string; empCode: string; empName: string; warehouse: string;
  positionCode: string; positionName: string;
  role: "Chính" | "Phụ" | "Hỗ trợ"; from: string; to?: string; active: boolean;
};
export const mappings: Mapping[] = [
  { id: "MAP-001", empCode: "VTH-00231", empName: "Trần Văn Kho",   warehouse: "HN01", positionCode: "POS-TK",  positionName: "Thủ kho",             role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-002", empCode: "VTH-00231", empName: "Trần Văn Kho",   warehouse: "BN01", positionCode: "POS-TK",  positionName: "Thủ kho hỗ trợ",      role: "Hỗ trợ",  from: "01/05/2026", to: "31/05/2026", active: true },
  { id: "MAP-003", empCode: "VTH-00455", empName: "Phạm Thị Hằng",  warehouse: "HN01", positionCode: "POS-NVK", positionName: "Nhân viên kho",       role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-004", empCode: "VTH-00612", empName: "Nguyễn Hữu An",  warehouse: "HN01", positionCode: "POS-KH",  positionName: "Nhân viên kiểm hàng", role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-005", empCode: "VTH-00713", empName: "Lê Hoàng Nam",   warehouse: "HN01", positionCode: "POS-KCS", positionName: "Nhân viên KCS",       role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-006", empCode: "VTH-00891", empName: "Bùi Quốc Việt",  warehouse: "HN01", positionCode: "POS-FL",  positionName: "Lái xe nâng",         role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-007", empCode: "VTH-00902", empName: "Đỗ Minh Khôi",   warehouse: "HCM01",positionCode: "POS-NVK", positionName: "Nhân viên kho",       role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-008", empCode: "VTH-00978", empName: "Nguyễn Hữu An (Phụ)", warehouse: "HN01", positionCode: "POS-DOC", positionName: "NS chứng từ",    role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-009", empCode: "VTH-01122", empName: "Vũ Anh Tuấn",    warehouse: "HN01", positionCode: "POS-GATE",positionName: "Bảo vệ cổng (BVAN)",  role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-010", empCode: "VTH-01158", empName: "Mai Thị Lan",    warehouse: "HN01", positionCode: "POS-PKG", positionName: "NV đóng gói",         role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-011", empCode: "VTH-01205", empName: "Trần Đăng Khoa", warehouse: "HN01", positionCode: "POS-GDK", positionName: "Giám đốc kho HN",     role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-012", empCode: "VTH-01310", empName: "Lê Quang Huy",   warehouse: "HCM01",positionCode: "POS-QLT", positionName: "QL kho tỉnh HCM",     role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-013", empCode: "VTH-01411", empName: "Phạm Văn Đạt",   warehouse: "HN01", positionCode: "POS-DRV", positionName: "Lái xe vận chuyển",   role: "Chính",   from: "01/01/2024", active: true },
  { id: "MAP-014", empCode: "VTH-01122", empName: "Vũ Anh Tuấn",    warehouse: "HN01", positionCode: "POS-GSDRV",positionName: "Giám sát lái xe",    role: "Phụ",     from: "01/01/2024", active: true },
];

// === Order-centric KPI (no wave) ===
export const inboundKPI2 = {
  todayTotal: 47, waitingConfirm: 6, rejected: 2, waitingAssign: 5, planning: 3,
  receiving: 4, checking: 6, waitingKCS: 5, kcsFailed: 2, waitingGR: 3,
  grApiError: 1, waitingVOffice: 4, packing: 2, waitingPutaway: 3, completed: 21, overdue: 4,
};

// Lookup helpers for new entities
export const getEmployee = (code: string) => employees.find((e) => e.code === code) || employees[0];
export const getPosition = (code: string) => positions.find((p) => p.code === code) || positions[0];
export const getTaskCatalog = (code: string) => taskCatalog.find((t) => t.code === code) || taskCatalog[0];

// Generated tasks per Order (Order-centric, no wave reference)
export type OrderTask = {
  id: string; code: string; name: string; orderId: string; line?: string;
  kind: TaskKind; positionRequired: string; suggestedEmps: { code: string; name: string; score: number; reason: string }[];
  assignee?: string; assigneeName?: string; status: "Chưa phân công" | "Đã phân công" | "Đang xử lý" | "Hoàn thành" | "Quá hạn";
  kpiMin: number; deadline: string;
};
export const orderTasks: OrderTask[] = [
  { id: "T-118-01", code: "INB_GATE",       name: "Xác nhận xe VT-2418",       orderId: "INB-2026-00118", kind: "Human", positionRequired: "POS-GATE", suggestedEmps: [{ code: "VTH-01122", name: "Vũ Anh Tuấn", score: 98, reason: "Ca S1, kho HN01, rảnh" }], assignee: "VTH-01122", assigneeName: "Vũ Anh Tuấn", status: "Hoàn thành", kpiMin: 5, deadline: "09:05" },
  { id: "T-118-02", code: "INB_UNLOAD",     name: "Dỡ hàng Dock DK-03",        orderId: "INB-2026-00118", kind: "Human", positionRequired: "POS-NVK",  suggestedEmps: [{ code: "VTH-00455", name: "Phạm Thị Hằng", score: 92, reason: "Ca S1, rảnh, đã làm 12 task Ericsson" }, { code: "VTH-00891", name: "Bùi Quốc Việt", score: 88, reason: "Có chứng chỉ xe nâng" }], assignee: "VTH-00455", assigneeName: "Phạm Thị Hằng", status: "Đang xử lý", kpiMin: 45, deadline: "10:00" },
  { id: "T-118-03", code: "INB_CHECK",      name: "Kiểm hàng & Ký BBBG (12 dòng)", orderId: "INB-2026-00118", kind: "Human", positionRequired: "POS-KH",   suggestedEmps: [{ code: "VTH-00612", name: "Nguyễn Hữu An", score: 95, reason: "Chứng chỉ kiểm hàng + scan RFID + ký BBBG" }], assignee: "VTH-00612", assigneeName: "Nguyễn Hữu An", status: "Đã phân công", kpiMin: 70, deadline: "11:10" },
  { id: "T-118-05", code: "INB_KCS_REQUEST",name: "Gửi yêu cầu KCS 6 dòng",    orderId: "INB-2026-00118", kind: "API",   positionRequired: "—",        suggestedEmps: [], status: "Chưa phân công", kpiMin: 2, deadline: "11:12" },
  { id: "T-118-06", code: "INB_KCS_RESULT", name: "Chờ kết quả KCS",           orderId: "INB-2026-00118", kind: "API",   positionRequired: "—",        suggestedEmps: [], status: "Chưa phân công", kpiMin: 120, deadline: "13:12" },
  { id: "T-118-07", code: "INB_GR",         name: "Thực nhập T-AGR",           orderId: "INB-2026-00118", kind: "Human", positionRequired: "POS-TK",   suggestedEmps: [{ code: "VTH-00231", name: "Trần Văn Kho", score: 99, reason: "Thủ kho chính" }], status: "Chưa phân công", kpiMin: 10, deadline: "13:25" },
  { id: "T-118-08", code: "INB_GR_API",     name: "Gửi API6 lấy phiếu nhập",   orderId: "INB-2026-00118", kind: "API",   positionRequired: "—",        suggestedEmps: [], status: "Chưa phân công", kpiMin: 2, deadline: "13:27" },
  { id: "T-118-09", code: "INB_VOFFICE_SIGN",name: "Ký VOffice phiếu nhập",    orderId: "INB-2026-00118", kind: "Human", positionRequired: "POS-DOC",  suggestedEmps: [{ code: "VTH-00978", name: "Nguyễn Hữu An (Phụ)", score: 90, reason: "NS chứng từ" }], status: "Chưa phân công", kpiMin: 30, deadline: "14:00" },
  { id: "T-118-10", code: "INB_PACK",       name: "Đóng gói / Tem HU",         orderId: "INB-2026-00118", kind: "Human", positionRequired: "POS-PKG",  suggestedEmps: [{ code: "VTH-01158", name: "Mai Thị Lan", score: 96, reason: "Chứng chỉ đóng gói" }], status: "Chưa phân công", kpiMin: 30, deadline: "14:30" },
  { id: "T-118-11", code: "INB_PUTAWAY",    name: "Putaway 12 HU",             orderId: "INB-2026-00118", kind: "Human", positionRequired: "POS-FL",   suggestedEmps: [{ code: "VTH-00891", name: "Bùi Quốc Việt", score: 97, reason: "Xe nâng, rảnh" }], status: "Chưa phân công", kpiMin: 25, deadline: "15:00" },
];

// ============== Sinh task nhập kho theo Danh mục task template ==============
// Nguồn duy nhất: taskCatalog (lọc theo module + flow của Order).
let __tid = 9920;
const inbCatalog = taskCatalog.filter((t) => t.module === "Nhập kho");
orders.forEach((o) => {
  inbCatalog
    .filter((t) => t.flows.includes(o.type))
    .filter((t) => {
      const r = INB_RUNTIME[t.code];
      return !r?.cond || r.cond(o);
    })
    .forEach((t) => {
      const r = INB_RUNTIME[t.code] || { owner: "—", zone: "—", sla: "Chưa bắt đầu", slaPct: 0, status: "Chưa bắt đầu" as TaskStatus };
      tasks.push({
        id: `TSK-${__tid++}`,
        code: t.code, type: t.name, orderId: o.id,
        owner: r.owner, zone: r.zone, sla: r.sla, slaPct: r.slaPct, status: r.status, exception: r.exception,
        startAt: r.startAt, endAt: r.endAt,
      });
    });
});

// Demo: một số task chưa có nhân sự (luồng phân công thủ công)
[5, 18, 33, 47].forEach((i) => {
  if (tasks[i]) {
    tasks[i].owner = "—";
    tasks[i].status = "Chờ phân công";
    tasks[i].sla = "Chờ phân công";
    tasks[i].slaPct = 0;
  }
});

// Demo: 1 task "Check lệnh NCC" giữ trạng thái chưa xác nhận
const pendingConfirm = tasks.find((t) => t.code === "T-NCC");
if (pendingConfirm) {
  pendingConfirm.status = "Chưa bắt đầu";
  pendingConfirm.sla = "Chờ xác nhận";
  pendingConfirm.slaPct = 0;
}
