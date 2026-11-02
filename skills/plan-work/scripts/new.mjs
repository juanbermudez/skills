#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const slug = args.find((arg, index) => !arg.startsWith("-") && args[index - 1] !== "--path");
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("usage: node new.mjs <kebab-case-slug> [--path <directory>]   (default: plans/<slug>)");
  process.exit(2);
}
const pathIndex = args.indexOf("--path");
const destination = resolve(pathIndex >= 0 ? args[pathIndex + 1] : join("plans", slug));
if (existsSync(destination) && readdirSync(destination).length) {
  console.error(`refusing to overwrite non-empty directory: ${destination}`);
  process.exit(1);
}
const title = slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
mkdirSync(join(destination, "stages"), { recursive: true });
mkdirSync(join(destination, "figures"), { recursive: true });
const plan = readFileSync(join(here, "..", "assets", "plan.md"), "utf8").replaceAll("__SLUG__", slug).replaceAll("__TITLE__", title);
writeFileSync(join(destination, "plan.md"), plan);
writeFileSync(join(destination, ".gitignore"), "stages/*.html\nshots/\n.publish/\n");
console.log(JSON.stringify({ status: "PASS", slug, directory: destination, files: ["plan.md", "stages/", "figures/", ".gitignore"] }));
