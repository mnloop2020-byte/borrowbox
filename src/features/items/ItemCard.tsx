import type { ReactElement } from "react";
import { t, tValue } from "../../shared/i18n/i18n.ts";
import type { Item } from "../../shared/types.ts";
import { itemCardData } from "./itemCardData.ts";

interface ItemCardProps {
  item: Item;
}

/**
 * One item in a grid: photo, status, category, rating, title, condition,
 * owner and deposit. Text is escaped by React; the image URL, id and
 * status are checked by itemCardData().
 */
export function ItemCard({ item }: ItemCardProps): ReactElement {
  const card = itemCardData(item);

  return (
    <article className="item-card" data-item-id={card.id ?? undefined}>
      {/* No aria-label: the link's name is its visible text, so the two always match (WCAG 2.5.3) */}
      <a href={card.href} className="item-card-link">
        <div className="item-card-image-wrap">
          {card.imageUrl && (
            <img
              src={card.imageUrl}
              alt={item.title}
              className="item-card-image"
              loading="lazy"
            />
          )}
          {card.status && (
            <span
              className={`item-card-badge status-${card.status.toLowerCase()}`}
            >
              {tValue("status", card.status)}
            </span>
          )}
        </div>

        <div className="item-card-body">
          <div className="item-card-header">
            <span className="item-card-category">
              {tValue("category", item.category)}
            </span>
            {card.rating !== null && (
              <span
                className="item-card-rating"
                aria-label={t("card.ratingLabel", { rating: card.rating })}
              >
                <svg
                  className="rating-star-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {card.rating}
              </span>
            )}
          </div>

          {/* <bdi> keeps an English title in order on the Arabic page */}
          <h3 className="item-card-title">
            <bdi>{item.title}</bdi>
          </h3>

          <div className="item-card-meta">
            <span className="item-card-condition">
              {t("card.conditionLabel")}{" "}
              <strong>{tValue("condition", item.condition)}</strong>
            </span>
            <span className="item-card-owner">
              {t("card.owner", { name: item.ownerName })}
            </span>
          </div>

          <div className="item-card-footer">
            <div className="deposit-tag">
              <span className="deposit-label">{t("card.depositLabel")}</span>
              <span className="deposit-val">{card.deposit}</span>
            </div>
            <span className="borrow-free-tag">{t("card.freeLoan")}</span>
          </div>
        </div>
      </a>
    </article>
  );
}
