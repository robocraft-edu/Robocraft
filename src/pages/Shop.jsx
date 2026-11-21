import React, { useState, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { REWARD_SHOP, MYSTERY_BOXES, equippedItems } from '@/lib/gamification';
import { Coins, Gift, Check, Lock, Sparkles, Zap, X } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { toast } from '@/components/ui/use-toast';
import Confetti from '@/components/learning/Confetti';
import { getPhotoAvatar, savePhotoAvatar } from '@/lib/photoAvatar';
import AvatarBadge from '@/components/AvatarBadge';

const TABS = [
  { id: 'avatar', label: 'Avatars' },
  { id: 'accent', label: 'Themes' },
  { id: 'frame', label: 'Frames' },
  { id: 'title', label: 'Titles' },
  { id: 'mystery', label: 'Mystery' },
];

function ItemPreview({ item }) {
  if (item.type === 'avatar' && item.photo) {
    const photo = getPhotoAvatar();
    return photo
      ? <img src={photo} alt="Your avatar photo" className="w-12 h-12 rounded-full object-cover" />
      : <span className="text-4xl" aria-hidden>{item.emoji}</span>;
  }
  if (item.type === 'avatar') return <span className="text-4xl" aria-hidden>{item.emoji}</span>;
  if (item.type === 'accent') return <span className="w-10 h-10 rounded-full shadow-lg" style={{ background: item.swatch, boxShadow: `0 0 18px ${item.swatch}80` }} />;
  if (item.type === 'frame') return (
    <span className="w-12 h-12 rounded-full p-[3px]" style={{ background: item.value === 'transparent' ? 'transparent' : item.value, border: item.value === 'transparent' ? '1px dashed currentColor' : 'none' }}>
      <span className="w-full h-full rounded-full glass flex items-center justify-center text-xl">🤖</span>
    </span>
  );
  return <span className="text-sm font-bold text-cyan-400 text-center px-1">“{item.name}”</span>;
}

// classId lets another track (Learn Python) use the same shop with its own coins.
export default function Shop({ classId, hideBack = false }) {
  const app = useApp();
  const { getProgressForClass, buyOrEquipItem, buyMysteryBox } = app;
  const selectedClass = classId || app.selectedClass;
  const progress = getProgressForClass(selectedClass);
  const coins = progress.coins || 0;
  const owned = progress.shop?.owned || [];
  const equipped = equippedItems(progress);
  const [tab, setTab] = useState('avatar');
  const [confirmItem, setConfirmItem] = useState(null);
  const [boxResult, setBoxResult] = useState(null);
  const [, setPhotoTick] = useState(0);   // redraw the badge after a new photo
  const fileRef = useRef(null);

  const items = REWARD_SHOP.filter(i => i.type === tab);

  const pickPhoto = () => fileRef.current?.click();

  const onPhotoChosen = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      await savePhotoAvatar(file);
      buyOrEquipItem(selectedClass, 'av_photo');
      setPhotoTick(n => n + 1);
      toast({ title: 'Photo set as your avatar', description: 'It stays on this phone — nobody else can see it.' });
    } catch (err) {
      toast({ title: 'Could not use that picture', description: err.message });
    }
  };

  const handleItem = (item) => {
    const isOwned = item.cost === 0 || owned.includes(item.id);
    if (item.photo && isOwned) { pickPhoto(); return; }
    if (isOwned) {
      buyOrEquipItem(selectedClass, item.id);
      toast({ title: `${item.name} equipped` });
      return;
    }
    if (coins < item.cost) {
      toast({ title: 'Not enough coins yet', description: `You need ${item.cost - coins} more. Finish lessons and quizzes to earn coins.` });
      return;
    }
    setConfirmItem(item);
  };

  const confirmBuy = () => {
    const item = confirmItem;
    setConfirmItem(null);
    const outcome = buyOrEquipItem(selectedClass, item.id);
    if (item.photo) { pickPhoto(); return; }
    if (outcome === 'bought') toast({ title: `You got ${item.name}! 🎉`, description: 'It is now equipped.' });
  };

  const openBox = (box) => {
    if (coins < box.cost) {
      toast({ title: 'Not enough coins yet', description: `You need ${box.cost - coins} more coins.` });
      return;
    }
    const res = buyMysteryBox(selectedClass, box.id);
    if (res) setBoxResult(res);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28">
      {!hideBack && <BackButton className="mb-3" />}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <AvatarBadge progress={progress} size={52} />
          <div>
            <h1 className="text-xl font-bold">Reward Shop</h1>
            <p className="text-xs text-muted-foreground">{equipped.title?.name}</p>
          </div>
        </div>
        <div className="glass-strong rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="font-bold text-yellow-400">{coins}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{classId ? 'Earn coins by passing quizzes (+5), solving tasks (+10) and building projects (+25). Spend them here.' : 'Earn coins by finishing lessons (+10), quizzes (+2 per correct answer), flash cards and missions. Spend them here.'}</p>

      {/* The picture is read here, resized and kept on this device. It is
          never uploaded and never appears on the leaderboard. */}
      <input ref={fileRef} type="file" accept="image/*" onChange={onPhotoChosen} className="hidden" aria-hidden="true" tabIndex={-1} />

      {tab === 'avatar' && (
        <p className="text-[11px] text-muted-foreground mb-3 glass rounded-xl p-2.5 leading-relaxed">
          Your own photo stays on this phone. It is shown to you inside the app only — the leaderboard always
          shows an emoji, so no one else ever sees your picture.
        </p>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === t.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'glass text-muted-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab !== 'mystery' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map(item => {
            const isOwned = item.cost === 0 || owned.includes(item.id);
            const isEquipped = equipped[item.type]?.id === item.id;
            const affordable = coins >= item.cost;
            return (
              <button key={item.id} onClick={() => handleItem(item)}
                className={`glass-strong rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-[1.02] ${isEquipped ? 'ring-2 ring-cyan-400' : ''}`}>
                <div className="h-14 flex items-center justify-center"><ItemPreview item={item} /></div>
                {item.type !== 'title' && <p className="text-xs font-bold text-center">{item.name}</p>}
                {isEquipped ? (
                  <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Equipped</span>
                ) : isOwned ? (
                  <span className="text-[11px] font-bold text-muted-foreground">Owned · tap to use</span>
                ) : (
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${affordable ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                    {affordable ? <Coins className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} {item.cost}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {MYSTERY_BOXES.map(box => (
            <div key={box.id} className="glass-strong rounded-2xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${box.color}25` }}>
                <Gift className="w-7 h-7" style={{ color: box.color }} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{box.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {box.rewards.map(r => `${r.min}–${r.max} ${r.type === 'xp' ? 'XP' : 'coins'}`).join(' + ')}
                </p>
              </div>
              <button onClick={() => openBox(box)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 ${coins >= box.cost ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'glass text-muted-foreground'}`}>
                <Coins className="w-3.5 h-3.5" /> {box.cost}
              </button>
            </div>
          ))}
          <p className="text-[11px] text-muted-foreground text-center">Every box always gives XP and some coins back.</p>
        </div>
      )}

      {confirmItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setConfirmItem(null)}>
          <div className="bg-background border border-border rounded-2xl p-5 w-full max-w-xs text-center" onClick={e => e.stopPropagation()}>
            <div className="h-16 flex items-center justify-center mb-2"><ItemPreview item={confirmItem} /></div>
            <h3 className="font-bold mb-1">Buy {confirmItem.name}?</h3>
            <p className="text-xs text-muted-foreground mb-4">Costs {confirmItem.cost} coins. You will have {coins - confirmItem.cost} left.</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setConfirmItem(null)} className="py-2.5 rounded-xl glass text-sm font-bold">Cancel</button>
              <button onClick={confirmBuy} className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold">Buy</button>
            </div>
          </div>
        </div>
      )}

      {boxResult && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setBoxResult(null)}>
          <Confetti trigger={!!boxResult} />
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-xs text-center relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setBoxResult(null)} className="absolute top-3 right-3 text-muted-foreground" aria-label="Close"><X className="w-4 h-4" /></button>
            <Sparkles className="w-10 h-10 mx-auto mb-2" style={{ color: boxResult.box.color }} />
            <h3 className="font-bold mb-3">{boxResult.box.name} opened!</h3>
            <div className="space-y-2">
              {boxResult.rewards.map((r, i) => (
                <div key={i} className="glass rounded-xl py-2 flex items-center justify-center gap-2 font-bold">
                  {r.type === 'xp' ? <Zap className="w-4 h-4 text-cyan-400" /> : <Coins className="w-4 h-4 text-yellow-400" />}
                  +{r.amount} {r.type === 'xp' ? 'XP' : 'coins'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
