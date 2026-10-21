import type { CapacityAllocation, CapacityIssue, PoolKey } from "@/types/operations";
import type { StrategyMode } from "@/types/common";
import { POOLS } from "@/data/team";
import { sum } from "./utils";

export const MIN_BUFFER = 10;
export const MIN_QA = 10;
export const MIN_MAINTENANCE = 5;
export const ACE_MIN_PRODUCT_SHARE = 15;
export const MIN_GOVERNANCE = 15;
export const MIN_COORDINATION = 10;

export function poolTotal(allocation: CapacityAllocation, pool: PoolKey) {
  return sum(Object.values(allocation[pool] ?? {}).map((v) => v ?? 0));
}

export function poolHours(pool: PoolKey, hoursPerPerson: number) {
  return POOLS[pool].headcount * hoursPerPerson;
}

/** Hours per product (Interview / Events) across pools — leadership reported separately. */
export function productHours(allocation: CapacityAllocation, hoursPerPerson: number) {
  const productPool = poolHours("product", hoursPerPerson);
  const opsPool = poolHours("ops", hoursPerPerson);
  const share = (pool: PoolKey, key: "interview" | "events") => (allocation[pool]?.[key] ?? 0) / 100;
  return {
    interview: { product: productPool * share("product", "interview"), ops: opsPool * share("ops", "interview") },
    events: { product: productPool * share("product", "events"), ops: opsPool * share("ops", "events") },
  };
}

export function validateAllocation(allocation: CapacityAllocation, mode: StrategyMode): CapacityIssue[] {
  const issues: CapacityIssue[] = [];
  (Object.keys(POOLS) as PoolKey[]).forEach((pool) => {
    const values = allocation[pool] ?? {};
    if (Object.values(values).some((v) => (v ?? 0) < 0)) {
      issues.push({ severity: "critical", pool, rule: "Nilai tidak boleh negatif", message: `${POOLS[pool].label}: terdapat alokasi negatif.` });
    }
    const total = poolTotal(allocation, pool);
    if (total > 100) {
      issues.push({
        severity: "critical",
        pool,
        rule: "Total alokasi ≤ 100% kapasitas produktif",
        message: `${POOLS[pool].label} dialokasikan ${total}% — melebihi kapasitas sebesar ${total - 100}%.`,
      });
    } else if (total < 85) {
      issues.push({
        severity: "info",
        pool,
        rule: "Pemanfaatan kapasitas",
        message: `${POOLS[pool].label}: ${100 - total}% kapasitas belum dialokasikan.`,
      });
    }
  });

  const product = allocation.product;
  const ops = allocation.ops;
  if ((product.buffer ?? 0) < MIN_BUFFER) {
    issues.push({ severity: "critical", pool: "product", rule: `Buffer insiden ≥ ${MIN_BUFFER}%`, message: "Tim Product tidak menyisakan buffer untuk insiden & dukungan pelanggan." });
  }
  if ((ops.buffer ?? 0) < MIN_BUFFER) {
    issues.push({ severity: "warning", pool: "ops", rule: `Buffer support ≥ ${MIN_BUFFER}%`, message: "Tim Strategy & Ops tidak menyisakan buffer untuk lonjakan support." });
  }
  if ((product.qa ?? 0) < MIN_QA) {
    issues.push({ severity: "warning", pool: "product", rule: `QA bersama ≥ ${MIN_QA}%`, message: "Kapasitas QA di bawah batas minimum — risiko kualitas rilis." });
  }
  if ((product.maintenance ?? 0) < MIN_MAINTENANCE) {
    issues.push({ severity: "warning", pool: "product", rule: `Maintenance ≥ ${MIN_MAINTENANCE}%`, message: "Layanan Terang Events existing membutuhkan maintenance minimum." });
  }

  if (mode === "one") {
    if ((product.events ?? 0) > 0) {
      issues.push({
        severity: "critical",
        pool: "product",
        rule: "ONE: Events maintenance-only",
        message: `ONE Strategy tidak mengembangkan Terang Events — ${product.events}% pengembangan Events harus dipindahkan.`,
      });
    }
    if ((ops.events ?? 0) > 15) {
      issues.push({ severity: "warning", pool: "ops", rule: "ONE: dukungan Events terbatas", message: "Dukungan operasional Events melebihi porsi layanan existing (maks. 15%)." });
    }
  }

  if (mode === "ace") {
    if ((product.interview ?? 0) < ACE_MIN_PRODUCT_SHARE || (product.events ?? 0) < ACE_MIN_PRODUCT_SHARE) {
      issues.push({
        severity: "warning",
        pool: "product",
        rule: `ACE: tiap produk ≥ ${ACE_MIN_PRODUCT_SHARE}%`,
        message: "ACE membutuhkan aktivitas bermakna pada kedua produk (minimal 15% kapasitas Product masing-masing).",
      });
    }
    if ((allocation.leadership.governance ?? 0) < MIN_GOVERNANCE) {
      issues.push({ severity: "warning", pool: "leadership", rule: `Tata kelola ≥ ${MIN_GOVERNANCE}%`, message: "Portofolio dua produk butuh waktu tata kelola & review rutin dari CEO/CPO." });
    }
    if ((ops.coordination ?? 0) < MIN_COORDINATION) {
      issues.push({ severity: "warning", pool: "ops", rule: `Koordinasi ≥ ${MIN_COORDINATION}%`, message: "Dua go-to-market membutuhkan kapasitas koordinasi yang eksplisit." });
    }
  }

  issues.push({
    severity: "info",
    pool: "leadership",
    rule: "Kapasitas tidak dapat dipertukarkan",
    message: "Jam CEO & CPO tidak dihitung sebagai jam engineering; kapasitas Product terpisah dari Strategy & Ops.",
  });
  return issues;
}

export function hasCriticalIssue(issues: CapacityIssue[]) {
  return issues.some((i) => i.severity === "critical");
}
