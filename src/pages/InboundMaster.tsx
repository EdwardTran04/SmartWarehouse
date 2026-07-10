import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { IBadge, KCard, SLAPill, Section, IButton, PageHeader, RuleNote, Drawer, ConfirmModal } from "@/components/inbound/bits";
import {
  employees, positions, taskCatalog as taskCatalogSeed, mappings, orders, orderTasks,
  getEmployee, getPosition, FLOW_TASK_ORDER, getTaskOrderInFlow,
} from "@/data/inbound";
import type { TaskCatalog as TTaskCatalog } from "@/data/inbound";
const taskCatalog = taskCatalogSeed;
import {
  Search, Filter, Plus, Download, Eye, Edit3, Users, Briefcase, ListChecks, Network,
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, FileSignature, Boxes, MapPin,
  ScanLine, Camera, Bot, RefreshCw, Send, Printer, Package, Truck, Trash2, Save, X,
} from "lucide-react";

const SCard = ({ children, title, actions, className = "" }: any) => (
  <Section title={title} actions={actions} className={className}>{children}</Section>
);

/* ═══════════════════════════════════════════════════════════════════
   MASTER DATA
   ═══════════════════════════════════════════════════════════════════ */

export function InboundEmployees() {
  const [sel, setSel] = useState<string | null>(employees[0].code);
  const [q, setQ] = useState("");
  const filtered = employees.filter((e) => !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.code.includes(q));
  const cur = employees.find((e) => e.code === sel) || employees[0];
  const empMappings = mappings.filter((m) => m.empCode === cur.code);
  const empTasks = taskCatalog.filter((t) => empMappings.some((m) => t.allowedPositions.includes(m.positionCode)));
  // Quy ước: kho chính = defaultWh; các kho khác trong allowedWhs là kho phụ
  const primaryWh = (e: typeof cur) => e.defaultWh;
  const secondaryWhs = (e: typeof cur) => e.allowedWhs.filter((w) => w !== e.defaultWh);

  return (
    <AppShell breadcrumb={[{ label: "Master Data" }, { label: "Nhân sự kho" }]}>
      <PageHeader title="Danh mục nhân sự kho" subtitle="Đồng bộ từ SAP/HR · Một NS có thể làm việc tại 1 hoặc nhiều kho – quy định rõ kho chính / kho phụ"
        actions={<><IButton icon={RefreshCw}>Đồng bộ SAP/HR</IButton><IButton icon={Download}>Export</IButton></>} />

      <div className="grid grid-cols-12 gap-4">
        <Section title={`Nhân sự (${filtered.length})`} className="col-span-12 lg:col-span-5"
          actions={<div className="relative"><Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên/mã..." className="h-8 w-48 pl-7 pr-3 rounded border border-input text-xs" /></div>}>
          <div className="space-y-1.5 max-h-[640px] overflow-y-auto">
            {filtered.map((e) => (
              <button key={e.code} onClick={() => setSel(e.code)} className={`w-full text-left p-3 rounded-lg border ${sel === e.code ? "border-brand bg-brand/5" : "border-border hover:bg-muted/40"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-navy text-sm">{e.name}</div>
                    <div className="text-[11px] text-muted-foreground">{e.code} · {e.titleSap} · {e.dept}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {e.active ? <IBadge>OK</IBadge> : <IBadge>Inactive</IBadge>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${e.current === "Rảnh" ? "bg-success/10 text-success" : e.current === "Bận" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{e.current}</span>
                  </div>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-semibold" title="Kho chính">★ {primaryWh(e)}</span>
                  {secondaryWhs(e).map((w) => <span key={w} className="px-1.5 py-0.5 rounded bg-info/10 text-info text-[10px] font-semibold" title="Kho phụ">{w}</span>)}
                  <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">Ca {e.shift}</span>
                </div>
              </button>
            ))}
          </div>
        </Section>

        <div className="col-span-12 lg:col-span-7 space-y-4">
          <SCard title={`Hồ sơ – ${cur.name}`} actions={<><IBadge>{cur.titleSap}</IBadge><IButton size="sm" icon={Edit3}>Sửa thông tin vận hành</IButton></>}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {[
                ["Mã NV (SAP)", cur.code, true], ["Họ tên", cur.name, true], ["Đơn vị", cur.dept, true],
                ["Chức danh SAP", cur.titleSap, true], ["SĐT", cur.phone, true], ["Email", cur.email, true],
                ["Trạng thái HR", cur.active ? "Active" : "Inactive", true],
                ["Kho chính", <span className="inline-flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-semibold">★ {primaryWh(cur)}</span></span>, false],
                ["Kho phụ", secondaryWhs(cur).length ? (<span className="inline-flex flex-wrap gap-1">{secondaryWhs(cur).map((w) => <span key={w} className="px-1.5 py-0.5 rounded bg-info/10 text-info text-[10px] font-semibold">{w}</span>)}</span>) : <span className="text-muted-foreground italic">Không có</span>, false],
                ["Ca làm việc", `Ca ${cur.shift}`, false], ["Trạng thái hiện tại", cur.current, false],
                ["Số task đang nhận", cur.load.toString(), false],
              ].map(([k, v, locked]: any) => (
                <div key={k}>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">{k} {locked && <span className="text-[10px] px-1 rounded bg-muted text-muted-foreground">🔒 SAP</span>}</div>
                  <div className="font-medium text-navy">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold text-navy mb-1.5">Năng lực / Chứng chỉ</div>
              <div className="flex flex-wrap gap-1.5">
                {cur.certs.map((c) => <span key={c} className="px-2 py-1 rounded-md bg-brand/10 text-brand text-xs font-medium">{c}</span>)}
                {cur.certs.length === 0 && <span className="text-xs text-muted-foreground italic">Chưa có chứng chỉ</span>}
                <button className="px-2 py-1 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:border-brand hover:text-brand">+ Thêm chứng chỉ</button>
              </div>
            </div>
          </SCard>

          <SCard title="Mapping nhân sự – kho – vị trí" actions={<IButton size="sm" icon={Plus}>Thêm mapping</IButton>}>
            <table className="w-full text-xs">
              <thead><tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 font-medium">Kho</th><th className="py-2 font-medium">Vị trí</th>
                <th className="py-2 font-medium">Vai trò</th><th className="py-2 font-medium">Hiệu lực</th>
                <th className="py-2 font-medium">Trạng thái</th>
              </tr></thead>
              <tbody>
                {empMappings.map((m) => (
                  <tr key={m.id} className="border-b border-border/60">
                    <td className="py-2 font-medium">{m.warehouse}</td>
                    <td className="py-2">{m.positionName} <span className="text-[10px] text-muted-foreground">({m.positionCode})</span></td>
                    <td className="py-2"><IBadge>{m.role}</IBadge></td>
                    <td className="py-2 text-muted-foreground">{m.from}{m.to ? ` → ${m.to}` : " – nay"}</td>
                    <td className="py-2">{m.active ? <IBadge>Active</IBadge> : <IBadge>Hết hạn</IBadge>}</td>
                  </tr>
                ))}
                {empMappings.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground text-xs">Chưa có mapping nào</td></tr>}
              </tbody>
            </table>
          </SCard>

          <SCard title={`Task được phép thực hiện (${empTasks.length})`}>
            <div className="grid grid-cols-2 gap-2">
              {empTasks.map((t) => (
                <div key={t.code} className="p-2 rounded border border-border bg-muted/30 text-xs">
                  <div className="font-semibold text-navy">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t.code} · {t.kind} · KPI {t.kpiMin}p</div>
                </div>
              ))}
            </div>
          </SCard>

          <RuleNote>
            <li>Trường gốc từ SAP/HR (🔒) không cho sửa trực tiếp tại WMS.</li>
            <li>Một NS có thể làm việc tại <b>1 hoặc nhiều kho</b>: <span className="px-1 rounded bg-brand/10 text-brand">★ Kho chính</span> = kho mặc định (defaultWh), các kho còn lại là <span className="px-1 rounded bg-info/10 text-info">Kho phụ</span> – chỉ nhận task khi được điều phối hỗ trợ.</li>
            <li>AI điều phối ưu tiên giao task tại kho chính; khi quá tải mới đề xuất NS tại kho phụ.</li>
            <li>Khi đồng bộ SAP, NS bị Inactive sẽ tự động dừng nhận task mới.</li>
          </RuleNote>
        </div>
      </div>
    </AppShell>
  );
}

/* ─────────── Positions ─────────── */
export function InboundPositions() {
  return (
    <AppShell breadcrumb={[{ label: "Master Data" }, { label: "Chức danh / Nhiệm vụ" }]}>
      <PageHeader title="Danh mục chức danh / nhiệm vụ" subtitle="Định nghĩa chức danh – nhiệm vụ trong kho và task được phép thực hiện"
        actions={<IButton variant="brand" icon={Plus}>Tạo chức danh mới</IButton>} />


      <Section title={`Danh sách vị trí (${positions.length})`}>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Mã</th>
            <th className="px-3 py-2 text-left font-medium">Tên vị trí</th>
            <th className="px-3 py-2 text-left font-medium">Mô tả</th>
            <th className="px-3 py-2 text-left font-medium">Kho áp dụng</th>
            <th className="px-3 py-2 text-left font-medium">Chứng chỉ yêu cầu</th>
            <th className="px-3 py-2 text-left font-medium">Task được phép</th>
            <th className="px-3 py-2 text-left font-medium">Hiệu lực</th>
            <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr></thead>
          <tbody>
            {positions.map((p) => {
              const tasks = taskCatalog.filter((t) => t.allowedPositions.includes(p.code));
              return (
                <tr key={p.code} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-3 py-2 font-semibold text-brand">{p.code}</td>
                  <td className="px-3 py-2 font-medium text-navy">{p.name}</td>
                  <td className="px-3 py-2 text-muted-foreground max-w-[260px]">{p.desc}</td>
                  <td className="px-3 py-2"><div className="flex flex-wrap gap-1">{p.warehouses.map((w) => <span key={w} className="px-1.5 py-0.5 rounded bg-info/10 text-info text-[10px] font-semibold">{w}</span>)}</div></td>
                  <td className="px-3 py-2"><div className="flex flex-wrap gap-1">{p.certsRequired.length === 0 ? <span className="text-[10px] text-muted-foreground">—</span> : p.certsRequired.map((c) => <span key={c} className="px-1.5 py-0.5 rounded bg-brand/10 text-brand text-[10px]">{c}</span>)}</div></td>
                  <td className="px-3 py-2 font-medium">{tasks.length} task</td>
                  <td className="px-3 py-2 text-muted-foreground text-[11px]">{p.effective}</td>
                  <td className="px-3 py-2">{p.active ? <IBadge>OK</IBadge> : <IBadge>Inactive</IBadge>}</td>
                  <td className="px-3 py-2 text-right"><IButton size="sm" icon={Edit3}>Sửa</IButton></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <RuleNote>
        <li>Mỗi vị trí gắn với 1-n task được phép thực hiện (qua catalog task).</li>
        <li>Vị trí Inactive sẽ không xuất hiện trong mapping nhân sự mới.</li>
        <li>Vị trí yêu cầu chứng chỉ → chỉ nhân sự có chứng chỉ tương ứng mới có thể map.</li>
      </RuleNote>
    </AppShell>
  );
}

/* ─────────── Task Catalog (gộp Nhập kho + Xuất kho) ─────────── */
const PAGE_SIZE = 10;
const FLOW_LABEL: Record<string, string> = {
  "INB-NCC": "Nhập kho từ Nhà cung cấp",
  "INB-TRF": "Nhập điều chuyển nội bộ",
  "INB-OTH": "Nhập khác (thu hồi / điều chỉnh)",
  "OUT-VC": "Xuất kho vận chuyển",
  "OUT-OTH": "Xuất kho khác",
};
export function InboundTaskCatalog() {
  const [rows, setRows] = useState<TTaskCatalog[]>(() => taskCatalog.map((t) => ({ ...t, flows: [...t.flows], allowedPositions: [...t.allowedPositions], dependsOn: [...t.dependsOn], evidence: [...t.evidence] })));
  const [open, setOpen] = useState<string | null>(null);
  const [tab, setTab] = useState<"Tất cả" | "Nhập kho" | "Xuất kho">("Tất cả");
  const [flowFilter, setFlowFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [aiAutoLead, setAiAutoLead] = useState<boolean>(true);
  const [editing, setEditing] = useState<TTaskCatalog | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  // KPI / Lead time override state — quản trị viên có thể cấu hình tại bảng
  const [kpiOverride, setKpiOverride] = useState<Record<string, number>>({});
  const [leadOverride, setLeadOverride] = useState<Record<string, number>>({});
  const [modeOverride, setModeOverride] = useState<Record<string, "Manual" | "AI">>({});
  const getKpi = (t: TTaskCatalog) => kpiOverride[t.code] ?? t.kpiMin;
  const getLead = (t: TTaskCatalog) => leadOverride[t.code] ?? t.leadTimeMin;
  const getMode = (t: TTaskCatalog): "Manual" | "AI" => modeOverride[t.code] ?? (t.leadTimeMode || "Manual");
  const cur = rows.find((t) => t.code === open);
  const repOrder = (code: string, flows: string[]) => {
    for (const f of flows) {
      const o = getTaskOrderInFlow(code, f);
      if (o !== 999) return o;
    }
    return 999;
  };
  const baseList = rows.filter((t) =>
    (tab === "Tất cả" || t.module === tab) &&
    (!flowFilter || t.flows.includes(flowFilter as any))
  );
  const list = flowFilter
    ? [...baseList].sort((a, b) => getTaskOrderInFlow(a.code, flowFilter) - getTaskOrderInFlow(b.code, flowFilter))
    : [...baseList].sort((a, b) => {
        if (a.module !== b.module) return a.module === "Nhập kho" ? -1 : 1;
        return repOrder(a.code, a.flows) - repOrder(b.code, b.flows);
      });
  const inCnt = rows.filter((t) => t.module === "Nhập kho").length;
  const outCnt = rows.filter((t) => t.module === "Xuất kho").length;
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const curPage = Math.min(page, totalPages);
  const paged = list.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);
  const switchTab = (t: typeof tab) => { setTab(t); setPage(1); };
  const flowOptions = Object.keys(FLOW_LABEL);

  const openCreate = () => {
    setIsNew(true);
    setEditing({
      code: "", name: "", module: "Nhập kho", flows: [], kind: "Human",
      desc: "", trigger: "", allowedPositions: [],
      kpiMin: 10, leadTimeMin: 12, leadTimeMode: "Manual",
      dependsOn: [], evidence: [], active: true,
    });
  };
  const openEdit = (t: TTaskCatalog) => { setIsNew(false); setEditing({ ...t, flows: [...t.flows], allowedPositions: [...t.allowedPositions], dependsOn: [...t.dependsOn], evidence: [...t.evidence] }); };
  const saveEdit = () => {
    if (!editing) return;
    const code = editing.code.trim().toUpperCase();
    if (!code || !editing.name.trim()) { alert("Mã và Tên task là bắt buộc"); return; }
    if (isNew && rows.some((r) => r.code === code)) { alert("Mã task đã tồn tại"); return; }
    const clean: TTaskCatalog = { ...editing, code };
    setRows((prev) => isNew ? [...prev, clean] : prev.map((r) => r.code === clean.code ? clean : r));
    setEditing(null); setIsNew(false);
  };
  const doDelete = (code: string) => { setRows((prev) => prev.filter((r) => r.code !== code)); setConfirmDel(null); };

  return (
    <AppShell breadcrumb={[{ label: "Master Data" }, { label: "Cấu hình task - quy trình" }]}>
      <PageHeader title="Cấu hình task - quy trình" subtitle="Quản lý danh mục task của tất cả các quy trình trên hệ thống (BPMN 2026)"
        actions={<><IButton icon={Download}>Export</IButton><IButton variant="brand" icon={Plus} onClick={openCreate}>Tạo task type</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <KCard label="Tổng task type" value={rows.length} tone="brand" icon={ListChecks} />
        <KCard label="Module Nhập kho" value={inCnt} tone="info" icon={Package} />
        <KCard label="Module Xuất kho" value={outCnt} tone="warning" icon={Truck} />
        <KCard label="Human" value={rows.filter((t) => t.kind === "Human").length} tone="success" />
        <KCard label="API / AI / Approval" value={rows.filter((t) => ["API","AI","Approval"].includes(t.kind)).length} tone="brand" />
      </div>

      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <div className="flex gap-1.5">
          {(["Tất cả","Nhập kho","Xuất kho"] as const).map((t) => (
            <button key={t} onClick={() => switchTab(t)} className={`px-3 py-1.5 rounded-md text-xs font-medium border ${tab === t ? "bg-brand text-white border-brand" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Quy trình:</span>
          <select value={flowFilter} onChange={(e) => { setFlowFilter(e.target.value); setPage(1); }} className="h-8 px-2 rounded border border-input text-xs bg-card">
            <option value="">Tất cả quy trình</option>
            {flowOptions.map((f) => <option key={f} value={f}>{FLOW_LABEL[f]}</option>)}
          </select>
        </div>
      </div>

      <div className={`mb-3 rounded-lg border p-3 flex items-start gap-3 ${aiAutoLead ? "border-warning/40 bg-warning/5" : "border-border bg-muted/30"}`}>
        <Bot className={`w-5 h-5 mt-0.5 ${aiAutoLead ? "text-warning" : "text-muted-foreground"}`} />
        <div className="flex-1 text-xs">
          <div className="font-semibold text-navy mb-0.5">
            Lead time {aiAutoLead ? "tự động bằng AI" : "lấy theo cấu hình thủ công"}
          </div>
          <div className="text-muted-foreground">
            Giai đoạn đầu, quản trị viên cấu hình thủ công <b>KPI (thời gian chuẩn)</b> và <b>Lead time</b> cho từng task (vd: bốc dỡ 45 phút).
            Khi bật AI, hệ thống sẽ dựa trên dữ liệu thực tế (khối lượng, trọng lượng từng đơn) để tự tính <b>Lead time</b> tham chiếu cho từng lệnh nhập/xuất, làm tiêu chuẩn đánh giá.
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs whitespace-nowrap">
          <input type="checkbox" checked={aiAutoLead} onChange={(e) => setAiAutoLead(e.target.checked)} />
          AI tự tính Lead time
        </label>
      </div>

      <div className="mb-3 rounded-lg border border-brand/40 bg-brand/5 p-3">
        <div className="flex items-start gap-3">
          <Network className="w-5 h-5 mt-0.5 text-brand" />
          <div className="flex-1 text-xs">
            <div className="font-semibold text-navy mb-1">
              Thuật toán giao việc tự động (Real-time / Cuốn chiếu)
            </div>
            <div className="text-muted-foreground mb-2">
              Nhân viên chỉ nhìn thấy danh sách task theo <b>chức danh được giao</b> của toàn bộ đơn hàng dự kiến trong ngày — <i>chưa có thời gian thực hiện & nhân sự cụ thể</i>.
              Hệ thống AI sẽ <b>gọi tên & giao thời gian</b> cho tác vụ ngay trước mắt theo nguyên tắc cuốn chiếu.
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              <div className="rounded border border-border bg-card p-2">
                <div className="flex items-center gap-1.5 font-semibold text-navy mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" /> ĐK1 — Nhàn rỗi
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Khi nhân viên bấm <b>"Hoàn thành"</b> một tác vụ → tự động đưa vào <b>Danh sách nhàn rỗi</b> chờ giao việc kế tiếp.
                </div>
              </div>
              <div className="rounded border border-border bg-card p-2">
                <div className="flex items-center gap-1.5 font-semibold text-navy mb-1">
                  <ListChecks className="w-3.5 h-3.5 text-info" /> ĐK2 — Tiền đề
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Tác vụ chỉ được giao khi <b>bước phụ thuộc trước</b> (<code>dependsOn</code>) đã hoàn thành.
                </div>
              </div>
              <div className="rounded border border-border bg-card p-2">
                <div className="flex items-center gap-1.5 font-semibold text-navy mb-1">
                  <Bot className="w-3.5 h-3.5 text-warning" /> ĐK3 — Khối lượng phù hợp
                </div>
                <div className="text-[11px] text-muted-foreground">
                  AI tính toán <b>khối lượng / thời gian</b> tác vụ phù hợp với năng lực & tải hiện tại của nhân viên nhàn rỗi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Section title={`Danh sách task type (${list.length}) — ${tab}${flowFilter ? ` · ${FLOW_LABEL[flowFilter]}` : ""}`}>
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-center font-medium">Thứ tự</th>
            <th className="px-3 py-2 text-left font-medium">Mã</th>
            <th className="px-3 py-2 text-left font-medium">Tên task</th>
            <th className="px-3 py-2 text-left font-medium">Quy trình</th>
            <th className="px-3 py-2 text-left font-medium">Luồng áp dụng</th>
            <th className="px-3 py-2 text-left font-medium">Loại</th>
            <th className="px-3 py-2 text-left font-medium">Vị trí được phép</th>
            <th className="px-3 py-2 text-right font-medium">KPI chuẩn (p)</th>
            <th className="px-3 py-2 text-right font-medium">Lead time (p)</th>
            <th className="px-3 py-2 text-left font-medium">Nguồn Lead</th>
            <th className="px-3 py-2 text-left font-medium">Task tiền đề</th>
            <th className="px-3 py-2 text-left font-medium">Evidence</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr></thead>
          <tbody>
            {paged.map((t, idx) => {
              const orderNo = flowFilter
                ? getTaskOrderInFlow(t.code, flowFilter)
                : repOrder(t.code, t.flows);
              const mode = aiAutoLead ? getMode(t) : "Manual";
              return (
              <tr key={t.code} className="border-b border-border/60 hover:bg-muted/30">
                <td className="px-3 py-2 text-center font-bold text-brand">{orderNo === 999 ? "—" : orderNo}</td>
                <td className="px-3 py-2 font-semibold text-brand">{t.code}</td>
                <td className="px-3 py-2 font-medium text-navy">{t.name}</td>
                <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${t.module === "Nhập kho" ? "bg-info/10 text-info" : "bg-warning/10 text-warning"}`}>{t.module}</span></td>
                <td className="px-3 py-2"><div className="flex flex-col gap-1">{t.flows.map((f) => <span key={f} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium w-fit">{FLOW_LABEL[f] || f}</span>)}</div></td>
                <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${t.kind === "Human" ? "bg-info/10 text-info" : t.kind === "API" ? "bg-brand/10 text-brand" : t.kind === "AI" ? "bg-warning/10 text-warning" : t.kind === "Approval" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{t.kind}</span></td>
                <td className="px-3 py-2"><div className="flex flex-wrap gap-1">{t.allowedPositions.length === 0 ? "—" : t.allowedPositions.map((p) => <span key={p} className="px-1.5 py-0.5 rounded bg-muted text-[10px]">{p}</span>)}</div></td>
                <td className="px-3 py-2 text-right">
                  <input type="number" min={0} value={getKpi(t)}
                    onChange={(e) => setKpiOverride({ ...kpiOverride, [t.code]: Number(e.target.value) })}
                    className="w-16 h-7 px-2 text-right rounded border border-input text-xs font-semibold" />
                </td>
                <td className="px-3 py-2 text-right">
                  <input type="number" min={0} value={getLead(t)}
                    disabled={mode === "AI"}
                    onChange={(e) => setLeadOverride({ ...leadOverride, [t.code]: Number(e.target.value) })}
                    className={`w-16 h-7 px-2 text-right rounded border border-input text-xs font-semibold ${mode === "AI" ? "bg-warning/5 text-warning cursor-not-allowed" : ""}`} />
                </td>
                <td className="px-3 py-2">
                  <select value={mode} disabled={!aiAutoLead}
                    onChange={(e) => setModeOverride({ ...modeOverride, [t.code]: e.target.value as "Manual" | "AI" })}
                    className="h-7 px-1.5 rounded border border-input text-[10px] font-semibold disabled:opacity-60">
                    <option value="Manual">Thủ công</option>
                    <option value="AI">AI tự tính</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  {t.dependsOn.length === 0
                    ? <span className="text-[10px] text-muted-foreground italic">— (bắt đầu quy trình)</span>
                    : <div className="flex flex-wrap gap-1">{t.dependsOn.map((d) => {
                        const dep = taskCatalog.find((x) => x.code === d);
                        return <span key={d} title={dep?.name || d} className="px-1.5 py-0.5 rounded bg-info/10 text-info text-[10px] font-semibold">{d}{dep ? ` · ${dep.name}` : ""}</span>;
                      })}</div>}
                </td>
                <td className="px-3 py-2 text-[10px] text-muted-foreground">{t.evidence.join(", ") || "—"}</td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex gap-1">
                    <IButton size="sm" icon={Eye} onClick={() => setOpen(t.code)}>Mở</IButton>
                    <IButton size="sm" icon={Edit3} onClick={() => openEdit(t)}>Sửa</IButton>
                    <button onClick={() => setConfirmDel(t.code)} className="inline-flex items-center gap-1 h-7 px-2 rounded border border-danger/40 text-danger hover:bg-danger/10 text-xs font-medium"><Trash2 className="w-3.5 h-3.5" />Xóa</button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>Hiển thị {(curPage - 1) * PAGE_SIZE + 1}–{Math.min(curPage * PAGE_SIZE, list.length)} / {list.length} task — 10 bản ghi/trang</span>
          <div className="flex gap-1 items-center">
            <button onClick={() => setPage(Math.max(1, curPage - 1))} disabled={curPage === 1} className="px-2 py-1 rounded border border-border disabled:opacity-40">‹ Trước</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded ${p === curPage ? "bg-brand text-white" : "border border-border hover:bg-muted"}`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, curPage + 1))} disabled={curPage === totalPages} className="px-2 py-1 rounded border border-border disabled:opacity-40">Sau ›</button>
          </div>
        </div>
      </Section>

      <RuleNote>
        <li>Thứ tự thực hiện được sắp xếp theo BPMN 2026 trong từng module / quy trình đang lọc.</li>
        <li>Quản lý danh mục task của tất cả các quy trình trên hệ thống: NCC, NCK, Điều chuyển, Xuất vận chuyển, Xuất khác…</li>
        <li>Mỗi vị trí (POS-*) phụ trách 1 hoặc nhiều task — sinh ra Mapping vị trí – task tự động qua trường <code>allowedPositions</code>.</li>
        <li>Cùng một ký hiệu task (T-APR, T-HO, T-SIG, T-PAC, T-WH, T-SCR, T-KPI) dùng chung cho cả nhập và xuất.</li>
        <li><b>KPI chuẩn</b>: thời gian trung bình do quản trị viên cấu hình thủ công (làm chuẩn đánh giá ban đầu).</li>
        <li><b>Lead time</b>: thời gian xử lý thực tế tham chiếu cho từng lệnh — khi bật <i>AI tự tính</i>, hệ thống ước lượng theo khối lượng/trọng lượng từng đơn để làm chuẩn đánh giá vận hành.</li>
        <li><b>Giao việc Real-time (cuốn chiếu)</b>: NV chỉ thấy danh sách task theo chức danh — chưa có giờ & người thực hiện. Hệ thống chỉ "gọi tên" tác vụ ngay trước mắt.</li>
        <li><b>3 điều kiện AI giao việc kế tiếp</b>: (1) NV đang trong <i>Danh sách nhàn rỗi</i> sau khi bấm "Hoàn thành"; (2) Bước tiền đề (<code>dependsOn</code>) đã xong; (3) Khối lượng/thời gian tác vụ phù hợp với NV.</li>
      </RuleNote>

      <Drawer open={!!cur} onClose={() => setOpen(null)} title={cur ? `${cur.code} – ${cur.name}` : ""}>
        {cur && (
          <div className="text-sm space-y-4">
            <div className="rounded-lg border border-border p-3 bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Mô tả</div>
              <div>{cur.desc}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Module", cur.module], ["Loại task", cur.kind],
                ["KPI chuẩn (thủ công)", `${getKpi(cur)} phút`],
                ["Lead time tham chiếu", `${getLead(cur)} phút`],
                ["Nguồn Lead time", aiAutoLead ? (getMode(cur) === "AI" ? "AI tự tính theo khối lượng/trọng lượng đơn" : "Cấu hình thủ công") : "Cấu hình thủ công"],
                ["Luồng áp dụng", cur.flows.map((f) => FLOW_LABEL[f] || f).join(" · ")], ["Điều kiện sinh task", cur.trigger],
                ["Trạng thái", cur.active ? "Active" : "Inactive"],
              ].map(([k, v]) => (
                <div key={k as string}><div className="text-[11px] text-muted-foreground">{k as string}</div><div className="font-medium">{v as string}</div></div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-navy mb-1.5">Vị trí được phép thực hiện</div>
              <div className="flex flex-wrap gap-1.5">{cur.allowedPositions.length === 0 ? <span className="text-xs text-muted-foreground italic">— (Task hệ thống / API)</span> : cur.allowedPositions.map((p) => <span key={p} className="px-2 py-1 rounded bg-brand/10 text-brand text-xs font-medium">{p}</span>)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-navy mb-1.5">Evidence bắt buộc</div>
              <div className="flex flex-wrap gap-1.5">{cur.evidence.length === 0 ? <span className="text-xs text-muted-foreground italic">Không yêu cầu</span> : cur.evidence.map((e) => <span key={e} className="px-2 py-1 rounded bg-warning/10 text-warning text-xs">{e}</span>)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-navy mb-1.5">Task phụ thuộc trước</div>
              <div className="flex flex-wrap gap-1.5">{cur.dependsOn.length === 0 ? <span className="text-xs text-muted-foreground italic">Không có</span> : cur.dependsOn.map((d) => <span key={d} className="px-2 py-1 rounded bg-muted text-xs">{d}</span>)}</div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete confirm */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDel(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md p-5">
            <div className="flex items-center gap-2 text-navy font-semibold mb-2"><AlertTriangle className="w-5 h-5 text-danger" />Xóa cấu hình task</div>
            <div className="text-sm text-muted-foreground mb-4">Bạn có chắc chắn muốn xóa task <b className="text-navy">{confirmDel}</b> khỏi danh mục? Hành động này không thể hoàn tác.</div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDel(null)} className="h-8 px-3 rounded border border-border text-xs">Hủy</button>
              <button onClick={() => doDelete(confirmDel)} className="h-8 px-3 rounded bg-danger text-white text-xs font-semibold inline-flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-lg border border-border shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border sticky top-0 bg-card">
              <div className="font-semibold text-navy">{isNew ? "Tạo cấu hình task mới" : `Sửa cấu hình – ${editing.code}`}</div>
              <button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3 text-xs">
              <label className="flex flex-col gap-1"><span className="text-muted-foreground">Mã task <span className="text-danger">*</span></span>
                <input value={editing.code} disabled={!isNew} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} maxLength={20} placeholder="VD: T-XYZ" className="h-8 px-2 rounded border border-input disabled:bg-muted disabled:text-muted-foreground" /></label>
              <label className="flex flex-col gap-1"><span className="text-muted-foreground">Tên task <span className="text-danger">*</span></span>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} maxLength={100} className="h-8 px-2 rounded border border-input" /></label>
              <label className="flex flex-col gap-1"><span className="text-muted-foreground">Module</span>
                <select value={editing.module} onChange={(e) => setEditing({ ...editing, module: e.target.value as any })} className="h-8 px-2 rounded border border-input">
                  <option value="Nhập kho">Nhập kho</option><option value="Xuất kho">Xuất kho</option>
                </select></label>
              <label className="flex flex-col gap-1"><span className="text-muted-foreground">Loại task</span>
                <select value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value as any })} className="h-8 px-2 rounded border border-input">
                  {["Human","System","API","AI","Approval"].map((k) => <option key={k} value={k}>{k}</option>)}
                </select></label>
              <div className="col-span-2 flex flex-col gap-1"><span className="text-muted-foreground">Luồng áp dụng (tick các quy trình)</span>
                <div className="flex flex-wrap gap-2 p-2 rounded border border-input">
                  {flowOptions.map((f) => (
                    <label key={f} className="inline-flex items-center gap-1 text-[11px]">
                      <input type="checkbox" checked={editing.flows.includes(f as any)} onChange={(e) => setEditing({ ...editing, flows: e.target.checked ? [...editing.flows, f as any] : editing.flows.filter((x) => x !== f) })} />
                      {FLOW_LABEL[f]}
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-1"><span className="text-muted-foreground">Chức danh được phép thực hiện</span>
                <div className="flex flex-wrap gap-2 p-2 rounded border border-input max-h-32 overflow-y-auto">
                  {positions.map((p) => (
                    <label key={p.code} className="inline-flex items-center gap-1 text-[11px]">
                      <input type="checkbox" checked={editing.allowedPositions.includes(p.code)} onChange={(e) => setEditing({ ...editing, allowedPositions: e.target.checked ? [...editing.allowedPositions, p.code] : editing.allowedPositions.filter((x) => x !== p.code) })} />
                      {p.code} – {p.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-1"><span className="text-muted-foreground">Task tiền đề (phải hoàn thành trước)</span>
                <div className="flex flex-wrap gap-2 p-2 rounded border border-input max-h-32 overflow-y-auto">
                  {rows.filter((r) => r.code !== editing.code).map((r) => (
                    <label key={r.code} className="inline-flex items-center gap-1 text-[11px]">
                      <input type="checkbox" checked={editing.dependsOn.includes(r.code)} onChange={(e) => setEditing({ ...editing, dependsOn: e.target.checked ? [...editing.dependsOn, r.code] : editing.dependsOn.filter((x) => x !== r.code) })} />
                      {r.code} · {r.name}
                    </label>
                  ))}
                  {rows.length <= 1 && <span className="text-muted-foreground italic">Không có task khác</span>}
                </div>
              </div>
              <label className="flex flex-col gap-1"><span className="text-muted-foreground">KPI chuẩn (phút)</span>
                <input type="number" min={0} value={editing.kpiMin} onChange={(e) => setEditing({ ...editing, kpiMin: Number(e.target.value) })} className="h-8 px-2 rounded border border-input" /></label>
              <label className="flex flex-col gap-1"><span className="text-muted-foreground">Lead time (phút)</span>
                <input type="number" min={0} value={editing.leadTimeMin} onChange={(e) => setEditing({ ...editing, leadTimeMin: Number(e.target.value) })} className="h-8 px-2 rounded border border-input" /></label>
              <label className="flex flex-col gap-1"><span className="text-muted-foreground">Nguồn Lead time</span>
                <select value={editing.leadTimeMode || "Manual"} onChange={(e) => setEditing({ ...editing, leadTimeMode: e.target.value as any })} className="h-8 px-2 rounded border border-input">
                  <option value="Manual">Thủ công</option><option value="AI">AI tự tính</option>
                </select></label>
              <label className="flex flex-col gap-1"><span className="text-muted-foreground">Trạng thái</span>
                <select value={editing.active ? "1" : "0"} onChange={(e) => setEditing({ ...editing, active: e.target.value === "1" })} className="h-8 px-2 rounded border border-input">
                  <option value="1">Active</option><option value="0">Inactive</option>
                </select></label>
              <label className="col-span-2 flex flex-col gap-1"><span className="text-muted-foreground">Điều kiện sinh task (trigger)</span>
                <input value={editing.trigger} onChange={(e) => setEditing({ ...editing, trigger: e.target.value })} maxLength={200} className="h-8 px-2 rounded border border-input" /></label>
              <label className="col-span-2 flex flex-col gap-1"><span className="text-muted-foreground">Evidence bắt buộc (phân tách bằng dấu phẩy)</span>
                <input value={editing.evidence.join(", ")} onChange={(e) => setEditing({ ...editing, evidence: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="h-8 px-2 rounded border border-input" placeholder="VD: Ảnh, Chữ ký, BBBG" /></label>
              <label className="col-span-2 flex flex-col gap-1"><span className="text-muted-foreground">Mô tả</span>
                <textarea value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} maxLength={500} rows={3} className="px-2 py-1 rounded border border-input" /></label>
            </div>
            <div className="px-5 py-3 border-t border-border flex justify-end gap-2 sticky bottom-0 bg-card">
              <button onClick={() => setEditing(null)} className="h-8 px-3 rounded border border-border text-xs">Hủy</button>
              <button onClick={saveEdit} className="h-8 px-3 rounded bg-brand text-white text-xs font-semibold inline-flex items-center gap-1"><Save className="w-3.5 h-3.5" />{isNew ? "Tạo" : "Lưu"}</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

/* ─────────── Mapping: NS–Kho–Vị trí + Vị trí–Task ─────────── */
type PosTaskRow = { id: string; positionCode: string; taskCode: string; primary: boolean; note: string; active: boolean };

function buildPosTaskRows(): PosTaskRow[] {
  let id = 1;
  const rows: PosTaskRow[] = [];
  taskCatalog.forEach((t) => t.allowedPositions.forEach((p, idx) =>
    rows.push({ id: `PT-${String(id++).padStart(3, "0")}`, positionCode: p, taskCode: t.code, primary: idx === 0, note: "", active: true })
  ));
  return rows;
}

export function InboundMapping() {
  const [ptRows, setPtRows] = useState<PosTaskRow[]>(() => buildPosTaskRows());
  const [editPT, setEditPT] = useState<PosTaskRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [posFilter, setPosFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");

  const filteredPT = ptRows.filter((r) => (!posFilter || r.positionCode === posFilter) && (!taskFilter || r.taskCode === taskFilter));

  const savePT = (r: PosTaskRow) => {
    setPtRows((prev) => {
      const exists = prev.find((x) => x.id === r.id);
      if (exists) return prev.map((x) => (x.id === r.id ? r : x));
      return [...prev, { ...r, id: `PT-${String(prev.length + 1).padStart(3, "0")}` }];
    });
    setEditPT(null);
    setCreating(false);
  };
  const removePT = (id: string) => setPtRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <AppShell breadcrumb={[{ label: "Master Data" }, { label: "Cấu hình Vị trí – Task" }]}>
      <PageHeader title="Cấu hình Vị trí – Task" subtitle="Cấu hình các vị trí làm việc được phép thực hiện từng loại task trong hệ thống"
        actions={<><IButton icon={Download}>Export</IButton>
          <IButton variant="brand" icon={Plus} onClick={() => { setEditPT({ id: "", positionCode: positions[0].code, taskCode: taskCatalog[0].code, primary: true, note: "", active: true }); setCreating(true); }}>Thêm cấu hình</IButton>
        </>} />

      <>
        <Section title={`Mapping vị trí – task (${filteredPT.length})`}
          actions={<div className="flex gap-2">
            <select value={posFilter} onChange={(e) => setPosFilter(e.target.value)} className="h-8 px-2 rounded border border-input text-xs">
              <option value="">Tất cả vị trí</option>
              {positions.map((p) => <option key={p.code} value={p.code}>{p.code} – {p.name}</option>)}
            </select>
            <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)} className="h-8 px-2 rounded border border-input text-xs">
              <option value="">Tất cả task</option>
              {taskCatalog.map((t) => <option key={t.code} value={t.code}>{t.code} – {t.name}</option>)}
            </select>
          </div>}>
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2 text-left font-medium">ID</th>
              <th className="px-3 py-2 text-left font-medium">Vị trí</th>
              <th className="px-3 py-2 text-left font-medium">Task</th>
              <th className="px-3 py-2 text-left font-medium">Quy trình</th>
              <th className="px-3 py-2 text-left font-medium">Vai trò</th>
              <th className="px-3 py-2 text-left font-medium">Ghi chú</th>
              <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
              <th className="px-3 py-2 text-right font-medium">Action</th>
            </tr></thead>
            <tbody>
              {filteredPT.map((r) => {
                const pos = positions.find((p) => p.code === r.positionCode);
                const tk = taskCatalog.find((t) => t.code === r.taskCode);
                return (
                  <tr key={r.id} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="px-3 py-2 font-semibold text-brand">{r.id}</td>
                    <td className="px-3 py-2"><div className="font-medium text-navy">{pos?.name || r.positionCode}</div><div className="text-[10px] text-muted-foreground">{r.positionCode}</div></td>
                    <td className="px-3 py-2"><div className="font-medium text-navy">{tk?.name || r.taskCode}</div><div className="text-[10px] text-muted-foreground">{r.taskCode}</div></td>
                    <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tk?.module === "Nhập kho" ? "bg-info/10 text-info" : "bg-warning/10 text-warning"}`}>{tk?.module}</span></td>
                    <td className="px-3 py-2"><IBadge>{r.primary ? "Chính" : "Phụ"}</IBadge></td>
                    <td className="px-3 py-2 text-muted-foreground text-[11px]">{r.note || "—"}</td>
                    <td className="px-3 py-2">{r.active ? <IBadge>Active</IBadge> : <IBadge>Inactive</IBadge>}</td>
                    <td className="px-3 py-2 text-right space-x-1">
                      <IButton size="sm" icon={Edit3} onClick={() => { setEditPT(r); setCreating(false); }}>Sửa</IButton>
                      <button onClick={() => removePT(r.id)} className="px-2 py-1 rounded text-[11px] border border-destructive/30 text-destructive hover:bg-destructive/5">Xóa</button>
                    </td>
                  </tr>
                );
              })}
              {filteredPT.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">Không có mapping</td></tr>}
            </tbody>
          </table>
        </Section>

        <RuleNote>
          <li>Mỗi vị trí có thể phụ trách nhiều task; mỗi task có thể được nhiều vị trí thực hiện.</li>
          <li>Vai trò "Chính": ưu tiên giao việc; "Phụ": chỉ giao khi nhân sự chính không khả dụng.</li>
          <li>Inactive mapping → không xuất hiện trong gợi ý của AI Task Planner.</li>
        </RuleNote>

        <Drawer open={!!editPT} onClose={() => { setEditPT(null); setCreating(false); }} title={creating ? "Tạo mapping vị trí – task" : `Sửa mapping ${editPT?.id || ""}`} width="max-w-lg">
          {editPT && (
            <div className="space-y-3 text-sm">
              <label className="block">
                <div className="text-[11px] text-muted-foreground mb-1">Vị trí</div>
                <select value={editPT.positionCode} onChange={(e) => setEditPT({ ...editPT, positionCode: e.target.value })} className="h-9 w-full px-2 rounded border border-input">
                  {positions.map((p) => <option key={p.code} value={p.code}>{p.code} – {p.name}</option>)}
                </select>
              </label>
              <label className="block">
                <div className="text-[11px] text-muted-foreground mb-1">Task</div>
                <select value={editPT.taskCode} onChange={(e) => setEditPT({ ...editPT, taskCode: e.target.value })} className="h-9 w-full px-2 rounded border border-input">
                  {taskCatalog.map((t) => <option key={t.code} value={t.code}>[{t.module}] {t.code} – {t.name}</option>)}
                </select>
              </label>
              <label className="block">
                <div className="text-[11px] text-muted-foreground mb-1">Vai trò</div>
                <select value={editPT.primary ? "1" : "0"} onChange={(e) => setEditPT({ ...editPT, primary: e.target.value === "1" })} className="h-9 w-full px-2 rounded border border-input">
                  <option value="1">Chính</option><option value="0">Phụ</option>
                </select>
              </label>
              <label className="block">
                <div className="text-[11px] text-muted-foreground mb-1">Ghi chú</div>
                <input value={editPT.note} onChange={(e) => setEditPT({ ...editPT, note: e.target.value })} className="h-9 w-full px-2 rounded border border-input" placeholder="VD: chỉ áp dụng ca S2" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={editPT.active} onChange={(e) => setEditPT({ ...editPT, active: e.target.checked })} />
                Đang hiệu lực
              </label>
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <IButton onClick={() => { setEditPT(null); setCreating(false); }}>Hủy</IButton>
                <IButton variant="brand" onClick={() => savePT(editPT)}>{creating ? "Tạo mapping" : "Lưu thay đổi"}</IButton>
              </div>
            </div>
          )}
        </Drawer>
      </>
    </AppShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE PAGES
   ═══════════════════════════════════════════════════════════════════ */

export function InboundKCS() {
  const kcsOrders = orders.filter((o) => o.hasKCS);
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "KCS" }]}>
      <PageHeader title="Kiểm tra chất lượng KCS" subtitle="Hàng chờ KCS, kết quả KCS theo Order Line, log API4/API5"
        actions={<><IButton icon={RefreshCw}>Đồng bộ KCS</IButton><IButton variant="brand" icon={Send}>Gửi API4</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <KCard label="Chờ gửi KCS" value={3} tone="warning" icon={Send} />
        <KCard label="Đang KCS" value={5} tone="info" icon={ShieldCheck} />
        <KCard label="Đạt" value={18} tone="success" icon={CheckCircle2} />
        <KCard label="Không đạt" value={2} tone="destructive" icon={XCircle} />
        <KCard label="Pending quá hạn" value={1} tone="destructive" icon={AlertTriangle} />
      </div>

      <Section title="Hàng đang KCS theo Order Line">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Order</th>
            <th className="px-3 py-2 text-left font-medium">SKU</th>
            <th className="px-3 py-2 text-left font-medium">Tên hàng</th>
            <th className="px-3 py-2 text-right font-medium">SL gửi KCS</th>
            <th className="px-3 py-2 text-left font-medium">Kết quả</th>
            <th className="px-3 py-2 text-right font-medium">SL đạt</th>
            <th className="px-3 py-2 text-right font-medium">SL không đạt</th>
            <th className="px-3 py-2 text-left font-medium">Mức độ</th>
            <th className="px-3 py-2 text-left font-medium">API4</th>
            <th className="px-3 py-2 text-left font-medium">API5</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr></thead>
          <tbody>
            {kcsOrders.flatMap((o) => o.items.filter((i) => i.kcs !== "—").map((i) => (
              <tr key={`${o.id}-${i.sku}`} className="border-b border-border/60 hover:bg-muted/30">
                <td className="px-3 py-2"><Link to={`/inbound/orders/${o.id}`} className="text-brand font-semibold">{o.id}</Link></td>
                <td className="px-3 py-2 font-medium text-navy">{i.sku}</td>
                <td className="px-3 py-2 max-w-[200px] truncate">{i.name}</td>
                <td className="px-3 py-2 text-right">{i.recvQty}</td>
                <td className="px-3 py-2"><IBadge>{i.kcs}</IBadge></td>
                <td className="px-3 py-2 text-right text-success font-semibold">{i.kcs === "Đạt" ? i.recvQty : i.kcs === "Một phần" ? Math.floor(i.recvQty * 0.7) : 0}</td>
                <td className="px-3 py-2 text-right text-destructive font-semibold">{i.kcs === "Không đạt" ? i.recvQty : i.kcs === "Một phần" ? Math.ceil(i.recvQty * 0.3) : 0}</td>
                <td className="px-3 py-2">{i.kcs === "Không đạt" ? <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-bold">Major</span> : "—"}</td>
                <td className="px-3 py-2"><IBadge>OK</IBadge></td>
                <td className="px-3 py-2">{i.kcs === "Pending" ? <IBadge>Pending</IBadge> : <IBadge>OK</IBadge>}</td>
                <td className="px-3 py-2 text-right"><IButton size="sm" icon={Eye}>Chi tiết</IButton></td>
              </tr>
            )))}
          </tbody>
        </table>
      </Section>

      <RuleNote>
        <li>Chỉ phần hàng đạt KCS mới được thực nhập T-AGR.</li>
        <li>Không đạt: bắt buộc nhập lý do, mức độ (Minor/Major/Critical), bằng chứng.</li>
        <li>Đạt một phần: bắt buộc tách SL đạt / không đạt theo từng line.</li>
        <li>Pending: bắt buộc ngày dự kiến trả kết quả, sinh cảnh báo SLA.</li>
      </RuleNote>
    </AppShell>
  );
}

export function InboundNonCompliant() {
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Hàng không đạt" }]}>
      <PageHeader title="Xử lý hàng không đạt KCS" subtitle="Trả hàng / Cách ly / Chờ quyết định / Nhập ngoại lệ có phê duyệt"
        actions={<IButton variant="brand" icon={Plus}>Tạo phương án xử lý</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KCard label="Tổng hàng không đạt" value={6} tone="destructive" icon={XCircle} />
        <KCard label="Đang chờ quyết định" value={3} tone="warning" />
        <KCard label="Đã trả hàng" value={2} tone="info" />
        <KCard label="Cách ly" value={1} tone="warning" />
      </div>

      <Section title="Danh sách hàng không đạt">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Order</th>
            <th className="px-3 py-2 text-left font-medium">SKU / Tên hàng</th>
            <th className="px-3 py-2 text-right font-medium">SL không đạt</th>
            <th className="px-3 py-2 text-left font-medium">Mức độ</th>
            <th className="px-3 py-2 text-left font-medium">Lý do</th>
            <th className="px-3 py-2 text-left font-medium">Phương án</th>
            <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
            <th className="px-3 py-2 text-left font-medium">Phê duyệt</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr></thead>
          <tbody>
            {[
              { o: "INB-2026-00128", sku: "RRU-4408", name: "Remote Radio Unit 4408", qty: 4, level: "Major", reason: "Vỏ móp, mất tem niêm phong", plan: "Trả hàng", st: "Đang xử lý", appr: "Đã duyệt" },
              { o: "INB-2026-00118", sku: "PWR-48V-30A", name: "Nguồn DC 48V 30A", qty: 6, level: "Minor", reason: "Sai bao bì", plan: "Nhập ngoại lệ", st: "Chờ duyệt", appr: "Chờ duyệt" },
              { o: "INB-2026-00122", sku: "ANT-MIMO-8T", name: "Anten MIMO 8T", qty: 2, level: "Critical", reason: "Hỏng cổng RF", plan: "Cách ly", st: "Đang xử lý", appr: "Đã duyệt" },
            ].map((r) => (
              <tr key={`${r.o}-${r.sku}`} className="border-b border-border/60 hover:bg-muted/30">
                <td className="px-3 py-2"><Link to={`/inbound/orders/${r.o}`} className="text-brand font-semibold">{r.o}</Link></td>
                <td className="px-3 py-2"><div className="font-medium text-navy">{r.sku}</div><div className="text-[10px] text-muted-foreground">{r.name}</div></td>
                <td className="px-3 py-2 text-right font-bold text-destructive">{r.qty}</td>
                <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.level === "Critical" ? "bg-destructive/10 text-destructive" : r.level === "Major" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"}`}>{r.level}</span></td>
                <td className="px-3 py-2 max-w-[200px] text-muted-foreground">{r.reason}</td>
                <td className="px-3 py-2 font-medium">{r.plan}</td>
                <td className="px-3 py-2"><IBadge>{r.st}</IBadge></td>
                <td className="px-3 py-2"><IBadge>{r.appr}</IBadge></td>
                <td className="px-3 py-2 text-right"><IButton size="sm" icon={FileSignature}>BB</IButton></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <RuleNote>
        <li>Nhập ngoại lệ (nhận hàng dù không đạt): bắt buộc phê duyệt từ Giám đốc kho.</li>
        <li>Trả hàng: tự sinh phiếu trả + chứng từ vận chuyển + cập nhật transaction.</li>
        <li>Cách ly: hàng chuyển sang khu cách ly (Khu D), không xuất ra ngoài nếu chưa giải phóng.</li>
        <li>Mọi phương án xử lý phải có biên bản, lưu vào hồ sơ Order.</li>
      </RuleNote>
    </AppShell>
  );
}

export function InboundGR() {
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Thực nhập T-AGR" }]}>
      <PageHeader title="Thực nhập kho – T-AGR" subtitle="Xác nhận SL thực nhập, gửi API6 sang SAP/VERP lấy số phiếu nhập"
        actions={<IButton variant="brand" icon={Send}>Gửi API6 hàng loạt</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <KCard label="Chờ thực nhập" value={3} tone="warning" icon={CheckCircle2} />
        <KCard label="Đang gửi API6" value={2} tone="info" />
        <KCard label="Đã có phiếu nhập" value={12} tone="success" />
        <KCard label="Lỗi API6" value={1} tone="destructive" icon={AlertTriangle} />
        <KCard label="Hôm nay đã GR" value={17} tone="brand" />
      </div>

      <Section title="Order chờ / đang thực nhập">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Order</th>
            <th className="px-3 py-2 text-left font-medium">Nguồn</th>
            <th className="px-3 py-2 text-right font-medium">SL chứng từ</th>
            <th className="px-3 py-2 text-right font-medium">SL thực nhận</th>
            <th className="px-3 py-2 text-right font-medium">SL đạt KCS</th>
            <th className="px-3 py-2 text-right font-medium">SL được nhập</th>
            <th className="px-3 py-2 text-left font-medium">Trạng thái GR</th>
            <th className="px-3 py-2 text-left font-medium">Số phiếu nhập</th>
            <th className="px-3 py-2 text-left font-medium">API6</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr></thead>
          <tbody>
            {orders.filter((o) => ["Ready for GR", "GR Posted", "In Progress"].includes(o.status)).slice(0, 6).map((o) => (
              <tr key={o.id} className="border-b border-border/60">
                <td className="px-3 py-2"><Link to={`/inbound/orders/${o.id}`} className="text-brand font-semibold">{o.id}</Link></td>
                <td className="px-3 py-2 max-w-[180px] truncate">{o.source}</td>
                <td className="px-3 py-2 text-right">{o.qty}</td>
                <td className="px-3 py-2 text-right font-semibold">{o.qty - 2}</td>
                <td className="px-3 py-2 text-right text-success font-semibold">{o.qty - 4}</td>
                <td className="px-3 py-2 text-right text-brand font-bold">{o.qty - 4}</td>
                <td className="px-3 py-2"><IBadge>{o.status}</IBadge></td>
                <td className="px-3 py-2 font-mono text-[11px]">{o.status === "GR Posted" ? "GR-2026-008812" : "—"}</td>
                <td className="px-3 py-2">{o.status === "GR Posted" ? <IBadge>OK</IBadge> : o.id.endsWith("19") ? <IBadge>Error</IBadge> : <IBadge>Pending</IBadge>}</td>
                <td className="px-3 py-2 text-right">
                  {o.status === "GR Posted" ? <IButton size="sm" icon={Eye}>Phiếu</IButton> : <IButton size="sm" variant="brand" icon={Send}>Gửi API6</IButton>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <RuleNote>
        <li>Chỉ cho thực nhập khi hoàn tất kiểm hàng và các task bắt buộc trước đó.</li>
        <li>Order yêu cầu KCS: chỉ thực nhập phần hàng đạt KCS.</li>
        <li>API6 lỗi: Order chuyển trạng thái GR_API_ERROR, cho phép retry.</li>
        <li>Có số phiếu nhập rồi: không cho sửa SL thực nhập (phải đi qua quy trình điều chỉnh).</li>
      </RuleNote>
    </AppShell>
  );
}

export function InboundVOffice() {
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Ký VOffice" }]}>
      <PageHeader title="Trình ký VOffice" subtitle="Quản lý ký phiếu nhập, BBBG trên hệ thống VOffice"
        actions={<IButton variant="brand" icon={Send}>Trình ký hàng loạt</IButton>} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <KCard label="Chờ trình ký" value={3} tone="warning" />
        <KCard label="Đang ký" value={4} tone="info" />
        <KCard label="Đã ký" value={12} tone="success" />
        <KCard label="Từ chối ký" value={1} tone="destructive" />
        <KCard label="Quá hạn ký" value={1} tone="destructive" />
      </div>

      <Section title="Danh sách phiếu trình ký">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
            <th className="px-3 py-2 text-left font-medium">Phiếu nhập</th>
            <th className="px-3 py-2 text-left font-medium">Order</th>
            <th className="px-3 py-2 text-left font-medium">Người trình</th>
            <th className="px-3 py-2 text-left font-medium">Người ký</th>
            <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
            <th className="px-3 py-2 text-left font-medium">Trình lúc</th>
            <th className="px-3 py-2 text-left font-medium">Ký lúc</th>
            <th className="px-3 py-2 text-left font-medium">Lý do từ chối</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr></thead>
          <tbody>
            {[
              { id: "GR-2026-008812", order: "INB-2026-00118", sub: "Trần Văn Kho", signer: "Nguyễn Quản Trị", st: "Đã ký", time: "11:30", signed: "11:48", reason: "" },
              { id: "GR-2026-008813", order: "INB-2026-00129", sub: "Đỗ Minh Khôi", signer: "Giám đốc kho", st: "Từ chối ký", time: "11:35", signed: "12:02", reason: "Sai mã NCC trên phiếu" },
              { id: "GR-2026-008814", order: "INB-2026-00123", sub: "Đỗ Minh Khôi", signer: "Giám đốc kho", st: "Đang ký", time: "12:01", signed: "—", reason: "" },
              { id: "GR-2026-008815", order: "INB-2026-00125", sub: "Trần Văn Kho", signer: "—", st: "Chờ trình ký", time: "—", signed: "—", reason: "" },
            ].map((r) => (
              <tr key={r.id} className="border-b border-border/60">
                <td className="px-3 py-2 font-mono font-semibold text-brand">{r.id}</td>
                <td className="px-3 py-2"><Link to={`/inbound/orders/${r.order}`} className="text-brand">{r.order}</Link></td>
                <td className="px-3 py-2">{r.sub}</td>
                <td className="px-3 py-2">{r.signer}</td>
                <td className="px-3 py-2"><IBadge>{r.st}</IBadge></td>
                <td className="px-3 py-2 text-muted-foreground">{r.time}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.signed}</td>
                <td className="px-3 py-2 text-destructive text-[11px]">{r.reason || "—"}</td>
                <td className="px-3 py-2 text-right">
                  {r.st === "Từ chối ký" ? <IButton size="sm" variant="brand">Trình ký lại</IButton> : <IButton size="sm" icon={FileSignature}>Mở</IButton>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <RuleNote>
        <li>Chỉ trình ký VOffice khi đã có số phiếu nhập từ SAP/VERP (API6 OK).</li>
        <li>Từ chối ký: bắt buộc nhập lý do, Order chuyển "Cần xử lý chứng từ".</li>
        <li>Cho phép trình ký lại sau khi xử lý lý do từ chối.</li>
        <li>Lưu file ký, trạng thái, người ký, thời gian ký trên hồ sơ Order.</li>
      </RuleNote>
    </AppShell>
  );
}

export function InboundPacking() {
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Đóng gói / Tem" }]}>
      <PageHeader title="Đóng gói & gắn tem RFID/Barcode" subtitle="Tạo HU/Pallet/Thùng, AI đề xuất quy cách, in tem"
        actions={<><IButton icon={Bot}>AI đề xuất quy cách</IButton><IButton variant="brand" icon={Printer}>In tem</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <KCard label="Chờ đóng gói" value={5} tone="warning" icon={Boxes} />
        <KCard label="Đang đóng gói" value={2} tone="info" />
        <KCard label="HU đã tạo" value={48} tone="success" />
        <KCard label="Tem in lỗi" value={2} tone="destructive" />
        <KCard label="Hoàn thành hôm nay" value={11} tone="brand" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Section title="Order chờ đóng gói" className="col-span-12 lg:col-span-7">
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2 text-left font-medium">Order</th>
              <th className="px-3 py-2 text-left font-medium">SKU</th>
              <th className="px-3 py-2 text-right font-medium">SL cần đóng</th>
              <th className="px-3 py-2 text-left font-medium">AI đề xuất</th>
              <th className="px-3 py-2 text-right font-medium">HU đã tạo</th>
              <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
            </tr></thead>
            <tbody>
              {[
                { o: "INB-2026-00118", sku: "ANT-5G-32T", qty: 24, ai: "8 HU × 3 bộ – Pallet PLT-EU", made: 8, st: "Hoàn thành" },
                { o: "INB-2026-00118", sku: "BBU-6648", qty: 40, ai: "10 HU × 4 bộ – Pallet PLT-EU", made: 10, st: "Hoàn thành" },
                { o: "INB-2026-00118", sku: "CAB-FO-LC", qty: 198, ai: "4 Thùng gỗ WBX-L × 50 cuộn", made: 2, st: "Đang đóng" },
                { o: "INB-2026-00123", sku: "RRU-4408", qty: 18, ai: "6 HU × 3 bộ – Pallet PLT-VN", made: 0, st: "Chờ" },
                { o: "INB-2026-00129", sku: "FBR-CORE-72", qty: 140, ai: "14 Thùng gỗ WBX-M", made: 0, st: "Chờ" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="px-3 py-2"><Link to={`/inbound/orders/${r.o}`} className="text-brand font-semibold">{r.o}</Link></td>
                  <td className="px-3 py-2 font-medium text-navy">{r.sku}</td>
                  <td className="px-3 py-2 text-right">{r.qty}</td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground italic"><Bot className="w-3 h-3 inline mr-1 text-brand" />{r.ai}</td>
                  <td className="px-3 py-2 text-right font-semibold">{r.made}</td>
                  <td className="px-3 py-2"><IBadge>{r.st}</IBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Section title="HU đã tạo" actions={<IButton size="sm" icon={Plus}>Tạo HU mới</IButton>}>
            <div className="space-y-2">
              {[
                { id: "HU-001", type: "Pallet PLT-EU", qty: "3 bộ ANT-5G-32T", rfid: "RFID-001-AB12", st: "OK" },
                { id: "HU-002", type: "Pallet PLT-EU", qty: "4 bộ BBU-6648", rfid: "RFID-002-CD34", st: "OK" },
                { id: "HU-003", type: "Thùng gỗ WBX-L", qty: "50 cuộn CAB-FO-LC", rfid: "RFID-003-EF56", st: "In tem lỗi" },
              ].map((h) => (
                <div key={h.id} className="p-2.5 border border-border rounded-lg text-xs">
                  <div className="flex items-center justify-between">
                    <div><span className="font-semibold text-brand">{h.id}</span> <span className="text-muted-foreground">· {h.type}</span></div>
                    {h.st === "OK" ? <IBadge>OK</IBadge> : <IBadge>{h.st}</IBadge>}
                  </div>
                  <div className="mt-1 text-muted-foreground">{h.qty}</div>
                  <div className="mt-1 font-mono text-[10px] text-brand">{h.rfid}</div>
                  {h.st !== "OK" && <button className="mt-1 text-[10px] text-brand underline">In lại tem</button>}
                </div>
              ))}
            </div>
          </Section>

          <RuleNote>
            <li>Tổng SL trong HU/thùng/pallet phải bằng SL được phép đóng gói.</li>
            <li>Mỗi HU/pallet/thùng có mã duy nhất (RFID hoặc barcode).</li>
            <li>In tem lỗi: cho phép in lại và ghi log.</li>
            <li>Chỉ cho putaway khi HU bắt buộc đã được tạo và xác nhận.</li>
          </RuleNote>
        </div>
      </div>
    </AppShell>
  );
}

export function InboundPutaway() {
  return (
    <AppShell breadcrumb={[{ label: "Nhập kho", to: "/inbound" }, { label: "Putaway" }]}>
      <PageHeader title="Putaway / Lưu trữ" subtitle="AI đề xuất vị trí lưu trữ, scan hàng & scan vị trí thực tế"
        actions={<><IButton icon={Bot}>Chạy AI đề xuất vị trí</IButton><IButton variant="brand" icon={Send}>Dispatch putaway</IButton></>} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <KCard label="HU chờ lưu trữ" value={12} tone="warning" icon={MapPin} />
        <KCard label="Đang putaway" value={4} tone="info" />
        <KCard label="Hoàn thành hôm nay" value={36} tone="success" />
        <KCard label="Override vị trí" value={3} tone="warning" />
        <KCard label="Khu gần đầy" value={2} tone="destructive" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Section title="HU đang/đã putaway" className="col-span-12 lg:col-span-8">
          <table className="w-full text-xs">
            <thead><tr className="bg-muted/40 text-muted-foreground border-y border-border">
              <th className="px-3 py-2 text-left font-medium">HU</th>
              <th className="px-3 py-2 text-left font-medium">Order</th>
              <th className="px-3 py-2 text-left font-medium">Loại hàng</th>
              <th className="px-3 py-2 text-left font-medium">Vị trí AI đề xuất</th>
              <th className="px-3 py-2 text-left font-medium">Vị trí thực tế</th>
              <th className="px-3 py-2 text-left font-medium">Người thực hiện</th>
              <th className="px-3 py-2 text-left font-medium">Override</th>
              <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
            </tr></thead>
            <tbody>
              {[
                { hu: "HU-001", o: "INB-2026-00118", type: "Thiết bị 5G", ai: "G01-T02-B05", real: "G01-T02-B05", who: "Bùi Quốc Việt", ovr: "", st: "Hoàn thành" },
                { hu: "HU-002", o: "INB-2026-00118", type: "Thiết bị 5G", ai: "G01-T02-B06", real: "G01-T02-B06", who: "Bùi Quốc Việt", ovr: "", st: "Hoàn thành" },
                { hu: "HU-003", o: "INB-2026-00118", type: "Cáp quang", ai: "I02-T01-B04", real: "I01-T01-B12", who: "Bùi Quốc Việt", ovr: "Bin đề xuất bị block", st: "Hoàn thành" },
                { hu: "HU-004", o: "INB-2026-00125", type: "Nguồn DC", ai: "H01-T01-B03", real: "—", who: "—", ovr: "", st: "Chờ" },
                { hu: "HU-005", o: "INB-2026-00123", type: "RRU", ai: "G02-T01-B01", real: "—", who: "Bùi Quốc Việt", ovr: "", st: "Đang xử lý" },
              ].map((r) => (
                <tr key={r.hu} className="border-b border-border/60">
                  <td className="px-3 py-2 font-semibold text-brand">{r.hu}</td>
                  <td className="px-3 py-2"><Link to={`/inbound/orders/${r.o}`} className="text-brand">{r.o}</Link></td>
                  <td className="px-3 py-2">{r.type}</td>
                  <td className="px-3 py-2 font-mono text-[11px]">{r.ai}</td>
                  <td className={`px-3 py-2 font-mono text-[11px] ${r.real !== r.ai && r.real !== "—" ? "text-warning font-bold" : ""}`}>{r.real}</td>
                  <td className="px-3 py-2">{r.who}</td>
                  <td className="px-3 py-2 text-[11px] text-warning">{r.ovr || "—"}</td>
                  <td className="px-3 py-2"><IBadge>{r.st}</IBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Section title="Mini map khu G01 – Tầng 02">
            <div className="grid grid-cols-8 gap-1 text-[9px]">
              {Array.from({ length: 64 }).map((_, i) => {
                const filled = [5, 6, 12, 18, 22, 27, 35, 40, 44, 50].includes(i);
                const target = [5, 6].includes(i);
                return <div key={i} className={`aspect-square rounded flex items-center justify-center font-mono ${target ? "bg-brand text-brand-foreground font-bold" : filled ? "bg-info/30 text-info" : "bg-muted/40 text-muted-foreground"}`}>B{String(i+1).padStart(2,"0")}</div>;
              })}
            </div>
            <div className="mt-3 flex gap-2 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-brand" /> Vừa putaway</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-info/30" /> Có hàng</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-muted/40" /> Trống</span>
            </div>
          </Section>
          <RuleNote>
            <li>Vị trí phải tồn tại, thuộc đúng kho/khu, đủ sức chứa, phù hợp loại hàng.</li>
            <li>Vị trí thực tế khác AI đề xuất → bắt buộc nhập lý do override.</li>
            <li>Hoàn thành putaway → cập nhật tồn theo vị trí + ghi transaction.</li>
          </RuleNote>
        </div>
      </div>
    </AppShell>
  );
}
