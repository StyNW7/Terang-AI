"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CalendarRange, Check, Copy, Lock, Repeat } from "lucide-react";
import { toast } from "sonner";
import { useEventsStore } from "@/store/events-store";
import { Button } from "@/components/ui/button";
import { Field, Input, Label, Select, Checkbox } from "@/components/ui/form";
import { Callout } from "@/components/ui/misc";
import { addDays, formatDate, formatNumber } from "@/lib/formatters";
import { EventStatusBadge } from "./shared";

function nextEditionName(name: string) {
  const m = name.match(/(20\d{2})/);
  if (m) return name.replace(m[1], String(Number(m[1]) + 1));
  return `${name} — Edisi Berikutnya`;
}

export function RepeatPlanner({ preselect, onDone }: { preselect?: string; onDone: () => void }) {
  const events = useEventsStore((s) => s.events);
  const duplicateEvent = useEventsStore((s) => s.duplicateEvent);
  const [sourceId, setSourceId] = useState(preselect ?? "ev-hack25");
  const source = events.find((e) => e.id === sourceId) ?? events[0];
  const [name, setName] = useState(nextEditionName(source?.name ?? ""));
  const [shift, setShift] = useState(365);
  const [copyStages, setCopyStages] = useState(true);
  const [copyRubric, setCopyRubric] = useState(true);
  const [copyRegistration, setCopyRegistration] = useState(true);
  const [lastSource, setLastSource] = useState(sourceId);

  if (lastSource !== sourceId && source) {
    setLastSource(sourceId);
    setName(nextEditionName(source.name));
  }

  if (!source) return null;

  const fallbackStage = { id: "s1", name: "Registrasi", date: addDays(source.registrationClose, -30), type: "registrasi" as const };
  const previewStages = copyStages ? source.stages : [fallbackStage];

  const duplicate = () => {
    if (name.trim().length < 5) {
      toast.error("Nama edisi baru minimal 5 karakter.");
      return;
    }
    const created = duplicateEvent(source.id, {
      name: name.trim(),
      startDate: addDays(source.startDate, shift),
      endDate: addDays(source.endDate, shift),
      registrationClose: addDays(source.registrationClose, shift),
      stages: previewStages.map((s) => ({ ...s, date: addDays(s.date, shift) })),
      criteria: copyRubric ? source.criteria : [],
      fee: copyRegistration ? source.fee : 0,
      quota: copyRegistration ? source.quota : 100,
    });
    if (created) {
      toast.success("Edisi baru dibuat sebagai draft.", { description: `${created.name} — tanpa data peserta.` });
      onDone();
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-sm font-semibold text-ink">1. Pilih event sumber</p>
          <Select className="mt-3" value={sourceId} onChange={(e) => setSourceId(e.target.value)} aria-label="Event sumber">
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </Select>
          <div className="mt-4 rounded-xl bg-surface p-4 ring-1 ring-line">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-ink">{source.name}</p>
              <EventStatusBadge status={source.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <p className="text-muted-strong">Tanggal: <span className="font-semibold text-ink">{formatDate(source.startDate)}</span></p>
              <p className="text-muted-strong">Tahapan: <span className="font-semibold text-ink">{source.stages.length}</span></p>
              <p className="text-muted-strong">Rubrik: <span className="font-semibold text-ink">{source.criteria.length} kriteria</span></p>
              <p className="text-muted-strong">Peserta: <span className="font-semibold text-ink">{formatNumber(source.registered)}</span></p>
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold text-ink">2. Apa yang disalin?</p>
          <div className="mt-3 space-y-2">
            <Checkbox id="copy-stages" checked={copyStages} onChange={setCopyStages} label="Tahapan & jadwal (digeser otomatis)" />
            <Checkbox id="copy-rubric" checked={copyRubric} onChange={setCopyRubric} label="Rubrik & workflow penjurian" />
            <Checkbox id="copy-reg" checked={copyRegistration} onChange={setCopyRegistration} label="Pengaturan registrasi (biaya & kuota)" />
            <div className="flex items-start gap-3 rounded-xl border border-dashed border-line bg-surface p-3.5">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <span className="text-sm text-muted-strong">
                <strong className="text-ink">Data peserta, submisi & transaksi tidak pernah disalin</strong> — melindungi data pribadi.
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-sm font-semibold text-ink">3. Atur edisi baru</p>
          <div className="mt-3 grid gap-4">
            <Field>
              <Label htmlFor="repeat-name" required>Nama edisi baru</Label>
              <Input id="repeat-name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field>
              <Label htmlFor="repeat-shift" hint={`${shift} hari`}>Geser jadwal</Label>
              <Select id="repeat-shift" value={shift} onChange={(e) => setShift(Number(e.target.value))}>
                <option value={180}>+6 bulan (180 hari)</option>
                <option value={365}>+1 tahun (365 hari)</option>
                <option value={364}>+52 minggu (hari yang sama)</option>
              </Select>
            </Field>
          </div>
          <p className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <CalendarRange className="h-4 w-4 text-sky-ink" /> Pratinjau jadwal
          </p>
          <ol className="mt-3 space-y-2">
            {previewStages.map((s, i) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2 text-sm ring-1 ring-line"
              >
                <span className="flex items-center gap-2 text-ink">
                  <Check className="h-3.5 w-3.5 text-success" /> {s.name}
                </span>
                <span className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted line-through">{formatDate(s.date)}</span>
                  <ArrowRight className="h-3 w-3 text-muted" />
                  <span className="font-semibold text-ink">{formatDate(addDays(s.date, shift))}</span>
                </span>
              </motion.li>
            ))}
          </ol>
          <Button className="mt-5 w-full" variant="ace" onClick={duplicate}>
            <Copy className="h-4 w-4" /> Duplikasi sebagai draft
          </Button>
          <Callout tone="success" className="mt-4" icon={<Repeat className="h-[18px] w-[18px]" />}>
            Ilustrasi: setup edisi ulang turun dari ±14 hari menjadi ±5 hari (lihat Analitik → perbandingan edisi).
          </Callout>
        </div>
      </div>
    </div>
  );
}
