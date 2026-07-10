import AppShell from "@/components/AppShell";
import { Btn, PageTitle, StatusBadge, Progress, Input, Select } from "@/components/ui-bits";
import { warehouses } from "@/data/mock";
import { Settings2, Eye, RefreshCw, Filter, Warehouse as WIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Warehouses() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = warehouses.filter((w) =>
    (status === "all" || (status === "yes" ? w.configured : !w.configured)) &&
    (q === "" || w.code.toLowerCase().includes(q.toLowerCase()) || w.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AppShell breadcrumb={[{ label: "Quản lý kho" }, { label: "Danh sách kho" }]}>
      <PageTitle title="Danh sách kho" subtitle="Danh sách kho được đồng bộ tự động từ SAP – không tạo mới thủ công trên WMS"
        actions={<Btn icon={RefreshCw} variant="outline">Đồng bộ từ SAP</Btn>} />

      <div className="bg-info/10 border border-info/30 rounded-lg px-4 py-2.5 mb-4 text-xs text-info-foreground flex items-center gap-2">
        <span className="font-semibold text-info">ⓘ Lưu ý:</span>
        <span className="text-foreground/80">Kho được đồng bộ từ hệ thống SAP. Người dùng WMS chỉ thực hiện cấu hình hạ tầng lưu trữ chi tiết cho từng kho.</span>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 mb-4 flex flex-wrap items-center gap-3" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Filter className="w-4 h-4" /> Bộ lọc</div>
        <Input placeholder="Tìm mã / tên kho..." value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-52">
          <option value="all">Tất cả trạng thái</option>
          <option value="yes">Đã cấu hình</option>
          <option value="no">Chưa cấu hình</option>
        </Select>
        <Select className="w-44">
          <option>Tất cả loại kho</option><option>Kho kín</option><option>Kho hở</option><option>Bãi kho</option>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã kho</th><th>Tên kho</th><th>Loại kho</th><th>Địa chỉ</th>
              <th>Trạng thái</th><th>Tỷ lệ sử dụng</th><th>Location</th><th>Cấu hình gần nhất</th><th className="text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.code}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center"><WIcon className="w-4 h-4 text-primary" /></div>
                    <span className="font-semibold">{w.code}</span>
                  </div>
                </td>
                <td className="font-medium">{w.name}</td>
                <td><span className="text-xs px-2 py-1 bg-muted rounded">{w.type}</span></td>
                <td className="text-muted-foreground">{w.address}</td>
                <td><StatusBadge status={w.configured ? "Đã cấu hình" : "Chưa cấu hình"} /></td>
                <td>
                  <div className="flex items-center gap-2 w-40">
                    <Progress value={w.utilization} />
                    <span className="text-xs font-medium w-10">{w.utilization}%</span>
                  </div>
                </td>
                <td className="font-medium">{w.locations.toLocaleString("vi-VN")}</td>
                <td className="text-muted-foreground text-xs">{w.lastConfig}</td>
                <td className="text-right">
                  <div className="inline-flex gap-2">
                    <Link to={`/warehouses/${w.code}/configure`}>
                      <Btn variant="outline" icon={Eye}>Xem cấu hình</Btn>
                    </Link>
                    <Link to={`/warehouses/${w.code}/configure`}>
                      <Btn icon={Settings2}>{w.configured ? "Sửa cấu hình" : "Cấu hình kho"}</Btn>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
