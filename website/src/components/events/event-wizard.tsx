"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, PartyPopper, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { EventItem, EventTemplate } from "@/types/events";
import { useEventsStore } from "@/store/events-store";
import { CATEGORY_LABEL } from "@/data/events.mock";
import { Button } from "@/components/ui/button";
import { Field, FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/misc";
import { SourceLabel } from "@/components/shared/source-label";
import { addDays, formatDate, formatIDR, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { L, useI18n, type Txt } from "@/lib/i18n";
import { MODE_LABEL, STAGE_TYPE_LABEL } from "./shared";

const stageTypes = ["registrasi", "submisi", "penjurian", "pengumuman", "acara"] as const;

type Translate = (value: Txt, en?: string) => string;

/** Validation schema with messages in the active language. */
function makeSchema(t: Translate) {
  return z
    .object({
      name: z.string().trim().min(5, { message: t("Nama _event_ minimal 5 karakter.", "Event name must be at least 5 characters.") }),
      organizer: z.string().trim().min(3, { message: t("Nama penyelenggara minimal 3 karakter.", "Organiser name must be at least 3 characters.") }),
      description: z.string().trim().min(20, { message: t("Deskripsi minimal 20 karakter.", "Description must be at least 20 characters.") }),
      category: z.enum(["kompetisi", "konferensi", "workshop", "seminar"]),
      mode: z.enum(["online", "offline", "hybrid"]),
      location: z.string().trim().min(2, { message: t("Lokasi wajib diisi.", "Location is required.") }),
      teamBased: z.boolean(),
      fee: z
        .number({ message: t("Isi biaya dalam angka (0 untuk gratis).", "Enter the fee as a number (0 for free).") })
        .min(0, { message: t("Biaya tidak boleh negatif.", "The fee cannot be negative.") }),
      quota: z
        .number({ message: t("Isi kuota dalam angka.", "Enter the quota as a number.") })
        .min(10, { message: t("Kuota minimal 10 peserta.", "The quota must be at least 10.") })
        .max(5000, { message: t("Kuota maksimal 5.000.", "The quota can be at most 5,000.") }),
      startDate: z.string().min(1, { message: t("Tanggal mulai wajib diisi.", "Start date is required.") }),
      endDate: z.string().min(1, { message: t("Tanggal selesai wajib diisi.", "End date is required.") }),
      registrationClose: z.string().min(1, { message: t("Tanggal tutup registrasi wajib diisi.", "Registration close date is required.") }),
      stages: z
        .array(
          z.object({
            name: z.string().trim().min(2, { message: t("Nama tahap wajib diisi.", "Stage name is required.") }),
            type: z.enum(stageTypes),
            date: z.string().min(1, { message: t("Tanggal wajib diisi.", "Date is required.") }),
          }),
        )
        .min(1, { message: t("Tambahkan minimal satu tahapan.", "Add at least one stage.") }),
      criteria: z.array(
        z.object({
          name: z.string().trim().min(2, { message: t("Nama kriteria wajib diisi.", "Criterion name is required.") }),
          weight: z
            .number({ message: t("Bobot harus angka.", "Weight must be a number.") })
            .min(1, { message: "Min 1%" })
            .max(100, { message: t("Maks 100%", "Max 100%") }),
          description: z.string(),
        }),
      ),
    })
    .superRefine((v, ctx) => {
      if (v.startDate && v.endDate && v.endDate < v.startDate) {
        ctx.addIssue({ code: "custom", path: ["endDate"], message: t("Tanggal selesai harus sama atau setelah tanggal mulai.", "End date must be on or after the start date.") });
      }
      if (v.registrationClose && v.startDate && v.registrationClose > v.startDate) {
        ctx.addIssue({ code: "custom", path: ["registrationClose"], message: t("Registrasi harus ditutup sebelum acara dimulai.", "Registration must close before the event starts.") });
      }
      if (v.criteria.length > 0) {
        const total = v.criteria.reduce((a, c) => a + (Number.isFinite(c.weight) ? c.weight : 0), 0);
        if (total !== 100)
          ctx.addIssue({
            code: "custom",
            path: ["criteria"],
            message: t(`Total bobot rubrik harus 100% (saat ini ${total}%).`, `Rubric weights must total 100% (currently ${total}%).`),
          });
      }
    });
}

export type EventFormValues = z.infer<ReturnType<typeof makeSchema>>;

const STEPS: { title: Txt; fields: FieldPath<EventFormValues>[] }[] = [
  { title: L("Informasi dasar", "Basic information"), fields: ["name", "organizer", "description"] },
  { title: L("Kategori _event_", "Event category"), fields: ["category", "mode", "location", "teamBased"] },
  { title: L("Registrasi", "Registration"), fields: ["fee", "quota"] },
  { title: L("Tanggal penting", "Key dates"), fields: ["startDate", "endDate", "registrationClose"] },
  { title: L("Submisi & penjurian", "Submissions & judging"), fields: ["stages", "criteria"] },
  { title: L("Pratinjau & publikasi", "Preview & publish"), fields: [] },
];

function emptyEvent(t: Translate): EventFormValues {
  return {
    name: "",
    organizer: "Organizer Demo",
    description: "",
    category: "kompetisi",
    mode: "online",
    location: "Online",
    teamBased: false,
    fee: 0,
    quota: 100,
    startDate: "2026-12-10",
    endDate: "2026-12-10",
    registrationClose: "2026-12-05",
    stages: [{ name: t("Registrasi", "Registration"), type: "registrasi", date: "2026-11-15" }],
    criteria: [],
  };
}

/** Turns a Smart Event Template into wizard values (in the active language) relative to a start date. */
export function templateToValues(tpl: EventTemplate, t: Translate, registrationOpen = "2026-11-10"): EventFormValues {
  const end = addDays(registrationOpen, tpl.defaults.durationDays);
  const lastStage = tpl.defaults.stages[tpl.defaults.stages.length - 1];
  const start = lastStage.type === "acara" ? addDays(registrationOpen, lastStage.offsetDays) : addDays(registrationOpen, Math.max(1, tpl.defaults.durationDays - 1));
  return {
    name: `${tpl.name} 2027`,
    organizer: "Organizer Demo",
    description: `${t(tpl.description)} ${t(
      "Dibuat dari Smart Event Template — sesuaikan detailnya sebelum dipublikasikan.",
      "Created from a Smart Event Template — adjust the details before publishing.",
    )}`,
    category: tpl.category,
    mode: tpl.defaults.mode,
    location: tpl.defaults.mode === "online" ? "Online" : "Jakarta",
    teamBased: tpl.defaults.teamBased,
    fee: tpl.defaults.fee,
    quota: tpl.defaults.quota,
    startDate: start,
    endDate: end < start ? start : end,
    registrationClose: addDays(start, -3),
    stages: tpl.defaults.stages.map((s) => ({ name: t(s.name), type: s.type, date: addDays(registrationOpen, s.offsetDays) })),
    criteria: tpl.defaults.criteria.map((c) => ({ name: t(c.name), weight: c.weight, description: t(c.description) })),
  };
}

export function EventWizard({
  initial,
  source,
  templateName,
  onDone,
}: {
  initial?: EventFormValues;
  source: "manual" | "template";
  templateName?: string;
  onDone: () => void;
}) {
  const { t, tx } = useI18n();
  const schema = useMemo(() => makeSchema(t), [t]);
  const addEvent = useEventsStore((s) => s.addEvent);
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState<EventItem | null>(null);
  const form = useForm<EventFormValues>({ resolver: zodResolver(schema), defaultValues: initial ?? emptyEvent(t), mode: "onTouched" });
  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = form;
  const stages = useFieldArray({ control, name: "stages" });
  const criteria = useFieldArray({ control, name: "criteria" });
  const values = useWatch({ control }) as EventFormValues;
  const weightTotal = (values.criteria ?? []).reduce((a, c) => a + (Number(c?.weight) || 0), 0);

  const next = async () => {
    const ok = await trigger(STEPS[step].fields, { shouldFocus: true });
    if (ok) setStep((s) => Math.min(STEPS.length - 1, s + 1));
    else toast.error(t("Lengkapi isian yang ditandai sebelum melanjutkan.", "Complete the highlighted fields before continuing."));
  };

  const publish = handleSubmit(
    (v) => {
      const created = addEvent({
        name: v.name,
        organizer: v.organizer,
        category: v.category,
        status: "published",
        location: v.location,
        mode: v.mode,
        startDate: v.startDate,
        endDate: v.endDate,
        registrationClose: v.registrationClose,
        fee: v.fee,
        quota: v.quota,
        registered: 0,
        submissions: 0,
        views: 0,
        description: v.description,
        teamBased: v.teamBased,
        stages: v.stages.map((s, i) => ({ id: `s${i + 1}`, ...s })),
        criteria: v.criteria.map((c, i) => ({ id: `c${i + 1}`, ...c })),
        createdFrom: source,
      });
      setPublished(created);
      toast.success(t("_Event_ dipublikasikan (simulasi).", "Event published (simulated)."), { description: v.name });
    },
    () => toast.error(t("Masih ada isian yang belum valid. Periksa kembali langkah sebelumnya.", "Some fields are still invalid. Please check the previous steps.")),
  );

  if (published) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-line bg-card p-10 text-center shadow-card">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-soft text-success">
          <PartyPopper className="h-8 w-8" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold text-ink">{tx("_Event_ berhasil dipublikasikan!", "Event published successfully!")}</h3>
        <p className="mx-auto mt-2 max-w-md text-muted-strong">
          <strong className="text-ink">{t(published.name)}</strong>{" "}
          {tx(
            "kini tampil di daftar _event_ dan katalog peserta. Tidak ada data yang dikirim ke _server_ — semuanya tersimpan lokal di _browser_ Anda.",
            "now appears in the event list and the participant catalogue. Nothing is sent to a server — everything is stored locally in your browser.",
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={onDone}>{tx("Lihat di daftar _event_", "View in the event list")}</Button>
          <Button
            variant="secondary"
            onClick={() => {
              form.reset(emptyEvent(t));
              setPublished(null);
              setStep(0);
            }}
          >
            {tx("Buat _event_ lain", "Create another event")}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-2xl border border-line bg-card p-4 shadow-soft lg:sticky lg:top-24">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">{tx("Buat _event_", "Create event")}</p>
          {source === "template" ? <Badge tone="ace">Template</Badge> : <Badge tone="neutral">Manual</Badge>}
        </div>
        {templateName && (
          <p className="mb-3 flex items-center gap-1.5 rounded-lg bg-ace-soft px-2.5 py-1.5 text-xs font-semibold text-ace-ink">
            <Sparkles className="h-3.5 w-3.5" /> {templateName}
          </p>
        )}
        <ol className="space-y-1">
          {STEPS.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition",
                  i === step ? "bg-soft font-semibold text-brand-ink" : i < step ? "font-semibold text-ink hover:bg-surface" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
                    i < step ? "bg-success text-white" : i === step ? "bg-brand-gradient text-white" : "bg-track text-muted",
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {tx(s.title)}
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-track">
          <motion.div className="h-full bg-brand-gradient" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">
          {t("Langkah", "Step")} {step + 1} {t("dari", "of")} {STEPS.length}
        </p>
      </aside>

      <form onSubmit={(e) => e.preventDefault()} className="rounded-2xl border border-line bg-card p-6 shadow-soft" noValidate>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-ink">
            {step + 1}. {tx(STEPS[step].title)}
          </h3>
          <SourceLabel type="synthetic-demo" compact />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
            {step === 0 && (
              <div className="grid gap-4">
                <Field>
                  <Label htmlFor="name" required>
                    {tx("Nama _event_", "Event name")}
                  </Label>
                  <Input id="name" aria-invalid={!!errors.name} placeholder={t("mis. Nusantara Business Case Challenge 2027", "e.g. Nusantara Business Case Challenge 2027")} {...register("name")} />
                  <FieldError message={errors.name?.message} />
                </Field>
                <Field>
                  <Label htmlFor="organizer" required>
                    {t("Penyelenggara", "Organiser")}
                  </Label>
                  <Input id="organizer" aria-invalid={!!errors.organizer} {...register("organizer")} />
                  <FieldError message={errors.organizer?.message} />
                </Field>
                <Field>
                  <Label htmlFor="description" required hint={`${values.description?.length ?? 0} ${t("karakter", "characters")}`}>
                    {t("Deskripsi", "Description")}
                  </Label>
                  <Textarea
                    id="description"
                    aria-invalid={!!errors.description}
                    placeholder={t("Jelaskan tujuan, peserta, dan format _event_…", "Describe the event's goals, participants and format…")}
                    {...register("description")}
                  />
                  <FieldError message={errors.description?.message} />
                </Field>
              </div>
            )}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <Label required>{t("Kategori", "Category")}</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(Object.keys(CATEGORY_LABEL) as EventItem["category"][]).map((c) => (
                      <label
                        key={c}
                        className={cn(
                          "cursor-pointer rounded-xl border p-3 text-center text-sm font-semibold transition",
                          values.category === c ? "border-brand bg-soft text-brand-ink" : "border-line text-muted-strong hover:border-brand/40",
                        )}
                      >
                        <input type="radio" value={c} className="sr-only" {...register("category")} />
                        {tx(CATEGORY_LABEL[c])}
                      </label>
                    ))}
                  </div>
                </Field>
                <Field>
                  <Label htmlFor="mode" required>
                    Format
                  </Label>
                  <Select id="mode" {...register("mode")}>
                    <option value="online">{t(MODE_LABEL.online)}</option>
                    <option value="offline">{t(MODE_LABEL.offline)}</option>
                    <option value="hybrid">{t(MODE_LABEL.hybrid)}</option>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="location" required>
                    {t("Lokasi", "Location")}
                  </Label>
                  <Input id="location" aria-invalid={!!errors.location} {...register("location")} />
                  <FieldError message={errors.location?.message} />
                </Field>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line p-3.5 sm:col-span-2">
                  <input type="checkbox" className="h-4 w-4 accent-primary" {...register("teamBased")} />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{t("Pendaftaran berbasis tim", "Team-based registration")}</span>
                    <span className="text-xs text-muted">{t("Peserta mendaftar sebagai tim (mis. kompetisi studi kasus).", "Participants register as teams (e.g. a case competition).")}</span>
                  </span>
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="fee" required hint={t("0 = gratis", "0 = free")}>
                    {t("Biaya registrasi (Rp)", "Registration fee (Rp)")}
                  </Label>
                  <Input id="fee" type="number" min={0} step={5000} aria-invalid={!!errors.fee} {...register("fee", { valueAsNumber: true })} />
                  <FieldError message={errors.fee?.message} />
                </Field>
                <Field>
                  <Label htmlFor="quota" required>
                    {t("Kuota peserta", "Participant quota")} {values.teamBased ? t("(tim)", "(teams)") : ""}
                  </Label>
                  <Input id="quota" type="number" min={10} aria-invalid={!!errors.quota} {...register("quota", { valueAsNumber: true })} />
                  <FieldError message={errors.quota?.message} />
                </Field>
                <Callout tone="info" className="sm:col-span-2" title={t("Pembayaran disimulasikan", "Payments are simulated")}>
                  {t("Prototipe tidak terhubung ke penyedia pembayaran. Estimasi nilai registrasi penuh:", "The prototype is not connected to a payment provider. Estimated value at full registration:")}{" "}
                  <strong>{formatIDR((Number(values.fee) || 0) * (Number(values.quota) || 0))}</strong>.
                </Callout>
              </div>
            )}
            {step === 3 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field>
                  <Label htmlFor="registrationClose" required>
                    {t("Registrasi ditutup", "Registration closes")}
                  </Label>
                  <Input id="registrationClose" type="date" aria-invalid={!!errors.registrationClose} {...register("registrationClose")} />
                  <FieldError message={errors.registrationClose?.message} />
                </Field>
                <Field>
                  <Label htmlFor="startDate" required>
                    {t("Tanggal mulai", "Start date")}
                  </Label>
                  <Input id="startDate" type="date" aria-invalid={!!errors.startDate} {...register("startDate")} />
                  <FieldError message={errors.startDate?.message} />
                </Field>
                <Field>
                  <Label htmlFor="endDate" required>
                    {t("Tanggal selesai", "End date")}
                  </Label>
                  <Input id="endDate" type="date" aria-invalid={!!errors.endDate} {...register("endDate")} />
                  <FieldError message={errors.endDate?.message} />
                </Field>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{tx("Tahapan _event_", "Event stages")}</p>
                    <Button size="sm" variant="soft" onClick={() => stages.append({ name: "", type: "submisi", date: values.startDate || "2026-12-01" })}>
                      <Plus className="h-3.5 w-3.5" /> {t("Tahap", "Stage")}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {stages.fields.map((f, i) => (
                      <div key={f.id} className="grid grid-cols-1 gap-2 rounded-xl bg-surface p-3 ring-1 ring-line sm:grid-cols-[1.4fr_1fr_1fr_auto]">
                        <div>
                          <Input
                            aria-label={`${t("Nama tahap", "Stage name")} ${i + 1}`}
                            aria-invalid={!!errors.stages?.[i]?.name}
                            placeholder={t("Nama tahap", "Stage name")}
                            {...register(`stages.${i}.name`)}
                          />
                          <FieldError message={errors.stages?.[i]?.name?.message} />
                        </div>
                        <Select aria-label={`${t("Jenis tahap", "Stage type")} ${i + 1}`} {...register(`stages.${i}.type`)}>
                          {stageTypes.map((type) => (
                            <option key={type} value={type}>
                              {t(STAGE_TYPE_LABEL[type])}
                            </option>
                          ))}
                        </Select>
                        <div>
                          <Input type="date" aria-label={`${t("Tanggal tahap", "Stage date")} ${i + 1}`} {...register(`stages.${i}.date`)} />
                          <FieldError message={errors.stages?.[i]?.date?.message} />
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => stages.remove(i)} aria-label={t("Hapus tahap", "Remove stage")} disabled={stages.fields.length <= 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FieldError message={errors.stages?.root?.message ?? errors.stages?.message} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">
                      {t("Rubrik penjurian", "Judging rubric")} <span className="font-normal text-muted">{t("(opsional)", "(optional)")}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn("tabular rounded-full px-2 py-0.5 text-xs font-semibold", criteria.fields.length === 0 ? "bg-surface text-muted" : weightTotal === 100 ? "bg-success-soft text-success-ink" : "bg-warning-soft text-warning-ink")}>
                        Total {weightTotal}%
                      </span>
                      <Button size="sm" variant="soft" onClick={() => criteria.append({ name: "", weight: 10, description: "" })}>
                        <Plus className="h-3.5 w-3.5" /> {t("Kriteria", "Criterion")}
                      </Button>
                    </div>
                  </div>
                  {criteria.fields.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">{tx("Tidak ada penjurian untuk _event_ ini.", "No judging for this event.")}</p>
                  ) : (
                    <div className="space-y-2">
                      {criteria.fields.map((f, i) => (
                        <div key={f.id} className="grid grid-cols-1 gap-2 rounded-xl bg-surface p-3 ring-1 ring-line sm:grid-cols-[1.5fr_110px_auto]">
                          <div>
                            <Input placeholder={t("Nama kriteria", "Criterion name")} aria-label={`${t("Kriteria", "Criterion")} ${i + 1}`} {...register(`criteria.${i}.name`)} />
                            <FieldError message={errors.criteria?.[i]?.name?.message} />
                          </div>
                          <div>
                            <Input type="number" min={1} max={100} aria-label={`${t("Bobot kriteria", "Criterion weight")} ${i + 1}`} {...register(`criteria.${i}.weight`, { valueAsNumber: true })} />
                            <FieldError message={errors.criteria?.[i]?.weight?.message} />
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => criteria.remove(i)} aria-label={t("Hapus kriteria", "Remove criterion")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FieldError message={errors.criteria?.root?.message ?? errors.criteria?.message} />
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-5">
                <div className="overflow-hidden rounded-2xl border border-line">
                  <div className="bg-[linear-gradient(135deg,#5fd0ff,#2f66e0)] p-6 text-white">
                    <Badge tone="navy">{tx(CATEGORY_LABEL[values.category])}</Badge>
                    <h4 className="mt-3 text-2xl font-semibold">{values.name}</h4>
                    <p className="text-sm text-white/85">{values.organizer}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                    <p className="text-sm text-muted-strong sm:col-span-2">{values.description}</p>
                    {[
                      [t("Tanggal", "Dates"), `${formatDate(values.startDate)} – ${formatDate(values.endDate)}`],
                      [t("Registrasi ditutup", "Registration closes"), formatDate(values.registrationClose)],
                      [t("Format & lokasi", "Format & location"), `${t(MODE_LABEL[values.mode])} · ${values.location}`],
                      [
                        t("Biaya & kuota", "Fee & quota"),
                        `${values.fee ? formatIDR(values.fee) : t("Gratis", "Free")} · ${formatNumber(values.quota || 0)} ${values.teamBased ? t("tim", "teams") : t("peserta", "participants")}`,
                      ],
                      [t("Tahapan", "Stages"), `${values.stages?.length ?? 0} ${t("tahap", "stages")}`],
                      [
                        t("Rubrik", "Rubric"),
                        values.criteria?.length ? `${values.criteria.length} ${t("kriteria", "criteria")} (${weightTotal}%)` : t("Tanpa penjurian", "No judging"),
                      ],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                        <p className="text-xs text-muted">{k}</p>
                        <p className="font-semibold text-ink">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Callout tone="success" icon={<CheckCircle2 className="h-[18px] w-[18px]" />} title={t("Siap dipublikasikan", "Ready to publish")}>
                  {tx(
                    "Publikasi ini hanya simulasi: _event_ tersimpan di _browser_ dan muncul di katalog peserta demo.",
                    "Publishing is simulated: the event is saved in your browser and appears in the demo participant catalogue.",
                  )}
                </Callout>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <Button variant="ghost" onClick={() => (step === 0 ? onDone() : setStep((s) => s - 1))}>
            <ArrowLeft className="h-4 w-4" /> {step === 0 ? t("Batal", "Cancel") : t("Kembali", "Back")}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              {t("Lanjut", "Next")} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => void publish()}>
              <PartyPopper className="h-4 w-4" /> {t("Publikasikan (demo)", "Publish (demo)")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
