// Silkscreen artwork painted onto the top face of boards in the 3-D studio,
// so an Arduino looks like an Arduino instead of a green slab.
// Each function draws into a canvas whose aspect matches the board.

const px = (mm) => Math.round(mm * 14);

function pcb(w, h, color, radius = 10) {
  const c = document.createElement('canvas');
  c.width = px(w); c.height = px(h);
  const g = c.getContext('2d');
  g.fillStyle = color;
  g.beginPath();
  if (g.roundRect) g.roundRect(0, 0, c.width, c.height, radius); else g.rect(0, 0, c.width, c.height);
  g.fill();
  return { c, g, W: c.width, H: c.height, s: c.width / w };
}

function headerStrip(g, x, y, w, h, n, horizontal = true) {
  g.fillStyle = '#17181c';
  g.fillRect(x, y, w, h);
  g.fillStyle = '#c8a94b';
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const cx = horizontal ? x + t * w : x + w / 2;
    const cy = horizontal ? y + h / 2 : y + t * h;
    g.fillRect(cx - h * 0.14, cy - h * 0.14, h * 0.28, h * 0.28);
  }
}

function label(g, text, x, y, size, color = '#e6fffb', align = 'center', weight = '700') {
  g.fillStyle = color;
  g.font = `${weight} ${size}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
  g.textAlign = align; g.textBaseline = 'middle';
  g.fillText(text, x, y);
}

/** Arduino Uno, viewed from the top (68.6 × 53.4 mm). */
function unoTop() {
  const { c, g, W, H, s } = pcb(68.6, 53.4, '#0e7f86', 14);
  // white silkscreen border
  g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 2;
  g.strokeRect(6, 6, W - 12, H - 12);
  // digital header (top edge) and power/analog header (bottom edge)
  headerStrip(g, 8 * s, 1.5 * s, 28 * s, 4 * s, 8);
  headerStrip(g, 38 * s, 1.5 * s, 22 * s, 4 * s, 6);
  headerStrip(g, 6 * s, 47.5 * s, 20 * s, 4 * s, 6);
  headerStrip(g, 29 * s, 47.5 * s, 28 * s, 4 * s, 8);
  label(g, 'DIGITAL (PWM ~)', 34 * s, 7.5 * s, 3.6 * s, 'rgba(255,255,255,0.8)');
  label(g, 'POWER', 15 * s, 45 * s, 3.4 * s, 'rgba(255,255,255,0.8)');
  label(g, 'ANALOG IN', 43 * s, 45 * s, 3.4 * s, 'rgba(255,255,255,0.8)');
  // ATmega328P
  g.fillStyle = '#1b1d22'; g.fillRect(24 * s, 24 * s, 24 * s, 11 * s);
  g.fillStyle = '#cbd5e1';
  for (let i = 0; i < 14; i++) { g.fillRect((25 + i * 1.6) * s, 22.6 * s, 0.9 * s, 1.4 * s); g.fillRect((25 + i * 1.6) * s, 35 * s, 0.9 * s, 1.4 * s); }
  label(g, 'ATMEGA328P', 36 * s, 29.5 * s, 2.8 * s, '#9aa4b2');
  // crystal, regulator, ICSP, reset
  g.fillStyle = '#9ca3af'; g.beginPath(); g.ellipse(19 * s, 29 * s, 4 * s, 2.4 * s, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1b1d22'; g.fillRect(55 * s, 25 * s, 7 * s, 5 * s);
  g.fillStyle = '#17181c'; g.fillRect(60 * s, 12 * s, 5 * s, 7 * s);
  g.fillStyle = '#c8a94b';
  for (let r = 0; r < 3; r++) for (let col = 0; col < 2; col++) g.fillRect((60.8 + col * 2.6) * s, (13 + r * 2.2) * s, 1.1 * s, 1.1 * s);
  g.fillStyle = '#dc2626'; g.beginPath(); g.arc(12 * s, 10 * s, 2.4 * s, 0, Math.PI * 2); g.fill();
  // status LEDs
  const leds = [['#22c55e', 20], ['#f59e0b', 23.5], ['#f59e0b', 27]];
  leds.forEach(([col, x]) => { g.fillStyle = col; g.fillRect(x * s, 10 * s, 2.2 * s, 1.4 * s); });
  label(g, 'ARDUINO', 44 * s, 38 * s, 5.6 * s, '#ffffff');
  label(g, 'UNO', 44 * s, 43 * s, 3.4 * s, 'rgba(255,255,255,0.85)');
  // mounting holes
  g.fillStyle = '#0b4d52';
  [[14, 2.5], [15.3, 50.7], [66.1, 7.6], [66.1, 35.5]].forEach(([x, y]) => {
    g.beginPath(); g.arc(x * s, y * s, 1.6 * s, 0, Math.PI * 2); g.fill();
  });
  return c;
}

/** HC-SR04 ultrasonic board, top view (45 × 20 mm). */
function sonarTop() {
  const { c, g, s } = pcb(45, 20, '#1d4ed8', 8);
  g.fillStyle = '#0f172a'; g.fillRect(19 * s, 5 * s, 7 * s, 10 * s);
  label(g, 'HC-SR04', 22.5 * s, 18 * s, 2.6 * s, '#dbeafe');
  headerStrip(g, 15 * s, 0.4 * s, 15 * s, 3 * s, 4);
  ['VCC', 'TRIG', 'ECHO', 'GND'].forEach((t, i) => label(g, t, (16.9 + i * 3.75) * s, 4.6 * s, 1.8 * s, '#dbeafe'));
  return c;
}

/** L298N motor-driver board, top view (43 × 43 mm). */
function driverTop() {
  const { c, g, s } = pcb(43, 43, '#b91c1c', 8);
  g.fillStyle = '#1b1d22'; g.fillRect(14 * s, 16 * s, 15 * s, 12 * s);
  label(g, 'L298N', 21.5 * s, 22 * s, 3 * s, '#fecaca');
  headerStrip(g, 3 * s, 3 * s, 16 * s, 3.2 * s, 4);
  ['IN1', 'IN2', 'IN3', 'IN4'].forEach((t, i) => label(g, t, (4.9 + i * 4) * s, 8 * s, 1.9 * s, '#fee2e2'));
  headerStrip(g, 26 * s, 3 * s, 8 * s, 3.2 * s, 2);
  ['ENA', 'ENB'].forEach((t, i) => label(g, t, (28 + i * 4) * s, 8 * s, 1.9 * s, '#fee2e2'));
  g.fillStyle = '#15803d'; g.fillRect(2 * s, 34 * s, 16 * s, 7 * s); g.fillRect(25 * s, 34 * s, 16 * s, 7 * s);
  label(g, 'OUT1 OUT2', 10 * s, 37.5 * s, 2.2 * s, '#dcfce7');
  label(g, '12V GND 5V', 33 * s, 37.5 * s, 2.2 * s, '#dcfce7');
  return c;
}

/** ESP32 DevKit, top view (55 × 28 mm). */
function espTop() {
  const { c, g, s } = pcb(55, 28, '#1f2937', 8);
  g.fillStyle = '#9ca3af'; g.fillRect(16 * s, 4 * s, 22 * s, 16 * s);
  g.strokeStyle = '#d1d5db'; g.lineWidth = 1.5; g.strokeRect(17.5 * s, 5.5 * s, 19 * s, 13 * s);
  label(g, 'ESP-WROOM-32', 27 * s, 12 * s, 2.6 * s, '#f3f4f6');
  g.strokeStyle = '#f9fafb'; g.lineWidth = 3 * s * 0.5;
  g.beginPath(); g.moveTo(14 * s, 6 * s); g.lineTo(6 * s, 6 * s); g.lineTo(6 * s, 10 * s); g.lineTo(12 * s, 10 * s); g.stroke();
  headerStrip(g, 2 * s, 0.5 * s, 51 * s, 3 * s, 15);
  headerStrip(g, 2 * s, 24.5 * s, 51 * s, 3 * s, 15);
  label(g, 'ESP32 DEVKIT', 40 * s, 23 * s, 2.6 * s, '#e5e7eb');
  return c;
}

/** Battery label (26.5 × 48.5 mm side). */
function batteryLabel() {
  const { c, g, s } = pcb(26.5, 48.5, '#111827', 6);
  g.fillStyle = '#f59e0b'; g.fillRect(0, 10 * s, c.width, 14 * s);
  label(g, '9V', 13 * s, 17 * s, 9 * s, '#111827', 'center', '800');
  label(g, 'ALKALINE', 13 * s, 30 * s, 3.4 * s, '#e5e7eb');
  label(g, 'BATTERY', 13 * s, 35 * s, 3.4 * s, '#9ca3af');
  return c;
}


/** Mini breadboard (83 × 55 mm): 30 columns × 2 blocks of 5 holes, two power rails each side. */
function breadboardTop() {
  const { c, g, s } = pcb(83, 55, '#f4f4f2', 8);
  const hole = (x, y) => { g.fillStyle = '#2b2b2b'; g.fillRect(x - 0.55 * s, y - 0.55 * s, 1.1 * s, 1.1 * s); };
  const x0 = 4.4;
  for (let col = 0; col < 30; col++) {
    const x = (x0 + col * 2.54) * s;
    for (let r = 0; r < 5; r++) { hole(x, (12.3 + r * 2.54) * s); hole(x, (32.6 + r * 2.54) * s); }
  }
  for (const [y, color] of [[2.6, '#d62828'], [52.4, '#1d4ed8']]) { g.fillStyle = color; g.fillRect(3 * s, y * s, 77 * s, 0.5 * s); }
  for (const [y, color] of [[8.2, '#1d4ed8'], [46.8, '#d62828']]) { g.fillStyle = color; g.fillRect(3 * s, y * s, 77 * s, 0.5 * s); }
  for (let col = 0; col < 25; col++) {
    if (col % 5 === 4) continue;
    const x = (7 + col * 2.9) * s;
    for (const y of [4.4, 6.6, 48.6, 50.8]) hole(x, y * s);
  }
  g.fillStyle = '#9ca3af'; g.font = `${1.6 * s}px sans-serif`;
  for (let col = 0; col < 30; col += 5) g.fillText(String(col + 1), (x0 + col * 2.54 - 0.5) * s, 11 * s);
  'abcde'.split('').forEach((ch, i) => g.fillText(ch, 1.2 * s, (12.8 + i * 2.54) * s));
  'fghij'.split('').forEach((ch, i) => g.fillText(ch, 1.2 * s, (33.1 + i * 2.54) * s));
  return c;
}

const MAKERS = { breadboard_top: breadboardTop, uno_top: unoTop, sonar_top: sonarTop, driver_top: driverTop, esp_top: espTop, battery_label: batteryLabel };
const CACHE = {};

/** A canvas with the named silkscreen, cached per session. */
export function decalCanvas(name) {
  if (!MAKERS[name]) return null;
  if (!CACHE[name]) CACHE[name] = MAKERS[name]();
  return CACHE[name];
}
