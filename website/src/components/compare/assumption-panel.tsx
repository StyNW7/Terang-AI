"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Brain, CalendarDays, ChevronDown, Layers, Settings2, Target } from "lucide-react";
import type { Assumptions } from "@/types/finance";
import { useScenarioStore } from "@/store/scenario-store";
import { HORIZON_OPTIONS } from "@/data/scenarios";
import { Slider } from "@/components/ui/slider";
import { formatIDR, formatIDRCompact, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { L, useI18n, type Bilingual } from "@/lib/i18n";

type Fmt = "idr" | "idrc" | "pct" | "num" | "months" | "hours";
interface Def<S extends keyof Assumptions> {
  key: keyof Assumptions[S];
  label: Bilingual;
  min: number;
  max: number;
  step: number;
  fmt: Fmt;
  hint?: Bilingual;
}

const fmt = (v: number, f: Fmt, en: boolean) =>
  f === "idr"
    ? formatIDR(v)
    : f === "idrc"
      ? formatIDRCompact(v)
      : f === "pct"
        ? formatPercent(v)
        : f === "months"
          ? `${v} ${en ? "mo" : "bln"}`
          : f === "hours"
            ? `${v} ${en ? "hrs" : "jam"}`
            : String(v);

const SHARED: Def<"shared">[] = [
  { key: "totalBudget", label: L("Total anggaran periode", "Total budget for the period"), min: 1_000_000_000, max: 5_000_000_000, step: 100_000_000, fmt: "idrc" },
  {
    key: "productiveHoursPerPerson",
    label: L("Jam produktif / orang / bln", "Productive hours / person / month"),
    min: 80,
    max: 160,
    step: 5,
    fmt: "hours",
    hint: L("_Headcount_ tetap 7 untuk kedua strategi.", "Headcount stays at 7 for both strategies."),
  },
  { key: "fixedCostPerMonth", label: L("Biaya tetap organisasi / bln", "Fixed organisational cost / month"), min: 30_000_000, max: 120_000_000, step: 1_000_000, fmt: "idrc" },
  {
    key: "developmentBudget",
    label: L("Anggaran pengembangan tambahan", "Additional development budget"),
    min: 0,
    max: 600_000_000,
    step: 10_000_000,
    fmt: "idrc",
    hint: L("Sama untuk ONE & ACE; ACE membaginya per porsi kapasitas.", "The same for ONE & ACE; ACE splits it by capacity share."),
  },
  { key: "rampFactor", label: L("Faktor _ramp-up_ pelanggan", "Customer ramp-up factor"), min: 0.2, max: 1, step: 0.05, fmt: "pct" },
  { key: "salesCapacityPilots", label: L("Kapasitas _pilot_ Interview (fokus penuh)", "Interview pilot capacity (full focus)"), min: 5, max: 100, step: 1, fmt: "num" },
  { key: "salesCapacityOrganizers", label: L("Kapasitas _organizer_ baru (fokus penuh)", "New-organizer capacity (full focus)"), min: 5, max: 150, step: 1, fmt: "num" },
  { key: "existingOrganizers", label: L("_Organizer_ yang sudah ada", "Existing organizers"), min: 0, max: 60, step: 1, fmt: "num" },
  { key: "eventsMaintenancePerMonth", label: L("_Maintenance_ Events / bln (kedua strategi)", "Events maintenance / month (both strategies)"), min: 0, max: 20_000_000, step: 500_000, fmt: "idrc" },
];
const EVENTS: Def<"events">[] = [
  { key: "eventsPerOrganizerPerYear", label: L("_Event_ per _organizer_ / tahun", "Events per organizer / year"), min: 1, max: 8, step: 0.1, fmt: "num" },
  { key: "netRevenuePerEvent", label: L("Pendapatan bersih / _event_", "Net revenue / event"), min: 1_000_000, max: 25_000_000, step: 250_000, fmt: "idrc" },
  { key: "directCostPerEvent", label: L("Biaya operasional langsung / _event_", "Direct operating cost / event"), min: 0, max: 8_000_000, step: 100_000, fmt: "idrc" },
  { key: "organizerRetention", label: L("Retensi _organizer_", "Organizer retention"), min: 0.1, max: 1, step: 0.01, fmt: "pct" },
  { key: "cacPerOrganizer", label: L("CAC / _organizer_", "CAC / organizer"), min: 0, max: 10_000_000, step: 100_000, fmt: "idrc" },
];
const INTERVIEW: Def<"interview">[] = [
  { key: "pilotConversion", label: L("Konversi _pilot_ → berbayar", "Pilot → paid conversion"), min: 0.05, max: 0.8, step: 0.01, fmt: "pct" },
  { key: "interviewsPerCustomerPerMonth", label: L("_Interview_ / pelanggan / bln", "Interviews / customer / month"), min: 10, max: 400, step: 5, fmt: "num" },
  { key: "netRevenuePerInterview", label: L("Pendapatan bersih / _interview_", "Net revenue / interview"), min: 10_000, max: 200_000, step: 1_000, fmt: "idr" },
  { key: "variableCostPerInterview", label: L("Biaya variabel / _interview_", "Variable cost / interview"), min: 0, max: 60_000, step: 500, fmt: "idr" },
  { key: "supportCostPerCustomerPerMonth", label: L("Biaya _support_ / pelanggan / bln", "Support cost / customer / month"), min: 0, max: 5_000_000, step: 100_000, fmt: "idrc" },
  { key: "renewalRate", label: L("_Renewal_ setelah kontrak 6 bln", "Renewal after a 6-month contract"), min: 0.1, max: 1, step: 0.01, fmt: "pct" },
  { key: "cacPerPilot", label: L("CAC / _pilot_", "CAC / pilot"), min: 0, max: 15_000_000, step: 250_000, fmt: "idrc" },
];
const ONE: Def<"one">[] = [
  {
    key: "conversionUpliftPp",
    label: L("_Uplift_ konversi karena fokus", "Conversion uplift from focus"),
    min: 0,
    max: 0.15,
    step: 0.01,
    fmt: "pct",
    hint: L("Asumsi eksplisit — set 0 untuk menghapus keunggulan fokus.", "An explicit assumption — set it to 0 to remove the focus advantage."),
  },
  { key: "focusedCampaignCost", label: L("Biaya kampanye terfokus", "Focused campaign cost"), min: 0, max: 400_000_000, step: 5_000_000, fmt: "idrc" },
];
const ACE: Def<"ace">[] = [
  {
    key: "interviewShare",
    label: L("Porsi kapasitas untuk Interview", "Capacity share for Interview"),
    min: 0.2,
    max: 0.9,
    step: 0.05,
    fmt: "pct",
    hint: L("Sisanya untuk Terang Events. Tidak harus 50:50.", "The rest goes to Terang Events. It need not be 50:50."),
  },
  { key: "coordinationCostPerMonth", label: L("Biaya koordinasi bersama / bln", "Shared coordination cost / month"), min: 0, max: 20_000_000, step: 500_000, fmt: "idrc" },
  { key: "incrementalMarketingOverhead", label: L("_Overhead_ pemasaran tambahan", "Additional marketing overhead"), min: 0, max: 150_000_000, step: 5_000_000, fmt: "idrc" },
  { key: "interviewCampaignCost", label: L("Kampanye Interview", "Interview campaign"), min: 0, max: 300_000_000, step: 5_000_000, fmt: "idrc" },
  { key: "eventsCampaignCost", label: L("Kampanye Events", "Events campaign"), min: 0, max: 200_000_000, step: 5_000_000, fmt: "idrc" },
  {
    key: "contextSwitchOverhead",
    label: L("_Overhead context switching_", "Context-switching overhead"),
    min: 0,
    max: 0.4,
    step: 0.01,
    fmt: "pct",
    hint: L("Tambahan jam tim _Product_ karena dua _roadmap_.", "Extra Product-team hours from running two roadmaps."),
  },
];

function Group({ title, icon, children, defaultOpen, accent }: { title: ReactNode; icon: ReactNode; children: ReactNode; defaultOpen?: boolean; accent?: string }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-2xl border border-line bg-card">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className={cn("grid h-7 w-7 place-items-center rounded-lg", accent ?? "bg-soft text-brand-ink")}>{icon}</span>
          {title}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-4 border-t border-line px-4 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Fields<S extends keyof Assumptions>({ section, defs, color }: { section: S; defs: Def<S>[]; color: string }) {
  const { tx, locale } = useI18n();
  const values = useScenarioStore((s) => s.assumptions[section]);
  const update = useScenarioStore((s) => s.update);
  return (
    <>
      {defs.map((d) => {
        const v = values[d.key] as unknown as number;
        return (
          <Slider
            key={String(d.key)}
            label={tx(d.label)}
            value={v}
            min={d.min}
            max={d.max}
            step={d.step}
            color={color}
            display={fmt(v, d.fmt, locale === "en")}
            hint={d.hint && tx(d.hint)}
            onChange={(nv) => update(section, d.key, nv)}
          />
        );
      })}
    </>
  );
}

export function AssumptionPanel() {
  const { t } = useI18n();
  const horizon = useScenarioStore((s) => s.assumptions.shared.horizonMonths);
  const update = useScenarioStore((s) => s.update);
  return (
    <div className="space-y-3">
      <Group title={t("Asumsi bersama", "Shared assumptions")} icon={<Settings2 className="h-4 w-4" />} defaultOpen>
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">{t("Horizon evaluasi", "Evaluation horizon")}</p>
          <div className="grid grid-cols-4 gap-1.5">
            {HORIZON_OPTIONS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => update("shared", "horizonMonths", h)}
                className={cn("rounded-lg py-1.5 text-xs font-semibold ring-1 transition", horizon === h ? "bg-navy text-white ring-navy" : "bg-card text-muted-strong ring-line hover:ring-brand/40")}
              >
                {h} {t("bln", "mo")}
              </button>
            ))}
          </div>
        </div>
        <Fields section="shared" defs={SHARED} color="#4a90e2" />
      </Group>
      <Group title="Terang Events" icon={<CalendarDays className="h-4 w-4" />} accent="bg-sky-soft text-sky-ink">
        <Fields section="events" defs={EVENTS} color="#39b7ff" />
      </Group>
      <Group title="AI Candidate Interview" icon={<Brain className="h-4 w-4" />} accent="bg-one-soft text-one-ink">
        <Fields section="interview" defs={INTERVIEW} color="#2f66e0" />
      </Group>
      <Group title={t("Khusus ONE", "ONE only")} icon={<Target className="h-4 w-4" />} accent="bg-one-soft text-one-ink">
        <Fields section="one" defs={ONE} color="#2251c9" />
      </Group>
      <Group title={t("Khusus ACE", "ACE only")} icon={<Layers className="h-4 w-4" />} accent="bg-ace-soft text-ace-ink">
        <Fields section="ace" defs={ACE} color="#0c9fd8" />
      </Group>
    </div>
  );
}
