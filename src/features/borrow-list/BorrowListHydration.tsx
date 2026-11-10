"use client";
import { useEffect } from "react";
import { borrowListStore } from "./borrowListStore.ts";

/**
 * Reads the saved borrow list from localStorage once the app is in the
 * browser. It is an effect because localStorage is outside React and does
 * not exist on the server. Drawn once, in the root layout. Draws nothing.
 */
export function BorrowListHydration(): null {
  useEffect(() => {
    borrowListStore.rehydrate();
  }, []);
  return null;
}
