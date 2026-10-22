import { ArrowRight, Brain, CalendarDays, Check, Play } from "lucide-react";
import { PRODUCTS } from "@/data/company";
import { Mascot } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SourceLabel } from "@/components/shared/source-label";

export function ProductCards() {
  const cards = [
    {
      p: PRODUCTS.events,
      icon: <CalendarDays className="h-5 w-5" />,
      mascot: "events" as const,
      gradient: "from-sky-soft via-card to-card",
      accent: "bg-sky-soft text-sky-ink",
      glow: "bg-sky/25",
      overview: "/products/events",
      demo: "/dashboard/events",
    },
    {
      p: PRODUCTS.interview,
      icon: <Brain className="h-5 w-5" />,
      mascot: "interview" as const,
      gradient: "from-one-soft via-card to-card",
      accent: "bg-one-soft text-one-ink",
      glow: "bg-royal/20",
      overview: "/products/interview",
      demo: "/dashboard/interview",
    },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {cards.map((c, i) => (
        <Reveal key={c.p.key} delay={i * 0.1}>
          <article className={`group relative h-full overflow-hidden rounded-3xl border border-line bg-gradient-to-br ${c.gradient} p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift`}>
            <div className={`absolute -right-16 -top-16 h-56 w-56 rounded-full ${c.glow} blur-3xl transition group-hover:scale-125`} />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.accent}`}>{c.icon}</span>
                  <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-line">{c.p.category}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-ink">{c.p.name}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-ink">{c.p.categoryLong}</p>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-strong">{c.p.tagline}</p>
              </div>
              <Mascot name={c.mascot} size={128} className="-mr-2 -mt-2 hidden shrink-0 sm:block" />
            </div>
            <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Pelanggan</p>
                <ul className="space-y-1.5">
                  {c.p.targetCustomers.slice(0, 3).map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[13px] text-ink">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Fondasi publik</p>
                <ul className="space-y-1.5">
                  {c.p.existing.slice(0, 3).map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[13px] text-ink">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/80 pt-5">
              <SourceLabel type="public-source" compact />
              <div className="flex gap-2">
                <Button href={c.overview} variant="secondary" size="sm">
                  Detail produk <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button href={c.demo} size="sm">
                  <Play className="h-3.5 w-3.5" /> Coba Simulasi Produk
                </Button>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
