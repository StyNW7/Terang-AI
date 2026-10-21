"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Compass, Layers, Target } from "lucide-react";
import type { ProductKey } from "@/types/common";
import { MODE_META, useStrategyMode } from "@/hooks/use-strategy-mode";
import { Button } from "@/components/ui/button";

const COPY: Record<ProductKey | "portfolio", Record<"overview" | "one" | "ace", { title: string; text: string; href: string; cta: string }>> = {
  events: {
    overview: { title: "Mode Overview", text: "Terang Events ditampilkan netral sebagai salah satu dari dua peluang B2B.", href: "/strategy-lab", cta: "Lihat dilema" },
    one: { title: "ONE: Terang Events maintenance-only", text: "Layanan existing tetap berjalan dengan biaya maintenance eksplisit, tanpa pengembangan fitur baru atau kampanye akuisisi agresif.", href: "/strategies/one", cta: "Jelajahi ONE Strategy" },
    ace: { title: "ACE: Terang Events dikembangkan selektif", text: "Smart Event Templates, Repeat Event Planner & Organizer Growth Insights dengan batas WIP 1 inisiatif besar.", href: "/strategies/ace", cta: "Jelajahi ACE Strategy" },
  },
  interview: {
    overview: { title: "Mode Overview", text: "AI Candidate Interview ditampilkan netral sebagai salah satu dari dua peluang B2B.", href: "/strategy-lab", cta: "Lihat dilema" },
    one: { title: "ONE: seluruh fokus pada AI Candidate Interview", text: "AI Interview Intelligence Suite + Pilot-to-Paid Growth Engine, dievaluasi melalui Expansion Gate sebelum scaling.", href: "/strategies/one", cta: "Jelajahi ONE Strategy" },
    ace: { title: "ACE: Interview dikembangkan dalam portofolio", text: "Workflow HR esensial dibangun selektif dengan alokasi kapasitas terkendali bersama Terang Events.", href: "/strategies/ace", cta: "Jelajahi ACE Strategy" },
  },
  portfolio: {
    overview: { title: "Mode Overview", text: "Dua produk ditampilkan netral. Aktifkan ONE atau ACE untuk melihat perbedaan prioritas.", href: "/strategy-lab", cta: "Lihat dilema" },
    one: { title: "ONE — Focus to Grow", text: "Interview menjadi satu-satunya produk yang dikembangkan aktif; Events dipertahankan sebagai layanan existing.", href: "/strategies/one", cta: "Jelajahi ONE Strategy" },
    ace: { title: "ACE — Coordinate to Grow", text: "Kedua produk aktif dengan go-to-market berbeda dan satu sistem kendali kapasitas bersama.", href: "/strategies/ace", cta: "Jelajahi ACE Strategy" },
  },
};

const ICON = { overview: Compass, one: Target, ace: Layers };

export function ModeContextBanner({ product, className }: { product: ProductKey | "portfolio"; className?: string }) {
  const { mode } = useStrategyMode();
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
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Strategy Mode · {MODE_META[mode].label}</p>
              <p className="font-bold">{copy.title}</p>
              <p className="mt-0.5 text-sm text-white/85">{copy.text}</p>
            </div>
          </div>
          <Button href={copy.href} variant="light" size="sm" className="shrink-0 self-start sm:self-center">
            {copy.cta} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
