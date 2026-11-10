/**
 * Short messages that appear in a corner, stack, and leave on their own.
 *
 * A Zustand store, like the borrow list: every shared state in the browser
 * lives in Zustand. showToast() is its one action. No DOM, so Node can test
 * it (tests/toast.test.ts); Toasts.tsx draws the list.
 */
import { createStore } from "zustand/vanilla";

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

/** The toasts on screen now, oldest first. Every change is a new array. */
export const toastStore = createStore<{ toasts: readonly Toast[] }>()(() => ({
  toasts: [],
}));

let nextId = 1;

function update(change: (toasts: readonly Toast[]) => readonly Toast[]): void {
  toastStore.setState((state) => ({ toasts: change(state.toasts) }));
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
  update((toasts) => [...toasts, { id, message, type, leaving: false }]);

  setTimeout(() => {
    update((toasts) =>
      toasts.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast,
      ),
    );
    setTimeout(
      () => update((toasts) => toasts.filter((toast) => toast.id !== id)),
      EXIT_MS,
    );
  }, VISIBLE_MS[type]);
}
