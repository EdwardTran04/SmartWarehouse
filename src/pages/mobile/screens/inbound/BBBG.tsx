import { useState, useRef } from "react";
import { Camera, CheckCircle2, ChevronDown, ChevronUp, FileText, Image, PenLine, Upload, XCircle } from "lucide-react";
import { Btn, Card } from "../../components/ui";
import { TopBar } from "../../components/layout";

/* =============================================================
   SCREEN: 7b. BBBG - Ký Biên bản bàn giao hàng hóa
   - Preview PDF
   - Chữ ký upload/chụp ảnh
============================================================ */
export function ScreenBBBG({ back, done }: { back: () => void; done: () => void }) {
  const [showPdfPreview, setShowPdfPreview] = useState(true);
  const [hasSigned, setHasSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSignatureOptions, setShowSignatureOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSignatureAction = (action: "upload" | "camera") => {
    setShowSignatureOptions(false);
    if (action === "upload") {
      fileInputRef.current?.click();
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isCamera: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setSignatureData(result);
        setHasSigned(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleConfirm = () => {
    setShowConfirm(true);
  };

  const confirmAndSubmit = () => {
    setShowConfirm(false);
    done();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <TopBar brand title="Ký Biên bản bàn giao" sub="BBBG-2026/05/18-021" onBack={back} />

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* PDF Preview Toggle */}
        <Card className="p-3">
          <button
            onClick={() => setShowPdfPreview(!showPdfPreview)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand" />
              <span className="text-[13px] font-semibold text-slate-700">Xem trước PDF BBBG</span>
            </div>
            {showPdfPreview ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showPdfPreview && (
            <div className="mt-3">
              <div className="bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 aspect-[3/4] flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-12 h-12 mb-2" />
                <span className="text-[13px] font-medium">BBBG-2026/05/18-021.pdf</span>
                <span className="text-[11px] mt-1">2 trang · 245 KB</span>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-white rounded-lg text-[11px] text-brand border border-brand font-medium">
                    Tải về
                  </button>
                  <button className="px-3 py-1.5 bg-white rounded-lg text-[11px] text-slate-600 border border-slate-300 font-medium">
                    In
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Signature Area */}
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
            Chữ ký người kiểm hàng
          </div>

          {!hasSigned ? (
            <div
              onClick={() => setShowSignatureOptions(true)}
              className="h-28 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer active:bg-slate-100 transition-colors"
            >
              <PenLine className="w-6 h-6 mb-2" />
              <span className="text-[13px]">Bấm để thêm chữ ký</span>
              <span className="text-[10px] mt-1">Upload ảnh hoặc chụp ảnh</span>
            </div>
          ) : (
            <div className="relative">
              <div className="h-28 rounded-xl border-2 border-emerald-300 bg-emerald-50 overflow-hidden flex items-center justify-center">
                <img src={signatureData!} alt="Signature" className="max-h-full max-w-full object-contain" />
              </div>
              <button
                onClick={() => {
                  setHasSigned(false);
                  setSignatureData(null);
                }}
                className="absolute top-2 right-2 px-2 py-1 text-[10px] text-slate-500 bg-white rounded border border-slate-200"
              >
                Xóa
              </button>
            </div>
          )}

          <div className="flex justify-between mt-3 text-[11px]">
            <button className="text-slate-500 flex items-center gap-1">
              <Image className="w-3.5 h-3.5" />
              Upload ảnh BB ký tay
            </button>
          </div>
        </Card>

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, false)}
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileChange(e, true)}
        />
      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-4">
        <Btn
          full
          icon={CheckCircle2}
          onClick={handleConfirm}
        >
          Hoàn thành
        </Btn>
      </div>

      {/* Signature Options Modal */}
      {showSignatureOptions && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowSignatureOptions(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">Thêm chữ ký</div>
              <button onClick={() => setShowSignatureOptions(false)} className="text-slate-400"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSignatureAction("upload")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-200 hover:border-brand hover:bg-brand/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-600" />
                </div>
                <span className="text-[13px] font-medium text-slate-700">Upload ảnh</span>
                <span className="text-[10px] text-slate-500">Chọn từ thư viện</span>
              </button>
              <button
                onClick={() => handleSignatureAction("camera")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-200 hover:border-brand hover:bg-brand/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-slate-600" />
                </div>
                <span className="text-[13px] font-medium text-slate-700">Chụp ảnh</span>
                <span className="text-[10px] text-slate-500">Sử dụng camera</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-40 bg-black/40 flex items-end" onClick={() => setShowConfirm(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5 pb-7 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
            <div className="text-[16px] font-bold text-slate-900">Xác nhận hoàn tất bàn giao</div>
            <div className="text-[13px] text-slate-600 space-y-1">
              <p>Bạn xác nhận đã kiểm tra hàng và hoàn tất việc bàn giao cho lô hàng <b>INB-2026-00118</b>.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Btn variant="outline" full onClick={() => setShowConfirm(false)}>
                Quay lại
              </Btn>
              <Btn full icon={CheckCircle2} onClick={confirmAndSubmit}>
                Xác nhận
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}