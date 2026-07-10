import CatalogPage, { RowActions } from "./CatalogPage";
import { StatusBadge } from "@/components/ui-bits";
import { rackTypes, palletTypes, woodboxTypes, zoneTypes, locationStatuses } from "@/data/mock";
import { Check, X } from "lucide-react";

export function RackTypesPage() {
  return <CatalogPage
    title="Danh mục loại giá kệ" subtitle="Phân loại các loại giá kệ chuẩn của hệ thống"
    breadcrumb={[{ label: "Danh mục dùng chung" }, { label: "Loại giá kệ" }]}
    columns={["Mã", "Tên loại", "Mô tả", "Kích thước mặc định", "Tải trọng (kg)", "Trạng thái", ""]}
    rows={rackTypes.map(r => [
      <span className="font-mono font-bold text-primary">{r.code}</span>,
      r.name, r.desc, r.dim, r.load, <StatusBadge status={r.status} />, <RowActions />,
    ])}
    formFields={[
      { label: "Mã loại" }, { label: "Tên loại" },
      { label: "Mô tả" }, { label: "Kích thước (mm)" },
      { label: "Tải trọng (kg)", type: "number" },
      { label: "Trạng thái", options: ["Hoạt động", "Khóa"] },
    ]} />;
}

export function PalletTypesPage() {
  return <CatalogPage
    title="Danh mục loại pallet" subtitle="Quản lý các chuẩn pallet sử dụng trong kho"
    breadcrumb={[{ label: "Danh mục dùng chung" }, { label: "Loại pallet" }]}
    columns={["Mã", "Tên loại", "Chất liệu", "Kích thước", "Tải trọng (kg)", "Trạng thái", ""]}
    rows={palletTypes.map(r => [
      <span className="font-mono font-bold text-primary">{r.code}</span>,
      r.name, r.material, r.dim, r.load, <StatusBadge status={r.status} />, <RowActions />,
    ])}
    formFields={[
      { label: "Mã loại" }, { label: "Tên loại" },
      { label: "Chất liệu", options: ["Gỗ", "Nhựa", "Sắt"] },
      { label: "Kích thước (mm)" },
      { label: "Tải trọng (kg)", type: "number" },
      { label: "Trạng thái", options: ["Hoạt động", "Khóa"] },
    ]} />;
}

export function WoodboxTypesPage() {
  return <CatalogPage
    title="Danh mục loại thùng gỗ" subtitle="Phân loại thùng gỗ sử dụng trong kho"
    breadcrumb={[{ label: "Danh mục dùng chung" }, { label: "Loại thùng gỗ" }]}
    columns={["Mã", "Tên loại", "Kích thước", "Tải trọng (kg)", "Stack tầng", "Trạng thái", ""]}
    rows={woodboxTypes.map(r => [
      <span className="font-mono font-bold text-primary">{r.code}</span>,
      r.name, r.dim, r.load, r.stack, <StatusBadge status={r.status} />, <RowActions />,
    ])}
    formFields={[
      { label: "Mã loại" }, { label: "Tên loại" },
      { label: "Kích thước (mm)" }, { label: "Tải trọng (kg)", type: "number" },
      { label: "Stack tầng", type: "number" },
      { label: "Trạng thái", options: ["Hoạt động", "Khóa"] },
    ]} />;
}

export function ZoneTypesPage() {
  return <CatalogPage
    title="Danh mục loại phân khu" subtitle="Định nghĩa các loại khu vực trong kho"
    breadcrumb={[{ label: "Danh mục dùng chung" }, { label: "Loại phân khu" }]}
    columns={["Mã", "Tên loại phân khu", "Mã chuẩn", "Bắt buộc", "Mô tả", "Trạng thái", ""]}
    rows={zoneTypes.map(r => [
      <span className="font-mono font-bold text-primary">{r.code}</span>,
      r.name,
      <span className="text-xs px-2 py-1 bg-muted rounded font-mono">{r.std}</span>,
      r.required
        ? <span className="inline-flex items-center gap-1 text-success text-xs font-medium"><Check className="w-3.5 h-3.5"/>Bắt buộc</span>
        : <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><X className="w-3.5 h-3.5"/>Tùy chọn</span>,
      r.desc || "—", <StatusBadge status={r.status} />, <RowActions />,
    ])}
    formFields={[
      { label: "Mã" }, { label: "Tên loại" },
      { label: "Mã chuẩn" }, { label: "Bắt buộc", options: ["Có", "Không"] },
      { label: "Mô tả" }, { label: "Trạng thái", options: ["Hoạt động", "Khóa"] },
    ]} />;
}

export function LocationStatusPage() {
  const colorMap: Record<string, string> = {
    success: "bg-success", info: "bg-info", warning: "bg-warning", destructive: "bg-destructive", muted: "bg-muted-foreground",
  };
  return <CatalogPage
    title="Danh mục trạng thái location" subtitle="Cấu hình trạng thái và hành vi của vị trí lưu trữ"
    breadcrumb={[{ label: "Danh mục dùng chung" }, { label: "Trạng thái location" }]}
    columns={["Mã", "Tên trạng thái", "Màu hiển thị", "Cho nhập", "Cho xuất", "Mô tả", ""]}
    rows={locationStatuses.map(r => [
      <span className="font-mono font-bold">{r.code}</span>,
      <StatusBadge status={r.code} />,
      <div className="flex items-center gap-2"><span className={`w-5 h-5 rounded ${colorMap[r.color]}`} /><span className="text-xs capitalize">{r.color}</span></div>,
      r.inbound ? <Check className="w-4 h-4 text-success"/> : <X className="w-4 h-4 text-muted-foreground"/>,
      r.outbound ? <Check className="w-4 h-4 text-success"/> : <X className="w-4 h-4 text-muted-foreground"/>,
      r.desc, <RowActions />,
    ])}
    formFields={[
      { label: "Mã" }, { label: "Tên trạng thái" },
      { label: "Màu hiển thị", options: ["success", "info", "warning", "destructive", "muted"] },
      { label: "Cho phép nhập", options: ["Có", "Không"] },
      { label: "Cho phép xuất", options: ["Có", "Không"] },
      { label: "Mô tả" },
    ]} />;
}
