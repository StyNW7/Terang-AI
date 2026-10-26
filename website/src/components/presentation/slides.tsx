"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Brain,
  CalendarDays,
  CheckCircle2,
  Gauge,
  GraduationCap,
  Layers,
  Lightbulb,
  Pause,
  Rocket,
  Scale,
  Target,
  TriangleAlert,
  Users,
  Wrench,
  Minimize2,
} from "lucide-react";
import type { Assumptions } from "@/types/finance";
import { computeBoth, computeInterview } from "@/lib/finance";
import { SCENARIO_PRESETS } from "@/data/scenarios";
import { FINANCIAL_PROJECTION } from "@/data/proposal";
import { ACE_STRATEGY, CHALLENGES, KEY_QUESTION, ONE_STRATEGY } from "@/data/strategy";
import { COMPANY, PRODUCTS } from "@/data/company";
import { TEAM } from "@/data/team";
import { formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { L, keyOf, type Bilingual, type Txt } from "@/lib/i18n";
import { Logo, Mascot, type MascotName } from "@/components/shared/brand";
import { cn } from "@/lib/utils";

export type SlideSection = "context" | "one" | "ace" | "compare";

export const SECTION_LABEL: Record<SlideSection, Bilingual> = {
  context: L("Konteks", "Context"),
  one: L("ONE · PRO", "ONE · PRO"),
  ace: L("ACE · KONTRA", "ACE · CONTRA"),
  compare: L("Perbandingan", "Comparison"),
};

/** Translation helpers handed to every slide renderer. */
export interface SlideI18n {
  t: (value: Txt, en?: string) => string;
  tx: (value: Txt, en?: string) => ReactNode;
}

export interface SlideDef {
  id: string;
  section: SlideSection;
  title: Txt;
  steps: number;
  notes: Bilingual;
  mascot?: MascotName;
  link?: { href: string; label: Txt };
  accent: "brand" | "one" | "ace";
  render: (step: number, a: Assumptions, i18n: SlideI18n) => ReactNode;
}

/** Reveals a block once the presenter has advanced to `at`. */
function Step({ at, step, children, className }: { at: number; step: number; children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={false}
      animate={step >= at ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 16, filter: "blur(4px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      aria-hidden={step < at}
    >
      {children}
    </motion.div>
  );
}

const card = "rounded-3xl bg-white/[0.07] p-6 ring-1 ring-white/12 backdrop-blur";

function PillarRow({ pillars, step, accent }: { pillars: { letter: string; name: string; program: string }[]; step: number; accent: "one" | "ace" }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {pillars.map((p, i) => (
        <Step key={p.letter} at={i + 1} step={step} className={card}>
          <span className={cn("grid h-14 w-14 place-items-center rounded-2xl font-display text-3xl font-semibold text-white", accent === "one" ? "bg-one-gradient" : "bg-ace-gradient")}>{p.letter}</span>
          <p className="mt-4 text-2xl font-semibold">{p.name}</p>
          <p className="mt-1 text-white/65">{p.program}</p>
        </Step>
      ))}
    </div>
  );
}

export const SLIDES: SlideDef[] = [
  {
    id: "overview",
    section: "context",
    title: "Terang AI",
    steps: 2,
    accent: "brand",
    mascot: "wave",
    link: { href: "/company", label: L("Profil perusahaan", "Company overview") },
    notes: L(
      "Buka dengan konteks: Terang AI adalah startup EdTech Indonesia (PT Terang Inovasi Indonesia) yang diperkenalkan 2024. Mulai dari B2C — UTBK, CPNS, beasiswa, simulasi wawancara AI — lalu bergerak ke B2B. Tegaskan bahwa ini prototipe akademik.",
      "Open with context: Terang AI is an Indonesian EdTech startup (PT Terang Inovasi Indonesia) introduced in 2024. It began in B2C — UTBK, CPNS, scholarships, AI interview simulation — and is moving into B2B. Make clear this is an academic prototype.",
    ),
    render: (step, _a, { t }) => (
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Logo height={48} href={null} />
          <h1 className="mt-8 text-6xl font-semibold leading-[1.02] xl:text-7xl">
            Smarter Solutions,
            <br />
            <span className="text-gradient-light">Brighter Futures.</span>
          </h1>
          <Step at={1} step={step}>
            <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-white/75">
              {t("Dari pendidikan berbasis AI menuju solusi bisnis B2B.", "From AI-Powered Education to B2B Business Solutions.")}
            </p>
          </Step>
        </div>
        <Step at={2} step={step} className="grid gap-3">
          {[
            [t("Badan hukum", "Legal entity"), COMPANY.legalName],
            [t("Diperkenalkan", "Introduced"), "2024 · Indonesia"],
            [t("Evolusi", "Evolution"), "B2C EdTech → B2B Solutions"],
          ].map(([k, v]) => (
            <div key={k} className={card}>
              <p className="text-sm uppercase tracking-[0.12em] text-sky">{k}</p>
              <p className="mt-1 text-2xl font-semibold">{v}</p>
            </div>
          ))}
        </Step>
      </div>
    ),
  },
  {
    id: "portfolio",
    section: "context",
    title: L("Dua produk B2B", "Two B2B products"),
    steps: 2,
    accent: "brand",
    link: { href: "/products", label: L("Dua produk B2B", "Two B2B products") },
    notes: L(
      "Perkenalkan dua produk fokus. Terang Events = EventTech untuk penyelenggara acara. AI Candidate Interview = HRTech untuk tim rekrutmen. Tekankan pembeli & _workflow_ yang berbeda.",
      "Introduce the two focus products. Terang Events = EventTech for event organisers. AI Candidate Interview = HRTech for recruitment teams. Stress the different buyers & workflows.",
    ),
    render: (step, _a, { t, tx }) => (
      <div>
        <h2 className="text-5xl font-semibold">{t("Dua produk B2B, dua pasar berbeda.", "Two B2B products, two different markets.")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[PRODUCTS.events, PRODUCTS.interview].map((p, i) => (
            <Step key={p.key} at={i + 1} step={step} className={cn(card, "relative overflow-hidden")}>
              <Mascot name={i === 0 ? "events" : "interview"} size={130} className="absolute -bottom-4 -right-2" />
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky">{p.category}</p>
              <p className="mt-2 text-4xl font-semibold">{p.name}</p>
              <p className="mt-3 max-w-md text-lg text-white/75">{tx(p.tagline)}</p>
              <p className="mt-5 text-sm text-white/60">
                {t("Pembeli", "Buyer")}: {tx(p.buyer)}
              </p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "market",
    section: "context",
    title: L("Peluang pasar", "Market opportunity"),
    steps: 2,
    accent: "brand",
    notes: L(
      "Jelaskan masalah pelanggan masing-masing pasar secara kualitatif — tidak ada klaim ukuran pasar yang belum diverifikasi. Events: koordinasi & _setup_ berulang. Interview: _screening_ yang memakan waktu & bukti penilaian.",
      "Explain each market's customer problems qualitatively — no unverified market-size claims. Events: coordination & repeated setup. Interview: time-consuming screening & assessment evidence.",
    ),
    render: (step, _a, { t, tx }) => (
      <div>
        <h2 className="text-5xl font-semibold">{t("Masalah nyata di dua segmen.", "Real problems in two segments.")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            { icon: GraduationCap, title: t("Penyelenggara acara & institusi", "Event organisers & institutions"), items: PRODUCTS.events.problems.slice(0, 4) },
            { icon: Users, title: t("Tim HR & _talent acquisition_", "HR & talent acquisition teams"), items: PRODUCTS.interview.problems.slice(0, 4) },
          ].map((m, i) => (
            <Step key={m.title} at={i + 1} step={step} className={card}>
              <m.icon className="h-8 w-8 text-sky" />
              <p className="mt-3 text-2xl font-semibold">{m.title}</p>
              <ul className="mt-4 space-y-2 text-lg text-white/75">
                {m.items.map((x) => (
                  <li key={keyOf(x)} className="flex gap-2">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-sky" /> <span>{tx(x)}</span>
                  </li>
                ))}
              </ul>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "dilemma",
    section: "context",
    title: L("Dilema strategis", "The strategic dilemma"),
    steps: 1,
    accent: "brand",
    mascot: "think",
    link: { href: "/strategy-lab", label: "Strategy Lab" },
    notes: L(
      "Ini inti kasus. Dua peluang, sumber daya terbatas. Bacakan _key strategic question_ perlahan. Tekankan bahwa kita menilai dua alternatif secara adil.",
      "This is the heart of the case. Two opportunities, limited resources. Read the key strategic question slowly. Stress that we assess both alternatives fairly.",
    ),
    render: (step, _a, { t, tx }) => (
      <div className="max-w-5xl">
        <p className="text-lg font-semibold uppercase tracking-[0.12em] text-sky">{t("Dilema Pertumbuhan Strategis", "Strategic Growth Dilemma")}</p>
        <h2 className="mt-4 text-6xl font-semibold leading-[1.05]">
          {t("Dua Peluang. Sumber Daya Terbatas.", "Two Opportunities. Limited Resources.")}{" "}
          <span className="text-gradient-light">{t("Satu Keputusan Strategis.", "One Strategic Decision.")}</span>
        </h2>
        <Step at={1} step={step}>
          <p className="mt-10 rounded-3xl bg-white/[0.07] p-8 font-display text-3xl font-semibold leading-snug ring-1 ring-white/12">“{tx(KEY_QUESTION)}”</p>
        </Step>
      </div>
    ),
  },
  {
    id: "challenges",
    section: "context",
    title: L("Tantangan sumber daya & operasional", "Resource & operational challenges"),
    steps: 4,
    accent: "brand",
    notes: L(
      "Tiga _gap_: kapasitas (7 personel dalam studi kasus), validasi pasar, kompleksitas eksekusi. Sebutkan bahwa angka tujuh personel adalah konfigurasi studi kasus, bukan verifikasi _headcount_.",
      "Three gaps: capacity (7 people in the case study), market validation, execution complexity. Mention that the seven-person figure is a case-study setting, not a verified headcount.",
    ),
    render: (step, _a, { t, tx }) => (
      <div>
        <h2 className="text-5xl font-semibold">{t("Tiga tantangan utama", "Three core challenges")}</h2>
        <Step at={1} step={step} className="mt-6 flex items-center gap-2">
          {TEAM.map((m) => (
            <span key={m.id} className={cn("grid h-12 w-12 place-items-center rounded-full text-sm font-semibold ring-4 ring-navy", m.pool === "leadership" ? "bg-white text-navy" : m.pool === "product" ? "bg-brand-gradient" : "bg-ace-gradient")}>
              {m.role === "CEO" || m.role === "CPO" ? m.role : m.initials}
            </span>
          ))}
          <span className="ml-3 text-lg text-white/70">{t("7 personel (konteks studi kasus)", "7 people (case-study context)")}</span>
        </Step>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CHALLENGES.map((c, i) => (
            <Step key={c.id} at={i + 2} step={step} className={card}>
              <p className="font-display text-5xl font-semibold text-sky/60">{c.number}</p>
              <p className="mt-2 text-2xl font-semibold">{c.english}</p>
              <p className="mt-2 text-white/70">{tx(c.summary)}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "one-overview",
    section: "one",
    title: "ONE Strategy",
    steps: 3,
    accent: "one",
    mascot: "target",
    link: { href: "/strategies/one", label: "ONE Strategy" },
    notes: L(
      "ONE: prioritaskan AI Candidate Interview. Tiga pilar: Optimize Product Value, Navigate Market Growth, Evaluate for Expansion. Events tetap hanya _maintenance_ — biaya _maintenance_ tetap dihitung.",
      "ONE: prioritise AI Candidate Interview. Three pillars: Optimize Product Value, Navigate Market Growth, Evaluate for Expansion. Events stays maintenance-only — its maintenance cost is still counted.",
    ),
    render: (step, _a, { t }) => (
      <div>
        <p className="text-lg font-semibold uppercase tracking-[0.12em] text-sky">{t("PRO · Prioritaskan satu produk", "PRO · Prioritise one product")}</p>
        <h2 className="mt-3 text-7xl font-semibold">ONE Strategy</h2>
        <p className="mt-2 font-display text-3xl font-semibold text-white/85">{ONE_STRATEGY.tagline}</p>
        <div className="mt-10">
          <PillarRow pillars={ONE_STRATEGY.pillars} step={step} accent="one" />
        </div>
      </div>
    ),
  },
  {
    id: "one-product",
    section: "one",
    title: "AI Interview Intelligence Suite",
    steps: 2,
    accent: "one",
    link: { href: "/dashboard/interview", label: L("Demo AI Interview", "AI Interview demo") },
    notes: L(
      "Tunjukkan demo: _builder_ per jabatan, wawancara terstruktur, laporan berbasis bukti, _review recruiter_, Responsible AI. Tekankan: AI pendukung keputusan, bukan otoritas perekrutan.",
      "Show the demo: the per-role builder, structured interview, evidence-based report, recruiter review and Responsible AI. Stress: AI supports decisions; it is not a hiring authority.",
    ),
    render: (step, _a, { t, tx }) => (
      <div>
        <h2 className="text-5xl font-semibold">{t("Dari skor generik ke _insight recruiter_ berbasis bukti.", "From generic scores to evidence-based recruiter insights.")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-5">
          {PRODUCTS.interview.proposals.map((f, i) => (
            <Step key={f.name} at={i < 3 ? 1 : 2} step={step} className={card}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-gradient text-lg font-semibold">{i + 1}</span>
              <p className="mt-3 text-xl font-semibold">{f.name}</p>
              <p className="mt-2 text-sm text-white/65">{tx(f.description)}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "one-gtm",
    section: "one",
    title: L("_Go-to-market_ ONE", "ONE go-to-market"),
    steps: 1,
    accent: "one",
    link: { href: "/strategies/one?pillar=navigate", label: L("_Funnel_ Pilot-to-Paid", "Pilot-to-Paid funnel") },
    notes: L(
      "Pilot-to-Paid Growth Engine: komunitas HR, LinkedIn, demo _enterprise_. Tiga inisiatif: HR Efficiency Clinic, Terang Pilot Challenge, Verified Impact Stories. Paket usulan Starter Rp3,9 jt · Growth Rp9,9 jt · Enterprise Rp20,9 jt per bulan. Target M12: 24 _pilot_, 20 kontrak, 18 akun berbayar aktif. Angka _funnel_ di _slide_ mengikuti asumsi simulator.",
      "Pilot-to-Paid Growth Engine: HR communities, LinkedIn, enterprise demos. Three initiatives: HR Efficiency Clinic, Terang Pilot Challenge, Verified Impact Stories. Proposed plans Starter Rp3.9M · Growth Rp9.9M · Enterprise Rp20.9M per month. M12 targets: 24 pilots, 20 contracts, 18 active paying accounts. Funnel numbers on the slide follow the simulator assumptions.",
    ),
    render: (step, a, { t }) => {
      const iv = computeInterview("one", a);
      const stages = [
        ["Demo", Math.round(iv.pilots / 0.45)],
        ["Pilot", Math.round(iv.pilots)],
        ["Paid", iv.customers],
        ["Renewal", Math.round(iv.customers * a.interview.renewalRate)],
      ] as const;
      const max = stages[0][1];
      return (
        <div>
          <h2 className="text-5xl font-semibold">Pilot-to-Paid Growth Engine</h2>
          <p className="mt-3 text-xl text-white/70">Awareness → Qualified Lead → Demo → Pilot → Paid Customer → Renewal</p>
          <Step at={1} step={step} className="mt-10 space-y-3">
            {stages.map(([k, v], i) => (
              <div key={k} className="grid grid-cols-[140px_1fr] items-center gap-4">
                <p className="text-xl font-semibold">{k}</p>
                <motion.div
                  className="flex h-14 items-center justify-end rounded-2xl bg-one-gradient px-5 text-2xl font-semibold"
                  initial={{ width: 0 }}
                  animate={{ width: step >= 1 ? `${Math.max(12, (v / max) * 100)}%` : 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 90, damping: 18 }}
                >
                  {formatNumber(v)}
                </motion.div>
              </div>
            ))}
            <p className="pt-2 text-sm text-white/55">{t("Asumsi ilustratif dari simulator — bukan data Terang AI.", "Illustrative assumptions from the simulator — not Terang AI data.")}</p>
          </Step>
        </div>
      );
    },
  },
  {
    id: "one-eval",
    section: "one",
    title: "Evaluate for Expansion",
    steps: 3,
    accent: "one",
    link: { href: "/strategies/one?pillar=evaluate", label: "Expansion Gate" },
    notes: L(
      "Expansion Gate: _Scale_ jika kualitas, permintaan, ekonomi, kapasitas & keamanan lulus. _Improve_ jika ada target meleset tapi bisa diperbaiki. _Hold_ (tahan ekspansi & validasi ulang) jika privasi, kualitas, atau kelayakan komersial gagal. Privasi & validitas adalah _hard gate_.",
      "Expansion Gate: Scale if quality, demand, economics, capacity & safety pass. Improve if some targets are missed but fixable. Hold (pause expansion & revalidate) if privacy, quality or commercial viability fails. Privacy & validity are hard gates.",
    ),
    render: (step, _a, { t }) => (
      <div>
        <h2 className="text-5xl font-semibold">ONE Growth Intelligence & Expansion Gate</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: Rocket, title: "Scale", d: t("Kualitas, permintaan, ekonomi, kapasitas & keamanan lulus.", "Quality, demand, economics, capacity & safety all pass."), c: "from-[#12a37a] to-[#0b7a5a]" },
            { icon: Wrench, title: "Improve", d: t("Beberapa target meleset, perbaikan masih layak.", "Some targets are missed, but improvement is still viable."), c: "from-[#4a90e2] to-[#2251c9]" },
            { icon: Pause, title: "Hold", d: t("Kualitas, privasi, atau kelayakan komersial gagal — tahan ekspansi & validasi ulang.", "Quality, privacy or commercial viability fails — pause expansion & revalidate."), c: "from-[#e0484d] to-[#a82025]" },
          ].map((g, i) => (
            <Step key={g.title} at={i + 1} step={step} className={cn("rounded-3xl bg-gradient-to-br p-6", g.c)}>
              <g.icon className="h-9 w-9" />
              <p className="mt-4 text-3xl font-semibold">{g.title}</p>
              <p className="mt-2 text-lg text-white/85">{g.d}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "ace-overview",
    section: "ace",
    title: "ACE Strategy",
    steps: 4,
    accent: "ace",
    mascot: "puzzle",
    link: { href: "/strategies/ace", label: "ACE Strategy" },
    notes: L(
      "ACE: kembangkan kedua produk secara terkoordinasi. Tiga pilar: Agile Feature Development, Coordinate Markets & Capacity, Evaluate and Evolve Portfolio. _Guardrail_: tidak harus 50:50; produk kedua harus membuktikan nilainya.",
      "ACE: grow both products in coordination. Three pillars: Agile Feature Development, Coordinate Markets & Capacity, Evaluate and Evolve Portfolio. Guardrail: no 50:50 requirement; the second product must prove its value.",
    ),
    render: (step, _a, { t, tx }) => (
      <div>
        <p className="text-lg font-semibold uppercase tracking-[0.12em] text-sky">{t("KONTRA · Dua produk terkoordinasi", "CONTRA · Two coordinated products")}</p>
        <h2 className="mt-3 text-7xl font-semibold">ACE Strategy</h2>
        <p className="mt-2 font-display text-3xl font-semibold text-white/85">{ACE_STRATEGY.tagline}</p>
        <div className="mt-10">
          <PillarRow pillars={ACE_STRATEGY.pillars} step={step} accent="ace" />
        </div>
        <Step at={4} step={step}>
          <p className="mt-6 rounded-2xl bg-white/[0.07] p-4 text-lg text-white/80 ring-1 ring-white/12">{tx(ACE_STRATEGY.guardrail)}</p>
        </Step>
      </div>
    ),
  },
  {
    id: "ace-dual",
    section: "ace",
    title: L("Demonstrasi dua produk", "Dual-product demonstration"),
    steps: 2,
    accent: "ace",
    link: { href: "/dashboard/events", label: L("Demo Terang Events", "Terang Events demo") },
    notes: L(
      "Tunjukkan demo Events: Smart Event Templates dan Repeat Event Planner. Di sisi Interview, fitur esensial yang sama dengan ONE namun dikembangkan selektif. Batas WIP: satu inisiatif besar per produk.",
      "Show the Events demo: Smart Event Templates and Repeat Event Planner. On the Interview side, the same essential features as ONE, developed selectively. WIP limit: one major initiative per product.",
    ),
    render: (step) => (
      <div>
        <h2 className="text-5xl font-semibold">ACE Dual-Product Innovation Sprint</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            { icon: CalendarDays, title: "Terang Events", items: PRODUCTS.events.proposals.map((p) => p.name) },
            { icon: Brain, title: "AI Candidate Interview", items: ["Role-Based Interview Builder", "Evidence-Linked Assessment", "Recruiter Review Dashboard", "Responsible AI Controls"] },
          ].map((p, i) => (
            <Step key={p.title} at={i + 1} step={step} className={card}>
              <p className="flex items-center gap-3 text-3xl font-semibold">
                <p.icon className="h-8 w-8 text-sky" /> {p.title}
              </p>
              <ul className="mt-5 space-y-2.5 text-lg">
                {p.items.map((x) => (
                  <li key={x} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-sky" /> {x}
                  </li>
                ))}
              </ul>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "ace-coord",
    section: "ace",
    title: L("Koordinasi sumber daya", "Resource coordination"),
    steps: 2,
    accent: "ace",
    link: { href: "/dashboard/operations", label: "ACE Command Center" },
    notes: L(
      "Buka ACE Command Center: alokasi kapasitas per kelompok, _buffer_ wajib, QA bersama, batas WIP, anggaran, dan rekomendasi berbasis aturan. Tunjukkan _preset_ 'Bagi rata' yang melanggar batas.",
      "Open the ACE Command Center: capacity allocation per group, mandatory buffers, shared QA, WIP limits, budget and rule-based recommendations. Show how the 'Even split' preset breaks the limits.",
    ),
    render: (step, _a, { t }) => (
      <div>
        <h2 className="text-5xl font-semibold">ACE Command Center</h2>
        <p className="mt-3 text-xl text-white/70">{t("Kapasitas · anggaran · WIP · risiko — dalam satu layar.", "Capacity · budget · WIP · risk — on one screen.")}</p>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { title: "Product (3)", v: [["Interview", 37], ["Events", 25], ["QA", 13], ["Maint.", 10], ["Buffer", 15]] },
            { title: "Strategy & Ops (2)", v: [["Interview", 40], ["Events", 30], [t("Koordinasi", "Coordination"), 15], ["Buffer", 15]] },
            { title: "Leadership (2)", v: [["Interview", 45], ["Events", 30], [t("Tata kelola", "Governance"), 25]] },
          ].map((pool, i) => (
            <Step key={pool.title} at={i === 0 ? 1 : 2} step={step} className={card}>
              <p className="text-xl font-semibold">{pool.title}</p>
              <div className="mt-4 space-y-2">
                {(pool.v as [string, number][]).map(([k, n]) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm text-white/75">
                      <span>{k}</span>
                      <span>{n}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-ace-gradient" style={{ width: `${n}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Step>
          ))}
        </div>
        <Step at={2} step={step}>
          <p className="mt-6 flex items-center gap-2 text-lg text-white/75">
            <Gauge className="h-5 w-5 text-sky" />{" "}
            {t(
              "Aturan: total ≤ 100%, buffer ≥ 10%, QA ≥ 10%, tiap produk ≥ 15%, WIP 1 inisiatif besar per produk.",
              "Rules: total ≤ 100%, buffer ≥ 10%, QA ≥ 10%, each product ≥ 15%, WIP of 1 major initiative per product.",
            )}
          </p>
        </Step>
      </div>
    ),
  },
  {
    id: "ace-eval",
    section: "ace",
    title: "ACE Portfolio Intelligence",
    steps: 4,
    accent: "ace",
    link: { href: "/dashboard/portfolio", label: "Portfolio Intelligence" },
    notes: L(
      "Evaluasi per produk dan per portofolio. Empat keputusan: _Invest More_, _Optimize_, _Limit Scope_, _Pause Investment_. ACE tidak menjanjikan mempertahankan dua produk dengan segala cara — ada kondisi _exit_ yang transparan.",
      "Evaluate per product and per portfolio. Four decisions: Invest More, Optimize, Limit Scope, Pause Investment. ACE does not promise to keep both products at all costs — there are transparent exit conditions.",
    ),
    render: (step, _a, { t }) => (
      <div>
        <h2 className="text-5xl font-semibold">Evaluate & Evolve Portfolio</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          {[
            { icon: Rocket, title: "Invest More", d: t("Traksi kuat & ekonomi berkelanjutan", "Strong traction & sustainable economics"), c: "from-[#12a37a] to-[#0b7a5a]" },
            { icon: Wrench, title: "Optimize", d: t("Potensi ada, KPI tertentu perlu diperbaiki", "Potential is there; certain KPIs need work"), c: "from-[#4a90e2] to-[#2251c9]" },
            { icon: Minimize2, title: "Limit Scope", d: t("Bukti belum cukup untuk intensitas saat ini", "Not enough evidence for the current intensity"), c: "from-[#f0a92c] to-[#c97a06]" },
            { icon: Pause, title: "Pause Investment", d: t("_Milestone_ gagal berulang / risiko kritis", "Repeated missed milestones / critical risk"), c: "from-[#e0484d] to-[#a82025]" },
          ].map((g, i) => (
            <Step key={g.title} at={i + 1} step={step} className={cn("rounded-3xl bg-gradient-to-br p-6", g.c)}>
              <g.icon className="h-8 w-8" />
              <p className="mt-4 text-2xl font-semibold">{g.title}</p>
              <p className="mt-2 text-white/85">{g.d}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "compare",
    section: "compare",
    title: "ONE vs ACE",
    steps: 3,
    accent: "brand",
    mascot: "chart",
    link: { href: "/dashboard/simulator", label: L("Simulator Strategi", "Strategy Simulator") },
    notes: L(
      "Gunakan simulator untuk tanya-jawab juri. Kartu atas mengikuti asumsi simulator 12 bulan; hasil bisa berbalik bergantung asumsi (lihat tiga _preset_). Langkah terakhir menampilkan proyeksi jangka panjang proposal — horizon berbeda (36 vs 48 bulan), jadi bandingkan secara indikatif.",
      "Use the simulator for the judges' Q&A. The top cards follow the 12-month simulator assumptions; the result can flip depending on assumptions (see the three presets). The last step shows the proposal's long-term projection — horizons differ (36 vs 48 months), so compare indicatively.",
    ),
    render: (step, a, { t }) => {
      const { one, ace } = computeBoth(a);
      const presets = (Object.keys(SCENARIO_PRESETS) as (keyof typeof SCENARIO_PRESETS)[]).map((k) => {
        const b = computeBoth(SCENARIO_PRESETS[k].assumptions);
        return { label: t(SCENARIO_PRESETS[k].label), win: b.one.operatingResult >= b.ace.operatingResult ? "ONE" : "ACE" };
      });
      return (
        <div>
          <h2 className="text-5xl font-semibold">{t("Dua Strategi. Satu Realitas Sumber Daya.", "Two Strategies. One Resource Reality.")}</h2>
          <Step at={1} step={step} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { k: "ONE", r: one, g: "bg-one-gradient", icon: Target },
              { k: "ACE", r: ace, g: "bg-ace-gradient", icon: Layers },
            ].map(({ k, r, g, icon: Icon }) => (
              <div key={k} className={cn("rounded-3xl p-6", g)}>
                <p className="flex items-center gap-2 font-display text-4xl font-semibold">
                  <Icon className="h-8 w-8" /> {k}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-lg">
                  {[
                    [t("Pendapatan", "Revenue"), formatIDRCompact(r.revenue)],
                    [t("Kontribusi", "Contribution"), formatIDRCompact(r.totalContribution)],
                    [t("Hasil operasional", "Operating result"), formatIDRCompact(r.operatingResult)],
                    [t("Utilisasi Product", "Product utilisation"), formatPercent(r.capacity.productUtilization)],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-2xl bg-white/12 p-3 ring-1 ring-white/20">
                      <p className="text-sm text-white/75">{l}</p>
                      <p className="font-display text-2xl font-semibold">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Step>
          <Step at={2} step={step} className="mt-6 flex flex-wrap items-center gap-3 text-lg">
            <Scale className="h-6 w-6 text-sky" />
            {presets.map((p) => (
              <span key={p.label} className="rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/15">
                {p.label}: <strong>{p.win}</strong> {t("unggul", "leads")}
              </span>
            ))}
          </Step>
          <Step at={3} step={step} className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {FINANCIAL_PROJECTION.filter((row) => row.key === "npv" || row.key === "irr" || row.key === "payback").map((row) => (
              <div key={row.key} className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/15">
                <p className="text-sm text-white/65">{t(row.label)}</p>
                <p className="mt-1 text-lg">
                  ONE <strong className="font-display">{t(row.one)}</strong>
                  <span className="mx-2 text-white/40">·</span>
                  ACE <strong className="font-display">{t(row.ace)}</strong>
                </p>
              </div>
            ))}
            <p className="text-sm text-white/55 md:col-span-3">
              {t(
                "Proyeksi proposal: ONE 36 bulan, ACE 48 bulan — berbasis asumsi, bukan hasil aktual.",
                "Proposal projections: ONE 36 months, ACE 48 months — assumption-based, not actual results.",
              )}
            </p>
          </Step>
        </div>
      );
    },
  },
  {
    id: "conclusions",
    section: "compare",
    title: L("Kesimpulan kunci", "Key conclusions"),
    steps: 3,
    accent: "brand",
    mascot: "sparkle",
    link: { href: "/dashboard/simulator", label: L("Simulator Strategi", "Strategy Simulator") },
    notes: L(
      "Tutup dengan kondisi kapan masing-masing strategi lebih menarik. Jangan menentukan pemenang tunggal — keputusan bergantung pada bukti validasi pasar dan kapasitas eksekusi.",
      "Close with the conditions under which each strategy is more attractive. Don't name a single winner — the decision depends on market-validation evidence and execution capacity.",
    ),
    render: (step, _a, { t, tx }) => (
      <div>
        <h2 className="text-5xl font-semibold">{t("Kapan masing-masing strategi lebih menarik?", "When is each strategy more attractive?")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Step at={1} step={step} className="rounded-3xl bg-one-gradient p-6">
            <p className="flex items-center gap-2 text-3xl font-semibold">
              <Target className="h-7 w-7" /> {t("ONE unggul bila…", "ONE wins when…")}
            </p>
            <ul className="mt-4 space-y-2 text-lg text-white/90">
              {[
                L("Permintaan rekrutmen B2B kuat & konversi _pilot_ tinggi", "B2B hiring demand is strong & pilot conversion is high"),
                L("Nilai per pelanggan Interview jauh lebih besar", "Interview's value per customer is much larger"),
                L("Tim kecil perlu menghindari _context switching_", "A small team needs to avoid context switching"),
                L("Responsible AI & kualitas bisa dibuktikan cepat", "Responsible AI & quality can be proven quickly"),
              ].map((x) => (
                <li key={x.id} className="flex gap-2">
                  <BadgeCheck className="mt-1 h-5 w-5 shrink-0" /> <span>{tx(x)}</span>
                </li>
              ))}
            </ul>
          </Step>
          <Step at={2} step={step} className="rounded-3xl bg-ace-gradient p-6">
            <p className="flex items-center gap-2 text-3xl font-semibold">
              <Layers className="h-7 w-7" /> {t("ACE unggul bila…", "ACE wins when…")}
            </p>
            <ul className="mt-4 space-y-2 text-lg text-white/90">
              {[
                L("Validasi Interview lambat — diversifikasi mengurangi risiko", "Interview validation is slow — diversification reduces risk"),
                L("Events punya margin & permintaan _organizer_ yang solid", "Events has solid margins & organizer demand"),
                L("_Overhead_ koordinasi tetap rendah & WIP disiplin", "Coordination overhead stays low & WIP is disciplined"),
                L("Ada mekanisme _Limit Scope / Pause_ yang tegas", "There is a firm Limit Scope / Pause mechanism"),
              ].map((x) => (
                <li key={x.id} className="flex gap-2">
                  <BadgeCheck className="mt-1 h-5 w-5 shrink-0" /> <span>{tx(x)}</span>
                </li>
              ))}
            </ul>
          </Step>
        </div>
        <Step at={3} step={step}>
          <p className="mt-8 flex items-start gap-3 text-xl text-white/80">
            <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-sky" />
            {t(
              "Tantangannya bukan sekadar memilih jumlah produk, tetapi mengonversi peluang pasar menjadi pertumbuhan terukur dengan sumber daya optimal.",
              "The challenge is not just choosing how many products, but converting market opportunity into measurable growth with optimal resources.",
            )}
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/50">
            <TriangleAlert className="h-4 w-4" /> {t("Prototipe konsep akademik — BCDC 2026.", "Academic concept prototype — BCDC 2026.")}
          </p>
        </Step>
      </div>
    ),
  },
];
