/**
 * Keeps what the user typed when a view re-renders (the language switch
 * rebuilds the page). Values are keyed by element id. Passwords and files
 * are never copied.
 */

/** Elements that hold a typed value */
type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Reads every field with an id inside root */
export function snapshotFields(root: HTMLElement): Map<string, string> {
  const values = new Map<string, string>();
  root
    .querySelectorAll<FormField>("input[id], select[id], textarea[id]")
    .forEach((el) => {
      if (el.type === "password" || el.type === "file") return;
      values.set(el.id, el.value);
    });
  return values;
}

/** Puts the saved values back into the fields that still exist */
export function restoreFields(
  root: HTMLElement,
  values: Map<string, string>,
): void {
  values.forEach((value, id) => {
    const el = root.querySelector<FormField>(`#${CSS.escape(id)}`);
    if (el) el.value = value;
  });
}
