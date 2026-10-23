"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Brain, CalendarDays, Lightbulb } from "lucide-react";
import type { ProductKey } from "@/types/common";
import { useScenarioStore } from "@/store/scenario-store";
import { computeStrategy, sensitivity } from "@/lib/finance";
import { DECISION_META, evaluateProduct } from "@/lib/portfolio-engine";
import { formatIDRCompact, formatPercent } from "@/lib/formatters";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES, tickIDR } from "@/components/charts/chart-kit";
import { DecisionGate } from "@/components/portfolio/decision-gate";
import { Slider } from "@/components/ui/slider";
import { Segmented } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SourceLabel } from "@/components/shared/source-label";
import { cn } from "@/lib/utils";
import { L, useI18n, type Bilingual } from "@/lib/i18n";

export function AcePillarEvolve() {
  const { t, tx } = useI18n();
  const assumptions = useScenarioStore((s) => s.assumptions);
  const update = useScenarioStore((s) => s.update);
  const r = useMemo(() => computeStrategy("ace", assumptions), [assumptions]);
  const one = useMemo(() => computeStrategy("one", assumptions), [assumptions]);
  const sens = useMemo(() => sensitivity(assumptions, "interviewShare").map((p) => ({ share: Math.round(p.x * 100), ace: p.ace, one: p.one })), [assumptions]);
  const [gateProduct, setGateProduct] = useState<ProductKey>("events");
  const share = assumptions.ace.interviewShare;

  const health = {
    events: evaluateProduct({
      product: "events",
      qualityScore: 80,
      conversion: 0.48,
      retention: assumptions.events.organizerRetention,
      contributionMargin: r.events.contributionMargin,
      capacityUtilization: r.capacity.productUtilization,
      milestoneMisses: 0,
      privacyPass: true,
      safetyPass: true,
      validityPass: true,
    }),
    interview: evaluateProduct({
      product: "interview",
      qualityScore: 74,
      conversion: assumptions.interview.pilotConversion,
      retention: assumptions.interview.renewalRate,
      contributionMargin: r.interview.contributionMargin,
      capacityUtilization: r.capacity.productUtilization,
      milestoneMisses: 0,
      privacyPass: true,
      safetyPass: true,
      validityPass: true,
    }),
  };

  const finData = [
    { name: t("Pendapatan", "Revenue"), events: r.events.revenue, interview: r.interview.revenue },
    { name: t("Kontribusi", "Contribution"), events: r.events.contribution, interview: r.interview.contribution },
    { name: t("Biaya akuisisi", "Acquisition cost"), events: r.events.acquisitionCost, interview: r.interview.acquisitionCost },
  ];
  const scatter = [
    { name: "Terang Events", x: Math.round((1 - share) * 100), y: r.events.contribution, z: r.events.revenue, product: "events" },
    { name: "AI Candidate Interview", x: Math.round(share * 100), y: r.interview.contribution, z: r.interview.revenue, product: "interview" },
  ];

  const recs: { text: Bilingual; tone: "warning" | "brand" | "success" }[] = [];
  if (r.capacity.productUtilization > 0.9)
    recs.push({
      text: L("Utilisasi tim _Product_ > 90%: tunda inisiatif besar berikutnya atau kurangi _scope_ fitur.", "Product team utilisation > 90%: postpone the next major initiative or reduce feature scope."),
      tone: "warning",
    });
  if (r.events.contributionMargin > r.interview.contributionMargin)
    recs.push({
      text: L("Events memiliki margin kontribusi lebih tinggi — pertahankan investasi _template_ & _repeat planner_.", "Events has the higher contribution margin — keep investing in templates & the repeat planner."),
      tone: "success",
    });
  else
    recs.push({
      text: L("Interview memiliki margin kontribusi lebih tinggi — pertimbangkan menaikkan porsi kapasitas Interview secara bertahap.", "Interview has the higher contribution margin — consider gradually raising Interview's capacity share."),
      tone: "brand",
    });
  if (r.operatingResult < one.operatingResult) {
    const gap = formatIDRCompact(one.operatingResult - r.operatingResult);
    recs.push({
      text: L(`Pada asumsi ini ONE unggul ${gap} pada hasil operasional — ACE perlu membuktikan nilai diversifikasi.`, `Under these assumptions ONE leads by ${gap} in operating result — ACE must prove the value of diversification.`),
      tone: "warning",
    });
  } else {
    const gap = formatIDRCompact(r.operatingResult - one.operatingResult);
    recs.push({
      text: L(`Pada asumsi ini ACE unggul ${gap} — nilai produk kedua membenarkan biaya tambahannya.`, `Under these assumptions ACE leads by ${gap} — the second product's value justifies its extra cost.`),
      tone: "success",
    });
  }
  if (assumptions.interview.pilotConversion < 0.3)
    recs.push({
      text: L("Konversi _pilot_ Interview di bawah 30% — fokuskan perbaikan rubrik & _onboarding_ sebelum menambah _pilot_.", "Interview pilot conversion is below 30% — focus on improving the rubric & onboarding before adding pilots."),
      tone: "warning",
    });

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">{tx("Program _Flagship_", "Flagship Program")}</p>
          <h3 className="text-2xl font-semibold text-ink">ACE Portfolio Intelligence</h3>
        </div>
        <SourceLabel type="illustrative-assumption" />
      </div>

      {/* Health */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(["events", "interview"] as const).map((p) => {
          const h = health[p];
          const meta = DECISION_META[h.decision];
          const res = r[p];
          const isEvents = p === "events";
          return (
            <div key={p} className="rounded-3xl border border-line bg-card p-6 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn("grid h-11 w-11 place-items-center rounded-xl", isEvents ? "bg-sky-soft text-sky-ink" : "bg-one-soft text-one-ink")}>
                    {isEvents ? <CalendarDays className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{isEvents ? "Terang Events" : "AI Candidate Interview"}</p>
                    <p className="text-xs text-muted">
                      {h.passed}/{h.total} {t("kriteria komersial terpenuhi", "commercial criteria met")}
                    </p>
                  </div>
                </div>
                <Badge tone={meta.tone}>{meta.ace}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  [t("Pendapatan", "Revenue"), formatIDRCompact(res.revenue)],
                  [t("Kontribusi", "Contribution"), formatIDRCompact(res.contribution)],
                  ["Margin", formatPercent(res.contributionMargin)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                    <p className="text-[11px] text-muted">{k}</p>
                    <p className="tabular font-display text-lg font-semibold text-ink">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[13px] text-muted-strong">{h.reasons[0] && tx(h.reasons[0])}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartFrame
          title={t("Perbandingan finansial per produk", "Financial comparison by product")}
          description={t(`Dalam ACE (${assumptions.shared.horizonMonths} bulan).`, `Under ACE (${assumptions.shared.horizonMonths} months).`)}
          legend={[
            { label: "Terang Events", color: SERIES.events },
            { label: "AI Candidate Interview", color: SERIES.interview },
          ]}
          table={{ columns: [t("Metrik", "Metric"), "Events", "Interview"], rows: finData.map((d) => [d.name, formatIDRCompact(d.events), formatIDRCompact(d.interview)]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={finData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} width={86} tickFormatter={tickIDR} />
              <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
              <Bar dataKey="events" name="Terang Events" fill={SERIES.events} radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="interview" name="AI Candidate Interview" fill={SERIES.interview} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title={t("Kapasitas vs nilai", "Capacity vs value")}
          description={t("Sumbu X: porsi kapasitas; sumbu Y: kontribusi; ukuran: pendapatan.", "X axis: capacity share; Y axis: contribution; size: revenue.")}
          legend={[
            { label: "Terang Events", color: SERIES.events },
            { label: "AI Candidate Interview", color: SERIES.interview },
          ]}
          table={{ columns: [t("Produk", "Product"), t("Porsi kapasitas", "Capacity share"), t("Kontribusi", "Contribution")], rows: scatter.map((s) => [s.name, `${s.x}%`, formatIDRCompact(s.y)]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid stroke={SERIES.grid} />
              <XAxis type="number" dataKey="x" name={t("Porsi kapasitas", "Capacity share")} unit="%" domain={[0, 100]} {...AXIS_PROPS} />
              <YAxis type="number" dataKey="y" name={t("Kontribusi", "Contribution")} width={86} tickFormatter={tickIDR} {...AXIS_PROPS} />
              <ZAxis type="number" dataKey="z" range={[220, 900]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  const d = payload?.[0]?.payload as (typeof scatter)[number] | undefined;
                  if (!active || !d) return null;
                  return (
                    <div className="rounded-xl border border-line bg-card px-3 py-2 text-xs shadow-lift">
                      <p className="font-semibold text-ink">{d.name}</p>
                      <p className="text-muted-strong">
                        {t("Kapasitas", "Capacity")} {d.x}% · {t("Kontribusi", "Contribution")} {formatIDRCompact(d.y)}
                      </p>
                    </div>
                  );
                }}
              />
              <Scatter data={scatter.filter((s) => s.product === "events")} fill={SERIES.events} stroke="var(--color-card)" strokeWidth={2} name="Terang Events">
              </Scatter>
              <Scatter data={scatter.filter((s) => s.product === "interview")} fill={SERIES.interview} stroke="var(--color-card)" strokeWidth={2} name="AI Candidate Interview">
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      {/* Reallocation simulator */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">{t("Simulator realokasi sumber daya", "Resource reallocation simulator")}</p>
            <h3 className="mt-1 text-xl font-semibold text-ink">{t("Geser porsi kapasitas ACE", "Shift ACE's capacity split")}</h3>
            <p className="mt-1 text-sm text-muted-strong">{t("ACE tidak harus 50:50. Nilai ini tersimpan di simulator bersama.", "ACE need not be 50:50. This value is saved to the shared simulator.")}</p>
            <Slider
              className="mt-6"
              label={t("Porsi kapasitas untuk Interview", "Capacity share for Interview")}
              value={Math.round(share * 100)}
              min={30}
              max={90}
              step={5}
              onChange={(v) => update("ace", "interviewShare", v / 100)}
              display={`${Math.round(share * 100)}% Interview · ${Math.round((1 - share) * 100)}% Events`}
              color="#0c9fd8"
            />
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                [t("Kontribusi Events", "Events contribution"), formatIDRCompact(r.events.contribution)],
                [t("Kontribusi Interview", "Interview contribution"), formatIDRCompact(r.interview.contribution)],
                [t("Hasil operasional ACE", "ACE operating result"), formatIDRCompact(r.operatingResult)],
                [t("Utilisasi _Product_", "Product utilisation"), formatPercent(r.capacity.productUtilization)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                  <p className="text-[11px] text-muted">{k}</p>
                  <p className="tabular font-display text-lg font-semibold text-ink">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <ChartFrame
            className="border-0 p-0 shadow-none"
            title={t("Hasil operasional vs porsi Interview", "Operating result vs Interview share")}
            description={t("Garis ONE konstan sebagai pembanding (fokus 100% Interview).", "The ONE line stays constant as a benchmark (100% Interview focus).")}
            legend={[
              { label: "ACE", color: SERIES.ace },
              { label: t("ONE (pembanding)", "ONE (benchmark)"), color: SERIES.one, dashed: true },
            ]}
            table={{ columns: [t("Porsi Interview", "Interview share"), "ACE", "ONE"], rows: sens.map((s) => [`${s.share}%`, formatIDRCompact(s.ace), formatIDRCompact(s.one)]) }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sens} margin={{ top: 10, right: 12, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={SERIES.grid} />
                <XAxis dataKey="share" unit="%" {...AXIS_PROPS} />
                <YAxis width={86} tickFormatter={tickIDR} {...AXIS_PROPS} />
                <Tooltip content={(p) => <ChartTooltip {...p} format="idrCompact" labelFmt={(l) => `${t("Porsi Interview", "Interview share")} ${String(l)}%`} />} />
                <ReferenceLine x={Math.round(share * 100)} stroke="#0c9fd8" strokeDasharray="4 4" label={{ value: t("saat ini", "current"), fontSize: 11, fill: "#56677f", position: "top" }} />
                <Line type="monotone" dataKey="ace" name="ACE" stroke={SERIES.ace} strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} />
                <Line type="monotone" dataKey="one" name="ONE" stroke={SERIES.one} strokeWidth={2} strokeDasharray="6 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-3xl bg-navy-gradient p-6 text-white shadow-lift">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-sky">
          <Lightbulb className="h-4 w-4" /> {t("Rekomendasi berbasis aturan (bukan AI)", "Rule-based recommendations (not AI)")}
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {recs.map((rec) => (
            <li key={rec.text.id} className="flex gap-3 rounded-2xl bg-white/8 p-4 text-sm ring-1 ring-white/12">
              <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", rec.tone === "warning" ? "bg-warning" : rec.tone === "success" ? "bg-success" : "bg-sky")} />
              <span>{tx(rec.text)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Decision gate */}
      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">{t("Hasil keputusan", "Decision outcomes")}</p>
            <h3 className="text-2xl font-semibold text-ink">Invest more · Improve · Reduce scope · Pause</h3>
          </div>
          <Segmented
            value={gateProduct}
            onChange={setGateProduct}
            items={[
              { id: "events", label: "Terang Events" },
              { id: "interview", label: "AI Interview" },
            ]}
          />
        </div>
        <DecisionGate
          key={gateProduct}
          product={gateProduct}
          lens="ace"
          color="#0c9fd8"
          initial={{
            qualityScore: gateProduct === "events" ? 80 : 74,
            conversion: gateProduct === "events" ? 0.48 : assumptions.interview.pilotConversion,
            retention: gateProduct === "events" ? assumptions.events.organizerRetention : assumptions.interview.renewalRate,
            contributionMargin: r[gateProduct].contributionMargin,
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
