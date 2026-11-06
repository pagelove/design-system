# Responsive component behavior review

Initial review: 2026-11-06 on Windows, against local additions to base commit `470ae12ccfcb782ab29c518fb06fa9b9b2d3bce1`. The results below describe that pre-publication snapshot; the hosted follow-up records a subsequent correction. See [PR #2](https://github.com/pagelove/design-system/pull/2) for publication and current check status. Midnight/dark remains the default across five designs and eight supported modes.

The collection now defines how control contents and groups should reflow, supplies six reusable compositions, and requires evidence of actual visual inspection. The reported defects in consuming apps were credible examples of a gap: existing overflow and functionality checks did not establish that individual controls were well composed. This review covers the repository references; the external 16 demos were not independently rechecked.

## Changes

| Gap | Revision |
| --- | --- |
| Wrapping guidance did not distinguish compact values/actions from prose | [Responsive Component Behavior and Visual Acceptance](../docs/responsive.md) defines intact short actions/figures, whole-word prose wrapping, genuine long-label exceptions and recovery when space is insufficient. No blanket nowrap rule. |
| Whole-group reflow lacked reusable reference implementations | [Interactive example](../examples/responsive.html) and opt-in [layout CSS](../styles/responsive.css) cover search/filter/action toolbars, label/select groups, Previous/Next, bulk actions, metrics and dialog actions. |
| Page overflow checks missed local defects | [Browser diagnostic](../tests/helpers/responsive-audit.mjs) checks marked labels, values, words, clipping, compressed controls and shared-row action heights. Broken fixtures prove that these defects can be detected on a page without horizontal overflow. |
| Capturing screenshots could be mistaken for reviewing them | Agent instructions, generated design/Stitch/context guides and contribution requirements now require actual widths, states, settings, inspected screenshots and limits. A [reusable acceptance record](responsive-acceptance-template.md) starts at not-run. |
| Reference review exposed additional composition problems | Visible complete-value mirrors handle long native selects; scoped dialog styles retain semantic action colors; subgrid aligns metric figures; expanded menus and their action groups move onto deliberate rows. |

## Executed checks

| Check | Result and scope |
| --- | --- |
| Clean pinned installation | Passed; dependency audit reported zero vulnerabilities. |
| Generation, core and external validation | Passed again after final guidance and report additions; all generated design/Stitch/context bundles are current. |
| Full repository browser suite | **204 passed**, zero failures, skips or flakes, across Chromium, Firefox and WebKit. This preceded the last expanded-menu row refinement. |
| Final affected-suite rerun | **27 passed**, zero failures, skips or flakes, after that refinement: eight design/mode fixtures × three engines, plus three deliberately broken-layout diagnostic fixtures. These overlap the 204 cases; they are not 231 unique tests. |
| Component geometry | **912 recorded state audits**, zero issues. Each design/mode/engine fixture covers the six requested viewport widths and 12 neighbors around four component transitions. |
| Interaction and accessibility | Search/filter/empty recovery, selection, long destination, navigation, edit validation/save, dialog keyboard/focus/Escape, 200% text/RTL/spacing, forced colors and reduced motion. **48 axe scans**, zero reported violations; all 48 retain `color-contrast` incomplete results. |

The automated matrix uses viewport widths **320, 375, 768, 1024, 1280 and 1768 CSS px**. It also measures actual container widths **448, 464, 704 and 944px**, each at −1/0/+1px. The resulting viewport width accounts for the browser's scrollbar and container padding. Main accessibility scans run at 320px after interaction; dialog validation scans run at 375px. The [machine receipt](../audit/responsive-checks.json) records the executed browser versions, dimensions, exceptions, source hashes and inspection records.

## Screenshot inspection

Codex opened and inspected **38 recorded screenshots**: 37 from a 198-image capture catalog, plus the final enlarged-dialog viewport screenshot. The catalog's uninspected captures do not count as visual acceptance. The selection spans all eight design/mode combinations, all six requested widths and all 12 component-edge neighbors; it is a representative subset, not the complete design × width × state cross-product.

| Inspected subset | Actual coverage |
| --- | --- |
| Eight design/mode combinations at 375px | Classic light toolbar/dark dialog; Editorial light metrics/dark dialog; Forest light toolbar/dark metrics; Invitation dark dialog; Midnight dark menu. |
| Midnight narrow components | At 320px: label/select, paired navigation, bulk actions, metrics and validation dialog. |
| Midnight intermediate/wide | Toolbar at 375/768/1280px, overview at 1024px, menus at 768/1768px. |
| Component transitions | Toolbar at container widths 447/448/449px; metrics at 463/464/465, 703/704/705 and 943/944/945px. |
| Final expanded-menu revision | Reopened screenshots at all six requested widths. The earlier 1768px image exposed excessive blank space above the fields; that image is retained as a superseded failure. |
| Enlarged dialog | 320px, 200% root text, RTL and text-spacing overrides. Save remains fully visible after keyboard focus scrolls the dialog. Whole-word action wrapping and vertical body scrolling are intentional. |

Published component previews: [wide](previews/responsive-toolbar-wide.png), [intermediate](previews/responsive-toolbar-intermediate.png), [narrow](previews/responsive-toolbar-narrow.png). The remaining raw captures and failed/interrupted runs stay in local ignored evidence; their reviewed subset is identified by name and hash in the public receipt.

## Hosted follow-up: enlarged checkbox labels

The first [PR Linux run](https://github.com/pagelove/design-system/actions/runs/42277378677) passed 197 cases and failed seven Chromium cases at 320px with 200% text, RTL and expanded text spacing. The checkbox plus its anonymous text could exceed their group. Windows' root client-width measurement included reserved scrollbar space, masking the small page overflow within the diagnostic tolerance; a local probe nevertheless found 305px of content in the 273px label group.

The checkbox text now occupies a marked flex item and the group can wrap deliberately. The document diagnostic also uses the available root layout width, and an explicit label-container assertion prevents this defect from depending on page-level measurements. All 27 affected local cases pass again with the correction. Nine additional screenshots were opened: the enlarged label in all eight design/mode combinations and Midnight's normal-size bulk group. No clipping or word fragments remain in those inspected fixtures. The original failed run is retained; hosted revalidation is required before merge. The machine receipt's `hostedFollowup` records this revision separately from the earlier passing snapshot.

## Acceptance boundaries

The new guidance, six reference layouts and finite regression checks are implemented. Consuming applications still need their own visual gate and evidence record. These additions do not automatically repair existing applications or certify all possible content.

Actual browser zoom, physical devices, native assistive technology, full localization and the external 16 demos remain untested in this review. Enlarged root text and a narrow viewport are separate checks. Contrast review flags are retained: semantic color assertions and representative screenshots do not establish a complete WCAG pass for every flagged node. Current hosted CI and Linux pixel comparisons have not run; prior hosted results apply to the earlier merged work. Existing design values, default selection and baseline images remain unchanged.
