"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, AudioLines, Bot, CheckCircle2, Clock, FileCheck, Lightbulb, Lock, MessageSquareText, Mic, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { EvidenceItem } from "@/types/interview";
import { useInterviewStore } from "@/store/interview-store";
import { COMPETENCY_MAP, RECRUITER_COMPANY } from "@/data/candidates.mock";
import { assessAnswer, followUpFor } from "@/lib/assessment";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Callout } from "@/components/ui/misc";
import { Mascot } from "@/components/shared/brand";
import { EvidenceCard } from "./evidence-card";
import { cn } from "@/lib/utils";

type Step = "welcome" | "notice" | "instructions" | "overview" | "interview" | "done";
const STEP_ORDER: Step[] = ["welcome", "notice", "instructions", "overview", "interview", "done"];
const STEP_LABEL = ["Selamat datang", "Pemrosesan data", "Instruksi", "Ringkasan peran", "Wawancara", "Selesai"];

const SAMPLE_ANSWER =
  "Saat magang di toko ritel, ada pelanggan yang kecewa karena pesanan terlambat. Saya mendengarkan keluhannya, meminta maaf, lalu menjelaskan opsi yang tersedia dan berkoordinasi dengan gudang. Hasilnya barang tiba esok pagi dan pelanggan memberi ulasan positif.";

export function CandidateExperience({ onViewAsRecruiter }: { onViewAsRecruiter: (candidateId: string) => void }) {
  const jobs = useInterviewStore((s) => s.jobs);
  const addResult = useInterviewStore((s) => s.addCandidateResult);
  const activeJobs = jobs.filter((j) => j.status === "aktif");
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("Kandidat Demo");
  const [jobId, setJobId] = useState(activeJobs[0]?.id ?? jobs[0]?.id);
  const [consent, setConsent] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [voice, setVoice] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);

  const job = jobs.find((j) => j.id === jobId) ?? jobs[0];
  const questions = useMemo(() => job?.questions ?? [], [job]);
  const stepIndex = STEP_ORDER.indexOf(step);

  if (!job) return null;

  const submitAnswer = () => {
    const words = current.trim().split(/\s+/).filter(Boolean).length;
    if (words < 5) {
      toast.error("Jawaban terlalu singkat — tulis minimal 5 kata.");
      return;
    }
    const q = questions[index];
    if (!followUp) {
      // Deterministic contextual follow-up shown once per question.
      setFollowUp(followUpFor(current, q.competencyId, q.followUp));
      return;
    }
    const nextAnswers = [...answers, current.trim()];
    setAnswers(nextAnswers);
    setCurrent("");
    setFollowUp(null);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      const ev = questions.map((qq, i) => assessAnswer(nextAnswers[i] ?? "", qq.competencyId));
      setEvidence(ev);
      const id = addResult({
        name: name.trim() || "Kandidat Demo",
        jobId: job.id,
        email: "kandidat.demo@contoh.id",
        invitedAt: new Date().toISOString().slice(0, 10),
        completedAt: new Date().toISOString().slice(0, 10),
        status: "selesai",
        flagged: false,
        evidence: ev,
        transcript: questions.map((qq, i) => ({ questionId: qq.id, question: qq.text, answer: nextAnswers[i] ?? "" })),
        notes: [],
        overrides: {},
      });
      setResultId(id);
      setStep("done");
      toast.success("Wawancara selesai. Laporan dikirim ke recruiter untuk ditinjau.");
    }
  };

  const restart = () => {
    setStep("welcome");
    setIndex(0);
    setAnswers([]);
    setCurrent("");
    setFollowUp(null);
    setConsent(false);
    setResultId(null);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <ol className="mb-6 flex items-center gap-1 overflow-x-auto pb-1">
        {STEP_LABEL.map((l, i) => (
          <li key={l} className="flex shrink-0 items-center gap-1">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                i < stepIndex ? "bg-success-soft text-success-ink" : i === stepIndex ? "bg-one text-white" : "bg-card text-muted ring-1 ring-line",
              )}
            >
              {i < stepIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="tabular">{i + 1}</span>}
              {l}
            </span>
            {i < STEP_LABEL.length - 1 && <span className="h-px w-4 bg-line" />}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={step + (step === "interview" ? index : "")} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          {step === "welcome" && (
            <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
              <div className="grid grid-cols-1 items-center gap-6 bg-one-gradient p-8 text-white md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">{RECRUITER_COMPANY}</p>
                  <h3 className="mt-2 text-3xl font-bold">Selamat datang di wawancara terstruktur</h3>
                  <p className="mt-2 text-white/85">Wawancara ini membantu recruiter memahami pengalaman Anda. Keputusan akhir selalu dibuat oleh manusia.</p>
                </div>
                <Mascot name="interview" size={150} className="mx-auto" />
              </div>
              <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="cand-name" required>Nama Anda (fiktif)</Label>
                  <Input id="cand-name" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field>
                  <Label htmlFor="cand-job" required>Posisi yang dilamar</Label>
                  <Select id="cand-job" value={job.id} onChange={(e) => setJobId(e.target.value)}>
                    {(activeJobs.length ? activeJobs : jobs).map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </Select>
                </Field>
                <div className="flex justify-end sm:col-span-2">
                  <Button variant="one" onClick={() => (name.trim().length >= 3 ? setStep("notice") : toast.error("Isi nama minimal 3 karakter."))}>
                    Mulai <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "notice" && (
            <div className="rounded-3xl border border-line bg-card p-8 shadow-card">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-one-soft text-one-ink">
                <Lock className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-ink">Pemberitahuan pemrosesan data</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-strong">
                {[
                  "Hanya jawaban teks Anda yang diproses — tidak ada kamera, analisis wajah, suara, atau emosi.",
                  "Jawaban dicocokkan dengan rubrik kompetensi jabatan untuk membantu recruiter.",
                  "Recruiter meninjau seluruh laporan; tidak ada keputusan otomatis.",
                  "Dalam demo ini data hanya tersimpan di browser Anda dan dapat direset kapan saja.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Checkbox id="consent" checked={consent} onChange={setConsent} label="Saya memahami dan menyetujui pemrosesan data untuk wawancara demo ini" />
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep("welcome")}>
                  <ArrowLeft className="h-4 w-4" /> Kembali
                </Button>
                <Button variant="one" disabled={!consent} onClick={() => setStep("instructions")}>
                  Setuju & lanjut <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "instructions" && (
            <div className="rounded-3xl border border-line bg-card p-8 shadow-card">
              <h3 className="text-2xl font-semibold text-ink">Instruksi wawancara</h3>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { icon: MessageSquareText, t: `${questions.length} pertanyaan inti`, d: "Diajukan berurutan, sama untuk semua kandidat pada posisi ini." },
                  { icon: Lightbulb, t: "Gunakan contoh nyata", d: "Ceritakan situasi, tindakan Anda, dan hasilnya (metode STAR)." },
                  { icon: Clock, t: `± ${job.durationMinutes} menit`, d: "Tidak ada batas waktu ketat dalam demo ini." },
                ].map(({ icon: Icon, t, d }) => (
                  <div key={t} className="rounded-2xl bg-surface p-4 ring-1 ring-line">
                    <Icon className="h-5 w-5 text-one-ink" />
                    <p className="mt-2 font-semibold text-ink">{t}</p>
                    <p className="mt-1 text-sm text-muted-strong">{d}</p>
                  </div>
                ))}
              </div>
              <Callout tone="info" className="mt-5" title="Follow-up kontekstual">
                Setelah Anda menjawab, sistem dapat menampilkan satu pertanyaan lanjutan berdasarkan aturan sederhana (mis. bila hasil belum
                disebutkan). Ini bukan inferensi AI.
              </Callout>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep("notice")}>
                  <ArrowLeft className="h-4 w-4" /> Kembali
                </Button>
                <Button variant="one" onClick={() => setStep("overview")}>
                  Lanjut <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "overview" && (
            <div className="rounded-3xl border border-line bg-card p-8 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">Ringkasan peran</p>
              <h3 className="mt-1 text-2xl font-semibold text-ink">{job.title}</h3>
              <p className="mt-2 text-muted-strong">{job.description}</p>
              <p className="mt-5 text-sm font-semibold text-ink">Kompetensi yang ditanyakan</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {job.competencies.map((c) => (
                  <div key={c.id} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                    <p className="font-semibold text-ink">{COMPETENCY_MAP[c.id]?.name}</p>
                    <p className="text-xs text-muted">{COMPETENCY_MAP[c.id]?.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep("instructions")}>
                  <ArrowLeft className="h-4 w-4" /> Kembali
                </Button>
                <Button
                  variant="one"
                  onClick={() =>
                    questions.length ? setStep("interview") : toast.error("Lowongan ini belum memiliki pertanyaan. Publikasikan dari Interview Builder.")
                  }
                >
                  <Sparkles className="h-4 w-4" /> Mulai wawancara
                </Button>
              </div>
            </div>
          )}

          {step === "interview" && questions[index] && (
            <div className="rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-muted-strong">
                  Pertanyaan {index + 1} dari {questions.length}
                </p>
                <button
                  type="button"
                  onClick={() => setVoice((v) => !v)}
                  className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 transition", voice ? "bg-one text-white ring-one" : "bg-card text-muted-strong ring-line")}
                  aria-pressed={voice}
                >
                  <Mic className="h-3.5 w-3.5" /> Mode suara (visual simulasi)
                </button>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-track">
                <motion.div className="h-full bg-one-gradient" animate={{ width: `${((index + (followUp ? 0.5 : 0)) / questions.length) * 100}%` }} />
              </div>
              <div className="mt-6 flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-one-gradient text-white">
                  <Bot className="h-5 w-5" />
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-surface p-4 ring-1 ring-line">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-one-ink">{COMPETENCY_MAP[questions[index].competencyId]?.name}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink">{questions[index].text}</p>
                </div>
              </div>
              {followUp && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-soft text-sky-ink">
                    <MessageSquareText className="h-5 w-5" />
                  </span>
                  <div className="rounded-2xl rounded-tl-sm bg-soft p-4 ring-1 ring-current/15">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-ink">Follow-up (aturan deterministik)</p>
                    <p className="mt-1 text-[15px] text-ink">{followUp}</p>
                    <p className="mt-1 text-xs text-muted">Tambahkan detail pada jawaban Anda di bawah, lalu kirim.</p>
                  </div>
                </motion.div>
              )}
              {voice && (
                <div className="mt-5 flex items-center justify-center gap-1 rounded-2xl bg-one-soft/60 py-4" aria-hidden>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="w-1 rounded-full bg-one"
                      animate={{ height: [6, 10 + ((i * 7) % 22), 6] }}
                      transition={{ duration: 1 + (i % 5) * 0.15, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                  <span className="ml-3 flex items-center gap-1 text-xs font-semibold text-one-ink">
                    <AudioLines className="h-4 w-4" /> Visual saja — mikrofon tidak diakses
                  </span>
                </div>
              )}
              <div className="mt-5">
                <Label htmlFor="answer" required hint={`${current.trim().split(/\s+/).filter(Boolean).length} kata`}>
                  Jawaban Anda
                </Label>
                <Textarea id="answer" className="min-h-[140px]" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Ceritakan situasi, tindakan, dan hasilnya…" />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCurrent(SAMPLE_ANSWER)}>
                  Isi contoh jawaban
                </Button>
                <Button variant="one" onClick={submitAnswer}>
                  {followUp ? (index + 1 < questions.length ? "Kirim & pertanyaan berikutnya" : "Kirim & selesaikan") : "Kirim jawaban"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-line bg-card p-8 text-center shadow-card">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-soft text-success">
                  <FileCheck className="h-8 w-8" />
                </span>
                <h3 className="mt-4 text-2xl font-semibold text-ink">Terima kasih, {name}!</h3>
                <p className="mx-auto mt-2 max-w-lg text-muted-strong">
                  Jawaban Anda telah dikirim. Di bawah ini adalah <strong>artefak tinjauan ilustratif</strong> yang akan diterima recruiter — status:
                  menunggu tinjauan manusia.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {resultId && (
                    <Button variant="one" onClick={() => onViewAsRecruiter(resultId)}>
                      Lihat sebagai recruiter <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="secondary" onClick={restart}>
                    Ulangi simulasi
                  </Button>
                </div>
              </div>
              {evidence.map((ev) => (
                <EvidenceCard key={ev.competencyId} evidence={ev} weight={job.competencies.find((c) => c.id === ev.competencyId)?.weight} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
