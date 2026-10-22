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
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
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
      <PageHeader
        eyebrow={
          <>
            <Badge tone="ace" icon={<Gauge className="h-3 w-3" />}>ACE · Coordinate Markets &amp; Capacity</Badge>
            <SourceLabel type="strategic-proposal" compact />
          </>
        }
        title="Kapasitas & Operasional"
        description="Kendali ringan untuk tim 7 orang: kapasitas, anggaran, sprint, dan risiko — agar dua produk tetap terkendali."
      />

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">Langkah 1 · Kondisi tim saat ini</p>
        <TeamOverview rules={rules} />
      </section>
      <CapacityPlanner rules={rules} onRulesChange={setRulesOverride} />
      <BudgetPlanner />
      <SprintBoard />
      <RoadmapTimeline />

      <section className="rounded-3xl bg-navy-gradient p-6 text-white shadow-lift">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-sky">
          <Lightbulb className="h-4 w-4" /> Rekomendasi manajemen (berbasis aturan, bukan AI)
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
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
