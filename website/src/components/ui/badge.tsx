import type { ReactNode } from "react";
import type { Tone } from "@/types/common";
import { cn } from "@/lib/utils";

const tones: Record<Tone, string> = {
  neutral: "bg-neutral-soft text-muted-strong ring-line",
  brand: "bg-soft text-brand-ink ring-current/15",
  sky: "bg-sky-soft text-sky-ink ring-current/15",
  one: "bg-one-soft text-one-ink ring-current/15",
  ace: "bg-ace-soft text-ace-ink ring-current/15",
  success: "bg-success-soft text-success-ink ring-current/15",
  warning: "bg-warning-soft text-warning-ink ring-current/15",
  danger: "bg-danger-soft text-danger-ink ring-current/15",
  navy: "bg-ink text-card ring-ink",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  icon,
  dot,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  icon?: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}
      {icon}
      {children}
    </span>
  );
}
