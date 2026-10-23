"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Compass } from "lucide-react";
import { NavIcon } from "@/components/navigation/nav-icon";
import { cn } from "@/lib/utils";
import { keyOf, useI18n, type Txt } from "@/lib/i18n";

export interface QuickStartStep {
  title: Txt;
  text: Txt;
  href: string;
  icon: string;
}

const key = (id: string) => `terang-sge:quickstart:${id}`;
const noopSubscribe = () => () => {};

function readStored(id: string) {
  try {
    return window.localStorage.getItem(key(id));
  } catch {
    return null;
  }
}

/** Collapsible "start here" guide that explains a dashboard's flow in a few steps. */
export function QuickStart({ id, title, steps, accent = "bg-brand-gradient" }: { id: string; title: Txt; steps: QuickStartStep[]; accent?: string }) {
  const { t, tx } = useI18n();
  // Remember a collapsed guide per dashboard; the server snapshot keeps SSR markup stable.
  const stored = useSyncExternalStore(noopSubscribe, () => readStored(id), () => null);
  const [override, setOverride] = useState<boolean | null>(null);
  const open = override ?? stored !== "closed";

  const toggle = () => {
    const next = !open;
    setOverride(next);
    try {
      window.localStorage.setItem(key(id), next ? "open" : "closed");
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <section aria-label={t(title)} className="mb-6 overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="flex items-center gap-3">
          <span className={cn("grid h-9 w-9 place-items-center rounded-xl text-white", accent)}>
            <Compass className="h-[18px] w-[18px]" />
          </span>
          <span>
            <span className="block text-[15px] font-semibold text-ink">{tx(title)}</span>
            <span className="block text-[13px] text-muted-strong">
              {t(`${steps.length} langkah untuk memahami alurnya`, `${steps.length} steps to understand the flow`)}
            </span>
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
          {open ? t("Sembunyikan", "Hide") : t("Tampilkan", "Show")}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ol className="grid grid-cols-1 gap-3 border-t border-line p-4 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.href + keyOf(s.title)}>
                  <Link href={s.href} data-spotlight className="group flex h-full flex-col rounded-xl bg-subtle p-4 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand/40">
                    <span className="flex items-center justify-between">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-card text-brand-ink ring-1 ring-line">
                        <NavIcon name={s.icon} className="h-4 w-4" />
                      </span>
                      <span className="tabular text-xs font-medium text-muted">
                        {t("Langkah", "Step")} {i + 1}
                      </span>
                    </span>
                    <span className="mt-3 text-sm font-semibold text-ink">{tx(s.title)}</span>
                    <span className="mt-1 flex-1 text-[13px] leading-relaxed text-muted-strong">{tx(s.text)}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-brand-ink">
                      {t("Buka", "Open")} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
