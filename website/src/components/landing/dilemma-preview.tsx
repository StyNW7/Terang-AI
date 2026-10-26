"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Brain, CalendarDays, Users } from "lucide-react";
import { BASE_ASSUMPTIONS } from "@/data/scenarios";
import { computeStrategy } from "@/lib/finance";
import { formatIDRCompact, formatPercent } from "@/lib/formatters";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SourceLabel } from "@/components/shared/source-label";
import { cn } from "@/lib/utils";
import { L, useI18n } from "@/lib/i18n";

function describe(share: number) {
  if (share >= 100)
    return {
      title: L("Menyerupai ONE Strategy", "Resembles the ONE Strategy"),
      text: L(
        "Seluruh kapasitas pengembangan & komersial fokus pada AI Candidate Interview; Terang Events hanya _maintenance_.",
        "All development & commercial capacity goes to AI Candidate Interview; Terang Events is maintenance-only.",
      ),
      tone: "one" as const,
    };
  if (share >= 70)
    return {
      title: L("ACE — condong ke Interview", "ACE — leaning to Interview"),
      text: L("Dua produk aktif, prioritas lebih besar pada Interview dengan biaya koordinasi tambahan.", "Two active products, with more priority on Interview and extra coordination cost."),
      tone: "ace" as const,
    };
  if (share >= 45)
    return {
      title: L("ACE — seimbang terkendali", "ACE — controlled balance"),
      text: L("Kedua produk mendapat aktivitas bermakna. Ingat: ACE tidak mewajibkan pembagian 50:50.", "Both products get meaningful activity. Remember: ACE does not require a 50:50 split."),
      tone: "ace" as const,
    };
  return {
    title: L("ACE — condong ke Events", "ACE — leaning to Events"),
    text: L("Events menjadi mesin pertumbuhan utama; Interview divalidasi secara terbatas.", "Events becomes the main growth engine; Interview is validated on a limited scale."),
    tone: "ace" as const,
  };
}

export function DilemmaPreview() {
  const [share, setShare] = useState(55);
  const { t, tx } = useI18n();
  const result = useMemo(() => {
    const a = { ...BASE_ASSUMPTIONS, ace: { ...BASE_ASSUMPTIONS.ace, interviewShare: share / 100 } };
    return share >= 100 ? computeStrategy("one", a) : computeStrategy("ace", a);
  }, [share]);
  const d = describe(share);
  const productPeople = 3;
  const peopleInterview = (share / 100) * productPeople;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">{tx("Geser alokasi kapasitas tim _Product_ & _Ops_", "Shift the Product & Ops team capacity allocation")}</p>
          <SourceLabel type="illustrative-assumption" compact />
        </div>
        <div className="mt-6 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-sky-ink">
            <CalendarDays className="h-4 w-4" /> Terang Events {100 - share}%
          </span>
          <span className="flex items-center gap-1.5 text-one-ink">
            AI Candidate Interview {share}% <Brain className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-2 flex h-4 overflow-hidden rounded-full bg-track">
          <motion.div className="h-full bg-gradient-to-r from-[#8fd8ff] to-[#39b7ff]" animate={{ width: `${100 - share}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
          <motion.div className="h-full bg-gradient-to-r from-[#4a90e2] to-[#2251c9]" animate={{ width: `${share}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
        </div>
        <Slider
          className="mt-6"
          label={t("Porsi kapasitas untuk AI Candidate Interview", "Capacity share for AI Candidate Interview")}
          value={share}
          min={20}
          max={100}
          step={5}
          onChange={setShare}
          display={`${share}%`}
          color="#2251c9"
          hint={t("100% = fokus penuh (ONE). Di bawah 100% = dua produk dikembangkan bersama (ACE).", "100% = full focus (ONE). Below 100% = both products developed together (ACE).")}
        />
        <div className="mt-6 grid grid-cols-3 gap-3">
          {Array.from({ length: productPeople }).map((_, i) => {
            const fill = Math.max(0, Math.min(1, peopleInterview - i));
            return (
              <div key={i} className="rounded-2xl border border-line bg-surface p-3 text-center">
                <div className="relative mx-auto grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-sky-soft text-white">
                  <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4a90e2] to-[#2251c9]" animate={{ width: `${fill * 100}%` }} />
                  <Users className="relative h-5 w-5" />
                </div>
                <p className="mt-2 text-[11px] font-semibold text-muted-strong">Product {i + 1}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <motion.div
          key={d.title.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-3xl p-6 text-white shadow-lift", d.tone === "one" ? "bg-one-gradient" : "bg-ace-gradient")}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">{t("Interpretasi", "Interpretation")}</p>
          <p className="mt-1 font-display text-2xl font-semibold">{tx(d.title)}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{tx(d.text)}</p>
        </motion.div>
        <div className="grid flex-1 grid-cols-2 gap-3">
          {[
            { k: t("Pendapatan 12 bln", "12-month revenue"), v: formatIDRCompact(result.revenue) },
            { k: t("Kontribusi", "Contribution"), v: formatIDRCompact(result.totalContribution) },
            { k: t("Hasil operasional", "Operating result"), v: formatIDRCompact(result.operatingResult), neg: result.operatingResult < 0 },
            { k: t("Utilisasi tim Product", "Product team utilisation"), v: formatPercent(result.capacity.productUtilization), neg: result.capacity.productUtilization > 0.9 },
          ].map((m) => (
            <div key={m.k} className="rounded-2xl border border-line bg-card p-4 shadow-soft">
              <p className="text-xs font-semibold text-muted">{m.k}</p>
              <p className={cn("tabular mt-1 font-display text-xl font-semibold", m.neg ? "text-danger-ink" : "text-ink")}>{m.v}</p>
            </div>
          ))}
        </div>
        <Button href="/strategy-lab" variant="dark" className="self-start">
          {t("Pelajari dilema lengkap", "Explore the full dilemma")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
