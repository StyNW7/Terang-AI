"use client";

import { motion } from "motion/react";
import { Brain, CalendarDays, Info, Layers, Target, Users } from "lucide-react";
import { SURVEY_EVENTS, SURVEY_INTERVIEW, SURVEY_META, SURVEY_PROFILE, SURVEY_STRATEGY, type SurveyBar } from "@/data/survey";
import { SourceLabel } from "@/components/shared/source-label";
import { cn } from "@/lib/utils";
import { keyOf, useI18n } from "@/lib/i18n";

function Bars({ items, color }: { items: SurveyBar[]; color: string }) {
  const { tx } = useI18n();
  return (
    <div className="space-y-3">
      {items.map((b) => (
        <div key={keyOf(b.label)}>
          <div className="flex justify-between gap-3 text-[13px]">
            <span className="text-ink">{tx(b.label)}</span>
            <span className="tabular font-semibold text-ink">{b.value}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-track">
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${b.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Survey findings for both products, plus what they imply for ONE and ACE. */
export function SurveyEvidence() {
  const { t, tx } = useI18n();
  const products = [
    {
      key: "interview",
      icon: Brain,
      name: "AI Candidate Interview",
      data: SURVEY_INTERVIEW,
      accent: "text-one-ink",
      soft: "bg-one-soft",
      color: "linear-gradient(90deg,#4a90e2,#2251c9)",
      groups: [
        { title: t("Tantangan terbesar", "Biggest challenges"), items: SURVEY_INTERVIEW.challenges },
        { title: t("Fitur paling dibutuhkan", "Most-needed features"), items: SURVEY_INTERVIEW.features },
      ],
    },
    {
      key: "events",
      icon: CalendarDays,
      name: "Terang Events",
      data: SURVEY_EVENTS,
      accent: "text-sky-ink",
      soft: "bg-sky-soft",
      color: "linear-gradient(90deg,#7fd3ff,#0c9fd8)",
      groups: [{ title: t("Fitur paling dibutuhkan", "Most-needed features"), items: SURVEY_EVENTS.features }],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-navy-gradient p-5 text-white shadow-card">
          <Users className="h-5 w-5 text-sky" />
          <p className="tabular mt-3 font-display text-3xl font-semibold">{SURVEY_META.respondents}</p>
          <p className="text-sm text-white/75">
            {t("responden", "respondents")} · {tx(SURVEY_META.date)}
          </p>
        </div>
        {SURVEY_PROFILE.map((s) => (
          <div key={s.value + keyOf(s.label)} className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <p className="tabular font-display text-3xl font-semibold text-gradient">{s.value}</p>
            <p className="mt-1 text-sm text-muted-strong">{tx(s.label)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {products.map((p) => (
          <div key={p.key} className="flex flex-col rounded-3xl border border-line bg-card p-6 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={cn("flex items-center gap-2 text-sm font-semibold", p.accent)}>
                  <p.icon className="h-4 w-4" /> {p.name}
                </p>
                <p className="mt-0.5 text-xs text-muted">{tx(p.data.base)}</p>
              </div>
              <SourceLabel type="survey-data" compact />
            </div>
            <div className={cn("mt-5 rounded-2xl p-4", p.soft)}>
              <p className={cn("tabular font-display text-3xl font-semibold", p.accent)}>{p.data.headline.value}</p>
              <p className="text-sm font-semibold italic text-ink">{p.data.headline.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-strong">{tx(p.data.headline.text)}</p>
            </div>
            <div className="mt-5 space-y-5">
              {p.groups.map((g) => (
                <div key={g.title}>
                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{g.title}</p>
                  <Bars items={g.items} color={p.color} />
                </div>
              ))}
            </div>
            <p className="mt-auto pt-5 text-xs font-semibold text-muted-strong">{tx(p.data.interest)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(
          [
            { key: "one", icon: Target, title: t("Memperkuat ONE", "Supports ONE"), items: SURVEY_STRATEGY.one, tone: "bg-one-soft text-one-ink" },
            { key: "ace", icon: Layers, title: t("Memperkuat ACE", "Supports ACE"), items: SURVEY_STRATEGY.ace, tone: "bg-ace-soft text-ace-ink" },
          ] as const
        ).map((side) => (
          <div key={side.key} className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className={cn("grid h-8 w-8 place-items-center rounded-lg", side.tone)}>
                <side.icon className="h-4 w-4" />
              </span>
              {side.title}
            </p>
            <ul className="mt-3 space-y-2">
              {side.items.map((it) => (
                <li key={it.id} className="flex gap-2 text-[13px] leading-relaxed text-muted-strong">
                  <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
                  {tx(it)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-surface p-4 text-[13px] leading-relaxed text-muted-strong ring-1 ring-line">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" />
        <span>
          <strong className="text-ink">{tx(SURVEY_STRATEGY.balance)}</strong> {tx(SURVEY_META.caveat)}
        </span>
      </div>
    </div>
  );
}
