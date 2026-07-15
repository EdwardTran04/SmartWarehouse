import { useState } from "react";
import { Truck, Clock, MapPin, CheckCircle2, Package, ClipboardCheck, Plus, X as XIcon, Pencil, ChevronDown } from "lucide-react";
import { Btn, Card } from "../../components/ui";
import { Modal } from "../../components/BottomActionBar";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 5. VEHICLE CONFIRM - Xác nhận xe
   - Thống kê xe trên 1 hàng ngang
   - Block tuyến: sửa ngày giờ, loại xe, thêm/bớt xe
   - Thêm tuyến: chọn nhiều order
================================================================ */
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
  timeFromOrigin?: string;
};

type RouteInfo = {
  id: string;
  routeName: string;
  vehicleType: string;
  eta: string;
  partner?: string;
  orders: OrderInfo[];
};

const AVAILABLE_ORDERS: OrderInfo[] = [
  { id: "ORD-0997", destination: "Kho Văn Giang (Hưng Yên)", volume: "60 thùng", weight: "720 kg", timeFromOrigin: "trong 1.2h" },
  { id: "ORD-0998", destination: "Kho Nam Sách (Hải Dương)", volume: "110 thùng", weight: "1,320 kg", timeFromOrigin: "trong 2.8h" },
  { id: "ORD-0999", destination: "Kho Kim Thanh (Hải Dương)", volume: "75 thùng", weight: "900 kg", timeFromOrigin: "trong 3.2h" },
  { id: "ORD-1000", destination: "Kho Thanh Liêm (Hà Nam)", volume: "95 thùng", weight: "1,140 kg", timeFromOrigin: "trong 2.5h" },
  { id: "ORD-1001", destination: "Kho Ý Yên (Nam Định)", volume: "130 thùng", weight: "1,560 kg", timeFromOrigin: "trong 4h" },
];

const VEHICLE_TYPES = [
  "Container 20 feet",
  "Container 40 feet",
  "Xe tải 5 tấn",
  "Xe tải 8 tấn",
  "Xe tải 10 tấn",
  "Xe tải 15 tấn",
];

const INITIAL_ROUTES: RouteInfo[] = [
  {
    id: "R1",
    routeName: "Tuyến 1: HN - Bắc Ninh - Bắc Giang",
    vehicleType: "Container 20 feet",
    eta: "11:30 - 11/07/2026",
    partner: "Viettel Post",
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
    partner: "DHL Vietnam",
    orders: [
      { id: "ORD-0995", destination: "Kho Phố Nối (Hưng Yên)", volume: "80 thùng", weight: "950 kg", timeFromOrigin: "trong 1.5h" },
      { id: "ORD-0996", destination: "Kho Đại An (Hải Dương)", volume: "120 thùng", weight: "1,450 kg", timeFromOrigin: "trong 3h" }
    ]
  },
  {
    id: "R3",
    routeName: "Tuyến 3: HN - Hà Nam - Nam Định",
    vehicleType: "Container 40 feet",
    eta: "16:30 - 11/07/2026",
    partner: "J&T Express",
    orders: [
      { id: "ORD-1002", destination: "Kho Đồng Văn (Hà Nam)", volume: "240 thùng", weight: "2,900 kg", timeFromOrigin: "trong 2h" },
      { id: "ORD-1003", destination: "Kho Mỹ Xá (Nam Định)", volume: "180 thùng", weight: "2,200 kg", timeFromOrigin: "trong 4.5h" }
    ]
  }
];

export function ScreenVehicleConfirm({ back, go }: { back: () => void; go: (s: Screen) => void }) {
  const [routes, setRoutes] = useState<RouteInfo[]>(INITIAL_ROUTES);
  const [showToast, setShowToast] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteInfo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRouteName, setNewRouteName] = useState("");
  const [newVehicleType, setNewVehicleType] = useState(VEHICLE_TYPES[0]);
  const [newEta, setNewEta] = useState("");
  const [newPartner, setNewPartner] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [editingOrderIds, setEditingOrderIds] = useState<string[]>([]);
  const [deleteRouteId, setDeleteRouteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleApproveAll = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleEditRoute = (route: RouteInfo) => {
    setEditingRoute({ ...route });
    setEditingOrderIds(route.orders.map(o => o.id));
    setShowEditModal(true);
  };

  const toggleEditingOrderSelection = (orderId: string) => {
    setEditingOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSaveEdit = () => {
    if (editingRoute) {
      const updatedOrders = AVAILABLE_ORDERS.filter(o => editingOrderIds.includes(o.id));
      const updatedRoute = { ...editingRoute, orders: updatedOrders };
      setRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
      setShowEditModal(false);
      setEditingRoute(null);
      setEditingOrderIds([]);
    }
  };

  const handleDeleteRoute = (id: string) => {
    setDeleteRouteId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteRoute = () => {
    if (deleteRouteId) {
      setRoutes(prev => prev.filter(r => r.id !== deleteRouteId));
    }
    setShowDeleteModal(false);
    setDeleteRouteId(null);
  };

  const cancelDeleteRoute = () => {
    setShowDeleteModal(false);
    setDeleteRouteId(null);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleAddRoute = () => {
    const selectedOrders = AVAILABLE_ORDERS.filter(o => selectedOrderIds.includes(o.id));
    const newId = "R" + Date.now();
    setRoutes(prev => [...prev, {
      id: newId,
      routeName: newRouteName || "Tuyến mới",
      vehicleType: newVehicleType,
      eta: newEta || new Date().toLocaleString("vi-VN"),
      partner: newPartner || "Viettel Post",
      orders: selectedOrders
    }]);
    setShowAddModal(false);
    setNewRouteName("");
    setNewVehicleType(VEHICLE_TYPES[0]);
    setNewEta("");
    setNewPartner("");
    setSelectedOrderIds([]);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewRouteName("");
    setNewVehicleType(VEHICLE_TYPES[0]);
    setNewEta("");
    setNewPartner("");
    setSelectedOrderIds([]);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingRoute(null);
    setEditingOrderIds([]);
  };

  const totalVehicles = 8;
  const cont20Count = 3;
  const cont40Count = 2;
  const truck5tCount = 3;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      <TopBar brand title="Gom tuyến" sub="Thông tin chung · Tuyến vận chuyển" onBack={back}
        right={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 h-8 rounded-full bg-brand text-white text-[12px] font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm tuyến
          </button>
        }
      />

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

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {routes.map((route) => (
          <Card key={route.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[13.5px] leading-snug">
                  <MapPin className="w-4 h-4 shrink-0 text-brand" />
                  {route.routeName}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 font-medium">
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

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditRoute(route)}
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center active:scale-95 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteRoute(route.id)}
                  className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center active:scale-95 transition-all"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {route.orders.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-2.5">
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
          </Card>
        ))}
      </div>

      {showToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[12px] font-semibold flex items-center gap-2 shadow-lg z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã phê duyệt toàn bộ xe & tuyến xuất hàng!
        </div>
      )}

      <div className="shrink-0 bg-white border-t border-slate-200 p-4 pb-safe">
        <Btn full icon={CheckCircle2} onClick={handleApproveAll}>
          Duyệt toàn bộ
        </Btn>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRoute && (
        <Modal
          title="Chỉnh sửa tuyến"
          onClose={handleCloseEditModal}
          primary={{
            label: "Lưu thay đổi",
            onClick: handleSaveEdit,
            disabled: editingOrderIds.length === 0,
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Tên tuyến</label>
              <input
                type="text"
                value={editingRoute.routeName}
                onChange={(e) => setEditingRoute({ ...editingRoute, routeName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Loại xe</label>
              <div className="relative">
                <select
                  value={editingRoute.vehicleType}
                  onChange={(e) => setEditingRoute({ ...editingRoute, vehicleType: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] appearance-none pr-8"
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Ngày giờ dự kiến</label>
              <input
                type="text"
                value={editingRoute.eta}
                onChange={(e) => setEditingRoute({ ...editingRoute, eta: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px]"
                placeholder="VD: 11:30 - 11/07/2026"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Đối tác vận chuyển</label>
              <input
                type="text"
                value={editingRoute.partner || ""}
                onChange={(e) => setEditingRoute({ ...editingRoute, partner: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px]"
                placeholder="VD: Viettel Post"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Chọn đơn hàng ({editingOrderIds.length} đã chọn)
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2">
                {AVAILABLE_ORDERS.map((order) => {
                  const isSelected = editingOrderIds.includes(order.id);
                  return (
                    <div
                      key={order.id}
                      onClick={() => toggleEditingOrderSelection(order.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected ? "border-brand bg-brand/5" : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? "border-brand bg-brand" : "border-slate-300"
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="text-[12px] font-bold text-slate-800">{order.id}</div>
                            <div className="text-[11px] text-slate-500">{order.destination}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.volume} · {order.weight}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          title="Xóa tuyến"
          onClose={cancelDeleteRoute}
          primary={{
            label: "Xóa tuyến",
            variant: "danger",
            onClick: confirmDeleteRoute,
          }}
        >
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
              <XIcon className="w-7 h-7 text-rose-500" />
            </div>
            <p className="text-[14px] text-slate-600">
              Bạn có chắc chắn muốn xóa tuyến này?
            </p>
            <p className="text-[12px] text-slate-400 mt-1">
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </Modal>
      )}

      {/* Add Route Modal */}
      {showAddModal && (
        <Modal
          title="Thêm tuyến mới"
          onClose={handleCloseAddModal}
          primary={{
            label: "Thêm tuyến",
            onClick: handleAddRoute,
            disabled: selectedOrderIds.length === 0,
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Tên tuyến</label>
              <input
                type="text"
                value={newRouteName}
                onChange={(e) => setNewRouteName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px]"
                placeholder="VD: Tuyến 4: HN - Hải Phòng"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Loại xe</label>
              <div className="relative">
                <select
                  value={newVehicleType}
                  onChange={(e) => setNewVehicleType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] appearance-none pr-8"
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Ngày giờ dự kiến</label>
              <input
                type="text"
                value={newEta}
                onChange={(e) => setNewEta(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px]"
                placeholder="VD: 18:00 - 11/07/2026"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Đối tác vận chuyển</label>
              <input
                type="text"
                value={newPartner}
                onChange={(e) => setNewPartner(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px]"
                placeholder="VD: Viettel Post"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Chọn đơn hàng ({selectedOrderIds.length} đã chọn)
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2">
                {AVAILABLE_ORDERS.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  return (
                    <div
                      key={order.id}
                      onClick={() => toggleOrderSelection(order.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-brand bg-brand/5"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? "border-brand bg-brand" : "border-slate-300"
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="text-[12px] font-bold text-slate-800">{order.id}</div>
                            <div className="text-[11px] text-slate-500">{order.destination}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.volume} · {order.weight}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}