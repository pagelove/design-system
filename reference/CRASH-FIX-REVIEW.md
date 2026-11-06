# Crash-fix review

Reviewed 2026-11-06T16:55:07.591Z. The observed test crashes remain resolved by the stable Playwright 1.64.1 mitigation. This review strengthens regression coverage and maintenance checks; it does not change the five designs, eight modes or Midnight/dark default.

## Findings and revisions

| Gap | Revision | Result |
| --- | --- | --- |
| Package, lockfile and CI versions could drift independently | Added validation of installed versions, nested driver copies, dependency edges, linked override and CI image tag/digest syntax | Fixed; one valid case passes and eight invalid configurations are rejected |
| Regression scans did not prove the crash-triggering rule covered the affected regions | Removed the WCAG tag filter from this small fixture; assert exact labelled-region targets; retain scan results; exercise named region lookups before and after scans | Fixed; six cases pass in Chromium, Firefox and WebKit |
| Recovery and upgrade instructions were incomplete | Added reinstall steps, focused reproduction, sequential validation and candidate-version Linux acceptance | Fixed |
| Windows results cannot validate the changed Linux browser images or pixel baselines | Kept Linux execution as an acceptance requirement; did not update baselines | Unverified; no Docker or installed WSL environment was available |

## Goal coverage

The original goal was to restore complete browser tasks without weakening accessibility checks or altering the independent apps. The earlier [crash receipt](../audit/firefox-crash-checks.json) retains 177 passing repository cases, 45 passing trial groups and 27 completed WCAG-tagged scans. Its 18 manual contrast-review states remain open. Those are earlier results, not a new full-suite run.

This review used a clean CI-style dependency installation and reran the changed validation and regression surfaces. Build, core and external checks pass. The final six browser cases have zero failures, skipped cases or flaky results. Their six default-rule scans have zero reported violations and zero incomplete results, and explicitly cover the original labelled section and newly added labelled article. Applicable rules and inapplicable outcomes are recorded separately in the [review receipt](../audit/firefox-crash-review.json). No accessibility rule was suppressed.

The version guard checks digest syntax and version agreement; a replacement image digest still requires verification against the official registry. Historical phrases such as full scan refer to scanning the complete fixture within the configured rule scope; they do not mean every axe rule or full WCAG conformance.

## Evidence and remaining limits

- [Regression tests](../tests/aria-audit-regression.spec.mjs), [version validator](../scripts/check-browser-environment.mjs), and [invalid-configuration tests](../scripts/check-browser-environment.test.mjs).
- [Contributor recovery steps](../CONTRIBUTING.md#validate-the-result) and [browser acceptance contract](../docs/support.md#browser-and-accessibility-acceptance).
- The [upstream Firefox issue](https://bugzilla.mozilla.org/show_bug.cgi?id=2090055), script-assigned reference labels, actual devices, assistive technology and live Stitch/Figma imports remain outside this fix's verified scope.
- Windows checks do not approve Linux visual baselines. The changed hosted workflow still needs a run before merge.

No commit or push was made. Earlier evidence and the original trial outputs are preserved.
