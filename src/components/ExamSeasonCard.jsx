import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { todaysPlan, localDay } from '@/lib/examPlan';
import { CalendarClock, Check, ChevronRight, Settings2 } from 'lucide-react';

const PRESETS = ['Half-yearly exam', 'Pre-board', 'Annual exam', 'Board exam', 'Final exam', 'Unit test'];

/** Exam-season mode: countdown + today's checklist. Shows a small "set exam date" prompt when off. */
export default function ExamSeasonCard() {
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass, updateProgress, addXP } = useApp();
  const progress = getProgressForClass(selectedClass);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({ name: progress.examSeason?.name || PRESETS[0], date: progress.examSeason?.date || '' }));
  const plan = todaysPlan(selectedClass, progress);

  const save = () => { updateProgress(selectedClass, { examSeason: form.date ? { ...form } : null }); setEditing(false); };
  const toggle = (id) => {
    const day = localDay();
    const all = { ...(progress.examPlanDone || {}) };
    const cur = all[day] || [];
    const on = !cur.includes(id);
    all[day] = on ? [...cur, id] : cur.filter(x => x !== id);
    // keep only the last 30 days
    Object.keys(all).sort().slice(0, -30).forEach(k => delete all[k]);
    updateProgress(selectedClass, { examPlanDone: all });
    if (on) addXP(selectedClass, 5);
  };

  if (editing) {
    return (
      <div className="glass-strong rounded-2xl p-4 space-y-2">
        <p className="text-sm font-bold flex items-center gap-2"><CalendarClock className="w-4 h-4 text-amber-400" /> Exam-season mode</p>
        <select value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-xs bg-transparent">
          {PRESETS.map(p => <option key={p}>{p}</option>)}
        </select>
        <input type="date" value={form.date} min={localDay()} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-xs bg-transparent" />
        <div className="flex gap-2">
          <button onClick={save} className="flex-1 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold">{form.date ? 'Start my plan' : 'Turn off'}</button>
          <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-xl glass text-xs">Cancel</button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <button onClick={() => setEditing(true)} className="w-full glass-strong rounded-2xl p-3 flex items-center gap-3 text-left">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center"><CalendarClock className="w-4 h-4 text-amber-400" /></div>
        <div className="flex-1">
          <p className="text-xs font-bold">Exams coming up?</p>
          <p className="text-[10px] text-muted-foreground">Set the date — get a day-by-day revision plan.</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  const doneN = plan.tasks.filter(t => t.done).length;
  return (
    <div className="glass-strong rounded-2xl p-4 border border-amber-500/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-center px-2">
          <p className="text-2xl font-black text-amber-400 leading-none tabular-nums">{plan.left}</p>
          <p className="text-[9px] text-muted-foreground">{plan.left === 1 ? 'day' : 'days'} left</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{plan.exam.name}</p>
          <p className="text-[10px] text-muted-foreground">{plan.left === 0 ? 'Today — all the best! Stay calm and read every question twice.' : plan.left <= 6 ? 'Final week: full papers, no new chapters.' : `${plan.remaining} chapters to strengthen · about ${plan.perDay} a day`}</p>
        </div>
        <button onClick={() => setEditing(true)} aria-label="Change exam"><Settings2 className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Today · {doneN}/{plan.tasks.length}</p>
      <div className="space-y-1.5">
        {plan.tasks.map(t => (
          <div key={t.id} className="flex items-center gap-2">
            <button onClick={() => toggle(t.id)} className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${t.done ? 'bg-green-500 border-green-500' : 'border-muted-foreground/40'}`} aria-label="Mark done">
              {t.done && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            <button onClick={() => navigate(t.to)} className={`flex-1 text-left text-xs ${t.done ? 'line-through text-muted-foreground' : ''}`}>{t.label}</button>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
