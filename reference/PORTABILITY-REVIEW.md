# Portability and integration review

This review revisits the original goals of flexible formats, independently reusable designs, a consistent default and finished controls. Midnight/dark remains the default; the five established visual directions are preserved.

| Gap | Revision | Verification |
| --- | --- | --- |
| DTCG exports used an unsupported string type | Use supported duration, number and shadow types; infer aliases from their targets; fail explicitly on unsupported conversions | Strict emitted-type/value/alias checks, including negative cases |
| File existence was treated as adapter coverage | Execute ES module and CommonJS exports; parse CSV and compare all values | Root plus all five design bundles compared with canonical resolved dictionaries |
| Independent design integration was unproven | Separate base styling from collection imports; generate one standalone example per design; declare native color scheme in each theme | All eight standalone modes inspected, including keyboard input and mobile layout |
| Preview default handling differed when the global mode differed from a design's local mode | Share one selection resolver across workspace, catalog and quality | Alternate Forest/dark fixture distinguishes unspecified default from explicit Forest/light; unavailable modes fall back correctly |
| Quality selections could not be bookmarked or restored | Update design/mode URL and respond to history; standalone links also preserve mode | Selection, reload and back/forward browser checks |
| Stronger field borders were applied to a borderless inner input | Apply color/radius to the wrapper that actually paints the boundary; reduce excess padding while retaining a 44px input target | Rendered box-shadow matches the strong border token in all eight modes; wrapper height is 56px |

The DTCG corrections follow the [official 2025.10 format specification](https://www.designtokens.org/TR/2025.10/format/). Tracking in em remains a number plus original CSS metadata; no-shadow becomes an invisible zero-size shadow. These representations preserve meaning without claiming arbitrary CSS strings are a standard token type.

Evidence: audit/design-automated-checks.json and audit/portability-browser-checks.json. These checks do not replace independent full-spec certification, proprietary/native imports, framework compilation, assistive-technology reviews or physical-device testing. Earlier review records remain historical.
