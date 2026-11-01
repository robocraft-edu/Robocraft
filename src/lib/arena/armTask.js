// The robotic-arm lab: a stationary 4-servo arm on a table, cubes already waiting
// on it, and an empty tray to put them in. Also the sketch pieces that student-
// designed arm robots start from.
import { armMap } from './world';

export const ARM_SKELETON = `#include <Servo.h>
// ── Robotic arm pin map ──
const int BASE_PIN = 3, SHOULDER_PIN = 5, ELBOW_PIN = 6, GRIP_PIN = 11;   // four servos
const int TRIG = 9, ECHO = 10, LED = 13, BUZZER = A4;                     // sensor on the base
Servo base, shoulder, elbow, grip;
// base      90 = straight ahead, 0..180 swings right..left
// shoulder  90 = upright, smaller = leans forward
// elbow    180 = straight, smaller = more bent
// grip       0 = open, 90 = closed

void pose(int b, int s, int e, int ms) {   // move the arm, then wait for it to arrive
  base.write(b); shoulder.write(s); elbow.write(e);
  delay(ms);
}

long readDistance() {                      // centimetres, 400 = nothing ahead
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);
  if (t == 0) return 400;
  return t * 0.0343 / 2;
}

void armSetup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(LED, OUTPUT); pinMode(BUZZER, OUTPUT);
  base.attach(BASE_PIN); shoulder.attach(SHOULDER_PIN);
  elbow.attach(ELBOW_PIN); grip.attach(GRIP_PIN);
  Serial.begin(9600);
}
`;

const PICK_AND_PLACE = `// Poses (base, shoulder, elbow) that reach 20 cm out:
//   hover  = 92, 67  (gripper above the table)    pick = 62, 63  (gripper at table height)
void pickAndPlace(int slot, int drop) {
  pose(slot, 92, 67, 700);                 // hover above the cube
  if (readDistance() > 40) return;         // nothing here, skip it
  digitalWrite(LED, HIGH);
  grip.write(0);                           // open
  pose(slot, 62, 63, 900);                 // lower to the cube
  grip.write(90); delay(500);              // close: grab it
  pose(slot, 92, 67, 800);                 // lift
  pose(drop, 92, 67, 1000);                // swing over the tray
  pose(drop, 65, 62, 800);                 // lower into the tray
  grip.write(0); delay(400);               // let go
  pose(drop, 92, 67, 700);                 // back up
  digitalWrite(LED, LOW);
}
`;

const SOLUTION = `${ARM_SKELETON}
${PICK_AND_PLACE}
void setup() {
  armSetup();
  grip.write(0);
  pose(90, 92, 67, 800);
}

void loop() {
  pickAndPlace(60, 153);    // right cube  -> first spot in the tray
  pickAndPlace(90, 165);    // middle cube -> middle of the tray
  pickAndPlace(120, 177);   // left cube   -> last spot
  pose(90, 92, 67, 500);
  while (true) { delay(1000); }   // done: all cubes moved
}
`;

const STARTER = `${ARM_SKELETON}
void setup() {
  armSetup();
  grip.write(0);                // open
  pose(90, 92, 67, 800);        // hover in front of the base
}

// The three cubes sit 20 cm from the base at base angles 60, 90 and 120.
// The tray is on the left, around base angle 165 (spots 153, 165 and 177 keep cubes apart).
// Hover pose: pose(angle, 92, 67, 700)    Table height: pose(angle, 62, 63, 900)
// Try it: lower onto the middle cube, close the gripper, lift, swing to 165, lower, open.
void loop() {
  Serial.print("Distance ahead: "); Serial.println(readDistance());
  delay(500);
}
`;

export const ARM_TASK = {
  id: 'arm', title: 'Robotic Arm: Pick and Place', badge: 'Class 11 — robotics', classes: ['class_9', 'class_10', 'class_11'], body: 'arm',
  desc: 'Three cubes are waiting on the table. Use the 4-servo arm to pick each one up and put it in the tray.',
  learn: 'Each joint is a servo. The base turns the whole arm, the shoulder and elbow reach out and down, and the gripper opens at 0° and closes at 90°. A pick-and-place is just a list of poses: hover, lower, grab, lift, swing, lower, release.',
  map: armMap,
  init: () => ({}),
  evaluate: (b) => {
    const A = b.arm, total = A.objs.length;
    if (A.placed >= total) return { state: 'pass', msg: `All ${total} cubes are in the tray in ${(b.time / 1000).toFixed(1)} s — nice pick-and-place!` };
    if (b.time > 120000) return { state: 'fail', msg: `Time is up: ${A.placed} of ${total} cubes reached the tray. Try shorter pauses.` };
    return { state: 'running', msg: `${A.placed} of ${total} cubes in the tray${A.held >= 0 ? ' · holding one' : ''}` };
  },
  starter: STARTER,
  solution: SOLUTION,
};

export const ARM_OFFLINE_CODE = SOLUTION;
export const ARM_PICK_AND_PLACE = PICK_AND_PLACE;
