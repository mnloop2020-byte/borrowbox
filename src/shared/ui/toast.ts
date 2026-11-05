/**
 * Short messages that appear in a corner, stack, and leave on their own.
 *
 * This file is the list of toasts on screen and the timers that remove
 * them. It has no DOM, so Node can test it (tests/toast.test.ts).
 * Toasts.tsx draws the list and draws it again whenever it changes.
 */

export type ToastType = "success" | "error";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  /** True during the exit animation, just before it is removed */
  leaving: boolean;
}

/** Errors stay longer: they are more important and often longer to read */
export const VISIBLE_MS: Record<ToastType, number> = {
  success: 4000,
  error: 7000,
};

/** Matches the exit transition in style.css (--duration-standard) */
export const EXIT_MS = 200;

let toasts: readonly Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

/**
 * Replaces the list and tells every listener. Always a new array, never a
 * change to the old one: React compares the two to know something changed.
 */
function update(next: readonly Toast[]): void {
  toasts = next;
  listeners.forEach((listener) => listener());
}

/** The toasts on screen now, oldest first */
export function getToasts(): readonly Toast[] {
  return toasts;
}

/**
 * Calls `listener` after every change.
 *
 * @returns a function that stops the calls
 */
export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Shows one toast.
 *
 * @param message - plain text; React shows it as text, never as HTML
 * @param type - "success" (green) or "error" (red)
 */
export function showToast(message: string, type: ToastType = "success"): void {
  const id = nextId++;
  // Newest at the end, so toasts stack in the order they happened
  update([...toasts, { id, message, type, leaving: false }]);

  setTimeout(() => {
    update(toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => update(toasts.filter((t) => t.id !== id)), EXIT_MS);
  }, VISIBLE_MS[type]);
}
