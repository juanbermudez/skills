# Guide sidebar standard

Use the actual licensed beUI Pro Docs Article navigation components for section navigation in guides. Keep explanation, figures, and evidence in the Guide renderer; navigation is a shared shell around that content.

## Component ownership

| Surface | Required component | Role |
|---|---|---|
| A single guide on desktop | `DocsNav` from `docs-article` | Searchable, grouped section links with a current-section marker |
| A single guide on compact screens | `DocsMobileNav` from `docs-article` | Contents dialog using the same section data and Pro modal focus behavior |
| A library or multi-document workspace | Installed `sidebar-workspace` composition | Navigation among documents and workspaces; separate from article section navigation |
| Theme selection | Existing Guide theme picker or installed host picker | Preserve the full palette catalog and saved reader choice |

Inspect the official [Docs Pages](https://pro.beui.dev/components/docs-pages) and [Sidebar](https://pro.beui.dev/components/sidebar) previews before a new composition. Use the installed **beui-pro** skill for authentication, source retrieval, installation, and provenance. Never describe a handwritten imitation as a Pro component.

A framework-free deliverable still bundles the real React components, their public primitives, and required runtime into the HTML. A native no-JavaScript fallback may expose links, but is explicitly a fallback. Do not copy licensed source into a public skill distribution. Keep licensed dependencies in the entitled project and record the source version or hashes.

## Reading layout

- At **1120 CSS pixels and wider**, use a persistent **256px** sidebar below the guide header. Let the navigation scroll independently when necessary.
- Below **1120px**, replace the desktop sidebar with a labeled **Contents** button. Open `DocsMobileNav`; do not squeeze a desktop rail into the reading area.
- Keep prose within **46rem** and figure plates within **58rem**, inside the available content area. Both figure edges must stay on-screen, including just above the breakpoint.
- Use the host's Manrope typography and semantic theme tokens. Desktop navigation text is **13px** with a **20px** line height and stable **500** weight. Group labels are **12px**. Current state changes its marker/background without changing row geometry.
- Default to compact desktop density at **1120px and wider with a fine pointer**: section links and group controls have a **28px** minimum height, **4px** vertical and **10px** horizontal padding; search is **32px** high. Let wrapped labels grow naturally instead of clipping them.
- Use **16px 12px** sidebar padding, **12px** between groups and after search, and **4px** between a group heading and its list. Do not inherit oversized component-demo gaps or add blank space between every section row.
- In the compact contents dialog and on **coarse-pointer** devices, retain **14px** section text and at least **44px** targets for links, group controls, search, contents, and close controls. Keep the tighter group spacing. Use **6px** control radii and a visible focus ring throughout.
- Keep single-guide navigation focused on reading. Add account controls, workspace selectors, badges, or progress only when real product behavior supplies them.

These dimensions are the shared starting contract. A different host constraint needs a documented override and breakpoint checks, not an unrelated visual system.

## One navigation source

Store the guide title and ordered section groups in `navigation.json`. Every item contains an `id` matching an existing article section and a human-readable `label`. Group labels reflect the subject; three useful groups are understanding the system, exploring capabilities, and reference/use.

The build rejects empty groups, duplicate IDs, invalid IDs, missing labels, and missing targets. Do not maintain separate desktop and mobile inventories. Do not duplicate a complete section index in an unnecessary second rail.

Search filters section labels through `DocsNav`. It is **section search**, not a claim to search the full article. Preserve the component's clear no-results message and search-driven group expansion. Collapsed groups remove their links from the tab order.

## Routing and focus

- Render real fragment links. Preserve modified clicks and native new-tab behavior.
- A section selection updates the URL, scrolls to the destination, and focuses its heading without a second scroll jump.
- Browser back/forward and direct fragment URLs resolve to the same destinations.
- Scroll tracking updates the current marker and compact label without adding a history entry for every section read.
- The mobile dialog has an accessible name, focus containment, close control, Escape dismissal, background dismissal, and focus return to the trigger.
- Selecting a mobile section closes the dialog and focuses the destination **after** the exit completes. Use the real modal lifecycle callback; do not guess an animation delay.
- Resizing to desktop closes the mobile dialog and removes its focus lock.

Pro owns search, group disclosure, motion, and modal mechanics. The host owns article IDs, URL state, heading focus, and the current-section value passed to Pro. Keep those responsibilities explicit.

## Theme and delivery

Map component color aliases to Guide's `--fs-*` tokens below the host root. Preserve the existing theme catalog, saved choice, reduced motion, offline fonts, figure expansion, and code controls. Do not introduce a separate sidebar theme preference.

Scope navigation styles and Tailwind utilities so they do not reset the article or figures. A self-contained HTML build contains no credential and requires no runtime component CDN. Pro source hashes, bounded adaptations, and renderer identity belong in build provenance.

The current Learning AI implementation uses `space/pro-ui/build-guide.mjs`, `src/guide-sidebar/sidebar.tsx`, and `src/guide-sidebar/styles.css`. It composes the installed `DocsNav` and `DocsMobileNav`; it does not mount demo document content. Build a guide from that project root with:

```sh
pnpm --dir space/pro-ui typecheck:guide
node space/pro-ui/build-guide.mjs resources/guides/prime-agent
node space/pro-ui/verify-guide.mjs resources/guides/prime-agent
node space/pro-ui/verify-guide-boundaries.mjs
```

The wrapper calls the canonical Guide build, then inlines the project-owned Pro shell. Use it for Pro guides; a plain Guide rebuild does not include the React shell.

## Required proof

Check desktop, phone, and both sides of the breakpoint; include **1440px**, **1120px**, **1119px**, **780px**, and **390px**. Verify light, dark, and a host palette, plus reduced motion.

Measure rendered section rows, group controls, search height, and group gaps: desktop must follow the compact dimensions above; dialog and coarse-pointer targets remain at least 44px. Check long-label wrapping and stable active-row geometry. Exercise search, an empty search, group collapse/expand, hidden-link tab order, section navigation, current-section tracking, direct links, history, modified clicks, mobile dialog focus containment, Escape/background dismissal, destination focus after selection, and resizing while open. Check that every figure remains registered and within both horizontal bounds, and that theme/code/figure controls still work.

Inspect screenshots of the actual render. Record whether screen-reader, hardware-touch, and packaged-viewer checks were performed. A passed build or source inspection does not establish those claims.
