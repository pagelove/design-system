import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readBrowserEnvironment,validateBrowserEnvironment} from './check-browser-environment.mjs';

const current=readBrowserEnvironment();
test('installed runner, complete lock graph and CI image agree',()=>assert.equal(validateBrowserEnvironment(current).result,'pass'));
const cases=[
  ['version range',x=>x.manifest.devDependencies['@playwright/test']='^1.64.1',/exact stable Playwright/],
  ['detached core override',x=>x.manifest.overrides['playwright-core']='1.64.1',/override linked/],
  ['stale root lock entry',x=>x.lock.packages[''].devDependencies['@playwright/test']='0.0.0',/Refresh the lockfile/],
  ['stale installed driver',x=>x.installed['playwright-core']='0.0.0',/installed version differs/],
  ['nested peer conflict',x=>x.lock.packages['node_modules/peer/node_modules/playwright-core']={version:'0.0.0'},/conflicting locked browser driver/],
  ['mismatched dependency edge',x=>x.lock.packages['node_modules/playwright'].dependencies['playwright-core']='0.0.0',/matching core/],
  ['mismatched CI image',x=>x.workflow.jobs.verify.container.image=x.workflow.jobs.verify.container.image.replace(/:v\d+\.\d+\.\d+-/,':v0.0.0-'),/CI container version must match/],
  ['unpinned CI digest',x=>x.workflow.jobs.verify.container.image=x.workflow.jobs.verify.container.image.split('@')[0],/digest-pinned official/]
];
for(const [name,mutate,message]of cases)test(`reject ${name}`,()=>{const changed=structuredClone(current);mutate(changed);assert.throws(()=>validateBrowserEnvironment(changed),message);});
