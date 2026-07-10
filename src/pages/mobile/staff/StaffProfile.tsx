import { Badge, Card } from "../components/ui";
import { TopBar } from "../components/layout";

/* =============================================================
   SYSTEM SCREEN: Staff Profile - Trần Mình Quân
============================================================ */
export function ScreenStaffProfile({ back }: { back?: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar brand title="Hồ sơ nhân viên" onBack={back} />
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
        {/* Profile Header */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[20px]">TMQ</div>
            <div className="flex-1">
              <div className="font-bold text-[17px] text-slate-900">Trần Mình Quân</div>
              <div className="text-[12px] text-slate-500 mt-0.5">nv.kho.hn01 · Thủ kho HN01</div>
              <Badge tone="done" className="mt-1">Đang làm việc</Badge>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-4">
          <div className="grid grid-cols-4 divide-x divide-slate-100 text-center">
            <div className="p-2">
              <div className="text-[18px] font-extrabold text-brand">27</div>
              <div className="text-[10px] text-slate-500">Hôm nay</div>
            </div>
            <div className="p-2">
              <div className="text-[18px] font-extrabold text-brand">142</div>
              <div className="text-[10px] text-slate-500">Tuần này</div>
            </div>
            <div className="p-2">
              <div className="text-[18px] font-extrabold text-brand">98%</div>
              <div className="text-[10px] text-slate-500">SLA</div>
            </div>
            <div className="p-2">
              <div className="text-[18px] font-extrabold text-brand">5y</div>
              <div className="text-[10px] text-slate-500">Kinh nghiệm</div>
            </div>
          </div>
        </Card>

        {/* Personal Info */}
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-3">Thông tin cá nhân</div>
          <div className="space-y-3">
            <InfoRow label="Mã nhân viên" value="NV-2024-0088" />
            <InfoRow label="Họ và tên" value="Trần Mình Quân" />
            <InfoRow label="Ngày sinh" value="15/03/1988" />
            <InfoRow label="Số điện thoại" value="0987 654 321" />
            <InfoRow label="Email" value="tranminhquan@viettel.com" />
            <InfoRow label="CCCD" value="012 345 678 901" />
          </div>
        </Card>

        {/* Work Info */}
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-3">Thông tin công việc</div>
          <div className="space-y-3">
            <InfoRow label="Kho phụ trách" value="HN01 · Kho Hà Nội" />
            <InfoRow label="Khu vực" value="Khu G + Dock A" />
            <InfoRow label="Nhóm / Role" value="Thủ kho" />
            <InfoRow label="Ca làm việc" value="Ca sáng · 06:00 – 14:00" />
            <InfoRow label="Ngày vào làm" value="01/01/2020" />
            <InfoRow label="Quản lý trực tiếp" value="Nguyễn Văn An" />
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-3">Kỹ năng / Chứng chỉ</div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="done">Voffice</Badge>
            <Badge tone="done">BBBG</Badge>
            <Badge tone="done">KCS</Badge>
            <Badge tone="done">Putaway</Badge>
            <Badge tone="done">Picking</Badge>
            <Badge tone="done">Đóng gói</Badge>
            <Badge tone="done">Forklift</Badge>
            <Badge tone="default">SAP</Badge>
          </div>
        </Card>

        {/* Performance */}
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-3">Đánh giá hiệu suất</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-600">Task hoàn thành đúng hạn</span>
              <span className="text-[12px] font-bold text-emerald-600">98%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "98%" }} />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[12px] text-slate-600">Số lần vi phạm SLA</span>
              <span className="text-[12px] font-bold text-slate-900">2 lần</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[12px] text-slate-600">Đánh giá đồng nghiệp</span>
              <span className="text-[12px] font-bold text-brand">4.8/5.0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-slate-500">{label}</span>
      <span className="text-[13px] font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default ScreenStaffProfile;