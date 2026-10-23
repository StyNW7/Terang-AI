"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Briefcase, ClipboardCheck, History, Hourglass, Send } from "lucide-react";
import { useInterviewStore } from "@/store/interview-store";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES, noWrap } from "@/components/charts/chart-kit";
import { formatDateTime } from "@/lib/formatters";
import { CandidateStatusBadge, displayName } from "./shared";
import { L, useI18n } from "@/lib/i18n";

const ACTIVITY = [
  { week: L("M1 Sep", "W1 Sep"), selesai: 6, ditinjau: 4 },
  { week: L("M2 Sep", "W2 Sep"), selesai: 9, ditinjau: 7 },
  { week: L("M3 Sep", "W3 Sep"), selesai: 14, ditinjau: 10 },
  { week: L("M4 Sep", "W4 Sep"), selesai: 12, ditinjau: 12 },
  { week: L("M1 Okt", "W1 Oct"), selesai: 18, ditinjau: 13 },
  { week: L("M2 Okt", "W2 Oct"), selesai: 21, ditinjau: 17 },
  { week: L("M3 Okt", "W3 Oct"), selesai: 16, ditinjau: 15 },
];

export function HrOverview({ onOpenReport, onCandidates }: { onOpenReport: (id: string) => void; onCandidates: () => void }) {
  const { t, tx } = useI18n();
  const jobs = useInterviewStore((s) => s.jobs);
  const candidates = useInterviewStore((s) => s.candidates);
  const activity = ACTIVITY.map((a) => ({ ...a, week: t(a.week) }));
  const audit = useInterviewStore((s) => s.audit);
  const mask = useInterviewStore((s) => s.maskIdentity);

  const stats = useMemo(
    () => ({
      open: jobs.filter((j) => j.status === "aktif").length,
      invited: candidates.length,
      completed: candidates.filter((c) => c.transcript.length > 0).length,
      awaiting: candidates.filter((c) => c.status === "selesai").length,
    }),
    [jobs, candidates],
  );
  const workload = jobs.map((j) => ({
    job: j.title.replace(" Representative", "").replace(" Assistant", " Asst."),
    menunggu: candidates.filter((c) => c.jobId === j.id && c.status === "selesai").length,
    ditinjau: candidates.filter((c) => c.jobId === j.id && c.status === "ditinjau").length,
  }));
  const awaiting = candidates.filter((c) => c.status === "selesai" || c.flagged).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard tone="one" label={t("Posisi terbuka", "Open positions")} value={stats.open} icon={<Briefcase className="h-4 w-4" />} />
        <KpiCard tone="one" label={t("Kandidat diundang", "Candidates invited")} value={stats.invited} icon={<Send className="h-4 w-4" />} />
        <KpiCard tone="one" label={tx("_Interview_ selesai", "Interviews completed")} value={stats.completed} icon={<ClipboardCheck className="h-4 w-4" />} delta={0.24} deltaLabel={t("vs bulan lalu", "vs last month")} />
        <KpiCard tone="navy" label={t("Menunggu tinjauan manusia", "Awaiting human review")} value={stats.awaiting} icon={<Hourglass className="h-4 w-4" />} />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartFrame
          title={tx("Aktivitas _interview_", "Interview activity")}
          description={tx("_Interview_ selesai vs ditinjau _recruiter_ per minggu (ilustratif).", "Interviews completed vs reviewed by recruiters per week (illustrative).")}
          legend={[
            { label: t("Selesai", "Completed"), color: SERIES.interview },
            { label: t("Ditinjau manusia", "Human-reviewed"), color: SERIES.events },
          ]}
          table={{ columns: [t("Minggu", "Week"), t("Selesai", "Completed"), t("Ditinjau", "Reviewed")], rows: activity.map((a) => [a.week, a.selesai, a.ditinjau]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activity} margin={{ top: 8, right: 8, left: -14, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="week" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip cursor={{ fill: "rgba(47,102,224,0.06)" }} content={(p) => <ChartTooltip {...p} />} />
              <Bar dataKey="selesai" name={t("Selesai", "Completed")} fill={SERIES.interview} radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="ditinjau" name={t("Ditinjau manusia", "Human-reviewed")} fill={SERIES.events} radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title={t("Beban tinjauan per posisi", "Review workload by position")}
          legend={[
            { label: t("Menunggu", "Waiting"), color: SERIES.shared },
            { label: t("Ditinjau", "Reviewed"), color: SERIES.interview },
          ]}
          table={{ columns: [t("Posisi", "Position"), t("Menunggu", "Waiting"), t("Ditinjau", "Reviewed")], rows: workload.map((w) => [w.job, w.menunggu, w.ditinjau]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workload} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={SERIES.grid} />
              <XAxis type="number" allowDecimals={false} {...AXIS_PROPS} />
              <YAxis type="category" dataKey="job" width={120} tickFormatter={noWrap} {...AXIS_PROPS} />
              <Tooltip cursor={{ fill: "rgba(47,102,224,0.06)" }} content={(p) => <ChartTooltip {...p} />} />
              <Bar dataKey="menunggu" name={t("Menunggu", "Waiting")} stackId="a" fill={SERIES.shared} maxBarSize={22} />
              <Bar dataKey="ditinjau" name={t("Ditinjau", "Reviewed")} stackId="a" fill={SERIES.interview} radius={[0, 4, 4, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-ink">{tx("Perlu perhatian _recruiter_", "Needs recruiter attention")}</p>
            <Button size="sm" variant="ghost" onClick={onCandidates}>
              {t("Semua kandidat", "All candidates")}
            </Button>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {awaiting.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{displayName(c, mask)}</p>
                  <p className="text-xs text-muted">{jobs.find((j) => j.id === c.jobId)?.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CandidateStatusBadge status={c.status} />
                  {c.transcript.length > 0 && (
                    <Button size="sm" variant="soft" onClick={() => onOpenReport(c.id)}>
                      {t("Tinjau", "Review")}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <History className="h-4 w-4 text-one-ink" /> {tx("_Audit trail_ terbaru", "Latest audit trail")}
          </p>
          <ul className="mt-3 space-y-2.5">
            {audit.slice(0, 5).map((a) => (
              <li key={a.id} className="rounded-xl bg-surface p-3 text-sm ring-1 ring-line">
                <p className="font-semibold text-ink">{tx(a.action)}</p>
                <p className="text-xs text-muted">
                  {t(a.actor)} · {t(a.target)} · {formatDateTime(a.at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
