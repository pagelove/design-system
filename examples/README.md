# Examples

Run `npm run serve` from the repository root after installing development dependencies as described in the [quick start](../README.md#get-started). Open `http://127.0.0.1:4173` and choose a page below. GitHub displays the HTML source; it does not execute these demos.

| Page | What to explore |
| --- | --- |
| [Design gallery](designs.html) | Compare five designs and open a selected design's guide |
| [Component catalog](catalog.html) | Native controls, variants, states and supported modes |
| [Workspace](workspace.html) | Overview, collections, detail, local draft creation and settings |
| [App patterns](patterns.html) | Forms, tabs, disclosure, confirmation, error recovery, records and RTL |
| [Identity and sharing](branding.html) | Small icons, all eight social compositions and generated metadata |
| [Quality checks](quality.html) | Font loading, motion preference and reading settings |

The gallery and catalog also support direct local-file opening. Use HTTP for the full example set. Standalone previews demonstrate one design with shared CSS: [Midnight](../designs/midnight/preview.html), [Classic](../designs/classic/preview.html), [Editorial](../designs/editorial/preview.html), [Forest](../designs/forest/preview.html) and [Invitation](../designs/invitation/preview.html).

Selection uses URL parameters, for example `?design=forest&mode=dark`. Mode choices follow the selected design; Midnight and Invitation have no light mode. See [selection rules](../docs/designs.md#selection).

## Integration boundaries

These demonstrations use sample content and local interactions. They do not supply production authentication, persistence or service integrations. Framework files in [frameworks/](frameworks/) illustrate button integration with React, Vue and Svelte; they are not complete application packages.

The gallery, branding preview and selected supporting scripts are generated. See the [repository map](../docs/repository-map.md) before editing. Use [component contracts](../docs/components.md), [patterns](../docs/patterns.md) and [product polish](../docs/polish.md) when adapting examples.
