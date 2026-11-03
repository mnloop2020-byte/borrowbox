import type { User } from "../types.ts";
import { DEMO_USERS } from "./demoUsers.ts";

const CURRENT_USER_KEY = "borrowbox_current_user_id";

/**
 * Demo User Store managing active persona in localStorage
 */
export const userStore = {
  getUsers(): User[] {
    return DEMO_USERS;
  },

  getCurrentUser(): User {
    const savedId = localStorage.getItem(CURRENT_USER_KEY);
    const user = DEMO_USERS.find((u) => u.id === savedId);
    return user || DEMO_USERS[0];
  },

  setCurrentUser(userId: string | null): void {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      window.dispatchEvent(
        new CustomEvent("borrowbox:userchange", { detail: user }),
      );
    }
  },
};
