# Figures are stageshow stages

Every figure in a guide follows **stageshow**'s method, and by default it is built as a stageshow `Stage`: a product screen, a flow through a system, a mechanism told as a sequence, a value that changes, a before and after, a chart that draws in. Read stageshow's `SKILL.md` and follow its workflow; this file only says how a stage lives inside a guide.

If stageshow is unavailable, stop and print:

```sh
npx skills add benjitaylor/skills --skill stageshow -g
npm install --prefix ~/.agents/skills/stageshow
```

## Pick the medium

| The reader needs to | Build |
|---|---|
| See a screen, control, dialog or flow | stageshow stage, a still or a cursor story |
| Watch something move through a system, step by step | stageshow stage without a cursor (gold: `payout-flow`, `subscriptions`, `choreography`, `story`) |
| See a value change and what it feeds | stageshow stage (`Count`, `Roll`; gold: `table-edit`, `chart-scrub`) |
| Read a chart that draws in or scrubs on a hairline | stageshow stage (`Chart`; gold: `chart-scrub`) |
| Have parts called out with leaders and dimensions | stageshow stage (gold: `annotations`, `panel-annotation`) |
| Change the input the claim depends on: drag, scrub a timeline, set a parameter | animated-visuals explorable figure, still built and reviewed with stageshow's method |
| See a large dataset, a physics field or a 3D scene | animated-visuals figure, same method |

Choose a stage unless the reader must operate the figure. A loop the reader watches is a stage; a control the reader moves is an explorable.

## Plan diagrams first

Every diagram starts with the plan block in animated-visuals' `references/diagram-method.md`: the claim, the focal path, the beats, the poster and the gold to copy, written before any code and kept beside the stage. Product screens follow stageshow's own workflow.

## Use the product's real look

Never invent a palette. Before the first stage:

1. Find the host's tokens: CSS custom properties, the Tailwind theme, theme files, or the computed styles of its button, input, menu and card. In bb and its forks: `apps/app/src/components/ui/theme.css` and `packages/shared-ui/src/components/ui/`.
2. Map them onto stageshow's `--ss-*` tokens as its `references/looks.md` describes.
3. Save the mapping as `stages/look.css`, scoped to `.ss-stage`. Reuse an existing look for the same product.

When the same guide also has animated-visuals figures, map their `--fs-*` tokens from the same source so both read as one system.

## Write a stage

One file per figure, `<directory>/stages/<name>.tsx`. The default export renders one `Stage`; import the kit as `stageshow/kit`. Copy the closest gold example first (stageshow's step 4), keep its framing, then make it say the guide's claim. Files starting with `_` are helpers and are not mounted.

```tsx
import { Stage, Window, Row, Text, type Act } from "stageshow/kit";
import "./assign.css";

export default function Assign() {
  return (
    <Stage width={720} height={340} compact={{ below: 720, width: 358, height: 300 }} play="once" script={async (a: Act) => { /* beats */ }}>
      {() => <Window url="app.lotiq.com/inbox">{/* screen */}</Window>}
    </Stage>
  );
}
```

## Place it

A stage sits in a figure plate. The plate's title is the claim; name every labelled part in the prose.

```html
<figure class="fs-plate wide" aria-labelledby="assign-title">
  <header class="fs-head"><h3 class="fs-title" id="assign-title">Assigning a lead moves it to the rep's queue</h3><span class="fs-status">Illustrative</span></header>
  <div class="fs-stage" data-stage="assign"></div>
</figure>
```

`scripts/build.mjs` bundles every `stages/*.tsx` once, with one React copy, and mounts each into its `data-stage` element. The PASS line lists them.

## Stand-alone

For a plan, a bb Drive doc or a review thread, build one stage as its own page and register it:

```sh
node <guide-skill>/scripts/stage.mjs stages/assign.tsx --out stages/assign.html --look stages/look.css
bb drive artifact add stages/assign.html --title "Inbox: assign a lead" --type page
```

## Rehearse

Every stage is filmed before delivery, from the built page, and every frame is read:

```sh
node <stageshow>/scripts/film.mjs "file://<dir>/index.html" --select '[data-stage="assign"]' --still --out shots/assign.png
node <stageshow>/scripts/film.mjs "file://<dir>/index.html" --select '[data-stage="assign"]' --states --gate
node <stageshow>/scripts/film.mjs "file://<dir>/index.html" --select '[data-stage="assign"]' --width 390 --gate
```

`rehearsal passed` is necessary, not sufficient: hold the still next to the gold you copied and answer stageshow's `references/teaching.md` questions, then run its fresh-eye review (`references/review.md`). A product stage is a visual spec, not the implementation: label it, and never imply the shipped UI matches until someone has filmed the real screen.
