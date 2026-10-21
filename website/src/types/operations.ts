import type { ProductKey } from "./common";

export type PoolKey = "leadership" | "product" | "ops";

export interface TeamMember {
  id: string;
  role: string;
  title: string;
  pool: PoolKey;
  initials: string;
}

export type AllocationKey =
  | "interview"
  | "events"
  | "qa"
  | "maintenance"
  | "buffer"
  | "governance"
  | "coordination";

export type PoolAllocation = Partial<Record<AllocationKey, number>>; // percentages 0..100

export type CapacityAllocation = Record<PoolKey, PoolAllocation>;

export interface CapacityIssue {
  severity: "critical" | "warning" | "info";
  pool?: PoolKey;
  message: string;
  rule: string;
}

export type SprintColumn = "backlog" | "planned" | "in-progress" | "review" | "done";

export interface SprintTask {
  id: string;
  title: string;
  product: ProductKey | "shared";
  column: SprintColumn;
  major: boolean;
  points: number;
  owner: string;
}

export interface BudgetLine {
  key: string;
  label: string;
  product: ProductKey | "shared";
  amount: number; // per month, IDR
}
