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
import { ACE_STRATEGY, CHALLENGES, KEY_QUESTION, ONE_STRATEGY } from "@/data/strategy";
import { COMPANY, PRODUCTS } from "@/data/company";
import { TEAM } from "@/data/team";
import { formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { Logo, Mascot, type MascotName } from "@/components/shared/brand";
import { cn } from "@/lib/utils";

export interface SlideDef {
  id: string;
  section: "Konteks" | "ONE · PRO" | "ACE · KONTRA" | "Perbandingan";
  title: string;
  steps: number;
  notes: string;
  mascot?: MascotName;
  link?: { href: string; label: string };
  accent: "brand" | "one" | "ace";
  render: (step: number, a: Assumptions) => ReactNode;
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
    <div className="grid gap-4 md:grid-cols-3">
      {pillars.map((p, i) => (
        <Step key={p.letter} at={i + 1} step={step} className={card}>
          <span className={cn("grid h-14 w-14 place-items-center rounded-2xl font-display text-3xl font-bold text-white", accent === "one" ? "bg-one-gradient" : "bg-ace-gradient")}>{p.letter}</span>
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
    section: "Konteks",
    title: "Terang AI",
    steps: 2,
    accent: "brand",
    mascot: "wave",
    link: { href: "/company", label: "Company overview" },
    notes:
      "Buka dengan konteks: Terang AI adalah startup EdTech Indonesia (PT Terang Inovasi Indonesia) yang diperkenalkan 2024. Mulai dari B2C — UTBK, CPNS, beasiswa, simulasi wawancara AI — lalu bergerak ke B2B. Tegaskan bahwa ini prototype akademik tidak resmi.",
    render: (step) => (
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Logo height={48} href={null} />
          <h1 className="mt-8 text-6xl font-bold leading-[1.02] xl:text-7xl">
            Smarter Solutions,
            <br />
            <span className="text-gradient-light">Brighter Futures.</span>
          </h1>
          <Step at={1} step={step}>
            <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-white/75">From AI-Powered Education to B2B Business Solutions.</p>
          </Step>
        </div>
        <Step at={2} step={step} className="grid gap-3">
          {[
            ["Badan hukum", COMPANY.legalName],
            ["Diperkenalkan", "2024 · Indonesia"],
            ["Evolusi", "B2C EdTech → B2B Solutions"],
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
    section: "Konteks",
    title: "Dua produk B2B",
    steps: 2,
    accent: "brand",
    link: { href: "/products", label: "Dua produk B2B" },
    notes: "Perkenalkan dua produk fokus. Terang Events = EventTech untuk penyelenggara acara. AI Candidate Interview = HRTech untuk tim rekrutmen. Tekankan pembeli & workflow yang berbeda.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">Dua produk B2B, dua pasar berbeda.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[PRODUCTS.events, PRODUCTS.interview].map((p, i) => (
            <Step key={p.key} at={i + 1} step={step} className={cn(card, "relative overflow-hidden")}>
              <Mascot name={i === 0 ? "events" : "interview"} size={130} className="absolute -bottom-4 -right-2" />
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky">{p.category}</p>
              <p className="mt-2 text-4xl font-bold">{p.name}</p>
              <p className="mt-3 max-w-md text-lg text-white/75">{p.tagline}</p>
              <p className="mt-5 text-sm text-white/60">Pembeli: {p.buyer}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "market",
    section: "Konteks",
    title: "Peluang pasar",
    steps: 2,
    accent: "brand",
    notes: "Jelaskan masalah pelanggan masing-masing pasar secara kualitatif — tidak ada klaim ukuran pasar yang belum diverifikasi. Events: koordinasi & setup berulang. Interview: screening yang memakan waktu & bukti penilaian.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">Masalah nyata di dua segmen.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            { icon: GraduationCap, t: "Penyelenggara acara & institusi", items: PRODUCTS.events.problems.slice(0, 4) },
            { icon: Users, t: "Tim HR & talent acquisition", items: PRODUCTS.interview.problems.slice(0, 4) },
          ].map((m, i) => (
            <Step key={m.t} at={i + 1} step={step} className={card}>
              <m.icon className="h-8 w-8 text-sky" />
              <p className="mt-3 text-2xl font-semibold">{m.t}</p>
              <ul className="mt-4 space-y-2 text-lg text-white/75">
                {m.items.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-sky" /> {x}
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
    section: "Konteks",
    title: "Dilema strategis",
    steps: 1,
    accent: "brand",
    mascot: "think",
    link: { href: "/strategy-lab", label: "Strategy Lab" },
    notes: "Ini inti kasus. Dua peluang, sumber daya terbatas. Bacakan key strategic question perlahan. Tekankan bahwa kita menilai dua alternatif secara adil.",
    render: (step) => (
      <div className="max-w-5xl">
        <p className="text-lg font-semibold uppercase tracking-[0.12em] text-sky">Strategic Growth Dilemma</p>
        <h2 className="mt-4 text-6xl font-bold leading-[1.05]">
          Two Opportunities. Limited Resources. <span className="text-gradient-light">One Strategic Decision.</span>
        </h2>
        <Step at={1} step={step}>
          <p className="mt-10 rounded-3xl bg-white/[0.07] p-8 font-display text-3xl font-bold leading-snug ring-1 ring-white/12">“{KEY_QUESTION}”</p>
        </Step>
      </div>
    ),
  },
  {
    id: "challenges",
    section: "Konteks",
    title: "Tantangan sumber daya & operasional",
    steps: 4,
    accent: "brand",
    notes: "Tiga gap: kapasitas (7 personel dalam studi kasus), validasi pasar, kompleksitas eksekusi. Sebutkan bahwa angka tujuh personel adalah konfigurasi studi kasus, bukan verifikasi headcount.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">Tiga tantangan utama</h2>
        <Step at={1} step={step} className="mt-6 flex items-center gap-2">
          {TEAM.map((m) => (
            <span key={m.id} className={cn("grid h-12 w-12 place-items-center rounded-full text-sm font-semibold ring-4 ring-navy", m.pool === "leadership" ? "bg-white text-navy" : m.pool === "product" ? "bg-brand-gradient" : "bg-ace-gradient")}>
              {m.role === "CEO" || m.role === "CPO" ? m.role : m.initials}
            </span>
          ))}
          <span className="ml-3 text-lg text-white/70">7 personel (konteks studi kasus)</span>
        </Step>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CHALLENGES.map((c, i) => (
            <Step key={c.id} at={i + 2} step={step} className={card}>
              <p className="font-display text-5xl font-bold text-sky/60">{c.number}</p>
              <p className="mt-2 text-2xl font-semibold">{c.english}</p>
              <p className="mt-2 text-white/70">{c.summary}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "one-overview",
    section: "ONE · PRO",
    title: "ONE Strategy",
    steps: 3,
    accent: "one",
    mascot: "target",
    link: { href: "/strategies/one", label: "ONE Strategy" },
    notes: "ONE: prioritaskan AI Candidate Interview. Tiga pilar: Optimize Product Value, Navigate Market Growth, Evaluate for Expansion. Events tetap maintenance-only — biaya maintenance tetap dihitung.",
    render: (step) => (
      <div>
        <p className="text-lg font-semibold uppercase tracking-[0.12em] text-sky">PRO · Prioritaskan satu produk</p>
        <h2 className="mt-3 text-7xl font-bold">ONE Strategy</h2>
        <p className="mt-2 font-display text-3xl font-bold text-white/85">{ONE_STRATEGY.tagline}</p>
        <div className="mt-10">
          <PillarRow pillars={ONE_STRATEGY.pillars} step={step} accent="one" />
        </div>
      </div>
    ),
  },
  {
    id: "one-product",
    section: "ONE · PRO",
    title: "AI Interview Intelligence Suite",
    steps: 2,
    accent: "one",
    link: { href: "/dashboard/interview", label: "Demo AI Interview" },
    notes: "Tunjukkan demo: builder per jabatan, wawancara terstruktur, laporan berbasis bukti, review recruiter, Responsible AI. Tekankan: AI pendukung keputusan, bukan otoritas perekrutan.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">From generic scores to evidence-based recruiter insights.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {PRODUCTS.interview.proposals.map((f, i) => (
            <Step key={f.name} at={i < 3 ? 1 : 2} step={step} className={card}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-gradient text-lg font-semibold">{i + 1}</span>
              <p className="mt-3 text-xl font-semibold">{f.name}</p>
              <p className="mt-2 text-sm text-white/65">{f.description}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "one-gtm",
    section: "ONE · PRO",
    title: "ONE go-to-market",
    steps: 1,
    accent: "one",
    link: { href: "/strategies/one?pillar=navigate", label: "Pilot-to-Paid funnel" },
    notes: "Pilot-to-Paid Growth Engine: komunitas HR, LinkedIn, webinar HR Efficiency Clinic, demo enterprise, pilot terbatas, evaluasi ROI, konversi & renewal. Angka funnel mengikuti asumsi simulator saat ini.",
    render: (step, a) => {
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
          <h2 className="text-5xl font-bold">Pilot-to-Paid Growth Engine</h2>
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
            <p className="pt-2 text-sm text-white/55">Asumsi ilustratif dari simulator — bukan data Terang AI.</p>
          </Step>
        </div>
      );
    },
  },
  {
    id: "one-eval",
    section: "ONE · PRO",
    title: "Evaluate for Expansion",
    steps: 3,
    accent: "one",
    link: { href: "/strategies/one?pillar=evaluate", label: "Expansion Gate" },
    notes: "Expansion Gate: Scale jika kualitas, permintaan, ekonomi, kapasitas & keamanan lulus. Improve jika ada target meleset tapi bisa diperbaiki. Pause/Revalidate jika privasi, kualitas, atau kelayakan komersial gagal. Privasi & validitas adalah hard gate.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">ONE Growth Intelligence & Expansion Gate</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Rocket, t: "Scale", d: "Kualitas, permintaan, ekonomi, kapasitas & keamanan lulus.", c: "from-[#12a37a] to-[#0b7a5a]" },
            { icon: Wrench, t: "Improve", d: "Beberapa target meleset, perbaikan masih layak.", c: "from-[#4a90e2] to-[#2251c9]" },
            { icon: Pause, t: "Pause / Revalidate", d: "Kualitas, privasi, atau kelayakan komersial gagal.", c: "from-[#e0484d] to-[#a82025]" },
          ].map((g, i) => (
            <Step key={g.t} at={i + 1} step={step} className={cn("rounded-3xl bg-gradient-to-br p-6", g.c)}>
              <g.icon className="h-9 w-9" />
              <p className="mt-4 text-3xl font-bold">{g.t}</p>
              <p className="mt-2 text-lg text-white/85">{g.d}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "ace-overview",
    section: "ACE · KONTRA",
    title: "ACE Strategy",
    steps: 4,
    accent: "ace",
    mascot: "puzzle",
    link: { href: "/strategies/ace", label: "ACE Strategy" },
    notes: "ACE: kembangkan kedua produk secara terkoordinasi. Tiga pilar: Agile Feature Development, Coordinate Markets & Capacity, Evaluate and Evolve Portfolio. Guardrail: tidak harus 50:50; produk kedua harus membuktikan nilainya.",
    render: (step) => (
      <div>
        <p className="text-lg font-semibold uppercase tracking-[0.12em] text-sky">KONTRA · Dua produk terkoordinasi</p>
        <h2 className="mt-3 text-7xl font-bold">ACE Strategy</h2>
        <p className="mt-2 font-display text-3xl font-bold text-white/85">{ACE_STRATEGY.tagline}</p>
        <div className="mt-10">
          <PillarRow pillars={ACE_STRATEGY.pillars} step={step} accent="ace" />
        </div>
        <Step at={4} step={step}>
          <p className="mt-6 rounded-2xl bg-white/[0.07] p-4 text-lg text-white/80 ring-1 ring-white/12">{ACE_STRATEGY.guardrail}</p>
        </Step>
      </div>
    ),
  },
  {
    id: "ace-dual",
    section: "ACE · KONTRA",
    title: "Dual-product demonstration",
    steps: 2,
    accent: "ace",
    link: { href: "/dashboard/events", label: "Demo Terang Events" },
    notes: "Tunjukkan demo Events: Smart Event Templates dan Repeat Event Planner. Di sisi Interview, fitur esensial yang sama dengan ONE namun dikembangkan selektif. Batas WIP: satu inisiatif besar per produk.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">ACE Dual-Product Innovation Sprint</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            { icon: CalendarDays, t: "Terang Events", items: PRODUCTS.events.proposals.map((p) => p.name) },
            { icon: Brain, t: "AI Candidate Interview", items: ["Role-Based Interview Builder", "Evidence-Linked Assessment", "Recruiter Review Dashboard", "Responsible AI Controls"] },
          ].map((p, i) => (
            <Step key={p.t} at={i + 1} step={step} className={card}>
              <p className="flex items-center gap-3 text-3xl font-bold">
                <p.icon className="h-8 w-8 text-sky" /> {p.t}
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
    section: "ACE · KONTRA",
    title: "Koordinasi sumber daya",
    steps: 2,
    accent: "ace",
    link: { href: "/dashboard/operations", label: "ACE Command Center" },
    notes: "Buka ACE Command Center: alokasi kapasitas per kelompok, buffer wajib, QA bersama, batas WIP, anggaran, dan rekomendasi berbasis aturan. Tunjukkan preset 'Bagi rata' yang melanggar batas.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">ACE Command Center</h2>
        <p className="mt-3 text-xl text-white/70">Kapasitas · anggaran · WIP · risiko — dalam satu layar.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { t: "Product (3)", v: [["Interview", 37], ["Events", 25], ["QA", 13], ["Maint.", 10], ["Buffer", 15]] },
            { t: "Strategy & Ops (2)", v: [["Interview", 40], ["Events", 30], ["Koordinasi", 15], ["Buffer", 15]] },
            { t: "Leadership (2)", v: [["Interview", 45], ["Events", 30], ["Tata kelola", 25]] },
          ].map((pool, i) => (
            <Step key={pool.t} at={i === 0 ? 1 : 2} step={step} className={card}>
              <p className="text-xl font-semibold">{pool.t}</p>
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
            <Gauge className="h-5 w-5 text-sky" /> Aturan: total ≤ 100%, buffer ≥ 10%, QA ≥ 10%, tiap produk ≥ 15%, WIP 1 inisiatif besar per produk.
          </p>
        </Step>
      </div>
    ),
  },
  {
    id: "ace-eval",
    section: "ACE · KONTRA",
    title: "ACE Portfolio Intelligence",
    steps: 4,
    accent: "ace",
    link: { href: "/dashboard/portfolio", label: "Portfolio Intelligence" },
    notes: "Evaluasi per produk dan per portofolio. Empat keputusan: Invest more, Improve, Reduce scope, Pause. ACE tidak menjanjikan mempertahankan dua produk dengan segala cara — ada kondisi exit yang transparan.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">Evaluate & Evolve Portfolio</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {[
            { icon: Rocket, t: "Invest more", d: "Traksi kuat & ekonomi berkelanjutan", c: "from-[#12a37a] to-[#0b7a5a]" },
            { icon: Wrench, t: "Improve", d: "Potensi ada, KPI tertentu perlu diperbaiki", c: "from-[#4a90e2] to-[#2251c9]" },
            { icon: Minimize2, t: "Reduce scope", d: "Bukti belum cukup untuk intensitas saat ini", c: "from-[#f0a92c] to-[#c97a06]" },
            { icon: Pause, t: "Pause", d: "Milestone gagal berulang / risiko kritis", c: "from-[#e0484d] to-[#a82025]" },
          ].map((g, i) => (
            <Step key={g.t} at={i + 1} step={step} className={cn("rounded-3xl bg-gradient-to-br p-6", g.c)}>
              <g.icon className="h-8 w-8" />
              <p className="mt-4 text-2xl font-semibold">{g.t}</p>
              <p className="mt-2 text-white/85">{g.d}</p>
            </Step>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "compare",
    section: "Perbandingan",
    title: "ONE vs ACE",
    steps: 2,
    accent: "brand",
    mascot: "chart",
    link: { href: "/dashboard/simulator", label: "Strategy Simulator" },
    notes: "Gunakan simulator untuk Q&A juri. Angka di slide ini mengikuti asumsi simulator saat ini. Tunjukkan bahwa hasil bisa berbalik bergantung asumsi (lihat tabel tiga preset).",
    render: (step, a) => {
      const { one, ace } = computeBoth(a);
      const presets = (Object.keys(SCENARIO_PRESETS) as (keyof typeof SCENARIO_PRESETS)[]).map((k) => {
        const b = computeBoth(SCENARIO_PRESETS[k].assumptions);
        return { label: SCENARIO_PRESETS[k].label, win: b.one.operatingResult >= b.ace.operatingResult ? "ONE" : "ACE" };
      });
      return (
        <div>
          <h2 className="text-5xl font-bold">Two Strategies. One Resource Reality.</h2>
          <Step at={1} step={step} className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { k: "ONE", r: one, g: "bg-one-gradient", icon: Target },
              { k: "ACE", r: ace, g: "bg-ace-gradient", icon: Layers },
            ].map(({ k, r, g, icon: Icon }) => (
              <div key={k} className={cn("rounded-3xl p-6", g)}>
                <p className="flex items-center gap-2 font-display text-4xl font-bold">
                  <Icon className="h-8 w-8" /> {k}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-lg">
                  {[
                    ["Pendapatan", formatIDRCompact(r.revenue)],
                    ["Kontribusi", formatIDRCompact(r.totalContribution)],
                    ["Hasil operasional", formatIDRCompact(r.operatingResult)],
                    ["Utilisasi Product", formatPercent(r.capacity.productUtilization)],
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
                {p.label}: <strong>{p.win}</strong> unggul
              </span>
            ))}
          </Step>
        </div>
      );
    },
  },
  {
    id: "conclusions",
    section: "Perbandingan",
    title: "Kesimpulan kunci",
    steps: 3,
    accent: "brand",
    mascot: "sparkle",
    link: { href: "/dashboard/simulator", label: "Uji asumsi" },
    notes: "Tutup dengan kondisi kapan masing-masing strategi lebih menarik. Jangan menentukan pemenang tunggal — keputusan bergantung pada bukti validasi pasar dan kapasitas eksekusi.",
    render: (step) => (
      <div>
        <h2 className="text-5xl font-bold">Kapan masing-masing strategi lebih menarik?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Step at={1} step={step} className="rounded-3xl bg-one-gradient p-6">
            <p className="flex items-center gap-2 text-3xl font-bold">
              <Target className="h-7 w-7" /> ONE unggul bila…
            </p>
            <ul className="mt-4 space-y-2 text-lg text-white/90">
              {["Permintaan rekrutmen B2B kuat & konversi pilot tinggi", "Nilai per pelanggan Interview jauh lebih besar", "Tim kecil perlu menghindari context switching", "Responsible AI & kualitas bisa dibuktikan cepat"].map((x) => (
                <li key={x} className="flex gap-2"><BadgeCheck className="mt-1 h-5 w-5 shrink-0" /> {x}</li>
              ))}
            </ul>
          </Step>
          <Step at={2} step={step} className="rounded-3xl bg-ace-gradient p-6">
            <p className="flex items-center gap-2 text-3xl font-bold">
              <Layers className="h-7 w-7" /> ACE unggul bila…
            </p>
            <ul className="mt-4 space-y-2 text-lg text-white/90">
              {["Validasi Interview lambat — diversifikasi mengurangi risiko", "Events punya margin & permintaan organizer yang solid", "Overhead koordinasi tetap rendah & WIP disiplin", "Ada mekanisme reduce/pause yang tegas"].map((x) => (
                <li key={x} className="flex gap-2"><BadgeCheck className="mt-1 h-5 w-5 shrink-0" /> {x}</li>
              ))}
            </ul>
          </Step>
        </div>
        <Step at={3} step={step}>
          <p className="mt-8 flex items-start gap-3 text-xl text-white/80">
            <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-sky" />
            Tantangannya bukan sekadar memilih jumlah produk, tetapi mengonversi peluang pasar menjadi pertumbuhan terukur dengan sumber daya optimal.
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/50">
            <TriangleAlert className="h-4 w-4" /> Unofficial academic concept prototype — BCDC 2026.
          </p>
        </Step>
      </div>
    ),
  },
];
