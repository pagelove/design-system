# Core controls and selected-mode handoff review — 0.5.1

Scope: reusable app controls across the collection, faithful portable typography, selected design/mode handoff, and evidence beyond the newer pattern fixtures. Midnight/dark remains the default and all five designs retain their modes.

| Gap | Revision | Verification |
| --- | --- | --- |
| Checked/mixed checkbox states had no visible glyph in the helper and catalog | Add check and dash SVGs while native inputs retain semantics | Direct browser observation; keyboard/state/glyph tests |
| Original choice labels forced a single line and overflowed narrow layouts | Allow wrapping, relative text size, selected body font and stable control graphics | Direct combined RTL/200%/spacing fixture: scrollWidth changed from 686 to 305 for clientWidth 305 |
| Switch forced-color styling depended on custom backgrounds and shadows | Use a native control and visible keyboard focus; improve neutral control boundaries | Forced-color computed styles, interaction and screenshots |
| Chromium's forced-color capture retained pale theme text over a white canvas | Map all semantic roles to system colors and use the system color scheme | Added explicit forced-color text contrast checks after visual review found the missed condition |
| Every determinate progress size rendered at 40px | Apply each requested size to SVG geometry | Direct measurements and all six browser size checks |
| Icon-only loading names omitted the in-progress indication | Preserve action plus pending text in the accessible name | Browser accessible-name and disabled-state checks |
| Several preview guide links ignored selected dark mode | Link exact mode-specific guides throughout gallery, catalog, workspace and standalone views | Every supported mode, history/reload and gallery links |
| Catalog/standalone acceptance messages survived later edits or invalid input | Clear acceptance on input and native validation failures | Valid-to-edited-to-invalid tasks |
| Typography assumed em tracking and absolute line height | Distinguish supported units, retain dimensions and translate multipliers correctly | Five independent override fixtures and four invalid-input cases |

The typography case with 20px type, 2px tracking and 1.5 line height must emit 2px tracking and a 1.5 multiplier. The old calculation produced 40px and 0.075. A rem tracking value must stay rem in Tokens Studio, not be mistaken for em and turned into a percentage. See docs/formats.md for the public standards and explicit 16px assumption when converting mixed px/rem ratios. Existing design typography values remain unchanged.

Automated browser result: pending the revision run. New original-control coverage complements the existing 24 pattern visual comparisons; those baselines and thresholds are unchanged.

Live Stitch/Tokens Studio imports, screen readers, physical devices, actual browser zoom, cold-network measurements and independent LLM outputs remain pending. Automated fixtures and emulator captures do not establish those results.
