// Weekly leaderboard (Firestore collection "leaderboard", one doc per student).
// Privacy: only a nickname, an avatar emoji, class and this week's XP are shared.
// Never names or emails. Students can hide themselves at any time.
import { fb } from '@/api/firebase';
import { accountsEnabled } from '@/lib/features';

const COL = 'leaderboard';
const ADJ = ['Swift', 'Bright', 'Clever', 'Turbo', 'Mighty', 'Quantum', 'Rapid', 'Brave', 'Cosmic', 'Neon', 'Solar', 'Pixel', 'Smart', 'Steady', 'Electric'];
const NOUN = ['Bot', 'Gear', 'Servo', 'Circuit', 'Rover', 'Droid', 'Sensor', 'Spark', 'Byte', 'Motor', 'Drone', 'Coder', 'Volt', 'Chip', 'Pilot'];

// Short list of words not allowed in nicknames (checked without spaces/numbers).
const BLOCKED = ['fuck', 'shit', 'bitch', 'ass', 'dick', 'sex', 'porn', 'nude', 'boob', 'slut', 'whore', 'cunt', 'rape', 'kill', 'nazi', 'hitler',
  'bc', 'mc', 'bsdk', 'chutiya', 'chutia', 'madarchod', 'behenchod', 'bhenchod', 'gandu', 'randi', 'lund', 'chod', 'harami', 'kamina', 'saala', 'sala'];

export const NICK_RE = /^[A-Za-z0-9_ ]{3,16}$/;

export function randomNickname() {
  const r = (a) => a[Math.floor(Math.random() * a.length)];
  return r(ADJ) + r(NOUN) + Math.floor(10 + Math.random() * 90);
}

/** Returns an error message, or '' if the nickname is OK. */
export function checkNickname(nick) {
  const n = String(nick || '').trim();
  if (!NICK_RE.test(n)) return 'Use 3–16 letters, numbers, spaces or _';
  const flat = n.toLowerCase().replace(/[^a-z]/g, '');
  const words = n.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  if (BLOCKED.some(b => (b.length <= 3 ? words.includes(b) : flat.includes(b)))) return 'Please choose a friendlier nickname';
  if (/@|\d{6,}/.test(n)) return "Don't use emails or phone numbers";
  return '';
}

export const boardId = (classId, week) => `${classId}_${week}`;

async function ctx() {
  if (!accountsEnabled) return null;
  const { db, F, auth } = await fb();
  if (!auth.currentUser) return null;
  return { db, F, uid: auth.currentUser.uid };
}

let myCache = null;

/** The student's own entry (creates a default nickname the first time). */
export async function getMyEntry() {
  const c = await ctx();
  if (!c) return null;
  if (myCache && myCache.uid === c.uid) return myCache.data;
  const snap = await c.F.getDoc(c.F.doc(c.db, COL, c.uid));
  const data = snap.exists() ? snap.data() : { nickname: randomNickname(), hidden: false, group: '', isNew: true };
  myCache = { uid: c.uid, data };
  return data;
}

/** Save this week's score (skipped while hidden). */
export async function publishScore({ classId, week, weekXp, avatar }) {
  const c = await ctx();
  if (!c) return;
  const me = await getMyEntry();
  if (!me) return;
  const data = {
    nickname: me.nickname,
    avatar: String(avatar || '🤖').slice(0, 8),
    classId,
    board: me.hidden ? '' : boardId(classId, week),
    weekXp: Math.max(0, Math.min(50000, Math.round(weekXp || 0))),
    group: me.group || '',
    hidden: !!me.hidden,
    updated: new Date().toISOString(),
  };
  await c.F.setDoc(c.F.doc(c.db, COL, c.uid), data);
  myCache = { uid: c.uid, data };
}

/** Change nickname / hidden / group code. */
export async function updateMyEntry(changes, current) {
  const c = await ctx();
  if (!c) throw new Error('Sign in to join the leaderboard.');
  const me = { ...(await getMyEntry()), ...changes };
  myCache = { uid: c.uid, data: me };
  await publishScore({ ...current });
}

/** Everyone on this week's board for a class, highest XP first. */
export async function fetchBoard(classId, week) {
  const c = await ctx();
  if (!c) return { signedIn: false, rows: [] };
  const q = c.F.query(c.F.collection(c.db, COL), c.F.where('board', '==', boardId(classId, week)), c.F.limit(500));
  const snap = await c.F.getDocs(q);
  const rows = snap.docs.map(d => ({ id: d.id, me: d.id === c.uid, ...d.data() }))
    .filter(r => !r.hidden && r.weekXp > 0)
    .sort((a, b) => b.weekXp - a.weekXp);
  return { signedIn: true, uid: c.uid, rows };
}

// ── High-fives ──────────────────────────────────────────────────────────────
// A high-five is a preset emoji from one student to a classmate on the board.
// No text is sent, so there is nothing to moderate. One per pair per day: the
// document id is fixed for that pair and day, so the database rejects repeats.
export const HIGH_FIVE_EMOJI = ['🙌', '⭐', '🔥', '🤖'];
const HF_COL = 'highfives';
const dayKey = () => new Date().toLocaleDateString('en-CA'); // local YYYY-MM-DD

export async function sendHighFive(toUid, emoji) {
  const c = await ctx();
  if (!c) throw Object.assign(new Error('Sign in to send a high-five.'), { status: 401 });
  if (toUid === c.uid) throw new Error("You can't high-five yourself.");
  if (!HIGH_FIVE_EMOJI.includes(emoji)) throw new Error('Unknown high-five.');
  const day = dayKey();
  await c.F.setDoc(c.F.doc(c.db, HF_COL, `${c.uid}_${toUid}_${day}`), {
    from: c.uid, to: toUid, emoji, day, created: new Date().toISOString(),
  });
}

/** High-fives the signed-in student received today. */
export async function myHighFivesToday() {
  const c = await ctx();
  if (!c) return [];
  const q = c.F.query(c.F.collection(c.db, HF_COL), c.F.where('to', '==', c.uid), c.F.where('day', '==', dayKey()));
  const snap = await c.F.getDocs(q);
  return snap.docs.map(d => d.data());
}
