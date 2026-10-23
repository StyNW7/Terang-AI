"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_KEY,
  pick,
  plain,
  rich,
  setActiveLocale,
  type Locale,
  type Txt,
} from "@/lib/i18n-core";

export type { Bilingual, Locale, Txt } from "@/lib/i18n-core";
export { L, keyOf } from "@/lib/i18n-core";

/**
 * The language lives on <html data-locale> (applied by the boot script before
 * first paint), mirroring how the theme works. Server HTML is always rendered in
 * the default locale; after hydration React re-renders with the saved one.
 */
function readStored(): Locale {
  try {
    return window.localStorage.getItem(LOCALE_KEY) === "en" ? "en" : "id";
  } catch {
    return DEFAULT_LOCALE;
  }
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-locale"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Locale => (document.documentElement.getAttribute("data-locale") === "en" ? "en" : "id");
const getServerSnapshot = (): Locale => DEFAULT_LOCALE;

export function setLocale(next: Locale) {
  const root = document.documentElement;
  try {
    window.localStorage.setItem(LOCALE_KEY, next);
  } catch {
    /* storage unavailable — the attribute still applies for this visit */
  }
  if (root.getAttribute("data-locale") === next) return;
  root.setAttribute("data-locale-switching", "");
  root.setAttribute("data-locale", next);
  root.lang = next;
  window.setTimeout(() => root.removeAttribute("data-locale-switching"), 450);
}

export function useI18n() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Formatters (numbers, money, dates) read the locale of the render in progress.
  setActiveLocale(locale);

  /** Plain string: `t("Simpan", "Save")` or `t(bilingual)`. Italic markers are removed. */
  const t = useCallback(
    (value: Txt, en?: string): string => plain(en === undefined ? pick(value, locale) : locale === "en" ? en : pick(value, "id")),
    [locale],
  );

  /** Rich text for JSX children: italic markers become <em>. */
  const tx = useCallback(
    (value: Txt, en?: string): ReactNode => rich(en === undefined ? pick(value, locale) : locale === "en" ? en : pick(value, "id")),
    [locale],
  );

  const toggle = useCallback(() => setLocale(locale === "en" ? "id" : "en"), [locale]);

  return useMemo(() => ({ locale, t, tx, setLocale, toggle }), [locale, t, tx, toggle]);
}

/**
 * Bilingual text usable from server components:
 * `<T id="Buka _dashboard_" en="Open dashboard" />` or `<T v={item.title} />`.
 * String props get italic markers rendered; node props are shown as-is.
 */
export function T(props: { v: Txt } | { id: ReactNode; en: ReactNode }) {
  const { locale } = useI18n();
  if ("v" in props) return rich(pick(props.v, locale));
  const value = locale === "en" ? props.en : props.id;
  return typeof value === "string" ? rich(value) : value;
}

/** English versions of the (Indonesian) segments used in page `metadata.title`s. */
const TITLE_EN: Record<string, string> = {
  "Dua Produk B2B": "Two B2B Products",
  "Referensi & Asumsi": "References & Assumptions",
  "ACE Strategy — KONTRA": "ACE Strategy — CONTRA",
  "Mode Presentasi": "Presentation Mode",
  Analitik: "Analytics",
  "Buat Event": "Create Event",
  Keuangan: "Finance",
  Penjurian: "Judging",
  "Daftar Event": "Event List",
  Peserta: "Participants",
  "Portal Peserta": "Participant Portal",
  Kandidat: "Candidates",
  Lowongan: "Vacancies",
  "Portal Kandidat": "Candidate Portal",
  Laporan: "Reports",
  "Kapasitas & Operasional": "Capacity & Operations",
  "Portofolio & Keputusan": "Portfolio & Decisions",
  "Kontrol Strategi": "Strategy Control",
  "Simulator ONE vs ACE": "ONE vs ACE Simulator",
};

const translateTitle = (title: string) =>
  title
    .split(" · ")
    .map((part) => TITLE_EN[part] ?? part)
    .join(" · ");

/**
 * Keeps <html lang> in sync, lifts the "hide until translated" guard once the saved
 * language is rendered, and mirrors server-rendered page titles into English.
 */
export function LocaleSync() {
  const { locale } = useI18n();
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    if (locale === readStored()) root.setAttribute("data-i18n-ready", "");
  }, [locale]);

  useEffect(() => {
    let original = document.title;
    let applied = "";
    const apply = () => {
      applied = locale === "en" ? translateTitle(original) : original;
      if (document.title !== applied) document.title = applied;
    };
    apply();
    // Next.js rewrites <title> on navigation; treat any title we did not write as the new original.
    const observer = new MutationObserver(() => {
      if (document.title === applied) return;
      original = document.title;
      apply();
    });
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => {
      observer.disconnect();
      // Hand the untranslated title back so the next run starts from the source text.
      if (document.title !== original) document.title = original;
    };
  }, [locale]);
  return null;
}
