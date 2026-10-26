"use client";

import { ArrowRight, CalendarRange } from "lucide-react";
import { ROADMAP } from "@/data/strategy";
import { IMPLEMENTATION } from "@/data/proposal";
import { cn } from "@/lib/utils";
import { keyOf, useI18n } from "@/lib/i18n";

/** Phase-by-phase initial implementation plan: ONE = 4 phases / 12 months, ACE = 6 phases / 18 months. */
export function PhaseRoadmap({ strategy, className }: { strategy: "one" | "ace"; className?: string }) {
  const { t, tx } = useI18n();
  const phases = ROADMAP[strategy];
  const isOne = strategy === "one";
  return (
    <div className={className}>
      <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", isOne ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {phases.map((q, i) => (
          <div key={q.quarter} className="relative flex flex-col rounded-2xl bg-surface p-4 ring-1 ring-line">
            <div className="flex items-center justify-between gap-2">
              <span className={cn("grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold text-white", isOne ? "bg-one-gradient" : "bg-ace-gradient")}>{q.quarter}</span>
              <span className="tabular text-[11px] font-semibold text-muted">{q.months}</span>
            </div>
            <p className={cn("mt-3 text-sm font-semibold", isOne ? "text-one-ink" : "text-ace-ink")}>{q.name}</p>
            <ul className="mt-2 space-y-1.5">
              {q.items.map((it) => (
                <li key={keyOf(it)} className="flex gap-1.5 text-[12.5px] leading-snug text-ink">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
                  {tx(it)}
                </li>
              ))}
            </ul>
            {isOne && i < phases.length - 1 && (
              <ArrowRight className="absolute -right-3 top-5 z-10 hidden h-5 w-5 rounded-full bg-card p-0.5 text-one-ink shadow-soft lg:block" />
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <CalendarRange className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          {tx(IMPLEMENTATION[strategy].summary)}{" "}
          {t("Periode ini adalah implementasi awal, bukan seluruh siklus bisnis.", "This is the initial implementation period, not the whole business lifecycle.")}
        </span>
      </p>
    </div>
  );
}
