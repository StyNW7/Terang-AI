import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Building2, Factory, Flag, Lightbulb, MapPin, Quote } from "lucide-react";
import { Container, PageHero, Section } from "@/components/layout/container";
import { EvolutionTimeline } from "@/components/landing/evolution-timeline";
import { ProductCards } from "@/components/landing/product-cards";
import { PositioningMap } from "@/components/company/positioning-map";
import { SectionHeading, Callout } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { B2C_OFFERINGS, COMPANY, PRODUCTS } from "@/data/company";

export const metadata: Metadata = { title: "Company Overview" };

export default function CompanyPage() {
  const identity = [
    { icon: Building2, label: "Nama perusahaan", value: COMPANY.name },
    { icon: BadgeCheck, label: "Badan hukum", value: COMPANY.legalName },
    { icon: Factory, label: "Industri", value: COMPANY.industry },
    { icon: MapPin, label: "Asal", value: COMPANY.origin },
    { icon: Flag, label: "Diperkenalkan ke publik", value: String(COMPANY.introduced) },
    { icon: Lightbulb, label: "Ide korporat", value: COMPANY.idea },
  ];

  return (
    <>
      <PageHero
        eyebrow="Company Overview"
        title={
          <>
            From AI-Powered Education to <span className="text-gradient">B2B Business Solutions.</span>
          </>
        }
        description="Terang AI berangkat dari misi membuat pendidikan berbasis AI lebih personal dan mudah diakses — lalu membawa kapabilitas yang sama ke proses bisnis institusi dan perusahaan."
        aside={
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 m-auto h-64 w-64 rounded-full bg-sky/30 blur-3xl" />
            <Mascot name="sparkle" size={300} preload className="relative" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/products">
            Lihat dua produk B2B <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/strategy-lab" variant="secondary">
            Masuk ke Strategy Lab
          </Button>
        </div>
      </PageHero>

      {/* Identity */}
      <Section className="pt-6">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Company Identity" title="Identitas perusahaan" description="Ringkasan identitas berdasarkan informasi publik Terang AI." action={<SourceLabel type="public-source" />} />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {identity.map(({ icon: Icon, label, value }, i) => (
              <Reveal key={label} delay={i * 0.05}>
                <div className="flex h-full gap-4 rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-soft text-brand-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
                    <p className="mt-1 font-semibold leading-snug text-ink">{value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-6 flex flex-col gap-4 overflow-hidden rounded-3xl bg-brand-gradient p-7 text-white shadow-glow sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <Quote className="h-8 w-8 shrink-0 opacity-70" />
                <div>
                  <p className="font-display text-2xl font-semibold md:text-3xl">{COMPANY.tagline}</p>
                  <p className="mt-1 text-sm text-white/85">{COMPANY.taglineNote}</p>
                </div>
              </div>
              <SourceLabel type="strategic-proposal" dark />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Evolution */}
      <Section className="bg-card">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Business Evolution"
                title="Education & Exam Preparation → AI Interview Technology → Expanded B2B Offerings"
              />
            </Reveal>
            <div className="mt-10 pl-4">
              <EvolutionTimeline variant="vertical" />
            </div>
          </div>
          <div className="lg:pt-24">
            <Reveal>
              <div className="sticky top-24 rounded-3xl border border-line bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">Fondasi B2C</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">Layanan pendidikan berbasis AI</h3>
                <div className="mt-5 space-y-3">
                  {B2C_OFFERINGS.map((o) => (
                    <div key={o.name} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-line">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky" />
                      <div>
                        <p className="font-semibold text-ink">{o.name}</p>
                        <p className="text-sm text-muted-strong">{o.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Callout tone="info" className="mt-5" title="Mengapa ini penting?">
                  Teknologi percakapan & umpan balik wawancara (Professor Terra) menjadi fondasi teknis bagi AI Candidate Interview — namun
                  kesiapan enterprise-nya tetap perlu divalidasi.
                </Callout>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* B2B portfolio */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="B2B Product Portfolio"
              title="Dua produk B2B yang menjadi fokus analisis"
              description="Keduanya lahir dari kapabilitas AI Terang, tetapi melayani pelanggan, workflow, dan model pendapatan yang berbeda."
            />
          </Reveal>
          <div className="mt-10">
            <ProductCards />
          </div>
          <div className="mt-16">
            <Reveal>
              <h3 className="text-2xl font-semibold text-ink">Product Positioning Map</h3>
              <p className="mt-1 text-muted-strong">Pembeli dan pola penggunaan yang berbeda berarti strategi akuisisi & operasional yang berbeda pula.</p>
            </Reveal>
            <div className="mt-6">
              <PositioningMap />
            </div>
          </div>
        </Container>
      </Section>

      {/* Sources */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Source Information" title="Apa yang publik, apa yang diusulkan?" />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-line bg-card p-6 shadow-soft">
                <SourceLabel type="public-source" />
                <h3 className="mt-3 text-lg font-semibold text-ink">Pernyataan publik perusahaan</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-strong">
                  {[
                    "Platform pendidikan AI diperkenalkan pada 2024",
                    "Persiapan UTBK, CPNS, beasiswa & simulasi wawancara AI (Professor Terra)",
                    ...PRODUCTS.events.existing.slice(0, 4).map((e) => `Terang Events: ${e.toLowerCase()}`),
                    "Penawaran B2B: AI LMS, manajemen acara, wawancara kandidat berbasis AI",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-3xl border border-line bg-card p-6 shadow-soft">
                <SourceLabel type="strategic-proposal" />
                <h3 className="mt-3 text-lg font-semibold text-ink">Usulan dalam prototype ini</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-strong">
                  {[...PRODUCTS.interview.proposals.map((p) => p.name), ...PRODUCTS.events.proposals.map((p) => p.name), "ACE Command Center", "Expansion Gate & Portfolio Intelligence"].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Callout tone="warning" className="mt-6" title="Catatan penting">
            Angka tujuh personel merupakan kondisi dalam studi kasus, bukan verifikasi jumlah karyawan Terang AI saat ini. Tiga gap strategis
            adalah kerangka analisis, bukan bukti kegagalan bisnis.
          </Callout>
        </Container>
      </Section>
    </>
  );
}
