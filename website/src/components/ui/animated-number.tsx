"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { formatDecimal, formatIDR, formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { getActiveLocale } from "@/lib/i18n-core";
import { useI18n } from "@/lib/i18n";

export type NumberFormat = "idr" | "idrCompact" | "number" | "decimal" | "percent" | "percent1" | "hours";

export function formatValue(value: number, format: NumberFormat) {
  switch (format) {
    case "idr":
      return formatIDR(value);
    case "idrCompact":
      return formatIDRCompact(value);
    case "decimal":
      return formatDecimal(value);
    case "percent":
      return formatPercent(value);
    case "percent1":
      return formatPercent(value, 1);
    case "hours":
      return `${formatNumber(value)} ${getActiveLocale() === "en" ? "hrs" : "jam"}`;
    default:
      return formatNumber(value);
  }
}

/** Counts up/down smoothly when the value changes or first enters the viewport. */
export function AnimatedNumber({
  value,
  format = "number",
  className,
  prefix,
  suffix,
}: {
  value: number;
  format?: NumberFormat;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  useI18n(); // re-render (and re-format) when the language changes
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const from = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      from.current = value;
      const id = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(id);
    }
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, inView, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatValue(inView ? display : value, format)}
      {suffix}
    </span>
  );
}
