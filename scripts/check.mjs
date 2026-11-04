import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {button,field,choice,progress} from '../components/index.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).filter(e=>!['.git','node_modules'].includes(e.name)).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const initial=files(root);const before=Object.fromEntries(initial.map(p=>[p,hash(p)]));
const rebuild=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,encoding:'utf8'});assert.equal(rebuild.status,0,rebuild.stderr);
for(const p of initial)assert.equal(hash(p),before[p],'Generated drift: run npm run build: '+path.relative(root,p));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const all=read('exports/tokens.json');assert.equal(Object.keys(all.foundations).length,233);
assert.deepEqual(Object.keys(all.semantic).sort(),['dark','light']);
for(const roles of Object.values(all.semantic))for(const [key,value]of Object.entries(roles)){assert.match(key,/^[a-z][a-z0-9-]*$/);assert.match(value,/^var\(--color-[a-z0-9-]+\)$/);}
for(const mode of ['light','dark']){assert.equal(Object.keys(all.semantic[mode]).length,110);for(const [k,v]of Object.entries(all.resolved[mode])){assert.ok(!v.includes('var('),`${mode}.${k} unresolved`);assert.ok(!v.includes('undefined'),k);}}
const dtcg={...read('tokens/foundations.tokens.json'),...read('tokens/light.tokens.json')};
for(const [k,t]of Object.entries(dtcg)){
 assert.ok(t.$type&&t.$value!==undefined,k);
 for(const m of JSON.stringify(t.$value).matchAll(/\{([\w-]+)\}/g))assert.ok(dtcg[m[1]],`${k} missing ${m[1]}`);
 if(t.$type==='number'||t.$type==='fontWeight')assert.ok(Number.isFinite(t.$value),k);
 if(t.$type==='color'&&typeof t.$value==='object')assert.ok(t.$value.components.every(x=>Number.isFinite(x)&&x>=0&&x<=1),k);
}
assert.equal(fs.readFileSync(path.join(root,'DESIGN.md'),'utf8'),fs.readFileSync(path.join(root,'.stitch/DESIGN.md'),'utf8'));
assert.match(button({label:'<img onerror="attack">'}),/&lt;img/);assert.doesNotMatch(button({appearance:'x" onclick="attack'}),/onclick/);
assert.match(button({state:'loading'}),/disabled.*aria-busy/);assert.throws(()=>field({id:'a'}));assert.throws(()=>choice({label:'x'}));assert.throws(()=>progress({value:Infinity}));assert.match(progress({value:130}),/aria-valuenow="100"/);
const inventory=read('reference/library-inventory.json');assert.ok(inventory.entries.length>=35);
let checked=0;
const forbidden=[/C:[\\/]+Users[\\/]/i,/\.exe\.xyz\b/i,/remoteserver\./i,/wesley@/i,/daily-brief\//i,/dokploy-campaign\//i,/gh[pousr]_[a-zA-Z0-9]{20,}/,/github_pat_[a-zA-Z0-9_]+/,/-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/];
for(const p of files(root)){
 if(/\.(?:png|jpe?g|woff2?)$/i.test(p))continue;
 const text=fs.readFileSync(p,'utf8');if(p.endsWith('.json'))JSON.parse(text);
 // Check scanner patterns in all distributed content; exclude its own literal denylist.
 if(!p.endsWith(path.join('scripts','check.mjs')))for(const pattern of forbidden)assert.ok(!pattern.test(text),'Publication scan: '+path.relative(root,p));
 for(const m of text.matchAll(/https?:\/\/(?:github\.com|raw\.githubusercontent\.com)\/([^\s/"')<>]+)/gi))assert.equal(m[1].toLowerCase(),'pagelove','External repository reference in '+path.relative(root,p));
 if(p.endsWith('.md')||p.endsWith('.html')){
   const refs=p.endsWith('.md')?[...text.matchAll(/\]\(([^\s)]+)\)/g)].map(m=>m[1]):[...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
   for(const ref of refs){if(/^(?:https?:|mailto:|#|data:)/.test(ref))continue;const target=ref.split('#')[0];if(!target)continue;assert.ok(fs.existsSync(path.resolve(path.dirname(p),target)),`Broken local link ${path.relative(root,p)} -> ${ref}`);}
 }
 checked++;
}
const luminance=h=>{const x=h.replace('#','');const rgb=(x.length===3?[...x].map(c=>c+c).join(''):x).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
const contrast=(a,b)=>{const [hi,lo]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(hi+.05)/(lo+.05);};
const contrasts=[];for(const mode of ['light','dark'])for(const [fg,bg]of [['text-regular','background-surface-light'],['text-strong','background-surface-regular'],['button-strong-text','button-strong-default']]){const ratio=contrast(all.resolved[mode][fg],all.resolved[mode][bg]);assert.ok(ratio>=4.5,`${mode} ${fg} contrast ${ratio}`);contrasts.push({mode,fg,bg,ratio:Number(ratio.toFixed(2))});}
console.log(JSON.stringify({result:'pass',textFiles:checked,foundationTokens:233,semanticRolesPerTheme:110,libraryEntries:inventory.entries.length,checks:['deterministic generation','JSON parsing','token reference resolution','DTCG subset validation','Stitch copy parity','escaping and state contracts','internal-content scan','repository allowlist','local links','selected contrast pairs'],contrasts,limits:['DTCG subset checks are not an independent full-spec certification.','Figma/Stitch/native/framework imports are not executed here.','Browser task evidence is recorded separately.']},null,2));
