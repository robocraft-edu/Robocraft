// Separate build for the owner-only admin app. Output goes to dist-admin/.
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: '/Robocraft/admin/',
  build: { outDir: fileURLToPath(new URL('../dist-admin', import.meta.url)), emptyOutDir: true },
  server: { port: 5174 },
});
