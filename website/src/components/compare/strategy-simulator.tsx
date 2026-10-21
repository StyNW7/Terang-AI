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
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES } from "@/components/charts/chart-kit";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/modal";
import { Select } from "@/components/ui/form";
import { Callout, Progress } from "@/components/ui/misc";
import { InfoTip } from "@/components/ui/tooltip";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { STRATEGY_GLOSSARY } from "@/data/strategy";
import { AssumptionPanel } from "./assumption-panel";
import { cn } from "@/lib/utils";

const FAIR_RULES = [
  "Headcount sama: 7 personel untuk kedua strategi",
  "Periode evaluasi & biaya tetap identik",
  "Anggaran pengembangan & kapasitas penjualan sama",
  "Maintenance Events dihitung di kedua strategi (sekali saja)",
  "Uplift fokus ONE hanya lewat asumsi eksplisit",
  "Kompleksitas ACE memiliki biaya & efek kapasitas",
  "Tidak ada pemenang yang ditentukan sebelumnya",
];

function sensFormat(param: SensitivityParam, v: number) {
  const f = SENSITIVITY_PARAMS[param].format;
  return f === "percent" ? formatPercent(v) : f === "idr" ? formatIDRCompact(v) : formatNumber(v);
}

function StrategyCard({ r, other, variant }: { r: StrategyResult; other: StrategyResult; variant: "one" | "ace" }) {
  const isOne = variant === "one";
  const better = (a: number, b: number, higherIsBetter = true) => (higherIsBetter ? a > b : a < b);
  const rows: { label: string; value: string; win?: boolean; hint?: string }[] = [
    { label: "Produk aktif dikembangkan", value: isOne ? "1 · AI Candidate Interview" : "2 · Events + Interview" },
    { label: "Fokus pengembangan", value: isOne ? "AI Interview Intelligence Suite" : "Dual-Product Innovation Sprint" },
    { label: "Kanal akuisisi", value: isOne ? "Komunitas HR, LinkedIn, webinar" : "Kampus & asosiasi + HR & agensi" },
    { label: "Pendapatan", value: formatIDRCompact(r.revenue), win: better(r.revenue, other.revenue) },
    { label: "Kontribusi total", value: formatIDRCompact(r.totalContribution), win: better(r.totalContribution, other.totalContribution) },
    { label: "Contribution margin", value: formatPercent(r.contributionMargin), win: better(r.contributionMargin, other.contributionMargin) },
    { label: "Biaya pemasaran & akuisisi", value: formatIDRCompact(r.marketingCosts), win: better(r.marketingCosts, other.marketingCosts, false) },
    { label: "Overhead portofolio", value: formatIDRCompact(r.portfolioOverhead), win: better(r.portfolioOverhead, other.portfolioOverhead, false) },
    { label: "Konsumsi anggaran", value: formatPercent(r.budgetConsumption), win: better(r.budgetConsumption, other.budgetConsumption, false) },
    { label: "Utilisasi tim Product", value: formatPercent(r.capacity.productUtilization), win: better(r.capacity.productUtilization, other.capacity.productUtilization, false) },
    { label: "Utilisasi Strategy & Ops", value: formatPercent(r.capacity.opsUtilization), win: better(r.capacity.opsUtilization, other.capacity.opsUtilization, false) },
  ];
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className={cn("relative p-6 text-white", isOne ? "bg-one-gradient" : "bg-ace-gradient")}>
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/80">
              {isOne ? <Target className="h-4 w-4" /> : <Layers className="h-4 w-4" />} {isOne ? "PRO" : "KONTRA"}
            </p>
            <p className="font-display text-3xl font-extrabold">{isOne ? "ONE Strategy" : "ACE Strategy"}</p>
          </div>
          <Mascot name={isOne ? "target" : "puzzle"} size={76} float={false} className="-mr-2 -mt-2" />
        </div>
        <div className="relative mt-4 rounded-2xl bg-white/12 p-4 ring-1 ring-white/20">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            Hasil operasional (estimasi)
            <InfoTip align="left" title="Apa artinya?">
              Kontribusi total dikurangi biaya tetap, pengembangan, pemasaran, dan overhead portofolio. Bukan laba bersih — pajak & pembiayaan
              tidak dihitung.
            </InfoTip>
          </p>
          <p className="tabular font-display text-3xl font-extrabold">
            <AnimatedNumber value={r.operatingResult} format="idrCompact" />
          </p>
          <p className="text-xs text-white/75">{r.operatingResult >= other.operatingResult ? "Lebih tinggi pada asumsi ini" : "Lebih rendah pada asumsi ini"}</p>
        </div>
      </div>
      <dl className="flex-1 divide-y divide-line px-6">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <dt className="text-muted-strong">{row.label}</dt>
            <dd className="flex items-center gap-1.5 text-right font-semibold text-ink">
              <span className="tabular">{row.value}</span>
              {row.win && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" aria-label="lebih baik" />}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-line bg-surface p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Risiko utama</p>
        <ul className="mt-2 space-y-1">
          {r.risks.slice(0, 4).map((risk) => (
            <li key={risk} className="flex items-start gap-2 text-[13px] text-ink">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> {risk}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">Syarat scale</p>
        <p className="mt-1 text-[13px] text-muted-strong">
          {isOne
            ? "Expansion Gate lulus: kualitas, traksi, ekonomi, kapasitas & Responsible AI."
            : "Portfolio review per produk: invest / improve / reduce / pause berdasarkan KPI."}
        </p>
      </div>
    </div>
  );
}

export function StrategySimulator() {
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
        return { key: k, label: SCENARIO_PRESETS[k].label, one: b.one, ace: b.ace };
      }),
    [],
  );

  const leader = one.operatingResult === ace.operatingResult ? null : one.operatingResult > ace.operatingResult ? "ONE" : "ACE";
  const gap = Math.abs(one.operatingResult - ace.operatingResult);

  const compareData = [
    { metric: "Pendapatan", one: one.revenue, ace: ace.revenue },
    { metric: "Kontribusi", one: one.totalContribution, ace: ace.totalContribution },
    { metric: "Total biaya", one: one.totalCosts, ace: ace.totalCosts },
    { metric: "Hasil operasional", one: one.operatingResult, ace: ace.operatingResult },
  ];
  const costData = [
    { name: "ONE", tetap: one.fixedCosts, pengembangan: one.developmentCosts, pemasaran: one.marketingCosts, overhead: one.portfolioOverhead, langsung: one.totalCosts - one.fixedCosts - one.developmentCosts - one.marketingCosts - one.portfolioOverhead },
    { name: "ACE", tetap: ace.fixedCosts, pengembangan: ace.developmentCosts, pemasaran: ace.marketingCosts, overhead: ace.portfolioOverhead, langsung: ace.totalCosts - ace.fixedCosts - ace.developmentCosts - ace.marketingCosts - ace.portfolioOverhead },
  ];
  const sensData = sens.map((p) => ({ x: p.x, label: sensFormat(param, p.x), one: p.one, ace: p.ace }));

  const summaryText = () =>
    [
      "Terang AI — ONE vs ACE Simulator (asumsi ilustratif akademik)",
      `Skenario: ${preset === "custom" ? "Kustom" : SCENARIO_PRESETS[preset].label} · Horizon ${assumptions.shared.horizonMonths} bulan`,
      `ONE: pendapatan ${formatIDR(one.revenue)}, kontribusi ${formatIDR(one.totalContribution)}, hasil operasional ${formatIDR(one.operatingResult)}, utilisasi Product ${formatPercent(one.capacity.productUtilization)}`,
      `ACE: pendapatan ${formatIDR(ace.revenue)}, kontribusi ${formatIDR(ace.totalContribution)}, hasil operasional ${formatIDR(ace.operatingResult)}, utilisasi Product ${formatPercent(ace.capacity.productUtilization)}`,
      leader ? `Pada asumsi ini ${leader} unggul ${formatIDR(gap)} pada hasil operasional.` : "Kedua strategi setara pada asumsi ini.",
      crossover !== null ? `Titik balik ${SENSITIVITY_PARAMS[param].label}: ± ${sensFormat(param, crossover)}.` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText());
      toast.success("Ringkasan skenario disalin ke clipboard.");
    } catch {
      toast.error("Clipboard tidak tersedia di browser ini.");
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
    toast.success("Skenario diunduh sebagai JSON.");
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-navy-gradient p-6 text-white shadow-card sm:p-8">
        <div className="bg-grid-dark absolute inset-0 opacity-60" />
        <Mascot name="chart" size={160} className="absolute -bottom-8 right-6 hidden md:block" />
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-sky ring-1 ring-white/15">
              <Scale className="h-3.5 w-3.5" /> ONE vs ACE Strategy Simulator
            </span>
            <SourceLabel type="illustrative-assumption" dark />
          </div>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Two Strategies. One Resource Reality.</h2>
          <p className="mt-2 text-white/75">Ubah asumsi dan lihat kapan ONE atau ACE lebih menarik. Semua angka adalah asumsi akademik ilustratif — bukan hasil Terang AI.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(Object.keys(SCENARIO_PRESETS) as ScenarioPreset[]).map((k) => (
              <Button key={k} size="sm" variant={preset === k ? "light" : "glass"} onClick={() => { applyPreset(k); toast.info(`Preset ${SCENARIO_PRESETS[k].label} diterapkan.`); }}>
                {SCENARIO_PRESETS[k].label}
              </Button>
            ))}
            {preset === "custom" && <Badge tone="ace">Kustom</Badge>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => { reset(); toast.success("Asumsi direset ke Base Case."); }}>
          <RotateCcw className="h-4 w-4" /> Reset asumsi
        </Button>
        <Button size="sm" variant={showFormulas ? "dark" : "secondary"} onClick={() => setShowFormulas((s) => !s)}>
          <Sigma className="h-4 w-4" /> {showFormulas ? "Sembunyikan rumus" : "Tampilkan rumus"}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setExplain(true)}>
          <BookOpen className="h-4 w-4" /> Jelaskan asumsi
        </Button>
        <Button size="sm" variant="secondary" onClick={downloadJson}>
          <Download className="h-4 w-4" /> Unduh JSON
        </Button>
        <Button size="sm" variant="secondary" onClick={copySummary}>
          <ClipboardCopy className="h-4 w-4" /> Salin ringkasan
        </Button>
      </div>

      <AnimatePresence>
        {showFormulas && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {FORMULAS.map((f) => (
                <div key={f.name} className="rounded-2xl border border-line bg-white p-4 shadow-soft">
                  <p className="text-sm font-bold text-ink">{f.name}</p>
                  <code className="mt-2 block rounded-lg bg-navy px-3 py-2 text-[12px] leading-relaxed text-sky">{f.formula}</code>
                  <p className="mt-2 text-xs text-muted-strong">{f.note}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 2xl:grid-cols-[380px_1fr] xl:grid-cols-[340px_1fr]">
        <aside className="scrollbar-thin h-fit xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto xl:pr-1">
          <AssumptionPanel />
        </aside>

        <div className="min-w-0 space-y-6">
          <motion.div
            key={leader ?? "tie"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-ink">
              {leader ? (
                <>
                  Pada asumsi saat ini, <strong className={leader === "ONE" ? "text-one" : "text-[#0a7aa6]"}>{leader}</strong> unggul{" "}
                  <strong className="tabular">{formatIDRCompact(gap)}</strong> pada hasil operasional {assumptions.shared.horizonMonths} bulan.
                </>
              ) : (
                "Kedua strategi menghasilkan hasil operasional yang setara pada asumsi ini."
              )}{" "}
              <span className="text-muted-strong">Ini bukan kesimpulan final — ubah asumsi untuk menguji kondisinya.</span>
            </p>
            <SourceLabel type="illustrative-assumption" compact />
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <StrategyCard r={one} other={ace} variant="one" />
            <StrategyCard r={ace} other={one} variant="ace" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame
              title="Perbandingan finansial"
              description={`Horizon ${assumptions.shared.horizonMonths} bulan · IDR.`}
              legend={[
                { label: "ONE", color: SERIES.one },
                { label: "ACE", color: SERIES.ace },
              ]}
              table={{ columns: ["Metrik", "ONE", "ACE"], rows: compareData.map((d) => [d.metric, formatIDR(d.one), formatIDR(d.ace)]) }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barGap={2}>
                  <CartesianGrid vertical={false} stroke={SERIES.grid} />
                  <XAxis dataKey="metric" {...AXIS_PROPS} />
                  <YAxis width={72} tickFormatter={(v: number) => formatIDRCompact(v)} {...AXIS_PROPS} />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
                  <Bar dataKey="one" name="ONE" fill={SERIES.one} radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="ace" name="ACE" fill={SERIES.ace} radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
            <ChartFrame
              title="Struktur biaya"
              description="Setiap biaya dihitung sekali."
              legend={[
                { label: "Biaya tetap", color: "#17395e" },
                { label: "Pengembangan", color: "#2f66e0" },
                { label: "Pemasaran & akuisisi", color: "#39b7ff" },
                { label: "Overhead portofolio", color: "#0c9fd8" },
                { label: "Biaya langsung produk", color: "#94a3b8" },
              ]}
              table={{
                columns: ["Strategi", "Tetap", "Pengembangan", "Pemasaran", "Overhead", "Langsung"],
                rows: costData.map((c) => [c.name, formatIDRCompact(c.tetap), formatIDRCompact(c.pengembangan), formatIDRCompact(c.pemasaran), formatIDRCompact(c.overhead), formatIDRCompact(c.langsung)]),
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke={SERIES.grid} />
                  <XAxis type="number" tickFormatter={(v: number) => formatIDRCompact(v)} {...AXIS_PROPS} />
                  <YAxis type="category" dataKey="name" width={44} {...AXIS_PROPS} />
                  <Tooltip cursor={{ fill: "rgba(74,144,226,0.06)" }} content={(p) => <ChartTooltip {...p} format="idrCompact" />} />
                  <Bar dataKey="tetap" name="Biaya tetap" stackId="c" fill="#17395e" stroke="#fff" strokeWidth={2} maxBarSize={44} />
                  <Bar dataKey="pengembangan" name="Pengembangan" stackId="c" fill="#2f66e0" stroke="#fff" strokeWidth={2} maxBarSize={44} />
                  <Bar dataKey="pemasaran" name="Pemasaran & akuisisi" stackId="c" fill="#39b7ff" stroke="#fff" strokeWidth={2} maxBarSize={44} />
                  <Bar dataKey="overhead" name="Overhead portofolio" stackId="c" fill="#0c9fd8" stroke="#fff" strokeWidth={2} maxBarSize={44} />
                  <Bar dataKey="langsung" name="Biaya langsung produk" stackId="c" fill="#94a3b8" stroke="#fff" strokeWidth={2} radius={[0, 4, 4, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          </div>

          <ChartFrame
            title="Kapan ONE atau ACE lebih menarik?"
            description="Analisis sensitivitas: geser satu parameter, asumsi lain tetap."
            height={300}
            legend={[
              { label: "ONE", color: SERIES.one },
              { label: "ACE", color: SERIES.ace },
            ]}
            action={
              <Select value={param} onChange={(e) => setParam(e.target.value as SensitivityParam)} className="h-8 w-64 text-xs" aria-label="Parameter sensitivitas">
                {(Object.keys(SENSITIVITY_PARAMS) as SensitivityParam[]).map((k) => (
                  <option key={k} value={k}>
                    {SENSITIVITY_PARAMS[k].label}
                  </option>
                ))}
              </Select>
            }
            table={{ columns: [SENSITIVITY_PARAMS[param].label, "ONE", "ACE"], rows: sensData.map((d) => [d.label, formatIDRCompact(d.one), formatIDRCompact(d.ace)]) }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensData} margin={{ top: 16, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={SERIES.grid} />
                <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => sensFormat(param, v)} {...AXIS_PROPS} />
                <YAxis width={72} tickFormatter={(v: number) => formatIDRCompact(v)} {...AXIS_PROPS} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Tooltip content={(p) => <ChartTooltip {...p} format="idrCompact" labelFmt={(l) => sensFormat(param, Number(l))} />} />
                {crossover !== null && <ReferenceLine x={crossover} stroke="#e2930f" strokeDasharray="4 4" label={{ value: "titik balik", position: "top", fontSize: 11, fill: "#9a5b00" }} />}
                <Line type="monotone" dataKey="one" name="ONE" stroke={SERIES.one} strokeWidth={2.5} dot={{ r: 3.5, stroke: "#fff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="ace" name="ACE" stroke={SERIES.ace} strokeWidth={2.5} dot={{ r: 3.5, stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartFrame>
          <Callout tone={crossover !== null ? "info" : "warning"} title="Interpretasi sensitivitas">
            {crossover !== null ? (
              <>
                Pada parameter <strong>{SENSITIVITY_PARAMS[param].label}</strong>, keunggulan berpindah di sekitar <strong>{sensFormat(param, crossover)}</strong>. Di sisi kiri
                titik ini {sens[0].one > sens[0].ace ? "ONE" : "ACE"} unggul; di sisi kanan {sens[sens.length - 1].one > sens[sens.length - 1].ace ? "ONE" : "ACE"} unggul.
              </>
            ) : (
              <>
                Dalam rentang yang diuji, {sens[0].one > sens[0].ace ? "ONE" : "ACE"} selalu unggul pada parameter ini. Coba parameter lain atau ubah asumsi dasar
                untuk menemukan titik balik.
              </>
            )}
          </Callout>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <div className="border-b border-line px-5 py-4">
                <p className="font-bold text-ink">Bandingkan skenario preset</p>
                <p className="text-xs text-muted">Hasil operasional & pendapatan untuk ketiga preset (tidak terpengaruh slider).</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-surface text-xs text-muted">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold">Skenario</th>
                      <th className="px-4 py-2.5 text-right font-semibold">ONE · hasil op.</th>
                      <th className="px-4 py-2.5 text-right font-semibold">ACE · hasil op.</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Unggul</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {presetTable.map((row) => {
                      const win = row.one.operatingResult >= row.ace.operatingResult ? "ONE" : "ACE";
                      return (
                        <tr key={row.key} className={cn(preset === row.key && "bg-soft/50")}>
                          <td className="px-4 py-2.5">
                            <p className="font-semibold text-ink">{row.label}</p>
                            <p className="text-[11px] text-muted">Pendapatan ONE {formatIDRCompact(row.one.revenue)} · ACE {formatIDRCompact(row.ace.revenue)}</p>
                          </td>
                          <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">{formatIDRCompact(row.one.operatingResult)}</td>
                          <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">{formatIDRCompact(row.ace.operatingResult)}</td>
                          <td className="px-4 py-2.5 text-right">
                            <Badge tone={win === "ONE" ? "one" : "ace"}>{win}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
              <p className="flex items-center gap-2 font-bold text-ink">
                <Scale className="h-4 w-4 text-brand-ink" /> Aturan perbandingan yang adil
              </p>
              <ul className="mt-3 space-y-1.5">
                {FAIR_RULES.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-[13px] text-ink">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[one, ace].map((r) => (
              <div key={r.strategy} className="rounded-2xl border border-line bg-white p-5 shadow-soft">
                <p className="font-bold text-ink">Beban kerja · {r.strategy.toUpperCase()}</p>
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-strong">Product: {formatNumber(r.capacity.productRequired)} / {formatNumber(r.capacity.productAvailable)} jam/bln</span>
                      <span className="tabular font-bold text-ink">{formatPercent(r.capacity.productUtilization)}</span>
                    </div>
                    <Progress value={r.capacity.productUtilization} tone="auto" className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-strong">Strategy & Ops: {formatNumber(r.capacity.opsRequired)} / {formatNumber(r.capacity.opsAvailable)} jam/bln</span>
                      <span className="tabular font-bold text-ink">{formatPercent(r.capacity.opsUtilization)}</span>
                    </div>
                    <Progress value={r.capacity.opsUtilization} tone="auto" className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Drawer open={explain} onClose={() => setExplain(false)} title="Penjelasan asumsi" description="Semua angka bersifat ilustratif untuk diskusi akademik.">
        <div className="space-y-5 text-sm">
          <Callout tone="warning" title="Bukan data perusahaan">
            Asumsi ini tidak berasal dari laporan keuangan Terang AI. Gunakan untuk menguji logika strategi, bukan memprediksi hasil nyata.
          </Callout>
          <div>
            <p className="font-bold text-ink">Bagaimana ONE & ACE dibedakan?</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-strong">
              <li>ONE memakai 100% kapasitas penjualan & pengembangan untuk Interview, plus uplift konversi eksplisit.</li>
              <li>ACE membagi kapasitas yang sama berdasarkan porsi Interview; sisanya mengakuisisi organizer baru.</li>
              <li>ACE menanggung biaya koordinasi, overhead pemasaran, kampanye kedua, dan context switching.</li>
              <li>Kedua strategi melayani organizer existing dan membayar maintenance Events.</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-ink">Glosarium</p>
            <dl className="mt-2 space-y-2">
              {STRATEGY_GLOSSARY.map((g) => (
                <div key={g.term} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                  <dt className="font-semibold text-ink">{g.term}</dt>
                  <dd className="text-muted-strong">{g.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
