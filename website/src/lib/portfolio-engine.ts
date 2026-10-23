import type { ProductKey } from "@/types/common";
import { L, type Bilingual } from "@/lib/i18n-core";

export type PortfolioDecision = "scale" | "optimize" | "limit" | "pause";

export interface ProductKpiInput {
  product: ProductKey;
  qualityScore: number; // 0..100
  conversion: number; // 0..1 — pilot-to-paid (Interview) or organizer activation (Events)
  retention: number; // 0..1 — company renewal (Interview) or repeat organizer (Events)
  contributionMargin: number; // -1..1
  capacityUtilization: number; // 0..1.5
  milestoneMisses: number; // consecutive missed milestones
  privacyPass: boolean;
  safetyPass: boolean;
  validityPass: boolean;
}

export interface Criterion {
  id: string;
  label: Bilingual;
  value: string | Bilingual;
  target: string | Bilingual;
  pass: boolean;
  hard?: boolean;
}

export interface DecisionResult {
  decision: PortfolioDecision;
  criteria: Criterion[];
  reasons: Bilingual[];
  passed: number;
  total: number;
}

export const THRESHOLDS: Record<ProductKey, { quality: number; conversion: number; retention: number; margin: number; capacity: number }> = {
  interview: { quality: 75, conversion: 0.3, retention: 0.65, margin: 0.35, capacity: 0.9 },
  events: { quality: 75, conversion: 0.4, retention: 0.5, margin: 0.3, capacity: 0.9 },
};

const pct = (v: number) => `${Math.round(v * 100)}%`;

export function evaluateProduct(input: ProductKpiInput): DecisionResult {
  const t = THRESHOLDS[input.product];
  const convLabel = input.product === "interview" ? L("Konversi _pilot_ → berbayar", "Pilot → paid conversion") : L("Aktivasi _organizer_", "Organizer activation");
  const retLabel = input.product === "interview" ? L("_Renewal_ perusahaan", "Company renewals") : L("_Organizer_ berulang", "Repeat organizers");
  const pass = (ok: boolean) => (ok ? L("Lulus", "Pass") : L("Gagal", "Fail"));
  const mustPass = L("Wajib lulus", "Must pass");

  const commercial: Criterion[] = [
    { id: "quality", label: L("Skor kualitas produk", "Product quality score"), value: `${Math.round(input.qualityScore)}`, target: `≥ ${t.quality}`, pass: input.qualityScore >= t.quality },
    { id: "conversion", label: convLabel, value: pct(input.conversion), target: `≥ ${pct(t.conversion)}`, pass: input.conversion >= t.conversion },
    { id: "retention", label: retLabel, value: pct(input.retention), target: `≥ ${pct(t.retention)}`, pass: input.retention >= t.retention },
    { id: "margin", label: L("_Contribution margin_", "Contribution margin"), value: pct(input.contributionMargin), target: `≥ ${pct(t.margin)}`, pass: input.contributionMargin >= t.margin },
    { id: "capacity", label: L("Utilisasi kapasitas", "Capacity utilisation"), value: pct(input.capacityUtilization), target: `≤ ${pct(t.capacity)}`, pass: input.capacityUtilization <= t.capacity },
  ];

  const hard: Criterion[] =
    input.product === "interview"
      ? [
          { id: "privacy", label: L("Privasi & perlindungan data", "Privacy & data protection"), value: pass(input.privacyPass), target: mustPass, pass: input.privacyPass, hard: true },
          { id: "safety", label: L("Keamanan & tinjauan manusia", "Safety & human review"), value: pass(input.safetyPass), target: mustPass, pass: input.safetyPass, hard: true },
          { id: "validity", label: L("Validitas rubrik penilaian", "Assessment-rubric validity"), value: pass(input.validityPass), target: mustPass, pass: input.validityPass, hard: true },
        ]
      : [{ id: "reliability", label: L("Keandalan layanan _event_", "Event-service reliability"), value: pass(input.safetyPass), target: mustPass, pass: input.safetyPass, hard: true }];

  const milestone: Criterion = {
    id: "milestone",
    label: L("_Milestone_ terlewat berturut-turut", "Consecutive missed milestones"),
    value: `${input.milestoneMisses}`,
    target: "< 3",
    pass: input.milestoneMisses < 3,
  };

  const criteria = [...hard, ...commercial, milestone];
  const passed = commercial.filter((c) => c.pass).length;
  const reasons: Bilingual[] = [];
  const lower = (c: Criterion) => ({ id: c.label.id.toLowerCase(), en: c.label.en.toLowerCase() });

  const failedHard = hard.filter((c) => !c.pass);
  let decision: PortfolioDecision;
  if (failedHard.length > 0) {
    decision = "pause";
    reasons.push(
      L(
        `_Hard gate_ gagal: ${failedHard.map((c) => c.label.id).join(", ")}. Kinerja komersial tidak dapat mengompensasi.`,
        `Hard gate failed: ${failedHard.map((c) => c.label.en).join(", ")}. Commercial performance cannot compensate.`,
      ),
    );
  } else if (!milestone.pass) {
    decision = "pause";
    reasons.push(L("_Milestone_ terlewat 3 kali atau lebih secara berturut-turut.", "Milestones missed 3 or more times in a row."));
  } else if (passed === commercial.length) {
    decision = "scale";
    reasons.push(L("Seluruh kriteria kualitas, komersial, ekonomi, dan kapasitas terpenuhi.", "All quality, commercial, economic and capacity criteria are met."));
  } else if (passed >= 3) {
    decision = "optimize";
    const failing = commercial.filter((c) => !c.pass).map(lower);
    reasons.push(
      L(
        `${passed} dari ${commercial.length} kriteria terpenuhi — perbaiki: ${failing.map((f) => f.id).join(", ")}.`,
        `${passed} of ${commercial.length} criteria met — improve: ${failing.map((f) => f.en).join(", ")}.`,
      ),
    );
  } else if (passed >= 1) {
    decision = "limit";
    reasons.push(
      L(
        `Hanya ${passed} dari ${commercial.length} kriteria terpenuhi — intensitas pengembangan belum dibenarkan.`,
        `Only ${passed} of ${commercial.length} criteria met — the current development intensity is not yet justified.`,
      ),
    );
  } else {
    decision = "pause";
    reasons.push(L("Tidak ada kriteria komersial yang terpenuhi.", "No commercial criteria are met."));
  }
  return { decision, criteria, reasons, passed, total: commercial.length };
}

export const DECISION_META: Record<PortfolioDecision, { label: string; one: string; ace: string; description: Bilingual; tone: "success" | "brand" | "warning" | "danger" }> = {
  scale: { label: "Scale", one: "Scale", ace: "Invest more", description: L("Kinerja kuat; kualitas, ekonomi, dan kapasitas memadai.", "Strong performance; quality, economics and capacity are adequate."), tone: "success" },
  optimize: { label: "Optimize", one: "Improve", ace: "Improve", description: L("Produk menjanjikan dengan masalah yang dapat diperbaiki.", "A promising product with fixable issues."), tone: "brand" },
  limit: { label: "Limit", one: "Improve", ace: "Reduce scope", description: L("Kinerja belum membenarkan intensitas pengembangan saat ini.", "Performance does not yet justify the current development intensity."), tone: "warning" },
  pause: { label: "Pause / Reassess", one: "Pause / Revalidate", ace: "Pause investment", description: L("_Milestone_ gagal berulang atau risiko kritis belum terselesaikan.", "Repeated milestone failures or unresolved critical risks."), tone: "danger" },
};
