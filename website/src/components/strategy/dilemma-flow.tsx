"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Boxes, Brain, CalendarDays, GitFork, Layers, Pause, Play, Target, TriangleAlert, Users } from "lucide-react";
import { TEAM } from "@/data/team";
import { CHALLENGES } from "@/data/strategy";
import { SourceLabel } from "@/components/shared/source-label";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "products", label: "Two B2B Products", short: "Dua produk", icon: Boxes },
  { id: "capacity", label: "Shared Company Capacity", short: "Kapasitas bersama", icon: Users },
  { id: "challenges", label: "Three Business Challenges", short: "Tiga tantangan", icon: TriangleAlert },
  { id: "alternatives", label: "Two Strategic Alternatives", short: "Dua alternatif", icon: GitFork },
] as const;

type StageId = (typeof STAGES)[number]["id"];

function StagePanel({ id }: { id: StageId }) {
  if (id === "products") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { name: "Terang Events", cat: "EventTech", icon: CalendarDays, color: "bg-[#e5f6ff] text-sky-ink", text: "Penyelenggara acara & kompetisi — registrasi, pembayaran, penjurian." },
          { name: "AI Candidate Interview", cat: "HRTech", icon: Brain, color: "bg-one-soft text-one", text: "Tim HR — wawancara terstruktur & evaluasi kandidat berbasis bukti." },
        ].map((p) => (
          <div key={p.name} className="rounded-2xl border border-line bg-white p-5">
            <span className={cn("grid h-10 w-10 place-items-center rounded-xl", p.color)}>
              <p.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">{p.cat}</p>
            <p className="text-lg font-bold text-ink">{p.name}</p>
            <p className="mt-1 text-sm text-muted-strong">{p.text}</p>
          </div>
        ))}
      </div>
    );
  }
  if (id === "capacity") {
    const pools = [
      { label: "Leadership", members: TEAM.filter((t) => t.pool === "leadership"), color: "bg-navy" },
      { label: "Product", members: TEAM.filter((t) => t.pool === "product"), color: "bg-brand-gradient" },
      { label: "Strategy & Ops", members: TEAM.filter((t) => t.pool === "ops"), color: "bg-ace-gradient" },
    ];
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">7 personel melayani dua peluang sekaligus</p>
          <SourceLabel type="internal-restricted-context" compact />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {pools.map((pool) => (
            <div key={pool.label} className="rounded-2xl border border-line bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{pool.label}</p>
              <div className="mt-3 flex -space-x-2">
                {pool.members.map((m, i) => (
                  <motion.span
                    key={m.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08, type: "spring" }}
                    title={m.title}
                    className={cn("grid h-11 w-11 place-items-center rounded-full text-xs font-bold text-white ring-4 ring-white", pool.color)}
                  >
                    {m.role === "Product" || m.role === "Strategy & Ops" ? m.initials : m.role}
                  </motion.span>
                ))}
              </div>
              <ul className="mt-3 space-y-0.5 text-[11.5px] text-muted-strong">
                {pool.members.map((m) => (
                  <li key={m.id}>{m.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-strong">
          Kapasitas tidak dapat dipertukarkan: jam CEO/CPO bukan jam engineering, dan tim Product terpisah dari Strategy & Ops.
        </p>
      </div>
    );
  }
  if (id === "challenges") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {CHALLENGES.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-line bg-white p-4"
          >
            <span className="font-display text-2xl font-extrabold text-gradient">{c.number}</span>
            <p className="mt-1 font-bold text-ink">{c.english}</p>
            <p className="mt-1 text-[13px] text-muted-strong">{c.summary}</p>
          </motion.div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        { k: "ONE", t: "Focus to Grow", d: "Prioritaskan AI Candidate Interview; Events maintenance-only.", icon: Target, g: "bg-one-gradient" },
        { k: "ACE", t: "Coordinate to Grow", d: "Kembangkan dua produk dengan alokasi terkendali & evaluasi portofolio.", icon: Layers, g: "bg-ace-gradient" },
      ].map((s) => (
        <div key={s.k} className={cn("rounded-2xl p-5 text-white", s.g)}>
          <s.icon className="h-6 w-6" />
          <p className="mt-3 font-display text-3xl font-extrabold">{s.k}</p>
          <p className="font-semibold">{s.t}</p>
          <p className="mt-1 text-sm text-white/85">{s.d}</p>
        </div>
      ))}
    </div>
  );
}

export function DilemmaFlow() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % STAGES.length), 3200);
    return () => window.clearInterval(t);
  }, [playing]);

  return (
    <div className="rounded-[28px] border border-line bg-gradient-to-br from-white to-[#f1f8ff] p-5 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink">Alur dilema — klik setiap tahap</p>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1d4674]"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Jeda" : "Putar alur otomatis"}
        </button>
      </div>
      <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-[3px] rounded-full bg-[#dfeaf6] md:block">
          <motion.div
            className="h-full rounded-full bg-brand-gradient"
            animate={{ width: `${(active / (STAGES.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        {STAGES.map((s, i) => {
          const done = i <= active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActive(i);
                setPlaying(false);
              }}
              className="relative flex flex-col items-center text-center"
              aria-current={i === active ? "step" : undefined}
            >
              <motion.span
                animate={{ scale: i === active ? 1.08 : 1 }}
                className={cn(
                  "relative z-10 grid h-14 w-14 place-items-center rounded-2xl ring-[6px] ring-white transition-colors",
                  done ? "bg-brand-gradient text-white shadow-glow" : "bg-white text-muted shadow-soft",
                )}
              >
                <s.icon className="h-6 w-6" />
              </motion.span>
              <span className={cn("mt-3 text-[11px] font-bold uppercase tracking-[0.12em]", done ? "text-brand-ink" : "text-muted")}>
                Tahap {i + 1}
              </span>
              <span className={cn("text-sm font-bold", i === active ? "text-ink" : "text-muted-strong")}>{s.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-8 min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={STAGES[active].id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <StagePanel id={STAGES[active].id} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
