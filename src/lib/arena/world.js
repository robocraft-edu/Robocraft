// 2-D physics for the robot arena (rendered in 3-D by ArenaView).
// Units: centimetres, seconds, radians. y axis points "up" on the floor plan.
import { SimBoard } from '@/lib/arduino/runtime';

export const ROBOT_PINS = {
  ENA: 5, IN1: 4, IN2: 7,      // left motor (L298N)
  ENB: 6, IN3: 8, IN4: 12,     // right motor
  IR_LEFT: 2, IR_RIGHT: 3,     // digital IR (HIGH = black line / no floor)
  TRIG: 9, ECHO: 10,           // HC-SR04 ultrasonic
  SERVO: 11, LED: 13, BUZZER: 18, // A4
  LINE_L: 14, LINE_C: 15, LINE_R: 16, // analog IR array A0, A1, A2 (high = black)
};

// ── Robotic arm (stationary, on a table) ─────────────────────────────────────
// Four hobby servos: base turns the arm, shoulder and elbow lift it, the gripper
// opens (0°) and closes (90°). Angles are the servo angles the sketch writes.
export const ARM_PINS = { BASE: 3, SHOULDER: 5, ELBOW: 6, GRIP: 11, TRIG: 9, ECHO: 10, LED: 13, BUZZER: 18 };
export const ARM = {
  L1: 16, L2: 22, H0: 6,           // upper arm, forearm incl. gripper, shoulder height (cm)
  cube: 4, closedAt: 55, rate: 220, // cube edge (cm), grip counts as closed above this angle, servo speed °/s
  grabReach: 4.5, grabHeight: 3.5,
};
export const ARM_HOME = { base: 90, shoulder: 90, elbow: 150, grip: 0 };

/** Where the gripper tip is for a set of servo angles. */
export function armTip(a) {
  const p1 = ((90 - a.shoulder) * Math.PI) / 180;
  const p2 = p1 + ((180 - a.elbow) * Math.PI) / 180;
  const r = ARM.L1 * Math.sin(p1) + ARM.L2 * Math.sin(p2);
  const z = ARM.H0 + ARM.L1 * Math.cos(p1) + ARM.L2 * Math.cos(p2);
  const yaw = ((a.base - 90) * Math.PI) / 180;
  return { x: r * Math.cos(yaw), y: r * Math.sin(yaw), z, r, yaw };
}

/** Three cubes waiting on the table and an empty tray to put them in. */
export function armMap() {
  const at = (deg, r) => ({ x: r * Math.cos((deg * Math.PI) / 180), y: r * Math.sin((deg * Math.PI) / 180) });
  return {
    size: [120, 120], floor: 'white', start: { x: 0, y: 0, a: 0 },
    arm: {
      objects: [
        { ...at(-30, 20), color: 0xef4444 }, { ...at(0, 20), color: 0x3b82f6 }, { ...at(30, 20), color: 0xfacc15 },
      ],
      tray: { ...at(70, 20), half: 8.5 },
    },
  };
}

export const ROBOT = { length: 16, width: 12, track: 12, radius: 7.5, maxSpeed: 40, deadband: 45 };

// ── geometry helpers ──
export function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const L = dx * dx + dy * dy;
  let t = L ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}
export function distToPolyline(px, py, pts, closed) {
  let d = Infinity;
  const n = pts.length;
  for (let i = 0; i < n - (closed ? 0 : 1); i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    d = Math.min(d, distToSegment(px, py, a[0], a[1], b[0], b[1]));
  }
  return d;
}
// Ray vs axis-aligned rectangle {x, y, w, h} (x,y = min corner)
function rayRect(ox, oy, dx, dy, r) {
  let tmin = -Infinity, tmax = Infinity;
  for (const [o, d, lo, hi] of [[ox, dx, r.x, r.x + r.w], [oy, dy, r.y, r.y + r.h]]) {
    if (Math.abs(d) < 1e-9) { if (o < lo || o > hi) return Infinity; }
    else {
      let t1 = (lo - o) / d, t2 = (hi - o) / d;
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
      if (tmin > tmax) return Infinity;
    }
  }
  if (tmax < 0) return Infinity;
  return tmin >= 0 ? tmin : Infinity;
}
function circleRect(cx, cy, rad, r) {
  const nx = Math.max(r.x, Math.min(cx, r.x + r.w)), ny = Math.max(r.y, Math.min(cy, r.y + r.h));
  return Math.hypot(cx - nx, cy - ny) < rad;
}

/**
 * World: map = { size:[w,h], floor:'white'|'table', line:{pts, closed, width}, table:{x,y,w,h},
 *   obstacles:[{x,y,w,h}], walls:true, goal:{x,y,w,h}, start:{x,y,a}, bin:true }
 */
export class ArenaBoard extends SimBoard {
  constructor(map) {
    super();
    this.map = map;
    this.reset();
  }
  reset() {
    const s = this.map.start || { x: 0, y: 0, a: 0 };
    this.robot = { x: s.x, y: s.y, a: s.a, vl: 0, vr: 0, fallen: false, collided: false, distance: 0 };
    this.time = 0; this.trail = []; this.collisions = 0;
    this.mode = {}; this.out = {}; this.pwm = {}; this.servo = {}; this.tones = {}; this.lastTrigger = {}; this.serialLines = [];
    this.hand = null; this.lid = 0;
    this.arm = this.map.arm ? this.initArm() : null;
  }
  // robot-frame point → world
  toWorld(fx, fy) {
    const { x, y, a } = this.robot;
    return [x + fx * Math.cos(a) - fy * Math.sin(a), y + fx * Math.sin(a) + fy * Math.cos(a)];
  }
  onLine(px, py) {
    const L = this.map.line;
    if (!L) return 0;
    const d = distToPolyline(px, py, L.pts, L.closed);
    return Math.max(0, Math.min(1, (L.width / 2 + 0.6 - d) / 1.2)); // 1 = fully on black, soft edge
  }
  onTable(px, py) {
    const T = this.map.table;
    if (!T) return true;
    return px >= T.x && px <= T.x + T.w && py >= T.y && py <= T.y + T.h;
  }
  // Digital IR: HIGH (1) when there is no reflection — black line or no floor.
  readDigital(pin) {
    if (pin === ROBOT_PINS.IR_LEFT || pin === ROBOT_PINS.IR_RIGHT) {
      const side = pin === ROBOT_PINS.IR_LEFT ? 3.5 : -3.5;
      const [px, py] = this.toWorld(ROBOT.length / 2, side);
      if (this.map.table) return this.onTable(px, py) ? 0 : 1;
      return this.onLine(px, py) > 0.5 ? 1 : 0;
    }
    if (pin === ROBOT_PINS.ECHO) return 0;
    return undefined;
  }
  readAnalog(pin) {
    const off = { [ROBOT_PINS.LINE_L]: 2.5, [ROBOT_PINS.LINE_C]: 0, [ROBOT_PINS.LINE_R]: -2.5 }[pin];
    if (off === undefined) return 512;
    const [px, py] = this.toWorld(ROBOT.length / 2, off);
    let v;
    if (this.map.table) v = this.onTable(px, py) ? 80 : 1000;
    else {
      // soft response: strongest at the line centre
      const L = this.map.line;
      const d = L ? distToPolyline(px, py, L.pts, L.closed) : 99;
      const k = Math.max(0, 1 - Math.max(0, d - L.width / 2 + 1.5) / 3);
      v = 80 + 860 * k;
    }
    return v + (Math.random() - 0.5) * 16; // a little sensor noise
  }
  sonarDistance() {
    if (this.map.bin) return this.hand ?? 300;
    if (this.map.arm) return this.armSonar();
    const [ox, oy] = this.toWorld(ROBOT.length / 2, 0);
    let best = 400;
    for (const da of [-0.4, -0.2, 0, 0.2, 0.4]) {
      const a = this.robot.a + da, dx = Math.cos(a), dy = Math.sin(a);
      for (const r of this.solids()) best = Math.min(best, rayRect(ox, oy, dx, dy, r));
    }
    return Math.max(2, best);
  }
  echoMicros(pin) {
    if (pin !== ROBOT_PINS.ECHO) return 0;
    const fired = this.lastTrigger[ROBOT_PINS.TRIG] !== undefined && this.t - this.lastTrigger[ROBOT_PINS.TRIG] < 50;
    if (!fired) return 0;
    delete this.lastTrigger[ROBOT_PINS.TRIG];
    const d = this.sonarDistance();
    if (d >= 400) return 0; // out of range → timeout
    return (2 * d) / 0.0343;
  }
  solids() {
    const list = [...(this.map.obstacles || [])];
    if (this.map.walls) {
      const [W, H] = this.map.size;
      list.push({ x: -W / 2 - 10, y: -H / 2 - 10, w: W + 20, h: 10 }, { x: -W / 2 - 10, y: H / 2, w: W + 20, h: 10 },
        { x: -W / 2 - 10, y: -H / 2, w: 10, h: H }, { x: W / 2, y: -H / 2, w: 10, h: H });
    }
    return list;
  }
  motorSpeed(en, a, b) {
    const dirA = this.out[a] || 0, dirB = this.out[b] || 0;
    const dir = dirA && !dirB ? 1 : !dirA && dirB ? -1 : 0;
    const level = this.pwm[en] === undefined ? 255 : this.pwm[en]; // EN jumper = full speed
    if (level < ROBOT.deadband) return 0; // motors stall at low PWM
    return dir * (level / 255) * ROBOT.maxSpeed;
  }
  step(dtMs) {
    const dt = dtMs / 1000;
    this.time += dtMs;
    if (this.map.bin) { this.stepBin(dtMs); return; }
    if (this.map.arm) { this.stepArm(dtMs); return; }
    const r = this.robot;
    if (r.fallen) return;
    const P = ROBOT_PINS;
    const target = [this.motorSpeed(P.ENA, P.IN1, P.IN2), this.motorSpeed(P.ENB, P.IN3, P.IN4)];
    // first-order motor response (~80 ms)
    const k = Math.min(1, dt / 0.08);
    r.vl += (target[0] - r.vl) * k; r.vr += (target[1] - r.vr) * k;
    const v = (r.vl + r.vr) / 2, w = (r.vr - r.vl) / ROBOT.track;
    const na = r.a + w * dt;
    const nx = r.x + v * Math.cos(na) * dt, ny = r.y + v * Math.sin(na) * dt;
    const solids = this.solids();
    const blocked = (x, y) => solids.some(o => circleRect(x, y, ROBOT.radius, o));
    const hit = blocked(nx, ny);
    if (hit) {
      if (!r.touching) { this.collisions++; r.touching = true; }
      r.a = na; // can still turn on the spot
      // slide along the wall if only one direction is blocked
      if (!blocked(nx, r.y)) { r.distance += Math.abs(nx - r.x); r.x = nx; }
      else if (!blocked(r.x, ny)) { r.distance += Math.abs(ny - r.y); r.y = ny; }
    } else {
      r.touching = false;
      r.distance += Math.hypot(nx - r.x, ny - r.y);
      r.x = nx; r.y = ny; r.a = na;
    }
    if (this.map.table && !this.onTable(r.x, r.y)) r.fallen = true;
    if (this.time % 100 < dtMs) { this.trail.push([r.x, r.y]); if (this.trail.length > 600) this.trail.shift(); }
  }
  // ── robotic arm ──
  initArm() {
    const m = this.map.arm;
    return {
      ang: { ...ARM_HOME }, held: -1, wasClosed: false, placed: 0, drops: 0,
      objs: m.objects.map((o, i) => ({ id: i, x: o.x, y: o.y, z: ARM.cube / 2, vz: 0, color: o.color, placed: false, free: false })),
    };
  }
  armTipNow() { return armTip(this.arm.ang); }
  // The ultrasonic sensor sits on the base and turns with it: how far to the nearest cube it points at.
  armSonar() {
    const A = this.arm, yaw = ((A.ang.base - 90) * Math.PI) / 180;
    const dx = Math.cos(yaw), dy = Math.sin(yaw);
    let best = 400;
    for (const o of A.objs) {
      if (A.held === o.id) continue;
      const along = o.x * dx + o.y * dy, side = Math.abs(-o.x * dy + o.y * dx);
      if (along > 3 && side < ARM.cube / 2 + 1) best = Math.min(best, along - ARM.cube / 2);
    }
    return Math.max(2, best);
  }
  stepArm(dtMs) {
    const A = this.arm, P = ARM_PINS, dt = dtMs / 1000;
    const want = {
      base: this.servo[P.BASE] ?? ARM_HOME.base, shoulder: this.servo[P.SHOULDER] ?? ARM_HOME.shoulder,
      elbow: this.servo[P.ELBOW] ?? ARM_HOME.elbow, grip: this.servo[P.GRIP] ?? ARM_HOME.grip,
    };
    const rate = ARM.rate * dt;
    for (const k of Object.keys(want)) A.ang[k] += Math.max(-rate, Math.min(rate, want[k] - A.ang[k]));
    const tip = armTip(A.ang);
    const closed = A.ang.grip >= ARM.closedAt;
    if (closed && !A.wasClosed && A.held < 0) {
      let best = -1, bd = Infinity;
      for (const o of A.objs) {
        const d = Math.hypot(o.x - tip.x, o.y - tip.y);
        if (d < ARM.grabReach && Math.abs(o.z - tip.z) < ARM.grabHeight && d < bd) { bd = d; best = o.id; }
      }
      if (best >= 0) { A.held = best; A.objs[best].free = false; A.objs[best].placed = false; }
    }
    if (!closed && A.held >= 0) { A.objs[A.held].free = true; A.objs[A.held].vz = 0; A.held = -1; }
    A.wasClosed = closed;
    const T = this.map.arm.tray;
    for (const o of A.objs) {
      if (A.held === o.id) { o.x = tip.x; o.y = tip.y; o.z = tip.z; continue; }
      const inTray = Math.abs(o.x - T.x) < T.half && Math.abs(o.y - T.y) < T.half;
      const floor = (inTray ? 0.6 : 0) + ARM.cube / 2;
      if (o.z > floor) { o.vz -= 300 * dt; o.z = Math.max(floor, o.z + o.vz * dt); if (o.z === floor) o.vz = 0; }
      else o.z = floor;
      o.placed = inTray && o.z <= floor + 0.01;
    }
    A.placed = A.objs.filter(o => o.placed).length;
  }

  // Smart waste bin: a hand moves towards and away from the lid sensor.
  stepBin(dtMs) {
    const cycle = this.map.handCycle || 7000;
    const t = this.time % cycle;
    // far (70 cm) → near (8 cm) between 1.5 s and 2.5 s, stays 1.5 s, leaves
    let d;
    if (t < 1500) d = 70; else if (t < 2500) d = 70 - (t - 1500) / 1000 * 62; else if (t < 4000) d = 8; else if (t < 5000) d = 8 + (t - 4000) / 1000 * 62; else d = 70;
    this.hand = d;
    const target = this.servo[ROBOT_PINS.SERVO] ?? 0;
    const maxStep = (dtMs / 1000) * 300; // servo speed 300°/s
    this.lid += Math.max(-maxStep, Math.min(maxStep, target - this.lid));
  }
}
