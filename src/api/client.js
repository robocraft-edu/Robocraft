// RoboCraft backend client.
// Same shape the app already uses (backend.auth.*, backend.integrations.Core.*,
// backend.entities.*), now powered by free services:
//   • Accounts + progress  → Firebase Auth + Firestore
//   • AI                   → Cloudflare Workers AI (backend/worker.js)
//   • Speech               → the device's own text-to-speech (see lib/speech.js)
import { aiServerUrl } from '@/config/services';
import { accountsEnabled, aiEnabled } from '@/lib/features';
import { fb, currentFirebaseUser, authError } from '@/api/firebase';
import { nativeGoogle } from '@/lib/platform';
import { coerceToSchema } from '@/lib/aiShape';

let deleting = false;

const unavailable = (what) => Promise.reject(Object.assign(new Error(`${what} aren't available yet.`), { status: 503, offline: true }));

// ── Accounts ────────────────────────────────────────────────────────────────
async function userRecord(fbUser) {
  const { db, F } = await fb();
  let data = {};
  try {
    const snap = await F.getDoc(F.doc(db, 'users', fbUser.uid));
    if (snap.exists()) data = snap.data();
  } catch { /* offline: fall back to local progress */ }
  return {
    id: fbUser.uid,
    email: fbUser.email,
    full_name: fbUser.displayName || data.full_name || (fbUser.email ? fbUser.email.split('@')[0] : 'Student'),
    email_verified: fbUser.emailVerified,
    role: 'user',
    ...data,
  };
}

const auth = {
  async me() {
    if (!accountsEnabled) return unavailable('Accounts');
    const u = await currentFirebaseUser();
    if (!u) throw Object.assign(new Error('Not signed in'), { status: 401 });
    return userRecord(u);
  },
  async loginViaEmailPassword(email, password) {
    if (!accountsEnabled) return unavailable('Accounts');
    const { auth: a, A } = await fb();
    try { await A.signInWithEmailAndPassword(a, email.trim(), password); }
    catch (e) { throw authError(e); }
  },
  async register({ email, password }) {
    if (!accountsEnabled) return unavailable('Accounts');
    const { auth: a, A } = await fb();
    try {
      const cred = await A.createUserWithEmailAndPassword(a, email.trim(), password);
      try { await A.sendEmailVerification(cred.user); } catch { /* optional */ }
      return { user: cred.user };
    } catch (e) { throw authError(e); }
  },
  async loginWithGoogle() {
    if (!accountsEnabled) return unavailable('Accounts');
    const { auth: a, A } = await fb();
    if (nativeGoogle) {
      // Android app: native Google account picker, then hand the token to Firebase JS.
      const { registerPlugin } = await import('@capacitor/core');
      const FA = registerPlugin('FirebaseAuthentication');
      let res;
      try { res = await FA.signInWithGoogle({ skipNativeAuth: true }); }
      catch (e) {
        if (/cancel/i.test(e?.message || '')) throw Object.assign(new Error('Sign-in cancelled.'), { cancelled: true });
        throw Object.assign(new Error('Google sign-in failed. Try email and password.'), { cause: e });
      }
      const cred = A.GoogleAuthProvider.credential(res?.credential?.idToken || null, res?.credential?.accessToken || null);
      try { await A.signInWithCredential(a, cred); } catch (e) { throw authError(e); }
      return;
    }
    // A popup is nicer when it works, but plenty of mobile browsers and
    // in-app webviews block it outright. Fall back to a full-page redirect
    // rather than leaving the student staring at an error.
    const provider = new A.GoogleAuthProvider();
    try {
      await A.signInWithPopup(a, provider);
    } catch (e) {
      const code = e?.code || '';
      if (/popup-blocked|operation-not-supported|popup-closed-by-user|cancelled-popup-request|web-storage-unsupported/.test(code)) {
        if (code === 'auth/popup-closed-by-user') throw Object.assign(new Error('Sign-in was cancelled.'), { cancelled: true });
        try { await A.signInWithRedirect(a, provider); return; } catch (e2) { throw authError(e2); }
      }
      throw authError(e);
    }
  },
  async resendVerification() {
    const { auth: a, A } = await fb();
    if (a.currentUser) await A.sendEmailVerification(a.currentUser);
  },
  async resetPasswordRequest(email) {
    if (!accountsEnabled) return unavailable('Accounts');
    const { auth: a, A } = await fb();
    try { await A.sendPasswordResetEmail(a, email.trim()); }
    catch (e) { if (e?.code !== 'auth/user-not-found') throw authError(e); }
  },
  async updateMe(data) {
    if (!accountsEnabled) return unavailable('Accounts');
    // A progress sync queued just before "delete my account" must not write the
    // document back after it has been removed.
    if (deleting) return;
    const { db, F, auth: a } = await fb();
    if (!a.currentUser) return;
    await F.setDoc(F.doc(db, 'users', a.currentUser.uid), { ...data, updated_at: F.serverTimestamp() }, { merge: true });
  },
  // Deleting an account is irreversible, so prove who is asking BEFORE anything
  // is erased. Firebase refuses deleteUser on an old session, and the previous
  // order wiped the student's progress first and only then hit that refusal,
  // leaving an account with nothing in it.
  async deleteAccount({ password } = {}) {
    const { db, F, auth: a, A } = await fb();
    const u = a.currentUser; if (!u) return;

    const minutesSinceLogin = (Date.now() - Date.parse(u.metadata?.lastSignInTime || 0)) / 60000;
    if (!(minutesSinceLogin < 4)) {
      const google = (u.providerData || []).some(p => p.providerId === 'google.com');
      try {
        if (google) {
          await A.reauthenticateWithPopup(u, new A.GoogleAuthProvider());
        } else if (password) {
          await A.reauthenticateWithCredential(u, A.EmailAuthProvider.credential(u.email, password));
        } else {
          throw Object.assign(new Error('For your safety, enter your password to confirm.'), { needsPassword: true });
        }
      } catch (e) {
        if (e?.needsPassword) throw e;
        throw authError(e);
      }
    }

    deleting = true;
    try {
      // The student's own saved AI projects go too.
      try {
        const snap = await F.getDocs(F.query(F.collection(db, PROJECTS), F.where('owner', '==', u.uid), F.limit(300)));
        await Promise.all(snap.docs.map(d => F.deleteDoc(d.ref).catch(() => {})));
      } catch { /* offline or none saved */ }
      try { await F.deleteDoc(F.doc(db, 'leaderboard', u.uid)); } catch { /* may not exist */ }
      try { await F.deleteDoc(F.doc(db, 'users', u.uid)); } catch { /* may not exist */ }
      await A.deleteUser(u);
    } catch (e) {
      deleting = false;
      throw authError(e);
    }
  },
  async logout() {
    if (!accountsEnabled) return;
    const { auth: a, A } = await fb();
    await A.signOut(a);
  },
  setToken() {},
};

// ── AI (Cloudflare Workers AI) ──────────────────────────────────────────────
// Saved AI answers for lesson features (Explain simpler, podcasts, etc.), so
// opening the same thing again is instant. Free-text questions are not saved.
const AI_CACHE_KEY = 'robocraft_ai_cache_v1';
const AI_CACHE_MAX = 40;
const AI_CACHE_DAYS = 7;
function hashOf(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36) + '_' + str.length;
}
function readAiCache() {
  try { return JSON.parse(localStorage.getItem(AI_CACHE_KEY) || '{}'); } catch { return {}; }
}
function writeAiCache(key, result) {
  try {
    const c = readAiCache();
    c[key] = { t: Date.now(), r: result };
    const keys = Object.keys(c).sort((a, b) => c[b].t - c[a].t);
    keys.slice(AI_CACHE_MAX).forEach(k => delete c[k]);
    localStorage.setItem(AI_CACHE_KEY, JSON.stringify(c));
  } catch { /* storage full or blocked: skip caching */ }
}

async function invokeLLM({ prompt, response_json_schema, user_input } = {}) {
  if (!aiEnabled) return unavailable('AI features');
  const cacheKey = user_input ? null : hashOf(JSON.stringify([prompt, response_json_schema || null]));
  if (cacheKey) {
    const hit = readAiCache()[cacheKey];
    if (hit && Date.now() - hit.t < AI_CACHE_DAYS * 86400000) return coerceToSchema(hit.r, response_json_schema);
  }
  let res;
  try {
    res = await fetch(aiServerUrl.replace(/\/$/, '') + '/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, schema: response_json_schema || null, user_input: user_input || '' }),
    });
  } catch {
    throw Object.assign(new Error('No internet connection. AI needs internet.'), { status: 0 });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw Object.assign(new Error(data.error || 'AI is busy right now. Please try again.'), { status: res.status });
  if (cacheKey && !data.blocked) writeAiCache(cacheKey, data.result);
  return coerceToSchema(data.result, response_json_schema);
}

// ── Saved AI projects (Firestore) ───────────────────────────────────────────
const PROJECTS = 'generatedProjects';
const generatedProject = {
  async create(data) {
    if (!accountsEnabled) return unavailable('Saving');
    const { db, F, auth: a } = await fb();
    if (!a.currentUser) throw Object.assign(new Error('Log in to save projects.'), { status: 401 });
    const record = { ...data, owner: a.currentUser.uid, created_date: new Date().toISOString() };
    const ref = await F.addDoc(F.collection(db, PROJECTS), record);
    return { id: ref.id, ...record };
  },
  async update(id, data) {
    if (!accountsEnabled) return unavailable('Saving');
    const { db, F } = await fb();
    await F.updateDoc(F.doc(db, PROJECTS, id), data);
    return { id, ...data };
  },
  // Only ever the signed-in student's own projects. These documents are written
  // straight from the browser, so sharing them between accounts would let anyone
  // put arbitrary text in front of another child. Sorting happens here rather
  // than in the query so no composite index is needed.
  async list(sort = '-created_date', limit = 50) {
    if (!accountsEnabled) return [];
    const { db, F, auth: a } = await fb();
    if (!a.currentUser) return [];
    const q = F.query(F.collection(db, PROJECTS), F.where('owner', '==', a.currentUser.uid), F.limit(200));
    const snap = await F.getDocs(q);
    const field = sort.replace(/^-/, '');
    const dir = sort.startsWith('-') ? -1 : 1;
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((x, y) => (String(x[field] || '') < String(y[field] || '') ? -1 : 1) * dir)
      .slice(0, limit);
  },
  async filter(criteria = {}) {
    const all = await generatedProject.list('-created_date', 100);
    return all.filter(p => Object.entries(criteria).every(([k, v]) => p[k] === v));
  },
};

export const backend = {
  auth,
  integrations: {
    Core: {
      InvokeLLM: invokeLLM,
      // Speech is generated on the device now (free, offline); see lib/speech.js.
      GenerateSpeech: () => unavailable('Server speech'),
    },
  },
  entities: { GeneratedProject: generatedProject },
  asServiceRole: { entities: { GeneratedProject: generatedProject } },
};
