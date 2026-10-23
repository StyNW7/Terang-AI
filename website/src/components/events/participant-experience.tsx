"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  FileUp,
  MapPin,
  Search,
  Ticket,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { EventItem } from "@/types/events";
import { useEventsStore } from "@/store/events-store";
import { CATEGORY_LABEL } from "@/data/events.mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Callout, EmptyState } from "@/components/ui/misc";
import { Modal } from "@/components/ui/modal";
import { LogoMark } from "@/components/shared/brand";
import { formatDate, formatIDR, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useI18n, type Txt } from "@/lib/i18n";
import { DEMO_TODAY, MODE_LABEL, PAYMENT_METHOD_LABEL } from "./shared";

type View = { name: "browse" } | { name: "detail"; id: string } | { name: "register"; id: string } | { name: "confirm"; id: string } | { name: "workspace"; id: string };

type Translate = (value: Txt, en?: string) => string;

const makeRegSchema = (t: Translate) =>
  z.object({
    name: z.string().trim().min(3, { message: t("Nama minimal 3 karakter.", "Name must be at least 3 characters.") }),
    email: z.string().trim().email({ message: t("Format _email_ tidak valid.", "Invalid email format.") }),
    institution: z.string().trim().min(3, { message: t("Institusi wajib diisi.", "Institution is required.") }),
    team: z.string().trim().optional(),
    agree: z.literal(true, { message: t("Setujui pernyataan data fiktif untuk melanjutkan.", "Confirm the fictional-data statement to continue.") }),
  });
type RegValues = z.infer<ReturnType<typeof makeRegSchema>>;

const makeSubSchema = (t: Translate) =>
  z.object({
    title: z.string().trim().min(5, { message: t("Judul minimal 5 karakter.", "Title must be at least 5 characters.") }),
    summary: z.string().trim().min(30, { message: t("Ringkasan minimal 30 karakter.", "Summary must be at least 30 characters.") }),
  });
type SubValues = z.infer<ReturnType<typeof makeSubSchema>>;

const GRADIENTS: Record<EventItem["category"], string> = {
  kompetisi: "bg-[linear-gradient(135deg,#39b7ff,#2f66e0)]",
  konferensi: "bg-[linear-gradient(135deg,#4a90e2,#17395e)]",
  workshop: "bg-[linear-gradient(135deg,#5fd0ff,#0c9fd8)]",
  seminar: "bg-[linear-gradient(135deg,#7aa7ff,#2251c9)]",
};

export function ParticipantExperience() {
  const { t, tx } = useI18n();
  const events = useEventsStore((s) => s.events);
  const registrations = useEventsStore((s) => s.registrations);
  const [view, setView] = useState<View>({ name: "browse" });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | EventItem["category"]>("all");

  const open = useMemo(
    () =>
      events.filter(
        (e) =>
          ["published", "registration", "judging"].includes(e.status) &&
          (category === "all" || e.category === category) &&
          t(e.name).toLowerCase().includes(query.toLowerCase()),
      ),
    [events, category, query, t],
  );
  const event = "id" in view ? events.find((e) => e.id === view.id) : undefined;
  const reg = event ? registrations.find((r) => r.eventId === event.id) : undefined;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={view.name + ("id" in view ? view.id : "")} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            {view.name === "browse" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-4 shadow-soft sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Cari _event_…", "Search events…")} className="pl-9" aria-label={t("Cari _event_", "Search events")} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(["all", ...Object.keys(CATEGORY_LABEL)] as ("all" | EventItem["category"])[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={cn(
                          "rounded-xl px-3 py-2 text-xs font-semibold ring-1 transition",
                          category === c ? "bg-brand-gradient text-white ring-transparent" : "bg-card text-muted-strong ring-line hover:ring-brand/40",
                        )}
                      >
                        {c === "all" ? t("Semua", "All") : tx(CATEGORY_LABEL[c])}
                      </button>
                    ))}
                  </div>
                </div>
                {open.length === 0 ? (
                  <EmptyState
                    icon={<Search className="h-5 w-5" />}
                    title={t("Tidak ada _event_ terbuka", "No open events")}
                    description={t("Coba kategori lain atau publikasikan _event_ baru dari mode _Organizer_.", "Try another category or publish a new event from Organizer mode.")}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {open.map((e, i) => {
                      const registered = registrations.some((r) => r.eventId === e.id);
                      return (
                        <motion.button
                          key={e.id}
                          type="button"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => setView({ name: "detail", id: e.id })}
                          className="group overflow-hidden rounded-2xl border border-line bg-card text-left shadow-soft transition hover:-translate-y-1 hover:shadow-card"
                        >
                          <div className={cn("relative h-28 p-4 text-white", GRADIENTS[e.category])}>
                            <div className="bg-grid-dark absolute inset-0 opacity-50" />
                            <div className="relative flex items-start justify-between">
                              <Badge tone="navy">{tx(CATEGORY_LABEL[e.category])}</Badge>
                              {registered && (
                                <span className="flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-success-ink">
                                  <Check className="h-3 w-3" /> {t("Terdaftar", "Registered")}
                                </span>
                              )}
                            </div>
                            <p className="relative mt-5 text-xs font-semibold text-white/85">{e.organizer}</p>
                          </div>
                          <div className="p-4">
                            <p className="font-semibold text-ink group-hover:text-brand-ink">{t(e.name)}</p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-strong">
                              <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(e.startDate)}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="font-semibold text-ink">{e.fee ? formatIDR(e.fee) : t("Gratis", "Free")}</span>
                              <span className="text-xs text-muted">
                                {formatNumber(Math.max(0, e.quota - e.registered))} {t("kursi tersisa", "seats left")}
                              </span>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {view.name === "detail" && event && (
              <EventDetail
                event={event}
                registered={!!reg}
                onBack={() => setView({ name: "browse" })}
                onRegister={() => setView({ name: "register", id: event.id })}
                onWorkspace={() => setView({ name: "workspace", id: event.id })}
              />
            )}
            {view.name === "register" && event && (
              <RegisterForm event={event} onBack={() => setView({ name: "detail", id: event.id })} onDone={() => setView({ name: "confirm", id: event.id })} />
            )}
            {view.name === "confirm" && event && reg && (
              <div className="rounded-3xl border border-line bg-card p-8 text-center shadow-card">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-soft text-success">
                  <CheckCircle2 className="h-8 w-8" />
                </motion.span>
                <h3 className="mt-4 text-2xl font-semibold text-ink">{t("Registrasi berhasil!", "Registration complete!")}</h3>
                <p className="mx-auto mt-2 max-w-md text-muted-strong">
                  {t("Konfirmasi (simulasi) untuk", "Confirmation (simulated) for")} <strong className="text-ink">{reg.name}</strong> —{" "}
                  {tx("tidak ada _email_ yang benar-benar dikirim.", "no email is actually sent.")}
                </p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-dashed border-brand/40 bg-soft/50 p-5 text-left">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">
                    <Ticket className="h-4 w-4" /> {tx("_E-ticket_ demo", "Demo e-ticket")}
                  </p>
                  <p className="mt-2 font-semibold text-ink">{t(event.name)}</p>
                  <p className="text-sm text-muted-strong">{formatDate(event.startDate)} · {event.location}</p>
                  <p className="mt-2 font-mono text-xs text-muted">ID: TRG-{event.id.slice(-4).toUpperCase()}-{reg.name.length}{reg.email.length}</p>
                  {event.fee > 0 && (
                    <Badge tone="success" className="mt-2">
                      {t(`Pembayaran ${formatIDR(event.fee)} disimulasikan lunas`, `Payment of ${formatIDR(event.fee)} simulated as paid`)}
                    </Badge>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button onClick={() => setView({ name: "workspace", id: event.id })}>
                    <FileUp className="h-4 w-4" /> {tx("Buka _workspace_ submisi", "Open the submission workspace")}
                  </Button>
                  <Button variant="secondary" onClick={() => setView({ name: "browse" })}>
                    {tx("Jelajahi _event_ lain", "Explore other events")}
                  </Button>
                </div>
              </div>
            )}
            {view.name === "workspace" && event && reg && <Workspace event={event} onBack={() => setView({ name: "detail", id: event.id })} />}
            {(view.name === "confirm" || view.name === "workspace") && event && !reg && (
              <EmptyState
                title={t("Anda belum terdaftar di _event_ ini", "You are not registered for this event yet")}
                action={<Button onClick={() => setView({ name: "register", id: event.id })}>{t("Daftar sekarang", "Register now")}</Button>}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-card p-5 shadow-soft xl:sticky xl:top-24">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Ticket className="h-4 w-4 text-sky-ink" /> {tx("_Event_ saya", "My events")}
        </p>
        {registrations.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{tx("Belum ada registrasi. Pilih _event_ lalu klik “Daftar”.", "No registrations yet. Pick an event and click “Register”.")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {registrations.map((r) => {
              const e = events.find((x) => x.id === r.eventId);
              if (!e) return null;
              return (
                <li key={r.eventId}>
                  <button
                    type="button"
                    onClick={() => setView({ name: "workspace", id: r.eventId })}
                    className="w-full rounded-xl bg-surface p-3 text-left ring-1 ring-line transition hover:ring-brand/40"
                  >
                    <p className="text-sm font-semibold text-ink">{t(e.name)}</p>
                    <p className="mt-0.5 text-xs text-muted">{r.submission ? t("Submisi terkirim", "Submission sent") : t("Belum submisi", "Not submitted yet")}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <Callout tone="info" className="mt-4">
          {tx(
            "Gunakan data fiktif. Registrasi & pembayaran hanya simulasi dan tersimpan di _browser_ ini.",
            "Use fictional data. Registration & payment are simulated and stored in this browser only.",
          )}
        </Callout>
      </aside>
    </div>
  );
}

function EventDetail({ event, registered, onBack, onRegister, onWorkspace }: { event: EventItem; registered: boolean; onBack: () => void; onRegister: () => void; onWorkspace: () => void }) {
  const { t, tx } = useI18n();
  const full = event.registered >= event.quota;
  const closed = event.registrationClose < DEMO_TODAY;
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
      <div className={cn("relative p-7 text-white", GRADIENTS[event.category])}>
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <div className="relative">
          <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {t("Kembali", "Back")}
          </button>
          <Badge tone="navy">{tx(CATEGORY_LABEL[event.category])}</Badge>
          <h3 className="mt-3 text-3xl font-semibold">{t(event.name)}</h3>
          <p className="mt-1 text-white/85">{event.organizer}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-7 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="leading-relaxed text-muted-strong">{tx(event.description)}</p>
          <p className="mt-6 text-sm font-semibold text-ink">{tx("_Timeline_", "Timeline")}</p>
          <ol className="relative mt-3 space-y-4 border-l-2 border-line pl-6">
            {event.stages.map((s) => {
              const done = s.date < DEMO_TODAY;
              return (
                <li key={s.id} className="relative">
                  <span className={cn("absolute -left-[33px] top-0.5 grid h-5 w-5 place-items-center rounded-full ring-4 ring-card", done ? "bg-success text-white" : "bg-sky/20")}>
                    {done && <Check className="h-3 w-3" />}
                  </span>
                  <p className="text-sm font-semibold text-ink">{tx(s.name)}</p>
                  <p className="text-xs text-muted">{formatDate(s.date)}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="space-y-3">
          {[
            [CalendarDays, `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`],
            [MapPin, `${event.location} · ${t(MODE_LABEL[event.mode])}`],
            [Users, `${formatNumber(event.registered)} / ${formatNumber(event.quota)} ${event.teamBased ? t("tim", "teams") : t("peserta", "participants")}`],
            [Clock, `${t("Registrasi ditutup", "Registration closes")} ${formatDate(event.registrationClose)}`],
          ].map(([Icon, text]) => {
            const I = Icon as typeof CalendarDays;
            return (
              <p key={text as string} className="flex items-center gap-2.5 rounded-xl bg-surface p-3 text-sm text-ink ring-1 ring-line">
                <I className="h-4 w-4 shrink-0 text-sky-ink" /> {text as string}
              </p>
            );
          })}
          <div className="rounded-2xl bg-navy p-4 text-white">
            <p className="text-xs text-white/70">{t("Biaya registrasi", "Registration fee")}</p>
            <p className="font-display text-2xl font-semibold">{event.fee ? formatIDR(event.fee) : t("Gratis", "Free")}</p>
            {registered ? (
              <Button variant="light" className="mt-3 w-full" onClick={onWorkspace}>
                <FileUp className="h-4 w-4" /> {tx("Buka _workspace_", "Open workspace")}
              </Button>
            ) : (
              <Button variant="light" className="mt-3 w-full" onClick={onRegister} disabled={full || closed}>
                {full ? t("Kuota penuh", "Quota full") : closed ? t("Registrasi ditutup", "Registration closed") : t("Daftar sekarang", "Register now")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ event, onBack, onDone }: { event: EventItem; onBack: () => void; onDone: () => void }) {
  const { t, tx } = useI18n();
  const regSchema = useMemo(() => makeRegSchema(t), [t]);
  const register = useEventsStore((s) => s.register);
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegValues>({ resolver: zodResolver(regSchema), defaultValues: { name: "", email: "", institution: "", team: "" } });

  const submit = handleSubmit(async (v) => {
    await new Promise((r) => setTimeout(r, 600));
    register({ eventId: event.id, name: v.name, email: v.email, institution: v.institution, team: v.team || undefined });
    toast.success(t("Registrasi tersimpan (simulasi).", "Registration saved (simulated)."));
    onDone();
  });

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-card p-7 shadow-card">
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> {t("Kembali ke detail", "Back to details")}
      </button>
      <h3 className="text-2xl font-semibold text-ink">
        {t("Registrasi", "Registration")} — {t(event.name)}
      </h3>
      <p className="mt-1 text-sm text-muted-strong">{tx("Gunakan data fiktif. Tidak ada data yang dikirim ke _server_.", "Use fictional data. Nothing is sent to a server.")}</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor="r-name" required>
            {t("Nama lengkap", "Full name")}
          </Label>
          <Input id="r-name" aria-invalid={!!errors.name} placeholder={t("mis. Peserta Demo", "e.g. Demo Participant")} {...field("name")} />
          <FieldError message={errors.name?.message} />
        </Field>
        <Field>
          <Label htmlFor="r-email" required>
            Email
          </Label>
          <Input id="r-email" type="email" aria-invalid={!!errors.email} placeholder="demo@contoh.id" {...field("email")} />
          <FieldError message={errors.email?.message} />
        </Field>
        <Field>
          <Label htmlFor="r-inst" required>
            {t("Institusi", "Institution")}
          </Label>
          <Input id="r-inst" aria-invalid={!!errors.institution} placeholder={t("Universitas Demo", "Demo University")} {...field("institution")} />
          <FieldError message={errors.institution?.message} />
        </Field>
        {event.teamBased && (
          <Field>
            <Label htmlFor="r-team">{t("Nama tim", "Team name")}</Label>
            <Input id="r-team" placeholder={t("Tim Demo", "Demo Team")} {...field("team")} />
          </Field>
        )}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3.5 sm:col-span-2">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" {...field("agree")} />
          <span className="text-sm text-ink">
            {t("Saya memahami bahwa ini adalah demo dan data yang saya masukkan bersifat fiktif.", "I understand this is a demo and the data I enter is fictional.")}
          </span>
        </label>
        <FieldError message={errors.agree?.message} />
      </div>
      {event.fee > 0 && (
        <div className="mt-5 rounded-2xl bg-surface p-4 ring-1 ring-line">
          <p className="text-sm font-semibold text-ink">{t("Metode pembayaran (simulasi)", "Payment method (simulated)")}</p>
          <Select className="mt-2" aria-label={t("Metode pembayaran", "Payment method")} defaultValue="QRIS">
            {(["QRIS", "Virtual Account", "E-Wallet"] as const).map((m) => (
              <option key={m} value={m}>
                {t(PAYMENT_METHOD_LABEL[m])}
              </option>
            ))}
          </Select>
          <p className="mt-2 text-xs text-muted">
            {t(`Total ${formatIDR(event.fee)} — tidak ada transaksi nyata yang diproses.`, `Total ${formatIDR(event.fee)} — no real transaction is processed.`)}
          </p>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("Memproses…", "Processing…") : event.fee ? t("Daftar & bayar (simulasi)", "Register & pay (simulated)") : t("Daftar", "Register")}
        </Button>
      </div>
    </form>
  );
}

function Workspace({ event, onBack }: { event: EventItem; onBack: () => void }) {
  const { t, tx } = useI18n();
  const subSchema = useMemo(() => makeSubSchema(t), [t]);
  const registrations = useEventsStore((s) => s.registrations);
  const submitWork = useEventsStore((s) => s.submitWork);
  const reg = registrations.find((r) => r.eventId === event.id);
  const [fileName, setFileName] = useState<string | undefined>(reg?.submission?.fileName);
  const [cert, setCert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubValues>({ resolver: zodResolver(subSchema), defaultValues: { title: reg?.submission?.title ?? "", summary: reg?.submission?.summary ?? "" } });

  const submit = handleSubmit((v) => {
    submitWork(event.id, { ...v, fileName, submittedAt: new Date().toISOString() });
    toast.success(t("Submisi terkirim (simulasi).", "Submission sent (simulated)."), {
      description: fileName ? t(`Berkas: ${fileName} (tidak diunggah)`, `File: ${fileName} (not uploaded)`) : undefined,
    });
  });

  const submitted = !!reg?.submission;
  const steps = [
    { label: t("Registrasi terverifikasi", "Registration verified"), done: true },
    { label: t("Submisi dikirim", "Submission sent"), done: submitted },
    { label: t("Dalam penjurian", "Being judged"), done: submitted && event.status === "judging" },
    { label: t("Pengumuman & sertifikat", "Announcement & certificate"), done: false },
  ];

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> {tx("Kembali ke detail _event_", "Back to event details")}
      </button>
      <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-ink">{tx("Status _timeline_", "Status timeline")}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className={cn("rounded-2xl p-3 ring-1", s.done ? "bg-success-soft ring-current/15" : "bg-surface ring-line")}>
              <span className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-semibold", s.done ? "bg-success text-white" : "bg-card text-muted ring-1 ring-line")}>
                {s.done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <p className={cn("mt-2 text-sm font-semibold", s.done ? "text-success-ink" : "text-muted-strong")}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-ink">{tx("_Workspace_ submisi", "Submission workspace")}</h3>
        <p className="text-sm text-muted-strong">{t(event.name)}</p>
        <div className="mt-5 grid gap-4">
          <Field>
            <Label htmlFor="s-title" required>
              {t("Judul karya", "Work title")}
            </Label>
            <Input id="s-title" aria-invalid={!!errors.title} {...register("title")} />
            <FieldError message={errors.title?.message} />
          </Field>
          <Field>
            <Label htmlFor="s-sum" required>
              {t("Ringkasan", "Summary")}
            </Label>
            <Textarea id="s-sum" aria-invalid={!!errors.summary} placeholder={t("Ringkas ide, pendekatan, dan dampak karya Anda…", "Summarise your idea, approach and impact…")} {...register("summary")} />
            <FieldError message={errors.summary?.message} />
          </Field>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-surface p-6 text-center transition hover:border-brand/50">
            <Upload className="h-6 w-6 text-brand-ink" />
            <span className="text-sm font-semibold text-ink">{fileName ?? t("Pilih berkas (PDF/PPT)", "Choose a file (PDF/PPT)")}</span>
            <span className="text-xs text-muted">
              {tx("Simulasi: hanya nama berkas yang dibaca — tidak ada unggahan ke _server_.", "Simulated: only the file name is read — nothing is uploaded to a server.")}
            </span>
            <input type="file" className="sr-only" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={(e) => setFileName(e.target.files?.[0]?.name)} />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-between gap-2">
          <Button variant="secondary" onClick={() => setCert(true)}>
            <Award className="h-4 w-4" /> {t("Lihat contoh sertifikat", "See a sample certificate")}
          </Button>
          <Button type="submit">{submitted ? t("Perbarui submisi", "Update submission") : t("Kirim submisi", "Send submission")}</Button>
        </div>
      </form>
      <Modal open={cert} onClose={() => setCert(false)} title={t("Pratinjau sertifikat (contoh)", "Certificate preview (sample)")} size="lg">
        <div className="relative overflow-hidden rounded-2xl border-[6px] border-double border-current/15 bg-gradient-to-br from-card via-card to-soft p-8 text-center">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky/20 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-royal/15 blur-2xl" />
          <div className="relative">
            <div className="flex justify-center"><LogoMark size={44} /></div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-ink">{t("Sertifikat Partisipasi", "Certificate of Participation")}</p>
            <p className="mt-4 text-sm text-muted-strong">{t("Diberikan kepada", "Awarded to")}</p>
            <p className="mt-1 font-display text-3xl font-semibold text-ink">{reg?.name ?? t("Peserta Demo", "Demo Participant")}</p>
            <p className="mt-3 text-sm text-muted-strong">{t("atas partisipasi dalam", "for participating in")}</p>
            <p className="mt-1 text-lg font-semibold text-ink">{t(event.name)}</p>
            <p className="mt-1 text-sm text-muted">{formatDate(event.startDate)} · {event.organizer}</p>
            <p className="mt-6 inline-block rounded-full bg-warning-soft px-3 py-1 text-[11px] font-semibold text-warning-ink">
              {t("CONTOH — tidak berlaku sebagai sertifikat resmi", "SAMPLE — not valid as an official certificate")}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
