---
name: animated-visuals
description: Design and build polished, minimal, animated and interactive figures and diagrams for guides, plans, papers, articles and sites, the stageshow way. Every figure is planned, framed and rehearsed with stageshow's method and built as a stageshow Stage by default (flows through a system, mechanisms told step by step, values that change, charts that draw in, product screens); this skill adds the claim discipline, data honesty and the choice of interaction, and its own runtime (explorable charts, scrubbable timelines, drag handles, particle fields, WebGL, 27 themes) for figures the reader must operate. Use when asked to visualize data or a finding, explain a mechanism or architecture visually, make a figure interactive or animated, theme figures, or polish figures that look generic. Not for full lessons (use teach-me).
---

# Animated Visuals

Every figure proves one claim, reads at a glance, moves only when something causes it to, and is filmed and read frame by frame before anyone sees it.

## Stageshow first

**stageshow** is the method for every figure, and its `Stage` is the default medium. Read stageshow's `SKILL.md` before the first figure and follow its workflow; this skill does not restate it. What this skill adds:

- **The claim.** One sentence per figure, no codenames; cut any figure a sentence would replace (`references/content-design.md`).
- **Data honesty.** Every number is computed, agrees with the prose, and is labelled when it is simulated, scaled or illustrative (`references/charts.md`).
- **The interaction decision.** Whether the reader watches or operates the figure (`references/interaction.md`).
- **Explorable figures.** This skill's own runtime, for figures the reader must operate.

| The reader needs to | Build |
|---|---|
| Watch a flow through a system, a mechanism step by step, a sequence of events | stageshow stage without a cursor. Gold: `payout-flow`, `subscriptions`, `choreography`, `story` |
| See a value change and what it feeds | stageshow stage with `Count` and `Roll`. Gold: `table-edit` |
| Read a chart that draws in, or follow a hairline to a value | stageshow stage with `Chart`. Gold: `chart-scrub` |
| See parts called out | stageshow stage with leaders and dimensions. Gold: `annotations`, `panel-annotation` |
| See a product screen or how someone uses it | stageshow stage, still or with a cursor. Gold: the closest in stageshow's table |
| Change the input the claim depends on: drag a handle, scrub a timeline, set a parameter | explorable figure with this skill's runtime |
| See a large dataset, a physics or particle field, a 3D scene | this skill's runtime (`references/charts.md`, `references/webgl.md`) |

A loop the reader watches is a stage. A control the reader moves is an explorable. When in doubt, build the stage: a stage that tells the story beats an explorable nobody touches.

## Workflow

**For a diagram** (architecture, flow through a system, mechanism, sequence, state change, before and after), follow [references/diagram-method.md](references/diagram-method.md): stageshow's method mapped onto diagrams, starting with a written plan block. For other figures, stageshow's steps with this skill's additions in place:

1. **Claim.** Write each figure's claim in one sentence and its primitives (actors, objects, events, states, quantities): `references/content-design.md`.
2. **Medium and place.** Where it sits, the size it is seen at, still, once, loop or explorable, and its compact design for a phone column (stageshow step 1). Pick stage or explorable with the table above.
3. **Look.** Map the host's real tokens once to stageshow's `--ss-*` look file, and to `--fs-*` from the same source when the page also has explorables (stageshow `references/looks.md`, this skill's `references/theming.md`). Never invent a palette.
4. **Story.** Three to five beats and a payoff; no motion without a cause; data never rewinds in view without a cause (stageshow `references/motion.md`). For an explorable, the one interaction from the ladder that answers the claim (`references/interaction.md`).
5. **Start from a gold example.** Film the closest stageshow gold and copy it; keep its stage size, crop, type sizes and beats, then make it say your claim. For an explorable, copy the closest demo in `assets/plate-template.html` (or `assets/react/`) and hold it to the same gold bar.
6. **Restraint.** Real words only on what the claim is about, three to seven strings; quiet filler or nothing elsewhere; one focal element; context dims, never disappears (stageshow `references/craft.md`).
7. **Build and choreograph.** Stage: kit parts and the `Act` script. Explorable: `FS` runtime, one clock, programmable (`references/diagrams.md`, `references/motion.md`).
8. **Rehearse.** Poster frame first. Stage: `film.mjs --states --gate` at the shown width and at 390, then read every frame. Explorable: the contact sheets and per-state captures in `references/verification.md`, read the same way. Fix framing, then hierarchy, then motion, then polish; then stageshow's fresh-eye review.
9. **Deliver.** Inside a guide, follow the guide skill's `references/stages.md`; stand-alone, a page registered where the user asked. Report the gold you copied, what you changed, and what was not verified.

## Quality bar for explorable figures

Stageshow's quality bar applies to every figure. These rules add to it for figures built on this skill's runtime.


- One claim per figure, stated in its title; caption says what is simulated, scaled or sourced.
- Minimal and on-brand: the site's frame and type; mostly empty stage; one focal element; context dims to `--fs-dim`, never disappears.
- Monochrome-first encoding (fill, hatch, stroke); hue only for named categories, consistent across the page and checked for contrast.
- Direct labels; nothing clipped, colliding or under 11px on a phone; layouts re-flow instead of shrinking.
- Interaction answers a question; every control has a live readout; every derived number is computed (`fig.out`) and agrees with the prose.
- A stranger understands every label: role names, not codenames; copy within the budget; one writing style per page (`content-design.md`, `writing/`).
- Direct manipulation before sliders: spatial variables (positions, radii, thresholds, moments) are dragged in the figure via `handles`, with rubber-banding past bounds and a spring settle.
- Timelines scrub on the drawing itself (`timeAxis`): hover previews the moment, drag scrubs, click jumps, flick coasts, and the clock always glides to its target (`seek(t, { animate: true })`).
- Non-obvious parts explain themselves in tips (`tips`/`tipAt` or `data-fs-tip`): 500 ms hover delay, instant within a warm group and on focus, short and plain.
- Every plate expands nearly full screen with a FLIP animation (runtime default) and closes with ×, Escape or the backdrop.
- Nothing shifts when values change: stacked step captions keep the tallest height, changing outputs reserve their widest text (`reserve`), state buttons are fixed-size icons.
- Settings live in the popover behind the plate's settings icon (default `placement: "settings"`); only the control that *is* the interaction sits inline (time scrubber, steps, play, the scrubbable number in the prose).
- Theme picker = icon button top-right opening a shadcn-style dropdown; never a select in the hero. Grouped radio items with a check, full keyboard, choice saved in `localStorage` (`references/interaction.md` §4; React: real shadcn `DropdownMenu`, `assets/react/README.md`).
- Sliders are the runtime's physics slider (vertical bar handle, value bubble, rubber band, springy settle, magnet marks, full keyboard), never bare native ranges.
- One clock for narratives (`render(t)`, scrub, chapters, play once to the payoff); processes loop with Pause; changes ease and are interruptible.
- Programmable: anything a reader can do, `FS.get(id)` can do (`play`, `seek`, `goto`, `set`, `apply`, `state`), and prose can drive figures (`data-fs-scrub`, `data-fs-ref`).
- Reduced motion shows the payoff or a settled still; keyboard and touch parity; seeded randomness; loops sleep offscreen; heavy libraries load lazily; WebGL is disposed.

## References

| File | Owns |
|---|---|
| `references/diagram-method.md` | diagrams the stageshow way: the plan block, story shapes, gold examples to copy, composition, restraint, rehearsal checks, recurring faults |
| `references/content-design.md` | purpose taxonomy, primitives, granularity, the cold reader test, copy budget, tips plan |
| `references/writing/` | writing styles (practical default, academic on request) and how to add one |
| `references/interaction.md` | finding the interaction, the ladder, patterns, controls (handles, sliders, settings, timeline surface, tips, expand, stable layout, buttons), feel, the `FS` API, input parity, anti-patterns |
| `references/theming.md` | layers, token contract, switching/overriding, Omarchy palettes and contrast, host-site bridges |
| `references/art-direction.md` | the default register, plate anatomy, type, encoding, strokes, density, data honesty, other themes |
| `references/choosing-form.md` | claim → form, medium, delivery target |
| `references/diagram-types.md` | the 27 diagram types and 7 semantic patterns (after diagram-design), each with what moves, what the reader can do, and the trap |
| `references/diagrams.md` | layout, nodes, connectors, packets, stepping, state machines, responsive re-layout |
| `references/charts.md` | chart craft, hand-built charts with `FS`, nivo (theme, gotchas), annotation, statistics |
| `references/webgl.md` | three.js / R3F integration and budgets, stateless vs ping-pong particles, depth-of-field focus, pmndrs `math` vs `maath` |
| `references/motion.md` | what may move, timing tokens, easing/damping/springs, one clock, reduced motion |
| `references/verification.md` | browser checklist, motion capture, gotchas, reporting |
| `references/alex-zhang-notes.md` | patterns and failures from Alex Zhang's interactive figures |
| `references/konsistent.md` | optional: lint a project's figures with Konsistent (claim, status, sources, tips, plate, heavy libraries); offer it, don't impose it |

## Files

| Path | Use |
|---|---|
| `assets/plate-template.html` | self-contained starter (built) |
| `assets/plate-src.html`, `assets/runtime/fs-runtime.js` | sources for the template; the runtime is also used by the React assets |
| `assets/react/` | React components and hook |
| `themes/default.css`, `themes/notebook.css`, `themes/omarchy.css`, `themes/base.css`, `themes/site-bridge.css` | token layers and structure |
| `themes/omarchy.json` | palette source (Omarchy, MIT, pinned commit) |
| `scripts/build-themes.mjs` | regenerate Omarchy CSS as OKLCH (and a site's palette CSS/registry with `--site-css/--site-json`) |
| `scripts/oklch.mjs`, `scripts/hex-to-oklch.mjs`, `scripts/verify-oklch.mjs` | exact sRGB <-> OKLCH conversion, converting a hex theme, checking every theme color |
| `scripts/build-template.mjs` | inline themes and runtime into the template |
| `NOTICE.md` | credits and licenses |

## Related skills

`stageshow` (the method for every figure and the default medium), `guide` (figures inside a guide, `references/stages.md`), `teach-me` (whole lessons and videos), `diagram-design` (static branded diagrams), `dataviz` (chart color validation), `interface-design` (UI around the figures), `artifact-design` (publishing a page).
