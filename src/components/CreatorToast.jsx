import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const SHOW_MS = 4000;
const AWAY_MS = 60 * 1000; // coming back after a minute away counts as opening the app again
const HIDE_ON = ['/creator', '/about', '/splash'];

async function buzz() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Medium });
      setTimeout(() => Haptics.impact({ style: ImpactStyle.Light }).catch(() => {}), 140);
      return;
    }
  } catch { /* not in the Android app */ }
  try { navigator.vibrate?.([70, 60, 70]); } catch { /* browsers that cannot vibrate (iPhone, desktop) */ }
}

// "Meet the creator" banner: every time the app is opened or brought back from the background.
export default function CreatorToast() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const path = useRef(pathname);
  path.current = pathname;

  useEffect(() => {
    let timer;
    const pop = (delay) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (HIDE_ON.some(p => path.current.startsWith(p))) return;
        setShow(true); buzz();
      }, delay);
    };
    pop(1200); // app opened / page loaded
    let hiddenAt = 0;
    const onVis = () => {
      if (document.hidden) { hiddenAt = Date.now(); setShow(false); }
      else if (hiddenAt && Date.now() - hiddenAt > AWAY_MS) pop(600);
    };
    document.addEventListener('visibilitychange', onVis);
    // Android app: resume from the background
    let sub;
    import('@capacitor/core').then(({ Capacitor }) => {
      if (!Capacitor.isNativePlatform()) return;
      import('@capacitor/app').then(({ App }) => {
        let away = 0;
        App.addListener('appStateChange', ({ isActive }) => {
          if (!isActive) away = Date.now();
          else if (away && Date.now() - away > AWAY_MS) pop(600);
        }).then(h => { sub = h; });
      });
    }).catch(() => {});
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', onVis); sub?.remove?.(); };
  }, []);

  useEffect(() => {
    if (!show) return undefined;
    const t = setTimeout(() => setShow(false), SHOW_MS);
    return () => clearTimeout(t);
  }, [show]);

  const open = () => { setShow(false); navigate('/creator'); };
  return (
    <AnimatePresence>
      {show && (
        <motion.div role="status" className="fixed left-0 right-0 z-[200] flex justify-center px-3 pointer-events-none" style={{ top: 'calc(env(safe-area-inset-top) + 10px)' }}
          initial={{ y: -120, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -120, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}>
          <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} onDragEnd={(_, i) => { if (i.offset.y < -30) setShow(false); }}
            className="pointer-events-auto relative overflow-hidden w-full max-w-sm rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-cyan-400/30 flex items-center gap-3 pl-2 pr-2 py-2">
            <button onClick={open} className="flex items-center gap-3 flex-1 min-w-0 text-left">
              <span className="relative w-11 h-11 shrink-0 rounded-full p-[2px] bg-[conic-gradient(#06b6d4,#2563eb,#a855f7,#22c55e,#06b6d4)]">
                <img src={`${import.meta.env.BASE_URL}about-photo.jpg`} alt="" className="w-full h-full rounded-full object-cover border-2 border-slate-900" />
                <motion.span className="absolute -right-0.5 -bottom-0.5 text-sm" animate={{ rotate: [0, 18, -8, 18, 0] }} transition={{ duration: 1, delay: 0.3 }}>👋</motion.span>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">Meet the creator</span>
                <span className="block text-[11px] text-slate-300 truncate">Aryan built RoboCraft · tap to say hi</span>
              </span>
            </button>
            <button onClick={() => setShow(false)} aria-label="Close" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white shrink-0"><X className="w-4 h-4" /></button>
            <motion.span className="absolute left-0 bottom-0 h-[3px] w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 origin-left"
              initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: SHOW_MS / 1000, ease: 'linear' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
