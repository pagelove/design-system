import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('designs/index.json','utf8'));
for(const design of catalog.designs)for(const mode of design.modes) {
 test(`${design.id}/${mode}: original controls and selected-mode handoff`,async({page},info)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const query=`design=${design.id}&mode=${mode}`;
  await page.goto('/tests/fixtures/core-controls.html?'+query);
  const include=page.getByRole('checkbox',{name:'Include documentation and translated guidance for everyone on your team'});
  await expect(include).toBeChecked();
  await expect(page.locator('#include + span .pl-checkbox__glyph--check')).toHaveCSS('opacity','1');
  await expect(page.locator('#mixed')).toHaveJSProperty('indeterminate',true);
  await expect(page.locator('#mixed + span .pl-checkbox__glyph--dash')).toHaveCSS('opacity','1');
  await expect(page.getByRole('checkbox',{name:'Required license notices'})).toBeDisabled();
  await include.press('Space');await expect(include).not.toBeChecked();
  await include.press('Space');await expect(include).toBeChecked();
  await page.getByRole('radio',{name:'JSON',exact:true}).press('ArrowRight');
  await expect(page.getByRole('radio',{name:'CSS',exact:true})).toBeChecked();
  await page.getByRole('switch').press('Space');await expect(page.getByRole('switch')).not.toBeChecked();
  for(const [size,diameter] of Object.entries({xxs:16,xs:24,sm:32,md:40,lg:48,xl:56})) {
    await expect(page.getByRole('progressbar',{name:'Export '+size,exact:true})).toHaveAttribute('aria-valuenow','40');
    await expect(page.locator(`[data-size="${size}"] svg`)).toHaveCSS('width',diameter+'px');
    await expect(page.locator(`[data-size="${size}"] svg`)).toHaveCSS('height',diameter+'px');
  }
  await expect(page.getByRole('button',{name:'Add item — in progress'})).toBeDisabled();
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.screenshot({path:info.outputPath('core-controls.png'),fullPage:true});
  await page.setViewportSize({width:320,height:900});
  await page.goto('/tests/fixtures/core-controls.html?'+query+'&dir=rtl&size=200&spacing=expanded');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});
  await expect(page.getByRole('switch')).toHaveCSS('appearance','auto');
  await expect(page.getByRole('checkbox',{name:'Include documentation and translated guidance for everyone on your team'})).toHaveCSS('opacity','1');
  await expect(page.locator('.pl-progress-radial')).toHaveCSS('animation-name','none');
  await page.getByRole('switch').press('Space');await expect(page.getByRole('switch')).not.toBeChecked();
  await page.screenshot({path:info.outputPath('core-controls-rtl-forced.png'),fullPage:true});
  await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});
  const guide=`../designs/${design.id}/.stitch/${mode}.DESIGN.md`;
  await page.goto('/examples/catalog.html?'+query);
  await expect(page.locator('#design-guide')).toHaveAttribute('href',guide);
  await expect(page.locator('#foundation-guide')).toHaveAttribute('href',guide);
  await expect(page.locator('#include-docs + span .pl-checkbox__glyph--check')).toHaveCSS('opacity','1');
  await page.goto('/examples/workspace.html?'+query);await expect(page.locator('#guide')).toHaveAttribute('href',guide);
  await page.goto(`/designs/${design.id}/preview.html?mode=${mode}`);await expect(page.locator('#standalone-guide')).toHaveAttribute('href',`.stitch/${mode}.DESIGN.md`);
  expect(errors).toEqual([]);
 });
}

test('catalog and standalone forms clear stale acceptance and restore mode links',async({page})=>{
 for(const [url,form,field,status,modeControl,guide] of [
  ['/examples/catalog.html?design=forest&mode=light','#example-form','#email','#save-status','#theme','#design-guide'],
  ['/designs/forest/preview.html?mode=light','#preview-form','#display-name','#form-status','#standalone-mode','#standalone-guide']
 ]) {
  await page.goto(url);await page.locator(field).fill(field==='#email'?'reader@example.com':'Reader');
  await page.locator(form).getByRole('button',{name:'Preview save',exact:true}).click();
  await expect(page.locator(status)).toContainText('accepted locally');
  await page.locator(field).fill('');await expect(page.locator(status)).toContainText('not saved');
  await page.locator(form).getByRole('button',{name:'Preview save',exact:true}).click();
  await expect(page.locator(status)).not.toContainText('accepted locally');
  await page.locator(modeControl).selectOption('dark');await expect(page.locator(guide)).toHaveAttribute('href',/dark\.DESIGN\.md$/);
  await page.goBack();await expect(page.locator(guide)).toHaveAttribute('href',/light\.DESIGN\.md$/);
  await page.goForward();await page.reload();await expect(page.locator(guide)).toHaveAttribute('href',/dark\.DESIGN\.md$/);
 }
});
