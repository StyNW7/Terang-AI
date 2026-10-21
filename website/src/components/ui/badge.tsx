import type { ReactNode } from "react";
import type { Tone } from "@/types/common";
import { cn } from "@/lib/utils";

const tones: Record<Tone, string> = {
  neutral: "bg-[#eef3f9] text-muted-strong ring-[#dde8f3]",
  brand: "bg-soft text-brand-ink ring-[#cfe6fb]",
  sky: "bg-[#e5f6ff] text-sky-ink ring-[#c4eaff]",
  one: "bg-one-soft text-one ring-[#cddaf8]",
  ace: "bg-ace-soft text-[#0a7aa6] ring-[#bfe9f8]",
  success: "bg-success-soft text-[#0b7a5a] ring-[#c6eedf]",
  warning: "bg-warning-soft text-warning-ink ring-[#fbe2b3]",
  danger: "bg-danger-soft text-danger-ink ring-[#f8cfd0]",
  navy: "bg-navy text-white ring-navy",
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
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset",
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
