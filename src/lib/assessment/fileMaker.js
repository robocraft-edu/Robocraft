// "Make my whole file": turns a request such as "15 page file with if else
// programs" into a finished practical file.
//
// 1. The AI writes programs on the asked topic (a few per call).
// 2. Every program is RUN in the in-app Python with its sample input. Its real
//    output is recorded; a program that fails is sent back once to be fixed,
//    and dropped if it still fails. Nothing goes in the file unless it ran.
// 3. If the AI is unavailable, or to top up, tested programs from the topic
//    bank are used.
// 4. The PDF is built and its pages counted, adding or removing programs until
//    it is as close to the asked page count as possible.
import { backend } from '@/api/client';
import { asText, asList } from '@/lib/aiShape';
import { isSafe, checkRuns } from '@/lib/python/projectMaker';
import { makeVDT } from '@/lib/assessment/vdt';
import { bankFor, topicsIn } from '@/lib/assessment/topicBank';
import { BANK_OUTPUTS } from '@/lib/assessment/topicBankOutputs';

export const FILE_IDEAS = [
  '15 page file with if else programs',
  '10 programs on loops',
  '12 page file on strings and lists',
  '20 page file covering if-else, loops and functions',
];

const FRONT_PAGES = 4; // cover, certificate, acknowledgement, index

export function parseRequest(text) {
  const t = String(text || '');
  const pg = t.match(/(\d{1,3})\s*-?\s*(?:pages?|pgs?)\b/i);
  const pr = t.match(/(\d{1,2})\s*(?:programs?|programmes?|questions?|codes?|practicals?)\b/i);
  const pages = pg ? Math.max(6, Math.min(60, Number(pg[1]))) : null;
  const programs = pr ? Math.max(1, Math.min(40, Number(pr[1]))) : null;
  return { pages, programs, topics: topicsIn(t) };
}

const SCHEMA = { type: 'object', properties: { programs: { type: 'array', items: { type: 'object', properties: {
  title: { type: 'string' }, question: { type: 'string' }, algorithm: { type: 'array', items: { type: 'string' } },
  code: { type: 'string' }, sample_input: { type: 'string' },
} } } } };

const LEVEL = { class_9: 'Class 9 (simple)', class_10: 'Class 10', class_11: 'Class 11 (ISC)' };

function batchPrompt(request, cls, n, avoid) {
  return `A school student (ICSE/ISC ${LEVEL[cls] || 'Class 9-11'}) needs programs for their Python practical file. Their request: "${request}".
Write ${n} DIFFERENT practical programs that fit the request (use the topic they asked for in every program), from easy to harder.
${avoid.length ? `Do NOT repeat these, already in the file: ${avoid.slice(-25).join('; ')}.\n` : ''}Rules for every program:
- Plain Python 3, 8-30 lines. No imports except math or random (call random.seed(1) first if you use random). No files, network, eval, exec or open.
- It must run to the end. If it uses input(), give the answers in sample_input, one per line, in order, and never ask for more answers than that.
- Never loop forever. Use clear variable names and simple, correct logic.
- question: written like a school practical question ("Write a program to ...").
- algorithm: 4-8 short steps starting with "Start." and ending with "Stop.".
Return JSON: {"programs":[{title, question, algorithm, code, sample_input}]}`;
}

const clean = (c) => asText(c).replace(/^\s*```[a-z]*\n?/i, '').replace(/```\s*$/, '').trim() + '\n';
const sameTitle = (a, b) => a.toLowerCase().replace(/[^a-z0-9]/g, '') === b.toLowerCase().replace(/[^a-z0-9]/g, '');

async function askAI(request, cls, n, avoid) {
  const res = await backend.integrations.Core.InvokeLLM({ user_input: request, prompt: batchPrompt(request, cls, n, avoid), response_json_schema: SCHEMA });
  if (!res || typeof res !== 'object') return [];
  if (res.__blocked) { const e = new Error('blocked'); e.blocked = true; throw e; }
  return asList(res.programs).map(p => ({
    title: asText(p?.title).slice(0, 90), question: asText(p?.question).slice(0, 600),
    algorithm: asList(p?.algorithm).map(asText).filter(Boolean).slice(0, 10),
    code: clean(p?.code), input: asText(p?.sample_input),
  })).filter(p => p.title && p.code.length > 20);
}

async function fixOnce(p, error) {
  try {
    const res = await backend.integrations.Core.InvokeLLM({
      user_input: p.title,
      prompt: `This Python practical program failed when run with the sample input.\nError: ${error}\nProgram:\n${p.code}\nSample input:\n${p.input}\nFix it so it runs to the end without errors (same task, plain Python, no imports except math/random). Return JSON {code, sample_input}.`,
      response_json_schema: { type: 'object', properties: { code: { type: 'string' }, sample_input: { type: 'string' } } },
    });
    if (res && !res.__blocked && res.code) return { ...p, code: clean(res.code), input: asText(res.sample_input) || p.input };
  } catch { /* fall through */ }
  return null;
}

/** Run a program; resolves the program with its real output, or null if it cannot be made to work. */
async function verify(p, { allowFix }) {
  if (!isSafe(p.code)) return null;
  let check = await checkRuns(p.code, p.input);
  if (!check.ok && allowFix) {
    const fixed = await fixOnce(p, check.error || 'it crashed');
    if (fixed && isSafe(fixed.code)) { p = fixed; check = await checkRuns(p.code, p.input); }
  }
  if (!check.ok) return null;
  // Python could not start (offline): bank programs still have their pre-recorded real output.
  if (check.skipped && BANK_OUTPUTS[p.title]) return { ...p, output: BANK_OUTPUTS[p.title], verified: true };
  // An AI program that could not be run is not trusted: a tested bank program takes its place.
  if (check.skipped) return null;
  return { ...p, output: (check.output || '').trim().slice(0, 2500), verified: true };
}

function finish(p, i) {
  return {
    id: `gen_${Date.now()}_${i}`, kind: 'python', title: p.title, question: p.question,
    algorithm: p.algorithm?.length ? p.algorithm : ['Start.', 'Follow the program steps.', 'Stop.'],
    code: p.code, input: p.input || '', output: p.output || '', vdt: makeVDT(p.code, 'python'),
    date: new Date().toLocaleDateString('en-IN'), verified: !!p.verified,
  };
}

/**
 * Builds the programs for a request. Never throws.
 * onStep(text) reports progress. Resolves { items, pages, target, note, usedAI }.
 */
export async function makeWholeFile(request, cls, details, onStep = () => {}) {
  const req = String(request || '').trim().slice(0, 300);
  const { pages: targetPages, programs: wantPrograms } = parseRequest(req);
  const target = targetPages || null;
  // first guess: about 1.4 pages per program
  let need = wantPrograms || (target ? Math.max(2, Math.round((target - FRONT_PAGES) / 1.4)) : 8);
  need = Math.min(need, 30);

  const good = [];
  let usedAI = false, aiDown = false, note = '';
  const titles = () => good.map(p => p.title);

  // 1) AI programs, in batches of up to 4, each one run before it is kept
  let tries = 0;
  while (good.length < need && !aiDown && tries < Math.ceil(need / 4) + 2) {
    tries += 1;
    const ask = Math.min(4, need - good.length);
    onStep(`Writing programs ${good.length + 1}–${good.length + ask} of ${need}…`);
    let batch = [];
    try { batch = await askAI(req, cls, ask, titles()); usedAI = usedAI || batch.length > 0; }
    catch (e) {
      if (e?.blocked) return { items: [], pages: 0, target, note: 'That request cannot be used for a practical file. Try a programming topic, like "if else" or "loops".', usedAI: false };
      aiDown = true; note = 'The AI helper was not available, so tested ready-made programs were used.';
      break;
    }
    if (!batch.length) { aiDown = true; break; }
    for (const p of batch) {
      if (good.length >= need || good.some(g => sameTitle(g.title, p.title))) continue;
      onStep(`Running "${p.title}" to check it works…`);
      const ok = await verify(p, { allowFix: true });
      if (ok) good.push(ok);
    }
  }

  // 2) top up from the tested bank (the asked-for topic first)
  const bank = bankFor(req);
  const fromBank = async (count) => {
    for (const p of bank) {
      if (count <= 0) break;
      if (good.some(g => sameTitle(g.title, p.title))) continue;
      onStep(`Adding "${p.title}"…`);
      const ok = await verify({ ...p }, { allowFix: false });
      if (ok) { good.push(ok); count -= 1; }
    }
  };
  if (good.length < need) await fromBank(need - good.length);

  // 3) match the page count by building the real PDF and counting its pages
  let items = good.map(finish);
  let pages = 0;
  if (items.length) {
    const { buildPracticalPdf } = await import('@/lib/assessment/practicalPdf');
    const count = async (list) => (await buildPracticalPdf(details, list)).getNumberOfPages();
    onStep('Laying out the pages…');
    pages = await count(items);
    if (target && !wantPrograms) {
      let guard = 0;
      while (pages < target && guard++ < 12) {
        const before = good.length;
        await fromBank(1);
        if (good.length === before) break; // bank used up
        const next = good.map(finish);
        const p2 = await count(next);
        if (p2 > target && p2 - target > target - pages) { good.pop(); break; }
        items = next; pages = p2;
      }
      while (pages > target && items.length > 1) {
        const next = items.slice(0, -1);
        const p2 = await count(next);
        if (p2 < target && target - p2 > pages - target) break;
        items = next; pages = p2;
      }
    }
  }
  return { items, pages, target, note, usedAI };
}
