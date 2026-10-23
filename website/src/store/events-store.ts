"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EventItem, Participant, ParticipantRegistration, Submission } from "@/types/events";
import { SEED_EVENTS, SEED_PARTICIPANTS, SEED_SUBMISSIONS } from "@/data/events.mock";
import { demoStorage, storageKey } from "@/lib/persistence";
import { makeId } from "@/lib/utils";
import type { Txt } from "@/lib/i18n-core";

export type EventsRole = "organizer" | "participant";

interface EventsState {
  role: EventsRole;
  events: EventItem[];
  participants: Participant[];
  submissions: Submission[];
  registrations: ParticipantRegistration[];
  setRole: (role: EventsRole) => void;
  addEvent: (event: Omit<EventItem, "id">) => EventItem;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  duplicateEvent: (id: string, overrides: Partial<EventItem>) => EventItem | undefined;
  scoreSubmission: (id: string, criterionId: string, score: number) => void;
  setSubmissionStatus: (id: string, status: Submission["status"]) => void;
  assignReviewer: (id: string, reviewer: Txt) => void;
  setParticipantStatus: (id: string, status: Participant["status"]) => void;
  register: (reg: Omit<ParticipantRegistration, "registeredAt">) => void;
  submitWork: (eventId: string, submission: NonNullable<ParticipantRegistration["submission"]>) => void;
  reset: () => void;
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      role: "organizer",
      events: SEED_EVENTS,
      participants: SEED_PARTICIPANTS,
      submissions: SEED_SUBMISSIONS,
      registrations: [],
      setRole: (role) => set({ role }),
      addEvent: (event) => {
        const created: EventItem = { ...event, id: makeId("ev") };
        set((s) => ({ events: [created, ...s.events] }));
        return created;
      },
      updateEvent: (id, patch) => set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
      duplicateEvent: (id, overrides) => {
        const source = get().events.find((e) => e.id === id);
        if (!source) return undefined;
        // Configuration only — participant data, submissions and registrations are NOT copied.
        const copy: EventItem = {
          ...source,
          ...overrides,
          id: makeId("ev"),
          status: "draft",
          registered: 0,
          submissions: 0,
          views: 0,
          createdFrom: "repeat",
          sourceEventId: source.id,
          stages: (overrides.stages ?? source.stages).map((st) => ({ ...st, id: makeId("st") })),
          criteria: (overrides.criteria ?? source.criteria).map((c) => ({ ...c })),
        };
        set((s) => ({ events: [copy, ...s.events] }));
        return copy;
      },
      scoreSubmission: (id, criterionId, score) =>
        set((s) => ({
          submissions: s.submissions.map((sb) =>
            sb.id === id
              ? { ...sb, scores: { ...sb.scores, [criterionId]: Math.max(0, Math.min(100, score)) }, status: sb.status === "belum-dinilai" ? "dinilai" : sb.status }
              : sb,
          ),
        })),
      setSubmissionStatus: (id, status) => set((s) => ({ submissions: s.submissions.map((sb) => (sb.id === id ? { ...sb, status } : sb)) })),
      assignReviewer: (id, reviewer) => set((s) => ({ submissions: s.submissions.map((sb) => (sb.id === id ? { ...sb, reviewer } : sb)) })),
      setParticipantStatus: (id, status) => set((s) => ({ participants: s.participants.map((p) => (p.id === id ? { ...p, status } : p)) })),
      register: (reg) =>
        set((s) => ({
          registrations: [...s.registrations.filter((r) => r.eventId !== reg.eventId), { ...reg, registeredAt: new Date().toISOString() }],
          events: s.events.map((e) => (e.id === reg.eventId ? { ...e, registered: e.registered + 1 } : e)),
        })),
      submitWork: (eventId, submission) =>
        set((s) => ({
          registrations: s.registrations.map((r) => (r.eventId === eventId ? { ...r, submission } : r)),
          events: s.events.map((e) => (e.id === eventId ? { ...e, submissions: e.submissions + 1 } : e)),
        })),
      reset: () =>
        set({ events: SEED_EVENTS, participants: SEED_PARTICIPANTS, submissions: SEED_SUBMISSIONS, registrations: [] }),
    }),
    { name: storageKey("events"), storage: demoStorage, skipHydration: true },
  ),
);
