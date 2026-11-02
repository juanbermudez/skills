# Shared document interface standard

Apply this to authored HTML guides, document readers, and interactive workspaces published through bb Drive. The host product remains the authority for its own native editor and library. This standard governs authored content, not an unrequested rewrite of bb's UI.

## Ownership

| Concern | Owner |
|---|---|
| Explanation, prose, figures, sources, and factual limits | guide; animated-visuals for figures |
| Navigation, controls, component composition, responsive behavior, and accessibility | interface-design; this reference for document-specific defaults |
| Licensed Pro component discovery and installation | beui-pro |
| bb Drive authoring, spaces, canonical documents, and artifact registration | studio |

Keep these boundaries separate. Do not rename studio to drive merely to add authoring guidance; its existing discovery, tracing, themes, and commands still apply. Keep one shared interface standard and link to it by skill/reference rather than copying it into each workflow.

## Establish the visual authority

Inspect the actual website or host's current DESIGN.md, theme tokens, font settings, and representative components before editing. Resolve disagreements between a written design note and current settings in favor of the configured surface and verify it in the render. Preserve unrelated work and the original content.

Juan's website reference, checked October 29, 2026, is the retained Zef Builder source at `/Users/juanbermudez/Documents/Codex/2026-10-18/task-2/site-review`. Its design is quiet and editorial, with neutral themes, Manrope configured for body and headings, one 4px media frame with a 12px outer radius, 6px ordinary controls, and a single focus treatment. Reconfirm this path and current source when using it; it is a source reference, not proof of deployment. Other hosts may supply different values.

## Navigation and controls

For guide section sidebars, follow [sidebar-standard.md](sidebar-standard.md). It selects the actual licensed Pro DocsNav and DocsMobileNav components, their responsive layout, and the shared navigation/focus contract.

- Navigation is a small set of stable named destinations. Keep labels at the same weight and geometry across states. Indicate the current location with aria-current, foreground emphasis, and a restrained marker.
- Use a compact toolbar or persistent desktop rail only when the information structure needs it. On narrow screens use a properly labeled disclosure, menu, or drawer; avoid an essential destination hidden beyond a horizontal scroller.
- Keep route state, browser back/forward, deep links, keyboard focus, and the visible current destination synchronized. On a user route change, focus the destination heading without an extra scroll jump. Closing an overlay restores focus to its trigger.
- Reuse the installed icon family. Match stroke width, size, optical alignment, and minimum 44px hit targets. Avoid text glyphs masquerading as a separate icon set.
- Inputs, buttons, menus, dialogs, and empty states share tokens, radii, spacing, and focus. Use native semantic controls when an authored standalone adapter cannot host the actual framework component. Label that adapter accurately.
- Preserve working content and interactions during a polish pass. Do not turn a source's evidence label into decorative status or invent progress.

## Typography and surfaces

- Keep one body and heading system. Use the host's configured fonts with licensed local assets; include license notices and a graceful fallback. For a self-contained artifact, bundle the required font bytes rather than relying on a path that cannot load inside Drive.
- Keep prose near 46rem. Separate reading measure from the wider list, table, and figure area. Use approximately 16–17px reading text and the host's restrained heading scale; do not make a dashboard title a marketing hero.
- Use grouped lists and editorial rows for collections. Use a card when it groups one task or inspectable object; avoid surrounding every paragraph with another card.
- Apply one concentric frame to rich media and figures. Floating menus can have the host's floating shadow; ordinary content stays flat.
- Derive page, surface, text, muted text, line, focus, and selection from semantic theme tokens. Keep body text at 4.5:1, large text at 3:1, and visible keyboard focus in light, dark, and host themes. Reduced motion and reduced transparency preserve all controls and information.
- Source references and evidence limits stay visible and readable. Match the reader's tables, code, quotes, and headings to the host article style rather than rendering them as a second dashboard system.

## Preserve theme selection

Component or framework rebuilds must retain the shared theme catalog and a visible, named theme selector; a light/dark-only toggle does not preserve that contract. Reuse guide `themeLayer` and its `av-theme` persistence rather than creating another preference. For an explicitly bb-integrated workspace, offer Follow bb, default to the active host palette, preserve user color overrides, and let a saved reader choice take precedence. Scope app aliases below host root variables to avoid circular theme references. Verify selected styling, keyboard selection, persistence, and mobile menu containment in the built artifact. Distinguish a build-time palette and simulated host updates from packaged-viewer proof.

## Licensed component reuse

When Pro components are requested, load **beui-pro** and use the authenticated current `https://pro.beui.dev/r/registry.json` catalog. The install namespace is `@beui-pro`; the public dependency namespace is `@beui`. Never invent a slug or claim a custom approximation is a Pro component.

Inspect working component, block, and template previews before choosing a new interface composition. Confirm that the preview itself rendered; page headings around a blank example are not visual proof. If the aggregate catalog fails, follow beui-pro’s documented exact-item retrieval fallback rather than declaring all source unavailable.

Prefer the smallest relevant primitives or navigation block over importing a marketing page. Inspect source, dependencies, exports, interaction, keyboard behavior, and licensing before adapting it. In React, install through the project's shadcn registry and import the generated exports. A framework-free artifact needs an explicit source-derived adapter or bundled component; preserve behavior and record the exact source item, adaptation, dependencies, and limits.

A missing token or entitlement blocks fetching new Pro source. Request the credential through the installed secrets workflow without exposing it. Continue independent typography, content, and existing host-component work, but do not silently substitute lookalikes or claim the Pro request is complete. Never include the token or authenticated registry response containing secrets in a published artifact.

## Publication and canonical content

Use studio for bb Drive. An editable live doc owns its content; an artifact stays backed by its source file. A rendered or embedded snapshot is read-only unless actual saving exists. Identify snapshots and manual refresh boundaries. Never create a competing editable copy silently.

Markdown content uses native document semantics. Rich controls and visual navigation belong in an HTML artifact with an explicitly linked supporting doc when needed. Register the finished file; a suggested space is not membership. When authorized to organize the space, add the item and verify the returned membership.

## Verification

Check the changed paths in a real browser: desktop, intermediate, mobile, light and dark, keyboard, reduced motion, and narrow dialog/menu states. Exercise navigation, deep links, browser history, search, empty states, and source opening. Test real long labels and available data. Watch for document overflow and console failures. A browser-local note is not shared progress or assessed competence.

Report installed/adapted Pro items, preserved source, real browser proof, publication, and any remaining credential or framework limits separately. Source inspection does not establish deployment.

## Standalone navigation adapter

The guide build bundles `assets/document-ui.css` and `assets/document-navigation.js`. Opt in with a root bearing `data-document-navigation`, a button bearing `data-document-nav-toggle` with `aria-controls` and `aria-expanded`, and a uniquely identified `data-document-nav-panel`. Put `data-document-nav-current` on the button's current-location label. The default compact breakpoint is 912px; `data-document-nav-breakpoint` can match the host.

The adapter owns responsive visibility, disclosure state, Escape, outside click, focus return, and closing after a selection. The host owns routing and heading focus. Style the opted-in panel and trigger for the host; do not recreate a second disclosure controller. Without these attributes the asset does nothing. This is a native standalone adapter, not a claim that a licensed React component is installed.
