import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowRight, Brain, CalendarDays, Scale, ShieldCheck, Target } from "lucide-react";
import { Container, Section } from "@/components/layout/container";
import { StrategyHero } from "@/components/strategy/strategy-hero";
import { PillarTabs } from "@/components/strategy/pillar-tabs";
import { ModeActivator } from "@/components/strategy/mode-activator";
import { OnePillarOptimize } from "@/components/strategy/one/pillar-optimize";
import { OnePillarNavigate } from "@/components/strategy/one/pillar-navigate";
import { OnePillarEvaluate } from "@/components/strategy/one/pillar-evaluate";
import { PhaseRoadmap } from "@/components/strategy/phase-roadmap";
import { FinancialProjection, ProposalTargets } from "@/components/strategy/proposal-targets";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { ONE_STRATEGY } from "@/data/strategy";
import { T } from "@/lib/i18n";
import { L } from "@/lib/i18n-core";

export const metadata: Metadata = { title: "ONE Strategy — PRO" };

function FocusVisual() {
  return (
    <div className="relative rounded-[28px] bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
        <T id="_Pipeline_ pertumbuhan terfokus" en="Focused growth pipeline" />
      </p>
      <div className="mt-4 space-y-2.5">
        {ONE_STRATEGY.pillars.map((p, i) => (
          <div key={p.key} className="flex items-center gap-3 rounded-2xl bg-white/12 p-3 ring-1 ring-white/15" style={{ marginLeft: i * 18, marginRight: i * 18 }}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white font-display text-xl font-semibold text-[#2251c9]">{p.letter}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">{p.name}</p>
              <p className="text-[11px] leading-snug text-white/70">{p.program}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col items-center">
        <span className="h-6 w-px bg-white/40" />
        <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2251c9] shadow-lift">
          <Target className="h-4 w-4" /> AI Candidate Interview
        </span>
        <span className="mt-3 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/75 ring-1 ring-white/15">
          <CalendarDays className="h-3.5 w-3.5" /> Terang Events · <T id="hanya _maintenance_" en="maintenance-only" />
        </span>
      </div>
    </div>
  );
}

export default function OneStrategyPage() {
  return (
    <>
      <StrategyHero
        variant="one"
        eyebrow={ONE_STRATEGY.position}
        title="ONE Strategy"
        tagline={ONE_STRATEGY.tagline}
        thesis={ONE_STRATEGY.thesis}
        mascot="target"
        visual={<FocusVisual />}
      >
        <ModeActivator target="one" />
      </StrategyHero>

      <Section className="pt-14">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Optimize → Navigate → Evaluate"
              title={<T id="Tiga pilar, satu fokus produk" en="Three pillars, one product focus" />}
              description={
                <T
                  id="Pilih pilar untuk menjelajahi fitur, _go-to-market_, dan gerbang ekspansi ONE Strategy."
                  en="Pick a pillar to explore the ONE Strategy's features, go-to-market and expansion gate."
                />
              }
            />
          </Reveal>
          <div className="mt-10">
            <Suspense fallback={<div className="skeleton h-40 rounded-2xl" />}>
              <PillarTabs
                variant="one"
                pillars={ONE_STRATEGY.pillars}
                panels={{
                  optimize: <OnePillarOptimize />,
                  navigate: <OnePillarNavigate />,
                  evaluate: <OnePillarEvaluate />,
                }}
              />
            </Suspense>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Rencana Implementasi" en="Implementation Plan" />}
              title={<T id="Roadmap, target & kelayakan ONE" en="ONE roadmap, targets & feasibility" />}
              description={
                <T
                  id="12 bulan implementasi awal dibagi per fase. Target dan angka finansial adalah proyeksi proposal, bukan hasil aktual."
                  en="A 12-month initial implementation, phase by phase. Targets and financial figures are proposal projections, not actual results."
                />
              }
            />
          </Reveal>
          <div className="mt-10 space-y-6">
            <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-ink">
                <T id="_Roadmap_ implementasi (12 bulan)" en="Implementation roadmap (12 months)" />
              </h3>
              <PhaseRoadmap strategy="one" className="mt-5" />
            </div>
            <ProposalTargets strategy="one" />
            <FinancialProjection focus="one" />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Brain, title: L("Coba demo Interview", "Try the Interview demo"), text: L("_Builder_, wawancara kandidat & laporan bukti.", "Builder, candidate interviews & evidence reports."), href: "/dashboard/interview" },
              { icon: ShieldCheck, title: L("Portofolio & Expansion Gate", "Portfolio & Expansion Gate"), text: L("Lihat KPI & matriks keputusan.", "See KPIs & the decision matrix."), href: "/dashboard/portfolio" },
              { icon: Scale, title: L("Bandingkan dengan ACE", "Compare with ACE"), text: L("Asumsi sama, kapasitas sama.", "Same assumptions, same capacity."), href: "/dashboard/simulator" },
            ].map((c) => (
              <Button key={c.href} href={c.href} variant="secondary" className="h-auto justify-between rounded-2xl p-5 text-left">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-soft text-one-ink">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      <T v={c.title} />
                    </span>
                    <span className="block whitespace-normal text-xs font-normal text-muted-strong">
                      <T v={c.text} />
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Button>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
