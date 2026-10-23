"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, ClipboardList, FileSearch, LayoutDashboard, RefreshCw, ShieldCheck, Shuffle, Wand2, X } from "lucide-react";
import type { RoleKey } from "@/types/interview";
import { PRODUCTS } from "@/data/company";
import { ROADMAP } from "@/data/strategy";
import { ROLE_TEMPLATES, generateQuestions, COMPETENCY_MAP } from "@/data/candidates.mock";
import { assessAnswer } from "@/lib/assessment";
import { EvidenceCard } from "@/components/interview/evidence-card";
import { Segmented } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/misc";
import { SourceLabel } from "@/components/shared/source-label";
import { cn } from "@/lib/utils";
import { keyOf, L, useI18n } from "@/lib/i18n";

const FEATURE_ICONS = [Wand2, Shuffle, FileSearch, LayoutDashboard, ShieldCheck];

const BEFORE = [
  L("Jadwal wawancara diatur manual lewat _chat_ & _email_", "Interviews scheduled manually over chat & email"),
  L("Pertanyaan berbeda-beda antar _interviewer_", "Questions vary from one interviewer to another"),
  L("Catatan jawaban tersebar & sulit dibandingkan", "Answer notes are scattered & hard to compare"),
  L("Skor tanpa bukti yang bisa ditelusuri", "Scores without traceable evidence"),
  L("Tidak ada jejak audit keputusan", "No audit trail of decisions"),
];
const AFTER = [
  L("Tautan wawancara terstruktur dikirim sekali klik", "A structured-interview link sent in one click"),
  L("Pertanyaan inti terstandar per kompetensi jabatan", "Standardised core questions per role competency"),
  L("Transkrip & bukti terhubung ke rubrik", "Transcripts & evidence linked to the rubric"),
  L("Penilaian ilustratif dengan kutipan & batasan", "Illustrative ratings with quotes & limitations"),
  L("_Recruiter_ meninjau, memberi catatan & _override_ — tercatat di _audit trail_", "Recruiters review, add notes & override — logged in the audit trail"),
];

const CHECKLIST = [
  { id: "rubric", label: L("Rubrik kompetensi divalidasi bersama 3 HR _pilot_", "Competency rubric validated with 3 pilot HR teams") },
  { id: "human", label: L("Tinjauan manusia wajib sebelum laporan final", "Mandatory human review before the final report") },
  { id: "privacy", label: L("Pemberitahuan pemrosesan data & persetujuan kandidat", "Data-processing notice & candidate consent") },
  { id: "retention", label: L("Kebijakan retensi & penghapusan data", "Data retention & deletion policy") },
  { id: "audit", label: L("_Audit trail_ untuk setiap aksi _recruiter_", "Audit trail for every recruiter action") },
  { id: "bias", label: L("Uji konsistensi penilaian lintas kelompok kandidat", "Rating-consistency tests across candidate groups") },
  { id: "sla", label: L("SLA dukungan pelanggan & _onboarding_ HR", "Customer-support SLA & HR onboarding") },
];

const SAMPLE_ANSWER = L(
  "Saat magang, saya menjelaskan proses klaim garansi kepada pelanggan lansia. Saya memecah langkah menjadi tiga bagian, memakai contoh sederhana, lalu meminta beliau mengulang untuk konfirmasi. Hasilnya klaim selesai di hari yang sama.",
  "During my internship, I had to explain the warranty-claim process to an elderly customer. I broke the steps into three parts, used simple examples, then asked her to repeat them back to confirm she understood. As a result, the claim was completed the same day.",
);

export function OnePillarOptimize() {
  const [flow, setFlow] = useState<"before" | "after">("after");
  const { t, tx, locale } = useI18n();
  const sample = useMemo(() => assessAnswer(SAMPLE_ANSWER[locale], "komunikasi"), [locale]);
  const [role, setRole] = useState<RoleKey>("customer-service");
  const [variant, setVariant] = useState(0);
  const [checked, setChecked] = useState<string[]>(["human", "privacy", "audit"]);
  const questions = useMemo(() => generateQuestions(ROLE_TEMPLATES[role].competencies, variant), [role, variant]);

  return (
    <div className="space-y-10">
      {/* Feature overview */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">{tx("Program _Flagship_", "Flagship Program")}</p>
            <h3 className="text-2xl font-semibold text-ink">AI Interview Intelligence Suite</h3>
          </div>
          <SourceLabel type="strategic-proposal" />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PRODUCTS.interview.proposals.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-line bg-card p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-gradient text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">{f.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-strong">{tx(f.description)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Before / after */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-ink">{tx("_Workflow_ wawancara: sebelum vs sesudah", "Interview workflow: before vs after")}</h3>
          <Segmented
            items={[
              { id: "before", label: t("Sebelum", "Before") },
              { id: "after", label: t("Sesudah (ONE)", "After (ONE)") },
            ]}
            value={flow}
            onChange={setFlow}
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-5">
          {(flow === "before" ? BEFORE : AFTER).map((item, i) => (
            <motion.div
              key={flow + keyOf(item)}
              initial={{ opacity: 0, rotateX: -60 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "flex items-start gap-2 rounded-xl p-3 text-[13px] font-medium",
                flow === "before" ? "bg-danger-soft text-danger-ink" : "bg-success-soft text-success-ink",
              )}
            >
              {flow === "before" ? <X className="mt-0.5 h-4 w-4 shrink-0" /> : <Check className="mt-0.5 h-4 w-4 shrink-0" />}
              {tx(item)}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Builder preview */}
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-ink">{tx("Interview Builder — _preview_", "Interview Builder — preview")}</h3>
              <p className="text-sm text-muted-strong">{t("Pilih jabatan untuk melihat set pertanyaan berbeda.", "Pick a role to see a different question set.")}</p>
            </div>
            <SourceLabel type="synthetic-demo" compact />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(ROLE_TEMPLATES) as RoleKey[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setVariant(0);
                }}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-semibold ring-1 transition",
                  role === r ? "bg-one text-white ring-one" : "bg-card text-muted-strong ring-line hover:ring-one/40",
                )}
              >
                {ROLE_TEMPLATES[r].label}
              </button>
            ))}
          </div>
          <ol className="mt-4 space-y-2">
            {questions.map((q, i) => (
              <motion.li
                key={q.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-surface p-3 ring-1 ring-line"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-one-ink">{t(COMPETENCY_MAP[q.competencyId]?.name ?? "")}</p>
                <p className="mt-0.5 text-[13px] text-ink">{tx(q.text)}</p>
              </motion.li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setVariant((v) => v + 1)}>
              <RefreshCw className="h-3.5 w-3.5" /> {t("Buat variasi lain", "Generate another variation")}
            </Button>
            <Button size="sm" href="/dashboard/interview">
              {tx("Buka _builder_ lengkap", "Open the full builder")} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="mt-3 text-[11.5px] text-muted">
            {t("Semua pertanyaan harus ditinjau & disetujui HR sebelum dipublikasikan.", "Every question must be reviewed & approved by HR before publishing.")}
          </p>
        </div>

        {/* Assessment example */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">{t("Contoh laporan berbasis bukti", "Example evidence-based report")}</h3>
            <SourceLabel type="synthetic-demo" compact />
          </div>
          <EvidenceCard
            evidence={sample}
            weight={30}
            compact
            reviewerNote={L(
              "Contoh konkret dan ada konfirmasi pemahaman. Setuju dengan level sinyal; lanjutkan ke wawancara _user_. — Recruiter Demo",
              "A concrete example with a check for understanding. Agree with the signal level; proceed to the hiring-manager interview. — Recruiter Demo",
            )}
          />
          <p className="mt-3 text-center text-sm font-semibold text-one-ink">From Generic Interview Scores to Evidence-Based Recruiter Insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Roadmap */}
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">{tx("_Roadmap_ produk (usulan, 4 kuartal)", "Product roadmap (proposed, 4 quarters)")}</h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
            {ROADMAP.one.map((q, i) => (
              <div key={q.quarter} className="relative rounded-2xl bg-surface p-4 ring-1 ring-line">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-one-gradient text-xs font-semibold text-white">{q.quarter}</span>
                <ul className="mt-3 space-y-1.5">
                  {q.items.map((it) => (
                    <li key={keyOf(it)} className="text-[12.5px] leading-snug text-ink">
                      • {tx(it)}
                    </li>
                  ))}
                </ul>
                {i < 3 && <ArrowRight className="absolute -right-3 top-5 z-10 hidden h-5 w-5 rounded-full bg-card p-0.5 text-one-ink shadow-soft sm:block" />}
              </div>
            ))}
          </div>
        </div>
        {/* Readiness checklist */}
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
              <ClipboardList className="h-5 w-5 text-one-ink" /> {t("Kesiapan produk", "Product readiness")}
            </h3>
            <span className="tabular text-sm font-semibold text-one-ink">
              {checked.length}/{CHECKLIST.length}
            </span>
          </div>
          <Progress value={checked.length / CHECKLIST.length} tone="one" className="mt-3" />
          <div className="mt-4 space-y-1.5">
            {CHECKLIST.map((c) => {
              const on = checked.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChecked((prev) => (on ? prev.filter((x) => x !== c.id) : [...prev, c.id]))}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left text-[13px] transition hover:bg-surface"
                  aria-pressed={on}
                >
                  <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-md ring-1", on ? "bg-one text-white ring-one" : "bg-card ring-line")}>
                    {on && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className={on ? "text-ink" : "text-muted-strong"}>{tx(c.label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
