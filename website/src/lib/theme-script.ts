/** Shared between the server root layout (boot script) and the client theme hooks. */
import { LOCALE_KEY } from "./i18n-core";

export const THEME_KEY = "terang-sge:theme";
export const SIDEBAR_KEY = "terang-sge:sidebar";

/** Runs in <head> before first paint: applies the saved theme, sidebar state and language. */
export const THEME_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.setAttribute("data-theme",t);if(localStorage.getItem("${SIDEBAR_KEY}")==="collapsed")d.setAttribute("data-sidebar","collapsed");var l=localStorage.getItem("${LOCALE_KEY}")==="en"?"en":"id";d.setAttribute("data-locale",l);d.lang=l}catch(e){}})()`;
