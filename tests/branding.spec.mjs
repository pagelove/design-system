import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import {loadDesigns, readJSON} from '../scripts/designs.mjs';
import {socialSVG, readMark} from '../scripts/branding.mjs';
const {catalog, designs} = loadDesigns();
const site = readJSON('branding/site.json'), templates = readJSON('branding/templates.json');

for (const design of designs) for (const mode of Object.keys(design.modes)) test(`${design.id}/${mode}: social image decoding and text bounds`, async ({page}, info) => {
  const prefix = '/designs/' + design.id + '/assets/social/' + mode;
  await page.goto('/examples/branding.html');
  const dimensions = await page.evaluate(async prefix => {
    const rows = [];
    for (const suffix of ['.png', '.svg']) {
      const image = new Image(); image.src = prefix + suffix; await image.decode();
      rows.push([image.naturalWidth, image.naturalHeight]);
    }
    return rows;
  }, prefix);
  expect(dimensions).toEqual([[1200, 630], [1200, 630]]);
  await page.goto(prefix + '.svg');
  const checkBounds = async () => page.locator('g[aria-label]').evaluateAll(groups => groups.map(group => {const b = group.getBBox(); return {label: group.getAttribute('aria-label'), x: b.x, y: b.y, right: b.x + b.width, bottom: b.y + b.height};}));
  for (const bounds of await checkBounds()) {
    expect(bounds.x, bounds.label).toBeGreaterThanOrEqual(64);
    expect(bounds.right, bounds.label).toBeLessThanOrEqual(1136);
    expect(bounds.y, bounds.label).toBeGreaterThanOrEqual(64);
    expect(bounds.bottom, bounds.label).toBeLessThanOrEqual(566);
  }
  await page.setViewportSize({width: 1200, height: 630});
  await page.screenshot({path: info.outputPath('social.png')});
  const values = readJSON(`designs/${design.id}/exports/tokens.json`).resolved[mode];
  const stress = socialSVG({design, mode, values, site, mark: readMark(), template: templates[design.id], page: {title: 'A longer title about creating thoughtful places for people to read, make decisions and get useful work done together', description: 'Practical guidance that gives every project a clear direction, useful structure and enough room for the details that matter.'}});
  await page.goto('/examples/branding.html');
  await page.setContent('<!doctype html><html><head><style>html,body{margin:0}</style></head><body>' + stress.svg + '</body></html>');
  const bounds = await checkBounds();
  for (const b of bounds) {expect(b.x, b.label).toBeGreaterThanOrEqual(64); expect(b.right, b.label).toBeLessThanOrEqual(1136); expect(b.bottom, b.label).toBeLessThanOrEqual(566);}
  const titleBounds = bounds.slice(2, 2 + stress.layout.titleLines.length);
  expect(Math.max(...titleBounds.map(b => b.bottom))).toBeLessThan(470);
  await page.screenshot({path: info.outputPath('long-title.png')});
});

test('identity preview: small icons, maskable safe area, accessibility and reflow', async ({page}, info) => {
  await page.goto('/examples/branding.html');
  await page.evaluate(() => document.fonts.ready);
  const errors = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(errors.violations).toEqual([]);
  const pixels = await page.evaluate(async () => {
    const image = new Image(); image.src = '/assets/identity/maskable-512.png'; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    const {data} = ctx.getImageData(0, 0, 512, 512);
    let opaque = true, maxRadius = 0, foreground = 0;
    for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
      const at = (y * 512 + x) * 4;
      if (data[at + 3] !== 255) opaque = false;
      if (Math.abs(data[at] - data[0]) + Math.abs(data[at + 1] - data[1]) + Math.abs(data[at + 2] - data[2]) > 24) {foreground++; maxRadius = Math.max(maxRadius, Math.hypot(x - 255.5, y - 255.5));}
    }
    return {opaque, maxRadius, foreground};
  });
  expect(pixels.opaque).toBe(true); expect(pixels.foreground).toBeGreaterThan(100); expect(pixels.maxRadius).toBeLessThanOrEqual(204.8);
  for (const src of ['favicon-16.png', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png', 'favicon.ico']) {
    const dimensions = await page.evaluate(async src => {const img = new Image(); img.src = '/assets/identity/' + src; await img.decode(); return [img.naturalWidth, img.naturalHeight];}, src);
    expect(dimensions[0]).toBeGreaterThan(0); expect(dimensions[0]).toBe(dimensions[1]);
  }
  await page.setViewportSize({width: 1280, height: 900});
  await page.screenshot({path: info.outputPath('asset-preview.png'), fullPage: true});
  await page.setViewportSize({width: 320, height: 740});
  await page.emulateMedia({reducedMotion: 'reduce'});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({path: info.outputPath('asset-preview-mobile.png'), fullPage: true});
});

test('metadata: emitted local assets are reachable with correct types', async ({request}) => {
  const index = readJSON('assets/social/index.json');
  for (const file of index.pages) {
    const meta = readJSON(file);
    const urls = [meta.image.url, ...Object.values(meta.icons), meta.manifest];
    for (const url of urls) {
      if (url === meta.image.url && site.pages.some(page => page.image?.url === url)) continue;
      if (!url.startsWith(site.url)) continue;
      const local = '/' + url.slice(site.url.length);
      const response = await request.get(local);
      expect(response.status(), local).toBe(200);
      const extension = local.split('.').pop();
      expect(response.headers()['content-type']).toContain({png: 'image/png', ico: 'image/x-icon', svg: 'image/svg+xml', webmanifest: 'application/manifest+json'}[extension]);
    }
    const head = fs.readFileSync(file.replace('.json', '.head.html'), 'utf8');
    expect(head).toContain('property="og:image"');
    expect(head).toContain('name="twitter:card" content="summary_large_image"');
  }
  expect(index.defaultDesign).toBe(catalog.defaultDesign);
});
