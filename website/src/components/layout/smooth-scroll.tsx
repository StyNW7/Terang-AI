"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";

let active: Lenis | null = null;

/** Scrolls to the top through Lenis when it is running, natively otherwise. */
export function scrollToTop() {
  if (active) active.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Inertia smooth scrolling for the public site (skipped for reduced-motion users). */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: { offset: -88 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    active = lenis;
    return () => {
      lenis.destroy();
      active = null;
    };
  }, []);
  return null;
}

/** Thin reading-progress bar under the header + a back-to-top button. */
export function ScrollChrome() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => scrollY.on("change", (y) => setShowTop(y > 900)), [scrollY]);

  return (
    <>
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-brand-gradient" style={{ scaleX }} />
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-line bg-card/90 text-ink shadow-lift backdrop-blur transition hover:border-brand/40 hover:text-brand-ink"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

/** Compact "back to top" control for dark surfaces (footer). */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-[13px] font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
    >
      <ArrowUp className="h-4 w-4" /> Ke atas
    </button>
  );
}
