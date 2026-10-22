import type { Metadata } from "next";
import { ArrowRight, Brain, CalendarDays, HelpCircle, Layers, Quote, Scale, Target } from "lucide-react";
import { Container, PageHero, Section } from "@/components/layout/container";
import { DilemmaFlow } from "@/components/strategy/dilemma-flow";
import { ChallengeCards } from "@/components/strategy/challenge-cards";
import { SectionHeading } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { POSITIONING } from "@/data/company";
import { ACE_STRATEGY, CORE_INSIGHT, KEY_QUESTION, ONE_STRATEGY } from "@/data/strategy";

export const metadata: Metadata = { title: "Strategic Dilemma Lab" };

export default function StrategyLabPage() {
  return (
    <>
      <PageHero
        eyebrow="Strategic Dilemma Lab"
        title={
          <>
            Two Opportunities. Limited Resources. <span className="text-gradient">One Strategic Decision.</span>
          </>
        }
        description="Ekspansi melalui Terang Events dan AI Candidate Interview membuka dua peluang B2B dengan pasar, kebutuhan, dan kompleksitas berbeda. Haruskah sumber daya dipusatkan — atau dikoordinasikan?"
        aside={
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 m-auto h-60 w-60 rounded-full bg-sky/30 blur-3xl" />
            <Mascot name="think" size={300} preload className="relative" />
          </div>
        }
      />

      <Section className="pt-4">
        <Container>
          <DilemmaFlow />
        </Container>
      </Section>

      {/* Key question */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-navy-gradient p-8 text-white shadow-lift md:p-12">
              <div className="bg-grid-dark absolute inset-0 opacity-60" />
              <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-sky/25 blur-3xl" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr]">
                <span className="grid h-20 w-20 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/20">
                  <HelpCircle className="h-10 w-10 text-sky" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky">Key Strategic Question</p>
                  <p className="mt-3 font-display text-2xl font-semibold leading-snug md:text-[1.9rem]">{KEY_QUESTION}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Root causes */}
      <Section className="bg-card">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Root Cause Analysis"
              title="Tiga tantangan strategis utama"
              description="Setiap kartu dapat diperluas untuk melihat driver, implikasi, dan kategori buktinya. Ini adalah kerangka analisis risiko, bukan bukti kegagalan komersial."
            />
          </Reveal>
          <div className="mt-10">
            <ChallengeCards />
          </div>
        </Container>
      </Section>

      {/* Product comparison */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Product Comparison" title="Bandingkan karakter dua peluang" action={<SourceLabel type="strategic-proposal" />} />
          </Reveal>
          <div className="mt-10 grid gap-4">
            {POSITIONING.map((row, i) => (
              <Reveal key={row.label} delay={i * 0.04}>
                <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
                  <div className="rounded-2xl border border-line bg-card p-4 shadow-soft md:text-right">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-ink md:justify-end">
                      <CalendarDays className="h-3.5 w-3.5" /> Terang Events
                    </p>
                    <p className="mt-1 text-sm text-ink">{row.events}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="rounded-full bg-navy px-4 py-2 text-center text-xs font-semibold text-white shadow-soft">{row.label}</span>
                  </div>
                  <div className="rounded-2xl border border-line bg-card p-4 shadow-soft">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-interview-ink">
                      <Brain className="h-3.5 w-3.5" /> AI Candidate Interview
                    </p>
                    <p className="mt-1 text-sm text-ink">{row.interview}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Two alternatives */}
      <Section className="bg-gradient-to-b from-card to-subtle">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Two Strategic Alternatives"
              title="Dua jawaban yang sama-sama layak diuji"
              description="Kedua kartu sengaja berukuran sama. Simulator membandingkan keduanya dengan asumsi bersama — hasilnya bergantung pada kondisi pasar."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { s: ONE_STRATEGY, key: "ONE", g: "bg-one-gradient", icon: Target, href: "/strategies/one", mascot: "target" as const, cta: "Jelajahi ONE Strategy" },
              { s: ACE_STRATEGY, key: "ACE", g: "bg-ace-gradient", icon: Layers, href: "/strategies/ace", mascot: "puzzle" as const, cta: "Jelajahi ACE Strategy" },
            ].map(({ s, key, g, icon: Icon, href, mascot, cta }, i) => (
              <Reveal key={key} delay={i * 0.1}>
                <div className={`relative h-full overflow-hidden rounded-[28px] p-8 text-white shadow-lift ${g}`}>
                  <div className="bg-grid-dark absolute inset-0 opacity-50" />
                  <Mascot name={mascot} size={150} className="absolute -bottom-4 -right-2 opacity-95" />
                  <div className="relative max-w-[78%]">
                    <div className="flex items-center gap-2">
                      <Icon className="h-6 w-6" />
                      <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/25">{s.position.split(" — ")[0]}</span>
                    </div>
                    <p className="mt-5 font-display text-5xl font-bold">{key}</p>
                    <p className="text-xl font-semibold">{s.shortTitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/85">{s.thesis}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.pillars.map((p) => (
                        <span key={p.key} className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                          <strong>{p.letter}</strong> · {p.name}
                        </span>
                      ))}
                    </div>
                    <Button href={href} variant="light" className="mt-7">
                      {cta} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-5 rounded-3xl border border-line bg-card p-7 text-center shadow-soft">
              <Quote className="h-8 w-8 text-sky" />
              <p className="font-display text-xl font-semibold leading-snug text-ink md:text-2xl">{CORE_INSIGHT}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Core Business Insight</p>
              <Button href="/dashboard/simulator" variant="secondary">
                <Scale className="h-4 w-4" /> Bandingkan Dampak Strategi
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
