// ====== Vehicle / Gate management — shared by Inbound & Outbound ======

export type VehicleStatus =
  | "Chưa đến"
  | "Đã đến"
  | "Đã vào cổng"
  | "Đã vào dock"
  | "Đang xử lý"
  | "Đã ra cổng"
  | "Quá ETA"
  | "Đổi xe"
  | "Hủy chuyến";

export type VehicleException =
  | "WRONG_PLATE"
  | "PLATE_CHANGED"
  | "OVER_ETA"
  | "NO_SHOW"
  | "CANCEL";

export const VEHICLE_EXCEPTION_LABEL: Record<VehicleException, string> = {
  WRONG_PLATE: "Sai biển số",
  PLATE_CHANGED: "Đổi xe / Đổi biển số",
  OVER_ETA: "Quá ETA",
  NO_SHOW: "Không đến",
  CANCEL: "Hủy chuyến",
};

export type VehiclePhotoStage = "GATE_IN" | "DOCK_IN" | "DOCK_OUT" | "GATE_OUT";

export type VehiclePhoto = {
  type: "vehicle" | "plate" | "other";
  url: string;
  takenAt: string;
  by: string;
  stage?: VehiclePhotoStage;
  note?: string;
};

export type VehicleExceptionLog = {
  id: string;
  type: VehicleException;
  note: string;
  at: string;
  by: string;
};

export type VehicleVisit = {
  // 1 lượt vào/ra cụ thể; 1 trip có thể có nhiều visit (đổi xe)
  id: string;
  tripId: string;
  plateActual: string;
  gateInAt?: string;
  gateOutAt?: string;
  guard?: string;
  note?: string;
};

export type VehicleTrip = {
  id: string;
  tripCode: string;
  direction: "IN" | "OUT";
  carrier?: string;
  plateExpected: string;
  plateActual?: string;
  driver?: string;
  driverPhone?: string;
  etaAt: string;
  status: VehicleStatus;
  dockCode?: string;
  gateInAt?: string;
  dockInAt?: string;
  dockOutAt?: string;
  gateOutAt?: string;
  photos: VehiclePhoto[];
  exceptions: VehicleExceptionLog[];
  // VehicleTripOrder mapping (1 chuyến – nhiều Order)
  orderIds: string[];
  visits: VehicleVisit[];
};

export const vehicleTrips: VehicleTrip[] = [
  {
    id: "TR-001",
    tripCode: "VT-2418",
    direction: "IN",
    carrier: "Vận tải Phương Trang",
    plateExpected: "30H-784.21",
    plateActual: "30H-784.21",
    driver: "Lê Quang Hùng",
    driverPhone: "0912 884 221",
    etaAt: "2026-05-18 09:00",
    status: "Đã vào dock",
    dockCode: "DK-03",
    gateInAt: "2026-05-18 09:14",
    dockInAt: "2026-05-18 09:22",
    photos: [
      { stage: "GATE_IN", type: "plate", url: "/placeholder.svg", takenAt: "2026-05-18 09:14", by: "Vũ Anh Tuấn", note: "Biển số xe đầu kéo" },
      { stage: "GATE_IN", type: "vehicle", url: "/placeholder.svg", takenAt: "2026-05-18 09:14", by: "Vũ Anh Tuấn", note: "Ảnh toàn cảnh xe vào cổng" },
      { stage: "DOCK_IN", type: "vehicle", url: "/placeholder.svg", takenAt: "2026-05-18 09:22", by: "Nguyễn Thị Hà", note: "Xe áp dock DK-03" },
      { stage: "DOCK_IN", type: "other", url: "/placeholder.svg", takenAt: "2026-05-18 09:23", by: "Nguyễn Thị Hà", note: "Niêm phong còn nguyên" },
    ],
    exceptions: [
      { id: "VEX-001", type: "OVER_ETA", note: "Trễ 14 phút so ETA", at: "09:14", by: "Vũ Anh Tuấn" },
    ],
    orderIds: ["INB-2026-00118"],
    visits: [
      { id: "VV-001", tripId: "TR-001", plateActual: "30H-784.21", gateInAt: "2026-05-18 09:14", guard: "Vũ Anh Tuấn" },
    ],
  },
  {
    id: "TR-002",
    tripCode: "VT-2421",
    direction: "IN",
    carrier: "Đội xe nội bộ HCM01",
    plateExpected: "29C-119.04",
    driver: "Vũ Đức Long",
    driverPhone: "0976 312 008",
    etaAt: "2026-05-18 14:00",
    status: "Chưa đến",
    dockCode: "DK-04",
    photos: [],
    exceptions: [],
    orderIds: ["INB-2026-00120", "INB-2026-00125"],
    visits: [],
  },
  {
    id: "TR-003",
    tripCode: "VT-3019",
    direction: "OUT",
    carrier: "Vận tải Thành Đạt",
    plateExpected: "30A-552.18",
    driver: "Trần Văn Mạnh",
    driverPhone: "0904 112 887",
    etaAt: "2026-05-18 13:30",
    status: "Quá ETA",
    dockCode: "DK-05",
    photos: [],
    exceptions: [
      { id: "VEX-002", type: "OVER_ETA", note: "Chưa đến – chậm 20 phút", at: "13:50", by: "Vũ Anh Tuấn" },
    ],
    orderIds: ["OUT-2026-00451"],
    visits: [],
  },
  {
    id: "TR-004",
    tripCode: "VT-3022",
    direction: "OUT",
    carrier: "Đội xe vận chuyển HN",
    plateExpected: "29C-441.88",
    plateActual: "29C-441.88",
    driver: "Phạm Văn Đạt",
    driverPhone: "0987 221 008",
    etaAt: "2026-05-18 09:00",
    status: "Đã vào dock",
    dockCode: "DK-02",
    gateInAt: "2026-05-18 09:10",
    dockInAt: "2026-05-18 09:18",
    photos: [
      { stage: "GATE_IN", type: "plate", url: "/placeholder.svg", takenAt: "2026-05-18 09:10", by: "Vũ Anh Tuấn", note: "Biển số xe vào cổng" },
      { stage: "DOCK_IN", type: "vehicle", url: "/placeholder.svg", takenAt: "2026-05-18 09:18", by: "Lê Văn Sơn", note: "Xe áp dock DK-02 chuẩn bị tải hàng" },
    ],
    exceptions: [],
    orderIds: ["OUT-2026-00455"],
    visits: [
      { id: "VV-002", tripId: "TR-004", plateActual: "29C-441.88", gateInAt: "2026-05-18 09:10", guard: "Vũ Anh Tuấn" },
    ],
  },
  {
    id: "TR-005",
    tripCode: "VT-3105",
    direction: "OUT",
    carrier: "Vận tải Bắc Nam",
    plateExpected: "30F-118.22",
    plateActual: "30F-118.22",
    driver: "Đinh Văn Kiên",
    driverPhone: "0945 220 117",
    etaAt: "2026-05-18 16:00",
    status: "Đã ra cổng",
    dockCode: "DK-01",
    gateInAt: "2026-05-18 15:48",
    dockInAt: "2026-05-18 15:55",
    dockOutAt: "2026-05-18 17:10",
    gateOutAt: "2026-05-18 17:18",
    photos: [
      { stage: "GATE_IN", type: "plate", url: "/placeholder.svg", takenAt: "2026-05-18 15:48", by: "Vũ Anh Tuấn", note: "Biển số xe vào cổng" },
      { stage: "DOCK_IN", type: "vehicle", url: "/placeholder.svg", takenAt: "2026-05-18 15:55", by: "Lê Văn Sơn", note: "Xe áp dock DK-01" },
      { stage: "DOCK_OUT", type: "vehicle", url: "/placeholder.svg", takenAt: "2026-05-18 17:10", by: "Lê Văn Sơn", note: "Hoàn tất tải hàng, rời dock" },
      { stage: "DOCK_OUT", type: "other", url: "/placeholder.svg", takenAt: "2026-05-18 17:11", by: "Lê Văn Sơn", note: "Niêm phong container sau tải" },
      { stage: "GATE_OUT", type: "plate", url: "/placeholder.svg", takenAt: "2026-05-18 17:18", by: "Vũ Anh Tuấn", note: "Biển số xe ra cổng" },
      { stage: "GATE_OUT", type: "vehicle", url: "/placeholder.svg", takenAt: "2026-05-18 17:18", by: "Vũ Anh Tuấn", note: "Xe rời kho" },
    ],
    exceptions: [],
    orderIds: ["OUT-2026-00459"],
    visits: [
      { id: "VV-003", tripId: "TR-005", plateActual: "30F-118.22", gateInAt: "2026-05-18 15:48", gateOutAt: "2026-05-18 17:18", guard: "Vũ Anh Tuấn" },
    ],
  },
  {
    id: "TR-006",
    tripCode: "VT-2520",
    direction: "IN",
    carrier: "Đối tác Samsung Logistics",
    plateExpected: "51G-882.04",
    plateActual: "51G-998.11",
    driver: "Hoàng Minh Quân",
    driverPhone: "0918 442 008",
    etaAt: "2026-05-18 11:00",
    status: "Đổi xe",
    dockCode: "DK-06",
    gateInAt: "2026-05-18 11:30",
    photos: [
      { stage: "GATE_IN", type: "plate", url: "/placeholder.svg", takenAt: "2026-05-18 11:30", by: "Vũ Anh Tuấn", note: "Biển số xe thay thế 51G-998.11" },
      { stage: "GATE_IN", type: "other", url: "/placeholder.svg", takenAt: "2026-05-18 11:31", by: "Vũ Anh Tuấn", note: "Giấy tờ đổi xe của đối tác" },
    ],
    exceptions: [
      { id: "VEX-003", type: "PLATE_CHANGED", note: "Xe gốc hỏng – đối tác đổi sang 51G-998.11", at: "11:30", by: "Vũ Anh Tuấn" },
    ],
    orderIds: ["INB-2026-00123"],
    visits: [
      { id: "VV-004", tripId: "TR-006", plateActual: "51G-998.11", gateInAt: "2026-05-18 11:30", guard: "Vũ Anh Tuấn" },
    ],
  },
];

// === Vehicle ↔ Order mapping helpers (1 Order có thể nhiều chuyến xe) ===
const inboundTripMap: Record<string, string[]> = {
  "INB-2026-00118": ["TR-001", "TR-006"],
  "INB-2026-00120": ["TR-002"],
  "INB-2026-00125": ["TR-002"],
  "INB-2026-00123": ["TR-006"],
};

const outboundTripMap: Record<string, string[]> = {
  "OUT-2026-00451": ["TR-003"],
  "OUT-2026-00455": ["TR-004", "TR-005"],
  "OUT-2026-00459": ["TR-005"],
};

export const getTripsForInbound = (orderId: string): VehicleTrip[] => {
  const ids = inboundTripMap[orderId] || [];
  return ids.map((id) => vehicleTrips.find((t) => t.id === id)).filter(Boolean) as VehicleTrip[];
};

export const getTripsForOutbound = (orderId: string): VehicleTrip[] => {
  const ids = outboundTripMap[orderId] || [];
  return ids.map((id) => vehicleTrips.find((t) => t.id === id)).filter(Boolean) as VehicleTrip[];
};

// Backward compat – trả chuyến đầu tiên
export const getTripForInbound = (orderId: string): VehicleTrip | undefined => getTripsForInbound(orderId)[0];
export const getTripForOutbound = (orderId: string): VehicleTrip | undefined => getTripsForOutbound(orderId)[0];

export const getTrip = (id: string) => vehicleTrips.find((t) => t.id === id);

// === Status helpers ===
export const VEHICLE_STATUS_TONE: Record<VehicleStatus, string> = {
  "Chưa đến":   "bg-muted text-muted-foreground",
  "Đã đến":     "bg-info/10 text-info",
  "Đã vào cổng":"bg-info/10 text-info",
  "Đã vào dock":"bg-success/10 text-success",
  "Đang xử lý": "bg-brand/10 text-brand",
  "Đã ra cổng": "bg-brand/10 text-brand",
  "Quá ETA":    "bg-destructive/10 text-destructive",
  "Đổi xe":     "bg-warning/10 text-warning",
  "Hủy chuyến": "bg-destructive/10 text-destructive",
};

// Đánh giá xem trip đã "ready" cho dỡ hàng / tải hàng chưa
export const isTripReadyForOps = (t?: VehicleTrip) =>
  !!t && (t.status === "Đã vào dock" || t.status === "Đang xử lý" || t.status === "Đã ra cổng");

export const isTripCompletedOut = (t?: VehicleTrip) =>
  !!t && t.status === "Đã ra cổng";

// === Danh sách dock theo kho (khu vực cửa N/X - type "A - Cửa N/X") ===
export const WAREHOUSE_DOCKS: Record<string, { code: string; name: string; zone: string; status: "Trống" | "Đang dùng" | "Bảo trì" }[]> = {
  HN01: [
    { code: "DK-01", name: "Dock số 1 – Cửa nhập A01", zone: "A01", status: "Đang dùng" },
    { code: "DK-02", name: "Dock số 2 – Cửa xuất A01", zone: "A01", status: "Trống" },
    { code: "DK-03", name: "Dock số 3 – Cửa nhập A02", zone: "A02", status: "Đang dùng" },
    { code: "DK-04", name: "Dock số 4 – Cửa xuất A02", zone: "A02", status: "Trống" },
    { code: "DK-05", name: "Dock số 5 – Cửa hàng quá khổ M01", zone: "M01", status: "Trống" },
    { code: "DK-06", name: "Dock số 6 – Cửa phụ", zone: "A02", status: "Bảo trì" },
  ],
  DN01: [
    { code: "DK-DN-01", name: "Dock số 1 – ĐN", zone: "A01", status: "Trống" },
    { code: "DK-DN-02", name: "Dock số 2 – ĐN", zone: "A01", status: "Đang dùng" },
  ],
};

export const getDocksForWarehouse = (warehouseCode?: string) =>
  WAREHOUSE_DOCKS[warehouseCode || "HN01"] || WAREHOUSE_DOCKS.HN01;

// === Demo trips cho Task Giám sát an ninh – đủ trạng thái để hiển thị 3 button ===
export const getSecurityDemoTrips = (direction: "IN" | "OUT"): VehicleTrip[] => {
  const prefix = direction === "IN" ? "SEC-IN" : "SEC-OUT";
  const tripCodePrefix = direction === "IN" ? "VT-SEC-N" : "VT-SEC-X";
  return [
    {
      id: `${prefix}-01`,
      tripCode: `${tripCodePrefix}01`,
      direction,
      carrier: direction === "IN" ? "Vận tải Phương Trang" : "Vận tải Thành Đạt",
      plateExpected: "30H-552.18",
      driver: "Trần Văn Mạnh",
      driverPhone: "0904 112 887",
      etaAt: "2026-05-18 13:30",
      status: "Chưa đến",
      dockCode: "DK-02",
      photos: [],
      exceptions: [],
      orderIds: [direction === "IN" ? "INB-2026-00120" : "OUT-2026-00451"],
      visits: [],
    },
    {
      id: `${prefix}-02`,
      tripCode: `${tripCodePrefix}02`,
      direction,
      carrier: "Đội xe nội bộ",
      plateExpected: "29C-441.88",
      plateActual: "29C-441.88",
      driver: "Phạm Văn Đạt",
      driverPhone: "0987 221 008",
      etaAt: "2026-05-18 09:00",
      status: "Đã vào cổng",
      dockCode: "DK-03",
      gateInAt: "2026-05-18 09:10",
      photos: [
        { stage: "GATE_IN", type: "plate", url: "/placeholder.svg", takenAt: "2026-05-18 09:10", by: "Vũ Anh Tuấn", note: "Biển số xe vào cổng" },
      ],
      exceptions: [],
      orderIds: [direction === "IN" ? "INB-2026-00118" : "OUT-2026-00455"],
      visits: [
        { id: `${prefix}-VV-02`, tripId: `${prefix}-02`, plateActual: "29C-441.88", gateInAt: "2026-05-18 09:10", guard: "Vũ Anh Tuấn" },
      ],
    },
    {
      id: `${prefix}-03`,
      tripCode: `${tripCodePrefix}03`,
      direction,
      carrier: "Vận tải Bắc Nam",
      plateExpected: "30F-118.22",
      plateActual: "30F-118.22",
      driver: "Đinh Văn Kiên",
      driverPhone: "0945 220 117",
      etaAt: "2026-05-18 08:00",
      status: "Đã ra cổng",
      dockCode: "DK-01",
      gateInAt: "2026-05-18 07:48",
      gateOutAt: "2026-05-18 09:18",
      photos: [
        { stage: "GATE_IN", type: "plate", url: "/placeholder.svg", takenAt: "2026-05-18 07:48", by: "Vũ Anh Tuấn", note: "Biển số xe vào cổng" },
        { stage: "GATE_OUT", type: "vehicle", url: "/placeholder.svg", takenAt: "2026-05-18 09:18", by: "Vũ Anh Tuấn", note: "Xe rời kho" },
      ],
      exceptions: [],
      orderIds: [direction === "IN" ? "INB-2026-00123" : "OUT-2026-00459"],
      visits: [
        { id: `${prefix}-VV-03`, tripId: `${prefix}-03`, plateActual: "30F-118.22", gateInAt: "2026-05-18 07:48", gateOutAt: "2026-05-18 09:18", guard: "Vũ Anh Tuấn" },
      ],
    },
  ];
};
