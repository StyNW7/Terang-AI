import type { Candidate, Competency, InterviewQuestion, JobPosition, RoleKey, AuditEntry } from "@/types/interview";
import { L, type Bilingual, type Txt } from "@/lib/i18n-core";

/* All records below are FICTIONAL demo data (synthetic-demo). No real candidates. */

const rubric = (l1: Bilingual, l2: Bilingual, l3: Bilingual, l4: Bilingual): Competency["rubric"] => [
  { level: 1, label: L("Belum terlihat", "Not yet shown"), descriptor: l1 },
  { level: 2, label: L("Berkembang", "Developing"), descriptor: l2 },
  { level: 3, label: L("Cakap", "Proficient"), descriptor: l3 },
  { level: 4, label: L("Kuat", "Strong"), descriptor: l4 },
];

/** Keywords cover both languages so the rule-based demo assessment works on ID and EN answers. */
export const COMPETENCIES: Competency[] = [
  {
    id: "komunikasi",
    name: L("Komunikasi Efektif", "Effective Communication"),
    description: L("Menyampaikan informasi secara jelas, terstruktur, dan sesuai audiens.", "Conveys information clearly, in a structured way and suited to the audience."),
    rubric: rubric(
      L("Jawaban tidak terstruktur atau tidak menjawab pertanyaan.", "The answer is unstructured or does not address the question."),
      L("Pesan utama ada, tetapi kurang runtut atau kurang contoh.", "The main message is there, but it lacks flow or examples."),
      L("Runtut, jelas, dan memberi contoh yang relevan.", "Well-ordered, clear and backed by relevant examples."),
      L("Sangat jelas, menyesuaikan audiens, dan memeriksa pemahaman lawan bicara.", "Very clear, adapted to the audience, and checks the listener's understanding."),
    ),
    keywords: ["jelaskan", "menjelaskan", "sampaikan", "komunikasi", "pahami", "dengarkan", "konfirmasi", "ringkas", "explain", "communicat", "understand", "listen", "confirm", "summar"],
  },
  {
    id: "empati",
    name: L("Empati Pelanggan", "Customer Empathy"),
    description: L("Memahami kebutuhan dan emosi pelanggan serta merespons dengan tepat.", "Understands customers' needs and emotions and responds appropriately."),
    rubric: rubric(
      L("Tidak menunjukkan perhatian pada sudut pandang pelanggan.", "Shows no attention to the customer's point of view."),
      L("Menyebut pelanggan, tetapi respons masih generik.", "Mentions the customer, but the response is still generic."),
      L("Mengakui perasaan pelanggan dan menyesuaikan solusi.", "Acknowledges the customer's feelings and adapts the solution."),
      L("Proaktif mengantisipasi kebutuhan & menjaga hubungan jangka panjang.", "Proactively anticipates needs & maintains long-term relationships."),
    ),
    keywords: ["pelanggan", "mendengarkan", "memahami", "maaf", "kecewa", "perasaan", "kebutuhan", "nyaman", "customer", "listen", "understand", "apologi", "disappointed", "feeling", "needs", "comfortable"],
  },
  {
    id: "pemecahan-masalah",
    name: L("Pemecahan Masalah", "Problem Solving"),
    description: L("Mengidentifikasi akar masalah, menimbang opsi, dan mengambil tindakan.", "Identifies root causes, weighs options and takes action."),
    rubric: rubric(
      L("Tidak ada langkah penyelesaian yang jelas.", "No clear steps toward a resolution."),
      L("Ada tindakan, tetapi tanpa analisis penyebab.", "Takes action, but without analysing the cause."),
      L("Menganalisis penyebab, memilih solusi, dan menjelaskan hasil.", "Analyses the cause, chooses a solution and explains the result."),
      L("Menimbang beberapa opsi, mengukur hasil, dan mencegah masalah berulang.", "Weighs several options, measures the outcome and prevents recurrence."),
    ),
    keywords: ["masalah", "penyebab", "solusi", "analisis", "langkah", "opsi", "cek", "evaluasi", "mencegah", "problem", "cause", "solution", "analys", "step", "option", "check", "evaluat", "prevent"],
  },
  {
    id: "adaptabilitas",
    name: L("Adaptabilitas", "Adaptability"),
    description: L("Menyesuaikan diri dengan perubahan prioritas, situasi, atau tekanan.", "Adjusts to changing priorities, situations or pressure."),
    rubric: rubric(
      L("Menolak atau kesulitan dengan perubahan.", "Resists or struggles with change."),
      L("Menerima perubahan, tetapi lambat menyesuaikan.", "Accepts change, but is slow to adjust."),
      L("Menyesuaikan rencana dengan tenang dan tetap produktif.", "Adjusts plans calmly and stays productive."),
      L("Menjadikan perubahan peluang perbaikan dan membantu tim beradaptasi.", "Turns change into an opportunity to improve and helps the team adapt."),
    ),
    keywords: ["berubah", "perubahan", "menyesuaikan", "fleksibel", "belajar", "tekanan", "baru", "cepat", "change", "adjust", "adapt", "flexib", "learn", "pressure", "new", "quick"],
  },
  {
    id: "orientasi-target",
    name: L("Orientasi Target", "Target Orientation"),
    description: L("Menetapkan dan mengejar target terukur dengan inisiatif.", "Sets and pursues measurable targets with initiative."),
    rubric: rubric(
      L("Tidak menyebut target atau hasil.", "Does not mention targets or results."),
      L("Menyebut target secara umum tanpa angka.", "Mentions targets in general terms, without numbers."),
      L("Menyebut target terukur dan upaya mencapainya.", "States a measurable target and the effort to reach it."),
      L("Melampaui target secara konsisten dengan strategi yang jelas.", "Consistently exceeds targets with a clear strategy."),
    ),
    keywords: ["target", "persen", "%", "meningkat", "capaian", "kuota", "melampaui", "hasil", "omzet", "percent", "increase", "achiev", "quota", "exceed", "result", "revenue"],
  },
  {
    id: "negosiasi",
    name: L("Negosiasi & Persuasi", "Negotiation & Persuasion"),
    description: L("Memengaruhi keputusan dengan argumen bernilai sambil menjaga hubungan.", "Influences decisions with value-based arguments while preserving the relationship."),
    rubric: rubric(
      L("Tidak menunjukkan upaya meyakinkan.", "Shows no effort to persuade."),
      L("Meyakinkan dengan argumen umum.", "Persuades with generic arguments."),
      L("Menggali kebutuhan dan menawarkan nilai yang relevan.", "Explores needs and offers relevant value."),
      L("Menemukan solusi _win-win_ dan menangani keberatan dengan baik.", "Finds win-win solutions and handles objections well."),
    ),
    keywords: ["menawarkan", "keberatan", "meyakinkan", "nilai", "manfaat", "kesepakatan", "diskon", "kebutuhan", "offer", "objection", "convinc", "value", "benefit", "agreement", "discount", "needs"],
  },
  {
    id: "ketelitian",
    name: L("Ketelitian", "Attention to Detail"),
    description: L("Bekerja akurat, memeriksa detail, dan mengikuti prosedur.", "Works accurately, checks details and follows procedures."),
    rubric: rubric(
      L("Tidak menunjukkan perhatian pada detail.", "Shows no attention to detail."),
      L("Memeriksa detail sesekali.", "Checks details occasionally."),
      L("Memiliki cara memeriksa ulang yang konsisten.", "Has a consistent way of double-checking."),
      L("Membangun sistem kontrol untuk mencegah kesalahan.", "Builds control systems to prevent errors."),
    ),
    keywords: ["cek", "periksa", "detail", "akurat", "teliti", "prosedur", "checklist", "kesalahan", "data", "check", "accura", "careful", "procedure", "error", "mistake"],
  },
  {
    id: "organisasi",
    name: L("Manajemen Waktu & Prioritas", "Time & Priority Management"),
    description: L("Mengatur prioritas dan tenggat secara efektif.", "Manages priorities and deadlines effectively."),
    rubric: rubric(
      L("Tidak ada cara mengatur prioritas.", "Has no way of setting priorities."),
      L("Mengatur tugas, tetapi reaktif.", "Organises tasks, but reactively."),
      L("Memprioritaskan berdasarkan urgensi & dampak.", "Prioritises by urgency & impact."),
      L("Merencanakan proaktif dan mengomunikasikan _trade-off_.", "Plans proactively and communicates trade-offs."),
    ),
    keywords: ["prioritas", "jadwal", "tenggat", "deadline", "rencana", "urutan", "waktu", "daftar", "priorit", "schedul", "plan", "order", "time", "list"],
  },
  {
    id: "kolaborasi",
    name: L("Kolaborasi", "Collaboration"),
    description: L("Bekerja sama lintas fungsi untuk mencapai tujuan bersama.", "Works across functions toward shared goals."),
    rubric: rubric(
      L("Cenderung bekerja sendiri tanpa koordinasi.", "Tends to work alone without coordination."),
      L("Berkoordinasi ketika diminta.", "Coordinates when asked."),
      L("Aktif berbagi informasi dan membantu rekan.", "Actively shares information and helps colleagues."),
      L("Menyatukan tim lintas fungsi dan menyelesaikan konflik.", "Brings cross-functional teams together and resolves conflict."),
    ),
    keywords: ["tim", "bersama", "rekan", "koordinasi", "kolaborasi", "membantu", "diskusi", "divisi", "team", "together", "colleague", "coordinat", "collaborat", "help", "discuss", "division"],
  },
];

export const COMPETENCY_MAP = Object.fromEntries(COMPETENCIES.map((c) => [c.id, c])) as Record<string, Competency>;

const Q = (idText: string, enText: string, idFollow: string, enFollow: string) => ({ text: L(idText, enText), followUp: L(idFollow, enFollow) });

/** Predefined question bank per role — the "generator" picks from here deterministically. */
export const QUESTION_BANK: Record<string, { text: Bilingual; followUp: Bilingual }[]> = {
  komunikasi: [
    Q("Ceritakan saat Anda harus menjelaskan informasi yang rumit kepada orang yang awam. Bagaimana Anda melakukannya?", "Tell us about a time you had to explain complex information to a non-expert. How did you do it?", "Bagaimana Anda memastikan orang tersebut benar-benar paham?", "How did you make sure they really understood?"),
    Q("Bagaimana Anda menyampaikan kabar yang kurang menyenangkan kepada pelanggan atau atasan?", "How do you deliver unwelcome news to a customer or a manager?", "Apa reaksi mereka dan apa yang Anda lakukan setelahnya?", "How did they react, and what did you do next?"),
    Q("Ceritakan pengalaman ketika terjadi salah paham dalam komunikasi. Apa yang Anda pelajari?", "Describe a time a miscommunication happened. What did you learn?", "Apa yang akan Anda lakukan berbeda sekarang?", "What would you do differently now?"),
  ],
  empati: [
    Q("Ceritakan saat Anda menghadapi pelanggan yang kecewa. Apa yang Anda lakukan?", "Tell us about a time you dealt with a disappointed customer. What did you do?", "Bagaimana Anda tahu pelanggan tersebut merasa didengarkan?", "How did you know the customer felt heard?"),
    Q("Bagaimana Anda menangani pelanggan yang kebutuhannya tidak bisa dipenuhi sepenuhnya?", "How do you handle a customer whose needs cannot be fully met?", "Alternatif apa yang Anda tawarkan?", "What alternatives did you offer?"),
    Q("Ceritakan saat Anda melakukan sesuatu di luar tugas untuk membantu pelanggan.", "Describe a time you went beyond your duties to help a customer.", "Apa dampaknya bagi pelanggan dan tim?", "What was the impact on the customer and the team?"),
  ],
  "pemecahan-masalah": [
    Q("Ceritakan masalah operasional yang pernah Anda selesaikan. Bagaimana Anda menemukan penyebabnya?", "Tell us about an operational problem you solved. How did you find the cause?", "Bagaimana Anda memastikan masalah itu tidak terulang?", "How did you make sure it would not happen again?"),
    Q("Saat ada dua solusi yang sama-sama masuk akal, bagaimana Anda memilih?", "When two solutions both make sense, how do you choose?", "Data apa yang Anda gunakan untuk memutuskan?", "What data did you use to decide?"),
    Q("Ceritakan keputusan yang harus Anda ambil dengan informasi terbatas.", "Describe a decision you had to make with limited information.", "Apa hasilnya dan apa yang Anda pelajari?", "What was the result, and what did you learn?"),
  ],
  adaptabilitas: [
    Q("Ceritakan saat prioritas pekerjaan Anda berubah mendadak. Bagaimana Anda menyesuaikan diri?", "Tell us about a time your work priorities changed suddenly. How did you adjust?", "Apa yang membantu Anda tetap produktif?", "What helped you stay productive?"),
    Q("Bagaimana Anda mempelajari sistem atau alat kerja baru dalam waktu singkat?", "How do you learn a new system or tool in a short time?", "Berapa lama sampai Anda benar-benar mahir?", "How long until you were truly proficient?"),
    Q("Ceritakan saat Anda bekerja di bawah tekanan tenggat yang ketat.", "Describe a time you worked under a tight deadline.", "Apa hasil akhirnya?", "What was the final result?"),
  ],
  "orientasi-target": [
    Q("Ceritakan target tersulit yang pernah Anda capai. Bagaimana strateginya?", "Tell us about the hardest target you have achieved. What was your strategy?", "Berapa persen capaian Anda dibanding target?", "What percentage of the target did you achieve?"),
    Q("Apa yang Anda lakukan ketika di tengah periode Anda tertinggal dari target?", "What do you do when you fall behind target mid-period?", "Langkah apa yang paling berdampak?", "Which step had the most impact?"),
    Q("Bagaimana Anda memantau progres terhadap target harian atau mingguan?", "How do you track progress against daily or weekly targets?", "Alat atau kebiasaan apa yang Anda gunakan?", "What tools or habits do you use?"),
  ],
  negosiasi: [
    Q("Ceritakan saat Anda berhasil meyakinkan calon pelanggan yang awalnya ragu.", "Tell us about a time you won over a prospect who was hesitant at first.", "Keberatan utama apa yang Anda tangani?", "What was the main objection you handled?"),
    Q("Bagaimana Anda merespons pelanggan yang meminta diskon besar?", "How do you respond to a customer asking for a big discount?", "Nilai apa yang Anda tekankan selain harga?", "What value did you emphasise besides price?"),
    Q("Ceritakan negosiasi yang tidak berjalan sesuai rencana.", "Describe a negotiation that did not go to plan.", "Apa yang Anda pelajari dari situ?", "What did you learn from it?"),
  ],
  ketelitian: [
    Q("Ceritakan bagaimana Anda memastikan data atau dokumen yang Anda kerjakan akurat.", "Tell us how you make sure the data or documents you work on are accurate.", "Pernahkah cara itu mencegah kesalahan besar?", "Has that ever prevented a major error?"),
    Q("Ceritakan saat Anda menemukan kesalahan yang terlewat oleh orang lain.", "Describe a time you caught a mistake others had missed.", "Apa tindak lanjut yang Anda lakukan?", "What follow-up action did you take?"),
    Q("Bagaimana Anda menjaga ketelitian saat volume pekerjaan sangat tinggi?", "How do you stay accurate when the workload is very high?", "Apa _checklist_ atau prosedur yang Anda gunakan?", "What checklist or procedure do you use?"),
  ],
  organisasi: [
    Q("Bagaimana Anda memprioritaskan pekerjaan ketika beberapa tenggat jatuh bersamaan?", "How do you prioritise when several deadlines fall at the same time?", "Bagaimana Anda mengomunikasikan prioritas itu ke atasan?", "How did you communicate those priorities to your manager?"),
    Q("Ceritakan proyek yang Anda rencanakan dari awal hingga selesai.", "Tell us about a project you planned from start to finish.", "Bagian mana yang paling sulit dijadwalkan?", "Which part was hardest to schedule?"),
    Q("Apa yang Anda lakukan bila pekerjaan mendadak masuk di tengah jadwal padat?", "What do you do when urgent work lands in the middle of a packed schedule?", "Apa _trade-off_ yang Anda ambil?", "What trade-offs did you make?"),
  ],
  kolaborasi: [
    Q("Ceritakan saat Anda bekerja dengan divisi lain untuk menyelesaikan tugas bersama.", "Tell us about a time you worked with another division to complete a shared task.", "Bagaimana Anda menangani perbedaan pendapat?", "How did you handle disagreements?"),
    Q("Bagaimana Anda membantu rekan tim yang sedang kewalahan?", "How do you help a teammate who is overwhelmed?", "Apa dampaknya terhadap hasil tim?", "What was the effect on the team's results?"),
    Q("Ceritakan konflik dalam tim yang pernah Anda bantu selesaikan.", "Describe a team conflict you helped resolve.", "Apa peran spesifik Anda?", "What was your specific role?"),
  ],
};

export const ROLE_TEMPLATES: Record<RoleKey, { label: string; department: Bilingual; description: Bilingual; competencies: { id: string; weight: number }[] }> = {
  "customer-service": {
    label: "Customer Service Representative",
    department: L("Layanan Pelanggan", "Customer Service"),
    description: L(
      "Menangani pertanyaan & keluhan pelanggan melalui _chat_, telepon, dan _email_ dengan standar layanan yang konsisten.",
      "Handles customer questions & complaints via chat, phone and email to a consistent service standard.",
    ),
    competencies: [
      { id: "komunikasi", weight: 30 },
      { id: "empati", weight: 30 },
      { id: "pemecahan-masalah", weight: 25 },
      { id: "adaptabilitas", weight: 15 },
    ],
  },
  "sales-associate": {
    label: "Sales Associate",
    department: L("Penjualan", "Sales"),
    description: L(
      "Menjangkau calon pelanggan, mempresentasikan produk, dan mencapai target penjualan bulanan.",
      "Reaches out to prospects, presents products and hits monthly sales targets.",
    ),
    competencies: [
      { id: "orientasi-target", weight: 30 },
      { id: "negosiasi", weight: 30 },
      { id: "komunikasi", weight: 25 },
      { id: "adaptabilitas", weight: 15 },
    ],
  },
  "operations-assistant": {
    label: "Operations Assistant",
    department: L("Operasional", "Operations"),
    description: L(
      "Mendukung operasional harian: administrasi data, koordinasi jadwal, dan pengendalian kualitas proses.",
      "Supports daily operations: data administration, schedule coordination and process quality control.",
    ),
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
    const pick =
      bank[(variant + i) % Math.max(1, bank.length)] ??
      Q("Ceritakan pengalaman relevan Anda.", "Tell us about a relevant experience.", "Apa hasilnya?", "What was the result?");
    return { id: `q-${c.id}-${variant}-${i}`, competencyId: c.id, text: pick.text, followUp: pick.followUp };
  });
}

export const RECRUITER_COMPANY = L("PT Sinar Ritel Nusantara (fiktif)", "PT Sinar Ritel Nusantara (fictional)");

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

/** [strong answer, weak answer] per competency — the EN versions carry equivalent rubric signals. */
const SAMPLE_ANSWERS: Record<string, [Bilingual, Bilingual]> = {
  komunikasi: [
    L(
      "Saat magang, saya menjelaskan proses klaim garansi kepada pelanggan lansia. Saya memecah langkah menjadi tiga bagian, memakai contoh sederhana, lalu meminta beliau mengulang untuk konfirmasi. Hasilnya klaim selesai di hari yang sama.",
      "During my internship, I had to explain the warranty-claim process to an elderly customer. I broke the steps into three parts, used simple examples, then asked her to repeat them back to confirm she understood. As a result, the claim was completed the same day.",
    ),
    L("Saya biasanya langsung menjelaskan saja apa yang perlu dilakukan.", "I usually just explain what needs to be done."),
  ],
  empati: [
    L(
      "Ada pelanggan yang kecewa karena pesanan terlambat. Saya mendengarkan dulu tanpa memotong, meminta maaf, lalu memahami kebutuhan utamanya yaitu barang dipakai untuk acara besok. Saya koordinasikan pengiriman prioritas sehingga barang tiba pagi hari.",
      "There was a customer who was disappointed because an order was late. I listened first without interrupting, apologised, then worked to understand her main needs — she needed the item for an event the next day. I coordinated priority delivery so that it arrived the next morning.",
    ),
    L("Saya minta pelanggan menunggu dan memberi tahu bahwa itu kebijakan perusahaan.", "I asked the customer to wait and told them it was company policy."),
  ],
  "pemecahan-masalah": [
    L(
      "Di organisasi kampus, pendaftaran acara sering ganda. Saya analisis penyebabnya: formulir tidak mengecek email. Saya usulkan validasi email dan checklist, sehingga data ganda turun sekitar 80% di acara berikutnya.",
      "In my campus organisation, event sign-ups were often duplicated. I analysed the cause: the form did not check email addresses. I proposed an email validation step and a checklist, so that duplicate data dropped by about 80% at the next event.",
    ),
    L("Saya bertanya ke atasan lalu mengikuti arahannya.", "I asked my supervisor and followed their directions."),
  ],
  adaptabilitas: [
    L(
      "Ketika sistem kasir berubah mendadak, saya belajar dari manual di malam hari dan membuat ringkasan untuk tim. Dalam seminggu kami sudah lancar dan antrean kembali normal.",
      "When the cashier system changed suddenly, I learned it from the manual at night and created a summary for the team. Within a week we were working smoothly and the queues were back to normal.",
    ),
    L("Awalnya saya bingung tapi lama-lama terbiasa.", "I was confused at first but got used to it eventually."),
  ],
  "orientasi-target": [
    L(
      "Target saya 40 akun baru per bulan. Saya membuat daftar prioritas prospek dan follow-up terjadwal, hasilnya capaian 118% dari target selama tiga bulan berturut-turut.",
      "My target was 40 new accounts per month. I created a prioritised prospect list and scheduled follow-ups; as a result I achieved 118% of target for three months in a row.",
    ),
    L("Saya selalu berusaha mencapai target yang diberikan.", "I always try to reach the targets I am given."),
  ],
  negosiasi: [
    L(
      "Calon pelanggan ragu karena harga. Saya menggali kebutuhannya, lalu menawarkan paket dengan manfaat pelatihan gratis. Keberatan utamanya soal biaya implementasi, dan kami capai kesepakatan dengan termin pembayaran.",
      "A prospect was hesitant because of the price. I explored their needs, then offered a package with the benefit of free training. Their main objection was the implementation cost, and we reached an agreement with staged payments.",
    ),
    L("Saya menjelaskan produk sebaik mungkin.", "I present the product as well as I can."),
  ],
  ketelitian: [
    L(
      "Saya selalu cek ulang data inventaris dengan checklist dan membandingkan dengan laporan sistem. Cara ini pernah menemukan selisih stok sebelum laporan bulanan dikirim.",
      "I always double-check inventory data with a checklist and compare it with the system report. This once caught a stock discrepancy before the monthly report was sent.",
    ),
    L("Saya berusaha teliti dalam bekerja.", "I try to be thorough in my work."),
  ],
  organisasi: [
    L(
      "Saya membuat daftar prioritas berdasarkan tenggat dan dampak, lalu mengomunikasikan jadwal ke atasan. Saat dua deadline bertabrakan, saya negosiasikan urutan dan semua selesai tepat waktu.",
      "I created a priority list based on deadlines and impact, then shared the schedule with my manager. When two deadlines clashed, I negotiated the order and everything was finished on time.",
    ),
    L("Saya mengerjakan yang paling dulu datang.", "I work on whatever comes in first."),
  ],
  kolaborasi: [
    L(
      "Saya berkoordinasi dengan tim gudang dan divisi keuangan untuk merapikan proses retur. Kami diskusi mingguan dan membuat alur bersama, sehingga waktu proses turun dari 5 hari menjadi 2 hari.",
      "I coordinated with the warehouse team and the finance division to streamline the returns process. We held weekly discussions and designed a shared flow together, so that processing time dropped from 5 days to 2 days.",
    ),
    L("Saya membantu tim jika diminta.", "I help the team when asked."),
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
        answer: (SAMPLE_ANSWERS[q.competencyId]?.[strong || qi % 2 === 0 ? 0 : 1] ?? "") as Txt,
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
        ? [
            {
              id: `n-${i}`,
              author: "Recruiter Demo",
              text: L("Bukti kompetensi konsisten dengan rubrik. Lanjut ke wawancara _user_.", "Competency evidence is consistent with the rubric. Proceed to the hiring-manager interview."),
              at: `2026-10-${String(10 + i).padStart(2, "0")}T10:00:00`,
            },
          ]
        : [],
    overrides: {},
  };
});

export const SEED_AUDIT: AuditEntry[] = [
  { id: "a1", at: "2026-10-18T09:12:00", actor: "Recruiter Demo", action: L("Melihat laporan", "Viewed report"), target: "Rani Ayuningtyas" },
  { id: "a2", at: "2026-10-18T09:20:00", actor: "Recruiter Demo", action: L("Menandai selesai ditinjau", "Marked as reviewed"), target: "Rani Ayuningtyas" },
  { id: "a3", at: "2026-10-17T15:02:00", actor: "HR Lead Demo", action: L("Mengubah bobot kompetensi", "Changed competency weights"), target: "Sales Associate" },
  { id: "a4", at: "2026-10-16T11:45:00", actor: L("Sistem (simulasi)", "System (simulated)"), action: L("Menghapus rekaman sesuai retensi", "Deleted recordings per retention policy"), target: L("3 sesi > 90 hari", "3 sessions > 90 days") },
];
