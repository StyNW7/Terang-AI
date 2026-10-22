"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ArrowRight, Brain, Briefcase, CalendarDays, CheckCircle2, GraduationCap, Handshake, Megaphone, Network } from "lucide-react";
import { useScenarioStore } from "@/store/scenario-store";
import { useOperationsStore } from "@/store/operations-store";
import { computeStrategy } from "@/lib/finance";
import { validateAllocation, poolTotal } from "@/lib/resource-planner";
import { POOLS } from "@/data/team";
import { formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { Funnel } from "@/components/strategy/funnel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/misc";
import { Segmented } from "@/components/ui/tabs";
import { SourceLabel } from "@/components/shared/source-label";
import type { PoolKey } from "@/types/operations";
import { cn, safeDivide } from "@/lib/utils";

const CRM = [
  { name: "Univ. Cakrawala Nusantara", type: "Universitas", product: "events", stage: "Pilot event", owner: "S1", next: "Evaluasi pasca-acara" },
  { name: "Asosiasi Pengajar Bisnis Digital", type: "Asosiasi", product: "events", stage: "Demo", owner: "S1", next: "Proposal kemitraan" },
  { name: "Komunitas Data Muda Bandung", type: "Komunitas", product: "events", stage: "Repeat", owner: "S2", next: "Paket repeat organizer" },
  { name: "Institut Teknologi Lintas Samudra", type: "Universitas", product: "events", stage: "Lead", owner: "S1", next: "Jadwalkan demo" },
  { name: "PT Sinar Ritel Nusantara", type: "Perusahaan", product: "interview", stage: "Pilot", owner: "CEO", next: "Review ROI pilot" },
  { name: "Talenta Prima Agency", type: "Agensi rekrutmen", product: "interview", stage: "Demo", owner: "S1", next: "Pilot 30 hari" },
  { name: "PT Bahari Telekomunikasi", type: "Perusahaan", product: "interview", stage: "Lead", owner: "S1", next: "Kualifikasi kebutuhan" },
  { name: "Pusat Karier Universitas Arunika", type: "Universitas", product: "both", stage: "Eksperimen", owner: "CEO", next: "Career fair bersama" },
] as const;

export function AcePillarCoordinate() {
  const assumptions = useScenarioStore((s) => s.assumptions);
  const allocation = useOperationsStore((s) => s.allocation);
  const r = useMemo(() => computeStrategy("ace", assumptions), [assumptions]);
  const issues = useMemo(() => validateAllocation(allocation, "ace").filter((i) => i.severity !== "info"), [allocation]);
  const [crmFilter, setCrmFilter] = useState<"all" | "events" | "interview">("all");

  const ev = r.events;
  const iv = r.interview;
  const pilots = assumptions.shared.salesCapacityPilots * assumptions.ace.interviewShare;
  const newOrg = assumptions.shared.salesCapacityOrganizers * (1 - assumptions.ace.interviewShare);

  const eventsFunnel = [
    { label: "Institusi dijangkau", value: Math.round(newOrg / 0.03) },
    { label: "Organizer lead", value: Math.round(newOrg / 0.25) },
    { label: "Demo organizer", value: Math.round(newOrg / 0.55) },
    { label: "Organizer baru", value: Math.round(newOrg) },
    { label: "Organizer berulang", value: Math.round(newOrg * assumptions.events.organizerRetention) },
  ];
  const interviewFunnel = [
    { label: "Awareness HR", value: Math.round(pilots / 0.0063) },
    { label: "Qualified lead", value: Math.round(pilots / 0.1575) },
    { label: "Demo", value: Math.round(pilots / 0.45) },
    { label: "Pilot", value: Math.round(pilots) },
    { label: "Pelanggan berbayar", value: iv.customers },
  ];

  const budgetLines = [
    { label: "Kampanye Interview", value: assumptions.ace.interviewCampaignCost, color: "#2f66e0" },
    { label: "Kampanye Events", value: assumptions.ace.eventsCampaignCost, color: "#39b7ff" },
    { label: "Akuisisi (CAC)", value: iv.acquisitionCost + ev.acquisitionCost, color: "#4a90e2" },
    { label: "Overhead portofolio", value: r.portfolioOverhead, color: "#94a3b8" },
  ];
  const marketingTotal = budgetLines.reduce((a, b) => a + b.value, 0);

  const crm = CRM.filter((c) => crmFilter === "all" || c.product === crmFilter || c.product === "both");

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">Flagship Program</p>
          <h3 className="text-2xl font-semibold text-ink">ACE Dual-Market Growth & Resource Control</h3>
        </div>
        <SourceLabel type="illustrative-assumption" />
      </div>

      {/* Campaigns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          {
            title: "Host Smarter with Terang.",
            product: "Terang Events",
            icon: CalendarDays,
            gradient: "bg-[linear-gradient(135deg,#5fd0ff,#0c9fd8)]",
            channels: ["University outreach", "Association partnerships", "Organizer demos", "Institutional pilots", "Repeat-organizer offers", "Referral partnerships"],
            stats: [
              ["Organizer baru", formatNumber(Math.round(newOrg))],
              ["Event / periode", formatNumber(ev.units)],
              ["Biaya kampanye", formatIDRCompact(assumptions.ace.eventsCampaignCost)],
            ],
            funnel: eventsFunnel,
            funnelColor: "linear-gradient(90deg,#7fd3ff,#0c9fd8)",
          },
          {
            title: "Hire Smarter with Terang.",
            product: "AI Candidate Interview",
            icon: Brain,
            gradient: "bg-[linear-gradient(135deg,#4a90e2,#2251c9)]",
            channels: ["HR community partnerships", "Recruitment agency outreach", "Targeted LinkedIn campaigns", "Enterprise demos", "Recruitment pilots", "Contract conversion & renewal"],
            stats: [
              ["Pilot", formatNumber(pilots)],
              ["Pelanggan berbayar", formatNumber(iv.customers)],
              ["Biaya kampanye", formatIDRCompact(assumptions.ace.interviewCampaignCost)],
            ],
            funnel: interviewFunnel,
            funnelColor: "linear-gradient(90deg,#4a90e2,#2251c9)",
          },
        ].map((c) => (
          <div key={c.title} className="overflow-hidden rounded-3xl border border-line bg-card shadow-soft">
            <div className={cn("relative p-6 text-white", c.gradient)}>
              <div className="bg-grid-dark absolute inset-0 opacity-50" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    <Megaphone className="h-3.5 w-3.5" /> Kampanye · {c.product}
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold">{c.title}</p>
                </div>
                <c.icon className="h-8 w-8 opacity-80" />
              </div>
              <div className="relative mt-4 grid grid-cols-3 gap-2">
                {c.stats.map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-white/12 p-2.5 ring-1 ring-white/20">
                    <p className="text-[11px] text-white/75">{k}</p>
                    <p className="tabular font-display text-lg font-semibold">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-1.5">
                {c.channels.map((ch) => (
                  <span key={ch} className="rounded-lg bg-surface px-2 py-1 text-[11.5px] font-semibold text-ink ring-1 ring-line">
                    {ch}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <Funnel stages={c.funnel} color={c.funnelColor} compact />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared CRM + joint experiment */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Network className="h-5 w-5 text-ace-ink" /> Shared CRM (konsep)
              </h3>
              <p className="text-sm text-muted-strong">Satu daftar akun, dua pipeline: kemitraan organizer & pilot HR.</p>
            </div>
            <Segmented
              size="sm"
              value={crmFilter}
              onChange={setCrmFilter}
              items={[
                { id: "all", label: "Semua" },
                { id: "events", label: "Events" },
                { id: "interview", label: "Interview" },
              ]}
            />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th className="py-2 font-semibold">Akun (fiktif)</th>
                  <th className="py-2 font-semibold">Produk</th>
                  <th className="py-2 font-semibold">Tahap</th>
                  <th className="py-2 font-semibold">PIC</th>
                  <th className="py-2 font-semibold">Langkah berikutnya</th>
                </tr>
              </thead>
              <tbody>
                {crm.map((c) => (
                  <motion.tr layout key={c.name} className="border-b border-line/70 last:border-0">
                    <td className="py-2.5">
                      <p className="font-semibold text-ink">{c.name}</p>
                      <p className="text-[11px] text-muted">{c.type}</p>
                    </td>
                    <td className="py-2.5">
                      <Badge tone={c.product === "events" ? "sky" : c.product === "interview" ? "one" : "ace"}>
                        {c.product === "events" ? "Events" : c.product === "interview" ? "Interview" : "Keduanya"}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-muted-strong">{c.stage}</td>
                    <td className="py-2.5 text-muted-strong">{c.owner}</td>
                    <td className="py-2.5 text-muted-strong">{c.next}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col rounded-3xl border border-line bg-gradient-to-br from-ace-soft to-card p-6 shadow-soft">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ace-gradient text-white">
            <Handshake className="h-5 w-5" />
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">Eksperimen kemitraan bersama</p>
          <p className="mt-1 text-xl font-semibold text-ink">Institutional Career Fair</p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-start gap-2 text-ink">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-sky-ink" /> Terang Events mengelola registrasi & operasional acara kampus.
            </p>
            <p className="flex items-start gap-2 text-ink">
              <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-one-ink" /> AI Candidate Interview ditawarkan terpisah kepada recruiter peserta — dengan otorisasi sendiri.
            </p>
          </div>
          <p className="mt-auto rounded-xl bg-card p-3 pt-3 text-xs leading-relaxed text-muted-strong ring-1 ring-line">
            Tidak ada asumsi berbagi data otomatis antar produk maupun cross-selling yang dijamin. Eksperimen diukur terpisah.
          </p>
        </div>
      </div>

      {/* Budget + capacity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Budget monitoring — pemasaran & overhead</h3>
          <p className="text-sm text-muted-strong">Total {formatIDRCompact(marketingTotal)} untuk {assumptions.shared.horizonMonths} bulan (dari simulator).</p>
          <div className="mt-4 flex h-4 overflow-hidden rounded-full">
            {budgetLines.map((b) => (
              <motion.div
                key={b.label}
                className="h-full border-r-2 border-white last:border-0"
                style={{ background: b.color }}
                initial={{ width: 0 }}
                animate={{ width: `${safeDivide(b.value, marketingTotal) * 100}%` }}
                title={`${b.label}: ${formatIDRCompact(b.value)}`}
              />
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {budgetLines.map((b) => (
              <div key={b.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-strong">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: b.color }} />
                  {b.label}
                </span>
                <span className="tabular font-semibold text-ink">
                  {formatIDRCompact(b.value)} <span className="text-xs font-normal text-muted">({formatPercent(safeDivide(b.value, marketingTotal))})</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-surface p-3 text-sm ring-1 ring-line">
            Konsumsi anggaran total ACE: <strong className="tabular">{formatPercent(r.budgetConsumption)}</strong>
            <Progress value={r.budgetConsumption} tone="auto" className="mt-2" />
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-ink">Capacity planner & workload warnings</h3>
              <p className="text-sm text-muted-strong">Ringkasan dari ACE Command Center.</p>
            </div>
            <Button href="/dashboard/operations" size="sm" variant="ace">
              Buka <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {(Object.keys(POOLS) as PoolKey[]).map((p) => {
              const total = poolTotal(allocation, p) / 100;
              return (
                <div key={p}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-strong">{POOLS[p].label}</span>
                    <span className="tabular font-semibold text-ink">{formatPercent(total)}</span>
                  </div>
                  <Progress value={total} tone="auto" className="mt-1" />
                </div>
              );
            })}
            <div className="flex justify-between border-t border-line pt-3 text-sm">
              <span className="text-muted-strong">Utilisasi Product (model finansial)</span>
              <span className={cn("tabular font-semibold", r.capacity.productUtilization > 0.9 ? "text-warning-ink" : "text-ink")}>
                {formatPercent(r.capacity.productUtilization)}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {issues.length === 0 ? (
              <p className="flex items-center gap-2 rounded-xl bg-success-soft p-3 text-sm font-semibold text-success-ink">
                <CheckCircle2 className="h-4 w-4" /> Alokasi kapasitas memenuhi semua aturan ACE.
              </p>
            ) : (
              issues.slice(0, 3).map((i) => (
                <p key={i.message} className={cn("flex items-start gap-2 rounded-xl p-3 text-[13px]", i.severity === "critical" ? "bg-danger-soft text-danger-ink" : "bg-warning-soft text-warning-ink")}>
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {i.message}
                </p>
              ))
            )}
            {r.risks.filter((x) => x.includes("Kapasitas")).map((x) => (
              <p key={x} className="flex items-start gap-2 rounded-xl bg-warning-soft p-3 text-[13px] text-warning-ink">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {x}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
