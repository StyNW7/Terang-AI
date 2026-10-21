# Terang AI — Strategic Growth Experience

Prototype frontend akademik (BCDC 2026) untuk menjelaskan ONE Strategy (PRO) dan ACE Strategy (KONTRA).
**Unofficial academic concept prototype — bukan situs resmi PT Terang Inovasi Indonesia.**

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Tidak butuh API key, backend, atau database. Semua data demo bersifat fiktif dan disimpan di localStorage browser
(tombol "Reset demo" di workspace mengembalikan data awal).

## Route

| Route | Isi |
|---|---|
| `/` | Landing: hero, evolusi B2C→B2B, dua produk, preview dilema, pemilih ONE/ACE |
| `/company` | Identitas, timeline, positioning map, sumber publik vs usulan |
| `/products`, `/products/events`, `/products/interview` | Overview & detail produk |
| `/strategy-lab` | Alur dilema interaktif, root cause, perbandingan produk |
| `/strategies/one`, `/strategies/ace` | Tiga pilar per strategi (`?pillar=`) |
| `/demo/events` | Organizer (dashboard, wizard 6 langkah, template, repeat planner, peserta, penjurian, analitik, keuangan) & peserta |
| `/demo/interview` | Recruiter (builder, kandidat, laporan berbasis bukti, Responsible AI) & kandidat |
| `/operations` | ACE Command Center: kapasitas, anggaran, sprint board, timeline, rekomendasi |
| `/portfolio` | KPI, grafik, matriks keputusan portofolio |
| `/compare` | Simulator finansial ONE vs ACE (preset, sensitivitas, rumus, unduh JSON) |
| `/presentation` | 15 slide, reveal bertahap, keyboard (←/→, N, G, 1, 2), catatan pembicara |
| `/references` | Sumber publik, label bukti, glosarium, rumus |

## Yang disimulasikan
Generator pertanyaan, follow-up, dan penilaian kandidat adalah **aturan deterministik** (bukan AI).
Pembayaran, email, unggah berkas, dan payout tidak nyata. Semua angka finansial adalah asumsi ilustratif
(`src/data/scenarios.ts`, mesin di `src/lib/finance.ts`).

## Kerahasiaan
Jangan deploy publik tanpa pembatasan akses di level platform; `robots: noindex` sudah diset tetapi bukan mekanisme keamanan.
