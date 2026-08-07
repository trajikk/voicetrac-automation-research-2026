"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mediaQueryList = window.matchMedia(QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * framer-motion's useReducedMotion() reads matchMedia synchronously during
 * render, which resolves on the client before hydration but is always
 * false on the server (no window) — for a visitor with reduced motion
 * enabled, that mismatch fails hydration. useSyncExternalStore is the
 * primitive built for exactly this: it uses getServerSnapshot during SSR
 * and the initial client render, then resyncs to the real value safely.
 */
export function useSafeReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
