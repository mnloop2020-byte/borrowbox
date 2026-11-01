/**
 * Date helpers for bookings. Dates are plain "YYYY-MM-DD" strings in the
 * user's local calendar (product spec §1.2: compare dates, not timestamps).
 * ISO date strings sort the same way as the dates they name, so string
 * comparison is date comparison.
 */

/**
 * @param {Date} [now]
 * @returns {string} today's local date, e.g. "2026-11-10"
 */
export function todayISO(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Inclusive overlap: ranges that share even one day overlap (product spec §6.2).
 * @param {string} aStart
 * @param {string} aEnd
 * @param {string} bStart
 * @param {string} bEnd
 * @returns {boolean}
 */
export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && aEnd >= bStart;
}
