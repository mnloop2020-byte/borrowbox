/**
 * Reusable ItemCard Component
 * Implements Airbnb-inspired marketplace card for BorrowBox items
 *
 * @param {Object} item - An item object conforming to the Item Model
 * @returns {string} HTML string
 */
export function renderItemCard(item) {
  const depositFormatted = Number(item.depositAmount).toFixed(0);

  return `
    <article class="item-card" data-item-id="${item.id}">
      <a href="#/item/${item.id}" class="item-card-link" aria-label="${item.title}, Deposit $${depositFormatted}, Condition ${item.condition}">
        <div class="item-card-image-wrap">
          <img
            src="${item.imageUrl}"
            alt="${item.title}"
            class="item-card-image"
            loading="lazy"
          />
          <span class="item-card-badge status-${item.status.toLowerCase()}">
            ${item.status}
          </span>
        </div>

        <div class="item-card-body">
          <div class="item-card-header">
            <span class="item-card-category">${item.category}</span>
            ${
              item.ownerRating
                ? `
              <span class="item-card-rating" aria-label="Rating ${item.ownerRating} out of 5">
                <svg class="rating-star-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                ${item.ownerRating}
              </span>
            `
                : ""
            }
          </div>

          <h3 class="item-card-title">${item.title}</h3>

          <div class="item-card-meta">
            <span class="item-card-condition">Condition: <strong>${item.condition}</strong></span>
            <span class="item-card-owner">by ${item.ownerName}</span>
          </div>

          <div class="item-card-footer">
            <div class="deposit-tag">
              <span class="deposit-label">Refundable Deposit</span>
              <span class="deposit-val">$${depositFormatted}</span>
            </div>
            <span class="borrow-free-tag">Free Loan</span>
          </div>
        </div>
      </a>
    </article>
  `;
}
