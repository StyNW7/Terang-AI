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
import { PageHeader } from "./page-header";

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
  const leader = one.operatingResult === ace.operatingResult ? null : one.operatingResult > ace.operatingResult ? "one" : "ace";
  const rows = [
    { label: "Pendapatan 12 bln", one: one.revenue, ace: ace.revenue, fmt: formatIDRCompact },
    { label: "Hasil operasional", one: one.operatingResult, ace: ace.operatingResult, fmt: formatIDRCompact },
    { label: "Utilisasi tim Product", one: one.capacity.productUtilization, ace: ace.capacity.productUtilization, fmt: (v: number) => formatPercent(v) },
  ];
  return (
    <div className={cn("rounded-2xl border border-line bg-card p-5 shadow-soft", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <Scale className="h-4 w-4 text-brand-ink" /> ONE vs ACE — skenario saat ini
          </p>
          <p className="mt-0.5 text-[13px] text-muted-strong">Dihitung dari asumsi Simulator yang sama.</p>
        </div>
        <SourceLabel type="illustrative-assumption" compact />
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[1.3fr_1fr_1fr] bg-subtle text-[12px] font-medium text-muted">
          <span className="px-3 py-2">Metrik</span>
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
              Pada asumsi ini <strong className={leader === "one" ? "text-one-ink" : "text-ace-ink"}>{leader.toUpperCase()}</strong> unggul{" "}
              <span className="tabular font-semibold text-ink">{formatIDRCompact(Math.abs(one.operatingResult - ace.operatingResult))}</span>.
            </>
          ) : (
            "Kedua strategi setara pada asumsi ini."
          )}
        </p>
        <Button href="/dashboard/simulator" size="sm" variant="secondary">
          Buka simulator <ArrowRight className="h-3.5 w-3.5" />
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
      status: mode === "one" ? { tone: "warning" as const, text: "Maintenance-only" } : mode === "ace" ? { tone: "ace" as const, text: "Dikembangkan selektif" } : null,
      stats: [
        { k: "Total event", v: formatNumber(ev.total) },
        { k: "Event aktif", v: formatNumber(ev.active) },
        { k: "Peserta", v: formatNumber(ev.registered) },
      ],
    },
    {
      key: "interview",
      name: "AI Candidate Interview",
      category: "HRTech",
      href: "/dashboard/interview",
      icon: Brain,
      accent: "bg-one-gradient",
      status: mode === "one" ? { tone: "one" as const, text: "Produk prioritas" } : mode === "ace" ? { tone: "ace" as const, text: "Bagian portofolio" } : null,
      stats: [
        { k: "Lowongan aktif", v: formatNumber(iv.open) },
        { k: "Kandidat", v: formatNumber(iv.candidates) },
        { k: "Menunggu tinjauan", v: formatNumber(iv.awaiting) },
      ],
    },
  ];

  const modules = [
    { href: "/dashboard/strategy", icon: SlidersHorizontal, title: "Kontrol Strategi", text: "Pilih mode ONE atau ACE untuk seluruh dashboard." },
    { href: "/dashboard/simulator", icon: Scale, title: "Simulator ONE vs ACE", text: "Uji asumsi & lihat dampak finansial 12 bulan." },
    { href: "/dashboard/operations", icon: Gauge, title: "Kapasitas & Operasional", text: "Alokasi jam tim, anggaran, dan sprint board." },
    { href: "/dashboard/portfolio", icon: ChartNoAxesCombined, title: "Portofolio & Keputusan", text: "KPI per produk dan decision gate." },
  ];

  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="navy">Super Admin</Badge>}
        title="Pusat kendali Terang AI"
        description="Satu tempat untuk memantau kedua produk dan menguji strategi ONE vs ACE."
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
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/75">Mode strategi aktif</p>
              <p className="font-display text-2xl font-semibold">{MODE_META[mode].label}</p>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-white/85">{MODE_META[mode].description}</p>
          <div className="flex flex-wrap gap-2">
            <Button href="/dashboard/strategy" variant="light" size="sm">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Ubah mode
            </Button>
            <Button href="/dashboard/simulator" variant="glass" size="sm">
              Bandingkan dampak <ArrowRight className="h-3.5 w-3.5" />
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
              <p className="text-[13px] text-muted-strong">Dashboard produk terpisah dengan fitur lengkap.</p>
              <Button href={p.href} size="sm" variant={p.key === "events" ? "ace" : "one"}>
                Buka <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_1fr]">
        <StrategySnapshot />
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-[15px] font-semibold text-ink">Alur kerja yang disarankan</p>
          <p className="mt-0.5 text-[13px] text-muted-strong">Ikuti urutan ini untuk sesi analisis yang runtut.</p>
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
const IMPACT: Record<StrategyMode, { events: string; interview: string; resources: string }> = {
  overview: {
    events: "Ditampilkan netral sebagai salah satu peluang.",
    interview: "Ditampilkan netral sebagai salah satu peluang.",
    resources: "Belum ada prioritas — gunakan untuk presentasi pembuka.",
  },
  one: {
    events: "Maintenance-only: layanan berjalan, tanpa fitur baru.",
    interview: "Seluruh pengembangan & akuisisi difokuskan di sini.",
    resources: "Kapasitas Product & Ops terpusat pada satu produk.",
  },
  ace: {
    events: "Fitur selektif: template, repeat planner, growth insights.",
    interview: "Workflow HR esensial dikembangkan bertahap.",
    resources: "Dua produk berbagi kapasitas dengan batas 1 inisiatif besar.",
  },
};

export function StrategyControlPage() {
  const { mode, setMode } = useStrategyMode();
  const strategy = mode === "ace" ? ACE_STRATEGY : mode === "one" ? ONE_STRATEGY : null;
  const options: { id: StrategyMode; title: string; sub: string }[] = [
    { id: "overview", title: "Overview", sub: "Netral" },
    { id: "one", title: "ONE Strategy", sub: "PRO · fokus satu produk" },
    { id: "ace", title: "ACE Strategy", sub: "KONTRA · dua produk terkoordinasi" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="navy">Super Admin</Badge>}
        title="Kontrol Strategi"
        description="Mode yang dipilih di sini berlaku untuk seluruh dashboard dan situs."
        actions={
          <InfoTip title="Bagaimana mode bekerja?" label="Cara kerja">
            Mode mengubah label prioritas, catatan, dan lensa analitik di dashboard Events, Interview, serta halaman strategi. Data demo tidak berubah.
          </InfoTip>
        }
      />

      <div role="radiogroup" aria-label="Mode strategi" className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                    <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                  </span>
                ) : (
                  <span className="text-xs font-medium text-muted">Pilih</span>
                )}
              </span>
              <span className="mt-4 text-lg font-semibold text-ink">{o.title}</span>
              <span className="text-[13px] text-muted-strong">{o.sub}</span>
              <span className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
                <span className="flex gap-2">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-events-ink" />
                  <span className="text-muted-strong">{IMPACT[o.id].events}</span>
                </span>
                <span className="flex gap-2">
                  <Brain className="mt-0.5 h-4 w-4 shrink-0 text-interview-ink" />
                  <span className="text-muted-strong">{IMPACT[o.id].interview}</span>
                </span>
                <span className="flex gap-2">
                  <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <span className="text-muted-strong">{IMPACT[o.id].resources}</span>
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
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{strategy.position}</p>
                <p className="mt-1 text-lg font-semibold text-ink">“{strategy.tagline}”</p>
              </div>
              <Button href={mode === "one" ? "/strategies/one" : "/strategies/ace"} size="sm" variant="secondary">
                Detail strategi <ArrowUpRight className="h-3.5 w-3.5" />
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
            <p className="text-[15px] font-semibold text-ink">Pilih ONE atau ACE untuk melihat tiga pilarnya.</p>
            <p className="text-[13px] text-muted-strong">Mode Overview cocok untuk membuka presentasi tanpa memihak.</p>
          </div>
        )}
        <StrategySnapshot />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-card p-5 shadow-soft">
        <p className="text-[15px] font-semibold text-ink">Kesiapan kapasitas per mode</p>
        <p className="mt-0.5 text-[13px] text-muted-strong">Utilisasi tim Product yang diproyeksikan model finansial. Di atas 90% berisiko.</p>
        <CapacityBars />
      </div>
    </>
  );
}

function CapacityBars() {
  const { one, ace } = useComparison();
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
              { label: "Tim Product", v: r.value },
              { label: "Tim Strategy & Ops", v: r.ops },
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
