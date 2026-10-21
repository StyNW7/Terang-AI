"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Zap } from "lucide-react";
import { MODE_META, useStrategyMode } from "@/hooks/use-strategy-mode";
import { Button } from "@/components/ui/button";

/** Suggests switching the global mode to match the strategy page being viewed. */
export function ModeActivator({ target }: { target: "one" | "ace" }) {
  const { mode, setMode } = useStrategyMode();
  const active = mode === target;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={String(active)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="inline-flex flex-wrap items-center gap-3 rounded-2xl bg-white/12 p-2 pl-4 ring-1 ring-white/20 backdrop-blur"
      >
        {active ? (
          <span className="flex items-center gap-2 py-1.5 pr-2 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" /> Mode {MODE_META[target].label} aktif di seluruh website
          </span>
        ) : (
          <>
            <span className="text-sm font-semibold text-white/90">Mode saat ini: {MODE_META[mode].label}</span>
            <Button variant="light" size="sm" onClick={() => setMode(target)}>
              <Zap className="h-3.5 w-3.5" /> Aktifkan mode {MODE_META[target].short}
            </Button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
