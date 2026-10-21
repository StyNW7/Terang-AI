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

const FEATURE_ICONS = [Wand2, Shuffle, FileSearch, LayoutDashboard, ShieldCheck];

const BEFORE = [
  "Jadwal wawancara diatur manual lewat chat & email",
  "Pertanyaan berbeda-beda antar interviewer",
  "Catatan jawaban tersebar & sulit dibandingkan",
  "Skor tanpa bukti yang bisa ditelusuri",
  "Tidak ada jejak audit keputusan",
];
const AFTER = [
  "Tautan wawancara terstruktur dikirim sekali klik",
  "Pertanyaan inti terstandar per kompetensi jabatan",
  "Transkrip & bukti terhubung ke rubrik",
  "Penilaian ilustratif dengan kutipan & batasan",
  "Recruiter meninjau, memberi catatan & override — tercatat di audit trail",
];

const CHECKLIST = [
  { id: "rubric", label: "Rubrik kompetensi divalidasi bersama 3 HR pilot" },
  { id: "human", label: "Tinjauan manusia wajib sebelum laporan final" },
  { id: "privacy", label: "Pemberitahuan pemrosesan data & persetujuan kandidat" },
  { id: "retention", label: "Kebijakan retensi & penghapusan data" },
  { id: "audit", label: "Audit trail untuk setiap aksi recruiter" },
  { id: "bias", label: "Uji konsistensi penilaian lintas kelompok kandidat" },
  { id: "sla", label: "SLA dukungan pelanggan & onboarding HR" },
];

const SAMPLE = assessAnswer(
  "Saat magang, saya menjelaskan proses klaim garansi kepada pelanggan lansia. Saya memecah langkah menjadi tiga bagian, memakai contoh sederhana, lalu meminta beliau mengulang untuk konfirmasi. Hasilnya klaim selesai di hari yang sama.",
  "komunikasi",
);

export function OnePillarOptimize() {
  const [flow, setFlow] = useState<"before" | "after">("after");
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
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-one">Flagship Program</p>
            <h3 className="text-2xl font-extrabold text-ink">AI Interview Intelligence Suite</h3>
          </div>
          <SourceLabel type="strategic-proposal" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PRODUCTS.interview.proposals.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-gradient text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-bold text-ink">{f.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-strong">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Before / after */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-ink">Workflow wawancara: sebelum vs sesudah</h3>
          <Segmented
            items={[
              { id: "before", label: "Sebelum" },
              { id: "after", label: "Sesudah (ONE)" },
            ]}
            value={flow}
            onChange={setFlow}
          />
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-5">
          {(flow === "before" ? BEFORE : AFTER).map((t, i) => (
            <motion.div
              key={flow + t}
              initial={{ opacity: 0, rotateX: -60 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "flex items-start gap-2 rounded-xl p-3 text-[13px] font-medium",
                flow === "before" ? "bg-danger-soft text-[#8a1c20]" : "bg-success-soft text-[#0b5b44]",
              )}
            >
              {flow === "before" ? <X className="mt-0.5 h-4 w-4 shrink-0" /> : <Check className="mt-0.5 h-4 w-4 shrink-0" />}
              {t}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Builder preview */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-ink">Interview Builder — preview</h3>
              <p className="text-sm text-muted-strong">Pilih jabatan untuk melihat set pertanyaan berbeda.</p>
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
                  role === r ? "bg-one text-white ring-one" : "bg-white text-muted-strong ring-line hover:ring-one/40",
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
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-one">{COMPETENCY_MAP[q.competencyId]?.name}</p>
                <p className="mt-0.5 text-[13px] text-ink">{q.text}</p>
              </motion.li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setVariant((v) => v + 1)}>
              <RefreshCw className="h-3.5 w-3.5" /> Buat variasi lain
            </Button>
            <Button size="sm" href="/demo/interview">
              Buka builder lengkap <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="mt-3 text-[11.5px] text-muted">Semua pertanyaan harus ditinjau & disetujui HR sebelum dipublikasikan.</p>
        </div>

        {/* Assessment example */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Contoh laporan berbasis bukti</h3>
            <SourceLabel type="synthetic-demo" compact />
          </div>
          <EvidenceCard
            evidence={SAMPLE}
            weight={30}
            compact
            reviewerNote="Contoh konkret dan ada konfirmasi pemahaman. Setuju dengan level sinyal; lanjutkan ke wawancara user. — Recruiter Demo"
          />
          <p className="mt-3 text-center text-sm font-semibold text-one">From Generic Interview Scores to Evidence-Based Recruiter Insights.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Roadmap */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <h3 className="text-lg font-bold text-ink">Roadmap produk (usulan, 4 kuartal)</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {ROADMAP.one.map((q, i) => (
              <div key={q.quarter} className="relative rounded-2xl bg-surface p-4 ring-1 ring-line">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-one-gradient text-xs font-bold text-white">{q.quarter}</span>
                <ul className="mt-3 space-y-1.5">
                  {q.items.map((it) => (
                    <li key={it} className="text-[12.5px] leading-snug text-ink">
                      • {it}
                    </li>
                  ))}
                </ul>
                {i < 3 && <ArrowRight className="absolute -right-3 top-5 z-10 hidden h-5 w-5 rounded-full bg-white p-0.5 text-one shadow-soft sm:block" />}
              </div>
            ))}
          </div>
        </div>
        {/* Readiness checklist */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
              <ClipboardList className="h-5 w-5 text-one" /> Product readiness
            </h3>
            <span className="tabular text-sm font-bold text-one">
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
                  <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-md ring-1", on ? "bg-one text-white ring-one" : "bg-white ring-line")}>
                    {on && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className={on ? "text-ink" : "text-muted-strong"}>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
