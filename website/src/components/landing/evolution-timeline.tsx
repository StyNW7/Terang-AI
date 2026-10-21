"use client";

import { motion } from "motion/react";
import { BookOpenCheck, Briefcase, GitBranch, MessagesSquare } from "lucide-react";
import { EVOLUTION } from "@/data/company";
import { SourceLabel } from "@/components/shared/source-label";
import { cn } from "@/lib/utils";

const ICONS = [BookOpenCheck, MessagesSquare, Briefcase, GitBranch];

export function EvolutionTimeline({ variant = "horizontal" }: { variant?: "horizontal" | "vertical" }) {
  if (variant === "vertical") {
    return (
      <ol className="relative space-y-6 border-l-2 border-dashed border-[#cfe0f2] pl-8">
        {EVOLUTION.map((step, i) => {
          const Icon = ICONS[i];
          const last = i === EVOLUTION.length - 1;
          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative"
            >
              <span
                className={cn(
                  "absolute -left-[49px] top-1 grid h-8 w-8 place-items-center rounded-full ring-4 ring-surface",
                  last ? "bg-brand-gradient text-white" : "bg-white text-brand-ink shadow-soft",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className={cn("rounded-2xl border p-5", last ? "border-transparent bg-navy-gradient text-white" : "border-line bg-white shadow-soft")}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("text-xs font-bold uppercase tracking-[0.14em]", last ? "text-sky" : "text-brand-ink")}>
                    {step.phase} · {step.period}
                  </span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-bold", last ? "bg-white/10 text-white" : "bg-soft text-brand-ink")}>
                    {step.segment}
                  </span>
                  <SourceLabel type={step.evidence} compact dark={last} />
                </div>
                <h3 className={cn("mt-2 text-lg font-bold", last ? "text-white" : "text-ink")}>{step.title}</h3>
                <p className={cn("mt-1 text-sm leading-relaxed", last ? "text-white/75" : "text-muted-strong")}>{step.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {step.items.map((it) => (
                    <span
                      key={it}
                      className={cn(
                        "rounded-lg px-2 py-1 text-xs font-semibold",
                        last ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-surface text-navy ring-1 ring-line",
                      )}
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-[27px] hidden h-[3px] rounded-full bg-[#dfeaf6] lg:block">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full origin-left rounded-full bg-brand-gradient"
        />
      </div>
      <ol className="grid gap-5 lg:grid-cols-4">
        {EVOLUTION.map((step, i) => {
          const Icon = ICONS[i];
          const last = i === EVOLUTION.length - 1;
          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div
                className={cn(
                  "relative z-10 mb-5 grid h-14 w-14 place-items-center rounded-2xl ring-[6px] ring-surface",
                  last ? "bg-brand-gradient text-white shadow-glow" : "bg-white text-brand-ink shadow-card",
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div
                className={cn(
                  "h-full rounded-2xl border p-5 transition hover:-translate-y-1",
                  last ? "border-transparent bg-navy-gradient text-white shadow-lift" : "border-line bg-white shadow-soft hover:shadow-card",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("text-xs font-bold uppercase tracking-[0.14em]", last ? "text-sky" : "text-brand-ink")}>{step.period}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-bold", last ? "bg-white/10" : "bg-soft text-brand-ink")}>
                    {step.segment}
                  </span>
                </div>
                <h3 className={cn("mt-3 text-[17px] font-bold leading-snug", last ? "text-white" : "text-ink")}>{step.title}</h3>
                <p className={cn("mt-2 text-[13.5px] leading-relaxed", last ? "text-white/75" : "text-muted-strong")}>{step.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
