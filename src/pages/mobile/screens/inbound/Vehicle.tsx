import { useState } from "react";
import { Camera, CheckCircle2, Truck, Phone, User, ShieldCheck } from "lucide-react";
import { Badge, Btn, Card, Field, Input } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 5. VEHICLE - Giám sát an ninh
   - Giám sát và xác nhận xe ra vào kho
   - 2 bước chụp ảnh: biển số xe + tài xế cầm CCCD
   - Block xe giống danh sách lệnh nhập
============================================================ */
type Vehicle = {
  id: string;
  licensePlate: string;
  vehicleType: string;
  vehicleTypeVi: string;
  driverName: string;
  driverPhone: string;
  supervisor: string;
  eta: string;
};

const VEHICLES: Vehicle[] = [
  { id: "V1", licensePlate: "29C-184.55", vehicleType: "Container 20ft", vehicleTypeVi: "Xe container 20 feet", driverName: "Nguyễn Văn Tài", driverPhone: "0987 654 321", supervisor: "Nguyễn Thị Lan", eta: "09:00" },
  { id: "V2", licensePlate: "29C-567.89", vehicleType: "Container 40ft", vehicleTypeVi: "Xe container 40 feet", driverName: "Trần Văn Minh", driverPhone: "0932 123 456", supervisor: "Lê Minh Hoàng", eta: "10:30" },
  { id: "V3", licensePlate: "29C-999.88", vehicleType: "Truck 5 ton", vehicleTypeVi: "Xe tải 5 tấn", driverName: "Lê Hoàng Nam", driverPhone: "0912 345 678", supervisor: "Phạm Văn Hùng", eta: "11:00" },
];

export function ScreenVehicle({ back, goScan }: { back: () => void; goScan: (vehicleId: string) => void }) {
  const [vehicles] = useState<Vehicle[]>(VEHICLES);
  const [confirmedIds, setConfirmedIds] = useState<string[]>(["V3"]);
  const [filter, setFilter] = useState<"all" | "unconfirmed" | "confirmed">("all");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [plateInput, setPlateInput] = useState("");

  const handleConfirmClick = (vehicle: Vehicle) => {
    setConfirmingId(vehicle.id);
    setPlateInput(vehicle.licensePlate);
  };

  const handleConfirm = (vehicleId: string) => {
    setConfirmedIds((prev) => [...prev, vehicleId]);
    setConfirmingId(null);
    goScan(vehicleId);
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (filter === "unconfirmed") return !confirmedIds.includes(v.id);
    if (filter === "confirmed") return confirmedIds.includes(v.id);
    return true;
  });

  const doneMonth = 124;
  const doneYear = 1562;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title="Giám sát an ninh" sub={`INB-2026-00231 · ${vehicles.length} xe`} onBack={back} />

      {/* Lũy kế Card */}
      <div className="px-4 mt-3">
        <Card className="p-3">
          <div className="grid grid-cols-2 gap-4 text-[12px] text-slate-600">
            <div>
              <div className="text-slate-500 mb-0.5">Lũy kế tháng</div>
              <div className="text-[16px] font-bold text-slate-900">
                {doneMonth}
              </div>
            </div>
            <div>
              <div className="text-slate-500 mb-0.5">Lũy kế năm</div>
              <div className="text-[16px] font-bold text-slate-900">
                {doneYear.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="px-4 mt-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-1.5 w-max">
          <button
            onClick={() => setFilter("all")}
            className={`h-8 px-3 rounded-full text-[12px] font-semibold border whitespace-nowrap ${
              filter === "all" ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            Tất cả ({vehicles.length})
          </button>
          <button
            onClick={() => setFilter("unconfirmed")}
            className={`h-8 px-3 rounded-full text-[12px] font-semibold border whitespace-nowrap ${
              filter === "unconfirmed" ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            Chưa xác nhận ({vehicles.filter(v => !confirmedIds.includes(v.id)).length})
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`h-8 px-3 rounded-full text-[12px] font-semibold border whitespace-nowrap ${
              filter === "confirmed" ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            Đã xác nhận ({vehicles.filter(v => confirmedIds.includes(v.id)).length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filteredVehicles.length === 0 && (
          <div className="text-center text-slate-500 text-[13px] mt-10">Không có xe nào</div>
        )}
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-[15px]">{vehicle.licensePlate}</span>
                <div className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> {vehicle.vehicleTypeVi}
                </div>
              </div>
              {confirmedIds.includes(vehicle.id) ? (
                <Badge tone="done">Đã xác nhận</Badge>
              ) : (
                <Btn
                  size="xs"
                  icon={CheckCircle2}
                  onClick={() => handleConfirmClick(vehicle)}
                >
                  XN
                </Btn>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 text-[12px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-800 font-medium">Tài xế: {vehicle.driverName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-800 font-medium">SĐT: {vehicle.driverPhone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-800 font-medium">Người phụ trách: {vehicle.supervisor}</span>
              </div>
              <div className="text-slate-500">ETA: <span className="font-semibold text-slate-800">{vehicle.eta}</span></div>
            </div>
          </Card>
        ))}
      </div>

      {confirmingId && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4 rounded-[36px]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-[18px] font-bold text-slate-900 mb-4">Xác nhận xe vào kho</div>
            <Field label="Biển số xe">
              <Input
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value)}
                placeholder="Nhập biển số xe"
              />
            </Field>
            <div className="flex gap-2 mt-4 justify-end">
              <Btn
                variant="outline"
                onClick={() => setConfirmingId(null)}
              >
                Hủy
              </Btn>
              <Btn
                icon={Camera}
                onClick={() => handleConfirm(confirmingId)}
              >
                Xác nhận & chụp ảnh
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}