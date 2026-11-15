import lazyRetry from '@/lib/lazyRetry';
import ErrorBoundary from '@/components/ErrorBoundary';
import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { SHAPES, newObjId, makeGroup, ungroup, objectSoup, toSTL } from '@/lib/design/shapes';
import { combine, volume } from '@/lib/design/csg';
import { PARTS, PROJECTS, buildPart, designBounds } from '@/lib/design/parts';
import { downloadFile } from '@/lib/platform';
import BuildAnything3D from '@/components/design/BuildAnything3D';
import {
  ChevronLeft, Undo2, Redo2, Save, Download, Trash2, Copy, Group, Ungroup, Move3d, Rotate3d, Scaling,
  Home as HomeIcon, ArrowDownToLine, FlipHorizontal2, Box, Layers, ClipboardList, X, Check, FolderOpen, ZoomIn, ZoomOut, MousePointer2, SlidersHorizontal, FilePlus2, Sparkles,
} from 'lucide-react';

const StudioView = lazyRetry(() => import('@/components/design/StudioView'));
const KEY = 'robocraft_designs';
const COLORS = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f8fafc', '#334155'];

const loadAll = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const saveAll = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage full */ } };

function ShapeIcon({ type }) {
  const c = '#60a5fa';
  const s = { box: <rect x="5" y="7" width="14" height="12" rx="1" fill={c} />, cylinder: <><ellipse cx="12" cy="7" rx="7" ry="2.5" fill="#93c5fd" /><path d="M5 7v10a7 2.5 0 0 0 14 0V7" fill={c} /></>,
    sphere: <circle cx="12" cy="12" r="7.5" fill={c} />, cone: <path d="M12 4 19 19H5z" fill={c} />, dome: <path d="M4 17a8 8 0 0 1 16 0z" fill={c} />,
    wedge: <path d="M5 19V6l14 13z" fill={c} />, pyramid: <path d="M12 4 20 19H4z" fill={c} />, tube: <><circle cx="12" cy="12" r="7.5" fill={c} /><circle cx="12" cy="12" r="4" fill="#0f172a" /></>,
    torus: <><ellipse cx="12" cy="13" rx="8" ry="5" fill={c} /><ellipse cx="12" cy="13" rx="4" ry="2" fill="#0f172a" /></>, hex: <path d="M8 5h8l4 7-4 7H8l-4-7z" fill={c} /> };
  return <svg viewBox="0 0 24 24" className="w-7 h-7">{s[type]}</svg>;
}

export default function DesignStudio() {
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass, updateProgress, addXP } = useApp();
  const [objects, setObjects] = useState([]);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState('translate');
  const [snap, setSnap] = useState(1);
  const [asHole, setAsHole] = useState(false);
  const [multi, setMulti] = useState(false);
  const [drawer, setDrawer] = useState('shapes'); // shapes | parts | project | null
  const [inspector, setInspector] = useState(false);
  const [viewCmd, setViewCmd] = useState(null);
  const [design, setDesign] = useState({ id: null, name: 'Untitled design' });
  const [projectId, setProjectId] = useState(null);
  const [showFiles, setShowFiles] = useState(false);
  const [showBuildAnything, setShowBuildAnything] = useState(false);
  const [robotPlan, setRobotPlan] = useState(null);
  const [showRobotPlan, setShowRobotPlan] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const objRef = useRef(objects); objRef.current = objects;

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const commit = (next) => { setPast(p => [...p, objRef.current].slice(-60)); setFuture([]); setObjects(next); };
  const undo = () => { if (!past.length) return; setFuture(f => [objects, ...f]); setObjects(past[past.length - 1]); setPast(p => p.slice(0, -1)); setSelected([]); };
  const redo = () => { if (!future.length) return; setPast(p => [...p, objects]); setObjects(future[0]); setFuture(f => f.slice(1)); setSelected([]); };

  const sel = objects.filter(o => selected.includes(o.id));
  const one = sel.length === 1 ? sel[0] : null;

  // ── add ──
  // new objects land beside what is already on the workplane, never inside it
  const dropSpot = (size = [20, 20, 20]) => {
    const b = designBounds(objects);
    if (!b) return [0, 0, 0];
    const x = b.max[0] + 10 + size[0] / 2;
    if (x + size[0] / 2 > 95) return [b.min[0] + size[0] / 2, 0, b.max[2] + 10 + size[1] / 2]; // next row
    return [x, 0, (b.min[2] + b.max[2]) / 2];
  };
  const addShape = (type) => {
    const [w, d, h] = SHAPES[type].size;
    const o = { id: newObjId(), type, size: [w, d, h], pos: dropSpot([w, d, h]), rot: [0, 0, 0], hole: asHole, color: COLORS[objects.length % 6] };
    commit([...objects, o]); setSelected([o.id]);
  };
  const addPart = (part) => {
    setBusy(true);
    setTimeout(() => {
      const g = buildPart(part);
      const [x, , z] = dropSpot(g.size);
      const o = { ...g, id: newObjId(), pos: [x, g.pos[1], z] };
      commit([...objRef.current, o]); setSelected([o.id]); setBusy(false);
      // a library part is big — show the whole model again
      setTimeout(() => setViewCmd({ name: 'home', t: Date.now() }), 60);
    }, 20);
  };

  // Place a generated robot: every part is a normal object in the design, so
  // it can be selected, moved, resized and exported like anything else.
  const placeRobot = (plan) => {
    setBusy(true);
    setShowBuildAnything(false);
    setTimeout(() => {
      const b = designBounds(objRef.current);
      const offsetX = b ? b.max[0] + 40 : 0;
      const placed = plan.parts.map(part => ({
        ...part,
        id: newObjId(),
        pos: [part.pos[0] + offsetX, part.pos[1], part.pos[2]],
      }));
      commit([...objRef.current, ...placed]);
      setSelected(placed.map(o => o.id));
      setRobotPlan(plan);
      setBusy(false);
      flash(`${plan.title} built · ${placed.length} parts`);
      setTimeout(() => setViewCmd({ name: 'home', t: Date.now() }), 60);
    }, 20);
  };

  // ── edit ──
  const patch = (id, p) => commit(objects.map(o => (o.id === id ? { ...o, ...p } : o)));
  const patchSel = (fn) => commit(objects.map(o => (selected.includes(o.id) ? { ...o, ...fn(o) } : o)));
  const remove = () => { commit(objects.filter(o => !selected.includes(o.id))); setSelected([]); };
  const duplicate = () => {
    const copies = sel.map(o => ({ ...o, id: newObjId(), pos: [o.pos[0] + 10, o.pos[1], o.pos[2] + 10] }));
    commit([...objects, ...copies]); setSelected(copies.map(c => c.id));
  };
  const mirror = () => patchSel(o => ({ mirror: [-(o.mirror?.[0] || 1), o.mirror?.[1] || 1, o.mirror?.[2] || 1] }));
  const dropToPlane = () => patchSel(o => {
    const b = designBounds([{ ...o, hole: false }]);
    return { pos: [o.pos[0], Math.round((o.pos[1] - b.min[1]) * 10) / 10, o.pos[2]] };
  });
  const doGroup = () => {
    if (sel.length < 2) return flash('Select 2 or more shapes to group (turn on Multi-select).');
    setBusy(true);
    setTimeout(() => {
      try {
        const g = makeGroup(sel);
        objectSoup(g); // compute CSG now so errors surface here
        commit([...objects.filter(o => !selected.includes(o.id)), g]); setSelected([g.id]);
      } catch (e) { flash('Could not group these shapes.'); }
      setBusy(false);
    }, 20);
  };
  const doUngroup = () => {
    if (!one || one.type !== 'group') return;
    const kids = ungroup(one);
    commit([...objects.filter(o => o.id !== one.id), ...kids]); setSelected(kids.map(k => k.id));
  };
  const align = (axis) => { // align selection centres (0 = x, 2 = z) or bottoms (1)
    if (sel.length < 2) return;
    const ref = sel[0];
    patchSel(o => { const p = [...o.pos]; p[axis] = ref.pos[axis]; return { pos: p }; });
  };

  const onPick = (id, additive) => {
    if (!id) { if (!additive) setSelected([]); return; }
    setSelected(s => (additive || multi ? (s.includes(id) ? s.filter(x => x !== id) : [...s, id]) : [id]));
  };
  const onTransform = (id, t) => patch(id, t);

  // ── keyboard (desktop) ──
  useEffect(() => {
    const k = (e) => {
      if (/input|textarea|select/i.test(e.target.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); duplicate(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'g') { e.preventDefault(); e.shiftKey ? doUngroup() : doGroup(); }
      else if (e.key === 'Delete' || e.key === 'Backspace') remove();
      else if (e.key === 'd' || e.key === 'D') dropToPlane();
      else if (e.key === 'h' || e.key === 'H') patchSel(o => ({ hole: !o.hole }));
      else if (e.key === 'm') setMode('translate'); else if (e.key === 'r') setMode('rotate'); else if (e.key === 's') setMode('scale');
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });

  // ── model stats ──
  const stats = useMemo(() => {
    const b = designBounds(objects);
    if (!b) return null;
    let vol = 0;
    try { for (const o of objects) if (!o.hole) vol += Math.abs(volume(objectSoup(o))); } catch { /* ignore */ }
    const grams = (vol / 1000) * 1.24 * 0.35; // PLA, ~20% infill + walls ≈ 35% solid
    return { size: b.size, vol, grams, cost: Math.max(5, Math.round(grams * 2)) };
  }, [objects]);

  // ── project checks ──
  const project = projectId ? PROJECTS.find(p => p.id === projectId) : null;
  const checks = useMemo(() => { try { return project ? project.checks(objects) : []; } catch { return []; } }, [project, objects]);
  const designDone = getProgressForClass(selectedClass).design || {};
  useEffect(() => {
    if (!project || !checks.length || !checks.every(c => c.ok) || designDone[project.id]) return;
    updateProgress(selectedClass, { design: { ...designDone, [project.id]: Date.now() } });
    addXP(selectedClass, 30);
    flash(`🎉 ${project.title} complete! +30 XP`);
  }, [checks]);  

  // ── files ──
  const save = () => {
    const name = window.prompt('Design name:', design.name);
    if (!name) return;
    const list = loadAll();
    const id = design.id || `d${Date.now()}`;
    const rec = { id, name, objects, updated: Date.now() };
    const i = list.findIndex(d => d.id === id);
    if (i >= 0) list[i] = rec; else list.unshift(rec);
    saveAll(list); setDesign({ id, name }); flash('Saved');
  };
  const open = (d) => { setObjects(d.objects); setPast([]); setFuture([]); setSelected([]); setDesign({ id: d.id, name: d.name }); setShowFiles(false); };
  const newDesign = () => { if (objects.length && !window.confirm('Start a new design? Unsaved changes will be lost.')) return; setObjects([]); setPast([]); setFuture([]); setSelected([]); setDesign({ id: null, name: 'Untitled design' }); setShowFiles(false); };
  const exportSTL = async () => {
    const solids = objects.filter(o => !o.hole);
    if (!solids.length) return flash('Add a solid shape first.');
    setBusy(true);
    await new Promise(r => setTimeout(r, 20));
    try {
      const soup = combine(solids.map(objectSoup), []);
      const buf = toSTL(soup, design.name);
      const fname = `${design.name.replace(/[^\w-]+/g, '_') || 'design'}.stl`;
      await downloadFile(new Blob([buf], { type: 'model/stl' }), fname, 'model/stl');
    } finally { setBusy(false); }
  };

  const num = (label, value, onChange, step = 1) => (
    <label className="flex items-center gap-1 text-[11px]">
      <span className="w-4 text-muted-foreground">{label}</span>
      <button onClick={() => onChange(Math.round((value - step) * 10) / 10)} className="w-6 h-7 rounded glass text-cyan-400">−</button>
      <input type="number" value={Math.round(value * 10) / 10} step={step} onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) onChange(v); }}
        className="w-16 h-7 rounded bg-background/60 border border-border text-center text-xs" />
      <button onClick={() => onChange(Math.round((value + step) * 10) / 10)} className="w-6 h-7 rounded glass text-cyan-400">+</button>
    </label>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-background" style={{ top: 'calc(4rem + env(safe-area-inset-top))' }}>
      {/* top bar */}
      <div className="glass-strong border-b border-border flex items-center gap-1 px-2 py-1.5">
        <button onClick={() => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/'))} className="p-1 text-muted-foreground"><ChevronLeft className="w-5 h-5" /></button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-rose-400 leading-none">3D DESIGN STUDIO</p>
          <p className="text-xs font-semibold truncate max-w-[7.5rem]">{design.name}</p>
        </div>
        <button onClick={() => navigate('/lab')} className="ml-1 px-2 py-1 rounded-lg glass text-[10px] font-bold text-orange-500 shrink-0" title="Switch to the 2D circuit lab">2D →</button>
        <div className="ml-auto flex items-center gap-1">
          <IconBtn onClick={undo} disabled={!past.length} title="Undo"><Undo2 className="w-4 h-4" /></IconBtn>
          <IconBtn onClick={redo} disabled={!future.length} title="Redo"><Redo2 className="w-4 h-4" /></IconBtn>
          <IconBtn onClick={() => setShowFiles(true)} title="My designs"><FolderOpen className="w-4 h-4" /></IconBtn>
          <IconBtn onClick={save} title="Save"><Save className="w-4 h-4" /></IconBtn>
          {robotPlan && (
            <button onClick={() => setShowRobotPlan(true)} className="px-2.5 py-1.5 rounded-lg glass text-[11px] font-bold text-violet-500 shrink-0" title="Wiring, code and parts for the robot you built">
              {robotPlan.title} · plan
            </button>
          )}
          <button onClick={() => setShowBuildAnything(true)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-[11px] font-bold shrink-0"><Sparkles className="w-3.5 h-3.5" /> Build anything</button>
          <button onClick={exportSTL} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold"><Download className="w-3.5 h-3.5" /> STL</button>
        </div>
      </div>

      {/* selection toolbar */}
      <div className="glass border-b border-border flex items-center gap-1 px-2 py-1 overflow-x-auto no-scrollbar">
        <Seg active={mode === 'translate'} onClick={() => setMode('translate')}><Move3d className="w-4 h-4" /><span>Move</span></Seg>
        <Seg active={mode === 'rotate'} onClick={() => setMode('rotate')}><Rotate3d className="w-4 h-4" /><span>Rotate</span></Seg>
        <Seg active={mode === 'scale'} onClick={() => setMode('scale')}><Scaling className="w-4 h-4" /><span>Size</span></Seg>
        <div className="w-px h-5 bg-border mx-1" />
        <Seg active={multi} onClick={() => setMulti(m => !m)}><MousePointer2 className="w-4 h-4" /><span>Multi</span></Seg>
        {sel.length > 0 && <>
          <Seg onClick={() => { const t = !sel[0].hole; patchSel(() => ({ hole: t })); }} active={!!sel[0].hole}><Box className="w-4 h-4" /><span>{sel[0].hole ? 'Hole' : 'Solid'}</span></Seg>
          <IconBtn onClick={() => setInspector(i => !i)} title="Dimensions"><SlidersHorizontal className="w-4 h-4" /></IconBtn>
          <IconBtn onClick={duplicate} title="Duplicate"><Copy className="w-4 h-4" /></IconBtn>
          <IconBtn onClick={mirror} title="Mirror"><FlipHorizontal2 className="w-4 h-4" /></IconBtn>
          <IconBtn onClick={dropToPlane} title="Drop to workplane"><ArrowDownToLine className="w-4 h-4" /></IconBtn>
          <IconBtn onClick={doGroup} disabled={sel.length < 2} title="Group"><Group className="w-4 h-4" /></IconBtn>
          {one?.type === 'group' && <IconBtn onClick={doUngroup} title="Ungroup"><Ungroup className="w-4 h-4" /></IconBtn>}
          <IconBtn onClick={remove} title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></IconBtn>
        </>}
        <select value={snap} onChange={(e) => setSnap(Number(e.target.value))} className="ml-auto text-[11px] bg-transparent glass rounded-lg px-1.5 py-1">
          {[0.5, 1, 2, 5, 10].map(s => <option key={s} value={s}>Snap {s} mm</option>)}
        </select>
      </div>

      {/* viewport */}
      <div className="flex-1 min-h-0 relative">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Loading 3-D workplane…</div>}>
          <ErrorBoundary compact message="The 3-D workplane could not start. Your saved designs are safe.">
            <StudioView objects={objects} selected={selected} mode={mode} snap={snap} onPick={onPick} onTransform={onTransform} viewCmd={viewCmd} additive={multi} />
          </ErrorBoundary>
        </Suspense>
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          {[['home', <HomeIcon key="h" className="w-4 h-4" />], ['top', 'TOP'], ['front', 'FRT'], ['side', 'SIDE'], ['zoomin', <ZoomIn key="i" className="w-4 h-4" />], ['zoomout', <ZoomOut key="o" className="w-4 h-4" />]].map(([n, l]) => (
            <button key={n} onClick={() => setViewCmd({ name: n, t: Date.now() })} className="w-9 h-8 rounded-lg bg-white/85 text-slate-700 text-[9px] font-bold shadow flex items-center justify-center">{l}</button>
          ))}
        </div>
        {stats && (
          <div className="absolute left-2 top-2 rounded-lg bg-white/85 text-slate-700 text-[10px] px-2 py-1 shadow font-mono leading-tight">
            {stats.size[0].toFixed(1)} × {stats.size[2].toFixed(1)} × {stats.size[1].toFixed(1)} mm<br />
            ≈ {stats.grams.toFixed(0)} g PLA · ≈ ₹{stats.cost} to print
          </div>
        )}
        {objects.length === 0 && (
          <div className="absolute inset-x-0 top-1/3 text-center pointer-events-none">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tap a shape below to place it on the workplane</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">Drag to orbit · pinch to zoom · tap a shape to select it</p>
          </div>
        )}
        {busy && <div className="absolute inset-0 bg-white/40 flex items-center justify-center text-xs font-semibold text-slate-700">Working…</div>}
        {toast && <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-slate-900/90 text-white text-xs rounded-full px-3 py-1.5">{toast}</div>}

        {/* inspector */}
        {inspector && one && (
          <div className="absolute left-2 bottom-2 glass-strong rounded-xl p-2.5 space-y-1.5 w-[15.5rem] shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">{one.name || SHAPES[one.type]?.name || 'Group'} {one.hole ? '(hole)' : ''}</span>
              <button onClick={() => setInspector(false)}><X className="w-3.5 h-3.5" /></button>
            </div>
            <p className="text-[10px] text-muted-foreground">Size (mm)</p>
            {num('W', one.size[0], v => patch(one.id, { size: [Math.max(0.5, v), one.size[1], one.size[2]] }))}
            {num('D', one.size[1], v => patch(one.id, { size: [one.size[0], Math.max(0.5, v), one.size[2]] }))}
            {num('H', one.size[2], v => patch(one.id, { size: [one.size[0], one.size[1], Math.max(0.5, v)] }))}
            <p className="text-[10px] text-muted-foreground">Position (mm) · Y = height above workplane</p>
            {num('X', one.pos[0], v => patch(one.id, { pos: [v, one.pos[1], one.pos[2]] }))}
            {num('Z', one.pos[2], v => patch(one.id, { pos: [one.pos[0], one.pos[1], v] }))}
            {num('Y', one.pos[1], v => patch(one.id, { pos: [one.pos[0], v, one.pos[2]] }))}
            <p className="text-[10px] text-muted-foreground">Rotate (°)</p>
            {num('↻', one.rot?.[1] || 0, v => patch(one.id, { rot: [one.rot?.[0] || 0, v, one.rot?.[2] || 0] }), 15)}
            {num('X°', one.rot?.[0] || 0, v => patch(one.id, { rot: [v, one.rot?.[1] || 0, one.rot?.[2] || 0] }), 15)}
            {!one.hole && (
              <div className="flex flex-wrap gap-1 pt-1">
                {COLORS.map(c => <button key={c} onClick={() => patch(one.id, { color: c })} className={`w-5 h-5 rounded-full border ${one.color === c ? 'ring-2 ring-cyan-400' : 'border-black/20'}`} style={{ background: c }} />)}
              </div>
            )}
          </div>
        )}
        {sel.length >= 2 && (
          <div className="absolute left-2 bottom-2 glass-strong rounded-xl p-2 flex gap-1 text-[10px]">
            <span className="self-center text-muted-foreground mr-1">Align to first:</span>
            <button onClick={() => align(0)} className="px-2 py-1 rounded glass">X</button>
            <button onClick={() => align(2)} className="px-2 py-1 rounded glass">Z</button>
            <button onClick={() => align(1)} className="px-2 py-1 rounded glass">Height</button>
          </div>
        )}
      </div>

      {showBuildAnything && (
        <BuildAnything3D onBuild={placeRobot} onClose={() => setShowBuildAnything(false)} />
      )}
      {showRobotPlan && robotPlan && (
        <BuildAnything3D initial={robotPlan} onBuild={() => { setShowRobotPlan(false); setShowBuildAnything(true); }} onClose={() => setShowRobotPlan(false)} />
      )}

      {/* bottom drawer */}
      <div className="glass-strong border-t border-border safe-area-bottom">
        <div className="flex text-[11px] font-semibold border-b border-border">
          {[['shapes', 'Shapes', Box], ['parts', 'Robot parts', Layers], ['project', 'Projects', ClipboardList]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setDrawer(d => (d === id ? null : id))} className={`flex-1 py-2 flex items-center justify-center gap-1 ${drawer === id ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-muted-foreground'}`}>
              <Icon className="w-3.5 h-3.5" /> {label}{id === 'project' && project ? ` · ${checks.filter(c => c.ok).length}/${checks.length}` : ''}
            </button>
          ))}
        </div>
        {drawer === 'shapes' && (
          <div className="px-2 py-2">
            <div className="flex items-center gap-2 mb-1.5 text-[11px]">
              <span className="text-muted-foreground">Add as</span>
              <button onClick={() => setAsHole(false)} className={`px-2 py-0.5 rounded-full ${!asHole ? 'bg-red-500 text-white' : 'glass'}`}>Solid</button>
              <button onClick={() => setAsHole(true)} className={`px-2 py-0.5 rounded-full ${asHole ? 'bg-slate-500 text-white' : 'glass'}`}>Hole</button>
              <span className="text-[10px] text-muted-foreground ml-auto hidden sm:inline">Holes cut through solids when you Group them</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {Object.entries(SHAPES).map(([k, s]) => (
                <button key={k} onClick={() => addShape(k)} className="shrink-0 w-16 rounded-xl glass py-1.5 flex flex-col items-center gap-0.5">
                  <ShapeIcon type={k} /><span className="text-[9px]">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {drawer === 'parts' && (
          <div className="px-2 py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
            {PARTS.map(p => (
              <button key={p.id} onClick={() => addPart(p)} className="shrink-0 w-32 rounded-xl glass p-2 text-left">
                <span className="block w-4 h-4 rounded mb-1" style={{ background: p.color }} />
                <span className="block text-[11px] font-semibold leading-tight">{p.name}</span>
                <span className="block text-[9px] text-muted-foreground leading-tight">{p.note}</span>
              </button>
            ))}
          </div>
        )}
        {drawer === 'project' && (
          <div className="px-3 py-2 max-h-[38vh] overflow-y-auto">
            {!project ? (
              <div className="space-y-1.5">
                <p className="text-[11px] text-muted-foreground">Guided design tasks — the checklist ticks itself as your model meets the specification.</p>
                {PROJECTS.map(p => (
                  <button key={p.id} onClick={() => setProjectId(p.id)} className="w-full text-left glass rounded-xl p-2.5 flex items-start gap-2">
                    {designDone[p.id] ? <Check className="w-4 h-4 text-green-500 mt-0.5" /> : <ClipboardList className="w-4 h-4 text-cyan-400 mt-0.5" />}
                    <span className="flex-1">
                      <span className="block text-xs font-semibold">{p.title} <span className="text-[10px] text-violet-400">{p.level}</span></span>
                      <span className="block text-[10px] text-muted-foreground">{p.brief}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold">{project.title}</p>
                  <button onClick={() => setProjectId(null)} className="text-[10px] text-cyan-400">All projects</button>
                </div>
                <p className="text-[11px] text-muted-foreground mb-1.5">{project.brief}</p>
                <ol className="list-decimal ml-4 text-[11px] space-y-0.5 mb-2">{project.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
                <div className="space-y-0.5">
                  {checks.map((c, i) => (
                    <p key={i} className={`text-[11px] flex items-center gap-1.5 ${c.ok ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {c.ok ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5 h-3.5 rounded-full border border-current inline-block" />} {c.label}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showFiles && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowFiles(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-sm glass-strong rounded-2xl p-4 max-h-[75vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold">My designs</h2>
              <button onClick={() => setShowFiles(false)}><X className="w-4 h-4" /></button>
            </div>
            <button onClick={newDesign} className="w-full mb-2 py-2 rounded-xl glass text-xs font-semibold flex items-center justify-center gap-1.5"><FilePlus2 className="w-4 h-4" /> New design</button>
            {loadAll().map(d => (
              <div key={d.id} className="flex items-center gap-2 glass rounded-xl p-2.5 mb-1.5">
                <button onClick={() => open(d)} className="flex-1 text-left">
                  <p className="text-xs font-semibold">{d.name}</p>
                  <p className="text-[10px] text-muted-foreground">{d.objects.length} objects · {new Date(d.updated).toLocaleDateString()}</p>
                </button>
                <button onClick={() => { if (window.confirm(`Delete "${d.name}"?`)) { saveAll(loadAll().filter(x => x.id !== d.id)); setShowFiles(f => !f); setTimeout(() => setShowFiles(true), 0); } }}><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            ))}
            {!loadAll().length && <p className="text-xs text-muted-foreground text-center py-4">No saved designs yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, ...p }) {
  return <button {...p} className="p-1.5 rounded-lg glass text-cyan-400 disabled:opacity-30 shrink-0">{children}</button>;
}
function Seg({ active, children, ...p }) {
  return <button {...p} className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold ${active ? 'bg-cyan-500 text-white' : 'glass text-foreground'}`}>{children}</button>;
}
