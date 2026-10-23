import type { ReactNode } from "react";
import { Container, ScrollCue } from "@/components/layout/container";
import { Mascot, type MascotName } from "@/components/shared/brand";
import { cn } from "@/lib/utils";
import { T } from "@/lib/i18n";
import type { Txt } from "@/lib/i18n-core";

export function StrategyHero({
  variant,
  eyebrow,
  title,
  tagline,
  thesis,
  mascot,
  children,
  visual,
}: {
  variant: "one" | "ace";
  eyebrow: Txt;
  title: string;
  tagline: string;
  thesis: Txt;
  mascot: MascotName;
  children?: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <>
      <section className={cn("relative isolate flex min-h-hero items-center overflow-hidden text-white", variant === "one" ? "bg-one-gradient" : "bg-ace-gradient")}>
        <div className="bg-grid-dark absolute inset-0 opacity-60 mask-fade-b" />
        <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-white/15 blur-[90px]" />
        <div className="absolute -bottom-40 left-10 h-[360px] w-[360px] rounded-full bg-navy/40 blur-[90px]" />
        <Container className="relative grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[1.25fr_1fr] lg:py-20">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 ring-1 ring-white/20">
              <T v={eyebrow} />
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] md:text-6xl lg:text-7xl">{title}</h1>
            <p className="mt-3 font-display text-2xl font-medium text-white/90 md:text-3xl">{tagline}</p>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/80">
              <T v={thesis} />
            </p>
            {children && <div className="mt-8">{children}</div>}
          </div>
          <div className="relative mx-auto w-full max-w-md">
            {visual}
            <Mascot name={mascot} size={170} preload className="absolute -bottom-16 -right-6 hidden sm:block xl:-right-24" />
          </div>
        </Container>
        <ScrollCue dark />
      </section>
      <span id="detail" aria-hidden className="block" />
    </>
  );
}
