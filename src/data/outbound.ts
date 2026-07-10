// ====== Outbound module: types & mock data (Order-centric, no Wave) ======

export type OutOrderType = "OUT-VC" | "OUT-OTH";

export type OutOrderStatus =
  | "New" | "API Error" | "Validated" | "Waiting Confirm" | "Accepted" | "Rejected"
  | "Task Planning" | "Waiting Assignment Approval" | "Task Assigned"
  | "Transport Required" | "Transport Planning" | "Transport Approved" | "Vehicle Confirmed" | "Vehicle Arrived"
  | "Picking Assigned" | "Picking In Progress" | "Picked"
  | "Packing Required" | "Packing In Progress" | "Packed"
  | "Checking" | "Checked" | "Handover Signed"
  | "Ready for GI" | "GI Posting" | "GI Posted" | "GI API Error"
  | "Waiting VOffice" | "Signed" | "Sign Rejected"
  | "Loading" | "Loaded" | "Handed Over"
  | "Restorage Required" | "Completed" | "Cancelled" | "Closed With Exception";

export type OutOrderItem = {
  sku: string; name: string; uom: string; docQty: number; pickedQty: number;
  diff: number; from?: string; hu?: string; serial?: boolean;
};

export type OutOrder = {
  id: string;
  type: OutOrderType;
  sourceDoc: string;
  receiver: string;
  warehouse: string;
  hasTransport: boolean;
  hasPacking: boolean;
  hasVOffice: boolean;
  apiStatus: "OK" | "Pending" | "Error";
  status: OutOrderStatus;
  sla: string;
  slaPct: number;
  plannedDate: string;
  owner: string;
  lines: number;
  qty: number;
  giDoc?: string;
  bbbg?: string;
  voffice?: string;
  vehicle?: { code: string; plate: string; driver: string; phone: string; eta: string; ata?: string; dock?: string; vehicleStatus: "Chưa lên lịch" | "Chưa đến" | "Đã đến" | "Quá ETA" | "Đã rời cổng" };
  items: OutOrderItem[];
};

export const outOrders: OutOrder[] = [
  {
    id: "OUT-2026-00451", type: "OUT-VC", sourceDoc: "SO-2026-1188", receiver: "Chi nhánh Viettel HP",
    warehouse: "HN01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Picking In Progress", sla: "5h30 còn", slaPct: 55,
    plannedDate: "2026-05-18 10:00", owner: "Đỗ Minh Khôi", lines: 8, qty: 240,
    giDoc: "", bbbg: "", voffice: "",
    vehicle: { code: "VT-3019", plate: "30A-552.18", driver: "Trần Văn Mạnh", phone: "0904 112 887", eta: "2026-05-18 13:30", dock: "DK-05", vehicleStatus: "Chưa đến" },
    items: [
      { sku: "ANT-4G-2T", name: "Anten 4G 2T2R", uom: "Bộ", docQty: 12, pickedQty: 12, diff: 0, from: "G02-T01-B03", hu: "HU-OUT-201", serial: true },
      { sku: "BBU-3900", name: "Baseband Unit BBU 3900", uom: "Bộ", docQty: 8, pickedQty: 6, diff: -2, from: "G02-T01-B04", hu: "HU-OUT-202", serial: true },
      { sku: "CAB-PWR-10", name: "Cáp nguồn 10m", uom: "Cuộn", docQty: 80, pickedQty: 80, diff: 0, from: "I02-T02-B05" },
    ],
  },
  {
    id: "OUT-2026-00452", type: "OUT-VC", sourceDoc: "SO-2026-1190", receiver: "Trạm BTS Đà Nẵng",
    warehouse: "HN01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Waiting Confirm", sla: "10h còn", slaPct: 20,
    plannedDate: "2026-05-18 18:00", owner: "Trần Văn Kho", lines: 5, qty: 120, items: [],
  },
  {
    id: "OUT-2026-00453", type: "OUT-VC", sourceDoc: "SO-2026-1191", receiver: "Chi nhánh HCM",
    warehouse: "HN01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "Error", status: "API Error", sla: "—", slaPct: 0,
    plannedDate: "2026-05-18 16:00", owner: "—", lines: 14, qty: 380, items: [],
  },
  {
    id: "OUT-2026-00454", type: "OUT-OTH", sourceDoc: "ISS-INT-077", receiver: "Phòng Kỹ thuật HN",
    warehouse: "HN01", hasTransport: false, hasPacking: false, hasVOffice: true,
    apiStatus: "OK", status: "Packed", sla: "1h còn", slaPct: 78,
    plannedDate: "2026-05-18 11:00", owner: "Phạm Thị Hằng", lines: 3, qty: 18, items: [],
  },
  {
    id: "OUT-2026-00455", type: "OUT-VC", sourceDoc: "SO-2026-1192", receiver: "Kho Đà Nẵng DN01",
    warehouse: "HCM01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Loading", sla: "30p còn", slaPct: 88,
    plannedDate: "2026-05-18 09:30", owner: "Lê Hoàng Nam", lines: 10, qty: 320,
    giDoc: "GI-2026-007712", bbbg: "BBBG-OUT-0231", voffice: "VOF-OUT-1109",
    vehicle: { code: "VT-3022", plate: "29C-441.88", driver: "Phạm Văn Đạt", phone: "0987 221 008", eta: "2026-05-18 09:00", ata: "2026-05-18 09:10", dock: "DK-02", vehicleStatus: "Đã đến" },
    items: [],
  },
  {
    id: "OUT-2026-00456", type: "OUT-VC", sourceDoc: "SO-2026-1193", receiver: "Đối tác BCC – ABC Telecom",
    warehouse: "HN01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Waiting VOffice", sla: "2h15 còn", slaPct: 60,
    plannedDate: "2026-05-18 14:00", owner: "Trần Văn Kho", lines: 6, qty: 150,
    giDoc: "GI-2026-007715", bbbg: "BBBG-OUT-0235", items: [],
  },
  {
    id: "OUT-2026-00457", type: "OUT-VC", sourceDoc: "SO-2026-1194", receiver: "Chi nhánh Nghệ An",
    warehouse: "HN01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "GI API Error", sla: "Quá hạn 30p", slaPct: 108,
    plannedDate: "2026-05-18 08:00", owner: "Đỗ Minh Khôi", lines: 4, qty: 64, items: [],
  },
  {
    id: "OUT-2026-00458", type: "OUT-OTH", sourceDoc: "ISS-RTN-019", receiver: "Trả NCC Huawei",
    warehouse: "HN01", hasTransport: true, hasPacking: false, hasVOffice: true,
    apiStatus: "OK", status: "Sign Rejected", sla: "—", slaPct: 105,
    plannedDate: "2026-05-17 16:00", owner: "Nguyễn Hữu An", lines: 2, qty: 8,
    giDoc: "GI-2026-007701", voffice: "VOF-OUT-1098", items: [],
  },
  {
    id: "OUT-2026-00459", type: "OUT-VC", sourceDoc: "SO-2026-1195", receiver: "Chi nhánh Hải Phòng",
    warehouse: "HN01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Completed", sla: "—", slaPct: 100,
    plannedDate: "2026-05-17 09:00", owner: "Bùi Quốc Việt", lines: 12, qty: 300,
    giDoc: "GI-2026-007698", bbbg: "BBBG-OUT-0220", voffice: "VOF-OUT-1080", items: [],
  },
  {
    id: "OUT-2026-00460", type: "OUT-VC", sourceDoc: "SO-2026-1196", receiver: "Chi nhánh Cần Thơ",
    warehouse: "HCM01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Waiting Assignment Approval", sla: "8h còn", slaPct: 25,
    plannedDate: "2026-05-18 17:00", owner: "Lê Hoàng Nam", lines: 7, qty: 180, items: [],
  },
  {
    id: "OUT-2026-00461", type: "OUT-VC", sourceDoc: "SO-2026-1197", receiver: "Đối tác Nokia VN",
    warehouse: "HN01", hasTransport: true, hasPacking: true, hasVOffice: true,
    apiStatus: "OK", status: "Restorage Required", sla: "—", slaPct: 100,
    plannedDate: "2026-05-17 14:00", owner: "Phạm Thị Hằng", lines: 4, qty: 48, items: [],
  },
  {
    id: "OUT-2026-00462", type: "OUT-OTH", sourceDoc: "ISS-ADJ-005", receiver: "Điều chỉnh nội bộ",
    warehouse: "HN01", hasTransport: false, hasPacking: false, hasVOffice: false,
    apiStatus: "OK", status: "Rejected", sla: "—", slaPct: 0,
    plannedDate: "2026-05-17 10:00", owner: "Trần Văn Kho", lines: 1, qty: 4, items: [],
  },
];

// Extended KPI matching Inbound shape
export const outboundKPI = {
  todayTotal: 28, waitingConfirm: 4, rejected: 1, waitingAssign: 2, planning: 3,
  transportPlanning: 5, picking: 6, packing: 4, checking: 3,
  waitingGI: 3, giApiError: 1, waitingVOffice: 3, signRejected: 1,
  loading: 2, completed: 14, restorage: 1, overdue: 3,
};

export const outOrderTypeMix = [
  { label: "OUT-VC", value: 22, color: "hsl(var(--brand))" },
  { label: "OUT-OTH", value: 6, color: "hsl(var(--info))" },
];

export const outLeadTime = [
  { stage: "API sync", target: 5, actual: 4 },
  { stage: "Xác nhận", target: 15, actual: 12 },
  { stage: "Lên lịch xe", target: 30, actual: 28 },
  { stage: "Picking", target: 45, actual: 48 },
  { stage: "Đóng gói", target: 35, actual: 32 },
  { stage: "Kiểm hàng", target: 30, actual: 28 },
  { stage: "Thực xuất", target: 10, actual: 9 },
  { stage: "Ký VOffice", target: 60, actual: 75 },
  { stage: "Tải xe", target: 30, actual: 35 },
];

export const outAlerts = [
  { id: "OA-001", kind: "Xe quá ETA", severity: "high" as const, msg: "Xe VT-3019 chưa đến – trễ 20p", ref: "OUT-2026-00451", time: "5 phút trước" },
  { id: "OA-002", kind: "Lỗi API GI", severity: "high" as const, msg: "API3 lỗi 500 khi gửi T-AGI", ref: "OUT-2026-00457", time: "12 phút trước" },
  { id: "OA-003", kind: "Từ chối ký", severity: "med" as const, msg: "VOffice trả từ chối – sai số HU", ref: "OUT-2026-00458", time: "30 phút trước" },
  { id: "OA-004", kind: "Hàng cần lưu trữ lại", severity: "med" as const, msg: "Đối tác không nhận – 4 dòng cần restorage", ref: "OUT-2026-00461", time: "1 giờ trước" },
  { id: "OA-005", kind: "Chờ phân công", severity: "low" as const, msg: "Không tìm thấy NS phù hợp – picking", ref: "OUT-2026-00460", time: "1 giờ trước" },
];

// NEW: Đơn vị nhận / đối tác có nhiều sai lệch
export const outCustomerIssues = [
  { name: "Chi nhánh Viettel HP", orders: 12, diff: 3, late: 1, signRejected: 0 },
  { name: "Trạm BTS Đà Nẵng", orders: 9, diff: 1, late: 0, signRejected: 0 },
  { name: "Đối tác BCC – ABC Telecom", orders: 6, diff: 2, late: 1, signRejected: 1 },
  { name: "Trả NCC Huawei", orders: 4, diff: 0, late: 0, signRejected: 1 },
  { name: "Đối tác Nokia VN", orders: 5, diff: 4, late: 2, signRejected: 0 },
];

// NEW: Hiệu suất NS module xuất
export const outStaffPerformance = [
  { name: "Đỗ Minh Khôi", role: "NV kho", shift: "S1", tasks: 12, done: 10, onTime: 9, overdue: 2 },
  { name: "Phạm Thị Hằng", role: "NV kho", shift: "S1", tasks: 9, done: 8, onTime: 8, overdue: 0 },
  { name: "Mai Thị Lan", role: "NV đóng gói", shift: "S1", tasks: 8, done: 7, onTime: 7, overdue: 0 },
  { name: "Bùi Quốc Việt", role: "Lái xe nâng", shift: "S2", tasks: 10, done: 9, onTime: 8, overdue: 1 },
  { name: "Phạm Văn Đạt", role: "Lái xe vận chuyển", shift: "S1", tasks: 6, done: 5, onTime: 5, overdue: 0 },
  { name: "Trần Văn Kho", role: "Thủ kho", shift: "S1", tasks: 14, done: 12, onTime: 11, overdue: 1 },
];

// ============== Tasks ==============
import { taskCatalog } from "./inbound";

export type OutTaskType = string;
export type OutTaskStatus = "Chưa bắt đầu" | "Đang xử lý" | "Pending" | "Quá hạn" | "Hoàn thành" | "Phát sinh" | "Chờ phân công";

export type OutTask = {
  id: string; code: string; type: OutTaskType; orderId: string; owner: string; position: string;
  zone: string; sla: string; slaPct: number; status: OutTaskStatus; exception?: string;
  startAt?: string; endAt?: string;
};

type OutRuntime = { owner: string; position: string; zone: string; sla: string; slaPct: number; status: OutTaskStatus; cond?: (o: OutOrder) => boolean; startAt?: string; endAt?: string };
const OUT_RUNTIME: Record<string, OutRuntime> = {
  "T-APR": { owner: "Trần Đăng Khoa", position: "Giám đốc kho",  zone: "VP Kho",     sla: "Hoàn thành",   slaPct: 100, status: "Hoàn thành", startAt: "08:10", endAt: "08:22" },
  "T-HO":  { owner: "Nguyễn Hữu An",  position: "NV kiểm hàng",  zone: "Khu C02",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-PAC": { owner: "Mai Thị Lan",    position: "NV đóng gói",   zone: "Khu C02",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-SIG": { owner: "Giám đốc kho",   position: "Giám đốc kho",  zone: "VOffice",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu", cond: (o) => o.hasVOffice },
  "T-WH":  { owner: "Trần Văn Kho",   position: "Thủ kho",       zone: "VP Kho",     sla: "Liên tục",     slaPct: 30,  status: "Đang xử lý",    startAt: "07:00" },
  "T-SCR": { owner: "Vũ Anh Tuấn",    position: "Bảo vệ cổng",   zone: "Cổng A",     sla: "Liên tục",     slaPct: 30,  status: "Đang xử lý",    startAt: "07:00" },
  "T-GI":  { owner: "Trần Văn Kho",   position: "Thủ kho",       zone: "VP Kho",     sla: "Hoàn thành",   slaPct: 100, status: "Hoàn thành",  startAt: "08:00", endAt: "08:08" },
  "T-MV4": { owner: "Đỗ Minh Khôi",   position: "NV kho",        zone: "Khu G02",    sla: "30p còn",      slaPct: 55,  status: "Đang xử lý",    startAt: "09:05" },
  "T-MV5": { owner: "Phạm Thị Hằng",  position: "NV kho",        zone: "Khu C02",    sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-LDG": { owner: "Bùi Quốc Việt",  position: "Lái xe nâng",   zone: "Dock DK-02", sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
  "T-AGI": { owner: "Trần Văn Kho",   position: "Thủ kho",       zone: "VP Kho",     sla: "Chưa bắt đầu", slaPct: 0,   status: "Chưa bắt đầu" },
};

let __oid = 5520;
export const outTasks: OutTask[] = [];
outOrders.forEach((o) => {
  taskCatalog
    .filter((t) => t.flows.includes(o.type))
    .filter((t) => {
      const r = OUT_RUNTIME[t.code];
      return !r?.cond || r.cond(o);
    })
    .forEach((t) => {
      const r = OUT_RUNTIME[t.code] || { owner: "—", position: "—", zone: "—", sla: "Chưa bắt đầu", slaPct: 0, status: "Chưa bắt đầu" as OutTaskStatus };
      outTasks.push({
        id: `OTSK-${__oid++}`,
        code: t.code, type: t.name, orderId: o.id,
        owner: r.owner, position: r.position, zone: r.zone,
        sla: r.sla, slaPct: r.slaPct, status: r.status,
        startAt: r.startAt, endAt: r.endAt,
      });
    });
});

[4, 12, 24, 38].forEach((i) => {
  if (outTasks[i]) {
    outTasks[i].owner = "—";
    outTasks[i].status = "Chờ phân công";
    outTasks[i].sla = "Chờ phân công";
    outTasks[i].slaPct = 0;
  }
});

const pendingOutConfirm = outTasks.find((t) => t.code === "T-GI");
if (pendingOutConfirm) {
  pendingOutConfirm.status = "Chưa bắt đầu";
  pendingOutConfirm.sla = "Chờ xác nhận";
  pendingOutConfirm.slaPct = 0;
}

// ============== Order tasks (AI plan) – mirror inbound ==============
export type OutOrderTask = {
  id: string; code: string; name: string; orderId: string;
  kind: "Human" | "System" | "API" | "AI" | "Approval";
  positionRequired: string;
  suggestedEmps: { code: string; name: string; score: number; reason: string }[];
  assignee?: string; assigneeName?: string;
  status: "Chưa phân công" | "Đã phân công" | "Đang xử lý" | "Hoàn thành" | "Quá hạn";
  kpiMin: number; deadline: string;
};

export const outOrderTasks: OutOrderTask[] = [
  { id: "OT-451-01", code: "T-APR",  name: "Duyệt lịch giao việc",          orderId: "OUT-2026-00451", kind: "Approval", positionRequired: "POS-GDK",  suggestedEmps: [{ code: "VTH-01205", name: "Trần Đăng Khoa", score: 98, reason: "GĐ kho HN01" }], assignee: "VTH-01205", assigneeName: "Trần Đăng Khoa", status: "Hoàn thành", kpiMin: 10, deadline: "08:30" },
  { id: "OT-451-02", code: "T-MV4",  name: "Lấy hàng (8 dòng) ra khu đóng gói", orderId: "OUT-2026-00451", kind: "Human", positionRequired: "POS-NVK", suggestedEmps: [{ code: "VTH-00902", name: "Đỗ Minh Khôi", score: 96, reason: "Đã pick đơn Viettel HP nhiều lần" }, { code: "VTH-00455", name: "Phạm Thị Hằng", score: 88, reason: "Rảnh, ca S1" }], assignee: "VTH-00902", assigneeName: "Đỗ Minh Khôi", status: "Đang xử lý", kpiMin: 45, deadline: "10:00" },
  { id: "OT-451-03", code: "T-PAC",  name: "Đóng gói 240 SP",               orderId: "OUT-2026-00451", kind: "Human", positionRequired: "POS-PKG",  suggestedEmps: [{ code: "VTH-01158", name: "Mai Thị Lan", score: 97, reason: "Chứng chỉ đóng gói + in tem" }], assignee: "VTH-01158", assigneeName: "Mai Thị Lan", status: "Đã phân công", kpiMin: 35, deadline: "10:35" },
  { id: "OT-451-04", code: "T-HO",   name: "Kiểm hàng & Ký BBBG",          orderId: "OUT-2026-00451", kind: "Human", positionRequired: "POS-KH",   suggestedEmps: [{ code: "VTH-00612", name: "Nguyễn Hữu An", score: 95, reason: "Kiểm hàng + ký BBBG" }], assignee: "VTH-00612", assigneeName: "Nguyễn Hữu An", status: "Đã phân công", kpiMin: 30, deadline: "11:05" },
  { id: "OT-451-05", code: "T-MV5",  name: "Đưa sang khu chờ xuất",         orderId: "OUT-2026-00451", kind: "Human", positionRequired: "POS-NVK",  suggestedEmps: [{ code: "VTH-00455", name: "Phạm Thị Hằng", score: 92, reason: "Rảnh" }], assignee: "VTH-00455", assigneeName: "Phạm Thị Hằng", status: "Chưa phân công", kpiMin: 15, deadline: "11:20" },
  { id: "OT-451-06", code: "T-LDG",  name: "Tải hàng lên xe VT-3019",      orderId: "OUT-2026-00451", kind: "Human", positionRequired: "POS-FL",   suggestedEmps: [{ code: "VTH-00891", name: "Bùi Quốc Việt", score: 97, reason: "Xe nâng, rảnh" }], assignee: "VTH-00891", assigneeName: "Bùi Quốc Việt", status: "Chưa phân công", kpiMin: 30, deadline: "13:50" },
  { id: "OT-451-07", code: "T-AGI",  name: "Thực xuất kho T-AGI",          orderId: "OUT-2026-00451", kind: "Human", positionRequired: "POS-TK",   suggestedEmps: [{ code: "VTH-00231", name: "Trần Văn Kho", score: 99, reason: "Thủ kho chính" }], assignee: "VTH-00231", assigneeName: "Trần Văn Kho", status: "Chưa phân công", kpiMin: 10, deadline: "14:00" },
  { id: "OT-451-08", code: "T-SIG",  name: "Trình ký VOffice",              orderId: "OUT-2026-00451", kind: "Human", positionRequired: "POS-GDK",  suggestedEmps: [{ code: "VTH-01205", name: "Trần Đăng Khoa", score: 95, reason: "GĐ ký VOffice" }], assignee: "VTH-01205", assigneeName: "Trần Đăng Khoa", status: "Chưa phân công", kpiMin: 30, deadline: "14:30" },
];

// ============== API Logs ==============
export type OutApiLog = {
  id: string; code: "OUT-API1" | "OUT-API2" | "OUT-API3" | "API-VOFFICE";
  order: string; reqTime: string; resTime?: string;
  status: "200" | "201" | "400" | "404" | "500"; errorCode?: string; retry: number; note: string;
};
export const outApiLogs: OutApiLog[] = [
  { id: "OLOG-7701", code: "OUT-API1", order: "OUT-2026-00451", reqTime: "2026-05-18 07:30", resTime: "2026-05-18 07:30:01", status: "200", retry: 0, note: "Nhận lệnh xuất từ SAP OK" },
  { id: "OLOG-7702", code: "OUT-API1", order: "OUT-2026-00453", reqTime: "2026-05-18 08:15", resTime: "2026-05-18 08:15:02", status: "400", errorCode: "INVALID_RECEIVER", retry: 2, note: "Đơn vị nhận không tồn tại" },
  { id: "OLOG-7703", code: "OUT-API3", order: "OUT-2026-00455", reqTime: "2026-05-18 09:20", resTime: "2026-05-18 09:20:03", status: "200", retry: 0, note: "Trả phiếu xuất GI-2026-007712" },
  { id: "OLOG-7704", code: "OUT-API3", order: "OUT-2026-00457", reqTime: "2026-05-18 09:45", resTime: "2026-05-18 09:45:09", status: "500", errorCode: "SAP_TIMEOUT", retry: 3, note: "SAP T-AGI timeout" },
  { id: "OLOG-7705", code: "API-VOFFICE", order: "OUT-2026-00458", reqTime: "2026-05-17 16:45", resTime: "2026-05-17 16:45:01", status: "200", retry: 0, note: "VOffice từ chối ký – sai số HU" },
  { id: "OLOG-7706", code: "OUT-API2", order: "OUT-2026-00462", reqTime: "2026-05-17 10:30", resTime: "2026-05-17 10:30:01", status: "200", retry: 0, note: "Trả từ chối lệnh xuất – không đủ tồn" },
];

export const outTxns = [
  { id: "OTXN-8801", kind: "Pick", target: "ANT-4G-2T x12", before: "Sẵn sàng", after: "Đã pick", beforeLoc: "G02-T01-B03", afterLoc: "C02-Staging", user: "Đỗ Minh Khôi", task: "OTSK-5522", time: "2026-05-18 09:14" },
  { id: "OTXN-8802", kind: "Pack", target: "HU-OUT-201", before: "—", after: "Đã đóng kiện", user: "Phạm Thị Hằng", task: "OTSK-5523", time: "2026-05-18 09:42" },
  { id: "OTXN-8803", kind: "Sign BBBG", target: "BBBG-OUT-0231", before: "Chưa ký", after: "Đã ký", user: "Trần Văn Kho", task: "OTSK-5525", time: "2026-05-18 09:50" },
  { id: "OTXN-8804", kind: "GI Post", target: "GI-2026-007712", before: "—", after: "Đã ghi nhận SAP", user: "Lê Hoàng Nam", task: "OTSK-5526", time: "2026-05-18 09:20" },
];

// ============== Exceptions ==============
export type OutException = {
  id: string; group: string; ref: string; severity: "low" | "med" | "high"; owner: string;
  status: "Mới" | "Đang xử lý" | "Đã xử lý" | "Treo"; deadline: string; createdAt: string; note: string;
};
export const outExceptions: OutException[] = [
  { id: "OEX-3301", group: "Xe quá ETA", ref: "OUT-2026-00451", severity: "high", owner: "Điều phối VT", status: "Đang xử lý", deadline: "2026-05-18 14:00", createdAt: "13:30", note: "Xe VT-3019 chưa đến – chậm 20 phút" },
  { id: "OEX-3302", group: "Lỗi API GI", ref: "OUT-2026-00457", severity: "high", owner: "IT WMS", status: "Đang xử lý", deadline: "2026-05-18 12:00", createdAt: "09:45", note: "API3 timeout – đã retry 3 lần" },
  { id: "OEX-3303", group: "Từ chối ký VOffice", ref: "OUT-2026-00458", severity: "med", owner: "Thủ kho", status: "Mới", deadline: "2026-05-18 17:00", createdAt: "16:45", note: "VOffice trả: sai số HU trên phiếu" },
  { id: "OEX-3304", group: "Cần lưu trữ lại", ref: "OUT-2026-00461", severity: "med", owner: "Trần Văn Kho", status: "Đang xử lý", deadline: "2026-05-18 18:00", createdAt: "15:10", note: "4 dòng đối tác không nhận – cần restorage" },
  { id: "OEX-3305", group: "Chờ phân công", ref: "OUT-2026-00460", severity: "low", owner: "Lê Hoàng Nam", status: "Mới", deadline: "—", createdAt: "11:00", note: "Không tìm thấy NS pick phù hợp ca chiều" },
  { id: "OEX-3306", group: "Thiếu hàng pick", ref: "OUT-2026-00451 / BBU-3900", severity: "med", owner: "Đỗ Minh Khôi", status: "Đang xử lý", deadline: "2026-05-18 14:00", createdAt: "09:30", note: "Thiếu 2 BBU – kiểm tra lại tồn" },
];

export const getOutOrder = (id: string) => outOrders.find((o) => o.id === id);
export const getOutTask = (id: string) => outTasks.find((t) => t.id === id);
