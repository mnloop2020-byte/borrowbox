import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import type { Item } from "./types.ts";

interface OwnerCardProps {
  item: Item;
}

/** Who lends the item: the trust details that sit under the title */
export async function OwnerCard({
  item,
}: OwnerCardProps): Promise<ReactElement> {
  const { t } = await getI18n();
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
