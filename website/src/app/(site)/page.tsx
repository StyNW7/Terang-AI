import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Building2,
  CalendarDays,
  Flag,
  GraduationCap,
  MapPin,
  Play,
  ShieldAlert,
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

const DASHBOARDS = [
  {
    href: "/dashboard",
    icon: ShieldHalf,
    accent: "bg-[linear-gradient(135deg,#1f4f84,#0b1d36)]",
    title: "Super Admin",
    text: "Pilih mode strategi, jalankan simulasi ONE vs ACE, dan pantau kapasitas tim.",
    points: ["Kontrol strategi", "Simulator finansial", "Decision gate"],
  },
  {
    href: "/dashboard/events",
    icon: CalendarDays,
    accent: "bg-events-gradient",
    title: "Terang Events",
    text: "Kelola kompetisi dari pembuatan event, peserta, hingga penjurian.",
    points: ["Wizard 6 langkah", "Penjurian berbobot", "Portal peserta"],
  },
  {
    href: "/dashboard/interview",
    icon: Brain,
    accent: "bg-one-gradient",
    title: "AI Candidate Interview",
    text: "Susun wawancara terstruktur dan tinjau laporan berbasis bukti.",
    points: ["Interview builder", "Laporan bukti", "Responsible AI"],
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* 1 — Company overview */}
      <Section id="tentang" className="scroll-mt-16">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Tentang Terang AI"
              title={
                <>
                  AI yang <span className="text-gradient">menerangi</span> pendidikan &amp; bisnis.
                </>
              }
              description={`Startup EdTech Indonesia sejak ${COMPANY.introduced}. Berawal dari persiapan UTBK, CPNS, dan beasiswa, kini Terang AI memperluas portofolio ke solusi B2B.`}
            />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: MapPin, k: "Asal", v: COMPANY.origin },
                { icon: Flag, k: "Diperkenalkan", v: String(COMPANY.introduced) },
                { icon: GraduationCap, k: "Awal", v: "B2C EdTech" },
                { icon: Building2, k: "Arah", v: "B2B Solutions" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="rounded-2xl border border-line bg-card p-4 shadow-soft">
                  <Icon className="h-4 w-4 text-brand-ink" />
                  <p className="mt-2.5 text-xs text-muted">{k}</p>
                  <p className="text-sm font-semibold text-ink">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
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
                <p className="eyebrow text-sky">Dari pendidikan berbasis AI</p>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {B2C_OFFERINGS.map((o) => (
                    <div key={o.name} className="rounded-xl bg-white/[0.07] p-3 ring-1 ring-white/12">
                      <p className="text-sm font-semibold">{o.name}</p>
                      <p className="mt-0.5 text-xs leading-snug text-white/65">{o.description}</p>
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
                <p className="eyebrow text-sky">Menuju solusi bisnis B2B</p>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                  {["AI Learning Management", "Terang Events", "AI Candidate Interview"].map((n, i) => (
                    <div key={n} className={i > 0 ? "rounded-xl bg-white p-3 text-navy shadow-soft" : "rounded-xl bg-white/[0.07] p-3 ring-1 ring-white/12"}>
                      <p className="text-sm font-semibold">{n}</p>
                      <p className={i > 0 ? "mt-0.5 text-xs font-medium text-[#2f6fc0]" : "mt-0.5 text-xs text-white/60"}>
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

      {/* 2 — Evolution */}
      <Section className="border-y border-line bg-subtle">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Perjalanan Bisnis"
              title="Dari persiapan ujian ke solusi B2B."
              description="Empat fase singkat — dari layanan pendidikan hingga titik keputusan strategi pertumbuhan."
              action={
                <Button href="/company" variant="ghost">
                  Timeline lengkap <ArrowRight className="h-4 w-4" />
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
              eyebrow="Dua Peluang Bisnis"
              title="Dua produk B2B, dua pasar berbeda."
              description="Terang Events melayani penyelenggara acara; AI Candidate Interview membantu tim rekrutmen. Keduanya bisa langsung dicoba."
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

      {/* 4 — Dilemma preview */}
      <Section className="relative overflow-hidden border-y border-line bg-subtle">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <SectionHeading
                eyebrow="Dilema Strategis"
                title={
                  <>
                    Sumber daya terbatas. <span className="text-gradient">Satu keputusan.</span>
                  </>
                }
                description={KEY_QUESTION}
              />
            </Reveal>
            <Mascot name="think" size={140} className="mx-auto hidden lg:block" />
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {CHALLENGES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <div className="flex h-full items-center gap-4 rounded-2xl border border-line bg-card p-4 shadow-soft">
                  <span className="font-display text-2xl font-semibold text-gradient">{c.number}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{c.title}</p>
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
              eyebrow="Dua Alternatif Strategi"
              title="ONE atau ACE — diuji secara adil."
              description="Aktifkan salah satu mode untuk melihat perubahan prioritas produk di seluruh website. Tidak ada pemenang yang ditentukan sejak awal."
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
              eyebrow="Coba Langsung"
              title="Tiga dashboard, masing-masing dengan fokusnya."
              description="Super Admin mengendalikan strategi; setiap produk punya dashboard sendiri yang lengkap."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {DASHBOARDS.map((d, i) => (
              <Reveal key={d.href} delay={i * 0.08}>
                <Link
                  href={d.href}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-soft ${d.accent}`}>
                      <d.icon className="h-6 w-6" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-ink" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{d.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-strong">{d.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {d.points.map((p) => (
                      <li key={p} className="rounded-full bg-neutral-soft px-2.5 py-1 text-xs font-medium text-muted-strong">
                        {p}
                      </li>
                    ))}
                  </ul>
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
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sky ring-1 ring-white/15">
                    <Sparkles className="h-3.5 w-3.5" /> Guided Experience
                  </p>
                  <h2 className="mt-4 text-3xl font-bold leading-tight md:text-[2.5rem]">
                    Ikuti ceritanya, <span className="text-gradient-light">langkah demi langkah.</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-white/75">15 slide interaktif dengan catatan pembicara dan navigasi keyboard — siap untuk sesi juri.</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {GUIDED_FLOW.map((s, i) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/85 ring-1 ring-white/15 transition hover:bg-white/15"
                      >
                        <span className="tabular text-sky">{String(i + 1).padStart(2, "0")}</span> {s.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button href="/presentation" variant="light" size="lg">
                      <Play className="h-4 w-4 fill-current" /> Mulai presentasi
                    </Button>
                    <Button href="/strategy-lab" variant="glass" size="lg">
                      Jelajahi bebas <ArrowRight className="h-4 w-4" />
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

      {/* 8 — Disclaimer */}
      <Container>
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 text-sm leading-relaxed text-muted-strong shadow-soft sm:flex-row sm:items-start">
          <ShieldAlert className="h-5 w-5 shrink-0 text-brand-ink" />
          <p>
            <strong className="font-semibold text-ink">Prototype konsep akademik tidak resmi.</strong> Dibuat untuk BCDC 2026 dan tidak mewakili{" "}
            {COMPANY.legalName}. Fitur baru diberi label <em>usulan</em>, angka finansial bersifat <em>ilustratif</em>, dan data demo bersifat{" "}
            <em>fiktif</em>.{" "}
            <Link href="/references" className="font-medium text-brand-ink underline-offset-2 hover:underline">
              Lihat sumber &amp; asumsi
            </Link>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
