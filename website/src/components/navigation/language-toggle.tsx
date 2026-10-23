"use client";

import { motion } from "motion/react";
import { useI18n, type Locale } from "@/lib/i18n";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: "id", label: "ID", name: "Bahasa Indonesia" },
  { value: "en", label: "EN", name: "English" },
];

/** Two-segment ID / EN switch with a sliding highlight. */
export function LanguageToggle({ className, tone = "default", layoutId = "lang-pill" }: { className?: string; tone?: "default" | "glass"; layoutId?: string }) {
  const { locale, setLocale, t } = useI18n();
  const glass = tone === "glass";

  return (
    <Tooltip content={t("Ganti bahasa · Switch language", "Switch language · Ganti bahasa")} side="bottom">
      <div
        role="radiogroup"
        aria-label={t("Bahasa", "Language")}
        className={cn(
          "relative flex h-9 items-center gap-0.5 rounded-xl p-1",
          glass ? "bg-white/10 ring-1 ring-white/20" : "border border-line bg-card shadow-soft",
          className,
        )}
      >
        {OPTIONS.map((o) => {
          const active = locale === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={o.name}
              lang={o.value}
              onClick={() => setLocale(o.value)}
              className={cn(
                "relative isolate grid h-7 w-8 place-items-center rounded-lg text-[11px] font-semibold tracking-wide transition-colors",
                active ? "text-white" : glass ? "text-white/70 hover:text-white" : "text-muted hover:text-ink",
              )}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 -z-10 rounded-lg bg-[linear-gradient(135deg,#2a86e2_0%,#2563d6_55%,#1f4fc4_100%)] shadow-[0_6px_16px_-8px_rgba(37,99,214,0.9)]"
                  transition={{ type: "spring", stiffness: 520, damping: 36 }}
                />
              )}
              {o.label}
            </button>
          );
        })}
      </div>
    </Tooltip>
  );
}
