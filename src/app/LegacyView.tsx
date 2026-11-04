import { useLayoutEffect, useRef } from "react";
import type { ReactElement } from "react";
import type { MountedView } from "../shared/types.ts";

interface LegacyViewProps {
  /** An old page function, e.g. (el) => mountCatalogView(el, "") */
  mount: (container: HTMLElement) => MountedView;
}

/**
 * Temporary bridge while the app moves to React: runs an old
 * mountXView() function inside a React component. Each page that is
 * rewritten as a component stops using it; then this file is deleted.
 */
export function LegacyView({ mount }: LegacyViewProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  // A layout effect runs before the browser paints, so the page appears in
  // one step, as it did before React
  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const view = mount(container);
    document.title = view.title;
    // React calls this before the next page mounts, or when this one leaves
    return view.cleanup;
  }, [mount]);

  return <div ref={ref} />;
}
