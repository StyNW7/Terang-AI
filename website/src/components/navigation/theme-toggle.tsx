"use client";

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useMounted } from "@/hooks/use-mounted";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Light/dark switch. Defaults to the OS preference until the viewer chooses. */
export function ThemeToggle({ className, tone = "default" }: { className?: string; tone?: "default" | "glass" }) {
  const { theme, toggle } = useTheme();
  const mounted = useMounted();
  const dark = mounted && theme === "dark";
  const label = dark ? "Ganti ke mode terang" : "Ganti ke mode gelap";

  return (
    <Tooltip content={label} side="bottom">
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className={cn(
          "relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl transition",
          tone === "glass"
            ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
            : "border border-line bg-card text-muted-strong shadow-soft hover:border-brand/40 hover:text-ink",
          className,
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? "moon" : "sun"}
            initial={{ y: 14, opacity: 0, rotate: -40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 40 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            {dark ? <Moon className="h-[17px] w-[17px]" /> : <Sun className="h-[17px] w-[17px]" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </Tooltip>
  );
}
