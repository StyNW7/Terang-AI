import type {
  EventItem,
  EventTemplate,
  Participant,
  Submission,
  Transaction,
  JudgingCriterion,
} from "@/types/events";

/* All records below are FICTIONAL demo data (synthetic-demo). */

const bccCriteria: JudgingCriterion[] = [
  { id: "c1", name: "Analisis Masalah", weight: 30, description: "Ketajaman identifikasi akar masalah & data pendukung." },
  { id: "c2", name: "Kelayakan Solusi", weight: 30, description: "Solusi realistis, terukur, dan sesuai kapasitas." },
  { id: "c3", name: "Dampak Finansial", weight: 20, description: "Logika proyeksi & asumsi finansial." },
  { id: "c4", name: "Presentasi", weight: 20, description: "Struktur, kejelasan, dan kemampuan menjawab." },
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
    description: "Kompetisi studi kasus bisnis tingkat nasional untuk mahasiswa S1 dengan babak penyisihan online dan final offline.",
    stages: [
      { id: "s1", name: "Registrasi tim", date: "2026-09-01", type: "registrasi" },
      { id: "s2", name: "Submisi proposal", date: "2026-10-10", type: "submisi" },
      { id: "s3", name: "Penjurian penyisihan", date: "2026-10-24", type: "penjurian" },
      { id: "s4", name: "Pengumuman finalis", date: "2026-10-31", type: "pengumuman" },
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
    description: "Konferensi dua hari tentang data, AI, dan karier analitik untuk mahasiswa dan profesional muda.",
    stages: [
      { id: "s1", name: "Registrasi peserta", date: "2026-10-01", type: "registrasi" },
      { id: "s2", name: "Hari konferensi", date: "2026-11-21", type: "acara" },
    ],
    criteria: [],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-uiux",
    name: "Workshop UI/UX untuk Pemula",
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
    description: "Workshop praktik desain antarmuka dengan tugas akhir mini-project dan sertifikat.",
    stages: [
      { id: "s1", name: "Registrasi", date: "2026-08-20", type: "registrasi" },
      { id: "s2", name: "Sesi workshop", date: "2026-09-12", type: "acara" },
      { id: "s3", name: "Submisi mini-project", date: "2026-09-19", type: "submisi" },
    ],
    criteria: [],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-karier",
    name: "Seminar Karier: Siap Kerja di Era AI",
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
    description: "Seminar persiapan karier bersama praktisi HR tentang wawancara, portofolio, dan literasi AI.",
    stages: [
      { id: "s1", name: "Registrasi", date: "2026-10-05", type: "registrasi" },
      { id: "s2", name: "Hari seminar", date: "2026-11-08", type: "acara" },
    ],
    criteria: [],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-esai",
    name: "Lomba Esai Inovasi Pendidikan",
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
    description: "Lomba esai individu tentang inovasi pendidikan berbasis teknologi untuk mahasiswa dan guru muda.",
    stages: [
      { id: "s1", name: "Registrasi", date: "2026-10-15", type: "registrasi" },
      { id: "s2", name: "Submisi esai", date: "2026-11-20", type: "submisi" },
      { id: "s3", name: "Penjurian", date: "2026-11-28", type: "penjurian" },
      { id: "s4", name: "Pengumuman", date: "2026-12-05", type: "pengumuman" },
    ],
    criteria: [
      { id: "c1", name: "Orisinalitas", weight: 35, description: "Kebaruan ide." },
      { id: "c2", name: "Argumentasi", weight: 35, description: "Kekuatan argumen & referensi." },
      { id: "c3", name: "Bahasa", weight: 30, description: "Kejelasan & tata bahasa." },
    ],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-riset",
    name: "Konferensi Riset Mahasiswa Teknologi",
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
    description: "Konferensi call-for-paper untuk riset mahasiswa bidang teknologi terapan.",
    stages: [
      { id: "s1", name: "Call for paper", date: "2026-12-01", type: "submisi" },
      { id: "s2", name: "Review paper", date: "2027-01-15", type: "penjurian" },
      { id: "s3", name: "Konferensi", date: "2027-02-18", type: "acara" },
    ],
    criteria: [
      { id: "c1", name: "Kontribusi ilmiah", weight: 40, description: "Kebaruan & signifikansi." },
      { id: "c2", name: "Metodologi", weight: 40, description: "Ketepatan metode." },
      { id: "c3", name: "Penulisan", weight: 20, description: "Struktur & kejelasan." },
    ],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-bootcamp",
    name: "Bootcamp Analisis Data Weekend",
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
    description: "Bootcamp dua akhir pekan: SQL, spreadsheet lanjutan, dan visualisasi data.",
    stages: [
      { id: "s1", name: "Registrasi", date: "2026-11-01", type: "registrasi" },
      { id: "s2", name: "Pekan 1", date: "2026-12-05", type: "acara" },
      { id: "s3", name: "Pekan 2 & capstone", date: "2026-12-12", type: "submisi" },
    ],
    criteria: [],
    teamBased: false,
    createdFrom: "seed",
  },
  {
    id: "ev-hack25",
    name: "Hackathon Smart City Lintas Kampus 2025",
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
    description: "Hackathon 36 jam untuk solusi kota cerdas — edisi sebelumnya yang dapat diulang.",
    stages: [
      { id: "s1", name: "Registrasi tim", date: "2025-10-01", type: "registrasi" },
      { id: "s2", name: "Hacking day", date: "2025-11-15", type: "acara" },
      { id: "s3", name: "Penjurian demo", date: "2025-11-16", type: "penjurian" },
    ],
    criteria: [
      { id: "c1", name: "Inovasi", weight: 30, description: "Kebaruan solusi." },
      { id: "c2", name: "Teknis", weight: 30, description: "Kualitas implementasi." },
      { id: "c3", name: "Dampak", weight: 25, description: "Potensi dampak bagi kota." },
      { id: "c4", name: "Pitching", weight: 15, description: "Kualitas demo & pitch." },
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

const SUB_TITLES = [
  "Ekspansi UMKM Kopi Lokal ke Pasar Digital",
  "Optimasi Rantai Pasok Retail Modern",
  "Strategi Retensi Pengguna Aplikasi Fintech",
  "Model Bisnis Sirkular untuk Fashion Lokal",
  "Digitalisasi Layanan Koperasi Desa",
  "Penetrasi Pasar EdTech di Kota Tier-2",
  "Efisiensi Biaya Logistik Last-Mile",
  "Strategi Harga Dinamis Transportasi Online",
];
const REVIEWERS = ["Dr. Ratna Wibisono (fiktif)", "Andi Kurniawan, MBA (fiktif)", "Sari Dewanti (fiktif)"];

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
export const WEEKLY_ACTIVITY = [
  { week: "M1 Sep", registrasi: 34, submisi: 0, kunjungan: 820 },
  { week: "M2 Sep", registrasi: 51, submisi: 4, kunjungan: 1_140 },
  { week: "M3 Sep", registrasi: 66, submisi: 18, kunjungan: 1_320 },
  { week: "M4 Sep", registrasi: 58, submisi: 41, kunjungan: 1_180 },
  { week: "M1 Okt", registrasi: 72, submisi: 52, kunjungan: 1_610 },
  { week: "M2 Okt", registrasi: 89, submisi: 38, kunjungan: 1_930 },
  { week: "M3 Okt", registrasi: 77, submisi: 26, kunjungan: 1_720 },
];

export const SOURCE_CONVERSION = [
  { source: "Kampus", kunjungan: 3_400, registrasi: 312 },
  { source: "Instagram", kunjungan: 5_900, registrasi: 248 },
  { source: "Referral", kunjungan: 1_250, registrasi: 171 },
  { source: "Website", kunjungan: 2_800, registrasi: 132 },
  { source: "LinkedIn", kunjungan: 1_100, registrasi: 63 },
];

export const REPEAT_COMPARISON = [
  { metric: "Registrasi tim", edisi2025: 58, edisi2026: 108 },
  { metric: "Submisi", edisi2025: 41, edisi2026: 64 },
  { metric: "Juri aktif", edisi2025: 4, edisi2026: 6 },
  { metric: "Hari setup", edisi2025: 14, edisi2026: 5 },
];

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: "tpl-bcc",
    name: "Business Case Competition",
    category: "kompetisi",
    description: "Registrasi tim, submisi proposal, penjurian berbobot, dan grand final.",
    icon: "trophy",
    defaults: {
      durationDays: 45,
      fee: 150_000,
      quota: 120,
      teamBased: true,
      mode: "hybrid",
      stages: [
        { name: "Registrasi tim", type: "registrasi", offsetDays: 0 },
        { name: "Submisi proposal", type: "submisi", offsetDays: 21 },
        { name: "Penjurian penyisihan", type: "penjurian", offsetDays: 30 },
        { name: "Pengumuman finalis", type: "pengumuman", offsetDays: 35 },
        { name: "Grand final", type: "acara", offsetDays: 45 },
      ],
      criteria: [
        { name: "Analisis Masalah", weight: 30, description: "Ketajaman identifikasi masalah." },
        { name: "Kelayakan Solusi", weight: 30, description: "Solusi realistis & terukur." },
        { name: "Dampak Finansial", weight: 20, description: "Logika finansial." },
        { name: "Presentasi", weight: 20, description: "Kejelasan & Q&A." },
      ],
      tasks: ["Undang 6 juri", "Siapkan guidebook", "Atur rubrik penyisihan", "Siapkan venue final"],
    },
  },
  {
    id: "tpl-conf",
    name: "Academic Conference",
    category: "konferensi",
    description: "Call for paper, review sejawat, dan hari konferensi.",
    icon: "presentation",
    defaults: {
      durationDays: 75,
      fee: 200_000,
      quota: 200,
      teamBased: false,
      mode: "offline",
      stages: [
        { name: "Call for paper", type: "submisi", offsetDays: 0 },
        { name: "Review paper", type: "penjurian", offsetDays: 40 },
        { name: "Pengumuman penerimaan", type: "pengumuman", offsetDays: 55 },
        { name: "Hari konferensi", type: "acara", offsetDays: 75 },
      ],
      criteria: [
        { name: "Kontribusi ilmiah", weight: 40, description: "Kebaruan & signifikansi." },
        { name: "Metodologi", weight: 40, description: "Ketepatan metode." },
        { name: "Penulisan", weight: 20, description: "Struktur & kejelasan." },
      ],
      tasks: ["Bentuk komite reviewer", "Publikasikan template paper", "Atur sesi paralel"],
    },
  },
  {
    id: "tpl-workshop",
    name: "Workshop",
    category: "workshop",
    description: "Registrasi peserta, sesi praktik, tugas akhir, dan sertifikat.",
    icon: "wrench",
    defaults: {
      durationDays: 14,
      fee: 75_000,
      quota: 100,
      teamBased: false,
      mode: "online",
      stages: [
        { name: "Registrasi", type: "registrasi", offsetDays: 0 },
        { name: "Sesi workshop", type: "acara", offsetDays: 10 },
        { name: "Submisi tugas akhir", type: "submisi", offsetDays: 14 },
      ],
      criteria: [],
      tasks: ["Siapkan materi & tautan kelas", "Kirim pengingat H-1", "Terbitkan sertifikat"],
    },
  },
  {
    id: "tpl-seminar",
    name: "Professional Seminar",
    category: "seminar",
    description: "Registrasi cepat, pengingat, dan presensi peserta.",
    icon: "mic",
    defaults: {
      durationDays: 21,
      fee: 0,
      quota: 300,
      teamBased: false,
      mode: "hybrid",
      stages: [
        { name: "Registrasi", type: "registrasi", offsetDays: 0 },
        { name: "Hari seminar", type: "acara", offsetDays: 21 },
      ],
      criteria: [],
      tasks: ["Konfirmasi pembicara", "Siapkan form presensi", "Kirim materi pasca-acara"],
    },
  },
];

export const CATEGORY_LABEL: Record<EventItem["category"], string> = {
  kompetisi: "Kompetisi",
  konferensi: "Konferensi",
  workshop: "Workshop",
  seminar: "Seminar",
};

export const STATUS_LABEL: Record<EventItem["status"], string> = {
  draft: "Draft",
  published: "Dipublikasikan",
  registration: "Registrasi dibuka",
  judging: "Penjurian",
  completed: "Selesai",
};

/** Platform fee used for the finance preview — illustrative assumption. */
export const PLATFORM_FEE_RATE = 0.05;
export const PAYMENT_FEE_FLAT = 4_000;
