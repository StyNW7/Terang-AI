"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, Layers, LayoutGrid, NotebookPen, Target, X } from "lucide-react";
import { useStrategyStore } from "@/store/strategy-store";
import { useScenarioStore } from "@/store/scenario-store";
import { Mascot } from "@/components/shared/brand";
import { Kbd } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import { SLIDES } from "./slides";

const ACCENT_BG = {
  brand: "radial-gradient(120% 120% at 0% 0%, #1f4f84 0%, #17395e 40%, #0b1d36 100%)",
  one: "radial-gradient(120% 120% at 0% 0%, #2a5bd0 0%, #1a3a8a 40%, #0b1d36 100%)",
  ace: "radial-gradient(120% 120% at 0% 0%, #0e8fc4 0%, #135a8e 42%, #0b1d36 100%)",
};

const ONE_START = SLIDES.findIndex((s) => s.id === "one-overview");
const ACE_START = SLIDES.findIndex((s) => s.id === "ace-overview");

export function PresentationMode() {
  const storedIndex = useStrategyStore((s) => s.presentationSlide);
  const setStoredIndex = useStrategyStore((s) => s.setPresentationSlide);
  const setMode = useStrategyStore((s) => s.setMode);
  const assumptions = useScenarioStore((s) => s.assumptions);
  const index = Math.min(Math.max(0, storedIndex), SLIDES.length - 1);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [notes, setNotes] = useState(false);
  const [grid, setGrid] = useState(false);
  const slide = SLIDES[index];

  const goTo = useCallback(
    (i: number, dir = 1) => {
      const next = Math.min(Math.max(0, i), SLIDES.length - 1);
      setDirection(dir);
      setStoredIndex(next);
      setStep(0);
      const s = SLIDES[next];
      if (s.section === "ONE · PRO") setMode("one");
      else if (s.section === "ACE · KONTRA") setMode("ace");
    },
    [setStoredIndex, setMode],
  );

  const next = useCallback(() => {
    if (step < slide.steps) setStep((s) => s + 1);
    else if (index < SLIDES.length - 1) goTo(index + 1, 1);
  }, [step, slide.steps, index, goTo]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
    else if (index > 0) goTo(index - 1, -1);
  }, [step, index, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key.toLowerCase() === "n") setNotes((v) => !v);
      else if (e.key.toLowerCase() === "g") setGrid((v) => !v);
      else if (e.key === "Home") goTo(0, -1);
      else if (e.key === "End") goTo(SLIDES.length - 1, 1);
      else if (e.key === "1") goTo(ONE_START, 1);
      else if (e.key === "2") goTo(ACE_START, 1);
      else if (e.key === "Escape") {
        setGrid(false);
        setNotes(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo]);

  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  const progress = (index + (slide.steps ? step / (slide.steps + 1) : 0)) / (SLIDES.length - 1);

  return (
    <div className="fixed inset-0 overflow-hidden text-white transition-[background] duration-700" style={{ background: ACCENT_BG[slide.accent] }}>
      <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-sky/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-royal/25 blur-[120px]" />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky ring-1 ring-white/15">{slide.section}</span>
          <span className="hidden truncate text-sm text-white/60 sm:block">{slide.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goTo(ONE_START, 1)} className={cn("flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ring-1 transition", slide.section === "ONE · PRO" ? "bg-white text-one-ink ring-white" : "bg-white/10 text-white ring-white/15 hover:bg-white/20")}>
            <Target className="h-3.5 w-3.5" /> PRO · ONE
          </button>
          <button type="button" onClick={() => goTo(ACE_START, 1)} className={cn("flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ring-1 transition", slide.section === "ACE · KONTRA" ? "bg-white text-ace-ink ring-white" : "bg-white/10 text-white ring-white/15 hover:bg-white/20")}>
            <Layers className="h-3.5 w-3.5" /> KONTRA · ACE
          </button>
          <button type="button" onClick={fullscreen} className="hidden h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/20 sm:grid" aria-label="Layar penuh">
            <Expand className="h-4 w-4" />
          </button>
          <Link href="/" className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 hover:bg-white/20" aria-label="Keluar dari mode presentasi">
            <X className="h-3.5 w-3.5" /> Keluar
          </Link>
        </div>
      </div>

      {/* Slide */}
      <div className="absolute inset-0 flex items-center px-6 pb-28 pt-20 sm:px-12 lg:px-20" onClick={(e) => { if ((e.target as HTMLElement).closest("a,button")) return; next(); }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="scrollbar-thin relative mx-auto max-h-full w-full max-w-7xl overflow-y-auto"
          >
            {slide.render(step, assumptions)}
          </motion.div>
        </AnimatePresence>
        {slide.mascot && (
          <motion.div key={`m-${slide.id}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pointer-events-none absolute bottom-24 right-8 hidden xl:block">
            <Mascot name={slide.mascot} size={190} />
          </motion.div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 sm:px-8">
        <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#39b7ff,#ffffff)]" animate={{ width: `${progress * 100}%` }} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={prev} className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/20" aria-label="Sebelumnya">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={next} className="grid h-11 w-11 place-items-center rounded-xl bg-white text-navy hover:bg-soft" aria-label="Berikutnya">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="tabular ml-2 text-sm font-semibold text-white/80">
              {index + 1} / {SLIDES.length}
            </span>
            {slide.steps > 0 && (
              <span className="ml-2 flex gap-1" aria-label={`Langkah ${step} dari ${slide.steps}`}>
                {Array.from({ length: slide.steps }).map((_, i) => (
                  <span key={i} className={cn("h-1.5 w-4 rounded-full", i < step ? "bg-sky" : "bg-white/20")} />
                ))}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {slide.link && (
              <Link href={slide.link.href} className="hidden items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/15 hover:bg-white/20 sm:flex">
                Buka {slide.link.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <button type="button" onClick={() => setGrid((v) => !v)} className={cn("flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ring-1", grid ? "bg-white text-navy ring-white" : "bg-white/10 ring-white/15 hover:bg-white/20")}>
              <LayoutGrid className="h-3.5 w-3.5" /> Semua slide
            </button>
            <button type="button" onClick={() => setNotes((v) => !v)} className={cn("flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ring-1", notes ? "bg-white text-navy ring-white" : "bg-white/10 ring-white/15 hover:bg-white/20")}>
              <NotebookPen className="h-3.5 w-3.5" /> Catatan
            </button>
          </div>
        </div>
        <p className="mt-2 hidden items-center gap-2 text-[11px] text-white/45 lg:flex">
          <Kbd>←</Kbd> <Kbd>→</Kbd> navigasi · <Kbd>N</Kbd> catatan · <Kbd>G</Kbd> semua slide · <Kbd>1</Kbd> ONE · <Kbd>2</Kbd> ACE · klik area slide untuk lanjut
        </p>
      </div>

      {/* Notes drawer */}
      <AnimatePresence>
        {notes && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute bottom-0 right-0 top-0 z-30 w-full max-w-md bg-white p-6 text-ink shadow-lift"
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-semibold">
                <NotebookPen className="h-4 w-4 text-brand-ink" /> Catatan pembicara
              </p>
              <button type="button" onClick={() => setNotes(false)} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-soft" aria-label="Tutup catatan">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">
              Slide {index + 1}: {slide.title}
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-ink">{slide.notes}</p>
            {index < SLIDES.length - 1 && (
              <div className="mt-6 rounded-xl bg-surface p-4 ring-1 ring-line">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Berikutnya</p>
                <p className="mt-1 font-semibold">{SLIDES[index + 1].title}</p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Slide overview grid */}
      <AnimatePresence>
        {grid && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 overflow-y-auto bg-navy-deep/95 p-8 backdrop-blur">
            <div className="mx-auto max-w-6xl">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xl font-semibold">Semua slide</p>
                <button type="button" onClick={() => setGrid(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/20" aria-label="Tutup">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      goTo(i, i > index ? 1 : -1);
                      setGrid(false);
                    }}
                    className={cn("rounded-2xl p-4 text-left ring-1 transition hover:-translate-y-0.5", i === index ? "bg-white text-navy ring-white" : "bg-white/[0.06] ring-white/12 hover:bg-white/10")}
                  >
                    <p className={cn("text-[11px] font-semibold uppercase tracking-[0.12em]", i === index ? "text-brand-ink" : "text-sky")}>
                      {String(i + 1).padStart(2, "0")} · {s.section}
                    </p>
                    <p className="mt-1 font-semibold">{s.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
