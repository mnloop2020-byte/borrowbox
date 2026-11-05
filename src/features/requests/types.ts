/**
 * Data shapes for borrow requests.
 * Types only: this file has no runtime code.
 */

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
