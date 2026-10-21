export type ScenarioPreset = "conservative" | "base" | "optimistic";

/** All monetary values are in IDR. Periods are explicitly per month or per horizon. */
export interface SharedAssumptions {
  horizonMonths: number;
  totalBudget: number; // spending budget for the whole horizon
  productiveHoursPerPerson: number; // per month
  fixedCostPerMonth: number; // salaries, tools, office — identical for both strategies
  rampFactor: number; // 0..1 average share of the period a newly acquired customer is active
  developmentBudget: number; // extra development spend for the horizon (same for both)
  existingOrganizers: number; // current Events organizers served in both strategies
  eventsMaintenancePerMonth: number; // keep-the-lights-on cost of Terang Events (both strategies)
  salesCapacityPilots: number; // Interview pilots achievable with 100% commercial focus
  salesCapacityOrganizers: number; // new organizers achievable with 100% commercial focus on Events
}

export interface EventsAssumptions {
  eventsPerOrganizerPerYear: number;
  netRevenuePerEvent: number;
  directCostPerEvent: number;
  organizerRetention: number; // 0..1, share of repeat events that actually happen
  cacPerOrganizer: number;
  supportHoursPerOrganizer: number; // per month
}

export interface InterviewAssumptions {
  pilotConversion: number; // 0..1
  interviewsPerCustomerPerMonth: number;
  netRevenuePerInterview: number;
  variableCostPerInterview: number;
  supportCostPerCustomerPerMonth: number;
  renewalRate: number; // 0..1 applied after the initial contract term
  cacPerPilot: number;
  supportHoursPerCustomer: number; // per month
}

export interface OneAssumptions {
  conversionUpliftPp: number; // explicit focus uplift, percentage points (0.03 = +3pp)
  focusedCampaignCost: number; // fixed campaign spend for the horizon
}

export interface AceAssumptions {
  interviewShare: number; // 0..1 of commercial + development capacity allocated to Interview
  coordinationCostPerMonth: number;
  incrementalMarketingOverhead: number; // for the horizon
  interviewCampaignCost: number;
  eventsCampaignCost: number;
  contextSwitchOverhead: number; // 0..1 extra product hours due to running two roadmaps
}

export interface Assumptions {
  shared: SharedAssumptions;
  events: EventsAssumptions;
  interview: InterviewAssumptions;
  one: OneAssumptions;
  ace: AceAssumptions;
}

export interface ProductResult {
  active: boolean;
  developing: boolean;
  customers: number;
  units: number; // events or interviews
  revenue: number;
  variableCost: number;
  supportCost: number;
  contribution: number;
  contributionMargin: number;
  acquisitionCost: number;
  developmentCost: number;
}

export interface CapacityResult {
  productAvailable: number;
  productRequired: number;
  opsAvailable: number;
  opsRequired: number;
  productUtilization: number;
  opsUtilization: number;
}

export interface StrategyResult {
  strategy: "one" | "ace";
  events: ProductResult;
  interview: ProductResult;
  revenue: number;
  totalContribution: number;
  contributionMargin: number;
  fixedCosts: number;
  developmentCosts: number;
  marketingCosts: number;
  portfolioOverhead: number;
  operatingResult: number;
  totalCosts: number;
  budgetConsumption: number;
  capacity: CapacityResult;
  risks: string[];
}
