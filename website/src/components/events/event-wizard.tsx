"use client";

import { useState } from "react";
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

const stageTypes = ["registrasi", "submisi", "penjurian", "pengumuman", "acara"] as const;

const schema = z
  .object({
    name: z.string().trim().min(5, { message: "Nama event minimal 5 karakter." }),
    organizer: z.string().trim().min(3, { message: "Nama penyelenggara minimal 3 karakter." }),
    description: z.string().trim().min(20, { message: "Deskripsi minimal 20 karakter." }),
    category: z.enum(["kompetisi", "konferensi", "workshop", "seminar"]),
    mode: z.enum(["online", "offline", "hybrid"]),
    location: z.string().trim().min(2, { message: "Lokasi wajib diisi." }),
    teamBased: z.boolean(),
    fee: z.number({ message: "Isi biaya dalam angka (0 untuk gratis)." }).min(0, { message: "Biaya tidak boleh negatif." }),
    quota: z.number({ message: "Isi kuota dalam angka." }).min(10, { message: "Kuota minimal 10 peserta." }).max(5000, { message: "Kuota maksimal 5.000." }),
    startDate: z.string().min(1, { message: "Tanggal mulai wajib diisi." }),
    endDate: z.string().min(1, { message: "Tanggal selesai wajib diisi." }),
    registrationClose: z.string().min(1, { message: "Tanggal tutup registrasi wajib diisi." }),
    stages: z
      .array(
        z.object({
          name: z.string().trim().min(2, { message: "Nama tahap wajib diisi." }),
          type: z.enum(stageTypes),
          date: z.string().min(1, { message: "Tanggal wajib diisi." }),
        }),
      )
      .min(1, { message: "Tambahkan minimal satu tahapan." }),
    criteria: z.array(
      z.object({
        name: z.string().trim().min(2, { message: "Nama kriteria wajib diisi." }),
        weight: z.number({ message: "Bobot harus angka." }).min(1, { message: "Min 1%" }).max(100, { message: "Maks 100%" }),
        description: z.string(),
      }),
    ),
  })
  .superRefine((v, ctx) => {
    if (v.startDate && v.endDate && v.endDate < v.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "Tanggal selesai harus sama atau setelah tanggal mulai." });
    }
    if (v.registrationClose && v.startDate && v.registrationClose > v.startDate) {
      ctx.addIssue({ code: "custom", path: ["registrationClose"], message: "Registrasi harus ditutup sebelum acara dimulai." });
    }
    if (v.criteria.length > 0) {
      const total = v.criteria.reduce((a, c) => a + (Number.isFinite(c.weight) ? c.weight : 0), 0);
      if (total !== 100) ctx.addIssue({ code: "custom", path: ["criteria"], message: `Total bobot rubrik harus 100% (saat ini ${total}%).` });
    }
  });

export type EventFormValues = z.infer<typeof schema>;

const STEPS: { title: string; fields: FieldPath<EventFormValues>[] }[] = [
  { title: "Informasi dasar", fields: ["name", "organizer", "description"] },
  { title: "Kategori event", fields: ["category", "mode", "location", "teamBased"] },
  { title: "Registrasi", fields: ["fee", "quota"] },
  { title: "Tanggal penting", fields: ["startDate", "endDate", "registrationClose"] },
  { title: "Submisi & penjurian", fields: ["stages", "criteria"] },
  { title: "Preview & publish", fields: [] },
];

export const EMPTY_EVENT: EventFormValues = {
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
  stages: [{ name: "Registrasi", type: "registrasi", date: "2026-11-15" }],
  criteria: [],
};

/** Turns a Smart Event Template into wizard values relative to a start date. */
export function templateToValues(t: EventTemplate, registrationOpen = "2026-11-10"): EventFormValues {
  const end = addDays(registrationOpen, t.defaults.durationDays);
  const lastStage = t.defaults.stages[t.defaults.stages.length - 1];
  const start = lastStage.type === "acara" ? addDays(registrationOpen, lastStage.offsetDays) : addDays(registrationOpen, Math.max(1, t.defaults.durationDays - 1));
  return {
    name: `${t.name} 2027`,
    organizer: "Organizer Demo",
    description: `${t.description} Dibuat dari Smart Event Template — sesuaikan detailnya sebelum dipublikasikan.`,
    category: t.category,
    mode: t.defaults.mode,
    location: t.defaults.mode === "online" ? "Online" : "Jakarta",
    teamBased: t.defaults.teamBased,
    fee: t.defaults.fee,
    quota: t.defaults.quota,
    startDate: start,
    endDate: end < start ? start : end,
    registrationClose: addDays(start, -3),
    stages: t.defaults.stages.map((s) => ({ name: s.name, type: s.type, date: addDays(registrationOpen, s.offsetDays) })),
    criteria: t.defaults.criteria.map((c) => ({ ...c })),
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
  const addEvent = useEventsStore((s) => s.addEvent);
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState<EventItem | null>(null);
  const form = useForm<EventFormValues>({ resolver: zodResolver(schema), defaultValues: initial ?? EMPTY_EVENT, mode: "onTouched" });
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
    else toast.error("Lengkapi isian yang ditandai sebelum melanjutkan.");
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
      toast.success("Event dipublikasikan (simulasi).", { description: v.name });
    },
    () => toast.error("Masih ada isian yang belum valid. Periksa kembali langkah sebelumnya."),
  );

  if (published) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-line bg-card p-10 text-center shadow-card">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-soft text-success">
          <PartyPopper className="h-8 w-8" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold text-ink">Event berhasil dipublikasikan!</h3>
        <p className="mx-auto mt-2 max-w-md text-muted-strong">
          <strong className="text-ink">{published.name}</strong> kini tampil di daftar event dan katalog peserta. Tidak ada data yang dikirim ke
          server — semuanya tersimpan lokal di browser Anda.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={onDone}>Lihat di daftar event</Button>
          <Button
            variant="secondary"
            onClick={() => {
              form.reset(EMPTY_EVENT);
              setPublished(null);
              setStep(0);
            }}
          >
            Buat event lain
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-2xl border border-line bg-card p-4 shadow-soft lg:sticky lg:top-24">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Buat event</p>
          {source === "template" ? <Badge tone="ace">Template</Badge> : <Badge tone="neutral">Manual</Badge>}
        </div>
        {templateName && (
          <p className="mb-3 flex items-center gap-1.5 rounded-lg bg-ace-soft px-2.5 py-1.5 text-xs font-semibold text-ace-ink">
            <Sparkles className="h-3.5 w-3.5" /> {templateName}
          </p>
        )}
        <ol className="space-y-1">
          {STEPS.map((s, i) => (
            <li key={s.title}>
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
                {s.title}
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-track">
          <motion.div className="h-full bg-brand-gradient" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">
          Langkah {step + 1} dari {STEPS.length}
        </p>
      </aside>

      <form onSubmit={(e) => e.preventDefault()} className="rounded-2xl border border-line bg-card p-6 shadow-soft" noValidate>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-ink">
            {step + 1}. {STEPS[step].title}
          </h3>
          <SourceLabel type="synthetic-demo" compact />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
            {step === 0 && (
              <div className="grid gap-4">
                <Field>
                  <Label htmlFor="name" required>Nama event</Label>
                  <Input id="name" aria-invalid={!!errors.name} placeholder="mis. Nusantara Business Case Challenge 2027" {...register("name")} />
                  <FieldError message={errors.name?.message} />
                </Field>
                <Field>
                  <Label htmlFor="organizer" required>Penyelenggara</Label>
                  <Input id="organizer" aria-invalid={!!errors.organizer} {...register("organizer")} />
                  <FieldError message={errors.organizer?.message} />
                </Field>
                <Field>
                  <Label htmlFor="description" required hint={`${values.description?.length ?? 0} karakter`}>Deskripsi</Label>
                  <Textarea id="description" aria-invalid={!!errors.description} placeholder="Jelaskan tujuan, peserta, dan format event…" {...register("description")} />
                  <FieldError message={errors.description?.message} />
                </Field>
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <Label required>Kategori</Label>
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
                        {CATEGORY_LABEL[c]}
                      </label>
                    ))}
                  </div>
                </Field>
                <Field>
                  <Label htmlFor="mode" required>Format</Label>
                  <Select id="mode" {...register("mode")}>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="location" required>Lokasi</Label>
                  <Input id="location" aria-invalid={!!errors.location} {...register("location")} />
                  <FieldError message={errors.location?.message} />
                </Field>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line p-3.5 sm:col-span-2">
                  <input type="checkbox" className="h-4 w-4 accent-primary" {...register("teamBased")} />
                  <span>
                    <span className="block text-sm font-semibold text-ink">Pendaftaran berbasis tim</span>
                    <span className="text-xs text-muted">Peserta mendaftar sebagai tim (mis. kompetisi studi kasus).</span>
                  </span>
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="fee" required hint="0 = gratis">Biaya registrasi (Rp)</Label>
                  <Input id="fee" type="number" min={0} step={5000} aria-invalid={!!errors.fee} {...register("fee", { valueAsNumber: true })} />
                  <FieldError message={errors.fee?.message} />
                </Field>
                <Field>
                  <Label htmlFor="quota" required>Kuota peserta {values.teamBased ? "(tim)" : ""}</Label>
                  <Input id="quota" type="number" min={10} aria-invalid={!!errors.quota} {...register("quota", { valueAsNumber: true })} />
                  <FieldError message={errors.quota?.message} />
                </Field>
                <Callout tone="info" className="sm:col-span-2" title="Pembayaran disimulasikan">
                  Prototype tidak terhubung ke penyedia pembayaran. Estimasi nilai registrasi penuh:{" "}
                  <strong>{formatIDR((Number(values.fee) || 0) * (Number(values.quota) || 0))}</strong>.
                </Callout>
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <Label htmlFor="registrationClose" required>Registrasi ditutup</Label>
                  <Input id="registrationClose" type="date" aria-invalid={!!errors.registrationClose} {...register("registrationClose")} />
                  <FieldError message={errors.registrationClose?.message} />
                </Field>
                <Field>
                  <Label htmlFor="startDate" required>Tanggal mulai</Label>
                  <Input id="startDate" type="date" aria-invalid={!!errors.startDate} {...register("startDate")} />
                  <FieldError message={errors.startDate?.message} />
                </Field>
                <Field>
                  <Label htmlFor="endDate" required>Tanggal selesai</Label>
                  <Input id="endDate" type="date" aria-invalid={!!errors.endDate} {...register("endDate")} />
                  <FieldError message={errors.endDate?.message} />
                </Field>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">Tahapan event</p>
                    <Button size="sm" variant="soft" onClick={() => stages.append({ name: "", type: "submisi", date: values.startDate || "2026-12-01" })}>
                      <Plus className="h-3.5 w-3.5" /> Tahap
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {stages.fields.map((f, i) => (
                      <div key={f.id} className="grid gap-2 rounded-xl bg-surface p-3 ring-1 ring-line sm:grid-cols-[1.4fr_1fr_1fr_auto]">
                        <div>
                          <Input aria-label={`Nama tahap ${i + 1}`} aria-invalid={!!errors.stages?.[i]?.name} placeholder="Nama tahap" {...register(`stages.${i}.name`)} />
                          <FieldError message={errors.stages?.[i]?.name?.message} />
                        </div>
                        <Select aria-label={`Jenis tahap ${i + 1}`} {...register(`stages.${i}.type`)}>
                          {stageTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </Select>
                        <div>
                          <Input type="date" aria-label={`Tanggal tahap ${i + 1}`} {...register(`stages.${i}.date`)} />
                          <FieldError message={errors.stages?.[i]?.date?.message} />
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => stages.remove(i)} aria-label="Hapus tahap" disabled={stages.fields.length <= 1}>
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
                      Rubrik penjurian <span className="font-normal text-muted">(opsional)</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn("tabular rounded-full px-2 py-0.5 text-xs font-semibold", criteria.fields.length === 0 ? "bg-surface text-muted" : weightTotal === 100 ? "bg-success-soft text-success-ink" : "bg-warning-soft text-warning-ink")}>
                        Total {weightTotal}%
                      </span>
                      <Button size="sm" variant="soft" onClick={() => criteria.append({ name: "", weight: 10, description: "" })}>
                        <Plus className="h-3.5 w-3.5" /> Kriteria
                      </Button>
                    </div>
                  </div>
                  {criteria.fields.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">Tidak ada penjurian untuk event ini.</p>
                  ) : (
                    <div className="space-y-2">
                      {criteria.fields.map((f, i) => (
                        <div key={f.id} className="grid gap-2 rounded-xl bg-surface p-3 ring-1 ring-line sm:grid-cols-[1.5fr_110px_auto]">
                          <div>
                            <Input placeholder="Nama kriteria" aria-label={`Kriteria ${i + 1}`} {...register(`criteria.${i}.name`)} />
                            <FieldError message={errors.criteria?.[i]?.name?.message} />
                          </div>
                          <div>
                            <Input type="number" min={1} max={100} aria-label={`Bobot kriteria ${i + 1}`} {...register(`criteria.${i}.weight`, { valueAsNumber: true })} />
                            <FieldError message={errors.criteria?.[i]?.weight?.message} />
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => criteria.remove(i)} aria-label="Hapus kriteria">
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
                    <Badge tone="navy">{CATEGORY_LABEL[values.category]}</Badge>
                    <h4 className="mt-3 text-2xl font-semibold">{values.name}</h4>
                    <p className="text-sm text-white/85">{values.organizer}</p>
                  </div>
                  <div className="grid gap-4 p-5 sm:grid-cols-2">
                    <p className="text-sm text-muted-strong sm:col-span-2">{values.description}</p>
                    {[
                      ["Tanggal", `${formatDate(values.startDate)} – ${formatDate(values.endDate)}`],
                      ["Registrasi ditutup", formatDate(values.registrationClose)],
                      ["Format & lokasi", `${values.mode} · ${values.location}`],
                      ["Biaya & kuota", `${values.fee ? formatIDR(values.fee) : "Gratis"} · ${formatNumber(values.quota || 0)} ${values.teamBased ? "tim" : "peserta"}`],
                      ["Tahapan", `${values.stages?.length ?? 0} tahap`],
                      ["Rubrik", values.criteria?.length ? `${values.criteria.length} kriteria (${weightTotal}%)` : "Tanpa penjurian"],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                        <p className="text-xs text-muted">{k}</p>
                        <p className="font-semibold text-ink">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Callout tone="success" icon={<CheckCircle2 className="h-[18px] w-[18px]" />} title="Siap dipublikasikan">
                  Publikasi ini hanya simulasi: event tersimpan di browser dan muncul di katalog peserta demo.
                </Callout>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <Button variant="ghost" onClick={() => (step === 0 ? onDone() : setStep((s) => s - 1))}>
            <ArrowLeft className="h-4 w-4" /> {step === 0 ? "Batal" : "Kembali"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              Lanjut <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => void publish()}>
              <PartyPopper className="h-4 w-4" /> Publikasikan (demo)
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
