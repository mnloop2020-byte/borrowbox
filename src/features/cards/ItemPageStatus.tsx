import type { ReactElement } from "react";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { t } from "../../shared/i18n/i18n.ts";
import type { ItemsState } from "./itemsStore.ts";
import { ItemsStatus } from "./ItemsStatus.tsx";

interface ItemPageStatusProps {
  state: Exclude<ItemsState, { status: "success" }>;
  onRetry: () => void;
}

/**
 * The item page before the items arrive. The page still needs its one h1
 * (hidden, read by screen readers); under it, loading or the error.
 */
export function ItemPageStatus({
  state,
  onRetry,
}: ItemPageStatusProps): ReactElement {
  usePageTitle(t("title.itemLoading"));
  return (
    <section className="item-detail" aria-labelledby="page-title">
      <h1 id="page-title" className="visually-hidden">
        {t("item.pageHeading")}
      </h1>
      <ItemsStatus state={state} onRetry={onRetry} />
    </section>
  );
}
