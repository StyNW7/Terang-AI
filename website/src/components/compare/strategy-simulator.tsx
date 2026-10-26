"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  CheckCircle2,
  ClipboardCopy,
  Download,
  Layers,
  RotateCcw,
  Scale,
  Sigma,
  Target,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import type { ScenarioPreset, StrategyResult } from "@/types/finance";
import { useScenarioStore } from "@/store/scenario-store";
import { SCENARIO_PRESETS } from "@/data/scenarios";
import { computeBoth, findCrossover, FORMULAS, sensitivity, SENSITIVITY_PARAMS, type SensitivityParam } from "@/lib/finance";
import { formatIDR, formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES, tickIDR, noWrap } from "@/components/charts/chart-kit";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/modal";
import { Select } from "@/components/ui/form";
import { Segmented } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { Callout, Progress } from "@/components/ui/misc";
import { InfoTip } from "@/components/ui/tooltip";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { STRATEGY_GLOSSARY } from "@/data/strategy";
import { AssumptionPanel } from "./assumption-panel";
import { cn } from "@/lib/utils";
import { keyOf, L, useI18n, type Bilingual } from "@/lib/i18n";

const FAIR_RULES: Bilingual[] = [
  L("_Headcount_ sama: 7 personel untuk kedua strategi", "Same headcount: 7 people for both strategies"),
  L("Periode evaluasi & biaya tetap identik", "Identical evaluation period & fixed costs"),
  L("Anggaran pengembangan & kapasitas penjualan sama", "Same development budget & sales capacity"),
  L("_Maintenance_ Events dihitung di kedua strategi (sekali saja)", "Events maintenance counted in both strategies (once)"),
  L("_Uplift_ fokus ONE hanya lewat asumsi eksplisit", "ONE's focus uplift only via an explicit assumption"),
  L("Kompleksitas ACE memiliki biaya & efek kapasitas", "ACE's complexity carries cost & capacity effects"),
  L("Tidak ada pemenang yang ditentukan sebelumnya", "No winner is decided in advance"),
];

function sensFormat(param: SensitivityParam, v: number) {
  const f = SENSITIVITY_PARAMS[param].format;
  return f === "percent" ? formatPercent(v) : f === "idr" ? formatIDRCompact(v) : formatNumber(v);
}

function StrategyCard({ r, other, variant }: { r: StrategyResult; other: StrategyResult; variant: "one" | "ace" }) {
  const { t, tx } = useI18n();
  const isOne = variant === "one";
  const better = (a: number, b: number, higherIsBetter = true) => (higherIsBetter ? a > b : a < b);
  const rows: { label: string; value: string; win?: boolean; hint?: string }[] = [
    { label: t("Produk aktif dikembangkan", "Products in active development"), value: isOne ? "1 · AI Candidate Interview" : "2 · Events + Interview" },
    { label: t("Fokus pengembangan", "Development focus"), value: isOne ? "AI Interview Intelligence Suite" : "Dual-Product Innovation Sprint" },
    { label: t("Kanal akuisisi", "Acquisition channels"), value: isOne ? t("Komunitas HR, LinkedIn, webinar", "HR communities, LinkedIn, webinars") : t("Kampus & asosiasi + HR & agensi", "Campuses & associations + HR & agencies") },
    { label: t("Pendapatan", "Revenue"), value: formatIDRCompact(r.revenue), win: better(r.revenue, other.revenue) },
    { label: t("Kontribusi total", "Total contribution"), value: formatIDRCompact(r.totalContribution), win: better(r.totalContribution, other.totalContribution) },
    { label: t("_Contribution margin_", "Contribution margin"), value: formatPercent(r.contributionMargin), win: better(r.contributionMargin, other.contributionMargin) },
    { label: t("Biaya pemasaran & akuisisi", "Marketing & acquisition cost"), value: formatIDRCompact(r.marketingCosts), win: better(r.marketingCosts, other.marketingCosts, false) },
    { label: t("_Overhead_ portofolio", "Portfolio overhead"), value: formatIDRCompact(r.portfolioOverhead), win: better(r.portfolioOverhead, other.portfolioOverhead, false) },
    { label: t("Konsumsi anggaran", "Budget consumption"), value: formatPercent(r.budgetConsumption), win: better(r.budgetConsumption, other.budgetConsumption, false) },
    { label: t("Utilisasi tim Product", "Product team utilisation"), value: formatPercent(r.capacity.productUtilization), win: better(r.capacity.productUtilization, other.capacity.productUtilization, false) },
    { label: t("Utilisasi Strategy & Ops", "Strategy & Ops utilisation"), value: formatPercent(r.capacity.opsUtilization), win: better(r.capacity.opsUtilization, other.capacity.opsUtilization, false) },
  ];
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-card">
      <div className={cn("relative p-6 text-white", isOne ? "bg-one-gradient" : "bg-ace-gradient")}>
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
              {isOne ? <Target className="h-4 w-4" /> : <Layers className="h-4 w-4" />} {isOne ? "PRO" : t("KONTRA", "CONTRA")}
            </p>
            <p className="font-display text-3xl font-semibold">{isOne ? "ONE Strategy" : "ACE Strategy"}</p>
          </div>
          <Mascot name={isOne ? "target" : "puzzle"} size={76} float={false} className="-mr-2 -mt-2" />
        </div>
        <div className="relative mt-4 rounded-2xl bg-white/12 p-4 ring-1 ring-white/20">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            {t("Hasil operasional (estimasi)", "Operating result (estimated)")}
            <InfoTip light>
              {tx(
                "Kontribusi total dikurangi biaya tetap, pengembangan, pemasaran, dan _overhead_ portofolio. Bukan laba bersih — pajak & pembiayaan tidak dihitung.",
                "Total contribution minus fixed, development, marketing and portfolio-overhead costs. Not net profit — taxes & financing are excluded.",
              )}
            </InfoTip>
          </p>
          <p className="tabular font-display text-3xl font-semibold">
            <AnimatedNumber value={r.operatingResult} format="idrCompact" />
          </p>
          <p className="text-xs text-white/75">
            {r.operatingResult >= other.operatingResult ? t("Lebih tinggi pada asumsi ini", "Higher under these assumptions") : t("Lebih rendah pada asumsi ini", "Lower under these assumptions")}
          </p>
        </div>
      </div>
      <dl className="flex-1 divide-y divide-line px-6">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <dt className="text-muted-strong">{row.label}</dt>
            <dd className="flex items-center gap-1.5 text-right font-semibold text-ink">
              <span className="tabular">{row.value}</span>
              {row.win && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" aria-label={t("lebih baik", "better")} />}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t("Risiko utama", "Main risks")}</p>
        <ul className="mt-2 space-y-1">
          {r.risks.slice(0, 4).map((risk) => (
            <li key={keyOf(risk)} className="flex items-start gap-2 text-[13px] text-ink">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> {tx(risk)}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{tx("Syarat _scale_", "Conditions to scale")}</p>
        <p className="mt-1 text-[13px] text-muted-strong">
          {isOne
            ? t("Expansion Gate lulus: kualitas, traksi, ekonomi, kapasitas & Responsible AI.", "Pass the Expansion Gate: quality, traction, economics, capacity & Responsible AI.")
            : tx("_Portfolio review_ per produk: _Invest More / Optimize / Limit Scope / Pause_ berdasarkan KPI.", "Per-product portfolio review: Invest More / Optimize / Limit Scope / Pause based on KPIs.")}
        </p>
      </div>
    </div>
  );
}

export function StrategySimulator() {
  const { t, tx } = useI18n();
  const assumptions = useScenarioStore((s) => s.assumptions);
  const preset = useScenarioStore((s) => s.preset);
  const applyPreset = useScenarioStore((s) => s.applyPreset);
  const reset = useScenarioStore((s) => s.reset);
  const [showFormulas, setShowFormulas] = useState(false);
  const [explain, setExplain] = useState(false);
  const [param, setParam] = useState<SensitivityParam>("pilotConversion");

  const { one, ace } = useMemo(() => computeBoth(assumptions), [assumptions]);
  const sens = useMemo(() => sensitivity(assumptions, param), [assumptions, param]);
  const crossover = findCrossover(sens);
  const presetTable = useMemo(
    () =>
      (Object.keys(SCENARIO_PRESETS) as ScenarioPreset[]).map((k) => {
        const b = computeBoth(SCENARIO_PRESETS[k].assumptions);
        return { key: k, label: SCENARIO_PRESETS[k].label as Bilingual, one: b.one, ace: b.ace };
      }),
    [],
  );

  const leader = one.operatingResult === ace.operatingResult ? null : one.operatingResult > ace.operatingResult ? "ONE" : "ACE";
  const gap = Math.abs(one.operatingResult - ace.operatingResult);
  const bothNegative = one.operatingResult < 0 && ace.operatingResult < 0;

  const compareData = [
    { metric: t("Pendapatan", "Revenue"), one: one.revenue, ace: ace.revenue },
    { metric: t("Kontribusi", "Contribution"), one: one.totalContribution, ace: ace.totalContribution },
    { metric: t("Total biaya", "Total costs"), one: one.totalCosts, ace: ace.totalCosts },
    { metric: t("Hasil operasional", "Operating result"), one: one.operatingResult, ace: ace.operatingResult },
  ];
  const costData = [
    { name: "ONE", tetap: one.fixedCosts, pengembangan: one.developmentCosts, pemasaran: one.marketingCosts, overhead: one.portfolioOverhead, langsung: one.totalCosts - one.fixedCosts - one.developmentCosts - one.marketingCosts - one.portfolioOverhead },
    { name: "ACE", tetap: ace.fixedCosts, pengembangan: ace.developmentCosts, pemasaran: ace.marketingCosts, overhead: ace.portfolioOverhead, langsung: ace.totalCosts - ace.fixedCosts - ace.developmentCosts - ace.marketingCosts - ace.portfolioOverhead },
  ];
  const sensData = sens.map((p) => ({ x: p.x, label: sensFormat(param, p.x), one: p.one, ace: p.ace }));

  const strategyLine = (name: string, r: StrategyResult) =>
    t(
      `${name}: pendapatan ${formatIDR(r.revenue)}, kontribusi ${formatIDR(r.totalContribution)}, hasil operasional ${formatIDR(r.operatingResult)}, utilisasi Product ${formatPercent(r.capacity.productUtilization)}`,
      `${name}: revenue ${formatIDR(r.revenue)}, contribution ${formatIDR(r.totalContribution)}, operating result ${formatIDR(r.operatingResult)}, Product utilisation ${formatPercent(r.capacity.productUtilization)}`,
    );
  const summaryText = () =>
    [
      t("Terang AI — Simulator ONE vs ACE (asumsi ilustratif akademik)", "Terang AI — ONE vs ACE Simulator (illustrative academic assumptions)"),
      `${t("Skenario", "Scenario")}: ${preset === "custom" ? t("Kustom", "Custom") : t(SCENARIO_PRESETS[preset].label)} · Horizon ${assumptions.shared.horizonMonths} ${t("bulan", "months")}`,
      strategyLine("ONE", one),
      strategyLine("ACE", ace),
      leader
        ? t(`Pada asumsi ini ${leader} unggul ${formatIDR(gap)} pada hasil operasional.`, `Under these assumptions ${leader} leads by ${formatIDR(gap)} in operating result.`)
        : t("Kedua strategi setara pada asumsi ini.", "Both strategies are level under these assumptions."),
      crossover !== null ? `${t("Titik balik", "Tipping point")} ${t(SENSITIVITY_PARAMS[param].label)}: ± ${sensFormat(param, crossover)}.` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText());
      toast.success(t("Ringkasan skenario disalin ke _clipboard_.", "Scenario summary copied to the clipboard."));
    } catch {
      toast.error(t("_Clipboard_ tidak tersedia di _browser_ ini.", "The clipboard is not available in this browser."));
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify({ label: "Illustrative academic assumptions — not Terang AI data", preset, assumptions, results: { one, ace } }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `terang-one-vs-ace-${preset}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("Skenario diunduh sebagai JSON.", "Scenario downloaded as JSON."));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<SourceLabel type="illustrative-assumption" compact />}
        title={t("Simulator ONE vs ACE", "ONE vs ACE Simulator")}
        description={t(
          "Model sederhana untuk menguji asumsi: ubah satu angka dan lihat kapan ONE atau ACE lebih menarik. Semua angka ilustratif; proyeksi jangka panjang proposal ada di bagian bawah.",
          "A simple model to test assumptions: change one number and see when ONE or ACE looks better. Every figure is illustrative; the proposal's long-term projection is at the bottom.",
        )}
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="mr-1 text-[13px] font-medium text-muted-strong">{t("Skenario", "Scenario")}</span>
          <Segmented
            size="sm"
            value={preset === "custom" ? ("" as ScenarioPreset) : preset}
            onChange={(k) => {
              applyPreset(k);
              toast.info(t(`_Preset_ ${t(SCENARIO_PRESETS[k].label)} diterapkan.`, `${t(SCENARIO_PRESETS[k].label)} preset applied.`));
            }}
            items={(Object.keys(SCENARIO_PRESETS) as ScenarioPreset[]).map((k) => ({ id: k, label: tx(SCENARIO_PRESETS[k].label) }))}
          />
          {preset === "custom" && <Badge tone="ace">{t("Kustom", "Custom")}</Badge>}
        </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            reset();
            toast.success(t("Asumsi direset ke _Base Case_.", "Assumptions reset to the Base Case."));
          }}
        >
          <RotateCcw className="h-4 w-4" /> {t("Reset asumsi", "Reset assumptions")}
        </Button>
        <Button size="sm" variant={showFormulas ? "dark" : "secondary"} onClick={() => setShowFormulas((s) => !s)}>
          <Sigma className="h-4 w-4" /> {showFormulas ? t("Sembunyikan rumus", "Hide formulas") : t("Tampilkan rumus", "Show formulas")}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setExplain(true)}>
          <BookOpen className="h-4 w-4" /> {t("Jelaskan asumsi", "Explain assumptions")}
        </Button>
        <Button size="sm" variant="secondary" onClick={downloadJson}>
          <Download className="h-4 w-4" /> {t("Unduh JSON", "Download JSON")}
        </Button>
        <Button size="sm" variant="secondary" onClick={copySummary}>
          <ClipboardCopy className="h-4 w-4" /> {t("Salin ringkasan", "Copy summary")}
        </Button>
      </div>
      </div>

      <AnimatePresence>
        {showFormulas && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {FORMULAS.map((f) => (
                <div key={f.name.id} className="rounded-2xl border border-line bg-card p-4 shadow-soft">
                  <p className="text-sm font-semibold text-ink">{tx(f.name)}</p>
                  <code className="mt-2 block rounded-lg bg-navy px-3 py-2 text-[12px] leading-relaxed text-sky">{f.formula}</code>
                  <p className="mt-2 text-xs text-muted-strong">{tx(f.note)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[380px_1fr] xl:grid-cols-[340px_1fr]">
        <aside className="scrollbar-thin h-fit xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto xl:pr-1">
          <AssumptionPanel />
        </aside>

        <div className="min-w-0 space-y-6">
          <motion.div
            key={leader ?? "tie"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="text-sm text-ink">
              <p>
                {leader ? (
                  <>
                    {t("Pada asumsi saat ini,", "Under the current assumptions,")} <strong className={leader === "ONE" ? "text-one-ink" : "text-ace-ink"}>{leader}</strong>{" "}
                    {bothNegative ? t("rugi lebih kecil", "loses less, by") : t("unggul", "leads by")} <strong className="tabular">{formatIDRCompact(gap)}</strong>{" "}
                    {t(`pada hasil operasional ${assumptions.shared.horizonMonths} bulan.`, `in ${assumptions.shared.horizonMonths}-month operating result.`)}
                  </>
                ) : (
                  t("Kedua strategi menghasilkan hasil operasional yang setara pada asumsi ini.", "Both strategies produce the same operating result under these assumptions.")
                )}{" "}
                <span className="text-muted-strong">{t("Ini bukan kesimpulan final — ubah asumsi untuk menguji kondisinya.", "This is not a final conclusion — change the assumptions to test the conditions.")}</span>
              </p>
              {bothNegative && (
                <p className="mt-2 flex items-start gap-2 rounded-xl bg-warning-soft px-3 py-2 text-[13px] text-warning-ink">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {t(
                      `Kedua hasil negatif itu wajar: dalam ${assumptions.shared.horizonMonths} bulan pertama strategi masih di fase investasi karena pelanggan datang bertahap. Proposal memproyeksikan balik modal ONE ±28,7 bulan dan ACE ±41,3 bulan — coba horizon 24 bulan.`,
                      `Both results being negative is expected: in the first ${assumptions.shared.horizonMonths} months each strategy is still investing because customers arrive gradually. The proposal projects payback at ~28.7 months for ONE and ~41.3 months for ACE — try the 24-month horizon.`,
                    )}
                  </span>
                </p>
              )}
            </div>
            <SourceLabel type="illustrative-assumption" compact />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <StrategyCard r={one} other={ace} variant="one" />
            <StrategyCard r={ace} other={one} variant="ace" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartFrame
              title={t("Perbandingan finansial", "Financial comparison")}
              description={`Horizon ${assumptions.shared.horizonMonths} ${t("bulan", "months")} · IDR.`}
              legend={[
                { label: "ONE", color: SERIES.one },
                { label: "ACE", color: SERIES.ace },
              ]}
              table={{ columns: [t("Metrik", "Metric"), "ONE", "ACE"], rows: compareData.map((d) => [d.metric, formatIDR(d.one), formatIDR(d.ace)]) }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barGap={2}>
                  <CartesianGrid vertical={false} stroke={SERIES.grid} />
                  <XAxis dataKey="metric" {...AXIS_PROPS} />
                  <YAxis width={86} tickFormatter={tickIDR} {...AXIS_PROPS} />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
                  <Bar dataKey="one" name="ONE" fill={SERIES.one} radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="ace" name="ACE" fill={SERIES.ace} radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
            <ChartFrame
              title={t("Struktur biaya", "Cost structure")}
              description={t("Setiap biaya dihitung sekali.", "Every cost is counted once.")}
              legend={[
                { label: t("Biaya tetap", "Fixed costs"), color: SERIES.navy },
                { label: t("Pengembangan", "Development"), color: "#2f66e0" },
                { label: t("Pemasaran & akuisisi", "Marketing & acquisition"), color: "#39b7ff" },
                { label: t("_Overhead_ portofolio", "Portfolio overhead"), color: "#0c9fd8" },
                { label: t("Biaya langsung produk", "Direct product costs"), color: "#94a3b8" },
              ]}
              table={{
                columns: [t("Strategi", "Strategy"), t("Tetap", "Fixed"), t("Pengembangan", "Development"), t("Pemasaran", "Marketing"), "Overhead", t("Langsung", "Direct")],
                rows: costData.map((c) => [c.name, formatIDRCompact(c.tetap), formatIDRCompact(c.pengembangan), formatIDRCompact(c.pemasaran), formatIDRCompact(c.overhead), formatIDRCompact(c.langsung)]),
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke={SERIES.grid} />
                  <XAxis type="number" tickFormatter={tickIDR} {...AXIS_PROPS} />
                  <YAxis type="category" dataKey="name" width={44} tickFormatter={noWrap} {...AXIS_PROPS} />
                  <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
                  <Bar dataKey="tetap" name={t("Biaya tetap", "Fixed costs")} stackId="c" fill={SERIES.navy} stroke="var(--color-card)" strokeWidth={2} maxBarSize={44} />
                  <Bar dataKey="pengembangan" name={t("Pengembangan", "Development")} stackId="c" fill="#2f66e0" stroke="var(--color-card)" strokeWidth={2} maxBarSize={44} />
                  <Bar dataKey="pemasaran" name={t("Pemasaran & akuisisi", "Marketing & acquisition")} stackId="c" fill="#39b7ff" stroke="var(--color-card)" strokeWidth={2} maxBarSize={44} />
                  <Bar dataKey="overhead" name={t("_Overhead_ portofolio", "Portfolio overhead")} stackId="c" fill="#0c9fd8" stroke="var(--color-card)" strokeWidth={2} maxBarSize={44} />
                  <Bar dataKey="langsung" name={t("Biaya langsung produk", "Direct product costs")} stackId="c" fill="#94a3b8" stroke="var(--color-card)" strokeWidth={2} radius={[0, 4, 4, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          </div>

          <ChartFrame
            title={t("Kapan ONE atau ACE lebih menarik?", "When is ONE or ACE more attractive?")}
            description={t("Analisis sensitivitas: geser satu parameter, asumsi lain tetap.", "Sensitivity analysis: move one parameter while the other assumptions stay fixed.")}
            height={300}
            legend={[
              { label: "ONE", color: SERIES.one },
              { label: "ACE", color: SERIES.ace },
            ]}
            action={
              <Select value={param} onChange={(e) => setParam(e.target.value as SensitivityParam)} className="h-8 w-64 text-xs" aria-label={t("Parameter sensitivitas", "Sensitivity parameter")}>
                {(Object.keys(SENSITIVITY_PARAMS) as SensitivityParam[]).map((k) => (
                  <option key={k} value={k}>
                    {t(SENSITIVITY_PARAMS[k].label)}
                  </option>
                ))}
              </Select>
            }
            table={{ columns: [t(SENSITIVITY_PARAMS[param].label), "ONE", "ACE"], rows: sensData.map((d) => [d.label, formatIDRCompact(d.one), formatIDRCompact(d.ace)]) }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensData} margin={{ top: 16, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={SERIES.grid} />
                <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => sensFormat(param, v)} {...AXIS_PROPS} />
                <YAxis width={86} tickFormatter={tickIDR} {...AXIS_PROPS} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Tooltip content={(p) => <ChartTooltip {...p} format="idrCompact" labelFmt={(l) => sensFormat(param, Number(l))} />} />
                {crossover !== null && <ReferenceLine x={crossover} stroke="#e2930f" strokeDasharray="4 4" label={{ value: t("titik balik", "tipping point"), position: "top", fontSize: 11, fill: "#9a5b00" }} />}
                <Line type="monotone" dataKey="one" name="ONE" stroke={SERIES.one} strokeWidth={2.5} dot={{ r: 3.5, stroke: "#fff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="ace" name="ACE" stroke={SERIES.ace} strokeWidth={2.5} dot={{ r: 3.5, stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartFrame>
          <Callout tone={crossover !== null ? "info" : "warning"} title={t("Interpretasi sensitivitas", "Reading the sensitivity")}>
            {crossover !== null ? (
              <>
                {t("Pada parameter", "For the parameter")} <strong>{tx(SENSITIVITY_PARAMS[param].label)}</strong>,{" "}
                {t("keunggulan berpindah di sekitar", "the lead switches at around")} <strong>{sensFormat(param, crossover)}</strong>.{" "}
                {t(
                  `Di sisi kiri titik ini ${sens[0].one > sens[0].ace ? "ONE" : "ACE"} unggul; di sisi kanan ${sens[sens.length - 1].one > sens[sens.length - 1].ace ? "ONE" : "ACE"} unggul.`,
                  `To the left of this point ${sens[0].one > sens[0].ace ? "ONE" : "ACE"} leads; to the right ${sens[sens.length - 1].one > sens[sens.length - 1].ace ? "ONE" : "ACE"} leads.`,
                )}
              </>
            ) : (
              <>
                {t(
                  `Dalam rentang yang diuji, ${sens[0].one > sens[0].ace ? "ONE" : "ACE"} selalu unggul pada parameter ini. Coba parameter lain atau ubah asumsi dasar untuk menemukan titik balik.`,
                  `Across the tested range, ${sens[0].one > sens[0].ace ? "ONE" : "ACE"} always leads on this parameter. Try another parameter or change the base assumptions to find a tipping point.`,
                )}
              </>
            )}
          </Callout>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
              <div className="border-b border-line px-5 py-4">
                <p className="font-semibold text-ink">{tx("Bandingkan skenario _preset_", "Compare preset scenarios")}</p>
                <p className="text-xs text-muted">
                  {tx("Hasil operasional & pendapatan untuk ketiga _preset_ (tidak terpengaruh _slider_).", "Operating result & revenue for all three presets (unaffected by the sliders).")}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface text-xs text-muted">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-semibold">{t("Skenario", "Scenario")}</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right font-semibold">ONE · {t("hasil op.", "op. result")}</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right font-semibold">ACE · {t("hasil op.", "op. result")}</th>
                      <th className="px-3 py-2.5 text-right font-semibold">{t("Unggul", "Leader")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {presetTable.map((row) => {
                      const win = row.one.operatingResult >= row.ace.operatingResult ? "ONE" : "ACE";
                      return (
                        <tr key={row.key} className={cn(preset === row.key && "bg-soft/50")}>
                          <td className="px-3 py-2.5">
                            <p className="font-semibold text-ink">{tx(row.label)}</p>
                            <p className="text-[11px] text-muted">
                              {t("Pendapatan", "Revenue")} ONE {formatIDRCompact(row.one.revenue)} · ACE {formatIDRCompact(row.ace.revenue)}
                            </p>
                          </td>
                          <td className="tabular whitespace-nowrap px-3 py-2.5 text-right font-semibold text-ink">{formatIDRCompact(row.one.operatingResult)}</td>
                          <td className="tabular whitespace-nowrap px-3 py-2.5 text-right font-semibold text-ink">{formatIDRCompact(row.ace.operatingResult)}</td>
                          <td className="px-3 py-2.5 text-right">
                            <Badge tone={win === "ONE" ? "one" : "ace"}>{win}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <Scale className="h-4 w-4 text-brand-ink" /> {t("Aturan perbandingan yang adil", "Fair-comparison rules")}
              </p>
              <ul className="mt-3 space-y-1.5">
                {FAIR_RULES.map((r) => (
                  <li key={r.id} className="flex items-start gap-2 text-[13px] text-ink">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {tx(r)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[one, ace].map((r) => (
              <div key={r.strategy} className="rounded-2xl border border-line bg-card p-5 shadow-soft">
                <p className="font-semibold text-ink">
                  {t("Beban kerja", "Workload")} · {r.strategy.toUpperCase()}
                </p>
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-strong">
                        Product: {formatNumber(r.capacity.productRequired)} / {formatNumber(r.capacity.productAvailable)} {t("jam/bln", "hrs/mo")}
                      </span>
                      <span className="tabular font-semibold text-ink">{formatPercent(r.capacity.productUtilization)}</span>
                    </div>
                    <Progress value={r.capacity.productUtilization} tone="auto" className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-strong">
                        Strategy & Ops: {formatNumber(r.capacity.opsRequired)} / {formatNumber(r.capacity.opsAvailable)} {t("jam/bln", "hrs/mo")}
                      </span>
                      <span className="tabular font-semibold text-ink">{formatPercent(r.capacity.opsUtilization)}</span>
                    </div>
                    <Progress value={r.capacity.opsUtilization} tone="auto" className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Drawer
        open={explain}
        onClose={() => setExplain(false)}
        title={t("Penjelasan asumsi", "About the assumptions")}
        description={t("Semua angka bersifat ilustratif untuk diskusi akademik.", "Every figure is illustrative, for academic discussion.")}
      >
        <div className="space-y-5 text-sm">
          <Callout tone="warning" title={t("Bukan data perusahaan", "Not company data")}>
            {t(
              "Asumsi ini tidak berasal dari laporan keuangan Terang AI. Gunakan untuk menguji logika strategi, bukan memprediksi hasil nyata.",
              "These assumptions do not come from Terang AI's financial statements. Use them to test the strategic logic, not to predict real outcomes.",
            )}
          </Callout>
          <div>
            <p className="font-semibold text-ink">{t("Bagaimana ONE & ACE dibedakan?", "How do ONE & ACE differ?")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-strong">
              <li>{tx("ONE memakai 100% kapasitas penjualan & pengembangan untuk Interview, plus _uplift_ konversi eksplisit.", "ONE puts 100% of sales & development capacity into Interview, plus an explicit conversion uplift.")}</li>
              <li>{tx("ACE membagi kapasitas yang sama berdasarkan porsi Interview; sisanya mengakuisisi _organizer_ baru.", "ACE splits the same capacity by the Interview share; the rest acquires new organizers.")}</li>
              <li>{tx("ACE menanggung biaya koordinasi, _overhead_ pemasaran, kampanye kedua, dan _context switching_.", "ACE bears coordination costs, marketing overhead, a second campaign and context switching.")}</li>
              <li>{tx("Kedua strategi melayani _organizer_ yang sudah ada dan membayar _maintenance_ Events.", "Both strategies serve existing organizers and pay for Events maintenance.")}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">{t("Glosarium", "Glossary")}</p>
            <dl className="mt-2 space-y-2">
              {STRATEGY_GLOSSARY.map((g) => (
                <div key={g.term} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                  <dt className="font-semibold text-ink">{tx(`_${g.term}_`, g.term)}</dt>
                  <dd className="text-muted-strong">{tx(g.meaning)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
