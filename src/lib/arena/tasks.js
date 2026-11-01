// Robot arena tasks — the lab experiments named in the CISCE syllabus plus extras.
import { ROBOT_PINS as P } from './world';
import { ARM_TASK } from './armTask';

// Closed track: stadium with an S-bend on one straight.
function stadium(w, h, n = 120) {
  const pts = [];
  const r = h / 2, s = w / 2 - r;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const L = 4 * s + 2 * Math.PI * r;
    let d = u * L;
    if (d < 2 * s) { const x = -s + d; pts.push([x, -r + (x > -s / 2 && x < s / 2 ? 14 * Math.sin(((x + s / 2) / s) * Math.PI * 2) : 0)]); continue; }
    d -= 2 * s;
    if (d < Math.PI * r) { const a = -Math.PI / 2 + d / r; pts.push([s + r * Math.cos(a), r * Math.sin(a)]); continue; }
    d -= Math.PI * r;
    if (d < 2 * s) { pts.push([s - d, r]); continue; }
    d -= 2 * s;
    const a = Math.PI / 2 + d / r; pts.push([-s + r * Math.cos(a), r * Math.sin(a)]);
  }
  return pts;
}
// Wavy closed track for PID (sharper curves)
function wavy(n = 160) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const rr = 85 + 22 * Math.sin(3 * t);
    pts.push([rr * Math.cos(t) * 1.35, rr * Math.sin(t)]);
  }
  return pts;
}

const PINMAP = `// ── RoboCraft robot pin map ──
// Left motor  (L298N): ENA = 5 (PWM), IN1 = 4, IN2 = 7
// Right motor (L298N): ENB = 6 (PWM), IN3 = 8, IN4 = 12
// IR sensors (digital): LEFT = 2, RIGHT = 3  → HIGH on black / no floor
// Ultrasonic HC-SR04:   TRIG = 9, ECHO = 10
// Servo = 11, LED = 13, Buzzer = A4
// Analog line sensors:  A0 (left), A1 (centre), A2 (right) → ~900 on black, ~80 on white
`;

const MOTOR_HELPERS = `
void motors(int left, int right) {      // -255..255 for each side
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0);
  analogWrite(ENA, abs(left));  analogWrite(ENB, abs(right));
}`;

const PIN_DEFINES = `const int ENA = 5, IN1 = 4, IN2 = 7;
const int ENB = 6, IN3 = 8, IN4 = 12;
const int IR_LEFT = 2, IR_RIGHT = 3;
const int TRIG = 9, ECHO = 10;
`;

const SETUP_PINS = `  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(IR_LEFT, INPUT); pinMode(IR_RIGHT, INPUT);
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  Serial.begin(9600);`;

const DISTANCE_FN = `
long readDistance() {                   // returns cm
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);
  if (t == 0) return 400;               // nothing in range
  return t * 0.0343 / 2;
}`;

function lapTracker(pts, n = 6) {
  const cps = Array.from({ length: n }, (_, i) => pts[Math.floor((i * pts.length) / n)]);
  return { cps, next: 1, laps: 0, offSince: null };
}
function lapEval(b, st, limitMs, label) {
  const r = b.robot;
  const cp = st.cps[st.next % st.cps.length];
  if (Math.hypot(r.x - cp[0], r.y - cp[1]) < 18) {
    st.next++;
    if (st.next > st.cps.length) return { state: 'pass', msg: `Lap complete in ${(b.time / 1000).toFixed(1)} s — ${label}` };
  }
  const L = b.map.line;
  let d = Infinity; for (let i = 0; i < L.pts.length; i++) { const p = L.pts[i]; d = Math.min(d, Math.hypot(r.x - p[0], r.y - p[1])); }
  if (d > 14) { st.offSince ??= b.time; if (b.time - st.offSince > 1500) return { state: 'fail', msg: 'The robot left the line. Check which sensor turns which way.' }; }
  else st.offSince = null;
  if (b.time > limitMs) return { state: 'fail', msg: `Time is up (${limitMs / 1000} s). Try a higher speed or smoother turns.` };
  return { state: 'running', msg: `Checkpoint ${Math.min(st.next, st.cps.length)}/${st.cps.length}` };
}

export const TASKS = [
  {
    id: 'line', title: 'Line Follower', badge: 'Class 10 lab experiment', classes: ['class_9', 'class_10', 'class_11'],
    desc: 'Follow the black line around the track and finish one lap within 90 seconds.',
    learn: 'Two IR sensors look at the floor. If the left one sees black, the line is to the left — turn left. If the right one sees black, turn right.',
    map: () => { const pts = stadium(260, 150); return { size: [340, 230], floor: 'white', line: { pts, closed: true, width: 3 }, start: { x: pts[0][0], y: pts[0][1], a: Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]) } }; },
    init: (b) => lapTracker(b.map.line.pts),
    evaluate: (b, st) => lapEval(b, st, 90000, 'line follower works!'),
    starter: `${PINMAP}
${PIN_DEFINES}
void setup() {
${SETUP_PINS}
}

void loop() {
  int left = digitalRead(IR_LEFT);     // HIGH (1) = black
  int right = digitalRead(IR_RIGHT);

  // TODO: both white → go straight, left black → turn left, right black → turn right
  motors(150, 150);
}
${MOTOR_HELPERS}`,
    solution: `${PINMAP}
${PIN_DEFINES}
void setup() {
${SETUP_PINS}
}

void loop() {
  int left = digitalRead(IR_LEFT);
  int right = digitalRead(IR_RIGHT);
  if (left == LOW && right == LOW) motors(170, 170);       // line between sensors
  else if (left == HIGH && right == LOW) motors(-60, 190);  // line on the left → turn left
  else if (left == LOW && right == HIGH) motors(190, -60);  // line on the right → turn right
  else motors(120, 120);
}
${MOTOR_HELPERS}`,
  },
  {
    id: 'obstacle', title: 'Obstacle Avoider', badge: 'Class 10 lab experiment', classes: ['class_9', 'class_10', 'class_11'],
    desc: 'Drive around the room for 40 seconds and cover at least 4 metres without hitting anything.',
    learn: 'The ultrasonic sensor measures distance. If something is closer than about 25 cm, stop, back up a little and turn.',
    map: () => ({ size: [300, 300], floor: 'grey', walls: true,
      obstacles: [{ x: 40, y: 40, w: 30, h: 30 }, { x: -90, y: 60, w: 40, h: 20 }, { x: -60, y: -100, w: 25, h: 50 }, { x: 70, y: -80, w: 45, h: 25 }, { x: -130, y: -10, w: 20, h: 40 }, { x: 100, y: 90, w: 20, h: 40 }],
      start: { x: 0, y: -10, a: Math.PI / 2 } }),
    init: () => ({}),
    evaluate: (b) => {
      if (b.collisions > 0) return { state: 'fail', msg: 'Bump! The robot hit something. Turn earlier or slow down.' };
      if (b.time >= 40000) return b.robot.distance >= 400 ? { state: 'pass', msg: `No collisions and ${(b.robot.distance / 100).toFixed(1)} m covered — great avoiding!` } : { state: 'fail', msg: `No collisions, but only ${(b.robot.distance / 100).toFixed(1)} m covered. Keep moving more.` };
      return { state: 'running', msg: `${(b.robot.distance / 100).toFixed(1)} m · ${Math.ceil((40000 - b.time) / 1000)} s left` };
    },
    starter: `${PINMAP}
${PIN_DEFINES}
void setup() {
${SETUP_PINS}
}

void loop() {
  long d = readDistance();
  Serial.println(d);
  // TODO: if d < 25 → stop, reverse, turn; otherwise go forward
  motors(160, 160);
  delay(50);
}
${DISTANCE_FN}
${MOTOR_HELPERS}`,
    solution: `${PINMAP}
${PIN_DEFINES}
void setup() {
${SETUP_PINS}
}

void loop() {
  long d = readDistance();
  Serial.println(d);
  if (d < 28) {
    motors(0, 0);       delay(100);
    motors(-150, -150); delay(300);
    motors(170, -170);  delay(random(250, 550));
  } else {
    motors(170, 170);
  }
  delay(40);
}
${DISTANCE_FN}
${MOTOR_HELPERS}`,
  },
  {
    id: 'edge', title: 'Edge Detector', badge: 'Class 10 lab experiment', classes: ['class_9', 'class_10', 'class_11'],
    desc: 'Keep driving on the table for 30 seconds without falling off — cover at least 2 metres.',
    learn: 'The IR sensors point down. Over the table they see a reflection (LOW). At the edge there is no floor (HIGH) — reverse and turn away.',
    map: () => ({ size: [220, 160], floor: 'table', table: { x: -70, y: -45, w: 140, h: 90 }, start: { x: 0, y: 0, a: 0.3 } }),
    init: () => ({}),
    evaluate: (b) => {
      if (b.robot.fallen) return { state: 'fail', msg: 'The robot fell off the table! React as soon as either sensor reads HIGH.' };
      if (b.time >= 30000) return b.robot.distance >= 200 ? { state: 'pass', msg: `Stayed on the table and covered ${(b.robot.distance / 100).toFixed(1)} m.` } : { state: 'fail', msg: 'Safe, but too slow — cover at least 2 m.' };
      return { state: 'running', msg: `${(b.robot.distance / 100).toFixed(1)} m · ${Math.ceil((30000 - b.time) / 1000)} s left` };
    },
    starter: `${PINMAP}
${PIN_DEFINES}
void setup() {
${SETUP_PINS}
}

void loop() {
  int left = digitalRead(IR_LEFT);    // LOW = table, HIGH = edge (no floor)
  int right = digitalRead(IR_RIGHT);
  // TODO: if either sensor is HIGH → reverse, then turn away from that side
  motors(140, 140);
}
${MOTOR_HELPERS}`,
    solution: `${PINMAP}
${PIN_DEFINES}
void setup() {
${SETUP_PINS}
}

void loop() {
  int left = digitalRead(IR_LEFT);
  int right = digitalRead(IR_RIGHT);
  if (left == HIGH || right == HIGH) {
    motors(-150, -150); delay(350);
    if (left == HIGH) motors(160, -160); else motors(-160, 160);
    delay(300);
  } else {
    motors(140, 140);
  }
}
${MOTOR_HELPERS}`,
  },
  {
    id: 'bin', title: 'Smart Waste Bin', badge: 'Class 9 lab experiment', classes: ['class_9', 'class_10', 'class_11'],
    desc: 'Open the lid when a hand comes within 20 cm and close it again after the hand goes away. Pass 3 hands in a row.',
    learn: 'An ultrasonic sensor on the lid measures distance. A servo motor lifts the lid: 0° = closed, 90° = open.',
    map: () => ({ size: [160, 160], floor: 'grey', bin: true, start: { x: 0, y: 0, a: 0 }, handCycle: 7000 }),
    init: () => ({ cycle: -1, opened: false, closed: true, passes: 0 }),
    evaluate: (b, st) => {
      const cycle = Math.floor(b.time / 7000), t = b.time % 7000;
      if (cycle !== st.cycle) {
        if (st.cycle >= 0) {
          if (!st.opened) return { state: 'fail', msg: `Hand ${st.cycle + 1}: the lid did not open. Open the servo when distance < 20 cm.` };
          if (!st.closedAfter) return { state: 'fail', msg: `Hand ${st.cycle + 1}: the lid stayed open after the hand left. Close it when distance is large.` };
          st.passes++;
          if (st.passes >= 3) return { state: 'pass', msg: 'Three hands handled perfectly — your smart bin works!' };
        }
        st.cycle = cycle; st.opened = false; st.closedAfter = false;
      }
      if (t > 2500 && t < 4000 && b.lid > 70) st.opened = true;
      if (t > 6000 && b.lid < 20) st.closedAfter = true;
      return { state: 'running', msg: `Hand ${cycle + 1} · lid ${Math.round(b.lid)}° · ${st.passes}/3 done` };
    },
    starter: `${PINMAP}
#include <Servo.h>
const int TRIG = 9, ECHO = 10, SERVO_PIN = 11;
Servo lid;

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  lid.attach(SERVO_PIN);
  lid.write(0);           // closed
  Serial.begin(9600);
}

void loop() {
  long d = readDistance();
  Serial.println(d);
  // TODO: if d < 20 → lid.write(90); otherwise close the lid after a short wait
  delay(100);
}
${DISTANCE_FN}`,
    solution: `${PINMAP}
#include <Servo.h>
const int TRIG = 9, ECHO = 10, SERVO_PIN = 11;
Servo lid;
unsigned long lastSeen = 0;

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  lid.attach(SERVO_PIN);
  lid.write(0);
  Serial.begin(9600);
}

void loop() {
  long d = readDistance();
  Serial.println(d);
  if (d < 20) { lid.write(90); lastSeen = millis(); }
  else if (millis() - lastSeen > 1500) lid.write(0);   // close 1.5 s after the hand leaves
  delay(100);
}
${DISTANCE_FN}`,
  },
  {
    id: 'maze', title: 'Robotics Game: Maze Runner', badge: 'Class 9 lab — robotics game', classes: ['class_9', 'class_10', 'class_11'],
    desc: 'Find your way to the green goal zone within 2 minutes. Bumping a wall is allowed but costs time.',
    learn: 'Combine sensing and decisions: go forward when clear, and choose a turn when a wall is ahead. A "keep turning the same way" strategy solves many simple mazes.',
    map: () => ({ size: [300, 240], floor: 'grey', walls: true,
      obstacles: [{ x: -55, y: -120, w: 12, h: 150 }, { x: 45, y: -30, w: 12, h: 150 }],
      goal: { x: 90, y: 40, w: 60, h: 80 }, start: { x: -110, y: -80, a: Math.PI / 2 } }),
    init: () => ({}),
    evaluate: (b) => {
      const g = b.map.goal, r = b.robot;
      if (r.x > g.x && r.x < g.x + g.w && r.y > g.y && r.y < g.y + g.h) return { state: 'pass', msg: `Goal reached in ${(b.time / 1000).toFixed(1)} s with ${b.collisions} bumps!` };
      if (b.time > 120000) return { state: 'fail', msg: 'Time up! Try a different turning rule or speed.' };
      return { state: 'running', msg: `${(b.time / 1000).toFixed(0)} s · ${b.collisions} bumps` };
    },
    starter: `${PINMAP}
${PIN_DEFINES}
void setup() {
${SETUP_PINS}
}

void loop() {
  long d = readDistance();
  // TODO: design your own strategy to reach the goal
  if (d < 25) { motors(150, -150); delay(300); }
  else motors(160, 160);
  delay(30);
}
${DISTANCE_FN}
${MOTOR_HELPERS}`,
    solution: `${PINMAP}
${PIN_DEFINES}
// Route plan: at each wall turn Right, Right, Left, Left (look at the map!)
char plan[] = "RRLL";
int step = 0;

void setup() {
${SETUP_PINS}
}

void loop() {
  long d = readDistance();
  if (d < 25 && step < 4) {
    motors(0, 0); delay(150);
    if (plan[step] == 'R') motors(160, -160); else motors(-160, 160);
    delay(420);                        // about a 90° turn
    motors(0, 0); delay(100);
    step++;
  } else {
    motors(170, 170);
  }
  delay(20);
}
${DISTANCE_FN}
${MOTOR_HELPERS}`,
  },
  {
    id: 'pid', title: 'PID Line Follower', badge: 'Class 11 — control systems', classes: ['class_11', 'class_10'],
    desc: 'Use the analog sensor array and a PID controller to complete a lap of the wavy track in under 30 seconds.',
    learn: 'error = right − left sensor reading. correction = Kp·error + Ki·Σerror + Kd·Δerror. Add the correction to one wheel and subtract it from the other.',
    map: () => { const pts = wavy(); return { size: [300, 240], floor: 'white', line: { pts, closed: true, width: 3 }, start: { x: pts[0][0], y: pts[0][1], a: Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]) } }; },
    init: (b) => lapTracker(b.map.line.pts, 8),
    evaluate: (b, st) => lapEval(b, st, 30000, 'PID tuned!'),
    starter: `${PINMAP}
const int ENA = 5, IN1 = 4, IN2 = 7, ENB = 6, IN3 = 8, IN4 = 12;
float Kp = 0.0, Ki = 0.0, Kd = 0.0;   // TODO: tune these (try Kp first)
float integral = 0, lastError = 0;
int baseSpeed = 150;

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int L = analogRead(A0), C = analogRead(A1), R = analogRead(A2);
  float error = R - L;                // > 0 → line is to the right
  integral += error;
  float derivative = error - lastError;
  float correction = Kp * error + Ki * integral + Kd * derivative;
  lastError = error;
  motors(baseSpeed + correction, baseSpeed - correction);
  delay(5);
}
${MOTOR_HELPERS}`,
    solution: `${PINMAP}
const int ENA = 5, IN1 = 4, IN2 = 7, ENB = 6, IN3 = 8, IN4 = 12;
float Kp = 0.35, Ki = 0.0, Kd = 1.6;
float lastError = 0;
int baseSpeed = 175;

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int L = analogRead(A0), C = analogRead(A1), R = analogRead(A2);
  float error = R - L;
  float derivative = error - lastError;
  float correction = Kp * error + Kd * derivative;
  lastError = error;
  motors(constrain(baseSpeed + correction, -255, 255), constrain(baseSpeed - correction, -255, 255));
  delay(5);
}
${MOTOR_HELPERS}`,
  },
  ARM_TASK,
  {
    id: 'free', title: 'Playground', badge: 'Free practice', classes: ['class_9', 'class_10', 'class_11'],
    desc: 'A track and some obstacles — try anything. There is no pass or fail here.',
    learn: 'Use the Serial tab to print sensor values while you experiment.',
    map: () => { const pts = stadium(200, 120); return { size: [320, 260], floor: 'white', walls: true, line: { pts, closed: true, width: 3 }, obstacles: [{ x: -20, y: 80, w: 30, h: 20 }], start: { x: pts[0][0], y: pts[0][1], a: 0 } }; },
    init: () => ({}),
    evaluate: (b) => ({ state: 'running', msg: `${(b.robot.distance / 100).toFixed(1)} m driven` }),
    starter: `${PINMAP}
${PIN_DEFINES}
void setup() {
${SETUP_PINS}
}

void loop() {
  motors(150, 120);   // gentle curve
  Serial.print("Left IR: "); Serial.print(digitalRead(IR_LEFT));
  Serial.print("  Distance: "); Serial.println(readDistance());
  delay(200);
}
${DISTANCE_FN}
${MOTOR_HELPERS}`,
    solution: null,
  },
];

export const getTask = (id) => TASKS.find(t => t.id === id);
export { P as PINS };
