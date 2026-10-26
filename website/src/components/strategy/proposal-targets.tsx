"use client";

import { ArrowRight, Flag, Info, Users } from "lucide-react";
import { FINANCIAL_CAVEATS, FINANCIAL_PROJECTION, FTE_TARGET, IMPLEMENTATION, KPI_TARGETS, PROJECTION_NOTE } from "@/data/proposal";
import { SourceLabel } from "@/components/shared/source-label";
import { InfoTip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { formatFte } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { keyOf, useI18n } from "@/lib/i18n";

const FTE_ROWS = [
  { key: "interview", label: "AI Candidate Interview", color: "bg-interview" },
  { key: "events", label: "Terang Events", color: "bg-events" },
  { key: "shared", label: { id: "Operasional bersama", en: "Shared operations" }, color: "bg-series-muted" },
] as const;

/** The proposal's implementation period, team split and KPI targets for one strategy. */
export function ProposalTargets({ strategy }: { strategy: "one" | "ace" }) {
  const { t, tx, locale } = useI18n();
  const fte = FTE_TARGET[strategy];
  const kpi = KPI_TARGETS[strategy];
  const isOne = strategy === "one";

  return (
    <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-[0.12em]", isOne ? "text-one-ink" : "text-ace-ink")}>
            {t(`Usulan ${strategy.toUpperCase()} · ${IMPLEMENTATION[strategy].months} bulan`, `${strategy.toUpperCase()} proposal · ${IMPLEMENTATION[strategy].months} months`)}
          </p>
          <h3 className="text-xl font-semibold text-ink">{t("Target KPI & pembagian waktu tim", "KPI targets & team time split")}</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-strong">{tx(PROJECTION_NOTE)}</p>
        </div>
        <SourceLabel type="proposal-projection" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.35fr]">
        <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Users className="h-4 w-4 text-muted" /> {t("Pembagian waktu 7 personel", "Time split across 7 people")}
          </p>
          <div className="mt-4 space-y-3">
            {FTE_ROWS.map((row) => {
              const value = fte[row.key];
              return (
                <div key={row.key}>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-ink">{typeof row.label === "string" ? row.label : row.label[locale]}</span>
                    <span className="tabular font-semibold text-ink">
                      {value ? `${formatFte(value)} FTE` : t("_Maintenance_ saja", "Maintenance only")}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-track">
                    <div className={cn("h-full rounded-full", row.color)} style={{ width: `${(value / 7) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            {tx(fte.note)} {t("FTE = pembagian waktu, bukan perekrutan tambahan.", "FTE = time allocation, not additional hiring.")}
          </p>
        </div>

        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Flag className="h-4 w-4 text-muted" /> {tx(kpi.horizon)}
          </p>
          <div className={cn("mt-3 grid grid-cols-2 gap-2.5", kpi.items.length % 2 === 0 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
            {kpi.items.map((k) => (
              <div key={keyOf(k.label)} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                <p className={cn("tabular font-display text-2xl font-semibold", isOne ? "text-one-ink" : "text-ace-ink")}>{tx(k.value)}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-muted-strong">{tx(k.label)}</p>
              </div>
            ))}
          </div>
          {kpi.quality && (
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {kpi.quality.map((k) => (
                <div key={keyOf(k.label)} className="flex items-center justify-between gap-3 rounded-xl p-3 ring-1 ring-line">
                  <span className="text-[12.5px] leading-snug text-muted-strong">
                    {tx(k.label)}
                    {k.hint && <span className="block text-[11px] text-muted">{tx(k.hint)}</span>}
                  </span>
                  <span className="tabular shrink-0 text-sm font-semibold text-ink">{tx(k.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Long-term financial projections of both strategies, with the caveats needed to read them fairly. */
export function FinancialProjection({ focus }: { focus?: "one" | "ace" }) {
  const { t, tx } = useI18n();
  return (
    <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">{t("Kelayakan finansial", "Financial feasibility")}</p>
          <h3 className="text-xl font-semibold text-ink">{t("Proyeksi jangka panjang ONE vs ACE", "Long-term projection: ONE vs ACE")}</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-strong">
            {t(
              "Hasil model proposal. Masa implementasi awal bukan akhir operasi — pendapatan terus tumbuh setelahnya.",
              "Results of the proposal model. The initial implementation is not the end of operations — revenue keeps building afterwards.",
            )}
          </p>
        </div>
        <SourceLabel type="proposal-projection" />
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-[13px] sm:text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th className="py-2.5 pr-2 font-semibold">{t("Metrik (proyeksi)", "Metric (projected)")}</th>
              <th className={cn("py-2.5 pl-2 text-right font-semibold", focus === "one" && "text-one-ink")}>ONE · {t("36 bln", "36 mo")}</th>
              <th className={cn("py-2.5 pl-2 text-right font-semibold", focus === "ace" && "text-ace-ink")}>ACE · {t("48 bln", "48 mo")}</th>
            </tr>
          </thead>
          <tbody>
            {FINANCIAL_PROJECTION.map((row) => (
              <tr key={row.key} className="border-b border-line/70 last:border-0">
                <td className="py-2.5 pr-2 text-ink">
                  <span className="inline-flex items-center gap-1.5">
                    {tx(row.label)}
                    {row.hint && <InfoTip>{tx(row.hint)}</InfoTip>}
                  </span>
                </td>
                <td className={cn("tabular py-2.5 pl-2 text-right font-semibold", focus === "one" ? "text-one-ink" : "text-ink")}>{tx(row.one)}</td>
                <td className={cn("tabular py-2.5 pl-2 text-right font-semibold", focus === "ace" ? "text-ace-ink" : "text-ink")}>{tx(row.ace)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 space-y-1.5">
        {FINANCIAL_CAVEATS.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {tx(c)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Compact side-by-side summary of the proposal, for the Super Admin overview. */
export function ProposalSnapshot({ className }: { className?: string }) {
  const { t, tx } = useI18n();
  const row = (key: string) => FINANCIAL_PROJECTION.find((r) => r.key === key)!;
  const rows = [
    { label: t("Implementasi awal", "Initial implementation"), one: t("12 bulan · 4 fase", "12 months · 4 phases"), ace: t("18 bulan · 6 fase", "18 months · 6 phases") },
    { label: t("Pembagian tim (FTE)", "Team split (FTE)"), one: t("5,6 Interview · 1,4 bersama", "5.6 Interview · 1.4 shared"), ace: t("3,15 · 2,65 · 1,20", "3.15 · 2.65 · 1.20") },
    { label: t("Target komersial utama", "Headline commercial target"), one: t("18 akun berbayar (M12)", "18 paying accounts (M12)"), ace: t("10 akun Interview + 12 organizer (M18)", "10 Interview accounts + 12 organizers (M18)") },
    { label: tx(row("npv").label), one: tx(row("npv").one), ace: tx(row("npv").ace) },
    { label: tx(row("payback").label), one: tx(row("payback").one), ace: tx(row("payback").ace) },
  ];
  return (
    <div className={cn("rounded-2xl border border-line bg-card p-5 shadow-soft", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-ink">{t("Ringkasan proposal ONE vs ACE", "ONE vs ACE proposal summary")}</p>
          <p className="mt-0.5 text-[13px] text-muted-strong">{tx(PROJECTION_NOTE)}</p>
        </div>
        <SourceLabel type="proposal-projection" compact />
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-subtle text-[12px] font-medium text-muted">
          <span className="px-3 py-2">{t("Aspek", "Aspect")}</span>
          <span className="px-3 py-2 text-one-ink">ONE · PRO</span>
          <span className="px-3 py-2 text-ace-ink">ACE · {t("KONTRA", "CONTRA")}</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-line text-[13px]">
            <span className="px-3 py-2.5 text-muted-strong">{r.label}</span>
            <span className="tabular px-3 py-2.5 font-semibold text-ink">{r.one}</span>
            <span className="tabular px-3 py-2.5 font-semibold text-ink">{r.ace}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href="/strategies/one" size="sm" variant="secondary">
          {t("Rencana ONE", "ONE plan")} <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Button href="/strategies/ace" size="sm" variant="secondary">
          {t("Rencana ACE", "ACE plan")} <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
