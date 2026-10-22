"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Gentle enter animation for each dashboard page (template remounts per route). */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
