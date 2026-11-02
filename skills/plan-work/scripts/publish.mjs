#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const USAGE = `usage: node publish.mjs <plan-directory> [--check] [--force]

  --check   validate plan.md and its component files; build and publish nothing
  --force   overwrite the live doc even when it was edited since the last publish`;

const REQUIRED_SECTIONS = ["Decision", "Context", "Requirements", "Out of scope", "Design", "How it works", "Stages", "Risks", "Verification", "Open questions"];
const REQUIRED_KEYS = ["title", "slug", "status", "decision", "ui"];
const STATUSES = ["draft", "proposed", "approved", "in-progress", "done", "dropped"];
const STAGE_FIELDS = ["Goal", "Success Criteria", "Tests", "Status"];
const BLOCK = /^::(stage|figure|guide|artifact)\{([^}]*)\}\s*$/;

export function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { settings: {}, body: source };
  const settings = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([a-z][a-z-]*):\s*(.*)$/);
    if (!pair) continue;
    let value = pair[2].trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    settings[pair[1]] = value === "true" ? true : value === "false" ? false : value;
  }
  return { settings, body: source.slice(match[0].length) };
}

export function parseAttributes(text) {
  const attributes = {};
  for (const pair of text.matchAll(/([a-z][a-z-]*)="([^"]*)"/g)) attributes[pair[1]] = pair[2];
  return attributes;
}

export function findBlocks(body) {
  return body.split("\n").flatMap((line, index) => {
    const match = line.match(BLOCK);
    return match ? [{ kind: match[1], attributes: parseAttributes(match[2]), line: index + 1 }] : [];
  });
}

export function blockKey(block) {
  return block.kind === "stage" ? `stage:${block.attributes.name}` : `${block.kind}:${block.attributes.src ?? block.attributes.id}`;
}

export function checkPlan(directory) {
  const problems = [];
  const planFile = join(directory, "plan.md");
  if (!existsSync(planFile)) return { problems: [`missing ${planFile}`], settings: {}, body: "", blocks: [] };
  const { settings, body } = parseFrontmatter(readFileSync(planFile, "utf8"));
  for (const key of REQUIRED_KEYS) if (settings[key] === undefined || settings[key] === "") problems.push(`frontmatter: missing ${key}`);
  if (settings.status && !STATUSES.includes(settings.status)) problems.push(`frontmatter: status must be one of ${STATUSES.join(", ")}`);
  if (settings.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(settings.slug)) problems.push("frontmatter: slug must be kebab-case");
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());
  let cursor = -1;
  for (const section of REQUIRED_SECTIONS) {
    const index = headings.indexOf(section);
    if (index === -1) problems.push(`section missing: ## ${section}`);
    else if (index < cursor) problems.push(`section out of order: ## ${section}`);
    else cursor = index;
  }
  const stagesText = body.split(/^## Stages$/m)[1]?.split(/^## /m)[0] ?? "";
  const stages = stagesText.split(/^### /m).slice(1);
  if (headings.includes("Stages") && stages.length === 0) problems.push("## Stages has no ### Stage entries");
  for (const stage of stages) {
    const name = stage.split("\n")[0].trim();
    for (const field of STAGE_FIELDS) if (!stage.includes(`**${field}**:`)) problems.push(`stage "${name}": missing **${field}**:`);
  }
  const blocks = findBlocks(body);
  for (const block of blocks) {
    if (block.kind === "stage") {
      if (!block.attributes.name) problems.push(`line ${block.line}: ::stage needs name="..."`);
      else if (!existsSync(join(directory, "stages", `${block.attributes.name}.tsx`))) problems.push(`line ${block.line}: stages/${block.attributes.name}.tsx not found`);
    } else if (block.kind === "artifact") {
      if (!block.attributes.id) problems.push(`line ${block.line}: ::artifact needs id="..."`);
    } else if (!block.attributes.src) problems.push(`line ${block.line}: ::${block.kind} needs src="..."`);
    else if (!existsSync(join(directory, block.attributes.src))) problems.push(`line ${block.line}: ${block.attributes.src} not found`);
  }
  if (settings.ui === true) {
    if (!blocks.some((block) => block.kind === "stage")) problems.push("ui: true but the plan has no ::stage block");
    if (!settings.look) problems.push("ui: true but frontmatter has no look");
    else if (!existsSync(join(directory, settings.look))) problems.push(`look file not found: ${settings.look}`);
    if (!settings.tokens) problems.push("ui: true but frontmatter has no tokens source");
  }
  const seen = new Set();
  for (const block of blocks) {
    const key = blockKey(block);
    if (seen.has(key)) problems.push(`line ${block.line}: ${key} appears twice`);
    seen.add(key);
  }
  return { problems, settings, body, blocks };
}

function bbCommand() {
  return process.env.BB_CLI || "bb";
}

function bb(args) {
  const result = spawnSync(bbCommand(), args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`bb ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function bbJson(args) {
  const output = bb([...args, "--json"]);
  try {
    return JSON.parse(output);
  } catch {
    throw new Error(`bb ${args.join(" ")} did not print JSON:\n${output}`);
  }
}

async function loadStageBuilder() {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "..", "..", "guide", "scripts", "stage.mjs"),
    join(homedir(), ".claude", "skills", "guide", "scripts", "stage.mjs"),
    join(homedir(), ".agents", "skills", "guide", "scripts", "stage.mjs"),
  ];
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) throw new Error("guide skill not found; stages are built by guide/scripts/stage.mjs. Install it with: npx skills@latest add juanbermudez/skills --skill guide -g");
  return import(pathToFileURL(found).href);
}

const normalize = (markdown) => markdown.replace(/\s+$/gm, "").trim();

function renderDoc(settings, body, artifactIds) {
  const header = `**Status:** ${settings.status} · **Decision:** ${settings.decision}`;
  const lines = body.split("\n").flatMap((line) => {
    const match = line.match(BLOCK);
    if (!match) return [line];
    const block = { kind: match[1], attributes: parseAttributes(match[2]) };
    const id = block.kind === "artifact" ? block.attributes.id : artifactIds[blockKey(block)];
    const embed = `::artifact{id="${id}"}`;
    return block.attributes.caption ? [embed, "", `*${block.attributes.caption}*`] : [embed];
  });
  return `${header}\n\n${lines.join("\n").trim()}\n`;
}

async function publish(directory, { force }) {
  const { problems, settings, body, blocks } = checkPlan(directory);
  if (problems.length) {
    console.error(problems.map((problem) => `  ${problem}`).join("\n"));
    throw new Error(`plan check failed with ${problems.length} problem(s); fix them before publishing`);
  }
  const stateFile = join(directory, ".plan-publish.json");
  const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, "utf8")) : { artifacts: {} };
  const space = settings.space || settings.title;

  if (state.docId && !force) {
    const current = bb(["drive", "doc", "read", state.docId]);
    if (state.published && normalize(current) !== normalize(state.published)) {
      throw new Error(`the live doc ${state.docId} was edited since the last publish. Read it with \`bb drive doc read ${state.docId}\`, fold the edits into plan.md, then publish again (or pass --force to overwrite them).`);
    }
  }

  const spaces = bbJson(["drive", "space", "list"]).spaces;
  if (!spaces.some((existing) => existing.name === space || existing.id === space)) bb(["drive", "space", "create", space]);

  const stageBuilder = blocks.some((block) => block.kind === "stage") ? await loadStageBuilder() : null;
  const artifactIds = { ...state.artifacts };
  const registered = [];
  for (const block of blocks) {
    if (block.kind === "artifact") continue;
    const key = blockKey(block);
    let file;
    let title;
    if (block.kind === "stage") {
      const name = block.attributes.name;
      file = join(directory, "stages", `${name}.html`);
      title = block.attributes.title ?? `${settings.title}: ${name}`;
      await stageBuilder.buildStandalone({
        file: join(directory, "stages", `${name}.tsx`),
        out: file,
        title,
        look: settings.look ? join(directory, settings.look) : undefined,
      });
    } else {
      file = join(directory, block.attributes.src);
      title = block.attributes.title ?? `${settings.title}: ${basename(file)}`;
    }
    const added = bbJson(["drive", "artifact", "add", file, "--title", title, "--type", "page", "--space", space]);
    artifactIds[key] = added.artifact.id;
    bb(["drive", "space", "add", space, added.artifact.id]);
    registered.push({ key, id: added.artifact.id, outcome: added.outcome });
  }

  const markdown = renderDoc(settings, body, artifactIds);
  const publishDir = join(directory, ".publish");
  mkdirSync(publishDir, { recursive: true });
  const docFile = join(publishDir, "doc.md");
  writeFileSync(docFile, markdown);
  let docId = state.docId;
  let directive;
  if (docId) {
    bb(["drive", "doc", "write", docId, "--file", docFile]);
    directive = `::studio-doc{id="${docId}"}`;
  } else {
    const created = bbJson(["drive", "doc", "create", "--space", space, "--title", settings.title, "--file", docFile]);
    docId = created.doc.id;
    directive = created.directive;
  }
  const published = bb(["drive", "doc", "read", docId]);
  writeFileSync(stateFile, `${JSON.stringify({ docId, space, artifacts: artifactIds, published }, null, 2)}\n`);
  return { docId, directive, space, artifacts: registered };
}

async function main() {
  const args = process.argv.slice(2);
  const directoryArg = args.find((arg) => !arg.startsWith("--"));
  if (!directoryArg || args.includes("--help")) {
    console.log(USAGE);
    process.exit(directoryArg ? 0 : 2);
  }
  const directory = resolve(directoryArg);
  if (args.includes("--check")) {
    const { problems, blocks } = checkPlan(directory);
    if (problems.length) {
      console.error(problems.map((problem) => `  ${problem}`).join("\n"));
      console.log(JSON.stringify({ status: "FAIL", problems: problems.length }));
      process.exit(1);
    }
    console.log(JSON.stringify({ status: "PASS", blocks: blocks.map(blockKey) }));
    return;
  }
  const result = await publish(directory, { force: args.includes("--force") });
  console.log(JSON.stringify({ status: "PASS", ...result }));
  console.log(result.directive);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message ?? error);
    process.exit(1);
  });
}
