import { useState } from "react";
import {
  Truck, AlertTriangle, Camera, Clock, ChevronDown, ChevronRight,
  LogIn, LogOut, Warehouse, ShieldAlert, CheckCircle2, X
} from "lucide-react";
import {
  VehicleTrip, VehicleStatus, VEHICLE_STATUS_TONE, VEHICLE_EXCEPTION_LABEL,
  getDocksForWarehouse, VehicleException, VehiclePhotoStage
} from "@/data/vehicles";
import { toast } from "sonner";

function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${tone}`}>{children}</span>;
}

const STAGE_LABEL: Record<string, string> = { GATE_IN: "Vào cổng", DOCK_IN: "Vào dock", DOCK_OUT: "Ra dock", GATE_OUT: "Ra cổng" };

/* ─────────────── Modal helpers (inline) ─────────────── */
function GateModal({
  open, onClose, title, onConfirm, children, confirmLabel = "Xác nhận"
}: {
  open: boolean; onClose: () => void; title: string; onConfirm: () => void;
  children: React.ReactNode; confirmLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-navy">{title}</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="px-5 py-3 bg-muted/30 rounded-b-xl flex justify-end gap-2">
          <button onClick={onClose} className="inline-flex items-center gap-1.5 rounded-md font-medium transition-colors h-8 px-3 text-sm border border-border bg-card hover:bg-muted text-foreground">Hủy</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="inline-flex items-center gap-1.5 rounded-md font-medium transition-colors h-8 px-3 text-sm bg-brand text-brand-foreground hover:bg-brand-dark shadow-sm">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Photo capture helper ─────────────── */
type CapturedPhoto = { key: "driver" | "cccd_front" | "cccd_back"; label: string; dataUrl: string };

function PhotoCaptureGroup({
  photos, setPhotos,
}: { photos: CapturedPhoto[]; setPhotos: (p: CapturedPhoto[]) => void }) {
  const slots: { key: CapturedPhoto["key"]; label: string }[] = [
    { key: "driver", label: "Ảnh lái xe" },
    { key: "cccd_front", label: "CCCD mặt trước" },
    { key: "cccd_back", label: "CCCD mặt sau" },
  ];
  const onFile = (key: CapturedPhoto["key"], label: string, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhotos([...photos.filter((p) => p.key !== key), { key, label, dataUrl }]);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label className="block text-[11px] font-medium text-navy mb-1.5 flex items-center gap-1.5">
        <Camera className="w-3.5 h-3.5 text-brand" /> Chụp ảnh lái xe & CCCD <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((s) => {
          const p = photos.find((x) => x.key === s.key);
          return (
            <label key={s.key} className={`relative flex flex-col items-center justify-center rounded border cursor-pointer overflow-hidden aspect-[4/3] text-[10px] ${p ? "border-success/40 bg-success/5" : "border-dashed border-border bg-muted/30 hover:bg-muted/50"}`}>
              {p ? (
                <>
                  <img src={p.dataUrl} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute top-1 right-1 bg-success text-success-foreground rounded-full p-0.5"><CheckCircle2 className="w-3 h-3" /></span>
                  <span className="absolute bottom-0 inset-x-0 bg-navy/70 text-white px-1 py-0.5 text-[10px] font-medium text-center">{s.label}</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="font-medium text-navy">{s.label}</span>
                  <span className="text-muted-foreground">Bấm để chụp</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => onFile(s.key, s.label, e.target.files?.[0])}
              />
            </label>
          );
        })}
      </div>
      <div className="text-[10px] text-muted-foreground mt-1">Bắt buộc chụp đủ 3 ảnh: lái xe, CCCD mặt trước, CCCD mặt sau.</div>
    </div>
  );
}

export function VehicleGatePanel({
  trip,
  trips,
  otherOrderIds = [],
  requireGateBefore,
  warehouseCode,
  interactive = false,
}: {
  trip?: VehicleTrip;
  trips?: VehicleTrip[];
  otherOrderIds?: string[];
  requireGateBefore?: "unload" | "load" | "both";
  warehouseCode?: string;
  interactive?: boolean;
}) {
  const [tripList, setTripList] = useState<VehicleTrip[]>(
    trips && trips.length ? trips : trip ? [trip] : []
  );
  const [expanded, setExpanded] = useState<string | null>(tripList[0]?.id ?? null);

  /* Modal state */
  const [modal, setModal] = useState<
    { type: "gateIn" | "dockIn" | "dockOut" | "gateOut" | "exception"; tripId: string } | null
  >(null);
  const [dockSel, setDockSel] = useState("");
  const [excType, setExcType] = useState<VehicleException>("WRONG_PLATE");
  const [excNote, setExcNote] = useState("");
  const [plateActual, setPlateActual] = useState("");
  const [idPhotos, setIdPhotos] = useState<CapturedPhoto[]>([]);

  const docks = getDocksForWarehouse(warehouseCode);
  const currentTrip = tripList.find((t) => t.id === modal?.tripId);

  const updateTrip = (id: string, patch: Partial<VehicleTrip>) => {
    setTripList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  };

  if (tripList.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        <Truck className="w-8 h-8 mx-auto mb-2 opacity-40" />
        Lệnh này chưa gắn chuyến xe (VehicleTrip). Khi đối tác vận chuyển nhận lệnh, hệ thống sẽ tự tạo chuyến và bảo vệ xác nhận xe vào/ra tại app riêng.
      </div>
    );
  }

  const blocked = requireGateBefore && !tripList.some((t) => ["Đã vào dock", "Đang xử lý", "Đã ra cổng"].includes(t.status));

  const canGateIn = (s: VehicleStatus) => ["Chưa đến", "Đã đến", "Quá ETA"].includes(s);
  const canDockIn = (s: VehicleStatus) => ["Đã vào cổng", "Quá ETA", "Đổi xe"].includes(s);
  const canDockOut = (s: VehicleStatus) => ["Đã vào dock", "Đang xử lý"].includes(s);
  // Bảo vệ chỉ thao tác Vào cổng / Ra cổng → Ra cổng cho phép ngay sau khi xe đã vào cổng
  const canGateOut = (s: VehicleStatus) => ["Đã vào cổng", "Đã vào dock", "Đã ra dock", "Đang xử lý", "Quá ETA", "Đổi xe"].includes(s);

  /* Handlers */
  const buildIdPhotos = (stage: VehiclePhotoStage) => {
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    return idPhotos.map((p) => ({
      stage,
      type: (p.key === "driver" ? "other" : "other") as "vehicle" | "plate" | "other",
      url: p.dataUrl,
      takenAt: now,
      by: "Bảo vệ ca trực",
      note: p.label,
    }));
  };

  const doGateIn = () => {
    if (!currentTrip) return;
    if (idPhotos.length < 3) { toast.error("Vui lòng chụp đủ ảnh lái xe & CCCD 2 mặt"); return; }
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    updateTrip(currentTrip.id, {
      status: "Đã vào cổng",
      gateInAt: now,
      plateActual: plateActual || currentTrip.plateActual || currentTrip.plateExpected,
      photos: [...currentTrip.photos, ...buildIdPhotos("GATE_IN")],
    });
    toast.success(`Chuyến ${currentTrip.tripCode} – đã xác nhận vào cổng`);
    setPlateActual("");
    setIdPhotos([]);
  };

  const doDockIn = () => {
    if (!currentTrip) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    updateTrip(currentTrip.id, {
      status: "Đã vào dock",
      dockInAt: now,
      dockCode: dockSel || currentTrip.dockCode,
    });
    toast.success(`Chuyến ${currentTrip.tripCode} – đã xác nhận vào dock ${dockSel || currentTrip.dockCode || ""}`);
    setDockSel("");
  };

  const doDockOut = () => {
    if (!currentTrip) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    updateTrip(currentTrip.id, { status: "Đang xử lý", dockOutAt: now });
    toast.success(`Chuyến ${currentTrip.tripCode} – đã xác nhận ra dock`);
  };

  const doGateOut = () => {
    if (!currentTrip) return;
    if (idPhotos.length < 3) { toast.error("Vui lòng chụp đủ ảnh lái xe & CCCD 2 mặt"); return; }
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    updateTrip(currentTrip.id, {
      status: "Đã ra cổng",
      gateOutAt: now,
      photos: [...currentTrip.photos, ...buildIdPhotos("GATE_OUT")],
    });
    toast.success(`Chuyến ${currentTrip.tripCode} – đã xác nhận ra cổng`);
    setIdPhotos([]);
  };

  const doException = () => {
    if (!currentTrip) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const newExc = {
      id: `VEX-${Date.now()}`,
      type: excType,
      note: excNote || VEHICLE_EXCEPTION_LABEL[excType],
      at: now,
      by: "Bảo vệ ca trực",
    };
    updateTrip(currentTrip.id, {
      exceptions: [...currentTrip.exceptions, newExc],
      status: excType === "CANCEL" ? "Hủy chuyến" : excType === "NO_SHOW" ? "Chưa đến" : currentTrip.status,
    });
    toast.warning(`Đã ghi nhận phát sinh: ${VEHICLE_EXCEPTION_LABEL[excType]}`);
    setExcNote("");
  };

  return (
    <div className="space-y-4">
      {blocked && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30 text-warning text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <b>Bắt buộc có ít nhất 1 xe vào dock</b> trước khi {requireGateBefore === "load" ? "tải hàng lên xe" : "dỡ hàng"}.
          </div>
        </div>
      )}

      {/* Bảng danh sách chuyến xe của lệnh */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="text-sm font-semibold text-navy flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand" /> Danh sách chuyến xe ({tripList.length})
          </div>
          <div className="text-[11px] text-muted-foreground">
            {interactive ? "Thao tác trực tiếp tại đây – Bảo vệ ca trực" : "Cập nhật từ app Bảo vệ cổng – không thao tác trực tiếp tại đây."}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/20 text-muted-foreground border-b border-border">
                <th className="px-2 py-2 text-left font-medium w-6"></th>
                <th className="px-2 py-2 text-left font-medium">Mã chuyến</th>
                <th className="px-2 py-2 text-left font-medium">Nhà vận chuyển</th>
                <th className="px-2 py-2 text-left font-medium">Biển số DK</th>
                <th className="px-2 py-2 text-left font-medium">Biển số TT</th>
                <th className="px-2 py-2 text-left font-medium">Tài xế / SĐT</th>
                <th className="px-2 py-2 text-left font-medium">ETA</th>
                <th className="px-2 py-2 text-left font-medium">Dock</th>
                <th className="px-2 py-2 text-left font-medium">Vào cổng</th>
                <th className="px-2 py-2 text-left font-medium">Vào dock</th>
                <th className="px-2 py-2 text-left font-medium">Ra dock</th>
                <th className="px-2 py-2 text-left font-medium">Ra cổng</th>
                <th className="px-2 py-2 text-left font-medium">Trạng thái</th>
                <th className="px-2 py-2 text-center font-medium">PS</th>
                {interactive && <th className="px-2 py-2 text-left font-medium">Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {tripList.map((t) => {
                const mismatch = t.plateActual && t.plateActual !== t.plateExpected;
                const isOpen = expanded === t.id;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setExpanded(isOpen ? null : t.id)}
                    className={`border-b border-border/60 cursor-pointer hover:bg-muted/30 ${isOpen ? "bg-brand/5" : ""}`}
                  >
                    <td className="px-2 py-2">{isOpen ? <ChevronDown className="w-3.5 h-3.5 text-brand" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}</td>
                    <td className="px-2 py-2 font-semibold text-navy">{t.tripCode}</td>
                    <td className="px-2 py-2">{t.carrier || "—"}</td>
                    <td className="px-2 py-2">{t.plateExpected}</td>
                    <td className={`px-2 py-2 ${mismatch ? "text-warning font-semibold" : ""}`}>{t.plateActual || "—"}</td>
                    <td className="px-2 py-2">
                      <div className="font-medium">{t.driver || "—"}</div>
                      <div className="text-[10px] text-muted-foreground">{t.driverPhone || "—"}</div>
                    </td>
                    <td className="px-2 py-2 text-muted-foreground">{t.etaAt}</td>
                    <td className="px-2 py-2">{t.dockCode || "—"}</td>
                    <td className="px-2 py-2">{t.gateInAt || "—"}</td>
                    <td className="px-2 py-2">{t.dockInAt || "—"}</td>
                    <td className="px-2 py-2">{t.dockOutAt || "—"}</td>
                    <td className="px-2 py-2">{t.gateOutAt || "—"}</td>
                    <td className="px-2 py-2"><Pill tone={VEHICLE_STATUS_TONE[t.status]}>{t.status}</Pill></td>
                    <td className="px-2 py-2 text-center">
                      {t.exceptions.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-destructive font-semibold">
                          <AlertTriangle className="w-3 h-3" />{t.exceptions.length}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    {interactive && (
                      <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {canGateIn(t.status) && (
                            <button
                              onClick={() => { setPlateActual(t.plateActual || ""); setModal({ type: "gateIn", tripId: t.id }); }}
                              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-info/10 text-info hover:bg-info/20 border border-info/20"
                              title="Vào cổng"
                            ><LogIn className="w-3 h-3" />Vào cổng</button>
                          )}
                          {canGateOut(t.status) && (
                            <button
                              onClick={() => setModal({ type: "gateOut", tripId: t.id })}
                              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                              title="Ra cổng"
                            ><LogOut className="w-3 h-3" />Ra cổng</button>
                          )}
                          <button
                            onClick={() => setModal({ type: "exception", tripId: t.id })}
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                            title="Phát sinh"
                          ><ShieldAlert className="w-3 h-3" />Phát sinh</button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chi tiết chuyến đang chọn */}
      {expanded && (() => {
        const t = tripList.find((x) => x.id === expanded);
        if (!t) return null;
        return (
          <div className="rounded-lg border border-border p-4 space-y-4">
            <div className="text-sm font-semibold text-navy flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand" /> Chi tiết chuyến {t.tripCode}
            </div>

            <div>
              <div className="text-xs font-semibold text-navy mb-2 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-brand" /> Mốc thời gian xe</div>
              <ol className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                {[
                  { label: "Vào cổng", at: t.gateInAt },
                  { label: "Vào dock", at: t.dockInAt },
                  { label: "Ra dock", at: t.dockOutAt },
                  { label: "Ra cổng", at: t.gateOutAt },
                ].map((m, i) => (
                  <li key={i} className={`rounded-md border p-2.5 ${m.at ? "border-success/30 bg-success/5" : "border-border bg-muted/30"}`}>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{m.label}</div>
                    <div className={`font-semibold mt-0.5 ${m.at ? "text-success" : "text-muted-foreground"}`}>{m.at || "—"}</div>
                  </li>
                ))}
              </ol>
            </div>

            {t.orderIds.length > 1 && (
              <div>
                <div className="text-xs font-semibold text-navy mb-2">Order cùng chuyến ({t.orderIds.length})</div>
                <div className="flex flex-wrap gap-1.5">
                  {t.orderIds.map((id) => (
                    <span key={id} className="px-2 py-0.5 rounded bg-muted text-[11px] font-medium text-navy">{id}</span>
                  ))}
                </div>
              </div>
            )}

            {t.exceptions.length > 0 && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                <div className="text-xs font-semibold text-destructive mb-1.5 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Phát sinh</div>
                <ul className="space-y-1 text-[11px]">
                  {t.exceptions.map((e) => (
                    <li key={e.id}><b>{VEHICLE_EXCEPTION_LABEL[e.type]}</b> · {e.at} · {e.by} — {e.note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="text-xs font-semibold text-navy mb-2 flex items-center gap-2"><Camera className="w-3.5 h-3.5 text-brand" /> Ảnh xe / biển số ({t.photos.length})</div>
              {t.photos.length === 0 ? (
                <div className="text-[11px] text-muted-foreground italic">Chưa có ảnh.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {t.photos.map((p, i) => (
                    <div key={i} className="rounded border border-border bg-card overflow-hidden">
                      <div className="aspect-video bg-muted"><img src={p.url} alt={p.type} className="w-full h-full object-cover" /></div>
                      <div className="px-1.5 py-1 border-t border-border">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="uppercase font-semibold">{STAGE_LABEL[p.stage] || p.stage}</span>
                          <span>{p.takenAt.slice(-5)}</span>
                        </div>
                        {p.note && <div className="text-[11px] text-navy mt-0.5 truncate" title={p.note}>{p.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ───── Modals ───── */}
      <GateModal open={modal?.type === "gateIn"} onClose={() => setModal(null)} title="Xác nhận xe vào cổng" onConfirm={doGateIn}>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-[11px] text-muted-foreground">Mã chuyến</div><div className="font-semibold text-navy">{currentTrip?.tripCode}</div></div>
            <div><div className="text-[11px] text-muted-foreground">Biển số dự kiến</div><div className="font-semibold text-navy">{currentTrip?.plateExpected}</div></div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-navy mb-1">Biển số thực tế <span className="text-destructive">*</span></label>
            <input
              className="h-9 w-full px-3 rounded border border-input bg-background text-sm"
              value={plateActual}
              onChange={(e) => setPlateActual(e.target.value)}
              placeholder="Nhập biển số xe thực tế"
            />
          </div>
          <PhotoCaptureGroup photos={idPhotos} setPhotos={setIdPhotos} />
          <div className="text-[11px] text-muted-foreground">Thời gian vào cổng sẽ tự động ghi nhận theo thời điểm xác nhận.</div>
        </div>
      </GateModal>

      <GateModal open={modal?.type === "dockIn"} onClose={() => setModal(null)} title="Xác nhận xe vào dock" onConfirm={doDockIn}>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-[11px] text-muted-foreground">Mã chuyến</div><div className="font-semibold text-navy">{currentTrip?.tripCode}</div></div>
            <div><div className="text-[11px] text-muted-foreground">Biển số</div><div className="font-semibold text-navy">{currentTrip?.plateActual || currentTrip?.plateExpected}</div></div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-navy mb-1">Chọn dock <span className="text-destructive">*</span></label>
            <select
              className="h-9 w-full px-3 rounded border border-input bg-background text-sm"
              value={dockSel}
              onChange={(e) => setDockSel(e.target.value)}
            >
              <option value="">-- Chọn dock --</option>
              {docks.map((d) => (
                <option key={d.code} value={d.code} disabled={d.status === "Bảo trì"}>{d.code} – {d.name} ({d.zone}) {d.status === "Bảo trì" ? "[Bảo trì]" : ""}</option>
              ))}
            </select>
          </div>
          <div className="text-[11px] text-muted-foreground">Thời gian vào dock sẽ tự động ghi nhận theo thời điểm xác nhận.</div>
        </div>
      </GateModal>

      <GateModal open={modal?.type === "dockOut"} onClose={() => setModal(null)} title="Xác nhận xe ra dock" onConfirm={doDockOut}>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-[11px] text-muted-foreground">Mã chuyến</div><div className="font-semibold text-navy">{currentTrip?.tripCode}</div></div>
            <div><div className="text-[11px] text-muted-foreground">Dock</div><div className="font-semibold text-navy">{currentTrip?.dockCode || "—"}</div></div>
          </div>
          <div className="text-[11px] text-muted-foreground">Thời gian ra dock sẽ tự động ghi nhận theo thời điểm xác nhận.</div>
        </div>
      </GateModal>

      <GateModal open={modal?.type === "gateOut"} onClose={() => setModal(null)} title="Xác nhận xe ra cổng" onConfirm={doGateOut}>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-[11px] text-muted-foreground">Mã chuyến</div><div className="font-semibold text-navy">{currentTrip?.tripCode}</div></div>
            <div><div className="text-[11px] text-muted-foreground">Biển số</div><div className="font-semibold text-navy">{currentTrip?.plateActual || currentTrip?.plateExpected}</div></div>
          </div>
          <PhotoCaptureGroup photos={idPhotos} setPhotos={setIdPhotos} />
          <div className="text-[11px] text-muted-foreground">Thời gian ra cổng sẽ tự động ghi nhận theo thời điểm xác nhận.</div>
        </div>
      </GateModal>

      <GateModal open={modal?.type === "exception"} onClose={() => setModal(null)} title="Ghi nhận phát sinh chuyến xe" onConfirm={doException} confirmLabel="Ghi nhận">
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-[11px] text-muted-foreground">Mã chuyến</div><div className="font-semibold text-navy">{currentTrip?.tripCode}</div></div>
            <div><div className="text-[11px] text-muted-foreground">Biển số</div><div className="font-semibold text-navy">{currentTrip?.plateActual || currentTrip?.plateExpected}</div></div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-navy mb-1">Loại phát sinh <span className="text-destructive">*</span></label>
            <select
              className="h-9 w-full px-3 rounded border border-input bg-background text-sm"
              value={excType}
              onChange={(e) => setExcType(e.target.value as VehicleException)}
            >
              {Object.entries(VEHICLE_EXCEPTION_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-navy mb-1">Mô tả / Ghi chú</label>
            <textarea
              className="w-full px-3 py-2 rounded border border-input bg-background text-sm min-h-[64px]"
              value={excNote}
              onChange={(e) => setExcNote(e.target.value)}
              placeholder="Nhập mô tả chi tiết..."
            />
          </div>
        </div>
      </GateModal>
    </div>
  );
}
