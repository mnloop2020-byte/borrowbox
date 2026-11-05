/**
 * Data shapes for the users feature (the demo personas).
 * Types only: this file has no runtime code.
 */

export type UserRole = "Owner" | "Borrower" | "New Member";

/** A demo persona */
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarInitial: string;
  isVerified: boolean;
}
