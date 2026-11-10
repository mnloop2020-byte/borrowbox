"use client";
import type { ReactElement } from "react";
import { useStore } from "zustand";
import { toastStore } from "./toastStore.ts";

/**
 * Draws the toasts from toastStore and draws again after every change.
 *
 * The region is always on the page and has aria-live="polite", so screen
 * readers read each new toast aloud without moving focus.
 */
export function Toasts(): ReactElement {
  const toasts = useStore(toastStore, (state) => state.toasts);
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
