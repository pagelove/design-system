# Releases

## 0.4.0

Midnight/dark remains the default; all five designs retain their supported modes.

- Corrected gallery hover token, font/standalone documentation and default-color wording.
- Added typed Tokens Studio properties and typography composites. Some font stacks reduce to the first family in this adapter; original CSS is retained in other exports.
- Added per-mode Stitch guides with full semantic palettes and component mappings. The initial guide paths remain compatible.
- Added DTCG typography composites and resolver documents. Existing foundation/mode files remain available; a resolver adds the typography set automatically.
- Added manifests with release/schema versions and a Tailwind v4 CSS adapter.
- Added reusable native app patterns, RTL/mixed-script fixtures and text-spacing tests.
- Added pinned external validators, automated CI, browser/axe task tests and performance budgets. See the support matrix for unverified environments.
- Added smaller WOFF2 web fonts; original TTFs and licenses remain. Deploy the new WOFF2 files with styles/fonts.css.

Migration: XML consumers should use schema-version for the interchange shape and release-version for the collection release. Tokens Studio consumers should reimport the generated sets so former other values gain their proper types. Existing CSS/JSON mode selection rules are unchanged. Pattern examples use JavaScript modules and should be served over HTTP with npm run serve.
