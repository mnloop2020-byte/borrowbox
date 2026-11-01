import { formatMoney, t, tValue } from "../i18n/i18n.js";
import { escapeHtml, isSafeImageUrl } from "../logic/html.js";
import { isValidItemId } from "../logic/validation.js";

const KNOWN_STATUSES = ["Available", "Reserved", "Unavailable"];

/**
 * Reusable ItemCard Component
 * Implements Airbnb-inspired marketplace card for BorrowBox items.
 *
 * Every item field is treated as untrusted (items will later come from
 * localStorage and the List an Item form): text is escaped, the image URL
 * and id are checked, and only known statuses reach the class name.
 *
 * @param {Object} item - An item object conforming to the Item Model
 * @returns {string} HTML string
 */
export function renderItemCard(item) {
  const deposit = Number(item.depositAmount);
  const depositFormatted = escapeHtml(formatMoney(deposit));
  const rating = Number(item.ownerRating);
  const hasRating = Number.isFinite(rating) && rating > 0;
  const status = KNOWN_STATUSES.includes(item.status) ? item.status : null;
  const href = isValidItemId(item.id) ? `#/item/${item.id}` : "#/catalog";

  const title = escapeHtml(item.title);
  // Fixed-list values are shown translated; the stored value stays English
  const condition = escapeHtml(tValue("condition", item.condition));

  return `
    <article class="item-card"${isValidItemId(item.id) ? ` data-item-id="${item.id}"` : ""}>
      <a href="${href}" class="item-card-link" aria-label="${escapeHtml(t("card.ariaLabel", { title: item.title, deposit: formatMoney(deposit), condition: tValue("condition", item.condition) }))}">
        <div class="item-card-image-wrap">
          ${
            isSafeImageUrl(item.imageUrl)
              ? `<img src="${escapeHtml(item.imageUrl)}" alt="${title}" class="item-card-image" loading="lazy" />`
              : ""
          }
          ${
            status
              ? `<span class="item-card-badge status-${status.toLowerCase()}">${escapeHtml(tValue("status", status))}</span>`
              : ""
          }
        </div>

        <div class="item-card-body">
          <div class="item-card-header">
            <span class="item-card-category">${escapeHtml(tValue("category", item.category))}</span>
            ${
              hasRating
                ? `
              <span class="item-card-rating" aria-label="${escapeHtml(t("card.ratingLabel", { rating }))}">
                <svg class="rating-star-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                ${rating}
              </span>
            `
                : ""
            }
          </div>

          <h3 class="item-card-title">${title}</h3>

          <div class="item-card-meta">
            <span class="item-card-condition">${escapeHtml(t("card.conditionLabel"))} <strong>${condition}</strong></span>
            <span class="item-card-owner">${escapeHtml(t("card.owner", { name: item.ownerName }))}</span>
          </div>

          <div class="item-card-footer">
            <div class="deposit-tag">
              <span class="deposit-label">${escapeHtml(t("card.depositLabel"))}</span>
              <span class="deposit-val">${depositFormatted}</span>
            </div>
            <span class="borrow-free-tag">${escapeHtml(t("card.freeLoan"))}</span>
          </div>
        </div>
      </a>
    </article>
  `;
}
