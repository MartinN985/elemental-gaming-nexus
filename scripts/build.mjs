import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const entries = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "_redirects",
  "assets",
  "shows",
  "listen",
  "go",
  "borislov",
  "terminal"
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of entries) {
  await cp(path.join(root, entry), path.join(dist, entry), { recursive: true });
}

// Explicitly keep terminal/.nojekyll — some copy/glob tools skip dotfiles.
const nojekyllSrc = path.join(root, "terminal", ".nojekyll");
const nojekyllDest = path.join(dist, "terminal", ".nojekyll");
await cp(nojekyllSrc, nojekyllDest);

console.log("Built static site into dist/");
