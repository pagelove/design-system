# Sources and public adaptation

## Inputs

1. Pagelove design reference, reviewed October 30, 2026: visual principles, core editorial palette, invitation palette, type families, motion, accessibility and presentation proportions. Publicly adapted; private operational sections and project-specific appendices are excluded.
2. Pagelove, *Document-first development for websites and applications*, edition 2.4, November 4, 2026: architectural defaults, authority, editing, enforcement, recovery and evidence. Adapted under CC BY 4.0 with attribution in the distributed guide.
3. Pagelove contributors, *Web Game Development Handbook*, edition 2.14.0, November 1, 2026: reusable player experience, control, layout, audio, performance and recovery guidance. Adapted under its MIT terms.
4. [Public design library](https://plus-jade-0262.onpagelove.com/?path=/docs/foundations-introduction--docs), captured November 4, 2026: the observed foundation values, semantic light/dark roles, typography styles, grid breakpoints, motion and component CSS. The [inventory](library-inventory.json) records all observed stories without copying build infrastructure or framework dependencies.

## Decisions

The published design library supplies Classic's original foundation and the shared scales. Complete design definitions now provide their own palettes, typography, shapes and spacing; designs/catalog.json selects Midnight/dark as the collection default. The older profile values remain historical reference material. Do not mix values from separate designs into the selected design's tokens.

Canonical foundation values were extracted as data literals from published assets using a non-executing parser. Semantic roles and component CSS came from the same published stylesheet. Compiled Storybook/React code, source maps, development dependencies and build-specific asset names are not redistributed. Component helpers and the catalog are public adaptations, not recovered original authoring files.

The public library's source CSS remains in `styles/library-components.css`. `styles/app.css` deliberately increases frequent target sizes, restores normal body/label tracking, uses native password handling, offers a single-input verification-code pattern and stops decorative animation for reduced motion. The original detailed PIN behavior is documented as a separate integration concern. Reference typography is retained but not automatically recommended for ordinary body text.

Internal operating procedures, account/destination configuration, private service addresses, local filesystem paths, private project histories and source-specific verification claims are omitted. Repository references in distributed content are restricted to the Pagelove organization. Official standards and tool documentation may use their public non-repository websites.

## Maintenance

The identity and social-sharing kit is newly authored for this collection. Its replaceable sample mark is not an official organization logo. The five compositions derive their colors and font families from the existing design definitions. The implementation uses pinned development render/font libraries and the bundled licensed typefaces; generated outlined SVG and PNG artwork does not require those libraries at runtime. See docs/identity-and-sharing.md for the public standards and framework guidance used in the integration contract.

The November 5, 2026 collection update preserves Classic as the original baseline and adds public design definitions for Editorial, Forest, Midnight and Invitation. These are authored adaptations of the existing foundation and supplied visual direction, not newly retrieved third-party design files. The complete designs override palettes, fonts, shapes and spacing through shared semantic roles. Their editable definitions are in designs/<id>/design.json; generated copies remain derived outputs. The old profile values remain historical reference material.

Sources are a dated snapshot, not live synchronization. When updating the library snapshot, review its token/variant diff, rebuild adapters and repeat privacy/link/behavior checks. Do not copy a previous verification outcome into a new release as if it had run again. Keep sensitive review evidence outside the public repository.
