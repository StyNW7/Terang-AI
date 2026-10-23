import type {
  EventItem,
  EventTemplate,
  Participant,
  Submission,
  Transaction,
  JudgingCriterion,
} from "@/types/events";
import { L, type Bilingual, type Txt } from "@/lib/i18n-core";

/* All records below are FICTIONAL demo data (synthetic-demo). */

const bccCriteria: JudgingCriterion[] = [
  { id: "c1", name: L("Analisis Masalah", "Problem Analysis"), weight: 30, description: L("Ketajaman identifikasi akar masalah & data pendukung.", "Sharpness of root-cause identification & supporting data.") },
  { id: "c2", name: L("Kelayakan Solusi", "Solution Feasibility"), weight: 30, description: L("Solusi realistis, terukur, dan sesuai kapasitas.", "A realistic, measurable solution that fits capacity.") },
  { id: "c3", name: L("Dampak Finansial", "Financial Impact"), weight: 20, description: L("Logika proyeksi & asumsi finansial.", "Logic of projections & financial assumptions.") },
  { id: "c4", name: L("Presentasi", "Presentation"), weight: 20, description: L("Struktur, kejelasan, dan kemampuan menjawab.", "Structure, clarity and ability to answer questions.") },
];

export const SEED_EVENTS: EventItem[] = [
  {
    id: "ev-nbcc",
    name: "Nusantara Business Case Challenge 2026",
    organizer: "Himpunan Mahasiswa Manajemen Univ. Cakrawala Nusantara",
    category: "kompetisi",
    status: "judging",
    location: "Jakarta",
    mode: "hybrid",
    startDate: "2026-10-03",
    endDate: "2026-11-14",
    registrationClose: "2026-10-01",
    fee: 150_000,
    quota: 120,
    registered: 108,
    submissions: 64,
    views: 4_820,
    description: L(
      "Kompetisi studi kasus bisnis tingkat nasional untuk mahasiswa S1 dengan babak penyisihan _online_ dan final _offline_.",
      "A national business case competition for undergraduates, with online preliminary rounds and an offline final.",
    ),
    stages: [
      { id: "s1", name: L("Registrasi tim", "Team registration"), date: "2026-09-01", type: "registrasi" },
      { id: "s2", name: L("Submisi proposal", "Proposal submission"), date: "2026-10-10", type: "submisi" },
      { id: "s3", name: L("Penjurian penyisihan", "Preliminary judging"), date: "2026-10-24", type: "penjurian" },
      { id: "s4", name: L("Pengumuman finalis", "Finalist announcement"), date: "2026-10-31", type: "pengumuman" },
      { id: "s5", name: "Grand final", date: "2026-11-14", type: "acara" },
    ],
    criteria: bccCriteria,
    teamBased: true,
    createdFrom: "seed",
  },
  {
    id: "ev-dms",
    name: "Data Muda Summit 2026",
    organizer: "Komunitas Data Muda Bandung",
    category: "konferensi",
    status: "registration",
    location: "Bandung",
    mode: "offline",
    startDate: "2026-11-21",
    endDate: "2026-11-22",
    registrationClose: "2026-11-15",
    fee: 85_000,
    quota: 400,
    registered: 263,
    submissions: 0,
    views: 6_140,
    description: L(
      "Konferensi dua hari tentang data, AI, dan karier analitik untuk mahasiswa dan profesional muda.",
      "A two-day conference on data, AI and analytics careers for students and young professionals.",
    ),
    stages: [
      { id: "s1", name: L("Registrasi peserta", "Participant registration"), date: "2026-10-01", type: "registrasi" },
      { id: "s2", name: L("Hari konferensi", "Conference day"), date: "2026-11-21", type: "acara" },
    ],
    criteria: [],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-uiux",
    name: L("Workshop UI/UX untuk Pemula", "UI/UX Workshop for Beginners"),
    organizer: "Institut Teknologi Lintas Samudra",
    category: "workshop",
    status: "completed",
    location: "Online",
    mode: "online",
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    registrationClose: "2026-09-10",
    fee: 50_000,
    quota: 150,
    registered: 142,
    submissions: 118,
    views: 2_310,
    description: L(
      "_Workshop_ praktik desain antarmuka dengan tugas akhir _mini-project_ dan sertifikat.",
      "A hands-on interface-design workshop with a final mini-project and a certificate.",
    ),
    stages: [
      { id: "s1", name: L("Registrasi", "Registration"), date: "2026-08-20", type: "registrasi" },
      { id: "s2", name: L("Sesi _workshop_", "Workshop session"), date: "2026-09-12", type: "acara" },
      { id: "s3", name: L("Submisi _mini-project_", "Mini-project submission"), date: "2026-09-19", type: "submisi" },
    ],
    criteria: [],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-karier",
    name: L("Seminar Karier: Siap Kerja di Era AI", "Career Seminar: Job-Ready in the AI Era"),
    organizer: "Pusat Karier Universitas Arunika",
    category: "seminar",
    status: "registration",
    location: "Surabaya",
    mode: "hybrid",
    startDate: "2026-11-08",
    endDate: "2026-11-08",
    registrationClose: "2026-11-06",
    fee: 0,
    quota: 300,
    registered: 187,
    submissions: 0,
    views: 3_960,
    description: L(
      "Seminar persiapan karier bersama praktisi HR tentang wawancara, portofolio, dan literasi AI.",
      "A career-preparation seminar with HR practitioners on interviews, portfolios and AI literacy.",
    ),
    stages: [
      { id: "s1", name: L("Registrasi", "Registration"), date: "2026-10-05", type: "registrasi" },
      { id: "s2", name: L("Hari seminar", "Seminar day"), date: "2026-11-08", type: "acara" },
    ],
    criteria: [],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-esai",
    name: L("Lomba Esai Inovasi Pendidikan", "Education Innovation Essay Competition"),
    organizer: "Asosiasi Pengajar Bisnis Digital",
    category: "kompetisi",
    status: "registration",
    location: "Online",
    mode: "online",
    startDate: "2026-11-01",
    endDate: "2026-12-05",
    registrationClose: "2026-11-20",
    fee: 75_000,
    quota: 250,
    registered: 96,
    submissions: 12,
    views: 2_870,
    description: L(
      "Lomba esai individu tentang inovasi pendidikan berbasis teknologi untuk mahasiswa dan guru muda.",
      "An individual essay competition on technology-driven education innovation for students and young teachers.",
    ),
    stages: [
      { id: "s1", name: L("Registrasi", "Registration"), date: "2026-10-15", type: "registrasi" },
      { id: "s2", name: L("Submisi esai", "Essay submission"), date: "2026-11-20", type: "submisi" },
      { id: "s3", name: L("Penjurian", "Judging"), date: "2026-11-28", type: "penjurian" },
      { id: "s4", name: L("Pengumuman", "Announcement"), date: "2026-12-05", type: "pengumuman" },
    ],
    criteria: [
      { id: "c1", name: L("Orisinalitas", "Originality"), weight: 35, description: L("Kebaruan ide.", "Novelty of the idea.") },
      { id: "c2", name: L("Argumentasi", "Argumentation"), weight: 35, description: L("Kekuatan argumen & referensi.", "Strength of arguments & references.") },
      { id: "c3", name: L("Bahasa", "Language"), weight: 30, description: L("Kejelasan & tata bahasa.", "Clarity & grammar.") },
    ],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-riset",
    name: L("Konferensi Riset Mahasiswa Teknologi", "Student Technology Research Conference"),
    organizer: "Institut Teknologi Lintas Samudra",
    category: "konferensi",
    status: "draft",
    location: "Makassar",
    mode: "offline",
    startDate: "2027-02-18",
    endDate: "2027-02-19",
    registrationClose: "2027-01-31",
    fee: 200_000,
    quota: 180,
    registered: 0,
    submissions: 0,
    views: 0,
    description: L(
      "Konferensi _call-for-paper_ untuk riset mahasiswa bidang teknologi terapan.",
      "A call-for-papers conference for student research in applied technology.",
    ),
    stages: [
      { id: "s1", name: "Call for paper", date: "2026-12-01", type: "submisi" },
      { id: "s2", name: L("_Review paper_", "Paper review"), date: "2027-01-15", type: "penjurian" },
      { id: "s3", name: L("Konferensi", "Conference"), date: "2027-02-18", type: "acara" },
    ],
    criteria: [
      { id: "c1", name: L("Kontribusi ilmiah", "Scientific contribution"), weight: 40, description: L("Kebaruan & signifikansi.", "Novelty & significance.") },
      { id: "c2", name: L("Metodologi", "Methodology"), weight: 40, description: L("Ketepatan metode.", "Appropriateness of methods.") },
      { id: "c3", name: L("Penulisan", "Writing"), weight: 20, description: L("Struktur & kejelasan.", "Structure & clarity.") },
    ],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-bootcamp",
    name: L("Bootcamp Analisis Data Weekend", "Weekend Data Analysis Bootcamp"),
    organizer: "Komunitas Data Muda Bandung",
    category: "workshop",
    status: "published",
    location: "Online",
    mode: "online",
    startDate: "2026-12-05",
    endDate: "2026-12-13",
    registrationClose: "2026-12-01",
    fee: 125_000,
    quota: 100,
    registered: 41,
    submissions: 0,
    views: 1_540,
    description: L(
      "_Bootcamp_ dua akhir pekan: SQL, _spreadsheet_ lanjutan, dan visualisasi data.",
      "A two-weekend bootcamp: SQL, advanced spreadsheets and data visualisation.",
    ),
    stages: [
      { id: "s1", name: L("Registrasi", "Registration"), date: "2026-11-01", type: "registrasi" },
      { id: "s2", name: L("Pekan 1", "Week 1"), date: "2026-12-05", type: "acara" },
      { id: "s3", name: L("Pekan 2 & _capstone_", "Week 2 & capstone"), date: "2026-12-12", type: "submisi" },
    ],
    criteria: [],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-hack25",
    name: L("Hackathon Smart City Lintas Kampus 2025", "Inter-Campus Smart City Hackathon 2025"),
    organizer: "Himpunan Mahasiswa Manajemen Univ. Cakrawala Nusantara",
    category: "kompetisi",
    status: "completed",
    location: "Yogyakarta",
    mode: "offline",
    startDate: "2025-11-15",
    endDate: "2025-11-16",
    registrationClose: "2025-11-01",
    fee: 100_000,
    quota: 60,
    registered: 58,
    submissions: 41,
    views: 3_120,
    description: L(
      "_Hackathon_ 36 jam untuk solusi kota cerdas — edisi sebelumnya yang dapat diulang.",
      "A 36-hour hackathon for smart-city solutions — a previous edition that can be repeated.",
    ),
    stages: [
      { id: "s1", name: L("Registrasi tim", "Team registration"), date: "2025-10-01", type: "registrasi" },
      { id: "s2", name: "Hacking day", date: "2025-11-15", type: "acara" },
      { id: "s3", name: L("Penjurian demo", "Demo judging"), date: "2025-11-16", type: "penjurian" },
    ],
    criteria: [
      { id: "c1", name: L("Inovasi", "Innovation"), weight: 30, description: L("Kebaruan solusi.", "Novelty of the solution.") },
      { id: "c2", name: L("Teknis", "Technical"), weight: 30, description: L("Kualitas implementasi.", "Implementation quality.") },
      { id: "c3", name: L("Dampak", "Impact"), weight: 25, description: L("Potensi dampak bagi kota.", "Potential impact on the city.") },
      { id: "c4", name: "Pitching", weight: 15, description: L("Kualitas demo & _pitch_.", "Quality of the demo & pitch.") },
    ],
    teamBased: true,
    createdFrom: "seed",
  },
];

const FIRST = ["Alya", "Bima", "Citra", "Dimas", "Eka", "Farhan", "Gita", "Hana", "Irfan", "Jihan", "Kevin", "Laras", "Made", "Nadia", "Oki", "Putri", "Raka", "Salsa", "Tegar", "Umi", "Vino", "Wulan", "Yoga", "Zahra"];
const LAST = ["Pratama", "Saputri", "Wijaya", "Nugroho", "Lestari", "Hidayat", "Siregar", "Kusuma", "Ramadhan", "Anggraini", "Putra", "Maharani"];
const INSTITUTIONS = ["Univ. Cakrawala Nusantara", "Institut Teknologi Lintas Samudra", "Universitas Arunika", "Politeknik Bahari Cendekia", "Univ. Nusa Harapan", "STIE Pelita Muda"];
const SOURCES: Participant["source"][] = ["Instagram", "Kampus", "Referral", "Website", "LinkedIn"];
const STATUSES: Participant["status"][] = ["lunas", "lunas", "terverifikasi", "menunggu-pembayaran", "lunas", "dibatalkan", "terverifikasi"];
const EVENT_IDS = ["ev-nbcc", "ev-nbcc", "ev-nbcc", "ev-dms", "ev-dms", "ev-karier", "ev-esai", "ev-uiux", "ev-bootcamp"];
const TEAMS = ["Tim Arunika", "Tim Lentera", "Tim Samudra", "Tim Garuda Analytica", "Tim Rasi", "Tim Nirmala", "Tim Kirana", "Tim Bentala"];

export const SEED_PARTICIPANTS: Participant[] = Array.from({ length: 36 }, (_, i) => {
  const name = `${FIRST[i % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`;
  const eventId = EVENT_IDS[i % EVENT_IDS.length];
  const day = 1 + ((i * 7) % 27);
  return {
    id: `pt-${i + 1}`,
    name,
    institution: INSTITUTIONS[(i * 3) % INSTITUTIONS.length],
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@contoh.ac.id`,
    eventId,
    team: eventId === "ev-nbcc" ? TEAMS[i % TEAMS.length] : undefined,
    status: STATUSES[i % STATUSES.length],
    registeredAt: `2026-${i % 2 === 0 ? "09" : "10"}-${String(day).padStart(2, "0")}`,
    source: SOURCES[(i * 2) % SOURCES.length],
  };
});

const SUB_TITLES: Bilingual[] = [
  L("Ekspansi UMKM Kopi Lokal ke Pasar Digital", "Taking Local Coffee SMEs into Digital Markets"),
  L("Optimasi Rantai Pasok Retail Modern", "Optimising the Modern Retail Supply Chain"),
  L("Strategi Retensi Pengguna Aplikasi Fintech", "User-Retention Strategy for a Fintech App"),
  L("Model Bisnis Sirkular untuk Fashion Lokal", "A Circular Business Model for Local Fashion"),
  L("Digitalisasi Layanan Koperasi Desa", "Digitising Village Cooperative Services"),
  L("Penetrasi Pasar EdTech di Kota Tier-2", "EdTech Market Penetration in Tier-2 Cities"),
  L("Efisiensi Biaya Logistik Last-Mile", "Cutting Last-Mile Logistics Costs"),
  L("Strategi Harga Dinamis Transportasi Online", "Dynamic Pricing Strategy for Ride-Hailing"),
];
const REVIEWERS: Bilingual[] = [
  L("Dr. Ratna Wibisono (fiktif)", "Dr. Ratna Wibisono (fictional)"),
  L("Andi Kurniawan, MBA (fiktif)", "Andi Kurniawan, MBA (fictional)"),
  L("Sari Dewanti (fiktif)", "Sari Dewanti (fictional)"),
];

export const SEED_SUBMISSIONS: Submission[] = TEAMS.map((team, i): Submission => {
  const graded = i < 5;
  const base = 62 + ((i * 13) % 30);
  return {
    id: `sb-${i + 1}`,
    eventId: "ev-nbcc",
    team,
    title: SUB_TITLES[i],
    submittedAt: `2026-10-${String(4 + i).padStart(2, "0")}`,
    reviewer: REVIEWERS[i % REVIEWERS.length],
    status: graded ? (i < 2 ? "final" : "dinilai") : "belum-dinilai",
    scores: graded
      ? { c1: Math.min(98, base + 6), c2: Math.min(97, base + 2), c3: Math.max(50, base - 4), c4: Math.min(96, base + 4) }
      : {},
  };
});

export const SEED_TRANSACTIONS: Transaction[] = Array.from({ length: 16 }, (_, i) => {
  const ev = SEED_EVENTS[[0, 1, 4, 2, 6, 0, 1][i % 7]];
  const methods: Transaction["method"][] = ["QRIS", "Virtual Account", "E-Wallet", "Kartu"];
  return {
    id: `tx-${1040 + i}`,
    eventId: ev.id,
    payer: `${FIRST[(i * 3) % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`,
    amount: ev.fee,
    method: methods[i % methods.length],
    date: `2026-10-${String(20 - (i % 18)).padStart(2, "0")}`,
    status: i % 9 === 4 ? "menunggu" : i % 11 === 7 ? "refund" : "berhasil",
  };
});

/** Weekly activity for the organizer dashboard (synthetic). */
export const WEEKLY_ACTIVITY: { week: Bilingual; registrasi: number; submisi: number; kunjungan: number }[] = [
  { week: L("M1 Sep", "W1 Sep"), registrasi: 34, submisi: 0, kunjungan: 820 },
  { week: L("M2 Sep", "W2 Sep"), registrasi: 51, submisi: 4, kunjungan: 1_140 },
  { week: L("M3 Sep", "W3 Sep"), registrasi: 66, submisi: 18, kunjungan: 1_320 },
  { week: L("M4 Sep", "W4 Sep"), registrasi: 58, submisi: 41, kunjungan: 1_180 },
  { week: L("M1 Okt", "W1 Oct"), registrasi: 72, submisi: 52, kunjungan: 1_610 },
  { week: L("M2 Okt", "W2 Oct"), registrasi: 89, submisi: 38, kunjungan: 1_930 },
  { week: L("M3 Okt", "W3 Oct"), registrasi: 77, submisi: 26, kunjungan: 1_720 },
];

export const SOURCE_LABEL: Record<Participant["source"], Txt> = {
  Instagram: "Instagram",
  Kampus: L("Kampus", "Campus"),
  Referral: "Referral",
  Website: "Website",
  LinkedIn: "LinkedIn",
};

export const SOURCE_CONVERSION: { source: Participant["source"]; kunjungan: number; registrasi: number }[] = [
  { source: "Kampus", kunjungan: 3_400, registrasi: 312 },
  { source: "Instagram", kunjungan: 5_900, registrasi: 248 },
  { source: "Referral", kunjungan: 1_250, registrasi: 171 },
  { source: "Website", kunjungan: 2_800, registrasi: 132 },
  { source: "LinkedIn", kunjungan: 1_100, registrasi: 63 },
];

export const REPEAT_COMPARISON: { metric: Bilingual; edisi2025: number; edisi2026: number }[] = [
  { metric: L("Registrasi tim", "Team registrations"), edisi2025: 58, edisi2026: 108 },
  { metric: L("Submisi", "Submissions"), edisi2025: 41, edisi2026: 64 },
  { metric: L("Juri aktif", "Active judges"), edisi2025: 4, edisi2026: 6 },
  { metric: L("Hari _setup_", "Setup days"), edisi2025: 14, edisi2026: 5 },
];

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: "tpl-bcc",
    name: "Business Case Competition",
    category: "kompetisi",
    description: L("Registrasi tim, submisi proposal, penjurian berbobot, dan _grand final_.", "Team registration, proposal submission, weighted judging and a grand final."),
    icon: "trophy",
    defaults: {
      durationDays: 45,
      fee: 150_000,
      quota: 120,
      teamBased: true,
      mode: "hybrid",
      stages: [
        { name: L("Registrasi tim", "Team registration"), type: "registrasi", offsetDays: 0 },
        { name: L("Submisi proposal", "Proposal submission"), type: "submisi", offsetDays: 21 },
        { name: L("Penjurian penyisihan", "Preliminary judging"), type: "penjurian", offsetDays: 30 },
        { name: L("Pengumuman finalis", "Finalist announcement"), type: "pengumuman", offsetDays: 35 },
        { name: "Grand final", type: "acara", offsetDays: 45 },
      ],
      criteria: [
        { name: L("Analisis Masalah", "Problem Analysis"), weight: 30, description: L("Ketajaman identifikasi masalah.", "Sharpness of problem identification.") },
        { name: L("Kelayakan Solusi", "Solution Feasibility"), weight: 30, description: L("Solusi realistis & terukur.", "A realistic & measurable solution.") },
        { name: L("Dampak Finansial", "Financial Impact"), weight: 20, description: L("Logika finansial.", "Financial logic.") },
        { name: L("Presentasi", "Presentation"), weight: 20, description: L("Kejelasan & tanya jawab.", "Clarity & Q&A.") },
      ],
      tasks: [L("Undang 6 juri", "Invite 6 judges"), L("Siapkan _guidebook_", "Prepare the guidebook"), L("Atur rubrik penyisihan", "Set up the preliminary rubric"), L("Siapkan _venue_ final", "Prepare the final venue")],
    },
  },
  {
    id: "tpl-conf",
    name: "Academic Conference",
    category: "konferensi",
    description: L("_Call for paper_, _review_ sejawat, dan hari konferensi.", "Call for papers, peer review and the conference day."),
    icon: "presentation",
    defaults: {
      durationDays: 75,
      fee: 200_000,
      quota: 200,
      teamBased: false,
      mode: "offline",
      stages: [
        { name: "Call for paper", type: "submisi", offsetDays: 0 },
        { name: L("_Review paper_", "Paper review"), type: "penjurian", offsetDays: 40 },
        { name: L("Pengumuman penerimaan", "Acceptance announcement"), type: "pengumuman", offsetDays: 55 },
        { name: L("Hari konferensi", "Conference day"), type: "acara", offsetDays: 75 },
      ],
      criteria: [
        { name: L("Kontribusi ilmiah", "Scientific contribution"), weight: 40, description: L("Kebaruan & signifikansi.", "Novelty & significance.") },
        { name: L("Metodologi", "Methodology"), weight: 40, description: L("Ketepatan metode.", "Appropriateness of methods.") },
        { name: L("Penulisan", "Writing"), weight: 20, description: L("Struktur & kejelasan.", "Structure & clarity.") },
      ],
      tasks: [L("Bentuk komite _reviewer_", "Form the reviewer committee"), L("Publikasikan _template paper_", "Publish the paper template"), L("Atur sesi paralel", "Arrange parallel sessions")],
    },
  },
  {
    id: "tpl-workshop",
    name: "Workshop",
    category: "workshop",
    description: L("Registrasi peserta, sesi praktik, tugas akhir, dan sertifikat.", "Participant registration, hands-on sessions, a final assignment and certificates."),
    icon: "wrench",
    defaults: {
      durationDays: 14,
      fee: 75_000,
      quota: 100,
      teamBased: false,
      mode: "online",
      stages: [
        { name: L("Registrasi", "Registration"), type: "registrasi", offsetDays: 0 },
        { name: L("Sesi _workshop_", "Workshop session"), type: "acara", offsetDays: 10 },
        { name: L("Submisi tugas akhir", "Final assignment submission"), type: "submisi", offsetDays: 14 },
      ],
      criteria: [],
      tasks: [L("Siapkan materi & tautan kelas", "Prepare materials & class links"), L("Kirim pengingat H-1", "Send a reminder one day before"), L("Terbitkan sertifikat", "Issue certificates")],
    },
  },
  {
    id: "tpl-seminar",
    name: "Professional Seminar",
    category: "seminar",
    description: L("Registrasi cepat, pengingat, dan presensi peserta.", "Quick registration, reminders and attendance tracking."),
    icon: "mic",
    defaults: {
      durationDays: 21,
      fee: 0,
      quota: 300,
      teamBased: false,
      mode: "hybrid",
      stages: [
        { name: L("Registrasi", "Registration"), type: "registrasi", offsetDays: 0 },
        { name: L("Hari seminar", "Seminar day"), type: "acara", offsetDays: 21 },
      ],
      criteria: [],
      tasks: [L("Konfirmasi pembicara", "Confirm speakers"), L("Siapkan formulir presensi", "Prepare the attendance form"), L("Kirim materi pasca-acara", "Send post-event materials")],
    },
  },
];

export const CATEGORY_LABEL: Record<EventItem["category"], Bilingual> = {
  kompetisi: L("Kompetisi", "Competition"),
  konferensi: L("Konferensi", "Conference"),
  workshop: L("_Workshop_", "Workshop"),
  seminar: L("Seminar", "Seminar"),
};

export const STATUS_LABEL: Record<EventItem["status"], Bilingual> = {
  draft: L("_Draft_", "Draft"),
  published: L("Dipublikasikan", "Published"),
  registration: L("Registrasi dibuka", "Registration open"),
  judging: L("Penjurian", "Judging"),
  completed: L("Selesai", "Completed"),
};

/** Platform fee used for the finance preview — illustrative assumption. */
export const PLATFORM_FEE_RATE = 0.05;
export const PAYMENT_FEE_FLAT = 4_000;
