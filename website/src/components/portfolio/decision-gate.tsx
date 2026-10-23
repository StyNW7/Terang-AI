"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, CircleX, Lock, OctagonAlert, Rocket, Wrench, Minimize2, PauseCircle } from "lucide-react";
import type { ProductKey } from "@/types/common";
import { DECISION_META, evaluateProduct, THRESHOLDS, type PortfolioDecision, type ProductKpiInput } from "@/lib/portfolio-engine";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/form";
import { formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { keyOf, useI18n } from "@/lib/i18n";

const DECISION_ICON: Record<PortfolioDecision, typeof Rocket> = { scale: Rocket, optimize: Wrench, limit: Minimize2, pause: PauseCircle };
const DECISION_BG: Record<PortfolioDecision, string> = {
  scale: "bg-[linear-gradient(135deg,#12a37a,#0b7a5a)]",
  optimize: "bg-[linear-gradient(135deg,#4a90e2,#2251c9)]",
  limit: "bg-[linear-gradient(135deg,#f0a92c,#c97a06)]",
  pause: "bg-[linear-gradient(135deg,#e0484d,#a82025)]",
};

export function DecisionGate({
  product,
  initial,
  lens,
  title,
  color = "#2251c9",
}: {
  product: ProductKey;
  initial: Omit<ProductKpiInput, "product">;
  lens: "one" | "ace";
  title?: string;
  color?: string;
}) {
  const [input, setInput] = useState<ProductKpiInput>({ ...initial, product });
  const result = useMemo(() => evaluateProduct(input), [input]);
  const meta = DECISION_META[result.decision];
  const Icon = DECISION_ICON[result.decision];
  const th = THRESHOLDS[product];
  const { t, tx } = useI18n();
  const set = <K extends keyof ProductKpiInput>(k: K, v: ProductKpiInput[K]) => setInput((s) => ({ ...s, [k]: v }));
  const isInterview = product === "interview";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-ink">{title ?? t("Input KPI", "KPI inputs")}</h3>
        <p className="text-sm text-muted-strong">{t("Geser KPI untuk melihat bagaimana keputusan berubah. Semua ambang batas terlihat.", "Move the KPIs to see how the decision changes. Every threshold is visible.")}</p>
        <div className="mt-5 space-y-4">
          <Slider label={t("Skor kualitas produk", "Product quality score")} value={input.qualityScore} min={40} max={100} onChange={(v) => set("qualityScore", v)} display={`${input.qualityScore} / 100`} color={color} hint={`Target ≥ ${th.quality}`} />
          <Slider label={isInterview ? tx("Konversi _pilot_ → berbayar", "Pilot → paid conversion") : tx("Aktivasi _organizer_", "Organizer activation")} value={Math.round(input.conversion * 100)} min={0} max={80} onChange={(v) => set("conversion", v / 100)} display={formatPercent(input.conversion)} color={color} hint={`Target ≥ ${formatPercent(th.conversion)}`} />
          <Slider label={isInterview ? tx("_Renewal_ perusahaan", "Company renewals") : tx("_Organizer_ berulang", "Repeat organizers")} value={Math.round(input.retention * 100)} min={0} max={100} onChange={(v) => set("retention", v / 100)} display={formatPercent(input.retention)} color={color} hint={`Target ≥ ${formatPercent(th.retention)}`} />
          <Slider label={tx("_Contribution margin_", "Contribution margin")} value={Math.round(input.contributionMargin * 100)} min={-40} max={90} onChange={(v) => set("contributionMargin", v / 100)} display={formatPercent(input.contributionMargin)} color={color} hint={`Target ≥ ${formatPercent(th.margin)}`} />
          <Slider label={t("Utilisasi kapasitas tim", "Team capacity utilisation")} value={Math.round(input.capacityUtilization * 100)} min={40} max={140} onChange={(v) => set("capacityUtilization", v / 100)} display={formatPercent(input.capacityUtilization)} color={color} hint={`Target ≤ ${formatPercent(th.capacity)}`} />
          <Slider label={tx("_Milestone_ terlewat berturut-turut", "Consecutive missed milestones")} value={input.milestoneMisses} min={0} max={4} onChange={(v) => set("milestoneMisses", v)} display={String(input.milestoneMisses)} color={color} />
        </div>
        <div className="mt-5 space-y-2 rounded-2xl bg-surface p-4 ring-1 ring-line">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <Lock className="h-3.5 w-3.5" /> {tx("_Hard gates_", "Hard gates")}
          </p>
          {(isInterview
            ? ([
                ["privacyPass", t("Privasi & perlindungan data", "Privacy & data protection")],
                ["safetyPass", t("Keamanan & tinjauan manusia", "Safety & human review")],
                ["validityPass", t("Validitas rubrik penilaian", "Assessment-rubric validity")],
              ] as const)
            : ([["safetyPass", t("Keandalan layanan _event_", "Event-service reliability")]] as const)
          ).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink">{label}</span>
              <Switch checked={input[k]} onChange={(v) => set(k, v)} label={label} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={result.decision}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={cn("relative overflow-hidden rounded-3xl p-6 text-white shadow-lift", DECISION_BG[result.decision])}
          >
            <div className="bg-grid-dark absolute inset-0 opacity-40" />
            <div className="relative flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
                  {lens === "one" ? "ONE Expansion Gate" : "ACE Portfolio Decision"} · {result.passed}/{result.total} {t("kriteria komersial", "commercial criteria")}
                </p>
                <p className="font-display text-3xl font-semibold">{lens === "one" ? meta.one : meta.ace}</p>
                <p className="mt-1 text-sm text-white/85">{tx(meta.description)}</p>
              </div>
            </div>
            <ul className="relative mt-4 space-y-1">
              {result.reasons.map((r) => (
                <li key={keyOf(r)} className="flex gap-2 text-sm text-white/90">
                  <OctagonAlert className="mt-0.5 h-4 w-4 shrink-0" /> {tx(r)}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-soft">
          <div className="border-b border-line px-5 py-3 text-sm font-semibold text-ink">{t("Mengapa keputusan ini muncul?", "Why this decision?")}</div>
          <ul className="divide-y divide-line">
            {result.criteria.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
                <span className="flex items-center gap-2">
                  {c.pass ? <CheckCircle2 className="h-4 w-4 text-success" /> : <CircleX className="h-4 w-4 text-danger" />}
                  <span className="text-ink">{tx(c.label)}</span>
                  {c.hard && <span className="rounded-full bg-navy px-1.5 py-0.5 text-[11px] font-semibold uppercase text-white">Hard gate</span>}
                </span>
                <span className="tabular shrink-0 text-xs">
                  <span className={cn("font-semibold", c.pass ? "text-ink" : "text-danger-ink")}>{t(c.value)}</span>
                  <span className="text-muted"> · {t(c.target)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        {isInterview && (
          <p className="text-xs leading-relaxed text-muted">
            {tx(
              "Untuk AI Candidate Interview, privasi, keamanan, dan validitas penilaian adalah _hard gate_ — kinerja komersial setinggi apa pun tidak dapat menggantikannya.",
              "For AI Candidate Interview, privacy, safety and assessment validity are hard gates — no level of commercial performance can replace them.",
            )}
          </p>
        )}
      </div>
    </div>
  );
}
