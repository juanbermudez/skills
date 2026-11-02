---
name: plan-work
description: Plan a feature, change, migration or research effort and publish it as a reviewable plan artifact. Use when asked to plan, spec, scope, design or break down work; when entering or leaving plan mode; when writing an implementation plan, roadmap, rollout or decision record; or when a plan needs UI mocks, how-it-works diagrams or a bb Drive doc. Its visuals follow stageshow's method: every UI change ships a stageshow stage styled from the product's real tokens, and every behavior change ships a stageshow stage of the flow (an animated-visuals explorable only when the reviewer must operate it).
license: MIT
metadata: { author: Juan Bermudez, version: 0.1.0, requires: guide animated-visuals stageshow studio }
---

# Plan Work

Turn a request into one plan a reviewer can approve in minutes: the decision in one sentence, the evidence, what the user will see, how it works, and stages small enough to ship one at a time. The plan is Markdown with component blocks; publishing turns it into a bb Drive doc with its stageshow visuals embedded beside the prose. In this skill, **Stages** (capitalized, in the plan) are units of work; a **stageshow stage** (`::stage`, `stages/`) is a visual.

## Plan mode

Claude Code's built-in plan mode (`/plan`, or Shift+Tab) and this skill work together. Plan mode keeps the session read-only until the user approves; this skill decides what the plan says and how it is published.

- **In plan mode:** research read-only, then write the plan in the [plan format](references/plan-format.md) into the plan file plan mode gives you, with `::stage` and `::figure` blocks naming what will be built. Call ExitPlanMode with that plan. Build nothing yet.
- **After approval,** or when the skill is invoked outside plan mode: scaffold the plan folder, build the stageshow stages and figures, check, and publish (steps 5 to 8 below), then start Stage 1.
- **Codex, Cursor and other agents** have no plan mode: write and publish the plan, then stop for approval before implementing.

## Workflow

### 1. Discover

Read the repository instructions (AGENTS.md, CLAUDE.md), the code the change touches, and earlier work: `bb drive search "<words>"`, `bb thread search "<words>"`, existing `plans/`. Never say something has not been planned before searching.

### 2. State the decision

Write the one judgment the reviewer must make as one literal sentence. If it can't be written, ask the user before planning further.

### 3. Inventory

Separate requirements, accepted decisions, evidence, assumptions, open questions and exclusions. Every factual claim names its source: a file and line, a command's output, a doc, a thread. Label anything unverified.

### 4. Decide the visuals

Visuals are part of the plan, not decoration, and they follow **stageshow**'s method: plan the place, focal object, action and payoff first; start from its closest gold example; real words only where the decision is; every motion has a cause; film and read every frame. Each visual is a stageshow stage by default.

| The plan... | It must include |
|---|---|
| Adds or changes a screen, control, dialog, menu, empty state or flow | A stageshow **stage** of each, before and after for a change |
| Explains how someone uses a feature | A stageshow **stage** with a cursor walking the beats |
| Changes how a system, pipeline, protocol or agent behaves | A stageshow **stage** of the flow without a cursor (gold: `payout-flow`, `subscriptions`, `story`) |
| Compares options with numbers | A stageshow **stage** with a chart (gold: `chart-scrub`); an animated-visuals explorable only if the reviewer must change an input |
| Needs a long explanation a reviewer will reread | A **guide** built with the guide skill, linked from the plan |
| Is backend-only with no behavior worth drawing | No visuals; say so in the Design section |

Plan every diagram with the plan block in animated-visuals' `references/diagram-method.md` (claim, focal path, beats, poster, gold) before building it; product screens follow stageshow's own workflow. Style every stage from the product's real tokens, never an invented palette. Find them once per product (in bb and its forks: `apps/app/src/components/ui/theme.css` and `packages/shared-ui/src/components/ui/`), map them to a stageshow look file and reuse it. The guide skill's `references/stages.md` has the procedure.

### 5. Scaffold

```sh
node <plan-work-skill>/scripts/new.mjs <slug> [--path plans/<slug>]
```

It writes `plan.md` from the [template](assets/plan.md), `stages/`, `figures/` and a `.gitignore` for build output. Fill `plan.md` following [references/plan-format.md](references/plan-format.md).

### 6. Build the components

- **Stages:** one `stages/<name>.tsx` per `::stage{name="..."}`, built with stageshow's workflow: copy its closest gold example, keep its framing, swap in the product's look and words. Film each with stageshow's `film.mjs` (`--still`, `--states --gate`, `--width 390 --gate`), read every frame, then compare the still with the gold you copied.
- **Figures:** one standalone HTML per `::figure{src="..."}`, only for animated-visuals explorables, planned and reviewed the same way.
- **Guides:** built with the guide skill, which also mounts the plan's stages when it reuses `stages/`.

### 7. Check

```sh
node <plan-work-skill>/scripts/publish.mjs plans/<slug> --check
```

It fails on a missing required section, a stage without its four fields, a `::stage` without its `.tsx`, a `::figure` without its file, and a `ui: true` plan with no stage.

### 8. Publish

```sh
node <plan-work-skill>/scripts/publish.mjs plans/<slug>
```

It builds every stage into a standalone page, registers stages and figures as bb Drive artifacts in the plan's space, replaces each component block with its `::artifact{id="..."}` embed, and creates or updates the plan's live doc. Put the printed `::studio-doc{...}` line on its own in your reply.

`plan.md` is the source while you draft. Once published, people comment and edit in the live doc; before republishing, the script compares the doc with what it last published and stops if someone changed it. Read the doc, fold their edits into `plan.md`, then run again (or pass `--force` only when the user says to overwrite).

### 9. Hand off

Report the doc, the artifacts, what was verified (and at which widths), and what was not. Use these states literally: **planned** (in the plan), **built** (artifact exists), **verified** (filmed or browser-checked), **published** (in Drive), **approved** (a human said so), **implemented**, **live**. Never claim a stronger state than the evidence shows.

## Executing the plan

Work stage by stage. Update each stage's **Status** in `plan.md` as it moves, republish at the end of each stage, and keep each UI stage as its visual acceptance check: when the real UI ships, film the real screen at the same width and compare it with the stage before marking the work complete.

## Language

Literal, specific titles and headings: "Assign leads from the inbox", not "Unlocking faster follow-up". No slogans, metaphors or rhetorical questions. Name things the way the product names them.

## References

- [references/plan-format.md](references/plan-format.md) — frontmatter settings, required sections, component blocks, and stage fields.
- [assets/plan.md](assets/plan.md) — the template `new.mjs` copies.
- guide skill `references/stages.md` — stageshow stages: medium, looks from real tokens, writing, placing, building and filming.
- stageshow skill — the method for every visual, gold examples, filming.
- animated-visuals skill — claims, data honesty, and explorable figures.
- studio skill — bb Drive docs, artifacts and spaces.
