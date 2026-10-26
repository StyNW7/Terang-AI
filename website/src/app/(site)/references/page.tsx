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
import { T } from "@/lib/i18n";
import { L, type Bilingual } from "@/lib/i18n-core";

export const metadata: Metadata = { title: "Referensi & Asumsi" };

const SIMULATED: { feature: Bilingual; how: Bilingual }[] = [
  {
    feature: L("Registrasi, pembayaran & sertifikat (Demo Events)", "Registration, payment & certificates (Events demo)"),
    how: L("_State_ React + _localStorage_; tidak ada transaksi atau _email_ nyata.", "React state + localStorage; no real transactions or emails."),
  },
  {
    feature: L("Smart Event Templates & Repeat Event Planner", "Smart Event Templates & Repeat Event Planner"),
    how: L("_Template_ statis mengisi _wizard_; duplikasi tanpa data peserta.", "Static templates fill the wizard; duplication without participant data."),
  },
  {
    feature: L("Interview Builder", "Interview Builder"),
    how: L("Generator deterministik dari bank pertanyaan per kompetensi — bukan model AI.", "A deterministic generator over a per-competency question bank — not an AI model."),
  },
  {
    feature: L("Wawancara kandidat & _follow-up_", "Candidate interview & follow-ups"),
    how: L("Aturan berbasis panjang jawaban & penanda hasil — tidak ada inferensi AI.", "Rules based on answer length & result markers — no AI inference."),
  },
  {
    feature: L("Evidence-Linked Assessment", "Evidence-Linked Assessment"),
    how: L("Pencocokan kata kunci rubrik + kutipan kalimat; wajib tinjauan manusia.", "Rubric keyword matching + sentence quotes; human review is mandatory."),
  },
  {
    feature: L("ACE Command Center & rekomendasi", "ACE Command Center & recommendations"),
    how: L("Validasi aturan kapasitas & anggaran; bukan saran AI.", "Rule-based capacity & budget validation; not AI advice."),
  },
  {
    feature: L("Simulator ONE vs ACE", "ONE vs ACE Simulator"),
    how: L("Fungsi murni dengan asumsi akademik ilustratif & rumus terbuka.", "Pure functions with illustrative academic assumptions & open formulas."),
  },
  {
    feature: L("_Portfolio decision matrix_", "Portfolio decision matrix"),
    how: L("Ambang KPI eksplisit dengan _hard gate_ privasi/keamanan/validitas.", "Explicit KPI thresholds with privacy/safety/validity hard gates."),
  },
];

export default function ReferencesPage() {
  return (
    <>
      <PageHero
        eyebrow={<T id="Referensi & Asumsi" en="References & Assumptions" />}
        title={
          <T
            id={
              <>
                Sumber, asumsi, dan <span className="text-gradient">batasan prototipe.</span>
              </>
            }
            en={
              <>
                Sources, assumptions and <span className="text-gradient">prototype limits.</span>
              </>
            }
          />
        }
        description={
          <T
            id="Transparansi adalah bagian dari argumen. Halaman ini memisahkan informasi publik, usulan solusi, asumsi ilustratif, dan interaksi simulasi."
            en="Transparency is part of the argument. This page separates public information, proposed solutions, illustrative assumptions and simulated interactions."
          />
        }
        aside={
          <div className="relative mx-auto w-fit">
            <Mascot name="question" size={280} preload />
          </div>
        }
      />

      <Section className="pt-6">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Klasifikasi Bukti" en="Evidence Classification" />}
              title={<T id="Tujuh label sumber yang dipakai di seluruh _website_" en="Seven source labels used across the website" />}
              description={
                <T
                  id="Setiap angka dan fitur diberi label agar jelas mana fakta publik, mana usulan tim, dan mana simulasi."
                  en="Every figure and feature is labelled so it is clear what is public fact, what is the team's proposal and what is simulated."
                />
              }
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(EVIDENCE_META) as EvidenceClassification[]).map((k, i) => (
              <Reveal key={k} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-card p-5 shadow-soft">
                  <SourceLabel type={k} />
                  <p className="mt-3 text-sm leading-relaxed text-muted-strong">
                    <T v={EVIDENCE_META[k].description} />
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-card">
        <Container>
          <Reveal>
            <SectionHeading eyebrow={<T id="Sumber Riset Publik" en="Public Research Sources" />} title={<T id="Sumber riset publik" en="Public research sources" />} />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {PUBLIC_SOURCES.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.04}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-brand/40 hover:bg-card hover:shadow-card"
                >
                  <div>
                    <p className="text-xs font-semibold text-muted">
                      <T v={s.publisher} />
                    </p>
                    <p className="mt-0.5 font-semibold text-ink group-hover:text-brand-ink">
                      <T v={s.title} />
                    </p>
                    <p className="mt-1 break-all text-xs text-brand-ink">{s.url}</p>
                    <p className="mt-2 text-sm text-muted-strong">
                      <T v={s.usedFor} />
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted transition group-hover:text-brand-ink" />
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionHeading eyebrow={<T id="Glosarium" en="Glossary" />} title={<T id="Glosarium istilah" en="Glossary of terms" />} />
            </Reveal>
            <dl className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
              {STRATEGY_GLOSSARY.map((g) => (
                <div key={g.term} className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[170px_1fr]">
                  <dt className="font-semibold text-ink">
                    <T id={`_${g.term}_`} en={g.term} />
                  </dt>
                  <dd className="text-sm text-muted-strong">
                    <T v={g.meaning} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Reveal>
              <SectionHeading eyebrow={<T id="Yang Disimulasikan" en="What Is Simulated" />} title={<T id="Apa yang disimulasikan?" en="What is simulated?" />} />
            </Reveal>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-card">
              {SIMULATED.map((s) => (
                <div key={s.feature.id} className="border-b border-line p-4 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-ink">
                      <T v={s.feature} />
                    </p>
                    <SourceLabel type="synthetic-demo" compact />
                  </div>
                  <p className="mt-1 text-sm text-muted-strong">
                    <T v={s.how} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-card">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={<T id="Rumus Finansial" en="Financial Formulas" />}
              title={<T id="Rumus simulasi finansial" en="Financial simulation formulas" />}
              description={
                <T
                  id="Semua angka pada simulator dihitung dengan rumus berikut menggunakan asumsi ilustratif yang sama untuk ONE dan ACE."
                  en="Every figure in the simulator is computed with the formulas below, using the same illustrative assumptions for ONE and ACE."
                />
              }
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {FORMULAS.map((f) => (
              <div key={f.name.id} className="rounded-2xl border border-line bg-surface p-5">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <Sigma className="h-4 w-4 text-brand-ink" /> <T v={f.name} />
                </p>
                <code className="mt-2 block rounded-lg bg-navy px-3 py-2 text-[12.5px] text-sky">{f.formula}</code>
                <p className="mt-2 text-sm text-muted-strong">
                  <T v={f.note} />
                </p>
              </div>
            ))}
          </div>
          <Callout tone="warning" className="mt-8" icon={<Lock className="h-[18px] w-[18px]" />} title={<T id="Kerahasiaan & penggunaan" en="Confidentiality & use" />}>
            <T
              id="_Guidebook_ BCDC 2026 membatasi penyebaran studi kasus. Prototipe ini tidak memuat dokumen kasus, dan konfigurasi skenario (mis. struktur 7 personel) diberi label konteks kasus. Untuk _deployment_, gunakan pembatasan akses di level _server_/platform — label di halaman bukan mekanisme keamanan. Situs ini adalah prototipe konsep akademik dan tidak mewakili PT Terang Inovasi Indonesia."
              en="The BCDC 2026 guidebook restricts distribution of the case study. This prototype contains no case documents, and scenario settings (e.g. the 7-person structure) are labelled as case context. For deployment, use server/platform-level access restrictions — on-page labels are not a security mechanism. This site is an academic concept prototype and does not represent PT Terang Inovasi Indonesia."
            />
          </Callout>
        </Container>
      </Section>
    </>
  );
}
