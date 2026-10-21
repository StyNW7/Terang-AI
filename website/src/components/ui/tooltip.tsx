"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Hover/focus tooltip — CSS driven, works for keyboard users too. */
export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
}) {
  const id = useId();
  return (
    <span className={cn("group/tt relative inline-flex", className)} aria-describedby={id}>
      {children}
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 hidden w-max max-w-[240px] -translate-x-1/2 rounded-lg bg-navy px-3 py-2 text-left text-xs font-medium leading-relaxed text-white shadow-lift group-hover/tt:block group-focus-within/tt:block",
          side === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
        )}
      >
        {content}
      </span>
    </span>
  );
}

/** "Apa artinya?" explainer — click to open a small popover. */
export function InfoTip({
  title = "Apa artinya?",
  children,
  className,
  label,
  align = "left",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  label?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className={cn("relative inline-flex align-middle", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full text-[11.5px] font-semibold text-brand-ink transition hover:text-royal"
      >
        <CircleHelp className="h-3.5 w-3.5" />
        {label && <span>{label}</span>}
        <span className="sr-only">{title}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="dialog"
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-[calc(100%+8px)] z-50 block w-72 rounded-xl border border-line bg-white p-3.5 text-left shadow-lift",
              align === "left" ? "left-0" : "right-0",
            )}
          >
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-ink">
              <CircleHelp className="h-3.5 w-3.5" /> {title}
            </span>
            <span className="block text-[13px] font-normal normal-case leading-relaxed tracking-normal text-muted-strong">{children}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
