import {readdir, readFile, stat} from 'node:fs/promises';
import {resolve, dirname, extname} from 'node:path';
const root = resolve(import.meta.dirname,'../public');
const files = [];
async function walk(path) {for (const d of await readdir(path,{withFileTypes:true})) {const p = resolve(path,d.name);if(d.isDirectory()) await walk(p); else files.push(p);}}
await walk(root);
const errors = [];
let links = 0;
for (const file of files.filter(p=>extname(p)==='.html')) {
  const html = await readFile(file,'utf8');
  for (const required of ['<h1','<main','<title>','rel="canonical"','hreflang="en"','hreflang="es-MX"']) if (!html.includes(required)) errors.push(`${file}: falta ${required}`);
  if (/<main[^>]*>\s*<\/main>/.test(html)) errors.push(`${file}: contenido principal vacío`);
  if (/\b(RG1|RCN1|SK10)\b/i.test(html)) errors.push(`${file}: producto fuera de catálogo`);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for (const m of html.matchAll(/(?:href|src|action)="([^"]+)"/g)) {
    const url = m[1].replaceAll('&amp;','&');
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    if (url.startsWith('#')) {if (!ids.has(url.slice(1))) errors.push(`${file}: ancla sin destino ${url}`);continue;}
    const target = resolve(dirname(file),decodeURIComponent(url.split(/[?#]/)[0]));
    if (!target.startsWith(root)) {errors.push(`${file}: ruta fuera de public ${url}`);continue;}
    try {if (!(await stat(target)).isFile()) errors.push(`${file}: no es archivo ${url}`);} catch {errors.push(`${file}: enlace roto ${url}`);}
    links++;
  }
  for (const m of html.matchAll(/<img\b([^>]+)>/g)) if (!/\balt="/.test(m[1])) errors.push(`${file}: imagen sin alt`);
}
for (const js of ['app.js','config.js','carousels.js']) new Function(await readFile(resolve(root,'assets',js),'utf8'));
if (errors.length) {console.error(errors.join('\n'));process.exitCode = 1;} else console.log(`OK: ${files.filter(p=>p.endsWith('.html')).length} páginas, ${links} rutas locales y JavaScript revisados.`);
