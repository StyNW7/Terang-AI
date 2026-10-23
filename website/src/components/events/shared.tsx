import type { EventItem, EventStage, Participant, Submission, Transaction } from "@/types/events";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/data/events.mock";
import type { Tone } from "@/types/common";
import { T } from "@/lib/i18n";
import { L, type Bilingual } from "@/lib/i18n-core";

/** Fixed demo "today" keeps every simulation deterministic. */
export const DEMO_TODAY = "2026-10-21";

const STATUS_TONE: Record<EventItem["status"], Tone> = {
  draft: "neutral",
  published: "sky",
  registration: "brand",
  judging: "warning",
  completed: "success",
};

export const STAGE_TYPE_LABEL: Record<EventStage["type"], Bilingual> = {
  registrasi: L("Registrasi", "Registration"),
  submisi: L("Submisi", "Submission"),
  penjurian: L("Penjurian", "Judging"),
  pengumuman: L("Pengumuman", "Announcement"),
  acara: L("Hari acara", "Event day"),
};

export const REGISTRATION_STATUS_LABEL: Record<Participant["status"], Bilingual> = {
  terverifikasi: L("Terverifikasi", "Verified"),
  "menunggu-pembayaran": L("Menunggu pembayaran", "Awaiting payment"),
  lunas: L("Lunas", "Paid"),
  dibatalkan: L("Dibatalkan", "Cancelled"),
};

export const SUBMISSION_STATUS_LABEL: Record<Submission["status"], Bilingual> = {
  "belum-dinilai": L("Belum dinilai", "Not scored"),
  dinilai: L("Dinilai", "Scored"),
  final: L("Final", "Final"),
};

export const TRANSACTION_STATUS_LABEL: Record<Transaction["status"], Bilingual> = {
  berhasil: L("Berhasil", "Successful"),
  menunggu: L("Menunggu", "Pending"),
  refund: L("_Refund_", "Refunded"),
};

export const PAYMENT_METHOD_LABEL: Record<Transaction["method"], Bilingual> = {
  QRIS: L("QRIS", "QRIS"),
  "Virtual Account": L("_Virtual Account_", "Virtual Account"),
  "E-Wallet": L("_E-Wallet_", "E-Wallet"),
  Kartu: L("Kartu", "Card"),
};

export const MODE_LABEL: Record<EventItem["mode"], Bilingual> = {
  online: L("_Online_", "Online"),
  offline: L("_Offline_", "Offline"),
  hybrid: L("_Hybrid_", "Hybrid"),
};

export function EventStatusBadge({ status }: { status: EventItem["status"] }) {
  return (
    <Badge tone={STATUS_TONE[status]} dot>
      <T v={STATUS_LABEL[status]} />
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: EventItem["category"] }) {
  return (
    <Badge tone="neutral">
      <T v={CATEGORY_LABEL[category]} />
    </Badge>
  );
}

export function weightedScore(scores: Record<string, number>, criteria: EventItem["criteria"]) {
  const total = criteria.reduce((a, c) => a + c.weight, 0);
  if (!total) return 0;
  let sum = 0;
  for (const c of criteria) sum += (scores[c.id] ?? 0) * c.weight;
  return sum / total;
}
