// Skill tree: the ten levels as a path. Each node unlocks when the student reaches its XP.
import React from 'react';
import { LEVELS, getLevel } from '@/lib/gamification';
import { Lock, Check } from 'lucide-react';

export default function SkillTree({ xp = 0 }) {
  const info = getLevel(xp);
  const current = info.levelNumber;
  return (
    <div className="glass-strong rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-sm">Skill tree</p>
        <p className="text-[11px] text-muted-foreground">{current} of {LEVELS.length} unlocked</p>
      </div>
      <ol className="relative">
        {LEVELS.map((lvl, i) => {
          const unlocked = xp >= lvl.xpRequired;
          const isCurrent = lvl.level === current;
          const last = i === LEVELS.length - 1;
          return (
            <li key={lvl.level} className="flex gap-3 relative pb-4 last:pb-0">
              {!last && (
                <span className="absolute left-[15px] top-8 bottom-0 w-0.5 rounded-full"
                  style={{ background: unlocked && xp >= (LEVELS[i + 1]?.xpRequired ?? Infinity) ? lvl.color : 'hsl(var(--muted))' }} />
              )}
              <span
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 ${isCurrent ? 'animate-pulse-glow' : ''}`}
                style={unlocked
                  ? { background: lvl.color, borderColor: lvl.color, color: '#0f172a' }
                  : { background: 'transparent', borderColor: 'hsl(var(--muted-foreground) / 0.4)', color: 'hsl(var(--muted-foreground))' }}
                aria-label={unlocked ? `Level ${lvl.level} unlocked` : `Level ${lvl.level} locked`}
              >
                {unlocked && !isCurrent ? <Check className="w-4 h-4" /> : unlocked ? lvl.level : <Lock className="w-3.5 h-3.5" />}
              </span>
              <div className="pt-1 min-w-0">
                <p className={`text-sm font-semibold ${unlocked ? '' : 'text-muted-foreground'}`}>{lvl.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {isCurrent && info.next ? `${info.xpToNext} XP to ${info.next.title}` : unlocked ? `Unlocked at ${lvl.xpRequired} XP` : `Unlocks at ${lvl.xpRequired} XP`}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
