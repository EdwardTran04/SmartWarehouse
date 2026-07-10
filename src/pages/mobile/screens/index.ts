/* =============================================================
   MOBILE SCREENS - Index & Types
   ============================================================= */

export type Screen =
  | "login" | "home" | "receive" | "vehicle" | "unload" | "check" | "bbbg"
  | "tagr" | "voffice" | "pack" | "putaway"
  | "outConfirm" | "outPick" | "outPack" | "outKcs" | "outLoad" | "outHandover"
  | "approve"
  | "inboundOrderList"
  | "worker" | "notify" | "scan" | "profile" | "staffProfile";

export const screens: { id: Screen; label: string; group: string }[] = [
  { id: "login", label: "1. Login / Chọn kho", group: "Khởi đầu" },
  { id: "home", label: "2. Home Task", group: "Khởi đầu" },
  { id: "inboundOrderList", label: "3. DS lệnh nhập", group: "Luồng nhập" },
  { id: "receive", label: "4. Xác nhận lệnh nhập", group: "Luồng nhập" },
  { id: "approve", label: "5. Phê duyệt phân công", group: "Luồng nhập" },
  { id: "vehicle", label: "6. Xác nhận xe / cổng", group: "Luồng nhập" },
  { id: "unload", label: "7. Dỡ hàng", group: "Luồng nhập" },
  { id: "check", label: "8. Kiểm hàng", group: "Luồng nhập" },
  { id: "bbbg", label: "9. Ký BBBG", group: "Luồng nhập" },
  { id: "tagr", label: "10. Thực nhập", group: "Luồng nhập" },
  { id: "voffice", label: "11. Ký VOffice", group: "Luồng nhập" },
  { id: "pack", label: "12. Đóng gói / In tem", group: "Luồng nhập" },
  { id: "putaway", label: "13. Putaway", group: "Luồng nhập" },
  { id: "outConfirm", label: "O1. Xác nhận lệnh xuất", group: "Luồng xuất" },
  { id: "outPick", label: "O2. Picking hàng", group: "Luồng xuất" },
  { id: "outKcs", label: "O3. KCS xuất", group: "Luồng xuất" },
  { id: "outPack", label: "O4. Đóng gói xuất", group: "Luồng xuất" },
  { id: "outLoad", label: "O5. Load hàng lên xe", group: "Luồng xuất" },
  { id: "outHandover", label: "O6. Bàn giao vận chuyển", group: "Luồng xuất" },
  { id: "worker", label: "14. Worker Status", group: "Hệ thống" },
  { id: "notify", label: "15. Notification Center", group: "Hệ thống" },
  { id: "scan", label: "+ Scan", group: "Hệ thống" },
  { id: "profile", label: "+ Cá nhân", group: "Hệ thống" },
  { id: "staffProfile", label: "+ Hồ sơ nhân viên", group: "Hệ thống" },
];

// Screen components
export { ScreenLogin } from "./Login";
export { ScreenHome } from "./Home";
export { ScreenTask } from "./Task";
export { ScreenReceive } from "./inbound/Receive";
export { ScreenVehicle } from "./inbound/Vehicle";
export { ScreenUnload } from "./inbound/Unload";
export { ScreenCheck } from "./inbound/Check";
export { ScreenBBBG } from "./inbound/BBBG";
export { ScreenTAGR } from "./inbound/TAGR";
export { ScreenVOffice } from "./inbound/VOffice";
export { ScreenPack } from "./inbound/Pack";
export { ScreenPutaway } from "./inbound/Putaway";
export { ScreenApprove } from "./approve/Approve";
export { ScreenInboundOrderList } from "./inbound/InboundOrderList";
export { ScreenOutConfirm } from "./outbound/OutConfirm";
export { ScreenOutPick } from "./outbound/OutPick";
export { ScreenOutKcs } from "./outbound/OutKcs";
export { ScreenOutPack } from "./outbound/OutPack";
export { ScreenOutLoad } from "./outbound/OutLoad";
export { ScreenOutHandover } from "./outbound/OutHandover";
export { ScreenWorker } from "./system/Worker";
export { ScreenNotify } from "./system/Notify";
export { ScreenScan } from "./system/Scan";
export { ScreenProfile } from "./system/Profile";
export { ScreenStaffProfile } from "../staff/StaffProfile";