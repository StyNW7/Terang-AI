import Link from "next/link";
import { ArrowRight, Building2, Flag, GraduationCap, MapPin, Play, ShieldAlert, Sparkles } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { EvolutionTimeline } from "@/components/landing/evolution-timeline";
import { ProductCards } from "@/components/landing/product-cards";
import { DilemmaPreview } from "@/components/landing/dilemma-preview";
import { StrategySelector } from "@/components/landing/strategy-selector";
import { Container, Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { COMPANY, B2C_OFFERINGS } from "@/data/company";
import { CHALLENGES, KEY_QUESTION } from "@/data/strategy";
import { GUIDED_FLOW } from "@/data/navigation";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* 2 — Company overview */}
      <Section className="pt-8 md:pt-10">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Tentang Terang AI"
              title={
                <>
                  AI yang <span className="text-gradient">menerangi</span> pendidikan & bisnis.
                </>
              }
              description={`${COMPANY.legalName} adalah startup EdTech asal Indonesia yang diperkenalkan pada ${COMPANY.introduced}. Berawal dari layanan B2C persiapan UTBK, CPNS, beasiswa, dan simulasi wawancara AI, Terang AI kini memperluas portofolio ke solusi B2B.`}
            />
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: MapPin, k: "Asal", v: COMPANY.origin },
                { icon: Flag, k: "Diperkenalkan", v: String(COMPANY.introduced) },
                { icon: GraduationCap, k: "Awal", v: "B2C EdTech" },
                { icon: Building2, k: "Arah", v: "B2B Solutions" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="rounded-2xl border border-line bg-white p-3.5 shadow-soft">
                  <Icon className="h-4 w-4 text-brand-ink" />
                  <p className="mt-2 text-[11px] font-semibold text-muted">{k}</p>
                  <p className="text-sm font-bold text-ink">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button href="/company" variant="secondary">
                Kenali Terang AI <ArrowRight className="h-4 w-4" />
              </Button>
              <SourceLabel type="public-source" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[28px] bg-navy-gradient p-7 text-white shadow-lift sm:p-9">
              <div className="bg-grid-dark absolute inset-0 opacity-60" />
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-sky/30 blur-3xl" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky">From AI-Powered Education</p>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {B2C_OFFERINGS.map((o) => (
                    <div key={o.name} className="rounded-xl bg-white/8 p-3 ring-1 ring-white/12">
                      <p className="text-sm font-bold">{o.name}</p>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-white/65">{o.description}</p>
                    </div>
                  ))}
                </div>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sky/60 to-transparent" />
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-sky text-navy">
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sky/60 to-transparent" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky">To B2B Business Solutions</p>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                  {["AI Learning Management", "Terang Events", "AI Candidate Interview"].map((n, i) => (
                    <div key={n} className={i > 0 ? "rounded-xl bg-white p-3 text-navy shadow-soft" : "rounded-xl bg-white/8 p-3 ring-1 ring-white/12"}>
                      <p className="text-sm font-bold">{n}</p>
                      <p className={i > 0 ? "mt-0.5 text-[11px] font-semibold text-brand-ink" : "mt-0.5 text-[11px] text-white/60"}>
                        {i > 0 ? "Fokus analisis" : "Portofolio B2B"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 3 — Evolution */}
      <Section className="bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Business Evolution"
              title="Dari persiapan ujian ke solusi B2B."
              description="Perjalanan Terang AI dalam empat fase — dari layanan pendidikan berbasis AI hingga titik keputusan strategi pertumbuhan B2B."
              action={
                <Button href="/company" variant="ghost">
                  Lihat timeline lengkap <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
          </Reveal>
          <div className="mt-12">
            <EvolutionTimeline />
          </div>
        </Container>
      </Section>

      {/* 4 — Products */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Kenali Dua Peluang Bisnis"
              title="Dua produk B2B. Dua pasar yang berbeda."
              description="Terang Events melayani penyelenggara acara, sementara AI Candidate Interview menjawab kebutuhan rekrutmen perusahaan. Keduanya bisa langsung Anda coba."
              action={
                <Button href="/products" variant="secondary">
                  Bandingkan produk <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
          </Reveal>
          <div className="mt-12">
            <ProductCards />
          </div>
        </Container>
      </Section>

      {/* 5 — Dilemma preview */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-white to-[#eef6fe]">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <SectionHeading
                eyebrow="Satu Perusahaan, Dua Pilihan Strategis"
                title={
                  <>
                    Dua peluang. Sumber daya terbatas. <span className="text-gradient">Satu keputusan.</span>
                  </>
                }
                description={KEY_QUESTION}
              />
            </Reveal>
            <Mascot name="think" size={150} className="mx-auto hidden lg:block" />
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {CHALLENGES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft">
                  <span className="font-display text-2xl font-extrabold text-gradient">{c.number}</span>
                  <div>
                    <p className="text-sm font-bold text-ink">{c.english}</p>
                    <p className="text-xs text-muted">{c.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <DilemmaPreview />
          </div>
        </Container>
      </Section>

      {/* 6 — Strategy selector */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Pilih Lensa Strategi"
              title="ONE atau ACE — keduanya diuji secara adil."
              description="Aktifkan mode strategi untuk melihat bagaimana prioritas produk, roadmap, dan pemanfaatan sumber daya berubah di seluruh website. Tidak ada pemenang yang ditentukan sebelumnya."
            />
          </Reveal>
          <div className="mt-12">
            <StrategySelector />
          </div>
        </Container>
      </Section>

      {/* 7 — Guided experience CTA */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-navy-gradient px-6 py-12 text-white shadow-lift sm:px-12">
              <div className="bg-grid-dark absolute inset-0 opacity-70" />
              <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-sky/25 blur-3xl" />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sky ring-1 ring-white/15">
                    <Sparkles className="h-3.5 w-3.5" /> Guided Experience
                  </p>
                  <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-[2.6rem]">
                    Ikuti cerita bisnisnya, <span className="text-gradient-light">langkah demi langkah.</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-white/75">
                    15 layar presentasi interaktif dengan catatan pembicara, navigasi keyboard, dan perpindahan cepat PRO ↔ KONTRA — siap
                    untuk sesi juri.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {GUIDED_FLOW.map((s, i) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/85 ring-1 ring-white/15 transition hover:bg-white/15"
                      >
                        <span className="text-sky">{String(i + 1).padStart(2, "0")}</span> {s.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button href="/presentation" variant="light" size="lg">
                      <Play className="h-4 w-4 fill-current" /> Start Guided Experience
                    </Button>
                    <Button href="/strategy-lab" variant="glass" size="lg">
                      Jelajahi bebas <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative mx-auto">
                  <div className="absolute inset-0 m-auto h-56 w-56 rounded-full bg-sky/30 blur-3xl" />
                  <Mascot name="sparkle" size={260} className="relative" />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 8 — Disclaimer */}
      <Container>
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 text-sm leading-relaxed text-muted-strong shadow-soft sm:flex-row sm:items-start">
          <ShieldAlert className="h-5 w-5 shrink-0 text-brand-ink" />
          <p>
            <strong className="text-ink">Unofficial academic concept prototype.</strong> Website ini dibuat untuk keperluan Business Case &amp;
            Debate Competition (BCDC) 2026 dan tidak mewakili {COMPANY.legalName}. Fitur yang belum ada di produk resmi diberi label
            <em> usulan</em>, angka finansial bersifat <em>ilustratif</em>, dan seluruh data demo bersifat <em>fiktif</em>.{" "}
            <Link href="/references" className="font-semibold text-brand-ink underline-offset-2 hover:underline">
              Lihat sumber & asumsi
            </Link>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
