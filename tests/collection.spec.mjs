import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('designs/index.json','utf8'));
for(const design of catalog.designs)for(const mode of design.modes){
 const values=JSON.parse(fs.readFileSync(`designs/${design.id}/exports/tokens.json`,'utf8')).resolved[mode];
 test(`${design.id}/${mode}: patterns, accessibility and responsive states`,async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/examples/patterns.html?design=${design.id}&mode=${mode}`);
  await expect(page.getByRole('button',{name:'Save description'})).toHaveCSS('border-top-left-radius',values['design-radius-button']);
  await expect(page.getByLabel('Project description')).toHaveCSS('border-top-left-radius',values['design-radius-input']);
  await expect(page.locator('.pattern-grid>section').first()).toHaveCSS('padding-top',values['design-panel-padding']);
  await expect(page.locator('.pattern-grid')).toHaveCSS('row-gap',values['design-section-gap']);
  await expect(page.getByRole('tab',{name:'Overview'})).toBeVisible();
  await page.getByRole('tab',{name:'Overview'}).press('ArrowRight');
  await expect(page.getByRole('tab',{name:'Activity'})).toBeFocused();
  await expect(page.getByRole('tab',{name:'Activity'})).toHaveAttribute('aria-selected','true');
  await page.getByRole('tab',{name:'Activity'}).press('Home');
  await expect(page.getByRole('tab',{name:'Overview'})).toBeFocused();
  await page.getByRole('tab',{name:'Overview'}).press('End');
  await expect(page.getByRole('tab',{name:'Activity'})).toBeFocused();
  await page.getByRole('button',{name:'Archive project',exact:true}).click();
  await expect(page.getByRole('button',{name:'Cancel',exact:true})).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button',{name:'Archive',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button',{name:'Cancel',exact:true})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Archive project',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Archive project',exact:true}).click();
  await page.getByRole('button',{name:'Archive',exact:true}).click();
  await page.getByRole('button',{name:'Archive project',exact:true}).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#archive-status')).toHaveText('Archive cancelled.');
  await page.getByRole('button',{name:'Save description'}).click();
  await expect(page.locator('[data-error-summary]')).toBeFocused();
  await page.getByRole('link',{name:'Enter a project description.'}).click();
  await expect(page.getByLabel('Project description')).toBeFocused();
  await page.getByLabel('Project description').fill('A readable project description');
  await page.getByRole('button',{name:'Save description'}).click();
  await expect(page.getByText('Description saved locally')).toBeVisible();
  await page.getByLabel('Project description').fill('');
  await expect(page.getByText('Description saved locally')).toHaveCount(0);
  await page.getByRole('button',{name:'Save description'}).click();
  await expect(page.locator('[data-error-summary]')).toBeFocused();
  await expect(page.getByText('Description saved locally')).toHaveCount(0);
  await page.getByLabel('Project description').fill('A readable project description');
  await page.getByRole('button',{name:'Save description'}).click();
  await page.getByRole('button',{name:'Sort by project name'}).click();
  await expect(page.locator('[aria-sort]')).toHaveAttribute('aria-sort','descending');
  await expect(page.locator('#records tr').first()).toContainText('Ways of seeing');
  await page.getByRole('button',{name:'Sort by project name'}).click();
  await expect(page.locator('[aria-sort]')).toHaveAttribute('aria-sort','ascending');
  await expect(page.locator('#records tr').first()).toContainText('Fieldnotes');
  await page.getByRole('button',{name:'Next',exact:true}).click();
  await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Next',exact:true})).toHaveCSS('opacity','0.55');
  await expect(page.locator('#page')).toHaveText('Page 2 of 2');
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(axe.violations).toEqual([]);
  for(const width of [320,768,1440]){
   await page.setViewportSize({width,height:1000});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  }
  await page.screenshot({path:info.outputPath('patterns.png'),fullPage:true});
  if(process.platform==='linux')await expect.soft(page).toHaveScreenshot(`${design.id}-${mode}.png`,{fullPage:true,maxDiffPixelRatio:0.002});
  else info.annotations.push({type:'visual-baseline',description:'Pixel comparisons target the pinned Linux CI browsers; local task checks still run.'});
  await page.goto(`/examples/patterns.html?design=${design.id}&mode=${mode}&dir=rtl&spacing=expanded&size=200`);
  await page.setViewportSize({width:320,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  await page.getByRole('tab',{name:'Overview'}).press('ArrowLeft');
  await expect(page.getByRole('tab',{name:'Activity'})).toBeFocused();
  await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});
  await expect(page.getByRole('button',{name:'Archive project',exact:true})).toBeVisible();
  await page.screenshot({path:info.outputPath('rtl-spacing-forced-colors.png'),fullPage:true});
  await page.getByRole('button',{name:'Archive project',exact:true}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  await page.getByRole('button',{name:'Cancel',exact:true}).press('Shift+Tab');
  await expect(page.getByRole('button',{name:'Archive',exact:true})).toBeFocused();
  await page.keyboard.press('Escape');
  await page.goto(`/examples/workspace.html?design=${design.id}&mode=${mode}`);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  await page.emulateMedia({forcedColors:'none'});
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
 });
}
test('gallery defaults, supported modes and rendered hover',async({page})=>{
 await page.goto('/examples/designs.html');
 await expect(page.locator('.gallery-design').first()).toHaveAttribute('data-design',catalog.defaultDesign);
 for(const d of catalog.designs){
  const card=page.locator('#'+d.id);
  for(const mode of d.modes){
   if(d.modes.length>1)await card.getByRole('radio',{name:mode==='light'?'Light':'Dark',exact:true}).check();
   await expect(card.locator('img')).toHaveAttribute('src',`../designs/${d.id}/previews/workspace-${mode}.png`);
   await expect(card.locator('[data-preview-link]').first()).toHaveAttribute('href',`workspace.html?design=${d.id}&mode=${mode}`);
  }
 }
 const button=page.getByRole('link',{name:'Try Midnight',exact:true});await button.hover();
 const background=await button.evaluate(el=>getComputedStyle(el).backgroundColor);
 expect(background).not.toBe('rgba(0, 0, 0, 0)');
});

test('pattern selection preserves drafts, supported modes and history',async({page})=>{
 await page.goto('/examples/patterns.html');
 await expect(page.getByRole('combobox',{name:'Design',exact:true})).toHaveValue('midnight');
 await expect(page.getByRole('combobox',{name:'Mode',exact:true})).toBeDisabled();
 await page.getByLabel('Project description').fill('Preserve this draft');
 await page.getByRole('combobox',{name:'Design',exact:true}).selectOption('forest');
 await expect(page.getByRole('combobox',{name:'Mode',exact:true})).toHaveValue('light');
 await page.getByRole('combobox',{name:'Mode',exact:true}).selectOption('dark');
 await expect(page.locator('#pattern-guide')).toHaveAttribute('href','../designs/forest/.stitch/dark.DESIGN.md');
 await expect(page.locator('#pattern-workspace')).toHaveAttribute('href','workspace.html?design=forest&mode=dark');
 await page.goBack();
 await expect(page.getByRole('combobox',{name:'Mode',exact:true})).toHaveValue('light');
 await expect(page.getByLabel('Project description')).toHaveValue('Preserve this draft');
 await page.goForward();await page.reload();
 await expect(page.getByRole('combobox',{name:'Mode',exact:true})).toHaveValue('dark');
 await page.getByRole('combobox',{name:'Design',exact:true}).selectOption('invitation');
 await expect(page.getByRole('combobox',{name:'Mode',exact:true})).toBeDisabled();
 await expect(page.getByRole('combobox',{name:'Mode',exact:true})).toHaveValue('dark');
});

test('patterns leave host styles and unrelated tabs unchanged and clean up',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/tests/fixtures/pattern-host.html');
 const appearance=()=>page.locator('#host-table td,#host-dialog,#host-dialog form,#host-dialog button').evaluateAll(elements=>elements.map(el=>{
  const style=getComputedStyle(el);return [style.paddingTop,style.borderTopLeftRadius,style.backgroundColor,style.display];
 }));
 const before=await appearance();
 await page.getByRole('button',{name:'Load patterns',exact:true}).click();
 await expect(page.locator('#load-status')).toHaveText('Ready');
 expect(await appearance()).toEqual(before);
 await page.getByRole('tab',{name:'Host A',exact:true}).press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Host B',exact:true})).toBeFocused();
 await page.getByRole('tab',{name:'Owned A',exact:true}).press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Owned B',exact:true})).toHaveAttribute('aria-selected','true');
 await expect(page.getByRole('tab',{name:'Separate A',exact:true})).toHaveAttribute('aria-selected','true');
 await page.getByRole('button',{name:'Remove pattern handlers',exact:true}).click();
 await page.getByRole('tab',{name:'Owned A',exact:true}).click();
 await expect(page.getByRole('tab',{name:'Owned B',exact:true})).toHaveAttribute('aria-selected','true');
 expect(errors).toEqual([]);
});
