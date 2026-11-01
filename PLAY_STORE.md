# Publishing RoboCraft on Google Play

Everything the app needs is already in this repo. These are the steps only **you** can do
(they need your Google account, your payment and your passwords).

## 1. Google Play developer account
1. Go to <https://play.google.com/console/signup> and sign up (one-time fee of US $25).
2. Choose **Personal** account. Google will verify your identity (ID document) and, for new
   personal accounts, ask you to run a **closed test with at least 12 testers for 14 days**
   before you can publish to everyone. Ask classmates to join — the APK link works for them too.
   If you are under 18, a parent/guardian has to create and own the developer account.

## 2. Upload key (signs every update)
Run this once on any computer with Java installed (keep the file and passwords safe — you need
them for every update):

```bash
keytool -genkeypair -v -keystore robocraft-upload.jks -alias robocraft \
  -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 robocraft-upload.jks > robocraft-upload.b64   # macOS: base64 -i robocraft-upload.jks
```

Then on GitHub → repo **Settings → Secrets and variables → Actions → New repository secret**, add:

| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | contents of `robocraft-upload.b64` |
| `ANDROID_KEYSTORE_PASSWORD` | the keystore password |
| `ANDROID_KEY_ALIAS` | `robocraft` |
| `ANDROID_KEY_PASSWORD` | the key password |

The next build produces **RoboCraft-play.aab** under *Actions → latest run → Artifacts*.
Upload that file in Play Console. (The test APK will then also be signed with this key —
uninstall the old test APK once before installing the new one.)

## 3. "Continue with Google" inside the Android app (optional)
1. Firebase console → Project settings → **Add app → Android**, package name `com.robocraft.learn`.
2. Add SHA-1 fingerprints: your upload key (`keytool -list -v -keystore robocraft-upload.jks`)
   **and** the *App signing key* SHA-1 from Play Console → Setup → App signing.
3. Download `google-services.json` and commit it as `android-config/google-services.json`.
   The build switches native Google sign-in on automatically.

## 4. Firestore rules
Paste `backend/firestore.rules` into Firebase console → Firestore → Rules → **Publish**
(new: the `reports` collection used by the *Report* buttons).

## 5. Store listing (copy-paste)
- **App name:** RoboCraft – Robotics & AI (ICSE/ISC)
- **Short description (80):** Learn Robotics & AI for ICSE/ISC Class 9–11: notes, labs, 3D robots, exam prep.
- **Full description:**

```
RoboCraft is a complete Robotics & Artificial Intelligence companion for ICSE and ISC students (Classes 9, 10 and 11).

LEARN THE SYLLABUS
• Every chapter as clear textbook notes with labelled diagrams, key terms and audio
• Chapter-wise MCQs, short and long answers in the board pattern
• Full sample papers with a timer, marking scheme and PDF download
• AI answer checking: write your answer and get marks and missing points

BUILD AND CODE
• Circuit Lab – wire Arduino circuits and run your own code on a simulated board
• Robot Arena 3D – program a robot car in real Arduino C: line follower, obstacle avoider, smart dustbin, maze, PID
• 3D Design Studio – Tinkercad-style modelling with holes and groups, real robot parts, STL export for 3D printing
• Mechanism Lab – four-bar linkages, slider-crank, robot-arm kinematics and gear trains
• Python playground that runs in the app

INTERNAL ASSESSMENT
• Practical assignments in the CISCE format
• Automatic Variable Description Table
• Download a complete practical file PDF (cover, certificate, index, programs, outputs)
• Practical exam rehearsal with planning session, timer and viva questions

PRO MODE FOR CLASS 11
• Numerical practice with step-by-step solutions, engineering calculators, syllabus tracker

Works offline for most features. No ads.
```

- **Category:** Education · **Tags:** Education, Science, Coding
- **Content rating questionnaire:** Education app; no violence, no sexual content, no gambling;
  *users can interact* → answer **Yes** for "AI-generated content" and point to the in-app Report button.
- **Target audience:** 13–15, 16–17, 18+ (not under 13).
- **Privacy policy URL:** `https://robocraft-edu.github.io/Robocraft/privacy.html`
  (edit the contact email at the bottom of `public/privacy.html` first).
- **Account deletion URL** (required because the app has accounts): same privacy page, section 8,
  or Settings → Delete account inside the app.

## 6. Data safety form (answers)
| Question | Answer |
|---|---|
| Does the app collect or share user data? | Collects: Yes · Shares: No |
| Encrypted in transit? | Yes |
| Can users request deletion? | Yes (in-app Delete account + email) |
| Personal info → Email address | Collected, optional (only with an account), for *Account management* |
| Personal info → Name | Collected, optional, *Account management* |
| App activity → Other user-generated content (problem reports, AI questions) | Collected, optional, *App functionality* |
| App activity → In-app actions (progress, scores) | Collected, optional, *App functionality* |
| Location, contacts, photos, financial, health, device IDs | Not collected |

## 7. Screenshots
Phone screenshots (at least 2, ideally 6–8): Home, a chapter with diagrams, Sample paper,
Robot Arena 3D, 3D Design Studio, Practical File. Feature graphic: 1024 × 500 px.
