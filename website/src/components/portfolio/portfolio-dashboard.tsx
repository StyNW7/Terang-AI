"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Building2, Gauge, Layers, Percent, Repeat, Target, Wallet } from "lucide-react";
import type { ProductKey } from "@/types/common";
import type { ScenarioPreset } from "@/types/finance";
import { useScenarioStore } from "@/store/scenario-store";
import { useStrategyMode } from "@/hooks/use-strategy-mode";
import { computeStrategy, computeInterview, computeEvents } from "@/lib/finance";
import { DECISION_META, evaluateProduct, type PortfolioDecision } from "@/lib/portfolio-engine";
import { SCENARIO_PRESETS } from "@/data/scenarios";
import { ROADMAP } from "@/data/strategy";
import { formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { KpiCard } from "@/components/ui/kpi-card";
import { Segmented } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/misc";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES, tickIDR, noWrap } from "@/components/charts/chart-kit";
import { Funnel } from "@/components/strategy/funnel";
import { SourceLabel } from "@/components/shared/source-label";
import { DecisionGate } from "./decision-gate";
import { cn, safeDivide } from "@/lib/utils";

const DECISIONS: PortfolioDecision[] = ["scale", "optimize", "limit", "pause"];
const DECISION_BG: Record<PortfolioDecision, string> = {
  scale: "border-current/15 bg-success-soft/60",
  optimize: "border-current/15 bg-soft/70",
  limit: "border-current/15 bg-warning-soft/70",
  pause: "border-current/15 bg-danger-soft/60",
};

export function PortfolioDashboard() {
  const { mode } = useStrategyMode();
  const assumptions = useScenarioStore((s) => s.assumptions);
  const [lensOverride, setLensOverride] = useState<{ mode: string; lens: "one" | "ace" } | null>(null);
  const lens: "one" | "ace" = lensOverride && lensOverride.mode === mode ? lensOverride.lens : mode === "one" ? "one" : "ace";
  const setLens = (l: "one" | "ace") => setLensOverride({ mode, lens: l });
  const [gateProduct, setGateProduct] = useState<ProductKey>("interview");

  const r = useMemo(() => computeStrategy(lens, assumptions), [lens, assumptions]);
  const iv = useMemo(() => computeInterview(lens, assumptions), [lens, assumptions]);
  const ev = useMemo(() => computeEvents(lens, assumptions), [lens, assumptions]);
  const H = assumptions.shared.horizonMonths;

  const trend = useMemo(() => {
    const weights = Array.from({ length: H }, (_, i) => i + 1);
    const total = weights.reduce((a, b) => a + b, 0);
    const evExisting = 0.45; // existing organizers provide a flatter base
    return weights.map((w, i) => ({
      month: `B${i + 1}`,
      events: r.events.revenue * (evExisting / H + (1 - evExisting) * (w / total)),
      interview: r.interview.revenue * (w / total),
    }));
  }, [r, H]);

  const costPie = [
    { name: "Biaya tetap", value: r.fixedCosts, color: SERIES.navy },
    { name: "Pengembangan", value: r.developmentCosts, color: "#2f66e0" },
    { name: "Pemasaran & akuisisi", value: r.marketingCosts, color: "#39b7ff" },
    { name: "Overhead portofolio", value: r.portfolioOverhead, color: "#0c9fd8" },
    { name: "Biaya langsung produk", value: r.totalCosts - r.fixedCosts - r.developmentCosts - r.marketingCosts - r.portfolioOverhead, color: "#94a3b8" },
  ].filter((c) => c.value > 0);

  const evaluations = {
    interview: evaluateProduct({
      product: "interview",
      qualityScore: lens === "one" ? 80 : 74,
      conversion: iv.conversion,
      retention: assumptions.interview.renewalRate,
      contributionMargin: r.interview.contributionMargin,
      capacityUtilization: r.capacity.productUtilization,
      milestoneMisses: 0,
      privacyPass: true,
      safetyPass: true,
      validityPass: true,
    }),
    events: evaluateProduct({
      product: "events",
      qualityScore: lens === "one" ? 70 : 80,
      conversion: lens === "one" ? 0.3 : 0.48,
      retention: assumptions.events.organizerRetention,
      contributionMargin: r.events.contributionMargin,
      capacityUtilization: r.capacity.productUtilization,
      milestoneMisses: 0,
      privacyPass: true,
      safetyPass: true,
      validityPass: true,
    }),
  };

  const presetSens = (Object.keys(SCENARIO_PRESETS) as ScenarioPreset[]).map((k) => ({
    name: SCENARIO_PRESETS[k].label,
    value: computeStrategy(lens, SCENARIO_PRESETS[k].assumptions).operatingResult,
  }));

  const organizations = r.interview.customers + r.events.customers;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<SourceLabel type="illustrative-assumption" compact />}
        title="Portofolio & Keputusan"
        description="Metrik dihitung dari asumsi Simulator. Lensa mengikuti mode strategi aktif dan bisa diganti sementara."
        actions={
          <Segmented
            value={lens}
            onChange={setLens}
            items={[
              { id: "one", label: "Lensa ONE", icon: <Target className="h-3.5 w-3.5" /> },
              { id: "ace", label: "Lensa ACE", icon: <Layers className="h-3.5 w-3.5" /> },
            ]}
          />
        }
      />

      {lens === "one" && (
        <Callout tone="info" title="Lensa ONE">
          Terang Events tetap melayani {assumptions.shared.existingOrganizers} organizer existing (maintenance-only); seluruh pertumbuhan baru berasal dari AI Candidate Interview.
        </Callout>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard tone="one" label="Pendapatan Interview" value={r.interview.revenue} format="idrCompact" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard tone="sky" label="Pendapatan Events" value={r.events.revenue} format="idrCompact" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard tone="one" label="Kontribusi Interview" value={r.interview.contribution} format="idrCompact" icon={<Activity className="h-4 w-4" />} />
        <KpiCard tone="sky" label="Kontribusi Events" value={r.events.contribution} format="idrCompact" icon={<Activity className="h-4 w-4" />} />
        <KpiCard tone="brand" label="Organisasi aktif" value={organizations} icon={<Building2 className="h-4 w-4" />} />
        <KpiCard tone="brand" label="Konversi pilot" value={iv.conversion} format="percent" icon={<Percent className="h-4 w-4" />} />
        <KpiCard tone="brand" label="Repeat organizer" value={assumptions.events.organizerRetention} format="percent" icon={<Repeat className="h-4 w-4" />} />
        <KpiCard tone="navy" label="Hasil portofolio" value={r.operatingResult} format="idrCompact" icon={<Gauge className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <ChartFrame
          title="Tren pendapatan per bulan"
          description={`Distribusi ilustratif ${H} bulan dengan ramp-up pelanggan.`}
          legend={[
            { label: "Terang Events", color: SERIES.events },
            { label: "AI Candidate Interview", color: SERIES.interview },
          ]}
          table={{ columns: ["Bulan", "Events", "Interview"], rows: trend.map((t) => [t.month, formatIDRCompact(t.events), formatIDRCompact(t.interview)]) }}
          height={270}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="pfEv" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={SERIES.events} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={SERIES.events} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="pfIv" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={SERIES.interview} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={SERIES.interview} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="month" {...AXIS_PROPS} />
              <YAxis width={86} tickFormatter={tickIDR} {...AXIS_PROPS} />
              <Tooltip content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
              <Area type="monotone" dataKey="events" name="Terang Events" stackId="r" stroke={SERIES.events} strokeWidth={2} fill="url(#pfEv)" />
              <Area type="monotone" dataKey="interview" name="AI Candidate Interview" stackId="r" stroke={SERIES.interview} strokeWidth={2} fill="url(#pfIv)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title="Alokasi biaya portofolio"
          description={`Total ${formatIDRCompact(r.totalCosts)} · konsumsi anggaran ${formatPercent(r.budgetConsumption)}`}
          legend={costPie.map((c) => ({ label: c.name, color: c.color }))}
          table={{ columns: ["Komponen", "Nilai", "Porsi"], rows: costPie.map((c) => [c.name, formatIDRCompact(c.value), formatPercent(safeDivide(c.value, r.totalCosts))]) }}
          height={270}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={costPie} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="var(--color-card)" strokeWidth={2}>
                {costPie.map((c) => (
                  <Cell key={c.name} fill={c.color} />
                ))}
              </Pie>
              <Tooltip content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartFrame
          title="Kontribusi per produk"
          legend={[
            { label: "Pendapatan", color: "#94a3b8" },
            { label: "Kontribusi", color: SERIES.interview },
          ]}
          table={{ columns: ["Produk", "Pendapatan", "Kontribusi"], rows: [["Events", formatIDRCompact(r.events.revenue), formatIDRCompact(r.events.contribution)], ["Interview", formatIDRCompact(r.interview.revenue), formatIDRCompact(r.interview.contribution)]] }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Events", pendapatan: r.events.revenue, kontribusi: r.events.contribution },
                { name: "Interview", pendapatan: r.interview.revenue, kontribusi: r.interview.contribution },
              ]}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis width={86} tickFormatter={tickIDR} {...AXIS_PROPS} />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
              <Bar dataKey="pendapatan" name="Pendapatan" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="kontribusi" name="Kontribusi" fill={SERIES.interview} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title="Utilisasi sumber daya"
          description="Jam dibutuhkan ÷ jam tersedia per bulan."
          table={{ columns: ["Tim", "Utilisasi"], rows: [["Product", formatPercent(r.capacity.productUtilization)], ["Strategy & Ops", formatPercent(r.capacity.opsUtilization)]] }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { team: "Product", value: r.capacity.productUtilization },
                { team: "Strategy & Ops", value: r.capacity.opsUtilization },
              ]}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke={SERIES.grid} />
              <XAxis type="number" domain={[0, 1.2]} tickFormatter={(v: number) => formatPercent(v)} {...AXIS_PROPS} />
              <YAxis type="category" dataKey="team" width={112} tickFormatter={noWrap} {...AXIS_PROPS} />
              <ReferenceLine x={0.9} stroke="#e2930f" strokeDasharray="4 4" label={{ value: "90%", fontSize: 10, fill: "#9a5b00", position: "top" }} />
              <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="percent" />} />
              <Bar dataKey="value" name="Utilisasi" radius={[0, 4, 4, 0]} maxBarSize={26}>
                {[r.capacity.productUtilization, r.capacity.opsUtilization].map((v, i) => (
                  <Cell key={i} fill={v > 1 ? "#e0484d" : v > 0.9 ? "#e2930f" : SERIES.one} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title="Sensitivitas skenario"
          description={`Hasil operasional ${lens.toUpperCase()} pada tiga preset.`}
          table={{ columns: ["Preset", "Hasil operasional"], rows: presetSens.map((p) => [p.name, formatIDRCompact(p.value)]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={presetSens} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis width={86} tickFormatter={tickIDR} {...AXIS_PROPS} />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
              <Bar dataKey="value" name="Hasil operasional" fill={lens === "one" ? SERIES.one : SERIES.ace} radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-[15px] font-semibold text-ink">Funnel akuisisi — AI Candidate Interview</p>
          <Funnel
            className="mt-4"
            compact
            color="linear-gradient(90deg,#6f9cff,#2f66e0)"
            stages={[
              { label: "Demo", value: Math.round(iv.pilots / 0.45) },
              { label: "Pilot", value: Math.round(iv.pilots) },
              { label: "Pelanggan berbayar", value: iv.customers },
              { label: "Renewal", value: Math.round(iv.customers * assumptions.interview.renewalRate) },
            ]}
          />
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-[15px] font-semibold text-ink">Funnel akuisisi — Terang Events</p>
          {ev.newOrganizers > 0 ? (
            <Funnel
              className="mt-4"
              compact
              color="linear-gradient(90deg,#7fd3ff,#39b7ff)"
              stages={[
                { label: "Demo organizer", value: Math.round(ev.newOrganizers / 0.55) },
                { label: "Organizer baru", value: ev.newOrganizers },
                { label: "Event diluncurkan", value: Math.round(ev.units) },
                { label: "Organizer berulang", value: Math.round((ev.newOrganizers + assumptions.shared.existingOrganizers) * assumptions.events.organizerRetention) },
              ]}
            />
          ) : (
            <div className="mt-4 rounded-xl bg-surface p-4 text-sm text-muted-strong ring-1 ring-line">
              Tidak ada akuisisi organizer baru pada lensa ONE. {assumptions.shared.existingOrganizers} organizer existing menghasilkan ±{formatNumber(ev.units)} event.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
        <p className="text-[15px] font-semibold text-ink">Roadmap kuartalan · lensa {lens.toUpperCase()}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          {ROADMAP[lens].map((q) => (
            <div key={q.quarter} className="rounded-xl bg-surface p-4 ring-1 ring-line">
              <span className={cn("grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold text-white", lens === "one" ? "bg-one-gradient" : "bg-ace-gradient")}>{q.quarter}</span>
              <ul className="mt-3 space-y-1">
                {q.items.map((it) => (
                  <li key={it} className="text-[13px] text-ink">
                    • {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">Portfolio Decision Matrix</p>
          <h3 className="text-2xl font-semibold text-ink">Scale · Optimize · Limit · Pause / Reassess</h3>
          <p className="text-sm text-muted-strong">Posisi produk berdasarkan KPI simulasi saat ini. Klik produk untuk memeriksa kriterianya di bawah.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {DECISIONS.map((d) => {
            const products = (["interview", "events"] as const).filter((p) => evaluations[p].decision === d);
            return (
              <div key={d} className={cn("min-h-[150px] rounded-2xl border p-4", DECISION_BG[d])}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{DECISION_META[d].label}</p>
                  <Badge tone={DECISION_META[d].tone}>{lens === "one" ? DECISION_META[d].one : DECISION_META[d].ace}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-strong">{DECISION_META[d].description}</p>
                <div className="mt-3 space-y-2">
                  {products.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setGateProduct(p)}
                      className={cn("w-full rounded-xl bg-card p-2.5 text-left text-sm font-semibold text-ink ring-1 transition hover:shadow-soft", gateProduct === p ? "ring-brand" : "ring-line")}
                    >
                      {p === "interview" ? "AI Candidate Interview" : "Terang Events"}
                      <span className="block text-[11px] font-normal text-muted">
                        {evaluations[p].passed}/{evaluations[p].total} kriteria komersial
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-ink">Inspeksi kriteria: {gateProduct === "interview" ? "AI Candidate Interview" : "Terang Events"}</p>
            <Segmented
              size="sm"
              value={gateProduct}
              onChange={setGateProduct}
              items={[
                { id: "interview", label: "Interview" },
                { id: "events", label: "Events" },
              ]}
            />
          </div>
          <DecisionGate
            key={`${gateProduct}-${lens}-${Math.round(r.operatingResult / 1e6)}`}
            product={gateProduct}
            lens={lens}
            color={lens === "one" ? "#2251c9" : "#0c9fd8"}
            initial={{
              qualityScore: gateProduct === "interview" ? (lens === "one" ? 80 : 74) : lens === "one" ? 70 : 80,
              conversion: gateProduct === "interview" ? iv.conversion : lens === "one" ? 0.3 : 0.48,
              retention: gateProduct === "interview" ? assumptions.interview.renewalRate : assumptions.events.organizerRetention,
              contributionMargin: r[gateProduct].contributionMargin,
              capacityUtilization: r.capacity.productUtilization,
              milestoneMisses: 0,
              privacyPass: true,
              safetyPass: true,
              validityPass: true,
            }}
          />
        </div>
      </section>
    </div>
  );
}
