/**
 * The demo persona in use, kept in a cookie so the server knows it before
 * drawing a page (the Navbar name, the owner check on the item page and the
 * dashboard). Switching persona is the server action in actions.ts.
 */
import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { DEMO_USERS } from "./demoUsers.ts";
import type { User } from "./types.ts";

export const USER_COOKIE = "borrowbox_current_user_id";

/** The persona in the cookie; the first demo user when there is none or it is unknown */
export const getCurrentUser = cache(async (): Promise<User> => {
  const savedId = (await cookies()).get(USER_COOKIE)?.value;
  return DEMO_USERS.find((user) => user.id === savedId) ?? DEMO_USERS[0];
});
