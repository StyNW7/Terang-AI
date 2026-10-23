import type { TeamMember, PoolKey, CapacityAllocation, SprintTask, BudgetLine } from "@/types/operations";
import { L, type Bilingual, type Txt } from "@/lib/i18n-core";

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

export const POOLS: Record<PoolKey, { label: Bilingual; description: Bilingual; headcount: number; keys: (keyof CapacityAllocation[PoolKey])[] }> = {
  leadership: {
    label: L("_Leadership_ (CEO + CPO)", "Leadership (CEO + CPO)"),
    description: L("Arah strategi, penjualan _enterprise_, & keputusan produk. Bukan jam _engineering_.", "Strategic direction, enterprise sales & product decisions. Not engineering hours."),
    headcount: 2,
    keys: ["interview", "events", "governance"],
  },
  product: {
    label: L("_Product_ (3 orang)", "Product (3 people)"),
    description: L("Pengembangan, desain, QA, & _maintenance_ teknis.", "Development, design, QA & technical maintenance."),
    headcount: 3,
    keys: ["interview", "events", "qa", "maintenance", "buffer"],
  },
  ops: {
    label: L("_Strategy & Operations_ (2 orang)", "Strategy & Operations (2 people)"),
    description: L("Akuisisi, _onboarding_, _customer success_, & koordinasi.", "Acquisition, onboarding, customer success & coordination."),
    headcount: 2,
    keys: ["interview", "events", "coordination", "buffer"],
  },
};

export const ALLOCATION_LABELS: Record<string, Txt> = {
  interview: "AI Candidate Interview",
  events: "Terang Events",
  qa: L("QA bersama", "Shared QA"),
  maintenance: L("_Maintenance_", "Maintenance"),
  buffer: L("_Buffer_ insiden & _support_", "Incident & support buffer"),
  governance: L("Tata kelola portofolio", "Portfolio governance"),
  coordination: L("Koordinasi lintas produk", "Cross-product coordination"),
};

export const ALLOCATION_PRESETS: Record<"one" | "ace" | "split", { label: Bilingual; description: Bilingual; allocation: CapacityAllocation }> = {
  one: {
    label: L("_Preset_ ONE", "ONE preset"),
    description: L("Fokus Interview; Events hanya _maintenance_.", "Interview focus; Events on maintenance only."),
    allocation: {
      leadership: { interview: 70, events: 5, governance: 25 },
      product: { interview: 62, events: 0, qa: 13, maintenance: 10, buffer: 15 },
      ops: { interview: 70, events: 10, coordination: 5, buffer: 15 },
    },
  },
  ace: {
    label: L("_Preset_ ACE", "ACE preset"),
    description: L("Alokasi terkendali 60:40 dengan QA, koordinasi & _buffer_ wajib.", "Controlled 60:40 allocation with mandatory QA, coordination & buffer."),
    allocation: {
      leadership: { interview: 45, events: 30, governance: 25 },
      product: { interview: 37, events: 25, qa: 13, maintenance: 10, buffer: 15 },
      ops: { interview: 40, events: 30, coordination: 15, buffer: 15 },
    },
  },
  split: {
    label: L("Bagi rata (uji)", "Even split (test)"),
    description: L("Contoh alokasi 50:50 tanpa _buffer_ — untuk menunjukkan pelanggaran batas.", "A 50:50 allocation with no buffer — to show limit violations."),
    allocation: {
      leadership: { interview: 50, events: 50, governance: 0 },
      product: { interview: 45, events: 45, qa: 5, maintenance: 5, buffer: 0 },
      ops: { interview: 50, events: 50, coordination: 0, buffer: 0 },
    },
  },
};

export const SPRINT_TASKS: SprintTask[] = [
  { id: "t1", title: L("Smart Event Templates — 4 _template_ awal", "Smart Event Templates — first 4 templates"), product: "events", column: "in-progress", major: true, points: 8, owner: "P2" },
  { id: "t2", title: "Role-Based Interview Builder", product: "interview", column: "in-progress", major: true, points: 13, owner: "P1" },
  { id: "t3", title: L("Rubrik kompetensi _Customer Service_", "Customer Service competency rubric"), product: "interview", column: "review", major: false, points: 3, owner: "P3" },
  { id: "t4", title: "Repeat Event Planner", product: "events", column: "planned", major: true, points: 8, owner: "P2" },
  { id: "t5", title: "Evidence-Linked Assessment", product: "interview", column: "planned", major: true, points: 13, owner: "P1" },
  { id: "t6", title: "Organizer Growth Insights", product: "events", column: "backlog", major: true, points: 8, owner: "P2" },
  { id: "t7", title: L("_Audit trail_ & retensi data", "Audit trail & data retention"), product: "interview", column: "backlog", major: false, points: 5, owner: "P1" },
  { id: "t8", title: L("_Regression test_ pembayaran Events", "Events payment regression test"), product: "shared", column: "in-progress", major: false, points: 3, owner: "P3" },
  { id: "t9", title: L("_Design system_ komponen bersama", "Shared component design system"), product: "shared", column: "done", major: false, points: 5, owner: "P3" },
  { id: "t10", title: L("_Landing page_ “Hire Smarter”", "“Hire Smarter” landing page"), product: "interview", column: "done", major: false, points: 2, owner: "S1" },
  { id: "t11", title: L("AI Event Assistant (prioritas berikutnya)", "AI Event Assistant (later priority)"), product: "events", column: "backlog", major: true, points: 13, owner: "—" },
  { id: "t12", title: L("_Onboarding kit_ untuk _organizer_ kampus", "Campus organizer onboarding kit"), product: "events", column: "review", major: false, points: 2, owner: "S2" },
];

export const BUDGET_LINES: BudgetLine[] = [
  { key: "dev-interview", label: L("Pengembangan Interview", "Interview development"), product: "interview", amount: 12_000_000 },
  { key: "dev-events", label: L("Pengembangan Events", "Events development"), product: "events", amount: 8_000_000 },
  { key: "mkt-interview", label: L("Pemasaran Interview", "Interview marketing"), product: "interview", amount: 9_000_000 },
  { key: "mkt-events", label: L("Pemasaran Events", "Events marketing"), product: "events", amount: 5_000_000 },
  { key: "ops-direct", label: L("Biaya operasional langsung", "Direct operating costs"), product: "shared", amount: 7_000_000 },
  { key: "shared", label: L("Biaya bersama & koordinasi", "Shared & coordination costs"), product: "shared", amount: 5_000_000 },
];

export const MONTHLY_DISCRETIONARY_BUDGET = 50_000_000;
