import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { ErrorState } from "../../shared/ui/ErrorState.tsx";
import { LoadingState } from "../../shared/ui/LoadingState.tsx";
import type { ItemsState } from "./itemsStore.ts";
import { itemsStore } from "./useItems.ts";

interface ItemsStatusProps {
  /** The items state while there are no items to show yet */
  state: Exclude<ItemsState, { status: "success" }>;
}

/**
 * What a page shows before the items arrive: "Loading tools…", or the
 * error with "Try again". Every page that lists items uses it, so the
 * messages are the same everywhere.
 */
export function ItemsStatus({ state }: ItemsStatusProps): ReactElement {
  if (state.status === "loading") {
    return <LoadingState label={t("items.loading")} />;
  }
  return (
    <ErrorState
      title={t("items.errorTitle")}
      text={
        // 0: no answer at all. 502: during `npm run dev` Vite answers for the
        // API when the API is not running. Both mean "start the API".
        state.httpStatus === 0 || state.httpStatus === 502
          ? t("items.errorNoAnswer")
          : t("items.errorCode", { status: state.httpStatus })
      }
      onRetry={itemsStore.retry}
    />
  );
}
