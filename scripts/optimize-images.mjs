import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = join(__dirname, '../public/images');
const BACKUP_DIR = join(__dirname, '../public/images/_originals_backup');

const QUALITY = {
  jpg: 82,
  webp: 80,
};

const MAX_WIDTH = 1920;

let totalOriginal = 0;
let totalOptimized = 0;
let count = 0;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('_')) continue; // skip backup folders
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath)));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const s = await stat(filePath);
  const originalSize = s.size;
  totalOriginal += originalSize;

  const ext = extname(filePath).toLowerCase();
  const isJpg = ext === '.jpg' || ext === '.jpeg';

  try {
    const img = sharp(filePath);
    const meta = await img.metadata();

    const pipeline = img.resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });

    let optimized;
    if (isJpg) {
      optimized = await pipeline.jpeg({ quality: QUALITY.jpg, mozjpeg: true }).toBuffer();
    } else {
      // PNG
      optimized = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
    }

    const newSize = optimized.length;

    if (newSize < originalSize) {
      await import('fs').then(fs => fs.promises.writeFile(filePath, optimized));
      totalOptimized += newSize;
      const saved = ((1 - newSize / originalSize) * 100).toFixed(1);
      console.log(`✓ ${relative(INPUT_DIR, filePath)} — ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (-${saved}%)`);
    } else {
      totalOptimized += originalSize;
      console.log(`= ${relative(INPUT_DIR, filePath)} — already optimal`);
    }
    count++;
  } catch (err) {
    console.error(`✗ ${filePath}: ${err.message}`);
    totalOptimized += originalSize;
  }
}

const files = await getFiles(INPUT_DIR);
console.log(`\nOptimizing ${files.length} images...\n`);

// process in batches of 8 to avoid memory issues
for (let i = 0; i < files.length; i += 8) {
  await Promise.all(files.slice(i, i + 8).map(optimizeImage));
}

const savedMB = ((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(1);
const savedPct = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
console.log(`\nDone! ${count} images processed`);
console.log(`Total: ${(totalOriginal/1024/1024).toFixed(1)}MB → ${(totalOptimized/1024/1024).toFixed(1)}MB`);
console.log(`Saved: ${savedMB}MB (${savedPct}%)`);
