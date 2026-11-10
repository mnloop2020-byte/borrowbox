import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { isSafeImageUrl } from "../../shared/lib/imageUrl.ts";
import { BackIcon } from "../../shared/ui/BackIcon.tsx";
import { BorrowForm } from "../requests/BorrowForm.tsx";
import { getCurrentUser } from "../users/currentUser.ts";
import { OwnerCard } from "./OwnerCard.tsx";
import type { Item } from "./types.ts";

interface ItemDetailProps {
  item: Item;
}

/** One item: photo, details, deposit, owner and the borrow form */
export async function ItemDetail({
  item,
}: ItemDetailProps): Promise<ReactElement> {
  const { t, tValue, formatMoney, lang } = await getI18n();
  const currentUser = await getCurrentUser();
  const isOwner = currentUser.id === item.ownerId;

  return (
    <article className="item-detail" aria-labelledby="item-title">
      <Link href="/catalog" className="text-link item-back">
        <BackIcon /> {t("item.back")}
      </Link>

      <div className="item-detail-layout">
        <div className="item-detail-media">
          {isSafeImageUrl(item.imageUrl) && (
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={800}
              height={800}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="item-detail-img"
              loading="eager"
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
                className={`item-card-badge status-${item.status.toLowerCase()} item-detail-status`}
              >
                {tValue("status", item.status)}
              </p>
            </div>
            <p className="booking-deposit">{formatMoney(item.depositAmount)}</p>
            <p className="booking-note">{t("booking.note")}</p>
            {isOwner ? (
              <p className="booking-owner-note">{t("booking.ownerNote")}</p>
            ) : (
              <BorrowForm item={item} borrower={currentUser} lang={lang} />
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
