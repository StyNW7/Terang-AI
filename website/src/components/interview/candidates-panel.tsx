"use client";

import { useMemo, useState } from "react";
import { Flag, Search, Send, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import type { CandidateStatus } from "@/types/interview";
import { useInterviewStore } from "@/store/interview-store";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, FieldError, Input, Label, Select } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/misc";
import { formatDate, initials } from "@/lib/formatters";
import { CANDIDATE_STATUS, CandidateStatusBadge, displayName } from "./shared";

export function CandidatesPanel({ onOpenReport }: { onOpenReport: (id: string) => void }) {
  const candidates = useInterviewStore((s) => s.candidates);
  const jobs = useInterviewStore((s) => s.jobs);
  const invite = useInterviewStore((s) => s.inviteCandidate);
  const mask = useInterviewStore((s) => s.maskIdentity);
  const [query, setQuery] = useState("");
  const [jobId, setJobId] = useState("all");
  const [status, setStatus] = useState<"all" | CandidateStatus>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", jobId: jobs[0]?.id ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () =>
      candidates.filter(
        (c) =>
          (jobId === "all" || c.jobId === jobId) &&
          (status === "all" || c.status === status) &&
          displayName(c, mask).toLowerCase().includes(query.toLowerCase()),
      ),
    [candidates, jobId, status, query, mask],
  );

  const submitInvite = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Nama minimal 3 karakter.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Format email tidak valid.";
    if (!form.jobId) e.jobId = "Pilih lowongan.";
    setErrors(e);
    if (Object.keys(e).length) return;
    invite(form.name.trim(), form.email.trim(), form.jobId);
    toast.success("Undangan dibuat (simulasi).", { description: "Tidak ada email yang benar-benar dikirim." });
    setOpen(false);
    setForm({ name: "", email: "", jobId: jobs[0]?.id ?? "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 shadow-soft lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari kandidat…" className="pl-9" aria-label="Cari kandidat" />
        </div>
        <Select value={jobId} onChange={(e) => setJobId(e.target.value)} className="lg:w-64" aria-label="Filter lowongan">
          <option value="all">Semua lowongan</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="lg:w-52" aria-label="Filter status">
          <option value="all">Semua status</option>
          {(Object.keys(CANDIDATE_STATUS) as CandidateStatus[]).map((s) => (
            <option key={s} value={s}>
              {CANDIDATE_STATUS[s].label}
            </option>
          ))}
        </Select>
        <Button variant="one" onClick={() => setOpen(true)}>
          <UserPlus className="h-4 w-4" /> Undang kandidat
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-5 w-5" />} title="Tidak ada kandidat yang cocok" description="Ubah filter, atau undang kandidat baru." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-surface text-xs text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kandidat (fiktif)</th>
                  <th className="px-4 py-3 font-semibold">Lowongan</th>
                  <th className="px-4 py-3 font-semibold">Diundang</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Catatan</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((c) => (
                  <tr key={c.id} className="transition hover:bg-surface/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-one-soft text-xs font-bold text-one">
                          {mask ? "#" : initials(c.name)}
                        </span>
                        <div>
                          <p className="flex items-center gap-1.5 font-semibold text-ink">
                            {displayName(c, mask)} {c.flagged && <Flag className="h-3.5 w-3.5 text-danger" aria-label="Ditandai" />}
                          </p>
                          <p className="text-xs text-muted">{mask ? "email disamarkan" : c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-strong">{jobs.find((j) => j.id === c.jobId)?.title}</td>
                    <td className="px-4 py-3 text-muted-strong">{formatDate(c.invitedAt)}</td>
                    <td className="px-4 py-3">
                      <CandidateStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-strong">{c.notes.length}</td>
                    <td className="px-4 py-3 text-right">
                      {c.transcript.length > 0 ? (
                        <Button size="sm" variant="soft" onClick={() => onOpenReport(c.id)}>
                          Lihat laporan
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Pengingat dikirim ke ${displayName(c, mask)} (simulasi).`)}>
                          <Send className="h-3.5 w-3.5" /> Ingatkan
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-4 py-2.5 text-xs text-muted">{filtered.length} kandidat</p>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Undang kandidat"
        description="Gunakan data fiktif — undangan hanya simulasi."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="one" onClick={submitInvite}>
              <Send className="h-4 w-4" /> Buat undangan
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field>
            <Label htmlFor="inv-name" required>Nama kandidat</Label>
            <Input id="inv-name" data-autofocus value={form.name} aria-invalid={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FieldError message={errors.name} />
          </Field>
          <Field>
            <Label htmlFor="inv-email" required>Email</Label>
            <Input id="inv-email" type="email" value={form.email} aria-invalid={!!errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="kandidat@contoh.id" />
            <FieldError message={errors.email} />
          </Field>
          <Field>
            <Label htmlFor="inv-job" required>Lowongan</Label>
            <Select id="inv-job" value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })}>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </Select>
            <FieldError message={errors.jobId} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
