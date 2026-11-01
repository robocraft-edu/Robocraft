// Realistic 3-D models of the lab's electronic parts, built from plain three.js
// shapes (no model files, nothing to download).
//
// Units are millimetres, +y is up, and every part stands on y = 0 with its
// footprint centred on the origin — so an Arduino Uno really is 68.6 × 53.4 mm.
//
//   const part = buildPart3D('led');
//   part.group     THREE.Group to add to a scene (scale it for your world)
//   part.pins      { pinId: Vector3 } — where each lead really ends, in group space
//   part.size      { x, y, z } bounding size in mm
//   part.mats      named materials a host may drive (e.g. the LED's epoxy)
//   part.update(s) apply live state: { ledOn, brightness, rgb, servoAngle,
//                  motorAngle, buzzerOn, knob, pressed }
import * as THREE from 'three';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

function mat(color, o = {}) {
  const { rough = 0.55, metal = 0.05, ...rest } = o;
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...rest });
}
const steel = () => mat(0xc9d0da, { rough: 0.28, metal: 0.9 });
const gold = () => mat(0xd9ab2f, { rough: 0.32, metal: 0.9 });
const black = () => mat(0x15181d, { rough: 0.6 });

function box(w, h, d, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z);
  return o;
}
/** Cylinder standing on its own y axis. */
function cyl(r, h, m, x = 0, y = 0, z = 0, seg = 28, rTop = r) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(rTop, r, h, seg), m);
  o.position.set(x, y, z);
  return o;
}
/** Rotate a mesh a quarter turn about x or z and hand it back. */
const rotx = (o) => { o.rotation.x = Math.PI / 2; return o; };
const rotz = (o) => { o.rotation.z = Math.PI / 2; return o; };
/** Round wire or lead following a smooth path of [x, y, z] points. */
function tube(pts, r, m) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V(p[0], p[1], p[2])), false, 'catmullrom', 0.15);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(10, pts.length * 12), r, 8, false), m);
}
function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
/** A printed label lying flat on a face (canvas top = the −z edge). */
function decal(w, d, tex, y, x = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, y, z);
  return m;
}
function lathe(profile, m, seg = 36) {
  return new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg), m);
}
/** Row of 2.54 mm header sockets; returns the group and each pin's x. */
function header(n, y0, z, xStart, mats, h = 8.5, pitch = 2.54) {
  const g = new THREE.Group();
  g.add(box(n * pitch, h, 2.54, mats.black, xStart + ((n - 1) * pitch) / 2, y0 + h / 2, z));
  const xs = [];
  for (let i = 0; i < n; i++) {
    const x = xStart + i * pitch;
    xs.push(x);
    g.add(box(1, 0.2, 1, mats.hole, x, y0 + h + 0.05, z));
  }
  return { group: g, xs, top: y0 + h };
}
function pinRow(n, y, z, xStart, pitch, m, len = 6) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) g.add(box(0.64, len, 0.64, m, xStart + i * pitch, y + len / 2, z));
  return g;
}
const noop = () => {};
function finish(group, size, pins, extra = {}) {
  group.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group, size, pins, mats: {}, update: noop, ...extra };
}

// ───────────────────────────── boards ─────────────────────────────
function arduinoUno() {
  const g = new THREE.Group();
  const M = { black: black(), hole: mat(0x2a2f38), steel: steel(), gold: gold() };
  const pcb = mat(0x0b7e88, { rough: 0.5 });
  const W = 68.6, D = 53.4;
  g.add(box(W, 1.6, D, pcb, 0, 0.8, 0));
  // silkscreen
  g.add(decal(W, D, canvasTexture(1028, 800, (c, w, h) => {
    c.fillStyle = '#eafcff'; c.textAlign = 'center';
    c.font = '700 74px system-ui, sans-serif'; c.fillText('ARDUINO', w * 0.62, h * 0.82);
    c.font = '600 44px system-ui, sans-serif'; c.fillText('UNO R3', w * 0.62, h * 0.92);
    c.strokeStyle = '#eafcff'; c.lineWidth = 10;
    c.beginPath(); c.arc(w * 0.46, h * 0.64, 28, 0, Math.PI * 2); c.moveTo(w * 0.46 + 28, h * 0.64); c.arc(w * 0.46 + 56, h * 0.64, 28, Math.PI, Math.PI * 3); c.stroke();
    c.font = '600 22px system-ui, sans-serif'; c.fillText('DIGITAL (PWM~)', w * 0.6, h * 0.13); c.fillText('POWER', w * 0.28, h * 0.87); c.fillText('ANALOG IN', w * 0.78, h * 0.87);
  }), 1.62));
  const top = header(8, 1.6, -24.2, 12.22, M);                          // D7..D0 (x increases towards D0)
  const top2 = header(10, 1.6, -24.2, -17.24, M);                       // SCL SDA AREF GND D13..D8
  const pw = header(8, 1.6, 24.2, -12.5, M);                            // NC IOREF RESET 3V3 5V GND GND VIN
  const an = header(6, 1.6, 24.2, 10.9, M);                             // A0..A5
  [top, top2, pw, an].forEach(h => g.add(h.group));
  // USB-B, barrel jack, regulator, caps
  g.add(box(12, 10.9, 16.3, M.steel, -29.6, 1.6 + 5.45, -12.5));
  g.add(box(10, 6.5, 12, mat(0x9aa4b0, { rough: 0.4, metal: 0.6 }), -27.5, 1.6 + 5.45, -12.5));
  g.add(box(14.2, 10.7, 9, mat(0x101216), -27.2, 1.6 + 5.35, 19));
  g.add(rotz(cyl(2.3, 9, mat(0x050607), -29.2, 1.6 + 5.35, 19, 20)));
  g.add(box(9, 4, 10, M.black, -22, 1.6 + 2, 8));
  for (const z of [4, 12]) {
    g.add(cyl(3.1, 6, mat(0x1b1d22), -16, 1.6 + 3, z, 20));
    g.add(cyl(2.9, 0.3, mat(0xb8bec8, { metal: 0.8, rough: 0.3 }), -16, 1.6 + 6.1, z, 20));
  }
  // ATmega328P (DIP-28), 16 MHz crystal, USB chip, reset button
  g.add(box(35, 3.5, 7.6, mat(0x0f1114, { rough: 0.45 }), 12, 1.6 + 1.75 + 1.4, 6));
  for (const dz of [-4.3, 4.3]) g.add(box(33, 1.3, 0.8, M.steel, 12, 1.6 + 0.7, 6 + dz));
  g.add(decal(26, 5, canvasTexture(512, 100, (c, w, h) => { c.fillStyle = '#7d8794'; c.font = '600 46px monospace'; c.textAlign = 'center'; c.fillText('ATMEGA328P', w / 2, h * 0.7); }), 1.6 + 1.75 + 1.4 + 1.76, 12, 6));
  g.add(box(11, 4.4, 4.6, M.steel, -4, 1.6 + 2.2, 11));
  g.add(box(7, 1.2, 7, mat(0x14161a), -21, 1.6 + 0.6, -11));
  g.add(box(6, 3.4, 6, M.steel, -26, 1.6 + 1.7, -21));
  g.add(cyl(1.6, 1.2, mat(0xd63a3a, { rough: 0.4 }), -26, 1.6 + 3.9, -21, 16));
  // status LEDs and ICSP pins
  g.add(box(1.8, 0.8, 1, mat(0x35e06a, { emissive: 0x0b5a1f }), 4, 1.6 + 0.4, -17));
  g.add(box(1.8, 0.8, 1, mat(0xf0a020, { emissive: 0x4a2c00 }), 7, 1.6 + 0.4, -17));
  g.add(pinRow(3, 1.6, -1.27, 29.5, 2.54, M.gold, 3));
  g.add(pinRow(3, 1.6, 1.27, 29.5, 2.54, M.gold, 3));
  for (const [x, z] of [[-30.5, 0], [-33.5, 22.5], [30.5, -23.5], [28, 22]]) g.add(cyl(1.7, 0.4, mat(0x050607), x, 1.8, z, 16));
  const pins = {};
  // D0 is the right-most pin; D8 sits after the 6.6 mm gap
  for (let i = 0; i <= 7; i++) pins['D' + i] = V(30.0 - i * 2.54, top.top + 0.4, -24.2);
  [8, 9, 10, 11, 12, 13].forEach((d, i) => { pins['D' + d] = V(top2.xs[9 - i], top2.top + 0.4, -24.2); });
  pins.REF = V(top2.xs[2], top2.top + 0.4, -24.2);
  ['NC', 'IOREF', 'RST', '3V3', '5V', 'GND', 'GND2', 'VIN'].forEach((id, i) => { pins[id] = V(pw.xs[i], pw.top + 0.4, 24.2); });
  for (let i = 0; i <= 5; i++) pins['A' + i] = V(an.xs[i], an.top + 0.4, 24.2);
  return finish(g, { x: W, y: 10.1, z: D }, pins);
}

function arduinoNano() {
  const g = new THREE.Group();
  const W = 43.2, D = 18.5;
  g.add(box(W, 1.4, D, mat(0x1b4fb8, { rough: 0.5 }), 0, 0.7, 0));
  g.add(box(8, 3, 7.5, steel(), -W / 2 + 3, 1.4 + 1.5, 0));
  g.add(box(9, 1.2, 9, mat(0x101216), 2, 1.4 + 0.6, 0));
  g.add(box(4, 1.2, 12, mat(0x15181d), 14, 1.4 + 0.6, 0));
  const gd = gold();
  const pins = {};
  const top = ['D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2'];
  const bot = ['D13', '3V3', 'REF', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', '5V', 'GND', 'VIN'];
  top.forEach((id, i) => { const x = -W / 2 + 6 + i * 2.54; g.add(box(0.7, 6, 0.7, gd, x, 3, -D / 2 + 1.2)); pins[id] = V(x, 6, -D / 2 + 1.2); });
  bot.forEach((id, i) => { const x = -W / 2 + 4 + i * 2.54; g.add(box(0.7, 6, 0.7, gd, x, 3, D / 2 - 1.2)); pins[id] = V(x, 6, D / 2 - 1.2); });
  return finish(g, { x: W, y: 6, z: D }, pins);
}

function esp32() {
  const g = new THREE.Group();
  const W = 52, D = 28;
  g.add(box(W, 1.4, D, mat(0x14161a, { rough: 0.5 }), 0, 0.7, 0));
  g.add(box(18, 3, 25.5, mat(0xb2bac6, { rough: 0.3, metal: 0.8 }), -W / 2 + 14, 1.4 + 1.5, 0));
  g.add(box(10, 0.3, 24, mat(0xd4a72c, { metal: 0.6 }), -W / 2 + 28, 1.4 + 0.15, 0));
  g.add(box(8, 3, 7, steel(), W / 2 - 3, 1.4 + 1.5, 0));
  const gd = gold();
  const pins = {};
  const top = ['D2', 'D4', 'D5', 'D12', 'D13', 'D14', 'D15', 'D18', 'D19', 'D21', 'D22', 'D23'];
  const bot = ['A34', 'A35', 'A32', 'A33', 'A36', 'A39', '3V3', 'GND', 'GND2', 'VIN', 'EN'];
  top.forEach((id, i) => { const x = -W / 2 + 5 + i * 2.54 * 1.5; g.add(box(0.7, 6, 0.7, gd, x, 3, -D / 2 + 1.2)); pins[id] = V(x, 6, -D / 2 + 1.2); });
  bot.forEach((id, i) => { const x = -W / 2 + 5 + i * 2.54 * 1.6; g.add(box(0.7, 6, 0.7, gd, x, 3, D / 2 - 1.2)); pins[id] = V(x, 6, D / 2 - 1.2); });
  return finish(g, { x: W, y: 6, z: D }, pins);
}

function breadboard() {
  const g = new THREE.Group();
  const W = 165, D = 55, H = 8.5;
  g.add(box(W, H, D, mat(0xf1f1ec, { rough: 0.7 }), 0, H / 2, 0));
  g.add(box(W - 4, 0.4, 3.2, mat(0xd8dadd), 0, H + 0.05, 0));
  // holes: two 5-hole strips and four power rails, as one instanced mesh
  const holeGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5), holeMat = mat(0x262a31);
  const spots = [];
  for (let c = 0; c < 63; c++) {
    const x = -W / 2 + 6 + c * 2.54;
    for (let r = 0; r < 5; r++) { spots.push([x, -5.5 - r * 2.54 - 2]); spots.push([x, 5.5 + r * 2.54 + 2]); }
  }
  for (const z of [-D / 2 + 3.5, -D / 2 + 6.1, D / 2 - 6.1, D / 2 - 3.5]) for (let c = 0; c < 50; c++) spots.push([-W / 2 + 12 + c * 2.54 + Math.floor(c / 5) * 1.3, z]);
  const inst = new THREE.InstancedMesh(holeGeo, holeMat, spots.length);
  const m4 = new THREE.Matrix4();
  spots.forEach(([x, z], i) => { m4.setPosition(x, H + 0.1, z); inst.setMatrixAt(i, m4); });
  g.add(inst);
  for (const [z, col] of [[-D / 2 + 1.6, 0xd63a3a], [-D / 2 + 7.9, 0x2563eb], [D / 2 - 7.9, 0xd63a3a], [D / 2 - 1.6, 0x2563eb]]) g.add(box(W - 12, 0.1, 0.4, mat(col), 0, H + 0.08, z));
  const pins = { r1: V(-W / 2 + 12, H + 1, -D / 2 + 3.5), r2: V(-W / 2 + 12, H + 1, -D / 2 + 6.1), r3: V(-W / 2 + 12, H + 1, D / 2 - 6.1), r4: V(-W / 2 + 12, H + 1, D / 2 - 3.5) };
  for (let i = 1; i <= 4; i++) { pins['a' + i] = V(-W / 2 + 6 + (i - 1) * 2.54, H + 1, -8); pins['b' + i] = V(-W / 2 + 6 + (i - 1) * 2.54, H + 1, 8); }
  return finish(g, { x: W, y: H, z: D }, pins);
}

// ───────────────────────────── outputs ─────────────────────────────
function ledPart(color) {
  const g = new THREE.Group();
  const epoxy = mat(color, { rough: 0.12, transparent: true, opacity: 0.84, emissive: 0x000000 });
  const prof = [[0, 0], [2.9, 0], [2.9, 0.9], [2.5, 0.9], [2.5, 5.4]];
  for (let a = 5; a <= 90; a += 10) prof.push([2.5 * Math.cos((a * Math.PI) / 180), 5.4 + 2.5 * Math.sin((a * Math.PI) / 180)]);
  const body = lathe(prof, epoxy); body.position.y = 8; g.add(body);
  const st = steel();
  g.add(box(0.8, 3.2, 0.5, st, -0.7, 9.8, 0)); g.add(box(0.8, 4.4, 0.5, st, 0.7, 10.4, 0));  // anvil and post seen through the dome
  g.add(box(2.6, 0.5, 1.4, st, -0.7, 11.5, 0));
  const halo = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 16), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.position.y = 11.5; g.add(halo);
  g.add(tube([[-1.27, 1.6, 0], [-1.27, 4.5, 0], [-0.7, 8.2, 0]], 0.28, st));
  g.add(tube([[1.27, 0.2, 0], [1.27, 4.5, 0], [0.7, 8.2, 0]], 0.28, st));
  const hot = new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.35);
  return finish(g, { x: 5.8, y: 14, z: 5.8 }, { cathode: V(-1.27, 1.6, 0), anode: V(1.27, 0.5, 0) }, {
    mats: { led: epoxy },
    update(s = {}) {
      const on = !!s.ledOn, b = s.brightness ?? 1;
      epoxy.emissive.copy(on ? hot : new THREE.Color(0x000000));
      epoxy.emissiveIntensity = on ? 0.6 + 1.3 * b : 0;
      halo.material.opacity = on ? 0.34 * b : 0;
    },
  });
}

function rgbLed() {
  const g = new THREE.Group();
  const epoxy = mat(0xf4f7fa, { rough: 0.2, transparent: true, opacity: 0.78, emissive: 0x000000 });
  const prof = [[0, 0], [2.9, 0], [2.9, 0.9], [2.5, 0.9], [2.5, 5.4]];
  for (let a = 5; a <= 90; a += 10) prof.push([2.5 * Math.cos((a * Math.PI) / 180), 5.4 + 2.5 * Math.sin((a * Math.PI) / 180)]);
  const body = lathe(prof, epoxy); body.position.y = 8; g.add(body);
  const st = steel(), pins = {};
  const xs = [-3.81, -1.27, 1.27, 3.81];
  ['R', 'GND', 'G', 'B'].forEach((id, i) => {
    const top = (i - 1.5) * 1.2;
    g.add(tube([[xs[i], id === 'GND' ? 0.2 : 1.6, 0], [xs[i], 4, 0], [top, 8.2, 0]], 0.26, st));
    pins[id] = V(xs[i], id === 'GND' ? 0.5 : 1.6, 0);
    g.add(box(0.5, 3 + (id === 'GND' ? 1.2 : 0), 0.4, st, top, 9.8, 0));
  });
  g.add(box(3.4, 0.9, 1.2, mat(0x30343b), 0, 11.4, 0));
  const halo = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.position.y = 11.5; g.add(halo);
  return finish(g, { x: 8, y: 14, z: 5.8 }, pins, {
    mats: { led: epoxy },
    update(s = {}) {
      const [r, gg, b] = s.rgb || [0, 0, 0], mx = Math.max(r, gg, b);
      if (mx <= 0) { epoxy.emissive.setHex(0x000000); epoxy.emissiveIntensity = 0; halo.material.opacity = 0; return; }
      epoxy.emissive.setRGB(r / mx, gg / mx, b / mx);
      epoxy.emissiveIntensity = 0.5 + 1.4 * (mx / 255);
      halo.material.color.setRGB(r / mx, gg / mx, b / mx);
      halo.material.opacity = 0.34 * (mx / 255);
    },
  });
}

function resistor() {
  const g = new THREE.Group();
  const body = mat(0xe3c590, { rough: 0.65 }), st = steel();
  const prof = [];
  prof.push([0, -3.15], [1.0, -3.15], [1.3, -2.7], [1.3, -2.1], [1.0, -1.7], [0.95, 1.7], [1.3, 2.1], [1.3, 2.7], [1.0, 3.15], [0, 3.15]);
  const b = lathe(prof, body, 28); b.rotation.z = Math.PI / 2; b.position.y = 6; g.add(b);
  const bands = [[-1.55, 0xd62828], [-0.55, 0xd62828], [0.45, 0x7a4a1d], [2.1, 0xd4af37]];
  for (const [x, c] of bands) { const r = cyl(1.04, 0.5, mat(c, { rough: 0.5 }), x, 6, 0, 24); r.rotation.z = Math.PI / 2; g.add(r); }
  g.add(tube([[-3.0, 6, 0], [-5.08, 6, 0], [-5.08, 3, 0], [-5.08, 0.6, 0]], 0.3, st));
  g.add(tube([[3.0, 6, 0], [5.08, 6, 0], [5.08, 3, 0], [5.08, 0.6, 0]], 0.3, st));
  return finish(g, { x: 10.2, y: 7.3, z: 2.6 }, { a: V(-5.08, 0.6, 0), b: V(5.08, 0.6, 0) });
}

function pushButton() {
  const g = new THREE.Group();
  const st = steel();
  g.add(box(6, 3.2, 6, mat(0x20242c, { rough: 0.5 }), 0, 1.6 + 0.2, 0));
  g.add(box(6.1, 0.5, 6.1, st, 0, 3.55, 0));
  const cap = cyl(1.8, 1.8, mat(0x9aa3b1, { rough: 0.35, metal: 0.3 }), 0, 4.4, 0, 24);
  g.add(cap);
  const pins = {};
  for (const [sx, sz, id] of [[-1, -1, 'a'], [1, -1, 'b'], [-1, 1, null], [1, 1, null]]) {
    g.add(tube([[sx * 3, 2.2, sz * 2.25], [sx * 4, 1.8, sz * 2.25], [sx * 4, 0.3, sz * 2.25]], 0.3, st));
    if (id) pins[id] = V(sx * 4, 0.4, sz * 2.25);
  }
  return finish(g, { x: 8, y: 5.3, z: 6 }, pins, {
    update(s = {}) { cap.position.y = s.pressed ? 3.9 : 4.4; },
  });
}

function buzzer() {
  const g = new THREE.Group();
  const body = mat(0x0f1114, { rough: 0.4 }), st = steel();
  g.add(cyl(6, 9.5, body, 0, 4 + 4.75, 0, 40));
  g.add(cyl(5.2, 0.4, mat(0x1d2128, { rough: 0.3 }), 0, 13.7, 0, 40));
  g.add(cyl(0.9, 0.6, mat(0x000000), 0, 13.8, 0, 16));
  const ring = cyl(4.6, 0.3, mat(0x22d3ee, { emissive: 0x000000, transparent: true, opacity: 0.0 }), 0, 13.85, 0, 40);
  g.add(ring);
  g.add(box(2.4, 0.15, 0.5, mat(0xe5e7eb), 3.3, 13.95, 1)); g.add(box(0.5, 0.15, 2.4, mat(0xe5e7eb), 3.3, 13.95, 1));
  g.add(tube([[-3.81, 4.2, 0], [-3.81, 2, 0], [-3.81, 0.5, 0]], 0.32, st));
  g.add(tube([[3.81, 4.2, 0], [3.81, 2, 0], [3.81, 0.5, 0]], 0.32, st));
  return finish(g, { x: 12, y: 14, z: 12 }, { neg: V(-3.81, 0.5, 0), pos: V(3.81, 0.5, 0) }, {
    mats: { buzz: ring.material },
    update(s = {}) {
      const on = !!s.buzzerOn;
      ring.material.opacity = on ? 0.9 : 0; ring.material.emissive.setHex(on ? 0x22d3ee : 0x000000);
    },
  });
}

function servo(opts = {}) {
  const g = new THREE.Group();
  const blue = mat(0x2563eb, { rough: 0.5 }), dark = mat(0x1d4ed8, { rough: 0.5 });
  const bx = 22.5, by = 22.7, bz = 12.2;
  g.add(box(bx, by, bz, blue, 0, by / 2, 0));
  g.add(box(32.5, 2.4, bz, dark, 0, 16.5, 0));
  for (const sx of [-14.2, 14.2]) g.add(cyl(1.1, 2.6, mat(0x0b1220), sx, 16.5, 0, 12));
  g.add(cyl(5.8, 4, dark, -5.5, by + 2, 0, 28));
  g.add(cyl(2.4, 4, mat(0xdfe5ec, { rough: 0.3, metal: 0.4 }), -5.5, by + 5, 0, 18));
  const horn = new THREE.Group(); horn.position.set(-5.5, by + 7.2, 0);
  if (opts.horn !== false) {
    horn.add(box(24, 1.6, 4.4, mat(0xf4f6f9, { rough: 0.45 }), 9, 0, 0));
    horn.add(cyl(3.4, 1.6, mat(0xf4f6f9, { rough: 0.45 }), 0, 0, 0, 20));
    for (let i = 0; i < 4; i++) horn.add(cyl(0.5, 1.8, mat(0x9aa3b1), 5 + i * 5, 0, 0, 10));
  }
  g.add(horn);
  const pins = {}, cols = { SIG: 0xf59e0b, VCC: 0xdc2626, GND: 0x5b3a1e };
  [['SIG', -2.5], ['VCC', 0], ['GND', 2.5]].forEach(([id, z]) => {
    g.add(tube([[11.2, 6, z], [17, 4, z], [26, 1.6, z], [32, 0.8, z]], 0.7, mat(cols[id], { rough: 0.5 })));
    pins[id] = V(32, 0.8, z);
  });
  g.add(box(2.4, 1.6, 8.6, mat(0x111418), 11.4, 5.8, 0));
  return finish(g, { x: 32.5, y: by + 8, z: bz }, pins, {
    mats: { horn },
    update(s = {}) { horn.rotation.y = (((s.servoAngle ?? 90) - 90) * Math.PI) / 180; },
    horn,
  });
}

function dcMotor() {
  const g = new THREE.Group();
  const can = mat(0xaeb6c2, { rough: 0.32, metal: 0.85 });
  const cy0 = 10;
  const c = cyl(10, 25, can, 5, cy0, 0, 36); c.rotation.z = Math.PI / 2; g.add(c);
  const cap = cyl(10, 5, mat(0x15181d, { rough: 0.6 }), 19.5, cy0, 0, 36); cap.rotation.z = Math.PI / 2; g.add(cap);
  const boss = cyl(4, 2, can, -8.5, cy0, 0, 24); boss.rotation.z = Math.PI / 2; g.add(boss);
  const shaft = new THREE.Group(); shaft.position.set(-9, cy0, 0);
  const sh = cyl(1, 11, mat(0xe6eaf0, { rough: 0.25, metal: 0.9 }), -5, 0, 0, 16); sh.rotation.z = Math.PI / 2; shaft.add(sh);
  shaft.add(box(2, 2, 2, mat(0xef4444), -10, 0, 0));
  g.add(shaft);
  for (const z of [-4, 4]) g.add(box(5, 4.4, 0.8, gold(), 23, cy0 + z * 0 + 0, z));
  const pins = {};
  [['t1', -4, 0xdc2626], ['t2', 4, 0x1f2937]].forEach(([id, z, col]) => {
    g.add(tube([[24, cy0, z], [32, cy0 - 3, z * 1.4], [40, 1.2, z * 1.6], [48, 0.8, z * 1.6]], 0.8, mat(col, { rough: 0.5 })));
    pins[id] = V(48, 0.8, z * 1.6);
  });
  g.add(box(14, 2, 6, mat(0x0b0e12, { rough: 0.7 }), 5, 0.5, 0));
  return finish(g, { x: 60, y: 20, z: 20 }, pins, {
    update(s = {}) { shaft.rotation.x = ((s.motorAngle ?? 0) * Math.PI) / 180; },
  });
}

function gearMotor() {
  const g = new THREE.Group();
  const yel = mat(0xf7cb0b, { rough: 0.45 }), can = mat(0xb4bcc8, { rough: 0.32, metal: 0.8 });
  const gh = 18.8, gd = 22.5, gx = 37;
  g.add(box(gx, gh, gd, yel, 0, gh / 2 + 0.2, 0));
  for (const [x, y] of [[-14, 4], [-14, gh - 3.6], [14, 4], [14, gh - 3.6]]) { const s = cyl(1.3, gd + 0.6, mat(0xe0a800, { rough: 0.4 }), x, y, 0, 12); s.rotation.x = Math.PI / 2; g.add(s); }
  const shaftG = new THREE.Group(); shaftG.position.set(-9, gh / 2 + 0.2, 0);
  const sh = cyl(2.7, gd + 18, mat(0xf2f4f7, { rough: 0.35, metal: 0.2 }), 0, 0, 0, 20); sh.rotation.x = Math.PI / 2; shaftG.add(sh);
  shaftG.add(box(1.2, 1.2, 4, mat(0x6b7280), 0, 3, gd / 2 + 4));
  g.add(shaftG);
  const mcan = cyl(7.6, 25, can, gx / 2 + 12.5, gh / 2 + 0.2, 0, 32); mcan.rotation.z = Math.PI / 2; mcan.scale.set(1, 1, 1); g.add(mcan);
  const back = cyl(7.6, 4, mat(0x15181d), gx / 2 + 27, gh / 2 + 0.2, 0, 32); back.rotation.z = Math.PI / 2; g.add(back);
  const pins = {};
  [['t1', -3.2, 0xdc2626], ['t2', 3.2, 0x1f2937]].forEach(([id, z, col]) => {
    g.add(tube([[gx / 2 + 28, 9.6, z], [gx / 2 + 36, 6, z * 1.2], [gx / 2 + 46, 1.2, z * 1.6], [gx / 2 + 56, 0.8, z * 1.6]], 0.8, mat(col, { rough: 0.5 })));
    pins[id] = V(gx / 2 + 56, 0.8, z * 1.6);
  });
  return finish(g, { x: 80, y: gh + 0.4, z: gd + 18 }, pins, {
    update(s = {}) { shaftG.rotation.z = ((s.motorAngle ?? 0) * Math.PI) / 180; },
  });
}

function vibrationMotor() {
  const g = new THREE.Group();
  const disc = new THREE.Group();
  disc.add(cyl(5, 3.4, mat(0xaeb6c2, { rough: 0.35, metal: 0.85 }), 0, 0, 0, 36));
  disc.add(cyl(3.2, 0.5, mat(0x2b303a), 0, 1.9, 0, 24));
  disc.add(box(1, 0.2, 0.2, mat(0xe5e7eb), 0, 2.2, 0));
  disc.position.y = 1.7 + 6; g.add(disc);
  g.add(box(4, 1.6, 2.6, mat(0x15181d), 0, 6.9 - 4.3, 4.6));
  const pins = {};
  [['t1', -2, 0xdc2626], ['t2', 2, 0x1f2937]].forEach(([id, x, col]) => {
    g.add(tube([[x * 0.6, 7.5, 4.8], [x * 1.6, 5, 9], [x * 2.2, 1.5, 18], [x * 2.2, 0.8, 26]], 0.5, mat(col, { rough: 0.5 })));
    pins[id] = V(x * 2.2, 0.8, 26);
  });
  const home = disc.position.clone();
  return finish(g, { x: 10, y: 8.5, z: 30 }, pins, {
    update(s = {}) {
      const on = (s.motorAngle ?? 0) !== 0, t = performance.now() / 20;
      disc.position.set(home.x + (on ? Math.sin(t * 6) * 0.35 : 0), home.y, home.z + (on ? Math.cos(t * 5) * 0.35 : 0));
    },
  });
}

// ───────────────────────────── sensors ─────────────────────────────
function ultrasonic() {
  const g = new THREE.Group();
  const pcb = mat(0x1565c0, { rough: 0.5 }), st = steel();
  const y0 = 6, W = 45, H = 20;
  g.add(box(W, H, 1.2, pcb, 0, y0 + H / 2, 0));
  const mesh = mat(0x23282f, { rough: 0.7 });
  for (const x of [-12.5, 12.5]) {
    const can = cyl(8.1, 12.4, mat(0xb9c0cb, { rough: 0.3, metal: 0.85 }), x, y0 + H / 2, 7.4, 32); can.rotation.x = Math.PI / 2; g.add(can);
    const ring = cyl(7.2, 0.4, mat(0x8b93a1, { rough: 0.3, metal: 0.8 }), x, y0 + H / 2, 13.7, 32); ring.rotation.x = Math.PI / 2; g.add(ring);
    const face = cyl(6.2, 0.5, mesh, x, y0 + H / 2, 13.9, 32); face.rotation.x = Math.PI / 2; g.add(face);
    const hub = cyl(1.8, 0.6, mat(0x9aa3b1, { metal: 0.6 }), x, y0 + H / 2, 14.1, 20); hub.rotation.x = Math.PI / 2; g.add(hub);
  }
  const xt = cyl(1.8, 11, st, 0, y0 + H * 0.78, -3, 16); xt.rotation.z = Math.PI / 2; g.add(xt);
  g.add(box(6, 6, 1.6, mat(0x12151a), 0, y0 + 5, -1.3));
  g.add(box(10.2, 2.54, 2.54, mat(0x15181d), 0, y0 + 0.4, 0));
  const gd = gold(), pins = {};
  ['VCC', 'TRIG', 'ECHO', 'GND'].forEach((id, i) => {
    const x = -3.81 + i * 2.54;
    g.add(box(0.64, y0 + 1, 0.64, gd, x, (y0 + 1) / 2 - 0.2, 0));
    pins[id] = V(x, 0.6, 0);
  });
  return finish(g, { x: W, y: y0 + H, z: 14.4 }, pins);
}

function irSensor() {
  const g = new THREE.Group();
  const y0 = 6;
  g.add(box(31, 14, 1.4, mat(0x1d4ed8, { rough: 0.5 }), 0, y0 + 7, 0));
  const led = mat(0x111827, { emissive: 0x000000 });
  const clear = mat(0xdfe8f2, { rough: 0.15, transparent: true, opacity: 0.9 });
  const a = cyl(2.5, 6, led, -8, y0 + 7, 3.6, 24), b = cyl(2.5, 6, clear, -1, y0 + 7, 3.6, 24);
  a.rotation.x = Math.PI / 2; b.rotation.x = Math.PI / 2; g.add(a, b);
  g.add(box(9, 8, 5, mat(0x1e40af), 9, y0 + 8, 3));
  g.add(rotx(cyl(2.2, 1, mat(0x93c5fd, { metal: 0.6 }), 9, y0 + 8, 5.8, 20)));
  g.add(box(7.6, 2.54, 2.54, mat(0x15181d), 0, y0 + 0.4, 0));
  const gd = gold(), pins = {};
  ['VCC', 'GND', 'OUT'].forEach((id, i) => {
    const x = -2.54 + i * 2.54;
    g.add(box(0.64, y0 + 1, 0.64, gd, x, (y0 + 1) / 2 - 0.2, 0));
    pins[id] = V(x, 0.6, 0);
  });
  return finish(g, { x: 31, y: y0 + 14, z: 8 }, pins, { mats: { ir: led } });
}

function ldr() {
  const g = new THREE.Group();
  const st = steel();
  const top = cyl(2.6, 1.6, mat(0xf4f1e8, { rough: 0.5 }), 0, 6.4, 0, 32);
  g.add(top);
  g.add(decal(4.8, 4.8, canvasTexture(256, 256, (c, w, h) => { c.fillStyle = '#d8d3c5'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a4b12'; c.lineWidth = 14; c.beginPath(); for (let i = 0; i < 6; i++) { const y = 40 + i * 36; c.moveTo(30, y); c.lineTo(w - 30, y + (i % 2 ? 18 : -18)); } c.stroke(); }), 7.25));
  g.add(tube([[-1.27, 6, 0], [-1.27, 3, 0], [-1.27, 0.5, 0]], 0.28, st));
  g.add(tube([[1.27, 6, 0], [1.27, 3, 0], [1.27, 0.5, 0]], 0.28, st));
  return finish(g, { x: 5.2, y: 7.2, z: 5.2 }, { a: V(-1.27, 0.5, 0), b: V(1.27, 0.5, 0) });
}

function potentiometer() {
  const g = new THREE.Group();
  const y0 = 3;
  g.add(box(9.5, 5.5, 9.5, mat(0x2b62b3, { rough: 0.45 }), 0, y0 + 2.75, 0));
  g.add(cyl(3.3, 1.4, mat(0xd9ab2f, { rough: 0.3, metal: 0.85 }), 0, y0 + 6.1, 0, 28));
  const slot = new THREE.Group(); slot.position.y = y0 + 6.9;
  slot.add(box(5.4, 0.5, 1.1, mat(0x2d2306), 0, 0, 0));
  g.add(slot);
  const st = steel(), pins = {};
  ['VCC', 'WIPER', 'GND'].forEach((id, i) => {
    const x = (i - 1) * 2.54 * 2;
    g.add(tube([[x, y0, 4.2], [x, y0 - 1.5, 4.2], [x, 0.5, 4.2]], 0.3, st));
    pins[id] = V(x, 0.5, 4.2);
  });
  return finish(g, { x: 9.5, y: y0 + 7.4, z: 9.5 }, pins, {
    update(s = {}) { slot.rotation.y = -(((s.knob ?? 50) / 100) * 270 - 135) * (Math.PI / 180); },
  });
}

// ───────────────────────────── modules ─────────────────────────────
function lcd() {
  const g = new THREE.Group();
  const W = 80, D = 36;
  g.add(box(W, 1.6, D, mat(0x0b6b3a, { rough: 0.5 }), 0, 0.8 + 6, 0));
  g.add(box(71.2, 7, 24.2, mat(0x15181d), 0, 1.6 + 3.5 + 6, -1));
  g.add(box(64.5, 0.4, 14.5, mat(0x1d9c3a, { emissive: 0x0b3a14 }), 0, 1.6 + 7 + 6.2, -1));
  g.add(box(10, 2.54, 2.54, mat(0x15181d), -W / 2 + 6, 2.2, D / 2 - 1.6));
  const gd = gold(), pins = {};
  [['VCC', -2], ['GND', -1], ['SDA', 1], ['SCL', 2]].forEach(([id, k]) => {
    const x = k * 2.54 + (k > 0 ? 0 : 0) - W / 2 + 12;
    g.add(box(0.64, 7, 0.64, gd, x, 3.5, D / 2 - 1.6));
    pins[id] = V(x, 0.6, D / 2 - 1.6);
  });
  return finish(g, { x: W, y: 15, z: D }, pins);
}
function oled() {
  const g = new THREE.Group();
  const y0 = 6;
  g.add(box(27, 1.2, 27.3, mat(0x1b4fb8, { rough: 0.5 }), 0, y0 + 0.6, 0));
  g.add(box(25.7, 1.2, 14.7, mat(0x05070a, { rough: 0.15 }), 0, y0 + 1.8, -3));
  g.add(box(9.6, 2.54, 2.54, mat(0x15181d), 0, y0 + 0.6, 11.5));
  const gd = gold(), pins = {};
  ['GND', 'VCC', 'SCL', 'SDA'].forEach((id, i) => {
    const x = -3.81 + i * 2.54;
    g.add(box(0.64, y0 + 1, 0.64, gd, x, (y0 + 1) / 2 - 0.2, 11.5));
    pins[id] = V(x, 0.6, 11.5);
  });
  return finish(g, { x: 27, y: y0 + 3, z: 27.3 }, pins);
}
function motorDriver() {
  const g = new THREE.Group();
  const W = 43, D = 43, y0 = 5;
  g.add(box(W, 1.6, D, mat(0xb52222, { rough: 0.5 }), 0, y0 + 0.8, 0));
  g.add(box(15, 12, 20, mat(0x15181d, { rough: 0.5 }), 0, y0 + 1.6 + 6, -8));
  for (let i = 0; i < 6; i++) g.add(box(15, 12.4, 0.8, mat(0x2a2f38), 0, y0 + 1.6 + 6.2, -16 + i * 3.4));
  const gr = mat(0x1fa24a, { rough: 0.5 }), pins = {};
  [-14, 0, 14].forEach((x, i) => {
    g.add(box(10, 10, 8, gr, x, y0 + 1.6 + 5, D / 2 - 6));
    g.add(cyl(2.4, 0.6, steel(), x - 2.5, y0 + 1.6 + 10.2, D / 2 - 6, 18));
    g.add(cyl(2.4, 0.6, steel(), x + 2.5, y0 + 1.6 + 10.2, D / 2 - 6, 18));
    void i;
  });
  const top = y0 + 1.6 + 10.8;
  pins.OUT1 = V(-16.5, top, D / 2 - 6); pins.OUT2 = V(-11.5, top, D / 2 - 6);
  pins['12V'] = V(-2.5, top, D / 2 - 6); pins.GND = V(2.5, top, D / 2 - 6); pins['5V'] = V(11.5, top, D / 2 - 6);
  pins.OUT3 = V(11.5, top, D / 2 - 6); pins.OUT4 = V(16.5, top, D / 2 - 6);
  const gd = gold();
  g.add(box(2.54, 8.5, 25.4, mat(0x15181d), W / 2 - 4, y0 + 1.6 + 4.25, -2));
  ['ENA', 'IN1', 'IN2', 'IN3', 'IN4', 'ENB'].forEach((id, i) => {
    const z = -2 - 6.35 + (i + 0.5) * 2.54 * 1.6 - 1;
    g.add(box(0.64, 3, 0.64, gd, W / 2 - 4, y0 + 1.6 + 10, z));
    pins[id] = V(W / 2 - 4, y0 + 1.6 + 11.5, z);
  });
  return finish(g, { x: W, y: y0 + 14, z: D }, pins);
}
function mpu6050() {
  const g = new THREE.Group();
  const y0 = 6;
  g.add(box(21, 1.2, 16, mat(0x6d28d9, { rough: 0.5 }), 0, y0 + 0.6, 0));
  g.add(box(4, 1, 4, mat(0x15181d), 0, y0 + 1.7, -1));
  g.add(box(2.54 * 8, 2.54, 2.54, mat(0x15181d), 0, y0 + 0.6, 6));
  const gd = gold(), pins = {};
  ['VCC', 'GND', 'SCL', 'SDA'].forEach((id, i) => {
    const x = -7.6 + i * 2.54;
    g.add(box(0.64, y0 + 1, 0.64, gd, x, (y0 + 1) / 2 - 0.2, 6));
    pins[id] = V(x, 0.6, 6);
  });
  return finish(g, { x: 21, y: y0 + 2, z: 16 }, pins);
}

// ───────────────────────────── power ─────────────────────────────
function battery9v() {
  const g = new THREE.Group();
  const L = 48.5, Wd = 26.5, H = 17.5;
  g.add(box(Wd, H / 2, L, mat(0x14161a, { rough: 0.55 }), 0, H / 4, 0));
  g.add(box(Wd, H / 2, L, mat(0xcf8a3c, { rough: 0.35, metal: 0.55 }), 0, H * 0.75, 0));
  g.add(decal(Wd - 2, L - 6, canvasTexture(212, 388, (c, w, h) => {
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '800 96px system-ui, sans-serif'; c.fillText('9V', w / 2, h * 0.5);
    c.font = '600 24px system-ui, sans-serif'; c.fillText('BATTERY', w / 2, h * 0.62);
  }), H + 0.05));
  const st = steel();
  g.add(rotx(cyl(2.9, 1.6, st, 6.35, H / 2, -L / 2 - 0.8, 24)));
  const hex = cyl(4.2, 1.6, st, -6.35, H / 2, -L / 2 - 0.8, 6); hex.rotation.x = Math.PI / 2; g.add(hex);
  g.add(rotx(cyl(2.1, 0.4, mat(0x2a2f38), -6.35, H / 2, -L / 2 - 1.7, 6)));
  const pins = {};
  [['P', 6.35, 0xdc2626], ['N', -6.35, 0x14161a]].forEach(([id, x, col]) => {
    g.add(tube([[x, H / 2, -L / 2 - 1.6], [x * 1.2, H / 2 - 4, -L / 2 - 10], [x * 1.5, 2, -L / 2 - 24], [x * 1.6, 0.8, -L / 2 - 38]], 0.9, mat(col, { rough: 0.5 })));
    pins[id] = V(x * 1.6, 0.8, -L / 2 - 38);
  });
  return finish(g, { x: Wd, y: H, z: L + 40 }, pins);
}
function aaBattery() {
  const g = new THREE.Group();
  const L = 50.5, R = 7.25;
  const cell = cyl(R, L, mat(0x1fb5a8, { rough: 0.35, metal: 0.25 }), 0, R, 0, 36); cell.rotation.z = Math.PI / 2; g.add(cell);
  const wrap = canvasTexture(512, 128, (c, w, h) => {
    c.fillStyle = '#18a398'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = '800 70px system-ui, sans-serif'; c.textAlign = 'center'; c.fillText('AA  1.5V', w / 2, h * 0.68);
  });
  const lab = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.05, R + 0.05, L - 12, 36, 1, true), new THREE.MeshStandardMaterial({ map: wrap, roughness: 0.4 }));
  lab.rotation.z = Math.PI / 2; lab.position.set(0, R, 0); g.add(lab);
  g.add(rotz(cyl(2.6, 1.4, steel(), L / 2 + 0.7, R, 0, 20)));
  g.add(rotz(cyl(R, 1.6, steel(), -L / 2 - 0.8, R, 0, 36)));
  const pins = {};
  [['P', 1, 0xdc2626], ['N', -1, 0x14161a]].forEach(([id, s, col]) => {
    g.add(tube([[s * (L / 2 + 1.4), R, 0], [s * (L / 2 + 9), R * 0.5, s * 3], [s * (L / 2 + 20), 1.4, s * 6], [s * (L / 2 + 32), 0.8, s * 6]], 0.8, mat(col, { rough: 0.5 })));
    pins[id] = V(s * (L / 2 + 32), 0.8, s * 6);
  });
  return finish(g, { x: L + 66, y: R * 2, z: R * 2 + 14 }, pins);
}
function powerSupply() {
  const g = new THREE.Group();
  g.add(box(60, 28, 40, mat(0x1f2937, { rough: 0.5 }), 0, 14, 0));
  g.add(decal(40, 16, canvasTexture(400, 160, (c, w, h) => { c.fillStyle = '#e5e7eb'; c.font = '700 70px system-ui, sans-serif'; c.textAlign = 'center'; c.fillText('5V 2A', w / 2, h * 0.65); }), 28.1));
  const pins = { V: V(-20, 28, 21), G: V(20, 28, 21) };
  g.add(cyl(3, 6, mat(0xdc2626), -20, 31, 21, 16)); g.add(cyl(3, 6, mat(0x14161a), 20, 31, 21, 16));
  return finish(g, { x: 60, y: 34, z: 40 }, pins);
}

function fallback(def) {
  const g = new THREE.Group();
  g.add(box(30, 10, 20, mat(0x475569), 0, 5, 0));
  const pins = {};
  (def?.pins || []).forEach((p, i, a) => { pins[p.id] = V(-15 + (30 * (i + 1)) / (a.length + 1), 10, 10); });
  return finish(g, { x: 30, y: 10, z: 20 }, pins);
}

const BUILDERS = {
  arduino_uno: arduinoUno, arduino_nano: arduinoNano, esp32, breadboard,
  led: () => ledPart(0xe23a3a), rgb_led: rgbLed, resistor, push_button: pushButton, buzzer, servo, dc_motor: dcMotor,
  gear_motor: gearMotor, vibration_motor: vibrationMotor, ultrasonic, ir_sensor: irSensor, ldr, potentiometer,
  lcd, oled, motor_driver: motorDriver, mpu6050, battery: battery9v, aa_battery: aaBattery, power_supply: powerSupply,
};

/** Does this part type have a dedicated 3-D model? */
export const has3D = (type) => type in BUILDERS;

/** Build a part. `def` (the lab catalogue entry) is only used by the plain fallback box. */
export function buildPart3D(type, def) {
  const make = BUILDERS[type];
  return make ? make() : fallback(def);
}

/** Free the geometry and materials of a part (or any group). */
export function disposeGroup(group) {
  group.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    const m = o.material;
    (Array.isArray(m) ? m : m ? [m] : []).forEach(x => { x.map?.dispose(); x.dispose(); });
  });
}
