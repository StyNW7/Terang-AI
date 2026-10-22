import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Section({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("py-20 md:py-28", className)} {...props} />;
}

/** "Scroll for details" cue at the bottom of a full-height hero. */
export function ScrollCue({ href = "#detail", label = "Gulir untuk detail", dark }: { href?: string; label?: string; dark?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "group absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium transition md:[@media(min-height:820px)]:flex",
        dark ? "text-white/70 hover:text-white" : "text-muted hover:text-ink",
      )}
    >
      <span className={cn("relative flex h-9 w-6 justify-center rounded-full border-2 pt-1.5", dark ? "border-white/40" : "border-line-strong")}>
        <span className={cn("h-2 w-1 rounded-full animate-scroll-cue", dark ? "bg-white" : "bg-brand")} />
      </span>
      <span className="flex items-center gap-1">
        {label} <ChevronDown className="h-3.5 w-3.5 transition group-hover:translate-y-0.5" />
      </span>
    </a>
  );
}

/** Full-height hero used on secondary site pages; details start below the fold. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <>
      <section className={cn("relative isolate flex min-h-hero items-center overflow-hidden", className)}>
        <div className="bg-page-gradient absolute inset-0 -z-10" />
        <div className="bg-grid absolute inset-0 -z-10 mask-fade-b" />
        <div className="absolute -right-40 -top-20 -z-10 h-[460px] w-[460px] rounded-full bg-sky/20 blur-[110px]" />
        <div className="absolute -left-40 bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-royal/10 blur-[110px]" />
        <Container className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[1.35fr_1fr] lg:py-20">
          <div>
            <div className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-card/70 px-3 py-1.5 text-brand-ink shadow-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-sky" />
              {eyebrow}
            </div>
            <h1 className="text-[2.4rem] font-bold leading-[1.08] text-ink sm:text-5xl lg:text-[3.5rem]">{title}</h1>
            {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-strong">{description}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside && <div className="relative hidden lg:block">{aside}</div>}
        </Container>
        <ScrollCue />
      </section>
      <span id="detail" aria-hidden className="block" />
    </>
  );
}
