import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_USER, loadTasks, loadLeaves } from "@/lib/staffStore";
import { useEffect, useState } from "react";
import { Bell, Globe, HelpCircle, LogOut, Shield } from "lucide-react";

export default function StaffProfile() {
  const [stats, setStats] = useState({ done: 0, active: 0, leaves: 0 });
  useEffect(() => {
    const tasks = loadTasks();
    const leaves = loadLeaves();
    setStats({
      done: tasks.filter(t => t.status === "done").length,
      active: tasks.filter(t => t.status === "in_progress" || t.status === "paused").length,
      leaves: leaves.length,
    });
  }, []);

  return (
    <div>
      <header className="px-4 pt-8 pb-6 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-center">
        <div className="h-20 w-20 rounded-full bg-primary-foreground/20 backdrop-blur mx-auto flex items-center justify-center text-2xl font-bold">
          {MOCK_USER.avatar}
        </div>
        <div className="mt-3 font-bold text-lg">{MOCK_USER.name}</div>
        <div className="text-xs opacity-80">{MOCK_USER.id} · {MOCK_USER.role}</div>
        <div className="text-xs opacity-80">{MOCK_USER.team}</div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-primary">{stats.active}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Đang làm</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-emerald-600">{stats.done}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Đã xong</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-amber-600">{stats.leaves}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Đơn nghỉ</div>
          </Card>
        </div>

        <Card className="divide-y">
          {[
            { icon: Bell, label: "Thông báo" },
            { icon: Globe, label: "Ngôn ngữ", value: "Tiếng Việt" },
            { icon: Shield, label: "Bảo mật & PIN" },
            { icon: HelpCircle, label: "Trợ giúp" },
          ].map((r) => (
            <button key={r.label} className="w-full flex items-center gap-3 p-3 text-sm hover:bg-muted/50 text-left">
              <r.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{r.label}</span>
              {r.value && <span className="text-xs text-muted-foreground">{r.value}</span>}
            </button>
          ))}
        </Card>

        <Button variant="outline" className="w-full text-destructive">
          <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
        </Button>

        <div className="text-center text-[10px] text-muted-foreground pt-2">
          Kho Thông Minh · Staff App v1.0
        </div>
      </div>
    </div>
  );
}