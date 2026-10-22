"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, LayoutDashboard, Menu, Presentation, X } from "lucide-react";
import { MAIN_NAV, WORKSPACES } from "@/data/navigation";
import { Logo } from "@/components/shared/brand";
import { NavIcon } from "@/components/navigation/nav-icon";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { CommandTrigger } from "@/components/navigation/command-palette";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const TAG_STYLE: Record<string, string> = {
  ONE: "bg-one-soft text-one-ink",
  ACE: "bg-ace-soft text-ace-ink",
  Demo: "bg-success-soft text-success-ink",
};

function Dropdown({ open, children, align = "left", width = "w-[340px]" }: { open: boolean; children: React.ReactNode; align?: "left" | "right"; width?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className={cn("absolute top-full z-50 pt-2", align === "left" ? "left-0" : "right-0")}
        >
          <div className={cn("rounded-2xl border border-line bg-card p-1.5 shadow-lift", width)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ href, icon, label, description, tag, active, accent }: { href: string; icon: string; label: string; description?: string; tag?: string; active?: boolean; accent?: string }) {
  return (
    <Link href={href} className={cn("group flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-neutral-soft", active && "bg-neutral-soft")}>
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition",
          accent ?? "bg-soft text-brand-ink group-hover:bg-brand-gradient group-hover:text-white",
        )}
      >
        <NavIcon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 pt-px">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          {label}
          {tag && <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none", TAG_STYLE[tag])}>{tag}</span>}
        </span>
        {description && <span className="mt-0.5 block text-[13px] leading-snug text-muted">{description}</span>}
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => navRef.current && !navRef.current.contains(e.target as Node) && setOpen(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", mobile);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [mobile]);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled ? "border-b border-line/80 bg-surface/80 shadow-[0_8px_30px_-22px_rgba(15,37,64,0.4)] backdrop-blur-xl" : "border-b border-transparent bg-transparent",
      )}
    >
      <div ref={navRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo height={24} preload />
          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-0.5 lg:flex"
            onMouseLeave={() => {
              setOpen(null);
              setHovered(null);
            }}
          >
            {MAIN_NAV.map((item) => {
              const active = isActive(pathname, item.href) || item.children?.some((c) => isActive(pathname, c.href));
              const pill = hovered === item.label && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-neutral-soft"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              );
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setHovered(item.label)}
                    className={cn(
                      "relative isolate rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "text-ink" : "text-muted-strong hover:text-ink",
                    )}
                  >
                    {pill}
                    {item.label}
                    {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-gradient" />}
                  </Link>
                );
              }
              const isOpen = open === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    setOpen(item.label);
                    setHovered(item.label);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : item.label)}
                    className={cn(
                      "relative isolate flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active || isOpen ? "text-ink" : "text-muted-strong hover:text-ink",
                    )}
                  >
                    {pill}
                    {item.label}
                    <ChevronDown className={cn("h-3.5 w-3.5 text-muted transition-transform", isOpen && "rotate-180")} />
                    {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-gradient" />}
                  </button>
                  <Dropdown open={isOpen}>
                    {item.children.map((child) => (
                      <MenuItem key={child.href} {...child} active={isActive(pathname, child.href)} />
                    ))}
                  </Dropdown>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <CommandTrigger className="hidden xl:inline-flex" />
          <CommandTrigger compact className="xl:hidden" />
          <Tooltip content="Mode presentasi" side="bottom">
            <Link
              href="/presentation"
              aria-label="Mode presentasi"
              className="hidden h-9 w-9 place-items-center rounded-xl text-muted-strong transition hover:bg-neutral-soft hover:text-ink sm:grid"
            >
              <Presentation className="h-[18px] w-[18px]" />
            </Link>
          </Tooltip>
          <ThemeToggle />
          <div className="relative hidden md:block" onMouseLeave={() => open === "dashboard" && setOpen(null)}>
            <button
              type="button"
              aria-expanded={open === "dashboard"}
              onClick={() => setOpen(open === "dashboard" ? null : "dashboard")}
              onMouseEnter={() => setOpen("dashboard")}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#2a86e2_0%,#2563d6_55%,#1f4fc4_100%)] px-3.5 text-[13px] font-medium text-white shadow-[0_8px_24px_-12px_rgba(37,99,214,0.75)] transition hover:brightness-110"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open === "dashboard" && "rotate-180")} />
            </button>
            <Dropdown open={open === "dashboard"} align="right" width="w-[320px]">
              <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Pilih dashboard</p>
              {WORKSPACES.map((ws) => (
                <MenuItem key={ws.id} href={ws.base} icon={ws.icon} label={ws.label} description={ws.description} accent={ws.accent} />
              ))}
            </Dropdown>
          </div>
          <button
            type="button"
            onClick={() => setMobile(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-card text-ink shadow-soft lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-navy-deep/50 backdrop-blur-sm" onClick={() => setMobile(false)} />
            <motion.nav
              aria-label="Menu"
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto border-l border-line bg-card p-5 shadow-lift"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo height={22} href="/" />
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => setMobile(false)}
                    className="grid h-9 w-9 place-items-center rounded-xl text-muted hover:bg-neutral-soft"
                    aria-label="Tutup menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-5">
                {MAIN_NAV.map((item) =>
                  item.children ? (
                    <div key={item.label}>
                      <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">{item.label}</p>
                      <div className="space-y-0.5">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium",
                              isActive(pathname, c.href) ? "bg-soft text-brand-ink" : "text-ink hover:bg-neutral-soft",
                            )}
                          >
                            <NavIcon name={c.icon} className="h-[18px] w-[18px] text-muted" />
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
                        "block rounded-xl px-3 py-2.5 text-[15px] font-semibold",
                        isActive(pathname, item.href) ? "bg-soft text-brand-ink" : "text-ink hover:bg-neutral-soft",
                      )}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <div>
                  <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Dashboard</p>
                  <div className="space-y-0.5">
                    {WORKSPACES.map((ws) => (
                      <Link key={ws.id} href={ws.base} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-neutral-soft">
                        <span className={cn("grid h-7 w-7 place-items-center rounded-lg", ws.accent)}>
                          <NavIcon name={ws.icon} className="h-4 w-4" />
                        </span>
                        {ws.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-auto grid gap-2 pt-6">
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2a86e2_0%,#2563d6_55%,#1f4fc4_100%)] text-sm font-medium text-white"
                >
                  Buka Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/presentation" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-sm font-medium text-ink">
                  <Presentation className="h-4 w-4" /> Mode Presentasi
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
