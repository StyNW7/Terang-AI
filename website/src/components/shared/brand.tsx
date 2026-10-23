"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { L, useI18n, type Txt } from "@/lib/i18n";

export type MascotName =
  | "wave"
  | "sparkle"
  | "think"
  | "events"
  | "interview"
  | "target"
  | "puzzle"
  | "chart"
  | "question";

const MASCOT_ALT: Record<MascotName, Txt> = {
  wave: L("Maskot Terang AI melambaikan tangan", "Terang AI mascot waving"),
  sparkle: L("Maskot Terang AI memperkenalkan ide", "Terang AI mascot presenting an idea"),
  think: L("Maskot Terang AI menganalisis dengan kaca pembesar", "Terang AI mascot analysing with a magnifying glass"),
  events: L("Maskot Terang AI membawa trofi dan kalender", "Terang AI mascot holding a trophy and a calendar"),
  interview: L("Maskot Terang AI dengan headset dan papan klip", "Terang AI mascot with a headset and clipboard"),
  target: L("Maskot Terang AI menunjuk target", "Terang AI mascot pointing at a target"),
  puzzle: L("Maskot Terang AI menyatukan dua kepingan puzzle", "Terang AI mascot joining two puzzle pieces"),
  chart: L("Maskot Terang AI mempresentasikan grafik pertumbuhan", "Terang AI mascot presenting a growth chart"),
  question: L("Maskot Terang AI bertanya", "Terang AI mascot asking a question"),
};

export function Mascot({
  name,
  size = 160,
  className,
  float = true,
  preload,
}: {
  name: MascotName;
  size?: number;
  className?: string;
  float?: boolean;
  preload?: boolean;
}) {
  const { t } = useI18n();
  return (
    <Image
      src={`/mascot/${name}.png`}
      alt={t(MASCOT_ALT[name])}
      width={size}
      height={size}
      preload={preload}
      className={cn("pointer-events-none select-none drop-shadow-[0_24px_30px_rgba(47,102,224,0.28)]", float && "animate-float", className)}
      sizes={`${size}px`}
    />
  );
}

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/terang-ai-mark.png"
      alt="Terang AI"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}

/** Full wordmark. `tone="white"` recolors the official logo for dark surfaces. */
export function Logo({
  height = 30,
  tone = "brand",
  href = "/",
  className,
  preload,
}: {
  height?: number;
  tone?: "brand" | "white";
  href?: string | null;
  className?: string;
  preload?: boolean;
}) {
  const { t } = useI18n();
  const width = Math.round((height * 992) / 235);
  const img = (
    <Image
      src="/brand/terang-ai-logo.png"
      alt="terang.ai"
      width={width}
      height={height}
      preload={preload}
      className={cn(tone === "white" && "brightness-0 invert", className)}
      style={{ height, width }}
    />
  );
  if (!href) return img;
  return (
    <Link href={href} aria-label={t("Terang AI — Beranda", "Terang AI — Home")} className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  );
}
