"use client";

import { ArrowRight, Check, ListChecks, Mic, Presentation, Trophy, Wrench } from "lucide-react";
import type { EventTemplate } from "@/types/events";
import { EVENT_TEMPLATES, CATEGORY_LABEL } from "@/data/events.mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/misc";
import { formatIDR } from "@/lib/formatters";
import { keyOf, useI18n } from "@/lib/i18n";
import { MODE_LABEL } from "./shared";

const ICONS = { trophy: Trophy, presentation: Presentation, wrench: Wrench, mic: Mic };

export function TemplatesPanel({ onUse }: { onUse: (t: EventTemplate) => void }) {
  const { t, tx } = useI18n();
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {EVENT_TEMPLATES.map((tpl) => {
          const Icon = ICONS[tpl.icon];
          return (
            <div key={tpl.id} data-spotlight className="group flex flex-col rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-soft text-sky-ink transition group-hover:bg-ace-gradient group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <Badge tone="neutral">{tx(CATEGORY_LABEL[tpl.category])}</Badge>
              </div>
              <h4 className="mt-4 text-lg font-semibold text-ink">{tpl.name}</h4>
              <p className="mt-1 text-sm text-muted-strong">{tx(tpl.description)}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  [t("Tahapan", "Stages"), tpl.defaults.stages.length],
                  [t("Kriteria", "Criteria"), tpl.defaults.criteria.length || "—"],
                  [t("Durasi", "Duration"), `${tpl.defaults.durationDays} ${t("hr", "days")}`],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-xl bg-surface p-2 ring-1 ring-line">
                    <p className="tabular font-semibold text-ink">{v}</p>
                    <p className="text-[11px] text-muted">{k}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                  <ListChecks className="h-3.5 w-3.5" /> {tx("Tugas _organizer_ otomatis", "Automatic organizer tasks")}
                </p>
                <ul className="mt-2 space-y-1">
                  {tpl.defaults.tasks.map((task) => (
                    <li key={keyOf(task)} className="flex items-center gap-2 text-[13px] text-ink">
                      <Check className="h-3.5 w-3.5 text-success" /> {tx(task)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="text-xs text-muted">
                  {tpl.defaults.fee ? formatIDR(tpl.defaults.fee) : t("Gratis", "Free")} · {tpl.defaults.teamBased ? t("Tim", "Team") : t("Individu", "Individual")} ·{" "}
                  {t(MODE_LABEL[tpl.defaults.mode])}
                </span>
                <Button size="sm" variant="ace" onClick={() => onUse(tpl)}>
                  {tx("Gunakan _template_", "Use template")} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Callout tone="info" title={t("Mengapa ini relevan?", "Why does this matter?")}>
        {tx(
          "_Template_ mengurangi waktu _setup_ berulang — salah satu masalah utama _organizer_. Dalam ACE, fitur ini adalah inisiatif besar pertama Terang Events (batas WIP 1 per produk).",
          "Templates cut repeated setup time — one of organizers' biggest pain points. Under ACE, this is Terang Events' first major initiative (WIP limit of 1 per product).",
        )}
      </Callout>
    </div>
  );
}
