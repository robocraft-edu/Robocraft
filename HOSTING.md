# Hosting and the security-header findings

A site audit will report these as failing on `robocraft-edu.github.io`:

| Finding | Severity |
|---|---|
| X-Content-Type-Options: nosniff | Medium |
| Clickjacking protection (X-Frame-Options / frame-ancestors) | Medium |
| Referrer-Policy header | Low |
| Permissions-Policy header | Low |
| Cross-Origin-Opener-Policy header | Low |
| Cross-Origin-Resource-Policy header | Info |
| HSTS is preload-ready | Info |
| CORS is not wide open | Medium |
| Negotiated cipher suite / HTTP→HTTPS redirect | Low / High |

**None of them can be fixed in this repository, because GitHub Pages does not let
you set HTTP response headers.** There is no setting and no file for it. Anything
you read that says otherwise is describing a different host.

Two of them are already as good as they can get:

- **HTTP→HTTPS and TLS ciphers** — GitHub serves `*.github.io` over HTTPS with
  HSTS and redirects plain HTTP itself. If an audit says otherwise it tested a
  custom domain, or followed a redirect it did not record.
- **CORS** — the finding is about GitHub's `Access-Control-Allow-Origin: *` on
  static files. That is normal for a public static site and carries no risk here,
  because nothing is behind a login and no credentials are sent. The app's own API
  (`backend/worker.js`) already answers from a fixed allowlist, never `*`.

## Fixing the rest: move the site (about 5 minutes, free)

`public/_headers` in this repo already contains every header above. GitHub Pages
ignores it; **Cloudflare Pages and Netlify read it automatically.** Moving the
site turns all of them on with no code change.

### Cloudflare Pages (recommended — you already have a Cloudflare account)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick `robocraft-edu/Robocraft`.
2. Build command `npm run build`, output directory `dist`.
3. Add an environment variable **`BASE_PATH`** = `/` (Cloudflare serves from the
   domain root, not from a `/Robocraft/` sub-path).
4. Deploy. You get `robocraft.pages.dev`.

### After moving — three things to update

1. `src/config/services.js` → add the new origin to the Worker's allowlist in
   `backend/worker.js` (`ALLOWED_ORIGINS`), then redeploy the Worker.
2. Firebase console → **Authentication → Settings → Authorised domains** → add
   the new domain, or Google sign-in will fail.
3. Replace `https://robocraft-edu.github.io/Robocraft/` with the new URL in
   `index.html` (canonical, `og:url`, `twitter:`), `public/sitemap.xml`,
   `public/robots.txt` and `public/.well-known/security.txt`.

Keep the GitHub Pages deploy running as well if you like — the APK download link
and the source repository stay where they are either way.
