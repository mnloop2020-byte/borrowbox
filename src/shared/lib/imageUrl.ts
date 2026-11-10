/**
 * Checks an image URL before it goes into <img src> (CLAUDE.md, Security).
 * Pure function: no DOM, so Node can test it.
 */

// Inlined image data only; data:text/html and similar are rejected
const SAFE_DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml)[;,]/i;

/**
 * Image rule: only relative URLs, https: URLs and inlined image data.
 * Small images can be inlined as data:image URLs, so those must pass.
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
