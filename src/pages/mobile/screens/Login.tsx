import { ArrowRight, Boxes } from "lucide-react";
import { Field, Input, Btn } from "../components/ui";

/* =============================================================
   SCREEN: 1. LOGIN
============================================================ */
type Screen = "login" | "home" | "task" | "receive" | "vehicle" | "unload" | "check"
  | "kcs" | "reject" | "tagr" | "voffice" | "pack" | "putaway"
  | "outConfirm" | "outPick" | "outPack" | "outKcs" | "outLoad" | "outHandover"
  | "approve" | "approveDetail"
  | "worker" | "notify" | "scan" | "profile";

export function ScreenLogin({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col" style={{ background: "var(--gradient-brand)" }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-white">
        <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-4 border border-white/20">
          <Boxes className="w-10 h-10" />
        </div>
        <div className="text-[28px] font-extrabold tracking-tight">Viettel AIWS</div>
        <div className="text-[13px] text-white/80 mt-1">Smart Warehouse · Hiện trường</div>
      </div>

      <div className="bg-white rounded-t-[28px] p-6 pb-8 space-y-4">
        <div className="text-[18px] font-bold text-slate-900">Đăng nhập</div>
        <Field label="Tài khoản"><Input defaultValue="nv.kho.hn01" placeholder="Tên đăng nhập" /></Field>
        <Field label="Mật khẩu"><Input type="password" defaultValue="••••••••" /></Field>
        <Btn full icon={ArrowRight} onClick={() => go("home")}>Đăng nhập</Btn>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider"><span className="bg-white px-2 text-slate-400">Hoặc</span></div>
        </div>
        <button onClick={() => alert("Đang chuyển hướng đến SSO...")} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/></svg>
          Đăng nhập bằng SSO
        </button>
      </div>
    </div>
  );
}