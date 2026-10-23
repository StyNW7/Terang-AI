"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CornerDownLeft, Moon, Search, Sun } from "lucide-react";
import { MAIN_NAV, WORKSPACES } from "@/data/navigation";
import { NavIcon } from "@/components/navigation/nav-icon";
import { MODE_META, useStrategyMode } from "@/hooks/use-strategy-mode";
import { useTheme } from "@/lib/theme";
import { useMounted } from "@/hooks/use-mounted";
import type { StrategyMode } from "@/types/common";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface Command {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: string | "sun" | "moon";
  keywords?: string;
  run: () => void;
}

/* Tiny open/close store so any button can open the palette without prop drilling. */
let isOpen = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
export const openCommandPalette = () => {
  isOpen = true;
  emit();
};
const closePalette = () => {
  isOpen = false;
  emit();
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function CommandPalette() {
  const open = useSyncExternalStore(subscribe, () => isOpen, () => false);
  const mounted = useMounted();
  const { t } = useI18n();

  // Global shortcut: Ctrl/⌘ + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) closePalette();
        else openCommandPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("lenis-stopped");
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label={t("Pencarian cepat", "Quick search")}>
          <motion.div
            className="absolute inset-0 bg-navy-deep/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
          />
          <PaletteBody />
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function PaletteBody() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setMode } = useStrategyMode();
  const { t, locale, setLocale } = useI18n();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const pagesGroup = t("Halaman", "Pages");
    const pages: Command[] = [{ id: "home", group: pagesGroup, label: t("Beranda", "Home"), icon: "compass", keywords: "home beranda", run: go("/") }];
    for (const item of MAIN_NAV) {
      if (item.href) pages.push({ id: item.href, group: pagesGroup, label: t(item.label), icon: "compass", run: go(item.href) });
      for (const c of item.children ?? []) {
        if (c.href.startsWith("/dashboard")) continue;
        pages.push({ id: c.href, group: pagesGroup, label: t(c.label), hint: c.description && t(c.description), icon: c.icon, run: go(c.href) });
      }
    }
    const dash: Command[] = WORKSPACES.flatMap((ws) =>
      ws.groups.flatMap((g) =>
        g.links.map((l) => ({
          id: l.href,
          group: ws.label,
          label: l.href === ws.base ? `${ws.label} — ${t("Ringkasan", "Overview")}` : t(l.label),
          hint: t(l.description ?? g.group),
          icon: l.icon,
          keywords: `${ws.label} ${ws.short} dashboard ${t(g.group)}`,
          run: go(l.href),
        })),
      ),
    );
    const modes: Command[] = (["overview", "one", "ace"] as StrategyMode[]).map((m) => ({
      id: `mode-${m}`,
      group: t("Aksi", "Actions"),
      label: `${t("Aktifkan mode", "Activate mode")} ${t(MODE_META[m].label)}`,
      hint: t(MODE_META[m].description),
      icon: m === "one" ? "target" : m === "ace" ? "layers" : "compass",
      keywords: "strategi strategy mode switch",
      run: () => setMode(m),
    }));
    const actions: Command[] = [
      {
        id: "theme",
        group: t("Aksi", "Actions"),
        label: theme === "dark" ? t("Ganti ke mode terang", "Switch to light mode") : t("Ganti ke mode gelap", "Switch to dark mode"),
        icon: theme === "dark" ? "sun" : "moon",
        keywords: "tema theme dark light gelap terang",
        run: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
      {
        id: "language",
        group: t("Aksi", "Actions"),
        label: locale === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English",
        icon: "languages",
        keywords: "bahasa language english indonesia translate terjemah",
        run: () => setLocale(locale === "en" ? "id" : "en"),
      },
      { id: "present", group: t("Aksi", "Actions"), label: t("Mulai mode presentasi", "Start presentation mode"), icon: "play", keywords: "slide juri judges presentasi presentation", run: go("/presentation") },
      ...modes,
    ];
    return [...pages, ...dash, ...actions];
  }, [router, theme, setTheme, setMode, t, locale, setLocale]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return commands;
    const terms = q.split(/\s+/);
    return commands.filter((c) => {
      const hay = normalize(`${c.label} ${c.hint ?? ""} ${c.group} ${c.keywords ?? ""}`);
      return terms.every((t) => hay.includes(t));
    });
  }, [commands, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const c of results) map.set(c.group, [...(map.get(c.group) ?? []), c]);
    return [...map.entries()];
  }, [results]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (c?: Command) => {
    if (!c) return;
    closePalette();
    c.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    }
  };

  let index = -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-card shadow-lift"
      onKeyDown={onKeyDown}
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="h-5 w-5 shrink-0 text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder={t("Cari halaman, fitur _dashboard_, atau aksi…", "Search pages, dashboard features or actions…")}
          className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
          aria-label={t("Kata kunci pencarian", "Search keywords")}
          aria-controls="command-results"
          aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
        />
        <kbd className="hidden shrink-0 rounded-md border border-line bg-subtle px-1.5 py-0.5 text-[11px] font-medium text-muted sm:block">Esc</kbd>
      </div>
      <div ref={listRef} id="command-results" role="listbox" data-lenis-prevent className="scrollbar-thin max-h-[min(60vh,440px)] overflow-y-auto p-2">
        {results.length === 0 && (
          <p className="px-3 py-10 text-center text-sm text-muted-strong">
            {t("Tidak ada hasil untuk", "No results for")} “<span className="font-medium text-ink">{query}</span>”.
          </p>
        )}
        {groups.map(([group, items]) => (
          <div key={group} className="mb-1.5">
            <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">{group}</p>
            {items.map((c) => {
              index += 1;
              const i = index;
              const selected = i === active;
              return (
                <button
                  key={c.id}
                  id={`cmd-${c.id}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  data-index={i}
                  onMouseMove={() => active !== i && setActive(i)}
                  onClick={() => run(c)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    selected ? "bg-soft" : "hover:bg-neutral-soft",
                  )}
                >
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1", selected ? "bg-card text-brand-ink ring-brand/30" : "bg-subtle text-muted-strong ring-line")}>
                    {c.icon === "sun" ? <Sun className="h-4 w-4" /> : c.icon === "moon" ? <Moon className="h-4 w-4" /> : <NavIcon name={c.icon} className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{c.label}</span>
                    {c.hint && <span className="block text-[13px] leading-snug text-muted">{c.hint}</span>}
                  </span>
                  {selected ? <CornerDownLeft className="h-4 w-4 shrink-0 text-brand-ink" /> : <ArrowRight className="h-4 w-4 shrink-0 text-muted/60" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line bg-subtle px-4 py-2.5 text-xs text-muted">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-line bg-card px-1">↑</kbd>
            <kbd className="rounded border border-line bg-card px-1">↓</kbd> {t("pilih", "select")}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-line bg-card px-1">Enter</kbd> {t("buka", "open")}
          </span>
        </span>
        <span>
          {results.length} {t("hasil", results.length === 1 ? "result" : "results")}
        </span>
      </div>
    </motion.div>
  );
}

/** Search trigger shown in headers. */
export function CommandTrigger({ className, compact }: { className?: string; compact?: boolean }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-label={t("Cari (Ctrl+K)", "Search (Ctrl+K)")}
      className={cn(
        "group inline-flex h-9 items-center gap-2 rounded-xl border border-line bg-card text-[13px] text-muted shadow-soft transition hover:border-brand/40 hover:text-ink",
        compact ? "w-9 justify-center" : "px-3",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      {!compact && (
        <>
          <span className="pr-6">{t("Cari…", "Search…")}</span>
          <kbd className="rounded-md border border-line bg-subtle px-1.5 py-0.5 text-[11px] font-medium text-muted">Ctrl K</kbd>
        </>
      )}
    </button>
  );
}
