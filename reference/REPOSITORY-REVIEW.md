# Repository organization and README review

Reviewed November 6, 2026. This documentation revision applies to collection 0.6.1 and preserves its five designs, eight supported modes, Midnight/dark default and public bundle paths.

## Assessment

The existing directory layout is suitable for a portable source collection: canonical values, generated bundles, runnable examples and retained evidence have distinct roles. The main weakness was discovery. The README mixed onboarding with detailed review history, and readers had to infer which files were editable.

The revised README provides a clear route from previewing the collection to using it in an app, choosing a design and finding help. Folder indexes explain the rest of the repository. Public asset and integration paths are preserved because moving them would require changes to relative imports and consumer links.

## Gaps addressed

| Area | Before | Revision |
| --- | --- | --- |
| Project purpose | Portable formats were described, but the package/distribution model was easy to misread | State that this is a source collection, with no published npm component package |
| First use | Installation and commands were scattered; no clone-to-preview sequence | Give Node/npm requirements, a complete quick start, preview URL and stop instruction |
| App integration | Only the HTML attributes were shown | Include a complete minimal HTML file and the CSS/font folders it needs |
| Design selection | Default rules were present but buried among other details | Put Midnight first, show supported modes and link precise selection rules |
| AI and design tools | No focused onboarding route | Explain catalog-first agent use, task-specific context, manifests and mode-specific Stitch files |
| File ownership | No directory map; generated and editable content were mixed in listings | Add a source-to-output explanation, directory responsibilities and root-file map |
| Navigation | Guides, demos, reviews and evidence had no landing indexes | Add indexes in docs, examples, reference and audit, with return/help links |
| Help and contributions | Contribution prose existed, but no direct help entry or local issue/PR templates | Add SUPPORT.md, bug/change templates, a PR checklist and executable contributor commands |
| Current information | Support guide named 0.5.2; review links did not include the newest scope | Point to authoritative release metadata and the review index; refresh generated context copies |
| Readability | Eight top-level sections, repeated details and historical review links mixed into onboarding | Five top-level sections, task-based tables, one representative image and linked detail; README reduced from 909 to 824 whitespace-delimited words |
| Reuse terms | License exceptions were separated from the main onboarding flow | Summarize MIT, CC BY and font-license boundaries together with notices/provenance links |

## Organization after revision

- [README](../README.md): first-use instructions and project overview.
- [Documentation index](../docs/README.md): task-based guide selection and reading paths.
- [Repository map](../docs/repository-map.md): canonical sources, generated outputs and directory ownership.
- [Example index](../examples/README.md): runnable pages, local serving and integration limits.
- [Review index](README.md): current and historical reports, provenance and inventories.
- [Audit index](../audit/README.md): scoped check receipts, change history and integrity records.
- [Support](../SUPPORT.md) and [contributing](../CONTRIBUTING.md): questions, reports, implementation and submission.

The README follows GitHub's guidance to explain purpose, usefulness, getting started, help and maintainers, with relative links for repository content and longer material in focused guides. See [GitHub's README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes). Repository-local support and contribution templates follow [GitHub's community-file conventions](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file). These are criteria for this review, not a claim of GitHub certification.

## Verification

Verification results are recorded in [repository-documentation-checks.json](../audit/repository-documentation-checks.json).

- A clean pinned installation, generation, core checks and independent format/framework validators pass.
- All 167 local links and eight section anchors in the 15 changed documentation files resolve. Indexes cover all 14 guides, 12 reports and 18 distributed folders. Both issue templates have valid metadata.
- The README's exact HTML example works in Chromium using only the documented `styles/` and `assets/fonts/` folders: Midnight/dark, loaded Inter font and no failed asset requests.
- GitHub-rendered Markdown was inspected in a local review wrapper at 1120px and 390px. It has one title, five main sections and no document overflow. The large workspace screenshot is expandable so the quick start remains easy to reach. This verifies the content layout, not a pixel-identical copy of GitHub's interface.
- Existing runtime sources, design values, integration paths and visual baselines are unchanged. Hosted validation runs the complete browser suite separately.

## Boundaries

The revision changes documentation and contribution templates. It does not add a hosted demo, publish an npm package or promote preview adapters to verified live-tool integrations. The local server instructions make the demo location explicit. Existing support and licensing boundaries remain authoritative.

Issues are enabled; Discussions are disabled. Templates are checked without submitting issues or pull requests. A private vulnerability-reporting channel or organization-wide governance policy is not asserted where none has been verified. GitHub currently identifies the root license as Other; the file includes an exception. The README and NOTICE state the actual MIT/CC BY/OFL terms rather than claiming an inaccurate platform badge.
