import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('designs/index.json','utf8'));
for(const design of catalog.designs)for(const mode of design.modes){
 test(`${design.id}/${mode}: patterns, accessibility and responsive states`,async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/examples/patterns.html?design=${design.id}&mode=${mode}`);
  await expect(page.getByRole('tab',{name:'Overview'})).toBeVisible();
  await page.getByRole('tab',{name:'Overview'}).press('ArrowRight');
  await expect(page.getByRole('tab',{name:'Activity'})).toBeFocused();
  await expect(page.getByRole('tab',{name:'Activity'})).toHaveAttribute('aria-selected','true');
  await page.getByRole('button',{name:'Archive project',exact:true}).click();
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
  await page.getByRole('button',{name:'Next',exact:true}).click();
  await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Next',exact:true})).toHaveCSS('opacity','0.55');
  await expect(page.locator('#page')).toHaveText('Page 2 of 2');
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(axe.violations).toEqual([]);
  for(const width of [320,768,1440]){
   await page.setViewportSize({width,height:1000});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.screenshot({path:info.outputPath('patterns.png'),fullPage:true});
  if(process.platform==='linux')await expect(page).toHaveScreenshot(`${design.id}-${mode}.png`,{fullPage:true,maxDiffPixelRatio:0.002});
  else info.annotations.push({type:'visual-baseline',description:'Pixel comparisons target the pinned Linux CI browsers; local task checks still run.'});
  await page.goto(`/examples/patterns.html?design=${design.id}&mode=${mode}&dir=rtl&spacing=expanded&size=200`);
  await page.setViewportSize({width:320,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('tab',{name:'Overview'}).press('ArrowLeft');
  await expect(page.getByRole('tab',{name:'Activity'})).toBeFocused();
  await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});
  await expect(page.getByRole('button',{name:'Archive project',exact:true})).toBeVisible();
  await page.screenshot({path:info.outputPath('rtl-spacing-forced-colors.png'),fullPage:true});
  await page.goto(`/examples/workspace.html?design=${design.id}&mode=${mode}`);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
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
