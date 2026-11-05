import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sourceRoot,loadDesigns,readJSON} from './designs.mjs';
const requested=readJSON('designs/catalog.json');
if(process.env.DESIGN_DEFAULT)requested.defaultDesign=process.env.DESIGN_DEFAULT;
if(process.env.DESIGN_MODE)requested.defaultMode=process.env.DESIGN_MODE;
const {catalog,designs}=loadDesigns(requested);
const outputRoot=process.env.DESIGN_OUTPUT_DIR?path.resolve(process.env.DESIGN_OUTPUT_DIR):sourceRoot;
function buildDesign(design,root,defaultMode=design.defaultMode){
const read=p=>JSON.parse(fs.readFileSync(path.join(sourceRoot,p),'utf8'));
const put=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v.endsWith('\n')?v:v+'\n');};
const json=(p,v)=>put(p,JSON.stringify(v,null,2));
const f=design.foundation,semantic=design.modes,profiles=read('tokens/profiles.json');
const modes=Object.keys(semantic);
const base={};
for(const [family,scale]of Object.entries(f.color))for(const [step,value]of Object.entries(scale))base[`color-${family}-${step}`]=value;
for(const [k,v]of Object.entries(f.gradient))base[`gradient-${k}`]=`linear-gradient(${v.angle}, ${v.stops.map(([name,stop])=>`var(--color-${name}) ${stop}`).join(', ')})`;
for(const [k,v]of Object.entries(f.space))base[`space-${k}`]=v;
for(const [group,values]of Object.entries(f.font))for(const [k,v]of Object.entries(values))base[`${({family:'font-family',weight:'font-weight',size:'font-size',lineHeight:'line-height',letterSpacing:'letter-spacing'})[group]}-${k}`]=v;
for(const [kind,values]of Object.entries(f.motion))for(const [k,v]of Object.entries(values))base[`motion-${kind}-${k}`]=v;
for(const [kind,rows]of Object.entries(f.grid))for(const r of rows){base[`grid-${kind}-${r.bp}-columns`]=String(r.columns);for(const k of ['gutter','margin'])base[`grid-${kind}-${r.bp}-${k}`]=`var(--space-${r[k]})`;}
Object.assign(base,design.appearance);
const block=(sel,map)=>`${sel} {\n${Object.entries(map).map(([k,v])=>`  --${k}: ${v};`).join('\n')}\n}\n`;
put('styles/foundations.css','/* Generated from tokens/foundations.json. */\n'+block(':root',base));
put('styles/semantic.css','/* Generated from tokens/semantic.json. */\n'+block(':root',semantic[defaultMode])+modes.map(mode=>block(`[data-theme="${mode}"]`,semantic[mode])).join(''));
put('styles/profiles.css','/* Optional profiles; these do not redefine the app-library semantic tokens. */\n'+Object.entries(profiles).map(([k,v])=>block(`[data-profile="${k}"]`,Object.fromEntries(Object.entries(v).map(([n,x])=>['profile-'+n,x])))).join('\n'));
const fieldMap={family:'font-family',weight:'font-weight',size:'font-size',lineHeight:'line-height',letterSpacing:'letter-spacing'};
put('styles/typography.css','/* Generated published reference classes; inspect legibility before applying small or tightly tracked styles. */\n'+Object.entries(f.textStyle).map(([k,v])=>`.text-${k} {\n${Object.entries(v).map(([p,x])=>`  ${{family:'font-family',weight:'font-weight',size:'font-size',lineHeight:'line-height',letterSpacing:'letter-spacing'}[p]}: var(--${fieldMap[p]}-${x});`).join('\n')}\n}`).join('\n'));
const resolved={};
function resolve(k,map,trail=[]){if(trail.includes(k))throw Error('Cycle '+[...trail,k].join(' -> '));if(!(k in map))throw Error('Missing '+k);return String(map[k]).replace(/var\(--([\w-]+)\)/g,(_,ref)=>resolve(ref,map,[...trail,k]));}
for(const mode of modes){const m={...base,...semantic[mode]};resolved[mode]=Object.fromEntries(Object.keys(m).map(k=>[k,resolve(k,m)]));}
json('exports/tokens.json',{design:design.id,defaultMode,foundations:base,semantic,profiles,resolved});
put('styles/appearance.css',block(':root',design.appearance));
put('styles/theme.css',fs.readFileSync(path.join(root,'styles/foundations.css'),'utf8')+fs.readFileSync(path.join(root,'styles/semantic.css'),'utf8')+block(':root',{...design.appearance,'design-color-scheme':defaultMode})+modes.map(mode=>block(`[data-theme="${mode}"]`,{'design-color-scheme':mode})).join(''));
// JSON is a valid YAML 1.2 document. Use block YAML to improve human readability.
const yaml=o=>Object.entries(o).map(([k,v])=>`${JSON.stringify(k)}:${v&&typeof v==='object'&&!Array.isArray(v)?'\n'+yaml(v).split('\n').filter(Boolean).map(x=>'  '+x).join('\n'): ' '+JSON.stringify(v)}\n`).join('');
put('exports/tokens.yaml',yaml({design:design.id,defaultMode,foundations:base,semantic,profiles}));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
put('exports/tokens.xml','<?xml version="1.0" encoding="UTF-8"?>\n<design-system version="0.1.0">\n'+Object.entries(resolved).map(([mode,values])=>`  <theme name="${mode}">\n${Object.entries(values).map(([k,v])=>`    <token name="${k}" value="${esc(v)}"/>`).join('\n')}\n  </theme>`).join('\n')+'\n</design-system>');
const csv=s=>'"'+String(s).replaceAll('"','""')+'"';
put('exports/tokens.csv','theme,name,value\n'+Object.entries(resolved).flatMap(([m,v])=>Object.entries(v).map(([k,x])=>[m,k,x].map(csv).join(','))).join('\n'));
put('exports/tokens.mjs','// Generated. Values preserve CSS units; no runtime dependencies.\nexport const tokens = '+JSON.stringify(resolved,null,2)+';\nexport default tokens;');
put('exports/tokens.cjs','// Generated CommonJS adapter.\nmodule.exports = '+JSON.stringify(resolved,null,2)+';');
put('exports/tokens.ts','// Generated; CSS strings remain unchanged across platforms.\nexport const tokens = '+JSON.stringify(resolved,null,2)+' as const;\nexport type Theme = keyof typeof tokens;\nexport type TokenName = keyof typeof tokens[Theme];');
put('exports/_tokens.scss','// Generated resolved values. @use this module and sass:map.\n$tokens: (\n'+Object.entries(resolved).map(([m,v])=>`  "${m}": (\n${Object.entries(v).map(([k,x])=>`    ${JSON.stringify(k)}: ${JSON.stringify(x)},`).join('\n')}\n  ),`).join('\n')+'\n);');
put('exports/tokens.less','// Generated initial-mode aliases, followed by explicit mode-prefixed values.\n'+Object.entries(resolved[defaultMode]).map(([k,v])=>`@${k}: ~${JSON.stringify(v)};`).join('\n')+'\n'+Object.entries(resolved).flatMap(([mode,values])=>Object.entries(values).map(([k,v])=>`@${mode}-${k}: ~${JSON.stringify(v)};`)).join('\n'));
put('exports/Tokens.swift','// Generated portable CSS-string values. Convert units and colors explicitly for native UI.\nenum DesignTokens {\n'+Object.entries(resolved).map(([m,v])=>`  static let ${m}: [String: String] = [\n${Object.entries(v).map(([k,x])=>`    ${JSON.stringify(k)}: ${JSON.stringify(x)},`).join('\n')}\n  ]`).join('\n')+'\n}');
put('exports/Tokens.kt','// Generated portable CSS-string values, not Android dp/sp or Compose Color values.\nobject DesignTokens {\n'+Object.entries(resolved).map(([m,v])=>`  val ${m}: Map<String, String> = mapOf(\n${Object.entries(v).map(([k,x])=>`    ${JSON.stringify(k)} to ${JSON.stringify(x).replaceAll('$','\\$')},`).join('\n')}\n  )`).join('\n')+'\n}');
const color=v=>{const h=v.slice(1);const hex=h.length===3?[...h].map(x=>x+x).join(''):h;return{colorSpace:'srgb',components:[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255),alpha:1,hex:'#'+hex.toUpperCase()};};
const dtcg={};
for(const [k,v]of Object.entries(base)){
 let type,value,description='Published foundation value.';
 if(/^#[\da-f]{3,6}$/i.test(v)){type='color';value=color(v);}
 else if(v.startsWith('var(')){type=k.startsWith('design-')?'fontFamily':'dimension';value=v.replace(/var\(--([\w-]+)\)/g,'{$1}');}
 else if(k.startsWith('gradient-')){type='gradient';value=f.gradient[k.slice(9)].stops.map(([ref,pos])=>({color:`{color-${ref}}`,position:parseFloat(pos)/100}));description='Color stops; CSS direction is recorded in extensions.';}
 else if(/^-?[\d.]+(?:px|rem)$/.test(v)){type='dimension';value={value:parseFloat(v),unit:v.endsWith('rem')?'rem':'px'};}
 else if(k.startsWith('font-family-')){type='fontFamily';value=v.split(',').map(x=>x.trim().replace(/^['"]|['"]$/g,''));}
 else if(k.startsWith('font-weight-')){type='fontWeight';value=Number(v);}
 else if(k.startsWith('motion-duration-')){type='duration';value={value:parseFloat(v),unit:v.endsWith('ms')?'ms':'s'};}
 else if(k.startsWith('motion-easing-')){type='cubicBezier';value=v==='ease-in-out'?[.42,0,.58,1]:[.6,.4,.4,.6];}
 else if(k.startsWith('design-')){type='string';value=v;}
 else {type='number';value=parseFloat(v);if(v.endsWith('em'))description='Relative letter spacing multiplier in em; reconstruct CSS with the em suffix.';}
 dtcg[k]={$type:type,$value:value,$description:description,$extensions:{'com.pagelove.design-system':{css:v}}};
}
json('tokens/foundations.tokens.json',dtcg);
for(const mode of modes)json(`tokens/${mode}.tokens.json`,Object.fromEntries(Object.entries(semantic[mode]).map(([k,v])=>[k,{$type:'color',$value:v.replace(/^var\(--([\w-]+)\)$/,'{$1}'),$description:`${mode} mode semantic role: ${k}.` }])));
const studio={global:Object.fromEntries(Object.entries(base).map(([k,v])=>[k,{value:resolved[defaultMode][k],type:k.startsWith('color-')?'color':'other',description:'Portable CSS string; check target tool conversion.'}])),...Object.fromEntries(modes.map(mode=>[mode,Object.fromEntries(Object.entries(semantic[mode]).map(([k,v])=>[k,{value:v.replace(/^var\(--([\w-]+)\)$/,'{$1}'),type:'color'}]))])),$metadata:{tokenSetOrder:['global',...modes]}};
json('exports/tokens-studio.json',studio);
put('exports/tokens.txt',Object.entries(resolved).map(([m,v])=>`[${m}]\n${Object.entries(v).map(([k,x])=>`${k} = ${x}`).join('\n')}`).join('\n\n'));
put('exports/tokens.md','# Resolved design tokens\n\nGenerated from canonical sources. CSS units are preserved.\n\n'+Object.entries(resolved).map(([m,v])=>`## ${m}\n\n| Name | Value |\n| --- | --- |\n${Object.entries(v).map(([k,x])=>`| \`${k}\` | \`${x}\` |`).join('\n')}`).join('\n\n'));
const swatches=Object.entries(base).filter(([k])=>k.startsWith('color-'));const w=900,rows=Math.ceil(swatches.length/6);
put('assets/palette.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${rows*94+50}" viewBox="0 0 ${w} ${rows*94+50}" role="img" aria-labelledby="title"><title id="title">Design foundation color palette</title><rect width="100%" height="100%" fill="white"/>${swatches.map(([k,v],i)=>{const x=(i%6)*150,y=Math.floor(i/6)*94+20;return`<g transform="translate(${x},${y})"><rect x="8" width="134" height="50" rx="4" fill="${v}" stroke="#cbd5e1"/><text x="8" y="66" font-size="10" font-family="sans-serif" fill="#334155">${k.slice(6)}</text><text x="8" y="80" font-size="10" font-family="monospace" fill="#334155">${v}</text></g>`;}).join('')}</svg>`);
const template=fs.readFileSync(path.join(sourceRoot,'templates/design-guide.md'),'utf8');
function guide(title,colors,fonts,profile){const y={name:title,colors,typography:{heading:{fontFamily:fonts[0],fontSize:design.appearance['design-title-size'],fontWeight:400,lineHeight:1.1,letterSpacing:design.appearance['design-heading-tracking']},body:{fontFamily:fonts[1],fontSize:'1rem',fontWeight:400,lineHeight:1.5}},rounded:{card:design.appearance['design-radius-card'],button:design.appearance['design-radius-button']},spacing:{small:'8px',medium:'16px',large:design.appearance['design-section-gap']}};return template.replace('{{FRONTMATTER}}','---\n'+yaml(y)+'---').replace('{{TITLE}}',title).replace('{{PROFILE}}',profile);}
const selected=resolved[defaultMode];
const mainGuide=guide(design.name,{primary:selected['text-regular'],neutral:selected['background-surface-light'],accent:selected['link-text-default'],border:selected['border-regular']},[selected['design-heading-family'].split(',')[0].replaceAll('"','').replaceAll("'",''),selected['design-body-family'].split(',')[0].replaceAll('"','').replaceAll("'",'')],design.guidance+' Available modes: '+modes.join(', ')+'. Initial mode: '+defaultMode+'.');
put('DESIGN.md',mainGuide);put('.stitch/DESIGN.md',mainGuide);
const contextFiles=['DESIGN.md','docs/designs.md','docs/polish.md','docs/foundations.md','docs/components.md','docs/document-first.md','docs/games.md','docs/accessibility.md','docs/patterns.md','docs/formats.md','NOTICE.md'];
put('llms-full.txt',contextFiles.map(p=>`\n===== ${p} =====\n\n${fs.readFileSync(path.join(p==='DESIGN.md'?root:sourceRoot,p),'utf8')}`).join('\n'));
for(const mode of ['light','dark'])if(!semantic[mode]){const file=path.join(root,'tokens',mode+'.tokens.json');if(fs.existsSync(file))fs.unlinkSync(file);}
return {base,semantic,resolved,block};
}
const built=new Map();
for(const design of designs)built.set(design.id,buildDesign(design,path.join(outputRoot,'designs',design.id)));
const selected=designs.find(d=>d.id===catalog.defaultDesign);
buildDesign(selected,outputRoot,catalog.defaultMode);

const index={...catalog,designs:designs.map(d=>({id:d.id,name:d.name,description:d.description,modes:Object.keys(d.modes),defaultMode:d.defaultMode,guide:'designs/'+d.id+'/DESIGN.md',exports:'designs/'+d.id+'/exports/',preview:'examples/workspace.html?design='+d.id,previewImage:'designs/'+d.id+'/previews/workspace-'+d.defaultMode+'.png'}))};
const putRoot=(p,v)=>{const file=path.join(outputRoot,p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,v);};
putRoot('designs/index.json',JSON.stringify(index,null,2)+'\n');
putRoot('examples/design-catalog.js','// Generated from designs/catalog.json and design definitions.\nwindow.designCatalog = '+JSON.stringify(index,null,2)+';\n');
let css='/* Generated selectable design bundles. Default is set by designs/catalog.json. */\n';
for(const d of designs){const b=built.get(d.id);const selector='[data-design="'+d.id+'"]';css+=b.block(selector,{...b.base,...b.semantic[d.defaultMode],'design-color-scheme':d.defaultMode});for(const mode of Object.keys(d.modes))css+=b.block(selector+'[data-theme="'+mode+'"]',{...b.semantic[mode],'design-color-scheme':mode});}
putRoot('styles/designs.css',css);
putRoot('styles/defaults.css',':root { --design-color-scheme: '+catalog.defaultMode+'; }\n[data-theme="light"] { --design-color-scheme: light; }\n[data-theme="dark"] { --design-color-scheme: dark; }\n');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
putRoot('examples/designs.html',`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Choose a design — Pagelove</title><link rel="stylesheet" href="../styles/app.css"><style>.design-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:24px}.design-card{background:var(--background-surface-light);color:var(--text-regular);border:1px solid var(--border-regular);border-radius:var(--design-radius-card);padding:28px;display:grid;gap:20px;align-content:start}.design-card h2{margin:0}.design-card p{margin:0}.design-card a{color:var(--link-text-default)}.design-sample{background:var(--background-surface-regular);padding:20px;border-radius:var(--design-radius-card);border:1px solid var(--border-regular);display:grid;gap:12px}.design-sample span{display:block}.design-sample strong{font-family:var(--design-heading-family);font-size:1.5rem}.design-card .pl-button{background:var(--button-strong-default);color:var(--button-strong-text);border-radius:var(--design-radius-button);padding:12px 20px;justify-self:start;text-decoration:none}</style></head><body><main class="ds-shell"><p>Pagelove Design Collection</p><h1>Choose a starting point</h1><p class="ds-intro">${designs.length} complete designs, shared components and portable files. The configured default is ${escape(selected.name)} / ${catalog.defaultMode}. Select a design to try its controls and modes.</p><div class="design-gallery">${designs.map(d=>`<article class="design-card" data-design="${d.id}" data-theme="${d.defaultMode}"><h2>${escape(d.name)}${d.id===catalog.defaultDesign?' · Default':''}</h2><p>${escape(d.description)}</p><div class="design-sample"><strong>A place for your next idea</strong><span>Readable content, useful actions and room to focus.</span><a class="pl-button" href="workspace.html?design=${d.id}&amp;mode=${d.defaultMode}">Try ${escape(d.name)}</a></div><p>Modes: ${Object.keys(d.modes).join(', ')}</p><p><a href="../designs/${d.id}/DESIGN.md">Design guide</a> · <a href="../designs/${d.id}/exports/tokens.json">Token files</a></p></article>`).join('')}</div></main></body></html>`);
for(const id of ['editorial','invitation'])putRoot('profiles/'+id+'/DESIGN.md','# Legacy profile: '+id+'\n\nUse the complete [selectable design](../../designs/'+id+'/DESIGN.md) and its exports. The original profile values remain in tokens/profiles.json as reference material; they are not a runtime selection mechanism.\n');
for(const mode of ['light','dark'])if(!selected.modes[mode]){const p=path.join(outputRoot,'tokens',mode+'.tokens.json');if(fs.existsSync(p))fs.unlinkSync(p);}
console.log('Built '+designs.length+' designs; default '+catalog.defaultDesign+'/'+catalog.defaultMode+'.');
