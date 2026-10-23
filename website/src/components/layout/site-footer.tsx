import Link from "next/link";
import { ArrowRight, ArrowUpRight, LayoutDashboard, Play } from "lucide-react";
import { Logo, Mascot } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { LanguageToggle } from "@/components/navigation/language-toggle";
import { COMPANY } from "@/data/company";
import { T } from "@/lib/i18n";
import { keyOf, L, type Txt } from "@/lib/i18n-core";

const COLUMNS: { title: Txt; links: { label: Txt; href: string }[] }[] = [
  {
    title: L("Jelajahi", "Explore"),
    links: [
      { label: L("Perusahaan", "Company"), href: "/company" },
      { label: L("Dua Produk B2B", "Two B2B Products"), href: "/products" },
      { label: "Strategy Lab", href: "/strategy-lab" },
      { label: L("Referensi & Asumsi", "References & Assumptions"), href: "/references" },
    ],
  },
  {
    title: L("Strategi", "Strategy"),
    links: [
      { label: "ONE Strategy", href: "/strategies/one" },
      { label: "ACE Strategy", href: "/strategies/ace" },
      { label: L("Simulator ONE vs ACE", "ONE vs ACE Simulator"), href: "/dashboard/simulator" },
      { label: L("Mode Presentasi", "Presentation Mode"), href: "/presentation" },
    ],
  },
  {
    title: "Dashboard",
    links: [
      { label: "Super Admin", href: "/dashboard" },
      { label: "Terang Events", href: "/dashboard/events" },
      { label: "AI Candidate Interview", href: "/dashboard/interview" },
      { label: L("Kontrol Strategi", "Strategy Control"), href: "/dashboard/strategy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-8 overflow-hidden bg-[#06101f] text-white">
      {/* Ambient light */}
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent" />
      <div className="absolute left-1/2 top-0 -z-10 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(57,183,255,0.18),transparent)]" />
      <div className="bg-grid-dark absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA */}
        <div className="relative flex flex-col items-start justify-between gap-8 border-b border-white/10 py-16 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="eyebrow text-sky">Strategic Growth Experience</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              <T
                id={
                  <>
                    Satu perusahaan, dua peluang — <span className="text-gradient-light">temukan jalur tumbuhnya.</span>
                  </>
                }
                en={
                  <>
                    One company, two opportunities — <span className="text-gradient-light">find its path to growth.</span>
                  </>
                }
              />
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-[15px] font-medium text-navy shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)] transition hover:bg-white/90"
            >
              <LayoutDashboard className="h-4 w-4" /> <T id="Buka _Dashboard_" en="Open Dashboard" />
            </Link>
            <Link
              href="/presentation"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-[15px] font-medium text-white backdrop-blur transition hover:bg-white/[0.12]"
            >
              <Play className="h-4 w-4 fill-current" /> <T id="Mulai presentasi" en="Start presentation" />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 gap-12 pb-6 pt-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo height={30} />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/65">
              <T v={COMPANY.idea} />
            </p>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 pr-5 sm:inline-flex">
              <Mascot name="wave" size={56} float={false} />
              <div>
                <p className="font-display text-[15px] font-semibold text-white">{COMPANY.tagline}</p>
                <Link href="/company" className="group mt-0.5 inline-flex items-center gap-1 text-[13px] text-sky transition hover:text-white">
                  <T id="Kenali Terang AI" en="Meet Terang AI" /> <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={keyOf(col.title)} aria-label={keyOf(col.title)}>
                <p className="text-[13px] font-semibold text-white">
                  <T v={col.title} />
                </p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group inline-flex items-center gap-1 text-[15px] text-white/60 transition hover:text-white">
                        <T v={l.label} />
                        <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Wordmark */}
      <div aria-hidden className="pointer-events-none -mt-2 select-none overflow-hidden lg:-mt-14">
        <p className="wordmark-fill mx-auto max-w-7xl translate-y-[22%] px-4 text-center font-display text-[19vw] font-semibold leading-none tracking-[-0.06em] lg:text-[15rem]">
          terang.ai
        </p>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-[#06101f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-[13px] text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Terang Strategic Growth Experience · BCDC 2026</p>
          <div className="flex items-center gap-4">
            <Link href="/references" className="transition hover:text-white">
              <T id="Sumber & asumsi" en="Sources & assumptions" />
            </Link>
            <span className="h-4 w-px bg-white/15" />
            <LanguageToggle tone="glass" layoutId="lang-pill-footer" />
            <ThemeToggle tone="glass" />
          </div>
        </div>
      </div>
    </footer>
  );
}
