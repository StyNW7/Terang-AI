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
import { DEMO_TODAY } from "./shared";

type View = { name: "browse" } | { name: "detail"; id: string } | { name: "register"; id: string } | { name: "confirm"; id: string } | { name: "workspace"; id: string };

const regSchema = z.object({
  name: z.string().trim().min(3, { message: "Nama minimal 3 karakter." }),
  email: z.string().trim().email({ message: "Format email tidak valid." }),
  institution: z.string().trim().min(3, { message: "Institusi wajib diisi." }),
  team: z.string().trim().optional(),
  agree: z.literal(true, { message: "Setujui pernyataan data fiktif untuk melanjutkan." }),
});
type RegValues = z.infer<typeof regSchema>;

const subSchema = z.object({
  title: z.string().trim().min(5, { message: "Judul minimal 5 karakter." }),
  summary: z.string().trim().min(30, { message: "Ringkasan minimal 30 karakter." }),
});
type SubValues = z.infer<typeof subSchema>;

const GRADIENTS: Record<EventItem["category"], string> = {
  kompetisi: "bg-[linear-gradient(135deg,#39b7ff,#2f66e0)]",
  konferensi: "bg-[linear-gradient(135deg,#4a90e2,#17395e)]",
  workshop: "bg-[linear-gradient(135deg,#5fd0ff,#0c9fd8)]",
  seminar: "bg-[linear-gradient(135deg,#7aa7ff,#2251c9)]",
};

export function ParticipantExperience() {
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
          e.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [events, category, query],
  );
  const event = "id" in view ? events.find((e) => e.id === view.id) : undefined;
  const reg = event ? registrations.find((r) => r.eventId === event.id) : undefined;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={view.name + ("id" in view ? view.id : "")} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            {view.name === "browse" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-4 shadow-soft sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari event…" className="pl-9" aria-label="Cari event" />
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
                        {c === "all" ? "Semua" : CATEGORY_LABEL[c]}
                      </button>
                    ))}
                  </div>
                </div>
                {open.length === 0 ? (
                  <EmptyState icon={<Search className="h-5 w-5" />} title="Tidak ada event terbuka" description="Coba kategori lain atau publikasikan event baru dari mode Organizer." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
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
                              <Badge tone="navy">{CATEGORY_LABEL[e.category]}</Badge>
                              {registered && (
                                <span className="flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-success-ink">
                                  <Check className="h-3 w-3" /> Terdaftar
                                </span>
                              )}
                            </div>
                            <p className="relative mt-5 text-xs font-semibold text-white/85">{e.organizer}</p>
                          </div>
                          <div className="p-4">
                            <p className="font-semibold text-ink group-hover:text-brand-ink">{e.name}</p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-strong">
                              <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(e.startDate)}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="font-semibold text-ink">{e.fee ? formatIDR(e.fee) : "Gratis"}</span>
                              <span className="text-xs text-muted">{formatNumber(Math.max(0, e.quota - e.registered))} kursi tersisa</span>
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
                <h3 className="mt-4 text-2xl font-semibold text-ink">Registrasi berhasil!</h3>
                <p className="mx-auto mt-2 max-w-md text-muted-strong">
                  Konfirmasi (simulasi) untuk <strong className="text-ink">{reg.name}</strong> — tidak ada email yang benar-benar dikirim.
                </p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-dashed border-brand/40 bg-soft/50 p-5 text-left">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink">
                    <Ticket className="h-4 w-4" /> E-ticket demo
                  </p>
                  <p className="mt-2 font-semibold text-ink">{event.name}</p>
                  <p className="text-sm text-muted-strong">{formatDate(event.startDate)} · {event.location}</p>
                  <p className="mt-2 font-mono text-xs text-muted">ID: TRG-{event.id.slice(-4).toUpperCase()}-{reg.name.length}{reg.email.length}</p>
                  {event.fee > 0 && <Badge tone="success" className="mt-2">Pembayaran {formatIDR(event.fee)} disimulasikan lunas</Badge>}
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button onClick={() => setView({ name: "workspace", id: event.id })}>
                    <FileUp className="h-4 w-4" /> Buka workspace submisi
                  </Button>
                  <Button variant="secondary" onClick={() => setView({ name: "browse" })}>
                    Jelajahi event lain
                  </Button>
                </div>
              </div>
            )}
            {view.name === "workspace" && event && reg && <Workspace event={event} onBack={() => setView({ name: "detail", id: event.id })} />}
            {(view.name === "confirm" || view.name === "workspace") && event && !reg && (
              <EmptyState title="Anda belum terdaftar di event ini" action={<Button onClick={() => setView({ name: "register", id: event.id })}>Daftar sekarang</Button>} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-card p-5 shadow-soft xl:sticky xl:top-24">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Ticket className="h-4 w-4 text-sky-ink" /> Event saya
        </p>
        {registrations.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Belum ada registrasi. Pilih event lalu klik “Daftar”.</p>
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
                    <p className="text-sm font-semibold text-ink">{e.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{r.submission ? "Submisi terkirim" : "Belum submisi"}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <Callout tone="info" className="mt-4">
          Gunakan data fiktif. Registrasi & pembayaran hanya simulasi dan tersimpan di browser ini.
        </Callout>
      </aside>
    </div>
  );
}

function EventDetail({ event, registered, onBack, onRegister, onWorkspace }: { event: EventItem; registered: boolean; onBack: () => void; onRegister: () => void; onWorkspace: () => void }) {
  const full = event.registered >= event.quota;
  const closed = event.registrationClose < DEMO_TODAY;
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
      <div className={cn("relative p-7 text-white", GRADIENTS[event.category])}>
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <div className="relative">
          <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
          <Badge tone="navy">{CATEGORY_LABEL[event.category]}</Badge>
          <h3 className="mt-3 text-3xl font-bold">{event.name}</h3>
          <p className="mt-1 text-white/85">{event.organizer}</p>
        </div>
      </div>
      <div className="grid gap-6 p-7 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="leading-relaxed text-muted-strong">{event.description}</p>
          <p className="mt-6 text-sm font-semibold text-ink">Timeline</p>
          <ol className="relative mt-3 space-y-4 border-l-2 border-line pl-6">
            {event.stages.map((s) => {
              const done = s.date < DEMO_TODAY;
              return (
                <li key={s.id} className="relative">
                  <span className={cn("absolute -left-[33px] top-0.5 grid h-5 w-5 place-items-center rounded-full ring-4 ring-card", done ? "bg-success text-white" : "bg-sky/20")}>
                    {done && <Check className="h-3 w-3" />}
                  </span>
                  <p className="text-sm font-semibold text-ink">{s.name}</p>
                  <p className="text-xs text-muted">{formatDate(s.date)}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="space-y-3">
          {[
            [CalendarDays, `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`],
            [MapPin, `${event.location} · ${event.mode}`],
            [Users, `${formatNumber(event.registered)} / ${formatNumber(event.quota)} ${event.teamBased ? "tim" : "peserta"}`],
            [Clock, `Registrasi ditutup ${formatDate(event.registrationClose)}`],
          ].map(([Icon, text]) => {
            const I = Icon as typeof CalendarDays;
            return (
              <p key={text as string} className="flex items-center gap-2.5 rounded-xl bg-surface p-3 text-sm text-ink ring-1 ring-line">
                <I className="h-4 w-4 shrink-0 text-sky-ink" /> {text as string}
              </p>
            );
          })}
          <div className="rounded-2xl bg-navy p-4 text-white">
            <p className="text-xs text-white/70">Biaya registrasi</p>
            <p className="font-display text-2xl font-semibold">{event.fee ? formatIDR(event.fee) : "Gratis"}</p>
            {registered ? (
              <Button variant="light" className="mt-3 w-full" onClick={onWorkspace}>
                <FileUp className="h-4 w-4" /> Buka workspace
              </Button>
            ) : (
              <Button variant="light" className="mt-3 w-full" onClick={onRegister} disabled={full || closed}>
                {full ? "Kuota penuh" : closed ? "Registrasi ditutup" : "Daftar sekarang"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ event, onBack, onDone }: { event: EventItem; onBack: () => void; onDone: () => void }) {
  const register = useEventsStore((s) => s.register);
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegValues>({ resolver: zodResolver(regSchema), defaultValues: { name: "", email: "", institution: "", team: "" } });

  const submit = handleSubmit(async (v) => {
    await new Promise((r) => setTimeout(r, 600));
    register({ eventId: event.id, name: v.name, email: v.email, institution: v.institution, team: v.team || undefined });
    toast.success("Registrasi tersimpan (simulasi).");
    onDone();
  });

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-card p-7 shadow-card">
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke detail
      </button>
      <h3 className="text-2xl font-semibold text-ink">Registrasi — {event.name}</h3>
      <p className="mt-1 text-sm text-muted-strong">Gunakan data fiktif. Tidak ada data yang dikirim ke server.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor="r-name" required>Nama lengkap</Label>
          <Input id="r-name" aria-invalid={!!errors.name} placeholder="mis. Peserta Demo" {...field("name")} />
          <FieldError message={errors.name?.message} />
        </Field>
        <Field>
          <Label htmlFor="r-email" required>Email</Label>
          <Input id="r-email" type="email" aria-invalid={!!errors.email} placeholder="demo@contoh.id" {...field("email")} />
          <FieldError message={errors.email?.message} />
        </Field>
        <Field>
          <Label htmlFor="r-inst" required>Institusi</Label>
          <Input id="r-inst" aria-invalid={!!errors.institution} placeholder="Universitas Demo" {...field("institution")} />
          <FieldError message={errors.institution?.message} />
        </Field>
        {event.teamBased && (
          <Field>
            <Label htmlFor="r-team">Nama tim</Label>
            <Input id="r-team" placeholder="Tim Demo" {...field("team")} />
          </Field>
        )}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3.5 sm:col-span-2">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" {...field("agree")} />
          <span className="text-sm text-ink">Saya memahami bahwa ini adalah demo dan data yang saya masukkan bersifat fiktif.</span>
        </label>
        <FieldError message={errors.agree?.message} />
      </div>
      {event.fee > 0 && (
        <div className="mt-5 rounded-2xl bg-surface p-4 ring-1 ring-line">
          <p className="text-sm font-semibold text-ink">Metode pembayaran (simulasi)</p>
          <Select className="mt-2" aria-label="Metode pembayaran" defaultValue="QRIS">
            <option>QRIS</option>
            <option>Virtual Account</option>
            <option>E-Wallet</option>
          </Select>
          <p className="mt-2 text-xs text-muted">Total {formatIDR(event.fee)} — tidak ada transaksi nyata yang diproses.</p>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Memproses…" : event.fee ? "Daftar & bayar (simulasi)" : "Daftar"}
        </Button>
      </div>
    </form>
  );
}

function Workspace({ event, onBack }: { event: EventItem; onBack: () => void }) {
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
    toast.success("Submisi terkirim (simulasi).", { description: fileName ? `Berkas: ${fileName} (tidak diunggah)` : undefined });
  });

  const submitted = !!reg?.submission;
  const steps = [
    { label: "Registrasi terverifikasi", done: true },
    { label: "Submisi dikirim", done: submitted },
    { label: "Dalam penjurian", done: submitted && event.status === "judging" },
    { label: "Pengumuman & sertifikat", done: false },
  ];

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke detail event
      </button>
      <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-ink">Status timeline</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.label} className={cn("rounded-2xl p-3 ring-1", s.done ? "bg-success-soft ring-current/15" : "bg-surface ring-line")}>
              <span className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-semibold", s.done ? "bg-success text-white" : "bg-card text-muted ring-1 ring-line")}>
                {s.done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <p className={cn("mt-2 text-sm font-semibold", s.done ? "text-success-ink" : "text-muted-strong")}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-ink">Workspace submisi</h3>
        <p className="text-sm text-muted-strong">{event.name}</p>
        <div className="mt-5 grid gap-4">
          <Field>
            <Label htmlFor="s-title" required>Judul karya</Label>
            <Input id="s-title" aria-invalid={!!errors.title} {...register("title")} />
            <FieldError message={errors.title?.message} />
          </Field>
          <Field>
            <Label htmlFor="s-sum" required>Ringkasan</Label>
            <Textarea id="s-sum" aria-invalid={!!errors.summary} placeholder="Ringkas ide, pendekatan, dan dampak karya Anda…" {...register("summary")} />
            <FieldError message={errors.summary?.message} />
          </Field>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-surface p-6 text-center transition hover:border-brand/50">
            <Upload className="h-6 w-6 text-brand-ink" />
            <span className="text-sm font-semibold text-ink">{fileName ?? "Pilih berkas (PDF/PPT)"}</span>
            <span className="text-xs text-muted">Simulasi: hanya nama berkas yang dibaca — tidak ada unggahan ke server.</span>
            <input type="file" className="sr-only" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={(e) => setFileName(e.target.files?.[0]?.name)} />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-between gap-2">
          <Button variant="secondary" onClick={() => setCert(true)}>
            <Award className="h-4 w-4" /> Lihat contoh sertifikat
          </Button>
          <Button type="submit">{submitted ? "Perbarui submisi" : "Kirim submisi"}</Button>
        </div>
      </form>
      <Modal open={cert} onClose={() => setCert(false)} title="Pratinjau sertifikat (contoh)" size="lg">
        <div className="relative overflow-hidden rounded-2xl border-[6px] border-double border-current/15 bg-gradient-to-br from-card via-card to-soft p-8 text-center">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky/20 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-royal/15 blur-2xl" />
          <div className="relative">
            <div className="flex justify-center"><LogoMark size={44} /></div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-ink">Sertifikat Partisipasi</p>
            <p className="mt-4 text-sm text-muted-strong">Diberikan kepada</p>
            <p className="mt-1 font-display text-3xl font-bold text-ink">{reg?.name ?? "Peserta Demo"}</p>
            <p className="mt-3 text-sm text-muted-strong">atas partisipasi dalam</p>
            <p className="mt-1 text-lg font-semibold text-ink">{event.name}</p>
            <p className="mt-1 text-sm text-muted">{formatDate(event.startDate)} · {event.organizer}</p>
            <p className="mt-6 inline-block rounded-full bg-warning-soft px-3 py-1 text-[11px] font-semibold text-warning-ink">CONTOH — tidak berlaku sebagai sertifikat resmi</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
