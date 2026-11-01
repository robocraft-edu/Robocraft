import React from 'react';
import { getDef } from '@/lib/lab/labComponents';

/**
 * Realistic (Fritzing-style) artwork for every lab component.
 * Everything is drawn in the component's own 0,0 → w,h space so the same art is
 * used by the 2-D canvas, the palette thumbnails and the wiring diagrams.
 * `state` carries live simulation values: { ledOn, brightness, servoAngle, motorAngle, distance, irDetected, buzzerOn, pressed }
 */

// ── shared bits ───────────────────────────────────────────────────────────
const Header = ({ x, y, w, h = 9, n, vertical = false, gold = false }) => {
  const holes = [];
  for (let i = 0; i < n; i++) {
    const cx = vertical ? x + w / 2 : x + (w / n) * (i + 0.5);
    const cy = vertical ? y + (h / n) * (i + 0.5) : y + h / 2;
    holes.push(<rect key={i} x={cx - 2.1} y={cy - 2.1} width={4.2} height={4.2} rx={0.6} fill={gold ? '#d4a017' : '#111827'} />);
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={1.5} fill="#1a1a1a" stroke="#000" strokeWidth={0.4} />
      {holes}
    </g>
  );
};
const Screw = ({ cx, cy, r = 3.4 }) => (
  <g><circle cx={cx} cy={cy} r={r} fill="#cbd5e1" stroke="#64748b" strokeWidth={0.6} />
    <path d={`M${cx - r * 0.6} ${cy} h${r * 1.2}`} stroke="#475569" strokeWidth={0.9} /></g>
);
const Chip = ({ x, y, w, h, label }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={1.5} fill="#15181d" />
    <circle cx={x + 4} cy={y + 4} r={1.4} fill="#30363d" />
    {label && <text x={x + w / 2} y={y + h / 2 + 2.5} textAnchor="middle" fontSize={Math.min(7, h * 0.45)} fill="#9aa4b2" fontFamily="monospace">{label}</text>}
  </g>
);
const Silk = (p) => <text {...p} fill={p.fill || '#eaf6f7'} fontFamily="system-ui, sans-serif" fontWeight={700} />;

// ── boards ────────────────────────────────────────────────────────────────
function ArduinoUno({ w, h }) {
  return (
    <g>
      <rect x={2} y={2} width={w - 4} height={h - 4} rx={9} fill="#00878f" stroke="#026b71" strokeWidth={1.5} />
      <rect x={6} y={6} width={w - 12} height={h - 12} rx={6} fill="none" stroke="#17a2ab" strokeWidth={0.8} />
      {/* USB cable plugged into the B socket */}
      <path d={`M-4 33 C-24 33 -30 33 -52 33`} stroke="#15181d" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M-4 33 C-24 33 -30 33 -52 33`} stroke="#3a3f4a" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.7} transform="translate(0 -1.6)" />
      <rect x={-12} y={22} width={22} height={22} rx={3} fill="#2a2f38" stroke="#0b0e13" strokeWidth={1} />
      <rect x={-8} y={26} width={14} height={14} rx={2} fill="#9aa4b2" opacity={0.25} />
      {/* USB-B */}
      <rect x={-2} y={18} width={34} height={30} rx={2} fill="#c9ced6" stroke="#8b94a1" />
      <rect x={2} y={23} width={26} height={20} rx={1.5} fill="#e7ebf0" />
      {/* barrel jack */}
      <rect x={-1} y={h - 54} width={30} height={26} rx={4} fill="#111418" />
      <circle cx={6} cy={h - 41} r={5} fill="#2a2f36" />
      {/* headers */}
      <Header x={38} y={3.5} w={w * 0.44} h={9} n={10} />
      <Header x={38 + w * 0.46} y={3.5} w={w * 0.3} h={9} n={8} />
      <Header x={40} y={h - 12.5} w={w * 0.34} h={9} n={8} />
      <Header x={44 + w * 0.36} y={h - 12.5} w={w * 0.3} h={9} n={6} />
      {/* ATmega + crystal + regulator */}
      <Chip x={w * 0.42} y={h * 0.42} w={w * 0.3} h={h * 0.2} label="ATMEGA328P" />
      <rect x={w * 0.3} y={h * 0.52} width={14} height={9} rx={4} fill="#a3adb9" />
      <rect x={w * 0.2} y={h * 0.62} width={20} height={12} rx={2} fill="#111418" />
      {/* reset button + LEDs */}
      <rect x={36} y={h * 0.2} width={12} height={12} rx={2} fill="#1f2937" />
      <circle cx={42} cy={h * 0.2 + 6} r={3.4} fill="#cfd6df" />
      <rect x={w * 0.5} y={h * 0.26} width={6} height={3.2} rx={1} fill="#22c55e" />
      <rect x={w * 0.56} y={h * 0.26} width={6} height={3.2} rx={1} fill="#f59e0b" />
      <Silk x={w * 0.52} y={h * 0.78} fontSize={11}>ARDUINO</Silk>
      <Silk x={w * 0.52} y={h * 0.78 + 11} fontSize={8} fill="#bfe9ec">UNO R3</Silk>
      <circle cx={14} cy={h - 12} r={3.4} fill="#0b6066" stroke="#d7eef0" strokeWidth={1.4} />
      <circle cx={w - 12} cy={12} r={3.4} fill="#0b6066" stroke="#d7eef0" strokeWidth={1.4} />
    </g>
  );
}

function ArduinoNano({ w, h }) {
  return (
    <g>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={5} fill="#1d4ed8" stroke="#1e3a8a" strokeWidth={1.2} />
      <Header x={8} y={3} w={w - 16} h={8} n={15} gold />
      <Header x={8} y={h - 11} w={w - 16} h={8} n={15} gold />
      <rect x={w - 30} y={h * 0.3} width={26} height={h * 0.4} rx={2} fill="#c9ced6" />
      <Chip x={w * 0.3} y={h * 0.36} w={w * 0.34} h={h * 0.3} label="ATmega" />
      <Silk x={10} y={h * 0.62} fontSize={7}>NANO</Silk>
    </g>
  );
}

function Esp32({ w, h }) {
  return (
    <g>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={5} fill="#15181d" stroke="#000" strokeWidth={1.2} />
      <Header x={6} y={3} w={w - 12} h={8} n={19} gold />
      <Header x={6} y={h - 11} w={w - 12} h={8} n={19} gold />
      {/* shielded module + PCB antenna */}
      <rect x={w * 0.24} y={h * 0.26} width={w * 0.4} height={h * 0.46} rx={2} fill="#9aa4b2" stroke="#6b7280" />
      <text x={w * 0.44} y={h * 0.54} textAnchor="middle" fontSize={7} fill="#2a2f36" fontFamily="monospace">ESP-WROOM-32</text>
      <path d={`M${w * 0.68} ${h * 0.3} h${w * 0.1} v4 h-${w * 0.07} v4 h${w * 0.07} v4 h-${w * 0.1}`} stroke="#d4a017" strokeWidth={2.4} fill="none" />
      <rect x={w * 0.06} y={h * 0.38} width={18} height={14} rx={2} fill="#c9ced6" />
      <rect x={w * 0.2} y={h * 0.74} width={10} height={10} rx={1.5} fill="#2a2f36" />
      <rect x={w * 0.62} y={h * 0.74} width={10} height={10} rx={1.5} fill="#2a2f36" />
      <Silk x={w * 0.3} y={h * 0.9} fontSize={6} fill="#9aa4b2">ESP32 DEVKIT</Silk>
    </g>
  );
}

function Breadboard({ w, h }) {
  const cols = 22, rows = 5;
  const holes = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      holes.push(<rect key={`a${c}${r}`} x={14 + c * ((w - 28) / cols)} y={h * 0.26 + r * 6} width={3} height={3} rx={0.5} fill="#9aa4b2" />);
      holes.push(<rect key={`b${c}${r}`} x={14 + c * ((w - 28) / cols)} y={h * 0.62 + r * 6} width={3} height={3} rx={0.5} fill="#9aa4b2" />);
    }
  }
  return (
    <g>
      <rect x={2} y={2} width={w - 4} height={h - 4} rx={4} fill="#f3f4f6" stroke="#cbd5e1" strokeWidth={1.4} />
      <line x1={8} y1={10} x2={w - 8} y2={10} stroke="#ef4444" strokeWidth={1.2} />
      <line x1={8} y1={16} x2={w - 8} y2={16} stroke="#2563eb" strokeWidth={1.2} />
      <line x1={8} y1={h - 16} x2={w - 8} y2={h - 16} stroke="#ef4444" strokeWidth={1.2} />
      <line x1={8} y1={h - 10} x2={w - 8} y2={h - 10} stroke="#2563eb" strokeWidth={1.2} />
      <rect x={10} y={h * 0.49} width={w - 20} height={5} rx={1} fill="#e5e7eb" stroke="#cbd5e1" strokeWidth={0.5} />
      {holes}
    </g>
  );
}

// ── outputs ───────────────────────────────────────────────────────────────
function Servo({ w, h, state }) {
  const a = (state?.servoAngle ?? 90) - 90;
  return (
    <g>
      <rect x={w * 0.2} y={h * 0.22} width={w * 0.5} height={h * 0.56} rx={3} fill="#2563eb" stroke="#1e3a8a" />
      <rect x={w * 0.2} y={h * 0.14} width={w * 0.5} height={h * 0.1} rx={2} fill="#1d4ed8" />
      <rect x={w * 0.1} y={h * 0.3} width={w * 0.1} height={h * 0.1} rx={2} fill="#1d4ed8" />
      <rect x={w * 0.7} y={h * 0.3} width={w * 0.1} height={h * 0.1} rx={2} fill="#1d4ed8" />
      <circle cx={w * 0.36} cy={h * 0.4} r={w * 0.1} fill="#e2e8f0" stroke="#94a3b8" />
      <g transform={`rotate(${a} ${w * 0.36} ${h * 0.4})`}>
        <rect x={w * 0.33} y={h * 0.04} width={w * 0.06} height={h * 0.38} rx={3} fill="#f8fafc" stroke="#cbd5e1" />
        <circle cx={w * 0.36} cy={h * 0.09} r={2.2} fill="#cbd5e1" />
      </g>
      {/* 3-wire cable */}
      {['#f97316', '#ef4444', '#78350f'].map((c, i) => (
        <path key={c} d={`M${w * 0.2} ${h * (0.42 + i * 0.09)} h-${w * 0.14}`} stroke={c} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      ))}
      <text x={w * 0.45} y={h * 0.74} textAnchor="middle" fontSize={7} fill="#dbeafe">SG90</text>
    </g>
  );
}

// ── sensors ───────────────────────────────────────────────────────────────
function IrSensor({ w, h, state }) {
  const det = state?.irDetected;
  return (
    <g>
      <rect x={4} y={h * 0.16} width={w - 8} height={h * 0.68} rx={3} fill="#1d4ed8" stroke="#1e3a8a" />
      <circle cx={w * 0.3} cy={h / 2} r={7} fill="#0b1220" stroke="#334155" />
      <circle cx={w * 0.52} cy={h / 2} r={7} fill={det ? '#bae6fd' : '#e2e8f0'} stroke="#94a3b8" />
      {det && <path d={`M${w * 0.62} ${h / 2} h18`} stroke="#22c55e" strokeWidth={2} strokeDasharray="3 3" />}
      <rect x={w * 0.68} y={h * 0.3} width={12} height={12} rx={2} fill="#1e40af" stroke="#1e3a8a" />
      <circle cx={w * 0.68 + 6} cy={h * 0.3 + 6} r={3} fill="#60a5fa" />
      <circle cx={w * 0.3} cy={h * 0.78} r={2.6} fill={det ? '#22c55e' : '#14532d'} />
      <Header x={w * 0.62} y={h * 0.62} w={22} h={8} n={3} gold />
      <text x={w * 0.42} y={h * 0.26} textAnchor="middle" fontSize={6.5} fill="#dbeafe">IR MODULE</text>
    </g>
  );
}

function Ldr({ w, h }) {
  const cx = w / 2, cy = h / 2;
  return (
    <g>
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.3} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.4} />
      <path d={`M${cx - 10} ${cy - 6} q5 4 10 0 q5 -4 10 0 M${cx - 10} ${cy + 2} q5 4 10 0 q5 -4 10 0`} stroke="#b45309" strokeWidth={2} fill="none" />
      <path d={`M${cx - 6} ${cy + 10} v${h / 2 - cy - 2}`} stroke="#9aa4b2" strokeWidth={2} />
      <path d={`M${cx + 6} ${cy + 10} v${h / 2 - cy - 2}`} stroke="#9aa4b2" strokeWidth={2} />
      <text x={cx} y={h - 2} textAnchor="middle" fontSize={7} fill="#64748b">LDR</text>
    </g>
  );
}

function Display({ w, h, running, oled }) {
  return (
    <g>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={3} fill={oled ? '#111418' : '#1e3a8a'} stroke="#0b1220" />
      <rect x={10} y={12} width={w - 20} height={h - 30} rx={2} fill={oled ? '#05070a' : '#1d9c3a'} />
      <text x={w / 2} y={h / 2 + 2} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={oled ? '#e2e8f0' : '#eafff0'}>
        {running ? 'RoboCraft' : (oled ? '0.96" OLED' : 'LCD 16x2')}
      </text>
      <Header x={w * 0.3} y={h - 12} w={w * 0.4} h={8} n={4} gold />
    </g>
  );
}

function MotorDriver({ w, h }) {
  return (
    <g>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={4} fill="#1e40af" stroke="#172554" />
      {/* heatsink */}
      <rect x={w * 0.3} y={h * 0.12} width={w * 0.4} height={h * 0.34} rx={2} fill="#0b0f14" />
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={w * 0.31 + i * (w * 0.076)} y={h * 0.13} width={w * 0.035} height={h * 0.32} fill="#2a2f36" />)}
      {/* screw terminals */}
      <rect x={6} y={h * 0.56} width={w * 0.34} height={h * 0.3} rx={2} fill="#16a34a" stroke="#14532d" />
      <Screw cx={6 + w * 0.09} cy={h * 0.71} /><Screw cx={6 + w * 0.25} cy={h * 0.71} />
      <rect x={w - 6 - w * 0.34} y={h * 0.56} width={w * 0.34} height={h * 0.3} rx={2} fill="#16a34a" stroke="#14532d" />
      <Screw cx={w - 6 - w * 0.25} cy={h * 0.71} /><Screw cx={w - 6 - w * 0.09} cy={h * 0.71} />
      <Header x={w * 0.42} y={h * 0.62} w={w * 0.18} h={8} n={4} gold />
      <Chip x={w * 0.12} y={h * 0.18} w={w * 0.14} h={h * 0.2} />
      <text x={w / 2} y={h * 0.54} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="#dbeafe">L298N</text>
    </g>
  );
}

function Imu({ w, h }) {
  return (
    <g>
      <rect x={4} y={h * 0.2} width={w - 8} height={h * 0.6} rx={3} fill="#7c3aed" stroke="#4c1d95" />
      <Chip x={w * 0.38} y={h * 0.38} w={w * 0.26} h={h * 0.26} />
      <Header x={w * 0.2} y={h * 0.64} w={w * 0.6} h={8} n={8} gold />
      <text x={w / 2} y={h * 0.34} textAnchor="middle" fontSize={6.5} fill="#ede9fe">GY-521 MPU6050</text>
    </g>
  );
}

function PowerSupply({ w, h }) {
  return (
    <g>
      <rect x={w * 0.1} y={h * 0.18} width={w * 0.8} height={h * 0.64} rx={6} fill="#1f2937" stroke="#0b0f14" />
      <rect x={w * 0.18} y={h * 0.3} width={w * 0.4} height={h * 0.26} rx={2} fill="#374151" />
      <text x={w * 0.38} y={h * 0.48} textAnchor="middle" fontSize={7} fill="#e5e7eb">5V 2A</text>
      <path d={`M${w * 0.9} ${h * 0.4} h${w * 0.1}`} stroke="#ef4444" strokeWidth={3} />
      <path d={`M${w * 0.9} ${h * 0.6} h${w * 0.1}`} stroke="#111418" strokeWidth={3} />
    </g>
  );
}

// ── realistic part art (original drawings; every lead ends exactly on its pin) ──
// Evenly spaced x positions for n pins along an edge — the same rule pinLocalPos uses.
const slots = (w, n) => Array.from({ length: n }, (_, i) => (w * (i + 1)) / (n + 1));
// A bright metal lead (wire leg), with a soft highlight so it reads as round.
const Lead = ({ d, color = '#c7ced8', wide = 3.2 }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke="#6f7888" strokeWidth={wide + 0.8} />
    <path d={d} stroke={color} strokeWidth={wide} />
    <path d={d} stroke="#f8fafc" strokeWidth={wide * 0.28} opacity={0.75} transform="translate(-0.5 0)" />
  </g>
);
// An insulated wire.
const Wire = ({ d, color, wide = 3 }) => (
  <g fill="none" strokeLinecap="round">
    <path d={d} stroke="#0b0f14" strokeWidth={wide + 1.2} opacity={0.5} />
    <path d={d} stroke={color} strokeWidth={wide} />
    <path d={d} stroke="#ffffff" strokeWidth={wide * 0.25} opacity={0.35} transform="translate(-0.4 0)" />
  </g>
);
const Grad = ({ id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1 }) => (
  <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
    {stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}
  </linearGradient>
);

function Led({ w, h, state }) {
  const on = !!state?.ledOn, b = state?.brightness ?? 1;
  const [xc, xa] = slots(w, 2); // cathode (flat side, short leg) then anode (long leg)
  const cx = w / 2, R = Math.min(w * 0.27, 17), domeCy = h * 0.1 + R, bodyBot = domeCy + R * 1.2;
  return (
    <g>
      <defs>
        <radialGradient id="pa-led" cx="0.36" cy="0.3" r="0.95">
          <stop offset="0" stopColor={on ? '#fff1ea' : '#ffa59b'} />
          <stop offset="0.45" stopColor={on ? '#ff6a5c' : '#e04141'} />
          <stop offset="1" stopColor={on ? '#e8322b' : '#8a1c1c'} />
        </radialGradient>
      </defs>
      {on && <circle cx={cx} cy={domeCy} r={R * 2.3 * (0.6 + 0.4 * b)} fill="#ff5a4d" opacity={0.26 * b} />}
      {on && <circle cx={cx} cy={domeCy} r={R * 1.6 * (0.6 + 0.4 * b)} fill="#ff9a8c" opacity={0.3 * b} />}
      <Lead d={`M${cx - R * 0.45} ${bodyBot} C${cx - R * 0.45} ${bodyBot + 12} ${xc} ${bodyBot + 8} ${xc} ${bodyBot + 22} V${h}`} />
      <Lead d={`M${cx + R * 0.45} ${bodyBot} C${cx + R * 0.45} ${bodyBot + 12} ${xa} ${bodyBot + 8} ${xa} ${bodyBot + 22} V${h}`} />
      <path d={`M${cx - R} ${bodyBot} V${domeCy} A${R} ${R} 0 0 1 ${cx + R} ${domeCy} V${bodyBot} Z`} fill="url(#pa-led)" stroke={on ? '#ff8d80' : '#7a1717'} strokeWidth={0.9} />
      <rect x={cx - R - 3} y={bodyBot - 1} width={R * 2 + 6} height={4.6} rx={1.4} fill={on ? '#ff7568' : '#c43232'} stroke="#7a1717" strokeWidth={0.7} />
      <path d={`M${cx - R - 3} ${bodyBot - 1} h2.4 v4.6 h-2.4`} fill="#1f2937" opacity={0.35} />
      {/* the die and its post, seen through the epoxy */}
      <path d={`M${cx - R * 0.42} ${bodyBot - 1} V${domeCy + 2} h${R * 0.84} V${bodyBot - 1}`} fill="none" stroke={on ? '#fff4c2' : '#5b1010'} strokeWidth={1.1} opacity={0.75} />
      <path d={`M${cx - R * 0.22} ${domeCy + 2} l${R * 0.44} -5`} stroke={on ? '#fff4c2' : '#5b1010'} strokeWidth={1} opacity={0.7} />
      <ellipse cx={cx - R * 0.42} cy={domeCy - R * 0.45} rx={R * 0.2} ry={R * 0.4} fill="#fff" opacity={0.5} transform={`rotate(-22 ${cx - R * 0.42} ${domeCy - R * 0.45})`} />
    </g>
  );
}

function RgbLed({ w, h, state }) {
  const xs = slots(w, 4); // R, GND (longest), G, B
  const [r, g, b] = state?.rgb || [0, 0, 0];
  const on = r + g + b > 0, mx = Math.max(r, g, b, 1);
  const col = on ? `rgb(${Math.round((r / mx) * 255)},${Math.round((g / mx) * 255)},${Math.round((b / mx) * 255)})` : '#e8eef3';
  const lum = on ? Math.min(1, mx / 255) : 0;
  const cx = w / 2, R = Math.min(w * 0.2, 18), domeCy = h * 0.1 + R, bodyBot = domeCy + R * 1.2;
  const legTop = (i) => cx + (i - 1.5) * R * 0.5;
  return (
    <g>
      <defs>
        <radialGradient id="pa-rgb" cx="0.36" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="0.6" stopColor={col} stopOpacity={on ? 0.95 : 0.55} />
          <stop offset="1" stopColor={on ? col : '#b9c4cf'} stopOpacity={0.9} />
        </radialGradient>
      </defs>
      {on && <circle cx={cx} cy={domeCy} r={R * 2.4} fill={col} opacity={0.28 * lum} />}
      {xs.map((x, i) => (
        <Lead key={i} d={`M${legTop(i)} ${bodyBot} C${legTop(i)} ${bodyBot + 12} ${x} ${bodyBot + 10} ${x} ${bodyBot + 26} V${h}`} wide={i === 1 ? 3.2 : 2.8} />
      ))}
      <path d={`M${cx - R} ${bodyBot} V${domeCy} A${R} ${R} 0 0 1 ${cx + R} ${domeCy} V${bodyBot} Z`} fill="url(#pa-rgb)" stroke="#8fa0b0" strokeWidth={0.9} />
      <rect x={cx - R - 3} y={bodyBot - 1} width={R * 2 + 6} height={4.6} rx={1.4} fill="#dbe4ec" stroke="#8fa0b0" strokeWidth={0.7} />
      {/* four electrodes inside the dome */}
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${legTop(i)} ${bodyBot - 1} V${domeCy + 4 - (i === 1 ? 5 : 0)}`} stroke="#6b7280" strokeWidth={1} opacity={0.7} />)}
      <rect x={cx - 3} y={domeCy + 1} width={6} height={3} rx={1} fill="#374151" />
      <ellipse cx={cx - R * 0.4} cy={domeCy - R * 0.45} rx={R * 0.2} ry={R * 0.38} fill="#fff" opacity={0.6} transform={`rotate(-22 ${cx - R * 0.4} ${domeCy - R * 0.45})`} />
      {['R', '⏚', 'G', 'B'].map((t, i) => <text key={i} x={xs[i]} y={h - 6} textAnchor="middle" fontSize={7} fill={['#dc2626', '#64748b', '#16a34a', '#2563eb'][i]} fontWeight={700} fontFamily="system-ui, sans-serif">{t}</text>)}
    </g>
  );
}

function Resistor({ w, h }) {
  const cy = h / 2, x0 = w * 0.2, x1 = w * 0.8, bh = Math.min(h * 0.46, 22);
  const band = (x, c, k) => <rect key={k} x={x} y={cy - bh * 0.36} width={5} height={bh * 0.72} fill={c} />;
  return (
    <g>
      <defs><Grad id="pa-res" stops={[[0, '#f6e7c8'], [0.5, '#e0c08c'], [1, '#b48d58']]} /></defs>
      <Lead d={`M0 ${cy} H${x0 + 6}`} /><Lead d={`M${w} ${cy} H${x1 - 6}`} />
      {/* ceramic body: narrow middle, rounded ends */}
      <rect x={x0 + 10} y={cy - bh * 0.4} width={x1 - x0 - 20} height={bh * 0.8} fill="url(#pa-res)" />
      <ellipse cx={x0 + 12} cy={cy} rx={11} ry={bh * 0.5} fill="url(#pa-res)" stroke="#9a7747" strokeWidth={0.7} />
      <ellipse cx={x1 - 12} cy={cy} rx={11} ry={bh * 0.5} fill="url(#pa-res)" stroke="#9a7747" strokeWidth={0.7} />
      <rect x={x0 + 10} y={cy - bh * 0.4} width={x1 - x0 - 20} height={bh * 0.8} fill="none" stroke="#9a7747" strokeWidth={0.7} />
      {/* 220 ohm: red, red, brown, then gold */}
      {band(w * 0.33, '#d62828', 0)}{band(w * 0.43, '#d62828', 1)}{band(w * 0.53, '#7a4a1d', 2)}{band(w * 0.66, '#d4af37', 3)}
      <rect x={x0 + 4} y={cy - bh * 0.3} width={x1 - x0 - 8} height={2.4} rx={1.2} fill="#fff" opacity={0.32} />
      <text x={w / 2} y={cy + bh * 0.5 + 12} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="system-ui, sans-serif">220Ω</text>
    </g>
  );
}

function PushButton({ w, h, state }) {
  const p = !!state?.pressed, cx = w / 2, cy = h / 2, s = Math.min(w, h) * 0.56, half = s / 2;
  const feet = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return (
    <g>
      <defs>
        <radialGradient id="pa-btn" cx="0.38" cy="0.32" r="0.9"><stop offset="0" stopColor="#f4f6f9" /><stop offset="0.6" stopColor="#b6bdc9" /><stop offset="1" stopColor="#6c7585" /></radialGradient>
      </defs>
      {feet.map(([sx, sy], i) => (
        <Lead key={i} d={`M${cx + sx * half} ${cy + sy * half * 0.55} h${sx * 6} L${sx < 0 ? 0 : w} ${cy}`} wide={2.6} />
      ))}
      <rect x={cx - half} y={cy - half} width={s} height={s} rx={4} fill="#262b35" stroke="#0a0d12" strokeWidth={1} />
      <rect x={cx - half + 2.5} y={cy - half + 2.5} width={s - 5} height={s - 5} rx={3} fill="#3a414f" />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => <circle key={i} cx={cx + sx * (half - 5)} cy={cy + sy * (half - 5)} r={1.6} fill="#9aa4b2" />)}
      <circle cx={cx} cy={cy + (p ? 1 : 0)} r={half * 0.56} fill="url(#pa-btn)" stroke="#4b5563" strokeWidth={1} />
      <circle cx={cx} cy={cy + (p ? 1 : 0)} r={half * 0.56 - 3} fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.5} />
    </g>
  );
}

function Buzzer({ w, h, state }) {
  const on = !!state?.buzzerOn;
  const [xn, xp] = slots(w, 2);
  const cx = w / 2, rx = Math.min(w * 0.34, 24), topY = h * 0.22, bodyH = h * 0.3;
  return (
    <g>
      <defs><Grad id="pa-buz" x1={0} x2={1} y1={0} y2={0} stops={[[0, '#0d0f13'], [0.35, '#3a404b'], [0.6, '#1a1d23'], [1, '#07080a']]} /></defs>
      <Lead d={`M${cx - rx * 0.4} ${topY + bodyH} C${cx - rx * 0.4} ${h * 0.78} ${xn} ${h * 0.7} ${xn} ${h * 0.84} V${h}`} />
      <Lead d={`M${cx + rx * 0.4} ${topY + bodyH} C${cx + rx * 0.4} ${h * 0.78} ${xp} ${h * 0.7} ${xp} ${h * 0.84} V${h}`} />
      <path d={`M${cx - rx} ${topY} v${bodyH} a${rx} ${rx * 0.38} 0 0 0 ${rx * 2} 0 v-${bodyH} z`} fill="url(#pa-buz)" stroke="#000" strokeWidth={0.8} />
      <ellipse cx={cx} cy={topY} rx={rx} ry={rx * 0.38} fill="#262b33" stroke="#000" strokeWidth={0.8} />
      <ellipse cx={cx} cy={topY} rx={rx * 0.2} ry={rx * 0.08} fill="#000" />
      <ellipse cx={cx} cy={topY - 0.5} rx={rx * 0.78} ry={rx * 0.28} fill="none" stroke="#4b5563" strokeWidth={0.6} opacity={0.7} />
      <text x={cx + rx * 0.52} y={topY + 3} fontSize={9} fontWeight={800} fill="#e5e7eb" textAnchor="middle" fontFamily="system-ui, sans-serif">+</text>
      {on && [rx * 0.9, rx * 1.3, rx * 1.7].map((r, i) => (
        <path key={i} d={`M${cx + r} ${topY - r * 0.5} a${r} ${r} 0 0 1 0 ${r}`} fill="none" stroke="#f97316" strokeWidth={1.8} opacity={0.9 - i * 0.25} />
      ))}
    </g>
  );
}

function DcMotor({ w, h, state }) {
  const rot = ((state?.motorAngle ?? 0) * Math.PI) / 180;
  const cy = h / 2, [y1, y2] = [h / 3, (2 * h) / 3];
  const x0 = w * 0.2, x1 = w * 0.72, r = Math.min(h * 0.3, 24);
  return (
    <g>
      <defs>
        <Grad id="pa-can" stops={[[0, '#f1f4f8'], [0.18, '#c6ccd6'], [0.55, '#8a93a3'], [1, '#d5dae2']]} />
      </defs>
      {/* shaft and its coupling disc (the red dot rides round it as the motor turns) */}
      <rect x={1} y={cy - 2.6} width={x0 - 1} height={5.2} rx={2.2} fill="#d9dee6" stroke="#8a93a3" strokeWidth={0.7} />
      <rect x={x0 - 7} y={cy - r * 0.5} width={7} height={r} rx={2} fill="#aab2bf" stroke="#6b7280" strokeWidth={0.6} />
      <circle cx={x0 - 14} cy={cy + Math.sin(rot) * (r * 0.38)} r={1.7} fill="#ef4444" opacity={Math.cos(rot) > -0.2 ? 1 : 0.2} />
      {/* can */}
      <path d={`M${x0} ${cy - r} H${x1 - 10} a10 ${r} 0 0 1 0 ${r * 2} H${x0} a8 ${r} 0 0 1 0 -${r * 2} z`} fill="url(#pa-can)" stroke="#6b7280" strokeWidth={0.9} />
      <path d={`M${x0 + 3} ${cy - r + 4} H${x1 - 12}`} stroke="#fff" strokeWidth={1.4} opacity={0.65} strokeLinecap="round" />
      <path d={`M${x0 + 16} ${cy - r} v${r * 2} M${x0 + 20} ${cy - r} v${r * 2}`} stroke="#6b7280" strokeWidth={0.7} opacity={0.5} />
      {/* black end cap with two solder tabs, wired to the pins */}
      <rect x={x1 - 6} y={cy - r + 3} width={10} height={r * 2 - 6} rx={3} fill="#1b1f27" stroke="#000" strokeWidth={0.8} />
      <rect x={x1 + 3} y={y1 - 2.6} width={8} height={5.2} rx={1.2} fill="#d4a017" stroke="#8a6a0a" strokeWidth={0.6} />
      <rect x={x1 + 3} y={y2 - 2.6} width={8} height={5.2} rx={1.2} fill="#d4a017" stroke="#8a6a0a" strokeWidth={0.6} />
      <Wire d={`M${x1 + 8} ${y1} H${w}`} color="#dc2626" />
      <Wire d={`M${x1 + 8} ${y2} H${w}`} color="#1f2937" />
    </g>
  );
}

function GearMotor({ w, h, state }) {
  const ang = state?.motorAngle ?? 0;
  const [xa, xb] = slots(w, 2);
  const bx = w * 0.14, bw = w * 0.72, by = h * 0.05, bh = h * 0.46, hubX = w * 0.5, hubY = by + bh / 2;
  return (
    <g>
      <defs>
        <Grad id="pa-yel" stops={[[0, '#ffe45c'], [0.5, '#f7cb0b'], [1, '#c89a00']]} />
        <Grad id="pa-can2" x1={0} x2={1} y1={0} y2={0} stops={[[0, '#e5e9ef'], [0.4, '#a3abb8'], [1, '#6f7888']]} />
      </defs>
      {/* two output shafts, one each side, as on a TT gear motor */}
      <rect x={0} y={hubY - 4} width={bx + 4} height={8} rx={2} fill="#eef0f3" stroke="#a3abb8" strokeWidth={0.7} />
      <rect x={bx + bw - 4} y={hubY - 4} width={w - bx - bw + 4} height={8} rx={2} fill="#eef0f3" stroke="#a3abb8" strokeWidth={0.7} />
      {/* motor can behind the gearbox */}
      <rect x={w * 0.3} y={by + bh - 2} width={w * 0.4} height={h * 0.3} rx={5} fill="url(#pa-can2)" stroke="#5b6472" strokeWidth={0.9} />
      <rect x={w * 0.3} y={by + bh + h * 0.3 - 8} width={w * 0.4} height={9} rx={3} fill="#1b1f27" stroke="#000" strokeWidth={0.7} />
      <Wire d={`M${w * 0.42} ${by + bh + h * 0.3} C${w * 0.42} ${h * 0.9} ${xa} ${h * 0.84} ${xa} ${h}`} color="#dc2626" />
      <Wire d={`M${w * 0.58} ${by + bh + h * 0.3} C${w * 0.58} ${h * 0.9} ${xb} ${h * 0.84} ${xb} ${h}`} color="#1f2937" />
      {/* gearbox */}
      <rect x={bx} y={by} width={bw} height={bh} rx={7} fill="url(#pa-yel)" stroke="#a37800" strokeWidth={1} />
      {[[0.16, 0.2], [0.84, 0.2], [0.16, 0.8], [0.84, 0.8]].map(([px, py], i) => <circle key={i} cx={bx + bw * px} cy={by + bh * py} r={2.6} fill="#e0a800" stroke="#8a6500" strokeWidth={0.6} />)}
      <circle cx={hubX} cy={hubY} r={Math.min(bh * 0.34, 17)} fill="#f3d233" stroke="#b58900" strokeWidth={1} />
      <circle cx={hubX} cy={hubY} r={Math.min(bh * 0.24, 12)} fill="#eef0f3" stroke="#9aa3b0" strokeWidth={0.8} />
      <g transform={`rotate(${ang} ${hubX} ${hubY})`}>
        <path d={`M${hubX - 9} ${hubY} H${hubX + 9} M${hubX} ${hubY - 9} V${hubY + 9}`} stroke="#6b7280" strokeWidth={2.4} strokeLinecap="round" />
      </g>
      <path d={`M${bx + 8} ${by + 5} H${bx + bw - 8}`} stroke="#fff" strokeWidth={1.6} opacity={0.5} strokeLinecap="round" />
    </g>
  );
}

function VibrationMotor({ w, h, state }) {
  const ang = ((state?.motorAngle ?? 0) * Math.PI) / 180;
  const running = state?.motorAngle !== undefined && state.motorAngle !== 0;
  const [xa, xb] = slots(w, 2);
  const cx = w / 2 + (running ? Math.sin(ang * 6) * 1.4 : 0), cy = h * 0.36, r = Math.min(w * 0.34, 22);
  return (
    <g>
      <defs><radialGradient id="pa-vib" cx="0.35" cy="0.3" r="0.95"><stop offset="0" stopColor="#f2f4f7" /><stop offset="0.55" stopColor="#a5adba" /><stop offset="1" stopColor="#5f6877" /></radialGradient></defs>
      <Wire d={`M${cx - 4} ${cy + r - 2} C${cx - 4} ${h * 0.82} ${xa} ${h * 0.7} ${xa} ${h}`} color="#dc2626" />
      <Wire d={`M${cx + 4} ${cy + r - 2} C${cx + 4} ${h * 0.82} ${xb} ${h * 0.7} ${xb} ${h}`} color="#1f2937" />
      {running && [r + 5, r + 9].map((rr, i) => <circle key={i} cx={cx} cy={cy} r={rr} fill="none" stroke="#22c55e" strokeWidth={1.2} opacity={0.5 - i * 0.2} strokeDasharray="4 5" />)}
      <circle cx={cx} cy={cy} r={r} fill="url(#pa-vib)" stroke="#4b5563" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="none" stroke="#6b7280" strokeWidth={0.8} opacity={0.7} />
      {/* the off-centre weight that makes it buzz */}
      <path d={`M${cx - r * 0.5} ${cy - r * 0.1} a${r * 0.5} ${r * 0.5} 0 0 1 ${r} 0 z`} fill="#2b303a" opacity={0.85} />
      <circle cx={cx} cy={cy} r={2.4} fill="#cbd5e1" stroke="#6b7280" strokeWidth={0.6} />
      <rect x={cx - 6} y={cy + r - 4} width={12} height={5} rx={1.5} fill="#1b1f27" />
    </g>
  );
}

function Ultrasonic({ w, h, state }) {
  const d = state?.distance;
  const xs = slots(w, 4); // VCC, TRIG, ECHO, GND
  const pcbY = h * 0.08, pcbH = h * 0.76, rr = Math.min(pcbH * 0.4, w * 0.19);
  return (
    <g>
      <defs>
        <Grad id="pa-pcb" stops={[[0, '#2a7fc4'], [1, '#14548f']]} />
        <radialGradient id="pa-tx" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stopColor="#f3f5f8" /><stop offset="0.6" stopColor="#b3bac6" /><stop offset="1" stopColor="#7c8595" /></radialGradient>
      </defs>
      <rect x={2} y={pcbY} width={w - 4} height={pcbH} rx={3} fill="url(#pa-pcb)" stroke="#0e3f6e" strokeWidth={1.2} />
      {[[8, pcbY + 6], [w - 8, pcbY + 6], [8, pcbY + pcbH - 6], [w - 8, pcbY + pcbH - 6]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} fill="#0b2c4d" stroke="#d4a017" strokeWidth={0.8} />)}
      {/* the two ultrasonic transducers: the part everyone recognises */}
      {[w * 0.27, w * 0.73].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={pcbY + pcbH * 0.48} r={rr + 3} fill="#c9ced6" stroke="#6b7280" strokeWidth={1} />
          <circle cx={x} cy={pcbY + pcbH * 0.48} r={rr} fill="url(#pa-tx)" stroke="#6b7280" strokeWidth={1} />
          <circle cx={x} cy={pcbY + pcbH * 0.48} r={rr * 0.72} fill="#2a2f38" stroke="#9aa4b2" strokeWidth={1} />
          <circle cx={x} cy={pcbY + pcbH * 0.48} r={rr * 0.5} fill="none" stroke="#4b5563" strokeWidth={0.8} />
          <circle cx={x} cy={pcbY + pcbH * 0.48} r={rr * 0.26} fill="#8b93a1" />
        </g>
      ))}
      <rect x={w * 0.43} y={pcbY + pcbH * 0.32} width={w * 0.14} height={pcbH * 0.2} rx={pcbH * 0.1} fill="url(#pa-tx)" stroke="#6b7280" strokeWidth={0.8} />
      <rect x={w * 0.44} y={pcbY + pcbH * 0.62} width={w * 0.12} height={pcbH * 0.14} rx={1} fill="#15181d" />
      <text x={w / 2} y={pcbY + pcbH * 0.2} textAnchor="middle" fontSize={7} fill="#e0f0ff" fontWeight={700} fontFamily="system-ui, sans-serif">HC-SR04</text>
      {/* 4-pin header sitting exactly on the pins */}
      <rect x={xs[0] - 8} y={pcbY + pcbH - 3} width={xs[3] - xs[0] + 16} height={9} rx={1.5} fill="#1a1a1a" />
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 1.6} y={pcbY + pcbH - 1} width={3.2} height={h - pcbY - pcbH + 1} fill="#d4a017" />
          <text x={x} y={pcbY + pcbH - 7} textAnchor="middle" fontSize={5.4} fill="#e0f0ff" fontFamily="system-ui, sans-serif">{['VCC', 'TRIG', 'ECHO', 'GND'][i]}</text>
        </g>
      ))}
      {d !== undefined && <text x={w / 2} y={pcbY - 1} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0ea5e9" fontFamily="system-ui, sans-serif">{Math.round(d)} cm</text>}
    </g>
  );
}

function Potentiometer({ w, h, state }) {
  const a = ((state?.knob ?? 50) / 100) * 270 - 135;
  const xs = slots(w, 3); // VCC, wiper, GND
  const cx = w / 2, cy = h * 0.38, S = Math.min(w * 0.62, h * 0.56);
  return (
    <g>
      <defs>
        <Grad id="pa-trim" stops={[[0, '#3b82d6'], [1, '#1f4f9a']]} />
        <radialGradient id="pa-brass" cx="0.38" cy="0.32" r="0.9"><stop offset="0" stopColor="#fff0b8" /><stop offset="0.55" stopColor="#d4a72c" /><stop offset="1" stopColor="#8a6a0a" /></radialGradient>
      </defs>
      {xs.map((x, i) => <Lead key={i} d={`M${x} ${cy + S / 2 - 2} V${h}`} wide={2.8} />)}
      <rect x={cx - S / 2} y={cy - S / 2} width={S} height={S} rx={5} fill="url(#pa-trim)" stroke="#143a74" strokeWidth={1.1} />
      <path d={`M${cx - S / 2 + 4} ${cy - S / 2 + 3} H${cx + S / 2 - 4}`} stroke="#fff" strokeWidth={1.2} opacity={0.4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={S * 0.36} fill="url(#pa-brass)" stroke="#6b5208" strokeWidth={1} />
      <g transform={`rotate(${a} ${cx} ${cy})`}>
        <rect x={cx - S * 0.3} y={cy - 2.2} width={S * 0.6} height={4.4} rx={1.4} fill="#3b2f05" />
        <rect x={cx - S * 0.3} y={cy - 2.2} width={S * 0.6} height={1.4} rx={0.7} fill="#ffffff" opacity={0.25} />
      </g>
      <text x={cx} y={cy - S / 2 - 4} textAnchor="middle" fontSize={6.5} fill="#93c5fd" fontWeight={700} fontFamily="system-ui, sans-serif">10kΩ</text>
    </g>
  );
}

function Battery9V({ w, h }) {
  const [xn, xp] = slots(w, 2); // − hexagon socket, + round stud
  const bx = w * 0.14, bw = w * 0.72, by = h * 0.2;
  return (
    <g>
      <defs>
        <Grad id="pa-9v-top" x1={0} x2={1} y1={0} y2={0} stops={[[0, '#a66a2c'], [0.4, '#e3a25b'], [1, '#9a5f25']]} />
        <Grad id="pa-9v-body" x1={0} x2={1} y1={0} y2={0} stops={[[0, '#14161a'], [0.4, '#3a3d44'], [1, '#0e1013']]} />
      </defs>
      <rect x={bx} y={by} width={bw} height={h - by - 2} rx={4} fill="url(#pa-9v-body)" stroke="#000" strokeWidth={1} />
      <rect x={bx} y={by + 2} width={bw} height={(h - by) * 0.42} fill="url(#pa-9v-top)" />
      <text x={w / 2} y={by + (h - by) * 0.3} textAnchor="middle" fontSize={15} fontWeight={800} fill="#f8fafc" fontFamily="system-ui, sans-serif">9V</text>
      <text x={w / 2} y={h * 0.84} textAnchor="middle" fontSize={7} fill="#cbd5e1" fontFamily="system-ui, sans-serif" letterSpacing="1">BATTERY</text>
      <rect x={bx + 2} y={by + 3} width={bw - 4} height={2} rx={1} fill="#fff" opacity={0.3} />
      {/* the snap connector: hexagon socket (−) and round stud (+) */}
      <rect x={xn - 9} y={by - 8} width={18} height={10} rx={2} fill="#9aa4b2" stroke="#4b5563" strokeWidth={0.8} />
      <path d={`M${xn - 4.5} ${by - 3} l2.2 -3 h4.6 l2.2 3 l-2.2 3 h-4.6 z`} fill="#3b4150" />
      <rect x={xp - 6} y={by - 8} width={12} height={10} rx={5} fill="#c8cfd9" stroke="#4b5563" strokeWidth={0.8} />
      <circle cx={xp} cy={by - 3} r={2.4} fill="#6b7280" />
      <Lead d={`M${xn} ${by - 8} V0`} /><Lead d={`M${xp} ${by - 8} V0`} />
      <text x={xn} y={by + 14} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff" fontFamily="system-ui, sans-serif">−</text>
      <text x={xp} y={by + 14} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff" fontFamily="system-ui, sans-serif">+</text>
    </g>
  );
}

function AaBattery({ w, h }) {
  const [xn, xp] = slots(w, 2);
  const bx = w * 0.12, bw = w * 0.76, by = h * 0.14, bh = h - by - 4;
  return (
    <g>
      <defs>
        <Grad id="pa-aa" x1={0} x2={1} y1={0} y2={0} stops={[[0, '#1aa39a'], [0.35, '#52d3c8'], [1, '#0f7f78']]} />
      </defs>
      <Wire d={`M${xn} ${by + 6} V0`} color="#1f2937" /><Wire d={`M${xp} ${by + 6} V0`} color="#dc2626" />
      {/* plastic holder */}
      <rect x={bx} y={by} width={bw} height={bh} rx={5} fill="#15181d" stroke="#000" strokeWidth={1} />
      <rect x={bx + 4} y={by + 8} width={bw - 8} height={bh - 16} rx={4} fill="url(#pa-aa)" stroke="#0b5b56" strokeWidth={0.8} />
      <rect x={w / 2 - 6} y={by + 3} width={12} height={6} rx={2} fill="#d5dae2" stroke="#6b7280" strokeWidth={0.6} />
      <text x={w / 2} y={by + bh / 2} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff" fontFamily="system-ui, sans-serif" transform={`rotate(-90 ${w / 2} ${by + bh / 2})`} letterSpacing="1">AA 1.5V</text>
      <text x={w / 2} y={by + 22} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff" fontFamily="system-ui, sans-serif">+</text>
      <text x={w / 2} y={by + bh - 8} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff" fontFamily="system-ui, sans-serif">−</text>
      <rect x={bx + 7} y={by + 12} width={3} height={bh - 24} rx={1.5} fill="#fff" opacity={0.28} />
    </g>
  );
}

const ART = {
  arduino_uno: ArduinoUno, arduino_nano: ArduinoNano, esp32: Esp32, breadboard: Breadboard,
  led: Led, rgb_led: RgbLed, resistor: Resistor, push_button: PushButton, buzzer: Buzzer, servo: Servo, dc_motor: DcMotor,
  gear_motor: GearMotor, vibration_motor: VibrationMotor, aa_battery: AaBattery,
  ir_sensor: IrSensor, ultrasonic: Ultrasonic, ldr: Ldr, potentiometer: Potentiometer,
  lcd: (p) => <Display {...p} />, oled: (p) => <Display {...p} oled />,
  motor_driver: MotorDriver, mpu6050: Imu, battery: Battery9V, power_supply: PowerSupply,
};

/** Draws one component's artwork at its own size. */
export default function PartArt({ type, def, state, running }) {
  const d = def || getDef(type);
  if (!d) return null;
  const Art = ART[type];
  if (!Art) {
    return (
      <g>
        <rect x={3} y={3} width={d.w - 6} height={d.h - 6} rx={5} fill="#1f2937" stroke="#334155" />
        <text x={d.w / 2} y={d.h / 2} textAnchor="middle" fontSize={22}>{d.emoji}</text>
      </g>
    );
  }
  return <Art w={d.w} h={d.h} state={state} running={running} />;
}

/** Small thumbnail of the same artwork, for palettes and lists. */
export function PartThumb({ type, size = 34, className = '' }) {
  const d = getDef(type);
  if (!d) return null;
  return (
    <svg viewBox={`0 0 ${d.w} ${d.h}`} width={size} height={(size * d.h) / d.w} className={className} aria-hidden>
      <PartArt type={type} def={d} />
    </svg>
  );
}
