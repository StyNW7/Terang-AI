import { createJSONStorage, type StateStorage } from "zustand/middleware";

/**
 * Small, versioned localStorage helpers for fictional demo state only.
 * Never store real personal data or confidential case information here.
 */
// v2: demo content became bilingual (ID/EN) — older saved demo data is discarded.
// v3: allocation presets and the ACE interview share follow the final proposal (FTE split).
export const STORAGE_VERSION = 3;
export const STORAGE_PREFIX = "terang-sge";

export const storageKey = (name: string) => `${STORAGE_PREFIX}:${name}:v${STORAGE_VERSION}`;

const memory = new Map<string, string>();

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return memory.get(name) ?? null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      memory.set(name, value);
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      memory.delete(name);
    }
  },
};

export const demoStorage = createJSONStorage(() => safeStorage);

/** Remove every demo key written by this prototype. */
export function clearDemoStorage() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    memory.clear();
  }
}
