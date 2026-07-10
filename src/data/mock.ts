export type Warehouse = {
  code: string;
  name: string;
  type: "Kho kín" | "Kho hở" | "Bãi kho";
  address: string;
  branch: string;
  configured: boolean;
  utilization: number;
  locations: number;
  lastConfig: string;
  size: { l: number; w: number; h: number };
  area: number;
};

export const warehouses: Warehouse[] = [
  { code: "HN01", name: "Kho Hà Nội", type: "Kho kín", address: "KCN Bắc Thăng Long, Đông Anh, Hà Nội", branch: "Miền Bắc", configured: true, utilization: 68, locations: 620, lastConfig: "2026-04-28", size: { l: 80000, w: 40000, h: 9000 }, area: 3200 },
  { code: "HCM01", name: "Kho Hồ Chí Minh", type: "Kho kín", address: "KCN Tân Bình, Quận Tân Phú, TP.HCM", branch: "Miền Nam", configured: false, utilization: 0, locations: 0, lastConfig: "—", size: { l: 90000, w: 45000, h: 9500 }, area: 4050 },
  { code: "DN01", name: "Kho Đà Nẵng", type: "Kho hở", address: "KCN Hòa Khánh, Liên Chiểu, Đà Nẵng", branch: "Miền Trung", configured: true, utilization: 54, locations: 425, lastConfig: "2026-03-15", size: { l: 60000, w: 30000, h: 7000 }, area: 1800 },
  { code: "CT01", name: "Kho Cần Thơ", type: "Kho kín", address: "KCN Trà Nóc, Bình Thủy, Cần Thơ", branch: "Miền Tây", configured: false, utilization: 0, locations: 0, lastConfig: "—", size: { l: 50000, w: 25000, h: 7000 }, area: 1250 },
];

export const zones = [
  { code: "A01", name: "Khu cửa nhập/xuất số 1", type: "A - Cửa N/X", area: 220, method: "Xe nâng", aisle: 2300, required: true, status: "Hoạt động" },
  { code: "A02", name: "Khu cửa nhập/xuất số 2", type: "A - Cửa N/X", area: 200, method: "Xe nâng", aisle: 2300, required: true, status: "Hoạt động" },
  { code: "B01", name: "Khu chờ nhập", type: "B - Chờ N/X", area: 180, method: "Thủ công", aisle: 1200, required: true, status: "Hoạt động" },
  { code: "B02", name: "Khu chờ xuất", type: "B - Chờ N/X", area: 160, method: "Thủ công", aisle: 1200, required: true, status: "Hoạt động" },
  { code: "C01", name: "Khu đóng gói", type: "C - Đóng gói", area: 140, method: "Thủ công", aisle: 1200, required: false, status: "Chưa cấu hình" },
  { code: "D01", name: "Khu dự phòng", type: "D - Dự phòng", area: 220, method: "Thủ công", aisle: 1200, required: true, status: "Hoạt động" },
  { code: "E01", name: "Phòng lạnh 20-30°C", type: "E - Phòng lạnh", area: 120, method: "Thủ công", aisle: 1200, required: false, status: "Hoạt động" },
  { code: "F01", name: "Văn phòng vận hành", type: "F - Làm việc", area: 90, method: "Thủ công", aisle: 1200, required: true, status: "Hoạt động" },
  { code: "G01", name: "Khu giá kệ hạng nặng", type: "G - Rack nặng", area: 850, method: "Xe nâng", aisle: 2300, required: false, status: "Hoạt động" },
  { code: "H01", name: "Khu giá kệ hạng trung", type: "H - Rack trung", area: 360, method: "Xe nâng", aisle: 1800, required: false, status: "Hoạt động" },
  { code: "I01", name: "Khu giá kệ hạng nhẹ", type: "I - Rack nhẹ", area: 180, method: "Thủ công", aisle: 1200, required: false, status: "Hoạt động" },
  { code: "J01", name: "Khu pallet số 1", type: "J - Pallet", area: 420, method: "Xe nâng", aisle: 2300, required: false, status: "Hoạt động" },
  { code: "J02", name: "Khu pallet số 2", type: "J - Pallet", area: 280, method: "Xe nâng", aisle: 2300, required: false, status: "Hoạt động" },
  { code: "K01", name: "Khu thùng gỗ TN1-TN3", type: "K - Thùng gỗ", area: 260, method: "Thủ công", aisle: 1200, required: false, status: "Hoạt động" },
  { code: "K02", name: "Khu thùng gỗ TN4-TN5", type: "K - Thùng gỗ", area: 180, method: "Thủ công", aisle: 1200, required: false, status: "Hoạt động" },
  { code: "L01", name: "Khu PTVT / CCDC", type: "L - PTVT/CCDC", area: 150, method: "Thủ công", aisle: 1200, required: false, status: "Hoạt động" },
  { code: "M01", name: "Khu hàng quá khổ", type: "M - Quá khổ", area: 600, method: "Xe cẩu", aisle: 5000, required: true, status: "Hoạt động" },
  { code: "N01", name: "Đường giao thông chính", type: "N - Đường GT", area: 320, method: "Xe nâng", aisle: 2500, required: true, status: "Hoạt động" },
  { code: "N02", name: "Đường giao thông phụ", type: "N - Đường GT", area: 180, method: "Thủ công", aisle: 1200, required: true, status: "Hoạt động" },
  { code: "PCCC01", name: "Đường vành đai PCCC bắc", type: "PCCC", area: 90, method: "Thủ công", aisle: 700, required: true, status: "Hoạt động" },
  { code: "PCCC02", name: "Đường vành đai PCCC nam", type: "PCCC", area: 90, method: "Thủ công", aisle: 700, required: true, status: "Cảnh báo" },
];

export const racks = [
  { code: "G01", type: "Hạng nặng (KC/G)", zone: "G01", floors: 5, bays: 20, dim: "12000x1100x6500", load: 3000, aisle: 2300, slots: 100, status: "Hoạt động" },
  { code: "G02", type: "Hạng nặng (KC/G)", zone: "G01", floors: 4, bays: 16, dim: "9600x1100x5200", load: 3000, aisle: 2300, slots: 64, status: "Hoạt động" },
  { code: "H01", type: "Hạng trung (KT/H)", zone: "G01", floors: 3, bays: 12, dim: "7200x900x3900", load: 1000, aisle: 1800, slots: 36, status: "Hoạt động" },
  { code: "I01", type: "Hạng nhẹ (KN/I)", zone: "G01", floors: 3, bays: 10, dim: "5000x600x2400", load: 500, aisle: 1200, slots: 30, status: "Hoạt động" },
];

export const rackFloors = [
  { code: "G01-T01", parent: "G01", order: 1, height: 1500, load: 1000, bays: 20, status: "Hoạt động" },
  { code: "G01-T02", parent: "G01", order: 2, height: 1500, load: 800, bays: 20, status: "Hoạt động" },
  { code: "G01-T03", parent: "G01", order: 3, height: 1500, load: 600, bays: 20, status: "Hoạt động" },
  { code: "G01-T04", parent: "G01", order: 4, height: 1500, load: 500, bays: 20, status: "Hoạt động" },
  { code: "G01-T05", parent: "G01", order: 5, height: 1500, load: 400, bays: 20, status: "Hoạt động" },
];

export const pallets = [
  { code: "J01", type: "PL1", dim: "800x1200mm", stack: 3, load: 1000, rows: 10, cols: 6, slots: 60, status: "Hoạt động" },
  { code: "J02", type: "PL2", dim: "1000x1200mm", stack: 2, load: 1000, rows: 8, cols: 5, slots: 40, status: "Hoạt động" },
  { code: "J03", type: "PL3", dim: "1100x1100mm", stack: 2, load: 1000, rows: 6, cols: 4, slots: 24, status: "Hoạt động" },
];

export const woodboxes = [
  { code: "K01", type: "TN1", dim: "1000x800x500mm", stack: 3, load: 100, slots: 45, status: "Hoạt động" },
  { code: "K02", type: "TN3", dim: "1150x1050x1100mm", stack: 2, load: 300, slots: 24, status: "Hoạt động" },
  { code: "K03", type: "TN5", dim: "1150x1050x1700mm", stack: 1, load: 500, slots: 10, status: "Hoạt động" },
];

export const oversized = [
  { code: "M01", type: "Cột anten", maxDim: "12000x1000x1000mm", safety: 500, equip: "Xe cẩu", slots: 12, status: "Hoạt động" },
  { code: "M02", type: "Cuộn cáp quang", maxDim: "2000x2000x1800mm", safety: 500, equip: "Xe nâng", slots: 20, status: "Hoạt động" },
  { code: "M03", type: "Nhà container", maxDim: "6000x2500x2500mm", safety: 1000, equip: "Xe cẩu", slots: 6, status: "Hoạt động" },
];

export const roads = [
  { code: "N01", type: "Hai chiều", width: 2500, direction: "A01 → B01", forklift: true, status: "Hoạt động" },
  { code: "N02", type: "Một chiều", width: 2300, direction: "B01 → G01", forklift: true, status: "Hoạt động" },
  { code: "N03", type: "Hai chiều", width: 5000, direction: "M01", forklift: false, status: "Hoạt động" },
  { code: "N04", type: "Một chiều", width: 1200, direction: "K01", forklift: false, status: "Hoạt động" },
];

export const pccc = [
  { code: "PCCC01", width: 700, continuous: true, blocked: false, status: "Đạt", note: "" },
  { code: "PCCC02", width: 650, continuous: true, blocked: false, status: "Không đạt", note: "Chiều rộng < 700mm" },
  { code: "PCCC03", width: 800, continuous: false, blocked: false, status: "Không đạt", note: "Tuyến không liên tục" },
];

export type LocationStatus = "EMPTY" | "OCCUPIED" | "RESERVED" | "BLOCKED" | "INACTIVE";

export const locations = [
  { code: "G01-T01-K01", warehouse: "HN01", zone: "G01", type: "Rack", parent: "G01", floor: 1, bay: 1, status: "EMPTY" as LocationStatus, sku: "", maxLoad: 1000, maxVol: "1.5m³" },
  { code: "G01-T01-K02", warehouse: "HN01", zone: "G01", type: "Rack", parent: "G01", floor: 1, bay: 2, status: "OCCUPIED" as LocationStatus, sku: "ROUTER-CISCO-001", maxLoad: 1000, maxVol: "1.5m³" },
  { code: "G01-T02-K01", warehouse: "HN01", zone: "G01", type: "Rack", parent: "G01", floor: 2, bay: 1, status: "RESERVED" as LocationStatus, sku: "SWITCH-HP-220", maxLoad: 800, maxVol: "1.5m³" },
  { code: "J01-R01-T01-P01", warehouse: "HN01", zone: "J01", type: "Pallet", parent: "J01", floor: 1, bay: 1, status: "EMPTY" as LocationStatus, sku: "", maxLoad: 1000, maxVol: "1.2m³" },
  { code: "J01-R01-T02-P01", warehouse: "HN01", zone: "J01", type: "Pallet", parent: "J01", floor: 2, bay: 1, status: "OCCUPIED" as LocationStatus, sku: "BOX-CARTON-A4", maxLoad: 1000, maxVol: "1.2m³" },
  { code: "J02-R02-T01-P03", warehouse: "HN01", zone: "J01", type: "Pallet", parent: "J02", floor: 1, bay: 3, status: "OCCUPIED" as LocationStatus, sku: "CABLE-RJ45-100M", maxLoad: 1000, maxVol: "1.2m³" },
  { code: "K01-R01-T01-B01", warehouse: "HN01", zone: "K01", type: "Thùng gỗ", parent: "K01", floor: 1, bay: 1, status: "BLOCKED" as LocationStatus, sku: "", maxLoad: 100, maxVol: "0.4m³" },
  { code: "K01-R01-T02-B01", warehouse: "HN01", zone: "K01", type: "Thùng gỗ", parent: "K01", floor: 2, bay: 1, status: "EMPTY" as LocationStatus, sku: "", maxLoad: 100, maxVol: "0.4m³" },
  { code: "K02-R02-T01-B04", warehouse: "HN01", zone: "K01", type: "Thùng gỗ", parent: "K02", floor: 1, bay: 4, status: "OCCUPIED" as LocationStatus, sku: "ADAPTER-12V-SET", maxLoad: 300, maxVol: "1.3m³" },
  { code: "M01-SLOT01", warehouse: "HN01", zone: "M01", type: "Hàng quá khổ", parent: "M01", floor: 1, bay: 1, status: "OCCUPIED" as LocationStatus, sku: "ANTENNA-12M", maxLoad: 2000, maxVol: "—" },
  { code: "G02-T01-K01", warehouse: "DN01", zone: "G01", type: "Rack", parent: "G02", floor: 1, bay: 1, status: "EMPTY" as LocationStatus, sku: "", maxLoad: 800, maxVol: "1.2m³" },
];

export const rackTypes = [
  { code: "KC/G", name: "Giá kệ hạng nặng", desc: "<3000kg/tầng hoặc <1500kg/pallet", dim: "12000x1100x6500", load: 3000, status: "Hoạt động" },
  { code: "KT/H", name: "Giá kệ hạng trung", desc: "<1000kg/tầng hoặc <500kg/pallet", dim: "7200x900x3900", load: 1000, status: "Hoạt động" },
  { code: "KN/I", name: "Giá kệ hạng nhẹ", desc: "<500kg/tầng — picking", dim: "5000x600x2400", load: 500, status: "Hoạt động" },
];

export const palletTypes = [
  { code: "PL1", name: "Pallet 800x1200", material: "Gỗ thông", dim: "800x1200mm", load: 1000, status: "Hoạt động" },
  { code: "PL2", name: "Pallet 1000x1200", material: "HDPE", dim: "1000x1200mm", load: 1000, status: "Hoạt động" },
  { code: "PL3", name: "Pallet 1100x1100", material: "Thép sơn tĩnh điện", dim: "1100x1100mm", load: 1500, status: "Hoạt động" },
];

export const woodboxTypes = [
  { code: "TN1", name: "Thùng gỗ TN1", dim: "1000x800x500mm", load: 100, stack: 3, rfid: true, status: "Hoạt động" },
  { code: "TN2", name: "Thùng gỗ TN2", dim: "1150x1050x900mm", load: 200, stack: 3, rfid: true, status: "Hoạt động" },
  { code: "TN3", name: "Thùng gỗ TN3", dim: "1150x1050x1100mm", load: 300, stack: 2, rfid: true, status: "Hoạt động" },
  { code: "TN4", name: "Thùng gỗ TN4", dim: "1150x1050x1400mm", load: 400, stack: 2, rfid: true, status: "Hoạt động" },
  { code: "TN5", name: "Thùng gỗ TN5", dim: "1150x1050x1700mm", load: 500, stack: 1, rfid: true, status: "Hoạt động" },
];

export const zoneTypes = [
  { code: "A", name: "Khu vực cửa nhập/xuất", std: "DOOR", required: true, desc: "Cổng nhập/xuất hàng", status: "Hoạt động" },
  { code: "B", name: "Khu vực chờ nhập/xuất", std: "BUFFER", required: true, desc: "Khu staging tạm", status: "Hoạt động" },
  { code: "C", name: "Khu vực đóng gói", std: "PACKING", required: false, desc: "Đóng gói trước khi xuất", status: "Hoạt động" },
  { code: "D", name: "Khu vực dự phòng", std: "RESERVE", required: true, desc: "Dự phòng mở rộng", status: "Hoạt động" },
  { code: "E", name: "Phòng lạnh / 20-30°C", std: "COLD", required: false, desc: "Khu nhiệt độ kiểm soát", status: "Hoạt động" },
  { code: "F", name: "Khu vực làm việc", std: "OFFICE", required: true, desc: "Văn phòng vận hành", status: "Hoạt động" },
  { code: "G", name: "Khu vực giá kệ hạng nặng", std: "RACK-HEAVY", required: false, desc: "", status: "Hoạt động" },
  { code: "H", name: "Khu vực giá kệ hạng trung", std: "RACK-MED", required: false, desc: "", status: "Hoạt động" },
  { code: "I", name: "Khu vực giá kệ hạng nhẹ", std: "RACK-LIGHT", required: false, desc: "", status: "Hoạt động" },
  { code: "J", name: "Khu vực pallet", std: "PALLET", required: false, desc: "", status: "Hoạt động" },
  { code: "K", name: "Khu vực thùng gỗ", std: "WOODBOX", required: false, desc: "", status: "Hoạt động" },
  { code: "L", name: "Khu PTVT / CCDC", std: "TOOL", required: false, desc: "Phương tiện vận tải, CCDC", status: "Hoạt động" },
  { code: "M", name: "Khu vực hàng quá khổ", std: "OVERSIZE", required: true, desc: "Bắt buộc khi có hàng quá khổ", status: "Hoạt động" },
  { code: "N", name: "Đường giao thông", std: "ROAD", required: true, desc: "", status: "Hoạt động" },
  { code: "PCCC", name: "Đường vành đai PCCC", std: "FIRE", required: true, desc: "Bắt buộc theo quy định", status: "Hoạt động" },
];

export const locationStatuses = [
  { code: "EMPTY", name: "Trống", color: "success", inbound: true, outbound: true, desc: "Vị trí sẵn sàng nhập" },
  { code: "OCCUPIED", name: "Đang chứa hàng", color: "info", inbound: false, outbound: true, desc: "Vị trí đang chứa SKU" },
  { code: "RESERVED", name: "Đã đặt trước", color: "warning", inbound: false, outbound: true, desc: "Đã giữ chỗ cho lệnh nhập" },
  { code: "BLOCKED", name: "Đã khóa", color: "destructive", inbound: false, outbound: false, desc: "Khóa do hỏng/bảo trì" },
  { code: "INACTIVE", name: "Ngưng sử dụng", color: "muted", inbound: false, outbound: false, desc: "Không sử dụng" },
];

export const layoutRules = [
  { code: "RULE-LAYOUT-001", name: "Không cho phép phân khu bắt buộc chồng lấn", target: "Phân khu", cond: "overlap = false", value: "0", unit: "%", level: "Chặn lưu", active: true },
  { code: "RULE-LAYOUT-002", name: "Tổng diện tích phân khu không vượt diện tích kho", target: "Kho", cond: "sum(area) ≤ warehouse.area", value: "100", unit: "%", level: "Chặn lưu", active: true },
  { code: "RULE-LAYOUT-003", name: "Khu dự phòng được phép chồng lên đường giao thông", target: "Khu D ↔ N", cond: "overlap allowed", value: "—", unit: "—", level: "Cảnh báo", active: true },
  { code: "RULE-LAYOUT-004", name: "Layout phải có đủ khu bắt buộc", target: "Phân khu", cond: "required ⊆ configured", value: "—", unit: "—", level: "Chặn lưu", active: true },
];

export const rackRules = [
  { code: "RULE-RACK-001", area: "Giá kệ", method: "—", min: 100, unit: "mm", level: "Chặn lưu", active: true },
  { code: "RULE-PALLET-001", area: "Pallet", method: "—", min: 100, unit: "mm", level: "Chặn lưu", active: true },
  { code: "RULE-BOX-001", area: "Thùng gỗ", method: "—", min: 100, unit: "mm", level: "Chặn lưu", active: true },
  { code: "RULE-AISLE-001", area: "Lối đi", method: "Thủ công", min: 1200, unit: "mm", level: "Chặn lưu", active: true },
  { code: "RULE-AISLE-002", area: "Lối đi", method: "Xe nâng", min: 2300, unit: "mm", level: "Chặn lưu", active: true },
  { code: "RULE-OVERSIZE-001", area: "Hàng quá khổ", method: "—", min: 500, unit: "mm", level: "Chặn lưu", active: true },
];

export const ppcRules = [
  { code: "RULE-PCCC-001", name: "Đường vành đai PCCC tối thiểu 700mm", min: 700, unit: "mm", level: "Chặn lưu", active: true },
  { code: "RULE-PCCC-002", name: "Đường PCCC phải liên tục", min: 0, unit: "—", level: "Chặn lưu", active: true },
  { code: "RULE-PCCC-003", name: "Đường PCCC không bị che chắn", min: 0, unit: "—", level: "Chặn lưu", active: true },
];

export const dashboardStats = {
  totalWarehouses: 4,
  configured: 2,
  unconfigured: 2,
  totalZones: 36,
  totalInfrastructure: 148,
  totalLocations: 1245,
  empty: 728,
  occupied: 431,
  blocked: 86,
  ruleViolations: 3,
};

export const locationByType = [
  { type: "Rack", count: 680, color: "primary" },
  { type: "Pallet", count: 320, color: "success" },
  { type: "Thùng gỗ", count: 207, color: "warning" },
  { type: "Hàng quá khổ", count: 38, color: "destructive" },
];
