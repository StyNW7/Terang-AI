import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Division with zero protection. */
export function safeDivide(numerator: number, denominator: number, fallback = 0) {
  if (!denominator || !Number.isFinite(denominator)) return fallback;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : fallback;
}

export function nonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

let counter = 0;
/** Deterministic-enough id for demo objects created in the browser. */
export function makeId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export function sum(values: number[]) {
  return values.reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);
}
