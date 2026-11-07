import { readdir } from "node:fs/promises";

const testFiles = (await readdir(new URL(".", import.meta.url)))
  .filter((file) => /\.test\.tsx?$/.test(file))
  .sort();

await Promise.all(testFiles.map((file) => import(`./${file}`)));
