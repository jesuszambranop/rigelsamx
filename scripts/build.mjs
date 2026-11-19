import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import config from '../site.config.mjs';
import { renderPages } from '../src/pages.mjs';

const root = resolve(import.meta.dirname, '..');
const base = new URL(config.siteUrl.endsWith('/') ? config.siteUrl : config.siteUrl + '/');
if (base.protocol !== 'https:') throw new Error('SITE_URL debe usar HTTPS');
const pages = renderPages(config, base);
for (const [path, html] of pages) {
  const output = resolve(root, 'public', path);
  await mkdir(resolve(output, '..'), { recursive: true });
  await writeFile(output, html, 'utf8');
}
await writeFile(resolve(root, 'public/assets/config.js'), `window.RIGEL_CONFIG = Object.freeze(${JSON.stringify({email:config.email,careersEmail:config.careersEmail,phone:config.phone,whatsapp:config.whatsapp})});\n`);
const urls = pages.filter(([p]) => !/404|gracias/.test(p)).map(([path]) => `<url><loc>${new URL(path === 'index.html' ? '' : path, base).href}</loc></url>`).join('');
await writeFile(resolve(root, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
await writeFile(resolve(root, 'public/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /mx/api/\nSitemap: ${new URL('sitemap.xml', base).href}\n`);
console.log(`Generadas ${pages.length} páginas. Canonical: ${base.href}`);
