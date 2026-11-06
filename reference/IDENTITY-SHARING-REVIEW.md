# Identity and social-sharing implementation review

Release 0.6.0 fills the missing favicon and social-preview coverage. It keeps all five designs, eight supported modes and Midnight/dark as the default.

## Coverage

| Requirement | Implementation and evidence |
| --- | --- |
| Identity independent of theme | Shared app name/mark/icon colors; alternate-default check confirms icon bytes stay unchanged |
| Portable icon kit | SVG, 16/32/48px PNG-backed ICO, PNGs, 180px touch icon, 192/512px app icons and 512px maskable icon |
| Per-design sharing images | Eight token-driven 1200×630 PNGs, editable text SVGs, outlined SVGs and layout records |
| Consistent defaults | Root aliases follow catalog defaults; all six export manifests link valid social assets |
| Page overrides | Site fallback, generated page image with design/mode selection, or custom public image with explicit alt text |
| Framework flexibility | Escaped plain HTML, metadata JSON, dependency-free helpers and example Next/Nuxt mappings |
| Long/unsupported content | Actual bundled-font metrics, word/grapheme wrapping and explicit failures for overflow or unsupported glyphs |
| Deployment paths | Public base URL, relative page paths, canonical URLs and image/icon/manifest URLs tested under a subpath |
| Output lifecycle | Removed pages lose their recorded generated outputs; unrelated custom artwork is preserved |
| Discovery and licensing | README, per-design/Stitch guides, context bundles, format docs, asset preview, source provenance and MIT/OFL notices |

## Verified results

Clean pinned installation and dependency audit report no vulnerabilities. Generation, rebuild parity, privacy/link checks, selected contrast checks, asset checks, independent format consumers, framework component validators and official Stitch lint pass. See [core and asset results](../audit/identity-core-checks.json) and [external results](../audit/identity-external-checks.json).

All **168 browser checks** pass locally in the pinned Chromium, Firefox and WebKit versions, with zero failures, skips or flaky cases. This includes **30 new asset checks**, covering PNG/SVG/ICO decoding, rendered normal/long-text bounds, maskable foreground safety, actual HTTP content types, accessibility, 320px reflow and reduced-motion preview. See [browser receipt](../audit/identity-browser-checks.json).

Inspected all eight normal social images, long-title captures, actual-size favicons on light/dark backgrounds, the complete asset preview and representative Firefox/WebKit captures. [Preview capture](../assets/previews/identity-sharing.png) and [interactive asset index](../examples/branding.html) are retained. The new preview shows Midnight first and includes a generated page example.

## Limits

The local Windows run does not execute the existing Linux-only pixel-baseline comparisons. Existing baselines are unchanged. Hosted verification is recorded separately when available.

Social-platform crawlers, preview cache invalidation, home-screen installation on physical devices, full Next/Nuxt consumer builds, native app-store assets and complex-script/RTL social layouts are not certified. The generator explicitly rejects unsupported glyphs instead of silently choosing a system font. The included identity and example.com addresses are placeholders for consumers to replace before deployment.
