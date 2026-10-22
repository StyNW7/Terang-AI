"use client";

import { motion } from "motion/react";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface FunnelStage {
  label: string;
  value: number;
  hint?: string;
}

/** Horizontal funnel with stage-to-stage conversion. */
export function Funnel({
  stages,
  color = "linear-gradient(90deg,#4a90e2,#2251c9)",
  className,
  compact,
}: {
  stages: FunnelStage[];
  color?: string;
  className?: string;
  compact?: boolean;
}) {
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <div className={cn("space-y-2", className)}>
      {stages.map((s, i) => {
        const width = Math.max(6, (s.value / max) * 100);
        const conv = i > 0 && stages[i - 1].value > 0 ? s.value / stages[i - 1].value : null;
        return (
          <div key={s.label} className="grid grid-cols-[110px_1fr] items-center gap-3 sm:grid-cols-[140px_1fr]">
            <div className="min-w-0">
              <p className={cn("truncate font-semibold text-ink", compact ? "text-xs" : "text-[13px]")}>{s.label}</p>
              {conv !== null && <p className="text-[11px] text-muted">{formatPercent(conv, 1)} dari tahap sebelumnya</p>}
            </div>
            <div className="relative h-9 rounded-xl bg-neutral-soft">
              <motion.div
                className="flex h-full items-center justify-end rounded-xl px-3 text-xs font-semibold text-white shadow-soft"
                style={{ backgroundImage: color }}
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ type: "spring", stiffness: 110, damping: 20, delay: i * 0.05 }}
              >
                <span className="tabular whitespace-nowrap">{formatNumber(s.value)}</span>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
