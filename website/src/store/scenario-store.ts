"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Assumptions, ScenarioPreset } from "@/types/finance";
import { BASE_ASSUMPTIONS, SCENARIO_PRESETS } from "@/data/scenarios";
import { demoStorage, storageKey } from "@/lib/persistence";

type Section = keyof Assumptions;

interface ScenarioState {
  preset: ScenarioPreset | "custom";
  assumptions: Assumptions;
  update: <S extends Section>(section: S, key: keyof Assumptions[S], value: number) => void;
  applyPreset: (preset: ScenarioPreset) => void;
  reset: () => void;
}

/** Single source of truth for financial assumptions used across Compare, ONE, ACE and Portfolio. */
export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set) => ({
      preset: "base",
      assumptions: BASE_ASSUMPTIONS,
      update: (section, key, value) =>
        set((state) => ({
          preset: "custom",
          assumptions: {
            ...state.assumptions,
            [section]: { ...state.assumptions[section], [key]: Number.isFinite(value) ? Math.max(0, value) : 0 },
          },
        })),
      applyPreset: (preset) => set({ preset, assumptions: SCENARIO_PRESETS[preset].assumptions }),
      reset: () => set({ preset: "base", assumptions: BASE_ASSUMPTIONS }),
    }),
    { name: storageKey("scenario"), storage: demoStorage, skipHydration: true },
  ),
);
