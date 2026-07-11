import { useState } from "react";
import { Truck, Clock, MapPin, CheckCircle2, Package, Check, ClipboardCheck, ArrowLeft } from "lucide-react";
import { Badge, Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 5. VEHICLE CONFIRM - Xác nhận xe
   - Thống kê xe trên 1 hàng ngang
   - Block Cha: Tuyến đường, loại xe, ngày giờ dự kiến xuất
   - Block Con: Thông tin đơn hàng (Order) bao gồm Điểm đến, Khối lượng (số lượng), Trọng lượng
   - Nút Duyệt toàn bộ ở chân trang
============================================================ */
type Screen =
  | "login" | "home" | "task" | "receive" | "vehicle" | "vehicleConfirm" | "unload" | "check" | "bbbg"
  | "tagr" | "voffice" | "pack" | "putaway"
  | "outboundOrderList" | "outConfirm" | "outPick" | "outPack" | "outWaitArea" | "outKcs" | "outBBBG" | "outLoad" | "outVOffice"
  | "approve"
  | "inboundOrderList"
  | "worker" | "notify" | "scan" | "profile" | "staffProfile";

type OrderInfo = {
  id: string;
  destination: string;
  volume: string;
  weight: string;
};

type RouteInfo = {
  id: string;
  routeName: string;
  vehicleType: string;
  eta: string;
  orders: OrderInfo[];
  status: "pending" | "approved";
};

const INITIAL_ROUTES: RouteInfo[] = [
  {
    id: "R1",
    routeName: "Tuyến 1: HN - Bắc Ninh - Bắc Giang",
    vehicleType: "Container 20 feet",
    eta: "11:30 - 11/07/2026",
    status: "pending",
    orders: [
      { id: "ORD-0991", destination: "Kho Yên Phong (Bắc Ninh)", volume: "150 thùng", weight: "1,800 kg" },
      { id: "ORD-0992", destination: "Kho Song Khê (Bắc Giang)", volume: "90 thùng", weight: "1,100 kg" }
    ]
  },
  {
    id: "R2",
    routeName: "Tuyến 2: HN - Hưng Yên - Hải Dương",
    vehicleType: "Xe tải 5 tấn",
    eta: "14:00 - 11/07/2026",
    status: "pending",
    orders: [
      { id: "ORD-0995", destination: "Kho Phố Nối (Hưng Yên)", volume: "80 thùng", weight: "950 kg" },
      { id: "ORD-0996", destination: "Kho Đại An (Hải Dương)", volume: "120 thùng", weight: "1,450 kg" }
    ]
  },
  {
    id: "R3",
    routeName: "Tuyến 3: HN - Hà Nam - Nam Định",
    vehicleType: "Container 40 feet",
    eta: "16:30 - 11/07/2026",
    status: "pending",
    orders: [
      { id: "ORD-1002", destination: "Kho Đồng Văn (Hà Nam)", volume: "240 thùng", weight: "2,900 kg" },
      { id: "ORD-1003", destination: "Kho Mỹ Xá (Nam Định)", volume: "180 thùng", weight: "2,200 kg" }
    ]
  }
];

export function ScreenVehicleConfirm({ back, go }: { back: () => void; go: (s: Screen) => void }) {
  const [routes, setRoutes] = useState<RouteInfo[]>(INITIAL_ROUTES);
  const [showToast, setShowToast] = useState(false);

  const handleApproveRoute = (id: string) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };

  const handleApproveAll = () => {
    setRoutes(prev => prev.map(r => ({ ...r, status: "approved" })));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  // Helper stats
  const totalVehicles = 8;
  const cont20Count = 3;
  const cont40Count = 2;
  const truck5tCount = 3;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      {/* Top Header */}
      <TopBar brand title="Xác nhận xe" sub="Thông tin chung · Tuyến vận chuyển" onBack={back} />

      {/* Quick Stats on 1 single row */}
      <div className="px-4 mt-3 shrink-0">
        <div className="flex justify-between items-center bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-[11px] font-semibold text-slate-700 shadow-sm">
          <div className="flex items-center gap-1">Tổng: <span className="text-brand font-bold">{totalVehicles} xe</span></div>
          <div className="w-[1px] h-3 bg-slate-200" />
          <div className="flex items-center gap-1">Cont 20ft: <span className="text-blue-600 font-bold">{cont20Count}</span></div>
          <div className="w-[1px] h-3 bg-slate-200" />
          <div className="flex items-center gap-1">Cont 40ft: <span className="text-emerald-600 font-bold">{cont40Count}</span></div>
          <div className="w-[1px] h-3 bg-slate-200" />
          <div className="flex items-center gap-1">Tải 5t: <span className="text-amber-600 font-bold">{truck5tCount}</span></div>
        </div>
      </div>

      {/* Main Routes List (Parent-Child) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {routes.map((route) => (
          <Card
            key={route.id}
            className={`border-l-4 transition-all ${
              route.status === "approved" ? "border-l-emerald-500" : "border-l-amber-500"
            }`}
          >
            <div className="p-4 space-y-3">
              {/* Parent Block Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[13.5px] leading-snug">
                    <MapPin className={`w-4 h-4 shrink-0 ${route.status === "approved" ? "text-emerald-500" : "text-amber-500"}`} />
                    {route.routeName}
                  </div>
                  
                  {/* Vehicle type & Time */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11.5px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-400" /> {route.vehicleType}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {route.eta}
                    </div>
                  </div>
                </div>

                <Badge tone={route.status === "approved" ? "done" : "warn"}>
                  {route.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                </Badge>
              </div>

              {/* Child Blocks: Orders */}
              <div className="space-y-2 border-t border-slate-100 pt-2.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Đơn hàng trong tuyến ({route.orders.length})
                </div>
                
                {route.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[12.5px] font-bold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.destination}
                      </span>
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                        {order.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11.5px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        Khối lượng: <span className="font-semibold text-slate-700">{order.volume}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClipboardCheck className="w-3.5 h-3.5 text-slate-400" />
                        Trọng lượng: <span className="font-semibold text-slate-700">{order.weight}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Individual route approve action */}
              {route.status === "pending" && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleApproveRoute(route.id)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-emerald-50 active:scale-95 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" /> Duyệt tuyến này
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Floating toast notification */}
      {showToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[12px] font-semibold flex items-center gap-2 shadow-lg z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã phê duyệt toàn bộ xe & tuyến xuất hàng!
        </div>
      )}

      {/* Fixed Bottom Action Bar */}
      <div className="shrink-0 bg-white border-t border-slate-200 p-4 pb-safe">
        <Btn
          full
          icon={CheckCircle2}
          onClick={handleApproveAll}
          variant={routes.some(r => r.status === "pending") ? "primary" : "outline"}
          disabled={!routes.some(r => r.status === "pending")}
        >
          {routes.some(r => r.status === "pending") ? "Duyệt toàn bộ" : "Đã duyệt toàn bộ"}
        </Btn>
      </div>
    </div>
  );
}
