# Wider collection review

Review scope: the original public reuse, multiple complete designs, Midnight default, portable formats, premium controls and honest verification goals. This review expands the coverage boundary; it does not certify that every possible integration is defect-free.

## Reproduced gaps and revisions

| Gap | Revision | Regression evidence |
| --- | --- | --- |
| Less font-family exports retained JSON escape characters when compiled | Decode quote/backslash escapes in the generator; reject control characters in this single-line representation | Compile every default and mode variable in all six bundles and compare every output value; punctuation fixture |
| Most secondary formats were checked for presence rather than consumed | Add independent YAML/XML parsing, Sass/Less compilation, TypeScript type checking and execution, text/Markdown and SVG parity | All emitted modes in root plus five design bundles |
| Framework snippets had never been compiled | Pin React, Vue and Svelte development validators and render default, disabled and busy buttons on the server | TypeScript React type check, Vue/Svelte compilers and server-render assertions; client hydration remains separate |
| A cancelled title followed the user into a different collection | Keep drafts by collection, bind creation to the opened collection, close stale dialogs on history navigation | Reproduced directly in browser; cross-collection, Escape and history tests |
| Workspace creation did not use the shared modal focus containment | Reuse the tested modal helper | Initial focus, Tab/Shift+Tab wrapping and return focus |
| Correcting a settings field left its error indication visible until resubmission | Clear that field's error when its edited value becomes valid | Invalid submission, correction, frozen pending payload and reset-during-save tasks |
| Original buttons and fields stayed at 16px under the 200% text preference | Use relative control text sizes and proportional line height in the application layer | Direct browser comparison: 16px before, 32px after; all appearance/size fixtures and narrow reflow |
| Forest light secondary text and several visited-link roles missed 4.5:1 | Strengthen the specific semantic roles and check secondary/action/link states on both supported surfaces | Expanded numeric contrast matrix and browser accessibility checks |
| Font licensing notice still said fonts were not included | Correct the notice to distinguish bundled OFL fonts from family declarations | Public documentation and provenance review |
| CI actions depended on a deprecated runtime and mutable major tags | Verify current official action releases and pin their commits on Node 24 | Clean install and hosted workflow |

## Coverage map

| Area | Coverage in this review | Boundary |
| --- | --- | --- |
| Five designs, eight modes and Midnight/dark default | Canonical schemas, alias resolution, default changes, stale-mode removal, deterministic output, URLs and guide handoffs | Adding a new design still requires its own review |
| CSS and original HTML helpers | Every button appearance/size/state; fields; choices; progress; design typography/geometry; enlarged text and forced colors | Fixtures exercise shipped compositions, not arbitrary host CSS |
| Reusable patterns | Existing tasks for tabs, modal, validation, table sorting/pagination and host isolation retained | Consumer persistence, authorization and services are outside these examples |
| Workspace | All modes: overview, collection search/empty/create, settings errors/recovery, pending edits/reset, narrow RTL/spacing/200% text | Local preview only; no backend or durable storage implied |
| Gallery, catalog, quality and standalone pages | Automated accessibility and 320/768/1440 reflow; nine font checks per quality page; gallery/workspace no-script reading | Static previews and no-script reading do not prove all interactions work without JavaScript |
| JSON, ESM, CJS, CSV, YAML, XML, Sass, Less, TypeScript, text, Markdown, SVG | Independent consumers and complete value parity across all bundles | Emitted subset; XML is not Android resources |
| DTCG and resolver | Types, aliases, composite typography, reference/order/default/cycle checks and complete composition | Repository subset checks, not independent full-spec certification |
| Tokens Studio / Stitch | Typed sets, per-mode values, official Stitch lint and component guide links | Live imports and generated visual fidelity still untested |
| Tailwind / React / Vue / Svelte | Tailwind compile; framework compile and server render | No hydrated app, framework package or broad version compatibility claim |
| Swift / Kotlin | Generated CSS-string dictionaries inspected; source availability retained | Native compilation and platform-specific rendering remain untested |
| Public reuse | MIT/CC BY/OFL notices, provenance, internal-content denylist, repository allowlist, local links and dependency lock review | Automated scanning is not a universal secret detector |
| Performance | Existing font/CSS/HTML byte budgets and actual local font loading | Cold-network timing and real devices remain untested |
| LLM usability | Design selection and default guidance, per-design bundles, manifests and examples | Independent model task outcomes remain untested |

## Results

Final verification receipts are recorded with the release audit. A configured check is not a passing result. Native compiler runs, live design-tool imports, screen readers, physical devices, actual browser zoom and cold-network tests remain explicit acceptance work; see docs/support.md.

## Why this review finds more

Earlier reviews concentrated on individual components and formats. The new coverage consumes previously unchecked exports and follows complete user tasks across screens and states. A passing static check or a single screenshot cannot establish those properties. The coverage map and new checks are retained so the same boundaries are visible in future changes.

Compiler references: [Sass API](https://sass-lang.com/documentation/js-api/), [Less programmatic usage](https://lesscss.org/usage/), [TypeScript compiler options](https://www.typescriptlang.org/tsconfig/), [Vue script setup](https://vuejs.org/api/sfc-script-setup.html), [Svelte compiler](https://svelte.dev/docs/svelte/svelte-compiler).
