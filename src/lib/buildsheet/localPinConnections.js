// Deterministic, AI-free generator that derives pin connections from a project's
// own Arduino code + step instructions + component list. This produces the structured
// wiring data used by CircuitDiagram, the pin table, the build sheet and the PDF —
// so every section stays consistent and consumes ZERO integration credits.

import { sanitizeCode } from './sanitizeCode';
import { formatClass } from '@/lib/utils';
import { getPinMap } from '@/lib/circuit/pinMaps';

const WIRE_COLOR_HEX = {
  red: '#DC2626', black: '#171717', blue: '#2563EB',
  green: '#16A34A', orange: '#EA580C', yellow: '#CA8A04',
  purple: '#A78BFA',
};

// ── Component type detection from a name string ───────────────────────────────
export function detectComponentType(name) {
  const n = (name || '').toLowerCase();
  if (/arduino.*nano|\bnano\b/.test(n)) return 'arduino_nano';
  if (/arduino.*uno|\buno\b|arduino\b/.test(n)) return 'arduino_uno';
  if (/esp32/.test(n)) return 'esp32';
  if (/esp8266|nodemcu/.test(n)) return 'esp8266';
  if (/breadboard/.test(n)) return 'breadboard';
  if (/rgb/.test(n)) return 'rgb_led';
  if (/led|light.emitting|light\s*emitter/.test(n) && !/ultrasonic|sensor/.test(n)) return 'led';
  if (/resistor/.test(n)) return 'resistor';
  if (/push\s*button|\bbutton\b|\bswitch\b|tact/.test(n)) return 'push_button';
  if (/buzzer|piezo|speaker/.test(n)) return 'buzzer';
  if (/servo/.test(n)) return 'servo';
  if (/a4988|drv8825|stepper\s*driver/.test(n)) return 'a4988';
  if (/nema\s*-?17/.test(n)) return 'nema17';
  if (/stepper/.test(n)) return 'stepper';
  if (/motor\s*driver|l298|l293|driver/.test(n)) return 'motor_driver';
  if (/vibration|vibrator/.test(n)) return 'vibration_motor';
  if (/gear\s*motor|\btt\b|geared/.test(n)) return 'gear_motor';
  if (/dc\s*motor|\bmotor\b/.test(n)) return 'dc_motor';
  if (/ultrasonic|hc-sr04|distance\s*sensor/.test(n)) return 'ultrasonic';
  if (/\bir\s*sensor|\binfrared\b|\bir\b/.test(n)) return 'ir_sensor';
  if (/ldr|light\s*dependent|photo(resistor|cell)/.test(n)) return 'ldr';
  if (/temp|dht|thermometer|lm35|thermistor/.test(n)) return 'temp_sensor';
  if (/gas|mq-?2|smoke|alcohol/.test(n)) return 'gas_sensor';
  if (/lcd|16x2|20x4/.test(n)) return 'lcd';
  if (/oled|ssd1306/.test(n)) return 'oled';
  if (/relay/.test(n)) return 'relay';
  if (/bluetooth|hc-?05|hc-?06|ble/.test(n)) return 'bluetooth';
  if (/joystick/.test(n)) return 'joystick';
  if (/mpu\s*-?6050|gy-?521|\bimu\b|gyro(scope)?|accelerometer/.test(n)) return 'mpu6050';
  if (/aa\s*batter|aa\s*cell|aa\s*holder/.test(n)) return 'aa_battery';
  if (/battery|9v|cell/.test(n)) return 'battery';
  if (/power\s*supply|adapter|charger/.test(n)) return 'power_supply';
  if (/rfid|nfc/.test(n)) return 'rfid';
  if (/pir|motion\s*sensor/.test(n)) return 'pir';
  if (/soil\s*moisture/.test(n)) return 'soil';
  if (/water\s*level|water\s*sensor/.test(n)) return 'water';
  return null;
}

// ── Component pin label by role (power/ground/digital/pwm/analog/signal) ──────
const COMPONENT_PIN_LABEL = {
  led: { power: 'Anode', digital: 'Anode', pwm: 'Anode', ground: 'Cathode', signal: 'Anode' },
  rgb_led: { power: 'VCC', ground: 'GND', digital: 'R Pin', pwm: 'G Pin', analog: 'B Pin', signal: 'Pin' },
  resistor: { power: 'Terminal 1', digital: 'Terminal 1', ground: 'Terminal 2', signal: 'Terminal 1' },
  push_button: { power: 'Pin A', ground: 'Pin B', digital: 'Pin A', signal: 'Pin A' },
  buzzer: { power: 'VCC (+)', ground: 'GND (-)', digital: 'Signal', pwm: 'Signal', signal: 'Signal' },
  servo: { power: 'VCC (Red)', ground: 'GND (Brown)', digital: 'Signal (Orange)', pwm: 'Signal (Orange)', signal: 'Signal (Orange)' },
  dc_motor: { power: 'Terminal 1', ground: 'Terminal 2', digital: 'Terminal 1', signal: 'Terminal 1' },
  stepper: { power: 'VCC', ground: 'GND', digital: 'IN1', signal: 'IN1' },
  motor_driver: { power: 'VCC', ground: 'GND', digital: 'IN1', pwm: 'ENA', analog: 'IN2', signal: 'IN1' },
  ultrasonic: { power: 'VCC', ground: 'GND', digital: 'TRIG', pwm: 'TRIG', signal: 'ECHO' },
  ir_sensor: { power: 'VCC', ground: 'GND', digital: 'OUT', analog: 'OUT', signal: 'OUT' },
  ldr: { power: 'Terminal 1', ground: 'GND', analog: 'Signal', signal: 'Signal' },
  temp_sensor: { power: 'VCC', ground: 'GND', digital: 'OUT', analog: 'OUT', signal: 'DATA' },
  gas_sensor: { power: 'VCC', ground: 'GND', analog: 'AOUT', digital: 'DOUT', signal: 'AOUT' },
  lcd: { power: 'VCC', ground: 'GND', digital: 'RS', analog: 'SDA', signal: 'E' },
  oled: { power: 'VCC', ground: 'GND', digital: 'SCL', analog: 'SDA', signal: 'SDA' },
  relay: { power: 'VCC', ground: 'GND', digital: 'IN', pwm: 'IN', signal: 'IN' },
  bluetooth: { power: 'VCC', ground: 'GND', digital: 'TX', analog: 'RX', signal: 'TX' },
  joystick: { power: 'VCC', ground: 'GND', digital: 'SW', analog: 'VRx', signal: 'VRx' },
  pir: { power: 'VCC', ground: 'GND', digital: 'OUT', signal: 'OUT' },
  rfid: { power: '3.3V', ground: 'GND', digital: 'SDA', signal: 'SDA' },
  soil: { power: 'VCC', ground: 'GND', analog: 'AOUT', signal: 'AOUT' },
  water: { power: 'VCC', ground: 'GND', analog: 'AOUT', signal: 'AOUT' },
  battery: { power: '+', ground: '-' },
  power_supply: { power: 'V+', ground: 'V-' },
};

// Components that always need a VCC power connection
const NEEDS_POWER = new Set(['servo', 'ultrasonic', 'ir_sensor', 'temp_sensor', 'gas_sensor', 'lcd', 'oled', 'relay', 'bluetooth', 'joystick', 'pir', 'rfid', 'soil', 'water', 'motor_driver', 'stepper', 'dc_motor', 'buzzer', 'rgb_led']);

// ── Pin normalization: raw pin string → { label, role } ───────────────────────
const PWM_PINS_UNO = [3, 5, 6, 9, 10, 11];
const PWM_PINS_ESP32 = []; // all ESP32 pins are PWM-capable

function normalizePin(raw) {
  if (raw == null) return null;
  let p = String(raw).trim();
  // "Pin 13" → 13
  let m = p.match(/pin\s*(\d+)/i);
  if (m) { const n = parseInt(m[1]); return { label: `D${n}`, role: PWM_PINS_UNO.includes(n) ? 'pwm' : 'digital', num: n }; }
  // "Pin A0" / "A0".."A5"
  m = p.match(/a\s*([0-5])/i) || p.match(/^A([0-5])$/i);
  if (m) return { label: `A${m[1]}`, role: 'analog', num: `A${m[1]}` };
  // GND / Ground
  if (/^gnd|ground|−|-|negative|cathode/i.test(p)) return { label: 'GND', role: 'ground' };
  // 5V / VCC / VIN
  if (/^5v$|^vcc$|power|positive|anode|\+5/i.test(p)) return { label: '5V', role: 'power' };
  if (/^3\.3v$|^3v3$/i.test(p)) return { label: '3.3V', role: 'power' };
  if (/^vin$/i.test(p)) return { label: 'VIN', role: 'power' };
  // D9 / D13
  m = p.match(/^D(\d+)/i);
  if (m) { const n = parseInt(m[1]); return { label: `D${n}`, role: PWM_PINS_UNO.includes(n) ? 'pwm' : 'digital', num: n }; }
  // Bare number from code (e.g. pinMode(13,...))
  m = p.match(/^(\d+)$/);
  if (m) { const n = parseInt(m[1]); return { label: `D${n}`, role: PWM_PINS_UNO.includes(n) ? 'pwm' : 'digital', num: n }; }
  // RX/TX
  if (/^tx$/i.test(p)) return { label: 'TX', role: 'digital', num: 1 };
  if (/^rx$/i.test(p)) return { label: 'RX', role: 'digital', num: 0 };
  // SDA/SCL
  if (/^sda$/i.test(p)) return { label: 'SDA', role: 'analog', num: 'A4' };
  if (/^scl$/i.test(p)) return { label: 'SCL', role: 'digital', num: 'A5' };
  return { label: p, role: 'digital' };
}

// ── Parse Arduino code to extract #define mappings and pin usages ────────────
function parseCode(code) {
  const clean = sanitizeCode(code || '');
  const defines = {};
  let m;
  const defineRe = /#define\s+([A-Za-z_]\w*)\s+([A-Za-z0-9_]+)/g;
  while ((m = defineRe.exec(clean)) !== null) defines[m[1]] = m[2];

  const resolve = (pin) => (defines[pin] ? resolve(defines[pin]) : pin);

  const usedPins = {}; // label -> role
  const addPin = (raw, role) => {
    const pin = resolve(String(raw).trim());
    const norm = normalizePin(pin);
    if (!norm) return;
    usedPins[norm.label] = norm.role === 'digital' && role ? role : norm.role;
  };

  const pinModeRe = /pinMode\s*\(\s*([^,]+?)\s*,\s*(\w+)\s*\)/g;
  while ((m = pinModeRe.exec(clean)) !== null) {
    const mode = m[2].toUpperCase();
    const role = mode === 'INPUT' || mode === 'INPUT_PULLUP' ? 'signal' : 'digital';
    addPin(m[1], role);
  }
  const ioRe = /(?:digitalWrite|digitalRead|analogWrite)\s*\(\s*([^,)]+)/g;
  while ((m = ioRe.exec(clean)) !== null) addPin(m[1], 'digital');
  const analogRe = /analogRead\s*\(\s*([^,)]+)/g;
  while ((m = analogRe.exec(clean)) !== null) addPin(m[1], 'analog');
  const servoRe = /\.attach\s*\(\s*([^,)]+)/g;
  while ((m = servoRe.exec(clean)) !== null) addPin(m[1], 'pwm');
  const toneRe = /\btone\s*\(\s*([^,)]+)/g;
  while ((m = toneRe.exec(clean)) !== null) addPin(m[1], 'digital');

  return { usedPins, defines };
}

// ── Parse step text to map a pin to the nearest component in the same sentence ─
function extractConnectionsFromSteps(steps, components) {
  const conns = [];
  const compTypes = components.map(c => ({ name: c, type: detectComponentType(c) })).filter(c => c.type);

  steps.forEach((step) => {
    const text = (step || '').toLowerCase();
    if (!text) return;
    // Split into sentences to keep pin↔component proximity
    const sentences = text.split(/[,.;]|\n|\band\b|\bthen\b/);

    sentences.forEach((sent) => {
      // Find pin mentions in this sentence
      const pinMentions = [];
      let pm;
      const pinRe = /(pin\s*\d+|pin\s*a[0-5]\b|\bA[0-5]\b|\bD\d+\b|gnd|ground|\b5v\b|vcc|\b3\.3v\b|vin)/gi;
      while ((pm = pinRe.exec(sent)) !== null) {
        const norm = normalizePin(pm[1]);
        if (norm) pinMentions.push(norm);
      }
      if (pinMentions.length === 0) return;

      // Find component mentioned in this sentence
      let matchedComp = null;
      for (const c of compTypes) {
        const key = c.name.toLowerCase().replace(/\(.*?\)/g, '').trim();
        const tokens = key.split(/[\s,×x]+/).filter(t => t.length > 2);
        if (tokens.some(t => sent.includes(t))) { matchedComp = c; break; }
      }
      // If no specific component, try generic: led, resistor, buzzer, servo, motor
      if (!matchedComp) {
        const generic = [
          { name: 'LED', type: 'led' }, { name: 'Resistor', type: 'resistor' },
          { name: 'Buzzer', type: 'buzzer' }, { name: 'Servo', type: 'servo' },
          { name: 'Motor', type: 'dc_motor' }, { name: 'Ultrasonic Sensor', type: 'ultrasonic' },
          { name: 'IR Sensor', type: 'ir_sensor' }, { name: 'Button', type: 'push_button' },
        ];
        for (const g of generic) {
          if (sent.includes(g.name.toLowerCase().split(' ')[0])) { matchedComp = g; break; }
        }
      }

      pinMentions.forEach((pin) => {
        if (pin.role === 'ground' || pin.role === 'power') {
          // Power/ground: tie to the matched component or skip (handled later)
          if (matchedComp) {
            conns.push({ controllerPin: pin.label, component: matchedComp.name, componentType: matchedComp.type, role: pin.role });
          }
        } else if (matchedComp) {
          conns.push({ controllerPin: pin.label, component: matchedComp.name, componentType: matchedComp.type, role: pin.role });
        }
      });
    });
  });

  return conns;
}

// ── Main export: generate pin connections for a project (ZERO AI) ────────────
export function generateLocalPinConnections(project) {
  // Single source of truth first: the audited pin map for this project.
  const pinMap = getPinMap(project.id);
  if (pinMap && pinMap.length) {
    const controllerComp = (project.components || []).find(c => /arduino|esp32|esp8266|nodemcu/i.test(c));
    const controllerType = detectComponentType(controllerComp) || 'arduino_uno';
    return pinMap.map(r => ({
      controllerPin: r.boardPin,
      component: r.comp,
      componentPin: r.compPin,
      wireColor: r.color,
      color: WIRE_COLOR_HEX[r.color] || '#64748B',
      controllerId: controllerType,
      componentId: detectComponentType(r.comp) || null,
    }));
  }

  const components = (project.components || []).filter(c => typeof c === 'string');
  const steps = project.steps || [];
  const code = project.arduinoCode || project.code || '';

  // Determine controller
  const controllerComp = components.find(c => /arduino|esp32|esp8266|nodemcu/i.test(c));
  const controllerType = detectComponentType(controllerComp) || 'arduino_uno';
  const isESP = /esp32|esp8266/i.test(controllerComp || '');

  // 1) Extract from steps (natural language wiring — most accurate)
  let conns = extractConnectionsFromSteps(steps, components);

  // 2) Enrich with code-parsed pins not found in steps
  const { usedPins } = parseCode(code);
  const knownPins = new Set(conns.map(c => c.controllerPin));
  const compTypes = components.map(c => ({ name: c, type: detectComponentType(c) })).filter(c => c.type);

  // Assign unmapped code pins to remaining components round-robin by type
  const unmappedPins = Object.entries(usedPins).filter(([label]) => !knownPins.has(label));
  if (unmappedPins.length > 0) {
    // Components that aren't the controller and aren't passive (breadboard/resistor/jumper/battery)
    const assignable = compTypes.filter(c => c.type !== controllerType &&
      !['breadboard', 'resistor', 'battery', 'power_supply'].includes(c.type));
    let ai = 0;
    unmappedPins.forEach(([label, role]) => {
      if (role === 'ground' || role === 'power') return; // handled separately
      const comp = assignable[ai % Math.max(assignable.length, 1)];
      if (comp) {
        conns.push({ controllerPin: label, component: comp.name, componentType: comp.type, role });
        ai++;
      }
    });
  }

  // 3) Ensure power + ground for components that need them
  conns.forEach(c => {
    if (!c.componentType) c.componentType = detectComponentType(c.component);
  });

  const needsPower = new Set();
  compTypes.forEach(c => { if (NEEDS_POWER.has(c.type) && c.type !== controllerType) needsPower.add(c.name); });

  // Add GND for every active component if not present
  const seenGND = new Set(conns.filter(c => c.role === 'ground').map(c => c.component));
  const seenPWR = new Set(conns.filter(c => c.role === 'power').map(c => c.component));
  compTypes.forEach(c => {
    if (c.type === controllerType || ['breadboard', 'resistor'].includes(c.type)) return;
    if (!seenGND.has(c.name)) {
      conns.push({ controllerPin: 'GND', component: c.name, componentType: c.type, role: 'ground' });
      seenGND.add(c.name);
    }
    if (needsPower.has(c.name) && !seenPWR.has(c.name)) {
      conns.push({ controllerPin: isESP ? '3.3V' : '5V', component: c.name, componentType: c.type, role: 'power' });
      seenPWR.add(c.name);
    }
  });

  // 4) Deduplicate by (controllerPin + component + componentPin)
  const wireColor = (role) => ({ power: 'red', ground: 'black', digital: 'blue', pwm: 'orange', analog: 'green', signal: 'yellow' }[role] || 'green');

  const seen = new Set();
  const final = [];
  conns.forEach(c => {
    const componentPin = (COMPONENT_PIN_LABEL[c.componentType] || {})[c.role] || 'Pin';
    const key = `${c.controllerPin}|${c.component}|${componentPin}`;
    if (seen.has(key)) return;
    seen.add(key);
    final.push({
      controllerPin: c.controllerPin,
      component: c.component,
      componentPin,
      wireColor: wireColor(c.role),
      color: WIRE_COLOR_HEX[wireColor(c.role)] || '#64748B',
      controllerId: controllerType,
      componentId: c.componentType,
    });
  });

  return final;
}

// ── Build a full local Build Sheet (ZERO AI) from a curriculum project ───────
export function generateLocalBuildSheet(project, classId) {
  const pinConnections = generateLocalPinConnections(project);
  const classLabel = classId ? formatClass(classId).replace('class', 'Class') : 'Robotics Project';

  const components = (project.components || []).map(c => {
    const name = typeof c === 'string' ? c : c.name;
    const qtyMatch = name.match(/(\d+)\s*[×x]\s*/i) || name.match(/(\d+)\s*pcs/i);
    return {
      name,
      quantity: qtyMatch ? parseInt(qtyMatch[1]) : 1,
      description: describeComponent(name),
      icon: iconForComponent(name),
    };
  });

  return {
    projectName: project.title || project.name,
    classLabel,
    difficulty: project.difficulty || 'Beginner',
    estimatedTime: project.estimatedTime || '1-2 hours',
    estimatedCost: project.estimatedCost || '₹200-500',
    objectives: deriveObjectives(project),
    components,
    pinConnections,
    buildSteps: (project.buildSteps || project.steps || []).map((s, i) => {
      if (typeof s === 'string') return { title: `Step ${i + 1}`, description: s };
      return { title: s.title || `Step ${i + 1}`, description: s.description || s.instruction || '' };
    }),
    arduinoCode: sanitizeCode(project.arduinoCode || project.code || ''),
    esp32Code: sanitizeCode(project.esp32Code || ''),
    codeExplanation: project.codeExplanation || '',
    testingChecklist: project.testingChecklist && project.testingChecklist.length > 0
      ? project.testingChecklist
      : ['All wires connected securely', 'Correct board & port selected in Arduino IDE', 'Code uploads without errors', 'Project responds as expected'],
    troubleshooting: (project.troubleshooting || []).map(t => {
      if (typeof t === 'string') {
        const parts = t.split(/[:.]/);
        return { problem: (parts[0] || t).trim(), causes: [], solutions: parts.slice(1).join('').trim() || t };
      }
      return { problem: t.problem || '', causes: t.causes || [], solutions: t.solution || t.solutions || '' };
    }),
    realWorldApplications: project.realWorldApplications || '',
    futureImprovements: project.futureImprovements || '',
    safetyTips: project.safetyTips || [],
    aiExplain: '',
  };
}

function describeComponent(name) {
  const n = (name || '').toLowerCase();
  const map = [
    ['arduino', 'Microcontroller brain of the circuit'], ['esp32', 'WiFi/Bluetooth microcontroller'],
    ['breadboard', 'Solderless prototyping base'], ['led', 'Light indicator'], ['resistor', 'Limits current'],
    ['servo', 'Rotational motor (0–180°)'], ['motor', 'Spinning drive'], ['ultrasonic', 'Distance sensor (2cm–4m)'],
    ['ir sensor', 'Detects infrared reflection'], ['buzzer', 'Sound output'], ['button', 'User input switch'],
    ['lcd', 'Text display'], ['oled', 'Graphics display'], ['relay', 'Electrical switch'],
    ['bluetooth', 'Wireless module'], ['joystick', 'Analog direction control'],
    ['battery', 'Power source'], ['gas', 'Gas/smoke sensor'], ['ldr', 'Light level sensor'],
  ];
  for (const [k, v] of map) if (n.includes(k)) return v;
  return 'Electronic component';
}

function iconForComponent(name) {
  const n = (name || '').toLowerCase();
  const map = {
    arduino: '🔧', esp32: '📱', esp8266: '📡', breadboard: '🔌', led: '💡', rgb: '🌈',
    resistor: '🎯', button: '🔘', buzzer: '🔊', servo: '⚙️', motor: '🌀', stepper: '🔄',
    ultrasonic: '📡', ir: '👁️', ldr: '🔅', temp: '🌡️', gas: '💨', lcd: '📟', oled: '🖥️',
    relay: '🔀', bluetooth: '📶', joystick: '🕹️', battery: '🔋', driver: '🚗', sensor: '📡',
  };
  for (const k in map) if (n.includes(k)) return map[k];
  return '📦';
}

function deriveObjectives(project) {
  const objs = [];
  const comps = (project.components || []).join(' ').toLowerCase();
  if (/led/.test(comps)) objs.push('Understand digital output and LED control');
  if (/servo/.test(comps)) objs.push('Learn servo motor angle control via PWM');
  if (/motor/.test(comps)) objs.push('Control motors using a motor driver');
  if (/ultrasonic|ir|sensor/.test(comps)) objs.push('Read sensor data and make decisions');
  if (/bluetooth|esp32|wifi/.test(comps)) objs.push('Establish wireless communication');
  if (/lcd|oled/.test(comps)) objs.push('Display information on a screen');
  if (objs.length === 0) objs.push('Build and program a working robotics project');
  objs.push('Wire a circuit on a breadboard safely');
  objs.push('Upload and debug Arduino code');
  return objs;
}