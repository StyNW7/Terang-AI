"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { AlertTriangle, ChevronLeft, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { SprintColumn, SprintTask } from "@/types/operations";
import type { ProductKey } from "@/types/common";
import { useOperationsStore } from "@/store/operations-store";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ROADMAP } from "@/data/strategy";
import { cn } from "@/lib/utils";
import { keyOf, L, useI18n, type Bilingual } from "@/lib/i18n";

export const COLUMNS: { id: SprintColumn; label: Bilingual }[] = [
  { id: "backlog", label: L("_Backlog_", "Backlog") },
  { id: "planned", label: L("Direncanakan", "Planned") },
  { id: "in-progress", label: L("Berjalan", "In Progress") },
  { id: "review", label: L("_Review_", "Review") },
  { id: "done", label: L("Selesai", "Completed") },
];

const PRODUCT_META: Record<SprintTask["product"], { label: Bilingual; tone: "sky" | "one" | "neutral" }> = {
  events: { label: L("Events", "Events"), tone: "sky" },
  interview: { label: L("Interview", "Interview"), tone: "one" },
  shared: { label: L("Bersama", "Shared"), tone: "neutral" },
};

export function majorInProgress(tasks: SprintTask[], product: ProductKey) {
  return tasks.filter((t) => t.column === "in-progress" && t.major && t.product === product).length;
}

export function SprintBoard() {
  const { t, tx } = useI18n();
  const tasks = useOperationsStore((s) => s.tasks);
  const moveTask = useOperationsStore((s) => s.moveTask);
  const addTask = useOperationsStore((s) => s.addTask);
  const removeTask = useOperationsStore((s) => s.removeTask);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<SprintColumn | null>(null);
  const [form, setForm] = useState({ title: "", product: "interview" as SprintTask["product"], major: false });

  const move = (task: SprintTask, column: SprintColumn) => {
    if (column === task.column) return;
    if (column === "in-progress" && task.major && task.product !== "shared" && majorInProgress(tasks, task.product) >= 1) {
      const product = t(PRODUCT_META[task.product].label);
      toast.warning(t("Batas WIP terlampaui", "WIP limit exceeded"), {
        description: t(
          `Sudah ada inisiatif besar ${product} yang berjalan. Tunda tugas lain atau selesaikan dulu.`,
          `A major ${product} initiative is already running. Postpone other tasks or finish it first.`,
        ),
      });
    }
    moveTask(task.id, column);
  };

  const step = (task: SprintTask, dir: -1 | 1) => {
    const idx = COLUMNS.findIndex((c) => c.id === task.column);
    const next = COLUMNS[idx + dir];
    if (next) move(task, next.id);
  };

  const add = () => {
    if (form.title.trim().length < 4) {
      toast.error(t("Judul tugas minimal 4 karakter.", "A task title must be at least 4 characters."));
      return;
    }
    addTask({ title: form.title.trim(), product: form.product, major: form.major, points: form.major ? 8 : 3, owner: "—" });
    setForm({ ...form, title: "" });
    toast.success(t("Tugas ditambahkan ke _backlog_.", "Task added to the backlog."));
  };

  const wipWarnings = (["events", "interview"] as const).filter((p) => majorInProgress(tasks, p) > 1);

  return (
    <div className="rounded-2xl border border-line bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">{tx("Langkah 4 · _Sprint board_", "Step 4 · Sprint board")}</p>
          <h3 className="text-xl font-semibold text-ink">Sprint Board</h3>
          <p className="text-sm text-muted-strong">
            {t("Seret kartu antar kolom atau gunakan tombol panah. Batas WIP: 1 inisiatif besar per produk.", "Drag cards between columns or use the arrow buttons. WIP limit: 1 major initiative per product.")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t("Tugas baru…", "New task…")} className="h-9 w-48" aria-label={t("Judul tugas baru", "New task title")} onKeyDown={(e) => e.key === "Enter" && add()} />
          <Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value as SprintTask["product"] })} className="h-9 w-32" aria-label={t("Produk tugas", "Task product")}>
            <option value="interview">Interview</option>
            <option value="events">Events</option>
            <option value="shared">{t("Bersama", "Shared")}</option>
          </Select>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-strong">
            <input type="checkbox" checked={form.major} onChange={(e) => setForm({ ...form, major: e.target.checked })} className="accent-primary" /> {t("Besar", "Major")}
          </label>
          <Button size="sm" variant="ace" onClick={add}>
            <Plus className="h-3.5 w-3.5" /> {t("Tambah", "Add")}
          </Button>
        </div>
      </div>
      {wipWarnings.length > 0 && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-warning-soft p-3 text-sm font-semibold text-warning-ink">
          <AlertTriangle className="h-4 w-4" /> {t("WIP terlampaui pada:", "WIP exceeded for:")} {wipWarnings.map((p) => t(PRODUCT_META[p].label)).join(", ")} —{" "}
          {t("tunda inisiatif besar lain.", "postpone other major initiatives.")}
        </p>
      )}
      <LayoutGroup>
        <div className="scrollbar-thin mt-5 grid auto-cols-[minmax(220px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2">
          {COLUMNS.map((col) => {
            const list = tasks.filter((task) => task.column === col.id);
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(col.id);
                }}
                onDragLeave={() => setOver(null)}
                onDrop={() => {
                  const task = tasks.find((x) => x.id === dragging);
                  if (task) move(task, col.id);
                  setDragging(null);
                  setOver(null);
                }}
                className={cn("min-h-[260px] rounded-2xl p-3 ring-1 transition", over === col.id ? "bg-ace-soft ring-ace/50" : "bg-surface ring-line")}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-ink">{tx(col.label)}</p>
                  <span className="tabular rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-muted-strong ring-1 ring-line">{list.length}</span>
                </div>
                <div className="space-y-2">
                  {list.map((task) => (
                    <motion.div
                      layout
                      layoutId={task.id}
                      key={task.id}
                      draggable
                      onDragStart={() => setDragging(task.id)}
                      onDragEnd={() => setDragging(null)}
                      className={cn("group cursor-grab rounded-xl border bg-card p-3 shadow-soft active:cursor-grabbing", dragging === task.id ? "opacity-50" : "", task.major ? "border-ace/30" : "border-line")}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted/60" />
                        <p className="flex-1 text-[13px] font-semibold leading-snug text-ink">{tx(task.title)}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge tone={PRODUCT_META[task.product].tone}>{t(PRODUCT_META[task.product].label)}</Badge>
                        {task.major && <Badge tone="ace">{t("Besar", "Major")}</Badge>}
                        <span className="ml-auto text-[11px] text-muted">
                          {task.points} pts · {task.owner}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between opacity-70 transition group-hover:opacity-100">
                        <button type="button" onClick={() => step(task, -1)} disabled={col.id === "backlog"} className="grid h-6 w-6 place-items-center rounded-md text-muted hover:bg-surface hover:text-ink disabled:opacity-30" aria-label={t("Pindah ke kiri", "Move left")}>
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeTask(task.id);
                            toast.info(t("Tugas dihapus dari _board_.", "Task removed from the board."));
                          }}
                          className="grid h-6 w-6 place-items-center rounded-md text-muted hover:bg-danger-soft hover:text-danger-ink"
                          aria-label={t("Hapus tugas", "Delete task")}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => step(task, 1)} disabled={col.id === "done"} className="grid h-6 w-6 place-items-center rounded-md text-muted hover:bg-surface hover:text-ink disabled:opacity-30" aria-label={t("Pindah ke kanan", "Move right")}>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {list.length === 0 && <p className="rounded-xl border border-dashed border-line p-4 text-center text-xs text-muted">{t("Seret tugas ke sini", "Drag tasks here")}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

const TIMELINE: { name: Bilingual | string; product: "events" | "interview" | "shared"; start: number; len: number }[] = [
  { name: "Smart Event Templates", product: "events" as const, start: 0, len: 3 },
  { name: "Repeat Event Planner", product: "events" as const, start: 3, len: 3 },
  { name: "Organizer Growth Insights", product: "events" as const, start: 6, len: 3 },
  { name: L("Eksperimen _career fair_", "Career-fair experiment"), product: "events" as const, start: 9, len: 2 },
  { name: "Interview Builder", product: "interview" as const, start: 0, len: 3 },
  { name: "Evidence-Linked Assessment", product: "interview" as const, start: 3, len: 3 },
  { name: "Recruiter Dashboard", product: "interview" as const, start: 6, len: 3 },
  { name: "Responsible AI Controls", product: "interview" as const, start: 9, len: 3 },
  { name: "Portfolio review", product: "shared" as const, start: 5, len: 1 },
  { name: "Portfolio review", product: "shared" as const, start: 11, len: 1 },
];
const MONTHS: Record<"id" | "en", string[]> = {
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const BAR = { events: "bg-[linear-gradient(90deg,#7fd3ff,#39b7ff)]", interview: "bg-[linear-gradient(90deg,#6f9cff,#2f66e0)]", shared: "bg-navy" };

export function RoadmapTimeline() {
  const { t, tx, locale } = useI18n();
  const months = MONTHS[locale];
  return (
    <div className="rounded-2xl border border-line bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-ink">{tx("_Timeline_ 12 bulan (Gantt ringan)", "12-month timeline (light Gantt)")}</h3>
        <p className="text-xs text-muted">
          {t("Kuartal", "Quarters")}: {ROADMAP.ace.map((q) => q.quarter).join(" · ")}
        </p>
      </div>
      <div className="scrollbar-thin mt-4 overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[200px_repeat(12,1fr)] text-[11px] font-semibold text-muted">
            <span />
            {months.map((m) => (
              <span key={m} className="border-l border-line px-1 py-1">
                {m}
              </span>
            ))}
          </div>
          {TIMELINE.map((row, i) => (
            <div key={keyOf(row.name) + i} className="grid grid-cols-[200px_repeat(12,1fr)] items-center border-t border-line/70">
              <span className="py-2 pr-2 text-[13px] leading-snug text-ink">{tx(row.name)}</span>
              <div className="relative col-span-12 h-8">
                <div className="absolute inset-0 grid grid-cols-12">
                  {months.map((m) => (
                    <span key={m} className="border-l border-line/60" />
                  ))}
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className={cn("absolute top-1.5 h-5 origin-left rounded-md shadow-soft", BAR[row.product])}
                  style={{ left: `${(row.start / 12) * 100}%`, width: `${(row.len / 12) * 100}%` }}
                  title={`${t(row.name)}: ${months[row.start]}–${months[row.start + row.len - 1]}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
