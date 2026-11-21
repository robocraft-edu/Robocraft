import React, { useEffect, useState, useCallback } from 'react';
import BackButton from '@/components/BackButton';
import { toast } from '@/components/ui/use-toast';
import { Camera, Loader2, Trash2, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

const MAX_CHARS = 140;

export default function Community() {
  const { user, isGuest } = useApp();
  const [gallery, setGallery] = useState(null);
  const [mine, setMine] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const signedIn = !!user && !isGuest;

  const load = useCallback(async () => {
    if (!signedIn) return;
    const api = await import('@/api/community');
    try {
      const [g, m] = await Promise.all([api.approvedPosts(), api.myPosts()]);
      setGallery(g);
      setMine(m);
    } catch {
      setGallery([]);
    }
  }, [signedIn]);

  useEffect(() => { load(); }, [load]);

  const pick = async (file) => {
    try {
      const api = await import('@/api/community');
      setPhoto(await api.compressPhoto(file));
    } catch (e) {
      toast({ title: 'Photo not added', description: e.message });
    }
  };

  const share = async () => {
    if (!photo) return toast({ title: 'Add a photo first' });
    setBusy(true);
    try {
      const [api, lb] = await Promise.all([import('@/api/community'), import('@/api/leaderboard')]);
      const me = await lb.getMyEntry().catch(() => null);
      await api.submitPost({ caption, image: photo, nickname: me?.nickname, avatar: me?.avatar });
      setPhoto(null);
      setCaption('');
      toast({ title: 'Sent for approval', description: 'It will show in the gallery once it has been checked.' });
      load();
    } catch (e) {
      toast({ title: 'Not sent', description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    const api = await import('@/api/community');
    await api.deleteMyPost(id);
    setMine(m => m.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-5">
      <BackButton />
      <div>
        <h1 className="text-2xl font-bold gradient-text">Robot Gallery</h1>
        <p className="text-sm text-muted-foreground">Show off what you built. Photos are checked before other students can see them.</p>
      </div>

      {!signedIn ? (
        <p className="glass-strong rounded-2xl p-4 text-sm">Sign in to share a photo of your robot and see the gallery.</p>
      ) : (
        <>
          <section className="glass-strong rounded-2xl p-4 space-y-3">
            <p className="font-bold text-sm">Share your robot</p>
            <label className="block">
              <span className="sr-only">Choose a photo</span>
              <input type="file" accept="image/*" onChange={e => pick(e.target.files?.[0])} className="block w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:glass file:text-xs" />
            </label>
            {photo && <img src={photo} alt="Your robot, ready to send" className="w-full max-h-72 object-contain rounded-xl bg-black/20" />}
            <textarea value={caption} onChange={e => setCaption(e.target.value.slice(0, MAX_CHARS))} rows={2} placeholder="What did you build? (short)"
              className="w-full glass rounded-xl px-3 py-2 text-sm outline-none border border-border" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{caption.length}/{MAX_CHARS}</span>
              <button onClick={share} disabled={busy || !photo} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5">
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />} Send for approval
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-start gap-1.5"><ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Only photos are allowed for now. Location and camera details are removed. No one can comment on posts.</p>
          </section>

          {mine.length > 0 && (
            <section className="space-y-2">
              <p className="font-bold text-sm">Your posts</p>
              {mine.map(p => (
                <div key={p.id} className="glass rounded-xl p-3 flex items-center gap-3">
                  <img src={p.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{p.caption || 'No caption'}</p>
                    <p className={`text-[11px] font-semibold ${p.status === 'approved' ? 'text-green-500' : 'text-amber-500'}`}>{p.status === 'approved' ? 'Shown in the gallery' : 'Waiting for approval'}</p>
                  </div>
                  <button onClick={() => remove(p.id)} aria-label="Delete this post" className="p-2 rounded-lg glass"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              ))}
            </section>
          )}

          <section className="space-y-3">
            <p className="font-bold text-sm">Gallery</p>
            {gallery === null ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /></div>
            ) : gallery.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-6">No approved photos yet. Be the first!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map(p => (
                  <figure key={p.id} className="glass rounded-xl overflow-hidden">
                    <img src={p.image} alt={p.caption || 'Robot photo'} loading="lazy" className="w-full aspect-square object-cover" />
                    <figcaption className="p-2">
                      <p className="text-[11px] font-bold truncate">{p.avatar} {p.nickname}</p>
                      {p.caption && <p className="text-[11px] text-muted-foreground line-clamp-2">{p.caption}</p>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
