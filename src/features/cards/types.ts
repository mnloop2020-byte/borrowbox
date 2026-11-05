/**
 * Data shapes for the cards feature (the tools people lend).
 * Types only: this file has no runtime code.
 */
import type { Category } from "./categories.ts";

export type ItemStatus = "Available" | "Reserved" | "Unavailable";

/** A listed tool */
export interface Item {
  id: string;
  title: string;
  /** One of CATEGORIES (categories.ts): a typo is a TypeScript error */
  category: Category;
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
