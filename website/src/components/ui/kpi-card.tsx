import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { AnimatedNumber, type NumberFormat } from "./animated-number";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  format = "number",
  icon,
  delta,
  deltaLabel,
  hint,
  tone = "brand",
  className,
  footer,
}: {
  label: ReactNode;
  value: number;
  format?: NumberFormat;
  icon?: ReactNode;
  delta?: number; // fraction, e.g. 0.12 = +12%
  deltaLabel?: string;
  hint?: ReactNode;
  tone?: "brand" | "sky" | "one" | "ace" | "navy";
  className?: string;
  footer?: ReactNode;
}) {
  const accents = {
    brand: "from-[#39b7ff] to-[#2f66e0]",
    sky: "from-[#7fd3ff] to-[#39b7ff]",
    one: "from-[#4a90e2] to-[#2251c9]",
    ace: "from-[#5fd0ff] to-[#0c9fd8]",
    navy: "from-[#2f66e0] to-[#17395e]",
  };
  const iconTone = {
    brand: "bg-soft text-brand-ink",
    sky: "bg-[#e5f6ff] text-sky-ink",
    one: "bg-one-soft text-one",
    ace: "bg-ace-soft text-[#0a7aa6]",
    navy: "bg-[#e8edf4] text-navy",
  };
  return (
    <div className={cn("group relative overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card", className)}>
      <div className={cn("absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r opacity-80", accents[tone])} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-semibold leading-snug text-muted-strong">{label}</p>
        {icon && <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", iconTone[tone])}>{icon}</div>}
      </div>
      <p className="tabular mt-2 font-display text-[1.6rem] font-extrabold leading-none tracking-tight text-ink">
        <AnimatedNumber value={value} format={format} />
      </p>
      {(delta !== undefined || hint) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {delta !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-semibold",
                delta >= 0 ? "bg-success-soft text-[#0b7a5a]" : "bg-danger-soft text-danger-ink",
              )}
            >
              {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta >= 0 ? "+" : ""}
              {Math.round(delta * 100)}%
            </span>
          )}
          {deltaLabel && <span className="text-muted">{deltaLabel}</span>}
          {hint && <span className="text-muted">{hint}</span>}
        </div>
      )}
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}
