import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('designs/index.json','utf8'));
for(const design of catalog.designs)for(const mode of design.modes)test(`${design.id}/${mode}: every button appearance and field state`,async({page},info)=>{
 const query=`design=${design.id}&mode=${mode}`;
 await page.goto('/tests/fixtures/component-matrix.html?'+query);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 const before=await page.locator('.pl-button--lg').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
 await page.goto('/tests/fixtures/component-matrix.html?'+query+'&size=200&dir=rtl&spacing=expanded');
 await page.setViewportSize({width:320,height:900});
 expect(await page.locator('.pl-button--lg').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBe(before*2);
 await expect(page.locator('#name')).toHaveCSS('font-size','32px');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});
 await expect(page.locator('.pl-button').first()).toHaveCSS('transition-duration','0s');
 const gradient=page.locator('.pl-button--outlined-gradient:not(:disabled) .pl-button__label').first();
 await expect(gradient).not.toHaveCSS('color','rgba(0, 0, 0, 0)');
 const pairs=await page.locator('.pl-button:not(.is-skeleton)').evaluateAll(buttons=>buttons.map(button=>({
  disabled:button.disabled,foreground:getComputedStyle(button.querySelector('.pl-button__label')).color,background:getComputedStyle(button,'::after').backgroundColor
 })));
 const luminance=css=>{const c=css.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 for(const pair of pairs) {
  expect(pair.foreground).not.toEqual(pair.background);
  if(!pair.disabled){const a=luminance(pair.foreground),b=luminance(pair.background);expect((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toBeGreaterThanOrEqual(4.5);}
 }
 await page.screenshot({path:info.outputPath('component-matrix-forced.png'),fullPage:true});
});
