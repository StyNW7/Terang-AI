import type { Metadata } from "next";
import { ArrowRight, Brain, CalendarDays } from "lucide-react";
import { Container, PageHero, Section } from "@/components/layout/container";
import { ProductCards } from "@/components/landing/product-cards";
import { ModeContextBanner } from "@/components/strategy/mode-context-banner";
import { SectionHeading } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { POSITIONING } from "@/data/company";

export const metadata: Metadata = { title: "Dua Produk B2B" };

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Kenali Dua Peluang Bisnis"
        title={
          <>
            Satu perusahaan, <span className="text-gradient">dua produk B2B.</span>
          </>
        }
        description="Terang Events (EventTech) dan AI Candidate Interview (HRTech) sama-sama memanfaatkan kapabilitas AI Terang — tetapi pembeli, workflow, dan ekonominya berbeda."
        aside={
          <div className="relative flex items-end justify-center">
            <Mascot name="events" size={210} preload className="relative -mr-6" />
            <Mascot name="interview" size={230} className="relative [animation-delay:1.5s]" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/dashboard/events" variant="secondary">
            <CalendarDays className="h-4 w-4" /> Demo Terang Events
          </Button>
          <Button href="/dashboard/interview" variant="secondary">
            <Brain className="h-4 w-4" /> Demo AI Interview
          </Button>
        </div>
      </PageHero>

      <Container>
        <ModeContextBanner product="portfolio" />
      </Container>

      <Section className="pt-12">
        <Container>
          <ProductCards />
        </Container>
      </Section>

      <Section className="bg-card">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Product Comparison"
              title="Karakteristik yang membentuk dilema"
              description="Perbedaan ini menjelaskan mengapa mengembangkan dua produk sekaligus menuntut koordinasi — dan mengapa fokus pada satu produk juga memiliki risiko."
              action={<SourceLabel type="strategic-proposal" />}
            />
          </Reveal>
          <Reveal>
            <div className="mt-10 overflow-hidden rounded-3xl border border-line shadow-soft">
              <div className="hidden grid-cols-[1fr_1.4fr_1.4fr] bg-surface text-xs font-semibold uppercase tracking-[0.12em] text-muted md:grid">
                <div className="px-5 py-3">Dimensi</div>
                <div className="flex items-center gap-2 px-5 py-3 text-sky-ink">
                  <CalendarDays className="h-4 w-4" /> Terang Events
                </div>
                <div className="flex items-center gap-2 px-5 py-3 text-interview-ink">
                  <Brain className="h-4 w-4" /> AI Candidate Interview
                </div>
              </div>
              <div className="divide-y divide-line bg-card">
                {POSITIONING.map((row) => (
                  <div key={row.label} className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[1fr_1.4fr_1.4fr] md:gap-0 md:px-0 md:py-0">
                    <div className="font-semibold text-ink md:px-5 md:py-4">{row.label}</div>
                    <div className="text-sm text-muted-strong md:border-l md:border-line md:px-5 md:py-4">
                      <span className="mr-1 font-semibold text-sky-ink md:hidden">Events:</span>
                      {row.events}
                    </div>
                    <div className="text-sm text-muted-strong md:border-l md:border-line md:px-5 md:py-4">
                      <span className="mr-1 font-semibold text-interview-ink md:hidden">Interview:</span>
                      {row.interview}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="mt-10 flex justify-center">
            <Button href="/strategy-lab" size="lg">
              Lanjut ke Strategic Dilemma Lab <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
