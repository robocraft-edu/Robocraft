// Ready-made robot parts (real-world sizes in mm) and guided design projects.
import { makeGroup, ungroup, objectSoup, soupBounds } from './shapes';

const P = (type, size, pos, extra = {}) => ({ type, size, pos, rot: [0, 0, 0], hole: false, ...extra });
// Printed artwork laid on a board's top face (drawn, never printed/exported).
const D = (decal, size, pos) => ({ type: 'box', size: [size[0], size[1], 0.02], pos, rot: [0, 0, 0], hole: false, decal });
// A row of gold header pins.
const PINS = (n, from, to, y, color = '#c8a94b') => Array.from({ length: n }, (_, i) => {
  const t = n === 1 ? 0.5 : i / (n - 1);
  return P('box', [1.1, 1.1, 3], [from[0] + (to[0] - from[0]) * t, y, from[1] + (to[1] - from[1]) * t], { color, visual: true });
});
const H = (type, size, pos, extra = {}) => P(type, size, pos, { hole: true, ...extra });
// Detail that is only drawn (not printed or exported).
const V = (type, size, pos, extra = {}) => P(type, size, pos, { visual: true, ...extra });
// Black female header strip with one square socket per pin.
const HEADER = (n, from, to) => {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) + 2.54;
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  return [
    P('box', [len, 2.5, 8.5], [mid[0], 1.6, mid[1]], { color: '#141416', mat: 'matte' }),
    ...Array.from({ length: n }, (_, i) => {
      const t = n === 1 ? 0.5 : i / (n - 1);
      return V('box', [1, 1, 0.3], [from[0] + (to[0] - from[0]) * t, 10, from[1] + (to[1] - from[1]) * t], { color: '#000000', mat: 'matte' });
    }),
  ];
};
// Silver legs along one side of a DIP chip.
const LEGS = (n, from, to) => Array.from({ length: n }, (_, i) => {
  const t = i / (n - 1);
  return V('box', [0.5, 1, 1.6], [from[0] + (to[0] - from[0]) * t, 1.6, from[1] + (to[1] - from[1]) * t], { color: '#c9ced6', mat: 'metal' });
});

export const PARTS = [
  {
    id: 'uno', name: 'Arduino Uno', note: '68.6 × 53.4 mm, M3 holes', color: '#0f766e',
    build: () => {
      const X = -34.3, Z = -26.7; // board corner → centred
      return [
        P('box', [68.6, 53.4, 1.6], [0, 0, 0], { color: '#0e6f74', mat: 'pcb' }),       // PCB
        D('uno_top', [68.6, 53.4], [0, 1.6, 0]),                                      // silkscreen
        P('box', [16, 12, 11], [X + 7, 1.6, Z + 12], { color: '#c9ced6', mat: 'metal' }), // USB-B (steel shell)
        V('box', [10, 0.4, 6], [X - 1.05, 4.2, Z + 12], { color: '#20242b', rot: [0, 0, 90] }), // USB opening
        P('box', [14, 9, 11], [X + 5, 1.6, Z + 45], { color: '#15181d', mat: 'plastic' }), // barrel jack
        V('cylinder', [6, 6, 0.6], [X - 2.1, 7.1, Z + 45], { color: '#050608', rot: [0, 0, 90] }),
        ...HEADER(10, [-7, Z + 4], [19, Z + 4]),                                      // female headers with sockets
        ...HEADER(8, [-29, Z + 4], [-11, Z + 4]),
        ...HEADER(8, [-2, Z + 50], [19, Z + 50]),
        ...HEADER(6, [-28, Z + 50], [-8, Z + 50]),
        P('box', [16, 9, 3], [2, 1.6, 0], { color: '#1b1d22', mat: 'matte' }),           // ATmega328P (DIP)
        ...LEGS(14, [-5.5, -5.3], [8.5, -5.3]), ...LEGS(14, [-5.5, 5.3], [8.5, 5.3]),
        V('cylinder', [1.4, 1.4, 0.3], [-4.6, 4.6, -2.8], { color: '#3a3d44' }),          // pin-1 dot
        P('cylinder', [5, 5, 3], [-16, 1.6, 6], { color: '#cfd6df', mat: 'metal' }),        // crystal can
        P('box', [8, 5, 3], [-24, 1.6, -4], { color: '#1b1d22', mat: 'matte' }),            // regulator
        V('box', [6, 2, 0.8], [-24, 1.6, -7.2], { color: '#c9ced6', mat: 'metal' }),        // regulator tab
        P('box', [3.5, 3.5, 2], [X + 10, 1.6, 0], { color: '#c9ced6', mat: 'metal' }),        // reset switch body
        V('cylinder', [2, 2, 1.2], [X + 10, 3.6, 0], { color: '#e11d48' }),                 // reset button cap
        V('cylinder', [3, 3, 4.5], [-6, 1.6, 12], { color: '#1f2a44', mat: 'plastic' }),   // capacitors
        V('cylinder', [3, 3, 4.5], [-2, 1.6, 12], { color: '#1f2a44', mat: 'plastic' }),
        ...[[-14, -10], [-11, -10], [-8, -10]].map(([x, z]) => V('box', [1.6, 0.8, 0.5], [x, 1.6, z], { color: '#c79a2a', mat: 'metal' })), // SMD resistors
        V('box', [1.2, 0.8, 0.6], [20, 1.6, -6], { color: '#22c55e', mat: 'glossy' }),      // power LED
        ...[[14, 2.5], [15.3, 50.7], [66.1, 7.6], [66.1, 35.5]].map(([x, z]) => H('cylinder', [3.2, 3.2, 6], [X + x, -2, Z + z])),
      ];
    },
  },
  {
    id: 'esp32', name: 'ESP32 DevKit', note: '55 × 28 mm, 30 pins', color: '#15181d',
    build: () => [
      P('box', [55, 28, 1.6], [0, 0, 0], { color: '#16181c', mat: 'pcb' }),
      D('esp_top', [55, 28], [0, 1.6, 0]),
      P('box', [26, 18, 3], [-6, 1.6, 0], { color: '#cfd6df', mat: 'brushed' }),          // shielded module
      P('box', [8, 12, 0.6], [14, 1.6, 0], { color: '#d4a017', mat: 'gold' }),             // PCB antenna
      P('box', [8, 7, 3], [-24, 1.6, 0], { color: '#c9ced6', mat: 'metal' }),              // micro-USB
      P('box', [4.5, 3.5, 2], [18, 1.6, -8], { color: '#c9ced6', mat: 'metal' }),          // BOOT / EN buttons
      P('box', [4.5, 3.5, 2], [18, 1.6, 8], { color: '#c9ced6', mat: 'metal' }),
      V('cylinder', [2, 2, 0.8], [18, 3.6, -8], { color: '#111827' }), V('cylinder', [2, 2, 0.8], [18, 3.6, 8], { color: '#111827' }),
      P('box', [50, 2.5, 2.5], [0, -2.5, -12.5], { color: '#111111', mat: 'matte' }),         // male headers underneath
      P('box', [50, 2.5, 2.5], [0, -2.5, 12.5], { color: '#111111', mat: 'matte' }),
      ...PINS(15, [-24, -12.5], [24, -12.5], -9),
      ...PINS(15, [-24, 12.5], [24, 12.5], -9),
    ],
  },
  {
    id: 'hcsr04', name: 'Ultrasonic HC-SR04', note: '45 × 20 mm, Ø16 eyes 26 mm apart', color: '#1d4ed8',
    build: () => [
      P('box', [45, 20, 1.6], [0, 0, 0], { color: '#1d4ed8', mat: 'pcb' }),
      D('sonar_top', [45, 20], [0, 1.6, 0]),
      ...[-13, 13].flatMap(x => [
        P('cylinder', [16, 16, 12], [x, 4, 1], { color: '#d3d8df', mat: 'brushed', rot: [90, 0, 0] }), // aluminium can
        V('tube', [16.2, 16.2, 1.2], [x, 4, 6.6], { color: '#e5e7eb', mat: 'metal', rot: [90, 0, 0] }), // rolled rim
        V('cylinder', [13.6, 13.6, 0.6], [x, 4, 6.8], { color: '#2b2f36', mat: 'matte', rot: [90, 0, 0] }), // mesh grille
      ]),
      P('box', [8, 4, 3], [0, 1.6, 2], { color: '#cfd6df', mat: 'metal' }),                // crystal
      P('box', [10, 2.5, 2.5], [0, -2.5, -8], { color: '#111111', mat: 'matte' }),           // 4-pin header
      ...PINS(4, [-3.8, -8], [3.8, -8], -8),
    ],
  },
  {
    id: 'sg90', name: 'Micro servo SG90', note: '22.5 × 12.2 mm body', color: '#2563eb',
    build: () => [
      P('box', [22.5, 12.2, 22.7], [0, 0, 0], { color: '#2b63d9', mat: 'translucent' }),       // see-through blue case
      P('box', [32.5, 12.2, 2.5], [0, 15.9, 0], { color: '#2b63d9', mat: 'translucent' }),      // mounting tabs
      P('cylinder', [11.8, 11.8, 4], [-5.4, 22.7, 0], { color: '#2b63d9', mat: 'translucent' }),
      P('cylinder', [4.8, 4.8, 3.5], [-5.4, 26.7, 0], { color: '#f4f4f5', mat: 'plastic' }),     // spline
      P('box', [24, 3.5, 2], [-14, 28.2, 0], { color: '#f4f4f5', mat: 'plastic' }),              // horn
      ...[-24, -20, -16, -12].map(x => V('cylinder', [1, 1, 2.2], [x, 28.1, 0], { color: '#9ca3af' })), // horn holes
      V('cylinder', [2.2, 2.2, 0.8], [-5.4, 30.2, 0], { color: '#c9ced6', mat: 'metal' }),       // horn screw
      P('cylinder', [10, 10, 4], [8, 6, 0], { color: '#2b63d9', mat: 'translucent', rot: [90, 0, 0] }), // motor can bump
      V('box', [3, 6, 1.6], [11.25, 2, 0], { color: '#3b2f2a', mat: 'rubber', rot: [0, 0, 90] }),  // cable gland
      V('box', [1.4, 1.2, 1.2], [14, 2.5, -1.4], { color: '#8b5a2b', mat: 'rubber' }),           // brown / red / orange wires
      V('box', [1.4, 1.2, 1.2], [14, 2.5, 0], { color: '#dc2626', mat: 'rubber' }),
      V('box', [1.4, 1.2, 1.2], [14, 2.5, 1.4], { color: '#f97316', mat: 'rubber' }),
      H('cylinder', [2, 2, 6], [-13.8, 14, 0]), H('cylinder', [2, 2, 6], [13.8, 14, 0]),
    ],
  },
  {
    id: 'tt', name: 'TT gear motor', note: '64 × 22.5 × 18.8 mm', color: '#facc15',
    build: () => [
      P('box', [64, 22.5, 18.8], [0, 0, 0], { color: '#f2c200', mat: 'glossy' }),              // gearbox
      ...[-24, -8, 8].map(x => V('cylinder', [3, 3, 0.6], [x, 18.8, 0], { color: '#c99f00', mat: 'plastic' })), // screw bosses
      P('cylinder', [20, 20, 25], [22, -3.1, 0], { color: '#d3d8df', mat: 'brushed', rot: [0, 0, 90] }), // motor can
      V('cylinder', [12, 12, 2], [35.5, 6.3, 0], { color: '#9aa1ab', mat: 'metal', rot: [0, 0, 90] }),  // end bell
      P('cylinder', [5.4, 5.4, 37], [-20, -8.5, 0], { color: '#f8fafc', mat: 'plastic', rot: [90, 0, 0] }), // double-D shaft
      P('box', [6, 3, 3], [30, 14, 4], { color: '#dc2626', mat: 'rubber' }),                   // wires
      P('box', [6, 3, 3], [30, 14, -4], { color: '#111827', mat: 'rubber' }),
      V('box', [2, 1, 4], [36.5, 12, 4], { color: '#c79a2a', mat: 'metal' }),                  // solder tabs
      V('box', [2, 1, 4], [36.5, 12, -4], { color: '#c79a2a', mat: 'metal' }),
      H('cylinder', [3, 3, 30], [10, 3, 0], { rot: [90, 0, 0] }), H('cylinder', [3, 3, 30], [27, 3, 0], { rot: [90, 0, 0] }),
    ],
  },
  {
    id: 'wheel', name: 'Wheel 65 mm', note: 'fits TT motor shaft', color: '#111827',
    build: () => [
      P('cylinder', [65, 65, 26], [0, 19.5, 0], { color: '#1c1c1e', mat: 'rubber', rot: [90, 0, 0] }), // tyre
      P('cylinder', [46, 46, 27], [0, 19, 0], { color: '#f2c200', mat: 'glossy', rot: [90, 0, 0] }),   // rim
      V('cylinder', [40, 40, 27.4], [0, 19, 0], { color: '#d9ad00', mat: 'plastic', rot: [90, 0, 0] }), // rim recess
      P('cylinder', [16, 16, 28], [0, 18.5, 0], { color: '#e5b800', mat: 'glossy', rot: [90, 0, 0] }),  // hub
      H('box', [3.7, 5.4, 40], [0, 12.5, 0], { rot: [90, 0, 0] }),
    ],
  },
  {
    id: 'l298n', name: 'L298N motor driver', note: '43 × 43 mm with heatsink', color: '#b91c1c',
    build: () => [
      P('box', [43, 43, 1.6], [0, 0, 0], { color: '#b3121b', mat: 'pcb' }),
      D('driver_top', [43, 43], [0, 1.6, 0]),
      P('box', [20, 4, 16], [0, 1.6, 10], { color: '#1b1d22', mat: 'brushed' }),               // heatsink base
      ...[-8, -4, 0, 4, 8].map(x => V('box', [1.4, 14, 16], [x, 1.6, 4], { color: '#1b1d22', mat: 'brushed' })), // fins
      ...[-12, 12].flatMap(x => [
        P('box', [16, 10, 10], [x, 1.6, -14], { color: '#1d63c9', mat: 'plastic' }),            // blue screw terminals
        V('cylinder', [3.2, 3.2, 0.6], [x - 4, 11.6, -14], { color: '#c9ced6', mat: 'metal' }),
        V('cylinder', [3.2, 3.2, 0.6], [x + 4, 11.6, -14], { color: '#c9ced6', mat: 'metal' }),
      ]),
      P('box', [24, 2.5, 2.5], [0, 1.6, 17], { color: '#111111', mat: 'matte' }),
      ...PINS(6, [-10, 17], [10, 17], 4.1),
      V('cylinder', [6, 6, 8], [-15, 1.6, 4], { color: '#1f2a44', mat: 'plastic' }),            // capacitor
      ...[[-18, -18], [18, -18], [-18, 18], [18, 18]].map(([x, z]) => H('cylinder', [3.2, 3.2, 6], [x, -2, z])),
    ],
  },
  {
    id: 'battery', name: '2 × 18650 holder', note: '76 × 42 × 22 mm', color: '#1f2937',
    build: () => [
      P('box', [76, 42, 10], [0, 0, 0], { color: '#18181b', mat: 'plastic' }),
      ...[-11, 11].flatMap(z => [
        P('cylinder', [18.6, 18.6, 65], [0, -13.5, z], { color: '#1d7a3a', mat: 'glossy', rot: [0, 0, 90] }), // cell wrap
        V('cylinder', [10, 10, 1], [32.8, -5.2, z], { color: '#d1d5db', mat: 'metal', rot: [0, 0, 90] }),      // + cap
      ]),
      P('box', [3, 42, 14], [-37, 0, 0], { color: '#27272a', mat: 'plastic' }),
      P('box', [3, 42, 14], [37, 0, 0], { color: '#27272a', mat: 'plastic' }),
      V('box', [0.6, 10, 10], [-35.2, 3, -11], { color: '#d1d5db', mat: 'metal' }),            // springs / contacts
      V('box', [0.6, 10, 10], [-35.2, 3, 11], { color: '#d1d5db', mat: 'metal' }),
      P('box', [8, 3, 3], [40, 4, -6], { color: '#dc2626', mat: 'rubber' }),
      P('box', [8, 3, 3], [40, 4, 6], { color: '#111827', mat: 'rubber' }),
    ],
  },
  {
    id: 'breadboard', name: 'Mini breadboard', note: '83 × 55 mm, 400 points', color: '#f3f4f6',
    build: () => [
      P('box', [83, 55, 9], [0, 0, 0], { color: '#f4f4f2', mat: 'matte' }),
      D('breadboard_top', [83, 55], [0, 9, 0]),
      P('box', [75, 3, 1.4], [0, 8.2, 0], { color: '#d9d9d6', mat: 'matte' }),                // centre channel
    ],
  },
  {
    id: 'caster', name: 'Ball caster', note: 'Ø15 mm ball', color: '#94a3b8',
    build: () => [
      P('dome', [24, 24, 10], [0, 7, 0], { color: '#9aa1ab', mat: 'brushed', mirror: [1, -1, 1] }),
      P('sphere', [15, 15, 15], [0, 0, 0], { color: '#e5e7eb', mat: 'metal' }),
      P('box', [36, 14, 2], [0, 17, 0], { color: '#9aa1ab', mat: 'brushed' }),
      H('cylinder', [3.2, 3.2, 8], [-15, 15, 0]), H('cylinder', [3.2, 3.2, 8], [15, 15, 0]),
    ],
  },
  {
    id: 'led5', name: 'LED 5 mm', note: 'with legs', color: '#ef4444',
    build: () => [
      P('cylinder', [5, 5, 6], [0, 2, 0], { color: '#ef4444', mat: 'glass' }),
      P('dome', [5, 5, 2.5], [0, 8, 0], { color: '#f05252', mat: 'glass' }),
      P('cylinder', [5.8, 5.8, 1], [0, 1, 0], { color: '#e23b3b', mat: 'glass' }),
      V('box', [1.2, 0.6, 2.2], [0.4, 3, 0], { color: '#9ca3af', mat: 'metal' }),            // die frame inside
      P('box', [0.5, 0.5, 18], [-1.2, -18, 0], { color: '#c9ced6', mat: 'metal' }),
      P('box', [0.5, 0.5, 14], [1.2, -14, 0], { color: '#c9ced6', mat: 'metal' }),
    ],
  },
  { id: 'm3', name: 'M3 screw hole', note: 'Ø3.2 × 20 mm hole', color: '#6b7280', single: () => H('cylinder', [3.2, 3.2, 20], [0, -5, 0]) },
  { id: 'nut', name: 'M3 nut trap', note: 'hexagon 6.4 mm, 2.5 mm deep', color: '#6b7280', single: () => H('hex', [6.4, 6.4, 2.5], [0, 0, 0]) },
];

export function buildPart(part) {
  if (part.single) return { ...part.single(), name: part.name };
  return makeGroup(part.build(), { name: part.name, color: part.color });
}

// ── flatten a design into world-space primitives (for checks) ──
export function flatten(objs) {
  const out = [];
  const walk = (o, holeParent) => {
    if (o.type === 'group') ungroup(o).forEach(c => walk(c, holeParent || o.hole));
    else out.push({ ...o, hole: o.hole || holeParent });
  };
  objs.forEach(o => walk(o, false));
  return out;
}

export function designBounds(objs) {
  const solids = objs.filter(o => !o.hole);
  if (!solids.length) return null;
  const b = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  for (const o of solids) { const bb = soupBounds(objectSoup(o)); for (let k = 0; k < 3; k++) { b.min[k] = Math.min(b.min[k], bb.min[k]); b.max[k] = Math.max(b.max[k], bb.max[k]); } }
  return { ...b, size: b.max.map((v, k) => v - b.min[k]) }; // size: [x, y(height), z]
}

const near = (a, b, tol) => Math.abs(a - b) <= tol;
// holes that were grouped (actually cut) and are round
function roundHoles(objs) {
  return flatten(objs.filter(o => o.type === 'group')).filter(o => o.hole && (o.type === 'cylinder' || o.type === 'hex') && near(o.size[0], o.size[1], 0.3));
}

export const PROJECTS = [
  {
    id: 'chassis', title: 'Robot chassis plate', level: 'Class 9–10',
    brief: 'Design the base plate for a 2-wheel robot that carries an Arduino Uno, two TT motors and a 9 V battery.',
    steps: [
      'Add a Box and make it 160 mm wide (X), 110 mm deep and 4 mm tall.',
      'Add Cylinder holes of Ø3.2 mm (M3 screws) where the motors will be bolted — at least 4.',
      'Add a hole Ø12 mm or bigger in the middle to pass wires through.',
      'Select the plate and all holes, then tap Group — the holes cut through.',
      'Drop the Arduino Uno part on top to check it fits. Export STL for 3-D printing.',
    ],
    checks: (objs) => {
      const b = designBounds(objs.filter(o => !o.name || !/Arduino|motor|battery|Wheel/i.test(o.name)));
      const holes = roundHoles(objs);
      return [
        { label: 'Plate at least 150 × 100 mm', ok: !!b && b.size[0] >= 150 && b.size[2] >= 100 },
        { label: 'Plate 3–6 mm thick', ok: !!b && b.size[1] >= 3 && b.size[1] <= 6 },
        { label: '4 or more M3 holes (Ø3–3.5) cut', ok: holes.filter(h => h.size[0] >= 3 && h.size[0] <= 3.5).length >= 4 },
        { label: 'Wire hole Ø12 mm or larger cut', ok: holes.some(h => h.size[0] >= 12) },
      ];
    },
  },
  {
    id: 'sonar', title: 'Ultrasonic sensor holder', level: 'Class 9–10',
    brief: 'A front plate that holds the HC-SR04. Its two "eyes" are Ø16 mm and their centres are 26 mm apart.',
    steps: [
      'Add a Box 50 × 3 × 25 mm (stand it upright: width 50, depth 3, height 25).',
      'Add two Cylinder holes Ø16 mm, rotate them 90° about X so they go through the plate.',
      'Place them 26 mm apart (x = −13 and x = +13) at the same height.',
      'Group the plate with both holes. Add a base Box underneath so it can be screwed to the chassis.',
    ],
    checks: (objs) => {
      const holes = roundHoles(objs).filter(h => near(h.size[0], 16, 1));
      let gap = 0;
      if (holes.length >= 2) gap = Math.hypot(holes[0].pos[0] - holes[1].pos[0], holes[0].pos[2] - holes[1].pos[2]);
      return [
        { label: 'Two Ø16 mm holes cut', ok: holes.length >= 2 },
        { label: 'Hole centres 26 mm apart (±1)', ok: holes.length >= 2 && near(gap, 26, 1) },
        { label: 'Holes at the same height', ok: holes.length >= 2 && near(holes[0].pos[1], holes[1].pos[1], 0.6) },
      ];
    },
  },
  {
    id: 'wheel', title: 'Custom wheel', level: 'Class 9',
    brief: 'Design a 3-D printable wheel for a TT motor. TT shafts are 5.4 mm with two flats (3.7 mm).',
    steps: [
      'Add a Cylinder 64 × 64 mm, 8 mm tall — this is the wheel.',
      'Add a Tube or Torus around it for a tyre (optional).',
      'Add a Box hole 3.7 × 5.4 mm (or a Cylinder hole Ø5.5) in the centre for the shaft.',
      'Add 4–6 Cylinder holes around the wheel to save plastic (spokes look).',
      'Group everything. Export STL.',
    ],
    checks: (objs) => {
      const b = designBounds(objs);
      const holes = flatten(objs.filter(o => o.type === 'group')).filter(o => o.hole);
      const centre = b ? [(b.min[0] + b.max[0]) / 2, (b.min[2] + b.max[2]) / 2] : [0, 0];
      const shaft = holes.some(h => Math.hypot(h.pos[0] - centre[0], h.pos[2] - centre[1]) < 2 && Math.min(h.size[0], h.size[1]) <= 6);
      return [
        { label: 'Diameter 60–70 mm', ok: !!b && b.size[0] >= 60 && b.size[0] <= 70 && near(b.size[0], b.size[2], 2) },
        { label: 'Width 6–30 mm', ok: !!b && b.size[1] >= 6 && b.size[1] <= 30 },
        { label: 'Shaft hole in the centre', ok: shaft },
        { label: '4 or more lightening holes', ok: holes.length >= 5 },
      ];
    },
  },
  {
    id: 'servoarm', title: 'Servo arm (gripper link)', level: 'Class 10–11',
    brief: 'A 70 mm link for a robotic arm: a round end that fits the servo horn and a row of holes for adjusting the length.',
    steps: [
      'Add a Box 70 × 10 × 4 mm.',
      'Add a Cylinder Ø12 × 4 mm at one end so the end is rounded.',
      'Add at least 4 Cylinder holes Ø2 mm along the arm, 8 mm apart.',
      'Group everything and export STL.',
    ],
    checks: (objs) => {
      const b = designBounds(objs);
      const holes = roundHoles(objs).filter(h => h.size[0] <= 3.5);
      return [
        { label: 'Length 65–80 mm', ok: !!b && Math.max(b.size[0], b.size[2]) >= 65 && Math.max(b.size[0], b.size[2]) <= 80 },
        { label: 'Thickness 3–6 mm', ok: !!b && b.size[1] >= 3 && b.size[1] <= 6 },
        { label: '4 or more small holes cut', ok: holes.length >= 4 },
      ];
    },
  },
  {
    id: 'stand', title: 'Phone stand', level: 'Class 9',
    brief: 'A stand that holds a phone at an angle — great first print.',
    steps: [
      'Add a Wedge 80 × 70 mm, 70 mm tall.',
      'Add a Box hole across it to make a slot 12 mm wide for the phone.',
      'Add a Box hole at the bottom for the charging cable.',
      'Group and export.',
    ],
    checks: (objs) => {
      const b = designBounds(objs);
      const holes = flatten(objs.filter(o => o.type === 'group')).filter(o => o.hole);
      return [
        { label: 'At least 60 mm tall', ok: !!b && b.size[1] >= 60 },
        { label: 'Base at least 60 × 60 mm', ok: !!b && b.size[0] >= 60 && b.size[2] >= 60 },
        { label: 'A slot cut (hole in a group)', ok: holes.length >= 1 },
      ];
    },
  },
];
