import { getActiveLocale, type Locale } from "@/lib/i18n-core";

/*
 * Locale-aware formatters. They read the locale of the render in progress
 * (set by `useI18n`), so components using them should call `useI18n()` to
 * re-render when the language changes. Currency is always IDR.
 */
const INTL: Record<Locale, string> = { id: "id-ID", en: "en-GB" };

const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();
function numberFmt(options: Intl.NumberFormatOptions) {
  const locale = getActiveLocale();
  const key = `n:${locale}:${JSON.stringify(options)}`;
  if (!cache.has(key)) cache.set(key, new Intl.NumberFormat(INTL[locale], options));
  return cache.get(key) as Intl.NumberFormat;
}
function dateFmt(options: Intl.DateTimeFormatOptions) {
  const locale = getActiveLocale();
  const key = `d:${locale}:${JSON.stringify(options)}`;
  if (!cache.has(key)) cache.set(key, new Intl.DateTimeFormat(INTL[locale], options));
  return cache.get(key) as Intl.DateTimeFormat;
}

const decimal = () => numberFmt({ maximumFractionDigits: 1 });

/** Rp 1.250.000 · Rp 1,250,000 */
export function formatIDR(value: number) {
  const n = numberFmt({ maximumFractionDigits: 0 }).format(Math.round(Math.abs(value)));
  return `${value < 0 ? "−" : ""}Rp ${n}`;
}

/** ID: Rp 1,25 M · Rp 850 jt · Rp 12 rb — EN: Rp 1.25B · Rp 850M · Rp 12K */
export function formatIDRCompact(value: number) {
  const en = getActiveLocale() === "en";
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  const unit = (u: { id: string; en: string }) => (en ? u.en : ` ${u.id}`);
  if (abs >= 1_000_000_000_000) return `${sign}Rp ${decimal().format(abs / 1_000_000_000_000)}${unit({ id: "T", en: "T" })}`;
  if (abs >= 1_000_000_000) return `${sign}Rp ${decimal().format(abs / 1_000_000_000)}${unit({ id: "M", en: "B" })}`;
  if (abs >= 1_000_000) return `${sign}Rp ${decimal().format(abs / 1_000_000)}${unit({ id: "jt", en: "M" })}`;
  if (abs >= 1_000) return `${sign}Rp ${decimal().format(abs / 1_000)}${unit({ id: "rb", en: "K" })}`;
  return `${sign}Rp ${numberFmt({ maximumFractionDigits: 0 }).format(abs)}`;
}

export function formatNumber(value: number) {
  return numberFmt({ maximumFractionDigits: 0 }).format(Math.round(value));
}

export function formatDecimal(value: number) {
  return decimal().format(value);
}

/** Full-time equivalents: 3.15 → 3,15 · 3.15 (up to two decimals). */
export function formatFte(value: number) {
  return numberFmt({ maximumFractionDigits: 2 }).format(Math.round(value * 100) / 100);
}

/** 0.352 → 35,2% · 35.2% */
export function formatPercent(value: number, digits = 0) {
  return `${numberFmt({ maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value * 100)}%`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt({ day: "numeric", month: "short", year: "numeric" }).format(d);
}

export function formatDateShort(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt({ day: "numeric", month: "short" }).format(d);
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt({ day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
}

/** Short month label (e.g. calendar chips): "Okt" · "Oct". */
export function formatMonthShort(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt({ month: "short" }).format(d);
}

export function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
