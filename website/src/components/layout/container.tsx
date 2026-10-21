import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Section({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("py-20 md:py-24", className)} {...props} />;
}

/** Page hero used on secondary site pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
  className,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#eaf6ff] to-surface" />
      <div className="bg-grid absolute inset-0 -z-10 mask-fade-b" />
      <div className="absolute -right-40 -top-20 -z-10 h-[420px] w-[420px] rounded-full bg-sky/25 blur-[100px]" />
      <Container className="grid items-center gap-10 pb-14 pt-10 md:pt-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cfe6fb] bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-ink shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-sky" />
            {eyebrow}
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.08] text-ink md:text-5xl lg:text-[3.4rem]">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-strong">{description}</p>}
          {children && <div className="mt-7">{children}</div>}
        </div>
        {aside && <div className="relative hidden lg:block">{aside}</div>}
      </Container>
    </section>
  );
}
