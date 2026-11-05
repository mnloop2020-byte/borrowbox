import type { ReactElement } from "react";
import { formatMoney, t, tValue } from "../../shared/i18n/i18n.ts";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { todayISO } from "../../shared/lib/dates.ts";
import { isSafeImageUrl } from "../../shared/lib/imageUrl.ts";
import { BackIcon } from "../../shared/ui/BackIcon.tsx";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard.tsx";
import type { Item } from "../../shared/types.ts";
import { BorrowForm } from "../requests/BorrowForm.tsx";
import { deriveItemStatus } from "../requests/requestRules.ts";
import { getRequests } from "../requests/requestStore.ts";
import { useCurrentUser } from "../users/useCurrentUser.ts";
import { SEED_CARDS } from "./cardsData.ts";

function ItemNotFound(): ReactElement {
  usePageTitle(t("title.itemNotFound"));
  return (
    <PlaceholderCard
      title={t("item.notFoundTitle")}
      text={t("item.notFoundText")}
      action={{ href: "#/catalog", label: t("item.browseCatalog") }}
    />
  );
}

interface ItemProps {
  item: Item;
}

/** Who lends the item: the trust details that sit under the title */
function OwnerCard({ item }: ItemProps): ReactElement {
  const rating = Number(item.ownerRating);
  return (
    <section className="item-owner" aria-labelledby="owner-heading">
      <span className="owner-avatar" aria-hidden="true">
        {item.ownerName.trim().charAt(0)}
      </span>
      <div className="item-owner-body">
        <h2 id="owner-heading" className="item-owner-label">
          {t("item.ownerHeading")}
        </h2>
        <p className="item-owner-name">
          <bdi>{item.ownerName}</bdi>{" "}
          {item.ownerVerified && (
            <span className="verified-badge">{t("item.verified")}</span>
          )}
        </p>
        {Number.isFinite(rating) && rating > 0 && (
          <p className="item-owner-rating">{t("item.rating", { rating })}</p>
        )}
      </div>
    </section>
  );
}

function ItemDetail({ item }: ItemProps): ReactElement {
  usePageTitle(t("title.item", { title: item.title }));
  // Read on every draw, so a new request shows at once
  const status = deriveItemStatus(item, getRequests(), todayISO());
  const isOwner = useCurrentUser().id === item.ownerId;

  return (
    <article className="item-detail" aria-labelledby="item-title">
      <a href="#/catalog" className="text-link item-back">
        <BackIcon /> {t("item.back")}
      </a>

      <div className="item-detail-layout">
        <div className="item-detail-media">
          {isSafeImageUrl(item.imageUrl) && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="item-detail-img"
            />
          )}
        </div>

        {/* One column, in reading order: what it is, who lends it, how to borrow it */}
        <div className="item-detail-info">
          <div className="item-detail-header">
            <p className="item-detail-category">
              {tValue("category", item.category)}
            </p>
            {/* <bdi>: owners write in any language, so the text keeps its own direction
                ("4-Person Tent" stays in order on the Arabic page) and the line keeps the page's alignment */}
            <h1 id="item-title" className="item-detail-title">
              <bdi>{item.title}</bdi>
            </h1>
            <p className="item-detail-description">
              <bdi>{item.description}</bdi>
            </p>
          </div>

          <OwnerCard item={item} />

          <aside className="booking-panel" aria-labelledby="booking-heading">
            <div className="booking-panel-head">
              <h2 id="booking-heading" className="item-subheading">
                {t("booking.depositHeading")}
              </h2>
              <p
                className={`item-card-badge status-${status.toLowerCase()} item-detail-status`}
              >
                {tValue("status", status)}
              </p>
            </div>
            <p className="booking-deposit">{formatMoney(item.depositAmount)}</p>
            <p className="booking-note">{t("booking.note")}</p>
            {isOwner ? (
              <p className="booking-owner-note">{t("booking.ownerNote")}</p>
            ) : (
              <BorrowForm item={item} />
            )}
          </aside>

          <section
            className="item-condition"
            aria-labelledby="condition-heading"
          >
            <h2 id="condition-heading" className="item-subheading">
              {t("item.conditionHeading", {
                condition: tValue("condition", item.condition),
              })}
            </h2>
            <p>
              <bdi>{item.conditionNotes}</bdi>
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

interface ItemDetailViewProps {
  /** Already checked by isValidItemId */
  itemId: string;
}

/** The item page: one item, or "not found" when no item has this id */
export function ItemDetailView({ itemId }: ItemDetailViewProps): ReactElement {
  const item = SEED_CARDS.find((candidate) => candidate.id === itemId);
  return item ? <ItemDetail item={item} /> : <ItemNotFound />;
}
