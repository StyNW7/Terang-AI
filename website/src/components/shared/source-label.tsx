import { BadgeCheck, FlaskConical, Lightbulb, Lock, MousePointerClick } from "lucide-react";
import type { EvidenceClassification } from "@/types/common";
import { EVIDENCE_META } from "@/data/public-sources";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const STYLES: Record<EvidenceClassification, { className: string; Icon: typeof BadgeCheck }> = {
  "public-source": { className: "bg-success-soft text-success-ink ring-current/15", Icon: BadgeCheck },
  "internal-restricted-context": { className: "bg-violet-soft text-violet-ink ring-current/15", Icon: Lock },
  "strategic-proposal": { className: "bg-soft text-brand-ink ring-current/15", Icon: Lightbulb },
  "illustrative-assumption": { className: "bg-warning-soft text-warning-ink ring-current/15", Icon: FlaskConical },
  "synthetic-demo": { className: "bg-neutral-soft text-muted-strong ring-line", Icon: MousePointerClick },
};

export function SourceLabel({
  type,
  className,
  compact,
  dark,
}: {
  type: EvidenceClassification;
  className?: string;
  compact?: boolean;
  dark?: boolean;
}) {
  const meta = EVIDENCE_META[type];
  const { className: style, Icon } = STYLES[type];
  return (
    <Tooltip content={meta.description}>
      <span
        tabIndex={0}
        className={cn(
          "inline-flex cursor-help items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
          dark ? "bg-white/10 text-white/85 ring-white/20" : style,
          className,
        )}
      >
        <Icon className="h-3 w-3" />
        {compact ? meta.short : meta.label}
      </span>
    </Tooltip>
  );
}
