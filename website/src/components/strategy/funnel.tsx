"use client";

import { motion } from "motion/react";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <div className={cn("space-y-2", className)}>
      {stages.map((s, i) => {
        const width = Math.max(6, (s.value / max) * 100);
        const conv = i > 0 && stages[i - 1].value > 0 ? s.value / stages[i - 1].value : null;
        return (
          <div key={s.label} className="grid grid-cols-[110px_1fr] items-center gap-3 sm:grid-cols-[140px_1fr]">
            <div className="min-w-0">
              <p className={cn("font-semibold leading-tight text-ink", compact ? "text-xs" : "text-[13px]")}>{s.label}</p>
              {conv !== null && <p className="text-[11px] text-muted">{formatPercent(conv, 1)} {t("dari tahap sebelumnya", "of the previous stage")}</p>}
            </div>
            <div className="relative h-9 rounded-xl bg-neutral-soft">
              <motion.div
                className="h-full rounded-xl shadow-soft"
                style={{ backgroundImage: color }}
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ type: "spring", stiffness: 110, damping: 20, delay: i * 0.05 }}
              />
              {/* Value sits inside wide bars and just after narrow ones so it is never clipped. */}
              <span
                className={cn(
                  "tabular pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-semibold",
                  width >= 26 ? "text-white" : "text-ink",
                )}
                style={width >= 26 ? { right: `calc(${100 - width}% + 12px)` } : { left: `calc(${width}% + 8px)` }}
              >
                {formatNumber(s.value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
