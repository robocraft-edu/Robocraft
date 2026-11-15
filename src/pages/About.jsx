import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, useReducedMotion, animate } from 'framer-motion';
import { ArrowLeft, ChevronDown, Sparkles, Mail, Github } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

const BASE = import.meta.env.BASE_URL;
const EASE = [0.16, 1, 0.3, 1];
const PHOTO = `${BASE}about-photo.jpg`;

// ── living background: drifting particles that link up and follow your finger ──
function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let w, h, raf = 0, running = true, frame = 0;
    const phone = window.innerWidth < 640;
    const dpr = phone ? 1 : Math.min(1.5, window.devicePixelRatio || 1);
    const mouse = { x: -999, y: -999 };
    const pts = [];
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(w < 640 ? 34 : 60, (w * h) / 12000));
      pts.length = 0;
      for (let i = 0; i < n; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6 });
    };
    const move = (e) => { const r = c.getBoundingClientRect(); const t = e.touches?.[0] || e; mouse.x = t.clientX - r.left; mouse.y = t.clientY - r.top; };
    const leave = () => { mouse.x = mouse.y = -999; };
    const tick = () => {
      // phones: 30 frames a second is smooth for slow-moving dots and halves the work;
      // skip drawing once the hero has scrolled mostly away
      frame++;
      if ((phone && frame % 2) || window.scrollY > h * 0.7) { if (running) raf = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 160) { p.vx += dx / d * 0.012; p.vy += dy / d * 0.012; }
        p.vx *= 0.99; p.vy *= 0.99; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        if (phone) { p.x += p.vx; p.y += p.vy; } // same speed at half the frames
      }
      // lines grouped into 4 strengths, so the canvas strokes 4 paths instead of hundreds
      const groups = [[], [], [], []];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 14400) groups[Math.min(3, Math.floor(Math.sqrt(d2) / 30))].push(a, b);
        }
      }
      ctx.lineWidth = 0.7;
      groups.forEach((g, k) => {
        if (!g.length) return;
        ctx.strokeStyle = `rgba(34,211,238,${0.32 - k * 0.075})`; ctx.beginPath();
        for (let m = 0; m < g.length; m += 2) { ctx.moveTo(g[m].x, g[m].y); ctx.lineTo(g[m + 1].x, g[m + 1].y); }
        ctx.stroke();
      });
      ctx.fillStyle = 'rgba(165,243,252,0.9)'; ctx.beginPath();
      for (const a of pts) { ctx.moveTo(a.x + a.r, a.y); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); }
      ctx.fill();
      if (running) raf = requestAnimationFrame(tick);
    };
    const setRun = (on) => { if (on && !running) { running = true; raf = requestAnimationFrame(tick); } else if (!on) { running = false; cancelAnimationFrame(raf); } };
    const io = new IntersectionObserver(([e]) => setRun(e.isIntersecting && !document.hidden));
    io.observe(c);
    const vis = () => setRun(!document.hidden);
    document.addEventListener('visibilitychange', vis);
    resize(); tick();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('pointerleave', leave);
    return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange', vis); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); window.removeEventListener('touchmove', move); window.removeEventListener('pointerleave', leave); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden />;
}

// ── the photo: circle reveal, 3D tilt, spinning rings, orbiting icons, light sweep ──
function HeroPhoto({ still }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [14, -14]), { stiffness: 140, damping: 14 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 140, damping: 14 });
  const glareX = useTransform(mx, [-1, 1], ['10%', '90%']);
  const glare = useTransform(glareX, x => `radial-gradient(circle at ${x} 30%, rgba(255,255,255,.5), transparent 50%)`);
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1); };
  const reset = () => { mx.set(0); my.set(0); };
  const icons = ['🤖', '🐍', '⚡', '📚', '🛠️', '🏆'];
  return (
    <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]" style={{ perspective: 900 }} onPointerMove={onMove} onPointerLeave={reset}>
      {/* glow (entrance once, then a CSS pulse that runs on the GPU) */}
      <motion.div className="absolute -inset-12" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2, ease: EASE }}>
        <div className="ab-anim ab-pulse absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,211,238,.45) 0%, rgba(37,99,235,.28) 35%, rgba(168,85,247,.15) 55%, transparent 70%)' }} />
      </motion.div>
      {/* orbiting icons */}
      {!still && (
        <div className="ab-anim ab-spin absolute -inset-8" style={{ animationDuration: '22s' }}>
          {icons.map((ic, i) => {
            const a = (i / icons.length) * Math.PI * 2;
            return (
              <motion.span key={ic} className="absolute w-10 h-10 -ml-5 -mt-5" style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%` }}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ opacity: { delay: 1.6 + i * 0.12 }, scale: { delay: 1.6 + i * 0.12, type: 'spring', stiffness: 260, damping: 14 } }}>
                <span className="ab-anim ab-spin ab-rev w-full h-full rounded-full flex items-center justify-center text-lg bg-slate-800/90 border border-white/20 shadow-lg" style={{ animationDuration: '22s' }}>{ic}</span>
              </motion.span>
            );
          })}
        </div>
      )}
      <motion.div className="relative w-full h-full" style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}>
        {/* two rings spinning opposite ways */}
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
          <div className="ab-anim ab-spin absolute inset-0 rounded-full" style={{ animationDuration: '4s', background: 'conic-gradient(#22d3ee, transparent 30%, #a855f7 50%, transparent 75%, #22d3ee)' }} />
        </motion.div>
        <motion.div className="absolute inset-[5px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
          <div className="ab-anim ab-spin ab-rev absolute inset-0 rounded-full" style={{ animationDuration: '6s', background: 'conic-gradient(#2563eb, transparent 40%, #22c55e 60%, transparent 85%, #2563eb)' }} />
        </motion.div>
        {/* the photo itself */}
        <motion.div className="absolute inset-[10px] rounded-full overflow-hidden bg-slate-900 border-4 border-[#070b16] will-change-transform" style={{ transform: 'translateZ(40px)' }}
          initial={{ clipPath: 'circle(0% at 50% 50%)', filter: 'blur(14px) saturate(0) brightness(1.6)', scale: 1.35 }}
          animate={{ clipPath: 'circle(75% at 50% 50%)', filter: 'blur(0px) saturate(1) brightness(1)', scale: 1 }}
          transition={{ duration: 1.6, delay: 0.35, ease: EASE }}>
          <img src={PHOTO} alt="Aryan, the creator of RoboCraft" className="w-full h-full object-cover" draggable={false} />
          {/* moving glare that follows the tilt */}
          <motion.div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: glare }} />
          {/* light sweep */}
          {!still && <div className="ab-anim ab-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />}
        </motion.div>
      </motion.div>
    </div>
  );
}

function SplitName({ text, delay = 0 }) {
  return (
    <span className="inline-flex overflow-hidden pb-1" style={{ perspective: 600 }}>
      {[...text].map((ch, i) => (
        <motion.span key={i} className="inline-block" style={{ transformOrigin: '50% 100%' }}
          initial={{ y: '110%', rotateX: -90, opacity: 0 }}
          animate={{ y: 0, rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}>{ch === ' ' ? ' ' : ch}</motion.span>
      ))}
    </span>
  );
}

function Typewriter({ words, delay = 0 }) {
  const [i, setI] = useState(0), [n, setN] = useState(0), [del, setDel] = useState(false), [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), delay * 1000); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!go) return undefined;
    const w = words[i];
    const t = setTimeout(() => {
      if (!del && n < w.length) setN(n + 1);
      else if (!del) setDel(true);
      else if (n > 0) setN(n - 1);
      else { setDel(false); setI((i + 1) % words.length); }
    }, !del && n === w.length ? 1600 : del ? 35 : 70);
    return () => clearTimeout(t);
  }, [go, n, del, i, words]);
  return <span>{words[i].slice(0, n)}<span className="inline-block w-[2px] h-[1em] align-[-0.15em] ml-0.5 bg-cyan-300 animate-pulse" /></span>;
}

// words light up one by one as you scroll through the story
function ScrollWords({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="text-2xl sm:text-3xl font-bold leading-snug flex flex-wrap gap-x-2 gap-y-1">
      {words.map((w, i) => <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
    </p>
  );
}
function Word({ p, range, children }) {
  const o = useTransform(p, range, [0.15, 1]);
  const y = useTransform(p, range, [8, 0]);
  return <motion.span style={{ opacity: o, y }}>{children}</motion.span>;
}

function Counter({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null), inView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    if (!inView) return undefined;
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: x => { if (ref.current) ref.current.textContent = `${prefix}${Math.round(x)}${suffix}`; } });
    return () => c.stop();
  }, [inView, to, prefix, suffix]);
  return <span ref={ref} className="whitespace-nowrap">{prefix}0{suffix}</span>;
}

// card with a light that follows the pointer
function Spot({ children, className = '', i = 0 }) {
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`); };
  return (
    <motion.div onPointerMove={onMove}
      initial={{ opacity: 0, y: 50, rotateX: -35, scale: 0.92 }} whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: EASE }} whileHover={{ y: -6, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-4 ${className}`}
      style={{ transformPerspective: 800, backgroundImage: 'radial-gradient(240px circle at var(--x,-200px) var(--y,-200px), rgba(34,211,238,.18), transparent 60%)' }}>
      {children}
    </motion.div>
  );
}

function Magnetic({ children, onClick, className }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 12 }), sy = useSpring(y, { stiffness: 200, damping: 12 });
  return (
    <motion.button onClick={onClick} className={className} style={{ x: sx, y: sy }} whileTap={{ scale: 0.94 }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.3); y.set((e.clientY - r.top - r.height / 2) * 0.4); }}
      onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.button>
  );
}

const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, delay, ease: EASE }}>{children}</motion.div>
);

const STATS = [
  [105, '', '+', 'Robotics & AI lessons'],
  [3, '', '', 'Classes: 9, 10 and 11'],
  [32, '', '', 'Python lessons, beginner to advanced'],
  [100, '', '%', 'Free, with no ads'],
];

const CSS = `
.ab-anim { will-change: transform; }
.ab-spin { animation: ab-spin linear infinite; }
.ab-rev { animation-direction: reverse; }
.ab-pulse { animation: ab-pulse 3.5s ease-in-out infinite; will-change: opacity; }
.ab-sweep { animation: ab-sweep 4.9s ease-in-out 2.2s infinite; transform: translateX(-150%) skewX(-12deg); }
.ab-bob { animation: ab-bob 1.8s ease-in-out infinite; }
.ab-d1 { animation: ab-d1 16s ease-in-out infinite; } .ab-d2 { animation: ab-d2 18s ease-in-out infinite; } .ab-d3 { animation: ab-d3 20s ease-in-out infinite; }
@keyframes ab-spin { to { transform: rotate(360deg); } }
@keyframes ab-pulse { 0%, 100% { opacity: .65; } 50% { opacity: 1; } }
@keyframes ab-sweep { 0% { transform: translateX(-150%) skewX(-12deg); } 29%, 100% { transform: translateX(400%) skewX(-12deg); } }
@keyframes ab-bob { 50% { transform: translateY(8px); } }
@keyframes ab-d1 { 50% { transform: translate3d(80px, 60px, 0); } }
@keyframes ab-d2 { 50% { transform: translate3d(-70px, -50px, 0); } }
@keyframes ab-d3 { 33% { transform: translate3d(-60px, 0, 0); } 66% { transform: translate3d(40px, 0, 0); } }
@media (prefers-reduced-motion: reduce) { .ab-anim { animation: none !important; } }
`;

const FEATURES = [
  ['📚', 'Robotics & AI lessons', 'ICSE and ISC chapters in simple language, with board-style practice.'],
  ['🐍', 'Learn Python', '32 lessons from beginner to advanced, Hindi videos, quizzes and projects.'],
  ['🛠️', '3D Design Studio', 'Build robots from realistic parts and test them in a 3D arena.'],
  ['⚡', 'Circuit lab', 'Wire up circuits and see them work, safely, on your phone.'],
  ['📝', 'Practical file maker', 'Type what you need and get a complete, tested practical file.'],
  ['🏆', 'XP, coins & shop', 'Streaks, levels and rewards that make learning feel like a game.'],
];

export default function About() {
  const navigate = useNavigate();
  const { user, isGuest } = useApp();
  const reduce = useReducedMotion();
  const hero = useRef(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { scrollYProgress: page } = useScroll();
  const bar = useSpring(page, { stiffness: 120, damping: 25 });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const start = () => navigate(user || isGuest ? '/' : '/splash');

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 overflow-x-hidden selection:bg-cyan-400/30">
      <style>{CSS}</style>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" style={{ scaleX: bar }} />
      <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} aria-label="Back"
        className="fixed z-50 left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center" style={{ top: 'calc(env(safe-area-inset-top) + 14px)' }}>
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* ── HERO: photo first ── */}
      <section ref={hero} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* aurora */}
        <div className="absolute inset-0" aria-hidden>
          <div className="ab-anim ab-d1 absolute w-[60vmax] h-[60vmax] -top-[20vmax] -left-[15vmax] rounded-full will-change-transform bg-[radial-gradient(circle,rgba(6,182,212,.30),transparent_65%)]" />
          <div className="ab-anim ab-d2 absolute w-[50vmax] h-[50vmax] -bottom-[20vmax] -right-[10vmax] rounded-full will-change-transform bg-[radial-gradient(circle,rgba(192,38,211,.24),transparent_65%)]" />
          <div className="ab-anim ab-d3 absolute w-[40vmax] h-[40vmax] top-1/3 left-1/2 rounded-full will-change-transform bg-[radial-gradient(circle,rgba(37,99,235,.24),transparent_65%)]" />
        </div>
        {!reduce && <ParticleField />}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />

        <motion.div className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-24" style={reduce ? {} : { y: heroY, scale: heroScale, opacity: heroFade }}>
          <HeroPhoto still={reduce} />
          <motion.p className="mt-12 text-xs font-bold tracking-[0.35em] text-cyan-300/90" initial={{ opacity: 0, letterSpacing: '0.9em' }} animate={{ opacity: 1, letterSpacing: '0.35em' }} transition={{ duration: 1.2, delay: 1.1, ease: EASE }}>
            THE CREATOR OF ROBOCRAFT
          </motion.p>
          <h1 className="mt-2 text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-br from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            <SplitName text="Hi, I'm Aryan" delay={1.25} />
          </h1>
          <motion.p className="mt-3 text-lg sm:text-xl text-slate-300 h-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
            <Typewriter delay={2.1} words={['Just a student who loves to build', 'Learning by making things', 'RoboCraft started as my idea']} />
          </motion.p>
          <motion.div className="mt-12 flex flex-col items-center text-slate-400 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
            <span className="ab-anim ab-bob flex flex-col items-center">Scroll to know more <ChevronDown className="w-5 h-5 mt-1" /></span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STORY ── */}
      <section className="relative max-w-3xl mx-auto px-6 py-20">
        <Reveal><p className="text-xs font-bold tracking-[0.3em] text-cyan-400 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4" /> WHY I BUILT THIS</p></Reveal>
        <ScrollWords text="I wanted robotics and coding to feel easy and fun for every student, not just the ones with a lab or a tutor. So I built the app I wished I had: RoboCraft, from the lessons to the 3D robot builder." />
      </section>

      {/* ── NUMBERS ── */}
      <section className="max-w-3xl mx-auto px-6 pb-16 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(([n, pre, suf, label], i) => (
          <Spot key={label} i={i} className="text-center">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-white to-cyan-300 bg-clip-text text-transparent px-1 leading-tight"><Counter to={n} prefix={pre} suffix={suf} /></p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">{label}</p>
          </Spot>
        ))}
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <Reveal><h2 className="text-3xl sm:text-4xl font-black mb-6">What's inside <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">RoboCraft</span></h2></Reveal>
        <div className="grid sm:grid-cols-2 gap-3">
          {FEATURES.map(([e, t, d], i) => (
            <Spot key={t} i={i}>
              <span className="text-3xl">{e}</span>
              <p className="font-bold mt-2">{t}</p>
              <p className="text-sm text-slate-400 mt-1">{d}</p>
            </Spot>
          ))}
        </div>
      </section>

      {/* ── PROMISE + CONTACT ── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <Reveal className="rounded-3xl p-6 border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-fuchsia-600/10">
          <h2 className="text-2xl font-black mb-3">My promise</h2>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>✅ RoboCraft is free to use, with no ads.</li>
            <li>🔒 Your data stays private. <a href={`${BASE}privacy.html`} className="text-cyan-300 underline">Privacy policy</a></li>
            <li>💬 I keep improving it based on what students tell me.</li>
          </ul>
          <div className="flex flex-wrap gap-2 mt-5">
            <a href={`${BASE}contact.html`} className="text-sm px-4 py-2 rounded-full bg-white/10 border border-white/15 flex items-center gap-2"><Mail className="w-4 h-4" /> Contact me</a>
            <a href="https://github.com/robocraft-edu/Robocraft" target="_blank" rel="noopener noreferrer" className="text-sm px-4 py-2 rounded-full bg-white/10 border border-white/15 flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</a>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
        <Reveal>
          <p className="text-slate-400 mb-4">Ready to build something?</p>
          <Magnetic onClick={start} className="px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 shadow-[0_0_40px_rgba(34,211,238,.35)]">
            Start learning 🚀
          </Magnetic>
          <p className="text-[11px] text-slate-500 mt-10">
            <a href={`${BASE}privacy.html`}>Privacy</a> · <a href={`${BASE}terms.html`}>Terms</a> · <a href={`${BASE}contact.html`}>Contact</a> · <a href={`${BASE}security.html`}>Security</a>
          </p>
        </Reveal>
      </section>
    </div>
  );
}
