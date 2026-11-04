import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const put=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v.endsWith('\n')?v:v+'\n');};
const json=(p,v)=>put(p,JSON.stringify(v,null,2));
const f=read('tokens/foundations.json'),semantic=read('tokens/semantic.json'),profiles=read('tokens/profiles.json');
const base={};
for(const [family,scale]of Object.entries(f.color))for(const [step,value]of Object.entries(scale))base[`color-${family}-${step}`]=value;
for(const [k,v]of Object.entries(f.gradient))base[`gradient-${k}`]=`linear-gradient(${v.angle}, ${v.stops.map(([name,stop])=>`var(--color-${name}) ${stop}`).join(', ')})`;
for(const [k,v]of Object.entries(f.space))base[`space-${k}`]=v;
for(const [group,values]of Object.entries(f.font))for(const [k,v]of Object.entries(values))base[`${({family:'font-family',weight:'font-weight',size:'font-size',lineHeight:'line-height',letterSpacing:'letter-spacing'})[group]}-${k}`]=v;
for(const [kind,values]of Object.entries(f.motion))for(const [k,v]of Object.entries(values))base[`motion-${kind}-${k}`]=v;
for(const [kind,rows]of Object.entries(f.grid))for(const r of rows){base[`grid-${kind}-${r.bp}-columns`]=String(r.columns);for(const k of ['gutter','margin'])base[`grid-${kind}-${r.bp}-${k}`]=`var(--space-${r[k]})`;}
const block=(sel,map)=>`${sel} {\n${Object.entries(map).map(([k,v])=>`  --${k}: ${v};`).join('\n')}\n}\n`;
put('styles/foundations.css','/* Generated from tokens/foundations.json. */\n'+block(':root',base));
put('styles/semantic.css','/* Generated from tokens/semantic.json. */\n'+block(':root, [data-theme="light"]',semantic.light)+block('[data-theme="dark"]',semantic.dark));
put('styles/profiles.css','/* Optional profiles; these do not redefine the app-library semantic tokens. */\n'+Object.entries(profiles).map(([k,v])=>block(`[data-profile="${k}"]`,Object.fromEntries(Object.entries(v).map(([n,x])=>['profile-'+n,x])))).join('\n'));
const fieldMap={family:'font-family',weight:'font-weight',size:'font-size',lineHeight:'line-height',letterSpacing:'letter-spacing'};
put('styles/typography.css','/* Generated published reference classes; inspect legibility before applying small or tightly tracked styles. */\n'+Object.entries(f.textStyle).map(([k,v])=>`.text-${k} {\n${Object.entries(v).map(([p,x])=>`  ${{family:'font-family',weight:'font-weight',size:'font-size',lineHeight:'line-height',letterSpacing:'letter-spacing'}[p]}: var(--${fieldMap[p]}-${x});`).join('\n')}\n}`).join('\n'));
const resolved={};
function resolve(k,map,trail=[]){if(trail.includes(k))throw Error('Cycle '+[...trail,k].join(' -> '));if(!(k in map))throw Error('Missing '+k);return String(map[k]).replace(/var\(--([\w-]+)\)/g,(_,ref)=>resolve(ref,map,[...trail,k]));}
for(const mode of ['light','dark']){const m={...base,...semantic[mode]};resolved[mode]=Object.fromEntries(Object.keys(m).map(k=>[k,resolve(k,m)]));}
json('exports/tokens.json',{foundations:base,semantic,profiles,resolved});
// JSON is a valid YAML 1.2 document. Use block YAML to improve human readability.
const yaml=o=>Object.entries(o).map(([k,v])=>`${JSON.stringify(k)}:${v&&typeof v==='object'&&!Array.isArray(v)?'\n'+yaml(v).split('\n').filter(Boolean).map(x=>'  '+x).join('\n'): ' '+JSON.stringify(v)}\n`).join('');
put('exports/tokens.yaml',yaml({foundations:base,semantic,profiles}));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
put('exports/tokens.xml','<?xml version="1.0" encoding="UTF-8"?>\n<design-system version="0.1.0">\n'+Object.entries(resolved).map(([mode,values])=>`  <theme name="${mode}">\n${Object.entries(values).map(([k,v])=>`    <token name="${k}" value="${esc(v)}"/>`).join('\n')}\n  </theme>`).join('\n')+'\n</design-system>');
const csv=s=>'"'+String(s).replaceAll('"','""')+'"';
put('exports/tokens.csv','theme,name,value\n'+Object.entries(resolved).flatMap(([m,v])=>Object.entries(v).map(([k,x])=>[m,k,x].map(csv).join(','))).join('\n'));
put('exports/tokens.mjs','// Generated. Values preserve CSS units; no runtime dependencies.\nexport const tokens = '+JSON.stringify(resolved,null,2)+';\nexport default tokens;');
put('exports/tokens.cjs','// Generated CommonJS adapter.\nmodule.exports = '+JSON.stringify(resolved,null,2)+';');
put('exports/tokens.ts','// Generated; CSS strings remain unchanged across platforms.\nexport const tokens = '+JSON.stringify(resolved,null,2)+' as const;\nexport type Theme = keyof typeof tokens;\nexport type TokenName = keyof typeof tokens.light;');
put('exports/_tokens.scss','// Generated resolved values. @use this module and sass:map.\n$tokens: (\n'+Object.entries(resolved).map(([m,v])=>`  "${m}": (\n${Object.entries(v).map(([k,x])=>`    ${JSON.stringify(k)}: ${JSON.stringify(x)},`).join('\n')}\n  ),`).join('\n')+'\n);');
put('exports/tokens.less','// Generated resolved light-mode strings. Use theme CSS for runtime switching.\n'+Object.entries(resolved.light).map(([k,v])=>`@${k}: ~${JSON.stringify(v)};`).join('\n'));
put('exports/Tokens.swift','// Generated portable CSS-string values. Convert units and colors explicitly for native UI.\nenum DesignTokens {\n'+Object.entries(resolved).map(([m,v])=>`  static let ${m}: [String: String] = [\n${Object.entries(v).map(([k,x])=>`    ${JSON.stringify(k)}: ${JSON.stringify(x)},`).join('\n')}\n  ]`).join('\n')+'\n}');
put('exports/Tokens.kt','// Generated portable CSS-string values, not Android dp/sp or Compose Color values.\nobject DesignTokens {\n'+Object.entries(resolved).map(([m,v])=>`  val ${m}: Map<String, String> = mapOf(\n${Object.entries(v).map(([k,x])=>`    ${JSON.stringify(k)} to ${JSON.stringify(x).replaceAll('$','\\$')},`).join('\n')}\n  )`).join('\n')+'\n}');
const color=v=>{const h=v.slice(1);const hex=h.length===3?[...h].map(x=>x+x).join(''):h;return{colorSpace:'srgb',components:[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255),alpha:1,hex:'#'+hex.toUpperCase()};};
const dtcg={};
for(const [k,v]of Object.entries(base)){
 let type,value,description='Published foundation value.';
 if(/^#[\da-f]{3,6}$/i.test(v)){type='color';value=color(v);}
 else if(v.startsWith('var(')){type='dimension';value=v.replace(/var\(--([\w-]+)\)/g,'{$1}');}
 else if(k.startsWith('gradient-')){type='gradient';value=f.gradient[k.slice(9)].stops.map(([ref,pos])=>({color:`{color-${ref}}`,position:parseFloat(pos)/100}));description='Color stops; CSS direction is recorded in extensions.';}
 else if(/^-?[\d.]+(?:px|rem)$/.test(v)){type='dimension';value={value:parseFloat(v),unit:v.endsWith('rem')?'rem':'px'};}
 else if(k.startsWith('font-family-')){type='fontFamily';value=v.split(',').map(x=>x.trim().replace(/^['"]|['"]$/g,''));}
 else if(k.startsWith('font-weight-')){type='fontWeight';value=Number(v);}
 else if(k.startsWith('motion-duration-')){type='duration';value={value:parseFloat(v),unit:v.endsWith('ms')?'ms':'s'};}
 else if(k.startsWith('motion-easing-')){type='cubicBezier';value=v==='ease-in-out'?[.42,0,.58,1]:[.6,.4,.4,.6];}
 else {type='number';value=parseFloat(v);if(v.endsWith('em'))description='Relative letter spacing multiplier in em; reconstruct CSS with the em suffix.';}
 dtcg[k]={$type:type,$value:value,$description:description,$extensions:{'com.pagelove.design-system':{css:v}}};
}
json('tokens/foundations.tokens.json',dtcg);
for(const mode of ['light','dark'])json(`tokens/${mode}.tokens.json`,Object.fromEntries(Object.entries(semantic[mode]).map(([k,v])=>[k,{$type:'color',$value:v.replace(/^var\(--([\w-]+)\)$/,'{$1}'),$description:`${mode} mode semantic role: ${k}.` }])));
const studio={global:Object.fromEntries(Object.entries(base).map(([k,v])=>[k,{value:resolved.light[k],type:k.startsWith('color-')?'color':'other',description:'Portable CSS string. Convert other types for your plugin version.'}])),light:Object.fromEntries(Object.entries(semantic.light).map(([k,v])=>[k,{value:v.replace(/^var\(--([\w-]+)\)$/,'{$1}'),type:'color'}])),dark:Object.fromEntries(Object.entries(semantic.dark).map(([k,v])=>[k,{value:v.replace(/^var\(--([\w-]+)\)$/,'{$1}'),type:'color'}])),$metadata:{tokenSetOrder:['global','light','dark']}};
json('exports/tokens-studio.json',studio);
put('exports/tokens.txt',Object.entries(resolved).map(([m,v])=>`[${m}]\n${Object.entries(v).map(([k,x])=>`${k} = ${x}`).join('\n')}`).join('\n\n'));
put('exports/tokens.md','# Resolved design tokens\n\nGenerated from canonical sources. CSS units are preserved.\n\n'+Object.entries(resolved).map(([m,v])=>`## ${m}\n\n| Name | Value |\n| --- | --- |\n${Object.entries(v).map(([k,x])=>`| \`${k}\` | \`${x}\` |`).join('\n')}`).join('\n\n'));
const swatches=Object.entries(base).filter(([k])=>k.startsWith('color-'));const w=900,rows=Math.ceil(swatches.length/6);
put('assets/palette.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${rows*94+50}" viewBox="0 0 ${w} ${rows*94+50}" role="img" aria-labelledby="title"><title id="title">Design foundation color palette</title><rect width="100%" height="100%" fill="white"/>${swatches.map(([k,v],i)=>{const x=(i%6)*150,y=Math.floor(i/6)*94+20;return`<g transform="translate(${x},${y})"><rect x="8" width="134" height="50" rx="4" fill="${v}" stroke="#cbd5e1"/><text x="8" y="66" font-size="10" font-family="sans-serif" fill="#334155">${k.slice(6)}</text><text x="8" y="80" font-size="10" font-family="monospace" fill="#334155">${v}</text></g>`;}).join('')}</svg>`);
const template=fs.readFileSync(path.join(root,'templates/design-guide.md'),'utf8');
function guide(title,colors,fonts,profile){const y={name:title,colors,typography:{heading:{fontFamily:fonts[0],fontSize:'2rem',fontWeight:400,lineHeight:1.2},body:{fontFamily:fonts[1],fontSize:'1rem',fontWeight:400,lineHeight:1.5}},rounded:{card:'12px',button:'100px'},spacing:{small:'8px',medium:'16px',large:'32px'}};return template.replace('{{FRONTMATTER}}','---\n'+yaml(y)+'---').replace('{{TITLE}}',title).replace('{{PROFILE}}',profile);}
const mainGuide=guide('Pagelove App Foundations',{primary:resolved.light['text-regular'],neutral:resolved.light['background-surface-light'],accent:resolved.light['link-text-default'],border:resolved.light['border-regular']},['Source Serif 4','Inter'],'Default: the supplied public app library. Dark mode is available through semantic theme roles, not automatic color inversion. Optional editorial and invitation profiles retain a distinct brand palette.');
put('DESIGN.md',mainGuide);put('.stitch/DESIGN.md',mainGuide);
for(const [name,p]of Object.entries(profiles))put(`profiles/${name}/DESIGN.md`,guide(`Pagelove ${name[0].toUpperCase()+name.slice(1)}`,{primary:p['text-primary'],neutral:p.background,accent:p.accent||p['accent-lavender'],border:p.border},name==='editorial'?['Source Serif 4','Inter']:['Fraunces','Inter Tight'],`Optional ${name} profile. Read styles/profiles.css and map --profile-* properties to the consuming app's semantic roles deliberately. Reference muted colors need context-specific contrast checks.`));
const contextFiles=['DESIGN.md','docs/foundations.md','docs/components.md','docs/document-first.md','docs/games.md','docs/accessibility.md','docs/patterns.md','docs/formats.md','NOTICE.md'];
put('llms-full.txt',contextFiles.map(p=>`\n===== ${p} =====\n\n${fs.readFileSync(path.join(root,p),'utf8')}`).join('\n'));
console.log(`Built ${Object.keys(base).length} foundation tokens, ${Object.keys(semantic.light).length} light roles and ${Object.keys(semantic.dark).length} dark roles.`);
