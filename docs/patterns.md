# Application patterns

## Settings and forms

Present related settings in named groups with visible labels. Choose whether changes apply immediately or on Save, and explain that behavior. Keep pending, accepted and rejected state distinct. Preserve dirty work on a failed request. For shared state, handle a changed revision explicitly rather than overwriting newer data.

## Collections and detail views

Use stable IDs and meaningful item names. Keep filters, counts and empty/no-results explanations connected. Preserve context when moving into a detail view and back. Distinguish no matching items, no permission and an unavailable source. A read-only detail page can still expose useful source/freshness information.

## Editors

Keep the authored resource separate from preview UI and temporary tools. Use semantic HTML/DOM-backed editing for document-based information. Validate imports before replacement, preserve complete structure on round trips, and define undo, drafts and version compatibility. A preview or test run must not silently publish work.

## Dashboards and reports

Show units, relevant time windows and source freshness. Provide text/table equivalents for meaningful charts. A status should reflect the evidence actually known, with an explicit unknown state when appropriate. Do not make decorative metrics look like verified business outcomes.

## Editorial pages

Use a minimal header, readable serif heading, short explanation, concrete evidence and one primary next step. Vary narrative, code, diagrams and comparisons instead of repeating an identical card grid. A light editorial profile and a dark invitation profile are available without forcing every app to use a marketing layout.

## Presentations and reading views

For an HTML deck, 1280×720 with roughly 72px side clearance is a starting canvas. Use approximately 50px headings, 72px cover titles, 27px body and 23px short code examples; verify at actual scaled viewing size. Reduce content instead of shrinking everything. Provide a semantic reading view that reflows without depending on presenter JavaScript. Notes and presenter tooling are separate from the audience content.

## Sharing and handoff

Explain the output's destination and actual save/share state. Provide meaningful page titles and descriptions, responsive imagery and alternative text. Retain source and license notices. Treat a copied link, saved local draft, service acceptance and final delivery as distinct outcomes.
