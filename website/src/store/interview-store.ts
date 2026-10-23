"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditEntry, Candidate, CandidateStatus, InterviewQuestion, JobPosition } from "@/types/interview";
import { SEED_AUDIT, SEED_CANDIDATES, SEED_JOBS } from "@/data/candidates.mock";
import { demoStorage, storageKey } from "@/lib/persistence";
import { makeId } from "@/lib/utils";
import { L, type Txt } from "@/lib/i18n-core";

export type InterviewRole = "recruiter" | "candidate";

const ACTOR = "Recruiter Demo";

interface InterviewState {
  role: InterviewRole;
  jobs: JobPosition[];
  candidates: Candidate[];
  audit: AuditEntry[];
  retentionDays: number;
  requireHumanReview: boolean;
  maskIdentity: boolean;
  setRole: (role: InterviewRole) => void;
  addJob: (job: Omit<JobPosition, "id" | "createdAt">) => JobPosition;
  updateJob: (id: string, patch: Partial<JobPosition>) => void;
  setQuestions: (jobId: string, questions: InterviewQuestion[]) => void;
  inviteCandidate: (name: string, email: string, jobId: string) => void;
  setStatus: (id: string, status: CandidateStatus, action: Txt) => void;
  addNote: (id: string, text: string) => void;
  toggleFlag: (id: string) => void;
  overrideLevel: (id: string, competencyId: string, level: 1 | 2 | 3 | 4) => void;
  addCandidateResult: (candidate: Omit<Candidate, "id">) => string;
  setRetention: (days: number) => void;
  setRequireHumanReview: (v: boolean) => void;
  setMaskIdentity: (v: boolean) => void;
  log: (action: Txt, target: Txt) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      role: "recruiter",
      jobs: SEED_JOBS,
      candidates: SEED_CANDIDATES,
      audit: SEED_AUDIT,
      retentionDays: 90,
      requireHumanReview: true,
      maskIdentity: false,
      setRole: (role) => set({ role }),
      log: (action, target) =>
        set((s) => ({ audit: [{ id: makeId("a"), at: new Date().toISOString(), actor: ACTOR, action, target }, ...s.audit].slice(0, 60) })),
      addJob: (job) => {
        const created: JobPosition = { ...job, id: makeId("job"), createdAt: new Date().toISOString().slice(0, 10) };
        set((s) => ({ jobs: [created, ...s.jobs] }));
        get().log(L("Membuat lowongan", "Created a vacancy"), created.title);
        return created;
      },
      updateJob: (id, patch) => set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) })),
      setQuestions: (jobId, questions) => {
        set((s) => ({ jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, questions } : j)) }));
        const job = get().jobs.find((j) => j.id === jobId);
        get().log(L("Mempublikasikan set pertanyaan", "Published a question set"), job?.title ?? jobId);
      },
      inviteCandidate: (name, email, jobId) => {
        const candidate: Candidate = {
          id: makeId("cd"),
          name,
          email,
          jobId,
          invitedAt: new Date().toISOString().slice(0, 10),
          status: "diundang",
          flagged: false,
          evidence: [],
          transcript: [],
          notes: [],
          overrides: {},
        };
        set((s) => ({ candidates: [candidate, ...s.candidates] }));
        get().log(L("Mengirim undangan (simulasi)", "Sent an invitation (simulated)"), name);
      },
      setStatus: (id, status, action) => {
        set((s) => ({ candidates: s.candidates.map((c) => (c.id === id ? { ...c, status } : c)) }));
        get().log(action, get().candidates.find((c) => c.id === id)?.name ?? id);
      },
      addNote: (id, text) => {
        set((s) => ({
          candidates: s.candidates.map((c) =>
            c.id === id ? { ...c, notes: [...c.notes, { id: makeId("n"), author: ACTOR, text, at: new Date().toISOString() }] } : c,
          ),
        }));
        get().log(L("Menambahkan catatan _review_", "Added a review note"), get().candidates.find((c) => c.id === id)?.name ?? id);
      },
      toggleFlag: (id) => {
        const target = get().candidates.find((c) => c.id === id);
        set((s) => ({ candidates: s.candidates.map((c) => (c.id === id ? { ...c, flagged: !c.flagged } : c)) }));
        get().log(
          target?.flagged ? L("Mencabut tanda inspeksi manual", "Removed the manual-inspection flag") : L("Menandai untuk inspeksi manual", "Flagged for manual inspection"),
          target?.name ?? id,
        );
      },
      overrideLevel: (id, competencyId, level) => {
        set((s) => ({
          candidates: s.candidates.map((c) => (c.id === id ? { ...c, overrides: { ...c.overrides, [competencyId]: level } } : c)),
        }));
        get().log(L(`_Override_ level ${competencyId} → ${level}`, `Level override ${competencyId} → ${level}`), get().candidates.find((c) => c.id === id)?.name ?? id);
      },
      addCandidateResult: (candidate) => {
        const id = makeId("cd");
        set((s) => ({ candidates: [{ ...candidate, id }, ...s.candidates] }));
        get().log(L("Sesi _interview_ demo selesai", "Demo interview session completed"), candidate.name);
        return id;
      },
      setRetention: (retentionDays) => {
        set({ retentionDays });
        get().log(L(`Mengubah retensi data → ${retentionDays} hari`, `Changed data retention → ${retentionDays} days`), L("Pengaturan", "Settings"));
      },
      setRequireHumanReview: (requireHumanReview) => {
        set({ requireHumanReview });
        get().log(
          requireHumanReview
            ? L("Mengaktifkan wajib tinjauan manusia", "Enabled mandatory human review")
            : L("Mencoba menonaktifkan tinjauan manusia", "Attempted to disable human review"),
          L("Pengaturan", "Settings"),
        );
      },
      setMaskIdentity: (maskIdentity) => {
        set({ maskIdentity });
        get().log(
          maskIdentity ? L("Mengaktifkan penyamaran identitas", "Enabled identity masking") : L("Menonaktifkan penyamaran identitas", "Disabled identity masking"),
          L("Pengaturan", "Settings"),
        );
      },
      reset: () =>
        set({ jobs: SEED_JOBS, candidates: SEED_CANDIDATES, audit: SEED_AUDIT, retentionDays: 90, requireHumanReview: true, maskIdentity: false }),
    }),
    { name: storageKey("interview"), storage: demoStorage, skipHydration: true },
  ),
);
