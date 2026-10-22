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

const WORKFLOWS: Record<ProductKey, { step: string; detail: string; status: "existing" | "proposed" }[]> = {
  events: [
    { step: "Setup event", detail: "Informasi dasar, kategori, kuota & biaya", status: "existing" },
    { step: "Smart template", detail: "Isi otomatis tahapan & rubrik", status: "proposed" },
    { step: "Registrasi & pembayaran", detail: "Peserta mendaftar & membayar", status: "existing" },
    { step: "Submisi", detail: "Peserta mengunggah karya", status: "existing" },
    { step: "Penjurian", detail: "Rubrik berbobot & reviewer", status: "existing" },
    { step: "Insights & repeat", detail: "Analitik + duplikasi event", status: "proposed" },
  ],
  interview: [
    { step: "Buat lowongan", detail: "Jabatan, deskripsi, kompetensi", status: "proposed" },
    { step: "Interview builder", detail: "Saran pertanyaan ditinjau HR", status: "proposed" },
    { step: "Undang kandidat", detail: "Tautan wawancara terstruktur", status: "proposed" },
    { step: "Wawancara AI", detail: "Pertanyaan inti + follow-up", status: "existing" },
    { step: "Laporan bukti", detail: "Rubrik + kutipan jawaban", status: "proposed" },
    { step: "Tinjauan recruiter", detail: "Keputusan tetap di tangan manusia", status: "proposed" },
  ],
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
            <span className="mt-2 block text-2xl font-bold text-muted-strong md:text-3xl">{p.tagline}</span>
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
            <Play className="h-4 w-4" /> Coba Simulasi Produk
          </Button>
          <Button href="/products" variant="secondary" size="lg">
            Bandingkan dua produk
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="brand" icon={<Building2 className="h-3 w-3" />}>
            {p.buyer}
          </Badge>
          <Badge tone="neutral" icon={<Clock className="h-3 w-3" />}>
            {p.cycle}
          </Badge>
          <Badge tone="neutral" icon={<Wallet className="h-3 w-3" />}>
            {p.revenueModel}
          </Badge>
        </div>
      </PageHero>

      <Container>
        <ModeContextBanner product={product} />
      </Container>

      <Section className="pt-14">
        <Container className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-line bg-card p-7 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">Target pelanggan</p>
              <ul className="mt-4 space-y-3">
                {p.targetCustomers.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-ink">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-soft text-brand-ink">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl border border-line bg-card p-7 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-danger-ink">Masalah pelanggan</p>
              <ul className="mt-4 space-y-3">
                {p.problems.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-ink">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-danger-soft text-danger-ink">
                      <AlertCircle className="h-3.5 w-3.5" />
                    </span>
                    {t}
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
              eyebrow="Product Workflow"
              title="Alur produk dari awal hingga akhir"
              description="Label menunjukkan mana yang sudah menjadi fondasi publik dan mana yang merupakan usulan prototype."
            />
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {WORKFLOWS[product].map((w, i) => (
              <Reveal key={w.step} delay={i * 0.06}>
                <div className="relative h-full rounded-2xl border border-line bg-surface p-4">
                  <span className="font-display text-3xl font-bold text-gradient">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 font-semibold text-ink">{w.step}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-strong">{w.detail}</p>
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
        <Container className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="h-full rounded-3xl bg-navy-gradient p-7 text-white shadow-lift">
              <SourceLabel type="public-source" dark />
              <h3 className="mt-4 text-2xl font-semibold">{isEvents ? "Fondasi produk yang sudah ada" : "Fondasi teknologi yang sudah ada"}</h3>
              <ul className="mt-5 space-y-2.5">
                {p.existing.map((e) => (
                  <li key={e} className="flex items-start gap-2.5 text-sm text-white/85">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky" /> {e}
                  </li>
                ))}
              </ul>
              {!isEvents && (
                <p className="mt-6 rounded-xl bg-white/8 p-3 text-xs leading-relaxed text-white/70 ring-1 ring-white/15">
                  Ketersediaan & kesiapan enterprise fitur AI Candidate Interview tidak diasumsikan hanya dari simulator B2C yang ada.
                </p>
              )}
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {p.proposals.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-soft text-brand-ink">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <Badge tone={f.status === "later" ? "warning" : "brand"}>{f.status === "later" ? "Prioritas berikutnya" : "Usulan"}</Badge>
                  </div>
                  <p className="mt-3 font-semibold text-ink">{f.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-strong">{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {!isEvents && (
        <Container>
          <Callout tone="info" title="Prinsip Responsible HR AI">
            AI diposisikan sebagai <strong>pendukung keputusan, bukan otoritas perekrutan</strong>. Prototype ini tidak melakukan inferensi
            kepribadian dari wajah, deteksi emosi, prediksi kompetensi tanpa dasar, maupun penolakan/penerimaan otomatis. Setiap penilaian
            bersifat ilustratif, berbasis rubrik demo, dan wajib ditinjau manusia.
          </Callout>
        </Container>
      )}

      <Container className="mt-10">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-card p-6 shadow-soft sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-ink">Siap mencoba alurnya?</p>
            <p className="text-sm text-muted-strong">Demo berjalan sepenuhnya di browser dengan data fiktif.</p>
          </div>
          <Button href={isEvents ? "/dashboard/events" : "/dashboard/interview"}>
            Buka demo {p.name} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </>
  );
}
