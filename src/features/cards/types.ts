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

/**
 * One item exactly as the API sends it (GET /api/items). It is kept apart
 * from Item on purpose: the API is outside the app, so its text fields are
 * plain strings here, and toItem() (itemMapper.ts) checks every field before
 * the app trusts it. The API sends no photos; the app adds them.
 */
export interface ApiItem {
  id: string;
  title: string;
  category: string;
  description: string;
  condition: string;
  conditionNotes: string;
  depositAmount: number;
  ownerId: string;
  ownerName: string;
  ownerVerified: boolean;
  ownerRating: number;
  status: string;
  isManuallyPaused: boolean;
  createdAt: string;
}
