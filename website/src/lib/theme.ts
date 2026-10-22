"use client";

import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";
import { SIDEBAR_KEY, THEME_KEY } from "./theme-script";

/**
 * Theme + sidebar preferences live as attributes on <html> so CSS can react
 * before React hydrates. The boot script (inlined in the root layout) and the
 * hooks below read/write the same localStorage keys.
 */
export type Theme = "light" | "dark";

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the attribute still applies for this visit */
  }
}

function subscribeToHtml(attribute: string) {
  return (callback: () => void) => {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: [attribute] });
    return () => observer.disconnect();
  };
}

const subscribeTheme = subscribeToHtml("data-theme");
const subscribeSidebar = subscribeToHtml("data-sidebar");

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function preferredTheme(): Theme {
  const stored = read(THEME_KEY);
  return stored === "light" || stored === "dark" ? stored : systemTheme();
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(
    subscribeTheme,
    () => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"),
    () => "light",
  );

  // React resets <html> attributes on the dev Strict Mode remount; re-apply the preference.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const wanted = preferredTheme();
    if (root.getAttribute("data-theme") !== wanted) root.setAttribute("data-theme", wanted);

    // Follow the OS setting until the viewer picks a theme explicitly.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!read(THEME_KEY)) root.setAttribute("data-theme", systemTheme());
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => {
    const root = document.documentElement;
    write(THEME_KEY, next);
    if (root.getAttribute("data-theme") === next) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

    // Circular reveal from the toggle when the browser supports View Transitions.
    if (doc.startViewTransition && !reduce) {
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? 0;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.style.setProperty("--vt-x", `${x}px`);
      root.style.setProperty("--vt-y", `${y}px`);
      root.style.setProperty("--vt-r", `${r}px`);
      root.setAttribute("data-theme-vt", "");
      const t = doc.startViewTransition(() => root.setAttribute("data-theme", next));
      t.finished.finally(() => root.removeAttribute("data-theme-vt"));
      return;
    }

    // Fallback: smooth colour cross-fade.
    root.setAttribute("data-theme-switching", "");
    root.setAttribute("data-theme", next);
    window.setTimeout(() => root.removeAttribute("data-theme-switching"), 450);
  }, []);

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => setTheme(theme === "dark" ? "light" : "dark", origin),
    [setTheme, theme],
  );

  return { theme, setTheme, toggle };
}

export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(
    subscribeSidebar,
    () => document.documentElement.getAttribute("data-sidebar") === "collapsed",
    () => false,
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    const wanted = read(SIDEBAR_KEY) === "collapsed";
    if (wanted && root.getAttribute("data-sidebar") !== "collapsed") root.setAttribute("data-sidebar", "collapsed");
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    const root = document.documentElement;
    if (next) root.setAttribute("data-sidebar", "collapsed");
    else root.removeAttribute("data-sidebar");
    write(SIDEBAR_KEY, next ? "collapsed" : "expanded");
  }, []);

  // Reads the live attribute so the callback stays stable (used by keyboard shortcuts).
  const toggle = useCallback(() => setCollapsed(document.documentElement.getAttribute("data-sidebar") !== "collapsed"), [setCollapsed]);

  return { collapsed, setCollapsed, toggle };
}
