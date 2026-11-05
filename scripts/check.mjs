import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import {loadDesigns} from './designs.mjs';
import {checkPortability} from './check-portability.mjs';
import {button,field,choice,progress} from '../components/index.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).filter(e=>!['.git','node_modules'].includes(e.name)).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const initial=files(root);const before=Object.fromEntries(initial.map(p=>[p,hash(p)]));
const rebuild=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,encoding:'utf8'});assert.equal(rebuild.status,0,rebuild.stderr);
for(const p of initial)assert.equal(hash(p),before[p],'Generated drift: run npm run build: '+path.relative(root,p));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const {catalog,designs}=loadDesigns();
const all=read('exports/tokens.json');assert.ok(Object.keys(all.foundations).length>=233);
assert.equal(all.design,catalog.defaultDesign);assert.equal(all.defaultMode,catalog.defaultMode);
assert.deepEqual(Object.keys(all.semantic).sort(),Object.keys(designs.find(d=>d.id===catalog.defaultDesign).modes).sort());
for(const roles of Object.values(all.semantic))for(const [key,value]of Object.entries(roles)){assert.match(key,/^[a-z][a-z0-9-]*$/);assert.match(value,/^var\(--color-[a-z0-9-]+\)$/);}
for(const mode of Object.keys(all.semantic)){assert.equal(Object.keys(all.semantic[mode]).length,110);for(const [k,v]of Object.entries(all.resolved[mode])){assert.ok(!v.includes('var('),`${mode}.${k} unresolved`);assert.ok(!v.includes('undefined'),k);}}
const dtcg={...read('tokens/foundations.tokens.json'),...read(`tokens/${catalog.defaultMode}.tokens.json`)};
for(const [k,t]of Object.entries(dtcg)){
 assert.ok(t.$type&&t.$value!==undefined,k);
 for(const m of JSON.stringify(t.$value).matchAll(/\{([\w-]+)\}/g))assert.ok(dtcg[m[1]],`${k} missing ${m[1]}`);
 if(t.$type==='number'||t.$type==='fontWeight')assert.ok(Number.isFinite(t.$value),k);
 if(t.$type==='color'&&typeof t.$value==='object')assert.ok(t.$value.components.every(x=>Number.isFinite(x)&&x>=0&&x<=1),k);
}
assert.equal(fs.readFileSync(path.join(root,'DESIGN.md'),'utf8'),fs.readFileSync(path.join(root,'.stitch/DESIGN.md'),'utf8'));
for(const d of designs){
 const prefix=`designs/${d.id}/`;const bundle=read(prefix+'exports/tokens.json');
 assert.equal(bundle.design,d.id);assert.deepEqual(Object.keys(bundle.resolved).sort(),Object.keys(d.modes).sort());
 assert.equal(bundle.defaultMode,d.defaultMode);
 for(const mode of Object.keys(d.modes)){
  assert.equal(Object.keys(bundle.semantic[mode]).length,110);
  for(const value of Object.values(bundle.resolved[mode]))assert.ok(!value.includes('var(')&&!value.includes('undefined'),d.id+' '+mode);
  const tokens={...read(prefix+'tokens/foundations.tokens.json'),...read(prefix+`tokens/${mode}.tokens.json`)};
  for(const t of Object.values(tokens))for(const m of JSON.stringify(t.$value).matchAll(/\{([\w-]+)\}/g))assert.ok(tokens[m[1]],d.id+' '+m[1]);
 }
 for(const file of ['tokens.json','tokens.yaml','tokens.xml','tokens.csv','tokens.mjs','tokens.cjs','tokens.ts','tokens.less','_tokens.scss','tokens-studio.json','Tokens.swift','Tokens.kt','tokens.txt','tokens.md'])assert.ok(fs.existsSync(path.join(root,prefix,'exports',file)),d.id+' '+file);
 assert.equal(fs.readFileSync(path.join(root,prefix,'DESIGN.md'),'utf8'),fs.readFileSync(path.join(root,prefix,'.stitch/DESIGN.md'),'utf8'));
 assert.ok(fs.readFileSync(path.join(root,prefix,'llms-full.txt'),'utf8').includes('# '+d.name));
 const guide=fs.readFileSync(path.join(root,prefix,'DESIGN.md'),'utf8');
 assert.ok(guide.includes('"fontSize": '+JSON.stringify(d.appearance['design-title-size'])), 'Guide title scale matches '+d.id);
 assert.ok(guide.includes('"letterSpacing": '+JSON.stringify(d.appearance['design-heading-tracking'])), 'Guide heading tracking matches '+d.id);
 assert.ok(guide.includes(bundle.resolved[d.defaultMode]['design-heading-family'].split(',')[0].replaceAll('"','').replaceAll("'",'')),'Heading family in '+d.id+' guide');
}
assert.throws(()=>loadDesigns({...catalog,defaultDesign:'missing'}));
assert.throws(()=>loadDesigns({...catalog,defaultDesign:'midnight',defaultMode:'light'}));
assert.throws(()=>loadDesigns({...catalog,designs:[...catalog.designs,catalog.designs[0]]}));
// Prove that changing the default regenerates every adapter without modifying the checkout.
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'design-collection-check-'));
try{
 const run=(id,mode)=>{const result=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,DESIGN_DEFAULT:id,DESIGN_MODE:mode,DESIGN_OUTPUT_DIR:scratch}});assert.equal(result.status,0,result.stderr);return JSON.parse(fs.readFileSync(path.join(scratch,'exports/tokens.json'),'utf8'));};
 const forest=run('forest','dark');assert.equal(forest.design,'forest');assert.equal(forest.defaultMode,'dark');assert.match(fs.readFileSync(path.join(scratch,'DESIGN.md'),'utf8'),/Initial mode: dark/);
 const midnight=run('midnight','dark');assert.deepEqual(Object.keys(midnight.resolved),['dark']);assert.ok(!fs.existsSync(path.join(scratch,'tokens/light.tokens.json')));assert.match(fs.readFileSync(path.join(scratch,'exports/tokens.less'),'utf8'),/polo-blue-0/);assert.match(fs.readFileSync(path.join(scratch,'DESIGN.md'),'utf8'),/# Midnight/);assert.match(fs.readFileSync(path.join(scratch,'styles/defaults.css'),'utf8'),/scheme: dark/);
}finally{assert.ok(path.resolve(scratch).startsWith(path.resolve(os.tmpdir())+path.sep+'design-collection-check-'));fs.rmSync(scratch,{recursive:true,force:true});}
assert.match(button({label:'<img onerror="attack">'}),/&lt;img/);assert.doesNotMatch(button({appearance:'x" onclick="attack'}),/onclick/);
assert.match(button({state:'loading'}),/disabled.*aria-busy/);assert.match(button({label:'Publish report',state:'loading'}),/Publish report.*in progress/);assert.match(button({label:'Publish report',state:'skeleton'}),/aria-label="Publish report"/);assert.throws(()=>field({id:'a'}));assert.throws(()=>choice({label:'x'}));assert.throws(()=>progress({value:Infinity}));assert.match(progress({value:130}),/aria-valuenow="100"/);
for(const family of ['inter','sourceserif4','fraunces','intertight','firacode','jetbrainsmono']){assert.match(fs.readFileSync(path.join(root,'assets/fonts',family+'-OFL.txt'),'utf8'),/SIL OPEN FONT LICENSE/);for(const weight of [400,500,600]){const font=fs.readFileSync(path.join(root,'assets/fonts',family+'-'+weight+'.ttf'));assert.equal(font.readUInt32BE(0),65536,'TrueType header');}}
const inventory=read('reference/library-inventory.json');assert.ok(inventory.entries.length>=35);
let checked=0;
const forbidden=[/C:[\\/]+Users[\\/]/i,/\.exe\.xyz\b/i,/remoteserver\./i,/wesley@/i,/daily-brief\//i,/dokploy-campaign\//i,/gh[pousr]_[a-zA-Z0-9]{20,}/,/github_pat_[a-zA-Z0-9_]+/,/-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/];
for(const p of files(root)){
 if(/\.(?:png|jpe?g|woff2?|ttf)$/i.test(p))continue;
 const text=fs.readFileSync(p,'utf8');if(p.endsWith('.json'))JSON.parse(text);
 // Check scanner patterns in all distributed content; exclude its own literal denylist.
 if(!p.endsWith(path.join('scripts','check.mjs')))for(const pattern of forbidden)assert.ok(!pattern.test(text),'Publication scan: '+path.relative(root,p));
 for(const m of text.matchAll(/https?:\/\/(?:github\.com|raw\.githubusercontent\.com)\/([^\s/"')<>]+)/gi))assert.equal(m[1].toLowerCase(),'pagelove','External repository reference in '+path.relative(root,p));
 if(p.endsWith('.md')||p.endsWith('.html')){
   const refs=p.endsWith('.md')?[...text.matchAll(/\]\(([^\s)]+)\)/g)].map(m=>m[1]):[...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
   for(const ref of refs){if(/^(?:https?:|mailto:|#|data:)/.test(ref))continue;const target=ref.split(/[?#]/)[0];if(!target)continue;assert.ok(fs.existsSync(path.resolve(path.dirname(p),target)),`Broken local link ${path.relative(root,p)} -> ${ref}`);}
 }
 checked++;
}
const luminance=h=>{const x=h.replace('#','');const rgb=(x.length===3?[...x].map(c=>c+c).join(''):x).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
const contrast=(a,b)=>{const [hi,lo]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(hi+.05)/(lo+.05);};
const contrasts=[];for(const d of designs)for(const [mode,values]of Object.entries(read(`designs/${d.id}/exports/tokens.json`).resolved))for(const [fg,bg]of [['text-regular','background-surface-light'],['text-strong','background-surface-regular'],['button-strong-text','button-strong-default'],['link-text-default','background-surface-light'],['text-regular','background-surface-regular'],['text-strong','background-surface-strong'],['link-text-default','background-surface-regular'],['button-strong-text','button-strong-hovered'],['button-strong-text','button-strong-pressed']]){const ratio=contrast(values[fg],values[bg]);assert.ok(ratio>=4.5,`${d.id} ${mode} ${fg} contrast ${ratio}`);contrasts.push({design:d.id,mode,fg,bg,ratio:Number(ratio.toFixed(2))});}
const controlContrasts=[];
for(const d of designs)for(const [mode,v]of Object.entries(read('designs/'+d.id+'/exports/tokens.json').resolved))for(const role of ['border-strong','border-focused','border-danger-strong'])for(const surface of ['background-surface-light','background-surface-regular']){const ratio=contrast(v[role],v[surface]);assert.ok(ratio>=3, d.id+' '+mode+' '+role+' on '+surface+' contrast '+ratio);controlContrasts.push({design:d.id,mode,role,surface,ratio:Number(ratio.toFixed(2))});}
const portability=await checkPortability(root,catalog,designs);
console.log(JSON.stringify({result:'pass',portability,textFiles:checked,designs:designs.length,defaultDesign:catalog.defaultDesign,defaultMode:catalog.defaultMode,semanticRolesPerMode:110,libraryEntries:inventory.entries.length,checks:['deterministic generation','per-design exports and mode availability','alternate default regeneration and stale-mode removal','invalid catalog rejection','JSON parsing','token reference resolution','DTCG subset validation','Stitch copy parity','escaping and state contracts','internal-content scan','repository allowlist','local links','selected contrast pairs across designs','control and focus contrast','guide title and tracking parity'],contrasts,controlContrasts,limits:['DTCG subset checks are not an independent full-spec certification.','Figma/Stitch/native/framework imports are not executed here.','Browser task evidence is recorded separately.']},null,2));
