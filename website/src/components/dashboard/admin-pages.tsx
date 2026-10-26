"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChartNoAxesCombined,
  Compass,
  Gauge,
  Layers,
  Scale,
  SlidersHorizontal,
  Target,
  Trophy,
} from "lucide-react";
import type { StrategyMode } from "@/types/common";
import { ACE_STRATEGY, ONE_STRATEGY } from "@/data/strategy";
import { MODE_META, useStrategyMode } from "@/hooks/use-strategy-mode";
import { useScenarioStore } from "@/store/scenario-store";
import { useEventsStore } from "@/store/events-store";
import { useInterviewStore } from "@/store/interview-store";
import { computeBoth } from "@/lib/finance";
import { formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/misc";
import { InfoTip } from "@/components/ui/tooltip";
import { SourceLabel } from "@/components/shared/source-label";
import { Mascot } from "@/components/shared/brand";
import { cn } from "@/lib/utils";
import { L, useI18n, type Bilingual } from "@/lib/i18n";
import { PageHeader } from "./page-header";
import { ProposalSnapshot } from "@/components/strategy/proposal-targets";

const MODE_ICON = { overview: Compass, one: Target, ace: Layers } as const;

/* ------------------------------------------------------------------
   Shared: compact ONE vs ACE snapshot from the simulator assumptions
------------------------------------------------------------------- */
function useComparison() {
  const assumptions = useScenarioStore((s) => s.assumptions);
  return useMemo(() => computeBoth(assumptions), [assumptions]);
}

function StrategySnapshot({ className }: { className?: string }) {
  const { one, ace } = useComparison();
  const { mode } = useStrategyMode();
  const { t } = useI18n();
  const leader = one.operatingResult === ace.operatingResult ? null : one.operatingResult > ace.operatingResult ? "one" : "ace";
  const rows = [
    { label: t("Pendapatan 12 bln", "12-month revenue"), one: one.revenue, ace: ace.revenue, fmt: formatIDRCompact },
    { label: t("Hasil operasional", "Operating result"), one: one.operatingResult, ace: ace.operatingResult, fmt: formatIDRCompact },
    { label: t("Utilisasi tim Product", "Product team utilisation"), one: one.capacity.productUtilization, ace: ace.capacity.productUtilization, fmt: (v: number) => formatPercent(v) },
  ];
  return (
    <div className={cn("rounded-2xl border border-line bg-card p-5 shadow-soft", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <Scale className="h-4 w-4 text-brand-ink" /> {t("ONE vs ACE — skenario saat ini", "ONE vs ACE — current scenario")}
          </p>
          <p className="mt-0.5 text-[13px] text-muted-strong">{t("Dihitung dari asumsi Simulator yang sama.", "Computed from the same Simulator assumptions.")}</p>
        </div>
        <SourceLabel type="illustrative-assumption" compact />
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[1.3fr_1fr_1fr] bg-subtle text-[12px] font-medium text-muted">
          <span className="px-3 py-2">{t("Metrik", "Metric")}</span>
          <span className={cn("px-3 py-2", mode === "one" && "text-one-ink")}>ONE</span>
          <span className={cn("px-3 py-2", mode === "ace" && "text-ace-ink")}>ACE</span>
        </div>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[1.3fr_1fr_1fr] border-t border-line text-sm">
            <span className="px-3 py-2.5 text-muted-strong">{r.label}</span>
            <span className={cn("tabular px-3 py-2.5 font-semibold", r.one < 0 ? "text-danger-ink" : "text-ink")}>{r.fmt(r.one)}</span>
            <span className={cn("tabular px-3 py-2.5 font-semibold", r.ace < 0 ? "text-danger-ink" : "text-ink")}>{r.fmt(r.ace)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-muted-strong">
          {leader ? (
            <>
              {t("Pada asumsi ini", "Under these assumptions")}{" "}
              <strong className={leader === "one" ? "text-one-ink" : "text-ace-ink"}>{leader.toUpperCase()}</strong>{" "}
              {one.operatingResult < 0 && ace.operatingResult < 0 ? t("rugi lebih kecil", "loses less, by") : t("unggul", "leads by")}{" "}
              <span className="tabular font-semibold text-ink">{formatIDRCompact(Math.abs(one.operatingResult - ace.operatingResult))}</span>.{" "}
              {one.operatingResult < 0 && ace.operatingResult < 0 && t("Tahun pertama masih fase investasi.", "Year one is still an investment phase.")}
            </>
          ) : (
            t("Kedua strategi setara pada asumsi ini.", "Both strategies are level under these assumptions.")
          )}
        </p>
        <Button href="/dashboard/simulator" size="sm" variant="secondary">
          {t("Buka simulator", "Open simulator")} <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Overview
------------------------------------------------------------------- */
export function AdminOverviewPage() {
  const { mode } = useStrategyMode();
  const { t, tx } = useI18n();
  const events = useEventsStore((s) => s.events);
  const jobs = useInterviewStore((s) => s.jobs);
  const candidates = useInterviewStore((s) => s.candidates);
  const ModeIcon = MODE_ICON[mode];

  const ev = {
    total: events.length,
    active: events.filter((e) => e.status === "registration" || e.status === "judging" || e.status === "published").length,
    registered: events.reduce((a, e) => a + e.registered, 0),
  };
  const iv = {
    open: jobs.filter((j) => j.status === "aktif").length,
    candidates: candidates.length,
    awaiting: candidates.filter((c) => c.status === "selesai").length,
  };

  const products = [
    {
      key: "events",
      name: "Terang Events",
      category: "EventTech",
      href: "/dashboard/events",
      icon: CalendarDays,
      accent: "bg-events-gradient",
      status: mode === "one" ? { tone: "warning" as const, text: tx("Hanya _maintenance_", "Maintenance-only") } : mode === "ace" ? { tone: "ace" as const, text: t("Dikembangkan selektif", "Developed selectively") } : null,
      stats: [
        { k: t("Total _event_", "Total events"), v: formatNumber(ev.total) },
        { k: t("_Event_ aktif", "Active events"), v: formatNumber(ev.active) },
        { k: t("Peserta", "Participants"), v: formatNumber(ev.registered) },
      ],
    },
    {
      key: "interview",
      name: "AI Candidate Interview",
      category: "HRTech",
      href: "/dashboard/interview",
      icon: Brain,
      accent: "bg-one-gradient",
      status: mode === "one" ? { tone: "one" as const, text: t("Produk prioritas", "Priority product") } : mode === "ace" ? { tone: "ace" as const, text: t("Bagian portofolio", "Part of the portfolio") } : null,
      stats: [
        { k: t("Lowongan aktif", "Open vacancies"), v: formatNumber(iv.open) },
        { k: t("Kandidat", "Candidates"), v: formatNumber(iv.candidates) },
        { k: t("Menunggu tinjauan", "Awaiting review"), v: formatNumber(iv.awaiting) },
      ],
    },
  ];

  const modules = [
    { href: "/dashboard/strategy", icon: SlidersHorizontal, title: t("Kontrol Strategi", "Strategy Control"), text: tx("Pilih mode ONE atau ACE untuk seluruh _dashboard_.", "Choose the ONE or ACE mode for every dashboard.") },
    { href: "/dashboard/simulator", icon: Scale, title: t("Simulator ONE vs ACE", "ONE vs ACE Simulator"), text: t("Uji asumsi & lihat dampak finansial 12 bulan.", "Test assumptions & see the 12-month financial impact.") },
    { href: "/dashboard/operations", icon: Gauge, title: t("Kapasitas & Operasional", "Capacity & Operations"), text: tx("Alokasi jam tim, anggaran, dan _sprint board_.", "Team-hour allocation, budget and the sprint board.") },
    { href: "/dashboard/portfolio", icon: ChartNoAxesCombined, title: t("Portofolio & Keputusan", "Portfolio & Decisions"), text: tx("KPI per produk dan _decision gate_.", "Per-product KPIs and the decision gate.") },
  ];

  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="navy">Super Admin</Badge>}
        title={t("Pusat kendali Terang AI", "Terang AI control centre")}
        description={t("Satu tempat untuk memantau kedua produk dan menguji strategi ONE vs ACE.", "One place to monitor both products and test the ONE vs ACE strategies.")}
      />

      {/* Mode hero */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-card sm:p-7"
        style={{ backgroundImage: MODE_META[mode].gradient }}
      >
        <div className="bg-grid-dark absolute inset-0 opacity-40" />
        <Mascot name={mode === "one" ? "target" : mode === "ace" ? "puzzle" : "sparkle"} size={132} float={false} className="absolute -bottom-5 right-4 hidden sm:block" />
        <div className="relative flex max-w-2xl flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
              <ModeIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/75">{t("Mode strategi aktif", "Active strategy mode")}</p>
              <p className="font-display text-2xl font-semibold">{t(MODE_META[mode].label)}</p>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-white/85">{tx(MODE_META[mode].description)}</p>
          <div className="flex flex-wrap gap-2">
            <Button href="/dashboard/strategy" variant="light" size="sm">
              <SlidersHorizontal className="h-3.5 w-3.5" /> {t("Ubah mode", "Change mode")}
            </Button>
            <Button href="/dashboard/simulator" variant="glass" size="sm">
              {t("Bandingkan dampak", "Compare impact")} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Products */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {products.map((p) => (
          <div key={p.key} data-spotlight className="group flex flex-col rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={cn("grid h-11 w-11 place-items-center rounded-xl text-white shadow-soft", p.accent)}>
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted">{p.category}</p>
                  <p className="text-[17px] font-semibold text-ink">{p.name}</p>
                </div>
              </div>
              {p.status && <Badge tone={p.status.tone}>{p.status.text}</Badge>}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {p.stats.map((s) => (
                <div key={s.k} className="rounded-xl bg-subtle px-3 py-2.5 ring-1 ring-line">
                  <p className="text-xs text-muted">{s.k}</p>
                  <p className="tabular mt-0.5 font-display text-xl font-semibold text-ink">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <p className="text-[13px] text-muted-strong">{tx("_Dashboard_ produk terpisah dengan fitur lengkap.", "A separate, full-featured product dashboard.")}</p>
              <Button href={p.href} size="sm" variant={p.key === "events" ? "ace" : "one"}>
                {t("Buka", "Open")} <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ProposalSnapshot className="mt-6" />

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_1fr]">
        <StrategySnapshot />
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-[15px] font-semibold text-ink">{t("Alur kerja yang disarankan", "Suggested workflow")}</p>
          <p className="mt-0.5 text-[13px] text-muted-strong">{t("Ikuti urutan ini untuk sesi analisis yang runtut.", "Follow this order for a well-structured analysis session.")}</p>
          <ol className="mt-4 space-y-1">
            {modules.map((m, i) => (
              <li key={m.href}>
                <Link href={m.href} className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-neutral-soft">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-soft text-brand-ink">
                    <m.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <span className="tabular text-xs font-medium text-muted">0{i + 1}</span> {m.title}
                    </span>
                    <span className="block text-[13px] text-muted-strong">{m.text}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
   Strategy control
------------------------------------------------------------------- */
const IMPACT: Record<StrategyMode, { events: Bilingual; interview: Bilingual; resources: Bilingual }> = {
  overview: {
    events: L("Ditampilkan netral sebagai salah satu peluang.", "Shown neutrally as one of the opportunities."),
    interview: L("Ditampilkan netral sebagai salah satu peluang.", "Shown neutrally as one of the opportunities."),
    resources: L("Belum ada prioritas — gunakan untuk presentasi pembuka.", "No priority yet — use it to open a presentation."),
  },
  one: {
    events: L("Hanya _maintenance_: layanan berjalan, tanpa fitur baru.", "Maintenance-only: the service runs, with no new features."),
    interview: L("Seluruh pengembangan & akuisisi difokuskan di sini.", "All development & acquisition is focused here."),
    resources: L("Kapasitas _Product_ & _Ops_ terpusat pada satu produk.", "Product & Ops capacity is concentrated on one product."),
  },
  ace: {
    events: L("Fitur selektif: _template_, _repeat planner_, _growth insights_.", "Selective features: templates, repeat planner, growth insights."),
    interview: L("_Workflow_ HR esensial dikembangkan bertahap.", "Essential HR workflows are developed step by step."),
    resources: L("Dua produk berbagi kapasitas dengan batas 1 inisiatif besar.", "Two products share capacity, with a limit of 1 major initiative."),
  },
};

export function StrategyControlPage() {
  const { mode, setMode } = useStrategyMode();
  const { t, tx } = useI18n();
  const strategy = mode === "ace" ? ACE_STRATEGY : mode === "one" ? ONE_STRATEGY : null;
  const options: { id: StrategyMode; title: string; sub: string }[] = [
    { id: "overview", title: t("Netral", "Overview"), sub: t("Tanpa keberpihakan", "Neutral") },
    { id: "one", title: "ONE Strategy", sub: t("PRO · fokus satu produk", "PRO · one-product focus") },
    { id: "ace", title: "ACE Strategy", sub: t("KONTRA · dua produk terkoordinasi", "CONTRA · two coordinated products") },
  ];

  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="navy">Super Admin</Badge>}
        title={t("Kontrol Strategi", "Strategy Control")}
        description={tx("Mode yang dipilih di sini berlaku untuk seluruh _dashboard_ dan situs.", "The mode chosen here applies to every dashboard and the whole site.")}
        actions={
          <InfoTip title={t("Bagaimana mode bekerja?", "How do modes work?")} label={t("Cara kerja", "How it works")}>
            {tx(
              "Mode mengubah label prioritas, catatan, dan lensa analitik di _dashboard_ Events, Interview, serta halaman strategi. Data demo tidak berubah.",
              "A mode changes the priority labels, notes and analytical lens in the Events and Interview dashboards and on the strategy pages. Demo data does not change.",
            )}
          </InfoTip>
        }
      />

      <div role="radiogroup" aria-label={t("Mode strategi", "Strategy mode")} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {options.map((o) => {
          const active = mode === o.id;
          const Icon = MODE_ICON[o.id];
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMode(o.id)}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-card",
                active ? "border-transparent ring-2 ring-brand" : "border-line",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ backgroundImage: MODE_META[o.id].gradient }}>
                  <Icon className="h-5 w-5" />
                </span>
                {active ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success-ink">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t("Aktif", "Active")}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-muted">{t("Pilih", "Select")}</span>
                )}
              </span>
              <span className="mt-4 text-lg font-semibold text-ink">{o.title}</span>
              <span className="text-[13px] text-muted-strong">{o.sub}</span>
              <span className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
                <span className="flex gap-2">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-events-ink" />
                  <span className="text-muted-strong">{tx(IMPACT[o.id].events)}</span>
                </span>
                <span className="flex gap-2">
                  <Brain className="mt-0.5 h-4 w-4 shrink-0 text-interview-ink" />
                  <span className="text-muted-strong">{tx(IMPACT[o.id].interview)}</span>
                </span>
                <span className="flex gap-2">
                  <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <span className="text-muted-strong">{tx(IMPACT[o.id].resources)}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
        {strategy ? (
          <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{t(strategy.position)}</p>
                <p className="mt-1 text-lg font-semibold text-ink">“{strategy.tagline}”</p>
              </div>
              <Button href={mode === "one" ? "/strategies/one" : "/strategies/ace"} size="sm" variant="secondary">
                {t("Detail strategi", "Strategy details")} <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {strategy.pillars.map((p) => (
                <Link
                  key={p.key}
                  href={`/strategies/${mode}?pillar=${p.key}`}
                  className="group flex items-center gap-3 rounded-xl bg-subtle p-3 ring-1 ring-line transition hover:ring-brand/40"
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-lg font-display text-lg font-semibold text-white",
                      mode === "one" ? "bg-one-gradient" : "bg-ace-gradient",
                    )}
                  >
                    {p.letter}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{p.name}</span>
                    <span className="block text-[13px] leading-snug text-muted-strong">{p.program}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-start justify-center gap-3 rounded-2xl border border-dashed border-line-strong bg-subtle p-6">
            <Trophy className="h-6 w-6 text-brand-ink" />
            <p className="text-[15px] font-semibold text-ink">{t("Pilih ONE atau ACE untuk melihat tiga pilarnya.", "Choose ONE or ACE to see its three pillars.")}</p>
            <p className="text-[13px] text-muted-strong">{t("Mode Netral cocok untuk membuka presentasi tanpa memihak.", "Overview mode is ideal for opening a presentation without taking sides.")}</p>
          </div>
        )}
        <StrategySnapshot />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-card p-5 shadow-soft">
        <p className="text-[15px] font-semibold text-ink">{t("Kesiapan kapasitas per mode", "Capacity readiness by mode")}</p>
        <p className="mt-0.5 text-[13px] text-muted-strong">
          {tx("Utilisasi tim _Product_ yang diproyeksikan model finansial. Di atas 90% berisiko.", "Team utilisation projected by the financial model. Above 90% is risky.")}
        </p>
        <CapacityBars />
      </div>
    </>
  );
}

function CapacityBars() {
  const { one, ace } = useComparison();
  const { t } = useI18n();
  const rows = [
    { key: "ONE", value: one.capacity.productUtilization, ops: one.capacity.opsUtilization },
    { key: "ACE", value: ace.capacity.productUtilization, ops: ace.capacity.opsUtilization },
  ];
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      {rows.map((r) => (
        <div key={r.key} className="rounded-xl bg-subtle p-4 ring-1 ring-line">
          <p className="text-sm font-semibold text-ink">{r.key}</p>
          <div className="mt-3 space-y-3 text-[13px]">
            {[
              { label: t("Tim Product", "Product team"), v: r.value },
              { label: t("Tim Strategy & Ops", "Strategy & Ops team"), v: r.ops },
            ].map((x) => (
              <div key={x.label}>
                <div className="flex justify-between text-muted-strong">
                  <span>{x.label}</span>
                  <span className={cn("tabular font-semibold", x.v > 1 ? "text-danger-ink" : x.v > 0.9 ? "text-warning-ink" : "text-ink")}>{formatPercent(x.v)}</span>
                </div>
                <Progress value={x.v} tone="auto" className="mt-1.5" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
