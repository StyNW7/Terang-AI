"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Gavel, Medal, Scale } from "lucide-react";
import { toast } from "sonner";
import type { Submission } from "@/types/events";
import { useEventsStore } from "@/store/events-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { EmptyState, Progress } from "@/components/ui/misc";
import { formatDate } from "@/lib/formatters";
import { SUBMISSION_STATUS_LABEL, weightedScore } from "./shared";
import { keyOf, L, useI18n, type Txt } from "@/lib/i18n";

const REVIEWERS = [
  L("Dr. Ratna Wibisono (fiktif)", "Dr. Ratna Wibisono (fictional)"),
  L("Andi Kurniawan, MBA (fiktif)", "Andi Kurniawan, MBA (fictional)"),
  L("Sari Dewanti (fiktif)", "Sari Dewanti (fictional)"),
  L("Bima Prakoso (fiktif)", "Bima Prakoso (fictional)"),
];
const STATUS_TONE = { "belum-dinilai": "neutral", dinilai: "brand", final: "success" } as const;

export function JudgingPanel() {
  const { t, tx } = useI18n();
  const events = useEventsStore((s) => s.events);
  const submissions = useEventsStore((s) => s.submissions);
  const score = useEventsStore((s) => s.scoreSubmission);
  const setStatus = useEventsStore((s) => s.setSubmissionStatus);
  const assign = useEventsStore((s) => s.assignReviewer);
  const judged = events.filter((e) => e.criteria.length > 0);
  const [eventId, setEventId] = useState("ev-nbcc");
  const event = judged.find((e) => e.id === eventId) ?? judged[0];
  const [scoring, setScoring] = useState<string | null>(null);

  const rows = submissions
    .filter((s) => s.eventId === event?.id)
    .map((s) => ({ ...s, total: event ? weightedScore(s.scores, event.criteria) : 0 }))
    .sort((a, b) => b.total - a.total);
  const current = rows.find((r) => r.id === scoring);
  const progress = rows.length ? rows.filter((r) => r.status !== "belum-dinilai").length / rows.length : 0;

  if (!event) return <EmptyState title={t("Belum ada _event_ dengan penjurian", "No events with judging yet")} />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink">{tx("_Event_", "Event")}</p>
            <Select className="mt-2" value={event.id} onChange={(e) => setEventId(e.target.value)} aria-label={t("Pilih _event_ penjurian", "Choose the event to judge")}>
              {judged.map((e) => (
                <option key={e.id} value={e.id}>
                  {t(e.name)}
                </option>
              ))}
            </Select>
            <div className="mt-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-strong">{t("Progres penilaian", "Scoring progress")}</span>
                <span className="tabular font-semibold text-ink">{Math.round(progress * 100)}%</span>
              </div>
              <Progress value={progress} tone="sky" className="mt-1" />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Scale className="h-4 w-4 text-sky-ink" /> {t("Rubrik berbobot", "Weighted rubric")}
            </p>
            <div className="mt-3 space-y-3">
              {event.criteria.map((c) => (
                <div key={c.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-ink">{tx(c.name)}</span>
                    <span className="tabular font-semibold text-sky-ink">{c.weight}%</span>
                  </div>
                  <p className="text-xs text-muted">{tx(c.description)}</p>
                  <Progress value={c.weight / 100} tone="sky" className="mt-1" height="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Gavel className="h-4 w-4 text-sky-ink" /> {t("Submisi & peringkat", "Submissions & ranking")}
            </p>
            <span className="text-xs text-muted">
              {rows.length} {t("submisi", rows.length === 1 ? "submission" : "submissions")}
            </span>
          </div>
          {rows.length === 0 ? (
            <EmptyState
              className="m-5"
              title={t("Belum ada submisi", "No submissions yet")}
              description={t("Submisi akan muncul saat peserta mengunggah karya.", "Submissions will appear once participants upload their work.")}
            />
          ) : (
            <ul className="divide-y divide-line">
              {rows.map((r, i) => (
                <motion.li layout key={r.id} className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <span className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-bold ${i < 3 && r.total > 0 ? "bg-ace-gradient text-white" : "bg-surface text-muted-strong ring-1 ring-line"}`}>
                    {i < 3 && r.total > 0 ? <Medal className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{r.team}</p>
                      <Badge tone={STATUS_TONE[r.status]}>{t(SUBMISSION_STATUS_LABEL[r.status])}</Badge>
                    </div>
                    <p className="text-sm leading-snug text-muted-strong">{t(r.title)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Select
                        value={keyOf(r.reviewer)}
                        onChange={(e) => {
                          const reviewer: Txt = REVIEWERS.find((rv) => rv.id === e.target.value) ?? e.target.value;
                          assign(r.id, reviewer);
                          toast.success(t(`_Reviewer_ ${r.team} diperbarui.`, `Reviewer for ${r.team} updated.`));
                        }}
                        className="h-8 w-60 text-xs"
                        aria-label={t(`_Reviewer_ untuk ${r.team}`, `Reviewer for ${r.team}`)}
                      >
                        {REVIEWERS.map((rv) => (
                          <option key={rv.id} value={rv.id}>
                            {t(rv)}
                          </option>
                        ))}
                      </Select>
                      <span className="text-[11px] text-muted">
                        {t("Dikirim", "Submitted")} {formatDate(r.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <p className="tabular font-display text-2xl font-semibold text-ink">{r.total ? r.total.toFixed(1) : "—"}</p>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="soft" onClick={() => setScoring(r.id)} disabled={r.status === "final"}>
                        {t("Nilai", "Score")}
                      </Button>
                      {r.status === "dinilai" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setStatus(r.id, "final");
                            toast.success(t(`Nilai ${r.team} difinalkan.`, `Scores for ${r.team} finalised.`));
                          }}
                        >
                          {t("Finalkan", "Finalise")}
                        </Button>
                      )}
                      {r.status === "final" && (
                        <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "dinilai")}>
                          {t("Buka", "Reopen")}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        open={!!current}
        onClose={() => setScoring(null)}
        title={current ? `${t("Penilaian", "Scoring")} — ${current.team}` : ""}
        description={current ? t(current.title) : undefined}
        footer={
          <Button
            onClick={() => {
              setScoring(null);
              toast.success(t("Nilai tersimpan.", "Scores saved."));
            }}
          >
            {t("Simpan nilai", "Save scores")}
          </Button>
        }
      >
        {current && <ScoreForm submission={current} criteria={event.criteria} onScore={(cid, v) => score(current.id, cid, v)} />}
      </Modal>
    </div>
  );
}

function ScoreForm({
  submission,
  criteria,
  onScore,
}: {
  submission: Submission & { total: number };
  criteria: { id: string; name: Txt; weight: number; description: Txt }[];
  onScore: (criterionId: string, value: number) => void;
}) {
  const { t, tx } = useI18n();
  return (
    <div className="space-y-5">
      {criteria.map((c) => (
        <Slider
          key={c.id}
          label={`${t(c.name)} (${c.weight}%)`}
          value={submission.scores[c.id] ?? 0}
          min={0}
          max={100}
          onChange={(v) => onScore(c.id, v)}
          display={`${submission.scores[c.id] ?? 0}/100`}
          color="#0c9fd8"
          hint={tx(c.description)}
        />
      ))}
      <div className="flex items-center justify-between rounded-xl bg-ace-soft p-4">
        <span className="text-sm font-semibold text-ace-ink">{t("Skor berbobot otomatis", "Automatic weighted score")}</span>
        <span className="tabular font-display text-2xl font-semibold text-ink">{weightedScore(submission.scores, criteria).toFixed(1)}</span>
      </div>
    </div>
  );
}
