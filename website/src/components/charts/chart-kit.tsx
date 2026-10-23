"use client";

import { useState, type ReactNode } from "react";
import { Table2, BarChart3 } from "lucide-react";
import { formatValue, type NumberFormat } from "@/components/ui/animated-number";
import { formatIDRCompact } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/** Validated series colors (dataviz validator: CVD ΔE ≥ 18 for each pair). */
export const SERIES = {
  events: "#39b7ff",
  interview: "#2f66e0",
  one: "#2251c9",
  ace: "#0c9fd8",
  shared: "#94a3b8",
  navy: "var(--color-series-navy)",
  grid: "var(--color-grid)",
  axis: "var(--color-axis)",
};

export const AXIS_PROPS = {
  stroke: SERIES.axis,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

/** Axis tick labels must never wrap (wrapped SVG lines overlap) — join words with non-breaking spaces. */
export const noWrap = (v: unknown) => String(v).replace(/\s+/g, "\u00a0");
export const tickIDR = (v: number) => noWrap(formatIDRCompact(v));

interface TooltipEntry {
  name?: string | number;
  value?: unknown;
  color?: string;
  dataKey?: unknown;
  payload?: unknown;
}

export function ChartTooltip({
  active,
  payload,
  label,
  format = "number",
  labelFmt,
}: {
  active?: boolean;
  payload?: ReadonlyArray<TooltipEntry>;
  label?: unknown;
  format?: NumberFormat;
  labelFmt?: (label: unknown) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="min-w-[160px] rounded-xl border border-line bg-card/95 px-3 py-2.5 text-xs shadow-lift backdrop-blur">
      {label !== undefined && label !== "" && (
        <p className="mb-1.5 font-semibold text-ink">{labelFmt ? labelFmt(label) : String(label)}</p>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={`${String(p.dataKey)}-${i}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-strong">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
              {String(p.name)}
            </span>
            <span className="tabular font-semibold text-ink">{typeof p.value === "number" ? formatValue(p.value, format) : String(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Legend({ items, className }: { items: { label: string; color: string; dashed?: boolean }[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-xs font-semibold text-muted-strong">
          {it.dashed ? (
            <span className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: it.color }} />
          ) : (
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: it.color }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Chart frame with title, legend and an accessible table view toggle.
 * `table` rows are rendered when the viewer switches to the table view.
 */
export function ChartFrame({
  title,
  description,
  legend,
  children,
  table,
  action,
  className,
  height = 260,
  summary,
}: {
  title: ReactNode;
  description?: ReactNode;
  legend?: { label: string; color: string; dashed?: boolean }[];
  children: ReactNode;
  table?: { columns: string[]; rows: (string | number)[][] };
  action?: ReactNode;
  className?: string;
  height?: number;
  summary?: string;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const { t } = useI18n();
  return (
    <figure data-spotlight className={cn("rounded-2xl border border-line bg-card p-5 shadow-soft", className)} aria-label={summary}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <figcaption className="text-[15px] font-semibold text-ink">{title}</figcaption>
          {description && <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-strong">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {table && (
            <button
              type="button"
              onClick={() => setView(view === "chart" ? "table" : "chart")}
              className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-[11px] font-semibold text-muted-strong transition hover:text-ink"
              aria-label={view === "chart" ? t("Tampilkan tabel", "Show table") : t("Tampilkan grafik", "Show chart")}
            >
              {view === "chart" ? <Table2 className="h-3.5 w-3.5" /> : <BarChart3 className="h-3.5 w-3.5" />}
              {view === "chart" ? t("Tabel", "Table") : t("Grafik", "Chart")}
            </button>
          )}
        </div>
      </div>
      {legend && legend.length > 1 && <Legend items={legend} className="mt-3" />}
      <div className="mt-4" style={{ height: view === "chart" ? height : undefined }}>
        {view === "chart" || !table ? (
          children
        ) : (
          <div className="scrollbar-thin max-h-[320px] overflow-auto rounded-xl border border-line">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-surface">
                <tr>
                  {table.columns.map((c) => (
                    <th key={c} className="px-3 py-2 font-semibold text-muted-strong">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {table.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) => (
                      <td key={j} className={cn("tabular px-3 py-2", j === 0 ? "font-semibold text-ink" : "text-muted-strong")}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </figure>
  );
}
