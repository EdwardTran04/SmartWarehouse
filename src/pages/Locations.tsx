import AppShell from "@/components/AppShell";
import { Btn, PageTitle, StatusBadge, Input, Select, Modal } from "@/components/ui-bits";
import { locations } from "@/data/mock";
import { Filter, QrCode, Lock, Unlock, Eye, Download } from "lucide-react";
import { useState } from "react";

export default function Locations() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [st, setSt] = useState("all");
  const [qr, setQr] = useState<string | null>(null);
  const list = locations.filter(l =>
    (type === "all" || l.type === type) &&
    (st === "all" || l.status === st) &&
    (q === "" || l.code.toLowerCase().includes(q.toLowerCase()) || l.sku.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AppShell breadcrumb={[{ label: "Danh mục dùng chung" }, { label: "Vị trí lưu trữ" }]}>
      <PageTitle title="Quản lý vị trí lưu trữ" subtitle="Vị trí được sinh tự động từ cấu hình kho — chỉ cho phép xem, khóa và in QR"
        actions={<Btn variant="outline" icon={Download}>Xuất Excel</Btn>} />

      <div className="bg-card rounded-xl border border-border p-4 mb-4 flex flex-wrap items-center gap-3" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Filter className="w-4 h-4" /> Bộ lọc nâng cao</div>
        <Input placeholder="Tìm mã location / SKU..." value={q} onChange={e=>setQ(e.target.value)} className="w-64" />
        <Select className="w-40"><option>Tất cả kho</option><option>HN01</option><option>HCM01</option><option>DN01</option></Select>
        <Select value={type} onChange={e=>setType(e.target.value)} className="w-44">
          <option value="all">Tất cả loại</option>
          <option>Rack</option><option>Pallet</option><option>Thùng gỗ</option><option>Hàng quá khổ</option>
        </Select>
        <Select value={st} onChange={e=>setSt(e.target.value)} className="w-44">
          <option value="all">Tất cả trạng thái</option>
          <option value="EMPTY">Trống</option>
          <option value="OCCUPIED">Đang chứa hàng</option>
          <option value="RESERVED">Đã đặt trước</option>
          <option value="BLOCKED">Đã khóa</option>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã location</th><th>Kho</th><th>Phân khu</th><th>Loại</th>
              <th>Cha</th><th>Tầng</th><th>Khoang</th><th>Trạng thái</th>
              <th>SKU</th><th>Tải trọng</th><th className="text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map(l => (
              <tr key={l.code}>
                <td className="font-mono font-semibold text-primary">{l.code}</td>
                <td>{l.warehouse}</td><td>{l.zone}</td>
                <td><span className="text-xs px-2 py-1 bg-muted rounded">{l.type}</span></td>
                <td>{l.parent}</td><td>{l.floor}</td><td>{l.bay}</td>
                <td><StatusBadge status={l.status} /></td>
                <td className="text-muted-foreground">{l.sku || "—"}</td>
                <td>{l.maxLoad}kg</td>
                <td className="text-right">
                  <div className="inline-flex gap-1">
                    <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-info" title="Xem"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => setQr(l.code)} className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-primary" title="In QR"><QrCode className="w-4 h-4" /></button>
                    {l.status === "BLOCKED"
                      ? <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-success" title="Mở khóa"><Unlock className="w-4 h-4" /></button>
                      : <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-destructive" title="Khóa"><Lock className="w-4 h-4" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!qr} onClose={() => setQr(null)} title={`QR Code — ${qr}`}
        footer={<><Btn variant="ghost" onClick={() => setQr(null)}>Đóng</Btn><Btn icon={Download}>Tải PNG</Btn></>}>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-56 h-56 bg-white p-3 rounded-lg border-2 border-border grid grid-cols-12 grid-rows-12 gap-px">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className={Math.random() > 0.5 ? "bg-navy" : "bg-white"} />
            ))}
          </div>
          <div className="text-center">
            <div className="font-mono text-lg font-bold text-navy">{qr}</div>
            <div className="text-xs text-muted-foreground">RFID: TAG-{qr?.replace(/-/g, "")}</div>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
