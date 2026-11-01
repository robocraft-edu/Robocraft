// Circuit-lab board: runs the student's own Arduino sketch against the circuit
// they wired on the canvas. Each component reacts to the pins it is wired to.
import { SimBoard } from '@/lib/arduino/runtime';

/** Board pin id ('D13', 'A0', 'A34') → Arduino pin number. */
export function pinNumber(id) {
  if (!id) return null;
  let m = id.match(/^D(\d+)$/); if (m) return Number(m[1]);
  m = id.match(/^A(\d)$/); if (m) return 14 + Number(m[1]); // Uno/Nano A0–A7
  m = id.match(/^A(\d\d)$/); if (m) return Number(m[1]);    // ESP32 GPIO32–39
  return null;
}

export class CircuitBoard extends SimBoard {
  /**
   * @param {Array} components   canvas components
   * @param {Object} pinMap      resolveFreePins() result: { compId: { type, map: { pinId: boardPinId } } }
   * @param {() => Object} getInputs  live inputs { buttonPressed, objectCm, knob }
   */
  constructor(components, pinMap, getInputs) {
    super();
    this.components = components;
    this.getInputs = getInputs;
    this.parts = components.filter(c => pinMap[c.id]).map(c => {
      const map = {};
      for (const [k, v] of Object.entries(pinMap[c.id].map)) map[k] = pinNumber(v);
      return { id: c.id, type: c.type, map };
    });
    this.rot = {};
  }
  partsOn(pin, type) { return this.parts.filter(p => (!type || p.type === type) && Object.values(p.map).includes(pin)); }
  readDigital(pin) {
    const inp = this.getInputs();
    for (const p of this.partsOn(pin)) {
      if (p.type === 'push_button') {
        // INPUT_PULLUP: idle HIGH, pressed LOW. Plain INPUT (pull-down wiring): pressed HIGH.
        return this.mode[pin] === 2 ? (inp.buttonPressed ? 0 : 1) : (inp.buttonPressed ? 1 : 0);
      }
      if (p.type === 'ir_sensor' && p.map.OUT === pin) return (inp.objectCm ?? 30) < 5 ? 0 : 1; // active LOW module
      if (p.type === 'ultrasonic' && p.map.ECHO === pin) return 0;
    }
    return undefined;
  }
  readAnalog(pin) {
    const inp = this.getInputs();
    for (const p of this.partsOn(pin)) {
      if (p.type === 'potentiometer') return (inp.knob ?? 50) / 100 * 1023;
      if (p.type === 'ldr') return (inp.knob ?? 50) / 100 * 1023;
      if (p.type === 'ir_sensor') return (inp.objectCm ?? 30) < 5 ? 80 : 950;
    }
    return 0;
  }
  echoMicros(pin) {
    const us = this.parts.find(p => p.type === 'ultrasonic' && p.map.ECHO === pin);
    if (!us) return 0;
    const trig = us.map.TRIG;
    if (trig == null || this.lastTrigger[trig] === undefined || this.t - this.lastTrigger[trig] > 50) return 0;
    delete this.lastTrigger[trig];
    const cm = Math.max(2, this.getInputs().objectCm ?? 30);
    return cm > 400 ? 0 : (2 * cm) / 0.034 + 30; // +30 µs so integer maths lands on the right cm
  }
  motorLevel(part, index) {
    const direct = Object.values(part.map).filter(v => v != null);
    if (direct.length) return Math.max(...direct.map(v => this.level(v)));
    const drv = this.parts.find(p => p.type === 'motor_driver');
    if (!drv) return 0;
    const [a, b, en] = index % 2 === 0 ? ['IN1', 'IN2', 'ENA'] : ['IN3', 'IN4', 'ENB'];
    const da = drv.map[a] != null ? this.out[drv.map[a]] || 0 : 0;
    const db = drv.map[b] != null ? this.out[drv.map[b]] || 0 : 0;
    const dir = da && !db ? 1 : !da && db ? -1 : 0;
    const lvl = drv.map[en] != null ? this.level(drv.map[en]) : 255;
    return dir * lvl;
  }
  step(dtMs) {
    let mi = 0;
    for (const p of this.parts) {
      if (p.type === 'dc_motor') {
        const lvl = this.motorLevel(p, mi++);
        this.rot[p.id] = ((this.rot[p.id] || 0) + (dtMs / 1000) * 720 * lvl / 255) % 360;
      }
    }
  }
  /** Visual state for the canvas: global fields + per-component `comp` map. */
  snapshot() {
    const inp = this.getInputs();
    const cm = Math.round(inp.objectCm ?? 30);
    const comp = {};
    const s = { ledOn: false, buzzerOn: false, servoAngle: 90, motorAngle: 0, irDetected: cm < 5, distance: cm, comp };
    for (const p of this.parts) {
      if (p.type === 'led') { const v = p.map.anode != null ? this.level(p.map.anode) : 0; comp[p.id] = { ledOn: v > 0, brightness: v / 255 }; s.ledOn ||= v > 0; }
      else if (p.type === 'rgb_led') { const lv = (k) => (p.map[k] != null ? this.level(p.map[k]) : 0); comp[p.id] = { rgb: [lv('R'), lv('G'), lv('B')] }; }
      else if (p.type === 'buzzer') { const on = (p.map.pos != null && (this.out[p.map.pos] || this.tones[p.map.pos] > 0)) || false; comp[p.id] = { buzzerOn: !!on }; s.buzzerOn ||= !!on; }
      else if (p.type === 'servo') { const a = p.map.SIG != null ? (this.servo[p.map.SIG] ?? 90) : 90; comp[p.id] = { servoAngle: a }; s.servoAngle = a; }
      else if (p.type === 'dc_motor') comp[p.id] = { motorAngle: this.rot[p.id] || 0 };
      else if (p.type === 'ir_sensor') comp[p.id] = { irDetected: cm < 5 };
      else if (p.type === 'ultrasonic') comp[p.id] = { distance: cm };
    }
    return s;
  }
}
