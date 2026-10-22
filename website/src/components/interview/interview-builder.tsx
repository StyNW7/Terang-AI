"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, MessageSquareText, Pencil, RefreshCw, ShieldCheck, Wand2 } from "lucide-react";
import { toast } from "sonner";
import type { InterviewQuestion } from "@/types/interview";
import { useInterviewStore } from "@/store/interview-store";
import { COMPETENCY_MAP, QUESTION_BANK, generateQuestions } from "@/data/candidates.mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox, Select, Textarea } from "@/components/ui/form";
import { Callout } from "@/components/ui/misc";
import { SourceLabel } from "@/components/shared/source-label";

export function InterviewBuilder({ jobId, onJobChange }: { jobId: string; onJobChange: (id: string) => void }) {
  const jobs = useInterviewStore((s) => s.jobs);
  const setQuestions = useInterviewStore((s) => s.setQuestions);
  const updateJob = useInterviewStore((s) => s.updateJob);
  const job = jobs.find((j) => j.id === jobId) ?? jobs[0];
  const [draft, setDraft] = useState<InterviewQuestion[]>(job?.questions ?? []);
  const [variant, setVariant] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [lastJob, setLastJob] = useState(job?.id);

  if (job && lastJob !== job.id) {
    setLastJob(job.id);
    setDraft(job.questions);
    setReviewed(false);
    setEditing(null);
  }

  if (!job) return null;

  const regenerate = () => {
    setLoading(true);
    setReviewed(false);
    window.setTimeout(() => {
      const v = variant + 1;
      setVariant(v);
      setDraft(generateQuestions(job.competencies, v));
      setLoading(false);
      toast.info("Saran pertanyaan baru disusun dari bank pertanyaan.");
    }, 900);
  };

  const replaceOne = (q: InterviewQuestion) => {
    const bank = QUESTION_BANK[q.competencyId] ?? [];
    const idx = bank.findIndex((b) => b.text === q.text);
    const next = bank[(idx + 1) % Math.max(1, bank.length)];
    if (!next) return;
    setDraft((d) => d.map((x) => (x.id === q.id ? { ...x, text: next.text, followUp: next.followUp, edited: false } : x)));
    setReviewed(false);
  };

  const publish = () => {
    if (!reviewed) {
      toast.error("Konfirmasi bahwa semua pertanyaan sudah ditinjau HR.");
      return;
    }
    if (draft.some((q) => q.text.trim().length < 15)) {
      toast.error("Setiap pertanyaan minimal 15 karakter.");
      return;
    }
    setQuestions(job.id, draft);
    updateJob(job.id, { status: "aktif" });
    toast.success("Set pertanyaan disetujui & dipublikasikan.", { description: job.title });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="h-fit space-y-4 rounded-2xl border border-line bg-card p-5 shadow-soft xl:sticky xl:top-24">
        <div>
          <p className="text-sm font-semibold text-ink">Lowongan</p>
          <Select className="mt-2" value={job.id} onChange={(e) => onJobChange(e.target.value)} aria-label="Pilih lowongan">
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Kompetensi</p>
          <ul className="mt-2 space-y-1.5">
            {job.competencies.map((c) => (
              <li key={c.id} className="flex justify-between text-sm">
                <span className="text-ink">{COMPETENCY_MAP[c.id]?.name}</span>
                <span className="tabular font-semibold text-one-ink">{c.weight}%</span>
              </li>
            ))}
          </ul>
        </div>
        <Button variant="one" className="w-full" onClick={regenerate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {loading ? "Menyusun saran…" : "Sarankan pertanyaan"}
        </Button>
        <p className="text-[11.5px] leading-relaxed text-muted">
          Asisten simulasi memilih dari bank pertanyaan terkurasi per kompetensi — tidak ada model AI yang dipanggil.
        </p>
        <SourceLabel type="strategic-proposal" compact />
      </aside>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">Role-Based Interview Builder</h3>
            <p className="text-sm text-muted-strong">Pertanyaan inti terstandar + follow-up kontekstual. HR dapat mengedit atau mengganti setiap pertanyaan.</p>
          </div>
          <Badge tone={job.status === "aktif" ? "success" : "warning"}>{job.status === "aktif" ? "Dipublikasikan" : "Draft"}</Badge>
        </div>
        <AnimatePresence mode="popLayout">
          {loading
            ? Array.from({ length: job.competencies.length }).map((_, i) => <div key={`sk-${i}`} className="skeleton h-28 rounded-2xl" />)
            : draft.map((q, i) => (
                <motion.div
                  key={q.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-line bg-card p-5 shadow-soft"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-one-gradient text-xs font-semibold text-white">{i + 1}</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-one-ink">{COMPETENCY_MAP[q.competencyId]?.name}</span>
                      {q.edited && <Badge tone="success">Diedit HR</Badge>}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(editing === q.id ? null : q.id)}>
                        <Pencil className="h-3.5 w-3.5" /> {editing === q.id ? "Selesai" : "Edit"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => replaceOne(q)}>
                        <RefreshCw className="h-3.5 w-3.5" /> Ganti
                      </Button>
                    </div>
                  </div>
                  {editing === q.id ? (
                    <Textarea
                      className="mt-3"
                      value={q.text}
                      aria-label={`Edit pertanyaan ${i + 1}`}
                      onChange={(e) => {
                        setReviewed(false);
                        setDraft((d) => d.map((x) => (x.id === q.id ? { ...x, text: e.target.value, edited: true } : x)));
                      }}
                    />
                  ) : (
                    <p className="mt-3 text-[15px] leading-relaxed text-ink">{q.text}</p>
                  )}
                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-surface p-3 text-[13px] text-muted-strong ring-1 ring-line">
                    <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-one-ink" />
                    <span>
                      <strong className="text-ink">Follow-up kontekstual:</strong> {q.followUp}
                    </span>
                  </p>
                </motion.div>
              ))}
        </AnimatePresence>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <Checkbox
            id="reviewed"
            checked={reviewed}
            onChange={setReviewed}
            label="Saya (HR) telah meninjau dan menyetujui seluruh pertanyaan"
            description="Wajib sebelum publikasi — sesuai prinsip human-in-the-loop."
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Callout tone="info" className="flex-1 py-3" icon={<ShieldCheck className="h-[18px] w-[18px]" />}>
              Hindari pertanyaan tentang usia, agama, status pernikahan, atau hal tidak relevan dengan jabatan.
            </Callout>
            <Button variant="one" onClick={publish}>
              <CheckCircle2 className="h-4 w-4" /> Setujui & publikasikan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
