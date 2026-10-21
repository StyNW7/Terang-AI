"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  CalendarDays,
  Gavel,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Repeat,
  Sparkles,
  Ticket,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import type { EventTemplate } from "@/types/events";
import { useEventsStore } from "@/store/events-store";
import { useStrategyMode } from "@/hooks/use-strategy-mode";
import { Tabs, Segmented } from "@/components/ui/tabs";
import { Callout } from "@/components/ui/misc";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { OrganizerDashboard } from "./organizer-dashboard";
import { EventsTable } from "./events-table";
import { EventWizard, templateToValues, type EventFormValues } from "./event-wizard";
import { TemplatesPanel } from "./templates-panel";
import { RepeatPlanner } from "./repeat-planner";
import { ParticipantsPanel } from "./participants-panel";
import { JudgingPanel } from "./judging-panel";
import { AnalyticsPanel } from "./analytics-panel";
import { FinancePanel } from "./finance-panel";
import { ParticipantExperience } from "./participant-experience";

type OrgTab = "dashboard" | "events" | "create" | "templates" | "repeat" | "participants" | "judging" | "analytics" | "finance";

const ACE_BADGE = <span className="rounded-full bg-ace-soft px-1.5 py-0.5 text-[9.5px] font-bold text-[#0a7aa6]">ACE</span>;

export function EventsDemo() {
  const role = useEventsStore((s) => s.role);
  const setRole = useEventsStore((s) => s.setRole);
  const { mode } = useStrategyMode();
  const [tab, setTab] = useState<OrgTab>("dashboard");
  const [wizard, setWizard] = useState<{ key: number; initial?: EventFormValues; source: "manual" | "template"; templateName?: string }>({ key: 0, source: "manual" });
  const [repeatSource, setRepeatSource] = useState<string | undefined>();

  const openWizard = (initial?: EventFormValues, templateName?: string) => {
    setWizard((w) => ({ key: w.key + 1, initial, source: initial ? "template" : "manual", templateName }));
    setTab("create");
  };
  const applyTemplate = (t: EventTemplate) => openWizard(templateToValues(t), t.name);
  const openRepeat = (id?: string) => {
    setRepeatSource(id);
    setTab("repeat");
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#5fd0ff,#39b7ff_40%,#2f66e0)] p-6 text-white shadow-card sm:p-8">
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <Mascot name="events" size={150} className="absolute -bottom-6 right-4 hidden md:block" />
        <div className="relative max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ring-1 ring-white/25">EventTech · Interactive prototype</span>
            <SourceLabel type="synthetic-demo" dark />
          </div>
          <h2 className="mt-3 text-3xl font-extrabold">Terang Events</h2>
          <p className="mt-1 text-white/85">Kelola kompetisi, konferensi, workshop & seminar — dari setup hingga penjurian. Pilih peran untuk memulai.</p>
          <Segmented
            dark
            className="mt-5"
            value={role}
            onChange={setRole}
            items={[
              { id: "organizer", label: "Organizer", icon: <UserCog className="h-3.5 w-3.5" /> },
              { id: "participant", label: "Peserta", icon: <Ticket className="h-3.5 w-3.5" /> },
            ]}
          />
        </div>
      </div>

      {mode === "one" && (
        <Callout tone="warning" title="Mode ONE aktif — Terang Events maintenance-only">
          Fitur existing tetap berjalan. Smart Event Templates, Repeat Event Planner & Organizer Growth Insights adalah usulan ACE dan tidak
          dikembangkan dalam ONE Strategy.
        </Callout>
      )}
      {mode === "ace" && (
        <Callout tone="info" title="Mode ACE aktif — pengembangan selektif">
          Fitur berlabel <strong>ACE</strong> adalah usulan Agile Feature Development dengan batas WIP 1 inisiatif besar.
        </Callout>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {role === "organizer" ? (
            <div className="space-y-6">
              <Tabs<OrgTab>
                value={tab}
                onChange={setTab}
                items={[
                  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
                  { id: "events", label: "Event", icon: <CalendarDays className="h-4 w-4" /> },
                  { id: "create", label: "Buat Event", icon: <PlusCircle className="h-4 w-4" /> },
                  { id: "templates", label: "Template", icon: <Sparkles className="h-4 w-4" />, badge: ACE_BADGE },
                  { id: "repeat", label: "Repeat Planner", icon: <Repeat className="h-4 w-4" />, badge: ACE_BADGE },
                  { id: "participants", label: "Peserta", icon: <Users className="h-4 w-4" /> },
                  { id: "judging", label: "Penjurian", icon: <Gavel className="h-4 w-4" /> },
                  { id: "analytics", label: "Analitik", icon: <BarChart3 className="h-4 w-4" />, badge: ACE_BADGE },
                  { id: "finance", label: "Keuangan", icon: <Wallet className="h-4 w-4" /> },
                ]}
              />
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {tab === "dashboard" && <OrganizerDashboard onCreate={() => openWizard()} onOpenEvents={() => setTab("events")} />}
                  {tab === "events" && <EventsTable onCreate={() => openWizard()} onDuplicate={openRepeat} />}
                  {tab === "create" && (
                    <div className="space-y-4">
                      {!wizard.initial && (
                        <button
                          type="button"
                          onClick={() => setTab("templates")}
                          className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-ace/50 bg-ace-soft/50 p-4 text-left transition hover:bg-ace-soft"
                        >
                          <ListChecks className="h-5 w-5 text-ace" />
                          <span className="text-sm text-ink">
                            <strong>Tip:</strong> mulai lebih cepat dengan <strong>Smart Event Templates</strong> (usulan ACE) →
                          </span>
                        </button>
                      )}
                      <EventWizard key={wizard.key} initial={wizard.initial} source={wizard.source} templateName={wizard.templateName} onDone={() => setTab("events")} />
                    </div>
                  )}
                  {tab === "templates" && <TemplatesPanel onUse={applyTemplate} />}
                  {tab === "repeat" && <RepeatPlanner key={repeatSource ?? "default"} preselect={repeatSource} onDone={() => setTab("events")} />}
                  {tab === "participants" && <ParticipantsPanel />}
                  {tab === "judging" && <JudgingPanel />}
                  {tab === "analytics" && <AnalyticsPanel />}
                  {tab === "finance" && <FinancePanel />}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <ParticipantExperience />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
