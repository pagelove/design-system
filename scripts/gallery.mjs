const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

export function renderGallery(catalog, designs) {
  const ordered = [...designs].sort((a,b) => Number(b.id === catalog.defaultDesign) - Number(a.id === catalog.defaultDesign));
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Choose a design — Pagelove</title><link rel="stylesheet" href="../styles/app.css"><link rel="stylesheet" href="../styles/gallery.css"><script src="gallery.js" defer></script></head>
<body><a class="gallery-skip" href="#designs">Skip to designs</a><header class="gallery-header"><a href="designs.html">Pagelove / Design collection</a><nav aria-label="Resources"><a href="../docs/formats.md">Formats</a><a href="https://github.com/pagelove/design-system">Repository</a></nav></header>
<main><section class="gallery-intro"><h1>Find your app’s character.</h1><p>${designs.length} complete designs. The same working app, with different color, type and shape. Start with ${esc(ordered[0].name)} or explore another direction.</p><a class="gallery-action" href="workspace.html?design=${catalog.defaultDesign}&amp;mode=${catalog.defaultMode}">Try ${esc(ordered[0].name)}</a></section>
<div id="designs" class="gallery-collection">${ordered.map((d,i) => {
    const mode = d.id === catalog.defaultDesign ? catalog.defaultMode : d.defaultMode;
    const modes = Object.keys(d.modes);
    return `<article id="${d.id}" class="gallery-design${i===0?' gallery-featured':''}" data-design="${d.id}" data-theme="${mode}" aria-labelledby="title-${d.id}">
<div class="gallery-copy"><h2 id="title-${d.id}">${esc(d.name)}</h2><p>${esc(d.description)}</p><p class="gallery-detail">${i===0?'Collection default · ':''}${modes.length===1?'Dark only':'Light and dark'}</p>
${modes.length>1?`<fieldset class="gallery-modes"><legend>${esc(d.name)} appearance</legend>${modes.map(m=>`<label><input type="radio" name="mode-${d.id}" value="${m}"${m===mode?' checked':''}><span>${m==='light'?'Light':'Dark'}</span></label>`).join('')}</fieldset>`:''}
<a class="gallery-action" data-preview-link href="workspace.html?design=${d.id}&amp;mode=${mode}">Explore ${esc(d.name)}</a>
<div class="gallery-resources"><a href="../designs/${d.id}/DESIGN.md">Design guide</a><a href="../designs/${d.id}/exports/tokens.json">Tokens</a><a href="../designs/${d.id}/.stitch/DESIGN.md">Stitch guide</a></div></div>
<a class="gallery-preview" data-preview-link href="workspace.html?design=${d.id}&amp;mode=${mode}" aria-label="Open ${esc(d.name)} ${mode} app preview"><img src="../designs/${d.id}/previews/workspace-${mode}.png" alt="${esc(d.name)} ${mode}: Studio overview with collections, activity and workspace navigation" width="1440" height="900"${i===0?' fetchpriority="high"':''}></a>
<p class="gallery-status" role="status" aria-live="polite"></p></article>`;
  }).join('\n')}</div></main>
<footer class="gallery-footer"><p>Take the design with you.</p><p>Each design includes tokens, CSS, Markdown and a Stitch guide. <a href="../docs/formats.md">Compare all formats</a> or <a href="../docs/designs.md">read the integration guide</a>.</p><p>Code and original design files: MIT. Font and adapted-document licenses are listed in <a href="../NOTICE.md">Notices</a>.</p></footer></body></html>\n`;
}
