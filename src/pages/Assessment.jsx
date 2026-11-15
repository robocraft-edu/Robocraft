import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';
import BackButton from '@/components/BackButton';
import { assignmentsFor, KIND_LABEL } from '@/lib/assessment/assignments';
import { makeVDT } from '@/lib/assessment/vdt';
import { runPython } from '@/lib/python/runner';
import { runSketch, SimBoard } from '@/lib/arduino/runtime';
import { FileText, Play, Plus, Check, Trash2, ChevronUp, ChevronDown, Download, Loader2, Bot, ClipboardCheck, Timer, PenLine, Wand2 } from 'lucide-react';
import { FILE_IDEAS } from '@/lib/assessment/fileMaker';

const FILE_KEY = 'robocraft_practical_file';
const loadFile = () => { try { return JSON.parse(localStorage.getItem(FILE_KEY)) || null; } catch { return null; } };
const CLASS_NAME = { class_9: 'IX', class_10: 'X', class_11: 'XI' };
const thisSession = () => { const d = new Date(); const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1; return `${y}-${String(y + 1).slice(2)}`; };

/** Run a program and resolve with its text output. */
function execute(item) {
  return new Promise((resolve) => {
    if (item.kind === 'arduino') {
      const b = new SimBoard(); const lines = [];
      b.onSerial = (l) => lines.push(l);
      const h = runSketch(item.code, b, { speed: 1e6, maxMs: 15000, onError: (e) => lines.push(`Error: ${e.message}`) });
      h.done.then(() => resolve((lines.length ? lines.slice(0, 40).join('\n') : '(no Serial output — this sketch drives hardware; describe the observed output)') + (lines.length > 40 ? '\n...' : '')));
      return;
    }
    let out = '';
    runPython(item.code, {
      input: item.input || '',
      onEvent: (ev) => {
        if (ev.type === 'out' || ev.type === 'err') out += ev.text + '\n';
        if (ev.type === 'done') resolve(out.trim() || '(no output)');
      },
    });
  });
}

function VdtEditor({ rows, onChange }) {
  const set = (i, k, v) => onChange(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead><tr className="bg-cyan-500/10"><th className="p-1.5 text-left">Variable</th><th className="p-1.5 text-left">Data type</th><th className="p-1.5 text-left">Description</th><th /></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              <td className="p-1"><input value={r.name} onChange={e => set(i, 'name', e.target.value)} className="w-20 bg-transparent font-mono" /></td>
              <td className="p-1"><input value={r.type} onChange={e => set(i, 'type', e.target.value)} placeholder="type" className="w-24 bg-transparent" /></td>
              <td className="p-1"><input value={r.description} onChange={e => set(i, 'description', e.target.value)} placeholder="what it stores" className="w-full min-w-[10rem] bg-transparent" /></td>
              <td><button onClick={() => onChange(rows.filter((_, j) => j !== i))} className="text-red-400 px-1">×</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => onChange([...rows, { name: '', type: '', description: '' }])} className="text-[11px] text-cyan-400 mt-1">+ Add row</button>
    </div>
  );
}

function ProgramEditor({ item, onSave, onCancel, saveLabel = 'Add to practical file' }) {
  const navigate = useNavigate();
  const [it, setIt] = useState(() => ({ ...item, vdt: item.vdt || makeVDT(item.code, item.kind) }));
  const [running, setRunning] = useState(false);
  const run = async () => { setRunning(true); const output = await execute(it); setIt(x => ({ ...x, output })); setRunning(false); };
  const custom = !!item.custom;
  return (
    <div className="space-y-3">
      {custom ? (
        <>
          <input value={it.title} onChange={e => setIt({ ...it, title: e.target.value })} placeholder="Program title" className="w-full glass rounded-lg px-3 py-2 text-sm font-semibold" />
          <textarea value={it.question} onChange={e => setIt({ ...it, question: e.target.value })} placeholder="Question / problem statement" rows={3} className="w-full glass rounded-lg px-3 py-2 text-xs" />
          <div className="flex gap-2 text-xs">
            {['python', 'arduino'].map(k => <button key={k} onClick={() => setIt({ ...it, kind: k })} className={`px-3 py-1 rounded-full ${it.kind === k ? 'bg-cyan-500 text-white' : 'glass'}`}>{KIND_LABEL[k]}</button>)}
          </div>
        </>
      ) : (
        <div className="glass-strong rounded-xl p-3">
          <p className="text-[10px] text-violet-400 font-bold">{KIND_LABEL[it.kind]} · {it.topic}</p>
          <p className="text-sm font-semibold">{it.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{it.question}</p>
        </div>
      )}
      <div>
        <p className="text-[11px] font-bold mb-1">Algorithm (one step per line)</p>
        <textarea value={(it.algorithm || []).join('\n')} onChange={e => setIt({ ...it, algorithm: e.target.value.split('\n') })} rows={Math.min(8, (it.algorithm?.length || 3) + 1)} className="w-full glass rounded-lg px-3 py-2 text-xs" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold">Program</p>
          <button onClick={() => setIt(x => ({ ...x, vdt: makeVDT(x.code, x.kind) }))} className="text-[10px] text-cyan-400">Regenerate VDT from code</button>
        </div>
        <textarea value={it.code} onChange={e => setIt({ ...it, code: e.target.value })} rows={12} spellCheck={false} className="w-full rounded-lg px-3 py-2 text-[11px] font-mono bg-[#0d1117] on-dark text-slate-100 whitespace-pre overflow-auto" />
      </div>
      {it.kind !== 'arduino' && (
        <div>
          <p className="text-[11px] font-bold mb-1">Input (one value per line)</p>
          <textarea value={it.input || ''} onChange={e => setIt({ ...it, input: e.target.value })} rows={2} className="w-full glass rounded-lg px-3 py-2 text-xs font-mono" />
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={run} disabled={running} className="flex-1 py-2 rounded-xl bg-green-600 text-white text-xs font-bold flex items-center justify-center gap-1.5">{running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Run & record output</button>
        {it.arena && <button onClick={() => navigate(`/arena?task=${it.arena}`)} className="px-3 py-2 rounded-xl glass-strong text-xs flex items-center gap-1"><Bot className="w-4 h-4" /> Test on robot</button>}
      </div>
      {it.output && <pre className="rounded-lg bg-black/80 on-dark text-green-300 text-[11px] p-3 whitespace-pre-wrap max-h-48 overflow-auto">{it.output}</pre>}
      <div>
        <p className="text-[11px] font-bold mb-1">Variable Description Table</p>
        <VdtEditor rows={it.vdt} onChange={(vdt) => setIt({ ...it, vdt })} />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl glass text-xs">Cancel</button>
        <button onClick={() => onSave({ ...it, date: it.date || new Date().toLocaleDateString('en-IN') })} disabled={!it.title?.trim() || !it.code?.trim()} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-40">{saveLabel}</button>
      </div>
    </div>
  );
}

// ISC-style practical rehearsal: planning session → examination session → viva
const VIVA = {
  python: ['What is the difference between a list and a tuple?', 'Why did you choose this loop?', 'What is the time complexity of your solution?', 'How would your program behave with invalid input?', 'What does the variable with the largest scope store?', 'Can this be written using a function? Why would that help?'],
  arduino: ['Why is setup() run only once?', 'What would happen if you removed the delay()?', 'Why do motor driver inputs need two pins per motor?', 'What does pulseIn() return and in what unit?', 'How does PWM control speed?', 'How would you make this robot safer?'],
  ai: ['What is the difference between training and testing data?', 'Why do we measure distance between samples?', 'What is overfitting?', 'Which features did you use and why?', 'How would you evaluate accuracy?', 'Is this supervised or unsupervised learning?'],
};
function Rehearsal({ pool }) {
  const [q, setQ] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | plan | exam | viva | done
  const [left, setLeft] = useState(0);
  const [plan, setPlan] = useState('');
  const [code, setCode] = useState('');
  const [out, setOut] = useState('');
  const [viva, setViva] = useState({});
  const tick = useRef(null);
  useEffect(() => () => clearInterval(tick.current), []);
  const startTimer = (sec, next) => {
    clearInterval(tick.current); setLeft(sec);
    tick.current = setInterval(() => setLeft(s => { if (s <= 1) { clearInterval(tick.current); next?.(); return 0; } return s - 1; }), 1000);
  };
  const begin = () => {
    const p = pool[Math.floor(Math.random() * pool.length)];
    setQ(p); setPlan(''); setCode(p.kind === 'arduino' ? 'void setup() {\n\n}\n\nvoid loop() {\n\n}\n' : ''); setOut(''); setViva({});
    setPhase('plan'); startTimer(15 * 60, () => setPhase('exam'));
  };
  const toExam = () => { setPhase('exam'); startTimer(60 * 60, () => setPhase('viva')); };
  const run = async () => setOut(await execute({ ...q, code }));
  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  const qs = q ? VIVA[q.kind] : [];
  const score = q ? {
    plan: Math.min(5, plan.split('\n').filter(l => l.trim().length > 5).length),
    prog: code.trim().length > 40 ? (out && !/error/i.test(out) ? 8 : 4) : 0,
    viva: Object.values(viva).filter(Boolean).length,
  } : null;
  if (phase === 'idle') return (
    <div className="glass-strong rounded-2xl p-4">
      <p className="text-sm font-semibold mb-1">Practical exam rehearsal</p>
      <p className="text-xs text-muted-foreground mb-3">Like the board practical: a 15-minute <b>planning session</b> (write the algorithm on paper/here — no computer), then the <b>examination session</b> (type, run and record output), then a short <b>viva</b>. You get a random question you haven't prepared.</p>
      <button onClick={begin} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1.5"><Timer className="w-4 h-4" /> Start rehearsal</button>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wide text-cyan-400">{{ plan: 'Planning session', exam: 'Examination session', viva: 'Viva voce', done: 'Result' }[phase]}</span>
        {(phase === 'plan' || phase === 'exam') && <span className="font-mono text-sm">{mm}</span>}
      </div>
      <div className="glass-strong rounded-xl p-3"><p className="text-xs">{q.question}</p></div>
      {phase === 'plan' && <>
        <textarea value={plan} onChange={e => setPlan(e.target.value)} rows={8} placeholder={'Step 1: Start\nStep 2: ...'} className="w-full glass rounded-lg px-3 py-2 text-xs" />
        <button onClick={toExam} className="w-full py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold">Algorithm done → go to the computer</button>
      </>}
      {phase === 'exam' && <>
        <textarea value={code} onChange={e => setCode(e.target.value)} rows={14} spellCheck={false} className="w-full rounded-lg px-3 py-2 text-[11px] font-mono bg-[#0d1117] on-dark text-slate-100 whitespace-pre" />
        <div className="flex gap-2">
          <button onClick={run} className="flex-1 py-2 rounded-xl bg-green-600 text-white text-xs font-bold">Run</button>
          <button onClick={() => { clearInterval(tick.current); setPhase('viva'); }} className="flex-1 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold">Submit → viva</button>
        </div>
        {out && <pre className="rounded-lg bg-black/80 on-dark text-green-300 text-[11px] p-3 whitespace-pre-wrap max-h-40 overflow-auto">{out}</pre>}
      </>}
      {phase === 'viva' && <>
        <p className="text-[11px] text-muted-foreground">Answer each aloud (or to a friend), then tick the ones you could explain confidently.</p>
        {qs.map((v, i) => (
          <label key={i} className="flex items-start gap-2 text-xs glass rounded-lg p-2"><input type="checkbox" checked={!!viva[i]} onChange={e => setViva({ ...viva, [i]: e.target.checked })} className="mt-0.5" /> {v}</label>
        ))}
        <button onClick={() => setPhase('done')} className="w-full py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold">Finish</button>
      </>}
      {phase === 'done' && score && (
        <div className="glass-strong rounded-xl p-3 text-xs space-y-1">
          <p>Planning (algorithm): <b>{score.plan}/5</b></p>
          <p>Program & output: <b>{score.prog}/8</b> {score.prog < 8 && '(run it without errors for full marks)'}</p>
          <p>Viva: <b>{score.viva}/6</b></p>
          <p className="text-sm font-bold pt-1">Rehearsal score: {score.plan + score.prog + score.viva}/19</p>
          <p className="text-muted-foreground">Compare your work with the model answer:</p>
          <pre className="rounded-lg bg-[#0d1117] on-dark text-slate-100 text-[10px] p-2 whitespace-pre overflow-auto max-h-48">{q.code}</pre>
          <button onClick={() => setPhase('idle')} className="w-full py-2 rounded-xl glass text-xs mt-1">Try another</button>
        </div>
      )}
    </div>
  );
}


/** "Make my whole file": one request in, a complete practical file out. */
function MakeWholeFile({ selectedClass, details, hasItems, onDone }) {
  const [text, setText] = useState('');
  const [step, setStep] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const go = async (mode) => {
    if (!text.trim() || busy) return;
    setBusy(true); setResult(null); setStep('Starting…');
    try {
      const { makeWholeFile } = await import('@/lib/assessment/fileMaker');
      const r = await makeWholeFile(text, selectedClass, details, setStep);
      setResult(r);
      if (r.items.length) onDone(r.items, mode);
    } finally { setBusy(false); setStep(''); }
  };
  return (
    <div className="glass-strong rounded-2xl p-4 border border-cyan-500/30">
      <p className="text-sm font-bold flex items-center gap-1.5"><Wand2 className="w-4 h-4 text-cyan-500" /> Make my whole file</p>
      <p className="text-[11px] text-muted-foreground mb-2">Say what you need. Every program is run before it goes in, so the output in your file is real and the code has no errors.</p>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={2} maxLength={300}
        placeholder='e.g. give me a 15 page file with if else programs'
        className="w-full bg-background/60 border border-border rounded-xl px-3 py-2 text-sm resize-none" />
      <div className="flex flex-wrap gap-1.5 my-2">
        {FILE_IDEAS.map(t => <button key={t} onClick={() => setText(t)} className="text-[10px] px-2.5 py-1 rounded-full glass">{t}</button>)}
      </div>
      {hasItems ? (
        <div className="flex gap-2">
          <button onClick={() => go('replace')} disabled={busy || !text.trim()} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-40">Make a new file</button>
          <button onClick={() => go('append')} disabled={busy || !text.trim()} className="flex-1 py-2.5 rounded-xl glass text-xs font-semibold disabled:opacity-40">Add to my file</button>
        </div>
      ) : (
        <button onClick={() => go('replace')} disabled={busy || !text.trim()} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-40">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} Make my file
        </button>
      )}
      {busy && <p className="text-[11px] text-cyan-500 mt-2 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> {step}</p>}
      {result && !busy && (
        <p className="text-[11px] mt-2 text-muted-foreground">
          {result.items.length
            ? <>Done: <b>{result.items.length} programs</b>, <b>{result.pages} pages</b>{result.target ? ` (you asked for ${result.target})` : ''}. {result.items.every(i => i.verified) ? 'Every program ran without errors.' : 'Python could not start to record outputs; run each program once from the file to record it.'} {result.note}</>
            : (result.note || 'Could not make the file. Check your internet and try again.')}
        </p>
      )}
    </div>
  );
}

export default function Assessment() {
  const { selectedClass } = useApp();
  const { user } = useAuth();
  const pool = useMemo(() => assignmentsFor(selectedClass), [selectedClass]);
  const [tab, setTab] = useState('bank');
  const [editing, setEditing] = useState(null); // { item, index? }
  const [file, setFile] = useState(() => loadFile() || {
    details: { name: user?.full_name || '', school: '', subject: 'Robotics and Artificial Intelligence', className: CLASS_NAME[selectedClass] || '', section: '', roll: '', uid: '', teacher: '', session: thisSession() },
    items: [],
  });
  const [busy, setBusy] = useState(false);
  useEffect(() => { try { localStorage.setItem(FILE_KEY, JSON.stringify(file)); } catch { /* ignore */ } }, [file]);
  const inFile = (id) => file.items.some(x => x.id === id);
  const saveItem = (it) => {
    setFile(f => {
      const items = [...f.items];
      if (editing?.index != null) items[editing.index] = it; else items.push(it);
      return { ...f, items };
    });
    setEditing(null); setTab('file');
  };
  const move = (i, d) => setFile(f => { const items = [...f.items]; const j = i + d; if (j < 0 || j >= items.length) return f; [items[i], items[j]] = [items[j], items[i]]; return { ...f, items }; });
  const download = async () => {
    setBusy(true);
    try { const { downloadPracticalPdf } = await import('@/lib/assessment/practicalPdf'); await downloadPracticalPdf(file.details, file.items); }
    finally { setBusy(false); }
  };
  const D = file.details, setD = (k, v) => setFile(f => ({ ...f, details: { ...f.details, [k]: v } }));

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-10">
        <button onClick={() => setEditing(null)} className="text-xs text-cyan-500 mb-3">← Back</button>
        <ProgramEditor item={editing.item} onSave={saveItem} onCancel={() => setEditing(null)} saveLabel={editing.index != null ? 'Save changes' : 'Add to practical file'} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-10">
      <div className="flex items-center gap-2 mb-1">
        <BackButton />
        <h1 className="text-lg font-bold flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-cyan-500" /> Internal Assessment</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Assignments in the CISCE practical-file format, an automatic Variable Description Table, a ready-to-print practical file, and a board-style practical rehearsal.</p>
      <div className="flex gap-1 mb-3 text-xs">
        {[['bank', 'Assignment bank'], ['file', `Practical file (${file.items.length})`], ['rehearse', 'Practical rehearsal']].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 py-2 rounded-lg ${tab === id ? 'bg-cyan-500 text-white font-semibold' : 'glass-strong'}`}>{l}</button>
        ))}
      </div>

      {(tab === 'bank' || tab === 'file') && (
        <div className="mb-3">
          <MakeWholeFile selectedClass={selectedClass} details={file.details} hasItems={file.items.length > 0}
            onDone={(items, mode) => { setFile(f => ({ ...f, items: mode === 'append' ? [...f.items, ...items] : items })); setTab('file'); }} />
        </div>
      )}

      {tab === 'bank' && (
        <div className="space-y-2">
          <button onClick={() => setEditing({ item: { id: `own_${Date.now()}`, custom: true, kind: 'python', title: '', question: '', algorithm: [], code: '', input: '' } })} className="w-full glass-strong rounded-xl p-3 text-xs font-semibold flex items-center justify-center gap-1.5 text-cyan-400"><PenLine className="w-4 h-4" /> Write my own program</button>
          {pool.map(a => (
            <button key={a.id} onClick={() => setEditing({ item: a })} className="w-full glass-strong rounded-xl p-3 text-left flex items-start gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${a.kind === 'arduino' ? 'bg-amber-500/15 text-amber-500' : a.kind === 'ai' ? 'bg-violet-500/15 text-violet-400' : 'bg-cyan-500/15 text-cyan-500'}`}>{KIND_LABEL[a.kind]}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold">{a.title}</span>
                <span className="block text-[11px] text-muted-foreground line-clamp-2">{a.question}</span>
              </span>
              {inFile(a.id) && <Check className="w-4 h-4 text-green-500 shrink-0" />}
            </button>
          ))}
        </div>
      )}

      {tab === 'file' && (
        <div className="space-y-3">
          <div className="glass-strong rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
            {[['name', 'Name'], ['className', 'Class'], ['section', 'Section'], ['roll', 'Roll no.'], ['uid', 'UID / Index no.'], ['session', 'Session'], ['teacher', 'Subject teacher'], ['school', 'School']].map(([k, l]) => (
              <label key={k} className={k === 'school' || k === 'teacher' ? 'col-span-2' : ''}>
                <span className="text-[10px] text-muted-foreground">{l}</span>
                <input value={D[k] || ''} placeholder={k === 'school' ? 'e.g. City Montessori School, Lucknow' : ''} onChange={e => setD(k, e.target.value)} className="w-full bg-background/60 border border-border rounded-lg px-2 py-1.5" />
              </label>
            ))}
          </div>
          {file.items.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No programs yet — add them from the Assignment bank.</p>}
          {file.items.map((it, i) => (
            <div key={it.id + i} className="glass-strong rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-xs font-bold w-5 text-center">{i + 1}</span>
              <button onClick={() => setEditing({ item: it, index: i })} className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold truncate">{it.title}</p>
                <p className="text-[10px] text-muted-foreground">{KIND_LABEL[it.kind]} · {it.output ? 'output recorded' : 'no output yet'} · {it.vdt?.length || 0} variables</p>
              </button>
              <button onClick={() => move(i, -1)}><ChevronUp className="w-4 h-4" /></button>
              <button onClick={() => move(i, 1)}><ChevronDown className="w-4 h-4" /></button>
              <button onClick={() => setFile(f => ({ ...f, items: f.items.filter((_, j) => j !== i) }))}><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          ))}
          <button onClick={() => setTab('bank')} className="w-full py-2 rounded-xl glass text-xs flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> Add program</button>
          <button onClick={download} disabled={!file.items.length || busy} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-40">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download practical file (PDF)
          </button>
          <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1"><FileText className="w-3 h-3" /> Cover · certificate · acknowledgement · index · question, algorithm, program, VDT and output for each program.</p>
        </div>
      )}

      {tab === 'rehearse' && <Rehearsal pool={pool} />}
    </div>
  );
}
