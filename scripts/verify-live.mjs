import { readdir, readFile } from 'node:fs/promises';
import { resolve, join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = new URL(process.env.SITE_URL || 'https://jumpsonson.github.io/');
const response = await fetch(site, { signal: AbortSignal.timeout(30000) });
if (!response.ok) throw new Error(`Homepage HTTP ${response.status}`);
const live = (await response.text()).replace(/\r\n/g, '\n');
const local = (await readFile(join(root, 'index.html'), 'utf8')).replace(/\r\n/g, '\n');
if (live !== local) throw new Error('Live homepage differs from local index.html. Check deployment and cache.');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && /\.(webp|png|jpe?g|svg|gif|avif|ico|woff2?|mp4|webm|pdf)$/i.test(entry.name)) files.push(path);
  }
}
await walk(join(root, 'assets'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
let next = 0;
const errors = [];
async function worker() {
  while (next < files.length) {
    const file = files[next++];
    const path = relative(root, file).replaceAll('\\', '/');
    try {
      const res = await fetch(new URL(path, site), { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (digest(Buffer.from(await res.arrayBuffer())) !== digest(await readFile(file))) throw new Error('SHA-256 mismatch');
    } catch (error) { errors.push(`${path}: ${error.message}`); }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
if (errors.length) throw new Error(errors.join('\n'));
console.log(`PASS: HTTPS homepage matches local source; all ${files.length} public assets match SHA-256.`);
console.log(`Verified ${site.href}`);
