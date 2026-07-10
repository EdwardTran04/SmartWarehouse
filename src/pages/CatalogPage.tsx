import AppShell from "@/components/AppShell";
import { Btn, PageTitle, StatusBadge, Modal, Field, Input, Select } from "@/components/ui-bits";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

export default function CatalogPage({
  title, subtitle, breadcrumb, columns, rows, formFields,
}: {
  title: string;
  subtitle: string;
  breadcrumb: { label: string }[];
  columns: string[];
  rows: any[][];
  formFields: { label: string; type?: string; options?: string[] }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <AppShell breadcrumb={breadcrumb}>
      <PageTitle title={title} subtitle={subtitle}
        actions={<Btn icon={Plus} onClick={() => setOpen(true)}>Thêm mới</Btn>} />

      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <table className="data-table">
          <thead><tr>{columns.map((c, i) => <th key={i} className={i === columns.length - 1 ? "text-right" : ""}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c: any, j: number) => <td key={j} className={j === columns.length - 1 ? "text-right" : ""}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Thêm ${title.toLowerCase()}`} wide
        footer={<>
          <Btn variant="ghost" onClick={() => setOpen(false)}>Hủy</Btn>
          <Btn onClick={() => { setOpen(false); toast.success("Đã lưu thành công"); }}>Lưu</Btn>
        </>}>
        <div className="grid grid-cols-2 gap-4">
          {formFields.map((f, i) => (
            <Field key={i} label={f.label}>
              {f.options ? <Select>{f.options.map(o => <option key={o}>{o}</option>)}</Select> : <Input type={f.type || "text"} />}
            </Field>
          ))}
        </div>
      </Modal>
    </AppShell>
  );
}

export function RowActions() {
  return (
    <div className="inline-flex gap-1">
      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-info"><Eye className="w-4 h-4" /></button>
      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}
