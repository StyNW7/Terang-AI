"use client";

import { useMemo, useState } from "react";
import { Calculator, CreditCard, Receipt, RotateCcw, Wallet } from "lucide-react";
import { useEventsStore } from "@/store/events-store";
import { PAYMENT_FEE_FLAT, PLATFORM_FEE_RATE, SEED_TRANSACTIONS } from "@/data/events.mock";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/misc";
import { Field, Input, Label, Select } from "@/components/ui/form";
import { SourceLabel } from "@/components/shared/source-label";
import { formatDate, formatIDR, formatIDRCompact } from "@/lib/formatters";

const TX_TONE = { berhasil: "success", menunggu: "warning", refund: "danger" } as const;

export function FinancePanel() {
  const events = useEventsStore((s) => s.events);
  const paidEvents = events.filter((e) => e.fee > 0);
  const [eventId, setEventId] = useState(paidEvents[0]?.id ?? "");
  const ev = paidEvents.find((e) => e.id === eventId) ?? paidEvents[0];
  const [fee, setFee] = useState(ev?.fee ?? 100_000);
  const [count, setCount] = useState(ev?.registered ?? 50);
  const [lastEvent, setLastEvent] = useState(eventId);
  if (ev && lastEvent !== eventId) {
    setLastEvent(eventId);
    setFee(ev.fee);
    setCount(ev.registered);
  }

  const summary = useMemo(() => {
    const ok = SEED_TRANSACTIONS.filter((t) => t.status === "berhasil");
    const gross = ok.reduce((a, t) => a + t.amount, 0);
    const refunds = SEED_TRANSACTIONS.filter((t) => t.status === "refund").reduce((a, t) => a + t.amount, 0);
    const pending = SEED_TRANSACTIONS.filter((t) => t.status === "menunggu").reduce((a, t) => a + t.amount, 0);
    return { gross, refunds, pending };
  }, []);

  const gross = Math.max(0, fee) * Math.max(0, count);
  const platform = gross * PLATFORM_FEE_RATE;
  const payment = PAYMENT_FEE_FLAT * Math.max(0, count);
  const net = Math.max(0, gross - platform - payment);
  const eventName = (id: string) => events.find((e) => e.id === id)?.name ?? id;

  return (
    <div className="space-y-5">
      <Callout tone="warning" title="Keuangan disimulasikan">
        Tidak ada koneksi ke penyedia pembayaran atau proses payout nyata. Biaya platform {Math.round(PLATFORM_FEE_RATE * 100)}% dan biaya
        pembayaran {formatIDR(PAYMENT_FEE_FLAT)}/transaksi adalah asumsi ilustratif.
      </Callout>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Transaksi berhasil" value={summary.gross} format="idrCompact" icon={<Wallet className="h-4 w-4" />} tone="sky" />
        <KpiCard label="Menunggu pembayaran" value={summary.pending} format="idrCompact" icon={<CreditCard className="h-4 w-4" />} tone="brand" />
        <KpiCard label="Refund" value={summary.refunds} format="idrCompact" icon={<RotateCcw className="h-4 w-4" />} tone="navy" />
        <KpiCard label="Estimasi diterima organizer" value={summary.gross * (1 - PLATFORM_FEE_RATE)} format="idrCompact" icon={<Receipt className="h-4 w-4" />} tone="sky" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-[15px] font-bold text-ink">
              <Calculator className="h-4 w-4 text-sky-ink" /> Fee calculation preview
            </p>
            <SourceLabel type="illustrative-assumption" compact />
          </div>
          <div className="mt-4 grid gap-3">
            <Field>
              <Label htmlFor="fin-event">Event</Label>
              <Select id="fin-event" value={ev?.id} onChange={(e) => setEventId(e.target.value)}>
                {paidEvents.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="fin-fee">Biaya / pendaftar</Label>
                <Input id="fin-fee" type="number" min={0} step={5000} value={fee} onChange={(e) => setFee(Math.max(0, Number(e.target.value)))} />
              </Field>
              <Field>
                <Label htmlFor="fin-count">Jumlah pendaftar</Label>
                <Input id="fin-count" type="number" min={0} value={count} onChange={(e) => setCount(Math.max(0, Number(e.target.value)))} />
              </Field>
            </div>
          </div>
          <dl className="mt-5 space-y-2 text-sm">
            {[
              ["Pendapatan registrasi kotor", formatIDR(gross), "text-ink"],
              [`Biaya platform (${Math.round(PLATFORM_FEE_RATE * 100)}%)`, `− ${formatIDR(platform)}`, "text-danger-ink"],
              ["Biaya pembayaran", `− ${formatIDR(payment)}`, "text-danger-ink"],
            ].map(([k, v, c]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-muted-strong">{k}</dt>
                <dd className={`tabular font-semibold ${c}`}>{v}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="font-bold text-ink">Estimasi diterima organizer</dt>
              <dd className="tabular font-display text-lg font-extrabold text-ink">{formatIDR(net)}</dd>
            </div>
          </dl>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="text-[15px] font-bold text-ink">Riwayat transaksi (fiktif)</p>
            <span className="text-xs text-muted">Total {formatIDRCompact(summary.gross + summary.pending + summary.refunds)}</span>
          </div>
          <div className="scrollbar-thin max-h-[420px] overflow-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="sticky top-0 bg-surface text-xs text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">ID</th>
                  <th className="px-4 py-2.5 font-semibold">Pembayar</th>
                  <th className="px-4 py-2.5 font-semibold">Event</th>
                  <th className="px-4 py-2.5 font-semibold">Metode</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Jumlah</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SEED_TRANSACTIONS.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-strong">{t.id}</td>
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-ink">{t.payer}</p>
                      <p className="text-[11px] text-muted">{formatDate(t.date)}</p>
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-2.5 text-muted-strong">{eventName(t.eventId)}</td>
                    <td className="px-4 py-2.5 text-muted-strong">{t.method}</td>
                    <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">{formatIDR(t.amount)}</td>
                    <td className="px-4 py-2.5">
                      <Badge tone={TX_TONE[t.status]}>{t.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
