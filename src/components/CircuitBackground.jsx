import React, { useEffect, useRef } from 'react';

// Animated app background: faint circuit-board traces with glowing pulses that
// travel along them, over slowly drifting colour glows. Drawn on one canvas,
// capped at 30 fps, paused while the tab is hidden, and drawn once (still) when
// the device asks for reduced motion. Colours follow the theme and the
// Reward Shop accent.
const CELL = 46;

function rand(a, b) { return a + Math.random() * (b - a); }

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const ac = (n) => (cs.getPropertyValue(`--ac-${n}`).trim() || '16 185 129').split(/\s+/).map(Number);
  const dark = document.documentElement.classList.contains('dark');
  return { dark, a400: ac(400), a500: ac(500), a600: ac(600), blue: [59, 130, 246] };
}
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// A trace is a polyline on the grid: mostly straight runs with 90° or 45° turns.
function makeTrace(cols, rows) {
  let x = Math.floor(rand(0, cols)), y = Math.floor(rand(0, rows));
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  let d = dirs[Math.floor(rand(0, 4))];
  const pts = [[x, y]];
  const segs = Math.floor(rand(3, 7));
  for (let i = 0; i < segs; i++) {
    const len = Math.floor(rand(2, 7));
    x += d[0] * len; y += d[1] * len;
    pts.push([x, y]);
    // turn by 45° or 90°
    const idx = dirs.indexOf(d);
    const turns = idx < 4 ? [4, 5, 6, 7, (idx + 1) % 4, (idx + 3) % 4] : [0, 1, 2, 3];
    d = dirs[turns[Math.floor(rand(0, turns.length))]];
  }
  const pix = pts.map(([px, py]) => [px * CELL, py * CELL]);
  let total = 0;
  const lens = [];
  for (let i = 1; i < pix.length; i++) {
    const l = Math.hypot(pix[i][0] - pix[i - 1][0], pix[i][1] - pix[i - 1][1]);
    lens.push(l); total += l;
  }
  return { pts: pix, lens, total };
}

function pointAt(tr, dist) {
  let d = dist;
  for (let i = 0; i < tr.lens.length; i++) {
    if (d <= tr.lens[i]) {
      const t = d / tr.lens[i];
      const [x0, y0] = tr.pts[i], [x1, y1] = tr.pts[i + 1];
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
    }
    d -= tr.lens[i];
  }
  return tr.pts[tr.pts.length - 1];
}

export default function CircuitBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const layer = document.createElement('canvas'); // static traces, drawn once per resize/theme
    const lctx = layer.getContext('2d');
    let W = 0, H = 0, dpr = 1, traces = [], pulses = [], blobs = [], colors = readColors();
    let raf = 0, last = 0, running = true;

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      for (const c of [canvas, layer]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      const cols = Math.ceil(W / CELL) + 1, rows = Math.ceil(H / CELL) + 1;
      const count = Math.round(Math.min(46, Math.max(14, (W * H) / 26000)));
      traces = Array.from({ length: count }, () => makeTrace(cols, rows)).filter(t => t.total > CELL * 3);
      pulses = traces.filter(() => Math.random() < 0.55).map(tr => ({ tr, d: rand(0, tr.total), v: rand(40, 90) }));
      blobs = [
        { x: rand(0, W), y: rand(0, H), r: Math.max(W, H) * 0.42, vx: rand(-8, 8), vy: rand(-6, 6), c: 'a' },
        { x: rand(0, W), y: rand(0, H), r: Math.max(W, H) * 0.36, vx: rand(-8, 8), vy: rand(-6, 6), c: 'b' },
        { x: rand(0, W), y: rand(0, H), r: Math.max(W, H) * 0.30, vx: rand(-8, 8), vy: rand(-6, 6), c: 'a' },
      ];
      drawLayer();
    }

    function drawLayer() {
      colors = readColors();
      const k = colors.dark ? 1 : 0.75;
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.clearRect(0, 0, W, H);
      lctx.lineWidth = 1.2;
      lctx.lineJoin = 'round';
      lctx.strokeStyle = rgba(colors.a500, 0.13 * k);
      lctx.fillStyle = rgba(colors.a500, 0.22 * k);
      for (const tr of traces) {
        lctx.beginPath();
        tr.pts.forEach(([x, y], i) => (i ? lctx.lineTo(x, y) : lctx.moveTo(x, y)));
        lctx.stroke();
        for (const [x, y] of [tr.pts[0], tr.pts[tr.pts.length - 1]]) {
          lctx.beginPath(); lctx.arc(x, y, 3, 0, Math.PI * 2); lctx.fill();
        }
      }
    }

    function frame(t) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (t - last < 33) return; // ~30 fps
      const dt = Math.min(0.1, (t - last) / 1000 || 0.033);
      last = t;
      draw(dt);
    }

    function draw(dt) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const k = colors.dark ? 1 : 0.6;
      // drifting glows
      for (const b of blobs) {
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < -b.r * 0.3 || b.x > W + b.r * 0.3) b.vx *= -1;
        if (b.y < -b.r * 0.3 || b.y > H + b.r * 0.3) b.vy *= -1;
        const col = b.c === 'a' ? colors.a400 : colors.blue;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, rgba(col, 0.10 * k));
        g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.drawImage(layer, 0, 0, W, H);
      // pulses with a short fading tail
      for (const p of pulses) {
        p.d += p.v * dt;
        if (p.d > p.tr.total + 60) { p.d = -rand(0, 300); }
        if (p.d < 0) continue;
        for (let i = 0; i < 6; i++) {
          const d = p.d - i * 7;
          if (d < 0 || d > p.tr.total) continue;
          const [x, y] = pointAt(p.tr, d);
          ctx.beginPath();
          ctx.fillStyle = rgba(i === 0 ? colors.a400 : colors.a500, (0.85 - i * 0.14) * k);
          ctx.arc(x, y, i === 0 ? 2.6 : 2.2 - i * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
        if (p.d <= p.tr.total) {
          const [x, y] = pointAt(p.tr, p.d);
          const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
          g.addColorStop(0, rgba(colors.a400, 0.35 * k));
          g.addColorStop(1, rgba(colors.a400, 0));
          ctx.fillStyle = g;
          ctx.fillRect(x - 14, y - 14, 28, 28);
        }
      }
    }

    build();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    let resizeT = 0;
    const onResize = () => { clearTimeout(resizeT); resizeT = setTimeout(() => { build(); if (reduced) draw(0); }, 150); };
    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!reduced && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
    };
    // Re-colour when light/dark mode or the shop accent changes.
    const mo = new MutationObserver(() => { drawLayer(); if (reduced) draw(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-accent'] });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      running = false; cancelAnimationFrame(raf); clearTimeout(resizeT); mo.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }} />;
}
