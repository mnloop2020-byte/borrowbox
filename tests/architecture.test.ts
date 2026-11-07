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

// One component per file: a .tsx file declares exactly one exported function
// or class whose name starts with a capital letter (a component). It has the
// file's name, so ItemCard is in ItemCard.tsx. Small helpers are fine.
test("every .tsx file in src/ has one component, named like the file", () => {
  const wrong = filesIn("src")
    .filter((file) => file.endsWith(".tsx") && !file.endsWith("main.tsx"))
    .filter((file) => {
      const code = readFileSync(file, "utf8");
      const functions = code.match(/^(export )?function [A-Z]\w*/gm) ?? [];
      const classes = code.match(/^(export )?class [A-Z]\w*/gm) ?? [];
      const all = [...functions, ...classes];
      const exported =
        /^export function ([A-Z]\w*)/m.exec(code)?.[1] ??
        /^export class ([A-Z]\w*)/m.exec(code)?.[1];
      const fileName = file.split("/").at(-1)?.replace(".tsx", "");
      return all.length !== 1 || exported !== fileName;
    });
  assert.deepEqual(wrong, []);
});
