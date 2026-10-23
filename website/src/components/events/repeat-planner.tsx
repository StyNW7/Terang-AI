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
import { L, useI18n, type Bilingual, type Locale, type Txt } from "@/lib/i18n";
import { pick } from "@/lib/i18n-core";

function nextEditionName(name: string, locale: Locale) {
  const m = name.match(/(20\d{2})/);
  if (m) return name.replace(m[1], String(Number(m[1]) + 1));
  return `${name} — ${locale === "en" ? "Next Edition" : "Edisi Berikutnya"}`;
}

/** The suggested next-edition name in both languages. */
const suggestedName = (name: Txt): Bilingual => ({ id: nextEditionName(pick(name, "id"), "id"), en: nextEditionName(pick(name, "en"), "en") });

export function RepeatPlanner({ preselect, onDone }: { preselect?: string; onDone: () => void }) {
  const { t, tx, locale } = useI18n();
  const events = useEventsStore((s) => s.events);
  const duplicateEvent = useEventsStore((s) => s.duplicateEvent);
  const [sourceId, setSourceId] = useState(preselect ?? "ev-hack25");
  const source = events.find((e) => e.id === sourceId) ?? events[0];
  const [name, setName] = useState(t(suggestedName(source?.name ?? "")));
  const [shift, setShift] = useState(365);
  const [copyStages, setCopyStages] = useState(true);
  const [copyRubric, setCopyRubric] = useState(true);
  const [copyRegistration, setCopyRegistration] = useState(true);
  const [lastSource, setLastSource] = useState(sourceId);

  if (lastSource !== sourceId && source) {
    setLastSource(sourceId);
    setName(t(suggestedName(source.name)));
  }

  // Follow a language switch while the suggested (unedited) name is shown.
  const [lastLocale, setLastLocale] = useState(locale);
  if (lastLocale !== locale && source) {
    setLastLocale(locale);
    const suggested = suggestedName(source.name);
    if (name === suggested[lastLocale]) setName(suggested[locale]);
  }

  if (!source) return null;

  const fallbackStage = { id: "s1", name: L("Registrasi", "Registration") as Txt, date: addDays(source.registrationClose, -30), type: "registrasi" as const };
  const previewStages = copyStages ? source.stages : [fallbackStage];

  const duplicate = () => {
    if (name.trim().length < 5) {
      toast.error(t("Nama edisi baru minimal 5 karakter.", "The new edition name must be at least 5 characters."));
      return;
    }
    // Keep both languages when the suggested name was not edited.
    const suggested = suggestedName(source.name);
    const created = duplicateEvent(source.id, {
      name: name.trim() === t(suggested) ? suggested : name.trim(),
      startDate: addDays(source.startDate, shift),
      endDate: addDays(source.endDate, shift),
      registrationClose: addDays(source.registrationClose, shift),
      stages: previewStages.map((s) => ({ ...s, date: addDays(s.date, shift) })),
      criteria: copyRubric ? source.criteria : [],
      fee: copyRegistration ? source.fee : 0,
      quota: copyRegistration ? source.quota : 100,
    });
    if (created) {
      toast.success(t("Edisi baru dibuat sebagai _draft_.", "New edition created as a draft."), {
        description: t(`${t(created.name)} — tanpa data peserta.`, `${t(created.name)} — without participant data.`),
      });
      onDone();
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-sm font-semibold text-ink">{tx("1. Pilih _event_ sumber", "1. Choose the source event")}</p>
          <Select className="mt-3" value={sourceId} onChange={(e) => setSourceId(e.target.value)} aria-label={t("_Event_ sumber", "Source event")}>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {t(e.name)}
              </option>
            ))}
          </Select>
          <div className="mt-4 rounded-xl bg-surface p-4 ring-1 ring-line">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-ink">{t(source.name)}</p>
              <EventStatusBadge status={source.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <p className="text-muted-strong">
                {t("Tanggal", "Date")}: <span className="font-semibold text-ink">{formatDate(source.startDate)}</span>
              </p>
              <p className="text-muted-strong">
                {t("Tahapan", "Stages")}: <span className="font-semibold text-ink">{source.stages.length}</span>
              </p>
              <p className="text-muted-strong">
                {t("Rubrik", "Rubric")}:{" "}
                <span className="font-semibold text-ink">
                  {source.criteria.length} {t("kriteria", "criteria")}
                </span>
              </p>
              <p className="text-muted-strong">
                {t("Peserta", "Participants")}: <span className="font-semibold text-ink">{formatNumber(source.registered)}</span>
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold text-ink">{t("2. Apa yang disalin?", "2. What gets copied?")}</p>
          <div className="mt-3 space-y-2">
            <Checkbox id="copy-stages" checked={copyStages} onChange={setCopyStages} label={t("Tahapan & jadwal (digeser otomatis)", "Stages & schedule (shifted automatically)")} />
            <Checkbox id="copy-rubric" checked={copyRubric} onChange={setCopyRubric} label={tx("Rubrik & _workflow_ penjurian", "Rubric & judging workflow")} />
            <Checkbox id="copy-reg" checked={copyRegistration} onChange={setCopyRegistration} label={t("Pengaturan registrasi (biaya & kuota)", "Registration settings (fee & quota)")} />
            <div className="flex items-start gap-3 rounded-xl border border-dashed border-line bg-surface p-3.5">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <span className="text-sm text-muted-strong">
                <strong className="text-ink">{t("Data peserta, submisi & transaksi tidak pernah disalin", "Participant, submission & transaction data is never copied")}</strong> —{" "}
                {t("melindungi data pribadi.", "protecting personal data.")}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="text-sm font-semibold text-ink">{t("3. Atur edisi baru", "3. Set up the new edition")}</p>
          <div className="mt-3 grid gap-4">
            <Field>
              <Label htmlFor="repeat-name" required>
                {t("Nama edisi baru", "New edition name")}
              </Label>
              <Input id="repeat-name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field>
              <Label htmlFor="repeat-shift" hint={`${shift} ${t("hari", "days")}`}>
                {t("Geser jadwal", "Shift schedule")}
              </Label>
              <Select id="repeat-shift" value={shift} onChange={(e) => setShift(Number(e.target.value))}>
                <option value={180}>{t("+6 bulan (180 hari)", "+6 months (180 days)")}</option>
                <option value={365}>{t("+1 tahun (365 hari)", "+1 year (365 days)")}</option>
                <option value={364}>{t("+52 minggu (hari yang sama)", "+52 weeks (same weekday)")}</option>
              </Select>
            </Field>
          </div>
          <p className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <CalendarRange className="h-4 w-4 text-sky-ink" /> {t("Pratinjau jadwal", "Schedule preview")}
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
                  <Check className="h-3.5 w-3.5 text-success" /> {tx(s.name)}
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
            <Copy className="h-4 w-4" /> {tx("Duplikasi sebagai _draft_", "Duplicate as draft")}
          </Button>
          <Callout tone="success" className="mt-4" icon={<Repeat className="h-[18px] w-[18px]" />}>
            {tx(
              "Ilustrasi: _setup_ edisi ulang turun dari ±14 hari menjadi ±5 hari (lihat Analitik → perbandingan edisi).",
              "Illustration: setting up a repeat edition drops from ~14 days to ~5 days (see Analytics → edition comparison).",
            )}
          </Callout>
        </div>
      </div>
    </div>
  );
}
