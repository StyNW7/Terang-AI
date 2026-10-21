"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import { useStrategyStore } from "@/store/strategy-store";
import { useScenarioStore } from "@/store/scenario-store";
import { useEventsStore } from "@/store/events-store";
import { useInterviewStore } from "@/store/interview-store";
import { useOperationsStore } from "@/store/operations-store";
import { ModeTransition, StrategyModeDock } from "@/components/navigation/strategy-mode-switcher";

/** Rehydrate persisted demo stores after mount to keep SSR markup identical. */
function StoreHydrator() {
  useEffect(() => {
    void useStrategyStore.persist.rehydrate();
    void useScenarioStore.persist.rehydrate();
    void useEventsStore.persist.rehydrate();
    void useInterviewStore.persist.rehydrate();
    void useOperationsStore.persist.rehydrate();
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <StoreHydrator />
      {children}
      <StrategyModeDock />
      <ModeTransition />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{ style: { fontFamily: "var(--font-inter)", borderRadius: 14 } }}
      />
    </MotionConfig>
  );
}
