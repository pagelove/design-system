import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('designs/index.json','utf8'));
const accessible=async page=>expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
for(const design of catalog.designs)for(const mode of design.modes) {
 test(`${design.id}/${mode}: full workspace tasks and settings recovery`,async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/examples/workspace.html?design=${design.id}&mode=${mode}`);
  await accessible(page);
  await page.getByRole('link',{name:'Open collection',exact:true}).click();
  await page.getByLabel('Find a story').fill('not a matching story');
  await expect(page.locator('[data-collection="fieldnotes"] [data-empty]')).toBeVisible();
  await page.getByRole('button',{name:'Clear search',exact:true}).click();
  await expect(page.getByLabel('Find a story')).toBeFocused();
  await page.getByRole('button',{name:'Add a story'}).click();
  await expect(page.getByLabel('Story title')).toBeFocused();
  await page.keyboard.press('Shift+Tab');await expect(page.getByRole('button',{name:'Cancel',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.getByLabel('Story title')).toBeFocused();
  await page.getByLabel('Story title').fill('   ');
  await page.getByRole('button',{name:'Create draft'}).click();await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Story title').fill('A <literal> title & details');
  await page.getByRole('button',{name:'Create draft'}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Add a story'})).toBeFocused();
  await expect(page.getByRole('heading',{name:'A <literal> title & details',exact:true})).toBeVisible();
  await expect(page.locator('[data-collection="fieldnotes"] [data-progress]')).toHaveText('2 of 5 ready');
  await accessible(page);
  await page.getByRole('link',{name:'Settings 03'}).click();
  await page.getByLabel('Email address',{exact:true}).fill('invalid');
  await page.getByRole('button',{name:'Save preferences'}).click();
  await expect(page.getByLabel('Email address',{exact:true})).toHaveAttribute('aria-invalid','true');
  await expect(page.getByLabel('Email address',{exact:true})).toBeFocused();
  await page.getByLabel('Email address',{exact:true}).fill('reader@example.com');
  await expect(page.getByLabel('Email address',{exact:true})).not.toHaveAttribute('aria-invalid','true');
  await expect(page.locator('#email-error')).not.toBeVisible();
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now()+1000));
  await page.getByLabel('Display name').fill('Submitted Reader');
  await page.getByRole('button',{name:'Save preferences'}).click();
  await page.getByLabel('Display name').fill('Newer Reader');
  await page.clock.fastForward(700);
  await expect(page.locator('#profile-name')).toHaveText('Submitted Reader');
  await expect(page.locator('#save-status')).toContainText('newer edits are still unsaved');
  await expect(page.getByRole('button',{name:'Save preferences'})).toBeEnabled();
  await page.getByRole('button',{name:'Save preferences'}).click();
  await page.getByRole('button',{name:'Reset',exact:true}).click();await page.clock.fastForward(700);
  await expect(page.getByLabel('Display name')).toHaveValue('Alex Lee');
  await expect(page.locator('#profile-name')).toHaveText('Alex Lee');
  await expect(page.getByRole('button',{name:'Save preferences'})).toBeDisabled();
  await accessible(page);
  await page.getByLabel('Reading size').selectOption('extra-large');
  await page.getByLabel('Interface motion').selectOption('reduce');
  await expect(page.locator('#save')).toHaveCSS('transition-duration','0s');
  await page.setViewportSize({width:320,height:900});
  await page.addStyleTag({content:'* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p {margin-bottom:2em!important}'});
  await page.evaluate(()=>document.documentElement.dir='rtl');
  for(const screen of ['Settings 03','Collection 02','Overview 01']) {
   await page.getByRole('link',{name:screen}).click();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),screen+' reflow').toBe(true);
  }
  await page.screenshot({path:info.outputPath('workspace-enlarged-rtl.png'),fullPage:true});
  expect(errors).toEqual([]);
 });
 test(`${design.id}/${mode}: remaining previews, fonts and reflow`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const url of [`/examples/catalog.html?design=${design.id}&mode=${mode}`,`/examples/quality.html?design=${design.id}&mode=${mode}`,`/designs/${design.id}/preview.html?mode=${mode}`]) {
   await page.goto(url);await accessible(page);
   if(url.includes('quality')) { await expect(page.locator('#fonts .font-result')).toHaveCount(9);await expect(page.locator('#fonts')).not.toContainText('failed'); }
   for(const width of [320,768,1440]) {await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),url+' '+width).toBe(true);}
  }
  expect(errors).toEqual([]);
 });
}
test('cancelled drafts remain scoped and history closes a stale creation dialog',async({page})=>{
 await page.goto('/examples/workspace.html?screen=project&collection=fieldnotes');
 await page.getByRole('button',{name:'Add a story'}).click();await page.getByLabel('Story title').fill('Fieldnotes draft');
 await page.keyboard.press('Escape');
 await page.getByRole('link',{name:'Overview 01'}).click();
 await page.locator('.collection-card[data-collection-link="ways"]').click();
 await page.getByRole('button',{name:'Add a note'}).click();await expect(page.getByLabel('Note title')).toHaveValue('');
 await page.getByLabel('Note title').fill('Ways draft');await page.getByRole('button',{name:'Cancel',exact:true}).click();
 await page.getByRole('link',{name:'Overview 01'}).click();await page.locator('.collection-card[data-collection-link="fieldnotes"]').click();
 await page.getByRole('button',{name:'Add a story'}).click();await expect(page.getByLabel('Story title')).toHaveValue('Fieldnotes draft');
 await page.goBack();await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.goForward();await page.getByRole('button',{name:'Add a story'}).click();await expect(page.getByLabel('Story title')).toHaveValue('Fieldnotes draft');
});
test('gallery and no-script reading remain usable',async({page,browser})=>{
 await page.goto('/examples/designs.html');await accessible(page);
 for(const width of [320,768,1440]) {await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);}
 const context=await browser.newContext({javaScriptEnabled:false});const reader=await context.newPage();
 for(const [url,title] of [['/examples/designs.html','Find your starting point.'],['/examples/workspace.html','Room for good work.']]) {
  await reader.goto('http://127.0.0.1:4173'+url);await expect(reader.getByRole('heading',{level:1})).toBeVisible();
 }
 await context.close();
});
