# Plan format

A plan is one Markdown file, `plans/<slug>/plan.md`, with frontmatter settings, fixed sections, and component blocks for visuals. The same file is what plan mode shows for approval and what `publish.mjs` turns into a bb Drive doc.

## Frontmatter settings

```yaml
---
title: Assign leads from the inbox
slug: inbox-lead-assignment
status: draft
decision: Ship lead assignment in the inbox list, behind the lead-routing flag, before building auto-routing.
ui: true
look: stages/look.css
tokens: apps/app/src/components/ui/theme.css
space: Inbox lead assignment
---
```

| Key | Required | Meaning |
|---|---|---|
| `title` | yes | Literal title. Becomes the doc title. |
| `slug` | yes | Kebab-case folder name. |
| `status` | yes | `draft`, `proposed`, `approved`, `in-progress`, `done` or `dropped`. |
| `decision` | yes | The one judgment the reviewer makes, as one sentence. |
| `ui` | yes | `true` when the plan adds or changes UI. Then at least one `::stage` is required. |
| `look` | when `ui: true` | Stageshow look file mapped from the product's tokens, relative to the plan folder. Reused by every stage. |
| `tokens` | when `ui: true` | The source the look was mapped from, relative to the repository root. |
| `space` | no | bb Drive space for the doc and its artifacts. Defaults to the title. |

## Sections

Keep these `##` sections in this order. A section that does not apply says why in one line instead of disappearing.

1. **Decision.** The decision sentence, then what approval commits to and what it doesn't.
2. **Context.** Why now, with sources: files and lines, commands and their output, threads, docs.
3. **Requirements.** Numbered, testable. Mark each one as `must` or `should`.
4. **Out of scope.** What this plan deliberately leaves alone.
5. **Design.** What the user sees: a stage for every screen or flow that changes, each followed by one paragraph naming what changed and why.
6. **How it works.** What happens behind the UI: a stage for any flow, state or sequence that changes, plus the data, APIs and boundaries it touches.
7. **Stages.** Three to five stages, each shippable alone, in the format below.
8. **Risks.** Each risk with its likelihood, impact, and the guard or test that catches it.
9. **Verification.** How the finished work is proven: tests, commands, and for UI the real screen filmed at the stage's widths and compared with the stage.
10. **Open questions.** Questions a person must answer, each with a recommended answer.

## Stages

```markdown
### Stage 1: Lead assignment API
**Goal**: The server accepts and stores an assignee for a lead.
**Success Criteria**: `PATCH /leads/:id` stores the assignee and emits `lead.assigned`.
**Tests**: Route test for a valid assignee, an unknown user, and a lead in another dealership.
**Status**: Not Started
```

`Status` is `Not Started`, `In Progress` or `Complete`. A stage of work that changes UI names the `::stage` visual it must match in its success criteria.

## Component blocks

A component block is one line on its own: a leaf directive with quoted attributes.

| Block | Builds from | Becomes |
|---|---|---|
| `::stage{name="inbox-assign" title="Assign from the inbox"}` | `stages/inbox-assign.tsx` (stageshow) | A standalone page artifact, embedded |
| `::figure{src="figures/rate-explorer.html" title="Rate explorer"}` | an animated-visuals explorable plate | A page artifact, embedded |
| `::guide{src="guide/index.html" title="How routing works"}` | a guide-skill build | A page artifact, embedded |
| `::artifact{id="art_1a2b3c4d5e6f"}` | an existing Drive artifact | Embedded as is |

Optional attributes: `title` (the artifact's title; defaults to the name or file), `caption` (one italic line under the embed). Write the caption as the claim the visual proves.

Put each block right after the paragraph it supports, never in a gallery at the end. A before-and-after pair is two stages, `<name>-before` and `<name>-after`, with the same stage size and crop.

In plan mode, write the blocks for what you will build; the files do not exist yet. `publish.mjs --check` enforces them after approval.

## What publishing writes

- The doc: frontmatter becomes a one-line status header, sections stay as written, each block becomes `::artifact{id="..."}` plus its caption.
- `plans/<slug>/.plan-publish.json`: the doc id, the space, each block's artifact id, and the Markdown last published. Commit it with the plan so the next publish updates the same doc and artifacts instead of creating new ones.
- `stages/*.html`: built pages, ignored by git.
