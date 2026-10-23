"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, BadgeCheck, CalendarDays, LayoutDashboard, Play, Sparkles, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark, Mascot } from "@/components/shared/brand";
import { ScrollCue } from "@/components/layout/container";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

function EventsPreview() {
  const { t } = useI18n();
  const bars = [38, 52, 46, 68, 74, 88, 80];
  return (
    <div className="w-[270px] rounded-2xl border border-white/70 bg-card/90 p-4 shadow-lift backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-soft text-sky-ink">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-muted">Terang Events</p>
            <p className="text-[13px] font-semibold text-ink">Organizer Dashboard</p>
          </div>
        </div>
        <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success-ink">Live</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          [t("Peserta", "Participants"), t("1.204", "1,204")],
          [t("Submisi", "Submissions"), "248"],
          [t("Juri", "Judges"), "18"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-surface px-2 py-2">
            <p className="text-[11px] text-muted">{k}</p>
            <p className="tabular text-sm font-semibold text-ink">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 4 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.8 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-md bg-gradient-to-t from-[#39b7ff] to-[#8fd8ff]"
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-soft px-2.5 py-2 text-[11px] font-semibold text-brand-ink">
        <Trophy className="h-3.5 w-3.5" /> {t("Penjurian babak 1 · 64% selesai", "Round 1 judging · 64% done")}
      </div>
    </div>
  );
}

function InterviewPreview() {
  const { t } = useI18n();
  const rows = [
    [t("Komunikasi", "Communication"), 82],
    [t("Empati pelanggan", "Customer empathy"), 74],
    [t("Pemecahan masalah", "Problem solving"), 66],
  ] as const;
  return (
    <div className="w-[280px] rounded-2xl border border-white/70 bg-card/90 p-4 shadow-lift backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-one-soft text-one-ink">
            <Users className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-muted">AI Candidate Interview</p>
            <p className="text-[13px] font-semibold text-ink">Evidence Report</p>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2.5">
        {rows.map(([label, v], i) => (
          <div key={label}>
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-ink">{label}</span>
              <span className="text-muted">{t("Rubrik", "Rubric")}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-track">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${v}%` }}
                transition={{ delay: 1 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-[#4a90e2] to-[#2251c9]"
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-xl border border-line bg-surface px-2.5 py-2 text-[11px] italic leading-snug text-muted-strong">
        {t("“…saya memecah langkah jadi tiga bagian, lalu meminta beliau mengulang untuk konfirmasi.”", "“…I broke the steps into three parts, then asked her to repeat them back to confirm.”")}
      </p>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-success-ink">
        <BadgeCheck className="h-3.5 w-3.5" /> {t("Ditinjau manusia — bukan keputusan otomatis", "Human-reviewed — not an automated decision")}
      </div>
    </div>
  );
}

function HeroVisual() {
  const { t } = useI18n();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const leftX = useTransform(sx, (v) => v * -14);
  const leftY = useTransform(sy, (v) => v * -10);
  const rightX = useTransform(sx, (v) => v * 16);
  const rightY = useTransform(sy, (v) => v * 12);
  const coreX = useTransform(sx, (v) => v * 6);
  const coreY = useTransform(sy, (v) => v * 6);

  return (
    <div className="relative mx-auto h-[400px] w-full max-w-[560px] sm:h-[580px] lg:h-[500px] xl:h-[580px]">
      <div
        className="absolute left-1/2 top-0 h-[580px] w-[560px] origin-top -translate-x-1/2 scale-[0.68] sm:scale-100 lg:scale-[0.86] xl:scale-100"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        {/* Data-flow connectors */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 580" fill="none" aria-hidden>
          <defs>
            <linearGradient id="flowA" x1="0" x2="1">
              <stop offset="0%" stopColor="#39b7ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#39b7ff" />
            </linearGradient>
            <linearGradient id="flowB" x1="0" x2="0" y1="1" y2="0">
              <stop offset="0%" stopColor="#2251c9" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2251c9" />
            </linearGradient>
          </defs>
          <path d="M262 132 C 295 132, 300 150, 332 150" stroke="url(#flowA)" strokeWidth="2.5" strokeDasharray="6 6" className="animate-dash" />
          <path d="M440 300 C 446 275, 436 262, 430 240" stroke="url(#flowB)" strokeWidth="2.5" strokeDasharray="6 6" className="animate-dash" />
          <circle cx="420" cy="150" r="118" stroke="#4a90e2" strokeOpacity="0.16" strokeDasharray="2 8" />
          <circle cx="420" cy="150" r="148" stroke="#39b7ff" strokeOpacity="0.12" />
        </svg>

        {/* Central brand core */}
        <div className="absolute left-[332px] top-[62px]">
          <motion.div style={{ x: coreX, y: coreY }}>
            <div className="relative grid h-44 w-44 place-items-center">
              <span className="absolute inset-0 rounded-full bg-sky/30 animate-pulse-ring" />
              <span className="absolute inset-0 rounded-full bg-brand/20 animate-pulse-ring [animation-delay:1.3s]" />
              <div className="absolute inset-0 rounded-full border border-dashed border-brand/40 animate-spin-slow" />
              <div className="absolute -inset-5 rounded-full border border-sky/30 animate-spin-slower">
                <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-sky shadow-glow" />
              </div>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 160, damping: 16 }}
                className="relative grid h-32 w-32 place-items-center rounded-full bg-card shadow-glow ring-8 ring-white/60"
              >
                <LogoMark size={88} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-2"
        >
          <motion.div style={{ x: leftX, y: leftY }}>
            <div className="animate-float">
              <EventsPreview />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 right-0"
        >
          <motion.div style={{ x: rightX, y: rightY }}>
            <div className="animate-float-slow">
              <InterviewPreview />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="absolute bottom-0 left-8"
        >
          <Mascot name="wave" size={180} preload />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute left-2 top-[300px] flex items-center gap-2 rounded-full border border-white/70 bg-card/85 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-soft backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-sky" /> {t("2 produk · 2 strategi · 1 keputusan", "2 products · 2 strategies · 1 decision")}
        </motion.div>
      </div>
    </div>
  );
}

export function Hero() {
  const { t, tx } = useI18n();
  return (
    <section className="relative isolate flex min-h-hero items-center overflow-hidden">
      <div className="bg-page-gradient absolute inset-0 -z-10" />
      <div className="bg-grid absolute inset-0 -z-10 mask-fade-b" />
      <div className="absolute -left-40 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-sky/20 blur-[100px]" />
      <div className="absolute -right-32 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-royal/15 blur-[110px]" />

      <div className="mx-auto grid grid-cols-1 w-full max-w-7xl items-center gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:py-16">
        <motion.div initial="hidden" animate="show">
          <motion.div
            custom={0}
            variants={fadeUp}
            className="eyebrow inline-flex items-center gap-2 rounded-full border border-brand/20 bg-card/70 px-3 py-1.5 text-brand-ink shadow-soft backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky" /> AI-Powered Business Innovation
          </motion.div>
          <motion.h1
            custom={1}
            variants={fadeUp}
            className="mt-6 text-[2.75rem] font-semibold leading-[1.03] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.25rem]"
          >
            Smarter Solutions,
            <br />
            <span className="text-gradient">Brighter Futures.</span>
          </motion.h1>
          <motion.p custom={2} variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-strong">
            {t("Kenali dua produk B2B Terang AI, pahami dilema pertumbuhannya, lalu uji strategi", "Meet Terang AI's two B2B products, understand its growth dilemma, then test the")}{" "}
            <strong className="font-semibold text-ink">ONE</strong> {t("dan", "and")} <strong className="font-semibold text-ink">ACE</strong>{" "}
            {t("secara interaktif.", "strategies interactively.")}
          </motion.p>
          <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button href="/dashboard" size="lg">
              <LayoutDashboard className="h-4 w-4" /> {tx("Buka _Dashboard_", "Open Dashboard")}
            </Button>
            <Button href="#tentang" size="lg" variant="secondary">
              {t("Mulai jelajah", "Start exploring")} <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div custom={4} variants={fadeUp} className="mt-4">
            <Button href="/presentation" variant="ghost" className="-ml-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-white shadow-glow">
                <Play className="h-3 w-3 fill-current" />
              </span>
              {t("Mode presentasi untuk juri", "Presentation mode for judges")}
            </Button>
          </motion.div>
          <motion.dl custom={5} variants={fadeUp} className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              ["2024", t("Diperkenalkan", "Introduced")],
              ["2", t("Produk B2B", "B2B products")],
              ["ONE · ACE", t("Strategi diuji", "Strategies tested")],
            ].map(([v, k]) => (
              <div key={k}>
                <dt className="font-display text-xl font-semibold text-ink">{v}</dt>
                <dd className="mt-0.5 text-[13px] text-muted">{k}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
        <HeroVisual />
      </div>
      <ScrollCue href="#tentang" />
    </section>
  );
}
