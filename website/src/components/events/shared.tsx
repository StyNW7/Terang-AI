import type { EventItem } from "@/types/events";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/data/events.mock";
import type { Tone } from "@/types/common";

/** Fixed demo "today" keeps every simulation deterministic. */
export const DEMO_TODAY = "2026-10-21";

const STATUS_TONE: Record<EventItem["status"], Tone> = {
  draft: "neutral",
  published: "sky",
  registration: "brand",
  judging: "warning",
  completed: "success",
};

export function EventStatusBadge({ status }: { status: EventItem["status"] }) {
  return (
    <Badge tone={STATUS_TONE[status]} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: EventItem["category"] }) {
  return <Badge tone="neutral">{CATEGORY_LABEL[category]}</Badge>;
}

export function weightedScore(scores: Record<string, number>, criteria: EventItem["criteria"]) {
  const total = criteria.reduce((a, c) => a + c.weight, 0);
  if (!total) return 0;
  let sum = 0;
  for (const c of criteria) sum += (scores[c.id] ?? 0) * c.weight;
  return sum / total;
}
