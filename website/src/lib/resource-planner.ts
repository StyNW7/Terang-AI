import type { CapacityAllocation, CapacityIssue, PoolKey } from "@/types/operations";
import type { StrategyMode } from "@/types/common";
import { POOLS } from "@/data/team";
import { sum } from "./utils";
import { L } from "./i18n-core";

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
      issues.push({
        severity: "critical",
        pool,
        rule: L("Nilai tidak boleh negatif", "Values cannot be negative"),
        message: L(`${POOLS[pool].label.id}: terdapat alokasi negatif.`, `${POOLS[pool].label.en}: has a negative allocation.`),
      });
    }
    const total = poolTotal(allocation, pool);
    if (total > 100) {
      issues.push({
        severity: "critical",
        pool,
        rule: L("Total alokasi ≤ 100% kapasitas produktif", "Total allocation ≤ 100% of productive capacity"),
        message: L(
          `${POOLS[pool].label.id} dialokasikan ${total}% — melebihi kapasitas sebesar ${total - 100}%.`,
          `${POOLS[pool].label.en} is allocated ${total}% — ${total - 100}% over capacity.`,
        ),
      });
    } else if (total < 85) {
      issues.push({
        severity: "info",
        pool,
        rule: L("Pemanfaatan kapasitas", "Capacity utilisation"),
        message: L(`${POOLS[pool].label.id}: ${100 - total}% kapasitas belum dialokasikan.`, `${POOLS[pool].label.en}: ${100 - total}% of capacity is unallocated.`),
      });
    }
  });

  const product = allocation.product;
  const ops = allocation.ops;
  if ((product.buffer ?? 0) < MIN_BUFFER) {
    issues.push({
      severity: "critical",
      pool: "product",
      rule: L(`_Buffer_ insiden ≥ ${MIN_BUFFER}%`, `Incident buffer ≥ ${MIN_BUFFER}%`),
      message: L("Tim _Product_ tidak menyisakan _buffer_ untuk insiden & dukungan pelanggan.", "The Product team leaves no buffer for incidents & customer support."),
    });
  }
  if ((ops.buffer ?? 0) < MIN_BUFFER) {
    issues.push({
      severity: "warning",
      pool: "ops",
      rule: L(`_Buffer support_ ≥ ${MIN_BUFFER}%`, `Support buffer ≥ ${MIN_BUFFER}%`),
      message: L("Tim _Strategy & Ops_ tidak menyisakan _buffer_ untuk lonjakan _support_.", "The Strategy & Ops team leaves no buffer for support spikes."),
    });
  }
  if ((product.qa ?? 0) < MIN_QA) {
    issues.push({
      severity: "warning",
      pool: "product",
      rule: L(`QA bersama ≥ ${MIN_QA}%`, `Shared QA ≥ ${MIN_QA}%`),
      message: L("Kapasitas QA di bawah batas minimum — risiko kualitas rilis.", "QA capacity is below the minimum — release-quality risk."),
    });
  }
  if ((product.maintenance ?? 0) < MIN_MAINTENANCE) {
    issues.push({
      severity: "warning",
      pool: "product",
      rule: L(`_Maintenance_ ≥ ${MIN_MAINTENANCE}%`, `Maintenance ≥ ${MIN_MAINTENANCE}%`),
      message: L("Layanan Terang Events yang sudah berjalan membutuhkan _maintenance_ minimum.", "The existing Terang Events service needs minimum maintenance."),
    });
  }

  if (mode === "one") {
    if ((product.events ?? 0) > 0) {
      issues.push({
        severity: "critical",
        pool: "product",
        rule: L("ONE: Events hanya _maintenance_", "ONE: Events maintenance-only"),
        message: L(
          `ONE Strategy tidak mengembangkan Terang Events — ${product.events}% pengembangan Events harus dipindahkan.`,
          `ONE Strategy does not develop Terang Events — the ${product.events}% Events development must be reassigned.`,
        ),
      });
    }
    if ((ops.events ?? 0) > 15) {
      issues.push({
        severity: "warning",
        pool: "ops",
        rule: L("ONE: dukungan Events terbatas", "ONE: limited Events support"),
        message: L("Dukungan operasional Events melebihi porsi layanan yang sudah berjalan (maks. 15%).", "Events operational support exceeds the existing-service share (max. 15%)."),
      });
    }
  }

  if (mode === "ace") {
    if ((product.interview ?? 0) < ACE_MIN_PRODUCT_SHARE || (product.events ?? 0) < ACE_MIN_PRODUCT_SHARE) {
      issues.push({
        severity: "warning",
        pool: "product",
        rule: L(`ACE: tiap produk ≥ ${ACE_MIN_PRODUCT_SHARE}%`, `ACE: each product ≥ ${ACE_MIN_PRODUCT_SHARE}%`),
        message: L(
          "ACE membutuhkan aktivitas bermakna pada kedua produk (minimal 15% kapasitas _Product_ masing-masing).",
          "ACE needs meaningful activity on both products (at least 15% of Product capacity each).",
        ),
      });
    }
    if ((allocation.leadership.governance ?? 0) < MIN_GOVERNANCE) {
      issues.push({
        severity: "warning",
        pool: "leadership",
        rule: L(`Tata kelola ≥ ${MIN_GOVERNANCE}%`, `Governance ≥ ${MIN_GOVERNANCE}%`),
        message: L("Portofolio dua produk butuh waktu tata kelola & _review_ rutin dari CEO/CPO.", "A two-product portfolio needs governance time & regular reviews from the CEO/CPO."),
      });
    }
    if ((ops.coordination ?? 0) < MIN_COORDINATION) {
      issues.push({
        severity: "warning",
        pool: "ops",
        rule: L(`Koordinasi ≥ ${MIN_COORDINATION}%`, `Coordination ≥ ${MIN_COORDINATION}%`),
        message: L("Dua _go-to-market_ membutuhkan kapasitas koordinasi yang eksplisit.", "Two go-to-market tracks need explicit coordination capacity."),
      });
    }
  }

  issues.push({
    severity: "info",
    pool: "leadership",
    rule: L("Kapasitas tidak dapat dipertukarkan", "Capacity is not interchangeable"),
    message: L(
      "Jam CEO & CPO tidak dihitung sebagai jam _engineering_; kapasitas _Product_ terpisah dari _Strategy & Ops_.",
      "CEO & CPO hours are not counted as engineering hours; Product capacity is separate from Strategy & Ops.",
    ),
  });
  return issues;
}

export function hasCriticalIssue(issues: CapacityIssue[]) {
  return issues.some((i) => i.severity === "critical");
}
