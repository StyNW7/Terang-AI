"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Brain, CalendarDays, Gauge, Percent, Users, Wallet, Wrench } from "lucide-react";
import { useScenarioStore } from "@/store/scenario-store";
import { computeStrategy } from "@/lib/finance";
import { formatIDR, formatIDRCompact, formatPercent } from "@/lib/formatters";
import { safeDivide } from "@/lib/utils";
import { KpiCard } from "@/components/ui/kpi-card";
import { Callout, Progress } from "@/components/ui/misc";
import { InfoTip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES } from "@/components/charts/chart-kit";
import { DecisionGate } from "@/components/portfolio/decision-gate";
import { SourceLabel } from "@/components/shared/source-label";

export function OnePillarEvaluate() {
  const assumptions = useScenarioStore((s) => s.assumptions);
  const r = useMemo(() => computeStrategy("one", assumptions), [assumptions]);
  const iv = r.interview;
  const perInterview = {
    revenue: assumptions.interview.netRevenuePerInterview,
    variable: assumptions.interview.variableCostPerInterview,
    support: safeDivide(iv.supportCost, iv.units),
  };
  const contributionPerInterview = perInterview.revenue - perInterview.variable - perInterview.support;
  const unitData = [
    { name: "Pendapatan bersih", value: perInterview.revenue, kind: "pos" },
    { name: "Biaya variabel", value: -perInterview.variable, kind: "neg" },
    { name: "Dukungan langsung", value: -perInterview.support, kind: "neg" },
    { name: "Kontribusi", value: contributionPerInterview, kind: "total" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">ONE Growth Intelligence</p>
          <h3 className="text-2xl font-semibold text-ink">KPI produk & komersial ({assumptions.shared.horizonMonths} bulan)</h3>
        </div>
        <div className="flex items-center gap-2">
          <SourceLabel type="illustrative-assumption" />
          <Button href="/dashboard/simulator" size="sm" variant="secondary">
            Ubah asumsi
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <KpiCard tone="one" label="Pelanggan berbayar" value={iv.customers} icon={<Users className="h-4 w-4" />} />
        <KpiCard tone="one" label="Interview berbayar" value={iv.units} icon={<Brain className="h-4 w-4" />} />
        <KpiCard tone="one" label="Pendapatan Interview" value={iv.revenue} format="idrCompact" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard tone="one" label="Contribution margin" value={iv.contributionMargin} format="percent" icon={<Percent className="h-4 w-4" />} />
        <KpiCard tone="navy" label="Hasil operasional" value={r.operatingResult} format="idrCompact" icon={<Gauge className="h-4 w-4" />} />
        <KpiCard tone="navy" label="Utilisasi tim Product" value={r.capacity.productUtilization} format="percent" icon={<Wrench className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <ChartFrame
          title="Unit economics per interview"
          description="Dari pendapatan bersih ke kontribusi per interview berbayar."
          height={250}
          table={{ columns: ["Komponen", "Rp / interview"], rows: unitData.map((d) => [d.name, formatIDR(d.value)]) }}
          summary={`Kontribusi per interview ${formatIDR(contributionPerInterview)}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={unitData} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v: number) => formatIDRCompact(v)} width={70} />
              <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idr" />} />
              <Bar dataKey="value" name="Rp / interview" radius={[4, 4, 0, 0]} maxBarSize={56}>
                {unitData.map((d) => (
                  <Cell key={d.name} fill={d.kind === "neg" ? "#94a3b8" : d.kind === "total" ? SERIES.one : SERIES.interview} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-ink">Kesiapan operasional</p>
              <InfoTip align="right">Utilisasi = jam yang dibutuhkan ÷ jam produktif tersedia. Di atas 90% berarti risiko keterlambatan & kualitas meningkat.</InfoTip>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="flex justify-between"><span className="text-muted-strong">Tim Product</span><span className="tabular font-semibold text-ink">{formatPercent(r.capacity.productUtilization)}</span></div>
                <Progress value={r.capacity.productUtilization} tone="auto" className="mt-1" />
              </div>
              <div>
                <div className="flex justify-between"><span className="text-muted-strong">Strategy & Ops</span><span className="tabular font-semibold text-ink">{formatPercent(r.capacity.opsUtilization)}</span></div>
                <Progress value={r.capacity.opsUtilization} tone="auto" className="mt-1" />
              </div>
              <div>
                <div className="flex justify-between"><span className="text-muted-strong">Konsumsi anggaran</span><span className="tabular font-semibold text-ink">{formatPercent(r.budgetConsumption)}</span></div>
                <Progress value={r.budgetConsumption} tone="auto" className="mt-1" />
              </div>
            </div>
          </div>
          <Callout tone="info" icon={<CalendarDays className="h-[18px] w-[18px]" />} title="Terang Events: maintenance-only">
            Layanan existing tetap berjalan untuk {assumptions.shared.existingOrganizers} organizer. Biaya maintenance eksplisit{" "}
            <strong>{formatIDRCompact(r.events.supportCost)}</strong> dihitung pada kontribusi Events — tidak disembunyikan.
          </Callout>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">Interactive Decision Gate</p>
          <h3 className="text-2xl font-semibold text-ink">Scale · Improve · Pause / Revalidate</h3>
          <p className="mt-1 text-sm text-muted-strong">
            Nilai awal diambil dari simulasi saat ini. Ekspansi di ONE berarti membawa AI Candidate Interview ke akun & use case B2B tambahan.
          </p>
        </div>
        <DecisionGate
          key={`${Math.round(iv.contributionMargin * 100)}-${Math.round(r.capacity.productUtilization * 100)}`}
          product="interview"
          lens="one"
          initial={{
            qualityScore: 78,
            conversion: Math.min(1, assumptions.interview.pilotConversion + assumptions.one.conversionUpliftPp),
            retention: assumptions.interview.renewalRate,
            contributionMargin: iv.contributionMargin,
            capacityUtilization: r.capacity.productUtilization,
            milestoneMisses: 0,
            privacyPass: true,
            safetyPass: true,
            validityPass: true,
          }}
        />
      </div>
    </div>
  );
}
