import type { EvidenceClassification } from "@/types/common";
import { L, type Bilingual, type Txt } from "@/lib/i18n-core";

export const KEY_QUESTION = L(
  "Bagaimana Terang AI dapat mengoptimalkan prioritas pengembangan produk, alokasi sumber daya, dan penetrasi pasar untuk mencapai pertumbuhan B2B yang berkelanjutan?",
  "How can Terang AI optimise its product-development priorities, resource allocation and market penetration to achieve sustainable B2B growth?",
);

export const CORE_INSIGHT = L(
  "Tantangan Terang AI bukan sekadar memilih jumlah produk yang dikembangkan, melainkan bagaimana peluang pasar dapat dikonversi menjadi pertumbuhan bisnis yang terukur melalui pemanfaatan sumber daya secara optimal.",
  "Terang AI's challenge is not simply choosing how many products to build, but how to convert market opportunities into measurable business growth through the optimal use of resources.",
);

export interface Challenge {
  id: string;
  number: string;
  title: Bilingual;
  english: string;
  summary: Bilingual;
  drivers: Txt[];
  implications: Txt[];
  evidence: EvidenceClassification;
  icon: "users" | "target" | "layers";
}

export const CHALLENGES: Challenge[] = [
  {
    id: "capacity",
    number: "01",
    title: L("Keterbatasan Sumber Daya", "Limited Resources"),
    english: "Resource Capacity Gap",
    summary: L(
      "Struktur 7 personel dalam studi kasus dan tuntutan efisiensi anggaran menuntut prioritas investasi yang realistis.",
      "The case study's 7-person structure and the need for budget efficiency call for realistic investment priorities.",
    ),
    drivers: [
      L("Hanya 3 personel _Product_ untuk pengembangan seluruh fitur", "Only 3 Product staff to build every feature"),
      L("2 personel _Strategy & Operations_ untuk akuisisi, _onboarding_ & dukungan", "2 Strategy & Operations staff for acquisition, onboarding & support"),
      L("Kapasitas CEO & CPO tidak dapat diperlakukan sebagai jam _engineering_", "CEO & CPO capacity cannot be treated as engineering hours"),
      L("Kebutuhan efisiensi biaya akuisisi & operasional", "The need to keep acquisition & operating costs efficient"),
    ],
    implications: [
      L("Setiap inisiatif baru mengurangi kapasitas inisiatif lain", "Every new initiative takes capacity away from another"),
      L("Risiko kualitas & keterlambatan bila beban melebihi kapasitas", "Quality and delay risks when workload exceeds capacity"),
      L("Perekrutan besar-besaran bukan asumsi yang realistis", "Large-scale hiring is not a realistic assumption"),
    ],
    evidence: "internal-restricted-context",
    icon: "users",
  },
  {
    id: "validation",
    number: "02",
    title: L("Tantangan Validasi Pasar", "Market Validation Challenge"),
    english: "Product–Market Validation Gap",
    summary: L(
      "Kedua produk memiliki pembeli, kriteria pembelian, dan proposisi nilai yang berbeda — bukti adopsi perlu dibandingkan.",
      "The two products have different buyers, purchase criteria and value propositions — adoption evidence must be compared.",
    ),
    drivers: [
      L("Terang Events → penyelenggara acara; AI Candidate Interview → tim HR", "Terang Events → event organisers; AI Candidate Interview → HR teams"),
      L("Kemauan membayar & siklus penjualan berbeda", "Different willingness to pay & sales cycles"),
      L("Kesiapan _enterprise_ Interview belum dapat diasumsikan dari simulator B2C", "Interview's enterprise readiness cannot be assumed from the B2C simulator"),
      L("Potensi monetisasi & kelayakan komersial perlu diuji", "Monetisation potential & commercial viability need testing"),
    ],
    implications: [
      L("Investasi tanpa bukti berisiko salah sasaran", "Investing without evidence risks missing the target"),
      L("Dibutuhkan _pilot_ & metrik yang jelas sebelum _scaling_", "Clear pilots & metrics are needed before scaling"),
      L("Keputusan harus berbasis bukti, bukan intuisi", "Decisions must be evidence-based, not intuition-based"),
    ],
    evidence: "strategic-proposal",
    icon: "target",
  },
  {
    id: "execution",
    number: "03",
    title: L("Kompleksitas Eksekusi Bisnis", "Business Execution Complexity"),
    english: "Portfolio Execution Complexity",
    summary: L(
      "Pengembangan fitur, akuisisi pelanggan, dan operasional kedua produk menuntut pendekatan yang berbeda.",
      "Feature development, customer acquisition and operations for the two products each require a different approach.",
    ),
    drivers: [
      L("_Workflow_ & kebutuhan teknis produk yang berbeda", "Different product workflows & technical needs"),
      L("Dua kanal penjualan & dua jenis dukungan pelanggan", "Two sales channels & two kinds of customer support"),
      L("Koordinasi prioritas lintas produk", "Coordinating priorities across products"),
      L("_Context switching_ dalam tim kecil", "Context switching within a small team"),
    ],
    implications: [
      L("Pengembangan paralel menambah beban kerja & biaya koordinasi", "Parallel development adds workload & coordination cost"),
      L("Tanpa tata kelola, prioritas mudah bergeser", "Without governance, priorities drift easily"),
      L("Butuh mekanisme evaluasi & realokasi yang transparan", "A transparent evaluation & reallocation mechanism is needed"),
    ],
    evidence: "strategic-proposal",
    icon: "layers",
  },
];

export interface Pillar {
  letter: string;
  key: string;
  name: string;
  purpose: Txt;
  program: string;
  highlights: Txt[];
  cta: { label: Txt; href: string };
}

export const ONE_STRATEGY = {
  name: "ONE Strategy",
  position: L("PRO — Prioritaskan satu produk B2B", "PRO — Prioritise one B2B product"),
  badge: "PRO",
  focus: "AI Candidate Interview",
  tagline: "One Product, Proven Growth.",
  shortTitle: "Focus to Grow",
  thesis: L(
    "Pusatkan pengembangan produk, validasi pelanggan, sumber daya akuisisi, dan investasi pada AI Candidate Interview. Bangun produk yang tepercaya, validasi kemauan membayar, lalu _scale_ berdasarkan bukti.",
    "Concentrate product development, customer validation, acquisition resources and investment on AI Candidate Interview. Build a trusted product, validate willingness to pay, then scale on evidence.",
  ),
  eventsPolicy: L(
    "Terang Events dipertahankan dalam mode _maintenance_ — layanan berjalan, tanpa pengembangan agresif.",
    "Terang Events is kept in maintenance mode — the service keeps running, without aggressive development.",
  ),
  pillars: [
    {
      letter: "O",
      key: "optimize",
      name: "Optimize Product Value",
      purpose: L(
        "Meningkatkan nilai, kualitas, dan kesiapan _enterprise_ AI Candidate Interview.",
        "Raise the value, quality and enterprise readiness of AI Candidate Interview.",
      ),
      program: "AI Interview Intelligence Suite",
      highlights: [
        "Role-Based Interview Builder",
        "Adaptive Structured Interview",
        "Evidence-Linked Assessment",
        "Recruiter Review Dashboard",
        "Responsible AI Controls",
      ],
      cta: { label: L("Coba Simulasi Produk", "Try the Product Simulation"), href: "/dashboard/interview" },
    },
    {
      letter: "N",
      key: "navigate",
      name: "Navigate Market Growth",
      purpose: L(
        "Menjangkau pelanggan bisnis yang relevan dan membuktikan nilai komersial.",
        "Reach the right business customers and prove commercial value.",
      ),
      program: "Pilot-to-Paid Growth Engine",
      highlights: [
        L("_Outreach_ B2B via komunitas HR & LinkedIn", "B2B outreach via HR communities & LinkedIn"),
        "HR Efficiency Clinic",
        "Terang Pilot Challenge",
        "Verified Impact Stories",
        L("Paket Starter · Growth · Enterprise", "Starter · Growth · Enterprise plans"),
      ],
      cta: { label: L("Lihat _Funnel_ Pilot-to-Paid", "See the Pilot-to-Paid Funnel"), href: "/strategies/one?pillar=navigate" },
    },
    {
      letter: "E",
      key: "evaluate",
      name: "Evaluate for Expansion",
      purpose: L(
        "Memastikan AI Candidate Interview siap tumbuh sebelum menambah komitmen sumber daya.",
        "Make sure AI Candidate Interview is ready to grow before committing more resources.",
      ),
      program: "ONE Growth Intelligence & Expansion Gate",
      highlights: [
        L("Kualitas produk", "Product quality"),
        L("Traksi komersial", "Commercial traction"),
        L("Kontribusi finansial", "Financial contribution"),
        L("Kapasitas tim", "Team capacity"),
        L("Kesiapan Responsible AI", "Responsible AI readiness"),
      ],
      cta: { label: L("Tinjau Kesiapan Ekspansi", "Review Expansion Readiness"), href: "/strategies/one?pillar=evaluate" },
    },
  ] satisfies Pillar[],
};

export const ACE_STRATEGY = {
  name: "ACE Strategy",
  position: L("KONTRA — Kembangkan dua produk secara terkoordinasi", "CONTRA — Grow two products in coordination"),
  badge: L("KONTRA", "CONTRA"),
  focus: "Terang Events + AI Candidate Interview",
  tagline: "Two Products, One Coordinated Growth Engine.",
  shortTitle: "Coordinate to Grow",
  approach: "Controlled Dual-Product Growth",
  thesis: L(
    "Kembangkan dua peluang B2B melalui peningkatan selektif, strategi akuisisi yang berbeda, koordinasi operasional bersama, dan alokasi sumber daya berbasis bukti.",
    "Grow two B2B opportunities through selective improvements, distinct acquisition strategies, shared operational coordination and evidence-based resource allocation.",
  ),
  guardrail: L(
    "ACE tidak mengasumsikan pembagian 50:50. Nilai tambah produk kedua harus membenarkan biaya finansial & operasional tambahannya.",
    "ACE does not assume a 50:50 split. The second product's added value must justify its extra financial & operational cost.",
  ),
  pillars: [
    {
      letter: "A",
      key: "agile",
      name: "Agile Feature Development",
      purpose: L(
        "Mengembangkan sejumlah kecil fitur bernilai tinggi untuk kedua produk dengan batas WIP yang ketat.",
        "Build a small number of high-value features for both products under a strict WIP limit.",
      ),
      program: "ACE Dual-Product Innovation Sprint",
      highlights: [
        "Smart Event Templates",
        "Repeat Event Planner",
        "Organizer Insight Dashboard",
        "Interview Builder & Evidence-Linked Assessment",
        L("Batas WIP: maks. 2 inisiatif besar (1 per produk)", "WIP limit: max. 2 major initiatives (1 per product)"),
      ],
      cta: { label: L("Lihat _Backlog_ Ganda", "See the Dual Backlog"), href: "/strategies/ace?pillar=agile" },
    },
    {
      letter: "C",
      key: "coordinate",
      name: "Coordinate Markets & Capacity",
      purpose: L(
        "Menjalankan dua jalur _go-to-market_ dengan kendali kapasitas dan anggaran bersama.",
        "Run two go-to-market tracks under shared capacity and budget control.",
      ),
      program: "ACE Dual-Market Growth & Resource Control",
      highlights: [
        L("Kampanye “Host Smarter with Terang”", "“Host Smarter with Terang” campaign"),
        L("Kampanye “Hire Smarter with Terang”", "“Hire Smarter with Terang” campaign"),
        L("Eksperimen _career fair_ institusional", "Institutional career-fair experiment"),
        "Event Platform Fee · Managed Event Boost · Organizer Pro",
        "ACE Command Center",
      ],
      cta: { label: L("Buka ACE Command Center", "Open the ACE Command Center"), href: "/dashboard/operations" },
    },
    {
      letter: "E",
      key: "evolve",
      name: "Evaluate and Evolve Portfolio",
      purpose: L(
        "Mengevaluasi setiap produk secara independen dan di level portofolio, lalu merealokasi sumber daya.",
        "Evaluate each product independently and at portfolio level, then reallocate resources.",
      ),
      program: "ACE Portfolio Intelligence",
      highlights: [
        L("KPI per produk", "KPIs per product"),
        L("KPI portofolio", "Portfolio KPIs"),
        L("Simulator realokasi", "Reallocation simulator"),
        "Invest More · Optimize · Limit Scope · Pause",
      ],
      cta: { label: L("Lihat Hasil Evaluasi", "See Evaluation Results"), href: "/dashboard/portfolio" },
    },
  ] satisfies Pillar[],
};

export const COMPARISON_ROWS: { label: Txt; one: Txt; ace: Txt }[] = [
  {
    label: L("Produk aktif dikembangkan", "Products in active development"),
    one: "1 — AI Candidate Interview",
    ace: "2 — Events + Interview",
  },
  {
    label: "Terang Events",
    one: L("_Maintenance-only_ (layanan _existing_)", "Maintenance-only (existing service)"),
    ace: L("Pengembangan selektif + akuisisi _organizer_", "Selective development + organizer acquisition"),
  },
  {
    label: L("Fokus pengembangan", "Development focus"),
    one: "AI Interview Intelligence Suite",
    ace: L("Dual-Product Innovation Sprint (WIP 1/produk)", "Dual-Product Innovation Sprint (WIP 1/product)"),
  },
  {
    label: L("Kanal akuisisi", "Acquisition channels"),
    one: L("Komunitas HR, LinkedIn, webinar, _pilot_", "HR communities, LinkedIn, webinars, pilots"),
    ace: L("Kampus & asosiasi + komunitas HR & agensi", "Campuses & associations + HR communities & agencies"),
  },
  {
    label: L("Profil risiko utama", "Main risk profile"),
    one: L("Konsentrasi pada satu pasar yang belum tervalidasi", "Concentration on one not-yet-validated market"),
    ace: L("Kapasitas terbagi & _overhead_ koordinasi", "Split capacity & coordination overhead"),
  },
  {
    label: L("Syarat _scale_", "Conditions to scale"),
    one: L("Expansion Gate (Scale · Improve · Hold): kualitas, traksi, ekonomi, kapasitas, Responsible AI", "Expansion Gate (Scale · Improve · Hold): quality, traction, economics, capacity, Responsible AI"),
    ace: L("_Portfolio review_: _Invest More / Optimize / Limit Scope / Pause_ per produk", "Portfolio review: Invest More / Optimize / Limit Scope / Pause per product"),
  },
];

export interface RoadmapPhase {
  quarter: string;
  months: string;
  name: string;
  items: Txt[];
}

/**
 * Initial implementation periods from the proposal: ONE runs 12 months (4 phases),
 * ACE runs 18 months (6 phases). Operations continue after these periods.
 */
export const ROADMAP: Record<"one" | "ace", RoadmapPhase[]> = {
  one: [
    {
      quarter: "Q1",
      months: "M1–M3",
      name: "Build & Validate",
      items: [L("Interview Builder & rubrik", "Interview Builder & rubrics"), "Responsible AI baseline", L("HR Efficiency Clinic & rekrut _pilot_", "HR Efficiency Clinic & pilot recruitment")],
    },
    {
      quarter: "Q2",
      months: "M4–M6",
      name: "Pilot & Improve",
      items: ["Terang Pilot Challenge", "Evidence-Linked Assessment", "Recruiter Review Dashboard"],
    },
    {
      quarter: "Q3",
      months: "M7–M9",
      name: "Convert & Monetize",
      items: [L("Konversi _pilot_ → paket berbayar", "Pilot → paid plan conversion"), "Verified Impact Stories", L("_Audit trail_ & retensi data", "Audit trail & data retention")],
    },
    {
      quarter: "Q4",
      months: "M10–M12",
      name: "Evaluate & Scale",
      items: [L("_Scale_ ke agensi rekrutmen", "Scale to recruitment agencies"), L("Program _renewal_", "Renewal programme"), "Expansion Gate: Scale · Improve · Hold"],
    },
  ],
  ace: [
    {
      quarter: "Q1",
      months: "M1–M3",
      name: "Align & Build",
      items: ["Smart Event Templates", L("Interview Builder & rubrik", "Interview Builder & rubrics"), "ACE Resource Control"],
    },
    {
      quarter: "Q2",
      months: "M4–M6",
      name: "Pilot & Activate",
      items: ["Repeat Event Planner", "Evidence-Linked Assessment", L("_Pilot_ HR & aktivasi _organizer_", "HR pilots & organizer activation")],
    },
    {
      quarter: "Q3",
      months: "M7–M9",
      name: "Acquire & Optimize",
      items: ["Organizer Insight Dashboard", "Recruiter Review Dashboard", "Portfolio review #1"],
    },
    {
      quarter: "Q4",
      months: "M10–M12",
      name: "Expand Selectively",
      items: [L("Eksperimen _career fair_", "Career-fair experiment"), "Responsible AI Controls", "Portfolio review #2"],
    },
    {
      quarter: "Q5",
      months: "M13–M15",
      name: "Improve Portfolio",
      items: ["Managed Event Boost & Organizer Pro", L("Konversi & _renewal_ Interview", "Interview conversion & renewals"), "Portfolio review #3"],
    },
    {
      quarter: "Q6",
      months: "M16–M18",
      name: "Evaluate & Evolve",
      items: [L("AI Event Assistant (bila kapasitas cukup)", "AI Event Assistant (if capacity allows)"), L("Evaluasi target M18", "M18 target review"), "Invest More · Optimize · Limit Scope · Pause"],
    },
  ],
};

export const STRATEGY_GLOSSARY: { term: string; meaning: Txt }[] = [
  {
    term: "Contribution margin",
    meaning: L(
      "Persentase pendapatan yang tersisa setelah biaya variabel & dukungan langsung produk.",
      "The share of revenue left after variable costs & direct product support.",
    ),
  },
  {
    term: "Operating result",
    meaning: L(
      "Kontribusi total dikurangi biaya tetap, pengembangan, pemasaran & _overhead_. Bukan laba bersih.",
      "Total contribution minus fixed, development, marketing & overhead costs. Not net profit.",
    ),
  },
  { term: "Pilot-to-paid", meaning: L("Persentase perusahaan _pilot_ yang menjadi pelanggan berbayar.", "The share of pilot companies that become paying customers.") },
  {
    term: "CAC",
    meaning: L(
      "_Customer Acquisition Cost_ — biaya untuk memperoleh satu pelanggan/_pilot_/_organizer_.",
      "Customer Acquisition Cost — the cost of acquiring one customer / pilot / organizer.",
    ),
  },
  {
    term: "WIP limit",
    meaning: L(
      "Batas jumlah inisiatif besar yang boleh berjalan bersamaan agar tim tidak kelebihan beban.",
      "The maximum number of major initiatives allowed in parallel so the team is not overloaded.",
    ),
  },
  {
    term: "Ramp-up factor",
    meaning: L(
      "Rata-rata porsi periode di mana pelanggan baru sudah aktif, karena akuisisi terjadi bertahap.",
      "The average share of the period in which new customers are already active, since acquisition happens gradually.",
    ),
  },
  { term: "Context switching", meaning: L("Tambahan jam kerja akibat berpindah fokus antara dua _roadmap_ produk.", "Extra working hours caused by switching focus between two product roadmaps.") },
  { term: "Expansion Gate", meaning: L("Titik keputusan ONE: _Scale_, _Improve_, atau _Hold_ berdasarkan ambang KPI.", "ONE's decision point: Scale, Improve or Hold based on KPI thresholds.") },
  {
    term: "Hard gate",
    meaning: L(
      "Kriteria wajib (privasi, keamanan, validitas penilaian) yang tidak bisa dikompensasi kinerja komersial.",
      "Mandatory criteria (privacy, security, assessment validity) that commercial performance cannot offset.",
    ),
  },
];
