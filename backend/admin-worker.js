// RoboCraft admin server (Cloudflare Worker). Separate from the student worker.
//
// For the owner only. For one request it:
//   1. Checks the caller's Firebase login is the owner's verified Google account.
//   2. Lists the repo's text files and asks Claude which ones the change needs.
//   3. Asks Claude for exact find/replace edits to those files (and any new files).
//   4. Puts the edits on a NEW branch, one commit per file, and opens a pull request.
//   5. Optional: turns on GitHub auto-merge, which merges only after the "build" check passes.
// It never pushes to main directly. Changes to .github/ are never auto-merged.
//
// Secrets (Cloudflare → Worker → Settings → Variables and Secrets):
//   ANTHROPIC_API_KEY  – Anthropic console key
//   GITHUB_TOKEN       – fine-grained token, Contents + Pull requests read & write, this repo only
//   FIREBASE_API_KEY   – the public web key from src/config/services.js

const ADMIN_EMAIL = 'aryansonkar243@gmail.com';
const REPO = 'robocraft-edu/Robocraft';
const BASE = 'main';
const CLAUDE_MODEL = 'claude-sonnet-5-5';
const MAX_FILE_CHARS = 150000;
const MAX_FILES_PER_CHANGE = 8;
const ORIGINS = ['https://robocraft-edu.github.io', 'http://localhost:5174'];
const TEXT_EXT = /\.(jsx?|tsx?|css|html?|json|md|ya?ml|svg|txt|toml|rules|xml|gradle|properties|kts?|java|cjs|mjs|webmanifest)$/i;

const SYSTEM = `You change code in RoboCraft, a React learning app for Indian school students (Classes 9–11).
Make only the change that was asked. Never add tracking, ads, third-party services, secrets, or any collection of personal data about students.
Keep student safety in mind: no adult, violent or frightening content.
Reply with JSON only, no other text.`;

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
}

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
}

async function verifyOwner(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const idToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!idToken) return false;
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }),
  });
  if (!r.ok) return false;
  const d = await r.json();
  const u = d.users && d.users[0];
  return !!u && u.email === ADMIN_EMAIL && u.emailVerified === true;
}

function gh(env, path, init = {}) {
  return fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'robocraft-admin',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
}

function fromBase64(s) {
  const bin = atob(s.replace(/\n/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

function toBase64(text) {
  let bin = '';
  for (const b of new TextEncoder().encode(text)) bin += String.fromCharCode(b);
  return btoa(bin);
}

/** Paths the tool may write: any text file in the repo, except secrets and generated folders. */
function allowedPath(p) {
  if (typeof p !== 'string' || p.length > 200 || p.length < 2) return false;
  if (p.includes('..') || p.startsWith('/') || p.includes('\\')) return false;
  if (/^(\.git\/|node_modules\/|dist|dist-admin\/)/.test(p)) return false;
  if (/(^|\/)\.env|secret|credential|keystore|\.jks$|\.p12$|\.key$|\.pem$/i.test(p)) return false;
  return TEXT_EXT.test(p) || /(^|\/)\.(gitignore|editorconfig)$/.test(p);
}

async function claude(env, prompt, maxTokens) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: maxTokens, system: SYSTEM, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!r.ok) throw new Error('Claude request failed');
  const d = await r.json();
  const text = (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('Claude did not return JSON');
  return JSON.parse(text.slice(start, end + 1));
}

/** Apply exact find/replace edits. Each "find" must match exactly once. */
function applyEdits(text, edits) {
  let out = text;
  for (const e of edits) {
    const find = String(e.find ?? '');
    if (!find) throw new Error('empty find');
    const count = out.split(find).length - 1;
    if (count !== 1) throw new Error(`edit matched ${count} times`);
    out = out.replace(find, () => String(e.replace ?? ''));
  }
  return out;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/change') return json({ error: 'Not found' }, 404, origin);
    if (!ORIGINS.includes(origin)) return json({ error: 'Origin not allowed' }, 403, origin);
    if (!(await verifyOwner(request, env))) return json({ error: 'Only the owner can do this.' }, 403, origin);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Bad request' }, 400, origin); }
    const instruction = String(body.request || '').trim().slice(0, 3000);
    const hint = String(body.path || '').trim();
    const autoMerge = body.autoMerge === true;
    if (!instruction) return json({ error: 'Describe the change first.' }, 400, origin);

    try {
      // 1. The list of files on main.
      const treeRes = await gh(env, `/git/trees/${BASE}?recursive=1`);
      if (!treeRes.ok) throw new Error('tree');
      const tree = await treeRes.json();
      const files = (tree.tree || []).filter(t => t.type === 'blob' && allowedPath(t.path) && (t.size || 0) < MAX_FILE_CHARS);
      const shas = Object.fromEntries(files.map(f => [f.path, f.sha]));
      const listing = files.map(f => f.path).join('\n');

      // 2. Claude picks the files this change needs.
      const pick = await claude(env, `Repository files (on main):\n${listing}\n\nRequest: ${instruction}\n${hint ? `The owner mentioned this file: ${hint}\n` : ''}\nReply JSON: {"files": ["paths of the files that must change, at most ${MAX_FILES_PER_CHANGE}"], "new_files": ["paths of any new files to create, optional"]}`, 1000);
      const chosen = (Array.isArray(pick.files) ? pick.files : []).filter(p => shas[p]).slice(0, MAX_FILES_PER_CHANGE);
      const newFiles = (Array.isArray(pick.new_files) ? pick.new_files : []).filter(p => allowedPath(p) && !shas[p]).slice(0, 4);
      if (!chosen.length && !newFiles.length) return json({ error: 'Claude could not find the file for this change. Name the file in the box.' }, 400, origin);

      // 3. Read those files and ask for exact edits.
      const current = {};
      for (const p of chosen) {
        const fr = await gh(env, `/contents/${p}?ref=${BASE}`);
        if (!fr.ok) throw new Error('read');
        current[p] = fromBase64((await fr.json()).content);
      }
      const docs = chosen.map(p => `<<<FILE ${p}\n${current[p]}\nFILE>>>`).join('\n\n');
      const change = await claude(env, `Request: ${instruction}\n\nFiles:\n${docs || '(none)'}\n\nNew files to create: ${newFiles.join(', ') || 'none'}\n\nReply JSON exactly in this shape:\n{"title": "PR title under 70 characters", "summary": "2 to 4 sentences: what changed and why", "edits": [{"path": "existing file", "find": "exact text copied from the file, unique in it", "replace": "new text"}], "create": [{"path": "new file", "content": "full content"}]}\nRules: "find" must be copied character for character and appear exactly once in its file. Keep edits small. Change nothing else.`, 16000);

      // 4. Apply the edits in memory first, so a bad edit stops everything before anything is written.
      const writes = new Map(); // path -> { content, sha? }
      for (const e of Array.isArray(change.edits) ? change.edits : []) {
        const p = e.path;
        if (!chosen.includes(p)) throw new Error('edit to an unexpected file');
        const base = writes.has(p) ? writes.get(p).content : current[p];
        writes.set(p, { content: applyEdits(base, [e]), sha: shas[p] });
      }
      for (const c of Array.isArray(change.create) ? change.create : []) {
        if (!allowedPath(c.path) || shas[c.path]) throw new Error('bad new file');
        if (typeof c.content !== 'string' || c.content.length > MAX_FILE_CHARS) throw new Error('bad content');
        writes.set(c.path, { content: c.content, sha: null });
      }
      if (!writes.size) throw new Error('no changes');
      const title = String(change.title || 'Admin change').slice(0, 70);
      const summary = String(change.summary || '').slice(0, 800);

      // 5. A new branch from main, one commit per file, then a pull request.
      const refRes = await gh(env, `/git/ref/heads/${BASE}`);
      if (!refRes.ok) throw new Error('main');
      const mainSha = (await refRes.json()).object.sha;
      const branch = `claude/admin-${Date.now().toString(36)}`;
      const mk = await gh(env, '/git/refs', { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: mainSha }) });
      if (!mk.ok) throw new Error('branch');
      for (const [p, w] of writes) {
        const put = await gh(env, `/contents/${p}`, {
          method: 'PUT',
          body: JSON.stringify({ message: title, content: toBase64(w.content), branch, ...(w.sha ? { sha: w.sha } : {}) }),
        });
        if (!put.ok) throw new Error('commit');
      }
      const pr = await gh(env, '/pulls', {
        method: 'POST',
        body: JSON.stringify({
          title, head: branch, base: BASE,
          body: `${summary}\n\nFiles: ${[...writes.keys()].join(', ')}\nRequested in the admin app: "${instruction}"`,
        }),
      });
      const prData = await pr.json();
      if (!pr.ok) throw new Error('pr');

      // 6. Auto-merge, only if asked and never for workflow files.
      const touchesWorkflows = [...writes.keys()].some(p => p.startsWith('.github/'));
      let merge = 'manual';
      if (autoMerge && !touchesWorkflows) {
        const q = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'robocraft-admin' },
          body: JSON.stringify({
            query: 'mutation($id: ID!) { enablePullRequestAutoMerge(input: {pullRequestId: $id, mergeMethod: MERGE}) { pullRequest { number } } }',
            variables: { id: prData.node_id },
          }),
        });
        const qd = await q.json();
        merge = qd.errors ? 'failed' : 'auto';
      } else if (autoMerge && touchesWorkflows) {
        merge = 'workflow';
      }
      return json({ prUrl: prData.html_url, title, summary, files: [...writes.keys()], merge }, 200, origin);
    } catch (e) {
      return json({ error: 'The change could not be made. Nothing was merged.' }, 502, origin);
    }
  },
};
