// Framework-neutral head metadata. No runtime dependencies or network requests.
export const escapeAttribute = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function webURL(value, base) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f\u007f]/.test(value)) throw new Error('Expected a nonempty URL without control characters');
  const url = new URL(value, base);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Expected an HTTP(S) URL without credentials');
  return url.href;
}

export function siteURL(value) {
  const base = webURL(value), url = new URL(base);
  if (!url.pathname.endsWith('/') || url.search || url.hash) throw new Error('Site URL must end in / with no query or fragment');
  return base;
}

export function pageURL(value, base) {
  if (value === undefined || value === '') return siteURL(base);
  if (typeof value === 'string' && !/[\u0000-\u001f\u007f]/.test(value)) value = value.trim();
  if (typeof value !== 'string' || !value.trim() || /^(?:[a-z][a-z\d+.-]*:|\/|\\)/i.test(value) || value.includes('\\') || /(?:^|\/)\.\.(?:\/|$)/.test(value)) throw new Error('Page paths must be relative to the site base');
  const root = new URL(siteURL(base)), url = new URL(webURL(value, root));
  if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname) || url.hash) throw new Error('Page URL must remain in the site base, without a fragment');
  return url.href;
}

export function validateImage(image) {
  if (!image || typeof image.alt !== 'string' || !image.alt.trim()) throw new Error('A social image needs descriptive alt text');
  const url = webURL(image.url);
  if (new URL(url).hash) throw new Error('Social image URL must not contain a fragment');
  for (const key of ['width', 'height']) if (image[key] !== undefined && (!Number.isInteger(image[key]) || image[key] < 1)) throw new Error('Invalid image ' + key);
  if (image.type !== undefined && !['image/png', 'image/jpeg', 'image/webp'].includes(image.type)) throw new Error('Unsupported social image MIME type');
  return {...image, url};
}

export function createMetadata({site, page = {}, image}) {
  const base = siteURL(site.url);
  const result = {
    title: page.title || site.social.title,
    description: page.description || site.description,
    siteName: site.name,
    locale: site.locale,
    url: pageURL(page.path, base),
    themeColor: site.icon.background,
    image: validateImage(image),
    icons: {
      svg: webURL('assets/identity/favicon.svg', base),
      ico: webURL('assets/identity/favicon.ico', base),
      apple: webURL('assets/identity/apple-touch-icon.png', base)
    },
    manifest: webURL('assets/identity/site.webmanifest', base)
  };
  if (!result.title?.trim() || !result.description?.trim()) throw new Error('Title and description are required');
  return result;
}

export function headElements(meta) {
  const rows = [
    ['meta', {name: 'description', content: meta.description}],
    ['link', {rel: 'canonical', href: meta.url}],
    ['link', {rel: 'icon', href: meta.icons.ico, sizes: '16x16 32x32 48x48'}],
    ['link', {rel: 'icon', href: meta.icons.svg, type: 'image/svg+xml', sizes: 'any'}],
    ['link', {rel: 'apple-touch-icon', href: meta.icons.apple, sizes: '180x180'}],
    ['link', {rel: 'manifest', href: meta.manifest}],
    ['meta', {name: 'theme-color', content: meta.themeColor}],
    ...Object.entries({type: 'website', title: meta.title, description: meta.description, url: meta.url, site_name: meta.siteName, locale: meta.locale, image: meta.image.url, 'image:secure_url': meta.image.url.startsWith('https:') ? meta.image.url : undefined, 'image:type': meta.image.type, 'image:width': meta.image.width, 'image:height': meta.image.height, 'image:alt': meta.image.alt}).filter(([,v]) => v !== undefined).map(([key, content]) => ['meta', {property: 'og:' + key, content}]),
    ...Object.entries({card: 'summary_large_image', title: meta.title, description: meta.description, image: meta.image.url, 'image:alt': meta.image.alt}).map(([key, content]) => ['meta', {name: 'twitter:' + key, content}])
  ];
  return rows;
}

export function renderHead(meta) {
  return '<title>' + escapeAttribute(meta.title) + '</title>\n' + headElements(meta).map(([tag, attrs]) => '<' + tag + ' ' + Object.entries(attrs).map(([k,v]) => k + '="' + escapeAttribute(v) + '"').join(' ') + '>').join('\n');
}

// Copy these adapters into the consuming app; run its own framework build.
export function toNextMetadata(meta) {
  return {title: meta.title, description: meta.description, alternates: {canonical: meta.url}, icons: {icon: [{url: meta.icons.ico, sizes: '16x16 32x32 48x48'}, {url: meta.icons.svg, type: 'image/svg+xml', sizes: 'any'}], apple: [{url: meta.icons.apple, sizes: '180x180'}]}, manifest: meta.manifest, openGraph: {type: 'website', title: meta.title, description: meta.description, url: meta.url, siteName: meta.siteName, locale: meta.locale, images: [{...meta.image}]}, twitter: {card: 'summary_large_image', title: meta.title, description: meta.description, images: [{url: meta.image.url, alt: meta.image.alt}]}};
}

export function toNuxtHead(meta) {
  const rows = headElements(meta);
  return {title: meta.title, meta: rows.filter(([tag]) => tag === 'meta').map(([,attrs]) => attrs), link: rows.filter(([tag]) => tag === 'link').map(([,attrs]) => attrs)};
}
