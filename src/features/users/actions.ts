"use server";
/**
 * Server action: switches the demo persona. Next.js draws the page again
 * after the cookie changes, so every part shows the new persona.
 */
import { cookies } from "next/headers";
import { DEMO_USERS } from "./demoUsers.ts";
import { USER_COOKIE } from "./currentUser.ts";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** @param userId - from the browser, so it is checked against DEMO_USERS */
export async function switchPersona(userId: unknown): Promise<void> {
  const user = DEMO_USERS.find((candidate) => candidate.id === userId);
  if (!user) return;
  (await cookies()).set(USER_COOKIE, user.id, {
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
    path: "/",
  });
}
