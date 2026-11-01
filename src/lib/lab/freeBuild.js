// Free-build (no fixed experiment) helpers: validation, code generation,
// generic simulation, wiring assignment, and step-by-step guidance.
// All local & deterministic — zero AI credits.
import { getDef, isBoard } from './labComponents';
import { traceToBoard } from './validateLab';

// ── Board detection ──
export function detectBoard(components) {
  return components.find(c => isBoard(c.type)) || null;
}

// ── Resolve each non-board component's pins to board pins (for code + sim) ──
export function resolveFreePins(components, wires) {
  const types = {};
  components.forEach(c => { types[c.id] = c.type; });
  const pins = {};
  components.forEach(c => {
    if (isBoard(c.type)) return;
    const def = getDef(c.type);
    if (!def) return;
    const map = {};
    def.pins.forEach(p => {
      const bp = traceToBoard(wires, types, c.id, p.id);
      if (bp) map[p.id] = bp;
    });
    pins[c.id] = { type: c.type, map };
  });
  return pins;
}

// ── Board-pin usage (for conflict detection) ──
function boardPinUsage(components, wires) {
  const types = {};
  components.forEach(c => { types[c.id] = c.type; });
  const usage = {};
  wires.forEach(w => {
    [w.from, w.to].forEach((end, i) => {
      const other = i === 0 ? w.to : w.from;
      if (isBoard(types[end.compId]) && !isBoard(types[other.compId])) {
        const bpin = getDef(types[end.compId])?.pins.find(p => p.id === end.pinId);
        if (bpin && (bpin.type === 'power' || bpin.type === 'ground')) return; // shared rails are fine
        const key = `${end.compId}:${end.pinId}`;
        (usage[key] = usage[key] || []).push({ compId: other.compId, pinId: other.pinId, compType: types[other.compId] });
      }
    });
  });
  return usage;
}

// ── Validate a free build for sanity (not a required circuit) ──
// Returns { status: 'incomplete'|'valid'|'error', issues:[{type,msg}], conflicts:[] }
export function validateFreeBuild(components, wires) {
  const issues = [];
  const conflicts = [];
  const types = {};
  components.forEach(c => { types[c.id] = c.type; });

  const board = detectBoard(components);
  if (components.length === 0) {
    return { status: 'incomplete', issues: [{ type: 'info', msg: 'Empty workspace — add components to start building.' }], conflicts: [] };
  }
  if (!board) issues.push({ type: 'error', msg: 'Add a board (Arduino / ESP32) to control your circuit.' });

  // Shorts: power ↔ ground
  wires.forEach(w => {
    const fa = types[w.from.compId], ta = types[w.to.compId];
    const ap = getDef(fa)?.pins.find(p => p.id === w.from.pinId);
    const bp = getDef(ta)?.pins.find(p => p.id === w.to.pinId);
    if (!ap || !bp) return;
    if ((ap.type === 'power' && bp.type === 'ground') || (ap.type === 'ground' && bp.type === 'power')) {
      issues.push({ type: 'error', msg: `Short circuit: ${getDef(fa)?.name} ${ap.label} → ${getDef(ta)?.name} ${bp.label}. Never connect power to ground.` });
    }
  });

  // Conflicts: a board pin wired to >1 component pin
  const usage = boardPinUsage(components, wires);
  Object.entries(usage).forEach(([key, list]) => {
    if (list.length > 1) {
      const [boardCompId, boardPinId] = key.split(':');
      const bname = getDef(types[boardCompId])?.name || 'Board';
      const others = list.map(l => `${getDef(l.compType)?.name || l.compType} ${l.pinId}`).join(', ');
      conflicts.push({ boardPin: boardPinId, boardName: bname, used: others });
      issues.push({ type: 'error', msg: `${bname} pin ${boardPinId} is connected to multiple components (${others}). Use different pins.` });
    }
  });

  // Unpowered components
  components.forEach(c => {
    if (isBoard(c.type)) return;
    const def = getDef(c.type);
    if (!def) return;
    const hasPower = def.pins.some(p => p.type === 'power');
    const hasGnd = def.pins.some(p => p.type === 'ground');
    if (!hasPower && !hasGnd) return;
    const wiredPins = new Set();
    wires.forEach(w => {
      if (w.from.compId === c.id) wiredPins.add(w.from.pinId);
      if (w.to.compId === c.id) wiredPins.add(w.to.pinId);
    });
    const vcc = def.pins.find(p => p.type === 'power');
    const gnd = def.pins.find(p => p.type === 'ground');
    if (vcc && !wiredPins.has(vcc.id)) issues.push({ type: 'warn', msg: `${def.name} VCC is not connected to power.` });
    if (gnd && !wiredPins.has(gnd.id)) issues.push({ type: 'warn', msg: `${def.name} GND is not connected to ground.` });
  });

  // Nothing wired yet → the circuit is not finished, whatever else is fine.
  const nonBoard = components.filter(c => !isBoard(c.type));
  const wiredComps = new Set();
  wires.forEach(w => { wiredComps.add(w.from.compId); wiredComps.add(w.to.compId); });
  const unwired = nonBoard.filter(c => !wiredComps.has(c.id));
  if (nonBoard.length === 0) issues.push({ type: 'warn', msg: 'Add a part (LED, sensor, motor…) and wire it to the board.' });
  else if (wires.length === 0) issues.push({ type: 'warn', msg: 'No wires yet — tap two pins to connect them.' });
  else if (unwired.length) issues.push({ type: 'warn', msg: `Not connected: ${unwired.map(c => getDef(c.type)?.name || c.type).join(', ')}.` });

  const hasError = issues.some(i => i.type === 'error');
  const status = hasError ? 'error' : (issues.some(i => i.type === 'warn') ? 'incomplete' : 'valid');
  return { status, issues, conflicts };
}

// Per-wire status for canvas colouring (free build).
export function freeWireStatuses(components, wires) {
  const types = {};
  components.forEach(c => { types[c.id] = c.type; });
  const usage = boardPinUsage(components, wires);
  const conflictWireIds = new Set();
  Object.entries(usage).forEach(([key, list]) => {
    if (list.length > 1) {
      const [boardCompId, boardPinId] = key.split(':');
      wires.forEach(w => {
        [w.from, w.to].forEach(e => { if (e.compId === boardCompId && e.pinId === boardPinId) conflictWireIds.add(w.id); });
      });
    }
  });
  return wires.map(w => {
    const fa = types[w.from.compId], ta = types[w.to.compId];
    const ap = getDef(fa)?.pins.find(p => p.id === w.from.pinId);
    const bp = getDef(ta)?.pins.find(p => p.id === w.to.pinId);
    if (ap && bp && ((ap.type === 'power' && bp.type === 'ground') || (ap.type === 'ground' && bp.type === 'power'))) return 'incorrect';
    if (conflictWireIds.has(w.id)) return 'incorrect';
    return 'correct';
  });
}

// Suggest alternative free board pins for a conflicting one.
export function suggestFreePins(board, usedPinIds) {
  const def = getDef(board.type);
  if (!def) return [];
  const used = new Set(usedPinIds);
  return def.pins.filter(p => (p.type === 'digital' || p.type === 'pwm' || p.type === 'analog') && !used.has(p.id)).slice(0, 4).map(p => p.id);
}

// ── Generic free-build simulation ──
export function createFreeSimState() {
  return { t: 0, lastSerial: 0, ledOn: false, servoAngle: 90, motorAngle: 0, irDetected: false, distance: 30, buzzerOn: false, prevButton: false };
}

export function stepFreeSim(components, pins, state, inputs, dt) {
  const s = { ...state };
  s.t += dt;
  let serial = null;
  const cm = Math.max(0, Math.round(inputs.objectCm ?? 30));
  const has = t => components.some(c => c.type === t);

  if (has('led')) {
    s.ledOn = Math.floor(s.t / 500) % 2 === 0;
    if (s.t - s.lastSerial >= 500) { serial = `LED: ${s.ledOn ? 'ON' : 'OFF'}`; s.lastSerial = s.t; }
  }
  if (has('servo')) {
    s.servoAngle = 90 + 90 * Math.sin(s.t / 700);
    if (!serial && s.t - s.lastSerial >= 400) { serial = `Servo: ${Math.round(s.servoAngle)}°`; s.lastSerial = s.t; }
  }
  if (has('ultrasonic')) {
    s.distance = cm;
    if (!serial && s.t - s.lastSerial >= 200) { serial = `Distance: ${cm} cm`; s.lastSerial = s.t; }
  }
  if (has('ir_sensor')) {
    s.irDetected = cm < 5;
    if (!serial && s.t - s.lastSerial >= 200) { serial = s.irDetected ? `IR: Object detected (${cm}cm)` : `IR: Clear (${cm}cm)`; s.lastSerial = s.t; }
  }
  if (has('push_button')) s.ledOn = !!inputs.buttonPressed;
  if (has('dc_motor')) s.motorAngle = (s.motorAngle + (dt / 1000) * 360 * (inputs.motorSpeed ?? 0) / 255) % 360;
  return { state: s, serial };
}

export function freeSimInputs(components) {
  const has = t => components.some(c => c.type === t);
  const inputs = {};
  if (has('push_button')) inputs.button = true;
  if (has('ultrasonic') || has('ir_sensor')) inputs.object = true;
  if (has('dc_motor')) inputs.motor = true;
  if (has('potentiometer') || has('ldr')) inputs.knob = true;
  return inputs;
}

// ── Local code generation from actual wiring (deterministic) ──
function pinCode(pinId) {
  if (!pinId) return '0';
  if (pinId.startsWith('D')) return pinId.slice(1);
  if (pinId.startsWith('A')) return pinId;
  return pinId;
}

export function generateFreeCode(components, wires) {
  const board = detectBoard(components);
  if (!board) return '// Add a board (Arduino / ESP32) to generate code.';
  const pins = resolveFreePins(components, wires);
  const boardDef = getDef(board.type);
  const includes = [];
  const setup = [];
  const loop = [];
  const defs = [];
  const seen = new Set();

  let hasServo = false, hasUltrasonic = false;

  components.forEach(c => {
    if (isBoard(c.type) || seen.has(c.type)) return;
    seen.add(c.type);
    const pm = pins[c.id]?.map || {};
    switch (c.type) {
      case 'led': {
        const p = pm['anode'] || '13';
        defs.push(`#define LED_PIN ${pinCode(p)}`);
        setup.push('  pinMode(LED_PIN, OUTPUT);');
        loop.push('  digitalWrite(LED_PIN, (millis() / 500) % 2 ? HIGH : LOW);');
        break;
      }
      case 'rgb_led': {
        const r = pm['R'] || '9', g = pm['G'] || '10', b = pm['B'] || '11';
        defs.push(`#define RED_PIN ${pinCode(r)}`);
        defs.push(`#define GREEN_PIN ${pinCode(g)}`);
        defs.push(`#define BLUE_PIN ${pinCode(b)}`);
        setup.push('  pinMode(RED_PIN, OUTPUT); pinMode(GREEN_PIN, OUTPUT); pinMode(BLUE_PIN, OUTPUT);');
        loop.push('  int phase = (millis() / 1000) % 3;');
        loop.push('  analogWrite(RED_PIN, phase == 0 ? 255 : 0);');
        loop.push('  analogWrite(GREEN_PIN, phase == 1 ? 255 : 0);');
        loop.push('  analogWrite(BLUE_PIN, phase == 2 ? 255 : 0);');
        break;
      }
      case 'push_button': {
        const p = pm['a'] || '2';
        defs.push(`#define BUTTON_PIN ${pinCode(p)}`);
        setup.push('  pinMode(BUTTON_PIN, INPUT_PULLUP);');
        loop.push('  if (digitalRead(BUTTON_PIN) == LOW) Serial.println("Button: pressed");');
        break;
      }
      case 'buzzer': {
        const p = pm['pos'] || '8';
        defs.push(`#define BUZZER_PIN ${pinCode(p)}`);
        setup.push('  pinMode(BUZZER_PIN, OUTPUT);');
        loop.push('  digitalWrite(BUZZER_PIN, (millis() / 1000) % 2 ? HIGH : LOW);');
        break;
      }
      case 'servo': {
        hasServo = true;
        const p = pm['SIG'] || '9';
        defs.push(`#define SERVO_PIN ${pinCode(p)}`);
        includes.push('#include <Servo.h>');
        setup.push('  myservo.attach(SERVO_PIN);');
        loop.push('  for (int a = 0; a <= 180; a += 5) { myservo.write(a); delay(15); }');
        loop.push('  for (int a = 180; a >= 0; a -= 5) { myservo.write(a); delay(15); }');
        break;
      }
      case 'ultrasonic': {
        hasUltrasonic = true;
        const tr = pm['TRIG'] || '9', ec = pm['ECHO'] || '10';
        defs.push(`#define TRIG_PIN ${pinCode(tr)}`);
        defs.push(`#define ECHO_PIN ${pinCode(ec)}`);
        setup.push('  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);');
        loop.push('  long cm = readDistance();');
        loop.push('  Serial.print("Distance: "); Serial.print(cm); Serial.println(" cm");');
        break;
      }
      case 'ir_sensor': {
        const p = pm['OUT'] || '2';
        defs.push(`#define IR_PIN ${pinCode(p)}`);
        setup.push('  pinMode(IR_PIN, INPUT);');
        loop.push('  if (digitalRead(IR_PIN) == LOW) Serial.println("IR: Object detected");');
        loop.push('  else Serial.println("IR: Clear");');
        break;
      }
      case 'potentiometer': case 'ldr': {
        const p = pm['WIPER'] || pm['b'] || 'A0';
        defs.push(`#define ANALOG_PIN ${pinCode(p)}`);
        loop.push('  int val = analogRead(ANALOG_PIN);');
        loop.push('  Serial.print("Sensor: "); Serial.println(val);');
        break;
      }
      case 'motor_driver': {
        const in1 = pm['IN1'] || '5', in2 = pm['IN2'] || '6', ena = pm['ENA'] || '10';
        defs.push(`#define IN1 ${pinCode(in1)}`);
        defs.push(`#define IN2 ${pinCode(in2)}`);
        defs.push(`#define ENA ${pinCode(ena)}`);
        setup.push('  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT); pinMode(ENA, OUTPUT);');
        loop.push('  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); analogWrite(ENA, 200);');
        break;
      }
      default: break;
    }
  });

  const names = components.filter(c => !isBoard(c.type)).map(c => getDef(c.type)?.name).filter(Boolean);
  return `// ${boardDef.name} — RoboCraft Free Build
// Generated from your wiring. Components: ${names.join(', ') || 'none'}
${includes.join('\n')}
${hasServo ? 'Servo myservo;' : ''}
${defs.join('\n')}

${hasUltrasonic ? `long readDistance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  return pulseIn(ECHO_PIN, HIGH) * 0.034 / 2;
}` : ''}
void setup() {
  Serial.begin(9600);
${setup.join('\n')}
}

void loop() {
${loop.join('\n')}
  delay(100);
}`;
}

// ── Wiring assignment (deterministic pin allocation from a component list) ──
function compatible(pinType, needType) {
  if (needType === 'power') return pinType === 'power';
  if (needType === 'ground') return pinType === 'ground';
  if (needType === 'analog') return pinType === 'analog';
  if (needType === 'data') return pinType === 'data';
  // digital / pwm / terminal / signal / plus / minus → digital or pwm
  return pinType === 'digital' || pinType === 'pwm';
}

export function assignWiring(componentTypes, boardType) {
  const boardDef = getDef(boardType);
  if (!boardDef) return [];
  const isEsp = boardType === 'esp32';
  const used = new Set();
  const guide = [];
  const take = (pinId) => { used.add(pinId); return pinId; };
  const freePin = (need) => boardDef.pins.find(p => compatible(p.type, need) && !used.has(p.id));

  const powerPinId = isEsp ? '3V3' : '5V';
  componentTypes.forEach(t => {
    const def = getDef(t);
    if (!def || isBoard(t)) return;
    def.pins.forEach(pin => {
      if (pin.type === 'power') {
        const bp = boardDef.pins.find(p => p.id === powerPinId && !used.has(p.id)) || freePin('power');
        if (bp) guide.push({ compType: t, compPin: pin.id, boardPin: take(bp.id) });
      } else if (pin.type === 'ground') {
        const bp = boardDef.pins.find(p => p.type === 'ground' && !used.has(p.id));
        if (bp) guide.push({ compType: t, compPin: pin.id, boardPin: take(bp.id) });
      } else {
        const bp = freePin(pin.type);
        if (bp) guide.push({ compType: t, compPin: pin.id, boardPin: take(bp.id) });
      }
    });
  });
  return guide;
}

// ── Next unwired guide step (for "Help Me Build It") ──
export function nextWiringStep(guide, components, wires) {
  if (!guide || !guide.length) return null;
  const types = {};
  components.forEach(c => { types[c.id] = c.type; });
  for (const g of guide) {
    const comp = components.find(c => c.type === g.compType);
    if (!comp) return g; // not placed yet
    const satisfied = wires.some(w => {
      const ends = [w.from, w.to];
      const toBoard = ends.find(e => isBoard(types[e.compId]) && e.pinId === g.boardPin);
      const toComp = ends.find(e => e.compId === comp.id && e.pinId === g.compPin);
      return toBoard && toComp;
    });
    if (!satisfied) return g;
  }
  return null;
}