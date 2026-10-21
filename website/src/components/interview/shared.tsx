import type { Candidate, CandidateStatus } from "@/types/interview";
import type { Tone } from "@/types/common";
import { Badge } from "@/components/ui/badge";

export const CANDIDATE_STATUS: Record<CandidateStatus, { label: string; tone: Tone }> = {
  diundang: { label: "Diundang", tone: "neutral" },
  berlangsung: { label: "Berlangsung", tone: "sky" },
  selesai: { label: "Menunggu tinjauan", tone: "warning" },
  ditinjau: { label: "Selesai ditinjau", tone: "success" },
  "follow-up": { label: "Follow-up diminta", tone: "one" },
};

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <Badge tone={CANDIDATE_STATUS[status].tone} dot>
      {CANDIDATE_STATUS[status].label}
    </Badge>
  );
}

export function displayName(c: Candidate, mask: boolean) {
  if (!mask) return c.name;
  return `Kandidat #${c.id.replace(/\D/g, "").slice(-3).padStart(3, "0")}`;
}

export const hasTranscript = (c: Candidate) => c.transcript.length > 0;
