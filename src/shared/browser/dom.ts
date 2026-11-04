/**
 * Finds an element that must exist and returns it with the right type.
 * querySelector returns `Element | null`; when the HTML was just written by
 * the same function, "null" means a bug, so this throws a clear error
 * instead of letting `null.addEventListener` fail later.
 *
 * @param root - where to search
 * @param selector - a CSS selector, e.g. "#register-form"
 */
export function getElement<T extends Element = HTMLElement>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}
