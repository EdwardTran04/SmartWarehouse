/* =============================================================
   MOBILE SCREENS - Index & Types
   ============================================================= */

export type Screen =
  | "login" | "home" | "task" | "hrDashboard" | "receive" | "vehicle" | "vehicleConfirm" | "unload" | "check" | "bbbg"
  | "tagr" | "voffice" | "pack" | "putaway"
  | "outboundOrderList" | "outConfirm" | "outPick" | "outPack" | "outWaitArea" | "outKcs" | "outBBBG" | "outLoad" | "outVOffice"
  | "approve"
  | "inboundOrderList"
  | "worker" | "notify" | "scan" | "profile" | "staffProfile";

export const screens: { id: Screen; label: string; group: string }[] = [
  { id: "login", label: "1. Login / Chọn kho", group: "Phần 1 · Khởi đầu" },
  { id: "home", label: "2. Trang chủ", group: "Phần 1 · Khởi đầu" },
  { id: "task", label: "3. Danh sách task", group: "Phần 1 · Khởi đầu" },
  { id: "hrDashboard", label: "3. Kết quả nhân sự", group: "Phần 2 · Thông tin chung" },
  { id: "approve", label: "4. Phê duyệt phân công", group: "Phần 2 · Thông tin chung" },
  { id: "vehicle", label: "5. Giám sát an ninh", group: "Phần 2 · Thông tin chung" },
  { id: "vehicleConfirm", label: "6. Xác nhận xe", group: "Phần 2 · Thông tin chung" },
  { id: "inboundOrderList", label: "N1 · DS lệnh nhập", group: "Phần 3 · Luồng nhập" },
  { id: "receive", label: "N2 · Xác nhận lệnh nhập", group: "Phần 3 · Luồng nhập" },
  { id: "unload", label: "N3 · Dỡ hàng", group: "Phần 3 · Luồng nhập" },
  { id: "check", label: "N4 · Kiểm hàng", group: "Phần 3 · Luồng nhập" },
  { id: "bbbg", label: "N5 · Ký BBBG", group: "Phần 3 · Luồng nhập" },
  { id: "tagr", label: "N6 · Thực nhập", group: "Phần 3 · Luồng nhập" },
  { id: "voffice", label: "N7 · Ký VOffice", group: "Phần 3 · Luồng nhập" },
  { id: "pack", label: "N8 · Đóng gói / In tem", group: "Phần 3 · Luồng nhập" },
  { id: "putaway", label: "N9 · Putaway", group: "Phần 3 · Luồng nhập" },
  { id: "outboundOrderList", label: "X1 · DS lệnh xuất", group: "Phần 4 · Luồng xuất" },
  { id: "outConfirm", label: "X2 · Xác nhận lệnh xuất", group: "Phần 4 · Luồng xuất" },
  { id: "outPick", label: "X3 · Lấy hàng ra khu đóng gói", group: "Phần 4 · Luồng xuất" },
  { id: "outPack", label: "X4 · Đóng gói", group: "Phần 4 · Luồng xuất" },
  { id: "outWaitArea", label: "X5 · Khu chờ xuất", group: "Phần 4 · Luồng xuất" },
  { id: "outKcs", label: "X6 · Kiểm hàng", group: "Phần 4 · Luồng xuất" },
  { id: "outBBBG", label: "X7 · Ký BBBG", group: "Phần 4 · Luồng xuất" },
  { id: "outLoad", label: "X8 · Load hàng lên xe", group: "Phần 4 · Luồng xuất" },
  { id: "outVOffice", label: "X9 · Ký VOffice xuất", group: "Phần 4 · Luồng xuất" },
  { id: "worker", label: "+ Worker Status", group: "Hệ thống" },
  { id: "notify", label: "+ Notification Center", group: "Hệ thống" },
  { id: "scan", label: "+ Scan", group: "Hệ thống" },
  { id: "profile", label: "+ Cá nhân", group: "Hệ thống" },
  { id: "staffProfile", label: "+ Hồ sơ nhân viên", group: "Hệ thống" },
];

// Screen components
export { ScreenLogin } from "./Login";
export { ScreenHome } from "./Home";
export { ScreenHomeTask } from "./HomeTask";
export { ScreenReceive } from "./inbound/Receive";
export { ScreenVehicle } from "./inbound/Vehicle";
export { ScreenVehicleConfirm } from "./inbound/VehicleConfirm";
export { ScreenUnload } from "./inbound/Unload";
export { ScreenCheck } from "./inbound/Check";
export { ScreenBBBG } from "./inbound/BBBG";
export { ScreenTAGR } from "./inbound/TAGR";
export { ScreenVOffice } from "./inbound/VOffice";
export { ScreenPack } from "./inbound/Pack";
export { ScreenPutaway } from "./inbound/Putaway";
export { ScreenApprove } from "./approve/Approve";
export { ScreenInboundOrderList } from "./inbound/InboundOrderList";
export { ScreenOutboundOrderList } from "./outbound/OutboundOrderList";
export { ScreenOutConfirm } from "./outbound/OutConfirm";
export { ScreenOutPick } from "./outbound/OutPick";
export { ScreenOutKcs } from "./outbound/OutKcs";
export { ScreenOutPack } from "./outbound/OutPack";
export { ScreenOutBBBG } from "./outbound/OutBBBG";
export { ScreenOutLoad } from "./outbound/OutLoad";
export { ScreenOutVOffice } from "./outbound/OutVOffice";
export { ScreenOutWaitArea } from "./outbound/OutWaitArea";
export { ScreenWorker } from "./system/Worker";
export { ScreenNotify } from "./system/Notify";
export { ScreenScan } from "./system/Scan";
export { ScreenProfile } from "./system/Profile";
export { ScreenHrDashboard } from "./system/HrDashboard";
export { ScreenStaffProfile } from "../staff/StaffProfile";