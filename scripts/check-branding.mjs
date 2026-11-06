import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {XMLParser, XMLValidator} from 'fast-xml-parser';
import {loadDesigns, readJSON, sourceRoot} from './designs.mjs';
import {buildBranding, socialSVG, readMark, validateSite} from './branding.mjs';
import {createMetadata, renderHead, toNextMetadata, toNuxtHead, siteURL, validateImage} from '../components/metadata.mjs';
import {checkBrandingConsumers} from './check-branding-consumers.mjs';

export function pngSize(buffer) {
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(buffer.toString('ascii', 12, 16), 'IHDR');
  assert.equal(buffer.readUInt32BE(8), 13);
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

export function checkBranding(root = sourceRoot) {
  const {catalog, designs} = loadDesigns();
  const site = readJSON('branding/site.json'), mark = readMark(), templates = readJSON('branding/templates.json');
  const built = new Map(designs.map(d => [d.id, readJSON('designs/' + d.id + '/exports/tokens.json')]));
  const read = p => fs.readFileSync(path.join(root, p));
  const json = p => JSON.parse(read(p));
  const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: ''});
  let images = 0;
  for (const design of designs) for (const mode of Object.keys(design.modes)) {
    const prefix = 'designs/' + design.id + '/assets/social/' + mode;
    const png = read(prefix + '.png');
    assert.deepEqual(pngSize(png), [1200, 630]);
    assert.ok(png.length < 1_000_000, 'Social PNG budget');
    const source = read(prefix + '.source.svg').toString();
    assert.equal(XMLValidator.validate(source), true);
    assert.ok(source.includes('<text '), 'Editable text retained');
    const svg = read(prefix + '.svg').toString();
    assert.equal(XMLValidator.validate(svg), true);
    assert.doesNotMatch(svg, /<text\b|@font-face|font-family=/, 'Outlined SVG must not require installed fonts');
    const layout = json(prefix + '.layout.json');
    assert.equal(layout.titleLines.join('').replace(/\s/gu, ''), site.social.title.normalize('NFC').replace(/\s/gu, ''));
    assert.ok(layout.titleSize >= 48 && layout.titleLines.length <= 3);
    const manifest = json('designs/' + design.id + '/exports/manifest.json');
    assert.ok(fs.existsSync(path.resolve(root, 'designs', design.id, 'exports', manifest.socialImages[mode])));
    for (const title of ['One clear idea', 'A longer title about creating thoughtful places for people to read, make decisions and get useful work done together', 'LongUnbrokenIdentifierThatMustWrapInsteadOfEscapingTheImageBoundaryAndStillRemainReadable', 'Design & development <together>']) {
      const result = socialSVG({design, mode, values: built.get(design.id).resolved[mode], site, mark, template: templates[design.id], page: {title}});
      assert.ok(result.layout.titleLines.length <= 3);
      assert.equal(result.layout.titleLines.join('').replace(/\s/g, ''), title.replace(/\s/g, ''));
      assert.equal(XMLValidator.validate(result.svg), true, 'Escaped SVG content');
    }
    images++;
  }
  const defaultPrefix = 'designs/' + catalog.defaultDesign + '/assets/social/' + catalog.defaultMode;
  for (const suffix of ['.png', '.svg', '.source.svg']) assert.deepEqual(read('assets/social/default' + suffix), read(defaultPrefix + suffix));
  const defaultBundle = json('exports/manifest.json');
  for (const ref of Object.values(defaultBundle.socialImages)) assert.ok(fs.existsSync(path.resolve(root, 'exports', ref)));
  for (const [name, size] of [['favicon-16', 16], ['favicon-32', 32], ['favicon-48', 48], ['apple-touch-icon', 180], ['icon-192', 192], ['icon-512', 512], ['maskable-512', 512]]) assert.deepEqual(pngSize(read('assets/identity/' + name + '.png')), [size, size]);
  const ico = read('assets/identity/favicon.ico');
  assert.equal(ico.readUInt16LE(0), 0); assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 3);
  for (let i = 0; i < 3; i++) {
    const at = 6 + i * 16, size = ico[at], bytes = ico.readUInt32LE(at + 8), offset = ico.readUInt32LE(at + 12);
    assert.equal(size, [16, 32, 48][i]);
    assert.deepEqual(ico.subarray(offset, offset + bytes), read('assets/identity/favicon-' + size + '.png'));
  }
  const luminance = hex => hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
  const [high, low] = [luminance(site.icon.foreground), luminance(site.icon.background)].sort((a,b) => b-a);
  assert.ok((high + .05) / (low + .05) >= 3, 'Identity foreground/background contrast');
  const manifest = json('assets/identity/site.webmanifest');
  assert.equal(manifest.start_url, siteURL(site.url)); assert.equal(manifest.scope, siteURL(site.url));
  assert.ok(manifest.icons.some(icon => icon.purpose === 'maskable'));
  for (const icon of manifest.icons) {
    const buffer = fs.readFileSync(path.resolve(root, 'assets/identity', icon.src));
    assert.equal(pngSize(buffer).join('x'), icon.sizes);
  }
  const meta = json('assets/metadata/default.json');
  assert.equal(meta.image.url, site.social.image ? validateImage(site.social.image).url : new URL('assets/social/default.png', site.url).href);
  const tags = parser.parse('<head>' + renderHead(meta).replace(/<(meta|link)([^>]+)>/g, '<$1$2/>') + '</head>').head;
  for (const key of ['og:title', 'og:type', 'og:url', 'og:image', 'og:image:alt', ...['width','height'].filter(key => meta.image[key] !== undefined).map(key => 'og:image:' + key)]) assert.equal(tags.meta.filter(tag => tag.property === key).length, 1, key);
  assert.equal(tags.link.filter(tag => tag.rel === 'canonical').length, 1);
  const next = toNextMetadata(meta), nuxt = toNuxtHead(meta);
  assert.equal(next.openGraph.images[0].url, meta.image.url);
  assert.equal(next.twitter.images[0].alt, meta.image.alt);
  assert.equal(next.alternates.canonical, meta.url);
  assert.equal(nuxt.meta.find(tag => tag.property === 'og:image').content, meta.image.url);
  assert.equal(nuxt.link.find(tag => tag.rel === 'icon' && tag.type === 'image/svg+xml').href, meta.icons.svg);
  const escaped = createMetadata({site, page: {title: '</title><script>alert("x")</script>', description: 'A & B'}, image: meta.image});
  assert.doesNotMatch(renderHead(escaped), /<script>/);
  assert.match(renderHead(escaped), /&lt;\/title&gt;/);
  assert.throws(() => createMetadata({site, image: {...meta.image, url: 'javascript:alert(1)'}}));
  assert.throws(() => createMetadata({site, image: {...meta.image, alt: ''}}));
  for (const patch of [{mode: 'light'}, {design: 'missing'}, {image: {url: 'https://example.com/custom.png', alt: 'Custom'}, generateImage: true}, {path: '../../outside'}, {path: '//example.com/outside'}]) assert.throws(() => validateSite({...site, pages: [{slug: 'bad', path: 'bad/', title: 'Bad', description: 'Bad', generateImage: true, ...patch}]}, {...catalog, defaultDesign: 'midnight', defaultMode: 'dark'}, designs));
  assert.throws(() => socialSVG({design: designs[0], mode: designs[0].defaultMode, values: built.get(designs[0].id).resolved[designs[0].defaultMode], site, mark, template: templates[designs[0].id], page: {title: 'Unsupported 🦄 glyph'}}), /glyph|Bundled font/);
  assert.throws(() => socialSVG({design: designs[0], mode: designs[0].defaultMode, values: built.get(designs[0].id).resolved[designs[0].defaultMode], site, mark, template: templates[designs[0].id], page: {title: 'W'.repeat(180)}}), /does not fit/, 'Reject rather than clip content that exceeds the layout');
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'design-branding-check-'));
  try {
    const fixtureSite = {...site, social: {title: site.social.title, label: site.social.label}, url: 'https://example.com/product/', pages: [
      {slug: 'fallback', path: 'fallback/', title: 'Fallback page', description: 'Uses site image'},
      {slug: 'generated', path: 'generated/', title: 'Generated page', description: 'Uses Forest dark', design: 'forest', mode: 'dark', generateImage: true},
      {slug: 'custom', path: 'custom/', title: 'Custom page', description: 'Uses supplied artwork', image: {url: 'https://example.com/product/custom.png', alt: 'A custom illustration'}}
    ]};
    buildBranding({catalog, designs, built, outputRoot: scratch, site: fixtureSite, mark});
    const output = slug => JSON.parse(fs.readFileSync(path.join(scratch, 'assets/metadata', slug + '.json')));
    assert.equal(output('fallback').image.url, 'https://example.com/product/assets/social/default.png');
    assert.equal(output('generated').url, 'https://example.com/product/generated/');
    assert.equal(output('generated').image.url, 'https://example.com/product/assets/social/pages/generated.png');
    assert.equal(output('generated').icons.svg, 'https://example.com/product/assets/identity/favicon.svg');
    assert.equal(output('custom').image.url, 'https://example.com/product/custom.png');
    assert.doesNotMatch(fs.readFileSync(path.join(scratch, 'examples/branding.html'), 'utf8'), /src="\.\.\/custom.png"/, 'Custom hosted artwork is a link, not an assumed local file');
    assert.equal(output('custom').image.width, undefined, 'Do not invent custom image dimensions');
    const generatedLayout = JSON.parse(fs.readFileSync(path.join(scratch, 'assets/social/pages/generated.layout.json')));
    assert.equal(generatedLayout.design, 'forest'); assert.equal(generatedLayout.mode, 'dark');
    fs.writeFileSync(path.join(scratch, 'assets/social/keep-user-art.svg'), '<svg/>');
    buildBranding({catalog: {...catalog, defaultDesign: 'forest', defaultMode: 'dark'}, designs, built, outputRoot: scratch, site: {...fixtureSite, pages: []}, mark});
    assert.deepEqual(fs.readFileSync(path.join(scratch, 'assets/social/default.png')), read('designs/forest/assets/social/dark.png'));
    assert.deepEqual(fs.readFileSync(path.join(scratch, 'assets/identity/favicon.svg')), read('assets/identity/favicon.svg'), 'Identity independent of selected design');
    assert.equal(fs.existsSync(path.join(scratch, 'assets/metadata/generated.json')), false, 'Removed page metadata must not remain published');
    assert.equal(fs.existsSync(path.join(scratch, 'assets/social/pages/generated.png')), false, 'Removed page image must not remain published');
    assert.equal(fs.existsSync(path.join(scratch, 'assets/social/keep-user-art.svg')), true, 'Leave unrelated files alone');
  } finally {
    assert.ok(path.resolve(scratch).startsWith(path.resolve(os.tmpdir()) + path.sep + 'design-branding-check-'));
    fs.rmSync(scratch, {recursive: true, force: true});
  }
  return {result: 'pass', consumers: checkBrandingConsumers(), designModes: images, iconSizes: 7, checks: ['PNG dimensions and budgets', 'ICO payloads', 'outlined and editable SVGs', 'long-title fitting', 'public metadata fields and escaping', 'subpath URL resolution', 'default/generated/custom overrides', 'framework adapter shapes', 'invalid configuration and unsupported glyph rejection']};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(JSON.stringify(checkBranding(), null, 2));
