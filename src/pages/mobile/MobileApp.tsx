import { useMemo, useState } from "react";
import { Boxes } from "lucide-react";
import {
  Screen,
  screens,
  ScreenLogin,
  ScreenHome,
  ScreenHomeTask,
  ScreenHrDashboard,
  ScreenReceive,
  ScreenVehicle,
  ScreenVehicleConfirm,
  ScreenUnload,
  ScreenCheck,
  ScreenBBBG,
  ScreenTAGR,
  ScreenVOffice,
  ScreenPack,
  ScreenInboundWaitArea,
  ScreenPutaway,
  ScreenApprove,
  ScreenInboundOrderList,
  ScreenOutboundOrderList,
  ScreenOutConfirm,
  ScreenOutPick,
  ScreenOutKcs,
  ScreenOutPack,
  ScreenOutLoad,
  ScreenOutWaitArea,
  ScreenOutBBBG,
  ScreenOutVOffice,
  ScreenWorker,
  ScreenNotify,
  ScreenScan,
  ScreenProfile,
  ScreenScheduleRegister,
  ScreenPartnerVehicle,
} from "./screens";
import { PhoneFrame, BottomNav } from "./components/layout";

/* =============================================================
   ROOT MOBILE APP
============================================================ */
export default function MobileApp() {
  const [screen, setScreen] = useState<Screen>("login");
  const [history, setHistory] = useState<Screen[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  const go = (s: Screen) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
  };
  const back = () => {
    setHistory((h) => {
      const last = h[h.length - 1] || "home";
      setScreen(last);
      return h.slice(0, -1);
    });
  };
  const navTo = (s: Screen) => {
    setHistory([]);
    setScreen(s);
  };

  const showBottomNav = useMemo(
    () => !["login", "scan"].includes(screen) && !["receive", "vehicle", "vehicleConfirm", "hrDashboard", "unload", "check", "bbbg", "tagr", "voffice", "pack", "inboundWaitArea", "putaway", "worker", "approve", "inboundOrderList", "outboundOrderList", "outConfirm", "outPick", "outPack", "outWaitArea", "outKcs", "outBBBG", "outLoad", "outVOffice", "scheduleRegister", "partnerVehicle"].includes(screen),
    [screen]
  );

  const render = () => {
    switch (screen) {
      case "login": return <ScreenLogin go={go} />;
      case "home": return <ScreenHome go={go} />;
      case "task": return <ScreenHomeTask go={go} />;
      case "hrDashboard": return <ScreenHrDashboard back={back} go={go} />;
      case "receive": return <ScreenReceive back={back} />;
      case "vehicle": return <ScreenVehicle back={back} goScan={(vehicleId) => { setSelectedVehicleId(vehicleId); go("scan"); }} />;
      case "vehicleConfirm": return <ScreenVehicleConfirm back={back} go={go} />;
      case "unload": return <ScreenUnload back={back} goHome={() => navTo("task")} />;
      case "check": return <ScreenCheck back={back} goHome={() => navTo("task")} />;
      case "bbbg": return <ScreenBBBG back={back} done={back} />;
      case "tagr": return <ScreenTAGR back={back} goVOffice={() => navTo("voffice")} />;
      case "voffice": return <ScreenVOffice back={back} goHome={() => navTo("task")} />;
      case "pack": return <ScreenPack back={back} goHome={() => navTo("task")} />;
      case "inboundWaitArea": return <ScreenInboundWaitArea back={back} goHome={() => navTo("task")} />;
      case "putaway": return <ScreenPutaway back={back} goHome={() => navTo("task")} />;
      case "approve": return <ScreenApprove back={back} />;
      case "inboundOrderList": return <ScreenInboundOrderList back={back} goReceive={() => go("receive")} />;
      case "worker": return <ScreenWorker back={back} />;
      case "notify": return <ScreenNotify back={back} />;
      case "scan": return <ScreenScan back={back} />;
      case "profile": return <ScreenProfile back={back} />;
      case "scheduleRegister": return <ScreenScheduleRegister back={back} />;
      case "partnerVehicle": return <ScreenPartnerVehicle back={back} />;
      case "outboundOrderList": return <ScreenOutboundOrderList back={back} goOutConfirm={() => go("outConfirm")} />;
      case "outConfirm": return <ScreenOutConfirm back={back} />;
      case "outPick": return <ScreenOutPick back={back} />;
      case "outPack": return <ScreenOutPack back={back} />;
      case "outWaitArea": return <ScreenOutWaitArea back={back} />;
      case "outKcs": return <ScreenOutKcs back={back} />;
      case "outBBBG": return <ScreenOutBBBG back={back} />;
      case "outLoad": return <ScreenOutLoad back={back} />;
      case "outVOffice": return <ScreenOutVOffice back={back} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Screen index sidebar (desktop only) */}
      <aside className="hidden lg:block w-80 bg-white border-r border-slate-200 p-5 overflow-y-auto h-screen sticky top-0">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--gradient-brand)" }}>
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900">Viettel AIWS · Mobile</div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider">Nhập & Xuất kho</div>
          </div>
        </div>
        {Array.from(new Set(screens.map((s) => s.group))).map((g) => (
          <div key={g} className="mb-4">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">{g}</div>
            <div className="space-y-0.5">
              {screens.filter((s) => s.group === g).map((s) => (
                <button key={s.id} onClick={() => navTo(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium ${screen === s.id ? "bg-brand text-white" : "text-slate-700 hover:bg-slate-100"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div>
          <PhoneFrame>
            {render()}
            {showBottomNav && <BottomNav active={screen} onChange={navTo} />}
          </PhoneFrame>
          <div className="mt-3 text-center text-[12px] text-slate-500">
            Mobile · 390 × 844 · Brand Viettel <span className="text-brand font-bold">#EE0033</span>
          </div>
        </div>
      </div>
    </div>
  );
}