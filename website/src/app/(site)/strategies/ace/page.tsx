import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowRight, Brain, CalendarDays, Gauge, Scale, ShieldAlert } from "lucide-react";
import { Container, Section } from "@/components/layout/container";
import { StrategyHero } from "@/components/strategy/strategy-hero";
import { PillarTabs } from "@/components/strategy/pillar-tabs";
import { ModeActivator } from "@/components/strategy/mode-activator";
import { AcePillarAgile } from "@/components/strategy/ace/pillar-agile";
import { AcePillarCoordinate } from "@/components/strategy/ace/pillar-coordinate";
import { AcePillarEvolve } from "@/components/strategy/ace/pillar-evolve";
import { Button } from "@/components/ui/button";
import { SectionHeading, Callout } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { ACE_STRATEGY } from "@/data/strategy";

export const metadata: Metadata = { title: "ACE Strategy — KONTRA" };

function DualTrackVisual() {
  return (
    <div className="relative rounded-[28px] bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">Two tracks · one resource system</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { icon: CalendarDays, name: "Terang Events", sub: "Host Smarter" },
          { icon: Brain, name: "AI Interview", sub: "Hire Smarter" },
        ].map((t) => (
          <div key={t.name} className="rounded-2xl bg-white/12 p-3 text-center ring-1 ring-white/15">
            <t.icon className="mx-auto h-6 w-6" />
            <p className="mt-2 text-sm font-semibold">{t.name}</p>
            <p className="text-[11px] text-white/70">{t.sub}</p>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 60" className="h-14 w-full" fill="none" aria-hidden>
        <path d="M75 0 C 75 35, 150 25, 150 60" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="5 5" className="animate-dash" />
        <path d="M225 0 C 225 35, 150 25, 150 60" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="5 5" className="animate-dash" />
      </svg>
      <div className="rounded-2xl bg-white p-4 text-center text-[#0a7aa6] shadow-lift">
        <p className="flex items-center justify-center gap-2 font-display text-lg font-semibold">
          <Gauge className="h-5 w-5" /> ACE Command Center
        </p>
        <p className="text-xs text-[#475a72]">Kapasitas · anggaran · WIP · risiko</p>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {ACE_STRATEGY.pillars.map((p) => (
          <span key={p.key} className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/20">
            <strong>{p.letter}</strong> · {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AceStrategyPage() {
  return (
    <>
      <StrategyHero
        variant="ace"
        eyebrow={ACE_STRATEGY.position}
        title="ACE Strategy"
        tagline={ACE_STRATEGY.tagline}
        thesis={ACE_STRATEGY.thesis}
        mascot="puzzle"
        visual={<DualTrackVisual />}
      >
        <ModeActivator target="ace" />
      </StrategyHero>

      <Section className="pt-14">
        <Container>
          <Callout tone="info" icon={<ShieldAlert className="h-[18px] w-[18px]" />} title={`${ACE_STRATEGY.approach} — guardrail`}>
            {ACE_STRATEGY.guardrail} ACE tidak menjanjikan mempertahankan dua produk dengan segala cara: setiap produk memiliki kondisi exit &
            reassessment yang transparan.
          </Callout>
          <Reveal>
            <SectionHeading
              className="mt-12"
              eyebrow="Agile → Coordinate → Evaluate & Evolve"
              title="Tiga pilar, dua produk, satu mesin koordinasi"
              description="Pilih pilar untuk menjelajahi backlog ganda, go-to-market ganda, dan intelijen portofolio ACE."
            />
          </Reveal>
          <div className="mt-10">
            <Suspense fallback={<div className="skeleton h-40 rounded-2xl" />}>
              <PillarTabs
                variant="ace"
                pillars={ACE_STRATEGY.pillars}
                panels={{
                  agile: <AcePillarAgile />,
                  coordinate: <AcePillarCoordinate />,
                  evolve: <AcePillarEvolve />,
                }}
              />
            </Suspense>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: CalendarDays, title: "Coba Smart Templates", text: "Demo Terang Events dengan usulan ACE.", href: "/dashboard/events" },
              { icon: Gauge, title: "Atur Alokasi Sumber Daya", text: "ACE Command Center untuk 7 personel.", href: "/dashboard/operations" },
              { icon: Scale, title: "Bandingkan dengan ONE", text: "Asumsi sama, kapasitas sama.", href: "/dashboard/simulator" },
            ].map((c) => (
              <Button key={c.href} href={c.href} variant="secondary" className="h-auto justify-between rounded-2xl p-5 text-left">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-ace-soft text-ace-ink">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{c.title}</span>
                    <span className="block whitespace-normal text-xs font-normal text-muted-strong">{c.text}</span>
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
