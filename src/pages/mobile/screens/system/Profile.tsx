import { useState } from "react";
import { Badge, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SYSTEM SCREEN: Profile (Merged Cá nhân & Hồ sơ nhân viên)
 ============================================================ */
export function ScreenProfile({ back }: { back: () => void; go?: any }) {
  const [activeTab, setActiveTab] = useState<"info" | "work" | "stats">("info");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar brand title="Thông tin cá nhân" onBack={back} />
      
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Profile Header */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[20px] shadow-sm">TMQ</div>
            <div className="flex-1">
              <div className="font-bold text-[17px] text-slate-900">Trần Mình Quân</div>
              <div className="text-[12px] text-slate-500 mt-0.5">nv.kho.hn01 · Thủ kho HN01</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Badge tone="done">Đang làm việc</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-2 text-center text-[12px] font-bold rounded-lg transition-all ${
              activeTab === "info" ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Cá nhân
          </button>
          <button
            onClick={() => setActiveTab("work")}
            className={`flex-1 py-2 text-center text-[12px] font-bold rounded-lg transition-all ${
              activeTab === "work" ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Công việc
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-2 text-center text-[12px] font-bold rounded-lg transition-all ${
              activeTab === "stats" ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Hiệu suất
          </button>
        </div>

        {/* Tab Content 1: Cá nhân */}
        {activeTab === "info" && (
          <div className="space-y-3">
            <Card className="p-4 space-y-3">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100 pb-1.5">Thông tin liên hệ</div>
              <div className="space-y-3">
                <InfoRow label="Mã nhân viên" value="NV-2024-0088" />
                <InfoRow label="Họ và tên" value="Trần Mình Quân" />
                <InfoRow label="Ngày sinh" value="15/03/1988" />
                <InfoRow label="Số điện thoại" value="0987 654 321" />
                <InfoRow label="Email" value="tranminhquan@viettel.com" />
                <InfoRow label="CCCD" value="012 345 678 901" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-3 border-b border-slate-100 pb-1.5">Kỹ năng & Chuyên môn</div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge tone="done">Voffice</Badge>
                <Badge tone="done">BBBG</Badge>
                <Badge tone="done">KCS</Badge>
                <Badge tone="done">Putaway</Badge>
                <Badge tone="done">Picking</Badge>
                <Badge tone="done">Đóng gói</Badge>
                <Badge tone="done">Xe nâng / Forklift</Badge>
                <Badge tone="info">SAP ERP</Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Tab Content 2: Công việc */}
        {activeTab === "work" && (
          <Card className="p-4 space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100 pb-1.5">Thông tin công tác</div>
            <div className="space-y-3">
              <InfoRow label="Kho phụ trách" value="HN01 · Kho Hà Nội" />
              <InfoRow label="Khu vực phân công" value="Khu G + Dock A" />
              <InfoRow label="Nhóm / Role" value="Thủ kho" />
              <InfoRow label="Ca làm việc" value="Ca sáng · 06:00 – 14:00" />
              <InfoRow label="Ngày vào làm" value="01/01/2020" />
              <InfoRow label="Quản lý trực tiếp" value="Nguyễn Văn An" />
            </div>
          </Card>
        )}

        {/* Tab Content 3: Hiệu suất */}
        {activeTab === "stats" && (
          <div className="space-y-3">
            <Card className="p-4">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-3 border-b border-slate-100 pb-1.5">Thống kê sản lượng</div>
              <div className="grid grid-cols-4 divide-x divide-slate-100 text-center">
                <div className="p-1">
                  <div className="text-[16px] font-extrabold text-brand">27</div>
                  <div className="text-[10px] text-slate-500">Hôm nay</div>
                </div>
                <div className="p-1">
                  <div className="text-[16px] font-extrabold text-brand">142</div>
                  <div className="text-[10px] text-slate-500">Tuần này</div>
                </div>
                <div className="p-1">
                  <div className="text-[16px] font-extrabold text-brand">98%</div>
                  <div className="text-[10px] text-slate-500">SLA</div>
                </div>
                <div className="p-1">
                  <div className="text-[16px] font-extrabold text-brand">5y</div>
                  <div className="text-[10px] text-slate-500">Thâm niên</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100 pb-1.5">Chỉ số KPI chất lượng</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-600">Task hoàn thành/tổng task</span>
                  <span className="text-[12px] font-bold text-emerald-600">8/10</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "80%" }} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[12px] text-slate-600">Số lần vi phạm SLA</span>
                  <span className="text-[12px] font-bold text-slate-900">2 lần</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[12px] text-slate-600">Đánh giá nội bộ</span>
                  <span className="text-[12px] font-bold text-brand">4.8/5.0 ★</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-slate-500">{label}</span>
      <span className="text-[13px] font-semibold text-slate-950">{value}</span>
    </div>
  );
}