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

export function ReportViewer({ candidateId, onSelect }: { candidateId?: string; onSelect: (id: string) => void }) {
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
  const evidence = candidate ? (candidate.evidence.length ? candidate.evidence : assessCandidate(candidate, job)) : [];
  const summary = weightedSummary(evidence, job, candidate?.overrides);

  if (!candidate || !job) {
    return <EmptyState icon={<FileText className="h-5 w-5" />} title="Belum ada laporan" description="Laporan muncul setelah kandidat menyelesaikan wawancara." />;
  }

  const name = displayName(candidate, mask);
  const lastNote = candidate.notes[candidate.notes.length - 1]?.text;

  const saveNote = () => {
    if (note.trim().length < 5) {
      toast.error("Catatan minimal 5 karakter.");
      return;
    }
    addNote(candidate.id, note.trim());
    setNote("");
    toast.success("Catatan review ditambahkan & tercatat di audit trail.");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-ink">{name}</h3>
              <CandidateStatusBadge status={candidate.status} />
              {candidate.flagged && (
                <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-semibold text-danger-ink">
                  <Flag className="h-3 w-3" /> Inspeksi manual
                </span>
              )}
            </div>
            <p className="text-sm text-muted-strong">
              {job.title} · selesai {candidate.completedAt ? formatDate(candidate.completedAt) : "—"}
            </p>
          </div>
          <Select value={candidate.id} onChange={(e) => onSelect(e.target.value)} className="md:w-64" aria-label="Pilih kandidat">
            {withReports.map((c) => (
              <option key={c.id} value={c.id}>
                {displayName(c, mask)}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl bg-one-gradient p-5 text-white shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">Ringkasan rubrik</p>
              <InfoTip light title="Apa artinya?">
                Rata-rata level rubrik (1–4) tertimbang bobot kompetensi, termasuk override recruiter. Ini ringkasan bukti — bukan skor
                kelayakan atau rekomendasi terima/tolak.
              </InfoTip>
            </div>
            <p className="tabular mt-2 font-display text-5xl font-bold">{summary.toFixed(1)}<span className="text-xl text-white/70"> / 4</span></p>
            <p className="mt-1 text-sm text-white/85">≈ {LEVEL_LABEL[Math.round(summary)] ?? "—"}</p>
            <p className="mt-4 rounded-xl bg-white/12 p-3 text-xs leading-relaxed ring-1 ring-white/20">
              Tidak ada keputusan otomatis. Keputusan lanjut/tidak tetap dibuat manusia melalui proses rekrutmen perusahaan.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink">Level per kompetensi</p>
            <div className="mt-3 space-y-3">
              {job.competencies.map((c) => {
                const ev = evidence.find((e) => e.competencyId === c.id);
                const level = candidate.overrides[c.id] ?? ev?.level ?? 0;
                return (
                  <div key={c.id}>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink">{COMPETENCY_MAP[c.id]?.name}</span>
                      <span className="tabular text-xs text-muted">
                        bobot {c.weight}% · <strong className="text-ink">L{level}</strong>
                        {candidate.overrides[c.id] && <span className="ml-1 text-success-ink">(override)</span>}
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
          <h4 className="text-lg font-semibold text-ink">Evidence-linked assessment</h4>
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
                toast.success(`Level ${COMPETENCY_MAP[ev.competencyId]?.name} diset ke ${l} oleh recruiter.`);
              }}
              reviewerNote={lastNote}
            />
          ))}
        </div>

        <details className="group rounded-2xl border border-line bg-card p-5 shadow-soft">
          <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
            Transkrip lengkap ({candidate.transcript.length} jawaban) <span className="text-muted group-open:hidden">— klik untuk membuka</span>
          </summary>
          <div className="mt-4 space-y-4">
            {candidate.transcript.map((t, i) => (
              <div key={t.questionId + i} className="rounded-xl bg-surface p-4 ring-1 ring-line">
                <p className="text-xs font-semibold text-one-ink">Pertanyaan {i + 1}</p>
                <p className="text-sm font-semibold text-ink">{t.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-strong">{t.answer}</p>
              </div>
            ))}
          </div>
        </details>

        <Callout tone="warning" icon={<AlertTriangle className="h-[18px] w-[18px]" />} title="Batasan & keadilan">
          Laporan dihasilkan oleh aturan deterministik pada teks jawaban terhadap rubrik demo. Tidak ada analisis wajah, suara, emosi, atau
          kepribadian. Panjang & gaya bahasa jawaban dapat memengaruhi sinyal — karena itu setiap penilaian wajib ditinjau manusia.
        </Callout>
      </div>

      <aside className="h-fit space-y-4 xl:sticky xl:top-24">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <UserCheck className="h-4 w-4 text-success" /> Aksi recruiter
          </p>
          <div className="mt-4 grid gap-2">
            <Button
              variant={candidate.status === "ditinjau" ? "secondary" : "one"}
              onClick={() => {
                if (candidate.status === "ditinjau") {
                  setStatus(candidate.id, "selesai", "Membuka kembali tinjauan");
                  toast.info("Status dikembalikan ke menunggu tinjauan.");
                } else {
                  setStatus(candidate.id, "ditinjau", "Menandai selesai ditinjau");
                  toast.success("Laporan ditandai selesai ditinjau manusia.");
                }
              }}
            >
              {candidate.status === "ditinjau" ? <RotateCcw className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {candidate.status === "ditinjau" ? "Buka kembali tinjauan" : "Tandai selesai ditinjau"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setStatus(candidate.id, "follow-up", "Meminta wawancara follow-up");
                toast.success("Wawancara follow-up diminta (simulasi).");
              }}
            >
              <Scale className="h-4 w-4" /> Minta wawancara follow-up
            </Button>
            <Button variant={candidate.flagged ? "danger" : "secondary"} onClick={() => toggleFlag(candidate.id)}>
              <Flag className="h-4 w-4" /> {candidate.flagged ? "Cabut tanda inspeksi" : "Tandai untuk inspeksi manual"}
            </Button>
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted">Tidak tersedia tombol terima/tolak otomatis — sesuai prinsip AI sebagai pendukung keputusan.</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <MessageSquarePlus className="h-4 w-4 text-one-ink" /> Catatan review
          </p>
          <Textarea className="mt-3 min-h-[80px]" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tulis observasi berbasis bukti…" aria-label="Catatan review" />
          <Button size="sm" variant="one" className="mt-2 w-full" onClick={saveNote}>
            Tambah catatan
          </Button>
          <ul className="mt-4 space-y-2">
            {candidate.notes.length === 0 && <li className="text-xs text-muted">Belum ada catatan.</li>}
            {[...candidate.notes].reverse().map((n) => (
              <li key={n.id} className="rounded-xl bg-success-soft/60 p-3 text-sm ring-1 ring-current/15">
                <p className="text-ink">{n.text}</p>
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
