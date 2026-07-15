import { useState } from "react";
import { Truck, Clock, MapPin, CheckCircle2, Package, ClipboardCheck, User, ShieldAlert, Pencil, Save, Phone } from "lucide-react";
import { Badge, Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

type OrderInfo = {
  id: string;
  destination: string;
  volume: string;
  weight: string;
  timeFromOrigin?: string;
};

type PartnerRoute = {
  id: string;
  routeName: string;
  vehicleType: string;
  eta: string; // "14:00 - 11/07/2026"
  proposedTime: string; // "14:00"
  proposedDate: string; // "11/07/2026"
  partner?: string;
  status: "cho_xac_nhan" | "da_xac_nhan";
  driverName?: string;
  driverPhone?: string;
  licensePlate?: string;
  vehicleName?: string;
  orders: OrderInfo[];
};

const INITIAL_PARTNER_ROUTES: PartnerRoute[] = [
  {
    id: "R1",
    routeName: "Tuyến 1: HN - Bắc Ninh - Bắc Giang",
    vehicleType: "Container 20 feet",
    eta: "11:30 - 11/07/2026",
    proposedTime: "11:30",
    proposedDate: "11/07/2026",
    partner: "Viettel Post",
    status: "cho_xac_nhan",
    orders: [
      { id: "ORD-0991", destination: "Kho Yên Phong (Bắc Ninh)", volume: "150 thùng", weight: "1,800 kg", timeFromOrigin: "trong 2h" },
      { id: "ORD-0992", destination: "Kho Song Khê (Bắc Giang)", volume: "90 thùng", weight: "1,100 kg", timeFromOrigin: "trong 4h" }
    ]
  },
  {
    id: "R2",
    routeName: "Tuyến 2: HN - Hưng Yên - Hải Dương",
    vehicleType: "Xe tải 5 tấn",
    eta: "14:00 - 11/07/2026",
    proposedTime: "14:00",
    proposedDate: "11/07/2026",
    partner: "DHL Vietnam",
    status: "cho_xac_nhan",
    orders: [
      { id: "ORD-0995", destination: "Kho Phố Nối (Hưng Yên)", volume: "80 thùng", weight: "950 kg", timeFromOrigin: "trong 1.5h" },
      { id: "ORD-0996", destination: "Kho Đại An (Hải Dương)", volume: "120 thùng", weight: "1,450 kg", timeFromOrigin: "trong 3h" }
    ]
  },
  {
    id: "R3",
    routeName: "Tuyến 3: HN - Hà Nam - Nam Định",
    vehicleType: "Xe tải 8 tấn",
    eta: "15:30 - 12/07/2026",
    proposedTime: "15:30",
    proposedDate: "12/07/2026",
    partner: "Viettel Post",
    status: "da_xac_nhan",
    driverName: "Nguyễn Văn Hùng",
    driverPhone: "0912 345 678",
    licensePlate: "29C-882.11",
    vehicleName: "Xe tải Isuzu 8 tấn",
    orders: [
      { id: "ORD-0997", destination: "Kho Văn Giang (Hưng Yên)", volume: "60 thùng", weight: "720 kg", timeFromOrigin: "trong 1.2h" }
    ]
  }
];

export function ScreenPartnerVehicle({ back }: { back: () => void }) {
  const [routes, setRoutes] = useState<PartnerRoute[]>(INITIAL_PARTNER_ROUTES);
  const [activeTab, setActiveTab] = useState<"all" | "cho_xac_nhan" | "da_xac_nhan">("all");
  
  // Modal states for updating driver
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [activeRouteIdForDriver, setActiveRouteIdForDriver] = useState<string | null>(null);
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleName, setVehicleName] = useState("");

  // Modal states for confirming schedule time
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeRouteIdForConfirm, setActiveRouteIdForConfirm] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("");
  const [fixedDate, setFixedDate] = useState("");

  const openDriverModal = (route: PartnerRoute) => {
    setActiveRouteIdForDriver(route.id);
    setDriverName(route.driverName || "");
    setDriverPhone(route.driverPhone || "");
    setLicensePlate(route.licensePlate || "");
    setVehicleName(route.vehicleName || "");
    setShowDriverModal(true);
  };

  const handleSaveDriver = () => {
    if (!activeRouteIdForDriver) return;
    setRoutes(prev => prev.map(r => r.id === activeRouteIdForDriver ? {
      ...r,
      driverName: driverName || undefined,
      driverPhone: driverPhone || undefined,
      licensePlate: licensePlate || undefined,
      vehicleName: vehicleName || undefined
    } : r));
    setShowDriverModal(false);
    setActiveRouteIdForDriver(null);
  };

  const openConfirmModal = (route: PartnerRoute) => {
    setActiveRouteIdForConfirm(route.id);
    setEditTime(route.proposedTime);
    setFixedDate(route.proposedDate);
    setShowConfirmModal(true);
  };

  const handleSaveConfirm = () => {
    if (!activeRouteIdForConfirm) return;
    setRoutes(prev => prev.map(r => r.id === activeRouteIdForConfirm ? {
      ...r,
      proposedTime: editTime,
      eta: `${editTime} - ${r.proposedDate}`,
      status: "da_xac_nhan"
    } : r));
    setShowConfirmModal(false);
    setActiveRouteIdForConfirm(null);
  };

  const countOf = (status: "all" | "cho_xac_nhan" | "da_xac_nhan") => {
    if (status === "all") return routes.length;
    return routes.filter(r => r.status === status).length;
  };

  const filteredRoutes = activeTab === "all" ? routes : routes.filter(r => r.status === activeTab);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar brand title="Đối tác duyệt lịch" sub="Quản lý xe & Phê duyệt lịch" onBack={back} />

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-3.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Cumulative Statistics Section */}
        <Card className="p-3">
          <div className="grid grid-cols-2 gap-4 text-[12px] text-slate-600">
            <div>
              <div className="text-slate-500 font-semibold mb-1 text-[11px] uppercase tracking-wider">Lũy kế tháng</div>
              <div className="space-y-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span>Số xe</span>
                  <span className="font-bold text-slate-800">45 xe</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span>Khối lượng</span>
                  <span className="font-bold text-slate-800">124.5 tấn</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Thể tích</span>
                  <span className="font-bold text-slate-800">498.0 m³</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold mb-1 text-[11px] uppercase tracking-wider">Lũy kế năm</div>
              <div className="space-y-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span>Số xe</span>
                  <span className="font-bold text-slate-800">542 xe</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span>Khối lượng</span>
                  <span className="font-bold text-slate-800">1,560.8 tấn</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Thể tích</span>
                  <span className="font-bold text-slate-800">6,243.2 m³</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Filter Tabs */}
        <div className="overflow-x-auto pb-1 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-1.5">
            {[
              { id: "all" as const, label: "Tất cả" },
              { id: "cho_xac_nhan" as const, label: "Chờ xác nhận" },
              { id: "da_xac_nhan" as const, label: "Đã xác nhận" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`h-9 px-4 rounded-full text-[12px] font-semibold border whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t.label} ({countOf(t.id)})
              </button>
            ))}
          </div>
        </div>

        {/* Routes List */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Danh sách lịch xe ({filteredRoutes.length})
          </div>

          {filteredRoutes.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 text-sm">
              Không có lịch xe nào thuộc trạng thái này.
            </Card>
          ) : (
            filteredRoutes.map((route) => (
              <Card key={route.id} className="p-4 space-y-3 bg-white">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-[15px] text-slate-800 leading-snug">
                      {route.routeName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-slate-500 mt-2">
                      <div className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-slate-400" /> {route.vehicleType}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {route.eta}
                      </div>
                      {route.partner && (
                        <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100/80 px-1.5 py-0.5 rounded text-[10px]">
                          Đối tác: <span className="font-bold">{route.partner}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge tone={route.status === "cho_xac_nhan" ? "warn" : "done"}>
                    {route.status === "cho_xac_nhan" ? "Chờ xác nhận" : "Đã xác nhận"}
                  </Badge>
                </div>

                {/* Driver Info Display */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Thông tin xe & Tài xế
                  </div>
                  
                  {route.driverName ? (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[12px] bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400">Tài xế:</span>{" "}
                        <span className="font-semibold text-slate-800">{route.driverName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">SĐT:</span>{" "}
                        <span className="font-semibold text-brand">{route.driverPhone || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Biển số:</span>{" "}
                        <span className="font-semibold text-slate-800">{route.licensePlate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Loại xe:</span>{" "}
                        <span className="font-semibold text-slate-800">{route.vehicleName}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[12px] text-orange-600 font-medium flex items-center gap-1 bg-orange-50/50 p-2 rounded-lg border border-orange-100">
                      <ShieldAlert className="w-3.5 h-3.5" /> Chưa có thông tin tài xế và biển số xe.
                    </div>
                  )}
                </div>

                {/* Orders List inside Route */}
                {route.orders.length > 0 && (
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Đơn hàng trong tuyến ({route.orders.length})
                    </div>

                    {route.orders.map((order) => (
                      <div key={order.id} className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[12.5px] font-bold text-slate-800 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.destination}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {order.timeFromOrigin && (
                              <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-semibold whitespace-nowrap">
                                ⏱ {order.timeFromOrigin}
                              </span>
                            )}
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                              {order.id}
                            </span>
                          </div>
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
                )}

                {/* Two buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openDriverModal(route)}
                    className="h-9 px-3 rounded-lg border border-slate-200 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 active:scale-95 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Cập nhật thông tin
                  </button>

                  {route.status === "cho_xac_nhan" ? (
                    <button
                      onClick={() => openConfirmModal(route)}
                      className="h-9 px-3 rounded-lg bg-indigo-600 text-white text-[12.5px] font-semibold hover:bg-indigo-700 flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Xác nhận
                    </button>
                  ) : (
                    <div className="h-9 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-[12px] font-bold border border-emerald-100 flex items-center justify-center gap-1 select-none animate-fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã xác nhận lịch xe
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Driver details Modal */}
      {showDriverModal && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowDriverModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3.5 animate-in slide-in-from-bottom duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[16px] text-slate-900">Gửi thông tin xe & tài xế</h4>
              <button onClick={() => setShowDriverModal(false)} className="text-slate-400 font-bold">X</button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tên tài xế</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Nhập họ tên lái xe..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Số điện thoại tài xế</label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Nhập số điện thoại..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Biển số xe</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ví dụ: 29C-123.45..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Chi tiết xe thực tế</label>
                <input
                  type="text"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ví dụ: Xe tải Thaco 5 tấn..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDriverModal(false)}
                className="h-10 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveDriver}
                className="h-10 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-sm"
              >
                Cập nhật thông tin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm & Time Edit Modal */}
      {showConfirmModal && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowConfirmModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3.5 animate-in slide-in-from-bottom duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[16px] text-slate-900">Xác nhận lịch xe vận chuyển</h4>
              <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 font-bold">X</button>
            </div>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ngày giao hàng (Cố định - Không thể sửa)</label>
                <input
                  type="text"
                  value={fixedDate}
                  disabled
                  className="h-10 w-full px-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-400 text-sm font-semibold select-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Giờ dự kiến đến (Có thể chỉnh sửa)</label>
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="h-10 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveConfirm}
                className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-1"
              >
                <Save className="w-4 h-4" /> Xác nhận và lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
