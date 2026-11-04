/**
 * Short messages that appear in a corner, stack, and leave on their own.
 *
 * They are added to #toasts in index.html. That container has
 * aria-live="polite", so screen readers read each new toast aloud without
 * moving focus. It sits outside #app, so a re-render (language change,
 * route change) never removes a toast that is still showing.
 */

export type ToastType = "success" | "error";

/** Errors stay longer: they are more important and often longer to read */
const VISIBLE_MS: Record<ToastType, number> = { success: 4000, error: 7000 };

/** Matches the exit transition in style.css (--duration-standard) */
const EXIT_MS = 200;

/**
 * Shows one toast.
 *
 * @param message - plain text; set with textContent, so it is never HTML
 * @param type - "success" (green) or "error" (red)
 */
export function showToast(message: string, type: ToastType = "success"): void {
  const region = document.querySelector<HTMLElement>("#toasts");
  if (!region) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  // Newest at the end, so toasts stack in the order they happened
  region.append(toast);

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), EXIT_MS);
  }, VISIBLE_MS[type]);
}
