import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { loadLeaves, saveLeaves, LeaveRequest, LeaveStatus, loadTasks, hasActiveTask } from "@/lib/staffStore";
import { toast } from "@/hooks/use-toast";

const statusMeta: Record<LeaveStatus, { text: string; cls: string; icon: any }> = {
  pending: { text: "Chờ duyệt", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  approved: { text: "Đã duyệt", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  rejected: { text: "Từ chối", cls: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

const typeLabel = { annual: "Nghỉ phép năm", sick: "Nghỉ ốm", unpaid: "Nghỉ không lương", other: "Khác" };

export default function StaffLeave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<LeaveRequest["type"]>("annual");
  const [reason, setReason] = useState("");

  useEffect(() => {
    setLeaves(loadLeaves());
    setBlocked(hasActiveTask(loadTasks()));
  }, []);

  const submit = () => {
    if (!from || !to || !reason.trim()) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập đầy đủ.", variant: "destructive" });
      return;
    }
    const req: LeaveRequest = {
      id: `LV-${Date.now()}`,
      from, to, type, reason: reason.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const next = [req, ...leaves];
    saveLeaves(next);
    setLeaves(next);
    setFrom(""); setTo(""); setReason(""); setType("annual");
    toast({ title: "Đã gửi đơn nghỉ phép", description: "Đơn của bạn đang chờ duyệt." });
  };

  return (
    <div>
      <header className="px-4 pt-6 pb-4 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6" />
          <h1 className="text-lg font-bold">Đăng ký nghỉ phép</h1>
        </div>
        <div className="text-xs opacity-80 mt-1">Gửi đơn xin nghỉ và theo dõi trạng thái</div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        {blocked ? (
          <Card className="p-4 border-amber-300 bg-amber-50">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-900">Không thể gửi đơn</div>
                <div className="text-xs text-amber-800 mt-1">
                  Bạn đang có task ở trạng thái <b>đang thực hiện</b>. Vui lòng hoàn thành hoặc bàn giao task trước khi đăng ký nghỉ phép.
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Từ ngày</Label>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Đến ngày</Label>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Loại nghỉ</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Nghỉ phép năm</SelectItem>
                  <SelectItem value="sick">Nghỉ ốm</SelectItem>
                  <SelectItem value="unpaid">Nghỉ không lương</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Lý do</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Nhập lý do..." />
            </div>
            <Button className="w-full" onClick={submit}>Gửi đơn</Button>
          </Card>
        )}

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">Lịch sử ({leaves.length})</div>
          <div className="space-y-2">
            {leaves.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Chưa có đơn nào</div>
            ) : leaves.map((l) => {
              const M = statusMeta[l.status];
              return (
                <Card key={l.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{l.id}</span>
                        <Badge variant="outline" className={M.cls}>
                          <M.icon className="h-3 w-3 mr-1" />{M.text}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium">{typeLabel[l.type]}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {new Date(l.from).toLocaleDateString("vi-VN")} → {new Date(l.to).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-xs mt-1 line-clamp-2">{l.reason}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}