"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import { useStrategyStore } from "@/store/strategy-store";
import { useScenarioStore } from "@/store/scenario-store";
import { useEventsStore } from "@/store/events-store";
import { useInterviewStore } from "@/store/interview-store";
import { useOperationsStore } from "@/store/operations-store";
import { ModeTransition } from "@/components/navigation/strategy-mode-switcher";
import { useTheme } from "@/lib/theme";
import { CommandPalette } from "@/components/navigation/command-palette";
import { SpotlightTracker } from "@/components/ui/spotlight";

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

function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      theme={theme}
      richColors
      closeButton
      toastOptions={{ style: { fontFamily: "var(--font-geist)", borderRadius: 14 } }}
    />
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <StoreHydrator />
      {children}
      <ModeTransition />
      <CommandPalette />
      <SpotlightTracker />
      <ThemedToaster />
    </MotionConfig>
  );
}
