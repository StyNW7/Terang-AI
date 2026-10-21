import type { TeamMember, PoolKey, CapacityAllocation, SprintTask, BudgetLine } from "@/types/operations";

/**
 * PRIVATE SCENARIO CONFIGURATION (internal-restricted-context).
 * Hypothetical organizational structure from the academic case — NOT a verified
 * statement about Terang AI's current headcount.
 */
export const TEAM: TeamMember[] = [
  { id: "ceo", role: "CEO", title: "Chief Executive Officer", pool: "leadership", initials: "CE" },
  { id: "cpo", role: "CPO", title: "Chief Product Officer", pool: "leadership", initials: "CP" },
  { id: "p1", role: "Product", title: "Product Engineer · Backend & AI", pool: "product", initials: "P1" },
  { id: "p2", role: "Product", title: "Product Engineer · Frontend", pool: "product", initials: "P2" },
  { id: "p3", role: "Product", title: "Product Designer / QA", pool: "product", initials: "P3" },
  { id: "s1", role: "Strategy & Ops", title: "Growth & Partnerships", pool: "ops", initials: "S1" },
  { id: "s2", role: "Strategy & Ops", title: "Customer Success & Operations", pool: "ops", initials: "S2" },
];

export const POOLS: Record<PoolKey, { label: string; description: string; headcount: number; keys: (keyof CapacityAllocation[PoolKey])[] }> = {
  leadership: {
    label: "Leadership (CEO + CPO)",
    description: "Arah strategi, penjualan enterprise, & keputusan produk. Bukan jam engineering.",
    headcount: 2,
    keys: ["interview", "events", "governance"],
  },
  product: {
    label: "Product (3 orang)",
    description: "Pengembangan, desain, QA, & maintenance teknis.",
    headcount: 3,
    keys: ["interview", "events", "qa", "maintenance", "buffer"],
  },
  ops: {
    label: "Strategy & Operations (2 orang)",
    description: "Akuisisi, onboarding, customer success, & koordinasi.",
    headcount: 2,
    keys: ["interview", "events", "coordination", "buffer"],
  },
};

export const ALLOCATION_LABELS: Record<string, string> = {
  interview: "AI Candidate Interview",
  events: "Terang Events",
  qa: "QA bersama",
  maintenance: "Maintenance",
  buffer: "Buffer insiden & support",
  governance: "Tata kelola portofolio",
  coordination: "Koordinasi lintas produk",
};

export const ALLOCATION_PRESETS: Record<"one" | "ace" | "split", { label: string; description: string; allocation: CapacityAllocation }> = {
  one: {
    label: "Preset ONE",
    description: "Fokus Interview; Events hanya maintenance.",
    allocation: {
      leadership: { interview: 70, events: 5, governance: 25 },
      product: { interview: 62, events: 0, qa: 13, maintenance: 10, buffer: 15 },
      ops: { interview: 70, events: 10, coordination: 5, buffer: 15 },
    },
  },
  ace: {
    label: "Preset ACE",
    description: "Alokasi terkendali 60:40 dengan QA, koordinasi & buffer wajib.",
    allocation: {
      leadership: { interview: 45, events: 30, governance: 25 },
      product: { interview: 37, events: 25, qa: 13, maintenance: 10, buffer: 15 },
      ops: { interview: 40, events: 30, coordination: 15, buffer: 15 },
    },
  },
  split: {
    label: "Bagi rata (uji)",
    description: "Contoh alokasi 50:50 tanpa buffer — untuk menunjukkan pelanggaran batas.",
    allocation: {
      leadership: { interview: 50, events: 50, governance: 0 },
      product: { interview: 45, events: 45, qa: 5, maintenance: 5, buffer: 0 },
      ops: { interview: 50, events: 50, coordination: 0, buffer: 0 },
    },
  },
};

export const SPRINT_TASKS: SprintTask[] = [
  { id: "t1", title: "Smart Event Templates — 4 template awal", product: "events", column: "in-progress", major: true, points: 8, owner: "P2" },
  { id: "t2", title: "Role-Based Interview Builder", product: "interview", column: "in-progress", major: true, points: 13, owner: "P1" },
  { id: "t3", title: "Rubrik kompetensi Customer Service", product: "interview", column: "review", major: false, points: 3, owner: "P3" },
  { id: "t4", title: "Repeat Event Planner", product: "events", column: "planned", major: true, points: 8, owner: "P2" },
  { id: "t5", title: "Evidence-Linked Assessment", product: "interview", column: "planned", major: true, points: 13, owner: "P1" },
  { id: "t6", title: "Organizer Growth Insights", product: "events", column: "backlog", major: true, points: 8, owner: "P2" },
  { id: "t7", title: "Audit trail & retensi data", product: "interview", column: "backlog", major: false, points: 5, owner: "P1" },
  { id: "t8", title: "Regression test pembayaran Events", product: "shared", column: "in-progress", major: false, points: 3, owner: "P3" },
  { id: "t9", title: "Design system komponen bersama", product: "shared", column: "done", major: false, points: 5, owner: "P3" },
  { id: "t10", title: "Landing page “Hire Smarter”", product: "interview", column: "done", major: false, points: 2, owner: "S1" },
  { id: "t11", title: "AI Event Assistant (later priority)", product: "events", column: "backlog", major: true, points: 13, owner: "—" },
  { id: "t12", title: "Onboarding kit organizer kampus", product: "events", column: "review", major: false, points: 2, owner: "S2" },
];

export const BUDGET_LINES: BudgetLine[] = [
  { key: "dev-interview", label: "Pengembangan Interview", product: "interview", amount: 12_000_000 },
  { key: "dev-events", label: "Pengembangan Events", product: "events", amount: 8_000_000 },
  { key: "mkt-interview", label: "Pemasaran Interview", product: "interview", amount: 9_000_000 },
  { key: "mkt-events", label: "Pemasaran Events", product: "events", amount: 5_000_000 },
  { key: "ops-direct", label: "Biaya operasional langsung", product: "shared", amount: 7_000_000 },
  { key: "shared", label: "Biaya bersama & koordinasi", product: "shared", amount: 5_000_000 },
];

export const MONTHLY_DISCRETIONARY_BUDGET = 50_000_000;
