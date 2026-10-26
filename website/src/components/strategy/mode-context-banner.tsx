"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Compass, Layers, Target } from "lucide-react";
import type { ProductKey } from "@/types/common";
import { MODE_META, useStrategyMode } from "@/hooks/use-strategy-mode";
import { Button } from "@/components/ui/button";
import { L, useI18n, type Bilingual } from "@/lib/i18n";

const SEE_DILEMMA = L("Lihat dilema", "See the dilemma");
const EXPLORE_ONE = L("Jelajahi ONE Strategy", "Explore the ONE Strategy");
const EXPLORE_ACE = L("Jelajahi ACE Strategy", "Explore the ACE Strategy");
const NEUTRAL = L("Mode Netral", "Overview Mode");

const COPY: Record<ProductKey | "portfolio", Record<"overview" | "one" | "ace", { title: Bilingual; text: Bilingual; href: string; cta: Bilingual }>> = {
  events: {
    overview: {
      title: NEUTRAL,
      text: L("Terang Events ditampilkan netral sebagai salah satu dari dua peluang B2B.", "Terang Events is shown neutrally as one of two B2B opportunities."),
      href: "/strategy-lab",
      cta: SEE_DILEMMA,
    },
    one: {
      title: L("ONE: Terang Events hanya _maintenance_", "ONE: Terang Events on maintenance only"),
      text: L(
        "Layanan yang sudah berjalan tetap beroperasi dengan biaya _maintenance_ eksplisit, tanpa pengembangan fitur baru atau kampanye akuisisi agresif.",
        "The existing service keeps running with an explicit maintenance cost — no new feature development or aggressive acquisition campaigns.",
      ),
      href: "/strategies/one",
      cta: EXPLORE_ONE,
    },
    ace: {
      title: L("ACE: Terang Events dikembangkan selektif", "ACE: Terang Events developed selectively"),
      text: L(
        "Smart Event Templates, Repeat Event Planner & Organizer Insight Dashboard dengan batas WIP 1 inisiatif besar.",
        "Smart Event Templates, Repeat Event Planner & Organizer Insight Dashboard, under a WIP limit of 1 major initiative.",
      ),
      href: "/strategies/ace",
      cta: EXPLORE_ACE,
    },
  },
  interview: {
    overview: {
      title: NEUTRAL,
      text: L("AI Candidate Interview ditampilkan netral sebagai salah satu dari dua peluang B2B.", "AI Candidate Interview is shown neutrally as one of two B2B opportunities."),
      href: "/strategy-lab",
      cta: SEE_DILEMMA,
    },
    one: {
      title: L("ONE: seluruh fokus pada AI Candidate Interview", "ONE: full focus on AI Candidate Interview"),
      text: L(
        "AI Interview Intelligence Suite + Pilot-to-Paid Growth Engine, dievaluasi melalui Expansion Gate sebelum _scaling_.",
        "AI Interview Intelligence Suite + Pilot-to-Paid Growth Engine, evaluated through the Expansion Gate before scaling.",
      ),
      href: "/strategies/one",
      cta: EXPLORE_ONE,
    },
    ace: {
      title: L("ACE: Interview dikembangkan dalam portofolio", "ACE: Interview developed within the portfolio"),
      text: L(
        "_Workflow_ HR esensial dibangun selektif dengan alokasi kapasitas terkendali bersama Terang Events.",
        "Essential HR workflows are built selectively, with capacity allocation controlled alongside Terang Events.",
      ),
      href: "/strategies/ace",
      cta: EXPLORE_ACE,
    },
  },
  portfolio: {
    overview: {
      title: NEUTRAL,
      text: L("Dua produk ditampilkan netral. Aktifkan ONE atau ACE untuk melihat perbedaan prioritas.", "Both products are shown neutrally. Activate ONE or ACE to see how priorities differ."),
      href: "/strategy-lab",
      cta: SEE_DILEMMA,
    },
    one: {
      title: L("ONE — Focus to Grow", "ONE — Focus to Grow"),
      text: L(
        "Interview menjadi satu-satunya produk yang dikembangkan aktif; Events dipertahankan sebagai layanan yang sudah berjalan.",
        "Interview becomes the only product in active development; Events is kept running as an existing service.",
      ),
      href: "/strategies/one",
      cta: EXPLORE_ONE,
    },
    ace: {
      title: L("ACE — Coordinate to Grow", "ACE — Coordinate to Grow"),
      text: L(
        "Kedua produk aktif dengan _go-to-market_ berbeda dan satu sistem kendali kapasitas bersama.",
        "Both products are active, with different go-to-market tracks and one shared capacity-control system.",
      ),
      href: "/strategies/ace",
      cta: EXPLORE_ACE,
    },
  },
};

const ICON = { overview: Compass, one: Target, ace: Layers };

export function ModeContextBanner({ product, className }: { product: ProductKey | "portfolio"; className?: string }) {
  const { mode } = useStrategyMode();
  const { t, tx } = useI18n();
  const copy = COPY[product][mode];
  const Icon = ICON[mode];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className={className}
      >
        <div
          className="flex flex-col gap-4 rounded-2xl p-5 text-white shadow-card sm:flex-row sm:items-center sm:justify-between"
          style={{ backgroundImage: MODE_META[mode].gradient }}
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                {t("Mode Strategi", "Strategy Mode")} · {t(MODE_META[mode].label)}
              </p>
              <p className="font-semibold">{tx(copy.title)}</p>
              <p className="mt-0.5 text-sm text-white/85">{tx(copy.text)}</p>
            </div>
          </div>
          <Button href={copy.href} variant="light" size="sm" className="shrink-0 self-start sm:self-center">
            {t(copy.cta)} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
