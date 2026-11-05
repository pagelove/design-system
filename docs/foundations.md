# Foundations

This guide describes the shared Classic baseline and the original reference profiles. The collection now supplies complete selectable designs: read [selection and authoring](designs.md) and the chosen `designs/<id>/DESIGN.md` first. Design-specific overrides replace the relevant colors, fonts, shape and spacing settings. The old profile references below are historical values, not the active runtime selection mechanism.

## Principles

Make the task readable before adding visual emphasis. Pair editorial headings with precise controls and code. Keep structure visible through spacing, neutral dividers and meaningful labels. Give each task one clear primary next step. Use concrete language and show the state the application actually knows.

Cards and boxes use neutral borders without colored side rails. Functional error/focus/selection outlines on controls are allowed; decorative panel borders are not. Use ordinary action text or meaningful icons instead of decorative northeast arrows.

## Default app library

The canonical foundation contains nine color families: polo blue, purple, olive, old rose, hot pink, neon carrot, cornflower blue, malachite and torch red. Preserve the full scales for flexibility; choose semantic roles for ordinary components. Having a bright raw color does not make it a default background or text color.

Semantic themes cover background, border, button, icon, link and text, in light and dark modes. `--text-regular`, `--background-surface-light`, `--button-strong-default` and similar roles are resolved separately in each theme. Set `data-theme="dark"` or `data-theme="light"` on a document or scoped region. Test contrast in each actual context.

The public library supplies four gradients: purple storm, soft bloom, dawn bloom and sky whisper. Their directions and stop positions are preserved in canonical data. Use gradients selectively for branded emphasis. Keep text on a readable solid surface unless its whole background range has been checked.

## Typography

Display: Source Serif 4, with Georgia/serif fallbacks. The published family stack also names Source Serif Pro; it is retained in foundation exports for fidelity. Body/UI: Inter with platform sans-serif fallbacks. Code: Fira Code with system monospace fallbacks. No network font dependency is needed to read the examples. Bundle separately licensed font files for exact production rendering.

The published font-size scale ranges from 10px to 96px. Font weights are 400, 450 and 500. Text styles combine the foundation family, weight, size, line height and letter spacing. They are reference styles, not blanket approval for 10px body text, tight tracking, or line heights shorter than large display glyphs. The app layer uses 16px body text, a 1.5 line-height, normal body tracking and wrapping labels. Check localization, diacritics and 200% text enlargement.

Spacing uses 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 112, 128, 144 and 160 CSS pixels. Names such as `space-075` are scale identifiers, not literal pixel values; `--space-075` is 6px.

## Grids

| Website viewport | Columns | Gutter | Outer margin |
| --- | --- | --- | --- |
| 320–479px | 4 | 16px | 16px |
| 480–767px | 8 | 16px | 32px |
| 768–1023px | 8 | 16px | 32px |
| 1024–1512px | 12 | 24px | 64px |
| 1513px and wider | 12 | 24px | 64px |

The console grid retains 16px gutters and margins: 4 columns at 320–479px, 8 at 480–1023px, then 12. Its larger breakpoints are 1024, 1440 and 1768px. These are layout references, not reasons to crop content below 320px. Use readable content measures and allow narrow content to stack.

## Motion

Published defaults: hover 300ms, exit 500ms, skeleton 1s and spin 800ms; standard easing is ease-in-out. Preserve content while status changes and avoid animating every section. The original exit pattern fades and blurs in place before closing the gap; urgent instructions must stay present long enough to read. The recommended app layer disables decorative animation for reduced motion, including the source library's slower-but-continuing spinner. Keep visible loading text when motion stops.

## Optional profiles

Editorial: white, slate ink `#45556C`, Source Serif 4 headings, Inter body and quiet neutral rules. Restrained lavender/olive accents are available. Lighter reference text `#90A1B9` is not approved for body text on white; use the stronger semantic roles or verify an appropriate large-text context.

Invitation: blue-black `#0C0E1A`, navy surfaces, warm off-white `#E8E4DF`, Fraunces headings, Inter Tight body, JetBrains Mono code, with dusty lavender/clay/rose accents. Low-opacity borders are decorative separators, not sufficient boundaries for every control. Check muted text and gradients independently.

The complete Editorial and Invitation designs now map values to shared semantic roles and can be selected with `data-design`. Original `--profile-*` properties remain only for compatibility/reference. Changing `data-profile` alone does not retheme components. Read each complete design's guide for its current palette and geometry.
