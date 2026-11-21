// Home note: how many high-fives a student got from classmates today.
import React, { useEffect, useState } from 'react';
import { Hand } from 'lucide-react';

export default function HighFiveNote() {
  const [got, setGot] = useState([]);
  useEffect(() => {
    let live = true;
    import('@/api/leaderboard')
      .then(lb => lb.myHighFivesToday())
      .then(list => { if (live) setGot(list); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  if (!got.length) return null;
  const emojis = [...new Set(got.map(g => g.emoji))].join(' ');
  return (
    <div className="glass-strong rounded-2xl p-3 flex items-center gap-3 border border-cyan-500/30 animate-slide-up">
      <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center"><Hand className="w-4 h-4 text-cyan-400" /></div>
      <div className="flex-1">
        <p className="text-xs font-bold text-cyan-400">{got.length} high-five{got.length > 1 ? 's' : ''} from classmates today</p>
        <p className="text-[11px] text-muted-foreground">{emojis} From your group. Keep going.</p>
      </div>
    </div>
  );
}
