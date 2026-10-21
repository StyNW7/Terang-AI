import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true only on the client after hydration — safe for portals and browser-only UI. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
