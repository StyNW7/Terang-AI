import { L, type Bilingual, type Txt } from "@/lib/i18n-core";

/**
 * TEAM PROPOSAL FIGURES — targets, prices and projections from the ONE / ACE proposal.
 * These are modelling assumptions and projections, not Terang AI's realised performance,
 * official prices or company commitments. The in-app simulator is a separate, simpler model.
 */

export const PROJECTION_NOTE = L(
  "Proyeksi proposal berdasarkan asumsi pemodelan — bukan kinerja aktual, harga resmi, atau komitmen Terang AI.",
  "Proposal projections based on modelling assumptions — not Terang AI's actual performance, official prices or commitments.",
);

export type StrategyKey = "one" | "ace";

export const IMPLEMENTATION: Record<StrategyKey, { months: number; projectionMonths: number; summary: Bilingual }> = {
  one: {
    months: 12,
    projectionMonths: 36,
    summary: L(
      "12 bulan implementasi awal, lalu bulan 13–36 untuk retensi, akuisisi lanjutan, dan _scaling_.",
      "A 12-month initial implementation, then months 13–36 for retention, further acquisition and scaling.",
    ),
  },
  ace: {
    months: 18,
    projectionMonths: 48,
    summary: L(
      "18 bulan implementasi awal, lalu optimasi portofolio, komersialisasi, dan ekspansi hingga bulan 48.",
      "An 18-month initial implementation, then portfolio optimisation, commercialisation and expansion up to month 48.",
    ),
  },
};

/** Team time split in FTE (7 people in total). FTE is time allocation, not extra hiring. */
export const FTE_TARGET: Record<StrategyKey, { interview: number; events: number; shared: number; note: Bilingual }> = {
  one: {
    interview: 5.6,
    events: 0,
    shared: 1.4,
    note: L(
      "≈80% kapasitas untuk AI Candidate Interview; ≈20% untuk operasional bersama & _maintenance_ layanan lain.",
      "≈80% of capacity on AI Candidate Interview; ≈20% on shared operations & maintenance of other services.",
    ),
  },
  ace: {
    interview: 3.15,
    events: 2.65,
    shared: 1.2,
    note: L(
      "3,15 FTE AI Candidate Interview · 2,65 FTE Terang Events · 1,20 FTE operasional bersama.",
      "3.15 FTE AI Candidate Interview · 2.65 FTE Terang Events · 1.20 FTE shared operations.",
    ),
  },
};

export interface KpiTarget {
  label: Txt;
  value: Txt;
  hint?: Txt;
}

export const KPI_TARGETS: Record<StrategyKey, { horizon: Txt; items: KpiTarget[]; quality?: KpiTarget[] }> = {
  one: {
    horizon: L("Target tahun pertama (M12)", "Year-one targets (M12)"),
    items: [
      { label: L("_Lead_ B2B berkualitas", "Qualified B2B leads"), value: "180" },
      { label: L("Demo produk", "Product demos"), value: "90" },
      { label: L("_Pilot_ selesai", "Completed pilots"), value: "24" },
      { label: L("Kontrak baru", "New contracts signed"), value: "20" },
      { label: L("Akun _enterprise_ berbayar aktif", "Active paying enterprise accounts"), value: "18" },
    ],
    quality: [
      { label: L("Hemat waktu administrasi rekruter", "Recruiter admin time saved"), value: "≥ 30%", hint: L("divalidasi saat _pilot_", "validated during pilots") },
      { label: L("Kepuasan rekruter", "Recruiter satisfaction"), value: L("≥ 4,2 / 5", "≥ 4.2 / 5") },
    ],
  },
  ace: {
    horizon: L("Target akhir implementasi (M18)", "End-of-implementation targets (M18)"),
    items: [
      { label: L("Akun berbayar AI Candidate Interview", "Paying AI Candidate Interview accounts"), value: "10" },
      { label: L("_Organizer_ acara berbayar aktif", "Active paying event organizers"), value: "12" },
      { label: L("Akumulasi acara berbayar", "Cumulative paid events"), value: "30" },
      { label: L("_Pilot_ AI Interview selesai", "Completed AI Interview pilots"), value: "16" },
    ],
    quality: [
      { label: L("Evaluasi portofolio", "Portfolio evaluations"), value: L("Bulanan", "Monthly") },
      { label: L("_Decision gate_ portofolio", "Portfolio decision gates"), value: L("Kuartalan", "Quarterly") },
    ],
  },
};

export interface FinancialRow {
  key: "revenue" | "cost" | "surplus" | "roi" | "npv" | "irr" | "payback";
  label: Txt;
  one: Txt;
  ace: Txt;
  hint?: Txt;
}

export const FINANCIAL_PROJECTION: FinancialRow[] = [
  { key: "revenue", label: L("Pendapatan", "Revenue"), one: L("≈ Rp8,45 M", "≈ Rp8.45 B"), ace: L("≈ Rp12,67 M", "≈ Rp12.67 B") },
  { key: "cost", label: L("Total biaya operasional", "Total operating costs"), one: L("≈ Rp6,65 M", "≈ Rp6.65 B"), ace: L("≈ Rp10,47 M", "≈ Rp10.47 B") },
  {
    key: "surplus",
    label: L("Akumulasi surplus", "Cumulative surplus"),
    one: L("≈ Rp1,80 M (operasional)", "≈ Rp1.80 B (operating)"),
    ace: L("≈ Rp1,72 M (setelah pajak)", "≈ Rp1.72 B (after tax)"),
  },
  {
    key: "roi",
    label: L("_Return on total costs_", "Return on total costs"),
    one: L("≈ 27,1%", "≈ 27.1%"),
    ace: L("≈ 16,4%", "≈ 16.4%"),
    hint: L("Surplus ÷ total biaya operasional — bukan imbal hasil ekuitas.", "Surplus ÷ total operating costs — not return on equity."),
  },
  {
    key: "npv",
    label: L("NPV (diskonto 15%/tahun)", "NPV (15% annual discount)"),
    one: L("≈ +Rp676,6 jt", "≈ +Rp676.6 M"),
    ace: L("≈ +Rp235 jt", "≈ +Rp235 M"),
    hint: L("Berubah bila tingkat diskonto berubah.", "Changes if the discount rate changes."),
  },
  { key: "irr", label: L("IRR efektif tahunan", "Effective annual IRR"), one: "≈ 48%", ace: L("≈ 21,4%", "≈ 21.4%") },
  {
    key: "payback",
    label: L("_Payback_ nominal", "Nominal payback"),
    one: L("≈ 28,7 bulan", "≈ 28.7 months"),
    ace: L("≈ 41,3 bulan", "≈ 41.3 months"),
    hint: L("Bulan saat akumulasi arus kas model menjadi positif.", "The month cumulative modelled cash flow turns positive."),
  },
];

export const FINANCIAL_CAVEATS: Bilingual[] = [
  L(
    "Horizon berbeda (36 vs 48 bulan) dan definisi surplus berbeda (operasional vs setelah pajak) — bandingkan secara indikatif.",
    "Different horizons (36 vs 48 months) and surplus definitions (operating vs after tax) — compare indicatively.",
  ),
  L(
    "Hasil bergantung pada harga, akuisisi, retensi, volume acara berbayar, dan efisiensi operasional. Profitabilitas tidak dijamin.",
    "Results depend on pricing, acquisition, retention, paid-event volume and operating efficiency. Profitability is not guaranteed.",
  ),
];

export interface PricingTier {
  id: "starter" | "growth" | "enterprise";
  name: string;
  monthly: number;
  fit: Bilingual;
}

/** Proposed AI Candidate Interview plans — identical in ONE and ACE for a fair comparison. */
export const PRICING_TIERS: PricingTier[] = [
  { id: "starter", name: "Starter", monthly: 3_900_000, fit: L("Tim HR yang mulai menstandarkan _screening_.", "HR teams starting to standardise screening.") },
  { id: "growth", name: "Growth", monthly: 9_900_000, fit: L("Perusahaan dengan rekrutmen _entry-level_ rutin.", "Companies with routine entry-level hiring.") },
  { id: "enterprise", name: "Enterprise", monthly: 20_900_000, fit: L("Volume tinggi, agensi rekrutmen, kebutuhan tata kelola.", "High volume, recruitment agencies, governance needs.") },
];

export interface Initiative {
  name: string;
  description: Bilingual;
}

export const ONE_GROWTH_INITIATIVES: Initiative[] = [
  {
    name: "HR Efficiency Clinic",
    description: L(
      "Sesi _discovery_ terstruktur untuk menemukan hambatan dan inefisiensi proses rekrutmen.",
      "Structured discovery sessions that surface recruitment bottlenecks and workflow inefficiencies.",
    ),
  },
  {
    name: "Terang Pilot Challenge",
    description: L(
      "_Pilot enterprise_ terbatas yang mengukur kualitas, efisiensi, dan nilai bagi pelanggan.",
      "Limited enterprise pilots that measure quality, efficiency and customer value.",
    ),
  },
  {
    name: "Verified Impact Stories",
    description: L(
      "Studi kasus berbasis persetujuan, disusun dari hasil _pilot_ yang terverifikasi.",
      "Consent-based case studies built from verified pilot results.",
    ),
  },
];

export const ACE_EVENTS_REVENUE: Initiative[] = [
  {
    name: "Event Platform Fee",
    description: L("Biaya paket acara ditambah biaya platform per transaksi registrasi.", "An event package fee plus a platform fee per registration transaction."),
  },
  {
    name: "Managed Event Boost",
    description: L(
      "Layanan opsional pengelolaan promosi & kampanye acara. Belanja iklan pihak ketiga bukan pendapatan Terang AI.",
      "Optional managed event promotion & campaign support. Third-party ad spend is not Terang AI revenue.",
    ),
  },
  {
    name: "Organizer Pro Subscription",
    description: L("Langganan berulang untuk institusi dan _organizer_ acara rutin.", "A recurring subscription for institutions and repeat organizers."),
  },
];
