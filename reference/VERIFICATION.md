# Verification of the initial public edition

## Collection update — November 5, 2026

The multi-design edition is recorded in `audit/design-automated-checks.json`, `audit/design-browser-checks.json` and `audit/design-mobile-checks.json`.

- Built five complete designs with eight available design/mode combinations and all portable formats. Checked reference resolution, complete shared roles, per-design Stitch copies and deterministic output.
- Built isolated alternate-default releases for Forest/dark and Midnight/dark. Verified root guide/default metadata, dark-only resolved outputs and removal of the previously generated unsupported light token file. Invalid defaults and duplicate catalog IDs are rejected.
- Checked four selected text/action/link contrast pairs in every combination. Parsed generated XML/SVG and checked JavaScript syntax. These remain bounded checks, not full DTCG or accessibility certification.
- Browser selection changed actual background colors, heading families, card/button radii, native color scheme and guide links in all eight combinations. Primary action feedback worked in each. Verified URL reload, back/forward restoration, unsupported light-to-dark fallback for Midnight and its disabled mode selector.
- Keyboard Enter advanced progress, and the native form accepted the local demonstration. At a 320×568 viewport override, every combination had document scroll width equal to document client width (305px after the browser scrollbar).
- A narrow-screen review found decorative button pseudo-elements expanding the scroll area. Their extra inset was contained in the recommended app layer, and strict client-width checks were rerun. An earlier inner-width comparison was insufficient because it included scrollbar space.
- Generated-guide review also caught a heading-family mismatch for Forest; guide typography now comes from the resolved appearance values used by the browser.

Screenshots in each design's previews directory show the actual selected controls. The gallery preview is in assets/previews/design-gallery.png. Fonts use locally available fallbacks; exact font-file rendering, physical phones, assistive technology, live Stitch/Figma import and native/framework compilation remain unverified. Initial-edition evidence below is historical and is not silently promoted into new coverage.

The initial edition was checked on November 4, 2026. Machine-readable static results are stored in `audit/automated-checks.json`.

## Executed checks

- Regenerated exports and compared file hashes for deterministic output.
- Parsed JSON; resolved all foundation/semantic aliases; checked the exported DTCG subset and Stitch-copy parity.
- Exercised HTML escaping, rejected invalid helper parameters, pending-action disabling and progress bounds.
- Scanned distributed text for internal addresses/paths and representative credential patterns; checked repository links against the Pagelove organization allowlist.
- Checked local Markdown/HTML file links and six text/button contrast pairs in light/dark mode.
- Inspected the catalog in a desktop browser and at 390×844 and 320×568 CSS-pixel viewport overrides. No horizontal document overflow was observed at those widths.
- Used real browser actions to verify primary feedback, native form rejection, local preview acceptance, password visibility, checkbox/radio/switch selection and progress advancement.
- Used keyboard Enter to advance progress and Space to change a checkbox. The focused progress button had a visible solid outline.
- Checked the catalog's field-label associations. Captured light, dark and mobile PNG previews in `assets/previews/`.

## Corrections during verification

The preview server originally served the catalog at `/` without redirecting, causing its relative script URL to resolve incorrectly. The server now redirects to `/examples/catalog.html`. Interaction checks were rerun at that canonical path. After server restart, root navigation was also verified to redirect and execute the interaction successfully. One browser lookup by label did not resolve the appearance selector; the observed combobox role was used successfully.

## Limits

These are bounded source and browser checks, not a full accessibility audit. Real-phone behavior, assistive technology, 200% text enlargement, actual reduced-motion browser emulation and every CSS variant remain unverified. Reduced-motion CSS was inspected, but the mode was not forced in this browser session. The selected contrast checks do not certify every role/background combination.

Stitch import, Tokens Studio import, native compilation, and React/Vue/Svelte compilation were not executed. Their adapters are documented source formats, not claims of tested end-to-end tool integration. DTCG checks cover the generated subset, not an independent complete conformance certification. The catalog performs local demonstrations only; no backend, shared-save or deployment guarantee is implied.
