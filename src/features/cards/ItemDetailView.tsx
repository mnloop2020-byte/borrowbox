import type { ReactElement } from "react";
import { ItemDetail } from "./ItemDetail.tsx";
import { ItemNotFound } from "./ItemNotFound.tsx";
import { ItemPageStatus } from "./ItemPageStatus.tsx";
import { useItems } from "./useItems.ts";

interface ItemDetailViewProps {
  /** Already checked by isValidItemId */
  itemId: string;
}

/**
 * The item page: loading or the error while the items come from the API,
 * then the item, or "not found" when no item has this id.
 */
export function ItemDetailView({ itemId }: ItemDetailViewProps): ReactElement {
  const state = useItems();
  if (state.status !== "success") return <ItemPageStatus state={state} />;
  const item = state.items.find((candidate) => candidate.id === itemId);
  return item ? <ItemDetail item={item} /> : <ItemNotFound />;
}
