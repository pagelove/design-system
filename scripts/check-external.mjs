import {select,textarea,breadcrumbs,tabs,confirmation,errorSummary} from '../components/patterns.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import Ajv from 'ajv/dist/2020.js';
import YAML from 'yaml';
import {validateDtcg} from './validate-dtcg.mjs';
import {resolveTokens} from './resolve-tokens.mjs';
import {checkTypography} from './check-typography.mjs';
import {forcedColor} from './forced-colors.mjs';
import {checkConsumers} from './check-consumers.mjs';
import {checkFrameworks} from './check-frameworks.mjs';
const typographyConversions=checkTypography();
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const catalog=read('designs/catalog.json'), ajv=new Ajv({allErrors:true});
for(const roles of Object.values(read('tokens/semantic.json')))for(const role of Object.keys(roles))assert.ok(forcedColor(role));
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
for(const href of ['data:text/html,test','//example.invalid','/\\example.invalid','java\nscript:alert(1)'])assert.throws(()=>breadcrumbs([{label:'unsafe',href},{label:'current'}]));
assert.ok(breadcrumbs([{label:'Settings',href:'settings/profile?tab=account'},{label:'Current'}]).includes('href="settings/profile?tab=account"'));
assert.ok(select({id:'quantity',label:'Quantity',value:'2',options:[{value:2,label:'Two'}]}).includes('value="2" selected'));
assert.throws(()=>tabs({id:'t',label:'Test',items:[]}));
assert.throws(()=>select({id:'missing-label'}));
for(const markup of [textarea({id:'description',label:'Description',value:'</textarea><script>alert(1)</script>'}),confirmation({id:'confirm',title:'<script>',message:'test'}),errorSummary([{id:'x',message:'<img src=x onerror=alert(1)>'}])])assert.ok(!markup.includes('<script>')&&!markup.includes('<img '),'Escaped user content');
const results=[];
const fixture={version:'2025.10',sets:{first:{sources:[{x:{$type:'number',$value:1}}]},last:{sources:[{x:{$type:'number',$value:2}}]}},resolutionOrder:[{$ref:'#/sets/first'},{$ref:'#/sets/last'}]};
assert.equal(resolveTokens(fixture,{},()=>{}).x.$value,2,'Later sources override earlier ones');
assert.throws(()=>resolveTokens({...fixture,modifiers:{mode:{default:'dark',contexts:{dark:[]}}}},{},()=>{}),'Reject one-context modifier');
assert.throws(()=>resolveTokens({...fixture,sets:{first:{sources:[{$ref:'#/sets/first'}]}}},{},()=>{}),'Reject circular set reference');
const output=path.join(os.tmpdir(),'pagelove-tailwind-'+process.pid+'.css');
try {
 const run=spawnSync(process.execPath,['node_modules/@tailwindcss/cli/dist/index.mjs','-i','tests/tailwind.css','-o',output],{encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
 const generated=fs.readFileSync(output,'utf8');
 for(const name of ['.bg-background-surface-light','.text-text-regular','.rounded-card','.font-sans'])assert.ok(generated.includes(name),'Tailwind utility '+name);
} finally {if(fs.existsSync(output))fs.unlinkSync(output);}
for(const prefix of ['',...catalog.designs.map(d=>'designs/'+d.id+'/')]){
 const bundle=read(prefix+'exports/tokens.json'), resolver=read(prefix+'tokens/tokens.resolver.json');
 const multiMode=Object.keys(bundle.resolved).length>1;
 if(multiMode){assert.equal(resolver.modifiers.mode.default,bundle.defaultMode);assert.deepEqual(Object.keys(resolver.modifiers.mode.contexts),Object.keys(bundle.resolved));}
 else assert.equal(resolver.modifiers,undefined,'A one-mode bundle must use unconditional sets');
 const consume=input=>resolveTokens(resolver,input,ref=>read(path.join(prefix,'tokens',ref)));
 const initial=consume({});validateDtcg(initial);
 assert.deepEqual(initial,consume(multiMode?{mode:bundle.defaultMode}:{}),'Resolver default parity');
 assert.throws(()=>consume({mode:'unavailable'}),'Reject unknown modifiers and unavailable modes');
 const studio=read(prefix+'exports/tokens-studio.json');
 for(const mode of Object.keys(bundle.resolved)){
   const tokens=consume(multiMode?{mode}:{});validateDtcg(tokens);
   assert.deepEqual(Object.keys(tokens).sort(),[...Object.keys(bundle.resolved[mode]),...Object.keys(read(prefix+'tokens/typography.tokens.json'))].sort(),'Complete resolver output');
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
const consumerFormats=await checkConsumers(process.cwd(),catalog.designs);
const frameworks=await checkFrameworks();
console.log(JSON.stringify({result:'pass',consumerFormats,frameworks,typographyConversions,schemas:3,cssReferences:'pass',resolverBundles:catalog.designs.length+1,resolverChecks:['reference-driven composition','default and explicit mode parity','complete token coverage','invalid inputs','single-context rejection','cycles','source override order'],helperInputs:'pass',fontBytes,stitch:results},null,2));
