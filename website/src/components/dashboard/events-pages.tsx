"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ListChecks, Plus, Sparkles } from "lucide-react";
import { EVENT_TEMPLATES } from "@/data/events.mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceLabel } from "@/components/shared/source-label";
import { OrganizerDashboard } from "@/components/events/organizer-dashboard";
import { EventsTable } from "@/components/events/events-table";
import { EventWizard, templateToValues } from "@/components/events/event-wizard";
import { TemplatesPanel } from "@/components/events/templates-panel";
import { RepeatPlanner } from "@/components/events/repeat-planner";
import { ParticipantsPanel } from "@/components/events/participants-panel";
import { JudgingPanel } from "@/components/events/judging-panel";
import { AnalyticsPanel } from "@/components/events/analytics-panel";
import { FinancePanel } from "@/components/events/finance-panel";
import { ParticipantExperience } from "@/components/events/participant-experience";
import { L, T, useI18n } from "@/lib/i18n";
import { PageHeader } from "./page-header";
import { AceOnlyNotice, ModeNotice } from "./mode-notice";
import { QuickStart } from "./quick-start";

const BASE = "/dashboard/events";
const ACE = (
  <Badge tone="ace">
    <T id="Usulan ACE" en="ACE proposal" />
  </Badge>
);
const DEMO = <SourceLabel type="synthetic-demo" compact />;

export function EventsOverviewPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        eyebrow={DEMO}
        title={<T id="Halo, Organizer Demo" en="Hello, Demo Organizer" />}
        description={<T id="Ringkasan semua _event_ Anda: peserta, submisi, dan tenggat terdekat." en="A summary of all your events: participants, submissions and upcoming deadlines." />}
        actions={
          <Button href={`${BASE}/create`}>
            <Plus className="h-4 w-4" /> <T id="Buat _event_" en="Create event" />
          </Button>
        }
      />
      <ModeNotice product="events" className="mb-6" />
      <QuickStart
        id="events"
        title={L("Mulai dari sini — alur _organizer_", "Start here — the organizer flow")}
        accent="bg-events-gradient"
        steps={[
          {
            title: L("Buat _event_", "Create an event"),
            text: L("Isi _wizard_ 6 langkah, atau mulai dari _template_ agar tahapan & rubrik terisi otomatis.", "Fill in the 6-step wizard, or start from a template so stages & rubrics are filled in automatically."),
            href: `${BASE}/templates`,
            icon: "plus",
          },
          {
            title: L("Kelola peserta", "Manage participants"),
            text: L("Verifikasi pendaftar dan ubah status pembayaran per peserta.", "Verify registrants and update each participant's payment status."),
            href: `${BASE}/participants`,
            icon: "users",
          },
          {
            title: L("Nilai submisi", "Score submissions"),
            text: L("Gunakan rubrik berbobot; peringkat diperbarui otomatis.", "Use weighted rubrics; the ranking updates automatically."),
            href: `${BASE}/judging`,
            icon: "gavel",
          },
          {
            title: L("Lihat dari sisi peserta", "See the participant side"),
            text: L("Coba daftar _event_, bayar (simulasi), dan kirim submisi.", "Try registering for an event, paying (simulated) and submitting work."),
            href: `${BASE}/portal`,
            icon: "ticket",
          },
        ]}
      />
      <OrganizerDashboard onOpenEvents={() => router.push(`${BASE}/list`)} />
    </>
  );
}

export function EventsListPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title={<T id="Daftar _event_" en="Event list" />}
        description={<T id="Cari, filter, dan kelola semua _event_. Duplikasi _event_ lama lewat Repeat Planner." en="Search, filter and manage every event. Duplicate past events with the Repeat Planner." />}
        actions={
          <Button href={`${BASE}/create`}>
            <Plus className="h-4 w-4" /> <T id="Buat _event_" en="Create event" />
          </Button>
        }
      />
      <EventsTable onCreate={() => router.push(`${BASE}/create`)} onDuplicate={(id) => router.push(`${BASE}/repeat?source=${id}`)} />
    </>
  );
}

export function EventsCreatePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();
  const template = EVENT_TEMPLATES.find((tpl) => tpl.id === params.get("template"));
  return (
    <>
      <PageHeader
        eyebrow={
          template ? (
            <Badge tone="ace" icon={<Sparkles className="h-3 w-3" />}>
              <T id="Dari _template_" en="From a template" />
            </Badge>
          ) : undefined
        }
        title={<T id="Buat _event_ baru" en="Create a new event" />}
        description={<T id="Enam langkah singkat: info dasar, jadwal, tahapan, penjurian, biaya, lalu tinjau." en="Six short steps: basics, schedule, stages, judging, fees, then review." />}
      />
      {!template && (
        <button
          type="button"
          onClick={() => router.push(`${BASE}/templates`)}
          className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-dashed border-ace/45 bg-ace-soft/60 p-4 text-left transition hover:bg-ace-soft"
        >
          <ListChecks className="h-5 w-5 shrink-0 text-ace-ink" />
          <span className="text-sm text-ink">
            <strong className="font-semibold">{t("Lebih cepat:", "Faster:")}</strong> {t("mulai dari", "start from")}{" "}
            <strong className="font-semibold">Smart Event Templates</strong> — {t("tahapan & rubrik langsung terisi.", "stages & rubrics are filled in instantly.")}
          </span>
        </button>
      )}
      <EventWizard
        key={template?.id ?? "manual"}
        initial={template ? templateToValues(template, t) : undefined}
        source={template ? "template" : "manual"}
        templateName={template?.name}
        onDone={() => router.push(`${BASE}/list`)}
      />
    </>
  );
}

export function EventsTemplatesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        eyebrow={ACE}
        title="Smart Event Templates"
        description={
          <T
            id="Pilih _template_ — tahapan, rubrik, biaya, dan kuota langsung terisi di _wizard_. Tetap bisa disesuaikan."
            en="Pick a template — stages, rubrics, fees and quota are filled into the wizard instantly. Everything stays editable."
          />
        }
      />
      <AceOnlyNotice feature="Smart Event Templates" className="mb-5" />
      <TemplatesPanel onUse={(tpl) => router.push(`${BASE}/create?template=${tpl.id}`)} />
    </>
  );
}

export function EventsRepeatPage() {
  const router = useRouter();
  const source = useSearchParams().get("source") ?? undefined;
  return (
    <>
      <PageHeader
        eyebrow={ACE}
        title="Repeat Event Planner"
        description={<T id="Salin konfigurasi _event_ sebelumnya dalam hitungan detik — tanpa menyalin data peserta." en="Copy a previous event's configuration in seconds — without copying participant data." />}
      />
      <AceOnlyNotice feature="Repeat Event Planner" className="mb-5" />
      <RepeatPlanner key={source ?? "default"} preselect={source} onDone={() => router.push(`${BASE}/list`)} />
    </>
  );
}

export function EventsParticipantsPage() {
  return (
    <>
      <PageHeader title={<T id="Peserta" en="Participants" />} description={<T id="Verifikasi pendaftar dan pantau status tiap peserta." en="Verify registrants and track each participant's status." />} />
      <ParticipantsPanel />
    </>
  );
}

export function EventsJudgingPage() {
  return (
    <>
      <PageHeader title={<T id="Penjurian" en="Judging" />} description={<T id="Nilai submisi dengan rubrik berbobot dan lihat peringkat secara langsung." en="Score submissions with weighted rubrics and watch the ranking live." />} />
      <JudgingPanel />
    </>
  );
}

export function EventsAnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow={
          <>
            {ACE}
            {DEMO}
          </>
        }
        title="Organizer Growth Insights"
        description={<T id="_Funnel_ registrasi, sumber konversi, aktivitas peserta, dan perbandingan _event_ berulang." en="Registration funnel, conversion sources, participant activity and recurring-event comparison." />}
      />
      <AceOnlyNotice feature="Organizer Growth Insights" className="mb-5" />
      <AnalyticsPanel />
    </>
  );
}

export function EventsFinancePage() {
  return (
    <>
      <PageHeader title={<T id="Keuangan" en="Finance" />} description={<T id="Transaksi registrasi, _refund_, dan estimasi dana yang diterima _organizer_." en="Registration transactions, refunds and the estimated funds the organizer receives." />} />
      <FinancePanel />
    </>
  );
}

export function EventsPortalPage() {
  return (
    <>
      <PageHeader
        eyebrow={
          <Badge tone="sky">
            <T id="Tampilan peserta" en="Participant view" />
          </Badge>
        }
        title={<T id="Portal Peserta" en="Participant Portal" />}
        description={<T id="Simulasikan alur peserta: cari _event_, daftar, lalu kirim submisi." en="Simulate the participant journey: find an event, register, then submit your work." />}
      />
      <ParticipantExperience />
    </>
  );
}
