import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Building2,
  CalendarDays,
  Flag,
  GraduationCap,
  MapPin,
  Play,
  ShieldHalf,
  Sparkles,
} from "lucide-react";
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
import { T } from "@/lib/i18n";
import { keyOf, L, type Txt } from "@/lib/i18n-core";

const DASHBOARDS: { href: string; icon: typeof ShieldHalf; accent: string; title: string; text: Txt; points: Txt[] }[] = [
  {
    href: "/dashboard",
    icon: ShieldHalf,
    accent: "bg-[linear-gradient(135deg,#1f4f84,#0b1d36)]",
    title: "Super Admin",
    text: L("Pilih mode strategi, jalankan simulasi ONE vs ACE, dan pantau kapasitas tim.", "Pick a strategy mode, run the ONE vs ACE simulation and monitor team capacity."),
    points: [L("Kontrol strategi", "Strategy control"), L("Simulator finansial", "Financial simulator"), "Decision gate"],
  },
  {
    href: "/dashboard/events",
    icon: CalendarDays,
    accent: "bg-events-gradient",
    title: "Terang Events",
    text: L("Kelola kompetisi dari pembuatan _event_, peserta, hingga penjurian.", "Run competitions end to end — from creating the event to participants and judging."),
    points: [L("_Wizard_ 6 langkah", "6-step wizard"), L("Penjurian berbobot", "Weighted judging"), L("Portal peserta", "Participant portal")],
  },
  {
    href: "/dashboard/interview",
    icon: Brain,
    accent: "bg-one-gradient",
    title: "AI Candidate Interview",
    text: L("Susun wawancara terstruktur dan tinjau laporan berbasis bukti.", "Build structured interviews and review evidence-based reports."),
    points: ["Interview Builder", L("Laporan bukti", "Evidence reports"), "Responsible AI"],
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* 1 — Company overview */}
      <Section id="tentang" className="scroll-mt-16">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Tentang Terang AI" en="About Terang AI" />}
              title={
                <T
                  id={
                    <>
                      AI yang <span className="text-gradient">menerangi</span> pendidikan &amp; bisnis.
                    </>
                  }
                  en={
                    <>
                      AI that <span className="text-gradient">brightens</span> education &amp; business.
                    </>
                  }
                />
              }
              description={
                <T
                  id={`Startup EdTech Indonesia sejak ${COMPANY.introduced}. Berawal dari persiapan UTBK, CPNS, dan beasiswa, kini Terang AI memperluas portofolio ke solusi B2B.`}
                  en={`An Indonesian EdTech startup since ${COMPANY.introduced}. Having started with UTBK, CPNS and scholarship preparation, Terang AI is now expanding its portfolio into B2B solutions.`}
                />
              }
            />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: MapPin, k: L("Asal", "Origin"), v: COMPANY.origin as Txt },
                { icon: Flag, k: L("Diperkenalkan", "Introduced"), v: String(COMPANY.introduced) as Txt },
                { icon: GraduationCap, k: L("Awal", "Started as"), v: "B2C EdTech" as Txt },
                { icon: Building2, k: L("Arah", "Heading to"), v: "B2B Solutions" as Txt },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k.id} className="rounded-2xl border border-line bg-card p-4 shadow-soft">
                  <Icon className="h-4 w-4 text-brand-ink" />
                  <p className="mt-2.5 text-xs text-muted">
                    <T v={k} />
                  </p>
                  <p className="text-sm font-semibold text-ink">
                    <T v={v} />
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href="/company" variant="secondary">
                <T id="Kenali Terang AI" en="Meet Terang AI" /> <ArrowRight className="h-4 w-4" />
              </Button>
              <SourceLabel type="public-source" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[28px] bg-navy-gradient p-7 text-white shadow-lift sm:p-9">
              <div className="bg-grid-dark absolute inset-0 opacity-60" />
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-sky/30 blur-3xl" />
              <div className="relative">
                <p className="eyebrow text-sky">
                  <T id="Dari pendidikan berbasis AI" en="From AI-powered education" />
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {B2C_OFFERINGS.map((o) => (
                    <div key={keyOf(o.name)} className="rounded-xl bg-white/[0.07] p-3 ring-1 ring-white/12">
                      <p className="text-sm font-semibold">
                        <T v={o.name} />
                      </p>
                      <p className="mt-0.5 text-xs leading-snug text-white/65">
                        <T v={o.description} />
                      </p>
                    </div>
                  ))}
                </div>
                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sky/60 to-transparent" />
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-sky text-navy-deep">
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sky/60 to-transparent" />
                </div>
                <p className="eyebrow text-sky">
                  <T id="Menuju solusi bisnis B2B" en="Toward B2B business solutions" />
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {["AI Learning Management", "Terang Events", "AI Candidate Interview"].map((n, i) => (
                    <div key={n} className={i > 0 ? "rounded-xl bg-white p-3 text-navy shadow-soft" : "rounded-xl bg-white/[0.07] p-3 ring-1 ring-white/12"}>
                      <p className="text-sm font-semibold">{n}</p>
                      <p className={i > 0 ? "mt-0.5 text-xs font-medium text-[#2f6fc0]" : "mt-0.5 text-xs text-white/60"}>
                        {i > 0 ? <T id="Fokus analisis" en="Focus of analysis" /> : <T id="Portofolio B2B" en="B2B portfolio" />}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 2 — Evolution */}
      <Section className="border-y border-line bg-subtle">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Perjalanan Bisnis" en="Business Journey" />}
              title={<T id="Dari persiapan ujian ke solusi B2B." en="From exam preparation to B2B solutions." />}
              description={
                <T
                  id="Empat fase singkat — dari layanan pendidikan hingga titik keputusan strategi pertumbuhan."
                  en="Four short phases — from education services to the growth-strategy decision point."
                />
              }
              action={
                <Button href="/company" variant="ghost">
                  <T id="_Timeline_ lengkap" en="Full timeline" /> <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
          </Reveal>
          <div className="mt-12">
            <EvolutionTimeline />
          </div>
        </Container>
      </Section>

      {/* 3 — Products */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Dua Peluang Bisnis" en="Two Business Opportunities" />}
              title={<T id="Dua produk B2B, dua pasar berbeda." en="Two B2B products, two different markets." />}
              description={
                <T
                  id="Terang Events melayani penyelenggara acara; AI Candidate Interview membantu tim rekrutmen. Keduanya bisa langsung dicoba."
                  en="Terang Events serves event organisers; AI Candidate Interview helps recruitment teams. You can try both right away."
                />
              }
              action={
                <Button href="/products" variant="secondary">
                  <T id="Bandingkan produk" en="Compare products" /> <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
          </Reveal>
          <div className="mt-12">
            <ProductCards />
          </div>
        </Container>
      </Section>

      {/* 4 — Dilemma preview */}
      <Section className="relative overflow-hidden border-y border-line bg-subtle">
        <Container>
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <SectionHeading
                eyebrow={<T id="Dilema Strategis" en="Strategic Dilemma" />}
                title={
                  <T
                    id={
                      <>
                        Sumber daya terbatas. <span className="text-gradient">Satu keputusan.</span>
                      </>
                    }
                    en={
                      <>
                        Limited resources. <span className="text-gradient">One decision.</span>
                      </>
                    }
                  />
                }
                description={<T v={KEY_QUESTION} />}
              />
            </Reveal>
            <Mascot name="think" size={140} className="mx-auto hidden lg:block" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            {CHALLENGES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <div className="flex h-full items-center gap-4 rounded-2xl border border-line bg-card p-4 shadow-soft">
                  <span className="font-display text-2xl font-semibold text-gradient">{c.number}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      <T v={c.title} />
                    </p>
                    <p className="text-[13px] text-muted">{c.english}</p>
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

      {/* 5 — Strategy selector */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow={<T id="Dua Alternatif Strategi" en="Two Strategic Alternatives" />}
              title={<T id="ONE atau ACE — diuji secara adil." en="ONE or ACE — tested fairly." />}
              description={
                <T
                  id="Aktifkan salah satu mode untuk melihat perubahan prioritas produk di seluruh website. Tidak ada pemenang yang ditentukan sejak awal."
                  en="Activate either mode to see product priorities change across the whole website. No winner is decided in advance."
                />
              }
            />
          </Reveal>
          <div className="mt-12">
            <StrategySelector />
          </div>
        </Container>
      </Section>

      {/* 6 — Dashboards */}
      <Section className="border-y border-line bg-subtle">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Coba Langsung" en="Try It Live" />}
              title={<T id="Tiga _dashboard_, tiga fokus kerja." en="Three dashboards, three areas of focus." />}
              description={
                <T
                  id="Super Admin mengendalikan strategi ONE vs ACE; setiap produk punya _dashboard_ sendiri yang lengkap. Semua data demo bisa langsung dicoba."
                  en="Super Admin controls the ONE vs ACE strategy; each product has its own complete dashboard. All demo data is ready to try."
                />
              }
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {DASHBOARDS.map((d, i) => (
              <Reveal key={d.href} delay={i * 0.08}>
                <Link
                  href={d.href}
                  data-spotlight
                  className="group flex h-full flex-col rounded-3xl border border-line bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift"
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-soft ${d.accent}`}>
                    <d.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{d.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-strong">
                    <T v={d.text} />
                  </p>
                  <ul className="mb-6 mt-5 space-y-2">
                    {d.points.map((p) => (
                      <li key={keyOf(p)} className="flex items-center gap-2 text-sm text-ink">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        <T v={p} />
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto flex items-center gap-1.5 border-t border-line pt-4 text-sm font-medium text-brand-ink">
                    <T id="Buka _dashboard_" en="Open dashboard" /> <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 7 — Guided experience CTA */}
      <Section>
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-navy-gradient px-6 py-12 text-white shadow-lift sm:px-12">
              <div className="bg-grid-dark absolute inset-0 opacity-70" />
              <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-sky/25 blur-3xl" />
              <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sky ring-1 ring-white/15">
                    <Sparkles className="h-3.5 w-3.5" /> <T id="Pengalaman Terpandu" en="Guided Experience" />
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-[2.5rem]">
                    <T
                      id={
                        <>
                          Ikuti ceritanya, <span className="text-gradient-light">langkah demi langkah.</span>
                        </>
                      }
                      en={
                        <>
                          Follow the story, <span className="text-gradient-light">step by step.</span>
                        </>
                      }
                    />
                  </h2>
                  <p className="mt-4 max-w-xl text-white/75">
                    <T
                      id="15 _slide_ interaktif dengan catatan pembicara dan navigasi _keyboard_ — siap untuk sesi juri."
                      en="15 interactive slides with speaker notes and keyboard navigation — ready for the judging session."
                    />
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {GUIDED_FLOW.map((s, i) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/85 ring-1 ring-white/15 transition hover:bg-white/15"
                      >
                        <span className="tabular text-sky">{String(i + 1).padStart(2, "0")}</span> <T v={s.label} />
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button href="/presentation" variant="light" size="lg">
                      <Play className="h-4 w-4 fill-current" /> <T id="Mulai presentasi" en="Start presentation" />
                    </Button>
                    <Button href="/strategy-lab" variant="glass" size="lg">
                      <T id="Jelajahi bebas" en="Explore freely" /> <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative mx-auto">
                  <div className="absolute inset-0 m-auto h-56 w-56 rounded-full bg-sky/30 blur-3xl" />
                  <Mascot name="sparkle" size={240} className="relative" />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
