import type { Candidate, CandidateStatus, JobPosition } from "@/types/interview";
import type { Tone } from "@/types/common";
import { Badge } from "@/components/ui/badge";
import { T } from "@/lib/i18n";
import { getActiveLocale, L, type Bilingual } from "@/lib/i18n-core";

export const CANDIDATE_STATUS: Record<CandidateStatus, { label: Bilingual; tone: Tone }> = {
  diundang: { label: L("Diundang", "Invited"), tone: "neutral" },
  berlangsung: { label: L("Berlangsung", "In progress"), tone: "sky" },
  selesai: { label: L("Menunggu tinjauan", "Awaiting review"), tone: "warning" },
  ditinjau: { label: L("Selesai ditinjau", "Reviewed"), tone: "success" },
  "follow-up": { label: L("_Follow-up_ diminta", "Follow-up requested"), tone: "one" },
};

export const JOB_STATUS_LABEL: Record<JobPosition["status"], Bilingual> = {
  draft: L("_Draft_", "Draft"),
  aktif: L("Aktif", "Active"),
  ditutup: L("Ditutup", "Closed"),
};

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <Badge tone={CANDIDATE_STATUS[status].tone} dot>
      <T v={CANDIDATE_STATUS[status].label} />
    </Badge>
  );
}

/** Masked display name; reads the language of the render in progress. */
export function displayName(c: Candidate, mask: boolean) {
  if (!mask) return c.name;
  const label = getActiveLocale() === "en" ? "Candidate" : "Kandidat";
  return `${label} #${c.id.replace(/\D/g, "").slice(-3).padStart(3, "0")}`;
}

export const hasTranscript = (c: Candidate) => c.transcript.length > 0;
