import type { Candidate, Competency, InterviewQuestion, JobPosition, RoleKey, AuditEntry } from "@/types/interview";

/* All records below are FICTIONAL demo data (synthetic-demo). No real candidates. */

const rubric = (l1: string, l2: string, l3: string, l4: string): Competency["rubric"] => [
  { level: 1, label: "Belum terlihat", descriptor: l1 },
  { level: 2, label: "Berkembang", descriptor: l2 },
  { level: 3, label: "Cakap", descriptor: l3 },
  { level: 4, label: "Kuat", descriptor: l4 },
];

export const COMPETENCIES: Competency[] = [
  {
    id: "komunikasi",
    name: "Komunikasi Efektif",
    description: "Menyampaikan informasi secara jelas, terstruktur, dan sesuai audiens.",
    rubric: rubric(
      "Jawaban tidak terstruktur atau tidak menjawab pertanyaan.",
      "Pesan utama ada, tetapi kurang runtut atau kurang contoh.",
      "Runtut, jelas, dan memberi contoh yang relevan.",
      "Sangat jelas, menyesuaikan audiens, dan memeriksa pemahaman lawan bicara.",
    ),
    keywords: ["jelaskan", "menjelaskan", "sampaikan", "komunikasi", "pahami", "dengarkan", "konfirmasi", "ringkas"],
  },
  {
    id: "empati",
    name: "Empati Pelanggan",
    description: "Memahami kebutuhan dan emosi pelanggan serta merespons dengan tepat.",
    rubric: rubric(
      "Tidak menunjukkan perhatian pada sudut pandang pelanggan.",
      "Menyebut pelanggan, tetapi respons masih generik.",
      "Mengakui perasaan pelanggan dan menyesuaikan solusi.",
      "Proaktif mengantisipasi kebutuhan & menjaga hubungan jangka panjang.",
    ),
    keywords: ["pelanggan", "mendengarkan", "memahami", "maaf", "kecewa", "perasaan", "kebutuhan", "nyaman"],
  },
  {
    id: "pemecahan-masalah",
    name: "Pemecahan Masalah",
    description: "Mengidentifikasi akar masalah, menimbang opsi, dan mengambil tindakan.",
    rubric: rubric(
      "Tidak ada langkah penyelesaian yang jelas.",
      "Ada tindakan, tetapi tanpa analisis penyebab.",
      "Menganalisis penyebab, memilih solusi, dan menjelaskan hasil.",
      "Menimbang beberapa opsi, mengukur hasil, dan mencegah masalah berulang.",
    ),
    keywords: ["masalah", "penyebab", "solusi", "analisis", "langkah", "opsi", "cek", "evaluasi", "mencegah"],
  },
  {
    id: "adaptabilitas",
    name: "Adaptabilitas",
    description: "Menyesuaikan diri dengan perubahan prioritas, situasi, atau tekanan.",
    rubric: rubric(
      "Menolak atau kesulitan dengan perubahan.",
      "Menerima perubahan, tetapi lambat menyesuaikan.",
      "Menyesuaikan rencana dengan tenang dan tetap produktif.",
      "Menjadikan perubahan peluang perbaikan dan membantu tim beradaptasi.",
    ),
    keywords: ["berubah", "perubahan", "menyesuaikan", "fleksibel", "belajar", "tekanan", "baru", "cepat"],
  },
  {
    id: "orientasi-target",
    name: "Orientasi Target",
    description: "Menetapkan dan mengejar target terukur dengan inisiatif.",
    rubric: rubric(
      "Tidak menyebut target atau hasil.",
      "Menyebut target secara umum tanpa angka.",
      "Menyebut target terukur dan upaya mencapainya.",
      "Melampaui target secara konsisten dengan strategi yang jelas.",
    ),
    keywords: ["target", "persen", "%", "meningkat", "capaian", "kuota", "melampaui", "hasil", "omzet"],
  },
  {
    id: "negosiasi",
    name: "Negosiasi & Persuasi",
    description: "Memengaruhi keputusan dengan argumen bernilai sambil menjaga hubungan.",
    rubric: rubric(
      "Tidak menunjukkan upaya meyakinkan.",
      "Meyakinkan dengan argumen umum.",
      "Menggali kebutuhan dan menawarkan nilai yang relevan.",
      "Menemukan solusi win-win dan menangani keberatan dengan baik.",
    ),
    keywords: ["menawarkan", "keberatan", "meyakinkan", "nilai", "manfaat", "kesepakatan", "diskon", "kebutuhan"],
  },
  {
    id: "ketelitian",
    name: "Ketelitian",
    description: "Bekerja akurat, memeriksa detail, dan mengikuti prosedur.",
    rubric: rubric(
      "Tidak menunjukkan perhatian pada detail.",
      "Memeriksa detail sesekali.",
      "Memiliki cara memeriksa ulang yang konsisten.",
      "Membangun sistem kontrol untuk mencegah kesalahan.",
    ),
    keywords: ["cek", "periksa", "detail", "akurat", "teliti", "prosedur", "checklist", "kesalahan", "data"],
  },
  {
    id: "organisasi",
    name: "Manajemen Waktu & Prioritas",
    description: "Mengatur prioritas dan tenggat secara efektif.",
    rubric: rubric(
      "Tidak ada cara mengatur prioritas.",
      "Mengatur tugas, tetapi reaktif.",
      "Memprioritaskan berdasarkan urgensi & dampak.",
      "Merencanakan proaktif dan mengomunikasikan trade-off.",
    ),
    keywords: ["prioritas", "jadwal", "tenggat", "deadline", "rencana", "urutan", "waktu", "daftar"],
  },
  {
    id: "kolaborasi",
    name: "Kolaborasi",
    description: "Bekerja sama lintas fungsi untuk mencapai tujuan bersama.",
    rubric: rubric(
      "Cenderung bekerja sendiri tanpa koordinasi.",
      "Berkoordinasi ketika diminta.",
      "Aktif berbagi informasi dan membantu rekan.",
      "Menyatukan tim lintas fungsi dan menyelesaikan konflik.",
    ),
    keywords: ["tim", "bersama", "rekan", "koordinasi", "kolaborasi", "membantu", "diskusi", "divisi"],
  },
];

export const COMPETENCY_MAP = Object.fromEntries(COMPETENCIES.map((c) => [c.id, c])) as Record<string, Competency>;

/** Predefined question bank per role — the "generator" picks from here deterministically. */
export const QUESTION_BANK: Record<string, { text: string; followUp: string }[]> = {
  komunikasi: [
    { text: "Ceritakan saat Anda harus menjelaskan informasi yang rumit kepada orang yang awam. Bagaimana Anda melakukannya?", followUp: "Bagaimana Anda memastikan orang tersebut benar-benar paham?" },
    { text: "Bagaimana Anda menyampaikan kabar yang kurang menyenangkan kepada pelanggan atau atasan?", followUp: "Apa reaksi mereka dan apa yang Anda lakukan setelahnya?" },
    { text: "Ceritakan pengalaman ketika terjadi salah paham dalam komunikasi. Apa yang Anda pelajari?", followUp: "Apa yang akan Anda lakukan berbeda sekarang?" },
  ],
  empati: [
    { text: "Ceritakan saat Anda menghadapi pelanggan yang kecewa. Apa yang Anda lakukan?", followUp: "Bagaimana Anda tahu pelanggan tersebut merasa didengarkan?" },
    { text: "Bagaimana Anda menangani pelanggan yang kebutuhannya tidak bisa dipenuhi sepenuhnya?", followUp: "Alternatif apa yang Anda tawarkan?" },
    { text: "Ceritakan saat Anda melakukan sesuatu di luar tugas untuk membantu pelanggan.", followUp: "Apa dampaknya bagi pelanggan dan tim?" },
  ],
  "pemecahan-masalah": [
    { text: "Ceritakan masalah operasional yang pernah Anda selesaikan. Bagaimana Anda menemukan penyebabnya?", followUp: "Bagaimana Anda memastikan masalah itu tidak terulang?" },
    { text: "Saat ada dua solusi yang sama-sama masuk akal, bagaimana Anda memilih?", followUp: "Data apa yang Anda gunakan untuk memutuskan?" },
    { text: "Ceritakan keputusan yang harus Anda ambil dengan informasi terbatas.", followUp: "Apa hasilnya dan apa yang Anda pelajari?" },
  ],
  adaptabilitas: [
    { text: "Ceritakan saat prioritas pekerjaan Anda berubah mendadak. Bagaimana Anda menyesuaikan diri?", followUp: "Apa yang membantu Anda tetap produktif?" },
    { text: "Bagaimana Anda mempelajari sistem atau alat kerja baru dalam waktu singkat?", followUp: "Berapa lama sampai Anda benar-benar mahir?" },
    { text: "Ceritakan saat Anda bekerja di bawah tekanan tenggat yang ketat.", followUp: "Apa hasil akhirnya?" },
  ],
  "orientasi-target": [
    { text: "Ceritakan target tersulit yang pernah Anda capai. Bagaimana strateginya?", followUp: "Berapa persen capaian Anda dibanding target?" },
    { text: "Apa yang Anda lakukan ketika di tengah periode Anda tertinggal dari target?", followUp: "Langkah apa yang paling berdampak?" },
    { text: "Bagaimana Anda memantau progres terhadap target harian atau mingguan?", followUp: "Alat atau kebiasaan apa yang Anda gunakan?" },
  ],
  negosiasi: [
    { text: "Ceritakan saat Anda berhasil meyakinkan calon pelanggan yang awalnya ragu.", followUp: "Keberatan utama apa yang Anda tangani?" },
    { text: "Bagaimana Anda merespons pelanggan yang meminta diskon besar?", followUp: "Nilai apa yang Anda tekankan selain harga?" },
    { text: "Ceritakan negosiasi yang tidak berjalan sesuai rencana.", followUp: "Apa yang Anda pelajari dari situ?" },
  ],
  ketelitian: [
    { text: "Ceritakan bagaimana Anda memastikan data atau dokumen yang Anda kerjakan akurat.", followUp: "Pernahkah cara itu mencegah kesalahan besar?" },
    { text: "Ceritakan saat Anda menemukan kesalahan yang terlewat oleh orang lain.", followUp: "Apa tindak lanjut yang Anda lakukan?" },
    { text: "Bagaimana Anda menjaga ketelitian saat volume pekerjaan sangat tinggi?", followUp: "Apa checklist atau prosedur yang Anda gunakan?" },
  ],
  organisasi: [
    { text: "Bagaimana Anda memprioritaskan pekerjaan ketika beberapa tenggat jatuh bersamaan?", followUp: "Bagaimana Anda mengomunikasikan prioritas itu ke atasan?" },
    { text: "Ceritakan proyek yang Anda rencanakan dari awal hingga selesai.", followUp: "Bagian mana yang paling sulit dijadwalkan?" },
    { text: "Apa yang Anda lakukan bila pekerjaan mendadak masuk di tengah jadwal padat?", followUp: "Apa trade-off yang Anda ambil?" },
  ],
  kolaborasi: [
    { text: "Ceritakan saat Anda bekerja dengan divisi lain untuk menyelesaikan tugas bersama.", followUp: "Bagaimana Anda menangani perbedaan pendapat?" },
    { text: "Bagaimana Anda membantu rekan tim yang sedang kewalahan?", followUp: "Apa dampaknya terhadap hasil tim?" },
    { text: "Ceritakan konflik dalam tim yang pernah Anda bantu selesaikan.", followUp: "Apa peran spesifik Anda?" },
  ],
};

export const ROLE_TEMPLATES: Record<RoleKey, { label: string; department: string; description: string; competencies: { id: string; weight: number }[] }> = {
  "customer-service": {
    label: "Customer Service Representative",
    department: "Layanan Pelanggan",
    description: "Menangani pertanyaan & keluhan pelanggan melalui chat, telepon, dan email dengan standar layanan yang konsisten.",
    competencies: [
      { id: "komunikasi", weight: 30 },
      { id: "empati", weight: 30 },
      { id: "pemecahan-masalah", weight: 25 },
      { id: "adaptabilitas", weight: 15 },
    ],
  },
  "sales-associate": {
    label: "Sales Associate",
    department: "Penjualan",
    description: "Menjangkau calon pelanggan, mempresentasikan produk, dan mencapai target penjualan bulanan.",
    competencies: [
      { id: "orientasi-target", weight: 30 },
      { id: "negosiasi", weight: 30 },
      { id: "komunikasi", weight: 25 },
      { id: "adaptabilitas", weight: 15 },
    ],
  },
  "operations-assistant": {
    label: "Operations Assistant",
    department: "Operasional",
    description: "Mendukung operasional harian: administrasi data, koordinasi jadwal, dan pengendalian kualitas proses.",
    competencies: [
      { id: "ketelitian", weight: 30 },
      { id: "organisasi", weight: 30 },
      { id: "pemecahan-masalah", weight: 20 },
      { id: "kolaborasi", weight: 20 },
    ],
  },
};

/** Deterministic "assistant" — builds a question set from the predefined bank. */
export function generateQuestions(competencies: { id: string }[], variant = 0): InterviewQuestion[] {
  return competencies.map((c, i) => {
    const bank = QUESTION_BANK[c.id] ?? [];
    const pick = bank[(variant + i) % Math.max(1, bank.length)] ?? { text: "Ceritakan pengalaman relevan Anda.", followUp: "Apa hasilnya?" };
    return { id: `q-${c.id}-${variant}-${i}`, competencyId: c.id, text: pick.text, followUp: pick.followUp };
  });
}

export const RECRUITER_COMPANY = "PT Sinar Ritel Nusantara (fiktif)";

export const SEED_JOBS: JobPosition[] = (Object.keys(ROLE_TEMPLATES) as RoleKey[]).map((role, i) => {
  const t = ROLE_TEMPLATES[role];
  return {
    id: `job-${role}`,
    title: t.label,
    role,
    department: t.department,
    location: ["Jakarta", "Surabaya", "Bandung"][i],
    description: t.description,
    competencies: t.competencies,
    durationMinutes: [20, 25, 20][i],
    questions: generateQuestions(t.competencies, 0),
    status: "aktif",
    createdAt: `2026-10-0${i + 2}`,
  };
});

const CANDIDATE_NAMES = [
  "Rani Ayuningtyas",
  "Fajar Maulana",
  "Intan Permatasari",
  "Yusuf Hakim",
  "Melati Kusumawardani",
  "Dewa Prasetya",
  "Nurul Aini",
  "Arif Setiawan",
  "Sekar Pertiwi",
  "Bayu Adinata",
  "Clara Situmorang",
  "Galih Firmansyah",
];

const SAMPLE_ANSWERS: Record<string, string[]> = {
  komunikasi: [
    "Saat magang, saya menjelaskan proses klaim garansi kepada pelanggan lansia. Saya memecah langkah menjadi tiga bagian, memakai contoh sederhana, lalu meminta beliau mengulang untuk konfirmasi. Hasilnya klaim selesai di hari yang sama.",
    "Saya biasanya langsung menjelaskan saja apa yang perlu dilakukan.",
  ],
  empati: [
    "Ada pelanggan yang kecewa karena pesanan terlambat. Saya mendengarkan dulu tanpa memotong, meminta maaf, lalu memahami kebutuhan utamanya yaitu barang dipakai untuk acara besok. Saya koordinasikan pengiriman prioritas sehingga barang tiba pagi hari.",
    "Saya minta pelanggan menunggu dan memberi tahu bahwa itu kebijakan perusahaan.",
  ],
  "pemecahan-masalah": [
    "Di organisasi kampus, pendaftaran acara sering ganda. Saya analisis penyebabnya: formulir tidak mengecek email. Saya usulkan validasi email dan checklist, sehingga data ganda turun sekitar 80% di acara berikutnya.",
    "Saya bertanya ke atasan lalu mengikuti arahannya.",
  ],
  adaptabilitas: [
    "Ketika sistem kasir berubah mendadak, saya belajar dari manual di malam hari dan membuat ringkasan untuk tim. Dalam seminggu kami sudah lancar dan antrean kembali normal.",
    "Awalnya saya bingung tapi lama-lama terbiasa.",
  ],
  "orientasi-target": [
    "Target saya 40 akun baru per bulan. Saya membuat daftar prioritas prospek dan follow-up terjadwal, hasilnya capaian 118% dari target selama tiga bulan berturut-turut.",
    "Saya selalu berusaha mencapai target yang diberikan.",
  ],
  negosiasi: [
    "Calon pelanggan ragu karena harga. Saya menggali kebutuhannya, lalu menawarkan paket dengan manfaat pelatihan gratis. Keberatan utamanya soal biaya implementasi, dan kami capai kesepakatan dengan termin pembayaran.",
    "Saya menjelaskan produk sebaik mungkin.",
  ],
  ketelitian: [
    "Saya selalu cek ulang data inventaris dengan checklist dan membandingkan dengan laporan sistem. Cara ini pernah menemukan selisih stok sebelum laporan bulanan dikirim.",
    "Saya berusaha teliti dalam bekerja.",
  ],
  organisasi: [
    "Saya membuat daftar prioritas berdasarkan tenggat dan dampak, lalu mengomunikasikan jadwal ke atasan. Saat dua deadline bertabrakan, saya negosiasikan urutan dan semua selesai tepat waktu.",
    "Saya mengerjakan yang paling dulu datang.",
  ],
  kolaborasi: [
    "Saya berkoordinasi dengan tim gudang dan divisi keuangan untuk merapikan proses retur. Kami diskusi mingguan dan membuat alur bersama, sehingga waktu proses turun dari 5 hari menjadi 2 hari.",
    "Saya membantu tim jika diminta.",
  ],
};

const STATUS_ORDER: Candidate["status"][] = ["ditinjau", "selesai", "selesai", "follow-up", "berlangsung", "diundang", "selesai", "ditinjau", "diundang", "selesai", "berlangsung", "diundang"];

export const SEED_CANDIDATES: Candidate[] = CANDIDATE_NAMES.map((name, i) => {
  const job = SEED_JOBS[i % SEED_JOBS.length];
  const status = STATUS_ORDER[i];
  const completed = status === "selesai" || status === "ditinjau" || status === "follow-up";
  const strong = i % 3 !== 2;
  const transcript = completed
    ? job.questions.map((q, qi) => ({
        questionId: q.id,
        question: q.text,
        answer: SAMPLE_ANSWERS[q.competencyId]?.[strong || qi % 2 === 0 ? 0 : 1] ?? "",
      }))
    : [];
  return {
    id: `cd-${i + 1}`,
    name,
    jobId: job.id,
    email: `${name.toLowerCase().split(" ")[0]}@contoh-kandidat.id`,
    invitedAt: `2026-10-${String(5 + i).padStart(2, "0")}`,
    completedAt: completed ? `2026-10-${String(8 + i).padStart(2, "0")}` : undefined,
    status,
    flagged: i === 3,
    evidence: [],
    transcript,
    notes:
      status === "ditinjau"
        ? [{ id: `n-${i}`, author: "Recruiter Demo", text: "Bukti kompetensi konsisten dengan rubrik. Lanjut ke wawancara user.", at: `2026-10-${String(10 + i).padStart(2, "0")}T10:00:00` }]
        : [],
    overrides: {},
  };
});

export const SEED_AUDIT: AuditEntry[] = [
  { id: "a1", at: "2026-10-18T09:12:00", actor: "Recruiter Demo", action: "Melihat laporan", target: "Rani Ayuningtyas" },
  { id: "a2", at: "2026-10-18T09:20:00", actor: "Recruiter Demo", action: "Menandai selesai ditinjau", target: "Rani Ayuningtyas" },
  { id: "a3", at: "2026-10-17T15:02:00", actor: "HR Lead Demo", action: "Mengubah bobot kompetensi", target: "Sales Associate" },
  { id: "a4", at: "2026-10-16T11:45:00", actor: "Sistem (simulasi)", action: "Menghapus rekaman sesuai retensi", target: "3 sesi > 90 hari" },
];
