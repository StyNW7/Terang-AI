import type { Assumptions, ScenarioPreset } from "@/types/finance";

/**
 * ILLUSTRATIVE ACADEMIC ASSUMPTIONS — not verified Terang AI figures.
 * All three presets share the same structure so ONE and ACE are always compared
 * on the same headcount, horizon, fixed cost, development budget and sales capacity.
 */
export const BASE_ASSUMPTIONS: Assumptions = {
  shared: {
    horizonMonths: 12,
    totalBudget: 2_400_000_000,
    productiveHoursPerPerson: 120,
    fixedCostPerMonth: 58_000_000,
    rampFactor: 0.55,
    developmentBudget: 240_000_000,
    existingOrganizers: 14,
    eventsMaintenancePerMonth: 6_000_000,
    salesCapacityPilots: 40,
    salesCapacityOrganizers: 60,
  },
  events: {
    eventsPerOrganizerPerYear: 3,
    netRevenuePerEvent: 9_000_000,
    directCostPerEvent: 1_800_000,
    organizerRetention: 0.6,
    cacPerOrganizer: 2_000_000,
    supportHoursPerOrganizer: 2.5,
  },
  interview: {
    pilotConversion: 0.35,
    interviewsPerCustomerPerMonth: 120,
    netRevenuePerInterview: 65_000,
    variableCostPerInterview: 12_000,
    supportCostPerCustomerPerMonth: 1_500_000,
    renewalRate: 0.7,
    cacPerPilot: 4_500_000,
    supportHoursPerCustomer: 4,
  },
  one: {
    conversionUpliftPp: 0.03,
    focusedCampaignCost: 150_000_000,
  },
  ace: {
    interviewShare: 0.6,
    coordinationCostPerMonth: 5_000_000,
    incrementalMarketingOverhead: 25_000_000,
    interviewCampaignCost: 110_000_000,
    eventsCampaignCost: 50_000_000,
    contextSwitchOverhead: 0.15,
  },
};

export const SCENARIO_PRESETS: Record<ScenarioPreset, { label: string; description: string; assumptions: Assumptions }> = {
  conservative: {
    label: "Konservatif",
    description: "Validasi AI Candidate Interview lebih lambat (konversi & volume rendah); permintaan Events sedikit melemah.",
    assumptions: {
      ...BASE_ASSUMPTIONS,
      shared: { ...BASE_ASSUMPTIONS.shared, rampFactor: 0.45, salesCapacityPilots: 36, salesCapacityOrganizers: 48 },
      events: { ...BASE_ASSUMPTIONS.events, netRevenuePerEvent: 8_000_000, organizerRetention: 0.52, eventsPerOrganizerPerYear: 2.8 },
      interview: {
        ...BASE_ASSUMPTIONS.interview,
        pilotConversion: 0.22,
        interviewsPerCustomerPerMonth: 85,
        netRevenuePerInterview: 55_000,
        renewalRate: 0.6,
      },
    },
  },
  base: {
    label: "Base Case",
    description: "Asumsi tengah yang dipakai sebagai titik awal diskusi.",
    assumptions: BASE_ASSUMPTIONS,
  },
  optimistic: {
    label: "Optimis",
    description: "Permintaan rekrutmen B2B kuat (konversi & volume tinggi); Events tumbuh moderat.",
    assumptions: {
      ...BASE_ASSUMPTIONS,
      shared: { ...BASE_ASSUMPTIONS.shared, rampFactor: 0.62, salesCapacityPilots: 48, salesCapacityOrganizers: 66 },
      events: { ...BASE_ASSUMPTIONS.events, netRevenuePerEvent: 10_000_000, organizerRetention: 0.66, eventsPerOrganizerPerYear: 3.2 },
      interview: {
        ...BASE_ASSUMPTIONS.interview,
        pilotConversion: 0.46,
        interviewsPerCustomerPerMonth: 150,
        netRevenuePerInterview: 75_000,
        renewalRate: 0.8,
      },
    },
  },
};

export const HORIZON_OPTIONS = [6, 12, 18, 24] as const;
