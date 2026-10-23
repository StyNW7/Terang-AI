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
import { L, useI18n, type Txt } from "@/lib/i18n";

type Step = "welcome" | "notice" | "instructions" | "overview" | "interview" | "done";
const STEP_ORDER: Step[] = ["welcome", "notice", "instructions", "overview", "interview", "done"];
const STEP_LABEL = [
  L("Selamat datang", "Welcome"),
  L("Pemrosesan data", "Data processing"),
  L("Instruksi", "Instructions"),
  L("Ringkasan peran", "Role overview"),
  L("Wawancara", "Interview"),
  L("Selesai", "Done"),
];

const SAMPLE_ANSWER = L(
  "Saat magang di toko ritel, ada pelanggan yang kecewa karena pesanan terlambat. Saya mendengarkan keluhannya, meminta maaf, lalu menjelaskan opsi yang tersedia dan berkoordinasi dengan gudang. Hasilnya barang tiba esok pagi dan pelanggan memberi ulasan positif.",
  "During my internship at a retail store, a customer was disappointed because an order was late. I listened to the complaint, apologised, then explained the options available and coordinated with the warehouse. As a result, the item arrived the next morning and the customer left a positive review.",
);

export function CandidateExperience({ onViewAsRecruiter }: { onViewAsRecruiter: (candidateId: string) => void }) {
  const { t, tx } = useI18n();
  const jobs = useInterviewStore((s) => s.jobs);
  const addResult = useInterviewStore((s) => s.addCandidateResult);
  const activeJobs = jobs.filter((j) => j.status === "aktif");
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState(() => t("Kandidat Demo", "Demo Candidate"));
  const [jobId, setJobId] = useState(activeJobs[0]?.id ?? jobs[0]?.id);
  const [consent, setConsent] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [followUp, setFollowUp] = useState<Txt | null>(null);
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
      toast.error(t("Jawaban terlalu singkat — tulis minimal 5 kata.", "Answer too short — write at least 5 words."));
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
        name: name.trim() || t("Kandidat Demo", "Demo Candidate"),
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
      toast.success(t("Wawancara selesai. Laporan dikirim ke _recruiter_ untuk ditinjau.", "Interview complete. The report has been sent to the recruiter for review."));
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
          <li key={l.id} className="flex shrink-0 items-center gap-1">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                i < stepIndex ? "bg-success-soft text-success-ink" : i === stepIndex ? "bg-one text-white" : "bg-card text-muted ring-1 ring-line",
              )}
            >
              {i < stepIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="tabular">{i + 1}</span>}
              {t(l)}
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
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">{t(RECRUITER_COMPANY)}</p>
                  <h3 className="mt-2 text-3xl font-semibold">{t("Selamat datang di wawancara terstruktur", "Welcome to your structured interview")}</h3>
                  <p className="mt-2 text-white/85">
                    {tx(
                      "Wawancara ini membantu _recruiter_ memahami pengalaman Anda. Keputusan akhir selalu dibuat oleh manusia.",
                      "This interview helps the recruiter understand your experience. The final decision is always made by a human.",
                    )}
                  </p>
                </div>
                <Mascot name="interview" size={150} className="mx-auto" />
              </div>
              <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="cand-name" required>
                    {t("Nama Anda (fiktif)", "Your name (fictional)")}
                  </Label>
                  <Input id="cand-name" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field>
                  <Label htmlFor="cand-job" required>
                    {t("Posisi yang dilamar", "Position applied for")}
                  </Label>
                  <Select id="cand-job" value={job.id} onChange={(e) => setJobId(e.target.value)}>
                    {(activeJobs.length ? activeJobs : jobs).map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </Select>
                </Field>
                <div className="flex justify-end sm:col-span-2">
                  <Button variant="one" onClick={() => (name.trim().length >= 3 ? setStep("notice") : toast.error(t("Isi nama minimal 3 karakter.", "Enter a name of at least 3 characters.")))}>
                    {t("Mulai", "Start")} <ArrowRight className="h-4 w-4" />
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
              <h3 className="mt-4 text-2xl font-semibold text-ink">{t("Pemberitahuan pemrosesan data", "Data-processing notice")}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-strong">
                {[
                  L("Hanya jawaban teks Anda yang diproses — tidak ada kamera, analisis wajah, suara, atau emosi.", "Only your text answers are processed — no camera and no face, voice or emotion analysis."),
                  L("Jawaban dicocokkan dengan rubrik kompetensi jabatan untuk membantu _recruiter_.", "Answers are matched against the role's competency rubric to help the recruiter."),
                  L("_Recruiter_ meninjau seluruh laporan; tidak ada keputusan otomatis.", "The recruiter reviews every report; there are no automated decisions."),
                  L("Dalam demo ini data hanya tersimpan di _browser_ Anda dan dapat direset kapan saja.", "In this demo, data is stored only in your browser and can be reset at any time."),
                ].map((item) => (
                  <li key={item.id} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {tx(item)}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onChange={setConsent}
                  label={t("Saya memahami dan menyetujui pemrosesan data untuk wawancara demo ini", "I understand and agree to the data processing for this demo interview")}
                />
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep("welcome")}>
                  <ArrowLeft className="h-4 w-4" /> {t("Kembali", "Back")}
                </Button>
                <Button variant="one" disabled={!consent} onClick={() => setStep("instructions")}>
                  {t("Setuju & lanjut", "Agree & continue")} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "instructions" && (
            <div className="rounded-3xl border border-line bg-card p-8 shadow-card">
              <h3 className="text-2xl font-semibold text-ink">{t("Instruksi wawancara", "Interview instructions")}</h3>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: MessageSquareText,
                    title: t(`${questions.length} pertanyaan inti`, `${questions.length} core questions`),
                    d: t("Diajukan berurutan, sama untuk semua kandidat pada posisi ini.", "Asked in order — the same for every candidate in this role."),
                  },
                  { icon: Lightbulb, title: t("Gunakan contoh nyata", "Use real examples"), d: t("Ceritakan situasi, tindakan Anda, dan hasilnya (metode STAR).", "Describe the situation, your actions and the result (the STAR method).") },
                  { icon: Clock, title: t(`± ${job.durationMinutes} menit`, `~${job.durationMinutes} minutes`), d: t("Tidak ada batas waktu ketat dalam demo ini.", "There is no strict time limit in this demo.") },
                ].map(({ icon: Icon, title, d }) => (
                  <div key={title} className="rounded-2xl bg-surface p-4 ring-1 ring-line">
                    <Icon className="h-5 w-5 text-one-ink" />
                    <p className="mt-2 font-semibold text-ink">{title}</p>
                    <p className="mt-1 text-sm text-muted-strong">{d}</p>
                  </div>
                ))}
              </div>
              <Callout tone="info" className="mt-5" title={tx("_Follow-up_ kontekstual", "Contextual follow-up")}>
                {t(
                  "Setelah Anda menjawab, sistem dapat menampilkan satu pertanyaan lanjutan berdasarkan aturan sederhana (mis. bila hasil belum disebutkan). Ini bukan inferensi AI.",
                  "After you answer, the system may show one follow-up question based on simple rules (e.g. when no result has been mentioned). This is not AI inference.",
                )}
              </Callout>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep("notice")}>
                  <ArrowLeft className="h-4 w-4" /> {t("Kembali", "Back")}
                </Button>
                <Button variant="one" onClick={() => setStep("overview")}>
                  {t("Lanjut", "Next")} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "overview" && (
            <div className="rounded-3xl border border-line bg-card p-8 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">{t("Ringkasan peran", "Role overview")}</p>
              <h3 className="mt-1 text-2xl font-semibold text-ink">{job.title}</h3>
              <p className="mt-2 text-muted-strong">{tx(job.description)}</p>
              <p className="mt-5 text-sm font-semibold text-ink">{t("Kompetensi yang ditanyakan", "Competencies covered")}</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {job.competencies.map((c) => (
                  <div key={c.id} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                    <p className="font-semibold text-ink">{t(COMPETENCY_MAP[c.id]?.name ?? c.id)}</p>
                    <p className="text-xs text-muted">{COMPETENCY_MAP[c.id] && tx(COMPETENCY_MAP[c.id].description)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep("instructions")}>
                  <ArrowLeft className="h-4 w-4" /> {t("Kembali", "Back")}
                </Button>
                <Button
                  variant="one"
                  onClick={() =>
                    questions.length
                      ? setStep("interview")
                      : toast.error(t("Lowongan ini belum memiliki pertanyaan. Publikasikan dari Interview Builder.", "This vacancy has no questions yet. Publish them from the Interview Builder."))
                  }
                >
                  <Sparkles className="h-4 w-4" /> {t("Mulai wawancara", "Start interview")}
                </Button>
              </div>
            </div>
          )}

          {step === "interview" && questions[index] && (
            <div className="rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-muted-strong">
                  {t("Pertanyaan", "Question")} {index + 1} {t("dari", "of")} {questions.length}
                </p>
                <button
                  type="button"
                  onClick={() => setVoice((v) => !v)}
                  className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 transition", voice ? "bg-one text-white ring-one" : "bg-card text-muted-strong ring-line")}
                  aria-pressed={voice}
                >
                  <Mic className="h-3.5 w-3.5" /> {t("Mode suara (visual simulasi)", "Voice mode (simulated visual)")}
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-one-ink">{t(COMPETENCY_MAP[questions[index].competencyId]?.name ?? "")}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink">{tx(questions[index].text)}</p>
                </div>
              </div>
              {followUp && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-soft text-sky-ink">
                    <MessageSquareText className="h-5 w-5" />
                  </span>
                  <div className="rounded-2xl rounded-tl-sm bg-soft p-4 ring-1 ring-current/15">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-ink">{tx("_Follow-up_ (aturan deterministik)", "Follow-up (deterministic rule)")}</p>
                    <p className="mt-1 text-[15px] text-ink">{tx(followUp)}</p>
                    <p className="mt-1 text-xs text-muted">{t("Tambahkan detail pada jawaban Anda di bawah, lalu kirim.", "Add detail to your answer below, then send it.")}</p>
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
                    <AudioLines className="h-4 w-4" /> {t("Visual saja — mikrofon tidak diakses", "Visual only — the microphone is not accessed")}
                  </span>
                </div>
              )}
              <div className="mt-5">
                <Label htmlFor="answer" required hint={`${current.trim().split(/\s+/).filter(Boolean).length} ${t("kata", "words")}`}>
                  {t("Jawaban Anda", "Your answer")}
                </Label>
                <Textarea
                  id="answer"
                  className="min-h-[140px]"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder={t("Ceritakan situasi, tindakan, dan hasilnya…", "Describe the situation, your actions and the result…")}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCurrent(t(SAMPLE_ANSWER))}>
                  {t("Isi contoh jawaban", "Fill in a sample answer")}
                </Button>
                <Button variant="one" onClick={submitAnswer}>
                  {followUp
                    ? index + 1 < questions.length
                      ? t("Kirim & pertanyaan berikutnya", "Send & next question")
                      : t("Kirim & selesaikan", "Send & finish")
                    : t("Kirim jawaban", "Send answer")}{" "}
                  <ArrowRight className="h-4 w-4" />
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
                <h3 className="mt-4 text-2xl font-semibold text-ink">
                  {t("Terima kasih", "Thank you")}, {name}!
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-muted-strong">
                  {t("Jawaban Anda telah dikirim. Di bawah ini adalah", "Your answers have been sent. Below is the")}{" "}
                  <strong>{t("artefak tinjauan ilustratif", "illustrative review artefact")}</strong>{" "}
                  {tx("yang akan diterima _recruiter_ — status: menunggu tinjauan manusia.", "the recruiter will receive — status: awaiting human review.")}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {resultId && (
                    <Button variant="one" onClick={() => onViewAsRecruiter(resultId)}>
                      {tx("Lihat sebagai _recruiter_", "View as recruiter")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="secondary" onClick={restart}>
                    {t("Ulangi simulasi", "Restart simulation")}
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
