"use client";

import { motion } from "motion/react";
import { Wallet } from "lucide-react";
import { useOperationsStore } from "@/store/operations-store";
import { MONTHLY_DISCRETIONARY_BUDGET } from "@/data/team";
import { Slider } from "@/components/ui/slider";
import { SourceLabel } from "@/components/shared/source-label";
import { formatIDR, formatIDRCompact, formatPercent } from "@/lib/formatters";
import { cn, safeDivide } from "@/lib/utils";

const PRODUCT_COLOR = { interview: "#2f66e0", events: "#39b7ff", shared: "#94a3b8" };

export function BudgetPlanner() {
  const budget = useOperationsStore((s) => s.budget);
  const setBudget = useOperationsStore((s) => s.setBudget);
  const total = budget.reduce((a, b) => a + b.amount, 0);
  const remaining = MONTHLY_DISCRETIONARY_BUDGET - total;
  const byProduct = (["interview", "events", "shared"] as const).map((p) => ({ p, v: budget.filter((b) => b.product === p).reduce((a, b) => a + b.amount, 0) }));
  const marketingInterview = budget.find((b) => b.key === "mkt-interview")?.amount ?? 0;
  const sensitivity = [
    { label: "Pemasaran Interview +20%", delta: marketingInterview * 0.2 },
    { label: "Pengembangan Events −25%", delta: -(budget.find((b) => b.key === "dev-events")?.amount ?? 0) * 0.25 },
    { label: "Biaya koordinasi +50%", delta: (budget.find((b) => b.key === "shared")?.amount ?? 0) * 0.5 },
  ];

  return (
    <div className="rounded-2xl border border-line bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">Section D</p>
          <h3 className="text-xl font-semibold text-ink">Budget Planner (per bulan)</h3>
          <p className="text-sm text-muted-strong">Anggaran diskresioner di luar gaji tetap: {formatIDR(MONTHLY_DISCRETIONARY_BUDGET)}.</p>
        </div>
        <SourceLabel type="illustrative-assumption" compact />
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          {budget.map((b) => (
            <Slider
              key={b.key}
              label={<span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: PRODUCT_COLOR[b.product] }} />{b.label}</span>}
              value={b.amount}
              min={0}
              max={25_000_000}
              step={500_000}
              color={PRODUCT_COLOR[b.product]}
              display={formatIDRCompact(b.amount)}
              onChange={(v) => setBudget(b.key, v)}
            />
          ))}
        </div>
        <div className="space-y-4">
          <div className={cn("rounded-2xl p-5 text-white", remaining < 0 ? "bg-[linear-gradient(135deg,#e0484d,#a82025)]" : "bg-navy-gradient")}>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/75">
              <Wallet className="h-4 w-4" /> Sisa anggaran
            </p>
            <p className="tabular mt-1 font-display text-3xl font-bold">{formatIDRCompact(remaining)}</p>
            <p className="text-sm text-white/80">
              Terpakai {formatIDRCompact(total)} ({formatPercent(safeDivide(total, MONTHLY_DISCRETIONARY_BUDGET))})
            </p>
            {remaining < 0 && <p className="mt-2 text-sm font-semibold">Anggaran tidak mencukupi untuk skenario ini.</p>}
          </div>
          <div className="rounded-2xl bg-surface p-4 ring-1 ring-line">
            <p className="text-sm font-semibold text-ink">Alokasi per produk</p>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full">
              {byProduct.map(({ p, v }) => (
                <motion.span key={p} className="h-full border-r-2 border-white last:border-0" style={{ background: PRODUCT_COLOR[p] }} animate={{ width: `${safeDivide(v, total) * 100}%` }} />
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              {byProduct.map(({ p, v }) => (
                <p key={p} className="flex justify-between">
                  <span className="flex items-center gap-1.5 text-muted-strong">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: PRODUCT_COLOR[p] }} />
                    {p === "interview" ? "Interview" : p === "events" ? "Events" : "Bersama"}
                  </span>
                  <span className="tabular font-semibold text-ink">{formatIDRCompact(v)}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-surface p-4 ring-1 ring-line">
            <p className="text-sm font-semibold text-ink">Sensitivitas perubahan alokasi</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {sensitivity.map((s) => {
                const after = remaining - s.delta;
                return (
                  <li key={s.label} className="flex justify-between gap-2">
                    <span className="text-muted-strong">{s.label}</span>
                    <span className={cn("tabular font-semibold", after < 0 ? "text-danger-ink" : "text-ink")}>sisa {formatIDRCompact(after)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
