"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEventsStore } from "@/store/events-store";
import { REPEAT_COMPARISON, SOURCE_CONVERSION, SOURCE_LABEL, WEEKLY_ACTIVITY } from "@/data/events.mock";
import { ChartFrame, ChartTooltip, AXIS_PROPS, SERIES, noWrap } from "@/components/charts/chart-kit";
import { Funnel } from "@/components/strategy/funnel";
import { Select } from "@/components/ui/form";
import { formatPercent } from "@/lib/formatters";
import { safeDivide } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function AnalyticsPanel() {
  const { t } = useI18n();
  const events = useEventsStore((s) => s.events);
  const withViews = events.filter((e) => e.views > 0);
  const [eventId, setEventId] = useState(withViews[0]?.id ?? "");
  const event = withViews.find((e) => e.id === eventId) ?? withViews[0];

  const funnel = (() => {
    if (!event) return [];
    const started = Math.round(event.registered * 1.65);
    const paid = event.fee ? Math.round(event.registered * 0.86) : event.registered;
    return [
      { label: t("Kunjungan halaman", "Page visits"), value: event.views },
      { label: t("Mulai registrasi", "Registration started"), value: started },
      { label: t("Registrasi selesai", "Registration completed"), value: event.registered },
      { label: event.fee ? t("Pembayaran lunas", "Payment completed") : t("Terverifikasi", "Verified"), value: paid },
      ...(event.submissions ? [{ label: t("Submisi", "Submissions"), value: event.submissions }] : []),
    ];
  })();

  const sourceData = SOURCE_CONVERSION.map((s) => ({ ...s, source: t(SOURCE_LABEL[s.source]), rate: safeDivide(s.registrasi, s.kunjungan) }));
  const weekly = WEEKLY_ACTIVITY.map((w) => ({ ...w, week: t(w.week) }));
  const repeat = REPEAT_COMPARISON.map((r) => ({ ...r, metric: t(r.metric) }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[15px] font-semibold text-ink">{t("_Funnel_ registrasi", "Registration funnel")}</p>
            <Select value={event?.id} onChange={(e) => setEventId(e.target.value)} className="h-9 w-64 text-xs" aria-label={t("Pilih _event_ untuk _funnel_", "Choose the funnel event")}>
              {withViews.map((e) => (
                <option key={e.id} value={e.id}>
                  {t(e.name)}
                </option>
              ))}
            </Select>
          </div>
          <Funnel className="mt-5" stages={funnel} color="linear-gradient(90deg,#7fd3ff,#0c9fd8)" />
        </div>
        <ChartFrame
          title={t("Konversi per sumber", "Conversion by source")}
          description={t("Registrasi per 100 kunjungan, seluruh _event_.", "Registrations per 100 visits, across all events.")}
          table={{
            columns: [t("Sumber", "Source"), t("Kunjungan", "Visits"), t("Registrasi", "Registrations"), t("Konversi", "Conversion")],
            rows: sourceData.map((s) => [s.source, s.kunjungan, s.registrasi, formatPercent(s.rate, 1)]),
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={SERIES.grid} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v: number) => formatPercent(v)} />
              <YAxis type="category" dataKey="source" {...AXIS_PROPS} width={70} tickFormatter={noWrap} />
              <Tooltip cursor={{ fill: "rgba(57,183,255,0.08)" }} content={(p) => <ChartTooltip {...p} format="percent1" />} />
              <Bar dataKey="rate" name={t("Konversi", "Conversion")} fill={SERIES.events} radius={[0, 4, 4, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title={t("Aktivitas peserta", "Participant activity")}
          description={t("Kunjungan halaman _event_ per minggu.", "Event page visits per week.")}
          table={{ columns: [t("Minggu", "Week"), t("Kunjungan", "Visits")], rows: weekly.map((w) => [w.week, w.kunjungan]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="week" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip content={(p) => <ChartTooltip {...p} />} />
              <Line type="monotone" dataKey="kunjungan" name={t("Kunjungan", "Visits")} stroke={SERIES.events} strokeWidth={2.5} dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame
          title={t("Perbandingan _event_ berulang", "Recurring-event comparison")}
          description={t("Hackathon Smart City: edisi 2025 vs 2026 (ilustratif).", "Smart City Hackathon: 2025 vs 2026 edition (illustrative).")}
          legend={[
            { label: t("Edisi 2025", "2025 edition"), color: SERIES.shared },
            { label: t("Edisi 2026", "2026 edition"), color: SERIES.events },
          ]}
          table={{ columns: [t("Metrik", "Metric"), "2025", "2026"], rows: repeat.map((r) => [r.metric, r.edisi2025, r.edisi2026]) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={repeat} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke={SERIES.grid} />
              <XAxis dataKey="metric" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip cursor={{ fill: "rgba(57,183,255,0.08)" }} content={(p) => <ChartTooltip {...p} />} />
              <Bar dataKey="edisi2025" name={t("Edisi 2025", "2025 edition")} fill={SERIES.shared} radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="edisi2026" name={t("Edisi 2026", "2026 edition")} fill={SERIES.events} radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
    </div>
  );
}
