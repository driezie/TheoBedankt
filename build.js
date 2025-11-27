import { build } from 'esbuild';
import { mkdir, copyFile, readdir, stat } from 'fs/promises';
import { join } from 'path';

// Build analytics bundle
await build({
  entryPoints: ['analytics.js'],
  bundle: true,
  outfile: 'public/analytics.bundle.js',
  format: 'iife',
  platform: 'browser',
});

// Create public directory if it doesn't exist
try {
  await mkdir('public', { recursive: true });
} catch (err) {
  // Directory might already exist
}

// Copy all necessary files to public directory
const filesToCopy = [
  'index.html',
  'script.js',
  'styles.css',
  'banner.jpg',
  'shuffle.svg'
];

for (const file of filesToCopy) {
  try {
    await copyFile(file, join('public', file));
  } catch (err) {
    console.error(`Error copying ${file}:`, err);
  }
}

// Copy songs directory
async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

try {
  await copyDir('songs', 'public/songs');
} catch (err) {
  console.error('Error copying songs directory:', err);
}

