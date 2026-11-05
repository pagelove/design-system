# Stitch integration

Use [DESIGN.md](DESIGN.md) as the portable design-system description when starting or prompting a Stitch project. It includes YAML design tokens and Markdown rationale. Google documents the format at https://stitch.withgoogle.com/docs/design-md/specification.

The root DESIGN.md and this copy are generated from `templates/design-guide.md`. Run `npm run build` after editing the template or tokens. Keep project-specific descriptions and IDs in the consuming project, rather than adding account metadata to this reusable library.

Read designs/catalog.json to choose a design. Use designs/<id>/.stitch/DESIGN.md for a requested design; the root copy represents the catalog default and its initial mode. Each guide lists available modes and its own colors/fonts/shapes. Review generated screens against the selected component and accessibility contracts. This repo does not claim a live Stitch import or screen-generation test has passed.
