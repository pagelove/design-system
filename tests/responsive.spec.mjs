import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import {auditResponsiveLayout} from './helpers/responsive-audit.mjs';
const catalog=JSON.parse(fs.readFileSync('designs/index.json','utf8'));
const requestedWidths=[320,375,768,1024,1280,1768];
async function ready(page){await expect(page.locator('html')).toHaveAttribute('data-ready','true');await page.evaluate(()=>document.fonts.ready);}
async function audit(page,records,state,options){const result=await page.evaluate(auditResponsiveLayout,options);records.push({state,...result});expect(result.issues,JSON.stringify({state,...result})).toEqual([]);}

for(const design of catalog.designs)for(const mode of design.modes)test(`${design.id}/${mode}: responsive groups, figures and task states`,async({page,browserName},info)=>{
  test.setTimeout(120000);
  const records=[],errors=[];page.on('pageerror',error=>errors.push(error.message));
  const values=JSON.parse(fs.readFileSync(`designs/${design.id}/exports/tokens.json`,'utf8')).resolved[mode];
  const rgb=hex=>'rgb('+hex.slice(1).match(/../g).map(c=>parseInt(c,16)).join(', ')+')';
  const url=`/examples/responsive.html?design=${design.id}&mode=${mode}`;
  await page.setViewportSize({width:375,height:1000});await page.goto(url);await ready(page);
  // Measure actual available space; scrollbar width is engine-specific.
  const offset=await page.locator('#toolbar-slice').evaluate(el=>innerWidth-el.getBoundingClientRect().width);
  const edges=[448,464,704,944].flatMap(width=>[-1,0,1].map(delta=>Math.round(width+offset+delta)));
  const widths=[...new Set([...requestedWidths,...edges])].sort((a,b)=>a-b);
  await page.locator('#view').click();
  for(const width of widths){
    await page.setViewportSize({width,height:1000});
    await audit(page,records,'populated/detail');
    const capture=browserName==='chromium'&&requestedWidths.includes(width)&&(design.id==='midnight'||[375,1024].includes(width));
    if(capture){
      await page.screenshot({path:info.outputPath(`${width}-overview.png`),fullPage:true});
      for(const id of ['toolbar','pair','bulk','metrics'])await page.locator(`#${id}-slice`).screenshot({path:info.outputPath(`${width}-${id}.png`)});
    }
    if(!requestedWidths.includes(width))continue;
    await page.locator('#more-menu summary').click();await audit(page,records,'open-menu');
    // Expanded actions take a new row instead of leaving tall empty space above fields.
    const menuGeometry=await page.evaluate(()=>({exportTop:document.querySelector('#export').getBoundingClientRect().top,searchBottom:document.querySelector('#search').getBoundingClientRect().bottom}));
    expect(menuGeometry.exportTop).toBeGreaterThanOrEqual(menuGeometry.searchBottom);
    if(capture)await page.locator('#toolbar-slice').screenshot({path:info.outputPath(`${width}-menu.png`)});
    await page.locator('#more-menu summary').click();
    await page.locator('#edit').click();await expect(page.locator('#invoice-name')).toBeFocused();
    await page.locator('#invoice-name').fill('');await page.locator('#save').click();
    await expect(page.locator('#name-error')).toBeVisible();await expect(page.locator('#invoice-name')).toBeFocused();
    await expect(page.locator('#save')).toHaveCSS('color',rgb(values['button-strong-text']));
    await audit(page,records,'edit-dialog/validation');
    if(width===375){const modalAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(modalAxe.violations).toEqual([]);await info.attach('dialog-accessibility',{body:Buffer.from(JSON.stringify(modalAxe)),contentType:'application/json'});}
    if(capture)await page.locator('#edit-dialog').screenshot({path:info.outputPath(`${width}-dialog.png`)});
    await page.keyboard.press('Shift+Tab');await expect(page.locator('#save')).toBeFocused();
    expect(await page.locator('#save').evaluate(el=>parseFloat(getComputedStyle(el).outlineWidth))).toBeGreaterThan(0);
    await page.keyboard.press('Escape');await expect(page.locator('#edit')).toBeFocused();
  }
  await page.setViewportSize({width:320,height:900});
  await page.locator('#search').fill('No matching contact');await expect(page.locator('#search-status')).toContainText('No contacts found');await audit(page,records,'empty');
  await page.locator('#search').fill('');await expect(page.locator('#search-status')).toContainText('3 contacts');
  await page.locator('#visibility').selectOption('Active contacts');await expect(page.locator('#search-status')).toContainText('2 contacts');await audit(page,records,'filtered');await page.locator('#visibility').selectOption('All contacts');
  await page.locator('#clear').click();await expect(page.locator('#move')).toBeDisabled();await audit(page,records,'selection-cleared');
  await page.locator('#select-all').check();await expect(page.locator('#move')).toBeEnabled();
  await page.locator('#album').selectOption({label:'Family photographs — autumn collection'});await audit(page,records,'long-destination');
  await page.locator('#next').focus();await page.keyboard.press('Enter');await expect(page.locator('#week')).toHaveText('9–15 Nov 2026');await audit(page,records,'next-week');
  await page.locator('#edit').click();await page.locator('#invoice-name').fill('Materials for the autumn community workshop');await page.locator('#save').click();await expect(page.locator('#invoice-title')).toHaveText('Materials for the autumn community workshop');
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(axe.violations).toEqual([]);await info.attach('accessibility',{body:Buffer.from(JSON.stringify(axe)),contentType:'application/json'});
  await page.goto(url+'&size=200&dir=rtl&spacing=expanded');await ready(page);await page.locator('#view').click();
  await audit(page,records,'200%-text/RTL/spacing',{allowLongLabels:true});
  await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});await audit(page,records,'forced-colors/reduced-motion',{allowLongLabels:true});
  if(browserName==='chromium')await page.screenshot({path:info.outputPath('320-text-rtl-forced.png'),fullPage:true});
  await page.emulateMedia({forcedColors:'none'});await page.locator('#edit').click();await audit(page,records,'200%-text/dialog',{allowLongLabels:true});
  await page.keyboard.press('Shift+Tab');await expect(page.locator('#save')).toBeFocused();await expect(page.locator('#save')).toBeInViewport({ratio:1});
  if(browserName==='chromium')await page.screenshot({path:info.outputPath('320-text-dialog.png'),fullPage:false});
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
  await info.attach('responsive-geometry',{body:Buffer.from(JSON.stringify({design:design.id,mode,requestedWidths,componentEdges:edges,records,limits:'Screenshots require separate visual inspection; text-size emulation is not actual browser zoom.'},null,2)),contentType:'application/json'});
});

test('component diagnostics catch broken controls on a page without overflow',async({page})=>{
  await page.setViewportSize({width:375,height:800});
  await page.setContent(`<style>*{box-sizing:border-box}body{font:16px/24px sans-serif;margin:16px}button{font:inherit}.ds-action{min-height:44px}.row{display:flex;align-items:start;gap:8px}</style>
    <main data-layout-container><h1>An editorial heading may naturally occupy multiple lines</h1>
    <button class="ds-action" style="width:90px"><span data-layout-short>Move to album</span></button>
    <p style="width:45px;word-break:break-all" data-layout-atomic>$98,640.50</p>
    <p style="width:55px;word-break:break-all" data-layout-words>Verification</p>
    <div class="row" data-layout-equal><button style="height:44px">Previous</button><button style="height:68px">Next</button></div>
    <div id="broken-menu" class="row" data-layout-equal><button style="height:150px">Export</button><details open><summary style="min-height:44px">More</summary><p>Menu content</p></details></div>
    <p data-layout-check style="width:40px;white-space:nowrap;overflow:hidden">Clipped essential content</p>
    <button class="ds-action" style="min-height:20px;height:20px;font-size:10px;line-height:10px">Tiny target</button></main>`);
  const result=await page.evaluate(auditResponsiveLayout);
  expect(result.issues.some(issue=>issue.code==='page-overflow')).toBe(false);
  for(const code of ['wrapped-action','split-value','word-fragment','unequal-actions','clipped-content','compressed-control'])expect(result.issues.some(issue=>issue.code===code),code).toBe(true);
  expect(result.issues.some(issue=>issue.code==='unequal-actions'&&issue.element==='#broken-menu')).toBe(true);
  expect(result.issues.some(issue=>issue.element.includes('editorial'))).toBe(false);
});
