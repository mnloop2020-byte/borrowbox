import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import type { Item } from "../../shared/types.ts";
import { showToast } from "../../shared/ui/toast.ts";
import { borrowListStore } from "./borrowListStore.ts";

interface AddToListButtonProps {
  item: Item;
}

/**
 * "Add to list" under an item card. One click adds the item once, or one
 * more day when it is already in the list; a toast says which.
 * A paused item ("Unavailable") cannot be added.
 */
export function AddToListButton({ item }: AddToListButtonProps): ReactElement {
  if (item.status === "Unavailable") {
    return (
      <button type="button" className="btn add-to-list-btn" disabled>
        {t("borrowList.unavailable")}
      </button>
    );
  }

  function handleClick(): void {
    borrowListStore.add(item.id);
    const entry = borrowListStore
      .getList()
      .find((row) => row.itemId === item.id);
    const days = entry ? entry.days : 1;
    showToast(
      days === 1
        ? t("borrowList.added", { title: item.title })
        : t("borrowList.addedDay", { title: item.title, days }),
    );
  }

  return (
    <button type="button" className="btn add-to-list-btn" onClick={handleClick}>
      {t("borrowList.add")}
      {/* Every card has this button, so the item name tells them apart */}
      <span className="visually-hidden">: {item.title}</span>
    </button>
  );
}
