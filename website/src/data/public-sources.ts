import type { EvidenceClassification } from "@/types/common";

export interface PublicSource {
  id: string;
  title: string;
  url: string;
  publisher: string;
  usedFor: string;
}

export const PUBLIC_SOURCES: PublicSource[] = [
  {
    id: "terang-home",
    title: "Terang AI — Situs resmi",
    url: "https://terang.ai/",
    publisher: "Terang AI",
    usedFor: "Identitas perusahaan, layanan persiapan ujian (UTBK, CPNS, beasiswa) dan solusi B2B.",
  },
  {
    id: "terang-wawancara",
    title: "Wawancara AI (Professor Terra)",
    url: "https://terang.ai/wawancara-ai",
    publisher: "Terang AI",
    usedFor: "Fondasi teknologi simulasi wawancara berbasis AI yang sudah ada.",
  },
  {
    id: "terang-events",
    title: "Terang Events",
    url: "https://events.terang.ai/",
    publisher: "Terang AI",
    usedFor: "Kapabilitas publik: penemuan event, registrasi, pembayaran, submisi, dan penjurian.",
  },
  {
    id: "terang-events-organizers",
    title: "Terang Events — Untuk Organizer",
    url: "https://events.terang.ai/organizers",
    publisher: "Terang AI",
    usedFor: "Peran organizer & reviewer, rubrik penjurian, manajemen keuangan, dan analitik event.",
  },
  {
    id: "terang-blog",
    title: "Blog Terang AI",
    url: "https://blog.terang.ai/",
    publisher: "Terang AI",
    usedFor: "Konteks publik perkembangan produk dan perusahaan.",
  },
  {
    id: "terang-launch",
    title: "Pengumuman peluncuran Terang AI",
    url: "https://blog.terang.ai/blog/terang-ai-launch-announcement/",
    publisher: "Blog Terang AI",
    usedFor: "Pengenalan publik Terang AI pada 2024 sebagai platform pendidikan berbasis AI.",
  },
  {
    id: "terang-inti",
    title: "Terang AI di INTI 2026",
    url: "https://blog.terang.ai/blog/terang-ai-inti-2026/",
    publisher: "Blog Terang AI",
    usedFor: "Konteks publik penawaran solusi B2B yang lebih luas.",
  },
];

export const EVIDENCE_META: Record<
  EvidenceClassification,
  { label: string; short: string; description: string }
> = {
  "public-source": {
    label: "Informasi publik resmi",
    short: "Sumber publik",
    description: "Berdasarkan informasi yang dipublikasikan Terang AI secara terbuka. Lihat halaman Referensi.",
  },
  "internal-restricted-context": {
    label: "Konteks studi kasus",
    short: "Konteks kasus",
    description:
      "Konfigurasi hipotetis dari studi kasus kompetisi (mis. struktur 7 personel). Bukan verifikasi kondisi perusahaan saat ini.",
  },
  "strategic-proposal": {
    label: "Usulan solusi",
    short: "Usulan",
    description: "Fitur atau program yang diusulkan tim melalui ONE atau ACE Strategy — belum tentu ada pada produk resmi.",
  },
  "illustrative-assumption": {
    label: "Skenario ilustratif",
    short: "Ilustratif",
    description: "Angka asumsi akademik untuk simulasi. Bukan data kinerja atau harga resmi Terang AI.",
  },
  "synthetic-demo": {
    label: "Interaksi produk simulasi",
    short: "Simulasi",
    description: "Data fiktif & logika deterministik di browser. Tidak ada AI sungguhan, pembayaran, atau data pribadi nyata.",
  },
};
