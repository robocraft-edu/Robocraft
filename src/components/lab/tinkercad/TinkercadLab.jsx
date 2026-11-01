import React, { Suspense, lazy, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { aiEnabled } from '@/lib/features';
import { useNavigate } from 'react-router-dom';
import {
  Undo2, Redo2, Trash2, ChevronLeft, Code2, Play, Pause, RotateCcw,
  PanelLeftClose, X, Save, FolderOpen, Blocks, Cpu, Sparkles, Wrench, Terminal, Maximize2, LayoutGrid, Box,
} from 'lucide-react';
import { LAB_EXPERIMENTS, getExperiment, generateCode } from '@/lib/lab/labExperiments';
import { validateCircuit, resolvePins } from '@/lib/lab/validateLab';
import { createSimState, stepSim, simInputsFor } from '@/lib/lab/simulateLab';
import {
  detectBoard, validateFreeBuild, resolveFreePins, freeWireStatuses,
  generateFreeCode, createFreeSimState, stepFreeSim, freeSimInputs, nextWiringStep,
} from '@/lib/lab/freeBuild';
import { CircuitBoard } from '@/lib/lab/circuitBoard';
import { runSketch } from '@/lib/arduino/runtime';
import { transpile } from '@/lib/arduino/transpile';
import Palette from './Palette';
import Canvas from './Canvas';
const Lab3DView = lazy(() => import('./Lab3DView'));
import PropertiesPanel from './PropertiesPanel';
import CodePanel from './CodePanel';
import SerialMonitor from './SerialMonitor';
import SimControls from './SimControls';
import StatusBar from './StatusBar';
import LabWelcome from './LabWelcome';
import BuildAnything from './BuildAnything';
import WorkflowStepper from './WorkflowStepper';
import HelpMeBuild from './HelpMeBuild';
import { toast } from '@/components/ui/use-toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { checkWire } from '@/lib/lab/wireAdvice';
import { forSim } from '@/lib/lab/labComponents';
import { checkCircuit, blockingFaults } from '@/lib/lab/electrical';

// Returns false when the device refuses the write (storage full, private mode).
const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };

let _id = 1;
const newId = () => `c${_id++}`;
const BUILDS_KEY = 'robocraft_lab_builds';

// The headline of a fault; the rest is there when the student taps for it.
const firstLine = (msg) => {
  const s = String(msg || '');
  const end = s.indexOf('. ');
  return end > 30 ? s.slice(0, end + 1) : s;
};

export default function TinkercadLab({ onExit }) {
  const navigate = useNavigate();
  const [experimentId, setExperimentId] = useState(null);
  // Read once, not on every render: a corrupt or oversized value would
  // otherwise throw in the middle of drawing the lab.
  const [savedBuilds, setSavedBuilds] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem(BUILDS_KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch { return []; }
  });
  const experiment = experimentId ? getExperiment(experimentId) : null;
  const free = !experiment;

  const [components, setComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingWire, setPendingWire] = useState(null);
  const [showFaults, setShowFaults] = useState(false);

  const [running, setRunning] = useState(false);
  const [simState, setSimState] = useState(free ? createFreeSimState() : createSimState());
  const [serial, setSerial] = useState([]);
  const [inputs, setInputs] = useState({ buttonPressed: false, objectCm: 30, motorSpeed: 200, knob: 50 });
  const [userCode, setUserCode] = useState(null); // student's edited sketch (null = generated code)
  const [engine, setEngine] = useState('code');   // 'code' = run the sketch, 'script' = fallback animation
  const [codeError, setCodeError] = useState(null);

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const pendingRef = useRef(null);

  // drawers / overlays
  const [showComponents, setShowComponents] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showSerial, setShowSerial] = useState(false);
  const [view3d, setView3d] = useState(false);

  // mobile sheet
  const [mobileSheet, setMobileSheet] = useState(null);

  // modals
  const [showBuildAnything, setShowBuildAnything] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSaves, setShowSaves] = useState(false);
  const [wiringGuide, setWiringGuide] = useState(null);

  // Look-alike parts (gear motor, AA battery…) are simulated as the part they behave like.
  const simComps = useMemo(() => forSim(components), [components]);
  const board = detectBoard(components) || { type: 'arduino_uno', id: 'default' };
  const boardType = board.type;

  const snapshot = useCallback(() => {
    setPast(p => [...p, { components, wires }].slice(-50));
    setFuture([]);
  }, [components, wires]);

  const undo = () => {
    setPast(p => {
      if (!p.length) return p;
      const prev = p[p.length - 1];
      setFuture(f => [{ components, wires }, ...f]);
      setComponents(prev.components); setWires(prev.wires);
      return p.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture(f => {
      if (!f.length) return f;
      const next = f[0];
      setPast(p => [...p, { components, wires }]);
      setComponents(next.components); setWires(next.wires);
      return f.slice(1);
    });
  };

  // auto-open inspector when a component is selected
  useEffect(() => {
    if (selectedId) setInspectorOpen(true);
  }, [selectedId]);

  // ── derived ──
  const templateValidation = useMemo(() => experiment ? validateCircuit(experiment, simComps, wires) : null, [experiment, simComps, wires]);
  const freeCheck = useMemo(() => free ? validateFreeBuild(simComps, wires) : null, [free, simComps, wires]);
  // What the circuit would actually do on a real board: an LED with no
  // resistor, a motor straight off a pin, a sensor with no ground.
  const faults = useMemo(() => checkCircuit(simComps, wires), [simComps, wires]);
  const dangers = useMemo(() => blockingFaults(faults), [faults]);
  const templatePins = useMemo(() => experiment ? resolvePins(experiment, simComps, wires) : {}, [experiment, simComps, wires]);
  const freePins = useMemo(() => free ? resolveFreePins(simComps, wires) : {}, [free, simComps, wires]);
  const pins = experiment ? templatePins : freePins;

  const code = useMemo(() => {
    if (experiment) return experiment && templateValidation?.valid ? generateCode(experiment, templatePins) : '';
    return components.length ? generateFreeCode(simComps, wires) : '';
  }, [experiment, templateValidation, templatePins, components, simComps, wires]);

  const wireStatuses = useMemo(() => {
    if (experiment) return templateValidation ? templateValidation.wireResults.map(w => w.status) : [];
    return freeCheck ? freeWireStatuses(simComps, wires) : [];
  }, [experiment, templateValidation, freeCheck, simComps, wires]);

  const activeCode = userCode ?? code;
  const needsInput = experiment ? { ...simInputsFor(experiment), ...freeSimInputs(simComps), motor: false } : { ...freeSimInputs(simComps), motor: engine === 'script' && freeSimInputs(simComps).motor };
  const canRun = experiment ? !!templateValidation?.valid : (freeCheck?.status !== 'error' && components.length > 0 && !!detectBoard(components));

  const status = running ? 'running' : components.length === 0 ? 'empty'
    : experiment
    ? (templateValidation?.valid ? 'valid' : (templateValidation && (templateValidation.wireResults.some(w => w.status === 'incorrect') || templateValidation.componentIssues.length) ? 'error' : 'incomplete'))
    : (freeCheck?.status || 'incomplete');

  // ── simulation loop ──
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const simRef = useRef(simState);
  const inputsRef = useRef(inputs);
  const componentsRef = useRef(simComps);
  useEffect(() => { simRef.current = simState; }, [simState]);
  useEffect(() => { inputsRef.current = inputs; }, [inputs]);
  useEffect(() => { componentsRef.current = simComps; }, [simComps]);
  useEffect(() => {
    if (!running || engine !== 'script') return;
    lastRef.current = performance.now();
    const loop = (now) => {
      const dt = now - lastRef.current; lastRef.current = now;
      const step = experiment
        ? stepSim(experiment, pins, simRef.current, inputsRef.current, dt)
        : stepFreeSim(componentsRef.current, pins, simRef.current, inputsRef.current, dt);
      simRef.current = step.state; setSimState(step.state);
      if (step.serial) setSerial(arr => [...arr, `[${new Date().toLocaleTimeString()}] ${step.serial}`].slice(-200));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, experiment, pins, engine]);

  // ── real code execution: the sketch drives the wired circuit ──
  const wiresRef = useRef(wires);
  const codeRef = useRef(activeCode);
  useEffect(() => { wiresRef.current = wires; }, [wires]);
  useEffect(() => { codeRef.current = activeCode; }, [activeCode]);
  useEffect(() => {
    if (!running || engine !== 'code') return;
    const comps = componentsRef.current;
    const board = new CircuitBoard(comps, resolveFreePins(comps, wiresRef.current), () => inputsRef.current);
    let buf = [];
    const stamp = (ms) => `[${(ms / 1000).toFixed(1)}s]`;
    board.onSerial = (line) => buf.push(`${stamp(board.t)} ${line}`);
    const h = runSketch(codeRef.current, board, {
      onError: (e) => { buf.push(`⚠ ${e.line ? `Line ${e.line}: ` : ''}${e.message}`); setCodeError(e.message); },
    });
    let raf;
    const frame = () => {
      setSimState({ ...board.snapshot(), t: h.time });
      if (buf.length) { const add = buf; buf = []; setSerial(arr => [...arr, ...add].slice(-200)); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    h.done.then((res) => {
      if (res?.error) {
        if (buf.length) { const add = buf; buf = []; setSerial(arr => [...arr, ...add].slice(-200)); }
        setRunning(false);
      }
    });
    return () => { h.stop(); cancelAnimationFrame(raf); };
  }, [running, engine]);

  // ── actions ──
  const addComponent = (type, x, y) => {
    snapshot();
    const id = newId();
    setComponents(c => [...c, { id, type, x: Math.round(x), y: Math.round(y), rot: 0 }]);
    setSelectedId(id);
    setShowWelcome(false);
  };
  const addComponentsList = (types) => {
    snapshot();
    const narrowList = typeof window !== 'undefined' && window.innerWidth < 640;
    const cols = narrowList ? 2 : 3, gap = narrowList ? 220 : 260, sx = 120, sy = 120;
    const placed = types.map((t, i) => ({ id: newId(), type: t, x: sx + (i % cols) * gap, y: sy + Math.floor(i / cols) * gap, rot: 0 }));
    setComponents(c => [...c, ...placed]);
    setShowWelcome(false);
    setTimeout(() => window.dispatchEvent(new CustomEvent('lab-fit')), 60);
  };
  const moveComponent = (id, x, y) => setComponents(c => c.map(p => p.id === id ? { ...p, x: Math.round(x), y: Math.round(y) } : p));
  const rotateSelected = () => { if (!selectedId) return; snapshot(); setComponents(c => c.map(p => p.id === selectedId ? { ...p, rot: ((p.rot || 0) + 90) % 360 } : p)); };
  const deleteSelected = () => {
    if (!selectedId) return; snapshot();
    setComponents(c => c.filter(p => p.id !== selectedId));
    setWires(w => w.filter(x => x.from.compId !== selectedId && x.to.compId !== selectedId));
    setSelectedId(null);
  };
  const clearAll = () => { snapshot(); setUserCode(null); setComponents([]); setWires([]); setSelectedId(null); setPendingWire(null); setWiringGuide(null); pendingRef.current = null; setShowWelcome(true); setRunning(false); };

  // Wiring is two taps: one pin, then the other. Nothing is dragged.
  const onPinDown = (compId, pinId) => {
    setSelectedId(compId);
    const prev = pendingRef.current;
    if (!prev) { pendingRef.current = { compId, pinId }; setPendingWire({ compId, pinId }); return; }
    // Tapping the same pin again cancels.
    if (prev.compId === compId && prev.pinId === pinId) { pendingRef.current = null; setPendingWire(null); return; }

    const to = { compId, pinId };
    const verdict = checkWire({ from: prev, to, components: simComps, wires, experiment });
    pendingRef.current = null; setPendingWire(null);

    if (verdict.message) {
      toast({ title: verdict.ok ? 'Careful' : 'That wire will not work', description: verdict.message });
    }
    if (!verdict.ok) return;
    snapshot();
    setWires(ws => [...ws, { id: newId(), from: prev, to }]);
  };

  const chooseExperiment = (id) => {
    const exp = getExperiment(id);
    setExperimentId(id); setUserCode(null); setCodeError(null); setSelectedId(null); setPendingWire(null); pendingRef.current = null;
    setWiringGuide(null); setRunning(false); setSerial([]); setSimState(createSimState()); setShowWelcome(false); setShowTemplates(false);
    setShowComponents(false); setInspectorOpen(false);
    if (!exp) return;
    // Starter build: place every required component and pre-wire it exactly as
    // the project's pin map specifies — one Run away from working, then the
    // student can rewire, break and rebuild it.
    // lay the parts out to suit the screen so the fit zoom stays readable
    const narrow = typeof window !== 'undefined' && window.innerWidth < 640;
    const cols = narrow ? 2 : 3, gapX = narrow ? 300 : 340, gapY = narrow ? 230 : 280;
    const placed = exp.components.map((t, i) => ({
      id: t, type: t,
      x: 160 + (i % cols) * gapX,
      y: 160 + Math.floor(i / cols) * gapY,
      rot: 0,
    }));
    const starUsed = {};
    const preWired = exp.required.map(r => {
      const end = (e) => {
        let pinId = e.pin;
        if (pinId === '*') { // symmetric terminals: first free wire uses 'a', second 'b'
          const c = starUsed[e.comp] || 0;
          pinId = c === 0 ? 'a' : 'b';
          starUsed[e.comp] = c + 1;
        }
        return { compId: e.comp, pinId };
      };
      return { id: newId(), from: end(r.from), to: end(r.to) };
    });
    setComponents(placed);
    setWires(preWired);
    [80, 420].forEach(ms => setTimeout(() => window.dispatchEvent(new CustomEvent('lab-fit')), ms));
  };

  useEffect(() => { const t = setTimeout(() => window.dispatchEvent(new CustomEvent('lab-fit')), 120); return () => clearTimeout(t); }, [showSerial]);

  const resetSim = () => { setRunning(false); setSimState(experiment ? createSimState() : createFreeSimState()); setSerial([]); };
  const runSim = () => {
    // Run used to be greyed out with only a desktop tooltip to explain why, so
    // on a phone it read as a dead button. It is always pressable now and says
    // what is missing.
    if (components.length === 0) {
      toast({ title: 'Nothing to run yet', description: 'Drag a board and a part onto the workbench first.' });
      return;
    }
    if (!detectBoard(components)) {
      toast({ title: 'Add a board', description: 'An Arduino or ESP32 runs the code — drag one in from Components.' });
      return;
    }
    if (wires.length === 0) {
      toast({ title: 'Wire the parts first', description: 'Connect your parts to the board — tap one pin, then the other, to draw a wire.' });
      return;
    }
    if (dangers.length) {
      const f = dangers[0];
      setCodeError(`${f.title}. ${f.message}`);
      setSerial([`⛔ ${f.title}`, f.message, '', 'Fix the wiring and press Run again.']);
      setShowSerial(true);
      toast({ title: f.title, description: f.message });
      return;
    }
    if (!canRun) {
      const problem = experiment
        ? 'Finish the wiring shown in the guide, then press Run.'
        : (freeCheck?.issues || []).find(i => i.type === 'error')?.msg || 'Fix the wiring problem shown in the check panel.';
      toast({ title: 'Check the wiring', description: problem });
      return;
    }
    setSimState(experiment ? createSimState() : createFreeSimState()); setSerial([]); setCodeError(null);
    let eng = 'code';
    try { transpile(activeCode); } catch (e) {
      if (userCode != null) { // the student's own code has an error — show it instead of faking a run
        setCodeError(e.message); setSerial([`⚠ ${e.line ? `Line ${e.line}: ` : ''}${e.message}`]); setShowSerial(true); return;
      }
      eng = 'script'; // generated code uses a library the simulator doesn't model — animate instead
    }
    setEngine(eng); setRunning(true); setShowSerial(true);
  };

  // ── save / load ──
  const saveBuild = () => {
    const name = window.prompt('Name this build:', `Build ${new Date().toLocaleDateString()}`);
    if (!name) return;
    const builds = [...savedBuilds, { id: `b${Date.now()}`, name, components, wires, boardType, code: userCode }];
    setSavedBuilds(builds);
    if (!lsSet(BUILDS_KEY, JSON.stringify(builds))) {
      toast({ title: 'Could not save', description: 'This device is out of storage space. Delete an old build and try again.' });
    }
  };
  const loadBuild = (b) => {
    snapshot();
    setComponents(b.components); setWires(b.wires); setSelectedId(null); setPendingWire(null); pendingRef.current = null;
    setExperimentId(null); setUserCode(b.code ?? null); setWiringGuide(null); setRunning(false); setSimState(createFreeSimState()); setSerial([]);
    setShowSaves(false); setShowWelcome(false);
  };

  const helpStep = nextWiringStep(wiringGuide, components, wires);
  const selectedComp = selectedId ? components.find(c => c.id === selectedId) : null;

  return (
    <div className="fixed inset-x-0 flex flex-col z-50" style={{ top: 'calc(4rem + env(safe-area-inset-top))', bottom: '0' }}>
      {/* ── TOP TOOLBAR ── */}
      <div className="glass-strong border-b border-border flex items-center gap-1 px-2 py-2">
        <button onClick={onExit || (() => navigate(-1))} className="p-1 text-muted-foreground hover:text-cyan-400 transition-colors" aria-label="Back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-orange-500 leading-none whitespace-nowrap">CIRCUIT · 2D</p>
          <p className="text-xs font-semibold truncate max-w-[5.5rem] sm:max-w-[11rem]">{experiment ? experiment.title : 'Free build'}</p>
        </div>
        <button onClick={() => navigate('/design')} className="ml-1 px-2 py-1 rounded-lg glass text-[10px] font-bold text-violet-500 shrink-0" title="Switch to 3D design">3D →</button>

        {aiEnabled && <button onClick={() => setShowBuildAnything(true)} className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold hover:neon-glow transition-all shrink-0">
          <Sparkles className="w-3.5 h-3.5" /><span className="hidden sm:inline">Build Anything</span>
        </button>}

        <div className="ml-auto flex items-center gap-1">
          <button aria-label="Undo" onClick={undo} disabled={!past.length} title="Undo" className="p-1.5 rounded-lg glass text-cyan-500 disabled:opacity-30 tap-target"><Undo2 className="w-4 h-4" /></button>
          <button aria-label="Redo" onClick={redo} disabled={!future.length} title="Redo" className="p-1.5 rounded-lg glass text-cyan-500 disabled:opacity-30 hidden sm:block tap-target"><Redo2 className="w-4 h-4" /></button>
          <button aria-label="Save" onClick={saveBuild} title="Save build" className="p-1.5 rounded-lg glass text-cyan-500 tap-target"><Save className="w-4 h-4" /></button>
          <button onClick={() => setShowSaves(true)} title="My builds" className="p-1.5 rounded-lg glass text-cyan-500"><FolderOpen className="w-4 h-4" /></button>
          <button aria-label="Delete" onClick={clearAll} title="Clear" className="p-1.5 rounded-lg glass text-red-400 hidden sm:block tap-target"><Trash2 className="w-4 h-4" /></button>
          <button onClick={() => setShowTemplates(true)} title="Projects" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass text-cyan-500 text-[11px] font-bold hover:bg-cyan-500/10 transition-colors hidden md:flex"><LayoutGrid className="w-3.5 h-3.5" /><span>Projects</span></button>
          <button onClick={() => setShowCode(true)} title="Code" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/10 transition-colors hidden md:flex"><Code2 className="w-3.5 h-3.5" /><span>Code</span></button>
          <button onClick={() => setShowSerial(s => !s)} title="Serial" className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors hidden md:flex ${showSerial ? 'bg-green-500/20 text-green-400' : 'glass text-cyan-400 hover:bg-cyan-500/10'}`}><Terminal className="w-3.5 h-3.5" /><span>Serial</span></button>
          <div className="h-5 w-px bg-border mx-0.5 hidden md:block" />
          {!running
            ? <button onClick={runSim} title="Run" className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"><Play className="w-3.5 h-3.5" /><span className="hidden md:inline">Run</span></button>
            : <button onClick={() => setRunning(false)} className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[11px] font-bold transition-colors"><Pause className="w-3.5 h-3.5" /><span className="hidden md:inline">Stop</span></button>}
          <button aria-label="Reset" onClick={resetSim} title="Reset" className="p-1.5 rounded-lg glass text-cyan-400 hover:bg-cyan-500/10 transition-colors tap-target"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div className="glass border-b border-border px-3 py-1.5 flex items-center gap-3">
        <StatusBar status={status} count={components.length} onClick={() => !free && setShowSerial(true)} />
        <div className="ml-auto flex items-center gap-3">
          <WorkflowStepper hasComponents={components.length > 0} hasWires={wires.length > 0} hasCode={!!code} hasRun={running || serial.length > 0} />
          {experiment && <span className="text-[10px] text-cyan-400 font-medium hidden sm:inline">{experiment.title}</span>}
        </div>
      </div>

      {/* What this circuit would do on a real board. The first fault is shown
          as the student wires, not held back until they press Run. */}
      {faults.length > 0 && (
        <button
          onClick={() => { setSelectedId(faults[0].compId || null); setShowFaults(f => !f); }}
          className={`w-full text-left px-3 py-2 border-b border-border ${faults[0].level === 'danger' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}
        >
          <span className={`text-[11px] font-bold ${faults[0].level === 'danger' ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
            {faults[0].level === 'danger' ? '⛔ ' : '⚠ '}{faults[0].title}
          </span>
          <span className="block text-[10px] text-muted-foreground leading-snug mt-0.5">
            {showFaults ? faults[0].message : firstLine(faults[0].message)}
          </span>
          {faults.length > 1 && (
            <span className="block text-[10px] text-cyan-500 mt-1">{showFaults ? 'Hide' : `+${faults.length - 1} more · tap for detail`}</span>
          )}
          {showFaults && faults.slice(1).map((f, i) => (
            <span key={i} className="block text-[10px] text-muted-foreground leading-snug mt-1.5">
              {f.level === 'danger' ? '⛔ ' : '⚠ '}<b>{f.title}.</b> {f.message}
            </span>
          ))}
        </button>
      )}

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Components drawer — desktop (collapsed default) */}
        {showComponents ? (
          <div className="w-52 flex-shrink-0 glass border-r border-border hidden md:flex flex-col relative animate-slide-up">
            <button onClick={() => setShowComponents(false)} className="absolute -right-3 top-3 z-10 w-6 h-6 rounded-full glass-strong border border-border flex items-center justify-center text-muted-foreground hover:text-cyan-400"><PanelLeftClose className="w-3.5 h-3.5" /></button>
            <Palette onAdd={(type) => window.dispatchEvent(new CustomEvent('lab-add', { detail: { type } }))} />
          </div>
        ) : (
          <button onClick={() => setShowComponents(true)} title="Components" className="w-9 flex-shrink-0 glass border-r border-border hidden md:flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-cyan-400 transition-colors py-3">
            <Blocks className="w-4 h-4" />
            <span className="text-[9px] font-bold rotate-180" style={{ writingMode: 'vertical-rl' }}>Components</span>
          </button>
        )}

        {/* Canvas */}
        <div className="flex-1 min-w-0 relative">
          {/* The workbench gets its own boundary: if drawing a part or a wire
              fails, the student keeps the toolbar, the code and the saved work
              instead of losing the whole screen. */}
          <ErrorBoundary compact resetKey={components.length + ':' + wires.length}
            message="The workbench could not draw that. Try again, or undo the last step.">
          {view3d && (
            <div className="absolute inset-0 z-10 bg-[#0b1220]">
              <ErrorBoundary compact resetKey={components.length + ':' + wires.length}
                message="3D view could not start on this device. Switch back to 2D.">
                <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-xs text-cyan-300">Loading 3D parts…</div>}>
                  <Lab3DView components={components} wires={wires} simState={simState} />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}
          <Canvas
            components={components} wires={wires} selectedId={selectedId} pendingWire={pendingWire}
            simState={simState} running={running} wireStatuses={wireStatuses}
            onSelect={setSelectedId} onMove={moveComponent} onMoveStart={snapshot}
            onPinDown={onPinDown} onBackgroundDown={() => { setSelectedId(null); setPendingWire(null); pendingRef.current = null; }}
            onDropComponent={addComponent}
            bottomInset={showSerial ? 208 : 0}
          />
          </ErrorBoundary>
          {showWelcome && components.length === 0 && (
            <LabWelcome
              onBuildAnything={() => { setShowWelcome(false); setShowBuildAnything(true); }}
              onScratch={() => setShowWelcome(false)}
              onPickExperiment={chooseExperiment}
            />
          )}
          <button onClick={() => setView3d(v => !v)} data-testid="toggle-3d" aria-pressed={view3d}
            className="absolute right-3 top-3 z-20 px-3 py-1.5 rounded-lg glass text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 hover:bg-cyan-500/10">
            <Box className="w-3.5 h-3.5" /> {view3d ? '2D circuit' : '3D view'}
          </button>
          {/* floating fit/help (desktop) */}
          <div className="absolute left-3 bottom-3 hidden md:flex items-center gap-1.5">
            <button onClick={() => window.dispatchEvent(new CustomEvent('lab-fit'))} className="px-2.5 py-1.5 rounded-lg glass text-cyan-400 text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-500/10"><Maximize2 className="w-3.5 h-3.5" /> Fit</button>
            <button onClick={() => setShowComponents(true)} className="px-2.5 py-1.5 rounded-lg glass text-muted-foreground text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-500/10"><Blocks className="w-3.5 h-3.5" /> Add</button>
          </div>

          {/* Serial + sim-input drawer — canvas stays visible above; appears on demand */}
          {showSerial && (
            <div className="absolute left-0 right-0 bottom-0 h-52 glass-strong border-t border-border flex flex-col animate-slide-up md:left-52 z-20">
              <div className="flex-1 min-h-0 relative">
                <button onClick={() => setShowSerial(false)} className="absolute right-1 top-1 z-10 p-1 rounded text-muted-foreground hover:text-red-400" aria-label="Close serial monitor"><X className="w-4 h-4" /></button>
                <SerialMonitor lines={serial} running={running} />
              </div>
              <SimControls running={running} onRun={runSim} onStop={() => setRunning(false)} onReset={resetSim}
                inputs={inputs} setInputs={setInputs} needsInput={needsInput} canRun={canRun} />
            </div>
          )}
        </div>

        {/* Inspector — desktop, only when a component is selected */}
        {inspectorOpen && selectedId ? (
          <div className="w-64 flex-shrink-0 glass border-l border-border hidden md:flex flex-col relative animate-slide-up">
            <button onClick={() => setInspectorOpen(false)} className="absolute -left-3 top-3 z-10 w-6 h-6 rounded-full glass-strong border border-border flex items-center justify-center text-muted-foreground hover:text-cyan-400"><X className="w-3.5 h-3.5" /></button>
            <PropertiesPanel
              selected={selectedId} components={components} wires={wires}
              experiment={experiment} validation={templateValidation} freeCheck={freeCheck}
              wiringGuide={wiringGuide} helpStep={helpStep}
              onRotate={rotateSelected} onDelete={deleteSelected} />
          </div>
        ) : null}
      </div>

      {/* ── Code overlay (slides over canvas, right side; full on mobile) ── */}
      {showCode && (
        <div className="absolute inset-0 z-40 flex animate-fade-in">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCode(false)} />
          <div className="relative ml-auto w-full md:w-[28rem] lg:w-[32rem] h-full glass-strong border-l border-border flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5"><Code2 className="w-4 h-4" /> Code</span>
              <button onClick={() => setShowCode(false)} className="p-1.5 rounded-lg glass text-muted-foreground hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 min-h-0">
              <CodePanel code={code} pins={pins} experiment={experiment || { id: 'free', title: 'Free Build' }} canProgram={canRun}
                userCode={userCode} onEdit={(v) => { setUserCode(v); setCodeError(null); }} onResetCode={() => { setUserCode(null); setCodeError(null); }} error={codeError}
                onKnowCode={() => { setShowCode(false); setShowSerial(true); }} />
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM BAR ── */}
      <div className="md:hidden glass-strong border-t border-border grid grid-cols-5 safe-area-bottom">
        <MobTab icon={Blocks} label="Parts" active={mobileSheet === 'components'} onClick={() => setMobileSheet(mobileSheet === 'components' ? null : 'components')} />
        <MobTab icon={LayoutGrid} label="Projects" active={showTemplates} onClick={() => { setShowTemplates(true); setMobileSheet(null); }} />
        <MobTab icon={Cpu} label="Inspect" active={mobileSheet === 'inspector'} onClick={() => setMobileSheet(mobileSheet === 'inspector' ? null : 'inspector')} />
        <MobTab icon={Code2} label="Code" active={showCode} onClick={() => { setShowCode(true); setMobileSheet(null); }} />
        <MobTab icon={running ? Pause : Play} label={running ? 'Stop' : 'Run'} active={running} onClick={() => running ? setRunning(false) : runSim()} />
      </div>

      {/* ── MOBILE BOTTOM SHEETS ── */}
      {mobileSheet === 'components' && (
        <MobSheet title="Components" onClose={() => setMobileSheet(null)}>
          <Palette onAdd={(type) => { window.dispatchEvent(new CustomEvent('lab-add', { detail: { type } })); setMobileSheet(null); }} />
        </MobSheet>
      )}
      {mobileSheet === 'inspector' && (
        <MobSheet title="Inspector" onClose={() => setMobileSheet(null)}>
          <PropertiesPanel
            selected={selectedId} components={components} wires={wires}
            experiment={experiment} validation={templateValidation} freeCheck={freeCheck}
            wiringGuide={wiringGuide} helpStep={helpStep}
            onRotate={rotateSelected} onDelete={deleteSelected} />
        </MobSheet>
      )}

      {/* ── floating AI help ── */}
      <HelpMeBuild components={components} wires={wires} code={activeCode} status={status} />

      {/* ── MODALS ── */}
      {showBuildAnything && (
        <BuildAnything
          boardType={boardType}
          onAddComponents={(types) => { addComponentsList(types); setShowBuildAnything(false); }}
          onUseGuide={(guide) => { setWiringGuide(guide); setShowBuildAnything(false); setMobileSheet(null); }}
          onClose={() => setShowBuildAnything(false)}
        />
      )}
      {showTemplates && (
        <TemplatePicker onPick={chooseExperiment} onClose={() => setShowTemplates(false)} />
      )}
      {showSaves && (
        <SavesModal builds={savedBuilds} onLoad={loadBuild} onClose={() => setShowSaves(false)} />
      )}
    </div>
  );
}

function MobTab({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-0.5 py-2 transition-colors ${active ? 'text-cyan-400' : 'text-muted-foreground'}`}>
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function MobSheet({ title, onClose, children }) {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 animate-slide-up" style={{ maxHeight: '70vh' }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative glass-strong border-t border-border rounded-t-2xl flex flex-col" style={{ height: '70vh' }}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-sm font-bold text-cyan-400">{title}</span>
          <button aria-label="Close" onClick={onClose} className="p-1.5 rounded-lg glass text-muted-foreground hover:text-red-400 tap-target"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function TemplatePicker({ onPick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md glass-strong rounded-2xl p-5 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">Projects ({LAB_EXPERIMENTS.length})</h2>
          <button aria-label="Close" onClick={onClose} className="p-2 rounded-lg glass text-muted-foreground hover:text-red-400 tap-target"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-2">
          {LAB_EXPERIMENTS.map(ex => (
            <button key={ex.id} onClick={() => onPick(ex.id)} className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:bg-cyan-500/10 transition-colors text-left">
              <span className="text-xl">{ex.icon}</span>
              <div>
                <div className="text-sm font-bold">{ex.title}</div>
                <div className="text-[10px] text-muted-foreground">{ex.difficulty} · {ex.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SavesModal({ builds, onLoad, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md glass-strong rounded-2xl p-5 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">My Builds</h2>
          <button aria-label="Close" onClick={onClose} className="p-2 rounded-lg glass text-muted-foreground hover:text-red-400 tap-target"><X className="w-4 h-4" /></button>
        </div>
        {builds.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">No saved builds yet. Build something and tap Save.</p>
        ) : (
          <div className="space-y-2">
            {builds.map(b => (
              <button key={b.id} onClick={() => onLoad(b)} className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:bg-cyan-500/10 transition-colors text-left">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-sm font-bold">{b.name}</div>
                  <div className="text-[10px] text-muted-foreground">{b.components.length} components · {b.wires.length} wires</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}