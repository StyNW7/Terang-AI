import type { EvidenceClassification } from "@/types/common";

export const KEY_QUESTION =
  "Bagaimana Terang AI dapat mengoptimalkan prioritas pengembangan produk, alokasi sumber daya, dan penetrasi pasar untuk mencapai pertumbuhan B2B yang berkelanjutan?";

export const CORE_INSIGHT =
  "Tantangan Terang AI bukan sekadar memilih jumlah produk yang dikembangkan, melainkan bagaimana peluang pasar dapat dikonversi menjadi pertumbuhan bisnis yang terukur melalui pemanfaatan sumber daya secara optimal.";

export interface Challenge {
  id: string;
  number: string;
  title: string;
  english: string;
  summary: string;
  drivers: string[];
  implications: string[];
  evidence: EvidenceClassification;
  icon: "users" | "target" | "layers";
}

export const CHALLENGES: Challenge[] = [
  {
    id: "capacity",
    number: "01",
    title: "Keterbatasan Sumber Daya",
    english: "Resource Capacity Gap",
    summary: "Struktur 7 personel dalam studi kasus dan tuntutan efisiensi anggaran menuntut prioritas investasi yang realistis.",
    drivers: [
      "Hanya 3 personel Product untuk pengembangan seluruh fitur",
      "2 personel Strategy & Operations untuk akuisisi, onboarding & dukungan",
      "Kapasitas CEO & CPO tidak dapat diperlakukan sebagai jam engineering",
      "Kebutuhan efisiensi biaya akuisisi & operasional",
    ],
    implications: [
      "Setiap inisiatif baru mengurangi kapasitas inisiatif lain",
      "Risiko kualitas & keterlambatan bila beban melebihi kapasitas",
      "Perekrutan besar-besaran bukan asumsi yang realistis",
    ],
    evidence: "internal-restricted-context",
    icon: "users",
  },
  {
    id: "validation",
    number: "02",
    title: "Tantangan Validasi Pasar",
    english: "Product–Market Validation Gap",
    summary: "Kedua produk memiliki pembeli, kriteria pembelian, dan proposisi nilai yang berbeda — bukti adopsi perlu dibandingkan.",
    drivers: [
      "Terang Events → penyelenggara acara; AI Candidate Interview → tim HR",
      "Kemauan membayar & siklus penjualan berbeda",
      "Kesiapan enterprise Interview belum dapat diasumsikan dari simulator B2C",
      "Potensi monetisasi & kelayakan komersial perlu diuji",
    ],
    implications: [
      "Investasi tanpa bukti berisiko salah sasaran",
      "Dibutuhkan pilot & metrik yang jelas sebelum scaling",
      "Keputusan harus berbasis bukti, bukan intuisi",
    ],
    evidence: "strategic-proposal",
    icon: "target",
  },
  {
    id: "execution",
    number: "03",
    title: "Kompleksitas Eksekusi Bisnis",
    english: "Portfolio Execution Complexity",
    summary: "Pengembangan fitur, akuisisi pelanggan, dan operasional kedua produk menuntut pendekatan yang berbeda.",
    drivers: [
      "Workflow & kebutuhan teknis produk yang berbeda",
      "Dua kanal penjualan & dua jenis dukungan pelanggan",
      "Koordinasi prioritas lintas produk",
      "Context switching dalam tim kecil",
    ],
    implications: [
      "Pengembangan paralel menambah beban kerja & biaya koordinasi",
      "Tanpa tata kelola, prioritas mudah bergeser",
      "Butuh mekanisme evaluasi & realokasi yang transparan",
    ],
    evidence: "strategic-proposal",
    icon: "layers",
  },
];

export interface Pillar {
  letter: string;
  key: string;
  name: string;
  purpose: string;
  program: string;
  highlights: string[];
  cta: { label: string; href: string };
}

export const ONE_STRATEGY = {
  name: "ONE Strategy",
  position: "PRO — Prioritaskan satu produk B2B",
  focus: "AI Candidate Interview",
  tagline: "One Product, Proven Growth.",
  shortTitle: "Focus to Grow",
  thesis:
    "Pusatkan pengembangan produk, validasi pelanggan, sumber daya akuisisi, dan investasi pada AI Candidate Interview. Bangun produk yang tepercaya, validasi kemauan membayar, lalu scale berdasarkan bukti.",
  eventsPolicy: "Terang Events dipertahankan dalam mode maintenance — layanan berjalan, tanpa pengembangan agresif.",
  pillars: [
    {
      letter: "O",
      key: "optimize",
      name: "Optimize Product Value",
      purpose: "Meningkatkan nilai, kualitas, dan kesiapan enterprise AI Candidate Interview.",
      program: "AI Interview Intelligence Suite",
      highlights: [
        "Role-Based Interview Builder",
        "Adaptive Structured Interview",
        "Evidence-Linked Assessment",
        "Recruiter Review Dashboard",
        "Responsible AI Controls",
      ],
      cta: { label: "Coba Simulasi Produk", href: "/dashboard/interview" },
    },
    {
      letter: "N",
      key: "navigate",
      name: "Navigate Market Growth",
      purpose: "Menjangkau pelanggan bisnis yang relevan dan membuktikan nilai komersial.",
      program: "Pilot-to-Paid Growth Engine",
      highlights: [
        "Outreach B2B via komunitas HR & LinkedIn",
        "Webinar HR Efficiency Clinic",
        "Demo produk enterprise",
        "Pilot HR terbatas & evaluasi ROI",
        "Konversi kontrak berbayar & renewal",
      ],
      cta: { label: "Lihat Funnel Pilot-to-Paid", href: "/strategies/one?pillar=navigate" },
    },
    {
      letter: "E",
      key: "evaluate",
      name: "Evaluate for Expansion",
      purpose: "Memastikan AI Candidate Interview siap tumbuh sebelum menambah komitmen sumber daya.",
      program: "ONE Growth Intelligence & Expansion Gate",
      highlights: ["Kualitas produk", "Traksi komersial", "Kontribusi finansial", "Kapasitas tim", "Kesiapan Responsible AI"],
      cta: { label: "Tinjau Kesiapan Ekspansi", href: "/strategies/one?pillar=evaluate" },
    },
  ] satisfies Pillar[],
};

export const ACE_STRATEGY = {
  name: "ACE Strategy",
  position: "KONTRA — Kembangkan dua produk secara terkoordinasi",
  focus: "Terang Events + AI Candidate Interview",
  tagline: "Two Products, One Coordinated Growth Engine.",
  shortTitle: "Coordinate to Grow",
  approach: "Controlled Dual-Product Growth",
  thesis:
    "Kembangkan dua peluang B2B melalui peningkatan selektif, strategi akuisisi yang berbeda, koordinasi operasional bersama, dan alokasi sumber daya berbasis bukti.",
  guardrail:
    "ACE tidak mengasumsikan pembagian 50:50. Nilai tambah produk kedua harus membenarkan biaya finansial & operasional tambahannya.",
  pillars: [
    {
      letter: "A",
      key: "agile",
      name: "Agile Feature Development",
      purpose: "Mengembangkan sejumlah kecil fitur bernilai tinggi untuk kedua produk dengan batas WIP yang ketat.",
      program: "ACE Dual-Product Innovation Sprint",
      highlights: [
        "Smart Event Templates",
        "Repeat Event Planner",
        "Organizer Growth Insights",
        "Interview Builder & Evidence-Linked Assessment",
        "Batas WIP: 1 inisiatif besar per produk",
      ],
      cta: { label: "Lihat Backlog Ganda", href: "/strategies/ace?pillar=agile" },
    },
    {
      letter: "C",
      key: "coordinate",
      name: "Coordinate Markets & Capacity",
      purpose: "Menjalankan dua jalur go-to-market dengan kendali kapasitas dan anggaran bersama.",
      program: "ACE Dual-Market Growth & Resource Control",
      highlights: [
        "Kampanye “Host Smarter with Terang”",
        "Kampanye “Hire Smarter with Terang”",
        "Eksperimen career fair institusional",
        "ACE Command Center",
      ],
      cta: { label: "Buka ACE Command Center", href: "/dashboard/operations" },
    },
    {
      letter: "E",
      key: "evolve",
      name: "Evaluate and Evolve Portfolio",
      purpose: "Mengevaluasi setiap produk secara independen dan di level portofolio, lalu merealokasi sumber daya.",
      program: "ACE Portfolio Intelligence",
      highlights: ["KPI per produk", "KPI portofolio", "Simulator realokasi", "Invest · Improve · Reduce · Pause"],
      cta: { label: "Lihat Hasil Evaluasi", href: "/dashboard/portfolio" },
    },
  ] satisfies Pillar[],
};

export const COMPARISON_ROWS = [
  { label: "Produk aktif dikembangkan", one: "1 — AI Candidate Interview", ace: "2 — Events + Interview" },
  { label: "Terang Events", one: "Maintenance-only (layanan existing)", ace: "Pengembangan selektif + akuisisi organizer" },
  { label: "Fokus pengembangan", one: "AI Interview Intelligence Suite", ace: "Dual-Product Innovation Sprint (WIP 1/produk)" },
  { label: "Kanal akuisisi", one: "Komunitas HR, LinkedIn, webinar, pilot", ace: "Kampus & asosiasi + komunitas HR & agensi" },
  { label: "Profil risiko utama", one: "Konsentrasi pada satu pasar yang belum tervalidasi", ace: "Kapasitas terbagi & overhead koordinasi" },
  { label: "Syarat scale", one: "Expansion Gate: kualitas, traksi, ekonomi, kapasitas, Responsible AI", ace: "Portfolio review: invest / improve / reduce / pause per produk" },
];

export const ROADMAP = {
  one: [
    { quarter: "Q1", items: ["Interview Builder & rubrik", "Responsible AI baseline", "Rekrut 8–10 pilot"], product: "interview" as const },
    { quarter: "Q2", items: ["Evidence-Linked Assessment", "Recruiter Dashboard", "Konversi pilot → berbayar"], product: "interview" as const },
    { quarter: "Q3", items: ["Audit trail & retensi", "Paket per interview", "Expansion Gate review #1"], product: "interview" as const },
    { quarter: "Q4", items: ["Scale ke agensi rekrutmen", "Renewal program", "Expansion Gate review #2"], product: "interview" as const },
  ],
  ace: [
    { quarter: "Q1", items: ["Smart Event Templates", "Interview Builder & rubrik"], product: "both" as const },
    { quarter: "Q2", items: ["Repeat Event Planner", "Evidence-Linked Assessment"], product: "both" as const },
    { quarter: "Q3", items: ["Organizer Growth Insights", "Recruiter Dashboard", "Portfolio review #1"], product: "both" as const },
    { quarter: "Q4", items: ["Career fair experiment", "Responsible AI Controls", "Portfolio review #2"], product: "both" as const },
  ],
};

export const STRATEGY_GLOSSARY = [
  { term: "Contribution margin", meaning: "Persentase pendapatan yang tersisa setelah biaya variabel & dukungan langsung produk." },
  { term: "Operating result", meaning: "Kontribusi total dikurangi biaya tetap, pengembangan, pemasaran & overhead. Bukan laba bersih." },
  { term: "Pilot-to-paid", meaning: "Persentase perusahaan pilot yang menjadi pelanggan berbayar." },
  { term: "CAC", meaning: "Customer Acquisition Cost — biaya untuk memperoleh satu pelanggan/pilot/organizer." },
  { term: "WIP limit", meaning: "Batas jumlah inisiatif besar yang boleh berjalan bersamaan agar tim tidak kelebihan beban." },
  { term: "Ramp-up factor", meaning: "Rata-rata porsi periode di mana pelanggan baru sudah aktif, karena akuisisi terjadi bertahap." },
  { term: "Context switching", meaning: "Tambahan jam kerja akibat berpindah fokus antara dua roadmap produk." },
  { term: "Expansion Gate", meaning: "Titik keputusan ONE: Scale, Improve, atau Pause/Revalidate berdasarkan ambang KPI." },
  { term: "Hard gate", meaning: "Kriteria wajib (privasi, keamanan, validitas penilaian) yang tidak bisa dikompensasi kinerja komersial." },
];
