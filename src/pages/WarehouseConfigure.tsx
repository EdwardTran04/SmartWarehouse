import AppShell from "@/components/AppShell";
import { Btn, PageTitle, StatusBadge, Modal, Field, Input, Select } from "@/components/ui-bits";
import {
  warehouses, zones, racks, rackFloors, pallets, woodboxes, oversized, roads, pccc,
} from "@/data/mock";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  Plus, Eye, Pencil, Trash2, Sparkles, AlertTriangle, FlameKindling, Layers,
  Package, Boxes, Truck, Map, Forklift, ShieldAlert, CheckCircle2, Info, ListChecks, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const TABS = [
  { key: "info", label: "Thông tin kho", icon: Info },
  { key: "zone", label: "Phân khu", icon: Map },
  { key: "rack", label: "Giá kệ", icon: Layers },
  { key: "floor", label: "Tầng rack", icon: Layers },
  { key: "pallet", label: "Pallet", icon: Package },
  { key: "wood", label: "Thùng gỗ", icon: Boxes },
  { key: "over", label: "Hàng quá khổ", icon: Forklift },
  { key: "road", label: "Đường giao thông", icon: Truck },
  { key: "pccc", label: "PCCC", icon: FlameKindling },
  { key: "preview", label: "Xem trước vị trí", icon: Eye },
  { key: "check", label: "Kết quả kiểm tra rule", icon: ListChecks },
];

export default function WarehouseConfigure() {
  const { code = "HN01" } = useParams();
  const wh = warehouses.find((w) => w.code === code) || warehouses[0];
  const [tab, setTab] = useState("info");
  const [showModal, setShowModal] = useState(false);
  const [showGen, setShowGen] = useState(false);

  return (
    <AppShell breadcrumb={[
      { label: "Quản lý kho" },
      { label: "Danh sách kho", to: "/warehouses" },
      { label: `${wh.code} - ${wh.name}` },
    ]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-navy">{wh.code} — {wh.name}</h1>
            <StatusBadge status={wh.configured ? "Đã cấu hình" : "Chưa cấu hình"} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{wh.address} · {wh.type} · {wh.locations} vị trí lưu trữ</p>
        </div>
        <div className="flex gap-2">
          <Link to="/warehouses"><Btn variant="outline">← Quay lại</Btn></Link>
          <Btn icon={Sparkles} onClick={() => setShowGen(true)}>Sinh vị trí lưu trữ</Btn>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 mb-4 text-xs flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-primary">Cấu trúc cấu hình:</span>
        <span className="font-mono px-2 py-0.5 bg-card rounded border border-border">Kho {wh.code}</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono px-2 py-0.5 bg-card rounded border border-border">Phân khu</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono px-2 py-0.5 bg-card rounded border border-border">Hạ tầng lưu trữ</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono px-2 py-0.5 bg-card rounded border border-border">Location (auto-gen)</span>
      </div>

      <DetailedLayout />


      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex border-b border-border overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key ? "border-primary text-primary font-semibold bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab !== "info" && tab !== "preview" && tab !== "check" && (
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-navy">{TABS.find(t => t.key === tab)?.label}</h3>
              <div className="flex gap-2">
                {tab === "rack" && <Btn variant="outline" icon={Eye} onClick={() => setTab("preview")}>Xem trước vị trí</Btn>}
                <Btn icon={Plus} onClick={() => setShowModal(true)}>Thêm mới</Btn>
              </div>
            </div>
          )}

          {tab === "info" && <InfoTab wh={wh} />}

          {tab === "zone" && (
            <>
              <div className="mb-4 p-3 rounded-lg border border-warning/30 bg-warning/10 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div className="text-sm"><b className="text-warning">Cảnh báo:</b> Khu C - Đóng gói chưa được cấu hình. Tổng diện tích phân khu: 3,000 / {wh.area} m².</div>
              </div>
              <Table cols={["Mã", "Tên phân khu", "Loại", "Bắt buộc", "Diện tích (m²)", "Vận hành", "Lối đi (mm)", "Trạng thái", ""]}
                rows={zones.map(z => [z.code, z.name, z.type,
                  z.required ? <span className="text-xs text-success font-medium">Bắt buộc</span> : <span className="text-xs text-muted-foreground">Tùy chọn</span>,
                  z.area, z.method, z.aisle, <StatusBadge status={z.status} />, <RowActions />])} />
            </>
          )}
          {tab === "rack" && (
            <>
              <div className="mb-4 p-3 rounded-lg border border-info/30 bg-info/10 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-info mt-0.5" />
                <div className="text-sm">Cấu trúc location sinh từ rack: <code className="font-mono bg-card px-1.5 rounded">[Rack]-T[Tầng]-K[Khoang]</code> · VD: G01-T01-K01</div>
              </div>
              <Table cols={["Mã dãy", "Loại", "Phân khu", "Tầng", "Khoang/tầng", "Kích thước", "Tải trọng", "Lối đi", "Vị trí", ""]}
                rows={racks.map(r => [r.code, r.type, r.zone, r.floors, r.bays, r.dim, `${r.load}kg`, `${r.aisle}mm`, r.slots, <RowActions />])} />
            </>
          )}
          {tab === "floor" && <Table cols={["Mã tầng", "Rack cha", "Thứ tự", "Cao (mm)", "Tải trọng (kg)", "Số khoang", "Trạng thái", ""]}
            rows={rackFloors.map(f => [f.code, f.parent, f.order, f.height, f.load, f.bays, <StatusBadge status={f.status} />, <RowActions />])} />}
          {tab === "pallet" && (
            <>
              <div className="mb-4 p-3 rounded-lg border border-info/30 bg-info/10 text-sm">
                Cấu trúc location pallet: <code className="font-mono bg-card px-1.5 rounded">[Khu]-R[Dãy]-T[Tầng]-P[Pallet]</code> · VD: J01-R01-T01-P01
              </div>
              <Table cols={["Mã khu", "Loại pallet", "Kích thước", "Stack", "Tải trọng", "Hàng×Cột", "Tổng vị trí", "Trạng thái", ""]}
                rows={pallets.map(p => [p.code, p.type, p.dim, `${p.stack} tầng`, `${p.load}kg`, `${p.rows}×${p.cols}`, p.slots, <StatusBadge status={p.status} />, <RowActions />])} />
            </>
          )}
          {tab === "wood" && (
            <>
              <div className="mb-4 p-3 rounded-lg border border-info/30 bg-info/10 text-sm">
                Cấu trúc location thùng gỗ: <code className="font-mono bg-card px-1.5 rounded">[Khu]-R[Dãy]-T[Tầng]-B[Thùng]</code> · VD: K01-R01-T01-B01
              </div>
              <Table cols={["Mã khu", "Loại", "Kích thước", "Stack", "Tải trọng", "Vị trí", "Trạng thái", ""]}
                rows={woodboxes.map(w => [w.code, w.type, w.dim, `${w.stack} tầng`, `${w.load}kg`, w.slots, <StatusBadge status={w.status} />, <RowActions />])} />
            </>
          )}
          {tab === "over" && <Table cols={["Mã khu", "Loại hàng", "KT tối đa", "Khoảng cách an toàn", "Thiết bị", "Số slot", "Trạng thái", ""]}
            rows={oversized.map(o => [o.code, o.type, o.maxDim, `${o.safety}mm`, o.equip, o.slots, <StatusBadge status={o.status} />, <RowActions />])} />}
          {tab === "road" && (
            <Table cols={["Mã tuyến", "Loại", "Chiều rộng", "Xe nâng", "Hướng di chuyển", "Trạng thái", ""]}
              rows={roads.map(r => [r.code, r.type,
                <span className={r.forklift && r.width < 2300 ? "text-destructive font-semibold" : ""}>{r.width}mm</span>,
                r.forklift ? "Có" : "Không",
                <span className="inline-flex items-center gap-1 font-mono text-xs">{r.direction.split("→").map((s, i, a) => <span key={i}>{s.trim()}{i < a.length - 1 && <ArrowRight className="w-3 h-3 inline mx-1 text-primary" />}</span>)}</span>,
                <StatusBadge status={r.forklift && r.width < 2300 ? "Không đạt" : "Đạt"} />, <RowActions />])} />
          )}
          {tab === "pccc" && (
            <>
              <div className="mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/10 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div className="text-sm"><b className="text-destructive">Yêu cầu:</b> Đường vành đai PCCC ≥ 700mm, phải liên tục, không bị che chắn.</div>
              </div>
              <Table cols={["Mã tuyến PCCC", "Chiều rộng", "Liên tục", "Bị che chắn", "Trạng thái", "Ghi chú", ""]}
                rows={pccc.map(p => [
                  <span className="inline-flex items-center gap-2 font-medium"><FlameKindling className={`w-4 h-4 ${p.status === "Đạt" ? "text-success" : "text-destructive"}`} />{p.code}</span>,
                  <span className={p.width < 700 ? "text-destructive font-semibold" : ""}>{p.width}mm</span>,
                  p.continuous ? <CheckCircle2 className="w-4 h-4 text-success" /> : <span className="text-destructive font-medium">Không</span>,
                  p.blocked ? <span className="text-destructive font-medium">Có</span> : <CheckCircle2 className="w-4 h-4 text-success" />,
                  <StatusBadge status={p.status} />,
                  p.note || "—",
                  <RowActions />,
                ])} />
            </>
          )}
          {tab === "preview" && <PreviewTab onGen={() => setShowGen(true)} />}
          {tab === "check" && <RuleCheckTab />}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={modalTitle(tab)} wide
        footer={<>
          <Btn variant="ghost" onClick={() => setShowModal(false)}>Hủy</Btn>
          <Btn onClick={() => { setShowModal(false); toast.success("Đã lưu cấu hình"); }}>Lưu cấu hình</Btn>
        </>}>
        {tab === "zone" ? <ZoneForm wh={wh} /> : <InfraForm tab={tab} />}
      </Modal>

      <Modal open={showGen} onClose={() => setShowGen(false)} title="Sinh vị trí lưu trữ"
        footer={<>
          <Btn variant="ghost" onClick={() => setShowGen(false)}>Hủy</Btn>
          <Btn variant="success" icon={CheckCircle2} onClick={() => { setShowGen(false); toast.success("Đã sinh 240 vị trí lưu trữ thành công"); }}>Xác nhận sinh</Btn>
        </>}>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-info/10 border border-info/20 flex gap-2">
            <ShieldAlert className="w-5 h-5 text-info shrink-0" />
            <div>Hệ thống sẽ sinh tự động vị trí dựa trên cấu hình hiện tại. Hành động này không thể hoàn tác.</div>
          </div>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>3 dãy giá kệ → 200 vị trí Rack</li>
            <li>2 khu pallet → 100 vị trí Pallet</li>
            <li>2 khu thùng gỗ → 75 vị trí Woodbox</li>
            <li>1 khu hàng quá khổ → 5 slot</li>
          </ul>
        </div>
      </Modal>
    </AppShell>
  );
}

function Table({ cols, rows }: { cols: string[]; rows: any[][] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="data-table">
        <thead><tr>{cols.map((c, i) => <th key={i} className={i === cols.length - 1 ? "text-right" : ""}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={j === cols.length - 1 ? "text-right" : ""}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowActions() {
  return (
    <div className="inline-flex gap-1">
      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-info"><Eye className="w-4 h-4" /></button>
      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}

function InfoTab({ wh }: { wh: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Thông tin từ SAP (chỉ đọc)</div>
        <div className="space-y-3 text-sm bg-muted/30 rounded-lg p-4 border border-border">
          {[
            ["Mã kho", wh.code], ["Tên kho", wh.name], ["Loại kho", wh.type],
            ["Khu vực / Chi nhánh", wh.branch], ["Địa chỉ", wh.address],
            ["Trạng thái hoạt động", "Đang hoạt động"],
          ].map(([k, v]) => (
            <div key={k as string} className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Cấu hình mở rộng trên WMS</div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-card border border-border rounded-lg p-3"><div className="text-xs text-muted-foreground">Dài</div><div className="font-bold text-navy">{wh.size.l.toLocaleString()}mm</div></div>
          <div className="bg-card border border-border rounded-lg p-3"><div className="text-xs text-muted-foreground">Rộng</div><div className="font-bold text-navy">{wh.size.w.toLocaleString()}mm</div></div>
          <div className="bg-card border border-border rounded-lg p-3"><div className="text-xs text-muted-foreground">Cao</div><div className="font-bold text-navy">{wh.size.h.toLocaleString()}mm</div></div>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-3">
          <div className="text-xs text-primary font-semibold uppercase">Diện tích kho</div>
          <div className="text-2xl font-bold text-navy">{wh.area.toLocaleString()} m²</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-sm">
          <div className="text-xs text-muted-foreground mb-1">Trạng thái cấu hình</div>
          <StatusBadge status={wh.configured ? "Đã cấu hình" : "Chưa cấu hình"} />
          <div className="text-xs text-muted-foreground mt-3 mb-1">Cấu hình gần nhất</div>
          <div className="font-medium">{wh.lastConfig}</div>
        </div>
      </div>
    </div>
  );
}

function PreviewTab({ onGen }: { onGen: () => void }) {
  const items = [
    { label: "Rack", count: 230, color: "primary" },
    { label: "Pallet", count: 124, color: "success" },
    { label: "Thùng gỗ", count: 79, color: "warning" },
    { label: "Hàng quá khổ", count: 38, color: "destructive" },
  ];
  const total = items.reduce((s, i) => s + i.count, 0);
  const cls: Record<string, string> = { primary: "bg-primary/10 text-primary border-primary/20", success: "bg-success/10 text-success border-success/20", warning: "bg-warning/10 text-warning border-warning/20", destructive: "bg-destructive/10 text-destructive border-destructive/20" };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(i => (
          <div key={i.label} className={`rounded-xl border p-4 ${cls[i.color]}`}>
            <div className="text-xs font-medium uppercase tracking-wide opacity-80">{i.label}</div>
            <div className="text-3xl font-bold mt-1">{i.count}</div>
            <div className="text-xs mt-1 opacity-80">vị trí sẽ sinh</div>
          </div>
        ))}
      </div>
      <div className="bg-navy/5 border border-navy/20 rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Tổng location & QR/RFID</div>
          <div className="text-4xl font-bold text-navy mt-1">{total} <span className="text-base font-normal text-muted-foreground">vị trí</span></div>
          <div className="text-xs text-muted-foreground mt-1">Mỗi location sẽ được cấp 1 QR + 1 RFID tag tự động</div>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" icon={ListChecks}>Kiểm tra rule</Btn>
          <Btn variant="success" icon={Sparkles} onClick={onGen}>Xác nhận sinh location</Btn>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-semibold text-navy mb-3">Mẫu mã location sẽ sinh</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          {["G01-T01-K01", "G01-T01-K02", "G01-T02-K01", "H01-T01-K01", "J01-R01-T01-P01", "J01-R01-T02-P01", "J02-R02-T01-P03", "K01-R01-T01-B01", "K01-R01-T02-B01", "K02-R02-T01-B04", "M01-SLOT01", "M02-SLOT05"].map(c => (
            <div key={c} className="px-2 py-1.5 bg-muted/50 rounded border border-border text-center">{c}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RuleCheckTab() {
  const results = [
    { lvl: "Đạt", rule: "RULE-LAYOUT-001", msg: "Không có phân khu chồng lấn", target: "—" },
    { lvl: "Đạt", rule: "RULE-LAYOUT-002", msg: "Tổng diện tích 3,000m² ≤ 3,200m²", target: "—" },
    { lvl: "Đạt", rule: "RULE-LAYOUT-004", msg: "Đủ khu bắt buộc", target: "A,B,D,F,M,N,PCCC" },
    { lvl: "Cảnh báo", rule: "RULE-LAYOUT-003", msg: "Khu D01 chồng lên đường N02 — đã được duyệt", target: "D01 ↔ N02", suggest: "Có thể bỏ qua" },
    { lvl: "Đạt", rule: "RULE-AISLE-002", msg: "Lối đi xe nâng đạt 2300mm", target: "N02" },
    { lvl: "Lỗi", rule: "RULE-PCCC-001", msg: "PCCC02 chiều rộng 650mm < 700mm", target: "PCCC02", suggest: "Mở rộng tuyến PCCC02 thêm 50mm" },
    { lvl: "Lỗi", rule: "RULE-PCCC-002", msg: "PCCC03 không liên tục", target: "PCCC03", suggest: "Loại bỏ vật cản đoạn 30-45m" },
  ];
  const counts = results.reduce((acc: any, r) => ({ ...acc, [r.lvl]: (acc[r.lvl] || 0) + 1 }), {});
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 text-success font-semibold"><CheckCircle2 className="w-5 h-5"/> Rule đạt</div>
          <div className="text-3xl font-bold text-success mt-1">{counts["Đạt"] || 0}</div>
        </div>
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-2 text-warning font-semibold"><AlertTriangle className="w-5 h-5"/> Cảnh báo</div>
          <div className="text-3xl font-bold text-warning mt-1">{counts["Cảnh báo"] || 0}</div>
        </div>
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 text-destructive font-semibold"><ShieldAlert className="w-5 h-5"/> Lỗi - Chặn lưu</div>
          <div className="text-3xl font-bold text-destructive mt-1">{counts["Lỗi"] || 0}</div>
        </div>
      </div>
      <div className="space-y-2">
        {results.map((e, i) => {
          const Icon = e.lvl === "Lỗi" ? ShieldAlert : e.lvl === "Cảnh báo" ? AlertTriangle : CheckCircle2;
          const cls = e.lvl === "Lỗi" ? "bg-destructive/5 border-destructive/20 text-destructive"
            : e.lvl === "Cảnh báo" ? "bg-warning/5 border-warning/20 text-warning"
            : "bg-success/5 border-success/20 text-success";
          return (
            <div key={i} className={`p-3 rounded-lg border flex gap-3 ${cls}`}>
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-foreground">
                <div className="text-sm font-medium">{e.msg}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Rule: <span className="font-mono">{e.rule}</span> · Đối tượng: <span className="font-mono">{e.target}</span>{e.suggest && <> · Gợi ý: <i>{e.suggest}</i></>}</div>
              </div>
              <StatusBadge status={e.lvl === "Lỗi" ? "Chặn lưu" : e.lvl === "Cảnh báo" ? "Cảnh báo" : "Đạt"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailedLayout() {
  const [view, setView] = useState<"overview" | "rack" | "pallet" | "wood">("overview");
  const views = [
    { k: "overview", l: "Tổng thể kho", icon: Map },
    { k: "rack", l: "Mặt cắt giá kệ G01", icon: Layers },
    { k: "pallet", l: "Khu Pallet J01", icon: Package },
    { k: "wood", l: "Khu Thùng gỗ K01", icon: Boxes },
  ] as const;

  return (
    <div className="bg-card rounded-xl border border-border p-5 mb-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="font-semibold text-navy">Sơ đồ layout 2D — Chi tiết khoang & tầng</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Hiển thị từng khoang trên giá kệ, ô pallet, ô thùng gỗ · Tỷ lệ ảo</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
          {views.map(v => (
            <button key={v.k} onClick={() => setView(v.k)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                view === v.k ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>
              <v.icon className="w-3.5 h-3.5" />{v.l}
            </button>
          ))}
        </div>
      </div>

      {view === "overview" && <OverviewLayout />}
      {view === "rack" && <RackLayout />}
      {view === "pallet" && <PalletLayout />}
      {view === "wood" && <WoodLayout />}
    </div>
  );
}

function OverviewLayout() {
  return (
    <>
      <div className="grid grid-cols-12 gap-2 h-64">
        <div className="col-span-2 bg-info/15 border-2 border-info/40 rounded-md flex flex-col items-center justify-center text-xs font-semibold text-info">A01<span className="text-[10px] font-normal">Cửa N/X</span></div>
        <div className="col-span-2 bg-warning/15 border-2 border-warning/40 rounded-md flex flex-col items-center justify-center text-xs font-semibold text-warning">B01<span className="text-[10px] font-normal">Khu chờ</span></div>
        <div className="col-span-5 bg-primary/10 border-2 border-primary/40 rounded-md p-1.5 flex flex-col">
          <div className="text-[10px] font-bold text-primary mb-1">G01 — Giá kệ hạng nặng (5 tầng × 20 khoang)</div>
          <div className="grid grid-cols-10 gap-px flex-1">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className={`rounded-[2px] ${i % 7 === 0 ? "bg-warning/60" : i % 5 === 0 ? "bg-muted-foreground/40" : "bg-primary/50"}`} />
            ))}
          </div>
        </div>
        <div className="col-span-3 bg-success/15 border-2 border-success/40 rounded-md p-1.5 flex flex-col">
          <div className="text-[10px] font-bold text-success mb-1">J01 — Pallet 6×10</div>
          <div className="grid grid-cols-6 gap-px flex-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className={`rounded-[2px] ${i % 6 === 0 ? "bg-warning/60" : "bg-success/55"}`} />
            ))}
          </div>
        </div>
        <div className="col-span-12 h-3 rounded text-[9px] text-navy text-center font-bold flex items-center justify-center"
          style={{ background: "repeating-linear-gradient(90deg, hsl(45 100% 51%), hsl(45 100% 51%) 14px, hsl(var(--navy)) 14px, hsl(var(--navy)) 22px)" }}>
          <span className="bg-white/90 px-2 rounded">N01 — Đường giao thông 2 chiều 2500mm</span>
        </div>
        <div className="col-span-7 bg-destructive/10 border-2 border-destructive/40 rounded-md p-1.5 flex flex-col">
          <div className="text-[10px] font-bold text-destructive mb-1">M01 — Hàng quá khổ (xe cẩu, an toàn 500mm)</div>
          <div className="grid grid-cols-6 gap-1 flex-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded border border-destructive/40 bg-destructive/15 flex items-center justify-center text-[9px] font-mono text-destructive">M01-{String(i + 1).padStart(2, "0")}</div>
            ))}
          </div>
        </div>
        <div className="col-span-5 bg-muted border-2 border-border rounded-md p-1.5 flex flex-col">
          <div className="text-[10px] font-bold text-muted-foreground mb-1">K01 — Thùng gỗ TN1 (3×5)</div>
          <div className="grid grid-cols-5 gap-px flex-1">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className={`rounded-[2px] ${i === 4 || i === 11 ? "bg-warning/60" : "bg-muted-foreground/35"}`} />
            ))}
          </div>
        </div>
        <div className="col-span-12 h-3 rounded flex items-center justify-center text-[9px] text-white font-bold"
          style={{ background: "repeating-linear-gradient(135deg, hsl(var(--destructive)), hsl(var(--destructive)) 8px, hsl(0 0% 100%) 8px, hsl(0 0% 100%) 16px)" }}>
          <span className="bg-destructive px-2 py-0.5 rounded">PCCC01 — Đường vành đai PCCC 700mm</span>
        </div>
      </div>
      <Legend items={[
        { c: "bg-primary/50", l: "Khoang trống" },
        { c: "bg-warning/60", l: "Khoang đã đặt" },
        { c: "bg-muted-foreground/40", l: "Khoang đầy" },
        { c: "bg-destructive/40", l: "Khoá / quá khổ" },
      ]} />
    </>
  );
}

function RackLayout() {
  const floors = [
    { code: "T05", load: 400, h: 1500 },
    { code: "T04", load: 500, h: 1500 },
    { code: "T03", load: 600, h: 1500 },
    { code: "T02", load: 800, h: 1500 },
    { code: "T01", load: 1000, h: 1500 },
  ];
  const bays = 20;
  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
        <span>G01 — Giá kệ hạng nặng · 12000×1100×6500mm · 5 tầng × 20 khoang = 100 vị trí</span>
        <span>Lối đi xe nâng: 2300mm</span>
      </div>
      <div className="border-2 border-navy rounded-md p-3 bg-muted/30">
        <div className="space-y-1.5">
          {floors.map((f) => (
            <div key={f.code} className="flex items-center gap-2">
              <div className="w-20 shrink-0 text-right">
                <div className="text-xs font-bold text-navy">{f.code}</div>
                <div className="text-[10px] text-muted-foreground">{f.load}kg · {f.h}mm</div>
              </div>
              <div className="grid grid-cols-20 gap-0.5 flex-1" style={{ gridTemplateColumns: `repeat(${bays}, minmax(0, 1fr))` }}>
                {Array.from({ length: bays }).map((_, i) => {
                  const fill = (i * 7 + f.code.charCodeAt(2)) % 5;
                  const cls = fill === 0 ? "bg-warning/70 text-warning-foreground" : fill === 1 ? "bg-destructive/60 text-white" : fill === 2 ? "bg-muted border" : "bg-success/50";
                  return (
                    <div key={i} className={`h-8 rounded-sm ${cls} flex items-center justify-center text-[8px] font-mono font-bold`}
                      title={`G01-${f.code}-K${String(i + 1).padStart(2, "0")}`}>
                      K{String(i + 1).padStart(2, "0")}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 h-3 rounded flex items-center justify-center text-[9px] font-bold text-navy"
          style={{ background: "repeating-linear-gradient(90deg, hsl(45 100% 51%), hsl(45 100% 51%) 12px, hsl(0 0% 100%) 12px, hsl(0 0% 100%) 18px)" }}>
          ← Lối đi xe nâng 2300mm →
        </div>
      </div>
      <Legend items={[
        { c: "bg-success/50", l: "Trống" },
        { c: "bg-warning/70", l: "Đã đặt trước" },
        { c: "bg-destructive/60", l: "Đầy / khoá" },
        { c: "bg-muted border", l: "Ngưng dùng" },
      ]} />
    </div>
  );
}

function PalletLayout() {
  const rows = 6, cols = 10;
  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
        <span>J01 — Pallet PL1 800×1200mm · 6 hàng × 10 cột = 60 ô · Stack 3</span>
        <span>Tải trọng: 1000kg/pallet</span>
      </div>
      <div className="border-2 border-navy rounded-md p-3 bg-muted/30">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows * cols }).map((_, i) => {
            const r = Math.floor(i / cols) + 1, c = (i % cols) + 1;
            const fill = (i * 11) % 4;
            const cls = fill === 0 ? "bg-warning/60 border-warning" : fill === 1 ? "bg-destructive/50 border-destructive" : "bg-success/40 border-success";
            return (
              <div key={i} className={`aspect-[3/2] rounded-sm border-2 ${cls} flex flex-col items-center justify-center text-[9px] font-mono font-semibold text-foreground`}
                title={`J01-R${r}-C${c}`}>
                <div>R{r}C{c}</div>
                <div className="text-[7px] opacity-70">×{(i % 3) + 1}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Legend items={[
        { c: "bg-success/40 border-2 border-success", l: "Trống" },
        { c: "bg-warning/60 border-2 border-warning", l: "1-2 stack" },
        { c: "bg-destructive/50 border-2 border-destructive", l: "Full stack 3" },
      ]} />
    </div>
  );
}

function WoodLayout() {
  const rows = 3, cols = 5;
  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
        <span>K01 — Thùng gỗ TN1 1000×800×500mm · 3 hàng × 5 cột = 15 ô · Stack 3</span>
        <span>Tải trọng: 100kg/thùng</span>
      </div>
      <div className="border-2 border-navy rounded-md p-3 bg-muted/30">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows * cols }).map((_, i) => {
            const r = Math.floor(i / cols) + 1, c = (i % cols) + 1;
            const stacks = (i * 3) % 4;
            return (
              <div key={i} className="aspect-[5/4] rounded border-2 border-muted-foreground/40 bg-card p-1.5 flex flex-col">
                <div className="text-[10px] font-mono font-bold text-navy">K01-R{r}C{c}</div>
                <div className="flex-1 flex flex-col-reverse gap-0.5 mt-1">
                  {Array.from({ length: 3 }).map((_, s) => (
                    <div key={s} className={`flex-1 rounded-sm ${s < stacks ? "bg-warning/70" : "bg-muted/60 border border-dashed border-muted-foreground/30"}`} />
                  ))}
                </div>
                <div className="text-[8px] text-muted-foreground mt-0.5 text-center">{stacks}/3 stack</div>
              </div>
            );
          })}
        </div>
      </div>
      <Legend items={[
        { c: "bg-warning/70", l: "Stack có hàng" },
        { c: "bg-muted/60 border border-dashed", l: "Stack trống" },
      ]} />
    </div>
  );
}

function Legend({ items }: { items: { c: string; l: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs">
      {items.map((x) => (
        <div key={x.l} className="flex items-center gap-1.5">
          <span className={`w-3.5 h-3.5 rounded-sm ${x.c}`} />
          <span className="text-muted-foreground">{x.l}</span>
        </div>
      ))}
    </div>
  );
}

function modalTitle(tab: string) {
  const map: Record<string, string> = {
    zone: "Tạo phân khu mới", rack: "Thêm giá kệ vào phân khu", floor: "Thêm tầng rack",
    pallet: "Thêm khu pallet", wood: "Thêm khu thùng gỗ", over: "Thêm slot hàng quá khổ",
    road: "Cấu hình đường giao thông", pccc: "Cấu hình tuyến PCCC",
  };
  return map[tab] || "Thêm cấu hình mới";
}

function ZoneForm({ wh }: { wh: any }) {
  const [type, setType] = useState("G");
  const existing = zones.filter(z => z.type.startsWith(type)).length;
  const nextCode = `${type}${String(existing + 1).padStart(2, "0")}`;
  const [l, setL] = useState(20000), [w, setW] = useState(15000);
  const area = ((l * w) / 1_000_000).toFixed(1);
  return (
    <>
      <div className="mb-4 p-3 rounded-lg bg-info/10 border border-info/20 text-xs flex gap-2">
        <Info className="w-4 h-4 text-info shrink-0 mt-0.5" />
        <div><b>Phân khu</b> chỉ định nghĩa vùng chức năng trên layout. Số tầng/số khoang/tải trọng tầng thuộc về <b>hạ tầng lưu trữ</b> (cấu hình ở các tab Giá kệ / Pallet / Thùng gỗ).</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Loại phân khu *">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="A">A - Cửa nhập/xuất</option><option value="B">B - Chờ N/X</option>
            <option value="C">C - Đóng gói</option><option value="D">D - Dự phòng</option>
            <option value="E">E - Phòng lạnh</option><option value="F">F - Khu làm việc</option>
            <option value="G">G - Giá kệ hạng nặng</option><option value="H">H - Giá kệ hạng trung</option>
            <option value="I">I - Giá kệ hạng nhẹ</option><option value="J">J - Pallet</option>
            <option value="K">K - Thùng gỗ</option><option value="L">L - PTVT/CCDC</option>
            <option value="M">M - Hàng quá khổ</option><option value="N">N - Đường giao thông</option>
            <option value="PCCC">PCCC - Đường vành đai PCCC</option>
          </Select>
        </Field>
        <Field label="Mã phân khu (tự sinh)">
          <Input value={nextCode} readOnly className="font-mono bg-muted/40" />
        </Field>
        <Field label="Tên phân khu *"><Input placeholder={`VD: Khu giá kệ hạng nặng số ${existing + 1}`} /></Field>
        <Field label="Kho áp dụng"><Input value={`${wh.code} — ${wh.name}`} readOnly className="bg-muted/40" /></Field>
        <Field label="Tọa độ X (mm)"><Input type="number" defaultValue={0} /></Field>
        <Field label="Tọa độ Y (mm)"><Input type="number" defaultValue={0} /></Field>
        <Field label="Chiều dài (mm)"><Input type="number" value={l} onChange={(e) => setL(+e.target.value)} /></Field>
        <Field label="Chiều rộng (mm)"><Input type="number" value={w} onChange={(e) => setW(+e.target.value)} /></Field>
        <Field label="Diện tích (m²) — tự tính"><Input value={area} readOnly className="bg-muted/40 font-semibold" /></Field>
        <Field label="Màu hiển thị"><Input type="color" defaultValue="#1d4ed8" className="h-10" /></Field>
        <Field label="Phương thức vận hành">
          <Select><option>Thủ công</option><option>Xe nâng</option><option>Xe cẩu</option></Select>
        </Field>
        <Field label="Lối đi tối thiểu (mm)"><Input type="number" defaultValue={2300} /></Field>
        <Field label="Có bắt buộc không">
          <Select><option>Có</option><option>Không</option></Select>
        </Field>
        <Field label="Trạng thái">
          <Select><option>Hoạt động</option><option>Tạm dừng</option></Select>
        </Field>
        <div className="col-span-2"><Field label="Ghi chú"><Input placeholder="Ghi chú cấu hình..." /></Field></div>
      </div>
    </>
  );
}

function InfraForm({ tab }: { tab: string }) {
  const zoneFilter: Record<string, string[]> = {
    rack: ["G", "H", "I"], pallet: ["J"], wood: ["K"], over: ["M"], road: ["N"], pccc: ["PCCC"], floor: ["G", "H", "I"],
  };
  const allowed = zoneFilter[tab] || [];
  const filteredZones = zones.filter(z => allowed.some(p => z.type.startsWith(p)));
  return (
    <>
      <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20 text-xs flex gap-2">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <div>Chỉ áp dụng cho phân khu loại <b>{allowed.join(" / ")}</b>. Hạ tầng này sẽ tự sinh location sau khi lưu.</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phân khu *">
          <Select>{filteredZones.map(z => <option key={z.code}>{z.code} — {z.name}</option>)}</Select>
        </Field>
        <Field label="Mã"><Input placeholder="Tự sinh" /></Field>
        {tab === "rack" && <>
          <Field label="Loại giá kệ"><Select><option>KC/G - Hạng nặng</option><option>KT/H - Hạng trung</option><option>KN/I - Hạng nhẹ</option></Select></Field>
          <Field label="Tên rack"><Input /></Field>
          <Field label="Số tầng"><Input type="number" defaultValue={5} /></Field>
          <Field label="Số khoang/tầng"><Input type="number" defaultValue={20} /></Field>
          <Field label="Dài × Rộng × Cao rack (mm)"><Input defaultValue="12000×1100×6500" /></Field>
          <Field label="Kích thước khoang (mm)"><Input defaultValue="600×1100×1300" /></Field>
          <Field label="Tải trọng/rack (kg)"><Input type="number" defaultValue={3000} /></Field>
          <Field label="Tải trọng/tầng (kg)"><Input type="number" defaultValue={1000} /></Field>
          <Field label="Khoảng cách giữa 2 rack (mm)"><Input type="number" defaultValue={150} /></Field>
          <Field label="Lối đi lấy hàng (mm)"><Input type="number" defaultValue={2300} /></Field>
          <Field label="Cấp QR"><Select><option>Có</option><option>Không</option></Select></Field>
          <Field label="Cấp RFID"><Select><option>Có</option><option>Không</option></Select></Field>
        </>}
        {tab === "pallet" && <>
          <Field label="Loại pallet"><Select><option>PL1 800×1200</option><option>PL2 1000×1200</option><option>PL3 1100×1100</option></Select></Field>
          <Field label="Số dãy"><Input type="number" defaultValue={2} /></Field>
          <Field label="Số tầng stacking"><Input type="number" defaultValue={3} /></Field>
          <Field label="Số pallet/dãy"><Input type="number" defaultValue={10} /></Field>
          <Field label="Tải trọng tối đa (kg)"><Input type="number" defaultValue={1000} /></Field>
          <Field label="Khoảng cách giữa pallet (mm)"><Input type="number" defaultValue={120} /></Field>
          <Field label="Lối đi lấy hàng (mm)"><Input type="number" defaultValue={2300} /></Field>
        </>}
        {tab === "wood" && <>
          <Field label="Loại thùng"><Select><option>TN1</option><option>TN2</option><option>TN3</option><option>TN4</option><option>TN5</option></Select></Field>
          <Field label="Số dãy"><Input type="number" defaultValue={3} /></Field>
          <Field label="Số tầng stacking"><Input type="number" defaultValue={3} /></Field>
          <Field label="Số thùng/dãy"><Input type="number" defaultValue={15} /></Field>
          <Field label="Tải trọng tối đa (kg)"><Input type="number" defaultValue={100} /></Field>
          <Field label="QR"><Select><option>Có</option><option>Không</option></Select></Field>
          <Field label="RFID"><Select><option>Có</option><option>Không</option></Select></Field>
        </>}
        {tab === "over" && <>
          <Field label="Loại hàng"><Select><option>Cột anten</option><option>Cuộn cáp quang</option><option>Nhà container</option></Select></Field>
          <Field label="Số slot"><Input type="number" defaultValue={12} /></Field>
          <Field label="Kích thước tối đa (mm)"><Input defaultValue="12000×1000×1000" /></Field>
          <Field label="Khoảng cách an toàn (mm)"><Input type="number" defaultValue={500} /></Field>
          <Field label="Thiết bị hỗ trợ"><Select><option>Xe cẩu</option><option>Xe nâng</option></Select></Field>
        </>}
        {tab === "road" && <>
          <Field label="Loại đường"><Select><option>Một chiều</option><option>Hai chiều</option></Select></Field>
          <Field label="Chiều rộng (mm)"><Input type="number" defaultValue={2500} /></Field>
          <Field label="Hướng di chuyển"><Input defaultValue="A01 → B01" /></Field>
          <Field label="Có xe nâng"><Select><option>Có</option><option>Không</option></Select></Field>
        </>}
        {tab === "pccc" && <>
          <Field label="Mã tuyến PCCC"><Input placeholder="PCCC01-L01" /></Field>
          <Field label="Chiều rộng (mm)"><Input type="number" defaultValue={700} /></Field>
          <Field label="Liên tục"><Select><option>Có</option><option>Không</option></Select></Field>
          <Field label="Bị che chắn"><Select><option>Không</option><option>Có</option></Select></Field>
        </>}
        <Field label="Trạng thái"><Select><option>Hoạt động</option><option>Tạm dừng</option></Select></Field>
      </div>
    </>
  );
}
