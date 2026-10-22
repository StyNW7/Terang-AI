"use client";

import { ArrowRight, Check, ListChecks, Mic, Presentation, Trophy, Wrench } from "lucide-react";
import type { EventTemplate } from "@/types/events";
import { EVENT_TEMPLATES, CATEGORY_LABEL } from "@/data/events.mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/misc";
import { formatIDR } from "@/lib/formatters";

const ICONS = { trophy: Trophy, presentation: Presentation, wrench: Wrench, mic: Mic };

export function TemplatesPanel({ onUse }: { onUse: (t: EventTemplate) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {EVENT_TEMPLATES.map((t) => {
          const Icon = ICONS[t.icon];
          return (
            <div key={t.id} className="group flex flex-col rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-soft text-sky-ink transition group-hover:bg-ace-gradient group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <Badge tone="neutral">{CATEGORY_LABEL[t.category]}</Badge>
              </div>
              <h4 className="mt-4 text-lg font-semibold text-ink">{t.name}</h4>
              <p className="mt-1 text-sm text-muted-strong">{t.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Tahapan", t.defaults.stages.length],
                  ["Kriteria", t.defaults.criteria.length || "—"],
                  ["Durasi", `${t.defaults.durationDays} hr`],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-xl bg-surface p-2 ring-1 ring-line">
                    <p className="tabular font-semibold text-ink">{v}</p>
                    <p className="text-[11px] text-muted">{k}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                  <ListChecks className="h-3.5 w-3.5" /> Tugas organizer otomatis
                </p>
                <ul className="mt-2 space-y-1">
                  {t.defaults.tasks.map((task) => (
                    <li key={task} className="flex items-center gap-2 text-[13px] text-ink">
                      <Check className="h-3.5 w-3.5 text-success" /> {task}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="text-xs text-muted">{t.defaults.fee ? formatIDR(t.defaults.fee) : "Gratis"} · {t.defaults.teamBased ? "Tim" : "Individu"} · {t.defaults.mode}</span>
                <Button size="sm" variant="ace" onClick={() => onUse(t)}>
                  Gunakan template <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Callout tone="info" title="Mengapa ini relevan?">
        Template mengurangi waktu setup berulang — salah satu masalah utama organizer. Dalam ACE, fitur ini adalah inisiatif besar pertama
        Terang Events (batas WIP 1 per produk).
      </Callout>
    </div>
  );
}
