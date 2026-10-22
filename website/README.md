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

### Situs publik
| Route | Isi |
|---|---|
| `/` | Landing: hero layar penuh, tentang, evolusi B2C→B2B, dua produk, dilema, pemilih ONE/ACE, tiga dashboard |
| `/company` | Identitas, timeline, positioning map, sumber publik vs usulan |
| `/products`, `/products/events`, `/products/interview` | Overview & detail produk |
| `/strategy-lab` | Alur dilema interaktif, root cause, perbandingan produk |
| `/strategies/one`, `/strategies/ace` | Tiga pilar per strategi (`?pillar=`) |
| `/presentation` | 15 slide, reveal bertahap, keyboard (←/→, N, G, 1, 2), catatan pembicara |
| `/references` | Sumber publik, label bukti, glosarium, rumus |

### Dashboard (tiga workspace terpisah)
| Route | Isi |
|---|---|
| `/dashboard` | **Super Admin** — ringkasan portofolio & mode strategi aktif |
| `/dashboard/strategy` | Kontrol Strategi: pilih mode Overview / ONE / ACE (berlaku di seluruh situs) |
| `/dashboard/simulator` | Simulator finansial ONE vs ACE (preset, sensitivitas, rumus, unduh JSON) |
| `/dashboard/operations` | Kapasitas tim, anggaran, sprint board, rekomendasi |
| `/dashboard/portfolio` | KPI, grafik, decision gate portofolio |
| `/dashboard/events/*` | **Terang Events** — ringkasan, daftar event, buat event (`?template=`), template, repeat planner (`?source=`), peserta, penjurian, analitik, keuangan, portal peserta |
| `/dashboard/interview/*` | **AI Candidate Interview** — ringkasan, lowongan, builder (`?job=`), kandidat, laporan bukti (`?candidate=`), Responsible AI, portal kandidat |

Route lama (`/demo/events`, `/demo/interview`, `/operations`, `/portfolio`, `/compare`) dialihkan ke route baru.

## Tampilan
- Tema terang & gelap (tombol matahari/bulan di header). Default mengikuti pengaturan OS; pilihan disimpan di localStorage.
- Sidebar dashboard bisa dikecilkan (ikon saja, dengan tooltip); status disimpan di localStorage.
- Smooth scrolling (Lenis) di situs publik, otomatis nonaktif bila `prefers-reduced-motion`.

## Yang disimulasikan
Generator pertanyaan, follow-up, dan penilaian kandidat adalah **aturan deterministik** (bukan AI).
Pembayaran, email, unggah berkas, dan payout tidak nyata. Semua angka finansial adalah asumsi ilustratif
(`src/data/scenarios.ts`, mesin di `src/lib/finance.ts`).

## Kerahasiaan
Jangan deploy publik tanpa pembatasan akses di level platform; `robots: noindex` sudah diset tetapi bukan mekanisme keamanan.
