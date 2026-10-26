import type { EvidenceClassification } from "@/types/common";
import { L, type Txt } from "@/lib/i18n-core";

export const COMPANY = {
  name: "Terang AI",
  legalName: "PT Terang Inovasi Indonesia",
  industry: "Artificial Intelligence · Education Technology · B2B Technology Solutions",
  origin: "Indonesia",
  introduced: 2024,
  idea: L(
    "Membuat teknologi AI lebih bermanfaat, mudah diakses, dan berdampak di dunia pendidikan maupun proses bisnis.",
    "Making AI technology more useful, accessible and impactful — in education and in business processes.",
  ),
  tagline: "Smarter Solutions, Brighter Futures.",
  taglineNote: L(
    "Tagline konseptual untuk prototipe akademik — bukan slogan resmi perusahaan.",
    "A conceptual tagline for this academic prototype — not an official company slogan.",
  ),
};

export interface TimelineStep {
  id: string;
  phase: string;
  period: Txt;
  title: string;
  description: Txt;
  items: Txt[];
  evidence: EvidenceClassification;
  segment: Txt;
}

export const EVOLUTION: TimelineStep[] = [
  {
    id: "edu",
    phase: "01",
    period: "2024",
    title: "Education & Exam Preparation",
    description: L(
      "Diperkenalkan sebagai platform pendidikan berbasis AI dengan pembelajaran personal dan persiapan ujian.",
      "Introduced as an AI-powered education platform for personalised learning and exam preparation.",
    ),
    items: [
      L("Persiapan UTBK", "UTBK preparation"),
      L("Persiapan CPNS", "CPNS preparation"),
      L("Persiapan beasiswa (mis. LPDP)", "Scholarship preparation (e.g. LPDP)"),
      L("Pembelajaran personal", "Personalised learning"),
    ],
    evidence: "public-source",
    segment: "B2C",
  },
  {
    id: "interview-tech",
    phase: "02",
    period: L("Fondasi teknologi", "Technology foundation"),
    title: "AI Interview Technology",
    description: L(
      "Simulasi wawancara berbasis AI melalui Professor Terra: percakapan kontekstual dan umpan balik wawancara.",
      "AI-based interview simulation through Professor Terra: contextual conversations and interview feedback.",
    ),
    items: [
      "Professor Terra",
      L("Simulasi wawancara beasiswa & kerja", "Scholarship & job interview simulation"),
      L("Umpan balik berbasis AI", "AI-based feedback"),
    ],
    evidence: "public-source",
    segment: "B2C → B2B",
  },
  {
    id: "b2b",
    phase: "03",
    period: L("Ekspansi", "Expansion"),
    title: "Expanded B2B Offerings",
    description: L(
      "Portofolio meluas ke solusi institusional: pembelajaran, manajemen acara, dan rekrutmen berbasis AI.",
      "The portfolio expands into institutional solutions: AI-powered learning, event management and recruitment.",
    ),
    items: ["AI Learning Management System", "Terang Events", "AI Candidate Interview"],
    evidence: "public-source",
    segment: "B2B",
  },
  {
    id: "decision",
    phase: "04",
    period: L("Sekarang", "Today"),
    title: "Strategic Growth Decision",
    description: L(
      "Dua peluang B2B dengan pasar berbeda — fokus pada satu produk (ONE) atau kembangkan keduanya terkoordinasi (ACE)?",
      "Two B2B opportunities in different markets — focus on one product (ONE) or grow both in coordination (ACE)?",
    ),
    items: ["ONE — Focused Single-Product Growth", "ACE — Coordinated Dual-Product Growth"],
    evidence: "strategic-proposal",
    segment: L("Keputusan", "Decision"),
  },
];

export const B2C_OFFERINGS: { name: Txt; description: Txt }[] = [
  { name: "UTBK", description: L("Latihan & simulasi untuk seleksi masuk perguruan tinggi.", "Practice & mock tests for university entrance selection.") },
  { name: "CPNS", description: L("Persiapan seleksi calon aparatur sipil negara.", "Preparation for civil-service (CPNS) selection.") },
  { name: L("Beasiswa", "Scholarships"), description: L("Persiapan seleksi beasiswa seperti LPDP.", "Preparation for scholarship selection such as LPDP.") },
  { name: L("Wawancara AI", "AI Interview"), description: L("Simulasi wawancara bersama Professor Terra.", "Interview simulation with Professor Terra.") },
];

export interface ProductProposal {
  name: string;
  status: "proposed" | "later";
  description: Txt;
}

export const PRODUCTS = {
  events: {
    key: "events" as const,
    name: "Terang Events",
    category: "EventTech",
    categoryLong: "Event & Competition Management",
    tagline: L(
      "Satu platform untuk registrasi, pembayaran, peserta, dan penjurian.",
      "One platform for registration, payments, participants and judging.",
    ),
    buyer: L("Penyelenggara acara & institusi", "Event organisers & institutions"),
    targetCustomers: [
      L("Universitas & institusi pendidikan", "Universities & educational institutions"),
      L("Penyelenggara kompetisi", "Competition organisers"),
      L("Asosiasi profesional", "Professional associations"),
      L("Penyelenggara seminar, pelatihan & konferensi", "Seminar, training & conference organisers"),
      L("Organisasi dengan _event_ institusional berulang", "Organisations with recurring institutional events"),
    ],
    problems: [
      L("Data registrasi & peserta tersebar di banyak alat", "Registration & participant data scattered across many tools"),
      L("Koordinasi peserta dan submisi masih manual", "Participant and submission coordination is still manual"),
      L("Pengelolaan pembayaran registrasi", "Managing registration payments"),
      L("Administrasi juri & proses penilaian", "Judge administration & the scoring process"),
      L("Sulit memantau progres & kinerja _event_", "Hard to monitor event progress & performance"),
      L("_Setup_ ulang dari nol untuk _event_ berikutnya", "Setting up the next event from scratch"),
    ],
    existing: [
      L("Penemuan & registrasi _event_", "Event discovery & registration"),
      L("Pembayaran registrasi via layanan pembayaran yang didukung", "Registration payments via supported payment services"),
      L("_Workflow_ submisi & _review_", "Submission & review workflow"),
      L("Rubrik penjurian terstruktur", "Structured judging rubrics"),
      L("Peran _organizer_ & _reviewer_", "Organizer & reviewer roles"),
      L("Manajemen keuangan & _payout_", "Financial management & payouts"),
      L("Analitik _event_", "Event analytics"),
    ],
    proposals: [
      {
        name: "Smart Event Templates",
        status: "proposed",
        description: L(
          "_Template_ kompetisi, _workshop_, konferensi & seminar yang mengisi otomatis _setup_, tahapan & tugas _organizer_.",
          "Competition, workshop, conference & seminar templates that auto-fill the setup, stages & organizer tasks.",
        ),
      },
      {
        name: "Repeat Event Planner",
        status: "proposed",
        description: L(
          "Duplikasi konfigurasi _event_ sebelumnya tanpa menyalin data peserta.",
          "Duplicate a previous event's configuration without copying participant data.",
        ),
      },
      {
        name: "Organizer Insight Dashboard",
        status: "proposed",
        description: L(
          "Pengembangan analitik: _funnel_ registrasi, aktivitas peserta & tren _event_ berulang.",
          "Deeper analytics: registration funnel, participant activity & recurring-event trends.",
        ),
      },
      {
        name: "AI Event Assistant",
        status: "later",
        description: L(
          "FAQ peserta & pengingat tenggat berbasis informasi dari _organizer_ (prioritas berikutnya).",
          "Participant FAQs & deadline reminders based on organizer information (next priority).",
        ),
      },
    ] satisfies ProductProposal[],
    revenueModel: L("Event Platform Fee · Managed Event Boost · Organizer Pro Subscription (usulan)", "Event Platform Fee · Managed Event Boost · Organizer Pro Subscription (proposed)"),
    cycle: L("Episodik — mengikuti kalender akademik & acara", "Episodic — follows the academic & event calendar"),
  },
  interview: {
    key: "interview" as const,
    name: "AI Candidate Interview",
    category: "HRTech",
    categoryLong: "AI-Assisted Candidate Interviewing",
    tagline: L(
      "Wawancara terstruktur dengan bukti penilaian yang dapat ditinjau manusia.",
      "Structured interviews with assessment evidence that humans can review.",
    ),
    buyer: L("Tim HR & _talent acquisition_", "HR & talent acquisition teams"),
    targetCustomers: [
      L("Perusahaan dengan rekrutmen _entry-level_ berulang", "Companies with recurring entry-level hiring"),
      L("Departemen HR & tim _talent acquisition_", "HR departments & talent acquisition teams"),
      L("Agensi rekrutmen", "Recruitment agencies"),
      L("Perusahaan menengah dengan tim HR ramping", "Mid-sized companies with lean HR teams"),
    ],
    problems: [
      L("Administrasi _screening_ memakan waktu", "Screening administration is time-consuming"),
      L("Persiapan wawancara tidak konsisten", "Interview preparation is inconsistent"),
      L("Sulit mendokumentasikan jawaban terkait kompetensi", "Hard to document competency-related answers"),
      L("Penjadwalan & tindak lanjut berulang", "Repetitive scheduling & follow-ups"),
      L("Sulit membandingkan jawaban dengan kriteria jabatan", "Hard to compare answers against role criteria"),
      L("Butuh bukti penilaian yang terstruktur & dapat diaudit", "Need structured, auditable assessment evidence"),
    ],
    existing: [
      L("Teknologi simulasi wawancara AI (Professor Terra)", "AI interview simulation technology (Professor Terra)"),
      L("Percakapan kontekstual berbasis AI", "AI-based contextual conversations"),
      L("Umpan balik wawancara pada produk pembelajaran", "Interview feedback in learning products"),
    ],
    proposals: [
      {
        name: "Role-Based Interview Builder",
        status: "proposed",
        description: L(
          "HR membuat lowongan, memilih kompetensi, dan meninjau saran pertanyaan sebelum dipublikasikan.",
          "HR creates a vacancy, picks competencies and reviews suggested questions before publishing.",
        ),
      },
      {
        name: "Adaptive Structured Interview",
        status: "proposed",
        description: L(
          "Pertanyaan inti terstandar dengan _follow-up_ kontekstual.",
          "Standardised core questions with contextual follow-ups.",
        ),
      },
      {
        name: "Evidence-Linked Assessment",
        status: "proposed",
        description: L(
          "Setiap penilaian terhubung ke rubrik dan kutipan jawaban kandidat.",
          "Every rating is linked to a rubric and to quotes from the candidate's answers.",
        ),
      },
      {
        name: "Recruiter Review Dashboard",
        status: "proposed",
        description: L(
          "Lowongan, undangan, progres, laporan, catatan, dan persetujuan manusia.",
          "Vacancies, invitations, progress, reports, notes and human approval.",
        ),
      },
      {
        name: "Responsible AI Controls",
        status: "proposed",
        description: L(
          "Kontrol akses, _audit trail_, pemberitahuan privasi, retensi data, dan wajib tinjauan manusia.",
          "Access control, audit trail, privacy notices, data retention and mandatory human review.",
        ),
      },
    ] satisfies ProductProposal[],
    revenueModel: L("Terang Pilot Challenge → langganan Starter · Growth · Enterprise (usulan)", "Terang Pilot Challenge → Starter · Growth · Enterprise subscriptions (proposed)"),
    cycle: L("Berulang — mengikuti siklus rekrutmen perusahaan", "Recurring — follows companies' hiring cycles"),
  },
};

export const POSITIONING: { label: Txt; events: Txt; interview: Txt }[] = [
  {
    label: L("Pembeli utama", "Primary buyer"),
    events: L("Penyelenggara acara, universitas, asosiasi", "Event organisers, universities, associations"),
    interview: L("HR, _talent acquisition_, agensi rekrutmen", "HR, talent acquisition, recruitment agencies"),
  },
  {
    label: L("Pola penggunaan", "Usage pattern"),
    events: L("Episodik per _event_", "Episodic, per event"),
    interview: L("Berulang per siklus rekrutmen", "Recurring, per hiring cycle"),
  },
  {
    label: L("Kesiapan produk", "Product readiness"),
    events: L("Fondasi publik sudah berjalan (registrasi, pembayaran, penjurian)", "Public foundation already live (registration, payments, judging)"),
    interview: L("Teknologi inti ada (simulasi B2C), kesiapan _enterprise_ perlu divalidasi", "Core technology exists (B2C simulation); enterprise readiness still needs validation"),
  },
  {
    label: L("Ketidakpastian pasar", "Market uncertainty"),
    events: L("Lebih rendah — kebutuhan operasional jelas", "Lower — operational needs are clear"),
    interview: L("Lebih tinggi — butuh bukti kemauan membayar & kepercayaan HR", "Higher — needs proof of willingness to pay & HR trust"),
  },
  {
    label: L("Kebutuhan operasional", "Operational needs"),
    events: L("Dukungan _organizer_ saat puncak acara", "Organizer support during event peaks"),
    interview: L("Kualitas penilaian, privasi data, _onboarding_ HR", "Assessment quality, data privacy, HR onboarding"),
  },
  {
    label: L("Model pendapatan", "Revenue model"),
    events: L("Biaya platform per acara/transaksi, promosi terkelola, langganan _organizer_", "Platform fee per event/transaction, managed promotion, organizer subscription"),
    interview: L("_Pilot_, lalu langganan bulanan bertingkat", "Pilots, then tiered monthly subscriptions"),
  },
  {
    label: L("Pertimbangan risiko", "Risk considerations"),
    events: L("Margin per _event_ & musiman", "Per-event margins & seasonality"),
    interview: L("Keadilan penilaian, regulasi data, siklus penjualan B2B", "Assessment fairness, data regulation, B2B sales cycles"),
  },
];
