/**
 * Shared data shapes for BorrowBox.
 * Types only: this file has no runtime code.
 */

export type Lang = "en" | "ar";

export type ItemStatus = "Available" | "Reserved" | "Unavailable";

export type UserRole = "Owner" | "Borrower" | "New Member";

/** A listed tool */
export interface Item {
  id: string;
  title: string;
  category: string;
  description: string;
  condition: string;
  conditionNotes: string;
  conditionImages: string[];
  depositAmount: number;
  ownerId: string;
  ownerName: string;
  ownerVerified: boolean;
  ownerRating: number;
  status: ItemStatus;
  isManuallyPaused: boolean;
  imageUrl: string;
  createdAt: string;
}

/** A demo persona */
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarInitial: string;
  isVerified: boolean;
}

/** A borrow request. Dates are "YYYY-MM-DD" strings. */
export interface BorrowRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  borrowerId: string;
  borrowerName: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  depositAmount: number;
  /** e.g. "Pending Approval", "Active", "Disputed" */
  status: string;
  depositStatus: string;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  expiredAt: string | null;
  handedOverAt: string | null;
  cancelledAt: string | null;
  returnedAt: string | null;
  inspectedAt: string | null;
  preHandoverNotes: string;
  preHandoverImages: string[];
  postReturnNotes: string;
  cancellationReason: string | null;
  issueDescription: string | null;
  issueImages: string[];
}
