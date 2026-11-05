import type { User } from "./types.ts";
import { DEMO_USERS } from "./demoUsers.ts";

const CURRENT_USER_KEY = "borrowbox_current_user_id";
const listeners = new Set<() => void>();

/**
 * The demo personas and the one in use, saved in localStorage.
 * useCurrentUser() reads it from React and draws again after a switch.
 */
export const userStore = {
  getUsers(): User[] {
    return DEMO_USERS;
  },

  /** The same object for the same persona, so React sees no change until a switch */
  getCurrentUser(): User {
    const savedId = localStorage.getItem(CURRENT_USER_KEY);
    const user = DEMO_USERS.find((u) => u.id === savedId);
    return user || DEMO_USERS[0];
  },

  setCurrentUser(userId: string | null): void {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      listeners.forEach((listener) => listener());
    }
  },

  /**
   * Calls `listener` after every persona switch.
   *
   * @returns a function that stops the calls
   */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
