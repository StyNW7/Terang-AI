import { L, type Bilingual } from "@/lib/i18n-core";

/**
 * TEAM SURVEY — independent Google Form survey, n = 113, 24 October 2026.
 * Respondents are end users (candidates & event committees), mostly students and
 * fresh graduates. The figures show needs and interest, not B2B willingness to pay.
 * Source: data-analysis/ (notebook + summary.md) in this repository.
 */

export const SURVEY_META = {
  respondents: 113,
  date: L("24 Oktober 2026", "24 October 2026"),
  caveat: L(
    "Responden adalah pengguna akhir (kandidat & panitia acara), bukan pembeli B2B. Angka menunjukkan kebutuhan & minat, bukan kemauan membayar perusahaan.",
    "Respondents are end users (candidates & event committees), not B2B buyers. The figures show needs & interest, not companies' willingness to pay.",
  ),
};

export interface SurveyStat {
  value: string;
  label: Bilingual;
}

export const SURVEY_PROFILE: SurveyStat[] = [
  { value: "69%", label: L("berusia 17–29 tahun", "aged 17–29") },
  { value: "58%", label: L("mahasiswa / _fresh graduate_", "students / fresh graduates") },
  { value: "83%", label: L("butuh wawancara & acara sekaligus", "need both interviews & events") },
];

export interface SurveyBar {
  label: Bilingual;
  value: number; // 0..100
}

export const SURVEY_INTERVIEW = {
  base: L("Kandidat yang pernah menyiapkan wawancara (n = 103)", "Candidates who prepared for an interview (n = 103)"),
  headline: { value: "73% → 13%", title: "Feedback Gap", text: L("butuh _feedback_ & evaluasi jawaban, tetapi baru 13% yang berlatih dengan AI.", "need answer feedback & evaluation, yet only 13% practise with AI.") },
  challenges: [
    { label: L("Kurang percaya diri", "Lack of confidence"), value: 46 },
    { label: L("Sulit mendapat _feedback_", "Hard to get feedback"), value: 45 },
    { label: L("Tidak punya partner latihan", "No practice partner"), value: 36 },
  ] satisfies SurveyBar[],
  features: [
    { label: L("Simulasi sesuai pekerjaan yang dituju", "Role-specific simulation"), value: 76 },
    { label: L("_Feedback_ & evaluasi jawaban", "Answer feedback & evaluation"), value: 71 },
    { label: L("Rekomendasi perbaikan personal", "Personalised improvement tips"), value: 71 },
  ] satisfies SurveyBar[],
  interest: L("Berminat mencoba 67% · melihat manfaat 72%", "Likely to try 67% · see value 72%"),
};

export const SURVEY_EVENTS = {
  base: L("Pengelola pendaftaran / administrasi acara (n = 75)", "Event registration / admin organizers (n = 75)"),
  headline: { value: "80%", title: "Manual-First Event Ops", text: L("masih memakai Google Forms/Sheets (55%) atau WhatsApp/media sosial (25%); hanya 20% memakai platform khusus.", "still use Google Forms/Sheets (55%) or WhatsApp/social media (25%); only 20% use a dedicated platform.") },
  features: [
    { label: L("Pendaftaran peserta _online_", "Online participant registration"), value: 85 },
    { label: L("Pengumpulan karya & pelacakan _review_", "Submission collection & review tracking"), value: 81 },
    { label: L("Pengelolaan tiket / pembayaran", "Ticketing / payment management"), value: 63 },
  ] satisfies SurveyBar[],
  interest: L("Berminat menggunakan 71% · melihat manfaat 75%", "Likely to use 71% · see value 75%"),
};

export const SURVEY_STRATEGY: { one: Bilingual[]; ace: Bilingual[]; balance: Bilingual } = {
  one: [
    L("91% pernah menyiapkan wawancara dalam 2 tahun terakhir — kebutuhan berulang.", "91% prepared for an interview in the last 2 years — a recurring need."),
    L("_Feedback_ objektif (30%) lebih dipertimbangkan daripada harga murah (23%).", "Objective feedback (30%) matters more than a low price (23%)."),
    L("Korelasi minat kedua produk lemah (ρ = 0,23) — dua pasar, dua _go-to-market_.", "Interest in the two products is weakly correlated (ρ = 0.23) — two markets, two go-to-markets."),
  ],
  ace: [
    L("40% menilai kedua produk sama relevan — kelompok terbesar.", "40% rate both products equally relevant — the largest group."),
    L("51% berminat pada kedua produk sekaligus (skor 4–5).", "51% are interested in both products at once (score 4–5)."),
    L("80% pengelola acara masih manual — pasar Events belum terlayani.", "80% of organizers are still manual — the Events market is underserved."),
  ],
  balance: L(
    "Preferensi Terang Events vs AI Interview (36 vs 28) tidak signifikan secara statistik (p = 0,38). Survei mendukung kedua sisi — keputusan bergantung pada kapasitas dan bukti komersial.",
    "The preference for Terang Events vs AI Interview (36 vs 28) is not statistically significant (p = 0.38). The survey supports both sides — the decision depends on capacity and commercial evidence.",
  ),
};
