// Daily study reminders.
// Android app: real phone notifications (@capacitor/local-notifications).
// We schedule the next 7 days one by one and skip today if the student has
// already studied, so nobody is nagged after finishing their lesson.
// Web / iPhone: an in-app "keep your streak" card on Home (see StreakReminder).
import { isNative } from '@/lib/platform';

const KEY = 'robocraft_reminder';
const IDS = [1001, 1002, 1003, 1004, 1005, 1006, 1007];

const MESSAGES = [
  ['🤖 Your robot misses you!', 'A quick 5-minute lesson keeps your streak alive.'],
  ['🔥 Keep the streak going', 'One lesson today = more XP and coins.'],
  ['⚡ Daily robotics boost', 'Learn something new in under 10 minutes.'],
  ['🏆 Climb the ranks', 'Finish a lesson or quiz today to earn XP.'],
  ['🧠 Quick brain workout', 'Try a quiz — can you get 100%?'],
  ['🛠️ Build something today', 'Open the Lab or start your next lesson.'],
  ['🎁 Coins are waiting', 'Earn coins today and spend them in the Reward Shop.'],
];

export function getReminderSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && typeof s.time === 'string') return { enabled: !!s.enabled, time: s.time };
  } catch { /* ignore */ }
  return { enabled: false, time: '18:00' };
}

function saveSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

async function plugin() {
  if (!isNative) return null;
  try { return (await import('@capacitor/local-notifications')).LocalNotifications; } catch { return null; }
}

/** Ask for permission (Android 13+ shows a system prompt). Returns true if allowed. */
async function ensurePermission(LN) {
  let p = await LN.checkPermissions();
  if (p.display === 'prompt' || p.display === 'prompt-with-rationale') p = await LN.requestPermissions();
  return p.display === 'granted';
}

/**
 * (Re)schedule the next week of reminders.
 * @param {boolean} studiedToday skip today's reminder when true
 */
export async function scheduleReminders(studiedToday = false) {
  const LN = await plugin();
  if (!LN) return { ok: true, native: false };
  const s = getReminderSettings();
  try {
    await LN.cancel({ notifications: IDS.map(id => ({ id })) });
    if (!s.enabled) return { ok: true, native: true };
    if (!(await ensurePermission(LN))) return { ok: false, native: true, reason: 'permission' };
    const [h, m] = s.time.split(':').map(Number);
    const now = new Date();
    const notifications = [];
    for (let i = 0; i < 7; i++) {
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h, m, 0);
      if (at <= now) continue;
      if (i === 0 && studiedToday) continue;
      const [title, body] = MESSAGES[(at.getDate() + i) % MESSAGES.length];
      notifications.push({ id: IDS[i], title, body, schedule: { at } });
    }
    if (notifications.length) await LN.schedule({ notifications });
    return { ok: true, native: true };
  } catch (e) {
    console.warn('Reminder scheduling failed', e);
    return { ok: false, native: true, reason: 'error' };
  }
}

/** Save new settings and reschedule. */
export async function setReminderSettings(next, studiedToday = false) {
  saveSettings({ ...getReminderSettings(), ...next });
  return scheduleReminders(studiedToday);
}

export const remindersAreNative = isNative;

// ── Streak warnings ─────────────────────────────────────────────────────────
// If a student has a streak and hasn't studied today, they get up to four
// escalating warnings before midnight, so the streak isn't lost by surprise.
// Android: scheduled phone notifications. Web (PC, Android browser, iPhone home-screen
// app): browser notifications while the app is open, plus the Home streak card.
const WARN_IDS = [2001, 2002, 2003, 2004];
const WARN_TIMES = ['17:00', '19:00', '20:30', '21:45'];
const WARN_MESSAGES = [
  ['🔥 Your streak is waiting!', 'Your {n}-day streak ends at midnight. One lesson keeps it alive.'],
  ['⚡ {n} days strong!', 'A few hours left to keep your streak going. Do one quiz now.'],
  ['🚨 Streak alert!', 'Your {n}-day streak ends tonight. A 5-minute lesson saves it.'],
  ['🏁 Last chance tonight!', 'Your {n}-day streak ends at midnight. Finish one step right now!'],
];

function warnText(i, n) {
  const [t, b] = WARN_MESSAGES[i];
  return { title: t.replace('{n}', n), body: b.replace('{n}', n) };
}

/** Warnings still to come today, as { slot, at, title, body }. */
export function streakWarningsToday(streak, studiedToday, now = new Date()) {
  if (!streak || streak < 1 || studiedToday) return [];
  const out = [];
  WARN_TIMES.forEach((t, i) => {
    const [h, m] = t.split(':').map(Number);
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    if (at > now) out.push({ slot: i, at, ...warnText(i, streak) });
  });
  return out;
}

/** Android: schedule today's warnings, or cancel them if the student already studied. */
export async function scheduleStreakWarnings(streak, studiedToday) {
  const LN = await plugin();
  if (!LN) return;
  try {
    await LN.cancel({ notifications: WARN_IDS.map(id => ({ id })) });
    const due = streakWarningsToday(streak, studiedToday);
    if (!due.length) return;
    if (!(await ensurePermission(LN))) return;
    await LN.schedule({ notifications: due.map(d => ({ id: WARN_IDS[d.slot], title: d.title, body: d.body, schedule: { at: d.at } })) });
  } catch (e) {
    console.warn('Streak warnings failed', e);
  }
}

/** Web/PC: show a browser notification when a warning time arrives while the app is open. */
export function showWebStreakWarning(streak, studiedToday, now = new Date()) {
  if (isNative || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const slot = WARN_TIMES.indexOf(hhmm);
  if (slot < 0) return;
  const key = `robocraft_warn_${now.toDateString()}_${slot}`;
  try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch { /* ignore */ }
  const due = streakWarningsToday(streak, studiedToday, new Date(now.getTime() - 60000)).find(d => d.slot === slot);
  if (!due) return;
  new Notification(due.title, { body: due.body, icon: `${import.meta.env.BASE_URL}icon-192.png`, tag: 'streak-warning' });
}

/** Ask for notification permission (PC/web). Only call from a button tap. */
export async function askWebNotifications() {
  if (isNative || typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  return (await Notification.requestPermission()) === 'granted';
}
