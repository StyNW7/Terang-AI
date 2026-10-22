"use client";

import { Bot, Info, Quote, UserCheck } from "lucide-react";
import type { EvidenceItem } from "@/types/interview";
import { COMPETENCY_MAP } from "@/data/candidates.mock";
import { LEVEL_LABEL } from "@/lib/assessment";
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
  reviewerNote?: string;
  override?: 1 | 2 | 3 | 4;
  onOverride?: (level: 1 | 2 | 3 | 4) => void;
  compact?: boolean;
}) {
  const comp = COMPETENCY_MAP[evidence.competencyId];
  const level = override ?? evidence.level;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface px-5 py-4">
        <div className="min-w-0">
          <p className="font-semibold text-ink">{comp?.name ?? evidence.competencyId}</p>
          <p className="text-xs text-muted-strong">{comp?.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {weight !== undefined && <span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-muted-strong ring-1 ring-line">Bobot {weight}%</span>}
          <div className="flex gap-1" aria-label={`Level ${level} dari 4`}>
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
              <Bot className="h-3 w-3" /> Sinyal demo (rule-based)
            </span>
            <span className="text-[11px] text-muted">Keyakinan: {evidence.confidence}</span>
          </div>
          <p className="text-sm">
            <span className="font-semibold text-ink">Contoh evaluasi: </span>
            <span className="text-muted-strong">
              Level {evidence.level} — {LEVEL_LABEL[evidence.level]}. {comp?.rubric.find((r) => r.level === evidence.level)?.descriptor}
            </span>
          </p>
          {evidence.excerpt && (
            <blockquote className="flex gap-2 rounded-xl border-l-4 border-brand bg-soft/50 p-3 text-[13px] italic leading-relaxed text-ink">
              <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 not-italic text-brand" />
              {evidence.excerpt}
            </blockquote>
          )}
          <p className="text-xs text-muted">{evidence.rationale}</p>
          <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-warning-ink">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Batasan: penilaian hanya berdasarkan teks jawaban & rubrik demo; tidak mengukur kepribadian, emosi, atau wajah, dan bukan
            keputusan perekrutan.
          </p>
        </div>
        <div className={cn("space-y-3 border-line bg-success-soft/40 p-5", compact ? "border-t" : "border-t md:border-l md:border-t-0")}>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success-ink">
            <UserCheck className="h-3 w-3" /> Tinjauan manusia
          </span>
          {onOverride ? (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Level menurut recruiter</p>
              <div className="flex flex-wrap gap-1.5">
                {([1, 2, 3, 4] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onOverride(l)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 transition",
                      level === l ? "bg-success-ink text-white ring-[#0b7a5a]" : "bg-card text-muted-strong ring-line hover:ring-[#0b7a5a]/50",
                    )}
                  >
                    {l} · {LEVEL_LABEL[l]}
                  </button>
                ))}
              </div>
              {override && override !== evidence.level && (
                <p className="mt-1.5 text-[11px] font-semibold text-success-ink">Override manusia aktif (sinyal demo: level {evidence.level}).</p>
              )}
            </div>
          ) : null}
          <p className="text-[13px] leading-relaxed text-ink">
            {reviewerNote ?? <span className="italic text-muted">Belum ada catatan reviewer.</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
