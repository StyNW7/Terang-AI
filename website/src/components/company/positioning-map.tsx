"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Brain, CalendarDays, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { L, useI18n } from "@/lib/i18n";

const POINTS = [
  {
    id: "events",
    label: "Terang Events",
    x: 26,
    y: 70,
    r: 64,
    color: "#39b7ff",
    icon: CalendarDays,
    buyer: L("Penyelenggara acara, universitas, asosiasi", "Event organisers, universities, associations"),
    workflow: L("Registrasi → pembayaran → submisi → penjurian per _event_", "Registration → payment → submission → judging, per event"),
    note: L("Siklus episodik mengikuti kalender acara.", "An episodic cycle that follows the event calendar."),
  },
  {
    id: "interview",
    label: "AI Candidate Interview",
    x: 74,
    y: 28,
    r: 64,
    color: "#2f66e0",
    icon: Brain,
    buyer: L("Tim HR, _talent acquisition_, agensi rekrutmen", "HR teams, talent acquisition, recruitment agencies"),
    workflow: L("Lowongan → undangan → wawancara terstruktur → tinjauan _recruiter_", "Vacancy → invitation → structured interview → recruiter review"),
    note: L("Penggunaan berulang setiap siklus rekrutmen.", "Recurring use in every hiring cycle."),
  },
  {
    id: "lms",
    label: L("AI LMS (di luar fokus)", "AI LMS (out of scope)"),
    x: 30,
    y: 30,
    r: 44,
    color: "#94a3b8",
    icon: GraduationCap,
    buyer: L("Institusi pendidikan", "Educational institutions"),
    workflow: L("Pembelajaran institusional berbasis AI", "AI-powered institutional learning"),
    note: L("Bagian portofolio B2B, tidak dianalisis dalam kasus ini.", "Part of the B2B portfolio, not analysed in this case."),
  },
];

export function PositioningMap() {
  const [active, setActive] = useState("interview");
  const { t, tx } = useI18n();
  const current = POINTS.find((p) => p.id === active) ?? POINTS[0];
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-line bg-card shadow-card sm:aspect-[4/3]">
        <div className="bg-dots absolute inset-0 opacity-60" />
        <div className="absolute inset-x-10 top-1/2 h-px bg-line" />
        <div className="absolute inset-y-10 left-1/2 w-px bg-line" />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-muted">
          {t("Penggunaan: episodik → berulang", "Usage: episodic → recurring")}
        </span>
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 rotate-180 whitespace-nowrap text-[11px] font-semibold text-muted"
          style={{ writingMode: "vertical-rl" }}
        >
          {t("Pembeli: institusi → perusahaan", "Buyer: institutions → companies")}
        </span>
        <span className="absolute left-12 top-4 hidden text-[11px] sm:block font-semibold uppercase tracking-[0.12em] text-muted">{t("Institusi · berulang", "Institutional · recurring")}</span>
        <span className="absolute right-6 top-4 hidden text-[11px] sm:block font-semibold uppercase tracking-[0.12em] text-muted">{t("Korporat · berulang", "Corporate · recurring")}</span>
        <span className="absolute bottom-9 left-12 hidden text-[11px] sm:block font-semibold uppercase tracking-[0.12em] text-muted">{t("Institusi · episodik", "Institutional · episodic")}</span>
        {POINTS.map((p, i) => {
          const Icon = p.icon;
          const isActive = p.id === active;
          return (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => setActive(p.id)}
              onMouseEnter={() => setActive(p.id)}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 200, damping: 16 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-pressed={isActive}
              aria-label={t(p.label)}
            >
              <span
                className={cn("absolute inset-0 rounded-full blur-xl transition-opacity", isActive ? "opacity-60" : "opacity-20")}
                style={{ background: p.color }}
              />
              <span
                className={cn(
                  "relative grid place-items-center rounded-full text-white ring-4 transition-transform duration-300",
                  isActive ? "scale-110 ring-card" : "ring-white/70",
                )}
                style={{ width: p.r * 1.4, height: p.r * 1.4, background: p.color }}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-ink shadow-soft ring-1 ring-line">
                {t(p.label)}
              </span>
            </motion.button>
          );
        })}
      </div>
      <motion.div
        key={current.id}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col justify-center rounded-3xl border border-line bg-card p-7 shadow-card"
      >
        <span className="h-1.5 w-12 rounded-full" style={{ background: current.color }} />
        <h3 className="mt-4 text-2xl font-semibold text-ink">{t(current.label)}</h3>
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t("Pembeli", "Buyer")}</dt>
            <dd className="mt-1 font-semibold text-ink">{tx(current.buyer)}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{tx("Alur kerja", "Workflow")}</dt>
            <dd className="mt-1 font-semibold text-ink">{tx(current.workflow)}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t("Catatan", "Note")}</dt>
            <dd className="mt-1 text-muted-strong">{tx(current.note)}</dd>
          </div>
        </dl>
        <p className="mt-6 rounded-xl bg-surface p-3 text-xs leading-relaxed text-muted-strong ring-1 ring-line">
          {tx(
            "Klik atau arahkan kursor ke lingkaran. Posisi bersifat konseptual untuk menunjukkan bahwa kedua produk melayani pembeli dan _workflow_ yang berbeda.",
            "Click or hover over a circle. Positions are conceptual, showing that the two products serve different buyers and workflows.",
          )}
        </p>
      </motion.div>
    </div>
  );
}
