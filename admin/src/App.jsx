import React, { useCallback, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, limit, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Owner-only. The same rules live in backend/firestore.rules and in the admin Worker,
// so this screen is not the only lock.
const ADMIN_EMAIL = 'aryansonkar243@gmail.com';
// Set this to the URL of the deployed admin Worker (backend/admin-worker.js).
const ADMIN_WORKER_URL = 'https://robocraft-admin.REPLACE-ME.workers.dev';

const app = initializeApp({
  apiKey: 'AIzaSyBg2gI3OHnDfN2Ay1Qo8zF_wVplYYEU3Jw',
  authDomain: 'robocraft-cec0f.firebaseapp.com',
  projectId: 'robocraft-cec0f',
  storageBucket: 'robocraft-cec0f.firebasestorage.app',
  messagingSenderId: '856516489922',
  appId: '1:856516489922:web:4d079745c5b26ddff8015b',
}, 'admin');
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [denied, setDenied] = useState(false);

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    if (u && (u.email !== ADMIN_EMAIL || !u.emailVerified)) {
      setDenied(true);
      await signOut(auth);
      setUser(null);
      return;
    }
    setDenied(false);
    setUser(u || null);
  }), []);

  if (user === undefined) return <div className="center muted">Checking…</div>;
  if (!user) return <SignIn denied={denied} />;
  return <Dashboard user={user} />;
}

function SignIn({ denied }) {
  const [error, setError] = useState('');
  const signIn = async () => {
    setError('');
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch (e) { setError(e.message || 'Sign-in failed.'); }
  };
  return (
    <div className="center">
      <h1>RoboCraft admin</h1>
      <p className="muted">Only the owner account can open this.</p>
      {denied && <p className="err">This account is not allowed.</p>}
      {error && <p className="err">{error}</p>}
      <button className="btn primary" onClick={signIn}>Sign in with Google</button>
    </div>
  );
}

function Dashboard({ user }) {
  const [tab, setTab] = useState('photos');
  return (
    <div>
      <header className="top">
        <h1>RoboCraft admin</h1>
        <div className="row" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="muted">{user.email}</span>
          <button className="btn" onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </header>
      <main className="wrap">
        <div className="tabs">
          <button className={`tab ${tab === 'photos' ? 'on' : ''}`} onClick={() => setTab('photos')}>Photos to approve</button>
          <button className={`tab ${tab === 'claude' ? 'on' : ''}`} onClick={() => setTab('claude')}>Ask Claude to change the app</button>
        </div>
        {tab === 'photos' ? <Photos /> : <ClaudeChanges user={user} />}
      </main>
    </div>
  );
}

function Photos() {
  const [posts, setPosts] = useState(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setPosts(null);
    setMsg('');
    try {
      const snap = await getDocs(query(collection(db, 'community'), where('status', '==', 'pending'), limit(50)));
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.created || '').localeCompare(b.created || '')));
    } catch (e) {
      setMsg(`Could not load photos: ${e.message}`);
      setPosts([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id) => {
    try {
      await updateDoc(doc(db, 'community', id), { status: 'approved' });
      setPosts(p => p.filter(x => x.id !== id));
    } catch (e) { setMsg(`Not approved: ${e.message}`); }
  };

  const reject = async (id) => {
    if (!window.confirm('Delete this photo? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'community', id));
      setPosts(p => p.filter(x => x.id !== id));
    } catch (e) { setMsg(`Not deleted: ${e.message}`); }
  };

  return (
    <section>
      <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p className="muted" style={{ margin: 0 }}>{posts ? `${posts.length} waiting` : 'Loading…'}</p>
        <button className="btn" onClick={load}>Refresh</button>
      </div>
      {msg && <p className="err">{msg}</p>}
      {posts && posts.length === 0 && <p className="muted">Nothing waiting for approval.</p>}
      <div className="grid">
        {(posts || []).map(p => (
          <article key={p.id} className="card">
            <img src={p.image} alt={p.caption || 'Robot photo'} />
            <div className="body">
              <strong>{p.avatar} {p.nickname}</strong>
              {p.caption ? <span className="muted">{p.caption}</span> : <span className="muted">No caption</span>}
              <span className="muted" style={{ fontSize: 11 }}>{p.created}</span>
              <div className="row" style={{ display: 'flex', gap: 8 }}>
                <button className="btn ok" style={{ flex: 1 }} onClick={() => approve(p.id)}>Approve</button>
                <button className="btn bad" style={{ flex: 1 }} onClick={() => reject(p.id)}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ClaudeChanges({ user }) {
  const [request, setRequest] = useState('');
  const [autoMerge, setAutoMerge] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const send = async () => {
    setBusy(true);
    setResult(null);
    try {
      const token = await user.getIdToken();
      const r = await fetch(`${ADMIN_WORKER_URL}/change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ request, autoMerge }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'The change could not be made.');
      setResult({ ok: true, ...data });
    } catch (e) {
      setResult({ ok: false, text: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel">
      <p className="muted" style={{ margin: 0 }}>
        Describe the change in plain words. Claude picks the files itself (frontend, backend, rules or workflows), makes the change on a new branch and opens a pull request. Nothing is merged until you merge it on GitHub.
      </p>
      <label className="muted">What should change?</label>
      <textarea value={request} onChange={e => setRequest(e.target.value)} placeholder="For example: make the streak warning appear one hour earlier and update its text." />
      <label className="row" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="checkbox" checked={autoMerge} onChange={e => setAutoMerge(e.target.checked)} />
        <span>Merge automatically once the build passes (off unless ticked). Workflow files always wait for you.</span>
      </label>
      <div>
        <button className="btn primary" disabled={busy || !request.trim()} onClick={send}>
          {busy ? 'Working…' : 'Ask Claude'}
        </button>
      </div>
      {result && result.ok && (
        <div className="note ok">
          <strong>{result.title}</strong>
          <p className="muted">{result.summary}</p>
          {result.files && <p className="muted" style={{ fontSize: 12 }}>Files: {result.files.join(', ')}</p>}
          <p className="muted">{result.merge === 'auto' ? 'Auto-merge is on: it merges when the build passes.' : result.merge === 'workflow' ? 'This touches workflow files, so merge it yourself.' : result.merge === 'failed' ? 'Auto-merge could not be turned on. Merge it yourself.' : 'Waiting for you to merge.'}</p>
          <a href={result.prUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Open the pull request on GitHub and merge it there</a>
        </div>
      )}
      {result && !result.ok && <div className="note bad">{result.text}</div>}
    </section>
  );
}
