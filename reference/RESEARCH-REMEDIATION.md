# Research remediation — 0.4.0

The research findings have been translated into source changes, generation paths, acceptance criteria and tests. Midnight/dark remains default.

Implemented: undefined hover token fix; consistent integration/font/default wording; XML release/schema separation; typed Tokens Studio properties; DTCG resolver and composite typography; per-mode Stitch role/component mappings; pinned official Stitch lint and JSON Schema validation; public CSS reference validation; Tailwind adapter and compiler smoke test; reusable app patterns; RTL/text-spacing fixtures; WOFF2 assets and size budgets; release/support/contribution/content guidance; independent-agent evaluation briefs.

Local evidence: core deterministic/export checks and external schema/adapter/Stitch/Tailwind checks pass. Stitch linter reports zero errors; unused-role warnings are accepted because complete palettes intentionally exceed the small reference component mapping. Pinned validation dependencies audit with zero reported vulnerabilities after applying the patched Zod override; the official linter was rerun with the override. Dependency funding metadata is omitted from the lockfile to preserve the public repository-link policy.

Browser evidence: direct inspection of native tabs, Cancel focus, Escape focus return, form-error summary, and a combined Forest/dark RTL + 200% text + text-spacing fixture. An initial long-word overflow was corrected with wrapping. The corrected 320px fixture has body width/scroll width 305/305. Screenshot: assets/previews/app-patterns.png.

CI status: awaiting the first hosted run of the new three-engine suite. It runs all eight design/mode combinations plus gallery checks, interaction tasks, axe checks, responsive states and reduced-motion/forced-color emulation. Screenshots are review artifacts, not yet an approved pixel-diff baseline.

Remaining evidence: live Stitch and Tokens Studio imports, screen-reader/physical-device/actual-zoom checks, measured cold-network performance and independent-agent outputs. These cannot be replaced by lint, desktop emulation or self-scoring. Procedures and statuses are in docs/support.md and reference/agent-evaluation.json. No configured live design-tool connector was available during this work.

Optional native UI packages, chart palettes and additional app archetypes remain outside the source collection’s supported contract; their acceptance requirements are documented rather than represented by untested adapters.

Sources: official DTCG 2025.10 format/resolver specifications; Google’s published DESIGN.md format and validator; Tokens Studio token-type documentation; W3C APG, text-spacing and internationalization guidance. See docs/formats.md and docs/accessibility.md for primary standards links.
