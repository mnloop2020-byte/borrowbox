# Debugging log

Real bugs I hit while building the Day 2 parts: search, filter, sort and the borrow list.

## Bug 1

- **What I saw:** I searched for "DRILL" and got two results: the drill, and also "Compact Cordless Screwdriver".
- **Type:** logic
- **How I found it:** A browser check script that searches the catalog and checks every result has the word in its name. That check failed.
- **Cause:** `src/features/catalog/catalogFilter.ts`, line 24: the search looked in `${item.title} ${item.description} ${item.category}`. The screwdriver's description says "drill", so it matched. The task says search the name only.
- **Fix:** Search `item.title` only. I wrote the test first ("search matches the item name only"), watched it fail, then changed the code.
- **Did I use AI? For what?** Yes. Claude wrote the browser check script and spotted the result. I compared it with the task text, which says "whose name matches".

## Bug 2

- **What I saw:** After I added the "My list" link to the header, the menu button (☰) was cut off on some phone widths. On a tablet in English, the language button and the profile button went outside the bar.
- **Type:** runtime (CSS layout)
- **How I found it:** The screenshots at 320px. My check "no sideways scroll" said everything was fine, because the header hides what sticks out. So I checked every width from 320px to 1310px, 10px at a time: it broke at 420–440px and at 770–870px.
- **Cause:** `src/style.css`: the brand name showed from `min-width: 420px` (line 2132) and the menu links moved into the bar from `min-width: 768px` (line 585). With the new link, there was not enough room at those widths.
- **Fix:** Show the brand name from 450px and the menu links from 900px (below that they stay in the ☰ menu). After the fix, all widths passed in English and Arabic.
- **Did I use AI? For what?** Yes, for the width check script and to find the two widths. I checked the screenshots myself.

## Bug 3

- **What I saw:** I added a wider padding for the "My list" link from 450px, but it never changed on bigger screens.
- **Type:** logic
- **How I found it:** Reading `style.css` again after the change: the `@media` rule was above the normal rule for the same class.
- **Cause:** `src/style.css`: `@media (min-width: 450px) { .nav-list-link { … } }` came before the base `.nav-list-link { … }`. Both have the same specificity, so the rule that comes later wins, and the base rule always won.
- **Fix:** Move the `@media` rule below the base rule (now line 2481).
- **Did I use AI? For what?** Yes. Claude wrote the CSS and caught its own mistake before the commit.

## Bug 4

- **What I saw:** My test "one click adds one item, even after many subscribe/unsubscribe cycles" passed even when I broke the unsubscribe on purpose.
- **Type:** logic (in the test)
- **How I found it:** I broke the code on purpose (`unsubscribe` that does nothing) to make sure the test can fail. It still passed.
- **Cause:** `tests/borrowList.test.ts`, line 155: the old listeners in the loop were empty functions `() => {}`. Even if they were never removed, they counted nothing, so the test could not see them.
- **Fix:** The old listeners count their calls (`staleCalls++`), and the test checks `staleCalls` is 0. Now breaking the unsubscribe makes the test fail.
- **Did I use AI? For what?** Yes, Claude wrote the test. Breaking the code on purpose is our rule "Make sure a check can fail before trusting it".

## Bug 5

- **What I saw:** My browser checks said the Arabic pages passed, but the screenshots were in English.
- **Type:** state
- **How I found it:** I printed `document.documentElement.lang` on each page in the check script. It said `en`.
- **Cause:** The script saved "ar" in `localStorage`, then moved to another page by changing only the `#`. A hash change does not load the page again, and the app reads the saved language only when the page loads (`readStoredLang()` in `src/shared/i18n/i18n.ts`). So the language in memory stayed English.
- **Fix:** Load the page again after saving the language, and check the page language in the script so this cannot pass silently again.
