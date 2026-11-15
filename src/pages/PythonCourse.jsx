import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Home, BookOpen, Dumbbell, FolderGit2, ShoppingBag, BarChart3, Youtube, Layers, HelpCircle,
  Check, Play, Loader2, Trophy, RotateCcw, Eye, ChevronRight, ChevronLeft, Rocket, ExternalLink, Flame, Coins, Zap, Terminal, Shuffle, Settings as SettingsIcon,
} from 'lucide-react';
import { LEVELS, LESSONS, PROJECTS, PLAYLIST_URL, lessonsFor, projectsFor } from '@/lib/pycourse/course';
import { TEXT, OUTPUTS } from '@/lib/pycourse/text';
import { runPython } from '@/lib/python/runner';
import PythonRunner from '@/components/learning/PythonRunner';
import LessonVideo from '@/components/learning/LessonVideo';
import CircuitBackground from '@/components/CircuitBackground';
import Shop from '@/pages/Shop';
import Settings from '@/pages/Settings';
import MadeBy from '@/components/MadeBy';
import { useApp } from '@/lib/AppContext';
import { getLevel, localDay } from '@/lib/gamification';

// The Python track keeps its own XP, coins, streak and shop items, separate from the robotics classes.
const TRACK = 'python';
const BASE = '/python-course';
const DAILY_GOAL = 40;
const RANKS = ['Python Newbie', 'Print Pro', 'Variable Wrangler', 'Loop Rider', 'Function Builder', 'List Master', 'Dictionary Detective', 'Class Creator', 'Decorator Wizard', 'Python Ninja'];

// ── course progress on this device ──
const KEY = 'robocraft_pycourse';
const loadP = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
function useCourse() {
  const [p, setP] = useState(() => ({ quiz: {}, task: {}, proj: {}, cards: {}, step: {}, read: {}, ...loadP() }));
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage blocked */ } }, [p]);
  const set = (kind, id, v) => setP(x => ({ ...x, [kind]: { ...(x[kind] || {}), [id]: v } }));
  return [p, set];
}

const lesson = (id) => { const l = LESSONS.find(x => x.id === id); return l ? { ...l, ...TEXT[l.id] } : null; };
const ALL = LESSONS.map(l => lesson(l.id));
const passMark = (l) => Math.ceil(l.quiz.length * 0.6);
const lessonDone = (p, l) => !!p.task[l.id] && (p.quiz[l.id] ?? -1) >= passMark(l);
const looksLikeCode = (o) => o.length < 60 && (/[()[\]{}=*%"']/.test(o) || /^-?[\d.]+$/.test(o));
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// XP + coins + streak for the Python track
function useRewards() {
  const { addXP, updateProgress, getProgressForClass } = useApp();
  const tp = getProgressForClass(TRACK);
  const give = (xp, coins = 0) => {
    const today = localDay();
    const cur = getProgressForClass(TRACK);
    if (cur.lastStreakDate !== today) {
      const streak = cur.lastStreakDate === localDay(-1) ? (cur.streak || 0) + 1 : 1;
      updateProgress(TRACK, { streak, lastStreakDate: today });
    }
    if (coins) updateProgress(TRACK, { coins: (getProgressForClass(TRACK).coins || 0) + coins });
    if (xp) addXP(TRACK, xp);
  };
  const lv = getLevel(tp.xp || 0);
  return { tp, give, lv, rank: RANKS[Math.min(RANKS.length, lv.levelNumber) - 1] };
}

// ── app shell: top bar + RoboCraft-style footer ──
const NAV = [
  ['home', 'Home', Home, BASE],
  ['learn', 'Learn', BookOpen, `${BASE}/learn`],
  ['practice', 'Practice', Dumbbell, `${BASE}/practice`],
  ['projects', 'Projects', FolderGit2, `${BASE}/projects`],
  ['shop', 'Shop', ShoppingBag, `${BASE}/shop`],
  ['progress', 'Progress', BarChart3, `${BASE}/progress`],
];

function PyShell({ tab, title, back, children }) {
  const navigate = useNavigate();
  const { selectedClass } = useApp();
  const { tp, lv } = useRewards();
  const exit = selectedClass ? '/' : '/class-selection';
  return (
    <div className="min-h-screen animated-bg grid-pattern isolate">
      <CircuitBackground />
      <div className="fixed top-0 left-0 right-0 z-40 glass-strong border-b border-cyan-500/10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-2">
          <button onClick={() => navigate(back || exit)} className="w-9 h-9 rounded-full glass flex items-center justify-center shrink-0" aria-label={back ? 'Back' : 'Back to RoboCraft'}><ArrowLeft className="w-4 h-4" /></button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm sm:text-base truncate">{title || <span className="gradient-text">🐍 RoboCraft Python</span>}</p>
          </div>
          <span className="text-xs glass px-2 py-1 rounded-full flex items-center gap-1 font-semibold" title="Day streak"><Flame className="w-3.5 h-3.5 text-orange-500" />{tp.streak || 0}</span>
          <span className="text-xs glass px-2 py-1 rounded-full flex items-center gap-1 font-semibold" title="Coins"><Coins className="w-3.5 h-3.5 text-amber-500" />{tp.coins || 0}</span>
          <span className="text-xs glass px-2 py-1 rounded-full flex items-center gap-1 font-semibold text-cyan-600 dark:text-cyan-400" title="Level"><Zap className="w-3.5 h-3.5" />Lv {lv.levelNumber}</span>
          <button onClick={() => navigate(`${BASE}/settings`)} className="w-8 h-8 rounded-full glass flex items-center justify-center shrink-0" aria-label="Settings"><SettingsIcon className="w-4 h-4" /></button>
        </div>
      </div>
      <main className="min-h-screen" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))', paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
        <div key={tab + (title || '')} className="page-enter max-w-3xl mx-auto px-4 py-4">{children}</div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-cyan-500/10" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-around px-1 py-2">
          {NAV.map(([k, label, Icon, path]) => {
            const active = tab === k;
            return (
              <button key={k} onClick={() => { navigate(path); window.scrollTo(0, 0); }}
                className={`flex flex-col items-center gap-1 px-1.5 sm:px-3 py-1.5 rounded-xl transition-all duration-300 ${active ? 'text-cyan-400 scale-110' : 'text-muted-foreground hover:text-cyan-400/70'}`}>
                <div className={`p-1.5 rounded-lg transition-all ${active ? 'glass neon-glow' : ''}`}><Icon className="w-5 h-5" /></div>
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Ring({ pct, size = 88, stroke = 8, children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth={stroke} fill="none" className="text-muted" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#pyg)" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset .8s' }} />
        <defs><linearGradient id="pyg" x1="0" x2="1"><stop offset="0" stopColor="#06b6d4" /><stop offset="1" stopColor="#2563eb" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

const stepsOf = (l) => [
  ['story', 'Story'], ['ideas', 'Key ideas'],
  ...l.programs.map((pr, i) => [`prog${i}`, pr.level]),
  ['remember', 'Real life'], ['video', 'Video'], ['cards', 'Cards'], ['quiz', 'Quiz'], ['task', 'Task'],
];

// ── HOME ──
function HomeTab() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [p] = useCourse();
  const { tp, lv, rank } = useRewards();
  const done = ALL.filter(l => lessonDone(p, l)).length;
  const nextL = ALL.find(l => !lessonDone(p, l));
  const today = tp.xpDay === localDay() ? tp.xpToday || 0 : 0;
  const name = user?.full_name?.split(' ')[0];
  return (
    <PyShell tab="home">
      <div className="glass-strong rounded-2xl p-4 flex items-center gap-4 mb-4">
        <Ring pct={lv.levelProgress}><span className="text-xl font-extrabold">{lv.levelNumber}</span><span className="text-[9px] text-muted-foreground -mt-0.5">LEVEL</span></Ring>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{name ? `Hi ${name} 👋` : 'Welcome 👋'}</p>
          <p className="text-lg font-extrabold leading-tight">{rank}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{tp.xp || 0} XP{lv.next ? ` · ${lv.xpToNext} XP to level ${lv.levelNumber + 1}` : ' · top level!'}</p>
          <p className="text-xs mt-1">{done} of {ALL.length} lessons complete</p>
        </div>
      </div>

      {nextL && (
        <button onClick={() => navigate(`${BASE}/${nextL.id}`)} className="w-full text-left rounded-2xl p-4 mb-4 text-white bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
          <p className="text-[11px] font-bold opacity-80 tracking-wider">{p.step[nextL.id] ? 'CONTINUE WHERE YOU LEFT' : 'START HERE'}</p>
          <p className="text-xl font-extrabold mt-0.5">{nextL.story.emoji} {nextL.title}</p>
          <p className="text-xs opacity-90 mt-0.5">{nextL.story.title} · step {(p.step[nextL.id] || 0) + 1} of {stepsOf(nextL).length}</p>
          <span className="inline-flex items-center gap-1 mt-3 bg-white/20 rounded-full px-3 py-1.5 text-sm font-bold"><Play className="w-4 h-4" /> {p.step[nextL.id] ? 'Continue' : 'Start lesson'}</span>
        </button>
      )}

      <div className="glass-strong rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between text-sm"><span className="font-bold">🎯 Today's goal</span><span className="text-xs text-muted-foreground">{Math.min(today, DAILY_GOAL)} / {DAILY_GOAL} XP</span></div>
        <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all" style={{ width: `${Math.min(100, (today / DAILY_GOAL) * 100)}%` }} /></div>
        <p className="text-[11px] text-muted-foreground mt-1.5">{today >= DAILY_GOAL ? 'Goal done! Come back tomorrow to grow your streak 🔥' : 'Finish one lesson step, quiz or task to keep your streak going.'}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {LEVELS.map(lvl => {
          const ls = ALL.filter(l => l.level === lvl.id), d = ls.filter(l => lessonDone(p, l)).length;
          return (
            <button key={lvl.id} onClick={() => navigate(`${BASE}/learn#${lvl.id}`)} className="glass-strong rounded-xl p-3 text-left">
              <span className="text-2xl">{lvl.emoji}</span>
              <p className="text-xs font-bold mt-1" style={{ color: lvl.color }}>{lvl.name}</p>
              <p className="text-[10px] text-muted-foreground">{d}/{ls.length} lessons</p>
              <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(d / ls.length) * 100}%`, background: lvl.color }} /></div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => navigate(`${BASE}/practice`)} className="glass-strong rounded-xl p-4 text-left"><Dumbbell className="w-6 h-6 text-violet-500" /><p className="font-bold text-sm mt-1">Practice</p><p className="text-[11px] text-muted-foreground">Mixed quizzes and card review</p></button>
        <button onClick={() => navigate(`${BASE}/projects`)} className="glass-strong rounded-xl p-4 text-left"><Rocket className="w-6 h-6 text-rose-500" /><p className="font-bold text-sm mt-1">Projects</p><p className="text-[11px] text-muted-foreground">{PROJECTS.length} real mini apps to build</p></button>
      </div>
      <MadeBy />
      <p className="text-[11px] text-muted-foreground text-center mt-4">How to earn: lesson read +10 XP · cards +5 · quiz pass +15 XP & 5 coins · task +25 XP & 10 coins · project +50 XP & 25 coins</p>
    </PyShell>
  );
}

// ── LEARN: all lessons by level ──
function LearnTab() {
  const navigate = useNavigate();
  const [p] = useCourse();
  useEffect(() => { const h = window.location.hash.slice(1); if (h) document.getElementById(h)?.scrollIntoView({ behavior: 'smooth' }); }, []);
  return (
    <PyShell tab="learn">
      <h2 className="text-xl font-extrabold">Lessons</h2>
      <p className="text-xs text-muted-foreground mb-4">Each lesson: a real-life story → key ideas → 3 programs (Easy, Medium, Challenge) → Hindi video → cards → quiz → coding task.</p>
      {LEVELS.map(lvl => (
        <section key={lvl.id} id={lvl.id} className="mb-6 scroll-mt-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{lvl.emoji}</span>
            <div><h3 className="font-extrabold" style={{ color: lvl.color }}>{lvl.name}</h3><p className="text-[11px] text-muted-foreground">{lvl.blurb}</p></div>
          </div>
          <div className="space-y-2">
            {ALL.filter(l => l.level === lvl.id).map((l, i) => {
              const ok = lessonDone(p, l), st = p.step[l.id], n = stepsOf(l).length;
              return (
                <button key={l.id} onClick={() => navigate(`${BASE}/${l.id}`)} className="w-full glass-strong rounded-xl p-3 flex items-center gap-3 text-left">
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 relative ${ok ? 'bg-green-500/15' : 'bg-cyan-500/10'}`}>
                    {l.story.emoji}
                    <span className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-background text-white ${ok ? 'bg-green-500' : 'bg-cyan-600'}`}>{ok ? <Check className="w-3 h-3" /> : i + 1}</span>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold truncate">{l.title}</span>
                    <span className="block text-[11px] text-muted-foreground truncate">{l.story.title}</span>
                    {st != null && !ok && <span className="block mt-1 h-1 rounded-full bg-muted overflow-hidden"><span className="block h-full bg-cyan-500" style={{ width: `${((st + 1) / n) * 100}%` }} /></span>}
                  </span>
                  {p.quiz[l.id] != null && <span className="text-[10px] glass px-2 py-0.5 rounded-full">{p.quiz[l.id]}/{l.quiz.length}</span>}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </section>
      ))}
      <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <Youtube className="w-4 h-4 text-red-500" /> Videos: CodeWithHarry, Python 100 Days of Code (Hindi) <ExternalLink className="w-3 h-3" />
      </a>
    </PyShell>
  );
}

// ── shared pieces ──
function CodeTask({ storageKey, prompt, starter, input = '', expect, solution, onPass, passed }) {
  const [code, setCode] = useState(() => { try { return localStorage.getItem(storageKey) ?? starter; } catch { return starter; } });
  const [out, setOut] = useState('');
  const [state, setState] = useState(passed ? 'pass' : '');
  const [showSol, setShowSol] = useState(false);
  const stop = useRef(null);
  useEffect(() => { try { localStorage.setItem(storageKey, code); } catch { /* ignore */ } }, [code, storageKey]);
  useEffect(() => () => stop.current?.(), []);
  const run = () => {
    setState('running'); setOut('');
    let text = '', err = '';
    stop.current = runPython(code, {
      input,
      onEvent: (ev) => {
        if (ev.type === 'out') { text += `${ev.text}\n`; setOut(text); }
        else if (ev.type === 'err') { err += `${ev.text}\n`; setOut(text + err); }
        else if (ev.type === 'done') {
          stop.current = null;
          if (!ev.ok) { setState('error'); return; }
          const ok = expect.every(e => text.includes(e));
          setState(ok ? 'pass' : 'fail');
          if (ok) onPass?.();
        }
      },
    });
  };
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target, s = el.selectionStart;
      setCode(code.slice(0, s) + '    ' + code.slice(el.selectionEnd));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
    }
  };
  return (
    <div className="space-y-3">
      <div className="glass-strong rounded-xl p-3 text-sm"><b>Your task:</b> {prompt}</div>
      <textarea value={code} onChange={e => setCode(e.target.value)} onKeyDown={onKeyDown} spellCheck={false} rows={Math.max(8, code.split('\n').length + 1)}
        className="w-full on-dark rounded-xl bg-[#0d1117] text-[#e6edf3] font-mono text-[13px] p-3 leading-relaxed" aria-label="Your code" />
      {input && <p className="text-[11px] text-muted-foreground">Test input (typed for you): <code>{input.replace(/\n/g, ' ⏎ ')}</code></p>}
      <div className="flex gap-2">
        <button onClick={run} disabled={state === 'running'} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-1.5">
          {state === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Run &amp; check
        </button>
        <button onClick={() => { setCode(starter); setState(''); setOut(''); }} className="px-3 rounded-xl glass" aria-label="Reset code"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => setShowSol(s => !s)} className="px-3 rounded-xl glass text-xs flex items-center gap-1"><Eye className="w-4 h-4" /> {showSol ? 'Hide' : 'Solution'}</button>
      </div>
      {out && <pre className="on-dark rounded-xl bg-black/85 text-green-300 text-[12px] p-3 whitespace-pre-wrap max-h-64 overflow-auto">{out}</pre>}
      {state === 'pass' && <p className="text-sm font-bold text-green-600 flex items-center gap-1.5"><Trophy className="w-4 h-4" /> Correct! Your program works.</p>}
      {state === 'fail' && <p className="text-sm text-amber-600">It ran, but the output is not right yet. It should contain: {expect.map(e => <code key={e} className="mx-1 px-1 rounded bg-muted">{e}</code>)}</p>}
      {state === 'error' && <p className="text-sm text-red-500">Your program has an error. Read the red message above: it says which line and what went wrong.</p>}
      {showSol && <pre className="on-dark rounded-xl bg-[#0d1117] text-[#e6edf3] text-[12px] p-3 whitespace-pre-wrap">{solution}</pre>}
    </div>
  );
}

function Flashcards({ cards, onDone }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const c = cards[i];
  const next = () => { setFlip(false); if (i + 1 >= cards.length) { onDone?.(); setI(0); } else setI(i + 1); };
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2 text-center">Card {i + 1} of {cards.length} · tap the card to flip it</p>
      <button onClick={() => setFlip(f => !f)} className="w-full min-h-[190px] rounded-2xl p-6 text-center flex items-center justify-center border-2 transition-colors"
        style={{ background: flip ? 'rgb(var(--ac-500) / 0.12)' : 'hsl(var(--card))', borderColor: 'rgb(var(--ac-500) / 0.4)' }}>
        <span className="block">
          {c.from && <span className="block text-[10px] text-muted-foreground mb-1">{c.from}</span>}
          <span className="block text-[10px] font-bold tracking-widest text-muted-foreground mb-2">{flip ? 'ANSWER' : 'QUESTION'}</span>
          <span className={flip ? 'text-base leading-relaxed' : 'text-lg font-bold'}>{flip ? c.back : c.front}</span>
          {!flip && <span className="block text-[11px] text-muted-foreground mt-3">Think of your answer, then tap to check</span>}
        </span>
      </button>
      <div className="flex gap-2 mt-3">
        <button onClick={() => { setFlip(false); setI(Math.max(0, i - 1)); }} disabled={i === 0} className="flex-1 py-2 rounded-xl glass text-sm disabled:opacity-40">Previous</button>
        <button onClick={next} className="flex-1 py-2 rounded-xl bg-cyan-600 text-white text-sm font-bold">{i + 1 >= cards.length ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
}

function Quiz({ questions, onScore, best, pass, retryHint }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  if (finished) {
    const ok = score >= pass;
    return (
      <div className="text-center py-6">
        <p className="text-4xl mb-2">{ok ? '🎉' : '💪'}</p>
        <p className="text-xl font-extrabold">{score} / {questions.length}</p>
        <p className="text-sm text-muted-foreground mb-4">{ok ? 'Great job, you passed!' : `${retryHint || 'Look at the programs again and retry.'} You need ${pass}.`}</p>
        <button onClick={() => { setI(0); setPick(null); setScore(0); setFinished(false); }} className="px-5 py-2 rounded-xl glass text-sm">Try again</button>
      </div>
    );
  }
  const q = questions[i];
  const answered = pick != null;
  const choose = (k) => { if (answered) return; setPick(k); if (k === q.answer) setScore(s => s + 1); };
  const next = () => {
    if (i + 1 >= questions.length) { setFinished(true); onScore(score); }
    else { setI(i + 1); setPick(null); }
  };
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-cyan-500 transition-all" style={{ width: `${(i / questions.length) * 100}%` }} /></div>
        <span className="text-[11px] text-muted-foreground">{i + 1}/{questions.length}{best != null ? ` · best ${best}` : ''}</span>
      </div>
      {q.from && <p className="text-[10px] font-bold text-violet-500 mb-1">FROM: {q.from.toUpperCase()}</p>}
      <p className="font-bold mb-3">{q.q}</p>
      {q.code && <pre className="on-dark rounded-xl bg-[#0d1117] text-[#e6edf3] text-[13px] p-3 mb-3 whitespace-pre-wrap font-mono">{q.code}</pre>}
      <div className="space-y-2">
        {q.options.map((o, k) => {
          const right = answered && k === q.answer, wrong = answered && k === pick && k !== q.answer;
          return (
            <button key={k} onClick={() => choose(k)} className={`w-full text-left rounded-xl px-4 py-3 text-sm border ${right ? 'border-green-500 bg-green-500/15' : wrong ? 'border-red-500 bg-red-500/10' : 'border-border glass-strong'}`}>
              <span className={looksLikeCode(o) ? 'font-mono' : ''}>{o}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3">
          <p className={`text-sm ${pick === q.answer ? 'text-green-600' : 'text-red-500'}`}><b>{pick === q.answer ? 'Correct!' : 'Not quite.'}</b> {q.why}</p>
          <button onClick={next} className="mt-3 w-full py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-bold">{i + 1 >= questions.length ? 'See score' : 'Next question'}</button>
        </div>
      )}
    </div>
  );
}

const LEVEL_STYLE = {
  Easy: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/40',
  Medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40',
  Challenge: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40',
};

function ProgramStep({ lessonId, prog, index, output }) {
  const code = prog.walk.map(([c]) => c).join('\n');
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${LEVEL_STYLE[prog.level]}`}>PROGRAM {index + 1} OF 3 · {prog.level.toUpperCase()}</span>
      </div>
      <div>
        <h3 className="text-lg font-extrabold">{prog.title}</h3>
        <p className="text-sm text-muted-foreground">You will learn: {prog.goal}</p>
      </div>
      <div className="glass-strong rounded-2xl p-3">
        <p className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 tracking-wide mb-2">READ IT LINE BY LINE</p>
        <div className="space-y-1.5">
          {prog.walk.map(([c, m], k) => (
            <div key={k} className="rounded-lg overflow-hidden border border-border">
              <div className="flex on-dark bg-[#0d1117]">
                <span className="text-[11px] text-[#6e7681] font-mono px-2 py-1.5 select-none w-7 text-right shrink-0">{k + 1}</span>
                <pre className="text-[#e6edf3] text-[12px] py-1.5 pr-3 whitespace-pre-wrap font-mono flex-1">{c}</pre>
              </div>
              {m && <p className="text-[12.5px] px-3 py-1.5 bg-muted/40">{m}</p>}
            </div>
          ))}
        </div>
      </div>
      {prog.input && <p className="text-xs glass rounded-lg px-3 py-2">⌨️ This program asks for input. In the example we typed: <b>{prog.input.split('\n').join(', ')}</b></p>}
      {output != null && (
        <div className="rounded-2xl overflow-hidden border border-border">
          <p className="text-[11px] font-bold tracking-wide px-3 py-1.5 bg-muted/60 flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> WHAT PYTHON PRINTS</p>
          <pre className="on-dark bg-black/90 text-green-300 text-[12.5px] p-3 whitespace-pre-wrap font-mono">{output || '(nothing)'}</pre>
        </div>
      )}
      <PythonRunner key={`${lessonId}-${index}`} title="Try it: press Run, then change a value and run again" initialCode={code} initialInput={prog.input || ''} />
    </div>
  );
}

// ── one lesson, step by step ──
function LessonPage({ id }) {
  const navigate = useNavigate();
  const l = lesson(id);
  const [p, set] = useCourse();
  const { give } = useRewards();
  const steps = useMemo(() => (l ? stepsOf(l) : []), [l?.id]);
  const [s, setS] = useState(() => Math.min(p.step[id] || 0, steps.length - 1));
  const bar = useRef(null);
  useEffect(() => { window.scrollTo(0, 0); bar.current?.querySelector('[data-on="1"]')?.scrollIntoView({ inline: 'center', block: 'nearest' }); }, [s]);
  if (!l) return <PyShell tab="learn" title="Lesson"><p>Lesson not found.</p></PyShell>;
  const go = (n) => {
    setS(n);
    if (n > (p.step[id] ?? -1)) set('step', id, n);
    if (steps[n][0] === 'video' && !p.read[id]) { set('read', id, true); give(10); }
  };
  const [key] = steps[s];
  const idx = LESSONS.findIndex(x => x.id === id), next = LESSONS[idx + 1];
  const lv = LEVELS.find(x => x.id === l.level);
  const pass = passMark(l);
  const quizStep = steps.findIndex(([k]) => k === 'quiz');

  return (
    <PyShell tab="learn" title={l.title} back={`${BASE}/learn`}>
      <p className="text-[11px] font-bold mb-2" style={{ color: lv.color }}>{lv.emoji} {lv.name.toUpperCase()} · LESSON {lessonsFor(l.level).findIndex(x => x.id === id) + 1}</p>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2"><div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all" style={{ width: `${((s + 1) / steps.length) * 100}%` }} /></div>
      <div ref={bar} className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
        {steps.map(([k, label], n) => {
          const tick = (k === 'quiz' && (p.quiz[id] ?? -1) >= pass) || (k === 'task' && p.task[id]) || (k === 'cards' && p.cards[id]) || (n < quizStep && n <= (p.step[id] ?? -1) && n !== s);
          return (
            <button key={k} data-on={n === s ? '1' : '0'} onClick={() => go(n)} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${n === s ? 'bg-cyan-600 text-white' : 'glass-strong'}`}>
              {tick ? <Check className="w-3 h-3 text-green-500" /> : <span className="opacity-60">{n + 1}</span>} {label}
            </button>
          );
        })}
      </div>

      {key === 'story' && (
        <div className="rounded-2xl p-5 border-2 border-amber-400/40 bg-amber-400/10">
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wide">THINK OF IT LIKE THIS</p>
          <p className="text-5xl my-3">{l.story.emoji}</p>
          <p className="text-lg font-extrabold">{l.story.title}</p>
          <p className="text-[15px] leading-relaxed mt-2">{l.story.text}</p>
        </div>
      )}

      {key === 'ideas' && (
        <div className="glass-strong rounded-2xl p-4">
          <p className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 tracking-wide mb-3">KEY IDEAS, IN SIMPLE WORDS</p>
          <ol className="space-y-3">
            {l.simple.map((t, k) => (
              <li key={k} className="flex gap-2.5 text-sm leading-relaxed"><span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">{k + 1}</span><span>{t}</span></li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground mt-4">Next you will see these ideas in 3 programs, from easy to challenge.</p>
        </div>
      )}

      {key.startsWith('prog') && <ProgramStep lessonId={id} index={+key.slice(4)} prog={l.programs[+key.slice(4)]} output={OUTPUTS[id]?.[+key.slice(4)]} />}

      {key === 'remember' && (
        <div className="space-y-3">
          <div className="rounded-2xl p-4 border-2 border-green-500/40 bg-green-500/10">
            <p className="text-[11px] font-bold text-green-700 dark:text-green-400 tracking-wide">REMEMBER THIS ONE LINE</p>
            <p className="text-base font-bold mt-1">{l.remember}</p>
          </div>
          <div className="glass-strong rounded-2xl p-4">
            <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400 tracking-wide mb-2">WHERE YOU SEE THIS IN REAL LIFE</p>
            <ul className="space-y-2">{l.used.map(u => <li key={u} className="text-sm flex gap-2"><span>🌍</span><span>{u}</span></li>)}</ul>
          </div>
        </div>
      )}

      {key === 'video' && (
        <div className="space-y-3">
          <p className="text-sm">Now watch the same topic explained in Hindi. You already know the ideas, so the video will feel easy.</p>
          <LessonVideo lesson={{ videoUrl: l.video.url, videoTitle: `${l.video.title} · CodeWithHarry` }} />
          {l.extraVideo && <LessonVideo lesson={{ videoUrl: l.extraVideo.url, videoTitle: `${l.extraVideo.title} · CodeWithHarry` }} />}
          <p className="text-[11px] text-muted-foreground text-center">Hindi videos by CodeWithHarry (YouTube). Videos need the internet.</p>
        </div>
      )}

      {key === 'cards' && <Flashcards cards={l.cards} onDone={() => { if (!p.cards[id]) { set('cards', id, true); give(5); } go(s + 1); }} />}
      {key === 'quiz' && (
        <>
          <p className="text-xs glass rounded-lg px-3 py-2 mb-3">Every question is about this lesson's key ideas and its 3 programs. Pass mark: {pass} of {l.quiz.length}.</p>
          <Quiz key={id} questions={l.quiz} best={p.quiz[id]} pass={pass} retryHint="Open the Easy, Medium and Challenge steps again — every answer is in them."
            onScore={(sc) => { const prev = p.quiz[id] ?? -1; if (sc > prev) set('quiz', id, sc); if (sc >= pass && prev < pass) give(15, 5); }} />
        </>
      )}
      {key === 'task' && <CodeTask key={id} storageKey={`pycourse_code_${id}`} {...l.task} passed={!!p.task[id]} onPass={() => { if (!p.task[id]) { set('task', id, true); give(25, 10); } }} />}

      <div className="mt-5 flex gap-2">
        <button onClick={() => go(s - 1)} disabled={s === 0} className="px-4 py-3 rounded-xl glass text-sm flex items-center gap-1 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /> Back</button>
        {s < steps.length - 1 ? (
          <button onClick={() => go(s + 1)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1">
            Next: {steps[s + 1][1]} <ChevronRight className="w-4 h-4" />
          </button>
        ) : next ? (
          <button onClick={() => navigate(`${BASE}/${next.id}`)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1">
            Next lesson: {next.title} <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => navigate(`${BASE}/projects`)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold">Build the projects 🚀</button>
        )}
      </div>
    </PyShell>
  );
}

// ── PRACTICE: mixed quizzes and card review across lessons ──
function PracticeTab() {
  const [p] = useCourse();
  const { give } = useRewards();
  const [scope, setScope] = useState('mine');
  const [mode, setMode] = useState(null); // quiz | cards
  const [round, setRound] = useState(0);
  const pool = useMemo(() => {
    const opened = ALL.filter(l => p.step[l.id] != null || p.quiz[l.id] != null);
    return scope === 'mine' ? (opened.length ? opened : ALL.filter(l => l.level === 'beginner').slice(0, 3)) : ALL.filter(l => l.level === scope);
  }, [scope, p.step, p.quiz]);
  const questions = useMemo(() => shuffle(pool.flatMap(l => l.quiz.map(q => ({ ...q, from: l.title })))).slice(0, 10), [pool, round]);
  const cards = useMemo(() => shuffle(pool.flatMap(l => l.cards.map(c => ({ ...c, from: l.title })))).slice(0, 20), [pool, round]);
  const scopes = [['mine', 'Lessons I opened'], ...LEVELS.map(x => [x.id, x.name])];
  return (
    <PyShell tab="practice">
      <h2 className="text-xl font-extrabold">Practice</h2>
      <p className="text-xs text-muted-foreground mb-3">Mix questions from many lessons. This is how you really remember.</p>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
        {scopes.map(([k, label]) => (
          <button key={k} onClick={() => { setScope(k); setRound(r => r + 1); }} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${scope === k ? 'bg-cyan-600 text-white' : 'glass-strong'}`}>{label}</button>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mb-3">From: {pool.map(l => l.title).join(', ')}</p>
      {!mode && (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setMode('quiz')} className="glass-strong rounded-2xl p-4 text-left"><HelpCircle className="w-7 h-7 text-cyan-500" /><p className="font-bold mt-2">Mixed quiz</p><p className="text-[11px] text-muted-foreground">{Math.min(10, questions.length)} questions · 7+ right = 20 XP & 5 coins</p></button>
          <button onClick={() => setMode('cards')} className="glass-strong rounded-2xl p-4 text-left"><Layers className="w-7 h-7 text-violet-500" /><p className="font-bold mt-2">Card review</p><p className="text-[11px] text-muted-foreground">{cards.length} shuffled cards · +5 XP</p></button>
        </div>
      )}
      {mode && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setMode(null)} className="text-xs glass px-3 py-1.5 rounded-full flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5" /> Back</button>
            <button onClick={() => setRound(r => r + 1)} className="text-xs glass px-3 py-1.5 rounded-full flex items-center gap-1"><Shuffle className="w-3.5 h-3.5" /> New set</button>
          </div>
          {mode === 'quiz' && <Quiz key={`q${round}${scope}`} questions={questions} pass={Math.min(7, questions.length)} retryHint="Revise those lessons and try a new set."
            onScore={(sc) => { if (sc >= Math.min(7, questions.length)) give(20, 5); }} />}
          {mode === 'cards' && <Flashcards key={`c${round}${scope}`} cards={cards} onDone={() => { give(5); setMode(null); }} />}
        </div>
      )}
    </PyShell>
  );
}

// ── PROJECTS ──
function ProjectsTab() {
  const navigate = useNavigate();
  const [p] = useCourse();
  return (
    <PyShell tab="projects">
      <h2 className="text-xl font-extrabold">Projects</h2>
      <p className="text-xs text-muted-foreground mb-4">Real mini apps that use everything from a level. The app checks your output. +50 XP and 25 coins each.</p>
      {LEVELS.map(lvl => (
        <section key={lvl.id} className="mb-5">
          <h3 className="font-extrabold mb-2" style={{ color: lvl.color }}>{lvl.emoji} {lvl.name}</h3>
          <div className="space-y-2">
            {projectsFor(lvl.id).map(pr => (
              <button key={pr.id} onClick={() => navigate(`${BASE}/project/${pr.id}`)} className="w-full glass-strong rounded-xl p-3 flex items-center gap-3 text-left">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.proj[pr.id] ? 'bg-green-500 text-white' : ''}`} style={p.proj[pr.id] ? {} : { background: `${lvl.color}22`, color: lvl.color }}>{p.proj[pr.id] ? <Check className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}</span>
                <span className="flex-1 min-w-0"><span className="block text-sm font-semibold">{pr.title}</span><span className="block text-[11px] text-muted-foreground line-clamp-2">{pr.brief}</span></span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
      ))}
    </PyShell>
  );
}

function ProjectPage({ id }) {
  const pr = PROJECTS.find(x => x.id === id);
  const [p, set] = useCourse();
  const { give } = useRewards();
  if (!pr) return <PyShell tab="projects" title="Project"><p>Project not found.</p></PyShell>;
  const lv = LEVELS.find(l => l.id === pr.level);
  return (
    <PyShell tab="projects" title={pr.title} back={`${BASE}/projects`}>
      <p className="text-[11px] font-bold mb-2" style={{ color: lv.color }}>{lv.emoji} {lv.name.toUpperCase()} PROJECT</p>
      <div className="glass-strong rounded-2xl p-4 mb-4">
        <p className="text-sm mb-3">{pr.brief}</p>
        <p className="text-xs font-bold mb-1">Steps</p>
        <ol className="list-decimal pl-5 text-sm space-y-1">{pr.steps.map(st => <li key={st}>{st}</li>)}</ol>
      </div>
      {pr.video && <div className="mb-4"><LessonVideo lesson={{ videoUrl: pr.video.url, videoTitle: `${pr.video.title} · CodeWithHarry` }} /></div>}
      <CodeTask storageKey={`pycourse_proj_${id}`} prompt="Build it below. When the output is right, the project is complete." starter={pr.starter} input={pr.input} expect={pr.expect} solution={pr.solution}
        passed={!!p.proj[id]} onPass={() => { if (!p.proj[id]) { set('proj', id, true); give(50, 25); } }} />
    </PyShell>
  );
}

// ── PROGRESS ──
function ProgressTab() {
  const navigate = useNavigate();
  const [p] = useCourse();
  const { tp, lv, rank } = useRewards();
  const stats = [
    ['📘', 'Lessons done', ALL.filter(l => lessonDone(p, l)).length, ALL.length],
    ['✅', 'Quizzes passed', ALL.filter(l => (p.quiz[l.id] ?? -1) >= passMark(l)).length, ALL.length],
    ['💻', 'Tasks solved', Object.values(p.task).filter(Boolean).length, ALL.length],
    ['🚀', 'Projects built', Object.values(p.proj).filter(Boolean).length, PROJECTS.length],
    ['🃏', 'Card decks', Object.values(p.cards).filter(Boolean).length, ALL.length],
    ['🔥', 'Day streak', tp.streak || 0, null],
  ];
  return (
    <PyShell tab="progress">
      <div className="glass-strong rounded-2xl p-5 flex flex-col items-center text-center mb-4">
        <Ring pct={lv.levelProgress} size={120} stroke={10}><span className="text-3xl font-extrabold">{lv.levelNumber}</span><span className="text-[10px] text-muted-foreground">LEVEL</span></Ring>
        <p className="text-lg font-extrabold mt-2">{rank}</p>
        <p className="text-xs text-muted-foreground">{tp.xp || 0} XP · {tp.coins || 0} coins{lv.next ? ` · ${lv.xpToNext} XP to next level` : ''}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {stats.map(([e, label, v, of]) => (
          <div key={label} className="glass-strong rounded-xl p-3 text-center">
            <p className="text-xl">{e}</p><p className="text-lg font-extrabold leading-tight">{v}{of ? <span className="text-xs text-muted-foreground">/{of}</span> : ''}</p><p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      {LEVELS.map(lvl => (
        <section key={lvl.id} className="mb-4">
          <h3 className="font-bold text-sm mb-2" style={{ color: lvl.color }}>{lvl.emoji} {lvl.name}</h3>
          <div className="glass-strong rounded-xl divide-y divide-border">
            {ALL.filter(l => l.level === lvl.id).map(l => {
              const ok = lessonDone(p, l);
              return (
                <button key={l.id} onClick={() => navigate(`${BASE}/${l.id}`)} className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${ok ? 'bg-green-500 text-white' : 'bg-muted'}`}>{ok && <Check className="w-3 h-3" />}</span>
                  <span className="flex-1 truncate">{l.title}</span>
                  <span className="text-[10px] text-muted-foreground">{p.task[l.id] ? '💻' : ''} {p.quiz[l.id] != null ? `quiz ${p.quiz[l.id]}/${l.quiz.length}` : '—'}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </PyShell>
  );
}

function ShopTab() {
  return (
    <PyShell tab="shop">
      <Shop classId={TRACK} hideBack />
    </PyShell>
  );
}

function SettingsTab() {
  return <PyShell tab="settings"><Settings /></PyShell>;
}

const TAB_PAGES = { learn: LearnTab, practice: PracticeTab, projects: ProjectsTab, shop: ShopTab, progress: ProgressTab, settings: SettingsTab };

export default function PythonCourse() {
  const { lessonId, projectId } = useParams();
  if (projectId) return <ProjectPage key={projectId} id={projectId} />;
  if (lessonId && TAB_PAGES[lessonId]) { const T = TAB_PAGES[lessonId]; return <T />; }
  if (lessonId) return <LessonPage key={lessonId} id={lessonId} />;
  return <HomeTab />;
}
