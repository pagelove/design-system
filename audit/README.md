# Audit evidence

This directory retains public-safe change history and check results. Records describe a particular review or run; they are not a universal certification of the current checkout. Pair each receipt with its report, release or commit and stated limits.

## Start here

| Record | Purpose |
| --- | --- |
| [CHANGELOG.md](CHANGELOG.md) | Scoped plans and implementation batches, with UTC timestamps and verification |
| [files.sha256](files.sha256) | SHA-256 hashes of distributed tracked/unignored files; excludes the manifest itself |
| [Crash-fix review checks](firefox-crash-review.json) | Version-drift rejection, strengthened scan coverage and remaining Linux acceptance |
| [Firefox crash checks](firefox-crash-checks.json) | Reproduced label-reference crash, stable test-runner mitigation and regression results |
| [Repository documentation checks](repository-documentation-checks.json) | README navigation, input ownership, command and clean-copy integration checks |
| [Identity consumer core checks](identity-consumer-core-checks.json) | Replacement-input regressions and collection validation |
| [Identity consumer external checks](identity-consumer-external-checks.json) | Independent format/tool validators |
| [Identity consumer browser checks](identity-consumer-browser-checks.json) | Local three-engine browser receipt and its environment limits |
| [Wider browser checks](wider-browser-checks.json) | Earlier all-mode app tasks and rendered behavior |

Earlier `identity-*`, `core-controls-*`, `consistency-*`, `research-*`, `portability-*`, `polish-*`, `gallery-*`, `design-*` and `automated-checks.json` files are retained historical receipts. Find their context through the [review index](../reference/README.md). Use [release notes](../docs/releases.md) for consumer-facing changes.

## Recording new evidence

Append to the change history rather than rewriting earlier records. Record the actual command, result, environment and limits. Store a new receipt for a new review; keep screenshots in the appropriate preview/evidence location. Do not publish raw logs that contain credentials, private data or personal paths.

Refresh `files.sha256` after finalizing distributed file contents, using binary SHA-256 hashes and repository-relative paths in sorted order. This integrity list is not a signature or an independent security audit. Local browser output in ignored `test-results/` is temporary; retain only public-safe evidence needed to explain a result.
