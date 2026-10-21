import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const MASCOT_ALT: Record<MascotName, string> = {
  wave: "Maskot Terang AI melambaikan tangan",
  sparkle: "Maskot Terang AI memperkenalkan ide",
  think: "Maskot Terang AI menganalisis dengan kaca pembesar",
  events: "Maskot Terang AI membawa trofi dan kalender",
  interview: "Maskot Terang AI dengan headset dan papan klip",
  target: "Maskot Terang AI menunjuk target",
  puzzle: "Maskot Terang AI menyatukan dua kepingan puzzle",
  chart: "Maskot Terang AI mempresentasikan grafik pertumbuhan",
  question: "Maskot Terang AI bertanya",
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
  return (
    <Image
      src={`/mascot/${name}.png`}
      alt={MASCOT_ALT[name]}
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
  const width = Math.round((height * 992) / 235);
  const img = (
    <Image
      src="/brand/terang-ai-logo.png"
      alt="terang.ai"
      width={width}
      height={height}
      preload={preload}
      className={cn(tone === "white" && "brightness-0 invert", className)}
      style={{ height, width: "auto" }}
    />
  );
  if (!href) return img;
  return (
    <Link href={href} aria-label="Terang AI — Beranda" className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  );
}
