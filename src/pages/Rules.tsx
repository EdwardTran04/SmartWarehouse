import AppShell from "@/components/AppShell";
import { Btn, PageTitle, StatusBadge, Modal, Field, Input, Select, Toggle } from "@/components/ui-bits";
import { layoutRules, rackRules, ppcRules } from "@/data/mock";
import { Plus, Play, AlertTriangle, CheckCircle2, ShieldAlert, FlameKindling, Layers, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TABS = [
  { key: "layout", label: "Tiêu chuẩn layout", icon: Layers },
  { key: "rack", label: "Khoảng cách rack", icon: ShieldAlert },
  { key: "pccc", label: "PCCC", icon: FlameKindling },
];

export default function Rules() {
  const [tab, setTab] = useState("layout");
  const [items, setItems] = useState({
    layout: layoutRules.map(r => ({ ...r })),
    rack: rackRules.map(r => ({ ...r })),
    pccc: ppcRules.map(r => ({ ...r })),
  });
  const [open, setOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const toggleAt = (key: string, idx: number) => {
    setItems(prev => ({ ...prev, [key]: (prev as any)[key].map((r: any, i: number) => i === idx ? { ...r, active: !r.active } : r) }));
  };

  return (
    <AppShell breadcrumb={[{ label: "Cấu hình hệ thống" }, { label: "Rule kiểm tra" }]}>
      <PageTitle title="Cấu hình quy tắc kiểm tra" subtitle="Tiêu chuẩn validate layout & an toàn kho"
        actions={<>
          <Btn variant="outline" icon={Play} onClick={() => { setResultOpen(true); }}>Chạy kiểm tra thử</Btn>
          <Btn icon={Plus} onClick={() => setOpen(true)}>Thêm rule</Btn>
        </>} />

      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex border-b border-border">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm border-b-2 transition-colors ${
                tab === t.key ? "border-primary text-primary font-semibold bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "layout" && (
            <table className="data-table">
              <thead><tr><th>Mã rule</th><th>Tên rule</th><th>Đối tượng</th><th>Điều kiện</th><th>Giá trị</th><th>Mức độ</th><th>Bật/Tắt</th><th></th></tr></thead>
              <tbody>
                {items.layout.map((r, i) => (
                  <tr key={r.code}>
                    <td className="font-mono font-semibold text-primary">{r.code}</td>
                    <td className="font-medium">{r.name}</td>
                    <td>{r.target}</td>
                    <td className="font-mono text-xs">{r.cond}</td>
                    <td>{r.value} {r.unit}</td>
                    <td><StatusBadge status={r.level} /></td>
                    <td><Toggle checked={r.active} onChange={() => toggleAt("layout", i)} /></td>
                    <td className="text-right"><button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "rack" && (
            <table className="data-table">
              <thead><tr><th>Mã rule</th><th>Loại khu vực</th><th>Vận hành</th><th>Khoảng cách tối thiểu</th><th>Mức độ</th><th>Bật/Tắt</th><th></th></tr></thead>
              <tbody>
                {items.rack.map((r, i) => (
                  <tr key={r.code}>
                    <td className="font-mono font-semibold text-primary">{r.code}</td>
                    <td>{r.area}</td><td>{r.method}</td>
                    <td className="font-semibold">{r.min} {r.unit}</td>
                    <td><StatusBadge status={r.level} /></td>
                    <td><Toggle checked={r.active} onChange={() => toggleAt("rack", i)} /></td>
                    <td className="text-right"><button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "pccc" && (
            <table className="data-table">
              <thead><tr><th>Mã rule</th><th>Tên rule</th><th>Giá trị tối thiểu</th><th>Mức độ</th><th>Bật/Tắt</th><th></th></tr></thead>
              <tbody>
                {items.pccc.map((r, i) => (
                  <tr key={r.code}>
                    <td className="font-mono font-semibold text-primary">{r.code}</td>
                    <td className="font-medium">{r.name}</td>
                    <td className="font-semibold">{r.min} {r.unit}</td>
                    <td><StatusBadge status={r.level} /></td>
                    <td><Toggle checked={r.active} onChange={() => toggleAt("pccc", i)} /></td>
                    <td className="text-right"><button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Thêm rule mới" wide
        footer={<>
          <Btn variant="ghost" onClick={() => setOpen(false)}>Hủy</Btn>
          <Btn onClick={() => { setOpen(false); toast.success("Đã thêm rule"); }}>Lưu rule</Btn>
        </>}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mã rule"><Input placeholder="VD: RULE-LAYOUT-004" /></Field>
          <Field label="Tên rule"><Input placeholder="Mô tả ngắn gọn" /></Field>
          <Field label="Đối tượng áp dụng"><Select><option>Phân khu</option><option>Giá kệ</option><option>Lối đi</option><option>PCCC</option></Select></Field>
          <Field label="Điều kiện"><Input placeholder="VD: width ≥ 700" /></Field>
          <Field label="Giá trị tiêu chuẩn"><Input type="number" /></Field>
          <Field label="Đơn vị"><Select><option>mm</option><option>m²</option><option>%</option></Select></Field>
          <Field label="Mức độ"><Select><option>Cảnh báo</option><option>Chặn lưu</option></Select></Field>
          <Field label="Trạng thái"><Select><option>Bật</option><option>Tắt</option></Select></Field>
        </div>
      </Modal>

      <Modal open={resultOpen} onClose={() => setResultOpen(false)} title="Kết quả kiểm tra layout — Kho HN01" wide
        footer={<Btn onClick={() => setResultOpen(false)}>Đóng</Btn>}>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 text-success font-semibold"><CheckCircle2 className="w-5 h-5"/> Đạt</div>
              <div className="text-2xl font-bold text-success mt-1">12</div>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 text-warning font-semibold"><AlertTriangle className="w-5 h-5"/> Cảnh báo</div>
              <div className="text-2xl font-bold text-warning mt-1">2</div>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive font-semibold"><ShieldAlert className="w-5 h-5"/> Lỗi</div>
              <div className="text-2xl font-bold text-destructive mt-1">1</div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { lvl: "Lỗi", rule: "RULE-PCCC-001", msg: "PCCC02 chiều rộng 650mm < 700mm" },
              { lvl: "Cảnh báo", rule: "RULE-LAYOUT-003", msg: "Khu D chồng lên đường N02 — đã được duyệt" },
              { lvl: "Cảnh báo", rule: "RULE-AISLE-001", msg: "Lối đi B01 = 1180mm gần ngưỡng tối thiểu" },
            ].map((e, i) => (
              <div key={i} className={`p-3 rounded-lg border flex gap-3 ${e.lvl === "Lỗi" ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"}`}>
                {e.lvl === "Lỗi" ? <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5"/> : <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5"/>}
                <div className="flex-1">
                  <div className="text-sm font-medium">{e.msg}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Rule: <span className="font-mono">{e.rule}</span></div>
                </div>
                <StatusBadge status={e.lvl === "Lỗi" ? "Chặn lưu" : "Cảnh báo"} />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
