import '@/lib/speechPolyfill' // must load first: gives the Android app a speech engine
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { ThemeProvider } from '@/lib/ThemeContext'
import { installAndroidBackButton } from '@/lib/androidBack'

// A deploy renames every code-split chunk and GitHub Pages drops the old files,
// so a tab opened before the deploy asks for a file that no longer exists.
// Reload once (guarded, so a genuinely missing chunk can't loop) to pick up the
// new build. Covers both Vite's own event and a bare dynamic-import rejection.
let reloadedForChunk = false;
function reloadForStaleChunk() {
  if (reloadedForChunk) return false;
  try {
    if (sessionStorage.getItem('rc_chunk_reload')) return false;
    sessionStorage.setItem('rc_chunk_reload', '1');
  } catch { /* private mode: fall through and reload once per page life */ }
  reloadedForChunk = true;
  window.location.reload();
  return true;
}
// Once the app is running, clear the guard so a later deploy can reload again.
window.addEventListener('load', () => {
  setTimeout(() => { try { sessionStorage.removeItem('rc_chunk_reload'); } catch { /* ignore */ } }, 5000);
});
window.addEventListener('vite:preloadError', (e) => { e.preventDefault(); reloadForStaleChunk(); });
window.addEventListener('unhandledrejection', (e) => {
  if (/dynamically imported module|Importing a module script failed|module script|MIME type|Unable to preload|Loading (CSS )?chunk/i.test(String(e?.reason?.message || ''))) {
    e.preventDefault();
    reloadForStaleChunk();
  }
});
window.__rcReloadForStaleChunk = reloadForStaleChunk;

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)

// Offline support for the web/iPhone version (not needed inside the Android app)
if ('serviceWorker' in navigator && import.meta.env.PROD && !window.Capacitor?.isNativePlatform?.()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js?v=' + (import.meta.env.VITE_APP_VERSION || '1')).catch(() => {});
  });
}

// Android hardware Back: walk the app's history instead of closing the app.
installAndroidBackButton();
