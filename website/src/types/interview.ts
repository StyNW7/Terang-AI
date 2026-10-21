export type RoleKey = "customer-service" | "sales-associate" | "operations-assistant";

export interface Competency {
  id: string;
  name: string;
  description: string;
  rubric: { level: 1 | 2 | 3 | 4; label: string; descriptor: string }[];
  keywords: string[]; // deterministic evidence matching
}

export interface InterviewQuestion {
  id: string;
  competencyId: string;
  text: string;
  followUp: string;
  edited?: boolean;
}

export interface JobPosition {
  id: string;
  title: string;
  role: RoleKey;
  department: string;
  location: string;
  description: string;
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
  rationale: string;
  confidence: "rendah" | "sedang" | "tinggi";
}

export interface ReviewNote {
  id: string;
  author: string;
  text: string;
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
  transcript: { questionId: string; question: string; answer: string }[];
  notes: ReviewNote[];
  overrides: Record<string, 1 | 2 | 3 | 4>;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
}
