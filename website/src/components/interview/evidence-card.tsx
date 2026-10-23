"use client";

import { Bot, Info, Quote, UserCheck } from "lucide-react";
import type { EvidenceItem } from "@/types/interview";
import { COMPETENCY_MAP } from "@/data/candidates.mock";
import { CONFIDENCE_LABEL, LEVEL_LABEL } from "@/lib/assessment";
import { useI18n, type Txt } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Competency card that makes the boundary between generated demo signals (left / blue)
 * and human review (right / green) visually obvious.
 */
export function EvidenceCard({
  evidence,
  weight,
  reviewerNote,
  override,
  onOverride,
  compact,
}: {
  evidence: EvidenceItem;
  weight?: number;
  reviewerNote?: Txt;
  override?: 1 | 2 | 3 | 4;
  onOverride?: (level: 1 | 2 | 3 | 4) => void;
  compact?: boolean;
}) {
  const comp = COMPETENCY_MAP[evidence.competencyId];
  const { t, tx } = useI18n();
  const level = override ?? evidence.level;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface px-5 py-4">
        <div className="min-w-0">
          <p className="font-semibold text-ink">{comp ? tx(comp.name) : evidence.competencyId}</p>
          <p className="text-xs text-muted-strong">{comp && tx(comp.description)}</p>
        </div>
        <div className="flex items-center gap-2">
          {weight !== undefined && (
            <span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-muted-strong ring-1 ring-line">
              {t("Bobot", "Weight")} {weight}%
            </span>
          )}
          <div className="flex gap-1" aria-label={t(`Level ${level} dari 4`, `Level ${level} of 4`)}>
            {[1, 2, 3, 4].map((l) => (
              <span key={l} className={cn("h-2 w-5 rounded-full", l <= level ? "bg-brand-gradient" : "bg-line")} />
            ))}
          </div>
        </div>
      </div>
      <div className={cn("grid gap-0", !compact && "md:grid-cols-[1.4fr_1fr]")}>
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2 py-0.5 text-[11px] font-semibold text-brand-ink">
              <Bot className="h-3 w-3" /> {tx("Sinyal demo (_rule-based_)", "Demo signal (rule-based)")}
            </span>
            <span className="text-[11px] text-muted">
              {t("Keyakinan", "Confidence")}: {t(CONFIDENCE_LABEL[evidence.confidence])}
            </span>
          </div>
          <p className="text-sm">
            <span className="font-semibold text-ink">{t("Contoh evaluasi:", "Example evaluation:")} </span>
            <span className="text-muted-strong">
              Level {evidence.level} — {t(LEVEL_LABEL[evidence.level])}. {tx(comp?.rubric.find((r) => r.level === evidence.level)?.descriptor ?? "")}
            </span>
          </p>
          {evidence.excerpt && (
            <blockquote className="flex gap-2 rounded-xl border-l-4 border-brand bg-soft/50 p-3 text-[13px] italic leading-relaxed text-ink">
              <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 not-italic text-brand" />
              {evidence.excerpt}
            </blockquote>
          )}
          <p className="text-xs text-muted">{tx(evidence.rationale)}</p>
          <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-warning-ink">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {t(
              "Batasan: penilaian hanya berdasarkan teks jawaban & rubrik demo; tidak mengukur kepribadian, emosi, atau wajah, dan bukan keputusan perekrutan.",
              "Limitation: the assessment is based only on the answer text & demo rubric; it does not measure personality, emotion or faces, and it is not a hiring decision.",
            )}
          </p>
        </div>
        <div className={cn("space-y-3 border-line bg-success-soft/40 p-5", compact ? "border-t" : "border-t md:border-l md:border-t-0")}>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success-ink">
            <UserCheck className="h-3 w-3" /> {t("Tinjauan manusia", "Human review")}
          </span>
          {onOverride ? (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">{tx("Level menurut _recruiter_", "Recruiter's level")}</p>
              <div className="flex flex-wrap gap-1.5">
                {([1, 2, 3, 4] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onOverride(l)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 transition",
                      level === l ? "bg-success-ink text-card ring-success-ink" : "bg-card text-muted-strong ring-line hover:ring-success-ink/50",
                    )}
                  >
                    {l} · {t(LEVEL_LABEL[l])}
                  </button>
                ))}
              </div>
              {override && override !== evidence.level && (
                <p className="mt-1.5 text-[11px] font-semibold text-success-ink">
                  {tx(`_Override_ manusia aktif (sinyal demo: level ${evidence.level}).`, `Human override active (demo signal: level ${evidence.level}).`)}
                </p>
              )}
            </div>
          ) : null}
          <p className="text-[13px] leading-relaxed text-ink">
            {reviewerNote ? tx(reviewerNote) : <span className="italic text-muted">{t("Belum ada catatan _reviewer_.", "No reviewer note yet.")}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
