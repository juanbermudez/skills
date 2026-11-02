# Diagrams the stageshow way

Stageshow's method for product shots, applied to diagrams: architectures, flows through a system, mechanisms, sequences, state changes, before and after. A diagram is a miniature of a real system: a believable picture of it, laid out in its space, as one still or a short animation in which one thing happens. The reader recognizes the system and sees the thing happen.

Read stageshow's `SKILL.md` first; this file maps each of its steps onto diagrams and adds the rules diagrams need. The type catalog is `diagram-types.md`; node, connector and packet geometry is `diagrams.md`.

## The one idea

**It reads as one claim about a real system, simplified to the path the reader needs, laid out with intent, and every motion has a cause.**

Five ways it fails:

- **Too much.** Every service, every arrow, a label on each, a legend for the colors. The more boxes, the more it looks generated and the less anyone reads.
- **Abstract.** Boxes named Service A and Service B, arrows that say "calls". Stripped of what made it this system: its names, its objects, its one surprising step.
- **Flat.** Every node the same box at the same weight in a grid. The eye has nowhere to land and no path to follow.
- **Tangled.** Connectors crossing, arrows in every direction, a return path cutting through the middle. There is no reading order.
- **Bland.** Gray boxes and arrows whatever the system. A queue drawn as a queue, a document as a page, a person as an avatar, the product's real color on the step that matters: the system's character is the point.

The fix: one focal path along one reading direction, its nodes at full weight with real names, the rest of the system as quiet context that may run off the edge, room to breathe, a crop that puts the eye on the step the claim is about. Simplify the boxes, not the meaning.

## How hard to press

Build it the way a staff engineer draws the diagram for the design review they will be judged on. Stageshow's gold examples are the bar: if yours is the busier, flatter or more boxed one beside the closest gold, that is the first fix. Then look at it the way the most exacting reviewer you know would, the one who screenshots the one wrong thing and sends it back with "what is this?": an arrow that crosses a box, a label touching a line, two nodes a few pixels off one row, a packet that moves before its cause. If you can picture that screenshot, you have found the next fix.

## Workflow

Most of the quality is decided before any code. Write the plan first, in the plan block below, and keep it beside the stage.

### 1. Plan

```markdown
## Diagram plan: <name>
- Claim: <one sentence a stranger can check against the still>
- Reader's question: <what they are asking when they reach this figure>
- Place: <guide, plan or page; the column; design size, e.g. 720 × 340; compact 358 wide>
- Medium: still | once | loop | explorable (and why)
- Type: <from diagram-types.md, or a semantic pattern>
- Reading direction: left→right | top→bottom
- Focal path: <start> → <step> → <payoff> (3 to 5 nodes)
- Context: <what stays as quiet filler, what runs off the edge>
- Cut: <what the diagram leaves out, on purpose>
- The thing that moves: <packet, value, card, state> and what causes it
- Beats: 1. … 2. … 3. … → payoff: <what is on screen at the end>
- Poster: <the frame that tells the claim on its own>
- Real strings: <list them; 3 to 7>
- Gold: <the stageshow example you will copy, and why>
```

If any line is hard to fill, the diagram is not ready to build. The claim and the focal path decide everything else.

### 2. Medium and place

Design at the size it will be seen: 720 × 340 beside prose, 900 to 1100 wide for a full-width figure, 400 × 300 for a card. A diagram that sits in a phone column ships a `compact` design at 358 wide, and it is a redesign: a left→right flow becomes top→bottom, context nodes leave, the focal path keeps its names. Pick still, once or loop for a stage; pick explorable only when the reader must change an input (`../SKILL.md`).

### 3. Look

The host's real tokens, mapped once to a stageshow look (`stageshow/references/looks.md`). Ink and gray for structure; the accent on the focal path only; the product's own colors where the system has them. Never a rainbow of node kinds.

### 4. The story

A diagram's story has one of four shapes:

- **What the system does:** an input enters, the consequence lands somewhere else, the link is visible (a value riding a connector, a card flying into a list). Gold: `subscriptions`.
- **A journey:** one request or record walks the focal path; each node does one visible thing to it. Gold: `payout-flow`, `story`.
- **A state change:** one object changes state in place and what depends on it follows a beat later. Gold: `table-edit`, `choreography`.
- **Before and after:** the same layout twice, one thing different; two stills at the same crop, or one stage that changes once.

Three to five beats building to a payoff. Nothing moves without its upstream event: a packet leaves a node only after something arrived there. Data never rewinds in view. A loop resets with a seen cause or while hidden. Open on a still that already explains the system; motion adds order and cause, not meaning. Choose the calmer frame over the richer story.

### 5. Start from a gold example

Film the closest stageshow gold and copy its folder into `stages/`: keep its stage size, crop, type sizes, spacing and beats, then replace its objects with the system's. A copy that only renames the boxes is not done; it must read as this system.

| Diagram | Gold to copy | What to keep |
|---|---|---|
| Architecture or data flow with a consequence elsewhere | `subscriptions` | A chip flies from the source into its row, the total rolls a beat later, the second scene is the reset |
| A record's journey through steps | `payout-flow` | Slow overlapping arrivals, reading time on each step, a payoff that holds |
| Related objects that point at each other | `story` | Connectors drawn after both ends exist, rolling totals |
| Parts called out | `annotations`, `panel-annotation` | Leaders through empty ground, one setting tied to what it changed |
| A value changing what depends on it | `table-edit`, `choreography` | The edit, then the dependent total a beat later, retained tracks |
| A metric over time | `chart-scrub` | The hairline and dot on the line, the headline value rolling |
| Many instances of one thing | `many-of-one` | One in focus by depth, the only one with words |

For an explorable, copy the closest demo in `assets/plate-template.html` and hold it to the same bar.

### 6. Compose

Diagram framing, after `stageshow/references/framing.md`:

1. **One focal path, at most one or two satellites.** A satellite is a detail card on the path: the payload, the record, the rule that fired. It straddles the connector or node it explains, never floats apart.
2. **One reading direction** for the focal path, the same as the argument's. Context hangs off it, never across it.
3. **Crop only context.** Upstream sources, downstream consumers and sibling services may run off the stage edge or fade; the focal path, the payoff and every real word stay whole.
4. **Depth from weight, not boxes.** The path at full weight with real names; context at 0.28 opacity or as bars; a group as a tinted ground, never a box around boxes.
5. **One gutter,** measured in the final crop; every edge distance matches it. No dead corners at rest or anywhere in the loop.
6. **Connectors never cross a node or each other.** Several sources merge into one level run before their target (`Connector route="step"`), with about 80px between columns. Return paths run around the outside. A connector carries a label only when something crosses it: the value, the condition, never "calls".
7. **Domain shapes, sparingly:** a queue as slots, a store as a stack, a document as a page, a person as an avatar. Shape says kind; a label says which.
8. **Align on a grid.** Nodes on one row share a center line; equal gaps between ranks. A few pixels off is a finding.

Restraint, after `stageshow/references/craft.md`:

- **Count the real strings:** usually 3 to 7. Names on the focal path, the value that moves, the result. Everything else is a bar, a dimmed node or nothing.
- **Role names, not codenames.** "Router", "Inbox", "Embed block", never `svc-7` or a class name.
- **One number gets to be big.** The rest are small or gone.
- **Say it once.** Direct labels instead of a legend; one name per thing across the figure and the prose.
- **The heaviest marks sit on the claim.** No bold arrow into a gray context box.

### 7. Choreograph

Build with stageshow's kit: nodes as plain elements in the stage, `Connector` for edges, `Fly` for a card that travels, `Count` and `Roll` for values, `Collapse` for a row that arrives, `Popover` for a detail that opens. Keep what appears mounted and toggle it so exits animate. Beats overlap, related starts are offset, the payoff holds. Mark each beat with `a.mark('<name>')` so it can be filmed.

### 8. Rehearse

Set `poster` first: the payoff with the path lit and the result still on screen. Cover the motion and ask what happened; if the poster can't answer with the claim, pick another beat.

Then film, from the built page:

```sh
node <stageshow>/scripts/film.mjs "<url>" --select '[data-stage="<name>"]' --states --gate
node <stageshow>/scripts/film.mjs "<url>" --select '[data-stage="<name>"]' --width 390 --gate
```

Read every frame, then these, which the film gate does not know about:

- **The squint test.** At thumbnail size, the focal path is the first thing you see.
- **The stranger test.** From the poster alone, someone who has not read the prose can say the claim.
- **Zero crossings.** No connector crosses a node or another connector, on any frame.
- **Cause before effect.** Step through every beat; nothing moves before what causes it has arrived.
- **Names agree.** Every label in the diagram appears in the prose with the same word.

Fix the largest visible fault first: framing, then hierarchy, then motion, then polish. Then hold the still next to the gold and answer: what does the eye land on first, and is it the payoff? Then give a fresh reviewer stageshow's `references/review.md`, the frames and the gold's still.

### 9. Hand over

Keep the plan block and a short rehearsal note beside the stage: the gold you copied, what you changed, what you checked at which widths, and what you did not check.

## Faults that come back

- **A box for everything:** context drawn at full weight. Dim it, bar it or crop it.
- **The legend:** colors that need a key. Label directly or drop the color.
- **The grid of equals:** nodes laid out evenly with no path. Put the path on one axis first.
- **The crossing:** a return or fan-in cutting the middle. Route around the outside or merge first.
- **The generic arrow label:** "calls", "uses", "sends". Label the thing that crosses, or nothing.
- **Motion before cause:** a packet leaving before anything arrived, or every edge animating at once.
- **The tidy reset:** the result cleared away before the poster frame. Let it stay.
- **The squeeze:** the wide diagram scaled down for the phone instead of redrawn top→bottom.
- **The codename:** an internal identifier where a role name belongs.
