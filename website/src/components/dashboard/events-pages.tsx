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
import { PageHeader } from "./page-header";
import { AceOnlyNotice, ModeNotice } from "./mode-notice";

const BASE = "/dashboard/events";
const ACE = <Badge tone="ace">Usulan ACE</Badge>;
const DEMO = <SourceLabel type="synthetic-demo" compact />;

export function EventsOverviewPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        eyebrow={DEMO}
        title="Halo, Organizer Demo"
        description="Ringkasan semua event Anda: peserta, submisi, dan tenggat terdekat."
        actions={
          <Button href={`${BASE}/create`}>
            <Plus className="h-4 w-4" /> Buat event
          </Button>
        }
      />
      <ModeNotice product="events" className="mb-6" />
      <OrganizerDashboard onOpenEvents={() => router.push(`${BASE}/list`)} />
    </>
  );
}

export function EventsListPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Daftar event"
        description="Cari, filter, dan kelola semua event. Duplikasi event lama lewat Repeat Planner."
        actions={
          <Button href={`${BASE}/create`}>
            <Plus className="h-4 w-4" /> Buat event
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
  const template = EVENT_TEMPLATES.find((t) => t.id === params.get("template"));
  return (
    <>
      <PageHeader
        eyebrow={template ? <Badge tone="ace" icon={<Sparkles className="h-3 w-3" />}>Dari template</Badge> : undefined}
        title="Buat event baru"
        description="Enam langkah singkat: info dasar, jadwal, tahapan, penjurian, biaya, lalu tinjau."
      />
      {!template && (
        <button
          type="button"
          onClick={() => router.push(`${BASE}/templates`)}
          className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-dashed border-ace/45 bg-ace-soft/60 p-4 text-left transition hover:bg-ace-soft"
        >
          <ListChecks className="h-5 w-5 shrink-0 text-ace-ink" />
          <span className="text-sm text-ink">
            <strong className="font-semibold">Lebih cepat:</strong> mulai dari <strong className="font-semibold">Smart Event Templates</strong> — tahapan &amp; rubrik
            langsung terisi.
          </span>
        </button>
      )}
      <EventWizard
        key={template?.id ?? "manual"}
        initial={template ? templateToValues(template) : undefined}
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
        description="Pilih template — tahapan, rubrik, biaya, dan kuota langsung terisi di wizard. Tetap bisa disesuaikan."
      />
      <AceOnlyNotice feature="Smart Event Templates" className="mb-5" />
      <TemplatesPanel onUse={(t) => router.push(`${BASE}/create?template=${t.id}`)} />
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
        description="Salin konfigurasi event sebelumnya dalam hitungan detik — tanpa menyalin data peserta."
      />
      <AceOnlyNotice feature="Repeat Event Planner" className="mb-5" />
      <RepeatPlanner key={source ?? "default"} preselect={source} onDone={() => router.push(`${BASE}/list`)} />
    </>
  );
}

export function EventsParticipantsPage() {
  return (
    <>
      <PageHeader title="Peserta" description="Verifikasi pendaftar dan pantau status tiap peserta." />
      <ParticipantsPanel />
    </>
  );
}

export function EventsJudgingPage() {
  return (
    <>
      <PageHeader title="Penjurian" description="Nilai submisi dengan rubrik berbobot dan lihat peringkat secara langsung." />
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
        description="Funnel registrasi, sumber konversi, aktivitas peserta, dan perbandingan event berulang."
      />
      <AceOnlyNotice feature="Organizer Growth Insights" className="mb-5" />
      <AnalyticsPanel />
    </>
  );
}

export function EventsFinancePage() {
  return (
    <>
      <PageHeader title="Keuangan" description="Transaksi registrasi, refund, dan estimasi dana yang diterima organizer." />
      <FinancePanel />
    </>
  );
}

export function EventsPortalPage() {
  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="sky">Tampilan peserta</Badge>}
        title="Portal Peserta"
        description="Simulasikan alur peserta: cari event, daftar, lalu kirim submisi."
      />
      <ParticipantExperience />
    </>
  );
}
