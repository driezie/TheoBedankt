import { build } from 'esbuild';

await build({
  entryPoints: ['analytics.js'],
  bundle: true,
  outfile: 'analytics.bundle.js',
  format: 'iife',
  platform: 'browser',
});

