import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import YAML from 'yaml';

export function validateBrowserEnvironment({manifest,lock,workflow,installed}) {
  const version=manifest.devDependencies?.['@playwright/test'];
  assert.match(version??'',/^\d+\.\d+\.\d+$/,'Pin an exact stable Playwright version');
  assert.equal(manifest.overrides?.['playwright-core'],'$@playwright/test','Keep the core override linked to @playwright/test');
  assert.equal(lock.packages?.['']?.devDependencies?.['@playwright/test'],version,'Refresh the lockfile after changing Playwright');
  const names=['@playwright/test','playwright','playwright-core'];
  for(const name of names) {
    assert.equal(lock.packages?.[`node_modules/${name}`]?.version,version,`${name}: locked version must match the runner`);
    assert.equal(installed[name],version,`${name}: installed version differs; run npm ci`);
  }
  // Check nested peer copies too: the runner's root version alone is insufficient.
  const copies=Object.entries(lock.packages).filter(([key])=>/(?:^|\/)node_modules\/(?:@playwright\/test|playwright|playwright-core)$/.test(key));
  for(const [key,pkg]of copies)assert.equal(pkg.version,version,`${key}: conflicting locked browser driver`);
  assert.equal(lock.packages['node_modules/@playwright/test'].dependencies?.playwright,version,'Runner must depend on the matching Playwright');
  assert.equal(lock.packages['node_modules/playwright'].dependencies?.['playwright-core'],version,'Playwright must depend on the matching core');
  const image=workflow.jobs?.verify?.container?.image;
  const imageParts=/^mcr\.microsoft\.com\/playwright:v(\d+\.\d+\.\d+)-noble@sha256:([a-f0-9]{64})$/.exec(image??'');
  assert.ok(imageParts,'Use the digest-pinned official Noble browser image');
  assert.equal(imageParts[1],version,'CI container version must match the runner');
  return {result:'pass',version,lockedCopies:copies.length,installed,image,limits:'Checks version alignment and digest syntax; registry digest identity and Linux execution are separate checks.'};
}

export function readBrowserEnvironment(root=process.cwd()) {
  const json=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
  return {
    manifest:json('package.json'),
    lock:json('package-lock.json'),
    workflow:YAML.parse(fs.readFileSync(path.join(root,'.github/workflows/verify.yml'),'utf8')),
    installed:Object.fromEntries(['@playwright/test','playwright','playwright-core'].map(name=>[name,json(`node_modules/${name}/package.json`).version]))
  };
}
