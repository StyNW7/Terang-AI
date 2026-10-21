"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Gauge, Lightbulb } from "lucide-react";
import { useOperationsStore } from "@/store/operations-store";
import { useScenarioStore } from "@/store/scenario-store";
import { useStrategyMode } from "@/hooks/use-strategy-mode";
import { MONTHLY_DISCRETIONARY_BUDGET } from "@/data/team";
import { computeStrategy } from "@/lib/finance";
import { validateAllocation, hasCriticalIssue } from "@/lib/resource-planner";
import { formatIDRCompact, formatPercent } from "@/lib/formatters";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { TeamOverview, CapacityPlanner } from "./capacity-planner";
import { BudgetPlanner } from "./budget-planner";
import { SprintBoard, RoadmapTimeline, majorInProgress } from "./sprint-board";
import { cn } from "@/lib/utils";

export function CommandCenter() {
  const { mode } = useStrategyMode();
  const [rulesOverride, setRulesOverride] = useState<"one" | "ace" | null>(null);
  const rules = rulesOverride ?? (mode === "one" ? "one" : "ace");
  const allocation = useOperationsStore((s) => s.allocation);
  const tasks = useOperationsStore((s) => s.tasks);
  const budget = useOperationsStore((s) => s.budget);
  const assumptions = useScenarioStore((s) => s.assumptions);

  const recs = useMemo(() => {
    const list: { text: string; tone: "warning" | "danger" | "success" | "info" }[] = [];
    const issues = validateAllocation(allocation, rules);
    if (hasCriticalIssue(issues)) list.push({ text: "Alokasi kapasitas melanggar batas kritis — perbaiki sebelum sprint dimulai.", tone: "danger" });
    (["interview", "events"] as const).forEach((p) => {
      const n = majorInProgress(tasks, p);
      if (n > 1) list.push({ text: `${n} inisiatif besar ${p === "interview" ? "Interview" : "Events"} aktif bersamaan; tunda salah satunya.`, tone: "warning" });
    });
    const activeMajors = tasks.filter((t) => t.column === "in-progress" && t.major).length;
    if (activeMajors >= 2) list.push({ text: "Dua inisiatif besar sudah aktif; tunda tugas pengembangan besar berikutnya.", tone: "info" });
    if ((allocation.product.qa ?? 0) < 10 && tasks.some((t) => t.column === "review"))
      list.push({ text: "Produk Interview melebihi kapasitas QA yang direncanakan — tambah porsi QA bersama.", tone: "warning" });
    const ace = computeStrategy("ace", assumptions);
    if (ace.events.contributionMargin > ace.interview.contributionMargin)
      list.push({ text: "Kampanye Events memiliki margin kontribusi lebih tinggi pada asumsi saat ini.", tone: "info" });
    else list.push({ text: "Kampanye Events memiliki asumsi konversi lebih tinggi tetapi margin per unit lebih rendah dari Interview.", tone: "info" });
    const total = budget.reduce((a, b) => a + b.amount, 0);
    if (total > MONTHLY_DISCRETIONARY_BUDGET) list.push({ text: `Anggaran tidak mencukupi: kelebihan ${formatIDRCompact(total - MONTHLY_DISCRETIONARY_BUDGET)} per bulan.`, tone: "danger" });
    if (ace.capacity.productUtilization > 0.9) list.push({ text: `Model finansial ACE memproyeksikan utilisasi Product ${formatPercent(ace.capacity.productUtilization)} — siapkan buffer.`, tone: "warning" });
    if (list.length === 0) list.push({ text: "Seluruh kendali kapasitas, WIP, dan anggaran dalam batas aman.", tone: "success" });
    return list;
  }, [allocation, tasks, budget, assumptions, rules]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-ace-gradient p-6 text-white shadow-card sm:p-8">
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <Mascot name="puzzle" size={150} className="absolute -bottom-6 right-4 hidden md:block" />
        <div className="relative max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ring-1 ring-white/25">
              <Gauge className="h-3.5 w-3.5" /> ACE · Coordinate Markets & Capacity
            </span>
            <SourceLabel type="strategic-proposal" dark />
          </div>
          <h2 className="mt-3 text-3xl font-extrabold">ACE Command Center</h2>
          <p className="mt-1 text-white/85">
            Dashboard manajemen ringan untuk 7 personel: kapasitas, anggaran, sprint, dan risiko — agar dua produk tetap terkendali. Gunakan
            aturan ONE untuk membandingkan.
          </p>
        </div>
      </div>

      <section>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-ace">Section A · Team overview</p>
        <TeamOverview rules={rules} />
      </section>
      <CapacityPlanner rules={rules} onRulesChange={setRulesOverride} />
      <BudgetPlanner />
      <SprintBoard />
      <RoadmapTimeline />

      <section className="rounded-3xl bg-navy-gradient p-6 text-white shadow-lift">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-sky">
          <Lightbulb className="h-4 w-4" /> Section F · Management recommendations (berbasis aturan, bukan AI)
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {recs.map((r) => (
            <li key={r.text} className="flex gap-3 rounded-2xl bg-white/8 p-4 text-sm ring-1 ring-white/12">
              {r.tone === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              ) : (
                <AlertTriangle className={cn("mt-0.5 h-4 w-4 shrink-0", r.tone === "danger" ? "text-danger" : r.tone === "warning" ? "text-warning" : "text-sky")} />
              )}
              {r.text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
