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
import { keyOf, L, useI18n, type Bilingual } from "@/lib/i18n";

const CRM: { name: string; type: Bilingual; product: "events" | "interview" | "both"; stage: Bilingual; owner: string; next: Bilingual }[] = [
  { name: "Univ. Cakrawala Nusantara", type: L("Universitas", "University"), product: "events", stage: L("_Pilot event_", "Pilot event"), owner: "S1", next: L("Evaluasi pasca-acara", "Post-event review") },
  { name: "Asosiasi Pengajar Bisnis Digital", type: L("Asosiasi", "Association"), product: "events", stage: L("Demo", "Demo"), owner: "S1", next: L("Proposal kemitraan", "Partnership proposal") },
  { name: "Komunitas Data Muda Bandung", type: L("Komunitas", "Community"), product: "events", stage: L("_Repeat_", "Repeat"), owner: "S2", next: L("Paket _repeat organizer_", "Repeat-organizer package") },
  { name: "Institut Teknologi Lintas Samudra", type: L("Universitas", "University"), product: "events", stage: L("_Lead_", "Lead"), owner: "S1", next: L("Jadwalkan demo", "Schedule a demo") },
  { name: "PT Sinar Ritel Nusantara", type: L("Perusahaan", "Company"), product: "interview", stage: L("_Pilot_", "Pilot"), owner: "CEO", next: L("Tinjau ROI _pilot_", "Review pilot ROI") },
  { name: "Talenta Prima Agency", type: L("Agensi rekrutmen", "Recruitment agency"), product: "interview", stage: L("Demo", "Demo"), owner: "S1", next: L("_Pilot_ 30 hari", "30-day pilot") },
  { name: "PT Bahari Telekomunikasi", type: L("Perusahaan", "Company"), product: "interview", stage: L("_Lead_", "Lead"), owner: "S1", next: L("Kualifikasi kebutuhan", "Qualify needs") },
  { name: "Pusat Karier Universitas Arunika", type: L("Universitas", "University"), product: "both", stage: L("Eksperimen", "Experiment"), owner: "CEO", next: L("_Career fair_ bersama", "Joint career fair") },
];

export function AcePillarCoordinate() {
  const { t, tx } = useI18n();
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
    { label: t("Institusi dijangkau", "Institutions reached"), value: Math.round(newOrg / 0.03) },
    { label: t("_Lead organizer_", "Organizer leads"), value: Math.round(newOrg / 0.25) },
    { label: t("Demo _organizer_", "Organizer demos"), value: Math.round(newOrg / 0.55) },
    { label: t("_Organizer_ baru", "New organizers"), value: Math.round(newOrg) },
    { label: t("_Organizer_ berulang", "Repeat organizers"), value: Math.round(newOrg * assumptions.events.organizerRetention) },
  ];
  const interviewFunnel = [
    { label: "Awareness HR", value: Math.round(pilots / 0.0063) },
    { label: "Qualified lead", value: Math.round(pilots / 0.1575) },
    { label: "Demo", value: Math.round(pilots / 0.45) },
    { label: "Pilot", value: Math.round(pilots) },
    { label: t("Pelanggan berbayar", "Paying customers"), value: iv.customers },
  ];

  const budgetLines = [
    { label: t("Kampanye Interview", "Interview campaign"), value: assumptions.ace.interviewCampaignCost, color: "#2f66e0" },
    { label: t("Kampanye Events", "Events campaign"), value: assumptions.ace.eventsCampaignCost, color: "#39b7ff" },
    { label: t("Akuisisi (CAC)", "Acquisition (CAC)"), value: iv.acquisitionCost + ev.acquisitionCost, color: "#4a90e2" },
    { label: t("_Overhead_ portofolio", "Portfolio overhead"), value: r.portfolioOverhead, color: "#94a3b8" },
  ];
  const marketingTotal = budgetLines.reduce((a, b) => a + b.value, 0);

  const crm = CRM.filter((c) => crmFilter === "all" || c.product === crmFilter || c.product === "both");

  const campaigns = [
    {
      title: "Host Smarter with Terang.",
      product: "Terang Events",
      icon: CalendarDays,
      gradient: "bg-[linear-gradient(135deg,#5fd0ff,#0c9fd8)]",
      channels: [
        L("_Outreach_ universitas", "University outreach"),
        L("Kemitraan asosiasi", "Association partnerships"),
        L("Demo untuk _organizer_", "Organizer demos"),
        L("_Pilot_ institusional", "Institutional pilots"),
        L("Penawaran _repeat organizer_", "Repeat-organizer offers"),
        L("Kemitraan _referral_", "Referral partnerships"),
      ],
      stats: [
        [t("_Organizer_ baru", "New organizers"), formatNumber(Math.round(newOrg))],
        [t("_Event_ / periode", "Events / period"), formatNumber(ev.units)],
        [t("Biaya kampanye", "Campaign cost"), formatIDRCompact(assumptions.ace.eventsCampaignCost)],
      ],
      funnel: eventsFunnel,
      funnelColor: "linear-gradient(90deg,#7fd3ff,#0c9fd8)",
    },
    {
      title: "Hire Smarter with Terang.",
      product: "AI Candidate Interview",
      icon: Brain,
      gradient: "bg-[linear-gradient(135deg,#4a90e2,#2251c9)]",
      channels: [
        L("Kemitraan komunitas HR", "HR community partnerships"),
        L("_Outreach_ agensi rekrutmen", "Recruitment agency outreach"),
        L("Kampanye LinkedIn tertarget", "Targeted LinkedIn campaigns"),
        L("Demo _enterprise_", "Enterprise demos"),
        L("_Pilot_ rekrutmen", "Recruitment pilots"),
        L("Konversi kontrak & _renewal_", "Contract conversion & renewal"),
      ],
      stats: [
        [t("_Pilot_", "Pilots"), formatNumber(pilots)],
        [t("Pelanggan berbayar", "Paying customers"), formatNumber(iv.customers)],
        [t("Biaya kampanye", "Campaign cost"), formatIDRCompact(assumptions.ace.interviewCampaignCost)],
      ],
      funnel: interviewFunnel,
      funnelColor: "linear-gradient(90deg,#4a90e2,#2251c9)",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">{tx("Program _Flagship_", "Flagship Program")}</p>
          <h3 className="text-2xl font-semibold text-ink">ACE Dual-Market Growth & Resource Control</h3>
        </div>
        <SourceLabel type="illustrative-assumption" />
      </div>

      {/* Campaigns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {campaigns.map((c) => (
          <div key={c.title} className="overflow-hidden rounded-3xl border border-line bg-card shadow-soft">
            <div className={cn("relative p-6 text-white", c.gradient)}>
              <div className="bg-grid-dark absolute inset-0 opacity-50" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    <Megaphone className="h-3.5 w-3.5" /> {t("Kampanye", "Campaign")} · {c.product}
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
                  <span key={keyOf(ch)} className="rounded-lg bg-surface px-2 py-1 text-[11.5px] font-semibold text-ink ring-1 ring-line">
                    {tx(ch)}
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Network className="h-5 w-5 text-ace-ink" /> {tx("_Shared CRM_ (konsep)", "Shared CRM (concept)")}
              </h3>
              <p className="text-sm text-muted-strong">
                {tx("Satu daftar akun, dua _pipeline_: kemitraan _organizer_ & _pilot_ HR.", "One account list, two pipelines: organizer partnerships & HR pilots.")}
              </p>
            </div>
            <Segmented
              size="sm"
              value={crmFilter}
              onChange={setCrmFilter}
              items={[
                { id: "all", label: t("Semua", "All") },
                { id: "events", label: "Events" },
                { id: "interview", label: "Interview" },
              ]}
            />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th className="py-2 font-semibold">{t("Akun (fiktif)", "Account (fictional)")}</th>
                  <th className="py-2 font-semibold">{t("Produk", "Product")}</th>
                  <th className="py-2 font-semibold">{t("Tahap", "Stage")}</th>
                  <th className="py-2 font-semibold">{t("PIC", "Owner")}</th>
                  <th className="py-2 font-semibold">{t("Langkah berikutnya", "Next step")}</th>
                </tr>
              </thead>
              <tbody>
                {crm.map((c) => (
                  <motion.tr layout key={c.name} className="border-b border-line/70 last:border-0">
                    <td className="py-2.5">
                      <p className="font-semibold text-ink">{c.name}</p>
                      <p className="text-[11px] text-muted">{t(c.type)}</p>
                    </td>
                    <td className="py-2.5">
                      <Badge tone={c.product === "events" ? "sky" : c.product === "interview" ? "one" : "ace"}>
                        {c.product === "events" ? "Events" : c.product === "interview" ? "Interview" : t("Keduanya", "Both")}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-muted-strong">{tx(c.stage)}</td>
                    <td className="py-2.5 text-muted-strong">{c.owner}</td>
                    <td className="py-2.5 text-muted-strong">{tx(c.next)}</td>
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
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">{t("Eksperimen kemitraan bersama", "Joint partnership experiment")}</p>
          <p className="mt-1 text-xl font-semibold text-ink">Institutional Career Fair</p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-start gap-2 text-ink">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-sky-ink" />{" "}
              {t("Terang Events mengelola registrasi & operasional acara kampus.", "Terang Events runs registration & operations for the campus event.")}
            </p>
            <p className="flex items-start gap-2 text-ink">
              <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-one-ink" />{" "}
              {tx(
                "AI Candidate Interview ditawarkan terpisah kepada _recruiter_ peserta — dengan otorisasi sendiri.",
                "AI Candidate Interview is offered separately to participating recruiters — with its own authorisation.",
              )}
            </p>
          </div>
          <p className="mt-auto rounded-xl bg-card p-3 pt-3 text-xs leading-relaxed text-muted-strong ring-1 ring-line">
            {tx(
              "Tidak ada asumsi berbagi data otomatis antar produk maupun _cross-selling_ yang dijamin. Eksperimen diukur terpisah.",
              "No automatic data sharing between products and no guaranteed cross-selling is assumed. The experiment is measured separately.",
            )}
          </p>
        </div>
      </div>

      {/* Budget + capacity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">{tx("Pemantauan anggaran — pemasaran & _overhead_", "Budget monitoring — marketing & overhead")}</h3>
          <p className="text-sm text-muted-strong">
            {t(
              `Total ${formatIDRCompact(marketingTotal)} untuk ${assumptions.shared.horizonMonths} bulan (dari simulator).`,
              `Total ${formatIDRCompact(marketingTotal)} over ${assumptions.shared.horizonMonths} months (from the simulator).`,
            )}
          </p>
          <div className="mt-4 flex h-4 overflow-hidden rounded-full">
            {budgetLines.map((b) => (
              <motion.div
                key={b.color}
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
              <div key={b.color} className="flex items-center justify-between text-sm">
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
            {t("Konsumsi anggaran total ACE:", "Total ACE budget consumption:")} <strong className="tabular">{formatPercent(r.budgetConsumption)}</strong>
            <Progress value={r.budgetConsumption} tone="auto" className="mt-2" />
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-ink">{tx("Perencana kapasitas & peringatan beban kerja", "Capacity planner & workload warnings")}</h3>
              <p className="text-sm text-muted-strong">{t("Ringkasan dari ACE Command Center.", "A summary from the ACE Command Center.")}</p>
            </div>
            <Button href="/dashboard/operations" size="sm" variant="ace">
              {t("Buka", "Open")} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {(Object.keys(POOLS) as PoolKey[]).map((p) => {
              const total = poolTotal(allocation, p) / 100;
              return (
                <div key={p}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-strong">{tx(POOLS[p].label)}</span>
                    <span className="tabular font-semibold text-ink">{formatPercent(total)}</span>
                  </div>
                  <Progress value={total} tone="auto" className="mt-1" />
                </div>
              );
            })}
            <div className="flex justify-between border-t border-line pt-3 text-sm">
              <span className="text-muted-strong">{tx("Utilisasi _Product_ (model finansial)", "Product utilisation (financial model)")}</span>
              <span className={cn("tabular font-semibold", r.capacity.productUtilization > 0.9 ? "text-warning-ink" : "text-ink")}>
                {formatPercent(r.capacity.productUtilization)}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {issues.length === 0 ? (
              <p className="flex items-center gap-2 rounded-xl bg-success-soft p-3 text-sm font-semibold text-success-ink">
                <CheckCircle2 className="h-4 w-4" /> {t("Alokasi kapasitas memenuhi semua aturan ACE.", "The capacity allocation meets every ACE rule.")}
              </p>
            ) : (
              issues.slice(0, 3).map((i) => (
                <p key={keyOf(i.message)} className={cn("flex items-start gap-2 rounded-xl p-3 text-[13px]", i.severity === "critical" ? "bg-danger-soft text-danger-ink" : "bg-warning-soft text-warning-ink")}>
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {tx(i.message)}
                </p>
              ))
            )}
            {r.risks
              .filter((x) => keyOf(x).startsWith("Kapasitas"))
              .map((x) => (
                <p key={keyOf(x)} className="flex items-start gap-2 rounded-xl bg-warning-soft p-3 text-[13px] text-warning-ink">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {tx(x)}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
