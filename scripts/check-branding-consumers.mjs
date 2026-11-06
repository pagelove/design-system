import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {Resvg} from '@resvg/resvg-js';
import {openSync} from 'fontkit';
import {readJSON, loadDesigns, sourceRoot} from './designs.mjs';
import {parseMark, iconSVG, fitText, socialSVG, buildBranding, validateSite, radiusPixels, readMark} from './branding.mjs';
import {createMetadata, siteURL} from '../components/metadata.mjs';

export function checkBrandingConsumers() {
  const {catalog, designs} = loadDesigns(), site = readJSON('branding/site.json');
  const built = new Map(designs.map(d => [d.id, readJSON(`designs/${d.id}/exports/tokens.json`)]));
  const templates = readJSON('branding/templates.json');
  const fixtureIdentity = {...site, icon: {background: '#100d17', foreground: '#f3efff'}};
  // An ordinary stroke-based source must remain an outline after import.
  const outline = parseMark(`<svg xmlns="http://www.w3.org/2000/svg" viewBox='0, 0, 64, 64' fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" role="img"><title>Outline</title><rect x="8" y="8" width="48" height="48"/></svg>`);
  const pixels = new Resvg(iconSVG(fixtureIdentity, outline)).render().pixels;
  const pixel = (x, y) => [...pixels.subarray((y * 512 + x) * 4, (y * 512 + x) * 4 + 4)];
  assert.deepEqual(pixel(256, 256), [16, 13, 23, 255], 'Center of outline remains background');
  assert.notDeepEqual(pixel(112, 256), pixel(256, 256), 'Visible stroke retained');
  const solid = parseMark('<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="currentColor"/></svg>');
  const mask = new Resvg(iconSVG(fixtureIdentity, solid, {maskable: true})).render().pixels;
  let maxRadius = 0;
  for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
    const at = (y * 512 + x) * 4;
    assert.equal(mask[at + 3], 255, 'Maskable background is opaque');
    if (mask[at] !== mask[0] || mask[at + 1] !== mask[1] || mask[at + 2] !== mask[2]) maxRadius = Math.max(maxRadius, Math.hypot(x - 255.5, y - 255.5));
  }
  assert.ok(maxRadius <= 204.8, 'A replacement full-viewBox mark fits the safe circle');
  for (const body of ['', '<g opacity="0"><rect width="64" height="64"/></g>', '<script/>', '<path style="fill:red"/>', '<use href="external.svg#mark"/>']) assert.throws(() => parseMark('<svg viewBox="0 0 64 64">' + body + '</svg>'));
  assert.equal(radiusPixels('1.5rem'), 24); assert.equal(radiusPixels('12px'), 12);
  const invitation = designs.find(d => d.id === 'invitation'), values = built.get('invitation').resolved.dark;
  const input = {design: invitation, mode: 'dark', values: {...values, 'design-radius-card': '1.5rem'}, site, mark: readMark(), template: templates.invitation};
  assert.match(socialSVG(input).svg, /rx="24"/);
  for (const template of [{...templates.invitation, titleSize: 1e20}, {...templates.invitation, titleSize: 0}, {...templates.invitation, titleWeight: 999}, {...templates.invitation, unknown: true}]) assert.throws(() => socialSVG({...input, template}), /Invalid social template/);
  const font = openSync(path.join(sourceRoot, 'assets/fonts/inter-400.ttf'));
  const text = 'A precise fit', widthAt48 = font.layout(text).advanceWidth * 48 / font.unitsPerEm;
  assert.equal(fitText(text, font, {size: 49, minSize: 48, maxWidth: widthAt48 + .001, maxLines: 1}).size, 48, 'Odd starting sizes still try the minimum');
  assert.throws(() => fitText(text, font, {size: Infinity, minSize: 48, maxWidth: 1008, maxLines: 3}));
  const image = {url: 'https://example.com/custom.png', alt: 'Custom art'};
  for (const invalidPath of ['https://elsewhere.example/', '//elsewhere.example/', '../outside', 'x\\..\\outside', 'path/#section', '\npath/']) assert.throws(() => createMetadata({site: {...site, url: 'https://example.com/app/'}, page: {path: invalidPath}, image}));
  assert.throws(() => createMetadata({site, image: {...image, url: 'https://example.com/image.png#crop'}}));
  const basicPage = {slug: 'page', path: 'page/', title: 'Page', description: 'Page description'};
  for (const slug of ['con', 'nul', 'com1', 'lpt9', 'default']) assert.throws(() => validateSite({...site, pages: [{...basicPage, slug}]}, catalog, designs), /Reserved/);
  assert.throws(() => validateSite({...site, pages: [basicPage, {...basicPage, slug: 'duplicate', path: './page/'}]}, catalog, designs), /Duplicate page URL/);

  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'identity-consumer-check-'));
  const read = p => JSON.parse(fs.readFileSync(path.join(scratch, p)));
  const hashes = () => {
    const walk = dir => fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
    return Object.fromEntries(walk(scratch).sort().map(file => [path.relative(scratch, file), crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
  };
  try {
    const customSite = {...site, url: 'https://EXAMPLE.com:443/product/', social: {...site.social, image}, pages: [
      {...basicPage, slug: 'fallback'},
      {...basicPage, slug: 'generated', path: 'generated/', generateImage: true, design: 'forest'},
      {...basicPage, slug: 'custom', path: 'custom/', image: {...image, url: 'https://example.com/another.png'}}
    ]};
    buildBranding({catalog, designs, built, outputRoot: scratch, site: customSite});
    assert.equal(read('assets/metadata/default.json').image.url, image.url);
    assert.equal(read('assets/metadata/fallback.json').image.url, image.url);
    assert.equal(read('assets/metadata/generated.json').image.url, 'https://example.com/product/assets/social/pages/generated.png');
    assert.equal(read('assets/social/pages/generated.layout.json').mode, 'light', 'Explicit Forest uses its default mode');
    assert.equal(read('assets/metadata/custom.json').image.url, 'https://example.com/another.png');
    assert.equal(read('assets/identity/site.webmanifest').start_url, siteURL(customSite.url));
    const preview = fs.readFileSync(path.join(scratch, 'examples/branding.html'), 'utf8');
    assert.match(preview, /src="\.\.\/assets\/social\/pages\/generated.png"/);
    assert.match(preview, /href="https:\/\/example.com\/custom.png"/);
    const before = hashes();
    assert.throws(() => buildBranding({catalog, designs, built, outputRoot: scratch, site: {...customSite, name: 'Changed identity', pages: [{...basicPage, generateImage: true, title: 'Unsupported 🦄'}]}}), /glyph|Bundled font/);
    assert.deepEqual(hashes(), before, 'Render failure leaves every previous asset and index unchanged');
    const index = read('assets/social/index.json');
    fs.writeFileSync(path.join(scratch, 'assets/social/index.json'), JSON.stringify({...index, generatedFiles: [...index.generatedFiles, '../../outside.png']}));
    const malformedBefore = hashes();
    assert.throws(() => buildBranding({catalog, designs, built, outputRoot: scratch}), /Invalid generated/);
    assert.deepEqual(hashes(), malformedBefore, 'Invalid cleanup record fails before replacing outputs');
  } finally {
    assert.ok(path.resolve(scratch).startsWith(path.resolve(os.tmpdir()) + path.sep + 'identity-consumer-check-'));
    fs.rmSync(scratch, {recursive: true, force: true});
  }
  return {result: 'pass', checks: ['replacement SVG presentation attributes', 'full-viewBox maskable padding', 'empty and unsupported artwork rejection', 'rem frame geometry', 'bounded template and text fitting inputs', 'shared canonical URL rules and duplicate routes', 'portable output filenames', 'custom site image precedence', 'normalized public URL and preview links', 'failed-render and cleanup preflight preserve outputs']};
}
