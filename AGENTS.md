# Instructions for design-system consumers and contributors

- Read README.md, DESIGN.md and docs/document-first.md before app implementation. Read only the additional guides relevant to the requested task.
- Prefer semantic HTML for document-based domain information and DOM-backed editing. Required interchange, external authorities and specialized runtimes are justified exceptions. Token JSON does not change this app-data preference.
- Use tokens/foundations.json, tokens/semantic.json and tokens/profiles.json as the editable design values. Regenerate dependent files with `npm run build`; do not independently edit exports.
- Use semantic CSS tokens in components; add a named role rather than hardcoding a new palette value. Treat editorial/invitation profiles as optional, not implicit overrides of app semantics.
- Keep visible labels, native control semantics, keyboard operation, focus and useful status text. Use neutral panel borders. Do not add decorative northeast arrow icons or colored card rails.
- Retain provenance and license notices. Keep operational records, credentials, personal paths and organization-private material out of the public repository. Repository links must be within the pagelove organization.
- Record a scoped plan and meaningful change batches in audit/CHANGELOG.md, with UTC time, actor, rationale, affected files and verification. Preserve previous records.
- Run `npm run build` and `npm run check`. For UI changes, separately inspect browser tasks and responsive/reduced-motion states. State tool or environment limits; static checks do not prove browser behavior.
- Framework adapters are examples, not packaged component libraries. Do not claim a Figma/Stitch/native import passed without actually testing it in that tool.
