# Rangkuman Isi Slide *Data Insight* — Survei Terang AI

Panduan ini memetakan setiap kotak di template `data-slide.png` ke angka dari survei Terang AI. Sumbernya `dataset.csv`, yang diolah di `terang-ai-survey-analysis.ipynb` dengan n = 113 responden Google Form yang mengisi pada 24 Oktober 2026. Semua angka sudah dihitung ulang dari dataset, jadi bisa langsung dipakai.

---

## 1. Logika slide: dari template Garuda ke Terang AI

Template aslinya punya 3 kolom:

| Kolom template | Fungsi | Padanan untuk Terang AI |
|---|---|---|
| **Kiri:** *Respondent Segmentation Profile* + 1 angka besar + 1 kotak *gap* | Siapa responden & 2 temuan paling tajam | Profil responden + **masalah Events (manual)** + **gap AI Interview (feedback)** |
| **Tengah:** segmen 1 (*Occasional Flyers*) | 2 blok bar: apa yang dihargai & alasan memilih | **AI Candidate Interview: kandidat** (tantangan + fitur yang dibutuhkan) |
| **Kanan:** segmen 2 (*Frequent Flyers*) | 2 blok bar dengan pertanyaan yang sama | **Terang Events: pengelola acara** (tantangan + fitur yang dibutuhkan) |

**Kenapa kolom tengah dan kanan dibagi per produk, bukan per segmen usia/pekerjaan?** Studi kasusnya tentang dilema **AI Candidate Interview vs Terang Events**. Dengan dua kolom yang strukturnya sama, juri bisa membandingkan masalah dan kebutuhan kedua produk berdampingan. Slide ini jadi fondasi data untuk ONE (fokus AI Interview) maupun ACE (dua produk terkoordinasi).

**Kesalahan di template yang jangan ikut tersalin:** label kecil di bawah header tertukar. "Occasional & Regular Flyers" diberi label *4+ flights/yr*, sedangkan "Frequent Flyers" diberi label *≤ 3 flights/yr*. Pastikan label basis responden (n) di slide Terang AI sesuai dengan kolomnya.

---

## 2. Isi slide, kotak demi kotak

### 2.1 Kolom KIRI — Profil Segmentasi Responden

#### Header
| Template | Ganti menjadi (ID) | Versi EN |
|---|---|---|
| Respondent Segmentation Profile (64) | **Profil Segmentasi Responden (113)** | **Respondent Segmentation Profile (113)** |

#### Tiga kotak profil
| Label kiri (template → baru) | Teks tebal | Teks kecil | Versi EN |
|---|---|---|---|
| Age → **Usia** | **17 – 29 tahun** | N = 78 Responden (69%) | *17 – 29 years old · N = 78 Respondents (69%)* |
| Life Stage → **Tahap Karier** | **Mahasiswa / Fresh Graduate** | N = 65 Responden (58%) | *University Student / Fresh Graduate · N = 65 Respondents (58%)* |
| When Fly? → **Irisan Kebutuhan** | **Wawancara + Acara** | N = 94 Responden (83%) | *Dual Need: Interview + Events · N = 94 Respondents (83%)* |

Rincian angka:
- **Usia**: 17–29 (78), 30–45 (20), < 17 (9), 46–61 (6).
- **Tahap karier**: Mahasiswa 47 + Fresh graduate 18 = 65. Sisanya karyawan/profesional 25, siswa SMA/SMK 11, pengusaha 9, lainnya 3.
- **Irisan kebutuhan**: 94 responden pernah menyiapkan wawancara dalam 2 tahun terakhir *dan* pernah terlibat acara.
  - Kotak ini yang paling strategis: pengguna kedua produk sebagian besar orang yang sama.
  - Ini menjadi bukti kuat untuk ACE (*Coordinate Markets*).
  - Untuk ONE, angka yang sama bisa dibaca sebagai "pasar kandidat sudah ada di dalam ekosistem acara kampus".
- **Alternatif kotak ke-3** (kalau ingin meniru konteks "When Fly?" persis): Label **Butuh Saat?** → **Melamar Kerja / Magang**, N = 67 Responden (59%). Angkanya dari melamar pekerjaan 44 + mendaftar magang 23.

#### Angka besar (pengganti "92% OTA-First Discovery")
| Elemen | Ganti menjadi (ID) | Versi EN |
|---|---|---|
| Angka | **80%** | **80%** |
| Judul miring | ***Manual-First* Event Ops** | ***Manual-First* Event Ops** |
| Kalimat | **pengelola acara masih mengelola pendaftaran** lewat **Google Forms/Sheets (55%)** atau **WhatsApp/media sosial (25%)**, dan **hanya 20% yang memakai platform manajemen acara khusus.** | ***of event organizers still run registration*** *on* ***Google Forms/Sheets (55%)*** *or* ***WhatsApp/social media (25%)*** *— and* ***only 20% use a dedicated event-management platform.*** |

Basis angkanya adalah 75 responden yang pernah mengelola pendaftaran/administrasi acara (41 Google Forms, 19 WhatsApp, 15 platform khusus). Polanya sama dengan "92% OTA-first" di template: perilaku saat ini masih bergantung pada alat yang **bukan solusi khusus**, sehingga ada celah pasar untuk Terang Events.

#### Kotak *gap* (pengganti "50% → 16% Graduation Gap")
| Elemen | Ganti menjadi (ID) | Versi EN |
|---|---|---|
| Angka | **73% → 13%** | **73% → 13%** |
| Judul miring | ***Feedback Gap*** | ***Feedback Gap*** |
| Kalimat | **73% responden membutuhkan feedback & evaluasi jawaban**, tetapi **hanya 13% yang sudah berlatih wawancara dengan AI.** 36% masih berlatih sendiri tanpa evaluator, dan *feedback* objektif (30%) lebih dipertimbangkan daripada harga murah/gratis (23%). | ***73% of respondents need answer feedback & evaluation,*** *yet* ***only 13% already practice interviews with AI.*** *36% still practice alone with no evaluator, and objective feedback (30%) outweighs low/free price (23%) as the reason to try.* |

Ini padanan "Graduation Gap" di template: dua angka yang menunjukkan **jarak antara kebutuhan dan perilaku saat ini**. Kalimat terakhir (nilai lebih penting daripada harga) memperkuat argumen monetisasi AI Candidate Interview untuk ONE (*Optimize Product Value*).

**Alternatif angka gap** kalau ingin menyorot rasa percaya diri:
- **44% → 13%** — 44% kurang percaya diri, tetapi hanya 13% yang memakai AI untuk latihan.
- Versi 73% → 13% tetap direkomendasikan karena selisihnya paling tajam.

---

### 2.2 Kolom TENGAH — AI Candidate Interview

#### Header + label kecil
| Template | Ganti menjadi (ID) | Versi EN |
|---|---|---|
| Occasional & Regular Flyers (n = 45) | **AI Candidate Interview — Kandidat (n = 103)** | **AI Candidate Interview — Candidates (n = 103)** |
| 4+ flights/yr | *pernah menyiapkan wawancara (2 thn terakhir)* | *prepared for an interview in the last 2 yrs* |

Basisnya 103 responden yang pernah menyiapkan wawancara. Dari 113 responden, hanya 10 yang belum pernah, dan 7 di antaranya siswa SMA/SMK.

#### Blok 1 — pengganti "What Makes a Premium Fare Worth It"
**Judul: Tantangan Terbesar Persiapan Wawancara** · *EN: Biggest Interview-Prep Challenges*

| Bar | Label (ID) | Label (EN) | Nilai |
|---|---|---|---|
| 1 | Kurang percaya diri | Lack of confidence | **46%** |
| 2 | Sulit mendapat feedback | Hard to get feedback | **45%** |
| 3 | Tidak punya partner latihan | No practice partner | **36%** |
| 4 | Sulit menyusun jawaban | Hard to structure answers | **36%** |

Pertanyaan ini multi-pilih. Hanya 3% kandidat yang mengaku tidak punya kendala. Keempat masalah ini bisa diselesaikan oleh simulasi + *feedback* AI.

#### Blok 2 — pengganti "Would Still Choose a Pricier Garuda For…"
**Judul: Fitur yang Paling Dibutuhkan** · *EN: Most-Needed Features*

| Bar | Label (ID) | Label (EN) | Nilai |
|---|---|---|---|
| 1 | Simulasi sesuai pekerjaan / beasiswa yang dituju | Role- / scholarship-specific simulation | **76%** |
| 2 | Feedback & evaluasi jawaban | Answer feedback & evaluation | **71%** |
| 3 | Rekomendasi perbaikan yang personal | Personalized improvement tips | **71%** |
| 4 | Simulasi wawancara menggunakan suara | Voice-based mock interview | **67%** |

Fitur ke-5, *Skor performa wawancara* (62%), sengaja tidak ditampilkan karena template hanya punya 4 bar.

---

### 2.3 Kolom KANAN — Terang Events

#### Header + label kecil
| Template | Ganti menjadi (ID) | Versi EN |
|---|---|---|
| Frequent Flyers (n = 19) | **Terang Events — Pengelola Acara (n = 75)** | **Terang Events — Event Organizers (n = 75)** |
| ≤ 3 flights/yr | *pernah mengelola pendaftaran/administrasi acara* | *have managed event registration/admin* |

Basisnya 75 responden yang pernah mengelola acara, yaitu calon pengguna dan pembeli B2B Terang Events.

#### Blok 1 — pengganti "What Makes a Premium Fare Worth It"
**Judul: Tantangan Terbesar Penyelenggaraan Acara** · *EN: Biggest Event-Management Challenges*

| Bar | Label (ID) | Label (EN) | Nilai |
|---|---|---|---|
| 1 | Mengelola pendaftaran & data peserta | Managing registration & participant data | **32%** |
| 2 | Mengurus sertifikat & administrasi | Handling certificates & admin | **24%** |
| 3 | Mengoordinasikan panitia | Coordinating the committee | **16%** |
| 4 | Mengumpulkan & menilai karya | Collecting & judging submissions | **15%** |

**Perhatian:** pertanyaan ini **pilihan tunggal**, sehingga persentasenya terlihat lebih kecil daripada tantangan wawancara yang multi-pilih. Tambahkan catatan kecil "*pilihan tunggal*" di bawah judul blok supaya juri tidak salah membandingkan.

Opsi ke-5, *Mengelola pembayaran/tiket* (13%), tidak ditampilkan.

#### Blok 2 — pengganti "Would Still Choose a Pricier Garuda For…"
**Judul: Fitur yang Paling Dibutuhkan** · *EN: Most-Needed Features*

| Bar | Label (ID) | Label (EN) | Nilai |
|---|---|---|---|
| 1 | Pendaftaran peserta online | Online participant registration | **85%** |
| 2 | Pengumpulan karya & pelacakan review | Submission collection & review tracking | **81%** |
| 3 | Pengelolaan tiket / pembayaran | Ticketing / payment management | **63%** |
| 4 | *(opsional)* Menilai platform terintegrasi bermanfaat (skor 4–5) | *Rate an all-in-one platform useful (4–5)* | **75%** |

Pertanyaan fitur Events hanya punya **3 opsi**. Ada dua cara mengisi bar ke-4:
- **(a) Direkomendasikan:** hapus bar ke-4 dan perbesar jarak antar-bar supaya tetap rapi. Ini paling jujur secara data.
- **(b)** Isi dengan indikator manfaat (75%), tetapi beri warna atau garis pemisah berbeda karena bukan fitur.

---

### 2.4 Tambahan yang disarankan (memperkuat perbandingan)

Di bawah setiap header kolom, tambahkan satu baris kecil berisi minat dan manfaat. Baris ini menunjukkan bahwa kedua produk punya permintaan yang hampir setara, yang menjadi inti dilema ONE vs ACE.

| Kolom | Teks (ID) | Versi EN |
|---|---|---|
| Tengah | **Berminat mencoba: 67% · Melihat manfaat: 72%** | *Likely to try: 67% · See value: 72%* |
| Kanan | **Berminat menggunakan: 71% · Melihat manfaat: 75%** | *Likely to use: 71% · See value: 75%* |

Kedua angka diukur sebagai skor 4–5 pada skala 1–5, masing-masing dihitung pada basis kolomnya (n = 103 dan n = 75).

### 2.5 Catatan kaki (pengganti kalimat miring di bawah)
| Template | Ganti menjadi (ID) | Versi EN |
|---|---|---|
| *The survey was conducted independently by the team and distributed primarily to students.* | *Survei dilakukan secara independen oleh tim melalui Google Form (n = 113, 24 Oktober 2026) dan didistribusikan terutama kepada mahasiswa & fresh graduate. Pertanyaan tantangan wawancara & fitur bersifat multi-pilih sehingga total dapat melebihi 100%.* | *The survey was conducted independently by the team via Google Form (n = 113, 24 Oct 2026) and distributed primarily to university students and fresh graduates. Interview-challenge and feature questions are multi-select, so totals may exceed 100%.* |

---

## 3. Kenapa poin-poin ini kuat untuk ONE dan ACE

| Kotak di slide | Pesan untuk **ONE** (fokus AI Interview) | Pesan untuk **ACE** (dua produk terkoordinasi) |
|---|---|---|
| Profil 17–29 & Mahasiswa/FG | Pasar inti adalah pencari kerja/magang yang butuh wawancara berulang | Segmen yang sama juga paling aktif di acara kampus |
| Irisan 83% | Kandidat bisa dijangkau lewat ekosistem kampus | **Satu basis pengguna untuk dua produk**: akuisisi dan *cross-sell* bersama |
| 80% Manual-First | — | Pasar Events masih *underserved*, jadi meninggalkannya berarti melepas peluang |
| 73% → 13% Feedback Gap | **Whitespace AI** besar dan nilai lebih penting daripada harga | Mesin *feedback*/penilaian AI bisa dipakai bersama untuk review karya di Events |
| Kolom tengah vs kanan | Masalah wawancara lebih merata (4 kendala 36–46%) | Kebutuhan fitur Events sangat terkonsentrasi (registrasi 85%), sehingga MVP mudah didefinisikan |

**Kalimat lisan yang bisa diucapkan saat presentasi:**
> "Responden kami adalah generasi transisi kampus–karier: 69% berusia 17–29 dan 83% punya **dua kebutuhan sekaligus**, yaitu wawancara dan acara. Di sisi Events, 80% pengelola masih manual. Di sisi wawancara, 73% butuh *feedback*, tetapi baru 13% yang memakai AI. Kedua celah ini nyata. Pertanyaannya bukan *apakah* ada pasar, melainkan *bagaimana* Terang AI memprioritaskannya."

---

## 4. Hal yang JANGAN ditulis di slide

1. **Jangan menulis "Terang Events lebih diminati" tanpa catatan.**
   - Events memang dipilih 36 responden dan AI Interview 28, tetapi selisihnya **tidak signifikan** (uji binomial p = 0,38).
   - Kalau perbandingan ini mau ditampilkan, tulis "**40% menilai keduanya sama relevan**" sebagai angka utama.
2. **Jangan membandingkan langsung bar tantangan tengah dan kanan.** Tantangan wawancara multi-pilih, sedangkan tantangan acara pilihan tunggal.
3. **Jangan mengklaim angka sebagai *willingness to pay* B2B.** Responden adalah pengguna akhir (kandidat, panitia), bukan HR atau institusi pembeli.
4. **Jangan memakai basis n yang berbeda dalam satu kolom.**
   - Kolom tengah konsisten memakai n = 103 dan kolom kanan n = 75.
   - Angka di kolom kiri memakai n = 113, kecuali angka 80% yang memakai basis 75 pengelola dan sudah disebut di kalimatnya.

---

## 5. Cek silang ke notebook (`terang-ai-survey-analysis.ipynb`)

| Angka di slide | Grafik pendukung di `figures/terang-ai/` |
|---|---|
| 113 responden, 69% usia 17–29, 83% irisan | `01_ringkasan_survei.png`, `02_profil_usia_pekerjaan.png`, `04_pengalaman_wawancara_acara.png` |
| 80% pengelola manual (55% / 25% / 20%) | `11_ev_tantangan_tools.png` |
| 73% butuh feedback, 13% pakai AI, 30% vs 23% | `06_ai_perilaku_latihan.png`, `07_ai_fitur_pertimbangan.png`, `08_ai_pain_to_solution.png` |
| Tantangan & fitur AI Interview | `05_ai_tantangan_wawancara.png`, `07_ai_fitur_pertimbangan.png` |
| Tantangan & fitur Terang Events | `11_ev_tantangan_tools.png`, `12_ev_fitur_minat.png` |
| Minat & manfaat kedua produk | `14_likert_diverging.png`, `28_scorecard_produk.png` |

Grafik di notebook memakai basis seluruh responden (n = 113), sedangkan kolom tengah dan kanan di slide memakai subset kandidat (n = 103) dan pengelola acara (n = 75). Akibatnya ada selisih kecil: misalnya fitur *feedback* tercatat 73% di notebook dan 71% di slide. Ini wajar karena basisnya lebih tepat sasaran. Semua angka subset di dokumen ini sudah dihitung ulang dari `dataset.csv`.
