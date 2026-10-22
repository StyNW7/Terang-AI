"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEventsStore } from "@/store/events-store";
import { REPEAT_COMPARISON, SOURCE_CONVERSION, WEEKLY_ACTIVITY } from "@/data/events.mock";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES } from "@/components/charts/chart-kit";
import { Funnel } from "@/components/strategy/funnel";
import { Select } from "@/components/ui/form";
import { formatPercent } from "@/lib/formatters";
import { safeDivide } from "@/lib/utils";

export function AnalyticsPanel() {
  const events = useEventsStore((s) => s.events);
  const withViews = events.filter((e) => e.views > 0);
  const [eventId, setEventId] = useState(withViews[0]?.id ?? "");
  const event = withViews.find((e) => e.id === eventId) ?? withViews[0];

  const funnel = (() => {
    if (!event) return [];
    const started = Math.round(event.registered * 1.65);
    const paid = event.fee ? Math.round(event.registered * 0.86) : event.registered;
    return [
      { label: "Kunjungan halaman", value: event.views },
      { label: "Mulai registrasi", value: started },
      { label: "Registrasi selesai", value: event.registered },
      { label: event.fee ? "Pembayaran lunas" : "Terverifikasi", value: paid },
      ...(event.submissions ? [{ label: "Submisi", value: event.submissions }] : []),
    ];
  })();

  const sourceData = SOURCE_CONVERSION.map((s) => ({ ...s, rate: safeDivide(s.registrasi, s.kunjungan) }));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[15px] font-semibold text-ink">Funnel registrasi</p>
            <Select value={event?.id} onChange={(e) => setEventId(e.target.value)} className="h-9 w-64 text-xs" aria-label="Pilih event funnel">
              {withViews.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </Select>
          </div>
          <Funnel className="mt-5" stages={funnel} color="linear-gradient(90deg,#7fd3ff,#0c9fd8)" />
        </div>
        <ChartFrame
          title="Konversi per sumber"
          description="Registrasi per 100 kunjungan, seluruh event."
          table={{ columns: ["Sumber", "Kunjungan", "Registrasi", "Konversi"], rows: sourceData.map((s) => [s.source, s.kunjungan, s.registrasi, formatPercent(s.rate, 1)]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={SERIES.grid} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v: number) => formatPercent(v)} />
              <YAxis type="category" dataKey="source" {...AXIS_PROPS} width={70} />
              <Tooltip cursor={{ fill: "rgba(57,183,255,0.08)" }} content={(p) => <ChartTooltip {...p} format="percent1" />} />
              <Bar dataKey="rate" name="Konversi" fill={SERIES.events} radius={[0, 4, 4, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title="Aktivitas peserta"
          description="Kunjungan halaman event per minggu."
          table={{ columns: ["Minggu", "Kunjungan"], rows: WEEKLY_ACTIVITY.map((w) => [w.week, w.kunjungan]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WEEKLY_ACTIVITY} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="week" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip content={(p) => <ChartTooltip {...p} />} />
              <Line type="monotone" dataKey="kunjungan" name="Kunjungan" stroke={SERIES.events} strokeWidth={2.5} dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title="Perbandingan event berulang"
          description="Hackathon Smart City: edisi 2025 vs 2026 (ilustratif)."
          legend={[
            { label: "Edisi 2025", color: SERIES.shared },
            { label: "Edisi 2026", color: SERIES.events },
          ]}
          table={{ columns: ["Metrik", "2025", "2026"], rows: REPEAT_COMPARISON.map((r) => [r.metric, r.edisi2025, r.edisi2026]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REPEAT_COMPARISON} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="metric" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip cursor={{ fill: "rgba(57,183,255,0.08)" }} content={(p) => <ChartTooltip {...p} />} />
              <Bar dataKey="edisi2025" name="Edisi 2025" fill={SERIES.shared} radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="edisi2026" name="Edisi 2026" fill={SERIES.events} radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
    </div>
  );
}
