import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { LAB_EXPERIMENTS } from '@/lib/lab/labExperiments';
import { SHAPES } from '@/lib/design/shapes';
import { PROJECTS as DESIGN_PROJECTS } from '@/lib/design/parts';
import { useInk } from '@/lib/ui/ink';
import { Cpu, Bot, Cog, Trophy, ChevronRight, FileText, Plus, Clock, Boxes, CircuitBoard, Wand2 } from 'lucide-react';

// Always a list, whatever is actually in storage: a corrupt or older value
// used to reach .slice() and take the Build screen down.
const read = (k) => {
  try { const v = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(v) ? v : []; }
  catch { return []; }
};
const ago = (t) => {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
};

/** Tinkercad-style studio tile: a big entry into one workspace. */
function StudioTile({ icon: Icon, color, kicker, title, blurb, cta, onOpen, children }) {
  const ink = useInk();
  const fill = ink.fill(color);
  const fillDeep = ink.fill(color, 6);
  return (
    <div className="glass-strong rounded-3xl overflow-hidden">
      <button onClick={onOpen} className="w-full text-left p-4 flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}1f` }}>
          <Icon className="w-6 h-6" style={{ color: ink(color, 0.12) }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-wider" style={{ color: ink(color) }}>{kicker}</p>
          <p className="text-base font-bold leading-tight">{title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{blurb}</p>
        </div>
      </button>
      {children}
      <button aria-label="Add" onClick={onOpen} className="w-full py-3 text-xs font-bold text-white flex items-center justify-center gap-1.5" style={{ background: `linear-gradient(90deg, ${fillDeep}, ${fill})` }}>
        <Plus className="w-4 h-4" /> {cta}
      </button>
    </div>
  );
}

function RecentRow({ items, onOpen, empty }) {
  if (!items.length) return <p className="px-4 pb-3 text-[11px] text-muted-foreground">{empty}</p>;
  return (
    <div className="px-3 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
      {items.map(it => (
        <button key={it.id} onClick={() => onOpen(it)} className="shrink-0 w-32 rounded-xl glass border border-border p-2 text-left">
          <p className="text-[11px] font-semibold truncate">{it.name}</p>
          <p className="text-[9px] text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="w-2.5 h-2.5" /> {it.when}</p>
        </button>
      ))}
    </div>
  );
}

const EXTRAS = [
  { path: '/arena', icon: Bot, color: '#38bdf8', title: 'Robot Arena 3D', sub: 'Write Arduino code and watch a real robot obey it — line follower, maze, PID.', key: 'arena' },
  { path: '/mechanisms', icon: Cog, color: '#a3e635', title: 'Mechanism Lab', sub: 'Linkages, robot-arm kinematics, gear trains and degrees of freedom.', key: 'mech' },
  { path: '/challenges', icon: Trophy, color: '#a78bfa', title: 'Engineering Challenges', sub: 'Design problems with real constraints and trade-offs.' },
  { path: '/assessment', icon: FileText, color: '#34d399', title: 'Practical File', sub: 'CISCE assignments, variable tables and a printable practical file.' },
];

export default function BuildHub() {
  const navigate = useNavigate();
  const ink = useInk();
  const { selectedClass, getProgressForClass } = useApp();
  const p = getProgressForClass(selectedClass);
  const count = (k) => Object.values(p[k] || {}).filter(v => (typeof v === 'object' ? v?.passed : v)).length;

  const builds = useMemo(() => read('robocraft_lab_builds').slice(-6).reverse()
    .map(b => ({ id: b.id, name: b.name, when: b.id?.startsWith('b') ? ago(Number(b.id.slice(1)) || Date.now()) : 'saved' })), []);
  const designs = useMemo(() => read('robocraft_designs').slice(0, 6)
    .map(d => ({ id: d.id, name: d.name, when: ago(d.updated || Date.now()) })), []);

  const pyProjects = useMemo(() => read('robocraft_py_projects').filter(p => p && p.title).slice(0, 6)
    .map(p => ({ id: p.id, name: p.title, when: ago(p.when || Date.now()) })), []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-10">
      <h1 className="text-xl font-bold">Build</h1>
      <p className="text-xs text-muted-foreground mb-4">Three workspaces: wire a circuit in 2-D, model a part in 3-D, or have Python projects made and explained for you. Everything runs inside the app.</p>

      <div className="space-y-3">
        <StudioTile icon={CircuitBoard} color="#f97316" kicker="2D · CIRCUITS"
          title="Circuit Lab" blurb="Place parts, wire them pin to pin, write the Arduino sketch and press Run."
          cta="New circuit" onOpen={() => navigate('/lab')}>
          <div className="px-4 pb-2 flex flex-wrap gap-1">
            {LAB_EXPERIMENTS.slice(0, 5).map(e => (
              <span key={e.id} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500">{e.icon} {e.title}</span>
            ))}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{LAB_EXPERIMENTS.length - 5} more</span>
          </div>
          <RecentRow items={builds} onOpen={() => navigate('/lab')} empty="No saved circuits yet — start from a project or from scratch." />
        </StudioTile>

        <StudioTile icon={Boxes} color="#fb7185" kicker="3D · DESIGN"
          title="3D Design Studio" blurb="Solid shapes and holes, group to cut, real robot parts, STL export for 3-D printing."
          cta="New 3D design" onOpen={() => navigate('/design')}>
          <div className="px-4 pb-2 flex flex-wrap gap-1">
            {Object.values(SHAPES).slice(0, 6).map(s => (
              <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">{s.name}</span>
            ))}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{DESIGN_PROJECTS.length} guided projects</span>
          </div>
          <RecentRow items={designs} onOpen={() => navigate('/design')} empty="No saved designs yet — start with a box and a hole." />
        </StudioTile>

        <StudioTile icon={Wand2} color="#10b981" kicker="PYTHON · PROJECTS"
          title="Python Project Maker" blurb="Say what you want to build. Get working Python, then learn every line and operator in it."
          cta="New Python project" onOpen={() => navigate('/pyproject')}>
          <div className="px-4 pb-2 flex flex-wrap gap-1">
            {['Calculator', 'Marks & grades', 'Guessing game', 'Bank account', 'Chatbot'].map(n => (
              <span key={n} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">{n}</span>
            ))}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">or anything you imagine</span>
          </div>
          <RecentRow items={pyProjects} onOpen={() => navigate('/pyproject')} empty="No saved Python projects yet — describe one and press Make." />
        </StudioTile>
      </div>

      <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-6 mb-2">Also in Build</h2>
      <div className="space-y-2">
        {EXTRAS.map(c => {
          const Icon = c.icon;
          const n = c.key ? count(c.key) : 0;
          return (
            <button key={c.path} onClick={() => navigate(c.path)} className="w-full glass-strong rounded-2xl p-3 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}1f` }}>
                <Icon className="w-5 h-5" style={{ color: ink(c.color, 0.12) }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{c.title}{n > 0 && <span className="ml-2 text-[10px] text-green-500">{n} done</span>}</p>
                <p className="text-[11px] text-muted-foreground">{c.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center mt-5 flex items-center justify-center gap-1">
        <Cpu className="w-3 h-3" /> The same Arduino code runs in the Circuit Lab, the Robot Arena and on a real Arduino Uno.
      </p>
    </div>
  );
}
