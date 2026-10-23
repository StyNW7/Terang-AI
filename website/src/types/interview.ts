import type { Txt } from "@/lib/i18n-core";

export type RoleKey = "customer-service" | "sales-associate" | "operations-assistant";

export interface Competency {
  id: string;
  name: Txt;
  description: Txt;
  rubric: { level: 1 | 2 | 3 | 4; label: Txt; descriptor: Txt }[];
  keywords: string[]; // deterministic evidence matching (ID + EN stems)
}

export interface InterviewQuestion {
  id: string;
  competencyId: string;
  text: Txt;
  followUp: Txt;
  edited?: boolean;
}

export interface JobPosition {
  id: string;
  title: string;
  role: RoleKey;
  department: Txt;
  location: string;
  description: Txt;
  competencies: { id: string; weight: number }[];
  durationMinutes: number;
  questions: InterviewQuestion[];
  status: "draft" | "aktif" | "ditutup";
  createdAt: string;
}

export type CandidateStatus = "diundang" | "berlangsung" | "selesai" | "ditinjau" | "follow-up";

export interface EvidenceItem {
  competencyId: string;
  level: 1 | 2 | 3 | 4;
  excerpt: string;
  rationale: Txt;
  confidence: "rendah" | "sedang" | "tinggi";
}

export interface ReviewNote {
  id: string;
  author: string;
  text: Txt;
  at: string;
}

export interface Candidate {
  id: string;
  name: string;
  jobId: string;
  email: string;
  invitedAt: string;
  completedAt?: string;
  status: CandidateStatus;
  flagged: boolean;
  evidence: EvidenceItem[];
  transcript: { questionId: string; question: Txt; answer: Txt }[];
  notes: ReviewNote[];
  overrides: Record<string, 1 | 2 | 3 | 4>;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: Txt;
  action: Txt;
  target: Txt;
}
