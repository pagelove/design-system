# Contributing

Start with a concrete consumer need and a small example showing where the existing collection falls short. Propose the scope through this repository's [issues](https://github.com/pagelove/design-system/issues). Use [SUPPORT.md](SUPPORT.md) for usage questions. Do not add a widget solely to match another library's inventory.

## Prepare a change

1. Clone the repository, or fork it first if you do not have write access. Use Node.js 22+ with npm.
2. Create a focused branch, for example `git switch -c codex/describe-the-change`.
3. Read the [repository map](docs/repository-map.md) and the guide for the area you intend to edit.
4. Before implementation, record the plan in [audit/CHANGELOG.md](audit/CHANGELOG.md). Edit canonical sources and authored components; rebuild derived files. Keep Midnight/dark unless changing the default is explicitly part of the request.

## Validate the result

```sh
npm ci --ignore-scripts
npm run build
npm run check
npm run check:external
```

For UI, interaction or browser-facing asset changes, also install the pinned browsers and run:

```sh
npx playwright install
npm run test:browser
```

On Linux, browser installation may require `npx playwright install --with-deps`; CI uses the pinned container described in the [support contract](docs/support.md). Local Windows/macOS runs exercise browser tasks but do not execute the Linux-only pixel comparisons.

CI runs the full suite and attaches browser artifacts. Review rendered screenshots for UI changes; automated output is not a visual approval. Resolve failures before merging. Documentation-only changes still need generation and core/external checks; validate new commands, file links and section anchors. A browser task run is also useful when adding runnable integration instructions.

For dependency updates, preserve the pinned lockfile and run `npm audit`. Optional funding metadata is omitted from the distributed lockfile to keep repository references within the publication policy; package integrity and dependency data remain unchanged.

## Contribution requirements

Every component needs: purpose, when not to use it, state/API contract, keyboard and assistive-technology behavior, example, tests, and supported environments. Every design needs: complete roles, licensed fonts, supported-mode previews, token checks and actual readable application screens. Every adapter needs: source/version, generation path, consumer checks and known loss mappings.

Publish only public-safe evidence. Preserve licenses and source attribution. Separate untested environments from passing results. Follow [the support contract](docs/support.md) for maturity, accessibility acceptance, deprecation and migration rules.

To update a Linux visual baseline deliberately, run `npx playwright test --update-snapshots` in the pinned CI-compatible environment, inspect the changed images, and commit them with the reason. Never update snapshots merely to silence a regression.

## Submit a pull request

Describe the consumer problem and resulting behavior, summarize actual checks, and state compatibility or verification limits. Include public-safe rendered evidence for UI changes, generated outputs and the matching change-history entry. Use the pull-request checklist and keep the change focused. Discuss the work respectfully and explain decisions with concrete examples.
