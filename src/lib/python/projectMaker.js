// "Python Project Maker": the student says what they want to build, and gets
// a working Python program plus a lesson about it.
//
// The AI writes the program and the teaching notes. Two things are NOT left to
// the AI: (1) the operator / line-by-line explanation, which lib/python/analyze
// reads from the real code, and (2) whether the code works, which is checked by
// really running it. If the AI is unreachable, or its code is unsafe or fails,
// a tested ready-made project is used instead, so this never ends in an error.
import { backend } from '@/api/client';
import { asText, asList } from '@/lib/aiShape';
import { runPython } from '@/lib/python/runner';
import { PY_TEMPLATES } from '@/lib/python/projectTemplates';

export const IDEAS = [
  'A calculator that shows every operator',
  'Marks and grade calculator for my class',
  'Number guessing game',
  'Bank account with deposit and withdraw',
  'Quiz game about space',
  'Robot that reacts to a distance sensor',
];

// Things a school project never needs, and that have no place in a learner's code.
const FORBIDDEN = /\b(import|from)\s+(os|sys|subprocess|socket|shutil|requests|urllib|http|ctypes|pathlib|pickle|webbrowser|js|pyodide|asyncio|threading|multiprocessing)\b|\b(eval|exec|compile|__import__|open|breakpoint)\s*\(/;

export function isSafe(code) {
  const c = String(code || '');
  if (c.length < 20 || c.length > 6000) return false;
  return !FORBIDDEN.test(c);
}

export function offlineProject(request) {
  const text = String(request || '');
  const t = PY_TEMPLATES.find(x => x.re.test(text));
  const pick = t || PY_TEMPLATES[0];
  return { ...shape(pick), matched: !!t };
}

function shape(t) {
  return {
    title: t.title, summary: t.summary, code: t.code, sampleInput: t.sample || '',
    concepts: t.concepts, tryNext: t.next, realWorld: t.real, notes: [], operatorNotes: {}, how: '',
  };
}

const SCHEMA = { type: 'object', properties: {
  title: { type: 'string' }, summary: { type: 'string' }, how_it_works: { type: 'string' },
  code: { type: 'string' }, sample_input: { type: 'string' },
  concepts: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, explain: { type: 'string' } } } },
  line_notes: { type: 'array', items: { type: 'object', properties: { line: { type: 'number' }, note: { type: 'string' } } } },
  operator_notes: { type: 'array', items: { type: 'object', properties: { op: { type: 'string' }, why: { type: 'string' } } } },
  try_next: { type: 'array', items: { type: 'string' } },
  real_world: { type: 'string' },
} };

const LEVEL = {
  class_9: 'The student is in Class 9: keep it simple (variables, input, if/else, for/while loops, lists). Avoid classes.',
  class_10: 'The student is in Class 10: variables, loops, lists, dictionaries and functions are fine.',
  class_11: 'The student is in Class 11: functions, lists, dictionaries and simple classes are fine.',
};

function prompt(request, cls, previous) {
  return `A school student (ICSE/ISC, ${cls || 'class 9-11'}) wants to build this in Python: "${request}".
${LEVEL[cls] || LEVEL.class_10}
Write a complete, SHORT (20-50 lines), correct Python 3 program for it, and teach from it.

Rules for the code:
- Plain Python only. No imports except random, math, time, datetime or string. No files, network, os, sys, eval, exec or open.
- It must run to the end by itself. If it uses input(), give the answers in sample_input, one per line, in the order they are asked, and make sure the program never asks for more answers than that. Prefer few input() calls.
- Never loop forever. If it uses random, call random.seed(1) first so every run is the same.
- Use a comment above each logical step. Use a good mix of operators the student must learn (arithmetic, comparison, logical, assignment like +=), where the project naturally needs them.
- Use only teen-appropriate, kind content.

Return JSON with:
- title: short project name
- summary: one sentence
- how_it_works: 3-4 simple sentences describing the program's idea, in order
- code: the program
- sample_input: the answers for input(), one per line ("" if none)
- concepts: 4-6 {name, explain} for the ideas the code uses (explain in 1-2 simple sentences, referring to actual names in the code)
- line_notes: up to 12 {line (1-based line number in code), note} for the most important lines, each explaining WHY the line is there for THIS project
- operator_notes: {op, why} for the key operators used (op is the symbol, e.g. "%" or "+="), saying what it does in THIS project
- try_next: 3 improvement challenges, easiest first
- real_world: one sentence on where this idea is used in real life${previous ? `\n\nYour previous program failed: ${previous.error}\nFix it. Previous code:\n${previous.code}` : ''}`;
}

/** Runs the code for real (in the same sandbox the student will use). Resolves { ok, error, output }. */
export function checkRuns(code, input) {
  return new Promise((resolve) => {
    let out = '', err = '', settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };
    const guard = setTimeout(() => { stop(); done({ ok: true, skipped: true }); }, 45000);
    const stop = runPython(code, {
      input: input || '',
      onEvent: (ev) => {
        if (ev.type === 'out') out += `${ev.text}\n`;
        else if (ev.type === 'err') {
          err += `${ev.text}\n`;
          // Could not start Python at all (offline): we cannot verify, so do not blame the code.
          if (/could not start|needs the internet|Another program/i.test(ev.text)) { clearTimeout(guard); done({ ok: true, skipped: true }); }
        } else if (ev.type === 'done') { clearTimeout(guard); done(ev.ok ? { ok: true, output: out } : { ok: false, error: err.trim().slice(-400), output: out }); }
      },
    });
  });
}

/**
 * Designs a project from a description. Never throws.
 * Resolves { project, note, blocked? }.
 */
export async function makeProject(request, cls) {
  const text = String(request || '').trim().slice(0, 240);
  let previous = null, note = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await backend.integrations.Core.InvokeLLM({ user_input: text, prompt: prompt(text, cls, previous), response_json_schema: SCHEMA });
      if (!res || typeof res !== 'object') throw new Error('empty');
      if (res.__blocked) return { blocked: true, note: asText(res.response || res.text) };
      const code = asText(res.code).replace(/^\s*```[a-z]*\n?/i, '').replace(/```\s*$/, '').trim() + '\n';
      if (!isSafe(code)) { previous = { code, error: 'it used something not allowed (imports other than random/math/time/datetime, files, eval, or it was far too long/short)' }; continue; }
      const sampleInput = asText(res.sample_input);
      const check = await checkRuns(code, sampleInput);
      if (!check.ok) { previous = { code, error: check.error || 'it crashed' }; continue; }
      const operatorNotes = {};
      asList(res.operator_notes).forEach(o => { if (o && o.op) operatorNotes[String(o.op).trim()] = asText(o.why); });
      return {
        project: {
          title: asText(res.title).slice(0, 80) || 'My Python project',
          summary: asText(res.summary).slice(0, 260),
          how: asText(res.how_it_works).slice(0, 700),
          code, sampleInput,
          concepts: asList(res.concepts).map(c => ({ name: asText(c?.name).slice(0, 60), explain: asText(c?.explain).slice(0, 360) })).filter(c => c.name && c.explain).slice(0, 8),
          notes: asList(res.line_notes).map(n => ({ line: Number(n?.line), note: asText(n?.note).slice(0, 280) })).filter(n => n.line > 0 && n.note).slice(0, 20),
          operatorNotes,
          tryNext: asList(res.try_next).map(asText).filter(Boolean).slice(0, 4),
          realWorld: asText(res.real_world).slice(0, 260),
        },
        note: '',
      };
    } catch (e) {
      if (e && (e.status === 0 || e.status === 429 || e.status === 401)) { note = e.message || ''; break; }
    }
  }
  const o = offlineProject(text);
  const why = note || 'The AI helper was not available';
  return { project: o, note: `${why}, so here is the closest ready-made project${o.matched ? '' : ' (a calculator: it shows every operator)'}. You can edit it and run it.` };
}
