"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { Pillar } from "@/data/strategy";
import { cn } from "@/lib/utils";

/** O-N-E / A-C-E pipeline that doubles as tab navigation (synced to ?pillar=). */
export function PillarTabs({
  pillars,
  panels,
  variant,
}: {
  pillars: Pillar[];
  panels: Record<string, ReactNode>;
  variant: "one" | "ace";
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const fromUrl = params.get("pillar");
  const [local, setLocal] = useState(pillars[0].key);
  const active = fromUrl && pillars.some((p) => p.key === fromUrl) ? fromUrl : local;

  const select = (key: string) => {
    setLocal(key);
    router.replace(`${pathname}?pillar=${key}`, { scroll: false });
  };

  const gradient = variant === "one" ? "bg-one-gradient" : "bg-ace-gradient";
  const activeIndex = pillars.findIndex((p) => p.key === active);

  return (
    <div>
      <div className="relative grid gap-3 md:grid-cols-3">
        {pillars.map((p, i) => {
          const isActive = p.key === active;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => select(p.key)}
              aria-pressed={isActive}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300",
                isActive ? "border-transparent text-white shadow-lift" : "border-line bg-white text-ink shadow-soft hover:-translate-y-0.5 hover:shadow-card",
              )}
            >
              {isActive && <motion.span layoutId={`pillar-bg-${variant}`} className={cn("absolute inset-0", gradient)} transition={{ type: "spring", stiffness: 300, damping: 32 }} />}
              <span className="relative z-10 flex items-start gap-4">
                <span
                  className={cn(
                    "grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-3xl font-extrabold",
                    isActive ? "bg-white/15 text-white ring-1 ring-white/25" : cn(gradient, "text-white"),
                  )}
                >
                  {p.letter}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-[11px] font-bold uppercase tracking-[0.14em]", isActive ? "text-white/75" : "text-muted")}>
                    Pilar {i + 1} · {p.program}
                  </span>
                  <span className="mt-0.5 block text-lg font-extrabold leading-tight">{p.name}</span>
                  <span className={cn("mt-1 block text-[13px] leading-snug", isActive ? "text-white/80" : "text-muted-strong")}>{p.purpose}</span>
                </span>
              </span>
              {i < pillars.length - 1 && (
                <span className="absolute -right-2 top-1/2 z-20 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-brand/40 md:block" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#e6eef7]">
        <motion.div className={cn("h-full rounded-full", gradient)} animate={{ width: `${((activeIndex + 1) / pillars.length) * 100}%` }} />
      </div>
      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            {panels[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
