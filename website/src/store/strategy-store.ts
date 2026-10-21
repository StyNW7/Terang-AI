"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StrategyMode } from "@/types/common";
import { demoStorage, storageKey } from "@/lib/persistence";

interface StrategyState {
  mode: StrategyMode;
  transitionKey: number;
  presentationSlide: number;
  setMode: (mode: StrategyMode) => void;
  setPresentationSlide: (index: number) => void;
}

export const useStrategyStore = create<StrategyState>()(
  persist(
    (set, get) => ({
      mode: "overview",
      transitionKey: 0,
      presentationSlide: 0,
      setMode: (mode) => {
        if (get().mode === mode) return;
        set({ mode, transitionKey: get().transitionKey + 1 });
      },
      setPresentationSlide: (presentationSlide) => set({ presentationSlide }),
    }),
    {
      name: storageKey("strategy"),
      storage: demoStorage,
      skipHydration: true,
      partialize: (s) => ({ mode: s.mode, presentationSlide: s.presentationSlide }),
    },
  ),
);
