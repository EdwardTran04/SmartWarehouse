import { Bell, ClipboardList, ListChecks, Truck, LayoutDashboard } from "lucide-react";
import { Card } from "../components/ui";

/* =============================================================
   SCREEN: 2. TRANG CHỦ (Home Screen)
   Chỉ banner + Tiện ích nhanh
================================================================ */
type Screen =
  | "login" | "home" | "task" | "receive" | "vehicle" | "unload" | "check" | "bbbg"
  | "tagr" | "voffice" | "pack" | "putaway"
  | "outboundOrderList" | "outConfirm" | "outPick" | "outPack" | "outWaitArea" | "outKcs" | "outBBBG" | "outLoad" | "outVOffice"
  | "approve"
  | "inboundOrderList"
  | "worker" | "notify" | "scan" | "profile" | "staffProfile";

export function ScreenHome({ go }: { go: (s: Screen) => void }) {
  const menuItems = [
    {
      id: "orders",
      label: "Danh sách lệnh",
      icon: ClipboardList,
      color: "bg-red-50 text-red-600 border-red-100",
      action: () => go("inboundOrderList"),
      disabled: false,
    },
    {
      id: "tasks",
      label: "Danh sách task",
      icon: ListChecks,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      action: () => go("task"),
      disabled: false,
    },
    {
      id: "vehicle",
      label: "Đặt xe",
      icon: Truck,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      action: () => {},
      disabled: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      action: () => {},
      disabled: true,
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="px-4 pt-4 pb-3 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center font-bold text-brand">
              MQ
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Xin chào,</div>
              <div className="text-[15px] font-bold text-slate-900 leading-tight">Trần Minh Quân</div>
              <div className="text-[11px] text-slate-500">Thủ kho · Kho HN01</div>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-brand" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Banner Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#EE0033] to-[#FF4D4D] text-white p-4 shadow-md">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          <div className="absolute right-4 top-4 opacity-15">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold tracking-wider uppercase">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Smart Warehouse AIWS
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold leading-tight">Tối Ưu Vận Hành Kho</h2>
              <p className="text-[12px] opacity-90 mt-0.5">Số hoá toàn diện quy trình xuất nhập kho hàng ngày</p>
            </div>

            <div className="pt-2 border-t border-white/20 grid grid-cols-2 gap-2 mt-2">
              <div>
                <div className="text-[10px] opacity-75">Ca kíp hôm nay</div>
                <div className="text-[12px] font-bold">Ca sáng (06:00 - 14:00)</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] opacity-75">Trạng thái kết nối</div>
                <div className="text-[12px] font-bold flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tiện ích nhanh */}
        <div>
          <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-0.5">Tiện ích nhanh</h3>
          <Card className="p-3">
            <div className="grid grid-cols-4 gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    disabled={item.disabled}
                    className={`flex flex-col items-center text-center focus:outline-none transition-all ${
                      item.disabled
                        ? "opacity-40 cursor-not-allowed active:scale-100"
                        : "active:scale-95"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${item.color} mb-1.5`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}