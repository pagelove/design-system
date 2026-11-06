import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import YAML from 'yaml';
import {XMLParser, XMLValidator} from 'fast-xml-parser';
import * as sass from 'sass';
import less from 'less';
import ts from 'typescript';
import {lessValue} from './less-value.mjs';

// Independent parsers/compilers consume every shipped value, not just representative names.
export async function checkConsumers(root, designs) {
 const reports=[];
 const tricky = `"Reader's Font", "A\\B", @theme, $value`;
 assert.equal((await less.render('.fixture { value: '+lessValue(tricky)+'; }')).css.trim(),'.fixture {\n  value: '+tricky+';\n}','Less punctuation fixture');
 assert.throws(()=>lessValue('a\nb'),/single-line/);
 for(const prefix of ['',...designs.map(d=>'designs/'+d.id+'/')]) {
  const dir=path.join(root,prefix), read=p=>fs.readFileSync(path.join(dir,p),'utf8');
  const bundle=JSON.parse(read('exports/tokens.json')), {resolved,...structured}=bundle;
  assert.deepEqual(YAML.parse(read('exports/tokens.yaml')),structured,'YAML complete parity');
  const xml=read('exports/tokens.xml'); assert.equal(XMLValidator.validate(xml),true,'Well-formed XML');
  const parsed=new XMLParser({ignoreAttributes:false,parseAttributeValue:false,isArray:name=>['theme','token'].includes(name)}).parse(xml)['design-system'];
  const fromXML=Object.fromEntries(parsed.theme.map(theme=>[theme['@_name'],Object.fromEntries(theme.token.map(t=>[t['@_name'],t['@_value']]))]));
  assert.deepEqual(fromXML,resolved,'XML complete parity');
  const fromSass={};
  sass.compileString('@use "exports/tokens"; @each $mode, $values in tokens.$tokens { @each $key, $value in $values { $checked: verify-token($mode, $key, $value); } }',{
   loadPaths:[dir],functions:{'verify-token($mode, $key, $value)':([m,k,v])=>{(fromSass[m.assertString().text]??={})[k.assertString().text]=v.assertString().text;return sass.sassTrue;}}
  });
  assert.deepEqual(fromSass,resolved,'Sass complete parity');
  const requested={...Object.fromEntries(Object.entries(resolved[bundle.defaultMode]).map(([k,v])=>[k,v])),...Object.fromEntries(Object.entries(resolved).flatMap(([m,values])=>Object.entries(values).map(([k,v])=>[m+'-'+k,v])))};
  const css=(await less.render(read('exports/tokens.less')+'\n.consumer {\n'+Object.keys(requested).map(k=>'--'+k+': @'+k+';').join('\n')+'\n}',{javascriptEnabled:false})).css;
  const fromLess=Object.fromEntries([...css.matchAll(/--([\w-]+): (.*);/g)].map(([,k,v])=>[k,v]));
  assert.deepEqual(fromLess,requested,'Less complete default/mode parity');
  const program=ts.createProgram([path.join(dir,'exports/tokens.ts')],{noEmit:true,strict:true,target:ts.ScriptTarget.ES2022,types:[]});
  assert.deepEqual(ts.getPreEmitDiagnostics(program).map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')),[],'TypeScript type check');
  const output=ts.transpileModule(read('exports/tokens.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const scope={exports:{}};vm.runInNewContext(output,scope);
  assert.deepEqual(JSON.parse(JSON.stringify(scope.exports.tokens)),resolved,'Executed TypeScript output parity');
  for(const [file,pattern] of [['exports/tokens.txt',/^([\w-]+) = (.*)$/gm],['exports/tokens.md',/^\| `([\w-]+)` \| `(.*)` \|$/gm]]) {
   const text=read(file), values=[...text.matchAll(pattern)].map(([,k,v])=>[k,v]);
   assert.deepEqual(values,Object.values(resolved).flatMap(Object.entries),file+' complete ordered parity');
  }
  const svg=read('assets/palette.svg');assert.equal(XMLValidator.validate(svg),true,'SVG parses as XML');
  const palette=new XMLParser({ignoreAttributes:false,isArray:name=>name==='g'||name==='text'}).parse(svg).svg.g;
  assert.deepEqual(palette.map(g=>g.rect['@_fill']),Object.entries(bundle.foundations).filter(([k])=>k.startsWith('color-')).map(([,v])=>v),'SVG swatch parity');
  reports.push({bundle:prefix||'root',modes:Object.keys(resolved),checks:['YAML parser/value parity','XML parser/value parity','Sass compiler/map parity','Less compiler/default and mode parity','TypeScript type check and executed value parity','text and Markdown complete parity','SVG XML and swatch parity']});
 }
 return reports;
}
