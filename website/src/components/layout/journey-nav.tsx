"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Play } from "lucide-react";
import { GUIDED_FLOW, guidedStepFor } from "@/data/navigation";
import { NavIcon } from "@/components/navigation/nav-icon";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { keyOf, L, useI18n } from "@/lib/i18n";

const HOME = { href: "/", title: L("Beranda", "Home"), description: L("Kembali ke halaman utama", "Back to the home page"), icon: "dashboard" };

/** "Step X of 6" stepper + previous/next cards so every story page leads to the next one. */
export function JourneyNav() {
  const pathname = usePathname() ?? "/";
  const { t, tx } = useI18n();
  const step = guidedStepFor(pathname);
  if (step < 0) return null;

  const prev = step === 0 ? HOME : GUIDED_FLOW[step - 1];
  const next = GUIDED_FLOW[step + 1];
  const pct = ((step + 1) / GUIDED_FLOW.length) * 100;

  return (
    <section aria-label={t("Alur cerita", "Story flow")} data-journey className="pb-8 pt-4">
      <Container>
        <div className="rounded-[28px] border border-line bg-card p-5 shadow-soft sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-brand-ink">{t("Alur cerita", "Story flow")}</p>
              <p className="mt-1 text-sm text-muted-strong">
                {t("Langkah", "Step")} <span className="tabular font-semibold text-ink">{step + 1}</span> {t("dari", "of")} {GUIDED_FLOW.length} —{" "}
                {tx(GUIDED_FLOW[step].title)}
              </p>
            </div>
            <Link
              href="/presentation"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-strong ring-1 ring-line transition hover:text-ink hover:ring-brand/40"
            >
              <Play className="h-3 w-3 fill-current" /> {t("Versi presentasi", "Presentation version")}
            </Link>
          </div>

          {/* Stepper — labels on desktop, a slim progress bar on mobile. */}
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-track md:hidden">
            <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
          </div>
          <ol className="mt-6 hidden grid-cols-6 md:grid">
            {GUIDED_FLOW.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={keyOf(s.href)} className="relative">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className={cn("absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2", i <= step ? "bg-brand" : "bg-line")}
                    />
                  )}
                  <Link
                    href={s.href}
                    aria-current={current ? "step" : undefined}
                    className="group relative z-10 flex flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition",
                        done && "bg-brand text-white",
                        current && "bg-brand-gradient text-white shadow-glow ring-4 ring-soft",
                        !done && !current && "border border-line-strong bg-card text-muted group-hover:border-brand group-hover:text-brand-ink",
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className={cn("text-[13px] font-medium transition", current ? "text-ink" : "text-muted group-hover:text-ink")}>
                      {tx(s.label)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href={prev.href}
              className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition hover:border-brand/40 hover:bg-surface"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-muted transition group-hover:-translate-x-0.5 group-hover:text-brand-ink" />
              <span className="min-w-0">
                <span className="block text-xs text-muted">{t("Sebelumnya", "Previous")}</span>
                <span className="block truncate font-semibold text-ink">{tx(prev.title)}</span>
              </span>
            </Link>
            {next && (
              <Link
                href={next.href}
                className="group flex items-center gap-4 rounded-2xl bg-[linear-gradient(135deg,#2a86e2_0%,#2563d6_55%,#1f4fc4_100%)] p-4 text-white shadow-[0_12px_30px_-16px_rgba(37,99,214,0.9)] transition hover:brightness-110"
              >
                <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 lg:grid">
                  <NavIcon name={next.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-white/75">
                    {t("Selanjutnya", "Next")} · {t(next.description)}
                  </span>
                  <span className="block truncate font-semibold">{tx(next.title)}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
