"use client";

import type { StrategyMode } from "@/types/common";
import { useStrategyStore } from "@/store/strategy-store";

export const MODE_META: Record<
  StrategyMode,
  { label: string; short: string; position: string; description: string; color: string; gradient: string }
> = {
  overview: {
    label: "Overview",
    short: "Overview",
    position: "Netral",
    description: "Representasi netral dua produk dan dilema strategis.",
    color: "#4a90e2",
    gradient: "linear-gradient(135deg,#39b7ff,#2f66e0)",
  },
  one: {
    label: "ONE — PRO",
    short: "ONE",
    position: "PRO",
    description: "Fokus pada AI Candidate Interview; Terang Events maintenance-only.",
    color: "#2251c9",
    gradient: "linear-gradient(135deg,#4a90e2,#2251c9 60%,#17395e)",
  },
  ace: {
    label: "ACE — CONTRA",
    short: "ACE",
    position: "KONTRA",
    description: "Dua produk dikembangkan terkoordinasi dengan kendali kapasitas.",
    color: "#0c9fd8",
    gradient: "linear-gradient(135deg,#5fd0ff,#0c9fd8 55%,#2f66e0)",
  },
};

export function useStrategyMode() {
  const mode = useStrategyStore((s) => s.mode);
  const setMode = useStrategyStore((s) => s.setMode);
  return { mode, setMode, meta: MODE_META[mode] };
}
