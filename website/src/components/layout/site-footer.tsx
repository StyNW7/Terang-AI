import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Logo, Mascot } from "@/components/shared/brand";
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
      { label: "ONE Strategy (PRO)", href: "/strategies/one" },
      { label: "ACE Strategy (KONTRA)", href: "/strategies/ace" },
      { label: "ONE vs ACE Simulator", href: "/compare" },
      { label: "Mode Presentasi", href: "/presentation" },
    ],
  },
  {
    title: "Demo & Analitik",
    links: [
      { label: "Demo Terang Events", href: "/demo/events" },
      { label: "Demo AI Candidate Interview", href: "/demo/interview" },
      { label: "ACE Command Center", href: "/operations" },
      { label: "Portfolio Intelligence", href: "/portfolio" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-gradient text-white">
      <div className="bg-grid-dark absolute inset-0 opacity-60 mask-fade-b" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo height={28} tone="white" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{COMPANY.idea}</p>
            <p className="mt-4 font-display text-lg font-bold text-gradient-light">{COMPANY.tagline}</p>
            <div className="mt-6 flex items-end gap-3">
              <Mascot name="wave" size={84} />
              <p className="mb-3 max-w-[220px] text-xs leading-relaxed text-white/60">
                Terang Strategic Growth Experience — prototype interaktif untuk BCDC 2026.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="text-sm text-white/75 transition hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/55 md:flex-row md:items-start md:justify-between">
          <p className="flex max-w-3xl items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
            <span>
              <strong className="text-white/80">Unofficial academic concept prototype.</strong> Dibuat untuk Business Case &amp; Debate
              Competition (BCDC) 2026 — HIMME BINUS. Bukan produk atau situs resmi {COMPANY.legalName} dan tidak mewakili dukungan
              perusahaan. Seluruh angka simulasi bersifat ilustratif; data demo bersifat fiktif.
            </span>
          </p>
          <p className="shrink-0">Tema: “The Intelligence Shift”</p>
        </div>
      </div>
    </footer>
  );
}
