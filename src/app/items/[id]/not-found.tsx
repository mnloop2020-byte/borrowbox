import type { ReactElement } from "react";
import { ItemNotFound } from "../../../features/cards/ItemNotFound.tsx";

/** /items/:id when no item has this id (notFound() in page.tsx) */
export default function ItemNotFoundPage(): ReactElement {
  return <ItemNotFound />;
}
