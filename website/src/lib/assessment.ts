import type { Candidate, Competency, EvidenceItem, JobPosition } from "@/types/interview";
import { COMPETENCY_MAP } from "@/data/candidates.mock";
import { L, pick, type Bilingual, type Locale } from "@/lib/i18n-core";

/**
 * Deterministic, rule-based demo assessment. This is NOT machine learning and NOT a
 * hiring decision. It only highlights text signals against predefined demo rubrics so
 * that a human recruiter has an evidence trail to review. Markers cover Indonesian
 * and English answers.
 */

const RESULT_MARKERS = [
  "hasil", "sehingga", "berhasil", "turun", "naik", "meningkat", "%", "persen", "selesai", "tepat waktu", "capaian", "kesepakatan",
  "result", "so that", "succeed", "dropped", "reduced", "increased", "percent", "completed", "finished", "on time", "achieved", "agreement",
];
const ACTION_MARKERS = [
  "saya membuat", "saya analisis", "saya usulkan", "saya koordinasikan", "saya menggali", "saya memecah", "saya belajar", "saya mendengarkan", "saya cek", "saya negosiasikan", "saya berkoordinasi", "saya menawarkan", "saya selalu",
  "i created", "i analysed", "i analyzed", "i proposed", "i coordinated", "i explored", "i broke", "i learned", "i listened", "i checked", "i negotiated", "i offered", "i always",
];
const SITUATION_MARKERS = ["saat", "ketika", "di organisasi", "waktu", "pernah", "ada pelanggan", "di kampus", "during", "when", "there was", "in my", "once"];

export interface AnswerSignals {
  words: number;
  keywordHits: string[];
  hasResult: boolean;
  hasAction: boolean;
  hasSituation: boolean;
}

export function answerSignals(answer: string, competency: Competency): AnswerSignals {
  const text = answer.toLowerCase();
  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const keywordHits = Array.from(new Set(competency.keywords.filter((k) => text.includes(k))));
  return {
    words,
    keywordHits,
    hasResult: RESULT_MARKERS.some((m) => text.includes(m)),
    hasAction: ACTION_MARKERS.some((m) => text.includes(m)) || /\bsaya\s+\w+(kan|i)\b/.test(text) || /\bi\s+\w+ed\b/.test(text),
    hasSituation: SITUATION_MARKERS.some((m) => text.includes(m)),
  };
}

function bestExcerpt(answer: string, competency: Competency) {
  const sentences = answer
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length === 0) return "";
  let best = sentences[0];
  let bestScore = -1;
  for (const s of sentences) {
    const lower = s.toLowerCase();
    const score =
      competency.keywords.filter((k) => lower.includes(k)).length * 2 + RESULT_MARKERS.filter((m) => lower.includes(m)).length;
    if (score > bestScore) {
      best = s;
      bestScore = score;
    }
  }
  return best;
}

export function assessAnswer(answer: string, competencyId: string): EvidenceItem {
  const competency = COMPETENCY_MAP[competencyId];
  if (!competency) {
    return { competencyId, level: 1, excerpt: answer.slice(0, 160), rationale: L("Kompetensi tidak dikenali.", "Competency not recognised."), confidence: "rendah" };
  }
  const s = answerSignals(answer, competency);
  let points = 0;
  if (s.words >= 15) points += 1;
  if (s.keywordHits.length >= 1) points += 1;
  if (s.hasResult) points += 1;
  if (s.keywordHits.length >= 2 && s.words >= 30 && (s.hasAction || s.hasSituation)) points += 1;
  const level = Math.max(1, Math.min(4, points)) as EvidenceItem["level"];

  const hits = s.keywordHits.slice(0, 3).join(", ");
  const reasons: Bilingual[] = [
    L(`${s.words} kata`, `${s.words} words`),
    s.keywordHits.length
      ? L(`${s.keywordHits.length} indikator rubrik (${hits})`, `${s.keywordHits.length} rubric indicators (${hits})`)
      : L("belum ada indikator rubrik", "no rubric indicators yet"),
    s.hasResult ? L("menyebut hasil/dampak", "mentions a result/impact") : L("belum menyebut hasil", "no result mentioned yet"),
  ];
  if (s.hasSituation) reasons.push(L("ada konteks situasi", "situational context given"));

  return {
    competencyId,
    level,
    excerpt: bestExcerpt(answer, competency),
    rationale: L(`Sinyal teks: ${reasons.map((r) => r.id).join(" · ")}.`, `Text signals: ${reasons.map((r) => r.en).join(" · ")}.`),
    confidence: s.words < 15 ? "rendah" : s.words < 35 ? "sedang" : "tinggi",
  };
}

export function followUpFor(answer: string, competencyId: string, defaultFollowUp: Bilingual | string): Bilingual | string {
  const competency = COMPETENCY_MAP[competencyId];
  if (!competency) return defaultFollowUp;
  const s = answerSignals(answer, competency);
  if (s.words < 15) return L("Bisa ceritakan contoh spesifik — situasinya apa dan apa yang Anda lakukan?", "Could you share a specific example — what was the situation and what did you do?");
  if (!s.hasResult) return L("Apa hasil akhirnya, dan bagaimana Anda mengukurnya?", "What was the final outcome, and how did you measure it?");
  return defaultFollowUp;
}

/** Evidence for a candidate; bilingual seed answers are assessed in the language being viewed. */
export function assessCandidate(candidate: Candidate, job: JobPosition | undefined, locale: Locale = "id"): EvidenceItem[] {
  if (!job) return [];
  return candidate.transcript.map((t) => {
    const q = job.questions.find((qq) => qq.id === t.questionId);
    return assessAnswer(pick(t.answer, locale), q?.competencyId ?? job.competencies[0]?.id ?? "komunikasi");
  });
}

/** Weighted rubric summary on a 1–4 scale (decision support only). */
export function weightedSummary(evidence: EvidenceItem[], job: JobPosition | undefined, overrides: Record<string, number> = {}) {
  if (!job || evidence.length === 0) return 0;
  let total = 0;
  let weights = 0;
  for (const comp of job.competencies) {
    const ev = evidence.find((e) => e.competencyId === comp.id);
    if (!ev) continue;
    const level = overrides[comp.id] ?? ev.level;
    total += level * comp.weight;
    weights += comp.weight;
  }
  return weights ? total / weights : 0;
}

export const LEVEL_LABEL: Record<number, Bilingual> = {
  1: L("Belum terlihat", "Not yet shown"),
  2: L("Berkembang", "Developing"),
  3: L("Cakap", "Proficient"),
  4: L("Kuat", "Strong"),
};

export const CONFIDENCE_LABEL: Record<EvidenceItem["confidence"], Bilingual> = {
  rendah: L("rendah", "low"),
  sedang: L("sedang", "medium"),
  tinggi: L("tinggi", "high"),
};
