# Build & run RoboCraft

RoboCraft is a React + Vite app, packaged for Android with **Capacitor** and
published to the web/iPhone with **GitHub Pages**. Everything builds
automatically on GitHub — no software is needed on your computer.

## Automatic builds (GitHub Actions)

Every push to `main` runs two workflows:

| Workflow | Result |
|---|---|
| **Build Android APK** | Publishes `RoboCraft.apk` to the [latest release](https://github.com/robocraft-edu/Robocraft/releases/latest) |
| **Deploy web app** | Updates https://robocraft-edu.github.io/Robocraft/ (iPhone users add it to the Home Screen) |

You can also run either one by hand: **Actions** tab → pick the workflow → **Run workflow**.

## Online services (all free)

| What | Service | Where it's configured |
|---|---|---|
| Accounts, login, password-reset emails, cloud progress | Firebase (project `robocraft-cec0f`) | `src/config/services.js` → `firebaseConfig` |
| Database security rules | Firestore | `backend/firestore.rules` (paste into Firebase console → Firestore → Rules) |
| AI (Mentor, explanations, podcast scripts, AI projects, lab helper) | Cloudflare Workers AI | `backend/worker.js` (deployed as Worker `robocraft-ai`), URL in `src/config/services.js` → `aiServerUrl` |
| Voice / podcast audio | The device's own text-to-speech | `src/lib/speech.js`, `src/lib/speechPolyfill.js` |

The values in `src/config/services.js` are public identifiers, not passwords.
If `firebaseConfig` or `aiServerUrl` is empty, the app still works in guest /
offline mode and simply hides login or AI features.

### Updating the AI server
Edit `backend/worker.js`, then in Cloudflare: **Workers & Pages → robocraft-ai →
Edit code** → paste the new file → **Deploy**. The Worker needs a **Workers AI**
binding named `AI` (Settings → Bindings).

## Building on your own computer (optional)

Needs Node.js 20+ and Android Studio.

```bash
npm install
npm run dev                 # web app at http://localhost:5173
npm run build               # web build → dist/
npx cap add android         # first time only
npx cap sync android
npx cap open android        # Android Studio → Build → Build APK(s)
```

## Notes

- The APK is a **debug** build — fine for testing and sharing. For the Play
  Store you need a signed release build with your own keystore.
- Package id: `com.robocraft.learn` (`capacitor.config.json`).
- Google sign-in works on the website/iPhone; the Android app uses email + password
  (Google blocks sign-in pop-ups inside app web views).
