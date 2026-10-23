import type { Assumptions, ProductResult, StrategyResult } from "@/types/finance";
import { L, type Bilingual } from "@/lib/i18n-core";
import { clamp, nonNegative, safeDivide } from "./utils";

/**
 * Pure, deterministic financial model for comparing ONE vs ACE.
 *
 * Fair-comparison rules enforced here:
 * - Same horizon, headcount, fixed cost, development budget and sales capacity for both strategies.
 * - Events maintenance is paid in BOTH strategies and attributed to Events (counted once).
 * - ONE focus uplift and ACE coordination costs are explicit, editable assumptions.
 * - Every cost is counted exactly once.
 */

export const CONTRACT_TERM_MONTHS = 6;
export const PRODUCT_HEADCOUNT = 3;
export const OPS_HEADCOUNT = 2;
export const BASE_DEV_LOAD = 0.62; // share of product hours committed to roadmap work (both strategies)
export const BASE_OPS_LOAD = 0.36; // share of ops hours used for general operations (both strategies)
export const EVENTS_MAINTENANCE_HOURS = 22; // product hours / month, both strategies
export const ONBOARD_HOURS_PER_PILOT = 10;
export const ONBOARD_HOURS_PER_ORGANIZER = 6;
export const CAMPAIGN_HOURS = 18; // ops hours / month per active campaign
export const COORDINATION_HOURS = 16; // ops hours / month for ACE portfolio rituals

export type StrategyKey = "one" | "ace";

/** Months a converted customer keeps paying within the horizon, after renewal. */
export function retainedMonths(horizon: number, renewalRate: number) {
  const h = nonNegative(horizon);
  if (h <= CONTRACT_TERM_MONTHS) return h;
  return CONTRACT_TERM_MONTHS + (h - CONTRACT_TERM_MONTHS) * clamp(renewalRate, 0, 1);
}

function emptyProduct(): ProductResult {
  return {
    active: false,
    developing: false,
    customers: 0,
    units: 0,
    revenue: 0,
    variableCost: 0,
    supportCost: 0,
    contribution: 0,
    contributionMargin: 0,
    acquisitionCost: 0,
    developmentCost: 0,
  };
}

export function interviewShareFor(strategy: StrategyKey, a: Assumptions) {
  return strategy === "one" ? 1 : clamp(a.ace.interviewShare, 0, 1);
}

export function computeInterview(strategy: StrategyKey, a: Assumptions): ProductResult & { pilots: number; conversion: number } {
  const { shared, interview } = a;
  const share = interviewShareFor(strategy, a);
  const pilots = nonNegative(shared.salesCapacityPilots * share);
  const conversion = clamp(interview.pilotConversion + (strategy === "one" ? a.one.conversionUpliftPp : 0), 0, 1);
  const customers = Math.round(pilots * conversion);
  const customerMonths = customers * retainedMonths(shared.horizonMonths, interview.renewalRate) * clamp(shared.rampFactor, 0, 1);
  const units = customerMonths * nonNegative(interview.interviewsPerCustomerPerMonth);
  const revenue = units * nonNegative(interview.netRevenuePerInterview);
  const variableCost = units * nonNegative(interview.variableCostPerInterview);
  const supportCost = customerMonths * nonNegative(interview.supportCostPerCustomerPerMonth);
  const contribution = revenue - variableCost - supportCost;
  return {
    ...emptyProduct(),
    active: true,
    developing: share > 0,
    customers,
    units,
    revenue,
    variableCost,
    supportCost,
    contribution,
    contributionMargin: safeDivide(contribution, revenue),
    acquisitionCost: pilots * nonNegative(interview.cacPerPilot),
    developmentCost: nonNegative(shared.developmentBudget) * share,
    pilots,
    conversion,
  };
}

export function computeEvents(strategy: StrategyKey, a: Assumptions): ProductResult & { newOrganizers: number } {
  const { shared, events } = a;
  const share = 1 - interviewShareFor(strategy, a);
  const horizon = nonNegative(shared.horizonMonths);
  const newOrganizers = Math.round(nonNegative(shared.salesCapacityOrganizers * share));
  const retention = clamp(events.organizerRetention, 0, 1);
  const eventsPerOrg = nonNegative(events.eventsPerOrganizerPerYear) * (horizon / 12);

  // Existing organizers: every event in the horizon is a repeat event.
  const existingEvents = nonNegative(shared.existingOrganizers) * eventsPerOrg * retention;
  // New organizers: first event always happens, repeats depend on retention; ramp-up applies.
  const newPerOrg = eventsPerOrg * clamp(shared.rampFactor, 0, 1);
  const newEvents = newOrganizers * (Math.min(1, newPerOrg) + Math.max(0, newPerOrg - 1) * retention);
  const units = existingEvents + newEvents;

  const revenue = units * nonNegative(events.netRevenuePerEvent);
  const variableCost = units * nonNegative(events.directCostPerEvent);
  const supportCost = nonNegative(shared.eventsMaintenancePerMonth) * horizon; // attributable, counted once
  const contribution = revenue - variableCost - supportCost;
  return {
    ...emptyProduct(),
    active: true,
    developing: share > 0,
    customers: nonNegative(shared.existingOrganizers) + newOrganizers,
    units,
    revenue,
    variableCost,
    supportCost,
    contribution,
    contributionMargin: safeDivide(contribution, revenue),
    acquisitionCost: newOrganizers * nonNegative(events.cacPerOrganizer),
    developmentCost: nonNegative(shared.developmentBudget) * share,
    newOrganizers,
  };
}

export function computeStrategy(strategy: StrategyKey, a: Assumptions): StrategyResult {
  const { shared } = a;
  const horizon = nonNegative(shared.horizonMonths);
  const interview = computeInterview(strategy, a);
  const events = computeEvents(strategy, a);

  const revenue = interview.revenue + events.revenue;
  const totalContribution = interview.contribution + events.contribution;
  const fixedCosts = nonNegative(shared.fixedCostPerMonth) * horizon;
  const developmentCosts = interview.developmentCost + events.developmentCost;

  const campaignCosts =
    strategy === "one"
      ? nonNegative(a.one.focusedCampaignCost)
      : nonNegative(a.ace.interviewCampaignCost) + (events.newOrganizers > 0 ? nonNegative(a.ace.eventsCampaignCost) : 0);
  const marketingCosts = campaignCosts + interview.acquisitionCost + events.acquisitionCost;

  const portfolioOverhead =
    strategy === "ace"
      ? nonNegative(a.ace.coordinationCostPerMonth) * horizon + nonNegative(a.ace.incrementalMarketingOverhead)
      : 0;

  const operatingResult = totalContribution - fixedCosts - developmentCosts - marketingCosts - portfolioOverhead;
  const directCosts = interview.variableCost + interview.supportCost + events.variableCost + events.supportCost;
  const totalCosts = directCosts + fixedCosts + developmentCosts + marketingCosts + portfolioOverhead;

  // ---- Capacity (hours per month) ----
  const hours = nonNegative(shared.productiveHoursPerPerson);
  const productAvailable = PRODUCT_HEADCOUNT * hours;
  const opsAvailable = OPS_HEADCOUNT * hours;
  const ramp = clamp(shared.rampFactor, 0, 1);
  const avgCustomers = interview.customers * ramp;
  const avgOrganizers = nonNegative(shared.existingOrganizers) + events.newOrganizers * ramp;
  const supportHours =
    avgCustomers * nonNegative(a.interview.supportHoursPerCustomer) + avgOrganizers * nonNegative(a.events.supportHoursPerOrganizer);
  const switchOverhead = strategy === "ace" ? clamp(a.ace.contextSwitchOverhead, 0, 1) : 0;
  const productRequired = productAvailable * BASE_DEV_LOAD * (1 + switchOverhead) + EVENTS_MAINTENANCE_HOURS + supportHours * 0.5;
  const campaigns = strategy === "one" ? 1 : events.newOrganizers > 0 ? 2 : 1;
  const onboarding = safeDivide(interview.pilots * ONBOARD_HOURS_PER_PILOT + events.newOrganizers * ONBOARD_HOURS_PER_ORGANIZER, horizon);
  const opsRequired =
    opsAvailable * BASE_OPS_LOAD +
    onboarding +
    supportHours * 0.5 +
    campaigns * CAMPAIGN_HOURS +
    (strategy === "ace" ? COORDINATION_HOURS : 0);

  const capacity = {
    productAvailable,
    productRequired,
    opsAvailable,
    opsRequired,
    productUtilization: safeDivide(productRequired, productAvailable),
    opsUtilization: safeDivide(opsRequired, opsAvailable),
  };

  const budgetConsumption = safeDivide(totalCosts, shared.totalBudget);

  const risks: Bilingual[] = [];
  if (capacity.productUtilization > 1) risks.push(L("Kapasitas tim _Product_ melebihi 100% — risiko keterlambatan & kualitas.", "Product team capacity exceeds 100% — risk of delays & quality issues."));
  else if (capacity.productUtilization > 0.9) risks.push(L("Kapasitas tim _Product_ sangat ketat (>90%).", "Product team capacity is very tight (>90%)."));
  if (capacity.opsUtilization > 1) risks.push(L("Kapasitas _Strategy & Operations_ melebihi 100%.", "Strategy & Operations capacity exceeds 100%."));
  else if (capacity.opsUtilization > 0.9) risks.push(L("Kapasitas _Strategy & Operations_ sangat ketat (>90%).", "Strategy & Operations capacity is very tight (>90%)."));
  if (budgetConsumption > 1) risks.push(L("Total biaya melebihi anggaran yang tersedia.", "Total costs exceed the available budget."));
  const interviewRevenueShare = safeDivide(interview.revenue, revenue);
  if (interviewRevenueShare > 0.8) risks.push(L("Konsentrasi pendapatan tinggi pada satu produk (>80%).", "High revenue concentration in one product (>80%)."));
  if (strategy === "one") risks.push(L("Bergantung pada keberhasilan konversi _pilot_ AI Candidate Interview.", "Depends on successfully converting AI Candidate Interview pilots."));
  if (strategy === "ace") risks.push(L("Kompleksitas koordinasi dua _roadmap_ & dua _go-to-market_.", "Complexity of coordinating two roadmaps & two go-to-market tracks."));
  if (interview.contribution < 0) risks.push(L("Kontribusi AI Candidate Interview negatif pada asumsi ini.", "AI Candidate Interview's contribution is negative under these assumptions."));
  if (events.contribution < 0) risks.push(L("Kontribusi Terang Events negatif pada asumsi ini.", "Terang Events' contribution is negative under these assumptions."));

  return {
    strategy,
    events,
    interview,
    revenue,
    totalContribution,
    contributionMargin: safeDivide(totalContribution, revenue),
    fixedCosts,
    developmentCosts,
    marketingCosts,
    portfolioOverhead,
    operatingResult,
    totalCosts,
    budgetConsumption,
    capacity,
    risks,
  };
}

export function computeBoth(a: Assumptions) {
  return { one: computeStrategy("one", a), ace: computeStrategy("ace", a) };
}

export type SensitivityParam =
  | "pilotConversion"
  | "netRevenuePerEvent"
  | "interviewShare"
  | "salesCapacityOrganizers"
  | "netRevenuePerInterview";

export const SENSITIVITY_PARAMS: Record<
  SensitivityParam,
  { label: Bilingual; min: number; max: number; steps: number; format: "percent" | "idr" | "number"; apply: (a: Assumptions, v: number) => Assumptions }
> = {
  pilotConversion: {
    label: L("Konversi _pilot_ → berbayar (Interview)", "Pilot → paid conversion (Interview)"),
    min: 0.1,
    max: 0.7,
    steps: 13,
    format: "percent",
    apply: (a, v) => ({ ...a, interview: { ...a.interview, pilotConversion: v } }),
  },
  netRevenuePerInterview: {
    label: L("Pendapatan bersih per _interview_", "Net revenue per interview"),
    min: 20_000,
    max: 120_000,
    steps: 11,
    format: "idr",
    apply: (a, v) => ({ ...a, interview: { ...a.interview, netRevenuePerInterview: v } }),
  },
  netRevenuePerEvent: {
    label: L("Pendapatan bersih per _event_", "Net revenue per event"),
    min: 2_000_000,
    max: 16_000_000,
    steps: 15,
    format: "idr",
    apply: (a, v) => ({ ...a, events: { ...a.events, netRevenuePerEvent: v } }),
  },
  salesCapacityOrganizers: {
    label: L("Kapasitas akuisisi _organizer_ baru", "New-organizer acquisition capacity"),
    min: 10,
    max: 100,
    steps: 10,
    format: "number",
    apply: (a, v) => ({ ...a, shared: { ...a.shared, salesCapacityOrganizers: v } }),
  },
  interviewShare: {
    label: L("Porsi kapasitas ACE untuk Interview", "ACE capacity share for Interview"),
    min: 0.3,
    max: 0.9,
    steps: 13,
    format: "percent",
    apply: (a, v) => ({ ...a, ace: { ...a.ace, interviewShare: v } }),
  },
};

export function sensitivity(a: Assumptions, param: SensitivityParam) {
  const cfg = SENSITIVITY_PARAMS[param];
  const points: { x: number; one: number; ace: number }[] = [];
  for (let i = 0; i < cfg.steps; i++) {
    const x = cfg.min + ((cfg.max - cfg.min) * i) / (cfg.steps - 1);
    const next = cfg.apply(a, x);
    points.push({ x, one: computeStrategy("one", next).operatingResult, ace: computeStrategy("ace", next).operatingResult });
  }
  return points;
}

/** First x where the leading strategy flips, if any. */
export function findCrossover(points: { x: number; one: number; ace: number }[]) {
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1].one - points[i - 1].ace;
    const curr = points[i].one - points[i].ace;
    if (prev === 0) return points[i - 1].x;
    if (Math.sign(prev) !== Math.sign(curr)) {
      const t = prev / (prev - curr);
      return points[i - 1].x + (points[i].x - points[i - 1].x) * t;
    }
  }
  return null;
}

export const FORMULAS: { name: Bilingual; formula: string; note: Bilingual }[] = [
  {
    name: L("Pendapatan Events", "Events revenue"),
    formula: "RevenueEvents = EventCount × NetRevenuePerEvent",
    note: L(
      "Jumlah _event_ = _organizer existing_ × _event_/_organizer_ × retensi + _organizer_ baru × (_event_ pertama + _event_ ulang × retensi).",
      "Event count = existing organizers × events/organizer × retention + new organizers × (first event + repeat events × retention).",
    ),
  },
  {
    name: L("Pendapatan Interview", "Interview revenue"),
    formula: "RevenueInterview = PaidInterviewsCompleted × NetRevenuePerInterview",
    note: L(
      "_Interview_ = pelanggan × bulan aktif (setelah _renewal_) × faktor _ramp-up_ × _interview_/pelanggan/bulan.",
      "Interviews = customers × active months (after renewal) × ramp-up factor × interviews/customer/month.",
    ),
  },
  {
    name: L("Kontribusi produk", "Product contribution"),
    formula: "ContributionProduct = ProductRevenue − DirectVariableCosts − AttributableDirectSupportCosts",
    note: L(
      "Biaya _maintenance_ Terang Events dihitung sebagai biaya dukungan langsung Events pada kedua strategi.",
      "Terang Events maintenance cost is counted as a direct Events support cost in both strategies.",
    ),
  },
  {
    name: L("Hasil operasional", "Operating result"),
    formula: "OperatingResult = TotalContribution − FixedOperatingCosts − DevelopmentCosts − Marketing − AdditionalPortfolioOverhead",
    note: L(
      "Bukan laba bersih: pajak, pembiayaan, dan biaya non-operasional tidak dihitung.",
      "Not net profit: taxes, financing and non-operating costs are excluded.",
    ),
  },
  {
    name: L("Konsumsi anggaran", "Budget consumption"),
    formula: "BudgetConsumption = TotalCosts ÷ AvailableBudget",
    note: L(
      "Total biaya mencakup biaya langsung, tetap, pengembangan, pemasaran, dan _overhead_ portofolio.",
      "Total costs include direct, fixed, development, marketing and portfolio-overhead costs.",
    ),
  },
];
