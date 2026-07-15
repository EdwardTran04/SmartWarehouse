import { useState } from "react";
import { Calendar, Clock, CheckCircle2, AlertTriangle, Plus, FileText, History } from "lucide-react";
import { Badge, Btn, Card, Input } from "../../components/ui";
import { TopBar } from "../../components/layout";

type Registration = {
  id: string;
  type: "nghi" | "tang_ca";
  date: string;
  details: string;
  reason: string;
  status: "cho_duyet" | "da_duyet" | "tu_choi";
};

const INITIAL_REGISTRATIONS: Registration[] = [
  { id: "REG-001", type: "nghi", date: "16/07/2026", details: "Nghỉ ca chiều (14:00 - 22:00)", reason: "Giải quyết việc cá nhân ở quê", status: "cho_duyet" },
  { id: "REG-002", type: "tang_ca", date: "12/07/2026", details: "Tăng ca (17:30 - 20:30) · 3 giờ", reason: "Hỗ trợ kiểm kê hàng PO lớn cuối ngày", status: "da_duyet" },
  { id: "REG-003", type: "nghi", date: "05/07/2026", details: "Nghỉ ca sáng (06:00 - 14:00)", reason: "Đi khám sức khỏe định kỳ", status: "da_duyet" },
];

export function ScreenScheduleRegister({ back }: { back: () => void }) {
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [regType, setRegType] = useState<"nghi" | "tang_ca">("nghi");
  
  // Leave form states
  const [leaveDate, setLeaveDate] = useState("2026-07-16");
  const [leaveShift, setLeaveShift] = useState<"sang" | "chieu" | "ca_ngay">("sang");
  const [leaveReason, setLeaveReason] = useState("");

  // Overtime form states
  const [otDate, setOtDate] = useState("2026-07-16");
  const [otStart, setOtStart] = useState("17:30");
  const [otEnd, setOtEnd] = useState("20:30");
  const [otReason, setOtReason] = useState("");

  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let details = "";
    let dateStr = "";
    let reason = "";

    if (regType === "nghi") {
      const shiftLabel = leaveShift === "sang" ? "Ca sáng (06:00 - 14:00)" : leaveShift === "chieu" ? "Ca chiều (14:00 - 22:00)" : "Cả ngày";
      details = `Nghỉ ${shiftLabel}`;
      const d = new Date(leaveDate);
      dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      reason = leaveReason || "Không có lý do cụ thể";
      setLeaveReason("");
    } else {
      // Calculate OT hours
      const [sh, sm] = otStart.split(":").map(Number);
      const [eh, em] = otEnd.split(":").map(Number);
      const hours = (eh * 60 + em - (sh * 60 + sm)) / 60;
      details = `Tăng ca (${otStart} - ${otEnd}) · ${hours.toFixed(1)} giờ`;
      const d = new Date(otDate);
      dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      reason = otReason || "Hỗ trợ công việc phát sinh";
      setOtReason("");
    }

    const newReg: Registration = {
      id: `REG-${Math.floor(100 + Math.random() * 900)}`,
      type: regType,
      date: dateStr,
      details,
      reason,
      status: "cho_duyet",
    };

    setRegistrations([newReg, ...registrations]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar brand title="Đăng ký lịch" sub="Trần Minh Quân · NV-2024-0088" onBack={back} />

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Statistics section */}
        <Card className="p-3 bg-white">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Thống kê phép & ngày nghỉ</div>
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div className="p-1">
              <div className="text-[18px] font-extrabold text-slate-800">6 ngày</div>
              <div className="text-[10px] text-slate-500">Đã nghỉ (YTD)</div>
            </div>
            <div className="p-1">
              <div className="text-[18px] font-extrabold text-brand">12 ngày</div>
              <div className="text-[10px] text-slate-500">Số phép còn lại</div>
            </div>
            <div className="p-1">
              <div className="text-[18px] font-extrabold text-indigo-600">18.5h</div>
              <div className="text-[10px] text-slate-500">Tăng ca (Tháng)</div>
            </div>
          </div>
        </Card>

        {/* Tab Toggle */}
        <div className="flex border border-slate-200 bg-white rounded-xl p-1 gap-1 shadow-sm">
          <button
            onClick={() => setRegType("nghi")}
            className={`flex-1 py-2 text-center text-[12px] font-bold rounded-lg transition-all ${
              regType === "nghi" ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Đăng ký nghỉ
          </button>
          <button
            onClick={() => setRegType("tang_ca")}
            className={`flex-1 py-2 text-center text-[12px] font-bold rounded-lg transition-all ${
              regType === "tang_ca" ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Đăng ký tăng ca (OT)
          </button>
        </div>

        {/* Registration Form */}
        <Card className="p-4 bg-white">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {regType === "nghi" ? (
              <>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Ngày đăng ký nghỉ</div>
                  <input
                    type="date"
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                    required
                  />
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Chọn ca nghỉ</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "sang", label: "Ca sáng", desc: "06:00 - 14:00" },
                      { id: "chieu", label: "Ca chiều", desc: "14:00 - 22:00" },
                      { id: "ca_ngay", label: "Cả ngày", desc: "Nghỉ nguyên ngày" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setLeaveShift(s.id as any)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                          leaveShift === s.id
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-[12px] font-bold">{s.label}</span>
                        <span className="text-[9px] opacity-80 mt-1">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Lý do nghỉ (bắt buộc)</div>
                  <textarea
                    rows={2}
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                    placeholder="Nhập lý do xin nghỉ phép..."
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Ngày tăng ca</div>
                  <input
                    type="date"
                    value={otDate}
                    onChange={(e) => setOtDate(e.target.value)}
                    className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Thời gian bắt đầu</div>
                    <input
                      type="time"
                      value={otStart}
                      min="17:30"
                      onChange={(e) => setOtStart(e.target.value)}
                      className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                      required
                    />
                    <span className="text-[9px] text-orange-600 mt-1 block font-medium">⚠️ Phải từ sau 17:30</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Thời gian kết thúc</div>
                    <input
                      type="time"
                      value={otEnd}
                      onChange={(e) => setOtEnd(e.target.value)}
                      className="h-10 w-full px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nội dung công việc tăng ca</div>
                  <textarea
                    rows={2}
                    value={otReason}
                    onChange={(e) => setOtReason(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                    placeholder="Nhập nội dung công việc cần OT..."
                    required
                  />
                </div>
              </>
            )}

            <Btn full size="sm" icon={Plus} type="submit">
              Gửi yêu cầu đăng ký
            </Btn>
          </form>
        </Card>

        {/* History Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider px-1">
            <History className="w-4 h-4" /> Lịch sử gửi yêu cầu
          </div>

          <div className="space-y-2">
            {registrations.map((r) => (
              <Card key={r.id} className="p-3 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[13.5px] text-slate-800">{r.date}</span>
                      <span className="text-[11.5px] text-slate-500">· {r.type === "nghi" ? "Nghỉ phép" : "Tăng ca"}</span>
                    </div>
                    <div className="text-[12.5px] font-medium text-slate-900 mt-1">{r.details}</div>
                    <div className="text-[11.5px] text-slate-500 mt-0.5">Lý do: {r.reason}</div>
                  </div>
                  <Badge tone={r.status === "cho_duyet" ? "warn" : r.status === "da_duyet" ? "done" : "err"}>
                    {r.status === "cho_duyet" ? "Chờ duyệt" : r.status === "da_duyet" ? "Đã duyệt" : "Từ chối"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[12px] font-semibold flex items-center gap-2 shadow-lg z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã gửi yêu cầu đăng ký thành công!
        </div>
      )}
    </div>
  );
}
