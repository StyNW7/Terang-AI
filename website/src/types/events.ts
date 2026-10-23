import type { Txt } from "@/lib/i18n-core";

export type EventCategory = "kompetisi" | "konferensi" | "workshop" | "seminar";
export type EventStatus = "draft" | "published" | "registration" | "judging" | "completed";
export type RegistrationStatus = "terverifikasi" | "menunggu-pembayaran" | "lunas" | "dibatalkan";

export interface EventStage {
  id: string;
  name: Txt;
  date: string; // ISO date
  type: "registrasi" | "submisi" | "penjurian" | "pengumuman" | "acara";
}

export interface JudgingCriterion {
  id: string;
  name: Txt;
  weight: number; // percentage, totals 100
  description: Txt;
}

export interface EventItem {
  id: string;
  name: Txt;
  organizer: string;
  category: EventCategory;
  status: EventStatus;
  location: string;
  mode: "online" | "offline" | "hybrid";
  startDate: string;
  endDate: string;
  registrationClose: string;
  fee: number;
  quota: number;
  registered: number;
  submissions: number;
  views: number;
  description: Txt;
  stages: EventStage[];
  criteria: JudgingCriterion[];
  teamBased: boolean;
  createdFrom?: "template" | "repeat" | "manual" | "seed";
  sourceEventId?: string;
}

export interface Participant {
  id: string;
  name: string;
  institution: string;
  email: string;
  eventId: string;
  team?: string;
  status: RegistrationStatus;
  registeredAt: string;
  source: "Instagram" | "Kampus" | "Referral" | "Website" | "LinkedIn";
}

export interface Submission {
  id: string;
  eventId: string;
  team: string;
  title: Txt;
  submittedAt: string;
  reviewer: Txt;
  status: "belum-dinilai" | "dinilai" | "final";
  scores: Record<string, number>; // criterionId -> 0..100
}

export interface Transaction {
  id: string;
  eventId: string;
  payer: string;
  amount: number;
  method: "QRIS" | "Virtual Account" | "E-Wallet" | "Kartu";
  date: string;
  status: "berhasil" | "menunggu" | "refund";
}

export interface EventTemplate {
  id: string;
  name: string;
  category: EventCategory;
  description: Txt;
  icon: "trophy" | "presentation" | "wrench" | "mic";
  defaults: {
    durationDays: number;
    fee: number;
    quota: number;
    teamBased: boolean;
    mode: "online" | "offline" | "hybrid";
    stages: { name: Txt; type: EventStage["type"]; offsetDays: number }[];
    criteria: Omit<JudgingCriterion, "id">[];
    tasks: Txt[];
  };
}

export interface ParticipantRegistration {
  eventId: string;
  name: string;
  email: string;
  institution: string;
  team?: string;
  registeredAt: string;
  submission?: { title: string; summary: string; fileName?: string; submittedAt: string };
}
