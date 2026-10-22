"use client";

import { useState } from "react";
import { Briefcase, Clock, MapPin, Plus, Wand2 } from "lucide-react";
import { toast } from "sonner";
import type { RoleKey } from "@/types/interview";
import { useInterviewStore } from "@/store/interview-store";
import { COMPETENCIES, COMPETENCY_MAP, ROLE_TEMPLATES, generateQuestions } from "@/data/candidates.mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Field, FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/misc";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface Draft {
  title: string;
  role: RoleKey;
  department: string;
  location: string;
  description: string;
  competencies: { id: string; weight: number }[];
  durationMinutes: number;
}

const fromRole = (role: RoleKey): Draft => ({
  title: ROLE_TEMPLATES[role].label,
  role,
  department: ROLE_TEMPLATES[role].department,
  location: "Jakarta",
  description: ROLE_TEMPLATES[role].description,
  competencies: ROLE_TEMPLATES[role].competencies.map((c) => ({ ...c })),
  durationMinutes: 20,
});

export function JobManagement({ onBuild }: { onBuild: (jobId: string) => void }) {
  const jobs = useInterviewStore((s) => s.jobs);
  const candidates = useInterviewStore((s) => s.candidates);
  const addJob = useInterviewStore((s) => s.addJob);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(fromRole("customer-service"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const weightTotal = draft.competencies.reduce((a, c) => a + c.weight, 0);

  const toggleCompetency = (id: string) =>
    setDraft((d) => {
      const has = d.competencies.some((c) => c.id === id);
      if (has) return { ...d, competencies: d.competencies.filter((c) => c.id !== id) };
      if (d.competencies.length >= 5) {
        toast.warning("Maksimal 5 kompetensi agar wawancara tetap fokus.");
        return d;
      }
      return { ...d, competencies: [...d.competencies, { id, weight: 10 }] };
    });

  const save = () => {
    const e: Record<string, string> = {};
    if (draft.title.trim().length < 4) e.title = "Judul jabatan minimal 4 karakter.";
    if (draft.description.trim().length < 20) e.description = "Deskripsi minimal 20 karakter.";
    if (draft.competencies.length < 2) e.competencies = "Pilih minimal 2 kompetensi.";
    else if (weightTotal !== 100) e.competencies = `Total bobot kompetensi harus 100% (saat ini ${weightTotal}%).`;
    setErrors(e);
    if (Object.keys(e).length) return;
    const job = addJob({
      title: draft.title.trim(),
      role: draft.role,
      department: draft.department,
      location: draft.location,
      description: draft.description.trim(),
      competencies: draft.competencies,
      durationMinutes: draft.durationMinutes,
      questions: generateQuestions(draft.competencies, 0),
      status: "draft",
    });
    toast.success("Lowongan dibuat sebagai draft.", { description: "Tinjau saran pertanyaan sebelum dipublikasikan." });
    setOpen(false);
    onBuild(job.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-strong">
          <span className="font-semibold text-ink">{jobs.length} posisi</span> · kompetensi berbobot menjadi dasar rubrik penilaian.
        </p>
        <Button
          variant="one"
          onClick={() => {
            setDraft(fromRole("customer-service"));
            setErrors({});
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Buat lowongan
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {jobs.map((j) => {
          const count = candidates.filter((c) => c.jobId === j.id).length;
          return (
            <div key={j.id} data-spotlight className="flex flex-col rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:shadow-card">
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-soft text-one-ink">
                  <Briefcase className="h-5 w-5" />
                </span>
                <Badge tone={j.status === "aktif" ? "success" : j.status === "draft" ? "warning" : "neutral"}>{j.status}</Badge>
              </div>
              <p className="mt-3 font-semibold text-ink">{j.title}</p>
              <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted">
                <span>{j.department}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {j.durationMinutes} mnt</span>
              </p>
              <div className="mt-4 space-y-2">
                {j.competencies.map((c) => (
                  <div key={c.id}>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink">{COMPETENCY_MAP[c.id]?.name}</span>
                      <span className="tabular font-semibold text-one-ink">{c.weight}%</span>
                    </div>
                    <Progress value={c.weight / 100} tone="one" height="h-1.5" className="mt-1" />
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-4">
                <span className="text-xs text-muted">{count} kandidat · dibuat {formatDate(j.createdAt)}</span>
                <Button size="sm" variant="soft" onClick={() => onBuild(j.id)}>
                  <Wand2 className="h-3.5 w-3.5" /> Builder
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Buat lowongan baru"
        description="Mulai dari template jabatan, lalu sesuaikan kompetensi & bobot."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="one" onClick={save}>
              Simpan & buka builder
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field className="sm:col-span-2">
            <Label>Template jabatan</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(Object.keys(ROLE_TEMPLATES) as RoleKey[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDraft(fromRole(r))}
                  className={cn(
                    "rounded-xl border p-3 text-left text-sm font-semibold transition",
                    draft.role === r ? "border-one bg-one-soft text-one-ink" : "border-line text-muted-strong hover:border-one/40",
                  )}
                >
                  {ROLE_TEMPLATES[r].label}
                </button>
              ))}
            </div>
          </Field>
          <Field>
            <Label htmlFor="job-title" required>Judul jabatan</Label>
            <Input id="job-title" value={draft.title} aria-invalid={!!errors.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <FieldError message={errors.title} />
          </Field>
          <Field>
            <Label htmlFor="job-loc">Lokasi</Label>
            <Select id="job-loc" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })}>
              {["Jakarta", "Surabaya", "Bandung", "Medan", "Makassar", "Remote"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </Field>
          <Field className="sm:col-span-2">
            <Label htmlFor="job-desc" required>Deskripsi pekerjaan</Label>
            <Textarea id="job-desc" value={draft.description} aria-invalid={!!errors.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            <FieldError message={errors.description} />
          </Field>
          <Field className="sm:col-span-2">
            <Label required hint={<span className={weightTotal === 100 ? "font-semibold text-success-ink" : "font-semibold text-warning-ink"}>Total {weightTotal}%</span>}>
              Kompetensi wajib & bobot
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {COMPETENCIES.map((c) => {
                const on = draft.competencies.some((x) => x.id === c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCompetency(c.id)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-xs font-semibold ring-1 transition",
                      on ? "bg-one text-white ring-one" : "bg-card text-muted-strong ring-line hover:ring-one/40",
                    )}
                    aria-pressed={on}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {draft.competencies.map((c) => (
                <Slider
                  key={c.id}
                  label={COMPETENCY_MAP[c.id]?.name}
                  value={c.weight}
                  min={5}
                  max={60}
                  step={5}
                  color="#2251c9"
                  display={`${c.weight}%`}
                  onChange={(v) => setDraft((d) => ({ ...d, competencies: d.competencies.map((x) => (x.id === c.id ? { ...x, weight: v } : x)) }))}
                />
              ))}
            </div>
            <FieldError message={errors.competencies} />
          </Field>
          <Field className="sm:col-span-2">
            <Slider label="Durasi wawancara" value={draft.durationMinutes} min={10} max={45} step={5} color="#2251c9" display={`${draft.durationMinutes} menit`} onChange={(v) => setDraft({ ...draft, durationMinutes: v })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
