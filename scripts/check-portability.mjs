import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {validateDtcg} from './validate-dtcg.mjs';
const require = createRequire(import.meta.url);

function parseCSV(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i+1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && char === ',') { row.push(field); field = ''; }
    else if (!quoted && char === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (char !== '\r' || quoted) field += char;
  }
  assert.equal(quoted,false,'Unclosed CSV field');
  if (field || row.length) rows.push([...row,field]);
  return rows;
}

export async function checkPortability(root, catalog, designs) {
  const report = [];
  for (const prefix of ['', ...designs.map(d => 'designs/'+d.id+'/')]) {
    const dir = path.join(root,prefix), read = file => JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
    const bundle = read('exports/tokens.json');
    const foundations=read('tokens/foundations.tokens.json');
    assert.deepEqual(Object.keys(foundations).sort(),Object.keys(bundle.foundations).sort(),'DTCG foundation coverage');
    for(const [key,css] of Object.entries(bundle.foundations))assert.equal(foundations[key].$extensions['com.pagelove.design-system'].css,css,'Preserved CSS: '+key);
    for (const mode of Object.keys(bundle.resolved)) validateDtcg({...read('tokens/foundations.tokens.json'),...read('tokens/'+mode+'.tokens.json')});
    const cjs = require(path.join(dir,'exports/tokens.cjs'));
    const esm = await import(pathToFileURL(path.join(dir,'exports/tokens.mjs')).href);
    assert.deepEqual(cjs,bundle.resolved,'CommonJS round trip');
    assert.deepEqual(esm.default,bundle.resolved,'ES module round trip');
    assert.equal(esm.tokens,esm.default);
    const rows = parseCSV(fs.readFileSync(path.join(dir,'exports/tokens.csv'),'utf8'));
    assert.deepEqual(rows.shift(),['theme','name','value']);
    const seen = new Set();
    for (const [mode,key,value,...rest] of rows) {
      assert.equal(rest.length,0); assert.ok(!seen.has(mode+'/'+key),'Duplicate CSV token'); seen.add(mode+'/'+key);
      assert.equal(value,bundle.resolved[mode]?.[key],'CSV round trip: '+key);
    }
    assert.equal(seen.size,Object.values(bundle.resolved).reduce((count,mode) => count+Object.keys(mode).length,0));
    report.push({bundle:prefix || 'root',modes:Object.keys(bundle.resolved),checks:['DTCG type/value/alias contracts','executed ES module','executed CommonJS','CSV value parity']});
  }
  const base = JSON.parse(fs.readFileSync(path.join(root,'tokens/foundations.tokens.json'),'utf8'));
  assert.throws(() => validateDtcg({...base,invalid:{$type:'string',$value:'none'}}));
  assert.throws(() => validateDtcg({...base,invalid:{$type:'duration',$value:{value:-1,unit:'ms'}}}));
  assert.throws(() => validateDtcg({...base,invalid:{$type:'dimension',$value:'{font-family-brand}'}}));
  for(const name of ['catalog','workspace','quality']){const html=fs.readFileSync(path.join(root,'examples',name+'.html'),'utf8');const scripts=[...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(match=>path.basename(match[1]));assert.ok(scripts.indexOf('selection.js')>=0 && scripts.indexOf('selection.js')<scripts.indexOf(name+'.js'),'Selection dependency order: '+name);}
  const scope = {}; vm.runInNewContext(fs.readFileSync(path.join(root,'examples/selection.js'),'utf8'),scope);
  const resolve = scope.DesignSelection.resolve;
  const fixture = {...catalog,defaultDesign:'forest',defaultMode:'dark',designs:designs.map(d=>({...d,modes:Object.keys(d.modes)}))};
  assert.equal(resolve(fixture,null,null).mode,'dark');
  assert.equal(resolve(fixture,'unknown',null).mode,'dark');
  assert.equal(resolve(fixture,'forest',null).mode,'light');
  assert.equal(resolve(fixture,'forest','dark').mode,'dark');
  assert.equal(resolve(fixture,'midnight','light').mode,'dark');
  return report;
}
