/**
 * Helpers for putting untrusted text into HTML templates safely
 * (CLAUDE.md §4a). Pure functions: no DOM, so Node can test them.
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes text for use inside HTML, in element content or in a quoted attribute.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

// Inlined image data only; data:text/html and similar are rejected
const SAFE_DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml)[;,]/i;

/**
 * Image rule: only relative URLs, https: URLs and inlined image data.
 * Vite may inline small images as data:image URLs, so those must pass.
 */
export function isSafeImageUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  const value = url.trim();
  if (value === "") return false;
  if (value.startsWith("//")) return false; // protocol-relative: another host
  if (SAFE_DATA_IMAGE.test(value)) return true;
  if (value.startsWith("https://")) return true;
  // Relative paths have no scheme ("name:" before any "/", "?" or "#")
  return !/^[a-z][a-z0-9+.-]*:/i.test(value);
}
