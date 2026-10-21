import type { Metadata } from "next";
import { ExternalLink, Lock, Sigma } from "lucide-react";
import type { EvidenceClassification } from "@/types/common";
import { Container, PageHero, Section } from "@/components/layout/container";
import { SectionHeading, Callout } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/reveal";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { EVIDENCE_META, PUBLIC_SOURCES } from "@/data/public-sources";
import { STRATEGY_GLOSSARY } from "@/data/strategy";
import { FORMULAS } from "@/lib/finance";

export const metadata: Metadata = { title: "Referensi & Asumsi" };

const SIMULATED = [
  { feature: "Registrasi, pembayaran & sertifikat (Demo Events)", how: "State React + localStorage; tidak ada transaksi atau email nyata." },
  { feature: "Smart Event Templates & Repeat Event Planner", how: "Template statis mengisi wizard; duplikasi tanpa data peserta." },
  { feature: "Interview Builder", how: "Generator deterministik dari bank pertanyaan per kompetensi — bukan model AI." },
  { feature: "Wawancara kandidat & follow-up", how: "Aturan berbasis panjang jawaban & penanda hasil — tidak ada inferensi AI." },
  { feature: "Evidence-Linked Assessment", how: "Pencocokan kata kunci rubrik + kutipan kalimat; wajib tinjauan manusia." },
  { feature: "ACE Command Center & rekomendasi", how: "Validasi aturan kapasitas & anggaran; bukan saran AI." },
  { feature: "Simulator ONE vs ACE", how: "Fungsi murni dengan asumsi akademik ilustratif & rumus terbuka." },
  { feature: "Portfolio decision matrix", how: "Ambang KPI eksplisit dengan hard gate privasi/keamanan/validitas." },
];

export default function ReferencesPage() {
  return (
    <>
      <PageHero
        eyebrow="References & Assumptions"
        title={
          <>
            Sumber, asumsi, dan <span className="text-gradient">batasan prototype.</span>
          </>
        }
        description="Transparansi adalah bagian dari argumen. Halaman ini memisahkan informasi publik, usulan solusi, asumsi ilustratif, dan interaksi simulasi."
        aside={
          <div className="relative mx-auto w-fit">
            <Mascot name="question" size={280} preload />
          </div>
        }
      />

      <Section className="pt-6">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Evidence Classification" title="Lima label sumber yang dipakai di seluruh website" />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(EVIDENCE_META) as EvidenceClassification[]).map((k, i) => (
              <Reveal key={k} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-white p-5 shadow-soft">
                  <SourceLabel type={k} />
                  <p className="mt-3 text-sm leading-relaxed text-muted-strong">{EVIDENCE_META[k].description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Public Research Sources" title="Sumber riset publik" />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PUBLIC_SOURCES.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.04}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-brand/40 hover:bg-white hover:shadow-card"
                >
                  <div>
                    <p className="text-xs font-semibold text-muted">{s.publisher}</p>
                    <p className="mt-0.5 font-bold text-ink group-hover:text-brand-ink">{s.title}</p>
                    <p className="mt-1 break-all text-xs text-brand-ink">{s.url}</p>
                    <p className="mt-2 text-sm text-muted-strong">{s.usedFor}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted transition group-hover:text-brand-ink" />
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionHeading eyebrow="Glossary" title="Glosarium istilah" />
            </Reveal>
            <dl className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
              {STRATEGY_GLOSSARY.map((g) => (
                <div key={g.term} className="grid gap-1 p-4 sm:grid-cols-[170px_1fr]">
                  <dt className="font-bold text-ink">{g.term}</dt>
                  <dd className="text-sm text-muted-strong">{g.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Reveal>
              <SectionHeading eyebrow="What is simulated" title="Apa yang disimulasikan?" />
            </Reveal>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
              {SIMULATED.map((s) => (
                <div key={s.feature} className="border-b border-line p-4 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-ink">{s.feature}</p>
                    <SourceLabel type="synthetic-demo" compact />
                  </div>
                  <p className="mt-1 text-sm text-muted-strong">{s.how}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Financial Formulas" title="Rumus simulasi finansial" description="Semua angka pada simulator dihitung dengan rumus berikut menggunakan asumsi ilustratif yang sama untuk ONE dan ACE." />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {FORMULAS.map((f) => (
              <div key={f.name} className="rounded-2xl border border-line bg-surface p-5">
                <p className="flex items-center gap-2 font-bold text-ink">
                  <Sigma className="h-4 w-4 text-brand-ink" /> {f.name}
                </p>
                <code className="mt-2 block rounded-lg bg-navy px-3 py-2 text-[12.5px] text-sky">{f.formula}</code>
                <p className="mt-2 text-sm text-muted-strong">{f.note}</p>
              </div>
            ))}
          </div>
          <Callout tone="warning" className="mt-8" icon={<Lock className="h-[18px] w-[18px]" />} title="Kerahasiaan & penggunaan">
            Guidebook BCDC 2026 membatasi penyebaran studi kasus. Prototype ini tidak memuat dokumen kasus, dan konfigurasi skenario (mis.
            struktur 7 personel) diberi label konteks kasus. Untuk deployment, gunakan pembatasan akses di level server/platform — label di
            halaman bukan mekanisme keamanan. Website ini adalah unofficial academic concept prototype dan tidak mewakili PT Terang Inovasi
            Indonesia.
          </Callout>
        </Container>
      </Section>
    </>
  );
}
