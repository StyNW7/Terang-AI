import { createElement, type ReactNode } from "react";

/**
 * Bilingual (Indonesian / English) primitives shared by server and client code.
 *
 * Copy is written as `{ id, en }` pairs. Inside either language, a term that reads
 * better in the *other* language is wrapped in underscores — `_dashboard_` — and is
 * rendered in italics by `rich()` (and simply unwrapped by `plain()`).
 */
export type Locale = "id" | "en";
export const LOCALES: Locale[] = ["id", "en"];
export const DEFAULT_LOCALE: Locale = "id";
export const LOCALE_KEY = "terang-sge:locale";

export interface Bilingual {
  id: string;
  en: string;
}

/** A plain string (same in both languages, e.g. a product name) or a bilingual pair. */
export type Txt = string | Bilingual;

/** Shorthand for a bilingual pair. */
export const L = (id: string, en: string): Bilingual => ({ id, en });

// The locale used by formatters during the current render (kept in sync by `useI18n`).
// Server renders always use the default locale, so this never leaks across requests.
let activeLocale: Locale = DEFAULT_LOCALE;
export const getActiveLocale = () => activeLocale;
export const setActiveLocale = (locale: Locale) => {
  activeLocale = locale;
};

/** Stable React key / identifier for a Txt (the Indonesian source string). */
export const keyOf = (value: Txt): string => (typeof value === "string" ? value : value.id);

export function pick(value: Txt, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}

const MARK = /_([^_\n]+)_/g;

/** Removes italic markers: "Buka _dashboard_" → "Buka dashboard". */
export function plain(text: string): string {
  return text.includes("_") ? text.replace(MARK, "$1") : text;
}

/**
 * Renders italic markers as <em>: "Buka _dashboard_" → Buka <em>dashboard</em>.
 * The result is wrapped in one <span> so that, inside a flex or grid parent, the
 * sentence stays a single item instead of splitting into one column per fragment.
 */
export function rich(text: string): ReactNode {
  if (!text.includes("_")) return text;
  const parts = text.split(MARK);
  if (parts.length === 1) return text;
  return createElement(
    "span",
    null,
    ...parts.map((part, i) => (i % 2 ? createElement("em", { key: i }, part) : part)),
  );
}
