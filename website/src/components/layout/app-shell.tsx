"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Menu, Presentation, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { APP_NAV } from "@/data/navigation";
import { Logo, Mascot } from "@/components/shared/brand";
import { NavIcon } from "@/components/navigation/nav-icon";
import { StrategyModeSwitcher } from "@/components/navigation/strategy-mode-switcher";
import { Button } from "@/components/ui/button";
import { MODE_META, useStrategyMode } from "@/hooks/use-strategy-mode";
import { useEventsStore } from "@/store/events-store";
import { useInterviewStore } from "@/store/interview-store";
import { useOperationsStore } from "@/store/operations-store";
import { useScenarioStore } from "@/store/scenario-store";
import { cn } from "@/lib/utils";

const TAG_STYLE: Record<string, string> = {
  ONE: "bg-one-soft text-one",
  ACE: "bg-ace-soft text-[#0a7aa6]",
};

const TITLES: Record<string, { title: string; crumb: string }> = {
  "/demo/events": { title: "Terang Events", crumb: "Product Experience" },
  "/demo/interview": { title: "AI Candidate Interview", crumb: "Product Experience" },
  "/operations": { title: "ACE Command Center", crumb: "Operations & Analytics" },
  "/portfolio": { title: "Portfolio Intelligence", crumb: "Operations & Analytics" },
  "/compare": { title: "ONE vs ACE Strategy Simulator", crumb: "Operations & Analytics" },
};

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { mode } = useStrategyMode();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo height={24} />
      </div>
      <div className="px-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke situs utama
        </Link>
      </div>
      <nav className="scrollbar-thin mt-2 flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        {APP_NAV.map((group) => (
          <div key={group.group}>
            <p className="mb-2 px-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">{group.group}</p>
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] font-semibold transition",
                      active ? "bg-white text-ink shadow-soft ring-1 ring-line" : "text-muted-strong hover:bg-white/70 hover:text-ink",
                    )}
                  >
                    {active && <span className="absolute -left-4 top-2 h-5 w-1 rounded-r-full bg-brand-gradient" />}
                    <span
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-lg transition",
                        active ? "bg-brand-gradient text-white" : "bg-white text-brand-ink ring-1 ring-line group-hover:ring-brand/30",
                      )}
                    >
                      <NavIcon name={link.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{link.label}</span>
                    {link.tag && <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", TAG_STYLE[link.tag])}>{link.tag}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="m-4 overflow-hidden rounded-2xl p-4 text-white" style={{ backgroundImage: MODE_META[mode].gradient }}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Strategy Mode</p>
            <p className="font-display text-lg font-extrabold">{MODE_META[mode].label}</p>
          </div>
          <Mascot name={mode === "one" ? "target" : mode === "ace" ? "puzzle" : "sparkle"} size={52} float={false} className="-mr-1 -mt-1" />
        </div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-white/80">{MODE_META[mode].description}</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = TITLES[pathname] ?? { title: "Workspace", crumb: "Terang AI" };
  const resetEvents = useEventsStore((s) => s.reset);
  const resetInterview = useInterviewStore((s) => s.reset);
  const resetOps = useOperationsStore((s) => s.reset);
  const resetScenario = useScenarioStore((s) => s.reset);

  const resetDemo = () => {
    if (pathname.startsWith("/demo/events")) resetEvents();
    else if (pathname.startsWith("/demo/interview")) resetInterview();
    else if (pathname.startsWith("/operations")) resetOps();
    else if (pathname.startsWith("/compare")) resetScenario();
    else {
      resetEvents();
      resetInterview();
      resetOps();
      resetScenario();
    }
    toast.success("Data demo halaman ini telah direset ke kondisi awal.");
  };

  return (
    <div className="min-h-screen bg-[#f3f8fd]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-line bg-gradient-to-b from-[#f7fbff] to-[#eef5fd] lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-navy-deep/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="absolute inset-y-0 left-0 w-[284px] bg-[#f3f8fd] shadow-lift"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-xl text-muted hover:bg-white"
                aria-label="Tutup navigasi"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-white/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
                aria-label="Buka navigasi"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{meta.crumb}</p>
                <h1 className="truncate font-display text-[17px] font-extrabold text-ink">{meta.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StrategyModeSwitcher compact className="hidden xl:inline-flex" />
              <Button variant="ghost" size="sm" onClick={resetDemo} title="Reset data demo halaman ini">
                <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Reset demo</span>
              </Button>
              <Button href="/presentation" variant="secondary" size="sm" className="hidden md:inline-flex">
                <Presentation className="h-4 w-4" /> Presentasi
              </Button>
            </div>
          </div>
        </header>
        <main className="px-4 pb-32 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
