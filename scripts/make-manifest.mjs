// Run this script whenever you add/replace images:
// node scripts/make-manifest.mjs

import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "recipes");
const files = (await readdir(dir))
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const pages = files.map((f) => `/recipes/${f}`);
await writeFile(
  join(process.cwd(), "src", "data", "pages.json"),
  JSON.stringify(pages, null, 2)
);
console.log(`Wrote ${pages.length} pages to src/data/pages.json`);
