// "Build your own robot" for the Robot Arena.
//
// A student describes a robot in plain words. We turn that into a plan — the
// parts, the wiring, the Arduino code — and the plan drives the same simulated
// robot the other Arena tasks use. The wiring table is written here from the
// parts list rather than trusted from the AI, so it is always correct for the
// simulated pin map; the AI only chooses the parts and writes the behaviour.
// If the AI is unreachable (or returns code that does not run) a keyword-based
// design is used instead, so the feature never ends in an error screen.
import { backend } from '@/api/client';
import { getTask } from '@/lib/arena/tasks';
import { ArenaBoard, armMap } from '@/lib/arena/world';
import { ARM_TASK, ARM_SKELETON, ARM_OFFLINE_CODE } from '@/lib/arena/armTask';
import { runSketch } from '@/lib/arduino/runtime';
import { asText } from '@/lib/aiShape';

export const KINDS = {
  ultrasonic: { name: 'HC-SR04 ultrasonic sensor', purpose: 'Measures the distance to whatever is ahead.', wiring: [['VCC', '5V'], ['TRIG', 'D9'], ['ECHO', 'D10'], ['GND', 'GND']] },
  ir: { name: '2 × IR sensors (digital)', purpose: 'Left and right eyes: HIGH over a black line or when there is no floor.', wiring: [['Left OUT', 'D2'], ['Right OUT', 'D3'], ['VCC', '5V'], ['GND', 'GND']] },
  line_array: { name: '3-channel analog IR array', purpose: 'Three light sensors that say how far the robot is from a line.', wiring: [['Left', 'A0'], ['Centre', 'A1'], ['Right', 'A2'], ['VCC', '5V'], ['GND', 'GND']] },
  servo: { name: 'SG90 servo motor', purpose: 'Swings an arm or gripper to an exact angle.', wiring: [['Signal (orange)', 'D11'], ['VCC (red)', '5V'], ['GND (brown)', 'GND']] },
  led: { name: 'Red LED + 220 Ω resistor', purpose: 'A status light.', wiring: [['Anode (through 220 Ω)', 'D13'], ['Cathode', 'GND']] },
  buzzer: { name: 'Piezo buzzer', purpose: 'Beeps to warn or celebrate.', wiring: [['+', 'A4'], ['−', 'GND']] },
};

const BASE_PARTS = [
  { name: 'Arduino Uno', qty: 1, purpose: 'The brain: runs your sketch.' },
  { name: 'L298N motor driver', qty: 1, purpose: 'Lets the Arduino switch the motors, which need far more current than a pin can give.' },
  { name: 'Gear motor + wheel', qty: 4, purpose: 'Two on each side, wired in pairs.' },
  { name: '2 × 18650 battery pack', qty: 1, purpose: 'Powers the motors through the L298N (7–12 V).' },
];

const BASE_WIRING = [
  ['L298N', 'ENA', 'D5 (PWM)', 'Left motor speed'],
  ['L298N', 'IN1', 'D4', 'Left motor direction'],
  ['L298N', 'IN2', 'D7', 'Left motor direction'],
  ['L298N', 'ENB', 'D6 (PWM)', 'Right motor speed'],
  ['L298N', 'IN3', 'D8', 'Right motor direction'],
  ['L298N', 'IN4', 'D12', 'Right motor direction'],
  ['L298N', 'OUT1 / OUT2', 'Left motors', 'Both left motors in parallel'],
  ['L298N', 'OUT3 / OUT4', 'Right motors', 'Both right motors in parallel'],
  ['L298N', '12V and GND', 'Battery pack', 'Motor power'],
  ['L298N', 'GND', 'Arduino GND', 'Share one ground so signals make sense'],
];

export const SKELETON = `// ── RoboCraft robot pin map ──
const int ENA = 5, IN1 = 4, IN2 = 7;      // left motor  (L298N)
const int ENB = 6, IN3 = 8, IN4 = 12;     // right motor
const int IR_LEFT = 2, IR_RIGHT = 3;      // digital IR: HIGH on black / no floor
const int TRIG = 9, ECHO = 10;            // HC-SR04
const int SERVO_PIN = 11, LED = 13, BUZZER = A4;
// analog IR array: A0 (left), A1 (centre), A2 (right) → ~900 on black, ~80 on white

void motors(int left, int right) {        // -255..255 for each side
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0);
  analogWrite(ENA, abs(left));  analogWrite(ENB, abs(right));
}

long readDistance() {                     // centimetres, 400 = nothing in range
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);
  if (t == 0) return 400;
  return t * 0.0343 / 2;
}
`;

// ── offline designs ─────────────────────────────────────────────────────────
const SETUP_ALL = `  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(IR_LEFT, INPUT); pinMode(IR_RIGHT, INPUT);
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(LED, OUTPUT); pinMode(BUZZER, OUTPUT);
  Serial.begin(9600);`;

const GUARD_CODE = `${SKELETON}
void setup() {
${SETUP_ALL}
}

// Patrol in a square. If anything comes within 25 cm: stop and raise the alarm.
void loop() {
  long d = readDistance();
  if (d < 25) {
    motors(0, 0);
    for (int i = 0; i < 3; i++) {
      digitalWrite(LED, HIGH); tone(BUZZER, 1000); delay(150);
      digitalWrite(LED, LOW);  tone(BUZZER, 600);  delay(150);
    }
    noTone(BUZZER);
    motors(-130, -130); delay(500);
    motors(150, -150);  delay(500);
  } else {
    motors(130, 130);
  }
  delay(30);
}
`;

const EXPLORER_CODE = `${SKELETON}
void setup() {
${SETUP_ALL}
}

// Explore the room: drive ahead, and turn away from anything closer than 25 cm.
void loop() {
  long d = readDistance();
  Serial.print("Distance: "); Serial.println(d);
  if (d < 25) {
    digitalWrite(LED, HIGH);
    motors(-120, -120); delay(350);
    motors(150, -150);  delay(300 + random(0, 300));
    digitalWrite(LED, LOW);
  } else {
    motors(150, 150);
  }
  delay(30);
}
`;

const withHeader = (task) => String(task?.solution || '').replace(/^\/\/ ── RoboCraft robot pin map ──[\s\S]*?\n\n/, '');

// Words that mean a stationary arm that works on objects, not a car with a gadget on it.
const ARM_RE = /\b(robot(ic)? arm|arm|grip|gripper|claw|crane|pick(ing)?[- ]?(and|&|n)?[- ]?place|pick ?up|pick|grab|picker|manipulator)\b/i;
export const isArmRequest = (text) => ARM_RE.test(String(text || ''));

function templates() {
  return [
    { re: ARM_RE, name: 'Pick-and-Place Robotic Arm', env: 'arm', body: 'arm', parts: ['servo', 'ultrasonic', 'led', 'buzzer'], color: '#f97316',
      summary: 'A 4-servo arm on a fixed base. Three cubes wait on the table; it picks each one up and puts it in the tray.', code: ARM_OFFLINE_CODE,
      explain: 'Each joint is a servo: the base turns the arm, the shoulder and elbow reach out and down, and the gripper opens (0°) and closes (90°). pickAndPlace() is a list of poses: hover over the cube, lower, close the gripper, lift, swing to the tray, lower, open. The ultrasonic sensor on the base checks that a cube is really there.' },
    { re: /\b(line|follow|track|path|road|lane)\b/i, name: 'Line-Following Robot', env: 'line', parts: ['ir', 'led'], color: '#0ea5e9',
      summary: 'Two IR sensors watch for the black line and steer to stay on it.', code: () => getTask('line')?.solution,
      explain: 'Each IR sensor reads HIGH over black. If the left sensor sees black the line has drifted left, so turn left; if the right sees it, turn right; otherwise drive straight.' },
    { re: /\b(pid|smooth|precise|fast line)\b/i, name: 'PID Line Follower', env: 'line', parts: ['line_array'], color: '#8b5cf6',
      summary: 'Uses three analog sensors and a PID loop to follow a wavy line smoothly.', code: () => getTask('pid')?.solution,
      explain: 'The error is how far the line is from the centre. P reacts to it now, D to how fast it is changing. Together they steer smoothly instead of zig-zagging.' },
    { re: /\b(edge|cliff|table|fall|drop)\b/i, name: 'Edge-Safe Robot', env: 'edge', parts: ['ir', 'led'], color: '#ef4444',
      summary: 'Drives along a table and turns back before it falls off.', code: () => getTask('edge')?.solution,
      explain: 'When the IR sensor has no floor to reflect from, it reads HIGH. That is the edge, so the robot reverses and turns.' },
    { re: /\b(maze|labyrinth|escape|wall)\b/i, name: 'Maze Runner', env: 'maze', parts: ['ultrasonic', 'ir'], color: '#14b8a6',
      summary: 'Finds its way through a maze using distance sensing.', code: () => getTask('maze')?.solution,
      explain: 'The ultrasonic sensor looks ahead. When a wall is close, the robot picks a turn; otherwise it keeps going.' },
    { re: /\b(guard|alarm|security|patrol|police|siren|watch)\b/i, name: 'Security Patrol Robot', env: 'obstacles', parts: ['ultrasonic', 'led', 'buzzer'], color: '#dc2626',
      summary: 'Patrols the area and sounds an alarm when something comes close.', code: GUARD_CODE,
      explain: 'The ultrasonic sensor is the intruder detector. Below 25 cm the robot stops, flashes the LED, alternates two buzzer tones, then moves off.' },
    { re: /\b(obstacle|avoid|dodge|bump|explor|wander|vacuum|clean)\b/i, name: 'Obstacle-Avoiding Robot', env: 'obstacles', parts: ['ultrasonic', 'led'], color: '#0ea5e9',
      summary: 'Drives around the room and turns away from anything in its path.', code: () => getTask('obstacle')?.solution,
      explain: 'Measure the distance ahead. If it is short, back up and turn; otherwise carry on.' },
  ];
}

export function offlineDesign(prompt) {
  const text = String(prompt || '');
  const t = templates().find(x => x.re.test(text)) || {
    name: 'Explorer Robot', env: 'obstacles', parts: ['ultrasonic', 'led'], color: '#0ea5e9',
    summary: 'Explores the room and turns away from obstacles.', code: EXPLORER_CODE,
    explain: 'The ultrasonic sensor measures distance ahead; when something is closer than 25 cm the robot reverses and turns.',
  };
  let code = typeof t.code === 'function' ? t.code() : t.code;
  code = String(code || EXPLORER_CODE);
  return { name: t.name, summary: t.summary, environment: t.env, body: t.body || 'rover', color: t.color, parts: t.parts, code, explain: t.explain };
}

// ── turning a design into a task the Arena screen can run ────────────────────
const ENV_TASK = { arm: 'arm', line: 'line', obstacles: 'obstacle', maze: 'maze', edge: 'edge', open: 'free', pid: 'pid' };
const COLOR = /^#[0-9a-fA-F]{6}$/;

const ARM_PARTS = [
  { name: 'Arduino Uno', qty: 1, purpose: 'The brain: runs your sketch.' },
  { name: 'SG90 / MG90 servo', qty: 4, purpose: 'Base, shoulder, elbow and gripper: each turns to the angle you write().' },
  { name: 'HC-SR04 ultrasonic sensor', qty: 1, purpose: 'On the base: checks that a cube is in front of the gripper.' },
  { name: '5 V 3 A power supply', qty: 1, purpose: 'Powers the servos. They draw too much current for the Uno\'s 5 V pin.' },
  { name: 'Red LED + 220 Ω resistor', qty: 1, purpose: 'Lights while the arm is working on a cube.' },
  { name: 'Piezo buzzer', qty: 1, purpose: 'Beeps to celebrate or warn.' },
];
const ARM_WIRING = [
  ['Base servo', 'Signal', 'D3 (PWM)', 'Turns the whole arm'], ['Shoulder servo', 'Signal', 'D5 (PWM)', 'Leans the arm forward'],
  ['Elbow servo', 'Signal', 'D6 (PWM)', 'Bends the forearm'], ['Gripper servo', 'Signal', 'D11 (PWM)', '0° open, 90° closed'],
  ['All 4 servos', 'VCC and GND', '5 V supply + and −', 'Not from the Uno: join the supply − to Arduino GND'],
  ['HC-SR04', 'TRIG / ECHO', 'D9 / D10', 'Distance to the cube'], ['HC-SR04', 'VCC / GND', '5V / GND', 'Sensor power'],
  ['Red LED', 'Anode (through 220 Ω)', 'D13', 'Status light'], ['Piezo buzzer', '+', 'A4', 'Beeper'],
];

export function buildWiring(kinds) {
  const rows = BASE_WIRING.map(([part, pin, to, note]) => ({ part, pin, to, note }));
  for (const k of kinds) {
    const def = KINDS[k]; if (!def) continue;
    for (const [pin, to] of def.wiring) rows.push({ part: def.name, pin, to, note: '' });
  }
  return rows;
}

/** Which optional parts the sketch really uses — the code is the source of truth. */
export function kindsFromCode(code) {
  const body = String(code || '').replace(/long readDistance\(\)[\s\S]*?\n}\n/, '').split('\n').filter(l => !/^\s*const\s+int\b/.test(l) && !/^\s*\/\//.test(l) && !/^\s*pinMode\s*\(/.test(l)).join('\n');
  const used = [];
  if (/\b(TRIG|ECHO|readDistance|pulseIn)\b/.test(body)) used.push('ultrasonic');
  if (/\b(IR_LEFT|IR_RIGHT)\b/.test(body)) used.push('ir');
  if (/\b(A0|A1|A2)\b|analogRead/.test(body)) used.push('line_array');
  if (/\bServo\b|\bSERVO_PIN\b|\barm\./.test(body)) used.push('servo');
  if (/\bLED\b/.test(body)) used.push('led');
  if (/\bBUZZER\b|\btone\s*\(/.test(body)) used.push('buzzer');
  return used;
}

function makeArmTask(design, stamp) {
  const color = COLOR.test(design.color || '') ? design.color : '#f97316';
  return {
    id: `custom-${stamp}`,
    title: design.name || 'My robotic arm',
    badge: 'Built by you',
    body: 'arm',
    classes: ['class_9', 'class_10', 'class_11'],
    desc: design.summary || 'A robotic arm you designed.',
    learn: design.explain || 'Read the code line by line and predict what the arm will do before you press Run.',
    map: () => ({ ...armMap(), custom: { color, parts: ['servo', 'ultrasonic', 'led', 'buzzer'] } }),
    init: () => ({}),
    evaluate: ARM_TASK.evaluate,
    starter: design.code,
    solution: null,
    plan: { parts: ARM_PARTS, wiring: ARM_WIRING.map(([part, pin, to, note]) => ({ part, pin, to, note })), kinds: ['servo', 'ultrasonic', 'led', 'buzzer'] },
  };
}

export function makeTask(design, stamp = Date.now()) {
  if (design.body === 'arm') return makeArmTask(design, stamp);
  const fromCode = kindsFromCode(design.code);
  const kinds = [...new Set(fromCode.length ? fromCode : (design.parts || []).filter(k => KINDS[k]))];
  const baseId = ENV_TASK[design.environment] || 'obstacle';
  const base = getTask(baseId) || getTask('free');
  const color = COLOR.test(design.color || '') ? design.color : '#0ea5e9';
  const parts = [...BASE_PARTS, ...kinds.map(k => ({ name: KINDS[k].name, qty: 1, purpose: KINDS[k].purpose }))];
  return {
    id: `custom-${stamp}`,
    title: design.name || 'My robot',
    badge: 'Built by you',
    classes: ['class_9', 'class_10', 'class_11'],
    desc: design.summary || 'A robot you designed.',
    learn: design.explain || 'Read the code line by line and predict what the robot will do before you press Run.',
    map: () => ({ ...base.map(), custom: { color, parts: kinds } }),
    init: () => ({}),
    evaluate: (b) => ({ state: 'running', msg: `${(b.robot.distance / 100).toFixed(1)} m driven · ${b.collisions || 0} bump${b.collisions === 1 ? '' : 's'}` }),
    starter: design.code,
    solution: null,
    plan: { parts, wiring: buildWiring(kinds), kinds },
  };
}

// ── making sure the code actually runs ───────────────────────────────────────
/** Runs the sketch for ~1.5 simulated seconds. Resolves to null, or { message, line }. */
export function dryRun(code, envTask) {
  return new Promise((resolve) => {
    let err = null;
    try {
      const board = new ArenaBoard(envTask === 'arm' ? armMap() : (getTask(ENV_TASK[envTask] || 'obstacle') || getTask('free')).map());
      const h = runSketch(code, board, { speed: 64, maxMs: 1500, onError: (e) => { err = e; } });
      const timer = setTimeout(() => { h.stop(); resolve(err ? { message: err.message, line: err.line } : null); }, 4000);
      h.done.then((res) => {
        clearTimeout(timer);
        const e = err || res?.error;
        resolve(e ? { message: e.message, line: e.line } : null);
      }).catch((e) => { clearTimeout(timer); resolve({ message: String(e?.message || e) }); });
    } catch (e) {
      resolve({ message: String(e?.message || e) });
    }
  });
}

const looksLikeSketch = (c) => typeof c === 'string' && /void\s+setup\s*\(/.test(c) && /void\s+loop\s*\(/.test(c);
const stripFence = (c) => String(c || '').replace(/^\s*```[a-z+]*\n?/i, '').replace(/```\s*$/i, '').trim();

const SCHEMA = { type: 'object', properties: {
  name: { type: 'string' }, summary: { type: 'string' }, environment: { type: 'string' },
  color: { type: 'string' }, parts: { type: 'array', items: { type: 'string' } },
  code: { type: 'string' }, explain: { type: 'string' },
} };

function armPrompt(request, previous) {
  return `A school student wants to build a robotic arm: "${request}".
It is a STATIONARY 4-servo arm bolted to a table (not on a car). Three cubes already sit on the table 20 cm from the base, at base angles 60, 90 and 120. A tray waits at base angle about 160 (use 148, 160, 172 so the cubes do not stack).
Return JSON with: name, summary (one sentence), color (hex, the arm's colour), explain (2-3 simple sentences), and code: a complete Arduino sketch that picks up every cube and puts it in the tray, then stops. Start from this skeleton EXACTLY, keep every line, then add pickAndPlace helpers, setup() and loop():
${ARM_SKELETON}
Angles: base 90 = straight ahead. shoulder 90 = upright, smaller leans forward. elbow 180 = straight, smaller bends. grip 0 = open, 90 = closed.
Reference poses reaching 20 cm: hover pose(angle, 92, 67, 700), table height pose(angle, 62, 63, 900); over the tray lower with pose(drop, 65, 62, 800).
Rules: only pinMode, digitalWrite/Read, delay, delayMicroseconds, pulseIn, tone/noTone, Serial and Servo. Use grip.write(0) to open and grip.write(90) to close, with delay(500) after closing. Comment each step. Under 70 lines.${previous ? `\n\nYour previous sketch failed with: "${previous.error}". Fix it.\nPrevious sketch:\n${previous.code}` : ''}`;
}

function aiPrompt(request, previous) {
  return `A school student wants to build a robot: "${request}".
They will run it in a simulator of a 4-wheel Arduino Uno robot car. Design it using ONLY these optional parts:
${Object.entries(KINDS).map(([k, v]) => `- ${k}: ${v.name} — ${v.purpose}`).join('\n')}
(The Arduino, L298N driver, 4 motors and battery are always present.)

Return JSON with:
- name: short robot name
- summary: one sentence of what it does
- environment: one of line, obstacles, maze, edge, open (where it should be tested)
- color: a hex colour like #0ea5e9
- parts: array of part ids from the list above (only those that the code really uses)
- code: a complete Arduino sketch. Start from this skeleton EXACTLY, keep every line of it, then add your own setup() and loop():
${SKELETON}
  Rules: only use pinMode, digitalWrite/Read, analogWrite/Read, delay, millis, pulseIn, tone/noTone, Serial and the Servo library (#include <Servo.h>; Servo arm; arm.attach(SERVO_PIN); arm.write(angle)). setup() must pinMode every pin it uses. Keep delays short (under 1000 ms) and the sketch under 70 lines. Comment each step so a student can read it.
- explain: 2-3 simple sentences on how it works.${previous ? `\n\nYour previous sketch failed with: "${previous.error}". Fix it.\nPrevious sketch:\n${previous.code}` : ''}`;
}

/**
 * Designs a robot from a description. Never throws: falls back to an offline
 * design (and says so in `note`) when the AI is unavailable or its code fails.
 */
export async function designRobot(request) {
  const text = String(request || '').trim().slice(0, 300);
  let previous = null, note = '';
  const isArm = isArmRequest(text);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await backend.integrations.Core.InvokeLLM({ user_input: text, prompt: (isArm ? armPrompt : aiPrompt)(text, previous), response_json_schema: SCHEMA });
      if (!res || typeof res !== 'object') throw new Error('empty');
      // The safety filter answers with { response } and no sketch.
      if (res.__blocked) return { blocked: true, note: asText(res.response || res.text) };
      const design = {
        name: asText(res.name).slice(0, 60) || 'My robot', summary: asText(res.summary).slice(0, 240),
        environment: isArm ? 'arm' : (ENV_TASK[asText(res.environment).toLowerCase()] && asText(res.environment).toLowerCase() !== 'arm' ? asText(res.environment).toLowerCase() : 'obstacles'),
        body: isArm ? 'arm' : 'rover',
        color: asText(res.color), parts: (res.parts || []).map(p => asText(p).toLowerCase().trim()).filter(p => KINDS[p]),
        code: stripFence(res.code), explain: asText(res.explain).slice(0, 600),
      };
      if (!looksLikeSketch(design.code)) throw new Error('no sketch');
      if (isArm && !/\bgrip\b/.test(design.code)) throw new Error('not an arm sketch');
      const problem = await dryRun(design.code, design.environment);
      if (!problem) return { design, note: '' };
      previous = { code: design.code, error: `${problem.line ? `line ${problem.line}: ` : ''}${problem.message}` };
    } catch (e) {
      if (e && (e.status === 0 || e.status === 429 || e.status === 401)) { note = e.message || ''; break; }
    }
  }
  const design = offlineDesign(text);
  design.parts = [...new Set(design.parts)];
  return { design, note: note || 'The AI helper was not available, so this robot was built from the closest ready-made design.' };
}

/** Asks the AI to repair broken code; resolves to fixed code or null. */
export async function fixCode(code, errorText, envTask) {
  try {
    const res = await backend.integrations.Core.InvokeLLM({
      user_input: errorText,
      prompt: `This Arduino sketch for a simulated robot car fails with: "${errorText}".\nFix it and return JSON {code}. Keep the pin definitions and motors()/readDistance() helpers.\n\n${code}`,
      response_json_schema: { type: 'object', properties: { code: { type: 'string' } } },
    });
    const fixed = stripFence(res?.code);
    if (!looksLikeSketch(fixed)) return null;
    return (await dryRun(fixed, envTask)) ? null : fixed;
  } catch { return null; }
}
