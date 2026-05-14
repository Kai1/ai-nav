/**
 * Copy all article HTML files from the old static site to public/articles/
 * Run once: node scripts/copy-articles.js
 */
const { copyFileSync, mkdirSync, readdirSync, existsSync } = require("fs");
const { join } = require("path");

const src = join(__dirname, "../../ai-nav/articles");
const dest = join(__dirname, "../public/articles");

if (!existsSync(src)) {
  console.error("❌ Source not found:", src);
  process.exit(1);
}

mkdirSync(dest, { recursive: true });

const files = readdirSync(src).filter(f => f.endsWith(".html"));
let copied = 0;

for (const file of files) {
  copyFileSync(join(src, file), join(dest, file));
  copied++;
}

console.log(`✅ Copied ${copied} article HTML files to public/articles/`);
