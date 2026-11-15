import { lazy } from 'react';

// Like React.lazy, but a screen that fails to download (weak mobile signal,
// a server hiccup) is tried again twice before giving up.
export default function lazyRetry(load) {
  return lazy(() => {
    const attempt = (n) => load().catch((err) => {
      if (n <= 0 || (typeof navigator !== 'undefined' && navigator.onLine === false)) throw err;
      return new Promise((r) => setTimeout(r, 600 * (3 - n))).then(() => attempt(n - 1));
    });
    return attempt(2);
  });
}
