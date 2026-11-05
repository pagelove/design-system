# Verification of the initial public edition

## Default selection update — November 5, 2026

The configured default is now Midnight/dark, following the user's explicit selection. Rebuilt all default guides, styles, tokens and exports; removed the unsupported root light-mode DTCG file. Full checks passed. Browser navigation without design/mode parameters selected Midnight, disabled the dark-only mode selector, and rendered background rgb(16, 13, 23) with native dark color scheme. The gallery and default overview previews were refreshed. Earlier Classic/light references below describe the previous release.

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

## Product polish edition (0.3.0)

- Five designs / eight supported modes retain distinct fonts, palettes and geometry; Midnight/dark is still the default.
- Added shared product compositions: overview, collection/detail and settings; all 24 screen/mode combinations were checked at desktop and 320px width. No horizontal overflow was found (scrollWidth equals clientWidth).
- Browser checks covered required/email validation and first-error focus, Enter submission, pending/completed status, reset, no-results recovery, safe local story creation, Escape/return focus and browser history. No browser warning/error logs appeared during the checked interactions. Evidence: audit/polish-browser-checks.json.
- Bundled 18 TrueType files across six OFL font families. Local font declarations and computed families were inspected with screenshots; this is not glyph-by-glyph font coverage certification.
- Expanded static contrast checks cover text on page/panel/inset surfaces and primary hover/pressed states. Editorial light links were darkened after the panel contrast check failed. All checked pairs now pass 4.5:1.
- Build/check pass, including alternate defaults, portable formats, Stitch parity, public-content scan, links and font headers/licenses. Motion media rules were inspected in CSS; the browser tool does not expose reduced-motion preference emulation. Screen-reader, physical-device and proprietary import testing remain outside this verification.
- The example has no service persistence. Created stories and settings are explicitly local and reset on reload. Earlier screenshot/evidence files remain historical unless explicitly refreshed.

## Review acceptance evidence

The revision review checks generated heading metadata against the design's canonical size and tracking, adds control/focus/error-outline contrast checks and exercises all three addressable collections. Browser diagnostics now load the actual local font faces at weights 400/500/600 and expose failures; computed font-family alone is not treated as font-loading proof. Explicit reduced motion is exercised through the preview settings. Prior verification limits remain historical; see the newest review record for current coverage.

## Portability review (0.3.2)

- Executed ES module/CommonJS adapters and CSV round trips for the root plus all five design bundles; values match canonical resolved exports.
- Validated emitted DTCG types, units, values, alias types and original-CSS coverage. Negative fixtures reject unsupported types, negative durations and mismatched aliases. This is repository contract validation, not independent full-spec certification.
- Independently loaded eight standalone modes with only fonts/library/base/selected-theme styles. Native color schemes, keyboard field focus, mode-preserving links and mobile bounds passed.
- Measured rendered field wrapper borders/radii/heights in all eight modes, correcting a previously ineffective inner-input border override. Controls are 56px high with 44px native input targets.
- Rechecked 24 workspace screen/mode cases and eight catalog cases at narrow width, plus a 200% text case after the shared-style extraction. No horizontal overflow was observed.
- Quality-page design/mode selection now survives reload and back/forward. Alternate-default selection fixtures cover global Forest/dark versus explicitly selected Forest/light. A dependency-order issue found during integration was fixed and regression-checked.
- Evidence: audit/portability-browser-checks.json and audit/design-automated-checks.json. Native/proprietary imports, framework compilation, assistive technology and physical devices remain unverified.
