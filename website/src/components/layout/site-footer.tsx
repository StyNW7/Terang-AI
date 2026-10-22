import Link from "next/link";
import { ArrowRight, ArrowUpRight, LayoutDashboard, Play } from "lucide-react";
import { Logo, Mascot } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { BackToTop } from "@/components/layout/smooth-scroll";
import { COMPANY } from "@/data/company";

const COLUMNS = [
  {
    title: "Jelajahi",
    links: [
      { label: "Perusahaan", href: "/company" },
      { label: "Dua Produk B2B", href: "/products" },
      { label: "Strategy Lab", href: "/strategy-lab" },
      { label: "Referensi & Asumsi", href: "/references" },
    ],
  },
  {
    title: "Strategi",
    links: [
      { label: "ONE Strategy", href: "/strategies/one" },
      { label: "ACE Strategy", href: "/strategies/ace" },
      { label: "Simulator ONE vs ACE", href: "/dashboard/simulator" },
      { label: "Mode Presentasi", href: "/presentation" },
    ],
  },
  {
    title: "Dashboard",
    links: [
      { label: "Super Admin", href: "/dashboard" },
      { label: "Terang Events", href: "/dashboard/events" },
      { label: "AI Candidate Interview", href: "/dashboard/interview" },
      { label: "Kontrol Strategi", href: "/dashboard/strategy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-28 overflow-hidden bg-[#06101f] text-white">
      {/* Ambient light */}
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent" />
      <div className="absolute left-1/2 top-0 -z-10 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(57,183,255,0.18),transparent)]" />
      <div className="bg-grid-dark absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA */}
        <div className="relative flex flex-col items-start justify-between gap-8 border-b border-white/10 py-16 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="eyebrow text-sky">Strategic Growth Experience</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Satu perusahaan, dua peluang — <span className="text-gradient-light">temukan jalur tumbuhnya.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-[15px] font-medium text-navy shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)] transition hover:bg-white/90"
            >
              <LayoutDashboard className="h-4 w-4" /> Buka Dashboard
            </Link>
            <Link
              href="/presentation"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-[15px] font-medium text-white backdrop-blur transition hover:bg-white/[0.12]"
            >
              <Play className="h-4 w-4 fill-current" /> Mulai presentasi
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo height={30} />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/65">{COMPANY.idea}</p>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 pr-5 sm:inline-flex">
              <Mascot name="wave" size={56} float={false} />
              <div>
                <p className="font-display text-[15px] font-semibold text-white">{COMPANY.tagline}</p>
                <Link href="/company" className="group mt-0.5 inline-flex items-center gap-1 text-[13px] text-sky transition hover:text-white">
                  Kenali Terang AI <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-[13px] font-semibold text-white">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group inline-flex items-center gap-1 text-[15px] text-white/60 transition hover:text-white">
                        {l.label}
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
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="wordmark-fill mx-auto max-w-7xl translate-y-[22%] px-4 text-center font-display text-[19vw] font-bold leading-none tracking-[-0.06em] lg:text-[15rem]">
          terang.ai
        </p>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-[#06101f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-[13px] text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Terang Strategic Growth Experience · BCDC 2026</p>
          <div className="flex items-center gap-2">
            <ThemeToggle tone="glass" />
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
