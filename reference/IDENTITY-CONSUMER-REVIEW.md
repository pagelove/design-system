# Identity customization review

Release 0.6.1 reviews the favicon and social-sharing work against the goals of reusable identity, multiple designs, portable assets and reliable app customization. Five designs, eight supported modes and Midnight/dark as the default are preserved.

## Findings and revisions

| Reproduced gap | Revision | Regression evidence |
| --- | --- | --- |
| SVG root fill/stroke settings were discarded, turning an ordinary outlined logo into a filled shape | Parse static geometry and retain presentation attributes; report unsupported or invisible artwork explicitly | Independently rasterized outline, plus browser pixel checks in three engines |
| A full-viewBox replacement logo extended beyond the maskable safe circle | Use separate maskable padding and clip artwork to its declared viewBox | Full-square source remains within the safe circle, with an opaque background |
| A custom social image could only be configured per page | Add optional site-wide `social.image`; use page custom, page generated, site custom, then catalog default precedence | Custom/default/generated cases, including a selected design's default mode |
| Normalized public URLs were handled inconsistently; filename and canonical collisions were possible | Share URL validation, normalize the base once, reject duplicate routes and reserved output names, and retain explicit local preview paths | Uppercase host/default-port/subpath fixture; invalid path/image and duplicate-name fixtures |
| Unbounded template sizes could stall fitting; odd sizes missed the minimum; rem radii were treated as pixels | Validate template fields, bound fitting, always try the minimum, and convert px/rem geometry | Oversized/invalid template inputs, exact 48px fit from a 49px start, and 1.5rem frame rendered at 24px |
| A late render failure partially overwrote existing assets, and cleanup records were validated after writes | Render into memory and validate every output/cleanup path before writes; delete only obsolete recorded outputs | Every output hash stays unchanged after an unsupported-glyph render failure and an invalid cleanup record |

Earlier tests exercised the bundled mark and normal configuration successfully. They did not cover these replacement inputs or assert that failed builds preserved existing files. The added checks target those missed boundaries and are part of the normal validation command.

## Verification

Clean pinned installation reports no dependency vulnerabilities. Generation, deterministic rebuild checks, public-content/link checks, selected contrast checks and independent format/framework validators pass. See [core and asset results](../audit/identity-consumer-core-checks.json) and [external validator results](../audit/identity-consumer-external-checks.json).

All **171 browser cases** pass locally across Chromium, Firefox and WebKit, with zero failures, skips or flaky cases. This includes 33 identity/sharing cases. A final three-case rerun verified the corrected replacement-icon capture layout. See the [browser receipt](../audit/identity-consumer-browser-checks.json).

Inspected the complete eight-mode preview, its 320px reduced-motion layout and the replacement artwork capture. The outline retains its open center; the full-square mark fits inside a circular crop. Existing app visual baselines are unchanged.

![Replacement artwork checks: preserved outline and maskable full-square source](../assets/previews/identity-replacement-icons.png)

## Limits

The local Windows run does not execute the existing Linux-only pixel comparisons; hosted results are reported separately. Live social-platform crawlers, cache invalidation, physical-device installation and full Next/Nuxt consuming applications remain separate acceptance tasks.

The mark importer supports documented static SVG shapes and presentation attributes. It rejects unsupported features instead of silently dropping them. Generated social images still require bundled-font coverage, including when metadata selects a custom site image, because the full design collection is generated. Unsupported writing systems can use prebuilt imagery with the metadata helper.

Preflight preserves previous assets on validation or rendering failures. Final filesystem writes are not a transaction: an I/O failure during writing may still require restoration and rebuilding. The sample identity and reserved example URLs must be replaced before an app is published.
