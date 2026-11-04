import { useEffect } from "react";

/**
 * Sets the browser tab title while a React page is on screen.
 * (Old pages return their title to LegacyView instead.)
 */
export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
