"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, FileText, Flag, MessageSquarePlus, RotateCcw, Scale, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useInterviewStore } from "@/store/interview-store";
import { assessCandidate, weightedSummary, LEVEL_LABEL } from "@/lib/assessment";
import { COMPETENCY_MAP } from "@/data/candidates.mock";
import { EvidenceCard } from "./evidence-card";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/form";
import { Callout, EmptyState } from "@/components/ui/misc";
import { InfoTip } from "@/components/ui/tooltip";
import { SourceLabel } from "@/components/shared/source-label";
import { formatDate, formatDateTime } from "@/lib/formatters";
import { CandidateStatusBadge, displayName } from "./shared";
import { L, useI18n } from "@/lib/i18n";

export function ReportViewer({ candidateId, onSelect }: { candidateId?: string; onSelect: (id: string) => void }) {
  const { t, tx, locale } = useI18n();
  const candidates = useInterviewStore((s) => s.candidates);
  const jobs = useInterviewStore((s) => s.jobs);
  const mask = useInterviewStore((s) => s.maskIdentity);
  const setStatus = useInterviewStore((s) => s.setStatus);
  const addNote = useInterviewStore((s) => s.addNote);
  const toggleFlag = useInterviewStore((s) => s.toggleFlag);
  const overrideLevel = useInterviewStore((s) => s.overrideLevel);
  const [note, setNote] = useState("");

  const withReports = candidates.filter((c) => c.transcript.length > 0);
  const candidate = withReports.find((c) => c.id === candidateId) ?? withReports[0];
  const job = jobs.find((j) => j.id === candidate?.jobId);
  const evidence = candidate ? (candidate.evidence.length ? candidate.evidence : assessCandidate(candidate, job, locale)) : [];
  const summary = weightedSummary(evidence, job, candidate?.overrides);

  if (!candidate || !job) {
    return (
      <EmptyState
        icon={<FileText className="h-5 w-5" />}
        title={t("Belum ada laporan", "No reports yet")}
        description={t("Laporan muncul setelah kandidat menyelesaikan wawancara.", "Reports appear once a candidate completes the interview.")}
      />
    );
  }

  const name = displayName(candidate, mask);
  const lastNote = candidate.notes[candidate.notes.length - 1]?.text;

  const saveNote = () => {
    if (note.trim().length < 5) {
      toast.error(t("Catatan minimal 5 karakter.", "A note must be at least 5 characters."));
      return;
    }
    addNote(candidate.id, note.trim());
    setNote("");
    toast.success(t("Catatan _review_ ditambahkan & tercatat di _audit trail_.", "Review note added & logged in the audit trail."));
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-ink">{name}</h3>
              <CandidateStatusBadge status={candidate.status} />
              {candidate.flagged && (
                <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-semibold text-danger-ink">
                  <Flag className="h-3 w-3" /> {t("Inspeksi manual", "Manual inspection")}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-strong">
              {job.title} · {t("selesai", "completed")} {candidate.completedAt ? formatDate(candidate.completedAt) : "—"}
            </p>
          </div>
          <Select value={candidate.id} onChange={(e) => onSelect(e.target.value)} className="md:w-64" aria-label={t("Pilih kandidat", "Choose a candidate")}>
            {withReports.map((c) => (
              <option key={c.id} value={c.id}>
                {displayName(c, mask)}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl bg-one-gradient p-5 text-white shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">{t("Ringkasan rubrik", "Rubric summary")}</p>
              <InfoTip light>
                {tx(
                  "Rata-rata level rubrik (1–4) tertimbang bobot kompetensi, termasuk _override_ _recruiter_. Ini ringkasan bukti — bukan skor kelayakan atau rekomendasi terima/tolak.",
                  "The average rubric level (1–4) weighted by competency, including recruiter overrides. It summarises evidence — it is not an eligibility score or an accept/reject recommendation.",
                )}
              </InfoTip>
            </div>
            <p className="tabular mt-2 font-display text-5xl font-semibold">{summary.toFixed(1)}<span className="text-xl text-white/70"> / 4</span></p>
            <p className="mt-1 text-sm text-white/85">≈ {LEVEL_LABEL[Math.round(summary)] ? t(LEVEL_LABEL[Math.round(summary)]) : "—"}</p>
            <p className="mt-4 rounded-xl bg-white/12 p-3 text-xs leading-relaxed ring-1 ring-white/20">
              {t(
                "Tidak ada keputusan otomatis. Keputusan lanjut/tidak tetap dibuat manusia melalui proses rekrutmen perusahaan.",
                "No automated decision. Whether to proceed is still decided by a human through the company's hiring process.",
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink">{t("Level per kompetensi", "Level per competency")}</p>
            <div className="mt-3 space-y-3">
              {job.competencies.map((c) => {
                const ev = evidence.find((e) => e.competencyId === c.id);
                const level = candidate.overrides[c.id] ?? ev?.level ?? 0;
                return (
                  <div key={c.id}>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink">{t(COMPETENCY_MAP[c.id]?.name ?? c.id)}</span>
                      <span className="tabular text-xs text-muted">
                        {t("bobot", "weight")} {c.weight}% · <strong className="text-ink">L{level}</strong>
                        {candidate.overrides[c.id] && <span className="ml-1 text-success-ink">({tx("_override_", "override")})</span>}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-track">
                      <motion.div className="h-full rounded-full bg-one-gradient" initial={{ width: 0 }} animate={{ width: `${(level / 4) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-ink">{tx("Penilaian berbasis bukti (_evidence-linked_)", "Evidence-linked assessment")}</h4>
          <div className="flex gap-1.5">
            <SourceLabel type="synthetic-demo" compact />
            <SourceLabel type="strategic-proposal" compact />
          </div>
        </div>
        <div className="space-y-4">
          {evidence.map((ev) => (
            <EvidenceCard
              key={ev.competencyId}
              evidence={ev}
              weight={job.competencies.find((c) => c.id === ev.competencyId)?.weight}
              override={candidate.overrides[ev.competencyId]}
              onOverride={(l) => {
                overrideLevel(candidate.id, ev.competencyId, l);
                const comp = t(COMPETENCY_MAP[ev.competencyId]?.name ?? ev.competencyId);
                toast.success(t(`Level ${comp} diset ke ${l} oleh _recruiter_.`, `${comp} level set to ${l} by the recruiter.`));
              }}
              reviewerNote={lastNote}
            />
          ))}
        </div>

        <details className="group rounded-2xl border border-line bg-card p-5 shadow-soft">
          <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
            {t("Transkrip lengkap", "Full transcript")} ({candidate.transcript.length} {t("jawaban", "answers")}){" "}
            <span className="text-muted group-open:hidden">— {t("klik untuk membuka", "click to open")}</span>
          </summary>
          <div className="mt-4 space-y-4">
            {candidate.transcript.map((row, i) => (
              <div key={row.questionId + i} className="rounded-xl bg-surface p-4 ring-1 ring-line">
                <p className="text-xs font-semibold text-one-ink">
                  {t("Pertanyaan", "Question")} {i + 1}
                </p>
                <p className="text-sm font-semibold text-ink">{tx(row.question)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-strong">{tx(row.answer)}</p>
              </div>
            ))}
          </div>
        </details>

        <Callout tone="warning" icon={<AlertTriangle className="h-[18px] w-[18px]" />} title={t("Batasan & keadilan", "Limitations & fairness")}>
          {t(
            "Laporan dihasilkan oleh aturan deterministik pada teks jawaban terhadap rubrik demo. Tidak ada analisis wajah, suara, emosi, atau kepribadian. Panjang & gaya bahasa jawaban dapat memengaruhi sinyal — karena itu setiap penilaian wajib ditinjau manusia.",
            "Reports are produced by deterministic rules applied to the answer text against a demo rubric. There is no analysis of faces, voice, emotion or personality. Answer length & writing style can affect the signals — which is why every assessment must be reviewed by a human.",
          )}
        </Callout>
      </div>

      <aside className="h-fit space-y-4 xl:sticky xl:top-24">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <UserCheck className="h-4 w-4 text-success" /> {tx("Aksi _recruiter_", "Recruiter actions")}
          </p>
          <div className="mt-4 grid gap-2">
            <Button
              variant={candidate.status === "ditinjau" ? "secondary" : "one"}
              onClick={() => {
                if (candidate.status === "ditinjau") {
                  setStatus(candidate.id, "selesai", L("Membuka kembali tinjauan", "Reopened the review"));
                  toast.info(t("Status dikembalikan ke menunggu tinjauan.", "Status returned to awaiting review."));
                } else {
                  setStatus(candidate.id, "ditinjau", L("Menandai selesai ditinjau", "Marked as reviewed"));
                  toast.success(t("Laporan ditandai selesai ditinjau manusia.", "Report marked as reviewed by a human."));
                }
              }}
            >
              {candidate.status === "ditinjau" ? <RotateCcw className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {candidate.status === "ditinjau" ? t("Buka kembali tinjauan", "Reopen review") : t("Tandai selesai ditinjau", "Mark as reviewed")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setStatus(candidate.id, "follow-up", L("Meminta wawancara _follow-up_", "Requested a follow-up interview"));
                toast.success(t("Wawancara _follow-up_ diminta (simulasi).", "Follow-up interview requested (simulated)."));
              }}
            >
              <Scale className="h-4 w-4" /> {tx("Minta wawancara _follow-up_", "Request a follow-up interview")}
            </Button>
            <Button variant={candidate.flagged ? "danger" : "secondary"} onClick={() => toggleFlag(candidate.id)}>
              <Flag className="h-4 w-4" /> {candidate.flagged ? t("Cabut tanda inspeksi", "Remove inspection flag") : t("Tandai untuk inspeksi manual", "Flag for manual inspection")}
            </Button>
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
            {t(
              "Tidak tersedia tombol terima/tolak otomatis — sesuai prinsip AI sebagai pendukung keputusan.",
              "There is no automatic accept/reject button — in line with the principle of AI as decision support.",
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <MessageSquarePlus className="h-4 w-4 text-one-ink" /> {tx("Catatan _review_", "Review notes")}
          </p>
          <Textarea className="mt-3 min-h-[80px]" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("Tulis observasi berbasis bukti…", "Write an evidence-based observation…")} aria-label={t("Catatan _review_", "Review note")} />
          <Button size="sm" variant="one" className="mt-2 w-full" onClick={saveNote}>
            {t("Tambah catatan", "Add note")}
          </Button>
          <ul className="mt-4 space-y-2">
            {candidate.notes.length === 0 && <li className="text-xs text-muted">{t("Belum ada catatan.", "No notes yet.")}</li>}
            {[...candidate.notes].reverse().map((n) => (
              <li key={n.id} className="rounded-xl bg-success-soft/60 p-3 text-sm ring-1 ring-current/15">
                <p className="text-ink">{tx(n.text)}</p>
                <p className="mt-1 text-[11px] text-muted">
                  {n.author} · {formatDateTime(n.at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
