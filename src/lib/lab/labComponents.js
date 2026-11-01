// Component catalog for the Tinkercad-like Build With Me lab.
// Each component has REAL identifiable pins. Pin sides: left/right/top/bottom.
// Local pin positions are computed by distributing pins evenly along their side.

export const LAB_COMPONENTS = {
  arduino_uno: {
    name: 'Arduino Uno', category: 'Boards', w: 210, h: 150, color: '#0EA5E9', emoji: '🔌',
    pins: [
      { id: 'D0', label: 'D0', side: 'top', type: 'digital' }, { id: 'D1', label: 'D1', side: 'top', type: 'digital' },
      { id: 'D2', label: 'D2', side: 'top', type: 'digital' }, { id: 'D3', label: 'D3~', side: 'top', type: 'pwm' },
      { id: 'D4', label: 'D4', side: 'top', type: 'digital' }, { id: 'D5', label: 'D5~', side: 'top', type: 'pwm' },
      { id: 'D6', label: 'D6~', side: 'top', type: 'pwm' }, { id: 'D7', label: 'D7', side: 'top', type: 'digital' },
      { id: 'D8', label: 'D8', side: 'top', type: 'digital' }, { id: 'D9', label: 'D9~', side: 'top', type: 'pwm' },
      { id: 'D10', label: 'D10~', side: 'top', type: 'pwm' }, { id: 'D11', label: 'D11~', side: 'top', type: 'pwm' },
      { id: 'D12', label: 'D12', side: 'top', type: 'digital' }, { id: 'D13', label: 'D13', side: 'top', type: 'digital' },
      { id: 'A0', label: 'A0', side: 'bottom', type: 'analog' }, { id: 'A1', label: 'A1', side: 'bottom', type: 'analog' },
      { id: 'A2', label: 'A2', side: 'bottom', type: 'analog' }, { id: 'A3', label: 'A3', side: 'bottom', type: 'analog' },
      { id: 'A4', label: 'A4', side: 'bottom', type: 'analog' }, { id: 'A5', label: 'A5', side: 'bottom', type: 'analog' },
      { id: '5V', label: '5V', side: 'bottom', type: 'power' }, { id: '3V3', label: '3.3V', side: 'bottom', type: 'power' },
      { id: 'GND', label: 'GND', side: 'bottom', type: 'ground' }, { id: 'GND2', label: 'GND', side: 'bottom', type: 'ground' },
      { id: 'VIN', label: 'VIN', side: 'bottom', type: 'power' }, { id: 'REF', label: 'AREF', side: 'bottom', type: 'signal' },
    ],
  },
  arduino_nano: {
    name: 'Arduino Nano', category: 'Boards', w: 170, h: 130, color: '#0EA5E9', emoji: '🔌',
    pins: [
      { id: 'D2', label: 'D2', side: 'top', type: 'digital' }, { id: 'D3', label: 'D3~', side: 'top', type: 'pwm' },
      { id: 'D4', label: 'D4', side: 'top', type: 'digital' }, { id: 'D5', label: 'D5~', side: 'top', type: 'pwm' },
      { id: 'D6', label: 'D6~', side: 'top', type: 'pwm' }, { id: 'D7', label: 'D7', side: 'top', type: 'digital' },
      { id: 'D8', label: 'D8', side: 'top', type: 'digital' }, { id: 'D9', label: 'D9~', side: 'top', type: 'pwm' },
      { id: 'D10', label: 'D10~', side: 'top', type: 'pwm' }, { id: 'D11', label: 'D11~', side: 'top', type: 'pwm' },
      { id: 'D12', label: 'D12', side: 'top', type: 'digital' }, { id: 'D13', label: 'D13', side: 'top', type: 'digital' },
      { id: 'A0', label: 'A0', side: 'bottom', type: 'analog' }, { id: 'A1', label: 'A1', side: 'bottom', type: 'analog' },
      { id: 'A2', label: 'A2', side: 'bottom', type: 'analog' }, { id: 'A3', label: 'A3', side: 'bottom', type: 'analog' },
      { id: 'A4', label: 'A4', side: 'bottom', type: 'analog' }, { id: 'A5', label: 'A5', side: 'bottom', type: 'analog' },
      { id: 'A6', label: 'A6', side: 'bottom', type: 'analog' }, { id: 'A7', label: 'A7', side: 'bottom', type: 'analog' },
      { id: '5V', label: '5V', side: 'bottom', type: 'power' }, { id: 'GND', label: 'GND', side: 'bottom', type: 'ground' },
      { id: '3V3', label: '3.3V', side: 'bottom', type: 'power' }, { id: 'VIN', label: 'VIN', side: 'bottom', type: 'power' },
    ],
  },
  esp32: {
    name: 'ESP32', category: 'Boards', w: 180, h: 140, color: '#A78BFA', emoji: '📶',
    pins: [
      { id: 'D2', label: 'GPIO2', side: 'top', type: 'digital' }, { id: 'D4', label: 'GPIO4', side: 'top', type: 'digital' },
      { id: 'D5', label: 'GPIO5', side: 'top', type: 'digital' }, { id: 'D12', label: 'GPIO12', side: 'top', type: 'digital' },
      { id: 'D13', label: 'GPIO13', side: 'top', type: 'digital' }, { id: 'D14', label: 'GPIO14', side: 'top', type: 'digital' },
      { id: 'D15', label: 'GPIO15', side: 'top', type: 'pwm' }, { id: 'D18', label: 'GPIO18', side: 'top', type: 'pwm' },
      { id: 'D19', label: 'GPIO19', side: 'top', type: 'digital' }, { id: 'D21', label: 'GPIO21', side: 'top', type: 'digital' },
      { id: 'D22', label: 'GPIO22', side: 'top', type: 'digital' }, { id: 'D23', label: 'GPIO23', side: 'top', type: 'digital' },
      { id: 'A34', label: 'VP', side: 'bottom', type: 'analog' }, { id: 'A35', label: 'VN', side: 'bottom', type: 'analog' },
      { id: 'A32', label: 'GPIO32', side: 'bottom', type: 'analog' }, { id: 'A33', label: 'GPIO33', side: 'bottom', type: 'analog' },
      { id: 'A36', label: 'GPIO36', side: 'bottom', type: 'analog' }, { id: 'A39', label: 'GPIO39', side: 'bottom', type: 'analog' },
      { id: '3V3', label: '3.3V', side: 'bottom', type: 'power' }, { id: 'GND', label: 'GND', side: 'bottom', type: 'ground' },
      { id: 'GND2', label: 'GND', side: 'bottom', type: 'ground' }, { id: 'VIN', label: 'VIN', side: 'bottom', type: 'power' },
      { id: 'EN', label: 'EN', side: 'bottom', type: 'signal' },
    ],
  },
  breadboard: { name: 'Breadboard', category: 'Boards', w: 240, h: 120, color: '#FDE68A', emoji: '🧰', symmetric: true,
    pins: [
      { id: 'r1', label: '+', side: 'left', type: 'power' }, { id: 'r2', label: '+', side: 'left', type: 'power' },
      { id: 'r3', label: '−', side: 'left', type: 'ground' }, { id: 'r4', label: '−', side: 'left', type: 'ground' },
      { id: 'a1', label: 'a1', side: 'top', type: 'terminal' }, { id: 'a2', label: 'a2', side: 'top', type: 'terminal' },
      { id: 'a3', label: 'a3', side: 'top', type: 'terminal' }, { id: 'a4', label: 'a4', side: 'top', type: 'terminal' },
      { id: 'b1', label: 'b1', side: 'bottom', type: 'terminal' }, { id: 'b2', label: 'b2', side: 'bottom', type: 'terminal' },
      { id: 'b3', label: 'b3', side: 'bottom', type: 'terminal' }, { id: 'b4', label: 'b4', side: 'bottom', type: 'terminal' },
    ],
  },
  led: { name: 'LED', category: 'Outputs', w: 70, h: 96, color: '#F87171', emoji: '💡',
    pins: [ { id: 'cathode', label: 'Cathode (−)', side: 'bottom', type: 'minus' }, { id: 'anode', label: 'Anode (+)', side: 'bottom', type: 'plus' } ] },
  resistor: { name: 'Resistor 220Ω', category: 'Passive', w: 130, h: 44, color: '#D4A373', emoji: '🟫', symmetric: true,
    pins: [ { id: 'a', label: 'Terminal A', side: 'left', type: 'terminal' }, { id: 'b', label: 'Terminal B', side: 'right', type: 'terminal' } ] },
  push_button: { name: 'Push Button', category: 'Inputs', w: 80, h: 80, color: '#FBBF24', emoji: '🔘',
    pins: [ { id: 'a', label: 'Pin A', side: 'left', type: 'terminal' }, { id: 'b', label: 'Pin B', side: 'right', type: 'terminal' } ] },
  buzzer: { name: 'Buzzer', category: 'Outputs', w: 70, h: 92, color: '#FB923C', emoji: '🔊',
    pins: [ { id: 'neg', label: '−', side: 'bottom', type: 'minus' }, { id: 'pos', label: '+', side: 'bottom', type: 'plus' } ] },
  servo: { name: 'Servo Motor', category: 'Outputs', w: 100, h: 76, color: '#60A5FA', emoji: '⚙️',
    pins: [ { id: 'VCC', label: 'VCC', side: 'left', type: 'power' }, { id: 'GND', label: 'GND', side: 'left', type: 'ground' }, { id: 'SIG', label: 'Signal', side: 'left', type: 'pwm' } ] },
  dc_motor: { name: 'DC Motor', category: 'Outputs', w: 120, h: 80, color: '#34D399', emoji: '🌀',
    pins: [ { id: 't1', label: 'Terminal 1', side: 'right', type: 'terminal' }, { id: 't2', label: 'Terminal 2', side: 'right', type: 'terminal' } ] },
  ir_sensor: { name: 'IR Sensor', category: 'Sensors', w: 100, h: 84, color: '#22D3EE', emoji: '👁️',
    pins: [ { id: 'VCC', label: 'VCC', side: 'left', type: 'power' }, { id: 'GND', label: 'GND', side: 'left', type: 'ground' }, { id: 'OUT', label: 'OUT', side: 'right', type: 'digital' } ] },
  ultrasonic: { name: 'Ultrasonic HC-SR04', category: 'Sensors', w: 140, h: 90, color: '#38BDF8', emoji: '📡',
    pins: [ { id: 'VCC', label: 'VCC', side: 'bottom', type: 'power' }, { id: 'TRIG', label: 'TRIG', side: 'bottom', type: 'digital' }, { id: 'ECHO', label: 'ECHO', side: 'bottom', type: 'digital' }, { id: 'GND', label: 'GND', side: 'bottom', type: 'ground' } ] },
  ldr: { name: 'LDR', category: 'Sensors', w: 70, h: 70, color: '#A78BFA', emoji: '🌙',
    pins: [ { id: 'a', label: 'A', side: 'left', type: 'terminal' }, { id: 'b', label: 'B', side: 'right', type: 'terminal' } ] },
  potentiometer: { name: 'Potentiometer', category: 'Inputs', w: 110, h: 90, color: '#F472B6', emoji: '🎚️',
    pins: [ { id: 'VCC', label: 'VCC', side: 'bottom', type: 'power' }, { id: 'WIPER', label: 'Wiper', side: 'bottom', type: 'analog' }, { id: 'GND', label: 'GND', side: 'bottom', type: 'ground' } ] },
  rgb_led: { name: 'RGB LED', category: 'Outputs', w: 130, h: 110, color: '#C084FC', emoji: '🌈',
    pins: [ { id: 'R', label: 'R', side: 'bottom', type: 'pwm' }, { id: 'GND', label: 'GND', side: 'bottom', type: 'ground' },
            { id: 'G', label: 'G', side: 'bottom', type: 'pwm' }, { id: 'B', label: 'B', side: 'bottom', type: 'pwm' } ] },
  gear_motor: { name: 'Gear Motor (TT)', category: 'Outputs', w: 100, h: 130, color: '#FACC15', emoji: '🚗',
    pins: [ { id: 't1', label: 'Terminal 1', side: 'bottom', type: 'terminal' }, { id: 't2', label: 'Terminal 2', side: 'bottom', type: 'terminal' } ] },
  vibration_motor: { name: 'Vibration Motor', category: 'Outputs', w: 70, h: 100, color: '#94A3B8', emoji: '📳',
    pins: [ { id: 't1', label: 'Terminal 1', side: 'bottom', type: 'terminal' }, { id: 't2', label: 'Terminal 2', side: 'bottom', type: 'terminal' } ] },
  aa_battery: { name: 'AA Battery 1.5V', category: 'Power', w: 84, h: 130, color: '#2DD4BF', emoji: '🔋',
    pins: [ { id: 'N', label: '−', side: 'top', type: 'minus' }, { id: 'P', label: '+', side: 'top', type: 'plus' } ] },
  lcd: { name: 'LCD 16x2 (I2C)', category: 'Display', w: 170, h: 90, color: '#94A3B8', emoji: '📟',
    pins: [ { id: 'VCC', label: 'VCC', side: 'left', type: 'power' }, { id: 'GND', label: 'GND', side: 'left', type: 'ground' }, { id: 'SDA', label: 'SDA', side: 'right', type: 'data' }, { id: 'SCL', label: 'SCL', side: 'right', type: 'data' } ] },
  oled: { name: 'OLED 0.96"', category: 'Display', w: 130, h: 80, color: '#94A3B8', emoji: '🔲',
    pins: [ { id: 'VCC', label: 'VCC', side: 'left', type: 'power' }, { id: 'GND', label: 'GND', side: 'left', type: 'ground' }, { id: 'SDA', label: 'SDA', side: 'right', type: 'data' }, { id: 'SCL', label: 'SCL', side: 'right', type: 'data' } ] },
  motor_driver: { name: 'L298N Driver', category: 'Drivers', w: 150, h: 110, color: '#F59E0B', emoji: '🧩',
    pins: [ { id: 'IN1', label: 'IN1', side: 'right', type: 'digital' }, { id: 'IN2', label: 'IN2', side: 'right', type: 'digital' }, { id: 'IN3', label: 'IN3', side: 'right', type: 'digital' }, { id: 'IN4', label: 'IN4', side: 'right', type: 'digital' },
      { id: 'ENA', label: 'ENA~', side: 'right', type: 'pwm' }, { id: 'ENB', label: 'ENB~', side: 'right', type: 'pwm' },
      { id: 'OUT1', label: 'OUT1', side: 'left', type: 'terminal' }, { id: 'OUT2', label: 'OUT2', side: 'left', type: 'terminal' }, { id: 'OUT3', label: 'OUT3', side: 'left', type: 'terminal' }, { id: 'OUT4', label: 'OUT4', side: 'left', type: 'terminal' },
      { id: '12V', label: '12V', side: 'left', type: 'power' }, { id: 'GND', label: 'GND', side: 'left', type: 'ground' }, { id: '5V', label: '5V', side: 'left', type: 'power' } ] },
  mpu6050: { name: 'MPU6050 (IMU)', category: 'Sensors', w: 100, h: 80, color: '#22D3EE', emoji: '🧭',
    pins: [ { id: 'VCC', label: 'VCC', side: 'left', type: 'power' }, { id: 'GND', label: 'GND', side: 'left', type: 'ground' }, { id: 'SDA', label: 'SDA', side: 'right', type: 'data' }, { id: 'SCL', label: 'SCL', side: 'right', type: 'data' } ] },
  battery: { name: '9V Battery', category: 'Power', w: 90, h: 100, color: '#F87171', emoji: '🔋',
    pins: [ { id: 'N', label: '−', side: 'top', type: 'minus' }, { id: 'P', label: '+', side: 'top', type: 'plus' } ] },
  power_supply: { name: 'Power Supply', category: 'Power', w: 100, h: 90, color: '#F87171', emoji: '⚡',
    pins: [ { id: 'V', label: 'V+', side: 'top', type: 'plus' }, { id: 'G', label: 'GND', side: 'bottom', type: 'ground' } ] },
};

export const PALETTE_CATEGORIES = [
  { name: 'Boards', items: ['arduino_uno', 'arduino_nano', 'esp32', 'breadboard'] },
  { name: 'Outputs', items: ['led', 'rgb_led', 'buzzer', 'servo', 'dc_motor', 'gear_motor', 'vibration_motor'] },
  { name: 'Inputs', items: ['push_button', 'potentiometer', 'ldr'] },
  { name: 'Sensors', items: ['ir_sensor', 'ultrasonic', 'mpu6050'] },
  { name: 'Display', items: ['lcd', 'oled'] },
  { name: 'Drivers', items: ['motor_driver'] },
  { name: 'Passive', items: ['resistor'] },
  { name: 'Power', items: ['battery', 'aa_battery', 'power_supply'] },
];

// Parts that look different but behave exactly like another part. The
// simulation and the wiring checks see the behaviour name; the canvas keeps
// showing the part the student picked. Pin ids match their twin on purpose.
export const SIM_ALIAS = { gear_motor: 'dc_motor', vibration_motor: 'dc_motor', aa_battery: 'battery' };
export const simType = (type) => SIM_ALIAS[type] || type;
/** Same components, with look-alike parts renamed to the part they behave like. */
export const forSim = (components) => (components || []).map(c => (SIM_ALIAS[c.type] ? { ...c, type: SIM_ALIAS[c.type] } : c));

const BOARD_TYPES = new Set(['arduino_uno', 'arduino_nano', 'esp32']);

// Pins on a real board sit 2.54mm apart, which at any readable zoom is a few
// pixels — unusable with a finger. Each part is grown until its busiest edge
// gives every pin this much room. The artwork scales with it, so the part
// still looks like itself.
const MIN_PIN_PITCH = 26;
for (const def of Object.values(LAB_COMPONENTS)) {
  const count = { left: 0, right: 0, top: 0, bottom: 0 };
  def.pins.forEach(p => { count[p.side] = (count[p.side] || 0) + 1; });
  const down = Math.max(count.left, count.right);
  const across = Math.max(count.top, count.bottom);
  if (down > 1) def.h = Math.max(def.h, MIN_PIN_PITCH * (down + 1));
  if (across > 1) def.w = Math.max(def.w, MIN_PIN_PITCH * (across + 1));
}

export function isBoard(type) { return BOARD_TYPES.has(type); }

// Compute a pin's local (pre-rotation) position relative to the component origin.
export function pinLocalPos(def, pinId) {
  const pin = def.pins.find(p => p.id === pinId);
  if (!pin) return null;
  const arr = def.pins.filter(p => p.side === pin.side);
  const idx = arr.findIndex(p => p.id === pinId);
  const n = arr.length;
  if (pin.side === 'left') return { x: 0, y: n === 1 ? def.h / 2 : (def.h * (idx + 1)) / (n + 1) };
  if (pin.side === 'right') return { x: def.w, y: n === 1 ? def.h / 2 : (def.h * (idx + 1)) / (n + 1) };
  if (pin.side === 'top') return { x: n === 1 ? def.w / 2 : (def.w * (idx + 1)) / (n + 1), y: 0 };
  return { x: n === 1 ? def.w / 2 : (def.w * (idx + 1)) / (n + 1), y: def.h };
}

export function rotatePoint(px, py, cx, cy, deg) {
  const r = (deg * Math.PI) / 180;
  const dx = px - cx, dy = py - cy;
  return { x: cx + dx * Math.cos(r) - dy * Math.sin(r), y: cy + dx * Math.sin(r) + dy * Math.cos(r) };
}

// World position of a pin on a placed component (accounting for rotation).
export function pinWorldPos(comp, def, pinId) {
  const local = pinLocalPos(def, pinId);
  if (!local) return null;
  const r = rotatePoint(local.x, local.y, def.w / 2, def.h / 2, comp.rot || 0);
  return { x: comp.x + r.x, y: comp.y + r.y };
}

export function getDef(type) { return LAB_COMPONENTS[type]; }