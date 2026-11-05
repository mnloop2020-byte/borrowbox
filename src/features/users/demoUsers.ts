import type { User } from "../../shared/types.ts";

/**
 * Pre-configured Demo Personas for BorrowBox MVP
 */
export const DEMO_USERS: User[] = [
  {
    id: "user-1",
    name: "Sarah Jenkins",
    role: "Owner",
    email: "sarah.jenkins@example.com",
    avatarInitial: "S",
    isVerified: true,
  },
  {
    id: "user-2",
    name: "Alex Mercer",
    role: "Borrower",
    email: "alex.mercer@example.com",
    avatarInitial: "A",
    isVerified: true,
  },
  {
    id: "user-3",
    name: "Elena Rostova",
    role: "New Member",
    email: "elena.rostova@example.com",
    avatarInitial: "E",
    isVerified: false,
  },
];
