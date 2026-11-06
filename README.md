# Pagelove Design Collection

Five complete visual designs for building apps, with shared accessible component patterns and portable files for developers, designers and AI agents.

**Default: Midnight / dark.** Use the files directly or adapt them to your app. This is a source collection, not a published npm component package.

[Get started](#get-started) · [Choose a design](#choose-a-design) · [Documentation](docs/README.md) · [Repository map](docs/repository-map.md) · [Get help](SUPPORT.md)

<details>
<summary>See the Midnight workspace</summary>

![Midnight workspace example with overview, navigation and collection cards](designs/midnight/previews/workspace-dark.png)

</details>

## Get started

### Preview the collection

Install [Node.js 22 or later](https://nodejs.org/en/download), including npm, then run:

```sh
git clone https://github.com/pagelove/design-system.git
cd design-system
npm ci --ignore-scripts
npm run serve
```

Open [http://127.0.0.1:4173/examples/designs.html](http://127.0.0.1:4173/examples/designs.html) to compare designs. The server runs locally; press Ctrl+C to stop it. Generated files are committed, so a build is only needed after editing sources.

GitHub shows HTML source rather than running the demos. After cloning or downloading the repository, you can also open `examples/designs.html` or `examples/catalog.html` directly. Use the local server for the complete examples and browser checks. See the [example index](examples/README.md).

### Use a design in your app

Read the selected design's guide below and the shared [document-first guidance](docs/document-first.md). Copy `styles/` and `assets/fonts/` into your app, keeping their relative paths and font licenses. This example assumes both folders sit beside your HTML file:

```html
<!doctype html>
<html lang="en" data-design="midnight" data-theme="dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="./styles/app.css">
    <title>My app</title>
  </head>
  <body>
    <main><h1>A place for your next idea</h1></main>
  </body>
</html>
```

Use semantic HTML and the [component contracts](docs/components.md). For another design, change both attributes to a supported pair. For a smaller, single-design setup, follow [browser integration](docs/designs.md#browser-integration). Exported CSS and token files need no runtime dependencies; the build tools are development dependencies.

### Use with an AI agent or design tool

Give the agent [AGENTS.md](AGENTS.md), [the design catalog](designs/catalog.json), the selected `designs/<id>/DESIGN.md` and only the guides needed for the task. [llms.txt](llms.txt) indexes the documentation; `llms-full.txt` combines shared guidance with the configured default design. Each design also has its own context bundle.

For Stitch, use the selected design's `.stitch/<mode>.DESIGN.md`. For other tools, start with its `exports/manifest.json` and the [format guide](docs/formats.md). Official Stitch lint passes; live Stitch/Figma imports remain unverified.

## Choose a design

| Design | Character | Supported modes |
| --- | --- | --- |
| [Midnight — default](designs/midnight/DESIGN.md) | Deep plum, lavender links, compact geometry | Dark |
| [Classic](designs/classic/DESIGN.md) | White/slate surfaces, serif headings, pill actions | Light and dark |
| [Editorial](designs/editorial/DESIGN.md) | Warm paper, slate ink, restrained geometry | Light and dark |
| [Forest](designs/forest/DESIGN.md) | Sage surfaces, evergreen actions, soft corners | Light and dark |
| [Invitation](designs/invitation/DESIGN.md) | Blue-black, warm off-white, literary typography | Dark |

With no requested design, use the defaults in [designs/catalog.json](designs/catalog.json). An explicitly selected design uses its own default mode unless a supported mode is specified. Omitting both HTML attributes uses the collection default. See [selection rules](docs/designs.md#selection).

## What is included

| Need | Start here |
| --- | --- |
| Colors, typography, spacing and component guidance | [Documentation index](docs/README.md) |
| Working overview, collection/detail and settings screens | [Workspace example](examples/workspace.html) |
| Controls, forms, dialogs, tabs and recovery patterns | [Example index](examples/README.md) |
| Tokens for code or design tools | Selected design's `exports/` and `tokens/`; [format contracts](docs/formats.md) |
| Favicons, app icons, OG images and metadata | [Identity and sharing guide](docs/identity-and-sharing.md) |
| Supported environments and verification limits | [Support contract](docs/support.md) |

Formats include Markdown/text; JSON, YAML, XML and CSV; DTCG and Tokens Studio; CSS, Sass and Less; JavaScript and TypeScript; SVG/PNG/ICO assets; and Stitch guides. React/Vue/Svelte files are integration examples. Swift/Kotlin dictionaries preserve CSS strings and require native conversion.

## Customize or contribute

Edit the canonical sources, then regenerate the outputs:

| Change | Editable source |
| --- | --- |
| Collection default and registered designs | [designs/catalog.json](designs/catalog.json) |
| One design's colors, typography, shape and spacing | `designs/<id>/design.json` |
| Shared foundations and semantic roles | [tokens/foundations.json](tokens/foundations.json), [tokens/semantic.json](tokens/semantic.json) |
| App identity and social compositions | [branding/](branding/) |

```sh
npm run build
npm run check
npm run check:external
```

Root `DESIGN.md`, `.stitch/`, `exports/` and generated tokens describe the configured default. Each design has its own complete outputs. Edit their sources rather than generated copies. The [repository map](docs/repository-map.md) explains ownership; [design authoring](docs/designs.md#add-a-design) covers adding a design.

Before publishing an app, replace the sample identity and example.com URLs, rebuild, and check its hosted assets. To submit changes, follow [CONTRIBUTING.md](CONTRIBUTING.md), including browser checks for UI changes. [GitHub Actions](https://github.com/pagelove/design-system/actions/workflows/verify.yml) runs the full validation suite. [Review reports](reference/README.md) distinguish measured results from unverified environments.

## Help and license

Maintained by the [Pagelove organization](https://github.com/pagelove) and repository contributors. Use [SUPPORT.md](SUPPORT.md) for questions and bug reports, and [release notes](docs/releases.md) for changes and migrations.

Code, tokens, examples and new documentation use the [MIT license](LICENSE). The document-first adaptation retains CC BY 4.0; bundled fonts use SIL OFL 1.1. Preserve the attribution and exceptions in [NOTICE.md](NOTICE.md) and [source provenance](reference/PROVENANCE.md). No trademark license is included.
