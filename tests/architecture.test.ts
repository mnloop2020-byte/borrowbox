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
