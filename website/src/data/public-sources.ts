import type { EvidenceClassification } from "@/types/common";
import { L, type Bilingual, type Txt } from "@/lib/i18n-core";

export interface PublicSource {
  id: string;
  title: Txt;
  url: string;
  publisher: Txt;
  usedFor: Txt;
}

export const PUBLIC_SOURCES: PublicSource[] = [
  {
    id: "terang-home",
    title: L("Terang AI — Situs resmi", "Terang AI — Official website"),
    url: "https://terang.ai/",
    publisher: "Terang AI",
    usedFor: L("Identitas perusahaan, layanan persiapan ujian (UTBK, CPNS, beasiswa) dan solusi B2B.", "Company identity, exam-preparation services (UTBK, CPNS, scholarships) and B2B solutions."),
  },
  {
    id: "terang-wawancara",
    title: L("Wawancara AI (Professor Terra)", "AI Interview (Professor Terra)"),
    url: "https://terang.ai/wawancara-ai",
    publisher: "Terang AI",
    usedFor: L("Fondasi teknologi simulasi wawancara berbasis AI yang sudah ada.", "The existing foundation of AI-based interview simulation technology."),
  },
  {
    id: "terang-events",
    title: "Terang Events",
    url: "https://events.terang.ai/",
    publisher: "Terang AI",
    usedFor: L("Kapabilitas publik: penemuan _event_, registrasi, pembayaran, submisi, dan penjurian.", "Public capabilities: event discovery, registration, payment, submissions and judging."),
  },
  {
    id: "terang-events-organizers",
    title: L("Terang Events — Untuk _Organizer_", "Terang Events — For Organizers"),
    url: "https://events.terang.ai/organizers",
    publisher: "Terang AI",
    usedFor: L("Peran _organizer_ & _reviewer_, rubrik penjurian, manajemen keuangan, dan analitik _event_.", "Organizer & reviewer roles, judging rubrics, financial management and event analytics."),
  },
  {
    id: "terang-blog",
    title: "Blog Terang AI",
    url: "https://blog.terang.ai/",
    publisher: "Terang AI",
    usedFor: L("Konteks publik perkembangan produk dan perusahaan.", "Public context on product and company development."),
  },
  {
    id: "terang-launch",
    title: L("Pengumuman peluncuran Terang AI", "Terang AI launch announcement"),
    url: "https://blog.terang.ai/blog/terang-ai-launch-announcement/",
    publisher: "Blog Terang AI",
    usedFor: L("Pengenalan publik Terang AI pada 2024 sebagai platform pendidikan berbasis AI.", "Terang AI's public introduction in 2024 as an AI-powered education platform."),
  },
  {
    id: "terang-inti",
    title: "Terang AI di INTI 2026",
    url: "https://blog.terang.ai/blog/terang-ai-inti-2026/",
    publisher: "Blog Terang AI",
    usedFor: L("Konteks publik penawaran solusi B2B yang lebih luas.", "Public context on the broader B2B solution offering."),
  },
];

export const EVIDENCE_META: Record<
  EvidenceClassification,
  { label: Bilingual; short: Bilingual; description: Bilingual }
> = {
  "public-source": {
    label: L("Informasi publik resmi", "Official public information"),
    short: L("Sumber publik", "Public source"),
    description: L("Berdasarkan informasi yang dipublikasikan Terang AI secara terbuka. Lihat halaman Referensi.", "Based on information Terang AI has published openly. See the References page."),
  },
  "internal-restricted-context": {
    label: L("Konteks studi kasus", "Case-study context"),
    short: L("Konteks kasus", "Case context"),
    description: L(
      "Konfigurasi hipotetis dari studi kasus kompetisi (mis. struktur 7 personel). Bukan verifikasi kondisi perusahaan saat ini.",
      "A hypothetical setup from the competition case study (e.g. the 7-person structure). Not a verification of the company's current state.",
    ),
  },
  "strategic-proposal": {
    label: L("Usulan solusi", "Proposed solution"),
    short: L("Usulan", "Proposed"),
    description: L("Fitur atau program yang diusulkan tim melalui ONE atau ACE Strategy — belum tentu ada pada produk resmi.", "A feature or programme proposed by the team through the ONE or ACE Strategy — not necessarily part of the official product."),
  },
  "proposal-projection": {
    label: L("Proyeksi proposal", "Proposal projection"),
    short: L("Proyeksi", "Projection"),
    description: L(
      "Target dan angka finansial dari model proposal ONE / ACE. Proyeksi berbasis asumsi — bukan kinerja aktual, harga resmi, atau komitmen Terang AI.",
      "Targets and financial figures from the ONE / ACE proposal model. Assumption-based projections — not actual performance, official prices or Terang AI commitments.",
    ),
  },
  "survey-data": {
    label: L("Data survei tim", "Team survey data"),
    short: L("Survei", "Survey"),
    description: L(
      "Survei independen tim via Google Form (n = 113, 24 Okt 2026), mayoritas mahasiswa & _fresh graduate_. Mengukur kebutuhan & minat pengguna akhir, bukan kemauan membayar B2B.",
      "Independent team survey via Google Form (n = 113, 24 Oct 2026), mostly students & fresh graduates. Measures end-user needs & interest, not B2B willingness to pay.",
    ),
  },
  "illustrative-assumption": {
    label: L("Skenario ilustratif", "Illustrative scenario"),
    short: L("Ilustratif", "Illustrative"),
    description: L("Angka asumsi akademik untuk simulasi. Bukan data kinerja atau harga resmi Terang AI.", "Academic assumptions for simulation. Not Terang AI's official performance or pricing data."),
  },
  "synthetic-demo": {
    label: L("Interaksi produk simulasi", "Simulated product interaction"),
    short: L("Simulasi", "Simulated"),
    description: L("Data fiktif & logika deterministik di _browser_. Tidak ada AI sungguhan, pembayaran, atau data pribadi nyata.", "Fictional data & deterministic logic in the browser. No real AI, payments or real personal data."),
  },
};
