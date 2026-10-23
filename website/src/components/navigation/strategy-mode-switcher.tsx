"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Compass, Layers, Target } from "lucide-react";
import type { StrategyMode } from "@/types/common";
import { MODE_META, useStrategyMode } from "@/hooks/use-strategy-mode";
import { useStrategyStore } from "@/store/strategy-store";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const ITEMS: { id: StrategyMode; icon: typeof Compass }[] = [
  { id: "overview", icon: Compass },
  { id: "one", icon: Target },
  { id: "ace", icon: Layers },
];

export function StrategyModeSwitcher({ className, dark, compact }: { className?: string; dark?: boolean; compact?: boolean }) {
  const { mode, setMode } = useStrategyMode();
  const { t } = useI18n();
  const uid = useId();
  return (
    <div
      role="radiogroup"
      aria-label={t("Mode strategi global", "Global strategy mode")}
      className={cn(
        "relative inline-flex items-center gap-1 rounded-2xl p-1",
        dark ? "bg-white/10 ring-1 ring-white/15" : "bg-card/90 ring-1 ring-line",
        className,
      )}
    >
      {ITEMS.map(({ id, icon: Icon }) => {
        const active = id === mode;
        const meta = MODE_META[id];
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(id)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-xl font-semibold transition-colors",
              compact ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-[13px]",
              active ? "text-white" : dark ? "text-white/70 hover:text-white" : "text-muted-strong hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={`mode-pill-${uid}`}
                className="absolute inset-0 rounded-xl shadow-[0_8px_20px_-8px_rgba(37,99,214,0.7)]"
                style={{ backgroundImage: meta.gradient }}
                transition={{ type: "spring", stiffness: 480, damping: 36 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {t(compact ? meta.short : meta.label)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Non-blocking wipe that confirms a mode switch. */
export function ModeTransition() {
  const transitionKey = useStrategyStore((s) => s.transitionKey);
  const mode = useStrategyStore((s) => s.mode);
  const [visible, setVisible] = useState<{ key: number; mode: StrategyMode } | null>(null);
  const first = useRef(true);
  const { t } = useI18n();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (transitionKey === 0) return;
    const show = window.setTimeout(() => setVisible({ key: transitionKey, mode }), 0);
    const hide = window.setTimeout(() => setVisible(null), 1100);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [transitionKey, mode]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={visible.key}
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 opacity-[0.14]"
            style={{ backgroundImage: MODE_META[visible.mode].gradient }}
            initial={{ clipPath: "circle(0% at 50% 100%)" }}
            animate={{ clipPath: "circle(150% at 50% 100%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            initial={{ y: 16, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="rounded-3xl px-8 py-5 text-center text-white shadow-lift"
            style={{ backgroundImage: MODE_META[visible.mode].gradient }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/75">{t("Mode strategi", "Strategy mode")}</p>
            <p className="font-display text-2xl font-semibold">{t(MODE_META[visible.mode].label)}</p>
            <p className="mt-1 max-w-xs text-xs text-white/80">{t(MODE_META[visible.mode].description)}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
