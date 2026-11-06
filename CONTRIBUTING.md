# Contributing

Start with a concrete consumer need and a small example showing where the existing collection falls short. Propose the scope through this repository's issues. Do not add a widget solely to match another library's inventory.

Before changing code, record the plan in audit/CHANGELOG.md. Edit canonical design sources and authored components; rebuild derived files. Keep Midnight/dark unless changing the default is explicitly part of the request.

Run npm ci, npm run build, npm run check, npm run check:external and npm run test:browser. CI repeats these checks and attaches browser artifacts. Review rendered screenshots; automated output is not a visual approval. Resolve failures before merging. For dependency updates, preserve the pinned lockfile and run npm audit. Optional funding metadata is omitted from the distributed lockfile to keep repository references within the publication policy; package integrity and dependency data remain unchanged.

Every component needs: purpose, when not to use it, state/API contract, keyboard and assistive-technology behavior, example, tests, and supported environments. Every design needs: complete roles, licensed fonts, supported-mode previews, token checks and actual readable application screens. Every adapter needs: source/version, generation path, consumer checks and known loss mappings.

Publish only public-safe evidence. Preserve licenses and source attribution. Separate untested environments from passing results. Follow docs/support.md for maturity, accessibility acceptance, deprecation and migration rules.

To update a Linux visual baseline deliberately, run npx playwright test --update-snapshots in the pinned CI-compatible environment, inspect the changed images, and commit them with the reason. Never update snapshots merely to silence a regression.
