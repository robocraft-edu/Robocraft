import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, RotateCcw, Terminal, Keyboard, Loader2, Lightbulb } from 'lucide-react';
import { runPython } from '@/lib/python/runner';

/**
 * A small Python editor with a Run button. Output (and charts) appear below.
 */
export default function PythonRunner({ initialCode = '', initialInput = '', task, note, title = 'Try it in Python', onRun, onCodeChange, storageKey }) {
  const saved = () => { try { return storageKey ? localStorage.getItem(storageKey) : null; } catch { return null; } };
  const [code, setCode] = useState(() => saved() ?? initialCode);
  const [input, setInput] = useState(initialInput);
  const [showInput, setShowInput] = useState(!!initialInput || /input\(/.test(initialCode));
  const [output, setOutput] = useState([]);
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const stopRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => { if (onCodeChange) onCodeChange(code); }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!storageKey) return;
    const t = setTimeout(() => { try { localStorage.setItem(storageKey, code); } catch { /* ignore */ } }, 500);
    return () => clearTimeout(t);
  }, [code, storageKey]);

  useEffect(() => () => { if (stopRef.current && running) stopRef.current(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const run = () => {
    setOutput([]);
    setStatus('');
    setRunning(true);
    setHasRun(true);
    stopRef.current = runPython(code, {
      input,
      onEvent: (ev) => {
        if (ev.type === 'status') setStatus(ev.text);
        else if (ev.type === 'out' || ev.type === 'err' || ev.type === 'img') { setStatus(''); setOutput(o => [...o, ev]); }
        else if (ev.type === 'done') { setRunning(false); setStatus(''); stopRef.current = null; if (ev.ok) onRun?.(); }
      },
    });
  };

  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const { selectionStart: s, selectionEnd: en } = el;
      const next = code.slice(0, s) + '    ' + code.slice(en);
      setCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!running) run();
    }
  };

  const lines = code.split('\n').length;

  return (
    <div className="glass-strong rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-xs font-bold text-green-400">{title}</span>
        <button onClick={() => { setCode(initialCode); setOutput([]); }} className="ml-auto text-[11px] text-muted-foreground flex items-center gap-1 hover:text-cyan-400" title="Reset code">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {task && (
        <p className="text-xs text-muted-foreground mb-2 flex gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" /><span><b className="text-foreground">Challenge:</b> {task}</span></p>
      )}

      <div className="rounded-xl overflow-hidden border border-border bg-[#0d1117] on-dark">
        <textarea
          ref={editorRef}
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label="Python code"
          rows={Math.min(Math.max(lines + 1, 6), 22)}
          className="w-full bg-transparent text-[#e6edf3] font-mono text-[12.5px] leading-5 p-3 outline-none resize-y whitespace-pre overflow-x-auto"
          style={{ tabSize: 4 }}
        />
      </div>

      {showInput && (
        <div className="mt-2">
          <label className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1"><Keyboard className="w-3.5 h-3.5" /> Input for input() — one answer per line</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={2} spellCheck={false}
            className="w-full glass rounded-lg p-2 font-mono text-xs outline-none border border-border" />
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        {running ? (
          <button onClick={() => stopRef.current?.()} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/90 text-white text-xs font-bold">
            <Square className="w-3.5 h-3.5" /> Stop
          </button>
        ) : (
          <button onClick={run} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold">
            <Play className="w-3.5 h-3.5" /> Run
          </button>
        )}
        {!showInput && (
          <button onClick={() => setShowInput(true)} className="text-[11px] text-muted-foreground hover:text-cyan-400">+ Add input</button>
        )}
        {note && <span className="text-[10px] text-muted-foreground ml-auto text-right">{note}</span>}
      </div>

      {(output.length > 0 || running || hasRun) && (
        <div className="mt-3 rounded-xl bg-black/80 on-dark p-3 font-mono text-[12px] leading-5 max-h-80 overflow-auto" aria-live="polite">
          {output.map((o, i) => o.type === 'img'
            ? <img key={i} src={o.src} alt="Chart from your code" className="bg-white rounded-lg my-2 max-w-full" />
            : <pre key={i} className={`whitespace-pre-wrap break-words ${o.type === 'err' ? 'text-red-400' : 'text-green-300'}`}>{o.text}</pre>)}
          {running && (
            <p className="text-cyan-300 flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> {status || 'Running…'}</p>
          )}
          {!running && output.length === 0 && <p className="text-muted-foreground">(no output)</p>}
        </div>
      )}
    </div>
  );
}
