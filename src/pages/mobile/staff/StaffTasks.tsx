import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MOCK_USER, loadTasks, StaffTask, taskProgress, TaskStatus } from "@/lib/staffStore";
import { ArrowRight, MapPin, Clock, PackageCheck, PackagePlus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const statusLabel: Record<TaskStatus, { text: string; cls: string }> = {
  assigned: { text: "Chờ nhận", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  in_progress: { text: "Đang làm", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  paused: { text: "Tạm dừng", cls: "bg-orange-100 text-orange-700 border-orange-200" },
  done: { text: "Hoàn thành", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { text: "Đã huỷ", cls: "bg-muted text-muted-foreground" },
};

const priorityDot: Record<StaffTask["priority"], string> = {
  high: "bg-red-500",
  normal: "bg-blue-500",
  low: "bg-slate-400",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

function TaskCard({ t }: { t: StaffTask }) {
  const pct = taskProgress(t);
  const Icon = t.flow === "outbound" ? PackageCheck : PackagePlus;
  return (
    <Link to={`/app/tasks/${t.code}`}>
      <Card className="p-4 hover:border-primary/50 transition-colors active:scale-[0.99]">
        <div className="flex items-start gap-3">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
            t.flow === "outbound" ? "bg-primary/10 text-primary" : "bg-emerald-100 text-emerald-700")}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn("h-1.5 w-1.5 rounded-full", priorityDot[t.priority])} />
              <span className="text-xs text-muted-foreground font-mono">{t.code}</span>
              <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono">{t.templateCode}</Badge>
              <Badge variant="outline" className={cn("ml-auto text-[10px] py-0 px-1.5", statusLabel[t.status].cls)}>
                {statusLabel[t.status].text}
              </Badge>
            </div>
            <div className="font-semibold text-sm leading-snug line-clamp-2">{t.title}</div>
            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
              <span className="font-mono">{t.orderCode}</span>
              {t.location && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{t.location}</span>
              )}
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(t.assignedAt)}</span>
            </div>
            {t.status !== "assigned" && (
              <div className="mt-2">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{pct}% · {t.steps.filter(s=>s.status==='done').length}/{t.steps.length} bước</div>
              </div>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
        </div>
      </Card>
    </Link>
  );
}

export default function StaffTasks() {
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  useEffect(() => {
    setTasks(loadTasks());
    const onStorage = () => setTasks(loadTasks());
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, []);

  const filters = useMemo(() => ({
    active: tasks.filter(t => t.status === "in_progress" || t.status === "paused"),
    todo: tasks.filter(t => t.status === "assigned"),
    all: tasks,
    done: tasks.filter(t => t.status === "done" || t.status === "cancelled"),
  }), [tasks]);

  return (
    <div>
      <header className="px-4 pt-6 pb-4 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center font-semibold">
            {MOCK_USER.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs opacity-80">Xin chào,</div>
            <div className="font-semibold truncate">{MOCK_USER.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold leading-none">{filters.active.length + filters.todo.length}</div>
            <div className="text-[10px] opacity-80">task cần xử lý</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-primary-foreground/15 rounded-lg py-2">
            <div className="text-lg font-bold">{filters.active.length}</div>
            <div className="text-[10px] opacity-80">Đang làm</div>
          </div>
          <div className="bg-primary-foreground/15 rounded-lg py-2">
            <div className="text-lg font-bold">{filters.todo.length}</div>
            <div className="text-[10px] opacity-80">Chờ nhận</div>
          </div>
          <div className="bg-primary-foreground/15 rounded-lg py-2">
            <div className="text-lg font-bold">{filters.done.length}</div>
            <div className="text-[10px] opacity-80">Đã xong</div>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4">
        {filters.active[0] && (
          <Card className="p-3 mb-4 border-primary bg-primary/5">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
              <Zap className="h-3.5 w-3.5" /> Task đang thực hiện
            </div>
            <TaskCard t={filters.active[0]} />
          </Card>
        )}

        <Tabs defaultValue="todo">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="todo" className="text-xs">Chờ nhận <span className="ml-1 text-muted-foreground">({filters.todo.length})</span></TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Đang làm <span className="ml-1 text-muted-foreground">({filters.active.length})</span></TabsTrigger>
            <TabsTrigger value="done" className="text-xs">Xong <span className="ml-1 text-muted-foreground">({filters.done.length})</span></TabsTrigger>
            <TabsTrigger value="all" className="text-xs">Tất cả</TabsTrigger>
          </TabsList>
          {(["todo","active","done","all"] as const).map((k) => (
            <TabsContent key={k} value={k} className="space-y-2.5 mt-3">
              {filters[k as keyof typeof filters].length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">Không có task</div>
              ) : filters[k as keyof typeof filters].map(t => <TaskCard key={t.code} t={t} />)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}