import { readdir, readFile, mkdir, copyFile, writeFile, stat } from 'node:fs/promises';
import { resolve, join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, '_site');
const rawUrl = process.env.SITE_URL;
if (!rawUrl) throw new Error('Set SITE_URL to the GitHub Pages URL before building.');
const base = new URL(rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`);
if (base.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS.');

let html = await readFile(join(root, 'index.html'), 'utf8');
for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
  new Script(match[1], { filename: 'index.html inline script' });
}
const refs = new Set([...html.matchAll(/assets\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|svg|gif|avif|woff2?|mp4|webm|pdf)/g)].map(m => m[0]));
for (const [, folder, stem, count] of html.matchAll(/imageSeries\('([^']+)',\s*'([^']+)',\s*(\d+)\)/g)) {
  for (let i = 1; i <= Number(count); i++) refs.add(`assets/img/${folder}/${stem}-${String(i).padStart(2, '0')}.webp`);
}
for (const [, folder, names] of html.matchAll(/imageList\('([^']+)',\s*\[([^\]]*)\]\)/g)) {
  for (const [, name] of names.matchAll(/'([^']+)'/g)) refs.add(`assets/img/${folder}/${name}.webp`);
}
for (const asset of [...refs]) {
  if (asset.endsWith('.webp') && !asset.endsWith('-thumb.webp') && !asset.includes('/avatar/')) {
    refs.add(asset.replace(/\.webp$/, '-thumb.webp'));
  }
}
for (const asset of refs) {
  const file = resolve(root, asset);
  if (!file.startsWith(`${join(root, 'assets')}/`) && !file.startsWith(`${join(root, 'assets')}\\`)) {
    throw new Error(`Asset escapes public directory: ${asset}`);
  }
  if (!(await stat(file)).isFile()) throw new Error(`Missing asset: ${asset}`);
}
if (process.argv.includes('--check')) {
  console.log(`PASS: JavaScript syntax and ${refs.size} resource references.`);
  process.exit(0);
}

html = html.replace(/(<meta\s+(?:property="og:image"|name="twitter:image")\s+content=")([^"]+)(")/g,
  (_, before, path, after) => `${before}${new URL(path, base).href}${after}`);
html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/g, '')
  .replace(/<meta\s+property="og:url"[^>]*>\s*/g, '')
  .replace('</head>', `  <link rel="canonical" href="${base.href}">\n  <meta property="og:url" content="${base.href}">\n</head>`);

// Copy only approved public asset formats; internal notes and tools stay out of the website.
const allowed = /\.(webp|png|jpe?g|svg|gif|avif|ico|woff2?|mp4|webm|pdf)$/i;
let count = 0;
async function copyAssets(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const source = join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolic link is not allowed: ${source}`);
    if (entry.isDirectory()) { await copyAssets(source); continue; }
    if (!entry.isFile() || !allowed.test(entry.name)) continue;
    const target = join(output, relative(root, source));
    await mkdir(dirname(target), { recursive: true });
    await copyFile(source, target);
    count++;
  }
}
// Refuse an existing output directory to avoid accidentally publishing stale files.
await mkdir(output);
await copyAssets(join(root, 'assets'));
await writeFile(join(output, 'index.html'), html);
await writeFile(join(output, '.nojekyll'), '');
console.log(`PASS: JavaScript syntax; ${refs.size} resource references; ${count} public assets.`);
console.log(`Prepared GitHub Pages: ${base.href}`);
