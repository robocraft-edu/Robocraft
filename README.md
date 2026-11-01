# RoboCraft

**Learn Robotics. Build Robots. Control Them.**

## 📲 Get the app

| | |
|---|---|
| **🤖 Android** | [**⬇️ Download RoboCraft.apk**](https://github.com/robocraft-edu/Robocraft/releases/latest/download/RoboCraft.apk) |
| **🍎 iPhone / iPad** | [**▶️ Open RoboCraft**](https://robocraft-edu.github.io/Robocraft/) then add it to your Home Screen |
| **💻 Laptop / any browser** | [**▶️ Open RoboCraft**](https://robocraft-edu.github.io/Robocraft/) |

### Android: install
1. Tap **Download RoboCraft.apk** and open the downloaded file.
2. If asked, allow **Install unknown apps** for your browser, then tap **Install**.
3. If Play Protect warns you, tap **More details → Install anyway**.

### iPhone: install
1. Open the link in **Safari**.
2. Tap the **Share** button (square with an arrow ⬆️, in the bottom bar — on iOS 26 tap **•••** first).
3. Tap **Add to Home Screen → Add**. RoboCraft appears on your home screen and works offline.

---

A robotics learning app for Class 9–11 students: lessons, quizzes, flashcards,
a virtual circuit lab, Arduino/ESP32 projects, revision PDFs and an AI mentor.

Built with React, Vite and Tailwind CSS, packaged for Android with Capacitor.

## Features

- 105 chapters for Classes 9–11 covering the CISCE syllabus (ICSE IX–X Robotics & AI, ISC XI Robotics)
- Full textbook notes in every chapter with 71 labelled diagrams, key terms and a Diagram Bank
- Exam Corner (525 board-style questions with model answers) and timed sample papers with PDF answer keys
- Quizzes, flashcards, games, revision mode and chapter-notes PDFs
- Story map, reward shop, weekly leaderboard, daily reminders and in-app Python practice
- 22 build projects with wiring tables, Arduino/ESP32 code, build sheets and ₹ part-by-part cost estimates
- **Circuit Lab** — wire an Arduino circuit, then edit the sketch and run *your* code on the simulated board
- **Robot Arena 3D** — a real Arduino C interpreter drives a robot car in a three.js arena: line follower,
  obstacle avoider, edge detector, smart waste bin, maze game and PID tuning (syllabus lab experiments)
- **3D Design Studio** — Tinkercad-style solid modelling (shapes, holes, group, mirror, align, snap),
  real robot parts in true millimetre sizes, STL export for 3-D printing and guided design projects
- **Mechanism Lab** — four-bar linkages with Grashof classification, slider-crank, 2R arm forward/inverse
  kinematics, gear trains and Grübler degrees of freedom
- **Internal assessment** — CISCE-format assignment bank, automatic Variable Description Table,
  printable practical file (cover, certificate, index, programs, outputs) and a practical-exam rehearsal
- AI answer marking out of the paper's marks, plus an offline keyword check
- Exam-season mode (countdown + daily plan) and daily spaced repetition
- Accounts with cloud-saved progress (or guest mode, saved on the device)
- AI: RoboMentor chat, "explain simpler", AI podcast, AI project creator, lab helper — with study-only safety rules
- A Report button on every chapter and every AI reply
- Works offline for lessons, quizzes, both labs, the 3-D studio and the arena

## How it runs (all free)

- **Accounts & cloud progress:** Firebase · **AI:** Cloudflare Workers AI (`backend/worker.js`) · **Voice:** the device's own text-to-speech
- Settings live in `src/config/services.js`; see [BUILD_APK.md](BUILD_APK.md) for details.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build                # web build → dist/
```

Android APK: see [BUILD_APK.md](BUILD_APK.md). Publishing on Google Play: see [PLAY_STORE.md](PLAY_STORE.md). Pushing to `main` also builds the
APK automatically with GitHub Actions (Actions tab → Artifacts).

## Project layout

- `src/pages` — screens (Home, Learn, Lesson, Quiz, Projects, Lab, Revision…)
- `src/components` — UI, lab, lesson, learning and splash components
- `src/lib/curriculum` — all lesson, quiz and project content (works offline)
- `src/lib/lab`, `src/lib/circuit`, `src/lib/buildsheet` — circuit lab, wiring and build sheets
- `src/lib/arduino` — Arduino C → JavaScript transpiler and the virtual-time runtime
- `src/lib/arena` — robot physics, sensors and the arena tasks · `src/components/arena` — the 3-D view
- `src/lib/design` — CSG solid modelling, primitives, parts library, STL export
- `src/lib/assessment` — assignment bank, VDT generator, practical-file PDF
- `src/lib/mechanisms.js`, `src/lib/srs.js`, `src/lib/examPlan.js`, `src/lib/prices.js`
- `backend-schema` — data model for the hosted backend
