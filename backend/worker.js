// RoboCraft AI server — Cloudflare Worker using Workers AI (free tier).
// Paste this whole file into a new Worker, add a "Workers AI" binding named AI,
// then Deploy. No API keys needed.

const MODEL = '@cf/meta/llama-4-scout-17b-16e-instruct'; // JSON / long answers
const FAST_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';    // short chat answers (much quicker)
const CACHE_SECONDS = 7 * 24 * 3600;                         // identical requests are answered from cache
const GUARD = '@cf/meta/llama-guard-3-8b';
const ALLOWED_ORIGINS = [
  'https://robocraft-edu.github.io',  // web / iPhone version
  'https://aryanworldwide.github.io', // old address, kept while people move over
  'https://localhost',                // Android app
  'capacitor://localhost',
  'http://localhost:5173',            // local development
];

// Rules for every answer: the app is used by school students (about 13–17).
const SYSTEM = `You are RoboMentor, a friendly study helper inside RoboCraft, a learning app for Indian school students in Classes 9–11 (ages about 13–17).
Rules you must always follow:
- Only help with learning: robotics, electronics, Arduino/ESP32, coding, AI, maths and science, and how to study them.
- Keep language simple, encouraging and age-appropriate. No adult, violent, hateful or frightening content.
- Electrical safety: only suggest low-voltage battery/USB projects (under 12 V). Never give instructions for mains (230 V AC) wiring, lithium battery modification, weapons, or anything dangerous; tell the student to ask a teacher or adult instead.
- Never ask for or store personal information (full name, phone, address, school, photos, passwords).
- If a student seems upset, unsafe or mentions self-harm, respond kindly, encourage them to talk to a trusted adult, and share India's Tele-MANAS helpline 14416.
- If asked about anything off-topic, gently steer back to learning.
- When asked for JSON, reply with valid JSON only.`;

// Simple per-IP limit (per server instance) to protect the free daily allowance.
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000, max = 40;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > max;
}

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin || '');
  return {
    'Access-Control-Allow-Origin': ok ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
const json = (data, status, origin) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors(origin) } });

// Workers AI answers come back either as { response } or OpenAI-style { choices }.
function textOf(out) {
  if (!out) return '';
  if (typeof out === 'string') return out;
  if (out.response !== undefined) return typeof out.response === 'string' ? out.response : JSON.stringify(out.response);
  const c = out.choices?.[0];
  return c?.message?.content ?? c?.text ?? '';
}

// Compact description of a JSON schema, e.g. {"name":string,"steps":[{"title":string}]}.
// Llama follows this better than strict schema mode, which leaves fields empty.
function shapeOf(s) {
  if (!s || typeof s !== 'object') return 'string';
  if (s.type === 'object' && s.properties) return '{' + Object.entries(s.properties).map(([k, v]) => JSON.stringify(k) + ':' + shapeOf(v)).join(',') + '}';
  if (s.type === 'array') return '[' + shapeOf(s.items) + ']';
  return s.type || 'string';
}

async function cacheKeyFor(body) {
  const data = new TextEncoder().encode(JSON.stringify([body.prompt, body.schema || null, body.user_input || '']));
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))].map(b => b.toString(16).padStart(2, '0')).join('');
  return new Request('https://cache.robocraft-ai/v1/' + hash);
}

function extractJson(text) {
  if (typeof text !== 'string') return text;
  try { return JSON.parse(text); } catch {}
  const m = text.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    const url = new URL(request.url);
    if (request.method === 'GET') return json({ ok: true, service: 'robocraft-ai' }, 200, origin);
    if (request.method !== 'POST' || url.pathname !== '/ai') return json({ error: 'Not found' }, 404, origin);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (limited(ip)) return json({ error: 'Too many requests. Please wait a few minutes.' }, 429, origin);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Bad request' }, 400, origin); }
    const prompt = String(body.prompt || '').slice(0, 12000);
    const userInput = body.user_input ? String(body.user_input).slice(0, 2000) : '';
    const schema = body.schema && typeof body.schema === 'object' ? body.schema : null;
    if (!prompt) return json({ error: 'Empty prompt' }, 400, origin);

    // Answer from cache when the exact same request was made before (fast, and saves the free allowance).
    const cache = caches.default;
    const key = await cacheKeyFor({ prompt, schema, user_input: userInput });
    const hit = await cache.match(key);
    if (hit) {
      const cached = await hit.json();
      return json({ ...cached, cached: true }, 200, origin);
    }

    try {
      // Safety check on what the student typed runs at the same time as the answer.
      const guard = userInput
        ? env.AI.run(GUARD, { messages: [{ role: 'user', content: userInput }] })
            .then(g => /\bunsafe\b/i.test(textOf(g)) || g?.response?.safe === false)
            .catch(() => false)
        : Promise.resolve(false);

      const messages = [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }];
      const big = schema && Object.keys(schema.properties || {}).length > 6;
      const base = { messages, max_tokens: big ? 4000 : 1500, temperature: 0.4 };

      const answer = (async () => {
        if (schema) {
          const shapeMsg = { role: 'system', content: 'Reply with ONE valid JSON object only (no markdown), with every field filled in, matching exactly this shape: ' + shapeOf(schema) };
          // Most JSON here is small — a hint, a simpler explanation, five quiz
          // questions — and the fast model answers those in a few seconds
          // instead of twenty. Big asks (a whole project, with code) and any
          // retry go to the stronger model.
          const smallJson = prompt.length < 1200 && Object.keys(schema?.properties || {}).length <= 6;
          for (let attempt = 0; attempt < 2; attempt++) {
            const jsonModel = (smallJson && attempt === 0) ? FAST_MODEL : MODEL;
            let out;
            try {
              out = await env.AI.run(jsonModel, { ...base, messages: [messages[0], shapeMsg, messages[1]], response_format: { type: 'json_object' } });
            } catch {
              out = await env.AI.run(jsonModel, { ...base, messages: [messages[0], shapeMsg, messages[1]] });
            }
            const parsed = extractJson(textOf(out));
            if (parsed) return parsed;
          }
          return null;
        }
        // Short questions use the fast model; long prompts use the bigger one.
        const model = prompt.length < 4000 ? FAST_MODEL : MODEL;
        let out;
        try { out = await env.AI.run(model, { ...base, max_tokens: 900 }); }
        catch { out = await env.AI.run(MODEL, base); }
        return textOf(out).trim();
      })();

      const [unsafe, result] = await Promise.all([guard, answer]);
      if (unsafe) {
        const msg = "I can only help with learning topics like robotics, coding and science. If something is worrying you, please talk to a trusted adult — or call India's Tele-MANAS helpline 14416.";
        return json({ result: schema ? { response: msg, text: msg, explanation: msg, code: '' } : msg, blocked: true }, 200, origin);
      }
      if (result === null || result === '') return json({ error: 'The AI gave an unexpected answer. Please try again.' }, 502, origin);

      const payload = { result };
      await cache.put(key, new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${CACHE_SECONDS}` } }));
      return json(payload, 200, origin);
    } catch (e) {
      const msg = /neuron|quota|limit|capacity/i.test(String(e)) ? "Today's free AI limit has been reached. Please try again tomorrow." : 'AI is busy right now. Please try again.';
      return json({ error: msg, detail: String(e?.message || e).slice(0, 300) }, 503, origin);
    }
  },
};
