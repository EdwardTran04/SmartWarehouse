import { ReactNode } from "react";
import { Filter, Package, ListChecks, FileSignature, ShieldCheck, AlertTriangle, Camera, PenLine, MapPin, QrCode, Printer, Truck, FileCheck2, ClipboardCheck, Clock, User, Calendar, CheckCircle2, XCircle, Plus, Minus } from "lucide-react";

/* =============================================================
   SHARED UI COMPONENTS
   ============================================================= */

export function Badge({ tone, children }: { tone: "done" | "doing" | "warn" | "err" | "idle" | "info"; children: ReactNode }) {
  const map = {
    done: "bg-emerald-100 text-emerald-700 border-emerald-200",
    doing: "bg-sky-100 text-sky-700 border-sky-200",
    warn: "bg-orange-100 text-orange-700 border-orange-200",
    err: "bg-rose-100 text-rose-700 border-rose-200",
    idle: "bg-slate-100 text-slate-600 border-slate-200",
    info: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${map[tone]}`}>{children}</span>;
}

export function Dot({ tone }: { tone: "done" | "doing" | "warn" | "err" | "idle" }) {
  const c = { done: "bg-emerald-500", doing: "bg-sky-500", warn: "bg-orange-500", err: "bg-rose-500", idle: "bg-slate-400" };
  return <span className={`inline-block w-2 h-2 rounded-full ${c[tone]}`} />;
}

export function Btn({ children, variant = "primary", icon: Icon, onClick, full, size = "md" }: any) {
  const v: Record<string, string> = {
    primary: "bg-brand text-white shadow-[var(--shadow-brand)] active:scale-[.98]",
    outline: "border border-slate-200 bg-white text-slate-800 active:bg-slate-50",
    ghost: "text-slate-700 active:bg-slate-100",
    dark: "bg-slate-900 text-white active:bg-slate-800",
    success: "bg-emerald-600 text-white",
    danger: "bg-rose-600 text-white",
  };
  const s = size === "sm" ? "h-9 px-3 text-[13px]" : "h-12 px-4 text-[15px]";
  return (
    <button onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all ${v[variant]} ${s} ${full ? "w-full" : ""}`}>
      {Icon && <Icon className="w-[18px] h-[18px]" />} {children}
    </button>
  );
}

export function Field({ label, children, hint, required }: any) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
        {label} {required && <span className="text-brand">*</span>}
      </div>
      {children}
      {hint && <div className="text-[11px] text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}

export function Input(props: any) {
  return <input {...props} className={`h-11 w-full px-3 rounded-lg border border-slate-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand ${props.className || ""}`} />;
}

export function Card({ children, className = "" }: any) {
  return <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${className}`}>{children}</div>;
}

export function SectionTitle({ icon: Icon, title, action }: any) {
  return (
    <div className="flex items-center justify-between mt-4 mb-2 px-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-brand" />}
        <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function KpiTimer({ value, label, tone = "doing" }: { value: string; label: string; tone?: "done" | "doing" | "warn" | "err" | "idle" | "info" }) {
  const c = {
    done: "from-emerald-500 to-emerald-600",
    doing: "from-sky-500 to-sky-600",
    warn: "from-orange-500 to-orange-600",
    err: "from-rose-500 to-rose-600",
    idle: "from-slate-400 to-slate-500",
    info: "from-indigo-500 to-indigo-600",
  } as const;
  return (
    <div className={`bg-gradient-to-br ${c[tone]} text-white rounded-xl p-3`}>
      <div className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">{label}</div>
      <div className="text-2xl font-bold mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}

export function Row({ k, v }: any) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500">{k}</span>
      <span className="text-slate-900 font-semibold text-right">{v}</span>
    </div>
  );
}

export function Stat({ k, v }: any) {
  return (
    <div className="bg-slate-50 rounded-lg p-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{k}</div>
      <div className="text-[14px] font-bold text-slate-900 mt-0.5">{v}</div>
    </div>
  );
}

export function Mini({ k, v }: any) {
  return (
    <div className="bg-slate-50 rounded-lg py-2">
      <div className="text-[10px] uppercase text-slate-500 font-semibold">{k}</div>
      <div className="text-[14px] font-bold mt-0.5">{v}</div>
    </div>
  );
}