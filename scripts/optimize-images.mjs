import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function optimizeImage(src, dest, options = {}) {
  const fullSrc = path.join(PUBLIC_DIR, src);
  const fullDest = path.join(PUBLIC_DIR, dest);

  if (!fs.existsSync(fullSrc)) {
    console.warn(`Source file not found: ${fullSrc}`);
    return;
  }

  console.log(`Optimizing ${src} -> ${dest}...`);
  
  let pipeline = sharp(fullSrc);
  
  if (options.width) {
    pipeline = pipeline.resize(options.width);
  }

  if (dest.endsWith('.webp')) {
    pipeline = pipeline.webp({ quality: options.quality || 80 });
  }

  await pipeline.toFile(fullDest);
  
  const oldSize = fs.statSync(fullSrc).size;
  const newSize = fs.statSync(fullDest).size;
  console.log(`Done. Size: ${(oldSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024 / 1024).toFixed(2)}MB`);
}

async function main() {
  // Hero Background
  await optimizeImage('hero-bg.webp', 'hero-bg.webp', { width: 1920, quality: 75 });
  
  // Portrait
  await optimizeImage('farid-portrait.webp', 'farid-portrait.webp', { width: 800, quality: 80 });
  
  // Projects
  await optimizeImage('projects/image5.webp', 'projects/image5.webp', { width: 1200, quality: 80 });
  
  console.log('All images optimized.');
}

main().catch(console.error);
