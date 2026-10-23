"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, ChevronRight, ChevronsUpDown, Globe, Menu, PanelLeftClose, PanelLeftOpen, Presentation, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { WORKSPACES, activeLink, workspaceFor, type Workspace } from "@/data/navigation";
import { Logo, LogoMark } from "@/components/shared/brand";
import { NavIcon } from "@/components/navigation/nav-icon";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { LanguageToggle } from "@/components/navigation/language-toggle";
import { CommandTrigger } from "@/components/navigation/command-palette";
import { Tooltip } from "@/components/ui/tooltip";
import { MODE_META, useStrategyMode } from "@/hooks/use-strategy-mode";
import { useSidebarCollapsed } from "@/lib/theme";
import { useEventsStore } from "@/store/events-store";
import { useInterviewStore } from "@/store/interview-store";
import { useOperationsStore } from "@/store/operations-store";
import { useScenarioStore } from "@/store/scenario-store";
import { cn } from "@/lib/utils";
import { keyOf, useI18n } from "@/lib/i18n";

const TAG_STYLE: Record<string, string> = {
  ONE: "bg-one-soft text-one-ink",
  ACE: "bg-ace-soft text-ace-ink",
  Usulan: "bg-soft text-brand-ink",
  Demo: "bg-success-soft text-success-ink",
};

/* ------------------------------------------------------------------
   Workspace switcher — jumps between the three dashboards
------------------------------------------------------------------- */
function WorkspaceSwitcher({ current, onNavigate, compact }: { current: Workspace; onNavigate?: () => void; compact: boolean }) {
  const [open, setOpen] = useState(false);
  const { collapsed } = useSidebarCollapsed();
  const { t, tx } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const trigger = (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-line bg-card p-2 text-left shadow-soft transition hover:border-brand/40",
        compact && "sidebar-collapsed:justify-center sidebar-collapsed:border-transparent sidebar-collapsed:bg-transparent sidebar-collapsed:p-1 sidebar-collapsed:shadow-none",
      )}
    >
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", current.accent)}>
        <NavIcon name={current.icon} className="h-[18px] w-[18px]" />
      </span>
      <span className={cn("min-w-0 flex-1", compact && "sidebar-collapsed:hidden")}>
        <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Dashboard</span>
        <span className="block truncate text-sm font-semibold text-ink">{current.short}</span>
      </span>
      <ChevronsUpDown className={cn("h-4 w-4 shrink-0 text-muted", compact && "sidebar-collapsed:hidden")} />
    </button>
  );

  return (
    <div ref={ref} className="relative">
      {compact ? (
        <Tooltip content={`Dashboard: ${current.label}`} side="right" className="w-full" disabled={!collapsed || open}>
          {trigger}
        </Tooltip>
      ) : (
        trigger
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute left-0 top-[calc(100%+6px)] z-50 w-[272px] rounded-2xl border border-line bg-card p-1.5 shadow-lift",
              compact && "sidebar-collapsed:left-[calc(100%+10px)] sidebar-collapsed:top-0",
            )}
          >
            <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">{t("Pilih dashboard", "Choose a dashboard")}</p>
            {WORKSPACES.map((ws) => {
              const active = ws.id === current.id;
              return (
                <Link
                  key={ws.id}
                  role="menuitem"
                  href={ws.base}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className={cn("flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-neutral-soft", active && "bg-neutral-soft")}
                >
                  <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", ws.accent)}>
                    <NavIcon name={ws.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{ws.label}</span>
                    <span className="block truncate text-xs text-muted">{tx(ws.description)}</span>
                  </span>
                  {active && <Check className="h-4 w-4 shrink-0 text-brand-ink" />}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------
   Sidebar
------------------------------------------------------------------- */
function SidebarContent({ pathname, onNavigate, compact }: { pathname: string; onNavigate?: () => void; compact: boolean }) {
  const ws = workspaceFor(pathname);
  const current = activeLink(pathname, ws);
  const { mode } = useStrategyMode();
  const { toggle, collapsed } = useSidebarCollapsed();
  const { t, tx } = useI18n();
  const hide = compact ? "sidebar-collapsed:hidden" : "";

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 shrink-0 items-center justify-between gap-2 px-4", compact && "sidebar-collapsed:justify-center sidebar-collapsed:px-0")}>
        <Link href="/" onClick={onNavigate} aria-label={t("Terang AI — Beranda", "Terang AI — Home")} className="flex items-center">
          <span className={hide}>
            <Logo height={22} href={null} />
          </span>
          {compact && (
            <span className="hidden sidebar-collapsed:block">
              <LogoMark size={30} />
            </span>
          )}
        </Link>
        {compact && (
          <button
            type="button"
            onClick={toggle}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-neutral-soft hover:text-ink sidebar-collapsed:hidden"
            aria-label={t("Kecilkan _sidebar_", "Collapse sidebar")}
            title={`${t("Kecilkan _sidebar_", "Collapse sidebar")}  [`}
          >
            <PanelLeftClose className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      <div className={cn("px-3", compact && "sidebar-collapsed:px-2")}>
        <WorkspaceSwitcher current={ws} onNavigate={onNavigate} compact={compact} />
      </div>

      <nav aria-label={`${t("Navigasi", "Navigation")} ${ws.label}`} data-lenis-prevent className={cn("scrollbar-thin mt-4 flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-3 pb-4", compact && "sidebar-collapsed:px-2")}>
        {ws.groups.map((group) => (
          <div key={keyOf(group.group)}>
            <p className={cn("mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted", hide)}>{tx(group.group)}</p>
            {compact && <div className="mx-auto mb-2 hidden h-px w-6 bg-line sidebar-collapsed:block" />}
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const active = current?.href === link.href;
                const item = (
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                      compact && "sidebar-collapsed:justify-center sidebar-collapsed:px-0",
                      active ? "bg-card text-ink shadow-soft ring-1 ring-line" : "text-muted-strong hover:bg-neutral-soft hover:text-ink",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`sidebar-active-${compact ? "d" : "m"}`}
                        className={cn("absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-gradient", compact && "sidebar-collapsed:-left-2")}
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <NavIcon name={link.icon} className={cn("h-[18px] w-[18px] shrink-0", active ? "text-brand-ink" : "text-muted group-hover:text-ink")} />
                    <span className={cn("min-w-0 flex-1 truncate", hide)}>{tx(link.label)}</span>
                    {link.tag && <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none", TAG_STYLE[link.tag], hide)}>{link.tag}</span>}
                  </Link>
                );
                return compact ? (
                  <Tooltip key={link.href} content={tx(link.label)} side="right" className="flex w-full" disabled={!collapsed}>
                    {item}
                  </Tooltip>
                ) : (
                  <div key={link.href}>{item}</div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("shrink-0 space-y-2 border-t border-line p-3", compact && "sidebar-collapsed:px-2")}>
        <Link
          href="/dashboard/strategy"
          onClick={onNavigate}
          className={cn(
            "group flex items-center gap-3 rounded-xl p-2.5 text-white shadow-soft transition hover:brightness-110",
            compact && "sidebar-collapsed:justify-center sidebar-collapsed:p-2",
          )}
          style={{ backgroundImage: MODE_META[mode].gradient }}
          title={compact && collapsed ? `${t("Mode strategi", "Strategy mode")}: ${t(MODE_META[mode].label)}` : undefined}
        >
          <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 ring-1 ring-white/25">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <span className={cn("min-w-0 flex-1", hide)}>
            <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-white/75">{t("Mode strategi", "Strategy mode")}</span>
            <span className="block truncate text-sm font-semibold">{t(MODE_META[mode].label)}</span>
          </span>
          <ChevronRight className={cn("h-4 w-4 shrink-0 text-white/80 transition group-hover:translate-x-0.5", hide)} />
        </Link>
        {compact && (
          <button
            type="button"
            onClick={toggle}
            className="hidden w-full place-items-center rounded-xl py-2 text-muted transition hover:bg-neutral-soft hover:text-ink sidebar-collapsed:grid"
            aria-label={t("Perbesar _sidebar_", "Expand sidebar")}
            title={`${t("Perbesar _sidebar_", "Expand sidebar")}  [`}
          >
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Shell
------------------------------------------------------------------- */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const { toggle: toggleSidebar } = useSidebarCollapsed();
  const { t, tx } = useI18n();

  // "[" toggles the sidebar (ignored while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== "[" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (t && (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable)) return;
      toggleSidebar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSidebar]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ws = workspaceFor(pathname);
  const current = activeLink(pathname, ws);
  const { mode } = useStrategyMode();
  const resetEvents = useEventsStore((s) => s.reset);
  const resetInterview = useInterviewStore((s) => s.reset);
  const resetOps = useOperationsStore((s) => s.reset);
  const resetScenario = useScenarioStore((s) => s.reset);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  const resetDemo = () => {
    if (ws.id === "events") resetEvents();
    else if (ws.id === "interview") resetInterview();
    else {
      resetOps();
      resetScenario();
    }
    toast.success(t(`Data demo ${ws.label} dikembalikan ke kondisi awal.`, `${ws.label} demo data restored to its initial state.`));
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-line bg-subtle transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block sidebar-collapsed:w-[76px]">
        <SidebarContent pathname={pathname} compact />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-navy-deep/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="absolute inset-y-0 left-0 w-[288px] max-w-[85vw] border-r border-line bg-subtle shadow-lift"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-xl text-muted hover:bg-neutral-soft"
                aria-label={t("Tutup navigasi", "Close navigation")}
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} compact={false} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:pl-[264px] lg:sidebar-collapsed:pl-[76px]">
        <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-card text-ink lg:hidden"
                aria-label={t("Buka navigasi", "Open navigation")}
              >
                <Menu className="h-5 w-5" />
              </button>
              <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
                <Link href={ws.base} className="hidden shrink-0 font-medium text-muted transition hover:text-ink sm:inline">
                  {ws.label}
                </Link>
                <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted sm:block" />
                <span className="truncate font-semibold text-ink">{tx(current?.label ?? { id: "Ringkasan", en: "Overview" })}</span>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <CommandTrigger className="hidden lg:inline-flex" />
              <CommandTrigger compact className="lg:hidden" />
              <Tooltip content={t("Mode strategi aktif — ubah di Kontrol Strategi (Super Admin)", "Active strategy mode — change it in Strategy Control (Super Admin)")} side="bottom">
                <Link
                  href="/dashboard/strategy"
                  className="hidden items-center gap-2 rounded-xl border border-line bg-card px-3 py-1.5 text-xs font-medium text-muted-strong shadow-soft transition hover:border-brand/40 hover:text-ink md:inline-flex"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: MODE_META[mode].color }} />
                  Mode: <span className="font-semibold text-ink">{t(MODE_META[mode].short)}</span>
                </Link>
              </Tooltip>
              <Tooltip content={t("Kembalikan data demo _dashboard_ ini ke kondisi awal", "Restore this dashboard's demo data to its initial state")} side="bottom">
                <button
                  type="button"
                  onClick={resetDemo}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-medium text-muted-strong transition hover:bg-neutral-soft hover:text-ink"
                >
                  <RotateCcw className="h-4 w-4" /> <span className="hidden xl:inline">{t("Reset demo", "Reset demo")}</span>
                </button>
              </Tooltip>
              <Tooltip content={t("Mode presentasi", "Presentation mode")} side="bottom">
                <Link
                  href="/presentation"
                  className="hidden h-9 w-9 place-items-center rounded-xl text-muted-strong transition hover:bg-neutral-soft hover:text-ink sm:grid"
                  aria-label={t("Mode presentasi", "Presentation mode")}
                >
                  <Presentation className="h-[18px] w-[18px]" />
                </Link>
              </Tooltip>
              <LanguageToggle className="hidden sm:flex" layoutId="lang-pill-app" />
              <ThemeToggle />
              <Link
                href="/"
                className="hidden h-9 items-center gap-1.5 rounded-xl border border-line bg-card px-3 text-[13px] font-medium text-ink shadow-soft transition hover:border-brand/40 sm:inline-flex"
              >
                <Globe className="h-4 w-4 text-muted" /> {t("Situs", "Site")} <ArrowUpRight className="h-3.5 w-3.5 text-muted" />
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
