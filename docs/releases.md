# Releases

## 0.5.1

Compatible corrections retain all five designs and Midnight/dark as default.

- Checkbox helpers and catalog examples now include check and mixed-state marks. Original choice labels wrap, scale with text preferences and use the selected design's body font. Switches use a native control in forced colors, and control boundaries use the stronger semantic border.
- Forced-color mode maps semantic roles to the system palette, including readable text on the system canvas. Preserve base.css's relative forced-colors.css import when copying the shared styles.
- Determinate progress honors all six size options; pending icon-only buttons retain the action name plus an in-progress indication.
- Gallery, catalog, workspace and standalone guide links follow the displayed mode. Catalog and standalone form edits clear stale acceptance messages.
- DTCG/Tokens Studio typography adapters distinguish px, rem, em and unitless line heights. Existing design values are preserved; custom foundation overrides now retain the intended spacing. See docs/formats.md for the supported units and mixed-unit assumption.
- Automated coverage now includes the original helpers and preview handoffs, in addition to the reusable patterns. Existing visual comparison thresholds remain unchanged.

## 0.5.0

Midnight/dark remains the default. This minor release corrects the Preview resolver contract and makes reusable patterns safe to embed alongside other UI.

- Dark-only DTCG resolvers now use unconditional sets. Before: a consumer passed `{ "mode": "dark" }` to every resolver. After: pass `{}` to Midnight, Invitation and the default bundle; multi-mode bundles still accept a mode input. Read exports/manifest.json for declared modes and follow resolutionOrder instead of assuming a modifier exists.
- Pattern CSS scopes table/dialog/tab styling to its own components. Generated helpers carry their hooks automatically. For copied table compositions, add ds-table, ds-table-scroll and ds-table-controls to the corresponding elements. Keep existing application classes as needed. The prior broad table/dialog rules were an unintended side effect and are removed.
- Pattern buttons and panel spacing follow the selected design's geometry. Breadcrumbs show navigation hierarchy, and form feedback clears when its saved state becomes stale.
- Confirmation now wraps Tab and Shift+Tab inside the active dialog and removes its handler on close, while preserving Escape and return focus.
- The patterns preview switches designs/modes without discarding local drafts, supports history, and links the exact selected-mode guide.
- Browser checks now use usable clientWidth, verify design geometry, modal focus containment, sorting, stale feedback and host-component isolation. Visual failures no longer prevent later task checks from running.

Live tool imports and manual assistive-technology/device acceptance remain separate checks; see docs/support.md.

## 0.4.0

Midnight/dark remains the default; all five designs retain their supported modes.

- Corrected gallery hover token, font/standalone documentation and default-color wording.
- Added typed Tokens Studio properties and typography composites. Some font stacks reduce to the first family in this adapter; original CSS is retained in other exports.
- Added per-mode Stitch guides with full semantic palettes and component mappings. The initial guide paths remain compatible.
- Added DTCG typography composites and resolver documents. Existing foundation/mode files remain available; a resolver adds the typography set automatically.
- Added manifests with release/schema versions and a Tailwind v4 CSS adapter.
- Added reusable native app patterns, RTL/mixed-script fixtures and text-spacing tests.
- Added pinned external validators, automated CI, browser/axe task tests and performance budgets. See the support matrix for unverified environments.
- Added smaller WOFF2 web fonts; original TTFs and licenses remain. Deploy the new WOFF2 files with styles/fonts.css.

Migration: XML consumers should use schema-version for the interchange shape and release-version for the collection release. Tokens Studio consumers should reimport the generated sets so former other values gain their proper types. Existing CSS/JSON mode selection rules are unchanged. Pattern examples use JavaScript modules and should be served over HTTP with npm run serve.
