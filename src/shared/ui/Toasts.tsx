import { useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import { getToasts, subscribeToasts } from "./toast.ts";

/**
 * Draws the toasts from toast.ts. useSyncExternalStore reads a store
 * that lives outside React and draws again each time the store changes.
 *
 * The region is always on the page and has aria-live="polite", so screen
 * readers read each new toast aloud without moving focus.
 */
export function Toasts(): ReactElement {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts);
  return (
    <div id="toasts" className="toast-region" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}${toast.leaving ? " is-leaving" : ""}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
