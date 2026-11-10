import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const filesIn = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
    .map((f) => `${dir}/${f.replaceAll("\\", "/")}`);

// Products come from the API: the item list lives in server/, and the app
// may only get it with GET /api/items. Importing it directly would skip
// the API, and the loading and error states would never be needed.
test("no file in src/ imports the item list or anything else from server/", () => {
  const found = filesIn("src").filter((file) =>
    /from "[^"]*(server\/|itemRecords)/.test(readFileSync(file, "utf8")),
  );
  assert.deepEqual(found, []);
});

// One component per file. A component is a function whose name starts with
// a capital letter (async for a server component).
//  - In src/features and src/shared, a .tsx file has exactly one, exported
//    with the file's name: ItemCard is in ItemCard.tsx. RetryBoundary is
//    made by Next.js catchError() from its one fallback function.
//  - In src/app, Next.js decides the file names (page.tsx, layout.tsx, ...),
//    so each file has exactly one component, the default export.
// Small helpers with lowercase names are fine.
const COMPONENT = /^(?:export )?(?:default )?(?:async )?function [A-Z]\w*/gm;

test("every .tsx file in src/ has one component, named like the file", () => {
  const wrong = filesIn("src")
    .filter((file) => file.endsWith(".tsx"))
    .filter((file) => {
      const code = readFileSync(file, "utf8");
      const count = (code.match(COMPONENT) ?? []).length;
      if (file.startsWith("src/app/")) {
        return count !== 1 || !/^export default (async )?function /m.test(code);
      }
      const exported =
        /^export (?:async )?function ([A-Z]\w*)/m.exec(code)?.[1] ??
        /^export const ([A-Z]\w*) = catchError\(/m.exec(code)?.[1];
      const fileName = file.split("/").at(-1)?.replace(".tsx", "");
      return count !== 1 || exported !== fileName;
    });
  assert.deepEqual(wrong, []);
});
