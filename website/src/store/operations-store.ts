"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AllocationKey, BudgetLine, CapacityAllocation, PoolKey, SprintColumn, SprintTask } from "@/types/operations";
import { ALLOCATION_PRESETS, BUDGET_LINES, SPRINT_TASKS } from "@/data/team";
import { demoStorage, storageKey } from "@/lib/persistence";
import { makeId } from "@/lib/utils";

interface OperationsState {
  allocation: CapacityAllocation;
  allocationPreset: "one" | "ace" | "split" | "custom";
  tasks: SprintTask[];
  budget: BudgetLine[];
  setAllocation: (pool: PoolKey, key: AllocationKey, value: number) => void;
  applyAllocationPreset: (preset: "one" | "ace" | "split") => void;
  moveTask: (id: string, column: SprintColumn) => void;
  addTask: (task: Omit<SprintTask, "id" | "column">) => void;
  removeTask: (id: string) => void;
  setBudget: (key: string, amount: number) => void;
  reset: () => void;
}

export const useOperationsStore = create<OperationsState>()(
  persist(
    (set) => ({
      allocation: ALLOCATION_PRESETS.ace.allocation,
      allocationPreset: "ace",
      tasks: SPRINT_TASKS,
      budget: BUDGET_LINES,
      setAllocation: (pool, key, value) =>
        set((s) => ({
          allocationPreset: "custom",
          allocation: { ...s.allocation, [pool]: { ...s.allocation[pool], [key]: Math.max(0, Math.min(100, Math.round(value))) } },
        })),
      applyAllocationPreset: (preset) => set({ allocation: ALLOCATION_PRESETS[preset].allocation, allocationPreset: preset }),
      moveTask: (id, column) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, column } : t)) })),
      addTask: (task) => set((s) => ({ tasks: [...s.tasks, { ...task, id: makeId("t"), column: "backlog" }] })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      setBudget: (key, amount) => set((s) => ({ budget: s.budget.map((b) => (b.key === key ? { ...b, amount: Math.max(0, amount) } : b)) })),
      reset: () => set({ allocation: ALLOCATION_PRESETS.ace.allocation, allocationPreset: "ace", tasks: SPRINT_TASKS, budget: BUDGET_LINES }),
    }),
    { name: storageKey("operations"), storage: demoStorage, skipHydration: true },
  ),
);
