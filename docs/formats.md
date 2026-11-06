# Formats and conversion contracts

Shared foundation/semantic JSON, designs/catalog.json and each designs/<id>/design.json are the editable design values. `npm run build` generates the full set of formats under every design, with default-compatible copies at the repository root. Component source and guidance remain authored files. An adapter must identify its source and limitations; never maintain competing manually edited exports. Modes follow each design's declaration; do not assume every bundle has a light entry.

## Supported representations

- Markdown and plain text: human/agent guidance and context bundles. README and AGENTS.md are entry points. `llms.txt` is an optional documentation index, not a guaranteed ingestion mechanism.
- JSON: canonical design interchange and resolved exports. This is a design-tool requirement, not a new default for application domain data.
- JSON Schema: `schemas/semantic.schema.json` describes the semantic source's shape and alias syntax using draft 2020-12. Alias resolution is separately checked by the build. Other interchange outputs do not claim this schema applies to them.
- DTCG 2025.10: typed color, dimension, number, font, duration, cubic-bezier, gradient and shadow values. Load a design's `foundations.tokens.json` plus exactly one of its available mode files. Appearance aliases inherit the target type. Transition durations use duration objects; relative tracking uses numbers with CSS extensions. No-shadow is represented as a transparent zero-size shadow, with the original CSS none preserved in extensions. Unsupported CSS conversions stop the build instead of inventing a DTCG type. Modes are separate files rather than an invented DTCG theme field. Specification: https://www.designtokens.org/TR/2025.10/format/.
- DTCG extension: gradient direction and original CSS strings live under `com.pagelove.design-system` extensions. Relative letter-spacing in em is represented as a number with the original CSS retained; DTCG dimensions use px/rem. Consumers must honor that documented conversion rather than interpreting the number as pixels. Individual properties remain available; tokens/typography.tokens.json adds named composite text styles. Relative tracking is converted to px at that style’s font size; line height becomes a ratio.
- Tokens Studio JSON: global foundation set plus the design's available semantic modes. Enable global and one available mode at a time. Dimensions, font properties, radii and composite typography have supported Tokens Studio types; gradients use color values. CSS-only motion and shadow-none properties remain other. Font stacks reduce to the first family. No plugin import has been claimed tested.
- YAML, XML and CSV: portable structured views. XML is a repository interchange schema, not an Android resource file. YAML scalars are quoted to preserve leading-zero scale IDs and CSS strings.
- CSS, Sass and Less: CSS supplies runtime theme aliases; Sass contains resolved theme maps and Less contains configured-default aliases and explicit mode-prefixed string variables. Native CSS custom properties remain the preferred browser runtime.
- ES module, CommonJS and TypeScript: resolved theme dictionaries; no UI framework dependency. TypeScript adds literal keys/types.
- Swift and Kotlin: portable dictionaries of CSS strings. Parse CSS colors and deliberately map px/rem/em/seconds/fonts to native conventions. These do not pretend CSS pixels are dp, sp, iOS points or physical pixels. Gradients and easing require explicit native adapters.
- HTML and SVG: semantic component examples and inspectable vector palette. Preview screenshots, when present, are supplemental visual evidence and never the editable token source.
- Stitch DESIGN.md: structured YAML values plus descriptive Markdown. The root and `.stitch` copies are generated from the same design template; each selectable design has its own generated guide. No private project IDs or live account metadata are distributed.
- React TSX, Vue SFC and Svelte: small button integration examples. Compile them in the consuming framework/version; they are source examples, not installed framework packages.

## Adding more formats

Preserve originals when supplied, document licensing/provenance and provide portable exports where useful. Do not rename JSON to `.fig`, `.sketch` or another proprietary extension and claim native compatibility. Add a generation path, a bounded validation check and an explicit loss/limitation note for every new adapter.

File readability does not guarantee automatic discovery or accurate visual interpretation. Supply a short entry point, relevant examples and explicit values. Keep guidance concise enough to load by task rather than requiring an entire repository in one context window.

## Consumer checks

The checks execute the ES module and CommonJS exports, parse CSV, and compare all values with the resolved canonical dictionaries for the root and each design. DTCG checks reject unknown emitted types, invalid units, mismatched aliases and malformed supported values. These are stricter repository contract checks, not independent full-spec certification or live proprietary-tool import tests.

Generated additions: per-design DTCG resolver, mode-specific Stitch guides, release manifest and Tailwind v4 @theme inline CSS. Live Figma/Stitch imports remain pending; official Stitch lint is a separate automated check. XML schema-version is 1; release-version tracks package.json.
