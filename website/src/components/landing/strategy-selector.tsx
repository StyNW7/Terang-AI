"use client";

import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Layers, Target } from "lucide-react";
import { ACE_STRATEGY, ONE_STRATEGY } from "@/data/strategy";
import { useStrategyMode } from "@/hooks/use-strategy-mode";
import { Mascot } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StrategySelector() {
  const { mode, setMode } = useStrategyMode();
  const cards = [
    { key: "one" as const, s: ONE_STRATEGY, icon: Target, mascot: "target" as const, gradient: "bg-one-gradient", href: "/strategies/one", cta: "Jelajahi ONE Strategy", subtitle: "Focused Single-Product Growth" },
    { key: "ace" as const, s: ACE_STRATEGY, icon: Layers, mascot: "puzzle" as const, gradient: "bg-ace-gradient", href: "/strategies/ace", cta: "Jelajahi ACE Strategy", subtitle: "Coordinated Dual-Product Growth" },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {cards.map(({ key, s, icon: Icon, mascot, gradient, href, cta, subtitle }) => {
        const selected = mode === key;
        return (
          <motion.div
            key={key}
            whileHover={{ y: -4 }}
            className={cn(
              "relative overflow-hidden rounded-[28px] p-[1.5px] transition-shadow",
              selected ? "shadow-lift" : "shadow-card",
            )}
            style={{ backgroundImage: selected ? "linear-gradient(135deg,#39b7ff,#2251c9)" : "linear-gradient(135deg,var(--color-line),var(--color-line))" }}
          >
            <div className="relative h-full overflow-hidden rounded-[27px] bg-card">
              <div className={cn("relative overflow-hidden p-7 text-white", gradient)}>
                <div className="bg-grid-dark absolute inset-0 opacity-50" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/25">
                        {key === "one" ? "PRO" : "KONTRA"}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-4xl font-bold tracking-tight">{key.toUpperCase()}</h3>
                    <p className="mt-1 text-sm font-semibold text-white/85">{subtitle}</p>
                    <p className="mt-3 text-lg font-semibold">“{s.tagline}”</p>
                  </div>
                  <Mascot name={mascot} size={120} className="-mr-3 -mt-2 hidden shrink-0 sm:block" />
                </div>
              </div>
              <div className="p-7">
                <p className="text-sm leading-relaxed text-muted-strong">{s.thesis}</p>
                <div className="mt-5 grid gap-2">
                  {s.pillars.map((p) => (
                    <div key={p.key} className="flex items-center gap-3 rounded-xl bg-surface p-2.5 ring-1 ring-line">
                      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display text-lg font-semibold text-white", gradient)}>{p.letter}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{p.name}</p>
                        <p className="truncate text-xs text-muted">{p.program}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Button variant={selected ? "secondary" : key} onClick={() => setMode(key)} size="sm">
                    {selected ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-success" /> Mode aktif
                      </>
                    ) : (
                      <>Aktifkan mode {key.toUpperCase()}</>
                    )}
                  </Button>
                  <Button href={href} variant="ghost" size="sm">
                    {cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
