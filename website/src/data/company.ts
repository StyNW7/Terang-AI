import type { EvidenceClassification } from "@/types/common";

export const COMPANY = {
  name: "Terang AI",
  legalName: "PT Terang Inovasi Indonesia",
  industry: "Artificial Intelligence · Education Technology · B2B Technology Solutions",
  origin: "Indonesia",
  introduced: 2024,
  idea: "Membuat teknologi AI lebih bermanfaat, mudah diakses, dan berdampak di dunia pendidikan maupun proses bisnis.",
  tagline: "Smarter Solutions, Brighter Futures.",
  taglineNote: "Tagline konseptual untuk prototype akademik — bukan slogan resmi perusahaan.",
};

export interface TimelineStep {
  id: string;
  phase: string;
  period: string;
  title: string;
  description: string;
  items: string[];
  evidence: EvidenceClassification;
  segment: "B2C" | "B2C → B2B" | "B2B" | "Keputusan";
}

export const EVOLUTION: TimelineStep[] = [
  {
    id: "edu",
    phase: "01",
    period: "2024",
    title: "Education & Exam Preparation",
    description: "Diperkenalkan sebagai platform pendidikan berbasis AI dengan pembelajaran personal dan persiapan ujian.",
    items: ["Persiapan UTBK", "Persiapan CPNS", "Persiapan beasiswa (mis. LPDP)", "Pembelajaran personal"],
    evidence: "public-source",
    segment: "B2C",
  },
  {
    id: "interview-tech",
    phase: "02",
    period: "Fondasi teknologi",
    title: "AI Interview Technology",
    description: "Simulasi wawancara berbasis AI melalui Professor Terra: percakapan kontekstual dan umpan balik wawancara.",
    items: ["Professor Terra", "Simulasi wawancara beasiswa & kerja", "Umpan balik berbasis AI"],
    evidence: "public-source",
    segment: "B2C → B2B",
  },
  {
    id: "b2b",
    phase: "03",
    period: "Ekspansi",
    title: "Expanded B2B Offerings",
    description: "Portofolio meluas ke solusi institusional: pembelajaran, manajemen acara, dan rekrutmen berbasis AI.",
    items: ["AI Learning Management System", "Terang Events", "AI Candidate Interview"],
    evidence: "public-source",
    segment: "B2B",
  },
  {
    id: "decision",
    phase: "04",
    period: "Sekarang",
    title: "Strategic Growth Decision",
    description: "Dua peluang B2B dengan pasar berbeda — fokus pada satu produk (ONE) atau kembangkan keduanya terkoordinasi (ACE)?",
    items: ["ONE — Focused Single-Product Growth", "ACE — Coordinated Dual-Product Growth"],
    evidence: "strategic-proposal",
    segment: "Keputusan",
  },
];

export const B2C_OFFERINGS = [
  { name: "UTBK", description: "Latihan & simulasi untuk seleksi masuk perguruan tinggi." },
  { name: "CPNS", description: "Persiapan seleksi calon aparatur sipil negara." },
  { name: "Beasiswa", description: "Persiapan seleksi beasiswa seperti LPDP." },
  { name: "Wawancara AI", description: "Simulasi wawancara bersama Professor Terra." },
];

export const PRODUCTS = {
  events: {
    key: "events" as const,
    name: "Terang Events",
    category: "EventTech",
    categoryLong: "Event & Competition Management",
    tagline: "Satu platform untuk registrasi, pembayaran, peserta, dan penjurian.",
    buyer: "Penyelenggara acara & institusi",
    targetCustomers: [
      "Universitas & institusi pendidikan",
      "Penyelenggara kompetisi",
      "Asosiasi profesional",
      "Penyelenggara seminar, pelatihan & konferensi",
      "Organisasi dengan event institusional berulang",
    ],
    problems: [
      "Data registrasi & peserta tersebar di banyak alat",
      "Koordinasi peserta dan submisi masih manual",
      "Pengelolaan pembayaran registrasi",
      "Administrasi juri & proses penilaian",
      "Sulit memantau progres & kinerja event",
      "Setup ulang dari nol untuk event berikutnya",
    ],
    existing: [
      "Penemuan & registrasi event",
      "Pembayaran registrasi via layanan pembayaran yang didukung",
      "Workflow submisi & review",
      "Rubrik penjurian terstruktur",
      "Peran organizer & reviewer",
      "Manajemen keuangan & payout",
      "Analitik event",
    ],
    proposals: [
      { name: "Smart Event Templates", status: "proposed" as const, description: "Template kompetisi, workshop, konferensi & seminar yang mengisi otomatis setup, tahapan & tugas organizer." },
      { name: "Repeat Event Planner", status: "proposed" as const, description: "Duplikasi konfigurasi event sebelumnya tanpa menyalin data peserta." },
      { name: "Organizer Growth Insights", status: "proposed" as const, description: "Pengembangan analitik: funnel registrasi, aktivitas peserta & tren event berulang." },
      { name: "AI Event Assistant", status: "later" as const, description: "FAQ peserta & pengingat tenggat berbasis informasi dari organizer (prioritas berikutnya)." },
    ],
    revenueModel: "Biaya platform per event / per transaksi registrasi",
    cycle: "Episodik — mengikuti kalender akademik & acara",
  },
  interview: {
    key: "interview" as const,
    name: "AI Candidate Interview",
    category: "HRTech",
    categoryLong: "AI-Assisted Candidate Interviewing",
    tagline: "Wawancara terstruktur dengan bukti penilaian yang dapat ditinjau manusia.",
    buyer: "Tim HR & talent acquisition",
    targetCustomers: [
      "Perusahaan dengan rekrutmen entry-level berulang",
      "Departemen HR & tim talent acquisition",
      "Agensi rekrutmen",
      "Perusahaan menengah dengan tim HR ramping",
    ],
    problems: [
      "Administrasi screening memakan waktu",
      "Persiapan wawancara tidak konsisten",
      "Sulit mendokumentasikan jawaban terkait kompetensi",
      "Penjadwalan & tindak lanjut berulang",
      "Sulit membandingkan jawaban dengan kriteria jabatan",
      "Butuh bukti penilaian yang terstruktur & dapat diaudit",
    ],
    existing: [
      "Teknologi simulasi wawancara AI (Professor Terra)",
      "Percakapan kontekstual berbasis AI",
      "Umpan balik wawancara pada produk pembelajaran",
    ],
    proposals: [
      { name: "Role-Based Interview Builder", status: "proposed" as const, description: "HR membuat lowongan, memilih kompetensi, dan meninjau saran pertanyaan sebelum dipublikasikan." },
      { name: "Adaptive Structured Interview", status: "proposed" as const, description: "Pertanyaan inti terstandar dengan follow-up kontekstual." },
      { name: "Evidence-Linked Assessment", status: "proposed" as const, description: "Setiap penilaian terhubung ke rubrik dan kutipan jawaban kandidat." },
      { name: "Recruiter Review Dashboard", status: "proposed" as const, description: "Lowongan, undangan, progres, laporan, catatan, dan persetujuan manusia." },
      { name: "Responsible AI Controls", status: "proposed" as const, description: "Kontrol akses, audit trail, pemberitahuan privasi, retensi data, dan wajib tinjauan manusia." },
    ],
    revenueModel: "Paket pilot · paket per interview · langganan perusahaan",
    cycle: "Berulang — mengikuti siklus rekrutmen perusahaan",
  },
};

export const POSITIONING = [
  { label: "Pembeli utama", events: "Penyelenggara acara, universitas, asosiasi", interview: "HR, talent acquisition, agensi rekrutmen" },
  { label: "Pola penggunaan", events: "Episodik per event", interview: "Berulang per siklus rekrutmen" },
  { label: "Kesiapan produk", events: "Fondasi publik sudah berjalan (registrasi, pembayaran, penjurian)", interview: "Teknologi inti ada (simulasi B2C), kesiapan enterprise perlu divalidasi" },
  { label: "Ketidakpastian pasar", events: "Lebih rendah — kebutuhan operasional jelas", interview: "Lebih tinggi — butuh bukti kemauan membayar & kepercayaan HR" },
  { label: "Kebutuhan operasional", events: "Dukungan organizer saat puncak acara", interview: "Kualitas penilaian, privasi data, onboarding HR" },
  { label: "Model pendapatan", events: "Biaya per event / transaksi", interview: "Pilot, paket interview, langganan" },
  { label: "Pertimbangan risiko", events: "Margin per event & musiman", interview: "Keadilan penilaian, regulasi data, siklus penjualan B2B" },
];
