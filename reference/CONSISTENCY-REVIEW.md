# Collection consistency review — 0.5.0

Scope: the original goals of multiple complete designs, Midnight/dark as default, portable design files, reusable premium app components and accurate public documentation.

| Gap found | Revision | Verification |
| --- | --- | --- |
| Midnight, Invitation and the root DTCG resolver exposed a one-context modifier | Generate unconditional sets for single-mode bundles; retain mode modifiers for multi-mode bundles | A reference-driven consumer checks composition, defaults, parity, cycles, unsupported inputs and override order |
| Pattern buttons used the input radius, and panel spacing was hardcoded | Use separate button/input geometry and per-design panel/section spacing | Browser assertions compare computed values with each design's resolved tokens |
| Loading the pattern stylesheet changed unrelated dialogs and tables | Scope selectors to the helpers' own hooks; keep preview stress styles separate | Host integration fixture compares computed styles before and after loading |
| Delegated tab handling captured unrelated tab widgets | Limit handlers to owned groups and retain cleanup | Host keyboard handling, independent groups and cleanup are exercised |
| Native confirmation did not wrap reverse Tab from its first control | Add an opening-scoped Tab/Shift+Tab loop and remove it on close | Direct reproduction plus forward/reverse wrap, Escape and repeated opening |
| A saved form message could remain after later edits or invalid submissions | Clear stale feedback on edits and each submission | Valid-to-invalid-to-recovered task sequence |
| The new pattern preview could not switch designs in place | Add supported design/mode controls, history, draft preservation and selected-mode guide links | Selection, links, back/forward, reload and dark-only cases |
| Reflow checks allowed scrollbar-width overflow; screenshot failure prevented later task checks | Compare scrollWidth with clientWidth and keep task checks running after visual mismatch | All supported modes, narrow layouts, RTL, enlarged text and visual comparison |
| Breadcrumb links rejected normal extensionless relative routes | Parse URLs and accept safe relative routes; continue rejecting executable schemes and network-path forms | Positive route cases plus negative unsafe-input cases |

The DTCG change follows its [contexts recommendation](https://www.designtokens.org/TR/2025.10/resolver/#contexts): single-context variation belongs in a set. This is a bounded resolver consumer, not full specification certification. Version 0.5.0 includes migration notes for consumers that previously assumed every resolver had a mode modifier.

Direct browser review confirmed Classic's 100px button radius, preserved drafts while switching Forest modes, unchanged host styles, and independent host/pattern tab navigation. The combined Forest/dark RTL, 200% text and expanded-spacing fixture fits a 320px viewport with scroll/client widths 305/305. Existing design palettes, typography and default selection are preserved.

Automated result: pending the review run and deliberate visual-reference update. Reference images must be inspected before replacement; comparison thresholds stay unchanged.

Remaining verification is unchanged: live Stitch/Tokens Studio imports, screen readers, physical devices, actual browser zoom, measured cold-network performance and independent LLM outputs. They are not inferred from browser emulation or lint. See docs/support.md and reference/agent-evaluation.json.
