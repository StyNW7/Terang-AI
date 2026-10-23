"use client";

import { useState } from "react";
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
import { L, useI18n, type Bilingual } from "@/lib/i18n";

export function CommandCenter() {
  const { mode } = useStrategyMode();
  const { t, tx } = useI18n();
  const [rulesOverride, setRulesOverride] = useState<"one" | "ace" | null>(null);
  const rules = rulesOverride ?? (mode === "one" ? "one" : "ace");
  const allocation = useOperationsStore((s) => s.allocation);
  const tasks = useOperationsStore((s) => s.tasks);
  const budget = useOperationsStore((s) => s.budget);
  const assumptions = useScenarioStore((s) => s.assumptions);

  // Plain derived value: cheap to compute and it re-formats numbers when the language changes.
  const recs = (() => {
    const list: { text: Bilingual; tone: "warning" | "danger" | "success" | "info" }[] = [];
    const issues = validateAllocation(allocation, rules);
    if (hasCriticalIssue(issues))
      list.push({ text: L("Alokasi kapasitas melanggar batas kritis — perbaiki sebelum _sprint_ dimulai.", "The capacity allocation breaks a critical limit — fix it before the sprint starts."), tone: "danger" });
    (["interview", "events"] as const).forEach((p) => {
      const n = majorInProgress(tasks, p);
      const name = p === "interview" ? "Interview" : "Events";
      if (n > 1) list.push({ text: L(`${n} inisiatif besar ${name} aktif bersamaan; tunda salah satunya.`, `${n} major ${name} initiatives are active at once; postpone one of them.`), tone: "warning" });
    });
    const activeMajors = tasks.filter((task) => task.column === "in-progress" && task.major).length;
    if (activeMajors >= 2)
      list.push({ text: L("Dua inisiatif besar sudah aktif; tunda tugas pengembangan besar berikutnya.", "Two major initiatives are already active; postpone the next major development task."), tone: "info" });
    if ((allocation.product.qa ?? 0) < 10 && tasks.some((task) => task.column === "review"))
      list.push({ text: L("Produk Interview melebihi kapasitas QA yang direncanakan — tambah porsi QA bersama.", "Interview exceeds the planned QA capacity — increase the shared QA share."), tone: "warning" });
    const ace = computeStrategy("ace", assumptions);
    if (ace.events.contributionMargin > ace.interview.contributionMargin)
      list.push({ text: L("Kampanye Events memiliki margin kontribusi lebih tinggi pada asumsi saat ini.", "The Events campaign has the higher contribution margin under current assumptions."), tone: "info" });
    else
      list.push({
        text: L(
          "Kampanye Events memiliki asumsi konversi lebih tinggi tetapi margin per unit lebih rendah dari Interview.",
          "The Events campaign assumes higher conversion but a lower per-unit margin than Interview.",
        ),
        tone: "info",
      });
    const total = budget.reduce((a, b) => a + b.amount, 0);
    if (total > MONTHLY_DISCRETIONARY_BUDGET) {
      const over = formatIDRCompact(total - MONTHLY_DISCRETIONARY_BUDGET);
      list.push({ text: L(`Anggaran tidak mencukupi: kelebihan ${over} per bulan.`, `Budget is insufficient: ${over} over per month.`), tone: "danger" });
    }
    if (ace.capacity.productUtilization > 0.9) {
      const util = formatPercent(ace.capacity.productUtilization);
      list.push({ text: L(`Model finansial ACE memproyeksikan utilisasi _Product_ ${util} — siapkan _buffer_.`, `The ACE financial model projects ${util} Product utilisation — prepare a buffer.`), tone: "warning" });
    }
    if (list.length === 0) list.push({ text: L("Seluruh kendali kapasitas, WIP, dan anggaran dalam batas aman.", "All capacity, WIP and budget controls are within safe limits."), tone: "success" });
    return list;
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <Badge tone="ace" icon={<Gauge className="h-3 w-3" />}>ACE · Coordinate Markets &amp; Capacity</Badge>
            <SourceLabel type="strategic-proposal" compact />
          </>
        }
        title={t("Kapasitas & Operasional", "Capacity & Operations")}
        description={tx(
          "Kendali ringan untuk tim 7 orang: kapasitas, anggaran, _sprint_, dan risiko — agar dua produk tetap terkendali.",
          "Lightweight controls for a 7-person team: capacity, budget, sprints and risk — keeping two products under control.",
        )}
      />

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">{t("Langkah 1 · Kondisi tim saat ini", "Step 1 · Current team status")}</p>
        <TeamOverview rules={rules} />
      </section>
      <CapacityPlanner rules={rules} onRulesChange={setRulesOverride} />
      <BudgetPlanner />
      <SprintBoard />
      <RoadmapTimeline />

      <section className="rounded-3xl bg-navy-gradient p-6 text-white shadow-lift">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-sky">
          <Lightbulb className="h-4 w-4" /> {t("Rekomendasi manajemen (berbasis aturan, bukan AI)", "Management recommendations (rule-based, not AI)")}
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {recs.map((r) => (
            <li key={r.text.id} className="flex gap-3 rounded-2xl bg-white/8 p-4 text-sm ring-1 ring-white/12">
              {r.tone === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              ) : (
                <AlertTriangle className={cn("mt-0.5 h-4 w-4 shrink-0", r.tone === "danger" ? "text-danger" : r.tone === "warning" ? "text-warning" : "text-sky")} />
              )}
              <span>{tx(r.text)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
