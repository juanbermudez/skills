#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USAGE = `usage:
  node stage.mjs <stage.tsx> [--out <file.html>] [--title <title>] [--look <look.css>]
  node stage.mjs --dir <guide-or-plan-directory>      bundle every stages/*.tsx for a guide build

A stage is a stageshow scene: a .tsx file whose default export renders a <Stage>.
Import the kit as "stageshow/kit". The stageshow skill must be installed and its
dependencies present (npm install in the stageshow skill folder).`;

export function findStageshowRoot() {
  const candidates = [
    process.env.STAGESHOW_ROOT,
    join(homedir(), ".agents", "skills", "stageshow"),
    join(homedir(), ".claude", "skills", "stageshow"),
    join(homedir(), ".codex", "skills", "stageshow"),
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (existsSync(join(candidate, "kit", "index.ts"))) return resolve(candidate);
  }
  throw new Error(
    `stageshow skill not found (checked ${candidates.join(", ")}). Install it with: npx skills add benjitaylor/skills --skill stageshow -g`,
  );
}

function loadEsbuild(root) {
  const require = createRequire(join(root, "package.json"));
  try {
    return require("esbuild");
  } catch {
    throw new Error(`stageshow dependencies are missing. Run: npm install --prefix "${root}"`);
  }
}

function kitAlias(root) {
  return {
    name: "stageshow-kit",
    setup(build) {
      build.onResolve({ filter: /^stageshow\/kit(\/.*)?$/ }, (args) => {
        const rest = args.path.slice("stageshow/kit".length);
        if (rest === "" || rest === "/") return { path: join(root, "kit", "index.ts") };
        const base = join(root, "kit", rest.slice(1));
        for (const suffix of ["", ".ts", ".tsx", ".css", "/index.ts", "/index.tsx"]) {
          if (existsSync(base + suffix) && extname(base + suffix) !== "") return { path: base + suffix };
        }
        return { path: base };
      });
    },
  };
}

const ASSET_URL = /new URL\((['"])([^'"]+)\1,\s*import\.meta\.url\)(\.href)?/g;

function assetUrls() {
  return {
    name: "asset-urls",
    setup(build) {
      build.onLoad({ filter: /\.(ts|tsx|js|jsx)$/ }, async (args) => {
        if (args.path.includes("node_modules")) return undefined;
        const { readFile } = await import("node:fs/promises");
        const source = await readFile(args.path, "utf8");
        if (!source.includes("import.meta.url")) return undefined;
        const imports = [];
        const contents = source.replace(ASSET_URL, (_match, _quote, path, href) => {
          const name = `__stageAsset${imports.length}`;
          imports.push(`import ${name} from ${JSON.stringify(path)};`);
          return href ? name : `new URL(${name})`;
        });
        return { contents: `${imports.join("\n")}\n${contents}`, loader: extname(args.path).slice(1), resolveDir: dirname(args.path) };
      });
    },
  };
}

async function bundle({ root, entryContents, resolveDir }) {
  const esbuild = loadEsbuild(root);
  const result = await esbuild.build({
    stdin: { contents: entryContents, resolveDir, loader: "tsx", sourcefile: "stage-entry.tsx" },
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: "es2020",
    minify: true,
    jsx: "automatic",
    outdir: "out",
    nodePaths: [join(root, "node_modules")],
    loader: { ".png": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl", ".svg": "dataurl", ".webp": "dataurl", ".woff2": "dataurl" },
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [kitAlias(root), assetUrls()],
    logLevel: "silent",
  });
  const js = result.outputFiles.find((file) => file.path.endsWith(".js"))?.text ?? "";
  const css = result.outputFiles.filter((file) => file.path.endsWith(".css")).map((file) => file.text).join("\n");
  return { js, css, warnings: result.warnings.map((warning) => warning.text) };
}

const escapeHtml = (value) => value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
const inlineSafe = (value) => value.replaceAll("</script", "<\\/script").replaceAll("</style", "<\\/style");

export async function buildStandalone({ file, out, title, look }) {
  const root = findStageshowRoot();
  const source = resolve(file);
  const lookImport = look ? `import ${JSON.stringify(resolve(look))};\n` : "";
  const entryContents = `${lookImport}import Scene from ${JSON.stringify(source)};
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("stage")).render(<Scene />);`;
  const { js, css, warnings } = await bundle({ root, entryContents, resolveDir: dirname(source) });
  const pageTitle = title ?? basename(source, extname(source));
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(pageTitle)}</title>
<style>
html,body{margin:0;min-height:100%;background:var(--stage-page,#fff)}
@media (prefers-color-scheme: dark){html,body{background:var(--stage-page-dark,#111)}}
body{display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box}
#stage{width:100%;max-width:1100px}
${inlineSafe(css)}
</style>
</head>
<body>
<div id="stage" data-stage="${escapeHtml(basename(source, extname(source)))}"></div>
<script>${inlineSafe(js)}</script>
</body>
</html>
`;
  const output = resolve(out ?? source.replace(/\.tsx?$/, ".html"));
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, html);
  return { output, bytes: Buffer.byteLength(html), warnings };
}

export function listStages(directory) {
  const stagesDir = join(directory, "stages");
  if (!existsSync(stagesDir)) return [];
  return readdirSync(stagesDir)
    .filter((name) => /\.tsx$/.test(name) && !name.startsWith("_"))
    .sort()
    .map((name) => ({ name: basename(name, ".tsx"), path: join(stagesDir, name) }));
}

export async function buildGuideStages(directory) {
  const stages = listStages(directory);
  if (stages.length === 0) return { js: "", css: "", names: [], warnings: [] };
  const root = findStageshowRoot();
  const lookFile = join(directory, "stages", "look.css");
  const lookImport = existsSync(lookFile) ? `import ${JSON.stringify(lookFile)};\n` : "";
  const imports = stages.map((stage, index) => `import Scene${index} from ${JSON.stringify(stage.path)};`).join("\n");
  const table = stages.map((stage, index) => `${JSON.stringify(stage.name)}: Scene${index}`).join(",\n  ");
  const entryContents = `${lookImport}${imports}
import { createRoot } from "react-dom/client";
const stages = {
  ${table}
};
const mount = () => {
  for (const host of document.querySelectorAll("[data-stage]")) {
    const Scene = stages[host.getAttribute("data-stage")];
    if (!Scene || host.dataset.stageMounted) continue;
    host.dataset.stageMounted = "true";
    createRoot(host).render(<Scene />);
  }
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
else mount();`;
  const { js, css, warnings } = await bundle({ root, entryContents, resolveDir: directory });
  return { js: inlineSafe(js), css: inlineSafe(css), names: stages.map((stage) => stage.name), warnings };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help")) {
    console.log(USAGE);
    process.exit(args.length === 0 ? 2 : 0);
  }
  const option = (name) => {
    const index = args.indexOf(name);
    return index === -1 ? undefined : args[index + 1];
  };
  const dir = option("--dir");
  if (dir) {
    const result = await buildGuideStages(resolve(dir));
    console.log(JSON.stringify({ status: "PASS", stages: result.names, jsBytes: result.js.length, cssBytes: result.css.length, warnings: result.warnings }));
    return;
  }
  const file = args.find((arg, index) => !arg.startsWith("--") && !args[index - 1]?.startsWith("--"));
  if (!file || !existsSync(file)) {
    console.error(file ? `stage not found: ${file}` : USAGE);
    process.exit(2);
  }
  const result = await buildStandalone({ file, out: option("--out"), title: option("--title"), look: option("--look") });
  console.log(JSON.stringify({ status: "PASS", input: relative(process.cwd(), resolve(file)), ...result }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message ?? error);
    process.exit(1);
  });
}
