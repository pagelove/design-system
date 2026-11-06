# Repository map

The collection keeps editable sources alongside committed generated formats so consumers can use it without running the build. Existing paths are public integration points. Use this map to choose the correct source rather than editing an exported copy.

## Source to output

1. Shared foundations and semantic roles in `tokens/` combine with `designs/<id>/design.json`.
2. `designs/catalog.json` selects registered designs and the collection default.
3. `scripts/build.mjs` creates complete per-design bundles and root copies for the default. Shared templates produce guides and standalone previews.
4. `branding/` sources and resolved design values produce icons, social compositions and metadata.
5. Checks compare generated outputs, exercise independent consumers and validate app examples. Evidence records what was actually run.

## Directory responsibilities

| Location | Purpose | Edit or regenerate? |
| --- | --- | --- |
| [designs/](../designs/) | Catalog and full bundles for each visual design | Edit `catalog.json` and each `design.json`; regenerate `index.json`, guides, tokens, styles, exports and `preview.html`. Retained screenshots are review evidence. |
| [tokens/](../tokens/) | Shared design values and default-design interchange | Edit `foundations.json` and `semantic.json`; regenerate `*.tokens.json` and `tokens.resolver.json`. `profiles.json` is historical reference. |
| [branding/](../branding/) | Stable app identity, vector mark and social composition settings | Edit `site.json`, `mark.svg` and `templates.json`; rebuild. |
| [components/](../components/) | Authored dependency-free HTML, interaction and metadata helpers | Edit source; verify behavior. These are examples for integration, not a packaged framework library. |
| [styles/](../styles/) | Shared CSS and generated theme layers | `app.css` is the multi-design entry point. Edit authored base/product/pattern/font rules as appropriate; theme, foundations, semantic, appearance, typography, profiles, defaults, designs and forced-color layers are generated. `library-components.css` is preserved reference CSS. |
| [templates/](../templates/) | Shared guide and standalone-preview templates | Edit templates; rebuild their copies. |
| [docs/](README.md) | Authored guidance and current support contracts | Edit source documents; rebuild their copies in `llms-full.txt`. |
| [examples/](../examples/README.md) | Runnable demonstrations and framework snippets | Most are authored. Gallery HTML, `design-catalog.js`, `workspace-dialog.js` and the branding preview are generated. |
| [exports/](../exports/) | Portable outputs for the configured default | Regenerate. For a named design use its own `exports/`. Start with `manifest.json`. |
| [.stitch/](../.stitch/) | Default-design and mode-specific Stitch guides | Regenerate. Each named design also has a `.stitch/` directory. |
| [assets/](../assets/) | Licensed fonts, palette, identity/social exports and retained preview images | Preserve font files and notices. Palette, identity and social files are generated; preview screenshots are review evidence. |
| [schemas/](../schemas/) | Contracts for design, semantic, catalog and branding inputs | Edit deliberately; verify compatible input and output behavior. |
| [scripts/](../scripts/) | Generators, validation consumers and local server | Edit implementation sources; run relevant checks. |
| [tests/](../tests/) | Browser tasks, fixtures and Linux visual baselines | Edit meaningful tests; inspect screenshots before deliberately replacing baselines. |
| [.github/](../.github/) | Verification workflow and contribution templates | Edit workflow or templates; preserve pinned validation dependencies. |
| [reference/](../reference/README.md) | Provenance, inventories and dated review reports | Preserve earlier findings and evidence; add a report for a new review. |
| [audit/](../audit/README.md) | Append-only change history, check receipts and file hashes | Append records and add public-safe evidence; refresh the integrity manifest for changed distributions. |
| [profiles/](../profiles/) | Compatibility guides for older visual profiles | Retain redirects; use complete designs for new integrations. |

## Root entry points

| File | Role |
| --- | --- |
| [README.md](../README.md) | Human onboarding and navigation |
| [AGENTS.md](../AGENTS.md) | Instructions for AI consumers and contributors |
| [DESIGN.md](../DESIGN.md) | Generated visual guide for the collection default |
| [llms.txt](../llms.txt) | Authored documentation discovery index |
| [llms-full.txt](../llms-full.txt) | Generated default-design guide plus shared context; each design has its own version |
| [package.json](../package.json), [package-lock.json](../package-lock.json) | Release version, development commands and pinned development dependencies; package is marked private |
| [CONTRIBUTING.md](../CONTRIBUTING.md), [SUPPORT.md](../SUPPORT.md) | How to contribute and get help |
| [LICENSE](../LICENSE), [NOTICE.md](../NOTICE.md) | Reuse terms, exceptions and attribution |

`node_modules/`, `test-results/`, `playwright-report/` and local tool state such as `.taste-skill/` are ignored working files. They are not distributed source folders.

## Safe editing workflow

Choose the canonical source, record the scope in [audit/CHANGELOG.md](../audit/CHANGELOG.md), edit, then run the commands in [CONTRIBUTING.md](../CONTRIBUTING.md). Rebuild generated files before reviewing the diff. Preserve supported modes and the configured default unless changing them is part of the work.

Do not move public bundle paths simply to make the root smaller. A future layout change needs a migration plan for relative font/CSS imports, generated links, metadata URLs and external consumers. Navigation indexes provide a clearer entry point while retaining those paths.
