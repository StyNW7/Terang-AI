import type { ProductKey } from "@/types/common";

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
  label: string;
  value: string;
  target: string;
  pass: boolean;
  hard?: boolean;
}

export interface DecisionResult {
  decision: PortfolioDecision;
  criteria: Criterion[];
  reasons: string[];
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
  const convLabel = input.product === "interview" ? "Konversi pilot → berbayar" : "Aktivasi organizer";
  const retLabel = input.product === "interview" ? "Renewal perusahaan" : "Organizer berulang";

  const commercial: Criterion[] = [
    { id: "quality", label: "Skor kualitas produk", value: `${Math.round(input.qualityScore)}`, target: `≥ ${t.quality}`, pass: input.qualityScore >= t.quality },
    { id: "conversion", label: convLabel, value: pct(input.conversion), target: `≥ ${pct(t.conversion)}`, pass: input.conversion >= t.conversion },
    { id: "retention", label: retLabel, value: pct(input.retention), target: `≥ ${pct(t.retention)}`, pass: input.retention >= t.retention },
    { id: "margin", label: "Contribution margin", value: pct(input.contributionMargin), target: `≥ ${pct(t.margin)}`, pass: input.contributionMargin >= t.margin },
    { id: "capacity", label: "Utilisasi kapasitas", value: pct(input.capacityUtilization), target: `≤ ${pct(t.capacity)}`, pass: input.capacityUtilization <= t.capacity },
  ];

  const hard: Criterion[] =
    input.product === "interview"
      ? [
          { id: "privacy", label: "Privasi & perlindungan data", value: input.privacyPass ? "Lulus" : "Gagal", target: "Wajib lulus", pass: input.privacyPass, hard: true },
          { id: "safety", label: "Keamanan & tinjauan manusia", value: input.safetyPass ? "Lulus" : "Gagal", target: "Wajib lulus", pass: input.safetyPass, hard: true },
          { id: "validity", label: "Validitas rubrik penilaian", value: input.validityPass ? "Lulus" : "Gagal", target: "Wajib lulus", pass: input.validityPass, hard: true },
        ]
      : [{ id: "reliability", label: "Keandalan layanan event", value: input.safetyPass ? "Lulus" : "Gagal", target: "Wajib lulus", pass: input.safetyPass, hard: true }];

  const milestone: Criterion = {
    id: "milestone",
    label: "Milestone terlewat berturut-turut",
    value: `${input.milestoneMisses}`,
    target: "< 3",
    pass: input.milestoneMisses < 3,
  };

  const criteria = [...hard, ...commercial, milestone];
  const passed = commercial.filter((c) => c.pass).length;
  const reasons: string[] = [];

  const failedHard = hard.filter((c) => !c.pass);
  let decision: PortfolioDecision;
  if (failedHard.length > 0) {
    decision = "pause";
    reasons.push(`Hard gate gagal: ${failedHard.map((c) => c.label).join(", ")}. Kinerja komersial tidak dapat mengompensasi.`);
  } else if (!milestone.pass) {
    decision = "pause";
    reasons.push("Milestone terlewat 3 kali atau lebih secara berturut-turut.");
  } else if (passed === commercial.length) {
    decision = "scale";
    reasons.push("Seluruh kriteria kualitas, komersial, ekonomi, dan kapasitas terpenuhi.");
  } else if (passed >= 3) {
    decision = "optimize";
    reasons.push(`${passed} dari ${commercial.length} kriteria terpenuhi — perbaiki: ${commercial.filter((c) => !c.pass).map((c) => c.label.toLowerCase()).join(", ")}.`);
  } else if (passed >= 1) {
    decision = "limit";
    reasons.push(`Hanya ${passed} dari ${commercial.length} kriteria terpenuhi — intensitas pengembangan belum dibenarkan.`);
  } else {
    decision = "pause";
    reasons.push("Tidak ada kriteria komersial yang terpenuhi.");
  }
  return { decision, criteria, reasons, passed, total: commercial.length };
}

export const DECISION_META: Record<PortfolioDecision, { label: string; one: string; ace: string; description: string; tone: "success" | "brand" | "warning" | "danger" }> = {
  scale: { label: "Scale", one: "Scale", ace: "Invest more", description: "Kinerja kuat; kualitas, ekonomi, dan kapasitas memadai.", tone: "success" },
  optimize: { label: "Optimize", one: "Improve", ace: "Improve", description: "Produk menjanjikan dengan masalah yang dapat diperbaiki.", tone: "brand" },
  limit: { label: "Limit", one: "Improve", ace: "Reduce scope", description: "Kinerja belum membenarkan intensitas pengembangan saat ini.", tone: "warning" },
  pause: { label: "Pause / Reassess", one: "Pause / Revalidate", ace: "Pause investment", description: "Milestone gagal berulang atau risiko kritis belum terselesaikan.", tone: "danger" },
};
