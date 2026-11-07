import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { photoUrl } from "./cardPhotos.ts";
import { fetchItem } from "./itemsApi.ts";
import { ItemDetail } from "./ItemDetail.tsx";
import { ItemNotFound } from "./ItemNotFound.tsx";
import { ItemPageStatus } from "./ItemPageStatus.tsx";
import { toItem } from "./itemMapper.ts";
import type { Item } from "./types.ts";
import type { ItemsState } from "./itemsStore.ts";

type ItemDetailState =
  | { itemId: string; status: "loading" }
  | { itemId: string; status: "error"; httpStatus: number }
  | { itemId: string; status: "not-found" }
  | { itemId: string; status: "success"; item: Item };

interface ItemDetailViewProps {
  /** Already checked by isValidItemId */
  itemId: string;
}

/**
 * The item page: loading or the error while the items come from the API,
 * then the item, or "not found" when no item has this id.
 */
export function ItemDetailView({ itemId }: ItemDetailViewProps): ReactElement {
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<ItemDetailState>({
    itemId,
    status: "loading",
  });

  useEffect(() => {
    let isCurrentRequest = true;

    void fetchItem(itemId).then((result) => {
      if (!isCurrentRequest) return;
      if (!result.ok) {
        setState(
          result.status === 404
            ? { itemId, status: "not-found" }
            : { itemId, status: "error", httpStatus: result.status },
        );
        return;
      }
      const item = toItem(result.data, photoUrl);
      setState(
        item
          ? { itemId, status: "success", item }
          : { itemId, status: "error", httpStatus: 0 },
      );
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [itemId, retryCount]);

  // A different id must never briefly show the previous id's response.
  const currentState =
    state.itemId === itemId ? state : { itemId, status: "loading" as const };
  const retry = (): void => {
    setState({ itemId, status: "loading" });
    setRetryCount((count) => count + 1);
  };

  if (currentState.status === "loading") {
    const loadingState: Exclude<ItemsState, { status: "success" }> = {
      status: "loading",
    };
    return <ItemPageStatus state={loadingState} onRetry={retry} />;
  }
  if (currentState.status === "error") {
    const errorState: Exclude<ItemsState, { status: "success" }> = {
      status: "error",
      httpStatus: currentState.httpStatus,
    };
    return <ItemPageStatus state={errorState} onRetry={retry} />;
  }
  if (currentState.status === "not-found") return <ItemNotFound />;
  return <ItemDetail item={currentState.item} />;
}
