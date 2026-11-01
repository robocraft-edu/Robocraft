import React, { useMemo, useState } from 'react';
import BackButton from '@/components/BackButton';
import PythonRunner from '@/components/learning/PythonRunner';
import { useApp } from '@/lib/AppContext';
import { makeProject, IDEAS } from '@/lib/python/projectMaker';
import { analyze, GROUP_ORDER } from '@/lib/python/analyze';
import { Sparkles, Terminal, ListOrdered, Calculator, BookOpen, Rocket, Loader2, Copy, Check, Trash2, Wand2 } from 'lucide-react';

const SAVE_KEY = 'robocraft_py_projects';
const readSaved = () => {
  try { const v = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'); return Array.isArray(v) ? v.filter(p => p && p.code && p.title) : []; } catch { return []; }
};
const writeSaved = (list) => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(list.slice(0, 12))); } catch { /* optional */ } };

const KIND = {
  comment: ['Comment', 'bg-slate-500/15 text-slate-400'], import: ['Import', 'bg-purple-500/15 text-purple-400'],
  def: ['Function', 'bg-pink-500/15 text-pink-400'], return: ['Return', 'bg-pink-500/15 text-pink-400'],
  branch: ['Decision', 'bg-amber-500/15 text-amber-500'], loop: ['Loop', 'bg-sky-500/15 text-sky-400'],
  output: ['Output', 'bg-green-500/15 text-green-500'], input: ['Input', 'bg-cyan-500/15 text-cyan-400'],
  assign: ['Store', 'bg-orange-500/15 text-orange-400'], call: ['Call', 'bg-indigo-500/15 text-indigo-400'], plain: ['Code', 'bg-muted text-muted-foreground'],
};
const GROUP_COLOR = {
  Arithmetic: 'text-orange-400 bg-orange-500/10', Assignment: 'text-emerald-400 bg-emerald-500/10', Comparison: 'text-sky-400 bg-sky-500/10',
  Logical: 'text-purple-400 bg-purple-500/10', Membership: 'text-pink-400 bg-pink-500/10', Identity: 'text-yellow-500 bg-yellow-500/10',
  Bitwise: 'text-slate-400 bg-slate-500/10', 'Function call': 'text-cyan-400 bg-cyan-500/10',
};
const TABS = [['run', 'Run', Terminal], ['lines', 'Line by line', ListOrdered], ['ops', 'Operators', Calculator], ['learn', 'Concepts', BookOpen], ['next', 'Next', Rocket]];

function OperatorsTab({ analysis, notes }) {
  const groups = GROUP_ORDER.map(g => [g, analysis.operators.filter(o => o.group === g)]).filter(([, l]) => l.length);
  if (!analysis.operators.length) return <p className="text-xs text-muted-foreground">No operators found in this code yet. Try adding some maths like <code>a + b</code> or a check like <code>x &gt; 5</code>.</p>;
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Your program uses <b className="text-foreground">{analysis.operators.length} different operator{analysis.operators.length === 1 ? '' : 's'}</b>. An operator is a symbol or word that does something to values. Here is what each one does, with the lines of <i>your</i> code where it appears.</p>
      {groups.map(([g, list]) => (
        <div key={g}>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{g} operators</h3>
          <div className="space-y-2">
            {list.map(o => {
              const symbol = o.op === 'neg' ? '−' : o.op === 'kw=' ? '=' : o.op === 'unpack' ? '*' : o.op;
              const why = notes[o.op] || notes[symbol];
              return (
                <div key={o.op} className="glass rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-sm min-w-[2.25rem] text-center rounded-lg px-2 py-1 ${GROUP_COLOR[o.group] || ''}`}>{symbol}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">{o.name}</p>
                      <p className="text-[10px] text-muted-foreground">used {o.count} time{o.count === 1 ? '' : 's'}</p>
                    </div>
                  </div>
                  <p className="text-xs mt-2">{o.does}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-1 break-words">{o.example}</p>
                  {why && <p className="text-xs mt-2 rounded-lg bg-cyan-500/10 text-cyan-300 px-2 py-1.5"><b>In this project:</b> {why}</p>}
                  <div className="mt-2 space-y-1">
                    {o.lines.map(l => (
                      <p key={l.n} className="text-[11px] font-mono rounded-md bg-black/30 on-dark text-slate-200 px-2 py-1 break-words"><span className="text-slate-500 mr-2">line {l.n}</span>{l.text}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function LinesTab({ analysis, notes, edited }) {
  const rows = analysis.lines.filter(l => l.text.trim());
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Every line of your code, in plain English.{edited ? ' (You changed the code, so these explanations were rebuilt from your version.)' : ''}</p>
      <div className="space-y-1.5">
        {rows.map(l => {
          const [label, cls] = KIND[l.kind] || KIND.plain;
          const indent = (l.text.match(/^ */)?.[0].length || 0) / 4;
          return (
            <div key={l.n} className="glass rounded-xl p-2.5" style={{ marginLeft: Math.min(indent, 4) * 10 }}>
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-muted-foreground font-mono w-5 shrink-0 text-right pt-0.5">{l.n}</span>
                <pre className="flex-1 min-w-0 text-[12px] font-mono whitespace-pre-wrap break-words">{l.text.trim()}</pre>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${cls}`}>{label}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 ml-7">{l.explain}</p>
              {notes[l.n] && <p className="text-xs mt-1.5 ml-7 rounded-lg bg-cyan-500/10 text-cyan-300 px-2 py-1"><b>Why it is here:</b> {notes[l.n]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LearnTab({ project, analysis }) {
  const words = analysis.words;
  return (
    <div className="space-y-4">
      {project.how && (
        <div className="glass rounded-xl p-3">
          <h3 className="text-xs font-bold mb-1">How the program works</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{project.how}</p>
        </div>
      )}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Big ideas in this project</h3>
        <div className="space-y-2">
          {project.concepts.map((c, i) => (
            <div key={i} className="glass rounded-xl p-3">
              <p className="text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.explain}</p>
            </div>
          ))}
        </div>
      </div>
      {words.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Keywords and functions it uses</h3>
          <div className="space-y-1.5">
            {words.map(w => (
              <div key={w.word} className="glass rounded-xl p-2.5 flex gap-2 items-start">
                <span className="font-mono text-xs font-bold text-cyan-400 shrink-0 min-w-[4rem]">{w.word}{w.kind === 'function' || w.kind === 'method' ? '()' : ''}</span>
                <span className="text-xs text-muted-foreground">{w.does} <span className="text-[10px]">Line {w.lines.map(l => l.n).join(', ')}.</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NextTab({ project }) {
  return (
    <div className="space-y-3">
      {project.tryNext.length > 0 && (
        <div className="glass rounded-xl p-3">
          <h3 className="text-xs font-bold mb-1.5 flex items-center gap-1.5"><Rocket className="w-3.5 h-3.5 text-orange-400" /> Make it better: challenges</h3>
          <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal pl-5">
            {project.tryNext.map((t, i) => <li key={i}>{t}</li>)}
          </ol>
          <p className="text-[11px] text-muted-foreground mt-2">Edit the code in the Run tab, press Run, then check the Line by line tab: it explains your new lines too.</p>
        </div>
      )}
      {project.realWorld && (
        <div className="glass rounded-xl p-3">
          <h3 className="text-xs font-bold mb-1">Where this is used in real life</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{project.realWorld}</p>
        </div>
      )}
    </div>
  );
}

export default function PythonProjectMaker() {
  const { selectedClass } = useApp();
  const [idea, setIdea] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState('');
  const [project, setProject] = useState(null);
  const [runKey, setRunKey] = useState(0);
  const [code, setCode] = useState('');
  const [tab, setTab] = useState('run');
  const [saved, setSaved] = useState(readSaved);
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => analyze(code), [code]);
  const edited = !!project && code.trim() !== project.code.trim();
  const noteByLine = useMemo(() => {
    const m = {};
    if (project && !edited) project.notes.forEach(n => { m[n.line] = n.note; });
    return m;
  }, [project, edited]);

  async function make(text = idea) {
    const request = text.trim();
    if (request.length < 3 || busy) return;
    setBusy(true); setMsg(''); setNote('');
    try {
      const out = await makeProject(request, selectedClass);
      if (out.blocked) { setMsg(out.note || 'That idea cannot be built here. Try a different one.'); return; }
      showProject(out.project);
      setNote(out.note || '');
    } catch {
      setMsg('Something went wrong while making the project. Please try again.');
    } finally { setBusy(false); }
  }

  function showProject(p) {
    const arr = (v) => (Array.isArray(v) ? v : []);
    const fixed = { ...p, how: p.how || '', sampleInput: p.sampleInput || '', concepts: arr(p.concepts), notes: arr(p.notes), tryNext: arr(p.tryNext), operatorNotes: p.operatorNotes && typeof p.operatorNotes === 'object' ? p.operatorNotes : {}, realWorld: p.realWorld || '' };
    setProject(fixed); setCode(fixed.code); setTab('run'); setRunKey(k => k + 1);
  }

  function save() {
    if (!project) return;
    const entry = { id: `p${Date.now()}`, title: project.title, summary: project.summary, code, sampleInput: project.sampleInput, how: project.how, concepts: project.concepts, notes: edited ? [] : project.notes, operatorNotes: project.operatorNotes, tryNext: project.tryNext, realWorld: project.realWorld, when: Date.now() };
    const next = [entry, ...saved.filter(s => s.title !== entry.title)].slice(0, 12);
    setSaved(next); writeSaved(next);
  }
  const remove = (id) => { const next = saved.filter(s => s.id !== id); setSaved(next); writeSaved(next); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard may be blocked */ }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-4">
      <BackButton />
      <div className="flex items-center gap-3 animate-slide-up">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 flex items-center justify-center"><Wand2 className="w-5 h-5 text-emerald-400" /></div>
        <div>
          <h1 className="text-xl font-bold">Python Project Maker</h1>
          <p className="text-xs text-muted-foreground">Say what you want to build. Get a working Python program and learn how every line and operator works.</p>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-4">
        <label htmlFor="py-idea" className="text-xs font-bold">What do you want to make?</label>
        <textarea id="py-idea" value={idea} onChange={e => setIdea(e.target.value)} rows={2} maxLength={240}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') make(); }}
          placeholder="e.g. a program that works out my marks percentage and grade"
          className="w-full mt-1.5 glass rounded-xl p-3 text-sm outline-none border border-border resize-none" />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {IDEAS.map(i => (
            <button key={i} onClick={() => { setIdea(i); make(i); }} disabled={busy} className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50">{i}</button>
          ))}
        </div>
        <button onClick={() => make()} disabled={busy || idea.trim().length < 3}
          className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold disabled:opacity-50">
          {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing and testing your program…</> : <><Sparkles className="w-4 h-4" /> Make my project</>}
        </button>
        {msg && <p className="text-xs text-red-400 mt-2">{msg}</p>}
      </div>

      {project && (
        <div className="space-y-3" data-testid="py-project">
          {note && <p className="text-[11px] text-amber-500">{note}</p>}
          <div>
            <h2 className="text-lg font-bold leading-tight">{project.title}</h2>
            <p className="text-xs text-muted-foreground">{project.summary}</p>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar" role="tablist">
            {TABS.map(([id, label, Icon]) => (
              <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold ${tab === id ? 'bg-emerald-600 text-white' : 'glass text-muted-foreground'}`}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          <div hidden={tab !== 'run'}>
            <PythonRunner key={runKey} title={project.title} initialCode={project.code} initialInput={project.sampleInput}
              onCodeChange={setCode} note="Edit anything, then press Run" />
            <div className="flex items-center gap-3 mt-2">
              <button onClick={save} className="text-[11px] font-semibold text-emerald-500">Save project</button>
              <button onClick={copy} className="text-[11px] text-muted-foreground flex items-center gap-1 hover:text-cyan-400">{copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy code</>}</button>
            </div>
          </div>
          {tab === 'lines' && <LinesTab analysis={analysis} notes={noteByLine} edited={edited} />}
          {tab === 'ops' && <OperatorsTab analysis={analysis} notes={project.operatorNotes || {}} />}
          {tab === 'learn' && <LearnTab project={project} analysis={analysis} />}
          {tab === 'next' && <NextTab project={project} />}
        </div>
      )}

      {saved.length > 0 && (
        <div>
          <h2 className="text-sm font-bold mb-2">Your saved projects</h2>
          <div className="space-y-2">
            {saved.map(s => (
              <div key={s.id} className="glass rounded-xl p-3 flex items-center gap-3">
                <button onClick={() => { setIdea(s.title); showProject(s); setNote(''); }} className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold truncate">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{s.summary}</p>
                </button>
                <button onClick={() => remove(s.id)} aria-label={`Delete ${s.title}`} className="text-muted-foreground hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center">Python runs inside the app. It needs the internet the first time it starts.</p>
    </div>
  );
}
