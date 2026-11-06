import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {parse,compileScript} from '@vue/compiler-sfc';
import {compile} from 'svelte/compiler';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createSSRApp,h} from 'vue';
import {renderToString} from 'vue/server-renderer';
import {render} from 'svelte/server';
import {createRawSnippet} from 'svelte';
const require=createRequire(import.meta.url);
const read=name=>fs.readFileSync('examples/frameworks/'+name,'utf8');
function execute(source,filename) {
 const compiled=ts.transpileModule(source,{fileName:filename,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}});
 assert.deepEqual(compiled.diagnostics,[]);
 const scope={exports:{},require};vm.runInNewContext(compiled.outputText,scope);return scope.exports;
}
export async function checkFrameworks() {
 const program=ts.createProgram(['examples/frameworks/Button.tsx'],{noEmit:true,strict:true,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.NodeNext,target:ts.ScriptTarget.ES2022,types:['react']});
 assert.deepEqual(ts.getPreEmitDiagnostics(program).map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')),[],'React type check');
 const react=execute(read('Button.tsx'),'Button.tsx').Button;
 const {descriptor,errors}=parse(read('Button.vue'),{filename:'Button.vue'});assert.deepEqual(errors,[]);
 const vue=execute(compileScript(descriptor,{id:'consumer-button',inlineTemplate:true,templateOptions:{ssr:true}}).content,'Button.ts').default;
 const svelteOutput=compile(read('Button.svelte'),{filename:'Button.svelte',generate:'server'});assert.deepEqual(svelteOutput.warnings,[]);
 assert.deepEqual(compile(read('Button.svelte'),{filename:'Button.svelte',generate:'client'}).warnings,[]);
 const svelte=execute(svelteOutput.js.code,'Button.js').default;
 const reports=[];
 for(const [name,renderButton] of [
  ['React',props=>renderToStaticMarkup(React.createElement(react,props,'Continue'))],
  ['Vue',props=>renderToString(createSSRApp({render:()=>h(vue,props,{default:()=>['Continue']})}))],
  ['Svelte',props=>render(svelte,{props:{...props,children:createRawSnippet(()=>({render:()=>'<span>Continue</span>'}))}}).body]
 ]) {
  for(const props of [{},{busy:true},{disabled:true}]) {
   const html=await renderButton(props);
   assert.match(html,/<button\b/);assert.match(html,/type="button"/);assert.match(html,/Continue/);
   assert.equal(/\sdisabled(?:[ =>])/.test(html),!!(props.busy||props.disabled),name+' disabled semantics');
   assert.equal(/aria-busy="true"/.test(html),!!props.busy,name+' busy semantics');
   assert.equal(/in progress/.test(html),!!props.busy,name+' visible pending status');
  }
  reports.push({framework:name,checks:['compiler','server render: default, disabled, busy'],limits:'No hydrated client integration or consuming-app build claimed.'});
 }
 return reports;
}
