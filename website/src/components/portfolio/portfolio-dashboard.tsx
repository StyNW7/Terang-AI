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
import { PhaseRoadmap } from "@/components/strategy/phase-roadmap";
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
import { useI18n } from "@/lib/i18n";

const DECISIONS: PortfolioDecision[] = ["scale", "optimize", "limit", "pause"];
const DECISION_BG: Record<PortfolioDecision, string> = {
  scale: "border-current/15 bg-success-soft/60",
  optimize: "border-current/15 bg-soft/70",
  limit: "border-current/15 bg-warning-soft/70",
  pause: "border-current/15 bg-danger-soft/60",
};

export function PortfolioDashboard() {
  const { mode } = useStrategyMode();
  const { t, tx } = useI18n();
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
      month: `${t("B", "M")}${i + 1}`,
      events: r.events.revenue * (evExisting / H + (1 - evExisting) * (w / total)),
      interview: r.interview.revenue * (w / total),
    }));
  }, [r, H, t]);

  const costPie = [
    { name: t("Biaya tetap", "Fixed costs"), value: r.fixedCosts, color: SERIES.navy },
    { name: t("Pengembangan", "Development"), value: r.developmentCosts, color: "#2f66e0" },
    { name: t("Pemasaran & akuisisi", "Marketing & acquisition"), value: r.marketingCosts, color: "#39b7ff" },
    { name: t("_Overhead_ portofolio", "Portfolio overhead"), value: r.portfolioOverhead, color: "#0c9fd8" },
    { name: t("Biaya langsung produk", "Direct product costs"), value: r.totalCosts - r.fixedCosts - r.developmentCosts - r.marketingCosts - r.portfolioOverhead, color: "#94a3b8" },
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
    name: t(SCENARIO_PRESETS[k].label),
    value: computeStrategy(lens, SCENARIO_PRESETS[k].assumptions).operatingResult,
  }));

  const organizations = r.interview.customers + r.events.customers;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<SourceLabel type="illustrative-assumption" compact />}
        title={t("Portofolio & Keputusan", "Portfolio & Decisions")}
        description={t(
          "Metrik dihitung dari asumsi Simulator. Lensa mengikuti mode strategi aktif dan bisa diganti sementara.",
          "Metrics are computed from the Simulator's assumptions. The lens follows the active strategy mode and can be switched temporarily.",
        )}
        actions={
          <Segmented
            value={lens}
            onChange={setLens}
            items={[
              { id: "one", label: t("Lensa ONE", "ONE lens"), icon: <Target className="h-3.5 w-3.5" /> },
              { id: "ace", label: t("Lensa ACE", "ACE lens"), icon: <Layers className="h-3.5 w-3.5" /> },
            ]}
          />
        }
      />

      {lens === "one" && (
        <Callout tone="info" title={t("Lensa ONE", "ONE lens")}>
          {tx(
            `Terang Events tetap melayani ${assumptions.shared.existingOrganizers} _organizer_ yang sudah ada (hanya _maintenance_); seluruh pertumbuhan baru berasal dari AI Candidate Interview.`,
            `Terang Events keeps serving ${assumptions.shared.existingOrganizers} existing organizers (maintenance-only); all new growth comes from AI Candidate Interview.`,
          )}
        </Callout>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard tone="one" label={t("Pendapatan Interview", "Interview revenue")} value={r.interview.revenue} format="idrCompact" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard tone="sky" label={t("Pendapatan Events", "Events revenue")} value={r.events.revenue} format="idrCompact" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard tone="one" label={t("Kontribusi Interview", "Interview contribution")} value={r.interview.contribution} format="idrCompact" icon={<Activity className="h-4 w-4" />} />
        <KpiCard tone="sky" label={t("Kontribusi Events", "Events contribution")} value={r.events.contribution} format="idrCompact" icon={<Activity className="h-4 w-4" />} />
        <KpiCard tone="brand" label={t("Organisasi aktif", "Active organisations")} value={organizations} icon={<Building2 className="h-4 w-4" />} />
        <KpiCard tone="brand" label={tx("Konversi _pilot_", "Pilot conversion")} value={iv.conversion} format="percent" icon={<Percent className="h-4 w-4" />} />
        <KpiCard tone="brand" label={tx("_Organizer_ berulang", "Repeat organizers")} value={assumptions.events.organizerRetention} format="percent" icon={<Repeat className="h-4 w-4" />} />
        <KpiCard tone="navy" label={t("Hasil portofolio", "Portfolio result")} value={r.operatingResult} format="idrCompact" icon={<Gauge className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <ChartFrame
          title={t("Tren pendapatan per bulan", "Monthly revenue trend")}
          description={t(`Distribusi ilustratif ${H} bulan dengan _ramp-up_ pelanggan.`, `An illustrative ${H}-month distribution with customer ramp-up.`)}
          legend={[
            { label: "Terang Events", color: SERIES.events },
            { label: "AI Candidate Interview", color: SERIES.interview },
          ]}
          table={{ columns: [t("Bulan", "Month"), "Events", "Interview"], rows: trend.map((m) => [m.month, formatIDRCompact(m.events), formatIDRCompact(m.interview)]) }}
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
          title={t("Alokasi biaya portofolio", "Portfolio cost allocation")}
          description={`Total ${formatIDRCompact(r.totalCosts)} · ${t("konsumsi anggaran", "budget consumption")} ${formatPercent(r.budgetConsumption)}`}
          legend={costPie.map((c) => ({ label: c.name, color: c.color }))}
          table={{ columns: [t("Komponen", "Component"), t("Nilai", "Value"), t("Porsi", "Share")], rows: costPie.map((c) => [c.name, formatIDRCompact(c.value), formatPercent(safeDivide(c.value, r.totalCosts))]) }}
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
          title={t("Kontribusi per produk", "Contribution by product")}
          legend={[
            { label: t("Pendapatan", "Revenue"), color: "#94a3b8" },
            { label: t("Kontribusi", "Contribution"), color: SERIES.interview },
          ]}
          table={{ columns: [t("Produk", "Product"), t("Pendapatan", "Revenue"), t("Kontribusi", "Contribution")], rows: [["Events", formatIDRCompact(r.events.revenue), formatIDRCompact(r.events.contribution)], ["Interview", formatIDRCompact(r.interview.revenue), formatIDRCompact(r.interview.contribution)]] }}
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
              <Bar dataKey="pendapatan" name={t("Pendapatan", "Revenue")} fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="kontribusi" name={t("Kontribusi", "Contribution")} fill={SERIES.interview} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title={t("Utilisasi sumber daya", "Resource utilisation")}
          description={t("Jam dibutuhkan ÷ jam tersedia per bulan.", "Hours required ÷ hours available per month.")}
          table={{ columns: [t("Tim", "Team"), t("Utilisasi", "Utilisation")], rows: [["Product", formatPercent(r.capacity.productUtilization)], ["Strategy & Ops", formatPercent(r.capacity.opsUtilization)]] }}
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
              <Bar dataKey="value" name={t("Utilisasi", "Utilisation")} radius={[0, 4, 4, 0]} maxBarSize={26}>
                {[r.capacity.productUtilization, r.capacity.opsUtilization].map((v, i) => (
                  <Cell key={i} fill={v > 1 ? "#e0484d" : v > 0.9 ? "#e2930f" : SERIES.one} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title={t("Sensitivitas skenario", "Scenario sensitivity")}
          description={t(`Hasil operasional ${lens.toUpperCase()} pada tiga _preset_.`, `${lens.toUpperCase()} operating result across the three presets.`)}
          table={{ columns: ["Preset", t("Hasil operasional", "Operating result")], rows: presetSens.map((p) => [p.name, formatIDRCompact(p.value)]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={presetSens} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis width={86} tickFormatter={tickIDR} {...AXIS_PROPS} />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
              <Bar dataKey="value" name={t("Hasil operasional", "Operating result")} fill={lens === "one" ? SERIES.one : SERIES.ace} radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-[15px] font-semibold text-ink">{tx("_Funnel_ akuisisi — AI Candidate Interview", "Acquisition funnel — AI Candidate Interview")}</p>
          <Funnel
            className="mt-4"
            compact
            color="linear-gradient(90deg,#6f9cff,#2f66e0)"
            stages={[
              { label: "Demo", value: Math.round(iv.pilots / 0.45) },
              { label: "Pilot", value: Math.round(iv.pilots) },
              { label: t("Pelanggan berbayar", "Paying customers"), value: iv.customers },
              { label: "Renewal", value: Math.round(iv.customers * assumptions.interview.renewalRate) },
            ]}
          />
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-[15px] font-semibold text-ink">{tx("_Funnel_ akuisisi — Terang Events", "Acquisition funnel — Terang Events")}</p>
          {ev.newOrganizers > 0 ? (
            <Funnel
              className="mt-4"
              compact
              color="linear-gradient(90deg,#7fd3ff,#39b7ff)"
              stages={[
                { label: t("Demo _organizer_", "Organizer demos"), value: Math.round(ev.newOrganizers / 0.55) },
                { label: t("_Organizer_ baru", "New organizers"), value: ev.newOrganizers },
                { label: t("_Event_ diluncurkan", "Events launched"), value: Math.round(ev.units) },
                { label: t("_Organizer_ berulang", "Repeat organizers"), value: Math.round((ev.newOrganizers + assumptions.shared.existingOrganizers) * assumptions.events.organizerRetention) },
              ]}
            />
          ) : (
            <div className="mt-4 rounded-xl bg-surface p-4 text-sm text-muted-strong ring-1 ring-line">
              {tx(
                `Tidak ada akuisisi _organizer_ baru pada lensa ONE. ${assumptions.shared.existingOrganizers} _organizer_ yang sudah ada menghasilkan ±${formatNumber(ev.units)} _event_.`,
                `No new organizers are acquired under the ONE lens. ${assumptions.shared.existingOrganizers} existing organizers generate ~${formatNumber(ev.units)} events.`,
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
        <p className="text-[15px] font-semibold text-ink">
          {lens === "one" ? tx("_Roadmap_ implementasi · ONE (12 bulan)", "Implementation roadmap · ONE (12 months)") : tx("_Roadmap_ implementasi · ACE (18 bulan)", "Implementation roadmap · ACE (18 months)")}
        </p>
        <PhaseRoadmap key={lens} strategy={lens} className="mt-4" />
      </div>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">{tx("_Portfolio Decision Matrix_", "Portfolio Decision Matrix")}</p>
          <h3 className="text-2xl font-semibold text-ink">Scale · Optimize · Limit · Hold / Pause</h3>
          <p className="text-sm text-muted-strong">
            {t("Posisi produk berdasarkan KPI simulasi saat ini. Klik produk untuk memeriksa kriterianya di bawah.", "Each product's position based on the current simulated KPIs. Click a product to inspect its criteria below.")}
          </p>
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
                <p className="mt-1 text-xs text-muted-strong">{tx(DECISION_META[d].description)}</p>
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
                        {evaluations[p].passed}/{evaluations[p].total} {t("kriteria komersial", "commercial criteria")}
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
            <p className="font-semibold text-ink">
              {t("Inspeksi kriteria:", "Criteria inspection:")} {gateProduct === "interview" ? "AI Candidate Interview" : "Terang Events"}
            </p>
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
