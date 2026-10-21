const idrFull = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

/** Rp 1.250.000 */
export function formatIDR(value: number) {
  return idrFull.format(Math.round(value)).replace(/ /g, " ");
}

/** Rp 1,25 M · Rp 850 jt · Rp 12 rb — compact Indonesian money notation. */
export function formatIDRCompact(value: number) {
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) return `${sign}Rp ${decimal.format(abs / 1_000_000_000_000)} T`;
  if (abs >= 1_000_000_000) return `${sign}Rp ${decimal.format(abs / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `${sign}Rp ${decimal.format(abs / 1_000_000)} jt`;
  if (abs >= 1_000) return `${sign}Rp ${decimal.format(abs / 1_000)} rb`;
  return `${sign}Rp ${number.format(abs)}`;
}

export function formatNumber(value: number) {
  return number.format(Math.round(value));
}

export function formatDecimal(value: number) {
  return decimal.format(value);
}

/** 0.352 → 35,2% */
export function formatPercent(value: number, digits = 0) {
  return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value * 100)}%`;
}

const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const dateShort = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
const dateTime = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt.format(d);
}

export function formatDateShort(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateShort.format(d);
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateTime.format(d);
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
