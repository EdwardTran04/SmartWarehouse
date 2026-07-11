import { useState } from "react";
import { Clock, FileCheck2, PenLine, User, XCircle } from "lucide-react";
import { Btn, Card, Row } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   OUTBOUND SCREEN: X9. OutVOffice - Ký VOffice xuất
   Design giống inbound VOffice (N7) - có chọn mẫu chân ký từ dropdown
================================================================ */
type Signatory = {
  id: string;
  name: string;
  title: string;
  unit: string;
};

type SignatureTemplate = {
  id: string;
  name: string;
  signatories: Signatory[];
};

const SIGNATURE_TEMPLATES: SignatureTemplate[] = [
  {
    id: "MT1",
    name: "Mẫu 1 · 3 người ký",
    signatories: [
      { id: "NV-001", name: "Trần Văn Kho", title: "Thủ kho", unit: "Kho HN01" },
      { id: "NV-002", name: "Nguyễn Hữu An", title: "Nhân viên KCS", unit: "Kho HN01" },
      { id: "NV-003", name: "Mai Thị Lan", title: "Kế toán kho", unit: "Phòng TCKT" },
    ],
  },
  {
    id: "MT2",
    name: "Mẫu 2 · 4 người ký",
    signatories: [
      { id: "NV-001", name: "Trần Văn Kho", title: "Thủ kho", unit: "Kho HN01" },
      { id: "NV-002", name: "Nguyễn Hữu An", title: "NV kiểm hàng", unit: "Kho HN01" },
      { id: "NV-004", name: "Đỗ Minh Khôi", title: "NV kho", unit: "Kho HN01" },
      { id: "NV-005", name: "Phạm Thị Hằng", title: "Kế toán kho", unit: "Phòng TCKT" },
    ],
  },
  {
    id: "MT3",
    name: "Mẫu 3 · 2 người ký (nhanh)",
    signatories: [
      { id: "NV-001", name: "Trần Văn Kho", title: "Thủ kho", unit: "Kho HN01" },
      { id: "NV-003", name: "Mai Thị Lan", title: "Kế toán kho", unit: "Phòng TCKT" },
    ],
  },
];

export function ScreenOutVOffice({ back }: { back: () => void }) {
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMins, setExtendMins] = useState(30);
  const [extendReason, setExtendReason] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(SIGNATURE_TEMPLATES[0].id);

  const currentTemplate = SIGNATURE_TEMPLATES.find((t) => t.id === selectedTemplate) || SIGNATURE_TEMPLATES[0];

  const handleExtend = () => {
    setShowExtendModal(false);
  };

  const handleSign = () => {
    back();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <TopBar
        brand
        title="Ký VOffice xuất"
        sub="Phiếu xuất GX-2026/05/14-052"
        onBack={back}
        right={
          <button
            onClick={() => setShowExtendModal(true)}
            className="flex items-center gap-1 px-3 h-8 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium hover:bg-slate-200"
          >
            <Clock className="w-3.5 h-3.5" />
            Gia hạn KPI
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Card className="p-4">
          <div className="aspect-[3/4] rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <FileCheck2 className="w-10 h-10 mb-2" />
            <div className="text-[12px] font-semibold">Preview Phiếu xuất kho</div>
            <div className="text-[11px] mt-1">GX-2026/05/14-052 · 2 trang</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="h-10 rounded-lg border border-slate-200 text-[12.5px] font-semibold">Xem phiếu xuất</button>
            <button className="h-10 rounded-lg border border-slate-200 text-[12.5px] font-semibold">Xem BBBG</button>
          </div>
        </Card>

        <Card className="p-4 space-y-1.5 text-[13px]">
          <Row k="Số phiếu xuất" v="GX-2026/05/14-052" />
          <Row k="Người trình" v="Nguyễn Văn Kho" />
          <Row k="Trạng thái" v={<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold bg-orange-100 text-orange-700 border-orange-200">Chờ ký</span>} />
        </Card>

        {/* Mẫu chân ký - dropdown */}
        <Card className="p-4 space-y-3">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Mẫu chân ký</div>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-slate-200 text-[13px] bg-white"
          >
            {SIGNATURE_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Danh sách người ký */}
          <div className="space-y-2">
            {currentTemplate.signatories.map((s, i) => (
              <div key={s.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[13px] text-slate-900">{s.name} - {s.id}</div>
                  <div className="text-[11.5px] text-slate-600">{s.title} - {s.unit}</div>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">#{i + 1}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <Btn full icon={PenLine} onClick={handleSign}>
          Ký xác nhận VOffice
        </Btn>
      </div>

      {showExtendModal && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowExtendModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">Gia hạn KPI</div>
              <button onClick={() => setShowExtendModal(false)} className="text-slate-400"><XCircle className="w-5 h-5" /></button>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Thời gian gia hạn (phút)</div>
              <input type="number" min={5} step={5} value={extendMins} onChange={(e) => setExtendMins(+e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Lý do (bắt buộc)</div>
              <textarea value={extendReason} onChange={(e) => setExtendReason(e.target.value)} className="w-full h-20 p-2 rounded-lg border border-slate-300 text-sm" placeholder="Nhập lý do gia hạn..." />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Btn variant="outline" size="sm" full onClick={() => setShowExtendModal(false)}>Hủy</Btn>
              <Btn size="sm" full icon={Clock} onClick={handleExtend}>Gia hạn</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}