"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  color = "#4a90e2",
  hint,
  className,
  disabled,
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  display?: ReactNode;
  color?: string;
  hint?: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const pct = max === min ? 0 : ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
        </label>
        <span className="tabular shrink-0 text-[13px] font-semibold text-ink">{display ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--range-pct": `${pct}%`, "--range-color": color } as CSSProperties}
      />
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
