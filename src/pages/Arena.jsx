import ErrorBoundary from '@/components/ErrorBoundary';
import React, { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { TASKS, getTask } from '@/lib/arena/tasks';
import { ArenaBoard, ROBOT_PINS, ARM_PINS } from '@/lib/arena/world';
import { runSketch } from '@/lib/arduino/runtime';
import BackButton from '@/components/BackButton';
import ShareScoreButton from '@/components/share/ShareScoreButton';
import { Play, Square, RotateCcw, Bot, Eye, Code2, Terminal, Cpu, CheckCircle2, XCircle, Lightbulb, Video, Map as MapIcon, Sparkles, Loader2, Wrench, Package } from 'lucide-react';
import { designRobot, makeTask, fixCode } from '@/lib/arena/customRobot';
import { standardKitConnections, customRobotConnections, armKitConnections } from '@/lib/arena/wiringConnections';
const CircuitDiagram = lazy(() => import('@/components/buildsheet/CircuitDiagram'));
const WireList = lazy(() => import('@/components/buildsheet/CircuitDiagram').then(m => ({ default: m.WireList })));
const FullscreenCircuit = lazy(() => import('@/components/buildsheet/FullscreenCircuit'));

const ArenaView = lazy(() => import('@/components/arena/ArenaView'));

const codeKey = (id) => `robocraft_arena_code_${id}`;
const load = (id) => { try { return localStorage.getItem(codeKey(id)); } catch { return null; } };
const save = (id, v) => { try { localStorage.setItem(codeKey(id), v); } catch { /* ignore */ } };

function CodeEditor({ value, onChange, errorLine }) {
  // Never trust the caller: a task with no sample solution used to hand this
  // null and take the whole Arena down.
  const text = typeof value === 'string' ? value : '';
  const lines = text.split('\n').length;
  const gutter = useRef(null);
  return (
    <div className="flex rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] on-dark text-[12.5px] font-mono leading-[1.55]" style={{ height: 360 }}>
      <div ref={gutter} className="select-none text-right px-2 py-2 text-slate-500 bg-[#0b0f14] on-dark overflow-hidden">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={errorLine === i + 1 ? 'text-red-400 font-bold' : ''}>{i + 1}</div>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => { if (gutter.current) gutter.current.scrollTop = e.target.scrollTop; }}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const t = e.target, s = t.selectionStart;
            onChange(text.slice(0, s) + "  " + text.slice(t.selectionEnd));
            requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2; });
          }
        }}
        spellCheck={false} autoCapitalize="off" autoCorrect="off"
        className="flex-1 bg-transparent text-slate-100 p-2 outline-none resize-none whitespace-pre overflow-auto"
      />
    </div>
  );
}

function TaskList({ onPick, results, selectedClass }) {
  const tasks = TASKS.filter(t => t.classes.includes(selectedClass));
  const done = tasks.filter(t => results[t.id]?.passed).length;
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-8">
      <div className="flex items-center gap-2 mb-1">
        <BackButton />
        <h1 className="text-lg font-bold flex items-center gap-2"><Bot className="w-5 h-5 text-cyan-500" /> Robot Arena 3D</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Write real Arduino code, press Run, and watch your robot obey it in 3-D. Same code works on a real Arduino Uno + L298N robot. {done > 0 && <b>{done}/{tasks.length} completed.</b>}
      </p>
      <button onClick={() => onPick('custom')} className="w-full rounded-2xl p-4 mb-3 flex items-center gap-3 text-left text-white bg-gradient-to-r from-violet-600 to-cyan-600 shadow-lg">
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0"><Sparkles className="w-6 h-6" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">Build your own robot</p>
          <p className="text-[11px] opacity-90 mt-0.5">Say what you want. AI designs it, then it drives in 3-D with its code, wiring and parts list.</p>
        </div>
      </button>
      <div className="space-y-2.5">
        {tasks.map(t => {
          const r = results[t.id];
          return (
            <button key={t.id} onClick={() => onPick(t.id)} className="w-full glass-strong rounded-2xl p-3.5 flex items-start gap-3 text-left">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r?.passed ? 'bg-green-500/15 text-green-500' : 'bg-cyan-500/15 text-cyan-500'}`}>
                {r?.passed ? <CheckCircle2 className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400">{t.badge}</span>
                  {r?.passed && r.best && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-500">Best {(r.best / 1000).toFixed(1)} s</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="glass rounded-2xl p-3.5 mt-5 text-[11px] text-muted-foreground">
        <p className="font-semibold text-foreground text-xs mb-1 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> How it works</p>
        Your sketch is run line-by-line by a built-in Arduino simulator (setup(), loop(), delay, digitalRead/Write, analogRead/Write, pulseIn, Servo, Serial). The robot follows real physics — motor lag, sensor noise and collisions — so code that works here is a good start for real hardware.
      </div>
    </div>
  );
}

export default function Arena() {
  const { selectedClass, getProgressForClass, updateProgress, addXP } = useApp();
  const [params, setParams] = useSearchParams();
  const taskId = params.get('task');
  const task = taskId && taskId !== 'custom' ? getTask(taskId) : null;
  const results = getProgressForClass(selectedClass).arena || {};

  if (taskId === 'custom') return <CustomRobot results={results} onBack={() => setParams({})} onPass={() => {}} />;
  if (!task) return <TaskList results={results} selectedClass={selectedClass} onPick={(id) => setParams({ task: id })} />;
  return <TaskScreen key={task.id} task={task} results={results} onBack={() => setParams({})}
    onPass={(ms) => {
      const cur = getProgressForClass(selectedClass).arena || {};
      const prev = cur[task.id];
      const first = !prev?.passed;
      updateProgress(selectedClass, { arena: { ...cur, [task.id]: { passed: true, best: prev?.best ? Math.min(prev.best, ms) : ms, at: Date.now() } } });
      if (first) addXP(selectedClass, 25);
    }} />;
}

const EXAMPLES = [
  'A robotic arm that picks up objects',
  'A security robot that sounds an alarm',
  'A line follower for my school project',
  'A robot that explores a room without bumping',
];
const LAST_KEY = 'robocraft_arena_custom_last';

function CustomRobot({ results, onBack, onPass }) {
  const [text, setText] = useState(() => { try { return localStorage.getItem(LAST_KEY) || ''; } catch { return ''; } });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [task, setTask] = useState(null);
  const [note, setNote] = useState('');

  async function make() {
    const request = text.trim();
    if (request.length < 3 || busy) return;
    setBusy(true); setMsg('');
    try { localStorage.setItem(LAST_KEY, request); } catch { /* optional */ }
    try {
      const out = await designRobot(request);
      if (out.blocked) { setMsg(out.note); return; }
      setNote(out.note || '');
      setTask(makeTask(out.design));
    } catch {
      setMsg('Something went wrong while designing. Please try again.');
    } finally { setBusy(false); }
  }

  if (task) {
    return (
      <>
        {note && <div className="max-w-3xl mx-auto px-4 pt-3 text-[11px] text-amber-500">{note}</div>}
        <TaskScreen key={task.id} task={task} results={results} onBack={() => setTask(null)} onPass={onPass} backLabel="← New robot" />
      </>
    );
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-10">
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onBack} className="text-xs text-cyan-500">← All tasks</button>
      </div>
      <h1 className="text-lg font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-500" /> Build your own robot</h1>
      <p className="text-xs text-muted-foreground mt-1 mb-3">Describe the robot you imagine. You get a parts list, a wiring table and Arduino code, and the robot drives in the 3-D arena running that code.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 300))} rows={3} placeholder="e.g. a robot arm that picks up things"
        aria-label="Describe your robot" className="w-full rounded-xl glass-strong p-3 text-sm outline-none bg-transparent" />
      <div className="flex flex-wrap gap-1.5 mt-2">
        {EXAMPLES.map(x => <button key={x} onClick={() => setText(x)} className="text-[11px] px-2.5 py-1 rounded-full glass-strong">{x}</button>)}
      </div>
      {msg && <p className="mt-3 text-xs text-red-400" role="alert">{msg}</p>}
      <button onClick={make} disabled={busy || text.trim().length < 3}
        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
        {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Designing your robot…</> : <><Sparkles className="w-4 h-4" /> Build it</>}
      </button>
    </div>
  );
}

function TaskScreen({ task, results, onBack, onPass, backLabel = '← All tasks' }) {
  const boardRef = useRef(null);
  if (!boardRef.current) boardRef.current = new ArenaBoard(task.map());
  const [code, setCode] = useState(() => load(task.id) || task.starter || '');
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState({ state: 'idle', msg: 'Press Run to upload your code to the robot.' });
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [tab, setTab] = useState('code');
  const [bigWiring, setBigWiring] = useState(false);
  const [wireItems, setWireItems] = useState([]);
  const [wireHi, setWireHi] = useState(null);
  const [cam, setCam] = useState(task.id === 'bin' || task.body === 'arm' ? 'free' : 'chase');
  const [serial, setSerial] = useState([]);
  const [error, setError] = useState(null);
  const [usedSolution, setUsedSolution] = useState(false);
  const [fixing, setFixing] = useState(false);
  const isCustom = !!task.plan;
  const handle = useRef(null);
  const serialBuf = useRef([]);
  const passedRef = useRef(false);

  useEffect(() => { const t = setTimeout(() => save(task.id, code), 400); return () => clearTimeout(t); }, [code, task.id]);
  useEffect(() => () => handle.current?.stop(), []);
  useEffect(() => { handle.current?.setSpeed(speed); }, [speed]);

  // flush serial + time to the UI ~8×/s
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      if (serialBuf.current.length) { const add = serialBuf.current; serialBuf.current = []; setSerial(s => [...s, ...add].slice(-200)); }
      setTime(handle.current?.time || 0);
    }, 120);
    return () => clearInterval(iv);
  }, [running]);

  function reset() {
    handle.current?.stop(); handle.current = null;
    boardRef.current.reset();
    setRunning(false); setTime(0); setError(null);
    setStatus({ state: 'idle', msg: 'Press Run to upload your code to the robot.' });
  }

  function run() {
    reset();
    const b = boardRef.current;
    const st = task.init?.(b) || {};
    passedRef.current = false;
    setSerial([]); serialBuf.current = [];
    b.onSerial = (line) => serialBuf.current.push(line);
    let last = { state: 'running', msg: 'Running…' };
    setStatus(last); setRunning(true);
    const h = runSketch(code, b, {
      speed,
      onError: (e) => { setError(e); },
      onTime: () => {
        const r = task.evaluate(b, st);
        if (r.state !== last.state || r.msg !== last.msg) { last = r; setStatus(r); }
        if (r.state === 'pass' && !passedRef.current) {
          passedRef.current = true;
          if (!usedSolution) onPass(b.time);
          h.stop();
        } else if (r.state === 'fail') h.stop();
      },
    });
    handle.current = h;
    h.done.then((res) => {
      if (handle.current !== h) return;
      setRunning(false);
      if (serialBuf.current.length) { const add = serialBuf.current; serialBuf.current = []; setSerial(s => [...s, ...add].slice(-200)); }
      setTime(h.time);
      if (res?.error) { setError(res.error); setStatus({ state: 'fail', msg: 'Your code has an error — see below.' }); setTab('code'); }
    });
  }

  function stop() {
    handle.current?.stop();
    setRunning(false);
    setStatus(s => (s.state === 'running' ? { state: 'idle', msg: 'Stopped.' } : s));
  }

  async function aiFix() {
    if (!error || fixing) return;
    setFixing(true);
    const fixed = await fixCode(code, `${error.line ? `line ${error.line}: ` : ''}${error.message}`, task.body === 'arm' ? 'arm' : 'obstacles');
    setFixing(false);
    if (fixed) { setCode(fixed); setError(null); setStatus({ state: 'idle', msg: 'Code repaired. Press Run.' }); }
    else setStatus({ state: 'fail', msg: 'The AI could not repair it this time. Read the error line and try fixing it yourself.' });
  }

  const hasSolution = typeof task.solution === 'string' && task.solution.trim().length > 0;
  const showSolution = () => {
    if (!hasSolution) return;
    if (!window.confirm('Replace your code with the sample solution? (Completing a task with the sample solution does not earn XP.)')) return;
    setCode(task.solution); setUsedSolution(true); setError(null);
  };

  const statusColor = { pass: 'bg-green-500/15 text-green-500 border-green-500/30', fail: 'bg-red-500/15 text-red-400 border-red-500/30', running: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', idle: 'bg-muted text-muted-foreground border-transparent' }[status.state];
  const best = results[task.id]?.best;
  const pinRows = useMemo(() => Object.entries(task.body === 'arm' ? ARM_PINS : ROBOT_PINS), [task.body]);
  const wiringConns = useMemo(
    () => (task.body === 'arm' ? armKitConnections() : isCustom ? customRobotConnections(task.plan?.wiring) : standardKitConnections(task.id)),
    [isCustom, task],
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-3 pb-10">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => { stop(); onBack(); }} className="text-xs text-cyan-500">{backLabel}</button>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400">{task.badge}</span>
      </div>
      <h1 className="text-lg font-bold leading-tight">{task.title}</h1>
      <p className="text-xs text-muted-foreground mb-3">{task.desc}{best ? ` · Your best: ${(best / 1000).toFixed(1)} s` : ''}</p>

      <div className="relative">
        <Suspense fallback={<div className="w-full rounded-2xl bg-[#0b1220] on-dark flex items-center justify-center text-xs text-slate-400" style={{ height: 320 }}>Loading 3-D view…</div>}>
          <ErrorBoundary compact message="The 3-D view could not start. Your code and progress are safe — try reloading.">
            <ArenaView boardRef={boardRef} cameraMode={cam} height={320} />
          </ErrorBoundary>
        </Suspense>
        <div className="absolute top-2 left-2 text-[11px] font-mono bg-black/55 text-white rounded-lg px-2 py-1">
          t = {(time / 1000).toFixed(1)} s
        </div>
        {task.id !== 'bin' && task.body !== 'arm' && (
          <button onClick={() => setCam(c => (c === 'chase' ? 'free' : 'chase'))} className="absolute top-2 right-2 text-[11px] bg-black/55 text-white rounded-lg px-2 py-1 flex items-center gap-1">
            {cam === 'chase' ? <><Video className="w-3 h-3" /> Follow cam</> : <><MapIcon className="w-3 h-3" /> Free cam (drag)</>}
          </button>
        )}
      </div>

      <div className={`mt-2.5 rounded-xl border px-3 py-2 text-xs font-medium flex items-center gap-2 ${statusColor}`}>
        {status.state === 'pass' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : status.state === 'fail' ? <XCircle className="w-4 h-4 shrink-0" /> : <Bot className="w-4 h-4 shrink-0" />}
        <span className="flex-1">{status.msg}{status.state === 'pass' && usedSolution ? ' (sample solution — try writing your own for XP!)' : ''}</span>
      </div>
      {status.state === 'pass' && (
        <ShareScoreButton className="w-full mt-2" label="Share this win" card={() => ({
          title: task.title, subtitle: 'Robot Arena 3D · my own Arduino code',
          value: `${(time / 1000).toFixed(1)}s`, outOf: 'completed', percent: 100,
          stats: [['Task', String(task.badge || task.title || 'Arena').split('—')[0].trim()], ['Lines of code', String(code.split('\n').filter(l => l.trim()).length)], ['Time', `${(time / 1000).toFixed(1)}s`]],
        })} />
      )}

      <div className="flex items-center gap-2 mt-2.5">
        {running
          ? <button onClick={stop} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-1.5"><Square className="w-4 h-4" /> Stop</button>
          : <button onClick={run} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-1.5"><Play className="w-4 h-4" /> Run code</button>}
        <button onClick={reset} className="px-3 py-2.5 rounded-xl glass-strong text-sm tap-target" aria-label="Reset"><RotateCcw className="w-4 h-4" /></button>
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="px-2 py-2.5 rounded-xl glass-strong text-xs bg-transparent">
          {[0.5, 1, 2, 4, 8, 16].map(s => <option key={s} value={s}>{s}× speed</option>)}
        </select>
      </div>

      <div className="flex gap-1 mt-4 mb-2 text-xs">
        {[['code', 'Code', Code2], ['serial', 'Serial', Terminal], ...(isCustom ? [['parts', 'Parts', Package]] : []), ['pins', 'Wiring', Cpu], ['learn', isCustom ? 'How' : 'Hint', Lightbulb]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 ${tab === id ? 'bg-cyan-500 text-white font-semibold' : 'glass-strong'}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === 'code' && (
        <>
          {error && (
            <div className="mb-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs px-3 py-2 font-mono whitespace-pre-wrap">
              {error.line ? `Line ${error.line}: ` : ''}{error.message}
              {isCustom && (
                <button onClick={aiFix} disabled={fixing} className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 font-sans font-semibold disabled:opacity-60">
                  {fixing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wrench className="w-3.5 h-3.5" />} Ask AI to fix it
                </button>
              )}
            </div>
          )}
          <CodeEditor value={code} onChange={(v) => { setCode(v); setError(null); }} errorLine={error?.line} />
          <div className="flex gap-2 mt-2 text-xs">
            <button onClick={() => { if (window.confirm('Go back to the starter code?')) { setCode(task.starter || ''); setError(null); } }} className="px-3 py-2 rounded-lg glass-strong">Starter code</button>
            {hasSolution && (
              <button onClick={showSolution} className="px-3 py-2 rounded-lg glass-strong flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Sample solution</button>
            )}
          </div>
        </>
      )}

      {tab === 'serial' && (
        <div className="rounded-xl bg-[#0d1117] on-dark text-green-300 font-mono text-[12px] p-3 overflow-auto" style={{ height: 260 }}>
          {serial.length ? serial.map((l, i) => <div key={i}>{l}</div>) : <span className="text-slate-500">Nothing printed yet. Use Serial.begin(9600); and Serial.println(value); in your code.</span>}
        </div>
      )}

      {tab === 'parts' && isCustom && (
        <div className="glass-strong rounded-xl p-3 text-xs space-y-2">
          {task.plan.parts.map((p, i) => (
            <div key={i} className="flex gap-3 border-b border-white/5 pb-2 last:border-0">
              <span className="font-bold text-cyan-400 w-7 shrink-0">×{p.qty}</span>
              <div><p className="font-semibold">{p.name}</p><p className="text-muted-foreground">{p.purpose}</p></div>
            </div>
          ))}
        </div>
      )}

      {tab === 'pins' && (
        <div className="glass-strong rounded-xl p-3 mb-3">
          <button onClick={() => setBigWiring(true)} className="block w-full overflow-x-auto rounded-lg bg-white text-left" aria-label="Open the wiring diagram full screen"><div style={{ minWidth: 760 }}>
            <Suspense fallback={<div className="py-10 text-xs text-center text-muted-foreground">Drawing the circuit…</div>}>
              <ErrorBoundary compact message="The wiring diagram could not be drawn. The table below still lists every pin.">
                <CircuitDiagram pinConnections={wiringConns} projectName={isCustom ? 'Your robot' : task.title} onWireList={setWireItems} highlightWire={wireHi} />
              </ErrorBoundary>
            </Suspense>
          </div></button>
          <Suspense fallback={null}>
            <div className="mt-2 rounded-lg overflow-hidden"><WireList items={wireItems} active={wireHi} onPick={(n) => setWireHi(wireHi === n ? null : n)} /></div>
          </Suspense>
          <p className="text-[10px] text-muted-foreground mt-2">Every wire has its own colour and number. Tap the picture to zoom in, or tap a wire in the list to light it up.</p>
        </div>
      )}
      {bigWiring && (
        <Suspense fallback={null}>
          <FullscreenCircuit pinConnections={wiringConns} projectName={isCustom ? 'Your robot' : task.title} onClose={() => setBigWiring(false)} />
        </Suspense>
      )}

      {tab === 'pins' && isCustom && (
        <div className="glass-strong rounded-xl p-3 text-xs">
          <p className="text-muted-foreground mb-2">Connect each part like this. The code in the Code tab already uses these exact pins.</p>
          <div className="space-y-1">
            {task.plan.wiring.map((w, i) => (
              <div key={i} className="flex items-start gap-2 border-b border-white/5 py-1">
                <span className="flex-1 min-w-0"><span className="font-semibold">{w.part}</span> <span className="text-muted-foreground">· {w.pin}</span></span>
                <span className="font-mono text-cyan-400 text-right shrink-0">{w.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'pins' && !isCustom && (
        <div className="glass-strong rounded-xl p-3 text-xs">
          <p className="text-muted-foreground mb-2">{task.body === 'arm' ? 'The arm is wired like a school robotics kit: Arduino Uno, four servos (base, shoulder, elbow, gripper) on their own 5 V supply, and an HC-SR04 on the base.' : 'The simulated robot is wired like a standard school kit: Arduino Uno, L298N motor driver, 2 IR sensors, HC-SR04 ultrasonic sensor'}{task.body !== 'arm' && task.id === 'pid' ? ', and a 3-sensor analog IR array on A0–A2' : ''}.</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
            {pinRows.map(([k, v]) => <div key={k} className="flex justify-between border-b border-white/5 py-0.5"><span>{k}</span><span className="text-cyan-400">{v >= 14 ? `A${v - 14}` : v}</span></div>)}
          </div>
          <p className="text-muted-foreground mt-2">IR sensors read HIGH on black (or when there is no floor). Motor: IN1 HIGH + IN2 LOW = forward; ENA PWM 0–255 sets speed (below ~45 the motor stalls).</p>
        </div>
      )}

      {tab === 'learn' && (
        <div className="glass-strong rounded-xl p-3 text-sm leading-relaxed">
          <p className="font-semibold mb-1 flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-amber-400" /> {isCustom ? 'How your robot works' : 'Think about it'}</p>
          <p className="text-muted-foreground text-[13px]">{task.learn}</p>
        </div>
      )}
    </div>
  );
}
