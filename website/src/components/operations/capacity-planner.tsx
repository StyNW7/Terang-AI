"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, OctagonAlert, Users } from "lucide-react";
import type { AllocationKey, PoolKey } from "@/types/operations";
import type { StrategyMode } from "@/types/common";
import { useOperationsStore } from "@/store/operations-store";
import { useScenarioStore } from "@/store/scenario-store";
import { ALLOCATION_LABELS, ALLOCATION_PRESETS, POOLS, TEAM } from "@/data/team";
import { poolHours, poolTotal, validateAllocation, productHours } from "@/lib/resource-planner";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/tabs";
import { SourceLabel } from "@/components/shared/source-label";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { keyOf, useI18n } from "@/lib/i18n";

export const ALLOC_COLORS: Record<AllocationKey, string> = {
  interview: "#2f66e0",
  events: "#39b7ff",
  qa: "#7c8fb0",
  maintenance: "#a9b8cc",
  buffer: "var(--color-line-strong)",
  governance: "#17395e",
  coordination: "#0c9fd8",
};

const POOL_ICON_BG: Record<PoolKey, string> = { leadership: "bg-navy", product: "bg-brand-gradient", ops: "bg-ace-gradient" };

export function TeamOverview({ rules }: { rules: StrategyMode }) {
  const { t, tx } = useI18n();
  const allocation = useOperationsStore((s) => s.allocation);
  const hours = useScenarioStore((s) => s.assumptions.shared.productiveHoursPerPerson);
  const issues = useMemo(() => validateAllocation(allocation, rules), [allocation, rules]);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {(Object.keys(POOLS) as PoolKey[]).map((pool) => {
        const total = poolTotal(allocation, pool);
        const available = poolHours(pool, hours);
        const planned = (available * total) / 100;
        const poolIssues = issues.filter((i) => i.pool === pool && i.severity !== "info");
        return (
          <div key={pool} className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{tx(POOLS[pool].label)}</p>
                <p className="text-xs text-muted">{tx(POOLS[pool].description)}</p>
              </div>
              {poolIssues.some((i) => i.severity === "critical") ? (
                <Badge tone="danger">{t("Pelanggaran", "Violation")}</Badge>
              ) : poolIssues.length ? (
                <Badge tone="warning">{t("Perlu perhatian", "Needs attention")}</Badge>
              ) : (
                <Badge tone="success">{t("Sehat", "Healthy")}</Badge>
              )}
            </div>
            <div className="mt-4 flex gap-1.5">
              {TEAM.filter((member) => member.pool === pool).map((m) => (
                <span key={m.id} title={m.title} className={cn("grid h-10 w-10 place-items-center rounded-full text-[11px] font-semibold text-white shadow-soft", POOL_ICON_BG[pool])}>
                  {m.role === "CEO" || m.role === "CPO" ? m.role : m.initials}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-muted">{t("Direncanakan / tersedia", "Planned / available")}</p>
                <p className="tabular font-display text-xl font-semibold text-ink">
                  {formatNumber(planned)} <span className="text-sm font-semibold text-muted">
                    / {formatNumber(available)} {t("jam/bln", "hrs/mo")}
                  </span>
                </p>
              </div>
              <span className={cn("tabular text-sm font-semibold", total > 100 ? "text-danger-ink" : total > 90 ? "text-warning-ink" : "text-success-ink")}>{total}%</span>
            </div>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-track">
              {POOLS[pool].keys.map((k) => {
                const v = allocation[pool]?.[k] ?? 0;
                return <motion.span key={k} className="h-full border-r border-white last:border-0" style={{ background: ALLOC_COLORS[k] }} animate={{ width: `${Math.min(100, v)}%` }} title={`${t(ALLOCATION_LABELS[k])}: ${v}%`} />;
              })}
            </div>
            {poolIssues.slice(0, 2).map((i) => (
              <p key={keyOf(i.message)} className={cn("mt-2 flex items-start gap-1.5 text-xs", i.severity === "critical" ? "text-danger-ink" : "text-warning-ink")}>
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {tx(i.rule)}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function CapacityPlanner({ rules, onRulesChange }: { rules: "one" | "ace"; onRulesChange: (r: "one" | "ace") => void }) {
  const { t, tx } = useI18n();
  const allocation = useOperationsStore((s) => s.allocation);
  const preset = useOperationsStore((s) => s.allocationPreset);
  const setAllocation = useOperationsStore((s) => s.setAllocation);
  const applyPreset = useOperationsStore((s) => s.applyAllocationPreset);
  const hours = useScenarioStore((s) => s.assumptions.shared.productiveHoursPerPerson);
  const issues = useMemo(() => validateAllocation(allocation, rules), [allocation, rules]);
  const ph = productHours(allocation, hours);

  return (
    <div className="rounded-2xl border border-line bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">{t("Langkah 2 · Alokasi waktu tim", "Step 2 · Team time allocation")}</p>
          <h3 className="text-xl font-semibold text-ink">{tx("_Resource Planner_ Interaktif", "Interactive Resource Planner")}</h3>
          <p className="text-sm text-muted-strong">
            {t("Atur persentase waktu tiap kelompok. Validasi berjalan langsung terhadap aturan strategi.", "Set each group's time percentages. Validation runs live against the strategy rules.")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted">{t("Aturan:", "Rules:")}</span>
          <Segmented size="sm" value={rules} onChange={onRulesChange} items={[{ id: "one", label: "ONE" }, { id: "ace", label: "ACE" }]} />
          <SourceLabel type="internal-restricted-context" compact />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(ALLOCATION_PRESETS) as ("one" | "ace" | "split")[]).map((p) => (
          <Button key={p} size="sm" variant={preset === p ? "dark" : "secondary"} onClick={() => applyPreset(p)} title={t(ALLOCATION_PRESETS[p].description)}>
            {tx(ALLOCATION_PRESETS[p].label)}
          </Button>
        ))}
        {preset === "custom" && <Badge tone="brand">{t("Kustom", "Custom")}</Badge>}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {(Object.keys(POOLS) as PoolKey[]).map((pool) => {
          const total = poolTotal(allocation, pool);
          return (
            <div key={pool} className={cn("rounded-2xl p-4 ring-1", total > 100 ? "bg-danger-soft/50 ring-current/15" : "bg-surface ring-line")}>
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Users className="h-4 w-4 text-muted" /> {tx(POOLS[pool].label)}
                </p>
                <span className={cn("tabular rounded-full px-2 py-0.5 text-xs font-semibold", total > 100 ? "bg-danger text-white" : total >= 90 ? "bg-warning-soft text-warning-ink" : "bg-card text-ink ring-1 ring-line")}>
                  {total}%
                </span>
              </div>
              <div className="space-y-4">
                {POOLS[pool].keys.map((k) => (
                  <Slider
                    key={k}
                    label={<span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: ALLOC_COLORS[k] }} />{tx(ALLOCATION_LABELS[k])}</span>}
                    value={allocation[pool]?.[k] ?? 0}
                    min={0}
                    max={100}
                    step={1}
                    color={ALLOC_COLORS[k]}
                    display={`${allocation[pool]?.[k] ?? 0}% · ${formatNumber(((allocation[pool]?.[k] ?? 0) / 100) * poolHours(pool, hours))} ${t("j", "h")}`}
                    onChange={(v) => setAllocation(pool, k, v)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl bg-navy-gradient p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky">{t("Hasil alokasi per produk (jam/bulan)", "Allocation by product (hours/month)")}</p>
          {(["interview", "events"] as const).map((p) => {
            const h = ph[p];
            const total = h.product + h.ops;
            return (
              <div key={p} className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{p === "interview" ? "AI Candidate Interview" : "Terang Events"}</span>
                  <span className="tabular font-semibold">
                    {formatNumber(total)} {t("jam", "hrs")}
                  </span>
                </div>
                <p className="text-xs text-white/65">
                  Product {formatNumber(h.product)} {t("j", "h")} · Ops {formatNumber(h.ops)} {t("j", "h")}
                </p>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full" style={{ background: p === "interview" ? "#6f9cff" : "#39b7ff" }} animate={{ width: `${Math.min(100, (total / (poolHours("product", hours) + poolHours("ops", hours))) * 100)}%` }} />
                </div>
              </div>
            );
          })}
          <p className="mt-4 text-[11.5px] text-white/60">
            {tx("Jam _leadership_ dilaporkan terpisah dan tidak dihitung sebagai jam pengembangan.", "Leadership hours are reported separately and not counted as development hours.")}
          </p>
        </div>
        <div className="space-y-2">
          {issues.map((i) => {
            const Icon = i.severity === "critical" ? OctagonAlert : i.severity === "warning" ? AlertTriangle : Info;
            return (
              <motion.div
                layout
                key={keyOf(i.message)}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-3 text-sm ring-1",
                  i.severity === "critical" ? "bg-danger-soft text-danger-ink ring-current/15" : i.severity === "warning" ? "bg-warning-soft text-warning-ink ring-current/15" : "bg-soft/60 text-ink ring-current/15",
                )}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <strong className="block text-xs uppercase tracking-wide">{tx(i.rule)}</strong>
                  {tx(i.message)}
                </span>
              </motion.div>
            );
          })}
          {!issues.some((i) => i.severity !== "info") && (
            <p className="flex items-center gap-2 rounded-xl bg-success-soft p-3 text-sm font-semibold text-success-ink">
              <CheckCircle2 className="h-4 w-4" /> {t("Semua batasan kapasitas terpenuhi.", "Every capacity limit is satisfied.")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
