"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, Presentation, X } from "lucide-react";
import { MAIN_NAV } from "@/data/navigation";
import { Logo } from "@/components/shared/brand";
import { NavIcon } from "@/components/navigation/nav-icon";
import { Button } from "@/components/ui/button";
import { StrategyModeSwitcher } from "@/components/navigation/strategy-mode-switcher";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const TAG_STYLE: Record<string, string> = {
  ONE: "bg-one-soft text-one",
  ACE: "bg-ace-soft text-[#0a7aa6]",
  Demo: "bg-success-soft text-[#0b7a5a]",
};

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line/80 bg-white/80 shadow-[0_8px_30px_-20px_rgba(23,57,94,0.35)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo height={26} preload />
          <nav className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setOpen(null)}>
            {MAIN_NAV.map((item) => {
              const active = isActive(pathname, item.href) || item.children?.some((c) => isActive(pathname, c.href));
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={cn(
                      "rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors",
                      active ? "text-brand-ink" : "text-muted-strong hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }
              const isOpen = open === item.label;
              return (
                <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : item.label)}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors",
                      active || isOpen ? "text-brand-ink" : "text-muted-strong hover:text-ink",
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute left-0 top-full z-50 pt-2"
                      >
                        <div className="w-[340px] rounded-2xl border border-line bg-white p-2 shadow-lift">
                          {item.children.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className={cn(
                                "group flex items-start gap-3 rounded-xl p-3 transition hover:bg-surface",
                                isActive(pathname, child.href) && "bg-soft/60",
                              )}
                            >
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-soft text-brand-ink transition group-hover:bg-brand-gradient group-hover:text-white">
                                <NavIcon name={child.icon} className="h-[18px] w-[18px]" />
                              </span>
                              <span className="min-w-0">
                                <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                                  {child.label}
                                  {child.tag && (
                                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", TAG_STYLE[child.tag])}>{child.tag}</span>
                                  )}
                                </span>
                                {child.description && <span className="mt-0.5 block text-xs leading-snug text-muted">{child.description}</span>}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button href="/presentation" variant="secondary" size="sm" className="hidden sm:inline-flex">
            <Presentation className="h-4 w-4" /> Mode Presentasi
          </Button>
          <Button href="/strategy-lab" size="sm" className="hidden md:inline-flex">
            Mulai Jelajah
          </Button>
          <button
            type="button"
            onClick={() => setMobile(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-navy-deep/40 backdrop-blur-sm" onClick={() => setMobile(false)} />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-white p-5 shadow-lift"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo height={24} href="/" />
                <button
                  type="button"
                  onClick={() => setMobile(false)}
                  className="grid h-10 w-10 place-items-center rounded-xl text-muted hover:bg-soft"
                  aria-label="Tutup menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <StrategyModeSwitcher compact className="mb-6 w-full justify-between" />
              <div className="space-y-5">
                {MAIN_NAV.map((item) =>
                  item.children ? (
                    <div key={item.label}>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{item.label}</p>
                      <div className="space-y-1">
                        {item.children.map((c) => (
                          <Link
                            key={c.href + c.label}
                            href={c.href}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold",
                              isActive(pathname, c.href) ? "bg-soft text-brand-ink" : "text-ink hover:bg-surface",
                            )}
                          >
                            <NavIcon name={c.icon} className="h-4 w-4 text-brand-ink" />
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href!}
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-[15px] font-bold",
                        isActive(pathname, item.href) ? "bg-soft text-brand-ink" : "text-ink hover:bg-surface",
                      )}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
              <div className="mt-auto pt-6">
                <Button href="/presentation" className="w-full">
                  <Presentation className="h-4 w-4" /> Mode Presentasi
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
