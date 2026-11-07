import { lazy, useMemo } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

/**
 * Keeps a route's lazy component stable during normal renders. A new lazy
 * component (and therefore a fresh loader call) is made only when its retry
 * token changes after the user requests a retry.
 */
export function useRetryableLazy<Props>(
  loader: () => Promise<{ default: ComponentType<Props> }>,
  retryToken: number,
): LazyExoticComponent<ComponentType<Props>> {
  return useMemo(() => lazy(loader), [loader, retryToken]);
}
