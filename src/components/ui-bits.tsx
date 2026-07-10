import React, { ReactNode } from "react";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Đã cấu hình": "bg-success/10 text-success border-success/20",
    "Chưa cấu hình": "bg-warning/10 text-warning border-warning/20",
    "Hoạt động": "bg-success/10 text-success border-success/20",
    "Khóa": "bg-destructive/10 text-destructive border-destructive/20",
    "Đầy": "bg-info/10 text-info border-info/20",
    "Còn trống": "bg-success/10 text-success border-success/20",
    "Đạt": "bg-success/10 text-success border-success/20",
    "Không đạt": "bg-destructive/10 text-destructive border-destructive/20",
    "Cảnh báo": "bg-warning/10 text-warning border-warning/20",
    "Chặn lưu": "bg-destructive/10 text-destructive border-destructive/20",
    EMPTY: "bg-success/10 text-success border-success/20",
    OCCUPIED: "bg-info/10 text-info border-info/20",
    RESERVED: "bg-warning/10 text-warning border-warning/20",
    BLOCKED: "bg-destructive/10 text-destructive border-destructive/20",
    INACTIVE: "bg-muted text-muted-foreground border-border",
  };
  const labels: Record<string, string> = {
    EMPTY: "Trống", OCCUPIED: "Đang chứa", RESERVED: "Đã đặt trước", BLOCKED: "Đã khóa", INACTIVE: "Ngưng dùng",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${map[status] || "bg-muted text-muted-foreground border-border"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[status] || status}
    </span>
  );
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-navy tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Btn({ variant = "primary", children, onClick, className = "", icon: Icon }: any) {
  const v: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    outline: "border border-border bg-card hover:bg-muted text-foreground",
    ghost: "hover:bg-muted text-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    success: "bg-success text-success-foreground hover:bg-success/90",
  };
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium transition-colors ${v[variant]} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm" onClick={onClose}>
      <div className={`bg-card rounded-xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-xl"} border border-border`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-navy">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/30 rounded-b-xl">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`h-9 w-full px-3 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 ${props.className || ""}`} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`h-9 w-full px-3 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 ${props.className || ""}`}>{children}</select>;
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-full relative transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

export function Progress({ value }: { value: number }) {
  const color = value >= 85 ? "bg-destructive" : value >= 60 ? "bg-warning" : "bg-success";
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function MultiSelectDropdown({ options, value, onChange, placeholder = "Chọn..." }: { options: string[]; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);
  const label = value.length === 0 ? placeholder : value.length === 1 ? value[0] : `${value.length} đã chọn`;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="h-9 w-full px-3 rounded-md bg-muted/60 text-sm text-left flex items-center justify-between gap-2">
        <span className={value.length === 0 ? "text-muted-foreground" : ""}>{label}</span>
        <span className="text-muted-foreground">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-auto bg-card border border-border rounded-md shadow-lg">
          {value.length > 0 && (
            <button type="button" onClick={() => onChange([])} className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 border-b border-border">Bỏ chọn tất cả</button>
          )}
          {options.map((o) => (
            <label key={o} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/50 cursor-pointer">
              <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} className="rounded" />
              <span>{o}</span>
            </label>
          ))}
          {options.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">Không có dữ liệu</div>}
        </div>
      )}
    </div>
  );
}

export function SingleSelectDropdown({ options, value, onChange, placeholder = "Chọn..." }: { options: string[]; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const label = value || placeholder;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="h-9 w-full px-3 rounded-md bg-muted/60 text-sm text-left flex items-center justify-between gap-2">
        <span className={!value ? "text-muted-foreground" : ""}>{label}</span>
        <span className="text-muted-foreground">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-auto bg-card border border-border rounded-md shadow-lg">
          <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 border-b border-border">Tất cả</button>
          {options.map((o) => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }} className={`w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 cursor-pointer ${value === o ? "bg-primary/10 text-primary font-medium" : ""}`}>
              {o}
            </button>
          ))}
          {options.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">Không có dữ liệu</div>}
        </div>
      )}
    </div>
  );
}
