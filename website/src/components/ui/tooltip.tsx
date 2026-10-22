"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CircleHelp, X } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "right";

const GAP = 8;
const EDGE = 12;

/**
 * Positions a floating panel next to an anchor, flipping and clamping so it
 * never leaves the viewport or gets clipped by `overflow: hidden` parents
 * (the panel is portalled to <body>).
 */
function useFloating(open: boolean, preferred: Side) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number; side: Side } | null>(null);

  const update = useCallback(() => {
    const a = anchorRef.current?.getBoundingClientRect();
    const p = panelRef.current?.getBoundingClientRect();
    if (!a || !p) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let side = preferred;
    if (side === "right" && a.right + GAP + p.width > vw - EDGE) side = "top";
    if (side === "top" && a.top - GAP - p.height < EDGE) side = "bottom";
    else if (side === "bottom" && a.bottom + GAP + p.height > vh - EDGE && a.top - GAP - p.height > EDGE) side = "top";

    let x: number;
    let y: number;
    if (side === "right") {
      x = a.right + GAP;
      y = a.top + a.height / 2 - p.height / 2;
    } else {
      x = a.left + a.width / 2 - p.width / 2;
      y = side === "top" ? a.top - GAP - p.height : a.bottom + GAP;
    }
    x = Math.min(Math.max(EDGE, x), vw - EDGE - p.width);
    y = Math.min(Math.max(EDGE, y), vh - EDGE - p.height);
    setPos({ x, y, side });
  }, [preferred]);

  useLayoutEffect(() => {
    if (!open) return;
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, update]);

  return { anchorRef, panelRef, pos, update };
}

/** Hover/focus tooltip — works for keyboard users too and is never clipped. */
export function Tooltip({
  content,
  children,
  side = "top",
  className,
  disabled,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: Side;
  className?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { anchorRef, panelRef, pos } = useFloating(open, side);
  const timer = useRef<number | undefined>(undefined);

  const show = () => {
    if (disabled) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), 80);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      ref={anchorRef}
      className={cn("relative inline-flex", className)}
      aria-describedby={open ? id : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {children}
      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="tooltip"
            id={id}
            style={{ left: pos?.x ?? -9999, top: pos?.y ?? -9999 }}
            className={cn(
              "pointer-events-none fixed z-[200] w-max max-w-[260px] rounded-lg border border-white/10 bg-navy-deep/95 px-3 py-2 text-left text-xs font-normal leading-relaxed text-white shadow-lift backdrop-blur",
              "dark:border-line dark:bg-card dark:text-ink",
              "animate-tooltip-in",
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </span>
  );
}

/** "Apa artinya?" explainer — click to open a small popover with a short explanation. */
export function InfoTip({
  title = "Apa artinya?",
  children,
  className,
  label,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  label?: string;
  /** @deprecated placement is now automatic */
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const { anchorRef, panelRef, pos } = useFloating(open, "bottom");
  const id = useId();
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, anchorRef, panelRef]);

  return (
    <span ref={anchorRef} className={cn("relative inline-flex align-middle", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full text-xs font-medium text-brand-ink transition hover:text-royal dark:hover:text-sky",
          open && "text-royal dark:text-sky",
        )}
      >
        <CircleHelp className="h-3.5 w-3.5" />
        {label && <span>{label}</span>}
        <span className="sr-only">{title}</span>
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={panelRef}
                id={id}
                role="dialog"
                aria-label={title}
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                style={{ left: pos?.x ?? -9999, top: pos?.y ?? -9999 }}
                className="fixed z-[200] block w-[min(20rem,calc(100vw-24px))] rounded-xl border border-line bg-card p-4 text-left shadow-lift"
              >
                <span className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    <CircleHelp className="h-4 w-4 text-brand-ink" /> {title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="grid h-6 w-6 place-items-center rounded-md text-muted transition hover:bg-neutral-soft hover:text-ink"
                    aria-label="Tutup penjelasan"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
                <span className="block text-[13px] font-normal normal-case leading-relaxed tracking-normal text-muted-strong">{children}</span>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </span>
  );
}
