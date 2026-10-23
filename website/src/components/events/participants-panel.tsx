"use client";

import { useMemo, useState } from "react";
import { Mail, School, Search, Users } from "lucide-react";
import { toast } from "sonner";
import type { Participant } from "@/types/events";
import { useEventsStore } from "@/store/events-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/misc";
import { formatDate, initials } from "@/lib/formatters";
import type { Tone } from "@/types/common";
import { SOURCE_LABEL } from "@/data/events.mock";
import { useI18n } from "@/lib/i18n";
import { REGISTRATION_STATUS_LABEL } from "./shared";

const STATUS: Record<Participant["status"], { label: (typeof REGISTRATION_STATUS_LABEL)[Participant["status"]]; tone: Tone }> = {
  lunas: { label: REGISTRATION_STATUS_LABEL.lunas, tone: "success" },
  terverifikasi: { label: REGISTRATION_STATUS_LABEL.terverifikasi, tone: "brand" },
  "menunggu-pembayaran": { label: REGISTRATION_STATUS_LABEL["menunggu-pembayaran"], tone: "warning" },
  dibatalkan: { label: REGISTRATION_STATUS_LABEL.dibatalkan, tone: "danger" },
};

export function ParticipantsPanel() {
  const { t } = useI18n();
  const participants = useEventsStore((s) => s.participants);
  const events = useEventsStore((s) => s.events);
  const setStatus = useEventsStore((s) => s.setParticipantStatus);
  const [query, setQuery] = useState("");
  const [eventId, setEventId] = useState("all");
  const [status, setStatusFilter] = useState<"all" | Participant["status"]>("all");
  const [selected, setSelected] = useState<Participant | null>(null);

  const eventName = (id: string) => {
    const ev = events.find((e) => e.id === id);
    return ev ? t(ev.name) : id;
  };
  const filtered = useMemo(
    () =>
      participants.filter(
        (p) =>
          (eventId === "all" || p.eventId === eventId) &&
          (status === "all" || p.status === status) &&
          (p.name.toLowerCase().includes(query.toLowerCase()) || p.institution.toLowerCase().includes(query.toLowerCase())),
      ),
    [participants, eventId, status, query],
  );
  const counts = (Object.keys(STATUS) as Participant["status"][]).map((s) => ({ s, n: participants.filter((p) => p.status === s).length }));
  const current = selected ? participants.find((p) => p.id === selected.id) ?? selected : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {counts.map(({ s, n }) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(status === s ? "all" : s)}
            className={`rounded-2xl border bg-card p-4 text-left shadow-soft transition hover:shadow-card ${status === s ? "border-brand ring-2 ring-brand/20" : "border-line"}`}
          >
            <Badge tone={STATUS[s].tone} dot>
              {t(STATUS[s].label)}
            </Badge>
            <p className="tabular mt-2 font-display text-2xl font-semibold text-ink">{n}</p>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-4 shadow-soft sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Cari nama atau institusi…", "Search name or institution…")} className="pl-9" aria-label={t("Cari peserta", "Search participants")} />
        </div>
        <Select value={eventId} onChange={(e) => setEventId(e.target.value)} className="sm:w-72" aria-label={t("Filter _event_", "Filter by event")}>
          <option value="all">{t("Semua _event_", "All events")}</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {t(e.name)}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatusFilter(e.target.value as typeof status)} className="sm:w-52" aria-label={t("Filter status", "Filter by status")}>
          <option value="all">{t("Semua status", "All statuses")}</option>
          {(Object.keys(STATUS) as Participant["status"][]).map((s) => (
            <option key={s} value={s}>
              {t(STATUS[s].label)}
            </option>
          ))}
        </Select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title={t("Belum ada peserta yang cocok", "No matching participants yet")}
          description={t("Ubah filter atau kata kunci pencarian.", "Change the filters or search keyword.")}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-surface text-xs text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("Peserta (fiktif)", "Participant (fictional)")}</th>
                  <th className="px-4 py-3 font-semibold">{t("_Event_", "Event")}</th>
                  <th className="px-4 py-3 font-semibold">{t("Sumber", "Source")}</th>
                  <th className="px-4 py-3 font-semibold">{t("Terdaftar", "Registered")}</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    tabIndex={0}
                    onClick={() => setSelected(p)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(p))}
                    className="cursor-pointer transition hover:bg-surface/70 focus-visible:bg-surface/70"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-soft text-xs font-semibold text-sky-ink">{initials(p.name)}</span>
                        <div>
                          <p className="font-semibold text-ink">{p.name}</p>
                          <p className="text-xs text-muted">{p.institution}</p>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-[200px] max-w-[260px] px-4 py-3 leading-snug text-muted-strong">{eventName(p.eventId)}</td>
                    <td className="px-4 py-3 text-muted-strong">{t(SOURCE_LABEL[p.source])}</td>
                    <td className="px-4 py-3 text-muted-strong">{formatDate(p.registeredAt)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS[p.status].tone}>{t(STATUS[p.status].label)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-4 py-2.5 text-xs text-muted">
            {t(`${filtered.length} peserta · klik baris untuk detail`, `${filtered.length} participants · click a row for details`)}
          </p>
        </div>
      )}
      <Modal open={!!current} onClose={() => setSelected(null)} title={current?.name ?? ""} description={t("Detail peserta (data fiktif)", "Participant details (fictional data)")} size="sm">
        {current && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-soft text-lg font-semibold text-sky-ink">{initials(current.name)}</span>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2 text-muted-strong">
                  <School className="h-4 w-4" /> {current.institution}
                </p>
                <p className="flex items-center gap-2 text-muted-strong">
                  <Mail className="h-4 w-4" /> {current.email}
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-surface p-3 text-sm ring-1 ring-line">
              <p className="text-xs text-muted">{t("_Event_", "Event")}</p>
              <p className="font-semibold text-ink">{eventName(current.eventId)}</p>
              {current.team && (
                <p className="mt-1 text-xs text-muted-strong">
                  {t("Tim", "Team")}: {current.team}
                </p>
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">{t("Ubah status registrasi", "Change registration status")}</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS) as Participant["status"][]).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={current.status === s ? "primary" : "secondary"}
                    onClick={() => {
                      setStatus(current.id, s);
                      toast.success(`Status ${current.name} → ${t(STATUS[s].label)}`);
                    }}
                  >
                    {t(STATUS[s].label)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
