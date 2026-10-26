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
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES, tickIDR } from "@/components/charts/chart-kit";
import { DecisionGate } from "@/components/portfolio/decision-gate";
import { SourceLabel } from "@/components/shared/source-label";
import { useI18n } from "@/lib/i18n";

export function OnePillarEvaluate() {
  const { t, tx } = useI18n();
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
    { name: t("Pendapatan bersih", "Net revenue"), value: perInterview.revenue, kind: "pos" },
    { name: t("Biaya variabel", "Variable cost"), value: -perInterview.variable, kind: "neg" },
    { name: t("Dukungan langsung", "Direct support"), value: -perInterview.support, kind: "neg" },
    { name: t("Kontribusi", "Contribution"), value: contributionPerInterview, kind: "total" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">ONE Growth Intelligence</p>
          <h3 className="text-2xl font-semibold text-ink">
            {t("KPI produk & komersial", "Product & commercial KPIs")} ({assumptions.shared.horizonMonths} {t("bulan", "months")})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <SourceLabel type="illustrative-assumption" />
          <Button href="/dashboard/simulator" size="sm" variant="secondary">
            {t("Ubah asumsi", "Change assumptions")}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <KpiCard tone="one" label={t("Pelanggan berbayar", "Paying customers")} value={iv.customers} icon={<Users className="h-4 w-4" />} />
        <KpiCard tone="one" label={tx("_Interview_ berbayar", "Paid interviews")} value={iv.units} icon={<Brain className="h-4 w-4" />} />
        <KpiCard tone="one" label={t("Pendapatan Interview", "Interview revenue")} value={iv.revenue} format="idrCompact" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard tone="one" label={tx("_Contribution margin_", "Contribution margin")} value={iv.contributionMargin} format="percent" icon={<Percent className="h-4 w-4" />} />
        <KpiCard tone="navy" label={t("Hasil operasional", "Operating result")} value={r.operatingResult} format="idrCompact" icon={<Gauge className="h-4 w-4" />} />
        <KpiCard tone="navy" label={tx("Utilisasi tim _Product_", "Product team utilisation")} value={r.capacity.productUtilization} format="percent" icon={<Wrench className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <ChartFrame
          title={tx("_Unit economics_ per _interview_", "Unit economics per interview")}
          description={tx("Dari pendapatan bersih ke kontribusi per _interview_ berbayar.", "From net revenue to contribution per paid interview.")}
          height={250}
          table={{ columns: [t("Komponen", "Component"), "Rp / interview"], rows: unitData.map((d) => [d.name, formatIDR(d.value)]) }}
          summary={t(`Kontribusi per interview ${formatIDR(contributionPerInterview)}`, `Contribution per interview ${formatIDR(contributionPerInterview)}`)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={unitData} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={tickIDR} width={86} />
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
              <p className="font-semibold text-ink">{t("Kesiapan operasional", "Operational readiness")}</p>
              <InfoTip align="right">
                {t(
                  "Utilisasi = jam yang dibutuhkan ÷ jam produktif tersedia. Di atas 90% berarti risiko keterlambatan & kualitas meningkat.",
                  "Utilisation = hours required ÷ productive hours available. Above 90% means a higher risk of delays & quality issues.",
                )}
              </InfoTip>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="flex justify-between"><span className="text-muted-strong">{tx("Tim _Product_", "Product team")}</span><span className="tabular font-semibold text-ink">{formatPercent(r.capacity.productUtilization)}</span></div>
                <Progress value={r.capacity.productUtilization} tone="auto" className="mt-1" />
              </div>
              <div>
                <div className="flex justify-between"><span className="text-muted-strong">Strategy & Ops</span><span className="tabular font-semibold text-ink">{formatPercent(r.capacity.opsUtilization)}</span></div>
                <Progress value={r.capacity.opsUtilization} tone="auto" className="mt-1" />
              </div>
              <div>
                <div className="flex justify-between"><span className="text-muted-strong">{t("Konsumsi anggaran", "Budget consumption")}</span><span className="tabular font-semibold text-ink">{formatPercent(r.budgetConsumption)}</span></div>
                <Progress value={r.budgetConsumption} tone="auto" className="mt-1" />
              </div>
            </div>
          </div>
          <Callout tone="info" icon={<CalendarDays className="h-[18px] w-[18px]" />} title={tx("Terang Events: hanya _maintenance_", "Terang Events: maintenance-only")}>
            {tx(
              `Layanan yang sudah berjalan tetap beroperasi untuk ${assumptions.shared.existingOrganizers} _organizer_. Biaya _maintenance_ eksplisit`,
              `The existing service keeps running for ${assumptions.shared.existingOrganizers} organizers. An explicit maintenance cost of`,
            )}{" "}
            <strong>{formatIDRCompact(r.events.supportCost)}</strong>{" "}
            {t("dihitung pada kontribusi Events — tidak disembunyikan.", "is charged to Events' contribution — nothing is hidden.")}
          </Callout>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">{tx("_Decision Gate_ Interaktif", "Interactive Decision Gate")}</p>
          <h3 className="text-2xl font-semibold text-ink">Scale · Improve · Hold</h3>
          <p className="mt-1 text-sm text-muted-strong">
            {tx(
              "Nilai awal diambil dari simulasi saat ini. Ekspansi di ONE berarti membawa AI Candidate Interview ke akun & _use case_ B2B tambahan.",
              "Starting values come from the current simulation. Expansion under ONE means taking AI Candidate Interview to additional B2B accounts & use cases.",
            )}
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
