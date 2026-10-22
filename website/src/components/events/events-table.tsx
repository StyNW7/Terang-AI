"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Copy, Eye, MapPin, Pencil, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import type { EventItem } from "@/types/events";
import { useEventsStore } from "@/store/events-store";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/data/events.mock";
import { Button } from "@/components/ui/button";
import { Drawer, Modal } from "@/components/ui/modal";
import { Field, Input, Label, Select, FieldError } from "@/components/ui/form";
import { EmptyState, Progress } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatIDR, formatNumber } from "@/lib/formatters";
import { safeDivide } from "@/lib/utils";
import { CategoryBadge, EventStatusBadge } from "./shared";

export function EventsTable({ onCreate, onDuplicate }: { onCreate: () => void; onDuplicate: (id: string) => void }) {
  const events = useEventsStore((s) => s.events);
  const updateEvent = useEventsStore((s) => s.updateEvent);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | EventItem["category"]>("all");
  const [status, setStatus] = useState<"all" | EventItem["status"]>("all");
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [draft, setDraft] = useState({ name: "", status: "draft" as EventItem["status"], quota: 0, fee: 0 });
  const [error, setError] = useState<string>();

  const filtered = useMemo(
    () =>
      events.filter(
        (e) =>
          (category === "all" || e.category === category) &&
          (status === "all" || e.status === status) &&
          (e.name.toLowerCase().includes(query.toLowerCase()) || e.organizer.toLowerCase().includes(query.toLowerCase())),
      ),
    [events, category, status, query],
  );

  const openEdit = (e: EventItem) => {
    setEditing(e);
    setDraft({ name: e.name, status: e.status, quota: e.quota, fee: e.fee });
    setError(undefined);
  };

  const saveEdit = () => {
    if (!editing) return;
    if (draft.name.trim().length < 5) return setError("Nama event minimal 5 karakter.");
    if (draft.quota < editing.registered) return setError(`Kuota tidak boleh di bawah jumlah pendaftar (${editing.registered}).`);
    updateEvent(editing.id, { name: draft.name.trim(), status: draft.status, quota: draft.quota, fee: Math.max(0, draft.fee) });
    toast.success("Perubahan event disimpan.");
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari event atau organizer…" className="pl-9" aria-label="Cari event" />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="sm:w-44" aria-label="Filter kategori">
            <option value="all">Semua kategori</option>
            {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="sm:w-48" aria-label="Filter status">
            <option value="all">Semua status</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4" /> Buat event
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-5 w-5" />}
          title="Tidak ada event yang cocok"
          description="Ubah kata kunci atau filter untuk melihat event lain."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setStatus("all");
              }}
            >
              Reset filter
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-surface text-xs text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Pendaftar</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((e) => (
                  <tr key={e.id} className="transition hover:bg-surface/70">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{e.name}</p>
                      <p className="text-xs text-muted">{e.organizer}</p>
                      {e.createdFrom === "repeat" && <Badge tone="ace" className="mt-1">Dari Repeat Planner</Badge>}
                      {e.createdFrom === "template" && <Badge tone="ace" className="mt-1">Dari Smart Template</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={e.category} />
                    </td>
                    <td className="px-4 py-3 text-muted-strong">{formatDate(e.startDate)}</td>
                    <td className="w-44 px-4 py-3">
                      <p className="tabular text-xs font-semibold text-ink">
                        {formatNumber(e.registered)} / {formatNumber(e.quota)}
                      </p>
                      <Progress value={safeDivide(e.registered, e.quota)} tone="sky" className="mt-1" height="h-1.5" />
                    </td>
                    <td className="px-4 py-3">
                      <EventStatusBadge status={e.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setDetail(e)} aria-label={`Detail ${e.name}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(e)} aria-label={`Edit ${e.name}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onDuplicate(e.id)} aria-label={`Duplikasi ${e.name}`}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-4 py-2.5 text-xs text-muted">
            Menampilkan {filtered.length} dari {events.length} event
          </p>
        </div>
      )}

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.name ?? ""} description={detail?.organizer}>
        {detail && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <EventStatusBadge status={detail.status} />
              <CategoryBadge category={detail.category} />
              <Badge tone="neutral">{detail.mode}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-strong">{detail.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                [CalendarDays, "Tanggal", `${formatDate(detail.startDate)} – ${formatDate(detail.endDate)}`],
                [MapPin, "Lokasi", detail.location],
                [Users, "Pendaftar", `${formatNumber(detail.registered)} / ${formatNumber(detail.quota)}`],
                [CalendarDays, "Biaya", detail.fee ? formatIDR(detail.fee) : "Gratis"],
              ].map(([Icon, k, v]) => {
                const I = Icon as typeof CalendarDays;
                return (
                  <div key={k as string} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <I className="h-3.5 w-3.5" /> {k as string}
                    </p>
                    <p className="mt-0.5 font-semibold text-ink">{v as string}</p>
                  </div>
                );
              })}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Tahapan</p>
              <ol className="relative space-y-3 border-l-2 border-line pl-5">
                {detail.stages.map((s) => (
                  <li key={s.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-sky ring-4 ring-card" />
                    <p className="text-sm font-semibold text-ink">{s.name}</p>
                    <p className="text-xs text-muted">{formatDate(s.date)}</p>
                  </li>
                ))}
              </ol>
            </div>
            {detail.criteria.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-ink">Rubrik penjurian</p>
                <div className="space-y-1.5">
                  {detail.criteria.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm ring-1 ring-line">
                      <span className="text-ink">{c.name}</span>
                      <span className="tabular font-semibold text-sky-ink">{c.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  openEdit(detail);
                  setDetail(null);
                }}
              >
                <Pencil className="h-4 w-4" /> Edit
              </Button>
              <Button
                onClick={() => {
                  onDuplicate(detail.id);
                  setDetail(null);
                }}
              >
                <Copy className="h-4 w-4" /> Ulangi event ini
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit event"
        description={editing?.organizer}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Batal
            </Button>
            <Button onClick={saveEdit}>Simpan perubahan</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field className="sm:col-span-2">
            <Label htmlFor="edit-name" required>
              Nama event
            </Label>
            <Input id="edit-name" data-autofocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="edit-status">Status</Label>
            <Select id="edit-status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as EventItem["status"] })}>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="edit-quota" required>
              Kuota
            </Label>
            <Input id="edit-quota" type="number" min={0} value={draft.quota} onChange={(e) => setDraft({ ...draft, quota: Math.max(0, Number(e.target.value)) })} />
          </Field>
          <Field className="sm:col-span-2">
            <Label htmlFor="edit-fee">Biaya registrasi (Rp)</Label>
            <Input id="edit-fee" type="number" min={0} step={5000} value={draft.fee} onChange={(e) => setDraft({ ...draft, fee: Math.max(0, Number(e.target.value)) })} />
          </Field>
        </div>
        <FieldError message={error} />
      </Modal>
    </div>
  );
}
