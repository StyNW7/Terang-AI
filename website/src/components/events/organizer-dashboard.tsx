"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarClock, CalendarDays, FileText, Trophy, Users, Wallet } from "lucide-react";
import { useEventsStore } from "@/store/events-store";
import { WEEKLY_ACTIVITY, STATUS_LABEL } from "@/data/events.mock";
import { KpiCard } from "@/components/ui/kpi-card";
import { Progress } from "@/components/ui/misc";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES } from "@/components/charts/chart-kit";
import { formatDate, formatNumber, formatPercent } from "@/lib/formatters";
import { DEMO_TODAY, EventStatusBadge } from "./shared";
import { safeDivide } from "@/lib/utils";

export function OrganizerDashboard({ onOpenEvents }: { onOpenEvents: () => void }) {
  const events = useEventsStore((s) => s.events);
  const totals = useMemo(() => {
    const registered = events.reduce((a, e) => a + e.registered, 0);
    const submissions = events.reduce((a, e) => a + e.submissions, 0);
    const revenue = events.reduce((a, e) => a + e.registered * e.fee, 0);
    const byStatus = (Object.keys(STATUS_LABEL) as (keyof typeof STATUS_LABEL)[]).map((k) => ({ status: k, n: events.filter((e) => e.status === k).length }));
    const deadlines = events
      .flatMap((e) => e.stages.map((s) => ({ ...s, event: e.name, eventId: e.id })))
      .filter((s) => s.date >= DEMO_TODAY)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6);
    return { registered, submissions, revenue, byStatus, deadlines };
  }, [events]);

  const activeWithSubs = events.filter((e) => e.registered > 0 && e.status !== "draft").slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total event" value={events.length} icon={<CalendarDays className="h-4 w-4" />} tone="sky" />
        <KpiCard label="Peserta terdaftar" value={totals.registered} icon={<Users className="h-4 w-4" />} tone="sky" delta={0.18} deltaLabel="vs bulan lalu" />
        <KpiCard label="Submisi masuk" value={totals.submissions} icon={<FileText className="h-4 w-4" />} tone="brand" />
        <KpiCard label="Nilai registrasi (simulasi)" value={totals.revenue} format="idrCompact" icon={<Wallet className="h-4 w-4" />} tone="navy" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {totals.byStatus.map((s) => (
          <button
            key={s.status}
            type="button"
            onClick={onOpenEvents}
            className="rounded-2xl border border-line bg-card p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <EventStatusBadge status={s.status} />
            <p className="tabular mt-3 font-display text-2xl font-semibold text-ink">{s.n}</p>
            <p className="text-xs text-muted">event</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <ChartFrame
          title="Kinerja event — 7 minggu terakhir"
          description="Registrasi & submisi mingguan di seluruh event."
          legend={[
            { label: "Registrasi", color: SERIES.events },
            { label: "Submisi", color: SERIES.interview },
          ]}
          table={{ columns: ["Minggu", "Registrasi", "Submisi"], rows: WEEKLY_ACTIVITY.map((w) => [w.week, w.registrasi, w.submisi]) }}
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_ACTIVITY} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="evReg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={SERIES.events} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={SERIES.events} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="evSub" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={SERIES.interview} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={SERIES.interview} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="week" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip content={(p) => <ChartTooltip {...p} />} />
              <Area type="monotone" dataKey="registrasi" name="Registrasi" stroke={SERIES.events} strokeWidth={2} fill="url(#evReg)" />
              <Area type="monotone" dataKey="submisi" name="Submisi" stroke={SERIES.interview} strokeWidth={2} fill="url(#evSub)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartFrame>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <CalendarClock className="h-4 w-4 text-sky-ink" /> Tenggat terdekat
          </p>
          <ul className="mt-4 space-y-2.5">
            {totals.deadlines.map((d) => (
              <li key={d.eventId + d.id} className="flex items-center gap-3 rounded-xl bg-surface p-3 ring-1 ring-line">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card text-center ring-1 ring-line">
                  <span className="text-[11px] font-semibold uppercase leading-none text-sky-ink">{formatDate(d.date).split(" ")[1]}</span>
                  <span className="text-base font-semibold leading-none text-ink">{formatDate(d.date).split(" ")[0]}</span>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-ink">{d.name}</p>
                  <p className="text-xs leading-snug text-muted">{d.event}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <Trophy className="h-4 w-4 text-sky-ink" /> Progres registrasi & submisi
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {activeWithSubs.map((e) => (
            <div key={e.id} className="rounded-xl bg-surface p-4 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{e.name}</p>
                <EventStatusBadge status={e.status} />
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-muted-strong">
                    <span>Kuota terisi</span>
                    <span className="tabular font-semibold text-ink">
                      {formatNumber(e.registered)} / {formatNumber(e.quota)}
                    </span>
                  </div>
                  <Progress value={safeDivide(e.registered, e.quota)} tone="sky" className="mt-1" />
                </div>
                {e.submissions > 0 && (
                  <div>
                    <div className="flex justify-between text-muted-strong">
                      <span>Submisi</span>
                      <span className="tabular font-semibold text-ink">{formatPercent(safeDivide(e.submissions, e.registered))}</span>
                    </div>
                    <Progress value={safeDivide(e.submissions, e.registered)} tone="brand" className="mt-1" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
