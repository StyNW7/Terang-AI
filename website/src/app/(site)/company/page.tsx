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
import { T } from "@/lib/i18n";
import { keyOf, L, type Txt } from "@/lib/i18n-core";

export const metadata: Metadata = { title: "Company Overview" };

export default function CompanyPage() {
  const identity: { icon: typeof Building2; label: Txt; value: Txt }[] = [
    { icon: Building2, label: L("Nama perusahaan", "Company name"), value: COMPANY.name },
    { icon: BadgeCheck, label: L("Badan hukum", "Legal entity"), value: COMPANY.legalName },
    { icon: Factory, label: L("Industri", "Industry"), value: COMPANY.industry },
    { icon: MapPin, label: L("Asal", "Origin"), value: COMPANY.origin },
    { icon: Flag, label: L("Diperkenalkan ke publik", "Publicly introduced"), value: String(COMPANY.introduced) },
    { icon: Lightbulb, label: L("Ide korporat", "Corporate idea"), value: COMPANY.idea },
  ];

  const publicFacts: Txt[] = [
    L("Platform pendidikan AI diperkenalkan pada 2024", "AI education platform introduced in 2024"),
    L("Persiapan UTBK, CPNS, beasiswa & simulasi wawancara AI (Professor Terra)", "UTBK, CPNS & scholarship preparation plus AI interview simulation (Professor Terra)"),
    ...PRODUCTS.events.existing.slice(0, 4).map((e) => L(`Terang Events: ${e.id.charAt(0).toLowerCase()}${e.id.slice(1)}`, `Terang Events: ${e.en.charAt(0).toLowerCase()}${e.en.slice(1)}`)),
    L("Penawaran B2B: AI LMS, manajemen acara, wawancara kandidat berbasis AI", "B2B offering: AI LMS, event management, AI-based candidate interviews"),
  ];

  return (
    <>
      <PageHero
        eyebrow={<T id="Profil Perusahaan" en="Company Overview" />}
        title={
          <T
            id={
              <>
                Dari pendidikan berbasis AI menuju <span className="text-gradient">solusi bisnis B2B.</span>
              </>
            }
            en={
              <>
                From AI-Powered Education to <span className="text-gradient">B2B Business Solutions.</span>
              </>
            }
          />
        }
        description={
          <T
            id="Terang AI berangkat dari misi membuat pendidikan berbasis AI lebih personal dan mudah diakses — lalu membawa kapabilitas yang sama ke proses bisnis institusi dan perusahaan."
            en="Terang AI set out to make AI-powered education more personal and accessible — and is now bringing the same capabilities to the business processes of institutions and companies."
          />
        }
        aside={
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 m-auto h-64 w-64 rounded-full bg-sky/30 blur-3xl" />
            <Mascot name="sparkle" size={300} preload className="relative" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/products">
            <T id="Lihat dua produk B2B" en="See the two B2B products" /> <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/strategy-lab" variant="secondary">
            <T id="Masuk ke Strategy Lab" en="Enter the Strategy Lab" />
          </Button>
        </div>
      </PageHero>

      {/* Identity */}
      <Section className="pt-6">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Profil Perusahaan" en="Company Identity" />}
              title={<T id="Identitas perusahaan" en="Who Terang AI is" />}
              description={<T id="Ringkasan identitas berdasarkan informasi publik Terang AI." en="An identity summary based on Terang AI's public information." />}
              action={<SourceLabel type="public-source" />}
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {identity.map(({ icon: Icon, label, value }, i) => (
              <Reveal key={keyOf(label)} delay={i * 0.05}>
                <div className="flex h-full gap-4 rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-soft text-brand-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      <T v={label} />
                    </p>
                    <p className="mt-1 font-semibold leading-snug text-ink">
                      <T v={value} />
                    </p>
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
                  <p className="mt-1 text-sm text-white/85">
                    <T v={COMPANY.taglineNote} />
                  </p>
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
                eyebrow={<T id="Evolusi Bisnis" en="Business Evolution" />}
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
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">
                  <T id="Fondasi B2C" en="B2C foundation" />
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink">
                  <T id="Layanan pendidikan berbasis AI" en="AI-powered education services" />
                </h3>
                <div className="mt-5 space-y-3">
                  {B2C_OFFERINGS.map((o) => (
                    <div key={keyOf(o.name)} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-line">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky" />
                      <div>
                        <p className="font-semibold text-ink">
                          <T v={o.name} />
                        </p>
                        <p className="text-sm text-muted-strong">
                          <T v={o.description} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Callout tone="info" className="mt-5" title={<T id="Mengapa ini penting?" en="Why does this matter?" />}>
                  <T
                    id="Teknologi percakapan & umpan balik wawancara (Professor Terra) menjadi fondasi teknis bagi AI Candidate Interview — namun kesiapan _enterprise_-nya tetap perlu divalidasi."
                    en="The conversation & interview-feedback technology (Professor Terra) is the technical foundation for AI Candidate Interview — but its enterprise readiness still needs validation."
                  />
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
              eyebrow={<T id="Portofolio Produk B2B" en="B2B Product Portfolio" />}
              title={<T id="Dua produk B2B yang menjadi fokus analisis" en="The two B2B products at the centre of this analysis" />}
              description={
                <T
                  id="Keduanya lahir dari kapabilitas AI Terang, tetapi melayani pelanggan, _workflow_, dan model pendapatan yang berbeda."
                  en="Both grew out of Terang's AI capabilities, but they serve different customers, workflows and revenue models."
                />
              }
            />
          </Reveal>
          <div className="mt-10">
            <ProductCards />
          </div>
          <div className="mt-16">
            <Reveal>
              <h3 className="text-2xl font-semibold text-ink">
                <T id="Peta Positioning Produk" en="Product Positioning Map" />
              </h3>
              <p className="mt-1 text-muted-strong">
                <T
                  id="Pembeli dan pola penggunaan yang berbeda berarti strategi akuisisi & operasional yang berbeda pula."
                  en="Different buyers and usage patterns mean different acquisition & operational strategies."
                />
              </p>
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
            <SectionHeading eyebrow={<T id="Sumber Informasi" en="Source Information" />} title={<T id="Apa yang publik, apa yang diusulkan?" en="What is public, and what is proposed?" />} />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-line bg-card p-6 shadow-soft">
                <SourceLabel type="public-source" />
                <h3 className="mt-3 text-lg font-semibold text-ink">
                  <T id="Pernyataan publik perusahaan" en="The company's public statements" />
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-strong">
                  {publicFacts.map((t) => (
                    <li key={keyOf(t)} className="flex gap-2">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" /> <T v={t} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-3xl border border-line bg-card p-6 shadow-soft">
                <SourceLabel type="strategic-proposal" />
                <h3 className="mt-3 text-lg font-semibold text-ink">
                  <T id="Usulan dalam prototipe ini" en="Proposals in this prototype" />
                </h3>
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
          <Callout tone="warning" className="mt-6" title={<T id="Catatan penting" en="Important note" />}>
            <T
              id="Angka tujuh personel merupakan kondisi dalam studi kasus, bukan verifikasi jumlah karyawan Terang AI saat ini. Tiga _gap_ strategis adalah kerangka analisis, bukan bukti kegagalan bisnis."
              en="The seven-person figure is a condition of the case study, not a verification of Terang AI's current headcount. The three strategic gaps are an analytical framework, not evidence of business failure."
            />
          </Callout>
        </Container>
      </Section>
    </>
  );
}
