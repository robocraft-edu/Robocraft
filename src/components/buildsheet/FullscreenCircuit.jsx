import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, Info, Maximize2, ListOrdered } from 'lucide-react';
import CircuitDiagram from '@/components/buildsheet/CircuitDiagram';
import { COMPONENT_INFO } from '@/components/buildsheet/RealisticComponents';

export default function FullscreenCircuit({ pinConnections, projectName, onClose }) {
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [highlightWire, setHighlightWire] = useState(null);
  const [showWires, setShowWires] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef({ moved: false, dist: 0, k: 1 });
  const size = useRef({ w: 1200, h: 800 });
  const MIN_K = 0.15, MAX_K = 4;

  // Open large enough to read: fit the width, but never smaller than half size, top-left aligned.
  const fit = useCallback((readable = true) => {
    const box = containerRef.current;
    const svg = contentRef.current?.querySelector('svg');
    if (!box || !svg) return;
    const vb = svg.viewBox.baseVal;
    size.current = { w: vb.width || 1200, h: vb.height || 800 };
    const kw = box.clientWidth / size.current.w;
    const kh = box.clientHeight / size.current.h;
    const k = readable ? Math.max(Math.min(kw, 1), Math.min(0.6, Math.max(kw, kh))) : Math.min(kw, kh);
    setView({ k, x: Math.max(0, (box.clientWidth - size.current.w * k) / 2), y: 0 });
  }, []);
  useEffect(() => { const t = setTimeout(() => fit(true), 60); return () => clearTimeout(t); }, [fit, pinConnections]);

  const zoomAt = useCallback((cx, cy, factor) => {
    setView(v => {
      const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor));
      const f = k / v.k;
      return { k, x: cx - (cx - v.x) * f, y: cy - (cy - v.y) * f };
    });
  }, []);
  const zoomCentre = (factor) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) zoomAt(r.width / 2, r.height / 2, factor);
  };

  const rel = (e) => {
    const r = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onPointerDown = (e) => {
    pointers.current.set(e.pointerId, rel(e));
    gesture.current.moved = false;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.dist = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = rel(e);
    pointers.current.set(e.pointerId, cur);
    if (pointers.current.size === 1) {
      const dx = cur.x - prev.x, dy = cur.y - prev.y;
      if (Math.abs(dx) + Math.abs(dy) > 1) gesture.current.moved = true;
      setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (gesture.current.dist > 0) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, dist / gesture.current.dist);
      gesture.current.dist = dist;
      gesture.current.moved = true;
    }
  };
  const onPointerUp = (e) => { pointers.current.delete(e.pointerId); gesture.current.dist = 0; };
  useEffect(() => {
    const box = containerRef.current;
    if (!box) return undefined;
    const wheel = (e) => {
      e.preventDefault();
      const r = box.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 1 / 1.12);
    };
    box.addEventListener('wheel', wheel, { passive: false });
    return () => box.removeEventListener('wheel', wheel);
  }, [zoomAt]);

  // Collect component IDs from pin connections for the info panel
  const componentIds = pinConnections?.reduce((acc, conn) => {
    if (conn.componentId && !acc.includes(conn.componentId)) acc.push(conn.componentId);
    if (conn.controllerId && !acc.includes(conn.controllerId)) acc.push(conn.controllerId);
    return acc;
  }, []) || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 glass-strong border-b border-cyan-500/20" style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-2">
          <Maximize2 className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm gradient-text">{projectName} — Circuit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => zoomCentre(1 / 1.25)} className="p-2 rounded-lg glass text-cyan-400 hover:bg-cyan-500/10">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs glass px-2.5 py-1 rounded-lg text-cyan-400 min-w-[52px] text-center font-mono">{Math.round(view.k * 100)}%</span>
          <button onClick={() => zoomCentre(1.25)} className="p-2 rounded-lg glass text-cyan-400 hover:bg-cyan-500/10">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => fit(false)} className="text-xs glass px-3 py-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 font-bold">
            Fit
          </button>
          <button aria-label="Close" onClick={onClose} className="p-2 rounded-lg glass text-red-400 hover:bg-red-500/10 tap-target">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas + Side panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ background: '#0F172A', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={(e) => { if (gesture.current.moved) { e.stopPropagation(); e.preventDefault(); gesture.current.moved = false; } }}
        >
          <div
            ref={contentRef}
            className="absolute left-0 top-0"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: '0 0', willChange: 'transform' }}
          >
            <CircuitDiagram
              natural
              pinConnections={pinConnections}
              projectName={projectName}
              onComponentClick={setSelectedComponent}
              highlightWire={highlightWire}
            />
          </div>

          {/* Hint */}
          <div className="absolute bottom-3 left-3 text-[10px] glass-strong px-3 py-1.5 rounded-lg text-muted-foreground pointer-events-none">
            {typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches ? 'Drag to pan · Pinch to zoom · Tap a wire or component' : 'Drag to pan · Scroll to zoom · Tap a wire or component'}
          </div>

          {/* Wire list (tap to highlight) */}
          {pinConnections && pinConnections.length > 0 && !showWires && (
            <button onClick={() => setShowWires(true)} className="absolute top-3 right-3 glass-strong rounded-xl px-3 py-2 text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5" /> Wires ({pinConnections.length})
            </button>
          )}
          {pinConnections && pinConnections.length > 0 && showWires && (
            <div className="absolute top-3 right-3 glass-strong rounded-xl p-2 max-h-[55%] overflow-y-auto" style={{ minWidth: '200px' }} onPointerDown={(e) => e.stopPropagation()}>
              <button onClick={() => setShowWires(false)} aria-label="Hide wire list" className="absolute right-1 top-1 p-1 text-muted-foreground hover:text-cyan-400"><X className="w-3.5 h-3.5" /></button>
              <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 px-1 py-1 flex items-center gap-1">
                <Info className="w-3 h-3" /> Wires ({pinConnections.length})
              </p>
              {pinConnections.map((conn, i) => {
                const colors = { red: '#EF4444', black: '#1A1A1A', blue: '#3B82F6', green: '#22C55E', purple: '#A78BFA', yellow: '#F59E0B' };
                const color = colors[conn.wireColor] || conn.color || '#64748B';
                return (
                  <button
                    key={i}
                    onClick={() => setHighlightWire(highlightWire === i ? null : i)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${highlightWire === i ? 'bg-cyan-500/15' : 'hover:bg-cyan-500/5'}`}
                  >
                    <span className="w-4 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[10px] text-foreground/90 truncate">
                      <span className="text-cyan-400 font-bold">{conn.controllerPin}</span> → {conn.componentPin}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Component info panel */}
        {selectedComponent && COMPONENT_INFO[selectedComponent] && (
          <div className="fixed bottom-0 inset-x-0 z-10 max-h-[45%] md:static md:max-h-none md:w-72 glass-strong border-t md:border-t-0 md:border-l border-cyan-500/20 p-4 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-cyan-400">{COMPONENT_INFO[selectedComponent].name}</h3>
              <button onClick={() => setSelectedComponent(null)} className="p-1 rounded-lg glass text-muted-foreground hover:text-cyan-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{COMPONENT_INFO[selectedComponent].description}</p>
            <div className="mt-3 glass rounded-lg p-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Pin Connections</p>
              <div className="space-y-1">
                {pinConnections.filter(c => c.componentId === selectedComponent).map((c, i) => (
                  <div key={i} className="text-[10px] flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold">{c.controllerPin}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground/80">{c.componentPin}</span>
                  </div>
                ))}
                {pinConnections.filter(c => c.componentId === selectedComponent).length === 0 && (
                  <p className="text-[10px] text-muted-foreground">No specific connections shown. This component is part of the circuit.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}