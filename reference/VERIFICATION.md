# Verification of the initial public edition

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
