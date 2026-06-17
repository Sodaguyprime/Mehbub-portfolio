// One-off image optimizer for the portfolio.
// Resizes any image wider than MAX_WIDTH and re-encodes JPEG at QUALITY,
// overwriting the originals in ./images. A copy of every original is saved
// to ./images-backup first (gitignored) so this is reversible locally too.
//
// Run from the repo root:  node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, mkdir, copyFile, stat } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';

const SRC = 'images';
const BACKUP = 'images-backup';
const MAX_WIDTH = 1400;     // plenty for full-screen lightbox viewing
const QUALITY = 80;         // visually lossless for photos/designs

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(e.name)) files.push(full);
  }
  return files;
}

const fmt = (b) => (b / 1024).toFixed(0) + ' KB';

const files = await walk(SRC);
let before = 0, after = 0;

for (const file of files) {
  const rel = relative(SRC, file);
  const backupPath = join(BACKUP, rel);
  await mkdir(dirname(backupPath), { recursive: true });
  await copyFile(file, backupPath);

  const startSize = (await stat(file)).size;
  before += startSize;

  const img = sharp(backupPath, { failOn: 'none' });
  const meta = await img.metadata();
  const pipeline = meta.width > MAX_WIDTH ? img.resize({ width: MAX_WIDTH }) : img;
  const buf = await pipeline
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();

  // write re-encoded bytes back over the original path (keeps the .jpg/.jpeg name)
  await sharp(buf).toFile(file);
  const endSize = (await stat(file)).size;
  after += endSize;

  console.log(`${rel}: ${fmt(startSize)} -> ${fmt(endSize)}`);
}

console.log('\n=== DONE ===');
console.log(`Total: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
console.log(`Saved ${(100 * (1 - after / before)).toFixed(0)}%`);
console.log('Originals backed up in ./images-backup (gitignored).');
