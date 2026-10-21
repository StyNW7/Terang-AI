"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Briefcase, ClipboardCheck, History, Hourglass, Send } from "lucide-react";
import { useInterviewStore } from "@/store/interview-store";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES } from "@/components/charts/chart-kit";
import { formatDateTime } from "@/lib/formatters";
import { CandidateStatusBadge, displayName } from "./shared";

const ACTIVITY = [
  { week: "M1 Sep", selesai: 6, ditinjau: 4 },
  { week: "M2 Sep", selesai: 9, ditinjau: 7 },
  { week: "M3 Sep", selesai: 14, ditinjau: 10 },
  { week: "M4 Sep", selesai: 12, ditinjau: 12 },
  { week: "M1 Okt", selesai: 18, ditinjau: 13 },
  { week: "M2 Okt", selesai: 21, ditinjau: 17 },
  { week: "M3 Okt", selesai: 16, ditinjau: 15 },
];

export function HrOverview({ onOpenReport, onCandidates }: { onOpenReport: (id: string) => void; onCandidates: () => void }) {
  const jobs = useInterviewStore((s) => s.jobs);
  const candidates = useInterviewStore((s) => s.candidates);
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
        <KpiCard tone="one" label="Posisi terbuka" value={stats.open} icon={<Briefcase className="h-4 w-4" />} />
        <KpiCard tone="one" label="Kandidat diundang" value={stats.invited} icon={<Send className="h-4 w-4" />} />
        <KpiCard tone="one" label="Interview selesai" value={stats.completed} icon={<ClipboardCheck className="h-4 w-4" />} delta={0.24} deltaLabel="vs bulan lalu" />
        <KpiCard tone="navy" label="Menunggu tinjauan manusia" value={stats.awaiting} icon={<Hourglass className="h-4 w-4" />} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartFrame
          title="Aktivitas interview"
          description="Interview selesai vs ditinjau recruiter per minggu (ilustratif)."
          legend={[
            { label: "Selesai", color: SERIES.interview },
            { label: "Ditinjau manusia", color: SERIES.events },
          ]}
          table={{ columns: ["Minggu", "Selesai", "Ditinjau"], rows: ACTIVITY.map((a) => [a.week, a.selesai, a.ditinjau]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ACTIVITY} margin={{ top: 8, right: 8, left: -14, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="week" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip cursor={{ fill: "rgba(47,102,224,0.06)" }} content={(p) => <ChartTooltip {...p} />} />
              <Bar dataKey="selesai" name="Selesai" fill={SERIES.interview} radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="ditinjau" name="Ditinjau manusia" fill={SERIES.events} radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title="Beban tinjauan per posisi"
          legend={[
            { label: "Menunggu", color: SERIES.shared },
            { label: "Ditinjau", color: SERIES.interview },
          ]}
          table={{ columns: ["Posisi", "Menunggu", "Ditinjau"], rows: workload.map((w) => [w.job, w.menunggu, w.ditinjau]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workload} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={SERIES.grid} />
              <XAxis type="number" allowDecimals={false} {...AXIS_PROPS} />
              <YAxis type="category" dataKey="job" width={120} {...AXIS_PROPS} />
              <Tooltip cursor={{ fill: "rgba(47,102,224,0.06)" }} content={(p) => <ChartTooltip {...p} />} />
              <Bar dataKey="menunggu" name="Menunggu" stackId="a" fill={SERIES.shared} maxBarSize={22} />
              <Bar dataKey="ditinjau" name="Ditinjau" stackId="a" fill={SERIES.interview} radius={[0, 4, 4, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold text-ink">Perlu perhatian recruiter</p>
            <Button size="sm" variant="ghost" onClick={onCandidates}>
              Semua kandidat
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
                      Tinjau
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <p className="flex items-center gap-2 text-[15px] font-bold text-ink">
            <History className="h-4 w-4 text-one" /> Audit trail terbaru
          </p>
          <ul className="mt-3 space-y-2.5">
            {audit.slice(0, 5).map((a) => (
              <li key={a.id} className="rounded-xl bg-surface p-3 text-sm ring-1 ring-line">
                <p className="font-semibold text-ink">{a.action}</p>
                <p className="text-xs text-muted">
                  {a.actor} · {a.target} · {formatDateTime(a.at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
