import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { ArrowIcon } from "../../shared/ui/ArrowIcon.tsx";
import { AddToListButton } from "../borrow-list/AddToListButton.tsx";
import { ItemCard } from "../cards/ItemCard.tsx";
import { ItemsStatus } from "../cards/ItemsStatus.tsx";
import { listCards } from "../cards/listCards.ts";
import { useItems } from "../cards/useItems.ts";
import { FEATURED_ITEM_IDS } from "./homeContent.ts";

/**
 * The items in FEATURED_ITEM_IDS, from the API. Until they arrive: the
 * loading or error state.
 */
export function Featured(): ReactElement {
  const state = useItems();
  const items =
    state.status === "success"
      ? listCards(state.items).filter((item) =>
          FEATURED_ITEM_IDS.includes(item.id),
        )
      : [];
  return (
    <section
      className="home-section featured-section"
      aria-labelledby="featured-heading"
    >
      <div className="featured-header" data-reveal>
        <h2 id="featured-heading" className="section-title">
          {t("home.featured.title")}
        </h2>
        <a href="#/catalog" className="text-link">
          {t("home.featured.viewAll")} <ArrowIcon />
        </a>
      </div>
      {state.status !== "success" ? (
        <ItemsStatus state={state} />
      ) : (
        <div className="featured-grid" data-reveal-group>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              action={<AddToListButton item={item} />}
            />
          ))}
        </div>
      )}
    </section>
  );
}
