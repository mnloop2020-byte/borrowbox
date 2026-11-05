import { useSyncExternalStore } from "react";
import type { User } from "./types.ts";
import { userStore } from "./userStore.ts";

/** The demo persona in use. A component that calls it draws again after a switch. */
export function useCurrentUser(): User {
  return useSyncExternalStore(userStore.subscribe, userStore.getCurrentUser);
}
