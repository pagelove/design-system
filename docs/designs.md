# Selecting and authoring designs

## Selection

Read `designs/catalog.json`, then select the requested ID. With no explicit request, use its `defaultDesign` and `defaultMode`. With an explicit design but no mode, use that design's own `defaultMode`. Never invent a light variant for a dark-only design. The preview falls back to the configured default for an unknown ID, and the selected design's initial mode for an unavailable mode.

Shared guidance describes accessible behavior, document-first development and component contracts. Each design describes visual choices. Selecting Forest should not inherit Classic's white page or serif headings because a root guide was loaded first. Use the selected guide and exports together.

## Sources and generation

`designs/catalog.json` registers IDs and the global default. Each `designs/<id>/design.json` contains its name, description, local default mode, available modes, foundation overrides, appearance and guidance. JSON Schemas are in `schemas/catalog.schema.json` and `schemas/design.schema.json`.

Designs inherit `tokens/foundations.json` and `tokens/semantic.json`. Foundation overrides merge recursively. Each available mode inherits the complete shared semantic map, then applies its role overrides. The build resolves aliases and emits independent, complete formats for every design. Derived files are not separately editable authorities.

Appearance settings connect heading/body families, card/button radius, content width, section spacing and panel shadow to shared CSS. Palettes change actual page/surface colors, controls, links and status roles. A descriptive guide alone does not change running components.

## Default and compatibility

Change the catalog default and rebuild. Root guides, Stitch copy, resolved exports, DTCG files and theme styles follow it. Per-design bundles retain their own defaults. Root exports retain dictionaries keyed by mode, with design/default metadata added. A dark-only default has no `light` entry: consumers must inspect mode availability. Unsupported root DTCG mode files are removed on rebuild.

The original profile JSON is reference-only. Choose `data-design`, not `data-profile`, for a complete design. Existing editorial/invitation profile guides redirect to the supported designs.

## Browser integration

Load `styles/app.css` and put `data-design` plus an available `data-theme` on the HTML element. Omitting both uses the configured default. Typography, geometry, backgrounds and browser control color scheme follow the selection. Nested regions can demonstrate tokens, as the gallery does; whole-document selection is recommended for apps.

For one design, load `styles/fonts.css`, `styles/library-components.css`, `styles/base.css`, then that design's `styles/theme.css`. Add `styles/product.css` if using the product compositions. Do not also load `styles/app.css` or `styles/designs.css`: those are the multi-design entry point. Each generated `designs/<id>/preview.html` demonstrates this independent path, including supported modes, native color scheme and local interactions. Preserve relative font paths and font licenses when copying assets. `styles/base.css` is the shared structure/accessibility layer; theme files supply foundations, semantics and appearance.

The preview uses URL parameters (`?design=forest&mode=dark`), not a hidden saved preference. Changing designs resets to that design's initial mode. Back/forward restores earlier selections. A generated catalog script allows local-file previews without JSON fetches.

## Add a design

1. Create `designs/<id>/design.json`, using an existing definition as a structural starting point. Use a stable lowercase ID and include all appearance settings.
2. Declare supported modes and one local default. Cover page/surface colors, text, actions, focus, disabled/error/selection states and links. Do not use automatic inversion.
3. Write concrete guidance for fonts, colors, shapes and density. Keep font fallbacks and license requirements explicit. Preserve neutral panel borders and no decorative northeast arrows.
4. Register the ID in the catalog. Change the global default only if intended.
5. Build and check. Compare real components in every mode, inspect mobile/keyboard/error/loading states and add a screenshot. Check contrast in actual contexts.

Shared-source changes can affect every design. Exports do not imply verified proprietary native files or live tool imports.

Register a matching composition in branding/templates.json when adding a design. The build exports social images for each supported mode from that design's resolved tokens. App identity stays in branding/site.json and branding/mark.svg. See [identity and sharing](identity-and-sharing.md); the root social image follows the catalog default, independently of the stable favicon mark.

## Product compositions

The complete app preview is examples/workspace.html. It shares the selection contract with the component catalog and adds URL-addressable overview, project and settings screens. Load styles/product.css after styles/app.css for these reusable compositions. New designs must include the product appearance keys listed in schemas/design.schema.json. Read docs/polish.md for the acceptance standard.

Collection links use `collection=fieldnotes`, `collection=ways` or `collection=beginnings` alongside the design/mode/screen parameters. Unknown collections fall back to Fieldnotes. Reading size and motion are local preview preferences and do not redefine the selected design or its export defaults.

All collection previews use examples/selection.js for the same selection rules. Quality and standalone mode selections are URL-backed and restore through browser history. Per-design standalone previews use local defaults, independently of the collection default.

## Portable selection

Each bundle includes tokens/tokens.resolver.json. It combines foundations and composite typography with exactly one supported mode. Multiple-mode bundles expose a mode modifier with the bundle's default; single-mode bundles use unconditional sets and take no mode input. Mode-specific Stitch files are .stitch/light.DESIGN.md and/or .stitch/dark.DESIGN.md. exports/manifest.json identifies release/schema versions and these paths.

Interactive guide links in the gallery, component catalog, workspace, patterns and standalone previews point to the displayed mode's .stitch/MODE.DESIGN.md. The unchanged DESIGN.md entry point still describes that bundle's configured initial mode. Use the mode-specific path when reproducing a selected preview.
