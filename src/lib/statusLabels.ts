// Vietnamese labels for order statuses (Inbound + Outbound) and helpers.

export const INBOUND_STATUS_VI: Record<string, string> = {
  "New": "Mới",
  "API Error": "Lỗi API",
  "Waiting Confirm": "Chờ xác nhận",
  "Waiting Assign": "Chờ phân công",
  "In Progress": "Đang xử lý",
  "Waiting KCS": "Chờ KCS",
  "KCS Failed": "KCS không đạt",
  "Ready for GR": "Sẵn sàng thực nhập",
  "GR Posted": "Đã thực nhập",
  "Pending": "Tạm hoãn",
  "Putaway": "Đang lưu trữ",
  "Packing": "Đang đóng gói",
  "Waiting VOffice": "Chờ ký VOffice",
  "Completed": "Hoàn thành",
  "Rejected": "Từ chối",
};

export const OUTBOUND_STATUS_VI: Record<string, string> = {
  "New": "Mới",
  "API Error": "Lỗi API",
  "Validated": "Đã kiểm tra",
  "Waiting Confirm": "Chờ xác nhận",
  "Accepted": "Đã chấp nhận",
  "Rejected": "Từ chối",
  "Task Planning": "Đang lập kế hoạch task",
  "Waiting Assignment Approval": "Chờ duyệt phân công",
  "Task Assigned": "Đã phân công",
  "Transport Required": "Cần vận chuyển",
  "Transport Planning": "Đang lên lịch xe",
  "Transport Approved": "Đã duyệt vận chuyển",
  "Vehicle Confirmed": "Xe đã xác nhận",
  "Vehicle Arrived": "Xe đã đến",
  "Picking Assigned": "Đã giao lấy hàng",
  "Picking In Progress": "Đang lấy hàng",
  "Picked": "Đã lấy hàng",
  "Packing Required": "Cần đóng gói",
  "Packing In Progress": "Đang đóng gói",
  "Packed": "Đã đóng gói",
  "Checking": "Đang kiểm hàng",
  "Checked": "Đã kiểm hàng",
  "Handover Signed": "Đã ký bàn giao",
  "Ready for GI": "Sẵn sàng xuất",
  "GI Posting": "Đang ghi xuất",
  "GI Posted": "Đã thực xuất",
  "GI API Error": "Lỗi API xuất",
  "Waiting VOffice": "Chờ ký VOffice",
  "Signed": "Đã ký",
  "Sign Rejected": "Từ chối ký",
  "Loading": "Đang tải xe",
  "Loaded": "Đã tải xe",
  "Handed Over": "Đã bàn giao",
  "Restorage Required": "Cần lưu trữ lại",
  "Completed": "Hoàn thành",
  "Cancelled": "Đã huỷ",
  "Closed With Exception": "Đóng có phát sinh",
};

export const inboundStatusVi = (s: string) => INBOUND_STATUS_VI[s] ?? s;
export const outboundStatusVi = (s: string) => OUTBOUND_STATUS_VI[s] ?? s;

export const OUTBOUND_TYPE_LABEL: Record<string, string> = {
  "OUT-VC": "Xuất kho vận chuyển",
  "OUT-OTH": "Xuất kho khác",
};

// Trạng thái xe vận chuyển dùng tại cột VC trong danh sách lệnh xuất.
export type OutVehicleDisplay =
  | "Chờ lập lịch xe"
  | "Chờ đối tác xác nhận"
  | "Xe đã xác nhận"
  | "Xe đã đến"
  | "Đã vào cổng"
  | "Đã vào dock"
  | "Đang xử lý"
  | "Đã ra cổng"
  | "Xe quá ETA"
  | "Đổi xe"
  | "Hủy chuyến"
  | "Xe đã rời kho";

export function getOutVehicleDisplay(o: {
  hasTransport: boolean;
  status: string;
  vehicle?: { vehicleStatus: string };
  // Optional: trạng thái trip thực tế (nếu có) sẽ ưu tiên dùng
  tripStatus?: string;
}): OutVehicleDisplay | null {
  if (!o.hasTransport) return null;

  // Ưu tiên trip status nếu có (entity VehicleTrip)
  const ts = o.tripStatus;
  if (ts === "Đã vào cổng") return "Đã vào cổng";
  if (ts === "Đã vào dock") return "Đã vào dock";
  if (ts === "Đang xử lý") return "Đang xử lý";
  if (ts === "Đã ra cổng") return "Đã ra cổng";
  if (ts === "Quá ETA") return "Xe quá ETA";
  if (ts === "Đổi xe") return "Đổi xe";
  if (ts === "Hủy chuyến") return "Hủy chuyến";
  if (ts === "Đã đến") return "Xe đã đến";

  const v = o.vehicle?.vehicleStatus;
  if (!o.vehicle || v === "Chưa lên lịch") return "Chờ lập lịch xe";
  if (v === "Chưa đến") {
    if (o.status === "Transport Planning" || o.status === "Transport Required") return "Chờ đối tác xác nhận";
    return "Xe đã xác nhận";
  }
  if (v === "Đã đến") return "Xe đã đến";
  if (v === "Quá ETA") return "Xe quá ETA";
  if (v === "Đã rời cổng") return "Xe đã rời kho";
  return "Chờ lập lịch xe";
}

export const OUT_VEHICLE_TONE: Record<OutVehicleDisplay, string> = {
  "Chờ lập lịch xe":     "bg-muted text-muted-foreground",
  "Chờ đối tác xác nhận":"bg-warning/10 text-warning",
  "Xe đã xác nhận":      "bg-info/10 text-info",
  "Xe đã đến":           "bg-info/10 text-info",
  "Đã vào cổng":         "bg-info/10 text-info",
  "Đã vào dock":         "bg-success/10 text-success",
  "Đang xử lý":          "bg-brand/10 text-brand",
  "Đã ra cổng":          "bg-brand/10 text-brand",
  "Xe quá ETA":          "bg-destructive/10 text-destructive",
  "Đổi xe":              "bg-warning/10 text-warning",
  "Hủy chuyến":          "bg-destructive/10 text-destructive",
  "Xe đã rời kho":       "bg-brand/10 text-brand",
};

