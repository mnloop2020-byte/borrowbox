import Link from "next/link";
import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import type { Category } from "../cards/categories.ts";
import { catalogHref } from "./catalogParams.ts";
import type { CatalogParams } from "./catalogParams.ts";

interface FilterChipsProps {
  filters: CatalogParams;
  /** The categories that have items (from the data) */
  categories: Category[];
}

/** "All" plus one chip per category. The chosen one is marked for screen readers too. */
export async function FilterChips({
  filters,
  categories,
}: FilterChipsProps): Promise<ReactElement> {
  const { t, tValue } = await getI18n();
  // "" is "All". The type keeps "" and the category names exact (not string).
  const chips: { category: Category | ""; label: string }[] = [
    { category: "", label: t("catalog.all") },
    ...categories.map((name) => ({
      category: name,
      label: tValue("category", name),
    })),
  ];
  return (
    <ul className="filter-chips" aria-label={t("catalog.filtersLabel")}>
      {chips.map(({ category, label }) => (
        <li key={category || "all"}>
          {/* A chip changes the category and keeps the search and the sort */}
          <Link
            href={catalogHref({ ...filters, category })}
            className="filter-chip"
            aria-current={category === filters.category ? "true" : undefined}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
