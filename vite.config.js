import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // '/' for the Android app; '/Robocraft/' when published on GitHub Pages
    base: process.env.BASE_PATH || '/',
    plugins: [react()],
    // VITE_BUILD_ID changes on every build, so each release installs a fresh offline
    // cache and phones pick up new icons, photos and pages, not only new code.
    define: { 'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version), 'import.meta.env.VITE_BUILD_ID': JSON.stringify(`${pkg.version}-${Date.now().toString(36)}`) },
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    // No hand-written manualChunks here. Splitting these bundles by hand put
    // a chunk that uses React ahead of React itself once already; Rollup's own
    // splitting is correct by construction, and the heavy libraries (Firebase,
    // jsPDF, three) are already loaded on demand where they are used.
    build: { chunkSizeWarningLimit: 1200 },
    server: env.VITE_API_URL
      ? { proxy: { '/api': { target: env.VITE_API_URL, changeOrigin: true } } }
      : undefined,
  }
})
