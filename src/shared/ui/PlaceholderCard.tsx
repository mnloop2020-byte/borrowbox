import type { ReactElement, ReactNode } from "react";
import { t } from "../i18n/i18n.ts";
import { BackIcon } from "./BackIcon.tsx";

/** The button under the text */
interface PlaceholderAction {
  href: string;
  label: string;
  /** Optional icon shown before the label */
  icon?: ReactNode;
}

interface PlaceholderCardProps {
  title: string;
  text: string;
  /** The button; "Back to home" when left out */
  action?: PlaceholderAction;
}

/**
 * The centred card shown by pages that are not built yet and by "not found"
 * pages: an h1, one paragraph and one button.
 */
export function PlaceholderCard({
  title,
  text,
  action,
}: PlaceholderCardProps): ReactElement {
  const button = action ?? {
    href: "#/",
    label: t("page.backHome"),
    icon: <BackIcon />,
  };
  return (
    <section className="placeholder-view" aria-labelledby="page-title">
      <h1 id="page-title">{title}</h1>
      <p>{text}</p>
      <p className="placeholder-actions">
        <a href={button.href} className="btn btn-primary">
          {button.icon} {button.label}
        </a>
      </p>
    </section>
  );
}
