import React from 'react';
import { RealisticComponent, REALISTIC_SIZES, REALISTIC_PINS } from './RealisticComponents';

// ── Wire colors aligned to the RoboCraft circuit legend ──────────────────────
const WIRE_COLORS = {
  red: '#DC2626', black: '#171717', blue: '#2563EB', green: '#16A34A',
  orange: '#EA580C', yellow: '#CA8A04', purple: '#A78BFA', cyan: '#0891B2',
};

const WIRE_LEGEND = [
  { color: WIRE_COLORS.red, label: '5V / Power' },
  { color: WIRE_COLORS.black, label: 'GND' },
  { color: WIRE_COLORS.blue, label: 'Digital' },
  { color: WIRE_COLORS.green, label: 'Analog' },
  { color: WIRE_COLORS.orange, label: 'PWM' },
  { color: WIRE_COLORS.yellow, label: 'Signal / Data' },
];

function resolveColor(conn) {
  if (conn.color && /^#/.test(conn.color)) return conn.color;
  if (conn.wireColor) {
    const k = String(conn.wireColor).toLowerCase();
    if (WIRE_COLORS[k]) return WIRE_COLORS[k];
  }
  return '#64748B';
}

// ── Name → component id matching (reused from prior renderer) ────────────────
export function matchComponentId(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  const idMap = {
    arduino_uno: ['arduino uno', 'arduino', 'uno', 'arduino_uno'],
    arduino_nano: ['arduino nano', 'nano'],
    esp32: ['esp32', 'esp 32'],
    esp8266: ['esp8266', 'nodemcu', 'esp8266 (nodemcu)'],
    breadboard: ['breadboard'],
    led: ['led', 'led (light'],
    rgb_led: ['rgb led', 'rgb'],
    resistor: ['resistor'],
    push_button: ['push button', 'button'],
    buzzer: ['buzzer', 'piezo'],
    servo: ['servo', 'servo motor', 'sg90'],
    gear_motor: ['gear motor', 'tt motor', 'tt gear motor', 'geared motor', 'yellow motor'],
    vibration_motor: ['vibration motor', 'vibrator'],
    aa_battery: ['aa battery', 'aa battery holder', 'aa cells'],
    dc_motor: ['dc motor', 'motor', 'dc'],
    stepper: ['stepper'],
    ultrasonic: ['ultrasonic', 'hc-sr04', 'distance sensor'],
    ir_sensor: ['ir sensor', 'ir', 'infrared'],
    ldr: ['ldr', 'light dependent'],
    temp_sensor: ['temperature sensor', 'dht11', 'temp sensor', 'dht'],
    gas_sensor: ['gas sensor', 'mq-2', 'mq2'],
    lcd: ['lcd', '16x2'],
    oled: ['oled'],
    battery: ['battery', '9v battery'],
    power_supply: ['power supply'],
    motor_driver: ['motor driver', 'l298n', 'l298'],
    bluetooth: ['bluetooth', 'hc-05', 'hc05'],
    relay: ['relay'],
    joystick: ['joystick'],
    a4988: ['a4988', 'a4988 stepper', 'stepper driver'],
    mpu6050: ['mpu6050', 'mpu 6050', 'mpu-6050', 'imu', 'gy-521', 'gy521'],
    nema17: ['nema17', 'nema 17', 'nema-17', 'nema 17 stepper', 'stepper motor', 'stepper'],
  };
  for (const [id, aliases] of Object.entries(idMap)) {
    if (aliases.some(a => lower === a)) return id;
  }
  // Longest alias wins, so "a4988 stepper driver" is not swallowed by "stepper".
  const pairs = Object.entries(idMap).flatMap(([id, aliases]) => aliases.map(a => [id, a]));
  pairs.sort((x, y) => y[1].length - x[1].length);
  for (const [id, a] of pairs) if (lower.includes(a)) return id;
  return null;
}

export function matchPinId(componentId, pinLabel) {
  if (!componentId || !pinLabel) return null;
  const pins = REALISTIC_PINS[componentId];
  if (!pins) return null;

  // "Signal (Orange)" → SIGNAL · "GPIO 21 (SDA)" → GPIO21 · "3.3V" → 3V3
  const norm = (v) => String(v).toUpperCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^A-Z0-9+-]/g, '')
    .replace(/^3\.?3V$|^33V$/, '3V3');
  const want = norm(pinLabel);
  if (!want) return null;
  if (componentId === 'motor_driver') {
    if (/^(VCC|5V|VSS|LOGIC)/.test(want)) return '5V';
    if (/^(\+?12V|VMOT|VS|BATTERY|PACK)/.test(want)) return '12V';
  }

  const by = (f) => pins.find(f);
  const hit = by(p => norm(p.id) === want) || by(p => norm(p.label) === want);
  if (hit) return hit.id;

  // D13 / GPIO13 / PIN13 all mean the same header pin
  const num = want.match(/^(?:D|GPIO|PIN|IO)?(\d{1,2})$/);
  if (num) {
    const n = num[1];
    const digital = by(p => norm(p.id) === `D${n}`) || by(p => norm(p.label) === `GPIO${n}`);
    if (digital) return digital.id;
  }
  const analog = want.match(/^A(\d)$/);
  if (analog) { const a = by(p => norm(p.id) === `A${analog[1]}`); if (a) return a.id; }

  const starts = by(p => want.startsWith(norm(p.id)) || norm(p.id).startsWith(want))
    || by(p => want.startsWith(norm(p.label)) || norm(p.label).startsWith(want));
  if (starts) return starts.id;

  // meaning-based fallbacks, so a human phrase still lands on the right pin
  const ofType = (...types) => by(p => types.includes(p.type));
  let cand = null;
  if (/^(VCC|VIN|VDD|5V|3V3|POWER|PLUS|\+|RED)/.test(want)) cand = ofType('power');
  else if (/^(GND|GROUND|MINUS|-|NEG|BROWN|BLACK)/.test(want)) cand = ofType('ground');
  else if (/^(SIG|SIGNAL|OUT|DATA|S|YELLOW|ORANGE|PULSE)/.test(want)) {
    cand = by(p => ['SIG', 'OUT', 'DATA', 'S'].includes(norm(p.id))) || ofType('pwm', 'signal', 'digital', 'analog');
  } else if (/^(ANODE|POSITIVE|LEG1|TERMINAL1|PIN1|T1|A)$/.test(want)) cand = pins[0];
  else if (/^(CATHODE|NEGATIVE|LEG2|TERMINAL2|PIN2|T2|B|C)$/.test(want)) cand = pins[1] || pins[pins.length - 1];
  else if (/^TRIGGER/.test(want)) cand = by(p => norm(p.id) === 'TRIG');
  else if (/^ECHO/.test(want)) cand = by(p => norm(p.id) === 'ECHO');
  if (cand) return cand.id;

  // Still unknown: land on the part's first signal pin rather than dropping the wire.
  return (by(p => !['power', 'ground'].includes(p.type)) || pins[0] || {}).id || null;
}

// ── Component categories for workbench placement ─────────────────────────────
const MOTOR = new Set(['dc_motor', 'gear_motor', 'vibration_motor', 'servo', 'stepper', 'nema17']);
const POWER = new Set(['battery', 'aa_battery', 'power_supply']);
const DRIVER_IDS = new Set(['motor_driver', 'a4988']);

// ── Build component instances from pin connections ───────────────────────────
function buildInstances(pinConnections) {
  let controllerId = '';
  const byName = new Map();
  pinConnections.forEach(conn => {
    if (conn.controllerId && !controllerId) controllerId = conn.controllerId;
    if (!conn.componentId && conn.component) conn.componentId = matchComponentId(conn.component);
    if (!controllerId && conn.controllerPin) controllerId = 'arduino_uno';
    const cid = conn.componentId;
    if (cid === controllerId) return;
    const key = conn.component || cid;
    if (!key) return;
    if (!byName.has(key)) byName.set(key, { key, id: cid, name: conn.component || key, conns: [], generic: !cid });
    byName.get(key).conns.push(conn);
  });
  if (!controllerId) controllerId = 'arduino_uno';

  // A part we have no artwork for still gets drawn — as a labelled module with
  // exactly the pins the wiring asks for, so no connection is ever lost.
  const dyn = {};
  for (const inst of byName.values()) {
    if (!inst.generic) continue;
    const pins = [];
    inst.conns.forEach(c => {
      const id = String(c.componentPin || 'PIN').toUpperCase();
      if (!pins.some(p => p.id === id)) pins.push({ id, label: id, type: 'signal', x: 0, y: 0 });
    });
    const h = Math.max(86, 34 + pins.length * 24);
    pins.forEach((p, i) => { p.y = 34 + i * 24; });
    dyn[inst.key] = { pins, size: { w: 150, h } };
    inst.id = `generic:${inst.key}`;
  }
  // "+12V from battery pack" on a driver means there is a pack to draw.
  const list = Array.from(byName.values());
  const needsPack = list.some(i => DRIVER_IDS.has(i.id)) && !list.some(i => POWER.has(i.id)) &&
    pinConnections.some(c => /battery|12\s*v|supply|pack/i.test(String(c.componentPin || '')));
  if (needsPack) list.push({ key: 'Battery Pack', id: 'battery', name: 'Battery Pack', conns: [], generic: false });
  return { controllerId, instances: list, dyn };
}

// ── Absolute pin position + exit side ────────────────────────────────────────
function sizeOf(compId, dyn, key) {
  if (compId && compId.startsWith('generic:')) return dyn[key]?.size || { w: 150, h: 90 };
  return REALISTIC_SIZES[compId];
}
function pinsOf(compId, dyn, key) {
  if (compId && compId.startsWith('generic:')) return dyn[key]?.pins || [];
  return REALISTIC_PINS[compId];
}

function pinAbs(pos, compId, pinId, dyn, key) {
  if (!pos || !compId) return null;
  const pins = pinsOf(compId, dyn, key);
  if (!pins) return null;
  const pin = pins.find(p => p.id === pinId);
  if (!pin) return null;
  const size = sizeOf(compId, dyn, key) || { w: pos.w, h: pos.h };
  // Parts left of the board are drawn mirrored, so their pins face it.
  const px = pos.mirror ? size.w - pin.x : pin.x;
  const x = pos.x + px;
  const y = pos.y + pin.y;
  const d = { left: px, right: size.w - px, top: pin.y, bottom: size.h - pin.y };
  const side = Object.keys(d).reduce((m, k) => (d[k] < d[m] ? k : m), 'left');
  return { x, y, side };
}

// ── Orthogonal wire routing ──────────────────────────────────────────────────
// Every wire gets its own lane, so two wires never run on top of each other and
// none cuts through a part.
const LANE = 10;
const STUB = 22;

const stubOf = (p, len = STUB) =>
  p.side === 'left' ? { x: p.x - len, y: p.y }
    : p.side === 'right' ? { x: p.x + len, y: p.y }
      : p.side === 'top' ? { x: p.x, y: p.y - len }
        : { x: p.x, y: p.y + len };

/** Polyline → SVG path with softly rounded corners. */
function roundedPath(pts, r = 7) {
  const P = pts.filter((p, i) => i === 0 || p.x !== pts[i - 1].x || p.y !== pts[i - 1].y);
  if (P.length < 3) return `M ${P[0].x} ${P[0].y} L ${P[P.length - 1].x} ${P[P.length - 1].y}`;
  let d = `M ${P[0].x} ${P[0].y}`;
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[i - 1], b = P[i], c = P[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y), l2 = Math.hypot(c.x - b.x, c.y - b.y);
    const k = Math.min(r, l1 / 2, l2 / 2);
    const p1 = { x: b.x + ((a.x - b.x) / l1) * k, y: b.y + ((a.y - b.y) / l1) * k };
    const p2 = { x: b.x + ((c.x - b.x) / l2) * k, y: b.y + ((c.y - b.y) / l2) * k };
    d += ` L ${p1.x} ${p1.y} Q ${b.x} ${b.y} ${p2.x} ${p2.y}`;
  }
  const z = P[P.length - 1];
  return `${d} L ${z.x} ${z.y}`;
}

/**
 * Lay out every wire. `ctx` carries column edges and the channels above and below
 * the whole drawing, used when a wire has to go round the back of a part.
 */
function routeWires(wires, ctx) {
  const lanes = new Map(); // channel id → wires, in drawing order
  const add = (id, w) => { if (!lanes.has(id)) lanes.set(id, []); lanes.get(id).push(w); };

  wires.forEach(w => {
    const { s, t } = w;
    const hs = s.side === 'left' || s.side === 'right';
    const ht = t.side === 'left' || t.side === 'right';
    const facing = hs && ht && ((s.side === 'right' && t.side === 'left' && t.x > s.x) || (s.side === 'left' && t.side === 'right' && t.x < s.x));
    if (facing) { w.kind = 'gap'; w.dir = t.x > s.x ? 1 : -1; add(`gap:${w.sCol}>${w.tCol}`, w); }
    else if (hs && ht) { w.kind = 'around'; w.top = s.y < ctx.midY; add(w.top ? 'top' : 'bottom', w); }
    else w.kind = 'elbow';
  });

  for (const [id, group] of lanes) {
    if (id.startsWith('gap:')) {
      // Wires that turn nearest the source never cross the ones that turn later.
      const key = (w) => {
        const down = w.t.y >= w.s.y;
        const base = down ? -w.s.y : w.s.y;
        const order = (down ? 0 : 1000000) + (w.dir > 0 ? base : -base);
        return order;
      };
      group.sort((a, b) => key(a) - key(b));
      group.forEach((w, i) => {
        const edge = w.dir > 0 ? ctx.colRight[w.sCol] : ctx.colLeft[w.sCol];
        w.laneX = edge + w.dir * (STUB + 18 + i * LANE);
      });
    } else {
      group.sort((a, b) => (id === 'top' ? a.s.y - b.s.y : b.s.y - a.s.y));
      const used = new Map();
      const slot = (k) => { const n = used.get(k) || 0; used.set(k, n + 1); return n; };
      group.forEach((w, i) => {
        w.laneY = id === 'top' ? ctx.topY - i * LANE : ctx.bottomY + i * LANE;
        w.sLen = STUB + slot(`s:${w.sCol}:${w.s.side}`) * LANE;
        w.tLen = STUB + slot(`t:${w.tCol}:${w.t.side}`) * LANE;
      });
    }
  }

  wires.forEach(w => {
    const { s, t } = w;
    const es = stubOf(s, w.sLen || STUB), et = stubOf(t, w.tLen || STUB);
    let pts;
    if (w.kind === 'gap') pts = [s, { x: w.laneX, y: s.y }, { x: w.laneX, y: t.y }, t];
    else if (w.kind === 'around') pts = [s, es, { x: es.x, y: w.laneY }, { x: et.x, y: w.laneY }, et, t];
    else {
      const hs = s.side === 'left' || s.side === 'right';
      const ht = t.side === 'left' || t.side === 'right';
      if (!hs && !ht) { const my = (es.y + et.y) / 2; pts = [s, es, { x: es.x, y: my }, { x: et.x, y: my }, et, t]; }
      else if (hs) pts = [s, es, { x: et.x, y: es.y }, et, t];
      else pts = [s, es, { x: es.x, y: et.y }, et, t];
    }
    w.d = roundedPath(pts);
  });
  return wires;
}

/** A part with no artwork: a labelled module carrying exactly its wired pins. */
function GenericModule({ name, x, y, size, pins, onComponentClick }) {
  return (
    <g transform={`translate(${x},${y})`} onClick={() => onComponentClick?.(name)} style={{ cursor: onComponentClick ? 'pointer' : 'default' }}>
      <rect width={size.w} height={size.h} rx="8" fill="#1F2937" stroke="#0F172A" strokeWidth="2" />
      <rect x="6" y="6" width={size.w - 12} height="18" rx="4" fill="#374151" />
      <text x={size.w / 2} y="19" textAnchor="middle" fontSize="10" fontWeight="800" fill="#E5E7EB" fontFamily="'Inter',sans-serif">
        {String(name || 'MODULE').toUpperCase().slice(0, 18)}
      </text>
      {pins.map(p => (
        <g key={p.id}>
          <rect x={p.x - 5} y={p.y - 5} width="10" height="10" rx="1.5" fill="#111827" stroke="#555" strokeWidth="0.5" />
          <circle cx={p.x} cy={p.y} r="1.6" fill="#FFD700" />
          <text x={p.x + 10} y={p.y + 3} fontSize="8.5" fontWeight="700" fill="#D1D5DB" fontFamily="'Inter',sans-serif">{p.label}</text>
        </g>
      ))}
    </g>
  );
}

/** A small coloured label at a wire end, naming the pin it connects to. */
function PinTag({ p, text, color, dim, nudge = 0 }) {
  if (!p || !text) return null;
  const short = String(text).replace(/\s*\(.*\)$/, '').slice(0, 12);
  const w = Math.max(22, short.length * 7.2 + 10);
  const off = 15;
  const raw = p.side === 'left' ? p.x - off - w : p.side === 'right' ? p.x + off : p.x - w / 2;
  const x = Math.max(4, Math.min(raw, 1180 - w - 4)); // never fall off the page
  const y = (p.side === 'top' ? p.y - off - 16 : p.side === 'bottom' ? p.y + off : p.y - 8) + nudge;
  return (
    <g opacity={dim ? 0.25 : 1} style={{ pointerEvents: 'none' }}>
      <rect x={x} y={y} width={w} height={16} rx={4} fill="#fff" stroke={color} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + 11.5} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={color} fontFamily="'Inter',sans-serif">{short}</text>
    </g>
  );
}

// ── Soft drop shadow filter id ───────────────────────────────────────────────
const SHADOW_FILTER = 'rcCompShadow';

// ── Main component ───────────────────────────────────────────────────────────
export default function CircuitDiagram({ pinConnections, projectName, header, onComponentClick, highlightWire }) {
  if (!pinConnections || pinConnections.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
        Pin connection data not available for this project.<br />
        Please refer to the source code and build steps for wiring details.
      </div>
    );
  }

  const { controllerId, instances, dyn } = buildInstances(pinConnections);
  const cSize = REALISTIC_SIZES[controllerId] || { w: 180, h: 260 };
  const cPins = REALISTIC_PINS[controllerId] || [];

  const PAD = 44;
  const TITLE_H = 92;
  const ROW_GAP = 78;
  const sizes = {};
  instances.forEach(i => { sizes[i.key] = sizeOf(i.id, dyn, i.key) || { w: 150, h: 130 }; });
  const edgeOf = (size, pin) => {
    const d = { left: pin.x, right: size.w - pin.x, top: pin.y, bottom: size.h - pin.y };
    return Object.keys(d).reduce((m, k) => (d[k] < d[m] ? k : m), 'left');
  };

  // ── Which controller pins does each part use? ──
  const info = {};
  instances.forEach(i => { info[i.key] = { n: 0, side: 0, y: 0 }; });
  pinConnections.forEach(conn => {
    const inst = instances.find(i => i.key === (conn.component || conn.componentId));
    if (!inst) return;
    const cp = cPins.find(p => p.id === (conn.controllerPinId || matchPinId(controllerId, conn.controllerPin)));
    if (!cp) return;
    const e = edgeOf(cSize, cp);
    const weight = cp.type === 'power' || cp.type === 'ground' ? 0.4 : 2; // signal wires decide the side
    info[inst.key].n += 1;
    info[inst.key].side += (e === 'left' ? -1 : e === 'right' ? 1 : 0) * weight;
    info[inst.key].y += cp.y;
  });

  // ── Columns: parts that talk to the board sit beside it; motors and the battery sit beside their driver ──
  const hub = instances.find(i => DRIVER_IDS.has(i.id));
  const cols = { L2: [], L1: [], R1: [], R2: [] };
  const colOf = { [controllerId]: 'C' };
  let hL = 0, hR = 0;
  const direct = instances.filter(i => info[i.key].n > 0);
  const indirect = instances.filter(i => info[i.key].n === 0);
  direct.forEach(i => {
    const sd = info[i.key].side;
    const c = sd < 0 ? 'L1' : sd > 0 ? 'R1' : (hL <= hR ? 'L1' : 'R1');
    cols[c].push(i);
    if (c === 'L1') hL += sizes[i.key].h + ROW_GAP; else hR += sizes[i.key].h + ROW_GAP;
  });
  const hubCol = hub ? (cols.L1.includes(hub) ? 'L1' : 'R1') : (hL <= hR ? 'R1' : 'L1');
  const outerCol = hubCol === 'L1' ? 'L2' : 'R2';
  indirect.forEach(i => cols[outerCol].push(i));
  Object.entries(cols).forEach(([c, list]) => list.forEach(i => { colOf[i.key] = c; }));
  const avgY = (i) => (info[i.key].n ? info[i.key].y / info[i.key].n : 0);
  cols.L1.sort((a, b) => avgY(a) - avgY(b));
  cols.R1.sort((a, b) => avgY(a) - avgY(b));

  // ── Space between columns grows with the number of wires that must pass through ──
  const wiresInto = (c) => pinConnections.filter(cn => colOf[cn.component || cn.componentId] === c).length;
  const driven = instances.filter(i => ['dc_motor', 'gear_motor', 'vibration_motor'].includes(i.id) && info[i.key].n === 0);
  const batteryInst = instances.find(i => POWER.has(i.id) && info[i.key].n === 0);
  const outerWires = driven.length * 2 + (batteryInst ? 2 : 0);
  const gapCtrl = (c) => (cols[c].length ? Math.max(170, 70 + LANE * wiresInto(c)) : 0);
  const gapOuter = (c) => (cols[c].length ? Math.max(150, 70 + LANE * Math.max(outerWires, 4)) : 0);
  const colW = (c) => (cols[c].length ? Math.max(...cols[c].map(i => sizes[i.key].w)) : 0);

  const xs = {};
  let cx = PAD;
  xs.L2 = cx; cx += colW('L2') + gapOuter('L2');
  xs.L1 = cx; cx += colW('L1') + gapCtrl('L1');
  const ctrlX = cx; cx += cSize.w + gapCtrl('R1');
  xs.R1 = cx; cx += colW('R1') + gapOuter('R2');
  xs.R2 = cx; cx += colW('R2');
  const CANVAS_W = Math.max(960, cx + PAD);
  const shiftX = (CANVAS_W - (cx + PAD)) / 2;   // centre the drawing when it is narrower than the minimum
  Object.keys(xs).forEach(k => { xs[k] += shiftX; });

  const wrapRoom = 40 + LANE * Math.min(10, direct.length);
  const top = TITLE_H + wrapRoom;
  const ctrlY = top;
  const positions = {};
  positions[controllerId] = { x: ctrlX + shiftX, y: ctrlY, w: cSize.w, h: cSize.h };
  const stack = (list, c, y0) => {
    let y = y0;
    list.forEach(inst => {
      const sz = sizes[inst.key];
      const colWd = colW(c);
      // parts hug the side facing the board so wires stay short
      const x = (c === 'L1' || c === 'L2') ? xs[c] + colWd - sz.w : xs[c];
      positions[inst.key] = { x, y, w: sz.w, h: sz.h, mirror: c === 'L1' || c === 'L2' };
      y += sz.h + ROW_GAP;
    });
    return y;
  };
  stack(cols.L1, 'L1', top);
  stack(cols.R1, 'R1', top);
  ['L2', 'R2'].forEach(c => {
    const list = cols[c];
    if (!list.length) return;
    const total = list.reduce((n, i) => n + sizes[i.key].h + ROW_GAP, -ROW_GAP);
    const hubMid = hub && positions[hub.key] ? positions[hub.key].y + positions[hub.key].h / 2 : top + total / 2;
    stack(list, c, Math.max(top, hubMid - total / 2));
  });
  const parts = instances;

  // ── Build wires ──
  const wires = [];
  pinConnections.forEach((conn, idx) => {
    const instKey = conn.component || conn.componentId || matchComponentId(conn.component);
    const inst = instances.find(i => i.key === instKey);
    const compId = inst?.id || conn.componentId || matchComponentId(conn.component);
    if (!compId) return;
    const pos = positions[instKey] || positions[compId];
    if (!pos) return;

    const ctrlPinId = conn.controllerPinId || matchPinId(controllerId, conn.controllerPin);
    const compPinId = inst?.generic
      ? String(conn.componentPin || 'PIN').toUpperCase()
      : (conn.componentPinId || matchPinId(compId, conn.componentPin));
    const s = pinAbs(positions[controllerId], controllerId, ctrlPinId, dyn, controllerId);
    const t = pinAbs(pos, compId, compPinId, dyn, instKey);
    if (!s || !t) return;

    wires.push({
      key: `c${idx}`,
      color: resolveColor(conn),
      s, t, sCol: 'C', tCol: colOf[instKey] || 'C',
      sTag: String(conn.controllerPin || '').toUpperCase(),
      tTag: String(conn.componentPin || '').toUpperCase(),
      label: `${conn.controllerPin} → ${conn.componentPin}`,
      dimmed: highlightWire != null && highlightWire !== idx,
      highlighted: highlightWire === idx,
      idx,
    });
  });

  // ── Auto wires between parts that have no controller pin (driver ↔ motors, battery ↔ driver) ──
  const auto = (key, a, aPin, aCol, b, bPin, bCol, color, sTag, tTag, label) => {
    const s = pinAbs(positions[a.key], a.id, aPin, dyn, a.key);
    const t = pinAbs(positions[b.key], b.id, bPin, dyn, b.key);
    if (!s || !t) return;
    wires.push({ key, color, s, t, sCol: aCol, tCol: bCol, sTag, tTag, label, dimmed: false, highlighted: false, idx: -1 });
  };
  if (hub && hub.id === 'motor_driver' && driven.length) {
    const half = Math.ceil(driven.length / 2);
    driven.forEach((m, mi) => {
      // four motors share two channels: left side on A, right side on B
      const pair = driven.length > 2 ? (mi < half ? 0 : 1) : mi;
      const outs = [`OUT${pair * 2 + 1}`, `OUT${pair * 2 + 2}`];
      ['P', 'N'].forEach((mp, j) => {
        auto(`auto_d${mi}${j}`, hub, outs[j], colOf[hub.key], m, mp, colOf[m.key],
          j === 0 ? WIRE_COLORS.red : WIRE_COLORS.black, outs[j], mp, `${outs[j]} → ${mp}`);
      });
    });
  }
  if (batteryInst && hub) {
    [['P', '12V', WIRE_COLORS.red, '+'], ['N', 'GND', WIRE_COLORS.black, '−']].forEach(([bp, dp, col, tag], j) => {
      auto(`auto_b${j}`, batteryInst, bp, colOf[batteryInst.key], hub, dp, colOf[hub.key], col, tag, dp, `Battery → ${dp}`);
    });
  } else if (batteryInst && driven.length) {
    driven.forEach((m, mi) => {
      auto(`auto_bm${mi}`, batteryInst, 'P', colOf[batteryInst.key], m, 'P', colOf[m.key], WIRE_COLORS.red, '+', 'P', 'Battery → Motor');
      auto(`auto_bn${mi}`, batteryInst, 'N', colOf[batteryInst.key], m, 'N', colOf[m.key], WIRE_COLORS.black, '−', 'N', 'Battery → Motor');
    });
  }

  // ── Canvas size, then route every wire into its own lane ──
  const allBottoms = Object.values(positions).map(p => p.y + p.h);
  const contentBottom = Math.max(...allBottoms);
  const bottomRoom = 44 + LANE * Math.min(8, direct.length);
  const CANVAS_H = contentBottom + bottomRoom + 70;
  const colLeft = {}, colRight = {};
  colLeft.C = positions[controllerId].x; colRight.C = positions[controllerId].x + cSize.w;
  Object.entries(cols).forEach(([c, list]) => {
    if (!list.length) return;
    colLeft[c] = Math.min(...list.map(i => positions[i.key].x));
    colRight[c] = Math.max(...list.map(i => positions[i.key].x + positions[i.key].w));
  });
  routeWires(wires, { colLeft, colRight, midY: ctrlY + cSize.h / 2, topY: top - 26, bottomY: contentBottom + 40 });
  const ctrlX0 = positions[controllerId].x;

  // ── Header ──
  const diffColors = { Beginner: '#16A34A', Intermediate: '#EA580C', Advanced: '#DC2626' };
  const hInfo = header || {};
  const diffColor = diffColors[hInfo.difficulty] || '#0EA5E9';
  const subtitle = hInfo.subtitle || instances.map(i => i.name).slice(0, 5).join(' + ');

  return (
    <svg width="100%" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{ maxWidth: `${CANVAS_W}px`, margin: '0 auto', display: 'block', background: '#FAFBFC' }}>
      <defs>
        <style>{'.rc-mirror text{transform-box:fill-box;transform-origin:center;transform:scaleX(-1)}'}</style>
        <filter id={SHADOW_FILTER} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.18" />
        </filter>
        <linearGradient id="rcBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDFEFE" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
      </defs>

      {/* workbench background */}
      <rect x="0" y="0" width={CANVAS_W} height={CANVAS_H} fill="url(#rcBg)" />

      {/* ── Header ── */}
      <g>
        <text x={CANVAS_W / 2} y="34" textAnchor="middle" fontSize="26" fontWeight="800"
          fill="#0F172A" fontFamily="'Inter',sans-serif" letterSpacing="-0.5">
          {(hInfo.name || projectName || 'ROBOTICS PROJECT').toUpperCase()}
        </text>
        <text x={CANVAS_W / 2} y="58" textAnchor="middle" fontSize="13" fontWeight="600"
          fill="#475569" fontFamily="'Inter',sans-serif">
          {subtitle}
        </text>
        {/* badges */}
        <g transform={`translate(${CANVAS_W / 2 - 230}, 68)`}>
          {[
            { label: hInfo.difficulty || '', color: diffColor, show: !!hInfo.difficulty },
            { label: `⏱ ${hInfo.time || ''}`, color: '#475569', show: !!hInfo.time },
            { label: `₹ ${hInfo.cost || ''}`.replace('₹ ₹', '₹'), color: '#475569', show: !!hInfo.cost },
          ].filter(b => b.show).map((b, i) => (
            <g key={i} transform={`translate(${i * 160}, 0)`}>
              <rect width="150" height="22" rx="11" fill="#fff" stroke={b.color} strokeWidth="1.5" />
              <text x="75" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill={b.color} fontFamily="'Inter',sans-serif">
                {b.label}
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* ── Wires (under components' pin caps, over breadboard) ── */}
      <g>
        {wires.map(w => (
          <g key={w.key}>
            {/* soft shadow */}
            <path d={w.d} fill="none" stroke="#000" strokeWidth={w.highlighted ? 6 : 4}
              strokeOpacity="0.08" strokeLinecap="round" strokeLinejoin="round" transform="translate(1.5,2)" />
            <path d={w.d} fill="none" stroke={w.color}
              strokeWidth={w.highlighted ? 5 : 3.4}
              strokeOpacity={w.dimmed ? 0.22 : 1}
              strokeLinecap="round" strokeLinejoin="round"
              style={w.highlighted ? { filter: 'drop-shadow(0 0 5px #0EA5E9)' } : undefined}
            />
          </g>
        ))}
      </g>

      {/* ── Pin tags: which pin each wire lands on ── */}
      <g>
        {(() => {
          const seen = new Map();
          const slot = (pt) => {
            const k = `${Math.round(pt.x)},${Math.round(pt.y)}`;
            const n = seen.get(k) || 0;
            seen.set(k, n + 1);
            return n * 17;
          };
          return wires.flatMap(w => [
            w.sTag ? <PinTag key={`${w.key}s`} p={w.s} text={w.sTag} color={w.color} dim={w.dimmed} nudge={slot(w.s)} /> : null,
            w.tTag ? <PinTag key={`${w.key}t`} p={w.t} text={w.tTag} color={w.color} dim={w.dimmed} nudge={slot(w.t)} /> : null,
          ]);
        })()}
      </g>

      {/* ── Components ── */}
      <g filter={`url(#${SHADOW_FILTER})`}>
        {/* Controller */}
        <RealisticComponent componentId={controllerId} x={ctrlX0} y={ctrlY}
          onComponentClick={onComponentClick} />
        {/* Every other part, and any we have no artwork for */}
        {parts.map(inst => {
          const pos = positions[inst.key];
          const body = inst.generic
            ? <GenericModule name={inst.name} x={0} y={0} size={dyn[inst.key].size} pins={dyn[inst.key].pins} onComponentClick={onComponentClick} />
            : <RealisticComponent componentId={inst.id} x={0} y={0} onComponentClick={onComponentClick} />;
          return pos.mirror
            ? <g key={inst.key} className="rc-mirror" transform={`translate(${pos.x + pos.w},${pos.y}) scale(-1,1)`}>{body}</g>
            : <g key={inst.key} transform={`translate(${pos.x},${pos.y})`}>{body}</g>;
        })}
      </g>

      {/* ── Pin caps (gold jumper tips) drawn on top ── */}
      <g>
        {wires.map(w => (
          <g key={`cap-${w.key}`}>
            <rect x={w.s.x - 3.5} y={w.s.y - 3.5} width="7" height="7" rx="1.5"
              fill="#EAB308" stroke="#854D0E" strokeWidth="0.6" />
            <rect x={w.t.x - 3.5} y={w.t.y - 3.5} width="7" height="7" rx="1.5"
              fill="#EAB308" stroke="#854D0E" strokeWidth="0.6" />
          </g>
        ))}
      </g>

      {/* ── Component labels ── */}
      <g fontFamily="'Inter',sans-serif">
        <text x={ctrlX0 + cSize.w / 2} y={ctrlY + cSize.h + 20} textAnchor="middle"
          fontSize="12" fontWeight="700" fill="#0F172A">{COMPONENT_LABELS[controllerId] || 'Controller'}</text>
        {parts.map(inst => {
          const p = positions[inst.key];
          if (!p) return null;
          return (
            <text key={inst.key} x={p.x + p.w / 2} y={p.y + p.h + 18} textAnchor="middle"
              fontSize="11" fontWeight="700" fill="#0F172A">{inst.name}</text>
          );
        })}
      </g>

      {/* ── Legend ── */}
      <g transform={`translate(${PAD}, ${CANVAS_H - 26})`}>
        <rect x="-10" y="-18" width={CANVAS_W - 2 * PAD + 20} height="34" rx="8" fill="#fff" stroke="#E2E8F0" strokeWidth="1" />
        {WIRE_LEGEND.map((item, i) => (
          <g key={i} transform={`translate(${i * 165}, 0)`}>
            <rect x="0" y="-4" width="20" height="6" rx="3" fill={item.color} />
            <text x="26" y="2" fontSize="11" fontWeight="600" fill="#334155" fontFamily="'Inter',sans-serif">{item.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

const COMPONENT_LABELS = {
  arduino_uno: 'Arduino Uno',
  arduino_nano: 'Arduino Nano',
  esp32: 'ESP32',
  esp8266: 'ESP8266',
};