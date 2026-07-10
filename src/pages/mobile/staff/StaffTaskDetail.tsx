import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CheckCircle2, Circle, Play, Pause, Check, Minus, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { loadTasks, saveTasks, StaffTask, taskProgress, FLOW_LABEL, flowStepOf } from "@/lib/staffStore";
import { Camera, PenLine, FileSignature, ScanLine, Package, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function StaffTaskDetail() {
  const { code } = useParams();
  const nav = useNavigate();
  const [task, setTask] = useState<StaffTask | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const t = loadTasks().find((x) => x.code === code) ?? null;
    setTask(t);
    setNote(t?.note ?? "");
  }, [code]);

  function update(mutator: (t: StaffTask) => StaffTask) {
    if (!task) return;
    const all = loadTasks();
    const next = all.map((x) => (x.code === task.code ? mutator({ ...x }) : x));
    saveTasks(next);
    setTask(next.find((x) => x.code === task.code) ?? null);
  }

  if (!task) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Không tìm thấy task
        <div className="mt-4"><Button variant="outline" onClick={() => nav("/app/tasks")}>Quay lại</Button></div>
      </div>
    );
  }

  const pct = taskProgress(task);
  const allDone = task.steps.every((s) => s.status === "done");

  const start = () => update((t) => ({ ...t, status: "in_progress" }));
  const pause = () => update((t) => ({ ...t, status: "paused" }));
  const complete = () => {
    update((t) => ({ ...t, status: "done", steps: t.steps.map(s=>({...s, status:"done"})) }));
    toast({ title: "Đã hoàn thành task", description: task.code });
    setTimeout(() => nav("/app/tasks"), 500);
  };
  const toggleStep = (id: string) =>
    update((t) => ({
      ...t,
      steps: t.steps.map((s) =>
        s.id === id ? { ...s, status: s.status === "done" ? "pending" : "done", qtyDone: s.qtyRequired ?? s.qtyDone } : s
      ),
    }));
  const changeQty = (id: string, delta: number) =>
    update((t) => ({
      ...t,
      steps: t.steps.map((s) => {
        if (s.id !== id) return s;
        const req = s.qtyRequired ?? 0;
        const done = Math.max(0, Math.min(req, (s.qtyDone ?? 0) + delta));
        return { ...s, qtyDone: done, status: done >= req && req > 0 ? "done" : "pending" };
      }),
    }));
  const saveNote = () => {
    update((t) => ({ ...t, note }));
    toast({ title: "Đã lưu ghi chú" });
  };

  const flowPos = flowStepOf(task);
  const evidenceIcon = (name: string) => {
    if (name.includes("Chữ ký")) return PenLine;
    if (name.includes("BBBG") || name.includes("Phiếu") || name.includes("File")) return FileSignature;
    if (name.includes("Scan")) return ScanLine;
    if (name.includes("Tem")) return Package;
    if (name.includes("Ảnh")) return Camera;
    return FileText;
  };

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-10 bg-background border-b px-3 py-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => nav("/app/tasks")}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground font-mono">{task.code} · {task.templateCode}</div>
          <div className="text-sm font-semibold truncate">{task.title}</div>
        </div>
        <Badge variant="outline">{task.flow === "outbound" ? "Xuất kho" : "Nhập kho"}</Badge>
      </header>

      <div className="px-4 pt-4 space-y-4">
        <Card className="p-4">
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="secondary" className="text-[10px]">{FLOW_LABEL[task.flowCode]}</Badge>
            <Badge variant="outline" className="text-[10px]">Bước {flowPos.index}/{flowPos.total} luồng</Badge>
            <Badge variant="outline" className="text-[10px]">{task.kind}</Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-muted-foreground">Order</div>
            <div className="font-mono text-sm">{task.orderCode}</div>
          </div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <div className="text-xs text-muted-foreground">Template</div>
            <div className="font-mono text-xs">{task.templateCode} · {task.templateName}</div>
          </div>
          {task.location && (
            <div className="flex items-center justify-between mb-2 text-sm">
              <div className="text-xs text-muted-foreground">Vị trí</div>
              <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{task.location}</div>
            </div>
          )}
          {task.dueAt && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-xs text-muted-foreground">Hạn</div>
              <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(task.dueAt).toLocaleString("vi-VN")}</div>
            </div>
          )}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Tiến độ</span>
              <span className="font-semibold">{pct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </Card>

        {task.evidenceRequired && task.evidenceRequired.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">Chứng cứ cần thu thập</div>
            <Card className="p-3 space-y-2">
              {task.evidenceRequired.map((ev, idx) => {
                const Icon = evidenceIcon(ev);
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">{ev}</div>
                    <Button size="sm" variant="outline" className="h-7 text-xs" disabled={task.status === "done"}>
                      {ev.includes("Chữ ký") ? "Ký" : ev.includes("Scan") ? "Quét" : "Chụp / tải lên"}
                    </Button>
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">Các bước thực hiện</div>
          <div className="space-y-2">
            {task.steps.map((s, i) => (
              <Card key={s.id} className={s.status === "done" ? "p-3 bg-muted/40" : "p-3"}>
                <div className="flex gap-3">
                  <button onClick={() => toggleStep(s.id)} className="shrink-0 mt-0.5" disabled={task.status === "done"}>
                    {s.status === "done" ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={"text-sm font-medium " + (s.status === "done" ? "line-through text-muted-foreground" : "")}>
                      {i + 1}. {s.title}
                    </div>
                    {s.detail && <div className="text-xs text-muted-foreground mt-0.5">{s.detail}</div>}
                    {s.sku && (
                      <div className="mt-1 flex gap-2 text-[11px]">
                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{s.sku}</span>
                        {s.location && <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{s.location}</span>}
                      </div>
                    )}
                    {typeof s.qtyRequired === "number" && (
                      <div className="mt-2 flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => changeQty(s.id, -1)} disabled={task.status === "done"}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex-1 text-center text-sm">
                          <span className="font-semibold">{s.qtyDone ?? 0}</span>
                          <span className="text-muted-foreground"> / {s.qtyRequired}</span>
                        </div>
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => changeQty(s.id, 1)} disabled={task.status === "done"}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">Ghi chú / sự cố</div>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú bất thường trong quá trình xử lý..." rows={3} />
          <Button variant="outline" size="sm" className="mt-2" onClick={saveNote}>Lưu ghi chú</Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-background border-t p-3 flex gap-2">
        {task.status === "assigned" && (
          <Button className="flex-1" onClick={start}><Play className="h-4 w-4 mr-1" /> Bắt đầu</Button>
        )}
        {task.status === "in_progress" && (
          <>
            <Button variant="outline" onClick={pause}><Pause className="h-4 w-4 mr-1" /> Tạm dừng</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" disabled={!allDone}>
                  <Check className="h-4 w-4 mr-1" /> Hoàn thành {!allDone && `(${task.steps.filter(s=>s.status==='done').length}/${task.steps.length})`}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận hoàn thành task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Task {task.code} sẽ được đánh dấu hoàn thành và cập nhật lên hệ thống.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Huỷ</AlertDialogCancel>
                  <AlertDialogAction onClick={complete}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        {task.status === "paused" && (
          <Button className="flex-1" onClick={start}><Play className="h-4 w-4 mr-1" /> Tiếp tục</Button>
        )}
        {task.status === "done" && (
          <div className="flex-1 text-center text-sm text-emerald-700 flex items-center justify-center gap-1 py-2">
            <CheckCircle2 className="h-4 w-4" /> Task đã hoàn thành
          </div>
        )}
        {task.note && task.status !== "done" && (
          <div className="hidden"><AlertCircle /></div>
        )}
      </div>
    </div>
  );
}