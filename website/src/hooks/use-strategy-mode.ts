"use client";

import type { StrategyMode } from "@/types/common";
import { useStrategyStore } from "@/store/strategy-store";
import { L, type Bilingual } from "@/lib/i18n-core";

export const MODE_META: Record<
  StrategyMode,
  { label: Bilingual; short: Bilingual; position: Bilingual; description: Bilingual; color: string; gradient: string }
> = {
  overview: {
    label: L("Netral", "Overview"),
    short: L("Netral", "Overview"),
    position: L("Netral", "Neutral"),
    description: L("Representasi netral dua produk dan dilema strategis.", "A neutral view of both products and the strategic dilemma."),
    color: "#4a90e2",
    gradient: "linear-gradient(135deg,#39b7ff,#2f66e0)",
  },
  one: {
    label: L("ONE — PRO", "ONE — PRO"),
    short: L("ONE", "ONE"),
    position: L("PRO", "PRO"),
    description: L("Fokus pada AI Candidate Interview; Terang Events hanya _maintenance_.", "Focus on AI Candidate Interview; Terang Events on maintenance only."),
    color: "#2251c9",
    gradient: "linear-gradient(135deg,#4a90e2,#2251c9 60%,#17395e)",
  },
  ace: {
    label: L("ACE — KONTRA", "ACE — CONTRA"),
    short: L("ACE", "ACE"),
    position: L("KONTRA", "CONTRA"),
    description: L("Dua produk dikembangkan terkoordinasi dengan kendali kapasitas.", "Two products developed in coordination, under capacity control."),
    color: "#0c9fd8",
    gradient: "linear-gradient(135deg,#5fd0ff,#0c9fd8 55%,#2f66e0)",
  },
};

export function useStrategyMode() {
  const mode = useStrategyStore((s) => s.mode);
  const setMode = useStrategyStore((s) => s.setMode);
  return { mode, setMode, meta: MODE_META[mode] };
}
