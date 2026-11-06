import {select,textarea,breadcrumbs,tabs,confirmation,errorSummary} from '../components/patterns.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import Ajv from 'ajv/dist/2020.js';
import YAML from 'yaml';
import {validateDtcg} from './validate-dtcg.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const catalog=read('designs/catalog.json'), ajv=new Ajv({allErrors:true});
for(const [schema,paths]of [['catalog',['designs/catalog.json']],['design',catalog.designs.map(d=>'designs/'+d.id+'/design.json')],['semantic',['tokens/semantic.json']]]){
 const validate=ajv.compile(read('schemas/'+schema+'.schema.json'));
 for(const p of paths)assert.ok(validate(read(p)),p+': '+JSON.stringify(validate.errors));
 assert.equal(validate({unexpected:true}),false,'Schema must reject missing required properties');
}
const cssFiles=fs.readdirSync('styles').filter(p=>p.endsWith('.css')).map(p=>'styles/'+p);
const css=cssFiles.map(p=>fs.readFileSync(p,'utf8')).join('\n');
const declared=new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));
for(const p of cssFiles.filter(p=>!p.endsWith('library-components.css')))for(const m of fs.readFileSync(p,'utf8').matchAll(/var\((--[\w-]+)\s*\)/g))assert.ok(declared.has(m[1]),p+': undefined '+m[1]);
assert.throws(()=>breadcrumbs([{label:'unsafe',href:'javascript:alert(1)'},{label:'current'}]));
assert.throws(()=>tabs({id:'t',label:'Test',items:[]}));
assert.throws(()=>select({id:'missing-label'}));
for(const markup of [textarea({id:'description',label:'Description',value:'</textarea><script>alert(1)</script>'}),confirmation({id:'confirm',title:'<script>',message:'test'}),errorSummary([{id:'x',message:'<img src=x onerror=alert(1)>'}])])assert.ok(!markup.includes('<script>')&&!markup.includes('<img '),'Escaped user content');
const results=[];
const output=path.join(os.tmpdir(),'pagelove-tailwind-'+process.pid+'.css');
try {
 const run=spawnSync(process.execPath,['node_modules/@tailwindcss/cli/dist/index.mjs','-i','tests/tailwind.css','-o',output],{encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
 const generated=fs.readFileSync(output,'utf8');
 for(const name of ['.bg-background-surface-light','.text-text-regular','.rounded-card','.font-sans'])assert.ok(generated.includes(name),'Tailwind utility '+name);
} finally {if(fs.existsSync(output))fs.unlinkSync(output);}
for(const prefix of ['',...catalog.designs.map(d=>'designs/'+d.id+'/')]){
 const bundle=read(prefix+'exports/tokens.json'), resolver=read(prefix+'tokens/tokens.resolver.json');
 assert.equal(resolver.version,'2025.10');assert.equal(resolver.modifiers.mode.default,bundle.defaultMode);
 assert.deepEqual(Object.keys(resolver.modifiers.mode.contexts),Object.keys(bundle.resolved));
 assert.deepEqual(resolver.resolutionOrder,[{$ref:'#/sets/base'},{$ref:'#/modifiers/mode'}]);
 const studio=read(prefix+'exports/tokens-studio.json');
 for(const mode of Object.keys(bundle.resolved)){
   const sources=[...resolver.sets.base.sources,...resolver.modifiers.mode.contexts[mode]];
   const tokens=Object.assign({},...sources.map(s=>read(path.join(prefix,'tokens',s.$ref))));validateDtcg(tokens);
   for(const k of Object.keys(bundle.semantic[mode]))assert.equal(tokens[k].$value,studio[mode][k].value);
   const file=prefix+'.stitch/'+mode+'.DESIGN.md';
   const doc=YAML.parseDocument(fs.readFileSync(file,'utf8').split('---')[1]);assert.equal(doc.errors.length,0);const guide=doc.toJS();
   for(const [k,v]of Object.entries(bundle.semantic[mode]))assert.equal(guide.colors[k],bundle.resolved[mode][k]);
   const run=spawnSync(process.execPath,['node_modules/@google/design.md/dist/index.js','lint',file],{encoding:'utf8'});
   assert.equal(run.status,0,run.stderr);const lint=JSON.parse(run.stdout);assert.equal(lint.summary.errors,0);
   const unexpected=lint.findings.filter(f=>f.severity==='warning'&&f.rule!=='orphaned-tokens');assert.deepEqual(unexpected,[],file);
   results.push({file,...lint.summary,acceptedWarnings:'Unused palette roles remain available for consuming apps.'});
 }
 for(const [k,t]of Object.entries(studio.global))if(/^(font-size-|font-weight-|font-family-|design-radius-)/.test(k))assert.notEqual(t.type,'other',k);
 assert.equal(read(prefix+'exports/manifest.json').releaseVersion,read('package.json').version);
}
const fonts=fs.readdirSync('assets/fonts').filter(p=>p.endsWith('.woff2'));
assert.equal(fonts.length,18);const fontBytes=fonts.reduce((n,p)=>n+fs.statSync('assets/fonts/'+p).size,0);
assert.ok(fontBytes<2000000,'WOFF2 archive budget: 2 MB');
for(const p of fonts)assert.equal(fs.readFileSync('assets/fonts/'+p).toString('ascii',0,4),'wOF2');
assert.ok(fs.statSync('styles/designs.css').size<250000,'Collection CSS budget: 250 KB');
assert.ok(fs.statSync('examples/designs.html').size<30000,'Gallery HTML budget: 30 KB');
console.log(JSON.stringify({result:'pass',schemas:3,cssReferences:'pass',fontBytes,stitch:results},null,2));
