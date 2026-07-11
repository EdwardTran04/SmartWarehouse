import { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, ChevronDown, Users, UserCheck, CheckSquare, TrendingUp, ChevronRight, ClipboardList, Clock, Layers, Weight, Star } from "lucide-react";
import { Badge, Card } from "../../components/ui";

/* =============================================================
   SCREEN: HR DASHBOARD - Kết quả nhân sự
   - Thống kê nhân sự nhanh (4 chỉ số)
   - Bộ lọc tab trượt
   - Danh sách nhân viên chi tiết (KPI, số sao, nhiệm vụ, pallet...)
   - Tổng quan hiệu suất dưới cùng (Biểu đồ tròn SVG + biểu đồ cột CSS)
============================================================ */
type Screen =
  | "login" | "home" | "task" | "hrDashboard" | "receive" | "vehicle" | "vehicleConfirm" | "unload" | "check" | "bbbg"
  | "tagr" | "voffice" | "pack" | "putaway"
  | "outboundOrderList" | "outConfirm" | "outPick" | "outPack" | "outWaitArea" | "outKcs" | "outBBBG" | "outLoad" | "outVOffice"
  | "approve"
  | "inboundOrderList"
  | "worker" | "notify" | "scan" | "profile" | "staffProfile";

type Staff = {
  id: string;
  name: string;
  role: string;
  status: "doing" | "support" | "leave";
  statusLabel: string;
  kpi: number;
  stars: number;
  tasksCount: number;
  workingTime: string;
  palletCount: number;
  cargoWeight: string;
  initials: string;
  online: boolean;
};

const STAFF_DATA: Staff[] = [
  {
    id: "S1",
    name: "Nguyễn Văn A",
    role: "Forklift Operator",
    status: "doing",
    statusLabel: "Đang làm",
    kpi: 98,
    stars: 5,
    tasksCount: 32,
    workingTime: "6h 42'",
    palletCount: 42,
    cargoWeight: "18.2 tấn",
    initials: "NVA",
    online: true
  },
  {
    id: "S2",
    name: "Trần Văn B",
    role: "Warehouse Staff",
    status: "doing",
    statusLabel: "Đang làm",
    kpi: 94,
    stars: 4.5,
    tasksCount: 27,
    workingTime: "5h 10'",
    palletCount: 30,
    cargoWeight: "15.0 tấn",
    initials: "TVB",
    online: true
  },
  {
    id: "S3",
    name: "Phạm Văn C",
    role: "Warehouse Staff",
    status: "doing",
    statusLabel: "Đang làm",
    kpi: 89,
    stars: 4,
    tasksCount: 24,
    workingTime: "6h 05'",
    palletCount: 22,
    cargoWeight: "12.3 tấn",
    initials: "PVC",
    online: true
  },
  {
    id: "S4",
    name: "Lê Văn D",
    role: "Warehouse Staff",
    status: "support",
    statusLabel: "Cần hỗ trợ",
    kpi: 72,
    stars: 2.5,
    tasksCount: 18,
    workingTime: "7h 20'",
    palletCount: 16,
    cargoWeight: "8.1 tấn",
    initials: "LVD",
    online: false
  }
];

export function ScreenHrDashboard({ back, go }: { back: () => void; go: (s: Screen) => void }) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filteredStaff = STAFF_DATA.filter((s) => {
    if (activeFilter === "Tất cả") return true;
    if (activeFilter === "Đang làm") return s.status === "doing";
    if (activeFilter === "Đạt KPI") return s.kpi >= 85;
    if (activeFilter === "Chưa đạt") return s.kpi < 85;
    if (activeFilter === "Nghỉ") return s.status === "leave";
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      {/* Header (Red Background Viettel Brand) */}
      <header className="px-3 pt-4 pb-3 text-white shrink-0 bg-gradient-to-br from-[#EE0033] to-[#FF4D4D] shadow-md">
        <div className="flex items-center justify-between">
          <button onClick={back} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center flex-1 min-w-0 px-2">
            <h1 className="font-extrabold text-[16px] leading-tight">Kết quả nhân sự</h1>
            <button className="text-[11px] text-white/90 flex items-center justify-center gap-1 mx-auto mt-0.5">
              Kho HN01 <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white active:scale-95 transition-all">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white active:scale-95 transition-all">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Scroll Container */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Top 4 Stats Cards */}
        <div className="px-3 pt-3 grid grid-cols-4 gap-1.5 shrink-0">
          {/* Card 1: Tổng nhân sự */}
          <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-sm text-center flex flex-col justify-between h-[82px]">
            <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-800 leading-none">35</div>
              <div className="text-[9px] text-slate-400 font-medium mt-1">Người</div>
            </div>
          </div>

          {/* Card 2: Đang làm việc */}
          <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-sm text-center flex flex-col justify-between h-[82px]">
            <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-800 leading-none">28</div>
              <div className="text-[9px] text-slate-400 font-medium mt-1">Người</div>
            </div>
          </div>

          {/* Card 3: Hoàn thành */}
          <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-sm text-center flex flex-col justify-between h-[82px]">
            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-800 leading-none">8/10</div>
              <div className="text-[9px] text-slate-400 font-medium mt-1">Task</div>
            </div>
          </div>

          {/* Card 4: Hiệu suất TB */}
          <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-sm text-center flex flex-col justify-between h-[82px]">
            <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-800 leading-none">96.8%</div>
              <div className="text-[9px] text-slate-400 font-medium mt-1">KPI</div>
            </div>
          </div>
        </div>

        {/* Filter Slider Tabs */}
        <div className="px-3 pt-3 flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
          {["Tất cả", "Đang làm", "Đạt KPI", "Chưa đạt", "Nghỉ"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`h-7 px-3.5 rounded-full text-[11.5px] font-bold border transition-all shrink-0 ${activeFilter === tab
                  ? "bg-brand text-white border-brand shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
              {tab}
            </button>
          ))}
          {/* Custom Filter Icon Button */}
          <button className="h-7 w-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Staff List Header */}
        <div className="px-3.5 pt-3.5 flex items-center justify-between shrink-0">
          <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
            Danh sách nhân sự
          </h2>
          <button className="text-[11.5px] text-slate-500 font-semibold flex items-center gap-1">
            Sắp xếp: Hiệu suất <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Staff List */}
        <div className="px-3 py-1.5 space-y-2.5">
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 font-medium">Không có nhân sự phù hợp bộ lọc</div>
          ) : (
            filteredStaff.map((staff) => (
              <Card key={staff.id} className="p-3.5 flex gap-3 hover:border-slate-300 transition-colors">

                {/* Left Side: Avatar with Status Dot */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-brand/10 border border-brand/20 flex items-center justify-center font-bold text-brand text-[15px]">
                    {staff.initials}
                  </div>
                  <span
                    className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${staff.online ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                  />
                </div>

                {/* Middle & Right Content */}
                <div className="flex-1 min-w-0">

                  {/* Row 1: Name, Badge, KPI & Chevron */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="font-extrabold text-[14px] text-slate-800 leading-tight truncate">
                        {staff.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {staff.role}
                      </div>
                      <div className="mt-1">
                        <Badge tone={staff.status === "doing" ? "done" : "warn"}>
                          {staff.statusLabel}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-1.5">
                      <div>
                        <div className={`text-[15px] font-extrabold ${staff.kpi >= 90 ? "text-emerald-600" : staff.kpi >= 80 ? "text-amber-500" : "text-rose-600"
                          }`}>
                          {staff.kpi}%
                        </div>
                        <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider leading-none">
                          KPI
                        </div>
                        <div className="flex items-center justify-end gap-0.5 mt-1.5">
                          {/* Rating Stars representation */}
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${i < Math.floor(staff.stars)
                                  ? "text-emerald-500 fill-emerald-500"
                                  : staff.stars % 1 !== 0 && i === Math.floor(staff.stars)
                                    ? "text-emerald-500 fill-emerald-500 opacity-60"
                                    : "text-slate-200"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Row 2: Operational Indicators (2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-700">{staff.tasksCount}</span> Nhiệm vụ
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        Thời gian: <span className="font-bold text-slate-700">{staff.workingTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        Pallet bốc xếp: <span className="font-bold text-slate-700">{staff.palletCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Weight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        Khối lượng: <span className="font-bold text-slate-700">{staff.cargoWeight}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </Card>
            ))
          )}
        </div>

        {/* Bottom Card: General Today KPI Summary */}
        <div className="px-3 pb-6 pt-1">
          <Card className="p-3.5 space-y-3.5">

            {/* Header of summary */}
            <div className="flex justify-between items-center text-[12px] font-bold text-slate-800">
              <span>Tổng quan hiệu suất hôm nay</span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">Cập nhật: 09:30</span>
            </div>

            {/* Circular Progress & Metrics row */}
            <div className="flex items-center justify-between gap-3 pt-1">

              {/* Circular Progress */}
              <div className="flex items-center gap-2">
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeWidth="3.5"
                      strokeDasharray="82, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-[11px] font-extrabold text-slate-800">82%</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Đã hoàn thành</div>
                  <div className="text-[14px] font-extrabold text-emerald-600 mt-1">32 / 39</div>
                  <div className="text-[9px] text-slate-400 font-medium">Nhiệm vụ trong ngày</div>
                </div>
              </div>

              {/* Small divider */}
              <div className="w-[1px] h-10 bg-slate-100 shrink-0" />

              {/* Hourly Bar Chart */}
              <div className="flex-1 flex flex-col items-center">
                <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-2 self-start pl-1">
                  Năng suất theo giờ
                </div>

                {/* CSS Bar Chart container */}
                <div className="flex items-end justify-between w-full h-[36px] px-1 gap-1">
                  {[
                    { hour: "6h", height: "h-3" },
                    { hour: "7h", height: "h-5" },
                    { hour: "8h", height: "h-7" },
                    { hour: "9h", height: "h-9" },
                    { hour: "10h", height: "h-6" },
                    { hour: "11h", height: "h-8" },
                    { hour: "12h", height: "h-4" }
                  ].map((bar, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end">
                      <div className={`w-1.5 ${bar.height} bg-emerald-500 rounded-t-sm transition-all`} />
                      <span className="text-[8px] text-slate-400 font-semibold mt-1 leading-none">{bar.hour}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}
