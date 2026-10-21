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

type Fmt = "idr" | "idrc" | "pct" | "num" | "months" | "hours";
interface Def<S extends keyof Assumptions> {
  key: keyof Assumptions[S];
  label: string;
  min: number;
  max: number;
  step: number;
  fmt: Fmt;
  hint?: string;
}

const fmt = (v: number, f: Fmt) =>
  f === "idr" ? formatIDR(v) : f === "idrc" ? formatIDRCompact(v) : f === "pct" ? formatPercent(v) : f === "months" ? `${v} bln` : f === "hours" ? `${v} jam` : String(v);

const SHARED: Def<"shared">[] = [
  { key: "totalBudget", label: "Total anggaran periode", min: 1_000_000_000, max: 5_000_000_000, step: 100_000_000, fmt: "idrc" },
  { key: "productiveHoursPerPerson", label: "Jam produktif / orang / bln", min: 80, max: 160, step: 5, fmt: "hours", hint: "Headcount tetap 7 untuk kedua strategi." },
  { key: "fixedCostPerMonth", label: "Biaya tetap organisasi / bln", min: 30_000_000, max: 120_000_000, step: 1_000_000, fmt: "idrc" },
  { key: "developmentBudget", label: "Anggaran pengembangan tambahan", min: 0, max: 600_000_000, step: 10_000_000, fmt: "idrc", hint: "Sama untuk ONE & ACE; ACE membaginya per porsi kapasitas." },
  { key: "rampFactor", label: "Faktor ramp-up pelanggan", min: 0.2, max: 1, step: 0.05, fmt: "pct" },
  { key: "salesCapacityPilots", label: "Kapasitas pilot Interview (fokus penuh)", min: 5, max: 100, step: 1, fmt: "num" },
  { key: "salesCapacityOrganizers", label: "Kapasitas organizer baru (fokus penuh)", min: 5, max: 150, step: 1, fmt: "num" },
  { key: "existingOrganizers", label: "Organizer existing", min: 0, max: 60, step: 1, fmt: "num" },
  { key: "eventsMaintenancePerMonth", label: "Maintenance Events / bln (kedua strategi)", min: 0, max: 20_000_000, step: 500_000, fmt: "idrc" },
];
const EVENTS: Def<"events">[] = [
  { key: "eventsPerOrganizerPerYear", label: "Event per organizer / tahun", min: 1, max: 8, step: 0.1, fmt: "num" },
  { key: "netRevenuePerEvent", label: "Pendapatan bersih / event", min: 1_000_000, max: 25_000_000, step: 250_000, fmt: "idrc" },
  { key: "directCostPerEvent", label: "Biaya operasional langsung / event", min: 0, max: 8_000_000, step: 100_000, fmt: "idrc" },
  { key: "organizerRetention", label: "Retensi organizer", min: 0.1, max: 1, step: 0.01, fmt: "pct" },
  { key: "cacPerOrganizer", label: "CAC / organizer", min: 0, max: 10_000_000, step: 100_000, fmt: "idrc" },
];
const INTERVIEW: Def<"interview">[] = [
  { key: "pilotConversion", label: "Konversi pilot → berbayar", min: 0.05, max: 0.8, step: 0.01, fmt: "pct" },
  { key: "interviewsPerCustomerPerMonth", label: "Interview / pelanggan / bln", min: 10, max: 400, step: 5, fmt: "num" },
  { key: "netRevenuePerInterview", label: "Pendapatan bersih / interview", min: 10_000, max: 200_000, step: 1_000, fmt: "idr" },
  { key: "variableCostPerInterview", label: "Biaya variabel / interview", min: 0, max: 60_000, step: 500, fmt: "idr" },
  { key: "supportCostPerCustomerPerMonth", label: "Biaya support / pelanggan / bln", min: 0, max: 5_000_000, step: 100_000, fmt: "idrc" },
  { key: "renewalRate", label: "Renewal setelah kontrak 6 bln", min: 0.1, max: 1, step: 0.01, fmt: "pct" },
  { key: "cacPerPilot", label: "CAC / pilot", min: 0, max: 15_000_000, step: 250_000, fmt: "idrc" },
];
const ONE: Def<"one">[] = [
  { key: "conversionUpliftPp", label: "Uplift konversi karena fokus", min: 0, max: 0.15, step: 0.01, fmt: "pct", hint: "Asumsi eksplisit — set 0 untuk menghapus keunggulan fokus." },
  { key: "focusedCampaignCost", label: "Biaya kampanye terfokus", min: 0, max: 400_000_000, step: 5_000_000, fmt: "idrc" },
];
const ACE: Def<"ace">[] = [
  { key: "interviewShare", label: "Porsi kapasitas untuk Interview", min: 0.2, max: 0.9, step: 0.05, fmt: "pct", hint: "Sisanya untuk Terang Events. Tidak harus 50:50." },
  { key: "coordinationCostPerMonth", label: "Biaya koordinasi bersama / bln", min: 0, max: 20_000_000, step: 500_000, fmt: "idrc" },
  { key: "incrementalMarketingOverhead", label: "Overhead pemasaran tambahan", min: 0, max: 150_000_000, step: 5_000_000, fmt: "idrc" },
  { key: "interviewCampaignCost", label: "Kampanye Interview", min: 0, max: 300_000_000, step: 5_000_000, fmt: "idrc" },
  { key: "eventsCampaignCost", label: "Kampanye Events", min: 0, max: 200_000_000, step: 5_000_000, fmt: "idrc" },
  { key: "contextSwitchOverhead", label: "Overhead context switching", min: 0, max: 0.4, step: 0.01, fmt: "pct", hint: "Tambahan jam tim Product karena dua roadmap." },
];

function Group({ title, icon, children, defaultOpen, accent }: { title: string; icon: ReactNode; children: ReactNode; defaultOpen?: boolean; accent?: string }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-2xl border border-line bg-white">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-sm font-bold text-ink">
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
  const values = useScenarioStore((s) => s.assumptions[section]);
  const update = useScenarioStore((s) => s.update);
  return (
    <>
      {defs.map((d) => {
        const v = values[d.key] as unknown as number;
        return (
          <Slider
            key={String(d.key)}
            label={d.label}
            value={v}
            min={d.min}
            max={d.max}
            step={d.step}
            color={color}
            display={fmt(v, d.fmt)}
            hint={d.hint}
            onChange={(nv) => update(section, d.key, nv)}
          />
        );
      })}
    </>
  );
}

export function AssumptionPanel() {
  const horizon = useScenarioStore((s) => s.assumptions.shared.horizonMonths);
  const update = useScenarioStore((s) => s.update);
  return (
    <div className="space-y-3">
      <Group title="Asumsi bersama" icon={<Settings2 className="h-4 w-4" />} defaultOpen>
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">Horizon evaluasi</p>
          <div className="grid grid-cols-4 gap-1.5">
            {HORIZON_OPTIONS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => update("shared", "horizonMonths", h)}
                className={cn("rounded-lg py-1.5 text-xs font-bold ring-1 transition", horizon === h ? "bg-navy text-white ring-navy" : "bg-white text-muted-strong ring-line hover:ring-brand/40")}
              >
                {h} bln
              </button>
            ))}
          </div>
        </div>
        <Fields section="shared" defs={SHARED} color="#4a90e2" />
      </Group>
      <Group title="Terang Events" icon={<CalendarDays className="h-4 w-4" />} accent="bg-[#e5f6ff] text-sky-ink">
        <Fields section="events" defs={EVENTS} color="#39b7ff" />
      </Group>
      <Group title="AI Candidate Interview" icon={<Brain className="h-4 w-4" />} accent="bg-one-soft text-one">
        <Fields section="interview" defs={INTERVIEW} color="#2f66e0" />
      </Group>
      <Group title="Khusus ONE" icon={<Target className="h-4 w-4" />} accent="bg-one-soft text-one">
        <Fields section="one" defs={ONE} color="#2251c9" />
      </Group>
      <Group title="Khusus ACE" icon={<Layers className="h-4 w-4" />} accent="bg-ace-soft text-[#0a7aa6]">
        <Fields section="ace" defs={ACE} color="#0c9fd8" />
      </Group>
    </div>
  );
}
