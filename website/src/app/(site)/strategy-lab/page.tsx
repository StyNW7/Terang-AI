import type { Metadata } from "next";
import { ArrowRight, Brain, CalendarDays, HelpCircle, Layers, Quote, Scale, Target } from "lucide-react";
import { Container, PageHero, Section } from "@/components/layout/container";
import { DilemmaFlow } from "@/components/strategy/dilemma-flow";
import { ChallengeCards } from "@/components/strategy/challenge-cards";
import { SurveyEvidence } from "@/components/strategy/survey-evidence";
import { SectionHeading } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { POSITIONING } from "@/data/company";
import { ACE_STRATEGY, CORE_INSIGHT, KEY_QUESTION, ONE_STRATEGY } from "@/data/strategy";
import { T } from "@/lib/i18n";
import { keyOf } from "@/lib/i18n-core";

export const metadata: Metadata = { title: "Strategic Dilemma Lab" };

export default function StrategyLabPage() {
  return (
    <>
      <PageHero
        eyebrow="Strategic Dilemma Lab"
        title={
          <T
            id={
              <>
                Dua Peluang. Sumber Daya Terbatas. <span className="text-gradient">Satu Keputusan Strategis.</span>
              </>
            }
            en={
              <>
                Two Opportunities. Limited Resources. <span className="text-gradient">One Strategic Decision.</span>
              </>
            }
          />
        }
        description={
          <T
            id="Ekspansi melalui Terang Events dan AI Candidate Interview membuka dua peluang B2B dengan pasar, kebutuhan, dan kompleksitas berbeda. Haruskah sumber daya dipusatkan — atau dikoordinasikan?"
            en="Expanding through Terang Events and AI Candidate Interview opens two B2B opportunities with different markets, needs and complexity. Should resources be concentrated — or coordinated?"
          />
        }
        aside={
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 m-auto h-60 w-60 rounded-full bg-sky/30 blur-3xl" />
            <Mascot name="think" size={300} preload className="relative" />
          </div>
        }
      />

      <Section className="pb-16 pt-4 md:pb-20">
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
              <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr]">
                <span className="grid h-20 w-20 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/20">
                  <HelpCircle className="h-10 w-10 text-sky" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky">
                    <T id="Pertanyaan Strategis Kunci" en="Key Strategic Question" />
                  </p>
                  <p className="mt-3 font-display text-2xl font-semibold leading-snug md:text-[1.9rem]">
                    <T v={KEY_QUESTION} />
                  </p>
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
              eyebrow={<T id="Analisis Akar Masalah" en="Root Cause Analysis" />}
              title={<T id="Tiga tantangan strategis utama" en="Three core strategic challenges" />}
              description={
                <T
                  id="Setiap kartu dapat diperluas untuk melihat _driver_, implikasi, dan kategori buktinya. Ini adalah kerangka analisis risiko, bukan bukti kegagalan komersial."
                  en="Expand each card to see its drivers, implications and evidence category. This is a risk-analysis framework, not evidence of commercial failure."
                />
              }
            />
          </Reveal>
          <div className="mt-10">
            <ChallengeCards />
          </div>
        </Container>
      </Section>

      {/* Product comparison */}
      <Section className="border-y border-line bg-subtle">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Bukti Pasar" en="Market Evidence" />}
              title={<T id="Apa kata 113 responden survei?" en="What did 113 survey respondents say?" />}
              description={
                <T
                  id="Survei independen tim untuk menguji kebutuhan kedua produk. Hasilnya mendukung kedua sisi argumen — bukan menentukan pemenang."
                  en="The team's independent survey tests the need for both products. The results support both sides of the argument — they do not pick a winner."
                />
              }
            />
          </Reveal>
          <div className="mt-10">
            <SurveyEvidence />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Perbandingan Produk" en="Product Comparison" />}
              title={<T id="Bandingkan karakter dua peluang" en="Compare the character of both opportunities" />}
              action={<SourceLabel type="strategic-proposal" />}
            />
          </Reveal>
          <div className="mt-10 grid gap-4">
            {POSITIONING.map((row, i) => (
              <Reveal key={keyOf(row.label)} delay={i * 0.04}>
                <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
                  <div className="rounded-2xl border border-line bg-card p-4 shadow-soft md:text-right">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-ink md:justify-end">
                      <CalendarDays className="h-3.5 w-3.5" /> Terang Events
                    </p>
                    <p className="mt-1 text-sm text-ink">
                      <T v={row.events} />
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="rounded-full bg-navy px-4 py-2 text-center text-xs font-semibold text-white shadow-soft">
                      <T v={row.label} />
                    </span>
                  </div>
                  <div className="rounded-2xl border border-line bg-card p-4 shadow-soft">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-interview-ink">
                      <Brain className="h-3.5 w-3.5" /> AI Candidate Interview
                    </p>
                    <p className="mt-1 text-sm text-ink">
                      <T v={row.interview} />
                    </p>
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
              eyebrow={<T id="Dua Alternatif Strategi" en="Two Strategic Alternatives" />}
              title={<T id="Dua jawaban yang sama-sama layak diuji" en="Two answers that both deserve testing" />}
              description={
                <T
                  id="Kedua kartu sengaja berukuran sama. Simulator membandingkan keduanya dengan asumsi bersama — hasilnya bergantung pada kondisi pasar."
                  en="Both cards are deliberately the same size. The simulator compares them on shared assumptions — the outcome depends on market conditions."
                />
              }
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { s: ONE_STRATEGY, key: "ONE", g: "bg-one-gradient", icon: Target, href: "/strategies/one", mascot: "target" as const, cta: <T id="Jelajahi ONE Strategy" en="Explore the ONE Strategy" /> },
              { s: ACE_STRATEGY, key: "ACE", g: "bg-ace-gradient", icon: Layers, href: "/strategies/ace", mascot: "puzzle" as const, cta: <T id="Jelajahi ACE Strategy" en="Explore the ACE Strategy" /> },
            ].map(({ s, key, g, icon: Icon, href, mascot, cta }, i) => (
              <Reveal key={key} delay={i * 0.1}>
                <div className={`relative h-full overflow-hidden rounded-[28px] p-8 text-white shadow-lift ${g}`}>
                  <div className="bg-grid-dark absolute inset-0 opacity-50" />
                  <Mascot name={mascot} size={150} className="absolute -bottom-4 -right-2 opacity-95" />
                  <div className="relative max-w-[78%]">
                    <div className="flex items-center gap-2">
                      <Icon className="h-6 w-6" />
                      <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/25">
                        <T v={s.badge} />
                      </span>
                    </div>
                    <p className="mt-5 font-display text-5xl font-semibold">{key}</p>
                    <p className="text-xl font-semibold">{s.shortTitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/85">
                      <T v={s.thesis} />
                    </p>
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
              <p className="font-display text-xl font-semibold leading-snug text-ink md:text-2xl">
                <T v={CORE_INSIGHT} />
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                <T id="_Insight_ Bisnis Utama" en="Core Business Insight" />
              </p>
              <Button href="/dashboard/simulator" variant="secondary">
                <Scale className="h-4 w-4" /> <T id="Bandingkan Dampak Strategi" en="Compare Strategy Impact" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
