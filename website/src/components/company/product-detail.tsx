import Link from "next/link";
import { AlertCircle, ArrowRight, BadgeCheck, Building2, Check, Clock, Play, Sparkles, Wallet } from "lucide-react";
import type { ProductKey } from "@/types/common";
import { PRODUCTS } from "@/data/company";
import { Container, PageHero, Section } from "@/components/layout/container";
import { SectionHeading, Callout } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { ModeContextBanner } from "@/components/strategy/mode-context-banner";
import { T } from "@/lib/i18n";
import { keyOf, L, type Bilingual } from "@/lib/i18n-core";

const WORKFLOWS: Record<ProductKey, { step: Bilingual; detail: Bilingual; status: "existing" | "proposed" }[]> = {
  events: [
    { step: L("_Setup event_", "Event setup"), detail: L("Informasi dasar, kategori, kuota & biaya", "Basic info, category, quota & fee"), status: "existing" },
    { step: L("_Smart template_", "Smart template"), detail: L("Isi otomatis tahapan & rubrik", "Auto-fills stages & rubrics"), status: "proposed" },
    { step: L("Registrasi & pembayaran", "Registration & payment"), detail: L("Peserta mendaftar & membayar", "Participants sign up & pay"), status: "existing" },
    { step: L("Submisi", "Submission"), detail: L("Peserta mengunggah karya", "Participants upload their work"), status: "existing" },
    { step: L("Penjurian", "Judging"), detail: L("Rubrik berbobot & _reviewer_", "Weighted rubrics & reviewers"), status: "existing" },
    { step: L("_Insights_ & _repeat_", "Insights & repeat"), detail: L("Analitik + duplikasi _event_", "Analytics + event duplication"), status: "proposed" },
  ],
  interview: [
    { step: L("Buat lowongan", "Create a vacancy"), detail: L("Jabatan, deskripsi, kompetensi", "Role, description, competencies"), status: "proposed" },
    { step: L("_Interview builder_", "Interview builder"), detail: L("Saran pertanyaan ditinjau HR", "Suggested questions reviewed by HR"), status: "proposed" },
    { step: L("Undang kandidat", "Invite candidates"), detail: L("Tautan wawancara terstruktur", "A structured-interview link"), status: "proposed" },
    { step: L("Wawancara AI", "AI interview"), detail: L("Pertanyaan inti + _follow-up_", "Core questions + follow-ups"), status: "existing" },
    { step: L("Laporan bukti", "Evidence report"), detail: L("Rubrik + kutipan jawaban", "Rubric + answer quotes"), status: "proposed" },
    { step: L("Tinjauan _recruiter_", "Recruiter review"), detail: L("Keputusan tetap di tangan manusia", "The decision stays with a human"), status: "proposed" },
  ],
};

/** Where each proposed feature can be tried in the product dashboards. */
const FEATURE_HREF: Record<string, string> = {
  "Smart Event Templates": "/dashboard/events/templates",
  "Repeat Event Planner": "/dashboard/events/repeat",
  "Organizer Growth Insights": "/dashboard/events/analytics",
  "Role-Based Interview Builder": "/dashboard/interview/builder",
  "Adaptive Structured Interview": "/dashboard/interview/portal",
  "Evidence-Linked Assessment": "/dashboard/interview/reports",
  "Recruiter Review Dashboard": "/dashboard/interview",
  "Responsible AI Controls": "/dashboard/interview/responsible-ai",
};

export function ProductDetail({ product }: { product: ProductKey }) {
  const p = PRODUCTS[product];
  const isEvents = product === "events";
  return (
    <>
      <PageHero
        eyebrow={`${p.category} · ${p.categoryLong}`}
        title={
          <>
            {p.name}
            <span className="mt-3 block text-2xl font-semibold leading-snug text-muted-strong md:text-[1.75rem]">
              <T v={p.tagline} />
            </span>
          </>
        }
        aside={
          <div className="relative mx-auto w-fit">
            <div className={`absolute inset-0 m-auto h-60 w-60 rounded-full blur-3xl ${isEvents ? "bg-sky/35" : "bg-royal/25"}`} />
            <Mascot name={isEvents ? "events" : "interview"} size={300} preload className="relative" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href={isEvents ? "/dashboard/events" : "/dashboard/interview"} size="lg">
            <Play className="h-4 w-4" /> <T id="Coba Simulasi Produk" en="Try the Product Simulation" />
          </Button>
          <Button href="/products" variant="secondary" size="lg">
            <T id="Bandingkan dua produk" en="Compare both products" />
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="brand" icon={<Building2 className="h-3 w-3" />}>
            <T v={p.buyer} />
          </Badge>
          <Badge tone="neutral" icon={<Clock className="h-3 w-3" />}>
            <T v={p.cycle} />
          </Badge>
          <Badge tone="neutral" icon={<Wallet className="h-3 w-3" />}>
            <T v={p.revenueModel} />
          </Badge>
        </div>
      </PageHero>

      <Container>
        <ModeContextBanner product={product} />
      </Container>

      <Section className="pt-14">
        <Container className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-line bg-card p-7 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">
                <T id="Target pelanggan" en="Target customers" />
              </p>
              <ul className="mt-4 space-y-3">
                {p.targetCustomers.map((t) => (
                  <li key={keyOf(t)} className="flex items-start gap-3 text-[15px] text-ink">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-soft text-brand-ink">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <T v={t} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl border border-line bg-card p-7 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-danger-ink">
                <T id="Masalah pelanggan" en="Customer problems" />
              </p>
              <ul className="mt-4 space-y-3">
                {p.problems.map((t) => (
                  <li key={keyOf(t)} className="flex items-start gap-3 text-[15px] text-ink">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-danger-soft text-danger-ink">
                      <AlertCircle className="h-3.5 w-3.5" />
                    </span>
                    <T v={t} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-card">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Alur Produk" en="Product Workflow" />}
              title={<T id="Alur produk dari awal hingga akhir" en="The product flow, start to finish" />}
              description={
                <T
                  id="Label menunjukkan mana yang sudah menjadi fondasi publik dan mana yang merupakan usulan prototipe."
                  en="Labels show what is already a public foundation and what is a prototype proposal."
                />
              }
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {WORKFLOWS[product].map((w, i) => (
              <Reveal key={w.step.id} delay={i * 0.06}>
                <div className="relative h-full rounded-2xl border border-line bg-surface p-4">
                  <span className="font-display text-3xl font-semibold text-gradient">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 font-semibold text-ink">
                    <T v={w.step} />
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-strong">
                    <T v={w.detail} />
                  </p>
                  <div className="mt-3">
                    <SourceLabel type={w.status === "existing" ? "public-source" : "strategic-proposal"} compact />
                  </div>
                  {i < 5 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-card p-0.5 text-brand shadow-soft lg:block" />}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="h-full rounded-3xl bg-navy-gradient p-7 text-white shadow-lift">
              <SourceLabel type="public-source" dark />
              <h3 className="mt-4 text-2xl font-semibold">
                {isEvents ? (
                  <T id="Fondasi produk yang sudah ada" en="The existing product foundation" />
                ) : (
                  <T id="Fondasi teknologi yang sudah ada" en="The existing technology foundation" />
                )}
              </h3>
              <ul className="mt-5 space-y-2.5">
                {p.existing.map((e) => (
                  <li key={keyOf(e)} className="flex items-start gap-2.5 text-sm text-white/85">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky" /> <T v={e} />
                  </li>
                ))}
              </ul>
              {!isEvents && (
                <p className="mt-6 rounded-xl bg-white/8 p-3 text-xs leading-relaxed text-white/70 ring-1 ring-white/15">
                  <T
                    id="Ketersediaan & kesiapan _enterprise_ fitur AI Candidate Interview tidak diasumsikan hanya dari simulator B2C yang ada."
                    en="The availability & enterprise readiness of AI Candidate Interview features is not assumed from the existing B2C simulator alone."
                  />
                </p>
              )}
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {p.proposals.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.06}>
                <div data-spotlight className="flex h-full flex-col rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-soft text-brand-ink">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <Badge tone={f.status === "later" ? "warning" : "brand"}>
                      {f.status === "later" ? <T id="Prioritas berikutnya" en="Next priority" /> : <T id="Usulan" en="Proposed" />}
                    </Badge>
                  </div>
                  <p className="mt-3 font-semibold text-ink">{f.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-strong">
                    <T v={f.description} />
                  </p>
                  {FEATURE_HREF[f.name] && (
                    <Link href={FEATURE_HREF[f.name]} className="group mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-brand-ink">
                      <T id="Coba fitur ini" en="Try this feature" /> <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {!isEvents && (
        <Container>
          <Callout tone="info" title={<T id="Prinsip Responsible HR AI" en="Responsible HR AI principles" />}>
            <T
              id={
                <>
                  AI diposisikan sebagai <strong>pendukung keputusan, bukan otoritas perekrutan</strong>. Prototipe ini tidak melakukan inferensi
                  kepribadian dari wajah, deteksi emosi, prediksi kompetensi tanpa dasar, maupun penolakan/penerimaan otomatis. Setiap penilaian
                  bersifat ilustratif, berbasis rubrik demo, dan wajib ditinjau manusia.
                </>
              }
              en={
                <>
                  AI is positioned as <strong>decision support, not a hiring authority</strong>. This prototype does not infer personality from
                  faces, detect emotions, predict competencies without grounds, or automatically reject/accept anyone. Every assessment is
                  illustrative, based on demo rubrics, and must be reviewed by a human.
                </>
              }
            />
          </Callout>
        </Container>
      )}

      <Container className="mt-10">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-card p-6 shadow-soft sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-ink">
              <T id="Siap mencoba alurnya?" en="Ready to try the flow?" />
            </p>
            <p className="text-sm text-muted-strong">
              <T id="Demo berjalan sepenuhnya di _browser_ dengan data fiktif." en="The demo runs entirely in your browser with fictional data." />
            </p>
          </div>
          <Button href={isEvents ? "/dashboard/events" : "/dashboard/interview"}>
            <T id={`Buka demo ${p.name}`} en={`Open the ${p.name} demo`} /> <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </>
  );
}
