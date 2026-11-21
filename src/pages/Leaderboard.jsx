import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { equippedItems, weekId, weeklyChallengeStatus } from '@/lib/gamification';
import { formatClass } from '@/lib/utils';
import BackButton from '@/components/BackButton';
import { toast } from '@/components/ui/use-toast';
import { Medal, Pencil, EyeOff, Eye, Users, Loader2, Coins, Check, ShieldCheck, RefreshCw, Share2 } from 'lucide-react';

export function WeeklyChallengeCard({ compact = false }) {
  const { selectedClass, getProgressForClass, claimWeeklyChallenge } = useApp();
  const progress = getProgressForClass(selectedClass);
  const st = weeklyChallengeStatus(progress);
  const pct = Math.round((st.value / st.target) * 100);
  const daysLeft = 7 - ((new Date().getDay() + 6) % 7);
  const claim = () => {
    const ch = claimWeeklyChallenge(selectedClass);
    if (ch) toast({ title: `Challenge complete! ${ch.emoji}`, description: `+${ch.coins} coins and +${ch.xp} XP` });
  };
  return (
    <div className="glass-strong rounded-2xl p-4 border border-cyan-500/20">
      <div className="flex items-center gap-3">
        <div className="text-2xl" aria-hidden>{st.challenge.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-400">Weekly challenge · {daysLeft} day{daysLeft === 1 ? '' : 's'} left</p>
          <p className="text-sm font-bold">{st.challenge.name}</p>
        </div>
        <span className="text-[11px] font-bold text-yellow-400 flex items-center gap-1"><Coins className="w-3.5 h-3.5" />{st.challenge.coins}</span>
      </div>
      <div className="mt-3 h-2 glass rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-muted-foreground">{st.value} / {st.target} {st.challenge.metric === 'xp' ? 'XP' : 'lessons'}</span>
        {st.claimed ? (
          <span className="text-[11px] font-bold text-green-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Reward claimed</span>
        ) : st.done ? (
          <button onClick={claim} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[11px] font-bold">Claim reward</button>
        ) : !compact ? <span className="text-[11px] text-muted-foreground">Keep going!</span> : null}
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass, isGuest, user } = useApp();
  const progress = getProgressForClass(selectedClass);
  const week = weekId();
  const myWeekXp = progress.weekId === week ? progress.weekXp || 0 : 0;
  const avatar = equippedItems(progress).avatar?.emoji;

  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState({ signedIn: false, rows: [] });
  const [me, setMe] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('class');
  const [editing, setEditing] = useState(false);
  const [nick, setNick] = useState('');
  const [group, setGroup] = useState('');
  const [saving, setSaving] = useState(false);

  const signedIn = !!user && !isGuest;

  const load = useCallback(async () => {
    if (!signedIn) { setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const lb = await import('@/api/leaderboard');
      const mine = await lb.getMyEntry();
      setMe(mine);
      if (mine?.isNew && myWeekXp > 0) await lb.publishScore({ classId: selectedClass, week, weekXp: myWeekXp, avatar });
      setBoard(await lb.fetchBoard(selectedClass, week));
    } catch (e) {
      setError(/permission/i.test(String(e?.message)) ? 'The leaderboard is being set up. Please try again later.' : 'Could not load the leaderboard. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, [signedIn, selectedClass, week, myWeekXp, avatar]);

  useEffect(() => { load(); }, [load]);

  const save = async (changes) => {
    setSaving(true);
    try {
      const lb = await import('@/api/leaderboard');
      if (changes.nickname !== undefined) {
        const err = lb.checkNickname(changes.nickname);
        if (err) { toast({ title: err }); setSaving(false); return; }
        changes.nickname = changes.nickname.trim();
      }
      if (changes.group !== undefined) changes.group = changes.group.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
      await lb.updateMyEntry(changes, { classId: selectedClass, week, weekXp: myWeekXp, avatar });
      setEditing(false);
      await load();
    } catch {
      toast({ title: 'Could not save. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Co-op: the whole group works towards one shared weekly target.
  const TEAM_TARGET = 500;
  const teamXp = me?.group ? board.rows.filter(r => r.group === me.group).reduce((s, r) => s + (r.weekXp || 0), 0) : 0;
  const [sentTo, setSentTo] = useState(() => new Set());
  const highFive = async (r, emoji = '🙌') => {
    try {
      const lb = await import('@/api/leaderboard');
      await lb.sendHighFive(r.id, emoji);
      setSentTo(s => new Set(s).add(r.id));
      toast({ title: `${emoji} High-five sent to ${r.nickname}` });
    } catch (e) {
      toast({ title: 'Not sent', description: e?.code === 'permission-denied' ? 'You already sent one to them today.' : (e?.message || 'Try again later.') });
    }
  };
  const rows = tab === 'group' && me?.group ? board.rows.filter(r => r.group === me.group) : board.rows;
  const myRank = rows.findIndex(r => r.me) + 1;
  const top = rows.slice(0, 50);
  const medal = (i) => ['🥇', '🥈', '🥉'][i] || null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-4">
      <BackButton />
      <div className="flex items-center gap-3 animate-slide-up">
        <div className="w-11 h-11 rounded-2xl bg-pink-500/15 flex items-center justify-center"><Medal className="w-5 h-5 text-pink-400" /></div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Leaderboard</h1>
          <p className="text-xs text-muted-foreground">{formatClass(selectedClass)} · XP earned this week (resets every Monday)</p>
        </div>
        {signedIn && <button onClick={load} className="p-2 rounded-lg glass tap-target" aria-label="Refresh"><RefreshCw className="w-4 h-4 text-muted-foreground" /></button>}
      </div>

      <WeeklyChallengeCard />

      {!signedIn ? (
        <div className="glass-strong rounded-2xl p-5 text-center">
          <p className="text-sm font-bold mb-1">Sign in to join the leaderboard</p>
          <p className="text-xs text-muted-foreground mb-3">Compete with other students using a nickname. Your name and email are never shown.</p>
          <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">Sign in</button>
        </div>
      ) : (
        <>
          {/* My settings */}
          {me && (
            <div className="glass-strong rounded-2xl p-4">
              {!editing ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>{avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{me.nickname}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {me.hidden ? 'Hidden from the leaderboard' : myRank ? `Rank #${myRank} · ${myWeekXp} XP this week` : `${myWeekXp} XP this week — earn XP to appear`}
                      {me.group ? ` · Group ${me.group}` : ''}
                    </p>
                  </div>
                  <button onClick={() => { setNick(me.nickname); setGroup(me.group || ''); setEditing(true); }} className="p-2 rounded-lg glass" aria-label="Edit nickname and group"><Pencil className="w-4 h-4 text-cyan-400" /></button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-[11px] text-muted-foreground">Nickname (no real names)</span>
                    <input value={nick} onChange={e => setNick(e.target.value)} maxLength={16} className="mt-1 w-full glass rounded-lg px-3 py-2 text-sm outline-none border border-border" />
                  </label>
                  <label className="block">
                    <span className="text-[11px] text-muted-foreground">Group code (optional — share it with classmates to see a class-only board)</span>
                    <input value={group} onChange={e => setGroup(e.target.value)} maxLength={12} placeholder="e.g. DPS9B" className="mt-1 w-full glass rounded-lg px-3 py-2 text-sm outline-none border border-border uppercase" />
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-xl glass text-xs font-bold">Cancel</button>
                    <button disabled={saving} onClick={() => save({ nickname: nick, group })} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-60">
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
              <button disabled={saving} onClick={() => save({ hidden: !me.hidden })}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl glass text-[11px] font-bold text-muted-foreground hover:text-cyan-400">
                {me.hidden ? <><Eye className="w-3.5 h-3.5" /> Show me on the leaderboard</> : <><EyeOff className="w-3.5 h-3.5" /> Hide me from the leaderboard</>}
              </button>
            </div>
          )}

          {me && !me.group && !editing && (
            <button onClick={() => { setNick(me.nickname); setGroup(''); setEditing(true); }} className="w-full glass-strong rounded-2xl p-3 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center"><Users className="w-4 h-4 text-violet-400" /></div>
              <div className="flex-1">
                <p className="text-xs font-bold">Study with your class</p>
                <p className="text-[10px] text-muted-foreground">Agree one group code with your classmates or teacher (e.g. CMS11A) to get a class-only board.</p>
              </div>
            </button>
          )}

          {me?.group && !editing && (
            <button onClick={async () => {
              const text = `Join my RoboCraft class group: ${me.group}\nOpen RoboCraft → Leaderboard → edit → Group code → type ${me.group}`;
              try {
                if (navigator.share) await navigator.share({ title: 'RoboCraft class group', text });
                else { await navigator.clipboard.writeText(text); toast({ title: 'Copied', description: 'Group invite copied — paste it in your class group.' }); }
              } catch { /* cancelled */ }
            }} className="w-full glass rounded-xl py-2.5 text-[11px] font-bold text-violet-400 flex items-center justify-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Invite classmates to group {me.group}
            </button>
          )}

          {me?.group && (
            <div className="flex gap-2">
              {[['class', 'Everyone'], ['group', `Group ${me.group}`]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-full text-xs font-bold ${tab === id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'glass text-muted-foreground'}`}>
                  {id === 'group' && <Users className="w-3.5 h-3.5 inline mr-1" />}{label}
                </button>
              ))}
            </div>
          )}

          {me?.group && tab === 'group' && !loading && (
            <div className="glass-strong rounded-2xl p-4 mb-3 border border-cyan-500/30">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">🤝 Team quest: Group {me.group}</span>
                <span className="text-xs text-muted-foreground">{Math.min(teamXp, TEAM_TARGET)} / {TEAM_TARGET} XP</span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all" style={{ width: `${Math.min(100, (teamXp / TEAM_TARGET) * 100)}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">{teamXp >= TEAM_TARGET ? 'Team goal reached this week! 🎉' : 'Every lesson and quiz from your group adds up. Reach the target together.'}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /></div>
          ) : error ? (
            <p className="text-xs text-center text-muted-foreground py-6">{error}</p>
          ) : top.length === 0 ? (
            <p className="text-xs text-center text-muted-foreground py-6">No one is on the board yet this week. Finish a lesson to be the first!</p>
          ) : (
            <div className="space-y-2">
              {top.map((r, i) => (
                <div key={r.id} className={`rounded-xl p-3 flex items-center gap-3 ${r.me ? 'glass-strong ring-2 ring-cyan-400' : 'glass'}`}>
                  <span className="w-7 text-center text-sm font-bold text-muted-foreground">{medal(i) || i + 1}</span>
                  <span className="text-xl" aria-hidden>{r.avatar || '🤖'}</span>
                  <span className="flex-1 text-sm font-medium truncate">{r.nickname}{r.me ? ' (you)' : ''}</span>
                  <span className="text-sm font-bold text-cyan-400">{r.weekXp} XP</span>
                  {tab === 'group' && !r.me && (
                    <button onClick={() => highFive(r)} disabled={sentTo.has(r.id)} aria-label={`High-five ${r.nickname}`}
                      className="text-base px-2 py-1 rounded-lg glass disabled:opacity-40">{sentTo.has(r.id) ? '✅' : '🙌'}</button>
                  )}
                </div>
              ))}
              {myRank > 50 && (
                <p className="text-xs text-center text-muted-foreground">You are #{myRank} with {myWeekXp} XP</p>
              )}
            </div>
          )}
          <p className="text-[10px] text-muted-foreground flex items-start gap-1.5"><ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Only your nickname, avatar and weekly XP are shared — never your name, email or school.</p>
        </>
      )}
    </div>
  );
}
