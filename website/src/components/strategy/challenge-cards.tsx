"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Layers, Target, Users } from "lucide-react";
import { CHALLENGES } from "@/data/strategy";
import { SourceLabel } from "@/components/shared/source-label";
import { cn } from "@/lib/utils";
import { keyOf, useI18n } from "@/lib/i18n";

const ICONS = { users: Users, target: Target, layers: Layers };

export function ChallengeCards() {
  const [open, setOpen] = useState<string | null>("capacity");
  const { t, tx } = useI18n();
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {CHALLENGES.map((c, i) => {
        const Icon = ICONS[c.icon];
        const isOpen = open === c.id;
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition",
              isOpen ? "border-brand/40 shadow-card" : "border-line",
            )}
          >
            <div className="relative overflow-hidden bg-navy-gradient p-6 text-white">
              <span className="absolute -right-2 -top-6 font-display text-[110px] font-semibold leading-none text-white/[0.07]">{c.number}</span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/12 ring-1 ring-white/20">
                <Icon className="h-5 w-5 text-sky" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-sky">{t("Tantangan", "Challenge")} {c.number}</p>
              <h3 className="mt-1 text-xl font-semibold">{c.english}</h3>
              <p className="text-sm text-white/70">{tx(c.title)}</p>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-sm leading-relaxed text-muted-strong">{tx(c.summary)}</p>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : c.id)}
                aria-expanded={isOpen}
                className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-ink"
              >
                {isOpen ? t("Sembunyikan detail", "Hide details") : tx("Lihat _driver_ & implikasi", "See drivers & implications")}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{tx("_Driver_", "Drivers")}</p>
                        <ul className="mt-2 space-y-1.5 text-[13px] text-ink">
                          {c.drivers.map((d) => (
                            <li key={keyOf(d)} className="flex gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" /> {tx(d)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t("Implikasi", "Implications")}</p>
                        <ul className="mt-2 space-y-1.5 text-[13px] text-ink">
                          {c.implications.map((d) => (
                            <li key={keyOf(d)} className="flex gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" /> {tx(d)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        {t("Kategori bukti:", "Evidence category:")} <SourceLabel type={c.evidence} compact />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
