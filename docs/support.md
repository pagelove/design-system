# Support and verification contract

Version 0.5.1 retains Midnight/dark as the collection default. This is a source collection, not an installed framework component library.

| Surface | Maturity | Evidence and boundary |
| --- | --- | --- |
| Five designs / eight modes, CSS and resolved JSON | Supported source contract | Deterministic generation, alias/value checks, selected contrast pairs |
| DTCG tokens and per-design resolver | Preview adapter | Typed values, typography composites, reference-driven composition and mode checks; dark-only bundles use sets; not full-spec certification |
| Tokens Studio | Preview adapter | Typed values and composite typography generated; live Figma application remains pending |
| Stitch guides | Preview adapter | Pinned official linter; exact role parity per mode; live Stitch import remains pending |
| Tailwind v4 | Preview adapter | Generated theme mapping; compile smoke check; load design theme before adapter |
| HTML helpers and patterns | Preview components | Escaping, semantics and task fixtures; no persistence or service integration |
| React/Vue/Svelte snippets | Illustrative only | Not compiled packages |
| Swift/Kotlin dictionaries | Interchange only | CSS strings, not native UI values |

## Browser and accessibility acceptance

CI targets pinned Playwright Chromium, Firefox and WebKit in a digest-pinned Ubuntu Noble container matching the Playwright package version. Update both pins together. This follows the [official CI container guidance](https://playwright.dev/docs/ci#via-containers) and avoids downloading system dependencies on each run. These are test engines, not a promise that every historical browser release works. Real Safari/iOS, Android, NVDA and VoiceOver results must be recorded separately. Latest test artifacts and reference/CORE-CONTROLS-REVIEW.md give actual results; configured tests are not evidence that a run passed.

Every new component must cover visible labels, keyboard path, focus, disabled/pending/error/empty states where relevant, and safe insertion of text. For dialogs: initial focus, containment, Escape, and return focus. For tabs: arrow/Home/End keys, selected state and linked panels. For forms: error summary focus, associated inline errors, retained values and recovery. For tables: captions, column semantics, sort state, pagination boundaries and named scrolling regions.

Required environment checks: 320/768/1440 CSS px; 200% text; WCAG text-spacing overrides; RTL/mixed-direction text; reduced motion; forced colors; actual zoom; virtual keyboard occlusion; NVDA/Firefox and VoiceOver/Safari tasks. Automation covers a subset, and never substitutes for the latter manual checks. Results are pass/fail/untested, with build, browser/AT version, operating system, action and evidence.

The original helper fixture at tests/fixtures/core-controls.html exercises checkbox checked/mixed states, native radio/switch keyboard paths, disabled choices, icon-only pending names, all six determinate progress sizes, RTL/enlarged-text reflow and native forced-color fallbacks. Tests also verify selected-mode guide links across catalog, workspace, gallery and standalone previews. These extend automated coverage without replacing manual acceptance.

## Live import acceptance procedure

1. Record the target tool/version and the design/mode. Use an empty disposable document.
2. For Tokens Studio, import exports/tokens-studio.json, enable global plus one mode, and apply dimensions, radius, fonts and colors to a panel, button and text. Check resolved values, not just token presence. The font family adapter uses the first family; CSS preserves fallbacks. CSS-only properties remain explicitly typed other.
3. For Stitch, import .stitch/MODE.DESIGN.md, request the same panel/button/form, and compare surfaces, text, typography, shape and component states. Repeat all eight combinations. Do not infer support from lint success.
4. Save a public-safe screenshot, observed differences and a result. Failed or missing evidence keeps the adapter in Preview status.

No account connections for these live imports are configured in this checkout's automated workflow. Contributors can supply results using this procedure.

## Performance budgets

The WOFF2 archive must stay under 2 MB, the collection theme CSS under 250 KB and gallery HTML under 30 KB. These are build-size guards, not network timing guarantees. The current 18 WOFF2 fonts total approximately 1.24 MB; only used faces are normally fetched. Preserve TTF originals and all OFL notices. Do not preload every face.

Before hosting, measure cold-cache gallery and workspace loads on a representative mobile connection: font bytes fetched, LCP, CLS, image transfer and responsiveness. Investigate regressions against the previous release. Real network/physical-device measurements remain a separate acceptance task.

## Release and migration

Package releaseVersion identifies the shipped collection. Catalog/schemaVersion identifies an interchange contract; XML explicitly separates schema-version and release-version. Until 1.0, breaking public token, selector or helper changes require a minor release, migration notes and before/after examples. Compatible fixes use a patch release.

Avoid silent removals: introduce replacement aliases, mark deprecation in documentation, retain them for at least one subsequent minor release and document removal. Changing the default is an intentional consumer-visible change, never an incidental build consequence. Promote an adapter from Preview only after its consumer checks and live import evidence exist.

See docs/releases.md for changes and CONTRIBUTING.md for contribution requirements.

Visual regression compares the eight desktop pattern states in each of three pinned Linux browser engines against tests/visual. It allows at most 0.2% differing pixels for rendering noise. Baselines are not refreshed automatically; inspect changes before replacing them. Local non-Linux runs annotate that pixel comparison is not run, while retaining task checks. Mobile/RTL/forced-color captures remain review artifacts rather than pixel baselines.
